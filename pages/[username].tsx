import Head from 'next/head'
import { NextPage, GetServerSideProps } from 'next'
import * as React from 'react'

import client from 'requests/client'
import { getToken } from 'helpers/auth'
import {
  UserInfoType,
  UserByUsernameVarsType,
  USER_INFO_BY_USERNAME,
} from 'requests/auth'

interface UserPageProps {
  userInfo: UserInfoType
}

const UserPage: NextPage<UserPageProps> = ({ userInfo }) => {
  const { result } = userInfo || {}
  const { id, username, recipeCount, followerCount, followingCount } =
    result || {}
  const title = `chef ${username} - RecipeJoiner`
  const description = `Check out all recipes by chef ${username}!`

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
          content={`${process.env.NEXT_PUBLIC_BASE_URL}/${username}`}
        />
        <meta key="og:title" property="og:title" content={title} />
        <meta
          key="og:description"
          property="og:description"
          content={description}
        />
        {/* OpenGraph tags end */}
      </Head>
      <div className="flex flex-col">
        <header className="p-2">
          <h1 className="text-xl">{username}</h1>
        </header>
        <div>
          <div>{recipeCount} recipes</div>
        </div>
      </div>
    </React.Fragment>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const { params } = ctx

    const username = params?.username as string | undefined

    const data: UserInfoType = await client
      .query({
        query: USER_INFO_BY_USERNAME,
        variables: {
          username: username,
        },
        context: {
          headers: {
            authorization: `Bearer ${getToken(ctx)}`,
          },
        },
      })
      .then((res) => {
        return res.data
      })

    return {
      props: { userInfo: data },
    }
  } catch (err) {
    console.log('err', err)
    return {
      props: {},
    }
  }
}

export default UserPage
