/**
 * 
 */
package com.consultinglimited.crm.service.impl;

import java.util.Collection;
import java.util.Map;

import org.junit.Before;
import org.junit.Test;

/**
 * @author gil
 * 
 */
public class MongoRealmInspectorTest {

    /**
     * The Mongo Realm inspector.
     */
    MongoRealmInspector realmInspector;

    /**
     * @throws java.lang.Exception
     */
    @Before
    public void setUp() throws Exception {
        realmInspector = new MongoRealmInspector();
    }

    /**
     * Test method for
     * {@link com.consultinglimited.crm.service.impl.MongoRealmInspector#getTableDescription(java.lang.String)}
     * .
     */
    @Test
    public void testGetTableDescription() {

        final Collection<String> dbs = realmInspector.getDbs();
        for (final String db : dbs) {
            System.out.println(db);
            final Map<String, Collection<String>> res = realmInspector
                    .getTableDescription(db);
            System.out.println(res);
        }
    }

}
