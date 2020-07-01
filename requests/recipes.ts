import gql from 'graphql-tag'

//GET RECIPE
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

// need to do shortform recipe types and update the below 2 queries
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
  [id: string]: string | Array<IngredientInputType> | any
  stepNum: number
  stepTitle: string
  additionalInfo: string
  ingredients: Array<IngredientType>
}

export interface RecipeType {
  result: {
    by: {
      username: string
    }
    id: number
    title: string
    handle: string
    description: string
    servings: number
    recipeTime: number
    ingredients: Array<IngredientType>
    reactionCount: number
    commentCount: number
    steps: Array<RecipeStepType>
  }
}

export interface RecipeByUsernameAndHandleVarsType {
  username: string
  handle: string
}
export const RECIPE_BY_USERNAME_AND_HANDLE = gql`
  query getRecipeByUsernameAndHandle($username: String, $handle: String) {
    result: recipeBy(username: $username, handle: $handle) {
      id
      by {
        username
      }
      description
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
      title
      reactionCount
      commentCount
      steps {
        stepNum
        stepTitle
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
    }
  }
`

export interface RecipeByIdVarsType {
  id: number
}
export const RECIPE_BY_ID = gql`
  query getRecipeByID($id: ID) {
    result: recipeBy(id: $id) {
      id
      by {
        username
      }
      description
      recipeTime
      handle
      servings
      title
      reactionCount
      commentCount
      steps {
        stepNum
        stepTitle
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
    }
  }
`

//NEW RECIPE
export interface IngredientInputType {
  id: string
  name: string
  quantity: string | number
  unit: string
}

export interface RecipeStepInputType {
  [id: string]: string | Array<IngredientInputType> | any
  stepNum: number
  stepTitle: string
  additionalInfo: string
  ingredients: Array<IngredientInputType>
}

export interface RecipeInputType {
  title: string
  description: string
  servings: number
  recipeTime: number
  steps: Array<RecipeStepInputType>
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
