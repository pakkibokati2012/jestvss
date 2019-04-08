import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  Platform
} from 'react-native';
import { authorize, refresh } from 'react-native-app-auth';
import AsyncStorage from '@react-native-community/async-storage';
import Colors from '../../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primaryColor,
    justifyContent: 'center',
    alignItems: 'center'
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 15
  },
  button: {
    flexDirection: 'row',
    backgroundColor: '#2F2F2F',
    width: 215,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 112
  }
});

export default class Login extends Component {
  state = {
    showLoader: false
  };

  config = {
    issuer:
      'https://login.microsoftonline.com/d2466f61-72bf-419d-a8d2-757eb34203d8',
    clientId: 'c778efb6-cf20-4aba-991b-43fb7917ae24',
    redirectUrl:
      Platform.OS === 'ios'
        ? 'urn:ietf:wg:oauth:2.0:oob'
        : 'vssconsentapp://callback', //for ios
    // redirectUrl: 'vssconsentapp://callback', //for android
    scopes: [], // ignored by Azure AD
    additionalParameters: {
      resource: 'https://vss.crm11.dynamics.com'
    }
  };

  setLoader = showLoader => {
    this.setState({
      showLoader
    });
  };

  authorize = async () => {
    this.setLoader(true);

    try {
      authorize(this.config)
        .then(data => {
          console.log('success', data);
          this.setLoader(false);
          AsyncStorage.setItem(
            '@vss_consent_token',
            JSON.stringify({
              hasLoggedInOnce: true,
              accessToken: data.accessToken,
              accessTokenExpirationDate: data.accessTokenExpirationDate,
              refreshToken: data.refreshToken
            })
          );
          this.props.navigation.navigate('Main');
        })
        .catch(error => {
          console.log('erorr 1', error);
          this.setLoader(false);
        });
    } catch (error) {
      console.log('error 2', error);
      this.setLoader(false);
    }
  };

  render() {
    const { showLoader } = this.state;
    return (
      <View style={styles.container}>
        <Text style={{ fontSize: 72, fontWeight: 'bold' }}>VSS</Text>
        <Text style={{ fontSize: 24 }}>CONSENT</Text>
        {showLoader === true ? (
          <View style={styles.button}>
            <ActivityIndicator />
          </View>
        ) : (
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.authorize()}
          >
            <Image
              style={styles.icon}
              source={require('../../assets/Microsoft.png')}
            />
            <Text style={{ color: '#ffffff' }}>Sign In With Microsoft</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}
