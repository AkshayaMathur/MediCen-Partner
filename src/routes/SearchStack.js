import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SearchPage from '../pages/SearchPage';
import UploadPrescription from '../pages/UploadPrescription';

const SearchStack = createStackNavigator();

const SearchStackScreens = ({navigation}) => (
  <SearchStack.Navigator screenOptions={{headerShown: false}}>
    <SearchStack.Screen
      name="SearchPage"
      component={SearchPage}
      options={{
        headerShown: false,
      }}
    />
  </SearchStack.Navigator>
);

export default SearchStackScreens;
