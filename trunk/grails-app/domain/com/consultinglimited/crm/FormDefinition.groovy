package com.consultinglimited.crm

/**
 * Contains the form definition 
 * 
 * @author gil
 */
class FormDefinition extends TrackableItem {

    static mapping = {
        id generator:'sequence', params:[sequence:'form_definition_seq']
        formData type: 'text'
    }

    /**
     * The form data in JSON format.
     */
    String formData;

    /**
     * Delete this form when the data model is deleted.
     */
    static belongsTo = [dataModel: DataModel];

    static constraints = {
        name( blank: false)
        formData( blank: false )
    }
}