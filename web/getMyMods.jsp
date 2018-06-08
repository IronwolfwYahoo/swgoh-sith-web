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
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:fb="http://ogp.me/ns/fb#">
    <head>
        <title>Sith Happened Mod SpreadSheet Creator</title>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta property="og:url" content="http://sithhappens.net/swgoh/getMyMods.jsp">
        <meta property="og:type" content="website">
        <meta property="og:title" content="Sith Happened - Mod SpreadSheet Creator">
        <meta property="og:description" content="Sith Happened - Mod SpreadSheet Creator">
        <meta property="og:image" content="http://sithhappens.net/swgoh/images/Image_BoD.jpg">
        <link rel="stylesheet" href="css/main.css">
        <link rel="stylesheet" href="css/animations.css">
        <script src="js/common.js"></script>
        <script src="js/getMyMods.js"></script>
        <style>
        th {
          text-align: center;
        }
        </style>
    </head>
    <body id="getMyModsBody" class="guildPage" onLoad="initPage();">
        <div class="section">
            <img class="sectionContent" src="images/SH_Leaderboard_SHd.jpg"/>
            <div class="sectionContent">
                <a href="/swgoh/viewGuildRoster.jsp?guild=SithHappened"><img src='images/Red/SH_buttons_red-03.png' style="width: 86px"/></a>
                <a href="/swgoh/viewGuildShips.jsp?guild=SithHappened"><img src='images/Red/SH_buttons_red-02.png' style="width: 86px"/></a>
                <a href="http://swgoh.gg/g/9274/sithhappened/unit-search/"><img src='images/Red/SH_buttons_red-01.png' style="width: 86px"/></a>
            </div>
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
