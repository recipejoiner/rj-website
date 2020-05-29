import React from 'react'
import { NextPage, GetServerSideProps } from 'next'
import { useForm } from 'react-hook-form'

import client, { gqlError } from 'requests/client'
import {
  UserLoginType,
  PasswordResetVarsType,
  RESET_PASSWORD,
} from 'requests/auth'
import { setCookie, redirectTo } from 'helpers/methods'
import { withHomeRedirect } from 'helpers/auth'
import { PasswordFormItem } from 'components/forms/Fields'

interface PasswordRecoveryPageProps {
  resetPasswordToken: string
}

const PasswordRecoveryPage: NextPage<PasswordRecoveryPageProps> = ({
  resetPasswordToken,
}) => {
  const [pwRecoveryErrs, setPwRecoveryErrs] = React.useState<Array<gqlError>>(
    []
  )

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
        if (!!data) {
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

  return (
    <React.Fragment>
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
              <button
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 w-full rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
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

export default PasswordRecoveryPage
