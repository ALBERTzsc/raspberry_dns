package person.zsc.service;

import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.util.Map;

import javax.servlet.ServletException;
import javax.servlet.annotation.WebServlet;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * Servlet implementation class LoginServlet
 */
@WebServlet("/login")
public class LoginServlet extends HttpServlet {
	private static final long serialVersionUID = 1L;
	private String PATH = "/opt/UserInfo.txt";
       
    /**
     * @see HttpServlet#HttpServlet()
     */
    public LoginServlet() {
        super();
        // TODO Auto-generated constructor stub
    }

	/**
	 * @see HttpServlet#doGet(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doGet(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		 doPost(request,response);
	}

	/**
	 * @see HttpServlet#doPost(HttpServletRequest request, HttpServletResponse response)
	 */
	protected void doPost(HttpServletRequest request, HttpServletResponse response) throws ServletException, IOException {
		// TODO Auto-generated method stub
		
		Map<String,String[]> reqMap = request.getParameterMap();
		//System.out.println("reqMap = "+reqMap);
		
		 /*String key = null;
		 String value = null;
		 for(Map.Entry me : reqMap.entrySet()) {
			 	key = (String) me.getKey();
			 	value = ((String[])me.getValue())[0];
	            System.out.println(key + ": " + value);
	     }*/
		String username = request.getParameter("username");
		String password = request.getParameter("password");
		
		System.out.println(String.format("username = %s,password = %s\n", username,password));
		 
		// writeUserInfo(request.getParameter("username"),request.getParameter("password"));
		
	}
	
	private void writeUserInfo(String username, String password){
		
		BufferedWriter br = null;
		try {
			br = new BufferedWriter(new FileWriter(new File(PATH)));
			br.write(String.format("username = %s,password = %s\n", username,password));
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}finally{
			try {
				br.close();
			} catch (IOException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
		}
	}

}
