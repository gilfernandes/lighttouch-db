package com.consultinglimited.crm

import com.consultinglimited.crm.model.DataModelViews;
import com.consultinglimited.crm.model.DataModelListResult;
import com.consultinglimited.crm.model.SmartClientResponse;
import com.consultinglimited.crm.security.SecUser
import com.consultinglimited.crm.security.SecRole
import grails.converters.JSON

/**
 * Controller for the data model operations.
 */
class DataModelController {

    static allowedMethods = [save: "POST", update: "POST", delete: "POST"]
    
    /**
    * The service used to query which user is currently logged in.
    */
   def springSecurityService;

    def index = {
        redirect(action: "list", params: params)
    }

    def list = {
        params.max = Math.min(params.max ? params.int('max') : 10, 100)
        [dataModelInstanceList: DataModel.list(params), dataModelInstanceTotal: DataModel.count()]
    }

    /**
     * Returns a list of data models as JSON.
     * @return a list of data models as JSON.
     */
    def listJson = {
        // TODO: Make paging work.
        params.max = Math.min(params.max ? params.int('max') : 1000, 1000)
        int offset = params.offset == null ? 0 : Integer.parseInt(params.offset)
        def user = SecUser.get(springSecurityService.principal.id);
        boolean isAdmin = SecRole.isAdmin(user); // Check, if this user is an administrator.
        final List<DataModel> dataModelInstanceList = isAdmin ? DataModel.list(params) : DataModel.findAllBySecUser(user)
        final int total = dataModelInstanceList.size()
        DataModelListResult result = new DataModelListResult(rows: dataModelInstanceList, totalRows: total, 
            startRow: offset);
        render result as JSON;
    }
    
    /**
     * Returns a list of all views including table and form views as JSON.
     * @return a list of all views including table and form views as JSON.
     */
    def listViewsJson = {
        def id = params.id
        if(!id) {
            render new DataModelViews() as JSON
        }
        def dataModel = DataModel.get(id)
        Collection<FormDefinition> formDefinitions = dataModel ? FormDefinition.findAllByDataModel(dataModel) : []
        Collection<TableDefinition> tableDefinitions = dataModel ? TableDefinition.findAllByDataModel(dataModel) : []
        DataModelViews views = new DataModelViews(
            dataModel: dataModel, formDefinitionCol: formDefinitions, tableDefinitionCol: tableDefinitions)
        render views as JSON;
    }
    
    def create = {
        def dataModelInstance = new DataModel()
        dataModelInstance.properties = params
        return [dataModelInstance: dataModelInstance]
    }

    def save = {
        def dataModelInstance = new DataModel(params)
        if (dataModelInstance.save(flush: true)) {
            flash.message = "${message(code: 'default.created.message', args: [message(code: 'dataModel.label', default: 'DataModel'), dataModelInstance.id])}"
            redirect(action: "show", id: dataModelInstance.id)
        }
        else {
            render(view: "create", model: [dataModelInstance: dataModelInstance])
        }
    }

    def show = {
        def dataModelInstance = DataModel.get(params.id)
        if (!dataModelInstance) {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'dataModel.label', default: 'DataModel'), params.id])}"
            redirect(action: "list")
        }
        else {
            [dataModelInstance: dataModelInstance]
        }
    }

    def edit = {
        def dataModelInstance = DataModel.get(params.id)
        if (!dataModelInstance) {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'dataModel.label', default: 'DataModel'), params.id])}"
            redirect(action: "list")
        }
        else {
            return [dataModelInstance: dataModelInstance]
        }
    }

    def update = {
        def dataModelInstance = DataModel.get(params.id)
        if (dataModelInstance) {
            if (params.version) {
                def version = params.version.toLong()
                if (dataModelInstance.version > version) {

                    dataModelInstance.errors.rejectValue("version", "default.optimistic.locking.failure", [
                        message(code: 'dataModel.label', default: 'DataModel')]
                    as Object[], "Another user has updated this DataModel while you were editing")
                    render(view: "edit", model: [dataModelInstance: dataModelInstance])
                    return
                }
            }
            dataModelInstance.properties = params
            if (!dataModelInstance.hasErrors() && dataModelInstance.save(flush: true)) {
                flash.message = "${message(code: 'default.updated.message', args: [message(code: 'dataModel.label', default: 'DataModel'), dataModelInstance.id])}"
                redirect(action: "show", id: dataModelInstance.id)
            }
            else {
                render(view: "edit", model: [dataModelInstance: dataModelInstance])
            }
        }
        else {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'dataModel.label', default: 'DataModel'), params.id])}"
            redirect(action: "list")
        }
    }

    def delete = {
        def dataModelInstance = DataModel.get(params.id)
        if (dataModelInstance) {
            try {
                dataModelInstance.delete(flush: true)
                flash.message = "${message(code: 'default.deleted.message', args: [message(code: 'dataModel.label', default: 'DataModel'), params.id])}"
                redirect(action: "list")
            }
            catch (org.springframework.dao.DataIntegrityViolationException e) {
                flash.message = "${message(code: 'default.not.deleted.message', args: [message(code: 'dataModel.label', default: 'DataModel'), params.id])}"
                redirect(action: "show", id: params.id)
            }
        }
        else {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'dataModel.label', default: 'DataModel'), params.id])}"
            redirect(action: "list")
        }
    }

    /**
     * Used to update attributes of the data model and form definition.
     */
    def updateListJson = {
        def id = params.id
        final DataModel dataModel = DataModel.get(id);
        def oldValuesStr = params._oldValues
        def oldValues = JSON.parse(oldValuesStr)
        final FormDefinition formDef = FormDefinition.get(oldValues.formDefinitionId);
        if(!dataModel || !formDef) {
            render new SmartClientResponse(totalCount: 0, totalRows: 0,
                    status: ErrorCode.NOT_FOUND.getCode(), startRow: 0, endRow: 0) as JSON;
            return;
        }
        params.each { entry ->
            String key = entry.key
            if(!key.startsWith("_") && !key.equals("id") && !key.startsWith("isc_")) {
                switch(key) {
                    case "dataModelName":
                        dataModel.setName(entry.value);
                        dataModel.setModifiedDate(new Date());
                        break;
                    case "dataModelDescription":
                        dataModel.setDescription(entry.value)
                        dataModel.setModifiedDate(new Date());
                        break;
                    case "formDefinitionName":
                        formDef.setName(entry.value)
                        formDef.setModifiedDate(new Date())
                        break;
                    case "formDefinitionDescription":
                        formDef.setDescription(entry.value)
                        formDef.setModifiedDate(new Date())
                        break;
                }
            }
        }
        render new SmartClientResponse(totalCount: 0, totalRows: 0,
                status: ErrorCode.OK.getCode(), startRow: 0, endRow: 0) as JSON;
    }
}
