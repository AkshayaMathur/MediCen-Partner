import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ProfileScreen from '../pages/ProfileScreen';
import EditProfile from '../pages/EditProfile';

const ProfileStack = createStackNavigator();

const ProfileStackScreens = ({navigation}) => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen name="Profile" component={ProfileScreen} />
    <ProfileStack.Screen name="EditAccount" component={EditProfile} />
  </ProfileStack.Navigator>
);

export default ProfileStackScreens;
