import * as React from 'react'
import TextareaAutosize from 'react-textarea-autosize'

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
      <p className="text-red-700 italic text-sm p-2">{errorMessage}</p>
    </div>
  )
}

interface HiddenFormItemProps {
  value: string | number
  returnVar: string
  register: any
}

export const HiddenFormItem: React.FC<HiddenFormItemProps> = ({
  value,
  returnVar,
  register,
}) => {
  return (
    <input
      readOnly={true}
      className="hidden"
      id={returnVar}
      name={returnVar}
      type="number"
      value={value}
      ref={register}
    />
  )
}
interface NumFormItemProps {
  label: string
  returnVar: string
  placeholder: string
  register: any
}

export const NumFormItem: React.FC<NumFormItemProps> = ({
  label,
  returnVar,
  placeholder,
  register,
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
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id={returnVar}
        name={returnVar}
        type="number"
        p
        placeholder={placeholder}
        ref={register}
      />
    </div>
  )
}

interface TextAreaFormItemProps {
  label: string
  returnVar: string
  placeholder: string
  register: any
}

export const TextAreaFormItem: React.FC<TextAreaFormItemProps> = ({
  label,
  returnVar,
  placeholder,
  register,
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
        className="shadow block overflow-hidden resize-none appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id={returnVar}
        name={returnVar}
        placeholder={placeholder}
        ref={register}
        minRows={3}
      />
    </div>
  )
}

interface PasswordFormItemProps {
  label: string
  returnVar: string
  register: any
}

export const PasswordFormItem: React.FC<PasswordFormItemProps> = ({
  label,
  returnVar,
  register,
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
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        id={returnVar}
        name={returnVar}
        type="password"
        placeholder="••••••••"
        ref={register}
      />
    </div>
  )
}
