import React, {PureComponent} from 'react';
import {TouchableOpacity, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import themes from '../../themes';
export default class FunctionButton extends PureComponent {
  render() {
    const {disabled, onPress, text, color} = this.props;
    return (
      <TouchableOpacity
        disabled={disabled}
        onPress={() => onPress()}
        style={{
          backgroundColor: color ? color : themes.BUTTON_GREEN_BACKGROUND,
          justifyContent: 'center',
          alignItems: 'center',
          // width: %',
          padding: 5,
          borderRadius: 25,
          alignSelf: 'center',
          paddingHorizontal: 30,
          // margin:10,
          // marginRight: 20,
          // marginLeft:20,
        }}>
        <Text
          style={{
            fontSize: themes.FONT_SIZE_LARGE,
            color: '#fff',
            textAlign: 'center',
            textAlignVertical: 'center',
            fontWeight: 'bold',
          }}>
          {text}
        </Text>
      </TouchableOpacity>
    );
  }
}
FunctionButton.defaultProps = {
  onPress: () => {},
  text: 'Button',
  disabled: false,
};
