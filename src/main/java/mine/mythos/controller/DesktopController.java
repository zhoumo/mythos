package mine.mythos.controller;

import java.util.List;

import mine.mythos.base.BaseController;
import mine.mythos.model.Shortcut;
import mine.mythos.model.module.Modules;
import mine.mythos.model.rbac.User;
import mine.mythos.service.ModuleService;
import mine.mythos.service.ShortcutService;
import net.sf.json.JSONObject;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
public class DesktopController extends BaseController {

	@Autowired
	private ModuleService moduleService;

	@Autowired
	private ShortcutService shortcutService;

	@RequestMapping("/login.do")
	public String login(User user) {
		Subject currentUser = SecurityUtils.getSubject();
		UsernamePasswordToken token = new UsernamePasswordToken(user.getName(), user.getPassword());
		try {
			currentUser.login(token);
		} catch (Exception e) {
			return DEFAULT_ERROR;
		}
		return DEFAULT_DESKTOP;
	}

	@RequestMapping("/logout.do")
	public String logout() {
		Subject currentUser = SecurityUtils.getSubject();
		currentUser.logout();
		return DEFAULT_LOGIN;
	}

	@RequestMapping("/modules")
	@ResponseBody
	public JSONObject getModules() {
		Modules modules = moduleService.getModules();
		JSONObject json = JSONObject.fromObject(modules);
		return JSONObject.fromObject(json.toString());
	}

	@RequestMapping("/moduleList")
	@ResponseBody
	public List<Modules.Module> getModuleList() {
		return moduleService.getModuleList();
	}

	@RequestMapping("/shortcuts")
	@ResponseBody
	public List<Shortcut> getShortcuts() {
		String user = SecurityUtils.getSubject().getPrincipal().toString();
		return shortcutService.getByUser(user);
	}

	@RequestMapping("/addShortcut")
	@ResponseBody
	public Boolean addShortcut(Shortcut shortcut) {
		String user = SecurityUtils.getSubject().getPrincipal().toString();
		shortcut.setUser(user);
		try {
			shortcutService.save(shortcut);
		} catch (Exception e) {
			logger.error("save shortcut failed.", e);
			return false;
		}
		return true;
	}

	@RequestMapping("/deleteShortcut")
	@ResponseBody
	public boolean deleteShortcut(String module) {
		String user = SecurityUtils.getSubject().getPrincipal().toString();
		try {
			shortcutService.delete(user, module);
		} catch (Exception e) {
			logger.error("delete shortcut failed.", e);
			return false;
		}
		return true;
	}
}
