import React from 'react'
import { NextPage } from 'next'
import { useForm } from 'react-hook-form'

import client, { gqlError } from 'requests/client'
import { UserLoginType, LoginVarsType, LOGIN } from 'requests/auth'
import { setCookie, redirectTo } from 'helpers/methods'
import { withHomeRedirect } from 'helpers/auth'

import { TextFormItem, PasswordFormItem } from 'components/forms/Fields'

interface LoginPageProps {}

const LoginPage: NextPage<LoginPageProps> = ({}) => {
  const [loginErrs, setLoginErrs] = React.useState<Array<gqlError>>([])

  const { register, handleSubmit, watch, errors } = useForm<LoginVarsType>()

  const onSubmit = handleSubmit(({ email, password }) => {
    const token = process.env.NEXT_PUBLIC_RJ_API_TOKEN || ''
    client
      .mutate({
        mutation: LOGIN,
        variables: {
          email: email,
          password: password,
        },
        context: {
          // example of setting the headers with context per operation
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      })
      .then((res) => {
        const { data }: { data?: UserLoginType } = res || {}
        if (!!data) {
          setCookie('UserToken', data?.result.user.token)
          redirectTo('/')
        } else {
          throw 'Data is missing!'
        }
      })
      .catch((err) => {
        setLoginErrs(err.graphQLErrors)
        console.log(loginErrs)
      })
  })

  return (
    <React.Fragment>
      <div className="w-screen bg-gray-100 h-screen fixed">
        <h1 className="header-text pt-10 sm:pt-20">Welcome back!</h1>
        <div className="text-center">Please sign in below.</div>
        <div className="w-full max-w-xs m-auto pt-10 sm:pt-20">
          <form
            onSubmit={onSubmit}
            className="sm:bg-white sm:shadow-md rounded px-8 pt-6 pb-8 mb-4"
          >
            <TextFormItem
              label="Email"
              returnVar="email"
              placeholder="you@example.com"
              register={register}
            />
            <PasswordFormItem
              label="Password"
              returnVar="password"
              register={register}
            />
            <ul className="p-2">
              {loginErrs.map((err) => {
                return (
                  <li
                    key={err.message}
                    className="text-red-500 font-bold text-sm italic"
                  >
                    {err.message}
                  </li>
                )
              })}
            </ul>
            <div className="flex items-center justify-between">
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
                Sign In
              </button>
              <a
                className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                href="#"
              >
                Forgot Password?
              </a>
            </div>
          </form>
          <p className="text-center text-gray-500 text-xs">
            &copy;2020 RecipeJoiner. All rights reserved.
          </p>
        </div>
      </div>
    </React.Fragment>
  )
}

export default withHomeRedirect(LoginPage)
