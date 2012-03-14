var MercorModal = new Class({

	Implements : [Events, Options],
	
	options:{		
		'container': {
			'id': 'mercor-modal-container',
			'el': ''
		},
		'overlay': {
			'id': 'mercor-modal-overlay',
			'el': '',
			'style': {
				'position': 'absolute',
				'opacity': 0.6,
				'filter': 'alpha(opacity = 90)',
				'-ms-filter': 'progid:DXImageTransform.Microsoft.Alpha(Opacity=90)',
				'z-index': 999,
				'background': '#000'
			}
		},
		'id': 'mercor-modal',
		'style': {
			'width' : 800,
			'height' : 500,
			'z-index' : 1000,
			position : 'fixed'
		},
		'duration': 'short',
	    'transition': 'linear',
		'text' : 'No data',
		'title': 'No title',
		'template':	'<div class="mercor-inner">'
			+'<div class="mercor-close" title="Close"></div>'
			+'<div class="mercor-header">{TITLE}</div>'
			+'<div class="mercor-body"></div>'
			+'<div class="mercor-footer"></div>'
		+'</div>',
		buttons : [],
		keys: {
			esc: function() { this.close(); }
		},
		fullScreen: 0
	},
	
	/**
	 * The Close button element
	 */
	buttonClose: null,

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
		this.overlay = new Mask(this.options.overlay.el,{
			id: this.options.overlay.id,
			style: this.options.overlay.style
		});
	},
	
	_addEvents: function()
	{
		this.overlay.addEvent('click', function(event) {
			this.close();
			event.stop();
		}.bind(this));
		
		var o = this;
		// Add the delete event
		this.buttonClose.addEvent('click',function(event){
			o.close();
			event.stop();
		});
	},

	_injectNode: function(options){
		var template = this.options.template;
		this.node = new Element('div',{
			'id': this.options.id,
			'html': template.replace('{TITLE}', this.options.title),
			'styles' : this.options.style
		});
		//this.node.setStyle('width', this.options.width);
		//this.node.setStyle('opacity', 0);
		this.node.inject(this.container);
		var screen = document.body.getSize();

		var myFx = new Fx.Tween(this.node, {
		    duration: 'short',
		    transition: 'linear',
		    property: 'top'
		});
		
		this.node.setStyles({
			left : (screen.x - this.options.style.width) / 2
		});
		
		myFx.start(-9999, ((screen.y - this.options.style.height) / 2));
		
		
		/*
		*/
		
	},
	
	_load: function(){
		var text = this.options.text;
		this.body.set('html',text);
	},

	open: function(options){
		this.overlay.show();
		// Set the container position
		//this.container.set('class',this.options.container.position);
		// Inject the node
		this._injectNode(options);
		
		// Get the button close element
		this.buttonClose = this.node.getElement('.mercor-close');
		
		// Get the button close element
		this.body = this.node.getElement('.mercor-body');
		
		this._load();
		// Get the button close element
		//this.buttonClose = this.node.getElement('.mercor-close');
		// Add events
		this._addEvents();
	},

	close: function(){
		var screen = document.body.getSize();

		var myFx = new Fx.Tween(this.node, {
		    duration: 'short',
		    transition: 'linear',
		    property: 'top',
		    onChainComplete : function(){
		    	this.overlay.hide();
				if(!this.node) return;
				this.node.destroy();
			}.bind(this)
		});
		myFx.start(((screen.y - this.options.style.height) / 2), 9999);
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