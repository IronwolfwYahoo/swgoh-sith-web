<%-- 
    Document   : viewGuildMember.jsp
    Created on : Sep 2, 2017, 1:48:30 PM
    Author     : jwoolf
--%>

<%@page import="java.net.URLEncoder"%>
<%@page import="swgoh.servlets.dataRetrieval"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
response.setHeader("CACHE-CONTROL", "NO-STORE");
response.setHeader("PRAGMA", "NO-CACHE");
response.setHeader("Expires", "Sat, 1 Jan 2000 08:00:00 GMT");
%>
<!DOCTYPE html>
<html>
    <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta property="og:url" content="http://sithhappens.net/swgoh/submitTBReport.jsp">
        <meta property="og:type" content="website">
        <meta property="og:title" content="Territory Battle Reports">
        <meta property="og:description" content="Territory Battle Report Submission form">
        <meta property="og:image" content="http://sithhappens.net/swgoh/images/probe_droid_preview.jpg">
        <meta property="og:image:width" content="527">
        <meta property="og:image:height" content="357">
        <script src="js/common.js"></script>
        <script src="js/submitTBReport.js"></script>
        <link rel="stylesheet" href="css/main.css">
        <script>
            window.addEventListener( "pageshow", function ( event ) {
                var historyTraversal = event.persisted || ( typeof window.performance != "undefined" && window.performance.navigation.type === 2 );
                if ( historyTraversal ) {
                    // Handle page restore.
                    window.location.reload();
                }
            });
<% if(request.getParameter("guild") != null){ %>
           var guild = '<%=request.getParameter("guild")%>';
<% } else {%>
           var guild;
<% } %>
<% if(request.getParameter("member") != null){ %>
           var member = '<%=request.getParameter("member")%>';
<% } else {%>
           var member;
<% } %>
        </script>
    </head>
    <body onLoad="populateFilters();">
        <div id="filters">
            <div>
                <div id="Period" style="display:inline-block">
                    <div>Territory Battle</div>
                    <%=dataRetrieval.getTBPeriodSelect("refreshReportTable")%>
                </div>
                <div id="Phase" style="display:inline-block">
                    <div>Phase</div>
                    <%=dataRetrieval.getPhaseSelect("refreshReportTable")%>
                </div>
            </div>
            <div>&nbsp;</div>
            <div>
                <div style="display:inline-block">
                    <div>Guild</div>
                    <select id="guildName-input" value="Guild Name" onchange="updateMemberList()"></select>
                </div>
                <div style="display:inline-block">
                    <div>Member</div>
                    <select id="MemberName-input" value="Player Name" onchange="reloadSubmitPage()"></select>
                </div>
            </div>
        </div>
        <div>&nbsp;</div>
        <div id="stats" style="display:inline-block">
        </div>
<% if(request.getParameter("member") != null && !request.getParameter("member").equals("None")){ %>
        <input type="button" name="Submit" value="Submit" onClick="submitReport();"/>
<% } %>
        <div id="Summary" style="display:none;">
        </div>
        <div id="users">
            <table id="memberTable" style="display: none">
                <tbody id="memberTableBody">
                    <%=dataRetrieval.getAllMembers()%>
                </tbody>
            </table>
        </div>
    </body>
</html>
