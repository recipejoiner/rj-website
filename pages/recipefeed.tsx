import Head from 'next/head';
import { NextPage } from 'next';
import * as React from 'react';

import {ALL_RECIPES, AllRecipesData, AllRecipesVarsType, ShortRecipeInfoType} from 'requests/recipes';

import InfiniteScroll, { EdgeType } from 'components/InfiniteScroll';
import ShortRecipe from 'components/ShortRecipe'

interface RecipeFeedProps {}

const RecipeFeed: NextPage<RecipeFeedProps> = ({}) => {

  const queryDataInit: AllRecipesData = {
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

  const title = "Recipe Feed - RecipeJoiner";
  const description = "All of our chefs' recipes!";

  return(
    <React.Fragment>
      <Head>
        {/* Give the title a key so that it's not duplicated - this allows me to change the page title on other pages */}
        <title key="title">{title}</title>
        <meta charSet="utf-8" />
        <meta
          key="description"
          name="description"
          content={description}
        />
        {/* OpenGraph tags */}
        <meta key="og:url" property="og:url" content={`${process.env.NEXT_PUBLIC_BASE_URL}/recipefeed`} />
        <meta key="og:title" property="og:title" content={title} />
        <meta key="og:description" property="og:description" content={description} />
        {/* OpenGraph tags end */}
      </Head>
      <InfiniteScroll
        QUERY={ALL_RECIPES}
        QueryData={queryDataInit}
        QueryVars={AllRecipesVars}
      >
        { (edges: Array<EdgeType<ShortRecipeInfoType>>) =>
          <ul
            className="p-10"
          >
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
    </React.Fragment>
  );
}

export default RecipeFeed;