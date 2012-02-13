
/**
 * The area used to display JSON either for import or export.
 */
var JSON_DISPLAY_AREA = "formDataDisplayArea";

/**
 * The simple form used to enter JSON.
 */
isc.defineClass("JsonForm", "DynamicForm").addProperties({
    autoDraw: false,
    height: 350,
    width: 600,
    numCols: 1,
    padding:4
})

/**
 * Struct with the Json texts.
 * @param formJson The JSON of the form definition.
 * @param dataJson The JSON of the data definition.
 * @param tableJson The JSON of the table definition.
 */
var DataContainer = function(formJson, dataJson, tableJson) {
    this.formJson = formJson;
    this.dataJson = dataJson;
    this.tableJson = tableJson;
}

/**
 * Collection of integers representing types of post save actions.
 */
var postSaveActions = {
    OPEN_PREVIEW_FORM: 1
}


var previewOperations = {

    /**
     * Opens the form definition dialogue.
     * @param formId The form identifier.
     */
    openFormDefinition: function(formId) {
        windowUtil.open("generator/generateForm/" + formId, 
                "viewFormWindow", 650, 650);
    }
}

/**
 * Library with functions for managing the data model, the table definition and the form definition.
 */
var moduleManagement = {
    
    /**
     * Backups the form definition.
     */
    backupForm: null,
    
    /**
     * Backups the data model.
     */
    backupData: null,
    
    /**
     * Backups the table definition.
     */
    backupTable: null,

    /**
     * Wipes out the content of the form editor, from the data model
     * and from the table designer. 
     */
    resetForm: function() {
        // Clear form composer.
        formComposerList.selectAllRecords();
        formComposerList.removeSelectedData();
        
        // Clear data model.
        dataModelGrid.removeAllData();
        hidePropertiesView();
        
        // Clear the table data.
        tableModelTree.removeAll();
        moduleManagement.clearData();
    },

    /**
     * Clears the data
     */
    clearData: function(doBackup) {
        
        if(doBackup) {
            backupForm = {
                id: currentForm.id,
                name: currentForm.name,
                description: currentForm.description
            }
            
            backupData = {
                id: currentData.id,
                name: currentData.name,
                description: currentData.description
            }
            
            backupTable = {
                id: currentTable.id,
                name: currentTable.name,
                description: currentTable.description
            }
        }
    
        // Clear the name of the form and data models.
        currentForm.name = null;
        currentForm.id = -1;
        currentForm.description = null;
        
        currentData.name = null;
        currentData.id = -1;
        currentData.description = null;
        
        currentTable.name = null;
        currentTable.id = -1;
        currentTable.description = null;
        
        formNameLabel.setContents(currentForm.blankFormName);
        dataModelNameLabel.setContents(currentData.blankDataName);
        tableModelNameLabel.setContents(currentTable.blankDataName);
    },
    
    /**
     * Resets the in-memory backup in case the user changed his mind.
     */
    resetBackup: function() {
        currentForm.name = backupForm.name;
        currentForm.id = backupForm.id;
        currentForm.description = backupForm.description;
        
        currentData.name = backupData.name;
        currentData.id = backupData.id;
        currentData.description = backupData.description;
        
        currentTable.name = backupTable.name;
        currentTable.id = backupTable.id;
        currentTable.description = backupTable.description;
        
        formNameLabel.setContents(currentForm.name);
        dataModelNameLabel.setContents(currentData.name);
        tableModelNameLabel.setContents(currentTable.name);
    }
}



/**
 * Pull down menu for the basic operations.
 */
