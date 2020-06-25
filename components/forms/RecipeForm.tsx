import * as React from 'react'
import { GraphQLError } from 'graphql'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import Select from '@material-ui/core/Select'

import {
  RecipeInputType,
  RecipeInputStepType,
  CreateRecipeVars,
} from '../../requests/recipes'

//start GLOBAL VARIABLES
const LOCATION = require('../../images/icons/mixer.svg')
const IMAGE = require('../../images/icons/add.svg')
const TEMPERATURE = require('../../images/icons/fire.svg')
const TIME = require('../../images/icons/time.svg')
const actions = [
  { name: 'Mix' },
  { name: 'Cut' },
  { name: 'Chop' },
  { name: 'Bake' },
]
const temperatures = [
  { name: 'High' },
  { name: 'Medium' },
  { name: 'Low' },
  { name: '350F' },
  { name: '400F' },
]
const locations = [
  { name: 'Stove' },
  { name: 'Oven' },
  { name: 'Blender' },
  { name: 'Microwave' },
  { name: 'Bowl' },
]
const ingredients = [
  { name: 'Apple' },
  { name: 'Banana' },
  { name: 'Coffee' },
  { name: 'Flour' },
  { name: 'Rice' },
]
const units = [
  { name: 'Pound' },
  { name: 'Cup' },
  { name: 'Pinch' },
  { name: 'Tablespoon' },
  { name: 'Whole' },
]
//end GLOBAL VARIABLES

//start INTERFACES
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
  submit: (attributes: CreateRecipeVars) => void
}
//end INTERFACES

//start HELPER FUNCTIONS
const NewUseResultFromStep = () => ({
  id: Date.now().toString(),
  value: '',
})

const NewIngredient = () => ({
  id: Date.now().toString(),
  name: '',
  quantity: 1,
  unit: '',
})

const NewStep = () => ({
  action: '',
  ingredients: [],
  useResultsFromStep: [],
  temperature: '',
  time: { hours: 0, minutes: 0, seconds: 0 },
  location: '',
  customInfo: '',
})

const NewRecipe = () => ({
  title: '',
  description: '',
  servings: '',
  steps: [NewStep()],
})

const NewError = (
  key: string,
  error: string,
  message: string,
  step: number
) => ({
  key: key,
  error: error,
  message: message,
  step: step,
})
//end HELPER FUNCTIONS

