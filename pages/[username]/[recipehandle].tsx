import * as React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { NextPage } from 'next'
import { GetStaticProps, GetStaticPaths } from 'next'
import { ParsedUrlQuery } from 'querystring'
import Skeleton from 'react-loading-skeleton'
import UserContext from 'helpers/UserContext'

import {
  RecipeType,
  RecipeStepType,
  RECIPE_BY_USERNAME_AND_HANDLE,
} from 'requests/recipes'
import { toMixedNumber } from 'helpers/methods'
import client from 'requests/client'

interface RecipeProps {
  recipe: RecipeType
}

interface StepProps {
  step?: RecipeStepType
}
const Step: React.FC<StepProps> = ({ step }) => {
  const { stepNum, stepTime, description, ingredients } = step || {}
  return (
    <li className="my-5">
      <h3 className="header-2-text">
        Step {stepNum || <Skeleton width={40} />}
      </h3>
      <span className="block text-sm">
        About {stepTime || <Skeleton width={40} />} minutes
      </span>
      <div>
        <h3 className="header-3-text">Ingredients</h3>
        <ul className="p-1 pl-2">
          {ingredients ? (
            ingredients.length > 0 ? (
              ingredients.map((ingredient) => {
                return (
                  <li key={ingredient.ingredientInfo.name} className="pb-2">
                    <span className="block">
                      <span>{toMixedNumber(ingredient.quantity)} </span>
                      <span>{ingredient.unit.name} </span>
                      <span>{ingredient.ingredientInfo.name}</span>
                    </span>
                  </li>
                )
              })
            ) : (
              <span className="text-sm">No ingredients!</span>
            )
          ) : (
            <Skeleton />
          )}
        </ul>
      </div>
      <h3 className="header-3-text">Instructions</h3>
      <p>{description || <Skeleton count={5} />}</p>
    </li>
  )
}

const RecipePage: NextPage<RecipeProps> = (props) => {
  const { recipe } = props
  const { by, description, handle, id, steps, servings, title, ingredients } =
    recipe?.result || {}
  const { username } = by || {}

  const [onOwnRecipe, setOnOwnRecipe] = React.useState(false)
  const { isLoggedIn, currentUserInfo } = React.useContext(UserContext)
  if (
    isLoggedIn &&
    currentUserInfo &&
    !onOwnRecipe &&
    currentUserInfo.me.username == username
  ) {
    setOnOwnRecipe(true)
  }

  const pageTitle = `${title || 'a recipe'}, by ${
    by ? by.username : 'rj'
  } - RecipeJoiner`
  const pageDescription = description
  return (
    <React.Fragment>
      {recipe && (
        <Head>
          {/* Give the title a key so that it's not duplicated - this allows me to change the page title on other pages */}
          <title key="title">{pageTitle}</title>
          <meta charSet="utf-8" />
          <meta key="description" name="description" content={description} />
          {/* OpenGraph tags */}
          <meta
            key="og:url"
            property="og:url"
            content={`${process.env.NEXT_PUBLIC_BASE_URL}/users/${username}/${handle}`}
          />
          <meta key="og:title" property="og:title" content={pageTitle} />
          <meta
            key="og:description"
            property="og:description"
            content={pageDescription}
          />
          {/* OpenGraph tags end */}
        </Head>
      )}
      <div className="p-2 max-w-3xl m-auto">
        <h1 className="header-text text-center mt-5">
          {title || <Skeleton />}
        </h1>
        {onOwnRecipe ? (
          <div className="m-2">
            <Link
              href="/[username]/[recipehandle]/edit"
              as={`/${username}/${handle}/edit`}
            >
              <a className="block w-24 m-auto font-bold text-center text-sm p-1 bg-gray-200 rounded border">
                Edit Recipe
              </a>
            </Link>
          </div>
        ) : null}
        <Link href="/[username]" as={`/${username || 'ari'}`}>
          <a className="block text-center text-sm px-2 pb-2">
            by chef {username ? username : <Skeleton width={20} />}
          </a>
        </Link>
        <span className="block text-justify leading-snug text-sm">
          {description || <Skeleton />}
        </span>
        <div className="text-sm py-2 text-center">
          <span className="font-bold">Serving Size </span>
          <span>{servings}</span>
        </div>
        <div>
          <h3 className="header-2-text">All Ingredients</h3>
          <ul className="p-1 pl-2">
            {ingredients ? (
              ingredients.length > 0 ? (
                ingredients.map((ingredient) => {
                  return (
                    <li key={ingredient.ingredientInfo.name} className="pb-2">
                      <span className="block">
                        <span>{toMixedNumber(ingredient.quantity)} </span>
                        <span>{ingredient.unit.name} </span>
                        <span>{ingredient.ingredientInfo.name}</span>
                      </span>
                    </li>
                  )
                })
              ) : (
                <span className="text-sm">No ingredients!</span>
              )
            ) : (
              <Skeleton />
            )}
          </ul>
        </div>
        <div>
          <ul>
            {steps
              ? steps.map((step) => <Step step={step} key={step.stepNum} />)
              : [1, 2].map((num) => <Step key={num} />)}
          </ul>
        </div>
      </div>
    </React.Fragment>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  type Path = { params: ParsedUrlQuery }
  // type RecipeInfo = {
  // 	cursor: string;
  // 	node: {
  // 		handle: string;
  // 		updatedAt: string;
  // 	}
  // }
  var paths: Array<Path> = []

  // const recipeInfo: Array<RecipeInfo> = await getRecipesInfo() // todo

  // recipeInfo.map((recipeInfo) => {
  //   paths.push({
  //     params: { username: recipeInfo.node.by.username, recipehandle: recipeInfo.node.handle },
  //   });
  // });
  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
  try {
    const { params } = ctx

    const username = params?.username
    const recipehandle = params?.recipehandle

    const token = process.env.NEXT_PUBLIC_RJ_API_TOKEN || ''

    const data: RecipeType = await client
      .query({
        query: RECIPE_BY_USERNAME_AND_HANDLE,
        variables: {
          username: username,
          handle: recipehandle,
        },
        context: {
          // example of setting the headers with context per operation
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      })
      .then((res) => {
        return res.data
      })

    return { props: { recipe: data } }
  } catch (err) {
    // handle error - probably put honeybadger here or something
    return { props: {} }
  }
}

export default RecipePage
