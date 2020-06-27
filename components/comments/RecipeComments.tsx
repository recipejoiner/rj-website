import * as React from 'react'

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

type RecipeCommentsProps = {
  username: string
  handle: string
}

const RecipeComments: React.FC<RecipeCommentsProps> = ({
  username,
  handle,
}) => {
  const rootCommentVars: RecipeCommentsByUsernameAndHandleVarsType = {
    username: username,
    handle: handle,
    cursor: null,
  }
  return (
    <div id="comments">
      <InfiniteScroll
        QUERY={RECIPE_ROOT_COMMENTS_BY_USERNAME_AND_HANDLE}
        hasJustConnection={false}
        nodeInit={CommentNodeInit}
        QueryVars={rootCommentVars}
      >
        {(edges: Array<EdgeType<CommentNodeType>>) => {
          return (
            <ul>
              {edges.map((edge) => {
                if (edge.node.id !== 0) {
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
