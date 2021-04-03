import {Dimensions, Platform, PixelRatio} from 'react-native';
const {width: SCREEN_WIDTH, height: SCREEN_HEIGHT} = Dimensions.get('window');
// console.log('screen', SCREEN_WIDTH + ',' + SCREEN_HEIGHT);
import DeviceInfo from 'react-native-device-info';
const scale = SCREEN_WIDTH / 320;
export const normalize = (size) => {
  const newSize = size * scale;
  if (DeviceInfo.isTablet()) {
    console.log(
      '>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>IS IPAD DEVICE',
      newSize,
      size,
      Math.round(PixelRatio.roundToNearestPixel(newSize)) / 2 + 3,
    );
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) / 2 + 5;
  } else if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
    //return Math.round(PixelRatio.roundToNearestPixel(newSize)) / 2;
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
  }
};
