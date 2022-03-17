import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client';
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { setContext } from '@apollo/client/link/context';
import { getTokenFromStorage } from '../utils/token-utils';

const wsLink = new GraphQLWsLink(createClient({
  url: 'ws://[redacted]/graphql',
  // connectionParams: {
  //   authToken: user.authToken,
  // }
}));

const httpLink = createHttpLink({
  uri: 'http://[redacted]/graphql',
});

const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    );
  },
  wsLink,
  httpLink,
);

const authLink = setContext(async () => {
  const headers = { authorization: '' };
  const storageToken = await getTokenFromStorage()

  if (storageToken) {
    headers.authorization = storageToken;
  }

  return { headers }
});

export const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: authLink.concat(splitLink),
});
