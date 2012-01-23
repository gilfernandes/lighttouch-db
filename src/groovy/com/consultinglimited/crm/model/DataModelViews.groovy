/**
 * 
 */
package com.consultinglimited.crm.model

import com.consultinglimited.crm.DataModel
import com.consultinglimited.crm.FormDefinition
import com.consultinglimited.crm.TableDefinition

/**
 * Container for data model views either tables of forms.
 * 
 * @author gil
 *
 */
class DataModelViews {

    /**
     * The data model.
     */
    DataModel dataModel;

    /**
     * The delegate.
     */
    Collection<FormDefinition> formDefinitionCol;

    /**
     * The table definition.
     */
    Collection<TableDefinition> tableDefinitionCol;
}
