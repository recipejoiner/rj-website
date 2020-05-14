import * as React from 'react';
import Head from 'next/head';
import { NextPage } from 'next';
import { GetStaticProps, GetStaticPaths } from 'next';
import { ParsedUrlQuery } from 'querystring';
import Skeleton from 'react-loading-skeleton';

import { RecipeType, RecipeStepType, RECIPE_BY_USERNAME_AND_HANDLE } from 'requests/recipes';
import client from 'requests/client';

interface RecipeProps {
  recipe: RecipeType;
}

interface StepProps {
  step?: RecipeStepType;
}
const Step: React.FC<StepProps> = ({
  step
}) => {
  const { stepNum, stepTime, description, ingredients, } = step || {};
  return(
    <li>
      <h3>Step {stepNum  || <Skeleton width={40}/>}: About {stepTime || <Skeleton width={40}/>} minutes</h3>
      <p>{description || <Skeleton count={5}/>}</p>
    </li>
  );
}

const RecipePage: NextPage<RecipeProps> = (props) => {
  const { recipe } = props;
  const { by, description, handle, id, steps, servings, title } = recipe?.result || {};
  const { username } = by || {};

  const pageTitle = `${title ? title.toLowerCase() : "a recipe"}, by ${by ? by.username : "rj"} - RecipeJoiner`;
  const pageDescription = description;
  return(
    <React.Fragment>
      {
        recipe &&
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
          <meta key="og:url" property="og:url" content={`${process.env.NEXT_PUBLIC_BASE_URL}/users/${username}/${handle}`} />
          <meta key="og:title" property="og:title" content={pageTitle} />
          <meta key="og:description" property="og:description" content={pageDescription} />
          {/* OpenGraph tags end */}
        </Head>
      }
      <h1>{title || <Skeleton />}</h1>
      <div>By Chef {username || <Skeleton width={20}/>}</div>
      <p>{description || <Skeleton />}</p>
      <ul>
        {
          steps ? steps.map((step) => <Step step={step} key={step.stepNum}/>)
          : [1, 2].map((num) => <Step key={num}/>)
        }
      </ul>
    </React.Fragment>
  );
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
    // handle error - probably put honeybadger here or something
    return { props: {}};
  }
}

export default RecipePage;