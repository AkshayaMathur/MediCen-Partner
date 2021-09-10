import React, {Component, useEffect, useState} from 'react';
import {View, TouchableOpacity, Text, StyleSheet} from 'react-native';
import themes from '../themes';
import Icon from 'react-native-vector-icons/AntDesign';
import {ScrollView} from 'react-native';
import {getRepeatFreqString, REPEAT_FREQ} from '../utils/generalFunction';
import CustomTextInput from '../components/CustomTextInput';
import SiNewDate from '../components/SiNewDate1';
import CustomTimePicker from '../components/CustomTimePicker1';
import CustomButton from '../components/CustomButton';
import Device_Api from '../utils/api';
import CustomeProgress from '../components/CustomProgress';
import {getUserDetails} from '../utils/userprofile';
const dayFrequencies = ['Morning', 'Afternoon', 'Night'];
class CreateNewReminder extends Component {
  state = {
    frequency: 'once',
    dayFrequency: [],
    dayFrequencyTime: [],
    message: '',
    expiryDate: new Date(),
    loading: false,
  };
  constructor(props) {
    super(props);
  }
  createReminder = async () => {
    this.setState({loading: true});
    let userDetails = await getUserDetails();
    if (userDetails) {
      userDetails = JSON.parse(userDetails);
    }
    const {
      frequency,
      dayFrequency,
      dayFrequencyTime,
      message,
      expiryDate,
    } = this.state;
    let obj = {
      frequency: frequency,
      dayFrequency: dayFrequency,
      dayFrequencyTime: dayFrequencyTime,
      message: message,
      expiryDate: expiryDate,
      userId: userDetails.Id,
    };
    Device_Api.createReminder(obj)
      .then((res) => {
        console.log('Result is: ', res);
        this.setState({loading: false});
        const refresh = this.props.route.params.refresh;
        refresh();
        this.props.navigation.goBack();
      })
      .catch((err) => {
        console.log('An error occurred::::: ', err);
        this.setState({loading: false});
      });
  };
  getBackgroundColorOfButton = (status) => {
    const {frequency} = this.state;
    if (status === frequency) {
      return themes.TEXT_BLUE_COLOR;
    }
    return themes.BUTTON_GREEN_BACKGROUND;
  };
  getDayFrequencyBackgroundColorOfButton = (status) => {
    const {dayFrequency} = this.state;
    console.log(
      'Set dayFrequency.includes(status) is: ',
      dayFrequency.includes(status),
    );
    if (dayFrequency.includes(status)) {
      return themes.TEXT_BLUE_COLOR;
    }
    return themes.BUTTON_GREEN_BACKGROUND;
  };
  setDayFrequencies = (status) => {
    const {dayFrequency, dayFrequencyTime} = this.state;
    const dFreq = dayFrequency;
    if (dFreq.includes(status)) {
      const index = dayFrequency.indexOf(status);
      if (index > -1) {
        dFreq.splice(index, 1);
        dayFrequencyTime.splice(index, 1);
        console.log('Split Day Frequency is', dFreq);
        // setDayFrequency(dFreq);
        // setDayFrequency(dFreq);
      }
    } else {
      dFreq.push(status);
      if (status === 'Morning') {
        dayFrequencyTime.push({hours: 7, minutes: 0});
      } else if (status === 'Afternoon') {
        dayFrequencyTime.push({hours: 13, minutes: 0});
      } else {
        dayFrequencyTime.push({hours: 20, minutes: 0});
      }

      // setDayFrequency(dFreq);
    }
    console.log(status, dFreq, dayFrequency);
    this.setState({dayFrequency, dayFrequencyTime}, () =>
      console.log('Value is set..............', this.state.dayFrequency),
    );
  };

