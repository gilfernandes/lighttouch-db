
/**
 * Simple utility used to fetch the edited record.
 */
var editRecordUtil = {

    /**
     * Returns the record that is currently being edited.
     * @return the record that is currently being edited.
     */
    getEditRecord: function() {
        var editRow = formComposerList.getEditRow();
        var data = formComposerList.data;
        return data.get(editRow);
    }
}

var destroyUtil = {
    /**
     * List with elements that must be destroyed.
     */
    destroyElements: [],
    
    /**
     * Destroys those temporary canvases created by SmartClient on edit.
     * 
     */
    destroyTemporaryElements: function() {
        with(destroyUtil) {
            for(var i = 0; i < destroyElements.length; i++) {
                destroyElements[i].destroy();
                destroyElements.splice(i, 1);
                i--;
            }
        }
    }
}



/**
 * Flexible canvas that displays a different editor according to the 
 * type that is associated to an item.
 */
isc.defineClass("FlexCanvas", "Canvas").addProperties({
    overflow: "visible",
    canDragResize: true,
    redrawOnResize:false,
    padding: 0,
    canvasType: "",
    idSuffix: "_flexArea",
    elemIdSuffix: "_element",
    formItem: null,
    dateWidget: null,
    dateWidgetLayout: null,

    setCanvasType: function(type) {
        this.canvasType = type;
    },

    getInnerHTML : function () {
        var editorId =  this.getID() + this.idSuffix;
        return "<div style='" + (isc.isA.Number(this.width) ? "width:" + this.width + "px;" : null) +
            "' class='widgetForm' id='" + editorId + "'></div>";
    },

    draw : function() {
        this.Super("draw",arguments);
        this.loadEditor();
        var self = this;
        document.getElementById(self.getElementId()).focus();
        return this;
    },

    getTextBoxWidth: function() {
        return (isc.isA.Number(this.width) ? (this.width - 10) : 100);
    },

    getTextBoxHeight: function() {
        return (isc.isA.Number(this.height) ? (this.height - 10) : 100);
    },

    getElementStyleHTML : function () {
        
        var width = this.getTextBoxWidth(),
            height = this.getTextBoxHeight();

        return isc.StringBuffer.concat(
            (isc.Browser.isMoz && isc.isA.String(this.wrap) && this.wrap.toLowerCase() != "off" ? 
                      "' ROWS=10 COLS=10" : "'"),
            " STYLE='",
            this.getElementCSSText(width,height),
            "' ");
    },

    //> @attr TextAreaItem.minHeight (integer : 16 : IRW)
    // Minimum valid height for this TextAreaItem in px. If the specified +link{TextAreaItem.height}
    // is less than this value, the text area will still render at this height.
    // @visibility external
    //<
    minHeight:16,
    
    // helper to return the content of the "style" tag in the text box / data element
    getElementCSSText : function (width, height) {
        
        if (isc.isA.Number(width) && width <= 0) width = 1;
        if (isc.isA.Number(height) && height < this.minHeight) height = this.minHeight;
    
        return isc.StringBuffer.concat(
            // Ensure there's no margin(helps with sizing and v-alignment with icons)
            
            (isc.Browser.isIE ? "margin-top:-1px;margin-bottom:-1px;margin-left:0px;margin-right:0px;" 
                              : "margin:0px;"),                    
            (isc.isA.Number(width)     ? "WIDTH:" + width + "px;" : ""),
            (isc.isA.Number(height)    && this.canvasType == fieldType.textarea ? "height:" + height + "px;" : ""),
            // text align property, known to be supported in IE6 and Moz/Firefox on
            // Windows, not supported on Safari 1.2
            (this.textAlign ? "text-align:" + this.textAlign + ";" : "")
        );
    },

    /**
     * Returns the identifier of the element which contains the HTML with the component.
     * @return the identifier of the element which contains the HTML with the component.
     */
    getEditorId: function() {
        var editorId =  this.getID() + this.idSuffix;
        return editorId;
    },

    /**
     * Cancels editing on escape or ends editing.
     */
    handleKeyUp: function(event) {
        if(event.keyCode == 50 || event.keyCode == 188) { // Prevent commas and quotes in the default value.
            document.getElementById(this.getElementId()).value = 
                stringUtils.replaceCommaQuotes(document.getElementById(this.getElementId()).value);
            this.saveEditData();
            return false;
        }
        if(event.keyCode == 27 && this.formItem){ // Escape
            formComposerList.cancelEditing();
        }
        else if (event.keyCode==13 && (this.canvasType == fieldType.text || this.canvasType == fieldType.heading1)) { // Enter
            this.saveEditData();
            formComposerList.endEditing();
        }
        else {
            this.saveEditData();
        }
        return true;
    },
    
    /**
     * Save edit data. Synchronizes the properties form with the underlying data source.
     * @param dateValue This is only there in case this is the date widget.
     */
    saveEditData: function(dateValue) {
        var editRecord = editRecordUtil.getEditRecord();
        if(document.getElementById(this.getElementId()).type == "checkbox") {
            editRecord.defaultValue = document.getElementById(this.getElementId()).checked;
        }
        else {
            if(!this.dateWidget) {
                editRecord.defaultValue = document.getElementById(this.getElementId()).value;
            }
            else if (dateValue) {
                if(!this.timeWidget) {
                    editRecord.defaultValue = dateValue;
                }
                else {
                    editRecord.defaultValue = dateValue.getHours() + ":" + dateUtil.padSimple(dateValue.getMinutes());
                }
            }
        }
        propertiesForm.editSelectedData(formComposerList);
        destroyUtil.destroyTemporaryElements();
    },

    /**
     * Loads the editor for each different component.
     */
    loadEditor: function() {
        
        if(typeof("formComposerList") != "undefined") {
            this.canvasType = formComposerList.currentEditType;
        }
        var textPrefix = '<table>\
                                <tbody>\
                                    <tr>\
                                        <td style="padding-top: 0px; padding-bottom: 0px; margin: 0; overflow: hidden; height: ' + this.getTextBoxHeight() +  'px;">';
        var textPosfix = '             </td>\
                                    </tr>\
                                </tbody>\
                          </table>';
        switch(this.canvasType) {
            case fieldType.text:
            case fieldType.heading1:
                document.getElementById(this.getEditorId()).innerHTML = 
                    textPrefix + 
                        '<input autocomplete="off" id="' + this.getElementId() + '" type="' + this.canvasType + '" ' + this.getElementStyleHTML() 
                        + '  value="" onkeyup="' + this.getID() + '.handleKeyUp(event)"/>' 
                    + textPosfix;
                break;
            case fieldType.checkbox:
                document.getElementById(this.getEditorId()).innerHTML = 
                    textPrefix + '<input id="' + this.getElementId() + '" type="' + this.canvasType + '" onclick="' + this.getID() + '.saveEditData();"/>' + textPosfix;
                break;
            case fieldType.combobox:
                var editRecord = editRecordUtil.getEditRecord();
                var elementId = this.getElementId();
                var comboHTML = textPrefix + '<select id="' + elementId + '" onchange="referenceHandler.changeDefault(this, ' + editRecord.id + ')">';
                comboHTML += formComposerList.fetchCurrentComboOptions();
                comboHTML += '</select>' + textPosfix;
                document.getElementById(this.getEditorId()).innerHTML = comboHTML;
                break;
            case fieldType.date:
            case fieldType.time:
                var editRecord = editRecordUtil.getEditRecord();
                this.dateWidgetLayout = dateUtil.createFormElement(true, this.getTextBoxHeight(), editRecord.defaultValue, this.canvasType == fieldType.time);
                document.getElementById(this.getEditorId()).innerHTML = '<div id="' + this.getElementId() + '"></div>';
                this.dateWidgetLayout.setHtmlElement(document.getElementById(this.getElementId()));
                this.dateWidget = this.dateWidgetLayout.members[0];
                this.dateWidget.flexCanvas = this;
                this.timeWidget = this.canvasType == fieldType.time;
                destroyUtil.destroyElements[destroyUtil.destroyElements.length] = this.dateWidgetLayout;
                break;
            case fieldType.reference:
                var editRecord = editRecordUtil.getEditRecord();
                var elementId = this.getElementId();
                var comboHTML = textPrefix + formComposerList.renderReferenceCombo(editRecord, elementId) + textPosfix;
                document.getElementById(this.getEditorId()).innerHTML = comboHTML;
                break;
            default:
                document.getElementById(this.getEditorId()).innerHTML = 
                    '<textarea cols="20" rows="2" id="' + this.getElementId() + '" ' + this.getElementStyleHTML() 
                        + ' onkeyup="' + this.getID() + '.handleKeyUp(event)"></textarea>';
        }
        propertiesForm.editSelectedData(formComposerList);
    },

    /**
     * Returns the element identifier of the text box, text area or checkbox, etc.
     */
    getElementId: function() {
        return this.getID() + this.idSuffix + this.elemIdSuffix;
    }
});