//start HELPER COMPONENTS
const ErrorField = ({
  name,
  errors,
}: {
  name: string
  errors: Array<Error>
}) => {
  const error = errors.filter((err) => err.key === name)[0]
  return error ? (
    <React.Fragment>
      <span className="text-sm text-red-600">{error.message}</span>
    </React.Fragment>
  ) : (
    <React.Fragment />
  )
}
const DeleteX = ({
  onClick,
  title,
  className,
}: {
  onClick: (event: React.MouseEvent<SVGSVGElement>) => void
  title?: string
  className?: string
}) => {
  return (
    <svg
      onClick={onClick}
      className={
        (className || '') +
        ' text-gray-200 hover:text-pink-300 fill-current mx-auto h-6 w-6 '
      }
      role="button"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
    >
      <title>{title || 'Delete'}</title>
      <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
    </svg>
  )
}
const StepMiniView = ({
  recipe,
  stepIndex,
  onClick,
}: {
  recipe: RecipeInputType
  stepIndex: number
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void
}) => {
  return (
    <div className=" w-10/12 my-2 cursor-pointer" onClick={onClick}>
      <div className="grid grid-cols-3 bg-gray-200 text-xl p-4 bg-white rounded-lg shadow-s">
        <span className="rounded-full h-8 w-8 text-center bg-white">
          {stepIndex + 1}
        </span>

        <div>{recipe.steps[stepIndex].action}</div>
        <div>
          {recipe.steps[stepIndex].ingredients.map((ing) => ing.name + ' ')}
          {recipe.steps[stepIndex].useResultsFromStep.map((step) => (
            <span className="bg-white p-1">{step.value + ' '}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
//end HELPER COMPONENTS

//start MAIN COMPONENT
const RecipeForm: React.FC<RecipeFormProps> = ({
  recipeInit = NewRecipe(),
  stepInit = 0,
  reviewModeInit = false,
  errorsInit = [],
  submit,
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
      let err: Error = NewError(key, error, message, currentStep)
      setErrors((errors) => [...errors, err])
    }
  }

  const deleteError = (key: string) => {
    let updatedErrors = errors.filter((err) => err.key != key)
    setErrors(updatedErrors)
  }

  const updateError = (key: string, value?: string | number) => {
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

  const submitStep = (index: number) => {
    if (validateStep(currentStep)) {
      if (currentStep === recipe.steps.length - 1) createStep()
      goToStep(index)
    }
  }

  const submitRecipe = () => {
    if (validateValue('title', recipe.title, 'required')) {
      console.log(recipe)
      submit({ attributes: recipe })
    }
  }

  const validateStep = (stepNum: number) => {
    const { ingredients, action, useResultsFromStep } = recipe.steps[stepNum]
    return (
      validateValue('action', action, 'required') &&
      ingredients
        .map((ing) => {
          return (
            validateValue(ing.id + '-name', ing.name, 'required') &&
            validateValue(ing.id + '-quantity', ing.quantity, 'required')
          )
        })
        .indexOf(false) < 0 &&
      useResultsFromStep
        .map((step) => {
          return validateValue(step.id, step.value, 'required')
        })
        .indexOf(false) < 0 &&
      (ingredients.length || useResultsFromStep.length)
    )
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
      setRecipe(recipeCopy)
    }
    deleteError(ingredientId)
  }

  const createUseResultsFromStep = () => {
    let recipeCopy = JSON.parse(JSON.stringify(recipe))
    recipeCopy.steps[currentStep].useResultsFromStep.push(
      NewUseResultFromStep()
    )
    setRecipe(recipeCopy)
  }

  const deleteUseResultsFromStep = (id: string) => {
    let recipeCopy = JSON.parse(JSON.stringify(recipe))
    let toDelete = recipeCopy.steps[currentStep].useResultsFromStep.filter(
      (step: { id: string }) => step.id === id
    )[0]
    let index = recipeCopy.steps[currentStep].useResultsFromStep.indexOf(
      toDelete
    )
    if (index > -1) {
      recipeCopy.steps[currentStep].useResultsFromStep.splice(index, 1)
      setRecipe(recipeCopy)
    }
    deleteError(id)
  }

  const goToReview = () => {
    let totalSteps = recipe.steps.length
    let badSteps = []
    for (let index = 0; index < totalSteps; index++) {
      if (!validateStep(index)) badSteps.push(index)
    }
    if (!!badSteps.length) goToStep(badSteps[0])
    else setReviewMode(true)
  }

  const updateValue = (name: string, value: string | number, id?: string) => {
    let recipeCopy = JSON.parse(JSON.stringify(recipe))
    let index = -1
    switch (name) {
      case 'useResultsFromStep':
        index = recipeCopy.steps[currentStep].useResultsFromStep.indexOf(
          recipeCopy.steps[currentStep].useResultsFromStep.filter(
            (step: { id: string }) => step.id === id
          )[0]
        )
        if (
          (index > -1 && Number(value) <= currentStep && Number(value) > 0) ||
          value === ''
        )
          recipeCopy.steps[currentStep].useResultsFromStep[index].value = value
        break
      //modified field is part of ingredient
      case 'name':
      case 'unit':
      case 'quantity':
        index = recipeCopy.steps[currentStep].ingredients.indexOf(
          recipeCopy.steps[currentStep].ingredients.filter(
            (ing: { id: string }) =>
              id && ing.id === id.substring(0, id.indexOf('-'))
          )[0]
        )
        if (index > -1)
          recipeCopy.steps[currentStep].ingredients[index][name] = value
        break
      case 'hours':
      case 'minutes':
      case 'seconds':
        recipeCopy.steps[currentStep].time[name] = value
        break
      case 'title':
      case 'description':
        recipeCopy[name] = value
        break
      default:
        recipeCopy.steps[currentStep][name] = value
        break
    }
    setRecipe(recipeCopy)
    updateError(id || name, value)
  }

  const handleChange = (data: {
    target: { name: any; value: any; id?: any }
  }) => {
    const {
      name,
      value,
      id,
    }: { name: string; value: string; id?: string } = data.target
    updateValue(name, value, id)
  }

  React.useEffect(() => setLoaded(true), [])

  return loaded && !reviewMode ? (
    <React.Fragment>
      <div className="max-w-2xl mx-auto">
        {!!currentStep &&
          recipe.steps.map((step) => {
            let index = recipe.steps.indexOf(step)
            if (index < currentStep) {
              return (
                <StepMiniView
                  recipe={recipe}
                  stepIndex={index}
                  onClick={() => goToStep(index)}
                />
              )
            }
          })}
        <span className="mt-8 text-6xl">Step {currentStep + 1}</span>
        <DeleteX
          className="mt-8 float-right"
          onClick={() => deleteStep(currentStep)}
        />
        <div className=" mt-1 mx-auto mt-1 p-6 bg-white rounded-lg shadow-xl border-purple-100 border-2">
          <div className="grid  col-gap-4">
            <div className="bg-gray-200 p-2 rounded mb-2 text-center">
              <Autocomplete
                id="action"
                style={{ width: '100%' }}
                options={actions}
                getOptionLabel={(option) => option.name}
                freeSolo
                autoHighlight={true}
                value={
                  actions.filter(
                    (e) => e.name === recipe.steps[currentStep].action
                  )[0] || {}
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="TASK"
                    variant="outlined"
                    margin="normal"
                    error={!!getError('action').length ? true : false}
                    helperText={
                      !!getError('action').length
                        ? getError('action')[0].message
                        : false
                    }
                  />
                )}
                onChange={(
                  event: object,
                  value: any | any[],
                  reason: string
                ) => {
                  updateValue('action', value ? value.name : '')
                }}
              />
            </div>
            <div className="grid grid-cols-1 grid-rows-3 lg:grid-cols-3 lg:grid-rows-1 col-gap-1 row-gap-2 content-end mb-2">
              <div className="grid lg:grid-cols-1 grid-cols-3 bg-gray-200 p-2 rounded ">
                <img
                  src={TEMPERATURE}
                  className="h-8 m-auto cursor-pointer rounded"
                  onClick={() => updateValue('temperature', '')}
                />
                <Autocomplete
                  id="temperature"
                  className="col-span-2"
                  style={{ width: '100%' }}
                  options={temperatures}
                  getOptionLabel={(option) => option.name}
                  freeSolo
                  autoHighlight={true}
                  value={
                    temperatures.filter(
                      (e) => e.name === recipe.steps[currentStep].temperature
                    )[0] || {}
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="TEMP"
                      variant="outlined"
                      margin="normal"
                      error={!!getError('temperature').length ? true : false}
                      helperText={
                        !!getError('temperature').length
                          ? getError('temperature')[0].message
                          : false
                      }
                    />
                  )}
                  onChange={(
                    event: object,
                    value: any | any[],
                    reason: string
                  ) => {
                    console.log(value)
                    updateValue('temperature', value ? value.name : '')
                  }}
                />
                {/* <select
                  className="bg-white h-12 focus:outline-none p-2 rounded col-span-2  "
                  placeholder="Temp"
                  name="temperature"
                  value={recipe.steps[currentStep].temperature || ''}
                  onChange={handleChange}
                >
                  <option disabled selected hidden value="">
                    - Temp -
                  </option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                  <option value="275">275</option>
                  <option value="300">300</option>
                  <option value="350">350</option>
                </select> */}
              </div>
              <div className="grid lg:grid-cols-1 grid-cols-3 bg-gray-200 p-2 rounded ">
                <img
                  src={TIME}
                  className="h-8 m-auto cursor-pointer rounded"
                  onClick={() => {
                    updateValue('hours', '0')
                    updateValue('minutes', '0')
                    updateValue('seconds', '0')
                  }}
                />
                <div className="col-span-2 grid grid-cols-3 mt-4 text-center gap-4 text-xs">
                  <div className="w-full rounded">
                    <input
                      className="text-xl w-full text-center focus:outline-none rounded appearance-none"
                      type="number"
                      min="00"
                      max="48"
                      step="1"
                      placeholder="H"
                      name="hours"
                      value={recipe.steps[currentStep].time.hours || ''}
                      onChange={handleChange}
                    ></input>
                    Hours
                  </div>
                  <div className="w-full rounded">
                    <input
                      className="text-xl w-full text-center focus:outline-none rounded appearance-none"
                      type="number"
                      min="00"
                      max="60"
                      step="1"
                      placeholder="M"
                      name="minutes"
                      value={recipe.steps[currentStep].time.minutes || ''}
                      onChange={handleChange}
                    ></input>
                    Minutes
                  </div>
                  <div className="w-full rounded">
                    <input
                      className=" text-xl w-full text-center focus:outline-none  rounded appearance-none"
                      type="number"
                      min="00"
                      max="60"
                      step="1"
                      placeholder="S"
                      name="seconds"
                      value={recipe.steps[currentStep].time.seconds || ''}
                      onChange={handleChange}
                    ></input>
                    Seconds
                  </div>
                </div>
              </div>
              <div className="grid lg:grid-cols-1 grid-cols-3 bg-gray-200 p-2 rounded">
                <img
                  src={LOCATION}
                  className="h-8 m-auto cursor-pointer rounded"
                  onClick={() => updateValue('location', '')}
                />
                <Autocomplete
                  id="location"
                  className="col-span-2"
                  style={{ width: '100%' }}
                  options={locations}
                  getOptionLabel={(option) => option.name}
                  freeSolo
                  autoHighlight={true}
                  value={
                    locations.filter(
                      (e) => e.name === recipe.steps[currentStep].location
                    )[0] || {}
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="TOOL"
                      variant="outlined"
                      margin="normal"
                      error={!!getError('location').length ? true : false}
                      helperText={
                        !!getError('location').length
                          ? getError('location')[0].message
                          : false
                      }
                    />
                  )}
                  onChange={(
                    event: object,
                    value: any | any[],
                    reason: string
                  ) => {
                    updateValue('location', value ? value.name : '')
                  }}
                />
                {/* <select
                  className="bg-white h-12 w-full focus:outline-none p-2 rounded col-span-2 "
                  name="location"
                  value={recipe.steps[currentStep].location}
                  onChange={handleChange}
                >
                  {' '}
                  <option disabled selected hidden value="">
                    - Tool -
                  </option>
                  <option value="oven">Oven</option>
                  <option value="stove">Stove</option>
                  <option value="blender">Blender</option>
                </select> */}
              </div>
            </div>
          </div>

          {recipe.steps[currentStep].ingredients.map((ing) => (
            <div className="mt-2 rounded">
              <div className="rounded text-center grid ">
                <Autocomplete
                  id={ing.id + '-name'}
                  className="bg-white md:text-4xl  text-2xl md:w-1/2 m-auto text-center focus:outline-none p-2 rounded "
                  style={{ width: '100%' }}
                  options={ingredients}
                  getOptionLabel={(option) => option.name}
                  freeSolo
                  autoHighlight={true}
                  value={
                    ingredients.filter((e) => e.name === ing.name)[0] || {}
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="INGREDIENT"
                      variant="outlined"
                      margin="normal"
                      error={!!getError(ing.id + '-name').length ? true : false}
                      helperText={
                        !!getError(ing.id + '-name').length
                          ? getError(ing.id + '-name')[0].message
                          : false
                      }
                    />
                  )}
                  onChange={(
                    event: object,
                    value: any | any[],
                    reason: string
                  ) => {
                    updateValue(
                      'name',
                      value ? value.name : '',
                      ing.id + '-name'
                    )
                  }}
                />
                <DeleteX
                  className="absolute text-pink-200"
                  onClick={() => deleteIngredient(ing.id.toString())}
                />
              </div>
              <div className="grid grid-cols-4 bg-gray-200 rounded justify-center m-auto w-8/12 ">
                <input
                  className={
                    !!getError(ing.id + '-quantity').length
                      ? 'border-red-600'
                      : '' +
                        ' text-center w-full text-2xl focus:outline-none p-2 bg-gray-200 rounded text-center m-auto'
                  }
                  type="number"
                  placeholder="#"
                  id={ing.id + '-quantity'}
                  name="quantity"
                  onChange={handleChange}
                  value={ing.quantity || ''}
                />
                <Autocomplete
                  id={ing.id + '-unit'}
                  className="text-center w-full  focus:outline-none p-2 rounded text-center m-auto col-span-3"
                  style={{ width: '100%' }}
                  options={units}
                  getOptionLabel={(option) => option.name}
                  autoHighlight={true}
                  value={units.filter((e) => e.name === ing.unit)[0] || {}}
                  closeIcon=""
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Unit"
                      variant="outlined"
                      margin="normal"
                      error={!!getError(ing.id + '-unit').length ? true : false}
                      helperText={
                        !!getError(ing.id + '-unit').length
                          ? getError(ing.id + '-unit')[0].message
                          : false
                      }
                    />
                  )}
                  onChange={(
                    event: object,
                    value: any | any[],
                    reason: string
                  ) => {
                    updateValue(
                      'unit',
                      value ? value.name : '',
                      ing.id + '-unit'
                    )
                  }}
                />
              </div>
            </div>
          ))}
          {currentStep > 0 &&
            recipe.steps[currentStep].useResultsFromStep.map((step) => (
              <div className="mt-4 p-2 rounded">
                <div className="grid grid-cols-2 col-gap-4">
                  <div className="grid grid-cols-3 p-2 col-gap-1 content-start">
                    <DeleteX
                      className="self-center"
                      onClick={() => deleteUseResultsFromStep(step.id)}
                    />
                    <span className="text-xl col-span-2 p-2 bg-gray-200 rounded text-center text-gray-700">
                      Use Result From:
                    </span>
                  </div>
                  <div className="pb-2 ">
                    <input
                      className="bg-transparent  w-full text-3xl text-gray-700  py-1 leading-tight focus:outline-none  border-b-4 border-black "
                      type="number"
                      min="1"
                      max={currentStep}
                      placeholder="STEP"
                      id={step.id}
                      name="useResultsFromStep"
                      onChange={handleChange}
                      value={step.value || ''}
                    ></input>
                    <ErrorField name={step.id} errors={errors} />
                  </div>
                </div>
              </div>
            ))}
          <div className="flex justify-end">
            <div className="w-6/12 flex justify-between">
              <button
                className="bg-blue-100 hover:bg-blue-200 focus:outline-none text-gray-800 p-2 rounded m-4 w-6/12"
                onClick={createIngredient}
              >
                + Ingredient
              </button>
              {currentStep > 0 && (
                <button
                  className="bg-blue-100 hover:bg-blue-200 focus:outline-none text-gray-800 p-2 rounded m-4 w-6/12"
                  onClick={createUseResultsFromStep}
                >
                  + Result
                </button>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 p-2 w-full h-40 rounded gap-4">
            <div className=" grid items-center bg-gray-200">
              <img className="w-12 h-12 m-auto" src={IMAGE} />
            </div>
            <textarea
              placeholder="More Details"
              name="customInfo"
              className="resize-none h-full w-full text-xl bg-gray-200 rounded p-4 outline-none"
            ></textarea>
          </div>
        </div>
        <div className="w-full mt-8 mb-8">
          <div className="grid col-gap-4 grid-cols-2">
            <button
              className="bg-blue-100 hover:bg-blue-200 focus:outline-none text-xl text-gray-800 font-bold py-2 px-4 rounded"
              onClick={() => submitStep(currentStep + 1)}
            >
              Next Step
            </button>
            <button
              className="bg-orange-100 hover:bg-orange-200 focus:outline-none text-xl text-gray-800 font-bold py-2 px-4 rounded"
              onClick={goToReview}
            >
              Finish
            </button>
          </div>
        </div>
        {recipe.steps.map((step) => {
          let index = recipe.steps.indexOf(step)
          if (index > currentStep)
            return (
              <StepMiniView
                recipe={recipe}
                stepIndex={index}
                onClick={() => goToStep(index)}
              />
            )
        })}
        <ErrorField name="step" errors={errors} />
      </div>
    </React.Fragment>
  ) : (
    //review mode
    <React.Fragment>
      <div className="max-w-xl mt-8 mx-auto">
        <div className=" mt-1 mx-auto mt-1 p-6 bg-white rounded-lg shadow-xl border-purple-100 border-2">
          <div className="m-2 mb-8">
            <input
              className="bg-transparent w-full text-5xl text-gray-700  py-1 leading-tight focus:outline-none  border-b-4 border-black "
              type="text"
              placeholder="Title"
              name="title"
              value={recipe.title || ''}
              onChange={handleChange}
            ></input>
            <ErrorField name="title" errors={errors} />
          </div>
          {recipe.steps.map((step) => {
            let index = recipe.steps.indexOf(step)
            return (
              <StepMiniView
                recipe={recipe}
                stepIndex={index}
                onClick={() => {
                  setReviewMode(false)
                  goToStep(index)
                }}
              />
            )
          })}
          <div className="grid grid-cols-3 grid-rows-3 my-8">
            {Array.from(Array(9)).map(() => {
              return (
                <div className="grid items-center bg-gray-200 m-2 rounded">
                  <img className="w-1/2 m-auto" src={IMAGE} />
                </div>
              )
            })}
          </div>
          <textarea
            placeholder="Description and tags"
            className="resize-none h-full w-full text-xl text-gray-700 bg-gray-200 rounded p-4 outline-none"
          ></textarea>
        </div>
        <button
          className="bg-orange-100 w-full focus:outline-none text-xl text-gray-800 font-bold p-4 my-4 rounded"
          onClick={submitRecipe}
        >
          Post Recipe
        </button>
      </div>
    </React.Fragment>
  )
}

export default RecipeForm
