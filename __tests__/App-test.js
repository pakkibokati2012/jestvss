/**
 * @format
 */

import 'react-native';
import React from 'react';
import App from '../src';
import { mount, render } from 'enzyme';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';
it('renders correctly', () => {
  renderer.create(<App />);
});

jest.mock('react-navigation', () => {
  return {
    createAppContainer: jest
      .fn()
      .mockReturnValue(function NavigationContainer(props) {
        return null;
      }),
    createDrawerNavigator: jest.fn(),
    createMaterialTopTabNavigator: jest.fn(),
    createStackNavigator: jest.fn(),
    createSwitchNavigator: jest.fn(),
    StackActions: {
      push: jest
        .fn()
        .mockImplementation(x => ({ ...x, type: 'Navigation/PUSH' })),
      replace: jest
        .fn()
        .mockImplementation(x => ({ ...x, type: 'Navigation/REPLACE' }))
    },
    NavigationActions: {
      navigate: jest.fn().mockImplementation(x => x)
    }
  };
});

it('can add a Todo with Enzyme', () => {
  console.log('using enzyme');
  const wrapper = render(<App />);
});
