import React from 'react';
import { View, TouchableOpacity, Dimensions } from 'react-native';
// import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { PIECES, fileToIndex } from '../../constants/board-helpers';
import colors, {RUSSIAN} from '../../constants/colors';

const cellWidth = (Dimensions.get('window').width) / 8;

const getFile = (str) => str.match(/\w/)[0];
const getRank = (str) => str.match(/(\d)/)[0];

const getBackgroundColor = (label, isSelected) => {
  if (isSelected) {
    return colors.LIGHT;
  }

  const file = getFile(label);
  const rank = parseInt(getRank(label), 10);
  const fileIndex = parseInt(fileToIndex[file], 10);
  const isDark = (rank + fileIndex - 1) % 2 === 0;

  if (isDark) {
    return colors.DARK_CELL;
  }

  return colors.LIGHT_CELL;
};

const generateCellStyle = (label, isSelected, destinationStyles) => {
  const styles = {
    backgroundColor: getBackgroundColor(label, isSelected),
    height: cellWidth,
    width: cellWidth,
    ...destinationStyles
  };

  return styles;
};

const Cell = ({ isSelected, cell, onPress, destinationStyles}) => {
  return (
    <View>
      <TouchableOpacity
        onPress={async () => await onPress(cell.label)}
        style={generateCellStyle(cell.label, isSelected, destinationStyles)}>
        {/* {cell && cell.type && <Icon
          color={cell.color === 'b' ? colors.BLACK_PIECE : colors.WHITE_PIECE}
          name={PIECES[cell.type]}
          size={cellWidth}
        />} */}
      </TouchableOpacity>
    </View>
  );
};

export default Cell;