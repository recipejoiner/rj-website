import * as React from 'react'
import Skeleton from 'react-loading-skeleton'
import {
  RecipeSearchType,
  UserSearchType,
  TagSearchType,
} from 'requests/search'
import Link from 'next/link'
import ScreenContext from 'helpers/ScreenContext'

const PROFILE = require('images/chef-rj.svg')

interface SearchResultContext {
  searchNode: RecipeSearchType | UserSearchType | TagSearchType
}

const SearchResult: React.FC<SearchResultContext> = ({ searchNode }) => {
  const { setSearchState } = React.useContext(ScreenContext)
  if (searchNode) {
    switch (searchNode.__typename) {
      case 'User':
        return (
          <div className="p-3 rounded my-1">
            <div className="flex align-middle whitespace-no-wrap">
              <Link href="/[username]" as={`/${searchNode.username}`}>
                <a
                  className="contents"
                  onClick={() =>
                    setSearchState ? setSearchState(false) : null
                  }
                >
                  <img
                    src={searchNode.profileImageUrl || PROFILE}
                    className="h-12 w-12 cursor-pointer rounded-full"
                  />
                  <span className="text-xl m-auto ml-2">
                    {searchNode.username || <Skeleton width={40} />}
                  </span>
                </a>
              </Link>
            </div>
          </div>
        )
      case 'Recipe':
        return (
          <div className="p-3 rounded my-1">
            <div className="flex align-middle whitespace-no-wrap">
              <Link
                href="/[username]/[recipehandle]"
                as={`/${searchNode.by.username || '#'}/${
                  searchNode.handle || '#'
                }`}
              >
                <a
                  className="contents"
                  onClick={() =>
                    setSearchState ? setSearchState(false) : null
                  }
                >
                  <img
                    src={searchNode.imageUrl || PROFILE}
                    className="h-12 w-12 cursor-pointer"
                  />
                  <div className="flex flex-col">
                    <span className="truncate ml-2 text-xl ">
                      <span className="">
                        {searchNode.title || <Skeleton width={40} />}
                      </span>
                    </span>
                    <span className="ml-2 text-xs">
                      <span className="">
                        by {searchNode.by.username || <Skeleton width={40} />}
                      </span>
                    </span>
                  </div>
                </a>
              </Link>
            </div>
          </div>
        )
      case 'Tag':
        return <div>Tag</div>
      default:
        return null
    }
  }
  return null
}

export default SearchResult
