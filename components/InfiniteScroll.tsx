import * as React from 'react';

import client from 'requests/client';
import { useQuery } from '@apollo/react-hooks';
import { useEvent } from 'helpers/methods';
import { DocumentNode } from 'graphql';

export interface EdgeType<NodeType> {
  cursor: string;
  node: NodeType;
  __typename: string;
}

export interface QueryRes<NodeType> {
  connection: {
    pageInfo: {
      hasNextPage: boolean;
      __typename: string;
    }
    edges: Array<EdgeType<NodeType>>;
    __typename: string;
  }
}

interface InfiniteScrollProps<NodeType, QueryVarsType> {
  QUERY: DocumentNode;
  QueryData: QueryRes<NodeType>;
  QueryVars: QueryVarsType;
  children: (edges: Array<EdgeType<NodeType>>) => React.ReactNode;
}

const InfiniteScroll: React.FC<InfiniteScrollProps<any, any>> = ({
  QUERY,
  QueryData,
  QueryVars,
  children
}) => {

  const token = process.env.NEXT_PUBLIC_RJ_API_TOKEN || ""

  const { loading, data, error, fetchMore } = useQuery<typeof QueryData, typeof QueryVars>(
    QUERY,
    {
      client: client,
      context: {
        headers: {
          authorization: `Bearer ${token}`,
          'content-type': 'application/json',
        }
      }
    }
  );

  const [activelyFetching, setActivelyFetching] = React.useState(false);

  const [infiniteScrollData, setInfiniteScrollData] = React.useState<typeof QueryData>(QueryData);

  const onLoadMore = () => {
    setActivelyFetching(true);
    const { edges } = infiniteScrollData.connection;
    const lastCursor = edges[edges.length - 1].cursor;
    fetchMore({
      variables: {
        cursor: lastCursor
      },
      updateQuery: (prev, { fetchMoreResult }) => {
        if (fetchMoreResult) {
          let combinedData: typeof QueryData = {
            connection: {
              pageInfo: fetchMoreResult.connection.pageInfo,
              edges: [...infiniteScrollData.connection.edges, ...fetchMoreResult.connection.edges],
              __typename: "RecipeConnection"
            }
          }
          setInfiniteScrollData(combinedData);
        }
        return(infiniteScrollData);
      }
    })
    setActivelyFetching(false);
  }

  const handleScroll = () => {
    if (!activelyFetching && ((window.innerHeight + window.scrollY) >= document.body.offsetHeight)) {
      onLoadMore();
    }
  };

  useEvent('scroll', handleScroll);

  // for initial load
  const [loaded, setLoad] = React.useState(false);
  if(loaded === false && data){
		setInfiniteScrollData(data);
		setLoad(true);
	}
  return(
    <React.Fragment>
      <div
        id="_infinitescroll"
      >
        {
          children(infiniteScrollData.connection.edges)
        }
      </div>
    </React.Fragment>
  )
}

export default InfiniteScroll;