import React from 'react'
import Moment from 'moment'
import Collapse from '@kunukn/react-collapse'

import { CommentNodeType } from 'requests/comments'
import Subcomments from 'components/comments/Subcomments'
import NewCommentForm from 'components/comments/NewCommentForm'
import { getToken } from 'helpers/auth'

interface CommentProps {
  commentNode: CommentNodeType
  isNewComment?: boolean
}
const Comment: React.FC<CommentProps> = ({ commentNode, isNewComment }) => {
  const [commentIsOpen, setCommentIsOpen] = React.useState(true)
  const [newCommentFormIsOpen, setNewCommentFormIsOpen] = React.useState(false)

  // for visually reflecting newly added comments
  const [newComments, setNewComments] = React.useState<Array<CommentNodeType>>(
    []
  )
  const addNewComment = (newComment: CommentNodeType) => {
    setNewCommentFormIsOpen(false)
    setNewComments([newComment, ...newComments])
  }

  return (
    <li
      className={`w-full border-l ${
        commentNode.depth == 0 ? 'pb-3 border-b' : ''
      }`}
    >
      <button
        className="p-1 pl-3 text-sm w-full h-full flex items-start"
        onClick={() => {
          setCommentIsOpen(!commentIsOpen)
        }}
      >
        <span className="font-bold text-left">{commentNode.by.username}</span>
        <span className="text-gray-600">
          {' '}
          • {Moment(commentNode.createdAt).fromNow()}
        </span>
      </button>
      <Collapse
        isOpen={commentIsOpen}
        transition={`height 280ms cubic-bezier(.4, 0, .2, 1)`}
      >
        <p className="text-sm pl-3">{commentNode.content}</p>
        <div className="text-xs p-1 ml-3">
          <button
            onClick={() => setNewCommentFormIsOpen(!newCommentFormIsOpen)}
          >
            reply
          </button>
        </div>
        <Collapse
          isOpen={newCommentFormIsOpen}
          transition={`height 280ms cubic-bezier(.4, 0, .2, 1)`}
        >
          <NewCommentForm
            commentableType="Comment"
            commentableId={commentNode.id}
            addNewComment={addNewComment}
          />
        </Collapse>
        <div className="ml-1 pl-3">
          <ul className="bg-yellow-200">
            {newComments.map((comment) => {
              return <Comment key={comment.id} commentNode={comment} />
            })}
          </ul>
          {!isNewComment && commentNode.id !== '' ? (
            <Subcomments parentId={commentNode.id} />
          ) : null}
        </div>
      </Collapse>
    </li>
  )
}

export default Comment