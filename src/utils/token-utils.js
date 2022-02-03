import jwt_decode from 'jwt-decode'
import AsyncStorage from '@react-native-async-storage/async-storage';

export async function persistTokenInStorage(token) {
  try {
    await AsyncStorage.setItem('token', token);

    return token;
  } catch (error) {
    console.log({error});
  }
}

export async function removeTokenFromStorage() {
  try {
    await AsyncStorage.removeItem('token');
  } catch (error) {
    console.log({error});
  }
}

export async function getTokenFromStorage() {
  try {
    const token = await AsyncStorage.getItem('token');

    if (!token) {
      return null;
    }

    return token;
  } catch (error) {
    console.log({error});
  } 
}

export async function decodeJwt(accessToken) {
  const [, token] = accessToken.split(' ');

  return jwt_decode(token);
}
