package com.consultinglimited.crm;

import java.util.regex.Matcher;
import java.util.regex.Pattern;


import grails.converters.JSON

import com.consultinglimited.crm.service.model.FilterOperator;
import com.consultinglimited.crm.service.model.ReadData;
import com.consultinglimited.crm.service.GenericDataService;
import com.consultinglimited.crm.model.SmartClientResponse;
import com.consultinglimited.crm.service.model.FilterCriteria;
import com.consultinglimited.crm.helper.ListWriter;
import com.consultinglimited.crm.model.CombinedDataForm
import com.consultinglimited.crm.service.model.factory.FilterCriteriaFactory;
import com.consultinglimited.crm.security.SecUser
import com.consultinglimited.crm.PagingConstants
import com.consultinglimited.crm.helper.RegexUtil;


/**
 * Used to retrieve list data from the tables.
 * 
 * @author gil
 */
class ListController {

    /**
     * The default mime type.
     */
    static final String DEFAULT_MIME_TYPE = "text/plain;charset=UTF-8";

    /**
     * Separates the JSON of the form definition and the data model.
     */
    private static final SEPARATOR = "@@@";

    /**
     * The data model identifier parameter.
     */
    static final String DATA_MODEL_ID_PARAM = "dataModelId";

    /**
     * The parameter used to extract the filter criteria.
     */
    private static final String CRITERIA_PARAM = "criteria";
    
    /**
     * The identifier of the column to be used to display a reference in a combo.
     */
    private static final String COL_ID_PARAM = "colId";

    /**
     * The data service for CRUD operations.
     */
    GenericDataService dataService;
    
    /**
    * Used to check the login data and the security related informations.
    */
    def springSecurityService;

    /**
     * The data model service.
     */
    def dataModelService;
    
    /**
     * Reads the table model JSON and streams the 
     * table model data to the client.
     */
    def readTableModelJson = {


        String tableDefId = params[FormDefinitionController.TABLE_ID];
        TableDefinition tableDefinitonInstance = TableDefinition.get(tableDefId);
        response.contentType = DEFAULT_MIME_TYPE;
        if(tableDefinitonInstance == null) {
            log.error("Table model not found.");
            response.outputStream << ListWriter.writeJson(Collections.emptyList(), 0, 0, 0);
            return;
        }
        // returns the table definition data, separator, datamodel data, SEPARATOR, datamodel id.
        final String output = tableDefinitonInstance.getTableData() + SEPARATOR +
                tableDefinitonInstance.dataModel.modelData + SEPARATOR + tableDefinitonInstance.dataModel.id;
        response.outputStream << output;
    }

    /**
     * Reads a list and expects the following parameters:
     * <ul>
     *    <li>offset - where to start</li>
     *    <li>size - the size of the record set.</li>
     *    <li>dataModelId - the identifier of the data model.</li>
     * </ul>
     */
    def readModelJson = {
        final String dataModelId = params[DATA_MODEL_ID_PARAM];
        final DataModel dataModelInstance = DataModel.get(dataModelId);
        response.contentType = DEFAULT_MIME_TYPE;
        if(dataModelInstance == null) {
            log.error("Data model not found.");
            response.outputStream << ListWriter.writeJson(Collections.emptyList(), 0, 0, 0);
            return;
        }
        final String output = dataModelInstance.getModelData()
        response.outputStream << output;
    }

    /**
     * Reads a list and expects the following parameters:
     * <ul>
     *    <li>offset - where to start</li>
     *    <li>size - the size of the record set.</li>
     *    <li>dataModelId - the identifier of the data model.</li>
     * </ul>
     */
    def readDataJson = {
        String output = processReadDataJson(
            params, request, response, log, dataService, springSecurityService, dataModelService);
        response.outputStream << output;
    }
    
