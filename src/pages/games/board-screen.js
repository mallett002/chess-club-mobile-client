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
import {getIndexForLabel} from '../../constants/board-helpers';

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
  const [selectedCell, setSelectedCell] = useState('');
  const [replacedCell, setReplacedCell] = useState(null);

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

  const updatePositionforPendingMove = (newCell) => {
    setBoardPositions((positions) => {
      const fromCellIndex = getIndexForLabel(positions, selectedCell);
      const newCellIndex = getIndexForLabel(positions, newCell.label);
      const selectedCellContents = positions[fromCellIndex];

      setReplacedCell(newCell); // Store off what was there before
      // The new toCell: (The position of the pendingMove)
      const pendingNewPosition = {
        label: newCell.label, // where it's at on the board
        color: selectedCellContents.color, // new color
        type: selectedCellContents.type // new piece
      };

      // The new FromCell: Where the piece was. Will always be empty.
      const oldCellForMove = {
        label: selectedCellContents.label,
        color: null,
        type: null
      };
      const copy = positions.slice();

      copy.splice(newCellIndex, 1, pendingNewPosition);
      copy.splice(fromCellIndex, 1, oldCellForMove);

      return copy;
    });
  };

  const cancelPendingMove = () => {
    // Todo: use the "replacedCell" piece of state to set things back the way they were.
    setBoardPositions((positions) => {
      const selectedCellIndex = getIndexForLabel(positions, selectedCell);
      const pendingMoveIndex = getIndexForLabel(positions, pendingMove);
      const selectedCellContents = positions[selectedCellIndex];
      const pendingMoveCellContents = positions[pendingMoveIndex];
      const restoredMoveToCell = {
        label: selectedCell,
        color: pendingMoveCellContents.color,
        type: pendingMoveCellContents.type
      };
      const restoredSelectedCell = {
        label: pendingMoveCellContents.label,
        color: selectedCellContents.color,
        type: selectedCellContents.type
      };

      const copy = positions.slice();

      copy.splice(selectedCellIndex, 1, restoredMoveToCell);
      copy.splice(pendingMoveIndex, 1, restoredSelectedCell);

      return copy;
    });
    
    // Set the pending move back to ''
    setPendingMove('');
    // set the selected piece back to ''
    setSelectedCell('');
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
        updatePosition={updatePositionforPendingMove}
        setPendingMove={setPendingMove}
        playerColor={playerOne === playerId ? 'w' : 'b'}
        playersTurn={turn === playerId}
        updateBoard={updateBoard}
        positions={boardPositions}
        selectedCell={selectedCell}
        setSelectedCell={setSelectedCell}
        moves={moves}
        gameId={gameId}
      />
      <View style={styles.fallenSoldiers}></View>
      {
        selectedCell && pendingMove ?
          <GameActions
            exitMove={cancelPendingMove}
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
