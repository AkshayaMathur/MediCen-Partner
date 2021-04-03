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
const Dashboard = ({navigation}) => {
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  });
  return (
    <PlainBaseView color={themes.CONTENT_GREEN_BACKGROUND}>
      <View
        style={{
          flex: 0.5,
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
              fontSize: themes.FONT_SIZE_VERY_VERY_LARGE,
              textAlign: 'center',
            }}>
            Orders
          </Text>
          <Text
            style={{
              color: themes.TEXT_BLUE_COLOR,
              // fontWeight: 'bold',
              fontSize: themes.FONT_SIZE_LARGE,
              textAlign: 'center',
            }}>
            Overview (Today)
          </Text>
          <View
            style={{
              marginTop: 10,
              paddingVertical: 15,
              borderTopWidth: 3,
              borderBottomWidth: 3,
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
                onPress={() => {
                  navigation.setParams({
                    query: 'someText',
                  });
                  navigation.navigate('SearchScreen', {
                    itemId: 86,
                    otherParam: 'anything you want here',
                  });
                }}
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
                    fontSize: themes.FONT_SIZE_VERY_LARGE,
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
                    fontSize: themes.FONT_SIZE_VERY_LARGE,
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
                    fontSize: themes.FONT_SIZE_VERY_LARGE,
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
                    fontSize: themes.FONT_SIZE_VERY_LARGE,
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
                    fontSize: themes.FONT_SIZE_VERY_LARGE,
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
                  style={{alignSelf: 'center', width: 70, height: 70}}
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
                  fontSize: themes.FONT_SIZE_LARGE,
                }}>
                Awaiting Prescription Confirmation
              </Text>
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
                style={{alignSelf: 'center', width: 70, height: 75}}
              />
              <Text
                style={{
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  marginTop: 10,
                  color: themes.TEXT_BLUE_COLOR,
                  fontWeight: 'bold',
                  fontSize: themes.FONT_SIZE_LARGE,
                }}>
                Preparing
              </Text>
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
                  style={{alignSelf: 'center', width: 70, height: 70}}
                />
              </View>
              <Text
                style={{
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  marginTop: 10,
                  color: themes.TEXT_BLUE_COLOR,
                  fontWeight: 'bold',
                  fontSize: normalize(17),
                }}>
                {'Awaiting Customer Confirmation'}
              </Text>
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
                style={{alignSelf: 'center', width: 70, height: 70}}
              />
              <Text
                style={{
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  marginTop: 10,
                  color: themes.TEXT_BLUE_COLOR,
                  fontWeight: 'bold',
                  fontSize: themes.FONT_SIZE_LARGE,
                }}>
                Dispatch
              </Text>
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
                style={{alignSelf: 'center', width: 70, height: 70}}
              />
              <Text
                style={{
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  marginTop: 10,
                  color: themes.TEXT_BLUE_COLOR,
                  fontWeight: 'bold',
                  fontSize: themes.FONT_SIZE_LARGE,
                }}>
                Delivered
              </Text>
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
                style={{alignSelf: 'center', width: 70, height: 70}}
              />
              <Text
                style={{
                  textAlign: 'center',
                  textAlignVertical: 'center',
                  marginTop: 10,
                  color: themes.TEXT_BLUE_COLOR,
                  fontWeight: 'bold',
                  fontSize: themes.FONT_SIZE_LARGE,
                }}>
                Cancel Order
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