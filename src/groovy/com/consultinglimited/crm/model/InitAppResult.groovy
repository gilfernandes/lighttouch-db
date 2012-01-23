/**
 * 
 */
package com.consultinglimited.crm.model

import com.consultinglimited.crm.Module

/**
 * The object which contains all the information a user initially needs.
 * 
 * @author gil
 *
 */
class InitAppResult {

    /**
     * The default module.
     */
    Module defaultModule;

    /**
     * Contains all the modules accessible to a user.
     */
    ModuleListResult moduleListResult;
}
