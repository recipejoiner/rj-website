import React from 'react'
import { useForm } from 'react-hook-form'
import { GraphQLError } from 'graphql'
import ReactLoading from 'react-loading'

import client from 'requests/client'
import { getToken } from 'helpers/auth'
import {
  SetProfileImageReturnType,
  SetProfileImageVarsType,
  SET_PROFILE_IMAGE,
} from 'requests/users'
import Skeleton from 'react-loading-skeleton'

type UpdateProfileImageProps = {
  updateProfileImageUrl: (profileImageUrl: string) => void
}

const UpdateProfileImage: React.FC<UpdateProfileImageProps> = ({
  updateProfileImageUrl,
}) => {
  const linkStyle =
    'w-full px-8 py-4 block font-semibold hover:text-gray-700 focus:text-gray-900 text-center text-sm tracking-widest border-b border-gray-300 focus:outline-none focus:shadow-outline'

  const [selectedFile, setSelectedFile] = React.useState<File | undefined>()
  const [preview, setPreview] = React.useState<string | undefined>()

  // create a preview as a side effect, whenever selected file is changed
  React.useEffect(() => {
    if (!selectedFile) {
      setPreview(undefined)
      return
    }

    const objectUrl = URL.createObjectURL(selectedFile)
    setPreview(objectUrl)

    // Free memory when ever this component is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }, [selectedFile])

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) {
      setSelectedFile(undefined)
      return
    }

    // Use first image
    setSelectedFile(e.target.files[0])
  }

  const [imageErrs, setImageErrs] = React.useState<readonly GraphQLError[]>([])

  const { register, handleSubmit, watch, errors } = useForm<{
    files: FileList
  }>()

  const onSubmit = handleSubmit(({ files }) => {
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
  })

  return (
    <div className="h-full w-full">
      <form className="h-full" onSubmit={onSubmit}>
        <label
          className={`${linkStyle} flex flex-row items-center justify-center -mt-5 h-full border-none text-base text-blue-600 focus:text-red-700 cursor-pointer`}
        >
          {selectedFile ? (
            <div className="w-20 h-20">
              <ReactLoading
                type="spokes"
                height={''}
                width={''}
                className="absolute h-16 w-16 m-2 z-100 opacity-90"
              />
              <div className="absolute h-20 w-20 bg-black rounded-full opacity-50 z-90" />
              <img
                className="object-cover w-full h-20 rounded-full opacity-75"
                src={preview}
              />
            </div>
          ) : (
            'Upload Photo'
          )}
          <input
            className="hidden"
            name="files"
            type="file"
            multiple={false}
            accept="image/*"
            onChange={onSelectFile}
            ref={register}
          />
        </label>
      </form>
    </div>
  )
}

export default UpdateProfileImage
