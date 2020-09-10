import React from 'react'
import Moment from 'moment'
import Collapse from '@kunukn/react-collapse'

import { CommentNodeType } from 'requests/comments'
import Subcomments from 'components/comments/Subcomments'
import NewCommentForm from 'components/comments/NewCommentForm'

import { setCommentLikeHandler } from 'helpers/user-interactions'
import UserContext from 'helpers/UserContext'
import ScreenContext from 'helpers/ScreenContext'

interface CommentProps {
  commentNode: CommentNodeType
  isNewComment?: boolean
}
const Comment: React.FC<CommentProps> = ({ commentNode, isNewComment }) => {
  const {
    id,
    depth,
    myReaction,
    childCount,
    createdAt,
    by,
    content,
  } = commentNode

  const { currentUserInfo } = React.useContext(UserContext)
  const { modalOpen, setModalState } = React.useContext(ScreenContext)

  const [commentReaction, setCommentReaction] = React.useState(myReaction)

  const LIKE_BW = require('images/icons/fire_bw.svg')
  const LIKE_COLOR = require('images/icons/fire_color.svg')
  const REPLY = require('images/icons/reply.svg')

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
    <li className={`w-full border-l ${depth == 0 ? 'pb-3 border-b' : ''}`}>
      <button
        className="p-1 pl-3 text-sm w-full h-full flex items-start"
        onClick={() => {
          setCommentIsOpen(!commentIsOpen)
        }}
      >
        <span className="font-bold text-left">{by.username}</span>
        <span className="text-gray-600"> • {Moment(createdAt).fromNow()}</span>
      </button>
      <Collapse
        isOpen={commentIsOpen}
        transition={`height 280ms cubic-bezier(.4, 0, .2, 1)`}
      >
        <p className="text-sm pl-3">{content}</p>
        <div className="text-xs p-1 ml-3 flex flex-row ">
          <button
            className="flex flex-row mr-2 h-full outline-none "
            onClick={() =>
              setCommentLikeHandler(
                currentUserInfo,
                id,
                commentReaction,
                setCommentReaction
              )
            }
          >
            <img
              className="h-5 w-5"
              src={commentReaction === 1 ? LIKE_COLOR : LIKE_BW}
            />
            <span className="ml-1 self-center">like</span>
          </button>
          <button
            className="flex flex-row ml-2 outline-none"
            onClick={() => setNewCommentFormIsOpen(!newCommentFormIsOpen)}
          >
            <img src={REPLY} className="h-5 w-5" />
            <span className="ml-1 self-center">reply</span>
          </button>
        </div>
        <Collapse
          isOpen={newCommentFormIsOpen}
          transition={`height 280ms cubic-bezier(.4, 0, .2, 1)`}
        >
          <NewCommentForm
            commentableType="Comment"
            commentableId={id}
            addNewComment={addNewComment}
          />
        </Collapse>
        <div className="ml-1 pl-3">
          <ul className="bg-yellow-200">
            {newComments.map((comment) => {
              return <Comment key={comment.id} commentNode={comment} />
            })}
          </ul>
          {!isNewComment && id !== '' ? <Subcomments parentId={id} /> : null}
        </div>
      </Collapse>
    </li>
  )
}

export default Comment
