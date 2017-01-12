module.exports = function(config) {
	config.set({
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
      'test/unit/**/*.js': ['webpack']
    },
		browsers: ["PhantomJS"],
		singleRun: false
	});
};
