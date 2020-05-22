import Head from 'next/head';
import { NextPage } from 'next';
import * as React from 'react';

import {ALL_RECIPES, AllRecipesVarsType, ShortRecipeInfoType} from 'requests/recipes';

import InfiniteScroll, { EdgeType, QueryRes } from 'components/InfiniteScroll';
import ShortRecipe from 'components/ShortRecipe'

interface RecipeFeedProps {}

const RecipeFeed: React.FC<RecipeFeedProps> = ({}) => {

  const queryDataInit: QueryRes<ShortRecipeInfoType> = {
    result: {
      pageInfo: {
        hasNextPage: true,
        __typename: ""
      },
      edges: [
        {
          cursor: "",
          node: {
            id: "",
            by: {
              username: "",
              __typename: ""
            },
            title: "",
            handle: "",
            description: "",
            servings: "",
            __typename: ""
          },
          __typename: ""
        }
      ],
      __typename: ""
    }
  }

  const AllRecipesVars: AllRecipesVarsType = {
    cursor: null
  }

  return(
    <div className="bg-gray-100 pt-5 px-5 border-t">
      <h3
        className="text-center text-xl font-bold"
      >
        Check out some of our latest recipes!
      </h3>
      <InfiniteScroll
        QUERY={ALL_RECIPES}
        QueryData={queryDataInit}
        QueryVars={AllRecipesVars}
      >
        { (edges: Array<EdgeType<ShortRecipeInfoType>>) =>
          <ul>
            {
              edges.map((edge) => {
                return(
                  <ShortRecipe
                    edge={edge}
                    key={edge.cursor}
                  />
                );
              })
            }
          </ul>
        }
      </InfiniteScroll>
    </div>
  );
}

export default RecipeFeed;