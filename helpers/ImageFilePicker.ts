import React from 'react'
import { GraphQLError } from 'graphql'

import { ensureVarIsSet } from 'helpers/methods'

class ImageFilePicker {
  setSelectedFile: (file: File | undefined) => void
  setPreview: (preview: string | undefined) => void
  setImageErrs: (errors: readonly GraphQLError[]) => void
  onImageSelect: () => void

  constructor(
    setSelectedFile: (file: File | undefined) => void,
    setPreview: (preview: string | undefined) => void,
    setImageErrs: (errors: readonly GraphQLError[]) => void,
    onImageSelect: () => void
  ) {
    this.setSelectedFile = setSelectedFile
    this.setPreview = setPreview
    this.setImageErrs = setImageErrs
    this.onImageSelect = onImageSelect
  }

  onSelectFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // debugger
    if (!e.target.files || e.target.files.length === 0) {
      this.setSelectedFile(undefined)
      this.setPreview(undefined)
      return
    }

    const selectedFile = e.target.files[0]

    this.setSelectedFile(selectedFile)

    const filesize = selectedFile.size / 1024 / 1024 //megabytes

    const objectUrl = URL.createObjectURL(selectedFile)

    if (filesize <= 5) {
      this.setImageErrs([])
      this.setPreview(objectUrl)
      this.onImageSelect()
    } else {
      this.setImageErrs([new GraphQLError("Image can't be larger than 5mb!")])
    }

    // Free memory whenever this is unmounted
    return () => URL.revokeObjectURL(objectUrl)
  }
}

export default ImageFilePicker
