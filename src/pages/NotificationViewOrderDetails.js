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
  Modal,
  PermissionsAndroid,
  Platform,
} from 'react-native';
import React, {useState, useEffect, Component} from 'react';
import BaseView from '../components/BaseView';
import Icon from 'react-native-vector-icons/Ionicons';
import AntDesignIcon from 'react-native-vector-icons/AntDesign';
import CustomBaseView from '../components/CustomBaseView';
import PlainBaseView from '../components/PlainBaseView';
import themes from '../themes';
import MedicarePic from '../assets/medicare.png';
import AppBar from '../components/AppBar';
import ImageViewer from 'react-native-image-zoom-viewer';
import {Dialog, Portal} from 'react-native-paper';
import CustomTextInput from '../components/CustomTextInput';
import FunctionButton from '../components/FunctionButton';
import RNFetchBlob from 'rn-fetch-blob';
import * as RNFS from 'react-native-fs';
import CustomeProgress from '../components/CustomProgress';
import {
  getPaymentModeName,
  getRepeatOrderString,
  getStatusString,
} from '../utils/generalFunction';
import ExpandeablePanel from '../components/ExpandeablePanel';
import AddInvoice from './AddInvoice';
import MapView, {Marker} from 'react-native-maps';
import OrderCancelImg from '../assets/oderCancel.png';
import CustAwaitingImg from '../assets/customerConfirmation.png';
import PreparingImg from '../assets/preparingOrder.png';
import dispatchImg from '../assets/dispatch.png';
import deliveredImg from '../assets/delivered.png';
import delayImg from '../assets/delayed.png';
import prescriptionImg from '../assets/prescription.png';
import MedToast from '../components/MedToast';
import CustomButton from '../components/CustomButton';
import Device_Api from '../utils/api';
import {formateDate} from '../utils/date.formatter';
import SiCheckBox from '../components/SiCheckBox';
import SiNewDate from '../components/SiNewDate';
import WarnigPic from '../assets/warning.png';
import {normalize} from '../utils/deviceStyle';
import Suggestion from '../components/Suggestion';
import _, {debounce} from 'lodash';
const images = [
  {
    url:
      'https://www.researchgate.net/profile/Sandra-Benavides/publication/228331607/figure/fig4/AS:667613038387209@1536182760366/Indicate-why-the-prescription-is-not-appropriate-as-written.png',
  },
  {
    url:
      'https://www.researchgate.net/profile/Sandra-Benavides/publication/228331607/figure/fig4/AS:667613038387209@1536182760366/Indicate-why-the-prescription-is-not-appropriate-as-written.png',
  },
];
const STATUS = [
  'awaiting',
  'preparing',
  'awaiting_cust',
  'dispatch',
  'delivered',
  'cancelled',
  'delayed',
];
const STATUS_IMAGES = [
  prescriptionImg,
  PreparingImg,
  CustAwaitingImg,
  dispatchImg,
  deliveredImg,
  OrderCancelImg,
  delayImg,
];
class NotificationViewOrderDetails extends Component {
  static navigationOptions = {
    headerMode: 'none',
  };
  state = {
    loading: true,
    changeOderStatusModal: false,
    showImage: false,
    showAddMedicineModal: false,
    medicineList: [],
    newImages: [],
    images: [],
    data: {
      name: '',
      mfr: '',
      unit: '',
      price: '',
      comments: '',
    },
    showprogress: true,
    medicineModal: {
      visibility: false,
      toadd: true,
      index: 0,
    },
    comments: '',
    historyCommments: '',
    medicineSuggestionList: [],
    paymentConfirmationModal: false,
    addInvoiceModalVisibility: false,
  };
  constructor(props) {
    super(props);
    this.getOrderDetails(props.route.params.orderId);
    this.props.navigation.setOptions({
      headerShown: false,
    });
    this.medicalSuggestionDebounce = debounce(this.medicalSuggestion, 1000);
  }
  medicalSuggestion = (txt) => {
    if (txt.length > 2) {
      Device_Api.medicalSuggestion(txt)
        .then((res) => {
          console.log('Res is: ', res);
          if (res && res.items && res.items.length > 0) {
            let obj = [];
            res.items.map((i) => {
              obj.push({
                label: i.txt,
                value: i.url,
              });
            });
            this.setState({medicineSuggestionList: obj});
          }
        })
        .catch((err) => {
          console.log('An error while finding suggestions');
        });
    }
  };
  getOrderDetails = (orderId) => {
    Device_Api.getOrderDetailsById(orderId)
      .then((res) => {
        if (res.statusCode === 200) {
          console.log('RES is: ', res);
          this.setState({historyCommments: res.body.comments});
          res.body = {
            ...res.body,
            comments: '',
          };
          this.state.orderDetails = res.body;
          this.state.medicineList = res.body.lineItem;
          // this.state.historyCommments = res.body.comments
          if (res.body.keys) {
            this.checkPermission(res.body.keys);
          }
          if (this.state.medicineList) {
            let total = 0;
            console.log('MEDICAL LIST IS: ', this.state.orderDetails.lineItem);
            this.state.orderDetails.lineItem.map((med) => {
              if (med.price && med.price !== '') {
                total = total + parseFloat(med.price);
              }
            });
            console.log('Total to set is: ', total);
            this.state.orderDetails.totalPrice = total;
          }
          this.setState({loading: false});
        }
      })
      .catch((err) => {
        console.log('An Error Occurred while fetching order details: ', err);
        MedToast.show('An Error Occurred');
      });
  };
  checkPermission = async (keys) => {
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
            this.downloadImage(keys);
          } else {
          }
        } else {
          this.downloadImage(keys);
        }
      }
    } catch (err) {
      console.warn(err);
    }
  };

  downloadImage = (keys) => {
    console.log('Got Keys to download: ', keys);
    if (keys.length <= 0) {
      this.setState({showprogress: false});
      return;
    }
    this.setState({showprogress: true});
    try {
      keys.map((key) => {
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
                  let r = await res.readStream();
                  console.log('R is: ', r);
                  r._onEnd((res) => console.log('jkjfjnfdlsdf', res));
                  console.log('R2 is: ', r);
                  const imagePath = `${
                    RNFS.DocumentDirectoryPath
                  }/${new Date().toISOString()}.jpg`.replace(/:/g, '-');
                  RNFS.copyFile(res.data, imagePath);
                  const {images} = this.state;
                  images.push({url: 'file://' + imagePath});
                  this.setState({images, showprogress: false}, () =>
                    console.log('New Image is: ', this.state.images),
                  );
                });
            },
            (error) => {
              console.log(error);
            },
          );
      });
    } catch (error) {
      console.log('An error Occurred while downloading img: ', error);
    }
  };
  setTextField = (value, field) => {
    console.log('Value is: ', value, 'Field is: ', field);
    let temp = this.state.data;
    temp[field] = value;

    this.setState({data: temp});
  };
  calculateTotalPrice = () => {
    const {medicineList} = this.state;
    let total = 0;
    console.log('MEDICAL LIST IS: ', medicineList);
    medicineList.map((med) => {
      if (med.price && med.price !== '') {
        total = total + parseFloat(med.price);
      }
    });
    console.log('Total to set is: ', total);
    this.setState(
      {
        orderDetails: {
          ...this.state.orderDetails,
          totalPrice: total,
        },
      },
      () => console.log('Order Details are: ', this.state.orderDetails),
    );
  };
  saveMedicine = () => {
    let {medicineList, data, medicineModal} = this.state;
    if (medicineModal.toadd) {
      medicineList.push(data);
    } else {
      medicineList[medicineModal.index] = data;
    }
    this.setState(
      {
        medicineList,
        data: {
          name: '',
          mfr: '',
          unit: '',
          price: '',
        },
        medicineModal: {
          ...medicineModal,
          visibility: false,
          toadd: true,
        },
      },
      () => this.calculateTotalPrice(),
    );
  };

  updateOrder = (paymentVerified) => {
    this.setState({showprogress: true});
    let {orderDetails, medicineList} = this.state;
    if (
      this.restrictUpdate &&
      (paymentVerified === null || paymentVerified === undefined)
    ) {
      orderDetails.showCommentMessage = true;
      orderDetails.notificationMessage = orderDetails.comments;
    }
    if (
      orderDetails.comments !== '' &&
      this.state.historyCommments &&
      this.state.historyCommments !== ''
    ) {
      orderDetails.comments = `${this.state.historyCommments}\n${orderDetails.comments}`;
    } else if (
      this.state.historyCommments &&
      this.state.historyCommments !== ''
    ) {
      orderDetails.comments = `${this.state.historyCommments}`;
    }
    if (paymentVerified !== null && paymentVerified !== undefined) {
      orderDetails.paymentVerified = paymentVerified;
      if (paymentVerified) {
        orderDetails.showPaymentVerifiedNotification = true;
      } else {
        orderDetails.showPaymentNotVerifiedNotification = true;
      }
    } else {
      if (orderDetails.invoiceKey && orderDetails.invoiceKey.length > 0) {
      } else {
        if (
          orderDetails.status === 'dispatch' ||
          orderDetails.status === 'delivered'
        ) {
          if (medicineList.length <= 0) {
            this.setState({showprogress: false});
            MedToast.show('Please Add Medicines');
            return;
          }
          if (!orderDetails.totalPrice || orderDetails.totalPrice === 0) {
            this.setState({showprogress: false});
            MedToast.show('Please Enter The Price Of Medicines');
            return;
          }
        }
      }
    }
    orderDetails.lineItem = medicineList;
    orderDetails.updatedFrom = 'partner';
    orderDetails.totalPrice = orderDetails.totalPrice.toString();
    console.log('Final Object to post is: ', orderDetails);
    fetch(
      'https://7d5simyvz0.execute-api.us-east-1.amazonaws.com/V1/update-order',
      {
        method: 'POST',
        body: JSON.stringify(orderDetails),
      },
    )
      .then((res) => res.json())
      .then((res) => {
        console.log('The response is: ', res);
        if (res.statusCode === 201) {
          MedToast.show('Order Updated Successfully');
          if (paymentVerified === null || paymentVerified === undefined) {
            this.props.navigation.goBack();
          }
        } else {
          MedToast.show('An Error Occurred... Pls Try again');
        }
        this.setState({showprogress: false});
      })
      .catch((err) => {
        console.log('An Error Occurred: ', err);
        this.setState({showprogress: false});
        MedToast.show('An Error Occurred');
      });
  };

  setOrderStatus = (status) => {
    this.setState(
      (prevState) => ({
        orderDetails: {
          ...prevState.orderDetails,
          status: status,
        },
        changeOderStatusModal: status === 'delayed' ? true : false,
      }),
      () => {
        if (status !== 'delayed') {
          this.updateOrder();
        }
      },
    );
  };

  renderChangeOrderStatus = () => {
    const {changeOderStatusModal, orderDetails} = this.state;
    return (
      <Portal>
        <Dialog
          visible={changeOderStatusModal}
          onDismiss={() =>
            this.setState({
              changeOderStatusModal: false,
            })
          }>
          <Dialog.Title
            style={{
              color: themes.TEXT_BLUE_COLOR,
              justifyContent: 'center',
              textAlign: 'center',
              borderBottomColor: themes.CONTENT_GREEN_BACKGROUND,
              borderBottomWidth: 3,
            }}>
            Change Order Status
          </Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                  flexWrap: 'wrap',
                  alignItems: 'flex-start',
                }}>
                {STATUS.map((status, index) => {
                  return (
                    <View style={{flexDirection: 'row'}}>
                      <TouchableOpacity
                        style={{
                          // flex: 1,
                          width: 100,
                          height: 120,
                          borderRadius: 25,
                          paddingVertical: 10,
                          backgroundColor:
                            status === orderDetails.status
                              ? themes.CONTENT_GREEN_BACKGROUND
                              : '#fff',
                        }}
                        onPress={() => this.setOrderStatus(status)}>
                        <Image
                          source={STATUS_IMAGES[index]}
                          style={{width: 50, height: 50, alignSelf: 'center'}}
                        />
                        <Text
                          style={{
                            textAlign: 'center',
                            textAlignVertical: 'center',
                          }}>
                          {getStatusString(status)}
                        </Text>
                      </TouchableOpacity>
                      {orderDetails.status === 'delayed' &&
                      status === 'delayed' ? (
                        <CustomTextInput
                          editable
                          required={true}
                          field={{
                            label: 'Reason',
                            write: true,
                            value: this.state.orderDetails.comments,
                          }}
                          multiline={false}
                          returnKeyType={'done'}
                          containerStyle={{margin: 10}}
                          onSubmitEditing={() =>
                            this.setState({changeOderStatusModal: false}, () =>
                              this.updateOrder(),
                            )
                          }
                          onEndEditing={() =>
                            this.setState({changeOderStatusModal: false}, () =>
                              this.updateOrder(),
                            )
                          }
                          onChangeText={(text) =>
                            this.setState({
                              orderDetails: {
                                ...orderDetails,
                                comments: text,
                              },
                            })
                          }
                        />
                      ) : null}
                      {orderDetails.status === 'delayed' &&
                      status === 'delayed' ? (
                        <TouchableOpacity
                          onPress={() => {
                            this.setState({changeOderStatusModal: false}, () =>
                              this.updateOrder(),
                            );
                          }}
                          style={{
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexDirection: 'row',
                          }}>
                          <AntDesignIcon
                            name="checkcircle"
                            size={normalize(25)}
                          />
                        </TouchableOpacity>
                      ) : null}
                    </View>
                  );
                })}
                {/* <TouchableOpacity
                    style={{
                      flex: 1,
                      backgroundColor: themes.CONTENT_GREEN_BACKGROUND,
                    }}
                    onPress={() =>
                      this.setState({
                        orderDetails: {
                          ...orderDetails,
                          status: 'cancelled',
                        },
                      })
                    }>
                    <Image
                      source={OrderCancelImg}
                      style={{width: 50, height: 50, alignSelf: 'center'}}
                    />
                    <Text style={{textAlign: 'center'}}>Cancel</Text>
                  </TouchableOpacity> */}
                {/* <TouchableOpacity
                    style={{flex: 1}}
                    onPress={() =>
                      this.setState({
                        orderDetails: {
                          ...orderDetails,
                          status: 'awaiting',
                        },
                      })
                    }>
                    <Image
                      source={OrderCancelImg}
                      style={{width: 50, height: 50, alignSelf: 'center'}}
                    />
                    <Text style={{textAlign: 'center'}}>
                      Awaiting Order Confirmation
                    </Text>
                  </TouchableOpacity> */}
              </View>
            </ScrollView>
          </Dialog.ScrollArea>
        </Dialog>
      </Portal>
    );
  };
  renderAddMedicineModal = () => {
    const {medicineModal, data} = this.state;
    return (
      <Portal>
        <Dialog
          visible={medicineModal.visibility}
          onDismiss={() =>
            this.setState({
              medicineModal: {
                ...medicineModal,
                visibility: false,
              },
            })
          }>
          <Dialog.Title
            style={{
              color: themes.TEXT_BLUE_COLOR,
              justifyContent: 'center',
              textAlign: 'center',
              borderBottomColor: themes.CONTENT_GREEN_BACKGROUND,
              borderBottomWidth: 3,
            }}>
            Add Medicine
          </Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView>
              {/* <CustomTextInput
                editable
                required={true}
                field={{
                  label: 'Name Of Medicine',
                  write: true,
                  value: data.name,
                }}
                onChangeText={(text) => this.setTextField(text, 'name')}
              /> */}
              <Suggestion
                editable
                required={true}
                field={{
                  label: 'Name Of Medicine',
                  write: true,
                  value: data.name,
                }}
                nameSuggestion={this.state.medicineSuggestionList}
                onSelect={(value) => {
                  console.log('Selected Value is: ', value);
                  this.setTextField(value.label, 'name');
                }}
                onChangeText={(text) => this.setTextField(text, 'name')}
              />
              <CustomTextInput
                editable
                required={true}
                field={{
                  label: 'Name Of Manufacturer',
                  write: true,
                  value: data.mfr,
                }}
                onChangeText={(text) => this.setTextField(text, 'mfr')}
              />
              <CustomTextInput
                editable
                required={true}
                field={{
                  label: 'Unit',
                  write: true,
                  value: data.unit,
                  type: 'number',
                }}
                onChangeText={(text) => this.setTextField(text, 'unit')}
              />
              <CustomTextInput
                editable
                required={true}
                field={{
                  label: 'Price',
                  write: true,
                  value: data.price,
                  type: 'number',
                }}
                onChangeText={(text) => this.setTextField(text, 'price')}
              />
              <CustomTextInput
                editable
                required={true}
                field={{
                  label: 'Comments',
                  write: true,
                  value: data.comments,
                }}
                onChangeText={(text) => this.setTextField(text, 'comments')}
              />
            </ScrollView>
            <Dialog.Actions style={{justifyContent: 'space-evenly'}}>
              <FunctionButton
                color={'red'}
                text={'Cancel'}
                onPress={() =>
                  this.setState({
                    medicineModal: {
                      ...medicineModal,
                      visibility: false,
                      toadd: true,
                    },
                  })
                }
              />
              <FunctionButton
                onPress={() => this.saveMedicine()}
                color={themes.TEXT_BLUE_COLOR}
                text={'Save'}
              />
            </Dialog.Actions>
          </Dialog.ScrollArea>
        </Dialog>
      </Portal>
    );
  };
  // renderChangeAddress = () => {
  //   return (
  //     <ScrollView
  //       showsVerticalScrollIndicator={false}
  //       style={{flex: 1, paddingVertical: 10, paddingHorizontal: 10}}>
  //       <View style={{marginHorizontal: 10, marginVertical: 10}}>
  //         {/* <CustomTextInput
  //                 editable
  //                 required={true}
  //                 field={{
  //                   label: 'P Name',
  //                   write: true,
  //                   value: '',
  //                 }}
  //                 onChangeText={(text) => this.setTextField(text, 'mfr')}
  //                 containerStyle={{marginBottom: 10}}
  //               /> */}
  //         {/* <CustomTextInput
  //                 editable
  //                 required={true}
  //                 field={{
  //                   label: 'Mobile Number',
  //                   write: true,
  //                   value: '',
  //                 }}
  //                 onChangeText={(text) => this.setTextField(text, 'mfr')}
  //                 containerStyle={{marginBottom: 10}}
  //               /> */}
  //         <CustomTextInput
  //           editable
  //           required={true}
  //           field={{
  //             label: 'PIN Code',
  //             write: true,
  //             value: this.state.orderDetails.address.pincode,
  //             type: 'phone',
  //           }}
  //           containerStyle={{marginBottom: 10}}
  //         />
  //         <CustomTextInput
  //           editable
  //           required={true}
  //           field={{
  //             label: 'Flat, House No., Building,',
  //             write: true,
  //             value: this.state.orderDetails.address.line1,
  //           }}
  //           onChangeText={(text) => this.setState({line1: text})}
  //           containerStyle={{marginBottom: 10}}
  //         />
  //         <CustomTextInput
  //           editable
  //           required={true}
  //           field={{
  //             label: 'Area, Colony, Street, Sector',
  //             write: true,
  //             value: this.state.orderDetails.address.line2,
  //           }}
  //           onChangeText={(text) => this.setState({line2: text})}
  //           containerStyle={{marginBottom: 10}}
  //         />
  //         <CustomTextInput
  //           editable
  //           required={true}
  //           field={{
  //             label: 'Landmark',
  //             write: true,
  //             value: this.state.orderDetails.address.line3,
  //           }}
  //           onChangeText={(text) => this.setState({line3: text})}
  //           containerStyle={{marginBottom: 10}}
  //         />
  //         <CustomTextInput
  //           editable
  //           required={true}
  //           field={{
  //             label: 'City/Town',
  //             write: true,
  //             value: this.state.orderDetails.address.city,
  //           }}
  //           containerStyle={{marginBottom: 10}}
  //         />
  //         <CustomTextInput
  //           editable
  //           required={true}
  //           field={{
  //             label: 'State',
  //             write: true,
  //             value: this.state.orderDetails.address.state,
  //           }}
  //           containerStyle={{marginBottom: 10}}
  //         />
  //         <CustomTextInput
  //           editable
  //           required={true}
  //           field={{
  //             label: 'Country',
  //             write: true,
  //             value: this.state.orderDetails.address.country,
  //           }}
  //           containerStyle={{marginBottom: 10}}
  //         />
  //       </View>
  //       <View
  //         style={{
  //           justifyContent: 'center',
  //           borderWidth: 3,
  //           borderColor: themes.GREEN_BLUE,
  //         }}>
  //         <MapView
  //           showsUserLocation={true}
  //           region={{
  //             latitude: parseFloat(this.state.orderDetails.address.latitude),
  //             longitude: parseFloat(this.state.orderDetails.address.longitude),
  //             latitudeDelta: 0.03,
  //             longitudeDelta: 0.03,
  //           }}
  //           // onRegionChangeComplete={this.handleRegionChange}
  //           style={{width: '100%', height: 300}}>
  //           <Marker.Animated
  //             draggable={true}
  //             coordinate={{
  //               latitude: parseFloat(this.state.orderDetails.address.latitude),
  //               longitude: parseFloat(
  //                 this.state.orderDetails.address.longitude,
  //               ),
  //             }}
  //           />
  //         </MapView>
  //       </View>
  //     </ScrollView>
  //   );
  // };
  renderChangeAddress = () => {
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
                this.state.orderDetails.deliveryType === 'pickup' ? true : false
              }
              // onPressCheckbox={() => {
              //   this.setState({
              //     orderDetails: {
              //       ...this.state.orderDetails,
              //       deliveryType: 'pickup',
              //     },
              //   });
              // }}
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
                this.state.orderDetails.deliveryType === 'delivery'
                  ? true
                  : false
              }
              // onPressCheckbox={() => {
              //   this.setState({
              //     orderDetails: {
              //       ...this.state.orderDetails,
              //       deliveryType: 'delivery',
              //     },
              //   });
              // }}
            />
          </View>
          {this.state.orderDetails.deliveryType === 'pickup' ? null : (
            <View>
              <View>
                <CustomTextInput
                  editable
                  required={true}
                  field={{
                    label: 'PIN Code',
                    write: true,
                    value: this.state.orderDetails.address.pincode,
                    type: 'phone',
                  }}
                  containerStyle={{marginBottom: 10}}
                />
                <CustomTextInput
                  editable
                  required={true}
                  field={{
                    label: 'Flat, House No., Building,',
                    write: true,
                    value: this.state.orderDetails.address.line1,
                  }}
                  onChangeText={(text) => this.setState({line1: text})}
                  containerStyle={{marginBottom: 10}}
                />
                <CustomTextInput
                  editable
                  required={true}
                  field={{
                    label: 'Area, Colony, Street, Sector',
                    write: true,
                    value: this.state.orderDetails.address.line2,
                  }}
                  onChangeText={(text) => this.setState({line2: text})}
                  containerStyle={{marginBottom: 10}}
                />
                <CustomTextInput
                  editable
                  required={true}
                  field={{
                    label: 'Landmark',
                    write: true,
                    value: this.state.orderDetails.address.line3,
                  }}
                  onChangeText={(text) => this.setState({line3: text})}
                  containerStyle={{marginBottom: 10}}
                />
                <CustomTextInput
                  editable
                  required={true}
                  field={{
                    label: 'City/Town',
                    write: true,
                    value: this.state.orderDetails.address.city,
                  }}
                  containerStyle={{marginBottom: 10}}
                />
                <CustomTextInput
                  editable
                  required={true}
                  field={{
                    label: 'State',
                    write: true,
                    value: this.state.orderDetails.address.state,
                  }}
                  containerStyle={{marginBottom: 10}}
                />
                <CustomTextInput
                  editable
                  required={true}
                  field={{
                    label: 'Country',
                    write: true,
                    value: this.state.orderDetails.address.country,
                  }}
                  containerStyle={{marginBottom: 10}}
                />
              </View>
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
                      this.state.orderDetails.address.latitude,
                    ),
                    longitude: parseFloat(
                      this.state.orderDetails.address.longitude,
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
                        this.state.orderDetails.address.latitude,
                      ),
                      longitude: parseFloat(
                        this.state.orderDetails.address.longitude,
                      ),
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
  renderConfirmOrderStatus = () => {
    const {paymentConfirmationModal, orderDetails} = this.state;
    return (
      <Portal>
        <Dialog
          visible={paymentConfirmationModal}
          onDismiss={() =>
            this.setState({
              paymentConfirmationModal: false,
            })
          }>
          <Dialog.Title
            style={{
              color: themes.TEXT_BLUE_COLOR,
              justifyContent: 'center',
              textAlign: 'center',
              borderBottomColor: themes.CONTENT_GREEN_BACKGROUND,
              borderBottomWidth: 3,
            }}>
            Confirm Order Status
          </Dialog.Title>
          <Dialog.ScrollArea>
            <ScrollView>
              <Text>{`Did you receive the payment of ₹${
                orderDetails.totalPrice
              } via ${getPaymentModeName(orderDetails.paymentMode)}?`}</Text>
            </ScrollView>
          </Dialog.ScrollArea>
          <Dialog.Actions
            style={{alignItems: 'center', justifyContent: 'center'}}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-evenly',
                flexWrap: 'wrap',
                alignItems: 'center',
              }}>
              <View style={{flex: 1, margin: 10}}>
                <FunctionButton
                  text="No"
                  color="red"
                  onPress={() => {
                    this.setState({paymentConfirmationModal: false});
                    this.updateOrder(false);
                  }}
                />
              </View>
              <View style={{flex: 1, margin: 10}}>
                <FunctionButton
                  onPress={() => {
                    this.setState({paymentConfirmationModal: false});
                    this.updateOrder(true);
                  }}
                  text="YES"
                  color={themes.TEXT_BLUE_COLOR}
                />
              </View>
            </View>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    );
  };
  renderAddInvoiceModal = () => {
    const {addInvoiceModalVisibility, orderDetails} = this.state;
    return (
      <Portal>
        <Dialog
          visible={addInvoiceModalVisibility}
          onDismiss={() =>
            this.setState({
              addInvoiceModalVisibility: false,
            })
          }>
          <Dialog.Title
            style={{
              color: themes.TEXT_BLUE_COLOR,
              justifyContent: 'center',
              textAlign: 'center',
              borderBottomColor: themes.CONTENT_GREEN_BACKGROUND,
              borderBottomWidth: 3,
            }}>
            Add An Invoice
          </Dialog.Title>
          <Dialog.ScrollArea>
            <AddInvoice
              orderDetails={orderDetails}
              closeModal={() =>
                this.setState({addInvoiceModalVisibility: false})
              }
            />
          </Dialog.ScrollArea>
        </Dialog>
      </Portal>
    );
  };
  render() {
    const WIDTH = Dimensions.get('window').width - 10;
    const HEIGHT = Dimensions.get('window').height / 2 - 100;
    const {
      medicineList,
      showImage,
      newImages,
      images,
      showprogress,
      orderDetails,
      medicineModal,
      loading,
    } = this.state;
    return (
      <PlainBaseView color={themes.CONTENT_GREEN_BACKGROUND}>
        {loading ? (
          <CustomeProgress showprogress={loading} />
        ) : (
          <View>
            <ScrollView>
              <View
                style={{
                  flex: 0.6,
                  backgroundColor: themes.CONTENT_GREEN_BACKGROUND,
                  borderBottomLeftRadius: 50,
                  borderBottomRightRadius: 50,
                  elevation: 10,
                  shadowColor: '#00000',
                  shadowRadius: 25,
                  shadowOffset: {height: 10, width: 0},
                  // justifyContent: 'center'
                }}>
                <View style={{flex: 0.5}}>
                  <AppBar />
                </View>
                <View
                  style={{
                    flex: 3,
                    // justifyContent: 'center',
                    paddingHorizontal: 5,
                    paddingVertical: 5,
                    marginLeft: 0,
                  }}>
                  <View
                    style={{
                      paddingVertical: 0,
                      paddingHorizontal: 25,
                    }}>
                    <View
                      onPress={() =>
                        this.setState({changeOderStatusModal: true})
                      }
                      style={{
                        margin: 2,
                        backgroundColor: themes.TEXT_BLUE_COLOR,
                        padding: 2,
                        borderRadius: 15,
                        paddingVertical: 10,
                        paddingHorizontal: 0,
                      }}>
                      <Text
                        style={{
                          color: '#fff',
                          fontWeight: 'bold',
                          fontSize: themes.FONT_SIZE_MEDIUM,
                          textAlign: 'center',
                        }}>
                        {`${getStatusString(orderDetails.status)}`}
                      </Text>
                    </View>
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
                      Order Id:
                    </Text>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: themes.FONT_SIZE_MEDIUM,
                        textAlign: 'center',
                      }}>
                      {`# ${orderDetails.Id}`}
                    </Text>
                    {/* <View
                    style={{
                      backgroundColor: themes.GREEN_BLUE,
                      width: 1,
                      margin: 2,
                      marginHorizontal: 10,
                    }}></View>
                  <Text style={{fontSize: themes.FONT_SIZE_LARGE}}> 6:50 PM</Text> */}
                    <View
                      style={{
                        backgroundColor: themes.GREEN_BLUE,
                        width: 1,
                        margin: 2,
                        marginHorizontal: 10,
                      }}
                    />
                    <Text
                      style={{
                        fontSize: themes.FONT_SIZE_MEDIUM,
                        textAlignVertical: 'center',
                      }}>
                      {' '}
                      45 min ETA
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: 10,
                      paddingHorizontal: 15,
                      marginBottom: 10,
                      alignItems: 'center',
                      alignSelf: 'center',
                    }}>
                    <Text
                      style={{
                        fontSize: themes.FONT_SIZE_MEDIUM,
                        textAlign: 'center',
                      }}>
                      Payment Mode:
                    </Text>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        fontSize: themes.FONT_SIZE_MEDIUM,
                        textAlign: 'center',
                      }}>
                      {` ${getPaymentModeName(orderDetails.paymentMode)}`}
                    </Text>
                  </View>
                </View>
                {/* <Text
                  style={{
                    fontSize: themes.FONT_SIZE_MEDIUM,
                    textAlign: 'center',
                  }}>
                  {formateDate(orderDetails.orderTime)}
                </Text> */}
                <Text
                  style={{
                    fontSize: themes.FONT_SIZE_MEDIUM,
                    textAlign: 'center',
                    marginBottom: 10,
                  }}>
                  {formateDate(orderDetails.orderTime)}
                </Text>
                {orderDetails.paymentDone && !orderDetails.paymentVerified ? (
                  <TouchableOpacity
                    onPress={() =>
                      this.setState({
                        paymentConfirmationModal: true,
                      })
                    }>
                    <Text
                      style={{
                        fontSize: themes.FONT_SIZE_NORMAL,
                        textAlign: 'center',
                        color: 'red',
                      }}>
                      {'*Press To Confirm Payment'}
                    </Text>
                  </TouchableOpacity>
                ) : orderDetails.paymentDone && orderDetails.paymentVerified ? (
                  <Text
                    style={{
                      fontSize: themes.FONT_SIZE_NORMAL,
                      textAlign: 'center',
                      color: 'green',
                    }}>
                    {'Payment Done'}
                  </Text>
                ) : (
                  <Text
                    style={{
                      fontSize: themes.FONT_SIZE_NORMAL,
                      textAlign: 'center',
                      color: 'red',
                    }}>
                    {'Payment Pending'}
                  </Text>
                )}
              </View>

              <CustomeProgress showprogress={showprogress} />
              <View style={{marginTop: 10}}>
                {/* <View style={{flexDirection: 'row-reverse'}}>
                  <TouchableOpacity
                    onPress={() =>
                      this.checkPermission(this.props.route.params.order.keys)
                    }
                    style={{
                      position: 'relative',
                      backgroundColor: themes.TEXT_BLUE_COLOR,
                      padding: 5,
                      borderRadius: 15,
                      paddingVertical: 5,
                      paddingHorizontal: 10,
                      flexDirection: 'row',
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Icon name="download" size={20} color={'#fff'} />
                    <Text
                      style={{
                        fontSize: themes.FONT_SIZE_SMALL,
                        fontWeight: 'bold',
                        color: '#fff',
                        marginLeft: 10,
                      }}>
                      DOWNLOAD
                    </Text>
                  </TouchableOpacity>
                </View> */}
                {images.length > 0 ? (
                  <ScrollView horizontal={true} style={{minHeight: 330}}>
                    {images.map((img) => {
                      return (
                        <TouchableHighlight
                          onPress={() => this.setState({showImage: true})}
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
                ) : (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: 'center',
                      alignItems: 'center',
                    }}>
                    <Image source={WarnigPic} />
                    <Text>No Prescription Available</Text>
                  </View>
                )}

                {/* <View style={{paddingHorizontal: 40, paddingVertical: 10}}>
                <TouchableOpacity
                  onPress={() =>
                    this.checkPermission(this.props.route.params.order.keys)
                  }
                  style={{
                    position: 'relative',
                    backgroundColor: themes.TEXT_BLUE_COLOR,
                    padding: 5,
                    borderRadius: 15,
                    paddingVertical: 10,
                    paddingHorizontal: 0,
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                  }}>
                  <Icon name="download" size={29} color={'#fff'} />
                  <Text
                    style={{
                      fontSize: themes.FONT_SIZE_LARGE,
                      fontWeight: 'bold',
                      color: '#fff',
                      marginLeft: 10,
                    }}>
                    DOWNLOAD
                  </Text>
                </TouchableOpacity>
              </View> */}
                <View style={{paddingHorizontal: 10, paddingVertical: 10}}>
                  <View style={{marginHorizontal: 8, flexDirection: 'row'}}>
                    <CustomTextInput
                      editable
                      required={true}
                      field={{
                        label: 'Patient Name',
                        write: true,
                        value: this.state.orderDetails.patientName,
                      }}
                      containerStyle={{margin: 10}}
                    />
                    <CustomTextInput
                      editable
                      required={true}
                      field={{
                        label: 'Mobile Number',
                        write: true,
                        value: this.state.orderDetails.mobileNumber,
                        type: 'phone',
                      }}
                      containerStyle={{margin: 10}}
                    />
                  </View>
                  <View style={{flexDirection: 'row-reverse'}}>
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({
                          medicineModal: {
                            ...medicineModal,
                            visibility: true,
                            toadd: true,
                          },
                        })
                      }
                      style={{
                        flexDirection: 'row',
                        backgroundColor: themes.TEXT_BLUE_COLOR,
                        borderRadius: 25,
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                      }}>
                      <AntDesignIcon
                        name="pluscircle"
                        size={20}
                        color={'#fff'}
                      />
                      <Text
                        style={{
                          color: '#fff',
                          fontWeight: 'bold',
                          marginLeft: 5,
                          textAlignVertical: 'center',
                        }}>
                        Medicine
                      </Text>
                    </TouchableOpacity>
                  </View>
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
                      <Text
                        style={{
                          flex: 0.8,
                          textAlign: 'center',
                          textAlignVertical: 'center',
                          fontWeight: 'bold',
                          color: themes.TEXT_BLUE_COLOR,
                        }}>
                        {'Price'}
                      </Text>
                    </View>
                  ) : null}

                  {medicineList.map((med, index) => {
                    return (
                      <TouchableOpacity
                        onPress={() => {
                          let {medicineModal, data} = this.state;
                          medicineModal = {
                            ...medicineModal,
                            visibility: true,
                            toadd: false,
                            index: index,
                          };
                          data = {...med};
                          this.setState({medicineModal, data});
                        }}
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
                          <Text
                            style={{
                              flex: 0.8,
                              textAlign: 'center',
                              textAlignVertical: 'center',
                            }}>
                            {med.price}
                          </Text>
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
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'flex-end',
                      alignItems: 'flex-end',
                      marginHorizontal: 15,
                    }}>
                    <TouchableOpacity
                      onPress={() =>
                        this.setState({
                          addInvoiceModalVisibility: true,
                        })
                      }
                      style={{
                        flexDirection: 'row',
                        backgroundColor: themes.TEXT_BLUE_COLOR,
                        borderRadius: 25,
                        paddingHorizontal: 10,
                        paddingVertical: 5,
                      }}>
                      {orderDetails.invoiceKey &&
                      orderDetails.invoiceKey.length > 0 ? (
                        <AntDesignIcon name="edit" size={20} color={'#fff'} />
                      ) : (
                        <AntDesignIcon
                          name="pluscircle"
                          size={20}
                          color={'#fff'}
                        />
                      )}

                      <Text
                        style={{
                          color: '#fff',
                          fontWeight: 'bold',
                          marginLeft: 5,
                          textAlignVertical: 'center',
                        }}>
                        Upload Invoice
                      </Text>
                    </TouchableOpacity>
                    <Text
                      style={{
                        flex: 1,
                        flexDirection: 'row-reverse',
                        fontWeight: 'bold',
                        marginVertical: 10,
                        textAlign: 'right',
                        fontSize: themes.FONT_SIZE_MEDIUM,
                      }}>{`Total  ₹${
                      orderDetails.totalPrice ? orderDetails.totalPrice : 0
                    }`}</Text>
                  </View>
                  <View style={{marginHorizontal: 5, marginVertical: 10}}>
                    <ExpandeablePanel
                      title={`Delivery To: ${this.state.orderDetails.address.line1} ${this.state.orderDetails.address.line2} ${this.state.orderDetails.address.line3} ${this.state.orderDetails.address.city} ${this.state.orderDetails.address.state}`}>
                      {this.renderChangeAddress()}
                    </ExpandeablePanel>
                  </View>
                </View>
                <View style={{paddingHorizontal: 10, paddingVertical: 10}}>
                  <SiCheckBox
                    title="Repeat Order"
                    containerStyle={{
                      backgroundColor: '#fff',
                      margin: 0,
                      marginHorizontal: 0,
                      marginVertical: 0,
                      padding: 5,
                      borderWidth: 0,
                    }}
                    checked={this.state.orderDetails.repeatOrder}
                  />
                  {this.state.orderDetails.repeatOrder ? (
                    <View>
                      <Text
                        style={{
                          marginTop: 10,
                          fontWeight: 'bold',
                          fontSize: themes.FONT_SIZE_NORMAL,
                          marginHorizontal: 10,
                        }}>
                        {`Order Frequency: ${getRepeatOrderString(
                          this.state.orderDetails.frequency,
                        )}`}
                      </Text>
                      <SiNewDate
                        value={this.state.orderDetails.orderExpiry}
                        textlabel={
                          this.state.orderDetails.frequency === 'once'
                            ? 'Next Order Date'
                            : 'Order Expire Date'
                        }
                        // style={{borderWidth: 1}}
                        // containerStyle={{marginTop: 10}}
                        disabled={true}
                      />
                    </View>
                  ) : null}
                </View>

                <View style={{marginHorizontal: 8}}>
                  {this.state.historyCommments &&
                  this.state.historyCommments !== '' ? (
                    <View style={{marginHorizontal: 10}}>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          fontSize: themes.FONT_SIZE_MEDIUM,
                        }}>
                        Previous Comments
                      </Text>
                      <Text>{this.state.historyCommments}</Text>
                    </View>
                  ) : // <Text>{this.historyCommments}</Text>
                  null}
                  <CustomTextInput
                    editable
                    required={true}
                    field={{
                      label: 'Additional Comments',
                      write: true,
                      value: this.state.orderDetails.comments,
                    }}
                    containerStyle={{margin: 10}}
                    onChangeText={(text) =>
                      this.setState({
                        orderDetails: {
                          ...orderDetails,
                          comments: text,
                        },
                      })
                    }
                  />
                </View>
                <View style={{paddingHorizontal: 30}}>
                  <CustomButton
                    text="Update Order"
                    // onPress={() => this.updateOrder()}
                    onPress={() => this.setState({changeOderStatusModal: true})}
                  />
                </View>
                <Modal
                  visible={showImage}
                  onDismiss={() => this.setState({showImage: false})}
                  onRequestClose={() => this.setState({showImage: false})}>
                  <ImageViewer imageUrls={images} />
                  <TouchableOpacity
                    onPress={() => this.setState({showImage: false})}
                    style={{backgroundColor: 'black', position: 'absolute'}}>
                    <Icon name="close" size={30} color={'#fff'} />
                  </TouchableOpacity>
                </Modal>
              </View>
            </ScrollView>
            {this.renderAddMedicineModal()}
            {this.renderChangeOrderStatus()}
            {orderDetails.paymentDone && !orderDetails.paymentVerified
              ? this.renderConfirmOrderStatus()
              : null}
          </View>
        )}
      </PlainBaseView>
    );
  }
}
export default NotificationViewOrderDetails;
