package com.consultinglimited.crm.service.impl;

import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import org.codehaus.groovy.grails.web.json.JSONArray;
import org.codehaus.groovy.grails.web.json.JSONObject;

import com.consultinglimited.crm.service.GenericDataService;
import com.mongodb.DBCursor;

/**
 * Parameter object used to extract the fields from the Mongo record map.
 * 
 * @author gil
 */
class ExtractMapsParameter {

    /**
     * The list which is to be filled.
     */
    final List<Map<String, Object>> resultList;

    /**
     * The database cursor.
     */
    final DBCursor cursor;

    /**
     * The counter for counting the extracted records.
     */
    int counter;

    /**
     * The maximum size of the records to be extracted.
     */
    final int size;

    /**
     * The data model fields associated to this parameter set.
     */
    final JSONArray fields;

    /**
     * Contains the name of the field mapped to the field data which comes in
     * {@code fields}.
     */
    final Map<String, JSONObject> referenceMap;

    /**
     * Associates the model objects to this parameter object.
     * 
     * @param resultList
     *            The list with results.
     * @param cursor
     *            The cursor used here.
     * @param counter
     *            The number used to count the extracted records.
     * @param size
     *            The maximum size of the records to be extracted.
     */
    ExtractMapsParameter(final List<Map<String, Object>> resultList,
            final DBCursor cursor, final int counter, final int size,
            final JSONArray fields) {
        this.resultList = resultList;
        this.cursor = cursor;
        this.counter = counter;
        this.size = size;
        this.fields = fields;
        referenceMap = new HashMap<String, JSONObject>();
        for (@SuppressWarnings("unchecked")
        // Iterate through the fields of the data model
        final Iterator<JSONObject> iter = fields.iterator(); iter.hasNext();) {
            final JSONObject field = iter.next();
            if (GenericDataService.REFERENCE_TYPE.equals(field
                    .getString("type"))) {
                final int id = field.getInt("id");
                final String title = field.getString("title");
                final String key = String.format("%d_%s", id, title);
                referenceMap.put(key, field);
            }
        }
    }

}