import Head from 'next/head'
import { NextPage } from 'next'
import { GetServerSideProps } from 'next'
import { useForm } from 'react-hook-form'
import * as React from 'react'
import Router from 'next/router'

import { getToken } from 'helpers/auth'
import { redirectTo } from 'helpers/methods'
import {
  CurrentUserLoginCheckType,
  CURRENT_USER_LOGIN_CHECK,
} from 'requests/auth'

import client, { gqlError } from 'requests/client'

import {
  RecipeType,
  RecipeInputIngredient,
  RecipeInput,
  RecipeFormReturnType,
  EditRecipeVars,
  RECIPE_BY_USERNAME_AND_HANDLE,
  EDIT_RECIPE,
} from 'requests/recipes'

import RecipeForm from 'components/forms/RecipeForm'

interface EditRecipePageProps {
  existingRecipeId: number
  oldAttributes: RecipeInput
  numOfStepsInit: number
  numOfIngrsInit: Array<number>
}

const EditRecipePage: NextPage<EditRecipePageProps> = ({
  existingRecipeId,
  oldAttributes,
  numOfStepsInit,
  numOfIngrsInit,
}) => {
  const [newRecipeErrs, setNewRecipeErrs] = React.useState<Array<gqlError>>([])

  const { register, handleSubmit, watch, errors, control, reset } = useForm<
    EditRecipeVars
  >({
    defaultValues: {
      existingRecipeId: existingRecipeId, // this isn't actually used by the form
      attributes: oldAttributes,
    },
  })

  // console.log('attributes', watch('attributes'))
  const onSubmit = handleSubmit(
    ({ attributes }: { attributes: RecipeInput }) => {
      console.log('atts', attributes)
      client
        .mutate({
          mutation: EDIT_RECIPE,
          variables: {
            existingRecipeId: existingRecipeId,
            attributes: attributes,
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
          if (data) {
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
  )

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
        register={register}
        onSubmit={onSubmit}
        watch={watch}
        errors={errors}
        control={control}
        formTitle={`Edit ${oldAttributes.title}`}
        submitBtnTxt="Save Recipe"
        numOfStepsInit={numOfStepsInit}
        numOfIngrsInit={numOfIngrsInit}
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
    const { id, title, description, servings, steps } = result

    const existingRecipeId = id
    // convert the type
    var oldAttributes: RecipeInput = {
      title: title,
      description: description,
      servings: servings,
      steps: [],
    }

    const numOfStepsInit = steps.length
    var numOfIngrsInit = Array(numOfStepsInit)
    steps.map((step) => {
      const { stepNum, stepTime, description, ingredients } = step || {}
      var oldIngredients: Array<RecipeInputIngredient> = []
      // stepNum is 1 indexed, need to adjust for this
      numOfIngrsInit[stepNum - 1] = ingredients.length
      ingredients.map((ingredient) => {
        const { ingredientInfo, quantity, unit } = ingredient
        oldIngredients.push({
          name: ingredientInfo.name,
          amount: quantity,
          unit: unit.name,
        })
      })
      oldAttributes.steps.push({
        stepNum: stepNum,
        stepTime: stepTime,
        description: description,
        ingredients: oldIngredients,
      })
    })

    return {
      props: {
        existingRecipeId: existingRecipeId,
        oldAttributes: oldAttributes,
        numOfStepsInit: numOfStepsInit,
        numOfIngrsInit: numOfIngrsInit,
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
