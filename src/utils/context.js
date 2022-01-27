import {createContext} from 'react';

export const AppContext = createContext({
  accessToken: '',
  setAccessToken: () => {},
  username: '',
  setUsername: () => {},
  playerId: '',
  setPlayerId: () => {}
});
