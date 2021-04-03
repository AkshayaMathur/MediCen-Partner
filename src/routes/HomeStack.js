import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Dashboard from '../pages/Dashboard';
import ViewDetails from '../pages/ViewDetails';

const HomeStack = createStackNavigator();

const HomeStackScreens = ({navigation}) => (
  <HomeStack.Navigator>
    <HomeStack.Screen name="Dashboard" component={Dashboard} />
    <HomeStack.Screen name="ViewDetails" component={ViewDetails} />
  </HomeStack.Navigator>
);

export default HomeStackScreens;
