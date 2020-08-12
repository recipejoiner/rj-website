import { createUploadLink } from 'apollo-upload-client'
import { ApolloClient, InMemoryCache, ApolloLink } from '@apollo/client'

const link = createUploadLink({
  uri: process.env.NEXT_PUBLIC_RECIPEJOINER_API,
})

const client = new ApolloClient({
  link: (link as unknown) as ApolloLink, // see: https://github.com/jaydenseric/apollo-upload-client/issues/213#issuecomment-670089925
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
