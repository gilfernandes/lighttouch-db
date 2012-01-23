
/**
 * Helper object used to dynamically add some properties.
 */
var RecordHelper = function() {
}

/**
 * The form used to display the properties.
 */
isc.DynamicForm.create({
    ID : "propertiesForm",
    cellPadding: 0,
    useAllDataSourceFields : true,
    saveOnEnter: true,
    titleSuffix: " :&nbsp;",
    
    /**
     * Synchronizes some of the properties here with the other models after
     * submission.
     */
    submit: function() {
        this.Super("submit", arguments);
        formComposerList.cancelEditing();
        var label = this.getValue("label");
        var dataModelForeignKey = this.getValue(CONSTANTS.get('DATA_MODEL_FOREIGN_KEY'));
        var currentRecord = new RecordHelper();
        currentRecord.label = label;
        currentRecord.dataModelForeignKey = dataModelForeignKey;
        tableModelTree.synchronizeTitle(currentRecord);
        // Remove all commas and quotes from all fields here.
        for(var i = 0, l = this.getFields().length; i < l; i++) {
            var field = this.getFields().get(i);
            if(typeof (field.type) == 'undefined' && typeof(field.getValue()) == 'string') {
                field.setValue(stringUtils.replaceCommaQuotes(field.getValue()))
            }
        }
        if(this.getValue(CONSTANTS.get('TABLE'))) { 
            dataModelGrid.updateReferenceData(
                this.getValue(CONSTANTS.get('TABLE')), this.getValue(CONSTANTS.get('TABLE_COLUMN')), dataModelForeignKey);
        }
    },
    
    /**
     * Fetches the corresponding columns for a table.
     * @param form The form in which the select item has been changed.
     * @param value The new value.
     */
    handleTableReferenceChange: function(form, item, value) {
        for(var i = 0, l = openDefinitionDs.optionData.length; i < l; i++) {
            if(value == openDefinitionDs.optionData[i].key) {
                var dataModelData = openDefinitionDs.optionData[i].dataModelData;
                var dataModel = eval('(' + dataModelData + ')');
                if(dataModel.fields) {
                    var ds = propertiesForm.getDataSource();
                    var valueMap = ds.fields.tableColumn.valueMap;
                    valueMap = {};
                    for(var j = 0, jL = dataModel.fields.length; j < jL; j++) {
                        var field = dataModel.fields[j]
                        valueMap[field.id] = field.title;
                    }
                    var tableColumnItem = propertiesForm.getItem(CONSTANTS.get('TABLE_COLUMN'));
                    tableColumnItem.setValueMap(valueMap);
                }
                break;
            }
        }
    },
    
    /**
     * Hides or display the items in the form.
     * @param on If {@code true} all fields will be displayed, else hidden.
     */
    changeFieldsState: function(on) {
        var itemArray = this.getItems();
        // Hide all field items.
        for(var i = 0, l = itemArray.getLength(); i < l; i++) {
            var item = itemArray.get(i);
            if(on) {
                item.show();
            }
            else {
                item.hide();
            }
        }
        if(on) {
            propertiesFormSubmitButton.show();
        }
        else {
            propertiesFormSubmitButton.hide();
        }
        return;
    }, 
    
    /**
     * Enables and disables certain fields which are not common to 
     * all widget types.
     */
    editSelectedData: function(grid) {
        this.Super("editSelectedData", arguments);
        propertiesFormSubmitButton.show();
        propertiesForm.show();
        var selectedRecord = grid.getSelectedRecord();
        if(!selectedRecord || !selectedRecord.id) {
            this.changeFieldsState(false);
            return;
        }
        this.changeFieldsState(true);
        var sizeItem = this.getItem(CONSTANTS.get('SIZE'));
        var colsItem = this.getItem(CONSTANTS.get('COLS'));
        var rowsItem = this.getItem(CONSTANTS.get('ROWS'));
        var tableItem = this.getItem(CONSTANTS.get('TABLE'));
        var tableColumnItem = this.getItem(CONSTANTS.get('TABLE_COLUMN'));
        var classItem = this.getItem(CONSTANTS.get('CLASS'));
        tableItem.hide();
        tableColumnItem.hide();
        classItem.show();
        var defaultValue = this.getItem("defaultValue");
        defaultValue.enable();
        var optionsItem = this.getItem(CONSTANTS.get('OPTIONS'));
        var dmForeignKeyItem = this.getItem(CONSTANTS.get('DATA_MODEL_FOREIGN_KEY'));
        dmForeignKeyItem.hide(); // never display the data model key.
        switch(selectedRecord.widgetType) {
            case fieldType.textarea:
                colsItem.show();
                rowsItem.show();
                sizeItem.hide();
                optionsItem.hide();
                break;
            case fieldType.text:
                sizeItem.show();
                colsItem.hide();
                rowsItem.hide();
                optionsItem.hide();
                break;
            case fieldType.combobox:
                sizeItem.hide();
                colsItem.hide();
                rowsItem.hide();
                optionsItem.show();
                break;
            case fieldType.reference:
                sizeItem.hide();
                colsItem.hide();
                rowsItem.hide();
                optionsItem.hide();
                classItem.hide();
                tableItem.show();
                tableItem.changed = this.handleTableReferenceChange;
                // Refresh the options used to create references, before calling the changed function.
                // Here the changed function is triggered as a callback.
                openDefinitionDs.fetchOptionData(fieldsDs.fields.table, tableItem.changed, this, null, tableItem.getValue()); 
                // tableItem.changed(this, null, tableItem.getValue());
                tableColumnItem.show();
                break;
            case fieldType.date:
            case fieldType.time:
               defaultValue.disable();
            default:
                sizeItem.hide();
                colsItem.hide();
                rowsItem.hide();
                optionsItem.hide();
        }
    }
});

propertiesForm.setDataSource("fieldsDs");

isc.IButton.create({
    ID: "propertiesFormSubmitButton",
    title: "Submit",
    align: "center",
    click: "propertiesForm.submit()"
});

/**
 * Hides the properties view.
 */
var hidePropertiesView = function() {
    propertiesFormSubmitButton.hide();
    propertiesForm.hide();
}

hidePropertiesView();

isc.HLayout.create({
    ID: "propertiesFormSubmitButtonLayout",
    align: "left",
    valign: "center",
    align: "center",
    width: "100%",
    wrap: false,
    height: "100%",
    showEdges: false,
    layoutTopMargin: 10,
    members: [propertiesFormSubmitButton]
});

isc.VLayout.create({
    ID:"propertiesFormLayout",
    showEdges: true,
    edgeSize: 2,
    layoutLeftMargin: 0,
    layoutRightMargin:  0,
    members: [propertiesForm, propertiesFormSubmitButtonLayout]
});



 