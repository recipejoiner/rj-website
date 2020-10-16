import React from 'react'
import Link from 'next/link'
import Skeleton from 'react-loading-skeleton'

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
  inModal?: boolean
  followingCountStat: number
  setFollowingCountStat: (amount: number) => void
  followerCountStat: number
  setFollowerCountStat: (amount: number) => void
}

const UserRelList: React.FC<UserRelListProps> = ({
  username,
  relationship,
  inModal,
  followingCountStat,
  setFollowingCountStat,
  followerCountStat,
  setFollowerCountStat,
}) => {
  const UsersFollowRelVars: FollowRelListByUsernameVars = {
    username: username,
    cursor: null,
  }

  return (
    <React.Fragment>
      {/* <h3 className="text-center border-b fixed w-80 rounded-t pt-2 h-10 bg-white">
        {relationship === 'following' ? 'Following' : 'Followers'}
      </h3> */}
      <InfiniteScroll
        QUERY={
          relationship === 'following'
            ? FOLLOWING_BY_USERNAME
            : FOLLOWERS_BY_USERNAME
        }
        hasJustConnection={false}
        nodeInit={followConnectionNodeInit}
        QueryVars={UsersFollowRelVars}
        inModal={inModal}
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
            <ul className="p-2">
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
                    className="flex flex-row justify-between px-2 py-3"
                  >
                    <Link
                      href="/[username]"
                      as={`/${edge.node.username || '#'}`}
                    >
                      <a className="flex flex-row">
                        <div className="w-8 h-8 mr-2">
                          {edge.node.username ? (
                            <img
                              className="object-cover w-full h-8 rounded-full"
                              src={
                                edge.node.profileImageUrl ||
                                require('images/chef-rj.svg')
                              }
                            />
                          ) : (
                            <Skeleton
                              circle={true}
                              height="2rem"
                              width="2rem"
                            />
                          )}
                        </div>
                        <h4>
                          {edge.node.username || (
                            <Skeleton height={20} width={150} />
                          )}
                        </h4>
                      </a>
                    </Link>
                    {edge.node.username ? (
                      <FollowChangeBtn
                        followingStatus={
                          followingStatusRecord[edge.node.username]
                        }
                        setFollowingStatus={(status: boolean) => {
                          setFollowingStatus(edge.node.username, status)
                        }}
                        followingCountStat={followingCountStat}
                        setFollowingCountStat={setFollowingCountStat}
                        followerCountStat={followerCountStat}
                        setFollowerCountStat={setFollowerCountStat}
                        username={edge.node.username}
                      />
                    ) : (
                      <Skeleton height={30} width={50} />
                    )}
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
