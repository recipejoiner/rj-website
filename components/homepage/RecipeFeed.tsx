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
  UserSavedRecipesByUsernameVarsType,
  USER_SAVED_RECIPES_BY_USERNAME,
} from 'requests/recipes'

import InfiniteScroll, { EdgeType } from 'components/InfiniteScroll'
import ShortRecipe from 'components/ShortRecipe'
import { escapeRegExp } from 'lodash'

interface UserSavedRecipesProps {
  username?: string
}
export const UserSavedRecipes: React.FC<UserSavedRecipesProps> = ({
  username,
}) => {
  const SavedRecipesVars: UserRecipeFeedVarsType = {
    cursor: null,
  }
  return (
    <div className="bg-gray-100 pt-5 px-5 border-t">
      <div className="m-auto max-w-3xl">
        <h3 className="text-center text-xl font-bold">{`${
          username ? `${username}'s` : 'Your'
        } Saved Recipes`}</h3>
        {username ? (
          <InfiniteScroll
            QUERY={USER_SAVED_RECIPES_BY_USERNAME}
            hasJustConnection={false}
            nodeInit={savedRecipeConnectionNodeInit}
            QueryVars={(() => {
              const queryVars: UserSavedRecipesByUsernameVarsType = {
                username: username,
                cursor: null,
              }
              return queryVars
            })()}
          >
            {(edges: Array<EdgeType<SavedRecipeNodeType>>) => (
              <ul>
                {edges.map((edge) => {
                  return (
                    <ShortRecipe
                      node={edge.node.savedRecipe}
                      key={edge.cursor}
                    />
                  )
                })}
              </ul>
            )}
          </InfiniteScroll>
        ) : (
          <InfiniteScroll
            QUERY={CURRENT_USER_SAVED_RECIPES}
            hasJustConnection={false}
            nodeInit={savedRecipeConnectionNodeInit}
            QueryVars={(() => {
              const queryVars: CurrentUserSavedRecipesVarsType = {
                cursor: null,
              }
              return queryVars
            })()}
          >
            {(edges: Array<EdgeType<SavedRecipeNodeType>>) => (
              <ul>
                {edges.map((edge) => {
                  return (
                    <ShortRecipe
                      node={edge.node.savedRecipe}
                      key={edge.cursor}
                    />
                  )
                })}
              </ul>
            )}
          </InfiniteScroll>
        )}
      </div>
    </div>
  )
}

interface UserRecipesFeedProps {}
export const UserRecipesFeed: React.FC<UserRecipesFeedProps> = ({}) => {
  const UserRecipesVars: UserRecipeFeedVarsType = {
    cursor: null,
  }

  return (
    <div className="bg-gray-100 pt-5 px-5 border-t">
      <div className="m-auto max-w-3xl">
        <h3 className="text-center text-xl font-bold">Your Recipe Feed</h3>
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
    <div className="bg-gray-100 pt-5 px-5 border-t">
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
