isc.VLayout.create({
    ID : "mainLayout",
    width : "100%",
    styleName : "mainLayout",
    height : globals.mainLayoutHeight,
    align : "top",
    layoutLeftMargin : 0,
    layoutRightMargin : 0,
    members : [ titleLabel, dataModelLabel, metaInfoLabel, generatedTable, 
                deleteButtonFactory.createButtonBar("../deleteDataJson", "../truncateDataJson", generatedTable, paramId) ]
});

if(typeof("dsOperator") != "undefined") {
    var dsOperator = isc.DsOperator.create({
        ID: "dsOperator",
        dataModelLabel: dataModelLabel,
        generatedTable: generatedTable,
        metaInfoLabel: metaInfoLabel
    });
}