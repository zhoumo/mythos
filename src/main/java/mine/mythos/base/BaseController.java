package mine.mythos.base;

import java.io.IOException;

import javax.servlet.http.HttpServletResponse;

import mine.mythos.model.value.Result;
import net.sf.json.JSONObject;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class BaseController {

	protected Logger logger = LoggerFactory.getLogger(getClass());

	protected final static String DEFAULT_LOGIN = "redirect:login.jsp";

	protected final static String DEFAULT_DESKTOP = "redirect:desktop.jsp";

	protected final static String DEFAULT_ERROR = "redirect:error.jsp";

	@SuppressWarnings("static-access")
	protected void returnJson(Result result, HttpServletResponse response) {
		JSONObject json = new JSONObject().fromObject(result);
		try {
			response.getWriter().write(json.toString());
		} catch (IOException e) {
			logger.info("return json failed.", e);
		}
	}
}
