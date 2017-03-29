import {jQuery} from "./browser";
import {rateFn} from "./transform";

const $ = jQuery;

if (!$) {
	console.warn("jQuery is not defined.");
} else {
	$.fx.step.transform = fx => {
		fx.rateFn = fx.rateFn || rateFn(fx.elem, fx.start, fx.end);
		$.style(fx.elem, "transform", fx.rateFn(fx.pos));
	};
}

export default $;
