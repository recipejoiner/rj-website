import * as React from 'react'
import Link from 'next/link'
import Skeleton from 'react-loading-skeleton'
import {
  CollectionsShortNodeType,
  OWNED_COLLECTIONS,
  collectionsNodeInit,
  USER_COLLECTIONS_BY_USERNAME,
} from 'requests/collections'
import InfiniteScroll, { EdgeType } from './InfiniteScroll'
import ShortCollection from './ShortCollection'
import { cursorTo } from 'readline'

interface CollectionsProps {
  username: string
}
const Collections: React.FC<CollectionsProps> = ({ username }) => {
  return (
    <div>
      <InfiniteScroll
        QUERY={USER_COLLECTIONS_BY_USERNAME}
        hasJustConnection={false}
        nodeInit={collectionsNodeInit}
        QueryVars={{ cursor: null, username: username }}
      >
        {(edges: Array<EdgeType<CollectionsShortNodeType>>) => (
          <ul>
            {edges.map((edge) => {
              return <ShortCollection node={edge.node} key={edge.cursor} />
            })}
          </ul>
        )}
      </InfiniteScroll>
    </div>
  )
}

export default Collections
