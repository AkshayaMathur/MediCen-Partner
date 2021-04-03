import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {TouchableOpacity, Text, View, StyleSheet} from 'react-native';
import {TextInput, HelperText} from 'react-native-paper';
import themes from '../../themes';

export default class CustomTextInput extends PureComponent {
  constructor(props) {
    super(props);
    this.state.value = props.field.value;
    this.state.onChangeText = props.onChangeText;
  }

  state = {
    value: '',
    backgroundColor: themes.GREEN_BLUE,
    textColor: '#fff',
    borderColor: themes.GREEN_BLUE,
    toolTipVisibility: false,
    onChangeText: null,
  };

  getKeyBoardType = (type) => {
    if (!type) {
      return 'default';
    }

    switch (type.toLowerCase()) {
      case 'number':
        return 'numeric';
      case 'integer':
        return 'number-pad';
      case 'float':
        return 'decimal-pad';
      case 'email':
        return 'email-address';
      case 'phone':
        return 'phone-pad';
      default:
        return 'default';
    }
  };

  validValue = () => {
    const {condition, validate} = this.props.field;
    const {value} = this.state;
    if (
      validate === undefined ||
      validate === false ||
      condition === undefined
    ) {
      return true;
    }
    if (condition.toLowerCase() === 'required' && value.length > 0) {
      return true;
    }
    const rx = condition ? new RegExp(condition, 'mi') : undefined;
    const result = rx && rx.test(value);
    if (result) {
      return true;
    }
    return false;
  };

  displayError = () => {
    const {value} = this.state;
    if (value && value.length > 0 && !this.validValue()) {
      return true;
    }
    return false;
  };

  value = () => {
    return this.state.value;
  };

  render() {
    const {textColor} = this.state;
    let textColors = textColor;
    const {value} = this.props.field;
    const {label, type, write, errorMessage} = this.props.field;
    const {editable, multiline, showLabel, hideHelperText} = this.props;
    const disableEdit = (!editable && !write) || (editable && !write);
    // console.log(disableEdit, 'this.props.field', this.props.field);
    if (disableEdit) {
      textColors = '#0000';
    }
    return (
      <View style={[styles.constainer, this.props.containerStyle]}>
        <View style={{flexDirection: 'row', marginBottom: 5}}>
          <Text style={{fontWeight: 'bold'}}>{label}</Text>
        </View>
        <View style={{flexDirection: 'row', flex: 1, marginVertical: 5}}>
          <TextInput
            underlineColorAndroid="transparent"
            underlineColor="transparent"
            multiline
            numberOfLines={multiline ? 1 : 1}
            // label={label}
            value={value}
            keyboardType={this.getKeyBoardType(type)}
            disabled={disableEdit}
            onChangeText={(v) => {
              this.setState({value: v});
              if (this.props.onChangeText) {
                this.props.onChangeText(v);
              }
            }}
            error={this.displayError()}
            style={{
              backgroundColor: '#fff',
              borderRadius: 25,
              underlineColor: 'transparent',
              underlineColorAndroid: 'transparent',
              height: 40,
              overflow: 'hidden',
              flex: 1,
              borderColor: themes.GREEN_BLUE,
              borderWidth: 2,
            }}
            theme={{
              colors: {
                text: 'black',
                underlineColor: 'transparent',
              },
              roundness: 25,
            }}
          />
        </View>
      </View>
    );
  }
}

CustomTextInput.optionsType = PropTypes.arrayOf(
  PropTypes.exact({
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ]).isRequired,
  }),
);

CustomTextInput.fieldType = PropTypes.exact({
  type: PropTypes.any,
  valueInfo: PropTypes.any,
  value: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number,
    PropTypes.bool,
  ]),
  label: PropTypes.string.isRequired,
  options: CustomTextInput.optionsType,
  validate: PropTypes.bool,
  condition: PropTypes.string,
  write: PropTypes.bool,
  errorMessage: PropTypes.string,
  multiline: PropTypes.bool,
  hideHelperText: PropTypes.bool,
});

CustomTextInput.propTypes = {
  field: CustomTextInput.fieldType.isRequired,
  editable: PropTypes.bool,
  // tooltipMessage: PropTypes.string,

  multiline: PropTypes.bool,
  showLabel: PropTypes.bool,
  hideHelperText: PropTypes.bool,
};

CustomTextInput.defaultProps = {
  editable: true,
  containerStyle: {},
  field: {
    errorMessage: 'Required',
    validate: false,
    value: '',
  },
  multiline: false,
  showLabel: true,
  hideHelperText: false,
};

const styles = StyleSheet.create({
  constainer: {
    flex: 1,
    // marginHorizontal: 10,
    // marginTop: 5,
  },
  // input: {
  //   borderRadius: 0,
  //   borderTopLeftRadius: 0,
  //   borderTopRightRadius: 0,
  //   height: 44,
  //   overflow: 'hidden',
  //   backgroundColor: '#fff',
  // },
});
