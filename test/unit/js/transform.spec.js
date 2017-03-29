import jQuery from "../../../src/main";
import {toMatrix, toMatrix3d} from "../../../src/transform";

const $ = jQuery;

function initializeElement() {
	sandbox({
		id: "box1",
		style: "width:120px;height:120px;position:absolute;border:solid;",
	});

	sandbox({
		id: "box2",
		style: "width:120px;height:120px;position:absolute;border:solid;",
	});
}

describe("2d animate Test", () => {
	describe("One-time execution", () => {
		let $el1;
		let $el2;

		const ONETIME_CASE = [
			{title: "rotate(45deg)", css: "rotate(45deg)", transform: "rotate(45deg)"},
			{title: "skewX(30deg) skewY(10deg)", css: "skewX(30deg) skewY(10deg)", transform: "skewX(30deg) skewY(10deg)"},
			{title: "translate(100px, 10px)", css: "translate(100px, 10px)", transform: "translate(100px, 10px)"},
			{title: "matrix(.5, .433, -.5, 1.033, 50, -10)", css: "matrix(.5, .433, -.5, 1.033, 50, -10)", transform: "matrix(.5, .433, -.5, 1.033, 50, -10)"},
			{title: "rotate(45deg) translate(38px)", css: "rotate(45deg) translate(38px)", transform: "rotate(45deg) translate(38px)"},
			{title: "multiplex transform: rotate & translate & skew & scale & matrix", css: "rotate(45deg) translateY(-68px) skewX(-30deg) scale(1.2) matrix(.5, .433, -.5, 1.033, 50, -10)", transform: "rotate(45deg) translateY(-68px) skewX(-30deg) scale(1.2) matrix(.5, .433, -.5, 1.033, 50, -10)"},
			{title: "translate(50%, 100%)", css: "translate(60px, 120px)", transform: "translate(50%, 100%)"},
			{title: "translate(20, 100%)", css: "translate(20px, 120px)", transform: "translate(20, 100%)"},
			{title: "translate(25%, 100px)", css: "translate(30px, 100px)", transform: "translate(25%, 100px)"},
		];

		beforeEach(() => {
			initializeElement();
			$el1 = $("#box1").css("transform", "none");
			$el2 = $("#box2").css("transform", "none");
		});

		afterEach(() => {
			cleanup();
		});

		$.each(ONETIME_CASE, (i, val) => {
			// ABSOLUTE_CASE
			it(val.title, done => {
				// Given
				// When
				$el1.css("transform", val.css);

				$el2.animate(
					{"transform": val.transform},
					{
						duration: 0,
						complete: () => {
							const expected = toMatrix($el1.css("transform"));
							const actual = toMatrix($el2.css("transform"));

							// Ignore very tiny difference.
							// Because output matrixes can be different with input matrixes.)
							$.each(expected[1], idx => {
								expected[1][idx] = parseFloat(expected[1][idx]).toFixed(3);
								actual[1][idx] = parseFloat(actual[1][idx]).toFixed(3);
							});

							expect(actual[1].toString()).to.be.equal(expected[1].toString());
							done();
						},
					},
				);
			});
		});
	});

	describe("Sequential execution", () => {
		let $el1;
		let $el2;

		before(() => {
			initializeElement();
			$el1 = $("#box1").css("transform", "none");
			$el2 = $("#box2").css("transform", "none");
		});

		after(() => {
			cleanup();
		});

		const SEQUENTIAL_CASE = [
			{title: "+=translate(100px, 0)", css: "translate(100px, 0px)", transform: "+=translate(100px, 0)"},
			{title: "+=translate(0, 100px)", css: "translate(100px, 100px)", transform: "+=translate(0, 100px)"},
			{title: "+=translate(100, 100)", css: "translate(200px, 200px)", transform: "+=translate(100, 100)"},
			{title: "+=scale(2) translate(-100, -100)", css: "scale(2) translate(0px, 0px)", transform: "+=scale(2) translate(-100, -100)"},
			{title: "+=scale(0.5) rotate(30deg)", css: "rotate(30deg)", transform: "+=scale(0.5) rotate(30deg)"},
			{title: "+=rotate(-30deg) translate(10px, 50%)", css: "translate(10px, 60px)", transform: "+=rotate(-30deg) translate(10px, 50%)"},
		];

		$.each(SEQUENTIAL_CASE, (i, val) => {
			// Given
			// RELATIVE_CASE
			it(val.title, done => {
				// When
				$el1.css("transform", val.css);
				$el2.animate(
					{"transform": val.transform},
					() => {
						// Then
						const expected = toMatrix($el1.css("transform"));
						const result = toMatrix($el2.css("transform"));

						// Ignore very tiny difference.
						// Because output matrixes can be different with input matrixes.)
						$.each(expected[1], idx => {
							expected[1][idx] = parseFloat(parseFloat(expected[1][idx]).toFixed(3));
							result[1][idx] = parseFloat(parseFloat(result[1][idx]).toFixed(3));
						});

						expect(result[1].toString()).to.be.equal(expected[1].toString());
						done();
					},
				);
			});
		});
	});
});

