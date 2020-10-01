import * as React from 'react'
import Link from 'next/link'
import Skeleton from 'react-loading-skeleton'
import { CollectionsShortNodeType } from 'requests/collections'

interface ShortCollectionProps {
  node: CollectionsShortNodeType
}
const ShortCollection: React.FC<ShortCollectionProps> = ({ node }) => {
  const { by, title, handle, description } = node || {}

  return (
    <div className="p-2 border-gray-400 border">
      <Link
        href="/[username]/collections/[collectionhandle]"
        as={`/${by.username}/collections/${handle}`}
      >
        <a>
          <div className="text-3xl">{title || Skeleton}</div>
          <div>by {by.username || Skeleton}</div>
        </a>
      </Link>
    </div>
  )
}

export default ShortCollection
