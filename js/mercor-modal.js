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
			'classes': 'mercor-spinner',
			'message': 'Loading, please wait.',
			'styles': {
				'position': 'absolute',
				'opacity': 0.9,
				'filter': 'alpha(opacity = 90)',
				'-ms-filter': 'progid:DXImageTransform.Microsoft.Alpha(Opacity=90)',
				'z-index': 999,
				'background': '#fff'
			}
		},
		'content': {
			'styles': {}
		},
		'footer': {
			'styles': {
				'text-align': 'left'
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
		'type':'', // can be iframe,confirm,request,requestHTML or null
		'trigger': null,
		'draggable': true,
		'html' : 'Empty',
		'htmlError' : 'Something wrong happened.',
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
			'class': this.options.spinner.classes,
			message: this.options.spinner.message,
			style: this.options.spinner.styles,
			fxOptions:{
				duration: 500
			}
		});
		this.spinnerImage = this.node.getElement('.spinner-img');
		this.spinnerMessage = this.node.getElement('.spinner-msg');
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
		this.spinner.show();
		this.spinnerImage.set('class','error-img');
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
		//TODO handle resize event
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
		this.content = new Element('div', {
			'styles': this.options.content.styles
		});
		this.footer.setStyles(this.options.footer.styles);	
		if (this.options.draggable && !this.options.fullScreen.active) this._drag();

		// TODO Find another way to handle footer
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
		}
		else{
			this.node.setStyles({left : this.left});
		}
		this._fadeIn();
	},
	
	_fadeIn: function(){
		if (this.options.fullScreen.active){
			this.fade.start({'opacity': [0, 1]});
		}
		else {
			this.fade.start({
			    'opacity': [0, 1],
			    'top': [this.top -50, this.top]
			});
		}
		this.fireEvent('fadeIn');
	},
	
	_fadeOut: function(){
		var position = this.node.getPosition();
		if (this.options.fullScreen.active){
			this.fade.start({'opacity': [1,0]});
		}
		else{
			this.fade.start({
			    'opacity': [1,0],
			    'top': [position.y, position.y + 50]
			});
		}
		this.fireEvent('fadeOut');
	},
	
	_loadStart: function(){
		this.content.fade('hide');
		this.spinner.show();
	},

	_load: function(){
		this.header.set('html',this.options.title);
		this.content.set('html',this.options.html);
		this.content.inject(this.body);
		this.fireEvent('complete');
	},
	
	_loadStop: function(){
		this.spinner.hide();
		var fade = function(){
			this.content.fade('in');
		}.bind(this);
		fade.delay(500);
	},
		
	open: function(){
		this.node = $(this.options.id);
		if(this.node) return;
		this.overlay.show();
		this._injectNode();
		this._setupNode();
		this._injectSpinner();
		this._addEvents();
		this._load();
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
			this._fadeOut();
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

MercorModal.Iframe = new Class({
	
	Extends: MercorModal,

	Implements : [Events, Options],
	
	options:{
		'iframe': {
			'link': 'http://mercor.julienrenaux.fr/library.html',
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
	
	_setupNode: function(){
		this.parent();
		this.content = new IFrame({
		    events: {
		    	load: function() {
		    		this._loadStop();
		    		this.content.fade('in');
		    		this.fireEvent('complete');
		    	}.bind(this)
		    }
		});
	},
	
	_load: function(){
		this._loadStart();
		this.header.set('html',this.options.title);
		this.content.set('src',this.options.iframe.link);
		this.content.setStyles(this.options.iframe.styles);
		this.content.inject(this.body);
	}
});

MercorModal.Request = new Class({
	
	Extends: MercorModal,

	Implements : [Events, Options],
	
	options:{
		'request': {
			'type': null,
			'url': '',
			'method': 'get',
			'asynch': true,
			'data': '',
			'success': function(responseText, body){body.set('text', responseText);}
	    }
	},
	
	initialize: function(options){
		this.parent(options);
	},
	
	_load: function() {
		this.header.set('html',this.options.title);
		var requestOptions = {
			url : this.options.request.url,
			data : this.options.request.data,
			async : this.options.request.async,
			method : this.options.request.method,
			onRequest: function(){
				this._loadStart();
				this.fireEvent('request');
			}.bind(this),
			onSuccess: function(responseText){
				this.options.request.success(responseText).inject(this.content);
				this.fireEvent('success');
			}.bind(this),
			onFailure: function() {
				this._failure();
				this.fireEvent('failure');
			}.bind(this),
			onComplete: function() {
				this.content.inject(this.body);
				this._loadStop();
				this.fireEvent('complete');
			}.bind(this)
		};
		switch (this.options.request.type) {
		case 'html':
			var requestOptionsHTML = {
				update : this.content,
				onSuccess: function(responseTree, responseElements, responseHTML, responseJavaScript){
					this.fireEvent('success');
				}.bind(this)
			};
			this.request = new Request.HTML(Object.merge(requestOptions,requestOptionsHTML));
		break;

		default:
			this.request = new Request(requestOptions);
		break;
		}
		this.request.send();
	}

});
window.addEvent('domready',function(){
	$$('[mercor-modal-options]').each(function(button){
		var options = JSON.decode(button.get('mercor-modal-options'));
		button.removeProperty('mercor-modal-options');
		button.addEvent('click',function(e){
			switch (options.type) {
				case 'iframe':
					var modal = new MercorModal.Iframe(options);
					break;
				case 'confirm':
					var modal = new MercorModal.Confirm(options);
					break;
				case 'request':
					var modal = new MercorModal.Request(options);
					break;
				case 'requestHTML':
					var requestType = {'request':{'type':'html'}};
					var modal = new MercorModal.Request(Object.merge(options, requestType));
					break;
				default:
					var modal = new MercorModal(options);
				break;
			}
			modal.open();
			e.stop();
		});
	});
});