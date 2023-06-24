/**
 * React Native Test Render
 * @format
 */

import React from 'react';
import 'react-native';
import App from '../src/App';

// Note: test renderer must be required after react-native.
import renderer from 'react-test-renderer';

// Note: import explicitly to use the types shiped with jest.
import {it} from '@jest/globals';

it('renders correctly', () => {
  renderer.create(<App />);
});
