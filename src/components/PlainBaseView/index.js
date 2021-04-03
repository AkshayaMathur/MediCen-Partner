import React, {Component} from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import themes from '../../themes';
class PlainBaseView extends Component {
  render() {
    let color = '#fff';
    if (this.props.color) {
      color = this.props.color;
    }
    return (
      <SafeAreaView
        style={styles.container}
        // forceInset={{ top: 'always' }}
      >
        <StatusBar
          translucent={true}
          backgroundColor={color}
          // backgroundColor="#50b98d"
          // backgroundColor={'white'}
          barStyle="dark-content"
        />
        <View style={styles.content}>{this.props.children}</View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // width: Dimensions.get('window').width,
    // height: Dimensions.get('window').height,
    //  backgroundColor: '#21A8A8',
    backgroundColor: 'green',
    //  backgroundColor: '#fff'

    //  color:'#fff'
  },
  content: {
    flex: 9,
    backgroundColor: '#fff',
    // marginTop: 10
  },
});
export default PlainBaseView;
