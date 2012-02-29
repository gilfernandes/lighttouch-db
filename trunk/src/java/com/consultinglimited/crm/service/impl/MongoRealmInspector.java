/**
 * 
 */
package com.consultinglimited.crm.service.impl;

import java.net.UnknownHostException;
import java.util.Collection;
import java.util.Collections;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Set;

import com.consultinglimited.crm.service.RealmInspector;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.MongoException;

/**
 * This can be used to inspect the current tables in the database.
 * 
 * @author gil
 */
public class MongoRealmInspector extends AbstractMongoService implements
        RealmInspector {

    /**
     * Initializes the connector to the Mongo database.
     * 
     * @throws UnknownHostException
     *             In case the host is unknown.
     * @throws MongoException
     *             In case Mongo is not reacting as it should.
     */
    public MongoRealmInspector() throws UnknownHostException, MongoException {
        super();
        super.init();
    }

    /**
     * {@inheritDoc}
     * 
     * @see com.consultinglimited.crm.service.RealmInspector#getTableDescription(java.lang.String)
     */
    public Map<String, Collection<String>> getTableDescription(
            final String realm) {
        final DB db = mongo.getDB(realm);
        final Set<String> dbNames = db.getCollectionNames();
        final Map<String, Collection<String>> map = new LinkedHashMap<String, Collection<String>>();
        for (final String dbName : dbNames) {
            final DBCollection coll = db.getCollection(dbName);
            final DBCursor cur = coll.find();
            DBObject last = null;
            while (cur.hasNext()) {
                last = cur.next();
            }
            @SuppressWarnings("unchecked")
            final Set<String> colSet = (Set<String>) (last == null ? Collections
                    .emptySet() : last.keySet());
            map.put(dbName, colSet);
        }
        return map;
    }

    /**
     * Returns the databases in this Mongo instance.
     * 
     * @return the databases in this Mongo instance.
     */
    public Collection<String> getDbs() {
        return mongo.getDatabaseNames();
    }
}
