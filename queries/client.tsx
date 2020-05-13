import ApolloClient from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';

const client = new ApolloClient({
  link: createHttpLink({uri: process.env.RECIPEJOINER_API}),
  cache: new InMemoryCache()
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

export default client;