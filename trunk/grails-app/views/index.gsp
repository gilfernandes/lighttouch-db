<%@ page language="java" import="javax.servlet.http.Cookie"%>
<%
// This piece of code redirects the user to the last access page.
String cookieName = "lastAccessed";
Cookie[] cookies = request.getCookies();
Cookie lastAccessCookie = null;
if (cookies != null)
{
    for (int i = 0; i < cookies.length; i++) 
    {
        if (cookieName.equals(cookies [i].getName()))
        {
            lastAccessCookie = cookies[i];
            break;
        }
    }
    if(lastAccessCookie != null) {
        String value = lastAccessCookie.getValue();
        if(value != null) {
            response.sendRedirect(value + ".gsp");
        }
    }
}

%>
<html>
    <head>
        <title><g:message code="main.title" default="Designer"/></title>
        <meta name="layout" content="smartclient" />
        <script language="Javascript" type="text/javascript">
            var securityInfo = {
                user: '<sec:username />'
                <sec:ifAllGranted roles="ROLE_ADMIN">,isAdmin: true</sec:ifAllGranted>
                <sec:ifAllGranted roles="ROLE_USER">,isUser: true</sec:ifAllGranted>
            }
        </script>
    </head>
    <body>
        <script type="text/javascript">
isc.Label.create({
    ID: "designerLink",
    width:240, padding:10,
    contents: "<a href='designer.gsp'>Designer</a>", 
    styleName: "mainLabelStyle",
    canDragReposition:true,
    showShadow: true,
    shadowSoftness: 10,
    shadowOffset: 5
});

isc.Label.create({
    ID: "workbenchLink",
    width:240, padding:10,
    contents: "<a href='workbench.gsp'>Workbench</a>", 
    styleName: "mainLabelStyle",
    canDragReposition:true,
    showShadow: true,
    shadowSoftness: 10,
    shadowOffset: 5
});

isc.HLayout.create({
    ID:"mainLayout",
    width: "100%",
    height: 150,
    styleName: "pageLayout",
    members: [isc.Canvas.create({width: "*"}), designerLink, isc.Canvas.create({width: 20}), workbenchLink, isc.Canvas.create({width: "*"})]
});

isc.VLayout.create({
    ID:"pageLayout",
    width: "100%",
    height: "100%",
    align: "center",
    layoutLeftMargin: 0,
    layoutRightMargin:  0,
    membersMargin: 2,
    members: [mainLayout]
});
        </script>
    </body>
</html>
