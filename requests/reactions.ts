import gql from 'graphql-tag'

/*
  expand this as needed, per the backend
  - 0 is 'yum', 1 is 'like', will be null if there is no reaction or no user is logged in
  */
export type ReactionType = 0 | 1 | null
