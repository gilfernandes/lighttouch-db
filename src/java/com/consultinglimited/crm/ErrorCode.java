/**
 * 
 */
package com.consultinglimited.crm;

/**
 * Enumeration with error codes.
 * 
 * @author gil
 * 
 */
public enum ErrorCode {

    OK(0, "OK"), NOT_FOUND(-1, "Not found"), VERSION_SYNC_FAILURE(-2,
            "Version synchronization problem"), DB_FAILURE(-3, "Database error"), DM_DEPLOY_FAIL(
            -4, "Data model deployment failure"), UNKNOWN_FORM(-5,
            "Unknown form"), GENERIC_FAILURE(-10000,
            "An unexpected error occurred.");

    /**
     * The error code.
     */
    private int code;

    /**
     * The message.
     */
    private String message;

    /**
     * Associates the code and the message to this object.
     * 
     * @param code
     *            The error code.
     * @param message
     *            The message.
     */
    private ErrorCode(int code, String message) {
        this.code = code;
        this.message = message;
    }

    /**
     * Returns the error code.
     * 
     * @return the error code.
     */
    public int getCode() {
        return code;
    }

    /**
     * Returns the error message.
     * 
     * @return the error message.
     */
    public String getMessage() {
        return message;
    }

}
