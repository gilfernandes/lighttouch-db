

<%@ page import="com.consultinglimited.crm.DataModel" %>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'dataModel.label', default: 'DataModel')}" />
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
            <g:hasErrors bean="${dataModelInstance}">
            <div class="errors">
                <g:renderErrors bean="${dataModelInstance}" as="list" />
            </div>
            </g:hasErrors>
            <g:form action="save" >
                <div class="dialog">
                    <table>
                        <tbody>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="createdDate"><g:message code="dataModel.createdDate.label" default="Created Date" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: dataModelInstance, field: 'createdDate', 'errors')}">
                                    <g:datePicker name="createdDate" precision="day" value="${dataModelInstance?.createdDate}"  />
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="modifiedDate"><g:message code="dataModel.modifiedDate.label" default="Modified Date" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: dataModelInstance, field: 'modifiedDate', 'errors')}">
                                    <g:datePicker name="modifiedDate" precision="day" value="${dataModelInstance?.modifiedDate}" default="none" noSelection="['': '']" />
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="description"><g:message code="dataModel.description.label" default="Description" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: dataModelInstance, field: 'description', 'errors')}">
                                    <g:textField name="description" value="${dataModelInstance?.description}" />
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="name"><g:message code="dataModel.name.label" default="Name" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: dataModelInstance, field: 'name', 'errors')}">
                                    <g:textField name="name" value="${dataModelInstance?.name}" />
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="modelData"><g:message code="dataModel.modelData.label" default="Model Data" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: dataModelInstance, field: 'modelData', 'errors')}">
                                    <g:textField name="modelData" value="${dataModelInstance?.modelData}" />
                                </td>
                            </tr>
                        
                            <tr class="prop">
                                <td valign="top" class="name">
                                    <label for="generatedGrailsClass"><g:message code="dataModel.generatedGrailsClass.label" default="Generated Grails Class" /></label>
                                </td>
                                <td valign="top" class="value ${hasErrors(bean: dataModelInstance, field: 'generatedGrailsClass', 'errors')}">
                                    <g:textField name="generatedGrailsClass" value="${dataModelInstance?.generatedGrailsClass}" />
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
