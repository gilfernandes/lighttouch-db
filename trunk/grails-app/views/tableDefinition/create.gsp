

<%@ page import="com.consultinglimited.crm.TableDefinition" %>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'tableDefinition.label', default: 'TableDefinition')}" />
        <title><g:message code="default.create.label" args="[entityName]" /></title>
    </head>
    <body>
        <div class="nav">
            <span class="menuButton"><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></span>
            <span class="menuButton"><g:link class="list" action="list"><g:message code="default.list.label" args="[entityName]" /></g:link></span>
        </div>
        <div class="body">
            <h1><g:message code="default.create.label" args="[entityName]" /></h1>
            <g:if test="${flash.message}">
            <div class="message">${flash.message}</div>
            </g:if>
            <g:hasErrors bean="${tableDefinitionInstance}">
            <div class="errors">
                <g:renderErrors bean="${tableDefinitionInstance}" as="list" />
            </div>
            </g:hasErrors>
            <g:form action="save" >
                <div class="dialog">
                    <table>
                        <tbody>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="createdDate"><g:message code="tableDefinition.createdDate.label" default="Created Date" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: tableDefinitionInstance, field: 'createdDate', 'errors')}">
                                    <g:datePicker name="createdDate" precision="day" value="${tableDefinitionInstance?.createdDate}"  />
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="modifiedDate"><g:message code="tableDefinition.modifiedDate.label" default="Modified Date" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: tableDefinitionInstance, field: 'modifiedDate', 'errors')}">
                                    <g:datePicker name="modifiedDate" precision="day" value="${tableDefinitionInstance?.modifiedDate}" default="none" noSelection="['': '']" />
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="description"><g:message code="tableDefinition.description.label" default="Description" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: tableDefinitionInstance, field: 'description', 'errors')}">
                                    <g:textField name="description" value="${tableDefinitionInstance?.description}" />
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="name"><g:message code="tableDefinition.name.label" default="Name" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: tableDefinitionInstance, field: 'name', 'errors')}">
                                    <g:textField name="name" value="${tableDefinitionInstance?.name}" />
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="tableData"><g:message code="tableDefinition.tableData.label" default="Table Data" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: tableDefinitionInstance, field: 'tableData', 'errors')}">
                                    <g:textField name="tableData" value="${tableDefinitionInstance?.tableData}" />
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="dataModel"><g:message code="tableDefinition.dataModel.label" default="Data Model" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: tableDefinitionInstance, field: 'dataModel', 'errors')}">
                                    <g:select name="dataModel.id" from="${com.consultinglimited.crm.DataModel.list()}" optionKey="id" value="${tableDefinitionInstance?.dataModel?.id}"  />
                                </td>
                            </tr>
                        
                        </tbody>
                    </table>
                </div>
                <div class="buttons">
                    <span class="button"><g:submitButton name="create" class="save" value="${message(code: 'default.button.create.label', default: 'Create')}" /></span>
                </div>
            </g:form>
        </div>
    </body>
</html>
