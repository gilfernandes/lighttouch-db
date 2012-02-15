/**
 * 
 */
package com.consultinglimited.crm

import java.util.Collection;
import java.util.Map;

import grails.converters.JSON
import com.consultinglimited.crm.service.GenericDataService

/**
 * Used to inspect a realm.
 * 
 * @author gil
 */
class RealmInspectorController {

    /**
     * Used for inspecting the deployed database.
     */
    def inspectorService
    
    /**
     * Spits out a JSON representation of the database structure.
     */
    def inspectDefaulReamlJson() {
        final Map<String, Collection<String>> res = inspectorService.getTableDescription("common");
        render res as JSON
    }
}
