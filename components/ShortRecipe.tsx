import * as React from 'react'
import Link from 'next/link'
import Skeleton from 'react-loading-skeleton'
import Collapse from '@kunukn/react-collapse'

import { EdgeType } from 'components/InfiniteScroll'
import { ShortRecipeNodeType } from 'requests/recipes'
import RecipeComments from 'components/comments/RecipeComments'
import { setReaction } from 'helpers/user-interactions'

const IMAGE = require('images/food/fish-placeholder.jpg')
const LIKE_BW = require('images/icons/yummy_bw.svg')
const SAVE_BW = require('images/icons/cookbook_bw.svg')
const LIKE_COLOR = require('images/icons/yummy_color.svg')
const SAVE_COLOR = require('images/icons/cookbook_color.svg')
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
  const [recipeReaction, setRecipeReaction] = React.useState(myReaction)
  const [saved, setSaved] = React.useState(haveISaved)
  let { username } = by || {}
  return (
    <div className="max-w-md mx-auto font-mono">
      <div className="mx-auto bg-white rounded-lg mt-12 border-black border">
        <div className="text-center border-b p-1 border-black ">
          <Link
            href="/[username]/[recipehandle]"
            as={`/${username || '#'}/${handle || '#'}`}
          >
            <a className="bg-transparent cursor-pointer font-bold w-full text-2xl text-gray-700 leading-tight focus:outline-none">
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
        <div className=" grid items-center p-2 w-full h-full  m-auto">
          <img className="m-auto" src={IMAGE} />
        </div>
        <div className="h-full w-full text-2xl text-gray-700 p-4 ">
          {description}
        </div>
        <div className="grid grid-cols-2 items-center">
          <div
            className={
              (!!commentsOpen ? 'opacity-100' : '') +
              ' cursor-pointer text-2xl ml-4 opacity-25'
            }
            onClick={() => setCommentsOpen(!commentsOpen)}
          >
            Comments
          </div>
          <div className="flex justify-end  ">
            <img
              className="h-8 mx-4 my-2 cursor-pointer"
              src={!!saved ? SAVE_COLOR : SAVE_BW}
              onClick={() => setSaved(!saved)}
            />
            <img
              className="h-8 mx-4 my-2 cursor-pointer"
              src={recipeReaction === 0 ? LIKE_COLOR : LIKE_BW}
              onClick={() =>
                setReaction(
                  {
                    reactableId: id,
                    reactableType: 'Recipe',
                    reactionType: recipeReaction === 0 ? null : 0,
                  },
                  (result) => {
                    if ('result' in result) {
                      setRecipeReaction(result.result.reaction)
                    } else {
                      console.log('error', result)
                    }
                  }
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
