
var tableUtil = {

    /**
     * Refreshes the table {@code theTable}.
     * @param theTable The table to be refreshed.
     */
    refreshTable: function (theTable) {
        if(!theTable) {
            return
        }
        if (isc.isA.ResultSet(theTable.data)){
            theTable.data.invalidateCache();
        }
        theTable.fetchData()
    },
    
    /**
     * Generates an identifier for a specific list grid.
     * @param listGrid The list grid for which the id is to be generated.
     */
    generateId: function(listGrid) {
        var last = 0;
        var data = listGrid.data;
        for(var i = 0, length =  data.getLength(); i < length; i++) {
            var curId = data.get(i).id;
            if(curId > last) {
                last = curId;
            }
        }
        return last + 1;
    },
    
    /**
     * Used to display the status of the requests to the server.
     * @param dsRequest The data source request.
     * @param data The object with the data which was sent from the server.
     * @param metaInfoLabel The label where the string is to be displayed.
     */
    displayStatus: function(dsRequest, data, metaInfoLabel) {
        if(dsRequest.operationType == "fetch") {
            var endRow = data.response.endRow > data.response.totalRows ? data.response.totalRows : data.response.endRow;
            metaInfoLabel.setContents(data.response.startRow + ' to ' + endRow + ' out of ' + data.response.totalRows + '.');
        }
    }
}

var rowUtil = {

    /**
     * Shortens the maximum length of a string by {@code length} and appends 
     * a suffix.
     * @param str The string which is to be shortened.
     * @param length The maximum length of the string.
     */
    shortenLength: function(str, length) {
        return str.length > length ? str.substring(0, length) + " ..." : str
    }
}
