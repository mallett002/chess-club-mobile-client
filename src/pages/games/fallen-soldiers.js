import React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { RUSSIAN } from '../../constants/colors';
import { PIECES } from '../../constants/board-helpers';

function FallenSoldiers({pieces, color}) {
  return (
    <View style={styles.fallenSoldiers}>
      {pieces.map((piece, i) => (
        <Icon
          key={i}
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
  }
});

export default FallenSoldiers;
