<html>
    <head>
        <title><g:message code="main.title" default="Generic List"/></title>
        <meta name="layout" content="smartclient" />
    </head>
    <body>
        <script language="Javascript">
            var paramId = ${params.id};
            var sep = "<%=com.consultinglimited.crm.GeneratorController.separator %>";
            var CREATE_DATE_FIELD = "<%=com.consultinglimited.crm.service.GenericDataService.CREATE_DATE_FIELD %>"
            var UPDATE_DATE_FIELD = "<%=com.consultinglimited.crm.service.GenericDataService.UPDATE_DATE_FIELD %>"
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
        <script language="Javascript" type="text/javascript" src="<%=request.getContextPath() %>/js/components/SaveButton.js">
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
        <script language="Javascript" type="text/javascript" src="<%=request.getContextPath() %>/js/list/showRawList.js">
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
