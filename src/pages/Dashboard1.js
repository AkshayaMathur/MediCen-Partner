/* eslint-disable react-hooks/exhaustive-deps */
import {
  Text,
  TouchableHighlight,
  StyleSheet,
  Dimensions,
  View,
  Alert,
  ActivityIndicator,
  ImageBackground,
  TouchableOpacity,
  Image,
  SafeAreaView,
  Button,
  StatusBar,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import BaseView from '../components/BaseView';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomBaseView from '../components/CustomBaseView';
import PlainBaseView from '../components/PlainBaseView';
import themes from '../themes';
import MedicarePic from '../assets/medicare.png';
import AppBar from '../components/AppBar';
import OrderCancelImg from '../assets/oderCancel.png';
import CustAwaitingImg from '../assets/customerConfirmation.png';
import PreparingImg from '../assets/preparingOrder.png';
import dispatchImg from '../assets/dispatch.png';
import deliveredImg from '../assets/delivered.png';
import prescriptionImg from '../assets/prescription.png';
import {normalize} from '../utils/deviceStyle';
import messaging from '@react-native-firebase/messaging';
import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import {getItem, setItem} from '../utils/secureStorage';
import PagerView from 'react-native-pager-view';
const Dashboard = ({navigation}) => {
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });
  const checkPermission = async () => {
    const enabled = await messaging().hasPermission();
    // If Premission granted proceed towards token fetch
    if (enabled) {
      getToken();
    } else {
      // If permission hasn’t been granted to our app, request user in requestPermission method.
      requestPermission();
    }
  };
  const getToken = async () => {
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
  };
  const requestPermission = async () => {
    try {
      await messaging().requestPermission();
      // User has authorised
      getToken();
    } catch (error) {
      // User has rejected permissions
      console.log('permission rejected');
    }
  };
  useEffect(() => {
    checkPermission();
    PushNotification.configure({
      onRegister: function (token) {
        console.log('TOKEN:', token);
      },
      onNotification: function (notification) {
        console.log('NOTIFICATION:', notification, navigation);
        if (notification.data.id && notification.userInteraction) {
          console.log('Got Notification id as: ', notification.data.id);
          navigation.navigate('NotificationViewDetails', {
            orderId: notification.data.id,
          });
        }
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
  }, []);

  return (
    <PlainBaseView color={themes.CONTENT_GREEN_BACKGROUND}>
      <View
        style={{
          flex: 0.4,
          backgroundColor: themes.CONTENT_GREEN_BACKGROUND,
          paddingBottom: 20,
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50,
          elevation: 10,
          shadowColor: '#00000',
          shadowRadius: 25,
          shadowOffset: {height: 10, width: 0},
          // justifyContent: 'center'
        }}>
        <View style={{flex: 0.5}}>
          <AppBar />
        </View>
        <View
          style={{
            flex: 3,
            // justifyContent: 'center',
            paddingHorizontal: 5,
            paddingVertical: 5,
            marginLeft: 0,
          }}>
          <Text
            style={{
              color: themes.TEXT_BLUE_COLOR,
              fontWeight: 'bold',
              fontSize: themes.FONT_SIZE_VERY_LARGE,
              textAlign: 'center',
            }}>
            Orders
          </Text>
          <Text
            style={{
              color: themes.TEXT_BLUE_COLOR,
              // fontWeight: 'bold',
              fontSize: themes.FONT_SIZE_MEDIUM,
              textAlign: 'center',
            }}>
            Overview
          </Text>
          <View
            style={{
              marginTop: 10,
              paddingVertical: 10,
              borderTopWidth: 2,
              borderBottomWidth: 2,
              borderTopColor: themes.GREEN_BLUE,
              borderBottomColor: themes.GREEN_BLUE,
            }}>
            <ScrollView
              nestedScrollEnabled={true}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              style={{
                flexDirection: 'row',
              }}>
              <TouchableOpacity
                style={{
                  flex: 1.2,
                  paddingRight: 4,
                  margin: 2,
                  borderRightColor: themes.GREEN_BLUE,
                  borderRightWidth: 0.8,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: themes.FONT_SIZE_MEDIUM,
                    color: themes.TEXT_BLUE_COLOR,
                    fontWeight: 'bold',
                  }}>
                  23
                </Text>
                <Text style={{textAlign: 'center'}}>
                  {'Awaiting\nPrescription\nConfirmation'}
                </Text>
              </TouchableOpacity>
              <View
                style={{
                  flex: 1.2,
                  paddingRight: 4,
                  margin: 2,
                  borderRightColor: themes.GREEN_BLUE,
                  borderRightWidth: 0.8,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: themes.FONT_SIZE_MEDIUM,
                    color: themes.TEXT_BLUE_COLOR,
                    fontWeight: 'bold',
                  }}>
                  8
                </Text>
                <Text style={{textAlign: 'center'}}>
                  {'Awaiting\nCustomer\nConfirmation'}
                </Text>
              </View>
              <View
                style={{
                  flex: 1.2,
                  paddingRight: 4,
                  margin: 2,
                  borderRightColor: themes.GREEN_BLUE,
                  borderRightWidth: 0.8,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: themes.FONT_SIZE_MEDIUM,
                    color: themes.TEXT_BLUE_COLOR,
                    fontWeight: 'bold',
                  }}>
                  14
                </Text>
                <Text
                  style={{textAlign: 'center', textAlignVertical: 'center'}}>
                  {'\nPreparing'}
                </Text>
              </View>
              <View
                style={{
                  flex: 1.2,
                  paddingRight: 4,
                  margin: 2,
                  borderRightColor: themes.GREEN_BLUE,
                  borderRightWidth: 0.8,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: themes.FONT_SIZE_MEDIUM,
                    color: themes.TEXT_BLUE_COLOR,
                    fontWeight: 'bold',
                  }}>
                  28
                </Text>
                <Text
                  style={{textAlign: 'center', textAlignVertical: 'center'}}>
                  {'\nDispatch'}
                </Text>
              </View>
              <View
                style={{
                  flex: 1.2,
                  paddingRight: 4,
                  margin: 2,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: themes.FONT_SIZE_MEDIUM,
                    color: themes.TEXT_BLUE_COLOR,
                    fontWeight: 'bold',
                  }}>
                  49
                </Text>
                <Text
                  style={{textAlign: 'center', textAlignVertical: 'center'}}>
                  {'\nDelivery'}
                </Text>
              </View>
            </ScrollView>
          </View>
        </View>
      </View>
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          // marginTop: 15,
        }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          nestedScrollEnabled={true}
          style={{
            flex: 1,
            backgroundColor: '#fff',
            marginTop: 15,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              paddingHorizontal: 5,
            }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() =>
                navigation.navigate('SearchScreen', {
                  screen: 'SearchPage',
                  params: {status: 'awaiting'},
                })
              }
              style={{
                // width: '45%',
                // marginRight: 7,
                // padding: 5,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.8,
                shadowRadius: 2,
                elevation: 2,
                // borderWidth: 0,
                flex: 1,
              }}>
              <View style={{paddingTop: 25}}>
                <Image
                  source={prescriptionImg}
                  style={{alignSelf: 'center', width: 50, height: 50}}
                  resizeMode="contain"
                />
              </View>

              <Text
                style={{
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  marginTop: 10,
                  color: themes.TEXT_BLUE_COLOR,
                  fontWeight: 'bold',
                  fontSize: themes.FONT_SIZE_MEDIUM,
                }}>
                Awaiting Order Confirmation
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() =>
                navigation.navigate('SearchScreen', {
                  screen: 'SearchPage',
                  params: {status: 'awaiting'},
                })
              }
              style={{
                // width: '45%',
                // marginRight: 7,
                // padding: 5,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.8,
                shadowRadius: 2,
                elevation: 2,
                borderWidth: 0,
                flex: 1,
              }}>
              <View style={{paddingTop: 25}}>
                <Image
                  source={CustAwaitingImg}
                  style={{alignSelf: 'center', width: 50, height: 50}}
                  resizeMode="contain"
                />
              </View>

              <Text
                style={{
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  marginTop: 10,
                  color: themes.TEXT_BLUE_COLOR,
                  fontWeight: 'bold',
                  fontSize: themes.FONT_SIZE_MEDIUM,
                }}>
                {'Awaiting Customer Confirmation'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() =>
                navigation.navigate('SearchScreen', {
                  screen: 'SearchPage',
                  params: {status: 'awaiting'},
                })
              }
              style={{
                // width: '45%',
                // marginRight: 7,
                // padding: 5,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.8,
                shadowRadius: 2,
                elevation: 2,
                borderWidth: 0,
                flex: 1,
              }}>
              <View style={{paddingTop: 25}}>
                <Image
                  source={prescriptionImg}
                  style={{alignSelf: 'center', width: 50, height: 50}}
                  resizeMode="contain"
                />
              </View>

              <Text
                style={{
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  marginTop: 10,
                  color: themes.TEXT_BLUE_COLOR,
                  fontWeight: 'bold',
                  fontSize: themes.FONT_SIZE_MEDIUM,
                }}>
                Awaiting Order Confirmation
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{height: 20}} />
        </ScrollView>
      </View>
    </PlainBaseView>
  );
};
export default Dashboard;
