import gql from 'graphql-tag'

const SEARCH_USER_FRAGMENT = gql`
  fragment userSearchInfo on User {
    username
    profileImageUrl
    __typename
  }
`
const SEARCH_RECIPE_FRAGMENT = gql`
  fragment recipeSearchInfo on Recipe {
    by {
      username
      profileImageUrl
    }
    title
    handle
    stepCount
    imageUrl
    __typename
  }
`

const SEARCH_TAG_FRAGMENT = gql`
  fragment recipeTagRefInfo on TagRef {
    name
    recipeCount
  }
`

export const SEARCH = gql`
  query Search($query: String!, $searchIn: String!, $cursor: String) {
    connection: search(
      query: $query
      searchIn: $searchIn
      first: 10
      after: $cursor
    ) {
      pageInfo {
        hasNextPage
      }
      edges {
        cursor
        node {
          ... on User {
            ...userSearchInfo
          }
          ... on Recipe {
            ...recipeSearchInfo
          }
          ... on TagRef {
            ...recipeTagRefInfo
          }
        }
      }
    }
  }
  ${SEARCH_USER_FRAGMENT}
  ${SEARCH_RECIPE_FRAGMENT}
  ${SEARCH_TAG_FRAGMENT}
`

export interface SearchVarsType {
  cursor: string | null
  query: string
  searchIn: string
}

export interface RecipeSearchType {
  __typename: 'Recipe'
  title: string
  imageUrl: string
  by: {
    username: string
    profileImageUrl: string
  }
  handle: string
}

export interface UserSearchType {
  __typename: 'User'
  username: string
  profileImageUrl: string
}

export interface TagSearchType {
  __typename: 'Tag'
  name: string
  recipeCount: number
}

export interface SearchNodeType {
  searchable: RecipeSearchType | UserSearchType | TagSearchType
  __typename: string
}

export const searchNodeInit: SearchNodeType = {
  searchable: {
    __typename: 'User',
    username: '',
    profileImageUrl: '',
  },
  __typename: '',
}
