import gql from 'graphql-tag';

interface ShortRecipeInfo {
  cursor: string;
  node: {
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
  __typename: string;
}
export interface AllRecipesData {
  allRecipes: {
    pageInfo: {
      hasNextPage: boolean;
      __typename: string;
    }
    edges: Array<ShortRecipeInfo>;
    __typename: string;
  }
}
export interface AllRecipesVars {
  cursor: string;
}
export const ALL_RECIPES = gql`
  query getAllRecipes($cursor: String) {
    allRecipes(first: 10, after: $cursor) {
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