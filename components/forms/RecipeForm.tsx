import * as React from 'react'

import { GraphQLError } from 'graphql'

// import {RecipeType, RecipeStepType, IngredientType} from '../../requests/recipes'
interface Error {
  key: string
  error: string
  message: string
}

interface RecipeFormProps {
  allStepsInit?: Array<any>
  stepInit?: number
  reviewModeInit?: boolean
  errorsInit?: Array<any>
}

interface IngredientType {
  [id: string]: number | string
  name: string
  quantity: number
  unit: string
}

interface RecipeStepType {
  [action: string]: string | number | Array<IngredientType>
  ingredients: Array<IngredientType>
  tempNum: number
  tempLevel: string
  time: number
  location: string
  customInfo: string
}

const NewIngredient = () => ({
  id: Date.now().toString(),
  name: '',
  quantity: 0,
  unit: '',
})
//create new step
const NewStep = () => ({
  ingredients: [NewIngredient()],
  action: '',
  tempNum: 0,
  tempLevel: '',
  time: 0,
  location: '',
  customInfo: '',
})

//create a new error
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
  allStepsInit = [NewStep()],
  stepInit = 0,
  reviewModeInit = false,
  errorsInit = [],
}) => {
  const [newRecipeErrs, setNewRecipeErrs] = React.useState<
    readonly GraphQLError[]
  >([])

  const [allSteps, setAllSteps] = React.useState<Array<RecipeStepType>>(
    allStepsInit
  )
  const [currentStep, setCurrentStep] = React.useState(stepInit)
  const [reviewMode, setReviewMode] = React.useState(reviewModeInit)
  const [errors, setErrors] = React.useState<Array<Error>>(errorsInit)
  const [loaded, setLoaded] = React.useState(false)

  React.useEffect(() => setLoaded(true), [])

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
    let newStep: RecipeStepType = NewStep()
    allSteps.push(newStep)
    setAllSteps(allSteps)
  }

  const deleteStep = (stepNum: number) => {
    if (stepNum > -1) {
      let allStepsCopy = [...allSteps]
      if (allStepsCopy.length == 1) allStepsCopy[0] = NewStep()
      else allStepsCopy.splice(stepNum, 1)
      setAllSteps(allStepsCopy)
      goToStep(currentStep - 1)
      console.log(allSteps)
    }
  }

  const goToStep = (stepNum: number) => {
    if (stepNum < 0) stepNum = 0
    setCurrentStep(stepNum)
  }

  const submitStep = () => {
    if (validateStepState(currentStep)) {
      currentStep == allSteps.length ? createStep() : goToStep(currentStep + 1)
    }
    console.log(allSteps)
  }

  const hasValue = (errorKey: string, value: any) => {
    let ret = true
    if (!value) {
      createError(errorKey, 'required', 'This field is required.')
      ret = false
    } else if (value && getError(errorKey).length) deleteError(errorKey)
    return ret
  }

  const validateStepState = (stepNum: number) => {
    let valid = true
    //all variables declared now for future testing if needed
    const {
      ingredients,
      action,
      tempNum,
      tempLevel,
      time,
      location,
      customInfo,
    } = allSteps[stepNum]
    if (
      //REQUIRED VALUES VALIDATION HERE (will return after first group of errors found)
      !hasValue('action', action) ||
      ingredients.map((ing) => {
        return (
          !hasValue(ing.id + '-name', ing.name) ||
          !hasValue(ing.id + '-quantity', ing.quantity)
        )
      })[0]
    ) {
      valid = false
    }
    return valid
  }

  const createIngredient = () => {
    let updatedSteps = [...allSteps]
    updatedSteps[currentStep].ingredients.push(NewIngredient())
    setAllSteps(updatedSteps)
  }

  const deleteIngredient = (ingredientId: string) => {
    let updatedSteps = [...allSteps]
    let toReplace = updatedSteps[currentStep].ingredients.filter(
      (ing) => ing.id == ingredientId
    )
    //remove any errors attached
    deleteError(ingredientId)

    let index = updatedSteps[currentStep].ingredients.indexOf(toReplace[0])
    if (index > -1) {
      let removed = updatedSteps[currentStep].ingredients.splice(index, 1)
      setAllSteps(updatedSteps)
      //there should always be at least one empty ingredient
      if (updatedSteps[currentStep].ingredients.length <= 0) createIngredient()
      return removed
    }
  }

  const handleChange = (data: {
    target: { name: any; value: any; id?: any }
  }) => {
    const {
      name,
      value,
      id,
    }: { name: string; value: string; id?: string } = data.target
    let allStepsCopy = [...allSteps]
    updateError(id || name, value)

    if (id) {
      let ingredientCopy = allStepsCopy[currentStep].ingredients.filter(
        (ing) => ing.id == id
      )[0]
      let index = allStepsCopy[currentStep].ingredients.indexOf(ingredientCopy)
      if (ingredientCopy && index > -1) {
        ingredientCopy[name] = value
        allStepsCopy[currentStep].ingredients[index] = ingredientCopy
      }
    } else allStepsCopy[currentStep][name] = value

    setAllSteps(allStepsCopy)
  }

  //create new step when current step does not yet exist
  !allSteps[currentStep] ? createStep() : ''

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
            value={allSteps[currentStep].action.toString() || ''}
            onChange={handleChange}
          ></input>
          <ErrorField name="action" errors={errors} />
        </div>
        {allSteps[currentStep].ingredients.map((ing) => (
          <div className="bg-orange-100 p-1 my-4">
            <span
              className="float-right"
              onClick={() => deleteIngredient(ing.id)}
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
                  id={ing.id}
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
                  id={ing.id}
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
                  id={ing.id}
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
              value={allSteps[currentStep].tempLevel || ''}
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
              value={allSteps[currentStep].time || ''}
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
              value={allSteps[currentStep].location || ''}
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
