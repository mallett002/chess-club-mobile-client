import React, { useContext, useState, useEffect } from 'react';
import { useQuery, useMutation, useSubscription } from '@apollo/client';
import { Text, View, StyleSheet, SafeAreaView } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { TouchableOpacity } from 'react-native-gesture-handler';

import colors, { RUSSIAN } from '../../constants/colors';
import { GET_BOARD_QUERY, UPDATE_BOARD_MUTATION, BOARD_UPDATED_SUBSCRIPTION } from '../../constants/queries';
import Loading from '../../components/loading';
import { AppContext } from '../../utils/context';
import Board from '../../components/board';
import GameActions from '../../components/board/game-actions';
import { getIndexForLabel } from '../../constants/board-helpers';

function getTurnText(playerId, turn, opponentUsername) {
  if (playerId === turn) {
    return 'My turn';
  }

  return `${opponentUsername}'s turn`;
}

function BoardScreen(props) {
  const { playerId } = useContext(AppContext);
  const { gameId } = props.route.params;
  const { data: getBoardData, error, loading: loadingBoard, subscribeToMore } = useQuery(GET_BOARD_QUERY, {
    variables: { gameId },
    fetchPolicy: 'cache-and-network'
  });
  const [updateBoardMutation, { data: updateBoardData, error: updateBoardError }] = useMutation(UPDATE_BOARD_MUTATION);
  // const { data: subscriptionData, subscriptionLoading, error: subscriptionError } = useSubscription(BOARD_UPDATED_SUBSCRIPTION, { variables: { gameId } });

  const [boardPositions, setBoardPositions] = useState([]);
  const [pendingMove, setPendingMove] = useState('');
  const [selectedCell, setSelectedCell] = useState('');
  const [replacedCell, setReplacedCell] = useState(null);

  useEffect(() => {
    if (getBoardData && getBoardData.getBoard) {
      setBoardPositions(getBoardData.getBoard.positions);
    }

    console.log('subscribing to more.....');
    subscribeToMore({
      document: BOARD_UPDATED_SUBSCRIPTION,
      variables: { gameId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) return prev;
        const boardUpdatedData = subscriptionData.data.boardUpdated;

        console.log({subData: subscriptionData.data});

        return boardUpdatedData;
      }
    });
  }, [getBoardData]);

  if (!boardPositions.length) {
    return <Loading screen={'Board'} />
  }

  const { status, moves, turn, opponentUsername, positions, playerOne } = getBoardData.getBoard;
  const doUpdateBoardMutation = async (cell) => {
    await updateBoardMutation({
      variables: {
        gameId,
        cell
      }
    });

    setPendingMove('');
    setSelectedCell('');
    setReplacedCell(null);
  };

  const updatePositionforPendingMove = (newCell) => {
    setBoardPositions((positions) => {
      const oldSpotIndex = getIndexForLabel(positions, selectedCell);
      const newSpotIndex = getIndexForLabel(positions, newCell.label);
      const selectedCellContents = positions[oldSpotIndex];

      setReplacedCell(newCell);
      const newSpotStuff = {
        label: newCell.label,
        color: selectedCellContents.color,
        type: selectedCellContents.type
      };

      const oldSpotStuff = {
        label: selectedCellContents.label,
        color: null,
        type: null
      };
      const copy = positions.slice();

      copy.splice(newSpotIndex, 1, newSpotStuff);
      copy.splice(oldSpotIndex, 1, oldSpotStuff);

      return copy;
    });
  };

  const cancelPendingMove = () => {
    setBoardPositions((positions) => {
      const oldSpotIndex = getIndexForLabel(positions, selectedCell);
      const newSpotIndex = getIndexForLabel(positions, pendingMove);
      const pendingMoveCellContents = positions[newSpotIndex];
      const restoredOldSpot = {
        label: selectedCell,
        color: pendingMoveCellContents.color,
        type: pendingMoveCellContents.type
      };

      const copy = positions.slice();

      copy.splice(oldSpotIndex, 1, restoredOldSpot);
      copy.splice(newSpotIndex, 1, replacedCell);

      return copy;
    });

    setReplacedCell(null);
    setPendingMove('');
    setSelectedCell('');
  };

  const isPendingMove = selectedCell && pendingMove;

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
        updatePosition={updatePositionforPendingMove}
        setPendingMove={setPendingMove}
        isPendingMove={isPendingMove}
        playerColor={playerOne === playerId ? 'w' : 'b'}
        playersTurn={turn === playerId}
        positions={boardPositions}
        selectedCell={selectedCell}
        setSelectedCell={setSelectedCell}
        moves={moves}
        gameId={gameId}
      />
      <View style={styles.fallenSoldiers}></View>
      {
        isPendingMove ?
          <GameActions
            exitMove={cancelPendingMove}
            updateBoard={() => doUpdateBoardMutation(pendingMove)}
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
