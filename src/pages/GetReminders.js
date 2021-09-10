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
  TextInput,
  FlatList,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import Device_Api from '../utils/api';
import {getUserDetails} from '../utils/userprofile';
import themes from '../themes';
import {formateDate} from '../utils/date.formatter';
import {getRepeatOrderString} from '../utils/generalFunction';
import CustomeProgress from '../components/CustomProgress';
import MedToast from '../components/MedToast';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
const GetReminders = (props) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getSubscription();
  }, []);
  const getSubscription = async () => {
    let user = await getUserDetails();
    console.log('useruseruseruser: ', user);
    if (user) {
      setLoading(true);
      user = JSON.parse(user);
      Device_Api.getUsersReminders(user.Id)
        .then((res) => {
          console.log(res);
          setSubscriptions(res.body);
          setLoading(false);
        })
        .catch((err) => {
          console.log('Error in get subscription: ', err);
          MedToast.show('An error occurred while fetching data');
          setLoading(false);
        });
    }
  };
  const sortBasedOnNextDeliveryDate = (data) => {
    const sortedData = data.sort(function (var1, var2) {
      if (var1.nextDeliveryDate > var2.nextDeliveryDate) {
        return 1;
      } else if (var1.nextDeliveryDate < var2.nextDeliveryDate) {
        return -1;
      }
      return 0;
    });
    return sortedData;
  };
  const navigateToShowDetails = (subDetails) => {
    props.navigation.navigate('ShowSubscriptionDetails', {
      subDetails: subDetails,
    });
  };
  const refreshReminder = () => {
    getSubscription();
  };
  return (
    <View style={styles.container}>
      <CustomeProgress showprogress={loading} />
      <FlatList
        data={subscriptions}
        renderItem={({item, index}) => (
          <TouchableOpacity
            onPress={() =>
              props.navigation.navigate('EditReminders', {
                reminderDetails: item,
                refresh: refreshReminder,
              })
            }
            style={{
              shadowColor: '#0000',
              shadowOffset: {height: 10, width: 10},
              elevation: 10,
              backgroundColor: '#fff',
              padding: 5,
              paddingHorizontal: 15,
              paddingVertical: 12,
              margin: 10,
            }}>
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: themes.FONT_SIZE_LARGE,
                  color: themes.TEXT_BLUE_COLOR,
                }}>
                {`${item.message}`}
              </Text>
            </View>
            <View style={{marginTop: 10}}>
              <Text>{`Next Reminder Date: ${item.nextReminderDate}`}</Text>
              <Text>{`Expiry Date: ${formateDate(item.expiryDate)}`}</Text>
              {/* <Text>{`Number of Medicine: ${item.orderDetails.lineItem.length}`}</Text> */}
            </View>
          </TouchableOpacity>
        )}
      />
      <TouchableOpacity
        activeOpacity={0.5}
        onPress={() => {
          props.navigation.navigate('CreateNewReminder', {
            refresh: refreshReminder,
          });
        }}
        style={{
          borderWidth: 1,
          borderColor: 'rgba(0,0,0,0.2)',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 8,
          paddingHorizontal: 10,
          position: 'absolute',
          bottom: 50,
          right: 5,
          backgroundColor: themes.BUTTON_GREEN_BACKGROUND,
          borderRadius: 100,
        }}>
        <View style={{flexDirection: 'row'}}>
          <MaterialIcons name="add-circle" size={25} color="#fff" />
          <Text
            style={{
              fontSize: themes.FONT_SIZE_LARGE,
              fontWeight: 'bold',
              color: '#fff',
              alignSelf: 'center',
              marginLeft: 2,
            }}>
            {' Reminder'}
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default GetReminders;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: 10,
    marginVertical: 10,
  },
  listContainer: {
    elevation: 10,
    padding: 10,
    // shadowColor: '#00000',
    shadowRadius: 25,
    shadowOffset: {height: 1, width: 0},
    backgroundColor: '#fff',
    marginBottom: 30,
  },
  listLine: {marginTop: 10, flexDirection: 'row'},
  answerLabel: {
    fontSize: themes.FONT_SIZE_MEDIUM,
    fontWeight: 'bold',
  },
  questionLabel: {
    fontSize: themes.FONT_SIZE_MEDIUM,
  },
  smallDivider: {
    backgroundColor: themes.GREEN_BLUE,
    width: 1,
    margin: 2,
    marginHorizontal: 10,
  },
  mainDivider: {
    height: 2,
    backgroundColor: themes.GREEN_BLUE,
    marginTop: 15,
  },
});
