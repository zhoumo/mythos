Ext.define('WebOS.widget.PopupWindow', {
	extend : 'Ext.window.Window',
	width : 250,
	height : 150,
	plain : true,
	closable : false,
	constrain : true,
	iconCls : 'new',
	draggable : false,
	resizable : false,
	shadow : false,
	autoHide : 3,
	closeAction : 'destroy',
	x : 0,
	y : 0,
	initComponent : function() {
		if (this.width) {
			this.x = document.body.clientWidth - this.width;
		}
		if (this.height) {
			this.y = document.body.clientHeight - this.height - 41;
		}
		if (false !== this.autoHide) {
			var task = new Ext.util.DelayedTask(this.destroy, this);
			var second = (parseInt(this.autoHide) || 3) * 1000;
			this.on('beforeshow', function(self) {
				task.delay(second);
			});
		}
		;
		this.on('beforedestroy', function() {
			this.getEl().slideOut("b", {
				scope : this,
				callback : function() {
					this.fireEvent('destroy', this);
				}
			});
			return false;
		}, this);
		this.callParent(arguments);
	}
});