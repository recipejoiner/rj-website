import * as React from 'react'
import { GraphQLError } from 'graphql'
import TextField from '@material-ui/core/TextField'
import Autocomplete from '@material-ui/lab/Autocomplete'
import { cloneDeep } from 'lodash'
import {
  convertFractionToDecimal,
  removeFieldsByKey,
  ensureVarIsSet,
} from 'helpers/methods'
import {
  RecipeInputType,
  RecipeStepInputType,
  CreateRecipeVars,
} from 'requests/recipes'

import ImageFilePicker from 'helpers/ImageFilePicker'

//start GLOBAL VARIABLES
const IMAGE = require('images/icons/add.svg')
const TIME = require('images/icons/alarm-clock.svg')
const SERVINGS = require('images/icons/hot-food.svg')
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
  step: number
  key: string
  error: string
  message: string
}

interface RecipeFormProps {
  recipeInit?: RecipeInputType
  stepInit?: number
  reviewModeInit?: boolean
  errorsInit?: Array<any>
  serverErrors?: readonly GraphQLError[]
  submit: (attributes: CreateRecipeVars) => void
}
//end INTERFACES

//start HELPER FUNCTIONS

const minutesToTime = (totalMinutes: number) => {
  return { hours: Math.floor(totalMinutes / 60), minutes: totalMinutes % 60 }
}
function diff(num1: number, num2: number) {
  if (num1 > num2) {
    return num1 - num2
  } else {
    return num2 - num1
  }
}

const NewIngredient = () => ({
  id: (Date.now() * Math.random()).toFixed(0).toString(),
  name: '',
  quantity: 0,
  unit: '',
})

const NewStep = (index: number) => ({
  stepTitle: '',
  image: [],
  stepNum: index,
  ingredients: [],
  additionalInfo: '',
})

const NewRecipe: () => RecipeInputType = () => ({
  title: '',
  image: [],
  description: '',
  servings: 1,
  recipeTime: 0,
  steps: [NewStep(0)],
})

const NewError = (
  step: number,
  key: string,
  error: string,
  message: string
) => ({
  step: step,
  key: key,
  error: error,
  message: message,
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
    <div className="border-red-600 border">
      <span className="text-left text-sm text-red-600">{error.message}</span>
    </div>
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
    <div
      className="hover:scale-95 transform ease-in duration-200 w-10/12 my-2 cursor-pointer "
      onClick={onClick}
    >
      <div className="grid grid-cols-5 border-black border border-b-2 text-xl p-4 rounded-lg ">
        <span className=" text-2xl rounded-full text-center m-auto">
          {stepIndex + 1}
        </span>
        {/* {recipe.steps[stepIndex].image ? (
          <img src={} />
        ) : null} */}
        <span className="col-span-2 bg-white text-center rounded m-1">
          {recipe.steps[stepIndex].stepTitle}{' '}
        </span>

        <span className="col-span-2 bg-white text-center rounded  m-1">
          {recipe.steps[stepIndex].ingredients.map(
            (ing) =>
              (recipe.steps[stepIndex].ingredients.indexOf(ing) > 0
                ? ', '
                : '') + ing.name
          )}
        </span>
      </div>
    </div>
  )
}
interface RecipeStepProps {
  recipe: RecipeInputType
  step: number
  updateRecipe: (updatedRecipe: RecipeInputType) => void
  getError: (key: string) => Array<Error>
  updateError: (key: string, value?: string | number) => void
  deleteError: (key: string) => void
}

