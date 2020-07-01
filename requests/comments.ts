import gql from 'graphql-tag'

export interface CommentNodeType {
  id: string
  depth: number
  createdAt: string
  by: {
    username: string
  }
  content: string
}

export const CommentNodeInit: CommentNodeType = {
  id: '',
  depth: 0,
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

export const RECIPE_ROOT_COMMENTS_BY_USERNAME_AND_HANDLE = gql`
  query getRecipeRootCommentsByUsernameAndHandle(
    $username: String
    $handle: String
    $cursor: String
  ) {
    result: recipeBy(username: $username, handle: $handle) {
      connection: rootComments(first: 10, after: $cursor) {
        pageInfo {
          hasNextPage
        }
        edges {
          cursor
          node {
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
    }
  }
`

export interface SubcommentsVarsType {
  parentId: string
  cursor: string | null
}

export const SUBCOMMENTS = gql`
  query getSubcomments($parentId: ID!, $cursor: String) {
    connection: subcomments(parentId: $parentId, first: 10, after: $cursor) {
      pageInfo {
        hasNextPage
      }
      edges {
        cursor
        node {
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
  }
`

export interface CreateCommentVarsType {
  commentableType: string
  commentableId: string
  content: string
}
// return type is CommentNodeType
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
