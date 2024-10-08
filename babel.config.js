module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      'react-native-paper/babel',
      ['module-resolver',
      {
        root: ['./'],
        alias: {
          '@root': './',
          '@app': './src/app',
          '@components': './src/components',
          '@theme': './src/theme',
        },
      },
    ],],
  };
};
