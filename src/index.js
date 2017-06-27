import jQuery from "jquery";
import {rateFn} from "./transform";

const $ = jQuery;

/**
 * @namespace jQuery
 */
if (!$) {
	console.warn("jQuery is not defined.");
} else {
	/**
	 * A method that extends the <a href=http://api.jquery.com/animate/>.animate()</a> method provided by jQuery. With this method, you can use the transform property and 3D acceleration
	 * @ko jQuery의<a href=http://api.jquery.com/animate/>animate() 메서드</a>를 확장한 메서드. CSS의 transform 속성과 3D 가속을 사용할 수 있다.
	 * @name jQuery#animate
	 * @alias eg.Transform
	 * @method
	 * @param {Object} properties An object composed of the CSS property and value which will be applied to an animation<ko>애니메이션을 적용할 CSS 속성과 값으로 구성된 객체</ko>
	 * @param {Number|String} [duration=4000] Duration of the animation (unit: ms)<ko>애니메이션 진행 시간(단위: ms)</ko>
	 * @param {String} [easing="swing"] The easing function to apply to an animation<ko>애니메이션에 적용할 easing 함수</ko>
	 * @param {Function} [complete] A function that is called once the animation is complete.<ko>애니메이션을 완료한 다음 호출할 함수</ko>
	 *
	 * @example
	 * $("#box")
	 * 		.animate({"transform" : "translate3d(150px, 100px, 0px) rotate(20deg) scaleX(1)"} , 3000)
	 * 		.animate({"transform" : "+=translate3d(150px, 10%, -20px) rotate(20deg) scale3d(2, 4.2, 1)"} , 3000);
	 * @see {@link http://api.jquery.com/animate/}
	 *
	 * @support {"ie": "10+", "ch" : "latest", "sf" : "latest", "edge" : "latest", "ios" : "7+", "an" : "2.3+ (except 3.x)"}
	 */
	$.fx.step.transform = fx => {
		fx.rateFn = fx.rateFn || rateFn(fx.elem, fx.start, fx.end);
		$.style(fx.elem, "transform", fx.rateFn(fx.pos));
	};
}

export default $;
