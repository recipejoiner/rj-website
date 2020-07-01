import React from 'react'
import { useForm } from 'react-hook-form'
import { GraphQLError } from 'graphql'

import {
  CommentNodeType,
  CreateCommentVarsType,
  CREATE_COMMENT,
} from 'requests/comments'
import client from 'requests/client'
import { getToken } from 'helpers/auth'
import { TextAreaFormItem } from 'components/forms/Fields'

interface NewCommentFormProps {
  commentableType: string
  commentableId: string
}

const NewCommentForm: React.FC<NewCommentFormProps> = ({
  commentableType,
  commentableId,
}) => {
  const [newCommentErrors, setNewCommentErrors] = React.useState<
    readonly GraphQLError[]
  >([])

  const { register, handleSubmit, watch, errors } = useForm<
    CreateCommentVarsType
  >()

  const onSubmit = handleSubmit(({ content }: { content: string }) => {
    const variables: CreateCommentVarsType = {
      commentableId: commentableId,
      commentableType: commentableType,
      content: content,
    }
    client
      .mutate({
        mutation: CREATE_COMMENT,
        variables: variables,
        context: {
          // example of setting the headers with context per operation
          headers: {
            authorization: `Bearer ${getToken()}`,
          },
        },
      })
      .then((res) => {
        const { data }: { data?: CommentNodeType } = res || {}
        if (res.errors) {
          setNewCommentErrors(res.errors)
        } else if (!!data) {
          console.log('new comment data', data)
          // todo: render the new comment somehow
        } else {
          throw 'Data is missing!'
        }
      })
      .catch((err) => {
        setNewCommentErrors(err.graphQLErrors)
        console.log(setNewCommentErrors)
      })
  })

  return (
    <form onSubmit={onSubmit} className="max-w-lg mx-2">
      <TextAreaFormItem
        returnVar="content"
        additionalFieldStyleClasses="text-sm mb-0 mt-1"
        customDivStyleClasses="mb-0"
        uid={`comment-form-${commentableType}${commentableId}`}
        placeholder="This is the greatest thing ever!"
        register={register({
          required: "You can't submit an empty comment!",
        })}
        errorMessage={errors.content && errors.content.message}
      />
      <button className="btn text-sm mb-2 bg-gray-200" type="submit">
        Add Comment
      </button>
    </form>
  )
}

export default NewCommentForm
