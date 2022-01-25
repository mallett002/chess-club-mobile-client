import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';

export const client = new ApolloClient({
  uri: 'http://redacted/graphql',
  cache: new InMemoryCache(),
});
