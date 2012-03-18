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
			'styles': {
				'position': 'absolute',
				'opacity': 0.6,
				'filter': 'alpha(opacity = 90)',
				'-ms-filter': 'progid:DXImageTransform.Microsoft.Alpha(Opacity=90)',
				'z-index': 999,
				'background': '#000'
			}
		},
		'spinner': {
			'message': 'Loading, Please wait.',
			'styles': {
				'position': 'absolute',
				'opacity': 0.9,
				'filter': 'alpha(opacity = 90)',
				'-ms-filter': 'progid:DXImageTransform.Microsoft.Alpha(Opacity=90)',
				'z-index': 999,
				'background': '#fff'
			}
		},
		'footer': {
			'styles': {
				'text-align': 'right'
			}
		},
		'fade': {
			'duration': 'short',
		    'transition': 'linear'
		},
		'id': 'mercor-modal',
		'styles': {
			'width' : 800,
			'height' : 500,
			'z-index' : 1000,
			'position' : 'fixed',
			'opacity': 0
		},
		'fullScreen': {
			'active': false,
			'styles': {
				'width' : null,
				'height' : null,
				'bottom' : 5,
				'left' : 5,
				'right' : 5,
				'top': 5,
				'opacity': 0
			}
		},
		'keyboard': {
			'active': true,
			'type': 'keydown',
			'keys': {
				'esc': function() {this.close();}
			}
		},
		onOpen: null,
		onClose: null,
		onFadeIn: null,
		onFadeOut: null,
		onRequest: null,
		onFailure: null,
		onSuccess: null,
		onComplete: null,
		'trigger': null,
		'draggable': true,
		'html' : 'Empty',
		'htmlError' : 'Oups, something wrong happened...',
		'title': 'Mercor Modal',
		'template':	'<div class="mercor-inner">'
			+'<div class="mercor-close" title="Close"></div>'
			+'<div class="mercor-header"></div>'
			+'<div class="mercor-body"></div>'
			+'<div class="mercor-footer"></div>'
		+'</div>',
		buttons : []
	},

	initialize: function(options){
		this.setOptions(options);
		this._injectContainer();
		this._injectOverlay();
		this.screen = document.body.getSize();
		if (this.options.trigger){
			var style = JSON.decode(this.options.trigger.get('modal-style'));
		}
		this.options.styles = (style && typeOf(style) == 'object')? Object.merge(this.options.styles, style):this.options.styles;
		this.top = (this.screen.y - this.options.styles.height) / 2;
		this.left = (this.screen.x - this.options.styles.width) / 2;
	},

	_injectContainer: function(){
		this.container = new Element('div',{
			'id': this.options.container.id,
			'class': this.options.container.position
		}).inject(this.options.container.el || document.body,'bottom');
	},
	
	_injectOverlay: function(){
		this.overlay = new Mask(this.options.overlay.el,{
			id: this.options.overlay.id,
			style: this.options.overlay.styles
		});
	},
	
	_injectNode: function(){
		this.node = new Element('div',{
			'id': this.options.id,
			'html': this.options.template,
			'styles' : this.options.styles
		});
		this.node.inject(this.container);	
	},
	
	_injectSpinner: function(){
		this.spinner = new Spinner(this.body, {
			message: this.options.spinner.message,
			style: this.options.spinner.styles
		});
		this.spinnerImage = this.spinner.getElement('.spinner-img');
		this.spinnerMessage = this.spinner.getElement('.spinner-msg');
	},
	
	_injectButtons : function() {
		Array.each(this.options.buttons, function(button, index){
			new Element( (button.element || 'button'), {
				'html' :  (button.html || 'button'),
				'styles': button.styles,
				'events':{
					'click': button.event.bind(this)
				}
			}).inject(this.footer);
		}.bind(this));
	},
	
	_drag: function(){
		new Drag(this.node,{
			'handle': this.header
		});
		this.header.setStyle('cursor','move');
	},
	
	_failure: function(){
		if (!this.spinner.isDisplayed()){
			this.spinner.show();
		}
		this.spinnerImage.setClass('.error-img');
		this.spinnerMessage.set('html', this.options.htmlError);
	},
	
	_addEvents: function()
	{
		var o = this;
		this.overlay.addEvent('click', function(event) {
			o.close();
			event.stop();
		});
		this.buttonClose.addEvent('click',function(event){
			o.close();
			event.stop();
		});
		
		if (this.options.keyboard.active){
			this.keyboard = new Keyboard({
			    defaultEventType: this.options.keyboard.type
			});
			Object.each(this.options.keyboard.keys, function(action, key){
				this.keyboard.addEvent(key,action.bind(this));
			}.bind(this));
			this.keyboard.activate();
		}
		/*
		this.resizeEvent = this.options.constrain ? function(e) {
			this._resize();
			}.bind(this) : function() {
			this._position();
			}.bind(this);
			window.addEvent('resize',this.resizeEvent);
			*/
	},
	
	_setupNode: function(){
		this.buttonClose = this.node.getElement('.mercor-close');
		this.header = this.node.getElement('.mercor-header');
		this.body = this.node.getElement('.mercor-body');
		this.footer = this.node.getElement('.mercor-footer');
		this.footer.setStyles(this.footer.style);	
		if (this.options.draggable && !this.options.fullScreen.active) this._drag();

		if (this.options.buttons.length > 0){
			this.body.setStyle('margin-bottom', 46);
			this._injectButtons();
		}
		else{
			this.footer.destroy();
			this.body.setStyle('margin-bottom', 5);
		}
		this.fade = new Fx.Morph(this.node, {
			duration: this.options.fade.duration,
			transition: this.options.fade.transition
		});
		this._setSizes();
	},
	
	_setSizes: function(){
		
		if (this.options.fullScreen.active){
			this.node.setStyles(this.options.fullScreen.styles);
			this._fadeInFullScreen();
		}
		else{
			this.node.setStyles({
				left : this.left
			});
			this._fadeIn();
		}
	},
	
	_fadeIn: function(){	
		this.fade.start({
		    'opacity': [0, 1],
		    'top': [this.top -50, this.top]
		});
		this.fireEvent('fadeIn');
	},
	
	_fadeInFullScreen: function(){	
		this.fade.start({
		    'opacity': [0, 1]
		});
		this.fireEvent('fadeIn');
	},
	
	_fadeOut: function(){	
		this.fade.start({
		    'opacity': [1,0],
		    'top': [this.top, this.top + 50]
		});
		this.fireEvent('fadeOut');
	},

	_fadeOutFullScreen: function(){	
		this.fade.start({
		    'opacity': [1,0]
		});
		this.fireEvent('fadeOut');
	},
	
	_loadBefore: function(){
		this.spinner.show();
	},

	_load: function(title, html){
		this.header.set('html',(title || this.options.title));
		this.body.set('html',(html || this.options.html));
		this.fireEvent('complete');
	},
	
	_loadAfter: function(){
		this.spinner.hide();
	},
		
	open: function(title, html){
		this.node = $(this.options.id);
		if(this.node) return;
		this.overlay.show();
		this._injectNode();
		this._setupNode();
		this._injectSpinner();
		this._addEvents();
		this._load(title, html);
		this.fireEvent('open');
	},

	close: function(){
		if (this.fade){
			this.fade.addEvent('onChainComplete',function(){
		    	this.overlay.hide();
				if(!this.node) return;
				this.node.destroy();
				this.container.destroy();
				this.overlay.destroy();
			}.bind(this));

			(this.options.fullScreen.active)? this._fadeOutFullScreen():this._fadeOut();
		}
		this.fireEvent('close');
	}
});

