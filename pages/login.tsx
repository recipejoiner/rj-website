import React from 'react'
import Head from 'next/head'
import { NextPage } from 'next'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { GraphQLError } from 'graphql'

import client from 'requests/client'
import { UserLoginType, LoginVarsType, LOGIN } from 'requests/auth'
import { setCookie, redirectTo } from 'helpers/methods'
import { withHomeRedirect } from 'helpers/auth'

import { TextFormItem, PasswordFormItem } from 'components/forms/Fields'

interface LoginPageProps {}

const LoginPage: NextPage<LoginPageProps> = ({}) => {
  const [loginErrs, setLoginErrs] = React.useState<readonly GraphQLError[]>([])

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
        if (res.errors) {
          setLoginErrs(res.errors)
        } else if (!!data && !!data.result) {
          setCookie('UserToken', data?.result.user.token)
          redirectTo('/')
        } else {
          throw 'Data is missing!'
        }
      })
      .catch((err) => {
        setLoginErrs(
          err.graphQLErrors || ["message: 'Sorry Something Broke :('"]
        )
        console.log(loginErrs)
      })
  })

  const title = 'Login - RecipeJoiner'
  const description = 'RecipeJoiner login form'
  return (
    <React.Fragment>
      <Head>
        {/* Give the title a key so that it's not duplicated - this allows me to change the page title on other pages */}
        <title key="title">{title}</title>
        <meta charSet="utf-8" />
        <meta key="description" name="description" content={description} />
        {/* OpenGraph tags */}
        <meta
          key="og:url"
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_BASE_URL}/login`}
        />
        <meta key="og:title" property="og:title" content={title} />
        <meta
          key="og:description"
          property="og:description"
          content={description}
        />
        {/* OpenGraph tags end */}
      </Head>
      <div className="w-screen bg-gray-100 h-screen fixed">
        <h1 className="header-text text-center pt-10 sm:pt-20">
          Welcome back!
        </h1>
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
              register={register({
                required: "What's your email?",
              })}
              errorMessage={errors.email && errors.email.message}
            />
            <PasswordFormItem
              label="Password"
              returnVar="password"
              register={register({
                required: "What's your password?",
              })}
              errorMessage={errors.password && errors.password.message}
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
              <button className="form-submit-btn w-1/2" type="submit">
                Sign In
              </button>
              <Link href="/login/forgotpassword">
                <a className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800">
                  Forgot Password?
                </a>
              </Link>
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