/**
 * Flexible item editor that displays different editors according to 
 * the type of the data to be edited.
 */
isc.defineClass("FlexFormItem","CanvasItem").addProperties({
    canvasConstructor: FlexCanvas,
    blurAdded: false,

    getValue : function(callSetter) {
        if(document.getElementById(this.canvas.getElementId())) {
            switch(this.canvas.canvasType) {
                case fieldType.text:
                case fieldType.textarea:
                case fieldType.heading1:
                    return document.getElementById(this.canvas.getElementId()).value;
                case fieldType.checkbox:
                    return document.getElementById(this.canvas.getElementId()).checked;
            }
        }
        return this.Super("getValue");
    },

    setValue : function(value) {
        if(document.getElementById(this.canvas.getElementId())) {
            this.canvas.formItem = this;
            if(true) {
                var self = this;
                document.getElementById(this.canvas.getElementId()).addEventListener('blur', 
                    function() {
                        if(this.canvas) {
                            this.canvas.saveEditData();
                        }
                    },
                false);
                this.blurAdded = true;
            }
            if(value != null) {
                switch(this.canvas.canvasType) {
                    case fieldType.text:
                    case fieldType.textarea:
                    case fieldType.heading1:
                        document.getElementById(this.canvas.getElementId()).value = value;
                        break;
                    case fieldType.checkbox:
                        if(value != "false") {
                            document.getElementById(this.canvas.getElementId()).checked = value;
                        }
                        break;
                    
               }
            }
        }
        this.Super("setValue", value);
    }
});

