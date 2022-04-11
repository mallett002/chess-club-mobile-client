import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { RUSSIAN } from '../../constants/colors';

function GameActions(props) {
  const cancelAction = props.isGameOver ? props.cancelNewGameInvite : props.exitMove;
  const acceptAction = props.isGameOver ? props.inviteNewGame : props.updateBoard;

  return (
    <View style={styles.wrapper}>
      <Text style={styles.title}>{props.isGameOver ? `Invite ${props.opponentUsername} to new game?` : 'Accept move?'}</Text>
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          onPress={cancelAction}
          style={[styles.button, { backgroundColor: RUSSIAN.ORANGE }]}
        >
          <Text style={styles.buttonText}>{'Cancel'}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={acceptAction}
          style={[styles.button, { backgroundColor: RUSSIAN.GREEN }]}
        >
          <Text style={styles.buttonText}>{props.isGameOver ? 'Invite' : 'Accept'}</Text>
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
    marginBottom: 20,
    marginTop: 2
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
