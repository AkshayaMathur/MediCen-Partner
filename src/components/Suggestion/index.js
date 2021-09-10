import React from 'react';
import PropTypes from 'prop-types';
import {
  View,
  StyleSheet,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {HelperText} from 'react-native-paper';
// import theme from '../../themes/siemens';
// import {TouchableOpacity} from 'react-native-gesture-handler';
import themes from '../../themes';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import {ActivityIndicator} from 'react-native';
import {ScrollView} from 'react-native';
export default class Suggestion extends React.Component {
  state = {
    value: '',
    backgroundColor: '#fff',
    // themes.SE_PURPLE,
    textColor: '#fff',
    borderColor: '#fff',
    //  themes.SE_BLUE_1,
    toolTipVisibility: false,
    onChangeText: null,
    showSuggestion: false,
  };
  constructor(props) {
    super(props);
    this.state.value = props.field.value;
    this.state.onChangeText = props.onChangeText;
  }
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

  filterSuggestion = (suggestions) => {
    const {value} = this.props.field;
    if (value === '') {
      return suggestions;
    }
    const filteredSuggestion = suggestions.filter((sugg) => {
      if (sugg.label.includes('Device') || sugg.label.includes('Sales Force')) {
        return true;
      }

      return sugg.label.toLowerCase().includes(value.toLowerCase());
    });
    return filteredSuggestion;
  };

  render() {
    const {value} = this.props.field;
    const {label, type, write, errorMessage} = this.props.field;
    let {
      editable,
      tooltipMessage,
      unit,
      multiline,
      showLabel,
      hideHelperText,
      nameSuggestion,
      onSelect,
    } = this.props;
    // const disableEdit = (!editable && !write) || (editable && !write);
    const filteredSug = nameSuggestion;
    // this.filterSuggestion(nameSuggestion);
    return (
      <View style={[styles.constainer, this.props.containerStyle]}>
        <View style={styles.touchableOpacityStyle}>
          <Text style={styles.label}>{label}</Text>
        </View>
        <View style={styles.subContainer}>
          <TextInput
            underlineColorAndroid="transparent"
            underlineColor="transparent"
            multiline
            numberOfLines={multiline ? 4 : 1}
            label={''}
            value={value}
            keyboardType={this.getKeyBoardType(type)}
            // disabled={disableEdit}
            onFocus={() => this.setState({showSuggestion: true})}
            // onBlur={() => this.setState({showSuggestion: false})}
            onChangeText={(v) => {
              if (this.props.onChangeText) {
                this.props.onChangeText(v);
              }
            }}
            error={this.displayError()}
            style={dynamicStyles(multiline).textInput}
            theme={{
              colors: {
                text: 'black',
                underlineColor: 'transparent',
              },
              roundness: 25,
            }}
          />
          <View
            style={{
              position: 'absolute',
              right: 7,
              top: 10,
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            {this.state.showSuggestion && value !== '' ? (
              <TouchableOpacity
                onPress={() => {
                  if (this.props.onChangeText) {
                    this.props.onChangeText('');
                  }
                }}>
                <Icon
                  name="close"
                  style={{
                    fontSize: 25,
                    color: '#A9A9A9',
                  }}
                />
              </TouchableOpacity>
            ) : null}
            <TouchableOpacity
              onPress={() =>
                this.setState({showSuggestion: !this.state.showSuggestion})
              }>
              <Icon
                name="menu-down"
                style={{
                  fontSize: 30,
                  color: '#A9A9A9',
                }}
              />
            </TouchableOpacity>
          </View>
        </View>
        {this.state.showSuggestion ? (
          // <ScrollView style={{maxHeight: 300}}>
          <FlatList
            data={filteredSug}
            nestedScrollEnabled={true}
            renderItem={({item, index}) => (
              <TouchableOpacity
                // disabled={item.assignable === 0 ? true : false}
                onPress={() => {
                  console.log('Item selected is: , item');
                  onSelect(item);
                  this.setState({showSuggestion: false});
                }}
                style={{
                  //   marginHorizontal: 10,
                  borderWidth: 2,
                  borderTopWidth: index === 0 ? 2 : 0,
                  borderTopRightRadius: index === 0 ? 25 : 0,
                  borderTopLeftRadius: index === 0 ? 25 : 0,
                  borderColor: themes.GREEN_BLUE,
                  padding: 10,
                }}>
                <Text>{item.label}</Text>
              </TouchableOpacity>
            )}
            ListFooterComponent={() => (
              <View>
                {this.state.loadMore ? (
                  <ActivityIndicator
                    size={'large'}
                    // color={siemensTheme.PURPLE_COLOR}
                    // style={styles.activityIndicatorStyle}
                  />
                ) : null}
              </View>
            )}
          />
        ) : (
          // </ScrollView>
          <View style={{marginBottom: 15}} />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  constainer: {
    flex: 1,
    // marginHorizontal: 10,
    // marginTop: 5,
  },
  touchableOpacityStyle: {flexDirection: 'row', marginBottom: 5},
  label: {fontWeight: 'bold'},
  subLabel: {color: 'red', fontWeight: 'bold'},
  subContainer: {flexDirection: 'row', flex: 1},
});
const dynamicStyles = (multiline) =>
  StyleSheet.create({
    textInput: {
      backgroundColor: '#fff',
      borderRadius: 25,
      // outlineWidth: 0,
      borderColor: themes.GREEN_BLUE,
      borderWidth: 2,
      paddingHorizontal: 10,
      paddingVertical: 10,
      //   height: multiline ? 80 : 60,
      overflow: 'hidden',
      flex: 1,
      //   fontSize: themes.FONT_SIZE_LARGE,
    },
  });
