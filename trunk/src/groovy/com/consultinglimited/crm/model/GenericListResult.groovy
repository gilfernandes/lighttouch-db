/**
 * 
 */
package com.consultinglimited.crm.model

/**
 * Base class for all list results.
 * 
 * @author gil
 *
 */
abstract class GenericListResult {

    /**
     * The total number of entries.
     */
    int totalRows;

    /**
     * The start row.
     */
    int startRow;

    /**
     * The end row.
     */
    int endRow;
}
