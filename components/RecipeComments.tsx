import * as React from 'react'

import UserContext from 'helpers/UserContext'
import {
  CommentNodeType,
  CommentNodeInit,
  RecipeCommentsByUsernameAndHandleVarsType,
  RECIPE_ROOT_COMMENTS_BY_USERNAME_AND_HANDLE,
  SubcommentsVarsType,
  SUBCOMMENTS,
} from 'requests/comments'
import InfiniteScroll, { EdgeType } from 'components/InfiniteScroll'
import Subcomments from 'components/Subcomments'

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
                  return (
                    <li
                      key={edge.cursor}
                      className="p-2 w-full border border-gray-900"
                    >
                      <span className="font-bold">{edge.node.by.username}</span>
                      <span>
                        {new Date(edge.node.createdAt).toDateString()}
                      </span>
                      <p>{edge.node.content}</p>
                      <div className="ml-2">
                        <Subcomments parentId={edge.node.id} />
                      </div>
                    </li>
                  )
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
