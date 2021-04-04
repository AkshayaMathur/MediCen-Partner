import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';

import {Dialog, Paragraph, Button, Portal} from 'react-native-paper';
import i18n from '../../utils/i18n';
// import {ButtonPrimary, ButtonSecondary} from '..';
import {siemensTheme} from '../../themes';
import SecondaryButton from '../SecondaryButton';
import CustomButton from '../CustomButton';

class DialogView extends PureComponent {
  render() {
    const {
      visible,
      title,
      dismissable,
      message,
      postiveAction,
      postiveActionText,
      negativeAction,
      negativeActionText,
      children,
    } = this.props;

    return (
      <Dialog visible={visible} dismissable={dismissable}>
        <Dialog.Title style={{fontSize: siemensTheme.FONT_SIZE_VERY_LARGE}}>
          {title}
        </Dialog.Title>
        <Dialog.Content>
          <Paragraph style={{fontSize: siemensTheme.FONT_SIZE_MEDIUM}}>
            {message}
          </Paragraph>
          {children}
        </Dialog.Content>
        <Dialog.Actions style={{justifyContent: 'center'}}>
          {/* <Button onPress={negativeAction}>{negativeActionText}</Button>
            <Button onPress={postiveAction}>{postiveActionText}</Button> */}
          <SecondaryButton text={negativeActionText} onPress={negativeAction} />
          <CustomButton text={postiveActionText} onPress={postiveAction} />
        </Dialog.Actions>
      </Dialog>
    );
  }
}

DialogView.propTypes = {
  visible: PropTypes.bool,
  dismissable: PropTypes.bool,
  title: PropTypes.string,
  message: PropTypes.string,
  postiveActionText: PropTypes.string,
  negativeActionText: PropTypes.string,
  postiveAction: PropTypes.any,
  negativeAction: PropTypes.any,
};

DialogView.defaultProps = {
  visible: false,
  dismissable: false,
  title: 'Alert',
  message: 'Are you sure?',
  postiveActionText: 'yes',
  negativeActionText: 'No',
  postiveAction: () => {},
  negativeAction: () => {},
};

export default DialogView;
