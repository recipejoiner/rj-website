import React from 'react'
import { useForm } from 'react-hook-form'

import client, { gqlError } from 'requests/client'
import { getToken } from 'helpers/auth'
import {
  SetProfileImageReturnType,
  SetProfileImageVarsType,
  SET_PROFILE_IMAGE,
} from 'requests/users'

type UpdateProfileImageProps = {}

const UpdateProfileImage: React.FC<UpdateProfileImageProps> = ({}) => {
  const linkStyle =
    'w-full px-8 py-4 block font-semibold hover:text-gray-700 text-center text-sm tracking-widest border-b border-gray-300'

  const [imageErrs, setImageErrs] = React.useState<Array<gqlError>>([])

  const { register, handleSubmit, watch, errors } = useForm<
    SetProfileImageVarsType
  >()

  const onSubmit = handleSubmit((variables: SetProfileImageVarsType) => {
    const token = process.env.NEXT_PUBLIC_RJ_API_TOKEN || ''
    client
      .mutate({
        mutation: SET_PROFILE_IMAGE,
        variables: variables,
        context: {
          // example of setting the headers with context per operation
          headers: {
            authorization: `Bearer ${getToken()}`,
          },
        },
      })
      .then((res) => {
        const { data }: { data?: SetProfileImageReturnType } = res || {}
        if (!!data) {
          console.log('data:', data)
        } else {
          throw 'Data is missing!'
        }
      })
      .catch((err) => {
        setImageErrs(err.graphQLErrors)
        console.log(imageErrs)
      })
  })

  return <React.Fragment></React.Fragment>
}

export default UpdateProfileImage
