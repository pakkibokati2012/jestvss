import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  TouchableHighlight,
  TouchableOpacity,
  Button,
  Alert,
  ActivityIndicator
} from 'react-native';
import ConsentCheckList from './ConsentCheckList';
import Colors from '../../constants/colors';
import axios from 'axios';
import AsyncStorage from '@react-native-community/async-storage';
import { SignatureView } from 'react-native-signview';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EDF4F7'
  },
  userProfile: {
    backgroundColor: '#0CA2E4',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 15
  },
  iconWrapper: {
    flexDirection: 'row',
    marginTop: 10
  },
  icon: {
    width: 20,
    height: 20,
    marginHorizontal: 5
  },
  consentSignatureWrapper: {
    paddingHorizontal: 18
  },
  consentTitle: {
    paddingVertical: 10
  },
  signaturePad: {
    marginVertical: 16,
    borderRadius: 10,
    height: 100,
    backgroundColor: '#ffffff',
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 1
  },
  signBox: {
    height: 150,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 1,
    borderRadius: 10
  }
});

const SignaturePad = ({ setModalVisible }) => (
  <View style={styles.signaturePad} onTouchStart={setModalVisible}>
    <Text>SIGNATURE</Text>
  </View>
);

const SignatureModal = ({
  modalVisible,
  setModalVisible,
  clearSignature,
  submitSignature
}) => (
  <Modal
    animationType="slide"
    transparent={false}
    visible={modalVisible}
    onRequestClose={() => {
      setModalVisible(false);
    }}
  >
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Text>Signature here</Text>
    </View>
    <TouchableHighlight
      onPress={setModalVisible}
      style={{
        height: 50,
        backgroundColor: Colors.primaryColor,
        justifyContent: 'center',
        alignItems: 'center'
      }}
    >
      <Text>Close</Text>
    </TouchableHighlight>
  </Modal>
);

const SubmitButton = ({ onPress }) => (
  <View
    style={{
      alignItems: 'center',
      marginTop: 10
    }}
  >
    <TouchableOpacity
      style={{
        backgroundColor: '#53D6C2',
        height: 40,
        width: 120,
        borderRadius: 20,
        justifyContent: 'center',
        alignItems: 'center'
      }}
      onPress={onPress}
    >
      <Text style={{ color: '#ffffff' }}>SUBMIT ></Text>
    </TouchableOpacity>
  </View>
);

export default class ConsentScreen extends Component {
  state = {
    showLoader: false,
    modalVisible: false,
    accessToken: null,
    contact: {},
    signature: null,
    slgc_consenthavebeenexplainedproperly: false,
    slgc_consenttoactonbehalfwith: false,
    slgc_consenttocommunicatewith: false,
    slgc_consenttosupport: false,
    consent: [
      {
        name: 'Consent to Support',
        value: 'slgc_consenttosupport',
        checked: false
      },
      {
        name: 'Consent to Communicate with',
        value: 'slgc_consenttocommunicatewith',
        checked: false
      },
      {
        name: 'Consent to act on behalf with',
        value: 'slgc_consenttoactonbehalfwith',
        checked: false
      },
      {
        name: 'Consent have been explained properly',
        value: 'slgc_consenthavebeenexplainedproperly',
        checked: false
      }
    ]
  };

  constructor() {
    super();
    this.signView = React.createRef();
  }

  componentDidMount() {
    AsyncStorage.getItem('@vss_consent_token').then(data => {
      if (data) {
        const tokenData = JSON.parse(data);
        this.setState(
          {
            accessToken: tokenData.accessToken
          },
          () => {
            refreshToken: tokenData.refreshToken;
            if (new Date(tokenData.accessTokenExpirationDate < new Date())) {
              // this.refreshOldGetNew();
            } else {
            }
            const { navigation } = this.props;
            const { params } = navigation.state;
            console.log(params);
            if (params.contact) {
              this.setState({ contact: params.contact });
              // this.retrieveConsent(params.contact.contactid);
            }
          }
        );
      }
    });
  }

