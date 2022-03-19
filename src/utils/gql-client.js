import { ApolloClient, InMemoryCache, createHttpLink, split } from '@apollo/client';
import { GraphQLWsLink } from "@apollo/client/link/subscriptions";
import { createClient } from 'graphql-ws';
import { getMainDefinition } from '@apollo/client/utilities';
import { setContext } from '@apollo/client/link/context';

export function getClient(token) {
  const wsLink = new GraphQLWsLink(createClient({
    url: 'ws://192.168.0.220:4000/graphql',
    connectionParams: {
      authToken: token,
    },
  }));

  const httpLink = createHttpLink({
    uri: 'http://192.168.0.220:4000/graphql',
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

  const authLink = setContext(() => {
    return { headers: { authorization: token } };
  });

  return new ApolloClient({
    cache: new InMemoryCache(),
    link: authLink.concat(splitLink),
  });
}
