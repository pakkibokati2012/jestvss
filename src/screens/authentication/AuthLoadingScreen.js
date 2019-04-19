import React from 'react';
import { ActivityIndicator, StatusBar, StyleSheet, View } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import PropTypes from 'prop-types';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center'
  }
});
export default class AuthLoadingScreen extends React.Component {
  static propTypes = {
    navigation: PropTypes.shape({
      navigate: PropTypes.func
    })
  };

  constructor(props) {
    super(props);
    this._bootstrapAsync();
  }

  // Fetch the token from storage then navigate to our appropriate place
  _bootstrapAsync = async () => {
    console.log('inside bootstrap', this.props);
    const userToken = await AsyncStorage.getItem('@vss_consent_token');
    const {
      navigation: { navigate }
    } = this.props;

    // This will switch to the App screen or Auth screen and this loading
    // screen will be unmounted and thrown away.
    navigate(userToken ? 'Main' : 'Auth');
    // navigate('Auth');
  };

  render() {
    return (
      <View style={styles.container}>
        <ActivityIndicator testId={'activityindicator'} />
        <StatusBar barStyle='default' />
      </View>
    );
  }
}
