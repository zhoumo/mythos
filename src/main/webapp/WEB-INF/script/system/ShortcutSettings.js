Ext.define('WebOS.system.ShortcutSettings', {
	extend : 'Ext.window.Window',
	title : '快捷方式设置',
	modal : true,
	width : 900,
	height : 500,
	desktop : null,
	moduleUrl : null,
	shortcutUrl : null,
	layout : {
		type : 'border'
	},
	initComponent : function() {
		var me = this;
		me.leftStore = Ext.create('Ext.data.Store', {
			autoLoad : true,
			model : 'WebOS.model.ShortcutModel',
			proxy : {
				type : 'ajax',
				url : me.moduleUrl,
				reader : {
					type : 'json',
					root : ''
				}
			}
		});
		me.rightStore = Ext.create('Ext.data.Store', {
			autoLoad : true,
			model : 'WebOS.model.ShortcutModel',
			proxy : {
				type : 'ajax',
				url : me.shortcutUrl,
				reader : {
					type : 'json',
					root : ''
				}
			}
		});
		me.left = Ext.create('Ext.panel.Panel', {
			title : '功能模块',
			region : 'west',
			split : true,
			layout : 'fit',
			plain : true,
			frame : true,
			width : 200,
			autoScroll : true,
			items : [ {
				xtype : 'dataview',
				listeners : {
					itemdblclick : me.moduleItemdblclick,
					scope : me
				},
				itemSelector : 'div.ux-div-row',
				store : me.leftStore,
				tpl : new Ext.XTemplate(me.ModuleTpl)
			} ]
		});
		me.center = Ext.create('Ext.panel.Panel', {
			title : '我的快捷方式',
			region : 'center',
			layout : 'fit',
			plain : true,
			frame : true,
			autoScroll : true,
			items : [ {
				xtype : 'dataview',
				overItemCls : 'x-view-over',
				listeners : {
					itemdblclick : me.shortcutItemdblclick,
					scope : me
				},
				itemSelector : 'div.ux-desktop-shortcut',
				store : me.rightStore,
				tpl : new Ext.XTemplate(me.ShortcutTpl)
			} ]
		});
		me.items = [ me.left, me.center ], me.buttons = [ {
			text : '确定',
			handler : function() {
				me.desktop.shortcuts.load();
				me.close();
			},
			scope : me
		}, {
			text : '取消',
			handler : me.close,
			scope : me
		} ];
		me.callParent();
	},
	ModuleTpl : [ '<div class="ux-div-table"><tpl for="."><div class="ux-div-row"><div class="ux-div-row-icon {iconCls}"></div><div class="ux-div-row-text">{name}</div></div></tpl></div>' ],
	ShortcutTpl : [ '<tpl for="."><div class="ux-desktop-shortcut" id="shortcut-{id}"><div class="ux-desktop-shortcut-icon {iconCls}"></div><div class="ux-desktop-shortcut-text"><div class="ux-desktop-shortcut-text-inner">{name}</div></div></div></tpl>' ],
	moduleItemdblclick : function(dataView, record) {
		var me = this;
		Ext.Ajax.request({
			url : 'addShortcut',
			async : false,
			params : {
				'module' : record.data.id,
				'name' : record.data.name,
				'iconCls' : record.data.iconCls.replace("startmenu", "shortcut")
			},
			callback : function(options, success, response) {
				if (success) {
					me.leftStore.load();
					me.rightStore.load();
				} else {
					Ext.MessageBox.show({
						title : '连接错误',
						msg : '向服务器发送请求失败，请重试！',
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
					});
				}
			}
		});
	},
	shortcutItemdblclick : function(dataView, record) {
		var me = this;
		Ext.Ajax.request({
			url : 'deleteShortcut',
			async : false,
			params : {
				'module' : record.data.module,
			},
			callback : function(options, success, response) {
				if (success) {
					me.leftStore.load();
					me.rightStore.load();
				} else {
					Ext.MessageBox.show({
						title : '连接错误',
						msg : '向服务器发送请求失败，请重试！',
						buttons : Ext.MessageBox.OK,
						icon : Ext.MessageBox.ERROR
					});
				}
			}
		});
	}
});