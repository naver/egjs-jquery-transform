/*!
 * Copyright (c) 2017 undefined
 * @egjs/transform projects are licensed under the MIT license
 * 
 * @egjs/transform JavaScript library
 * 
 * 
 * @version 2.0.0-rc.1
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["transform"] = factory();
	else
		root["eg"] = root["eg"] || {}, root["eg"]["transform"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
var win = typeof window !== "undefined" && window || {};

exports.window = win;
var jQuery = exports.jQuery = win.jQuery;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.rateFn = exports.toMatrix = exports.toMatrix3d = undefined;

var _browser = __webpack_require__(0);

var $ = _browser.jQuery;

/**
 * Convert matrix string to array type.
 *
 * eg. matrix(1, 0, 0, 1, 0, 0) ==>  ["matrix", [1, 0, 0, 1, 0, 0]]
 * matrix3d(1,0,0,0,0,1,-2.44929e-16,0,0,2.44929e-16,1,0,0,0,0,1)
 */
function toMatrixArray(matrixStr) {
	if (!matrixStr || matrixStr === "none") {
		return ["matrix", ["1", "0", "0", "1", "0", "0"]];
	}

	var matched = matrixStr.replace(/\s/g, "").match(/(matrix)(3d)*\((.*)\)/);

	return [matched[1] + (matched[2] || ""), matched[3].split(",")];
}

function toMatrix3d(matrix) {
	var name = matrix[0];
	var val = matrix[1];

	if (name === "matrix3d") {
		return matrix;
	}

	// matrix(a, b, c, d, tx, ty) is a shorthand for matrix3d(a, b, 0, 0, c, d, 0, 0, 0, 0, 1, 0, tx, ty, 0, 1)
	return [name + "3d", [val[0], val[1], "0", "0", val[2], val[3], "0", "0", "0", "0", "1", "0", val[4], val[5], "0", "1"]];
}

function unit(name) {
	var ret = void 0;

	if (name.indexOf("translate") >= 0) {
		ret = "px";
	} else if (name.indexOf("rotate") >= 0) {
		ret = "deg";
	} else {
		ret = "";
	}
	return ret;
}

/**
 * Get a 'px' converted value if it has a %.
 * Otherwise it returns value appened with 'px'.
 */
function getConverted(val, base) {
	var ret = val;
	var num = val.match(/((-|\+)*[0-9]+)%/);

	if (num && num.length >= 1) {
		ret = base * (parseFloat(num[1]) / 100) + "px";
	} else if (val.indexOf("px") === -1) {
		ret = val + "px";
	}

	return ret;
}

/**
 * Parse a transform atom value.
 *
 * "30px" --> {num: 30, unit: "px"}
 *
 * Because calculation of string number is heavy,
 * In advance, convert a string number to a float number with an unit for the use of transformByPos,
 * which is called very frequently.
 */
function toParsedFloat(val) {
	var m = val.match(/((-|\+)*[\d|.]+)(px|deg|rad)*/);
	var ret = void 0;

	if (m && m.length >= 1) {
		ret = { "num": parseFloat(m[1]), "unit": m[3] };
	}
	return ret;
}

function correctUnit(transform, width, height) {
	var m = void 0;
	var ret = "";
	var arr = transform.split(")");

	for (var i = 0, len = arr.length - 1; i < len; i++) {
		var name = arr[i];

		// '%' is only meaningful on translate.
		if ((m = name.match(/(translate([XYZ]|3d)?|rotate)\(([^)]*)/)) && m.length > 1) {
			if (m[1] === "rotate") {
				if (m[3].indexOf("deg") === -1) {
					name = m[1] + "(" + m[3] + "deg";
				}
			} else {
				// 2d, 3d
				var nums = m[3].split(",");
				var bases = [width, height, 100];

				switch (m[2]) {
					case "X":
						name = m[1] + "(" + getConverted(m[3], width);
						break;
					case "Y":
						name = m[1] + "(" + getConverted(m[3], height);
						break;
					case "Z":
						// Meaningless. Do nothing
						break;
					default:
						for (var k = 0, l = nums.length; k < l; k++) {
							nums[k] = getConverted(nums[k], bases[k]);
						}
						name = m[1] + "(" + nums.join(",");
						break;
				}
			}
		}

		name = " " + name + ")";
		ret += name;
	}

	// Remove wrong '%'s and '+=' because it cannot be translated to a matrix.
	ret = ret.replace("%", "").replace("+=", "");
	return ret;
}

