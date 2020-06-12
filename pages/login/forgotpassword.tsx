import React from 'react'
import Head from 'next/head'
import { NextPage, GetServerSideProps } from 'next'
import { useForm } from 'react-hook-form'
import { GraphQLError } from 'graphql'

import client from 'requests/client'
import {
  SendResetPasswordType,
  SendResetPasswordVarsType,
  SEND_RESET_PASS_INSTRUCTIONS,
} from 'requests/auth'
import { setCookie, redirectTo } from 'helpers/methods'
import { withHomeRedirect } from 'helpers/auth'
import { TextFormItem } from 'components/forms/Fields'

interface PasswordRecoveryPageProps {
  resetPasswordToken: string
}

const PasswordRecoveryPage: NextPage<PasswordRecoveryPageProps> = ({
  resetPasswordToken,
}) => {
  const [pwRecoveryErrs, setPwRecoveryErrs] = React.useState<
    readonly GraphQLError[]
  >([])

  const [message, setMessage] = React.useState('')

  const { register, handleSubmit, watch, errors } = useForm<
    SendResetPasswordVarsType
  >()
  const onSubmit = handleSubmit(({ email }) => {
    console.log('email', email)
    const token = process.env.NEXT_PUBLIC_RJ_API_TOKEN || ''
    client
      .mutate({
        mutation: SEND_RESET_PASS_INSTRUCTIONS,
        variables: {
          email: email,
        },
        context: {
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      })
      .then((res) => {
        const { data }: { data?: SendResetPasswordType } = res || {}
        console.log('data', data)
        if (!!data) {
          if (data.result == true) {
            setMessage('Check your email for further instructions.')
          } else {
            setMessage("Are you sure that's the right email?")
          }
        } else {
          throw 'Data is missing!'
        }
      })
      .catch((err) => {
        setPwRecoveryErrs(err.graphQLErrors)
      })
  })

  const title = 'Forgot your password? - RecipeJoiner'
  const description = 'RecipeJoiner password reset request form'
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
          content={`${process.env.NEXT_PUBLIC_BASE_URL}/login/forgotpassword`}
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
        <h1 className="header-text pt-10 sm:pt-20">Forgot your password?</h1>
        <div className="text-center">
          To reset your password, fill out the form below.
        </div>
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
                Send Password Reset Instructions
              </button>
            </div>
            <h3 className="text-center font-bold italic pt-2">{message}</h3>
          </form>
          <p className="text-center text-gray-500 text-xs">
            &copy;2020 RecipeJoiner. All rights reserved.
          </p>
        </div>
      </div>
    </React.Fragment>
  )
}

export default withHomeRedirect(PasswordRecoveryPage)
