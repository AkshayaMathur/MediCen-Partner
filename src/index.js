import React, {Components} from 'react';
import {Text, View, SafeAreaView, LogBox} from 'react-native';
import BaseView from './components/BaseView';
import Splash from './routes/Splash';
import messaging from '@react-native-firebase/messaging';
import {getItem, setItem} from './utils/secureStorage';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
LogBox.ignoreLogs([
  'Require cycle: ',
  'Remote debugger',
  'Warning: componentWillMount',
  'measureLayoutRelativeToContainingList',
  // 'Warning: Encountered two children with the same key',
  'Warning: componentWillReceiveProps',
  'Deprecation warning: value provided is not in a recognized RFC2822 or ISO format',
  'Deprecation',
  'VirtualizedList',
  'Warning:',
  'Cannot',
  'Setting a timer',
  "Sending 'onAnimatedValueUpdate' with no listeners registered.",
  'Animated.event',
  'Non-serializable values were found in the navigation state',
  'Animated: `useNativeDriver` was not specified. This is a required option and must be explicitly set to `true` or `false`',
  'Sending `onAnimatedValueUpdate` with no listeners registered.',
  'Warning: Cannot update a component from inside the function body of a different component.',
]);
export default class Application extends React.Component {
  componentDidMount() {
    this.checkPermission();
    PushNotification.configure({
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification);
        notification.finish(PushNotificationIOS.FetchResult.NoData);
      },
      onAction: function (notification) {
        console.log('ACTION:', notification.action);
        console.log('NOTIFICATION:', notification);
      },
      onRegistrationError: function (err) {
        console.error(err.message, err);
      },
      // IOS ONLY (optional): default: all - Permissions to register.
      permissions: {
        alert: true,
        badge: true,
        sound: true,
      },

      // Should the initial notification be popped automatically
      // default: true
      popInitialNotification: true,
      requestPermissions: true,
    });
  }

  async checkPermission() {
    const enabled = await messaging().hasPermission();
    // If Premission granted proceed towards token fetch
    if (enabled) {
      this.getToken();
    } else {
      // If permission hasn’t been granted to our app, request user in requestPermission method.
      this.requestPermission();
    }
  }
  async getToken() {
    let fcmToken = await getItem('fcmToken');
    console.log('Got FCM TOken From Storage: ', fcmToken);
    if (!fcmToken) {
      fcmToken = await messaging().getToken();
      console.log('FCM Token is: ', fcmToken);
      if (fcmToken) {
        // user has a device token
        await setItem('fcmToken', fcmToken);
      }
    }
  }
  async requestPermission() {
    try {
      await messaging().requestPermission();
      // User has authorised
      this.getToken();
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  }
  render() {
    return (
      <BaseView style={{flex: 1}}>
        <Splash />
      </BaseView>
    );
  }
}