// ["translate" , ["10", "20"]]
function parseStyle(property) {
	var m = property.match(/(\b\w+?)\((\s*[^)]+)/);
	var name = void 0;
	var value = void 0;
	var result = ["", ""];

	if (m && m.length > 2) {
		name = m[1];
		value = m[2].split(",");
		value = $.map(value, function (v) {
			return $.trim(v);
		});
		result = [$.trim(name), value];
	}
	return result;
}

function getTransformGenerateFunction(transform) {
	var splitted = transform.split(")");
	var list = [];

	// Make parsed transform list.
	for (var i = 0, len = splitted.length - 1; i < len; i++) {
		var parsed = parseStyle(splitted[i]);

		parsed[1] = $.map(parsed[1], toParsedFloat);
		list.push(parsed);
	}

	var transformByPos = function transformByPos(pos) {
		var ret = "";
		var defaultVal = 0;

		$.each(list, function (i) {
			if (list[i][0].indexOf("scale") >= 0) {
				defaultVal = 1;
			} else {
				defaultVal = 0;
			}

			var valStr = $.map(list[i][1], function (value) {
				var val = value.num;

				defaultVal === 1 && (val -= 1);
				return defaultVal + val * pos + (value.unit || "");
			}).join(",");

			ret += list[i][0] + "(" + valStr + ") ";
		});

		return ret;
	};

	return transformByPos;
}

/**
 * ["translate", [100, 0]] --> translate(100px, 0)
 * {translate : [100, 0]} --> translate(100px, 0)
 * {matrix : [1, 0, 1, 0, 100, 0]} --> matrix(1, 0, 1, 0, 100, 0)
 */
function data2String(property) {
	var name = void 0;
	var tmp = [];

	if ($.isArray(property)) {
		name = property[0];
		var valExpression = property[1].join(unit(name) + ",");

		return name + "(" + valExpression + unit(name) + ")";
	} else {
		for (name in property) {
			tmp.push(name);
		}
		return $.map(tmp, function (v) {
			return v + "(" + property[v] + unit(v) + ")";
		}).join(" ");
	}
}

function rateFn(element, startTf, endTf) {
	var isRelative = endTf.indexOf("+=") >= 0;
	var start = void 0;
	var end = void 0;
	var basePos = void 0;

	// Convert translate unit to 'px'.
	var endTfInPixel = correctUnit(endTf, parseFloat($.css(element, "width")) || 0, parseFloat($.css(element, "height")) || 0);

	if (isRelative) {
		start = !startTf || startTf === "none" ? "matrix(1, 0, 0, 1, 0, 0)" : startTf;
		end = getTransformGenerateFunction(endTfInPixel);
	} else {
		start = toMatrixArray(startTf);
		basePos = toMatrixArray("none"); // transform base-position

		// If the type of matrix is not equal, then match to matrix3d
		if (start[1].length < basePos[1].length) {
			start = toMatrix3d(start);
		} else if (start[1].length > basePos[1].length) {
			basePos = toMatrix3d(basePos);
		}

		end = getTransformGenerateFunction(endTfInPixel);
	}

	return function (pos) {
		var result = [];
		var ret = ""; // matrix for interpolated value from current to base(1, 0, 0, 1, 0, 0)

		if (isRelative) {
			// This means a muliply between a matrix and a transform.
			return start + end(pos);
		}

		if (pos === 1) {
			ret = data2String(basePos);
		} else {
			for (var i = 0, s, e, l = start[1].length; i < l; i++) {
				s = parseFloat(start[1][i]);
				e = parseFloat(basePos[1][i]);

				result.push(s + (e - s) * pos);
			}

			ret = data2String([start[0], result]);
		}
		return ret + end(pos);
	};
}

exports.toMatrix3d = toMatrix3d;
exports.toMatrix = toMatrixArray;
exports.rateFn = rateFn;

/***/ })
/******/ ]);
});
//# sourceMappingURL=transform.js.map