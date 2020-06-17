import * as React from 'react'
import { useForm, Controller } from 'react-hook-form'
import Select from 'react-select'

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

const DEFAULTVALUES = {
  ingredient: '',
  action: '',
  quantity: 0,
  unit: '',
  tempNum: 0,
  tempLevel: '',
  time: 0,
  location: '',
  customInfo: '',
  media: '',
}
interface RecipeFormProps {
  //register: any
  //onSubmit: any
  watch: any
  // errors: any
  control: any
  formTitle: string
  submitBtnTxt?: string
  allStepsInit?: Array<any>
  stepInit: number
  reviewModeInit: boolean
}

interface step {
  [ingredient: string]: string | number
  action: string
  quantity: number
  unit: string
  tempNum: number
  tempLevel: string
  time: number
  location: string
  customInfo: string
  media: string
}

const RecipeForm: React.FC<RecipeFormProps> = ({
  allStepsInit = [
    {
      ingredient: '',
      action: '',
      quantity: 0,
      unit: '',
      tempNum: 0,
      tempLevel: '',
      time: 0,
      location: '',
      customInfo: '',
      media: '',
    },
  ],
  stepInit = 0,
  reviewModeInit = false,
}) => {
  const [newRecipeErrs, setNewRecipeErrs] = React.useState<
    readonly GraphQLError[]
  >([])

  const {
    register,
    handleSubmit,
    errors,
    setError,
    reset,
    control,
    setValue,
  } = useForm({
    defaultValues: { ...DEFAULTVALUES },
  })
  const [allSteps, setAllSteps] = React.useState<Array<step>>(allStepsInit)
  const [stepNum, setStepNum] = React.useState(stepInit)
  const [reviewMode, setReviewMode] = React.useState(reviewModeInit)

  const onSubmit = (data: any) => {
    console.log('data', data)
    setStepNum(stepNum + 1)
    reset({ ...DEFAULTVALUES })
  }
  const addStep = () => {
    let newStep: step = { ...DEFAULTVALUES }
    setAllSteps((allSteps) => [...allSteps, newStep])
  }

  //handles single and multi select changes
  const handleSelectChange = (data: { key: string; value: string }) => {
    let updateSteps = [...allSteps]
    updateSteps[stepNum][data.key] = data.value
    setAllSteps(updateSteps)
  }

  const handleInputChange = (data: { target: { name: any; value: any } }) => {
    const { name, value }: { name: string; value: string } = data.target
    let updateSteps = [...allSteps]
    updateSteps[stepNum][name] = value
    setAllSteps(updateSteps)
  }

  const changeStep = (data: any) => {
    setStepNum(data[0].value)
    console.log(stepNum)
    console.log(allSteps[stepNum])
  }
  React.useEffect(() => {
    console.log('errors', errors)
  })
  //create new step when current step does not yet exist
  !allSteps[stepNum] ? addStep() : ''

  // React.useEffect(() => console.log(errors))

  let STEPNUMS = allSteps.map((e) => {
    console.log(stepNum)
    return { value: allSteps.indexOf(e), label: allSteps.indexOf(e) + 1 }
  })
  return !reviewMode ? (
    <React.Fragment>
      <form
        className="container grid gap-4 w-6/12 m-auto bg-gray-100 p-8"
        onSubmit={handleSubmit(onSubmit)}
      >
        <Controller
          as={Select}
          name="action"
          control={control}
          defaultValue=""
          rules={{ required: false }}
          multi
          options={ACTION}
          onChange={([selected]) => {
            handleSelectChange({ key: 'action', value: selected.value })
            return { value: selected }
          }}
          className=""
        />
        <div className="grid grid-rows-2 grid-cols-2 gap-4">
          <div className="row-span-2 h-2">
            <span className="text-xl">Ingredient</span>
            <Controller
              as={Select}
              name="ingredient"
              control={control}
              rules={{ required: true }}
              options={INGREDIENTS}
              onChange={([selected]) => {
                handleSelectChange({ key: 'ingredient', value: selected.value })
                return { value: selected }
              }}
            />
            {errors.ingredient && 'Your input is required'}
          </div>
          <div className="">
            <span className="text-xl">Quantity</span>
            <input
              type="number"
              placeholder="quantity"
              name="quantity"
              ref={register({ required: true, min: 1 })}
              onChange={handleInputChange}
              className="pd-4 w-full bg-white"
            />
            {errors.quantity && 'Your input is required'}
          </div>
          <div className="">
            <span className="text-xl">Unit</span>
            <Controller
              as={Select}
              name="unit"
              control={control}
              defaultValue=""
              rules={{ required: false }}
              options={UNIT}
              onChange={([selected]) => {
                handleSelectChange({ key: 'unit', value: selected.value })
                return { value: selected }
              }}
              className=""
            />
          </div>
        </div>
        <div className="grid grid-rows-1 grid-cols-3 gap-4">
          {/* <input
            type="number"
            placeholder="temperature number"
            name="tempNum"
            ref={register({ max: 500 })}
            onChange={handleInputChange}
          /> */}
          <Controller
            as={Select}
            name="tempLevel"
            control={control}
            defaultValue=""
            rules={{ required: false }}
            options={TEMPLEVEL}
            onChange={([selected]) => {
              handleSelectChange({ key: 'tempLevel', value: selected.value })
              return { value: selected }
            }}
            className=""
          />
          <input
            type="number"
            placeholder="total time"
            name="time"
            ref={register({ max: 500 })}
            onChange={handleInputChange}
          />
          <Controller
            as={Select}
            name="location"
            control={control}
            defaultValue={allSteps[stepNum]?.location || ''}
            rules={{ required: false }}
            options={LOCATION}
            onChange={([selected]) => {
              handleSelectChange({ key: 'location', value: selected.value })
              return { value: selected }
            }}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <textarea
            name="customInfo"
            ref={register({ maxLength: 300 })}
            onChange={handleInputChange}
            className="h-100 resize-none border-none"
          />
          <div className="h-100 bg-orange-200">IMAGE UPLOAD</div>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <select
            value={stepNum}
            onChange={(e) => setStepNum(Number(e.currentTarget.value))}
          >
            {STEPNUMS.map(({ label, value }) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
          <input type="submit" value="Next Step" />
          <input
            onSubmit={() => setReviewMode(true)}
            type="submit"
            value="Finish Recipe"
          />
        </div>
      </form>
    </React.Fragment>
  ) : (
    //review mode
    <React.Fragment></React.Fragment>
  )
}

export default RecipeForm

/*

if building
  if step number does not exist
    create new step
  set step action
  set step ingredients
  set step quantity
  set step unit
  set step temp
  set step time
  set step location
  set step custom info
  set step media
  if next step
    repeat
  else if finish
    go to reviewing
  else if select different number
    go to step number 
else if reviewing


<div className="w-screen bg-gray-100 min-h-screen -mt-14 md:-mt-16">
        <h1 className="header-text text-center pt-20 md:pt-26">{formTitle}</h1>
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
                      type="text"
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
                                    min="0"
                                    step="0.01"
                                    pattern="[0-9.]*"
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
                {submitBtnTxt}
              </button>
            </div>
          </form>
          <p className="text-center text-gray-500 text-xs pb-3">
            &copy;2020 RecipeJoiner. All rights reserved.
          </p>
        </div>
      </div>
    </React.Fragment>

*/
