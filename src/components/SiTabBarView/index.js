import React, {PureComponent} from 'react';
import {StyleSheet} from 'react-native';
import {TabBar} from 'react-native-tab-view';
import themes from '../../themes';

class SiTabBarView extends PureComponent {
  render() {
    return (
      <TabBar
        {...this.props}
        indicatorStyle={styles.tabIndicator}
        style={styles.tabContainer}
        activeColor={TAB_ACTIVE_COLOR}
        inactiveColor={TAB_INACTIVE_COLOR}
        labelStyle={styles.tabLabel}
      />
    );
  }
}
const TAB_ACTIVE_COLOR = themes.GREEN_BLUE;
const TAB_INACTIVE_COLOR = themes.TEXT_BLUE_COLOR;

// const TAB_ACTIVE_COLOR = '#41aac8';
// const TAB_INACTIVE_COLOR = '#3296b9';

// const TAB_ACTIVE_COLOR = '#2387AA';
// const TAB_INACTIVE_COLOR = '#666666';

const styles = StyleSheet.create({
  tabContainer: {
    // backgroundColor: '#ebf0f5',
    backgroundColor: 'white',
  },
  tabIndicator: {
    // backgroundColor: siemensTheme.SE_MEDIUM_PURPLE,
    backgroundColor: '#2387AA',
    color: 'pink',
  },
  tabLabel: {
    fontWeight: 'bold',
    fontSize: themes.FONT_SIZE_LARGE,
    textTransform: 'capitalize',
  },
});

export default SiTabBarView;
