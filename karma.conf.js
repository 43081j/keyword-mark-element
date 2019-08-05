process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['mocha', 'chai'],
    files: [
      {
        pattern: 'lib/test/**/*_test.js',
        type: 'module'
      },
      {
        pattern: 'lib/**/*.js',
        served: true,
        included: false
      }
    ],
    reporters: ['progress'],
    browsers: ['ChromeHeadless']
  })
}
