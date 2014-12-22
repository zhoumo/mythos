Ext.namespace("WebOS.desktop");
Ext.define('WebOS.desktop.Desktop', {
	extend : 'Ext.panel.Panel',
	alias : 'widget.desktop',
	uses : [ 'Ext.util.MixedCollection', 'Ext.menu.Menu', 'Ext.view.View', 'Ext.window.Window', 'WebOS.desktop.TaskBar', 'WebOS.desktop.Wallpaper' ],
	activeWindowCls : 'ux-desktop-active-win',
	inactiveWindowCls : 'ux-desktop-inactive-win',
	lastActiveWindow : null,
	border : false,
	html : '&#160;',
	layout : 'fit',
	xTickSize : 1,
	yTickSize : 1,
	app : null,
	shortcuts : null,
	shortcutItemSelector : 'div.ux-desktop-shortcut',
	shortcutTpl : [ '<tpl for=".">', '<div class="ux-desktop-shortcut" id="shortcut-{module}">', '<div class="ux-desktop-shortcut-icon {iconCls}">', '<img src="', Ext.BLANK_IMAGE_URL, '" title="{name}">', '</div>', '<div class="ux-desktop-shortcut-text">', '<div  class="ux-desktop-shortcut-text-inner">{name}</div>', '</div>', '</div>', '</tpl>', '<div class="x-clear"></div>' ],
	taskbarConfig : null,
	windowMenu : null,
	initComponent : function() {
		var me = this;
		me.windowMenu = new Ext.menu.Menu(me.createWindowMenu());
		me.bbar = me.taskbar = new WebOS.desktop.TaskBar(me.taskbarConfig);
		me.taskbar.windowMenu = me.windowMenu;
		me.windows = new Ext.util.MixedCollection();
		me.contextMenu = new Ext.menu.Menu(me.createDesktopMenu());
		me.items = [ {
			xtype : 'wallpaper',
			id : me.id + '_wallpaper'
		}, me.createDataView() ];
		me.callParent();
		me.shortcutsView = me.items.getAt(1);
		me.shortcutsView.on('itemclick', me.onShortcutItemClick, me);
		var wallpaper = me.wallpaper;
		me.wallpaper = me.items.getAt(0);
		if (wallpaper) {
			me.setWallpaper(wallpaper, me.wallpaperStretch);
		}
	},
	afterRender : function() {
		var me = this;
		me.callParent();
		me.el.on('contextmenu', me.onDesktopMenu, me);
	},
	createDataView : function() {
		var me = this;
		return {
			xtype : 'dataview',
			maxWidth : 600,
			overItemCls : 'x-view-over',
			trackOver : true,
			itemSelector : me.shortcutItemSelector,
			store : me.shortcuts,
			style : {
				position : 'absolute'
			},
			x : 0,
			y : 0,
			tpl : new Ext.XTemplate(me.shortcutTpl)
		};
	},
	createDesktopMenu : function() {
		var me = this, ret = {
			items : me.contextMenuItems || []
		};
		if (ret.items.length) {
			ret.items.push('-');
		}
		ret.items.push({
			text : '显示桌面',
			iconCls : 'ux-desktopmenu-mymac',
			handler : me.showDesktop,
			scope : me
		}, '-', {
			text : '规则排列窗口',
			handler : me.tileWindows,
			scope : me,
			minWindows : 1
		}, {
			text : '固定大小排列窗口',
			handler : me.checkerboardWindows,
			scope : me,
			minWindows : 1
		}, {
			text : '按列平铺窗口',
			handler : me.snapFitWindows,
			scope : me,
			minWindows : 1
		}, {
			text : '按行平铺窗口',
			handler : me.snapFitVWindows,
			scope : me,
			minWindows : 1
		}, {
			text : '折叠窗口',
			handler : me.cascadeWindows,
			scope : me,
			minWindows : 1
		}, '-', {
			text : '关闭所有窗体',
			handler : me.closeAllWinows,
			iconCls : 'ux-desktopmenu-close',
			scope : me,
			minWindows : 1
		});
		return ret;
	},
	createWindowMenu : function() {
		var me = this;
		return {
			defaultAlign : 'br-tr',
			items : [ {
				text : '恢复',
				handler : me.onWindowMenuRestore,
				scope : me
			}, {
				text : '最小化',
				handler : me.onWindowMenuMinimize,
				scope : me
			}, {
				text : '最大化',
				handler : me.onWindowMenuMaximize,
				scope : me
			}, '-', {
				text : '关闭',
				handler : me.onWindowMenuClose,
				scope : me
			} ],
			listeners : {
				beforeshow : me.onWindowMenuBeforeShow,
				hide : me.onWindowMenuHide,
				scope : me
			}
		};
	},
	onDesktopMenu : function(e) {
		var me = this, menu = me.contextMenu;
		e.stopEvent();
		if (!menu.rendered) {
			menu.on('beforeshow', me.onDesktopMenuBeforeShow, me);
		}
		menu.showAt(e.getXY());
		menu.doConstrain();
	},
	onDesktopMenuBeforeShow : function(menu) {
		var me = this, count = me.windows.getCount();
		menu.items.each(function(item) {
			var min = item.minWindows || 0;
			item.setDisabled(count < min);
		});
	},
	onShortcutItemClick : function(dataView, record) {
		var me = this, module = me.app.getModule(record.data.module), win = module && module.createWindow();
		if (win) {
			me.restoreWindow(win);
		}
	},
	onWindowClose : function(win) {
		var me = this;
		me.windows.remove(win);
		me.taskbar.removeTaskButton(win.taskButton);
		me.updateActiveWindow();
	},
	onWindowMenuBeforeShow : function(menu) {
		var items = menu.items.items, win = menu.theWin;
		items[0].setDisabled(win.maximized !== true && win.hidden !== true);
		items[1].setDisabled(win.minimized === true);
		items[2].setDisabled(win.maximized === true || win.hidden === true);
	},
	onWindowMenuClose : function() {
		var me = this, win = me.windowMenu.theWin;
		win.close();
	},
	onWindowMenuHide : function(menu) {
		menu.theWin = null;
	},
	onWindowMenuMaximize : function() {
		var me = this, win = me.windowMenu.theWin;
		win.maximize();
		win.toFront();
	},
	onWindowMenuMinimize : function() {
		var me = this, win = me.windowMenu.theWin;
		win.minimize();
	},
	onWindowMenuRestore : function() {
		var me = this, win = me.windowMenu.theWin;
		me.restoreWindow(win);
	},
	getWallpaper : function() {
		return this.wallpaper.wallpaper;
	},
	setTickSize : function(xTickSize, yTickSize) {
		var me = this, xt = me.xTickSize = xTickSize, yt = me.yTickSize = (arguments.length > 1) ? yTickSize : xt;
		me.windows.each(function(win) {
			var dd = win.dd, resizer = win.resizer;
			dd.xTickSize = xt;
			dd.yTickSize = yt;
			resizer.widthIncrement = xt;
			resizer.heightIncrement = yt;
		});
	},
	setWallpaper : function(wallpaper, stretch) {
		this.wallpaper.setWallpaper(wallpaper, stretch);
		return this;
	},
	cascadeWindows : function() {
		var x = 0, y = 0, zmgr = this.getDesktopZIndexManager();
		if (zmgr) {
			zmgr.eachBottomUp(function(win) {
				if (win.isWindow && win.isVisible() && !win.maximized) {
					win.setPosition(x, y);
					x += 20;
					y += 20;
				}
			});
		}
	},
	createWindow : function(config, cls) {
		var me = this, winCount = me.windows.getCount();
		if (winCount >= 5) {
			Ext.MessageBox.show({
				title : '系统提示',
				msg : '为保证系统效率,只允许同时运行5个功能窗口.请关闭一些窗口后重试',
				buttons : Ext.MessageBox.OK,
				icon : Ext.MessageBox.WARNING
			});
			return;
		}
		var win, cfg = Ext.applyIf(config || {}, {
			stateful : false,
			isWindow : true,
			constrainHeader : true,
			minimizable : true,
			maximizable : true
		});
		cls = cls || Ext.window.Window;
		win = me.add(new cls(cfg));
		me.windows.add(win);
		win.taskButton = me.taskbar.addTaskButton(win);
		win.on({
			activate : me.updateActiveWindow,
			beforeshow : me.updateActiveWindow,
			deactivate : me.updateActiveWindow,
			minimize : me.minimizeWindow,
			destroy : me.onWindowClose,
			scope : me
		});
		win.on({
			boxready : function() {
				win.dd.xTickSize = me.xTickSize;
				win.dd.yTickSize = me.yTickSize;
				if (win.resizer) {
					win.resizer.widthIncrement = me.xTickSize;
					win.resizer.heightIncrement = me.yTickSize;
				}
			},
			single : true
		});
		win.doClose = function() {
			win.doClose = Ext.emptyFn;
			win.el.disableShadow();
			win.el.fadeOut({
				listeners : {
					afteranimate : function() {
						win.destroy();
					}
				}
			});
		};
		return win;
	},
	getActiveWindow : function() {
		var win = null, zmgr = this.getDesktopZIndexManager();
		if (zmgr) {
			zmgr.eachTopDown(function(comp) {
				if (comp.isWindow && !comp.hidden) {
					win = comp;
					return false;
				}
				return true;
			});
		}
		return win;
	},
	getDesktopZIndexManager : function() {
		var windows = this.windows;
		return (windows.getCount() && windows.getAt(0).zIndexManager) || null;
	},
	getWindow : function(id) {
		return this.windows.get(id);
	},
	minimizeWindow : function(win) {
		win.minimized = true;
		win.hide();
	},
	restoreWindow : function(win) {
		if (win.isVisible()) {
			win.restore();
			win.toFront();
		} else {
			win.show();
		}
		return win;
	},
	showDesktop : function() {
		var me = this;
		me.windows.each(function(win) {
			if (!win.minimized) {
				win.minimize();
			}
		});
	},
	closeAllWinows : function() {
		var me = this, winCount = me.windows.getCount();
		if (winCount < 1)
			return;
		me.windows.each(function(win) {
			win.close();
		});
	},
	snapFitVWindows : function() {
		var me = this;
		var availWidth = this.el.getWidth(true);
		var availHeight = this.el.getHeight(true) - 40;
		var x = 0, y = 0;
		var snapCount = 0;
		this.windows.each(function(win) {
			if (win.isVisible()) {
				snapCount++;
			}
		}, this);
		var snapSize = parseInt(availHeight / snapCount);
		if (snapSize > 0) {
			this.windows.each(function(win) {
				if (win.isVisible()) {
					win.setWidth(availWidth);
					win.setHeight(snapSize);
					win.setPosition(x, y);
					y += snapSize;
				}
			}, me);
		}
	},
	snapFitWindows : function() {
		var me = this;
		var availWidth = this.el.getWidth(true);
		var availHeight = this.el.getHeight(true) - 40;
		var x = 0, y = 0;
		var snapCount = 0;
		this.windows.each(function(win) {
			if (win.isVisible()) {
				snapCount++;
			}
		}, this);
		var snapSize = parseInt(availWidth / snapCount);
		if (snapSize > 0) {
			this.windows.each(function(win) {
				if (win.isVisible()) {
					win.setWidth(snapSize);
					win.setHeight(availHeight);
					win.setPosition(x, y);
					x += snapSize;
				}
			}, me);
		}
	},
	checkerboardWindows : function() {
		var me = this;
		var availWidth = this.el.getWidth(true);
		var availHeight = this.el.getHeight(true) - 40;
		var x = 0, y = 0;
		var lastx = 0, lasty = 0;
		var square = 400;
		this.windows.each(function(win) {
			if (win.isVisible()) {
				win.setWidth(square - 1);
				win.setHeight(square - 1);
				win.setPosition(x, y);
				x += square;
				if (x + square > availWidth) {
					x = lastx;
					y += square;
					if (y > availHeight) {
						lastx += 20;
						lasty += 20;
						x = lastx;
						y = lasty;
					}
				}
			}
		}, me);
	},
	tileWindows : function() {
		var me = this, availWidth = me.body.getWidth(true);
		var x = me.xTickSize, y = me.yTickSize, nextY = y;
		me.windows.each(function(win) {
			if (win.isVisible() && !win.maximized) {
				var w = win.el.getWidth();
				if (x > me.xTickSize && x + w > availWidth) {
					x = me.xTickSize;
					y = nextY;
				}
				win.setPosition(x, y);
				x += w + me.xTickSize;
				nextY = Math.max(nextY, y + win.el.getHeight() + me.yTickSize);
			}
		});
	},
	updateActiveWindow : function() {
		var me = this, activeWindow = me.getActiveWindow(), last = me.lastActiveWindow;
		if (activeWindow === last) {
			return;
		}
		if (last) {
			if (last.el.dom) {
				last.addCls(me.inactiveWindowCls);
				last.removeCls(me.activeWindowCls);
			}
			last.active = false;
		}
		me.lastActiveWindow = activeWindow;
		if (activeWindow) {
			activeWindow.addCls(me.activeWindowCls);
			activeWindow.removeCls(me.inactiveWindowCls);
			activeWindow.minimized = false;
			activeWindow.active = true;
		}
		me.taskbar.setActiveButton(activeWindow && activeWindow.taskButton);
	}
});