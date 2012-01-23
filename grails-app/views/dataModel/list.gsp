
<%@ page import="com.consultinglimited.crm.DataModel" %>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'dataModel.label', default: 'DataModel')}" />
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
                        
                            <g:sortableColumn property="id" title="${message(code: 'dataModel.id.label', default: 'Id')}" />
                        
                            <g:sortableColumn property="createdDate" title="${message(code: 'dataModel.createdDate.label', default: 'Created Date')}" />
                        
                            <g:sortableColumn property="modifiedDate" title="${message(code: 'dataModel.modifiedDate.label', default: 'Modified Date')}" />
                        
                            <g:sortableColumn property="description" title="${message(code: 'dataModel.description.label', default: 'Description')}" />
                        
                            <g:sortableColumn property="name" title="${message(code: 'dataModel.name.label', default: 'Name')}" />
                        
                            <g:sortableColumn property="modelData" title="${message(code: 'dataModel.modelData.label', default: 'Model Data')}" />
                        
                        </tr>
                    </thead>
                    <tbody>
                    <g:each in="${dataModelInstanceList}" status="i" var="dataModelInstance">
                        <tr class="${(i % 2) == 0 ? 'odd' : 'even'}">
                        
                            <td><g:link action="show" id="${dataModelInstance.id}">${fieldValue(bean: dataModelInstance, field: "id")}</g:link></td>
                        
                            <td><g:formatDate date="${dataModelInstance.createdDate}" /></td>
                        
                            <td><g:formatDate date="${dataModelInstance.modifiedDate}" /></td>
                        
                            <td>${fieldValue(bean: dataModelInstance, field: "description")}</td>
                        
                            <td>${fieldValue(bean: dataModelInstance, field: "name")}</td>
                        
                            <td>${fieldValue(bean: dataModelInstance, field: "modelData")}</td>
                        
                        </tr>
                    </g:each>
                    </tbody>
                </table>
            </div>
            <div class="paginateButtons">
                <g:paginate total="${dataModelInstanceTotal}" />
            </div>
        </div>
    </body>
</html>
