var MercorModal = new Class({

	Implements : [Events, Options],
	
	options:{		
		'container': {
			'id': 'mercor-modal-container',
			'el': ''
		},
		'overlay': {
			'id': 'mercor-modal-overlay',
			'el': ''
		},
		'id': 'mercor-modal',
		'width' : 300,
		'height' : 300,
		'delay': 5000,
		'template':	'<div class="mercor-inner">'
			+'<div class="mercor-close" title="Close"></div>'
			+'<div class="mercor-header">{TITLE}</div>'
			+'<div class="mercor-body">{TEXT}</div>'
			+'<div class="mercor-footer">{TEXT}</div>'
		+'</div>',
		buttons : [],
		keys: {
			esc: function() { this.close(); }
		},
		fullScreen: 0
	},

	initialize: function(options){
		// set the options
		this.setOptions(options);
		// Inject the container to the document
		this._injectContainer();
		// Inject the overlay to the document
		this._injectOverlay();
	},

	_injectContainer: function(){
		this.container = $(this.options.container.id);
		if(this.container) return;
		this.container = new Element('div',{
			'id': this.options.container.id,
			'class': this.options.container.position
		}).inject(this.options.container.el || document.body,'bottom');
	},
	
	_injectOverlay: function(){
		this.overlay = $(this.options.overlay.id);
		if(this.overlay) return;
		alert(this.options.overlay.id);
		this.overlay = new Mask(this.options.overlay.el,{
			id: this.options.overlay.id
		});
	},
	
	_addEvents: function()
	{
		this.overlay.addEvent('click', function(event) {
			this.close();
			event.stop();
		}.bind(this));
	},

	_injectNode: function(options){
		var title = (options.title || '').toString();
		var text = (options.text || '').toString();
		this.node = new Element('div',{
			html:  this.options.node.template.replace('{TITLE}', title).replace('{TEXT}', text),
			'class': this.options.node.id + ' ' + (options.type || 'success')
		});
		this.node.setStyle('width', this.options.node.width);
		this.node.setStyle('opacity', 0);
		this.node.inject(this.container, 'top');
	},

	open: function(options){
		this.overlay.show();
		// Set the container position
		//this.container.set('class',this.options.container.position);
		// Inject the node
		//this._injectNode(options);
		// Get the button close element
		//this.buttonClose = this.node.getElement('.mercor-close');
		// Add events
		this._addEvents();
	},

	close: function(){
		this.overlay.hide();
		if(!this.node) return;
		this.node.destroy();
	}
});

MercorModal.Iframe = new Class({
	
	Extends: MercorModal,

	Implements : [Events, Options],
	
	options:{
		
	},
	
	initialize: function(options){
		// set the options
		this.parent(options);
	},
});

MercorModal.Image = new Class({
	
	Extends: MercorModal,

	Implements : [Events, Options],
	
	options:{
		
	},
	
	initialize: function(options){
		// set the options
		this.parent(options);
	},
});

MercorModal.Iframe = new Class({
	
	Extends: MercorModal,

	Implements : [Events, Options],
	
	options:{
		
	},
	
	initialize: function(options){
		// set the options
		this.parent(options);
	},
});

MercorModal.Request = new Class({
	
	Extends: MercorModal,

	Implements : [Events, Options],
	
	options:{
		
	},
	
	initialize: function(options){
		// set the options
		this.parent(options);
	},
});

MercorModal.HTML = new Class({
	
	Extends: MercorModal,

	Implements : [Events, Options],
	
	options:{
		
	},
	
	initialize: function(options){
		// set the options
		this.parent(options);
	},
});