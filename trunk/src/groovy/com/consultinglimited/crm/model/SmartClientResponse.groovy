/**
 * 
 */
package com.consultinglimited.crm.model

/**
 * Used to be serialized into JSON in the typical SmartClient format:
 * <pre>
 * {
 "response": {
 "totalCount": 0,
 "totalRows": 0,
 "status": -1,
 "startRow": 0,
 "endRow": 0,
 }
 }
 </pre>
 * 
 * @author gil
 *
 */
class SmartClientResponse {

    /**
     * The total count.
     */
    int totalCount

    /**
     * The total rows.
     */
    int totalRows

    /**
     * The status. If negative this an error occurred.
     */
    int status

    /**
     * The start row.
     */
    int startRow

    /**
     * The end row.
     */
    int endRow

    /**
     * The update date as a string.
     */
    Date updateDate

    /**
     * The data which is to be sent to the client.
     */
    Map<String, Object> data;
}
