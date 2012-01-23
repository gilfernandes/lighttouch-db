
<%@ page import="com.consultinglimited.crm.Module" %>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'module.label', default: 'Module')}" />
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
                        
                            <g:sortableColumn property="id" title="${message(code: 'module.id.label', default: 'Id')}" />
                        
                            <g:sortableColumn property="createdDate" title="${message(code: 'module.createdDate.label', default: 'Created Date')}" />
                        
                            <g:sortableColumn property="modifiedDate" title="${message(code: 'module.modifiedDate.label', default: 'Modified Date')}" />
                        
                            <g:sortableColumn property="description" title="${message(code: 'module.description.label', default: 'Description')}" />
                        
                            <g:sortableColumn property="name" title="${message(code: 'module.name.label', default: 'Name')}" />
                        
                            <g:sortableColumn property="moduleData" title="${message(code: 'module.moduleData.label', default: 'Module Data')}" />
                        
                        </tr>
                    </thead>
                    <tbody>
                    <g:each in="${moduleInstanceList}" status="i" var="moduleInstance">
                        <tr class="${(i % 2) == 0 ? 'odd' : 'even'}">
                        
                            <td><g:link action="show" id="${moduleInstance.id}">${fieldValue(bean: moduleInstance, field: "id")}</g:link></td>
                        
                            <td><g:formatDate date="${moduleInstance.createdDate}" /></td>
                        
                            <td><g:formatDate date="${moduleInstance.modifiedDate}" /></td>
                        
                            <td>${fieldValue(bean: moduleInstance, field: "description")}</td>
                        
                            <td>${fieldValue(bean: moduleInstance, field: "name")}</td>
                        
                            <td>${fieldValue(bean: moduleInstance, field: "moduleData")}</td>
                        
                        </tr>
                    </g:each>
                    </tbody>
                </table>
            </div>
            <div class="paginateButtons">
                <g:paginate total="${moduleInstanceTotal}" />
            </div>
        </div>
    </body>
</html>
