import React from 'react'
import { useForm } from 'react-hook-form'

import client, { gqlError } from 'requests/client'
import { getToken } from 'helpers/auth'
import {
  SetProfileImageReturnType,
  SetProfileImageVarsType,
  SET_PROFILE_IMAGE,
} from 'requests/users'

type UpdateProfileImageProps = {
  updateProfileImageUrl: (profileImageUrl: string) => void
}

const UpdateProfileImage: React.FC<UpdateProfileImageProps> = ({
  updateProfileImageUrl,
}) => {
  const linkStyle =
    'w-full px-8 py-4 block font-semibold hover:text-gray-700 focus:text-gray-900 text-center text-sm tracking-widest border-b border-gray-300 focus:outline-none focus:shadow-outline'

  const [imageErrs, setImageErrs] = React.useState<Array<gqlError>>([])

  const { register, handleSubmit, watch, errors } = useForm<{
    files: FileList
  }>()

  console.log('watch', watch('profileImage'))

  const onSubmit = handleSubmit(({ files }) => {
    console.log('files', files)
    const variables: SetProfileImageVarsType = {
      profileImage: files[0],
    }
    client
      .mutate({
        mutation: SET_PROFILE_IMAGE,
        variables: variables,
        context: {
          headers: {
            authorization: `Bearer ${getToken()}`,
          },
        },
      })
      .then((res) => {
        console.log('res', res)
        const { data }: { data?: SetProfileImageReturnType } = res || {}
        if (!!data) {
          updateProfileImageUrl(data.result.user.profileImageUrl)
        } else {
          throw 'Data is missing!'
        }
      })
      .catch((err) => {
        setImageErrs(err.graphQLErrors)
        console.log('imageErrs', imageErrs)
      })
  })

  return (
    <React.Fragment>
      <form onSubmit={onSubmit}>
        <label
          className={`${linkStyle} text-blue-600 focus:text-red-700 cursor-pointer`}
        >
          Upload Photo
          <input
            className="hidden"
            name="files"
            type="file"
            multiple={false}
            accept="image/*"
            onChange={onSubmit}
            ref={register}
          />
        </label>
      </form>
    </React.Fragment>
  )
}

export default UpdateProfileImage
