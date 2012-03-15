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
		keys: {
			esc: function() { this.close(); }
		},
		fullScreen: 0
	},
	
	/**
	 * The Close button element
	 */
	buttonClose: null,
	buttons : [],

	initialize: function(options){
		// set the options
		this.setOptions(options);
		// Inject the container to the document
		this._injectContainer();
		// Inject the overlay to the document
		this._injectOverlay();

		this.screen = document.body.getSize();
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
		this.keyEvent = function(e){
			if(this.options.keys[e.key]) this.options.keys[e.key].call(this);
			}.bind(this);
			this.node.addEvent('keyup',this.keyEvent);
	},

	_injectNode: function(options){
		var template = this.options.template;
		this.node = new Element('div',{
			'id': this.options.id,
			'html': template.replace('{TITLE}', this.options.title),
			'styles' : this.options.style
		});
		this.node.inject(this.container);
		this._setSizes();
	},
	
	_setSizes: function(){
		var myFx = new Fx.Tween(this.node, {
		    duration: 'short',
		    transition: 'linear',
		    property: 'top'
		});
		
		this.node.setStyles({
			left : (this.screen.x - this.options.style.width) / 2
		});
		
		myFx.start(-9999, ((this.screen.y - this.options.style.height) / 2));
	},
	
	_load: function(){
		var text = this.options.text;
		this.body.set('html',text);
	},
	
	_loadButtons : function() {	
		
			this.buttons.each(function(el) {
				el.inject(this.footer);
			}.bind(this));
			
			return;
		},

	open: function(options){
		this.overlay.show();
		// Set the container position
		//this.container.set('class',this.options.container.position);
		// Inject the node
		this._injectNode(options);
		
		// Get the button close element
		this.buttonClose = this.node.getElement('.mercor-close');
		
		// Get the body element
		this.body = this.node.getElement('.mercor-body');
		
		// Get the footer element
		this.footer = this.node.getElement('.mercor-footer');
		
		

		if (this.buttons.length > 0)
		{
			this.body.setStyle('margin-bottom', 46);
			this._loadButtons();
		}
		else
		{
			this.footer.destroy();
			this.body.setStyle('margin-bottom', 5);
		}
		
		this._load();
		
		
		// Add events
		this._addEvents();
	},

	addButton : function(el, text, id, classe, clickEvent) {
		var button = new Element(el, {
			"html" : text,
			"class" : classe,
			"events" : {
				click : clickEvent
			}
		});

		this.buttons.push(button);
		return button;
	},

	close: function(){
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
		myFx.start(((this.screen.y - this.options.style.height) / 2), 9999);
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