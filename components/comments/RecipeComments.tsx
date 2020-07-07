import * as React from 'react'
import Collapse from '@kunukn/react-collapse'

import UserContext from 'helpers/UserContext'
import {
  CommentNodeType,
  CommentNodeInit,
  RecipeCommentsByUsernameAndHandleVarsType,
  RECIPE_ROOT_COMMENTS_BY_USERNAME_AND_HANDLE,
} from 'requests/comments'
import InfiniteScroll, { EdgeType } from 'components/InfiniteScroll'
import Subcomments from 'components/comments/Subcomments'
import Comment from 'components/comments/Comment'
import NewCommentForm from 'components/comments/NewCommentForm'

type RecipeCommentsProps = {
  username: string
  handle: string
  className?: string
  id: string
}

const RecipeComments: React.FC<RecipeCommentsProps> = ({
  username,
  handle,
  className,
  id,
}) => {
  const [newCommentFormIsOpen, setNewCommentFormIsOpen] = React.useState(false)

  // for visually reflecting newly added comments
  const [newComments, setNewComments] = React.useState<Array<CommentNodeType>>(
    []
  )
  const addNewComment = (newComment: CommentNodeType) => {
    setNewCommentFormIsOpen(false)
    setNewComments([newComment, ...newComments])
  }

  const rootCommentVars: RecipeCommentsByUsernameAndHandleVarsType = {
    username: username,
    handle: handle,
    cursor: null,
  }
  return (
    <div id="comments">
      <button
        className="text-sm font-bold p-1 ml-3"
        onClick={() => setNewCommentFormIsOpen(!newCommentFormIsOpen)}
      >
        add comment
      </button>
      <Collapse
        isOpen={newCommentFormIsOpen}
        transition={`height 280ms cubic-bezier(.4, 0, .2, 1)`}
      >
        <NewCommentForm
          commentableType="Recipe"
          commentableId={id}
          addNewComment={addNewComment}
        />
      </Collapse>
      <ul className="bg-yellow-200">
        {newComments.map((comment) => {
          return <Comment key={comment.id} commentNode={comment} />
        })}
      </ul>
      <InfiniteScroll
        QUERY={RECIPE_ROOT_COMMENTS_BY_USERNAME_AND_HANDLE}
        hasJustConnection={false}
        nodeInit={CommentNodeInit}
        QueryVars={rootCommentVars}
      >
        {(edges: Array<EdgeType<CommentNodeType>>) => {
          return (
            <ul className={className || ''}>
              {edges.map((edge) => {
                if (edge.node.id !== '') {
                  return <Comment key={edge.cursor} commentNode={edge.node} />
                }
              })}
            </ul>
          )
        }}
      </InfiniteScroll>
    </div>
  )
}

export default RecipeComments
