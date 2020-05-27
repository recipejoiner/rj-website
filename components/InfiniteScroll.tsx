import * as React from 'react'

import client from 'requests/client'
import { getToken } from 'helpers/auth'
import { useQuery } from '@apollo/react-hooks'
import { useEvent } from 'helpers/methods'
import { DocumentNode } from 'graphql'

export interface EdgeType<NodeType> {
  cursor: string
  node: NodeType
  __typename: string
}

/*
This supports two types of queries:
One of this structure:
data {
  connection {
    ...
  }
}
and one of this structure:
data {
  result {
    connection {
      ...
    }
  }
}
*/
export interface QueryConnectionRes<NodeType> {
  connection: {
    pageInfo: {
      hasNextPage: boolean
      __typename: string
    }
    edges: Array<EdgeType<NodeType>>
    __typename: string
  }
  __typename: string
}

export interface QueryResultRes<NodeType> {
  result: QueryConnectionRes<NodeType>
  __typename: string
}

interface InfiniteScrollProps<NodeType, QueryVarsType> {
  QUERY: DocumentNode
  QueryData: QueryResultRes<NodeType> | QueryConnectionRes<NodeType>
  QueryVars: QueryVarsType
  children: (edges: Array<EdgeType<NodeType>>) => React.ReactNode
}

const InfiniteScroll: React.FC<InfiniteScrollProps<any, any>> = ({
  QUERY,
  QueryData,
  QueryVars,
  children,
}) => {
  const { loading, data, error, fetchMore } = useQuery<
    typeof QueryData,
    typeof QueryVars
  >(QUERY, {
    client: client,
    context: {
      headers: {
        authorization: `Bearer ${getToken()}`,
        'content-type': 'application/json',
      },
    },
  })

  const [activelyFetching, setActivelyFetching] = React.useState(false)

  const [infiniteScrollData, setInfiniteScrollData] = React.useState<
    typeof QueryData
  >(QueryData)

  const onLoadMore = () => {
    setActivelyFetching(true)
    const { result } = (infiniteScrollData as QueryResultRes<any>) || {}
    const { connection } = result || infiniteScrollData
    const { edges } = connection
    const lastCursor = edges[edges.length - 1].cursor
    fetchMore({
      variables: {
        cursor: lastCursor,
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (fetchMoreResult) {
          if ('result' in fetchMoreResult && 'result' in infiniteScrollData) {
            let combinedData: QueryResultRes<any> = {
              result: {
                connection: {
                  pageInfo: fetchMoreResult.result.connection.pageInfo,
                  edges: [
                    ...infiniteScrollData.result.connection.edges,
                    ...fetchMoreResult.result.connection.edges,
                  ],
                  __typename: fetchMoreResult.result.connection.__typename,
                },
                __typename: fetchMoreResult.result.__typename,
              },
              __typename: fetchMoreResult.__typename,
            }
            setInfiniteScrollData(combinedData)
          } else if (
            'connection' in fetchMoreResult &&
            'connection' in infiniteScrollData
          ) {
            let combinedData: QueryConnectionRes<any> = {
              connection: {
                pageInfo: fetchMoreResult.connection.pageInfo,
                edges: [
                  ...infiniteScrollData.connection.edges,
                  ...fetchMoreResult.connection.edges,
                ],
                __typename: fetchMoreResult.connection.__typename,
              },
              __typename: fetchMoreResult.__typename,
            }
            setInfiniteScrollData(combinedData)
          } else {
            throw "There's something wrong with the return types."
          }
        }
        return infiniteScrollData
      },
    })
    setActivelyFetching(false)
  }

  const handleScroll = () => {
    if (
      !activelyFetching &&
      window.innerHeight + window.scrollY >= document.body.offsetHeight
    ) {
      onLoadMore()
    }
  }

  useEvent('scroll', handleScroll)

  // for initial load
  const [loaded, setLoad] = React.useState(false)
  if (loaded === false && data) {
    setInfiniteScrollData(data)
    setLoad(true)
  }
  const { result } = (infiniteScrollData as QueryResultRes<any>) || {}
  const { connection } = result || infiniteScrollData
  const { edges } = connection
  return (
    <React.Fragment>
      <div id="_infinitescroll">{children(edges)}</div>
    </React.Fragment>
  )
}

export default InfiniteScroll
