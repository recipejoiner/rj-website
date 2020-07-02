import * as React from 'react'
import Link from 'next/link'
import Skeleton from 'react-loading-skeleton'

import { EdgeType } from 'components/InfiniteScroll'
import { ShortRecipeNodeType } from 'requests/recipes'
import RecipeComments from 'components/comments/RecipeComments'
const IMAGE = require('images/icons/add.svg')
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
  const [liked, setLiked] = React.useState(false)
  const [saved, setSaved] = React.useState(false)
  const { node } = edge
  const { id, by, title, description, servings, handle } = node || {}
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

        <div className=" grid items-center p-2 w-full h-full opacity-25 m-auto">
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
              src={!!liked ? LIKE_COLOR : LIKE_BW}
              onClick={() => setLiked(!liked)}
            />
          </div>
        </div>

        {!!commentsOpen ? (
          <div className="max-h-full">
            {username && handle && (
              <RecipeComments
                id={id}
                username={username}
                handle={handle}
                className="rounded p-2"
              />
            )}
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  )
}

export default ShortRecipe
