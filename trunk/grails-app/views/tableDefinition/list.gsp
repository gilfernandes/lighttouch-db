
<%@ page import="com.consultinglimited.crm.TableDefinition" %>
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
        <meta name="layout" content="main" />
        <g:set var="entityName" value="${message(code: 'tableDefinition.label', default: 'TableDefinition')}" />
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
                        
                            <g:sortableColumn property="id" title="${message(code: 'tableDefinition.id.label', default: 'Id')}" />
                        
                            <g:sortableColumn property="createdDate" title="${message(code: 'tableDefinition.createdDate.label', default: 'Created Date')}" />
                        
                            <g:sortableColumn property="modifiedDate" title="${message(code: 'tableDefinition.modifiedDate.label', default: 'Modified Date')}" />
                        
                            <g:sortableColumn property="description" title="${message(code: 'tableDefinition.description.label', default: 'Description')}" />
                        
                            <g:sortableColumn property="name" title="${message(code: 'tableDefinition.name.label', default: 'Name')}" />
                        
                            <g:sortableColumn property="tableData" title="${message(code: 'tableDefinition.tableData.label', default: 'Table Data')}" />
                        
                        </tr>
                    </thead>
                    <tbody>
                    <g:each in="${tableDefinitionInstanceList}" status="i" var="tableDefinitionInstance">
                        <tr class="${(i % 2) == 0 ? 'odd' : 'even'}">
                        
                            <td><g:link action="show" id="${tableDefinitionInstance.id}">${fieldValue(bean: tableDefinitionInstance, field: "id")}</g:link></td>
                        
                            <td><g:formatDate date="${tableDefinitionInstance.createdDate}" /></td>
                        
                            <td><g:formatDate date="${tableDefinitionInstance.modifiedDate}" /></td>
                        
                            <td>${fieldValue(bean: tableDefinitionInstance, field: "description")}</td>
                        
                            <td>${fieldValue(bean: tableDefinitionInstance, field: "name")}</td>
                        
                            <td>${fieldValue(bean: tableDefinitionInstance, field: "tableData")}</td>
                        
                        </tr>
                    </g:each>
                    </tbody>
                </table>
            </div>
            <div class="paginateButtons">
                <g:paginate total="${tableDefinitionInstanceTotal}" />
            </div>
        </div>
    </body>
</html>
