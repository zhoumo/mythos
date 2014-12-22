package mine.mythos.base;

import java.util.List;

import org.hibernate.SessionFactory;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.orm.hibernate3.support.HibernateDaoSupport;
import org.springframework.stereotype.Component;

@Component
public class BaseDao extends HibernateDaoSupport {

	@Autowired
	public void setSessionFacotry(SessionFactory sessionFacotry) {
		super.setSessionFactory(sessionFacotry);
	}

	protected Logger logger = LoggerFactory.getLogger(getClass());

	public <T extends BaseEntity> void save(T entity) {
		this.getHibernateTemplate().saveOrUpdate(entity);
	}

	public <T extends BaseEntity> void delete(T entity) {
		this.getHibernateTemplate().delete(entity);
	}

	public <T extends BaseEntity> void deleteAll(List<T> entityList) {
		this.getHibernateTemplate().deleteAll(entityList);
	}

	@SuppressWarnings("unchecked")
	public <T extends BaseEntity> List<T> find(String hql, Object... params) {
		return this.getHibernateTemplate().find(hql, params);
	}

	@SuppressWarnings("unchecked")
	public <T extends BaseEntity> List<T> findAll(Class<T> entity) {
		StringBuilder builder = new StringBuilder("from ");
		builder.append(entity.getName());
		return this.getHibernateTemplate().find(builder.toString());
	}
}
