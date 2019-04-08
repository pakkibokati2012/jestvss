import React from 'react';
import { TouchableOpacity, Image } from 'react-native';
import { createStackNavigator } from 'react-navigation';
import Colors from '../constants/colors';
import ContactScreen from '../screens/contact';
import ConsentScreen from '../screens/consent';

const MainStack = createStackNavigator(
  {
    Contact: {
      screen: ContactScreen,
      navigationOptions: {
        headerTitle: 'VSS'
      }
    },
    Consent: {
      screen: ConsentScreen,
      navigationOptions: {
        headerTitle: 'PROFILE'
      }
    }
  },
  {
    initialRouteName: 'Contact',
    defaultNavigationOptions: {
      headerTintColor: '#000000',
      headerStyle: {
        backgroundColor: Colors.primaryColor
      }
    }
  }
);

export default MainStack;
