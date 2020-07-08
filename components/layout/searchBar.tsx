import React, { Component } from 'react'

type SearchBarProps = {
  className?: string
}
export const SearchBar: React.FC<SearchBarProps> = ({ className }) => {
  return (
    <input
      className={`${className}`}
      type="search"
      placeholder="Search"
    ></input>
  )
}
