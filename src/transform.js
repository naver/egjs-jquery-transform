import jQuery from "jquery";

const $ = jQuery;

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

	const matched = matrixStr.replace(/\s/g, "").match(/(matrix)(3d)*\((.*)\)/);

	return [matched[1] + (matched[2] || ""), matched[3].split(",")];
}

function toMatrix3d(matrix) {
	const name = matrix[0];
	const val = matrix[1];

	if (name === "matrix3d") {
		return matrix;
	}

	// matrix(a, b, c, d, tx, ty) is a shorthand for matrix3d(a, b, 0, 0, c, d, 0, 0, 0, 0, 1, 0, tx, ty, 0, 1)
	return [
		`${name}3d`, [val[0], val[1], "0", "0",
			val[2], val[3], "0", "0",
			"0", "0", "1", "0",
			val[4], val[5], "0", "1"],
	];
}

function unit(name) {
	let ret;

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
	let ret = val;
	const num = val.match(/((-|\+)*[0-9]+)%/);

	if (num && num.length >= 1) {
		ret = `${base * (parseFloat(num[1]) / 100)}px`;
	} else if (val.indexOf("px") === -1) {
		ret = `${val}px`;
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
	const m = val.match(/((-|\+)*[\d|.]+)(px|deg|rad)*/);
	let ret;

	if (m && m.length >= 1) {
		ret = {"num": parseFloat(m[1]), "unit": m[3]};
	}
	return ret;
}

function correctUnit(transform, width, height) {
	let m;
	let ret = "";
	const arr = transform.split(")");

	for (let i = 0, len = arr.length - 1; i < len; i++) {
		let name = arr[i];

		// '%' is only meaningful on translate.
		if ((m = name.match(/(translate([XYZ]|3d)?|rotate)\(([^)]*)/)) && m.length > 1) {
			if (m[1] === "rotate") {
				if (m[3].indexOf("deg") === -1) {
					name = `${m[1]}(${m[3]}deg`;
				}
			} else {
				// 2d, 3d
				const nums = m[3].split(",");
				const bases = [width, height, 100];

				switch (m[2]) {
					case "X":
						name = `${m[1]}(${getConverted(m[3], width)}`;
						break;
					case "Y":
						name = `${m[1]}(${getConverted(m[3], height)}`;
						break;
					case "Z":
						// Meaningless. Do nothing
						break;
					default:
						for (let k = 0, l = nums.length; k < l; k++) {
							nums[k] = getConverted(nums[k], bases[k]);
						}
						name = `${m[1]}(${nums.join(",")}`;
						break;
				}
			}
		}

		name = ` ${name})`;
		ret += name;
	}

	// Remove wrong '%'s and '+=' because it cannot be translated to a matrix.
	ret = ret.replace("%", "").replace("+=", "");
	return ret;
}

// ["translate" , ["10", "20"]]
function parseStyle(property) {
	const m = property.match(/(\b\w+?)\((\s*[^)]+)/);
	let name;
	let value;
	let result = ["", ""];

	if (m && m.length > 2) {
		name = m[1];
		value = m[2].split(",");
		value = $.map(value, v => $.trim(v));
		result = [$.trim(name), value];
	}
	return result;
}

function getTransformGenerateFunction(transform) {
	const splitted = transform.split(")");
	const list = [];

	// Make parsed transform list.
	for (let i = 0, len = splitted.length - 1; i < len; i++) {
		const parsed = parseStyle(splitted[i]);

		parsed[1] = $.map(parsed[1], toParsedFloat);
		list.push(parsed);
	}

	const transformByPos = pos => {
		let ret = "";
		let defaultVal = 0;

		$.each(list, i => {
			if (list[i][0].indexOf("scale") >= 0) {
				defaultVal = 1;
			} else {
				defaultVal = 0;
			}

			const valStr = $.map(list[i][1], value => {
				let val = value.num;

				defaultVal === 1 && (val -= 1);
				return (defaultVal + val * pos) + (value.unit || "");
			}).join(",");

			ret += `${list[i][0]}(${valStr}) `;
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
	let name;
	const tmp = [];

	if ($.isArray(property)) {
		name = property[0];
		const valExpression = property[1].join(`${unit(name)},`);

		return `${name}(${valExpression}${unit(name)})`;
	} else {
		for (name in property) {
			tmp.push(name);
		}
		return $.map(tmp, v => `${v}(${property[v]}${unit(v)})`).join(" ");
	}
}

function rateFn(element, startTf, endTf) {
	const isRelative = endTf.indexOf("+=") >= 0;
	let start;
	let end;
	let basePos;

	// Convert translate unit to 'px'.
	const endTfInPixel = correctUnit(endTf,
				parseFloat($.css(element, "width")) || 0,
				parseFloat($.css(element, "height")) || 0);

	if (isRelative) {
		start = (!startTf || startTf === "none") ?
					"matrix(1, 0, 0, 1, 0, 0)" : startTf;
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

	return pos => {
		const result = [];
		let ret = ""; // matrix for interpolated value from current to base(1, 0, 0, 1, 0, 0)

		if (isRelative) {
			// This means a muliply between a matrix and a transform.
			return start + end(pos);
		}

		if (pos === 1) {
			ret = data2String(basePos);
		} else {
			for (let i = 0, s, e, l = start[1].length; i < l; i++) {
				s = parseFloat(start[1][i]);
				e = parseFloat(basePos[1][i]);

				result.push(s + (e - s) * pos);
			}

			ret = data2String([start[0], result]);
		}
		return ret + end(pos);
	};
}

export {
	toMatrix3d,
	toMatrixArray as toMatrix,
	rateFn,
};
