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
  recipeTime: {
    minutes: 0,
    hours: 0,
  },
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
      <div className="grid border-gray-400 text-gray-700 border border-b-2 text-xl rounded-full ">
        {/* {recipe.steps[stepIndex].image ? (
          <img src={} />
        ) : null} */}
        <span className=" m-1 truncate">
          <span className=" text-2xl border-black  mr-2 px-3 text-center">
            {stepIndex + 1}
          </span>
          {recipe.steps[stepIndex].stepTitle ||
            recipe.steps[stepIndex].additionalInfo}
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
    <div className="border border-black rounded">
      <div className="flex">
        <span className="text-4xl  mr-2 px-3 text-center">
          {currentStep + 1}
        </span>
        <input
          className="w-full text-3xl text-gray-700 leading-tight focus:outline-none"
          type="text"
          placeholder="Title"
          name="stepTitle"
          value={recipe.steps[currentStep].stepTitle || ''}
          onChange={handleChange}
        ></input>
      </div>
      <div className="text-center ">
        <div className=" w-full p-2 h-56 rounded ">
          <textarea
            className={`${
              getError('additionalInfo').length >= 1
                ? 'border border-red-600'
                : 'border border-gray-300'
            } resize-none  w-full h-full text-xl outline-none  border  p-2 rounded shadow-md`}
            placeholder="Describe the step in detail!"
            name="additionalInfo"
            value={recipe.steps[currentStep].additionalInfo || ''}
            onChange={handleChange}
          ></textarea>
        </div>
      </div>
      <div className="text-center">
        <div className="text-center rounded">
          {recipe.steps[currentStep].ingredients.map((ing) => (
            <div className="grid grid-rows-2 md:grid-rows-1 md:grid-cols-2 mt-2 shadow-md border-gray-200 border  m-2 my-3  rounded h-full">
              <div className="rounded text-center grid ">
                <Autocomplete
                  id={ing.id + '-name'}
                  className=" md:text-4xl  md:w-1/2 m-auto text-center focus:outline-none p-2 rounded "
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
                    ' w-full   p-3 focus:outline-none rounded text-center m-auto col-span-2'
                  }
                  value={ing.quantity || ''}
                  name="quantity"
                  placeholder="Amount"
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
          <div className="flex justify-center mt-2">
            <button
              className="-mb-5 border border-black rounded  bg-white focus:outline-none text-xl  border-b-2 text-gray-800  p-1 "
              onClick={createIngredient}
            >
              Add Ingredient
            </button>
          </div>
        </div>
      </div>
      {/* <div className="text-center rounded mx-auto w-1/2 h-auto">
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
      </div> */}
    </div>
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
        let hours =
          typeof value == 'string' ? value.match(/^(([0-9]){0,3})$/) : null
        if (!value || (hours && hours[0]))
          recipeCopy.recipeTime.hours = Number(value)
        break
      case 'minutes':
        let minutes =
          typeof value == 'string' ? value.match(/^(([0-9]){0,3})$/) : null
        if (!value || (minutes && minutes[0]))
          recipeCopy.recipeTime.minutes = Number(value)
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
    <div className="max-w-3xl lg:my-8 mx-auto ">
      <div className=" mx-auto mt-6 bg-white rounded-lg ">
        <div className="m-2 ">
          <input
            className={
              (getError('title').length ? 'border-b-2 border-red-600' : '') +
              ' cursor-pointer w-full text-3xl lg:text-5xl  leading-tight focus:outline-none font-bold'
            }
            type="text"
            placeholder="Recipe Title"
            name="title"
            value={recipe.title || ''}
            onChange={handleChange}
          ></input>
          <div className="w-full grid grid-cols-2  align-middle my-4  ">
            <div className="col-span-1">
              <input
                className="w-1/3 text-center border border-gray-300 focus:outline-none rounded "
                type="number"
                min="00"
                max="48"
                step="1"
                placeholder="00"
                name="hours"
                value={recipe.recipeTime.hours || ''}
                onChange={handleChange}
              ></input>
              <span> : </span>
              <input
                className="w-1/3 text-center border border-gray-300 focus:outline-none rounded "
                type="number"
                min="00"
                max="60"
                step="1"
                placeholder="00"
                name="minutes"
                value={recipe.recipeTime.minutes || ''}
                onChange={handleChange}
              ></input>
              <span> Time</span>
            </div>

            <div className="col-span-1">
              <input
                className="w-1/3 text-center border border-gray-300 focus:outline-none rounded "
                type="number"
                min="1"
                step="1"
                placeholder="#"
                name="servings"
                value={recipe.servings || ''}
                onChange={handleChange}
              ></input>
              <span> Servings</span>
            </div>
          </div>
        </div>

        <div key="overview">
          <div className=" grid items-center  w-full h-64  m-auto border-gray-300 border bg-gray-100">
            <label className="cursor-pointer w-full h-64 block">
              <img
                className="object-cover w-full h-64"
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
          <div className=" w-full h-full rounded ">
            <div className="h-full text-xl text-gray-700 mt-4 ">
              <textarea
                placeholder="Description and tags"
                className={`${
                  getError('description').length >= 1
                    ? 'border border-red-600'
                    : 'border border-gray-300'
                } resize-none  w-full h-full text-xl outline-none  border  p-2 rounded shadow-md`}
                name="description"
                value={recipe.description || ''}
                onChange={handleChange}
              ></textarea>
            </div>
          </div>
          {/* <div className="w-full text-center font-black">Ingredients</div>
          <div
            className={`${
              ingredients.length <= 0 ? 'border-none' : 'border'
            } rounded mx-2  m-auto my-2  p-2`}
          >
            {ingredients.map((ing: IngredientType) => (
              <Ingredient
                key={`${ing.ingredientInfo.name}${ing.quantity}`}
                ingredient={ing}
              />
            ))}
          </div> */}
        </div>
        <div className="w-full text-center font-black">Steps</div>
        <div className="m-2 border rounded">
          {recipe.steps.map((step) => (
            <div>
              <div
                className=" w-full p-2 cursor-pointer "
                onClick={() => goToStep(step.stepNum)}
              >
                <div className="grid grid-cols-12">
                  <span className=" flex col-span-2 h-full w-full m-auto border-gray-300 border-b-2  ">
                    <span className="m-auto">{step.stepNum + 1}</span>
                  </span>
                  <span className="col-span-10 bg-white my-auto p-4 rounded m-1 truncate">
                    {step.stepTitle || step.additionalInfo}
                  </span>
                </div>
              </div>
            </div>
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
    setRecipe(updatedRecipe)
  }

  const convertValuesForDB = () => {
    let recipeCopy = cloneDeep<any>(recipe)
    recipeCopy.recipeTime =
      recipeCopy.recipeTime.hours * 60 + recipeCopy.recipeTime.minutes
    recipeCopy.steps.map((step: { ingredients: { quantity: string }[] }) => {
      step.ingredients.map((ing: { quantity: string }) => {
        ing.quantity = convertFractionToDecimal(ing.quantity)
        removeFieldsByKey(ing, ['id'])
      })
    })
    console.log(recipeCopy)
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
    <div className="max-w-3xl lg:my-8 mx-auto ">
      <div className=" mx-auto mt-1 p-2 bg-white border-black ">
        {loaded && !reviewMode ? (
          <React.Fragment>
            <h1 className="text-center text-2xl mb-2">
              {recipe.title || 'New Recipe'}&nbsp;Steps
            </h1>
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
                    {/* <DeleteX
                      className="-mx-1 -my- float-left"
                      onClick={() => deleteStep(currentStep)}
                    /> */}
                    <span
                      className="text-xs float-right p-1"
                      onClick={() => deleteStep(currentStep)}
                    >
                      X
                    </span>
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
                          className="hover:scale-105 transform ease-in duration-200 border-b-2 w-full focus:outline-none text-xl bg-yellow-200 text-gray-800  p-2 my-4 border border-gray-300 rounded"
                          onClick={goToReview}
                        >
                          Finish
                        </button>
                        <button
                          className="hover:scale-105 transform ease-in duration-200 border-b-2 w-full focus:outline-none text-xl bg-green-200 text-gray-800  p-2 my-4 border border-gray-300 rounded"
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
              className=" border-b-2 w-full bg-green-200 focus:outline-none text-xl text-gray-800  p-4 my-4 border border-black rounded"
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
