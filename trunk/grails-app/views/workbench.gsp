<%@ page language="java" import="javax.servlet.http.Cookie"%>
<%
Cookie cookie = new Cookie ("lastAccessed", "workbench");
cookie.setMaxAge(365 * 24 * 60 * 60);
response.addCookie(cookie);
%>
<html>
    <head>
        <title><g:message code="main.title" default="Designer"/></title>
        <meta name="layout" content="smartclient" />
    </head>
    <body>
        <script language="Javascript" type="text/javascript">
            var securityInfo = {
                user: '<sec:username />' <sec:ifAllGranted roles="ROLE_ADMIN">,isAdmin: true</sec:ifAllGranted>
            }
            var sep = "<%=com.consultinglimited.crm.GeneratorController.separator %>";
            var contextPath = "<%=request.getContextPath() %>";
        </script>
        <script language="Javascript" type="text/javascript" src="js/globals.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="js/string.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="js/util/screenSize.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="js/components/zenbox.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript">
            zenbox.createBox(true, securityInfo.user);
        </script>
        <script language="Javascript" type="text/javascript" src="js/session/keepAlive.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="js/components/DeleteButton.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="js/components/TableButton.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="js/components/OpenButton.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="js/components/LogoutButton.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="js/components/layoutComponents.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="js/components/tableComponents.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="js/components/titleLayout.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="js/tableUtil.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="js/dateUtil.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="js/windowUtil.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="<%=request.getContextPath() %>/js/components/BaseRestDataSource.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="<%=request.getContextPath() %>/js/components/ReferenceDSFactory.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="<%=request.getContextPath() %>/js/generator/genericFormGenerator.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="<%=request.getContextPath() %>/js/generator/formGenerator.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="<%=request.getContextPath() %>/js/components/DsOperatorBase.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="<%=request.getContextPath() %>/js/list/genericFormattedTableGenerator.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="<%=request.getContextPath() %>/js/list/deleteButtonBar.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="<%=request.getContextPath() %>/js/appviewer/appMainToolStrip.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="<%=request.getContextPath() %>/js/appviewer/appMain.js">
        <!-- -->
        </script>
        
    </body>
</html>
