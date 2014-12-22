﻿Ext.namespace("WebOS.desktop");
Ext.define('WebOS.desktop.Module', {
	mixins : {
		observable : 'Ext.util.Observable'
	},
	constructor : function(config) {
		this.mixins.observable.constructor.call(this, config);
		this.init();
	},
	init : Ext.emptyFn
});