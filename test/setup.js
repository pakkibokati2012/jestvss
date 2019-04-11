import { NativeModules as RNNativeModules } from 'react-native';
import 'react-native';
import 'jest-enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Enzyme from 'enzyme';

RNNativeModules.RNCAsyncStorage = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  mergeItem: jest.fn(),
  clear: jest.fn(),
  getAllKeys: jest.fn(),
  flushGetRequests: jest.fn(),
  multiGet: jest.fn(),
  multiSet: jest.fn(),
  multiRemove: jest.fn(),
  multiMerge: jest.fn()
};

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

Enzyme.configure({ adapter: new Adapter() });
