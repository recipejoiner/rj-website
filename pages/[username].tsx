import Head from 'next/head'
import { NextPage, GetServerSideProps } from 'next'
import * as React from 'react'

import client from 'requests/client'
import { getToken } from 'helpers/auth'
import {
  UserInfoType,
  UserByUsernameVarsType,
  USER_INFO_BY_USERNAME,
} from 'requests/users'
import { recipeConnectionDataInit } from 'requests/recipes'
import {
  UserRecipeFeedData,
  UserRecipesByUsernameVarsType,
  ShortRecipeInfoType,
  ALL_USER_RECIPES_BY_USERNAME,
} from 'requests/recipes'
import InfiniteScroll, {
  EdgeType,
  QueryResultRes,
  QueryConnectionRes,
} from 'components/InfiniteScroll'
import ShortRecipe from 'components/ShortRecipe'
import UserContext from 'helpers/UserContext'
import SettingsBtn from 'components/SettingsBtn'
import FollowChangeBtn from 'components/FollowChangeBtn'

interface UserPageProps {
  userInfo: UserInfoType
}

const UserPage: NextPage<UserPageProps> = ({ userInfo }) => {
  const { result } = userInfo || {}
  const {
    id,
    username,
    recipeCount,
    followerCount,
    followingCount,
    areFollowing,
  } = result || {}

  const stats = [
    { name: 'recipes', count: recipeCount },
    { name: 'followers', count: followerCount },
    { name: 'following', count: followingCount },
  ]

  const [followingStatus, setFollowingStatus] = React.useState(areFollowing)

  const queryDataInit: QueryResultRes<ShortRecipeInfoType> = {
    result: recipeConnectionDataInit,
    __typename: '',
  }
  const UsersRecipesVars: UserRecipesByUsernameVarsType = {
    username: username,
    cursor: null,
  }

  const [onOwnPage, setOnOwnPage] = React.useState(false)
  const { currentUserInfo } = React.useContext(UserContext)
  if (
    currentUserInfo &&
    !onOwnPage &&
    currentUserInfo.me.username == username
  ) {
    setOnOwnPage(true)
  }

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
        <div className="m-auto max-w-3xl">
          <header className="p-2">
            {onOwnPage ? (
              <div className="flex flex-row justify-start">
                <h1 className="text-3xl pr-1">{username}</h1>
                <SettingsBtn />
              </div>
            ) : (
              <div className="flex flex-col">
                <h1 className="text-xl">{username}</h1>
                <FollowChangeBtn
                  followingStatus={followingStatus}
                  setFollowingStatus={setFollowingStatus}
                />
              </div>
            )}
          </header>
          <ul className="flex flex-row text-gray-500 font-semibold text-sm leading-tight border-t border-b py-3">
            {stats.map((stat) => {
              return (
                <li className="text-center w-1/3" key={stat.name}>
                  <span className="block text-gray-900 font-bold">
                    {stat.count}
                  </span>
                  {stat.name}
                </li>
              )
            })}
          </ul>
          <InfiniteScroll
            QUERY={ALL_USER_RECIPES_BY_USERNAME}
            QueryData={queryDataInit}
            QueryVars={UsersRecipesVars}
          >
            {(edges: Array<EdgeType<ShortRecipeInfoType>>) => {
              return (
                <ul>
                  {edges.map((edge) => {
                    return <ShortRecipe edge={edge} key={edge.cursor} />
                  })}
                </ul>
              )
            }}
          </InfiniteScroll>
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
