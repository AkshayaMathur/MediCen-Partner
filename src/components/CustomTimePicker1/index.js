import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Platform,
  // TouchableWithoutFeedback,
  DatePickerAndroid,
  Image,
  StyleSheet,
} from 'react-native';
import {CheckBox} from 'react-native-elements';
import {TimePicker} from 'react-native-simple-time-picker';
import themes from '../../themes';
export default class CustomTimePicker1 extends Component {
  static defaultProps = {
    label: '',
    value: '',
    placeholder: '',
    onDateChange: () => {},
    disabled: false,
    minDate: null,
    maxDate: null,
    dateFormat: 'DD-MM-YYYY',
    error: false,
    containerStyle: {},
  };

  render() {
    let {
      value,
      handleChange,
      handleChangeClosing,
      onCheckboxClick,
    } = this.props;
    return (
      <View
        style={[
          styles.container,
          {marginHorizontal: 2},
          this.props.containerStyle,
        ]}>
        <View style={styles.txtInputStyle}>
          <Text style={styles.txtStyle}>{this.props.textlabel}</Text>
        </View>
        <View style={styles.containerTouchable}>
          <View
            style={{
              flex: 5,
              borderRightWidth: 1,
              borderRightColor: themes.CONTENT_GREEN_BACKGROUND,
              justifyContent: 'center',
            }}>
            <TimePicker
              value={{
                hours: value.hours,
                minutes: value.minutes,
              }}
              onChange={handleChange}
              minutesInterval={30}
              hoursUnit={'Hr'}
              minutesUnit={'Min'}
            />
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 10,
    // borderWidth:
    // padding: 10,
    //   backgroundColor:'#00000024'
  },
  containerTouchable: {
    flex: 1,
    borderWidth: 2,
    borderColor: themes.GREEN_BLUE,
    borderRadius: 25,
    // flexDirection: 'row',
  },

  SectionStyle: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderWidth: 0.5,
    borderColor: '#000',
    height: 40,
    borderRadius: 5,
    margin: 10,
  },
  ImageStyle: {
    padding: 10,
    // paddingRight:100,
    margin: 10,

    height: 24,
    width: 24,
    alignContent: 'center',
    position: 'absolute',
    resizeMode: 'stretch',

    alignItems: 'center',
    alignSelf: 'center',
    justifyContent: 'center',
    tintColor: '#2387AA',
  },
  normalTextStyle: {color: '#2D373C', fontWeight: '600'},
  reqColor: {color: 'red'},
  txtStyle: {
    flex: 1,
    fontWeight: 'bold',
    // color: 'grey',
    // fontSize: themes.FONT_SIZE_MEDIUM,
    // textAlign: 'center',
    textAlignVertical: 'center',
  },
  txtInputStyle: {flexDirection: 'row', flex: 0.5, marginBottom: 5},
  textInputStyle: {
    // height: 40,
    flex: 1,
    borderWidth: 0,
    borderBottomWidth: 0,
    textAlignVertical: 'top',
    // fontSize,
    //alignItems: multiline ? 'center' : null,
    paddingBottom: 5,
    // color: '#FF6565' ? '#2A3C53' : '#2A3C53',
    paddingLeft: 25,

    marginTop: Platform.OS === 'ios' ? 10 : 10,
  },
  imageStyle: {
    position: 'absolute',
    alignSelf: 'center',
    justifyContent: 'center',
    margin: 10,
    padding: 10,
  },
  reqColorOther: {
    color: '#005578',
  },
});
