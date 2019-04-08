import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
  listWrapper: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 1
  },
  checkboxWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginTop: 10
  },
  checkbox: {
    width: 20,
    height: 20,
    backgroundColor: '#E6E6E6',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center'
  },
  tick: {
    width: 14,
    height: 14
  }
});

export default class ConsentList extends Component {
  state = {
    consentList: []
  };

  componentDidMount() {
    const { consentList } = this.props;
    this.setState({ consentList: consentList });
  }

  toggleConsent = consentName => {
    const { consentList } = this.state;
    const updatedConsentList = consentList.map(consent => {
      if (consentName === consent.name) {
        return {
          name: consent.name,
          checked: !consent.checked
        };
      }
      return consent;
    });

    this.props.getUpdateList(updatedConsentList);
    this.setState({
      consentList: updatedConsentList
    });
  };

  render() {
    const { consentList } = this.state;

    return (
      <View style={styles.listWrapper}>
        {consentList.map((consent, index) => (
          <TouchableOpacity
            key={index.toString()}
            style={[
              styles.checkboxWrapper,
              {
                marginBottom: index === consentList.length - 1 ? 20 : 0
              }
            ]}
            onPress={() => this.toggleConsent(consent.name)}
          >
            <View style={styles.checkbox}>
              {consent.checked ? (
                <Image
                  style={styles.tick}
                  source={require('../../assets/tick.png')}
                />
              ) : null}
            </View>
            <Text style={{ fontSize: 16 }}>{consent.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  }
}
