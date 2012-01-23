/**
 * 
 */
package com.consultinglimited.crm.service.impl;

import grails.converters.JSON;

import java.io.Serializable;
import java.text.Collator;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Set;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.bson.types.ObjectId;
import org.codehaus.groovy.grails.web.json.JSONArray;
import org.codehaus.groovy.grails.web.json.JSONObject;
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import com.consultinglimited.crm.DataModel;
import com.consultinglimited.crm.service.GenericDataService;
import com.consultinglimited.crm.service.model.FilterCriteria;
import com.consultinglimited.crm.service.model.ReadData;
import com.mongodb.BasicDBObject;
import com.mongodb.DB;
import com.mongodb.DBCollection;
import com.mongodb.DBCursor;
import com.mongodb.DBObject;
import com.mongodb.DBRef;
import com.mongodb.WriteResult;

/**
 * Implements CRUD operations using the Mongo database.
 * 
 * @author gil
 */
public class MongoDataService extends AbstractMongoService implements
        GenericDataService {

    /**
     * Expression used to create the time expression.
     */
    private static final String START_OF_TIME = "1970-01-01 ";

    /**
     * The Mongo DB set operator.
     */
    private static final String MONGO_SET_OPERATOR = "$set";

    /**
     * Extracts the identifier pattern.
     */
    private static final Pattern EXTRACT_ID_PAT = Pattern
            .compile("(\\d+)\\_.+");

    /**
     * The simple date format.
     */
    private static final SimpleDateFormat SDF = new SimpleDateFormat(
            "yyyy-MM-dd");

    /**
     * The simple time format.
     */
    private static final SimpleDateFormat STF = new SimpleDateFormat(
            "yyyy-MM-dd HH:mm");

    /**
     * Used to configure the date hour offset.
     */
    private int dateHourOffset = 5;

    /**
     * Used to sort records by one single string field in ascending order.
     * 
     * @author gil
     */
    private static class AscStrComparator implements Comparator<DBObject> {

        /**
         * The UK collator.
         */
        final Collator ukcollator;

        /**
         * The sorting field.
         */
        final String sortBy;

        /**
         * Associates the sorting field to this comparator.
         * 
         * @param sortBy
         *            The sorting field.
         */
        public AscStrComparator(final String sortBy) {
            this.sortBy = sortBy;
            ukcollator = Collator.getInstance(Locale.UK);
        }

        /**
         * Compares the objects using the {@code sortBy} field in ascending
         * order.
         * 
         * @param o1
         *            The first comparison object.
         * @param o2
         *            The second comparison object.
         * @return The integer result of the comparison.
         */
        public int compare(final DBObject o1, final DBObject o2) {
            final String str1 = (String) o1.get(sortBy);
            final String str2 = (String) o2.get(sortBy);
            return ukcollator.compare(str1, str2);
        }

    }

    /**
     * Used to sort records by one single string field in descending order.
     * 
     * @author gil
     */
    private static final class DescStrComparator extends AscStrComparator {

        /**
         * Associates the sorting field to this comparator.
         * 
         * @param sortBy
         *            The sorting field.
         */
        public DescStrComparator(final String sortBy) {
            super(sortBy);
        }

        /**
         * Compares the objects using the {@code sortBy} field in ascendin
         * order.
         * 
         * @param o1
         *            The first comparison object.
         * @param o2
         *            The second comparison object.
         * @return The integer result of the comparison.
         */
        @Override
        public int compare(final DBObject o1, final DBObject o2) {
            final String str1 = (String) o1.get(sortBy);
            final String str2 = (String) o2.get(sortBy);
            return ukcollator.compare(str2, str1);
        }

    }

    /**
     * If {@code true} the default fields will be set on create and update.
     */
    private boolean defaultFields;

    /**
     * {@inheritDoc}
     * 
     * @see com.consultinglimited.crm.service.GenericDataService#create(java.util.Map,
     *      com.consultinglimited.crm.DataModel)
     */
    public Serializable create(final Map<String, Object> valueMap,
            final DataModel model, final String realm,
            final Map<Long, DataModel> userDataModelMap) {
        final DB db = findDb(realm);
        final DBCollection coll = fetchCollection(model, db);
        final DBObject doc = new BasicDBObject();
        final String modelDataStr = model.getModelData();
        prepareInsertDbObject(new PrepareInsertDbObjectParameter(valueMap, doc,
                modelDataStr, true, db, userDataModelMap));
        coll.insert(doc);
        return doc.get(MONGO_ID).toString();
    }

    /**
     * Prepares the insertion of a DB object.
     * 
     * @param parameterObject
     *            Container for the parameters used in this function.
     */
    private void prepareInsertDbObject(
            final PrepareInsertDbObjectParameter parameterObject) {
        final JSONObject modelData = (JSONObject) JSON
                .parse(parameterObject.modelDataStr);
        boolean defaultFieldsInserted = false;
        final Date updateDate = new Date();
        for (final Entry<String, ?> entry : parameterObject.valueMap.entrySet()) {
            final String key = entry.getKey();
            final Object value = entry.getValue();
            final int dmId = extractId(key.toString());
            if (dmId < 0) {
                continue;
            }
            final JSONArray fields = (JSONArray) modelData.get("fields");
            for (@SuppressWarnings("unchecked")
            // Iterate through the fields of the data model
            final Iterator<JSONObject> iter = fields.iterator(); iter.hasNext();) {
                final JSONObject modelField = iter.next();
                final Integer id = (Integer) modelField.get("id");
                if (id.equals(dmId)) {
                    // Find the right type.
                    final String type = (String) modelField.get("type");
                    if (TEXT_TYPE.equals(type)) {
                        MongoInsertUpdateOperation.INSTANCE.insertUpdate(
                                parameterObject, key, value, updateDate);
                    } else if (BOOLEAN_TYPE.equals(type)) {
                        final boolean booleanValue = Boolean.parseBoolean(value
                                .toString());
                        MongoInsertUpdateOperation.INSTANCE.insertUpdate(
                                parameterObject, key, booleanValue, updateDate);
                    } else if (INT_TYPE.equals(type)) {
                        final int intValue = Integer.parseInt(value.toString());
                        MongoInsertUpdateOperation.INSTANCE.insertUpdate(
                                parameterObject, key, intValue, updateDate);
                    } else if (DOUBLE_TYPE.equals(type)) {
                        final double doubleValue = Double.parseDouble(value
                                .toString());
                        MongoInsertUpdateOperation.INSTANCE.insertUpdate(
                                parameterObject, key, doubleValue, updateDate);
                    } else if (REFERENCE_TYPE.equals(type)) {
                        final long modelId = (Integer) modelField.get("table");
                        final DataModel refModel = parameterObject.userDataModelMap
                                .get(modelId);
                        final String modelName = fetchModelName(refModel);
                        final DBRef dbRef = new DBRef(parameterObject.db,
                                modelName, value);
                        MongoInsertUpdateOperation.INSTANCE.insertUpdate(
                                parameterObject, key, dbRef, updateDate);
                    } else if (DATE_TYPE.equals(type) || TIME_TYPE.equals(type)) {
                        try {
                            Date d = null;
                            if (TIME_TYPE.equals(type)) {
                                final String valueStr = START_OF_TIME + value;
                                d = STF.parse(valueStr);
                            } else {
                                d = SDF.parse(value.toString());
                            }
                            if (parameterObject.isInsert) {
                                parameterObject.doc.put(key, d);
                            } else {
                                ((BasicDBObject) parameterObject.doc).append(
                                        MONGO_SET_OPERATOR,
                                        new BasicDBObject().append(key, d)
                                                .append(UPDATE_DATE_FIELD,
                                                        updateDate));
                            }
                        } catch (final ParseException e) {
                            throw new RuntimeException("Could not insert date",
                                    e);
                        }
                    }
                    break;
                }
            }
            if (defaultFields && parameterObject.isInsert
                    && !defaultFieldsInserted) {
                defaultFieldsInserted = true;
                parameterObject.doc.put(CREATE_DATE_FIELD, new Date());
            }
        }
        // Putting the update date into the value map
        parameterObject.valueMap.put(UPDATE_DATE_FIELD, updateDate);
    }

    /**
     * Finds a specific database.
     * 
     * @param realm
     *            The database name.
     * @return a specific database.
     */
    private DB findDb(final String realm) {
        final DB db = mongo.getDB(realm);
        return db;
    }

    /**
     * {@inheritDoc}
     */
    public List<Map<String, Object>> read(final DataModel model,
            final String realm, final long offset, final long size) {
        final ReadData readData = new ReadData(offset, size);
        return read(model, realm, readData);
    }

    /**
     * {@inheritDoc}
     */
    @SuppressWarnings("unchecked")
    public List<Map<String, Object>> read(final DataModel model,
            final String realm, final ReadData readData) {
        final List<Map<String, Object>> resultList = new ArrayList<Map<String, Object>>();
        final DB db = findDb(realm);
        final DBCollection coll = fetchCollection(model, db);
        final JSONArray fields = extractFieldsFromdataModel(model);
        final DBObject query = processFilters(readData, fields, db);
        final DBCursor cursor = query == null ? coll.find() : coll.find(query);
        boolean isStringSort = false;
        List<String> sortByList = null;
        if (readData.getSortBy() != null) { // process sort by
            sortByList = readData.getSortBy();
            for (String str : sortByList) {
                final int sortOrder = str.startsWith("-") ? -1 : 1;
                // The name of the first descending sorted field has a '-'
                // prepended.
                str = str.replaceFirst("^\\-", "");
                final DBObject sortBy = new BasicDBObject(str, sortOrder);
                cursor.sort(sortBy); // This does sort strings properly.
                // Try to check, if this is a string and that case just sort it
                // with Java.
                isStringSort = isStringType(fields, str);
            }
        }
        int counter = 0;
        final int size = (int) readData.getSize();
        if (!isStringSort || sortByList.size() > 1) {
            cursor.skip((int) readData.getOffset());
            if (CollectionUtils.isEmpty(readData.getColIdList())) {
                counter = extractMapsFull(new ExtractMapsParameter(resultList,
                        cursor, counter, size, fields));
            } else {
                counter = extractMapsSelective(new ExtractMapsParameter(
                        resultList, cursor, counter, size, fields),
                        readData.getColIdList());
                // Sort this
            }
        } else { // Sort using the Java API.
            String sortBy = sortByList.get(0);
            final int sortOrder = sortBy.startsWith("-") ? -1 : 1;
            if (sortOrder == -1) {
                sortBy = sortBy.substring(1);
            }
            final int cursorSize = cursor.size();
            final List<DBObject> sortedList = new ArrayList<DBObject>(
                    cursorSize);
            while (cursor.hasNext()) {
                sortedList.add(cursor.next());
            }
            final Comparator<DBObject> comparator = sortOrder == 1 ? new AscStrComparator(
                    sortBy) : new DescStrComparator(sortBy);
            Collections.sort(sortedList, comparator);
            for (int i = (int) readData.getOffset(), length = sortedList.size(); i < length; i++) {
                resultList.add(sortedList.get(i).toMap());
                if (++counter == size) {
                    break;
                }
            }
        }
        return resultList;
    }

    /**
     * Adds to the result list the full map.
     * 
     * @param parameterObject
     *            The parameter object with the data model in use here.
     * 
     * @return The number of extracted records.
     */
    private int extractMapsFull(final ExtractMapsParameter parameterObject) {
        int counter = parameterObject.counter;
        if (parameterObject.cursor == null) {
            return counter;
        }
        while (parameterObject.cursor.hasNext()) {
            final DBObject next = parameterObject.cursor.next();
            @SuppressWarnings("unchecked")
            final Map<String, Object> map = next.toMap();
            // Process references here to plain text.
            convertRefToString(map, parameterObject.referenceMap);
            parameterObject.resultList.add(map);
            if (++counter == parameterObject.size) {
                break;
            }
        }
        return counter;
    }

    /**
     * Adds to the result list the full map. This method supports sorting.
     * 
     * @param resultList
     *            The result list.
     * @param cursor
     *            The cursor used to iterate.
     * @param counter
     *            The counter used to stop iteration when needed.
     * @param size
     *            The maximum number of extracted records.
     * @param colFilter
     *            The filtered column identifiers.
     * @param fields
     *            The array with the field information.
     * @return The number of extracted records.
     */
    private int extractMapsSelective(
            final ExtractMapsParameter parameterObject,
            final Collection<Integer> colFilter) {
        final Set<String> extractedFields = new LinkedHashSet<String>();
        boolean sorted = false;
        for (@SuppressWarnings("unchecked")
        final Iterator<JSONObject> iter = parameterObject.fields.iterator(); iter
                .hasNext();) {
            final JSONObject next = iter.next();
            final Integer id = (Integer) next.get("id");
            if (colFilter.contains(id)) {
                final String title = (String) next.get("title");
                final String extractedField = String.format("%d_%s", id, title);
                extractedFields.add(extractedField);
                if (!sorted) { // Note: this is pure ASCII sort for now.
                    final DBObject sortBy = new BasicDBObject(extractedField, 1);
                    parameterObject.cursor.sort(sortBy);
                    sorted = true;
                }
            }
        }
        // Add always the id.
        extractedFields.add(MONGO_ID);
        while (parameterObject.cursor.hasNext()) {
            final DBObject next = parameterObject.cursor.next();
            final Map<String, Object> map = new HashMap<String, Object>();
            for (final String fieldName : extractedFields) {
                map.put(fieldName, next.get(fieldName));
            }
            convertRefToString(map, parameterObject.referenceMap);
            parameterObject.resultList.add(map);
            if (++parameterObject.counter == parameterObject.size) {
                break;
            }
        }
        return parameterObject.counter;
    }

    /**
     * Converts a reference to a string in the map.
     * 
     * @param map
     *            The map on which the conversion is to be made.
     * @param referenceMap
     *            The data model fields.
     */
    private void convertRefToString(final Map<String, Object> map,
            final Map<String, JSONObject> referenceMap) {
        for (final Entry<String, Object> entry : map.entrySet()) {
            final Object value = entry.getValue();
            if (value instanceof DBRef) {
                final DBRef dbRef = (DBRef) value;
                // convert the DB Ref to id and value.
                final DB db = dbRef.getDB();
                final String referencedCollectionStr = dbRef.getRef();
                final DBCollection collection = db
                        .getCollection(referencedCollectionStr);
                final DBObject searchById = new BasicDBObject("_id",
                        new ObjectId(dbRef.getId().toString()));
                final DBObject found = collection.findOne(searchById);
                @SuppressWarnings("unchecked")
                final Map<String, Object> foundMap = found.toMap();
                // {2_reference={"id":2,"title":"reference","tableColumn":1,"table":207,"type":"reference"}}
                // { "_id" : { "$oid" : "4e4e767f527d8f399af2a8d6"} , "1_email"
                // : "gil.fernandes@gmail.com" , "created_date" : { "$date" :
                // "2011-08-19T14:43:11Z"}}
                boolean replaced = true;
                for (final Entry<String, JSONObject> referenceEntry : referenceMap
                        .entrySet()) {
                    final JSONObject refData = referenceEntry.getValue();
                    final int tableCol = refData.getInt("tableColumn");
                    for (final Entry<String, Object> foundEntry : foundMap
                            .entrySet()) {
                        final String foundKey = foundEntry.getKey();
                        // Extract the number in the name.
                        final Matcher m = EXTRACT_ID_PAT.matcher(foundKey);
                        if (m.matches()) {
                            final int foundColId = Integer.parseInt(m.group(1));
                            if (foundColId == tableCol) {
                                // Found the referenced column. Extract the
                                // value.
                                final Object val = foundEntry.getValue();
                                entry.setValue(String.format("%s", val));
                                replaced = true;
                                break;
                            }
                        }
                    }
                }
                if (!replaced) {
                    entry.setValue(dbRef.getId().toString());
                }
            }
        }
    }

    /**
     * Extracts the filters and produces the filters with which MongoDB is to be
     * queried.
     * 
     * @param readData
     *            The data with the query data.
     * @param fields
     *            The fields of the data model.
     * @param db
     *            The database where the column is situated.
     * @param model
     *            The data model.
     * @return The object with the query.
     */
    private DBObject processFilters(final ReadData readData,
            final JSONArray fields, final DB db) {
        final List<FilterCriteria> filterList = readData.getFilterList();
        BasicDBObject query = null;
        if (!CollectionUtils.isEmpty(filterList)) {
            for (final FilterCriteria filterCriteria : filterList) {
                String operator = null;
                Object value = null;
                switch (filterCriteria.getFilterOperator()) {
                case I_CONTAINS:
                    value = Pattern.compile((String) filterCriteria.getValue(),
                            Pattern.CASE_INSENSITIVE | Pattern.LITERAL);
                    break;
                case EQUALS:
                    value = filterCriteria.getValue();
                    break;
                case GREATER_OR_EQUAL:
                    operator = "$gte";
                case LESS_OR_EQUAL:
                    if (operator == null) {
                        operator = "$lte";
                    }
                    break;
                }
                final String fieldName = filterCriteria.getFieldName();
                // Convert the object to the right type here.
                for (@SuppressWarnings("unchecked")
                final Iterator<JSONObject> iter = fields.iterator(); iter
                        .hasNext();) {
                    final JSONObject next = iter.next();
                    final Integer id = (Integer) next.get("id");
                    if (fieldName.startsWith(id.toString() + "_")) {
                        final String type = (String) next.get("type");
                        if (DOUBLE_TYPE.equals(type)) {
                            value = Double.parseDouble(value.toString());
                        } else if (INT_TYPE.equals(type)) {
                            value = Double.parseDouble(value.toString());
                        } else if (DATE_TYPE.equals(type)
                                || TIME_TYPE.equals(type)) {
                            try {
                                Date d = null;
                                if (DATE_TYPE.equals(type)) {
                                    d = SDF.parse((String) filterCriteria
                                            .getValue());
                                    value = new Date(d.getTime()
                                            + (1000 * 60 * 60 * dateHourOffset));
                                } else {
                                    d = STF.parse(START_OF_TIME
                                            + (String) filterCriteria
                                                    .getValue());
                                    value = d;
                                }
                            } catch (final ParseException e) {
                                throw new RuntimeException(
                                        "Could not insert date.", e);
                            }
                        } else if (REFERENCE_TYPE.equals(type)) {
                            final long modelId = (Integer) next.get("table");
                            final DataModel refModel = readData
                                    .getUserDataModelMap().get(modelId);
                            final String referencedModelName = fetchModelName(refModel);
                            value = new DBRef(db, referencedModelName, value);
                        }
                        break;
                    }
                }
                if (query == null) {
                    if (operator == null) {
                        query = new BasicDBObject(fieldName, value);
                    } else {
                        query = new BasicDBObject();
                        query.put(fieldName, new BasicDBObject(operator, value));
                    }
                } else {
                    if (operator == null) {
                        query.append(fieldName, value);
                    } else {
                        query.append(fieldName, new BasicDBObject(operator,
                                value));
                    }
                }
            }
        }
        return query;
    }

    /**
     * Checks, if the type of the current sort of expression is a {@code string}
     * .
     * 
     * @param fields
     *            The fields from the data model.
     * @param str
     *            The sort of expression.
     * @return
     */
    private boolean isStringType(final JSONArray fields, final String str) {
        final String[] parts = str.split("\\_");
        // This should be the identifier of the field.
        final String idPart = parts[0];
        try {
            final int idInName = Integer.parseInt(idPart);
            for (@SuppressWarnings("unchecked")
            final Iterator<JSONObject> iter = fields.iterator(); iter.hasNext();) {
                final JSONObject next = iter.next();
                final Integer id = (Integer) next.get("id");
                if (idInName == id) {
                    final String type = (String) next.get("type");
                    if (TEXT_TYPE.equals(type)) {
                        return true;
                    }
                }
            }
        } catch (final NumberFormatException e) {
            // This is ok as this is then one custom of the "extra" fields.
        }
        return false;
    }

    /**
     * Extracts the fields from the data model.
     * 
     * @param model
     *            The data model from which the fields are to be extracted.
     * @return The array with the fields.
     */
    private JSONArray extractFieldsFromdataModel(final DataModel model) {
        final JSONObject modelData = (JSONObject) JSON.parse(model
                .getModelData());
        final JSONArray fields = (JSONArray) modelData.get("fields");
        return fields;
    }

    /**
     * {@inheritDoc}
     */
    public long totalSize(final DataModel model, final String realm,
            final ReadData readData) {
        final DB db = findDb(realm);
        final DBCollection coll = fetchCollection(model, db);
        final JSONArray fields = extractFieldsFromdataModel(model);
        final DBObject query = processFilters(readData, fields, db);
        if (query == null) {
            return coll.count();
        } else {
            return coll.find(query).count();
        }
    }

    /**
     * Extracts the identifier from the key.
     * 
     * @param key
     *            Combines the numeric id of the data model element and its
     *            title.
     * @return The numeric identifier of the
     */
    private int extractId(final String key) {
        final StringBuilder builder = new StringBuilder();
        for (int i = 0, l = key.length(); i < l; i++) {
            if (key.charAt(i) == '_') {
                break;
            }
            builder.append(key.charAt(i));
        }
        try {
            return Integer.parseInt(builder.toString());
        } catch (final NumberFormatException e) {
            return -1;
        }
    }

    /**
     * {@inheritDoc}
     */
    public void setDefaultFields(final boolean activate) {
        defaultFields = activate;
    }

    /**
     * {@inheritDoc}
     */
    public long delete(final DataModel model, final String realm,
            final List<?> idList) {
        final DB db = findDb(realm);
        final DBCollection coll = fetchCollection(model, db);
        int counter = 0;
        for (final Object id : idList) {
            final DBObject query = createIdQuery(id);
            final WriteResult result = coll.remove(query);
            counter += result.getN();
        }
        return counter;
    }

    /**
     * Deletes all records from a table.
     * 
     * @param model
     *            The data model.
     * @param realm
     *            The realm from which we are reading.
     * @return the number of deleted results.
     */
    public long truncate(final DataModel model, final String realm) {
        final DB db = findDb(realm);
        final DBCollection coll = fetchCollection(model, db);
        final DBObject query = new BasicDBObject();
        final WriteResult result = coll.remove(query);
        return result.getN();
    }

    /**
     * Creates a query for identifier.
     * 
     * @param id
     *            The record set identifier.
     * @return The query used to find the record set.
     */
    private DBObject createIdQuery(final Object id) {
        final ObjectId objectId = new ObjectId(id.toString());
        final DBObject query = new BasicDBObject(MONGO_ID, objectId);
        return query;
    }

    /**
     * Deletes a list of records from the database.
     * 
     * @param model
     *            The data model.
     * @param realm
     *            The realm from which we are reading.
     * @param valueMap
     *            The map of values which are to be updated.
     * @return {@code true} if the update was successful, else {@code false}.
     */
    public Date update(final DataModel model, final String realm,
            final Map<String, Object> valueMap,
            final Map<Long, DataModel> userDataModelMap) {
        final DB db = findDb(realm);
        final DBCollection coll = fetchCollection(model, db);
        final String id = (String) valueMap.get(MONGO_ID);
        final DBObject original = createIdQuery(id);
        if (!StringUtils.hasText(id) || original == null) {
            return null;
        }
        final BasicDBObject updated = new BasicDBObject();
        final String modelDataStr = model.getModelData();
        // TODO: the map with the data models should not be null here.
        prepareInsertDbObject(new PrepareInsertDbObjectParameter(valueMap,
                updated, modelDataStr, false, db, userDataModelMap));
        coll.update(original, updated);
        return (Date) valueMap.get(UPDATE_DATE_FIELD);
    }

    /**
     * Used to correct the date hour offset via configuration.
     * 
     * @param dateHourOffset
     *            The date hour offset.
     */
    public void setDateHourOffset(final int dateHourOffset) {
        this.dateHourOffset = dateHourOffset;
    }

}
