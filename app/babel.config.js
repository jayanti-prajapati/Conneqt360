module.exports = {
    presets: ['babel-preset-expo'], // or 'module:metro-react-native-babel-preset' for bare RN
    plugins: [
        ['module:react-native-dotenv', {
            moduleName: '@env',
            path: '.env',
        }],
    ],
};
