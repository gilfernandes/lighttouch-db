package com.consultinglimited.crm

import com.consultinglimited.crm.security.SecUser
import com.consultinglimited.crm.security.SecRole
import com.consultinglimited.crm.model.StatusResponse
import com.consultinglimited.crm.model.ModuleListResult
import com.consultinglimited.crm.model.InitAppResult
import grails.converters.JSON

/**
 * Used to perform standard operations on applications.
 * The name should be more application controller.
 * 
 * @author gil
 */
class ModuleController {

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
        [moduleInstanceList: Module.list(params), moduleInstanceTotal: Module.count()]
    }
    
    /**
     * Renders the list of modules as a JSON array.
     */
    def listJson = {
        params.max = Math.min(params.max ? params.int('max') : 10000, 100000)
        final Collection<Module> moduleList = fetchModuleList(SecUser.get(springSecurityService.principal.id))
        ModuleListResult res = new ModuleListResult(rows: moduleList, totalRows: moduleList.size())
        render res as JSON;
    }
    
    /**
     * Selects the default application for this user and delivers the 
     * list with the applications available to a user.
     */
    def initAppJson = {
        def user = SecUser.get(springSecurityService.principal.id);
        final Collection<Module> moduleList = fetchModuleList(SecUser.get(springSecurityService.principal.id))
        // Find the default application.
        Module defaultM = null;
        if(moduleList.size() > 0) {
            moduleList.sort({it.id})
            Module firstM = null;
            for(Module m in moduleList) {
                if(!firstM) {
                    firstM = m;
                }
                if(m.defaultApp) {
                    defaultM = m;
                    break;
                }
            }
            if(!defaultM) { // No default module, this first in the list will do the job.
                defaultM = firstM;
            }
        }
        InitAppResult appRes = new InitAppResult(defaultModule: defaultM, moduleListResult: new ModuleListResult(rows: moduleList));
        render appRes as JSON;
    }
    
    /**
     * Fetches the module list for a specific user.
     * @param user The user for which the module list is to be fetched.
     * @return the module list for a specific user.
     */
    Collection<Module> fetchModuleList(def user) {
        boolean isAdmin = SecRole.isAdmin(user); // Check, if this user is an administrator.
        return isAdmin ? Module.list(params) : Module.findAllBySecUser(user);
    }
    
    def create = {
        def moduleInstance = new Module()
        moduleInstance.properties = params
        return [moduleInstance: moduleInstance]
    }

    def save = {
        def moduleInstance = new Module(params)
        if (moduleInstance.save(flush: true)) {
            flash.message = "${message(code: 'default.created.message', args: [message(code: 'module.label', default: 'Module'), moduleInstance.id])}"
            redirect(action: "show", id: moduleInstance.id)
        }
        else {
            render(view: "create", model: [moduleInstance: moduleInstance])
        }
    }
    
    /**
    * Saves the module.
    * Expects the parameters:
    * <ul>
    *     <li><strong>name</strong> The name of the form.</li>
    *     <li><strong>description</strong> The description of the form.</li>
    *     <li><strong>data</strong> The form definition.</li>
    * </ul>
    */
    def saveJson = {
        Module m = createOrChangeModuleInstance(params, null);
        def user = SecUser.get(springSecurityService.principal.id);
        m?.secUser = user;
        boolean valid = m?.validate();
        StatusResponse response;
        if(valid && m.save(flush: true)) {
            String message =
                "${message(code: 'default.created.message', args: [message(code: 'module.label', default: 'Module'), m.id])}";
            response = new StatusResponse(status: ErrorCode.OK.getCode(), object: m, msg: message);
        }
        else {
            response = new StatusResponse(status: ErrorCode.GENERIC_FAILURE.getCode(),
                msg: ErrorCode.GENERIC_FAILURE.getMessage(), object: m, errors: m.errors);
        }
        render response as JSON;
    }
    
    /**
     * Updates the module.
     * Expects the parameters:
     * <ul>
    *     <li><strong>name</strong> The name of the form.</li>
    *     <li><strong>description</strong> The description of the form.</li>
    *     <li><strong>data</strong> The form definition.</li>
    * </ul>
     */
    def updateJson = {
        Module m = Module.get(params[ConstantContainer.ID_PARAM]);
        StatusResponse response;
        if(!m) {
            response = new StatusResponse(status: ErrorCode.NOT_FOUND.getCode(),
                msg: ErrorCode.NOT_FOUND.getMessage(), object: m, errors: []);
        }
        else {
            m = createOrChangeModuleInstance(params, m);
            boolean valid = m?.validate()
            if(valid && m.save(flush: true)) {
                String message =
                    "${message(code: 'default.updated.message', args: [message(code: 'module.label', default: 'Module'), m.id])}"
                response = new StatusResponse(status: ErrorCode.OK.getCode(), object: m, msg: message);
            }
            else {
                log.error("Could not save object: " + m);
                response = new StatusResponse(status: ErrorCode.DB_FAILURE.getCode(),
                    msg: ErrorCode.DB_FAILURE.getMessage(), object: m, errors: []);
            }
        }
        render response as JSON;
    }
    
    /**
    * Creates a module instance.
    * @param params The http parameter map used to create a data model instance.
    * @param moduleInstance An existing data model instance. If {@code null} a new
    * data model instance is created.
    * @return a data model instance.
    */
   private Module createOrChangeModuleInstance(Map params, Module moduleInstance) {
       boolean fullOperation = params["_operationType"] == null;
       final String moduleName = fullOperation ? params[ConstantContainer.NAME_PARAM] : 
           (params[ConstantContainer.NAME_PARAM] ? params[ConstantContainer.NAME_PARAM] : moduleInstance.name);
       String moduleDescription = fullOperation ? params[ConstantContainer.DESCRIPTION_PARAM] : 
           (params[ConstantContainer.DESCRIPTION_PARAM] ? params[ConstantContainer.DESCRIPTION_PARAM] : moduleInstance.description);
       String defaultAppStr = fullOperation ? params[ConstantContainer.DEFAULT_APP_PARAM] : 
           (params[ConstantContainer.DEFAULT_APP_PARAM] ? params[ConstantContainer.DEFAULT_APP_PARAM] : Boolean.toString(moduleInstance.defaultApp));
       boolean defaultApp = Boolean.valueOf(defaultAppStr);
       if(moduleDescription == "null") {
           moduleDescription = "";
       }
       final String moduleData = fullOperation ? params[ConstantContainer.DATA_PARAM] :
           (params[ConstantContainer.DATA_PARAM] ? params[ConstantContainer.DATA_PARAM] : moduleInstance.moduleData);
       if(moduleInstance == null) {
           return new Module(name: moduleName,
               description: moduleDescription, moduleData: moduleData, defaultApp: defaultApp);
       }
       else {
           moduleInstance.setName(moduleName);
           moduleInstance.setDescription(moduleDescription);
           moduleInstance.setModuleData(moduleData);
           moduleInstance.setModifiedDate(new Date());
           moduleInstance.setDefaultApp(defaultApp);
           return moduleInstance;
       }
   }

    def show = {
        def moduleInstance = Module.get(params.id)
        if (!moduleInstance) {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'module.label', default: 'Module'), params.id])}"
            redirect(action: "list")
        }
        else {
            [moduleInstance: moduleInstance]
        }
    }

    def edit = {
        def moduleInstance = Module.get(params.id)
        if (!moduleInstance) {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'module.label', default: 'Module'), params.id])}"
            redirect(action: "list")
        }
        else {
            return [moduleInstance: moduleInstance]
        }
    }

    def update = {
        def moduleInstance = Module.get(params.id)
        if (moduleInstance) {
            if (params.version) {
                def version = params.version.toLong()
                if (moduleInstance.version > version) {
                    
                    moduleInstance.errors.rejectValue("version", "default.optimistic.locking.failure", [message(code: 'module.label', default: 'Module')] as Object[], "Another user has updated this Module while you were editing")
                    render(view: "edit", model: [moduleInstance: moduleInstance])
                    return
                }
            }
            moduleInstance.properties = params
            if (!moduleInstance.hasErrors() && moduleInstance.save(flush: true)) {
                flash.message = "${message(code: 'default.updated.message', args: [message(code: 'module.label', default: 'Module'), moduleInstance.id])}"
                redirect(action: "show", id: moduleInstance.id)
            }
            else {
                render(view: "edit", model: [moduleInstance: moduleInstance])
            }
        }
        else {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'module.label', default: 'Module'), params.id])}"
            redirect(action: "list")
        }
    }

    def delete = {
        def moduleInstance = Module.get(params.id)
        if (moduleInstance) {
            try {
                moduleInstance.delete(flush: true)
                flash.message = "${message(code: 'default.deleted.message', args: [message(code: 'module.label', default: 'Module'), params.id])}"
                redirect(action: "list")
            }
            catch (org.springframework.dao.DataIntegrityViolationException e) {
                flash.message = "${message(code: 'default.not.deleted.message', args: [message(code: 'module.label', default: 'Module'), params.id])}"
                redirect(action: "show", id: params.id)
            }
        }
        else {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'module.label', default: 'Module'), params.id])}"
            redirect(action: "list")
        }
    }
    
    /**
     * Deletes a module.
     */
    def deleteJson = {
        def moduleInstance = Module.get(params.id)
        StatusResponse response;
        if (moduleInstance) {
            try {
                moduleInstance.delete(flush: true)
                flash.message = "${message(code: 'default.deleted.message', args: [message(code: 'module.label', default: 'Module'), params.id])}"
                response = new StatusResponse(status: ErrorCode.OK.getCode(),
                    msg: flash.message, object: moduleInstance);
            }
            catch (org.springframework.dao.DataIntegrityViolationException e) {
                flash.message = "${message(code: 'default.not.deleted.message', args: [message(code: 'module.label', default: 'Module'), params.id])}"
                response = new StatusResponse(status: ErrorCode.DB_FAILURE.getCode(),
                    msg: flash.message, object: moduleInstance);
            }
        }
        else {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'module.label', default: 'Module'), params.id])}"
            response = new StatusResponse(status: ErrorCode.NOT_FOUND.getCode(),
                msg: flash.message, object: moduleInstance);
        }
        render response as JSON;
    }
}
