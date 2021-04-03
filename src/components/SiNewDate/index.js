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
// import PropTypes from 'prop-types';
// import DatePicker from 'react-native-datepicker';
import {TextInput} from 'react-native-paper';
import datePic from '../../assets/date.png';
// '../../assets/images/date.png';
// '../../../assets/images/date.png';
import moment from 'moment';
import {getDate} from '../../utils/date.formatter';
import DatePicker from 'react-native-datepicker';
import themes from '../../themes';
// import datePic from '../../assets/images/date.png'
let hh, mm, ss;
export default class SiNewDate extends Component {
  // static propTypes = {
  //   label: PropTypes.string,
  //   value: PropTypes.any,
  //   required: PropTypes.bool,
  //   placeholder: PropTypes.string,
  //   onDateChange: PropTypes.func,
  //   disabled: PropTypes.bool,
  //   minDate: PropTypes.any,
  //   maxDate: PropTypes.any,
  //   dateFormat: PropTypes.string,
  //   error: PropTypes.bool,
  // };

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

  onDateChange = (date) => {
    const {onDateChange} = this.props;
    onDateChange(date);
  };

  state = {
    setDate: '',
    presetDate: 0.0,
    setMode: '',
    newdate: '',
    newState: {},
    response: {},
    minDate: '',
    maxDate: '',
  };
  constructor(props) {
    super(props);
  }

  render() {
    // console.log('calledpicker', this.props.value);
    let {
      // label,
      value,
      // placeholder,
      disabled,
      minDate,
      maxDate,
      // dateFormat,
      // error,
    } = this.props;
    const moreOptions = {};
    // if (minDate) {
    //   moreOptions.minDate = minDate;
    // }
    // if (maxDate) {
    //   moreOptions.maxDate = maxDate;
    // }
    // console.log('dates', this.state.setDate);
    return (
      <View
        style={[
          styles.container,
          {marginHorizontal: 10},
          this.props.containerStyle,
        ]}>
        <View style={styles.txtInputStyle}>
          <Text style={styles.txtStyle}>{this.props.textlabel}</Text>
          <Text style={styles.reqColor}>
            {this.props.required ? ' *' : null}
          </Text>
          <Text style={styles.txtStyle}>
            {this.props.disabled ? ' (Disabled)' : ''}
          </Text>
        </View>
        <View style={styles.container}>
          <DatePicker
            style={{width: '100%'}}
            date={value}
            mode="date"
            // mode="time"
            placeholder={`Select ${this.props.textlabel}`}
            format="YYYY-MM-DD"
            iconSource={datePic}
            // minDate="2016-05-01"
            // maxDate="2016-06-01"
            confirmBtnText="Confirm"
            cancelBtnText="Cancel"
            customStyles={{
              dateIcon: {
                position: 'absolute',
                left: 5,
                tintColor: 'black',
              },
              dateInput: {
                fontWeight: 'bold',
                borderWidth: 3,
                borderColor: themes.GREEN_BLUE,
                borderRadius: 25, // borderBottomWidth: 1,
                alignItems: 'flex-start',
                height: 50,
              },
              placeholderText: {
                fontWeight: 'bold',
                color: 'black',
                marginLeft: 45,
              },
              dateText: {
                fontSize: themes.FONT_SIZE_LARGE,
                marginLeft: 45,
              },
              // ... You can check the source to find the other keys.
            }}
            onDateChange={(date) => {
              value = date;
              console.log('Date Is changing to: ', date);
              this.setState({date: date});
              if (this.props.onChangeText(date)) {
                this.props.onChangeText(date);
              }
            }}
          />
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
    //   padding: 10,
    //   width:'100%',
    //   height:'100%',
    // backgroundColor:'#00000024'
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
  reqColor: {color: 'black', color: 'red'},
  txtStyle: {
    fontWeight: 'bold',
    color: 'grey',
    fontSize: themes.FONT_SIZE_MEDIUM,
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
