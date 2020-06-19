import * as React from 'react'
import { GraphQLError } from 'graphql'

import { RecipeInputType, RecipeInputStepType } from '../../requests/recipes'

interface Error {
  key: string
  error: string
  message: string
}

interface RecipeFormProps {
  recipeInit?: RecipeInputType
  stepInit?: number
  reviewModeInit?: boolean
  errorsInit?: Array<any>
}

const NewIngredient = () => ({
  id: Date.now().toString(),
  name: '',
  quantity: 0,
  unit: '',
})

const NewStep = () => ({
  action: '',
  ingredients: [NewIngredient()],
  tempNum: 0,
  tempLevel: '',
  time: 0,
  location: '',
  customInfo: '',
})

const NewRecipe = () => ({
  title: '',
  description: '',
  servings: '',
  steps: [NewStep()],
})

const NewError = (key: string, error: string, message: string) => ({
  key: key,
  error: error,
  message: message,
})

const ErrorField = ({
  name,
  errors,
}: {
  name: string
  errors: Array<Error>
}) => {
  const error = errors.filter((err) => err.key == name)[0]
  return error ? (
    <React.Fragment>
      <span className="text-sm text-red-600">{error.message}</span>
    </React.Fragment>
  ) : (
    <React.Fragment />
  )
}

