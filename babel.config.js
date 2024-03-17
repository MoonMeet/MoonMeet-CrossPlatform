module.exports = {
    presets: ['module:@react-native/babel-preset'], plugins: [['module-resolver', {
        root: ['./src'], extensions: ['.tsx', '.ts', '.d.ts', '.jsx', '.js', '.json', '.png'], alias: {
            tests: ['./__tests__/'], "@components": "./src/components", "*": "src/*"
        }
    }], 'babel-plugin-styled-components', 'react-native-reanimated/plugin'],
};
