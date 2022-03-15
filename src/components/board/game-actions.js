import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RUSSIAN } from '../../constants/colors';

function GameActions(props) {
  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{'Accept move?'}</Text>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          onPress={props.exitMove}
          style={[styles.button, { backgroundColor: RUSSIAN.ORANGE }]}
        >
          <Text style={styles.buttonText}>{'Cancel'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={props.updateBoard}
          style={[styles.button, { backgroundColor: RUSSIAN.GREEN }]}
        >
          <Text style={styles.buttonText}>{'Accept'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    // paddingLeft: 'center'
  },
  title: {
    color: RUSSIAN.LIGHT_GRAY,
    fontSize: 16,
    marginLeft: 8,
    marginBottom: 20
  },
  buttonGroup: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
    paddingHorizontal: 8
  },
  button: {
    borderRadius: 14,
    width: 150,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center'
  },
  buttonText: {
    color: RUSSIAN.WHITE
  }
});

export default GameActions;
