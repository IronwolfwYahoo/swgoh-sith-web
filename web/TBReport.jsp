<%-- 
    Document   : TBReport.jsp
    Created on : Sep 2, 2017, 1:48:30 PM
    Author     : jwoolf
--%>

<%@page import="swgoh.servlets.dataRetrieval"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<!DOCTYPE html>
<html>
    <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <script src="js/common.js"></script>
        <script src="js/TBReport.js"></script>
        <link rel="stylesheet" href="css/main.css">
        <script>
<% if(request.getParameter("guild") != null){ %>
           var guild = '<%=request.getParameter("guild")%>';
<% } else {%>
           var guild;
<% } %>
        </script>
    </head>
    <body onLoad="populateFilters();">
        <div id="filters">
            <div>
                <div id="Period" style="display:inline-block">
                    <div>Territory Battle</div>
                    <%=dataRetrieval.getTBPeriodSelect("retrieveTBData")%>
                </div>
                <div id="Phase" style="display:inline-block">
                    <div>Phase</div>
                    <%=dataRetrieval.getPhaseSelect("retrieveTBData")%>
                </div>
                <div id="GuildName" style="display:inline-block">
                    <div>Guild</div>
                    <select id="guildName-input" value="Guild Name" onchange="retrieveTBData()"></select>
                </div>
                <div id="RefreshDiv" style="display:inline-block">
                    <div>&nbsp;</div>
                    <input id="refresh-btn" type="button" value="Refresh" onclick="retrieveTBData()"/>
                </div>
                <!--
                <div id="MemberName" style="display:inline-block">
                    <div>Member</div>
                    <select id="MemberName-input" value="Player Name" onchange="refreshReportTable()"></select>
                </div>
                -->
            </div>
            <div>&nbsp;</div>
            <div>Show Members that Have Completed: </div>
            <div id="positiveFilters">
            </div>
            <div>&nbsp;</div>
            <div>Show Members that have not Completed: </div>
            <div id="negativeFilters">
            </div>
        </div>
        <div>&nbsp;</div>
        <div id="report">
            <table id="reportTable">
                <tbody id="reportTableBody">
                </tbody>
            </table>
        </div>
        <div>&nbsp;</div>
        <div id="Summary" style="display:none;">
        </div>
        <div id="TBData">
            <table id="TBDataTable" style="display: none">
                <tbody id="TBDataTableBody">
                </tbody>
            </table>
        </div>
    </body>
</html>
