import gql from 'graphql-tag';

import { EdgeType } from 'components/InfiniteScroll';

export interface ShortRecipeInfoType {
  id: string;
  by: {
    username: string;
    __typename: string;
  }
  title: string;
  handle: string;
  description: string;
  servings: string;
  __typename: string;
}
export interface AllRecipesData {
  result: {
    pageInfo: {
      hasNextPage: boolean;
      __typename: string;
    }
    edges: Array<EdgeType<ShortRecipeInfoType>>;
    __typename: string;
  }
}
export interface AllRecipesVarsType {
  cursor: string | null;
}
export const ALL_RECIPES = gql`
  query getAllRecipes($cursor: String) {
    result: allRecipes(first: 10, after: $cursor) {
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
`;

export interface IngredientType {
  ingredientInfo: {
    name: string;
  }
  quantity: number;
  unit: {
    name: string;
  }
}

export interface RecipeStepType {
  stepNum: number;
  stepTime: number;
  desciption: string;
  ingredients: Array<IngredientType>;
}

export interface RecipeType {
  result: {
    by: {
      username: string;
    }
    id: string;
    title: string;
    handle: string;
    description: string;
    servings: string;
    steps: Array<RecipeStepType>;
  }
}

export const RECIPE_BY_USERNAME_AND_HANDLE = gql `
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
`;