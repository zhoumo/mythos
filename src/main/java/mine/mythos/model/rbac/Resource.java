package mine.mythos.model.rbac;

import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.JoinTable;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import mine.mythos.base.BaseEntity;

@Entity
@Table(name = "rbac_resource")
@SuppressWarnings("serial")
public class Resource extends BaseEntity {

	public static final String TYPE_MENU = "MENU";

	public static final String TYPE_REQUEST = "REQUEST";

	@Column(name = "resource_name")
	private String name;

	@Column(name = "resource_key")
	private String key;

	@Column(name = "resource_type")
	private String type;

	@Column(name = "parent_id")
	private Long parentId;

	@Column(name = "resource_url")
	private String url;

	@ManyToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE }, fetch = FetchType.EAGER)
	@JoinTable(name = "rbac_resource_role", joinColumns = { @JoinColumn(name = "resource_id") }, inverseJoinColumns = { @JoinColumn(name = "role_id") })
	private Set<Role> roles;

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getKey() {
		return key;
	}

	public void setKey(String key) {
		this.key = key;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Long getParentId() {
		return parentId;
	}

	public void setParentId(Long parentId) {
		this.parentId = parentId;
	}

	public String getUrl() {
		return url;
	}

	public void setUrl(String url) {
		this.url = url;
	}

	public Set<Role> getRoles() {
		return roles;
	}

	public void setRoles(Set<Role> roles) {
		this.roles = roles;
	}
}
