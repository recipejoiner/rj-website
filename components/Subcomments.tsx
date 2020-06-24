import * as React from 'react'

import UserContext from 'helpers/UserContext'
import {
  CommentNodeType,
  CommentNodeInit,
  SubcommentsVarsType,
  SUBCOMMENTS,
} from 'requests/comments'
import InfiniteScroll, { EdgeType } from 'components/InfiniteScroll'

type SubcommentsProps = {
  parentId: number
}

const Subcomments: React.FC<SubcommentsProps> = ({ parentId }) => {
  const rootCommentVars: SubcommentsVarsType = {
    parentId: parentId,
    cursor: null,
  }
  return (
    <div id="comments">
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
                  if (edge.node.id !== 0) {
                    return (
                      <li
                        key={edge.cursor}
                        className="p-2 w-full border border-gray-900"
                      >
                        <span className="text-bold">
                          {edge.node.by.username}
                        </span>
                        <p>{edge.node.content}</p>
                        <div className="ml-2">
                          {console.log('get subcomments of id', edge.node.id)}
                          <Subcomments parentId={edge.node.id} />
                        </div>
                      </li>
                    )
                  }
                })}
              </ul>
            )
          }
        }}
      </InfiniteScroll>
    </div>
  )
}

export default Subcomments
