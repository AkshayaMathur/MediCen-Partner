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
  Platform,
  PermissionsAndroid,
  ScrollView,
  Modal,
} from 'react-native';
import * as RNFS from 'react-native-fs';
import RNFetchBlob from 'rn-fetch-blob';
import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import Device_Api from '../utils/api';
import {getUserDetails} from '../utils/userprofile';
import themes from '../themes';
import {formateDate} from '../utils/date.formatter';
import {getRepeatOrderString} from '../utils/generalFunction';
import CustomeProgress from '../components/CustomProgress';
import MedToast from '../components/MedToast';
import WarnigPic from '../assets/warning.png';
import ImageViewer from 'react-native-image-zoom-viewer';
import ExpandeablePanel from '../components/ExpandeablePanel';
import SiCheckBox from '../components/SiCheckBox';
import CustomTextInput from '../components/CustomTextInput';
import MapView, {Marker} from 'react-native-maps';
const ShowSubscriptionDetails = (props) => {
  const [images, setImages] = useState([]);
  const [subDetails, setSubDetails] = useState({});
  const [medicineList, setMedicineList] = useState([]);
  const [medicineModal, setMedicineModal] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [loading, setLoading] = useState(false);
  const WIDTH = Dimensions.get('window').width - 10;
  const HEIGHT = Dimensions.get('window').height / 2 - 100;
  useEffect(() => {
    if (props.route.params) {
      const subDetails = props.route.params.subDetails;
      console.log('Subscription data is: ', subDetails);
      if (subDetails) {
        checkPermission(subDetails.orderDetails.keys);
        setSubDetails(subDetails);
        setMedicineList(subDetails.orderDetails.lineItem);
      }
    }
  }, []);
  const checkPermission = async (keys) => {
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
            downloadImage(keys);
          } else {
          }
        } else {
          downloadImage(keys);
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };
  const downloadImage = (keys) => {
    console.log('Got Keys to download: ', keys);
    // this.setState({showprogress: true});
    let downloadedImages = [];
    if (keys.length <= 0) {
      return;
    }
    setLoading(true);
    try {
      keys.map((key, index) => {
        fetch(
          'https://anaxvws1vf.execute-api.us-east-1.amazonaws.com/V1/download-image',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              filename: key,
              bucketName: 'medcen-data',
            }),
          },
        )
          .then((res) => res.json())
          .then(
            (result) => {
              console.log(result);
              const {config, fs} = RNFetchBlob;
              let PictureDir = fs.dirs.PictureDir;
              console.log('PictureDir', PictureDir);
              let options = {
                fileCache: true,
              };
              config(options)
                .fetch('GET', result.body)
                .then(async (res) => {
                  console.log('REs is: ', res);
                  const imagePath = `${
                    RNFS.DocumentDirectoryPath
                  }/${new Date().toISOString()}.jpg`.replace(/:/g, '-');
                  RNFS.copyFile(res.data, imagePath);
                  // const {images} = this.state;
                  downloadedImages.push({url: 'file://' + imagePath});
                  if (index === keys.length - 1) {
                    console.log('Setting Images');
                    setImages(downloadedImages);
                    setLoading(false);
                  }

                  // this.setState({images, showprogress: false}, () =>
                  //   console.log('New Image is: ', this.state.images),
                  // );
                });
            },
            (error) => {
              console.log(error);
              setLoading(false);
            },
          );
      });
    } catch (error) {
      console.log('An error Occurred while downloading img: ', error);
      setLoading(false);
    }
  };
  const renderChangeAddress = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{flex: 1, paddingVertical: 10, paddingHorizontal: 10}}>
        <View style={{marginHorizontal: 10, marginVertical: 10}}>
          <View style={{flexDirection: 'row'}}>
            <SiCheckBox
              title="Self Pickup"
              containerStyle={{
                backgroundColor: '#fff',
                margin: 0,
                marginHorizontal: 0,
                marginVertical: 0,
                padding: 5,
                borderWidth: 0,
              }}
              textStyle={{fontSize: themes.FONT_SIZE_MEDIUM}}
              checked={
                subDetails.orderDetails.address.deliveryType === 'pickup'
                  ? true
                  : false
              }
              // onPressCheckbox={() => this.setState({deliveryType: 'pickup'})}
            />
            <SiCheckBox
              title="Delivery"
              containerStyle={{
                backgroundColor: '#fff',
                margin: 0,
                marginHorizontal: 0,
                marginVertical: 0,
                padding: 5,
                borderWidth: 0,
              }}
              textStyle={{fontSize: themes.FONT_SIZE_MEDIUM}}
              checked={
                subDetails.orderDetails.address.deliveryType === 'delivery'
                  ? true
                  : false
              }
              onPressCheckbox={() => this.setState({deliveryType: 'delivery'})}
            />
          </View>
          {subDetails.orderDetails.address.deliveryType === 'pickup' ? null : (
            <View>
              <CustomTextInput
                editable
                required={true}
                field={{
                  label: 'PIN Code',
                  write: true,
                  value: subDetails.orderDetails.address.pincode,
                  type: 'phone',
                }}
                // onChangeText={(text) => this.setPincodeDate(text)}
                containerStyle={{marginBottom: 10}}
              />
              <CustomTextInput
                editable
                required={true}
                field={{
                  label: 'Flat, House No., Building,',
                  write: true,
                  value: subDetails.orderDetails.address.line1,
                }}
                // onChangeText={(text) => this.setState({line1: text})}
                containerStyle={{marginBottom: 10}}
              />
              <CustomTextInput
                editable
                required={true}
                field={{
                  label: 'Area, Colony, Street, Sector',
                  write: true,
                  value: subDetails.orderDetails.address.line2,
                }}
                // onChangeText={(text) => this.setState({line2: text})}
                containerStyle={{marginBottom: 10}}
              />
              <CustomTextInput
                editable
                required={true}
                field={{
                  label: 'Landmark',
                  write: true,
                  value: subDetails.orderDetails.address.line3,
                }}
                // onChangeText={(text) => this.setState({line3: text})}
                containerStyle={{marginBottom: 10}}
              />
              <CustomTextInput
                editable
                required={true}
                field={{
                  label: 'City/Town',
                  write: true,
                  value: subDetails.orderDetails.address.city,
                }}
                // onChangeText={(text) => this.setState({city: text})}
                containerStyle={{marginBottom: 10}}
              />
              <CustomTextInput
                editable
                required={true}
                field={{
                  label: 'State',
                  write: true,
                  value: subDetails.orderDetails.address.state,
                }}
                // onChangeText={(text) => this.setState({state: text})}
                containerStyle={{marginBottom: 10}}
              />
              <CustomTextInput
                editable
                required={true}
                field={{
                  label: 'Country',
                  write: true,
                  value: subDetails.orderDetails.address.country,
                }}
                // onChangeText={(text) => this.setState({country: text})}
                containerStyle={{marginBottom: 10}}
              />
              <View
                style={{
                  justifyContent: 'center',
                  borderWidth: 3,
                  borderColor: themes.GREEN_BLUE,
                }}>
                <MapView
                  showsUserLocation={true}
                  region={{
                    latitude: parseFloat(
                      subDetails.orderDetails.address.latitude,
                    ),
                    longitude: parseFloat(
                      subDetails.orderDetails.address.longitude,
                    ),
                    latitudeDelta: 0.03,
                    longitudeDelta: 0.03,
                  }}
                  // onRegionChangeComplete={this.handleRegionChange}
                  style={{width: '100%', height: 300}}>
                  <Marker.Animated
                    draggable={true}
                    coordinate={{
                      latitude: parseFloat(
                        subDetails.orderDetails.address.latitude,
                      ),
                      longitude: parseFloat(
                        subDetails.orderDetails.address.longitude,
                      ),
                    }}
                    onDragEnd={(e) => {
                      console.log('dragEnd', e.nativeEvent.coordinate);
                      this.setState({
                        latitude: e.nativeEvent.coordinate.latitude,
                        longitude: e.nativeEvent.coordinate.longitude,
                      });
                    }}
                  />
                </MapView>
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    );
  };
  console.log('orderDetailsorderDetails: ', subDetails);
  return (
    <ScrollView style={{flex: 1, backgroundColor: '#fff'}}>
      <View
        style={{
          flex: 3,
          // justifyContent: 'center',
          paddingHorizontal: 5,
          paddingVertical: 5,
          marginLeft: 0,
          backgroundColor: themes.CONTENT_GREEN_BACKGROUND,
          borderBottomLeftRadius: 50,
          borderBottomRightRadius: 50,
          shadowRadius: 25,
          shadowOffset: {height: 10, width: 0},
        }}>
        <View>
          <Text
            style={{
              fontSize: themes.FONT_SIZE_MEDIUM,
              textAlign: 'center',
              fontWeight: 'bold',
            }}>{`Frequency: ${subDetails.frequency}`}</Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            marginTop: 10,
            paddingHorizontal: 15,
            marginBottom: 10,
          }}>
          <Text
            style={{
              fontSize: themes.FONT_SIZE_MEDIUM,
              textAlign: 'center',
            }}>
            {'Customer Name: '}
          </Text>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: themes.FONT_SIZE_MEDIUM,
              textAlign: 'center',
            }}>
            {`${subDetails.userDetail ? subDetails.userDetail.name : ''}`}
          </Text>
        </View>
        <View
          style={{
            flexDirection: 'row',
            // marginTop: 10,
            // paddingHorizontal: 15,
            marginBottom: 10,
          }}>
          <Text
            style={{
              fontSize: themes.FONT_SIZE_MEDIUM,
              textAlign: 'center',
            }}>
            {'Next Delivery Date: '}
          </Text>
          <Text
            style={{
              fontWeight: 'bold',
              fontSize: themes.FONT_SIZE_MEDIUM,
              textAlign: 'center',
            }}>
            {`${subDetails.nextDeliveryDate}`}
          </Text>
        </View>
      </View>
      <View>
        {images.length < 0 && !loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <Image source={WarnigPic} />
            <Text>No Prescription Available</Text>
          </View>
        ) : (
          <ScrollView horizontal={true} style={{minHeight: 330}}>
            {images.map((img) => {
              return (
                <TouchableHighlight
                  onPress={() => setShowImage(true)}
                  style={{alignItems: 'center'}}>
                  <Image
                    source={{
                      uri: img.url,
                    }}
                    resizeMode="contain"
                    style={{
                      width: WIDTH,
                      height: HEIGHT,
                      alignSelf: 'center',
                    }}
                  />
                </TouchableHighlight>
              );
            })}
          </ScrollView>
        )}
        {loading ? (
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              position: 'absolute',
              height: 330,
              width: WIDTH,
            }}>
            <View
              style={{
                backgroundColor: '#FFFFFF',
                height: 100,
                width: 100,
                borderRadius: 10,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-around',
              }}>
              <ActivityIndicator
                animating={loading}
                size="large"
                color="#000"
                style={{height: 65}}
              />
            </View>
          </View>
        ) : null}
      </View>
      <View>
        {medicineList.length > 0 ? (
          <View
            style={{
              paddingVertical: 10,
              borderBottomWidth: 3,
              borderBottomColor: themes.CONTENT_GREEN_BACKGROUND,
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <Text
              style={{
                flex: 1,
                textAlign: 'center',
                textAlignVertical: 'center',
                fontWeight: 'bold',
                color: themes.TEXT_BLUE_COLOR,
              }}>
              {'Name'}
            </Text>
            <Text
              style={{
                flex: 1,
                textAlign: 'center',
                textAlignVertical: 'center',
                fontWeight: 'bold',
                color: themes.TEXT_BLUE_COLOR,
              }}>
              {'MRF'}
            </Text>
            <Text
              style={{
                flex: 0.8,
                textAlign: 'center',
                textAlignVertical: 'center',
                fontWeight: 'bold',
                color: themes.TEXT_BLUE_COLOR,
              }}>
              {'Unit'}
            </Text>
            {/* <Text
              style={{
                flex: 0.8,
                textAlign: 'center',
                textAlignVertical: 'center',
                fontWeight: 'bold',
                color: themes.TEXT_BLUE_COLOR,
              }}>
              {'Price'}
            </Text> */}
          </View>
        ) : null}

        {medicineList.map((med, index) => {
          return (
            <TouchableOpacity
              // onPress={() => {
              //   let {medicineModal, data} = this.state;
              //   medicineModal = {
              //     ...medicineModal,
              //     visibility: true,
              //     toadd: false,
              //     index: index,
              //   };
              //   data = {...med};
              //   this.setState({medicineModal, data});
              // }}
              style={{
                paddingVertical: 10,
                borderBottomWidth: 3,
                borderBottomColor: themes.CONTENT_GREEN_BACKGROUND,
                // flexDirection: 'row',
                // justifyContent: 'center',
              }}>
              <View
                style={{
                  // paddingVertical: 10,
                  // borderBottomWidth: 3,
                  // borderBottomColor: themes.CONTENT_GREEN_BACKGROUND,
                  flexDirection: 'row',
                  justifyContent: 'center',
                }}>
                <Text
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    textAlignVertical: 'center',
                  }}>
                  {med.name}
                </Text>
                <Text
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    textAlignVertical: 'center',
                  }}>
                  {med.mfr}
                </Text>
                <Text
                  style={{
                    flex: 0.8,
                    textAlign: 'center',
                    textAlignVertical: 'center',
                  }}>
                  {med.unit}
                </Text>
                {/* <Text
                  style={{
                    flex: 0.8,
                    textAlign: 'center',
                    textAlignVertical: 'center',
                  }}>
                  {med.price}
                </Text> */}
              </View>
              <Text
                style={{
                  flex: 1,
                  // textAlign: 'center',
                  textAlignVertical: 'center',
                  fontWeight: 'bold',
                  marginLeft: 10,
                  // color: themes.TEXT_BLUE_COLOR,
                }}>
                {`Comment: ${med.comments}`}
              </Text>
            </TouchableOpacity>
          );
        })}
        {/* <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            marginHorizontal: 15,
          }}>
          <Text
            style={{
              flex: 1,
              flexDirection: 'row-reverse',
              fontWeight: 'bold',
              marginVertical: 10,
              textAlign: 'right',
              fontSize: themes.FONT_SIZE_MEDIUM,
            }}>{`Total  ₹${
            subDetails.orderDetails && subDetails.orderDetails. orderDetails.totalPrice ? orderDetails.totalPrice : 0
          }`}</Text>
        </View> */}
        <View style={{marginVertical: 10, marginHorizontal: 10}}>
          {subDetails.orderDetails ? (
            <ExpandeablePanel
              title={`Delivery To: ${subDetails.orderDetails.address.line1} ${subDetails.orderDetails.address.line2} ${subDetails.orderDetails.address.line3} ${subDetails.orderDetails.address.city} ${subDetails.orderDetails.address.state}`}>
              {renderChangeAddress()}
            </ExpandeablePanel>
          ) : null}
        </View>
      </View>
      <Modal
        visible={showImage}
        onDismiss={() => setShowImage(false)}
        onRequestClose={() => setShowImage(false)}>
        <ImageViewer imageUrls={images} />
        <TouchableOpacity
          onPress={() => setShowImage(false)}
          style={{backgroundColor: 'black', position: 'absolute'}}>
          <Icon name="close" size={30} color={'#fff'} />
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
};
export default ShowSubscriptionDetails;
