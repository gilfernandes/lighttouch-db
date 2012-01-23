
/**
 * Data Source base class for the application designer's grids.
 */
isc.defineClass("ModuleRestDataSource", "BaseRestDataSource").addProperties({
    fields: [{name:"id", title: "ID"},
              {name:"name", type:"text"}]
});

/**
 * This is a tile with a different styling.
 */
isc.defineClass("BorderedTile", "SimpleTile").addProperties({
    baseStyle: "borderedTile"
});

/**
 * Data Source used for the tile grid on which the models land.
 */
isc.ModuleRestDataSource.create({
    ID: "moduleWriteDS"
});

/**
 * Generic module data.
 */
var moduleData = {
    width: 925,
    tableType: "table",
    formType: "form"
}

/**
 * Base class used for the list grid which contains the available 
 * and those modules used in the model.
 */
isc.defineClass("ModelListGrid", "ListGrid").addProperties({
    width : 150,
    cellHeight : 24,
    imageSize : 16,
    showEdges : true,
    border : "0px",
    bodyStyleName : "normal",
    alternateRecordStyles : true,
    showHeader : false,
    leaveScrollbarGap : false,
    emptyMessage : "<br><br>Drag &amp; drop models here",
    fields : [
    {
        name : "id",
        width: "20%"
    },
    {
        name : "name",
        width: "80%"
    }
    ],
    trackerImage : {
        src : "../" + CONSTANTS.get('IMAGES') + "/cubes_all.png",
        width : 24,
        height : 24
    },
    
    /**
     * Fetches the data of the models into the internal data object.
     */
    init: function() {
        this.Super("init", arguments);
        this.populate();
    },
    
    /**
     * Populates this list grid.
     * @param otherAction Another function to be executed. 
     */
    populate: function(otherAction) {
        var currentGrid = this;
        RPCManager.sendRequest({ 
            httpMethod: "GET",
            useSimpleHttp: true,
            callback: function(response) {
                var data = response.data;
                var dataObject = eval('(' + data + ')');
                var l = dataObject.rows.length;
                var myData = [];
                for(var i = 0; i < l; i++) {
                    var record = {"id": dataObject.rows[i].id, "name": dataObject.rows[i].name};
                    var contains = false;
                    for(var j = 0; j < moduleViewGrid.data.length; j++) {
                        if(moduleViewGrid.data[j].id == dataObject.rows[i].id) {
                            contains = true;
                            break;
                        }
                    }
                    if(!contains) {
                        myData[myData.length] = record;
                    }
                }
                currentGrid.setData(myData);
                if(otherAction) {
                    otherAction();
                }
            },
            actionURL: "dataModel/listJson"
        });
    }
})

/**
 * The grid where the existing models are to be created.
 */
isc.ModelListGrid.create({
    ID: "existingModelGrid",
    height: globals.formComposerListHeight,
    canDragRecordsOut: true,
    canAcceptDroppedRecords: true,
    canReorderRecords: true,
    autoDraw: false,
    showHeader: true,
    width: "100%",
    canEdit: false,
    cellHeight: 30,
    editEvent: "click",
    dropRecord: null, // The last dropped record.
    dragDataAction: "move",
    
    /**
     * Synchronizes the tree with the model.
     */
    transferSelectedData: function() {
        this.Super("transferSelectedData", arguments);
        moduleViewGrid.synchronizeTree();
    },
    
    /**
     * Synchronizes the tree with the model.
     */
    drop: function() {
        this.Super("drop", arguments);
        moduleViewGrid.synchronizeTree();
    }
})

/**
 * The stack with the arrows.
 */
isc.VStack.create({
    ID:"arrowStack",
    width : 32,
    layoutAlign : "center",
    membersMargin : 40,
    layoutTopMargin: 20,
    members : [ 
        isc.Img.create({
            src : "arrow_right.png",
            width : 32,
            height : 32,
            click : "moduleViewGrid.transferSelectedData(existingModelGrid)"
        }),
        isc.Img.create({
            src : "arrow_left.png",
            width : 32,
            height : 32,
            click : "existingModelGrid.transferSelectedData(moduleViewGrid)"
        }) 
    ]
})

