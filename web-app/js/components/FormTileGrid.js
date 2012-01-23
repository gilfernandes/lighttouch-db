
isc.defineClass("FormTileGrid","ListGrid").addProperties({
    cellHeight: 24,
    imageSize: 16,
    showEdges: true,
    edgeSize: 2,
    border: "0px",
    bodyStyleName: "normal",
    alternateRecordStyles: true,
    showHeader: false,
    leaveScrollbarGap: false,
    canSort: false,
    emptyMessage: "<br><br>Drag &amp; drop parts here",
    canReorderRecords: true,
    selectionType: "single"
});