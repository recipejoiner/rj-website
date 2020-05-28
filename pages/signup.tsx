import React from 'react'
import { NextPage } from 'next'
import { useForm } from 'react-hook-form'

import client, { gqlError } from 'requests/client'
import { SignUpReturnType, SignUpVarsType, SIGN_UP } from 'requests/auth'
import { setCookie, redirectTo } from 'helpers/methods'
import { withHomeRedirect } from 'helpers/auth'

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

  interface TextFormItemProps {
    label: string
    returnVar: string
    placeholder: string
  }

  const TextFormItem: React.FC<TextFormItemProps> = ({
    label,
    returnVar,
    placeholder,
  }) => {
    return (
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor={returnVar}
        >
          {label}
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id={returnVar}
          name={returnVar}
          type="text"
          placeholder={placeholder}
          ref={register}
        />
      </div>
    )
  }

  interface PasswordFormItemProps {
    label: string
    returnVar: string
  }

  const PasswordFormItem: React.FC<PasswordFormItemProps> = ({
    label,
    returnVar,
  }) => {
    return (
      <div className="mb-4">
        <label
          className="block text-gray-700 text-sm font-bold mb-2"
          htmlFor={returnVar}
        >
          {label}
        </label>
        <input
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          id={returnVar}
          name={returnVar}
          type="password"
          placeholder="••••••••"
          ref={register}
        />
      </div>
    )
  }

  return (
    <React.Fragment>
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
            />
            <TextFormItem
              label="First Name"
              returnVar="firstName"
              placeholder="Ari"
            />
            <TextFormItem
              label="Last Name"
              returnVar="lastName"
              placeholder="Mendelow"
            />
            <TextFormItem
              label="Usernane"
              returnVar="username"
              placeholder="arimendelow"
            />
            <PasswordFormItem label="Password" returnVar="password" />
            <PasswordFormItem
              label="Password Confirmation"
              returnVar="passwordConfirmation"
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
              <button
                className="bg-blue-500 hover:bg-blue-700 w-full text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                type="submit"
              >
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