isc.HTMLPane.create({
    ID: "moduleCreateInstructions",
    width: moduleData.width, height: 20, 
    showEdges:false,
    styleName: "moduleCreateInstructions",
    contents:"Drag the modules on the left table onto the module "
        + "strip to add them to the top bar of the module."
})

/**
 * Grid used to view the module's top part which displays the data model names.
 */
isc.TileGrid.create({
    ID: "moduleViewGrid",
    width: moduleData.width, 
    height: 100,
    autoDraw: false,
    data: [],
    tileWidth: 120,
    tileHeight: 62,
    canAcceptDroppedRecords: true,
    canDragTilesOut: true,
    canReorderTiles: true,
    dragDataAction: "move",
    tileDragAppearance: "target",
    tilesPerLine: 100, 
    autoWrapLines: false,
    layoutPolicy: "fit",
    tileConstructor: "BorderedTile",
    fields: [
        {name: "id"},
        {name: "name"}
    ],
    
    /**
     * Extracts the id of the first selected record and sends it to 
     * the server to retrieve the views to be displayed on the left side.
     * @param record The record on which the user has clicked.
     */
    recordClick: function(viewer, tile, tileRecord) {
        var dataModelId = tileRecord.id;
        this.loadViews(dataModelId);
    },
    
    /**
     * Loads the views for a specific data model.
     * @param dataModelId The data model identifier.
     */
    loadViews: function(dataModelId) {
    	if(!moduleViewsTree.containsCached(dataModelId)) {
            // Model not loaded. Load it via Ajax.
            RPCManager.sendRequest({ 
                httpMethod: "GET",
                useSimpleHttp: true,
                callback: function(response) {
                    var dataObject = eval('(' + response.data + ')');
                    var fdl = dataObject.formDefinitionCol.length;
                    var tdl = dataObject.tableDefinitionCol.length;
                    var myData = [];
                    for(var i = 0; i < fdl; i++) {
                        var record = {"id": dataObject.formDefinitionCol[i].id, 
                            "name": dataObject.formDefinitionCol[i].name,
                            "type": moduleData.formType,
                            "modelId": dataModelId};
                        myData[myData.length] = record;
                    }
                    for(var i = 0; i < tdl; i++) {
                        var record = {"id": dataObject.tableDefinitionCol[i].id, 
                            "name": dataObject.tableDefinitionCol[i].name,
                            "type": moduleData.tableType,
                            "modelId": dataModelId};
                        myData[myData.length] = record;
                    }
                    modelsReorderingViewGrid.setData(myData);
                    moduleViewsTree.createChildren(myData, dataModelId);
                    moduleViewsTree.expandAll();
                },
                actionURL: "dataModel/listViewsJson/" + dataModelId
            });
        }
        else {
            // read from the tree the cached views and display them in the table.
            var records = moduleViewsTree.fetchRecords(dataModelId);
            for(var i = 0, l = records.length; i < l; i++) {
                records[i].modelId = dataModelId;
            }
            modelsReorderingViewGrid.setData(records);
            moduleViewsTree.expandAll();
        }
    },
    
    /**
     * Synchronizes the content of the module view grid with the 
     * tree containing the model.
     */
    synchronizeTree: function() {
        var self = this;
        for(var i = 0; i < 1; i++) {
            setTimeout(function() {
                // Create the sequence of identifiers.
                var seqId = [];
                var lastDataModelId = -1;
                for(var i = 0, l = self.data.getLength(); i < l; i++) {
                    var record = self.data.get(i);
                    seqId[seqId.length] = record.id;
                    lastDataModelId = record.id;
                }
                for(var i = 0, l = self.data.getLength(); i < l; i++) {
                    var record = self.data.get(i);
                    with(moduleViewsTree) {
                        var found = containsRecord(record);
                        if(!found) {
                            createModuleEntry(record, seqId);
                        }
                    }
                }
                // Remove
                with(modulePropertiesTreeRoot) {
                    for(var i = 0, l = children.getLength(); i < l; i++) {
                        var record = children[i];
                        if(record != null && !self.containsRecord(record.id)) {
                            moduleViewsTree.removeRecord(record.id);
                        }
                    }
                }
                // Re-ordering
                var reorderedTreeData = []
                with(modulePropertiesTreeRoot) {
                    for(var s = 0; s < seqId.length; s++) {
                        for(var i = 0, l = children.getLength(); i < l; i++) {
                            var record = children[i];
                            if(record != null && seqId[s] == record.id) {
                                reorderedTreeData[reorderedTreeData.length] = record;
                                break;
                            }
                        }
                    }
                }
                modulePropertiesTreeRoot.children.sort(function(a, b) {
                    var aid = a.id;
                    var bid = b.id;
                    var aPos = -1;
                    var bPos = -1;
                    for(var i = 0; i < reorderedTreeData.length; i++) {
                        if(aid == reorderedTreeData[i].id) {
                            aPos = i;
                            if(b > -1) {
                                break;
                            }
                        }
                        else if(bid == reorderedTreeData[i].id) {
                            bPos = i;
                            if(a > -1) {
                                break;
                            }
                        }
                    }
                    return aPos - bPos;
                });
                moduleViewsTree.expandAll();
                if(lastDataModelId > 0) {
                    self.loadViews(lastDataModelId);
                }
            }, 1000, "JavaScript");
        }
        modelsReorderingViewGrid.setData([]);
    },
    
    /**
     * Checks, if a record is present in the data of this tile grid.
     * @param id The identifier for which we are looking.
     * @return {@code true} in case the record is present, else {@code false}.
     */
    containsRecord: function(id) {
        for(var i = 0, l = this.data.getLength(); i < l; i++) {
            if(id == this.data[i].id) {
                return true;
            }
        }
        return false;
    },
    
    /**
     * Synchronizes the tree and with it the data model.
     */
    transferSelectedData: function() {
        this.Super("transferSelectedData", arguments);
        this.synchronizeTree();
    },
    
    /**
     * Synchronizes the tree.
     */
    drop: function() {
        this.Super("drop", arguments);
        this.synchronizeTree();
    }
});

