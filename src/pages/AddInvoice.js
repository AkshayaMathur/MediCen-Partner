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
import {Platform} from 'react-native';
import {PermissionsAndroid} from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import * as RNFS from 'react-native-fs';
export default class AddInvoice extends Component {
  state = {
    invoiceImages: [],
    loading: false,
  };
  constructor(props) {
    super(props);
    this.edit = false;
    this.imageAdded = false;
    console.log(
      'INVOIVCEJNBjkndjfndlfjsnsdflnmsfdlmfsdlfmnlfdnlfdsnmlkfdsnm;lfd',
      props.orderDetails.invoiceKey,
    );
    if (props.orderDetails.invoiceKey) {
      this.getInvoiceImages();
    }
  }
  getInvoiceImages = () => {
    this.setState({loading: true});
    Device_Api.getInvoiceImage(
      this.props.orderDetails.Id,
      this.props.orderDetails.invoiceKey,
    )
      .then((res) => {
        console.log('Result is: ', res);
        this.checkPermission(this.props.orderDetails.invoiceKey, res.body);
        this.setState({loading: false});
      })
      .catch((err) => {
        this.setState({loading: false});
      });
  };
  checkPermission = async (keys, urls) => {
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
            this.downloadImage(keys, urls);
          } else {
          }
        } else {
          this.downloadImage(keys, urls);
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };

  downloadImage = (keys, urls) => {
    console.log('Got Keys to download: ', keys, urls);
    if (keys.length <= 0) {
      return;
    }
    this.setState({loading: true});
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
            RNFS.copyFile(res.data, imagePath);
            const {invoiceImages} = this.state;
            invoiceImages.push({
              uri: imagePath,
              downloaded: true,
              name: keys[mainIndex],
            });
            // this.state.invoiceImages = invoiceImages;
            console.log(invoiceImages);
            this.setState({invoiceImages, loading: false}, () =>
              console.log('New Image is: ', this.state.invoiceImages),
            );
          });
      });
    } catch (error) {
      console.log('An error Occurred while downloading img: ', error);
    }
  };
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
            const finalImgObj = this.state.invoiceImages;
            let imgObj = {};
            let n = img.filename
              ? `${img.filename.toString().toLowerCase()}`
              : 'GalleryPic.jpg';
            // let n = 'GalleryPic.jpeg';
            imgObj.name = `${new Date().toISOString()}_${n}`;
            imgObj.uri = img.path;
            finalImgObj.push(imgObj);
            this.setState({
              invoiceImages: finalImgObj,
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
            const finalImgObj = this.state.invoiceImages;
            console.log('Image Is: ', image);
            // let d = await this.compressImage(image);
            // console.log('D is: ', d);
            let imgObj = {};
            let n = image.filename
              ? `${image.filename.toString().toLowerCase()}`
              : 'CameraPic.jpeg';
            imgObj.name = `${new Date().toISOString()}_${n}`;
            imgObj.uri = image.path;
            // imgObj.type = '';
            // img.mime;
            // image.data =d

            // imgObj.imageContent = image.path;
            console.log('Final Img obj is: ', imgObj);
            finalImgObj.push(imgObj);
            this.setState({
              // showAddPrescriptionModal: !this.state.showAddPrescriptionModal,
              invoiceImages: finalImgObj,
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
  // deleteImage = () => {
  //   this.setState({qrcode: null});
  // };
  deleteImage = (index) => {
    let filteredPhoto = this.state.invoiceImages.filter((img, i) => {
      return index !== i;
    });
    if (filteredPhoto.length > 0) {
      console.log('Images with filter called');
      this.setState({
        invoiceImages: filteredPhoto,
        // selectedimageindex: 0,
      });
    } else {
      console.log('No Filtered Image Called');
      filteredPhoto = [];
      this.setState({
        invoiceImages: [],
        //selectedimageindex: 0
      });
    }
  };
  addPaymentDetails = async () => {
    const {invoiceImages, mobileNumber, upiId} = this.state;
    if (invoiceImages.length <= 0) {
      MedToast.show('Please Add An Invoice');
      return;
    }
    let allKeyList = [];
    let keysList = [];
    let finalinvoiceImages = [];
    invoiceImages.map((key) => {
      allKeyList.push(key.name);
      keysList.push(key.name);
      finalinvoiceImages.push(key);
      // if (!key.downloaded) {
      //   keysList.push(key.name);
      //   finalinvoiceImages.push(key);
      // }
    });
    let userDetails = await getUserDetails();
    if (userDetails) {
      this.setState({loading: true});
      userDetails = JSON.parse(userDetails);
      Device_Api.uploadInvoice(this.props.orderDetails.Id, allKeyList)
        .then((res) => {
          console.log('Res is: ', res);
          if (!res.statusCode && res.statusCode !== 200) {
            MedToast.show('An error Occurred');
            this.setState({loading: false});
            return;
          }
          res.body.map((url, index) => {
            if (!finalinvoiceImages[index].downloaded) {
              fetch(url, {
                method: 'PUT',
                mode: 'cors',
                headers: {
                  'Content-Type': 'application/octet-stream',
                },
                body: finalinvoiceImages[index],
              })
                .then((result1) => {
                  this.setState({loading: false});
                  console.log('Result while uploading image is: ', result1);
                  if (result1.status === 200) {
                    MedToast.show('Invoice Added');
                    this.props.orderDetails.invoiceKey = keysList;
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
            }
          });
        })
        .catch((err) => {
          this.setState({loading: false});
          console.log('An error Occurred: ', err);
        });
    }
  };
  checkIfUserAddNewImage = () => {
    const {invoiceImages} = this.state;
    let finalRes = false;
    invoiceImages.map((inv) => {
      console.log(
        'DONWLOADED CHECKKKKKKKKKKKKKKKKKKKKKKK..........',
        inv.downloaded,
      );
      if (!inv.downloaded) {
        finalRes = true;
      }
    });
    return finalRes;
  };
  render() {
    const {invoiceImages, loading} = this.state;
    const checkIfNewImageUpdated = this.checkIfUserAddNewImage();
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
        {console.log('INVOICEMnnmldm;d::::::::::::::::::::::::', invoiceImages)}
        <ScrollView style={{flex: 1, marginTop: 15}} initialPage={0}>
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
                    }}>{`${index + 1}/${invoiceImages.length}`}</Text> */}
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
        </ScrollView>

        <View
          style={{
            height: 3,
            backgroundColor: themes.CONTENT_GREEN_BACKGROUND,
          }}
        />
        {checkIfNewImageUpdated ? (
          <CustomButton
            text={this.edit ? 'Edit Invoice' : 'Add Invoice'}
            onPress={() => {
              this.addPaymentDetails();
            }}
          />
        ) : null}
      </ScrollView>
    );
  }
}
