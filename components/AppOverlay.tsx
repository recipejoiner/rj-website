import React, { Component } from 'react'

const PROFILE = require('images/chef-rj.svg')
const BACK = require('images/icons/close.svg')
const IMAGE = require('images/icons/picture.svg')

type AppOverlayProps = {
  onExit: () => void
  children: React.ReactNode
  header: React.ReactNode
}
const AppOverlay: React.FC<AppOverlayProps> = ({
  onExit,
  children,
  header,
}) => {
  return (
    <div className="absolute left-0 top-0 z-100 overflow-scroll top-14  md:top-16  w-screen h-screen pb-12  mx-auto bg-white p-4">
      <div className="flex">
        <span className="m-auto w-full">{header}</span>

        <img src={BACK} className="h-4 ml-4 my-auto" onClick={onExit} />
      </div>
      {children}
    </div>
  )
}

export default AppOverlay