/**
 * Flexible item editor that displays different editors according to 
 * the type of the data to be edited.
 */
isc.defineClass("InteractiveTextItem","TextItem").addProperties({

    /**
     * Synchronizes in real time the properties form.
     */
    keyUp: function (item, form, keyName) {
        this.setValue(stringUtils.replaceCommaQuotes(this.getValue()));
        var currentRecord = formComposerList.getCurrentRecordSet();
        currentRecord.label = this.getValue();
        propertiesForm.editSelectedData(formComposerList);
        
        // Synchronizes with the data model table.
        dataModelGrid.synchronizeTitle(currentRecord);
        tableModelTree.synchronizeTitle(currentRecord);
    }
});

/**
 * Used to set the default value on references without being in edit mode.
 */
isc.defineClass("ReferenceHandler", "Class").addProperties({
    
    /**
     * Triggered when the reference combo box is changed.
     * @param selectObj The combo box with the references.
     * @param recId The record identifier. May be {@code null} and in this 
     * case the identifier must be in the identifier of the {@code selectObj}.
     */
    changeDefault: function(selectObj, recId) {
        var selectedId = selectObj.options[selectObj.options.selectedIndex].value;
        var recordId = recId ? recId : selectObj.id.replace(/\w+\_/, "");
        for(var i = 0, l = formComposerList.data.getLength(); i < l; i++) {
            var record = formComposerList.data.get(i);
            if(record.id == recordId) {
                record.defaultValue = selectedId;
            }
        }
    }
})

/**
 * Performs global operations related to a reference.
 */