const RecipeForm: React.FC<RecipeFormProps> = ({
  recipeInit = NewRecipe(),
  stepInit = 0,
  reviewModeInit = false,
  errorsInit = [],
}) => {
  const [newRecipeErrs, setNewRecipeErrs] = React.useState<
    readonly GraphQLError[]
  >([])
  const [recipe, setRecipe] = React.useState<RecipeInputType>(recipeInit)
  const [currentStep, setCurrentStep] = React.useState(stepInit)
  const [reviewMode, setReviewMode] = React.useState(reviewModeInit)
  const [errors, setErrors] = React.useState<Array<Error>>(errorsInit)
  const [loaded, setLoaded] = React.useState(false)

  const createError = (key: string, error: string, message: string) => {
    if (!getError(key).length) {
      let err: Error = NewError(key, error, message)
      setErrors((errors) => [...errors, err])
    }
  }

  const deleteError = (key: string) => {
    let updatedErrors = errors.filter((err) => err.key != key)
    setErrors(updatedErrors)
  }

  const updateError = (key: string, value?: string) => {
    if (value && getError(key).length) deleteError(key)
  }

  const getError = (key: string) => {
    return errors.filter((err) => err.key == key)
  }

  const createStep = () => {
    let recipeCopy = JSON.parse(JSON.stringify(recipe))
    let newStep: RecipeInputStepType = NewStep()
    recipeCopy.steps.push(newStep)
    setRecipe(recipeCopy)
  }

  const deleteStep = (stepNum: number) => {
    if (stepNum > -1) {
      let recipeCopy = JSON.parse(JSON.stringify(recipe))
      if (recipeCopy.steps.length == 1) recipeCopy.steps[0] = NewStep()
      else recipeCopy.steps.splice(stepNum, 1)
      setRecipe(recipeCopy)
      goToStep(currentStep - 1)
    }
  }

  const goToStep = (stepNum: number) => {
    if (stepNum < 0) stepNum = 0
    setCurrentStep(stepNum)
  }

  const validateValue = (errorKey: string, value: any, validation: string) => {
    let ret = true
    switch (validation) {
      case 'required':
        if (!value) {
          createError(errorKey, 'required', 'This field is required.')
          ret = false
        }
        break
      default:
        break
    }
    //if no errors with key remove old error from error object
    if (!!ret && getError(errorKey).length) deleteError(errorKey)
    return ret
  }

  const validateStep = (stepNum: number) => {
    const { ingredients, action } = recipe.steps[stepNum]
    return (
      //action
      validateValue('action', action, 'required') &&
      //ingredients
      ingredients.map((ing) => {
        return (
          validateValue(ing.id + '-name', ing.name, 'required') &&
          validateValue(ing.id + '-quantity', ing.quantity, 'required')
        )
      })[0]
    )
  }

  const submitStep = () => {
    if (validateStep(currentStep)) {
      if (currentStep === recipe.steps.length - 1) createStep()
      goToStep(currentStep + 1)
    }
  }

  const createIngredient = () => {
    let recipeCopy = JSON.parse(JSON.stringify(recipe))
    recipeCopy.steps[currentStep].ingredients.push(NewIngredient())
    setRecipe(recipeCopy)
  }

  const deleteIngredient = (ingredientId: string) => {
    let recipeCopy = JSON.parse(JSON.stringify(recipe))
    let toDelete = recipeCopy.steps[currentStep].ingredients.filter(
      (ing: { id: string }) => ing.id == ingredientId
    )[0]
    let index = recipeCopy.steps[currentStep].ingredients.indexOf(toDelete)
    if (index > -1) {
      recipeCopy.steps[currentStep].ingredients.splice(index, 1)
      //there should always be at least one empty ingredient
      if (recipeCopy.steps[currentStep].ingredients.length <= 0)
        recipeCopy.steps[currentStep].ingredients.push(NewIngredient())
      setRecipe(recipeCopy)
    }
    deleteError(ingredientId)
  }

  const handleChange = (data: {
    target: { name: any; value: any; id?: any }
  }) => {
    const {
      name,
      value,
      id,
    }: { name: string; value: string; id?: string } = data.target
    let recipeCopy = JSON.parse(JSON.stringify(recipe))
    //if ingredient
    if (!!id) {
      let ingredientCopy = recipeCopy.steps[currentStep].ingredients.filter(
        (ing: { id: string }) => ing.id == id.substring(0, id.indexOf('-'))
      )[0]
      let index = recipeCopy.steps[currentStep].ingredients.indexOf(
        ingredientCopy
      )
      if (ingredientCopy && index > -1) {
        ingredientCopy[name] = value
        recipeCopy.steps[currentStep].ingredients[index] = ingredientCopy
      }
    } else {
      recipeCopy.steps[currentStep][name] = value
    }
    setRecipe(recipeCopy)
    updateError(id || name, value)
  }
  React.useEffect(() => setLoaded(true), [])

  // console.log('recipe', recipe)
  // console.log('current step', currentStep)
  // console.log('review mode', reviewMode)
  // console.log('errors', errors)
  return loaded && !reviewMode ? (
    <React.Fragment>
      <div className="max-w-sm w-11/12 mt-8 mx-auto  p-6 bg-white rounded-lg shadow-xl">
        <span className="float-right" onClick={() => deleteStep(currentStep)}>
          <svg
            className="fill-current h-6 w-6 text-pink-300 mx-auto"
            role="button"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
          >
            <title>Close</title>
            <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
          </svg>
        </span>
        {/* Inputs */}
        <div className="w-full">
          <input
            className="bg-transparent w-full text-4xl text-gray-700 mr-3 py-1 leading-tight focus:outline-none  border-b-4 border-black "
            type="text"
            placeholder="ACTION"
            name="action"
            value={recipe.steps[currentStep].action || ''}
            onChange={handleChange}
          ></input>
          <ErrorField name="action" errors={errors} />
        </div>
        {recipe.steps[currentStep].ingredients.map((ing) => (
          <div className="bg-orange-100 p-1 my-4">
            <span
              className="float-right"
              onClick={() => deleteIngredient(ing.id.toString())}
            >
              <svg
                className="fill-current h-6 w-6 text-pink-300 mx-auto"
                role="button"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <title>Close</title>
                <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
              </svg>
            </span>
            <div className="grid grid-cols-2 grid-rows-2 gap-4">
              <div className="col-span-2">
                <input
                  className="bg-transparent w-full text-4xl text-gray-700 mr-3 py-1 leading-tight focus:outline-none  border-b-4 border-black "
                  type="text"
                  placeholder="INGREDIENT"
                  id={ing.id + '-name'}
                  name="name"
                  onChange={handleChange}
                  value={ing.name || ''}
                ></input>
                <ErrorField name={ing.id + '-name'} errors={errors} />
              </div>
              <div className="row-start-2 col-start-1">
                <input
                  className="bg-transparent w-full text-3xl text-gray-700 mr-3 py-1 leading-tight focus:outline-none  border-b-4 border-black "
                  type="text"
                  placeholder="Quantity"
                  id={ing.id + '-quantity'}
                  name="quantity"
                  onChange={handleChange}
                  value={ing.quantity || ''}
                ></input>
                <ErrorField name={ing.id + '-quantity'} errors={errors} />
              </div>
              <div className="row-start-2 col-start-2">
                <input
                  className="bg-transparent w-full text-3xl text-gray-700 mr-3 py-1 leading-tight focus:outline-none  border-b-4 border-black "
                  type="text"
                  placeholder="Unit"
                  id={ing.id + '-unit'}
                  name="unit"
                  onChange={handleChange}
                  value={ing.unit || ''}
                ></input>
                <ErrorField name={ing.id + '-unit'} errors={errors} />
              </div>
            </div>
          </div>
        ))}
        <button
          className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mb-4 "
          onClick={createIngredient}
        >
          Add Ingredient
        </button>
        <div className="grid grid-cols-3 gap-4">
          <div className="">
            <input
              className="bg-transparent w-full text-xl text-gray-700 mr-3 py-1 leading-tight focus:outline-none  border-b-4 border-black "
              type="text"
              placeholder="Temp"
              name="tempLevel"
              value={recipe.steps[currentStep].tempLevel || ''}
              onChange={handleChange}
            ></input>
            <ErrorField name="tempLevel" errors={errors} />
          </div>
          <div className="col-span-1">
            <input
              className="bg-transparent w-full text-xl text-gray-700 mr-3 py-1 leading-tight focus:outline-none  border-b-4 border-black "
              type="text"
              placeholder="Time"
              name="time"
              value={recipe.steps[currentStep].time || ''}
              onChange={handleChange}
            ></input>
            <ErrorField name="time" errors={errors} />
          </div>
          <div className="span-1">
            <input
              className="bg-transparent w-full text-xl text-gray-700 mr-3 py-1 leading-tight focus:outline-none  border-b-4 border-black "
              type="text"
              placeholder="Location."
              name="location"
              value={recipe.steps[currentStep].location}
              onChange={handleChange}
            ></input>
            <ErrorField name="location" errors={errors} />
          </div>
        </div>
        {/* Buttons */}
        <div className="w-full mt-8">
          <div className="grid col-gap-4 grid-cols-3">
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              onClick={() => goToStep(currentStep - 1)}
            >
              Prev
            </button>
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded"
              onClick={submitStep}
            >
              Next
            </button>
            <button className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded">
              Finish
            </button>
          </div>
        </div>
      </div>
    </React.Fragment>
  ) : (
    //review mode
    <React.Fragment></React.Fragment>
  )
}

export default RecipeForm
