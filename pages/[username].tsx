import Head from 'next/head'
import { NextPage, GetServerSideProps } from 'next'
import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'

import client from 'requests/client'
import { getToken } from 'helpers/auth'
import {
  UserInfoType,
  UserByUsernameVarsType,
  USER_INFO_BY_USERNAME,
} from 'requests/users'
import { recipeConnectionNodeInit } from 'requests/recipes'
import {
  UserRecipesByUsernameVarsType,
  ShortRecipeNodeType,
  ALL_USER_RECIPES_BY_USERNAME,
} from 'requests/recipes'
import InfiniteScroll, { EdgeType } from 'components/InfiniteScroll'
import ShortRecipe from 'components/ShortRecipe'
import UserContext from 'helpers/UserContext'
import SettingsBtn from 'components/SettingsBtn'
import FollowChangeBtn from 'components/FollowChangeBtn'
import Following from 'components/users/following'

interface UserPageProps {
  userInfo: UserInfoType
}

const UserPage: NextPage<UserPageProps> = ({ userInfo }) => {
  const router = useRouter()
  const { result } = userInfo || {}
  const {
    id,
    username,
    recipeCount,
    followerCount,
    followingCount,
    areFollowing,
  } = result || {}

  // want to be able to increment/decrement this based on clicking follow/unfollow
  const [followerCountState, setFollowerCountState] = React.useState(
    followerCount
  )

  const stats = [
    { name: 'recipes', count: recipeCount, link: { href: '#', as: '#' } },
    {
      name: 'followers',
      count: followerCountState,
      link: { href: '/[username]/followers', as: `/${username}/followers` },
    },
    {
      name: 'following',
      count: followingCount,
      link: { href: '/[username]/following', as: `/${username}/following` },
    },
  ]

  const [followingStatus, setFollowingStatus] = React.useState(areFollowing)

  // don't want this effect to run on first mount
  const didMount = React.useRef(false)
  React.useEffect(() => {
    if (didMount.current) {
      if (followingStatus === false) {
        setFollowerCountState(followerCountState - 1)
      }
      if (followingStatus === true) {
        setFollowerCountState(followerCountState + 1)
      }
    } else {
      didMount.current = true
    }
  }, [followingStatus]) // only run effect if followingStatus changes. note that it also runs on initial component mount, hence the useRef

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
        <div className="m-auto max-w-3xl min-w-full">
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
                  setFollowingStatus={(status: boolean) =>
                    setFollowingStatus(status)
                  }
                  username={username}
                />
              </div>
            )}
          </header>
          <ul className="flex flex-row text-gray-500 font-semibold text-sm leading-tight border-t border-b py-3">
            {stats.map((stat) => {
              const { name, count, link } = stat
              return (
                <li className="text-center w-1/3" key={name}>
                  <Link href={link.href} as={link.as}>
                    <a>
                      <span className="block text-gray-900 font-bold">
                        {count}
                      </span>
                      {name}
                    </a>
                  </Link>
                </li>
              )
            })}
          </ul>
          <InfiniteScroll
            QUERY={ALL_USER_RECIPES_BY_USERNAME}
            hasJustConnection={false}
            nodeInit={recipeConnectionNodeInit}
            QueryVars={UsersRecipesVars}
          >
            {(edges: Array<EdgeType<ShortRecipeNodeType>>) => {
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

    if (username === 'undefined' || typeof username === 'undefined') {
      throw 'Username must be defined'
    }

    const queryVars: UserByUsernameVarsType = {
      username: username,
    }

    const data: UserInfoType = await client
      .query({
        query: USER_INFO_BY_USERNAME,
        variables: queryVars,
        // Prevent caching issues when following/unfollowing users, primarily. Want the follow/unfollow state to be consistent
        fetchPolicy: 'network-only',
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
