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
import { act } from 'react-dom/test-utils'

const IMAGE_PLACEHOLDER = require('images/icons/picture.svg')
const TIME = require('images/icons/alarm-clock.svg')
const SERVINGS = require('images/icons/hot-food.svg')
const PROFILE = require('images/chef-rj.svg')
const YUM_BW = require('images/icons/yummy_bw.svg')
const SAVE_BW = require('images/icons/cookbook_bw.svg')
const YUM_COLOR = require('images/icons/yummy_color.svg')
const SAVE_COLOR = require('images/icons/cookbook_color.svg')
const INGREDIENTS = require('images/icons/basket.svg')
const COMMENTS_BW = require('images/icons/comment_bw.svg')
const COMMENTS_WB = require('images/icons/comment_wb.svg')
const RIGHT_ARROW = require('images/icons/right-arrow.svg')
const CLOSE = require('images/icons/cancel.svg')

const minutesToTime = (totalMinutes: number) => {
  return { hours: Math.floor(totalMinutes / 60), minutes: totalMinutes % 60 }
}

interface RecipeProps {
  recipe: RecipeType
}

interface StepProps {
  step: RecipeStepType
  recipeImg: string
  updateActiveStep: (stepNum?: number) => void
}

const Ingredient: React.FC<{ ingredient: IngredientType }> = ({
  ingredient,
}) => {
  return (
    <div className=" h-auto items-center text-center  grid grid-cols-2 ">
      <span className=" font-black text-lg capitalize text-left">
        {ingredient.ingredientInfo.name}
      </span>
      <div className="grid grid-rows-2 text-center ">
        <span className="text-md">{toMixedNumber(ingredient.quantity)}</span>
        <span className="text-sm">{ingredient.unit.name}</span>
      </div>
    </div>
  )
}

