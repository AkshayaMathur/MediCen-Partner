import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../pages/Login';

const LoginStack = createStackNavigator();

const LoginStackScreens = ({navigation}) => (
  <LoginStack.Navigator headerMode="none">
    <LoginStack.Screen name="Login" component={Login} />
  </LoginStack.Navigator>
);

export default LoginStackScreens;
