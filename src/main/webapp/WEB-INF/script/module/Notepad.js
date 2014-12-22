Ext.define('WebOS.module.Notepad', {
	extend : 'WebOS.desktop.Module',
	createWindow : function() {
		var Desktop = this.app.getDesktop();
		var Window = Desktop.getWindow(this.module);
		if (!Window) {
			Window = Desktop.createWindow({
				id : this.module,
				title : this.text,
				iconCls : this.iconCls,
				width : 600,
				height : 400,
				animCollapse : false,
				border : false,
				hideMode : 'offsets',
				layout : 'fit',
				items : [ {
					xtype : 'htmleditor',
					id : 'notepad-editor',
					value : ''
				} ]
			});
		}
		return Window;
	}
});