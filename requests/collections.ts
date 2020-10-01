import gql from 'graphql-tag'
import { RECIPE_SHORT_FRAGMENT } from './recipes'

export const CREATE_COLLECTION = gql`
  mutation createCollection($title: String!, $description: String) {
    createCollection(title: $title, description: $description) {
      collection {
        by {
          username
        }
        title
        handle
        description
      }
    }
  }
`

export const GET_COLLECTION = gql`
  query getCollection($username: String!, $handle: String!, $cursor: String) {
    result: collectionBy(username: $username, handle: $handle) {
      by {
        username
      }
      title
      handle
      description
      connection: saves(first: 10, after: $cursor) {
        pageInfo {
          hasNextPage
        }
        edges {
          cursor
          node {
            saveable {
              ... on Recipe {
                ...recipeShortAttributes
              }
            }
          }
        }
      }
    }
  }
  ${RECIPE_SHORT_FRAGMENT}
`

export const COLLECTION_SHORT_FRAGMENT = gql`
  fragment collectionShortInfo on Collection {
    by {
      username
    }
    title
    handle
    description
  }
`
export const COLLECTION_FRAGMENT = gql`
  fragment collectionInfo on Collection {
    by {
      username
    }
    title
    handle
    description
    saves {
      nodes {
        saveable {
          ... on Recipe {
            id
          }
        }
      }
    }
  }
`

export const SHORT_COLLECTION = gql`
  query getCollection($username: String!, $handle: String!) {
    result: collectionBy(username: $username, handle: $handle) {
      by {
        username
      }
      title
      handle
      description
    }
  }
`
export const OWNED_COLLECTIONS = gql`
  query ownedCollections($cursor: String) {
    result: me {
      connection: collections(first: 10, after: $cursor) {
        pageInfo {
          hasNextPage
        }
        edges {
          cursor
          node {
            ...collectionInfo
          }
        }
      }
    }
  }
  ${COLLECTION_FRAGMENT}
`
export const USER_COLLECTIONS_BY_USERNAME = gql`
  query userCollectionsByUsername($username: String!, $cursor: String) {
    result: userByUsername(username: $username) {
      connection: collections(first: 10, after: $cursor) {
        pageInfo {
          hasNextPage
        }
        edges {
          cursor
          node {
            ...collectionShortInfo
          }
        }
      }
    }
  }
  ${COLLECTION_SHORT_FRAGMENT}
`

export const SAVE_OR_UNSAVE_RECIPE = gql`
  mutation setObjectSaved(
    $saveableType: String!
    $saveableId: ID!
    $savedState: Boolean!
    $collectionTitle: String
  ) {
    setObjectSaved(
      saveableType: $saveableType
      saveableId: $saveableId
      savedState: $savedState
      collectionTitle: $collectionTitle
    ) {
      saved
    }
  }
`

export interface SaveOrUnsaveRecipeVarsType {
  saveableType: string
  saveableId: string
  savedState: boolean
  collectionTitle: string
}
export interface SaveOrUnsaveRecipeResultType {
  setObjectSaved: {
    saved: boolean
  }
}
export interface CollectionVarsType {
  username: string
  handle: string
  cursor: string | null
}

export interface MyCollectionsVarsType {
  cursor: string | null
}
export interface CollectionsNodeType {
  by: {
    username: string
  }
  title: string
  handle: string
  description: string
  saves: {
    nodes: [
      {
        saveable: {
          id: string
        }
      }
    ]
  }
}

export interface CollectionsShortNodeType {
  by: {
    username: string
  }
  title: string
  handle: string
  description: string
}
export interface CollectionType {
  result: {
    by: {
      username: string
    }
    title: string
    handle: string
    description: string
  }
}
export const collectionsNodeInit: CollectionsShortNodeType = {
  by: {
    username: '',
  },
  title: '',
  handle: '',
  description: '',
}
