
/**
 * The data model identifier.
 */
var dataModelIdParam = "dataModelId";

isc.HTMLFlow.create({
    ID : "titleLabel",
    align : "left",
    align : "center",
    height : 40,
    wrap : false,
    showEdges : false,
    margin : 8,
    contents : "<span class='title'>" + tablePageTitle + "</span>"
});

isc.Label.create({
    ID : "dataModelLabel",
    align : "left",
    height : 40,
    wrap : false,
    showEdges : false,
    margin : 8,
    contents : "",
    baseStyle: "formLabel"
});

isc.Label.create({
    ID : "metaInfoLabel",
    align : "left",
    height : 40,
    wrap : false,
    showEdges : false,
    margin : 8,
    contents : "",
    baseStyle: "formLabel"
});

/**
 * The data source used to contain the data of the form created by the user.
 * This is a dummy data source.
 */
isc.DataSource.create({
    ID : "initialDs",
    clientOnly : true,
    fields : [ {
        name : "foo"
    } ]
});

isc.ListGrid.create({
     ID: "generatedTable",
     dataSource: initialDs,
     alternateRecordStyles:true,
     canGroupBy: false,
     autoFetchData: false,
     showAllRecords: false,
     showHeaderContextMenu: true, // to activate context menu
     canPickFields:false, // to remove columns option on context menu
     canGroupBy :false,  // to remove group option on context menu
     canEdit: true,
     selectionAppearance:"checkbox",
     selectionType: "simple"
});

