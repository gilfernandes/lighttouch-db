

<%@ page import="com.consultinglimited.crm.FormDefinition" %>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'formDefinition.label', default: 'FormDefinition')}" />
        <title><g:message code="default.edit.label" args="[entityName]" /></title>
    </head>
    <body>
        <div class="nav">
            <span class="menuButton"><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></span>
            <span class="menuButton"><g:link class="list" action="list"><g:message code="default.list.label" args="[entityName]" /></g:link></span>
            <span class="menuButton"><g:link class="create" action="create"><g:message code="default.new.label" args="[entityName]" /></g:link></span>
        </div>
        <div class="body">
            <h1><g:message code="default.edit.label" args="[entityName]" /></h1>
            <g:if test="${flash.message}">
            <div class="message">${flash.message}</div>
            </g:if>
            <g:hasErrors bean="${formDefinitionInstance}">
            <div class="errors">
                <g:renderErrors bean="${formDefinitionInstance}" as="list" />
            </div>
            </g:hasErrors>
            <g:form method="post" >
                <g:hiddenField name="id" value="${formDefinitionInstance?.id}" />
                <g:hiddenField name="version" value="${formDefinitionInstance?.version}" />
                <div class="dialog">
                    <table>
                        <tbody>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                  <label for="createdDate"><g:message code="formDefinition.createdDate.label" default="Created Date" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: formDefinitionInstance, field: 'createdDate', 'errors')}">
                                    <g:datePicker name="createdDate" precision="day" value="${formDefinitionInstance?.createdDate}"  />
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                  <label for="modifiedDate"><g:message code="formDefinition.modifiedDate.label" default="Modified Date" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: formDefinitionInstance, field: 'modifiedDate', 'errors')}">
                                    <g:datePicker name="modifiedDate" precision="day" value="${formDefinitionInstance?.modifiedDate}" default="none" noSelection="['': '']" />
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                  <label for="description"><g:message code="formDefinition.description.label" default="Description" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: formDefinitionInstance, field: 'description', 'errors')}">
                                    <g:textField name="description" value="${formDefinitionInstance?.description}" />
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                  <label for="name"><g:message code="formDefinition.name.label" default="Name" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: formDefinitionInstance, field: 'name', 'errors')}">
                                    <g:textField name="name" value="${formDefinitionInstance?.name}" />
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                  <label for="formData"><g:message code="formDefinition.formData.label" default="Form Data" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: formDefinitionInstance, field: 'formData', 'errors')}">
                                    <g:textField name="formData" value="${formDefinitionInstance?.formData}" />
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                  <label for="dataModel"><g:message code="formDefinition.dataModel.label" default="Data Model" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: formDefinitionInstance, field: 'dataModel', 'errors')}">
                                    <g:select name="dataModel.id" from="${com.consultinglimited.crm.DataModel.list()}" optionKey="id" value="${formDefinitionInstance?.dataModel?.id}"  />
                                </td>
                            </tr>
                        
                        </tbody>
                    </table>
                </div>
                <div class="buttons">
                    <span class="button"><g:actionSubmit class="save" action="update" value="${message(code: 'default.button.update.label', default: 'Update')}" /></span>
                    <span class="button"><g:actionSubmit class="delete" action="delete" value="${message(code: 'default.button.delete.label', default: 'Delete')}" onclick="return confirm('${message(code: 'default.button.delete.confirm.message', default: 'Are you sure?')}');" /></span>
                </div>
            </g:form>
        </div>
    </body>
</html>
