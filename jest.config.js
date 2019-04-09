module.exports = {
  preset: 'react-native',
  verbose: true,
  transformIgnorePatterns: [
    '/node_modules/@react-native-community/async-storage/(?!(lib))'
  ],
  setupFilesAfterEnv: ['./test/setup.js']
};
