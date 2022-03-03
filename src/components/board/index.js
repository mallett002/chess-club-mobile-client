import React, { useEffect, useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { Text, View, StyleSheet, FlatList } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import { TouchableOpacity } from 'react-native-gesture-handler';

import colors, { RUSSIAN } from '../../constants/colors';
import Cell from './cell';

function Board({ positions, moves: serverMoves }) {
  const [moves, setMoves] = useState(null);
  const [validMoves, setValidMoves] = useState(null);
  const [selectedCell, setSelectedCell] = useState(null);
  // const { gameId } = route.params;
  // const [ movePieceMutation, { data: movePieceData, error: movePieceError } ] = useMutation(MOVE_PIECE_MUTATION);

  useEffect(() => {
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
  }, [positions, serverMoves]);

  const onCellSelect = async (newCell) => {
    let label = null;

    if (selectedCell) {
      if (newCell !== selectedCell && validMoves[selectedCell].has(newCell)) {
        const toCell = newCell;
        const fromCell = selectedCell;
        const moveToCellDomain = serverMoves.find((cellMove) => cellMove.from === fromCell && cellMove.to === toCell);

        // await movePieceMutation({
        //   variables: {
        //     gameId,
        //     cell: moveToCellDomain.san
        //   }
        // });
      }
    } else {
      label = newCell;
    }

    setSelectedCell(label);
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
        isSelected={isSelected}
        cell={item}
        destinationStyles={styles}
        onPress={onCellSelect}
      />
    );
  };

  return (
    <View style={styles.wrapper}>
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

const styles = StyleSheet.create({
  wrapper: {
    // marginTop: 40
  }
});

export default Board;
