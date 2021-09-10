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
import {getUserDetails} from '../utils/userprofile';
import CustomeProgress from '../components/CustomProgress';
export default class AddPaymentMode extends Component {
  state = {
    qrcode: null,
    showAddPrescriptionModal: false,
    uploadSuccess: [],
    uploadUnSuccess: [],
    mobileNumber: '',
    upiId: '',
    loading: false,
  };
  constructor(props) {
    super(props);
    // paymentDetails
    this.edit = false;
    this.imageAdded = false;
    this.init(props);
  }
  init(props) {
    console.log('props.route.params is: ', props.route.params);
    if (props.route.params && props.route.params.paymentDetails) {
      console.log('Hellssskmkso');
      this.state.upiId = props.route.params.paymentDetails.upiId;
      this.state.mobileNumber = props.route.params.paymentDetails.mobileNumber;
      this.state.qrcode = {
        name: props.route.params.paymentDetails.key,
        uri: props.route.params.paymentDetails.imageUrl,
      };
      this.state.Id = props.route.params.paymentDetails.Id;
      this.edit = true;
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
            // const finalImgObj = this.state.prescriptionPhoto;
            let imgObj = {};
            let n = img.filename
              ? `${img.filename.toString().toLowerCase()}`
              : 'GalleryPic.jpg';
            // let n = 'GalleryPic.jpeg';
            imgObj.name = `${new Date().toISOString()}_${n}`;
            imgObj.uri = img.path;
            this.imageAdded = true;
            // finalImgObj.push(imgObj);
            this.setState({
              qrcode: imgObj,
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
            // const finalImgObj = this.state.prescriptionPhoto;
            console.log('Image Is: ', image);
            // let d = await this.compressImage(image);
            // console.log('D is: ', d);
            let imgObj = {};
            let n = image.filename
              ? `${image.filename.toString().toLowerCase()}`
              : 'CameraPic.jpeg';
            imgObj.name = `${new Date().toISOString()}_${n}`;
            imgObj.uri = image.path;
            this.imageAdded = true;
            // imgObj.type = '';
            // img.mime;
            // image.data =d

            // imgObj.imageContent = image.path;
            console.log('Final Img obj is: ', imgObj);
            // finalImgObj.push(imgObj);
            this.setState({
              // showAddPrescriptionModal: !this.state.showAddPrescriptionModal,
              qrcode: imgObj,
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
    this.setState({qrcode: null});
  };
  validateMobileNumber = (inp) => {
    let letters = /^[0-9]{10}$/;
    if (inp.match(letters)) {
      return true;
    }
    return false;
  };
  addPaymentDetails = async () => {
    const {qrcode, mobileNumber, upiId} = this.state;
    if (!qrcode) {
      MedToast.show('Please Add A QR Code Image');
      return;
    }
    if (!mobileNumber || mobileNumber === '') {
      MedToast.show('Please Enter A Mobile Number');
      return;
    }
    if (!upiId || upiId === '') {
      MedToast.show('Please Enter A UPI ID');
      return;
    }
    if (!this.validateMobileNumber(mobileNumber)) {
      MedToast.show('Please Enter A Valid Mobile Number');
      return;
    }
    let userDetails = await getUserDetails();
    if (userDetails) {
      this.setState({loading: true});
      userDetails = JSON.parse(userDetails);
      let obj = {
        partnerId: userDetails.Id,
        filename: qrcode.name,
        upiId: upiId,
        mobileNumber: mobileNumber,
      };
      if (this.state.Id) {
        obj = {
          ...obj,
          Id: this.state.Id,
        };
      }
      Device_Api.createUpiDetails(obj)
        .then((res) => {
          console.log('Res is: ', res);
          if (!res.statusCode && res.statusCode !== 200) {
            MedToast.show('An error Occurred');
            this.setState({loading: false});
            return;
          }
          if (!this.imageAdded && this.edit) {
            const refresh = this.props.route.params.refresh;
            refresh();
            this.props.navigation.goBack();
            return;
          }
          fetch(res.body, {
            method: 'PUT',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/octet-stream',
            },
            body: qrcode,
          })
            .then((result1) => {
              this.setState({loading: false});
              console.log('Result while uploading image is: ', result1);
              if (result1.status === 200) {
                MedToast.show('Payment Mode Added');
                const refresh = this.props.route.params.refresh;
                refresh();
                this.props.navigation.goBack();
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
  render() {
    const {qrcode, loading} = this.state;
    return (
      <ScrollView style={{backgroundColor: '#fff'}}>
        <CustomeProgress showprogress={loading} />
        <Text
          style={{
            fontSize: themes.FONT_SIZE_MEDIUM,
            color: themes.TEXT_BLUE_COLOR,
            marginVertical: 10,
            marginHorizontal: 10,
            fontWeight: 'bold',
          }}>
          Add A Image Of QR Code
        </Text>
        <View
          style={{
            height: 3,
            backgroundColor: themes.CONTENT_GREEN_BACKGROUND,
          }}
        />
        <View
          style={{
            marginVertical: 15,
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
        {qrcode ? (
          <View>
            <View style={{flexDirection: 'row-reverse'}}>
              <TouchableOpacity onPress={() => this.deleteImage()}>
                <Ionicons
                  name="close-circle"
                  size={30}
                  color={themes.GREEN_BLUE}
                  // style={{paddingRight: 5}}
                />
              </TouchableOpacity>
            </View>
            <Image
              source={{
                uri: 'file://' + qrcode.uri,
              }}
              resizeMode="contain"
              style={{
                width: Dimensions.get('screen').width,
                height: 270,
                alignSelf: 'center',
              }}
            />
          </View>
        ) : (
          <View>
            <Image
              source={qrcodeImage}
              resizeMode="contain"
              style={{
                width: Dimensions.get('screen').width,
                height: 270,
                alignSelf: 'center',
              }}
            />
          </View>
        )}
        <View
          style={{
            height: 3,
            backgroundColor: themes.CONTENT_GREEN_BACKGROUND,
          }}
        />
        <CustomTextInput
          editable
          required={true}
          field={{
            label: 'Mobile Number',
            write: true,
            value: this.state.mobileNumber,
          }}
          onChangeText={(text) => this.setState({mobileNumber: text})}
          containerStyle={{margin: 10}}
        />
        <CustomTextInput
          editable
          required={true}
          field={{
            label: 'UPI ID',
            write: true,
            value: this.state.upiId,
          }}
          onChangeText={(text) => this.setState({upiId: text})}
          containerStyle={{margin: 10}}
        />
        <CustomButton
          text={this.edit ? 'EDIT PAYMENT MODE' : 'ADD PAYMENT MODE'}
          onPress={() => {
            this.addPaymentDetails();
          }}
        />
      </ScrollView>
    );
  }
}
