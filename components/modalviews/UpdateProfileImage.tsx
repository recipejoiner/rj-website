import React from 'react'
import { GraphQLError } from 'graphql'
import ReactLoading from 'react-loading'

import client from 'requests/client'
import { getToken } from 'helpers/auth'
import {
  SetProfileImageReturnType,
  SetProfileImageVarsType,
  SET_PROFILE_IMAGE,
} from 'requests/users'

import ImageFilePicker from 'helpers/ImageFilePicker'

type UpdateProfileImageProps = {
  updateProfileImageUrl: (profileImageUrl: string) => void
}

const UpdateProfileImage: React.FC<UpdateProfileImageProps> = ({
  updateProfileImageUrl,
}) => {
  const linkStyle =
    'w-full px-8 py-4 block font-semibold hover:text-gray-700 focus:text-gray-900 text-center text-sm tracking-widest border-b border-gray-300 focus:outline-none focus:shadow-outline'

  const [preview, setPreview] = React.useState<string | undefined>()

  const [imageErrs, setImageErrs] = React.useState<readonly GraphQLError[]>([])

  const onImageSelect = (file: File | undefined) => {
    if (file) {
      submitForm(file)
    } else {
      setImageErrs([new GraphQLError('Image must be selected!')])
    }
  }

  const submitForm = (selectedFile: File) => {
    const variables: SetProfileImageVarsType = {
      profileImage: selectedFile,
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
        const { data }: { data?: SetProfileImageReturnType } = res || {}
        if (res.errors) {
          setImageErrs(res.errors)
        } else if (!!data) {
          updateProfileImageUrl(data.result.user.profileImageUrl)
        } else {
          throw 'Data is missing!'
        }
      })
      .catch((err) => {
        setImageErrs(err.graphQLErrors)
        console.log('imageErrs', imageErrs)
      })
  }

  const imagePicker = new ImageFilePicker(
    onImageSelect,
    setPreview,
    setImageErrs
  )

  React.useEffect(() => {
    console.log('preview', preview)
    console.log('imagePicker', imagePicker)
  }, [preview])

  return (
    <div className="h-full w-full">
      <form className="h-full">
        <label
          className={`${linkStyle} flex flex-row items-center justify-center -mt-5 h-full border-none text-base text-blue-600 focus:text-red-700 cursor-pointer`}
        >
          {preview && imageErrs.length === 0 ? (
            <div className="w-48 h-48">
              <ReactLoading
                type="bubbles"
                height={''}
                width={''}
                className="absolute w-48 h-48 z-100 opacity-90"
              />
              <div className="absolute w-48 h-48 bg-black rounded-full opacity-25 z-90 backdrop-blur" />
              <img
                className="object-cover w-full h-48 rounded-full opacity-75 filter-grayscale"
                src={preview}
              />
            </div>
          ) : (
            <div>
              Upload Photo
              {imageErrs.map((err) => {
                return (
                  <span
                    key={err.message}
                    className="absolute block text-center text-sm text-red-600 left-0 w-full mt-2"
                  >
                    {err.message}
                  </span>
                )
              })}
            </div>
          )}

          <input
            className="hidden"
            name="files"
            type="file"
            multiple={false}
            accept="image/*"
            onChange={imagePicker.onSelectFile}
          />
        </label>
      </form>
    </div>
  )
}

export default UpdateProfileImage
