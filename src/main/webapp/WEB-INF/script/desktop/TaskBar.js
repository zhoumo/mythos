Ext.namespace("WebOS.desktop");
Ext.define('WebOS.desktop.TaskBar', {
	extend : 'Ext.toolbar.Toolbar',
	requires : [ 'Ext.button.Button', 'Ext.resizer.Splitter', 'Ext.menu.Menu', 'WebOS.desktop.StartMenu' ],
	alias : 'widget.taskbar',
	cls : 'ux-taskbar',
	height : 40,
	startBtnText : '开始',
	initComponent : function() {
		var me = this;
		me.startMenu = new WebOS.desktop.StartMenu(me.startConfig);
		me.quickStart = new Ext.toolbar.Toolbar(me.getQuickStart());
		me.windowBar = new Ext.toolbar.Toolbar(me.getWindowBarConfig());
		me.tray = new Ext.toolbar.Toolbar(me.getTrayConfig());
		me.items = [ {
			xtype : 'button',
			cls : 'ux-start-button',
			iconCls : 'ux-start-button-icon',
			scale : 'medium',
			menu : me.startMenu,
			menuAlign : 'bl-tl',
			margins : '2 2 2 2',
			text : me.startBtnText
		}, '-', me.quickStart, {
			xtype : 'splitter',
			html : '&#160;',
			height : 14,
			width : 2,
			cls : 'x-toolbar-separator x-toolbar-separator-horizontal'
		}, me.windowBar, '-', me.tray ];
		me.callParent();
	},
	afterLayout : function() {
		var me = this;
		me.callParent();
		me.windowBar.el.on('contextmenu', me.onButtonContextMenu, me);
	},
	getQuickStart : function() {
		var me = this, ret = {
			minWidth : 105,
			width : 105,
			items : [],
			enableOverflow : true
		};
		Ext.each(this.quickStart, function(item) {
			ret.items.push({
				tooltip : {
					text : item.name,
					align : 'bl-tl'
				},
				// tooltip: item.name,
				overflowText : item.name,
				scale : 'medium',
				iconCls : item.iconCls,
				handler : item.handler || me.onQuickStartClick,
				module : item.module,
				// handler: me.onQuickStartClick,
				scope : me
			});
		});
		return ret;
	},
	getTrayConfig : function() {
		var ret = {
			items : this.trayItems
		};
		delete this.trayItems;
		return ret;
	},
	getWindowBarConfig : function() {
		return {
			flex : 1,
			cls : 'ux-desktop-windowbar',
			items : [ '&#160;' ],
			layout : {
				overflowHandler : 'Scroller'
			}
		};
	},
	getWindowBtnFromEl : function(el) {
		var c = this.windowBar.getChildByElement(el);
		return c || null;
	},
	onQuickStartClick : function(btn) {
		var module = this.app.getModule(btn.module), window;
		if (module) {
			window = module.createWindow();
			window.show();
		}
	},
	onButtonContextMenu : function(e) {
		var me = this, t = e.getTarget(), btn = me.getWindowBtnFromEl(t);
		if (btn) {
			e.stopEvent();
			me.windowMenu.theWin = btn.win;
			me.windowMenu.showBy(t);
		}
	},
	onWindowBtnClick : function(btn) {
		var win = btn.win;
		if (win.minimized || win.hidden) {
			win.show();
		} else if (win.active) {
			win.minimize();
		} else {
			win.toFront();
		}
	},
	addTaskButton : function(win) {
		var config = {
			iconCls : win.iconCls,
			enableToggle : true,
			scale : 'medium',
			toggleGroup : 'all',
			width : 100,
			margins : '2 2 2 2',
			text : Ext.util.Format.ellipsis(win.title, 20),
			listeners : {
				click : this.onWindowBtnClick,
				scope : this
			},
			win : win
		};
		var cmp = this.windowBar.add(config);
		cmp.toggle(true);
		return cmp;
	},
	removeTaskButton : function(btn) {
		var found = null, me = this;
		me.windowBar.items.each(function(item) {
			if (item === btn) {
				found = item;
			}
			return !found;
		});
		if (found) {
			me.windowBar.remove(found);
		}
		return found;
	},
	setActiveButton : function(btn) {
		if (btn) {
			btn.toggle(true);
		} else {
			this.windowBar.items.each(function(item) {
				if (item.isButton) {
					item.toggle(false);
				}
			});
		}
	}
});