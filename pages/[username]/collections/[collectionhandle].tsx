import * as React from 'react'
import { RecipeType } from 'requests/recipes'
import { GetServerSideProps, NextPage } from 'next'
import {
  CollectionType,
  GET_COLLECTION,
  SHORT_COLLECTION,
} from 'requests/collections'
import client from 'requests/client'
import { getToken } from 'helpers/auth'
import { CollectionRecipes } from 'components/homepage/RecipeFeed'

interface CollectionProps {
  collectionInfo: CollectionType
}
const CollectionHandle: NextPage<CollectionProps> = ({ collectionInfo }) => {
  if (!collectionInfo) {
    return <div>Nothing here yet</div>
  }
  const { by, handle, title, description } = collectionInfo.result
  return (
    <div>
      <div className="bg-gray-300 p-2 text-center">
        <div className="text-3xl">{title}</div>
        <div>{description}</div>
      </div>
      <div className="bg-gray-100  text-center p-2">
        A Cookbook by {by.username}
      </div>

      <CollectionRecipes username={by.username} handle={handle} />
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  try {
    const { params } = ctx

    const username = params?.username
    const collectionhandle = params?.collectionhandle

    const data: CollectionType = await client
      .query({
        query: SHORT_COLLECTION,
        variables: {
          username: username,
          handle: collectionhandle,
        },
        context: {
          // example of setting the headers with context per operation
          headers: {
            authorization: `Bearer ${getToken(ctx)}`,
          },
        },
      })
      .then((res) => {
        if (res.errors) {
          throw res.errors
        }
        return res.data
      })
    return {
      props: {
        collectionInfo: data,
      },
    }
  } catch (err) {
    console.log('err', err)
    // handle error - probably put honeybadger here or something
    return { props: { collectionInfo: null } }
  }
}
export default CollectionHandle
