import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import SignUpScreen from './src/pages/auth/sign-up';
import LogInScreen from './src/pages/auth/log-in';
import GamesScreen from './src/pages/games/games-screen';
import ProfileScreen from './src/pages/profile/profile-screen';
import InvitationsScreen from './src/pages/invitations/invitations-screen';

// Ignore this log:
import { LogBox } from 'react-native';
LogBox.ignoreLogs([
  "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
]);

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const getTabBarStyles = () => {
  const styles = {
    borderTopWidth: 0,
    height: 70,
    paddingTop: 9,
    paddingBottom: 9,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 0 }
  };

  if (Platform.OS === 'ios') {
    styles.height = 90;
    styles.paddingBottom = 23;
  }

  return styles;
};

function LoggedInTabScreens() {
  return (
    <Tab.Navigator
      // screenOptions={tabScreenOptions}
      style={{ padding: 10 }}
      screenOptions={{
        tabBarActiveTintColor: 'tomato',
        tabBarInactiveTintColor: 'gray',
        sttabBarStyleyle: getTabBarStyles()
      }}
    >
      <Tab.Screen name='GAMES' component={GamesScreen} />
      <Tab.Screen name='PROFILE' component={ProfileScreen} />
      <Tab.Screen name='INVITATIONS' component={InvitationsScreen} />
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
