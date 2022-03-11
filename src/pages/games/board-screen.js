import React, { useContext, useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Text, View, StyleSheet, SafeAreaView } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { TouchableOpacity } from 'react-native-gesture-handler';

import colors, { RUSSIAN } from '../../constants/colors';
import { GET_BOARD_QUERY, UPDATE_BOARD_MUTATION } from '../../constants/queries';
import Loading from '../../components/loading';
import { AppContext } from '../../utils/context';
import Board from '../../components/board';
import GameActions from '../../components/board/game-actions';

function getTurnText(playerId, turn, opponentUsername) {
  if (playerId === turn) {
    return 'My turn';
  }

  return `${opponentUsername}'s turn`;
}

function BoardScreen(props) {
  const { playerId } = useContext(AppContext);
  const { gameId } = props.route.params;
  const { data: getBoardData, error, loading: loadingBoard } = useQuery(GET_BOARD_QUERY, {
    variables: { gameId },
    fetchPolicy: 'cache-first'
  });
  const [updateBoardMutation, { data: updateBoardData, error: updateBoardError }] = useMutation(UPDATE_BOARD_MUTATION);
  const [boardPositions, setBoardPositions] = useState([]);
  const [pendingMove, setPendingMove] = useState('');
  // TODO: Move the piece to the pending move position in state
  //       Then, call the mutation with the pending move when accept
  useEffect(() => {
    if (getBoardData && getBoardData.getBoard) {
      setBoardPositions(getBoardData.getBoard.positions);
    }
  }, [getBoardData, updateBoardData]);

  if (!boardPositions.length) {
    return <Loading screen={'Board'} />
  }

  const { status, moves, turn, opponentUsername, positions, playerOne } = getBoardData.getBoard;
  const updateBoard = (cell) => updateBoardMutation({
    variables: {
      gameId,
      cell
    }
  });

  const updatePosition = (newCell) => {
    console.log({newCell});
    let newCellIndex;

    for (let i = 0; i < boardPositions.length; i++) {
      const cell = boardPositions[i];

      if (cell.label === newCell.label) {
        newCellIndex = i;
        break;
      }
    }

    const positionsCopy = boardPositions.slice();
    console.log({b4: positionsCopy[newCellIndex].type});
    positionsCopy[newCellIndex] = newCell;
    console.log({after: positionsCopy[newCellIndex].type});

    // TODO: this isn't updating the position on the board... vv
    setBoardPositions(positionsCopy);
  };

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
        updatePosition={updatePosition}
        setPendingMove={setPendingMove}
        playerColor={playerOne === playerId ? 'w' : 'b'}
        playersTurn={turn === playerId}
        updateBoard={updateBoard}
        positions={boardPositions}
        moves={moves}
        gameId={gameId}
      />
      <View style={styles.fallenSoldiers}></View>
      {
        pendingMove ?
        <GameActions
          exitMove={() => setPendingMove('')}
          updateBoard={() => updateBoard(pendingMove)}
        /> : null
      }

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
