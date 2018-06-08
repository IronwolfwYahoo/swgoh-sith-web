<%-- 
    Document   : viewGuildMember.jsp
    Created on : Sep 2, 2017, 1:48:30 PM
    Author     : jwoolf
--%>

<%@page import="swgoh.servlets.dataRetrieval"%>
<%@page contentType="text/html" pageEncoding="UTF-8"%>
<%
    String guildName = request.getParameter("guild");
%>
<!DOCTYPE html>
<html>
    <head>
        <title></title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <script src="js/common.js"></script>
        <script src="js/viewGuildMember.js"></script>
        <link rel="stylesheet" href="css/main.css">
    </head>
    <body onLoad="populateFilters();">
        <div id="filters">
            <select id="MemberName-input" value="Player Name"></select>
            <select id="guildName-input" value="Guild Name"></select>
            <input type="button" name="Filter" value="Filter" onClick="parseFilterInfo('<%=guildName%>');"/>
            <input type="button" id="P1_P2" name="Show P1/P2" value="Show P1/P2" onClick="viewToggle('P1_P2');"/>
            <input type="button" id="P3_P4" name="Show P3/P4" value="Show P3/P4" onClick="viewToggle('P3_P4');"/>
            <input type="button" id="P5_P6" name="Show P5/P6" value="Show P5/P6" onClick="viewToggle('P5_P6');"/>
        </div>
        <div id="users">
            <table id="memberTable">
                <tbody id="memberTableBody">
                    <%=dataRetrieval.getDefaultMemberTable()%>
                </tbody>
            </table>
        </div>
    </body>
</html>
