import * as React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import { ParsedUrlQuery } from 'querystring'
import Skeleton from 'react-loading-skeleton'
import UserContext from 'helpers/UserContext'
import Collapse from '@kunukn/react-collapse'

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
import { UserReaction } from 'helpers/UserInteractions'

const IMAGE = require('images/food/fish-placeholder.jpg')
const TIME = require('images/icons/alarm-clock.svg')
const SERVINGS = require('images/icons/hot-food.svg')
const PROFILE = require('images/chef-rj.svg')
const YUM_BW = require('images/icons/yummy_bw.svg')
const SAVE_BW = require('images/icons/cookbook_bw.svg')
const YUM_COLOR = require('images/icons/yummy_color.svg')
const SAVE_COLOR = require('images/icons/cookbook_color.svg')
const INGREDIENTS = require('images/icons/shopping-bag.svg')

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
    <div className="my-2 p-2  grid grid-cols-2 gap-4 items-center">
      <span className="text-lg capitalize">
        {ingredient.ingredientInfo.name}
      </span>
      <div className="grid grid-rows-2 text-center">
        <span className="text-lg">{toMixedNumber(ingredient.quantity)}</span>
        <span className="text-sm">{ingredient.unit.name}</span>
      </div>
    </div>
  )
}

const Step: React.FC<StepProps> = ({ step, activeStep, updateActiveStep }) => {
  const { stepTitle, ingredients, additionalInfo, stepNum } = step || {}

  return (
    <React.Fragment>
      {/* {stepNum !== activeStep ? ( */}
      <Collapse
        isOpen={stepNum !== activeStep}
        transition={`height 500ms cubic-bezier(.4, 0, .2, 1)`}
      >
        <div
          className="hover:scale-95 transform ease-in duration-200 w-full my-2 cursor-pointer "
          onClick={() => updateActiveStep(stepNum)}
        >
          <div className="grid grid-cols-12 border-black border border-b-2 text-xl p4 rounded-lg ">
            <span className="bg-black  flex col-span-2 text-2xl h-full w-full text-white m-auto rounded rounded-r-none border-black border-b-2  ">
              <span className="m-auto">{stepNum + 1}</span>
            </span>
            <span className="col-span-10 bg-white my-auto p-4 rounded m-1">
              {stepTitle}
            </span>
          </div>
        </div>
      </Collapse>
      {/* ) : ( */}
      <Collapse
        isOpen={stepNum === activeStep}
        transition={`height 1000ms cubic-bezier(.4, 0, .2, 1)`}
      >
        <div className="w-full my-2">
          <div className=" grid items-center p-2 w-full h-full m-auto">
            <img className="p-4  m-auto" src={IMAGE} />
          </div>
          <div className="grid grid-rows-2 col-span-2">
            <span
              className="text-4xl cursor-pointer"
              onClick={() => updateActiveStep()}
            >
              Step {stepNum + 1}:
            </span>
            <div>{stepTitle}</div>
          </div>
          <div className="border-gray-600 border rounded">
            {ingredients.map((ing) => (
              <Ingredient ingredient={ing} />
            ))}
          </div>
          <div className="w-full h-full text-xl rounded p-2 my-4">
            {additionalInfo}
          </div>
        </div>
      </Collapse>
      {/* )} */}
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
    reactionCount,
    commentCount,
    haveISaved,
    myReaction,
  } = recipe.result || {}
  const { username } = by || {}

  const [onOwnRecipe, setOnOwnRecipe] = React.useState(false)
  const [activeStep, setActiveStep] = React.useState(-1)
  const { currentUserInfo } = React.useContext(UserContext)
  const [commentsOpen, setCommentsOpen] = React.useState(false)
  const [reaction, setReaction] = React.useState(myReaction)
  const [saved, setSaved] = React.useState(haveISaved)
  if (
    currentUserInfo &&
    !onOwnRecipe &&
    currentUserInfo.me.username == username
  ) {
    setOnOwnRecipe(true)
  }

  console.log(recipe)
  const updateActiveStep = (stepNum?: number) => {
    stepNum = stepNum !== undefined && stepNum >= 0 ? stepNum : -1
    setActiveStep(stepNum)
  }

  const handleSave = () => {
    setSaved(!saved)
  }

  const handleReaction = () => {
    setReaction(reaction === 0 ? null : 0)

    // UserReaction({
    //   reactableType: 'Comment',
    //   reactableId: id,
    //   reactionType: reaction,
    // })
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
      <div className="max-w-xl lg:my-8 mx-auto font-mono">
        <div className=" mx-auto mt-1 p-6 bg-white rounded-lg shadow-xl border-black border">
          <div className="m-2 mb-8 ">
            <div
              className=" bg-transparent cursor-pointer w-full text-3xl lg:text-5xl text-gray-700  py-1 leading-tight focus:outline-none  border-b-2 border-black"
              onClick={() => updateActiveStep()}
            >
              {title}
            </div>
            <div className="mt-3 w-full flex align-middle">
              <Link href="/[username]" as={`/${username}`}>
                <a className="flex align-middle w-full">
                  <img
                    src={PROFILE}
                    className="h-8 cursor-pointer rounded-full"
                  />
                  <span className="self-center ml-2 text-sm">
                    {username || <Skeleton width={40} />}
                  </span>
                </a>
              </Link>
              {onOwnRecipe ? (
                <div className="">
                  <Link
                    href="/[username]/[recipehandle]/edit"
                    as={`/${username}/${handle}/edit`}
                  >
                    <a className="w-28 m-auto btn text-sm font-normal">Edit</a>
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
          <Collapse
            isOpen={activeStep < 0}
            transition={`height 500ms cubic-bezier(.4, 0, .2, 1)`}
          >
            <div key="overview">
              <div className=" grid items-center p-2 w-full h-full  m-auto">
                <img className="m-auto" src={IMAGE} />
              </div>
              <div className=" w-full my-4 h-full rounded ">
                <div className="h-full w-full text-xl text-gray-700 p-4 ">
                  {description}
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="grid grid-rows-2 p-2 rounded text-center text-xs ">
                  <img src={TIME} className="h-8 m-auto rounded" />
                  <div className="w-full text-center grid grid-cols-2 justify-center p-1 rounded">
                    <div className="text-xl w-full m-auto border border-black text-center col-span-2 grid grid-cols-2 rounded">
                      <span className="text-right">
                        {minutesToTime(recipeTime).hours || '0'}:
                      </span>
                      <span className="text-left">
                        {minutesToTime(recipeTime).minutes || '0'}
                      </span>
                    </div>
                    {/* <span className="text-xs">Hour</span>
                    <span className="text-xs">Minutes</span> */}
                  </div>
                </div>
                <div className="grid  grid-rows-2 p-2 rounded text-center text-xs ">
                  <img src={SERVINGS} className="h-8 m-auto rounded" />
                  <div className="w-full text-center justify-center rounded p-1">
                    <div className="text-xl w-full m-auto border border-black text-center  rounded">
                      {servings}
                    </div>
                    {/* Servings */}
                  </div>
                </div>
              </div>
              <div className="border-black border rounded  my-2">
                {ingredients.map((ing: IngredientType) => (
                  <Ingredient
                    key={`${ing.ingredientInfo.name}${ing.quantity}`}
                    ingredient={ing}
                  />
                ))}
              </div>
            </div>
          </Collapse>
          <div className="my-4">
            {steps.map((step) => (
              <Step
                key={step.stepNum}
                step={step}
                activeStep={activeStep}
                updateActiveStep={updateActiveStep}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 items-center">
            <div
              className={
                (!!commentsOpen ? 'opacity-100' : '') +
                ' cursor-pointer text-2xl  opacity-25'
              }
              onClick={() => setCommentsOpen(!commentsOpen)}
            >
              Comments
            </div>
            <div className="flex justify-end  ">
              <img
                className="h-8 mr-4 my-2 cursor-pointer"
                src={!!saved ? SAVE_COLOR : SAVE_BW}
                onClick={handleSave}
              />
              <img
                className="h-8 ml-4 my-2 cursor-pointer"
                src={reaction != null ? YUM_COLOR : YUM_BW}
                onClick={handleReaction}
              />
            </div>
          </div>
          <Collapse
            isOpen={commentsOpen}
            transition={`height 500ms cubic-bezier(.4, 0, .2, 1)`}
          >
            {username && handle && (
              <RecipeComments
                id={id}
                username={username}
                handle={handle}
                className="rounded p-2"
              />
            )}
          </Collapse>
        </div>
      </div>
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
        if (res.errors) {
          throw res.errors
        }
        return res.data
      })
    return { props: { recipe: data } }
  } catch (err) {
    console.log('err', err)
    // handle error - probably put honeybadger here or something
    return { props: { recipe: null } }
  }
}

export default RecipePage
