Ext.namespace("WebOS.desktop");
Ext.define('WebOS.desktop.Application', {
	mixins : {
		observable : 'Ext.util.Observable'
	},
	requires : [ 'Ext.container.Viewport', 'WebOS.desktop.Desktop' ],
	isReady : false,
	modules : null,
	useQuickTips : true,
	constructor : function(config) {
		var me = this;
		me.addEvents('ready', 'beforeunload');
		me.mixins.observable.constructor.call(this, config);
		if (Ext.isReady) {
			Ext.Function.defer(me.init, 10, me);
		} else {
			Ext.onReady(me.init, me);
		}
	},
	init : function() {
		var me = this, desktopCfg;
		if (me.useQuickTips) {
			Ext.QuickTips.init();
		}
		me.modules = me.getModules();
		if (me.modules) {
			me.initModules(me.modules);
		}
		desktopCfg = me.getDesktopConfig();
		me.desktop = new WebOS.desktop.Desktop(desktopCfg);
		me.viewport = new Ext.container.Viewport({
			layout : 'fit',
			items : [ me.desktop ]
		});
		Ext.EventManager.on(window, 'beforeunload', me.onUnload, me);
		me.isReady = true;
		me.fireEvent('ready', me);
	},
	getDesktopConfig : function() {
		var me = this, cfg = {
			app : me,
			taskbarConfig : me.getTaskbarConfig()
		};
		Ext.apply(cfg, me.desktopConfig);
		return cfg;
	},
	getModules : Ext.emptyFn,
	getStartConfig : function() {
		var me = this, cfg = {
			app : me,
			menu : []
		}, launcher;
		Ext.apply(cfg, me.startConfig);
		Ext.each(me.modules, function(module) {
			launcher = module.launcher;
			if (launcher) {
				launcher.handler = launcher.handler || Ext.bind(me.createWindow, me, [ module ]);
				cfg.menu.push(module.launcher);
			}
		});
		return cfg;
	},
	createWindow : function(module) {
		var window = module.createWindow();
		window.show();
	},
	getTaskbarConfig : function() {
		var me = this, cfg = {
			app : me,
			startConfig : me.getStartConfig()
		};
		Ext.apply(cfg, me.taskbarConfig);
		return cfg;
	},
	initModules : function(modules) {
		var me = this;
		var tempModules = [];
		Ext.each(modules, function(module) {
			module.app = me;
			if (!Ext.isEmpty(module.launcher)) {
				module.launcher.app = me;
				if (!Ext.isEmpty(module.launcher.menu)) {
					Ext.each(module.launcher.menu, function(subModule) {
						subModule.app = me;
						tempModules.push(subModule);
					});
				}
			}
			tempModules.push(module);
		});
		me.modules = tempModules;
	},
	getModule : function(name) {
		var ms = this.modules;
		for ( var i = 0, len = ms.length; i < len; i++) {
			var m = ms[i];
			if (m.id == name || m.module == name || m.appType == name) {
				return m;
			}
		}
		return null;
	},
	onReady : function(fn, scope) {
		if (this.isReady) {
			fn.call(scope, this);
		} else {
			this.on({
				ready : fn,
				scope : scope,
				single : true
			});
		}
	},
	getDesktop : function() {
		return this.desktop;
	},
	onUnload : function(e) {
		if (this.fireEvent('beforeunload', this) === false) {
			e.stopEvent();
		}
	}
});