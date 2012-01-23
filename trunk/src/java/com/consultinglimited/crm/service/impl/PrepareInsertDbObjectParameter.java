package com.consultinglimited.crm.service.impl;

import java.util.Map;

import com.consultinglimited.crm.DataModel;
import com.mongodb.DB;
import com.mongodb.DBObject;

/**
 * Used to as a parameter of the prepare insert object function in
 * {@link MongoDataService}.
 * 
 * @author gil
 */
class PrepareInsertDbObjectParameter {

    /**
     * The map with values.
     */
    final Map<String, Object> valueMap;

    /**
     * The object to be inserted.
     */
    final DBObject doc;

    /**
     * The model state as a string.
     */
    final String modelDataStr;

    /**
     * If {@code true} we are creating a new record, else just updating.
     */
    final boolean isInsert;

    /**
     * The database that is currently being used.
     */
    final DB db;

    /**
     * The map with the data models as values and the id as key.
     */
    final Map<Long, DataModel> userDataModelMap;

    /**
     * Associates all parameters to this object.
     * 
     * @param valueMap
     *            The map with values.
     * @param doc
     *            The object to be inserted.
     * @param modelDataStr
     *            The model state as a string.
     * @param isInsert
     *            If {@code true} we are creating a new record, else just
     *            updating.
     * @param db
     *            The database that is currently being used.
     * @param userDataModelMap
     *            The map with the data models as values and the id as key.
     */
    public PrepareInsertDbObjectParameter(final Map<String, Object> valueMap,
            final DBObject doc, final String modelDataStr,
            final boolean isInsert, final DB db,
            final Map<Long, DataModel> userDataModelMap) {
        this.valueMap = valueMap;
        this.doc = doc;
        this.modelDataStr = modelDataStr;
        this.isInsert = isInsert;
        this.db = db;
        this.userDataModelMap = userDataModelMap;
    }
}