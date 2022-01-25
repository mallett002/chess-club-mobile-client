import React from 'react';
import {TouchableOpacity, Text, View, Platform, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

import colors from '../../constants/colors';

const getTabBarStyles = () => {
  const styles = {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    height: 70,
    backgroundColor: colors.CHARCOAL,
    borderTopColor: colors.DARK_CHARCOAL,
    borderTopWidth: 1,
    paddingVertical: 20
  };

  if (Platform.OS === 'ios') {
    styles.height = 90;
    styles.paddingBottom = 28;
  }

  return styles;
};

function getIconName(label) {
  if (label === 'Games') {
    return 'activity'
  } else if (label === 'Profile') {
    return 'user'
  }

  return 'mail';
}

const styles = StyleSheet.create({
  tabCard: {
    borderRightColor: colors.DARK_CHARCOAL,
    borderRightWidth: 1,
    alignItems: 'center',
    flex: 1
  }
})

export default function BottomTab({ state, descriptors, navigation }) {
  return (
    <View style={getTabBarStyles()}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const iconName = getIconName(route.name);
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            // The `merge: true` option makes sure that the params inside the tab screen are preserved
            navigation.navigate({ name: route.name, merge: true });
          }
        };

        const onLongPress = () => {
          navigation.emit({
            type: 'tabLongPress',
            target: route.key,
          });
        };

        return (
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            onLongPress={onLongPress}
            key={route.name}
            style={styles.tabCard}
          >
            <Text style={{ color: isFocused ? colors.PINK : colors.WHITE }}>
              {route.name}
            </Text>
            <Icon name={iconName} size={28} color={isFocused ? colors.PINK : colors.WHITE} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
