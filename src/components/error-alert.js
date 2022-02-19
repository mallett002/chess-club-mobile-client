import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import Feather from 'react-native-vector-icons/Feather';
import colors, { RUSSIAN } from '../constants/colors';

export default function ({setError, invitationError}) {
  return (
    <View style={styles.errorContainer}>
      <Feather
        name={'alert-triangle'}
        size={24}
        color={RUSSIAN.MAROON}
      />
      <Text style={styles.inputError}>{invitationError}</Text>
      <TouchableOpacity
        onPress={() => setError(false)}
      >
        <Feather
          name={'x'}
          size={24}
          color={RUSSIAN.MAROON}
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  errorContainer: {
    borderWidth: 2,
    borderColor: RUSSIAN.MAROON,
    backgroundColor: colors.HIGHLIGHT,
    paddingVertical: 12,
    paddingHorizontal: 6,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8
  },
  inputError: {
    color: RUSSIAN.WHITE,
    fontSize: 13
  }
});

