/* eslint-disable react-hooks/exhaustive-deps */
import React, {useState, useEffect} from 'react';
import {
  Text,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import CustomeProgress from '../components/CustomProgress';
import PharmacyImg from '../assets/drugstore.png';
import DoctorMaleImage from '../assets/doctorMale.jpg';
import DoctorFemaleImage from '../assets/doctorFemale.jpg';
import themes from '../themes';
import CustomTextInput from '../components/LoginTextInput';
import {getUserDetails, setUserDetails} from '../utils/userprofile';
import ExpandeablePanel from '../components/ExpandeablePanel';
import LocationApi from '../utils/locationAPI';
import MedToast from '../components/MedToast';
import MapImg from '../assets/map.png';
import Icon from 'react-native-vector-icons/Ionicons';
import MapView, {Marker} from 'react-native-maps';
import CustomButton from '../components/CustomButton';
import Device_Api from '../utils/api';
import SiNewDate from '../components/SiNewDate';
import CustomTimePicker from '../components/CustomTimePicker';
const EditProfile = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [userEmailValidation, setUserEmailValidation] = useState('');
  const [userName, setUserName] = useState('');
  const [userNameValidation, setUserNameValidation] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userPasswordValidation, setUserPasswordValidation] = useState('');
  const [userMobile, setUserMobile] = useState('');
  const [userMobileValidation, setUserMobileValidation] = useState('');
  const [landline, setLandline] = useState('');
  const [landlineValidation, setLandlineValidation] = useState('');
  const [licence, setLicence] = useState('');
  const [licenceValidation, setLicenceValidation] = useState('');
  const [type, setType] = useState('doctor');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [contactPerson, setContactPerson] = useState('');
  const [contactPersonValidation, setContactPersonValidation] = useState('');
  const [speciality, setSpeciality] = useState('');
  const [description, setDescription] = useState('');

  const [line1, setLine1] = useState('');
  const [line2, setLine2] = useState('');
  const [line3, setLine3] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [pincode, setPincode] = useState('');
  const [lat, setLan] = useState(12.9915028293388);
  const [lon, setLon] = useState(77.72336724947571);

  const [monday, setMonday] = useState('');
  const [tuesday, setTuesday] = useState('');
  const [wednesday, setWednesday] = useState('');
  const [thrusday, setThrusday] = useState('');
  const [friday, setFriday] = useState('');
  const [saturday, setSaturday] = useState('');
  const [sunday, setSunday] = useState('');
  const [Id, setId] = useState('');
  const [latDelta, setLanDelta] = useState(0.03);
  const [lonDelta, setLonDelta] = useState(0.03);
  useEffect(() => {
    console.log('USE EFFECT CALLED');
    navigation.setOptions({
      title: 'My Account',
      headerTitleStyle: {
        color: themes.TEXT_BLUE_COLOR,
      },
      headerStyle: {
        backgroundColor: themes.CONTENT_GREEN_BACKGROUND,
      },
    });
    getUserDetail();
  }, []);

  const getUserDetail = async () => {
    let userDetails = await getUserDetails();
    if (userDetails) {
      userDetails = JSON.parse(userDetails);
      console.log('USER DETAILS ARE: ', userDetails);
      setLine1(userDetails.address.line1);
      setLine2(userDetails.address.line2);
      setLine3(userDetails.address.line3);
      setCity(userDetails.address.city);
      setState(userDetails.address.state);
      setCountry(userDetails.address.country);
      setPincode(userDetails.address.pincode);

      setUserEmail(userDetails.emailId);
      setAge(userDetails.age);
      setContactPerson(userDetails.contactPerson);
      setDescription(userDetails.description);
      setLandline(userDetails.landline);
      setLan(parseFloat(userDetails.latitude));
      setLon(parseFloat(userDetails.longitude));
      setLicence(userDetails.licence);
      setUserMobile(userDetails.mobileNumber);
      setUserName(userDetails.name);
      setUserPassword(userDetails.password);
      setSpeciality(userDetails.speciality);
      setType(userDetails.type);
      setId(userDetails.Id);
      setMonday(userDetails.time.monday);
      setTuesday(userDetails.time.tuesday);
      setWednesday(userDetails.time.wednesday);
      setThrusday(userDetails.time.thrusday);
      setFriday(userDetails.time.friday);
      setSaturday(userDetails.time.saturday);
      setSunday(userDetails.time.sunday);
    }
    setLoading(false);
  };
  const validateText = (inp) => {
    let letters = /^[a-zA-Z. ]*$/;
    if (inp.match(letters)) {
      return true;
    }
    return false;
  };
  const validateEmailId = (inp) => {
    let letters = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (inp.match(letters)) {
      return true;
    }
    return false;
  };
  const validateMobileNumber = (inp) => {
    let letters = /^[0-9]{10}$/;
    if (inp.match(letters)) {
      return true;
    }
    return false;
  };
  // const validateLicence = (inp) => {
  //   var str = inp.replace(/-/g, '');
  //   console.log('STR= ', str, inp);
  //   var matches = str.match(/(\d+)/);
  //   console.log('MATCHES iS: ', matches[0]);
  //   if (matches && matches[0].toString().length === 10) {
  //     console.log('CAME ISIDE...................');
  //     console.log((inp.match(/-/g) || []).length);
  //     if (
  //       (inp.match(/-/g) || []).length === 1 ||
  //       (inp.match(/-/g) || []).length === 2
  //     ) {
  //       return true;
  //     }
  //   }
  //   return false;
  // };
  const validatePassword = (inp) => {
    let letters = /^[a-zA-Z0-9.!#@$%&'*+/=?^_`{|}~-]{6,15}$/;
    if (inp.match(letters)) {
      return true;
    }
    return false;
  };
  const checkIfOnlyNum = (val) => {
    return /^\d+$/.test(val);
  };
  const getLocationDetailsFromPincode = (pincode) => {
    LocationApi.getLocationFromPincode(pincode)
      .then((result) => {
        let res = result.results;
        console.log('Result for pincode is: ', res);
        if (res && res.length > 0) {
          //Set Lat/Log
          console.log(
            'Addr.lat is:',
            parseFloat(res[0].geometry.location.lat),
            parseFloat(res[0].geometry.location.lng),
          );

          if (res[0].geometry.location.lat) {
            setLan(parseFloat(res[0].geometry.location.lat));
          }
          if (res[0].geometry.location.lng) {
            setLon(parseFloat(res[0].geometry.location.lng));
          }
          //Set Address
          let addr = res[0].formatted_address;
          console.log('Addr is: ', addr);
          if (addr && addr !== '') {
            let arr = addr.split(' ');
            const len = arr.length;
            let i = len - 1;
            console.log('Arr is: ', arr, len);
            arr.map((a, index) => {
              arr[index] = a.replace(',', '');
            });
            console.log('FORMATED Arr is: ', arr, len);
            let isnum = /^\d+$/.test(arr[i - 1]);
            console.log('isnum: ', isnum);
            if (!checkIfOnlyNum(arr[i])) {
              setCountry(arr[i]);
            }
            if (!checkIfOnlyNum(arr[i - 1]) && i - 1 >= 0) {
              setCountry(arr[i - 1]);
            }
            if (!checkIfOnlyNum(arr[i - 2]) && i - 2 >= 0) {
              setState(arr[i - 2]);
            }
            if (!checkIfOnlyNum(arr[i - 3]) && i - 3 >= 0) {
              setCity(arr[i - 3]);
            }
            if (!checkIfOnlyNum(arr[i - 4]) && i - 4 >= 0) {
              setLine2(arr[i - 4]);
            }
          }
        }
      })
      .catch((err) => {
        console.log(
          'An error occurred while fecthing location from pincode: ',
          err,
        );
      });
  };

  const setPincodeDate = (text) => {
    if (text.length < 6) {
      setPincode(text);
    } else if (text.length === 6) {
      getLocationDetailsFromPincode(text);
      setPincode(text);
    } else {
      MedToast.show('Please enter a valid pincode');
    }
  };

  const renderMap = () => {
    return (
      <Modal
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}>
        <View style={{backgroundColor: '#fff'}}>
          <TouchableOpacity onPress={() => setShowModal(false)}>
            <Icon name="close" size={30} />
          </TouchableOpacity>
          <View style={{paddingHorizontal: 10}}>
            <Text
              style={{
                textAlign: 'center',
                color: themes.TEXT_BLUE_COLOR,
                paddingHorizontal: 10,
                fontSize: themes.FONT_SIZE_LARGE,
                fontWeight: 'bold',
              }}>
              Mark Exact Location On Map
            </Text>
            <View
              style={{
                marginTop: 10,
                height: 3,
                backgroundColor: themes.CONTENT_GREEN_BACKGROUND,
              }}
            />
          </View>
        </View>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'center',
            backgroundColor: '#fff',
            // padding: 40,
          }}>
          <MapView
            region={{
              latitude: lat,
              longitude: lon,
              latitudeDelta: latDelta,
              longitudeDelta: lonDelta,
            }}
            onRegionChangeComplete={(e) => {
              console.log('Region change is: ', e);
              setLanDelta(e.latitudeDelta);
              setLonDelta(e.longitudeDelta);
            }}
            style={{width: '100%', height: 400}}>
            <Marker.Animated
              draggable={true}
              coordinate={{latitude: lat, longitude: lon}}
              onDragEnd={(e) => {
                console.log('dragEnd', e.nativeEvent);
                setLan(e.nativeEvent.coordinate.latitude);
                setLon(e.nativeEvent.coordinate.longitude);
                // this.setState({x: e.nativeEvent.coordinate});
              }}
            />
          </MapView>
        </View>
        <View>
          <Text
            style={{
              textAlign: 'center',
              color: 'red',
              paddingHorizontal: 10,
              fontSize: themes.FONT_SIZE_SMALL,
            }}>
            *Long Press On The Red Marker to move it
          </Text>
        </View>
      </Modal>
    );
  };

  const updateUser = () => {
    if (!validateText(userName) || userName === '') {
      MedToast.show('Enter A Valid Name');
      return;
    } else if (!validateEmailId(userEmail)) {
      MedToast.show('Please Enter a Valid Email ID');
      return;
    } else if (!validateMobileNumber(userMobile)) {
      MedToast.show('Please Enter a Valid Mobile Number');
      return;
    } else if (!validatePassword(userPassword)) {
      MedToast.show('Please Enter a Valid Password');
      return;
    } else if (
      line1 === '' ||
      line2 === '' ||
      // line3 === '' ||
      city === '' ||
      state === '' ||
      country === ''
    ) {
      MedToast.show('Please a valid address');
      return;
    }
    setLoading(true);
    let obj = {
      Id: Id,
      name: userName,
      emailId: userEmail,
      licence: licence,
      mobileNumber: userMobile,
      password: userPassword,
      address: {
        line1: line1,
        line2: line2,
        line3: line3,
        city: city,
        state: state,
        country: country,
        pincode: pincode,
      },
      time: {
        monday: monday,
        tuesday: tuesday,
        wednesday: wednesday,
        thrusday: thrusday,
        friday: friday,
        saturday: saturday,
        sunday: sunday,
      },
      latitude: lat.toString(),
      longitude: lon.toString(),
      type: type,
      age: age,
      contactPerson: contactPerson,
      landline: landline,
      speciality: speciality,
      description: description,
    };
    console.log('OBJ is: ', obj);
    Device_Api.updatePartnerDetails(obj)
      .then((res) => {
        console.log('Res is: ', res);
        if (res.statusCode === 200) {
          setUserDetails(obj);
          MedToast.show('Updated User Successfully');
          setUserDetails(obj);
          navigation.goBack();
        } else {
          MedToast.show('An error Occurred While Updating Profile');
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log('An error Occurred: ', err);
        MedToast.show('An error Occurred');
      });
  };

  return (
    <View style={styles.container}>
      <CustomeProgress showprogress={loading} />
      <KeyboardAvoidingView
        style={styles.content}
        behavior={'height'}
        keyboardVerticalOffset={60}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          style={{
            // marginHorizontal: 10,
            // marginVertical: 20,
            // // maxHeight: 450,
            // paddingBottom: 0,
            // paddingVertical: 0,
            flex: 1,
          }}>
          <View>
            <Text
              style={{
                fontWeight: 'bold',
                color: 'grey',
                fontSize: themes.FONT_SIZE_MEDIUM,
              }}>
              I'm a
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}>
              <TouchableOpacity
                onPress={() => setType('doctor')}
                style={{
                  borderColor: themes.GREEN_BLUE,
                  borderWidth: type === 'doctor' ? 3 : 0,
                  backgroundColor:
                    type === 'doctor'
                      ? themes.CONTENT_GREEN_BACKGROUND
                      : '#fff',
                  padding: 10,
                  borderRadius: 25,
                }}>
                <Image
                  source={DoctorMaleImage}
                  style={{
                    width: 70,
                    height: 50,
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    fontSize: themes.FONT_SIZE_NORMAL,
                    fontWeight: type === 'doctor' ? 'bold' : null,
                  }}>
                  Doctor
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setType('pharmacy')}
                style={{
                  backgroundColor:
                    type !== 'doctor'
                      ? themes.CONTENT_GREEN_BACKGROUND
                      : '#fff',
                  borderColor: themes.GREEN_BLUE,
                  borderWidth: type !== 'doctor' ? 3 : 0,
                  padding: 10,
                  borderRadius: 25,
                }}>
                <Image
                  source={PharmacyImg}
                  style={{
                    width: 70,
                    height: 50,
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    fontSize: themes.FONT_SIZE_NORMAL,
                    fontWeight: type !== 'doctor' ? 'bold' : null,
                  }}>
                  Pharmacy{' '}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{}}>
            <CustomTextInput
              editable
              required={true}
              field={{
                label: type !== 'doctor' ? 'Pharmacy Name' : 'Name',
                write: true,
                value: userName,
              }}
              onChangeText={(text) => {
                if (validateText(text)) {
                  setUserName(text);
                  setUserNameValidation('');
                } else {
                  MedToast.show('Please enter a valid name');
                  setUserNameValidation('Please enter a valid name');
                }
              }}
              errorMessage={userNameValidation}
            />
          </View>
          <View style={{}}>
            <CustomTextInput
              editable
              required={true}
              field={{
                label: 'Email',
                write: true,
                value: userEmail,
                type: 'email',
              }}
              onChangeText={(text) => setUserEmail(text)}
              onSubmitEditing={() => {
                if (!validateEmailId(userEmail)) {
                  setUserEmailValidation('Please Enter a Valid Email ID');
                  MedToast.show('Please Enter a Valid Email ID');
                } else {
                  setUserEmailValidation('');
                }
              }}
              errorMessage={userEmailValidation}
            />
          </View>
          <View style={{}}>
            <CustomTextInput
              editable
              required={true}
              field={{
                label: 'Licence',
                write: true,
                value: licence,
                type: 'licence',
              }}
              onChangeText={(text) => setLicence(text)}
              // onSubmitEditing={() => {
              //   if (!validateLicence(licence)) {
              //     MedToast.show('Please Enter a Licence Number');
              //     setLicenceValidation('Please Enter a Licence Number');
              //   } else {
              //     setLicenceValidation('');
              //   }
              // }}
              // errorMessage={licenceValidation}
            />
          </View>
          <View>
            <CustomTextInput
              editable
              required={true}
              field={{
                label: 'Mobile Number',
                write: true,
                value: userMobile,
                type: 'number',
              }}
              onChangeText={(text) => setUserMobile(text)}
              onSubmitEditing={() => {
                if (!validateMobileNumber(userMobile)) {
                  MedToast.show('Please Enter a Valid Mobile Number');
                  setUserMobileValidation('Please Enter a Valid Mobile Number');
                } else {
                  setUserMobileValidation('');
                }
              }}
              errorMessage={userMobileValidation}
            />
          </View>
          <View>
            <CustomTextInput
              editable
              required={true}
              field={{
                label: 'Landline Number',
                write: true,
                value: landline,
                type: 'number',
              }}
              onChangeText={(text) => setLandline(text)}
              onSubmitEditing={() => {
                if (!validateMobileNumber(landline)) {
                  MedToast.show('Please Enter a Valid Landline Number');
                  setLandlineValidation('Please Enter a Valid Landline Number');
                } else {
                  setLandlineValidation('');
                }
              }}
              errorMessage={landlineValidation}
            />
          </View>

          {/* <View>
            <CustomTextInput
              editable
              required={true}
              field={{
                label: 'Password',
                write: true,
                value: userPassword,
                type: 'password',
              }}
              onChangeText={(text) => setUserPassword(text)}
              onSubmitEditing={() => {
                if (!validatePassword(userPassword)) {
                  MedToast.show('Please Enter a Valid Password');
                  setUserPasswordValidation(
                    'Password should have minimum length of 6 character and maximum length of 15 character',
                  );
                } else {
                  setUserPasswordValidation('');
                }
              }}
              errorMessage={userPasswordValidation}
            />
          </View> */}
          <View>
            <Text
              style={{
                fontWeight: 'bold',
                color: 'grey',
                fontSize: themes.FONT_SIZE_MEDIUM,
              }}>
              Gender
            </Text>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
              }}>
              <TouchableOpacity
                onPress={() => setGender('male')}
                style={{
                  borderColor: themes.GREEN_BLUE,
                  borderWidth: gender === 'male' ? 3 : 0,
                  backgroundColor:
                    gender === 'male'
                      ? themes.CONTENT_GREEN_BACKGROUND
                      : '#fff',
                  padding: 10,
                  borderRadius: 25,
                }}>
                <Image
                  source={DoctorMaleImage}
                  style={{
                    width: 70,
                    height: 50,
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    fontSize: themes.FONT_SIZE_NORMAL,
                    fontWeight: gender === 'male' ? 'bold' : null,
                  }}>
                  Male
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setGender('female')}
                style={{
                  backgroundColor:
                    gender !== 'male'
                      ? themes.CONTENT_GREEN_BACKGROUND
                      : '#fff',
                  borderColor: themes.GREEN_BLUE,
                  borderWidth: gender !== 'male' ? 3 : 0,
                  padding: 10,
                  borderRadius: 25,
                }}>
                <Image
                  source={DoctorFemaleImage}
                  style={{
                    width: 70,
                    height: 50,
                    justifyContent: 'center',
                    alignSelf: 'center',
                  }}
                  resizeMode="contain"
                />
                <Text
                  style={{
                    textAlign: 'center',
                    textAlignVertical: 'center',
                    fontSize: themes.FONT_SIZE_NORMAL,
                    fontWeight: gender !== 'male' ? 'bold' : null,
                  }}>
                  Female
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View style={{marginBottom: 10}}>
            {/* <CustomTextInput
                        editable
                        required={true}
                        field={{
                          label: 'Age',
                          write: true,
                          value: age,
                          type: 'number',
                        }}
                        onChangeText={(text) => setAge(text)}
                      /> */}
            {/* <SiNewDate
              value={age}
              textlabel={type === 'doctor' ? 'Date Of Birth' : 'Opening Date'}
              // style={{borderWidth: 1}}
              // containerStyle={{marginTop: 10}}
              disabled={false}
              onChangeText={(date) => {
                console.log('Calledddddddddddddddd', date);
                setAge(date);
              }}
            /> */}
          </View>
          <View>
            <CustomTextInput
              editable
              required={true}
              field={{
                label: 'Contact Person Name',
                write: true,
                value: contactPerson,
              }}
              onChangeText={(text) => {
                if (validateText(text)) {
                  setContactPerson(text);
                  setContactPersonValidation('');
                } else {
                  MedToast.show('Please enter valid contact person name');
                  setContactPersonValidation(
                    'Please enter valid contact person name',
                  );
                }
              }}
              errorMessage={contactPersonValidation}
            />
          </View>
          <View>
            {type === 'doctor' ? (
              <CustomTextInput
                editable
                required={true}
                field={{
                  label: 'Speciality',
                  write: true,
                  value: speciality,
                }}
                onChangeText={(text) => setSpeciality(text)}
              />
            ) : null}
          </View>
          <View>
            <CustomTextInput
              editable
              required={true}
              field={{
                label: 'Description',
                write: true,
                value: description,
                type: 'description',
              }}
              multiline={true}
              numberOfLines={10}
              onChangeText={(text) => setDescription(text)}
            />
          </View>
          <View style={{marginBottom: 20}}>
            <ExpandeablePanel title="Address">
              <CustomTextInput
                editable
                required={true}
                field={{
                  label: 'pincode',
                  write: true,
                  value: pincode,
                  type: 'pincode',
                }}
                onChangeText={(text) => setPincodeDate(text)}
              />
              <CustomTextInput
                editable
                required={true}
                field={{
                  label: 'Flat, House No., Building',
                  write: true,
                  value: line1,
                  type: 'location',
                }}
                onChangeText={(text) => setLine1(text)}
              />
              <CustomTextInput
                editable
                required={true}
                field={{
                  label: 'Area, Colony, Street, Sector',
                  write: true,
                  value: line2,
                  type: 'location',
                }}
                onChangeText={(text) => setLine2(text)}
              />
              <CustomTextInput
                editable
                required={true}
                field={{
                  label: 'Landmark',
                  write: true,
                  value: line3,
                  type: 'location',
                }}
                onChangeText={(text) => setLine3(text)}
              />
              <CustomTextInput
                editable
                required={true}
                field={{
                  label: 'City',
                  write: true,
                  value: city,
                  type: 'location',
                }}
                onChangeText={(text) => setCity(text)}
              />
              <CustomTextInput
                editable
                required={true}
                field={{
                  label: 'State',
                  write: true,
                  value: state,
                  type: 'location',
                }}
                onChangeText={(text) => setState(text)}
              />
              <CustomTextInput
                editable
                required={true}
                field={{
                  label: 'Country',
                  write: true,
                  value: country,
                  type: 'location',
                }}
                onChangeText={(text) => setCountry(text)}
              />
              <TouchableOpacity
                onPress={() => setShowModal(true)}
                style={{flexDirection: 'row'}}>
                <Image source={MapImg} style={{width: 25, height: 25}} />
                <Text
                  style={{
                    fontWeight: 'bold',
                    color: 'grey',
                    fontSize: themes.FONT_SIZE_NORMAL,
                  }}>
                  Mark Extact Location On Map
                </Text>
              </TouchableOpacity>
            </ExpandeablePanel>
          </View>
          <View style={{marginBottom: 20}}>
            <ExpandeablePanel title="Time">
              <CustomTextInput
                editable
                required={true}
                field={{
                  label: 'Monday',
                  write: true,
                  value: monday,
                  type: 'time',
                }}
                onChangeText={(text) => setMonday(text)}
              />
              {/* <CustomTimePicker
                textlabel={'Monday'}
                value={monday}
                checked={monday.open24Hours}
                handleChangeOpening={(value) => {
                  setMonday({
                    ...monday,
                    opening: {
                      hours: value.hours,
                      minutes: value.minutes,
                    },
                  });
                }}
                handleChangeClosing={(value) => {
                  setMonday({
                    ...monday,
                    closing: {
                      hours: value.hours,
                      minutes: value.minutes,
                    },
                  });
                }}
                onCheckboxClick={() => {
                  setMonday({
                    opening: {hours: 0, minutes: 0},
                    closing: {hours: 23, minutes: 59},
                    open24Hours: !monday.open24Hours,
                  });
                }}
              /> */}
              <CustomTextInput
                editable
                required={true}
                field={{
                  label: 'Tuesday',
                  write: true,
                  value: tuesday,
                  type: 'time',
                }}
                onChangeText={(text) => setTuesday(text)}
              />
              {/* <CustomTimePicker
                textlabel={'Tuesday'}
                value={tuesday}
                checked={tuesday.open24Hours}
                handleChangeOpening={(value) => {
                  setTuesday({
                    ...tuesday,
                    opening: {
                      hours: value.hours,
                      minutes: value.minutes,
                    },
                  });
                }}
                handleChangeClosing={(value) => {
                  setTuesday({
                    ...tuesday,
                    closing: {
                      hours: value.hours,
                      minutes: value.minutes,
                    },
                  });
                }}
                onCheckboxClick={() => {
                  setTuesday({
                    opening: {hours: 0, minutes: 0},
                    closing: {hours: 23, minutes: 59},
                    open24Hours: !tuesday.open24Hours,
                  });
                }}
              /> */}
              <CustomTextInput
                editable
                required={true}
                field={{
                  label: 'Wednesday',
                  write: true,
                  value: wednesday,
                  type: 'time',
                }}
                onChangeText={(text) => setWednesday(text)}
              />
              {/* <CustomTimePicker
                textlabel={'Wednesday'}
                value={wednesday}
                checked={wednesday.open24Hours}
                handleChangeOpening={(value) => {
                  setWednesday({
                    ...wednesday,
                    opening: {
                      hours: value.hours,
                      minutes: value.minutes,
                    },
                  });
                }}
                handleChangeClosing={(value) => {
                  setWednesday({
                    ...wednesday,
                    closing: {
                      hours: value.hours,
                      minutes: value.minutes,
                    },
                  });
                }}
                onCheckboxClick={() => {
                  setWednesday({
                    opening: {hours: 0, minutes: 0},
                    closing: {hours: 23, minutes: 59},
                    open24Hours: !wednesday.open24Hours,
                  });
                }}
              /> */}
              <CustomTextInput
                editable
                required={true}
                field={{
                  label: 'Thrusday',
                  write: true,
                  value: thrusday,
                  type: 'time',
                }}
                onChangeText={(text) => setThrusday(text)}
              />
              {/* <CustomTimePicker
                textlabel={'Thrusday'}
                value={thrusday}
                checked={thrusday.open24Hours}
                handleChangeOpening={(value) => {
                  setThrusday({
                    ...thrusday,
                    opening: {
                      hours: value.hours,
                      minutes: value.minutes,
                    },
                  });
                }}
                handleChangeClosing={(value) => {
                  setThrusday({
                    ...thrusday,
                    closing: {
                      hours: value.hours,
                      minutes: value.minutes,
                    },
                  });
                }}
                onCheckboxClick={() => {
                  setThrusday({
                    opening: {hours: 0, minutes: 0},
                    closing: {hours: 23, minutes: 59},
                    open24Hours: !thrusday.open24Hours,
                  });
                }}
              /> */}
              <CustomTextInput
                editable
                required={true}
                field={{
                  label: 'Friday',
                  write: true,
                  value: friday,
                  type: 'time',
                }}
                onChangeText={(text) => setFriday(text)}
              />
              {/* <CustomTimePicker
                textlabel={'Friday'}
                value={friday}
                checked={friday.open24Hours}
                handleChangeOpening={(value) => {
                  setFriday({
                    ...friday,
                    opening: {
                      hours: value.hours,
                      minutes: value.minutes,
                    },
                  });
                }}
                handleChangeClosing={(value) => {
                  setFriday({
                    ...friday,
                    closing: {
                      hours: value.hours,
                      minutes: value.minutes,
                    },
                  });
                }}
                onCheckboxClick={() => {
                  setFriday({
                    opening: {hours: 0, minutes: 0},
                    closing: {hours: 23, minutes: 59},
                    open24Hours: !friday.open24Hours,
                  });
                }}
              /> */}
              <CustomTextInput
                editable
                required={true}
                field={{
                  label: 'Saturday',
                  write: true,
                  value: saturday,
                  type: 'time',
                }}
                onChangeText={(text) => setSaturday(text)}
              />
              {/* <CustomTimePicker
                textlabel={'Saturday'}
                value={saturday}
                checked={saturday.open24Hours}
                handleChangeOpening={(value) => {
                  setSaturday({
                    ...saturday,
                    opening: {
                      hours: value.hours,
                      minutes: value.minutes,
                    },
                  });
                }}
                handleChangeClosing={(value) => {
                  setSaturday({
                    ...saturday,
                    closing: {
                      hours: value.hours,
                      minutes: value.minutes,
                    },
                  });
                }}
                onCheckboxClick={() => {
                  setSaturday({
                    opening: {hours: 0, minutes: 0},
                    closing: {hours: 23, minutes: 59},
                    open24Hours: !saturday.open24Hours,
                  });
                }}
              /> */}
              <CustomTextInput
                editable
                required={true}
                field={{
                  label: 'Sunday',
                  write: true,
                  value: sunday,
                  type: 'time',
                }}
                onChangeText={(text) => setSunday(text)}
              />
              {/* <CustomTimePicker
                textlabel={'Sunday'}
                value={sunday}
                checked={sunday.open24Hours}
                handleChangeOpening={(value) => {
                  setSunday({
                    ...sunday,
                    opening: {
                      hours: value.hours,
                      minutes: value.minutes,
                    },
                  });
                }}
                handleChangeClosing={(value) => {
                  setSunday({
                    ...sunday,
                    closing: {
                      hours: value.hours,
                      minutes: value.minutes,
                    },
                  });
                }}
                onCheckboxClick={() => {
                  setSunday({
                    opening: {hours: 0, minutes: 0},
                    closing: {hours: 23, minutes: 59},
                    open24Hours: !sunday.open24Hours,
                  });
                }}
              /> */}
            </ExpandeablePanel>
          </View>
          <View>
            <CustomButton text={'UPDATE'} onPress={() => updateUser()} />
          </View>
        </ScrollView>
        {renderMap()}
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
  },
  content: {flex: 1},
  modalBackgroundColor: {backgroundColor: '#fff'},
  modalContainer: {
    flex: 1,
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    backgroundColor: '#fff',
    // padding: 40,
  },
  mapviewContainer: {width: '100%', height: 400},
  label: {
    fontWeight: 'bold',
    color: 'grey',
    fontSize: themes.FONT_SIZE_MEDIUM,
  },
  choiceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  choiceImage: {
    width: 70,
    height: 50,
    justifyContent: 'center',
    alignSelf: 'center',
  },
  expandeablePanelContainer: {marginBottom: 20},
  mapContainer: {flexDirection: 'row', marginTop: 10},
  mapLabel: {
    fontWeight: 'bold',
    color: 'grey',
    fontSize: themes.FONT_SIZE_NORMAL,
    textAlignVertical: 'center',
  },
  mapImage: {width: 25, height: 25},
});

const dynamicStyle = (condition) =>
  StyleSheet.create({
    firstContainer: {
      borderColor: themes.GREEN_BLUE,
      borderWidth: condition ? 3 : 0,
      backgroundColor: condition ? themes.CONTENT_GREEN_BACKGROUND : '#fff',
      padding: 10,
      borderRadius: 25,
    },
    firstlabel: {
      textAlign: 'center',
      textAlignVertical: 'center',
      fontSize: themes.FONT_SIZE_NORMAL,
      fontWeight: condition === 'doctor' ? 'bold' : null,
    },
  });
const dynamicStyle1 = (condition) =>
  StyleSheet.create({
    firstContainer: {
      borderColor: themes.GREEN_BLUE,
      borderWidth: condition ? 3 : 0,
      backgroundColor: condition ? themes.CONTENT_GREEN_BACKGROUND : '#fff',
      padding: 10,
      borderRadius: 25,
    },
    firstlabel: {
      textAlign: 'center',
      textAlignVertical: 'center',
      fontSize: themes.FONT_SIZE_NORMAL,
      fontWeight: condition ? 'bold' : null,
    },
  });

export default EditProfile;
