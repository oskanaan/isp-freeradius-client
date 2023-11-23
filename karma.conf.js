// karma.conf.js
module.exports = function(config) {
  config.set({
    frameworks: ['mocha', 'chai'],
    files: [
      'test/**/*.spec.js'
    ],
    preprocessors: {
      'test/**/*.spec.js': ['webpack']
    },
    webpack: require('./webpack.config.js'),
    reporters: ['progress'],
    browsers: ['ChromeHeadless'],
    singleRun: true,
  });
};
