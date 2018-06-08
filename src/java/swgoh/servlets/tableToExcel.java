/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package swgoh.servlets;

import com.google.gson.Gson;
import java.io.IOException;
import java.io.PrintWriter;
import java.util.List;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;
import org.apache.poi.ss.usermodel.Workbook;
import org.apache.poi.ss.util.AreaReference;
import org.apache.poi.ss.util.CellReference;
import org.apache.poi.xssf.usermodel.XSSFCell;
import org.apache.poi.xssf.usermodel.XSSFRow;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFTable;
import org.apache.poi.xssf.usermodel.XSSFTableStyleInfo;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import swgoh.objects.ExcelTable;
import swgoh.objects.jsonResponse;
import swgoh.utility.SpreadSheets;

/**
 *
 * @author jwoolf
 */
public class tableToExcel extends HttpServlet {

    protected void processRequest(HttpServletRequest request, HttpServletResponse response)
            throws ServletException, IOException {
        HttpSession httpSession = request.getSession(false);
        //False because we do not want it to create a new session if it does not exist.
        String jsonResponse = null;
        if(httpSession != null){
            jsonResponse = (String)httpSession.getAttribute("jsonResponse");
        }
        if(jsonResponse == null){
            sendError("No data available to turn into a SpreadSheet", response);
            return;
        }
        /*
        //TODO: Testing only, Remove when it works and send an error instead
        jsonResponse = "{\"type\":\"buildGearList\",\"data\":[{\"id\":\"collated_gear\",\"displayName\":\"Collated Gear Needed for Sith Marauder\",\"data\":[[\"# Pieces\",\"Piece Name\",\"# Components\",\"Component Name\"],[\"1\",\"Mk 5 BioTech Implant\",\"\",\"\"],[\"\",\"\",\"5\",\"Mk 3 Arakyd Droid Caller Salvage\"],[\"\",\"\",\"1\",\"Mk 5 BioTech Implant Prototype\"],[\"\",\"\",\"1\",\"Mk 1 SoroSuub Keypad\"],[\"1\",\"Mk 6 Neuro-Saav Electrobinoculars\",\"\",\"\"],[\"\",\"\",\"5\",\"Mk 6 Neuro-Saav Electrobinoculars Prototype Salvage\"],[\"\",\"\",\"5\",\"Mk 5 Neuro-Saav Electrobinoculars Salvage\"],[\"1\",\"Mk 4 Arakyd Droid Caller\",\"\",\"\"],[\"\",\"\",\"20\",\"Mk 4 Arakyd Droid Caller Salvage\"],[\"1\",\"Mk 5 Arakyd Droid Caller\",\"\",\"\"],[\"\",\"\",\"50\",\"Mk 5 Arakyd Droid Caller Salvage\"],[\"\",\"\",\"20\",\"Mk 5 Loronar Power Cell Salvage\"],[\"\",\"\",\"4\",\"Mk 2 TaggeCo Holo Lens\"],[\"\",\"\",\"20\",\"Mk 1 Zaltin Bacta Gel Prototype Salvage\"],[\"2\",\"Mk 6 Chiewab Hypo Syringe\",\"\",\"\"],[\"\",\"\",\"50\",\"Mk 6 Chiewab Hypo Syringe Salvage\"],[\"1\",\"Mk 5 A/KT Stun Gun\",\"\",\"\"],[\"\",\"\",\"1\",\"Mk 1 Sienar Holo Projector\"],[\"\",\"\",\"50\",\"Mk 5 A/KT Stun Gun Prototype Salvage\"],[\"\",\"\",\"50\",\"Mk 3 Carbanti Sensor Array Salvage\"],[\"1\",\"Mk 5 Merr-Sonn Thermal Detonator\",\"\",\"\"],[\"\",\"\",\"50\",\"Mk 5 Merr-Sonn Thermal Detonator Prototype Salvage\"],[\"\",\"\",\"1\",\"Mk 3 BAW Armor Mod\"],[\"\",\"\",\"1\",\"Mk 2 Fabritech Data Pad\"],[\"\",\"\",\"50\",\"Mk 3 Carbanti Sensor Array Salvage\"],[\"1\",\"Mk 9 BlasTech Weapon Mod\",\"\",\"\"],[\"\",\"\",\"50\",\"Mk 3 Czerka Stun Cuffs Salvage\"],[\"\",\"\",\"5\",\"Mk 4 Merr-Sonn Thermal Detonator Prototype Salvage\"],[\"\",\"\",\"1\",\"Mk 2 TaggeCo Holo Lens\"],[\"\",\"\",\"5\",\"Mk 1 Chedak Comlink Salvage\"],[\"1\",\"Mk 7 Nubian Security Scanner\",\"\",\"\"],[\"\",\"\",\"8\",\"Mk 2 Chiewab Hypo Syringe\"],[\"\",\"\",\"8\",\"Mk 1 CEC Fusion Furnace\"],[\"\",\"\",\"8\",\"Mk 2 SoroSuub Keypad Prototype\"],[\"\",\"\",\"16\",\"Mk 1 BAW Armor Mod\"],[\"\",\"\",\"50\",\"Mk 7 Nubian Security Scanner Salvage\"],[\"\",\"\",\"8\",\"Mk 2 Neuro-Saav Electrobinoculars Prototype\"],[\"\",\"\",\"8\",\"Mk 5 BlasTech Weapon Mod Prototype\"],[\"2\",\"Mk 6 Nubian Design Tech\",\"\",\"\"],[\"\",\"\",\"50\",\"Mk 6 Nubian Design Tech Salvage\"],[\"\",\"\",\"40\",\"Mk 3 Arakyd Droid Caller Salvage\"],[\"\",\"\",\"4\",\"Mk 1 Czerka Stun Cuffs\"],[\"\",\"\",\"20\",\"Mk 2 Sienar Holo Projector Prototype Salvage\"],[\"1\",\"Mk 7 Merr-Sonn Shield Generator\",\"\",\"\"],[\"\",\"\",\"20\",\"Mk 4 Arakyd Droid Caller Salvage\"],[\"\",\"\",\"20\",\"Mk 4 A/KT Stun Gun Salvage\"],[\"\",\"\",\"20\",\"Mk 5 SoroSuub Keypad Salvage\"],[\"\",\"\",\"50\",\"Mk 7 Merr-Sonn Shield Generator Salvage\"],[\"3\",\"Mk 9 Fabritech Data Pad\",\"\",\"\"],[\"\",\"\",\"60\",\"Mk 9 Fabritech Data Pad Salvage\"],[\"\",\"\",\"50\",\"Mk 9 Fabritech Data Pad Component\"],[\"1\",\"Mk 4 Sienar Holo Projector\",\"\",\"\"],[\"\",\"\",\"5\",\"Mk 6 Neuro-Saav Electrobinoculars Prototype Salvage\"],[\"\",\"\",\"5\",\"Mk 5 BAW Armor Mod Salvage\"],[\"\",\"\",\"50\",\"Mk 3 Czerka Stun Cuffs Salvage\"],[\"\",\"\",\"50\",\"Mk 4 Sienar Holo Projector Salvage\"],[\"\",\"\",\"5\",\"Mk 4 Nubian Security Scanner Prototype Salvage\"],[\"\",\"\",\"1\",\"Mk 2 BlasTech Weapon Mod\"],[\"\",\"\",\"10\",\"Mk 5 Neuro-Saav Electrobinoculars Salvage\"],[\"1\",\"Mk 6 Merr-Sonn Thermal Detonator\",\"\",\"\"],[\"\",\"\",\"50\",\"Mk 6 Merr-Sonn Thermal Detonator Salvage\"],[\"\",\"\",\"1\",\"Mk 3 BlasTech Weapon Mod\"],[\"\",\"\",\"1\",\"Mk 3 BioTech Implant\"],[\"1\",\"Mk 6 Arakyd Droid Caller\",\"\",\"\"],[\"\",\"\",\"50\",\"Mk 6 Arakyd Droid Caller Salvage\"],[\"1\",\"Mk 12 ArmaTek Multi-tool\",\"\",\"\"],[\"\",\"\",\"20\",\"Mk 8 Nubian Security Scanner Salvage\"],[\"\",\"\",\"30\",\"Mk 12 ArmaTek Multi-tool Prototype Salvage\"],[\"1\",\"Mk 12 ArmaTek Bayonet\",\"\",\"\"],[\"\",\"\",\"30\",\"Mk 12 ArmaTek Bayonet Prototype Salvage\"],[\"\",\"\",\"20\",\"Mk 7 Chiewab Hypo Syringe Salvage\"],[\"1\",\"Mk 12 ArmaTek Medpac\",\"\",\"\"],[\"\",\"\",\"20\",\"Mk 6 Athakam Medpac Salvage\"],[\"\",\"\",\"30\",\"Mk 12 ArmaTek Medpac Prototype Salvage\"]]},{\"id\":\"salvage_gear\",\"displayName\":\"Salvage Needed for Sith Marauder\",\"data\":[[\"# Needed\",\"Component Name\"],[\"20\",\"Mk 6 Athakam Medpac Salvage\"],[\"5\",\"Mk 4 Nubian Security Scanner Prototype Salvage\"],[\"20\",\"Mk 8 Nubian Security Scanner Salvage\"],[\"20\",\"Mk 4 A/KT Stun Gun Salvage\"],[\"1\",\"Mk 3 BAW Armor Mod\"],[\"30\",\"Mk 12 ArmaTek Bayonet Prototype Salvage\"],[\"30\",\"Mk 12 ArmaTek Medpac Prototype Salvage\"],[\"50\",\"Mk 6 Merr-Sonn Thermal Detonator Salvage\"],[\"5\",\"Mk 5 Neuro-Saav Electrobinoculars Salvage\"],[\"8\",\"Mk 2 SoroSuub Keypad Prototype\"],[\"20\",\"Mk 1 Zaltin Bacta Gel Prototype Salvage\"],[\"30\",\"Mk 12 ArmaTek Multi-tool Prototype Salvage\"],[\"1\",\"Mk 3 BioTech Implant\"],[\"50\",\"Mk 6 Chiewab Hypo Syringe Salvage\"],[\"1\",\"Mk 1 SoroSuub Keypad\"],[\"50\",\"Mk 4 Sienar Holo Projector Salvage\"],[\"5\",\"Mk 5 BAW Armor Mod Salvage\"],[\"1\",\"Mk 1 Sienar Holo Projector\"],[\"20\",\"Mk 5 Loronar Power Cell Salvage\"],[\"5\",\"Mk 4 Merr-Sonn Thermal Detonator Prototype Salvage\"],[\"8\",\"Mk 2 Chiewab Hypo Syringe\"],[\"50\",\"Mk 5 A/KT Stun Gun Prototype Salvage\"],[\"20\",\"Mk 4 Arakyd Droid Caller Salvage\"],[\"50\",\"Mk 5 Merr-Sonn Thermal Detonator Prototype Salvage\"],[\"50\",\"Mk 5 Arakyd Droid Caller Salvage\"],[\"50\",\"Mk 7 Merr-Sonn Shield Generator Salvage\"],[\"1\",\"Mk 2 BlasTech Weapon Mod\"],[\"1\",\"Mk 2 Fabritech Data Pad\"],[\"50\",\"Mk 9 Fabritech Data Pad Component\"],[\"4\",\"Mk 1 Czerka Stun Cuffs\"],[\"1\",\"Mk 5 BioTech Implant Prototype\"],[\"8\",\"Mk 1 CEC Fusion Furnace\"],[\"1\",\"Mk 3 BlasTech Weapon Mod\"],[\"50\",\"Mk 3 Carbanti Sensor Array Salvage\"],[\"16\",\"Mk 1 BAW Armor Mod\"],[\"8\",\"Mk 2 Neuro-Saav Electrobinoculars Prototype\"],[\"50\",\"Mk 6 Arakyd Droid Caller Salvage\"],[\"5\",\"Mk 6 Neuro-Saav Electrobinoculars Prototype Salvage\"],[\"50\",\"Mk 3 Czerka Stun Cuffs Salvage\"],[\"60\",\"Mk 9 Fabritech Data Pad Salvage\"],[\"50\",\"Mk 6 Nubian Design Tech Salvage\"],[\"20\",\"Mk 5 SoroSuub Keypad Salvage\"],[\"5\",\"Mk 3 Arakyd Droid Caller Salvage\"],[\"20\",\"Mk 7 Chiewab Hypo Syringe Salvage\"],[\"50\",\"Mk 7 Nubian Security Scanner Salvage\"],[\"4\",\"Mk 2 TaggeCo Holo Lens\"],[\"20\",\"Mk 2 Sienar Holo Projector Prototype Salvage\"],[\"8\",\"Mk 5 BlasTech Weapon Mod Prototype\"],[\"5\",\"Mk 1 Chedak Comlink Salvage\"]]}]}";
        */

        Gson gson = new Gson();
        jsonResponse jr = gson.fromJson(jsonResponse, jsonResponse.class);
        if(jr.getType().equalsIgnoreCase("buildGearList")){
            ExcelTable collated = gson.fromJson(gson.toJson(jr.getData().get(0)), ExcelTable.class);
            ExcelTable components = gson.fromJson(gson.toJson(jr.getData().get(1)), ExcelTable.class);
            Workbook workbook = SpreadSheets.createGearWorkBook(collated, components);
            String filename = collated.getDisplayName().replace(" ", "_");
            filename = filename.substring(filename.indexOf("for_")+4)+"_Gear.xlsx";
            response.setContentType("Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
            response.addHeader("content-disposition", "attachment; filename="+filename);
            try {
                workbook.write(response.getOutputStream());
                workbook.close();
            } finally {}
        } else {
            sendError("Unknown JSON Type", response);
            return;
        }
        response.getOutputStream().close();
    }

    private void sendError(String errorMsg, HttpServletResponse response) throws IOException {
        response.setContentType("text/html;charset=UTF-8");
        String responseText = "<html xmlns=\"http://www.w3.org/1999/xhtml\" xmlns:fb=\"http://ogp.me/ns/fb#\"><head>\n" +
                "        <title>Sith Happened Error Page</title>\n" +
                "        <meta http-equiv=\"Content-Type\" content=\"text/html; charset=UTF-8\">\n" +
                "        <meta name=\"viewport\" content=\"width=device-width, initial-scale=1\">\n" +
                "        <meta property=\"og:url\" content=\"http://sithhappens.net/swgoh/error\">\n" +
                "        <meta property=\"og:type\" content=\"website\">\n" +
                "        <meta property=\"og:title\" content=\"Sith Happened - Error Page\">\n" +
                "        <meta property=\"og:description\" content=\"Sith Happened - Error Page\">\n" +
                "        <meta property=\"og:image\" content=\"http://sithhappens.net/swgoh/images/Image_BoD.jpg\">\n" +
                "        <link rel=\"stylesheet\" href=\"css/main.css\">\n" +
                "        <link rel=\"stylesheet\" href=\"css/animations.css\">\n" +
                "        <script src=\"js/common.js\"></script>\n" +
                "        <style>\n" +
                "        th {\n" +
                "          text-align: center;\n" +
                "        }\n" +
                "        </style>\n" +
                "    </head>\n" +
                "    <body id=\"pageBody\" class=\"guildPage\">\n" +
                "        <div class=\"section\">\n" +
                "            <img class=\"sectionContent\" src=\"images/SH_Leaderboard_SHd.jpg\">\n" +
                "            <div class=\"sectionContent\">\n" +
                "                <a href=\"/swgoh/viewGuildRoster.jsp?guild=SithHappened\"><img src=\"images/Red/SH_buttons_red-03.png\" style=\"width: 86px\"></a>\n" +
                "                <a href=\"/swgoh/viewGuildShips.jsp?guild=SithHappened\"><img src=\"images/Red/SH_buttons_red-02.png\" style=\"width: 86px\"></a>\n" +
                "                <a href=\"http://swgoh.gg/g/9274/sithhappened/unit-search/\"><img src=\"images/Red/SH_buttons_red-01.png\" style=\"width: 86px\"></a>\n" +
                "            </div>\n" +
                "        </div>\n" +
                "    \n" +
                "<div id=\"errorDisplaySection\" class=\"section\"><div class=\"sectionHeader\">An error occured</div><div class=\"sectionContent\"><p>Error Message: </p>"+errorMsg+"</div></div></body></html>";
        PrintWriter out = response.getWriter();
        out.write(responseText);
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