isc.Menu.create({
    ID: "fileMenu",
    autoDraw: false,
    showShadow: true,
    shadowDepth: 10,
    
    /**
     * Pops up the dialogue to enter the meta data.
     * @param showJson If {@code true} then the JSON code is displayed to the user, else not.
     * @param doDeploy If {@code true} then the data is not only stored, but it is also deployed in Grails.
     */
    handleSaveAs: function(showJson, doDeploy) {
        moduleManagement.clearData(true);
        this.handleSave(showJson, doDeploy, true);
    },

    /**
     * Asks for the name of the form in case the name is not yet defined,
     * and in any case sends the data to the server to be saved.
     * @param showJson If {@code true} then the JSON code is displayed to the user, else not.
     * @param doDeploy If {@code true} then the data is not only stored, but it is also deployed in Grails.
     * @param doBackup If {@code true} the data will be backed up and also reset in case the 
     * user closes the window.
     * @param postSaveAction Integer which determines which action to execute after save.
     */
    handleSave: function(showJson, doDeploy, doBackup, postSaveAction) {
        if(!currentForm.name) {
            var self = this;
            isc.JsonFormWindow.create({
                ID: "firstSaveWindow",
                title: "Save Data Module",
                backup: doBackup,
                dismissOnEscape: false,
                items: [
                    isc.JsonForm.create({
                        ID: "firstSaveWindowForm",
                        numCols: 1,
                        titleOrientation:"top",
                        /**
                         * Saves the data model and the form definition to the server.
                         */
                        save: function() {
                            if(this.validate()) {
                                currentForm.name = this.getValue("formDataName");
                                currentForm.description = this.getValue("formDataDescription");
                                formNameLabel.setContents(currentForm.name);
                                
                                currentData.name = this.getValue("dataModelName");
                                currentData.description = this.getValue("dataModelDescription");
                                dataModelNameLabel.setContents(currentData.name);
                                
                                currentTable.name = this.getValue("tableDefinitionName");
                                currentTable.description = this.getValue("tableDefinitionDescription");
                                tableModelNameLabel.setContents(currentTable.name);
                                
                                var dataContainer = self.persistFormDefinition();
                                self.saveCall(dataContainer, doDeploy);
                            }
                            else {
                                isc.warn("Form validation failed. Please check the highlighted fields.");
                            }
                        },
                        formDataNameChanged: false,
                        tableDefinitionNameChanged: false,
                        fields: [
                            {name: "dataModelSection", defaultValue: "Data Model", type:"section", sectionExpanded:true, itemIds:["dataModelName", "dataModelDescription"]},
                            {name: "dataModelName", title: "Name", type: "text", width:580, required: true, defaultValue: doBackup ? backupData.name + " Copy": "",
                                /**
                                 * Writes to the form data and table definition name fields the new value.
                                 * @param form The reference to the current form.
                                 * @param item This text item.
                                 * @param value The new value to be copied across to the other fields.
                                 * @param oldValue The old value.
                                 */
                                change: function(form, item, value, oldValue) {
                                    if(!form.formDataNameChanged) {
                                        form.setValue("formDataName", value);
                                    }
                                    if(!form.tableDefinitionNameChanged) {
                                        form.setValue("tableDefinitionName", value);
                                    }
                                } 
                            },
                            {name: "dataModelDescription", title: "Description", type: "textarea", width:580},
                            {name: "formDataSection", defaultValue: "Form Data", type:"section", sectionExpanded:true, itemIds:["formDataName", "formDataDescription"]},
                            {name: "formDataName", title: "Form Data Name", type: "text", width:580, required: true, defaultValue: doBackup ? backupForm.name + " Copy": "",
                                change: function(form, item, value, oldValue) {
                                    form.formDataNameChanged = true;
                                }
                            },
                            {name: "formDataDescription", title: "Form Data Description", type: "textarea", width:580},
                            {name: "tableDefinitionSection", defaultValue: "Form Data", type:"section", sectionExpanded:true, itemIds:["tableDefinitionName", "tableDefinitionDescription"]},
                            {name: "tableDefinitionName", title: "Table Definition Name", type: "text", width:580, required: true, defaultValue: doBackup ? backupTable.name + " Copy": "",
                                 change: function(form, item, value, oldValue) {
                                     form.tableDefinitionNameChanged = true;
                                 }
                            },
                            {name: "tableDefinitionDescription", title: "Table Definition Description", type: "textarea", width:580},
                            {type: "toolbar", width: 100, height: 25, buttons: 
                                [{type: "button", title: msgSave, click: "firstSaveWindowForm.save();" },
                                {type: "button", title: msgCancel, click: "firstSaveWindow.hide();" }]
                            }
                        ]
                    })
                ],
                /**
                 * Resets the data in case the close click button was triggered.
                 */
                closeClick: function() {
                    if(this.backup) {
                        moduleManagement.resetBackup();
                    }
                    this.Super("closeClick", arguments);
                }
            }).show();
        }
        else {
            var dataContainer = this.persistFormDefinition(showJson);
            this.saveCall(dataContainer, doDeploy, postSaveAction);
        }
    },

    /**
     * Saves the data either creating new entity objects (in case there is no id)
     * or updates the existing.
     * @param dataContainer The data container.
     * @param doDeploy If {@code true} this data model is to be deployed, else not.
     * @param postSaveAction Integer which determines which action to execute after save.
     */
    saveCall: function(dataContainer, doDeploy, postSaveAction) {
        var params = { 
            formId: currentForm.id,
            formName: currentForm.name,
            formDescription: currentForm.description,
            formDefinition: dataContainer.formJson,
            dataModelId: currentData.id,
            dataModelName: currentData.name,
            dataModelDescription: currentData.description,
            dataModelData: dataContainer.dataJson,
            tableDefinitionId: currentTable.id,
            tableDefinitionName: currentTable.name,
            tableDefinitionDescription: currentTable.description,
            tableDefinitionData: dataContainer.tableJson,
            doDeploy: doDeploy ? true : null
        };
        if(currentForm.id <= 0 || currentData.id <= 0 || currentTable.id <= 0) { // If there is no id on one of the entities create a new one.
            params.id = null; // Ensure that no identifier is there.
            RPCManager.sendRequest({ 
                params: params,
                httpMethod: "POST",
                useSimpleHttp: true,
                callback: "fileMenu.saveCallback(data)",
                actionURL: "formDefinition/saveJson"
            });
        }
        else {
            RPCManager.sendRequest({ 
                params: params, 
                httpMethod: "POST",
                useSimpleHttp: true,
                callback: "fileMenu.saveCallback(data" + (typeof(postSaveAction) != "undefined" ? "," + postSaveAction : "") + ")",
                actionURL: "formDefinition/updateJson"
            });
        }
    },
    
    /**
     * Analyses the return code and displays a message to the user.
     * @param data The data from the request.
     * @param postSaveAction If defined, then an action is executed after the body of this function
     * in case of success.
     */
    saveCallback: function (data, postSaveAction) {
        var dataObj = eval('(' + data + ')');
        if(dataObj.response.status == 0) {
            currentForm.id = dataObj.object.formDefinitionId;
            currentData.id = dataObj.object.id;
            currentTable.id = dataObj.object.tableDefinitionId;
            dataModelNameLabel.setContents(currentData.name + ' (' + currentData.id + ')');
            formNameLabel.setContents(currentForm.name + ' (' + currentForm.id + ')');
            tableModelNameLabel.setContents(currentTable.name + ' (' + currentTable.id + ')');
            openDefinitionDs.fetchOptionData(); // Refresh the options used to create references.
            console.log("postSaveAction: " + postSaveAction);
            if(postSaveAction) {
                switch(postSaveAction) {
                    case postSaveActions.OPEN_PREVIEW_FORM:
                        console.log("Opening preview form ...");
                        previewOperations.openFormDefinition(currentForm.id);
                        break;
                }
            }
            else {
               isc.say("Data and form definitions saved to the database.",
                    function() {
                        if(typeof (firstSaveWindow) != 'undefined') firstSaveWindow.hide();
                    }
               );
            }
        }
        else {
            isc.warn("An unexpected error occurred. Status Code: " + data.status);
        }
    },
    
    /**
     * Checks the return code and displays a message to the user.
     */
    deleteCallback: function(data) {
        var dataObj = eval('(' + data + ')');
        if(dataObj.response.status == 0) {
            isc.say("Data and form definition has been deleted from the database.", function() {
                tableUtil.refreshTable(openDefinitionList);
                if(dataObj.object.id == currentData.id) {
                    moduleManagement.resetForm();
                }
            });
        }
        else {
            isc.warn("An unexpected error occurred. Status Code: " + data.status);
        }
    },

    /**
     * Creates the JSON with the form data and the data model and saves it to the server.
     * @param showJson If {@code true} displays the JSON in a separate window, else not.
     */
    persistFormDefinition: function(showJson) {
        
        var domainValues = {};
        var formJson = this.createJson(formComposerList, currentForm.name, false, domainValues);
        // Create the data JSON.
        var dataJson = this.createJson(dataModelGrid, currentData.name, true, domainValues);
        
        var tableJson = jsonGenerator.createTableJson(tablePropertiesTree, currentTable.name);
        
        var dataContainer = new DataContainer(formJson, dataJson, tableJson);
        if(showJson) {
            this.popupJsonWindow(dataContainer);
        }
        return dataContainer;
    },
    
    /**
     * Builds the JSON using the data in a data object.
     * @param dataObject The object which contains the data.
     * @param name The name of the object being saved.
     * @param includeTitle If {@code true} the title is included, else not.
     * @param domainValues The domain values collection.
     */
    createJson: function(dataObject, name, includeTitle, domainValues) {
        return jsonGenerator.createJson(dataObject, name, includeTitle, domainValues);
    },
    
    /**
     * Pops up a window with the form and the data model JSON.
     * @param dataContainer The form JSON.
     */
    popupJsonWindow: function(dataContainer) {
        
        var formFields = [
                          {name: JSON_DISPLAY_AREA, type: "textArea", width: "*", height: globals.jsonPopupDisplayHeight - 80, showTitle: false},
                          {type: "button", title: "Done", click: "modalWindow.hide();" }
        ];
        this.createPopupJsonTabset(formFields, globals.jsonPopupDisplayHeight, "Show JSON");
        formDataWindowForm.setValue(JSON_DISPLAY_AREA, dataContainer.formJson);
        dataModelWindowForm.setValue(JSON_DISPLAY_AREA, dataContainer.dataJson);
        tableModelWindowForm.setValue(JSON_DISPLAY_AREA, dataContainer.tableJson);
    },
    
    /**
     * Creates the popup JSON tabset.
     * @param formFields The fields in the form tab.
     * @param displayHeight The height of the display.
     * @param title The title of the JSON window.
     */
    createPopupJsonTabset: function(formFields, displayHeight, title) {
        
        isc.ValuesManager.create({
            ID: "dataModelValuesManager",
        });
        
        isc.JsonForm.create({
            ID: "formDataWindowForm",
            width: "100%",
            height: "100%",
            fields: formFields,
            valuesManager: dataModelValuesManager
        });
        
        isc.JsonForm.create({
            ID: "dataModelWindowForm",
            width: "100%",
            height: "100%",
            fields: formFields,
            valuesManager: dataModelValuesManager
        })
        
        isc.JsonForm.create({
            ID: "tableModelWindowForm",
            width: "100%",
            height: "100%",
            fields: formFields,
            valuesManager: dataModelValuesManager
        })
        
        isc.TabSet.create({
            ID: "jsonDisplayTabset",
            tabBarPosition: "top",
            width: globals.popupJsonWidth,
            height: displayHeight,
            tabs: [
                {title: "Form Data", pane: formDataWindowForm},
                {title: "Data Model", pane: dataModelWindowForm},
                {title: "Table Model", pane: tableModelWindowForm}
            ]
        });
        
        isc.JsonFormWindow.create({
            ID: "modalWindow",
            title: title,
            margin: 5,
            items: [
                jsonDisplayTabset
            ]
        }).show();
    },
    
    /**
     * Creates the JSON with the form data and saves it to the server.
     * @param showJson If {@code true} displays the JSON in a separate window, else not.
     */
    persistDataDefinition: function(showJson) {
        var formJson = this.createJson(formComposerList, currentForm.name);
        if(showJson) {
            isc.JsonFormWindow.create({
                ID: "modalWindow",
                title: "Show JSON",
                items: [
                    isc.JsonForm.create({
                        ID: "modalWindowForm",
                        fields: [
                            {name: "displayArea", type: "textArea", width: 600, height: 330, showTitle: false},
                            {type: "button", title: "Done", click: "modalWindow.hide();" }
                        ]
                    })
                ]
            }).show();
            modalWindowForm.setValue("displayArea", formJson);
        }
        return formJson;
    },

    /**
     * Starts the JSON import.
     */
    startImportJson: function() {
        var displayHeight = 330;
        formFields = moduleFunctions.createImportFields("fileMenu.importJson();", displayHeight, "modalWindow");
        this.createPopupJsonTabset(formFields, displayHeight, importJson);
    },
    
    /**
     * Processes the data in the import form which is distributed
     * over different tabs.
     */
    importJson: function() {
        if(dataModelValuesManager.validate()) {
            var formValue = formDataWindowForm.getValue(JSON_DISPLAY_AREA);
            var dataValue = dataModelWindowForm.getValue(JSON_DISPLAY_AREA);
            var tableValue = tableModelWindowForm.getValue(JSON_DISPLAY_AREA);
            var formValueDataObj = eval('(' + formValue + ')');
            var dataValueDataObj = eval('(' + dataValue + ')');
            var tableValuedataObj = eval('(' + tableValue + ')');
            // TODO: check with JSON Lint for JSON errors.
            if(formValueDataObj.fields.length > dataValueDataObj.fields.length) {
                isc.warn("Oops, there are more fields in the form than in the data model. " +
                    "Please check that there are more data fields than form fields or that they are equal.");
                return;
            }
            if(tableValuedataObj.fields.length > dataValueDataObj.fields.length) {
                isc.warn("Oops, there are more columns in the table than in the data model. " +
                    "Please check that there are more data fields than table columns or that they are equal.");
                return;
            }
            moduleManagement.resetForm();
            if(this.importFromStr(formValueDataObj, null, null, null, formComposerList, false)) {
                if(this.importFromStr(tableValuedataObj, null, null, null, tablePropertiesTree, false)) {
                    this.importFromStr(dataValueDataObj, null, null, null, dataModelGrid, true);
                }
            }
        }
        else {
            if(dataModelWindowForm.hasErrors()) {
                jsonDisplayTabset.selectTab(1);
            }
            else if (tableModelWindowForm.hasErrors()) {
                jsonDisplayTabset.selectTab(2);
            }
            else {
                jsonDisplayTabset.selectTab(0);
            }
        }
    },
    
    /**
     * Used to open a JSON definition from a string.
     * @param dataObj The object to be imported into the data source..
     * @param id The identifier coming from the database for the form or for the data model.
     * @param name The name of the entity.
     * @param description The description of the entity.
     * @param targetObject The object to which the data model is associated.
     */
    importFromStr: function(dataObj, id, name, description, targetObject, destroyDialogue) {
        
        var currentName = name == null ? dataObj.name : name;
        if(dataObj.name && dataObj.fields) {
            switch(targetObject) {
                case formComposerList:
                    for(var i = 0; i < dataObj.fields.length; i++) {
                        fieldsDs.addData(dataObj.fields[i], function() {}, {importing: true});
                    }
                    currentForm.name = currentName;
                    currentForm.id = id;
                    formNameLabel.setContents(currentForm.name);
                    break;
                case dataModelGrid:
                    currentData.name = currentName;
                    currentData.id = id;
                    dataModelNameLabel.setContents(currentData.name);
                    for(var i = 0; i < dataObj.fields.length; i++) {
                        if(i == 0) {
                            dataModelGrid.setData([dataObj.fields[i]])
                        }
                        else {
                            dataModelGrid.data.add(dataObj.fields[i]);
                        }
                    }
                    break;
                case tablePropertiesTree:
                    tableModelNameLabel.setContents(dataObj.name);
                    currentTable.name = currentName;
                    currentTable.id = id;
                    for(var i = 0, length = dataObj.fields.length; i < length; i++) {
                        tableModelTree.createTableModelEntry(dataObj.fields[i]);
                    }
                    break;
            }
            if(destroyDialogue && modalWindow) {
                modalWindow.hide();
                modalWindow.destroy();
            }
            return true;
        }
        else {
            isc.say("Import failed !!!! Check, if the name and the fields are specified.");
            return false;
        }
    },
    
    /**
     * Pops up a dialogue and displays the definitions that are currently on the 
     * system.
     */
    processOpen: function() {
        
        var fields = [
                      {name:"id", width: "4%"},
                      {name:"dataModelName", width: "28%"},
                      {name:"formDefinitionName", width: "29%"},
                      {name:"tableDefinitionName", width: "29%"}
        ];
        
        if(typeof securityInfo.isAdmin != 'undefined') {
            fields[fields.length] = {name:"userName", width: "10%"};
        }
        
        /**
         * The grid where the fields are to be displayed.
         */
        isc.ManagerListGrid.create({
            ID: "openDefinitionList",
            dataSource: "openDefinitionDs",
            fields: fields
        });
        
        // openDefinitionList.remove

        isc.OpenButton.create({
            ID: "formComposerListButton",
            click: function() {
                var selectedRecord = openDefinitionList.getSelectedRecord();
                if(!selectedRecord) {
                    isc.warn(msgSelectRecord);
                }
                else {
                    moduleManagement.resetForm();
                    var dataModelData = eval('(' + selectedRecord.dataModelData + ')');
                    fileMenu.importFromStr(
                        dataModelData, selectedRecord.id, selectedRecord.dataModelName, selectedRecord.dataModelDescription, dataModelGrid, false);
                    var formDefData = eval('(' + selectedRecord.formDefinitionFormData + ')');
                    fileMenu.importFromStr(
                        formDefData, selectedRecord.formDefinitionId, selectedRecord.formDefinitionName, selectedRecord.formDefinitionDescription, formComposerList, true);
                    var tableDefData = eval('(' + selectedRecord.tableDefinitionData + ')');
                    fileMenu.importFromStr(
                        tableDefData, selectedRecord.tableDefinitionId, selectedRecord.tableDefinitionName, 
                            selectedRecord.tableDefinitionDescription, tablePropertiesTree, true);
                }
            }
        });
        
        isc.IButton.create({
            ID: "viewFormButton",
            title: "View Form",
            click: function() {
                var selectedRecord = openDefinitionList.getSelectedRecord();
                if(!selectedRecord) {
                    isc.warn(msgSelectRecord);
                }
                else {
                    previewOperations.openFormDefinition(selectedRecord.formDefinitionId);
                }
            }
        });
        
        isc.TableButton.create({
            ID: "viewGenericTable",
            title: "Full Table",
            urlStr: "list/showRawList/",
            popupName: "showRawListWindow",
            popupWidth: 700,
            popupHeight: 600,
            idToUse: "id"
        });
        
        isc.TableButton.create({
            ID: "viewFormattedTable",
            title: "Table",
            urlStr: "list/showFormattedList/",
            popupName: "showFormattedList",
            popupWidth: 700,
            popupHeight: 600,
            idToUse: "tableDefinitionId"
        });
        
        isc.DeleteButton.create({
            ID: "deleteDataFormButton",
            click: function() {
                var selectedRecord = openDefinitionList.getSelectedRecord();
                if(!selectedRecord) {
                    isc.warn(msgSelectRecord);
                }
                else {
                    isc.confirm("Are you sure you want to delete this data model and its definitions?", function(value) {
                        if(value) {
                            var params = { 
                                formId: selectedRecord.formDefinitionId,
                                dataModelId: selectedRecord.id,
                                tableDefinitionId: selectedRecord.tableDefinitionId
                            };
                            RPCManager.sendRequest({ 
                                params: params,
                                httpMethod: "POST",
                                useSimpleHttp: true,
                                callback: "fileMenu.deleteCallback(data)",
                                actionURL: "formDefinition/deleteJson"
                            });
                        }
                    });
                }
            }
        });
        
        isc.HLayout.create({
            ID: "dataFormHLayout",
            height: 40,
            membersMargin: 5,
            members: [
                formComposerListButton,
                viewFormButton,
                viewGenericTable,
                viewFormattedTable,
                deleteDataFormButton
            ]
        });

        isc.DialogueListLayout.create({
            ID:"dialogLayout",
            members: [openDefinitionList, dataFormHLayout]
        });
        
        isc.JsonFormWindow.create({
            ID: "modalWindow",
            title: "Data Model Manager",
            items: [dialogLayout]
        }).show();
    },

    data: [
        {title: msgNew, icon: CONSTANTS.get('IMAGES') + "/document_plain_new.png", 
            click: function() {
                moduleManagement.resetForm();
            }
        },
        {title: msgManager, icon: CONSTANTS.get('IMAGES') + "/folder_out.png", 
            click: "fileMenu.processOpen();"},
        {isSeparator: true},
        {title: msgSave, icon: CONSTANTS.get('IMAGES') + "/disk_blue.png",
            click: "fileMenu.handleSave(false)"
        },
        {title: msgSaveAs, icon: CONSTANTS.get('IMAGES') + "/save_as.png", 
            click: "fileMenu.handleSaveAs(false)"}
    ]
});

