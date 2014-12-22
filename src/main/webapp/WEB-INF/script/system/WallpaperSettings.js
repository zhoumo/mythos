Ext.define('WebOS.system.WallpaperSettings', {
	extend : 'Ext.window.Window',
	uses : [ 'Ext.tree.Panel', 'Ext.tree.View', 'Ext.form.field.Checkbox', 'Ext.layout.container.Anchor', 'Ext.layout.container.Border', 'WebOS.desktop.Wallpaper', 'WebOS.model.WallpaperModel' ],
	layout : 'anchor',
	title : '桌面背景设置',
	modal : true,
	width : 640,
	height : 380,
	border : false,
	initComponent : function() {
		var me = this;
		me.selected = me.desktop.getWallpaper();
		me.stretch = me.desktop.wallpaper.stretch;
		me.preview = Ext.create('widget.wallpaper');
		me.preview.setWallpaper(me.selected);
		me.tree = me.createTree();
		me.buttons = [ {
			text : '确定',
			handler : me.onOK,
			scope : me
		}, {
			text : '取消',
			handler : me.close,
			scope : me
		} ];
		me.items = [ {
			anchor : '0 -30',
			border : false,
			layout : 'border',
			items : [ me.tree, {
				xtype : 'panel',
				region : 'center',
				layout : 'fit',
				items : [ me.preview ]
			} ]
		}, {
			xtype : 'checkbox',
			boxLabel : '拉伸布满',
			checked : me.stretch,
			listeners : {
				change : function(comp) {
					me.stretch = comp.checked;
				}
			}
		} ];
		me.callParent();
	},
	createTree : function() {
		var me = this;
		function child(img) {
			return {
				img : img,
				text : me.getTextOfWallpaper(img),
				leaf : true
			};
		}
		var tree = new Ext.tree.Panel({
			rootVisible : false,
			lines : false,
			autoScroll : true,
			width : 150,
			region : 'west',
			split : true,
			minWidth : 100,
			listeners : {
				afterrender : {
					fn : this.setInitialSelection,
					delay : 100
				},
				select : this.onSelect,
				scope : this
			},
			store : new Ext.data.TreeStore({
				model : 'WebOS.model.WallpaperModel',
				root : {
					text : 'Wallpaper',
					expanded : true,
					children : [ {
						text : "无",
						leaf : true
					}, child('desktop1.jpg'), child('desktop2.jpg'), child('desktop3.jpg'), child('desktop4.jpg'), child('desktop5.jpg'), child('desktop6.jpg') ]
				}
			})
		});
		return tree;
	},
	getTextOfWallpaper : function(path) {
		var text = path, slash = path.lastIndexOf('/');
		if (slash >= 0) {
			text = text.substring(slash + 1);
		}
		var dot = text.lastIndexOf('.');
		text = Ext.String.capitalize(text.substring(0, dot));
		text = text.replace(/[-]/g, ' ');
		return text;
	},
	onOK : function() {
		var me = this;
		if (me.selected) {
			WebOS.util.Cookie.setCookie('SettingWallpaper', me.selected);
			me.desktop.setWallpaper(me.selected, me.stretch);
		}
		me.destroy();
	},
	onSelect : function(tree, record) {
		var me = this;
		if (record.data.img) {
			me.selected = 'images/desktop/wallpaper/' + record.data.img;
		} else {
			me.selected = Ext.BLANK_IMAGE_URL;
		}
		me.preview.setWallpaper(me.selected);
	},
	setInitialSelection : function() {
		var s = this.desktop.getWallpaper();
		if (s) {
			var path = '/Wallpaper/' + this.getTextOfWallpaper(s);
			this.tree.selectPath(path, 'text');
		}
	}
});