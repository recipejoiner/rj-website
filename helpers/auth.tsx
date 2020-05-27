import React from 'react'
import {
  NextComponentType,
  NextPageContext,
  GetServerSidePropsContext,
} from 'next'
import Router from 'next/router'

import { getCookie, getCookieFromCookies, deleteCookie } from 'helpers/methods'
import client from 'requests/client'
import { LogoutReturnType, LOGOUT } from 'requests/auth'
import {
  CurrentUserLoginCheckType,
  CURRENT_USER_LOGIN_CHECK,
} from 'requests/auth'
import { ParsedUrlQuery } from 'querystring'

// Return the user's token if one exists, else the API token
export const getToken = (
  ctx?: NextPageContext | GetServerSidePropsContext<ParsedUrlQuery>
) => {
  if (!!ctx && typeof window === 'undefined') {
    return (
      getCookieFromCookies(ctx.req?.headers.cookie || '', 'UserToken') ||
      process.env.NEXT_PUBLIC_RJ_API_TOKEN
    )
  } else if (typeof window !== 'undefined') {
    return getCookie('UserToken') || process.env.NEXT_PUBLIC_RJ_API_TOKEN
  }
}

export const logout = (everywhere: boolean) => {
  const localLogout = () => {
    deleteCookie('UserToken')
    location.reload()
    client.resetStore()
    return true
  }
  if (everywhere) {
    const loggedOut = client
      .mutate({
        mutation: LOGOUT,
        context: {
          headers: {
            authorization: `Bearer ${getToken()}`,
          },
        },
      })
      .then((res) => {
        const { data }: { data?: LogoutReturnType } = res || {}
        if (!data) {
          return false
        }
        const locallyLoggedOut = localLogout()
        return locallyLoggedOut && data.logout // Will be false if, for example, the token used is the API token
      })
      .catch(() => {
        return false
      })
  } else {
    localLogout()
  }
}

// based on https://reactgraphql.github.io/auth-redirect-next-js/

/**
 * A function that queries for the logged in user before rendering the page.
 * Should be called in getInitialProps. It redirects as desired.
 *
 * It allows for redirecting both if the user is not logged in (e.g., redirect
 * to login page) or redirecting if the user is logged in.
 *
 * If not logged in, redirects to the desired route.
 *
 * The return value indicates whether logic should continue or not after the
 * call.
 */

const redirectBasedOnLogin = async (
  ctx: NextPageContext,
  route: string,
  redirectIfAuthed: boolean
): Promise<boolean> => {
  const token = getToken(ctx)
  const isLoggedIn = await client
    .query({
      query: CURRENT_USER_LOGIN_CHECK,
      context: {
        headers: {
          authorization: `Bearer ${token}`,
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

  const shouldRedirect = redirectIfAuthed ? isLoggedIn : !isLoggedIn
  if (shouldRedirect) {
    // https://github.com/zeit/next.js/wiki/Redirecting-in-%60getInitialProps%60
    if (ctx.res) {
      ctx.res.writeHead(302, {
        Location: route,
      })
      ctx.res.end()
    } else {
      Router.push(route)
    }
    return Promise.resolve(false)
  }
  return Promise.resolve(true)
}

/**
 * General HOC that allows redirection based on authentication. We should not
 * expose this: instead export specific routes and redirect combinations.
 */
const withAuthRedirect = (route: string, redirectIfAuthed: boolean) => <P,>(
  Page: NextComponentType<NextPageContext, {}, P>
) => {
  return class extends React.Component<P> {
    static async getInitialProps(ctx: NextPageContext) {
      const shouldContinue = await redirectBasedOnLogin(
        ctx,
        route,
        redirectIfAuthed
      )
      // Only continue if we're logged in. Otherwise, it might cause an
      // unnecessary call to a downstream getInitialProps that requires
      // authentication.
      if (!shouldContinue) {
        return {}
      }
      if (Page.getInitialProps) {
        return Page.getInitialProps(ctx)
      }
    }

    render() {
      return <Page {...this.props} />
    }
  }
}

/**
 * HOC that redirects to login page if the user is not logged in.
 */
export const withLoginRedirect = withAuthRedirect('/login', false)
/**
 * HOC that redirects to the homepage if the user is logged in.
 */
export const withHomeRedirect = withAuthRedirect('/', true)
