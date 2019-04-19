/**
 * @format
 */

import 'react-native';
import React from 'react';
import AppNavigator from '../src/navigation/AppNavigator';
import renderer from 'react-test-renderer';

test('AppNavigator Snapshot Testing', () => {
  const snap = renderer.create(<AppNavigator />).toJSON();
  expect(snap).toMatchSnapshot();
});
