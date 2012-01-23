
<%@ page import="com.consultinglimited.crm.FormDefinition" %>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'formDefinition.label', default: 'FormDefinition')}" />
        <title><g:message code="default.list.label" args="[entityName]" /></title>
    </head>
    <body>
        <div class="nav">
            <span class="menuButton"><a class="home" href="${createLink(uri: '/')}"><g:message code="default.home.label"/></a></span>
            <span class="menuButton"><g:link class="create" action="create"><g:message code="default.new.label" args="[entityName]" /></g:link></span>
        </div>
        <div class="body">
            <h1><g:message code="default.list.label" args="[entityName]" /></h1>
            <g:if test="${flash.message}">
            <div class="message">${flash.message}</div>
            </g:if>
            <div class="list">
                <table>
                    <thead>
                        <tr>
                        
                            <g:sortableColumn property="id" title="${message(code: 'formDefinition.id.label', default: 'Id')}" />
                        
                            <g:sortableColumn property="createdDate" title="${message(code: 'formDefinition.createdDate.label', default: 'Created Date')}" />
                        
                            <g:sortableColumn property="modifiedDate" title="${message(code: 'formDefinition.modifiedDate.label', default: 'Modified Date')}" />
                        
                            <g:sortableColumn property="description" title="${message(code: 'formDefinition.description.label', default: 'Description')}" />
                        
                            <g:sortableColumn property="name" title="${message(code: 'formDefinition.name.label', default: 'Name')}" />
                        
                            <g:sortableColumn property="formData" title="${message(code: 'formDefinition.formData.label', default: 'Form Data')}" />
                        
                        </tr>
                    </thead>
                    <tbody>
                    <g:each in="${formDefinitionInstanceList}" status="i" var="formDefinitionInstance">
                        <tr class="${(i % 2) == 0 ? 'odd' : 'even'}">
                        
                            <td><g:link action="show" id="${formDefinitionInstance.id}">${fieldValue(bean: formDefinitionInstance, field: "id")}</g:link></td>
                        
                            <td><g:formatDate date="${formDefinitionInstance.createdDate}" /></td>
                        
                            <td><g:formatDate date="${formDefinitionInstance.modifiedDate}" /></td>
                        
                            <td>${fieldValue(bean: formDefinitionInstance, field: "description")}</td>
                        
                            <td>${fieldValue(bean: formDefinitionInstance, field: "name")}</td>
                        
                            <td>${fieldValue(bean: formDefinitionInstance, field: "formData")}</td>
                        
                        </tr>
                    </g:each>
                    </tbody>
                </table>
            </div>
            <div class="paginateButtons">
                <g:paginate total="${formDefinitionInstanceTotal}" />
            </div>
        </div>
    </body>
</html>
