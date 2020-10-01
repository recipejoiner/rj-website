import * as React from 'react'

import { recipeConnectionNodeInit } from 'requests/recipes'
import {
  AllRecipesVarsType,
  ShortRecipeNodeType,
  ALL_RECIPES,
} from 'requests/recipes'
import { UserRecipeFeedVarsType, USER_RECIPES_FEED } from 'requests/recipes'
import {
  SavedRecipeNodeType,
  savedRecipeConnectionNodeInit,
  CurrentUserSavedRecipesVarsType,
  CURRENT_USER_SAVED_RECIPES,
} from 'requests/recipes'

import InfiniteScroll, { EdgeType } from 'components/InfiniteScroll'
import ShortRecipe from 'components/ShortRecipe'
import { escapeRegExp } from 'lodash'
import { CollectionVarsType, GET_COLLECTION } from 'requests/collections'

interface CollectionRecipesProps {
  username: string
  handle: string
}
export const CollectionRecipes: React.FC<CollectionRecipesProps> = ({
  username,
  handle,
}) => {
  const SavedRecipesVars: UserRecipeFeedVarsType = {
    cursor: null,
  }
  return (
    <InfiniteScroll
      QUERY={GET_COLLECTION}
      hasJustConnection={true}
      nodeInit={savedRecipeConnectionNodeInit}
      QueryVars={(() => {
        const queryVars: CollectionVarsType = {
          username: username,
          handle: handle,
          cursor: null,
        }
        return queryVars
      })()}
    >
      {(edges: Array<EdgeType<SavedRecipeNodeType>>) => (
        <ul>
          {edges.map((edge) => {
            return <ShortRecipe node={edge.node.saveable} key={edge.cursor} />
          })}
        </ul>
      )}
    </InfiniteScroll>
  )
}

interface UserRecipesFeedProps {}
export const UserRecipesFeed: React.FC<UserRecipesFeedProps> = ({}) => {
  const UserRecipesVars: UserRecipeFeedVarsType = {
    cursor: null,
  }

  return (
    <div className=" border-t">
      <div className="m-auto max-w-3xl">
        <InfiniteScroll
          QUERY={USER_RECIPES_FEED}
          hasJustConnection={false}
          nodeInit={recipeConnectionNodeInit}
          QueryVars={UserRecipesVars}
        >
          {(edges: Array<EdgeType<ShortRecipeNodeType>>) => (
            <ul>
              {edges.map((edge) => {
                return <ShortRecipe node={edge.node} key={edge.cursor} />
              })}
            </ul>
          )}
        </InfiniteScroll>
      </div>
    </div>
  )
}

interface AllRecipesFeedProps {}
export const AllRecipesFeed: React.FC<AllRecipesFeedProps> = ({}) => {
  const AllRecipesVars: AllRecipesVarsType = {
    cursor: null,
  }

  return (
    <div className=" border-t">
      <div className="m-auto max-w-3xl">
        <h3 className="text-center text-xl font-bold">
          Check out some of our latest recipes!
        </h3>
        <InfiniteScroll
          QUERY={ALL_RECIPES}
          hasJustConnection={true}
          nodeInit={recipeConnectionNodeInit}
          QueryVars={AllRecipesVars}
        >
          {(edges: Array<EdgeType<ShortRecipeNodeType>>) => (
            <ul>
              {edges.map((edge) => {
                return <ShortRecipe node={edge.node} key={edge.cursor} />
              })}
            </ul>
          )}
        </InfiniteScroll>
      </div>
    </div>
  )
}
