import * as React from 'react'

import { GraphQLError } from 'graphql'
import { type } from 'os'

const INGREDIENTS = [
  { value: 'cheese', label: 'cheese' },
  { value: 'milk', label: 'milk' },
]
const UNIT = [
  { value: 'pinch', label: 'pinch' },
  { value: 'cup', label: 'cup' },
]
const LOCATION = [
  { value: 'oven', label: 'oven' },
  { value: 'bowl', label: 'bowl' },
]
const ACTION = [
  { value: 'mix', label: 'mix' },
  { value: 'chop', label: 'chop' },
]
const TEMPLEVEL = [
  { value: 'low', label: 'low' },
  { value: 'high', label: 'high' },
]

const NEWINGREDIENT = () => ({
  id: Date.now(),
  name: '',
  quantity: 0,
  unit: '',
})
//create new step
const NEWSTEP = () => ({
  ingredients: [NEWINGREDIENT()],
  action: '',
  tempNum: 0,
  tempLevel: '',
  time: 0,
  location: '',
  customInfo: '',
})

//create a new error
const NEWERROR = (key: string, error: string, message: string) => ({
  key: key,
  error: error,
  message: message,
})

//TODO: turn this into a class
interface Error {
  key: string
  error: string
  message: string
}

interface RecipeFormProps {
  control: any
  formTitle: string
  submitBtnTxt?: string
  allStepsInit?: Array<any>
  stepInit: number
  reviewModeInit: boolean
  errorsInit?: Array<any>
}

interface Ingredient {
  id: number
  name: string
  quantity: number
  unit: string
}

interface Step {
  ingredients: Array<Ingredient>
  action: string
  tempNum: number
  tempLevel: string
  time: number
  location: string
  customInfo: string
}

const RecipeForm: React.FC<RecipeFormProps> = ({
  allStepsInit = [NEWSTEP()],
  stepInit = 0,
  reviewModeInit = false,
  errorsInit = [],
}) => {
  const [newRecipeErrs, setNewRecipeErrs] = React.useState<
    readonly GraphQLError[]
  >([])

  const [allSteps, setAllSteps] = React.useState<Array<Step>>(allStepsInit)
  const [currentStep, setCurrentStep] = React.useState(stepInit)
  const [totalSteps, setTotalSteps] = React.useState(stepInit)
  const [reviewMode, setReviewMode] = React.useState(reviewModeInit)
  const [errors, setErrors] = React.useState<Array<Error>>(errorsInit)

  const createError = (key: string, error: string, message: string) => {
    let err: Error = NEWERROR(key, error, message)
    setErrors((errors) => [...errors, err])
  }

  const deleteError = (key: string) => {
    let updatedErrors = errors.filter((err) => err.key != key)
    setErrors(updatedErrors)
  }

  const hasError = (key: string) => {
    return errors.filter((err) => err.key == key)
  }

  const createStep = () => {
    let newStep: Step = NEWSTEP()
    allSteps.push(newStep)
    setAllSteps(allSteps)
    setTotalSteps(totalSteps + 1)
  }

  const deleteStep = (stepNum: number) => {
    if (stepNum > -1) {
      let removedStep = allSteps.splice(stepNum, 1)
      setAllSteps(allSteps)
      setTotalSteps(totalSteps - 1)
      return removedStep
    }
  }

  const hasValue = (key: string, value: string, required: boolean) => {
    let ret = true
    if (!value) ret = false
    if (!value && required)
      createError(key, 'required', 'This field is required.')
    return ret
  }

  const validateStep = (stepNum: number) => {
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
      //ALL VALIDATION HERE
      false
    ) {
      valid = false
    }
    return valid
  }

  const createIngredient = (stepNum: number) => {
    let updatedSteps = [...allSteps]
    updatedSteps[stepNum].ingredients.push(NEWINGREDIENT())
    setAllSteps(updatedSteps)
  }

  const deleteIngredient = (ingredientId: number) => {
    let updatedSteps = [...allSteps]
    let toReplace = updatedSteps[currentStep].ingredients.filter(
      (ing) => ing.id == ingredientId
    )
    let index = updatedSteps[currentStep].ingredients.indexOf(toReplace[0])
    if (index > -1) {
      let removed = updatedSteps[currentStep].ingredients.splice(index, 1)
      setAllSteps(updatedSteps)
      //there should always be at least one empty ingredient
      if (updatedSteps[currentStep].ingredients.length <= 0)
        createIngredient(currentStep)
      return removed
    }
  }

  const updateIngredient = (
    stepNum: number,
    ingredientId: number,
    ingredient: Ingredient
  ) => {
    let updatedSteps = [...allSteps]
    let toReplace = updatedSteps[stepNum].ingredients.filter(
      (ing) => ing.id == ingredientId
    )
    let index = updatedSteps[stepNum].ingredients.indexOf(toReplace[0])
    if (index > -1) {
      updatedSteps[stepNum].ingredients[index] = ingredient
      setAllSteps(updatedSteps)
    }
  }
  const handleChange = (data: { target: { key: any; value: any } }) => {
    const { key, value }: { key: string; value: string } = data.target

    //remove an error that should no longer be active
    if (value && hasError(key)) deleteError(key)

    //VALIDATE HERE

    let updatedSteps = [...allSteps]
    setAllSteps(updatedSteps)
  }

  //create new step when current step does not yet exist
  !allSteps[currentStep] ? createStep() : ''

  //TESTING
  const handleClickA = () => {
    createStep()
    createError('ingredient', 'required', 'missing info')
    createIngredient(currentStep)
    let ni = NEWINGREDIENT()
    ni.name = 'New Ing'
    updateIngredient(1, allSteps[currentStep].ingredients[1].id, ni)
    console.log(allSteps)
    console.log(errors)
    console.log('steps', totalSteps)
    // let ingredient = NEWINGREDIENT()
    // updateIngredient(
    //   currentStep,
    //   allSteps[currentStep].ingredients[0].id,
    //   ingredient
    // )

    // createError('a', 'aer', 'a')
    // console.log(errors)

    console.log(allSteps)
  }
  const handleClickB = () => {
    deleteStep(0)
    deleteIngredient(allSteps[currentStep].ingredients[1].id)
    deleteError('ingredient')

    console.log(allSteps)
    console.log(errors)
    // console.log(errors)
  }

  return !reviewMode ? (
    <React.Fragment>
      <div className="container grid gap-4 w-6/12 m-auto bg-gray-100 p-8 h-400">
        <div className="w-full bg-red-800 h-40" onClick={handleClickA}></div>
        <div className="w-full bg-blue-800 h-40" onClick={handleClickB}></div>
      </div>
    </React.Fragment>
  ) : (
    //review mode
    <React.Fragment></React.Fragment>
  )
}

export default RecipeForm
