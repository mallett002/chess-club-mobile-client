import React, { useContext, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { RUSSIAN } from '../../constants/colors';

import { AppContext } from '../../utils/context';
import { removeTokenFromStorage } from '../../utils/token-utils';
import Loading from '../../components/loading';

function ProfileScreen() {
  const [loading, setLoading] = useState(false);
  const { setAccessToken, setUsername, setPlayerId, username, playerId } = useContext(AppContext);

  const logUserOut = async () => {
    setLoading(true);
    setAccessToken('');
    setUsername('');
    setPlayerId('');
    await removeTokenFromStorage();
    setLoading(false);
  };

  if (loading) {
    <Loading screen={'Profile'} />
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>{`Signed in as ${username}`}</Text>
      <Text style={styles.text}>{`PlayerId: ${playerId}`}</Text>
      <Text
        onPress={logUserOut}
        style={styles.logoutText}
      >
        {'Logout'}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    backgroundColor: RUSSIAN.LIGHT_GRAY
  },
  text: {
    color: RUSSIAN.DARK_GRAY
  },
  logoutText: {
    color: RUSSIAN.ORANGE
  }
});

export default ProfileScreen;
