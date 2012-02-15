/**
 * 
 */
package com.consultinglimited.crm.service;

import java.io.Serializable;
import java.util.Date;
import java.util.List;
import java.util.Map;

import com.consultinglimited.crm.DataModel;
import com.consultinglimited.crm.service.model.ReadData;

/**
 * This service performs the CRUD operations on difference mediums.
 * 
 * @author gil
 */
public interface GenericDataService {

    /**
     * The text type.
     */
    public static final String TEXT_TYPE = "text";

    /**
     * The double type.
     */
    public static final String DOUBLE_TYPE = "double";

    /**
     * The integer type.
     */
    public static final String INT_TYPE = "int";

    /**
     * The boolean type.
     */
    public static final String BOOLEAN_TYPE = "boolean";

    /**
     * The reference type.
     */
    public static final String REFERENCE_TYPE = "reference";

    /**
     * The date type.
     */
    public static final String DATE_TYPE = "date";

    /**
     * The time data type.
     */
    public static final String TIME_TYPE = "time";

    /**
     * Generic database accessible to everybody.
     */
    public static final String COMMON_REALM = "common";

    /**
     * The name of the field with the create date.
     */
    public static final String CREATE_DATE_FIELD = "created_date";

    /**
     * The name of the field with the update date.
     */
    public static final String UPDATE_DATE_FIELD = "update_date";

    /**
     * Creates a record from a map of values for a specific data model.
     * 
     * @param valueMap
     *            The map with the values.
     * @param model
     *            The model matching the values.
     * 
     * @param realm
     *            The realm for the data which is to be created.
     * @param userDataModelMap
     *            The map with the user data models.
     * 
     * @return The object that was created.
     */
    public Serializable create(Map<String, Object> valueMap, DataModel model,
            String realm, Map<Long, DataModel> userDataModelMap);

    /**
     * Reads a list of maps that contain the data of a record.
     * 
     * @param model
     *            The data model.
     * @param realm
     *            The realm from which we are reading.
     * @param offset
     *            The offset from where we start reading the records.
     * @param size
     *            The size of the records to be returned.
     * @return a a list of maps that contain the data of a record.
     */
    public List<Map<String, Object>> read(final DataModel model,
            final String realm, final long offset, final long size);

    /**
     * Reads a list of maps that contain the data of a record.
     * 
     * @param model
     *            The data model.
     * @param realm
     *            The realm from which we are reading.
     * @param readData
     *            An object containing the parameters used to read the data.
     * @return a a list of maps that contain the data of a record.
     */
    public List<Map<String, Object>> read(final DataModel model,
            final String realm, ReadData readData);

    /**
     * Deletes a list of records from the database.
     * 
     * @param model
     *            The data model.
     * @param realm
     *            The realm from which we are reading.
     * @param idList
     *            The list of identifiers which are to be deleted from the
     *            table.
     * @return the number of deleted results.
     */
    public long delete(DataModel model, String realm, List<?> idList);

    /**
     * Deletes all records from a table.
     * 
     * @param model
     *            The data model.
     * @param realm
     *            The realm from which we are reading.
     * @return the number of deleted results.
     */
    public long truncate(DataModel model, String realm);

    /**
     * Deletes a list of records from the database.
     * 
     * @param model
     *            The data model.
     * @param realm
     *            The realm from which we are reading.
     * @param valueMap
     *            The map of values which are to be updated.
     * @param userDataModelMap
     *            The map with the user data models.
     * 
     * @return a timestamp if the update was successful, else {@code null}.
     */
    public Date update(DataModel model, String realm,
            Map<String, Object> valueMap, Map<Long, DataModel> userDataModelMap);

    /**
     * Returns the total size of a collection.
     * 
     * @param model
     *            The data model.
     * @param realm
     *            The realm from which we are reading.
     * @param readData
     *            The query data.
     * @return the total size of a collection.
     */
    public long totalSize(DataModel model, String realm, ReadData readData);

    /**
     * Turns on the default fields.
     * 
     * @param activate
     *            If {@code true} the default fields are added to the database,
     *            else not.
     */
    public void setDefaultFields(boolean activate);

}
