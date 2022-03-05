import React, { useContext, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Text, View, StyleSheet, SafeAreaView } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { TouchableOpacity } from 'react-native-gesture-handler';

import colors, { RUSSIAN } from '../../constants/colors';
import { GET_BOARD_QUERY, UPDATE_BOARD_MUTATION } from '../../constants/queries';
import Loading from '../../components/loading';
import { AppContext } from '../../utils/context';
import Board from '../../components/board';

function getTurnText(playerId, turn, opponentUsername) {
  if (playerId === turn) {
    return 'My turn';
  }

  return `${opponentUsername}'s turn`;
}

function BoardScreen(props) {
  const { playerId } = useContext(AppContext);
  const { gameId } = props.route.params;
  const { data, error, loading: loadingBoard } = useQuery(GET_BOARD_QUERY, { variables: { gameId } });
  const [updateBoardMutation, { data: updateBoardData, error: updateBoardError }] = useMutation(UPDATE_BOARD_MUTATION);

  if (loadingBoard) {
    return <Loading screen={'Board'} />
  }

  const { status, moves, turn, opponentUsername, positions, playerOne } = data.getBoard;
  const updateBoard = (cell) => updateBoardMutation({
    variables: {
      gameId,
      cell
    }
  });

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.header}>
        <TouchableOpacity
          style={{ marginRight: 16 }}
          onPress={() => props.navigation.goBack()}
        >
          <Feather
            name={'x'}
            size={28}
            color={RUSSIAN.GRAY}
          />
        </TouchableOpacity>
        <Text style={styles.title}>{`Game against ${opponentUsername}`}</Text>
      </View>
      <View style={styles.gameStatus}>
        <Text style={styles.oponentText}>{getTurnText(playerId, turn, opponentUsername)}</Text>
        {
          status === 'CHECK' &&
          <View style={styles.gameAlert}>
            <Text style={styles.alertText}>{'Check!'}</Text>
          </View>
        }
      </View>
      <View style={styles.fallenSoldiers}></View>
      <Board
        playersTurn={turn === playerId}
        updateBoard={updateBoard}
        positions={positions}
        moves={moves}
        gameId={gameId}
      />
      <View style={styles.fallenSoldiers}></View>
      {/* <GameActions /> */}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: RUSSIAN.DARK,
    marginBottom: 16,
    height: '100%'
  },
  header: {
    marginLeft: 8,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 16
  },
  title: {
    fontSize: 24,
    color: RUSSIAN.GREEN
  },
  oponentText: {
    color: RUSSIAN.LIGHT_GRAY,
    paddingHorizontal: 12
  },
  gameStatus: {
    minHeight: 70,
  },
  gameAlert: {
    borderWidth: 2,
    borderColor: colors.DARK_ORANGE,
    backgroundColor: colors.LIGHT_PEACH,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertText: {
    color: colors.DARK_ORANGE,
    fontSize: 20
  },
  fallenSoldiers: {
    height: 40,
    backgroundColor: RUSSIAN.DARK_GRAY
  }
});

export default BoardScreen;
