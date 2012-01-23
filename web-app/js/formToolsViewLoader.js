
/**
 * The data source used to contain the data of the form created by the user.
 */
isc.DataSource.create({
    ID:"formToolsGridDs",
    clientOnly: true,
    fields : [
        { name: "widgetType", primaryKey:true, canEdit: false, hidden: true },
        { name: "title" }
    ]
});

/**
 * The draggable widgets.
 */
formElementData = [
    {
        widgetType: fieldType.heading1,
        title: "Heading 1"
    },
    {
        widgetType: fieldType.text,
        title: "Text Field"
    }, 
    {
        widgetType: fieldType.textarea,
        title: "Text Area"
    },
    {
        widgetType: fieldType.checkbox,
        title: "Checkbox"
    },
    {
        widgetType: fieldType.combobox,
        title: "Combo Box"
    },
    {
        widgetType: fieldType.date,
        title: "Date Field"
    },
    {
        widgetType: fieldType.time,
        title: "Time Field"
    },
    {
        widgetType: fieldType.reference,
        title: "Reference"
    }
];

isc.FormTileGrid.create({
    ID: "formToolsGrid",
    autoDraw:false,
    dataSource: "formToolsGridDs",
    data: formElementData,
    canDragRecordsOut: true,
    canAcceptDroppedRecords: false,
    canReorderRecords: false,
    dragDataAction: "copy",
    selectionType: "single",

    /**
     * Acts like a data transfer with the mouse to the form composer table.
     */
    cellDoubleClick: function (record, rowNum, colNum) {
        if(typeof("formComposerList") != "undefined") {
            formComposerList.dropSource == this.ID;
            formComposerList.transferSelectedData(this, 0);
        }
    },

    fields:[
        {name:"title", type:"text", width: "100%", showHover:true, hoverWidth:250, hoverHTML: function(record) {
            return 'Drag to create a <b>' + record.title + '</b>.';
        }}
    ]
});

isc.VLayout.create({
    ID:"formToolsGridLayout",
    align: "center",
    layoutLeftMargin: 0,
    layoutRightMargin:  0,
    members: [formToolsGrid]
});