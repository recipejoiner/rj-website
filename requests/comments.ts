import gql from 'graphql-tag'

export interface CommentNodeType {
  id: string
  by: {
    username: string
  }
  content: string
}

export const CommentNodeInit: CommentNodeType = {
  id: '',
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

export const RECIPE_ROOT_COMMENTS_BY_USERNAME_AND_HANDLE = gql`
  query getRecipeRootCommentsByUsernameAndHandle(
    $username: String
    $handle: String
    $cursor: String
  ) {
    result: recipeBy(username: $username, handle: $handle) {
      connection: rootComments(first: 10, after: $cursor) {
        edges {
          node {
            id
            by {
              username
            }
            content
          }
        }
      }
    }
  }
`

export interface SubcommentsVarsType {
  parentId: number
  cursor: string | null
}

export const SUBCOMMENTS = gql`
  query getSubcomments($parentId: ID!, $cursor: String) {
    subcomments(parentId: $parentId, first: 10, after: $cursor) {
      edges {
        node {
          id
          by {
            username
          }
          content
        }
      }
    }
  }
`