/**
 * Pull down menu for the basic operations.
 */
isc.Menu.create({
    ID: "advancedMenu",
    autoDraw: false,
    showShadow: true,
    shadowDepth: 10,
    data: [
        {title: showJson, click: "fileMenu.persistFormDefinition(true)"},
        {title: importJson, click: "fileMenu.startImportJson()"}
    ]
});

/**
 * Pull down menu for the basic operations.
 */
isc.Menu.create({
    ID: "previewMenu",
    autoDraw: false,
    showShadow: true,
    shadowDepth: 10,
    data: [
        {title: "Preview Form ...", click: function() {
                if(currentForm.id != -1) {
                    fileMenu.handleSave(false, false, false, postSaveActions.OPEN_PREVIEW_FORM);
                }
                else {
                    isc.warn("Please open a form definition to view the saved form.")
                }
            }
        }
    ]
});

isc.ToolStripMenuButton.create({
    ID: "menuButtonFile",
    title: msgFile,
    menu: fileMenu
});

isc.ToolStripMenuButton.create({
    ID: "menuButtonAdvanced",
    title: "Advanced",   
    menu: advancedMenu
});

isc.ToolStripMenuButton.create({
    ID: "previewMenuButton",
    title: "Preview",   
    menu: previewMenu
});

/**
 * Label with the file name.
 */
