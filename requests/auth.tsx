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

export interface CurrentUserLoginCheckType {
  me: {
    username: string;
  }
}
export const CURRENT_USER_LOGIN_CHECK = gql`
  query {
    me {
      username
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
