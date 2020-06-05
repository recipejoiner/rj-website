import ApolloClient from 'apollo-client'
import 'node-fetch'
import { HttpLink, createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'

const client = new ApolloClient({
  link: new HttpLink({
    uri: process.env.NEXT_PUBLIC_RECIPEJOINER_API,
  }),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'ignore',
    },
    query: {
      fetchPolicy: 'no-cache',
      errorPolicy: 'all',
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
})

/* using the above query should look as follows:

client.query({
  query: MY_QUERY,
  context: {
    // example of setting the headers with context per operation
    headers: {
      authorization: `Bearer ${token}`
    }
  }
});
*/

interface errLoc {
  column: number
  line: number
}

export interface gqlError {
  locations?: Array<errLoc>
  message: string
  path?: Array<string>
}

export default client
