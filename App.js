import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import SignUpScreen from './src/pages/auth/sign-up';
import LogInScreen from './src/pages/auth/log-in';
import GamesScreen from './src/pages/games/games-screen';
import ProfileScreen from './src/pages/profile/profile-screen';
import InvitationsScreen from './src/pages/invitations/invitations-screen';
import BottomTab from './src/components/nav/bottom-tab';

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
  const accessToken = true;

  return (
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
  );
}

export default App;