const RecipeStepMode: React.FC<RecipeStepProps> = ({
  recipe,
  updateRecipe,
  step,
  getError,
  updateError,
  deleteError,
}) => {
  const currentStep = step

  const [preview, setPreview] = React.useState<string | undefined>()
  const [imageErrs, setImageErrs] = React.useState<readonly GraphQLError[]>([])

  const validateQuantity = (value: string) => {
    const match =
      value && typeof value == 'string'
        ? value.match(/[0-9]+[ ]?([1-9]{1}([\/]?)[0-9]{0,2})?/)
        : ''
    return match?.length ? match[0] : ''
  }
  const updateValue = (name: string, value: string | Object, id?: string) => {
    let recipeCopy = cloneDeep<any>(recipe)
    let index = -1
    if (typeof value === 'string') {
      switch (name) {
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
          if (name === 'quantity') value = validateQuantity(value)
          if (index > -1)
            recipeCopy.steps[currentStep].ingredients[index][name] = value
          break
        default:
          recipeCopy.steps[currentStep][name] = value
          break
      }
      updateRecipe(recipeCopy)
      if (typeof value === 'string') {
        updateError(id || name, value)
      }
    } else {
      if (name === 'image') {
        recipeCopy.steps[currentStep].image[0] = value
        updateRecipe(recipeCopy)
        return
      }
    }
  }

  const createIngredient = () => {
    let recipeCopy = cloneDeep<any>(recipe)
    recipeCopy.steps[currentStep].ingredients.push(NewIngredient())
    updateRecipe(recipeCopy)
  }

  const deleteIngredient = (ingredientId: string) => {
    let recipeCopy = cloneDeep<any>(recipe)
    let toDelete = recipeCopy.steps[currentStep].ingredients.filter(
      (ing: { id: string }) => ing.id == ingredientId
    )[0]
    let index = recipeCopy.steps[currentStep].ingredients.indexOf(toDelete)
    if (index > -1) {
      recipeCopy.steps[currentStep].ingredients.splice(index, 1)
      updateRecipe(recipeCopy)
    }
    deleteError(ingredientId)
  }

  const handleChange = (data: {
    target: { name: any; value: any; id?: string }
  }) => {
    const {
      name,
      value,
      id,
    }: { name: string; value: string; id?: string } = data.target
    updateValue(name, value, id)
  }

  const onImageSelect = (file: File | undefined) => {
    if (file) {
      updateValue('image', file)
    }
  }

  const imagePicker = new ImageFilePicker(
    onImageSelect,
    setPreview,
    setImageErrs
  )

  const createImage = () => {
    const file = recipe.steps[currentStep].image
    if (file && file.length) {
      const objectUrl = URL.createObjectURL(file[0])
      setTimeout(() => URL.revokeObjectURL(objectUrl), 10000)
      return objectUrl
    }
    return IMAGE
  }

  return (
    <React.Fragment>
      <div className="">
        <div className="grid grid-rows-2">
          <span className="text-4xl">Step {currentStep + 1}:</span>
          <input
            className="bg-transparent w-full text-4xl text-gray-700 leading-tight focus:outline-none"
            type="text"
            placeholder="Title"
            name="stepTitle"
            value={recipe.steps[currentStep].stepTitle || ''}
            onChange={handleChange}
          ></input>
        </div>
        <div className="text-center rounded mt-4 mx-auto w-full h-auto bg-gray-500">
          <div className="w-full h-auto lg:w-32 lg:h-32 m-auto">
            <label className="cursor-pointer w-full block">
              <img
                className="object-cover w-full h-auto"
                src={preview ? preview : createImage()}
              />
              <div className="mb-1">
                {imageErrs.map((err) => {
                  return (
                    <span
                      key={err.message}
                      className="text-center text-sm text-red-600 left-0 w-full mt-2"
                    >
                      {err.message}
                    </span>
                  )
                })}
              </div>
              <input
                className="hidden"
                name="files"
                type="file"
                multiple={false}
                accept="image/*"
                onChange={imagePicker.onSelectFile}
              />
            </label>
          </div>
        </div>
      </div>

      <div className="text-center mt-4">
        <div className="text-center p-2 rounded">
          {recipe.steps[currentStep].ingredients.map((ing) => (
            <div className="grid grid-cols-2 mt-2 p-2  rounded bg-white h-full">
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
                  className="absolute"
                  onClick={() => ing.id && deleteIngredient(ing.id)}
                />
              </div>
              <div className="grid grid-cols-4 rounded justify-center m-auto ">
                <input
                  id={ing.id + '-quantity'}
                  className={
                    (getError(ing.id + '-quantity').length
                      ? 'border border-red-600'
                      : '') +
                    ' w-full text-xl border border-black p-3 focus:outline-none rounded text-center m-auto col-span-2'
                  }
                  value={ing.quantity || ''}
                  name="quantity"
                  placeholder="#"
                  type="text"
                  onChange={handleChange}
                ></input>
                <Autocomplete
                  id={ing.id + '-unit'}
                  className=" w-full  focus:outline-none p-2 rounded text-center m-auto col-span-2"
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
          <div className="flex justify-center">
            <button
              className="hover:scale-105 transform ease-in duration-200 border-b-2 w-full focus:outline-none text-xl text-gray-800 font-bold p-4 my-4 border border-black rounded"
              onClick={createIngredient}
            >
              Add Ingredient
            </button>
          </div>
        </div>
      </div>
      <div className="text-center mt-4">
        <div
          className={
            (getError('additionalInfo').length ? 'border border-red-600' : '') +
            ' w-full border-black border p-2 h-56 rounded '
          }
        >
          <textarea
            className="resize-none  w-full h-full text-xl bg-white text-gray-800 p-2 outline-none rounded"
            placeholder="Describe the step in concise detail!"
            name="additionalInfo"
            value={recipe.steps[currentStep].additionalInfo || ''}
            onChange={handleChange}
          ></textarea>
        </div>
      </div>
    </React.Fragment>
  )
}

interface RecipeReviewProps {
  recipe: RecipeInputType
  goToStep: (step: number) => void
  updateRecipe: (updatedRecipe: RecipeInputType) => void
  getError: (key: string) => Array<Error>
  updateError: (key: string, value?: string | number | File) => void
  deleteError: (key: string) => void
}
const RecipeReviewMode: React.FC<RecipeReviewProps> = ({
  recipe,
  goToStep,
  updateRecipe,
  getError,
  updateError,
  deleteError,
}) => {
  const [preview, setPreview] = React.useState<string | undefined>()
  const [imageErrs, setImageErrs] = React.useState<readonly GraphQLError[]>([])

  const updateValue = (name: string, value: string | number | File) => {
    let recipeCopy = cloneDeep<any>(recipe)
    let index = -1
    switch (name) {
      case 'hours':
      case 'minutes':
        let recipeTimeExpanded = minutesToTime(recipeCopy.recipeTime)
        recipeCopy.recipeTime +=
          name === 'hours'
            ? diff(recipeTimeExpanded.hours, Number(value)) * 60
            : diff(recipeTimeExpanded.hours, Number(value))
        break
      case 'servings':
        recipeCopy[name] = Number(value)
        break
      case 'image':
        recipeCopy['image'][0] = value
        break
      default:
        recipeCopy[name] = value
        break
    }
    updateRecipe(recipeCopy)
    updateError(name, value)
  }

  const handleChange = (data: { target: { name: any; value: any } }) => {
    const { name, value }: { name: string; value: string } = data.target
    updateValue(name, value)
  }
  const onImageSelect = (file: File | undefined) => {
    if (file) {
      updateValue('image', file)
    }
  }

  const imagePicker = new ImageFilePicker(
    onImageSelect,
    setPreview,
    setImageErrs
  )

  const createImage = () => {
    const file = recipe.image
    if (file && file.length) {
      const objectUrl = URL.createObjectURL(file[0])
      setTimeout(() => URL.revokeObjectURL(objectUrl), 10000)
      return objectUrl
    }
    return IMAGE
  }
  return (
    <React.Fragment>
      <div className="m-2 mb-8">
        <input
          className={
            (getError('title').length ? 'border-b-2 border-red-600' : '') +
            ' bg-transparent w-full text-5xl text-gray-700  py-1 leading-tight focus:outline-none  border-b-2 border-black '
          }
          type="text"
          placeholder="Recipe Title"
          name="title"
          value={recipe.title || ''}
          onChange={handleChange}
        ></input>
      </div>
      {recipe.steps.map((step) => {
        return (
          <StepMiniView
            recipe={recipe}
            stepIndex={step.stepNum}
            onClick={() => {
              goToStep(step.stepNum)
            }}
          />
        )
      })}
      <div className="text-center rounded mt-4 mx-auto w-full h-auto bg-gray-500">
        <div className="w-full h-auto lg:w-32 lg:h-32 m-auto">
          <label className="cursor-pointer w-full block">
            <img
              className="object-cover w-full h-auto"
              src={preview ? preview : createImage()}
            />
            <div className="mb-1">
              {imageErrs.map((err) => {
                return (
                  <span
                    key={err.message}
                    className="text-center text-sm text-red-600 left-0 w-full mt-2"
                  >
                    {err.message}
                  </span>
                )
              })}
            </div>
            <input
              className="hidden"
              name="files"
              type="file"
              multiple={false}
              accept="image/*"
              onChange={imagePicker.onSelectFile}
            />
          </label>
        </div>
      </div>
      <div className="grid  grid-cols-2 border border-black p-2 gap-4  rounded ">
        <div className="grid  grid-rows-2 p-2 rounded ">
          <img src={TIME} className="h-8 m-auto cursor-pointer rounded" />
          <div className=" grid grid-cols-2 text-center gap-4 text-xs">
            <div className="w-full rounded">
              <input
                className="text-xl w-full pl-3 m-auto border border-black text-center focus:outline-none rounded appearance-none"
                type="number"
                min="00"
                max="48"
                step="1"
                placeholder="H"
                name="hours"
                value={minutesToTime(recipe.recipeTime).hours || ''}
                onChange={handleChange}
              ></input>
              Hours
            </div>
            <div className="w-full rounded">
              <input
                className="text-xl w-full pl-3 m-auto border border-black text-center focus:outline-none rounded appearance-none"
                type="number"
                min="00"
                max="60"
                step="1"
                placeholder="M"
                name="minutes"
                value={minutesToTime(recipe.recipeTime).minutes || ''}
                onChange={handleChange}
              ></input>
              Minutes
            </div>
          </div>
        </div>
        <div className="grid  grid-rows-2 p-2 rounded text-center text-xs ">
          <img src={SERVINGS} className="h-8 m-auto cursor-pointer rounded" />
          <div className="w-full grid grid-rows-2 text-center justify-center rounded">
            <input
              className="text-xl w-8/12 pl-3 m-auto border border-black text-center focus:outline-none rounded appearance-none"
              type="number"
              min="1"
              step="1"
              placeholder="Servings"
              name="servings"
              value={recipe.servings || ''}
              onChange={handleChange}
            ></input>
            Servings
          </div>
        </div>
      </div>
      <div className=" w-full   my-4 h-40 rounded ">
        <textarea
          placeholder="Description and tags"
          className="resize-none h-full w-full text-xl mt-4 text-gray-700 border-black border rounded p-4 outline-none"
          name="description"
          value={recipe.description || ''}
          onChange={handleChange}
        ></textarea>
      </div>
    </React.Fragment>
  )
}
//end HELPER COMPONENTS

//start MAIN COMPONENT
const RecipeForm: React.FC<RecipeFormProps> = ({
  recipeInit = NewRecipe(),
  stepInit = 0,
  reviewModeInit = false,
  errorsInit = [],
  serverErrors,
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
      let err: Error = NewError(currentStep, key, error, message)
      setErrors((errors) => [...errors, err])
    }
  }

  const deleteError = (key: string) => {
    let updatedErrors = errors.filter(
      (err) => err.step !== currentStep && err.key !== key
    )
    setErrors(updatedErrors)
  }

  const updateError = (key: string, value?: string | number | File) => {
    if (value && getError(key).length) deleteError(key)
  }

  const getError = (key: string) => {
    return errors.filter((err) => err.step === currentStep && err.key === key)
  }

  const createStep = () => {
    let recipeCopy = cloneDeep<any>(recipe)
    let newStep: RecipeStepInputType = NewStep(currentStep + 1)
    recipeCopy.steps.push(newStep)
    setRecipe(recipeCopy)
  }

  const deleteStep = (stepNum: number) => {
    if (stepNum > -1) {
      let recipeCopy = cloneDeep<any>(recipe)
      if (recipeCopy.steps.length == 1) recipeCopy.steps[0] = NewStep(0)
      else recipeCopy.steps.splice(stepNum, 1)
      for (let stepIndex = 0; stepIndex < recipeCopy.steps.length; stepIndex++)
        recipeCopy.steps[stepIndex].stepNum = stepIndex
      setRecipe(recipeCopy)
      goToStep(currentStep - 1)
    }
  }

  const submitStep = (index: number) => {
    if (validateStep(currentStep)) {
      if (currentStep === recipe.steps.length - 1) createStep()
      goToStep(index)
    }
  }

  const goToStep = (stepNum: number) => {
    if (stepNum < 0) stepNum = 0
    setCurrentStep(stepNum)

    setReviewMode(false)
  }

  const validateStep = (stepNum: number) => {
    const { ingredients, additionalInfo } = recipe.steps[stepNum]
    return (
      (!ingredients.length ||
        ingredients
          .map((ing) => {
            return (
              validateValue(ing.id + '-name', ing.name, 'required') &&
              validateValue(ing.id + '-quantity', ing.quantity, 'required') &&
              validateValue(ing.id + '-quantity', ing.quantity, 'isRealNumber')
            )
          })
          .indexOf(false) < 0) &&
      validateValue('additionalInfo', additionalInfo, 'required')
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
      case 'isRealNumber':
        let match =
          value && typeof value == 'string'
            ? value.match(/[0-9]+([ ]{1}[1-9]{1}([\/]{1})[0-9]{1,2})?/)
            : ''
        if (!value || (match && match[0] !== value)) {
          createError(
            errorKey,
            'required',
            'This field must be a proper number.'
          )
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

  const goToReview = () => {
    let totalSteps = recipe.steps.length
    let badSteps = []
    for (let index = 0; index < totalSteps; index++) {
      if (!validateStep(index)) badSteps.push(index)
    }
    if (!!badSteps.length) goToStep(badSteps[0])
    else setReviewMode(true)
  }

  const updateRecipe = (updatedRecipe: RecipeInputType) => {
    console.log('Updating recipe to:', updatedRecipe)
    setRecipe(updatedRecipe)
    console.log('updated recipe: ', recipe)
  }

  const convertValuesForDB = () => {
    let recipeCopy = cloneDeep<any>(recipe)

    recipeCopy.steps.map((step: { ingredients: { quantity: string }[] }) => {
      step.ingredients.map((ing: { quantity: string }) => {
        ing.quantity = convertFractionToDecimal(ing.quantity)
        removeFieldsByKey(ing, ['id'])
      })
    })
    return recipeCopy
  }

  const submitRecipe = () => {
    if (validateValue('title', recipe.title, 'required')) {
      let recipeFinal = convertValuesForDB()
      submit({ attributes: recipeFinal })
    }
  }

  React.useEffect(() => setLoaded(true), [])

  return (
    <div className="max-w-3xl lg:my-8 mx-auto font-mono">
      <div className=" mx-auto mt-1 p-6 bg-white rounded-lg shadow-xl border-black ">
        {loaded && !reviewMode ? (
          <React.Fragment>
            {recipe.steps.map((step) => {
              if (currentStep !== step.stepNum) {
                return (
                  <StepMiniView
                    recipe={recipe}
                    stepIndex={step.stepNum}
                    onClick={() => goToStep(step.stepNum)}
                  />
                )
              } else {
                return (
                  <React.Fragment>
                    <DeleteX
                      className="-mx-6 -my-2 float-left"
                      onClick={() => deleteStep(currentStep)}
                    />
                    <RecipeStepMode
                      recipe={recipe}
                      updateRecipe={updateRecipe}
                      step={currentStep}
                      getError={getError}
                      updateError={updateError}
                      deleteError={deleteError}
                    />
                    <div className="w-full mt-8">
                      <div className="grid col-gap-4 grid-cols-2">
                        <button
                          className="hover:scale-105 transform ease-in duration-200 border-b-2 w-full focus:outline-none text-xl text-gray-800 font-bold p-4 my-4 border border-black rounded"
                          onClick={goToReview}
                        >
                          Finish
                        </button>
                        <button
                          className="hover:scale-105 transform ease-in duration-200 border-b-2 w-full focus:outline-none text-xl text-gray-800 font-bold p-4 my-4 border border-black rounded"
                          onClick={() => submitStep(currentStep + 1)}
                        >
                          Next Step
                        </button>
                      </div>
                    </div>
                  </React.Fragment>
                )
              }
            })}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <RecipeReviewMode
              recipe={recipe}
              updateRecipe={updateRecipe}
              goToStep={goToStep}
              getError={getError}
              updateError={updateError}
              deleteError={deleteError}
            />
            <button
              className="hover:scale-105 transform ease-in duration-200 border-b-2 w-full focus:outline-none text-xl text-gray-800 font-bold p-4 my-4 border border-black rounded"
              onClick={submitRecipe}
            >
              Post Recipe
            </button>
          </React.Fragment>
        )}
        {!!serverErrors && !!serverErrors?.length ? (
          <div className="text-center m-auto text-white bg-red-400 p-4 w-full">
            {serverErrors[0].message}
          </div>
        ) : (
          ''
        )}
      </div>
    </div>
  )
}

export default RecipeForm
