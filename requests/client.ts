import { createUploadLink } from 'apollo-upload-client'
import ActionCableLink from 'graphql-ruby-client/dist/subscriptions/ActionCableLink' // https://github.com/rmosolgo/graphql-ruby/issues/2768
import { ApolloClient, InMemoryCache, ApolloLink, split } from '@apollo/client'
import { getMainDefinition } from '@apollo/client/utilities'
import { WebSocketLink } from '@apollo/client/link/ws'

if (typeof window !== 'undefined') {
  var ActionCable = require('@rails/actioncable')
}

const link = createUploadLink({
  uri: process.env.NEXT_PUBLIC_RECIPEJOINER_API,
})

const cable =
  typeof window !== 'undefined'
    ? ActionCable.createConsumer(
        process.env.NEXT_PUBLIC_RECIPEJOINER_API_CABLE || ''
      )
    : null

// see: https://github.com/jaydenseric/apollo-upload-client/issues/213#issuecomment-670089925
const httpLink = (link as unknown) as ApolloLink
const wsLink = cable
  ? ((new ActionCableLink({ cable }) as unknown) as ApolloLink)
  : null

// The split function takes three parameters:
//
// * A function that's called for each operation to execute
// * The Link to use for an operation if the function returns a "truthy" value
// * The Link to use for an operation if the function returns a "falsy" value
const splitLink = wsLink
  ? split(
      ({ query }) => {
        const definition = getMainDefinition(query)
        return (
          definition.kind === 'OperationDefinition' &&
          definition.operation === 'subscription'
        )
      },
      wsLink,
      httpLink
    )
  : httpLink

const client = new ApolloClient({
  link: splitLink,
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

export default client
