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
import UserRelList from 'components/modalviews/UserRelList'

interface UserPageProps {
  userInfo: UserInfoType
}

const UserPage: NextPage<UserPageProps> = ({ userInfo }) => {
  const { result } = userInfo || {}
  const {
    id,
    username,
    profileImageUrl,
    recipeCount,
    followerCount,
    followingCount,
    areFollowing,
  } = result || {}
  const { currentUserInfo, modalOpen, setModalState } = React.useContext(
    UserContext
  )

  const openFollowers = () => {
    setModalState &&
      setModalState(
        true,
        'Followers',
        <UserRelList
          username={username}
          relationship="followers"
          inModal={true}
        />
      )
  }
  const openFollowing = () => {
    setModalState &&
      setModalState(
        true,
        'Following',
        <UserRelList
          username={username}
          relationship="following"
          inModal={true}
        />
      )
  }

  // const router = useRouter()
  // const { view } = router.query
  // if (
  //   view &&
  //   username &&
  //   typeof view === 'string' &&
  //   typeof modalOpen !== 'undefined' &&
  //   !modalOpen
  // ) {
  //   if (view === 'followers') {
  //     openFollowers()
  //   }
  // }

  // want to be able to increment/decrement this based on clicking follow/unfollow
  const [followerCountState, setFollowerCountState] = React.useState(
    followerCount
  )

  const [stats, setStats] = React.useState([
    { name: 'recipes', count: recipeCount, onClick: () => {} },
    {
      name: 'followers',
      count: followerCountState,
      onClick: openFollowers,
    },
    {
      name: 'following',
      count: followingCount,
      onClick: openFollowing,
    },
  ])

  const [followingStatus, setFollowingStatus] = React.useState(areFollowing)

  // don't want this effect to run on first mount
  // this effect is currently not functioning
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

  // handle navigating directly from one profile page to another - need to reload this and a bunch of info
  const [currUsername, setCurrUsername] = React.useState(username)
  if (username !== currUsername) {
    setCurrUsername(username)
    console.log('followerCount', followerCount)
    setFollowerCountState(followerCount)
    setStats([
      { name: 'recipes', count: recipeCount, onClick: () => {} },
      {
        name: 'followers',
        count: followerCount,
        onClick: openFollowers,
      },
      {
        name: 'following',
        count: followingCount,
        onClick: openFollowing,
      },
    ])
  }
  React.useEffect(() => {
    setFollowingStatus(areFollowing)
    didMount.current = false
    if (
      currentUserInfo &&
      !onOwnPage &&
      currentUserInfo.me.username == username
    ) {
      setOnOwnPage(true)
    } else {
      setOnOwnPage(false)
    }
  }, [currUsername]) // run on first render and whenever currUsername changes

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
          <header className="mx-2 my-4 flex flex-row">
            <div className="w-20 h-20 my-2 ml-2 mr-6">
              <img
                className="object-cover w-full h-20 rounded-full"
                src={profileImageUrl || require('images/chef-rj.svg')}
              />
            </div>
            {onOwnPage ? (
              <div className="flex flex-col sm:flex-row justify-start">
                <h1 className="text-3xl pr-1">{username}</h1>
                <SettingsBtn />
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row">
                <h1 className="text-3xl sm:pr-2">{username}</h1>
                <div className="mt-1 sm:mt-2">
                  <FollowChangeBtn
                    followingStatus={followingStatus}
                    setFollowingStatus={(status: boolean) =>
                      setFollowingStatus(status)
                    }
                    username={username}
                  />
                </div>
              </div>
            )}
          </header>
          <ul className="flex flex-row text-gray-500 font-semibold text-sm leading-tight border-t border-b py-3">
            {stats.map((stat) => {
              const { name, count, onClick } = stat
              return (
                <li className="text-center w-1/3" key={name}>
                  <button onClick={onClick}>
                    <span className="block text-gray-900 font-bold">
                      {count}
                    </span>
                    {name}
                  </button>
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
