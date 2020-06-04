import gql from 'graphql-tag'

export interface UserFollowChangeReturnType {
  result: {
    user: {
      username: string
      areFollowing: boolean
    }
  }
}
export interface UserFollowChangeVars {
  username: string
}
export const FOLLOW = gql`
  mutation followUser($username: String!) {
    result: followUser(username: $username) {
      user {
        username
        areFollowing
      }
    }
  }
`
export const UNFOLLOW = gql`
  mutation unfollowUser($username: String!) {
    result: unfollowUser(username: $username) {
      user {
        username
        areFollowing
      }
    }
  }
`
