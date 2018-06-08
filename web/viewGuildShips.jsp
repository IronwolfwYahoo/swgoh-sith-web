<%-- 
    Document   : viewGuildShips.jsp
    Created on : Sep 2, 2017, 1:48:30 PM
    Author     : jwoolf
--%>

<%@page import="swgoh.servlets.dataRetrieval"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
    String guildName = request.getParameter("guild");
    if(guildName.equals("SithHappens2EU")){
        response.sendError(404, "No longer exists");
    }

%>
<!DOCTYPE html>
<html>
    <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script src="js/common.js"></script>
        <script src="js/viewGuildShips.js"></script>
        <link rel="stylesheet" href="css/main.css">
    </head>
    <body onLoad="populateFilters();">
        <div id="filters">
            <select id="MemberName-input" value="Player Name"></select>
            <select id="shipName-input" value="Ship Name"></select>
            <select id="crewMembers-input" value="Crew Members"></select>
            <div id="shipLevel-Section">
                Ship Level Filter:
                <select id="shipLevel-operator" value="-"></select>
                <select id="shipLevel-input" value="Ship Level"></select>
            </div>
            <div id="starLevel-Section">
                Star Level Filter:
                <select id="starLevel-operator" value="-"></select>
                <select id="starLevel-input" value="Star Level"></select>
            </div>
            <div id="alignment-Section">
                Alignment Filter:
                <select id="alignment-input" value="Alignment"></select>
            </div>
            <div id="Power-Section">
                Power Filter:
                <select id="Power-operator" value="-"></select>
                <input type="number" id="Power-input" value="Power" placeholder="Power"/>
            </div>
            <input type="button" name="Filter" value="Filter" onClick="parseFilterInfo('<%=guildName%>');"/>
            <input type="button" name="Display Char Count by Star Level" value="Display Char Count by Star Level" onClick="runMacroSearch('<%=guildName%>', '1');"/>
        </div>
        <div id="users">
            <table id="shipTable">
                <tbody id="shipTableBody">
                    <%=dataRetrieval.getDefaultShipTable(guildName)%>
                </tbody>
            </table>
        </div>
    </body>
</html>
