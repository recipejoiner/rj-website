import * as React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import { ParsedUrlQuery } from 'querystring'
import Skeleton from 'react-loading-skeleton'
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
import { setYumHandler, setRecipeSavedHandler } from 'helpers/user-interactions'
import UserContext from 'helpers/UserContext'

const IMAGE = require('images/food/fish-placeholder.jpg')
const TIME = require('images/icons/alarm-clock.svg')
const SERVINGS = require('images/icons/hot-food.svg')
const PROFILE = require('images/chef-rj.svg')
const YUM_BW = require('images/icons/yummy_bw.svg')
const SAVE_BW = require('images/icons/cookbook_bw.svg')
const YUM_COLOR = require('images/icons/yummy_color.svg')
const SAVE_COLOR = require('images/icons/cookbook_color.svg')
const INGREDIENTS = require('images/icons/shopping-bag.svg')
const COMMENTS_BW = require('images/icons/comment_bw.svg')
const COMMENTS_WB = require('images/icons/comment_wb.svg')

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
          <div className="grid grid-cols-12  border-b-2 text-l rounded  ">
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
        <div className="w-full">
          <div
            className=" w-full my-2 cursor-pointer "
            onClick={() => updateActiveStep()}
          >
            <div
              id={`step-${stepNum}`}
              className="grid grid-cols-12  border-b-2 text-xl  rounded-lg "
            >
              <span className="bg-black  flex col-span-2 text-2xl h-full w-full text-white m-auto rounded rounded-r-none border-black border-b-2  ">
                <span className="m-auto">{stepNum + 1}</span>
              </span>
              <span className="col-span-10 bg-white my-auto p-4 rounded m-1">
                {stepTitle}
              </span>
            </div>
          </div>
          <div className=" grid items-center w-full h-full m-auto">
            <img className=" m-auto" src={IMAGE} />
          </div>
          <div className="border border-black rounded my-2">
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
  const { currentUserInfo, modalOpen, setModalState } = React.useContext(
    UserContext
  )
  const [commentsOpen, setCommentsOpen] = React.useState(false)
  const [recipeReaction, setRecipeReaction] = React.useState(myReaction)
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
    stepNum >= 0
      ? document.getElementById(`step-${stepNum}`)?.scrollIntoView()
      : null
  }

  const handleSave = () => {
    setRecipeSavedHandler(id, saved, setSaved)
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
      <div className="max-w-3xl lg:my-8 mx-auto font-mono">
        <div className=" mx-auto mt-6 bg-white rounded-lg shadow-xl ">
          <div className="m-2 ">
            <div
              className=" bg-transparent cursor-pointer w-full text-3xl lg:text-5xl  leading-tight focus:outline-none font-bold"
              onClick={() => updateActiveStep()}
            >
              {title}
            </div>
            <div className=" w-full flex align-middle">
              <Link href="/[username]" as={`/${username}`}>
                <a className="flex align-middle w-full">
                  <img
                    src={PROFILE}
                    className="h-6 cursor-pointer rounded-full"
                  />
                  <span className="self-center ml-2 text-xs">
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
              <div className=" grid items-center  w-full h-full  m-auto">
                <img className="m-auto" src={IMAGE} />
              </div>
              <div className=" w-full h-full rounded ">
                <div className="h-full text-xl text-gray-700 m-2 ">
                  {description}
                </div>
              </div>
              <div className="grid grid-cols-2">
                <div className="grid grid-rows-2 p-2  rounded text-center text-xs ">
                  <img src={TIME} className="h-6 m-auto rounded" />
                  <div className="w-8/12 m-auto text-center grid grid-cols-2 justify-center rounded">
                    <div className="text-xl w-full m-auto border border-black text-center col-span-2 grid p-2 grid-cols-2 rounded">
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
                  <img src={SERVINGS} className="h-6 m-auto rounded" />
                  <div className="w-8/12 m-auto text-center justify-center rounded ">
                    <div className="text-xl w-full m-auto border border-black text-center p-2 rounded">
                      {servings}
                    </div>
                    {/* Servings */}
                  </div>
                </div>
              </div>
              <div className=" border border-black rounded m-2">
                {ingredients.map((ing: IngredientType) => (
                  <Ingredient
                    key={`${ing.ingredientInfo.name}${ing.quantity}`}
                    ingredient={ing}
                  />
                ))}
              </div>
            </div>
          </Collapse>
          <div className="m-2">
            {steps.map((step) => (
              <Step
                key={step.stepNum}
                step={step}
                activeStep={activeStep}
                updateActiveStep={updateActiveStep}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 m-2 items-center">
            <img
              className="h-8 m-2 cursor-pointer"
              src={!!commentsOpen ? COMMENTS_BW : COMMENTS_WB}
              onClick={() => setCommentsOpen(!commentsOpen)}
            />
            <div className="flex justify-end  ">
              <img
                className="h-8 m-2 cursor-pointer"
                src={!!saved ? SAVE_COLOR : SAVE_BW}
                onClick={handleSave}
              />
              <img
                className="h-8 m-2 cursor-pointer"
                src={recipeReaction != null ? YUM_COLOR : YUM_BW}
                onClick={() =>
                  setYumHandler(
                    currentUserInfo,
                    id,
                    recipeReaction,
                    setRecipeReaction
                  )
                }
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
