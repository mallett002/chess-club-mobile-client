import React from 'react';
import {TouchableOpacity, Text, View, Platform, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';


const getTabBarStyles = () => {
  const styles = {
    height: 50
    // paddingBottom: 90
  };

  if (Platform.OS === 'ios') {
    // styles.height = 90;
    // styles.paddingBottom = 23;
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
  bottomTabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    backgroundColor: 'gray'
  },
  tabCard: {
    borderColor: 'black',
    borderWidth: 1,
    alignItems: 'center'
    // borderTopWidth: 0,
    // height: 70,
    // paddingTop: 9,
    // paddingBottom: 9,
    // shadowColor: '#000',
    // shadowOpacity: 0.1,
    // shadowRadius: 20,
    // shadowOffset: { width: 0, height: 0 }
  }
})

export default function BottomTab({ state, descriptors, navigation }) {
  console.log(JSON.stringify({state, descriptors, navigation}, null, 2));
  return (
    <View style={[styles.bottomTabContainer, getTabBarStyles()]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name;
        const iconName = getIconName(label);

            console.log({label});

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
            key={label}
            style={styles.tabCard}
          >
            <Text style={{ color: isFocused ? '#673ab7' : '#222' }}>
              {label}
            </Text>
            <Icon name={iconName} size={28} color={'black'} />
          </TouchableOpacity>
        );
      })}
    </View>
  );
}
