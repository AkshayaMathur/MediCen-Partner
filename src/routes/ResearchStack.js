import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Research from '../pages/Research';

const ResearchStack = createStackNavigator();

const ResearchStackScreens = ({navigation}) => (
  <ResearchStack.Navigator>
    <ResearchStack.Screen
      name="ResearchScreen"
      component={Research}
      options={{
        headerShown: false,
      }}
    />
  </ResearchStack.Navigator>
);

export default ResearchStackScreens;
