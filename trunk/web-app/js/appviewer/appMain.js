isc.Canvas.addProperties({ showCustomScrollbars:false });

var titleLayout = titleFactory.createTitleLayout();

/**
 * Application display related functions.
 */
var appFunctions = {
        
    /**
     * Activates an application in the GUI.
     */
    displayApplication: function(response) {
        var dataObj = eval('(' + response.data + ')');
        var title = "Workbench"
        if(dataObj.defaultModule) {
            title = dataObj.defaultModule.name + " - " + title;
            selectedId = dataObj.defaultModule.id
        }
        else {
            // console.log(dataObj);
        }
        titleLabel.setContentsTxt(title);
        document.title = title;
        var appList = dataObj.moduleListResult.rows;
        var comboApps = [];
        var selectedApp = null;
        // Fill the application combo with data.
        for(var i = 0, l = appList.length; i < l; i++) {
            var app = appList[i];
            comboApps[i] = {id: app.id, name: app.name, description: app.description, moduleData: app.moduleData };
            if(selectedId == app.id) {
                selectedApp = comboApps[i];
            }
        }
        applicationCombo.setValueMap(comboApps);
        if(selectedApp) {
            // Select the right entry in the application combo.
            applicationCombo.setValue(selectedApp);
            appFunctions.createTabs(selectedApp);
        }
    },
    
    /**
     * Removes all tabs from the application workbench and adds the ones corresponding to the 
     * module data.
     * @param selectedApp The application which has been selected.
     */
    createTabs: function(selectedApp) {
        // Now add the tabs.
        for(var i = 0, l = mainTab.tabs.length; i < l; i++) {
            mainTab.removeTab(0);
        }
        titleLabel.setContentsTxt(selectedApp.name + " - Workbench");
        var moduleData = eval('(' + selectedApp.moduleData + ')');
        for(var i = 0, l = moduleData.models.length; i < l; i++) {
            var model = moduleData.models[i];
            // Create the section stack on the left side with the available views.
            var viewTable = isc.ListGrid.create({
                height: globals.formComposerListHeight,
                autoDraw:false,
                showHeader: true,
                width: 200,
                cellHeight: 50,
                editEvent:"click",
                modelId: model.id,
                fields:[
                    {name:"id", title:"ID", width: "15%"},
                    {name:"name", title:"Name", width: "65%"},
                    {name:"type", title:"Type", width: "25%"}
                ],
                recordClick: appFunctions.activateView
            });
            var viewData = [];
            if(model.views) {
                for(var j = 0, jl = model.views.length; j < jl; j++) {
                    viewData[j] = {id: model.views[j].id, name: model.views[j].name, type: model.views[j].type};
                }
                viewTable.setData(viewData);
            }
            var genericElementsLayout = isc.VLayout.create({
                ID : "genericElementsLayout" + model.id,
                width : "100%",
                styleName : "mainLayout",
                height : globals.mainLayoutHeight,
                align : "top",
                layoutLeftMargin : 0,
                layoutRightMargin : 0,
                members : [ ]
            });
            
            var hLayout = isc.HLayout.create({
                width : "100%",
                height : "100%",
                align : "top",
                layoutLeftMargin : 10,
                layoutRightMargin : 10,
                overflow: "auto",
                members : [genericElementsLayout]
            });
            
            var sectionStack = isc.HLayout.create({
                width: "100%", 
                height: "100%",
                showEdges:true,
                edgeSize: 4,
                showResizeBar: false,
                align: "center",
                members: [
                        viewTable, hLayout
                ]
            });
            var tab = {
                title: model.name, 
                pane: sectionStack
            }
            mainTab.addTab(tab);
        }
    },
    
    /**
     * Creates the label used on top of the form or table.
     */
    createDynLabel: function() {
        return isc.Label.create({
            align : "left",
            height : 40,
            wrap : false,
            showEdges : false,
            margin : 8,
            contents : "",
            baseStyle: "formLabel"
        });
    },
    
    /**
     * Activates the form or table view.
     * @param viewer The list grid.
     */
    activateView: function(viewer, record, recordNum, field, fieldNum, value, rawValue) {
        // Handles the click on the view entry.
        var tableSelf = viewer;
        switch(record.type) {
        case 'form':
            var actionURL = "generator/formData/" + record.id;
            RPCManager.sendRequest({
                httpMethod : "GET",
                serverOutputAsString: true,
                useSimpleHttp : true,
                callback : function(response) {
                    // Materialize the layout into which the form is to be rendered.
                    var genericLayout = eval("genericElementsLayout" + tableSelf.modelId);
                    var formLabel = appFunctions.createDynLabel();
                    
                    /**
                     * The form used to display the properties.
                     */
                    var generatedForm = isc.DynamicForm.create({
                        cellPadding : 5,
                        useAllDataSourceFields : true,
                        saveOnEnter : true,
                        width: 200,
                        titleSuffix : " &nbsp;"
                    });
                    
                    genericLayout.setMembers([formLabel, generatedForm]);
                    
                    /**
                     * The object used to generate the form.
                     */
                    var dsOperator = isc.FormDsOperator.create({
                        generatedForm: generatedForm,
                        formLabel: formLabel,
                        paramId: record.id,
                        addUrl: "generator/addData"
                    });
                    dsOperator.addFieldsFromData(response.data)
                },
                actionURL : actionURL
            });
            break;
        case 'table':
            var actionURL = "list/readTableModelJson?tableDefinitionId=" + record.id;
            RPCManager.sendRequest({
                httpMethod : "GET",
                serverOutputAsString: true,
                useSimpleHttp : true,
                callback : function(response) {
                    var dataStr = response.data;
                    // Materialize the layout into which the form is to be rendered.
                    var genericLayout = eval("genericElementsLayout" + tableSelf.modelId);
                    var dataModelLabel = appFunctions.createDynLabel();
                    var metaInfoLabel = appFunctions.createDynLabel();
                    var generatedTable = isc.ListGrid.create({
                        alternateRecordStyles:true,
                        canGroupBy: false,
                        autoFetchData: false,
                        showAllRecords: false,
                        showHeaderContextMenu: true, // to activate context menu
                        canPickFields:false, // to remove columns option on context menu
                        canGroupBy :false,  // to remove group option on context menu
                        canEdit: true,
                        selectionAppearance:"checkbox",
                        selectionType: "simple"
                    });
                    
                    // TODO: Insert delete button bar here.
                    genericLayout.setMembers([dataModelLabel, metaInfoLabel, generatedTable, 
                        deleteButtonFactory.createButtonBar("list/deleteDataJson", "list/truncateDataJson", generatedTable, tableSelf.modelId)]);
                    
                    var dsOperator = isc.DsOperator.create({
                        ID: "dsOperator",
                        fetchDataURL: "list/readDataJson",
                        updateDataURL: "list/updateDataJson",
                        dataModelLabel: dataModelLabel,
                        metaInfoLabel: metaInfoLabel,
                        generatedTable: generatedTable
                    });
                    dsOperator.addFieldsFromData(dataStr)
                },
                actionURL : actionURL
            });
            break;
        }
    }
}

