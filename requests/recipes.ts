import gql from 'graphql-tag'

export interface ShortRecipeNodeType {
  id: string
  by: {
    username: string
  }
  title: string
  handle: string
  description: string
  servings: string
}

export const recipeConnectionNodeInit: ShortRecipeNodeType = {
  id: '',
  by: {
    username: '',
  },
  title: '',
  handle: '',
  description: '',
  servings: '',
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
interface IngredientInputType {
  [id: string]: number | string
  name: string
  quantity: number
  unit: string
}
interface TimeInput {
  hours: number
  minutes: number
  seconds: number
}

export interface RecipeInputStepType {
  [id: string]: string | number | Array<any> | any
  action: string
  ingredients: Array<IngredientInputType>
  useResultsFromStep: Array<{ id: string; value: string }>
  tempNum: number
  tempLevel: string
  time: TimeInput
  location: string
  customInfo: string
}

export interface RecipeInputType {
  title: string
  description?: string
  servings?: string
  steps: Array<RecipeInputStepType>
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
