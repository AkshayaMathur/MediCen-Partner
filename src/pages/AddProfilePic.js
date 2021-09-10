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
} from 'react-native';
import ImagePicker from 'react-native-image-crop-picker';
import {PERMISSIONS, check, request, RESULTS} from 'react-native-permissions';
import CameraPic from '../assets/camera.png';
import GalleryPic from '../assets/gallery.png';
import qrcodeImage from '../assets/qr_code_add.png';
import CustomButton from '../components/CustomButton';
import CustomTextInput from '../components/CustomTextInput';
import MedToast from '../components/MedToast';
import themes from '../themes';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Device_Api from '../utils/api';
import {getUserDetails, setUserDetails} from '../utils/userprofile';
import CustomeProgress from '../components/CustomProgress';
import {Platform} from 'react-native';
import {PermissionsAndroid} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import * as RNFS from 'react-native-fs';
import axios from 'axios';
export default class AddInvoice extends Component {
  state = {
    profilePic: null,
    loading: false,
    imageAdded: false,
  };
  constructor(props) {
    super(props);
    if (props.profilePic) {
      console.log('GOT INBHKDHKDHKHDKHDKHDKL');
      this.state.profilePic = props.profilePic;
    }
  }
  requestGallery = async () => {
    //this.getAllImages();
    // this.myRef.current.hide();
    console.log('Called Request gallery');
    try {
      const cameraGrantedIos = await check(PERMISSIONS.ANDROID.CAMERA);
      console.log(
        '>>>>>>>>>>>>>>REQUESTED CAMERA GRANTED ANDROID',
        cameraGrantedIos,
      );
      if (cameraGrantedIos === RESULTS.GRANTED) {
        ImagePicker.openPicker({
          //   multiple: true,
          cropping: true,
          includeExif: true, //for meta data
          compressImageQuality: 0.7,
          mediaType: 'photo',
        })
          .then((image) => {
            console.log('images', image);
            let img = image;
            // const finalImgObj = this.state.invoiceImages;
            let imgObj = {};
            let n = img.filename
              ? `${img.filename.toString().toLowerCase()}`
              : 'GalleryPic.jpg';
            // let n = 'GalleryPic.jpeg';
            imgObj.name = `${new Date().toISOString()}_${n}`;
            imgObj.uri = img.path;
            // finalImgObj.push(imgObj);
            this.setState({
              profilePic: imgObj,
              imageAdded: true,
            });
          })
          .catch((err) => {
            console.log('An error occurred in Gallery: ', err.message);
            if (err.message !== 'User cancelled image selection') {
              //   SiToast.show(`An error occurred in gallery: ${err.message}`);
            }
          });
      } else {
        console.log('Camera permission denied');
        // SiToast.show('Please Give Gallery Access');
        const res2 = await request(PERMISSIONS.ANDROID.CAMERA);
        console.log('RES 2is: ', res2);
        if (res2 === RESULTS.GRANTED) {
          this.requestGallery();
        } else {
          MedToast.show('Please Give Gallery Access');
        }
      }
      // }
    } catch (err) {
      console.warn('Camera permission denied ' + err);
    }
  };
  requestCamera = async () => {
    //this.getAllImages();
    console.log('Called Request Camera');
    try {
      const cameraGrantedIos = await check(PERMISSIONS.ANDROID.CAMERA);
      console.log(cameraGrantedIos);
      if (cameraGrantedIos === RESULTS.GRANTED) {
        // **************For Multiple Images ******************//
        ImagePicker.openCamera({
          mediaType: 'photo',
          cropping: true,
          includeExif: true,
          maxFiles: 5, // only applicable for ios needs to try
          compressImageQuality: 0.1,
        })
          .then(async (image) => {
            let imgObj = {};
            let n = image.filename
              ? `${image.filename.toString().toLowerCase()}`
              : 'CameraPic.jpeg';
            imgObj.name = `${new Date().toISOString()}_${n}`;
            imgObj.uri = image.path;
            console.log('Final Img obj is: ', imgObj);
            this.setState({
              profilePic: imgObj,
              imageAdded: true,
            });
          })
          .catch((err) => {
            if (err.message !== 'User cancelled image selection') {
              console.log('U Cancelled');
            }
          });
      } else {
        console.log('Camera permission denied');
        const res2 = await request(PERMISSIONS.ANDROID.CAMERA);
        if (res2 === RESULTS.GRANTED) {
          this.requestCamera();
        } else {
        }
      }
      // }
    } catch (err) {
      console.warn('Camera permission denied ' + err);
    }
  };
  deleteImage = () => {
    this.setState({
      profilePic: null,
    });
  };
  addPaymentDetails = async () => {
    const {profilePic} = this.state;
    let userDetails = await getUserDetails();
    if (userDetails) {
      this.setState({loading: true});
      userDetails = JSON.parse(userDetails);
      Device_Api.uploadPartnerProfilePic(this.props.Id, profilePic.name)
        .then((res) => {
          console.log('Res is: ', res);
          if (!res.statusCode && res.statusCode !== 200) {
            MedToast.show('An error Occurred');
            this.setState({loading: false});
            return;
          }
          fetch(res.body, {
            method: 'PUT',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/octet-stream',
            },
            body: profilePic,
          })
            .then(async (result1) => {
              this.setState({loading: false});
              console.log('Result while uploading image is: ', result1);
              if (result1.status === 200) {
                MedToast.show('Profile Picture Added');
                await this.loginUser(userDetails);
                this.props.closeModal();
                return;
              }
              MedToast.show('An error Occurred');
            })
            .catch((err) => {
              console.log('An error Occurred: ', err);
              this.setState({loading: false});
              MedToast.show('An error Occurred');
            });
        })
        .catch((err) => {
          this.setState({loading: false});
          console.log('An error Occurred: ', err);
        });
    }
  };
  loginUser = (token) => {
    console.log('Email is: ', token);
    console.log('password is: ', token.password);
    console.log(token);
    axios
      .post(
        'https://7d5simyvz0.execute-api.us-east-1.amazonaws.com/V1/checkpartner',
        {
          emailId: token.username,
          password: token.password,
        },
      )
      .then(function (response) {
        console.log(response.data);
        if (response.data.statusCode === 200) {
          // login(response.data.body);
          // setLoading(false);
          setUserDetails(response.data.body);
          return;
        }
      })
      .catch(function (error) {
        console.log(error);
      });
    // fetch(
    //   'https://7d5simyvz0.execute-api.us-east-1.amazonaws.com/V1/checkpartner',
    //   {
    //     method: 'POST',
    //     headers: {
    //       Accept: 'application/json',
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify({
    //       emailId: email,
    //       password: password,
    //     }),
    //   },
    // )
    //   .then((res) => res.json())
    //   .then((res) => {
    //     console.log('Response is: ', res);
    //     if (res.statusCode === 200) {
    //       login(res.body);
    //       setLoading(false);
    //       return;
    //     }
    //     MedToast.show(`Login Failed: ${res.body.error}`);
    //     setLoading(false);
    //   })
    //   .catch((err) => {
    //     console.log('Error is: ', err);
    //     MedToast.show(`An Error Occurred while Login`);
    //     setLoading(false);
    //   });
  };

  // checkIfUserAddNewImage = () => {
  //   const {invoiceImages} = this.state;
  //   let finalRes = false;
  //   invoiceImages.map((inv) => {
  //     console.log(
  //       'DONWLOADED CHECKKKKKKKKKKKKKKKKKKKKKKK..........',
  //       inv.downloaded,
  //     );
  //     if (!inv.downloaded) {
  //       finalRes = true;
  //     }
  //   });
  //   return finalRes;
  // };
  render() {
    const {profilePic, loading} = this.state;
    // const checkIfNewImageUpdated = this.checkIfUserAddNewImage();
    return (
      <ScrollView style={{backgroundColor: '#fff', marginBottom: 15}}>
        <CustomeProgress showprogress={loading} />
        <View
          style={{
            // marginVertical: 15,
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <TouchableOpacity onPress={() => this.requestCamera()}>
            <Image
              source={CameraPic}
              style={{
                width: 50,
                height: 50,
                tintColor: themes.GREEN_BLUE,
              }}
              resizeMode="contain"
            />
            <Text style={{textAlignVertical: 'center', textAlign: 'center'}}>
              Camera
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => this.requestGallery()}>
            <Image
              source={GalleryPic}
              style={{
                width: 50,
                height: 50,
                tintColor: themes.GREEN_BLUE,
              }}
              resizeMode="contain"
            />
            <Text style={{textAlignVertical: 'center', textAlign: 'center'}}>
              Gallery
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            height: 3,
            backgroundColor: themes.CONTENT_GREEN_BACKGROUND,
          }}
        />
        {/* <ScrollView style={{flex: 1, marginTop: 15}} initialPage={0}>
          {invoiceImages.map((photo, index) => {
            return (
              <View
                key={index}
                style={{
                  //   flex: 1,
                  width: Dimensions.get('window').width,
                  // margin: 20,
                  height: 330,
                  // padding: 5,
                }}>
                <View style={{flexDirection: 'row'}}>
                  {/* <Text
                    style={{
                      color: themes.DISABLED_TEXT_COLOR,
                      fontWeight: 'bold',
                      fontSize: themes.FONT_SIZE_MEDIUM,
                      borderWidth: 1,
                      borderColor: themes.DISABLED_COLOR,
                      padding: 5,
                      borderRadius: 25,
                    }}>{`${index + 1}/${invoiceImages.length}`}</Text> 
                  <View>
                    {photo.downloaded ? null : (
                      <TouchableOpacity onPress={() => this.deleteImage(index)}>
                        <Ionicons
                          name="close-circle"
                          size={30}
                          color={themes.GREEN_BLUE}
                          // style={{paddingRight: 5}}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
                <Image
                  source={{
                    uri: 'file://' + photo.uri,
                  }}
                  resizeMode="contain"
                  style={{
                    width: 300,
                    height: 300,
                    // alignSelf: 'center',
                  }}
                />
              </View>
            );
          })}
        </ScrollView> */}
        {profilePic ? (
          <Image
            source={{
              uri: 'file://' + profilePic.uri,
            }}
            resizeMode="contain"
            style={{
              width: 300,
              height: 300,
              // alignSelf: 'center',
            }}
          />
        ) : null}

        <View
          style={{
            height: 3,
            backgroundColor: themes.CONTENT_GREEN_BACKGROUND,
          }}
        />
        {this.state.imageAdded ? (
          <CustomButton
            text={'Add Profile Picture'}
            onPress={() => {
              this.addPaymentDetails();
            }}
          />
        ) : null}
      </ScrollView>
    );
  }
}
