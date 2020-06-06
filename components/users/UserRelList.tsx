import React from 'react'
import Link from 'next/link'

import {
  FollowRelListNodeType,
  followConnectionNodeInit,
  FollowRelListByUsernameVars,
  FOLLOWING_BY_USERNAME,
  FOLLOWERS_BY_USERNAME,
} from 'requests/users'
import InfiniteScroll, { EdgeType } from 'components/InfiniteScroll'
import FollowChangeBtn from 'components/FollowChangeBtn'

type UserRelListProps = {
  username: string
  relationship: 'following' | 'followers'
}

const UserRelList: React.FC<UserRelListProps> = ({
  username,
  relationship,
}) => {
  const UsersFollowRelVars: FollowRelListByUsernameVars = {
    username: username,
    cursor: null,
  }

  return (
    <React.Fragment>
      <h3 className="text-center border-b fixed w-80 rounded-t pt-2 h-10 bg-white">
        {relationship === 'following' ? 'Following' : 'Followers'}
      </h3>
      <InfiniteScroll
        QUERY={
          relationship === 'following'
            ? FOLLOWING_BY_USERNAME
            : FOLLOWERS_BY_USERNAME
        }
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
            <ul className="mt-10 p-2">
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
                        <h4>{edge.node.username}</h4>
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

export default UserRelList