  setDayFrequencyTimes = (value, index) => {};
  render() {
    const {
      dayFrequency,
      frequency,
      message,
      dayFrequencyTime,
      loading,
    } = this.state;
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <CustomeProgress showprogress={loading} />
          <Text>Frequency: </Text>
          <View
            style={{
              marginVertical: 10,
              flexDirection: 'row',
              flexWrap: 'wrap',
              // borderWidth: 0.1,
              borderColor: themes.GREEN_BLUE,
              borderRadius: 25,
              justifyContent: 'center',
            }}>
            {REPEAT_FREQ.map((repOrder, index) => {
              return (
                <TouchableOpacity
                  key={index}
                  onPress={() => this.setState({frequency: repOrder})}
                  style={{
                    margin: 2,
                    backgroundColor: this.getBackgroundColorOfButton(repOrder),
                    padding: 5,
                    borderRadius: 15,
                    paddingVertical: 10,
                    paddingHorizontal: 15,
                  }}>
                  <Text
                    style={{
                      color: '#fff',
                      fontWeight: 'bold',
                      fontSize: themes.FONT_SIZE_SMALL,
                    }}>
                    {getRepeatFreqString(repOrder)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
          {frequency === 'once' ? (
            <View style={{minHeight: 90}}>
              <CustomTimePicker
                textlabel={'Select Time'}
                value={dayFrequencyTime[0]}
                handleChange={(value) => {
                  const dayFreqTime = this.state.dayFrequencyTime;
                  dayFreqTime[0] = {
                    hours: value.hours,
                    minutes: value.minutes,
                  };
                  this.setState({dayFrequencyTime: dayFreqTime});
                }}
              />
            </View>
          ) : (
            <View>
              <Text>Frequency On Selected Days: </Text>
              <View
                style={{
                  marginVertical: 10,
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  // borderWidth: 0.1,
                  borderColor: themes.GREEN_BLUE,
                  borderRadius: 25,
                  justifyContent: 'center',
                }}>
                {dayFrequencies.map((repOrder, index) => {
                  return (
                    <TouchableOpacity
                      key={index}
                      onPress={() => this.setDayFrequencies(repOrder)}
                      style={{
                        margin: 2,
                        backgroundColor: this.getDayFrequencyBackgroundColorOfButton(
                          repOrder,
                        ),
                        padding: 5,
                        borderRadius: 15,
                        paddingVertical: 10,
                        paddingHorizontal: 15,
                      }}>
                      <Text
                        style={{
                          color: '#fff',
                          fontWeight: 'bold',
                          fontSize: themes.FONT_SIZE_SMALL,
                        }}>
                        {repOrder}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              <View style={{marginHorizontal: 10, marginVertical: 10}}>
                {dayFrequency.map((fre, index) => {
                  return (
                    <View style={{minHeight: 90}}>
                      <CustomTimePicker
                        textlabel={fre}
                        value={dayFrequencyTime[index]}
                        handleChange={(value) => {
                          const dayFreqTime = this.state.dayFrequencyTime;
                          dayFreqTime[index] = {
                            hours: value.hours,
                            minutes: value.minutes,
                          };
                          this.setState({dayFrequencyTime: dayFreqTime});
                        }}
                      />
                    </View>
                  );
                })}
              </View>
            </View>
          )}
          <View style={styles.textContainer}>
            <SiNewDate
              value={this.state.orderExpiry}
              textlabel={
                this.state.frequency === 'once'
                  ? 'Next Reminder Date'
                  : 'Reminder Expire Date'
              }
              // style={{borderWidth: 1}}
              // containerStyle={{marginTop: 10}}
              disabled={false}
              onChangeText={(date) => {
                this.setState({orderExpiry: date});
              }}
            />
          </View>
          <View style={styles.textContainer}>
            <CustomTextInput
              editable
              required={true}
              field={{
                label: 'Message To Be Displayed',
                write: true,
                value: message,
              }}
              onChangeText={(text) => this.setState({message: text})}
              containerStyle={{marginHorizontal: 8}}
            />
          </View>
          <View style={{marginHorizontal: 10, marginVertical: 30}}>
            <View style={{flexDirection: 'row'}}>
              <CustomButton
                text={'Create Reminder'}
                onPress={() => this.createReminder()}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  textContainer: {
    flexDirection: 'row',
    minHeight: 80,
    marginHorizontal: 5,
    marginTop: 15,
    // marginBottom: 15,
  },
  text: {fontWeight: 'bold'},
});
export default CreateNewReminder;
