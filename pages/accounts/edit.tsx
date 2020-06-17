import React from 'react'
import Head from 'next/head'
import { NextPage } from 'next'
import { useForm } from 'react-hook-form'
import { GraphQLError } from 'graphql'

import client from 'requests/client'
import {
  UpdateUserReturnType,
  UpdateUserVarsType,
  UPDATE_USER,
} from 'requests/users'
import { redirectTo } from 'helpers/methods'
import { withLoginRedirect } from 'helpers/auth'
import { PasswordRequirements } from 'helpers/regex'

import { TextFormItem, PasswordFormItem } from 'components/forms/Fields'

interface UpdateUserPageProps {}

const UpdateUserPage: NextPage<UpdateUserPageProps> = ({}) => {
  const [signUpErrs, setSignUpErrs] = React.useState<readonly GraphQLError[]>(
    []
  )

  const { register, handleSubmit, watch, errors } = useForm<
    UpdateUserVarsType
  >()
  const onSubmit = handleSubmit((variables: UpdateUserVarsType) => {
    const token = process.env.NEXT_PUBLIC_RJ_API_TOKEN || ''
    client
      .mutate({
        mutation: UPDATE_USER,
        variables: variables,
        context: {
          // example of setting the headers with context per operation
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      })
      .then((res) => {
        const { data }: { data?: UpdateUserReturnType } = res || {}
        if (res.errors) {
          setSignUpErrs(res.errors)
        } else if (!!data && !!data.result.user.username) {
          const { username } = data.result.user
          redirectTo(`/${username}`)
        } else {
          throw 'Data is missing!'
        }
      })
      .catch((err) => {
        setSignUpErrs(err.graphQLErrors)
        console.log(signUpErrs)
      })
  })

  const title = 'Edit Profile - RecipeJoiner'
  const description = 'Edit your RecipeJoiner profile!'
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
          content={`${process.env.NEXT_PUBLIC_BASE_URL}/accounts/edit`}
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
        <h1 className="header-text text-center pt-24 sm:pt-26">
          Edit your RecipeJoiner profile
        </h1>
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
              label="Username"
              returnVar="username"
              placeholder="arimendelow"
              register={register}
            />
            <PasswordFormItem
              label="Current Password"
              returnVar="password"
              register={register}
              errorMessage={errors.password && errors.password.message}
            />
            <PasswordFormItem
              label="New Password"
              returnVar="newPassword"
              register={register({
                validate: PasswordRequirements,
              })}
              errorMessage={errors.newPassword && errors.newPassword.message}
            />
            <PasswordFormItem
              label="New Password Confirmation"
              returnVar="newPasswordConfirmation"
              register={register({
                validate: {
                  sameAsPass: (value: string) =>
                    value === watch('newPassword') || 'Passwords must match',
                },
              })}
              errorMessage={
                errors.newPasswordConfirmation &&
                errors.newPasswordConfirmation.message
              }
            />
            <ul className="pt-2">
              {signUpErrs.map((err) => {
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
                Submit
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

export default withLoginRedirect(UpdateUserPage)
