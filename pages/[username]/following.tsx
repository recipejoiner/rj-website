import { NextPage } from 'next'
import Head from 'next/head'
import React from 'react'

import UserContext from 'helpers/UserContext'

type Props = {}

const Following: NextPage<Props> = ({}) => {
  const { currentUserInfo } = React.useContext(UserContext)
  return (
    <React.Fragment>
      {/* <Head></Head> */}
      <div>Following list goes here</div>
    </React.Fragment>
  )
}

export default Following
