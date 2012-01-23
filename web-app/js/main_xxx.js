
isc.HTMLFlow.create({
    ID: "titleLabel",
    align: "left",
    align: "center",
    wrap: false,
    showEdges: false,
    margin: 8,
    contents: "<span class='title'>Simple Designer</span>",
    
    /**
     * Sets the contents into the right span element.
     */
    setContentsTxt: function(txt) {
        this.setContents("<span class='title'>" + txt + "</span>");
    }
});

/**
 * View loader for the table with the form elements.
*/
isc.ViewLoader.create({
    ID:"formToolsViewLoader",
    autoDraw: false, 
    viewURL: "js/formToolsViewLoader.js",
    loadingMessage: "Loading Form Tools ..."});

/**
 * Section on the left side of the layout with the form elements 
 * and the data model elements which are to be dragged.
 */
isc.SectionStack.create({
    ID: "mainBodyLeftPane",
    visibilityMode: "mutex",
    showResizeBar: true,
    width: globals.mainBodyLeftPaneWidth,
    minWidth: globals.mainBodyLeftPaneMinWidth,
    maxWidth: globals.mainBodyLeftPaneMaxWidth,
    height: "100%",
    autoDraw: false,
    visibilityMode:"multiple",
    showEdges: false,
    sections: [
        {
            autoShow: true,
            title: "Form Elements",
            resizeable :true,
            items: [formToolsViewLoader],
            ID: "elementBrowse",
            canCollapse: true
        },
        {
            autoShow: true,
            title: "Data Elements",
            resizeable :true,
            items: [dataModelGrid],
            ID: "dataBrowse",
            canCollapse: true
        }
    ]
});

/**
 * Section on the right side of the layout with the form elements 
 */
isc.SectionStack.create({
    ID: "mainBodyRightPane",
    visibilityMode: "mutex",
    showResizeBar: true,
    width: globals.mainBodyLeftPaneWidth,
    minWidth: globals.mainBodyLeftPaneMinWidth,
    maxWidth: globals.mainBodyLeftPaneMaxWidth,
    height: "100%",
    autoDraw: false,
    visibilityMode:"multiple",
    showEdges: false,
    sections: [
           {
               autoShow: true,
               title: "Form Element Properties",
               resizeable :true,
               items: [propertiesFormLayout],
               ID: "propertyBrowse",
               canCollapse: true
           },
           {
               autoShow: true,
               title: "Table Column Properties",
               resizeable :true,
               items: [tablePropertiesFormLayout],
               ID: "tableColumnSection",
               canCollapse: true
           }
    ]
});

isc.HLayout.create({
    ID: "formStudioBody",
    align: "left",
    valign: "center",
    align: "center",
    width: "100%",
    wrap: false,
    height: "100%",
    showEdges: false,
    baseStyle: "mainBody",
    membersMargin: 0,
    border: 0,
    members: [mainBodyLeftPane, formComposerList, mainBodyRightPane]
});

isc.VLayout.create({
    ID: "moduleStudioBody",
    align: "left",
    valign: "center",
    align: "center",
    width: "100%",
    wrap: false,
    height: "100%",
    showEdges: false,
    baseStyle: "mainBody",
    membersMargin: 0,
    border: 0,
    members: [moduleLayout]
});

isc.TabSet.create({
    ID: "mainTab",
    styleName: "mainTab",
    border: 0,
    width: "100%",
    tabs:[
        { 
            title: "Quick Designer",
            ID: mainTabIds.designerTab,
            pane: formStudioBody
        },
        { 
            title: "Module Designer",
            ID: mainTabIds.moduleDesignerTab,
            pane: moduleStudioBody
        }
    ],
    
    /**
     * Turns off or on certain configurations of the main tool strip when a tab is selected.
     * @param tabNum The tab number.
     * @param tabPane The tab pane (mainTab).
     * @param ID The identifier of the tab.
     */
    tabSelected: function(tabNum, tabPane, ID, tab) {
        titleLabel.setContentsTxt(tab.title);
        switch(ID) {
            case mainTabIds.designerTab:
                mainToolStrip.activateDesignMembers();
                break;
            case mainTabIds.moduleDesignerTab:
                mainToolStrip.activateModuleDesignMembers();
                break;
            case mainTabIds.userTab:
                mainToolStrip.deactivateAllMembers();
                break;
        }
    }
});

if(securityInfo.isAdmin) {
    isc.HTMLPane.create({
        ID: "userManagementPane",
        showEdges: true,
        contentsURL: "user",
        contentsType: "page",
        overflow: "hidden"
    })
    mainTab.addTab({
        ID: mainTabIds.userTab,
        title: "User Management",
        pane: userManagementPane
    });
}

isc.VLayout.create({
    ID:"mainLayout",
    width: globals.layoutWidth,
    styleName: "mainLayout",
    height: globals.mainLayoutHeight,
    align: "center",
    layoutLeftMargin: 0,
    layoutRightMargin:  0,
    membersMargin: 2,
    members: [titleLabel, mainToolStrip, mainTab]
});

isc.HLayout.create({
    ID:"pageLayout",
    width: "100%",
    height: globals.mainLayoutHeight,
    styleName: "pageLayout",
    members: [isc.Canvas.create({width: "*"}), mainLayout, isc.Canvas.create({width: "*"})]
});