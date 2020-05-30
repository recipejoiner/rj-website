import React from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { withLoginRedirect } from 'helpers/auth'

interface SettingsPageProps {}

const SettingsPage: NextPage<SettingsPageProps> = ({}) => {
  const title = 'Settings - RecipeJoiner'
  const description = 'Settings page'
  return (
    <React.Fragment>
      <Head>
        {/* Give the title a key so that it's not duplicated - this allows me to change the page title on other pages */}
        <title key="title">{title}</title>
        <meta charSet="utf-8" />
        <meta key="description" name="description" content={description} />
        {/* OpenGraph tags */}
        <meta
          key="og:url"
          property="og:url"
          content={`${process.env.NEXT_PUBLIC_BASE_URL}/accounts/edit`}
        />
        <meta key="og:title" property="og:title" content={title} />
        <meta
          key="og:description"
          property="og:description"
          content={description}
        />
        {/* OpenGraph tags end */}
      </Head>
      Edit/settings page will go here
    </React.Fragment>
  )
}

export default withLoginRedirect(SettingsPage)
