import * as React from 'react'
import Link from 'next/link'
import Skeleton from 'react-loading-skeleton'
import Collapse from '@kunukn/react-collapse'
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

import { EdgeType } from 'components/InfiniteScroll'
import { ShortRecipeNodeType } from 'requests/recipes'
import { minutesToTime, redirectTo } from 'helpers/methods'

import {
  setYumHandler,
  setRecipeSavedHandler,
  setReaction,
} from 'helpers/user-interactions'
import UserContext from 'helpers/UserContext'
import ScreenContext from 'helpers/ScreenContext'
import { ReactionType } from 'requests/reactions'

const IMAGE_PLACEHOLDER = require('images/icons/picture.svg')
const LIKE_BW = require('images/icons/yummy_bw.svg')
const SAVE_BW = require('images/icons/cookbook_bw.svg')
const LIKE_COLOR = require('images/icons/yummy_color.svg')
const SHARE = require('images/icons/share.svg')
const COMMENTS = require('images/icons/comment_wb.svg')
const LINK = require('images/icons/link.svg')
const PROFILE = require('images/chef-rj.svg')
interface ShortRecipeProps {
  node: ShortRecipeNodeType
}

const ShortRecipe: React.FC<ShortRecipeProps> = ({ node }) => {
  const [shareOpen, setshareOpen] = React.useState(false)
  const {
    id,
    by,
    title,
    imageUrl,
    description,
    recipeTime,
    reactionCount,
    commentCount,
    stepCount,
    handle,
    myReaction,
    tags,
  } = node || {}

  const { currentUserInfo } = React.useContext(UserContext)

  const [recipeReaction, setRecipeReaction] = React.useState(myReaction)
  const [freezeReaction, setFreezeReaction] = React.useState(false)
  const [reactionCountUpdatable, setReactionCountUpdatable] = React.useState(
    reactionCount
  )
  const { searchOpen, setSearchState } = React.useContext(ScreenContext)

  let { username, profileImageUrl } = by || {}
  let time = minutesToTime(recipeTime)

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
  return (
    <div className="max-w-3xl mx-auto  overflow-hidden border-gray-500 border-b">
      <div className="mx-auto p-4 bg-white">
        <div className="text-left  ">
          <Link
            href="/[username]/[recipehandle]"
            as={`/${username || '#'}/${handle || '#'}`}
          >
            <a>
              <h1 className=" cursor-pointer w-full text-3xl lg:text-5xl  leading-tight focus:outline-none font-bold">
                {title}
              </h1>
              <div className="w-full h-full">
                <div className="h-full w-full text-xl ">{description}</div>
              </div>
            </a>
          </Link>
        </div>

        <div className="flex pt-1">
          <div className="w-32 h-32">
            <Link
              href="/[username]/[recipehandle]"
              as={`/${username || '#'}/${handle || '#'}`}
            >
              <a>
                <div className=" grid items-center w-32 h-32 m-auto">
                  <img
                    className="m-auto  h-full w-full object-cover"
                    src={imageUrl ? imageUrl : IMAGE_PLACEHOLDER}
                  />
                </div>
              </a>
            </Link>
          </div>
          <div className=" h-32  grid grid-rows-3 ml-3">
            <div className="w-full flex ">
              <img
                src={profileImageUrl ? profileImageUrl : PROFILE}
                className="h-10 w-10 cursor-pointer rounded-full"
              />
              <div className="grid grid-rows-2 ml-2">
                <Link href="/[username]" as={`/${username}`}>
                  <a className="flex align-middle ">
                    <div className=" self-center ">
                      <span className="self-center  text-lg">
                        {username || <Skeleton width={40} />}
                      </span>
                    </div>
                  </a>
                </Link>
                <div className="text-sm">
                  <div className="inline my-auto">
                    <span className="text-right">{time.hours || '0'}:</span>
                    <span className="text-left">{time.minutes || '0'}</span>
                    {/* <span> {time.message}</span> */}
                  </div>
                  <span className="my-auto "> • </span>
                  <div className="inline my-auto">
                    <span>{stepCount}</span>
                    <span> steps</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-xs block w-full whitespace-no-wrap overflow-x-scroll mt-2 ">
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
            <div className="flex justify-start self-end">
              <div className="mr-4 flex">
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
                <img className="h-6 cursor-pointer" src={COMMENTS} />
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
          </div>
        </div>
      </div>
      <Collapse
        isOpen={shareOpen}
        transition={`height 500ms cubic-bezier(.4, 0, .2, 1)`}
        className=""
      >
        <div className="p-4 pb-0 text-center">
          <span className="mx-2">
            <FacebookShareButton
              url={`https://www.recipejoiner.com/${username || '#'}/${
                handle || '#'
              }`}
              children={<FacebookIcon className=" h-8 w-8 rounded-full" />}
            />
          </span>
          <span className="mx-2">
            <TwitterShareButton
              url={`https://www.recipejoiner.com/${username || '#'}/${handle}`}
              children={<TwitterIcon className=" h-8 w-8 rounded-full" />}
            />
          </span>
          <span className="mx-2">
            <WhatsappShareButton
              url={`https://www.recipejoiner.com/${username || '#'}/${handle}`}
              children={<WhatsappIcon className=" h-8 w-8 rounded-full" />}
            />
          </span>
          <span className="mx-2">
            <RedditShareButton
              url={`https://www.recipejoiner.com/${username || '#'}/${handle}`}
              children={<RedditIcon className=" h-8 w-8 rounded-full" />}
            />
          </span>
          <span className="mx-2">
            <EmailShareButton
              url={`https://www.recipejoiner.com/${username || '#'}/${handle}`}
              children={<EmailIcon className=" h-8 w-8 rounded-full" />}
            />
          </span>
          <span className="mx-2">
            <CopyToClipboard
              text={`https://www.recipejoiner.com/${username || '#'}/${handle}`}
            >
              <button>
                <img
                  className="h-8 w-8 rounded-full cursor-pointer"
                  src={LINK}
                />
              </button>
            </CopyToClipboard>
          </span>
        </div>
      </Collapse>
    </div>
  )
}

export default ShortRecipe
