/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package swgoh.servlets;

import com.google.gson.Gson;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.LinkedHashMap;
import java.util.Map;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import swgoh.objects.defs.TBInstance;
import swgoh.utility.DBUtilities;
import swgoh.utility.TBTimeUtilities;
import static swgoh.utility.TBTimeUtilities.convertISOToDate;

/**
 *
 * @author jwoolf
 */
public class dataPush extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        response.setContentType("text/html;charset=UTF-8");
        PrintWriter out = response.getWriter();
        String status = "0";
        
        if(request.getParameter("caller") != null){
            String[] dbQueryBits = request.getParameter("data").split("\\|");
            Map<String, String> qBits = new LinkedHashMap<String, String>();
            for(String bit : dbQueryBits){
                qBits.put(bit.substring(0, bit.indexOf("=")), bit.substring(bit.indexOf("=")+1));
            }
            if (request.getParameter("caller").equals("selfReporting")){
                status = DBUtilities.setTBRecord(qBits);
                if(status.equals("0")){
                    String logEntry = "TBUpdate("+request.getRemoteAddr()+"): ";
                    logEntry += "Record("+qBits.get("MemberURI")+", "+qBits.get("TB_ID")+", "+qBits.get("Phase")+") ";
                    logEntry += "Data(";
                    for(String key : qBits.keySet()){
                        if(!key.equals("MemberURI") && !key.equals("TB_ID") && !key.equals("Phase")){
                            if(!logEntry.endsWith("Data("))
                                logEntry += ", ";
                            logEntry += key+":"+qBits.get(key);
                        }
                    }
                    logEntry += ")";
                    System.out.println(logEntry);
                }
            } else if (request.getParameter("caller").equals("manageTBs")){
                if(qBits.get("Action").equals("add")){
                    try {
                        DBUtilities.publishNewTBInstance(TBTimeUtilities.createNewInstance(qBits)); //Create TB Instance, Check for collisions & Publish new TB Instance
                    } catch (Exception e){
                        status = "Failed to Create TB Instance due to:\n"+e;
                    }
                } else if(qBits.get("Action").equals("edit")){
                    try {
                        TBInstance iTB = TBTimeUtilities.getTBInstance(qBits.get("TB_ID"));
                        if(iTB == null){
                            status = "Unknown TB Instance; Cannot be edited";
                        } else {
                            iTB.setDates(qBits.get("StartDate"));
                            iTB.setType(qBits.get("Type"));
                            DBUtilities.updateTBInstance(iTB);
                        }
                    } catch (Exception e){
                        status = "Failed to Update TB Instance due to:\n"+e.getMessage();
                    }
                } else if(qBits.get("Action").equals("remove")){
                    try {
                        DBUtilities.removeTBInstance(TBTimeUtilities.getTBInstance(qBits.get("TB_ID")));
                    } catch (Exception e){
                        status = "Failed to Remove TB Instance due to:\n"+e.getMessage();
                    }
                }
                TBTimeUtilities.refresh();
            }
        } else {
            Gson gson = new Gson();
            String[][] data = gson.fromJson(request.getParameter("data"), String[][].class);
            for(String[] update : data){

            }
            status = "0";
        }
        try {
        } finally {
            out.print(status);
            out.close();
        }
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
