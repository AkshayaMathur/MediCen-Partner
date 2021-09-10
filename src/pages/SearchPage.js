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
  FlatList,
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import SiTabView from '../components/SiTabView';
import SiTabBarView from '../components/SiTabBarView';
import BaseView from '../components/BaseView';
import CustomButton from '../components/CustomButton';
import Icon from 'react-native-vector-icons/Ionicons';
import CustomBaseView from '../components/CustomBaseView';
import PlainBaseView from '../components/PlainBaseView';
import themes from '../themes';
import MedicarePic from '../assets/medicare.png';
import AppBar from '../components/AppBar';
import CustomSearchBar from '../components/CustomSearchBar';
import EmptyListView from '../components/EmptyListView';
import SearchIcon from '../assets/search.png';
import doctorMale from '../assets/doctorMale.jpg';
import doctorFemale from '../assets/doctorFemale.jpg';
import pharmacyPic from '../assets/pharmacy.jpg';
import {
  getUserDetails,
  setAllUserOrder,
  getAllUserOrders,
} from '../utils/userprofile';
import CustomeProgress from '../components/CustomProgress';
import {RefreshControl} from 'react-native';
import moment from 'moment';
import {
  formateDate,
  getPrevDate,
  getPrevMonth,
  isFuture,
} from '../utils/date.formatter';
import MedToast from '../components/MedToast';
import Device_Api from '../utils/api';
const SearchPage = (props) => {
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
  const [lastEvaluated, setLastEvaluated] = React.useState(null);
  const [finalResult, setFinalResult] = React.useState([]);
  const [selectedFilter, setSelectedFilter] = React.useState('all');
  const [showSearchBar, setShowSearchBar] = React.useState(false);
  const [serverResponse, setServerResponse] = React.useState([]);
  const [user, setUser] = React.useState({});
  const [allOrders, setAllOrders] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const [orderloading, setOrderLoading] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [endReached, setEndReached] = React.useState(false);
  const [paidAmount, setPaidAmount] = React.useState(0);
  const [unpaidAmount, setUnpaidAmount] = React.useState(0);
  const [unVerifiedAmount, setUnVerifiedAmount] = React.useState(0);
  const [paidAmountNum, setPaidAmountNum] = React.useState(0);
  const [totalAmountEarn, setTotalAmountEarn] = React.useState(0);
  const [quaterAmountEarn, setQuaterAmountEarn] = React.useState(0);
  const [monthlyAmountEarn, setMonthlyAmountEarn] = React.useState(0);
  const [unpaidAmountNum, setUnpaidAmountNum] = React.useState(0);
  const [unVerifiedAmountNum, setUnVerifiedAmountNum] = React.useState(0);
  const [selectedAmountStatus, setSelectedAmountStatus] = React.useState(null);
  // const [selectedEarningStatus, setSelectedEarningStatus] = React.useState(
  //   null,
  // );
  useEffect(() => {
    props.navigation.setOptions({
      headerShown: false,
    });
    // console.log('PROPS ARE:::::::::::::::::::::: ', props.route.params);
    if (props.route.params && props.route.params.opensearch) {
      setShowSearchBar(true);
    }
  }, []);
  useEffect(() => {
    filterDataBasedOfSearchString();
  }, [searchString]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      // console.log('Props is: ', props.route);
      getAllOrders();
      getPaymentDetails();
      // internalOrders();
    });
    return unsubscribe;
  }, [props.navigation]);

  useEffect(() => {
    console.log(
      'Called. filterDataBasedOnSelectedStatus......',
      selectedFilter,
    );
    filterDataBasedOnSelectedStatus(selectedFilter);
  }, [selectedAmountStatus]);

  const internalOrders = async () => {
    let allOrdersFromStorage = await getAllUserOrders();
    if (allOrdersFromStorage) {
      setAllOrders(allOrdersFromStorage);
      setFinalResult(allOrdersFromStorage);
      setLoading(false);
    }
  };

  const getPaymentDetails = async () => {
    let user = await getUserDetails();
    if (user) {
      user = JSON.parse(user);
      Device_Api.getPaymentOrders(user.Id)
        .then((res) => {
          // console.log(('RES is: ', res));
          if (res.statusCode && res.statusCode === 200) {
            setPaidAmount(res.body.paid);
            setUnpaidAmount(res.body.unPaid);
            setUnVerifiedAmount(res.body.unverified);
            setPaidAmountNum(res.body.paidOrders.length);
            setUnpaidAmountNum(res.body.unPaidOrders.length);
            setUnVerifiedAmountNum(res.body.unverifiedOrders.length);
            setTotalAmountEarn(res.body.all_money);
            setQuaterAmountEarn(res.body.quater_money);
            setMonthlyAmountEarn(res.body.month_money);
            return;
          }
        })
        .catch((err) => {
          console.log('Error Is: ', err);
        });
    }
  };

  const getAllOrders = async () => {
    let user = await getUserDetails();
    if (user) {
      setLoading(true);
      user = JSON.parse(user);
      // console.log('User is: ', user);
      fetch(
        'https://7d5simyvz0.execute-api.us-east-1.amazonaws.com/V1/getorder',
        {
          method: 'POST',
          body: JSON.stringify({partnerId: user.Id}),
        },
      )
        .then((res) => res.json())
        .then((res) => {
          // console.log('The response is: ', res);
          if (res.lastEvaluated) {
            setLastEvaluated(res.lastEvaluated);
          } else {
            MedToast.show('No More Orders To Load');
            setEndReached(true);
          }
          const sortedData = res.body.sort(function (var1, var2) {
            if (var1.orderTime > var2.orderTime) {
              return -1;
            } else if (var1.orderTime < var2.orderTime) {
              return 1;
            }
            return 0;
          });
          setAllUserOrder(sortedData);
          setAllOrders(sortedData);
          setFinalResult(sortedData);
          setLoading(false);
          if (props.route.params && props.route.params.status) {
            filterInitialData(props.route.params.status, res.body);
          }
        })
        .catch((err) => {
          setLoading(false);
          console.log('An error while fetching all orders');
        });
    }
  };
  const loadMoreOrders = async (savedLastEvaluated) => {
    if (orderloading) {
      return;
    }
    console.log('Called loadMoreOrders');
    setOrderLoading(true);
    let user = await getUserDetails();
    if (user) {
      setOrderLoading(true);
      user = JSON.parse(user);
      if (!savedLastEvaluated) {
        savedLastEvaluated = lastEvaluated;
      }
      console.log('lastEvaluated is: ', savedLastEvaluated);
      fetch(
        'https://7d5simyvz0.execute-api.us-east-1.amazonaws.com/V1/getorder',
        {
          method: 'POST',
          body: JSON.stringify({
            partnerId: user.Id,
            lastEvaluated: savedLastEvaluated,
          }),
        },
      )
        .then((res) => res.json())
        .then((res) => {
          console.log('Called loadMoreOrders res came', res.lastEvaluated);
          // console.log('The LOAD mORE response is: ', JSON.stringify(res));
          if (res.lastEvaluated) {
            if (res.lastEvaluated === 'null' || res.lastEvaluated === null) {
              setEndReached(true);
              setLastEvaluated(null);
              MedToast.show('No More Orders To Load');
              console.log('NULL IS ISHEVBEKBEK');
            } else {
              setLastEvaluated(res.lastEvaluated);
            }
          } else {
            setEndReached(true);
            setLastEvaluated(null);
            MedToast.show('No More Orders To Load');
            console.log('NULL IS ISHEVBEKBEK');
          }
          const sortedData = res.body.sort(function (var1, var2) {
            if (var1.orderTime > var2.orderTime) {
              return -1;
            } else if (var1.orderTime < var2.orderTime) {
              return 1;
            }
            return 0;
          });
          setAllUserOrder((oldOrders) => [...oldOrders, ...sortedData]);
          setAllOrders((oldOrders) => [...oldOrders, ...sortedData]);
          setFinalResult((oldOrders) => [...oldOrders, ...sortedData]);
          setOrderLoading(false);
          filterDataBasedOnSelectedStatus(selectedFilter, res.lastEvaluated, [
            ...allOrders,
            res.body,
          ]);
        })
        .catch((err) => {
          setOrderLoading(false);
          console.log('An error while fetching More orders', err);
        });
    }
  };

  const getStatusString = (status) => {
    if (status === 'all') {
      return 'All';
    } else if (status === 'awaiting') {
      return 'Awaiting Order Confirmation';
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
    } else if (status === 'delayed') {
      return 'Delayed';
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

  const filterDataBasedOnSelectedStatus = (status, savedlastEvaluated) => {
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
    console.log('filterDataBasedOnSelectedStatus status is: ', status);
    if (status === 'all') {
      setFinalResult(allOrders);
      filterOrderBasedOnPaymentStatus(allOrders, savedlastEvaluated);
    } else {
      allOrders.map((o) => {
        if (o.status === status) {
          filterData.push(o);
        }
      });
      setFinalResult(filterData);
      filterOrderBasedOnPaymentStatus(filterData, savedlastEvaluated);
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
    // console.log('STR1 is: ', str1, 'str2 is: ', str2);
    return str1
      .toString()
      .toLowerCase()
      .includes(str2.toString().toLowerCase());
  };
  useEffect(() => {
    console.log('LAST EVALUATED CAHNGED...................', lastEvaluated);
  }, [lastEvaluated]);
  const filterDataBasedOfSearchString = () => {
    console.log('Checking search string');
    let res = [];
    if (searchString !== '') {
      allOrders.map((o) => {
        // console.log('O is: ', o);
        if (
          checkIfInclude(o.mobileNumber, searchString) ||
          checkIfInclude(o.user.name, searchString) ||
          checkIfInclude(o.patientName, searchString)
        ) {
          res.push(o);
        }
      });
      setFinalResult(res);
    }
  };
  const filterOrderBasedOnPaymentStatus = async (res, savedlastEvaluated) => {
    console.log(
      'Calledddd.....filterOrderBasedOnPaymentStatus',
      selectedAmountStatus,
    );
    if (selectedAmountStatus) {
      let finalRes = [];
      if (selectedAmountStatus === 'unpaid') {
        res.map((o) => {
          if (!o.paymentDone) {
            finalRes.push(o);
          }
        });
      } else if (selectedAmountStatus === 'unverified') {
        res.map((o) => {
          // console.log('Unverified :::: ', o.paymentVerified, o.paymentDone);
          if (!o.paymentVerified && o.paymentDone) {
            finalRes.push(o);
          }
        });
      } else {
        res.map((o) => {
          if (o.paymentVerified && o.paymentDone) {
            finalRes.push(o);
          }
        });
      }
      console.log('finalRes after order sorting is: ', finalRes);
      // filterBasedOnEarningStatus(finalRes);
      setFinalResult(finalRes);
    } else {
      // filterBasedOnEarningStatus(res);
    }
  };

  // const filterBasedOnEarningStatus = (res) => {
  //   console.log('Calledddd filterBasedOnEarningStatus');
  //   if (selectedEarningStatus) {
  //     let finalRes = [];
  //     if (selectedEarningStatus === 'all') {
  //       finalRes = res;
  //     } else if (selectedEarningStatus === 'month') {
  //       let prevDate = getPrevMonth(1);
  //       res.map((o) => {
  //         if (isFuture(o.orderTime, prevDate)) {
  //           finalRes.push(o);
  //         }
  //       });
  //     } else {
  //       let prevDate = getPrevDate(15);
  //       console.log(
  //         'getPrevDate',
  //         prevDate,
  //         // isFuture(res[0].orderTime, prevDate),
  //       );
  //       res.map((o) => {
  //         if (isFuture(o.orderTime, prevDate)) {
  //           finalRes.push(o);
  //         }
  //       });
  //     }
  //     console.log(
  //       'filterBasedOnEarningStatus after order sorting is: ',
  //       finalRes,
  //     );

  //     setFinalResult(finalRes);
  //   }
  // };
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
        <View style={{flexDirection: 'row', justifyContent: 'center'}}>
          <TouchableOpacity
            onPress={() => setSelectedAmountStatus('paid')}
            style={{
              margin: 2,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                flex: 1,
                // padding: 10,
                borderRadius: 25,
                paddingVertical: 10,
                paddingHorizontal: 15,
                backgroundColor:
                  selectedAmountStatus === 'paid' ? 'green' : '#FF7377',
                justifyContent: 'center',
                // paddingHorizontal: 10,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: themes.FONT_SIZE_SMALL,
                }}>
                {`₹${paidAmount} Paid\n(${paidAmountNum} Orders)`}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedAmountStatus('unverified')}
            style={{
              marginHorizontal: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                flex: 1,
                // width: 40,
                // height: 40,
                borderRadius: 25,
                paddingVertical: 20,
                paddingHorizontal: 15,
                backgroundColor:
                  selectedAmountStatus === 'unverified' ? 'green' : '#FF7377',
                justifyContent: 'center',
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: themes.FONT_SIZE_SMALL,
                }}>
                {`₹${unVerifiedAmount} Un-Verified\n(${unVerifiedAmountNum} Orders)`}
              </Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelectedAmountStatus('unpaid')}
            style={{
              marginHorizontal: 10,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <View
              style={{
                flex: 1,
                // width: 40,
                // height: 40,
                paddingVertical: 10,
                paddingHorizontal: 15,
                borderRadius: 25,
                backgroundColor:
                  selectedAmountStatus === 'unpaid' ? 'green' : '#FF7377',
                justifyContent: 'center',
                // paddingHorizontal: 10,
              }}>
              <Text
                style={{
                  textAlign: 'center',
                  color: '#fff',
                  fontWeight: 'bold',
                  fontSize: themes.FONT_SIZE_SMALL,
                }}>
                {`₹${unpaidAmount} Un-Paid\n(${unpaidAmountNum} Orders)`}
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        <FlatList
          data={finalResult}
          refreshControl={
            <RefreshControl
              // colors={['#9Bd35A', '#689F38']}
              refreshing={refreshing}
              onRefresh={() => refreshData()}
            />
          }
          renderItem={({item, index}) => (
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
                  {getStatusString(item.status)}
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
                  {item.Id}
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
                  {formateDate(item.orderTime)}
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
                <Text style={{fontSize: themes.FONT_SIZE_MEDIUM}}>Name: </Text>
                <Text
                  style={{
                    fontSize: themes.FONT_SIZE_MEDIUM,
                    fontWeight: 'bold',
                  }}>
                  {item.user.name} {item.user.lastName}
                </Text>
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
                  {item.patientName}
                </Text>
              </View>
              <View style={{marginTop: 10, flexDirection: 'row'}}>
                <Text style={{fontSize: themes.FONT_SIZE_MEDIUM}}>
                  Payment Status:{' '}
                </Text>
                <Text
                  style={{
                    fontSize: themes.FONT_SIZE_MEDIUM,
                    fontWeight: 'bold',
                  }}>
                  {item.paymentDone
                    ? item.paymentVerified
                      ? 'Done'
                      : 'Verification Required'
                    : 'Pending'}
                </Text>
              </View>
              {item.totalRating ? (
                <View>
                  <Text
                    style={{
                      marginTop: 10,
                      fontSize: themes.FONT_SIZE_MEDIUM,
                    }}>
                    {'Rating: '}
                  </Text>
                  <View style={{flexDirection: 'row'}}>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginRight: 10,
                      }}>
                      <Text style={{fontSize: themes.FONT_SIZE_MEDIUM}}>
                        Overall
                      </Text>
                      <Text
                        style={{
                          fontSize: themes.FONT_SIZE_MEDIUM,
                          fontWeight: 'bold',
                        }}>
                        {`✭ ${item.totalRating.toFixed(2)}`}
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: themes.FONT_SIZE_MEDIUM,
                          textAlign: 'center',
                        }}>
                        Medicine Availability
                      </Text>
                      <Text
                        style={{
                          fontSize: themes.FONT_SIZE_MEDIUM,
                          fontWeight: 'bold',
                        }}>
                        {`✭ ${item.availabilityRating.toFixed(2)}`}
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text
                        style={{
                          fontSize: themes.FONT_SIZE_MEDIUM,
                          textAlign: 'center',
                        }}>
                        On Time Delivery
                      </Text>
                      <Text
                        style={{
                          fontSize: themes.FONT_SIZE_MEDIUM,
                          fontWeight: 'bold',
                        }}>
                        {`✭ ${item.deliveryRating.toFixed(2)}`}
                      </Text>
                    </View>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: 'center',
                        alignItems: 'center',
                      }}>
                      <Text style={{fontSize: themes.FONT_SIZE_MEDIUM}}>
                        Packaging
                      </Text>
                      <Text
                        style={{
                          fontSize: themes.FONT_SIZE_MEDIUM,
                          fontWeight: 'bold',
                        }}>
                        {`✭ ${item.packagingRating.toFixed(2)}`}
                      </Text>
                    </View>
                  </View>
                </View>
              ) : null}
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
                  onPress={() => {
                    props.navigation.navigate('ViewDetails', {order: item});
                  }}
                  style={{
                    backgroundColor: themes.BUTTON_GREEN_BACKGROUND,
                    // padding: 5,
                    borderRadius: 10,
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    margin: 2,
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: themes.FONT_SIZE_NORMAL,
                      textAlignVertical: 'center',
                      textAlign: 'center',
                    }}>
                    View Current Order
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => {
                    props.navigation.navigate('PatientReport', {
                      allOrders: allOrders,
                      selectedUser: item.userId,
                    });
                  }}
                  style={{
                    backgroundColor: themes.BUTTON_GREEN_BACKGROUND,
                    // padding: 5,
                    borderRadius: 10,
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    margin: 2,
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: themes.FONT_SIZE_NORMAL,
                      textAlignVertical: 'center',
                      textAlign: 'center',
                    }}>
                    View Order History
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          onEndReached={() => {
            if (endReached) {
              // MedToast.show('No More Orders To Load');
            } else {
              console.log('ON END REACHED CALLED LOAD MORE');
              loadMoreOrders();
            }
          }}
          onEndReachedThreshold={0.1}
          ListFooterComponent={() => (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>
              {orderloading ? (
                <ActivityIndicator
                  color="black"
                  size="large"
                  style={{margin: 15}}
                />
              ) : null}
            </View>
          )}
          ListEmptyComponent={
            <EmptyListView
              message={loading ? 'Loading Orders' : 'No Orders Available'}
              loadingMessage={'Loading Orders'}
              loading={loading}
            />
          }
        />
        {finalResult.length <= 0 && !endReached ? (
          <View style={{flexDirection: 'row'}}>
            {/* <View style={{flex: 1}} /> */}
            <View style={{flex: 1}}>
              <CustomButton
                text="More Orders Available. Load"
                onPress={() => {
                  if (endReached) {
                    MedToast.show('No More Orders To Load');
                  } else {
                    console.log('ON END REACHED CALLED LOAD MORE');
                    loadMoreOrders();
                  }
                }}
              />
            </View>
          </View>
        ) : null}
        {/* <ScrollView
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
                    {formateDate(order.orderTime)}
                  </Text>
                </View>
                <View style={{marginTop: 10, flexDirection: 'row'}}>
                  <Text style={{fontSize: themes.FONT_SIZE_MEDIUM}}>
                    Name:{' '}
                  </Text>
                  <Text
                    style={{
                      fontSize: themes.FONT_SIZE_MEDIUM,
                      fontWeight: 'bold',
                    }}>
                    {order.user.name}
                  </Text>
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
                <View style={{marginTop: 10, flexDirection: 'row'}}>
                  <Text style={{fontSize: themes.FONT_SIZE_MEDIUM}}>
                    Payment Status:{' '}
                  </Text>
                  <Text
                    style={{
                      fontSize: themes.FONT_SIZE_MEDIUM,
                      fontWeight: 'bold',
                    }}>
                    {order.paymentDone
                      ? order.paymentVerified
                        ? 'Done'
                        : 'Verification Required'
                      : 'Pending'}
                  </Text>
                </View>
                {order.totalRating ? (
                  <View>
                    <Text
                      style={{
                        marginTop: 10,
                        fontSize: themes.FONT_SIZE_MEDIUM,
                      }}>
                      {'Rating: '}
                    </Text>
                    <View style={{flexDirection: 'row'}}>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                          marginRight: 10,
                        }}>
                        <Text style={{fontSize: themes.FONT_SIZE_MEDIUM}}>
                          Overall
                        </Text>
                        <Text
                          style={{
                            fontSize: themes.FONT_SIZE_MEDIUM,
                            fontWeight: 'bold',
                          }}>
                          {`✭ ${order.totalRating.toFixed(2)}`}
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize: themes.FONT_SIZE_MEDIUM,
                            textAlign: 'center',
                          }}>
                          Medicine Availability
                        </Text>
                        <Text
                          style={{
                            fontSize: themes.FONT_SIZE_MEDIUM,
                            fontWeight: 'bold',
                          }}>
                          {`✭ ${order.availabilityRating.toFixed(2)}`}
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text
                          style={{
                            fontSize: themes.FONT_SIZE_MEDIUM,
                            textAlign: 'center',
                          }}>
                          On Time Delivery
                        </Text>
                        <Text
                          style={{
                            fontSize: themes.FONT_SIZE_MEDIUM,
                            fontWeight: 'bold',
                          }}>
                          {`✭ ${order.deliveryRating.toFixed(2)}`}
                        </Text>
                      </View>
                      <View
                        style={{
                          flex: 1,
                          justifyContent: 'center',
                          alignItems: 'center',
                        }}>
                        <Text style={{fontSize: themes.FONT_SIZE_MEDIUM}}>
                          Packaging
                        </Text>
                        <Text
                          style={{
                            fontSize: themes.FONT_SIZE_MEDIUM,
                            fontWeight: 'bold',
                          }}>
                          {`✭ ${order.packagingRating.toFixed(2)}`}
                        </Text>
                      </View>
                    </View>
                  </View>
                ) : null}
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
                    onPress={() => {
                      props.navigation.navigate('ViewDetails', {order: order});
                    }}
                    style={{
                      backgroundColor: themes.BUTTON_GREEN_BACKGROUND,
                      // padding: 5,
                      borderRadius: 10,
                      paddingVertical: 10,
                      paddingHorizontal: 10,
                      margin: 2,
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: themes.FONT_SIZE_NORMAL,
                        textAlignVertical: 'center',
                        textAlign: 'center',
                      }}>
                      View Current Order
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => {
                      props.navigation.navigate('PatientReport', {
                        allOrders: allOrders,
                        selectedUser: order.userId,
                      });
                    }}
                    style={{
                      backgroundColor: themes.BUTTON_GREEN_BACKGROUND,
                      // padding: 5,
                      borderRadius: 10,
                      paddingVertical: 10,
                      paddingHorizontal: 10,
                      margin: 2,
                    }}>
                    <Text
                      style={{
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: themes.FONT_SIZE_NORMAL,
                        textAlignVertical: 'center',
                        textAlign: 'center',
                      }}>
                      View Order History
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })}
        </ScrollView>
      */}
      </View>
    </PlainBaseView>
  );
};
export default SearchPage;
