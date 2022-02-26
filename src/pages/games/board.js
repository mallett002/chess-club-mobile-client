import React, { useContext, useState } from 'react';
import { Text, View, StyleSheet, ActivityIndicator } from 'react-native';
import { RUSSIAN } from '../../constants/colors';
import { TouchableOpacity } from 'react-native-gesture-handler';

// import { AppContext } from '../../utils/context';
// import { removeTokenFromStorage } from '../../utils/token-utils';
// import Loading from '../../components/loading';

function Board(props) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: RUSSIAN.ORANGE }]}
        onPress={() => props.navigation.goBack()}
      >
        <Text style={{ color: RUSSIAN.WHITE }}>{'go back'}</Text>
      </TouchableOpacity>
      <Text style={styles.text}>{'Board'}</Text>
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
  }
});

export default Board;
