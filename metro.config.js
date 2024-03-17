const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */

const defaultConfig = getDefaultConfig(__dirname);
const modifiedConfig = {
  resolver: {
    assetExts: [
      'bmp',
      'gif',
      'jpg',
      'jpeg',
      'png',
      'psd',
      'svg',
      'webp',
      'json',
      'mov',
      'mp4',
      'mpeg',
      'mpg',
      'webm',
      'flv',
      'mkv',
      'm4v',
      'avi',
      'mp3',
      'flac',
      'm4a',
      'ogg',
      'wav',
      'wma',
      'ttf',
      'otf',
      'eot',
      'woff',
      'woff2',
    ],
  },
};

module.exports = mergeConfig(defaultConfig, modifiedConfig);
