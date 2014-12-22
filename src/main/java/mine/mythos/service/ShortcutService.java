package mine.mythos.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import mine.mythos.base.BaseService;
import mine.mythos.model.Shortcut;

@Service
@Transactional
public class ShortcutService extends BaseService {

	public static final String FIND_SHORTCUT_BY_USER = "from Shortcut where user = ?";

	public static final String FIND_SHORTCUT_BY_USER_AND_MODULE = "from Shortcut where user = ? and module = ?";

	public List<Shortcut> getByUser(String user) {
		return this.baseDao.find(FIND_SHORTCUT_BY_USER, user);
	}

	public void save(Shortcut shortcut) {
		this.baseDao.save(shortcut);
	}

	public void delete(String user, String module) {
		List<Shortcut> shortcutList = this.baseDao.find(FIND_SHORTCUT_BY_USER_AND_MODULE, user, module);
		this.baseDao.deleteAll(shortcutList);
	}
}
