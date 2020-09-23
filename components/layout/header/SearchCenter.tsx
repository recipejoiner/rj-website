import * as React from 'react'

import InfiniteScroll, { EdgeType } from 'components/InfiniteScroll'
import {
  SEARCH,
  searchNodeInit,
  SearchVarsType,
  RecipeSearchType,
  UserSearchType,
  TagSearchType,
} from 'requests/search'
import SearchResult from 'components/SearchResult'

type SearchCenter = {
  query?: string
}

const SearchCenter: React.FC<SearchCenter> = ({ query = '' }) => {
  const ALL = 'Recipe, User, TagRef',
    RECIPE = 'Recipe',
    USER = 'User',
    TAG = 'TagRef'
  const [searchIn, setSearchIn] = React.useState(ALL)
  const [searchQuery, setSearchQuery] = React.useState<string>(query)

  const handleChange = (data: {
    target: { name: any; value: any; id?: string }
  }) => {
    const {
      name,
      value,
      id,
    }: { name: string; value: string; id?: string } = data.target
    setSearchQuery(value)
  }
  return (
    <React.Fragment>
      <input
        className="p-2 w-full outline-none border rounded"
        type="search"
        placeholder="Search"
        value={searchQuery}
        onChange={handleChange}
      ></input>
      <div className="grid grid-cols-3 text-center">
        <span
          onClick={() => setSearchIn(ALL)}
          className={`${searchIn === ALL ? 'bg-gray-400 font-bold' : ''} p-4`}
        >
          All
        </span>
        <span
          onClick={() => setSearchIn(USER)}
          className={`${searchIn === USER ? 'bg-gray-400 font-bold' : ''} p-4`}
        >
          Users
        </span>
        <span
          onClick={() => setSearchIn(RECIPE)}
          className={`${
            searchIn === RECIPE ? 'bg-gray-400 font-bold' : ''
          } p-4`}
        >
          Recipes
        </span>
      </div>
      <InfiniteScroll
        inModal={true}
        QUERY={SEARCH}
        hasJustConnection={true}
        nodeInit={searchNodeInit}
        QueryVars={(() => {
          const queryVars: SearchVarsType = {
            cursor: null,
            query: searchQuery || '',
            searchIn: searchIn,
          }
          return queryVars
        })()}
        hasSubscription={false}
      >
        {(
          edges: Array<
            EdgeType<RecipeSearchType | UserSearchType | TagSearchType>
          >
        ) => (
          <ul>
            {edges.map((edge) => {
              return <SearchResult key={edge.cursor} searchNode={edge.node} />
            })}
          </ul>
        )}
      </InfiniteScroll>
    </React.Fragment>
  )
}

export default SearchCenter
