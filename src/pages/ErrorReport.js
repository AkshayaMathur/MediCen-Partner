import React, {useState, useEffect} from 'react';
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
import CustomTextInput from '../components/CustomTextInput';
import Suggestion from '../components/Suggestion';
import {PERMISSIONS, check, request, RESULTS} from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';
import CustomButton from '../components/CustomButton';
import CameraPic from '../assets/camera.png';
import GalleryPic from '../assets/gallery.png';
import Ionicons from 'react-native-vector-icons/Ionicons';
import themes from '../themes';
import {getUserDetails} from '../utils/userprofile';
import Device_Api from '../utils/api';
import MedToast from '../components/MedToast';
import CustomeProgress from '../components/CustomProgress';
import DeviceInfo from 'react-native-device-info';
const ERROR = 'error';
const SUGGESTION = 'suggestion';
const ErrorReport = ({navigation}) => {
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState(ERROR);
  const [functionality, setFunctionality] = useState('');
  const [message, setMessage] = useState('');
  const [attachments, setAttachments] = useState([]);

  const requestGallery = async () => {
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
            let images = [image];
            images.map((img) => {
              let imgObj = {};
              let n = img.filename
                ? `${img.filename.toString().toLowerCase()}`
                : 'GalleryPic.jpg';
              // let n = 'GalleryPic.jpeg';
              imgObj.name = `${new Date().toISOString()}_${n}`;
              imgObj.uri = img.path;
              setAttachments((oldAttachments) => [...oldAttachments, imgObj]);
            });
            // setAttachments(finalImgObj);
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
          //   SiToast.show('Please Give Gallery Access');
        }
      }
      // }
    } catch (err) {
      console.warn('Camera permission denied ' + err);
    }
  };

  const requestCamera = async () => {
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
            const finalImgObj = attachments;
            console.log('Image Is: ', image);
            // let d = await this.compressImage(image);
            // console.log('D is: ', d);
            let imgObj = {};
            let n = image.filename
              ? `${image.filename.toString().toLowerCase()}`
              : 'CameraPic.jpeg';
            imgObj.name = `${new Date().toISOString()}_${n}`;
            imgObj.uri = image.path;
            // imgObj.type = img.mime;
            // image.data =d

            // imgObj.imageContent = image.path;
            console.log('Final Img obj is: ', imgObj);
            finalImgObj.push(imgObj);
            // this.setState({
            //   showAddPrescriptionModal: !this.state.showAddPrescriptionModal,
            //   prescriptionPhoto: finalImgObj,
            // });
            // attachments = finalImgObj
            setAttachments((oldAttachments) => [...oldAttachments, imgObj]);
          })
          .catch((err) => {
            if (err.message === 'User cancelled image selection') {
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
  const deleteImage = (index) => {
    let filteredPhoto = attachments.filter((img, i) => {
      return index !== i;
    });
    if (filteredPhoto.length > 0) {
      console.log('Images with filter called');
      // this.setState({
      //   prescriptionPhoto: filteredPhoto,
      //   // selectedimageindex: 0,
      // });
      setAttachments((oldAttachments) => [...filteredPhoto]);
    } else {
      console.log('No Filtered Image Called');
      filteredPhoto = [];
      // this.setState({
      //   prescriptionPhoto: [],
      //   //selectedimageindex: 0
      // });
      setAttachments((oldAttachments) => [...filteredPhoto]);
    }
  };
  const getDeviceManufacturer = () => {
    return new Promise((resolve, reject) => {
      DeviceInfo.getManufacturer()
        .then((manufacturer) => {
          resolve(manufacturer);
        })
        .catch((err) => {
          resolve('');
        });
    });
  };
  const sendError = async () => {
    let userDetails = await getUserDetails();
    if (userDetails) {
      setLoading(true);
      userDetails = JSON.parse(userDetails);
      let keys = [];
      attachments.map((att) => {
        keys.push(att.name);
      });
      let systemName = DeviceInfo.getSystemName();
      let uniqueId = DeviceInfo.getUniqueId();
      let systemVersion = DeviceInfo.getSystemVersion();
      const deviceModel = DeviceInfo.getModel();
      let finalObj = {
        userId: userDetails.Id,
        type: type,
        functionality: functionality,
        message: message,
        attachments: keys,
        systemName: systemName,
        uniqueId: uniqueId,
        systemVersion: systemVersion,
        deviceModel: deviceModel,
        manufacturer: await getDeviceManufacturer(),
      };
      Device_Api.submitError(finalObj)
        .then((res) => {
          console.log('Res is: ', res);
          if (!res.statusCode && res.statusCode !== 200) {
            MedToast.show('An error Occurred');
            setLoading(false);
            return;
          }
          if (res.body.attachments.length > 0) {
            res.body.attachments.map((att, index) => {
              fetch(att, {
                method: 'PUT',
                mode: 'cors',
                headers: {
                  'Content-Type': 'application/octet-stream',
                },
                body: att,
              }).then((imgRes) => {
                console.log('imgRes is: ', imgRes);
                if (index === res.body.attachments.length - 1) {
                  MedToast.show('Submitted Successfully');
                  setLoading(false);
                  navigation.goBack();
                }
              });
            });
          } else {
            MedToast.show('Submitted Successfully');
            setLoading(false);
            navigation.goBack();
          }
        })
        .catch((err) => {
          console.log('An error Occurred: ', err);
          MedToast.show('An Error Has Occurred');
          setLoading(false);
        });
    }
  };
  return (
    <View style={{flex: 1, padding: 15, backgroundColor: '#fff'}}>
      {/* <Text>Error Report</Text> */}
      <CustomeProgress showprogress={loading} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text
          style={{
            fontWeight: 'bold',
            color: 'grey',
            fontSize: themes.FONT_SIZE_MEDIUM,
          }}>
          I Want To
        </Text>
        <View
          style={{
            marginTop: 10,
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <TouchableOpacity
            onPress={() => setType(ERROR)}
            style={{
              borderColor: themes.GREEN_BLUE,
              borderWidth: type === ERROR ? 3 : 0,
              backgroundColor:
                type === ERROR ? themes.CONTENT_GREEN_BACKGROUND : '#fff',
              padding: 10,
              borderRadius: 25,
            }}>
            {/* <Image
            source={DoctorMaleImage}
            style={{
              width: 70,
              height: 50,
              justifyContent: 'center',
              alignSelf: 'center',
            }}
            resizeMode="contain"
          /> */}
            <Text
              style={{
                textAlign: 'center',
                textAlignVertical: 'center',
                fontSize: themes.FONT_SIZE_NORMAL,
                fontWeight: type === ERROR ? 'bold' : null,
              }}>
              Report An Error
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setType(SUGGESTION)}
            style={{
              backgroundColor:
                type === SUGGESTION ? themes.CONTENT_GREEN_BACKGROUND : '#fff',
              borderColor: themes.GREEN_BLUE,
              borderWidth: type === SUGGESTION ? 3 : 0,
              padding: 10,
              borderRadius: 25,
            }}>
            {/* <Image
            source={PharmacyImg}
            style={{
              width: 70,
              height: 50,
              justifyContent: 'center',
              alignSelf: 'center',
            }}
            resizeMode="contain"
          /> */}
            <Text
              style={{
                textAlign: 'center',
                textAlignVertical: 'center',
                fontSize: themes.FONT_SIZE_NORMAL,
                fontWeight: type === SUGGESTION ? 'bold' : null,
              }}>
              Give A Suggestion
            </Text>
          </TouchableOpacity>
        </View>
        <View
          style={{
            marginVertical: 20,
            height: 3,
            backgroundColor: themes.CONTENT_GREEN_BACKGROUND,
          }}
        />
        <Suggestion
          editable
          required={true}
          field={{
            label: 'Functionality',
            write: true,
            value: functionality,
          }}
          nameSuggestion={[
            {label: 'Login'},
            {label: 'Signup'},
            {label: 'Notification'},
            {label: 'Order'},
            {label: 'Patient Report'},
            {label: 'Payment'},
            {label: 'Analysis'},
            {label: 'Profile'},
            {label: 'Reminder'},
            {label: 'Subscription'},
          ]}
          onSelect={(value) => {
            console.log('Selected Value is: ', value);
            setFunctionality(value.label);
          }}
          onChangeText={(text) => setFunctionality(text)}
        />
        <CustomTextInput
          editable
          required={true}
          field={{
            label: 'Message',
            write: true,
            value: message,
          }}
          multiline={true}
          returnKeyType={'done'}
          containerStyle={{margin: 10}}
          onChangeText={(text) => setMessage(text)}
        />

        <Text
          style={{
            fontWeight: 'bold',
            color: 'grey',
            fontSize: themes.FONT_SIZE_MEDIUM,
            marginBottom: 20,
          }}>
          Attachments
        </Text>
        <View style={{flexDirection: 'row', justifyContent: 'space-around'}}>
          <TouchableOpacity onPress={() => requestCamera()}>
            <Image
              source={CameraPic}
              style={{
                width: 40,
                height: 40,
                tintColor: themes.GREEN_BLUE,
              }}
              resizeMode="contain"
            />
            <Text style={{textAlignVertical: 'center', textAlign: 'center'}}>
              Camera
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => requestGallery()}>
            <Image
              source={GalleryPic}
              style={{
                width: 40,
                height: 40,
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
            marginVertical: 20,
            height: 3,
            backgroundColor: themes.CONTENT_GREEN_BACKGROUND,
          }}
        />
        <ScrollView horizontal={true}>
          {attachments.map((photo, index) => {
            return (
              <View
                key={index}
                style={{
                  //   flex: 1,
                  width: 300,
                  margin: 20,
                  borderWidth: 1,
                  borderColor: themes.BORDER_COLOR,
                  height: 330,
                  padding: 5,
                }}>
                <TouchableOpacity onPress={() => deleteImage(index)}>
                  <Ionicons
                    name="ios-close-sharp"
                    size={15}
                    color="#41056E"
                    // style={{paddingRight: 5}}
                  />
                </TouchableOpacity>
                <Image
                  source={{
                    uri: 'file://' + photo.uri,
                  }}
                  resizeMode="contain"
                  style={{
                    width: 300,
                    height: 300,
                    alignSelf: 'center',
                  }}
                />
              </View>
            );
          })}
        </ScrollView>
      </ScrollView>
      <CustomButton text="SUBMIT" onPress={() => sendError()} />
    </View>
  );
};

export default ErrorReport;
