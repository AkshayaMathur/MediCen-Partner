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
import {Dialog, FAB, Portal, TextInput} from 'react-native-paper';
import {PERMISSIONS, check, request, RESULTS} from 'react-native-permissions';
import ImagePicker from 'react-native-image-crop-picker';
import themes from '../themes';
import Ionicons from 'react-native-vector-icons/Ionicons';
import CameraPic from '../assets/camera.png';
import GalleryPic from '../assets/gallery.png';
import {RNS3} from 'react-native-aws3';
import LinearGradient from 'react-native-linear-gradient';
const OPTIONS = {
  keyPrefix: 'uploads/',
  bucket: 'medcen',
  region: 'ap-south-1',
  accessKey: 'AKIATI6BZHSZMISXG56R',
  secretKey: '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',
  successActionStatus: 201,
};
class UploadPrescription extends Component {
  state = {
    prescriptionPhoto: [],
    showAddPrescriptionModal: false,
    uploadSuccess: [],
    uploadUnSuccess: [],
  };
  uploadImage = () => {
    console.log('Executing.......................');
    const {prescriptionPhoto} = this.state;
    let count = 0;
    const file = {
      uri:
        'file:///storage/emulated/0/Android/data/com.medcen/files/Pictures/b7a7c5e3-f23f-4313-b783-b8c6b971de08.jpg',
      name: 'prescription3.jpg',
      type: 'image/jpg',
    };
    fetch(
      'https://anaxvws1vf.execute-api.us-east-1.amazonaws.com/V1/upload-url',
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filename: 'prescription3',
          bucketName: 'medcen-data',
        }),
      },
    )
      .then((res) => res.json())
      .then(
        (result) => {
          console.log(result.body);
          fetch(result.body, {
            method: 'PUT',
            mode: 'cors',
            headers: {
              'Content-Type': 'application/octet-stream',
            },
            body: file,
          })
            .then((result1) => {
              console.log(result1);
              if (result1.status == 200) {
                this.setState({
                  show: true,
                });
              }
            })
            .catch((error) => {
              console.log(error);
            });
        },
        (error) => {
          console.log(error);
        },
      );
    // prescriptionPhoto.map(file => {
    //   RNS3.put(file, OPTIONS).then((response) => {
    //     console.log('The response is: ', response);
    //     if (response.status !== 201) {
    //       console.log('An Error While Uploading')
    //       this.state.uploadUnSuccess.push(file);
    //     } else {
    //       console.log('Upload is Succeesful');
    //       this.state.uploadSuccess.push(file);
    //     }
    //     console.log(response.body);
    //     count = count + 1;
    //     if(count === prescriptionPhoto.length) {
    //       console.log('Uploading All Images is successful');
    //     }
    //   });
    // });
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
            let images = [image];
            const finalImgObj = this.state.prescriptionPhoto;
            images.map((img) => {
              let imgObj = {};
              let n = img.filename
                ? `${img.filename.toString().toLowerCase()}`
                : 'GalleryPic.jpg';
              // let n = 'GalleryPic.jpeg';
              imgObj.name = `${new Date().toISOString()}_${n}`;
              imgObj.uri = img.path;
              imgObj.type = img.mime;
              finalImgObj.push(imgObj);
            });
            this.setState({
              showAddPrescriptionModal: !this.state.showAddPrescriptionModal,
              prescriptionPhoto: finalImgObj,
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
          //   SiToast.show('Please Give Gallery Access');
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
            const finalImgObj = this.state.prescriptionPhoto;
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
            this.setState({
              showAddPrescriptionModal: !this.state.showAddPrescriptionModal,
              prescriptionPhoto: finalImgObj,
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
          this.requestGallery();
        } else {
        }
      }
      // }
    } catch (err) {
      console.warn('Camera permission denied ' + err);
    }
  };
  deleteImage = (index) => {
    let filteredPhoto = this.state.prescriptionPhoto.filter((img, i) => {
      return index !== i;
    });
    // let imageObj = {};
    // imageObj.photo = filteredPhoto;
    // console.log("Filterd Images: ", filteredPhoto)
    // console.log("Image Object ", imageObj);
    if (filteredPhoto.length > 0) {
      console.log('Images with filter called');
      this.setState({
        prescriptionPhoto: filteredPhoto,
        // selectedimageindex: 0,
      });
    } else {
      console.log('No Filtered Image Called');
      filteredPhoto = [];
      this.setState({
        prescriptionPhoto: [],
        //selectedimageindex: 0
      });
    }
  };
  renderAddPrescription = () => {
    return (
      <Portal>
        <Dialog
          visible={this.state.showAddPrescriptionModal}
          onDismiss={() =>
            this.setState({
              showAddPrescriptionModal: !this.state.showAddPrescriptionModal,
            })
          }>
          <Dialog.ScrollArea>
            <ScrollView
              contentContainerStyle={{
                paddingHorizontal: 30,
                paddingVertical: 30,
              }}>
              <View
                style={{flexDirection: 'row', justifyContent: 'space-around'}}>
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
                  <Text
                    style={{textAlignVertical: 'center', textAlign: 'center'}}>
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
                  <Text
                    style={{textAlignVertical: 'center', textAlign: 'center'}}>
                    Gallery
                  </Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </Dialog.ScrollArea>
        </Dialog>
      </Portal>
    );
  };
  render() {
    const {prescriptionPhoto} = this.state;
    console.log('prescriptionPhoto is: ', prescriptionPhoto);
    return (
      <View style={{flex: 1, backgroundColor: '#fff'}}>
        <View style={{flex: 1}}>
          <Button
            title={'upload To Server'}
            onPress={() => this.uploadImage()}
          />
          <ScrollView horizontal={true}>
            {prescriptionPhoto.map((photo, index) => {
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
                  <TouchableOpacity onPress={() => this.deleteImage(index)}>
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
        </View>
        <View style={{flexDirection: 'column-reverse'}}>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'row',
              marginBottom: 10,
            }}>
            <LinearGradient
              start={{x: 0.0, y: 0.25}}
              end={{x: 0.5, y: 1.0}}
              locations={[0, 0.5, 0.6]}
              colors={['#4c669f', '#3b5998', '#192f6a']}
              style={{
                borderRadius: 50,
                paddingHorizontal: 20,
                paddingVertical: 5,
              }}>
              <TouchableOpacity
                style={{flexDirection: 'row'}}
                onPress={() => this.setState({showAddPrescriptionModal: true})}>
                <Ionicons name="add-circle-outline" size={40} color={'white'} />
                <Text
                  style={{
                    color: '#fff',
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    fontSize: themes.FONT_SIZE_MEDIUM,
                  }}>
                  {'  Upload Prescription'}
                </Text>
              </TouchableOpacity>
            </LinearGradient>
          </View>
          {/* <Button title="Upload Prescription" style={{height: 300}}/> */}
        </View>
        {this.renderAddPrescription()}
      </View>
    );
  }
}
export default UploadPrescription;
