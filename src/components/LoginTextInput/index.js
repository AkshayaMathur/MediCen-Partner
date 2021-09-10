import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, Text, View, StyleSheet} from 'react-native';
import themes from '../../themes';
import Icon from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Input} from 'react-native-elements';

export default class LoginTextInput extends PureComponent {
  getTypeOfImage = (type) => {
    if (type === 'password') {
      return (
        <Icon name="lock" size={24} color="black" style={{marginLeft: 5}} />
      );
    } else if (type === 'email') {
      return (
        <MaterialIcons
          name="email"
          size={24}
          color="black"
          style={{marginLeft: 5}}
        />
      );
    } else if (type === 'licence') {
      return (
        <MaterialCommunityIcons
          name="license"
          size={24}
          color="black"
          style={{marginLeft: 5}}
        />
      );
    } else if (type === 'number') {
      return (
        <MaterialCommunityIcons
          name="cellphone"
          size={24}
          color="black"
          style={{marginLeft: 5}}
        />
      );
    } else if (type === 'description') {
      return (
        <MaterialIcons
          name="description"
          size={28}
          color="black"
          style={{marginLeft: 5}}
        />
      );
    } else if (type === 'time') {
      return (
        <MaterialIcons
          name="access-time"
          size={24}
          color="black"
          style={{marginLeft: 5}}
        />
      );
    } else if (type === 'location' || type === 'pincode') {
      return (
        <MaterialIcons
          name="location-pin"
          size={24}
          color="black"
          style={{marginLeft: 5}}
        />
      );
    }
    return (
      <Icon name="user" size={24} color="black" style={{marginLeft: 10}} />
    );
  };
  getKeyborderType = (type) => {
    if (type === 'email') {
      return 'email-address';
    } else if (type === 'number' || type === 'pincode') {
      return 'number-pad';
    } else {
      return 'default';
    }
  };
  render() {
    const {label, type, value} = this.props.field;
    const {onChangeText, multiline} = this.props;
    return (
      <View
        style={[
          {
            flex: 1,
          },
          this.props.containerStyle,
        ]}>
        <Input
          label={label}
          placeholder={''}
          value={value}
          keyboardType={this.getKeyborderType(type)}
          leftIcon={this.getTypeOfImage(type)}
          inputContainerStyle={{
            borderWidth: 3,
            padding: 3,
            borderColor: themes.GREEN_BLUE,
            marginTop: 10,
            borderRadius: 20,
            height: multiline ? 100 : 45,
          }}
          secureTextEntry={type === 'password' ? true : false}
          onChangeText={(val) => onChangeText(val)}
          inputStyle={{padding: 0}}
          {...this.props}
        />
      </View>
    );
  }
}
