import Head from 'next/head';
import { NextPage } from 'next';
import * as React from 'react';

import client from 'requests/client';
import {ALL_RECIPES, AllRecipesData, AllRecipesVars} from 'requests/recipes';
import { useQuery } from '@apollo/react-hooks';
import { useEvent } from 'helpers/methods';

interface RecipeFeedProps {}

const RecipeFeed: NextPage<RecipeFeedProps> = ({}) => {

  const token = process.env.NEXT_PUBLIC_RJ_API_TOKEN || ""

  const { loading, data, error, fetchMore } = useQuery<AllRecipesData, AllRecipesVars>(
    ALL_RECIPES,
    {
      client: client,
      context: {
        headers: {
          authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        }
      }
    }
  );

  const [activelyFetching, setActivelyFetching] = React.useState(false);

  const [recipeFeedData, setRecipeFeedData] = React.useState<AllRecipesData>(
    {
      allRecipes: {
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
  );

  const onLoadMore = () => {
    setActivelyFetching(true);
    const { edges } = recipeFeedData.allRecipes;
    const lastCursor = edges[edges.length - 1].cursor;
    console.log(lastCursor)
    fetchMore({
      variables: {
        cursor: lastCursor
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (fetchMoreResult) {
          console.log("prev", prev);
          console.log("fetchmoreresult", fetchMoreResult);
          let combinedData: AllRecipesData = {
            allRecipes: {
              pageInfo: fetchMoreResult.allRecipes.pageInfo,
              edges: [...prev.allRecipes.edges, ...fetchMoreResult.allRecipes.edges],
              __typename: "RecipeConnection"
            }
          }
          setRecipeFeedData(combinedData);
        }
        console.log("recipeFeedData", recipeFeedData)
        return(recipeFeedData);
      }
    })
    setActivelyFetching(false);
  }

  const handleScroll = () => {
    if (!activelyFetching && ((window.innerHeight + window.scrollY) >= document.body.offsetHeight)) {
      onLoadMore();
    }
  };

  useEvent('scroll', handleScroll);
  // window.addEventListener('scroll', (e)=>console.log(e.currentTarget));

  // for initial load
  const [loaded, setLoad] = React.useState(false);
  if(loaded === false && data){
		setRecipeFeedData(data);
		setLoad(true);
	}
  return(
    <React.Fragment>
      {loaded && 
      (
        <ul
          className="p-10 overflow-scroll"
        >
          {
            recipeFeedData.allRecipes.edges.map((recipe) => {
              const { node } = recipe;
              const { id, by, title, description, servings } = node;
              return(
                <li
                  key={id}
                  className="my-5 p-5 bg-gray-100 rounded-lg shadow-lg"
                >
                  <div className="text-xl">{id}</div>
                  <h3>{title}</h3>
                  <div>Chef: {by.username}</div>
                  <div>{servings}</div>
                  <p>{description}</p>
                </li>
              )
            })
          }
        </ul>
      )
      }
    </React.Fragment>
  )
}

export default RecipeFeed