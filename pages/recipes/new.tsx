import Head from 'next/head';
import { NextPage } from 'next';
import * as React from 'react';

interface NewRecipePageProps {}

const NewRecipePage: NextPage<NewRecipePageProps> = ({}) => {
  const title = "New Recipe - RecipeJoiner";
  const description = "Create a new recipe, and share it with your fellow chefs!";

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
      <div>New recipe form will go here</div>
    </React.Fragment>
  );
}

export default NewRecipePage;