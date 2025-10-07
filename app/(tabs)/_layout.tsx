import { Tabs } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarIcon: ({ focused }) => {
          let iconName = '';

          switch (route.name) {
            case 'index':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'music':
              iconName = focused ? 'musical-notes' : 'musical-notes-outline';
              break;
            case 'favorites':
              iconName = focused ? 'heart' : 'heart-outline';
              break;
            case 'location':
              iconName = focused ? 'location' : 'location-outline';
              break;
          }

          return (
            <View style={styles.iconContainer}>
              <Icon
                name={iconName}
                size={26}
                color={focused ? '#836FFF' : '#9BA3AF'}
              />
            </View>
          );
        },
      })}
    />
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 10,
    left: 20,
    right: 20,
    elevation: 5,
    backgroundColor: '#111132',
    borderRadius: 30,
    height: 70,
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    justifyContent: 'center',
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    top: 15,
  },
});
