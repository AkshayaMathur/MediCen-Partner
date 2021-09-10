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
import {Auth} from 'aws-amplify';

const SIZE = Dimensions.get('window');
const WIDTH = SIZE.width;
const HEIGHT = SIZE.HEIGHT;

const ForgotPassword = ({navigation}) => {
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmNewPassword, setConfirmNewPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [codeSent, setCodeSent] = React.useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
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
  const ForgotPassword = () => {
    // if (!validateEmailId(userEmail) || userEmail === '') {
    //   MedToast.show('Please Enter a Valid Email ID');
    //   return;
    // }
    setLoading(true);
    Auth.forgotPassword(userEmail)
      .then((data) => {
        setCodeSent(true);
        console.log(data);
        MedToast.show('Verification Code Sent');
        setLoading(false);
      })
      .catch((err) => {
        MedToast.show(err.message);
        console.log(err);
        setLoading(false);
      });
  };
  const validatePassword = (inp) => {
    let letters = /^[a-zA-Z0-9.!#@$%&'*+/=?^_`{|}~-]{6,15}$/;
    if (inp.match(letters)) {
      return true;
    }
    return false;
  };
  const confirmPassword = () => {
    if (newPassword !== confirmNewPassword) {
      MedToast.show('Password Do Not Match');
      return;
    }
    if (!validatePassword(newPassword)) {
      MedToast.show('Please Enter a Valid Password');
      return;
    }
    setLoading(true);
    Auth.forgotPasswordSubmit(userEmail, verificationCode, newPassword)
      .then((data) => {
        console.log('DATAIS: ');
        console.log(data);
        setLoading(false);
        MedToast.show('Password Re-Set Successfully');
        navigation.goBack();
      })
      .catch((err) => {
        setLoading(false);
        MedToast.show(err.message);
        console.log(err);
      });
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
            <View
              style={{
                backgroundColor: 'white',
                padding: 25,
                paddingBottom: 0,
                borderRadius: 25,
                width: '90%',
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.8,
                shadowRadius: 2,
                elevation: 5,
              }}>
              <KeyboardAvoidingView behavior={'height'}>
                <ScrollView
                  showsVerticalScrollIndicator={false}
                  style={{
                    marginHorizontal: 10,
                    // marginVertical: 20,
                    marginBottom: 20,
                    maxHeight: 450,
                    paddingBottom: 0,
                    paddingVertical: 0,
                  }}>
                  <View>
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
                  {codeSent ? (
                    <TouchableOpacity
                      style={{marginBottom: 20}}
                      onPress={() => ForgotPassword()}>
                      <Text
                        style={{
                          textAlign: 'right',
                          color: '#BBB',
                          fontWeight: 'bold',
                        }}>
                        *Resend Verification Code
                      </Text>
                    </TouchableOpacity>
                  ) : (
                    <View>
                      <CustomButton
                        text={'Send Verification Code'}
                        // onPress={() => signUpNewUser()}
                        onPress={() => ForgotPassword()}
                      />
                    </View>
                  )}

                  {codeSent ? (
                    <View>
                      <View style={{}}>
                        <CustomTextInput
                          editable
                          required={true}
                          field={{
                            label: 'Verification Code',
                            write: true,
                            value: verificationCode,
                          }}
                          onChangeText={(text) => setVerificationCode(text)}
                        />
                      </View>
                      <View style={{}}>
                        <CustomTextInput
                          editable
                          required={true}
                          field={{
                            label: 'Password',
                            write: true,
                            value: newPassword,
                            type: 'password',
                          }}
                          onChangeText={(text) => setNewPassword(text)}
                        />
                      </View>
                      <View style={{}}>
                        <CustomTextInput
                          editable
                          required={true}
                          field={{
                            label: 'Confrim Password',
                            write: true,
                            value: confirmNewPassword,
                            type: 'password',
                          }}
                          onChangeText={(text) => setConfirmNewPassword(text)}
                        />
                      </View>

                      <View>
                        <CustomButton
                          text={'Change Password'}
                          // onPress={() => signUpNewUser()}
                          onPress={() => confirmPassword()}
                        />
                      </View>
                    </View>
                  ) : null}
                  <View
                    style={{marginVertical: 10, flexDirection: 'row-reverse'}}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                      <Text
                        style={{
                          textAlign: 'right',
                          color: '#BBB',
                        }}>
                        Login / Signup
                      </Text>
                    </TouchableOpacity>
                  </View>
                </ScrollView>
              </KeyboardAvoidingView>
            </View>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
};

export default ForgotPassword;
