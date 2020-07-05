import gql from 'graphql-tag'
import { ReadStoreContext } from 'apollo-cache-inmemory'

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
export interface SetReactionResultVarsType {
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
