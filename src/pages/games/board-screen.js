import React, { useContext, useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Text, View, StyleSheet, SafeAreaView } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { TouchableOpacity } from 'react-native-gesture-handler';

import colors, { RUSSIAN } from '../../constants/colors';
import { GET_BOARD_QUERY, UPDATE_BOARD_MUTATION, BOARD_UPDATED_SUBSCRIPTION, END_GAME_MUTATION } from '../../constants/queries';
import Loading from '../../components/loading';
import { AppContext } from '../../utils/context';
import Board from '../../components/board';
import GameActions from '../../components/board/game-actions';
import { getIndexForLabel } from '../../constants/board-helpers';
import FallenSoldiers from './fallen-soldiers';

function getTurnText(playerId, turn, opponentUsername, status) {
  if (status !== 'CHECKMATE') {
    if (playerId === turn) {
      return 'My turn';
    }
  
    return `${opponentUsername}'s turn`;
  }

  return '';
}

function getStatusText(status, playerId, turn, opponentUsername) {
  if (status === 'CHECK') {
    return 'Check!';
  } else {
    if (playerId === turn) {
      return `Checkmate! ${opponentUsername} has won the game.`;
    }

    return 'Checkmate! You have won the game.';
  }
  
  return '';  
}

function BoardScreen(props) {
  const { playerId } = useContext(AppContext);
  const { gameId } = props.route.params;
  const { data: getBoardData, error, loading: loadingBoard, subscribeToMore } = useQuery(GET_BOARD_QUERY, {
    variables: { gameId },
    fetchPolicy: 'network-only', // Todo: look at these "network-only's"
    onCompleted: () => setBoardPositions(getBoardData.getBoard.positions)
  });
  const [updateBoardMutation] = useMutation(UPDATE_BOARD_MUTATION);
  const [endGameMutation] = useMutation(END_GAME_MUTATION);
  const [boardPositions, setBoardPositions] = useState([]);
  const [pendingMove, setPendingMove] = useState(null);
  const [selectedCell, setSelectedCell] = useState('');
  const [replacedCell, setReplacedCell] = useState(null);

  useEffect(() => {
    const unsubscribe = subscribeToMore({
      document: BOARD_UPDATED_SUBSCRIPTION,
      variables: { gameId },
      updateQuery: (prev, { subscriptionData }) => {
        if (!subscriptionData.data) {
          return prev;
        }

        return Object.assign({}, prev, {
          getBoard: subscriptionData.data.boardUpdated
        });
      }
    });

    return () => {
      unsubscribe();
    }
  }, []);

  if (!boardPositions.length) {
    return <Loading screen={'Board'} />
  }

  const { status, moves, turn, opponentUsername, playerOne, fallenSoldiers } = getBoardData.getBoard;
  const playerColor = playerOne === playerId ? 'w' : 'b';
  const { playerOnePieces, playerTwoPieces } = fallenSoldiers;
  const isPendingMove = selectedCell && pendingMove;
  const isGameOver = status === 'CHECKMATE' || status === 'STALEMATE' || status === 'DRAW';

  const doUpdateBoardMutation = async () => {
    await updateBoardMutation({
      variables: {
        gameId,
        cell: pendingMove.san,
        captured: pendingMove.captured
      }
    });

    setPendingMove(null);
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
      const newSpotIndex = getIndexForLabel(positions, pendingMove.to);
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
    setPendingMove(null);
    setSelectedCell('');
  };

  const cancelNewGameInvite = async () => {
    await endGameMutation({
      variables: {
        gameId
      }
    });
    props.navigation.goBack();
  };

  const inviteNewGame = async () => {
    await endGameMutation({
      variables: {
        gameId
      }
    });
    props.navigation.navigate('INVITATION_FORM', {opponent: opponentUsername});
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
        <Text style={styles.oponentText}>{getTurnText(playerId, turn, opponentUsername, status)}</Text>
        {
          status !== 'PLAY' &&
          <View style={styles.gameAlert}>
            <Text style={styles.alertText}>{getStatusText(status, playerId, turn, opponentUsername)}</Text>
          </View>
        }
      </View>
      <FallenSoldiers
        color={playerColor === 'w' ? colors.BLACK_PIECE : colors.WHITE_PIECE}
        pieces={playerColor === 'w' ? playerTwoPieces : playerOnePieces} />
      <Board
        updatePosition={updatePositionforPendingMove}
        setPendingMove={setPendingMove}
        isPendingMove={isPendingMove}
        playerColor={playerColor}
        playersTurn={turn === playerId}
        positions={boardPositions}
        selectedCell={selectedCell}
        setSelectedCell={setSelectedCell}
        moves={moves}
        gameId={gameId}
      />
      <FallenSoldiers
        color={playerColor === 'b' ? colors.BLACK_PIECE : colors.WHITE_PIECE}
        pieces={playerColor === 'b' ? playerTwoPieces : playerOnePieces} />
      {
        isPendingMove || isGameOver ?
          <GameActions
            exitMove={cancelPendingMove}
            cancelNewGameInvite={cancelNewGameInvite}
            inviteNewGame={inviteNewGame}
            opponentUsername={opponentUsername}
            isGameOver={isGameOver}
            updateBoard={() => doUpdateBoardMutation()}
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
    borderTopWidth: 2,
    borderBottomWidth: 2,
    borderTopColor: colors.DARK_ORANGE,
    borderBottomColor: colors.DARK_ORANGE,
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
