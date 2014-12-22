<%@ page language="java" contentType="text/html; charset=UTF-8"	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
		<title>Login</title>
		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<link href="css/login.css" rel="stylesheet" type="text/css" />
	</head>
	<body>
		<div class="login_panel">
			<form action="login.do" method="post">
				<table cellpadding="0" cellspacing="0" class="login_control">
					<tr>
						<td>用户名：</td>
						<td><input name="name" /></td>
					</tr>
					<tr>
						<td>密码：</td>
						<td><input name="password" type="password" /></td>
					</tr>
					<tr>
						<td colspan="2"><input type="submit" value="登录" /></td>
					</tr>
				</table>
			</form>
		</div>
	</body>
</html>