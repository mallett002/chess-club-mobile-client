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

  const getIsDisabledCell = (newCell) => {
    // Disabled if:
      // !playersTurn
      // item.color !== playerColor (not one of your pieces)
      // if selectedCell:
        // !oneOfMoves || !self

  if (!playersTurn) {
    return true;
  }

  if (selectedCell) {
    // 
    // can select self (to deselect) || move
      // self: newCell.label === selectedCell
      // move: validMoves[selectedCell].has(newCell.label)
      // if (newCell.label === selectedCell || validMoves[selectedCell].has(newCell.label)) {
      //   return false;
      // }

      if (validMoves[selectedCell].has(newCell.label)) {
        return false;
      }
      
      if (newCell.label) {
        if (newCell.color !== playerColor && !validMoves[selectedCell].has(newCell.label)) {
          return true;
        }

        if (newCell.color === playerColor && newCell.label !== selectedCell) {
          return true
        }

        return validMoves[selectedCell].has(newCell.label);
      }
  }

  // not selectedCell
  // Can only select your pieces
  return !newCell.color || newCell.color !== playerColor;
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
