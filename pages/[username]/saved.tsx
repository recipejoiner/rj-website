import Head from 'next/head'
import { NextPage } from 'next'
import * as React from 'react'
import { useRouter } from 'next/router'

import { UserSavedRecipes } from 'components/homepage/RecipeFeed'

interface RecipeFeedProps {}

const RecipeFeed: NextPage<RecipeFeedProps> = ({}) => {
  const router = useRouter()
  const { username } = router.query

  if (typeof username === 'string') {
    const title = `${username}'s Saved Recipes - RecipeJoiner`
    const description = 'Your Saved Recipes!!'

    return (
      <React.Fragment>
        <Head>
          {/* Give the title a key so that it's not duplicated - this allows me to change the page title on other pages */}
          <title key="title">{title}</title>
          <meta charSet="utf-8" />
          <meta key="description" name="description" content={description} />
          {/* OpenGraph tags */}
          <meta
            key="og:url"
            property="og:url"
            content={`${process.env.NEXT_PUBLIC_BASE_URL}/recipes/saved`}
          />
          <meta key="og:title" property="og:title" content={title} />
          <meta
            key="og:description"
            property="og:description"
            content={description}
          />
          {/* OpenGraph tags end */}
        </Head>
        <UserSavedRecipes username={username} />
      </React.Fragment>
    )
  } else {
    return <div>Error!</div>
  }
}

export default RecipeFeed
