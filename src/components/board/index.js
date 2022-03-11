import React, { useEffect, useState } from 'react';
import { View, FlatList } from 'react-native';

import colors from '../../constants/colors';
import Cell from './cell';

function Board({ positions, moves: serverMoves, playersTurn, playerColor, setPendingMove, updatePosition }) {
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

  const onCellSelect = (newCell) => {
    if (playersTurn) {
      console.log({newCell, selectedCell});
      let label = null;

      if (selectedCell) {
        if (newCell.label !== selectedCell && validMoves[selectedCell].has(newCell.label)) {
          // const toCell = newCell.label;
          // const fromCell = selectedCell;
            // todo: Pull this out to a function: vv
          // const moveToCellDomain = moves.find((cellMove) => cellMove.from === fromCell && cellMove.to === toCell);

          // await movePieceMutation({
          //   variables: {
          //     gameId,
          //     cell: moveToCellDomain.san
          //   }
          // });
          updatePosition(newCell);
          setPendingMove(newCell.san);
        }
      } else {
        label = newCell.label;
      }

      setSelectedCell(label);
    }
  };

  const getIsDisabledCell = (cell) => {
    if (!playersTurn) {
      return true;
    }

    if (selectedCell) {
      if (cell.label === selectedCell || validMoves[selectedCell].has(cell.label)) {
        return false;
      }

      return true;
    }

    if (cell.color === playerColor) {
      return false;
    }

    return true;
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
        disabled={getIsDisabledCell(item)}
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
