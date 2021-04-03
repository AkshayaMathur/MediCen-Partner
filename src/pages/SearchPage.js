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
import SiTabView from '../components/SiTabView';
import SiTabBarView from '../components/SiTabBarView';
import BaseView from '../components/BaseView';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomBaseView from '../components/CustomBaseView';
import PlainBaseView from '../components/PlainBaseView';
import themes from '../themes';
import MedicarePic from '../assets/medicare.png';
import AppBar from '../components/AppBar';
import CustomSearchBar from '../components/CustomSearchBar';
import SearchIcon from '../assets/search.png';
import doctorMale from '../assets/doctorMale.jpg';
import doctorFemale from '../assets/doctorFemale.jpg';
import pharmacyPic from '../assets/pharmacy.jpg';
import {getUserDetails} from '../utils/userprofile';
import CustomeProgress from '../components/CustomProgress';
import {RefreshControl} from 'react-native';
const SearchPage = (props) => {
  const Orders = [
    {
      status: 'awaiting',
      orderId: '12345',
      time: '6:50 PM',
      delivery: '45 min',
    },
    {
      status: 'delivered',
      orderId: '65772',
      time: '9:30 AM',
      delivery: '45 min',
    },
    {
      status: 'preparing',
      orderId: '87589',
      time: '11:50 AM',
      delivery: '45 min',
    },
    {
      status: 'awaiting',
      orderId: '99654',
      time: '3:20 PM',
      delivery: '45 min',
    },
    {
      status: 'preparing',
      orderId: '12556',
      time: '4:12 PM',
      delivery: '45 min',
    },
    {
      status: 'awaiting_cust',
      orderId: '66590',
      time: '10:43 AM',
      delivery: '45 min',
    },
    {
      status: 'awaiting',
      orderId: '54790',
      time: '1:50 PM',
      delivery: '45 min',
    },
    {
      status: 'dispatch',
      orderId: '43789',
      time: '8:50 PM',
      delivery: '45 min',
    },
    {
      status: 'delivered',
      orderId: '54897',
      time: '11:11 AM',
      delivery: '45 min',
    },
    {
      status: 'dispatch',
      orderId: '99756',
      time: '6:50 PM',
      delivery: '45 min',
    },
  ];
  const STATUS = [
    'all',
    'awaiting',
    'preparing',
    'awaiting_cust',
    'dispatch',
    'delivered',
    'cancelled',
  ];
  const initialLayout = {width: Dimensions.get('window').width};
  const [index, setIndex] = React.useState(0);
  const [searchString, setSearchString] = React.useState('');
  const [routes, setRoutes] = React.useState([
    {key: 'doctor', title: 'Doctor'},
    {key: 'pharmacy', title: 'Pharmacy'},
  ]);
  const [showSearchResult, setShowSearchResult] = React.useState(false);
  const [finalResult, setFinalResult] = React.useState([]);
  const [selectedFilter, setSelectedFilter] = React.useState('all');
  const [showSearchBar, setShowSearchBar] = React.useState(false);
  const [serverResponse, setServerResponse] = React.useState([]);
  const [user, setUser] = React.useState({});
  const [allOrders, setAllOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  useEffect(() => {
    props.navigation.setOptions({
      headerShown: false,
    });
    console.log('PROPS ARE:::::::::::::::::::::: ', props.route.params);
  }, []);
  useEffect(() => {
    filterDataBasedOfSearchString();
  }, [searchString]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      console.log('Props is: ', props.route);
      getAllOrders();
    });
    return unsubscribe;
  }, [props.navigation]);

  const getAllOrders = async () => {
    let user = await getUserDetails();
    if (user) {
      setLoading(true);
      user = JSON.parse(user);
      console.log('User is: ', user);
      fetch(
        'https://7d5simyvz0.execute-api.us-east-1.amazonaws.com/V1/getorder',
        {
          method: 'POST',
          body: JSON.stringify({partnerId: user.Id}),
        },
      )
        .then((res) => res.json())
        .then((res) => {
          console.log('The response is: ', res);
          setAllOrders(res.body);
          setFinalResult(res.body);
          setLoading(false);
          if (props.route.params && props.route.params.status) {
            filterInitialData(props.route.params.status, res.body);
          }
        })
        .catch((err) => {
          console.log('An error while fetching all orders');
        });
    }
  };

  const getStatusString = (status) => {
    if (status === 'all') {
      return 'All';
    } else if (status === 'awaiting') {
      return 'Awaiting Prescription Confirmation';
    } else if (status === 'preparing') {
      return 'Preparing';
    } else if (status === 'awaiting_cust') {
      return 'Awaiting Customer Confirmation';
    } else if (status === 'dispatch') {
      return 'Dispatch';
    } else if (status === 'delivered') {
      return 'Delivered';
    } else if (status === 'cancelled') {
      return 'Cancelled';
    }
  };

  const filterInitialData = (status, res) => {
    const filterData = [];
    // serverResponse.map(order => {
    //   filterData.push({
    //     status: status,
    //     orderId: order.Id,
    //     time: '6:50 PM',
    //     delivery: '45 min',
    //     keys: order.keys
    //   });
    // })
    if (status === 'all') {
      setFinalResult(res);
    } else {
      res.map((o) => {
        if (o.status === status) {
          filterData.push(o);
        }
      });
      setFinalResult(filterData);
    }
    setSelectedFilter(status);
  };

  const filterDataBasedOnSelectedStatus = (status) => {
    const filterData = [];
    // serverResponse.map(order => {
    //   filterData.push({
    //     status: status,
    //     orderId: order.Id,
    //     time: '6:50 PM',
    //     delivery: '45 min',
    //     keys: order.keys
    //   });
    // })
    if (status === 'all') {
      setFinalResult(allOrders);
    } else {
      allOrders.map((o) => {
        if (o.status === status) {
          filterData.push(o);
        }
      });
      setFinalResult(filterData);
    }
    setSelectedFilter(status);
  };
  const getBackgroundColorOfButton = (status) => {
    if (status === selectedFilter) {
      return themes.TEXT_BLUE_COLOR;
    }
    return themes.BUTTON_GREEN_BACKGROUND;
  };
  const checkIfInclude = (str1, str2) => {
    console.log('STR1 is: ', str1, 'str2 is: ', str2);
    return str1
      .toString()
      .toLowerCase()
      .includes(str2.toString().toLowerCase());
  };
  const filterDataBasedOfSearchString = () => {
    console.log('Checking search string');
    let res = [];
    if (searchString !== '') {
      allOrders.map((o) => {
        console.log('O is: ', o);
        if (
          checkIfInclude(o.status, searchString) ||
          checkIfInclude(o.Id, searchString) ||
          checkIfInclude(o.patientName, searchString)
        ) {
          res.push(o);
        }
      });
      setFinalResult(res);
    }
  };
  const refreshData = () => {
    setRefreshing(true);
    getAllOrders();
    setRefreshing(false);
  };
  return (
    <PlainBaseView color={themes.CONTENT_GREEN_BACKGROUND}>
      <View style={{flex: 1}}>
        <AppBar />
        <View style={{paddingVertical: 10}}>
          <CustomeProgress showprogress={loading} />
          {showSearchBar ? (
            <View style={{flexDirection: 'row'}}>
              <CustomSearchBar
                value={searchString}
                onValueChange={(val) => setSearchString(val)}
              />
              <TouchableOpacity
                onPress={() => setShowSearchBar(false)}
                style={{justifyContent: 'center'}}>
                <Icon name="close" size={30} />
              </TouchableOpacity>
            </View>
          ) : (
            <View style={{flexDirection: 'row-reverse'}}>
              <TouchableOpacity onPress={() => setShowSearchBar(true)}>
                <Image source={SearchIcon} style={{height: 30, width: 30}} />
              </TouchableOpacity>
            </View>
          )}

          <ScrollView
            horizontal={true}
            nestedScrollEnabled={true}
            showsHorizontalScrollIndicator={false}
            style={{flexDirection: 'row'}}>
            {STATUS.map((status, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => filterDataBasedOnSelectedStatus(status)}
                  style={{
                    margin: 2,
                    backgroundColor: getBackgroundColorOfButton(status),
                    padding: 5,
                    borderRadius: 15,
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: themes.FONT_SIZE_SMALL,
                    }}>
                    {getStatusString(status)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={() => refreshData()}
            />
          }
          style={{paddingHorizontal: 10, paddingVertical: 20}}>
          {finalResult.map((order, index) => {
            return (
              <View
                key={index}
                style={{
                  elevation: 10,
                  padding: 10,
                  shadowColor: '#00000',
                  shadowRadius: 25,
                  shadowOffset: {height: 1, width: 0},
                  backgroundColor: '#fff',
                  marginBottom: 30,
                }}>
                <View
                  style={{
                    backgroundColor: themes.TEXT_BLUE_COLOR,
                    // padding: 5,
                    borderRadius: 10,
                    paddingVertical: 10,
                    margin: 2,
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      backgroundColor: themes.TEXT_BLUE_COLOR,
                      fontWeight: 'bold',
                      fontSize: themes.FONT_SIZE_SMALL,
                      textAlignVertical: 'center',
                      textAlign: 'center',
                    }}>
                    {getStatusString(order.status)}
                  </Text>
                </View>
                <View style={{flexDirection: 'row', marginTop: 15}}>
                  <Text style={{fontSize: themes.FONT_SIZE_MEDIUM}}>
                    Order Id:
                  </Text>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: themes.FONT_SIZE_MEDIUM,
                    }}>
                    {' '}
                    {order.Id}
                  </Text>
                  <View
                    style={{
                      backgroundColor: themes.GREEN_BLUE,
                      width: 1,
                      margin: 2,
                      marginHorizontal: 10,
                    }}
                  />
                  <Text style={{fontSize: themes.FONT_SIZE_MEDIUM}}>
                    {order.orderTime}
                  </Text>
                  {/* <View
                    style={{
                      backgroundColor: themes.GREEN_BLUE,
                      width: 1,
                      margin: 2,
                      marginHorizontal: 10,
                    }}></View> */}
                  {/* <Text
                    style={{
                      fontSize: themes.FONT_SIZE_MEDIUM,
                      textAlignVertical: 'center',
                    }}>
                    {order.delivery} ETA
                  </Text> */}
                </View>
                <View style={{marginTop: 10, flexDirection: 'row'}}>
                  <Text style={{fontSize: themes.FONT_SIZE_MEDIUM}}>
                    Patient Name:{' '}
                  </Text>
                  <Text
                    style={{
                      fontSize: themes.FONT_SIZE_MEDIUM,
                      fontWeight: 'bold',
                    }}>
                    {order.patientName}
                  </Text>
                </View>
                <View
                  style={{
                    height: 2,
                    backgroundColor: themes.GREEN_BLUE,
                    marginTop: 15,
                  }}
                />
                <View
                  style={{
                    justifyContent: 'space-around',
                    flexDirection: 'row',
                    marginTop: 10,
                  }}>
                  <TouchableOpacity
                    style={{
                      backgroundColor: 'red',
                      // padding: 5,
                      borderRadius: 10,
                      paddingVertical: 10,
                      paddingHorizontal: 30,
                      margin: 2,
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: themes.FONT_SIZE_MEDIUM,
                        textAlignVertical: 'center',
                        textAlign: 'center',
                      }}>
                      CANCEL
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      props.navigation.navigate('ViewDetails', {order: order});
                    }}
                    style={{
                      backgroundColor: themes.BUTTON_GREEN_BACKGROUND,
                      // padding: 5,
                      borderRadius: 10,
                      paddingVertical: 10,
                      paddingHorizontal: 30,
                      margin: 2,
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: themes.FONT_SIZE_MEDIUM,
                        textAlignVertical: 'center',
                        textAlign: 'center',
                      }}>
                      VIEW DETAILS
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </PlainBaseView>
  );
};
export default SearchPage;
