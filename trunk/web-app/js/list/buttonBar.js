
/**
 * Factory used to create buttons.
 */
var deleteButtonFactory = {

    /**
     * Creates a delete data button.
     * @param actionURL The URL with the action to be performed.
     * @param generatedTable The table upon with the records which are to be deleted.
     * @param tableDefId The table definition identifier.
     */
    createDeleteDataButton: function(actionURL, generatedTable, tableDefId) {
        /**
         * Button used to delete data.
         */
        return isc.DeleteButton.create({
            actionURL: actionURL,
            click: function() {
                var selectedRecords = generatedTable.getSelection();
                if(!selectedRecords || selectedRecords.getLength() == 0) {
                    isc.warn(this.processOpenMsg);
                }
                else {
                    var delButtonSelfActionURL = this.actionURL;
                    isc.confirm(this.deleteQuestion, function(value) {
                        var selectedRecords = generatedTable.getSelection();
                        if(value) {
                            var idListStr = ""
                            for(var i = 0, c = selectedRecords.getLength(); i < c; i++) {
                                var record = selectedRecords.get(i);
                                idListStr += record._id + ","
                            }
                            var params = { 
                                idListStr: idListStr.chompComma(),
                                dataModelId: tableDefId
                            };
                            RPCManager.sendRequest({ 
                                params: params,
                                httpMethod: "POST",
                                useSimpleHttp: true,
                                callback: function(data) {
                                    if(data.status == 0) {
                                        isc.say("The data was successfully deleted.", function() {
                                            tableUtil.refreshTable(generatedTable);
                                        });
                                    }
                                    else {
                                        isc.warn("The data could not be deleted. The status code: " + data.status);
                                    }
                                },
                                actionURL: delButtonSelfActionURL
                            });
                        }
                    });
                }
            }
        });
    },

    /**
     * Creates a truncate data button.
     * @param actionURL The URL with the action to be performed.
     * @param generatedTable The table upon with the records which are to be deleted.
     * @param tableDefId The table definition identifier.
     */
    createTruncateDataButton: function(actionURL, generatedTable, tableDefId) {
        
        /**
         * Button used to delete all data in the table.
         */
        return isc.DeleteButton.create({
            title: "Delete All",
            deleteQuestion: "Are you sure you want to delete all records in this table?",
            actionURL: actionURL,
            click: function() {
                var truncateButtonActionURL = this.actionURL;
                isc.confirm(this.deleteQuestion, function(value) {
                    var params = { 
                        dataModelId: tableDefId
                    };
                    RPCManager.sendRequest({ 
                        params: params,
                        httpMethod: "POST",
                        useSimpleHttp: true,
                        callback: function(data) {
                            if(data.status == 0) {
                                isc.say("The data was successfully deleted.", function() {
                                    tableUtil.refreshTable(generatedTable);
                                });
                            }
                            else {
                                isc.warn("The data could not be deleted. The status code: " + data.status);
                            }
                        },
                        actionURL: truncateButtonActionURL
                    });
                });
            }
        });
    },
    
    /**
     * Creates a truncate data button.
     * @param generatedTable The table upon with the records which are to be deleted.
     * @param tableDefId The table definition identifier.
     */
    createSaveDataButton: function(generatedTable, tableDefId) {
        
        /**
         * Button used to save all edits on the table.
         */
        return isc.SaveButton.create({
            click: function() {
                generatedTable.saveAllEdits();
                generatedTable.endEditing();
            }
        });
    },
    
    /**
     * Creates a button bar with the delete buttons.
     */
    createButtonBar: function(deleteActionUrl, truncateActionUrl, generatedTable, tableOrModelId) {
        return isc.HLayout.create({
            ID:"buttonBar",
            width: "100%",
            height: 45,
            layoutTopMargin : 5,
            styleName: "pageLayout",
            members: [
                      isc.Canvas.create({width: "*"}),
                      deleteButtonFactory.createSaveDataButton(generatedTable, tableOrModelId),
                      isc.Canvas.create({width: "10"}),
                      deleteButtonFactory.createDeleteDataButton(deleteActionUrl, generatedTable, tableOrModelId),
                      isc.Canvas.create({width: "10"}),
                      deleteButtonFactory.createTruncateDataButton(truncateActionUrl, generatedTable, tableOrModelId),
                      isc.Canvas.create({width: "*"})]
        });
    }
}