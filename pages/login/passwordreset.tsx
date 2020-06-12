import React from 'react'
import Head from 'next/head'
import { NextPage, GetServerSideProps } from 'next'
import { useForm } from 'react-hook-form'
import { GraphQLError } from 'graphql'

import client from 'requests/client'
import {
  UserLoginType,
  PasswordResetVarsType,
  RESET_PASSWORD,
} from 'requests/auth'
import { setCookie, redirectTo } from 'helpers/methods'
import { withHomeRedirect } from 'helpers/auth'
import { PasswordFormItem } from 'components/forms/Fields'

interface PasswordResetPageProps {
  resetPasswordToken: string
}

const PasswordResetPage: NextPage<PasswordResetPageProps> = ({
  resetPasswordToken,
}) => {
  const [pwRecoveryErrs, setPwRecoveryErrs] = React.useState<
    readonly GraphQLError[]
  >([])

  const { register, handleSubmit, watch, errors } = useForm<
    PasswordResetVarsType
  >()
  const onSubmit = handleSubmit(({ password, passwordConfirmation }) => {
    const token = process.env.NEXT_PUBLIC_RJ_API_TOKEN || ''
    client
      .mutate({
        mutation: RESET_PASSWORD,
        variables: {
          password: password,
          passwordConfirmation: passwordConfirmation,
          resetPasswordToken: resetPasswordToken,
        },
        context: {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      })
      .then((res) => {
        const { data }: { data?: UserLoginType } = res || {}
        if (res.errors) {
          setPwRecoveryErrs(res.errors)
        } else if (!!data) {
          setCookie('UserToken', data?.result.user.token)
          redirectTo('/')
        } else {
          throw 'Data is missing!'
        }
      })
      .catch((err) => {
        setPwRecoveryErrs(err.graphQLErrors)
      })
  })

  const title = 'Password Reset - RecipeJoiner'
  const description = 'RecipeJoiner password reset form'
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
          content={`${process.env.NEXT_PUBLIC_BASE_URL}/login/passwordreset`}
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
        <h1 className="header-text pt-10 sm:pt-20">Password Reset</h1>
        <div className="text-center">
          To reset your password, fill out the form below.
        </div>
        <div className="w-full max-w-xs m-auto pt-10 sm:pt-20">
          <form
            onSubmit={onSubmit}
            className="sm:bg-white sm:shadow-md rounded px-8 pt-6 pb-8 mb-4"
          >
            <PasswordFormItem
              label="New Password"
              returnVar="password"
              register={register}
            />
            <PasswordFormItem
              label="New Password Confirmation"
              returnVar="passwordConfirmation"
              register={register}
            />
            <ul className="p-2">
              {pwRecoveryErrs.map((err) => {
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
              <button className="form-submit-btn" type="submit">
                Reset Password & Sign In
              </button>
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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { res } = context
  // For searching with a classic query param, a la Google
  const resetPasswordToken = context.query.reset_password_token
  if (resetPasswordToken == undefined) {
    res.writeHead(303, { Location: `/` })
    res.end()
  }
  return {
    props: { resetPasswordToken: resetPasswordToken },
  }
}

export default PasswordResetPage
