/**
 * The basis for the window that opens dynamic tables.
 */
isc.defineClass("TableButton", "IButton").addProperties({
    urlStr: "",
    popupName: "",
    popupWidth: 700,
    popupHeight: 650,
    icon: "[SKIN]/actions/groupby.png",
    processOpenMsg: "Please select a record !",
    idToUse: "id",
    click: function() {
        var selectedRecord = openDefinitionList.getSelectedRecord();
        if(!selectedRecord) {
            isc.warn(this.processOpenMsg);
        }
        else {
            var idStr = eval("selectedRecord." + this.idToUse);
            windowUtil.open(this.urlStr + idStr, 
                this.popupName, this.popupWidth, this.popupHeight);
        }
    }
});