Ext.define('Mythos.Application', {
	extend : 'WebOS.desktop.Application',
	startmenuUrl : null,
	shortcutsUrl : null,
	logoutUrl : null,
	loginUrl : null,
	init : function() {
		this.callParent();
	},
	moduleConfig : function(module) {
		return {
			text : module.name,
			iconCls : module.iconCls,
			module : module.id,
			launcher : {
				text : module.name,
				iconCls : module.iconCls,
				module : module.id
			}
		};
	},
	getModules : function() {
		var me = this;
		var menuArray = [];
		Ext.Ajax.request({
			url : me.startmenuUrl,
			async : false,
			success : function(response) {
				var result = Ext.JSON.decode(response.responseText);
				Ext.each(result.module, function(module) {
					var menuModule = me.moduleConfig(module);
					if (module.component) {
						menuModule = Ext.create(module.component, menuModule);
					} else {
						menuModule.launcher.handler = function() {
							return false;
						};
						menuModule.launcher.menu = [];
					}
					Ext.each(module.module, function(childModule) {
						var module = Ext.create(childModule.component, me.moduleConfig(childModule));
						menuModule.launcher.menu.push({
							text : module.text,
							iconCls : module.iconCls,
							module : module.module,
							handler : module.createWindow,
							createWindow : module.createWindow
						});
					});
					if (module.module.length == 0) {
						delete menuModule.launcher.menu;
					} else {
					}
					menuArray.push(menuModule);
				});
			}
		});
		return menuArray;
	},
	getDesktopConfig : function() {
		var me = this, ret = me.callParent();
		return Ext.apply(ret, {
			contextMenuItems : [ {
				text : '桌面背景',
				iconCls : 'ux-desktopmenu-wallpaper',
				handler : me.onWallpaperSettings,
				scope : me
			} ],
			shortcuts : Ext.create('Ext.data.Store', {
				autoLoad : true,
				model : 'WebOS.model.ShortcutModel',
				proxy : {
					type : 'ajax',
					url : me.shortcutsUrl,
					reader : {
						type : 'json',
						root : ''
					}
				}
			}),
			wallpaper : me.getSettingWallpaper(),
			wallpaperStretch : true
		});
	},
	getSettingWallpaper : function() {
		var def = 'images/desktop/wallpaper/desktop1.jpg';
		var cookieWall = WebOS.util.Cookie.getCookie('SettingWallpaper');
		if (cookieWall != null)
			def = cookieWall;
		return def;
	},
	getStartConfig : function() {
		var me = this, ret = me.callParent();
		return Ext.apply(ret, {
			title : '开始菜单',
			height : 400,
			toolConfig : {
				width : 130,
				items : [ {
					text : '快捷方式',
					iconCls : 'ux-start-menu-shortcut',
					scale : 'medium',
					handler : me.onShortcutSettings,
					scope : me
				}, {
					text : '桌面背景',
					iconCls : 'ux-start-menu-wallpaper',
					scale : 'medium',
					handler : me.onWallpaperSettings,
					scope : me
				}, {
					text : '系统帮助',
					scale : 'medium',
					iconCls : 'ux-start-menu-help',
					scope : me
				}, '-', {
					text : '退出系统',
					scale : 'medium',
					iconCls : 'ux-start-menu-logout',
					handler : me.onLogout,
					scope : me
				} ]
			}
		});
	},
	getTaskbarConfig : function() {
		var ret = this.callParent();
		return Ext.apply(ret, {
			quickStart : [ {
				name : '显示桌面',
				iconCls : 'ux-quickstart-mymac',
				handler : function() {
					this.app.getDesktop().showDesktop();
				}
			}, {
				name : '折叠窗口',
				iconCls : 'ux-quickstart-cascade',
				handler : function() {
					this.app.getDesktop().cascadeWindows();
				}
			}, {
				name : '关闭所有窗体',
				iconCls : 'ux-quickstart-close',
				handler : function() {
					this.app.getDesktop().closeAllWinows();
				}
			} ],
			trayItems : [ {
				scale : 'medium',
				id : 'btn_taskbar_message',
				iconCls : "ux-traynotify-message",
				handler : function() {
					Ext.create('WebOS.widget.PopupWindow', {
						title : '提示窗口',
						html : '测试信息'
					}).show();
				}
			}, {
				scale : 'medium',
				iconCls : "ux-traynotify-clock",
				enableToggle : true,
				pressed : true,
				toggleHandler : function(btn, state) {
					var el = Ext.get("clock");
					if (state) {
						el.slideIn("r", {});
					} else {
						el.ghost("r", {});
					}
				}
			}, '-', {
				xtype : 'trayclock',
				flex : 1
			} ]
		});
	},
	onShortcutSettings : function() {
		var win = new WebOS.system.ShortcutSettings({
			desktop : this.getDesktop(),
			moduleUrl : 'moduleList',
			shortcutUrl : 'shortcuts'
		});
		win.show();
	},
	onWallpaperSettings : function() {
		var win = new WebOS.system.WallpaperSettings({
			desktop : this.desktop
		});
		win.show();
	},
	onLogout : function() {
		Ext.MessageBox.confirm('操作确认', '确定要注销当前用户吗?', function(button) {
			if (button == 'yes') {
				window.location.href = "logout.do";
			}
		}, this);
	}
});