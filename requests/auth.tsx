import gql from 'graphql-tag'

export interface UserLoginType {
  result: {
    user: {
      token: string
    }
  }
}
export interface LoginVarsType {
  email: string
  password: string
}
export const LOGIN = gql`
  mutation login($email: String!, $password: String!) {
    result: login(email: $email, password: $password) {
      user {
        token
      }
    }
  }
`

export interface SendResetPasswordType {
  result: boolean
}
export interface SendResetPasswordVarsType {
  email: string
}
export const SEND_RESET_PASS_INSTRUCTIONS = gql`
  mutation sendResetPasswordInstructions($email: String!) {
    result: sendResetPasswordInstructions(email: $email)
  }
`

// return type is same as UserLoginType
export interface PasswordResetVarsType {
  password: string
  passwordConfirmation: string
  resetPasswordToken: string
}
export const RESET_PASSWORD = gql`
  mutation resetPassword(
    $password: String!
    $passwordConfirmation: String!
    $resetPasswordToken: String!
  ) {
    result: resetPassword(
      password: $password
      passwordConfirmation: $passwordConfirmation
      resetPasswordToken: $resetPasswordToken
    ) {
      user {
        token
      }
    }
  }
`

// check for email, as only a logged-in user can access their email (API users will just get null)
export interface CurrentUserLoginCheckType {
  me: {
    username: string
    email: string
  }
}
export const CURRENT_USER_LOGIN_CHECK = gql`
  query {
    me {
      username
      email
    }
  }
`

export interface LogoutReturnType {
  logout: boolean
}
export const LOGOUT = gql`
  mutation logout {
    logout
  }
`

export interface SignUpReturnType {
  signUp: {
    user: {
      token: string
    }
  }
}
export interface SignUpVarsType {
  email: string
  firstName: string
  lastName: string
  username: string
  password: string
  passwordConfirmation: string
}
export const SIGN_UP = gql`
  mutation signUp(
    $email: String!
    $firstName: String!
    $lastName: String!
    $username: String!
    $password: String!
    $passwordConfirmation: String!
  ) {
    signUp(
      attributes: {
        email: $email
        firstName: $firstName
        lastName: $lastName
        username: $username
        password: $password
        passwordConfirmation: $passwordConfirmation
      }
    ) {
      user {
        token
      }
    }
  }
`
