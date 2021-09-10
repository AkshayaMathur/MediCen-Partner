import React, {Component} from 'react';
import {View, Text, Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import drugStore from '../../assets/drugstore.png';
import themes from '../../themes';
import {getUserDetails} from '../../utils/userprofile';
import MedcenLogo from '../../assets/appLogo.png';
export default class AppBar extends Component {
  state = {
    name: '',
    licence: '',
  };
  constructor(props) {
    super(props);

    this.init();
  }
  init = async () => {
    let userDetails = await getUserDetails();
    if (userDetails) {
      userDetails = JSON.parse(userDetails);
      console.log('User Details is: ');
      this.setState({name: userDetails.name, licence: userDetails.licence});
    }
  };
  render() {
    const {name, licence} = this.state;
    return (
      <View
        style={{
          padding: 10,
          flexDirection: 'row',
          backgroundColor: themes.CONTENT_GREEN_BACKGROUND,
        }}>
        <Image source={MedcenLogo} style={{width: 130, height: 30}} />

        <View style={{flex: 1, flexDirection: 'row-reverse'}}>
          {/* <Text
            style={{
              color: themes.TEXT_BLUE_COLOR,
              fontWeight: 'bold',
              textAlignVertical: 'center',
              fontSize: themes.FONT_SIZE_SMALL,
              marginRight: 5,
            }}>
            {`Licence: ${licence}`}
          </Text> */}
          <Image source={drugStore} style={{width: 25, height: 25}} />
          <Text
            style={{
              color: themes.TEXT_BLUE_COLOR,
              fontWeight: 'bold',
              textAlignVertical: 'center',
              fontSize: themes.FONT_SIZE_MEDIUM,
              marginRight: 5,
            }}>
            {name}
          </Text>
        </View>
      </View>
    );
  }
}
