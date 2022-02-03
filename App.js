import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { ApolloProvider } from '@apollo/client';

import SignUpScreen from './src/pages/auth/sign-up';
import LogInScreen from './src/pages/auth/log-in';
import GamesScreen from './src/pages/games/games-screen';
import ProfileScreen from './src/pages/profile/profile-screen';
import InvitationsScreen from './src/pages/invitations/invitations-screen';
import BottomTab from './src/components/nav/bottom-tab';
import { client } from './src/utils/gql-client';
import { AppContext } from './src/utils/context';
import { getTokenFromStorage, decodeJwt } from './src/utils/token-utils';

// Ignore this log:
import { LogBox } from 'react-native';
LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
]);

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function LoggedInTabScreens() {
  return (
    <Tab.Navigator tabBar={props => <BottomTab {...props} />}
    >
      <Tab.Screen name='Games' component={GamesScreen} />
      <Tab.Screen name='Profile' component={ProfileScreen} />
      <Tab.Screen name='Invitations' component={InvitationsScreen} />
    </Tab.Navigator>
  );
}

function App() {
  const [accessToken, setAccessToken] = useState('');
  const [username, setUsername] = useState('');
  const [playerId, setPlayerId] = useState('');
  const context = {
    accessToken,
    setAccessToken,
    username,
    setUsername,
    playerId,
    setPlayerId
  };

  useEffect(() => {
    const persistAuthState = async () => {
      if (!accessToken) {
        const storageToken = await getTokenFromStorage();

        if (storageToken) {
          const { sub, playerId } = await decodeJwt(storageToken);

          setAccessToken(storageToken);
          setUsername(sub);
          setPlayerId(playerId);
        }
      }
    };

    persistAuthState();
  }, [accessToken]);

  return (
    <AppContext.Provider value={context}>
      <ApolloProvider client={client}>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false
            }}
          >
            {accessToken ? (
              <Stack.Screen name="LoggedInScreens" component={LoggedInTabScreens} />
            ) : (
              <>
                <Stack.Screen name="LOGIN" component={LogInScreen} />
                <Stack.Screen name="SIGNUP" component={SignUpScreen} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </ApolloProvider>
    </AppContext.Provider>
  );
}

export default App;