var referenceHandler = isc.ReferenceHandler.create({
    ID: "referenceHandler"
})

/**
 * The grid where the fields are to be displayed.
 */
isc.FormTileGrid.create({
    ID: "formComposerList",
    dataSource:"fieldsDs",
    height: globals.formComposerListHeight,
    autoDraw:false,
    showHeader: true,
    width: "100%",
    canAcceptDroppedRecords: true,
    canEdit:true,
    cellHeight: 50,
    editEvent:"click",
    dropSource: "formToolsGrid", // The source of the drop operation.
    dropRecord: null, // The last dropped record.
    recordMap: {},

    /**
     * Populates the form on the first load.
     */
    populate: function() {
        openDefinitionDs.fetchOptionData(); // Refresh the options used to create references.
        var self = this;
        setTimeout(function() {
            if(typeof("formToolsGrid") != "undefined") {
                try {
                    var sampleRecord = formToolsGrid.data[1];
                    formToolsGrid.selectRecord(sampleRecord);
                    self.transferSelectedData(formToolsGrid, 0);
                }
                catch(e) {
                    self.populate();
                }
            }
            else {
                self.populate();
            }
        }, 100);
    },
    
    /**
     * In case dropped records are from the form tools grid nothing is done except calling
     * the parent function. In case the records come from the data model grid the
     * data record is dynamically transformed so that it can be rendered correctly.
     */
    recordDrop: function(dropRecords, targetRecord, index, sourceWidget) {
        this.dropSource = sourceWidget.ID;
        if(sourceWidget.ID == "formToolsGrid") {
            this.Super("recordDrop", arguments);
        }
        else if (sourceWidget.ID == "dataModelGrid" && dropRecords && dropRecords.length > 0) {
            this.dropRecord = dropRecords[0]; // we just allow one record at a time.
            var widgetTypeMap = new Array();
            widgetTypeMap[dataType.boolean] = editorType.checkbox;
            widgetTypeMap[dataType.date] = editorType.date;
            widgetTypeMap[dataType.time] = editorType.time;
            widgetTypeMap[dataType.reference] = editorType.reference;
            widgetTypeMap[dataType.staticText] = editorType.heading1;
            for(var i = 0, l = dropRecords.length; i < l; i++) {
                var editType = widgetTypeMap[dropRecords[i].type];
                dropRecords[i].widgetType = typeof(editType) == "undefined" ? editorType.text : editType;
                this.Super("recordDrop", arguments);
                return;
            }
        }
        else {
            this.Super("recordDrop", arguments);
        }
    },
    
    /**
     * Ensures that data is transferred to the data and table column models.
     * Needed for SmartClient 8.1.
     */
    addData : function (newRecord, callback, requestProperties) {
        this.Super("addData", arguments);
        fieldsDs.performAddData(newRecord, callback, requestProperties);
    },

    /**
     * Processes the deletion of the fields.
     * @param key The primary key of the record.
     */
    processDelete: function(key) {
        var self = this;
        isc.ask("Are you sure you want to delete this item?", function(doDelete) {
            if(doDelete) {
                var record = self.recordMap[key];
                if(record) {
                    fieldsDs.removeData(record);
                    tableModelTree.removeRecord(record);
                    isc.ask("Would you like to remove the corresponding data model field?",
                        function(value) {
                            if(value) {
                                dataModelGrid.removeRecord(record);
                            }
                        }
                    );
                }
            }
        });
    },

    /**
     * Fetches the current combo options for the combo which is being edited.
     * @param record The record associated to the combo box.
     */
    fetchCurrentComboOptions: function(record) {
        var comboHTML = "";
        if(!record) {
            record = this.data.get(this.getEditRow());
        }
        var options = record.options;
        if(!options) {
            options = record.options = "option 1\noption 2\noption 3";
        }
        var data = this.data;
        var split = options.split("\n");
        for(var i = 0, c = split.length; i < c; i++) {
            if(split[i]) {
                comboHTML += '<option value="' + split[i] + '"' + (record.defaultValue == split[i] ? ' selected="true"' : '') + '>' + split[i] + '</option>';
            }
        }
        return comboHTML;
    },
    
    /**
     * Renders the reference combo.
     * @param record The record associated to the rendered combo box.
     * @param elementId The identifier of the element to be rendered.
     */
    renderReferenceCombo: function(record, elementId) {
        // Extracting the columns of the referenced table.
        var data = openDefinitionDs.optionData;
        var tableName = tableColumn = "&lt;unknown&gt;";
        for(var i = 0, l = data.length; i < l; i++) {
            if(record.table == data[i].key) {
                tableName = data[i].value;
                var dataModelData = data[i].dataModelData;
                var dataModel = eval('(' + dataModelData + ')');
                if(dataModel.fields) {
                    for(var j = 0, jL = dataModel.fields.length; j < jL; j++) {
                        if(dataModel.fields[j].id == record.tableColumn) {
                            tableColumn = dataModel.fields[j].title;
                            break;
                        }
                    }
                }
                break;
            }
        }
        return 'Reference to: <input class="referenceTextFields" type="text" value="' + tableName + '" disabled="true"/>' +
            '. Displayed Column: ' + 
            '<input type="text"  class="referenceTextFields" value="' + tableColumn + '" id="' + elementId + '" disabled="true"/>';
    },

    /**
     * Updates the properties list on selection change.
     */
    selectionChanged: function(record, state) {
        this.Super("selectionChanged", arguments);
        setTimeout(function() {propertiesForm.editSelectedData(formComposerList)}, 500);
    },
    
    /**
     * Submits the properties view loader form first and then
     * calls super.
     */
    endEditing: function() {
        propertiesForm.submit();
        this.Super("endEditing", arguments);
        destroyUtil.destroyTemporaryElements();
    },
    
    /**
     * Cancels editing.
     */
    cancelEditing: function() {
        this.Super("cancelEditing", arguments);
        destroyUtil.destroyTemporaryElements();
    },
    
    /**
     * Destroys virtual elements.
     */
    editorExit: function(editCompletionEvent, record, newValue, rowNum, colNum) {
        this.Super("editorExit", arguments);
        destroyUtil.destroyTemporaryElements();
    },

    /**
     * Creates the HTML for the different types of widgets.
     * @param value The value of the widget.
     * @param record The record to be rendered.
     */
    renderWidget: function(value, record, rowNum, colNum, grid) {
        var widgetType = record.widgetType;
        var field = "";
        var clickHandler = 'onclick="this.blur(); ' + grid.ID + '.startEditing (' + rowNum + ',' + colNum + ', false, \'\', \'' + widgetType + '\')"';
        var compId = ' id="' + value + '_' + record.id + '"';
        var defaultValue = record.defaultValue ? (record.defaultValue != "false" ? record.defaultValue : false) : "";
        switch(widgetType) {
            case fieldType.textarea:
                field = '<textarea rows="' + (record.rows ? record.rows : '2') + '" cols="' + (record.cols ? record.cols : '20') + '" '
                    + clickHandler + compId + '>' + defaultValue + '</textarea>';
                break;
            case fieldType.text:
                field = '<input type="' + record.widgetType + '" + ' + clickHandler + compId + ' value="' + defaultValue + '"' 
                    + (record.size ? ' size="' + record.size + '"' : "") + '/>';
                break;
            case fieldType.checkbox:
                field = '<input type="' + record.widgetType + '" + ' + clickHandler + compId + (defaultValue ? ' checked="checked"' : '') + '/>';
                break;
            case fieldType.combobox:
                var selectId = "option_" + record.id;
                field = '<select id="' + selectId + '" onchange="referenceHandler.changeDefault(this)">' + this.fetchCurrentComboOptions(record) + '</select>';
                break;
            case fieldType.reference:
                field = this.renderReferenceCombo(record)
                break;
            case fieldType.heading1:
                if(!defaultValue) {
                    field = '<div class="suggest">&lt;Click to enter text&gt;</div>';
                }
                else {
                    field = '<h1>' + defaultValue + '</h1>';
                }
                break;
            case fieldType.date:
                return dateUtil.renderDateWidget(defaultValue);
            case fieldType.time:
                return dateUtil.renderDateWidget(defaultValue, true);
        }
        return '<form class="widgetForm">\
            ' + field + '\
        </form>';
    },

    /**
     * When the editing process is started the current edited type is set.
     * @param rowNum The number of the row.
     * @param colNum The column number.
     * @param suppressFocus Ignored.
     * @param eventType Ignored.
     * @param recordType The type of record.
     */
    startEditing: function(rowNum, colNum, suppressFocus, eventType, recordType) {
        
        var dataRow = this.data.get(rowNum);
        if(recordType) {
            this.currentEditType = recordType;
        }
        else {
            if(dataRow) {
                this.currentEditType = dataRow.widgetType;
            }
        }
        this.turnOnFinishEditButton(rowNum);
        this.Super("startEditing",arguments);
    },

    /**
     * Updates the properties form.
     */
    recordClick: function() {
        propertiesForm.editSelectedData(this);
    },

    /**
     * Turns on the finish edit button.
     * @param rowNum The row number.
     */
    turnOnFinishEditButton: function(rowNum) {
        var editButtonLink = document.getElementById("finishEditButton_" + rowNum);
        if(editButtonLink) {
            editButtonLink.style.display = 'block';
        }
    },
    
    /**
     * Returns the record the is currently highlighted or active.
     * @return the record the is currently highlighted or active.
     */
    getCurrentRecordSet: function() {
        var editRow = this.getEditRow();
        var data = this.data;
        return data.get(editRow);
    },

    fields:[
        {name: "id", title: "ID", width: "3%"},
        {name: "dataModelForeignKey", title: "DID", width: "4%", canEdit: false},
        {name:"label", type:"InteractiveTextItem", width: "16%",
            formatCellValue: function (value, record, rowNum, colNum, grid) {
                if(!value) {
                    record.label = record.title + " " + record.id;
                }
                var required = false;
                for(var i = 0, l = dataModelGrid.data.size(); i < l; i++) {
                    var dataRecord = dataModelGrid.data.get(i);
                    if(record.dataModelForeignKey == dataRecord.id) {
                        required = dataRecord.required;
                        break;
                    }
                }
                return record.label + (required ? ' <span class="required">*</span>' : '');
            },
            formatEditorValue: function (value, record, rowNum, colNum) {
                return record.label;
            },
            /**
             * Sets the record label field to be the entered value and turns on the finish edit button.
             * @param value The value used for the label.
             * @param rowNum The row number.
             */
            editorEnter: function (record, value, rowNum, colNum, grid) {
                record.label = value;
            }
        },
        {name:"defaultValue", type:"text", width: "76%", defaultValue: "", editorType: "FlexFormItem",
            formatCellValue: function (value, record, rowNum, colNum, grid) {
                return grid.renderWidget(value, record, rowNum, colNum, grid);
            },
            formatEditorValue: function (value, record, rowNum, colNum) {
                return value;
            },
            editorExit: function (editCompletionEvent, record, newValue, rowNum, colNum) {
                return true;
            }
        },
        {name:"finishEditButton", type:"text", width: "4%", showTitle: false, canEdit: false,
            formatCellValue: function (value, record, rowNum, colNum, grid) {
                return '<a id="finishEditButton_' + rowNum + '" href=""\
                            title="Finish" onclick="' + grid.ID + '.endEditing(); return false;" class="endEditRollover" style="display: none"><span>&nbsp;</span></a>';
            }
        },
        {name:"deleteButton", type:"text", width: "4%", canEdit: false, showTitle: false,
            formatCellValue: function (value, record, rowNum, colNum, grid) {
                grid.recordMap[record.id] = record;
                return '<a href=""\
                           title="Close" onclick="' + grid.ID + '.processDelete(' + record.id + '); return false;" class="rollover"><span>&nbsp;</span></a>';
            }
        }
    ]
});

isc.Page.setEvent("load", function() {
    formComposerList.populate();
});