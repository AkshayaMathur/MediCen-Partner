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
  Button,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import logo from '../assets/logo.png';
import backgroundImage from '../assets/background.png';
import LinearGradient from 'react-native-linear-gradient';
import {AuthContext} from '../components/context';
import CustomButton from '../components/CustomButton';
import SecondaryButton from '../components/SecondaryButton';
import CustomTextInput from '../components/LoginTextInput';
import themes from '../themes';
import googlePic from '../assets/google-logo.jpg';
import twitterPic from '../assets/twitter-logo.png';
import facebookPic from '../assets/facebook-logo.jpg';
import MedToast from '../components/MedToast';
import CustomeProgress from '../components/CustomProgress';
import {StatusBar} from 'react-native';
import ExpandeablePanel from '../components/ExpandeablePanel';
import PharmacyImg from '../assets/drugstore.png';
import DoctorMaleImage from '../assets/doctorMale.jpg';
import DoctorFemaleImage from '../assets/doctorFemale.jpg';
import LocationApi from '../utils/locationAPI';
import axios from 'axios';
import MapView, {Marker} from 'react-native-maps';
import MapImg from '../assets/map.png';
import Icon from 'react-native-vector-icons/Ionicons';
import SiNewDate from '../components/SiNewDate';
import {set} from 'react-native-reanimated';
const SIZE = Dimensions.get('window');
const WIDTH = SIZE.width;
const HEIGHT = SIZE.HEIGHT;
const Login = ({navigation}) => {
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [userEmail, setUserEmail] = useState('');
  const [userName, setUserName] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userMobile, setUserMobile] = useState('');
  const [landline, setLandline] = useState('');
  const [licence, setLicence] = useState('');
  const [type, setType] = useState('doctor');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [contactPerson, setContactPerson] = useState('');
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

  const {signIn} = React.useContext(AuthContext);
  const login = (foundUser) => {
    signIn(foundUser);
  };
  const loginUser = () => {
    console.log('Email is: ', email);
    console.log('password is: ', password);
    setLoading(true);
    axios
      .post(
        'https://7d5simyvz0.execute-api.us-east-1.amazonaws.com/V1/checkpartner',
        {
          emailId: email,
          password: password,
        },
      )
      .then(function (response) {
        console.log(response.data);
        if (response.data.statusCode === 200) {
          login(response.data.body);
          setLoading(false);
          return;
        }
        console.log('Error');
        MedToast.show(`Login Failed: ${response.data.body.error}`);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        MedToast.show('An Error Occurred while Login');
        setLoading(false);
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
  const signUpNewUser = () => {
    setLoading(true);
    console.log('ABCDEF');
    let obj = {
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
    axios
      .post(
        'https://7d5simyvz0.execute-api.us-east-1.amazonaws.com/V1/add-partner',
        obj,
      )
      .then(function (res) {
        console.log('Response is: ', res);
        if (res.data.statusCode === 201) {
          login(res.data.body);
          setLoading(false);
          return;
        }
        MedToast.show(`Login Failed: ${res.data.body.error}`);
        setLoading(false);
      })
      .catch(function (error) {
        console.log(error);
        MedToast.show('An Error Occurred while Signup');
        setLoading(false);
      });
    // fetch(
    //   'https://7d5simyvz0.execute-api.us-east-1.amazonaws.com/V1/add-partner',
    //   {
    //     method: 'POST',
    //     body: JSON.stringify(obj),
    //   },
    // )
    //   .then((res) => res.json())
    //   .then((res) => {
    //     console.log('Response is: ', res);
    //     if (res.statusCode === 201) {
    //       login(res.body);
    //       setLoading(false);
    //       return;
    //     }
    //     MedToast.show(`Login Failed: ${res.body.error}`);
    //     setLoading(false);
    //   })
    //   .catch((err) => {
    //     console.log('Error is: ', err);
    //     MedToast.show(`An Error Occurred while Signup`);
    //     setLoading(false);
    //   });
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
  const checkIfOnlyNum = (val) => {
    return /^\d+$/.test(val.trim());
  };
  const getLocationDetailsFromPincode = (pincode) => {
    LocationApi.getLocationFromPincode(pincode)
      .then((res) => {
        console.log('Result for pincode is: ', res);
        if (res && res.length > 0) {
          //Set Lat/Log
          console.log('Addr.lat is:', res[0].lat, res[0].lon);

          if (res[0].lat) {
            setLan(parseFloat(res[0].lat));
          }
          if (res[0].lon) {
            setLon(parseFloat(res[0].lon));
          }
          //Set Address
          let addr = res[0].display_name;
          console.log('Addr is: ', addr);
          if (addr && addr !== '') {
            let arr = addr.split(',');
            const len = arr.length;
            let i = len - 1;
            console.log('Arr is: ', arr[i - 1].trim(), len);

            let isnum = /^\d+$/.test(arr[i - 1].trim());
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
              latitudeDelta: 0.03,
              longitudeDelta: 0.03,
            }}
            // onRegionChangeComplete={this.handleRegionChange}
            style={{width: '100%', height: 400}}>
            <Marker.Animated
              draggable={true}
              coordinate={{latitude: lat, longitude: lon}}
              onDragEnd={(e) => {
                console.log('dragEnd', e.nativeEvent.coordinate);
                setLan(e.nativeEvent.coordinate.latitude);
                setLon(e.nativeEvent.coordinate.longitude);
                // this.setState({x: e.nativeEvent.coordinate});
              }}
            />
          </MapView>
        </View>
      </Modal>
    );
  };
  return (
    <View style={{flex: 1}}>
      <StatusBar
        translucent={true}
        backgroundColor={'#3e8467'}
        // backgroundColor="#50b98d"
        // backgroundColor={'white'}
        barStyle="light-content"
      />
      <LinearGradient
        start={{x: 0.0, y: 0}}
        end={{x: 1, y: 1.0}}
        locations={[0, 60, 100]}
        colors={['#3c8868', '#3e8467', '#54ca98']}
        style={{flex: 1}}>
        <Image
          source={logo}
          resizeMode="contain"
          style={{width: '100%', height: 80, marginTop: 10}}
        />
        {/* <KeyboardAvoidingView
          behavior={"padding"}
          // keyboardVerticalOffset={60}
          style={{
            flex: 1.5,
            backgroundColor: '#fff',
            borderTopEndRadius: 100,
            borderTopStartRadius: 100,
            marginTop: 20,
            justifyContent: 'center',
          }}> */}
        <View
          style={{
            flex: 1.5,
            backgroundColor: '#fff',
            borderTopEndRadius: 100,
            borderTopStartRadius: 100,
            marginTop: 30,
            justifyContent: 'center',
          }}>
          <View
            style={{
              flex: 1,
              justifyContent: 'center',
              alignItems: 'center',
              paddingBottom: 10,
            }}>
            <CustomeProgress showprogress={loading} />
            {/* <Modal transparent={true} animationType={'none'} visible={loading}>
            <View
              style={{
                flex: 1,
                justifyContent: 'center',
                alignItems: 'center',
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.8,
                shadowRadius: 2,
                elevation: 5,
              }}>
              <View
                style={{
                  backgroundColor: '#fff',
                  height: 100,
                  width: 100,
                  borderRadius: 10,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                }}>
                <ActivityIndicator size="large" color={'#000000'} />
              </View>
            </View>
          </Modal> */}
            <View
              style={{
                backgroundColor: 'white',
                padding: 25,
                paddingBottom: showLoginForm ? 25 : 0,
                borderRadius: 25,
                width: '90%',
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.8,
                shadowRadius: 2,
                elevation: 5,
              }}>
              {showLoginForm ? (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 25,
                    borderWidth: 1,
                    borderColor: '#bbbb',
                  }}>
                  <View style={{flex: 1}}>
                    <CustomButton
                      text={'Login'}
                      onPress={() => setShowLoginForm(true)}
                    />
                  </View>
                  <View style={{flex: 1}}>
                    <SecondaryButton
                      text={'Signup'}
                      onPress={() => setShowLoginForm(false)}
                    />
                  </View>
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    borderRadius: 25,
                    borderWidth: 1,
                    borderColor: '#bbbb',
                  }}>
                  <View style={{flex: 1}}>
                    <SecondaryButton
                      text={'Login'}
                      onPress={() => setShowLoginForm(true)}
                    />
                  </View>
                  <View style={{flex: 1}}>
                    <CustomButton
                      text={'Signup'}
                      onPress={() => setShowLoginForm(false)}
                    />
                  </View>
                </View>
              )}

              {showLoginForm ? (
                <View
                  style={
                    showLoginForm
                      ? {marginHorizontal: 10, marginVertical: 20}
                      : {marginHorizontal: 10, marginVertical: 0}
                  }>
                  <View style={{margin: 10, minHeight: 100}}>
                    <CustomTextInput
                      editable
                      required={true}
                      field={{
                        label: 'Email / Mobile Number',
                        write: true,
                        value: email,
                        type: 'email',
                      }}
                      onChangeText={(text) => setEmail(text)}
                    />
                  </View>

                  <View style={{margin: 10, minHeight: 100}}>
                    <CustomTextInput
                      editable
                      required={true}
                      field={{
                        label: 'Password',
                        write: true,
                        value: password,
                        type: 'password',
                      }}
                      onChangeText={(text) => setPassword(text)}
                    />
                  </View>

                  <View>
                    <CustomButton text={'LOGIN'} onPress={() => loginUser()} />
                  </View>
                  <View style={{marginTop: 20}}>
                    <Text
                      style={{textAlign: 'center', color: themes.BORDER_COLOR}}>
                      OR
                    </Text>
                  </View>
                  <View
                    style={{
                      marginTop: 20,
                      flexDirection: 'row',
                      justifyContent: 'space-around',
                    }}>
                    <Image
                      source={googlePic}
                      style={{width: 30, height: 30, borderRadius: 25}}
                    />

                    <Image
                      source={twitterPic}
                      style={{width: 30, height: 30, borderRadius: 25}}
                    />

                    <Image
                      source={facebookPic}
                      style={{width: 30, height: 30, borderRadius: 25}}
                    />
                  </View>
                </View>
              ) : (
                <KeyboardAvoidingView
                  behavior={'height'}
                  keyboardVerticalOffset={60}>
                  <ScrollView
                    showsVerticalScrollIndicator={false}
                    style={{
                      marginHorizontal: 10,
                      marginVertical: 20,
                      maxHeight: 450,
                      paddingBottom: 0,
                      paddingVertical: 0,
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
                          label: 'Name',
                          write: true,
                          value: userName,
                        }}
                        onChangeText={(text) => setUserName(text)}
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
                        }}
                        onChangeText={(text) => setLicence(text)}
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
                      />
                    </View>

                    <View>
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
                      />
                    </View>
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
                        value={''}
                        textlabel={'Age'}
                        // style={{borderWidth: 1}}
                        // containerStyle={{marginTop: 10}}
                        disabled={false}
                        onChangeText={(date) => {
                          this.setState({
                            data: {
                              ...this.state.data,
                              stopOfTurbine: date,
                            },
                          });
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
                        onChangeText={(text) => setContactPerson(text)}
                      />
                    </View>
                    <View>
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
                    </View>
                    <View>
                      <CustomTextInput
                        editable
                        required={true}
                        field={{
                          label: 'Description',
                          write: true,
                          value: description,
                        }}
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
                            type: 'number',
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
                          }}
                          onChangeText={(text) => setCountry(text)}
                        />
                        <TouchableOpacity
                          onPress={() => setShowModal(true)}
                          style={{flexDirection: 'row'}}>
                          <Image
                            source={MapImg}
                            style={{width: 25, height: 25}}
                          />
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
                          }}
                          onChangeText={(text) => setMonday(text)}
                        />
                        <CustomTextInput
                          editable
                          required={true}
                          field={{
                            label: 'Tuesday',
                            write: true,
                            value: tuesday,
                          }}
                          onChangeText={(text) => setTuesday(text)}
                        />
                        <CustomTextInput
                          editable
                          required={true}
                          field={{
                            label: 'Wednesday',
                            write: true,
                            value: wednesday,
                          }}
                          onChangeText={(text) => setWednesday(text)}
                        />
                        <CustomTextInput
                          editable
                          required={true}
                          field={{
                            label: 'Thrusday',
                            write: true,
                            value: thrusday,
                          }}
                          onChangeText={(text) => setThrusday(text)}
                        />
                        <CustomTextInput
                          editable
                          required={true}
                          field={{
                            label: 'Friday',
                            write: true,
                            value: friday,
                          }}
                          onChangeText={(text) => setFriday(text)}
                        />
                        <CustomTextInput
                          editable
                          required={true}
                          field={{
                            label: 'Saturday',
                            write: true,
                            value: saturday,
                          }}
                          onChangeText={(text) => setSaturday(text)}
                        />
                        <CustomTextInput
                          editable
                          required={true}
                          field={{
                            label: 'Sunday',
                            write: true,
                            value: sunday,
                          }}
                          onChangeText={(text) => setSunday(text)}
                        />
                      </ExpandeablePanel>
                    </View>
                    <View>
                      <CustomButton
                        text={'SIGNUP'}
                        onPress={() => signUpNewUser()}
                      />
                    </View>
                  </ScrollView>
                </KeyboardAvoidingView>
              )}
            </View>
          </View>
        </View>
        {renderMap()}
        {/* </KeyboardAvoidingView> */}
      </LinearGradient>
    </View>
  );
};
export default Login;
