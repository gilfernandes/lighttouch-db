
//isc.showConsole()

/**
 * The fields used in the table tree.
 */
var tableFields = {
    visible: "Visible",
    sort: "Sort",
    editable: "Editable",
    group: "Group",
    reorder: "Reorder",
    filter: "Filter",
    width: "Width",
    textWidget: "TextArea"
}

/**
 * The data source used to contain the data of the form created by the user.
 */
isc.DataSource.create({
    ID:"fieldsDs",
    clientOnly: true,
    fields : [
        { name: "id", primaryKey:true, canEdit: false },
        { name: "label" },
        { name: "widgetType", hidden: true},
        { name: "defaultValue" },
        { name: CONSTANTS.get('SIZE') },
        { name: CONSTANTS.get('COLS') },
        { name: CONSTANTS.get('ROWS') },
        { name: CONSTANTS.get('CLASS') },
        { name: CONSTANTS.get('DATA_MODEL_FOREIGN_KEY'), type: "integer"}, // references the data model field by id.
        { name: CONSTANTS.get('OPTIONS'), type: "textArea", hint: "Separate the options with new line", showHintInField: true},
        // The table will be dynamically filled.
        { name: CONSTANTS.get('TABLE'), title: "Ref. Table", type: "select", hint: "Select the referenced table", showHintInField: true, valueMap: {}},
        { name: CONSTANTS.get('TABLE_COLUMN'), title: "Display Column", type: "select", hint: "Select the displayed column", showHintInField: true, valueMap: {}}
    ],
    
    /**
     * Fills the value map with the referenceable tables.
     */ 
    init: function() {
        this.Super("init", arguments);
        openDefinitionDs.fetchOptionData(this.fields.table);
    },
    
    setCacheData : function (data, invalidateCache) {
        this.Super("setCacheData", arguments);
        alert('');
    },
    
    /**
     * When this data source is updated the data model grid is also updated here.
     */
    performAddData: function(updatedRecord, callback, requestProperties) {
//        this.Super("addData", arguments);
        if(requestProperties.importing) {
            return;
        }
        var title = updatedRecord.title;
        var updatedRecordId = tableUtil.generateId(formComposerList);
        updatedRecord.id = updatedRecordId;
        if(title) {
            var droppedFromTools = formComposerList.dropSource == "formToolsGrid";
            title = title.simplify();
            var type = dataType.text;
            if(droppedFromTools) {
                switch(updatedRecord.widgetType) {
                    case fieldType.checkbox:
                        type = dataType.boolean;
                        break;
                    case fieldType.date:
                        type = dataType.date;
                        break;
                    case fieldType.time:
                        type = dataType.time;
                        break;
                    case fieldType.heading1:
                        type = dataType.staticText;
                        break;
                    case fieldType.reference:
                        type = dataType.reference;
                        break;
                }
            }
            else {
                if(formComposerList.dropRecord != null) {
                    switch(formComposerList.dropRecord.type) {
                        case dataType.boolean:
                            updatedRecord.widgetType = editorType.checkbox;
                            break;
                        case dataType.date:
                            updatedRecord.widgetType = editorType.date;
                            break;
                    }
                }
            }
            var dataModelRecord;
            if(dataModelGrid.data.length == 0) {
                // Creates the first record in the data model.
                dataModelRecord = { id: 1, "title": title, "type": type};
                dataModelGrid.setData([dataModelRecord])
                updatedRecord.dataModelForeignKey = dataModelRecord.id;
                this.createTableModelEntry(updatedRecord.title, updatedRecord.dataModelForeignKey, type);
            }
            else {
                if(droppedFromTools) { 
                    // Just propagate to the data model and table model grid in case the drop source was the form tools table.
                    dataModelRecord = this.createDataEntry(title, type);
                    updatedRecord.dataModelForeignKey = dataModelRecord.id;
                    if(dataModelRecord.type != dataType.staticText) { 
                        this.createTableModelEntry(updatedRecord.title, updatedRecord.dataModelForeignKey, type);
                    }
                }
                else { // dropped from the data types.
                    var dataRecordId = formComposerList.dropRecord.id;
                    // Check, if this data record has already a form widget associated to it.
                    var formContainDataWidget = false;
                    for(var i = 0, l = formComposerList.data.size(); i < l; i++) {
                        var formId = formComposerList.data.get(i).dataModelForeignKey;
                        if(formId == dataRecordId) {
                            formContainDataWidget = true;
                            break;
                        }
                    }
                    if(formContainDataWidget) {
                        // Remove bogus record.
                        this.removeData(updatedRecord);
                    }
                    else {
                        updatedRecord.dataModelForeignKey = dataRecordId;
                        // If necessary re-construct the table entries.
                        if(formComposerList.dropRecord.type != dataType.staticText) {
                            this.createTableModelEntry(updatedRecord.title, dataRecordId, type);
                        }
                    }
                }
            }
        }
    },
    
    /**
     * Creates an entry in the data model table.
     * @param title The title of the record.
     * @param type The type of the record.
     */
    createDataEntry: function(title, type) {
         var id = tableUtil.generateId(dataModelGrid);
         dataModelRecord = { "id": id, "title": title, "type": type };
         dataModelGrid.data.add(dataModelRecord);
         return dataModelRecord;
    }
    ,
    
    /**
     * Creates an entry in the table model tree.
     * 
     * @param title The title of the record.
     * @param type The data type.
     */
    createTableModelEntry: function(title, dataModelForeignKey, type) {
        var newId = tableModelTree.generateId();
        var parentNode = tableModelTree.add(
            {name: title, isFolder: true, active: null, id: newId, dataModelForeignKey: dataModelForeignKey, children:[
                    {name: tableFields.visible, isFolder: false, active: true, isBoolean: true},
                    {name: tableFields.sort, isFolder: false, active: true, isBoolean: true},
                    {name: tableFields.editable, isFolder: false, active: false, isBoolean: true}, // per default this is not editable on the table.
//                    {name: "Group", isFolder: false, active: true, isBoolean: true},
                    {name: tableFields.reorder, isFolder: false, active: true, isBoolean: true},
                    {name: tableFields.filter, isFolder: false, active: true, isBoolean: true},
                    {name: tableFields.width, isFolder: false, active: false, isBoolean: false},
                    {name: tableFields.textWidget, isFolder: false, active: false, isBoolean: true, enabled: type == dataType.text}
                ]
            }, tableModelTreeRoot);
    }
});

