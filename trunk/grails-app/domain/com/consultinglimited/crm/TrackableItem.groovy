package com.consultinglimited.crm

/**
 * Contains those properties that are common to all classes that should be 
 * trackable. 
 * 
 * @author gil
 */
class TrackableItem {

    static mapping = { tablePerHierarchy false }

    /**
     * The name of the item.
     */
    String name;

    /**
     * The creation date.
     */
    Date createdDate = new Date();

    /**
     * The modified date.
     */
    Date modifiedDate;

    /**
     * The description of the form definition.
     */
    String description;

    static constraints = {
        createdDate( blank: false)
        modifiedDate( blank: false, nullable: true)
        description( blank: true, nullable: true)
    }
}
