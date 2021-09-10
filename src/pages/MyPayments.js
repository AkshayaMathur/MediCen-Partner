import React, {Component} from 'react';
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
  ScrollView,
  Button,
  FlatList,
  PermissionsAndroid,
} from 'react-native';
import CustomeProgress from '../components/CustomProgress';
import themes from '../themes';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Device_Api from '../utils/api';
import {getUserDetails} from '../utils/userprofile';
import EmptyListView from '../components/EmptyListView';
import RNFetchBlob from 'rn-fetch-blob';
import * as RNFS from 'react-native-fs';
import {Platform} from 'react-native';
import {deleteitem, getItem, setItem} from '../utils/secureStorage';
import MedToast from '../components/MedToast';
class MyPayments extends Component {
  state = {
    loading: false,
    paymentModes: [],
  };
  constructor(props) {
    super(props);
    this.getUpiDetails();
  }

  getUpiDetails = async () => {
    let userDetails = await getUserDetails();
    if (userDetails) {
      userDetails = JSON.parse(userDetails);
      this.setState({loading: true});
      Device_Api.getUpiDetails(userDetails.Id)
        .then((res) => {
          console.log('Result is: ', res);
          let keys = [];
          res.body.map((res) => {
            keys.push(res.imageUrl);
          });
          this.checkPermission(keys, res.body);
          this.setState({paymentModes: res.body, loading: false});
        })
        .catch((err) => {
          this.setState({loading: false});
          console.log('An error occurred', err);
        });
    }
  };
  checkPermission = async (keys, data) => {
    try {
      if (keys) {
        if (Platform.OS === 'android') {
          const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
              title: 'Storage Permission Required',
              message:
                'This app needs access to your storage to download Photos',
            },
          );
          if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            this.downloadImage(keys, data);
          } else {
          }
        } else {
          this.downloadImage(keys, data);
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };
  downloadImage = (keys, data) => {
    console.log('Got Keys to download: ', keys);
    if (keys.length > 0) {
      this.setState({loading: true});
      try {
        keys.map(async (key, index) => {
          const alreadyExist = await getItem(`payment_${data[index].key}`);
          console.log('Already exsisting image is: ', alreadyExist);
          if (alreadyExist) {
            let {paymentModes} = this.state;
            paymentModes[index].imageUrl = alreadyExist;
            // paymentModes.push(JSON.parse(alreadyExist));
            // deleteitem(`payment_${data[index].key}`);

            this.setState({paymentModes}, () =>
              console.log('New Image is: ', this.state.paymentModes),
            );
            if (keys.length - 1 === index) {
              this.setState({loading: false});
            }
          } else {
            const {config, fs} = RNFetchBlob;
            let PictureDir = fs.dirs.PictureDir;
            // console.log('PictureDir', PictureDir);
            let options = {
              fileCache: true,
            };
            config(options)
              .fetch('GET', data[index].imageUrl)
              .then(async (res) => {
                console.log('Images in Res is: ', res);
                const imagePath = `${PictureDir}/${new Date().toISOString()}.jpg`.replace(
                  /:/g,
                  '-',
                );
                RNFS.copyFile(res.data, imagePath);
                const {paymentModes} = this.state;
                // let obj = {
                //   uri: 'file://' + imagePath,
                //   data: data[index],
                //   imgSelected: false,
                //   name: data[index].imageKey,
                // };
                paymentModes[index].imageUrl = imagePath;
                // images.push(obj);
                setItem(`payment_${data[index].key}`, imagePath);
                this.setState({paymentModes}, () =>
                  console.log('New Image is: ', this.state.paymentModes),
                );
                if (keys.length - 1 === index) {
                  this.setState({loading: false});
                }
              })
              .catch((err) => {
                console.log(
                  'An error Occurred while downloading the image.............................',
                  err,
                );
                MedToast.show('An Error Occurred While Downloading Image');
                this.setState({loading: false});
              });
          }
        });
      } catch (error) {
        console.log('An error Occurred while downloading img: ', error);
        this.setState({loading: false});
      }
    }
  };
  render() {
    const {loading, paymentModes} = this.state;
    return (
      <View style={styles.container}>
        <ScrollView>
          <View style={{flexDirection: 'row'}}>
            <Text
              style={{
                fontSize: themes.FONT_SIZE_LARGE,
                color: themes.TEXT_BLUE_COLOR,
                fontWeight: 'bold',
              }}>
              Payment Modes
            </Text>
            <View style={{flex: 1, flexDirection: 'row-reverse'}}>
              <TouchableOpacity
                activeOpacity={0.5}
                onPress={() => {
                  this.props.navigation.navigate('AddPaymentMode');
                }}
                style={{
                  borderWidth: 1,
                  borderColor: 'rgba(0,0,0,0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: 8,

                  paddingHorizontal: 10,
                  // position: 'absolute',
                  // bottom: 50,
                  // right: 5,
                  backgroundColor: themes.BUTTON_GREEN_BACKGROUND,
                  borderRadius: 100,
                }}>
                <View style={{flexDirection: 'row'}}>
                  <MaterialIcons name="add-circle" size={20} color="#fff" />
                  {/* <Text
                    style={{
                      fontSize: themes.FONT_SIZE_MEDIUM,
                      fontWeight: 'bold',
                      color: '#fff',
                      alignSelf: 'center',
                      marginLeft: 2,
                    }}>
                    {'Add'}
                  </Text> */}
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <FlatList
            data={paymentModes}
            // horizontal={true}
            ListEmptyComponent={
              <EmptyListView
                message={
                  loading
                    ? 'Loading Payment Methods'
                    : 'No Payment Methods Available'
                }
                loadingMessage={'Loading Payment Methods'}
                loading={loading}
              />
            }
            renderItem={({item, index}) => (
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate('AddPaymentMode', {
                    paymentDetails: item,
                    refresh: this.getUpiDetails,
                  })
                }
                style={{
                  shadowColor: '#0000',
                  shadowOffset: {height: 5, width: 1},
                  elevation: 10,
                  backgroundColor: '#fff',
                  padding: 5,
                  paddingHorizontal: 15,
                  paddingVertical: 12,
                  margin: 10,
                }}>
                <Image
                  source={{uri: 'file://' + item.imageUrl}}
                  resizeMode="contain"
                  style={{width: '100%', height: 200, marginVertical: 10}}
                />
                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      // fontWeight: 'bold',
                      fontSize: themes.FONT_SIZE_MEDIUM,
                      // color: themes.TEXT_BLUE_COLOR,
                    }}>
                    {'Mobile Number: '}
                  </Text>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: themes.FONT_SIZE_MEDIUM,
                      color: themes.TEXT_BLUE_COLOR,
                    }}>
                    {`${item.mobileNumber}`}
                  </Text>
                </View>

                <View style={{flexDirection: 'row'}}>
                  <Text
                    style={{
                      // fontWeight: 'bold',
                      fontSize: themes.FONT_SIZE_MEDIUM,
                      // color: themes.TEXT_BLUE_COLOR,
                    }}>
                    {'UPI ID: '}
                  </Text>
                  <Text
                    style={{
                      fontWeight: 'bold',
                      fontSize: themes.FONT_SIZE_MEDIUM,
                      color: themes.TEXT_BLUE_COLOR,
                    }}>
                    {`${item.upiId}`}
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </ScrollView>
      </View>
    );
  }
}

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

export default MyPayments;
