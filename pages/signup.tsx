import React from 'react'
import Head from 'next/head'
import { NextPage } from 'next'
import { useForm } from 'react-hook-form'

import client, { gqlError } from 'requests/client'
import { SignUpReturnType, SignUpVarsType, SIGN_UP } from 'requests/auth'
import { setCookie, redirectTo } from 'helpers/methods'
import { withHomeRedirect } from 'helpers/auth'
import { PASSWORD_REGEX, PasswordRequirements } from 'helpers/regex'

import { TextFormItem, PasswordFormItem } from 'components/forms/Fields'

interface SignUpPageProps {}

const SignUpPage: NextPage<SignUpPageProps> = ({}) => {
  const [loginErrs, setLoginErrs] = React.useState<Array<gqlError>>([])

  const { register, handleSubmit, watch, errors } = useForm<SignUpVarsType>()
  const onSubmit = handleSubmit((variables: SignUpVarsType) => {
    const token = process.env.NEXT_PUBLIC_RJ_API_TOKEN || ''
    client
      .mutate({
        mutation: SIGN_UP,
        variables: variables,
        context: {
          // example of setting the headers with context per operation
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      })
      .then((res) => {
        const { data }: { data?: SignUpReturnType } = res || {}
        if (!!data) {
          setCookie('UserToken', data?.signUp.user.token)
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

  const title = 'Sign Up - RecipeJoiner'
  const description = 'Sign up for RecipeJoiner!'
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
          content={`${process.env.NEXT_PUBLIC_BASE_URL}/signup`}
        />
        <meta key="og:title" property="og:title" content={title} />
        <meta
          key="og:description"
          property="og:description"
          content={description}
        />
        {/* OpenGraph tags end */}
      </Head>
      <div className="w-screen bg-gray-100 min-h-screen -mt-14 md:-mt-16">
        <h1 className="header-text pt-24 sm:pt-26">Welcome to RecipeJoiner!</h1>
        <div className="text-center">Please sign up below.</div>
        <div className="w-full max-w-lg m-auto pt-10 sm:pt-20">
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
            <TextFormItem
              label="First Name"
              returnVar="firstName"
              placeholder="Ari"
              register={register}
            />
            <TextFormItem
              label="Last Name"
              returnVar="lastName"
              placeholder="Mendelow"
              register={register}
            />
            <TextFormItem
              label="Usernane"
              returnVar="username"
              placeholder="arimendelow"
              register={register}
            />
            <PasswordFormItem
              label="Password"
              returnVar="password"
              register={register({
                validate: PasswordRequirements,
              })}
              errorMessage={errors.password && errors.password.message}
            />
            <PasswordFormItem
              label="Password Confirmation"
              returnVar="passwordConfirmation"
              register={register}
              errorMessage={
                errors.passwordConfirmation &&
                errors.passwordConfirmation.message
              }
            />
            <ul className="pt-2">
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
            <div className="flex flex-col items-center justify-between">
              <button className="form-submit-btn" type="submit">
                Sign Up
              </button>
              <a
                className="mt-5 inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800"
                href="/login"
              >
                Already have an account?
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

export default withHomeRedirect(SignUpPage)
