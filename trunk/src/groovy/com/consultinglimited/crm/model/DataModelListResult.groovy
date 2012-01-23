/**
 * 
 */
package com.consultinglimited.crm.model

import java.util.List

import com.consultinglimited.crm.DataModel



/**
 * Contains a list of data models, offset, size and total information.
 * 
 * @author gil
 *
 */
class DataModelListResult  extends GenericListResult {

    /**
     * The list with form definition instances.
     */
    List<DataModel> rows;
}
