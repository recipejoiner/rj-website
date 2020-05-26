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

export interface LogoutReturnType {
  logout: boolean;
}
export const LOGOUT = gql`
  mutation logout{
    logout
  }
`;

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