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
import add1 from '../assets/adds1.jpg';
import add2 from '../assets/adds2.jpg';
import add3 from '../assets/add3.jpg';
import PagerView from 'react-native-pager-view';
import {getUserDetails} from '../utils/userprofile';
import pharmacyPic from '../assets/drugstore.png';
import deliveryImg from '../assets/food-delivery.png';
import packagingImg from '../assets/box.png';
import availabilityImg from '../assets/hand.png';
import Device_Api from '../utils/api';
import MedToast from '../components/MedToast';
const Dashboard = ({navigation}) => {
  const [totalRating, setTotalRating] = useState('5');
  const [deliveryRating, setDeliveryRating] = useState('5');
  const [availabilityRating, setAvailabilityRating] = useState('5');
  const [packagingRating, setPackagingRating] = useState('5');
  const [numRating, setNumRating] = useState('0');
  const [orderCount, setOrderCount] = useState({
    awaiting: 0,
    awaiting_cust: 0,
    cancelled: 0,
    delayed: 0,
    delivered: 0,
    dispatch: 0,
    preparing: 0,
    all_order: 0,
    all_pending: 0,
    all_delivered: 0,
    today_delivered: 0,
    today_new_order: 0,
    today_order: 0,
    today_pending: 0,
    all_money: 0,
    quater_money: 0,
    month_money: 0,
  });
  const init = async () => {
    let userDetails = await getUserDetails();
    if (userDetails) {
      userDetails = JSON.parse(userDetails);
      getOrderCounting(userDetails);
      console.log('User Details is: ');
      if (userDetails.totalRating) {
        setTotalRating(userDetails.totalRating.toFixed(2));
      }
      if (userDetails.deliveryRating) {
        setDeliveryRating(userDetails.deliveryRating.toFixed(2));
      }
      if (userDetails.availabilityRating) {
        setAvailabilityRating(userDetails.availabilityRating.toFixed(2));
      }
      if (userDetails.packagingRating) {
        setPackagingRating(userDetails.packagingRating.toFixed(2));
      }
      if (userDetails.numberOfRating) {
        setNumRating(userDetails.numberOfRating);
      }
    }
  };
  const getOrderCounting = (userDetails) => {
    console.log('userDetails.IduserDetails.Id::: ', userDetails.Id);
    try {
      Device_Api.getOrderCount(userDetails.Id)
        .then((res) => {
          console.log('Result is: ', res);
          if (res.body) {
            setOrderCount(res.body);
          }
        })
        .catch((err) => {
          console.log('An error: ', err);
        });
    } catch (error) {
      MedToast.show('An error occurred');
    }
  };
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    init();
  }, []);
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
          // flex: 0.5,
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
        <AppBar />
        <View
          style={{
            // flex: 3,
            // justifyContent: 'center',
            // marginTop: 20,
            paddingHorizontal: 5,
            // paddingVertical: 15,
            justifyContent: 'center',
            // alignItems: 'center',
            marginLeft: 0,
          }}>
          <Text style={styles.appBarHeading}>Todays Orders</Text>
          <View
            style={{
              // marginTop: 10,
              paddingVertical: 8,
              borderTopWidth: 2,
              borderBottomWidth: 2,
              borderTopColor: themes.GREEN_BLUE,
              borderBottomColor: themes.GREEN_BLUE,
            }}>
            <ScrollView
              nestedScrollEnabled={true}
              horizontal={true}
              contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
              showsHorizontalScrollIndicator={false}
              style={{
                flexDirection: 'row',
              }}>
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
                  {orderCount.today_new_order}
                </Text>
                <Text style={{textAlign: 'center'}}>{'New Orders'}</Text>
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
                  {orderCount.today_pending}
                </Text>
                <Text style={{textAlign: 'center'}}>{'Pending Orders'}</Text>
              </View>
              <View
                style={{
                  flex: 1.2,
                  paddingRight: 4,
                  margin: 2,
                  borderRightColor: themes.GREEN_BLUE,
                  // borderRightWidth: 0.8,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: themes.FONT_SIZE_MEDIUM,
                    color: themes.TEXT_BLUE_COLOR,
                    fontWeight: 'bold',
                  }}>
                  {orderCount.today_order}
                </Text>
                <Text
                  style={{textAlign: 'center', textAlignVertical: 'center'}}>
                  {'Total Orders'}
                </Text>
              </View>
            </ScrollView>
          </View>
          <Text style={styles.appBarHeading}>My Sales</Text>
          <View
            style={{
              // marginTop: 10,
              paddingVertical: 8,
              borderTopWidth: 2,
              borderBottomWidth: 2,
              borderBottomRightRadius: 15,
              borderBottomLeftRadius: 15,
              borderTopColor: themes.GREEN_BLUE,
              borderBottomColor: themes.GREEN_BLUE,
            }}>
            <ScrollView
              nestedScrollEnabled={true}
              horizontal={true}
              contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}
              showsHorizontalScrollIndicator={false}
              style={{
                flexDirection: 'row',
              }}>
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
                  {'₹ ' + orderCount.all_money}
                </Text>
                <Text style={{textAlign: 'center'}}>{'Till Date'}</Text>
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
                  {'₹ ' + orderCount.month_money}
                </Text>
                <Text style={{textAlign: 'center'}}>{'Past Month'}</Text>
              </View>
              <View
                style={{
                  flex: 1.2,
                  paddingRight: 4,
                  margin: 2,
                  borderRightColor: themes.GREEN_BLUE,
                  // borderRightWidth: 0.8,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontSize: themes.FONT_SIZE_MEDIUM,
                    color: themes.TEXT_BLUE_COLOR,
                    fontWeight: 'bold',
                  }}>
                  {'₹ ' + orderCount.quater_money}
                </Text>
                <Text
                  style={{textAlign: 'center', textAlignVertical: 'center'}}>
                  {'Today'}
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
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() =>
                navigation.navigate('SearchScreen', {
                  screen: 'SearchPage',
                  params: {status: 'awaiting'},
                })
              }
              style={{
                width: '45%',
                marginRight: 7,
                padding: 5,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.8,
                shadowRadius: 2,
                elevation: 4,
                borderWidth: 0,
              }}>
              <View style={{paddingTop: 25}}>
                <Image
                  source={prescriptionImg}
                  style={{alignSelf: 'center', width: 40, height: 40}}
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
              <View
                style={{
                  flex: 1,
                  position: 'absolute',
                  // transform: [{rotateZ: '-20deg'}],
                  top: 10,
                  left: 10,
                  width: 30,
                  height: 30,
                  borderRadius: 25,
                  backgroundColor: '#FF7377',
                  justifyContent: 'center',
                  // paddingHorizontal: 10,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: themes.FONT_SIZE_LARGE,
                  }}>
                  {orderCount.awaiting}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('SearchScreen', {
                  screen: 'SearchPage',
                  params: {status: 'preparing'},
                })
              }
              style={{
                width: '45%',
                marginLeft: 7,
                padding: 25,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.8,
                shadowRadius: 2,
                elevation: 4,
                borderWidth: 0,
              }}>
              <Image
                source={PreparingImg}
                style={{alignSelf: 'center', width: 40, height: 40}}
              />
              <Text
                style={{
                  flex: 1,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  marginTop: 10,
                  color: themes.TEXT_BLUE_COLOR,
                  fontWeight: 'bold',
                  fontSize: themes.FONT_SIZE_MEDIUM,
                }}>
                Preparing
              </Text>
              <View
                style={{
                  flex: 1,
                  position: 'absolute',
                  // transform: [{rotateZ: '-20deg'}],
                  top: 10,
                  left: 10,
                  width: 30,
                  height: 30,
                  borderRadius: 25,
                  backgroundColor: '#FF7377',
                  justifyContent: 'center',
                  // paddingHorizontal: 10,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: themes.FONT_SIZE_LARGE,
                  }}>
                  {orderCount.preparing}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 10,
            }}>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() =>
                navigation.navigate('SearchScreen', {
                  screen: 'SearchPage',
                  params: {status: 'awaiting_cust'},
                })
              }
              style={{
                width: '45%',
                marginRight: 7,
                padding: 5,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.8,
                shadowRadius: 2,
                elevation: 4,
                borderWidth: 0,
              }}>
              <View style={{paddingTop: 25}}>
                <Image
                  source={CustAwaitingImg}
                  style={{alignSelf: 'center', width: 40, height: 40}}
                />
              </View>
              <Text
                style={{
                  flex: 1,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  marginTop: 10,
                  color: themes.TEXT_BLUE_COLOR,
                  fontWeight: 'bold',
                  fontSize: themes.FONT_SIZE_MEDIUM,
                }}>
                {'Awaiting Customer Confirmation'}
              </Text>
              <View
                style={{
                  flex: 1,
                  position: 'absolute',
                  // transform: [{rotateZ: '-20deg'}],
                  top: 10,
                  left: 10,
                  width: 30,
                  height: 30,
                  borderRadius: 25,
                  backgroundColor: '#FF7377',
                  justifyContent: 'center',
                  // paddingHorizontal: 10,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: themes.FONT_SIZE_LARGE,
                  }}>
                  {orderCount.awaiting_cust}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.9}
              onPress={() =>
                navigation.navigate('SearchScreen', {
                  screen: 'SearchPage',
                  params: {status: 'dispatch'},
                })
              }
              style={{
                width: '45%',
                marginLeft: 7,
                padding: 25,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.8,
                shadowRadius: 2,
                elevation: 4,
                borderWidth: 0,
                justifyContent: 'center',
              }}>
              <Image
                source={dispatchImg}
                style={{alignSelf: 'center', width: 40, height: 40}}
              />
              <Text
                style={{
                  flex: 1,
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  marginTop: 10,
                  color: themes.TEXT_BLUE_COLOR,
                  fontWeight: 'bold',
                  fontSize: themes.FONT_SIZE_MEDIUM,
                }}>
                Dispatch
              </Text>
              <View
                style={{
                  flex: 1,
                  position: 'absolute',
                  // transform: [{rotateZ: '-20deg'}],
                  top: 10,
                  left: 10,
                  width: 30,
                  height: 30,
                  borderRadius: 25,
                  backgroundColor: '#FF7377',
                  justifyContent: 'center',
                  // paddingHorizontal: 10,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: themes.FONT_SIZE_LARGE,
                  }}>
                  {orderCount.dispatch}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
              marginTop: 10,
            }}>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('SearchScreen', {
                  screen: 'SearchPage',
                  params: {status: 'delivered'},
                })
              }
              style={{
                width: '45%',
                marginRight: 7,
                padding: 25,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.8,
                shadowRadius: 2,
                elevation: 4,
                borderWidth: 0,
              }}>
              <Image
                source={deliveredImg}
                style={{alignSelf: 'center', width: 40, height: 40}}
              />
              <Text
                style={{
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  marginTop: 10,
                  color: themes.TEXT_BLUE_COLOR,
                  fontWeight: 'bold',
                  fontSize: themes.FONT_SIZE_MEDIUM,
                }}>
                Delivered
              </Text>
              <View
                style={{
                  flex: 1,
                  position: 'absolute',
                  // transform: [{rotateZ: '-20deg'}],
                  top: 10,
                  left: 10,
                  width: 30,
                  height: 30,
                  borderRadius: 25,
                  backgroundColor: '#FF7377',
                  justifyContent: 'center',
                  // paddingHorizontal: 10,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: themes.FONT_SIZE_LARGE,
                  }}>
                  {orderCount.delivered}
                </Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('SearchScreen', {
                  screen: 'SearchPage',
                  params: {status: 'cancelled'},
                })
              }
              style={{
                width: '45%',
                marginLeft: 7,
                padding: 25,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.8,
                shadowRadius: 2,
                elevation: 4,
                borderWidth: 0,
              }}>
              <Image
                source={OrderCancelImg}
                style={{alignSelf: 'center', width: 40, height: 40}}
              />
              <Text
                style={{
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  marginTop: 10,
                  color: themes.TEXT_BLUE_COLOR,
                  fontWeight: 'bold',
                  fontSize: themes.FONT_SIZE_MEDIUM,
                }}>
                Cancel Orders
              </Text>
              <View
                style={{
                  flex: 1,
                  position: 'absolute',
                  // transform: [{rotateZ: '-20deg'}],
                  top: 10,
                  left: 10,
                  width: 30,
                  height: 30,
                  borderRadius: 25,
                  backgroundColor: '#FF7377',
                  justifyContent: 'center',
                  // paddingHorizontal: 10,
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    color: '#fff',
                    fontWeight: 'bold',
                    fontSize: themes.FONT_SIZE_LARGE,
                  }}>
                  {orderCount.cancelled}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          <PagerView
            style={{
              flex: 1,
              width: '95%',
              height: 300,
              marginTop: 20,
              marginHorizontal: 10,
            }}
            initialPage={0}>
            <View key="1">
              <Image
                source={add1}
                style={{alignSelf: 'center', width: '100%', height: 200}}
                resizeMode="contain"
              />
            </View>
            <View key="2">
              <Image
                source={add2}
                style={{alignSelf: 'center', width: '100%', height: 200}}
                resizeMode="contain"
              />
            </View>
            <View key="3">
              <Image
                source={add3}
                style={{alignSelf: 'center', width: '100%', height: 200}}
                resizeMode="contain"
              />
            </View>
          </PagerView>
          {/* <View style={{height: 10}} /> */}
        </ScrollView>
      </View>
    </PlainBaseView>
  );
};
export default Dashboard;

