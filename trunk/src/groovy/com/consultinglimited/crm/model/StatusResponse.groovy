/**
 * 
 */
package com.consultinglimited.crm.model

/**
 * Simple response to be rendered to the client.
 * 
 * @author gil
 */
class StatusResponse {

    /**
     * The response code.
     */
    int status;

    /**
     * The error response code.
     */
    String msg;

    /**
     * The object on which the error was raised or the operation was performed.
     */
    Object object;

    /**
     * The error list
     */
    List errors;
}
