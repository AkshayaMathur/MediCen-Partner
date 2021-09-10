import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import SearchPage from '../pages/SearchPage';
import UploadPrescription from '../pages/UploadPrescription';
import ViewDetails from '../pages/ViewDetails';
import PatientReport from '../pages/PatientReport';

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
    <SearchStack.Screen name="ViewDetails" component={ViewDetails} />
    <SearchStack.Screen name="PatientReport" component={PatientReport} />
  </SearchStack.Navigator>
);

export default SearchStackScreens;
