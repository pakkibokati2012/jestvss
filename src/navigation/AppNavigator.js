import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import AuthLoadingScreen from '../screens/authentication/AuthLoadingScreen';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      Auth: AuthNavigator,
      Main: MainNavigator
    },
    {
      initialRouteName: 'AuthLoading'
    }
  )
);
