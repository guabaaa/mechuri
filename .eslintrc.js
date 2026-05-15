module.exports = {
  root: true,
  extends: '@react-native',
  ignorePatterns: [
    'node_modules/',
    'vendor/',
    'ios/Pods/',
    'android/build/',
    'android/.gradle/',
    'coverage/',
    'patches/',
  ],
  overrides: [
    {
      files: [
        'jest.setup.js',
        'jest.config.js',
        '.eslintrc.js',
        '.prettierrc.js',
        'babel.config.js',
        'metro.config.js',
      ],
      env: {
        node: true,
        jest: true,
      },
    },
  ],
  rules: {
    // 테마·조건부 색상은 인라인 스타일이 일반적
    'react-native/no-inline-styles': 'off',
    // React Navigation tabBarIcon 등 props 콜백 패턴
    'react/no-unstable-nested-components': [
      'warn',
      { allowAsProps: true },
    ],
  },
};