    /**
     * Processes the reading of JSON data.
     * @param params The http parameters.
     * @param request The http request object.
     * @param response The http response object.
     * @param log The logging object.
     * @param dataService The service used to read the data.
     */
    static processReadDataJson(
        def params, def request, def response, def log, def dataService, def springSecurityService, def dataModelService) {

        final String dataModelId = params[DATA_MODEL_ID_PARAM];
        final DataModel dataModelInstance = DataModel.get(Long.parseLong(dataModelId));
        response.contentType = DEFAULT_MIME_TYPE;
        if(dataModelInstance == null) {
            log.error("Data model not found.");
            response.outputStream << ListWriter.writeJson(Collections.emptyList(), 0, 0, 0);
            return;
        }
        
        final ReadData readData = extractReadData(params, request, dataModelInstance, log);
        
        // Fetching the data model data so that the mappings of the data model can be handed
        // over to the service.
        def user = SecUser.get(springSecurityService.principal.id);
        List<CombinedDataForm> combinedDataFormList = dataModelService.fetchUserEntities(user, params);
        final Map<Long, DataModel> dataModelMap = dataModelService.extractModels(combinedDataFormList);
        
        readData.setUserDataModelMap(dataModelMap);
        
        final List<Map<String, Object>> resultSet = dataService.read(dataModelInstance, GenericDataService.COMMON_REALM,
                readData);
        long total = dataService.totalSize(dataModelInstance, GenericDataService.COMMON_REALM, readData);
        String output = ListWriter.writeJson(resultSet, readData.getOffset(), readData.getEndRow(), total);
        
        // Inject some extra information about the data model and the views.
        def tableDefs = TableDefinition.findByDataModel(dataModelInstance);
        if(tableDefs && tableDefs instanceof TableDefinition) {
            output = output.replaceFirst("\"totalRows\"", '"tableDefId":' + tableDefs.id + ', \"totalRows\"')
        }
        output = output.replaceFirst("\"totalRows\"", '"dataModelName":"' + dataModelInstance.name + '", \"totalRows\"')
        return output;
    }

    /**
     * Extracts the query data from the http parameters.
     * @param params The map with http parameters.
     * @param request The http servlet request.
     * @param dataModelInstance An instance of the data model.
     * @param log A logging object.
     * @return the query data used to perform the query.
     */
    static ReadData extractReadData(def params, def request, DataModel dataModelInstance, def log) {
        int offset = params[PagingConstants.OFFSET] == null ? 0 : Integer.parseInt(params[PagingConstants.OFFSET]);
        int endRow = params[PagingConstants.ENDROW] == null ? 1000 : Integer.parseInt(params[PagingConstants.ENDROW]);
        final def sortBy = params[PagingConstants.SORT_BY_PARAM];
        int size = endRow - offset;
        final ReadData readData = new ReadData(offset, size);
        readData.setEndRow(endRow);
        if(sortBy) {
            readData.setSortBy(sortBy instanceof List ? sortBy : [sortBy.toString()]);
        }
        // Strategy 1 - this seems to work with the advanced filters.
        final String[] criterias = request.getParameterValues(CRITERIA_PARAM);
        for(String criteria : criterias) {
            try {
                List<FilterCriteria> filterCriteriaList = FilterCriteriaFactory.createInstances(criteria);
                readData.addAll(filterCriteriaList);
            }
            catch(Exception e) {
                log.error("Could not decode filter.", e);
            }
        }

        // Strategy 2 - this seems to work for SmartClient 8.1 for strings.
        // check data type.
        final String jsonStr = dataModelInstance.getModelData();
        def dataModel = JSON.parse(jsonStr);
        List<FilterCriteria> filterCriteriaList = new ArrayList<FilterCriteria>();
        for(def param in params) {
            String key = param.key;
            String[] filterData = RegexUtil.extractFilterFromParam(key);
            // Check the type of the field and handle it accordingly.
            if(filterData) {
                for(def field in dataModel.fields) {
                    if(filterData[0].equals(field.id.toString())) {
                        if("text".equals(field.type) || "time".equals(field.type)) {
                            final FilterCriteria filterCriteria = new FilterCriteria()
                                .setFieldName(key).setFilterOperator(
                                    "text".equals(field.type) ? FilterOperator.I_CONTAINS : FilterOperator.EQUALS)
                                .setValue(param.value);
                            filterCriteriaList.add(filterCriteria);
                            break;
                        }
                    }
                }
            }
        }
        readData.addAll(filterCriteriaList);
        
        final String colId = params[COL_ID_PARAM];
        if(colId) {
            readData.setColIdList([Integer.parseInt(colId)]);
        }
        return readData;
    }
    
