package mine.mythos.base;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

public class BaseService {

	protected Logger logger = LoggerFactory.getLogger(getClass());

	@Autowired
	protected BaseDao baseDao;
}