/**
 * The main tabular set.
 */
isc.TabSet.create({
    ID: "mainTab",
    styleName: "mainTab",
    border: 0,
    width: "100%",
    tabs:[],
    
    /**
     * Sets the default buttons.
     */
    init: function() {
        this.Super("init", arguments);
        RPCManager.sendRequest({
            httpMethod : "GET",
            serverOutputAsString: true,
            useSimpleHttp : true,
            callback : appFunctions.displayApplication,
            actionURL : "module/initAppJson"
        });
    },
    
    /**
     * Queries the server for the module properties.
     * @param tabNum The tab number.
     * @param tabPane The tab pane (mainTab).
     * @param ID The identifier of the tab.
     */
    tabSelected: function(tabNum, tabPane, ID, tab) {
        
    }
});

isc.VLayout.create({
    ID:"mainLayout",
    width: globals.layoutWidth,
    styleName: "mainLayout",
    height: globals.mainLayoutHeight,
    align: "center",
    layoutLeftMargin: 0,
    layoutRightMargin:  0,
    membersMargin: 2,
    members: [titleLayout, mainToolStrip, mainTab]
});

isc.HLayout.create({
    ID:"pageLayout",
    width: "100%",
    height: globals.mainLayoutHeight,
    styleName: "pageLayout",
    members: [isc.Canvas.create({width: "*"}), mainLayout, isc.Canvas.create({width: "*"})]
});