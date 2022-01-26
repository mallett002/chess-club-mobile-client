import { ApolloClient, InMemoryCache } from '@apollo/client';

export const client = new ApolloClient({
  uri: 'http://redacted:4000/graphql',
  cache: new InMemoryCache(),
});
