<%@ page language="java" contentType="text/html; charset=UTF-8"	pageEncoding="UTF-8"%>
<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
	<head>
	<title>桌面系统</title>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
	<link href="extjs/resources/css/ext-all.css" rel="stylesheet" type="text/css" />
	<link href="css/desktop.css" rel="stylesheet" type="text/css" />
	<link href="css/module.css" rel="stylesheet" type="text/css" />
	<script src="extjs/ext-all.js" type="text/javascript"></script>
	<script src="extjs/locale/ext-lang-zh_CN.js" type="text/javascript"></script>
	<jsp:include page="include.jsp"></jsp:include>
	
	<script src="script/MythosApplication.js" type="text/javascript"></script>
	<script type="text/javascript">
	Ext.onReady(function() {
		new Mythos.Application({
			startmenuUrl: 'modules',
			shortcutsUrl: 'shortcuts'
		});
		var left = -500;
		var el = Ext.get('cloud');
		var cloud = {
			run: function() {
				el.setStyle('left', left + 'px');
				left++;
				if (left > document.body.clientWidth) {
					left = -500;
				}
			},
			interval: 30
		};
		Ext.TaskManager.start(cloud);
	});
	</script>
	</head>
	<body>
		<div id="cloud"></div>
		<div id="clock">
			<embed src="flash/clock.swf" width="150" height="150" align="middle" type="application/x-shockwave-flash" wmode="transparent" />
		</div>
	</body>
</html>