describe("3d animate Test", () => {
	describe("One-time execution", () => {
		let $el1;
		let $el2;

		beforeEach(() => {
			initializeElement();
			$el1 = $("#box1").css("transform", "none");
			$el2 = $("#box2").css("transform", "none");
		});

		afterEach(() => {
			cleanup();
		});

		const ONETIME_CASE = [
			{title: "translateX(-100px)", css: "translateX(-100px)", transform: "translateX(-100px)"},
			{title: "translateY(-50%)", css: "translateY(-60px)", transform: "translateY(-50%)"},
			{title: "translateZ(100px)", css: "translateZ(100px)", transform: "translateZ(100px)"},
			{title: "translate3d(10px, 10%, 0)", css: "translate3d(10px, 12px, 0)", transform: "translate3d(10px, 10%, 0)"},
			{title: "scaleX(2)", css: "scaleX(2)", transform: "scaleX(2)"},
			{title: "scaleY(0.5)", css: "scaleY(0.5)", transform: "scaleY(0.5)"},
			{title: "scaleZ(1)", css: "scaleZ(1)", transform: "scaleZ(1)"},
			{title: "scale3d(2, 0.5, 1)", css: "scale3d(2, 0.5, 1)", transform: "scale3d(2, 0.5, 1)"},
			{title: "rotateX(-90deg)", css: "rotateX(-90deg)", transform: "rotateX(-90deg)"},
			{title: "rotateY(180deg)", css: "rotateY(180deg)", transform: "rotateY(180deg)"},
			{title: "rotateZ(360deg)", css: "rotateZ(360deg)", transform: "rotateZ(360deg)"},
			{title: "rotate3d(1, -1, 1, 180deg)", css: "rotate3d(1, -1, 1, 180deg)", transform: "rotate3d(1, -1, 1, 180deg)"},
			{title: "scaleX(0.5) scaleY(2) rotate3d(0, 0, 1, 45deg)", css: "scaleX(0.5) scaleY(2) rotate3d(0, 0, 1, 45deg)", transform: "scaleX(0.5) scaleY(2) rotate3d(0, 0, 1, 45deg)"},
			{title: "translate3d(100px, 100px, 100px)", css: "translate3d(100px, 100px, 100px)", transform: "translate3d(100px, 100px, 100px)"},
		];

		$.each(ONETIME_CASE, (i, val) => {
			// Given
			// RELATIVE_CASE
			it(val.title, done => {
				// When
				$el1.css("transform", val.css);
				$el2.animate(
					{"transform": val.transform},
					() => {
						// Then
						let t1 = toMatrix($el1.css("transform"));
						let t2 = toMatrix($el2.css("transform"));

						if (t1[1].length < t2[1].length) {
							t1 = toMatrix3d(t1);
						} else if (t1[1].length > t2[1].length) {
							t2 = toMatrix3d(t2);
						}

						// Ignore very tiny difference.
						// Because output matrixes can be different with input matrixes.)
						$.each(t1[1], idx => {
							t1[1][idx] = parseFloat(t1[1][idx]).toFixed(3);
							t2[1][idx] = parseFloat(t2[1][idx]).toFixed(3);
						});

						expect(t2[1].toString()).to.be.equal(t1[1].toString());
						done();
					},
				);
			});
		});
	});

	describe("Sequential execution", () => {
		let $el1;
		let $el2;
		const START_POSITION = "translate3d(100px, 100px, 100px)";

		before(() => {
			initializeElement();
			$el1 = $("#box1").css("transform", START_POSITION);
			$el2 = $("#box2").css("transform", START_POSITION);
		});

		after(() => {
			cleanup();
		});

		const SEQUENTIAL_CASE = [
			{title: "+=translate(0px, 100px)", css: "translate3d(100px, 200px, 100px)", transform: "+=translate(0px, 100px)"},
			{title: "translate3d(100%, 200px, 0)", css: "translate3d(120px, 200px, 0)", transform: "translate3d(100%, 200px, 0)"},
			{title: "translate3d(0, 0, 0)", css: "translate3d(0px, 0px, 0px)", transform: "translate3d(0, 0, 0)"},
			{title: "+=scale(2) translate3d(-100, -100, 100)", css: "scale(2) translate3d(-100px, -100px, 100px)", transform: "+=scale(2) translate3d(-100, -100, 100)"},
		];

		$.each(SEQUENTIAL_CASE, (i, val) => {
			// Given
			// RELATIVE_CASE
			it(val.title, done => {
				// When
				$el1.css("transform", val.css);
				$el2.animate(
					{"transform": val.transform},
					() => {
						// Then
						let t1 = toMatrix($el1.css("transform"));
						let t2 = toMatrix($el2.css("transform"));

						if (t1[1].length < t2[1].length) {
							t1 = toMatrix3d(t1);
						} else if (t1[1].length > t2[1].length) {
							t2 = toMatrix3d(t2);
						}

						// Ignore very tiny difference.
						// Because output matrixes can be different with input matrixes.)
						$.each(t1[1], idx => {
							t1[1][idx] = parseFloat(t1[1][idx]).toFixed(3);
							t2[1][idx] = parseFloat(t2[1][idx]).toFixed(3);
						});

						expect(t2[1].toString()).to.be.equal(t1[1].toString());
						done();
					},
				);
			});
		});
	});
});
