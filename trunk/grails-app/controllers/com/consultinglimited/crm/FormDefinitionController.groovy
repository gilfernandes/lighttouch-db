package com.consultinglimited.crm

import java.util.List;

import grails.converters.JSON

import com.consultinglimited.crm.model.CombinedDataForm
import com.consultinglimited.crm.model.DataFormListResult
import com.consultinglimited.crm.model.StatusResponse
import com.consultinglimited.crm.service.DataModelDeployService
import com.consultinglimited.crm.service.GenericDataService
import com.consultinglimited.crm.security.SecUser
import com.consultinglimited.crm.security.SecRole

/**
 * Used to manage the form definitions and also the associated data models.
 * 
 * @author gil
 */
class FormDefinitionController {

    static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

    /**
     * The parameter with the data model name.
     */
    public static final String DATA_MODEL_ID = "dataModelId";

    /**
     * The parameter with the data model name.
     */
    public static final String DATA_MODEL_NAME = "dataModelName";

    /**
     * The parameter with the data model description.
     */
    public static final String DATA_MODEL_DESCRIPTION = "dataModelDescription";

    /**
     * The parameter with the data model data.
     */
    public static final String DATA_MODEL_DATA = "dataModelData";

    /**
     * The parameter that determines, if the data model is to be deployed or not.
     */
    public static final String DEPLOY_DATA_MODEL = "doDeploy";

    /**
     * The parameter with the form identifier.
     */
    public static final String FORM_ID = "formId";

    /**
     * The parameter with the form name.
     */
    public static final String FORM_NAME = "formName";

    /**
     * The parameter with the form description.
     */
    public static final String FORM_DESCRIPTION = "formDefinitionDescription";

    /**
     * The parameter with the form data.
     */
    public static final String FORM_DEFINITION = "formDefinition";

    /**
     * The parameter with the table name.
     */
    public static final String TABLE_NAME = "tableDefinitionName";

    /**
     * The parameter with the table description.
     */
    public static final String TABLE_DESCRIPTION = "tableDefinitionDescription";

    /**
     * The parameter with the table definition data.
     */
    public static final String TABLE_DATA = "tableDefinitionData";

    /**
     * The parameter with the table definition identifier.
     */
    public static final String TABLE_ID = "tableDefinitionId";

    /**
     * The service used to deploy the data model in the database.
     */
    DataModelDeployService modelDeployService;
    
    /**
     * The service used to query which user is currently logged in.
     */
    def springSecurityService;
    
    /**
     * Used to access the data model service.
     */
    def dataModelService;

    def index = {
        redirect(action: "list", params: params)
    }

    def list = {
        params.max = Math.min(params.max ? params.int('max') : 10, 100)
        [formDefinitionInstanceList: FormDefinition.list(params), formDefinitionInstanceTotal: FormDefinition.count()]
    }

    /**
     * Sends a list of the form definitions and the associated data model to the client.
     */
    def listJson = {
        
        params.max = Math.min(params.max ? params.int('max') : 10000, 10000)
        def user = SecUser.get(springSecurityService.principal.id);
        List<CombinedDataForm> combinedDataFormList = dataModelService.fetchUserEntities(user, params);
        DataFormListResult result = new DataFormListResult (
                dataFormInstanceList: combinedDataFormList,
                formDefinitionCount: combinedDataFormList.size(),
                startRow: 0, 
                endRow: params.max);
        render result as JSON;
    }

    
    
    def create = {
        def formDefinitionInstance = new FormDefinition()
        formDefinitionInstance.properties = params
        return [formDefinitionInstance: formDefinitionInstance]
    }

    def save = {
        def formDefinitionInstance = new FormDefinition(params)
        if (formDefinitionInstance.save(flush: true)) {
            flash.message = "${message(code: 'default.created.message', args: [message(code: 'formDefinition.label', default: 'FormDefinition'), formDefinitionInstance.id])}"
            redirect(action: "show", id: formDefinitionInstance.id)
        }
        else {
            render(view: "create", model: [formDefinitionInstance: formDefinitionInstance])
        }
    }