const Step: React.FC<StepProps> = ({ step, recipeImg, updateActiveStep }) => {
  const [imageOpen, setImageOpen] = React.useState(false)

  const { ingredients, additionalInfo, imageUrl, stepTitle, stepNum } =
    step || {}
  let image = imageUrl != null ? imageUrl : recipeImg

  return (
    <React.Fragment>
      <div className=" grid grid-cols-4 mr-8 ">
        <div className="m-auto rounded">
          <img
            className="m-auto rounded w-full  "
            src={image}
            onClick={() => setImageOpen(!imageOpen)}
          />
        </div>
        <span className="text-2xl md:text-5xl leading-tight focus:outline-none font-bold col-span-3 ml-2 my-auto">
          {stepTitle}
        </span>
      </div>
      {!imageOpen && ingredients.length > 0 ? (
        <div className="my-2 self-end mr-8 ">
          <div
            className={`${
              ingredients.length <= 0 ? 'border-none' : 'border'
            }  rounded overflow-hidden border-black border rounded-l-none border-l-0 m-l-0`}
            onClick={() => setImageOpen(!imageOpen)}
          >
            {ingredients.map((ing) => (
              <Ingredient ingredient={ing} />
            ))}
          </div>
        </div>
      ) : (
        <div
          className=" bg-cover rounded mr-8 mt-8"
          style={{
            backgroundImage: `url(${image}
          )`,
          }}
          onClick={() => setImageOpen(!imageOpen)}
        ></div>
      )}
      <div className="relative w-full overflow-hidden text-xl md:text-3xl mb-2">
        <div className="absolute grid grid-cols-2 left-0 right-0 h-full">
          <div
            onClick={() => updateActiveStep(stepNum > 0 ? stepNum - 1 : 0)}
          ></div>
          <div onClick={() => updateActiveStep(stepNum + 1)}></div>
        </div>
        {additionalInfo}
      </div>
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
    imageUrl,
  } = recipe.result || {}
  const { username, profileImageUrl } = by || {}

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

  const updateActiveStep = (stepNum?: number) => {
    if (stepNum === undefined) stepNum = -1
    stepNum < steps.length && stepNum >= -1 ? setActiveStep(stepNum) : null
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
      {activeStep < 0 ? (
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
                      src={profileImageUrl ? profileImageUrl : PROFILE}
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
                      <a className="w-28 m-auto btn text-sm font-normal">
                        Edit
                      </a>
                    </Link>
                  </div>
                ) : null}
              </div>
            </div>

            <div key="overview">
              <div className=" grid items-center  w-full h-full  m-auto">
                <img
                  className="m-auto"
                  src={imageUrl ? imageUrl : IMAGE_PLACEHOLDER}
                />
              </div>
              <div className=" w-full h-full rounded ">
                <div className="h-full text-xl text-gray-700 m-2 ">
                  {description}
                </div>
              </div>
              <div className="grid grid-cols-2 w-10/12 m-auto">
                <div className="grid grid-rows-2 p-2  rounded text-center text-xs ">
                  <img src={TIME} className="h-6 m-auto rounded" />
                  <div className="w-full m-auto text-center grid grid-cols-2 justify-center rounded">
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
                  <div className="w-full m-auto text-center justify-center rounded ">
                    <div className="text-xl w-full m-auto border border-black text-center p-2 rounded">
                      {servings}
                    </div>
                    {/* Servings */}
                  </div>
                </div>
              </div>
              <img src={INGREDIENTS} className="h-6 m-auto rounded mt-6" />

              <div
                className={`${
                  ingredients.length <= 0 ? 'border-none' : 'border'
                } rounded w-11/12 m-auto my-4 border-black  p-2`}
              >
                {ingredients.map((ing: IngredientType) => (
                  <Ingredient
                    key={`${ing.ingredientInfo.name}${ing.quantity}`}
                    ingredient={ing}
                  />
                ))}
              </div>
            </div>
            <div className="m-2">
              {steps.map((step) => (
                <div>
                  <div
                    className="hover:scale-95 transform ease-in duration-200 w-full my-2 cursor-pointer "
                    onClick={() => updateActiveStep(step.stepNum)}
                  >
                    <div className="grid grid-cols-12  border-b-2 text-l rounded  ">
                      <span className="bg-black  flex col-span-2 text-2xl h-full w-full text-white m-auto rounded rounded-r-none border-black border-b-2  ">
                        <span className="m-auto">{step.stepNum + 1}</span>
                      </span>
                      <span className="col-span-10 bg-white my-auto p-4 rounded m-1">
                        {step.stepTitle}
                      </span>
                    </div>
                  </div>
                </div>
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
      ) : (
        <div className="fixed top-0 bottom-0 z-100 bg-white font-mono whitespace-normal w-screen">
          <div
            className="absolute h-full w-full opacity-25 bg-cover "
            style={{
              backgroundImage: `url(${
                steps[activeStep].imageUrl !== null
                  ? steps[activeStep].imageUrl
                  : imageUrl
              })`,
            }}
          >
            <div className="w-full h-full backdrop-blurMax"></div>
          </div>

          <div className="absolute left-0 top-0 bottom-0 right-0 max-w-3xl m-auto h-full shadow-lg ">
            <div className="z-100 absolute top-0 right-0 h-1/2 ">
              <div className="grid  justify-end">
                <img
                  className=" p-2 w-10 "
                  style={{ justifySelf: 'end' }}
                  onClick={() => updateActiveStep()}
                  src={CLOSE}
                ></img>
                {steps.map((step) => {
                  return (
                    <div
                      className={`${
                        step.stepNum === activeStep ? '' : 'opacity-25'
                      }   rounded text-center lg:text-2xl`}
                      onClick={() => updateActiveStep(step.stepNum)}
                    >
                      {step.stepNum + 1}
                    </div>
                  )
                })}
              </div>
            </div>
            <div className="grid grid-rows-cook h-full overflow-hidden p-2 absolute">
              <Step
                step={steps[activeStep]}
                recipeImg={imageUrl || IMAGE_PLACEHOLDER}
                updateActiveStep={updateActiveStep}
              />
            </div>
          </div>
        </div>
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