isc.HTMLPane.create({
    ID: "modelsReorderingViewGridInstructions",
    width: "70%",
    height: 20, 
    showEdges:false,
    styleName: "moduleCreateInstructions",
    contents: "Use this table to reorder to the views on the vertical axis per drag and drop."
})

/**
 * The grid where the existing models are to be displayed and re-ordered.
 */
isc.ListGrid.create({
    ID: "modelsReorderingViewGrid",
    canReorderRecords: true,
    autoDraw: false,
    showHeader: true,
    width: "70%",
    cellHeight: 50,
    editEvent: "click",
    dropRecord: null, // The last dropped record.
    canEdit: true,
    fields: [
       {name: "id", width: 30, canEdit: false},
       {name: "hidden", type: "boolean", width: 40, canEdit: true, editorProperties:{height:48}, 
           changed: function(form, item, value) {
               var viewId = modelsReorderingViewGrid.getSelectedRecord().id
               moduleViewsTree.toggleHide(viewId, value);
               moduleViewsTree.expandAll();
           }
       },
       {name: "name", width: 400, canEdit: false},
       {name: "type", canEdit: false},
       {name: "modelId", width: 30, canEdit: false}
    ],
    
    /**
     * Calls the super method and then creates the children in the tree.
     */
    drop: function() {
        this.Super("drop", arguments);
        // Re-order the tree.
        moduleViewsTree.createChildren(this.data, this.data[0].modelId);
        moduleViewsTree.expandAll();
    }
})

//////////////////////////////////////////////////////////////////////////////////
///////////////////////////////// Tree Related ///////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////

/**
 * Instructions for the module views tree.
 */
isc.HTMLPane.create({
    ID: "moduleViewsTreeGridInstructions",
    width: "30%",
    height: 20, 
    showEdges:false,
    styleName: "moduleCreateInstructions",
    contents: "This tree displays the models and views in your module."
})

