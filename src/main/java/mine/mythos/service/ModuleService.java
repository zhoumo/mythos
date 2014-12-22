package mine.mythos.service;

import java.util.ArrayList;
import java.util.List;
import java.util.Stack;

import org.apache.commons.lang.StringUtils;
import org.springframework.stereotype.Service;

import mine.mythos.base.BaseService;
import mine.mythos.model.module.Modules;
import mine.mythos.util.XmlUtil;

@Service
public class ModuleService extends BaseService {

	public Modules getModules() {
		String resourcePath = getClass().getClassLoader().getResource("/").getPath();
		Modules modules = XmlUtil.xmlToObject(resourcePath + "system/modules.xml", Modules.class);
		return modules;
	}

	public List<Modules.Module> getModuleList() {
		Stack<Modules.Module> stack = new Stack<Modules.Module>();
		for (Modules.Module module : getModules().getModule()) {
			stack.push(module);
		}
		List<Modules.Module> moduleList = new ArrayList<Modules.Module>();
		while (!stack.isEmpty()) {
			Modules.Module module = stack.pop();
			if (StringUtils.isEmpty(module.getComponent())) {
				for (Modules.Module childModule : module.getModule()) {
					stack.push(childModule);
				}
			} else {
				moduleList.add(module);
			}
		}
		return moduleList;
	}
}
