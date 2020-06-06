import { NextPage } from 'next'
import Link from 'next/link'
import Head from 'next/head'
import { useRouter } from 'next/router'
import React from 'react'

import UserContext from 'helpers/UserContext'
import {
  FollowRelListNodeType,
  followConnectionNodeInit,
  FollowRelListByUsernameVars,
  FOLLOWING_BY_USERNAME,
} from 'requests/users'
import InfiniteScroll, { EdgeType } from 'components/InfiniteScroll'
import FollowChangeBtn from 'components/FollowChangeBtn'

type Props = {}

const Following: NextPage<Props> = ({}) => {
  const { currentUserInfo } = React.useContext(UserContext)
  const router = useRouter()
  const { username } = router.query

  if (username === 'undefined' || typeof username !== 'string') {
    throw 'Username must be a valid string'
  }

  const UsersFollowRelVars: FollowRelListByUsernameVars = {
    username: username,
    cursor: null,
  }

  return (
    <React.Fragment>
      {/* <Head></Head> */}
      <InfiniteScroll
        QUERY={FOLLOWING_BY_USERNAME}
        hasJustConnection={false}
        nodeInit={followConnectionNodeInit}
        QueryVars={UsersFollowRelVars}
      >
        {(edges: Array<EdgeType<FollowRelListNodeType>>) => {
          const [
            followingStatusRecord,
            setFollowingStatusRecord,
          ] = React.useState<Record<string, boolean | null>>({})
          const setFollowingStatus = (
            username: string,
            status: boolean | null
          ) => {
            const newFollowingStatusRecord = { ...followingStatusRecord }
            newFollowingStatusRecord[username] = status
            setFollowingStatusRecord(newFollowingStatusRecord)
          }
          return (
            <ul>
              {edges.map((edge) => {
                // make sure that the edge is defined (and not the initializer), and that the followStatus of this username hasn't yet been initialized
                // else, it'll keep trying to update that status and throw a 'too many re-renders' error
                if (
                  edge.cursor !== '' &&
                  followingStatusRecord[edge.node.username] === undefined
                ) {
                  setFollowingStatus(edge.node.username, edge.node.areFollowing)
                }
                return (
                  <li
                    key={edge.cursor}
                    className="flex flex-row justify-between p-1"
                  >
                    <Link
                      href="/[username]"
                      as={`/${edge.node.username || '#'}`}
                    >
                      <a>
                        <h3>{edge.node.username}</h3>
                      </a>
                    </Link>
                    <FollowChangeBtn
                      followingStatus={
                        followingStatusRecord[edge.node.username]
                      }
                      setFollowingStatus={(status: boolean) => {
                        setFollowingStatus(edge.node.username, status)
                      }}
                      username={edge.node.username}
                    />
                  </li>
                )
              })}
            </ul>
          )
        }}
      </InfiniteScroll>
    </React.Fragment>
  )
}

export default Following