var defaultRecordDoubleClick = function (viewer, record, recordNum, field, fieldNum, value, rawValue) {
    return !(record.isBoolean || record.isFolder);
};

/**
 * The fields of the module properties tree.
 */
var moduleViewsTreeGridFields = [
    {name:"name", title:"View Name", width: "32%", canSort: false, canEdit: true,
        /**
         * Prevents editing for boolean fields.
         */
        recordDoubleClick: defaultRecordDoubleClick
    },
    {name:"id", title:"ID",  primaryKey:true, width: "7%", canSort: false, canEdit: false, hidden: false,
        /**
         * Prevents editing for boolean fields.
         */
        recordDoubleClick: defaultRecordDoubleClick
    },
    {name:"hidden", type: "boolean", title:"Hidden", width: "7%", canSort: false, canEdit: false, hidden: false,
        /**
         * Prevents editing for boolean fields.
         */
        recordDoubleClick: defaultRecordDoubleClick
    }
]

/**
 * The model object for the table model.
 */
Tree.create({
    ID:"moduleViewsTree",
    root: {name:"Root", children:[] },
    
    /**
     * Removes a node and subnodes from the tree.
     * @param moduleId the module identifier.
     */
    containsRecord: function(record) {
        for(var i = 0, l = modulePropertiesTreeRoot.children.length; i < l; i++) {
            var curId = modulePropertiesTreeRoot.children[i].id;
            if(record.id == curId) {
                return true;
            }
        }
        return false;
    },
    
    /**
     * Removes a node and subnodes from the tree.
     * @param moduleId the module identifier.
     */
    removeRecord: function(moduleId) {
        for(var i = 0, l = modulePropertiesTreeRoot.children.length; i < l; i++) {
            var curId = modulePropertiesTreeRoot.children[i].id;
            if(moduleId == curId) {
                this.remove(modulePropertiesTreeRoot.children[i]);
                break;
            }
        }
    },
    
    /**
     * Removes all nodes from the tree.
     */
    removeAll: function() {
        for(var i = 0, l = modulePropertiesTreeRoot.children.length; i < l; i++) {
            this.remove(modulePropertiesTreeRoot.children[0]);
        }
    },
    
    /**
     * Checks, if the model has previously been filled or not.
     */
    containsCached: function(modelId) {
        for(var i = 0, l = modulePropertiesTreeRoot.children.length; i < l; i++) {
            if(modulePropertiesTreeRoot.children[i].id == modelId && modulePropertiesTreeRoot.children[i].children != null && modulePropertiesTreeRoot.children[i].children.length > 0) {
                return true;
            }
        }
        return false;
    },
    
    /**
     * Fetches the records from the tree.
     * @return the records from the tree.
     */
    fetchRecords: function(modelId) {
        for(var i = 0, l = modulePropertiesTreeRoot.children.length; i < l; i++) {
            if(modulePropertiesTreeRoot.children[i].id == modelId) {
                return modulePropertiesTreeRoot.children[i].children;
            }
        }
        return [];
    },
    
    /**
     * Adds an entry to the tree based on a field with name value pairs.
     * @param The field as it is stored in JSON.
     */
    createModuleEntry: function(field, seqId) {
        var newId = field.id;
        var pos = 0;
        for(var i = 0; i < seqId.length; i++) {
            if(newId == seqId[i]) {
                pos = i;
                break;
            }
        }
        var parentNode = this.add(
            {name: field.name, isFolder: true, active: null, id: newId, children:[]}, modulePropertiesTreeRoot, pos);
    },
    
    /**
     * Adds the views records.
     * @param records The records to be inserted.
     * @param nodeId The identifier of the parent node where to insert the new records.
     */
    createChildren: function(records, nodeId) {
        with(modulePropertiesTreeRoot) {
            for(var i = 0, l = children.length; i < l; i++) {
                var rootChild = children[i];
                moduleViewsTreeGrid.closeFolder(rootChild);
                if(rootChild.id == nodeId) {
                    for(var j = 0, jl = records.length; j < jl; j++) {
                        var newChild = {name: records[j].name, id: records[j].id, type: records[j].type, isFolder: false, active: true};
                        if(j == 0) {
                            rootChild.children = [newChild]
                        }
                        else {
                            rootChild.children[rootChild.children.length] = newChild
                        }
                    }
                    moduleViewsTreeGrid.openFolder(rootChild);
                    break;
                }
            }
        }
        moduleViewsTreeGrid.markForRedraw();
    },
    
    /**
     * Expands all nodes.
     */
    expandAll: function() {
        for(var i = 0; i < modulePropertiesTreeRoot.children.length; i ++) {
            moduleViewsTreeGrid.openFolder(modulePropertiesTreeRoot.children[i]);
        }
        moduleViewsTreeGrid.markForRedraw();
    },
    
    /**
     * Toggles the state of the hide checkbox.
     * @param id The identifier.
     * @param value The boolean value.
     */
    toggleHide: function(id, value) {
        with(modulePropertiesTreeRoot) {
            for(var i = 0, l = children.length; i < l; i++) {
                var rootChild = children[i];
                for(var j = 0, jl = rootChild.children.length; j < jl; j++) {
                    if(id == rootChild.children[j].id) {
                        rootChild.children[j].hidden = value;
                        break;
                    }
                }
                moduleViewsTreeGrid.openFolder(rootChild);
            }
        }
    }
    
});

