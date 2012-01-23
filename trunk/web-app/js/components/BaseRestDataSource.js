/**
 * Prototype for the rest data sources we are using here.
 */
isc.defineClass("BaseRestDataSource", "RestDataSource").addProperties({
    recordXPath: "/rows",
    dataFormat: "json"
});