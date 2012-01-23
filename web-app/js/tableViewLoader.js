
/**
 * The fields of the table properties.
 */
var tablePropertiesTreeFields = [
    {name:"name", title:"Column Name", width: "39%", canSort: false, canEdit: true,
       /**
         * Prevents editing for boolean fields.
         */
        recordDoubleClick: function (viewer, record, recordNum, field, fieldNum, value, rawValue) {
            return !(record.isBoolean || record.isFolder);
        }
    },
    {name:"id", title:"ID",  primaryKey:true, width: "7%", canSort: false, canEdit: false, hidden: false,
        /**
         * Prevents editing for boolean fields.
         */
        recordDoubleClick: function (viewer, record, recordNum, field, fieldNum, value, rawValue) {
            return !(record.isBoolean || record.isFolder);
        }
    },
    {name:"dataModelForeignKey", title:"DID", width: "10%", canSort: false, canEdit: false,
        /**
         * Prevents editing for boolean fields.
         */
        recordDoubleClick: function (viewer, record, recordNum, field, fieldNum, value, rawValue) {
            return !(record.isBoolean || record.isFolder);
        }
    },
    {name:"active", title:"Active", type: "boolean", width: "13%", canSort: false,
        /**
         * Displays a checkbox or in case that this record is a folder
         * it suppresses the display of this item.
         * @param value The value of this cell.
         * @param record The record.
         * @param rowNum The row number.
         * @param colNum The column number.
         * @param grid The underlying grid.
         */
        formatCellValue: function (value, record, rowNum, colNum, grid) {
            if(record.isFolder) {
                return null;
            }
            // checked if selected, otherwise unchecked.
            var icon = value ? (grid.checkboxFieldTrueImage || grid.booleanTrueImage)
                         : (grid.checkboxFieldFalseImage || grid.booleanFalseImage);
            
            var html =  grid.getValueIconHTML(icon, this);
            return html;
        },
        
        /**
         * Prevents editing for boolean fields.
         */
        recordDoubleClick: function (viewer, record, recordNum, field, fieldNum, value, rawValue) {
            return !(record.isBoolean || record.isFolder);
        },
        
        cellChanged: function (record, newValue, oldValue, rowNum, colNum, grid) {
            if(!(record.isBoolean || record.isFolder)) {
                if(newValue == true && oldValue == false) {
                    record.value = 80;
                }
                else if (newValue == false && oldValue == true) {
                    record.value = null;
                }
            }
        }

    },
    {name:"value", title:"Value", width: "10%", canSort: false,

        /**
         * Displays nothing in case the record.isBoolean is set.
         * @param value The value of this cell.
         * @param record The record.
         * @param rowNum The row number.
         * @param colNum The column number.
         * @param grid The underlying grid.
         */
        formatCellValue: function (value, record, rowNum, colNum, grid) {
            return record.isBoolean || record.isFolder ? null : value;
        },
        
        /**
         * Prevents editing for boolean fields.
         */
        recordDoubleClick: function (viewer, record, recordNum, field, fieldNum, value, rawValue) {
            return !(record.isBoolean || record.isFolder);
        }
    }
];

isc.TreeGrid.create({
    ID: "tablePropertiesTree",
    width: "100%",
    data: tableModelTree,
    fields: tablePropertiesTreeFields,
    showOpenIcons:true,
    canAcceptDroppedRecords: true,
    canDropOnLeaves: false,
    showDropIcons:false,
    showOpener: true,
    nodeIcon:"[SKIN]/file.png",
    canEdit: true,
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

isc.VLayout.create({
    ID:"tablePropertiesFormLayout",
    showEdges: true,
    edgeSize: 2,
    layoutLeftMargin: 0,
    layoutRightMargin:  0,
    members: [tablePropertiesTree]
});
 