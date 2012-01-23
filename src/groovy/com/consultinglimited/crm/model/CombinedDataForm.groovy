/**
 * 
 */
package com.consultinglimited.crm.model

import com.consultinglimited.crm.*

/**
 * Container with a form definition and a data model.
 * 
 * @author gil
 */
class CombinedDataForm {

    /**
     * The data model.
     */
    DataModel dataModel;

    /**
     * The delegate.
     */
    FormDefinition formDefinition;

    /**
     * The table definition.
     */
    TableDefinition tableDefinition;

    /**
     * Returns the identifier of the model.
     * @return the identifier of the model.
     */
    public long getId() {
        return dataModel == null ? -1 : dataModel.getId();
    }

    /**
     * Returns the name of the user who owns the model.
     * @return the name of the user who owns the model.
     */
    public String getUserName() {
        return dataModel == null ? "" : dataModel.getSecUser()?.username;
    }

    /**
     * Returns the identifier of the form definition.
     * @return the identifier of the form definition.
     */
    public long getFormDefinitionId() {
        return formDefinition?.getId();
    }

    /**
     * Returns the identifier of the form definition.
     * @return the identifier of the form definition.
     */
    public long getTableDefinitionId() {
        return tableDefinition == null ? -1 : tableDefinition.getId();
    }

    /**
     * Returns the data model name.
     * @return the data model name.
     */
    public String getDataModelName() {
        return dataModel.getName();
    }

    /**
     * Returns the data model description.
     * @return the data model description.
     */
    public String getDataModelDescription() {
        return dataModel.getDescription();
    }

    /**
     * Returns the name of the table definition.
     * @return the name of the table definition.
     */
    public String getTableDefinitionName() {
        return tableDefinition.getName();
    }

    /**
     * Returns the description of the table definition.
     * @return the description of the table definition.
     */
    public String getTableDefinitionDescription() {
        return tableDefinition.getDescription();
    }

    /**
     * Returns the description of the table definition.
     * @return the description of the table definition.
     */
    public String getTableDefinitionData() {
        return tableDefinition.getTableData();
    }

    /**
     * Returns the data model data.
     * @return the data model data.
     */
    public String getDataModelData() {
        return dataModel.getModelData();
    }

    /**
     * Returns the form definition name.
     * @return the form definition name.
     */
    public String getFormDefinitionName() {
        return formDefinition.getName();
    }

    /**
     * Returns the form definition name.
     * @return the form definition name.
     */
    public String getFormDefinitionDescription() {
        return formDefinition.getDescription();
    }

    /**
     * Returns the form definition data.
     * @return the form definition data.
     */
    public String getFormDefinitionFormData() {
        return formDefinition.getFormData();
    }

    /**
     * Returns the string representation of this object.
     * @return the string representation of this object.
     */
    @Override
    public String toString() {
        return String
        .format("CombinedDataForm [getId()=%s, getUserName()=%s, getFormDefinitionId()=%s, getTableDefinitionId()=%s, getDataModelName()=%s, getDataModelDescription()=%s, getTableDefinitionName()=%s, getTableDefinitionDescription()=%s, getTableDefinitionData()=%s, getDataModelData()=%s, getFormDefinitionName()=%s, getFormDefinitionDescription()=%s, getFormDefinitionFormData()=%s]",
        getId(), getUserName(), getFormDefinitionId(),
        getTableDefinitionId(), getDataModelName(),
        getDataModelDescription(), getTableDefinitionName(),
        getTableDefinitionDescription(),
        getTableDefinitionData(), getDataModelData(),
        getFormDefinitionName(),
        getFormDefinitionDescription(),
        getFormDefinitionFormData());
    }
}
