import React, { useEffect } from 'react'
import Link from 'next/link'
import Skeleton from 'react-loading-skeleton'

import {
  FollowRelListNodeType,
  followConnectionNodeInit,
  FollowRelListByUsernameVars,
  FOLLOWING_BY_USERNAME,
  FOLLOWERS_BY_USERNAME,
} from 'requests/users'
import InfiniteScroll, { EdgeType } from 'components/InfiniteScroll'
import FollowChangeBtn from 'components/FollowChangeBtn'
import {
  OWNED_COLLECTIONS,
  collectionsNodeInit,
  CollectionVarsType,
  MyCollectionsVarsType,
  CollectionsShortNodeType,
  CollectionsNodeType,
} from 'requests/collections'
import { CommentNodeInit } from 'requests/comments'
import { addToCollection } from 'helpers/user-interactions'

type RecipeInCollectionProps = {
  recipeId: string
  inModal?: boolean
}

const RecipeInCollection: React.FC<RecipeInCollectionProps> = ({
  recipeId,
  inModal,
}) => {
  const CollectionVars: MyCollectionsVarsType = {
    cursor: null,
  }
  const updateSave = (title: string, saved: boolean, callback: () => void) => {
    addToCollection(
      {
        saveableType: 'Recipe',
        saveableId: recipeId,
        savedState: saved,
        collectionTitle: title,
      },
      callback
    )
  }
  return (
    <React.Fragment>
      <InfiniteScroll
        QUERY={OWNED_COLLECTIONS}
        hasJustConnection={false}
        nodeInit={collectionsNodeInit}
        QueryVars={CollectionVars}
        inModal={inModal}
      >
        {(edges: Array<EdgeType<CollectionsNodeType>>) => {
          return (
            <ul className="p-2">
              {edges.map((edge) => {
                if (edge.node.title)
                  return (
                    <Collectable
                      edge={edge}
                      recipeId={recipeId}
                      updateSave={updateSave}
                    />
                  )
              })}
            </ul>
          )
        }}
      </InfiniteScroll>
    </React.Fragment>
  )
}

type CollectableProps = {
  edge: any
  recipeId: string
  updateSave: (title: string, saved: boolean, callback: () => void) => void
}

const Collectable: React.FC<CollectableProps> = ({
  edge,
  recipeId,
  updateSave,
}) => {
  const ids = edge.node.saves
    ? edge.node.saves.nodes.map(
        (node: { saveable: { id: any } }) => node.saveable.id
      )
    : []
  const [saved, setSaved] = React.useState(-1)
  const [freeze, setFreeze] = React.useState(false)
  const updateState = () => {
    console.log('updateing sate')
    setSaved(saved > 0 ? 0 : 1)
    console.log(saved)
    setFreeze(!freeze)
  }

  const handleClick = () => {
    setFreeze(true)
    updateSave(edge.node.title, !saved, updateState)
  }
  useEffect(() => {
    if (saved < 0) setSaved(ids && ids.includes(recipeId) ? 1 : 0)
  })
  return (
    <li
      key={edge.cursor}
      className="flex flex-row justify-between px-2 py-3 shadow-lg m-2 text-lg rounded"
    >
      <Link
        href="/[username]/collections/[collectionhandle]"
        as={`/${edge.node.by.username}/collections/${edge.node.handle}`}
      >
        <a className="flex flex-row my-auto">
          <div className=" mr-2">{edge.node.title}</div>
        </a>
      </Link>
      <button
        onClick={handleClick}
        className={`${
          saved ? 'text-red-400' : 'text-green-500'
        } bold transform scale-200 mx-2 rounded-full cursor-pointer focus:outline-none`}
      >
        {saved ? <span className="h-0">-</span> : <span>+</span>}
      </button>
    </li>
  )
}
export default RecipeInCollection
