/* 
Next.js uses an App component to pass down classes to the other files
in our app. This saves us from having to add imports to each file.
We’ll use this to pass down components, styles, and everything else
typically found in an index file.
*/

import App from 'next/app'
import { AppContext, AppProps } from 'next/app'
import Head from 'next/head'
import * as React from 'react'
import '../styles/tailwind.css'

import { detect } from 'detect-browser'

import UserContext from 'helpers/UserContext'
import client from 'requests/client'
import {
  CurrentUserLoginCheckType,
  CURRENT_USER_LOGIN_CHECK,
} from 'requests/auth'
import { getToken } from 'helpers/auth'
import Header from 'components/layout/Header'

interface AppState {
  loggedIn: boolean
  menuOpen: boolean
  yPos: number
}

interface UserProps {
  loggedIn: boolean
}

class MyApp extends App<UserProps, {}, AppState> {
  constructor(AppProps: any) {
    super(AppProps)
    this.props
    this.state = {
      loggedIn: false,
      menuOpen: false,
      yPos: 0,
    }
    this.setLoggedIn = this.setLoggedIn.bind(this)
    this.setMenuOpen = this.setMenuOpen.bind(this)
  }

  static getDerivedStateFromProps(
    props: UserProps & AppProps,
    state: AppState
  ) {
    // Any time the user's logged-in state changes,
    // reset any parts of state that are tied to that.
    // Here, it's just a boolean. Might add more user info in the future.
    if (props.loggedIn !== state.loggedIn) {
      return {
        loggedIn: props.loggedIn,
      }
    }
    return null
  }

  setLoggedIn(state: boolean) {
    this.setState({
      loggedIn: state,
    })
  }

  setMenuOpen(menuOpenStatus: boolean) {
    // Opening the menu: save the current scroll position
    if (menuOpenStatus === true) {
      this.setState({
        menuOpen: menuOpenStatus,
        yPos: window.pageYOffset,
      })
    }
    // Closing the menu: set the previous scroll position
    else {
      this.setState(
        {
          menuOpen: menuOpenStatus,
        },
        () => window.scrollTo(0, this.state.yPos)
      )
    }
  }

  fullSite() {
    const { Component, pageProps } = this.props
    const { menuOpen } = this.state
    return (
      // 'min-h-screen flex flex-col' are for making it easier to make the footer (if we add one) sticky
      <div className="min-h-screen flex flex-col font-sans">
        <Head>
          {/* Favicons */}
          <link rel="icon" href="/icon/favicon.ico" type="image/x-icon" />
          <link
            rel="apple-touch-icon"
            href="/image/apple-touch-icon.png"
          ></link>
          {/* Give the title a key so that it's not duplicated - this allows me to change the page title on other pages */}
          <title key="title">RecipeJoiner - A Chef's Home.</title>
          <meta charSet="utf-8" />
          <meta
            key="description"
            name="description"
            content="A community for storing and sharing all of your recipes, as well as discovering what other chefs are making!"
          />
          {/* OpenGraph tags */}
          <meta key="og:url" property="og:url" content={process.env.BASE_URL} />
          <meta
            key="og:title"
            property="og:title"
            content="RecipeJoiner - A Chef's Home."
          />
          <meta
            key="og:site_name"
            property="og:site_name"
            content="RecipeJoiner - A Chef's Home."
          />
          <meta
            key="og:description"
            property="og:description"
            content="A community for storing and sharing all of your recipes, as well as discovering what other chefs are making!"
          />
          {/* <meta key="og:image" property="og:image" content={`${process.env.BASE_URL}/social-images/ame-homepage-image.jpg`} /> */}
          <meta key="og:type" property="og:type" content="website" />
          {/* OpenGraph tags end */}
        </Head>
        <UserContext.Provider
          value={{
            isLoggedIn: this.state.loggedIn,
            setLoggedIn: this.setLoggedIn,
          }}
        >
          {/* Flex col to allow for putting a header and footer above and below the page */}
          <div
            className={`min-h-screen flex flex-col ${
              menuOpen
                ? 'overflow-hidden max-h-screen fixed lg:overflow-auto lg:static lg:max-h-full'
                : ''
            }`}
          >
            {/* UserContext.Provider allows us to provide whatever we set as the value here to all components contained within */}
            <Header setMenuOpen={this.setMenuOpen} />
            {/* This div exists solely for applying styles, eg giving the page padding */}
            <div className="pt-14 flex-grow antialiased bg-white text-gray-900 w-full relative mx-auto max-w-12xl">
              <Component {...pageProps} />
            </div>
          </div>
        </UserContext.Provider>
      </div>
    )
  }

  noSupport() {
    return (
      <span className="h-screen w-full table p-2">
        <div className="text-center table-cell align-middle font-light text-xl tracking-wide">
          {/* <svg className="h-16 pt-2 pb-2 text-black fill-current" viewBox="0 0 947 445" version="1.1" >
              <path d="M585.5,143.739027 L707.631144,0 L947,445 L741.040879,445 L585.5,154.397434 L429.959121,445 L224,445 L463.368856,0 L585.5,143.739027 Z M239.368856,0 L365,147.85826 L205.959121,445 L-5.68434189e-14,445 L239.368856,0 Z"></path>
          </svg> */}
          <h1 className="text-2xl">Welcome to RecipeJoiner!</h1>
          <span>
            Sorry, we don't support Internet Explorer.
            <br />
            Please upgrade to Google Chrome or Firefox by clicking on either of
            the logos below.
          </span>
          <div className="py-3">
            <a
              href="https://www.google.com/chrome/"
              target="_blank"
              rel="noopener"
            >
              <img
                className="w-20 h-20 m-auto inline-block"
                src="/browser-logos/chrome-logo.svg"
              />
            </a>
            <a
              href="https://www.mozilla.org/en-US/firefox/new/"
              target="_blank"
              rel="noopener"
            >
              <img
                className="w-20 h-20 m-auto inline-block"
                src="/browser-logos/firefox-logo.svg"
              />
            </a>
          </div>
        </div>
      </span>
    )
  }

  static async getInitialProps({ Component, AppTree, ctx }: AppContext) {
    let pageProps = {}

    if (Component.getInitialProps) {
      pageProps = await Component.getInitialProps(ctx)
    }

    const loggedIn = await client
      .query({
        query: CURRENT_USER_LOGIN_CHECK,
        context: {
          // example of setting the headers with context per operation
          headers: {
            authorization: `Bearer ${getToken(ctx)}`,
          },
        },
        // Prevent caching issues when logging in/out without refresh.
        fetchPolicy: 'network-only',
      })
      .then((res) => {
        const { data }: { data?: CurrentUserLoginCheckType } = res || {}
        if (data && data.me.email) {
          return true
        }
        return false
      })
      .catch(() => {
        return false
      })
    return { pageProps, loggedIn }
  }

  render() {
    const browser = detect()
    switch (browser && browser.name) {
      case 'ie':
        return this.noSupport()
      default:
        return this.fullSite()
    }
  }
}

export default MyApp
