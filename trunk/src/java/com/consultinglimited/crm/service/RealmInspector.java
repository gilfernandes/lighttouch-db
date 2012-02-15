/**
 * 
 */
package com.consultinglimited.crm.service;

import java.util.Collection;
import java.util.Map;

/**
 * Simple service used to inspect the realm in which we are operating.
 * 
 * @author gil
 */
public interface RealmInspector {

    /**
     * Returns a map with the table name and the columns of the table.
     * 
     * @param realm
     *            The database which is to be inspected.
     * @return a map with the table name and the columns of the table.
     */
    public Map<String, Collection<String>> getTableDescription(String realm);
}
