Ext.namespace("WebOS.desktop");
Ext.define('WebOS.desktop.StartMenu', {
	extend : 'Ext.panel.Panel',
	requires : [ 'Ext.menu.Menu', 'Ext.toolbar.Toolbar' ],
	ariaRole : 'menu',
	cls : 'x-menu ux-start-menu',
	defaultAlign : 'bl-tl',
	iconCls : 'user',
	floating : true,
	shadow : true,
	width : 320,
	initComponent : function() {
		var me = this, menu = me.menu;
		me.menu = new Ext.menu.Menu({
			cls : 'ux-start-menu-body',
			border : false,
			floating : false,
			items : menu
		});
		me.menu.layout.align = 'stretch';
		me.items = [ me.menu ];
		me.layout = 'fit';
		Ext.menu.Manager.register(me);
		me.callParent();
		me.toolbar = new Ext.toolbar.Toolbar(Ext.apply({
			dock : 'right',
			cls : 'ux-start-menu-toolbar',
			vertical : true,
			width : 100
		}, me.toolConfig));
		me.toolbar.layout.align = 'stretch';
		me.addDocked(me.toolbar);
		delete me.toolItems;
		me.on('deactivate', function() {
			me.hide();
		});
	},
	addMenuItem : function() {
		var cmp = this.menu;
		cmp.add.apply(cmp, arguments);
	},
	addToolItem : function() {
		var cmp = this.toolbar;
		cmp.add.apply(cmp, arguments);
	},
	showBy : function(cmp, pos, off) {
		var me = this;
		if (me.floating && cmp) {
			me.layout.autoSize = true;
			me.show();
			cmp = cmp.el || cmp;
			var xy = me.el.getAlignToXY(cmp, pos || me.defaultAlign, off);
			if (me.floatParent) {
				var r = me.floatParent.getTargetEl().getViewRegion();
				xy[0] -= r.x;
				xy[1] -= r.y;
			}
			me.showAt(xy);
			me.doConstrain();
		}
		return me;
	}
});