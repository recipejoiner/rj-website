import gql from 'graphql-tag'

export interface UserInfoType {
  result: {
    id: string
    username: string
    profileImageUrl: string | null
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
      profileImageUrl
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
export interface FollowRelListNodeType {
  username: string
  profileImageUrl: string | null
  areFollowing: boolean | null
}

export const followConnectionNodeInit: FollowRelListNodeType = {
  username: '',
  profileImageUrl: null,
  areFollowing: null,
}

export interface FollowRelListByUsernameVars {
  username: string
  cursor: string | null
}
export const FOLLOWING_BY_USERNAME = gql`
  query followingByUsername($username: String!, $cursor: String) {
    result: userByUsername(username: $username) {
      connection: following(first: 24, after: $cursor) {
        pageInfo {
          hasNextPage
        }
        edges {
          cursor
          node {
            username
            profileImageUrl
            areFollowing
          }
        }
      }
    }
  }
`
export const FOLLOWERS_BY_USERNAME = gql`
  query followersByUsername($username: String!, $cursor: String) {
    result: userByUsername(username: $username) {
      connection: followers(first: 24, after: $cursor) {
        pageInfo {
          hasNextPage
        }
        edges {
          cursor
          node {
            username
            profileImageUrl
            areFollowing
          }
        }
      }
    }
  }
`

export interface SetProfileImageReturnType {
  result: {
    user: {
      profileImageUrl: string
    }
  }
}
export interface SetProfileImageVarsType {
  profileImage: File
}
export const SET_PROFILE_IMAGE = gql`
  mutation setProfileImage($profileImage: File!) {
    result: updateUser(profileImage: $profileImage) {
      user {
        profileImageUrl
      }
    }
  }
`
