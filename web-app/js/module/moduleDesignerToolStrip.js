
//////////////////////////////////////////////////////////////////////////////////
/////////////////////////////// File Menu ////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

/**
 * Pull down menu for the basic operations.
 */
isc.Menu.create({
    ID: "fileMenuMD",
    autoDraw: false,
    showShadow: true,
    shadowDepth: 10,
    data: [
        {title: msgNew, icon: CONSTANTS.get('IMAGES') + "/document_plain_new.png", 
            click: "moduleFunctions.resetModuleDesigner(true)"
        },
        {title: msgManager, icon: CONSTANTS.get('IMAGES') + "/folder_out.png", 
            click: "moduleFunctions.processOpen();"},
        {isSeparator: true},
        {title: msgSave, icon: CONSTANTS.get('IMAGES') + "/disk_blue.png",
            click: "moduleFunctions.handleSave()"
        },
        {title: msgSaveAs, icon: CONSTANTS.get('IMAGES') + "/disk_blue.png",
        	click: "moduleFunctions.handleSaveAs()"
        }
    ]
});

/**
 * File button for the file menu.
 */
isc.ToolStripMenuButton.create({
    ID: "menuButtonFileMD",
    title: msgFile,
    menu: fileMenuMD,
    
    /**
     * Fetches the data of the models into the internal data object.
     */
    init: function() {
        this.Super("init", arguments);
        this.hide();
    }
});

//////////////////////////////////////////////////////////////////////////////////
/////////////////////////// Advanced Menu ////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////


/**
 * Pull down menu for the basic operations.
 */
isc.Menu.create({
    ID: "advancedMenuMD",
    autoDraw: false,
    showShadow: true,
    shadowDepth: 10,
    data: [
        {title: showJson, click: "moduleFunctions.createJson(true)"},
        {title: importJson, click: "moduleFunctions.startImportModuleJson()"}
    ]
});

/**
 * The advanced application designer button.
 */
isc.ToolStripMenuButton.create({
    ID: "menuButtonAdvancedMD",
    title: "Advanced",
    menu: advancedMenuMD,
    
    /**
     * Fetches the data of the models into the internal data object.
     */
    init: function() {
        this.Super("init", arguments);
        this.hide();
    }
});

/**
 * Label with the name of the module.
 */
isc.StripLabel.create({
    ID: "moduleNameLabelMD",
    styleName: "dataModelNameLabel",
    prefix: "Module",
    contents: currentModule.blankDataName,
    
    /**
     * Fetches the data of the models into the internal data object.
     */
    init: function() {
        this.Super("init", arguments);
        this.hide();
    }
});


//////////////////////////////////////////////////////////////////////////////////
/////////////////////////// Main Module Functions ////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

/**
 * Creates a data object with the module data.
 * @param name The name of the module.
 * @param description the description of the module.
 * @param moduleData The data of the module as JSON.
 */
var ModuleData = function(name, description, moduleData, defaultApp) {
    this.name = name;
    this.description = description;
    this.moduleData = moduleData;
    this.defaultApp = defaultApp;
}

/**
 * Functions to be used for modules.
 */
