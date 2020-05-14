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
    const { by, description, handle, id, servings, steps, title } = recipe.result;

    const pageTitle = `${title.toLowerCase()}, by ${by.username} - RecipeJoiner`;
    const pageDescription = description;
    return(
      <React.Fragment>
        <Head>
          {/* Give the title a key so that it's not duplicated - this allows me to change the page title on other pages */}
          <title key="title">{pageTitle}</title>
          <meta charSet="utf-8" />
          <meta
            key="description"
            name="description"
            content={description}
          />
          {/* OpenGraph tags */}
          <meta key="og:url" property="og:url" content={`${process.env.NEXT_PUBLIC_BASE_URL}/users/${by.username}/${handle}`} />
          <meta key="og:title" property="og:title" content={pageTitle} />
          <meta key="og:description" property="og:description" content={pageDescription} />
          {/* OpenGraph tags end */}
        </Head>
        <h1>{title}</h1>
        <div>By Chef {by.username}</div>
        <p>{description}</p>
        <ul>
          {
            steps.map((step) => {
              const { stepNum, stepTime, description, ingredients, } = step;
              return(
                <li key={stepNum}>
                  <h3>Step {stepNum}: About {stepTime} minutes</h3>
                  <p>{description}</p>
                </li>
              );
            })
          }
        </ul>
      </React.Fragment>
    );
  }
  else if (errors) {
    return (
      <React.Fragment>
        <Head>
          <title key="title">Error - RecipeJoiner</title>
        </Head>
        <p>
          <span
            className="bg-white text-red text-xl font-bold"
          >
            Error:
          </span>
          {errors}
        </p>
      </React.Fragment>
    );
  }
  else {
    return (
      <div>loading</div>
    );
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