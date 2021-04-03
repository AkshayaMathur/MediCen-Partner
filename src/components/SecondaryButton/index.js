import React, {PureComponent} from 'react';
import {TouchableOpacity, Text, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import themes from '../../themes';
export default class SecondaryButton extends PureComponent {
  render() {
    const {disabled, onPress, text} = this.props;
    return (
      <View style={{borderRadius: 25, width: '100%'}}>
        <TouchableOpacity
          disabled={disabled}
          onPress={() => onPress()}
          style={{
            // backgroundColor: disabled? siemensTheme.LIGHT_PURPLE_COLOR : siemensTheme.BUTTON_BACKGROUND_COLOR,
            width: '100%',
            padding: 5,
            borderRadius: 25,
            alignSelf: 'center',
            // margin:10,
            marginRight: 20,
            marginLeft: 20,
          }}>
          <Text
            style={{
              fontSize: themes.FONT_SIZE_LARGE,
              textAlign: 'center',
              // fontWeight: 'bold',
            }}>
            {text}
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}
SecondaryButton.defaultProps = {
  onPress: () => {},
  text: 'Button',
  disabled: false,
};
