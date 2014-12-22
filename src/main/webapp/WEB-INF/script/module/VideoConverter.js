Ext.define('WebOS.module.VideoConverter', {
	extend : 'WebOS.desktop.Module',
	init : function() {
	},
	createWindow : function() {
		var Desktop = this.app.getDesktop();
		var Window = Desktop.getWindow(this.module);
		if (!Window) {
			var panel = new Ext.Panel({
				layout : 'fit',
				width : 560
			});
			var store = Ext.create('Ext.data.ArrayStore', {
				autoDestroy : true,
				fields : [ 'type' ],
				data : [ [ "FLV" ], [ "MP4" ] ]
			});
			var bg_style = "background:#DFE9F6";
			var settings = null;
			settings = new Ext.FormPanel({
				title : '配置参数',
				fileUpload : true,
				width : 225,
				frame : true,
				fieldDefaults : {
					labelStyle : 'font-weight: bold;text-align:right',
					labelWidth : 50
				},
				defaultType : 'textfield',
				items : [ {
					xtype : 'fileuploadfield',
					id : 'file',
					fieldLabel : '文件',
					name : 'file',
					buttonText : '浏览',
					allowBlank : false,
					blankText : '必填'
				}, {
					fieldLabel : '类型',
					xtype : 'combobox',
					store : store,
					displayField : 'type',
					valueField : 'type',
					id : 'type',
					name : 'type',
					value : 'FLV',
					editable : false,
					forceSelection : true,
					allowBlank : false
				}, {
					xtype : 'radiogroup',
					fieldLabel : '尺寸',
					id : 'size',
					name : 'size',
					items : [ {
						boxLabel : '640*360',
						name : 'size',
						inputValue : '640*360',
						checked : true
					}, {
						boxLabel : '640*480',
						name : 'size',
						inputValue : '640*480'
					} ]
				}, {
					anchor : '100%',
					layout : 'column',
					border : false,
					bodyStyle : bg_style,
					xtype : 'panel',
					items : [ {
						xtype : 'panel',
						columnWidth : .6,
						bodyStyle : bg_style,
						border : false,
						items : {
							xtype : 'checkboxgroup',
							fieldLabel : '&nbsp;',
							labelSeparator : "",
							items : [ {
								boxLabel : '自定义',
								listeners : {
									change : function(checkbox, checked) {
										if (checked) {
											Ext.getCmp("size").disable();
											Ext.getCmp("customSize").enable();
											Ext.getCmp("customSize").setValue("600*480");
										} else {
											Ext.getCmp("size").enable();
											Ext.getCmp("customSize").disable();
											Ext.getCmp("customSize").setValue("");
										}
									}
								}
							} ]
						}
					}, {
						xtype : 'panel',
						columnWidth : .4,
						bodyStyle : bg_style,
						border : false,
						items : {
							xtype : 'textfield',
							allowBlank : false,
							width : 75,
							disabled : true,
							name : 'customSize',
							id : 'customSize',
							regex : /^(\d+)\*(\d+)$/,
							regexText : "格式: 宽*高"
						}
					} ]
				}, {
					id : 'bitRate',
					xtype : 'numberfield',
					fieldLabel : '比特率',
					name : 'bitRate',
					allowBlank : false,
					blankText : '必填',
					value : 350
				} ],
				buttons : [ {
					id : 'upload',
					text : '转换',
					maxWidth : 55,
					handler : function() {
						if (settings.getForm().isValid()) {
							var progress = Ext.Msg.wait('正在处理中...', '等待', {
								text : '',
								interval : 1000,
								scope : this
							});
							panel.remove("flash_player", true);
							settings.getForm().submit({
								url : 'convert.do',
								method : 'post',
								success : function(form, action) {
									var obj = Ext.JSON.decode(action.response.responseText);
									var flash = new Ext.ux.FlashPlayer({
										id : 'flash_player',
										urlField : 'flash/player.swf?vcastr_file=' + obj.message.filePath
									});
									panel.add(flash);
									progress.hide();
									Ext.getCmp("download").enable();
									Ext.getCmp("download").getEl().dom.tag = obj.message.filePath;
								},
								failure : function(form, action) {
									Ext.Msg.alert('提示', '视频转换失败！');
								}
							});
						}
					}
				}, {
					id : 'download',
					text : '下载',
					maxWidth : 55,
					disabled : true,
					handler : function() {
						window.location.href = this.getEl().dom.tag;
					}
				} ]
			});
			Window = Desktop.createWindow({
				id : this.module,
				title : this.text,
				iconCls : this.iconCls,
				width : 800,
				height : 500,
				layout : {
					type : 'hbox',
					align : 'stretch',
					defaultMargins : {
						top : 1,
						right : 1,
						bottom : 1,
						left : 1
					},
					padding : 0
				},
				items : [ panel, settings ]
			});
		}
		return Window;
	}
});