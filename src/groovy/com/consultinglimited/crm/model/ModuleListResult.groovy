/**
 * 
 */
package com.consultinglimited.crm.model

import com.consultinglimited.crm.Module

/**
 * Result with the form list.
 * 
 * @author gil
 *
 */
class ModuleListResult extends GenericListResult {

    /**
     * The list with form definition instances.
     */
    List<Module> rows;
}