    /**
     * Saves the form definition and the data model definition and replies in JSON mode.
     * Expects the parameters:
     * <ul>
     * <li><strong>formName</strong> The name of the form.</li>
     * <li><strong>formDescription</strong> The description of the form.</li>
     * <li><strong>formDefinition</strong> The form definition.</li>
     * <li><strong>dataModelName</strong> The name of the data model.</li>
     * <li><strong>dataModelDescription</strong> The data model description.</li>
     * <li><strong>dataModelData</strong> The JSON data model data.</li>
     * </ul>
     */
    def saveJson = {
        final String deployDataModel = params[DEPLOY_DATA_MODEL];
        final boolean doDeploy = deployDataModel != null;
        DataModel dataModelInstance = createOrChangeDataModelInstance(params, null);
        def user = SecUser.get(springSecurityService.principal.id);
        dataModelInstance?.secUser = user;
        boolean valid = dataModelInstance.validate();
        if(valid) {
            FormDefinition formDefinitionInstance = createOrUpdateFormDefinitionInstance(params, dataModelInstance, null);
            valid = formDefinitionInstance.validate();
            TableDefinition tableDefinition = createTableDefinitionInstance(params, dataModelInstance, null);
            valid = tableDefinition.validate();
            if (valid && dataModelInstance.save(flush: true) && formDefinitionInstance.save(flush: true) && tableDefinition.save(flush:true)) {
                CombinedDataForm combined = new CombinedDataForm(
                        dataModel: dataModelInstance, formDefinition: formDefinitionInstance, tableDefinition: tableDefinition);
                if(!doDeploy) {
                    String message =
                            "${message(code: 'default.created.message', args: [message(code: 'formDefinition.label', default: 'FormDefinition'), formDefinitionInstance.id])}"
                    StatusResponse response = new StatusResponse(status: ErrorCode.OK.getCode(), object: combined, msg: message);
                    render response as JSON;
                    return;
                }
                else {
                    deployModelInstance(combined, GenericDataService.COMMON_REALM);
                    return;
                }
            }
        }
        StatusResponse response = new StatusResponse(status: ErrorCode.GENERIC_FAILURE.getCode(),
                msg: ErrorCode.GENERIC_FAILURE.getMessage(), object: dataModelInstance, errors: []);
        render response as JSON
    }

    /**
     * Creates a data model instance.
     * @param params The http parameter map used to create a data model instance.
     * @param dataModelInstance An existing data model instance. If {@code null} a new 
     * data model instance is created.
     * @return a data model instance.
     */
    private DataModel createOrChangeDataModelInstance(Map params, DataModel dataModelInstance) {
        final String dataModelName = params[DATA_MODEL_NAME];
        String dataModelDescription = params[DATA_MODEL_DESCRIPTION];
        if(dataModelDescription == "null") {
            dataModelDescription = "";
        }
        final String dataModelData = params[DATA_MODEL_DATA];
        if(dataModelInstance == null) {
            return new DataModel(name: dataModelName,
            description: dataModelDescription, modelData: dataModelData);
        }
        else {
            dataModelInstance.setName(dataModelName);
            dataModelInstance.setDescription(dataModelDescription);
            dataModelInstance.setModelData(dataModelData);
            dataModelInstance.setModifiedDate(new Date());
            return dataModelInstance;
        }
    }

