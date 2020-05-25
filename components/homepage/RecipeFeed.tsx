import Head from 'next/head';
import { NextPage } from 'next';
import * as React from 'react';

import { AllRecipesVarsType, ShortRecipeInfoType, ALL_RECIPES } from 'requests/recipes';
import { UserRecipeFeedData, UserRecipeFeedVarsType, USER_RECIPES_FEED } from 'requests/recipes';

import InfiniteScroll, { EdgeType, QueryResultRes, QueryConnectionRes } from 'components/InfiniteScroll';
import ShortRecipe from 'components/ShortRecipe'

const connectionDataInit = {
  connection: {
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
  },
  __typename: ""
}

interface UserRecipesFeedProps {}
export const UserRecipesFeed: React.FC<UserRecipesFeedProps> = ({}) => {

  const queryDataInit: QueryResultRes<ShortRecipeInfoType> = {
    result: connectionDataInit,
    __typename: ""
  };

  const UserRecipesVars: UserRecipeFeedVarsType = {
    cursor: null
  }

  return(
    <div className="bg-gray-100 pt-5 px-5 border-t">
      <h3
        className="text-center text-xl font-bold"
      >
        Your Recipe Feed
      </h3>
      <InfiniteScroll
        QUERY={USER_RECIPES_FEED}
        QueryData={queryDataInit}
        QueryVars={UserRecipesVars}
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

interface AllRecipesFeedProps {}
export const AllRecipesFeed: React.FC<AllRecipesFeedProps> = ({}) => {

  const queryDataInit: QueryConnectionRes<ShortRecipeInfoType> = connectionDataInit;

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
