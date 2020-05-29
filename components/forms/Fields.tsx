import * as React from 'react'

interface TextFormItemProps {
  label: string
  returnVar: string
  placeholder: string
  register: any
}

export const TextFormItem: React.FC<TextFormItemProps> = ({
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
        type="text"
        placeholder={placeholder}
        ref={register}
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
