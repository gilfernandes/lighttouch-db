/**
 * 
 */
package com.consultinglimited.crm.service.model;

/**
 * Represents a filter operator.
 * 
 * @author gil
 */
public enum FilterOperator {

    /**
     * Case insensitive 'contains'.
     */
    I_CONTAINS("iContains"), GREATER_OR_EQUAL("greaterOrEqual"), LESS_OR_EQUAL(
            "lessOrEqual"), EQUALS("equals");

    /**
     * The name of this operator.
     */
    private String name;

    /**
     * Associates the name to this operator.
     * 
     * @param name
     *            The name of this operator.
     */
    private FilterOperator(final String name) {
        this.name = name;
    }

    /**
     * Returns the name of the operator.
     * 
     * @return the name of the operator.
     */
    public String getName() {
        return name;
    }

    /**
     * Finds a filter operator by name.
     * 
     * @param name
     *            The name to be used.
     * @return The filter operator with the specified {@code name}.
     */
    public static FilterOperator find(final String name) {
        for (final FilterOperator value : FilterOperator.values()) {
            if (value.name.equals(name)) {
                return value;
            }
        }
        return null;
    }

}