/**
 * The root node of the tree.
 */
var modulePropertiesTreeRoot = moduleViewsTree.find("Root");

/**
 * The tree displaying the modules and their views.
 */
isc.TreeGrid.create({
    ID: "moduleViewsTreeGrid",
    width: "30%",
    data: moduleViewsTree,
    fields: moduleViewsTreeGridFields,
    showOpenIcons:true,
    canAcceptDroppedRecords: false,
    canDropOnLeaves: true,
    showDropIcons:false,
    showOpener: true,
    nodeIcon:"[SKIN]/file.png",
    canEdit: false,
    canReorderRecords: true,
    /**
     * In case dropped records are not from this table, they will not be accepted.
     */
    folderDrop: function(nodes, folder, index, sourceWidget) {
        if(sourceWidget.ID == this.ID && folder.name == "Root") {
            this.Super("folderDrop", arguments);
        }
    }
});

/**
 * Container for the model view grid and the tree with the module views.
 */
isc.HLayout.create({
    ID:"tableTreeLayoutInstructions",
    width: moduleData.width,
    height: 20,
    layoutLeftMargin: 0,
    layoutRightMargin:  0,
    membersMargin: 2,
    members: [modelsReorderingViewGridInstructions, moduleViewsTreeGridInstructions]
});

/**
 * Container for the model view grid and the tree with the module views.
 */
isc.HLayout.create({
    ID:"tableTreeLayout",
    width: moduleData.width,
    height: document.body.clientHeight ? document.body.clientHeight - 320 : document.documentElement.clientHeight - 320,
    layoutLeftMargin: 0,
    layoutRightMargin:  0,
    membersMargin: 2,
    members: [modelsReorderingViewGrid, moduleViewsTreeGrid]
});

/**
 * The stack with the arrows.
 */
isc.VStack.create({
    ID:"moduleViewStack",
    width : 32,
    layoutAlign : "center",
    membersMargin : 0,
    members : [ 
        moduleCreateInstructions,
        moduleViewGrid,
        isc.LayoutSpacer.create({ height: 20 }),
        tableTreeLayoutInstructions,
        tableTreeLayout
    ]
})

/**
 * Main layout with the left table, the arrow stack and the right part of the designer.
 */
isc.HStack.create({
    ID:"moduleLayout",
    width: 200,
    styleName: "mainLayout",
    height: globals.mainLayoutHeight,
    align: "center",
    layoutLeftMargin: 0,
    layoutRightMargin:  0,
    membersMargin: 2,
    members: [existingModelGrid, arrowStack, moduleViewStack]
});

