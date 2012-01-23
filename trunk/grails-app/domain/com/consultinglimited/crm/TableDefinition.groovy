package com.consultinglimited.crm

/**
 * Contains the properties of the table definition.
 * 
 * @author gil
 */
class TableDefinition extends TrackableItem {

    /**
     * Creates a sequence and sets the table data property to be a CLOB.
     */
    static mapping = {
        id generator:'sequence', params:[sequence:'table_definition_seq']
        tableData type: 'text'
    }

    /**
     * The form data in JSON format.
     */
    String tableData;

    /**
     * Delete this form when the data model.
     */
    static belongsTo = [dataModel: DataModel];

    static constraints = {
        name( blank: false)
        tableData( blank: false )
    }
}
