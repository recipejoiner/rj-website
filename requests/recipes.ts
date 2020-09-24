import gql from 'graphql-tag'

import { ReactionType } from 'requests/reactions'

//GET RECIPE
export interface ShortRecipeNodeType {
  id: string
  by: {
    username: string
    profileImageUrl: string | null
  }
  title: string
  handle: string
  description: string
  recipeTime: number
  reactionCount: number
  commentCount: number
  stepCount: number
  myReaction: ReactionType
  imageUrl: string | null
  tags: Array<RecipeTagType>
}

export const recipeConnectionNodeInit: ShortRecipeNodeType = {
  id: '',
  by: {
    username: '',
    profileImageUrl: null,
  },
  title: '',
  handle: '',
  description: '',
  recipeTime: 0,
  reactionCount: 0,
  commentCount: 0,
  stepCount: 0,
  myReaction: null,
  imageUrl: null,
  tags: [
    {
      tagRef: {
        name: '',
      },
    },
  ],
}

export const RECIPE_SHORT_FRAGMENT = gql`
  fragment recipeShortAttributes on Recipe {
    id
    by {
      username
      profileImageUrl
    }
    title
    handle
    description
    recipeTime
    reactionCount
    commentCount
    stepCount
    myReaction
    imageUrl
    tags {
      tagRef {
        name
      }
    }
  }
`

export const RECIPE_CONNECTION_SHORT_FRAGMENT = gql`
  fragment recipeConnectionShortAttributes on RecipeConnection {
    pageInfo {
      hasNextPage
    }
    edges {
      cursor
      node {
        ...recipeShortAttributes
      }
    }
  }
  ${RECIPE_SHORT_FRAGMENT}
`

export interface AllRecipesVarsType {
  cursor: string | null
}

export const ALL_RECIPES = gql`
  query getAllRecipes($cursor: String) {
    connection: allRecipes(first: 10, after: $cursor) {
      ...recipeConnectionShortAttributes
    }
  }
  ${RECIPE_CONNECTION_SHORT_FRAGMENT}
`
export interface UserRecipeFeedVarsType {
  cursor: string | null
}
export const USER_RECIPES_FEED = gql`
  query recipeFeed($cursor: String) {
    result: me {
      connection: recipeFeed(first: 10, after: $cursor) {
        ...recipeConnectionShortAttributes
      }
    }
  }
  ${RECIPE_CONNECTION_SHORT_FRAGMENT}
`

// uses same return type as UserRecipeFeedData
export interface UserRecipesByUsernameVarsType {
  username: string
  cursor: string | null
}
export const ALL_USER_RECIPES_BY_USERNAME = gql`
  query userRecipesByUsername($username: String!, $cursor: String) {
    result: userByUsername(username: $username) {
      connection: recipes(first: 10, after: $cursor) {
        ...recipeConnectionShortAttributes
      }
    }
  }
  ${RECIPE_CONNECTION_SHORT_FRAGMENT}
`

// SAVED RECIPES
export interface SavedRecipeNodeType {
  savedRecipe: ShortRecipeNodeType
}
export const savedRecipeConnectionNodeInit: SavedRecipeNodeType = {
  savedRecipe: recipeConnectionNodeInit,
}

