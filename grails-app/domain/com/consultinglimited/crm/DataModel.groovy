package com.consultinglimited.crm

import com.consultinglimited.crm.security.SecUser

/**
 * Contains the fields of the data model.
 * 
 * @author gil
 */
class DataModel extends TrackableItem {

    static mapping = {
        id generator:'sequence', params:[sequence:'form_definition_seq']
        modelData type: 'text'
        generatedGrailsClass type: 'text'
    }

    /**
     * The model data in JSON format.
     */
    String modelData;

    /**
     * The content of the generated grails class.
     */
    String generatedGrailsClass;

    /**
     * The universal unique identifier.
     */
    String uuid = UUID.randomUUID().toString();

    /**
     * The realm to which this data model is associated.
     */
    Realm realm;

    /**
     * The user to which this data model is associated.
     */
    SecUser secUser;

    static constraints = {
        name( blank: false)
        modelData( blank: false )
        generatedGrailsClass (blank: true, nullable: true)
        realm (blank: true, nullable: true)
    }
}
