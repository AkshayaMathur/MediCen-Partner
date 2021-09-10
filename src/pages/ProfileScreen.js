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
  ScrollView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Dialog, Portal} from 'react-native-paper';
import {AuthContext} from '../components/context';
import CustomButton from '../components/CustomButton';
import AddProfilePic from './AddProfilePic';
import ProfilePic from '../assets/profile.png';
import themes from '../themes';
import AppBar from '../components/AppBar';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CustomeProgress from '../components/CustomProgress';
import {getUserDetails} from '../utils/userprofile';
import pharmacyPic from '../assets/drugstore.png';
import deliveryImg from '../assets/food-delivery.png';
import packagingImg from '../assets/box.png';
import availabilityImg from '../assets/hand.png';
import {Platform} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import * as RNFS from 'react-native-fs';
import {PermissionsAndroid} from 'react-native';
import Device_Api from '../utils/api';
const SIZE = Dimensions.get('window');
const WIDTH = SIZE.width;
const HEIGHT = SIZE.HEIGHT;
const ProfileScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState({});
  const {signOut} = React.useContext(AuthContext);
  const [totalRating, setTotalRating] = useState('5');
  const [deliveryRating, setDeliveryRating] = useState('5');
  const [availabilityRating, setAvailabilityRating] = useState('5');
  const [packagingRating, setPackagingRating] = useState('5');
  const [numRating, setNumRating] = useState('0');
  const [profilePicture, setProfilePic] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [addInvoiceModalVisibility, setAddInvoiceModalVisibility] = useState(
    false,
  );
  const loginout = () => {
    signOut({
      email: 'user2@email.com',
      username: 'user2',
      password: 'pass1234',
      userToken: 'token12345',
    });
  };
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    getUserDetail();
  }, []);

  const getUserDetail = async () => {
    let userDetails = await getUserDetails();
    if (userDetails) {
      userDetails = JSON.parse(userDetails);
      // console.log('User Details are: ', userDetails)
      setUserDetails(userDetails);
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
      getUserProfilePicture(userDetails);
    }
    setLoading(false);
  };
  const getUserProfilePicture = (userDetails) => {
    console.log('PROFILE PIC IS:::::::::::::::::::::::::::::::', userDetails);
    if (userDetails.profilePic) {
      setProfileLoading(true);
      Device_Api.getPartnerProfilePic(userDetails.Id, userDetails.profilePic)
        .then((res) => {
          console.log('Result is: ', res);
          checkPermission([userDetails.profilePic], [res.body]);
          setProfileLoading(false);
        })
        .catch((err) => {
          setProfileLoading(false);
        });
    }
  };
  const checkPermission = async (keys, urls) => {
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
            downloadImage(keys, urls);
          } else {
          }
        } else {
          downloadImage(keys, urls);
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };

  const downloadImage = (keys, urls) => {
    console.log('Got Keys to download: ', keys, urls);
    if (keys.length <= 0) {
      return;
    }
    setProfileLoading(true);
    try {
      urls.map((url, mainIndex) => {
        const {config, fs} = RNFetchBlob;
        let PictureDir = fs.dirs.PictureDir;
        console.log('PictureDir', PictureDir);
        let options = {
          fileCache: true,
        };
        config(options)
          .fetch('GET', url)
          .then(async (res) => {
            console.log('REs is: ', res);
            // let r = await res.readStream();
            // console.log('R is: ', r);
            // r._onEnd((res) => console.log('jkjfjnfdlsdf', res));
            // console.log('R2 is: ', r);
            const imagePath = `${PictureDir}/${new Date().toISOString()}.jpg`.replace(
              /:/g,
              '-',
            );
            setProfileLoading(false);
            RNFS.copyFile(res.data, imagePath);
            // const {invoiceImages} = this.state;
            // invoiceImages.push({
            //   uri: imagePath,
            //   downloaded: true,
            //   name: keys[mainIndex],
            // });
            setProfilePic({
              uri: imagePath,
              name: keys[mainIndex],
            });
            // this.state.invoiceImages = invoiceImages;
            // console.log(invoiceImages);
            // this.setState({invoiceImages, loading: false}, () =>
            //   console.log('New Image is: ', this.state.invoiceImages),
            // );
          });
      });
    } catch (error) {
      setProfileLoading(false);
      console.log('An error Occurred while downloading img: ', error);
    }
  };
  const renderAddProfilePiceModal = () => {
    return (
      <Portal>
        <Dialog
          visible={addInvoiceModalVisibility}
          onDismiss={() => setAddInvoiceModalVisibility(false)}>
          <Dialog.Title
            style={{
              color: themes.TEXT_BLUE_COLOR,
              justifyContent: 'center',
              textAlign: 'center',
              borderBottomColor: themes.CONTENT_GREEN_BACKGROUND,
              borderBottomWidth: 3,
            }}>
            Profile Pic
          </Dialog.Title>
          <Dialog.ScrollArea>
            <AddProfilePic
              Id={userDetails.Id}
              profilePic={profilePicture}
              closeModal={() => {
                setLoading(true);
                setTimeout(() => {
                  setAddInvoiceModalVisibility(false);
                  setLoading(false);
                }, 2000);
              }}
            />
          </Dialog.ScrollArea>
        </Dialog>
      </Portal>
    );
  };
  return (
    <View style={{flex: 1}}>
      <AppBar />
      <CustomeProgress showprogress={loading} />
      <ScrollView style={{flex: 1, paddingVertical: 10, paddingHorizontal: 10}}>
        {loading ? null : (
          <View
            style={{
              shadowColor: '#0000',
              shadowOffset: {height: 10, width: 10},
              elevation: 10,
              backgroundColor: '#fff',
              padding: 5,
            }}>
            <View style={{flexDirection: 'row', paddingVertical: 10}}>
              <TouchableOpacity
                onPress={() => setAddInvoiceModalVisibility(true)}>
                {profilePicture ? (
                  profileLoading ? (
                    <ActivityIndicator
                      style={{
                        alignSelf: 'center',
                        // flex: 1,
                        width: 80,
                        height: 80,
                        // backgroundColor: 'pink',
                        flexDirection: 'row',
                      }}
                      size="large"
                      color="#000"
                    />
                  ) : (
                    <Image
                      source={{uri: 'file://' + profilePicture.uri}}
                      resizeMode="stretch"
                      style={{
                        width: 80,
                        height: 80,
                      }}
                    />
                  )
                ) : (
                  <Image
                    source={ProfilePic}
                    style={{
                      width: 80,
                      height: 80,
                      justifyContent: 'center',
                      alignSelf: 'center',
                    }}
                  />
                )}
                {/* <Image
                  source={ProfilePic}
                  style={{
                    width: 80,
                    height: 80,
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}
                /> */}
                <View
                  style={{
                    flex: 1,
                    position: 'absolute',
                    bottom: 0,
                    justifyContent: 'center',
                    alignItems: 'center',
                    // backgroundColor: 'yellow',
                    width: 80,
                  }}>
                  <Text style={{fontWeight: 'bold', color: '#aaa'}}>
                    {userDetails.profilePic ? 'UPDATE' : 'ADD'}
                  </Text>
                </View>
              </TouchableOpacity>
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: themes.FONT_SIZE_LARGE,
                    color: themes.TEXT_BLUE_COLOR,
                  }}>
                  {userDetails.name}
                </Text>

                <Text
                  style={{
                    textAlign: 'center',
                    // fontWeight: 'bold',
                    // fontSize: themes.FONT_SIZE_LARGE,
                    color: themes.TEXT_BLUE_COLOR,
                  }}>
                  {userDetails.mobileNumber}
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    // fontWeight: 'bold',
                    // fontSize: themes.FONT_SIZE_LARGE,
                    color: themes.TEXT_BLUE_COLOR,
                  }}>
                  {userDetails.emailId}
                </Text>
              </View>
            </View>
            <View style={{paddingVertical: 10}}>
              <Text
                style={{
                  fontSize: themes.FONT_SIZE_NORMAL,
                  color: themes.TEXT_BLUE_COLOR,
                }}>
                Contact Person:{' '}
                <Text style={{color: 'black'}}>
                  {userDetails.contactPerson}
                </Text>
              </Text>
              <Text
                style={{
                  fontSize: themes.FONT_SIZE_NORMAL,
                  color: themes.TEXT_BLUE_COLOR,
                }}>
                Description:{' '}
                <Text style={{color: 'black'}}>{userDetails.description}</Text>
              </Text>
              {/* <Text
                style={{
                  fontSize: themes.FONT_SIZE_NORMAL,
                  color: themes.TEXT_BLUE_COLOR,
                }}>
                Speciality:{' '}
                <Text style={{color: 'black'}}>{userDetails.speciality}</Text>
              </Text> */}
              <Text
                style={{
                  fontSize: themes.FONT_SIZE_NORMAL,
                  color: themes.TEXT_BLUE_COLOR,
                }}>
                Referal Code:
                <Text style={{color: 'black'}}>{userDetails.Id}</Text>
              </Text>
            </View>
            <View
              style={{
                height: 3,
                backgroundColor: themes.CONTENT_GREEN_BACKGROUND,
              }}
            />
            <View style={styles.ratingMainContent}>
              <View style={styles.ratingContent}>
                <Image
                  source={pharmacyPic}
                  style={styles.ratingImg}
                  resizeMode="contain"
                />
                <Text>Total Rating</Text>
                <Text>{`✭ ${totalRating}`}</Text>
              </View>
              <View style={styles.ratingContent}>
                <Image
                  source={availabilityImg}
                  style={styles.ratingImg}
                  resizeMode="contain"
                />
                <Text style={styles.ratingTextAlign}>
                  Medicine Availability
                </Text>
                <Text>{`✭ ${availabilityRating}`}</Text>
              </View>
              <View style={styles.ratingContent}>
                <Image
                  source={deliveryImg}
                  style={styles.ratingImg}
                  resizeMode="contain"
                />
                <Text style={styles.ratingTextAlign}>On Time Delivery</Text>
                <Text>{`✭ ${deliveryRating}`}</Text>
              </View>
              <View style={styles.ratingContent}>
                <Image
                  source={packagingImg}
                  style={styles.ratingImg}
                  resizeMode="contain"
                />
                <Text>Packaging</Text>
                <Text
                  style={styles.ratingTextAlign}>{`✭ ${packagingRating}`}</Text>
              </View>
            </View>
            <View
              style={{
                height: 3,
                backgroundColor: themes.CONTENT_GREEN_BACKGROUND,
              }}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate('EditAccount')}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 10,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View>
                <Text
                  style={{
                    // textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: themes.FONT_SIZE_LARGE,
                    color: themes.TEXT_BLUE_COLOR,
                  }}>
                  My Account
                </Text>
                <Text
                  style={{
                    // textAlign: 'center',
                    // fontWeight: 'bold',
                    fontSize: themes.FONT_SIZE_NORMAL,
                    color: themes.TEXT_BLUE_COLOR,
                  }}>
                  {'Edit Profile'}
                </Text>
              </View>
              <View style={{flex: 1, flexDirection: 'row-reverse'}}>
                <MaterialIcon
                  name="greater-than"
                  size={20}
                  color={themes.TEXT_BLUE_COLOR}
                />
              </View>
            </TouchableOpacity>
            <View
              style={{
                height: 3,
                backgroundColor: themes.CONTENT_GREEN_BACKGROUND,
              }}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate('MyPayment')}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 10,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View>
                <Text
                  style={{
                    // textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: themes.FONT_SIZE_LARGE,
                    color: themes.TEXT_BLUE_COLOR,
                  }}>
                  {'Online Payment'}
                </Text>
                <Text
                  style={{
                    // textAlign: 'center',
                    // fontWeight: 'bold',
                    fontSize: themes.FONT_SIZE_NORMAL,
                    color: themes.TEXT_BLUE_COLOR,
                  }}>
                  {'Payment Modes & Payments Made'}
                </Text>
              </View>
              <View style={{flex: 1, flexDirection: 'row-reverse'}}>
                <MaterialIcon
                  name="greater-than"
                  size={20}
                  color={themes.TEXT_BLUE_COLOR}
                />
              </View>
            </TouchableOpacity>
            <View
              style={{
                height: 3,
                backgroundColor: themes.CONTENT_GREEN_BACKGROUND,
              }}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate('GetSubscription')}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 10,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  // textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: themes.FONT_SIZE_LARGE,
                  color: themes.TEXT_BLUE_COLOR,
                }}>
                My Subscription
              </Text>
              <View style={{flex: 1, flexDirection: 'row-reverse'}}>
                <MaterialIcon
                  name="greater-than"
                  size={20}
                  color={themes.TEXT_BLUE_COLOR}
                />
              </View>
            </TouchableOpacity>
            <View
              style={{
                height: 3,
                backgroundColor: themes.CONTENT_GREEN_BACKGROUND,
              }}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate('GetReminders')}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 10,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  // textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: themes.FONT_SIZE_LARGE,
                  color: themes.TEXT_BLUE_COLOR,
                }}>
                My Reminders
              </Text>
              <View style={{flex: 1, flexDirection: 'row-reverse'}}>
                <MaterialIcon
                  name="greater-than"
                  size={20}
                  color={themes.TEXT_BLUE_COLOR}
                />
              </View>
            </TouchableOpacity>
            <View
              style={{
                height: 3,
                backgroundColor: themes.CONTENT_GREEN_BACKGROUND,
              }}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate('ErrorReport')}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 10,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  // textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: themes.FONT_SIZE_LARGE,
                  color: themes.TEXT_BLUE_COLOR,
                }}>
                Report Error / Give Suggestion
              </Text>
              <View style={{flex: 1, flexDirection: 'row-reverse'}}>
                <MaterialIcon
                  name="greater-than"
                  size={20}
                  color={themes.TEXT_BLUE_COLOR}
                />
              </View>
            </TouchableOpacity>
            <View
              style={{
                height: 3,
                backgroundColor: themes.CONTENT_GREEN_BACKGROUND,
              }}
            />
          </View>
        )}
        <View style={{flex: 1, flexDirection: 'column-reverse'}}>
          <View style={{paddingVertical: 25, paddingHorizontal: 25}}>
            <CustomButton text="LOGOUT" onPress={loginout} />
          </View>
        </View>
        {renderAddProfilePiceModal()}
      </ScrollView>
    </View>
  );
};
export default ProfileScreen;

const styles = StyleSheet.create({
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
    marginVertical: 10,
  },
  ratingContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  ratingImg: {width: 50, height: 50},
  ratingTextAlign: {textAlign: 'center'},
});
