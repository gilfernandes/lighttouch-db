<html>
    <head>
        <title><g:message code="main.title" default="Formatted List"/></title>
        <meta name="layout" content="smartclient" />
    </head>
    <body>
        <script language="Javascript" type="text/javascript" src="<%=request.getContextPath() %>/js/globals.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="<%=request.getContextPath() %>/js/components/BaseRestDataSource.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="<%=request.getContextPath() %>/js/components/SaveButton.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="<%=request.getContextPath() %>/js/components/RefreshButton.js">
        <!-- -->
        </script>
        <script language="Javascript">
            var paramId = ${params.id};
            var sep = "<%=com.consultinglimited.crm.GeneratorController.separator %>";
            /**
             * The data model identifier parameter
             */
            var dataModelIdParam = "dataModelId";
            var contextPath = "<%=request.getContextPath() %>";
        </script>
        <script language="Javascript" type="text/javascript" src="<%=request.getContextPath() %>/js/components/ReferenceDSFactory.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="<%=request.getContextPath() %>/js/components/DsOperatorBase.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="<%=request.getContextPath() %>/js/string.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="<%=request.getContextPath() %>/js/tableUtil.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="<%=request.getContextPath() %>/js/components/DeleteButton.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="<%=request.getContextPath() %>/js/list/genericFormattedTableGenerator.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="<%=request.getContextPath() %>/js/list/showFormattedTable.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="<%=request.getContextPath() %>/js/list/tableCommon.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="<%=request.getContextPath() %>/js/list/buttonBar.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="<%=request.getContextPath() %>/js/list/tableLayout.js">
        <!-- -->
        </script>
        <script language="Javascript" type="text/javascript" src="<%=request.getContextPath() %>/js/genericPageLayout.js">
        <!-- -->
        </script>
    </body>
</html>
