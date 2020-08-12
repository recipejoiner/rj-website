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

export interface UpdateUserReturnType {
  result: {
    user: {
      username: string
    }
  }
}

export interface UpdateUserVarsType {
  password: string | null
  newPassword: string | null
  newPasswordConfirmation: string | null
  email: string | null
  firstName: string | null
  lastName: string | null
  username: string | null
  profileImage: File | null
}

export const UPDATE_USER = gql`
  mutation UpdateUser(
    $password: String
    $newPassword: String
    $newPasswordConfirmation: String
    $email: String
    $firstName: String
    $lastName: String
    $username: String
    $profileImage: File
  ) {
    result: updateUser(
      password: $password
      newPassword: $newPassword
      newPasswordConfirmation: $newPasswordConfirmation
      email: $email
      firstName: $firstName
      lastName: $lastName
      username: $username
      profileImage: $profileImage
    ) {
      user {
        username
      }
    }
  }
`

export interface NotificationNodeType {
  createdAt: String
  notifiable:
    | CommentNotificationType
    | ReactionNotificationType
    | SavedNotificationType
    | UserRelationshipNotificationType
}

interface CommentNotificationType {
  __typename: 'Comment'
  by: {
    username: string
    profileImageUrl: string
  }
  commentable: RecipeCommentNotificationType | CommentCommentNotificationType
}
interface RecipeCommentNotificationType {
  __typename: 'Recipe'
  title: string
  imageUrl: string
}
interface CommentCommentNotificationType {
  __typename: 'Comment'
  content: string
}

interface ReactionNotificationType {
  by: {
    username: string
    profileImageUrl: string
  }
  reactable: RecipeReactionNotificationType | CommentReactionNotificationType
}
interface RecipeReactionNotificationType {
  title: string
  imageUrl: string
}
interface CommentReactionNotificationType {
  content: string
}

interface SavedNotificationType {
  by: {
    username: string
    profileImageUrl: string
  }
  saveable: SavedRecipeNotificationType
}
interface SavedRecipeNotificationType {
  title: string
}

interface UserRelationshipNotificationType {
  follower: {
    username: string
    profileImageUrl: string
  }
}

const USER_INFO_FOR_NOTIFICATION_FRAGMENT = gql`
  fragment userInfo on User {
    username
    profileImageUrl
  }
`

const NOTIFICATION_FRAGMENT = gql`
  fragment notificationAttributes on Notification {
    createdAt
    notifiable {
      __typename
      ... on Comment {
        by {
          ...userInfo
        }
        commentable {
          __typename
          ... on Recipe {
            title
            imageUrl
          }
          ... on Comment {
            content
          }
        }
      }
      ... on Reaction {
        by {
          ...userInfo
        }
        reactable {
          __typename
          ... on Recipe {
            title
            imageUrl
          }
          ... on Comment {
            content
          }
        }
      }
      ... on Saved {
        by {
          ...userInfo
        }
        saveable {
          ... on Recipe {
            title
          }
        }
      }
      ... on UserRelationship {
        follower {
          ...userInfo
        }
      }
    }
  }
  ${USER_INFO_FOR_NOTIFICATION_FRAGMENT}
`

const NOTIFICATION_CONNECTION_FRAGMENT = gql`
  fragment notificationConnectionFragment on NotificationConnection {
    pageInfo {
      hasNextPage
    }
    edges {
      cursor
      node {
        ...notificationAttributes
      }
    }
  }
  ${NOTIFICATION_FRAGMENT}
`

export const USER_NOTIFICATIONS = gql`
  query UserNotifications($cursor: String) {
    result: me {
      connection: notifications(first: 20, after: $cursor) {
        ...notificationConnectionFragment
      }
    }
  }
  ${NOTIFICATION_CONNECTION_FRAGMENT}
`
