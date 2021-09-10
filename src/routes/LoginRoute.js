import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../pages/Login';
import ForgotPassword from '../pages/forgotPassword';

const LoginStack = createStackNavigator();

const LoginStackScreens = ({navigation}) => (
  <LoginStack.Navigator headerMode="none">
    <LoginStack.Screen name="Login" component={Login} />
    <LoginStack.Screen name="ForgotPassword" component={ForgotPassword} />
  </LoginStack.Navigator>
);

export default LoginStackScreens;
