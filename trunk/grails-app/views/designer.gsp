<%@ page language="java" import="javax.servlet.http.Cookie"%>
<%@ page language="java" import="com.consultinglimited.crm.CookieConstants"%>
<%
Cookie cookie = new Cookie (CookieConstants.LAST_ACCESSED_PAGE, "designer");
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
        </script>
        <script language="Javascript" type="text/javascript" src="js/globals.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="js/string.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="js/util/cookie.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="js/util/screenSize.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="js/components/zenbox.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript">
            zenbox.createBox(false, securityInfo.user);
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
        <script language="Javascript" type="text/javascript" src="js/openDefinitionDs.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="js/ds.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="js/components/FormTileGrid.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="js/dataModelViewLoader.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="js/formComposerList.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="js/jsonGenerator.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="js/jsonlint/jsonlint.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="js/components/StripLabel.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="js/module/openModuleDs.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="js/module/moduleDesignerToolStrip.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="js/formToolStrip.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="js/propertiesViewLoader.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="js/tableViewLoader.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="js/module/moduleDesigner.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="js/designerMain.js">
        <!-- -->
        </script>
    </body>
</html>
