import { ApolloClient, InMemoryCache, createHttpLink } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { getTokenFromStorage } from '../utils/token-utils';

const httpLink = createHttpLink({
  uri: 'http://192.168.0.220:4000/graphql',
});
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
  link: authLink.concat(httpLink),
});
