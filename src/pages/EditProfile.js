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
import CustomTextInput from '../components/CustomTextInput';
import {getUserDetails, setUserDetails} from '../utils/userprofile';
import ExpandeablePanel from '../components/ExpandeablePanel';
import LocationApi from '../utils/locationAPI';
import MedToast from '../components/MedToast';
import MapImg from '../assets/map.png';
import Icon from 'react-native-vector-icons/Ionicons';
import MapView, {Marker} from 'react-native-maps';
import CustomButton from '../components/CustomButton';
import Device_Api from '../utils/api';
const EditProfile = ({navigation}) => {
  const [loading, setLoading] = useState(true);
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
  const [Id, setId] = useState('');
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
  const checkIfOnlyNum = (val) => {
    return /^\d+$/.test(val.trim());
  };
  const getLocationDetailsFromPincode = (pincodeInp) => {
    LocationApi.getLocationFromPincode(pincodeInp)
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
        <View style={styles.modalBackgroundColor}>
          <TouchableOpacity onPress={() => setShowModal(false)}>
            <Icon name="close" size={30} />
          </TouchableOpacity>
        </View>
        <View style={styles.modalContainer}>
          <MapView
            region={{
              latitude: lat,
              longitude: lon,
              latitudeDelta: 0.03,
              longitudeDelta: 0.03,
            }}
            // onRegionChangeComplete={this.handleRegionChange}
            style={styles.mapviewContainer}>
            <Marker.Animated
              draggable={true}
              coordinate={{latitude: lat, longitude: lon}}
              onDragEnd={(e) => {
                console.log('dragEnd', e.nativeEvent.coordinate);
                setLan(e.nativeEvent.coordinate.latitude);
                setLon(e.nativeEvent.coordinate.longitude);
              }}
            />
          </MapView>
        </View>
      </Modal>
    );
  };

  const updateUser = () => {
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
        <ScrollView showsVerticalScrollIndicator={false} style={styles.content}>
          <View>
            <Text style={styles.label}>I'm a</Text>
            <View style={styles.choiceContainer}>
              <TouchableOpacity
                onPress={() => setType('doctor')}
                style={dynamicStyle(type === 'doctor').firstContainer}>
                <Image
                  source={DoctorMaleImage}
                  style={styles.choiceImage}
                  resizeMode="contain"
                />
                <Text style={dynamicStyle(type === 'doctor').firstlabel}>
                  Doctor
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setType('pharmacy')}
                style={dynamicStyle1(type !== 'doctor').firstContainer}>
                <Image
                  source={PharmacyImg}
                  style={styles.choiceImage}
                  resizeMode="contain"
                />
                <Text style={dynamicStyle1(type !== 'doctor').firstlabel}>
                  Pharmacy
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
            <Text style={styles.label}>Gender</Text>
            <View style={styles.choiceContainer}>
              <TouchableOpacity
                onPress={() => setGender('male')}
                style={dynamicStyle1(gender === 'male').firstContainer}>
                <Image
                  source={DoctorMaleImage}
                  style={styles.choiceImage}
                  resizeMode="contain"
                />
                <Text style={dynamicStyle1(gender === 'male').firstlabel}>
                  Male
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setGender('female')}
                style={dynamicStyle1(gender !== 'male').firstContainer}>
                <Image
                  source={DoctorFemaleImage}
                  style={styles.choiceImage}
                  resizeMode="contain"
                />
                <Text style={dynamicStyle1(gender !== 'male').firstlabel}>
                  Female
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          <View>
            <CustomTextInput
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
          <View style={styles.expandeablePanelContainer}>
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
                style={styles.mapContainer}>
                <Image source={MapImg} style={styles.mapImage} />
                <Text style={styles.mapLabel}>
                  {'  Mark Extact Location On Map'}
                </Text>
              </TouchableOpacity>
            </ExpandeablePanel>
          </View>
          <View style={styles.expandeablePanelContainer}>
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
