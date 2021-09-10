import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ProfileScreen from '../pages/ProfileScreen';
import EditProfile from '../pages/EditProfile';
import GetSubscription from '../pages/GetSubscription';
import ShowSubscriptionDetails from '../pages/ShowSubscriptionDetails';
import themes from '../themes';
import GetReminders from '../pages/GetReminders';
import CreateNewReminder from '../pages/CreateNewReminder';
import EditReminders from '../pages/EditReminders';
import MyPayment from '../pages/MyPayments';
import AddPaymentMode from '../pages/AddPaymentMode';
import ErrorReport from '../pages/ErrorReport';
const ProfileStack = createStackNavigator();

const ProfileStackScreens = ({navigation}) => (
  <ProfileStack.Navigator>
    <ProfileStack.Screen name="Profile" component={ProfileScreen} />
    <ProfileStack.Screen name="EditAccount" component={EditProfile} />
    <ProfileStack.Screen
      name="GetSubscription"
      component={GetSubscription}
      options={{
        headerShown: true,
        headerTitle: 'Subscriptions',
        headerStyle: {
          backgroundColor: themes.CONTENT_GREEN_BACKGROUND,
        },
      }}
    />
    <ProfileStack.Screen
      name="ShowSubscriptionDetails"
      component={ShowSubscriptionDetails}
      options={{
        headerShown: true,
        headerTitle: '',
        headerStyle: {
          backgroundColor: themes.CONTENT_GREEN_BACKGROUND,
        },
      }}
    />
    <ProfileStack.Screen
      name="GetReminders"
      component={GetReminders}
      options={{
        headerShown: true,
        headerTitle: 'Reminders',
        headerStyle: {
          backgroundColor: themes.CONTENT_GREEN_BACKGROUND,
        },
      }}
    />
    <ProfileStack.Screen
      name="CreateNewReminder"
      component={CreateNewReminder}
      options={{
        headerShown: true,
        headerTitle: '',
        headerStyle: {
          backgroundColor: themes.CONTENT_GREEN_BACKGROUND,
        },
      }}
    />
    <ProfileStack.Screen
      name="EditReminders"
      component={EditReminders}
      options={{
        headerShown: true,
        headerTitle: '',
        headerStyle: {
          backgroundColor: themes.CONTENT_GREEN_BACKGROUND,
        },
      }}
    />
    <ProfileStack.Screen
      name="MyPayment"
      component={MyPayment}
      options={{
        headerShown: true,
        headerTitle: '',
        headerStyle: {
          backgroundColor: themes.CONTENT_GREEN_BACKGROUND,
        },
      }}
    />
    <ProfileStack.Screen
      name="AddPaymentMode"
      component={AddPaymentMode}
      options={{
        headerShown: true,
        headerTitle: '',
        headerStyle: {
          backgroundColor: themes.CONTENT_GREEN_BACKGROUND,
        },
      }}
    />
    <ProfileStack.Screen
      name="ErrorReport"
      component={ErrorReport}
      options={{
        headerShown: true,
        headerTitle: '',
        headerStyle: {
          backgroundColor: themes.CONTENT_GREEN_BACKGROUND,
        },
      }}
    />
  </ProfileStack.Navigator>
);

export default ProfileStackScreens;
