import gql from 'graphql-tag';

export interface UserLoginType {
  login: {
    user: {
      token: string;
    }
  }
}
export interface LoginVarsType {
  email: string;
  password: string;
}
export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      user {
        token
      }
    }
  }
`;

// check for email, as only a logged-in user can access their email (API users will just get null)
export interface CurrentUserLoginCheckType {
  me: {
    email: string;
  }
}
export const CURRENT_USER_LOGIN_CHECK = gql`
  query {
    me {
      email
    }
  }
`;

export interface UserInfoType {
  result: {
    id: string;
    username: string;
    followerCount: number;
    followingCount: number;
    firstName: string | null;
    lastName: string | null;
  }
}
export interface UserByUsernameVarsType {
  username: string;
}
export const USER_INFO_BY_USERNAME = gql`
  query userByUsername($username: String!) {
    result: userByUsername(username: $username) {
      id
      username
      followerCount
      followingCount
      firstName
      lastName
      createdAt
    }
  }
`;

export interface LogoutReturnType {
  logout: boolean;
}
export const LOGOUT = gql`
  mutation logout{
    logout
  }
`;

export interface SignUpReturnType {
  signUp: {
    user: {
      token: string;
    }
  }
}
export interface SignUpVarsType {
  email: string;
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  passwordConfirmation: string;
}
export const SIGN_UP = gql`
  mutation signUp(
    $email: String!,
    $firstName: String!,
    $lastName: String!,
    $username: String!,
    $password: String!,
    $passwordConfirmation: String!,
    ){
    signUp(attributes: {
      email: $email
      firstName: $firstName
      lastName: $lastName
      username: $username
      password: $password
      passwordConfirmation: $passwordConfirmation
    }) {
      user {
        token
      }
    }
  }
`;