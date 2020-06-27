import React from 'react'
import Moment from 'moment'

import { CommentNodeType } from 'requests/comments'
import Subcomments from 'components/comments/Subcomments'

interface CommentProps {
  commentNode: CommentNodeType
}
const Comment: React.FC<CommentProps> = ({ commentNode }) => {
  return (
    <li className="p-2 w-full border border-gray-900">
      <span className="font-bold">{commentNode.by.username}</span>
      <span>{Moment(commentNode.createdAt).fromNow()}</span>
      <p>{commentNode.content}</p>
      <div className="ml-2">
        <Subcomments parentId={commentNode.id} />
      </div>
    </li>
  )
}

export default Comment
