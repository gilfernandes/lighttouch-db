package com.consultinglimited.crm

import java.util.Map;

import com.consultinglimited.crm.DataModel;
import com.consultinglimited.crm.ListController;
import com.consultinglimited.crm.model.StatusResponse
import com.consultinglimited.crm.service.GenericDataService
import grails.converters.JSON
import com.consultinglimited.crm.model.CombinedDataForm
import com.consultinglimited.crm.security.SecUser

/**
 * Used to generate a form using SmartClient.
 * @author gil
 */
class GeneratorController {

    /**
     * Separates the JSON of the form definition and the data model.
     */
    static final SEPARATOR = "@@@";

    /**
     * The identifier for the form parameter.
     */
    private static final String FORM_ID_PARAM = "formId";
    
    /**
     * The identifier for the form parameter which determines, how many times 
     * the data is to be repeated.
     */
    private static final String REPEAT_TIMES_PARAM = "repeatTimes";
    
    /**
     * The parameters to be excluded from the parameters of the {@code addData} method.
     */
    private static final List<String> EXCLUDED_PARAMS = Arrays.asList("action", "controller", FORM_ID_PARAM);
    
    /**
     * Used to access the data model service.
     */
    def dataModelService;
     
    static String separator = SEPARATOR;

    /**
     * The data service for CRUD operations.
     */
    GenericDataService dataService;
    
    /**
     * Used to check the login data and the security related informations.
     */
    def springSecurityService;


    /**
     * Generates a form using Smartclient.
     * @param id The identifier of the form definition.
     */
    def formData = {
        final FormDefinition formInstance = FormDefinition.get(params.id)
        if(formInstance == null) {
            StatusResponse response = new StatusResponse(status: ErrorCode.UNKNOWN_FORM.getCode(),
                    msg: ErrorCode.UNKNOWN_FORM.getMessage(), object: formInstance, errors: []);
            render response as JSON
            return;
        }
        render formInstance.formData + SEPARATOR + formInstance.dataModel.modelData;
    }

    /**
     * Generates a form with the form which matches the found form definition.
     * @param id The identifier of the form definition.
     */
    def generateForm = {
        def formDefinitionInstance = FormDefinition.get(params.id)
        if (!formDefinitionInstance) {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'formDefinition.label', default: 'FormDefinition'), params.id])}"
        }
        else {
            [formDefinitionInstance: formDefinitionInstance]
        }
    }

    /**
     * Adds data in a dynamical way to the database.
     */
    def addData = {
        final String formId = params[FORM_ID_PARAM];
        // This parameter allows to repeat the current data entry in the table.
        // This parameter is more for testing purposes.
        final String repeatParameter = params[REPEAT_TIMES_PARAM];
        int repeatTimes = repeatParameter == null ? 1 : Integer.parseInt(repeatParameter);
        final FormDefinition formInstance = FormDefinition.get(formId);
        if(!formInstance?.dataModel) {
            StatusResponse response = new StatusResponse(
                    status: ErrorCode.NOT_FOUND.getCode(),
                    msg: "${message(code: 'default.not.found.message', args: [message(code: 'formDefinition.label', default: 'FormDefinition'), params.id])}",
                    object: params);
            render response as JSON
            return;
        }
        final Map<String, ?> map = new HashMap<String, ?>();
        for(def obj in params) {
            if(!EXCLUDED_PARAMS.contains(obj.key)) {
                map.put(obj.key, obj.value);
            }
        }
        // Fetching the data model data so that the mappings of the data model can be handed 
        // over to the service.
        def user = SecUser.get(springSecurityService.principal.id);
        List<CombinedDataForm> combinedDataFormList = dataModelService.fetchUserEntities(user, params);
        final Map<Long, DataModel> dataModelMap = dataModelService.extractModels(combinedDataFormList);
        // TODO: the realm should be changed to the organisation of the user name.
        // So "common" is just a hack here.
        for(int i = 0; i < repeatTimes; i++) {
            dataService.create(map, formInstance.dataModel, 
                GenericDataService.COMMON_REALM, dataModelMap);
        }
        StatusResponse response = new StatusResponse(
                status: ErrorCode.OK.getCode(),
                msg: ErrorCode.OK.getMessage(),
                object: params);
        render response as JSON
    }
    
    /**
     * Reads the reference options for a combo box.
     * @param dataModelId The data model identifier.
     * @param colId The column identifier.
     */
    def readReferenceOptions = {
        String output = ListController.processReadDataJson(params, request, response, log, dataService, 
            springSecurityService, dataModelService);
        response.outputStream << output;
    }
}
