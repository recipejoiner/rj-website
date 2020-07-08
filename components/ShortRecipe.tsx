import * as React from 'react'
import Link from 'next/link'
import Skeleton from 'react-loading-skeleton'
import Collapse from '@kunukn/react-collapse'

import { EdgeType } from 'components/InfiniteScroll'
import { ShortRecipeNodeType } from 'requests/recipes'
import RecipeComments from 'components/comments/RecipeComments'
import { setYumHandler, setRecipeSavedHandler } from 'helpers/user-interactions'
import UserContext from 'helpers/UserContext'

const IMAGE = require('images/food/fish-placeholder.jpg')
const LIKE_BW = require('images/icons/yummy_bw.svg')
const SAVE_BW = require('images/icons/cookbook_bw.svg')
const LIKE_COLOR = require('images/icons/yummy_color.svg')
const SAVE_COLOR = require('images/icons/cookbook_color.svg')
const COMMENTS_BW = require('images/icons/comment_bw.svg')
const COMMENTS_WB = require('images/icons/comment_wb.svg')

const PROFILE = require('images/chef-rj.svg')

interface ShortRecipeProps {
  edge: EdgeType<ShortRecipeNodeType>
}

const ShortRecipe: React.FC<ShortRecipeProps> = ({ edge }) => {
  const [commentsOpen, setCommentsOpen] = React.useState(false)
  const { node } = edge
  const {
    id,
    by,
    title,
    description,
    servings,
    handle,
    haveISaved,
    myReaction,
  } = node || {}

  const { currentUserInfo, modalOpen, setModalState } = React.useContext(
    UserContext
  )

  const [recipeReaction, setRecipeReaction] = React.useState(myReaction)

  const [saved, setSaved] = React.useState(haveISaved)
  let { username } = by || {}
  return (
    <div className="max-w-3xl mx-auto font-mono">
      <div className="mx-auto bg-white rounded-lg mt-6 ">
        <div className="text-center  p-1 ">
          <Link
            href="/[username]/[recipehandle]"
            as={`/${username || '#'}/${handle || '#'}`}
          >
            <a className="bg-transparent cursor-pointer font-bold w-full text-2xl  leading-tight focus:outline-none">
              {title}
            </a>
          </Link>
          <div className=" w-full ">
            <Link href="/[username]" as={`/${username}`}>
              <a className="flex justify-center">
                <span className="text-xs">
                  {by.username || <Skeleton width={40} />}
                </span>
              </a>
            </Link>
          </div>
        </div>
        <Link
          href="/[username]/[recipehandle]"
          as={`/${username || '#'}/${handle || '#'}`}
        >
          <a>
            <div className=" grid items-center w-full h-full  m-auto">
              <img className="m-auto" src={IMAGE} />
            </div>
          </a>
        </Link>
        <div className="h-full w-full text-xl  p-4 ">{description}</div>
        <div className="grid grid-cols-2 items-center">
          <img
            className="h-8 m-4 mt-0 cursor-pointer"
            src={!!commentsOpen ? COMMENTS_BW : COMMENTS_WB}
            onClick={() => setCommentsOpen(!commentsOpen)}
          />
          <div className="flex justify-end  ">
            <img
              className="h-8 m-4 mt-0 cursor-pointer"
              src={!!saved ? SAVE_COLOR : SAVE_BW}
              onClick={() => setRecipeSavedHandler(id, saved, setSaved)}
            />
            <img
              className="h-8 m-4 mt-0 cursor-pointer"
              src={recipeReaction === 0 ? LIKE_COLOR : LIKE_BW}
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
  )
}

export default ShortRecipe
