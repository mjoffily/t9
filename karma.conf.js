// Karma configuration
// Generated on Sat Aug 29 2015 11:03:44 GMT+0000 (UTC)

module.exports = function(config) {
  config.set({

    // base path that will be used to resolve all patterns (eg. files, exclude)
    basePath: '',

    // frameworks to use
    // available frameworks: https://npmjs.org/browse/keyword/karma-adapter
    frameworks: ['jasmine'],


    // list of files / patterns to load in the browser
    files: [
      '/home/ubuntu/workspace/unit-tests/js/lib/bower_components/angular/angular.js',
      '/home/ubuntu/workspace/unit-tests/js/lib/bower_components/angular-mocks/angular-mocks.js',
      '/home/ubuntu/workspace/unit-tests/js/lib/bower_components/angular-resource/angular-resource.js',
      '/home/ubuntu/workspace/unit-tests/js/lib/bower_components/angular-material/angular-material.js',
      '/home/ubuntu/workspace/unit-tests/js/lib/bower_components/angular-animate/angular-animate.js',
      '/home/ubuntu/workspace/unit-tests/js/lib/bower_components/angular-aria/angular-aria.js',
      '/home/ubuntu/workspace/unit-tests/js/t9Spec.js',
      '/home/ubuntu/workspace/unit-tests/js/DiagramD3Spec.js',
      '/home/ubuntu/workspace/wp-content/themes/twentyfourteen-child/js/_lib/bootstrap-colorpicker-module.js',
      '/home/ubuntu/workspace/wp-content/themes/twentyfourteen-child/js/_lib/ui-bootstrap-tpls-0.12.0.js',
      '/home/ubuntu/workspace/wp-content/themes/twentyfourteen-child/js/_lib/xeditable.js',
      '/home/ubuntu/workspace/wp-content/themes/twentyfourteen-child/js/_lib/angular-ui-router.js',
      '/home/ubuntu/workspace/wp-content/themes/twentyfourteen-child/js/_lib/d3.js',
      '/home/ubuntu/workspace/wp-content/themes/twentyfourteen-child/js/t9.js',
      '/home/ubuntu/workspace/wp-content/themes/twentyfourteen-child/js/controller/MainCtrl.js',
      '/home/ubuntu/workspace/wp-content/themes/twentyfourteen-child/js/controller/DiagramD3Ctrl.js',
      '/home/ubuntu/workspace/wp-content/themes/twentyfourteen-child/js/services/services.js',
      
    ],


    // list of files to exclude
    exclude: [
    ],


    // preprocess matching files before serving them to the browser
    // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
    },


    // test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
    reporters: ['progress'],


    // web server port
    //port: 9876,
    hostname: process.env.IP,
    port: process.env.PORT,



    // enable / disable colors in the output (reporters and logs)
    colors: true,


    // level of logging
    // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
    logLevel: config.LOG_INFO,


    // enable / disable watching file and executing tests whenever any file changes
    autoWatch: true,


    // start these browsers
    // available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
    browsers: ['Chrome'],


    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    singleRun: false
  })
}
