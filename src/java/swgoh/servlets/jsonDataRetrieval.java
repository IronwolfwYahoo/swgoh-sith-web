/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package swgoh.servlets;

import java.io.IOException;
import java.io.PrintWriter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import swgoh.objects.comparators.MemberNameComparatorAscending;
import swgoh.objects.jsonResponse;
import swgoh.objects.memberEntry;
import swgoh.utility.DBUtilities;
import swgoh.utility.MemberUtilities;
import swgoh.utility.httpUtility;

/**
 *
 * @author jwoolf
 */
public class jsonDataRetrieval extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        jsonResponse jr = new jsonResponse(request.getParameter("queryType"));

        try {
            // Build JSON Response based on the queryType
            if(jr.getType().equalsIgnoreCase("members")){
                jr.setData(retrieveBasicMemberList(request));
            }
            if(jr.getType().equalsIgnoreCase("characters")){
                jr.setData(retrieveAnonymousCharacterList());
            }
            if(jr.getType().equalsIgnoreCase("buildGearList")){
                    jr.setData(MemberUtilities.retrieveGearList(request.getParameter("member"), request.getParameter("character")));
            }
        } catch (Exception e){
            jr.clearData();
            jr.setType("Error");
            if(e.getMessage().contains("402 Payment Required")){
                jr.addData("SWGoH.gg Returned a 402 Payment Required (Refusal to Respond)");
            } else {
                jr.addData(escapeJS(e.getMessage().substring(0, e.getMessage().indexOf("\n"))));
            }
        }
        String jsonString = jr.toJSON();
        HttpSession httpSession = request.getSession();
        httpSession.setAttribute("jsonResponse", jsonString);
        out.println(jsonString);
        out.close();
    }
    
    private List retrieveBasicMemberList(HttpServletRequest request) {
        String conditions;
        if(request.getParameter("guild") != null){
            conditions = "GuildName='"+request.getParameter("guild")+"'";
        } else {
            conditions = "GuildName='SithHappened'";
        }
        memberEntry[] members = DBUtilities.queryMemberTable(conditions).toArray(new memberEntry[]{});
        Arrays.sort(members, new MemberNameComparatorAscending());
        
        List resp = new ArrayList<>();
        for(memberEntry member : members){
            String[] entry = new String[]{member.getMemberName(), member.getMemberURI()};
            resp.add(Arrays.asList(entry));
        }
        return resp;
    }

    private List retrieveAnonymousCharacterList() {
        List resp = new ArrayList();
        try {
            String HTTPResponse = httpUtility.sendHTTPRequest("/");
            HTTPResponse = HTTPResponse.substring(HTTPResponse.indexOf("<h1 class=\"m-a-0 h1\">Star Wars Galaxy of Heroes Characters</h1>"));
            Pattern p = Pattern.compile("\"\\/characters\\/[A-z\\-]*\\/\"");
            Matcher m = p.matcher(HTTPResponse);
            while (m.find()) {
                String uri = HTTPResponse.substring(m.start() + 13, m.end() - 2);
                if (!uri.equalsIgnoreCase("stats")) {
                    int startName = HTTPResponse.indexOf("<h5>", m.end())+4;
                    String name = HTTPResponse.substring(startName, HTTPResponse.indexOf("</h5>", startName));
                    resp.add(Arrays.asList(new String[]{escapeJS(name), uri}));
                }
            }
        } catch (Exception ex) {
            System.out.println("Attempt to pull available characters from swgoh.gg failed");
            ex.printStackTrace(System.out);
            return null;
        }
        return resp;
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
