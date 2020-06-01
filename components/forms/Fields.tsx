import * as React from 'react'
import TextareaAutosize from 'react-textarea-autosize'
import { Controller, EventFunction } from 'react-hook-form'

interface TextFormItemProps {
  label: string
  returnVar: string
  placeholder: string
  register: any
  errorMessage?: any
}

export const TextFormItem: React.FC<TextFormItemProps> = ({
  label,
  returnVar,
  placeholder,
  register,
  errorMessage,
}) => {
  return (
    <div className="mb-4">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor={returnVar}
      >
        {label}
      </label>
      <input
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
          !!errorMessage ? 'border-red-700' : ''
        }`}
        id={returnVar}
        name={returnVar}
        type="text"
        placeholder={placeholder}
        ref={register}
      />
      <p
        className={`${
          errorMessage != undefined ? 'block ' : 'hidden '
        }text-red-700 italic text-sm px-2 pt-2`}
      >
        {errorMessage}
      </p>
    </div>
  )
}

interface HiddenFormItemProps {
  value: string | number
  returnVar: string
  control: any
  type: string
  handleChange: EventFunction
}

export const HiddenFormItem: React.FC<HiddenFormItemProps> = ({
  value,
  returnVar,
  control,
  type,
  handleChange,
}) => {
  return (
    <Controller
      as={<input />}
      readOnly={true}
      className="hidden"
      id={returnVar}
      name={returnVar}
      type={type}
      onChange={handleChange}
      defaultValue={value}
      value={value}
      control={control}
    />
  )
}

interface NumFormItemProps {
  label: string
  returnVar: string
  placeholder: string
  rules: any
  errorMessage?: any
  control: any
  defaultValue?: number
}

export const NumFormItem: React.FC<NumFormItemProps> = ({
  label,
  returnVar,
  placeholder,
  rules,
  errorMessage,
  control,
  defaultValue = 0,
}) => {
  return (
    <div className="mb-4">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor={returnVar}
      >
        {label}
      </label>
      <Controller
        as={<input />}
        className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
          !!errorMessage ? 'border-red-700' : ''
        }`}
        id={returnVar}
        name={returnVar}
        type="number"
        placeholder={placeholder}
        rules={rules}
        control={control}
        onChange={([e]) => {
          if (e.target.value == '') {
            return 0
          } else {
            return parseFloat(e.target.value)
          }
        }}
        defaultValue={defaultValue}
      />
      <p
        className={`${
          errorMessage != undefined ? 'block ' : 'hidden '
        }text-red-700 italic text-sm px-2 pt-2`}
      >
        {errorMessage}
      </p>
    </div>
  )
}

interface TextAreaFormItemProps {
  label: string
  returnVar: string
  placeholder: string
  register: any
  errorMessage?: any
}

export const TextAreaFormItem: React.FC<TextAreaFormItemProps> = ({
  label,
  returnVar,
  placeholder,
  register,
  errorMessage,
}) => {
  return (
    <div className="mb-4">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor={returnVar}
      >
        {label}
      </label>
      <TextareaAutosize
        className={`resize-none shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
          !!errorMessage ? 'border-red-700' : ''
        }`}
        id={returnVar}
        name={returnVar}
        placeholder={placeholder}
        ref={register}
        minRows={3}
      />
      <p
        className={`${
          errorMessage != undefined ? 'block ' : 'hidden '
        }text-red-700 italic text-sm px-2`}
      >
        {errorMessage}
      </p>
    </div>
  )
}

interface PasswordFormItemProps {
  label: string
  returnVar: string
  register: any
  errorMessage?: any
}

export const PasswordFormItem: React.FC<PasswordFormItemProps> = ({
  label,
  returnVar,
  register,
  errorMessage,
}) => {
  const [type, setType] = React.useState('password')
  const toggleType = () => {
    type === 'password' ? setType('text') : setType('password')
  }
  return (
    <div className="mb-4">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor={returnVar}
      >
        {label}
      </label>
      <div className="flex flex-row">
        <input
          className={`shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${
            !!errorMessage ? 'border-red-700' : ''
          }`}
          id={returnVar}
          name={returnVar}
          type={type}
          placeholder="••••••••"
          ref={register}
        ></input>
        <button className="-ml-12" onClick={toggleType}>
          <svg
            className="h-10 p-3 text-gray-900 hover:text-gray-700 fill-current"
            viewBox="0 0 189 111"
            version="1.1"
          >
            <g id="UI-Icons" transform="translate(-477.000000, -288.000000)">
              <path
                d="M571.598128,329.406588 C590.772257,329.406588 606.31596,344.950291 606.31596,364.12442 C606.31596,383.298549 590.772257,398.842251 571.598128,398.842251 C552.423999,398.842251 536.880297,383.298549 536.880297,364.12442 C536.880297,344.950291 552.423999,329.406588 571.598128,329.406588 Z M571.5,288 C617.366063,288 655.808161,319.785774 666,362.531352 L629.659731,362.531352 C621.86716,336.514818 600.800532,317.940148 571.5,317.940148 C542.199468,317.940148 521.13284,336.514818 513.340269,362.531352 L477,362.531352 C487.191839,319.785774 525.633937,288 571.5,288 Z"
                id="toggle-pass-visibility"
              ></path>
            </g>
          </svg>
        </button>
      </div>
      <p
        className={`${
          errorMessage != undefined ? 'block ' : 'hidden '
        }text-red-700 italic text-sm px-2`}
      >
        {errorMessage}
      </p>
    </div>
  )
}
