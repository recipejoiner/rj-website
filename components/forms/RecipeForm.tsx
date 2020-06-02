import * as React from 'react'

import { gqlError } from 'requests/client'

import {
  TextFormItem,
  NumFormItem,
  TextAreaFormItem,
  HiddenFormItem,
} from 'components/forms/Fields'

interface RecipeFormProps {
  register: any
  onSubmit: any
  watch: any
  errors: any
  control: any
}

const RecipeForm: React.FC<RecipeFormProps> = ({
  register,
  onSubmit,
  watch,
  errors,
  control,
}) => {
  const [newRecipeErrs, setNewRecipeErrs] = React.useState<Array<gqlError>>([])

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

  return (
    <React.Fragment>
      <div className="w-screen bg-gray-100 min-h-screen -mt-14 md:-mt-16">
        <h1 className="header-text pt-20 md:pt-26">Create a new recipe!</h1>
        <div className="w-full max-w-2xl m-auto pt-0 md:pt-5">
          <form
            onSubmit={onSubmit}
            className="md:bg-white md:shadow-md rounded px-8 pt-6 pb-8 mb-4"
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
                      defaultValue={1}
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
                      <div className="flex flex-row mt-5 mb-5">
                        <button
                          className="add-remove-btn add-btn mx-3 text-sm space-x-2leading-tight"
                          onClick={addIngr}
                        >
                          <span className="font-bold text-xl">+ </span>
                          Ingredient
                        </button>
                        <button
                          className="add-remove-btn remove-btn mx-3 text-sm leading-tight"
                          onClick={removeIngr}
                        >
                          <span className="font-bold text-xl">– </span>
                          Ingredient
                        </button>
                      </div>
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
              <div className="flex flex-row mt-5 mb-5 border-t pt-6 align-middle">
                <button
                  className="add-remove-btn add-btn mx-1"
                  onClick={addStep}
                >
                  <span className="font-bold text-xl">+ </span>
                  Step
                </button>
                <button
                  className="add-remove-btn remove-btn mx-1"
                  onClick={removeStep}
                >
                  <span className="font-bold text-xl">– </span>
                  Step
                </button>
              </div>
            </ul>
            <ul className="pt-2">
              {newRecipeErrs
                ? newRecipeErrs.map((err) => {
                    return (
                      <li
                        key={err.message}
                        className="text-red-500 font-bold text-sm italic"
                      >
                        {err.message}
                      </li>
                    )
                  })
                : null}
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
          <p className="text-center text-gray-500 text-xs pb-3">
            &copy;2020 RecipeJoiner. All rights reserved.
          </p>
        </div>
      </div>
    </React.Fragment>
  )
}

export default RecipeForm
