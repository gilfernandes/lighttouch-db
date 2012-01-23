<html>
    <head>
        <title><g:message code="main.title" default="Form Generator"/></title>
        <meta name="layout" content="smartclient" />
    </head>
    <body>
        <script language="Javascript">
            var paramId = ${params.id};
            var sep = "<%=com.consultinglimited.crm.GeneratorController.separator %>";
            var contextPath = "<%=request.getContextPath() %>";
        </script>
        <script language="Javascript" type="text/javascript" src="<%=request.getContextPath() %>/js/globals.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="<%=request.getContextPath() %>/js/components/BaseRestDataSource.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="<%=request.getContextPath() %>/js/components/ReferenceDSFactory.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="<%=request.getContextPath() %>/js/string.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="<%=request.getContextPath() %>/js/generator/genericFormGenerator.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="<%=request.getContextPath() %>/js/windowUtil.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="<%=request.getContextPath() %>/js/generator/formGenerator.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="<%=request.getContextPath() %>/js/genericPageLayout.js">
        <!-- -->
        </script>
    </body>
</html>