var ModuleFunctions = function() {
    
    /**
     * Creates the JSON with the module definition.
     * @param showJson If {@code true} displays the JSON in a separate window, else not.
     */
    this.createJson = function(showJson) {
        var res = jsonGenerator.createModuleJson(moduleViewsTree, currentModule.name)
        
        if(showJson) {
            var moduleJsonFields = [
                  {name: JSON_DISPLAY_AREA, type: "textArea", width: "*", height: globals.jsonPopupDisplayHeight - 80, showTitle: false},
                  {type: "button", title: "Done", click: "moduleJsonWindow.hide();" }
            ];
            
            isc.JsonForm.create({
                ID: "moduleJsonWindowForm",
                height: globals.displayHeight,
                fields: moduleJsonFields
            });
            
            moduleJsonWindowForm.setValue(JSON_DISPLAY_AREA, res);
            
            isc.JsonFormWindow.create({
                ID: "moduleJsonWindow",
                title: "Module JSON View",
                margin: 5,
                items: [
                    moduleJsonWindowForm
                ]
            }).show();
        }
        return res;
    };
    
    /**
     * Creates the import fields.
     * @param importCommand The Javascript used to popup the import dialogue.
     * @param displayHeight The height of the displayed window.
     * @param windowToClose The id of the window to be closed.
     * @returns the form fields.
     */
    this.createImportFields = function(importCommand, displayHeight, windowToClose) {
        var formFields = [
            {name: JSON_DISPLAY_AREA, type: "textArea", width: "*",
                height: displayHeight - 80, showTitle: false, required: true, requiredMessage: "Please enter a JSON definition here."},
            {type: "toolbar", width: 100, height: 25, buttons: 
                [{type: "button", title: msgSave, click: importCommand },
                {type: "button", title: "Cancel", click: windowToClose + ".hide();" }]
            }
        ];
        return formFields;
    };
    
    /**
     * Displays the window for JSON import. By pressing the 'OK' button
     * the user can import whatever the user enters into the JSON window.
     */
    this.startImportModuleJson = function() {
        
        var displayWidth = 600;
        
        var modalWindowId = "modalModuleImportWindow";
        
        isc.JsonForm.create({
            ID: "moduleImportWindowForm",
            width: globals.popupJsonWidth,
            height: globals.jsonPopupDisplayHeight - 80,
            fields: this.createImportFields("moduleFunctions.importJson('" + modalWindowId + "')", globals.jsonPopupDisplayHeight, modalWindowId)
        });
        
        isc.JsonFormWindow.create({
            ID: modalWindowId,
            title: importJson,
            margin: 5,
            items: [
                moduleImportWindowForm
            ]
        }).show();
    };
    
    /**
     * Resets the state of the application designer.
     * @param populate If {@code true} the existing model grid os to be populated, 
     * else not.
     */
    this.resetModuleDesigner = function(populate) {
        moduleNameLabelMD.setContents(currentModule.blankDataName);
        moduleViewGrid.setData([]);
        moduleViewGrid.markForRedraw();
        if(populate) {
            existingModelGrid.populate();
        }
        existingModelGrid.markForRedraw();
        modelsReorderingViewGrid.setData([]);
        existingModelGrid.markForRedraw();
        currentModule.name = null;
        currentModule.id = 0; // Make sure the id is invalid.
        moduleViewsTree.setRoot({name:"Root", children:[] });
        modulePropertiesTreeRoot = moduleViewsTree.find("Root");
        moduleViewsTreeGrid.setData(moduleViewsTree);
        moduleViewsTreeGrid.markForRedraw();
    };
    
    /**
     * Imports this JSON from the display area and 
     * materialises it into a application designer state.
     * @param windowToClose The window to be closed.
     * @param record If not {@code null} this is the record with the JSON content which will
     * be used.
     */
    this.importJson = function(windowToClose, record) {
        
        var json = !record ? moduleImportWindowForm.getValue(JSON_DISPLAY_AREA) : record.moduleData;
        try {
            this.resetModuleDesigner(false);
            // Evaluate the JSON and set the data for the current module.
            var jsonData = eval('(' + json + ')')
            var modelName = record ? record.name + '(' + record.id + ')' : jsonData.name;
            if(record) {
                currentModule.name = record.name;
                currentModule.description = record.description;
                currentModule.id = record.id;
            }
            moduleNameLabelMD.setContents(modelName);
            var models = jsonData.models;
            var moduleViewGridData = [];
            var idsToRemove = [];
            for(var i = 0, l = models.length; i < l; i++) {
                var model = models[i];
                // Addind the models.
                moduleViewGridData[moduleViewGridData.length] = {id: model.id, name: model.name};
                // Adding views into the tree.
                var folderChildren = [];
                for(var j = 0, jl = model.views == null ? 0 : model.views.length; j < jl; j++) {
                    var view = model.views[j];
                    folderChildren[folderChildren.length] = {id: view.id, name: view.name,
                        hidden: view.hidden, type: view.type}
                }
                moduleViewsTree.add(
                        {name: model.name, isFolder: true, active: null, id: model.id, children: folderChildren}, 
                        modulePropertiesTreeRoot, i);
                idsToRemove[idsToRemove.length] = model.id;
            }
            moduleViewGrid.setData(moduleViewGridData);
            moduleViewGrid.markForRedraw();
            moduleViewsTree.expandAll();
            var postPopulateAction = function() {
                // Remove the models which exist in moduleViewGrid from existingModelGrid.
                var existingModelGridData = [];
                for(var i = 0, il = existingModelGrid.getData().getLength(); i < il; i++) {
                    var doRemove = false;
                    for(var j = 0, jl = idsToRemove.length; j < jl; j++) {
                        if(idsToRemove[j] == existingModelGrid.getData().get(i).id) {
                            doRemove = true;
                            break;
                        }
                    }
                    if(!doRemove) {
                        existingModelGridData[existingModelGridData.length] = existingModelGrid.getData().get(i);
                    }
                }
                existingModelGrid.setData(existingModelGridData);
                existingModelGrid.markForRedraw();
            }
            existingModelGrid.populate(postPopulateAction);
            if(windowToClose) {
                eval(windowToClose + '.hide()');
            }
        }
        catch(e) {
            isc.warn("Could not parse the input JSON. :-( \n Here is the technical description: " + e);
        }
    };
    
    
    /**
     * Pops up the dialogue to enter the meta data.
     * @param showJson If {@code true} then the JSON code is displayed to the user, else not.
     * @param doDeploy If {@code true} then the data is not only stored, but it is also deployed in Grails.
     */
    this.handleSaveAs = function(showJson, doDeploy) {
        this.handleSave(true);
    };
    
    /**
     * Pops up a dialogue to enter the module information, if the module name has not yet 
     * been defined, otherwise just saves the module data to the server and notifies the 
     * user.
     * @param doBackup If {@code true} we are creating a copy of the current module (using 'Save As'),
     * else we are just saving the module.
     */
    this.handleSave = function(doBackup) {
        var self = this;
        if(doBackup || currentModule.name == null || currentModule.name.length == 0 || currentModule.name == currentModule.blankDataName) {
            isc.JsonFormWindow.create({
                ID: "moduleSaveWindow",
                title: "Save Module",
                dismissOnEscape: false,
                items: [
                    isc.JsonForm.create({
                        ID: "moduleSaveWindowForm",
                        numCols: 1,
                        titleOrientation:"top",
                        
                        /**
                         * Saves the module.
                         */
                        save: function() {
                            if(this.validate()) {
                                currentModule.name = this.getValue("moduleName");
                                currentModule.description = this.getValue("moduleDescription");
                                currentModule.defaultApp = this.getValue("defaultApp");
                                moduleNameLabelMD.setContents(currentModule.name);
                                var moduleContainer = self.persistFormDefinition();
                                if(doBackup) {
                                    currentModule.id = -1;
                                }
                                self.saveCall(moduleContainer);
                            }
                            else {
                                isc.warn("Form validation failed. Please check the highlighted fields.");
                            }
                        },
                        fields: [
                            {name: "moduleSection", defaultValue: "Module Data", type:"section", sectionExpanded:true, itemIds:["moduleName", "moduleDescription"]},
                            {name: "moduleName", title: "Name", type: "text", width:580, required: true, defaultValue: doBackup ? currentModule.name + " Copy" : ""},
                            {name: "moduleDescription", title: "Description", type: "textarea", width:580, height: 220},
                            {name: "defaultApp", title: "Default Application", type: "boolean"},
                            {type: "toolbar", width: 100, height: 25, buttons: 
                                [{type: "button", title: msgSave, click: "moduleSaveWindowForm.save();" },
                                {type: "button", title: msgCancel, click: "moduleSaveWindow.hide();" }]
                            }
                        ]
                    })
                ],
                
                /**
                 * Resets the data in case the close click button was triggered.
                 */
                closeClick: function() {
                    if(this.backup) {
                        // moduleManagement.resetBackup();
                    }
                    this.Super("closeClick", arguments);
                }
            }).show();
        }
        else {
            // save the existing module.
            var moduleContainer = self.persistFormDefinition();
            self.saveCall(moduleContainer);
        }
    };
    
    /**
     * Creates the JSON with the form data and the data model and saves it to the server.
     */
    this.persistFormDefinition = function() {
        
        var domainValues = {};
        // Create the data JSON.
        var formJson = this.createJson();
        var moduleData = new ModuleData(currentModule.name, currentModule.description, formJson, currentModule.defaultApp);
        return moduleData;
    };
    
    /**
     * Saves the module definition on the server.
     * @param moduleContainer The container with the module data.
     */
    this.saveCall = function(moduleContainer) {
        var params = { 
            id: currentModule.id,
            name: moduleContainer.name,
            description: moduleContainer.description,
            defaultApp: moduleContainer.defaultApp,
            data: moduleContainer.moduleData
        };
        if(currentModule.id <= 0) { // If there is no id on one of the entities create a new one.
            params.id = null; // Ensure that no identifier is there.
            RPCManager.sendRequest({ 
                params: params,
                httpMethod: "POST",
                useSimpleHttp: true,
                callback: "moduleFunctions.saveCallback(data, false)",
                actionURL: "module/saveJson"
            });
        }
        else {
            RPCManager.sendRequest({ 
                params: params, 
                httpMethod: "POST",
                useSimpleHttp: true,
                callback: "moduleFunctions.saveCallback(data, true)",
                actionURL: "module/updateJson"
            });
        }
    };
    
    /**
     * Processes the callback after a module save or update has been executed.
     * @param data The data which was sent to the server.
     * @param isUpdate If {@code true} this is an update, else a create call.
     */
    this.saveCallback = function(data, isUpdate) {
        try {
            var dataObj = eval('(' + data + ')');
            if(dataObj.response.status == 0) {
                isc.say(isUpdate ? "Module successfully updated." : "Module created successfully.");
                if(!isUpdate) {
                    // Extract the new identifier.
                    currentModule.id = dataObj.object.id;
                    moduleNameLabelMD.setContents(moduleNameLabelMD.getContents() + ' (' + currentModule.id + ')');
                    moduleSaveWindow.hide();
                }
            }
            else {
                isc.warn("An unexpected error occurred. Status Code: " + data.status);
            }
        }
        catch(e) {
            isc.warn("Ooops! An unexpected error occurred. Error Message: " + e);
        }
    };
    
    /**
     * Processes the callback after a module delete has happened.
     * @param data The data which was sent to the server.
     */
    this.deleteCallback = function(data) {
        try {
            var dataObj = eval('(' + data + ')');
            if(dataObj.response.status == 0) {
                isc.say("Module successfully deleted.", 
                    function() { tableUtil.refreshTable(openModuleList); });
            }
            else {
                isc.warn("An unexpected error occurred. Status Code: " + data.status);
            }
        }
        catch(e) {
            isc.warn("Ooops! An unexpected error occurred. Error Message: " + e);
        }
    };
    
    /**
     * Opens the manager which deals with the application designer.
     */
    this.processOpen = function() {
        
        /**
         * The grid where the fields are to be displayed.
         */
        isc.ManagerListGrid.create({
            ID: "openModuleList",
            dataSource: "openModuleDs",
            fields:[
                    {name: "id", width: "6%"},
                    {name: "name", width: "18%"},
                    {name: "description", width: "32%"},
                    {name: "defaultApp", width: "10%", click: function() {saveModuleButton.enable();}},
                    {name: "createdDate", width: "16%"},
                    {name: "modifiedDate", width: "16%"}
            ],
            
            /**
             * Activates the save button.
             */
            editorEnter: function(record, value, rowNum, colNum) {
                saveModuleButton.enable();
            },
            
            /**
             * Deactivates the save button.
             */
            editorExit: function(editCompletionEvent, record, newValue, rowNum, colNum) {
                saveModuleButton.disable();
                return this.Super("editorExit", arguments);
            }
        });
        
        var self = this;
        
        var modalModuleWindow = "modalModuleWindow";
        
        isc.OpenButton.create({
            ID: "openModuleButton",
            click: function() {
                var selectedRecord = openModuleList.getSelectedRecord();
                if(!selectedRecord) {
                    isc.warn(msgSelectRecord);
                }
                else {
                    self.resetModuleDesigner();
                    self.importJson(modalModuleWindow, selectedRecord);
                }
            }
        })
        
        // Used to save the currently edited line.
        isc.IButton.create({
            ID: "saveModuleButton",
            title: "Save Changes",
            click: function() {
                openModuleList.saveAllEdits();
                openModuleList.cancelEditing();
                this.disable();
            },
            init: function() {
                this.Super("init", arguments);
                this.disable();
            }
        });
        
        isc.DeleteButton.create({
            ID: "deleteModuleButton",
            click: function() {
                var selectedRecord = openModuleList.getSelectedRecord();
                if(!selectedRecord) {
                    isc.warn(msgSelectRecord);
                }
                else {
                    isc.confirm(this.deleteQuestion, function(value) {
                        if(value) {
                            var params = { 
                                id: selectedRecord.id
                            };
                            RPCManager.sendRequest({ 
                                params: params,
                                httpMethod: "POST",
                                useSimpleHttp: true,
                                callback: "moduleFunctions.deleteCallback(data)",
                                actionURL: "module/deleteJson"
                            });
                        }
                    });
                }
            }
        });
        
        isc.HLayout.create({
            ID: "moduleButtonHLayout",
            height: 40,
            membersMargin: 5,
            members: [openModuleButton, saveModuleButton, deleteModuleButton]
        });
        
        isc.DialogueListLayout.create({
            ID:"dialogModuleLayout",
            members: [openModuleList, moduleButtonHLayout]
        });
        
        isc.JsonFormWindow.create({
            ID: modalModuleWindow,
            title: "Module Manager",
            items: [dialogModuleLayout]
        }).show();
    }
}

var moduleFunctions = new ModuleFunctions();