/* 
Next.js uses an App component to pass down classes to the other files
in our app. This saves us from having to add imports to each file.
We’ll use this to pass down components, styles, and everything else
typically found in an index file.
*/

import App from 'next/app';
import Head from 'next/head';
import * as React from 'react';
import '../styles/tailwind.css';

import ApolloClient from 'apollo-client';
import { HttpLink } from 'apollo-link-http';
import { ApolloProvider } from 'react-apollo';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { detect } from 'detect-browser';

export const client = new ApolloClient({
  ssrMode: true,
  link: new HttpLink({
    uri: process.env.REACT_APP_STORE_URI,
    headers: { 'X-Shopify-Storefront-Access-Token': process.env.REACT_APP_STOREFRONT_TOKEN }
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore'
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all'
    },
    mutate: {
      errorPolicy: 'all'
		}
	}
});

interface AppState {
  // add state variables
}

class MyApp extends App<{}, {}, AppState> {
  constructor(AppProps: any) {
    super(AppProps);

    // this.state = {
    //   // global state variables
    // }
  }

  fullSite() {
    const { Component, pageProps } = this.props;
    return (
      // 'min-h-screen flex flex-col' are for making it easier to make the footer sticky
      <div className="min-h-screen flex flex-col font-sans">
        <Head>
          {/* Favicons */}
          <link rel='icon' href='/icon/favicon.ico' type='image/x-icon' />
          <link rel="apple-touch-icon" href="/image/apple-touch-icon.png"></link>
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
          <meta key="og:title" property="og:title" content="RecipeJoiner - A Chef's Home." />
          <meta key="og:site_name" property="og:site_name" content="RecipeJoiner - A Chef's Home." />
          <meta key="og:description" property="og:description" content="A community for storing and sharing all of your recipes, as well as discovering what other chefs are making!" />
          {/* <meta key="og:image" property="og:image" content={`${process.env.BASE_URL}/social-images/ame-homepage-image.jpg`} /> */}
          <meta key="og:type" property="og:type" content="website" />
          {/* OpenGraph tags end */}
        </Head>
        <ApolloProvider client={client}>
          {/* Flex col to allow for putting a header and footer above and below the page */}
          <div className="min-h-screen flex flex-col">
            {/* This div exists solely for applying styles, eg giving the page padding */}
            <div className=" flex-grow antialiased bg-white text-gray-900 w-full relative mx-auto max-w-12xl">
              <Component {...pageProps} />
            </div>
          </div>
        </ApolloProvider>
      </div>
    );
  }

  noSupport() {
    return(
      <span className="h-screen w-full table p-2">
        <div className="text-center table-cell align-middle font-light text-xl tracking-wide">
          {/* <svg className="h-16 pt-2 pb-2 text-black fill-current" viewBox="0 0 947 445" version="1.1" >
              <path d="M585.5,143.739027 L707.631144,0 L947,445 L741.040879,445 L585.5,154.397434 L429.959121,445 L224,445 L463.368856,0 L585.5,143.739027 Z M239.368856,0 L365,147.85826 L205.959121,445 L-5.68434189e-14,445 L239.368856,0 Z"></path>
          </svg> */}
          <h1 className="text-2xl">
            Welcome to RecipeJoiner!
          </h1>
          <span>
            Sorry, we don't support Internet Explorer.<br />Please upgrade to Google Chrome or Firefox by clicking on either of the logos below.
          </span>
          <div className="py-3">
            <a href="https://www.google.com/chrome/" target="_blank" rel="noopener">
              <img
                className="w-20 h-20 m-auto inline-block"
                src="/browser-logos/chrome-logo.svg"
              />
            </a>
            <a href="https://www.mozilla.org/en-US/firefox/new/" target="_blank" rel="noopener">
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

	render() {
    const browser = detect();
    switch (browser && browser.name) {
      case 'ie':
        return(
          this.noSupport()
        );
      default:
        return(
          this.fullSite()
        );
    }
	}
}

export default MyApp;
