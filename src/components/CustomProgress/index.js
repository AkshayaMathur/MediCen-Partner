import React, {PureComponent} from 'react';
import {TouchableOpacity, Text, Modal, View} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import {ActivityIndicator} from 'react-native-paper';
import themes from '../../themes';
export default class CustomeProgress extends PureComponent {
  render() {
    const {showprogress} = this.props;
    return (
      <Modal
        transparent={true}
        animationType={'none'}
        visible={showprogress}
        onRequestClose={() => {
          console.log('close modal');
        }}>
        <View
          style={{
            flex: 1,
            alignItems: 'center',
            flexDirection: 'column',
            justifyContent: 'space-around',
            backgroundColor: '#00000040',
          }}>
          <View
            style={{
              backgroundColor: '#FFFFFF',
              height: 100,
              width: 100,
              borderRadius: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-around',
            }}>
            <ActivityIndicator
              animating={showprogress}
              size="large"
              color="#000"
              style={{height: 65}}
            />
          </View>
        </View>
      </Modal>
    );
  }
}
