package com.consultinglimited.crm

import com.consultinglimited.crm.security.SecUser

/**
 * Represents the module containing a list of models which by themselves contain
 * a list of screens.
 * 
 * @author gil
 */
class Module extends TrackableItem {

    static mapping = {
        id generator:'sequence', params:[sequence:'module_seq']
        moduleData type: 'text'
    }

    /**
     * The model data in JSON format.
     */
    String moduleData;

    /**
     * The realm to which this data model is associated.
     */
    Realm realm;

    /**
     * The user to which this data model is associated.
     */
    SecUser secUser;

    /**
     * The default application for a user.
     */
    Boolean defaultApp;

    static constraints = {
        name( blank: false)
        moduleData( blank: false )
        realm (blank: true, nullable: true)
        secUser (blank: false, nullable: false)
    }
}
