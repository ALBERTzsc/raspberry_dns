package person.zsc.filer;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;

/**
 * Servlet Filter implementation class Filter
 */
@WebFilter("/*")
public class Filter implements javax.servlet.Filter {

	/**
	 * Default constructor.
	 */
	
	private String[] filterStrs = {"js","jpg","png","login"};
	
	public Filter() {
		// TODO Auto-generated constructor stub
	}

	/**
	 * @see Filter#destroy()
	 */
	public void destroy() {
		// TODO Auto-generated method stub
	}

	/**
	 * @see Filter#doFilter(ServletRequest, ServletResponse, FilterChain)
	 */
	public void doFilter(ServletRequest request, ServletResponse response,
			FilterChain chain) throws IOException, ServletException {
		// TODO Auto-generated method stub
		// place your code here

		String url = ((HttpServletRequest) request).getRequestURL().toString();

		System.out.println("url = " + url);
		
		for(String s : filterStrs){
			if (url.endsWith(s)) {
				
				chain.doFilter(request, response);
				return;

			}
		}
		
		
	//	chain.doFilter(request, response);
		System.out.println("do Filter");
		request.getRequestDispatcher("/login.htm").forward(request, response);

	}

	/**
	 * @see Filter#init(FilterConfig)
	 */
	public void init(FilterConfig fConfig) throws ServletException {
		// TODO Auto-generated method stub
	}

}
