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
class BaseView extends Component {
  render() {
    return (
      <SafeAreaView
        style={styles.container}
        // forceInset={{ top: 'always' }}
      >
        {/* <LinearGradient
        start={{x: 0.0, y: 0}}
        end={{x: 1, y: 1.0}}
        locations={[0, 60, 100]}
        colors={['#3c8868', '#3e8467', '#54ca98']}
        style={{flex: 0.4}}
       > */}
        <StatusBar
          translucent={true}
          backgroundColor={themes.CONTENT_GREEN_BACKGROUND}
          // backgroundColor="#50b98d"
          // backgroundColor={'white'}
          barStyle="light-content"
        />
        {/* </LinearGradient> */}
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
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    //  color:'#fff'
  },
  content: {
    flex: 9,
    backgroundColor: '#fff',
    // marginTop: 10
  },
});
export default BaseView;
