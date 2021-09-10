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
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import PlainBaseView from '../components/PlainBaseView';
import AppBar from '../components/AppBar';
import themes from '../themes';
import CustomeProgress from '../components/CustomProgress';
import {getMonth} from '../utils/date.formatter';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';
import {getStatusString} from '../utils/generalFunction';
import {formateDate} from '../utils/date.formatter';
import {Modal} from 'react-native';
import SiCheckBox from '../components/SiCheckBox';
import Device_Api from '../utils/api';
import {getUserDetails} from '../utils/userprofile';
const STATUS = [
  'all',
  'awaiting',
  'preparing',
  'awaiting_cust',
  'dispatch',
  'delivered',
  'cancelled',
];
const TIMEFILTER = ['30days', '6months', 'year'];
const TIMEFILTER_MSG = ['Last 30 Days', 'Last 6 Months', 'Last Year'];
const PatientReport = (props) => {
  const [loading, setLoading] = useState(false);
  const [custName, setCustName] = useState('');
  const [custOrders, setCustOrder] = useState([]);
  const [custallOrders, setCustallOrder] = useState([]);
  const [custNumOrders, setCustNumOrder] = useState([]);
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [selectedFilterOrderStatus, setSelectedFilterOrderStatus] = useState(
    'all',
  );
  const [selectedTimeFilter, setSelectedTimeFilter] = useState('year');
  const [pieChartData, setPieChartData] = React.useState([]);
  useEffect(() => {
    props.navigation.setOptions({
      headerShown: false,
    });
    console.log(
      'PROPS ARE:::::::::::::::::::::: ',
      props.route.params.selectedUser,
    );
    init();
  }, []);
  const monthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'June',
    'July',
    'Aug',
    'Sept',
    'Oct',
    'Nov',
    'Dec',
  ];

  const init = () => {
    const allOrders = props.route.params.allOrders;
    const selectedUser = props.route.params.selectedUser;
    getAllUserOrders(selectedUser);
    let filteredOrder = [...new Array(12)].map((x) => 0);

    let timeMap = new Map();
    const userOrders = [];
    // console.log('All order is: ,', allOrders)

    allOrders.map((order) => {
      if (order.userId === selectedUser) {
        if (custName === '') {
          console.log('Cust Name is: ', order.user.name);
          setCustName(order.user.name);
        }
        userOrders.push(order);
        const month = getMonth(order.orderTime);
        if (timeMap.has(month)) {
          const total = timeMap.get(month);
          timeMap.set(month, total + 1);
          filteredOrder[month] = total + 1;
        } else {
          timeMap.set(month, 1);
          filteredOrder[month] = 1;
        }
      }
    });

    console.log('Time Map is: ', filteredOrder);
    setCustOrder(userOrders);
    analyzingPieChartData(userOrders);
    setCustallOrder(userOrders);
    setCustNumOrder(filteredOrder);
  };

  const getAllUserOrders = async (userId) => {
    let user = await getUserDetails();
    if (user) {
      user = JSON.parse(user);
      setLoading(true);
      Device_Api.getSimilarUserOrders(user.Id, userId)
        .then((res) => {
          const allOrders = res['body'];
          const userOrders = [];
          let filteredOrder = [...new Array(12)].map((x) => 0);
          let timeMap = new Map();
          allOrders.map((order) => {
            if (order.userId === userId) {
              if (custName === '') {
                console.log('Cust Name is: ', order.user.name);
                setCustName(order.user.name);
              }
              userOrders.push(order);
              const month = getMonth(order.orderTime);
              if (timeMap.has(month)) {
                const total = timeMap.get(month);
                timeMap.set(month, total + 1);
                filteredOrder[month] = total + 1;
              } else {
                timeMap.set(month, 1);
                filteredOrder[month] = 1;
              }
            }
          });
          setCustOrder(userOrders);
          analyzingPieChartData(userOrders);
          setCustallOrder(userOrders);
          setCustNumOrder(filteredOrder);
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          console.log('An error while fetching all orders');
        });
    }
  };
  const getColor = () => {
    return (
      'hsl(' +
      360 * Math.random() +
      ',' +
      (25 + 70 * Math.random()) +
      '%,' +
      (85 + 10 * Math.random()) +
      '%)'
    );
  };
  const analyzingPieChartData = (orders) => {
    let map = new Map();
    orders.map((o) => {
      o.lineItem.map((medName) => {
        if (map.has(medName.name)) {
          const total = map.get(medName.name);
          map.set(medName.name, total + 1);
        } else {
          map.set(medName.name, 1);
        }
      });
    });
    console.log(
      'map is::::::::::::::::::::::::::::::::::::::::::::::::::',
      map,
    );
    let finalData = [];
    for (let medName of map.keys()) {
      console.log(medName); // cucumber, tomatoes, onion
      let color = getRandomColor();
      finalData.push({
        name: medName,
        numOrder: map.get(medName),
        color: color,
        legendFontColor: color,
        legendFontSize: 10,
      });
    }
    console.log('finalDatafinalDatafinalDatafinalData', finalData);
    setPieChartData(finalData);
  };
  const getRandomColor = () => {
    var letters = '0123456789ABCDEF';
    var color = '#';
    for (var i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 15)];
    }
    return color;
  };

  const filterDataBasedOnSelectedStatus = () => {
    let status = selectedFilterOrderStatus;
    const filterData = [];
    if (status === 'all') {
      console.log('THIS IS SET');
      setCustOrder(custallOrders);
    } else {
      custallOrders.map((o) => {
        if (o.status === status) {
          filterData.push(o);
        }
      });
      setCustOrder(filterData);
    }
    // setSelectedFilter(status);
  };
  const filterData = () => {
    filterDataBasedOnSelectedStatus();
    setShowFilterModal(false);
  };

  const renderFilterModal = () => {
    return (
      <Modal visible={showFilterModal}>
        <ScrollView style={{flex: 1, marginHorizontal: 10}}>
          <View style={{marginVertical: 10}}>
            <Text
              style={{
                fontSize: themes.FONT_SIZE_LARGE,
                color: themes.TEXT_BLUE_COLOR,
                textAlign: 'center',
                fontWeight: 'bold',
              }}>
              Filter
            </Text>
            <View
              style={{
                height: 2,
                backgroundColor: themes.GREEN_BLUE,
                marginTop: 15,
              }}
            />
          </View>
          <View style={{marginVertical: 10}}>
            <Text
              style={{
                fontSize: themes.FONT_SIZE_MEDIUM,
                color: themes.TEXT_BLUE_COLOR,
              }}>
              Order Status
            </Text>
            {STATUS.map((status) => {
              return (
                <SiCheckBox
                  title={getStatusString(status)}
                  containerStyle={{
                    backgroundColor: '#fff',
                    // margin: 0,
                    marginHorizontal: 0,
                    // marginVertical: 0,
                    // padding: 5,
                    // borderWidth: 0,
                  }}
                  onPressCheckbox={() => {
                    setSelectedFilterOrderStatus(status);
                  }}
                  checked={selectedFilterOrderStatus === status ? true : false}
                />
              );
            })}
          </View>
          <View
            style={{
              height: 2,
              backgroundColor: themes.GREEN_BLUE,
              marginTop: 15,
            }}
          />
          <View style={{marginVertical: 10}}>
            <Text
              style={{
                fontSize: themes.FONT_SIZE_MEDIUM,
                color: themes.TEXT_BLUE_COLOR,
              }}>
              Time Filter
            </Text>
            {TIMEFILTER.map((status, index) => {
              return (
                <SiCheckBox
                  title={TIMEFILTER_MSG[index]}
                  containerStyle={{
                    backgroundColor: '#fff',
                    // margin: 0,
                    marginHorizontal: 0,
                    // marginVertical: 0,
                    // padding: 5,
                    // borderWidth: 0,
                  }}
                  onPressCheckbox={() => {
                    setSelectedTimeFilter(status);
                  }}
                  checked={selectedTimeFilter === status ? true : false}
                />
              );
            })}
          </View>
          <View style={{flexDirection: 'row', marginVertical: 10}}>
            <TouchableOpacity
              onPress={() => {
                setSelectedFilterOrderStatus('all');
                setSelectedTimeFilter('year');
                setShowFilterModal(false);
              }}
              style={{
                flex: 1,
                backgroundColor: 'red',
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
                Reset
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => filterData()}
              style={{
                flex: 1,
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
                Apply FIlter
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </Modal>
    );
  };

  return (
    <PlainBaseView color={themes.CONTENT_GREEN_BACKGROUND}>
      <View style={{flex: 1}}>
        <AppBar />
        <ScrollView style={{paddingVertical: 10}}>
          <CustomeProgress showprogress={loading} />
          <Text
            style={{
              fontSize: themes.FONT_SIZE_MEDIUM,
              color: themes.TEXT_BLUE_COLOR,
              fontWeight: 'bold',
            }}>{`Customer ${custName} Orders`}</Text>
          <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
            <BarChart
              verticalLabelRotation={90}
              data={{
                labels: monthNames,
                datasets: [
                  {
                    data: custNumOrders,
                  },
                ],
              }}
              // bezier
              width={Dimensions.get('window').width + 200}
              height={250}
              yAxisLabel={''}
              chartConfig={{
                backgroundColor: '#1cc910',
                backgroundGradientFrom: '#eff3ff',
                backgroundGradientTo: '#efefef',
                decimalPlaces: 1,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  borderRadius: 16,
                  marginRight: 10,
                },
              }}
              style={{
                marginVertical: 8,
                borderRadius: 16,
                fontSize: 1,
                marginRight: 50,
                marginLeft: 10,
              }}
            />
          </ScrollView>
          <ScrollView showsHorizontalScrollIndicator={false} horizontal={true}>
            <PieChart
              data={pieChartData}
              width={Dimensions.get('window').width + 50}
              height={220}
              chartConfig={{
                backgroundColor: '#1cc910',
                backgroundGradientFrom: '#eff3ff',
                backgroundGradientTo: '#efefef',
                decimalPlaces: 2,
                color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                style: {
                  // borderRadius: 16,
                },
              }}
              style={
                {
                  // marginVertical: 8,
                  // borderRadius: 16,
                }
              }
              accessor="numOrder"
              backgroundColor="transparent"
              // paddingLeft="1"
              // absolute //for the absolute number remove if you want percentage
            />
          </ScrollView>
          <View
            style={{
              marginVertical: 10,
              marginHorizontal: 10,
              flexDirection: 'row',
            }}>
            <Text style={{fontSize: themes.FONT_SIZE_SMALL}}>
              Past 12 Months
            </Text>
            <TouchableHighlight
              underlayColor={'#fff'}
              onPress={() => setShowFilterModal(true)}
              style={{flex: 1, flexDirection: 'row-reverse'}}>
              <Text
                style={{
                  fontSize: themes.FONT_SIZE_MEDIUM,
                  paddingHorizontal: 10,
                  borderWidth: 2,
                  borderColor: themes.CONTENT_GREEN_BACKGROUND,
                  borderRadius: 10,
                }}>
                {'Filter  >'}
              </Text>
            </TouchableHighlight>
          </View>
          <View>
            <FlatList
              data={custOrders}
              ListEmptyComponent={() => (
                <View
                  style={{
                    margin: 10,
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Text
                    style={{
                      color: themes.TEXT_BLUE_COLOR,
                      fontWeight: 'bold',
                      fontSize: themes.FONT_SIZE_LARGE,
                    }}>
                    No Orders Available
                  </Text>
                </View>
              )}
              renderItem={({item, index}) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => {
                    props.navigation.navigate('ViewDetails', {
                      order: item,
                    });
                  }}
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
                    <Text style={{fontSize: themes.FONT_SIZE_MEDIUM}}>
                      Name:{' '}
                    </Text>
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
                  {/* <View
                    style={{
                      justifyContent: 'space-around',
                      flexDirection: 'row',
                      marginTop: 10,
                    }}> */}
                  {/* <TouchableOpacity
                      onPress={() => {
                        props.navigation.navigate('ViewDetails', {
                          order: order,
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
                        View Current Order
                      </Text>
                    </TouchableOpacity> */}
                  {/* <TouchableOpacity
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
                    </TouchableOpacity> */}
                  {/* </View> */}
                </TouchableOpacity>
              )}
            />
            {/* {custOrders.map((order, index) => {
              return (
                       );
            })} */}
          </View>
        </ScrollView>
        {renderFilterModal()}
      </View>
    </PlainBaseView>
  );
};

export default PatientReport;
