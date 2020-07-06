import gql from 'graphql-tag'
import { GraphQLError } from 'graphql'

import client from 'requests/client'
import { getToken } from 'helpers/auth'

/*
  expand this as needed, per the backend
  - 0 is 'yum', 1 is 'like', will be null if there is no reaction or no user is logged in
  */
export type ReactionType = 0 | 1 | null

export interface SetReactionResultType {
  result: {
    reaction: ReactionType
  }
}
export interface SetReactionVarsType {
  reactableType: 'Comment' | 'Recipe'
  reactableId: string
  reactionType?: ReactionType
}
export const SET_OBJECT_REACTION = gql`
  mutation setObjectReaction(
    $reactableType: String!
    $reactableId: ID!
    $reactionType: Int
  ) {
    result: setObjectReaction(
      reactableType: $reactableType
      reactableId: $reactableId
      reactionType: $reactionType
    ) {
      reaction
    }
  }
`

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
