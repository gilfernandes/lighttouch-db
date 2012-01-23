/**
 * 
 */
package com.consultinglimited.crm.service.model;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;

import com.consultinglimited.crm.DataModel;

/**
 * Contains the data used for reading from the tables.
 * 
 * @author gil
 * 
 */
public class ReadData {

    /**
     * The offset from where we start to read the data.
     */
    private final long offset;

    /**
     * The number of records that are to be read.
     */
    private final long size;

    /**
     * The end row like the value specified by SmartClient.
     */
    private long endRow;

    /**
     * The name of the column by which we are sorting.
     */
    private List<String> sortBy;

    /**
     * The filter list.
     */
    private List<FilterCriteria> filterList;

    /**
     * The list of the columns which are to be retrieved by the query. May be
     * {@code null}.
     */
    private Collection<Integer> colIdList;

    /**
     * The map with the data models as values and the id as key.
     */
    private Map<Long, DataModel> userDataModelMap;

    /**
     * Associates an offset, a size and a sorting direction to this object.
     * 
     * @param offset
     *            The offset from where we start to read the data.
     * @param size
     *            The amount of records we are going to read.
     * @param sortBy
     *            The name of the column by which we are sorting.
     */
    public ReadData(final long offset, final long size) {
        super();
        this.offset = offset;
        this.size = size;
    }

    /**
     * Returns the name of the column by which we are sorting.
     * 
     * @return the name of the column by which we are sorting.
     */
    public List<String> getSortBy() {
        return sortBy;
    }

    /**
     * Sets the name of the column by which we are sorting.
     * 
     * @param sortBy
     *            The name of the column by which we are sorting.
     * @return a reference to this object.
     */
    public ReadData setSortBy(final List<String> sortBy) {
        this.sortBy = sortBy;
        return this;
    }

    /**
     * Returns the offset from where we start to read the data.
     * 
     * @return the offset from where we start to read the data.
     */
    public long getOffset() {
        return offset;
    }

    /**
     * Returns the amount of records we are going to read.
     * 
     * @return the amount of records we are going to read.
     */
    public long getSize() {
        return size;
    }

    /**
     * Returns the end row according to what SmartClient specifies.
     * 
     * @return the end row according to what SmartClient specifies.
     */
    public long getEndRow() {
        return endRow;
    }

    /**
     * Sets the end row according to what SmartClient specifies.
     * 
     * @param endRow
     *            The end row according to what SmartClient specifies.
     */
    public ReadData setEndRow(final long endRow) {
        this.endRow = endRow;
        return this;
    }

    /**
     * Returns the filter list.
     * 
     * @return the filter list.
     */
    public List<FilterCriteria> getFilterList() {
        return filterList;
    }

    /**
     * Adds a filter criteria to the filter list.
     * 
     * @param e
     *            The filter criteria to be added.
     * @return {@code true}, in case the add process was successful, otherwise
     *         {@code false}.
     */
    public boolean add(final FilterCriteria e) {
        if (filterList == null) {
            filterList = new ArrayList<FilterCriteria>();
        }
        return filterList.add(e);
    }

    /**
     * Adds a collection of filter criterias.
     * 
     * @param c
     *            The collection which is to be added to the internal filter
     *            list.
     * @return {@code true}, in case the add process was successful, otherwise
     *         {@code false}.
     */
    public boolean addAll(final Collection<? extends FilterCriteria> c) {
        if (filterList == null) {
            filterList = new ArrayList<FilterCriteria>();
        }
        return filterList.addAll(c);
    }

    /**
     * Sets the filter list.
     * 
     * @param filterList
     *            The filter list.
     */
    public ReadData setFilterList(final List<FilterCriteria> filterList) {
        this.filterList = filterList;
        return this;
    }

    /**
     * Returns the collection with the id's of the columns to be inserted in the
     * response.
     * 
     * @return the collection with the id's of the columns to be inserted in the
     *         response.
     */
    public Collection<Integer> getColIdList() {
        return colIdList;
    }

    /**
     * Sets the collection with the id's of the columns to be inserted in the
     * response.
     * 
     * @param colIdList
     *            The collection with the id's of the columns to be inserted in
     *            the response.
     * @return a reference to this object.
     */
    public ReadData setColIdList(final Collection<Integer> colIdList) {
        this.colIdList = colIdList;
        return this;
    }

    /**
     * Returns the user data model map.
     * 
     * @return the user data model map.
     */
    public Map<Long, DataModel> getUserDataModelMap() {
        return userDataModelMap;
    }

    /**
     * Sets the user data model map.
     * 
     * @param userDataModelMap
     *            The user data model map.
     */
    public ReadData setUserDataModelMap(
            final Map<Long, DataModel> userDataModelMap) {
        this.userDataModelMap = userDataModelMap;
        return this;
    }

    /**
     * Returns the string representation of this object.
     * 
     * @return the string representation of this object.
     */
    @Override
    public String toString() {
        return String.format(
                "ReadData [offset=%s, size=%s, sortBy=%s, filterList=%s]",
                offset, size, sortBy, filterList);
    }

}
