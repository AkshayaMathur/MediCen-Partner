import React from 'react';
import PropTypes from 'prop-types';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Text, RadioButton, HelperText} from 'react-native-paper';
import RadioButtonRN from 'radio-buttons-react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import themes from '../../themes';
class RadioOptions extends React.Component {
  constructor(props) {
    super(props);
    this.state.value = props.value;
  }

  state = {value: ''};

  value = () => {
    return this.state.value;
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
    if (
      condition.toLowerCase() === 'required' &&
      (typeof value === 'boolean' ||
        typeof value === 'number' ||
        (value && value.trim() !== ''))
    ) {
      return true;
    }
    return false;
  };

  render() {
    const {label, options, errorMessage} = this.props;
    const {editable} = this.props;

    return (
      <View style={styles.conatiner}>
        <View style={{flexDirection: 'row', marginBottom: 5}}>
          {label && <Text style={{fontWeight: 'bold'}}>{label}</Text>}
        </View>
        {/* <RadioButton.Group
          onValueChange={value => this.setState({value})}
          value={this.state.value}>
          {options.map((option, index) => (
            <View style={styles.itemConatiner} key={index + ''}>
              <View style={{marginTop: 5, marginRight: 5}}>
                <View style={{borderWidth: 0.5, borderRadius: 500}}>
              <RadioButton value={option.value} disabled={!editable} color={'purple'} style={{backgroundColor: 'blue'}}/>
              </View>
              </View>
              <Text>{option.label}</Text>
            </View>
          ))}
        </RadioButton.Group> */}
        <RadioButtonRN
          data={options}
          selectedBtn={(e) => console.log(e)}
          box={false}
          style={{backgroundcolor: '#fff'}}
          textStyle={{color: themes.TEXT_BLUE_COLOR}}
          icon={
            <Icon
              name="check-circle"
              size={25}
              color={themes.BUTTON_GREEN_BACKGROUND}
            />
          }
        />
        {errorMessage && (
          <HelperText type="error" visible={!this.validValue()}>
            {errorMessage}
          </HelperText>
        )}
      </View>
    );
  }
}

RadioOptions.optionsType = PropTypes.arrayOf(
  PropTypes.exact({
    label: PropTypes.string.isRequired,
    value: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number,
      PropTypes.bool,
    ]).isRequired,
  }),
);

RadioOptions.fieldType = PropTypes.exact({
  type: PropTypes.any,
  value: PropTypes.any,
  label: PropTypes.string.isRequired,
  options: RadioOptions.optionsType.isRequired,
  validate: PropTypes.bool.isRequired,
  condition: PropTypes.string,
  errorMessage: PropTypes.string,
});

RadioOptions.propTypes = {
  field: RadioOptions.fieldType.isRequired,
  editable: PropTypes.bool,
};

RadioOptions.defaultProps = {
  editable: true,
  field: {
    errorMessage: 'Required',
    validate: false,
    value: false,
  },
};

const styles = StyleSheet.create({
  conatiner: {marginHorizontal: 10, marginTop: 5, marginBottom: 5},
  itemConatiner: {flexDirection: 'row', alignItems: 'center'},
});

export default RadioOptions;