  retrieveConsent = contactId => {
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
    axios
      .get(
        `https://vss.crm11.dynamics.com/api/data/v9.0/slgc_consents?$select=entityimage, slgc_consenttosupport, slgc_consenttocommunicatewith, slgc_consenttoactonbehalfwith, slgc_consenthavebeenexplainedproperly&$filter=_slgc_contact_value eq ${contactId}`,

        config
      )
      .then(data => {
        console.log('consent', data);
        const consent = data.data.value[0];
        if (consent.length) {
          this.setState({ consent: consent });
        }
      })
      .catch(error => {
        console.log(error.response);
      });
    //&$filter=slgc_contact_slgc_consent_Contact/contactid%20eq%2099db51a2-c34e-e111-bb8d-00155d03a715
    // & $filter=slgc_contact eq '99db51a2-c34e-e111-bb8d-00155d03a715'
  };

  createConsent = contact => {
    this.setState({ showLoader: true });
    const config = {
      headers: {
        Authorization: 'Bearer ' + this.state.accessToken,
        'OData-Version': '4.0',
        'OData-MaxVersion': '4.0',
        'Content-Type': 'application/json; charset=utf-8',
        accept: 'application/json',
        Prefer: 'odata.include-annotations=*'
        // MSCRMCallerID: contactId
      }
    };
    const data = {
      subject: contact.fullname,
      slgc_consenttosupport: this.state.slgc_consenttosupport,
      slgc_consenttocommunicatewith: this.state.slgc_consenttocommunicatewith,
      slgc_consenttoactonbehalfwith: this.state.slgc_consenttoactonbehalfwith,
      slgc_consenthavebeenexplainedproperly: this.state
        .slgc_consenthavebeenexplainedproperly,
      entityimage: `${this.state.signature}`,
      'slgc_Contact_slgc_consent@odata.bind': `/contacts(${contact.contactid})`
      // data:image/png;base64,
    };
    console.log(this.state);
    console.log(data);
    axios
      .post(
        'https://vss.crm11.dynamics.com/api/data/v9.0/slgc_consents',
        JSON.stringify(data),
        config
      )
      .then(data => {
        console.log(data);
        this.setState({ showLoader: false });

        if (data.status === 204 || data.status === 200) {
          Alert.alert(
            'Successful',
            'Consent saved successfully',
            [
              {
                text: 'Ok',
                onPress: () => {
                  this.props.navigation.goBack();
                }
              }
            ],
            { cancelable: false }
          );
        }
      })
      .catch(error => {
        this.setState({ showLoader: false });
        console.log(error.response);
      });
  };