MercorModal.Confirm = new Class({
	
	Extends: MercorModal,

	Implements : [Events, Options],
	
	options:{
		'styles': {
			'width' : 230,
			'height' : 120
		},
		'confirm':{
			'callback': function(){alert('You clicked yes!');}
		},
		'title': 'Confirm',
		'html': 'Are you sure?',
		'buttons':[{ html: 'Yes', styles: {}, event: function() { this.options.confirm.callback(); this.close(); }},
		           { html: 'No', styles: {}, event: function() { this.close(); }}]
	},
	
	initialize: function(options){
		this.parent(options);
	}
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
		'iframe': {
			'styles': {
		        width: '100%',
		        height: '100%',
		        border: '0px'
			}
	    }
	},
	
	initialize: function(options){
		this.parent(options);
	},
	
	_load: function(title, link){
		this._loadBefore();
		this.header.set('html',(title || this.options.title));
		this.iframe = new IFrame({
		    src: (link || 'http://mercor.julienrenaux.fr/library.html'),
		    events: {
		    	load: function() {
		    		this._loadAfter();
		    		this.iframe.fade('in');
		    		this.fireEvent('complete');
		    	}.bind(this)
		    }
		});
		this.iframe.fade('hide');
		this.iframe.setStyles(this.options.iframe.styles);
		this.iframe.inject(this.body);
	}
});

MercorModal.Request = new Class({
	
	Extends: MercorModal,

	Implements : [Events, Options],
	
	options:{
		'request': {
			'type': 'html',
			'url': '',
			'method': 'get',
			'asynch': true,
			'data': ''
	    }
	},
	
	initialize: function(options){
		this.parent(options);
	},
	
	_load: function(title, url) {	
		var requestOptions = {
			url : (url || this.options.request.url),
			data : this.options.request.data,
			async : this.options.request.async,
			method : this.options.request.method,
			onRequest: function(){
				this._loadBefore();
				this.fireEvent('request');
			}.bind(this),
			onSuccess: function(responseText){
				this.body.set('text', responseText);
				this.fireEvent('success');
			}.bind(this),
			onFailure : function() {
				this._failure();
				this.fireEvent('failure');
			}.bind(this),
			onComplete : function(responseText) {
				this._loadAfter();
				this.fireEvent('complete');
			}.bind(this)
		};
		
		switch (options.type) {
		case 'html':
			var requestOptionsHTML = {
				update : container
			};
			// Request HTML
			this.request = new Request.HTML(Object.merge(requestOptions,requestOptionsHTML));
		break;
		
		case 'json':
			var requestOptionsJSON = {};
			// Request JSON
			this.request = new Request.JSON(Object.merge(requestOptions,requestOptionsJSON));
		break;

		default:
			var requestOptionsDefault = {
				onSuccess : function(responseText) {
					var content = options.onComplete(responseText);
					content.inject(container);
				}
			};
			// Request
			this.request = new Request(Object.merge(requestOptions,requestOptionsDefault));
		break;
		}
		this.request.send();
	}
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