<!DOCTYPE html>
<html>
    <head>
        <title><g:layoutTitle default="Formcreator" /></title>
        <link rel="stylesheet" href="${resource(dir:'css',file:'smartclient_main.css')}" />
        <link rel="shortcut icon" href="${resource(dir:'images',file:'favicon.ico')}" type="image/x-icon" />
        <g:layoutHead />
        <g:javascript library="application" />
        <g:set var="isomorphic" value="${request.contextPath}/smartclient8/js/isomorphic/" />
        <g:set var="modulePath" value="${isomorphic}/system/modules" />
        <g:set var="skin" value="${isomorphic}/skins/Enterprise" />
        <script>var isomorphicDir = "${isomorphic}"</script>
        <script src="${modulePath}/ISC_Core.js"><!-- Core --></script>
        <script src="${modulePath}/ISC_Foundation.js"><!-- Core --></script>
        <script src="${modulePath}/ISC_Containers.js"><!-- Core --></script>
        <script src="${modulePath}/ISC_Grids.js"><!-- Core --></script>
        <script src="${modulePath}/ISC_Forms.js"><!-- Core --></script>
        <script src="${modulePath}/ISC_DataBinding.js"><!-- Core --></script>
        <script src="${skin}/load_skin.js"><!-- Core --></script>

        <!-- All Javascript localized variables go here. -->
        <script type="text/javascript">
            var mainTitle = "<g:message code="mainTitle"/>";
            var importJson = "<g:message code="menu.importJson"/>";
            var showJson = "<g:message code="menu.showJson"/>";
            var msgCancel = "<g:message code="general.cancel"/>";
            var msgDbInfo = "<g:message code="menu.dbInfo"/>";
            var msgDbInfoDesc = "<g:message code="advancedMenu.displayDbInfoDesc"/>";
            var msgFile = "<g:message code="general.file"/>";
            var msgManager = "<g:message code="general.manager"/>";
            var msgNew = "<g:message code="general.new"/>";
            var msgOpen = "<g:message code="general.open"/>";
            var msgRefresh = "<g:message code="general.refresh"/>";
            var msgSave = "<g:message code="general.save"/>";
            var msgSaveAs = "<g:message code="general.saveAs"/>";
            var msgSelectRecord = "<g:message code="general.selectRecord"/>";
        </script>
        <!-- End localized variables -->
        <script type="text/javascript">
        if (window.isc != null) {
            if (isc.version.startsWith("SC_SNAPSHOT-2011-01-05/")) {
                if (isc.HTMLFlow != null) {
                    isc.HTMLFlow.addProperties({modifyContent:function () {}});
                }
            } else {
                isc.Log.logWarn("Patch for SmartClient 8.0 final release (reported version 'SC_SNAPSHOT-2011-01-05/') " +
                    "included in this application. " + 
                    "You are currently running SmartClient verion '"+ isc.version + 
                    "'. This patch is not compatible with this build and will have no effect. " +
                    "It should be removed from your application source.");
            }
        }
    </script>
    </head>
    <body>
        <g:layoutBody />
    </body>
</html>
