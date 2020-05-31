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
}

export const NumFormItem: React.FC<NumFormItemProps> = ({
  label,
  returnVar,
  placeholder,
  rules,
  errorMessage,
  control,
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
        defaultValue={0}
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
        type="password"
        placeholder="••••••••"
        ref={register}
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
