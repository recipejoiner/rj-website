import Head from 'next/head'
import { NextPage } from 'next'
import * as React from 'react'
import { GraphQLError } from 'graphql'

import { getToken } from 'helpers/auth'
import { redirectTo } from 'helpers/methods'
import { withLoginRedirect } from 'helpers/auth'

import client from 'requests/client'

import {
  RecipeFormReturnType,
  CreateRecipeVars,
  CREATE_RECIPE,
} from 'requests/recipes'

import RecipeForm from 'components/forms/RecipeForm'

interface NewRecipePageProps {}

const NewRecipePage: NextPage<NewRecipePageProps> = ({}) => {
  const [newRecipeErrs, setNewRecipeErrs] = React.useState<
    readonly GraphQLError[]
  >([])
  // console.log('attributes', watch('attributes'))
  const onSubmit = (variables: CreateRecipeVars) => {
    client
      .mutate({
        mutation: CREATE_RECIPE,
        variables: variables,
        context: {
          // example of setting the headers with context per operation
          headers: {
            authorization: `Bearer ${getToken()}`,
          },
        },
      })
      .then((res) => {
        const { data }: { data?: RecipeFormReturnType } = res || {}
        if (res.errors) {
          setNewRecipeErrs(res.errors)
        } else if (!!data && !!data.mutation) {
          const { result } = data.mutation || {}
          const { by, handle } = result || {}
          const { username } = by || {}
          const path = '/' + username + '/' + handle
          redirectTo(path)
        } else {
          throw 'Data is missing!'
        }
      })
      .catch((err) => {
        console.log(err)
        setNewRecipeErrs(err.graphQLErrors)
      })
  }

  const title = 'New Recipe - RecipeJoiner'
  const description =
    'Create a new recipe, and share it with your fellow chefs!'
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
          content={`${process.env.NEXT_PUBLIC_BASE_URL}/recipes`}
        />
        <meta key="og:title" property="og:title" content={title} />
        <meta
          key="og:description"
          property="og:description"
          content={description}
        />
        {/* OpenGraph tags end */}
      </Head>
      <RecipeForm submit={onSubmit} serverErrors={newRecipeErrs} />
    </React.Fragment>
  )
}

export default withLoginRedirect(NewRecipePage)
