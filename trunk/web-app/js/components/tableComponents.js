

/**
 * List grid typically opened in the list grids.
 */
isc.defineClass("ManagerListGrid", "ListGrid").addProperties({
    autoFetchData: true,
    alternateRecordStyles: true,
    height: 380,
    autoDraw: false,
    width: "100%",
    canEdit: true,
    cellHeight: 30,
    selectionType: "single",
    sortField: "id",
    sortDirection: "descending",
    showFilterEditor: true,
    filterOnKeypress: true
});