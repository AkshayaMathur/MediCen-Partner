/* eslint-disable react-hooks/exhaustive-deps */
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  ActivityIndicator,
  TouchableOpacity,
  Image,
  Dimensions,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {setItem, deleteitem, getItem} from '../utils/secureStorage';
import {createStackNavigator} from '@react-navigation/stack';
import LoginStackScreens from './LoginRoute';
import HomeStackScreens from './HomeStack';
import BottomTabScreens from './BottomTab';
import LinearGradient from 'react-native-linear-gradient';
import {AuthContext} from '../components/context';
import MedcenLogo from '../assets/appLogo.png';
import Device_Api from '../utils/api';
import {StatusBar} from 'react-native';
import axios from 'axios';
import {setUserDetails} from '../utils/userprofile';
import messaging from '@react-native-firebase/messaging';
const Splash = (props) => {
  const initialLoginState = {
    username: null,
    userToken: null,
    isLoading: true,
  };

  const loginReducer = (prevState, action) => {
    switch (action.type) {
      case 'RETRIEVE_TOKEN':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGIN':
        return {
          ...prevState,
          userName: action.id,
          userToken: action.token,
          isLoading: false,
        };
      case 'LOGOUT':
        return {
          ...prevState,
          userName: null,
          userToken: null,
          isLoading: false,
        };
      case 'REGISTER':
        return {
          ...prevState,
          userToken: action.token,
          isLoading: false,
        };
    }
  };

  const saveDeviceInfo = async () => {
    console.log('Saving Device Info................');
    let token = await getItem('userToken');
    let fcmToken = await getItem('fcmToken');
    let alreadySavedToken = await getItem('fcmToken_stored');
    console.log('token: ', token);
    console.log('tofcmTokenken: ', fcmToken);
    console.log('alreadySavedToken: ', alreadySavedToken);
    if (token && fcmToken && !alreadySavedToken) {
      console.log('Saving Device Info................');
      const user = JSON.parse(token);
      let obj = {
        userId: user.Id,
        deviceId: fcmToken,
      };
      Device_Api.addDevice(obj)
        .then(async (res) => {
          console.log('Res is: ', res);
          if (res.statusCode === 200) {
            await setItem('fcmToken_stored', 'true');
          }
        })
        .catch((err) => console.log('An error Occurred: ', err));
    } else if (!fcmToken) {
      fcmToken = await messaging().getToken();
      if (fcmToken) {
        // user has a device token
        await setItem('fcmToken', fcmToken);
        saveDeviceInfo();
      }
    }
  };

  const [loginState, dispatch] = React.useReducer(
    loginReducer,
    initialLoginState,
  );

  const authContext = React.useMemo(
    () => ({
      signIn: async (foundUser) => {
        // setUserToken('fgkj');
        // setIsLoading(false);
        console.log('Found User is: ', foundUser);
        try {
          await setItem('userToken', JSON.stringify(foundUser));
          saveDeviceInfo();
          // saveDeviceInfo();
          // await getCurrentUserLocation();
        } catch (e) {
          console.log(e);
        }
        dispatch({type: 'LOGIN', id: foundUser.id, token: foundUser.emailId});
      },
      signOut: async () => {
        // setUserToken(null);
        // setIsLoading(false);
        try {
          await deleteitem('userToken');
        } catch (e) {
          console.log(e);
        }
        dispatch({type: 'LOGOUT'});
      },
      signUp: () => {
        // setUserToken('fgkj');
        // setIsLoading(false);
      },
      // toggleTheme: () => {
      //   // setIsDarkTheme((isDarkTheme) => !isDarkTheme);
      // },
    }),
    [],
  );

  const loginUser = (token) => {
    console.log('Email is: ', token);
    console.log('password is: ', token.password);
    console.log(token);
    axios
      .post(
        'https://7d5simyvz0.execute-api.us-east-1.amazonaws.com/V1/checkpartner',
        {
          emailId: token.username,
          password: token.password,
        },
      )
      .then(function (response) {
        console.log(response.data);
        if (response.data.statusCode === 200) {
          // login(response.data.body);
          // setLoading(false);
          setUserDetails(response.data.body);
          return;
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    // fetch(
    //   'https://7d5simyvz0.execute-api.us-east-1.amazonaws.com/V1/checkpartner',
    //   {
    //     method: 'POST',
    //     headers: {
    //       Accept: 'application/json',
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       emailId: email,
    //       password: password,
    //     }),
    //   },
    // )
    //   .then((res) => res.json())
    //   .then((res) => {
    //     console.log('Response is: ', res);
    //     if (res.statusCode === 200) {
    //       login(res.body);
    //       setLoading(false);
    //       return;
    //     }
    //     MedToast.show(`Login Failed: ${res.body.error}`);
    //     setLoading(false);
    //   })
    //   .catch((err) => {
    //     console.log('Error is: ', err);
    //     MedToast.show(`An Error Occurred while Login`);
    //     setLoading(false);
    //   });
  };

  useEffect(() => {
    setTimeout(async () => {
      let token = await getItem('userToken');
      console.log('Got token is: ', token);
      if (token) {
        token = JSON.parse(token);
        loginUser(token);
        saveDeviceInfo();
      }
      dispatch({type: 'RETRIEVE_TOKEN', token: token});
    }, 1000);
  }, []);

  if (loginState.isLoading) {
    return (
      <View style={{flex: 1, paddingHorizontal: 10}}>
        <StatusBar
          translucent={true}
          backgroundColor={'#ffff'}
          // backgroundColor="#50b98d"
          // backgroundColor={'white'}
          barStyle="light-content"
        />
        <LinearGradient
          start={{x: 0.0, y: 0}}
          end={{x: 1, y: 1.0}}
          locations={[0, 60, 100]}
          colors={['#ffff', '#ffff', '#ffff']}
          // colors={['#3c8868', '#3e8467', '#54ca98']}
          style={{flex: 1}}>
          <View
            style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Image
              source={MedcenLogo}
              style={{
                width: Dimensions.get('window').width - 15,
                height: Dimensions.get('window').height,
              }}
              resizeMode="contain"
            />
          </View>
        </LinearGradient>
      </View>
    );
  }
  return (
    <AuthContext.Provider value={authContext}>
      <NavigationContainer>
        {loginState.userToken != null ? (
          <BottomTabScreens />
        ) : (
          <LoginStackScreens />
        )}
      </NavigationContainer>
    </AuthContext.Provider>
  );
};

export default Splash;
