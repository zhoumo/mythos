package mine.mythos.model;

import javax.persistence.Entity;
import javax.persistence.Table;

import mine.mythos.base.BaseEntity;

@Entity
@Table(name = "sys_shortcut")
@SuppressWarnings("serial")
public class Shortcut extends BaseEntity {

	private String module;

	private String name;

	private String iconCls;

	private String user;

	public String getModule() {
		return module;
	}

	public void setModule(String module) {
		this.module = module;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getIconCls() {
		return iconCls;
	}

	public void setIconCls(String iconCls) {
		this.iconCls = iconCls;
	}

	public String getUser() {
		return user;
	}

	public void setUser(String user) {
		this.user = user;
	}
}
