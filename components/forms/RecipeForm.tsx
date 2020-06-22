import * as React from 'react'
import { GraphQLError } from 'graphql'
import { RecipeInputType, RecipeInputStepType } from '../../requests/recipes'
import { setupMaster } from 'cluster'

//start GLOBAL VARIABLES
const THERMOMETER =
  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pg0KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjAuMCwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPg0KPHN2ZyB2ZXJzaW9uPSIxLjEiIGlkPSJDYXBhXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4Ig0KCSB2aWV3Qm94PSIwIDAgNDQ4IDQ0OCIgc3R5bGU9ImVuYWJsZS1iYWNrZ3JvdW5kOm5ldyAwIDAgNDQ4IDQ0ODsiIHhtbDpzcGFjZT0icHJlc2VydmUiPg0KPGc+DQoJPGc+DQoJCTxwYXRoIGQ9Ik0zMDMuODksMjU3LjA4N1Y4MC4xOTFDMzAzLjg5LDM1LjkwMywyNjguMTU2LDAsMjIzLjgzNiwwYy00NC4yODIsMC03OS45NjEsMzQuNDk2LTc5Ljk2MSw3OC43ODRWMjU2DQoJCQljLTE5Ljc1LDIwLjI1Ni0zMi4xMzMsNDkuMjc5LTMyLjEzMyw3OS44MDhDMTExLjc0MiwzOTcuNzQ1LDE2Miw0NDgsMjI0LDQ0OGM2MS45NjksMCwxMTIuMjU4LTUwLjI1NiwxMTIuMjU4LTExMi4xOTINCgkJCUMzMzYuMjU4LDMwNS4xMiwzMjMuNzU4LDI3Ny4zNzUsMzAzLjg5LDI1Ny4wODd6IE0yMjQsNDE2Yy00NC4yNSwwLTgwLjI1OC0zNS45NzQtODAuMjU4LTgwLjE5Mg0KCQkJYzAtMjEuMTg2LDguNjE3LTQyLjY3LDIzLjA0Ny01Ny40N2w5LjA4Ni05LjMyVjI1NlY3OC43ODRjMC0yNi4yMzQsMjEuMDctNDYuNzg0LDQ3Ljk2MS00Ni43ODQNCgkJCWMyNi41LDAsNDguMDU0LDIxLjYxOCw0OC4wNTQsNDguMTkxdjE3Ni44OTd2MTMuMDYxbDkuMTQxLDkuMzNjMTQuOTc3LDE1LjI5NCwyMy4yMjYsMzUuMjk5LDIzLjIyNiw1Ni4zMjkNCgkJCUMzMDQuMjU4LDM4MC4wMjUsMjY4LjI1OCw0MTYsMjI0LDQxNnoiLz4NCgk8L2c+DQo8L2c+DQo8Zz4NCgk8Zz4NCgkJPHBhdGggZD0iTTI0MCwyODkuODgzYzAtNzUuMjE0LDAtNTkuMDA0LDAtMTQ1Ljg4NGgtMzJjMCw4Ny4wMTYsMCw3MC41NTQsMCwxNDUuODg2Yy0xNi4wMDQsOS4zMTEtMzIsMjAuMjQ0LTMyLDQ1LjkyMg0KCQkJYzAsMjYuNDY2LDIxLjUzMSw0OCw0OCw0OHM0OC0yMS41MzQsNDgtNDhDMjcyLDMxMC4xMzEsMjU2LjAwNCwyOTkuMTk3LDI0MCwyODkuODgzeiIvPg0KCTwvZz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjxnPg0KPC9nPg0KPGc+DQo8L2c+DQo8Zz4NCjwvZz4NCjwvc3ZnPg0K'
