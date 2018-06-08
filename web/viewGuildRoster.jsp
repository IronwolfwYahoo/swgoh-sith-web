<%-- 
    Document   : viewGuildRoster.jsp
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
        <script src="js/viewGuildRoster.js"></script>
        <link rel="stylesheet" href="css/main.css">
    </head>
    <body onLoad="populateFilters();">
        <div id="filters">
            <select id="MemberName-input" value="Player Name"></select>
            <select id="charName-input" value="Character Name"></select>
            <div id="charLevel-Section">
                Char Level Filter:
                <select id="charLevel-operator" value="-"></select>
                <select id="charLevel-input" value="Character Level"></select>
            </div>
            <div id="starLevel-Section">
                Star Level Filter:
                <select id="starLevel-operator" value="-"></select>
                <select id="starLevel-input" value="Star Level"></select>
            </div>
            <div id="gearLevel-Section">
                Gear Level Filter:
                <select id="gearLevel-operator" value="-"></select>
                <select id="gearLevel-input" value="Gear Level"></select>
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
            <table id="rosterTable">
                <tbody id="rosterTableBody">
                    <%=dataRetrieval.getDefaultRosterTable(guildName)%>
                </tbody>
            </table>
        </div>
    </body>
</html>
