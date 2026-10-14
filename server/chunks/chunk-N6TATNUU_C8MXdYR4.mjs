//#region node_modules/@tracht-digital-solutions/tds-shared/dist/chunk-N6TATNUU.js
var PORTAL_PERMISSIONS = [
	"projects:read",
	"invoices:read",
	"invoices:pay",
	"documents:read",
	"documents:write",
	"messages:read",
	"messages:write",
	"tickets:read",
	"tickets:write"
];
var PERMISSION_KEY_PATTERN = /^[a-z0-9][a-z0-9-]{0,31}:[a-z0-9][a-z0-9-]{0,31}$/;
var PORTAL_PERMISSION_LABELS = {
	"projects:read": "Projekte ansehen",
	"invoices:read": "Rechnungen ansehen",
	"invoices:pay": "Rechnungen bezahlen",
	"documents:read": "Dokumente ansehen & herunterladen",
	"documents:write": "Dokumente hochladen / umbenennen",
	"messages:read": "Nachrichten ansehen",
	"messages:write": "Nachrichten senden",
	"tickets:read": "Tickets ansehen",
	"tickets:write": "Tickets erstellen & beantworten"
};
[...PORTAL_PERMISSIONS], PORTAL_PERMISSIONS.filter((p) => p.endsWith(":read"));
//#endregion
export { PORTAL_PERMISSIONS as n, PORTAL_PERMISSION_LABELS as r, PERMISSION_KEY_PATTERN as t };
