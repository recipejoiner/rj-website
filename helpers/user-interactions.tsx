import React from 'react'
import { GraphQLError } from 'graphql'

import client from 'requests/client'
import { getToken } from 'helpers/auth'
import {
  SET_OBJECT_REACTION,
  ReactionType,
  SetReactionVarsType,
  SetReactionResultType,
} from 'requests/reactions'
import { CurrentUserLoginCheckType } from 'requests/auth'

export const setReaction = (
  reactionParams: SetReactionVarsType,
  callback: (result: SetReactionResultType | readonly GraphQLError[]) => any
): void => {
  const mutationResult = client
    .mutate({
      mutation: SET_OBJECT_REACTION,
      variables: reactionParams,
      context: {
        headers: {
          authorization: `Bearer ${getToken()}`,
        },
      },
    })
    .then((res) => {
      console.log('res', res)
      if (res.errors) {
        callback(res.errors)
      }
      const { data }: { data?: SetReactionResultType } = res || {}
      if (data?.result) {
        callback(data)
      }
    })
}

export const setYumHandler = (
  currentUserInfo: CurrentUserLoginCheckType | undefined,
  recipeId: string,
  currentRecipeReaction: ReactionType,
  setRecipeReaction: (value: React.SetStateAction<ReactionType>) => void
) => {
  if (currentUserInfo) {
    setReaction(
      {
        reactableId: recipeId,
        reactableType: 'Recipe',
        reactionType: currentRecipeReaction === 0 ? null : 0,
      },
      (result) => {
        if ('result' in result) {
          setRecipeReaction(result.result.reaction)
        } else {
          console.log('error', result)
        }
      }
    )
  } else {
    console.log('You need to log in or sign up!')
  }
}
