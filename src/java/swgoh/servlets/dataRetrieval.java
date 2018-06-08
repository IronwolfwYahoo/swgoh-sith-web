/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package swgoh.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import swgoh.objects.assetByStarEntry;
import swgoh.objects.comparators.MemberNameComparatorAscending;
import swgoh.objects.constants.TBDataPoints;
import swgoh.objects.defs.TBInstance;
import swgoh.objects.memberEntry;
import swgoh.objects.rosterEntry;
import swgoh.objects.shipEntry;
import swgoh.utility.DBUtilities;
import swgoh.utility.TBTimeUtilities;

/**
 *
 * @author jwoolf
 */
public class dataRetrieval extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        
        String guild = request.getParameter("guild");
        String queryParams = request.getParameter("queryString");
        String caller = request.getParameter("caller");
        String sort = request.getParameter("sort");
        String macro = request.getParameter("macro");

        String resp = "[]";
        try {
            if(macro == null){
                resp = standardQuery(guild, caller, queryParams, sort);
            } else {
                // If we have more than the 1 macro make the decision about which to use here
                resp = queryAssetCountByStarLevel(guild, caller, queryParams, sort);
            }
        } catch (Exception e){
            resp = "[]";
            e.printStackTrace(System.out);
        } finally {
            out.println(resp);
            out.close();
        }
    }

    private String standardQuery(String guild, String caller, String queryParams, String sortID){
        String resp = "[";
        try {
            if(caller.equals("rosterTable")){
                resp = buildRosterTableString(resp, guild, queryParams);
            } else if(caller.equals("submitTBReport")){
                resp = submitTBReport(resp, guild, queryParams);
            } else if(caller.equals("DeploymentSummary")){
                resp = deploymentSummary(resp, guild, queryParams);
            } else if(caller.equals("TBReport")){
                resp = tbReport(resp, queryParams);
            } else if(caller.equals("shipTable")){
                resp = buildShipTableString(resp, guild, queryParams);
            } else if(caller.equals("memberTable")){
                resp = buildMemberTableString(resp, guild, queryParams);
            } else if(caller.equals("manageTBs")){
                resp = manageTBs(resp);
            }
            resp += "]";
        } catch (Exception e){
            resp = "[]";
        }
        return resp;
    }
    
    private String queryAssetCountByStarLevel(String guild, String caller, String queryParams, String sortID){
        String resp;
        if(caller.toLowerCase().startsWith("roster")){
            resp = "[[\"Character Name\", ";
        } else {
            resp = "[[\"Ship Name\", ";
        }
        String starLevel = queryParams.substring(queryParams.indexOf("starLevel")+9);
        if(starLevel.indexOf(" ") > -1)
            starLevel = starLevel.substring(0, starLevel.indexOf(" "));
        int stars = Integer.parseInt(""+starLevel.charAt(starLevel.length()-1));
        String operator = starLevel.substring(0, starLevel.indexOf(""+stars));
        if(operator.equals(">="))
            stars--;
        for(int i = stars+1; i < 8; i++ ){
            resp += "\""+i+"* Count\", ";
        }
        resp += "\"Combined Count\"]";
        try {
            List<assetByStarEntry> assetByStar = DBUtilities.queryAssetCountByStar(guild, caller, queryParams);
            Map<String, assetByStarEntry> assetByStarCombined = new HashMap<>();
            for(assetByStarEntry asset : assetByStar){
                if(assetByStarCombined.containsKey(asset.getName())){
                    assetByStarEntry current = assetByStarCombined.get(asset.getName());
                    if(asset.get0StarCount() != -1)
                        current.setCount(0, asset.get0StarCount());
                    if(asset.get1StarCount() != -1)
                        current.setCount(1, asset.get1StarCount());
                    if(asset.get2StarCount() != -1)
                        current.setCount(2, asset.get2StarCount());
                    if(asset.get3StarCount() != -1)
                        current.setCount(3, asset.get3StarCount());
                    if(asset.get4StarCount() != -1)
                        current.setCount(4, asset.get4StarCount());
                    if(asset.get5StarCount() != -1)
                        current.setCount(5, asset.get5StarCount());
                    if(asset.get6StarCount() != -1)
                        current.setCount(6, asset.get6StarCount());
                    if(asset.get7StarCount() != -1)
                        current.setCount(7, asset.get7StarCount());
                    assetByStarCombined.put(asset.getName(), current);
                } else {
                    assetByStarCombined.put(asset.getName(), asset);
                }
            }
            assetByStar.clear();
            for(assetByStarEntry asset : assetByStarCombined.values()){
                assetByStar.add(asset);
            }
            assetByStarEntry[] array = assetByStar.toArray(new assetByStarEntry[]{});
            
            for(assetByStarEntry entry : array){
                resp += ",[\""+escapeJS(entry.getName());
                if(stars <= -1)
                    resp += "\", \""+entry.get0StarCount();
                if(stars <= 0)
                    resp += "\", \""+entry.get1StarCount();
                if(stars <= 1)
                    resp += "\", \""+entry.get2StarCount();
                if(stars <= 2)
                    resp += "\", \""+entry.get3StarCount();
                if(stars <= 3)
                    resp += "\", \""+entry.get4StarCount();
                if(stars <= 4)
                    resp += "\", \""+entry.get5StarCount();
                if(stars <= 5)
                    resp += "\", \""+entry.get6StarCount();
                if(stars <= 6)
                    resp += "\", \""+entry.get7StarCount();
                resp += "\", \""+entry.getCombinedCount()+"\"]";
            }
            resp += "]";
        } catch (Exception e){
            resp = "[]";
            e.printStackTrace(System.out);
        }
        return resp;
    }

    private String submitTBReport(String resp, String guild, String queryParams){
        Map<String, String> stats = DBUtilities.queryTBStats(queryParams, guild);
        String TBType = stats.get("Type");
        if(TBType == null){
            String TB_ID = queryParams.substring(queryParams.indexOf("TB_ID"));
            TB_ID = TB_ID.substring(TB_ID.indexOf("'")+1);
            TB_ID = TB_ID.substring(0, TB_ID.indexOf("'"));
            TBType = TBTimeUtilities.getTBType(TB_ID);
        }
        if(queryParams.contains("Phase=1")){
            resp += "["+TBDataPoints.getHeaders("1", TBType)+", "+"[\""+stats.get("special")+"\", \""+stats.get("CM_1")+"\", \""+stats.get("CM_2");
            if(!TBType.equalsIgnoreCase("HOTH_LS"))
                resp += "\", \""+stats.get("CM_3");
            resp += "\", \""+stats.get("deployment")+"\"], "+TBDataPoints.getValues("1", TBType)+"]";
        } else if(queryParams.contains("Phase=2")){
            resp += "["+TBDataPoints.getHeaders("2", TBType)+", "+"[\""+stats.get("special")+"\", \""+stats.get("CM_1")+"\", \""+stats.get("CM_2")+"\", \""+stats.get("CM_3")+"\", \""+stats.get("deployment")+"\"], "+TBDataPoints.getValues("2", TBType)+"]";
        } else if(queryParams.contains("Phase=3")){
//            resp += "["+TBDataPoints.getHeaders("3", TBType)+", "+"[\""+stats.get("SM_1")+"\", \""+stats.get("deployment_ship")+"\", \""+stats.get("special")+"\", \""+stats.get("CM_1")+"\", \""+stats.get("CM_2")+"\", \""+stats.get("CM_3")+"\", \""+stats.get("deployment")+"\"], "+TBDataPoints.getValues("3", TBType)+"]";
            resp += "["+TBDataPoints.getHeaders("3", TBType)+", "+"[\""+stats.get("special")+"\", \""+stats.get("CM_1")+"\", \""+stats.get("CM_2")+"\", \""+stats.get("CM_3")+"\", \""+stats.get("deployment")+"\"], "+TBDataPoints.getValues("3", TBType)+"]";
        } else if(queryParams.contains("Phase=4")){
//            resp += "["+TBDataPoints.getHeaders("4", TBType)+", "+"[\""+stats.get("SM_1")+"\", \""+stats.get("deployment_ship")+"\", \""+stats.get("special")+"\", \""+stats.get("CM_1")+"\", \""+stats.get("CM_2")+"\", \""+stats.get("CM_3")+"\", \""+stats.get("deployment")+"\"], "+TBDataPoints.getValues("4", TBType)+"]";
            resp += "["+TBDataPoints.getHeaders("4", TBType)+", "+"[\""+stats.get("special")+"\", \""+stats.get("CM_1")+"\", \""+stats.get("CM_2")+"\", \""+stats.get("CM_3")+"\", \""+stats.get("deployment")+"\"], "+TBDataPoints.getValues("4", TBType)+"]";
        } else if(queryParams.contains("Phase=5")){
//            resp += "["+TBDataPoints.getHeaders("5", TBType)+", "+"[\""+stats.get("SM_1")+"\", \""+stats.get("deployment_ship")+"\", \""+stats.get("special")+"\", \""+stats.get("CM_1")+"\", \""+stats.get("CM_2")+"\", \""+stats.get("CM_3")+"\", \""+stats.get("deployment")+"\"], "+TBDataPoints.getValues("5", TBType)+"]";
            resp += "["+TBDataPoints.getHeaders("5", TBType)+", "+"[\""+stats.get("special")+"\", \""+stats.get("CM_1")+"\", \""+stats.get("CM_2")+"\", \""+stats.get("CM_3")+"\", \""+stats.get("deployment")+"\"], "+TBDataPoints.getValues("5", TBType)+"]";
        } else {
            if(!TBType.equalsIgnoreCase("HOTH_LS"))
                resp += "["+TBDataPoints.getHeaders("6", TBType)+", "+"[\""+stats.get("SM_1")+"\", \""+stats.get("deployment_ship")+"\", \""+stats.get("special")+"\", \""+stats.get("CM_1")+"\", \""+stats.get("CM_2")+"\", \""+stats.get("CM_3")+"\", \""+stats.get("deployment")+"\"], "+TBDataPoints.getValues("6", TBType)+"]";
            else
                resp += "["+TBDataPoints.getHeaders("6", TBType)+", "+"[\""+stats.get("special")+"\", \""+stats.get("CM_1")+"\", \""+stats.get("CM_2")+"\", \""+stats.get("CM_3")+"\", \""+stats.get("deployment")+"\"], "+TBDataPoints.getValues("6", TBType)+"]";
        }
        // TODO: Add additional array that holds the Deployment stats
        String[] deploymentStats = stats.get("deployment-stats").split("\\|");
        String depArray = "";
        for(String stat : deploymentStats){
            depArray += "[\""+stat.split(":")[0]+"\", \""+stat.split(":")[1]+"\"], ";
        }
        depArray = depArray.substring(0, depArray.length()-2);
        resp += ","+depArray;
        return resp;
    }
    private String deploymentSummary(String resp, String guild, String queryParams){
        // TODO: Add additional array that holds the Deployment stats
        Map<String, String> stats = DBUtilities.queryTBStats(queryParams, guild);
        String[] deploymentStats = stats.get("deployment-stats").split("\\|");
        String depArray = "";
        for(String stat : deploymentStats){
            depArray += "[\""+stat.split(":")[0]+"\", \""+stat.split(":")[1]+"\"], ";
        }
        depArray = depArray.substring(0, depArray.length()-2);
        resp += depArray;
        return resp;
    }
    private String tbReport(String resp, String queryParams){
        Map<String, String> conditions = DBUtilities.parseQueryString(queryParams);
        Map<String, List<String>> data = new LinkedHashMap<String, List<String>>();

        if(conditions.get("TB_ID").equals(TBTimeUtilities.getCurrentTBDef()) && TBTimeUtilities.getCurrentPhase() != 0){ // If the query is for the current TB adjust the member list to current
            // Create a Map<String, List> where String = memberURIs and List.get(0) = MemberName for the specified guild
            List<memberEntry> members = DBUtilities.queryMemberTable("GuildName='"+conditions.get("GuildName")+"'");
            for(memberEntry member : members){
                List<String> entry = new ArrayList<String>();
                entry.add(member.getMemberName());
                entry.add(member.getGuildName());
                data.put(member.getMemberURI(), entry);
            }
            // Update List to include the additional stats
            for(String uri : data.keySet()){
                data.get(uri).addAll(DBUtilities.queryTBRecord(Integer.parseInt(conditions.get("Phase")), TBTimeUtilities.getTBType(conditions.get("TB_ID")), "TB_ID='"+conditions.get("TB_ID")+"' AND Phase="+conditions.get("Phase")+" AND MemberURI='"+uri+"'"));
            }
        } else { // If this is not a current TB query for existing data only
            data = DBUtilities.queryArchivedTB(Integer.parseInt(conditions.get("Phase")), "TB_ID='"+conditions.get("TB_ID")+"' AND GuildName='"+conditions.get("GuildName")+"' AND Phase="+conditions.get("Phase"), conditions.get("GuildName"));
        }

        String TBType = TBTimeUtilities.getTBType(conditions.get("TB_ID"));
        resp += "\""+TBType+"\"";
        // Write out the String version of the JSON Object
        for(String uri : data.keySet()){
            if(!uri.equals("Type")){
                resp += ",[\""+uri+"\"";
                for(String val : data.get(uri)){
                    resp += ", \""+val+"\"";
                }
                resp +="]";
            }
        }
        return resp;
    }
    private String manageTBs(String resp){
        List<TBInstance> TBs = TBTimeUtilities.getTBInstances();
        for(TBInstance TB : TBs){
            if(resp.endsWith("]"))
                resp += ", ";
            resp += "[\""+TB.getID()+"\", \""+TB.getType()+"\", \""+TB.getStartDateString()+"\", \""+TB.getEndDateString()+"\"]";
        }
        return resp;
    }
    
    public static String getTBPeriodSelect(String jsFunction){
        String periodSelect = "<select id=\"period-select\" value=\"TB Period\" ";
        if(jsFunction != null){
            periodSelect += "onchange=\""+jsFunction+"()\">";
        } else {
            periodSelect += "\">";
        }
        String current = TBTimeUtilities.getCurrentTBDef();
        List<String> tbDefOptions = TBTimeUtilities.getTB_IDs();
        for(int i=0;i<tbDefOptions.size();i++){
            if(tbDefOptions.get(i).equals(current)){
                tbDefOptions.set(i, "<option value=\""+tbDefOptions.get(i)+"\" selected>"+tbDefOptions.get(i)+"</option>");
            } else {
                tbDefOptions.set(i, "<option value=\""+tbDefOptions.get(i)+"\">"+tbDefOptions.get(i)+"</option>");
            }
        }
        for(String option : tbDefOptions){
            periodSelect += "\n"+option;
        }
        periodSelect += "\n</select>";
        
        return periodSelect;
    }
    public static String getPhaseSelect(String jsFunction){
        String phaseSelect = "<select id=\"phase-select\" value=\"Phase\" ";
        if(jsFunction != null){
            phaseSelect += "onchange=\""+jsFunction+"()\">";
        } else {
            phaseSelect += "\">";
        }
        List<String> PhaseOptions = new ArrayList<String>();
        PhaseOptions.add("<option value=\"1\"");
        PhaseOptions.add("<option value=\"2\"");
        PhaseOptions.add("<option value=\"3\"");
        PhaseOptions.add("<option value=\"4\"");
        PhaseOptions.add("<option value=\"5\"");
        PhaseOptions.add("<option value=\"6\"");
        try {
            PhaseOptions.set(TBTimeUtilities.getCurrentPhase()-1, PhaseOptions.get(TBTimeUtilities.getCurrentPhase()-1)+" selected");
        } catch(Exception e){}
        for(int i=0;i<PhaseOptions.size();i++){
            PhaseOptions.set(i, PhaseOptions.get(i)+">Phase "+(i+1)+"</option>");
        }
        for(String option : PhaseOptions){
            phaseSelect += "\n"+option;
        }
        phaseSelect += "\n</select>";
        
        return phaseSelect;
    }

    private String buildRosterTableString(String resp, String guild, String queryParams){
        List<rosterEntry> roster = DBUtilities.queryRosterTable(guild, queryParams);
        rosterEntry[] array = roster.toArray(new rosterEntry[]{});
        Arrays.sort(array, new MemberNameComparatorAscending());
        // Create JS JSON array of arrays
        for(rosterEntry entry : array){
            if(!resp.endsWith("["))
                resp += ",";
            resp += "[\""+escapeJS(entry.getMemberName())+"\", \""+escapeJS(entry.getCharName())+"\", \""+entry.getCharLevel()+"\", \""+
                    entry.getStarLevel()+"\", \""+entry.getGearLevel()+"\", \""+entry.getAlignment()+"\", \""+entry.getPower()+
                    "\", \""+entry.getLastUpdate()+"\", \""+entry.getMemberURI()+"\"]";
        }
        return resp;
    }
    private String buildShipTableString(String resp, String guild, String queryParams){
        List<shipEntry> ships = DBUtilities.queryShipTable(guild, queryParams);
        shipEntry[] array = ships.toArray(new shipEntry[]{});
        Arrays.sort(array, new MemberNameComparatorAscending());

        // Create JS JSON array of arrays
        for(shipEntry entry : array){
            if(!resp.endsWith("["))
                resp += ",";
            resp += "[\""+escapeJS(entry.getMemberName())+"\", \""+escapeJS(entry.getShipName())+"\", \""+entry.getShipLevel()+"\", \""+
                    entry.getStarLevel()+"\", \""+escapeJS(entry.getCrewMembersAsString())+"\", \""+entry.getAlignment()+"\", \""+entry.getPower()+
                    "\", \""+entry.getLastUpdate()+"\", \""+entry.getMemberURI()+"\"]";
        }
        return resp;
    }
    private String buildMemberTableString(String resp, String guild, String queryParams){
        if(guild.equals("null"))
            guild = null;
        // Set the Header Row in the JSON Response;
        resp += "[\"Player Name\", \"Guild\", \"Galactic Power(Total)\", \"Galactic Power(Characters)\""+
                ", \"Galactic Power(Ships)\", \"Avg Arena Rank\"]";
        String tbstat1 = ",[\"P1 CMs\", \"P1 TB Points\", \"P1 Platoon Units\", \"P2 CMs\", \"P2 TB Points\", \"P2 Platoon Units\"]";
        String tbstat2 = ",[\"P3 CMs\", \"P3 TB Points\", \"P3 Platoon Units\", \"P4 CMs\", \"P4 TB Points\", \"P4 Platoon Units\"]";
        String tbstat3 = ",[\"P5 CMs\", \"P5 TB Points\", \"P3 Platoon Units\", \"P6 CMs\", \"P6 TB Points\", \"P6 Platoon Units\"]";

        List<memberEntry> members = DBUtilities.queryMemberTable(queryParams);
        memberEntry[] array = members.toArray(new memberEntry[]{});
        Arrays.sort(array, new MemberNameComparatorAscending());

        for(memberEntry member : array){
            resp += ",[\""+escapeJS(member.getMemberName())+"\",\""+member.getGuildName()+"\", \""+member.getGalacticPowerTotal()+"\",\""+
                    member.getGalacticPowerCharacters()+"\",\""+member.getGalacticPowerShips()+"\",\""+member.getArenaAvgRank()+"\", \""+
                    member.getLastUpdate()+"\", \""+member.getMemberURI()+"\"]";
            resp += tbstat1;
            resp += ",[\""+member.getP1_Combat_Missions()+"\",\""+member.getP1_Territory_Points()+"\", \""+member.getP1_Platoon_Mission_Units()+
                    "\",\""+member.getP2_Combat_Missions()+"\",\""+member.getP2_Territory_Points()+"\",\""+member.getP2_Platoon_Mission_Units()+"\"]";
            resp += tbstat2;
            resp += ",[\""+member.getP3_Combat_Missions()+"\",\""+member.getP3_Territory_Points()+"\", \""+member.getP3_Platoon_Mission_Units()+
                    "\",\""+member.getP4_Combat_Missions()+"\",\""+member.getP4_Territory_Points()+"\",\""+member.getP4_Platoon_Mission_Units()+"\"]";
            resp += tbstat3;
            resp += ",[\""+member.getP5_Combat_Missions()+"\",\""+member.getP5_Territory_Points()+"\", \""+member.getP5_Platoon_Mission_Units()+
                    "\",\""+member.getP6_Combat_Missions()+"\",\""+member.getP6_Territory_Points()+"\",\""+member.getP6_Platoon_Mission_Units()+"\"]";
        }
        return resp;
    }
    
    public static String getDefaultMemberTable(){
        String ans = "<tr><th>Player Name</th><th>Guild</th><th>Galactic Power(Total)</th>"+
                "<th>Galactic Power(Characters)</th><th>Galactic Power(Ships)</th>"+
                "<th>Avg Arena Rank</th></tr>";
        List<memberEntry> members = new ArrayList<>();
        members.addAll(DBUtilities.queryMemberTable(null));
        
        memberEntry[] array = members.toArray(new memberEntry[]{});
        Arrays.sort(array, new MemberNameComparatorAscending());

        long newest = 0L;
        SimpleDateFormat sdf = new SimpleDateFormat("MM/dd/YY hh:mm:ss");
        for(memberEntry entry : array){
            if(newest < entry.getLastUpdate()){
                newest = entry.getLastUpdate();
            }
            Date update = new Date(entry.getLastUpdate());
            String record = "<tr alt=\"Last Update: "+sdf.format(update)+"\"><td onclick=\"window.document.location='https://swgoh.gg"+entry.getMemberURI()+"';\" >"+escapeHTML(entry.getMemberName())+"</td>";
            record += "<td>"+entry.getGuildName()+"</td>";
            record += "<td>"+entry.getGalacticPowerTotal()+"</td>";
            record += "<td>"+entry.getGalacticPowerCharacters()+"</td>";
            record += "<td>"+entry.getGalacticPowerShips()+"</td>";
            record += "<td>"+entry.getArenaAvgRank()+"</td>";
            record += "<td><input type='button' id='show-"+escapeHTML(entry.getMemberURI())+"' value='Show All Stats' onClick='viewToggle(\"show-"+escapeHTML(entry.getMemberURI())+"\")'/></td></tr>";
            
            record += "<tr class='P1_P2' id='"+escapeHTML(entry.getMemberURI())+"-1-H'>"+
                "<th>P1 CMs</th><th>P1 TB Points</th><th>P1 Platoon Units</th>"+
                "<th>P2 CMs</th><th>P2 TB Points</th><th>P2 Platoon Units</th></tr>";
            record += "<tr class='P1_P2' id='"+escapeHTML(entry.getMemberURI())+"-1-D'>";
            record += "<td>"+entry.getP1_Combat_Missions()+"</td>";
            record += "<td>"+entry.getP1_Territory_Points()+"</td>";
            record += "<td>"+entry.getP1_Platoon_Mission_Units()+"</td>";
            record += "<td>"+entry.getP2_Combat_Missions()+"</td>";
            record += "<td>"+entry.getP2_Territory_Points()+"</td>";
            record += "<td>"+entry.getP2_Platoon_Mission_Units()+"</td>";
            record += "<td id='td-"+escapeHTML(entry.getMemberURI())+"-1-D' style='display:none;'><input type='button' id='save-"+escapeHTML(entry.getMemberURI())+"-1-D' value='Save' onClick='saveData(this)'/></td>";
            record += "<td><input type='button' id='edit-"+escapeHTML(entry.getMemberURI())+"-1-D' value='Edit' onClick='editData(this)'/></td></tr>";
            
            record += "<tr class='P3_P4' id='"+escapeHTML(entry.getMemberURI())+"-2-H'>"+
                "<th>P3 CMs</th><th>P3 TB Points</th><th>P3 Platoon Units</th>"+
                "<th>P4 CMs</th><th>P4 TB Points</th><th>P4 Platoon Units</th></tr>";
            record += "<tr class='P3_P4' id='"+escapeHTML(entry.getMemberURI())+"-2-D'>";
            record += "<td>"+entry.getP3_Combat_Missions()+"</td>";
            record += "<td>"+entry.getP3_Territory_Points()+"</td>";
            record += "<td>"+entry.getP3_Platoon_Mission_Units()+"</td>";
            record += "<td>"+entry.getP4_Combat_Missions()+"</td>";
            record += "<td>"+entry.getP4_Territory_Points()+"</td>";
            record += "<td>"+entry.getP4_Platoon_Mission_Units()+"</td>";
            record += "<td id='td-"+escapeHTML(entry.getMemberURI())+"-2-D' style='display:none;'><input type='button' id='save-"+escapeHTML(entry.getMemberURI())+"-2-D' value='Save' onClick='saveData(this)'/></td>";
            record += "<td><input type='button' id='edit-"+escapeHTML(entry.getMemberURI())+"-2-D' value='Edit' onClick='editData(this)'/></td></tr>";

            record += "<tr class='P5_P6' id='"+escapeHTML(entry.getMemberURI())+"-3-H'>"+
                "<th>P5 CMs</th><th>P5 TB Points</th><th>P5 Platoon Units</th>"+
                "<th>P6 CMs</th><th>P6 TB Points</th><th>P6 Platoon Units</th></tr>";
            record += "<tr class='P5_P6' id='"+escapeHTML(entry.getMemberURI())+"-3-D'>";
            record += "<td>"+entry.getP5_Combat_Missions()+"</td>";
            record += "<td>"+entry.getP5_Territory_Points()+"</td>";
            record += "<td>"+entry.getP5_Platoon_Mission_Units()+"</td>";
            record += "<td>"+entry.getP6_Combat_Missions()+"</td>";
            record += "<td>"+entry.getP6_Territory_Points()+"</td>";
            record += "<td>"+entry.getP6_Platoon_Mission_Units()+"</td>";
            record += "<td id='td-"+escapeHTML(entry.getMemberURI())+"-3-D' style='display:none;'><input type='button' id='save-"+escapeHTML(entry.getMemberURI())+"-3-D' value='Save' onClick='saveData(this)'/></td>";
            record += "<td><input type='button' id='edit-"+escapeHTML(entry.getMemberURI())+"-3-D' value='Edit' onClick='editData(this)'/></td></tr>";

            ans += "\n"+record;
        }
        Date update = new Date(newest);
        ans += "\n<tr class='totalRow'><td># of Results:</td><td>"+array.length+"</td><td colspan=3></td><td>Last Updated:</td><td>"+sdf.format(update)+"</td></tr>";
        ans += "\n";
        return ans;
    }
    public static String getAllMembers(){
        String ans = "";
        List<memberEntry> members = new ArrayList<>();
        members.addAll(DBUtilities.queryMemberTable(null));
        
        memberEntry[] array = members.toArray(new memberEntry[]{});
        Arrays.sort(array, new MemberNameComparatorAscending());

        for(memberEntry entry : array){
            String record = "<tr><td>"+escapeHTML(entry.getMemberName())+"</td><td>"+entry.getGuildName()+"</td><td>"+escapeHTML(entry.getMemberURI())+"</td></tr>";
            ans += "\n"+record;
        }
        ans += "\n";
        return ans;
    }
    public static String getDefaultRosterTable(String guild){
        String ans = "<tr><th>Player Name</th><th>Character Name</th><th>Character Level</th><th>Star Level</th><th>Gear Level</th><th>Alignment</th><th>Character Power</th></tr>";
        List<rosterEntry> roster = DBUtilities.queryRosterTable(guild, null);
        rosterEntry[] array = roster.toArray(new rosterEntry[]{});
        Arrays.sort(array, new MemberNameComparatorAscending());

        long newest = 0L;
        SimpleDateFormat sdf = new SimpleDateFormat("MM/dd/YY hh:mm:ss");
        for(rosterEntry entry : array){
            if(newest < entry.getLastUpdate()){
                newest = entry.getLastUpdate();
            }
            Date update = new Date(entry.getLastUpdate());
            String record = "<tr alt=\"Last Update: "+sdf.format(update)+"\"><td onclick=\"window.document.location='https://swgoh.gg"+entry.getMemberURI()+"';\" >"+escapeHTML(entry.getMemberName())+"</td>";
            record += "<td>"+escapeHTML(entry.getCharName())+"</td>";
            record += "<td>"+entry.getCharLevel()+"</td>";
            record += "<td>"+entry.getStarLevel()+"</td>";
            record += "<td>"+entry.getGearLevel()+"</td>";
            record += "<td>"+entry.getAlignment()+"</td>";
            record += "<td>"+entry.getPower()+"</td></tr>";
            ans += "\n"+record;
        }
        Date update = new Date(newest);
        ans += "\n<tr class='totalRow'><td># of Results:</td><td>"+array.length+"</td><td colspan=3></td><td>Last Updated:</td><td>"+sdf.format(update)+"</td></tr>";
        ans += "\n";
        return ans;
    }
    public static String getDefaultShipTable(String guild){
        String ans = "<tr><th>Player Name</th><th>Ship Name</th><th>Ship Level</th><th>Star Level</th><th>Crew Members</th><th>Alignment</th><th>Ship Power</th></tr>";
        List<shipEntry> ships = DBUtilities.queryShipTable(guild, null);
        shipEntry[] array = ships.toArray(new shipEntry[]{});
        Arrays.sort(array, new MemberNameComparatorAscending());

        long newest = 0L;
        SimpleDateFormat sdf = new SimpleDateFormat("MM/dd/YY hh:mm:ss");
        for(shipEntry entry : array){
            if(newest < entry.getLastUpdate()){
                newest = entry.getLastUpdate();
            }
            Date update = new Date(entry.getLastUpdate());
            String record = "<tr alt=\"Last Update: "+sdf.format(update)+"\"><td onclick=\"window.document.location='https://swgoh.gg"+entry.getMemberURI()+"';\">"+escapeHTML(entry.getMemberName())+"</td>";
            record += "<td>"+escapeHTML(entry.getShipName())+"</td>";
            record += "<td>"+entry.getShipLevel()+"</td>";
            record += "<td>"+entry.getStarLevel()+"</td>";
            record += "<td>"+escapeHTML(entry.getCrewMembersAsString())+"</td>";
            record += "<td>"+entry.getAlignment()+"</td>";
            if(entry.getPower() != 0 || entry.getStarLevel() == 0)
                record += "<td>"+entry.getPower()+"</td></tr>";
            else
                record += "<td>Unavailable</td></tr>";
            ans += "\n"+record;
        }
        Date update = new Date(newest);
        ans += "\n<tr class='totalRow'><td># of Results:</td><td>"+array.length+"</td><td colspan=3></td><td>Last Updated:</td><td>"+sdf.format(update)+"</td></tr>";
        ans += "\n";
        return ans;
    }
    
    private static String escapeHTML(String val) {
        if(val.contains("\"")){
            return val.replaceAll("\"", "&quot;");
        } else {
            return val;
        }
    }
    private static String escapeJS(String val) {
        if(val.contains("\"")){
             val = val.replace("\"", "\\\"");
        }
        return val;
    }


    // <editor-fold defaultstate="collapsed" desc="HttpServlet methods. Click on the + sign on the left to edit the code.">
    /**
     * Handles the HTTP
     * <code>GET</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doGet(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Handles the HTTP
     * <code>POST</code> method.
     *
     * @param request servlet request
     * @param response servlet response
     * @throws ServletException if a servlet-specific error occurs
     * @throws IOException if an I/O error occurs
     */
    @Override
    protected void doPost(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        processRequest(request, response);
    }

    /**
     * Returns a short description of the servlet.
     *
     * @return a String containing servlet description
     */
    @Override
    public String getServletInfo() {
        return "Short description";
    }// </editor-fold>
}
