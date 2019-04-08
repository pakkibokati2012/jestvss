import React, { Component } from 'react';
import { View, Text } from 'react-native';
import AppNavigator from './navigation/AppNavigator';

// TODO:
// - redux provider
// - load fonts and images before app loading

export default class App extends Component {
  render() {
    return <AppNavigator />;
  }
}
