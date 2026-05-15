require('react-native-gesture-handler/jestSetup');

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest'),
);

jest.mock('react-native-video', () => {
  const React = require('react');
  const { View } = require('react-native');
  return function MockVideo() {
    return React.createElement(View, { testID: 'mock-video' });
  };
});
