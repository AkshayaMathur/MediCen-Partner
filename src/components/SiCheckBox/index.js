import React, {PureComponent} from 'react';
import {Image} from 'react-native';
import {CheckBox} from 'react-native-elements';
import Entypo from 'react-native-vector-icons/Entypo';
import themes from '../../themes';
// import unchecked from '../../assets/images/unchecked.png';
// import checked from '../../assets/images/checked.png';
export default class SiCheckBox extends PureComponent {
  state = {
    tempDisabled: false,
  };
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <CheckBox
        {...this.props}
        checkedColor={themes.BUTTON_GREEN_BACKGROUND}
        uncheckedColor={themes.BUTTON_GREEN_BACKGROUND}
        onPress={() => {
          if (this.props.onPressCheckbox) {
            this.props.onPressCheckbox();
          }
        }}
      />
    );
  }
}
