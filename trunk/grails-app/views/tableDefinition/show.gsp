
<%@ page import="com.consultinglimited.crm.TableDefinition" %>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'tableDefinition.label', default: 'TableDefinition')}" />
        <title><g:message code="default.show.label" args="[entityName]" /></title>
    </head>
    <body>
        <div class="nav">
            <span class="menuButton"><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></span>
            <span class="menuButton"><g:link class="list" action="list"><g:message code="default.list.label" args="[entityName]" /></g:link></span>
            <span class="menuButton"><g:link class="create" action="create"><g:message code="default.new.label" args="[entityName]" /></g:link></span>
        </div>
        <div class="body">
            <h1><g:message code="default.show.label" args="[entityName]" /></h1>
            <g:if test="${flash.message}">
            <div class="message">${flash.message}</div>
            </g:if>
            <div class="dialog">
                <table>
                    <tbody>
                    
                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="tableDefinition.id.label" default="Id" /></td>
                            
                            <td valign="top" class="value">${fieldValue(bean: tableDefinitionInstance, field: "id")}</td>
                            
                        </tr>
                    
                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="tableDefinition.createdDate.label" default="Created Date" /></td>
                            
                            <td valign="top" class="value"><g:formatDate date="${tableDefinitionInstance?.createdDate}" /></td>
                            
                        </tr>
                    
                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="tableDefinition.modifiedDate.label" default="Modified Date" /></td>
                            
                            <td valign="top" class="value"><g:formatDate date="${tableDefinitionInstance?.modifiedDate}" /></td>
                            
                        </tr>
                    
                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="tableDefinition.description.label" default="Description" /></td>
                            
                            <td valign="top" class="value">${fieldValue(bean: tableDefinitionInstance, field: "description")}</td>
                            
                        </tr>
                    
                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="tableDefinition.name.label" default="Name" /></td>
                            
                            <td valign="top" class="value">${fieldValue(bean: tableDefinitionInstance, field: "name")}</td>
                            
                        </tr>
                    
                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="tableDefinition.tableData.label" default="Table Data" /></td>
                            
                            <td valign="top" class="value">${fieldValue(bean: tableDefinitionInstance, field: "tableData")}</td>
                            
                        </tr>
                    
                        <tr class="prop">
                            <td valign="top" class="name"><g:message code="tableDefinition.dataModel.label" default="Data Model" /></td>
                            
                            <td valign="top" class="value"><g:link controller="dataModel" action="show" id="${tableDefinitionInstance?.dataModel?.id}">${tableDefinitionInstance?.dataModel?.encodeAsHTML()}</g:link></td>
                            
                        </tr>
                    
                    </tbody>
                </table>
            </div>
            <div class="buttons">
                <g:form>
                    <g:hiddenField name="id" value="${tableDefinitionInstance?.id}" />
                    <span class="button"><g:actionSubmit class="edit" action="edit" value="${message(code: 'default.button.edit.label', default: 'Edit')}" /></span>
                    <span class="button"><g:actionSubmit class="delete" action="delete" value="${message(code: 'default.button.delete.label', default: 'Delete')}" onclick="return confirm('${message(code: 'default.button.delete.confirm.message', default: 'Are you sure?')}');" /></span>
                </g:form>
            </div>
        </div>
    </body>
</html>
