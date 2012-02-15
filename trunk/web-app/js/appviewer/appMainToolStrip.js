
/**
 * The combo box which displays the selected application and also
 * other applications which can be activated.
 */
isc.DynamicForm.create({
    ID:"applicationComboForm",
    width: 350,
    margin: 3,
    lastAccessedAppCookie: "lastAccessedApp",
    fields : [
    {
        ID: "applicationCombo", name: "application", title: "Application", type: "select", 
        valueMap: [],
        width: 240,
        pickListCellHeight: 40,
        formatValue: function(value, record, form, item) {
            if(!value) {
                return "";
            }
            return value.name != null ? '<b>' + value.id + '</b> - ' + value.name : "";
        },
        pickListProperties: {
            formatCellValue : function (value, record, field, viewer) {
               var descStr = record.application.description ? record.application.description : "[no descripton]";
               var styleStr = "";
               var retStr = "<table>" + 
               "<tr><td ><span class='appCombo' style='width:170px;float:left'>" + record.application.name + "<span></td>" +
               "<td align='right'><span class='appCombo' style='width:50px;float:right;font-weight:bold'>" + record.application.id + "<span></td></tr>" +
               "<tr><td colSpan=2><span class='appCombo' style='width:220px;float:left'>" + descStr + "</span></td></tr></table>";
               return retStr;
            },
            canHover: true,
            showHover: true,
            cellHoverHTML : function (record) {
                return record.application.description ? record.application.description : "[no description]";    
            }
        },
        
        /**
         * Reloads the model.
         * @param form This form.
         * @param item Not in use.
         * @param value The currently selected value.
         */
        change: function(form, item, value, oldValue) {
            var lastId = value.id;
            cookieUtil.setCookie(applicationComboForm.lastAccessedAppCookie, lastId, 365);
            appFunctions.createTabs(value);
        }
    }]
});

/**
 * The main tool strip.
 */
isc.ToolStrip.create({
    ID: "mainToolStrip",
    width: "100%",
    height: 35,
    defaultHeight: 35,
    
    /**
     * Sets the default buttons.
     */
    init: function() {
        this.Super("init", arguments);
        this.setMembers([applicationComboForm, isc.Canvas.create({width: "*"}), logoutButton]);
    }
});