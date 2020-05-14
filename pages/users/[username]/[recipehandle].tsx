import * as React from 'react';
import Head from 'next/head';
import { NextPage } from 'next';
import { GetStaticProps, GetStaticPaths } from 'next';
import { ParsedUrlQuery } from 'querystring';

import { RecipeType, RECIPE_BY_USERNAME_AND_HANDLE } from 'requests/recipes';
import client from 'requests/client';

interface RecipeProps {
  recipe?: RecipeType;
  errors?: string;
}

const RecipePage: NextPage<RecipeProps> = (props) => {
  const { recipe, errors } = props;
  if (recipe) {
  return(
    <React.Fragment>
      <div>
        Recipe page!
      </div>
    </React.Fragment>
  );
  }
  else {
    return (
      <React.Fragment>
        <Head>
          <title key="title">Error | AME Ultrasounds</title>
        </Head>
        <p>
          <span
            className="bg-white text-red text-xl font-bold"
          >
            Error:
          </span>
          {
            errors
            ?
            {errors}
            :
            "Can't load errors"
          }
        </p>
      </React.Fragment>
    )
  }
}

export const getStaticPaths: GetStaticPaths = async () => {

	type Path = { params: ParsedUrlQuery }
	// type RecipeInfo = {
	// 	cursor: string;
	// 	node: {
	// 		handle: string;
	// 		updatedAt: string;
	// 	}
	// }
	var paths: Array<Path> = [];
	
	// const recipeInfo: Array<RecipeInfo> = await getRecipesInfo() // todo

  // recipeInfo.map((recipeInfo) => {
  //   paths.push({
  //     params: { username: recipeInfo.node.by.username, recipehandle: recipeInfo.node.handle },
  //   });
  // });
  return {
    paths,
    fallback: true
  }
}

export const getStaticProps: GetStaticProps = async ctx => {

  try {
    const { params } = ctx;

    const username = params?.username;
    const recipehandle = params?.recipehandle;

    const token = process.env.NEXT_PUBLIC_RJ_API_TOKEN || ""
  
		const data: RecipeType = await client.query({
			query: RECIPE_BY_USERNAME_AND_HANDLE,
			variables: {
        username: username,
        handle: recipehandle,
      },
      context: {
        // example of setting the headers with context per operation
        headers: {
          authorization: `Bearer ${token}`
        }
      }
		}).then(res => {
			return(res.data)
		});
		return { props: { recipe: data }};
  } catch (err) {
    return { props: { errors: err.message }};
  }
}

export default RecipePage;