import * as React from 'react'
import Skeleton from 'react-loading-skeleton'
import { SearchNodeType } from 'requests/search'
import Link from 'next/link'
import ScreenContext from 'helpers/ScreenContext'

const PROFILE = require('images/chef-rj.svg')

interface SearchResultContext {
  searchNode: SearchNodeType
}

const SearchResult: React.FC<SearchResultContext> = ({ searchNode }) => {
  const { setSearchState } = React.useContext(ScreenContext)

  if (searchNode) {
    let node = searchNode
    switch (searchNode.__typename) {
      case 'User':
        return (
          <div className="p-3 rounded my-1">
            <div className="flex align-middle whitespace-no-wrap">
              <Link href="/[username]" as={`/${node.username}`}>
                <a
                  className="contents"
                  onClick={() =>
                    setSearchState ? setSearchState(false) : null
                  }
                >
                  <img
                    src={node.profileImageUrl || PROFILE}
                    className="h-12 w-12 cursor-pointer rounded-full"
                  />
                  <span className="text-xl m-auto ml-2">
                    {node.username || <Skeleton width={40} />}
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
                as={`/${node.by.username || '#'}/${node.handle || '#'}`}
              >
                <a className="contents">
                  <img
                    src={node.imageUrl || PROFILE}
                    className="h-12 w-12 cursor-pointer"
                    onClick={() =>
                      setSearchState ? setSearchState(false) : null
                    }
                  />
                  <div className="flex flex-col">
                    <span className="truncate ml-2 text-xl ">
                      <span className="">
                        {node.title || <Skeleton width={40} />}
                      </span>
                    </span>
                    <Link href="/[username]" as={`/${node.by.username}`}>
                      <a
                        className="contents"
                        onClick={() =>
                          setSearchState ? setSearchState(false) : null
                        }
                      >
                        <span className="ml-2 text-xs">
                          <span className="">
                            by {node.by.username || <Skeleton width={40} />}
                          </span>
                        </span>
                      </a>
                    </Link>
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
