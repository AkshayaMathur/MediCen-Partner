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
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {AuthContext} from '../components/context';
import CustomButton from '../components/CustomButton';
import ProfilePic from '../assets/profile.png';
import themes from '../themes';
import AppBar from '../components/AppBar';
import MaterialIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/FontAwesome5';
import CustomeProgress from '../components/CustomProgress';
import {getUserDetails} from '../utils/userprofile';
const SIZE = Dimensions.get('window');
const WIDTH = SIZE.width;
const HEIGHT = SIZE.HEIGHT;
const ProfileScreen = ({navigation}) => {
  const [loading, setLoading] = useState(true);
  const [userDetails, setUserDetails] = useState({});
  const {signOut} = React.useContext(AuthContext);
  const loginout = () => {
    signOut({
      email: 'user2@email.com',
      username: 'user2',
      password: 'pass1234',
      userToken: 'token12345',
    });
  };
  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
    getUserDetail();
  });

  const getUserDetail = async () => {
    let userDetails = await getUserDetails();
    if (userDetails) {
      userDetails = JSON.parse(userDetails);
      setUserDetails(userDetails);
    }
    setLoading(false);
  };
  return (
    <View style={{flex: 1}}>
      <AppBar />
      <CustomeProgress showprogress={loading} />
      <View style={{flex: 1, paddingVertical: 10, paddingHorizontal: 10}}>
        {loading ? null : (
          <View
            style={{
              shadowColor: '#0000',
              shadowOffset: {height: 10, width: 10},
              elevation: 10,
              backgroundColor: '#fff',
              padding: 5,
            }}>
            <View style={{flexDirection: 'row', paddingVertical: 10}}>
              <Image
                source={ProfilePic}
                style={{
                  width: 50,
                  height: 50,
                  justifyContent: 'center',
                  alignSelf: 'center',
                }}
              />
              <View
                style={{
                  flex: 1,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Text
                  style={{
                    textAlign: 'center',
                    fontWeight: 'bold',
                    fontSize: themes.FONT_SIZE_LARGE,
                    color: themes.TEXT_BLUE_COLOR,
                  }}>
                  {userDetails.name}
                </Text>

                <Text
                  style={{
                    textAlign: 'center',
                    // fontWeight: 'bold',
                    // fontSize: themes.FONT_SIZE_LARGE,
                    color: themes.TEXT_BLUE_COLOR,
                  }}>
                  {userDetails.mobileNumber}
                </Text>
                <Text
                  style={{
                    textAlign: 'center',
                    // fontWeight: 'bold',
                    // fontSize: themes.FONT_SIZE_LARGE,
                    color: themes.TEXT_BLUE_COLOR,
                  }}>
                  {userDetails.emailId}
                </Text>
              </View>
            </View>
            <View style={{paddingVertical: 10}}>
              <Text
                style={{
                  fontSize: themes.FONT_SIZE_NORMAL,
                  color: themes.TEXT_BLUE_COLOR,
                }}>
                Contact Person:{' '}
                <Text style={{color: 'black'}}>
                  {userDetails.contactPerson}
                </Text>
              </Text>
              <Text
                style={{
                  fontSize: themes.FONT_SIZE_NORMAL,
                  color: themes.TEXT_BLUE_COLOR,
                }}>
                Description:{' '}
                <Text style={{color: 'black'}}>{userDetails.description}</Text>
              </Text>
              <Text
                style={{
                  fontSize: themes.FONT_SIZE_NORMAL,
                  color: themes.TEXT_BLUE_COLOR,
                }}>
                Speciality:{' '}
                <Text style={{color: 'black'}}>{userDetails.speciality}</Text>
              </Text>
            </View>
            <View
              style={{
                height: 3,
                backgroundColor: themes.CONTENT_GREEN_BACKGROUND,
              }}
            />
            <TouchableOpacity
              onPress={() => navigation.navigate('EditAccount')}
              style={{
                paddingVertical: 10,
                paddingHorizontal: 10,
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <Text
                style={{
                  // textAlign: 'center',
                  fontWeight: 'bold',
                  fontSize: themes.FONT_SIZE_LARGE,
                  color: themes.TEXT_BLUE_COLOR,
                }}>
                My Account
              </Text>
              <View style={{flex: 1, flexDirection: 'row-reverse'}}>
                <MaterialIcon
                  name="greater-than"
                  size={20}
                  color={themes.TEXT_BLUE_COLOR}
                />
              </View>
            </TouchableOpacity>
            <View
              style={{
                height: 3,
                backgroundColor: themes.CONTENT_GREEN_BACKGROUND,
              }}
            />
          </View>
        )}
        <View style={{flex: 1, flexDirection: 'column-reverse'}}>
          <View style={{paddingVertical: 25, paddingHorizontal: 25}}>
            <CustomButton text="LOGOUT" onPress={loginout} />
          </View>
        </View>
      </View>
    </View>
  );
};
export default ProfileScreen;
