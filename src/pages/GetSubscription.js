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
const GetSubscription = (props) => {
  const [subscriptions, setSubscriptions] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    getSubscription();
  }, []);
  const getSubscription = async () => {
    let user = await getUserDetails();
    if (user) {
      setLoading(true);
      user = JSON.parse(user);
      Device_Api.getPartnerSubscription(user.Id)
        .then((res) => {
          console.log(res);
          setSubscriptions(sortBasedOnNextDeliveryDate(res.body));
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
  return (
    <View style={styles.container}>
      <CustomeProgress showprogress={loading} />
      <FlatList
        data={subscriptions}
        renderItem={({item, index}) => (
          <TouchableOpacity
            key={index}
            style={styles.listContainer}
            onPress={() => navigateToShowDetails(item)}>
            <View style={styles.listLine}>
              <Text style={styles.questionLabel}>Next Delivery Date: </Text>
              <Text style={styles.answerLabel}>{item.nextDeliveryDate}</Text>
            </View>
            <View style={styles.listLine}>
              <Text style={{fontSize: themes.FONT_SIZE_MEDIUM}}>
                {'Frequency: '}
              </Text>
              <Text style={styles.answerLabel}>
                {getRepeatOrderString(item.frequency)}
              </Text>
              <View style={styles.smallDivider} />
              <Text style={{fontSize: themes.FONT_SIZE_MEDIUM}}>
                {formateDate(item.orderTime)}
              </Text>
            </View>
            <View style={styles.listLine}>
              <Text style={{fontSize: themes.FONT_SIZE_MEDIUM}}>Name: </Text>
              <Text style={styles.answerLabel}>{item.userDetail.name}</Text>
            </View>

            {item.orderDetails ? (
              <View style={styles.listLine}>
                <Text style={{fontSize: themes.FONT_SIZE_MEDIUM}}>
                  Patient Name:{' '}
                </Text>
                <Text style={styles.answerLabel}>
                  {item.orderDetails.patientName}
                </Text>
              </View>
            ) : null}

            <View style={styles.mainDivider} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

export default GetSubscription;
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
