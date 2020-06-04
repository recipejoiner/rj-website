import { NextPage } from 'next'
import Head from 'next/head'
import React from 'react'

import UserContext from 'helpers/UserContext'

type Props = {}

const Follower: NextPage<Props> = ({}) => {
  const { currentUserInfo } = React.useContext(UserContext)
  return (
    <React.Fragment>
      <Head></Head>
      <div>Follower list goes here</div>
    </React.Fragment>
  )
}

export default Follower
