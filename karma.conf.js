module.exports = function(config) {
	config.set({
		frameworks: ["qunit"],
		files: [
			// vendor files
			"node_modules/jquery/dist/jquery.js",
			// src files
			"dist/eg.transform.test.js"
		],
		browsers: ["PhantomJS"],
		singleRun: true
	});
};
