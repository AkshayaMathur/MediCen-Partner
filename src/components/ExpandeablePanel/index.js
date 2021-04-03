import React, {Component} from 'react';
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import themes from '../../themes';
export default class ExpandeablePanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: props.data,
      expanded: false,
    };

    if (Platform.OS === 'android') {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  render() {
    return (
      <View
        style={{
          borderWidth: 1,
          borderRadius: 25,
          borderColor: themes.CONTENT_GREEN_BACKGROUND,
        }}>
        <TouchableOpacity
          ref={this.accordian}
          style={styles.row}
          onPress={() => this.toggleExpand()}>
          <Text style={[styles.title]} numberOfLines={1}>
            {this.props.title}
          </Text>
          {this.state.expanded ? (
            <Icon name="minus" size={20} color={themes.TEXT_BLUE_COLOR} />
          ) : (
            <Icon name="plus" size={20} color={themes.TEXT_BLUE_COLOR} />
          )}
          {/* <Icon name="plus" size={20} color={themes.TEXT_BLUE_COLOR} /> */}
        </TouchableOpacity>
        <View style={styles.parentHr} />
        {this.state.expanded && (
          <View style={styles.child}>{this.props.children}</View>
        )}
      </View>
    );
  }

  toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    if (this.props.hideContent) {
      this.props.hideContent(!this.state.expanded);
    }

    this.setState({expanded: !this.state.expanded});
  };

  getCurrentExpandable = () => {
    return this.state.expanded;
  };
}

const styles = StyleSheet.create({
  title: {
    fontSize: themes.FONT_SIZE_MEDIUM,
    fontWeight: 'bold',
    color: themes.SE_PURPLE,
    flex: 2,
    // justifyContent: 'flex-end',
    textAlign: 'left',
    marginRight: 10,
  },
  image: {
    tintColor: themes.SE_PURPLE,
    width: 20,
    height: 20,
    resizeMode: 'contain',
    flex: 0.1,
  },

  html: {
    fontWeight: '300',
    // color: '#FF3366', // make links coloured pink
    color: '#2D373C', // make links coloured pink
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    // height: 70,
    borderRadius: 30,
    padding: 15,
    paddingBottom: 0,

    // paddingLeft: 10,
    // paddingRight: 10,
    margin: 10,
    marginTop: 0,
    alignItems: 'center',
    // backgroundColor: '#fff',
    flex: 3,
  },
  parentHr: {
    // height: 1,
    // color: '#fff',

    width: '100%',
  },
  child: {
    // backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: themes.CONTENT_GREEN_BACKGROUND,
    padding: 16,
    // borderRadius: 30,
    // borderWidth: 1,
  },
});