  updateConsent = consentId => {
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
    axios
      .put(
        `https://vss.crm11.dynamics.com/api/data/v9.0/slgc_consents(${consentId})/slgc_consenthavebeenexplainedproperly`,
        { value: true },
        config
      )
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.log(error.response);
      });
  };

  clearSignature = () => {
    if (this.signView && this.signView.current) {
      this.signView.current.clearSignature();
    }
  };

  onChangeInSign = base64StringOfSign => {
    if (base64StringOfSign) {
      console.log('Signature Available', base64StringOfSign);
      this.setState({ signature: base64StringOfSign });
    } else {
      console.log('No Signature');
    }
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  updateConsentList = updateConsent => {
    console.log('cons', updateConsent);
    if (updateConsent) {
      this.setState({
        slgc_consenthavebeenexplainedproperly: updateConsent[3].checked,
        slgc_consenttoactonbehalfwith: updateConsent[2].checked,
        slgc_consenttocommunicatewith: updateConsent[1].checked,
        slgc_consenttosupport: updateConsent[0].checked
      });
    }
  };

  render() {
    const { modalVisible, contact, showLoader } = this.state;

    return (
      <View style={styles.container}>
        <View style={styles.userProfile}>
          {contact.fullname ? (
            <Text style={{ color: '#ffffff', fontSize: 20 }}>
              {contact.fullname}
            </Text>
          ) : null}

          {contact.emailaddress1 ? (
            <Text style={{ color: '#ffffff', lineHeight: 16 }}>
              {contact.emailaddress1}
            </Text>
          ) : null}

          {contact.address1_composite ? (
            <Text style={{ color: '#ffffff', lineHeight: 16 }}>
              {contact.address1_composite}
            </Text>
          ) : null}

          <View style={styles.iconWrapper}>
            {contact.mobilityissue ? (
              <View>
                <Image
                  source={require('../../assets/WheelchairWhite.png')}
                  style={{ width: 20, height: 20, marginRight: 5 }}
                />
              </View>
            ) : null}
            {contact.slgc_riskassessment ? (
              <View>
                {contact[
                  'slgc_riskassessment@OData.Community.Display.V1.FormattedValue'
                ] === 'Amber' ? (
                  <View>
                    <Image
                      source={require('../../assets/AmberIcon.png')}
                      style={{ width: 20, height: 20, marginRight: 5 }}
                    />
                  </View>
                ) : null}
                {contact[
                  'slgc_riskassessment@OData.Community.Display.V1.FormattedValue'
                ] === 'Green' ? (
                  <View>
                    <Image
                      source={require('../../assets/GreenIcon.png')}
                      style={{ width: 20, height: 20, marginRight: 5 }}
                    />
                  </View>
                ) : null}
                {contact[
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
            {contact.slgc_mentalhealth ? (
              <View>
                <Image
                  source={require('../../assets/MentalHealthWhite.png')}
                  style={{ width: 20, height: 20, marginRight: 5 }}
                />
              </View>
            ) : null}
            {contact.slgc_companionrequired ? (
              <View>
                <Image
                  source={require('../../assets/PlusOneWhite.png')}
                  style={{ width: 20, height: 20, marginRight: 5 }}
                />
              </View>
            ) : null}
            {contact.slgc_interpreter &&
            contact[
              'slgc_interpreter@OData.Community.Display.V1.FormattedValue'
            ] !== 'None' ? (
              <Image
                source={require('../../assets/TranslatorWhite.png')}
                style={{ width: 20, height: 20, marginRight: 5 }}
              />
            ) : null}
            {contact.slgc_supportpreferences ? (
              <View>
                <Image
                  source={require('../../assets/MeetingWhite.png')}
                  style={{ width: 20, height: 20, marginRight: 5 }}
                />
              </View>
            ) : null}
            {contact.slgc_specialcontactinformation ? (
              <View>
                <Image
                  source={require('../../assets/WarningWhite.png')}
                  style={{ width: 20, height: 20, marginRight: 5 }}
                />
              </View>
            ) : null}
          </View>
        </View>
        <View style={styles.consentSignatureWrapper}>
          <View style={styles.consentTitle}>
            <Text style={{ fontSize: 16 }}>CONSENT</Text>
          </View>
          <ConsentCheckList
            consentList={this.state.consent}
            getUpdateList={this.updateConsentList}
          />
          <View
            style={{
              flexDirection: 'row',
              paddingVertical: 10,
              justifyContent: 'space-between'
            }}
          >
            <Text style={{ fontSize: 16 }}>SIGNATURE</Text>
            <TouchableOpacity onPress={this.clearSignature}>
              <Text>CLEAR</Text>
            </TouchableOpacity>
          </View>
          <SignatureView
            onChangeInSign={this.onChangeInSign}
            style={styles.signBox}
            strokeWidth={2}
            signatureColor="#000"
            strokeWidth={1}
            ref={this.signView}
          />
          {/* <SignaturePad setModalVisible={() => this.setModalVisible(true)} /> */}
        </View>
        {showLoader === true ? (
          <View>
            <ActivityIndicator />
          </View>
        ) : null}
        <SubmitButton
          onPress={() => {
            this.createConsent(contact);
          }}
        />
      </View>
    );
  }
}
