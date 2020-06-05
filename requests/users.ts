import gql from 'graphql-tag'

export interface UserInfoType {
  result: {
    id: string
    username: string
    recipeCount: number
    followerCount: number
    followingCount: number
    areFollowing: boolean | null
    firstName: string | null
    lastName: string | null
  }
}
export interface UserByUsernameVarsType {
  username: string
}
export const USER_INFO_BY_USERNAME = gql`
  query userByUsername($username: String!) {
    result: userByUsername(username: $username) {
      id
      username
      recipeCount
      followerCount
      followingCount
      areFollowing # will be null if not logged in
      firstName
      lastName
      createdAt
    }
  }
`

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

// use these with QueryResultRes
export interface followRelListNode {
  username: string
  areFollowing: string
}
export interface UserRecipesByUsernameVarsType {
  username: string
  cursor: string | null
}
export const FOLLOWING_BY_USERNAME = gql`
  query followingByUsername($username: String!, cursor: String) {
    result: userByUsername(username: $username) {
      connection: following(first: 30, after: $cursor) {
        pageInfo {
          hasNextPage
        }
        edges {
          cursor
          node {
            username
            areFollowing
          }
        }
      }
    }
  }
`
