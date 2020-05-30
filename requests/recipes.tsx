import gql from 'graphql-tag'

import { EdgeType } from 'components/InfiniteScroll'

export const recipeConnectionDataInit = {
  connection: {
    pageInfo: {
      hasNextPage: true,
      __typename: '',
    },
    edges: [
      {
        cursor: '',
        node: {
          id: '',
          by: {
            username: '',
            __typename: '',
          },
          title: '',
          handle: '',
          description: '',
          servings: '',
          __typename: '',
        },
        __typename: '',
      },
    ],
    __typename: '',
  },
  __typename: '',
}

export interface ShortRecipeInfoType {
  id: string
  by: {
    username: string
    __typename: string
  }
  title: string
  handle: string
  description: string
  servings: string
  __typename: string
}
export interface AllRecipesData {
  connection: {
    pageInfo: {
      hasNextPage: boolean
      __typename: string
    }
    edges: Array<EdgeType<ShortRecipeInfoType>>
    __typename: string
  }
}
export interface AllRecipesVarsType {
  cursor: string | null
}
export const ALL_RECIPES = gql`
  query getAllRecipes($cursor: String) {
    connection: allRecipes(first: 10, after: $cursor) {
      pageInfo {
        hasNextPage
      }
      edges {
        cursor
        node {
          id
          by {
            username
          }
          title
          handle
          description
          servings
        }
      }
    }
  }
`

export interface UserRecipeFeedData {
  result: AllRecipesData
  __typename: string
}
export interface UserRecipeFeedVarsType {
  cursor: string | null
}
export const USER_RECIPES_FEED = gql`
  query recipeFeed($cursor: String) {
    result: me {
      connection: recipeFeed(first: 10, after: $cursor) {
        pageInfo {
          hasNextPage
        }
        edges {
          cursor
          node {
            id
            by {
              username
            }
            title
            handle
            description
            servings
          }
        }
      }
    }
  }
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
        pageInfo {
          hasNextPage
        }
        edges {
          cursor
          node {
            id
            by {
              username
            }
            title
            handle
            description
            servings
          }
        }
      }
    }
  }
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

export interface RecipeStepType {
  stepNum: number
  stepTime: number
  description: string
  ingredients: Array<IngredientType>
}

export interface RecipeType {
  result: {
    by: {
      username: string
    }
    id: string
    title: string
    handle: string
    description: string
    servings: string
    ingredients: Array<IngredientType>
    steps: Array<RecipeStepType>
  }
}

export const RECIPE_BY_USERNAME_AND_HANDLE = gql`
  query getRecipeByUsernameAndHandle($username: String, $handle: String) {
    result: recipeBy(username: $username, handle: $handle) {
      by {
        username
      }
      id
      title
      handle
      description
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
        stepTime
        description
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
    }
  }
`

export const RECIPE_BY_ID = gql`
  query getRecipeByID($id: ID) {
    result: recipeBy(id: $id) {
      by {
        username
      }
      id
      title
      handle
      description
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
        stepTime
        description
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
    }
  }
`

interface RecipeInputIngredient {
  name: string
  amount: number
  unit: string
}
interface RecipeInputStep {
  stepNum: number
  stepTime: number
  description: string
  ingredients: Array<RecipeInputIngredient> // not required
}
interface RecipeInputAttributes {
  title: string
  description: string
  servings: string
  steps: Array<RecipeInputStep>
}
// return type is RecipeType
export const CREATE_RECIPE = gql`
  mutation createRecipe($attributes: RecipeInputAttributes) {
    createOrEditRecipe(attributes: $attributes) {
      result: recipe {
        by {
          username
        }
        id
        title
        handle
        description
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
          stepTime
          description
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
      }
    }
  }
`