    /**
     * Deletes record sets.
     */
    def deleteDataJson = {
        String id = params[DATA_MODEL_ID_PARAM]
        DataModel dataModelInstance = DataModel.get(id);
        response.contentType = DEFAULT_MIME_TYPE;
        if(dataModelInstance == null) {
            // could be a table model instance.
            TableDefinition tableDef = TableDefinition.get(id);
            if(tableDef.dataModel == null) {
                handleNoDataModel();
                return;
            }
            dataModelInstance = tableDef.dataModel;
        }
        String idListStr = params["idListStr"];
        String[] ids = idListStr.split("\\,");
        List<String> idList = Arrays.asList(ids);
        long count = dataService.delete(dataModelInstance, GenericDataService.COMMON_REALM, idList)
        if(count == 0) {
            log.error("Could not delete from model: " + dataModelInstance);
            log.error("Ids: " + idListStr);
        }
        render new SmartClientResponse(totalCount: 0, totalRows: 0,
                status: count > 0 ? ErrorCode.OK.getCode() : ErrorCode.NOT_FOUND.getCode(), startRow: 0, endRow: 0) as JSON;
    }

    /**
     * Truncates all data in a table.
     */
    def truncateDataJson = {
        final DataModel dataModelInstance = DataModel.get(params[DATA_MODEL_ID_PARAM]);
        response.contentType = DEFAULT_MIME_TYPE;
        if(dataModelInstance == null) {
            handleNoDataModel();
            return;
        }
        long truncated = dataService.truncate(dataModelInstance, GenericDataService.COMMON_REALM);
        render new SmartClientResponse(totalCount: 0, totalRows: 0,
                status: truncated > 0 ? ErrorCode.OK.getCode() : ErrorCode.NOT_FOUND.getCode(), startRow: 0, endRow: 0) as JSON;
    }

    /**
     * Updates a single row at a time.
     */
    def updateDataJson = {
        String id = params[DATA_MODEL_ID_PARAM]
        final DataModel dataModelInstance = DataModel.get(id);
        response.contentType = DEFAULT_MIME_TYPE;
        if(dataModelInstance == null) {
            handleNoDataModel();
            return;
        }
        final Map<String, Object> paramMap = new HashMap<String, Object>();
        params.each {
            if(it.key.contains("_")) {
                paramMap.put(it.key, it.value);
            }
        }
        
        def user = SecUser.get(springSecurityService.principal.id);
        final List<CombinedDataForm> combinedDataFormList = dataModelService.fetchUserEntities(user, params);
        final Map<Long, DataModel> dataModelMap = dataModelService.extractModels(combinedDataFormList);
        
        final Date updateDate = dataService.update(dataModelInstance, GenericDataService.COMMON_REALM, paramMap, dataModelMap);
        if(updateDate) {
            paramMap.put(GenericDataService.UPDATE_DATE_FIELD, updateDate.format("'new Date('yyyy','MM','dd','HH','mm')'"));
            render new SmartClientResponse(totalCount: 1, totalRows: 1,
                    status: ErrorCode.OK.getCode(), startRow: 0, endRow: 0,
                    data: paramMap) as JSON;
        }
        else {
            render new SmartClientResponse(totalCount: 0, totalRows: 0,
                    status: ErrorCode.DB_FAILURE.getCode(), startRow: 0, endRow: 0) as JSON;
        }
    }

    /**
     * Displays a non-designed table with the raw list.
     */
    def showRawList = {
    }

    def showFormattedList = {
    }

    /**
     * Handles the situation in which the data model could not be found.
     */
    private void handleNoDataModel() {
        log.error("Data model not found.");
        render new SmartClientResponse(totalCount: 0, totalRows: 0,
                status: ErrorCode.NOT_FOUND.getCode(), startRow: 0, endRow: 0) as JSON;
    }
}
