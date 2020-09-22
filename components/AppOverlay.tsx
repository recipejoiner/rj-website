import React, { Component } from 'react'

const PROFILE = require('images/chef-rj.svg')
const BACK = require('images/icons/close.svg')
const IMAGE = require('images/icons/picture.svg')

type AppOverlayProps = {
  children: React.ReactNode
  header: React.ReactNode
}

// prevent rerendering of appOverlay state when closed and reopened. Seems to only work with class component
class AppOverlay extends Component<AppOverlayProps> {
  constructor(props: AppOverlayProps) {
    super(props)
  }
  shouldComponentUpdate() {
    return false
  }
  render() {
    return (
      <div className="absolute left-0 z-90 overflow-scroll w-screen h-screen pb-12 mx-auto bg-white p-4 mt-0 pt-0 border-gray-400 border-t">
        <div className=" opacity-100 bg-white bg-opacity-100">
          <div className="flex sticky top-0   bg-white text-center w-full">
            <span className="m-auto w-full">{this.props.header}</span>
          </div>
          {this.props.children}
        </div>
      </div>
    )
  }
}

export default AppOverlay
