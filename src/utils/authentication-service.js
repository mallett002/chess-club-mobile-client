import { useContext, useEffect } from 'react';

import { AppContext } from './context';
import { persistTokenInStorage, decodeJwt } from './token-utils';

export async function authenticateUser(token, setAccessToken, setUsername, setPlayerId) {
  await persistTokenInStorage(token);
  const { sub, playerId } = await decodeJwt(token);

  setAccessToken(token);
  setUsername(sub);
  setPlayerId(playerId);
}

export const useAuthentication = (data) => {
  const { setAccessToken, setUsername, setPlayerId } = useContext(AppContext);

  useEffect(() => {
    const setUser = async (token) => {
      await authenticateUser(token, setAccessToken, setUsername, setPlayerId);
    };

    if (data && data.createPlayer && data.createPlayer.token) {
      setUser(data.createPlayer.token);
    }
  }, [data]);
};

export async function logInFetch(username, password) {
  // todo: redact
  const response = await fetch('http://192.168.0.220:4000/login', {
    method: 'POST',
    body: JSON.stringify({
      username,
      password
    }),
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });

  if (!response || !response.ok) {
    return null;
  }

  const json = await response.json();

  return json.token;
}
