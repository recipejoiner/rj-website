import * as React from 'react'
import Head from 'next/head'
import Link from 'next/link'
import { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import { ParsedUrlQuery } from 'querystring'
import Skeleton from 'react-loading-skeleton'
import Collapse from '@kunukn/react-collapse'
import Lightbox from 'react-image-lightbox'
import 'react-image-lightbox/style.css'
import {
  EmailShareButton,
  FacebookShareButton,
  PinterestShareButton,
  RedditShareButton,
  TwitterShareButton,
  WhatsappShareButton,
} from 'react-share'
import {
  EmailIcon,
  FacebookIcon,
  PinterestIcon,
  RedditIcon,
  TwitterIcon,
  WhatsappIcon,
} from 'react-share'
import CopyToClipboard from 'react-copy-to-clipboard'
import {
  RecipeType,
  RecipeStepType,
  RECIPE_BY_USERNAME_AND_HANDLE,
  IngredientType,
} from 'requests/recipes'
import { toMixedNumber, minutesToTime, redirectTo } from 'helpers/methods'
import client from 'requests/client'
import RecipeComments from 'components/comments/RecipeComments'
import { getToken } from 'helpers/auth'
import { setYumHandler, setRecipeSavedHandler } from 'helpers/user-interactions'
import UserContext from 'helpers/UserContext'
import { act } from 'react-dom/test-utils'
import ScreenContext from 'helpers/ScreenContext'
import { ReactionType } from 'requests/reactions'

const IMAGE_PLACEHOLDER = require('images/icons/picture.svg')
const TIME = require('images/icons/alarm-clock.svg')
const SERVINGS = require('images/icons/hot-food.svg')
const PROFILE = require('images/chef-rj.svg')
const LIKE_BW = require('images/icons/yummy_bw.svg')
const SAVE_BW = require('images/icons/cookbook_bw.svg')
const LIKE_COLOR = require('images/icons/yummy_color.svg')
const SAVE_COLOR = require('images/icons/cookbook_color.svg')
const INGREDIENTS = require('images/icons/basket.svg')
const COMMENTS_BW = require('images/icons/comment_bw.svg')
const COMMENTS_WB = require('images/icons/comment_wb.svg')
const RIGHT_ARROW = require('images/icons/right-arrow.svg')
const CLOSE = require('images/icons/cancel.svg')
const LINK = require('images/icons/link.svg')
const SHARE = require('images/icons/share.svg')

interface RecipeProps {
  recipe: RecipeType
}

interface StepProps {
  step: RecipeStepType
  recipeImg: string
  updateActiveStep: (stepNum?: number) => void
}

const Ingredient: React.FC<{
  ingredient: IngredientType
  border?: boolean
}> = ({ ingredient, border }) => {
  return (
    <div
      className={`${
        border ? 'border-b' : ''
      } h-auto items-center text-center text-sm  grid grid-cols-2 border-gray-700`}
    >
      <span className="capitalize text-left">
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
      {imageOpen && (
        <Lightbox
          mainSrc={image}
          onCloseRequest={() => setImageOpen(!imageOpen)}
        />
      )}
      <div className="flex justify-self-start">
        <div className="m-auto rounded">
          <img
            className="m-auto rounded h-16 w-16  "
            src={image}
            onClick={() => setImageOpen(!imageOpen)}
          />
        </div>
        <span className="text-xl md:text-5xl leading-tight focus:outline-none font-bold col-span-5 ml-2 my-auto">
          {stepTitle}
        </span>
      </div>

      <div className="relative w-full overflow-hidden text-md md:text-xl mb-2">
        <div className="absolute grid grid-cols-2 left-0 right-0 h-full">
          <div
            onClick={() => updateActiveStep(stepNum > 0 ? stepNum - 1 : 0)}
          ></div>
          <div onClick={() => updateActiveStep(stepNum + 1)}></div>
        </div>
        {additionalInfo}
      </div>
      <div className="my-2 self-start">
        <div
          className={`${
            ingredients.length <= 0 ? 'border-none' : 'border'
          }  rounded overflow-scroll border-gray-700 border-b-0 rounded-l-none border-l-0 m-l-0`}
        >
          {ingredients.map((ing) => (
            <Ingredient ingredient={ing} border />
          ))}
        </div>
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
    tags,
  } = recipe.result || {}
  const { username, profileImageUrl } = by || {}
  const [reactionCountUpdatable, setReactionCountUpdatable] = React.useState(
    reactionCount
  )
  const [onOwnRecipe, setOnOwnRecipe] = React.useState(false)
  const [activeStep, setActiveStep] = React.useState(-1)
  const { currentUserInfo } = React.useContext(UserContext)
  const { modalOpen, setModalState } = React.useContext(ScreenContext)
  const [commentsOpen, setCommentsOpen] = React.useState(false)
  const [shareOpen, setshareOpen] = React.useState(false)
  const [recipeReaction, setRecipeReaction] = React.useState(myReaction)
  const [freezeReaction, setFreezeReaction] = React.useState(false)
  const [saved, setSaved] = React.useState(haveISaved)
  const { searchOpen, setSearchState } = React.useContext(ScreenContext)

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

  const updateRecipeReaction = (reaction: ReactionType) => {
    setRecipeReaction(reaction)
    setReactionCountUpdatable(
      reactionCountUpdatable + (recipeReaction === 0 ? -1 : 1)
    )
    setFreezeReaction(false)
  }
  const tagSearch = (tag: string) => {
    let state = searchOpen
    setSearchState ? setSearchState(!state, tag) : null
  }
  const pageTitle = `${title || 'a recipe'}, by ${
    by ? by.username : 'rj'
  } - RecipeJoiner`
  const pageDescription = description
  const time = minutesToTime(recipeTime)
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
        <div className="max-w-3xl lg:my-8 mx-auto ">
          <div className=" mx-auto mt-6 bg-white rounded-lg shadow-xl ">
            <div className="m-2 ">
              <h1
                className=" cursor-pointer w-full text-3xl lg:text-5xl  leading-tight focus:outline-none font-bold"
                onClick={() => updateActiveStep()}
              >
                {title}
              </h1>
              <div className=" w-full flex align-middle text-md">
                <Link href="/[username]" as={`/${username}`}>
                  <a className="flex align-middle">
                    <img
                      src={profileImageUrl ? profileImageUrl : PROFILE}
                      className="h-10 w-10 cursor-pointer rounded-full"
                    />
                    <span className="self-center ml-2">
                      {username || <Skeleton width={40} />}
                    </span>
                  </a>
                </Link>
                <span className="my-auto px-2 ">•</span>

                <div className="inline my-auto">
                  <span className="text-right">{time.hours || '0'}:</span>
                  <span className="text-left">{time.minutes || '0'}</span>
                  {/* <span> {time.message}</span> */}
                </div>
                <span className="my-auto px-2 ">•</span>
                <div className="inline my-auto">
                  <span>{servings}</span>
                  <span> Servings</span>
                </div>
                {onOwnRecipe ? (
                  <div className="">
                    <Link
                      href="/[username]/[recipehandle]/edit"
                      as={`/${username}/${handle}/edit`}
                    >
                      <a className="mx-2 m-auto btn text-sm font-normal">
                        Edit
                      </a>
                    </Link>
                  </div>
                ) : null}
              </div>
            </div>
            <div key="overview">
              <div className=" grid items-center  w-full h-64  m-auto">
                <img
                  className="m-auto object-cover w-full h-64"
                  src={imageUrl ? imageUrl : IMAGE_PLACEHOLDER}
                />
              </div>
              <div className=" w-full h-full rounded ">
                <div className="h-full text-xl text-gray-700 m-2 ">
                  {description}
                </div>
                <div className="text-xs  block w-full whitespace-no-wrap overflow-x-scroll m-2 ">
                  {tags.map((tag) => {
                    return (
                      <span
                        className="p-1 m-1 ml-0 bg-gray-200 rounded cursor-pointer "
                        onClick={() => tagSearch(tag.tagRef.name)}
                      >
                        {tag.tagRef.name}
                      </span>
                    )
                  })}
                </div>
              </div>

              <div
                className={`${
                  ingredients.length <= 0 ? 'hidden' : ''
                } w-full text-center font-black`}
              >
                Ingredients
              </div>
              <div
                className={`${
                  ingredients.length <= 0 ? 'border-none' : 'border'
                } rounded mx-2  m-auto my-2  p-2`}
              >
                {ingredients.map((ing: IngredientType) => (
                  <Ingredient
                    key={`${ing.ingredientInfo.name}${ing.quantity}`}
                    ingredient={ing}
                  />
                ))}
              </div>
            </div>
            <div className="w-full text-center font-black">Steps</div>
            <div className="m-2 border rounded">
              {steps.map((step) => (
                <div>
                  <div
                    className=" w-full p-2 cursor-pointer "
                    onClick={() => updateActiveStep(step.stepNum)}
                  >
                    <div className="grid grid-cols-12">
                      <span className=" flex col-span-2 h-full w-full m-auto border-gray-300 border-b-2  ">
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
            <div className="w-full text-center">
              <button
                className=" bg-white border-b-2 w-11/12 m-2 focus:outline-none text-xl text-gray-800 font-bold p-2  border border-black rounded  "
                onClick={() => updateActiveStep(0)}
              >
                Begin Recipe
              </button>
            </div>
            <Collapse
              isOpen={shareOpen}
              transition={`height 500ms cubic-bezier(.4, 0, .2, 1)`}
              className=""
            >
              <div className="p-2 text-center">
                <span className="mx-2">
                  <FacebookShareButton
                    url={`https://www.recipejoiner.com/${username || '#'}/${
                      handle || '#'
                    }`}
                    children={
                      <FacebookIcon className=" h-8 w-8 rounded-full" />
                    }
                  />
                </span>
                <span className="mx-2">
                  <TwitterShareButton
                    url={`https://www.recipejoiner.com/${
                      username || '#'
                    }/${handle}`}
                    children={<TwitterIcon className=" h-8 w-8 rounded-full" />}
                  />
                </span>
                <span className="mx-2">
                  <WhatsappShareButton
                    url={`https://www.recipejoiner.com/${
                      username || '#'
                    }/${handle}`}
                    children={
                      <WhatsappIcon className=" h-8 w-8 rounded-full" />
                    }
                  />
                </span>
                <span className="mx-2">
                  <RedditShareButton
                    url={`https://www.recipejoiner.com/${
                      username || '#'
                    }/${handle}`}
                    children={<RedditIcon className=" h-8 w-8 rounded-full" />}
                  />
                </span>
                <span className="mx-2">
                  <EmailShareButton
                    url={`https://www.recipejoiner.com/${
                      username || '#'
                    }/${handle}`}
                    children={<EmailIcon className=" h-8 w-8 rounded-full" />}
                  />
                </span>
                <span className="mx-2">
                  <CopyToClipboard
                    text={`https://www.recipejoiner.com/${
                      username || '#'
                    }/${handle}`}
                  >
                    <button>
                      <img
                        className="h-8 w-8 rounded-full cursor-pointer"
                        src={LINK}
                      />
                    </button>
                  </CopyToClipboard>
                </span>
                <span className="mx-2">
                  <button className="h-8 w-8">
                    <img
                      className="h-6 w-6 cursor-pointer my-auto"
                      src={CLOSE}
                      onClick={() => setshareOpen(!shareOpen)}
                    />
                  </button>
                </span>
              </div>
            </Collapse>
            <div className="flex justify-between self-end m-4">
              <div className="mx-4 flex">
                <img
                  className={`${
                    freezeReaction ? 'pointer-events-none' : 'cursor-pointer'
                  } h-6`}
                  src={recipeReaction === 0 ? LIKE_COLOR : LIKE_BW}
                  onClick={() => {
                    setFreezeReaction(true)
                    setYumHandler(
                      currentUserInfo,
                      id,
                      recipeReaction,
                      updateRecipeReaction
                    )
                  }}
                />
                <span className="m-auto text-xs ml-2">
                  {reactionCountUpdatable || ''}
                </span>
              </div>
              <div className="mx-4 flex">
                <img
                  className="h-6 cursor-pointer"
                  src={!commentsOpen ? COMMENTS_WB : COMMENTS_BW}
                  onClick={() => setCommentsOpen(!commentsOpen)}
                />
                <span className="m-auto text-xs ml-2">
                  {commentCount || ''}
                </span>
              </div>
              <div className="mx-4 flex">
                <img className="h-6 cursor-pointer" src={SAVE_BW} />
              </div>
              <div className="mx-4 flex">
                <img
                  className="h-6 cursor-pointer"
                  src={SHARE}
                  onClick={() => setshareOpen(!shareOpen)}
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
        <div className="fixed top-0 bottom-0 z-100 bg-white  whitespace-normal w-screen">
          <div
            className="absolute h-full w-full opacity-25 bg-cover "
            // style={{
            //   backgroundImage: `url(${
            //     steps[activeStep].imageUrl !== null
            //       ? steps[activeStep].imageUrl
            //       : imageUrl
            //   })`,
            // }}
          >
            <div className="w-full h-full backdrop-blurMax"></div>
          </div>

          <div className="absolute left-0 top-0 bottom-0 right-0 max-w-3xl m-auto h-full shadow-lg ">
            <div className="z-100 mx-2 items-center flex content-between justify-between">
              {steps.map((step) => {
                return (
                  <div
                    className={`${
                      step.stepNum === activeStep
                        ? 'text-2xl lg:text-3xl'
                        : 'opacity-25'
                    }   justify-start rounded  lg:text-2xl`}
                    onClick={() => updateActiveStep(step.stepNum)}
                  >
                    {step.stepNum + 1}
                  </div>
                )
              })}
              <div className="grid  justify-end">
                <img
                  className=" p-2 w-10 "
                  style={{ justifySelf: 'end' }}
                  onClick={() => updateActiveStep()}
                  src={CLOSE}
                ></img>
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
