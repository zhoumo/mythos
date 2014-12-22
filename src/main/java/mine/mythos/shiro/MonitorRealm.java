package mine.mythos.shiro;

import java.util.HashSet;
import java.util.Set;

import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.subject.PrincipalCollection;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public class MonitorRealm extends AuthorizingRealm {

	protected Logger logger = LoggerFactory.getLogger(MonitorRealm.class);

	protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
		String userName = (String) principals.fromRealm(getName()).iterator().next();
		logger.info("[授权]-[" + userName + "]");
		Set<String> roleList = new HashSet<String>();
		roleList.add("admin");
		SimpleAuthorizationInfo info = new SimpleAuthorizationInfo();
		info.setRoles(roleList);
		return info;
	}

	@Override
	protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken authcToken) throws org.apache.shiro.authc.AuthenticationException {
		UsernamePasswordToken token = (UsernamePasswordToken) authcToken;
		String userName = token.getUsername();
		logger.info("[认证]-[" + userName + "]");
		SimpleAuthenticationInfo info = new SimpleAuthenticationInfo(userName, token.getPassword(), getName());
		return info;
	}
}