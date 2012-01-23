package com.consultinglimited.crm

class TableDefinitionController {

    static allowedMethods = [save: "POST", update: "POST", delete: "POST"]

    def index = {
        redirect(action: "list", params: params)
    }

    def list = {
        params.max = Math.min(params.max ? params.int('max') : 10, 100)
        [tableDefinitionInstanceList: TableDefinition.list(params), tableDefinitionInstanceTotal: TableDefinition.count()]
    }

    def create = {
        def tableDefinitionInstance = new TableDefinition()
        tableDefinitionInstance.properties = params
        return [tableDefinitionInstance: tableDefinitionInstance]
    }

    def save = {
        def tableDefinitionInstance = new TableDefinition(params)
        if (tableDefinitionInstance.save(flush: true)) {
            flash.message = "${message(code: 'default.created.message', args: [message(code: 'tableDefinition.label', default: 'TableDefinition'), tableDefinitionInstance.id])}"
            redirect(action: "show", id: tableDefinitionInstance.id)
        }
        else {
            render(view: "create", model: [tableDefinitionInstance: tableDefinitionInstance])
        }
    }

    def show = {
        def tableDefinitionInstance = TableDefinition.get(params.id)
        if (!tableDefinitionInstance) {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'tableDefinition.label', default: 'TableDefinition'), params.id])}"
            redirect(action: "list")
        }
        else {
            [tableDefinitionInstance: tableDefinitionInstance]
        }
    }

    def edit = {
        def tableDefinitionInstance = TableDefinition.get(params.id)
        if (!tableDefinitionInstance) {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'tableDefinition.label', default: 'TableDefinition'), params.id])}"
            redirect(action: "list")
        }
        else {
            return [tableDefinitionInstance: tableDefinitionInstance]
        }
    }

    def update = {
        def tableDefinitionInstance = TableDefinition.get(params.id)
        if (tableDefinitionInstance) {
            if (params.version) {
                def version = params.version.toLong()
                if (tableDefinitionInstance.version > version) {
                    
                    tableDefinitionInstance.errors.rejectValue("version", "default.optimistic.locking.failure", [message(code: 'tableDefinition.label', default: 'TableDefinition')] as Object[], "Another user has updated this TableDefinition while you were editing")
                    render(view: "edit", model: [tableDefinitionInstance: tableDefinitionInstance])
                    return
                }
            }
            tableDefinitionInstance.properties = params
            if (!tableDefinitionInstance.hasErrors() && tableDefinitionInstance.save(flush: true)) {
                flash.message = "${message(code: 'default.updated.message', args: [message(code: 'tableDefinition.label', default: 'TableDefinition'), tableDefinitionInstance.id])}"
                redirect(action: "show", id: tableDefinitionInstance.id)
            }
            else {
                render(view: "edit", model: [tableDefinitionInstance: tableDefinitionInstance])
            }
        }
        else {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'tableDefinition.label', default: 'TableDefinition'), params.id])}"
            redirect(action: "list")
        }
    }

    def delete = {
        def tableDefinitionInstance = TableDefinition.get(params.id)
        if (tableDefinitionInstance) {
            try {
                tableDefinitionInstance.delete(flush: true)
                flash.message = "${message(code: 'default.deleted.message', args: [message(code: 'tableDefinition.label', default: 'TableDefinition'), params.id])}"
                redirect(action: "list")
            }
            catch (org.springframework.dao.DataIntegrityViolationException e) {
                flash.message = "${message(code: 'default.not.deleted.message', args: [message(code: 'tableDefinition.label', default: 'TableDefinition'), params.id])}"
                redirect(action: "show", id: params.id)
            }
        }
        else {
            flash.message = "${message(code: 'default.not.found.message', args: [message(code: 'tableDefinition.label', default: 'TableDefinition'), params.id])}"
            redirect(action: "list")
        }
    }
}
