/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../src';
import { shallow } from 'enzyme';
import AppNavigator from '../src/navigation/AppNavigator';

it('loads app navigator', () => {
  const wrapped = shallow(<App />);
  expect(wrapped.find(AppNavigator).length).toEqual(1);
});
