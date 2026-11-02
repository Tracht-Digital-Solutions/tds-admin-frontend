// node_modules/@tracht-digital-solutions/tds-ext-projects/islands/statuses.ts
/**
* Project and milestone statuses: label + chip tone. One map for both islands
* (the portal list and the admin screen kept identical copies "in sync" by
* comment). Rendered through tds-shared `StatusChip`, which resolves the tone
* to a real `chip--*` class instead of interpolating one.
*/
var PROJECT_STATUS = {
	discovery: {
		label: "Analyse",
		tone: "info"
	},
	in_progress: {
		label: "In Arbeit",
		tone: "warning"
	},
	review: {
		label: "Abnahme",
		tone: "cat-violet"
	},
	delivered: {
		label: "Abgeschlossen",
		tone: "success"
	},
	on_hold: {
		label: "Pausiert",
		tone: "neutral"
	}
};
var MILESTONE_STATUS = {
	pending: {
		label: "Offen",
		tone: "neutral"
	},
	in_progress: {
		label: "In Arbeit",
		tone: "warning"
	},
	completed: {
		label: "Erledigt",
		tone: "success"
	}
};
export { PROJECT_STATUS as n, MILESTONE_STATUS as t };
