import React, { Component } from 'react'

import Collapse from '@kunukn/react-collapse'

import UserContext from 'helpers/UserContext'
import Link from 'next/link'
import AppOverlay from 'components/AppOverlay'

const PROFILE = require('images/chef-rj.svg')
const BACK = require('images/icons/close.svg')
const IMAGE = require('images/icons/picture.svg')

type SearchProps = {
  className?: string
}

const SearchOverlay: React.FC = () => {
  //temp values
  let username = 'yosefserkez'
  let tag = 'disdashit'
  let recipe = 'Pasta and Cheese'

  return (
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
  )
}

export default SearchOverlay
