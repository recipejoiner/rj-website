import Head from 'next/head';
import { NextPage } from 'next';
import * as React from 'react';

import { AllRecipesFeed } from 'components/homepage/RecipeFeed';

interface RecipeFeedProps {}

const RecipeFeed: NextPage<RecipeFeedProps> = ({}) => {
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
        <meta key="og:url" property="og:url" content={`${process.env.NEXT_PUBLIC_BASE_URL}/recipes`} />
        <meta key="og:title" property="og:title" content={title} />
        <meta key="og:description" property="og:description" content={description} />
        {/* OpenGraph tags end */}
      </Head>
      <AllRecipesFeed />
    </React.Fragment>
  );
}

export default RecipeFeed;