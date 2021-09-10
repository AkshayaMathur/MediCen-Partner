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
import {
  getUserDetails,
  setAllUserOrder,
  getAllUserOrders,
} from '../utils/userprofile';
import CustomeProgress from '../components/CustomProgress';
import {RefreshControl} from 'react-native';
import moment from 'moment';
import {formateDate} from '../utils/date.formatter';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';
const Research = (props) => {
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
  const [pieChartData, setPieChartData] = React.useState([]);
  useEffect(() => {
    props.navigation.setOptions({
      headerShown: false,
    });
  }, []);
  useEffect(() => {
    filterDataBasedOfSearchString();
  }, [searchString]);

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      console.log('Props is: ', props.route);
      getAllOrders();
      internalOrders();
    });
    return unsubscribe;
  }, [props.navigation]);

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
        legendFontSize: themes.FONT_SIZE_SMALL,
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

  const internalOrders = async () => {
    let allOrdersFromStorage = await getAllUserOrders();
    if (allOrdersFromStorage) {
      setAllOrders(allOrdersFromStorage);
      analyzingPieChartData(allOrdersFromStorage);
      setFinalResult(allOrdersFromStorage);
      setLoading(false);
    }
  };

  const getAllOrders = async () => {
    let user = await getUserDetails();
    if (user) {
      setLoading(true);
      user = JSON.parse(user);
      console.log('User is: ', user);
      fetch(
        'https://7d5simyvz0.execute-api.us-east-1.amazonaws.com/V1/medical-analysis',
        {
          method: 'POST',
          body: JSON.stringify({partnerId: user.Id}),
        },
      )
        .then((res) => res.json())
        .then((results) => {
          console.log('The response is: ', results['body']);
          let res = results['body'];
          // console.log(res.keys());
          let finalData = [];
          for (let medName in res) {
            console.log(medName); // cucumber, tomatoes, onion
            let color = getRandomColor();
            finalData.push({
              name: medName,
              numOrder: res[medName],
              color: color,
              legendFontColor: color,
              legendFontSize: 10,
            });
          }
          console.log('finalDatafinalDatafinalDatafinalData', finalData);
          setPieChartData(finalData);
          // const sortedData = res.body.sort(function (var1, var2) {
          //   if (var1.orderTime > var2.orderTime) {
          //     return -1;
          //   } else if (var1.orderTime < var2.orderTime) {
          //     return 1;
          //   }
          //   return 0;
          // });
          // console.log('Sorted Data is: ', sortedData);
          // setAllUserOrder(sortedData);
          // setAllOrders(sortedData);
          // setFinalResult(sortedData);
          // analyzingPieChartData(sortedData);
          // setLoading(false);
          // if (props.route.params && props.route.params.status) {
          //   filterInitialData(props.route.params.status, res.body);
          // }
        })
        .catch((err) => {
          console.log('An error while fetching all orders', err);
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
          {/* <View>
            <Text>Bezier Line Chart</Text>
            <LineChart
              data={{
                labels: [
                  'January',
                  'February',
                  'March',
                  'April',
                  'May',
                  'June',
                ],
                datasets: [
                  {
                    data: [
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                    ],
                  },
                  {
                    data: [
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                      Math.random() * 100,
                    ],
                  },
                ],
              }}
              width={Dimensions.get('window').width} // from react-native
              height={220}
              yAxisLabel="$"
              yAxisSuffix="k"
              yAxisInterval={1} // optional, defaults to 1
              chartConfig={{
                backgroundColor: '#e26a00',
                backgroundGradientFrom: '#fb8c00',
                backgroundGradientTo: '#ffa726',
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '#ffa726',
                },
              }}
              bezier
              style={{
                marginVertical: 8,
                borderRadius: 16,
              }}
            />
          </View> */}
          <View style={{paddingHorizontal: 10}}>
            <Text
              style={{
                fontSize: themes.FONT_SIZE_MEDIUM,
                color: themes.TEXT_BLUE_COLOR,
                fontWeight: 'bold',
              }}>
              Medicine Analysis
            </Text>
            <View
              style={{
                height: 2,
                backgroundColor: themes.GREEN_BLUE,
                marginTop: 15,
              }}
            />
            <ScrollView
              showsHorizontalScrollIndicator={false}
              horizontal={true}>
              <PieChart
                data={pieChartData}
                width={Dimensions.get('window').width + 100}
                height={200}
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
                style={{
                  marginVertical: 8,
                  // borderRadius: 16,
                }}
                accessor="numOrder"
                backgroundColor="transparent"
                // paddingLeft="0"
                // paddingLeft={'15'}
                // center={[10, 50]}
                // absolute
                // absolute //for the absolute number remove if you want percentage
              />
            </ScrollView>
          </View>
        </View>
      </View>
    </PlainBaseView>
  );
};
export default Research;