const IMAGE =
  'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIj8+CjxzdmcgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIiBpZD0iTGF5ZXJfMSIgZGF0YS1uYW1lPSJMYXllciAxIiB2aWV3Qm94PSIwIDAgNTEyIDUxMiIgd2lkdGg9IjUxMiIgaGVpZ2h0PSI1MTIiPjx0aXRsZT5waW4gbG9jYXRpb24gbmF2aWdhdGlvbjwvdGl0bGU+PHBhdGggZD0iTTE1NC4xNTQsMTc0LjMxOWE0Ny4zNjgsNDcuMzY4LDAsMSwwLTQ3LjM2OC00Ny4zNjhBNDcuNDIxLDQ3LjQyMSwwLDAsMCwxNTQuMTU0LDE3NC4zMTlabTAtODIuNzM1YTM1LjM2OCwzNS4zNjgsMCwxLDEtMzUuMzY4LDM1LjM2N0EzNS40MDcsMzUuNDA3LDAsMCwxLDE1NC4xNTQsOTEuNTg0WiIvPjxwYXRoIGQ9Ik00MjYuNDgyLDIxNi42NDl2LTgzLjNhNDIuODE5LDQyLjgxOSwwLDAsMC00Mi43NzEtNDIuNzcxSDM3MS4zMjZWODcuMzgxQTQyLjgyLDQyLjgyLDAsMCwwLDMyOC41NTQsNDQuNjFINTIuNzcxQTQyLjgxOSw0Mi44MTksMCwwLDAsMTAsODcuMzgxVjI3Mi40NDNhNDIuODIsNDIuODIsMCwwLDAsNDIuNzcxLDQyLjc3Mkg2NS4xNTd2My4xOTJhNDIuODIsNDIuODIsMCwwLDAsNDIuNzcxLDQyLjc3MmgxMzMuMjJjMTEuODkyLDYwLjQ2LDY1LjI5MywxMDYuMjExLDEyOS4xODcsMTA2LjIxMSw3Mi42LDAsMTMxLjY2NS01OS4wNjUsMTMxLjY2NS0xMzEuNjY1QTEzMS44MzIsMTMxLjgzMiwwLDAsMCw0MjYuNDgyLDIxNi42NDlaTTM4My43MTEsMTAyLjU3NGEzMC44MDYsMzAuODA2LDAsMCwxLDMwLjc3MSwzMC43NzF2NzguMzM3YTEzMS4wMDYsMTMxLjAwNiwwLDAsMC00My4xNTYtNy42MXYtMTAxLjVaTTUyLjc3MSw1Ni42MUgzMjguNTU0YTMwLjgwNiwzMC44MDYsMCwwLDEsMzAuNzcyLDMwLjc3MVYyMDQuNTNhMTMwLjc4OCwxMzAuNzg4LDAsMCwwLTU4Ljc2LDE5LjUyMWwtMjcuODgtMTcuOTFhMjYuOSwyNi45LDAsMCwwLTM1LjAwOCwzLjQ1N2wtMjcuODY2LDI5LjAzOC02NC4zMjYtMzkuOTA3QTI3LjEyNiwyNy4xMjYsMCwwLDAsMTE0LjYsMjAwLjM3TDIyLDI2MS43Vjg3LjM4MUEzMC44MDYsMzAuODA2LDAsMCwxLDUyLjc3MSw1Ni42MVptMTkzLjU2NSwxNjEuM2ExNC45NzEsMTQuOTcxLDAsMCwxLDE5LjU0Ny0xLjg4Yy4wNy4wNS4xNDIuMS4yMTUuMTQ1bDIzLjgxNCwxNS4zYTEzMS42MjMsMTMxLjYyMywwLDAsMC00Ny4xNzEsNzEuNzQ2SDE2NC40NzNabS0yMjQuMTMsNTguMDUsOTkuMjIyLTY1LjcxNmMuMTQ1LS4wOTUuMjg1LS4yLjQyMS0uM2ExNS4wOTIsMTUuMDkyLDAsMCwxLDE3LjMxMS0xLjAwOWw2Mi4xNTgsMzguNTYxLTUzLjQ3Nyw1NS43MjdINTIuNzcxQTMwLjgxMiwzMC44MTIsMCwwLDEsMjIuMjA2LDI3NS45NTZabTg1LjcyMiw3My4yMjNhMzAuODA2LDMwLjgwNiwwLDAsMS0zMC43NzEtMzAuNzcydi0zLjE5MkgyNDAuMjc0YTEzMi4zNjksMTMyLjM2OSwwLDAsMC0uOTIyLDMzLjk2NFpNMzcwLjMzNSw0NTUuMzlBMTE5LjY2NSwxMTkuNjY1LDAsMSwxLDQ5MCwzMzUuNzI1LDExOS44LDExOS44LDAsMCwxLDM3MC4zMzUsNDU1LjM5WiIvPjxwYXRoIGQ9Ik00MjkuOTQ4LDI3Ni4xMWE1MC44Niw1MC44NiwwLDAsMC03NS45MTgsNjcuNDM1bC01Ni40NSw1Ni40NDlhNiw2LDAsMCwwLDguNDg2LDguNDg1bDU2LjQ0Ni01Ni40NDdhNTAuODYyLDUwLjg2MiwwLDAsMCw2Ny40MzYtNzUuOTIxWm0tOC40ODUsNjMuNDUyYTM4Ljg0OSwzOC44NDksMCwxLDEsMC01NC45NjVoMEEzOC45MTEsMzguOTExLDAsMCwxLDQyMS40NjMsMzM5LjU2MloiLz48cGF0aCBkPSJNNDEyLjY1NCwzMTguNjI4YTEyLjg1MiwxMi44NTIsMCwwLDEtMTEuMjUsMTEuMjQ5LDYsNiwwLDAsMCwuNzEsMTEuOTU4LDYuMTE1LDYuMTE1LDAsMCwwLC43MjQtLjA0NCwyNC44MjQsMjQuODI0LDAsMCwwLDIxLjczLTIxLjcyOSw2LDYsMCwxLDAtMTEuOTE0LTEuNDM0WiIvPjwvc3ZnPgo='
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
  onSubmit: any
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
  onClick: (event: React.MouseEvent<HTMLDivElement>) => void
  title?: string
  className?: string
}) => {
  return (
    <span
      className={(className || '') + ' text-gray-300 hover:text-pink-300'}
      onClick={onClick}
    >
      <svg
        className="fill-current mx-auto h-6 w-6"
        role="button"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
      >
        <title>{title || 'Delete'}</title>
        <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z" />
      </svg>
    </span>
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
      <div className="grid grid-cols-3 bg-gray-300 text-xl p-4 bg-white rounded-lg shadow-s">
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
  onSubmit,
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

  const submitStep = (index: number) => {
    if (validateStep(currentStep)) {
      if (currentStep === recipe.steps.length - 1) createStep()
      goToStep(index)
    }
  }

  const submitRecipe = () => {
    if (validateValue('title', recipe.title, 'required')) {
      onSubmit(recipe)
      console.log('from recipeform')
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

  const handleChange = (data: {
    target: { name: any; value: any; id?: any }
  }) => {
    const {
      name,
      value,
      id,
    }: { name: string; value: string; id?: string } = data.target

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
      case 'title':
        recipeCopy[name] = value
        break
      default:
        recipeCopy.steps[currentStep][name] = value
        break
    }
    setRecipe(recipeCopy)
    updateError(id || name, value)
  }

  React.useEffect(() => setLoaded(true), [])

  return loaded && !reviewMode ? (
    <React.Fragment>
      <div className="max-w-md mx-auto">
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
        <div className=" mt-1 mx-auto mt-1 p-6 bg-white rounded-lg shadow-xl">
          <div className="grid grid-cols-2  col-gap-4">
            <div className=" ">
              <input
                className="bg-transparent w-full text-3xl text-gray-700 mr-3 py-1 leading-tight focus:outline-none  border-b-4 border-black "
                type="text"
                placeholder="ACTION"
                name="action"
                value={recipe.steps[currentStep].action || ''}
                onChange={handleChange}
              ></input>
              <ErrorField name="action" errors={errors} />
            </div>
            <div className="grid grid-cols-3 col-gap-1 content-end">
              <div className="">
                <div>
                  <input
                    className="bg-fixed bg-transparent w-full text-xl text-gray-700 mr-3 py-1 leading-tight focus:outline-none border-b-2 border-black"
                    type="text"
                    placeholder="Temp"
                    name="tempLevel"
                    value={recipe.steps[currentStep].tempLevel || ''}
                    onChange={handleChange}
                  ></input>
                </div>
                <ErrorField name="tempLevel" errors={errors} />
              </div>
              <div className="">
                <input
                  className="bg-transparent w-full text-xl text-gray-700 mr-3 py-1 leading-tight focus:outline-none border-b-2 border-black"
                  type="text"
                  placeholder="Time"
                  name="time"
                  value={recipe.steps[currentStep].time || ''}
                  onChange={handleChange}
                ></input>
                <ErrorField name="time" errors={errors} />
              </div>
              <div className="">
                <input
                  className="bg-transparent w-full text-xl text-gray-700 mr-3 py-1 leading-tight focus:outline-none border-b-2 border-black"
                  type="text"
                  placeholder="Tool"
                  name="location"
                  value={recipe.steps[currentStep].location}
                  onChange={handleChange}
                ></input>
                <ErrorField name="location" errors={errors} />
              </div>
            </div>
          </div>

          {recipe.steps[currentStep].ingredients.map((ing) => (
            <div className=" my-4">
              <DeleteX
                className="float-right"
                onClick={() => deleteIngredient(ing.id.toString())}
              />
              <div className="grid grid-cols-2 col-gap-4">
                <div className="self-end ">
                  <input
                    className="bg-transparent w-full text-3xl text-gray-700 mr-3 py-1 leading-tight focus:outline-none  border-b-4 border-black "
                    type="text"
                    placeholder="INGREDIENT"
                    id={ing.id + '-name'}
                    name="name"
                    onChange={handleChange}
                    value={ing.name || ''}
                  ></input>
                  <ErrorField name={ing.id + '-name'} errors={errors} />
                </div>
                <div className="grid grid-cols-2 col-gap-1 content-end">
                  <div className="">
                    <input
                      className="bg-transparent w-full text-xl text-gray-700 mr-3 py-1 leading-tight focus:outline-none  border-b-2 border-black"
                      type="text"
                      placeholder="Quantity"
                      id={ing.id + '-quantity'}
                      name="quantity"
                      onChange={handleChange}
                      value={ing.quantity || ''}
                    ></input>
                    <ErrorField name={ing.id + '-quantity'} errors={errors} />
                  </div>
                  <div className="col-auto">
                    <input
                      className="bg-transparent w-full text-xl text-gray-700 mr-3 py-1 leading-tight focus:outline-none  border-b-2 border-black"
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
            </div>
          ))}
          {currentStep > 0 &&
            recipe.steps[currentStep].useResultsFromStep.map((step) => (
              <div className=" my-4">
                <DeleteX
                  className="float-right"
                  onClick={() => deleteUseResultsFromStep(step.id)}
                />
                <div className="grid grid-cols-3 col-gap-4">
                  <span className="text-2xl col-span-2">
                    Use Result From Step:
                  </span>
                  <div className="self-end ">
                    <input
                      className="bg-transparent text-center w-full text-2xl text-gray-700 mr-3 py-1 leading-tight focus:outline-none  border-b-2 border-black "
                      type="number"
                      min="1"
                      max={currentStep}
                      placeholder="Step"
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
          <button
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-4 rounded m-4 "
            onClick={createIngredient}
          >
            Add Ingredient
          </button>
          {currentStep > 0 && (
            <button
              className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-4 rounded m-4 "
              onClick={createUseResultsFromStep}
            >
              Add Result from Step
            </button>
          )}
          <div className="grid grid-cols-2 w-full  h-40 ">
            <div className=" grid items-center bg-gray-100">
              <img className="w-1/2 m-auto" src={IMAGE} />
            </div>
            <textarea
              placeholder="Custom Info"
              className="resize-none h-full w-full text-xl border border-black rounded p-1 outline-none"
            ></textarea>
          </div>
        </div>
        <div className="w-full mt-8 mb-8">
          <div className="grid col-gap-4 grid-cols-2">
            <button
              className="bg-gray-300 hover:bg-gray-400  text-xl text-gray-800 font-bold py-2 px-4 rounded"
              onClick={() => submitStep(currentStep + 1)}
            >
              Next Step
            </button>
            <button
              className="bg-gray-300 hover:bg-gray-400 text-xl text-gray-800 font-bold py-2 px-4 rounded"
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
      <div className="max-w-md mt-8 mx-auto">
        <div className="m-2 mb-8">
          <input
            className="bg-transparent w-full text-5xl text-gray-700 mr-3 py-1 leading-tight focus:outline-none  border-b-4 border-black "
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
              <div className="grid items-center bg-gray-100 m-2 rounded">
                <img className="w-1/2 m-auto" src={IMAGE} />
              </div>
            )
          })}
        </div>
        <textarea
          placeholder="Description and tags"
          className="resize-none h-full w-full text-xl border border-black rounded p-1 outline-none"
        ></textarea>
      </div>
      <button
        className="bg-gray-300 hover:bg-gray-400 text-gray-800 py-1 px-4 rounded mb-4 "
        onClick={submitRecipe}
      >
        Post Recipe
      </button>
    </React.Fragment>
  )
}

export default RecipeForm
