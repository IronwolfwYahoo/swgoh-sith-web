/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package swgoh.servlets;

import com.ironwolf.comm.db.DatabasePool;
import java.io.InputStream;
import java.util.Properties;
import javax.servlet.ServletConfig;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;

/**
 *
 * @author jwoolf
 */
public class SithConstants extends HttpServlet {
   
    public void init(ServletConfig config) throws ServletException {
        super.init(config);
        try {
            String file = config.getInitParameter("config");
            System.out.println("Initializing SithConstants with "+file);
            InputStream is = getServletContext().getResourceAsStream(file);
            Properties swgoh = new Properties();
            try {
                swgoh.load(is);
                System.out.println("Config loaded");
                DatabasePool dbp = DatabasePool.getInstance(swgoh);
                System.out.println("Database Pool Initialized");
            } catch (Exception e){
                System.out.println("Exception initiializing DB Pool");
                e.printStackTrace(System.out);
            }
        } catch (Exception ex) {
            ex.printStackTrace(System.out);
        }
    }
}