export interface CurrentUserSavedRecipesVarsType {
  cursor: string | null
}
export const CURRENT_USER_SAVED_RECIPES = gql`
  query currentUserSavedRecipes($cursor: String) {
    result: me {
      connection: saves(first: 10, after: $cursor) {
        pageInfo {
          hasNextPage
        }
        edges {
          cursor
          node {
            savedRecipe: saveable {
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

export interface UserSavedRecipesByUsernameVarsType {
  username: string
  cursor: string | null
}
export const USER_SAVED_RECIPES_BY_USERNAME = gql`
  query userSavedRecipesByUsername($username: String!, $cursor: String) {
    result: userByUsername(username: $username) {
      connection: saves(first: 10, after: $cursor) {
        pageInfo {
          hasNextPage
        }
        edges {
          cursor
          node {
            savedRecipe: saveable {
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

export interface IngredientType {
  ingredientInfo: {
    name: string
  }
  quantity: number
  unit: {
    name: string
  }
}
export interface RecipeTagType {
  tagRef: {
    name: string
  }
}
export interface RecipeStepType {
  [id: string]: string | Array<IngredientInputType> | any
  stepNum: number
  imageUrl: string | null
  stepTitle: string
  additionalInfo: string
  ingredients: Array<IngredientType>
}

export interface RecipeType {
  result: {
    by: {
      username: string
      profileImageUrl: string
    }
    id: string
    title: string
    imageUrl: string
    handle: string
    description: string
    servings: number
    recipeTime: number
    ingredients: Array<IngredientType>
    reactionCount: number
    commentCount: number
    haveISaved: boolean | null
    myReaction: 0 | 1 | null // update this as more reaction types are added
    steps: Array<RecipeStepType>
    tags: Array<RecipeTagType>
  }
}

export const RECIPE_FULL_FRAGMENT = gql`
  fragment recipeFullAttributes on Recipe {
    id
    by {
      username
      profileImageUrl
    }
    description
    title
    imageUrl
    reactionCount
    commentCount
    haveISaved
    myReaction
    recipeTime
    handle
    servings
    ingredients {
      ingredientInfo {
        name
      }
      quantity
      unit {
        name
      }
    }
    steps {
      stepNum
      stepTitle
      imageUrl
      additionalInfo
      ingredients {
        ingredientInfo {
          name
        }
        quantity
        unit {
          name
        }
      }
    }
    tags {
      tagRef {
        name
      }
    }
  }
`

export interface RecipeByUsernameAndHandleVarsType {
  username: string
  handle: string
}
export const RECIPE_BY_USERNAME_AND_HANDLE = gql`
  query getRecipeByUsernameAndHandle($username: String, $handle: String) {
    result: recipeBy(username: $username, handle: $handle) {
      ...recipeFullAttributes
    }
  }
  ${RECIPE_FULL_FRAGMENT}
`

export interface RecipeByIdVarsType {
  id: number
}
export const RECIPE_BY_ID = gql`
  query getRecipeByID($id: ID) {
    result: recipeBy(id: $id) {
      ...recipeFullAttributes
    }
  }
  ${RECIPE_FULL_FRAGMENT}
`

//NEW RECIPE
export interface IngredientInputType {
  id?: string
  name: string
  quantity: string | number
  unit: string
}

export interface RecipeStepInputType {
  // [id: string]: string | Array<IngredientInputType> | any
  stepNum: number
  stepTitle: string
  image?: Array<File>
  additionalInfo: string
  ingredients: Array<IngredientInputType>
}

export interface RecipeInputType {
  title: string
  image: Array<File>
  description: string
  servings: number
  recipeTime: {
    minutes: number
    hours: number
  }
  steps: Array<RecipeStepInputType>
  tags: Array<string>
}

export interface CreateRecipeVars {
  attributes: RecipeInputType
}

export interface RecipeFormReturnType {
  mutation: {
    result: {
      by: {
        username: string
      }
      handle: string
    }
  }
}

export const CREATE_RECIPE = gql`
  mutation createRecipe($attributes: RecipeInput!) {
    mutation: createOrEditRecipe(attributes: $attributes) {
      result: recipe {
        by {
          username
        }
        handle
      }
    }
  }
`

//EDIT RECIPE
export interface EditRecipeVars {
  existingRecipeId: number
  attributes: RecipeInputType
}
// uses same types as CREATE_RECIPE
export const EDIT_RECIPE = gql`
  mutation editRecipe($existingRecipeId: ID!, $attributes: RecipeInput!) {
    mutation: createOrEditRecipe(
      existingRecipeId: $existingRecipeId
      attributes: $attributes
    ) {
      result: recipe {
        by {
          username
        }
        handle
      }
    }
  }
`
