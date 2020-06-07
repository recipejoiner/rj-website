import React from 'react'
import { NextPage } from 'next'
import Head from 'next/head'
import Link from 'next/link'
import { logout } from 'helpers/auth'
import { withLoginRedirect } from 'helpers/auth'

interface SettingsPageProps {}

const SettingsPage: NextPage<SettingsPageProps> = ({}) => {
  const linkStyle =
    'w-full px-8 py-4 block font-semibold hover:text-gray-700 uppercase text-sm tracking-widest border-b border-gray-300'

  const title = 'Edit Profile - RecipeJoiner'
  const description = 'Profile edit page'
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
      <div className="p-2">
        <span className="block text-center pt-10">
          Profile editing coming soon!
        </span>
      </div>
    </React.Fragment>
  )
}

export default withLoginRedirect(SettingsPage)
