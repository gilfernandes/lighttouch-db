/**
 * 
 */
package com.consultinglimited.crm.model

/**
 * Result with the form list.
 * 
 * @author gil
 *
 */
class DataFormListResult extends GenericListResult {

    /**
     * The list with form definition instances.
     */
    List<CombinedDataForm> dataFormInstanceList;
    
    /**
    * The number of form definitions.
    */
   int formDefinitionCount;
}
