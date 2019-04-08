import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Image,
  StatusBar,
  Alert
} from 'react-native';
import ContactList from './ContactList';
import { authorize, refresh } from 'react-native-app-auth';
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import * as _ from 'lodash';
import colors from '../../constants/colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12
  },
  searchWrapper: {
    flexDirection: 'row',
    paddingVertical: 10
  },
  searchBar: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    paddingLeft: 20,
    height: 40
  },
  searchIconWrapper: {
    height: 40,
    backgroundColor: '#F2F2F2',
    justifyContent: 'center',
    paddingRight: 15
  },
  searchIcon: {
    // width: 30,
    // height: 30
  }
});

export default class ContactScreen extends Component {
  static navigationOptions = ({ navigation }) => {
    console.log(navigation);
    const { params = {} } = navigation.state;
    return {
      headerRight: (
        <TouchableOpacity
          style={{ paddingRight: 10 }}
          onPress={() => {
            params.logout();
          }}
        >
          <Image
            style={{ height: 22, width: 22 }}
            source={require('../../assets/Logout.png')}
          />
        </TouchableOpacity>
      )
    };
  };

  config = {
    issuer:
      'https://login.microsoftonline.com/d2466f61-72bf-419d-a8d2-757eb34203d8',
    clientId: 'c778efb6-cf20-4aba-991b-43fb7917ae24',
    redirectUrl: 'vssconsentapp://callback',
    scopes: [], // ignored by Azure AD
    additionalParameters: {
      resource: 'https://vss.crm11.dynamics.com'
    }
  };

  state = {
    searchKey: null,
    hasLoggedInOnce: false,
    accessToken: '',
    accessTokenExpirationDate: '',
    refreshToken: '',
    contacts: [],
    contactIsRefreshing: false
  };

  constructor() {
    super();
    this.onChangeTextDelayed = _.debounce(this.onChangeText, 700);
  }

  componentDidMount() {
    const { navigation } = this.props;
    navigation.setParams({ logout: this.logout });
    AsyncStorage.getItem('@vss_consent_token').then(data => {
      console.log(data);
      if (data) {
        const tokenData = JSON.parse(data);
        this.setState(
          {
            hasLoggedInOnce: tokenData.hasLoggedInOnce,
            accessToken: tokenData.accessToken,
            accessTokenExpirationDate: tokenData.accessTokenExpirationDate
          },
          () => {
            refreshToken: tokenData.refreshToken;
            if (new Date(tokenData.accessTokenExpirationDate < new Date())) {
              // this.refreshOldGetNew();
            } else {
            }
            this.retrieveContacts();
          }
        );
      }
    });
  }

  logout = () => {
    console.log('logout');
    const { navigation } = this.props;
    const { navigate } = navigation;
    Alert.alert(
      'Log out',
      'Do you want to logout?',
      [
        {
          text: 'Cancel',
          onPress: () => null
        },
        {
          text: 'Confirm',
          onPress: () => {
            AsyncStorage.clear();
            navigate('Auth');
          }
        }
      ],
      { cancelable: false }
    );
  };

  authorize = async () => {
    try {
      authorize(this.config)
        .then(data => {
          console.log('hello auth', data);
          this.setState({
            hasLoggedInOnce: true,
            accessToken: data.accessToken,
            accessTokenExpirationDate: data.accessTokenExpirationDate,
            refreshToken: data.refreshToken
          });
          AsyncStorage.setItem(
            '@vss_consent_token',
            JSON.stringify({
              hasLoggedInOnce: true,
              accessToken: data.accessToken,
              accessTokenExpirationDate: data.accessTokenExpirationDate,
              refreshToken: data.refreshToken
            })
          );
          this.retrieveContacts();
          this.retrieveConsent();
          // alert(JSON.stringify(data));
        })
        .catch(error => {
          console.log('hello auth', error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  refreshOldGetNew = async () => {
    try {
      console.log(this.state.refreshToken);

      refresh(this.config, { refreshToken: this.state.refreshToken })
        .then(data => {
          console.log(data);
          this.setState({
            accessToken: data.accessToken || this.state.accessToken,
            accessTokenExpirationDate:
              data.accessTokenExpirationDate ||
              this.state.accessTokenExpirationDate,
            refreshToken: data.refreshToken || this.state.refreshToken
          });
          AsyncStorage.setItem(
            '@vss_consent_token',
            JSON.stringify({
              hasLoggedInOnce: true,
              accessToken: data.accessToken,
              accessTokenExpirationDate: data.accessTokenExpirationDate,
              refreshToken: data.refreshToken
            })
          );
          this.retrieveContacts();
        })
        .catch(error => {
          console.log(error);
        });
    } catch (error) {
      console.error(error);
    }
  };

  retrieveContacts = (keyword = '') => {
    const config = {
      headers: {
        Authorization: 'Bearer ' + this.state.accessToken,
        'OData-Version': '4.0',
        'OData-MaxVersion': '4.0',
        'Content-Type': 'application/json; charset=utf-8',
        Prefer:
          ' odata.include-annotations=OData.Community.Display.V1.FormattedValue'
      }
    };

    this.setState({ contactIsRefreshing: true });
    axios
      .get(
        `https://vss.crm11.dynamics.com/api/data/v9.0/contacts?$select=fullname,contactid, slgc_mobilityissue,slgc_interpreter,slgc_specialcontactinformation, slgc_riskassessment, emailaddress1, address1_composite,slgc_mentalhealth,slgc_companionrequired,slgc_supportpreferences&$orderby=fullname&$filter=contains(fullname,'${keyword}')`,
        // 'https://vss.crm11.dynamics.com/api/data/v9.0/contacts?fetchXml=<fetch page="1" count="100" ><entity name="contact" ><attribute name="fullname" /><attribute name="slgc_mobilityissue" /><attribute name="contactid" /><attribute name="slgc_interpreter" /><attribute name="slgc_specialcontactinformation" /><attribute name="slgc_riskassessment" /><attribute name="slgc_mentalhealth" /><attribute name="slgc_companionrequired" /><attribute name="slgc_supportpreferences" /></entity></fetch>',

        config
      )
      .then(data => {
        this.setState({ contactIsRefreshing: false });
        console.log(data);
        if (data.status === 401 || data.status === 400 || data.status === 403) {
          this.authorize();
        }
        this.setState({ contacts: data.data.value });
      })
      .catch(error => {
        this.setState({ contactIsRefreshing: false });
        if (
          (error.response || {}).status === 401 ||
          (error.response || {}).status === 400 ||
          (error.response || {}).status === 403
        ) {
          this.authorize();
        }
        console.log(error.response);
      });
  };

  onChangeText = contact => {
    console.log(contact);
    text => this.setState({ searchKey: contact });
    //search contacts with keyword
    this.retrieveContacts(contact);
  };

  render() {
    const { contacts, contactIsRefreshing, searchKey } = this.state;
    return (
      <View style={styles.container}>
        <StatusBar />
        <View style={styles.searchWrapper}>
          <TextInput
            style={styles.searchBar}
            value={searchKey}
            placeholder='Search'
            onChangeText={this.onChangeTextDelayed}
          />
          <View style={styles.searchIconWrapper}>
            <Image
              source={require('../../assets/search.png')}
              style={styles.searchIcon}
            />
          </View>
        </View>
        <ContactList
          {...this.props}
          contacts={contacts}
          retrieveContacts={this.retrieveContacts}
          contactIsRefreshing={contactIsRefreshing}
        />
      </View>
    );
  }
}
