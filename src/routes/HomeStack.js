import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Dashboard from '../pages/Dashboard';
import ViewDetails from '../pages/ViewDetails';
import NotificationViewOrderDetails from '../pages/NotificationViewOrderDetails';

const HomeStack = createStackNavigator();

const HomeStackScreens = ({navigation}) => (
  <HomeStack.Navigator>
    <HomeStack.Screen name="Dashboard" component={Dashboard} />
    <HomeStack.Screen name="ViewDetails" component={ViewDetails} />
    <HomeStack.Screen
      name="NotificationViewDetails"
      component={NotificationViewOrderDetails}
    />
  </HomeStack.Navigator>
);

export default HomeStackScreens;
