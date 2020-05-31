import Head from 'next/head'
import { NextPage } from 'next'
import { useForm } from 'react-hook-form'
import * as React from 'react'

import { withLoginRedirect } from 'helpers/auth'

import client, { gqlError } from 'requests/client'

import {
  RecipeType,
  RecipeInput,
  CreateRecipeVars,
  CREATE_RECIPE,
} from 'requests/recipes'

import {
  TextFormItem,
  NumFormItem,
  TextAreaFormItem,
  HiddenFormItem,
} from 'components/forms/Fields'

interface NewRecipePageProps {}

const NewRecipePage: NextPage<NewRecipePageProps> = ({}) => {
  const [newRecipeErrs, setNewRecipeErrs] = React.useState<Array<gqlError>>([])

  const { register, handleSubmit, watch, errors } = useForm<CreateRecipeVars>()
  console.log(watch('attributes'))
  const onSubmit = handleSubmit((variables: CreateRecipeVars) => {
    const token = process.env.NEXT_PUBLIC_RJ_API_TOKEN || ''
    client
      .mutate({
        mutation: CREATE_RECIPE,
        variables: variables,
        context: {
          // example of setting the headers with context per operation
          headers: {
            authorization: `Bearer ${token}`,
          },
        },
      })
      .then((res) => {
        const { data }: { data?: RecipeType } = res || {}
        if (!!data) {
          // do something on success
        } else {
          throw 'Data is missing!'
        }
      })
      .catch((err) => {
        setNewRecipeErrs(err.graphQLErrors)
        console.log(newRecipeErrs)
      })
  })

  const [numOfSteps, setNumOfSteps] = React.useState(1)

  const addStep = () => {
    if (numOfSteps < 50) {
      setNumOfSteps(numOfSteps + 1)
    } else {
      setNewRecipeErrs(
        newRecipeErrs.concat({
          message: "You've hit the maximum number of steps!",
        })
      )
    }
  }

  const removeStep = () => {
    if (numOfSteps > 1) {
      setNumOfSteps(numOfSteps - 1)
    } else {
      setNewRecipeErrs(
        newRecipeErrs.concat({
          message: 'Your recipe must have at least one step!',
        })
      )
    }
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
      <div className="w-screen bg-gray-100 min-h-screen -mt-14 md:-mt-16">
        <h1 className="header-text pt-24 sm:pt-26">Create a new recipe!</h1>
        <div className="w-full max-w-lg m-auto pt-10 sm:pt-20">
          <form
            onSubmit={onSubmit}
            className="sm:bg-white sm:shadow-md rounded px-8 pt-6 pb-8 mb-4"
          >
            <TextFormItem
              label="Title"
              returnVar="attributes.title"
              placeholder="A really yummy recipe"
              register={register({
                required: "What's a recipe without a title?",
              })}
              errorMessage={
                errors.attributes?.title && errors.attributes.title.message
              }
            />
            <TextAreaFormItem
              label="Description"
              returnVar="attributes.description"
              placeholder="A staple in my Grandma's house, this recipe is really good served with apple pie."
              register={register({
                required: 'Tell the world about your recipe!',
              })}
              errorMessage={
                errors.attributes?.description &&
                errors.attributes.description.message
              }
            />
            <TextAreaFormItem
              label="Servings"
              returnVar="attributes.servings"
              placeholder="This yummy recipe should make about 4 servings. 2, if you're really hungry."
              register={register({
                required: 'How many servings does your recipe make?',
              })}
              errorMessage={
                errors.attributes?.servings &&
                errors.attributes.servings.message
              }
            />
            <div className="w-full border-b" />
            <h3 className="text-gray-900 font-bold text-center p-2">Steps</h3>
            <ul>
              {[...Array(numOfSteps).keys()].map((stepInd) => {
                const stepNum = stepInd + 1
                return (
                  <li key={stepInd}>
                    <h4 className="text-gray-900">{`Step ${stepNum}`}</h4>
                    <HiddenFormItem
                      value={stepNum}
                      returnVar={`attributes.steps[${stepInd}].stepNum`}
                      register={register}
                    />
                    <NumFormItem
                      label="Step Time (minutes)"
                      returnVar={`attributes.steps[${stepInd}].stepTime`}
                      placeholder="20"
                      register={register({
                        required:
                          'Surely this step must take some amount of time',
                      })}
                      errorMessage={
                        errors.attributes?.steps &&
                        errors.attributes?.steps[stepInd].stepTime &&
                        errors.attributes.steps[stepInd].stepTime?.message
                      }
                    />
                    <TextAreaFormItem
                      label="Step Instructions"
                      returnVar={`attributes.steps[${stepInd}].description`}
                      placeholder="In this step..."
                      register={register({
                        required: 'What are the instructions for this step?',
                      })}
                      errorMessage={
                        errors.attributes?.steps &&
                        errors.attributes?.steps[stepInd].description &&
                        errors.attributes.steps[stepInd].description?.message
                      }
                    />
                  </li>
                )
              })}
              <button onClick={addStep}>Add Next Step</button>
              <button onClick={removeStep}>Remove Last Step</button>
            </ul>
            <ul className="pt-2">
              {newRecipeErrs.map((err) => {
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
                Create Recipe
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

export default withLoginRedirect(NewRecipePage)
