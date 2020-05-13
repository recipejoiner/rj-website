import gql from 'graphql-tag';

interface ShortRecipeInfo {
  cursor: string;
  node: {
    id: string;
    by: {
      username: string;
    }
    title: string;
    handle: string;
    description: string;
    servings: string;
  }
}
export interface AllRecipesData {
  allRecipes: {
    pageInfo: {
      hasNextPage: boolean;
    }
    edges: Array<ShortRecipeInfo>;
  }
}
export interface AllRecipesVars {
  cursor: string;
}
export const ALL_RECIPES = gql`
  query getAllRecipes($cursor: String) {
    allRecipes(first: 7, after: $cursor) {
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