isc.StripLabel.create({
    ID: "formNameLabel",
    styleName: "formNameLabel",
    prefix: "Form",
    contents: currentForm.blankFormName
});

/**
 * Label with the name of the data model.
 */
isc.StripLabel.create({
    ID: "dataModelNameLabel",
    styleName: "dataModelNameLabel",
    prefix: "Data",
    contents: currentData.blankDataName
});

/**
 * Label with the name of the table model.
 */
isc.StripLabel.create({
    ID: "tableModelNameLabel",
    styleName: "tableModelNameLabel",
    prefix: "Table",
    contents: currentTable.blankDataName
});

/**
 * The main tool strip.
 */
isc.ToolStrip.create({
    ID: "mainToolStrip",
    width: "100%",
    height:24,
    defaultHeight: 35,
    
    /**
     * Activates the members related to the Design tab.
     */
    activateDesignMembers: function() {
        this.setMembers(
            [menuButtonFile, previewMenuButton, menuButtonAdvanced, isc.Canvas.create({width: 30}), isc.Canvas.create({width: "*"}), 
                 dataModelNameLabel, formNameLabel, tableModelNameLabel, logoutButton]
        );
        this.setHeight(this.defaultHeight);
    },
    
    /**
     * Deactivates all buttons and controls in this tool strip, except the logout button.
     */
    deactivateAllMembers: function() {
        this.setMembers([isc.Canvas.create({width: "*"}), logoutButton]);
        this.setHeight(this.defaultHeight);
    },
    
    /**
     * Activates all buttons needed for the application designer.
     */
    activateModuleDesignMembers: function() {
        this.setMembers([menuButtonFileMD, menuButtonAdvancedMD, isc.Canvas.create({width: 30}), isc.Canvas.create({width: "*"}), moduleNameLabelMD, logoutButton]);
        menuButtonAdvancedMD.show();
        menuButtonFileMD.show();
        moduleNameLabelMD.show();
        this.setHeight(this.defaultHeight);
    }
});

mainToolStrip.activateDesignMembers();