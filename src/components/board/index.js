import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';

import colors from '../../constants/colors';
import Cell from './cell';

function Board({ positions, moves: serverMoves, updateBoard, playersTurn }) {
  const [moves, setMoves] = useState(null);
  const [validMoves, setValidMoves] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);

  useEffect(() => {
    if (playersTurn) {
      let movesList = null;
      const validMovesLookup = {};

      if (serverMoves) {
        movesList = serverMoves;
        for (move of serverMoves) {
          if (!validMovesLookup[move.from]) {
            validMovesLookup[move.from] = new Set();
          }

          validMovesLookup[move.from].add(move.to);
        }
      }

      setMoves(movesList);
      setValidMoves(validMovesLookup);
    }
  }, [positions, serverMoves]);

  const onCellSelect = async (newCell) => {
    if (playersTurn) {
      let label = null;

      if (selectedCell) {
        if (newCell !== selectedCell && validMoves[selectedCell].has(newCell)) {
          const toCell = newCell;
          const fromCell = selectedCell;
          const moveToCellDomain = moves.find((cellMove) => cellMove.from === fromCell && cellMove.to === toCell);

          await updateBoard(moveToCellDomain.san);
        }
      } else {
        label = newCell;
      }

      setSelectedCell(label);
    }
  };

  const renderItem = ({ item }) => {
    const styles = {};
    let isSelected = false;

    if (selectedCell === item.label) {
      isSelected = true;
    }

    if (selectedCell && validMoves[selectedCell]) {
      if (validMoves[selectedCell].has(item.label)) {
        styles.backgroundColor = colors.DESTINATION_CELL;
      }
    }

    return (
      <Cell
        playersTurn={playersTurn}
        isSelected={isSelected}
        cell={item}
        destinationStyles={styles}
        onPress={onCellSelect}
      />
    );
  };

  return (
    <View>
      <FlatList
        numColumns={8}
        data={positions}
        renderItem={renderItem}
        keyExtractor={cell => cell.label}
        extraData={selectedCell}
      />
    </View>
  );
}

export default Board;