    /**
     * Creates a form definition instance that is then associated to a {@code dataModelInstance}.
     * @param params The http parameter map used to create a data model instance.
     * @param dataModelInstance The data model instance.
     * @param existingFormDefinitionInstance An existing form definition instance. May by {@code null}.
     * @return a form definition instance that is then associated to a {@code dataModelInstance}.
     */
    private FormDefinition createOrUpdateFormDefinitionInstance(Map params, DataModel dataModelInstance, FormDefinition existingFormDefinitionInstance) {
        final String formName = params[FORM_NAME];
        final String formDescription = params[FORM_DESCRIPTION];
        final String formDefinition = params[FORM_DEFINITION];
        if(existingFormDefinitionInstance == null) {
            FormDefinition formDefinitionInstance = new FormDefinition(name: formName,
                    description: formDescription, formData: formDefinition);
            formDefinitionInstance.dataModel = dataModelInstance;
            return formDefinitionInstance;
        }
        else {
            existingFormDefinitionInstance.setName(formName);
            existingFormDefinitionInstance.setDescription(formDescription);
            existingFormDefinitionInstance.setFormData(formDefinition);
            existingFormDefinitionInstance.setModifiedDate(new Date());
            return existingFormDefinitionInstance;
        }
    }

    /**
     * Creates a table definition instance that is then associated to a {@code dataModelInstance}.
     * @param params The http parameter map used to create a data model instance.
     * @param dataModelInstance The data model instance.
     * @param existingTableDefinition An existing table definition. May be {@code null}.
     * @return a form definition instance that is then associated to a {@code dataModelInstance}.
     */
    private TableDefinition createTableDefinitionInstance(Map params, DataModel dataModelInstance, TableDefinition existingTableDefinition) {
        final String tableName = params[TABLE_NAME];
        final String tableDescription = params[TABLE_DESCRIPTION];
        final String tableData = params[TABLE_DATA];
        if(existingTableDefinition == null) {
            TableDefinition tableDefinitionInstance = new TableDefinition(name: tableName,
                    description: tableDescription, tableData: tableData);
            tableDefinitionInstance.dataModel = dataModelInstance;
            return tableDefinitionInstance;
        }
        else {
            existingTableDefinition.setName(tableName);
            existingTableDefinition.setDescription(tableDescription);
            existingTableDefinition.setTableData(tableData);
            existingTableDefinition.setModifiedDate(new Date());
            return existingTableDefinition;
        }
    }

