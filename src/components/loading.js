import React from 'react';
import { SafeAreaView, Text, View, ActivityIndicator, StyleSheet } from 'react-native';

import {RUSSIAN} from '../constants/colors';

function Loading({ screen }) {
  const loadingText = screen ? `Loading ${screen}` : 'Loading...';

  return (
    <SafeAreaView style={styles.wrapper}>
      <View style={styles.loadingContainer}>
        <Text
          style={styles.text}
        >
          {loadingText}
        </Text>
        <ActivityIndicator
          color={RUSSIAN.GREEN}
          size={'large'}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: RUSSIAN.DARK,
    paddingHorizontal: 16,
    height: '100%'
  },
  loadingContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: RUSSIAN.DARK,
    height: '100%'
  },
  text: {
    marginRight: 16,
    color: RUSSIAN.LIGHT_GRAY,
    fontSize: 24
  }
});


export default Loading;