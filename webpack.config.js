var webpack = require("webpack");

module.exports = {
	entry: {
		"transform": "./src/transform.js",
		"transform.min": "./src/transform.js",
		"transform.test": "./test/unit/js/test.js"
	},
	output: {
		path: __dirname + "/dist",
		filename: "[name].js",
		library: ["eg", "Transform"],
		libraryTarget: "umd"
	},
	devServer: {
		publicPath: "/dist/"
	},
	devtool: "source-map",
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: "babel-loader",
			options: {
		  		presets: ["es2015"]
			}
		}]
	},
	plugins: [
		new webpack.optimize.UglifyJsPlugin({
			include: /\.min\.js$/,
			minimize: true
		})
	]
};
