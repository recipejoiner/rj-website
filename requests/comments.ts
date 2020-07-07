import gql from 'graphql-tag'

import { ReactionType } from 'requests/reactions'

export interface CommentNodeType {
  id: string
  depth: number
  myReaction: ReactionType
  childCount: number
  createdAt: string
  by: {
    username: string
  }
  content: string
}

export const CommentNodeInit: CommentNodeType = {
  id: '',
  depth: 0,
  myReaction: null,
  childCount: 0,
  createdAt: '',
  by: {
    username: '',
  },
  content: '',
}

export interface RecipeCommentsByUsernameAndHandleVarsType {
  username: string
  handle: string
  cursor: string | null
}

const COMMENT_CONNECTION_ATTRIBUTES = gql`
  fragment commentConnectionAttributes on CommentConnection {
    pageInfo {
      hasNextPage
    }
    edges {
      cursor
      node {
        id
        depth
        myReaction
        childCount
        createdAt
        by {
          username
        }
        content
      }
    }
  }
`
export const RECIPE_ROOT_COMMENTS_BY_USERNAME_AND_HANDLE = gql`
  query getRecipeRootCommentsByUsernameAndHandle(
    $username: String
    $handle: String
    $cursor: String
  ) {
    result: recipeBy(username: $username, handle: $handle) {
      connection: rootComments(first: 10, after: $cursor) {
        ...commentConnectionAttributes
      }
    }
  }
  ${COMMENT_CONNECTION_ATTRIBUTES}
`

export interface SubcommentsVarsType {
  parentId: string
  cursor: string | null
}

export const SUBCOMMENTS = gql`
  query getSubcomments($parentId: ID!, $cursor: String) {
    connection: subcomments(parentId: $parentId, first: 10, after: $cursor) {
      ...commentConnectionAttributes
    }
  }
  ${COMMENT_CONNECTION_ATTRIBUTES}
`

export interface CreateCommentReturnType {
  result: {
    comment: CommentNodeType
  }
}
export interface CreateCommentVarsType {
  commentableType: string
  commentableId: string
  content: string
}
export const CREATE_COMMENT = gql`
  mutation createComment(
    $commentableType: String!
    $commentableId: ID!
    $content: String!
  ) {
    result: createComment(
      commentableType: $commentableType
      commentableId: $commentableId
      content: $content
    ) {
      comment {
        id
        depth
        createdAt
        by {
          username
        }
        content
      }
    }
  }
`
