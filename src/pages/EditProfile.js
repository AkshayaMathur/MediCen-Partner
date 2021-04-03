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
  TextInput,
  Button,
  ScrollView,
  Modal,
  KeyboardAvoidingView,
} from 'react-native';

const EditProfile = ({navigation, props}) => {
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

  return (
    <View style={styles.container}>
      <Text>HELLO</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default EditProfile;