    def show = {
        def formDefinitionInstance = FormDefinition.get(params.id)
        if (!formDefinitionInstance) {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'formDefinition.label', default: 'FormDefinition'), params.id])}"
            redirect(action: "list")
        }
        else {
            [formDefinitionInstance: formDefinitionInstance]
        }
    }

    /**
     * Deploys the model instance.
     * @param combined The object with the data model, form definition and table definition.
     * @param realm The container for the data model.
     */
    private void deployModelInstance(CombinedDataForm combined, String realm) {
        try {
            modelDeployService.deployModel(combined.dataModel, realm);
            String message = "${message(code: 'datamodel.deploy.success')}"
            StatusResponse response = new StatusResponse(status: ErrorCode.OK.getCode(), object:combined, msg: message);
            render response as JSON;
        }
        catch(Exception e) {
            log.error("Could not deploy model.", e);
            StatusResponse response = new StatusResponse(status: ErrorCode.DM_DEPLOY_FAIL.getCode(),
                    msg: ErrorCode.DM_DEPLOY_FAIL.getMessage(), object: dataModelInstance, errors: []);
            render response as JSON
        }
    }

    /**
     * Retrieves a form definition by identifier.
     */
    def showJson = {
        FormDefinition formDefinitionInstance = FormDefinition.get(params.id)
        if (!formDefinitionInstance) {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'formDefinition.label', default: 'FormDefinition'), params.id])}"
            StatusResponse response = new StatusResponse(status: ErrorCode.NOT_FOUND.getCode(),
                    msg: ErrorCode.NOT_FOUND.getMessage(), object: params.id, errors: []);
            render response as JSON;
        }
        else {
            formDefinitionInstance.formData = formDefinitionInstance.formData.replaceAll("\r\n", "").replaceAll("\n", "");
            render formDefinitionInstance as JSON;
        }
    }

    def edit = {
        def formDefinitionInstance = FormDefinition.get(params.id)
        if (!formDefinitionInstance) {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'formDefinition.label', default: 'FormDefinition'), params.id])}"
            redirect(action: "list")
        }
        else {
            return [formDefinitionInstance: formDefinitionInstance]
        }
    }

    def update = {
        def formDefinitionInstance = FormDefinition.get(params.id)
        if (formDefinitionInstance) {
            if (params.version) {
                def version = params.version.toLong()
                if (formDefinitionInstance.version > version) {

                    formDefinitionInstance.errors.rejectValue("version", "default.optimistic.locking.failure", [
                        message(code: 'formDefinition.label', default: 'FormDefinition')]
                    as Object[], "Another user has updated this FormDefinition while you were editing")
                    render(view: "edit", model: [formDefinitionInstance: formDefinitionInstance])
                    return
                }
            }
            formDefinitionInstance.properties = params
            if (!formDefinitionInstance.hasErrors() && formDefinitionInstance.save(flush: true)) {
                flash.message = "${message(code: 'default.updated.message', args: [message(code: 'formDefinition.label', default: 'FormDefinition'), formDefinitionInstance.id])}"
                redirect(action: "show", id: formDefinitionInstance.id)
            }
            else {
                render(view: "edit", model: [formDefinitionInstance: formDefinitionInstance])
            }
        }
        else {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'formDefinition.label', default: 'FormDefinition'), params.id])}"
            redirect(action: "list")
        }
    }

    /**
     * Updates a form definition and replies in JSON format.
     */
    def updateJson = {

        final boolean doDeploy = params[DEPLOY_DATA_MODEL] != null;
        final String dataModelId = params[DATA_MODEL_ID];
        final dataModelIdLong = Long.parseLong(dataModelId);
        final DataModel dataModelInstance = DataModel.get(dataModelIdLong);
        
        def user = SecUser.get(springSecurityService.principal.id);
        dataModelInstance?.secUser = user;

        final String formIdStr = params[FORM_ID];

        final long formId = Long.parseLong(formIdStr);
        final FormDefinition formDefinitionInstance = FormDefinition.get(formId);

        final TableDefinition tableDefinition = TableDefinition.get(params[TABLE_ID]);
        final CombinedDataForm combined = new CombinedDataForm(
                dataModel: dataModelInstance, formDefinition: formDefinitionInstance, tableDefinition: tableDefinition);
        if (formDefinitionInstance && dataModelInstance && tableDefinition) {
            if (params.version) {
                def version = params.version.toLong()
                if (formDefinitionInstance.version > version) {

                    formDefinitionInstance.errors.rejectValue("version", "default.optimistic.locking.failure", [
                        message(code: 'formDefinition.label', default: 'FormDefinition')]
                    as Object[], "Another user has updated this FormDefinition while you were editing")
                    StatusResponse response = new StatusResponse(
                            status: ErrorCode.VERSION_SYNC_FAILURE.getCode(),
                            msg: ErrorCode.VERSION_SYNC_FAILURE.getMessage(),
                            object: formDefinitionInstance,
                            errors: formDefinitionInstance.errors);
                    render response as JSON
                }
            }
            createOrUpdateFormDefinitionInstance(params, dataModelInstance, formDefinitionInstance);
            createOrChangeDataModelInstance(params, dataModelInstance);
            createTableDefinitionInstance(params, dataModelInstance, tableDefinition);
            try {
                if (!dataModelInstance.hasErrors() && !formDefinitionInstance.hasErrors() && !tableDefinition.hasErrors()
                && dataModelInstance.save(flush: true) && formDefinitionInstance.save(flush: true) && tableDefinition.save(flush: true)) {
                    if(!doDeploy) {
                        flash.message = "${message(code: 'default.updated.message', args: [message(code: 'formDefinition.label', default: 'FormDefinition'), formDefinitionInstance.id])}"
                        StatusResponse response = new StatusResponse(
                                status: ErrorCode.OK.getCode(),
                                msg: flash.message,
                                object: combined);
                        render response as JSON
                    }
                    else {
                        deployModelInstance(combined, GenericDataService.COMMON_REALM);
                        return;
                    }
                }
                else {
                    log.error(dataModelInstance.errors);
                    StatusResponse response = new StatusResponse(status: ErrorCode.GENERIC_FAILURE.getCode(),
                            msg: ErrorCode.GENERIC_FAILURE.getMessage(), object: combined, errors: []);
                    render response as JSON
                }
            }
            catch(Exception e) {
                log.error("Could not save data to the database.", e);
                StatusResponse response = new StatusResponse(status: ErrorCode.DB_FAILURE.getCode(),
                        msg: ErrorCode.DB_FAILURE.getMessage(), object: combined);
                render response as JSON;
            }
        }
        else {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'formDefinition.label', default: 'FormDefinition'), params.id])}"
            StatusResponse response = new StatusResponse(status: ErrorCode.NOT_FOUND.getCode(),
                    msg: flash.message, object: combined, errors: []);
            render response as JSON
        }
    }

    def delete = {
        def formDefinitionInstance = FormDefinition.get(params.id)
        if (formDefinitionInstance) {
            try {
                formDefinitionInstance.delete(flush: true)
                flash.message = "${message(code: 'default.deleted.message', args: [message(code: 'formDefinition.label', default: 'FormDefinition'), params.id])}"
                redirect(action: "list")
            }
            catch (org.springframework.dao.DataIntegrityViolationException e) {
                flash.message = "${message(code: 'default.not.deleted.message', args: [message(code: 'formDefinition.label', default: 'FormDefinition'), params.id])}"
                redirect(action: "show", id: params.id)
            }
        }
        else {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'formDefinition.label', default: 'FormDefinition'), params.id])}"
            redirect(action: "list")
        }
    }

    /**
     * Deletes a module after receiving the data associated to this module.
     * @param formId The form identifier.
     * @param dataModelId The data model identifier.
     */
    def deleteJson = {
        final FormDefinition formDefinitionInstance = FormDefinition.get(params[FORM_ID])
        final DataModel dataModel = DataModel.get(params[DATA_MODEL_ID])
        final TableDefinition tableDefinition = TableDefinition.get(params[TABLE_ID])
        final CombinedDataForm combined = new CombinedDataForm(
                dataModel: dataModel, formDefinition: formDefinitionInstance, tableDefinition: tableDefinition);
        if (formDefinitionInstance && dataModel && tableDefinition) {
            try {
                formDefinitionInstance.delete(flush: true)
                tableDefinition.delete(flush: true)
                dataModel.delete(flush: true)
                modelDeployService.dropModel(dataModel, GenericDataService.COMMON_REALM);
                flash.message = "${message(code: 'default.deleted.message', args: [message(code: 'formDefinition.label', default: 'FormDefinition'), params.id])}"
                StatusResponse response = new StatusResponse(
                        status: ErrorCode.OK.getCode(),
                        msg: flash.message,
                        object: combined);
                render response as JSON
            }
            catch (org.springframework.dao.DataIntegrityViolationException e) {
                log.error("Could not perform delete operation.", e);
                flash.message = "${message(code: 'default.not.deleted.message', args: [message(code: 'formDefinition.label', default: 'FormDefinition'), params.id])}"
                StatusResponse response = new StatusResponse(status: ErrorCode.DB_FAILURE.getCode(),
                        msg: flash.message, object: combined);
                render response as JSON;
            }
        }
        else {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'formDefinition.label', default: 'FormDefinition'), params.id])}"
            StatusResponse response = new StatusResponse(status: ErrorCode.NOT_FOUND.getCode(),
                    msg: flash.message, object: combined);
            render response as JSON;
        }
    }
}