const styles = StyleSheet.create({
  appBarContainer: {
    flex: 1,
    // backgroundColor: themes.CONTENT_GREEN_BACKGROUND,
    paddingBottom: 20,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    elevation: 10,
    // shadowColor: '#00000',
    shadowRadius: 25,
    shadowOffset: {height: 10, width: 0},
    // justifyContent: 'center'
  },
  appBarHeading: {
    color: themes.TEXT_BLUE_COLOR,
    fontWeight: 'bold',
    fontSize: themes.FONT_SIZE_VERY_LARGE,
    textAlign: 'center',
  },
  appBarSubHeading: {
    color: themes.TEXT_BLUE_COLOR,
    // fontWeight: 'bold',
    fontSize: themes.FONT_SIZE_MEDIUM,
    textAlign: 'center',
  },
  ratingContainer: {
    marginTop: 10,
    paddingVertical: 10,
    // borderTopWidth: 2,
    // borderBottomWidth: 2,
    borderTopColor: themes.GREEN_BLUE,
    borderBottomColor: themes.GREEN_BLUE,
  },
  ratingMainContent: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  ratingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingImg: {width: 50, height: 50},
  ratingTextAlign: {textAlign: 'center'},
  content: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainContent: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  block: {
    width: '45%',
    marginRight: 10,
    padding: 25,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.8,
    shadowRadius: 2,
    elevation: 4,
    borderWidth: 0,
    maxWidth: 400,
    borderTopWidth: 0.1,
    borderColor: '#ccc',
  },
  blockImg: {alignSelf: 'center', width: 45, height: 45},
  blockText: {
    flex: 1,
    textAlign: 'center',
    textAlignVertical: 'center',
    marginTop: 10,
    color: themes.TEXT_BLUE_COLOR,
    fontWeight: 'bold',
    fontSize: themes.FONT_SIZE_MEDIUM,
  },
});
