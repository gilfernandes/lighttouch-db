
/**
 * Grid model with the data elements.
 */
isc.ListGrid.create({
    ID: "dataModelGrid", autoDraw:false,
    dataSource:"dataModelDs",
    canDragRecordsOut: true,
    canAcceptDroppedRecords: false,
    canReorderRecords: false,
    canEdit:true,
    leaveScrollbarGap:false,
    editEvent:"click",
    selectionType: "single",
    hoverWidth: 150,
    
    /**
     * Hides some of the fields.
     */
    init: function() {
        this.Super("init", arguments);
        this.hideField(this.getField(CONSTANTS.get("TABLE")));
        this.hideField(this.getField(CONSTANTS.get("TABLE_COLUMN")));
    },
    
    /**
     * Removing all the data from this table.
     */
    removeAllData: function() {
        for(var i = 0, l = this.data.length; i < l; i++) {
            this.data.removeAt(0);
        }
    },
    
    /**
     * Synchronizes the title of the data type with the label of the 
     * form composer table.
     * @param formComposerRecord The form composer record.
     */
    synchronizeTitle: function(formComposerRecord) {
        var dataId = formComposerRecord.dataModelForeignKey;
        for(var i = 0, length = this.data.getLength(); i < length; i++) {
            var curId = this.data.get(i).id;
            if(curId == dataId) {
                var dataModelRecord = this.data.get(i);
                dataModelRecord.title = formComposerRecord.label ? formComposerRecord.label.simplify() : "";
                this.data.set(i, dataModelRecord);
                break;
            }
        }
    },
    
    /**
     * Removes a specific data model record from the internal data source.
     * @param formComposerRecord The form composer record corresponding 
     * to the record which is to be removed.
     */
    removeRecord: function(formComposerRecord) {
        var dataId = formComposerRecord.dataModelForeignKey;
        for(var i = 0, length = this.data.getLength(); i < length; i++) {
            var curId = this.data.get(i).id;
            if(curId == dataId) {
                this.data.removeAt(i);
                break;
            }
        }
    },

    /**
     * HACK: Manual change of the data object.
     * Also converts the widget type in the form composer table in case 
     * the boolean widget type is selected.
     */
    editComplete: function(rowNum, colNum, newValues, oldValues, editCompletionEvent) {
        if(newValues.type == dataType.reference) {
            // This is not supported - change anything into a reference.
            isc.warn("Sorry, objects cannot be converted into references. Please create one by dragging from the 'Form Elements' panel.");
            return;
        }
        else if (oldValues.type == dataType.reference && newValues.type) {
            var self = this;
            // This is not supported - change anything into a reference.
            isc.warn("References cannot be changed into other types. Please create one by dragging from the 'Form Elements' panel.",
               function() {self.redraw()});
            return;
        }
        for(var i = 0, length = this.data.getLength(); i < length; i++) {
            var curObj = this.data.get(i);
            var curId = curObj.id;
            if(curId == newValues.id) {
                if(newValues.title) {
                    curObj.title = newValues.title;
                }
                if(newValues.required == true || newValues.required == false) {
                    curObj.required = newValues.required;
                    this.refreshFormcomposerList(curObj);
                }
                if (newValues.minlength) {
                    curObj.minlength = newValues.minlength;
                }
                if (newValues.maxlength) {
                    curObj.maxlength = newValues.maxlength;
                    this.refreshFormcomposerList(curObj);
                }
                if (newValues.type) {
                    curObj.type = newValues.type;
                    this.refreshFormcomposerList(curObj);
                }
                break;
            }
        }
        this.Super("editComplete", arguments);
    },
    
    /**
     * Refreshes the element in the form composer table.
     */
    refreshFormcomposerList: function(curObj) {
        for(var i = 0, l = formComposerList.data.size(); i < l; i++) {
            var record = formComposerList.data.get(i);
            if(record.dataModelForeignKey == curObj.id) {
                switch(curObj.type) {
                    case dataType.int:
                    case dataType.double:
                        curObj.minlength = null;
                        curObj.maxlength = null;
                        break;
                    case dataType.boolean:
                        curObj.minlength = null;
                        curObj.maxlength = null;
                        record.widgetType = fieldType.checkbox;
                        record.defaultValue = false;
                        break;
                    default:
                        if(curObj.maxlength > 255){
                            record.widgetType = fieldType.textarea;
                        }
                        record.defaultValue = null;
                }
                formComposerList.redraw();
                break;
            }
        }
    },
    
    /**
     * Updates the reference data on the internal table data.
     * @param tableVal The identifier of the referenced table.
     * @param tableColVal The identifier of the referenced column.
     * @param dataModelId The identifier of the field in the data model.
     */
    updateReferenceData: function(tableVal, tableColVal, dataModelId) {
        for(var i = 0, l = this.data.length; i < l; i++) {
            if(this.data[i].id == dataModelId) {
                this.data[i].table = tableVal;
                this.data[i].tableColumn = tableColVal;
                return;
            }
        }
    },
    
    fields:[
        {name:"id", title: "ID", width: "8%"},
        {name:"title", type:"text", width: "22%", showHover:true, hoverHTML: function(record) {
            return 'Click to change the title.';
        }},
        {name:"minlength", type:"integer", editorType: "spinner", width: "15%", title: "Min", 
            showHover:true, hoverHTML: function(record) {
            return 'Click to change the minimum length. (Applies only to text fields)';
        }},
        {name:"maxlength", type:"integer", editorType: "spinner", width: "15%", title: "Max",
            showHover:true, hoverHTML: function(record) {
            return 'Click to change the maximum length. (Applies only to text fields)';
        }},
        {name:"type", type:"select", width: "30%", 
            showHover:true, hoverHTML: function(record) {
                return 'Click to change the data type.';
            },
            change: function(form, formItem, value, oldValue) {
                if(oldValue == "time" || oldValue =="date" || oldValue == "reference") {
                    // we do not allow to change certain complex types.
                    return false;
                }
                return true;
            }
        },
        {name:"required", type:"checkbox", width: "8%", type: "boolean"},
        {name: CONSTANTS.get("TABLE"), type:"integer", width: "0" },
        {name: CONSTANTS.get("TABLE_COLUMN"), type:"integer", width: "0" }
    ]
});