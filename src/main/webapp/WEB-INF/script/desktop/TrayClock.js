Ext.namespace("WebOS.desktop");
Ext.define('WebOS.desktop.TrayClock', {
	extend : 'Ext.toolbar.TextItem',
	alias : 'widget.trayclock',
	tooltip : {
		text : '时钟',
		align : 'bl-tl'
	},
	timeFormat : 'H:i',
	getWeek : function() {
		var d, day, x;
		x = new Array("星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六");
		d = new Date();
		day = d.getDay();
		return (x[day]);
	},
	initComponent : function() {
		var me = this;
		me.callParent();
	},
	afterRender : function() {
		var me = this;
		Ext.Function.defer(me.updateTime, 100, me);
		me.callParent();
	},
	onDestroy : function() {
		var me = this;
		if (me.timer) {
			window.clearTimeout(me.timer);
			me.timer = null;
		}
		me.callParent();
	},
	updateTime : function() {
		var me = this, time = me.getWeek() + '&nbsp;' + Ext.Date.format(new Date(), me.timeFormat), text = time;
		if (me.lastText != text) {
			me.setText(text);
			me.lastText = text;
		}
		me.timer = Ext.Function.defer(me.updateTime, 1000, me);
	}
});