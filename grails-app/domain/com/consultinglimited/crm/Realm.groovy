/**
 * 
 */
package com.consultinglimited.crm

/**
 * The realm to which the data models are associated.
 * 
 * @author gil
 */
class Realm extends TrackableItem {


    /**
     * The set of security user realm objects and 
     * the set of data models.
     */
    static hasMany = [secUserRealms: SecUserRealm, datamodels: DataModel]
}
