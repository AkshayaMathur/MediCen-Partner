import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeStackScreens from './HomeStack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import themes from '../themes';
import ProfileStackScreens from './ProfileStack';
import SearchStackScreens from './SearchStack';
import {tabAuthContext} from '../components/tab_context';
const BottomTab = createBottomTabNavigator();

const BottomTabScreens = ({navigation}) => (
  <tabAuthContext.Provider value={navigation}>
    <BottomTab.Navigator
      tabBarOptions={{
        activeTintColor: themes.GREEN_BLUE,
        showLabel: false,
        lazy: true,
        detachInactiveScreens: true,
      }}>
      <BottomTab.Screen
        name="HomeStackScreen"
        component={HomeStackScreens}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <BottomTab.Screen
        name="SearchScreen"
        component={SearchStackScreens}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name="search" color={color} size={size} />
          ),
        }}
      />
      {/* <BottomTab.Screen
      name="NotificationScreen"
      component={HomeStackScreens}
      options={{
        tabBarIcon: ({color, size}) => (
          <MaterialCommunityIcons name="bell" color={color} size={size} />
        ),
      }}
    /> */}
      <BottomTab.Screen
        name="AccountScreen"
        component={ProfileStackScreens}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
      {/* <BottomTab.Screen name="HomeStackScreen" component={HomeStackScreens} /> */}
    </BottomTab.Navigator>
  </tabAuthContext.Provider>
);

export default BottomTabScreens;
// <Tab.Navigator>
//   <Tab.Screen name="Home" component={HomeStackScreen} />
//   {/* <Tab.Screen name="SettingsScreen" component={SettingsScreen} /> */}
//   <Tab.Screen name="Profile" component={ProfileStackScreen} />
// </Tab.Navigator>
