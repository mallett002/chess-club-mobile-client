import React from 'react';
import { Dimensions, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { RUSSIAN } from '../../constants/colors';
import { PIECES } from '../../constants/board-helpers';

const calculatedMargin = (Dimensions.get('window').width) / 70;

function FallenSoldiers({pieces, color}) {
  return (
    <View style={styles.fallenSoldiers}>
      {pieces.map((piece, i) => (
        <Icon
          key={i}
          style={styles.piece}
          color={color}
          name={PIECES[piece]}
          size={20}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  fallenSoldiers: {
    height: 40,
    flexDirection: 'row',
    backgroundColor: RUSSIAN.DARK_GRAY,
    alignItems: 'center',
    paddingHorizontal: 8
  },
  piece: {
    marginRight: calculatedMargin
  }
});

export default FallenSoldiers;
