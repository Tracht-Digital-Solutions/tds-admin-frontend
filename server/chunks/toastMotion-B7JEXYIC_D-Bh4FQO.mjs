import { T as transitions, w as spring } from "./Layout_kCpQGkaf.mjs";
import { c as AnimatePresence, i as MotionScope, l as useIsPresent, s as m } from "./chunk-K3B6PMZC_OR-NiCIk.mjs";
import { jsx } from "react/jsx-runtime";
//#region node_modules/@tracht-digital-solutions/tds-shared/dist/toastMotion-B7JEXYIC.js
var TOAST_MOTION = {
	initial: {
		opacity: 0,
		y: 8
	},
	animate: {
		opacity: 1,
		y: 0,
		transition: transitions.base
	},
	exit: {
		opacity: 0,
		scale: .96,
		transition: transitions.fast
	},
	transition: { layout: spring }
};
var SWIPE_DISTANCE = 80;
var SWIPE_VELOCITY = 500;
function AnimatedToasts({ items, ...card }) {
	return /* @__PURE__ */ jsx(MotionScope, {
		features: "layout",
		children: /* @__PURE__ */ jsx(AnimatePresence, {
			initial: false,
			children: items.map((item) => /* @__PURE__ */ jsx(ToastCard, {
				item,
				...card
			}, item.id))
		})
	});
}
function ToastCard({ item, swipeable, className, render, onDismiss, onHold }) {
	const isPresent = useIsPresent();
	return /* @__PURE__ */ jsx(m.div, {
		layout: "position",
		...TOAST_MOTION,
		"aria-hidden": isPresent ? void 0 : true,
		inert: !isPresent,
		className: className(item),
		drag: swipeable ? "x" : false,
		dragSnapToOrigin: true,
		dragElastic: .6,
		style: swipeable ? { touchAction: "pan-y" } : void 0,
		onDragStart: () => onHold(true),
		onDragEnd: (_event, info) => {
			onHold(false);
			if (Math.abs(info.offset.x) > SWIPE_DISTANCE || Math.abs(info.velocity.x) > SWIPE_VELOCITY) onDismiss(item.id);
		},
		children: render(item)
	});
}
//#endregion
export { AnimatedToasts };
