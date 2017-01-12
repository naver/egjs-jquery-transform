module.exports = function(config) {
	var karmaConfig = {
		// test results reporter to use
    // possible values: 'dots', 'progress'
    // available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters:['dots', 'progress'],
		browsers: [],
		frameworks: ['qunit'],
		files: [
			// vendor files
			'node_modules/jquery/dist/jquery.min.js',
			'node_modules/lite-fixture/index.js',
			// src files
			{pattern: "test/unit/**/*.js"}
		],
		webpack: {
			devtool: 'source-map',
			module: {
				rules: [
					{
            test: /(\.js)$/,
            exclude: /(node_modules)/,
            loader: 'babel-loader'
					}
				]
			}
		},
		// // preprocess matching files before serving them to the browser
    // // available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {
      'test/unit/**/*.js': config.coverage ? ['webpack'] : ['webpack', 'sourcemap']
    }
	};

	if(config.coverage) {
    karmaConfig.reporters.push("coverage");
    karmaConfig.coverageReporter = {
        type: 'html',
        dir: 'coverage'
    };
    karmaConfig.browsers.push("PhantomJS");
    karmaConfig.webpack.module.rules.push(
      {
        test: /(\.js)$/,
        exclude: /(test|node_modules)/,
        enforce: "pre",
        loader: 'isparta-loader'
      }
    );
    // Continuous Integration mode
    // if true, Karma captures browsers, runs the tests and exits
    karmaConfig.singleRun = true;
  } else {
    karmaConfig.browsers.push("Chrome");
    karmaConfig.singleRun = false;
  }

  config.set(karmaConfig);
};
