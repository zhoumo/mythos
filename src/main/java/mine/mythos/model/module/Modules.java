package mine.mythos.model.module;

import java.util.ArrayList;
import java.util.List;
import javax.xml.bind.annotation.XmlAccessType;
import javax.xml.bind.annotation.XmlAccessorType;
import javax.xml.bind.annotation.XmlAttribute;
import javax.xml.bind.annotation.XmlID;
import javax.xml.bind.annotation.XmlRootElement;
import javax.xml.bind.annotation.XmlSchemaType;
import javax.xml.bind.annotation.adapters.CollapsedStringAdapter;
import javax.xml.bind.annotation.adapters.XmlJavaTypeAdapter;

@XmlAccessorType(XmlAccessType.FIELD)
@XmlRootElement(name = "modules")
public class Modules {

	private List<Modules.Module> module;

	public List<Modules.Module> getModule() {
		if (module == null) {
			module = new ArrayList<Module>();
		}
		return this.module;
	}

	@XmlAccessorType(XmlAccessType.FIELD)
	public static class Module {

		@XmlID
		@XmlAttribute
		@XmlSchemaType(name = "ID")
		@XmlJavaTypeAdapter(CollapsedStringAdapter.class)
		protected String id;

		@XmlAttribute
		protected String name;

		@XmlAttribute
		protected String iconCls;

		@XmlAttribute
		protected String component;

		protected List<Module> module;

		public String getId() {
			return id;
		}

		public void setId(String id) {
			this.id = id;
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

		public String getComponent() {
			return component;
		}

		public void setComponent(String component) {
			this.component = component;
		}

		public List<Module> getModule() {
			if (module == null) {
				module = new ArrayList<Module>();
			}
			return this.module;
		}

		public void setModule(List<Module> module) {
			this.module = module;
		}
	}
}
