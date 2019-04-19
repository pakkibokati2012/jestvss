/**
 * @format
 */

import 'react-native';
import React from 'react';
import AuthLoadingScreen from '../src/screens/authentication/AuthLoadingScreen';
import renderer from 'react-test-renderer';

function findElement(tree, testId) {
  console.warn('ooooooooo', tree.children);
  let result = undefined;
  for (node in tree.children) {
    if (tree.children[node].props.testId === testId) {
      result = true;
    }
    return result;
  }
}

it('shows activity indicator', () => {
  const tree = renderer.create(<AuthLoadingScreen />).toJSON();
  expect(findElement(tree, 'activityindicator')).toBeDefined();
});
