
/**
 * Centralized page layout.
 */
isc.HLayout.create({
    ID : "pageLayout",
    width : "100%",
    height : globals.mainLayoutHeight,
    styleName : "pageLayout",
    members : [ isc.Canvas.create({
        width : "*"
    }), 
    mainLayout,
    isc.Canvas.create({
        width : "*"
    }) ]
});

isc.Page.setEvent("load", function() {
    pageLayout.draw();
    RPCManager.sendRequest({
        httpMethod : "GET",
        serverOutputAsString: true,
        useSimpleHttp : true,
        callback : "dsOperator.addFieldsFromData(data)",
        actionURL : actionURL
    });
});