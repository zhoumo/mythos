Ext.namespace("WebOS.util");
WebOS.util.MsgBox = Ext.emptyFn;
WebOS.util.MsgBox.showError = function(title, msg) {
	Ext.MessageBox.show({
		title : title,
		msg : msg,
		buttons : Ext.MessageBox.OK,
		icon : Ext.MessageBox.ERROR
	});
};
WebOS.util.MsgBox.showWarn = function(title, msg) {
	Ext.MessageBox.show({
		title : title,
		msg : msg,
		buttons : Ext.MessageBox.OK,
		icon : Ext.MessageBox.WARNING
	});
};
WebOS.util.MsgBox.showInfo = function(title, msg) {
	Ext.MessageBox.show({
		title : title,
		msg : msg,
		buttons : Ext.MessageBox.OK,
		icon : Ext.MessageBox.INFO
	});
};