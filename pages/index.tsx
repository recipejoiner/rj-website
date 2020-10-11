import { NextPage } from 'next'
import Head from 'next/head'
import React from 'react'

import Banner from 'components/homepage/Banner'
import { AllRecipesFeed, UserRecipesFeed } from 'components/homepage/RecipeFeed'
import UserContext from 'helpers/UserContext'

type Props = {}

const Home: NextPage<Props> = ({}) => {
  const { currentUserInfo } = React.useContext(UserContext)
  return (
    <React.Fragment>
      <Head>
        <script
          key="data-layer"
          dangerouslySetInnerHTML={{
            __html: `
						dataLayer = [{
							'ecomm_pagetype' : 'home'
						}]      
					`,
          }}
        />
      </Head>
      {currentUserInfo ? (
        <React.Fragment>
          <UserRecipesFeed />
        </React.Fragment>
      ) : (
        <React.Fragment>
          <Banner />
          {/* <AllRecipesFeed /> */}
          <MailChimp />
        </React.Fragment>
      )}
    </React.Fragment>
  )
}

const MailChimp = () => {
  return (
    <React.Fragment>
      <div
        id="mc_embed_signup"
        className=" bg-green-100 px-10 py-2 clear-left text-xl"
      >
        <form
          action="https://recipejoiner.us2.list-manage.com/subscribe/post?u=c454e2add429cd34426b83c6e&amp;id=3e7deebbae"
          method="post"
          id="mc-embedded-subscribe-form"
          name="mc-embedded-subscribe-form"
          className="validate"
          target="_blank"
        >
          <div id="mc_embed_signup_scroll">
            <span>Coming soon ....</span>
            <h1 className="text-4xl font-bold">Stay in the loop</h1>
            <input
              type="email"
              name="EMAIL"
              className="email p-4 border border-black"
              id="mce-EMAIL"
              placeholder="email address"
              required
            ></input>
            {/* <!-- real people should not fill this in and expect good things - do not remove this or risk form bot signups--> */}
            <div
              style={{ position: 'absolute', left: '-5000px' }}
              aria-hidden="true"
            >
              <input
                type="text"
                name="b_c454e2add429cd34426b83c6e_3e7deebbae"
                tabindex="-1"
                value=""
              ></input>
            </div>
            <div className="clear">
              <input
                type="submit"
                value="Subscribe"
                name="subscribe"
                id="mc-embedded-subscribe"
                className="button my-2 bg-gray-400 p-4 "
              ></input>
            </div>
          </div>
        </form>
      </div>
    </React.Fragment>
  )
}
export default Home
