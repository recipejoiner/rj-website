import React, { Component } from 'react'

import Collapse from '@kunukn/react-collapse'

import UserContext from 'helpers/UserContext'
import Link from 'next/link'

const PROFILE = require('images/chef-rj.svg')
const BACK = require('images/icons/arrow.svg')
const IMAGE = require('images/food/fish-placeholder.jpg')

type SearchBarProps = {
  className?: string
}
type SearchOverlayProps = {
  onExit: () => void
}
const SearchOverlay: React.FC<SearchOverlayProps> = ({ onExit }) => {
  //temp values
  let username = 'yosefserkez'
  let tag = 'disdashit'
  let recipe = 'Pasta and Cheese'

  return (
    <div className="absolute z-100 overflow-scroll top-14  md:top-16  w-screen h-screen pb-12  mx-auto bg-white p-4">
      <div className="flex">
        <img src={BACK} className="h-6" onClick={onExit} />
        <span className="m-auto text-gray-700">
          Search for tags, recipes, or users.
        </span>
      </div>

      <div className=" ">
        <div className="my-4">
          <span className="font-bold text-lg">Tags</span>
          {Array.apply(null, Array(10)).map(function () {
            return (
              <Link href="/#" as={`/${username}`}>
                <a className="flex align-middle w-full">
                  <span className="self-center   text-blue-600 focus:underline">
                    #{tag}
                  </span>
                </a>
              </Link>
            )
          })}
        </div>
        <div className="my-4">
          <span className="font-bold text-lg">Recipes</span>
          {Array.apply(null, Array(10)).map(function () {
            return (
              <Link href="/[recipehandle]" as={`/${recipe}`}>
                <a className="flex align-middle w-full py-2">
                  <img src={IMAGE} className="h-12 cursor-pointer rounded-lg" />
                  <span className="self-center ml-2 ">{recipe}</span>
                  <span className="self-center ml-2 text-xs">@{username}</span>
                </a>
              </Link>
            )
          })}
        </div>
        <div className="my-4">
          <span className="font-bold text-lg">Users</span>
          {Array.apply(null, Array(10)).map(function () {
            return (
              <Link href="/[username]" as={`/${username}`}>
                <a className="flex align-middle w-full py-2">
                  <img
                    src={PROFILE}
                    className="h-6 cursor-pointer rounded-full"
                  />
                  <span className="self-center ml-2 ">{username}</span>
                </a>
              </Link>
            )
          })}
        </div>
      </div>
    </div>
  )
}
export const SearchBar: React.FC<SearchBarProps> = ({ className }) => {
  const [inFocus, setInFocus] = React.useState(false)

  const updateFocus = () => {
    setInFocus(!inFocus)
  }
  const exitFocus = () => {}
  return (
    <React.Fragment>
      <input
        className={`${className} `}
        type="search"
        placeholder="Search"
        onFocus={updateFocus}
      ></input>
      {!!inFocus ? <SearchOverlay onExit={() => updateFocus()} /> : null}
    </React.Fragment>
  )
}
