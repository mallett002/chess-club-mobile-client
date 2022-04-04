import React from 'react';
import { Text, View, StyleSheet } from 'react-native';

import { RUSSIAN } from '../../constants/colors';

function FallenSoldiers({pieces}) {
  return (
    <View style={styles.fallenSoldiers}>
      {pieces.map((piece) => <Text>{piece}</Text>)}
    </View>
  )
}

const styles = StyleSheet.create({
  fallenSoldiers: {
    height: 40,
    backgroundColor: RUSSIAN.DARK_GRAY
  }
});

export default FallenSoldiers;
