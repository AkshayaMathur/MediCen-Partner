import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Dashboard from '../pages/Dashboard';
// import Dashboard from '../pages/Dashboard1';
import ViewDetails from '../pages/ViewDetails';
import NotificationViewOrderDetails from '../pages/NotificationViewOrderDetails';
import themes from '../themes';

const HomeStack = createStackNavigator();

const HomeStackScreens = ({navigation}) => (
  <HomeStack.Navigator>
    <HomeStack.Screen
      name="Dashboard"
      component={Dashboard}
      options={{
        headerShown: false,
      }}
    />
    <HomeStack.Screen name="ViewDetails" component={ViewDetails} />
    <HomeStack.Screen
      name="NotificationViewDetails"
      component={NotificationViewOrderDetails}
    />
  </HomeStack.Navigator>
);

export default HomeStackScreens;
