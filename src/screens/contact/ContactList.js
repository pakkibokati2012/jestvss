import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  Button,
  FlatList,
  StatusBar,
  TouchableOpacity,
  Image,
  ScrollView,
  ActivityIndicator,
  Dimensions
} from 'react-native';

const { height, width } = Dimensions.get('window');

export default class ContactList extends Component {
  componentDidMount() {}

  handleContactPress = contact => {
    console.log(contact);
    // this.retrieveConsent(contact.contactid);
    this.props.navigation.navigate('Consent', { contact: contact });
    // this.createConsent(contact.contactId);
  };

  render() {
    const { contacts, contactIsRefreshing, retrieveContacts } = this.props;
    return (
      <View style={{ flex: 1 }}>
        {contactIsRefreshing ? (
          <ActivityIndicator />
        ) : (
          <FlatList
            data={contacts}
            onRefresh={retrieveContacts}
            refreshing={contactIsRefreshing}
            renderItem={({ item, i }) => (
              <TouchableOpacity
                onPress={() => this.handleContactPress(item)}
                style={{
                  marginVertical: 6,
                  marginHorizontal: 5,
                  padding: 10,
                  backgroundColor: '#ffffff',
                  shadowColor: '#000',
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.2,
                  shadowRadius: 3,
                  elevation: 1 // shadow for android
                }}
              >
                <Text style={{ fontSize: 18 }}>
                  {item.fullname ? item.fullname : ' - '}
                </Text>
                {item.emailaddress1 ? (
                  <Text style={{ fontSize: 12, opacity: 0.6, lineHeight: 20 }}>
                    {item.emailaddress1}
                  </Text>
                ) : null}

                <View style={{ flexDirection: 'row', paddingVertical: 5 }}>
                  {item.mobilityissue ? (
                    <View>
                      <Image
                        source={require('../../assets/Wheelchair.png')}
                        style={{ width: 20, height: 20, marginRight: 5 }}
                      />
                    </View>
                  ) : null}
                  {item.slgc_riskassessment ? (
                    <View>
                      {item[
                        'slgc_riskassessment@OData.Community.Display.V1.FormattedValue'
                      ] === 'Amber' ? (
                        <View>
                          <Image
                            source={require('../../assets/AmberIcon.png')}
                            style={{ width: 20, height: 20, marginRight: 5 }}
                          />
                        </View>
                      ) : null}
                      {item[
                        'slgc_riskassessment@OData.Community.Display.V1.FormattedValue'
                      ] === 'Green' ? (
                        <View>
                          <Image
                            source={require('../../assets/GreenIcon.png')}
                            style={{ width: 20, height: 20, marginRight: 5 }}
                          />
                        </View>
                      ) : null}
                      {item[
                        'slgc_riskassessment@OData.Community.Display.V1.FormattedValue'
                      ] === 'Red' ? (
                        <View>
                          <Image
                            source={require('../../assets/RedIcon.png')}
                            style={{ width: 20, height: 20, marginRight: 5 }}
                          />
                        </View>
                      ) : null}
                    </View>
                  ) : null}
                  {item.slgc_mentalhealth ? (
                    <View>
                      <Image
                        source={require('../../assets/MentalHealth.png')}
                        style={{ width: 20, height: 20, marginRight: 5 }}
                      />
                    </View>
                  ) : null}
                  {item.slgc_companionrequired ? (
                    <View>
                      <Image
                        source={require('../../assets/PlusOne.png')}
                        style={{ width: 20, height: 20, marginRight: 5 }}
                      />
                    </View>
                  ) : null}
                  {item.slgc_interpreter &&
                  item[
                    'slgc_interpreter@OData.Community.Display.V1.FormattedValue'
                  ] !== 'None' ? (
                    <Image
                      source={require('../../assets/Translator.png')}
                      style={{ width: 20, height: 20, marginRight: 5 }}
                    />
                  ) : null}
                  {item.slgc_supportpreferences ? (
                    <View>
                      <Image
                        source={require('../../assets/Meeting.png')}
                        style={{ width: 20, height: 20, marginRight: 5 }}
                      />
                    </View>
                  ) : null}
                  {item.slgc_specialcontactinformation ? (
                    <View>
                      <Image
                        source={require('../../assets/Warning.png')}
                        style={{ width: 20, height: 20, marginRight: 5 }}
                      />
                    </View>
                  ) : null}
                </View>
              </TouchableOpacity>
            )}
            keyExtractor={(item, i) => i.toString()}
          />
        )}
      </View>
    );
  }
}
