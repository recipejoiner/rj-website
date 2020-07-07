import Head from 'next/head'
import { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import * as React from 'react'
import Router from 'next/router'
import { GraphQLError } from 'graphql'
// import { v4 as uuid } from 'uuid'

import { toMixedNumber } from 'helpers/methods'
import { getToken } from 'helpers/auth'
import { redirectTo } from 'helpers/methods'
import {
  CurrentUserLoginCheckType,
  CURRENT_USER_LOGIN_CHECK,
} from 'requests/auth'

import client from 'requests/client'

import {
  RecipeType,
  RecipeStepType,
  RecipeInputType,
  IngredientInputType,
  RecipeFormReturnType,
  EditRecipeVars,
  RECIPE_BY_USERNAME_AND_HANDLE,
  EDIT_RECIPE,
  RecipeStepInputType,
  CreateRecipeVars,
} from 'requests/recipes'

import RecipeForm from 'components/forms/RecipeForm'

interface EditRecipePageProps {
  existingRecipeId: number
  oldAttributes: RecipeInputType
}

const EditRecipePage: NextPage<EditRecipePageProps> = ({
  existingRecipeId,
  oldAttributes,
}) => {
  const [newRecipeErrs, setNewRecipeErrs] = React.useState<
    readonly GraphQLError[]
  >([])
  // console.log('attributes', watch('attributes'))
  const onSubmit = (variables: CreateRecipeVars) => {
    client
      .mutate({
        mutation: EDIT_RECIPE,
        variables: {
          existingRecipeId: existingRecipeId,
          attributes: variables.attributes,
        },
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
          throw 'Data is Missing'
        }
      })
      .catch((err) => {
        console.log(err)
        setNewRecipeErrs(err.graphQLErrors)
      })
  }

  const title = 'Edit Recipe - RecipeJoiner'
  const description = 'Edit your recipe!'
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
      <RecipeForm
        submit={onSubmit}
        recipeInit={oldAttributes}
        reviewModeInit={true}
        serverErrors={newRecipeErrs}
      />
    </React.Fragment>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const { params } = ctx

  const username = params?.username
  const recipehandle = params?.recipehandle
  const path = `/${username}/${recipehandle}`

  try {
    const meData: CurrentUserLoginCheckType = await client
      .query({
        query: CURRENT_USER_LOGIN_CHECK,
        context: {
          // example of setting the headers with context per operation
          headers: {
            authorization: `Bearer ${getToken(ctx)}`,
          },
        },
        // Prevent caching issues when logging in/out without refresh.
        fetchPolicy: 'network-only',
      })
      .then((res) => {
        const { data }: { data?: CurrentUserLoginCheckType } = res || {}
        if (data && data.me.username) {
          if (data.me.username === username) {
            return data
          } else {
            throw 'Recipe does not belong to current user!'
          }
        }
        throw 'No user!'
      })

    const existingRecipeData: RecipeType = await client
      .query({
        query: RECIPE_BY_USERNAME_AND_HANDLE,
        variables: {
          username: username,
          handle: recipehandle,
        },
        context: {
          // example of setting the headers with context per operation
          headers: {
            authorization: `Bearer ${getToken(ctx)}`,
          },
        },
      })
      .then((res) => {
        const { data }: { data?: RecipeType } = res || {}
        if (!!data) {
          return data
        } else {
          throw 'No recipe data returned!'
        }
      })

    const { result } = existingRecipeData
    const { id, title, description, servings, steps, recipeTime } = result

    const formatSteps = (steps: RecipeStepType[]) => {
      let formattedSteps: Array<RecipeStepInputType> = []
      let stepIndexZero = steps[0].stepNum === 0 ? true : false
      steps.map(
        (step: {
          stepNum: number
          stepTitle: string
          additionalInfo: string
          ingredients: any[]
        }) => {
          let formattedIngredients: Array<IngredientInputType> = []
          step.ingredients.map((ing) => {
            formattedIngredients.push({
              id: (Date.now() * Math.random()).toFixed(0).toString(),
              name: ing.ingredientInfo.name,
              quantity: toMixedNumber(ing.quantity),
              unit: ing.unit.name,
            })
          })
          formattedSteps.push({
            stepNum: stepIndexZero ? step.stepNum : step.stepNum - 1,
            stepTitle: step.stepTitle,
            additionalInfo: step.additionalInfo,
            ingredients: formattedIngredients,
          })
        }
      )
      return formattedSteps
    }
    const existingRecipeId = id
    // convert the type
    var oldAttributes: RecipeInputType = {
      title: title,
      description: description,
      servings: servings,
      recipeTime: recipeTime,
      steps: formatSteps(steps),
    }
    return {
      props: {
        existingRecipeId: existingRecipeId,
        oldAttributes: oldAttributes,
      },
    }
  } catch (err) {
    console.log('err', err)
    if (ctx.res) {
      ctx.res.writeHead(302, {
        Location: path,
      })
      ctx.res.end()
    } else {
      Router.push(path)
    }
    return { props: {} }
  }
}

export default EditRecipePage
