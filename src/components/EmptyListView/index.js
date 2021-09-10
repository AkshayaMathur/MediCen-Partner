import React, {PureComponent} from 'react';
import {Image, StyleSheet, Text, View} from 'react-native';
import LoadingImg from '../../assets/loading.png';
import NoDataImg from '../../assets/noDataAvailable.png';
import themes from '../../themes';
export default class EmptyListView extends PureComponent {
  render() {
    const {message, loading, loadingMessage} = this.props;
    var messageToDisplay = message ? message : 'No Data Available';
    messageToDisplay = loading
      ? loadingMessage
        ? loadingMessage
        : 'Loading Data'
      : messageToDisplay;

    var iconToDisplay = loading ? LoadingImg : NoDataImg;
    return (
      <View style={styles.container}>
        <Image
          source={iconToDisplay}
          width={100}
          resizeMode="cover"
          style={styles.image}
        />
        <Text
          style={{
            fontSize: themes.FONT_SIZE_LARGE,
            color: themes.TEXT_BLUE_COLOR,
          }}>
          {messageToDisplay}
        </Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'column',
    flex: 1,
    paddingBottom: 30,
  },
  image: {
    margin: 15,
    width: 100,
    height: 100,
    overflow: 'hidden',
  },
});
