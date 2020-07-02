import * as React from 'react'

import UserContext from 'helpers/UserContext'
import {
  CommentNodeType,
  CommentNodeInit,
  SubcommentsVarsType,
  SUBCOMMENTS,
} from 'requests/comments'
import InfiniteScroll, { EdgeType } from 'components/InfiniteScroll'
import Comment from 'components/comments/Comment'

type SubcommentsProps = {
  parentId: string
}

const Subcomments: React.FC<SubcommentsProps> = ({ parentId }) => {
  const rootCommentVars: SubcommentsVarsType = {
    parentId: parentId,
    cursor: null,
  }
  return (
    <InfiniteScroll
      QUERY={SUBCOMMENTS}
      hasJustConnection={true}
      nodeInit={CommentNodeInit}
      QueryVars={rootCommentVars}
    >
      {(edges: Array<EdgeType<CommentNodeType>>) => {
        if (edges.length > 0) {
          return (
            <ul>
              {edges.map((edge) => {
                if (edge.node.id !== '') {
                  return <Comment key={edge.cursor} commentNode={edge.node} />
                }
              })}
            </ul>
          )
        }
      }}
    </InfiniteScroll>
  )
}

export default Subcomments
