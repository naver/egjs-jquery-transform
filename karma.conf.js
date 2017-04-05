module.exports = function(config) {
	var karmaConfig = {
		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		frameworks: ['mocha', 'chai', 'sinon'],

		files: [
			'./node_modules/phantomjs-polyfill/bind-polyfill.js',
			'./node_modules/phantomjs-polyfill-object-assign/object-assign-polyfill.js',
			// vendor files
			'./node_modules/jquery/dist/jquery.min.js',
			'./node_modules/lite-fixture/index.js',
			// src files
			'./test/**/*.spec.js'
		],

		client: {
			mocha: {
				opts: './mocha.opts'
			}
		},

		webpack: {
			devtool: 'inline-source-map',
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

		// preprocess matching files before serving them to the browser
		// available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
		preprocessors: {
			'./test/**/*.spec.js': config.coverage ? ['webpack'] : ['webpack', 'sourcemap']
		},

		// test results reporter to use
		// possible values: 'dots', 'progress'
		// available reporters: https://npmjs.org/browse/keyword/karma-reporter
		reporters: ['mocha'],

		// start these browsers
		// available browser launchers: https://npmjs.org/browse/keyword/karma-launcher
		browsers: [],

		webpackServer: {
			noInfo: true
		},

		webpackMiddleware: {
			noInfo: true
		}
	};

	karmaConfig.browsers.push(config.chrome ? "Chrome" : "PhantomJS");

	if(config.coverage) {
		karmaConfig.reporters.push('coverage-istanbul');
		karmaConfig.coverageIstanbulReporter = {
			reports: [ 'text-summary', 'html'],
			dir: './coverage'
		};

		karmaConfig.webpack.module.rules.unshift({
        test: /\.js$/,
        exclude: /(node_modules|test)/,
        loader: 'istanbul-instrumenter-loader'
    });
    karmaConfig.singleRun = true;
	}

	config.set(karmaConfig);
};
