/**
 * Copyright (c) NAVER Corp.
 * eg.transform projects are licensed under the MIT license
 */


/**
 * Extends jQuery animate in order to use "transform" property
 * @class
 * @name eg.Transform

 * @group egjs
 */
export class Transform {
	constructor(jQuery) {
		if (!jQuery) {
			console.warn("jQuery is not defined.");
			return;
		}

		this.$ = jQuery;

		this.$.fx.step.transform = (fx) => {
			fx.rateFn = fx.rateFn || this.rateFn(fx.elem, fx.start, fx.end);
			this.$.style(fx.elem, "transform", fx.rateFn(fx.pos));
		};
	}

	/**
	 * Get a 'px' converted value if it has a %.
	 * Otherwise it returns value appened with 'px'.
	 */
	getConverted(val, base) {
		var ret = val;
		var num = val.match(/((-|\+)*[0-9]+)%/);

		if (num && num.length >= 1) {
			ret = base * (parseFloat(num[1]) / 100) + "px";
		} else if (val.indexOf("px") === -1) {
			ret = val + "px";
		}

		return ret;
	}

	correctUnit(transform, width, height) {
		var m;
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
					switch (m[2]) {
					case "X":
						name = m[1] + "(" + this.getConverted(m[3], width);
						break;
					case "Y":
						name = m[1] + "(" +  this.getConverted(m[3], height);
						break;
					case "Z":

						//Meaningless. Do nothing
						break;
					default://2d, 3d
						var nums = m[3].split(",");
						var bases = [width, height, 100];

						for (var k = 0, l = nums.length; k < l; k++) {
							nums[k] = this.getConverted(nums[k], bases[k]);
						}
						name = m[1] + "(" + nums.join(",");
						break;
					}
				}
			}

			name = " " + name + ")";
			ret += name;
		}

		//Remove wrong '%'s and '+=' because it cannot be translated to a matrix.
		ret = ret.replace("%", "").replace("+=", "");
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
	toParsedFloat(val) {
		var m = val.match(/((-|\+)*[\d|\.]+)(px|deg|rad)*/);
		if (m && m.length >= 1) {
			return {"num": parseFloat(m[1]), "unit": m[3]};
		}
	}

	getTransformGenerateFunction(transform) {
		var splitted = transform.split(")");
		var list = [];
		var transformByPos;//fn

		//Make parsed transform list.
		for (var i = 0, len = splitted.length - 1; i < len; i++) {
			var parsed = this.parseStyle(splitted[i]);

			parsed[1] = this.$.map(parsed[1], this.toParsedFloat);
			list.push(parsed);
		}

		transformByPos = pos => {
			var transform = "";
			var defaultVal = 0;

			this.$.each(list, (i) => {
				if (list[i][0].indexOf("scale") >= 0) {
					defaultVal = 1;
				} else {
					defaultVal = 0;
				}

				var valStr = this.$.map(list[i][1], (value) => {
					var val = value.num;
					defaultVal === 1 && (val = val - 1);
					return (defaultVal + val * pos) + (value.unit || "");
				}).join(",");

				transform += list[i][0] + "(" + valStr + ") ";
			});

			return transform;
		};

		return transformByPos;
	}

	rateFn(element, startTf, endTf) {
		var isRelative = endTf.indexOf("+=") >= 0;
		var start;
		var end;
		var basePos;

		// Convert translate unit to 'px'.
		endTf = this.correctUnit(endTf,
					parseFloat(this.$.css(element, "width")) || 0,
					parseFloat(this.$.css(element, "height")) || 0);

		if (isRelative) {
			start = (!startTf || startTf === "none") ?
						"matrix(1, 0, 0, 1, 0, 0)" : startTf;
			end = this.getTransformGenerateFunction(endTf);
		} else {
			start = this.toMatrixArray(startTf);
			basePos = this.toMatrixArray("none");//transform base-position

			//If the type of matrix is not equal, then match to matrix3d
			if (start[1].length < basePos[1].length) {
				start = this.toMatrix3d(start);
			} else if (start[1].length > basePos[1].length) {
				basePos = this.toMatrix3d(basePos);
			}

			end = this.getTransformGenerateFunction(endTf);
		}

		return (pos) => {
			var result = [];
			var ret = "";//matrix for interpolated value from current to base(1, 0, 0, 1, 0, 0)

			if (isRelative) {
				// This means a muliply between a matrix and a transform.
				return start + end(pos);
			}

			if (pos === 1) {
				ret = this.data2String(basePos);
			} else {
				for (var i = 0, s, e, l = start[1].length; i < l; i++) {
					s = parseFloat(start[1][i]);
					e = parseFloat(basePos[1][i]);

					result.push(s + (e - s) * pos);
				}

				ret = this.data2String([start[0], result]);
			}

			return ret + end(pos);
		};
	}

	/**
	 * ["translate", [100, 0]] --> translate(100px, 0)
	 * {translate : [100, 0]} --> translate(100px, 0)
	 * {matrix : [1, 0, 1, 0, 100, 0]} --> matrix(1, 0, 1, 0, 100, 0)
	 */
	data2String(property) {
		var name;
		var tmp = [];

		if (this.$.isArray(property)) {
			name = property[0];
			return name + "(" + property[1].join(this.unit(name) + ",") + this.unit(name) + ")";
		} else {
			for (name in property) {
				tmp.push(name);
			}

			return this.$.map(tmp, function(v) {
				return v + "(" +  property[v] + this.unit(v) + ")";
			}).join(" ");
		}
	}

	unit(name) {
		return name.indexOf("translate") >= 0 ?
				"px" : name.indexOf("rotate") >= 0 ? "deg" : "";
	}

	// ["translate" , ["10", "20"]]
	parseStyle(property) {
		var m = property.match(/(\b\w+?)\((\s*[^\)]+)/);
		var name;
		var value;
		var result = ["",""];

		if (m && m.length > 2) {
			name = m[1];
			value = m[2].split(",");
			value = this.$.map(value, (v) => {
				return this.$.trim(v);
			});
			result = [ this.$.trim(name), value ];
		}
		return result;
	}

	/**
	 * Convert matrix string to array type.
	 *
	 * eg. matrix(1, 0, 0, 1, 0, 0) ==>  ["matrix", [1, 0, 0, 1, 0, 0]]
	 * matrix3d(1,0,0,0,0,1,-2.44929e-16,0,0,2.44929e-16,1,0,0,0,0,1)
	 */
	toMatrixArray(matrixStr) {
		var matched;

		if (!matrixStr || matrixStr === "none") {
			return ["matrix", [ "1", "0", "0", "1", "0", "0"] ];
		}

		matrixStr = matrixStr.replace(/\s/g, "");
		matched = matrixStr.match(/(matrix)(3d)*\((.*)\)/);

		return [matched[1] + (matched[2] || ""), matched[3].split(",")];
	}

	toMatrix3d(matrix) {
		var name = matrix[0];
		var val = matrix[1];

		if (name === "matrix3d") {
			return matrix;
		}

		// matrix(a, b, c, d, tx, ty) is a shorthand for matrix3d(a, b, 0, 0, c, d, 0, 0, 0, 0, 1, 0, tx, ty, 0, 1)
		return [
			name + "3d", [val[0], val[1], "0", "0",
						val[2], val[3], "0", "0",
						"0", "0", "1", "0",
						val[4], val[5], "0", "1"]
		];
	}
}

let trsf = new Transform($ || jQuery);
const toMatrix = trsf.toMatrixArray;
const toMatrix3d = trsf.toMatrix3d;
export { toMatrix3d, toMatrix };
