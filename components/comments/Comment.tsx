import React from 'react'
import Moment from 'moment'
import Collapse from '@kunukn/react-collapse'

import { CommentNodeType } from 'requests/comments'
import Subcomments from 'components/comments/Subcomments'

interface CommentProps {
  commentNode: CommentNodeType
}
const Comment: React.FC<CommentProps> = ({ commentNode }) => {
  const [isOpen, setIsOpen] = React.useState(true)
  return (
    <li
      className={`p-1 pl-3 w-full border-l ${
        commentNode.depth == 0 ? 'pb-3 border-b' : ''
      }`}
    >
      <button
        className="text-sm"
        onClick={() => {
          setIsOpen(!isOpen)
        }}
      >
        <span className="font-bold">{commentNode.by.username}</span>
        <span className="text-gray-600">
          {' '}
          • {Moment(commentNode.createdAt).fromNow()}
        </span>
      </button>
      <Collapse
        isOpen={isOpen}
        transition={`height 280ms cubic-bezier(.4, 0, .2, 1)`}
      >
        <p className="text-sm">{commentNode.content}</p>
        <div className="ml-1">
          <Subcomments parentId={commentNode.id} />
        </div>
      </Collapse>
    </li>
  )
}

export default Comment
