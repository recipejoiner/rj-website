import gql from 'graphql-tag';

export interface UserLoginType {
  login: {
    user: {
      token: String;
    }
  }
}
export interface LoginVarsType {
  email: string;
  password: string;
}
export const LOGIN = gql`
  mutation login($email: String, $password: String) {
    login(email: $email, password: $password) {
      user {
        token
      }
    }
  }
`;