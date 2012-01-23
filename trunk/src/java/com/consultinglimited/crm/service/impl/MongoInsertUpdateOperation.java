/**
 * 
 */
package com.consultinglimited.crm.service.impl;

import java.util.Date;

import com.consultinglimited.crm.service.GenericDataService;
import com.mongodb.BasicDBObject;

/**
 * Insert Update Operation.
 * 
 * @author gil
 * 
 */
public enum MongoInsertUpdateOperation {

    INSTANCE;

    /**
     * The Mongo DB set operator.
     */
    private static final String MONGO_SET_OPERATOR = "$set";

    /**
     * Inserts or updates an attribute with the update date.
     * 
     * @param parameterObject
     *            The object with the update / insert flag.
     * @param key
     *            The name of the column.
     * @param value
     *            The value to be inserted.
     * @param updateDate
     *            The date of the update.
     */
    public void insertUpdate(
            final PrepareInsertDbObjectParameter parameterObject,
            final String key, final Object value, final Date updateDate) {
        if (parameterObject.isInsert) {
            parameterObject.doc.put(key, value);
        } else {
            ((BasicDBObject) parameterObject.doc).append(
                    MONGO_SET_OPERATOR,
                    new BasicDBObject().append(key, value).append(
                            GenericDataService.UPDATE_DATE_FIELD, updateDate));
        }
    }
}