/**
 * The data source used to contain the data of the form created by the user.
 */
isc.DataSource.create({
    ID:"dataModelDs",
    clientOnly: true,
    fields : [
        { name: "id", primaryKey:true, canEdit: false },
        { name: "title", type:"text", canSort: false },
        { name: "type", type:"select", canSort: false, valueMap: {
                "text" : dataType.text,
                "staticText" : dataType.staticText,
                "int" : dataType.int,
                "double" : dataType.double,
                "boolean" : dataType.boolean,
                "date" : dataType.date,
                "time" : dataType.time,
                "reference" : dataType.reference
            }
        },
        { name: "minlength", type:"integer", canSort: false },
        { name: "maxlength", type:"integer", canSort: false },
        { name: "required", type: "boolean" }
    ]
});

/**
 * The model object for the table model.
 */
Tree.create({
    ID:"tableModelTree",
    root: {name:"Root", children:[] },
    /**
     * Generates the unique identifier based on the highest number in the table.
     */
    generateId: function() {
        var max = 0;
        for(var i = 0, l = tableModelTreeRoot.children.length; i < l; i++) {
            var curID = tableModelTreeRoot.children[i].id;
            if(curID > max) {
                 max = curID;
            }
        }
        return max + 1;
    },
    
    /**
     * Removes a node and subnodes from the tree.
     * @param formComposerRecord the record of the form composer.
     */
    removeRecord: function(formComposerRecord) {
        var dataModelId = formComposerRecord.dataModelForeignKey;
        for(var i = 0, l = tableModelTreeRoot.children.length; i < l; i++) {
            var curDmKey = tableModelTreeRoot.children[i].dataModelForeignKey;
            if(dataModelId == curDmKey) {
                this.remove(tableModelTreeRoot.children[i]);
                break;
            }
        }
    },
    
    /**
     * Removes all nodes from the tree.
     */
    removeAll: function() {
        for(var i = 0, l = tableModelTreeRoot.children.length; i < l; i++) {
            this.remove(tableModelTreeRoot.children[0]);
        }
    },
    
    /**
     * Synchronizes the title of the table model type with the label of the 
     * form composer table.
     * @param formComposerRecord The form composer record.
     */
    synchronizeTitle: function(formComposerRecord) {
        var dataId = formComposerRecord.dataModelForeignKey;
        for(var i = 0, l = tableModelTreeRoot.children.length; i < l; i++) {
            var curDmKey = tableModelTreeRoot.children[i].dataModelForeignKey;
            if(dataId == curDmKey) {
                // synchronize here.
                tableModelTreeRoot.children[i].name = formComposerRecord.label;
                tablePropertiesTree.redraw();
                break;
            }
        }
    },
    
    /**
     * Adds an entry to the tree based on a field with name value pairs.
     * @param The field as it is stored in JSON.
     */
    createTableModelEntry: function(field) {
        var newId = field.id;
        var parentNode = tableModelTree.add(
            {name: field.name, isFolder: true, active: null, id: newId, dataModelForeignKey: field.dataModelForeignKey, children:[
                    {name: tableFields.visible, isFolder: false, active: field.Visible, isBoolean: true},
                    {name: tableFields.sort, isFolder: false, active: field.Sort, isBoolean: true},
                    {name: tableFields.editable, isFolder: false, active: field.Editable, isBoolean: true},
                    {name: tableFields.reorder, isFolder: false, active: field.Reorder, isBoolean: true},
                    {name: tableFields.filter, isFolder: false, active: field.Filter, isBoolean: true},
                    {name: tableFields.width, isFolder: false, active: field.Width != null, isBoolean: false, value: field.Width },
                    {name: tableFields.textWidget, isFolder: false, active: false, isBoolean: true}
                ]
            }, tableModelTreeRoot);
    }
    
});

var tableModelTreeRoot = tableModelTree.find("Root");

