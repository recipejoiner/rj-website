import Head from 'next/head';
import { NextPage } from 'next';
import * as React from 'react';

import client from 'requests/client';
import {ALL_RECIPES, AllRecipesData, AllRecipesVars} from 'requests/recipes';
import { useQuery } from '@apollo/react-hooks';

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
  )

  return(
    <React.Fragment>
      {data && 
      (
        <ul className="m-10">
          {
            data.allRecipes.edges.map((recipe) => {
              const { node } = recipe;
              const { id, by, title, description, servings } = node;
              return(
                <li
                  key={id}
                  className="my-5 p-5 bg-gray-100 rounded-lg shadow-lg"
                >
                  <h3>{title}</h3>
                  <span>{by.username}</span>
                  <span>{servings}</span>
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