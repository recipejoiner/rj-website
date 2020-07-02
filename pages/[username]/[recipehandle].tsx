import * as React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import { ParsedUrlQuery } from 'querystring'
import Skeleton from 'react-loading-skeleton'
import UserContext from 'helpers/UserContext'

import {
  RecipeType,
  RecipeStepType,
  RECIPE_BY_USERNAME_AND_HANDLE,
  IngredientType,
} from 'requests/recipes'
import { toMixedNumber } from 'helpers/methods'
import client from 'requests/client'
import RecipeComments from 'components/comments/RecipeComments'
import { getToken } from 'helpers/auth'

const IMAGE = require('../../images/icons/add.svg')
const TIME = require('../../images/icons/alarm-clock.svg')
const SERVINGS = require('../../images/icons/hot-food.svg')
const PROFILE = require('../../images/chef-rj.svg')

const minutesToTime = (totalMinutes: number) => {
  return { hours: Math.floor(totalMinutes / 60), minutes: totalMinutes % 60 }
}

interface RecipeProps {
  recipe: RecipeType
}

interface StepProps {
  step: RecipeStepType
  activeStep: number
  updateActiveStep: (stepNum?: number) => void
}

const Ingredient: React.FC<{ ingredient: IngredientType }> = ({
  ingredient,
}) => {
  return (
    <div className="grid grid-cols-6">
      <span className="col-span-3 border-black border-b-2">
        {ingredient.ingredientInfo.name}
      </span>
      <span className="">{ingredient.quantity}</span>
      <span className="col-span-2">{ingredient.unit.name}</span>
    </div>
  )
}

const Step: React.FC<StepProps> = ({ step, activeStep, updateActiveStep }) => {
  const { stepTitle, ingredients, additionalInfo, stepNum } = step || {}

  return (
    <React.Fragment>
      {stepNum !== activeStep ? (
        <div
          className="hover:scale-95 transform ease-in duration-200 w-full my-2 cursor-pointer "
          onClick={() => updateActiveStep(stepNum)}
        >
          <div className="grid grid-cols-5 border-black border border-b-2 text-xl p-4 rounded-lg ">
            <span className=" text-2xl  text-center m-auto border-black border-b-2">
              {stepNum + 1}
            </span>
            <span className="col-span-4 bg-white  rounded m-1">
              {stepTitle}
            </span>
          </div>
        </div>
      ) : (
        <div className="w-full my-2">
          <div className="grid grid-rows-2 col-span-2">
            <span className="text-4xl" onClick={() => updateActiveStep()}>
              Step {stepNum + 1}:
            </span>
            <div>{stepTitle}</div>
          </div>
          <div>
            {ingredients.map((ing) => (
              <Ingredient ingredient={ing} />
            ))}
          </div>
          <div className="w-full h-full border-black border rounded p-2">
            {additionalInfo}
          </div>
        </div>
      )}
    </React.Fragment>
  )
}

const RecipePage: NextPage<RecipeProps> = ({ recipe }) => {
  const {
    by,
    description,
    handle,
    id,
    steps,
    servings,
    title,
    recipeTime,
    ingredients,
  } = recipe.result || {}
  const { username } = by || {}

  const [onOwnRecipe, setOnOwnRecipe] = React.useState(false)
  const [activeStep, setActiveStep] = React.useState(-1)
  const { currentUserInfo } = React.useContext(UserContext)
  if (
    currentUserInfo &&
    !onOwnRecipe &&
    currentUserInfo.me.username == username
  ) {
    setOnOwnRecipe(true)
  }

  const updateActiveStep = (stepNum?: number) => {
    setActiveStep(stepNum || -1)
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
      <div className="w-screen h-120 text-center table">
        <span className="table-cell align-middle bg-gray-100">
          Recipe goes here
        </span>
      </div>
      {username && handle && (
        <RecipeComments id={id} username={username} handle={handle} />
      )}
    </React.Fragment>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const { params } = ctx

    const username = params?.username
    const recipehandle = params?.recipehandle

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
            authorization: `Bearer ${getToken(ctx)}`,
          },
        },
      })
      .then((res) => {
        return res.data
      })

    return { props: { recipe: data } }
  } catch (err) {
    // handle error - probably put honeybadger here or something
    return { props: { recipe: null } }
  }
}

export default RecipePage
