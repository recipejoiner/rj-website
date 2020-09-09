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
      <div
        id="app-modal"
        className="absolute left-0 top-0 z-100 overflow-scroll top-14  md:top-16  w-screen h-screen pb-12  mx-auto bg-white p-4"
      >
        <div className="flex">
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
// const AppOverlay: React.FC<AppOverlayProps> = ({
//   onExit,
//   children,
//   header,
// }) => {
//   return (
//     <div
//       id="app-modal"
//       className="absolute left-0 top-0 z-100 overflow-scroll top-14  md:top-16  w-screen h-screen pb-12  mx-auto bg-white p-4"
//     >
//       <div className="flex">
//         <span className="m-auto w-full">{header}</span>

//         <img src={BACK} className="h-4 ml-4 my-auto" onClick={onExit} />
//       </div>
//       {children}
//     </div>
//   )
// }

export default AppOverlay
