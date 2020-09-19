import React, { Component } from 'react'

const PROFILE = require('images/chef-rj.svg')
const BACK = require('images/icons/close.svg')
const IMAGE = require('images/icons/picture.svg')

type AppOverlayProps = {
  onExit: () => void
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
      <div className="absolute left-0 z-100 overflow-scroll top-14  md:top-16  w-screen h-screen pb-12  mx-auto bg-white p-4 top-0 mt-0 pt-0">
        <div className="flex sticky top-0 pt-4 pb-2 bg-white">
          <span className="m-auto w-full">{this.props.header}</span>

          <img
            src={BACK}
            className="h-4 ml-4 my-auto"
            onClick={this.props.onExit}
          />
        </div>
        {this.props.children}
      </div>
    )
  }
}

export default AppOverlay
