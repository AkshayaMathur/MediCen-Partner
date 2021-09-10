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
import logo from '../assets/appLogo_white.png';
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
import {Auth} from 'aws-amplify';
import {TimePicker} from 'react-native-simple-time-picker';
import CustomTimePicker from '../components/CustomTimePicker';
const SIZE = Dimensions.get('window');
const WIDTH = SIZE.width;
const HEIGHT = SIZE.HEIGHT;
const Login = ({navigation}) => {
  const [showLoginForm, setShowLoginForm] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [finalUsername, setFinalUsername] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [userEmailValidation, setUserEmailValidation] = useState('');
  const [userName, setUserName] = useState('');
  const [userNameValidation, setUserNameValidation] = useState('');
  const [userPassword, setUserPassword] = useState('');
  const [userPasswordValidation, setUserPasswordValidation] = useState('');
  const [reUserPassword, setReUserPassword] = useState('');
  const [reUserPasswordValidation, setReUserPasswordValidation] = useState('');
  const [userMobile, setUserMobile] = useState('');
  const [userMobileValidation, setUserMobileValidation] = useState('');
  const [landline, setLandline] = useState('');
  const [landlineValidation, setLandlineValidation] = useState('');
  const [licence, setLicence] = useState('');
  const [licenceValidation, setLicenceValidation] = useState('');
  const [type, setType] = useState('pharmacy');
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
  const [pincodeValidation, setPincodeValidation] = useState('');
  const [lat, setLan] = useState(12.9915028293388);
  const [lon, setLon] = useState(77.72336724947571);
  const [latDelta, setLanDelta] = useState(0.03);
  const [lonDelta, setLonDelta] = useState(0.03);

  const [monday, setMonday] = useState({
    opening: {hours: 0, minutes: 0},
    closing: {hours: 0, minutes: 0},
    open24Hours: false,
  });
  const [tuesday, setTuesday] = useState({
    opening: {hours: 0, minutes: 0},
    closing: {hours: 0, minutes: 0},
    open24Hours: false,
  });
  const [wednesday, setWednesday] = useState({
    opening: {hours: 0, minutes: 0},
    closing: {hours: 0, minutes: 0},
    open24Hours: false,
  });
  const [thrusday, setThrusday] = useState({
    opening: {hours: 0, minutes: 0},
    closing: {hours: 0, minutes: 0},
    open24Hours: false,
  });
  const [friday, setFriday] = useState({
    opening: {hours: 0, minutes: 0},
    closing: {hours: 0, minutes: 0},
    open24Hours: false,
  });
  const [saturday, setSaturday] = useState({
    opening: {hours: 0, minutes: 0},
    closing: {hours: 0, minutes: 0},
    open24Hours: false,
  });
  const [sunday, setSunday] = useState({
    opening: {hours: 0, minutes: 0},
    closing: {hours: 0, minutes: 0},
    open24Hours: false,
  });
  const [referenceCode, setReferenceCode] = useState('');
  const [
    verifyConfirmationCodeVisiblity,
    setVerifyConfirmationCodeVisiblity,
  ] = useState(false);
  const [verifyConfirmationCode, setVerifyConfirmationCode] = useState(false);
  const [signUpRes, setSignUpRes] = useState(null);
  const {signIn} = React.useContext(AuthContext);
  const login = (foundUser) => {
    signIn(foundUser);
  };
  const loginUser = (invalidVerification) => {
    console.log('Email is: ', email);
    console.log('password is: ', password);
    // if (!validateEmailId(email)) {
    //   MedToast.show('Enter A Valid Email ID');
    //   return;
    // }
    if (/^\d+$/.test(email) && !validateMobileNumber(email)) {
      MedToast.show('Enter A Valid Mobile Number');
      return;
    } else if (!/^\d+$/.test(email) && !validateEmailId(email)) {
      MedToast.show('Enter A Valid Email ID');
      return;
    }
    setLoading(true);
    axios
      .post(
        'https://7d5simyvz0.execute-api.us-east-1.amazonaws.com/V1/checkpartner',
        {
          emailId: email.toLowerCase(),
          password: password,
        },
      )
      .then(function (response) {
        console.log(response.data);
        if (response.data.statusCode === 200) {
          if (!invalidVerification) {
            login(response.data.body);
          }

          setSignUpRes(response.data.body);
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
  async function signInAuth() {
    try {
      console.log('Email is: ', email);
      console.log('password is: ', password);
      if (/^\d+$/.test(email) && !validateMobileNumber(email)) {
        MedToast.show('Enter A Valid Mobile Number');
        return;
      } else if (!/^\d+$/.test(email) && !validateEmailId(email)) {
        MedToast.show('Enter A Valid Email ID');
        return;
      }
      setLoading(true);
      await Auth.signIn(email, password)
        .then((res) => {
          console.log(res);
          loginUser();
        })
        .catch((err) => {
          setLoading(false);
          console.log('Error Occurred', err);
          if (err.code === 'UserNotConfirmedException') {
            loginUser(true);
            setFinalUsername(email);
            setUserEmail(email);
            resendConfirmationCode(email);
            setVerifyConfirmationCodeVisiblity(true);
          }
          MedToast.show(err.message);
        });
    } catch (error) {
      setLoading(false);
      console.log('error signing in', error);
    }
  }

  async function confirmSignUp() {
    try {
      let valid = true;
      if (reUserPassword !== userPassword) {
        MedToast.show('Password Do Not Match');
        valid = false;
        // return;
      }
      if (!validateText(userName) || userName === '') {
        MedToast.show('Enter A Valid Name');
        setUserNameValidation('Please enter a valid name');
        valid = false;
        // return;
      }
      // if (!validateLicence(licence) || licence === '') {
      //   setLicenceValidation(
      //     'Please Enter a Valid Licence Number\n•Should Have 1-2 Hyphen(-)\n•Length should Be 10 Digits',
      //   );
      //   MedToast.show('Please Enter a Valid Licence Number');
      //   valid = false;
      //   // return;
      // }
      // if (!validateMobileNumber(landline) || landline === '') {
      //   MedToast.show('Please Enter a Valid Landline Number');
      //   setLandlineValidation('Please Enter a Valid Landline Number');
      //   valid = false;
      //   // return;
      // }
      if (!validatePassword(userPassword) || userPassword === '') {
        MedToast.show('Please Enter a Valid Password');
        setUserPasswordValidation(
          'Password should have minimum length of 6 character and maximum length of 15 character',
        );
        valid = false;
        // return;
      }
      if (
        line1 === '' ||
        line2 === '' ||
        line3 === '' ||
        city === '' ||
        state === '' ||
        country === ''
      ) {
        MedToast.show('Please a valid address');
        valid = false;
        //  return;
      }
      if (!valid) {
        return;
      }
      let finalUserName = '';
      if (userEmail !== '') {
        if (!validateEmailId(userEmail)) {
          MedToast.show('Please Enter a Valid Email ID');
          return;
        }
        finalUserName = userEmail.toString().toLowerCase();
      } else {
        // if (userEmail === '') {
        //   MedToast.show('Please Enter a Valid Email ID');
        //   return;
        // }
        if (userMobile === '') {
          Alert.alert('Please Enter Either Email ID or Phone Number');
          return;
        }
        if (!validateMobileNumber(userMobile)) {
          MedToast.show('Please Enter a Valid Mobile Number');
          return;
        }
        finalUserName = `${userMobile}`;
      }
      console.log('Final Username is: ', finalUserName);
      setFinalUsername(finalUserName);
      setLoading(true);
      const {user} = await Auth.signUp({
        name: `${userName}`,
        username: finalUserName,
        email: userEmail !== '' ? userEmail.toString().toLowerCase() : null,
        phone_number: userMobile !== '' ? `+91${userMobile}` : null,
        password: userPassword,
        attributes: {
          email: userEmail !== '' ? userEmail.toString().toLowerCase() : null,
          phone_number: userMobile !== '' ? `+91${userMobile}` : null,
        },
      });
      console.log('User is: ', user);
      signUpNewUser(finalUserName);
    } catch (error) {
      setLoading(false);
      console.log('error confirming sign up', error);
      MedToast.show('An Error Occurred while Signup: ' + error.message);
    }
  }
  const signUpNewUser = (usernameUsed) => {
    let valid = true;
    if (reUserPassword !== userPassword) {
      MedToast.show('Password Do Not Match');
      valid = false;
      // return;
    }
    if (!validateText(userName) || userName === '') {
      MedToast.show('Enter A Valid Name');
      setUserNameValidation('Please enter a valid name');
      valid = false;
      // return;
    }
    // if (!validateEmailId(userEmail) || userEmail === '') {
    //   MedToast.show('Please Enter a Valid Email ID');
    //   setUserEmailValidation('Please Enter a Valid Email ID');
    //   valid = false;
    //   // return;
    // }
    // if (!validateLicence(licence) || licence === '') {
    //   setLicenceValidation(
    //     'Please Enter a Valid Licence Number\n•Should Have 1-2 Hyphen(-)\n•Length should Be 10 Digits',
    //   );
    //   MedToast.show('Please Enter a Valid Licence Number');
    //   valid = false;
    //   // return;
    // }
    // if (!validateMobileNumber(userMobile) || userMobile === '') {
    //   MedToast.show('Please Enter a Valid Mobile Number');
    //   setUserMobileValidation('Please Enter a Valid Mobile Number');
    //   valid = false;
    //   // return;
    // }
    // if (!validateMobileNumber(landline) || landline === '') {
    //   MedToast.show('Please Enter a Valid Landline Number');
    //   setLandlineValidation('Please Enter a Valid Landline Number');
    //   valid = false;
    //   // return;
    // }
    if (!validatePassword(userPassword) || userPassword === '') {
      MedToast.show('Please Enter a Valid Password');
      setUserPasswordValidation(
        'Password should have minimum length of 6 character and maximum length of 15 character',
      );
      valid = false;
      // return;
    }
    if (
      line1 === '' ||
      line2 === '' ||
      line3 === '' ||
      city === '' ||
      state === '' ||
      country === ''
    ) {
      MedToast.show('Please a valid address');
      valid = false;
      //  return;
    }
    if (!valid) {
      return;
    }
    let mondayStr = `Monday: ${monday.opening.hours}:${monday.opening.minutes} to ${monday.closing.hours}:${monday.closing.minutes}`;
    let tuesdayStr = `Tuesday: ${tuesday.opening.hours}:${tuesday.opening.minutes} to ${tuesday.closing.hours}:${tuesday.closing.minutes}`;
    let wednesdayStr = `Wednesday: ${wednesday.opening.hours}:${wednesday.opening.minutes} to ${wednesday.closing.hours}:${wednesday.closing.minutes}`;
    let thrusdayStr = `Thursday: ${thrusday.opening.hours}:${thrusday.opening.minutes} to ${thrusday.closing.hours}:${thrusday.closing.minutes}`;
    let fridayStr = `Friday: ${friday.opening.hours}:${friday.opening.minutes} to ${friday.closing.hours}:${friday.closing.minutes}`;
    let saturdayStr = `Saturday: ${saturday.opening.hours}:${saturday.opening.minutes} to ${saturday.closing.hours}:${saturday.closing.minutes}`;
    let sundayStr = `Sunday: ${sunday.opening.hours}:${sunday.opening.minutes} to ${sunday.closing.hours}:${sunday.closing.minutes}`;

    setLoading(true);
    console.log('ABCDEF');
    let obj = {
      username: usernameUsed,
      name: userName,
      emailId: userEmail.toLowerCase(),
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
        monday: mondayStr,
        tuesday: tuesdayStr,
        wednesday: wednesdayStr,
        thrusday: thrusdayStr,
        friday: fridayStr,
        saturday: saturdayStr,
        sunday: sundayStr,
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
          setSignUpRes(res.data.body);
          setLoading(false);
          setVerifyConfirmationCodeVisiblity(true);
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
  const verifyCode = async () => {
    try {
      await Auth.confirmSignUp(finalUsername, verifyConfirmationCode)
        .then((res) => {
          console.log('Res is: ', res);
          login(signUpRes);
        })
        .catch((err) => {
          console.log(err);
          MedToast.show(err.message);
        });
    } catch (error) {
      console.log('error confirming sign up', error);
    }
  };
  async function resendConfirmationCode(input) {
    try {
      let userMail = finalUsername;
      if (input) {
        userMail = input;
      }
      Auth.resendSignUp(userMail).then((res) => {
        console.log('resendConfirmationCode res is', res);
        MedToast.show('Verification Code Sent Successfully');
      });
      console.log('code resent successfully');
    } catch (err) {
      console.log('error resending code: ', err);
    }
  }
  const validateText = (inp) => {
    if (!inp) {
      return false;
    }
    if (inp === '') {
      return false;
    }
    let letters = /^[a-zA-Z. ]*$/;
    if (inp.match(letters)) {
      return true;
    }
    return false;
  };
  const validateEmailId = (inp) => {
    if (!inp) {
      return false;
    }
    if (inp === '') {
      return false;
    }
    let letters = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (inp.match(letters)) {
      return true;
    }
    return false;
  };
  const validateMobileNumber = (inp) => {
    if (!inp) {
      return false;
    }
    if (inp === '') {
      return false;
    }
    let letters = /^[0-9]{10}$/;
    if (inp.match(letters)) {
      return true;
    }
    return false;
  };
  // const validateLicences = (inp) => {
  //   if (!inp) {
  //     return false;
  //   }
  //   if (inp === '') {
  //     return false;
  //   }
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
    if (!inp) {
      return false;
    }
    if (inp === '') {
      return false;
    }
    let letters = /^[a-zA-Z0-9.!#@$%&'*+/=?^_`{|}~-]{6,15}$/;
    if (inp.match(letters)) {
      return true;
    }
    return false;
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
    if (!val) {
      return false;
    }
    if (val === '') {
      return false;
    }
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
  const renderVerifyCode = () => {
    return (
      <Modal transparent={true} visible={verifyConfirmationCodeVisiblity}>
        <View style={{flex: 1, backgroundColor: '#fff'}}>
          <View
            style={{
              flex: 1,
              marginHorizontal: 10,
              backgroundColor: '#fff',
              marginVertical: 10,
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: themes.TEXT_BLUE_COLOR,
                paddingHorizontal: 10,
                fontSize: themes.FONT_SIZE_LARGE,
                fontWeight: 'bold',
              }}>
              Verification
            </Text>
            <View
              style={{
                marginTop: 10,
                height: 3,
                backgroundColor: themes.CONTENT_GREEN_BACKGROUND,
              }}
            />
            <View
              style={{
                flex: 1,
                marginTop: 20,
                // justifyContent: 'center',
              }}>
              <Text
                style={{
                  fontWeight: 'bold',
                  fontSize: themes.FONT_SIZE_MEDIUM,
                  textAlign: 'center',
                }}>
                Please Enter The Verification Code Sent On Your Email
              </Text>
              <View style={{margin: 10, minHeight: 75, marginBottom: 0}}>
                <CustomTextInput
                  editable
                  required={true}
                  field={{
                    label: 'Verification Code',
                    write: true,
                    value: verifyConfirmationCode,
                  }}
                  onChangeText={(text) => {
                    setVerifyConfirmationCode(text);
                  }}
                />
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  marginHorizontal: 10,
                  marginVertical: 25,
                }}>
                <View style={{flex: 1, flexDirection: 'row-reverse'}}>
                  <TouchableOpacity onPress={() => resendConfirmationCode()}>
                    <Text
                      style={{
                        fontWeight: 'bold',
                        color: 'grey',
                        textDecorationLine: 'underline',
                        fontSize: themes.FONT_SIZE_MEDIUM,
                      }}>
                      Resend Code
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
              <CustomButton text={'Verify'} onPress={() => verifyCode()} />
            </View>
          </View>
        </View>
      </Modal>
    );
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
        // colors={['#EEFAEC', '#EEFAEC', '#EEFAEC']}
        style={{flex: 1}}>
        <Image
          source={logo}
          resizeMode="contain"
          style={{width: '100%', height: 100, marginTop: 10}}
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
            borderWidth: 1,
            borderColor: '#54ca98',
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
                      onChangeText={(text) => setEmail(text.toLowerCase())}
                      onSubmitEditing={() => {
                        if (!validateEmailId(email)) {
                          MedToast.show('Please Enter a Valid Email ID');
                        }
                      }}
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
                    <CustomButton text={'LOGIN'} onPress={() => signInAuth()} />
                  </View>
                  <View style={{marginTop: 20}}>
                    <View style={{flexDirection: 'row-reverse'}}>
                      <TouchableOpacity
                        onPress={() => {
                          navigation.navigate('ForgotPassword');
                        }}>
                        <Text
                          style={{
                            textAlign: 'center',
                            color: '#BBB',
                            fontWeight: 'bold',
                            fontSize: themes.FONT_SIZE_MEDIUM,
                          }}>
                          Forgot Password
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                  {/* <View style={{marginTop: 20}}>
                    <Text
                      style={{textAlign: 'center', color: themes.BORDER_COLOR}}>
                      OR
                    </Text>
                  </View> */}
                  {/* <View
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
                  </View> */}
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
                        I'm a *
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          // justifyContent: 'space-around',
                        }}>
                        {/* <TouchableOpacity
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
                        </TouchableOpacity> */}
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
                    <View style={{marginTop: 10}}>
                      <CustomTextInput
                        editable
                        required={true}
                        field={{
                          label:
                            type !== 'doctor' ? 'Pharmacy Name *' : 'Name *',
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
                          label: 'Email *',
                          write: true,
                          value: userEmail,
                          type: 'email',
                        }}
                        onChangeText={(text) => setUserEmail(text)}
                        onSubmitEditing={() => {
                          if (!validateEmailId(userEmail)) {
                            setUserEmailValidation(
                              'Please Enter a Valid Email ID',
                            );
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
                          label: 'Licence *',
                          write: true,
                          value: licence,
                          type: 'licence',
                        }}
                        onChangeText={(text) => setLicence(text)}
                        // onSubmitEditing={() => {
                        //   if (!validateLicence(licence)) {
                        //     MedToast.show(
                        //       'Please Enter a Valid Licence Number',
                        //     );
                        //     setLicenceValidation(
                        //       'Please Enter a Valid Licence Number\n•Should Have 1-2 Hyphen(-)\n•Length should Be 10 Digits',
                        //     );
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
                          label: 'Mobile Number *',
                          write: true,
                          value: userMobile,
                          type: 'number',
                        }}
                        onChangeText={(text) => setUserMobile(text)}
                        onSubmitEditing={() => {
                          if (!validateMobileNumber(userMobile)) {
                            MedToast.show('Please Enter a Valid Mobile Number');
                            setUserMobileValidation(
                              'Please Enter a Valid Mobile Number',
                            );
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
                          label: 'Landline Number (With STD Code)',
                          write: true,
                          value: landline,
                          type: 'number',
                        }}
                        onChangeText={(text) => setLandline(text)}
                        // onSubmitEditing={() => {
                        //   if (!validateMobileNumber(landline)) {
                        //     MedToast.show(
                        //       'Please Enter a Valid Landline Number',
                        //     );
                        //     setLandlineValidation(
                        //       'Please Enter a Valid Landline Number',
                        //     );
                        //   } else {
                        //     setLandlineValidation('');
                        //   }
                        // }}
                        // errorMessage={landlineValidation}
                      />
                    </View>

                    <View>
                      <CustomTextInput
                        editable
                        required={true}
                        field={{
                          label: 'Password *',
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
                    </View>
                    <View>
                      <CustomTextInput
                        editable
                        required={true}
                        field={{
                          label: 'Confirm Password *',
                          write: true,
                          value: reUserPassword,
                          type: 'password',
                        }}
                        onChangeText={(text) => {
                          setReUserPassword(text);
                          if (reUserPassword !== userPassword) {
                            setReUserPasswordValidation(
                              'Password Do Not Match',
                            );
                          } else {
                            setReUserPasswordValidation('');
                          }
                        }}
                        onSubmitEditing={() => {
                          if (!validatePassword(userPassword)) {
                            MedToast.show('Please Enter a Valid Password');
                            setReUserPasswordValidation(
                              'Password should have minimum length of 6 character and maximum length of 15 character',
                            );
                          } else {
                            setReUserPasswordValidation('');
                          }
                        }}
                        errorMessage={reUserPasswordValidation}
                      />
                    </View>
                    <View>
                      <Text
                        style={{
                          fontWeight: 'bold',
                          color: 'grey',
                          fontSize: themes.FONT_SIZE_MEDIUM,
                        }}>
                        Gender *
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
                    {/* <View style={{marginBottom: 10}}>
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
                      />
                      <SiNewDate
                        value={age}
                        textlabel={
                          type === 'doctor' ? 'Date Of Birth' : 'Opening Date'
                        }
                        // style={{borderWidth: 1}}
                        // containerStyle={{marginTop: 10}}
                        disabled={false}
                        onChangeText={(date) => {
                          console.log('Calledddddddddddddddd', date);
                          setAge(date);
                        }}
                      />
                    </View> */}
                    <View>
                      <CustomTextInput
                        editable
                        required={true}
                        field={{
                          label: 'Contact Person Name *',
                          write: true,
                          value: contactPerson,
                        }}
                        onChangeText={(text) => {
                          if (validateText(text)) {
                            setContactPerson(text);
                            setContactPersonValidation('');
                          } else {
                            MedToast.show(
                              'Please enter valid contact person name',
                            );
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
                      <ExpandeablePanel title="Address *">
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
                        {/* <CustomTextInput
                          editable
                          required={true}
                          field={{
                            label: 'Monday',
                            write: true,
                            value: monday,
                            type: 'time',
                          }}
                          onChangeText={(text) => setMonday(text)}
                        /> */}
                        <CustomTimePicker
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
                        />
                        {/* <CustomTextInput
                          editable
                          required={true}
                          field={{
                            label: 'Tuesday',
                            write: true,
                            value: tuesday,
                            type: 'time',
                          }}
                          onChangeText={(text) => setTuesday(text)}
                        /> */}
                        <CustomTimePicker
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
                        />
                        {/* <CustomTextInput
                          editable
                          required={true}
                          field={{
                            label: 'Wednesday',
                            write: true,
                            value: wednesday,
                            type: 'time',
                          }}
                          onChangeText={(text) => setWednesday(text)}
                        /> */}
                        <CustomTimePicker
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
                        />
                        {/* <CustomTextInput
                          editable
                          required={true}
                          field={{
                            label: 'Thrusday',
                            write: true,
                            value: thrusday,
                            type: 'time',
                          }}
                          onChangeText={(text) => setThrusday(text)}
                        /> */}
                        <CustomTimePicker
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
                        />
                        {/* <CustomTextInput
                          editable
                          required={true}
                          field={{
                            label: 'Friday',
                            write: true,
                            value: friday,
                            type: 'time',
                          }}
                          onChangeText={(text) => setFriday(text)}
                        /> */}
                        <CustomTimePicker
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
                        />
                        {/* <CustomTextInput
                          editable
                          required={true}
                          field={{
                            label: 'Saturday',
                            write: true,
                            value: saturday,
                            type: 'time',
                          }}
                          onChangeText={(text) => setSaturday(text)}
                        /> */}
                        <CustomTimePicker
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
                        />
                        {/* <CustomTextInput
                          editable
                          required={true}
                          field={{
                            label: 'Sunday',
                            write: true,
                            value: sunday,
                            type: 'time',
                          }}
                          onChangeText={(text) => setSunday(text)}
                        /> */}
                        <CustomTimePicker
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
                        />
                      </ExpandeablePanel>
                    </View>
                    <View>
                      <CustomButton
                        text={'SIGNUP'}
                        onPress={() => confirmSignUp()}
                      />
                    </View>
                  </ScrollView>
                </KeyboardAvoidingView>
              )}
            </View>
          </View>
        </View>
        {renderMap()}
        {renderVerifyCode()}
        {/* </KeyboardAvoidingView> */}
      </LinearGradient>
    </View>
  );
};
export default Login;
