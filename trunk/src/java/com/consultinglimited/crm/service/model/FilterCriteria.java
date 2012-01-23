/**
 * 
 */
package com.consultinglimited.crm.service.model;

/**
 * Contains the name of the field by which we are filtering data, its operator
 * and the value for filtering.
 * 
 * @author gil
 */
public class FilterCriteria {

    /**
     * The name of the field.
     */
    private String fieldName;

    /**
     * The filter operator.
     */
    private FilterOperator filterOperator;

    /**
     * The value of the filter.
     */
    private Object value;

    /**
     * Returns the filter field name.
     * 
     * @return the filter field name.
     */
    public String getFieldName() {
        return fieldName;
    }

    /**
     * Sets the filter field name.
     * 
     * @param fieldName
     *            The filter field name.
     */
    public FilterCriteria setFieldName(final String fieldName) {
        this.fieldName = fieldName;
        return this;
    }

    /**
     * Returns the filter operator.
     * 
     * @return the filter operator.
     */
    public FilterOperator getFilterOperator() {
        return filterOperator;
    }

    /**
     * Sets the filter operator.
     * 
     * @param filterOperator
     *            The filter operator.
     * @return a reference to this object.
     */
    public FilterCriteria setFilterOperator(final FilterOperator filterOperator) {
        this.filterOperator = filterOperator;
        return this;
    }

    /**
     * Returns the filter value.
     * 
     * @return the filter value.
     */
    public Object getValue() {
        return value;
    }

    /**
     * Sets the filter value.
     * 
     * @param value
     *            The filter value.
     * @return a reference to this object.
     */
    public FilterCriteria setValue(final Object value) {
        this.value = value;
        return this;
    }

    /**
     * Returns a string representation of this object.
     * 
     * @return a string representation of this object.
     */
    @Override
    public String toString() {
        return String.format(
                "FilterCriteria [fieldName=%s, filterOperator=%s, value=%s]",
                fieldName, filterOperator, value);
    }

}
