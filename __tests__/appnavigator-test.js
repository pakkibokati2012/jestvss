/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../src';
import { shallow, mount } from 'enzyme';
import AppNavigator from '../src/navigation/AppNavigator';


it('starts with AuthLoading screen', () => {
  const wrapped = mount(<AppNavigator />);
  console.log(wrapped.text());
});
