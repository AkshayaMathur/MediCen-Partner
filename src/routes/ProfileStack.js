import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ProfileScreen from '../pages/ProfileScreen';

const ProfileStack = createStackNavigator();

const ProfileStackScreens = ({navigation}) => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen name="Profile" component={ProfileScreen} />
  </ProfileStack.Navigator>
);

export default ProfileStackScreens;
