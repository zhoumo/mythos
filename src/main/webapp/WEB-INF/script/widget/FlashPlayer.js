Ext.ux.FlashPlayer = Ext.extend(Ext.DataView, {
	urlField : null,
	initComponent : function() {
		this.tpl = new Ext.XTemplate("<object width=100% height=100%><param name=movie value=" + this.urlField + "><param name=quality value=high><embed src=" + this.urlField + " quality=high type=application/x-shockwave-flash width=100% height=100%></embed></object>");
		Ext.ux.FlashPlayer.superclass.initComponent.call(this);
	}
});