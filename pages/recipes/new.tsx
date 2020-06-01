import Head from 'next/head'
import { NextPage } from 'next'
import { useForm } from 'react-hook-form'
import * as React from 'react'

import { getToken } from 'helpers/auth'
import { redirectTo } from 'helpers/methods'
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

  const { register, handleSubmit, watch, errors, control } = useForm<
    CreateRecipeVars
  >()
  // console.log('attributes', watch('attributes'))
  const onSubmit = handleSubmit((variables: CreateRecipeVars) => {
    console.log('in onsubmit')
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
        const { data }: { data?: RecipeType } = res || {}
        if (!!data) {
          redirectTo(`/${data.result.by.username}/${data.result.handle}`)
        } else {
          throw 'Data is missing!'
        }
      })
      .catch((err) => {
        setNewRecipeErrs(err.graphQLErrors)
      })
  })

  const [numOfSteps, setNumOfSteps] = React.useState(1)
  // array where each index is the stepInd and the value is the number of ingredients at that step
  const [numOfIngrs, setNumOfIngrs] = React.useState([0])

  const addStep = () => {
    if (numOfSteps < 50) {
      setNumOfSteps(numOfSteps + 1)
      const newNums = numOfIngrs
      newNums.push(0)
      setNumOfIngrs(newNums)
    }
  }

  const removeStep = () => {
    if (numOfSteps > 1) {
      setNumOfSteps(numOfSteps - 1)
      const newNums = numOfIngrs
      newNums.pop()
      setNumOfIngrs(newNums)
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
              {[...Array(numOfSteps).keys()].map((stepInd: number) => {
                const stepNum = stepInd + 1

                const addIngr = () => {
                  if (numOfIngrs[stepInd] < 50) {
                    const newNum = numOfIngrs
                    newNum[stepInd] += 1
                    setNumOfIngrs(newNum)
                  }
                }

                const removeIngr = () => {
                  if (numOfIngrs[stepInd] > 0) {
                    const newNum = numOfIngrs
                    newNum[stepInd] -= 1
                    setNumOfIngrs(newNum)
                  }
                }
                return (
                  <li key={stepInd}>
                    <h4 className="text-gray-900">{`Step ${stepNum}`}</h4>
                    <HiddenFormItem
                      value={stepNum}
                      type="number"
                      handleChange={([e]) => {
                        if (e.target.value == '') {
                          return 0
                        } else {
                          return parseFloat(e.target.value)
                        }
                      }}
                      returnVar={`attributes.steps[${stepInd}].stepNum`}
                      control={control}
                    />
                    <NumFormItem
                      label="Step Time (minutes)"
                      returnVar={`attributes.steps[${stepInd}].stepTime`}
                      placeholder="20"
                      control={control}
                      rules={{
                        min: { value: 0, message: 'What is negative time?' },
                        required:
                          'Surely this step must take some amount of time',
                      }}
                      errorMessage={
                        errors.attributes?.steps &&
                        errors.attributes?.steps[stepInd] &&
                        errors.attributes?.steps[stepInd].stepTime &&
                        errors.attributes.steps[stepInd].stepTime?.message
                      }
                    />
                    <h3 className="text-gray-900 text-sm font-bold">
                      Step {stepNum} Ingredients
                    </h3>
                    <ul>
                      {[...Array(numOfIngrs[stepInd]).keys()].map(
                        (ingrInd: number) => {
                          return (
                            <li key={ingrInd}>
                              <div className="flex flex-row">
                                <div className="w-1/3 mx-2">
                                  <NumFormItem
                                    label="Quantity"
                                    returnVar={`attributes.steps[${stepInd}].ingredients[${ingrInd}].amount`}
                                    placeholder="20"
                                    control={control}
                                    rules={{
                                      min: {
                                        value: 0,
                                        message: "Can't have a negative amount",
                                      },
                                      required:
                                        'Surely this ingredient has an amount',
                                    }}
                                  />
                                </div>
                                <div className="w-1/3 mx-2">
                                  <TextFormItem
                                    label="Unit"
                                    returnVar={`attributes.steps[${stepInd}].ingredients[${ingrInd}].unit`}
                                    placeholder="cups"
                                    register={register({
                                      required: 'Ingredients need a unit!',
                                    })}
                                  />
                                </div>
                                <div className="w-1/3 mx-2">
                                  <TextFormItem
                                    label="Name"
                                    returnVar={`attributes.steps[${stepInd}].ingredients[${ingrInd}].name`}
                                    placeholder="milk"
                                    register={register({
                                      required: 'Ingredients need a name!',
                                    })}
                                  />
                                </div>
                              </div>
                              <div>
                                {(() => {
                                  const { steps } = errors.attributes || {}
                                  const { ingredients } =
                                    steps != undefined &&
                                    steps[stepInd] != undefined
                                      ? steps[stepInd]
                                      : { ingredients: undefined }
                                  const ingrErrs =
                                    ingredients != undefined
                                      ? ingredients[ingrInd]
                                      : undefined
                                  if (ingrErrs) {
                                    const { amount, unit, name } = ingrErrs
                                    return (
                                      <React.Fragment>
                                        {amount ? (
                                          <p className="text-red-700 italic text-sm px-2 whitespace-pre-line">
                                            {amount.message}
                                          </p>
                                        ) : null}
                                        {unit ? (
                                          <p className="text-red-700 italic text-sm px-2 whitespace-pre-line">
                                            {unit.message}
                                          </p>
                                        ) : null}
                                        {name ? (
                                          <p className="text-red-700 italic text-sm px-2 whitespace-pre-line">
                                            {name.message}
                                          </p>
                                        ) : null}
                                      </React.Fragment>
                                    )
                                  }
                                })()}
                              </div>
                            </li>
                          )
                        }
                      )}
                      <button onClick={addIngr}>Add Next Ingredient</button>
                      <button onClick={removeIngr}>
                        Remove Last Ingredient
                      </button>
                    </ul>
                    <TextAreaFormItem
                      label="Step Instructions"
                      returnVar={`attributes.steps[${stepInd}].description`}
                      placeholder="In this step..."
                      register={register({
                        required: 'What are the instructions for this step?',
                      })}
                      errorMessage={
                        errors.attributes?.steps &&
                        errors.attributes?.steps[stepInd] &&
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
