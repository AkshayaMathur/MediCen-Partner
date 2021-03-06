import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import HomeStackScreens from './HomeStack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import themes from '../themes';
import ProfileStackScreens from './ProfileStack';
import SearchStackScreens from './SearchStack';
import {tabAuthContext} from '../components/tab_context';
import {Image} from 'react-native';
import ResearchStackScreens from './ResearchStack';
const BottomTab = createBottomTabNavigator();

const BottomTabScreens = ({navigation}) => (
  <tabAuthContext.Provider value={navigation}>
    <BottomTab.Navigator
      tabBarOptions={{
        activeTintColor: themes.GREEN_BLUE,
        showLabel: false,
        lazy: true,
        detachInactiveScreens: true,
        keyboardHidesTabBar: true,
      }}>
      <BottomTab.Screen
        name="HomeStackScreen"
        component={HomeStackScreens}
        unmountOnBlur={true}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <BottomTab.Screen
        name="SearchScreen"
        component={SearchStackScreens}
        unmountOnBlur={true}
        options={{
          unmountOnBlur: true,
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name="search" color={color} size={size} />
          ),
        }}
        listeners={({navigation}) => ({
          tabPress: (e) => {
            // Prevent default action
            e.preventDefault();
            navigation.navigate('SearchScreen', {
              screen: 'SearchPage',
              params: {opensearch: true},
            });
          },
        })}
      />
      <BottomTab.Screen
        name="ResearchScreen"
        component={ResearchStackScreens}
        options={{
          tabBarIcon: ({color, size}) => (
            <MaterialIcons name="analytics" color={color} size={size} />
          ),
        }}
      />
      <BottomTab.Screen
        name="AccountScreen"
        component={ProfileStackScreens}
        unmountOnBlur={true}
        options={{
          unmountOnBlur: true,
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
