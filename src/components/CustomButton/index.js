import React, {PureComponent} from 'react';
import {TouchableOpacity, Text} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import themes from '../../themes';
export default class CustomButton extends PureComponent {
  render() {
    const {disabled, onPress, text} = this.props;
    return (
      <LinearGradient
        start={{x: 0.0, y: 0}}
        end={{x: 1, y: 1.0}}
        locations={[0, 60, 100]}
        colors={['#5cd0a0', '#3e8467', '#64deaa']}
        style={{borderRadius: 25, width: '100%', paddingVertical: 0}}>
        <TouchableOpacity
          disabled={disabled}
          onPress={() => onPress()}
          style={{
            // backgroundColor: disabled? siemensTheme.LIGHT_PURPLE_COLOR : siemensTheme.BUTTON_BACKGROUND_COLOR,
            justifyContent: 'center',
            alignItems: 'center',
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
              color: '#fff',
              textAlign: 'center',
              textAlignVertical: 'center',
              fontWeight: 'bold',
            }}>
            {text}
          </Text>
        </TouchableOpacity>
      </LinearGradient>
    );
  }
}
CustomButton.defaultProps = {
  onPress: () => {},
  text: 'Button',
  disabled: false,
};
