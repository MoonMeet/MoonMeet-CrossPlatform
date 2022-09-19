module.exports = {
  presets: [
    'module:metro-react-native-babel-preset',
    '@babel/preset-flow',
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  plugins: ['react-native-reanimated/plugin', 'babel-plugin-styled-components'],
};
