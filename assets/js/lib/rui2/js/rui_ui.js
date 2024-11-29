/*
 * @(#) rui_ui.js
 *
 * DevOn RUI
 * Build Version : 2.8
 *  
 * Copyright ⓒ LG CNS, Inc. All rights reserved.
 *
 * DevOn RUI의 모든 저작물은 LG CNS 의 지적재산입니다.
 * LG CNS로 부터 허가 받지 않은 경우 사용, 열람, 복사, 수정, 재배포 할 수 없으며 외부로의 유출을 금지합니다.
 * 특히 소스 코드를 수정하는 경우 기술 지원의 대상이 되지 않을 수 있습니다.
 * 자세한 사항은 계약사항에 따릅니다. 기타 사항은 devon@lgcns.com 으로 문의 하십시오.
 *
 * Do Not Erase This Comment!!! (이 주석문을 지우지 말것)
 *
 * rui/license.txt를 반드시 읽어보고 사용하시기 바랍니다. License.txt파일은 절대로 삭제하시면 안됩니다. 
 *
 * 1. 사내 사용시 KAMS를 통해 요청하여 사용허가를 받으셔야 소프트웨어 라이센스 계약서에 동의하는 것으로 간주됩니다.
 * 2. DevOn RUI가 포함된 제품을 판매하실 경우에도 KAMS를 통해 요청하여 사용허가를 받으셔야 합니다.
 * 3. KAMS를 통해 사용허가를 받지 않은 경우 소프트웨어 라이센스 계약을 위반한 것으로 간주됩니다.
 * 4. 별도로 판매될 경우는 LGCNS의 소프트웨어 판매정책을 따릅니다.
 */
Rui.namespace('Rui.ui');
(function(){
Rui.ui.LUIComponent = function(config){
    config = config || {};
    if (Rui.isDebugCR)
        Rui.log('otype : ' + this.otype + '\r\nconfig : ' + Rui.dump(config), 'create', this.otype || 'LUIComponent');
    this._events = this._events || {};
    this.initConfig = config;
    Rui.ui.LUIComponent.superclass.constructor.call(this);
    Rui.applyObject(this, config, true);
    this.createEvent('disable');
    this.createEvent('enable');
    this.createEvent('show');
    this.createEvent('hide');
    this.createEvent('focus');
    this.createEvent('blur');
    this.renderEvent = this.createEvent('render', { isCE: true } );
    this.createEvent('destroy');
    this.createEvent('resize');
    this.createEvent('move');
    this.init(config);
    if(this.applyTo){
        this.applyToMarkup(this.applyTo);
        delete this.applyTo;
    }else if(this.renderTo){
        this.render(this.renderTo);
        delete this.renderTo;
    }
 };
Rui.extend(Rui.ui.LUIComponent, Rui.util.LEventProvider, {
    otype: 'Rui.ui.LUIComponent',
    disabled: false,
    defaultClass: null,
    checkContainBlur: true,
    init: function(config) {
        this.initDefaultConfig();
        if (config) {
            this.cfg.applyConfig(config, true);
        }
        this.initComponent(config);
        this.initEvents();
        if (!Rui.ui.LConfig.alreadySubscribed(this.renderEvent, this.cfg.fireQueue, this.cfg)) {
            this.renderEvent.on(this.cfg.fireQueue, this.cfg, true);
        }
    },
    initDefaultConfig: function() {
        this.cfg = new Rui.ui.LConfig(this);
        this.cfg.addProperty('width', {
                handler: this._setWidth, 
                value: this.width, 
                validator: Rui.isNumber
        });
        this.cfg.addProperty('height', {
                handler: this._setHeight, 
                value: this.height, 
                validator: Rui.isNumber
        });
        this.cfg.addProperty('left', {
                handler: this._setLeft, 
                validator: Rui.isNumber
        });
        this.cfg.addProperty('top', {
                handler: this._setTop, 
                validator: Rui.isNumber
        });
        this.cfg.addProperty('disabled', {
                handler: this._setDisabled, 
                value: false, 
                validator: Rui.isBoolean
        });
    },
    initComponent: function(config){
    },
    initEvents: function() {
    },
    applyToMarkup: function(el) {
        this.el = Rui.get(el);
        if(!this.el) throw new Error(' Can\'t find the dom object while calling applyToMarkup method. : ' + el);
        if(!this.id)
            this.id = this.el.id;
        this.render(this.el.dom.parentNode);
    },
    renderAt: function(el) {
        this.applyToMarkup(el);
    },
    render: function(parentNode) {
    	if(!this.el && !parentNode) parentNode = document.body;
        if (parentNode) {
            this.createContainer(parentNode);
            this.appendTo(parentNode);
            this.doRender(parentNode);
        } else {
            if (! Rui.util.LDom.inDocument(this.el.dom)) {
                return false;
            }
        }
        this.dom = this.el.dom;
        if(this.defaultClass)
            this.el.addClass(this.defaultClass);
        this._rendered = true;
        this.renderEvent.fire();
        if(this.plugins) {
            for (var i = 0, len = this.plugins.length; i < len; i++) {
                this.plugins[i].initPlugin(this);
            }
        }
        this.afterRender(parentNode);
    },
    createContainer: function(appendToNode) {
        if(!this.el) {
            var tmpEl = this.createElement().cloneNode(false);
            tmpEl.id = Rui.useFixedId() ? Rui.id(this.el, 'LUIComp-' + (this.id || this.name || appendToNode.id)) : Rui.id();
            this.el = Rui.get(tmpEl);
            this.id = this.id || this.el.id;
        }
        return this.el;
    },
    createElement: function() {
        return document.createElement('div');
    },
    appendTo: function(parentNode) {
        if (typeof parentNode == 'string') {
            parentNode = document.getElementById(parentNode);
        }
        if (parentNode && this.el && this.el.dom) {
            parentNode = parentNode.dom || parentNode;
            if(parentNode != this.el.dom.parentNode)
                this._addToParent(parentNode, this.el.dom);
        }
    },
    _addToParent: function(parentNode, elNode) {
        if (parentNode === document.body && parentNode.firstChild) {
            parentNode.insertBefore(elNode, parentNode.firstChild);
        } else {
            parentNode.appendChild(elNode);
        }
    },
    doRender: function(parentNode){
    },
    initPlugin: function() {
        if(this.plugins) {
            for (var i = 0, len = this.plugins.length; i < len; i++) {
                this.plugins[i].initPlugin(this);
            }
        }
    },
    afterRender: function(container) {
        if(this.el) {
            if(this.checkContainBlur) {
            	this.el.on('focus', this.onCheckFocus, this, true, {system: true});
            	this.el.on('blur', this.deferOnBlur, this, true, {system: true});
            } else {
            	this.el.on('focus', this.onFocus, this, true, {system: true});
            	this.el.on('blur', this.onBlur, this, true, {system: true});
            }
        }
    },
    onCheckFocus: function(e) {
        if(!this.isFocus) {
            this.onFocus.call(this, e);
            if(this.checkContainBlur == true) {
                Rui.util.LEvent.addListener(Rui.browser.msie ? document.body : document, 'mousedown', this.deferOnBlur, this, true);
                this.isFocus = true;
            }
        }
    },
    reOnDeferOnBlur: function() {
        Rui.util.LEvent.removeListener(Rui.browser.msie ? document.body : document, 'mousedown', this.deferOnBlur);
        Rui.util.LEvent.addListener(Rui.browser.msie ? document.body : document, 'mousedown', this.deferOnBlur, this, true);
    },
    deferOnBlur: function(e) {
        Rui.util.LFunction.defer(this.checkBlur, 10, this, [e]);
    },
    checkBlur: function(e) {
        if(e.deferCancelBubble == true || this.isFocus !== true) return;
        var target = e.target;
        if(!this.el.isAncestor(target)) {
            if(this.onCanBlur(e) === false) return;
            Rui.util.LEvent.removeListener(Rui.browser.msie ? document.body : document, 'mousedown', this.deferOnBlur);
            this.onBlur.call(this, e);
            this.isFocus = null;
        } else 
            e.deferCancelBubble = true;
    },
    onCanBlur: function(e) {
    },
    onFocus: function(e) {
        if(this.isFocus !== true) {
            this.isFocus = true;
        	this.fireEvent('focus', e);
        }
    },
    onBlur: function(e) {
        this.isFocus = null;
        this.fireEvent('blur', e);
    },
    setVisibilityMode: function(visMode) {
        this.el.setVisibilityMode(visMode);
    },
    _setDisabled: function(type, args, obj) {
        if(args[0] === false) {
            this.disabled = false;
            if(this.el) this.el.removeClass('L-disabled');
            this.fireEvent('enable');
        } else {
            this.disabled = true;
            if(this.el) this.el.addClass('L-disabled');
            this.fireEvent('disable');
        }
    },
    _setWidth: function(type, args, obj) {
        var width = args[0];
        if(width < 0) return;
        if(this.el)
            this.el.setWidth(width);
        this.width = width;
    },
    _setHeight: function(type, args, obj) {
        var height = args[0];
        if(height < 0) return;
        if(this.el)
            this.el.setHeight(height);
        this.height = height;
    },
    _setLeft: function(type, args, obj) {
        var left = args[0];
        this.el.setLeft(left);
    },
    _setTop: function(type, args, obj) {
        var top = args[0];
        this.el.setTop(top);
    },
    enable: function() {
        this.cfg.setProperty('disabled', false);
    },
    disable: function() {
        this.cfg.setProperty('disabled', true);
    },
    isDisable: function() {
    	return this.cfg.getProperty('disabled');
    },
    isShow: function() {
        return this.el.isShow();
    },
    show: function(anim) {
        this.el.show(anim);
        this.fireEvent('show');
    },
    hide: function(anim) {
        this.el.hide(anim);
        this.fireEvent('hide');
    },
    focus: function() {
        this.el.focus();
    },
    blur: function() {
        this.el.blur();
    },
    getHeight: function(contentHeight){
        return this.el ? this.el.getHeight(contentHeight) : this.height;
    },
    setHeight: function(height){
        this.cfg.setProperty('height', height);
    },
    getWidth: function(contentWidth){
        return this.el ? this.el.getWidth(contentWidth) : this.width;
    },
    setWidth: function(width){
        this.cfg.setProperty('width', width);
    },
    getLeft: function(){
        return this.el.getLeft();
    },
    setLeft: function(left){
        this.cfg.setProperty('left', left);
    },
    getTop: function(){
        return this.el.getTop();
    },
    setTop: function(top){
        this.cfg.setProperty('top', top);
    },
    parent: function(selector, returnDom){
        return this.el.parent(selector, returnDom);
    },
    select: function(selector, firstOnly){
        return this.el.select(selector, firstOnly);
    },
    query: function(selector, firstOnly){
        return this.el.query(selector, firstOnly);
    },
    filter: function(selector){
        return this.el.query(selector);
    },
    getContainer: function(){
        return this.el;
    },
    updateView: function() {
        this.enableMaskEl = null;
    },
    availableHeight: function(parentId, margin) {
        this.el.availableHeight(parentId, margin);
    },
    isRender: function() {
        return this._rendered;
    },
    isRendered: function() {
        return this._rendered;
    },
    destroy: function() {
        this.fireEvent('destroy');
        if(this.plugins) {
            for (var i = 0, len = this.plugins.length; i < len; i++) {
                this.plugins[i].destroy(this);
            }
        }
        if(this.renderEvent) {
            this.renderEvent.unOnAll();
            this.renderEvent = null;
        }
        this.unOnAll();
        if(this.el) {
            this.el.unOnAll();
            this.el.remove();
            this.el = null;
        }
        if(this.deferOnBlur)
        	Rui.util.LEvent.removeListener(Rui.browser.msie ? document.body : document, 'mousedown', this.deferOnBlur);
        if(this.cfg) {
            this.cfg.destroy();
            this.cfg = null;
        }
    },
    toString: function() {
        return this.otype + ' ' + (this.id || 'Unknown');
    }
});
})();
Rui.namespace('Rui.ui');
Rui.ui.LButton = function(config){
    config = config || {};
    if(typeof config == 'string')
        config = {
            applyTo: config
        };
    config = Rui.applyIf(config, Rui.getConfig().getFirst('$.base.button.defaultProperties'));
    Rui.ui.LButton.superclass.constructor.call(this, config);
};
Rui.extend(Rui.ui.LButton, Rui.ui.LUIComponent, {
    otype: 'Rui.ui.LButton',
    CSS_BASE: 'L-button',
    label: null,
    type: 'button',
    disableDbClick: true,
    disableDbClickInterval: 500,
    initEvents: function() {
        Rui.ui.LButton.superclass.initEvents.call(this);
        this.createEvent('click');
    },
    initDefaultConfig: function() {
        Rui.ui.LButton.superclass.initDefaultConfig.call(this);
        this.cfg.addProperty('label', {
            handler: this._setLabel,
            value: this.label,
            validator: Rui.isString
        });
    },
    createElement: function() {
        return document.createElement('span');
    },
    createContainer: function(parentNode) {
        var el = Rui.ui.LButton.superclass.createContainer.call(this, parentNode),
            tagName = el.dom.tagName,
            label, className;
        if(tagName != 'SPAN'){
            switch(tagName){
            case 'INPUT':
                label = el.getValue();
                break;
            case 'A':
            case 'BUTTON':
            case 'DIV':
            default:
                label = el.getHtml();
                break;
            }
            this.el = this.createElement();
            this.el.id = this.id || this.el.id || Rui.useFixedId() ? Rui.id(this.el, 'LButton-' + this.id) : Rui.id();
            this.el = Rui.get(this.el);
            Rui.util.LDom.replaceChild(this.el.dom, el.dom);
            Rui.util.LDom.removeNode(el.dom);
            className = el.dom.className;
            if(className)
                this.el.addClass(className);
        }else{
            label = el.getHtml();
        }
        this.label = label;
        this.el.addClass(this.CSS_BASE);
        return this.el;
    },
    doRender: function(){
        this.createTemplate(this.el);
        var html = this.template.apply({
        	id: this.id + '-button',
        	type: this.type || 'button',
            label: this.label
        });
        this.el.html(html);
        this.on('click', this.onClick, this, true, {system: true});
        this.buttonEl = this.el.select('button').getAt(0);
        this.buttonEl.on('click', this.onButtonClick, this, true, {system: true});
    },
    createTemplate: function(el) {
        this.template = new Rui.LTemplate(
            '<span class="first-child">',
            '<button id="{id}" type="{type}">{label}</button>',
            '</span>'
        );
    },
    _setLabel: function(type, args, obj) {
        var label = args[0];
        this.label = label;
        this.buttonEl.html(label);
    },
    _setDisabled: function(type, args, obj) {
        if(args[0] === this.disabled) return;
        Rui.ui.LButton.superclass._setDisabled.call(this, type, args, obj);
        if(this.buttonEl) this.buttonEl.dom.disabled = args[0];
    },
    submitForm: function () {
        var form = this.getForm(),
            isSubmit = false,
            event;
        if(form){
            if(Rui.browser.msie){
                isSubmit = form.fireEvent('onsubmit');
            }else{
                event = document.createEvent('HTMLEvents');
                event.initEvent('submit', true, true);
                isSubmit = form.dispatchEvent(event);
            }
            if ((Rui.browser.msie || Rui.browser.webkit) && isSubmit)
                form.submit();
        }
        return isSubmit;
    },
    setLabel: function(label){
        this.cfg.setProperty('label', label);
    },
    getLabel: function() {
        return this.label;
    },
    getForm: function () {
        if(this.buttonEl)
            return this.buttonEl.dom.form;
        return null;
    },
    focus: function() {
        if(this.el && !this.el.hasClass('L-disabled'))
            if(this.buttonEl) this.buttonEl.focus();
    },
    blur: function() {
        if(this.el && !this.el.hasClass('L-disabled'))
            if(this.buttonEl) this.buttonEl.blur();
    },
    click: function() {
        return this.onButtonClick();
    },
    onButtonClick: function(e){
        if(this.disableDbClick) {
            if(this.disableDbClick == false) return;
            this.disable();
            if (Rui.useAccessibility()) this.el.setAttribute('aria-pressed', true);
            var me = this;
            this._timeout = setTimeout(function(){
                me.enable();
                if (Rui.useAccessibility()) this.el.setAttribute('aria-pressed', false);
            }, this.disableDbClickInterval);
        }
        this.fireEvent('click', e);
    },
    onClick: function(e){
        switch (this.type) {
        case 'submit':
    		if (e.returnValue !== false)
    			this.submitForm();
            break;
        case 'reset':
            var form = this.getForm();
            if (form)
                form.reset();
            break;
        }
    },
    destroy: function(){
        if(this.buttonEl){
            this.buttonEl.unOnAll();
            this.buttonEl.remove();
            delete this.buttonEl;
        }
        if(this._timeout)
        	clearTimeout(this._timeout);
        Rui.ui.LButton.superclass.destroy.call(this);
    },
    toString: function() {
        return (this.otype || 'Rui.ui.LButton ') + ' ' + this.id;
    }
});
(function () {
    Rui.ui.LConfig = function (owner) {
        if (owner) {
            this.init(owner);
        }
    };
    var LCustomEvent = Rui.util.LCustomEvent,
        Config = Rui.ui.LConfig;
    Config.prototype = {
        owner: null,
        queueInProgress: false,
        config: null,
        initialConfig: null,
        eventQueue: null,
        configChangedEvent: null,
        init: function (owner) {
            this.owner = owner;
            this.configChangedEvent = this.createEvent('configChanged', { isCE: true });
            this.configChangedEvent.signature = LCustomEvent.LIST;
            this.queueInProgress = false;
            this.config = {};
            this.initialConfig = {};
            this.eventQueue = [];
        },
        checkBoolean: function (val) {
            return (typeof val == 'boolean');
        },
        checkNumber: function (val) {
            return (!isNaN(val));
        },
        fireEvent: function ( key, value ) {
            var property = this.config[key];
            if (property && property.event) {
                property.event.fire(value);
            } 
        },
        addProperty: function ( key, propertyObject ) {
            key = key.toLowerCase();
            this.config[key] = propertyObject;
            propertyObject.event = this.createEvent(key, { scope: this.owner, isCE: true });
            propertyObject.event.signature = LCustomEvent.LIST;
            propertyObject.key = key;
            if (propertyObject.handler) {
                propertyObject.event.on(propertyObject.handler, 
                    this.owner);
            }
            this.setProperty(key, propertyObject.value, true);
            if (! propertyObject.suppressEvent) {
                this.queueProperty(key, propertyObject.value);
            }
        },
        getConfig: function () {
            var cfg = {},
                currCfg = this.config,
                prop,
                property;
            for (prop in currCfg) {
                if (Rui.hasOwnProperty(currCfg, prop)) {
                    property = currCfg[prop];
                    if (property && property.event) {
                        cfg[prop] = property.value;
                    }
                }
            }
            return cfg;
        },
        getProperty: function (key) {
            var property = this.config[key.toLowerCase()];
            if (property && property.event) {
                return property.value;
            } else {
                return undefined;
            }
        },
        resetProperty: function (key) {
            key = key.toLowerCase();
            var property = this.config[key];
            if (property && property.event) {
                if (this.initialConfig[key] && 
                    !Rui.isUndefined(this.initialConfig[key])) {
                    this.setProperty(key, this.initialConfig[key]);
                    return true;
                }
            } else {
                return false;
            }
        },
        setProperty: function (key, value, silent) {
            var property;
            key = key.toLowerCase();
            if (this.queueInProgress && ! silent) {
                this.queueProperty(key,value);
                return true;
            } else {
                property = this.config[key];
                if (property && property.event) {
                    if (property.validator && !property.validator(value)) {
                        return false;
                    } else {
                        property.oldValue = property.value;
                        property.value = value;
                        if (! silent) {
                            this.fireEvent(key, value);
                            this.configChangedEvent.fire([key, value]);
                        }
                        return true;
                    }
                } else {
                    return false;
                }
            }
        },
        queueProperty: function (key, value) {
            key = key.toLowerCase();
            var property = this.config[key],
                foundDuplicate = false,
                iLen,
                queueItem,
                queueItemKey,
                queueItemValue,
                sLen,
                supercedesCheck,
                qLen,
                queueItemCheck,
                queueItemCheckKey,
                queueItemCheckValue,
                i,
                s,
                q;              
            if (property && property.event) {
                if (!Rui.isUndefined(value) && property.validator && 
                    !property.validator(value)) { 
                    return false;
                } else {
                    if (!Rui.isUndefined(value)) {
                        property.value = value;
                    } else {
                        value = property.value;
                    }
                    foundDuplicate = false;
                    iLen = this.eventQueue.length;
                    for (i = 0; i < iLen; i++) {
                        queueItem = this.eventQueue[i];
                        if (queueItem) {
                            queueItemKey = queueItem[0];
                            queueItemValue = queueItem[1];
                            if (queueItemKey == key) {
                                this.eventQueue[i] = null;
                                this.eventQueue.push(
                                    [key, (!Rui.isUndefined(value) ? 
                                    value: queueItemValue)]);
                                foundDuplicate = true;
                                break;
                            }
                        }
                    }
                    if (! foundDuplicate && !Rui.isUndefined(value)) { 
                        this.eventQueue.push([key, value]);
                    }
                }
                if (property.supercedes) {
                    sLen = property.supercedes.length;
                    for (s = 0; s < sLen; s++) {
                        supercedesCheck = property.supercedes[s];
                        qLen = this.eventQueue.length;
                        for (q = 0; q < qLen; q++) {
                            queueItemCheck = this.eventQueue[q];
                            if (queueItemCheck) {
                                queueItemCheckKey = queueItemCheck[0];
                                queueItemCheckValue = queueItemCheck[1];
                                if (queueItemCheckKey == supercedesCheck.toLowerCase() ) {
                                    this.eventQueue.push([queueItemCheckKey, queueItemCheckValue]);
                                    this.eventQueue[q] = null;
                                    break;
                                }
                            }
                        }
                    }
                }
                return true;
            } else {
                return false;
            }
        },
        refireEvent: function (key) {
            key = key.toLowerCase();
            var property = this.config[key];
            if (property && property.event && 
                !Rui.isUndefined(property.value)) {
                if (this.queueInProgress) {
                    this.queueProperty(key);
                } else {
                    this.fireEvent(key, property.value);
                }
            }
        },
        applyConfig: function (userConfig, init) {
            var sKey,
                oConfig;
            if (init) {
                oConfig = {};
                for (sKey in userConfig) {
                    if (Rui.hasOwnProperty(userConfig, sKey)) {
                        oConfig[sKey.toLowerCase()] = userConfig[sKey];
                    }
                }
                this.initialConfig = oConfig;
            }
            for (sKey in userConfig) {
                if (Rui.hasOwnProperty(userConfig, sKey)) {
                    this.queueProperty(sKey, userConfig[sKey]);
                }
            }
        },
        fireQueue: function () {
            var i, 
                queueItem,
                key,
                value,
                property;
            this.queueInProgress = true;
            for (i = 0;i < this.eventQueue.length; i++) {
                queueItem = this.eventQueue[i];
                if (queueItem) {
                    key = queueItem[0];
                    value = queueItem[1];
                    property = this.config[key];
                    property.value = value;
                    this.eventQueue[i] = null;
                    this.fireEvent(key,value);
                }
            }
            this.queueInProgress = false;
            this.eventQueue = [];
        },
        subscribeToConfigEvent: function (key, handler, obj, override) {
            var property = this.config[key.toLowerCase()];
            if (property && property.event) {
                if (!Config.alreadySubscribed(property.event, handler, obj)) {
                    property.event.on(handler, obj, override);
                }
                return true;
            } else {
                return false;
            }
        },
        unsubscribeFromConfigEvent: function (key, handler, obj) {
            var property = this.config[key.toLowerCase()];
            if (property && property.event) {
                return property.event.unOn(handler, obj);
            } else {
                return false;
            }
        },
        toString: function () {
            var output = 'Config';
            if (this.owner) {
                output += ' [' + this.owner.toString() + ']';
            }
            return output;
        },
        destroy: function () {
            var oConfig = this.config,
                sProperty,
                oProperty;
            for (sProperty in oConfig) {
                if (Rui.hasOwnProperty(oConfig, sProperty)) {
                    oProperty = oConfig[sProperty];
                    oProperty.event.unOnAll();
                    oProperty.event = null;
                }
            }
            this.configChangedEvent.unOnAll();
            this.configChangedEvent = null;
            this.owner = null;
            this.config = null;
            this.initialConfig = null;
            this.eventQueue = null;
        }
    };
    Config.alreadySubscribed = function (evt, fn, obj) {
        var nSubscribers = evt.subscribers.length,
            subsc,
            i;
        if (nSubscribers > 0) {
            i = nSubscribers - 1;
            do {
                subsc = evt.subscribers[i];
                if (subsc && subsc.obj == obj && subsc.fn == fn) {
                    return true;
                }
            }
            while (i--);
        }
        return false;
    };
    Rui.applyPrototype(Config, Rui.util.LEventProvider);
}());
Rui.namespace('Rui.ui');
(function () {
    Rui.ui.LPanel = function (oConfig) {
        var config = oConfig || {};
        config = Rui.applyIf(config, Rui.getConfig().getFirst('$.ext.panel'));
        Rui.applyObject(this, config, true);
        Rui.ui.LPanel.superclass.constructor.call(this,config);
    };
    var _currentModal = null;
    var Util = Rui.util,
    Dom = Util.LDom,
    Event = Util.LEvent,
    LCustomEvent = Util.LCustomEvent,
    LKeyListener = Rui.util.LKeyListener,
    Config = Rui.ui.LConfig,
    Panel = Rui.ui.LPanel,
    bIEQuirks = (Rui.browser.msie == 6 || (Rui.browser.msie == 7 && document.compatMode == "BackCompat"));
    Panel.IMG_ROOT = null;
    Panel.IMG_ROOT_SSL = null;
    Panel.CSS_HEADER = "hd";
    Panel.CSS_BODY = "bd";
    Panel.CSS_FOOTER = "ft";
    Panel.RESIZE_MONITOR_SECURE_URL = "javascript:false;";
    Panel.STD_MOD_RE = /^\s*?(body|footer|header)\s*?$/i;
    Panel.textResizeEvent = new LCustomEvent("textResize", {isCE:true});
    Panel.VIEWPORT_OFFSET = 10;
    Panel.windowScrollEvent = new LCustomEvent("windowScroll", {isCE:true});
    Panel.windowResizeEvent = new LCustomEvent("windowResize", {isCE:true});
    Panel.windowScrollHandler = function (e) {
        var t = Event.getTarget(e);
        if (!t || t === window || t === window.document) {
            if (Rui.browser.msie) {
                if (! window.scrollEnd) {
                    window.scrollEnd = -1;
                }
                clearTimeout(window.scrollEnd);
                window.scrollEnd = setTimeout(function () {
                    Panel.windowScrollEvent.fire();
                }, 1);
            } else {
                Panel.windowScrollEvent.fire();
            }
        }
    };
    Panel.windowResizeHandler = function (e) {
        if (Rui.browser.msie) {
            if (! window.resizeEnd) {
                window.resizeEnd = -1;
            }
            clearTimeout(window.resizeEnd);
            window.resizeEnd = setTimeout(function () {
                Panel.windowResizeEvent.fire();
            }, 100);
        } else {
            Panel.windowResizeEvent.fire();
        }
    };
    Panel._initialized = null;
    if (Panel._initialized === null) {
        Event.on(window, "scroll", Panel.windowScrollHandler);
        Event.on(window, "resize", Panel.windowResizeHandler);
        Panel._initialized = true;
    }
    Panel._TRIGGER_MAP = {
            "windowScroll": Panel.windowScrollEvent,
            "windowResize": Panel.windowResizeEvent,
            "textResize"  : Panel.textResizeEvent
    };
    DEFAULT_CONFIG = {
            "VISIBLE": {
                key: "visible",
                value: false,
                validator: Rui.isBoolean
            },
            "EFFECT": {
                key: "effect",
                suppressEvent: true,
                supercedes: ["visible"]
            },
            "MONITOR_RESIZE": {
                key: "monitorresize",
                value: true
            },
            "X": {
                key: "x",
                validator: Rui.isNumber,
                suppressEvent: true,
                supercedes: ["iframe"]
            },
            "Y": {
                key: "y",
                validator: Rui.isNumber,
                suppressEvent: true,
                supercedes: ["iframe"]
            },
            "XY": {
                key: "xy",
                suppressEvent: true,
                supercedes: ["iframe"]
            },
            "CONTEXT": {
                key: "context",
                suppressEvent: true,
                supercedes: ["iframe"]
            },
            "FIXED_CENTER": {
                key: "fixedcenter",
                value: false,
                validator: Rui.isBoolean,
                supercedes: ["iframe", "visible"]
            },
            "AUTO_FILL_HEIGHT": {
                key: "autofillheight",
                supressEvent: true,
                supercedes: ["height"],
                value:"body"
            },
            "ZINDEX": {
                key: "zindex",
                value: null
            },
            "IFRAME": {
                key: "iframe",
                value: (Rui.browser.msie == 6 ? true : false),
                validator: Rui.isBoolean,
                supercedes: ["zindex"]
            },
            "PREVENT_CONTEXT_OVERLAP": {
                key: "preventcontextoverlap",
                value: false,
                validator: Rui.isBoolean,
                supercedes: ["constraintoviewport"]
            },
            "CLOSE": {
                key: "close",
                value: true,
                validator: Rui.isBoolean,
                supercedes: ["visible"]
            },
            "DRAGGABLE": {
                key: "draggable",
                value: (Rui.dd.LDD ? true : false),
                validator: Rui.isBoolean,
                supercedes: ["visible"]
            },
            "DRAG_ONLY": {
                key: "dragonly",
                value: false,
                validator: Rui.isBoolean,
                supercedes: ["draggable"]
            },
            "UNDERLAY": {
                key: "underlay",
                value: "shadow",
                supercedes: ["visible"]
            },
            "MODAL": {
                key: "modal",
                value: false,
                validator: Rui.isBoolean,
                supercedes: ["visible", "zindex"]
            },
            "KEY_LISTENERS":{
                key: "keylisteners",
                suppressEvent: true,
                supercedes: ["visible"]
            },
            "STRINGS": {
                key: "strings",
                supercedes: ["close"],
                validator: Rui.isObject,
                value: {
                    close: "Close"
                }
            }
    };
    Rui.extend(Rui.ui.LPanel, Rui.ui.LUIComponent, {
        otype: 'Rui.ui.LPanel',
        m_oModuleTemplate: null,
        m_oHeaderTemplate: null,
        m_oBodyTemplate: null,
        m_oFooterTemplate: null,
        m_oMaskTemplate: null,
        m_oUnderlayTemplate: null,
        m_oCloseIconTemplate: null,
        m_oIFrameTemplate: null,
        element: null,
        header: null,
        body: null,
        footer: null,
        id: null,
        imageRoot: Panel.IMG_ROOT,
        CONTEXT_TRIGGERS: [],
        createContainer: function(appendToNode) {
            this.el = Rui.ui.LPanel.superclass.createContainer.call(this, appendToNode);
            if(!this.el) {
                this.el = Rui.get(this.createElement().cloneNode(false));
                this.id = this.id || this.el.id;
                this.element  = this.el.dom;
            }
            if(this.el){
                this.element = this.el.dom;
                Dom.setStyle(this.element, "visibility", "");
                if(this.header != null)
                    this.cfg.setProperty('header', this.header);
                if(this.footer != null)
                    this.cfg.setProperty('footer', this.footer);
                if(this.body != null)
                    this.cfg.setProperty('body', this.body);
                this._renderHeader(this.el.dom);
                this._renderBody(this.el.dom);
                this._renderFooter(this.el.dom);
                this.initModuleOverlay(this.element);
            }
            return this.el;
        },
        initModuleOverlay: function(el){
            this.initModule(el);
            Dom.addClass(this.element, 'L-overlay');
        },
        createElement: function(){
            return  this.createModuleTemplate();
        },
        createModuleTemplate: function(){
            if (!this.m_oModuleTemplate) {
                this.m_oModuleTemplate = document.createElement("div");
                this.m_oModuleTemplate.innerHTML = ("<div class=\"" +
                        Panel.CSS_HEADER + "\"></div>" + "<div class=\"" +
                        Panel.CSS_BODY + "\"></div><div class=\"" +
                        Panel.CSS_FOOTER + "\"></div>");
                this.m_oHeaderTemplate = this.m_oModuleTemplate.firstChild;
                this.m_oBodyTemplate = this.m_oHeaderTemplate.nextSibling;
                this.m_oFooterTemplate = this.m_oBodyTemplate.nextSibling;
            }
            return this.m_oModuleTemplate;
        },
        createModuleHeader: function() {
            if (!this.m_oHeaderTemplate) {
                this.createModuleTemplate();
            }
            return (this.m_oHeaderTemplate.cloneNode(false));
        },
        createBody: function(){
            if (!this.m_oBodyTemplate) {
                this.createModuleTemplate();
            }
            return (this.m_oBodyTemplate.cloneNode(false));
        },
        createFooter: function() {
            if (!this.m_oFooterTemplate) {
                this.createModuleTemplate();
            }
            return (this.m_oFooterTemplate.cloneNode(false));
        },
        createEmptyElement: function(el){
            var doc = document.getElementById(el);
            if(!doc){
                doc =  document.createElement('div');
                doc.id = el;
                document.body.appendChild(doc);
            }
        },
        initModule: function (el, userConfig) {
            var elId, child;
            if(this.cfg == null)
                this.cfg = new Config(this);
            if (this.isSecure) {
                this.imageRoot = Panel.IMG_ROOT_SSL;
            }
            if (typeof el == "string") {
                elId = el;
                el = document.getElementById(el);
                if (! el) {
                    el = (this.createModuleTemplate()).cloneNode(false);
                    el.id = elId;
                }
            }
            this.element = el;
            if (el.id) {
                if(this.id === 'undefined')
                    this.id = el.id;
            }
            child = this.element.firstChild || this.m_oHeaderTemplate;
            if (child) {
                var fndHd = false, fndBd = false, fndFt = false;
                do {
                    if (1 == child.nodeType) {
                        if (!fndHd && Dom.hasClass(child, Panel.CSS_HEADER)){
                            this.header = child;
                            fndHd = true;
                        } else if (!fndBd && Dom.hasClass(child, Panel.CSS_BODY)){
                            this.body = child;
                            fndBd = true;
                        } else if (!fndFt && Dom.hasClass(child, Panel.CSS_FOOTER)){
                            this.footer = child;
                            fndFt = true;
                        }
                    }
                } while ((child = child.nextSibling));
            }
        },
        initResizeMonitor: function () {
            var isGeckoWin = (Rui.browser.gecko && Rui.platform.window);
            if (isGeckoWin) {
                var self = this;
                setTimeout(function(){self._initResizeMonitor();}, 0);
            } else {
                this._initResizeMonitor();
            }
        },
        _initResizeMonitor: function() {
            var oDoc, oIFrame, sHTML;
            function fireTextResize() {
                Panel.textResizeEvent.fire();
            }
            if (!Rui.browser.opera) {
                oIFrame = Dom.get("_ruiResizeMonitor");
                var supportsCWResize = this._supportsCWResize();
                if (!oIFrame) {
                    oIFrame = document.createElement("iframe");
                    if (this.isSecure && this.RESIZE_MONITOR_SECURE_URL && Rui.browser.ie) {
                        oIFrame.src = this.RESIZE_MONITOR_SECURE_URL;
                    }
                    if (!supportsCWResize) {
                        sHTML = ["<html><head><script ",
                                 "type=\"text/javascript\">",
                                 "window.onresize=function(){window.parent.",
                                 "Rui.ui.LPanel.textResizeEvent.",
                                 "fire();};<",
                                 "\/script></head>",
                                 "<body></body></html>"].join('');
                        oIFrame.src = "data:text/html;charset=utf-8," + encodeURIComponent(sHTML);
                    }
                    oIFrame.id = "_ruiResizeMonitor";
                    oIFrame.title = "Text Resize Monitor";
                    oIFrame.style.position = "absolute";
                    oIFrame.style.visibility = "hidden";
                    var db = document.body,
                    fc = db.firstChild;
                    if (fc) {
                        db.insertBefore(oIFrame, fc);
                    } else {
                        db.appendChild(oIFrame);
                    }
                    oIFrame.style.width = "10em";
                    oIFrame.style.height = "10em";
                    oIFrame.style.top = (-1 * oIFrame.offsetHeight) + "px";
                    oIFrame.style.left = (-1 * oIFrame.offsetWidth) + "px";
                    oIFrame.style.borderWidth = "0";
                    oIFrame.style.visibility = "visible";
                    if(Rui.useAccessibility())
                        oIFrame.setAttribute('aria-hidden', 'false');
                    if (Rui.browser.webkit) {
                        oDoc = oIFrame.contentWindow.document;
                        oDoc.open();
                        oDoc.close();
                    }
                }
                if (oIFrame && oIFrame.contentWindow) {
                    Panel.textResizeEvent.on(this.onDomResize, this, true, {isCE:true});
                    if (!Panel.textResizeInitialized) {
                        if (supportsCWResize) {
                            if (!Event.on(oIFrame.contentWindow, "resize", fireTextResize, {isCE:true})) {
                                Event.on(oIFrame, "resize", fireTextResize, {isCE:true});
                            }
                        }
                        Panel.textResizeInitialized = true;
                    }
                    this.resizeMonitor = oIFrame;
                }
            }
        },
        _supportsCWResize: function() {
            var bSupported = true;
            if (Rui.browser.gecko && Rui.browser.gecko <= 1.8 && !Rui.browser.msie) {
                bSupported = false;
            }
            return bSupported;
        },
        _renderHeader: function(moduleElement){
            moduleElement = this.el.dom || moduleElement;
            if (this.header && !Dom.inDocument(this.header)) {
                var firstChild = moduleElement.firstChild;
                if (firstChild) {
                    moduleElement.insertBefore(this.header, firstChild);
                } else {
                    moduleElement.appendChild(this.header);
                }
            }
        },
        _renderBody: function(moduleElement){
            moduleElement = this.el.dom || moduleElement;
            if (!Rui.isNull(this.body) && !Dom.inDocument(this.body)) {
                if (this.footer && Dom.isAncestor(moduleElement, this.footer)) {
                    Dom.insertBefore(this.body, this.footer);
                } else {
                    if(typeof this.body === 'string'){
                        var oBody = this.createBody();
                        if (this.body.nodeName) {
                            oBody.innerHTML = "";
                            oBody.appendChild(this.body);
                        } else {
                            oBody.innerHTML = this.body;
                        }
                        this.body = oBody;
                    }
                        moduleElement.appendChild(this.body);
                }
            }
        },
        _renderFooter: function(moduleElement){
            moduleElement = this.el.dom || moduleElement;
            if (this.footer && !Dom.inDocument(this.footer)) {
                moduleElement.appendChild(this.footer);
            }
        },
        getHeader: function(){
            return Rui.get(this.header);
        },
        getBody: function(){
            return Rui.get(this.body);
        },
        getFooter: function(){
            return Rui.get(this.footer);
        },
        setHeader: function (headerContent) {
            var oHeader = this.header || (this.header = this.createModuleHeader());
            if (headerContent.nodeName) {
                oHeader.innerHTML = "";
                oHeader.appendChild(headerContent);
            } else {
                oHeader.innerHTML = headerContent;
            }
            if(Rui.useAccessibility())
                oHeader.setAttribute('role', 'region');
            if(this._rendered) {
                this._renderHeader();
            }
            this._applyContent('changeHeader', headerContent);
        },
        appendToHeader: function (element) {
            var oHeader = this.header || (this.header = this.createModuleHeader());
            oHeader.appendChild(element);
            this._applyContent('changeHeader', element);
        },
        setBody: function (bodyContent) {
            this._appendToBodyContent(bodyContent);
            if(this._rendered) {
                this._renderBody();
            }
            this._applyContent('changeBody', bodyContent);
        },
        _insertBody: function (bodyContent) {
            this._appendToBodyContent(bodyContent);
            if(typeof bodyContent !== 'undefinded' && bodyContent == "")
                this._renderBody();
            else if(this._rendered)
                this._renderBody();
            this._applyContent('changeBody', bodyContent);
        },
        _appendToBodyContent: function(bodyContent){
            var oBody = this.body || (this.body = this.createBody());
            if (bodyContent && bodyContent.nodeName) {
                oBody.innerHTML = "";
                oBody.appendChild(bodyContent);
            } else {
                oBody.innerHTML = bodyContent;
            }
            if(Rui.useAccessibility())
                oBody.setAttribute('role', 'region');
        },
        _applyContent: function(evtType, content){
            this.fireEvent(evtType, {target: this, content:content});
            this.fireEvent('changeContent', {target:this});
        },
        appendToBody: function (element) {
            var oBody = this.body || (this.body = this.createBody());
            oBody.appendChild(element);
            this._applyContent('changeBody', element);
        },
        setFooter: function (footerContent) {
            var footer = this.footer || (this.footer = this.createFooter());
            if (footerContent.nodeName) {
                footer.innerHTML = "";
                footer.appendChild(footerContent);
            } else {
                footer.innerHTML = footerContent;
            }
            if(Rui.useAccessibility())
                footer.setAttribute('role', 'region');
            if(this._rendered) {
                this._renderFooter();
            }
            this._applyContent('changeFooter', footerContent);
        },
        appendToFooter: function (element) {
            var oFooter = this.footer || (this.footer = this.createFooter());
            oFooter.appendChild(element);
            this._applyContent('changeFooter', element);
        },
        show: function (anim) {
            this.cfg.setProperty("visible", true);
            if(Rui.useAccessibility())
                this.el.setAttribute('aria-hidden', 'false');
            if(Rui.platform.isMobile) anim = false;
            if(anim === true) {
                var left = Rui.util.LDom.getX(this.element);
                Rui.util.LDom.setX(this.element, 0);
                anim = new Rui.fx.LAnim({
                    el: this.element.id,
                    attributes: {
                        left: {from:0, to:left}
                    },
                    duration: 0.2
                });
            }
            Rui.ui.LPanel.superclass.show.call(this, anim);
        },
        hideAnim: function(anim){
            this.hide(anim);
        },
        hide: function (anim) {
        	if(Rui.platform.isMobile) anim = false;
            if(anim) {
                if(anim === true){
                    var left = Rui.util.LDom.getX(this.element);
                    anim = new Rui.fx.LAnim({
                        el: this.element.id,
                        attributes: {
                            left: {from:left, to:0}
                        },
                        duration: 0.2
                    });
                    var pnlObj = this;
                    anim.on('complete', function(){
                        pnlObj.cfg.setProperty("visible", false);
                        Rui.util.LDom.setX(pnlObj.element, left);
                        if(Rui.useAccessibility())
                            pnlObj.element.setAttribute('aria-hidden', 'true');
                    });
                    anim.animate();
                }else
                    Rui.ui.LPanel.superclass.hide.call(this, anim);
            } else {
                if(this.cfg){
                    this.cfg.setProperty("visible", false);
                    if(Rui.useAccessibility())
                        this.el.setAttribute('aria-hidden', 'true');
                }
            }
        },
        isShow: function() {
            return Rui.get(this.element).isShow();
        },
        moveTo: function (x, y) {
            this.cfg.setProperty("xy", [x, y]);
        },
        doCenterOnDOMEvent: function () {
            if (this.cfg && this.cfg.getProperty("visible")) {
                this.onCenter();
            }
        },
        configAutoFillHeight: function (type, args, obj) {
            var fillEl = args[0],
            currEl = this.cfg.getProperty("autofillheight");
            this.cfg.unsubscribeFromConfigEvent("height", this._autoFillOnHeightChange);
            Panel.textResizeEvent.unOn("height", this._autoFillOnHeightChange);
            if (currEl && fillEl !== currEl && this[currEl]) {
                Dom.setStyle(this[currEl], "height", "");
            }
            if (fillEl) {
                fillEl = Rui.trim(fillEl.toLowerCase());
                this.cfg.subscribeToConfigEvent("height", this._autoFillOnHeightChange, this[fillEl], this);
                Panel.textResizeEvent.on(this._autoFillOnHeightChange, this[fillEl], this, {isCE:true});
                this.cfg.setProperty("autofillheight", fillEl, true);
            }
        },
        configXY: function (type, args, obj) {
            var pos = args[0],
            x = pos[0],
            y = pos[1];
            if(Rui._tabletData && y > 200) y = 200;
            this.cfg.setProperty("x", x);
            this.cfg.setProperty("y", y);
            this.fireEvent('beforeMove', [x,y]);
            x = this.cfg.getProperty("x");
            y = this.cfg.getProperty("y");
            this.cfg.refireEvent("iframe");
            this.fireEvent('move', [x, y]);
        },
        configX: function (type, args, obj) {
            var x = args[0],
            y = this.cfg.getProperty("y");
            this.cfg.setProperty("x", x, true);
            this.cfg.setProperty("y", y, true);
            this.fireEvent('beforeMove', [x,y]);
            x = this.cfg.getProperty("x");
            y = this.cfg.getProperty("y");
            Dom.setX(this.element, x, true);
            this.cfg.setProperty("xy", [x, y], true);
            this.cfg.refireEvent("iframe");
            this.fireEvent('move', [x, y]);
        },
        configY: function (type, args, obj) {
            var x = this.cfg.getProperty("x"),
            y = args[0];
            if(Rui._tabletData && y > 200) y = 200;
            this.cfg.setProperty("x", x, true);
            this.cfg.setProperty("y", y, true);
            this.fireEvent('beforeMove', [x,y]);
            x = this.cfg.getProperty("x");
            y = this.cfg.getProperty("y");
            Dom.setY(this.element, y, true);
            this.cfg.setProperty("xy", [x, y], true);
            this.cfg.refireEvent("iframe");
            this.fireEvent('move', [x, y]);
        },
        showIframe: function () {
            var oIFrame = this.iframe,
            oParentNode;
            if (oIFrame) {
                oParentNode = this.element.parentNode;
                if (oParentNode != oIFrame.parentNode) {
                    this._addToParent(oParentNode, oIFrame);
                }
                oIFrame.style.display = "block";
            }
        },
        hideIframe: function () {
            if (this.iframe) {
                this.iframe.style.display = "none";
            }
        },
        syncIframe: function () {
            var IFRAME_OFFSET = 3;
            var oIFrame = this.iframe,
            oElement = this.element,
            nOffset = IFRAME_OFFSET,
            nDimensionOffset = (nOffset * 2),
            aXY;
            if (oIFrame) {
                oIFrame.style.width = (oElement.offsetWidth + nDimensionOffset + "px");
                oIFrame.style.height = (oElement.offsetHeight + nDimensionOffset + "px");
                aXY = this.cfg.getProperty("xy");
                if (!Rui.isArray(aXY) || (isNaN(aXY[0]) || isNaN(aXY[1]))) {
                    this.syncPosition();
                    aXY = this.cfg.getProperty("xy");
                }
                Dom.setXY(oIFrame, [(aXY[0] - nOffset), (aXY[1] - nOffset)]);
            }
        },
        stackIframe: function () {
            if (this.iframe) {
                var overlayZ = Dom.getStyle(this.element, "zIndex");
                if (!Rui.isUndefined(overlayZ) && !isNaN(overlayZ)) {
                    Dom.setStyle(this.iframe, "zIndex", (overlayZ - 1));
                }
            }
        },
        configIframe: function (type, args, obj) {
            var bIFrame = args[0];
            function createIFrame() {
                var oIFrame = this.iframe,
                oElement = this.element,
                oParent;
                if (!oIFrame) {
                    if (!this.m_oIFrameTemplate) {
                        this.m_oIFrameTemplate = document.createElement("iframe");
                        if (this.isSecure) {
                            var IFRAME_SRC = "javascript:false;";
                            this.m_oIFrameTemplate.src = IFRAME_SRC;
                        }
                        if (Rui.browser.msie) {
                            this.m_oIFrameTemplate.style.filter = "alpha(opacity=0)";
                            this.m_oIFrameTemplate.frameBorder = 0;
                        }
                        else {
                            m_oIFrameTemplate.style.opacity = "0";
                        }
                        this.m_oIFrameTemplate.style.position = "absolute";
                        this.m_oIFrameTemplate.style.border = "none";
                        this.m_oIFrameTemplate.style.margin = "0";
                        this.m_oIFrameTemplate.style.padding = "0";
                        this.m_oIFrameTemplate.style.display = "none";
                    }
                    oIFrame = this.m_oIFrameTemplate.cloneNode(false);
                    oParent = oElement.parentNode;
                    var parentNode = oParent || document.body;
                    this._addToParent(parentNode, oIFrame);
                    this.iframe = oIFrame;
                }
                this.showIframe();
                this.syncIframe();
                this.stackIframe();
                if (!this._hasIframeEventListeners) {
                    this.on('show', this.showIframe, this, true);
                    this.on('hide', this.hideIframe, this, true);
                    this.on('changeContent', this.syncIframe, this, true);
                    this._hasIframeEventListeners = true;
                }
            }
            function onBeforeShow() {
                createIFrame.call(this);
                this._iframeDeferred = false;
            }
            if (bIFrame) { 
                if (this.cfg.getProperty("visible")) {
                    createIFrame.call(this);
                } else {
                    if (!this._iframeDeferred) {
                        this.on('beforeShow',onBeforeShow,this,true);
                        this._iframeDeferred = true;
                    }
                }
            } else {    
                this.hideIframe();
                if (this._hasIframeEventListeners) {
                    this.unOn('show', this.showIframe, this);
                    this.unOn('hide',this.hideIframe, this);
                    this.unOn('changeContent', this.syncIframe, this);
                    this._hasIframeEventListeners = false;
                }
            }
        },
        configContext: function (type, args, obj) {
            var contextArgs = args[0],
            contextEl,
            elementMagnetCorner,
            contextMagnetCorner,
            triggers,
            defTriggers = this.CONTEXT_TRIGGERS;
            if (contextArgs) {
                contextEl = contextArgs[0];
                elementMagnetCorner = contextArgs[1];
                contextMagnetCorner = contextArgs[2];
                triggers = contextArgs[3];
                if (defTriggers && defTriggers.length > 0) {
                    triggers = (triggers || []).concat(defTriggers);
                }
                if (contextEl) {
                    if (typeof contextEl == "string") {
                        this.cfg.setProperty("context", [
                            document.getElementById(contextEl),
                            elementMagnetCorner,
                            contextMagnetCorner,
                            triggers ],
                            true);
                    }
                    if (elementMagnetCorner && contextMagnetCorner) {
                        this.align(elementMagnetCorner, contextMagnetCorner);
                    }
                    if (this._contextTriggers) {
                        this._processTriggers(this._contextTriggers, "unOn", this._alignOnTrigger);
                    }
                    if (triggers) {
                        this._processTriggers(triggers, "on", this._alignOnTrigger);
                        this._contextTriggers = triggers;
                    }
                }
            }
        },
        _alignOnTrigger: function(type, args) {
            this.align();
        },
        _findTriggerCE: function(t) {
            var tce = null;
            if (t instanceof LCustomEvent) {
                tce = t;
            } else if (Panel._TRIGGER_MAP[t]) {
                tce = Panel._TRIGGER_MAP[t];
            }
            return tce;
        },
        _processTriggers: function(triggers, mode, fn) {
            var t, tce;
            for (var i = 0, l = triggers.length; i < l; ++i) {
                t = triggers[i];
                tce = this._findTriggerCE(t);
                if (tce) {
                    tce[mode](fn, this, true);
                } else {
                    this[mode](t, fn);
                }
            }
        },
        align: function (elementAlign, contextAlign) {
            var contextArgs = this.cfg.getProperty("context"),
            me = this,
            context,
            element,
            contextRegion;
            var TOP_LEFT = "tl",     
            TOP_RIGHT = "tr",    
            BOTTOM_LEFT = "bl",  
            BOTTOM_RIGHT = "br"; 
            function doAlign(v, h) {
                switch (elementAlign) {
                case TOP_LEFT:
                    me.moveTo(h, v);
                    break;
                case TOP_RIGHT:
                    me.moveTo((h - element.offsetWidth), v);
                    break;
                case BOTTOM_LEFT:
                    me.moveTo(h, (v - element.offsetHeight));
                    break;
                case BOTTOM_RIGHT:
                    me.moveTo((h - element.offsetWidth),
                            (v - element.offsetHeight));
                    break;
                }
            }
            if (contextArgs) {
                context = contextArgs[0];
                element = this.element;
                me = this;
                if (! elementAlign) {
                    elementAlign = contextArgs[1];
                }
                if (! contextAlign) {
                    contextAlign = contextArgs[2];
                }
                if (element && context) {
                    contextRegion = Dom.getRegion(context);
                    switch (contextAlign) {
                    case TOP_LEFT:
                        doAlign(contextRegion.top, contextRegion.left);
                        break;
                    case TOP_RIGHT:
                        doAlign(contextRegion.top, contextRegion.right);
                        break;
                    case BOTTOM_LEFT:
                        doAlign(contextRegion.bottom, contextRegion.left);
                        break;
                    case BOTTOM_RIGHT:
                        doAlign(contextRegion.bottom, contextRegion.right);
                        break;
                    }
                }
            }
        },
        getConstrainedX: function (x) {
            var oPanel = this,
            oPanelEl = oPanel.element,
            nOverlayOffsetWidth = oPanelEl.offsetWidth,
            nViewportOffset = Panel.VIEWPORT_OFFSET,
            viewPortWidth = Dom.getViewportWidth(),
            scrollX = Dom.getDocumentScrollLeft(),
            bCanConstrain = (nOverlayOffsetWidth + nViewportOffset < viewPortWidth),
            aContext = this.cfg.getProperty("context"),
            oContextEl,
            nContextElX,
            nContextElWidth,
            bFlipped = false,
            nLeftRegionWidth,
            nRightRegionWidth,
            leftConstraint,
            rightConstraint,
            xNew = x,
            oOverlapPositions = {
                "tltr": true,
                "blbr": true,
                "brbl": true,
                "trtl": true
            };
            var flipHorizontal = function () {
                var nNewX;
                if ((oPanel.cfg.getProperty("x") - scrollX) > nContextElX) {
                    nNewX = (nContextElX - nOverlayOffsetWidth);
                }
                else {
                    nNewX = (nContextElX + nContextElWidth);
                }
                oPanel.cfg.setProperty("x", (nNewX + scrollX), true);
                return nNewX;
            };
            var getDisplayRegionWidth = function () {
                if ((oPanel.cfg.getProperty("x") - scrollX) > nContextElX) {
                    return (nRightRegionWidth - nViewportOffset);
                }
                else {
                    return (nLeftRegionWidth - nViewportOffset);
                }
            };
            var setHorizontalPosition = function () {
                var nDisplayRegionWidth = getDisplayRegionWidth(),
                fnReturnVal;
                if (nOverlayOffsetWidth > nDisplayRegionWidth) {
                    if (bFlipped) {
                        flipHorizontal();
                    }
                    else {
                        flipHorizontal();
                        bFlipped = true;
                        fnReturnVal = setHorizontalPosition();
                    }
                }
                return fnReturnVal;
            };
            if (this.cfg.getProperty("preventcontextoverlap") && aContext &&
                    oOverlapPositions[(aContext[1] + aContext[2])]) {
                if (bCanConstrain) {
                    oContextEl = aContext[0];
                    nContextElX = Dom.getX(oContextEl) - scrollX;
                    nContextElWidth = oContextEl.offsetWidth;
                    nLeftRegionWidth = nContextElX;
                    nRightRegionWidth = (viewPortWidth - (nContextElX + nContextElWidth));
                    setHorizontalPosition();
                }
                xNew = this.cfg.getProperty("x");
            } else {
                if (bCanConstrain) {
                    leftConstraint = scrollX + nViewportOffset;
                    rightConstraint =
                        scrollX + viewPortWidth - nOverlayOffsetWidth - nViewportOffset;
                    if (x < leftConstraint) {
                        xNew = leftConstraint;
                    } else if (x > rightConstraint) {
                        xNew = rightConstraint;
                    }
                } else {
                    xNew = nViewportOffset + scrollX;
                }
            }
            return xNew;
        },
        getConstrainedY: function (y) {
            var oPanel = this,
            oPanelEl = oPanel.element,
            nOverlayOffsetHeight = oPanelEl.offsetHeight,
            nViewportOffset = Panel.VIEWPORT_OFFSET,
            viewPortHeight = Dom.getViewportHeight(),
            scrollY = Dom.getDocumentScrollTop(),
            bCanConstrain = (nOverlayOffsetHeight + nViewportOffset < viewPortHeight),
            aContext = this.cfg.getProperty("context"),
            oContextEl,
            nContextElY,
            nContextElHeight,
            bFlipped = false,
            nTopRegionHeight,
            nBottomRegionHeight,
            topConstraint,
            bottomConstraint,
            yNew = y,
            oOverlapPositions = {
                "trbr": true,
                "tlbl": true,
                "bltl": true,
                "brtr": true
            };
            var flipVertical = function () {
                var nNewY;
                if ((oPanel.cfg.getProperty("y") - scrollY) > nContextElY) {
                    nNewY = (nContextElY - nOverlayOffsetHeight);
                } else {    
                    nNewY = (nContextElY + nContextElHeight);
                }
                oPanel.cfg.setProperty("y", (nNewY + scrollY), true);
                return nNewY;
            };
            var getDisplayRegionHeight = function () {
                if ((oPanel.cfg.getProperty("y") - scrollY) > nContextElY) {
                    return (nBottomRegionHeight - nViewportOffset);
                } else {    
                    return (nTopRegionHeight - nViewportOffset);
                }
            };
            var setVerticalPosition = function () {
                var nDisplayRegionHeight = getDisplayRegionHeight(),
                fnReturnVal;
                if (nOverlayOffsetHeight > nDisplayRegionHeight) {
                    if (bFlipped) {
                        flipVertical();
                    } else {
                        flipVertical();
                        bFlipped = true;
                        fnReturnVal = setVerticalPosition();
                    }
                }
                return fnReturnVal;
            };
            if (this.cfg.getProperty("preventcontextoverlap") && aContext &&
                    oOverlapPositions[(aContext[1] + aContext[2])]) {
                if (bCanConstrain) {
                    oContextEl = aContext[0];
                    nContextElHeight = oContextEl.offsetHeight;
                    nContextElY = (Dom.getY(oContextEl) - scrollY);
                    nTopRegionHeight = nContextElY;
                    nBottomRegionHeight = (viewPortHeight - (nContextElY + nContextElHeight));
                    setVerticalPosition();
                }
                yNew = oPanel.cfg.getProperty("y");
            }
            else {
                if (bCanConstrain) {
                    topConstraint = scrollY + nViewportOffset;
                    bottomConstraint =
                        scrollY + viewPortHeight - nOverlayOffsetHeight - nViewportOffset;
                    if (y < topConstraint) {
                        yNew  = topConstraint;
                    } else if (y  > bottomConstraint) {
                        yNew  = bottomConstraint;
                    }
                } else {
                    yNew = nViewportOffset + scrollY;
                }
            }
            return yNew;
        },
        getConstrainedXY: function(x, y) {
            return [this.getConstrainedX(x), this.getConstrainedY(y)];
        },
        onCenter: function() {
        	this.centerCnt = this.centerCnt || 0;
        	this.centerLimitCnt = (Rui.platform.isMobile) ? 3 : 100000;
        	if(this.centerCnt < this.centerLimitCnt) this.center();
        	this.centerCnt++;
        },
        center: function (centerIn) {
            var el = Rui.get(this.element);
            if(this.cfg.getProperty("visible") == true)
                el.removeClass('L-hidden');
            var xy = el.getAlignToXY(centerIn || document, 'c-c');
            if(Rui.platform.isMobile && xy && xy[1] < 0) xy[1] = 0;
            this.cfg.setProperty("xy", xy);
            this.cfg.refireEvent("iframe");
        },
        syncPosition: function () {
            var pos = Dom.getXY(this.element);
            this.cfg.setProperty("x", pos[0], true);
            this.cfg.setProperty("y", pos[1], true);
            this.cfg.setProperty("xy", pos, true);
        },
        onDomResize: function (e, obj) {
            var me = this;
            var nLeft = -1 * me.resizeMonitor.offsetWidth,
            nTop = -1 * me.resizeMonitor.offsetHeight;
            me.resizeMonitor.style.top = nTop + "px";
            me.resizeMonitor.style.left =  nLeft + "px";
            setTimeout(function () {
                me.syncPosition();
                me.cfg.refireEvent("iframe");
                me.cfg.refireEvent("context");
            }, 0);
        },
        _getComputedHeight: (function() {
            if (document.defaultView && document.defaultView.getComputedStyle){
                return function(el){
                    var height = null;
                    if (el.ownerDocument && el.ownerDocument.defaultView){
                        var computed = el.ownerDocument.defaultView.getComputedStyle(el,'');
                        if (computed){
                            height = parseInt(computed.height, 10);
                        }
                    }
                    return (Rui.isNumber(height)) ? height : null;
                };
            } else {
                return function(el){
                    var height = null;
                    if (el.style.pixelHeight){
                        height = el.style.pixelHeight;
                    }
                    return (Rui.isNumber(height)) ? height : null;
                };
            }
        })(),
        _getPreciseHeight: function(el) {
            var height = el.offsetHeight;
            if (el.getBoundingClientRect) {
                var rect = el.getBoundingClientRect();
                height = rect.bottom - rect.top;
            }
            return height;
        },
        fillHeight: function(el) {
            if (el) {
                var container = this.innerElement || this.element,
                containerEls = [this.header, this.body, this.footer],
                containerEl,
                total = 0,
                filled = 0,
                remaining = 0,
                validEl = false;
                for (var i = 0, l = containerEls.length; i < l; i++) {
                    containerEl = containerEls[i];
                    if (containerEl) {
                        if (el !== containerEl) {
                            filled += this._getPreciseHeight(containerEl);
                        } else {
                            validEl = true;
                        }
                    }
                }
                if (validEl) {
                    if (Rui.browser.msie || Rui.browser.opera) {
                        Dom.setStyle(el, 'height', 0 + 'px');
                    }
                    total = this._getComputedHeight(container);
                    if (total === null) {
                        Dom.addClass(container, "L-override-padding");
                        total = container.clientHeight; 
                        Dom.removeClass(container, "L-override-padding");
                    }
                    remaining = total - filled;
                    Dom.setStyle(el, "height", remaining + "px");
                    if (el.offsetHeight != 0 && el.offsetHeight != remaining) {
                        remaining = remaining - (el.offsetHeight - remaining);
                        Dom.setStyle(el, "height", remaining + "px");
                    }
                }
            }
        },
        bringToTop: function () {
            var aOverlays = [],
            oElement = this.element;
            function compareZIndexDesc(p_oPanel1, p_oPanel2) {
                var sZIndex1 = Dom.getStyle(p_oPanel1, "zIndex"),
                sZIndex2 = Dom.getStyle(p_oPanel2, "zIndex"),
                nZIndex1 = (!sZIndex1 || isNaN(sZIndex1)) ? 0 : parseInt(sZIndex1, 10),
                        nZIndex2 = (!sZIndex2 || isNaN(sZIndex2)) ? 0 : parseInt(sZIndex2, 10);
                if (nZIndex1 > nZIndex2) {
                    return -1;
                } else if (nZIndex1 < nZIndex2) {
                    return 1;
                } else {
                    return 0;
                }
            }
            function isOverlayElement(p_oElement) {
                var CSS_OVERLAY = "L-overlay";
                var isOverlay = Dom.hasClass(p_oElement, CSS_OVERLAY),
                Panel = Rui.ui.LPanel;
                if (isOverlay && !Dom.isAncestor(oElement, p_oElement)) {
                    if (Panel && Dom.hasClass(p_oElement, "L-panel")) {
                        aOverlays[aOverlays.length] = p_oElement;
                    } else {
                        aOverlays[aOverlays.length] = p_oElement.parentNode;
                    }
                }
            }
            Dom.getElementsBy(isOverlayElement, "DIV", document.body);
            aOverlays.sort(compareZIndexDesc);
            var oTopOverlay = aOverlays[0],
            nTopZIndex;
            if(oTopOverlay == document.body) oTopOverlay = aOverlays[1];
            if (oTopOverlay) {
                nTopZIndex = Dom.getStyle(oTopOverlay, "zIndex");
                if (!isNaN(nTopZIndex)) {
                    var bRequiresBump = false;
                    if (oTopOverlay != oElement) {
                        bRequiresBump = true;
                    } else if (aOverlays.length > 1) {
                        var nNextZIndex = Dom.getStyle(aOverlays[1], "zIndex");
                        if (!isNaN(nNextZIndex) && (nTopZIndex == nNextZIndex)) {
                            bRequiresBump = true;
                        }
                    }
                    if (bRequiresBump) {
                        this.cfg.setProperty("zindex", (parseInt(nTopZIndex, 10) + 2));
                    }
                }
            }
        },
        doRender: function(container) {
            Rui.ui.LPanel.superclass.doRender.call(this, container);
            Dom.addClass(this.element, "L-panel");
            this.buildWrapper();
            if(typeof this.id === 'string' ) Dom.addClass(this.element, this.id);
            if(this.defaultCss)
                Dom.addClass(this.element, this.defaultCss);
            this.fireEvent('init', {target: this});
        },
        afterRender: function(container) {
            Rui.ui.LPanel.superclass.afterRender.call(this,container);
        },
        createHeader: function(p_sType, p_aArgs) {
            if (!this.header && this.cfg.getProperty("draggable")) {
                this.setHeader("&#160;");
            }
        },
        restoreOriginalWidth: function(p_sType, p_aArgs, p_oObject) {
            var sOriginalWidth = p_oObject[0],
            sNewWidth = p_oObject[1],
            oConfig = this.cfg,
            sCurrentWidth = oConfig.getProperty("width");
            if (sCurrentWidth == sNewWidth) {
                oConfig.setProperty("width", sOriginalWidth);
            }
            this.unOn('hide', this.restoreOriginalWidth, p_oObject);
        },
        _onElementFocus: function(e){
            var target = Event.getTarget(e);
            if (target !== this.element && !Dom.isAncestor(this.element, target) && _currentModal == this) {
                try {
                    if (this.firstElement) {
                        Rui.later(100, this, function(){
                            try {
                                this.firstElement.focus();
                            } catch(e1) {}
                        });
                    } else {
                        if (this._modalFocus) {
                            this._modalFocus.focus();
                        } else {
                            this.innerElement.focus();
                        }
                    }
                } catch(err){
                    try {
                        if (target !== document && target !== document.body && target !== window) {
                            target.blur();
                        }
                    } catch(err2) { }
                }
            }
        },
        _addFocusHandlers: function(p_sType, p_aArgs) {
            if (!this.firstElement) {
                if (Rui.browser.webkit || Rui.browser.opera) {
                    if (!this._modalFocus) {
                        this._createHiddenFocusElement();
                    }
                } else {
                    this.innerElement.tabIndex = 0;
                }
            }
            this.setTabLoop(this.firstElement, this.lastElement);
            Event.onFocus(document.documentElement, this._onElementFocus, this, true);
            _currentModal = this;
        },
        _createHiddenFocusElement: function() {
            var e = document.createElement("button");
            e.style.height = "1px";
            e.style.width = "1px";
            e.style.position = "absolute";
            e.style.left = "-10000em";
            e.style.opacity = 0;
            e.tabIndex = "-1";
            this.innerElement.appendChild(e);
            this._modalFocus = e;
        },
        _removeFocusHandlers: function(p_sType, p_aArgs) {
            Event.removeFocusListener(document.documentElement, this._onElementFocus, this);
            if (_currentModal == this) {
                _currentModal = null;
            }
        },
        focusFirst: function (type, args, obj) {
            var el = this.firstElement;
            if (args && args[1]) {
                Event.stopEvent(args[1]);
            }
            if (el) {
                try {
                    el.focus();
                } catch(err) {
                }
            }
        },
        focusLast: function (type, args, obj) {
            var el = this.lastElement;
            if (args && args[1]) {
                Event.stopEvent(args[1]);
            }
            if (el) {
                try {
                    el.focus();
                } catch(err) {
                }
            }
        },
        setTabLoop: function(firstElement, lastElement) {
            var backTab = this.preventBackTab, tab = this.preventTabOut;
            if (backTab) {
                backTab.disable();
                this.unOn('show', backTab.enable, backTab);
                this.unOn('hide', backTab.disable, backTab);
                backTab = this.preventBackTab = null;
            }
            if (tab) {
                tab.disable();
                this.unOn('show', tab.enable, tab);
                this.unOn('hide', tab.disable,tab);
                tab = this.preventTabOut = null;
            }
            if (firstElement) {
                this.preventBackTab = new LKeyListener(firstElement,
                        {shift:true, keys:9},
                        {fn:this.focusLast, scope:this, correctScope:true}
                );
                backTab = this.preventBackTab;
                this.on('show', backTab.enable, backTab, true);
                this.on('hide', backTab.disable,backTab, true);
            }
            if (lastElement) {
                this.preventTabOut = new LKeyListener(lastElement,
                        {shift:false, keys:9},
                        {fn:this.focusFirst, scope:this, correctScope:true}
                );
                tab = this.preventTabOut;
                this.on('show', tab.enable, tab, true);
                this.on('hide', tab.disable,tab, true);
            }
        },
        getFocusableElements: function(root) {
            root = root || this.innerElement;
            var FOCUSABLE = [
                             "a",
                             "button",
                             "select",
                             "textarea",
                             "input",
                             "iframe"
                             ];
            var focusable = {};
            for (var i = 0; i < FOCUSABLE.length; i++) {
                focusable[FOCUSABLE[i]] = true;
            }
            function isFocusable(el) {
                if (el.focus && el.type !== "hidden" && !el.disabled && focusable[el.tagName.toLowerCase()]) {
                    return true;
                }
                return false;
            }
            return Dom.getElementsBy(isFocusable, null, root);
        },
        setFirstLastFocusable: function() {
            this.firstElement = null;
            this.lastElement = null;
            var elements = this.getFocusableElements();
            this.focusableElements = elements;
            if (elements.length > 0) {
                this.firstElement = elements[0];
                this.lastElement = elements[elements.length - 1];
            }
            if (this.cfg.getProperty("modal")) {
                this.setTabLoop(this.firstElement, this.lastElement);
            }
        },
        initComponent: function(oConfig){
            Rui.ui.LPanel.superclass.initComponent.call(this);
            if (this.isSecure) {
                this.imageRoot = Panel.IMG_ROOT_SSL;
            }
            if(!this.id) this.id = Rui.useFixedId() ? Rui.id(this.el, 'LPanel-' + this.id) : Rui.id();
        },
        initEvents: function () {
            Rui.ui.LPanel.superclass.initEvents.call(this);
            var EVENT_TYPES = {
                    "RENDER": "render",
                    "DRAG": "drag"
            };
            var SIGNATURE = LCustomEvent.LIST;
            this.createEvent('beforeInit');
            this.createEvent('init');
            this.createEvent('beforeRender');
            this.renderEvent.signature = SIGNATURE;
            this.createEvent('changeHeader');
            this.createEvent('changeBody');
            this.createEvent('changeFooter');
            this.createEvent('changeContent');
            this.createEvent('beforeShow');
            this.createEvent('beforeHide');
            this.createEvent('showMask');
            this.createEvent('hideMask');
            this.dragEvent = this.createEvent(EVENT_TYPES.DRAG, { isCE: true });
            this.dragEvent.signature = SIGNATURE;
            this.createEvent('beforeMove');
            this.on('showMask', this._addFocusHandlers, this, true);
            this.on('hideMask', this._removeFocusHandlers, this, true);
            this.on('beforeRender', this.createHeader, this, true);
            this.renderEvent.on( function() {
                this.setFirstLastFocusable();
                this.on('changeContent', this.setFirstLastFocusable, this, true);
            }, this, true, {isCE:true});
            this.on('show', this.focusFirst, this, true);
        },
        _initConfig: function () {
            this.cfg.addProperty(DEFAULT_CONFIG.VISIBLE.key, {
                handler: this.configVisible,
                value: DEFAULT_CONFIG.VISIBLE.value,
                validator: DEFAULT_CONFIG.VISIBLE.validator
            });
            this.cfg.addProperty(DEFAULT_CONFIG.EFFECT.key, {
                suppressEvent: DEFAULT_CONFIG.EFFECT.suppressEvent,
                supercedes: DEFAULT_CONFIG.EFFECT.supercedes
            });
            this.cfg.addProperty(DEFAULT_CONFIG.MONITOR_RESIZE.key, {
                handler: this.configMonitorResize,
                value: DEFAULT_CONFIG.MONITOR_RESIZE.value
            });
            this.cfg.addProperty(DEFAULT_CONFIG.X.key, {
                handler: this.configX,
                validator: DEFAULT_CONFIG.X.validator,
                suppressEvent: DEFAULT_CONFIG.X.suppressEvent,
                supercedes: DEFAULT_CONFIG.X.supercedes
            });
            this.cfg.addProperty(DEFAULT_CONFIG.Y.key, {
                handler: this.configY,
                validator: DEFAULT_CONFIG.Y.validator,
                suppressEvent: DEFAULT_CONFIG.Y.suppressEvent,
                supercedes: DEFAULT_CONFIG.Y.supercedes
            });
            this.cfg.addProperty(DEFAULT_CONFIG.XY.key, {
                handler: this.configXY,
                suppressEvent: DEFAULT_CONFIG.XY.suppressEvent,
                supercedes: DEFAULT_CONFIG.XY.supercedes
            });
            this.cfg.addProperty(DEFAULT_CONFIG.CONTEXT.key, {
                handler: this.configContext,
                suppressEvent: DEFAULT_CONFIG.CONTEXT.suppressEvent,
                supercedes: DEFAULT_CONFIG.CONTEXT.supercedes
            });
            this.cfg.addProperty(DEFAULT_CONFIG.FIXED_CENTER.key, {
                handler: this.configFixedCenter,
                value: DEFAULT_CONFIG.FIXED_CENTER.value,
                validator: DEFAULT_CONFIG.FIXED_CENTER.validator,
                supercedes: DEFAULT_CONFIG.FIXED_CENTER.supercedes
            });
            this.cfg.addProperty(DEFAULT_CONFIG.AUTO_FILL_HEIGHT.key, {
                handler: this.configAutoFillHeight,
                value: DEFAULT_CONFIG.AUTO_FILL_HEIGHT.value,
                validator: this._validateAutoFill,
                suppressEvent: DEFAULT_CONFIG.AUTO_FILL_HEIGHT.suppressEvent,
                supercedes: DEFAULT_CONFIG.AUTO_FILL_HEIGHT.supercedes
            });
            this.cfg.addProperty(DEFAULT_CONFIG.ZINDEX.key, {
                handler: this.configzIndex,
                value: DEFAULT_CONFIG.ZINDEX.value
            });
            this.cfg.addProperty(DEFAULT_CONFIG.IFRAME.key, {
                handler: this.configIframe,
                value: DEFAULT_CONFIG.IFRAME.value,
                validator: DEFAULT_CONFIG.IFRAME.validator,
                supercedes: DEFAULT_CONFIG.IFRAME.supercedes
            });
            this.cfg.addProperty(DEFAULT_CONFIG.PREVENT_CONTEXT_OVERLAP.key, {
                value: DEFAULT_CONFIG.PREVENT_CONTEXT_OVERLAP.value,
                validator: DEFAULT_CONFIG.PREVENT_CONTEXT_OVERLAP.validator,
                supercedes: DEFAULT_CONFIG.PREVENT_CONTEXT_OVERLAP.supercedes
            });
        },
        initDefaultConfig: function () {
            Rui.ui.LPanel.superclass.initDefaultConfig.call(this);
            this._initConfig();
            this.cfg.addProperty('header', {
                handler: this.configHeader,
                value: this.header
            });
            this.cfg.addProperty('footer', {
                handler: this.configFooter,
                value: this.footer
            });
            this.cfg.addProperty(DEFAULT_CONFIG.CLOSE.key, {
                handler: this.configClose,
                value: DEFAULT_CONFIG.CLOSE.value,
                validator: DEFAULT_CONFIG.CLOSE.validator,
                supercedes: DEFAULT_CONFIG.CLOSE.supercedes
            });
            this.cfg.addProperty(DEFAULT_CONFIG.DRAGGABLE.key, {
                handler: this.configDraggable,
                value: (Rui.dd.LDD) ? true : false,
                        validator: DEFAULT_CONFIG.DRAGGABLE.validator,
                        supercedes: DEFAULT_CONFIG.DRAGGABLE.supercedes
            });
            this.cfg.addProperty(DEFAULT_CONFIG.DRAG_ONLY.key, {
                value: DEFAULT_CONFIG.DRAG_ONLY.value,
                validator: DEFAULT_CONFIG.DRAG_ONLY.validator,
                supercedes: DEFAULT_CONFIG.DRAG_ONLY.supercedes
            });
            this.cfg.addProperty(DEFAULT_CONFIG.UNDERLAY.key, {
                handler: this.configUnderlay,
                value: DEFAULT_CONFIG.UNDERLAY.value,
                supercedes: DEFAULT_CONFIG.UNDERLAY.supercedes
            });
            this.cfg.addProperty(DEFAULT_CONFIG.MODAL.key, {
                handler: this.configModal,
                value: DEFAULT_CONFIG.MODAL.value,
                validator: DEFAULT_CONFIG.MODAL.validator,
                supercedes: DEFAULT_CONFIG.MODAL.supercedes
            });
            this.cfg.addProperty(DEFAULT_CONFIG.KEY_LISTENERS.key, {
                handler: this.configKeyListeners,
                suppressEvent: DEFAULT_CONFIG.KEY_LISTENERS.suppressEvent,
                supercedes: DEFAULT_CONFIG.KEY_LISTENERS.supercedes
            });
            this.cfg.addProperty(DEFAULT_CONFIG.STRINGS.key, {
                value:DEFAULT_CONFIG.STRINGS.value,
                handler:this.configStrings,
                validator:DEFAULT_CONFIG.STRINGS.validator,
                supercedes:DEFAULT_CONFIG.STRINGS.supercedes
            });
        },
        _validateAutoFillHeight: function(val) {
            return (!val) || (Rui.isString(val) && Panel.STD_MOD_RE.test(val));
        },
        configHeader: function(type, args, obj){
            if(this.header && typeof this.header === 'string'){
                var tmpHeader = this.createModuleHeader();
                tmpHeader.innerHTML = this.header;
                this.header = tmpHeader;
            } else if(this.header != null && !Dom.hasClass(this.header, Panel.CSS_HEADER)){
                var me = this.header;
                var oHeader = this.header = this.createModuleHeader();
                if (me.nodeName) {
                    oHeader.innerHTML = "";
                    oHeader.appendChild(me);
                } else {
                    oHeader.innerHTML = me;
                }
                if(this._rendered) {
                    this._renderHeader();
                }
                this._applyContent('changeHeader', me);
            }
        },
        configFooter: function(type, args, obj){
            if(this.footer && typeof this.footer === 'string'){
                var tmpFooter = this.createFooter();
                tmpFooter.innerHTML = this.footer;
                this.footer = tmpFooter;
            }else if(this.footer != null && !Dom.hasClass(this.footer, Panel.CSS_FOOTER)){
                var me = this.footer;
                var oFooter = this.footer = this.createFooter();
                if (me.nodeName) {
                    oFooter.innerHTML = "";
                    oFooter.appendChild(me);
                } else {
                    oFooter.innerHTML = me;
                }
                if(this._rendered) {
                    this._renderFooter();
                }
                this._applyContent('changeFooter', me);
            }
        },
        configClose: function (type, args, obj) {
            var val = args[0],
            oClose = this.close,
            strings = this.cfg.getProperty("strings");
            if (val) {
                if (!oClose || this.close) {
                    if (!this.m_oCloseIconTemplate) {
                        this.m_oCloseIconTemplate = document.createElement("a");
                        this.m_oCloseIconTemplate.className = "container-close";
                        this.m_oCloseIconTemplate.href = "#";
                    }
                    oClose = this.m_oCloseIconTemplate.cloneNode(true);
                    this.innerElement.appendChild(oClose);
                    oClose.innerHTML = (strings && strings.close) ? strings.close : "&#160;";
                    Event.on(oClose, "click", this._doClose, this, true);
                    this.close = oClose;
                    if(Rui.useAccessibility())
                        this.close.setAttribute('aria-controls', this.el.id);
                } else {
                    oClose.style.display = "block";
                }
            } else {
                if (oClose) {
                    oClose.style.display = "none";
                }
            }
        },
        _doClose: function (e) {
            Event.preventDefault(e);
            this.hide(false);
        },
        configDraggable: function (type, args, obj) {
            var val = args[0];
            if (val) {
                if (!Rui.dd.LDD) {
                    this.cfg.setProperty("draggable", false);
                    return;
                }
                if (this.header) {
                    Dom.setStyle(this.header, "cursor", "move");
                    this.registerDragDrop();
                }
            } else {
                if (this.dd) {
                    this.dd.unreg();
                }
                if (this.header) {
                    Dom.setStyle(this.header,"cursor","auto");
                }
            }
        },
        configUnderlay: function (type, args, obj) {
return;
            var bMacGecko = (Rui.platform.mac && Rui.browser.gecko),
            sUnderlay = args[0].toLowerCase(),
            oUnderlay = this.underlay,
            oElement = this.element;
            function fixWebkitUnderlay() {
                var u = this.underlay;
                Dom.addClass(u, "L-force-redraw");
                window.setTimeout(function(){Dom.removeClass(u, "L-force-redraw");}, 0);
            }
            function createUnderlay() {
                if (!oUnderlay) { 
                    if (!this.m_oUnderlayTemplate) {
                        this.m_oUnderlayTemplate = document.createElement("div");
                        this.m_oUnderlayTemplate.className = "underlay";
                    }
                    oUnderlay = this.m_oUnderlayTemplate.cloneNode(false);
                    this.element.appendChild(oUnderlay);
                    this.underlay = oUnderlay;
                    if (bIEQuirks) {
                        this.sizeUnderlay();
                        this.cfg.subscribeToConfigEvent("width", this.sizeUnderlay);
                        this.cfg.subscribeToConfigEvent("height", this.sizeUnderlay);
                        this.on('changeContent', this.sizeUnderlay, this, true);
                        Panel.textResizeEvent.on(this.sizeUnderlay, this, true, {isCE:true});
                    }
                    if (Rui.browser.webkit && Rui.browser.webkit < 420) {
                        this.on('changeContent', fixWebkitUnderlay, this, true);
                    }
                }
            }
            function onBeforeShow() {
                var bNew = createUnderlay.call(this);
                if (!bNew && bIEQuirks) {
                    this.sizeUnderlay();
                }
                this._underlayDeferred = false;
            }
            function destroyUnderlay() {
                if (this._underlayDeferred) {
                    this.unOn('beforeShow', onBeforeShow, this);
                    this._underlayDeferred = false;
                }
                if (oUnderlay) {
                    this.cfg.unsubscribeFromConfigEvent("width", this.sizeUnderlay);
                    this.cfg.unsubscribeFromConfigEvent("height",this.sizeUnderlay);
                    this.unOn('changeContent', this.sizeUnderlay,this);
                    this.unOn('changeContent', fixWebkitUnderlay,this);
                    Panel.textResizeEvent.unOn(this.sizeUnderlay,this);
                    this.element.removeChild(oUnderlay);
                    this.underlay = null;
                }
            }
            switch (sUnderlay) {
            case "shadow":
                Dom.removeClass(oElement, "matte");
                Dom.addClass(oElement, "shadow");
                break;
            case "matte":
                if (!bMacGecko) {
                    destroyUnderlay.call(this);
                }
                Dom.removeClass(oElement, "shadow");
                Dom.addClass(oElement, "matte");
                break;
            default:
                if (!bMacGecko) {
                    destroyUnderlay.call(this);
                }
            Dom.removeClass(oElement, "shadow");
            Dom.removeClass(oElement, "matte");
            break;
            }
            if ((sUnderlay == "shadow") || (bMacGecko && !oUnderlay)) {
                if (this.cfg.getProperty("visible")) {
                    var bNew = createUnderlay.call(this);
                    if (!bNew && bIEQuirks) {
                        this.sizeUnderlay();
                    }
                } else {
                    if (!this._underlayDeferred) {
                        this.on('beforeShow', onBeforeShow, this, true);
                        this._underlayDeferred = true;
                    }
                }
            }
        },
        configModal: function (type, args, obj) {
            var modal = args[0];
            if (modal) {
                if (!this._hasModalityEventListeners) {
                    this.on('beforeShow', this.buildMask, this, true);
                    this.on('beforeShow',this.bringToTop, this, true);
                    this.on('beforeShow', this.showMask, this, true);
                    this.on('hide', this.hideMask, this, true);
                    Panel.windowResizeEvent.on(this.sizeMask,
                            this, true,{isCE:true});
                    this._hasModalityEventListeners = true;
                }
            } else {
                if (this._hasModalityEventListeners) {
                    if (this.cfg.getProperty("visible")) {
                        this.hideMask();
                        this.removeMask();
                    }
                    this.unOn('beforeShow', this.buildMask, this);
                    this.unOn('beforeShow', this.bringToTop, this);
                    this.unOn('beforeShow', this.showMask, this);
                    this.unOn('hide', this.hideMask, this);
                    Panel.windowResizeEvent.unOn(this.sizeMask, this);
                    this._hasModalityEventListeners = false;
                }
            }
        },
        removeMask: function () {
            var oMask = this.mask,
            oParentNode;
            if (oMask) {
                this.hideMask();
                oParentNode = oMask.parentNode;
                if (oParentNode) {
                    oParentNode.removeChild(oMask);
                }
                this.mask = null;
            }
        },
        configKeyListeners: function (type, args, obj) {
            var listeners = args[0],
            listener, nListeners, i;
            if (listeners) {
                if (listeners instanceof Array) {
                    nListeners = listeners.length;
                    for (i = 0; i < nListeners; i++) {
                        listener = listeners[i];
                        if (!this.hasEvent('show', listener.enable, listener)) {
                            this.on('show', listener.enable, listener, true);
                        }
                        if (!this.hasEvent('hide', listener.disable, listener)) {
                            this.on('hide', listener.disable, listener, true);
                            this.on('destroy', listener.disable, listener, true);
                        }
                    }
                } else {
                    if(listeners === true) {
                        listeners = new Rui.util.LKeyListener(
                                this.element,
                                { keys: [ Rui.util.LKey.KEY.ESCAPE ] },
                                {
                                    fn: function(e){
                                        this.hide();
                                    },
                                    scope: this,
                                    correctScope: true
                                }
                        );
                    }
                    if (!this.hasEvent('show', listeners.enable, listeners)) {
                        this.on('show',listeners.enable, listeners, true);
                    }
                    if (!this.hasEvent('hide', listeners.disable, listeners)) {
                        this.on('hide',listeners.disable, listeners, true);
                        this.on('destroy', listeners.disable, listeners, true);
                    }
                }
            }
        },
        configStrings: function(type, args, obj) {
            var val = Rui.merge(DEFAULT_CONFIG.STRINGS.value, args[0]);
            this.cfg.setProperty(DEFAULT_CONFIG.STRINGS.key, val, true);
        },
        _setHeight: function(type, args, obj) {
            Rui.ui.LPanel.superclass._setHeight.apply(this, arguments);
            this.cfg.refireEvent("iframe");
        },
        _setWidth: function(type, args, obj) {
            Rui.ui.LPanel.superclass._setWidth.apply(this, arguments);
            this.cfg.refireEvent("iframe");
        },
        _autoFillOnHeightChange: function(type, args, el) {
            if (!this.delayfillHeight) {
                this.delayfillHeight = new Rui.util.LDelayedTask(function(){
                    this.fillHeight(el);
                    this.delayfillHeight = null;
                }, this);
                this.delayfillHeight.delay(100);
            }
            if (bIEQuirks) {
                this.sizeUnderlay();
            }
        },
        _setTop: function(type, args, obj) {
            var top = args[0];
            this.element.style.top = top + 'px';
        },
        _setLeft: function(type, args, obj) {
            var left = args[0];
            this.element.style.left = left + 'px';
        },
        configFixedCenter: function (type, args, obj) {
            var val = args[0],
            alreadySubscribed = Config.alreadySubscribed,
            windowResizeEvent = Panel.windowResizeEvent,
            windowScrollEvent = Panel.windowScrollEvent;
            if (val) {
                this.onCenter();
                if (!this.hasEvent('beforeShow', this.onCenter, this)) {
                    this.on('beforeShow', this.onCenter, this, true);
                }
                if (!alreadySubscribed(windowResizeEvent, this.doCenterOnDOMEvent, this)) {
                    windowResizeEvent.on(this.doCenterOnDOMEvent, this, true, {isCE:true});
                }
                if (!alreadySubscribed(windowScrollEvent, this.doCenterOnDOMEvent, this)) {
                    windowScrollEvent.on(this.doCenterOnDOMEvent, this, true, {isCE:true});
                }
            } else {
                this.unOn('beforeShow', this.onCenter, this);
                windowResizeEvent.unOn(this.doCenterOnDOMEvent, this);
                windowScrollEvent.unOn(this.doCenterOnDOMEvent, this);
            }
        },
        configzIndex: function (type, args, obj) {
            this.configzIndexOverlay(type,args,obj); 
            if (this.mask || this.cfg.getProperty("modal") === true) {
                var panelZ = Dom.getStyle(this.element, "zIndex");
                if (!panelZ || isNaN(panelZ)) {
                    panelZ = 0;
                }
                if (panelZ === 0) {
                    this.cfg.setProperty("zIndex", 1);
                } else {
                    this.stackMask();
                }
            }
        },
        configzIndexOverlay: function (type, args, obj) {
            var zIndex = args[0],
            el = this.element;
            if (! zIndex) {
                zIndex = Dom.getStyle(el, "zIndex");
                if (! zIndex || isNaN(zIndex)) {
                    zIndex = 0;
                }
            }
            if (this.iframe || this.cfg.getProperty("iframe") === true) {
                if (zIndex <= 0) {
                    zIndex = 1;
                }
            }
            if(Rui._tabletViewerEl) zIndex += 10;
            Dom.setStyle(el, "zIndex", zIndex);
            this.cfg.setProperty("zIndex", zIndex, true);
            if (this.iframe) {
                this.stackIframe();
            }
        },
        buildWrapper: function () {
        	this.innerElement = this.element;
            var CSS_PANEL_CONTAINER = "L-panel-container";
        	Dom.addClass(this.element, CSS_PANEL_CONTAINER);
        	return;
            var elementParent = this.element.parentNode,
            originalElement = this.element,
            wrapper = document.createElement("div");
            wrapper.className = CSS_PANEL_CONTAINER;
            wrapper.id = originalElement.id + "_c";
            if (elementParent) {
                elementParent.insertBefore(wrapper, originalElement);
            }
            wrapper.appendChild(originalElement);
            this.element = wrapper;
            this.innerElement = originalElement;
            Dom.setStyle(this.innerElement, "visibility", "inherit");
        },
        setTop: function(y) {
          this.cfg.setProperty('top', y);
        },
        setLeft: function(x){
          this.cfg.setProperty('left', x);
        },
        sizeUnderlay: function () {
            var oUnderlay = this.underlay,oElement;
            if (oUnderlay) {
                oElement = this.element;
                oUnderlay.style.width = oElement.offsetWidth + "px";
                oUnderlay.style.height = oElement.offsetHeight + "px";
            }
        },
        registerDragDrop: function () {
            var me = this;
            if (this.header) {
                if (!Rui.dd.LDD) {
                    return;
                }
                var bDragOnly = (this.cfg.getProperty("dragonly") === true);
                this.dd = new Rui.dd.LDD({
                    id: this.element.id,
                    group: this.id,
                    attributes: {dragOnly: bDragOnly}
                });
                if (!this.header.id) {
                    this.header.id = this.id + "_h";
                }
                this.dd.startDrag = function () {
                    var offsetHeight,
                    offsetWidth,
                    viewPortWidth,
                    viewPortHeight,
                    scrollX,
                    scrollY;
                    if (Rui.browser.msie == 6) {
                        Dom.addClass(me.element,"drag");
                    }
                    if (me.cfg.getProperty("constraintoviewport")) {
                        var nViewportOffset = Panel.VIEWPORT_OFFSET;
                        offsetHeight = me.element.offsetHeight;
                        offsetWidth = me.element.offsetWidth;
                        viewPortWidth = Dom.getViewportWidth();
                        viewPortHeight = Dom.getViewportHeight();
                        scrollX = Dom.getDocumentScrollLeft();
                        scrollY = Dom.getDocumentScrollTop();
                        if (offsetHeight + nViewportOffset < viewPortHeight) {
                            this.minY = scrollY + nViewportOffset;
                            this.maxY = scrollY + viewPortHeight - offsetHeight - nViewportOffset;
                        } else {
                            this.minY = scrollY + nViewportOffset;
                            this.maxY = scrollY + nViewportOffset;
                        }
                        if (offsetWidth + nViewportOffset < viewPortWidth) {
                            this.minX = scrollX + nViewportOffset;
                            this.maxX = scrollX + viewPortWidth - offsetWidth - nViewportOffset;
                        } else {
                            this.minX = scrollX + nViewportOffset;
                            this.maxX = scrollX + nViewportOffset;
                        }
                        this.constrainX = true;
                        this.constrainY = true;
                    } else {
                        this.constrainX = false;
                        this.constrainY = false;
                    }
                    me.dragEvent.fire("startDrag", arguments);
                };
                this.dd.onDrag = function () {
                    me.syncPosition();
                    me.cfg.refireEvent("iframe");
                    if (Rui.platform.mac && Rui.browser.gecko) {
                        me.showMacGeckoScrollbars();
                    }
                    me.dragEvent.fire("onDrag", arguments);
                };
                this.dd.endDrag = function () {
                    if (Rui.browser.msie == 6) {
                        Dom.removeClass(me.element,"drag");
                    }
                    me.dragEvent.fire("endDrag", arguments);
                    me.fireEvent('move', me.cfg.getProperty("xy"));
                };
                this.dd.setHandleElId(this.header.id);
                this.dd.addInvalidHandleType("INPUT");
                this.dd.addInvalidHandleType("SELECT");
                this.dd.addInvalidHandleType("TEXTAREA");
            }
        },
        buildMask: function () {
            var oMask = this.mask;
            if (!oMask) {
                if (!this.m_oMaskTemplate) {
                    this.m_oMaskTemplate = document.createElement("div");
                    this.m_oMaskTemplate.className = "mask";
                    this.m_oMaskTemplate.innerHTML = "&#160;";
                }
                oMask = this.m_oMaskTemplate.cloneNode(true);
                oMask.id = this.id + "_mask";
                document.body.insertBefore(oMask, document.body.firstChild);
                this.mask = oMask;
                if (Rui.browser.gecko && Rui.platform.mac) {
                    Dom.addClass(this.mask, "block-scrollbars");
                }
                this.stackMask();
            }
        },
        hideMask: function () {
            if (this.cfg.getProperty("modal") && this.mask) {
                this.mask.style.display = "none";
                Dom.removeClass(document.body, "masked");
                this.fireEvent('hideMask', {target:this});
            }
        },
        showMask: function () {
            if (this.cfg.getProperty("modal") && this.mask) {
                Dom.addClass(document.body, "masked");
                this.sizeMask();
                this.mask.style.display = "block";
                this.fireEvent('showMask', {target:this});
            }
        },
        sizeMask: function () {
            if (this.mask) {
                var viewWidth = Dom.getViewportWidth(),
                viewHeight = Dom.getViewportHeight();
                this.mask.style.width = "100%";
                if (this.mask.offsetWidth > viewWidth)
                    this.mask.style.width = viewWidth + "px";
                this.mask.style.height = "100%";
                if (this.mask.offsetHeight > viewHeight)
                	this.mask.style.height = viewHeight + "px";
                if(Rui._tabletData) this.mask.style.height = "110%";
            }
        },
        stackMask: function() {
            if (this.mask) {
                var panelZ = Dom.getStyle(this.element, "zIndex");
                if (!Rui.isUndefined(panelZ) && !isNaN(panelZ)) {
                    Dom.setStyle(this.mask, "zIndex", panelZ - 1);
                }
            }
        },
        configVisible: function (type, args, obj) {
            var visible = args[0],
            currentVis = Dom.getStyle(this.element, "visibility"),
            effect = this.cfg.getProperty("effect"),
            effectInstances = [],
            isMacGecko = (Rui.platform.mac && Rui.browser.gecko),
            alreadySubscribed = Config.alreadySubscribed,
            eff, ei, e, i, j, k, h,
            nEffects,
            nEffectInstances;
            if (currentVis == "inherit") {
                e = this.element.parentNode;
                while (e.nodeType != 9 && e.nodeType != 11) {
                    currentVis = Dom.getStyle(e, "visibility");
                    if (currentVis != "inherit") {
                        break;
                    }
                    e = e.parentNode;
                }
                if (currentVis == "inherit") {
                    currentVis = "visible";
                }
            }
            if (effect) {
                if (effect instanceof Array) {
                    nEffects = effect.length;
                    for (i = 0; i < nEffects; i++) {
                        eff = effect[i];
                        effectInstances[effectInstances.length] =
                            eff.effect(this, eff.duration);
                    }
                } else {
                    effectInstances[effectInstances.length] =
                        effect.effect(this, effect.duration);
                }
            }
            if (visible) { 
                if (isMacGecko) {
                    this.showMacGeckoScrollbars();
                }
                if (effect) { 
                    if (visible) { 
                        if (currentVis != "visible" || currentVis === "") {
                            this.fireEvent('beforeShow', {target:this});
                            nEffectInstances = effectInstances.length;
                            for (j = 0; j < nEffectInstances; j++) {
                                ei = effectInstances[j];
                                if (j === 0 && !alreadySubscribed(ei.animateInCompleteEvent, this.fireEvent('show',{target:this}), this)) {
                                    ei.animateInCompleteEvent.on( this.fireEvent('show', {target:this}), this, true);
                                }
                                ei.animateIn();
                            }
                        }
                    }
                } else { 
                    Dom.removeClass(this.element, "L-hidden");
                    if (currentVis != "visible" || currentVis === "") {
                        this.fireEvent('beforeShow', {target:this});
                        this.cfg.refireEvent("iframe");
                    }else{
                        this.fireEvent('beforeShow', {target:this});
                    }
                }
            } else { 
                if (isMacGecko) {
                    this.hideMacGeckoScrollbars();
                }
                if (effect) { 
                    if (currentVis == "visible") {
                        this.fireEvent('beforeHide', {target:this});
                        nEffectInstances = effectInstances.length;
                        for (k = 0; k < nEffectInstances; k++) {
                            h = effectInstances[k];
                            if (k === 0 && !alreadySubscribed(h.animateOutCompleteEvent, this.fireEvent('hide', {target:this}), this)) {
                                h.animateOutCompleteEvent.on( this.fireEvent('hide', {target:this}), this, true, {isCE:true});
                            }
                            h.animateOut();
                        }
                    } else if (currentVis === "") {
                        Dom.addClass(this.element, "L-hidden");
                    }
                } else { 
                    Dom.addClass(this.element, "L-hidden");
                    if (currentVis == "visible" || currentVis === "") {
                        this.fireEvent('beforeHide', {target:this});
                        this.fireEvent('hide', {target:this});
                    }
                }
            }
        },
        configMonitorResize: function (type, args, obj) {
            var monitor = args[0];
            if (monitor) {
                this.initResizeMonitor();
            } else {
                Panel.textResizeEvent.unOn(this.onDomResize, this);
                this.resizeMonitor = null;
            }
        },
        _onSetBody: function(e){
            if (!this.body) {
                this.setBody("");
            }
        },
        toast: function(text, config){
        	Dom.toast(text, document.body, config);
        },
        destroy: function () {
            if (this.iframe) {
                this.iframe.parentNode.removeChild(this.iframe);
            }
            this.iframe = null;
            Panel.windowResizeEvent.unOn(this.sizeMask, this);
            Panel.windowScrollEvent.unOn(this.doCenterOnDOMEvent, this);
            Panel.textResizeEvent.unOn(this._autoFillOnHeightChange,this);
            this.removeMask();
            if (this.close) {
                Event.purgeElement(this.close);
            }
            var parent = null;
            if (this.element) {
                Event.purgeElement(this.element, true);
                parent = this.element.parentNode;
            }
            if (parent) {
                parent.removeChild(this.element);
            }
            if(this.element)
                Rui.get(this.element).removeNode();
            if(this.header)
                Rui.get(this.header).removeNode();
            if(this.body)
                Rui.get(this.body).removeNode();
            if(this.footer)
                Rui.get(this.footer).removeNode();
            Panel.textResizeEvent.unOn(this.onDomResize, this);
            this.cfg.destroy();
            this.cfg = null;
            this.fireEvent('destroy', {target:this});
            this.unOnAll();
            delete this.__DU_events;
            delete this.__DU_subscribers;
            for (m in this) {
                this[m] = null;
                delete this[m];
            }
            Rui.ui.LPanel.superclass.destroy.call(this);
        },
        toString: function () {
            return "LPanel " + this.id;
        }
    });
}());
Rui.namespace('Rui.ui');
(function(){
    Rui.ui.LDialog = function(config){
        config = config || {}; 
        config = Rui.applyIf(config, Rui.getConfig().getFirst('$.ext.dialog.defaultProperties'));
        this.simpleForm = null;
        Rui.ui.LDialog.superclass.constructor.call(this, config);
        this.validators = config ? config.validators : validators;
        this.callback = config ? config.callback : this.callback;
    };
    var Event = Rui.util.LEvent,
        Dom = Rui.util.LDom,
        Dialog = Rui.ui.LDialog,
        Button = Rui.ui.LButton,
    EVENT_TYPES = {
        'BEFORE_SUBMIT': 'beforeSubmit',
        'SUBMIT': 'submit',
        'MANUAL_SUBMIT': 'manualSubmit',
        'ASYNC_SUBMIT': 'asyncSubmit',
        'FORM_SUBMIT': 'formSubmit',
        'CANCEL': 'cancel',
        'VALIDATE': 'validate'
    },
    DEFAULT_CONFIG = {
        'POST_METHOD': { 
            key: 'postmethod', 
            value: 'none'
        },
        'BUTTONS': {
            key: 'buttons',
            value: 'none',
            supercedes: ['visible']
        },
        'HIDEAFTERSUBMIT': {
            key: 'hideaftersubmit',
            value: true
        }
    };
    Dialog.CSS_DIALOG = 'L-dialog';
    function removeButtonEventHandlers(){
        var buttons = this._buttons,
            buttonCount,
            button,
            i;
        if(Rui.isArray(buttons)){
            buttonCount = buttons.length;
            if(buttonCount > 0){
                i = buttonCount - 1;
                do {
                    button = buttons[i];
                    if(Button && button instanceof Button){
                        button.destroy();
                    }else if(button.tagName.toUpperCase() == 'BUTTON'){
                        Event.purgeElement(button);
                        Event.purgeElement(button, false);
                    }
                }
                while (i--);
            }
        }
    }
    Rui.extend(Rui.ui.LDialog, Rui.ui.LPanel, {
        otype: 'Rui.ui.LDialog',
        form: null,
        initDefaultConfig: function(){
            Rui.ui.LDialog.superclass.initDefaultConfig.call(this);
            this.callback = {
                success: null,
                failure: null,
                argument: null
            };
            this.cfg.addProperty(DEFAULT_CONFIG.POST_METHOD.key, {
                handler: this.configPostMethod, 
                value: DEFAULT_CONFIG.POST_METHOD.value, 
                validator: function (val){
                    if(val != 'form' && val != 'async' && val != 'none' && 
                        val != 'manual'){
                        return false;
                    }else{
                        return true;
                    }
                }
            });
            this.cfg.addProperty(DEFAULT_CONFIG.HIDEAFTERSUBMIT.key, {
                value: DEFAULT_CONFIG.HIDEAFTERSUBMIT.value
            });
            this.cfg.addProperty(DEFAULT_CONFIG.BUTTONS.key, {
                handler: this.configButtons,
                value: DEFAULT_CONFIG.BUTTONS.value,
                supercedes: DEFAULT_CONFIG.BUTTONS.supercedes
            }); 
        },
        initEvents: function(){
            Rui.ui.LDialog.superclass.initEvents.call(this);
            this.createEvent(EVENT_TYPES.BEFORE_SUBMIT); 
            this.createEvent(EVENT_TYPES.SUBMIT);
            this.createEvent(EVENT_TYPES.MANUAL_SUBMIT);
            this.createEvent(EVENT_TYPES.ASYNC_SUBMIT);
            this.createEvent(EVENT_TYPES.FORM_SUBMIT);
            this.createEvent(EVENT_TYPES.CANCEL);
            this.createEvent(EVENT_TYPES.VALIDATE);
            this.cfg.setProperty('visible', false);
            this.on('beforeHide', this.blurButtons, this, true);
            this.on('changeBody', this.registerForm, this, true);
        },
        createContainer: function(parentNode){
            this.el = Rui.ui.LDialog.superclass.createContainer.call(this, parentNode);
            this._createDialog();
            return this.el;
        },
        _createDialog: function(){
            Dom.addClass(this.element, Dialog.CSS_DIALOG);
            if(Rui.useAccessibility())
                this.el.setAttribute('role', 'dialog');
            this.fireEvent('beforeRender', {target: this});
        },
        initComponent: function(config){
            this.id = Rui.useFixedId() ? 'LDialog-' + (config.id || config.applyTo) : Rui.id();
            Rui.ui.LDialog.superclass.initComponent.call(this, config);
            if(config){
                this.cfg.applyConfig(config, true);
            }
         },
        doSubmit: function(){
            var LConnect = Rui.LConnect,
                oForm = this.form,
                bUseFileUpload = false,
                bUseSecureFileUpload = false,
                aElements,
                nElements,
                i,
                formAttrs;
            switch (this.cfg.getProperty('postmethod')){
                case 'async':
                    aElements = oForm.elements;
                    nElements = aElements.length;
                    if(nElements > 0){
                        i = nElements - 1;
                        do {
                            if(aElements[i].type == 'file'){
                                bUseFileUpload = true;
                                break;
                            }
                        }
                        while (i--);
                    }
                    if(bUseFileUpload && Rui.browser.msie && this.isSecure){
                        bUseSecureFileUpload = true;
                    }
                    formAttrs = this._getFormAttributes(oForm);
                    LConnect.setForm(oForm, bUseFileUpload, bUseSecureFileUpload);
                    LConnect.asyncRequest(formAttrs.method, formAttrs.action, this.callback, null, {isFileUpload: bUseFileUpload});
                    this.fireEvent(EVENT_TYPES.ASYNC_SUBMIT, {target:this});
                    break;
                case 'form':
                    oForm.submit();
                    this.fireEvent(EVENT_TYPES.FORM_SUBMIT, {target:this});
                    break;
                case 'none':
                case 'manual':
                    this.fireEvent(EVENT_TYPES.MANUAL_SUBMIT, {target:this});
                    break;
            }
        },
        _getFormAttributes: function(oForm){
            var attrs = {
                method: null,
                action: null
            };
            if(oForm){
                if(oForm.getAttributeNode){
                    var action = oForm.getAttributeNode('action');
                    var method = oForm.getAttributeNode('method');
                    if(action){
                        attrs.action = action.value;
                    }
                    if(method){
                        attrs.method = method.value;
                    }
                }else{
                    attrs.action = oForm.getAttribute('action');
                    attrs.method = oForm.getAttribute('method');
                }
            }
            attrs.method = (Rui.isString(attrs.method) ? attrs.method : 'POST').toUpperCase();
            attrs.action = Rui.isString(attrs.action) ? attrs.action : '';
            return attrs;
        },
        registerForm: function(){
            var form = this.element.getElementsByTagName('form')[0];
            if(this.form){
                if(this.form == form && Dom.isAncestor(this.element, this.form)){
                    return;
                }else{
                    Event.purgeElement(this.form);
                    this.form = null;
                }
            }
            if(!form && this.body){
                form = document.createElement('form');
                form.name = 'frm_' + this.id;
                this.body.appendChild(form);
            }
            if(form){
                this.form = form;
                Event.on(form, 'submit', this._submitHandler, this, true);
            }
            var formId = this.form ? (this.form.name || this.form.id) : (this.validatorManager)? this.validatorManager.id : null;
            if(formId != null){
                this.simpleForm = new Rui.ui.form.LForm(formId,{
                    validators: this.validators,
                    validatorManager:this.validatorManager
                });
                if(this.validatorManager == null)
                    this.validatorManager = this.simpleForm.validatorManager;
            } 
        },
        _submitHandler : function(e){
            Event.stopEvent(e);
            this.submit();
            this.form.blur();
        },
        setTabLoop: function(firstElement, lastElement){
            firstElement = firstElement || this.firstButton;
            lastElement = this.lastButton || lastElement;
            Dialog.superclass.setTabLoop.call(this, firstElement, lastElement);
        },
        setFirstLastFocusable: function(){
            Dialog.superclass.setFirstLastFocusable.call(this);
            var i, l, el, elements = this.focusableElements;
            this.firstFormElement = null;
            this.lastFormElement = null;
            if(this.form && elements && elements.length > 0){
                l = elements.length;
                for (i = 0; i < l; ++i){
                    el = elements[i];
                    if(this.form === el.form){
                        this.firstFormElement = el;
                        break;
                    }
                }
                for (i = l-1; i >= 0; --i){
                    el = elements[i];
                    if(this.form === el.form){
                        this.lastFormElement = el;
                        break;
                    }
                }
            }
        },
        configButtons: function (type, args, obj){
            var configs = args[0],
                config,
                button,
                len,
                groupDom;
            removeButtonEventHandlers.call(this);
            this._buttons = null;
            if(Rui.isArray(configs)){
                groupDom = document.createElement('span');
                groupDom.id = Rui.useFixedId() ? 'LDialog-btnGrp-' + this.id : Rui.id();
                groupDom.className = 'button-group';
                len = configs.length;
                this._buttons = [];
                this.defaultButton = null;
                for (var i = 0; i < len; i++){
                    config = configs[i];
                    if(Button){
                        var cfgId = groupDom.id + (config.id || config.text);
                        var cfg = { label: config.text, id: cfgId, renderTo: groupDom };
                        if(config.disableDbClick === false)
                            cfg.disableDbClick = false;
                        button = new Button(cfg);
                        button.appendTo(groupDom);
                        if(config.isDefault){
                            button.el.addClass('default');
                            this.defaultButton = button;
                        }
                        if(Rui.isFunction(config.handler)){
                            button.on('click', config.handler, this, true);
                        }else if(Rui.isObject(config.handler) && Rui.isFunction(config.handler.fn)){
                            button.on('click', config.handler.fn, config.handler.scope || this, true);
                        }
                        this._buttons.push(button);
                    }else{
                        button = document.createElement('button');
                        button.setAttribute('type', 'button');
                        if(config.isDefault){
                            button.className = 'default';
                            this.defaultButton = button;
                        }
                        button.innerHTML = config.text;
                        if(Rui.isFunction(config.handler)){
                            Event.on(button, 'click', config.handler, this, true);
                        }else if(Rui.isObject(config.handler) && 
                            Rui.isFunction(config.handler.fn)){
                            Event.on(button, 'click', 
                                config.handler.fn, 
                                ((!Rui.isUndefined(config.handler.obj)) ? config.handler.obj : this), 
                                (config.handler.scope || this));
                        }
                        groupDom.appendChild(button);
                        this._buttons.push(button);
                    }
                    if(i === 0){
                        this.firstButton = button;
                    }
                    if(i == (len - 1)){
                        this.lastButton = button;
                    }
                }
                this.setFooter(groupDom);
                if(Dom.inDocument(this.element) && !Dom.isAncestor(this.innerElement, this.footer)){
                    this.innerElement.appendChild(this.footer);
                }
                this.buttonSpan = groupDom;
            }else{ 
                groupDom = this.buttonSpan;
                if(groupDom && this.footer){
                    this.footer.removeChild(groupDom);
                    this.buttonSpan = null;
                    this.firstButton = null;
                    this.lastButton = null;
                    this.defaultButton = null;
                }
            }
            this.setFirstLastFocusable();
            this.cfg.refireEvent('iframe');
            this.cfg.refireEvent('underlay');
        },
        getButtons: function(){
            return this._buttons || null;
        },
        setButtons: function(buttons) {
        	removeButtonEventHandlers.call(this);
        	this.cfg.setProperty(DEFAULT_CONFIG.BUTTONS.key, buttons);
        },
        focusFirst: function (type, args, obj){
            var el = this.firstFormElement;
            if(args && args[1]) 
                Event.stopEvent(args[1]);
            if(el){
                try{
                    el.focus();
                }catch(ex){}
            }else{
                this.focusFirstButton();
            }
        },
        focusLast: function (type, args, obj){
            var aButtons = this.cfg.getProperty('buttons'),
                el = this.lastFormElement;
            if(args && args[1])
                Event.stopEvent(args[1]);
            if(aButtons && Rui.isArray(aButtons)){
                this.focusLastButton();
            }else{
                if(el){
                    try{
                        el.focus();
                    }catch(ex){}
                }
            }
        },
        focusDefaultButton: function(){
            try{
                this.defaultButton.focus();
            }catch(ex){}
        },
        blurButtons: function(){
            var buttons = this.cfg.getProperty('buttons'),
                len,
                button,
                i;
            if(buttons && Rui.isArray(buttons)){
                len = buttons.length;
                if(len > 0){
                    i = (len - 1);
                    do {
                        button = buttons[i];
                        if(button){
                            try{
                                button.blur();
                            }catch(ex){}
                        }
                    } while (i--);
                }
            }
        },
        focusFirstButton: function(){
            var buttons = this._buttons,
                button;
            if(buttons && Rui.isArray(buttons)){
                button = buttons[0];
                if(button){
                    try{
                        button.focus();
                    }catch(ex){}
                }
            }
        },
        focusLastButton: function(){
            var buttons = this._buttons,
                len,
                button;
            if(buttons && Rui.isArray(buttons)){
                len = buttons.length;
                if(len > 0){
                    button = buttons[(len - 1)];
                    try{
                        button.focus();
                    }catch(ex){}
                }
            }
        },
        configPostMethod: function (type, args, obj){
            this.registerForm();
        },
        validate: function(){
            var isValid = true;
            if(this.validatorManager != null && this.simpleForm != null){
                isValid = this.simpleForm.validate();
            }
            isValid = (isValid == true) ? this.fireEvent(EVENT_TYPES.VALIDATE, {target:this}) : isValid;
            return isValid;
        },
        submit: function (isAnim){
            var isValid = this.validate();
            if(isValid){
                this.fireEvent(EVENT_TYPES.BEFORE_SUBMIT, {target:this});
                this.doSubmit();
                this.fireEvent(EVENT_TYPES.SUBMIT, {target:this});
                if(this.cfg.getProperty('hideaftersubmit'))
                    this.hide(isAnim);
                return true;
            }else{
                return false;
            }
        },
        clearInvalid: function(){
            if(this.simpleForm)
                this.simpleForm.clearInvalid();
        },
        cancel: function (isAnim){
            this.hideAnim(isAnim);
            this.fireEvent('cancel',{
                type: 'cancel',
                target: this,
                isAnim: isAnim
            }); 
        },
        _doClose: function (e) {
            this.cancel(false);
        },
        getData: function(){
            var oForm = this.form,
                aElements,
                nTotalElements,
                oData,
                sName,
                oElement,
                nElements,
                sType,
                sTagName,
                aOptions,
                nOptions,
                aValues,
                oOption,
                sValue,
                oRadio,
                oCheckbox,
                i,
                n;    
            function isFormElement(p_oElement){
                var sTag = p_oElement.tagName.toUpperCase();
                return ((sTag == 'INPUT' || sTag == 'TEXTAREA' ||  sTag == 'SELECT') && p_oElement.name == sName);
            }
            if(oForm){
                aElements = oForm.elements;
                nTotalElements = aElements.length;
                oData = {};
                for (i = 0; i < nTotalElements; i++){
                    sName = aElements[i].name;
                    oElement = Dom.getElementsBy(isFormElement, '*', oForm);
                    nElements = oElement.length;
                    if(nElements > 0){
                        if(nElements == 1){
                            oElement = oElement[0];
                            sType = oElement.type;
                            sTagName = oElement.tagName.toUpperCase();
                            switch (sTagName){
                                case 'INPUT':
                                    if(sType == 'checkbox'){
                                        oData[sName] = oElement.checked;
                                    }else if(sType != 'radio'){
                                        oData[sName] = oElement.value;
                                    }
                                    break;
                                case 'TEXTAREA':
                                    oData[sName] = oElement.value;
                                    break;
                                case 'SELECT':
                                    aOptions = oElement.options;
                                    nOptions = aOptions.length;
                                    aValues = [];
                                    for (n = 0; n < nOptions; n++){
                                        oOption = aOptions[n];
                                        if(oOption.selected){
                                            sValue = oOption.value;
                                            if(!sValue || sValue === ''){
                                                sValue = oOption.text;
                                            }
                                            aValues[aValues.length] = sValue;
                                        }
                                    }
                                    oData[sName] = aValues;
                                    break;
                            }
                        }else{
                            sType = oElement[0].type;
                            switch (sType){
                                case 'radio':
                                    for (n = 0; n < nElements; n++){
                                        oRadio = oElement[n];
                                        if(oRadio.checked){
                                            oData[sName] = oRadio.value;
                                            break;
                                        }
                                    }
                                    break;
                                case 'checkbox':
                                    aValues = [];
                                    for (n = 0; n < nElements; n++){
                                        oCheckbox = oElement[n];
                                        if(oCheckbox.checked){
                                            aValues[aValues.length] =  oCheckbox.value;
                                        }
                                    }
                                    oData[sName] = aValues;
                                    break;
                            }
                        }
                    }
                }
            }
            return oData;
        },
        destroy: function(){
            removeButtonEventHandlers.call(this);
            for (var i = 0; this._buttons != null && i < this._buttons.length ; i++)
                this._buttons[i].destroy();
            this._buttons = null;
            var forms = this.element.getElementsByTagName('form'),
                form;
            if(forms.length > 0){
                form = forms[0];
                if(form){
                    Event.purgeElement(form);
                    if(form.parentNode){
                        form.parentNode.removeChild(form);
                    }
                    this.form = null;
                }
            }
            Dialog.superclass.destroy.call(this);
        },
        toString: function(){
            return 'LDialog ' + this.id;
        }
    });
}());
Rui.namespace('Rui.ui');
(function () {
    Rui.ui.LSimpleDialog = function (config) {
        config = config || {};
        Rui.ui.LSimpleDialog.superclass.constructor.call(this, config); 
    };
    var Dom = Rui.util.LDom,
        LSimpleDialog = Rui.ui.LSimpleDialog,
    DEFAULT_CONFIG = {
        'ICON': {
            key: 'icon',
            value: 'none',
            suppressEvent: true
        },
        'TEXT': {
            key: 'text',
            value: '',
            suppressEvent: true,
            supercedes: ['icon']
        }
    };
    LSimpleDialog.ICON_BLOCK = 'blckicon';
    LSimpleDialog.ICON_ALARM = 'alrticon';
    LSimpleDialog.ICON_HELP  = 'hlpicon';
    LSimpleDialog.ICON_INFO  = 'infoicon';
    LSimpleDialog.ICON_WARN  = 'warnicon';
    LSimpleDialog.ICON_TIP   = 'tipicon';
    LSimpleDialog.ICON_CSS_CLASSNAME = 'L-icon';
    LSimpleDialog.CSS_SIMPLEDIALOG = 'L-simple-dialog';
    Rui.extend(LSimpleDialog, Rui.ui.LDialog, {
        otype: 'Rui.ui.LSimpleDialog',
        text: null,
        icon: null,
        initDefaultConfig: function () {
            LSimpleDialog.superclass.initDefaultConfig.call(this);
            this.cfg.addProperty(DEFAULT_CONFIG.ICON.key, {
                handler: this.configIcon,
                value: DEFAULT_CONFIG.ICON.value,
                suppressEvent: DEFAULT_CONFIG.ICON.suppressEvent
            });
            this.cfg.addProperty(DEFAULT_CONFIG.TEXT.key, { 
                handler: this.configText, 
                value: DEFAULT_CONFIG.TEXT.value, 
                suppressEvent: DEFAULT_CONFIG.TEXT.suppressEvent, 
                supercedes: DEFAULT_CONFIG.TEXT.supercedes 
            });
        },
        initComponent: function(config){
            LSimpleDialog.superclass.initComponent.call(this, config);
            if (config)
                this.cfg.applyConfig(config, true);
        },
        initEvents: function () {
            LSimpleDialog.superclass.initEvents.call(this);
            this.on('beforeRender', this._onSetBody, this, true);
        },
        createContainer: function(){
            this.el = LSimpleDialog.superclass.createContainer.call(this);
            Dom.addClass(this.element, LSimpleDialog.CSS_SIMPLEDIALOG);
            this.cfg.queueProperty('postmethod', 'manual');
            return this.el; 
        }, 
        afterRender: function(container) {
            Rui.ui.LSimpleDialog.superclass.afterRender.call(this,container);
            this.setBody(this.text);           
        },
        _onSetBody: function(e){
            if (!this.body)
                this.setBody('');
        }, 
        registerForm: function () {
            LSimpleDialog.superclass.registerForm.call(this);
            this.form.innerHTML += '<input type=\"hidden\" name=\'' + 
            this.id + '\" value=\"\"/>';
        },
        configIcon: function (type,args,obj) {
            var sIcon = args[0],
            oBody = this.body,
            sCSSClass = LSimpleDialog.ICON_CSS_CLASSNAME,
            oIcon,
            oIconParent;
            if (sIcon && sIcon != 'none') {
                oIcon = Dom.getElementsByClassName(sCSSClass, '*' , oBody);
                if (oIcon) {
                    oIconParent = oIcon.parentNode;
                    if (oIconParent) {
                        oIconParent.removeChild(oIcon);
                        oIcon = null;
                    }
                }
                if (sIcon.indexOf('.') == -1) {
                    oIcon = document.createElement('span');
                    oIcon.className = (sCSSClass + ' ' + sIcon);
                    oIcon.innerHTML = '&#160;';
                } else {
                    oIcon = document.createElement('img');
                    oIcon.src = (this.imageRoot + sIcon);
                    oIcon.className = sCSSClass;
                }
                if (oIcon) {
                    oBody.insertBefore(oIcon, oBody.firstChild);
                }
            }
        },
        configText: function (type,args,obj) {
            var text = args[0];
            if (text) {
                this.setBody(text);
                this.cfg.refireEvent('icon');
            }
        },
        destroy: function () {
            LSimpleDialog.superclass.destroy.call(this);
        },
        toString: function () {
            return 'LSimpleDialog ' + this.id;
        }
    });
}());
(function () {
    Rui.namespace('Rui.ui.LMessageBox');
    var msgBox = Rui.ui.LMessageBox;
    var Ev = Rui.util.LEvent;
    msgBox.alert = function (option) {
        if(!option || !option.text) { 
            option = {
                text: option
            };
        }
        var buttons = option.buttons = option.buttons || [],
            button = buttons[0] || {};
        option.buttons[0] = Rui.applyIf(button, {
            text: 'OK',
            id: 'LMsgBox-alert-ok',
            isDefault: true,
            handler: function(){
                this.hideMask();
                if(option.handler)
                    option.handler.call(this);
                this.destroy();
            }
        });
        var box = msgBox.createMessageBox(option);
        box.show();
        return box;
    };
    msgBox.confirm = function (option) {
        if(!option || !option.text) {
            option = {
                text: option
            };
        }
        option = Rui.applyIf(option, {
            title:'Question',
            icon: Rui.ui.LSimpleDialog.ICON_HELP
        });
        var buttons = option.buttons = option.buttons || [],
            buttonYes = buttons[0] || {},
            buttonNo = buttons[1] || {};
        option.buttons[0] = Rui.applyIf(buttonYes, {
            text: 'Yes',
            id: 'LMsgBox-confirm-yes',
            isDefault: true,
            handler: function(){
                this.hideMask();
                if(option.handlerYes)
                    option.handlerYes.call(this);
                this.destroy();
            }
        });
        option.buttons[1] = Rui.applyIf(buttonNo, {
            text: 'No',
            id: 'LMsgBox-confirm-no',
            isDefault: false,
            handler: function(){
                this.hideMask();
                if(option.handlerNo)
                    option.handlerNo.call(this);
                this.destroy();
            }
        });
        var box = msgBox.createMessageBox(option);
        box.show();
        return box;
    };
    msgBox.prompt = function (option) {
        if(!option || !option.text) {
            option = {
                text: option
            };
        }
        console.log(option);
        var buttons = option.buttons = option.buttons || [],
            buttonOk = buttons[0] || {},
            buttonCancel = buttons[1] || {},
            promptId = Rui.useFixedId() ? 'LMsgBox-prompt' : Rui.id(); 
        option.buttons[0] = Rui.applyIf(buttonOk, {
            text: 'OK',
            id: 'LMsgBox-prompt-ok',
            isDefault: true,
            handler: function(){
                this.hideMask();
                if(option.handler)
                    option.handler.call(this, Rui.get(promptId).getValue());
                this.destroy();
            }
        });
        option.buttons[1] = Rui.applyIf(buttonCancel, {
            text: 'Cancel',
            id: 'LMsgBox-prompt-cancel',
            isDefault: false,
            handler: function(){
                this.destroy();
            }
        });
        option.text += '<input type="text" id="' + promptId + '" style="width:200px">';
        var box = msgBox.createMessageBox(option);
        box.show();
        return box;
    };
    msgBox.createMessageBox = function(option) {
        option = Rui.applyIf(option, {
            id:'messagebox',
            renderTo: document.body,
            title: 'Information',
            width: 300,
            fixedcenter: true,
            draggable: true,
            visible: false,
            close: false,
            modal: true,
            constraintoviewport: true,
            isDefaultCSS: true,
            buttons: [
                { text: 'OK', 
                  id: 'LMsgBox-messagebox-ok',
                  handler:function(){
                    this.hideMask();
                    this.destroy();
                }, isDefault:true }
            ]
        });
        var messageBox = new Rui.ui.LSimpleDialog(option);
        messageBox.setHeader(option.title);
        if(Rui.useAccessibility())
            messageBox.el.setAttribute('role', 'alert');
        var buttons = messageBox.getButtons();
        for (var i = 0 ; i < buttons.length ; i++) {
            var buttonEl = buttons[i];
            if(Rui.get(buttonEl.dom).hasClass('default')) {
                try {
                    buttonEl.on('keydown', function(e){
                        if(e.keyCode == 13) {
                            try {
                                this.click();
                                Ev.stopEvent(e);
                            }catch(e) {}
                        }
                    });
                    buttonEl.select('button').focus();
                } catch (e) {}
                break;
            }
        }
        return messageBox;
    };
    Rui.alert = msgBox.alert;
    Rui.confirm = msgBox.confirm;
    Rui.prompt = msgBox.prompt;
}());
Rui.ui.LWaitPanel = function(id, oConfig) {
    var config = oConfig || {};
    if(arguments.length == 0)
        id = Rui.browser.msie ? document.body : document;
    else if(typeof id == 'object') {
        config = id;
        id = Rui.browser.msie ? document.body : document;
    }
    this.el = ((id == document.body) || (id == document)) ? Rui.getBody() : Rui.get(id);
    this.isDocumentBody = (this.el.dom == document.body || this.el.dom == document);
    this.el.addClass('L-wait-panel');
    Rui.applyObject(this, config);
    this.iId = Rui.id();
};
Rui.ui.LWaitPanel.prototype = {
    isDocumentBody: false,
    maskMsg: null,
    show: function() {
        if(this.isDocumentBody) {
            var S_WP = Rui.ui.LWaitPanel;
            var idx = Rui.util.LArray.indexOf(S_WP._SHOW_COUNT, this.iId);
            if(idx < 0) S_WP._SHOW_COUNT.push(this.iId);
            if(S_WP._SHOW_COUNT.length < 2) {
                S_WP._MASK_DOCUMENT_EL = S_WP._MASK_DOCUMENT_EL || this.el;  
                S_WP._MASK_DOCUMENT_EL.mask(this.maskMsg);
                if(S_WP._MASK_DOCUMENT_EL.waitMaskEl)
                    if(this.css) S_WP._MASK_DOCUMENT_EL.waitMaskEl.addClass(this.css);
            }
        } else {
            this.el.mask(this.maskMsg);
            if(this.el.waitMaskEl)
                if(this.css) this.el.waitMaskEl.addClass(this.css);
        }
    },
    hide: function() {
        if(this.isDocumentBody) {
            var S_WP = Rui.ui.LWaitPanel;
            S_WP._MASK_DOCUMENT_EL = S_WP._MASK_DOCUMENT_EL || this.el;
            var idx = Rui.util.LArray.indexOf(S_WP._SHOW_COUNT, this.iId);
            if(idx > -1) {
                S_WP._SHOW_COUNT[idx] = null;
                S_WP._SHOW_COUNT.splice(idx, 1);
            }
            if(S_WP._SHOW_COUNT.length < 1)
                S_WP._MASK_DOCUMENT_EL.unmask();
        } else this.el.unmask();
    },
    getRegion: function(g) {
        return this.el.getRegion();
    },
    setRegion: function(g) {
        this.el.setRegion(g);
    }
};
Rui.ui.LWaitPanel._SHOW_COUNT = [];
Rui.ui.LWaitPanel._MASK_DOCUMENT_EL = null;
Rui.ui.LScroller = function(config){
    config = config || {};
    config = Rui.applyIf(config, Rui.getConfig().getFirst('$.ext.scroller.defaultProperties'));
    Rui.ui.LScroller.superclass.constructor.call(this, config);
    this.scrollbarSize = Rui.ui.LScroller.SCROLLBAR_SIZE;
    this.createEvent('scrollY');
    this.createEvent('scrollX');
};
Rui.ui.LScroller.SCROLLBAR_SIZE = Rui.platform.isMobile || Rui.platform.mac ? 0 : 17;
Rui.extend(Rui.ui.LScroller, Rui.ui.LUIComponent, {
    otype: 'Rui.ui.LScroller',
    content: null,
    marginSafe: false,
    useVirtual: false,
    scrollbar: 'auto',
    virtualScrollRate: 1,
    xScrollStep: 40,
    yScrollStep: 50,
    xWheelStep: 60,
    yWheelStep: 150,
    space: null,
    scrollbarSize: Rui.ui.LScroller.SCROLLBAR_SIZE,
    position: null,
    initComponent: function(config){
        this.space = {top: 0, right: 0, bottom: 0, left: 0};
        this.position = {};
    },
    createContainer: function(appendTo) {
        Rui.ui.LScroller.superclass.createContainer.call(this, appendTo);
        this.el.addClass('L-scroller');
        this.el.addClass('L-ignore-event');
        if(this.content){
            this.contentEl = Rui.get(this.content);
        }else{
            this.contentEl = Rui.get(this.el.dom.children[0]);
        }
        this.contentEl.addClass('L-scroll-content');
        return this.el;
    },
    doRender: function(){
        if(this.scrollEl){
            if(this.width)
                this.setWidth(this.width);
            if(this.height)
                this.setHeight(this.height);
        }
        var el = this.el;
        if(this.useVirtual !== true){
            this.el.appendChild(this.contentEl);
            el.setStyle('overflow', 'auto');
            return;
        }
        this.scrollEl = Rui.get(this.createElement());
        this.scrollEl.addClass('L-scroll');
        if(this.el.dom.children.length > 0)
            Rui.get(this.el.dom.children[0]).insertBefore(this.scrollEl);
        else
            el.appendChild(this.scrollEl);
        if(this.marginSafe === true){
            this.wrapperEl = Rui.get(this.createElement());
            this.wrapperEl.addClass('L-scroll-wrapper');
            this.scrollEl.appendChild(this.wrapperEl);
            this.wrapperEl.appendChild(this.contentEl);
        }else{
            this.scrollEl.appendChild(this.contentEl);
        }
        this.setupSizes();
    },
    afterRender: function(){
        var Event = Rui.util.LEvent;
        if(Rui.browser.mozilla){
            Event.addListener(this.el.dom, 'DOMMouseScroll', this.onWheel, this, true);  
        }else{
            Event.addListener(this.el.dom, 'mousewheel', this.onWheel, this, true);
        }
        if(Rui.platform.isMobile){
            if(Rui.browser.touch){
                Event.addListener(document.body, 'touchstart', this.onTouchStart, this, true);
                Event.addListener(document.body, 'touchmove', this.onTouchMove, this, true);
                Event.addListener(document.body, 'touchend', this.onTouchEnd, this, true);
            }else{
                Event.addListener(document.body, 'mousedown', this.onTouchStart, this, true);
                Event.addListener(document.body, 'mousemove', this.onTouchMove, this, true);
                Event.addListener(document.body, 'mouseup', this.onTouchEnd, this, true);
            }
        }
        Event.addListener(window, 'resize', this.onResize, this, true);
    },
    setupScrollbars: function(){
        this.isNeedScrollbar();
        if (this.needScroll.Y || this.scrollbar == 'both' || this.scrollbar == 'y'){
            if(!this.yScrollbarEl){
                this.yScrollbarEl = Rui.get(this.createElement());
                this.scrollEl.insertAfter(this.yScrollbarEl.dom);
                this.yScrollbarEl.addClass('L-scrollbar-y');
                this.yScrollbarEl.addClass('L-ignore-event');
                Rui.util.LEvent.addListener(this.yScrollbarEl.dom, 'scroll', this.onScrollY, this, true);
            }
            if(!this.yVirtualContentEl){
                this.yVirtualContentEl = Rui.get(this.createElement());
                this.yScrollbarEl.appendChild(this.yVirtualContentEl);
                this.yVirtualContentEl.addClass('L-scrollbar-y-content');
                this.yVirtualContentEl.html('&nbsp;');
            }
        } else {
            if(this.yVirtualContentEl){
                this.yVirtualContentEl.remove();
                this.yVirtualContentEl = null;
            }
            if(this.yScrollbarEl){
                Rui.util.LEvent.removeListener(this.yScrollbarEl.dom, 'scroll', this.onScrollY);
                this.yScrollbarEl.remove();
                this.yScrollbarEl = null;
            }
        }
        if(this.needScroll.X || this.scrollbar == 'both' || this.scrollbar == 'x'){
            if(!this.xScrollbarEl){
                this.xScrollbarEl = Rui.get(this.createElement());
                if(this.yScrollbarEl){
                    this.yScrollbarEl.insertAfter(this.xScrollbarEl.dom);
                }else{
                    this.scrollEl.insertAfter(this.xScrollbarEl.dom);
                }
                this.xScrollbarEl.addClass('L-scrollbar-x');
                this.xScrollbarEl.addClass('L-ignore-event');
                Rui.util.LEvent.addListener(this.xScrollbarEl.dom, 'scroll', this.onScrollX, this, true);
            }
            if(!this.xVirtualContentEl){
                this.xVirtualContentEl = Rui.get(this.createElement());
                this.xScrollbarEl.appendChild(this.xVirtualContentEl);
                this.xVirtualContentEl.addClass('L-scrollbar-x-content');
                this.xVirtualContentEl.html('&nbsp;');
            }
        } else {
            if(this.xVirtualContentEl){
                this.xVirtualContentEl.remove();
                this.xVirtualContentEl = null;
            }
            if(this.xScrollbarEl){
                Rui.util.LEvent.removeListener(this.xScrollbarEl.dom, 'scroll', this.onScrollX);
                this.xScrollbarEl.remove();
                this.xScrollbarEl = null;
            }
        }
    },
    setupSizes: function(){
        if(this.isWidthZero())
            return false;
        var scrollWidth = this.el.getWidth(true),
            scrollHeight = this.el.getHeight(true),
            s = this.space, st = s.top, sr = s.right, sb = s.bottom, sl = s.left,
            sw = scrollWidth - sl - sr - (this.yScrollbarEl ? this.scrollbarSize : 0),
            sh = scrollHeight - st - sb - (this.xScrollbarEl ? this.scrollbarSize : 0);
        if(this.scrollEl){
            this.scrollEl.setWidth(sw);
            this.scrollEl.setHeight(sh);
        }
        this.setupScrollbars();
        sw = scrollWidth - sl - sr - (this.yScrollbarEl ? this.scrollbarSize : 0);
        sh = scrollHeight - st - sb - (this.xScrollbarEl ? this.scrollbarSize : 0);
        this.scrollEl.setWidth(sw);
        this.scrollEl.setHeight(sh);
        if(this.xScrollbarEl){
            if(Rui.browser.msie)
                this.xScrollbarEl.setHeight(this.scrollbarSize+1);    
            this.xScrollbarEl.setWidth(sw);
        }
        if(this.yScrollbarEl){
            if(Rui.browser.msie)
                this.yScrollbarEl.setWidth(this.scrollbarSize+1);    
            this.yScrollbarEl.setHeight(sh);
        }
        this.setupVirtualContent();
    },
    isNeedScrollbar: function(){
        this.needScroll = this.needScroll ? this.needScroll : {X: false, Y: false};
        if(this.isWidthZero())
            return false;
        var scrollWidth = this.el.getWidth(true),
            scrollHeight = this.el.getHeight(true),
            cw = this.getContentWidth(), 
            ch = this.getContentHeight(), 
            s = this.space, st = s.top, sr = s.right, sb = s.bottom, sl = s.left,
            Y = (scrollHeight - st - sb) < ch ? true : false,
            X = (scrollWidth - sl - sr) < cw ? true : false;
        if(X !== Y){
            if(X){
               Y = (scrollHeight - st - sb - this.scrollbarSize) < ch ? true : false;
            }else if(Y){
               X = (scrollWidth - sl - sr - this.scrollbarSize) < cw ? true : false;
            }
        }
        this.needScroll = {
            X: X,
            Y: Y
        };
    },
    isWidthZero: function(){
        return this.el.getWidth() ? false : true;
    },
    getContentWidth: function(){
        return this.wrapperEl ? this.wrapperEl.getWidth() : this.contentEl.getWidth();
    },
    getContentHeight: function(){
        return this.wrapperEl ? this.wrapperEl.getHeight() : this.contentEl.getHeight();
    },
    setupVirtualContent: function(){
        if(this.useVirtual !== true){
            this.useVirtual = true;
            this.doRender();
        }
        var contentHeight = this.getContentHeight();
        if(Rui.browser.msie && contentHeight > 1193046 ){
            while (true){
                contentHeight = contentHeight / 10;
                if(contentHeight < 1193046){
                    break;
                }
            }
        }
        this.setVirtualContentHeight(contentHeight);
        this.setVirtualContentWidth(this.getContentWidth());
    },
    setVirtualContentHeight: function(height){
        if(this.yVirtualContentEl){
            this.virtualScrollRate = this.getMaxScrollTop() / (height - this.scrollEl.getHeight(true)) || 1;
            this.yVirtualContentEl.setHeight(height);
        }
    },
    setVirtualContentWidth: function(width){
        if(this.xVirtualContentEl)
            this.xVirtualContentEl.setWidth(width);
    },
    getStep: function(wheel, x){
        if(x)
            return (wheel === true ? this.xWheelStep : this.xScrollStep) / this.virtualScrollRate;
        else
            return (wheel === true ? this.yWheelStep : this.yScrollStep) / this.virtualScrollRate;
    },
    setStep: function(step, wheel, x){
        if(x){
            if(wheel === true)
                this.xWheelStep = step;
            else
                this.xScrollStep = step;
        }else{
            if(wheel === true)
                this.yWheelStep = step;
            else
                this.yScrollStep = step;
        }
    },
    getSpace: function(axis){
        if(!axis)
            return this.space;
        else
            return this.space[axis];
    },
    setSpace: function(spaceOrSize, skipRefresh, axis){
        if(!axis)
            this.space = spaceOrSize;
        else
            this.space[axis] = spaceOrSize;
        if(skipRefresh !== true)
            this.refresh();
    },
    getMaxScrollTop: function(margin){
        if(this.wrapperEl)
            return this.wrapperEl.getHeight() - this.scrollEl.getHeight(true);
        else
            return this.contentEl.getHeight() - this.el.getHeight(true) + (margin || 0);
    },
    getMaxScrollLeft: function(margin){
        if(this.wrapperEl)
            return this.wrapperEl.getWidth() - this.scrollEl.getWidth(true);
        else
            return this.contentEl.getWidth() - this.el.getWidth(true) + (margin || 0);
    },
    getScrollWidth: function(){
        return this.scrollEl ? this.scrollEl.getWidth() : 0;
    },
    getScrollHeight: function(){
        if(!this.scrollEl) return 0;
        var h = this.scrollEl.getHeight();
        if(h === 0){
            return Rui.util.LDom.toPixelNumber(this.scrollEl.getStyle('height'));
        }
        return h;
    },
    getScrollTop: function(){
        return this.yScrollbarEl ? this.yScrollbarEl.dom.scrollTop : 0;
    },
    setScrollTop: function(scrollTop, ignoreEvent){
        if(!Rui.isNumber(scrollTop))
            return;
        this.ignoreEvent = ignoreEvent;
        if(this.useVirtual === true){
            if(this.yScrollbarEl)
                this.yScrollbarEl.dom.scrollTop = scrollTop;
        }else{
            this.el.dom.scrollTop = scrollTop;
        }
        this.setPosition(null, false);
    },
    getScrollLeft: function(){
        return this.xScrollbarEl ? this.xScrollbarEl.dom.scrollLeft : 0;
    },
    setScrollLeft: function(scrollLeft){
        if(!Rui.isNumber(scrollLeft))
            return;
        if(this.useVirtual === true){
            if(this.xScrollbarEl)
                this.xScrollbarEl.dom.scrollLeft = scrollLeft;
        }else{
            this.el.dom.scrollLeft = scrollLeft;
        }
        this.setPosition(null, true);
    },
    syncScrollLeft: function() {
    	if(this.scrollEl && this.xScrollbarEl) {
    		this.scrollEl.dom.scrollLeft = this.xScrollbarEl.dom.scrollLeft;
    	}
    },
    getPrevious: function(x){
        if(x)
            return this.getScrollLeft() - this.getStep(false, true);
        else
            return this.getScrollTop() - this.getStep(false);
    },
    getNext: function(x){
        if(x)
            return this.getScrollLeft() + this.getStep(false, true);
        else
            return this.getScrollTop() + this.getStep(false);
    },
    getScroll: function(){
        return {
            top: this.getScrollTop(),
            left: this.getScrollLeft()
        };
    },
    setScroll: function(coord){
        this.go(coord.top);
        this.go(coord.left, true);
    },
    existScrollbar: function(x){
        if(x)
            return !!this.xScrollbarEl;
        else
            return !!this.yScrollbarEl;
    },
    getScrollbarSize: function(x){
        if(x)
            return this.xScrollbarEl ? this.scrollbarSize : 0;
        else
            return this.yScrollbarEl ? this.scrollbarSize : 0;
    },
    isStart: function(x){
        if(x)
            return this.getScrollLeft() == 0 ? true : false;
        else
            return this.getScrollTop() == 0 ? true : false;
    },
    isEnd: function(x){
        if(x)
            return !this.xScrollbarEl ? true : (this.getScrollLeft() >= this.getMaxScrollLeft() ? true : false);
        else
            return !this.yScrollbarEl ? true : (this.getScrollTop() >= this.getMaxScrollTop() ? true : false);
    },
    go: function(p, x){
        if(Rui.isEmpty(p) || !Rui.isNumber(p)) return;
        if(x){
            this.setScrollLeft(p);
            this.setPosition(p, true);
        }else{
            this.setScrollTop(p);
            this.setPosition(p, false);
        }
        return p;
    },
    goStart: function(x){
        if(x){
            this.setScrollLeft(0);
            this.setPosition(0, true);
        }else{
            this.setScrollTop(0);
            this.setPosition(0, false);
        }
        return 0;
    },
    goPrevious: function(x){
        var p = this.getPrevious(x);
        if(x){
            this.setScrollLeft(p);
            this.setPosition(p, true);
        }else{
            this.setScrollTop(p);
            this.setPosition(p, false);
        }
    },
    goNext: function(x){
        var p = this.getNext(x);
        if(x){
            this.setScrollLeft(p);
            this.setPosition(p, true);
        }else{
            this.setScrollTop(p);
            this.setPosition(p, false);
        }
        return p;
    },
    goEnd: function(x){
        var p;
        if(x){
            p = this.getMaxScrollLeft();
            this.setScrollLeft(p);
            this.setPosition(p, true);
        } else {
            p = this.getMaxScrollTop();
            this.setScrollTop(p);
            this.setPosition(p, false);
        }
        return p;
    },
    setWidth: function(width, skipRefresh){
        Rui.ui.LScroller.superclass.setWidth.call(this, width);
        if(skipRefresh !== true)
            this.refresh();
    },
    setHeight: function(height, skipRefresh){
        Rui.ui.LScroller.superclass.setHeight.call(this, height);
        if(skipRefresh !== true)
            this.refresh();
    },
    setPosition: function(p, x){
    	if(x) this.position.x = p;
    	else this.position.y = p;
    },
    getPosition: function(x){
    	if(x) return this.position.x;
    	else return this.position.y;
    },
    onWheel: function(e){
        var p = e.target;
        if(p && p.nodeType == 3 && p.parentNode)
            p = p.parentNode;
        p = Rui.util.LDom.findParent(p, '#' + this.el.id, 20);
        if ((this.yScrollbarEl || this.xScrollbarEl) && p){
            var delta = 0, 
                deltaX = 0;
            if (!e)  
                e = window.event;
            if (e.wheelDelta){ 
                delta = e.wheelDelta / 120;
                if(e.wheelDeltaX){
                    deltaX = e.wheelDeltaX / 120;
                    delta = 0;
                }
                if (window.opera) 
                    delta = -delta;
            }else if (e.detail){ 
                delta = -e.detail / 3;
            }
            if (delta){
                var scrollTop = this.getScrollTop(),
                    step = this.getStep(true);
                if (delta > 0){
                    scrollTop = scrollTop <= step ? 0 : scrollTop - step;
                }else{
                    scrollTop = scrollTop + step;
                }
                this.setScrollTop(scrollTop);
            }
            if (deltaX) {
                var scrollLeft = this.getScrollLeft(),
                    step = this.getStep(true, true);
                if (deltaX > 0) {
                    scrollLeft = scrollLeft <= step ? 0 : scrollLeft - step;
                } else {
                    scrollLeft = scrollLeft + step;
                }
                this.setScrollLeft(scrollLeft);
            }
            Rui.util.LEvent.preventDefault(e);
        }
    },
    onScrollY: function(e){
        if (!this.yScrollbarEl) 
            return;
        if(this.ignoreEvent === true) {
        	delete this.ignoreEvent;
        	return;
        }
        var scrollTop = (e && e.target) ? e.target.scrollTop : this.getScrollTop(),
            beforeScrollTop = this.scrollTop;
        if(scrollTop !== beforeScrollTop){
            this.scrollEl.dom.scrollTop = scrollTop * this.virtualScrollRate;
            this.scrollTop = scrollTop;
            if (beforeScrollTop || scrollTop){
                this.fireEvent('scrollY', {
                    target: this,
                    beforeScrollTop: beforeScrollTop,
                    scrollTop: scrollTop,
                    isFirst: scrollTop === 0 ? true : false,
                    isEnd: scrollTop >= this.getMaxScrollTop() ? true : false,
                    isUp: beforeScrollTop < scrollTop ? false : true
                });
            }
        }
    },
    onScrollX: function(e){
        if (!this.xScrollbarEl)
            return;
        var scrollLeft = (e && e.target) ? e.target.scrollLeft : this.getScrollLeft();
            beforeScrollLeft = this.scrollLeft;
        if (beforeScrollLeft !== scrollLeft || (e && e.isForce)){
            this.scrollEl.dom.scrollLeft = scrollLeft;
            this.scrollLeft = scrollLeft;
            if (beforeScrollLeft || scrollLeft){
                this.fireEvent('scrollX', {
                    target: this,
                    beforeScrollLeft: beforeScrollLeft,
                    scrollLeft: scrollLeft
                });
            }
        }
    },
    onTouchStart: function(e){
    	if(this.useVirtual !== true) return;
        if(Rui.util.LDom.isAncestor(this.el.dom, e.target)){
        	if(e.touches && e.touches.length > 1) {
        		this.onTouchEnd(e);
        		return;
        	}
            var t = e.targetTouches ? e.targetTouches[0] : e;
            this.touchStart = true;
            this.touchStartXY = {x: t.pageX, y: t.pageY};
        }
    },
    onTouchMove: function(e){
    	if(this.useVirtual !== true) return;
        if(this.touchStart === true){
        	if(e.touches && e.touches.length > 1) {
        		this.onTouchEnd(e);
        		return;
        	}
            var t = e.targetTouches ? e.targetTouches[0] : e,
                mp = {
                    x: this.touchStartXY.x - (t.pageX),
                    y: this.touchStartXY.y - (t.pageY)
                },
                y = 0, x = 0;
            if(mp.y != 0){
                y = this.getScrollTop() + mp.y;
                this.setScrollTop(y);
            }
            if(mp.x != 0){
                x = this.getScrollLeft() + mp.x;
                this.setScrollLeft(x);
            }
            this.touchStartXY = {x: t.pageX, y: t.pageY};
            Rui.util.LEvent.preventDefault(e);
        }
    },
    onTouchEnd: function(e){
    	if(this.useVirtual !== true) return;
        this.touchStart = null;
        this.touchStartXY = null;
    },
    refresh: function(reset){
        if(this.useVirtual === true){
            this.setupSizes();
        }
        if(reset === true){
            this.goStart();
            this.goStart(true);
            this.position = {};
        }else{
            var y = this.getPosition(false),
                x = this.getPosition(true);
            if(!Rui.isEmpty(y))
                this.setScrollTop(y);
            if(!Rui.isEmpty(x))
                this.setScrollLeft(x);
        }
    },
    onResize: function(e){
        this.refresh();
    },
    destroy: function(){
        var Event = Rui.util.LEvent;
        Event.removeListener(window, 'resize', this.onResize);
        if(this.yVirtualContentEl){
            this.yVirtualContentEl.remove();
            this.yVirtualContentEl = null;
            delete this.yVirtualContentEl;
        }
        if(this.xVirtualContentEl){
            this.xVirtualContentEl.remove();
            this.xVirtualContentEl = null;
            delete this.xVirtualContentEl;
        }
        if(this.xScrollbarEl){
            if(this.xScrollbarEl.dom){
                Event.removeListener(this.xScrollbarEl.dom, 'scroll', this.onScrollX);
            }
            this.xScrollbarEl.remove();
            this.xScrollbarEl = null;
            delete this.xScrollbarEl;
        }
        if(this.yScrollbarEl){
            if(this.yScrollbarEl.dom){
                Event.removeListener(this.yScrollbarEl.dom, 'scroll', this.onScrollY);
            }
            this.yScrollbarEl.remove();
            this.yScrollbarEl = null;
            delete this.yScrollbarEl;
        }
        if(this.contentEl){
            this.contentEl.removeClass('L-scroll-content');
            if(this.el){
                this.el.appendChild(this.contentEl);
            }
        }
        if(this.wrapperEl){
            this.wrapperEl.remove();
            this.wrapperEl = null;
            delete this.wrapperEl;
        }
        if(this.scrollEl){
            this.scrollEl.remove();
            this.scrollEl = null;
            delete this.scrollEl;
        }
        if(this.el){
            if(Rui.browser.mozilla){
                Event.removeListener(this.el.dom, 'DOMMouseScroll', this.onWheel);
            }else{
                Event.removeListener(this.el.dom, 'mousewheel', this.onWheel);
            }
            this.el.removeClass('L-scroller');
            this.el.setStyle('width', '');
            this.el.setStyle('height', '');
        }
        this.fireEvent('destroy');
        this.unOnAll();
        if(this.cfg) {
            this.cfg.destroy();
            this.cfg = null;
        }
    },
    toString: function() {
        return this.otype + ' ' + this.id;
    }
});
Rui.namespace('Rui.ui.calendar');
(function() {
    var Dom = Rui.util.LDom,
        Event = Rui.util.LEvent,
        Lang = Rui;
    function LCalendar(id, containerId, config) {
        if(arguments.length == 1 && (typeof id == 'object')) {
            config = id;
            id = containerId = (id.applyTo || id.renderTo) || id.id || Rui.id();
        }
        this.init.call(this, id, containerId, config);
        config = config || {};
        if(config) {
            if(config.applyTo){
                this.render();
            }else if(config.renderTo){
                this.render();
            }
        }
    }
    LCalendar.IMG_ROOT = null;
    LCalendar.DATE = 'D';
    LCalendar.MONTH_DAY = 'MD';
    LCalendar.WEEKDAY = 'WD';
    LCalendar.RANGE = 'R';
    LCalendar.MONTH = 'M';
    LCalendar.DISPLAY_DAYS = 42;
    LCalendar.STOP_RENDER = 'S';
    LCalendar.SHORT = 'short';
    LCalendar.LONG = 'long';
    LCalendar.MEDIUM = 'medium';
    LCalendar.ONE_CHAR = '1char';
    LCalendar._DEFAULT_CONFIG = {
        PAGEDATE: { key: 'pagedate', value: null },
        SELECTED: { key: 'selected', value: null },
        TITLE: { key: 'title', value: null },
        CLOSE: { key: 'close', value: false },
        IFRAME: { key: 'iframe', value: (Rui.browser.msie && Rui.browser.msie <= 6) ? true : false },
        MINDATE: { key: 'mindate', value: null },
        MAXDATE: { key: 'maxdate', value: null },
        MULTI_SELECT: { key: 'multi_select', value: false },
        START_WEEKDAY: { key: 'start_weekday', value: 0 },
        SHOW_WEEKDAYS: { key: 'show_weekdays', value: true },
        SHOW_WEEK_HEADER: { key: 'show_week_header', value: false },
        SHOW_WEEK_FOOTER: { key: 'show_week_footer', value: false },
        HIDE_BLANK_WEEKS: { key: 'hide_blank_weeks', value: false },
        NAV_ARROW_LEFT: { key: 'nav_arrow_left', value: null },
        NAV_ARROW_RIGHT: { key: 'nav_arrow_right', value: null },
        MONTHS_SHORT: { key: 'months_short', value: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
        MONTHS_LONG: { key: 'months_long', value: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] },
        WEEKDAYS_1CHAR: { key: 'weekdays_1char', value: ['S', 'M', 'T', 'W', 'T', 'F', 'S'] },
        WEEKDAYS_SHORT: { key: 'weekdays_short', value: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] },
        WEEKDAYS_MEDIUM: { key: 'weekdays_medium', value: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] },
        WEEKDAYS_LONG: { key: 'weekdays_long', value: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
        LOCALE_MONTHS: { key: 'locale_months', value: 'long' },
        LOCALE_WEEKDAYS: { key: 'locale_weekdays', value: 'short' },
        DATE_DELIMITER: { key: 'date_delimiter', value: ',' },
        DATE_FIELD_DELIMITER: { key: 'date_field_delimiter', value: '/' },
        DATE_RANGE_DELIMITER: { key: 'date_range_delimiter', value: '~' },
        MY_MONTH_POSITION: { key: 'my_month_position', value: 1 },
        MY_YEAR_POSITION: { key: 'my_year_position', value: 2 },
        MD_MONTH_POSITION: { key: 'md_month_position', value: 1 },
        MD_DAY_POSITION: { key: 'md_day_position', value: 2 },
        MDY_MONTH_POSITION: { key: 'mdy_month_position', value: 1 },
        MDY_DAY_POSITION: { key: 'mdy_day_position', value: 2 },
        MDY_YEAR_POSITION: { key: 'mdy_year_position', value: 3 },
        MY_LABEL_MONTH_POSITION: { key: 'my_label_month_position', value: 1 },
        MY_LABEL_YEAR_POSITION: { key: 'my_label_year_position', value: 2 },
        MY_LABEL_MONTH_SUFFIX: { key: 'my_label_month_suffix', value: ' ' },
        MY_LABEL_YEAR_SUFFIX: { key: 'my_label_year_suffix', value: '' },
        NAV: { key: 'navigator', value: null },
        STRINGS: {
            key: 'strings',
            value: {
                previousMonth: 'Previous Month',
                nextMonth: 'Next Month',
                previousYear: 'Previous Year',
                nextYear: 'Next Year',
                close: 'Close'
            },
            supercedes: ['close', 'title']
        }
    };
    var DEF_CFG = LCalendar._DEFAULT_CONFIG;
    LCalendar._EVENT_TYPES = {
        BEFORE_SELECT: 'beforeSelect',
        SELECT: 'select',
        BEFORE_DESELECT: 'beforeDeselect',
        DESELECT: 'deselect',
        BEFORE_CHANGE_PAGE: 'beforeChangePage',
        CHANGE_PAGE: 'changePage',
        BEFORE_RENDER: 'beforeRender',
        RENDER: 'render',
        RENDER_CELL: 'renderCell',
        BEFORE_DESTROY: 'beforeDestroy',
        DESTROY: 'destroy',
        RESET: 'reset',
        CLEAR: 'clear',
        BEFORE_HIDE: 'beforeHide',
        HIDE: 'hide',
        BEFORE_SHOW: 'beforeShow',
        SHOW: 'show',
        BEFORE_HIDE_NAV: 'beforeHideNav',
        HIDE_NAV: 'hideNav',
        BEFORE_SHOW_NAV: 'beforeShowNav',
        SHOW_NAV: 'showNav',
        BEFORE_RENDER_NAV: 'beforeRenderNav',
        RENDER_NAV: 'renderNav',
        CURSOR_IN: 'cursorIn',
        CURSOR_OUT: 'cursorOut'
    };
    LCalendar._STYLES = {
        CSS_ROW_HEADER: 'L-calrowhead',
        CSS_ROW_FOOTER: 'L-calrowfoot',
        CSS_CELL: 'L-calcell',
        CSS_CELL_SELECTOR: 'selector',
        CSS_CELL_SELECTED: 'selected',
        CSS_CELL_SELECTABLE: 'selectable',
        CSS_CELL_RESTRICTED: 'restricted',
        CSS_CELL_TODAY: 'today',
        CSS_CELL_OOM: 'oom',
        CSS_CELL_OOB: 'oob',
        CSS_HEADER: 'L-calheader',
        CSS_HEADER_TEXT: 'L-calhead',
        CSS_BODY: 'L-calbody',
        CSS_WEEKDAY_CELL: 'L-calweekdaycell',
        CSS_WEEKDAY_ROW: 'L-calweekdayrow',
        CSS_FOOTER: 'L-calfoot',
        CSS_CALENDAR: 'L-calendar',
        CSS_SINGLE: 'L-single',
        CSS_CONTAINER: 'L-calcontainer',
        CSS_NAV_YEAR_LEFT: 'L-calnavyearleft',
        CSS_NAV_YEAR_RIGHT: 'L-calnavyearright',
        CSS_NAV_LEFT: 'L-calnavleft',
        CSS_NAV_RIGHT: 'L-calnavright',
        CSS_NAV: 'L-calnav',
        CSS_CLOSE: 'L-calclose',
        CSS_CELL_TOP: 'L-calcelltop',
        CSS_CELL_LEFT: 'L-calcellleft',
        CSS_CELL_RIGHT: 'L-calcellright',
        CSS_CELL_BOTTOM: 'L-calcellbottom',
        CSS_CELL_HOVER: 'L-calcellhover',
        CSS_CELL_HIGHLIGHT1: 'highlight1',
        CSS_CELL_HIGHLIGHT2: 'highlight2',
        CSS_CELL_HIGHLIGHT3: 'highlight3',
        CSS_CELL_HIGHLIGHT4: 'highlight4'
    };
    LCalendar.prototype = {
        Config: null,
        parent: null,
        index: -1,
        cells: null,
        cellDates: null,
        id: null,
        containerId: null,
        oDomContainer: null,
        today: null,
        titleCode: '$.base.msg118',
        renderStack: null,
        _renderStack: null,
        oNavigator: null,
        _selectedDates: null,
        domEventMap: null,
        _parseArgs: function(args) {
            var nArgs = { id: null, container: null, config: null };
            if (args && args.length && args.length > 0) {
                switch (args.length) {
                    case 1:
                        nArgs.id = args[0].id ? args[0].id : null;
                        nArgs.container = args[0].applyTo ? args[0].applyTo : args[0];
                        nArgs.config = typeof args[0] == 'object' ? args[0] : null;
                        break;
                    case 2:
                        if (Rui.isObject(args[1]) && !args[1].tagName && !(args[1] instanceof String)) {
                            nArgs.id = null;
                            nArgs.container = args[0];
                            nArgs.config = args[1];
                        } else {
                            nArgs.id = args[0];
                            nArgs.container = args[1];
                            nArgs.config = null;
                        }
                        break;
                    default: 
                        nArgs.id = args[0];
                        nArgs.container = args[1];
                        nArgs.config = args[2];
                        break;
                }
            } else {
            }
            return nArgs;
        },
        init: function(id, container, config) {
            var nArgs = this._parseArgs(arguments);
            id = nArgs.id;
            container = nArgs.container;
            config = nArgs.config;
            config = Rui.applyIf(config, Rui.getConfig().getFirst('$.ext.calendar.defaultProperties'));
            if(config.titleCode) {
                var mm = Rui.getMessageManager();
                config.title = mm.get(config.titleCode);
            }
            var domConainer = Rui.get(container).dom;
            if (!domConainer.id) {
                domConainer.id = Dom.generateId();
            }
            if (!id) {
                id = domConainer.id + '_t';
            }
            this.id = id;
            this.containerId = domConainer.id;
            this.initEvents();
            if(!this.today && config && config.today) this.today = config.today;
            else this.today = new Date();
            Rui.util.LDate.clearTime(this.today);
            this.cfg = new Rui.ui.LConfig(this);
            this.Options = {};
            this.Locale = {};
            this.initStyles();
            Dom.addClass(domConainer, this.Style.CSS_CONTAINER);
            Dom.addClass(domConainer, this.Style.CSS_SINGLE);
            Dom.addClass(domConainer, 'L-fixed');
            this.oDomContainer = domConainer;
            this.cellDates = [];
            this.cells = [];
            this.renderStack = [];
            this._renderStack = [];
            this.setupConfig();
            if (config) {
                this.cfg.applyConfig(config, true);
            }
            this.cfg.fireQueue();
            this._setDefaultLocale();
        },
        setProperty : function(key, value){
            this.cfg.setProperty(key, value);
        },
        getProperty : function(key){
            return this.cfg.getProperty(key);
        },
        _setDefaultLocale: function(config) {
            var locale = Rui.getConfig().getFirst('$.core.defaultLocale');
            var mm = Rui.getMessageManager();
            var title = mm.get(this.titleCode);
            var aLocale = Rui.util.LDate.getLocale(locale);
            var x = aLocale['x'];
            var order = x.split('%');
            var posY = 1;
            var posM = 2;
            var posD = 3;
            var c = '';
            for (var i=1;i<order.length;i++)
            {
                c = order[i].toLowerCase().charAt(0);
                switch(c){
                    case 'y':
                        posY = i;
                        break;
                    case 'm':
                        posM = i;
                        break;
                    case 'd':
                        posD = i;
                        break;
                }                
            }   
            var delimiter = x.charAt(2) == '%' ? '' : x.charAt(2);          
            if(this.cfg.getProperty('TITLE') == null) this.cfg.setProperty('TITLE', title);
            this.cfg.setProperty('START_WEEKDAY', mm.get('$.core.startWeekDay'));            
            this.cfg.setProperty('MONTHS_SHORT',aLocale['b']);
            this.cfg.setProperty('MONTHS_LONG',aLocale['B'] );
            this.cfg.setProperty('WEEKDAYS_1CHAR', mm.get('$.core.weekdays1Char'));
            this.cfg.setProperty('WEEKDAYS_SHORT', mm.get('$.core.shortDayInWeek'));
            this.cfg.setProperty('WEEKDAYS_MEDIUM',aLocale['a']);
            this.cfg.setProperty('WEEKDAYS_LONG',aLocale['A']);
            this.cfg.setProperty('LOCALE_MONTHS', mm.get('$.core.localeMonths'));
            this.cfg.setProperty('LOCALE_WEEKDAYS', mm.get('$.core.localeWeekdays'));
            this.cfg.setProperty('DATE_DELIMITER', mm.get('$.core.dateDelimiter'));
            this.cfg.setProperty('DATE_FIELD_DELIMITER',delimiter);
            this.cfg.setProperty('DATE_RANGE_DELIMITER', mm.get('$.core.dateRangeDelimiter'));
            this.cfg.setProperty('MY_MONTH_POSITION',posM);
            this.cfg.setProperty('MY_YEAR_POSITION',posY);
            this.cfg.setProperty('MD_MONTH_POSITION',posM);
            this.cfg.setProperty('MD_DAY_POSITION',posD);
            this.cfg.setProperty('MDY_MONTH_POSITION',posM);
            this.cfg.setProperty('MDY_DAY_POSITION',posD);
            this.cfg.setProperty('MDY_YEAR_POSITION',posY);
            this.cfg.setProperty('MY_LABEL_MONTH_POSITION',posM );
            this.cfg.setProperty('MY_LABEL_YEAR_POSITION',posY);
            this.cfg.setProperty('MY_LABEL_MONTH_SUFFIX', mm.get('$.core.myLabelMonthSuffix'));
            this.cfg.setProperty('MY_LABEL_YEAR_SUFFIX', mm.get('$.core.myLabelYearSuffix'));
        },
        configIframe: function(type, args, obj) {
            var useIframe = args[0];
            if (!this.parent) {
                if (Dom.inDocument(this.oDomContainer)) {
                    if (useIframe) {
                        var pos = Dom.getStyle(this.oDomContainer, 'position');
                        if (pos == 'absolute' || pos == 'relative') {
                            if (!Dom.inDocument(this.iframe)) {
                                this.iframe = document.createElement('iframe');
                                this.iframe.width = this.oDomContainer.style.width;
                                this.iframe.height = this.oDomContainer.style.height;
                                Dom.setStyle(this.iframe, 'opacity', '0');                                
                                if (Rui.browser.msie && Rui.browser.msie <= 6) {
                                    Dom.addClass(this.iframe, 'fixedsize'); 
                                }
                                this.oDomContainer.insertBefore(this.iframe, this.oDomContainer.firstChild);
                            }
                        }
                    } else {
                        if (this.iframe) {
                            if (this.iframe.parentNode) {
                                this.iframe.parentNode.removeChild(this.iframe);
                            }
                            this.iframe = null;
                        }
                    }
                }
            }
        },
        configTitle: function(type, args, obj) {
            var title = args[0];
            if (title) {
                this.createTitleBar(title);
            } else {
                var close = this.cfg.getProperty(DEF_CFG.CLOSE.key);
                if (!close) {
                    this.removeTitleBar();
                } else {
                    this.createTitleBar('&#160;');
                }
            }
        },
        configClose: function(type, args, obj) {
            var close = args[0],
            title = this.cfg.getProperty(DEF_CFG.TITLE.key);
            if (close) {
                if (!title) {
                    this.createTitleBar('&#160;');
                }
                this.createCloseButton();
            } else {
                this.removeCloseButton();
                if (!title) {
                    this.removeTitleBar();
                }
            }
        },
        initEvents: function() {
            var defEvents = LCalendar._EVENT_TYPES,
            CE = Rui.util.LCustomEvent,
            cal = this; 
            cal.beforeSelectEvent = new CE(defEvents.BEFORE_SELECT, this, false, Rui.util.LCustomEvent.FLAT);
            cal.selectEvent = new CE(defEvents.SELECT, this, false, Rui.util.LCustomEvent.FLAT);
            cal.beforeDeselectEvent = new CE(defEvents.BEFORE_DESELECT);
            cal.deselectEvent = new CE(defEvents.DESELECT, this, false, Rui.util.LCustomEvent.FLAT);
            cal.beforeChangePageEvent = new CE(defEvents.BEFORE_CHANGE_PAGE, this, false, Rui.util.LCustomEvent.FLAT);
            cal.changePageEvent = new CE(defEvents.CHANGE_PAGE, this, false, Rui.util.LCustomEvent.FLAT);
            cal.beforeRenderEvent = new CE(defEvents.BEFORE_RENDER, this, false, Rui.util.LCustomEvent.FLAT);
            cal.renderEvent = new CE(defEvents.RENDER, this, false, Rui.util.LCustomEvent.FLAT);
            cal.renderCellEvent = new CE(defEvents.RENDER_CELL, this, false, Rui.util.LCustomEvent.FLAT);
            cal.beforeDestroyEvent = new CE(defEvents.BEFORE_DESTROY, this, false, Rui.util.LCustomEvent.FLAT);
            cal.destroyEvent = new CE(defEvents.DESTROY, this, false, Rui.util.LCustomEvent.FLAT);
            cal.resetEvent = new CE(defEvents.RESET, this, false, Rui.util.LCustomEvent.FLAT);
            cal.clearEvent = new CE(defEvents.CLEAR, this, false, Rui.util.LCustomEvent.FLAT);
            cal.beforeShowEvent = new CE(defEvents.BEFORE_SHOW, this, false, Rui.util.LCustomEvent.FLAT);
            cal.showEvent = new CE(defEvents.SHOW, this, false, Rui.util.LCustomEvent.FLAT);
            cal.beforeHideEvent = new CE(defEvents.BEFORE_HIDE, this, false, Rui.util.LCustomEvent.FLAT);
            cal.hideEvent = new CE(defEvents.HIDE, this, false, Rui.util.LCustomEvent.FLAT);
            cal.beforeShowNavEvent = new CE(defEvents.BEFORE_SHOW_NAV, this, false, Rui.util.LCustomEvent.FLAT);
            cal.showNavEvent = new CE(defEvents.SHOW_NAV, this, false, Rui.util.LCustomEvent.FLAT);
            cal.beforeHideNavEvent = new CE(defEvents.BEFORE_HIDE_NAV, this, false, Rui.util.LCustomEvent.FLAT);
            cal.hideNavEvent = new CE(defEvents.HIDE_NAV, this, false, Rui.util.LCustomEvent.FLAT);
            cal.beforeRenderNavEvent = new CE(defEvents.BEFORE_RENDER_NAV, this, false, Rui.util.LCustomEvent.FLAT);
            cal.renderNavEvent = new CE(defEvents.RENDER_NAV, this, false, Rui.util.LCustomEvent.FLAT);
            cal.cursorInEvent = new CE(defEvents.CURSOR_IN, this, false, Rui.util.LCustomEvent.FLAT);
            cal.cursorOutEvent = new CE(defEvents.CURSOR_OUT, this, false, Rui.util.LCustomEvent.FLAT);
            cal.beforeSelectEvent.on(cal.onBeforeSelect, this, true);
            cal.selectEvent.on(cal.onSelect, this, true);
            cal.beforeDeselectEvent.on(cal.onBeforeDeselect, this, true);
            cal.deselectEvent.on(cal.onDeselect, this, true);
            cal.changePageEvent.on(cal.onChangePage, this, true);
            cal.renderEvent.on(cal.onRender, this, true);
            cal.resetEvent.on(cal.onReset, this, true);
            cal.clearEvent.on(cal.onClear, this, true);
        },
        doPreviousMonthNav: function(e, cal) {
            Event.preventDefault(e);
            setTimeout(function() {
                if(cal.beforeChangePageEvent.fire(this, e) == false) return;
                cal.previousMonth();
                var navs = Dom.getElementsByClassName(cal.Style.CSS_NAV_LEFT, 'a', cal.oDomContainer);
                if (navs && navs[0]) {
                    try {
                        navs[0].focus();
                    } catch (e) {
                    }
                }
            }, Rui.platform.isMobile ? 10 : 0);
        },
        doNextMonthNav: function(e, cal) {
            Event.preventDefault(e);
            setTimeout(function() {
                if(cal.beforeChangePageEvent.fire(this, e) == false) return;
                cal.nextMonth();
                var navs = Dom.getElementsByClassName(cal.Style.CSS_NAV_RIGHT, 'a', cal.oDomContainer);
                if (navs && navs[0]) {
                    try {
                        navs[0].focus();
                    } catch (e) {
                    }
                }
            }, Rui.platform.isMobile ? 10 : 0);
        },
        doPreviousYearNav: function(e, cal) {
            Event.preventDefault(e);
            setTimeout(function() {
                if(cal.beforeChangePageEvent.fire(this, e) == false) return;
                cal.previousYear();
                var navs = Dom.getElementsByClassName(cal.Style.CSS_NAV_YEAR_LEFT, 'a', cal.oDomContainer);
                if (navs && navs[0]) {
                    try {
                        navs[0].focus();
                    } catch (e) {
                    }
                }
            }, Rui.platform.isMobile ? 10 : 0);
        },
        doNextYearNav: function(e, cal) {
            Event.preventDefault(e);
            setTimeout(function() {
                if(cal.beforeChangePageEvent.fire(this, e) == false) return;
                cal.nextYear();
                var navs = Dom.getElementsByClassName(cal.Style.CSS_NAV_YEAR_RIGHT, 'a', cal.oDomContainer);
                if (navs && navs[0]) {
                    try {
                        navs[0].focus();
                    } catch (e) {
                    }
                }
            }, Rui.platform.isMobile ? 10 : 0);
        },
        doSelectCell: function(e, cal) {
            var cell, d, index;
            var target = Event.getTarget(e),
            tagName = target.tagName.toLowerCase(),
            defSelector = false;
            while (tagName != 'td' && !Dom.hasClass(target, cal.Style.CSS_CELL_SELECTABLE)) {
                if (!defSelector && tagName == 'a' && Dom.hasClass(target, cal.Style.CSS_CELL_SELECTOR)) {
                    defSelector = true;
                }
                target = target.parentNode;
                tagName = target.tagName.toLowerCase();
                if (target == this.oDomContainer || tagName == 'html') {
                    return;
                }
            }
            if (defSelector) {
                Event.preventDefault(e);
            }
            cell = target;
            if (Dom.hasClass(cell, cal.Style.CSS_CELL_SELECTABLE)) {
                index = cal.getIndexFromId(cell.id);
                if (index > -1) {
                    d = cal.cellDates[index];
                    if (d) {
                        var link;
                        if (cal.Options.MULTI_SELECT) {
                            link = cell.getElementsByTagName('a')[0];
                            if (link) {
                                link.blur();
                            }
                            var cellDate = cal.cellDates[index];
                            var cellDateIndex = cal._indexOfSelectedFieldArray(cellDate);
                            if (cellDateIndex > -1) {
                                cal.deselectCell(index);
                            } else {
                                cal.selectCell(index);
                            }
                        } else {
                            link = cell.getElementsByTagName('a')[0];
                            if (link) {
                                link.blur();
                            }
                            cal.selectCell(index);
                        }
                    }
                }
            }
        },
        doCellMouseOver: function(e, cal) {
            var target;
            if (e) {
                target = Event.getTarget(e);
            } else {
                target = this;
            }
            while (target.tagName && target.tagName.toLowerCase() != 'td') {
                target = target.parentNode;
                if (!target.tagName || target.tagName.toLowerCase() == 'html') {
                    return;
                }
            }
            if(!target.id) return;
            if (Dom.hasClass(target, cal.Style.CSS_CELL_SELECTABLE)) {
                Dom.addClass(target, cal.Style.CSS_CELL_HOVER);
            }
            var cellIndex = cal.getIndexFromId(target.id),
                cellDate = cal.cellDates[cellIndex];
            cal.cursorInEvent.fire({
                cellDate: cellDate,
                date: cal._toDate(cellDate)
            });
        },
        doCellMouseOut: function(e, cal) {
            var target;
            if (e) {
                target = Event.getTarget(e);
            } else {
                target = this;
            }
            while (target.tagName && target.tagName.toLowerCase() != 'td') {
                target = target.parentNode;
                if (!target.tagName || target.tagName.toLowerCase() == 'html') {
                    return;
                }
            }
            if(!target.id) return;
            if (Dom.hasClass(target, cal.Style.CSS_CELL_SELECTABLE)) {
                Dom.removeClass(target, cal.Style.CSS_CELL_HOVER);
            }
            var cellIndex = cal.getIndexFromId(target.id),
                cellDate = cal.cellDates[cellIndex];
            cal.cursorOutEvent.fire({
                cellDate: cellDate,
                date: cal._toDate(cellDate)
            });
        },
        setupConfig: function() {
            var cfg = this.cfg;
            cfg.addProperty(DEF_CFG.PAGEDATE.key, { value: new Date(), handler: this.configPageDate });
            cfg.addProperty(DEF_CFG.SELECTED.key, { value: [], handler: this.configSelected });
            cfg.addProperty(DEF_CFG.TITLE.key, { value: DEF_CFG.TITLE.value, handler: this.configTitle });
            cfg.addProperty(DEF_CFG.CLOSE.key, { value: DEF_CFG.CLOSE.value, handler: this.configClose });
            cfg.addProperty(DEF_CFG.IFRAME.key, { value: DEF_CFG.IFRAME.value, handler: this.configIframe, validator: cfg.checkBoolean });
            cfg.addProperty(DEF_CFG.MINDATE.key, { value: DEF_CFG.MINDATE.value, handler: this.configMinDate });
            cfg.addProperty(DEF_CFG.MAXDATE.key, { value: DEF_CFG.MAXDATE.value, handler: this.configMaxDate });
            cfg.addProperty(DEF_CFG.MULTI_SELECT.key, { value: DEF_CFG.MULTI_SELECT.value, handler: this.configOptions, validator: cfg.checkBoolean });
            cfg.addProperty(DEF_CFG.START_WEEKDAY.key, { value: DEF_CFG.START_WEEKDAY.value, handler: this.configOptions, validator: cfg.checkNumber });
            cfg.addProperty(DEF_CFG.SHOW_WEEKDAYS.key, { value: DEF_CFG.SHOW_WEEKDAYS.value, handler: this.configOptions, validator: cfg.checkBoolean });
            cfg.addProperty(DEF_CFG.SHOW_WEEK_HEADER.key, { value: DEF_CFG.SHOW_WEEK_HEADER.value, handler: this.configOptions, validator: cfg.checkBoolean });
            cfg.addProperty(DEF_CFG.SHOW_WEEK_FOOTER.key, { value: DEF_CFG.SHOW_WEEK_FOOTER.value, handler: this.configOptions, validator: cfg.checkBoolean });
            cfg.addProperty(DEF_CFG.HIDE_BLANK_WEEKS.key, { value: DEF_CFG.HIDE_BLANK_WEEKS.value, handler: this.configOptions, validator: cfg.checkBoolean });
            cfg.addProperty(DEF_CFG.NAV_ARROW_LEFT.key, { value: DEF_CFG.NAV_ARROW_LEFT.value, handler: this.configOptions });
            cfg.addProperty(DEF_CFG.NAV_ARROW_RIGHT.key, { value: DEF_CFG.NAV_ARROW_RIGHT.value, handler: this.configOptions });
            cfg.addProperty(DEF_CFG.MONTHS_SHORT.key, { value: DEF_CFG.MONTHS_SHORT.value, handler: this.configLocale });
            cfg.addProperty(DEF_CFG.MONTHS_LONG.key, { value: DEF_CFG.MONTHS_LONG.value, handler: this.configLocale });
            cfg.addProperty(DEF_CFG.WEEKDAYS_1CHAR.key, { value: DEF_CFG.WEEKDAYS_1CHAR.value, handler: this.configLocale });
            cfg.addProperty(DEF_CFG.WEEKDAYS_SHORT.key, { value: DEF_CFG.WEEKDAYS_SHORT.value, handler: this.configLocale });
            cfg.addProperty(DEF_CFG.WEEKDAYS_MEDIUM.key, { value: DEF_CFG.WEEKDAYS_MEDIUM.value, handler: this.configLocale });
            cfg.addProperty(DEF_CFG.WEEKDAYS_LONG.key, { value: DEF_CFG.WEEKDAYS_LONG.value, handler: this.configLocale });
            var refreshLocale = function() {
                cfg.refireEvent(DEF_CFG.LOCALE_MONTHS.key);
                cfg.refireEvent(DEF_CFG.LOCALE_WEEKDAYS.key);
            };
            cfg.subscribeToConfigEvent(DEF_CFG.START_WEEKDAY.key, refreshLocale, this, true);
            cfg.subscribeToConfigEvent(DEF_CFG.MONTHS_SHORT.key, refreshLocale, this, true);
            cfg.subscribeToConfigEvent(DEF_CFG.MONTHS_LONG.key, refreshLocale, this, true);
            cfg.subscribeToConfigEvent(DEF_CFG.WEEKDAYS_1CHAR.key, refreshLocale, this, true);
            cfg.subscribeToConfigEvent(DEF_CFG.WEEKDAYS_SHORT.key, refreshLocale, this, true);
            cfg.subscribeToConfigEvent(DEF_CFG.WEEKDAYS_MEDIUM.key, refreshLocale, this, true);
            cfg.subscribeToConfigEvent(DEF_CFG.WEEKDAYS_LONG.key, refreshLocale, this, true);
            cfg.addProperty(DEF_CFG.LOCALE_MONTHS.key, { value: DEF_CFG.LOCALE_MONTHS.value, handler: this.configLocaleValues });
            cfg.addProperty(DEF_CFG.LOCALE_WEEKDAYS.key, { value: DEF_CFG.LOCALE_WEEKDAYS.value, handler: this.configLocaleValues });
            cfg.addProperty(DEF_CFG.DATE_DELIMITER.key, { value: DEF_CFG.DATE_DELIMITER.value, handler: this.configLocale });
            cfg.addProperty(DEF_CFG.DATE_FIELD_DELIMITER.key, { value: DEF_CFG.DATE_FIELD_DELIMITER.value, handler: this.configLocale });
            cfg.addProperty(DEF_CFG.DATE_RANGE_DELIMITER.key, { value: DEF_CFG.DATE_RANGE_DELIMITER.value, handler: this.configLocale });
            cfg.addProperty(DEF_CFG.MY_MONTH_POSITION.key, { value: DEF_CFG.MY_MONTH_POSITION.value, handler: this.configLocale, validator: cfg.checkNumber });
            cfg.addProperty(DEF_CFG.MY_YEAR_POSITION.key, { value: DEF_CFG.MY_YEAR_POSITION.value, handler: this.configLocale, validator: cfg.checkNumber });
            cfg.addProperty(DEF_CFG.MD_MONTH_POSITION.key, { value: DEF_CFG.MD_MONTH_POSITION.value, handler: this.configLocale, validator: cfg.checkNumber });
            cfg.addProperty(DEF_CFG.MD_DAY_POSITION.key, { value: DEF_CFG.MD_DAY_POSITION.value, handler: this.configLocale, validator: cfg.checkNumber });
            cfg.addProperty(DEF_CFG.MDY_MONTH_POSITION.key, { value: DEF_CFG.MDY_MONTH_POSITION.value, handler: this.configLocale, validator: cfg.checkNumber });
            cfg.addProperty(DEF_CFG.MDY_DAY_POSITION.key, { value: DEF_CFG.MDY_DAY_POSITION.value, handler: this.configLocale, validator: cfg.checkNumber });
            cfg.addProperty(DEF_CFG.MDY_YEAR_POSITION.key, { value: DEF_CFG.MDY_YEAR_POSITION.value, handler: this.configLocale, validator: cfg.checkNumber });
            cfg.addProperty(DEF_CFG.MY_LABEL_MONTH_POSITION.key, { value: DEF_CFG.MY_LABEL_MONTH_POSITION.value, handler: this.configLocale, validator: cfg.checkNumber });
            cfg.addProperty(DEF_CFG.MY_LABEL_YEAR_POSITION.key, { value: DEF_CFG.MY_LABEL_YEAR_POSITION.value, handler: this.configLocale, validator: cfg.checkNumber });
            cfg.addProperty(DEF_CFG.MY_LABEL_MONTH_SUFFIX.key, { value: DEF_CFG.MY_LABEL_MONTH_SUFFIX.value, handler: this.configLocale });
            cfg.addProperty(DEF_CFG.MY_LABEL_YEAR_SUFFIX.key, { value: DEF_CFG.MY_LABEL_YEAR_SUFFIX.value, handler: this.configLocale });
            cfg.addProperty(DEF_CFG.NAV.key, { value: DEF_CFG.NAV.value, handler: this.configNavigator });
            cfg.addProperty(DEF_CFG.STRINGS.key, {
                value: DEF_CFG.STRINGS.value,
                handler: this.configStrings,
                validator: function(val) {
                    return Rui.isObject(val);
                },
                supercedes: DEF_CFG.STRINGS.supercedes
            });
        },
        configStrings: function(type, args, obj) {
            var val = Lang.merge(DEF_CFG.STRINGS.value, args[0]);
            this.cfg.setProperty(DEF_CFG.STRINGS.key, val, true);
        },
        configPageDate: function(type, args, obj) {
            this.cfg.setProperty(DEF_CFG.PAGEDATE.key, this._parsePageDate(args[0]), true);
        },
        configMinDate: function(type, args, obj) {
            var val = args[0];
            if (Rui.isString(val)) {
                val = this._parseDate(val);
                this.cfg.setProperty(DEF_CFG.MINDATE.key, Rui.util.LDate.getDate(val[0], (val[1] - 1), val[2]));
            }
        },
        configMaxDate: function(type, args, obj) {
            var val = args[0];
            if (Rui.isString(val)) {
                val = this._parseDate(val);
                this.cfg.setProperty(DEF_CFG.MAXDATE.key, Rui.util.LDate.getDate(val[0], (val[1] - 1), val[2]));
            }
        },
        configSelected: function(type, args, obj) {
            var selected = args[0],
            cfgSelected = DEF_CFG.SELECTED.key;
            if (selected) {
                if (Rui.isString(selected)) {
                    this.cfg.setProperty(cfgSelected, this._parseDates(selected), true);
                }
            }
            if (!this._selectedDates) {
                this._selectedDates = this.cfg.getProperty(cfgSelected);
            }
        },
        configOptions: function(type, args, obj) {
            this.Options[type.toUpperCase()] = args[0];
        },
        configLocale: function(type, args, obj) {
            this.Locale[type.toUpperCase()] = args[0];
            this.cfg.refireEvent(DEF_CFG.LOCALE_MONTHS.key);
            this.cfg.refireEvent(DEF_CFG.LOCALE_WEEKDAYS.key);
        },
        configLocaleValues: function(type, args, obj) {
            type = type.toLowerCase();
            var val = args[0],
            cfg = this.cfg,
            Locale = this.Locale;
            switch (type) {
                case DEF_CFG.LOCALE_MONTHS.key:
                    switch (val) {
                        case LCalendar.SHORT:
                            Locale.LOCALE_MONTHS = cfg.getProperty(DEF_CFG.MONTHS_SHORT.key).concat();
                            break;
                        case LCalendar.LONG:
                             Locale.LOCALE_MONTHS = cfg.getProperty(DEF_CFG.MONTHS_LONG.key).concat();
                            break;
                    }
                    break;
                case DEF_CFG.LOCALE_WEEKDAYS.key:
                    switch (val) {
                        case LCalendar.ONE_CHAR:
                            Locale.LOCALE_WEEKDAYS = cfg.getProperty(DEF_CFG.WEEKDAYS_1CHAR.key).concat();
                            break;
                        case LCalendar.SHORT:
                            Locale.LOCALE_WEEKDAYS = cfg.getProperty(DEF_CFG.WEEKDAYS_SHORT.key).concat();
                            break;
                        case LCalendar.MEDIUM:
                            Locale.LOCALE_WEEKDAYS = cfg.getProperty(DEF_CFG.WEEKDAYS_MEDIUM.key).concat();
                            break;
                        case LCalendar.LONG:
                            Locale.LOCALE_WEEKDAYS = cfg.getProperty(DEF_CFG.WEEKDAYS_LONG.key).concat();
                            break;
                    }
                    var START_WEEKDAY = cfg.getProperty(DEF_CFG.START_WEEKDAY.key);
                    if (START_WEEKDAY > 0) {
                        for (var w = 0; w < START_WEEKDAY; ++w) {
                            Locale.LOCALE_WEEKDAYS.push(Locale.LOCALE_WEEKDAYS.shift());
                        }
                    }
                    break;
            }
        },
        configNavigator: function(type, args, obj) {
            var val = args[0];
            if (Rui.ui.calendar.LCalendarNavigator && (val === true || Rui.isObject(val))) {
                if (!this.oNavigator) {
                    this.oNavigator = new Rui.ui.calendar.LCalendarNavigator(this);
                    this.beforeRenderEvent.on(function() {
                        if (!this.pages) {
                            this.oNavigator.erase();
                        }
                    }, this, true);
                }
            } else {
                if (this.oNavigator) {
                    this.oNavigator.destroy();
                    this.oNavigator = null;
                }
            }
        },
        initStyles: function() {
            var defStyle = LCalendar._STYLES;
            this.Style = {
                CSS_ROW_HEADER: defStyle.CSS_ROW_HEADER,
                CSS_ROW_FOOTER: defStyle.CSS_ROW_FOOTER,
                CSS_CELL: defStyle.CSS_CELL,
                CSS_CELL_SELECTOR: defStyle.CSS_CELL_SELECTOR,
                CSS_CELL_SELECTED: defStyle.CSS_CELL_SELECTED,
                CSS_CELL_SELECTABLE: defStyle.CSS_CELL_SELECTABLE,
                CSS_CELL_RESTRICTED: defStyle.CSS_CELL_RESTRICTED,
                CSS_CELL_TODAY: defStyle.CSS_CELL_TODAY,
                CSS_CELL_OOM: defStyle.CSS_CELL_OOM,
                CSS_CELL_OOB: defStyle.CSS_CELL_OOB,
                CSS_HEADER: defStyle.CSS_HEADER,
                CSS_HEADER_TEXT: defStyle.CSS_HEADER_TEXT,
                CSS_BODY: defStyle.CSS_BODY,
                CSS_WEEKDAY_CELL: defStyle.CSS_WEEKDAY_CELL,
                CSS_WEEKDAY_ROW: defStyle.CSS_WEEKDAY_ROW,
                CSS_FOOTER: defStyle.CSS_FOOTER,
                CSS_CALENDAR: defStyle.CSS_CALENDAR,
                CSS_SINGLE: defStyle.CSS_SINGLE,
                CSS_CONTAINER: defStyle.CSS_CONTAINER,
                CSS_NAV_YEAR_LEFT: defStyle.CSS_NAV_YEAR_LEFT,
                CSS_NAV_YEAR_RIGHT: defStyle.CSS_NAV_YEAR_RIGHT,
                CSS_NAV_LEFT: defStyle.CSS_NAV_LEFT,
                CSS_NAV_RIGHT: defStyle.CSS_NAV_RIGHT,
                CSS_NAV: defStyle.CSS_NAV,
                CSS_CLOSE: defStyle.CSS_CLOSE,
                CSS_CELL_TOP: defStyle.CSS_CELL_TOP,
                CSS_CELL_LEFT: defStyle.CSS_CELL_LEFT,
                CSS_CELL_RIGHT: defStyle.CSS_CELL_RIGHT,
                CSS_CELL_BOTTOM: defStyle.CSS_CELL_BOTTOM,
                CSS_CELL_HOVER: defStyle.CSS_CELL_HOVER,
                CSS_CELL_HIGHLIGHT1: defStyle.CSS_CELL_HIGHLIGHT1,
                CSS_CELL_HIGHLIGHT2: defStyle.CSS_CELL_HIGHLIGHT2,
                CSS_CELL_HIGHLIGHT3: defStyle.CSS_CELL_HIGHLIGHT3,
                CSS_CELL_HIGHLIGHT4: defStyle.CSS_CELL_HIGHLIGHT4
            };
        },
        buildMonthLabel: function() {
            return this._buildMonthLabel(this.cfg.getProperty(DEF_CFG.PAGEDATE.key));
        },
        _buildMonthLabel: function(date) {
            var m = this.Locale.LOCALE_MONTHS[date.getMonth()],
                mLabel = this.Locale.MY_LABEL_MONTH_SUFFIX,
                y = date.getFullYear(),
                yLabel = this.Locale.MY_LABEL_YEAR_SUFFIX;
            if (this.Locale.MY_LABEL_MONTH_POSITION == 2 || this.Locale.MY_LABEL_YEAR_POSITION == 1) {
                return '<span class="year">' + y + '</span><span class="year-suffix">' + yLabel + '</span><span class="month">' + m + '</span><span class="month-suffix">' + mLabel + '</span>';
            } else {
                return '<span class="month">' + m + '</span><span class="month-suffix">' + mLabel + '</span><span class="year">' + y + '</span><span class="year-suffix">' + yLabel + '</span>';
            }
        },
        _buildYearLabel: function(date) {
            var m = this.Locale.LOCALE_MONTHS[date.getMonth()],
                mLabel = this.Locale.MY_LABEL_MONTH_SUFFIX,
                y = date.getFullYear(),
                yLabel = this.Locale.MY_LABEL_YEAR_SUFFIX;
            if (this.Locale.MY_LABEL_MONTH_POSITION == 2 || this.Locale.MY_LABEL_YEAR_POSITION == 1) {
                return '<span class="year">' + y + '</span><span class="year-suffix">' + yLabel + '</span><span class="month">' + m + '</span><span class="month-suffix">' + mLabel + '</span>';
            } else {
                return '<span class="month">' + m + '</span><span class="month-suffix">' + mLabel + '</span><span class="year">' + y + '</span><span class="year-suffix">' + yLabel + '</span>';
            }
        },
        buildDayLabel: function(workingDate) {
            return workingDate.getDate();
        },
        createTitleBar: function(strTitle) {
            var tDiv = Dom.getElementsByClassName(Rui.ui.calendar.LCalendarGroup.CSS_2UPTITLE, 'div', this.oDomContainer)[0] || document.createElement('div');
            tDiv.className = Rui.ui.calendar.LCalendarGroup.CSS_2UPTITLE;
            tDiv.innerHTML = strTitle;
            this.oDomContainer.insertBefore(tDiv, this.oDomContainer.firstChild);
            Dom.addClass(this.oDomContainer, 'withtitle');
            return tDiv;
        },
        removeTitleBar: function() {
            var tDiv = Dom.getElementsByClassName(Rui.ui.calendar.LCalendarGroup.CSS_2UPTITLE, 'div', this.oDomContainer)[0] || null;
            if (tDiv) {
                Event.purgeElement(tDiv);
                this.oDomContainer.removeChild(tDiv);
            }
            Dom.removeClass(this.oDomContainer, 'withtitle');
        },
        createCloseButton: function() {
            var cssClose = Rui.ui.calendar.LCalendarGroup.CSS_2UPCLOSE,
            DEPR_CLOSE_PATH = 'us/my/bn/x_d.gif',
            lnk = Dom.getElementsByClassName('link-close', 'a', this.oDomContainer)[0],
            strings = this.cfg.getProperty(DEF_CFG.STRINGS.key),
            closeStr = (strings && strings.close) ? strings.close : '';
            if (!lnk) {
                lnk = document.createElement('a');
                Event.addListener(lnk, 'click', function(e, cal) {
                    cal.hide();
                    Event.preventDefault(e);
                }, this);
            }
            lnk.href = '#';
            lnk.className = 'link-close';
            if (LCalendar.IMG_ROOT !== null) {
                var img = Dom.getElementsByClassName(cssClose, 'img', lnk)[0] || document.createElement('img');
                img.src = LCalendar.IMG_ROOT + DEPR_CLOSE_PATH;
                img.className = cssClose;
                lnk.appendChild(img);
            } else {
                lnk.innerHTML = '<span class="' + cssClose + ' ' + this.Style.CSS_CLOSE + '">' + closeStr + '</span>';
            }
            this.oDomContainer.appendChild(lnk);
            return lnk;
        },
        removeCloseButton: function() {
            var btn = Dom.getElementsByClassName('link-close', 'a', this.oDomContainer)[0] || null;
            if (btn) {
                Event.purgeElement(btn);
                this.oDomContainer.removeChild(btn);
            }
        },
        renderHeader: function(html) {
            var colSpan = 7,
                DEPR_NAV_LEFT = 'us/tr/callt.gif',
                DEPR_NAV_RIGHT = 'us/tr/calrt.gif',
                cfg = this.cfg,
                pageDate = cfg.getProperty(DEF_CFG.PAGEDATE.key),
                strings = cfg.getProperty(DEF_CFG.STRINGS.key),
                prevStr = (strings && strings.previousMonth) ? strings.previousMonth : '',
                nextStr = (strings && strings.nextMonth) ? strings.nextMonth : '',
                monthLabel,
                prevYearStr = (strings && strings.previousYear) ? strings.previousYear : '',
                nextYearStr = (strings && strings.nextYear) ? strings.nextYear : '',
                yearLabel;
            if (cfg.getProperty(DEF_CFG.SHOW_WEEK_HEADER.key)) {
                colSpan += 1;
            }
            if (cfg.getProperty(DEF_CFG.SHOW_WEEK_FOOTER.key)) {
                colSpan += 1;
            }
            html[html.length] = '<thead>';
            html[html.length] = '<tr>';
            html[html.length] = '<th colspan="' + colSpan + '" class="' + this.Style.CSS_HEADER_TEXT + '">';
            html[html.length] = '<div class="' + this.Style.CSS_HEADER + '">';
            var renderLeft, renderRight = false;
            if (this.parent) {
                if (this.index === 0) {
                    renderLeft = true;
                }
                if (this.index == (this.parent.cfg.getProperty('pages') - 1)) {
                    renderRight = true;
                }
            } else {
                renderLeft = true;
                renderRight = true;
            }
            if (renderLeft) {
                monthLabel = this._buildMonthLabel(Rui.util.LDate.subtract(pageDate, Rui.util.LDate.MONTH, 1));
                yearLabel = this._buildYearLabel(Rui.util.LDate.subtract(pageDate, Rui.util.LDate.YEAR, 1));
                var leftArrow = cfg.getProperty(DEF_CFG.NAV_ARROW_LEFT.key);
                if (leftArrow === null && LCalendar.IMG_ROOT !== null) {
                    leftArrow = LCalendar.IMG_ROOT + DEPR_NAV_LEFT;
                }
                var leftStyle = (leftArrow === null) ? '' : ' style="background-image:url(' + leftArrow + ')"';
                var navLeftHtml = '<a class="' + this.Style.CSS_NAV_YEAR_LEFT + '"' + leftStyle + ' href="#" id="' + this.id + '_calnavyearleft"'+(Rui.useAccessibility() ? "role=\"button\"" : "")+'>' + prevYearStr + ' (' + yearLabel + ')' + '</a>';
                navLeftHtml += '<a class="' + this.Style.CSS_NAV_LEFT + '"' + leftStyle + ' href="#" id="' + this.id + '_calnavleft"'+(Rui.useAccessibility() ? "role=\"button\"" : "")+'>' + prevStr + ' (' + monthLabel + ')' + '</a>';
                html[html.length] = navLeftHtml;
            }
            var lbl = this.buildMonthLabel();
            var cal = this.parent || this;
            if (cal.cfg.getProperty('navigator')) {
                lbl = '<a class=\"' + this.Style.CSS_NAV + '\" href=\"#\" id="' + this.id + '_calnav"'+(Rui.useAccessibility() ? 'role=\"heading\"' : '')+'>' + lbl + '</a>';
            }
            html[html.length] = lbl;
            if (renderRight) {
                monthLabel = this._buildMonthLabel(Rui.util.LDate.add(pageDate, Rui.util.LDate.MONTH, 1));
                yearLabel = this._buildYearLabel(Rui.util.LDate.add(pageDate, Rui.util.LDate.YEAR, 1));
                var rightArrow = cfg.getProperty(DEF_CFG.NAV_ARROW_RIGHT.key);
                if (rightArrow === null && LCalendar.IMG_ROOT !== null) {
                    rightArrow = LCalendar.IMG_ROOT + DEPR_NAV_RIGHT;
                }
                var rightStyle = (rightArrow === null) ? '' : ' style="background-image:url(' + rightArrow + ')"';
                var navRightHtml = '<a class="' + this.Style.CSS_NAV_RIGHT + '"' + rightStyle + ' href="#" id="' + this.id + '_calnavright"'+(Rui.useAccessibility() ? "role=\"button\"" : "")+'>' + nextStr + ' (' + monthLabel + ')' + '</a>';
                navRightHtml += '<a class="' + this.Style.CSS_NAV_YEAR_RIGHT + '"' + rightStyle + ' href="#" id="' + this.id + '_calnavryearight"'+(Rui.useAccessibility() ? "role=\"button\"" : "")+'>' + nextYearStr + ' (' + yearLabel + ')' + '</a>';
                html[html.length] = navRightHtml;
            }
            html[html.length] = '</div>\n</th>\n</tr>';
            if (cfg.getProperty(DEF_CFG.SHOW_WEEKDAYS.key)) {
                html = this.buildWeekdays(html);
            }
            html[html.length] = '</thead>';
            return html;
        },
        buildWeekdays: function(html) {
            html[html.length] = '<tr class="' + this.Style.CSS_WEEKDAY_ROW + '">';
            if (this.cfg.getProperty(DEF_CFG.SHOW_WEEK_HEADER.key)) {
                html[html.length] = '<th>&#160;</th>';
            }
            for (var i = 0; i < this.Locale.LOCALE_WEEKDAYS.length; ++i) {
                html[html.length] = '<th class="L-calweekdaycell">' + this.Locale.LOCALE_WEEKDAYS[i] + '</th>';
            }
            if (this.cfg.getProperty(DEF_CFG.SHOW_WEEK_FOOTER.key)) {
                html[html.length] = '<th>&#160;</th>';
            }
            html[html.length] = '</tr>';
            return html;
        },
        renderBody: function(workingDate, html) {
            var startDay = this.cfg.getProperty(DEF_CFG.START_WEEKDAY.key);
            this.preMonthDays = workingDate.getDay();
            if (startDay > 0) {
                this.preMonthDays -= startDay;
            }
            if (this.preMonthDays < 0) {
                this.preMonthDays += 7;
            }
            this.monthDays = Rui.util.LDate.getLastDayOfMonth(workingDate).getDate();
            this.postMonthDays = LCalendar.DISPLAY_DAYS - this.preMonthDays - this.monthDays;
            workingDate = Rui.util.LDate.subtract(workingDate, Rui.util.LDate.DAY, this.preMonthDays);
            var weekNum,
            weekClass,
            weekPrefix = 'w',
            cellPrefix = '_cell',
            workingDayPrefix = 'wd',
            dayPrefix = 'd',
            cellRenderers,
            renderer,
            t = this.today,
            cfg = this.cfg,
            todayYear = t.getFullYear(),
            todayMonth = t.getMonth(),
            todayDate = t.getDate(),
            useDate = cfg.getProperty(DEF_CFG.PAGEDATE.key),
            hideBlankWeeks = cfg.getProperty(DEF_CFG.HIDE_BLANK_WEEKS.key),
            showWeekFooter = cfg.getProperty(DEF_CFG.SHOW_WEEK_FOOTER.key),
            showWeekHeader = cfg.getProperty(DEF_CFG.SHOW_WEEK_HEADER.key),
            mindate = cfg.getProperty(DEF_CFG.MINDATE.key),
            maxdate = cfg.getProperty(DEF_CFG.MAXDATE.key);
            if (mindate) {
                mindate = Rui.util.LDate.clearTime(mindate);
            }
            if (maxdate) {
                maxdate = Rui.util.LDate.clearTime(maxdate);
            }
            html[html.length] = '<tbody class="m' + (useDate.getMonth() + 1) + ' ' + this.Style.CSS_BODY + '">';
            var i = 0,
            tempDiv = document.createElement('div'),
            cell = document.createElement('td');
            tempDiv.appendChild(cell);
            var cal = this.parent || this;
            for (var r = 0; r < 6; r++) {
                weekNum = Rui.util.LDate.getWeekNumber(workingDate, startDay);
                weekClass = weekPrefix + weekNum;
                if (r !== 0 && hideBlankWeeks === true && workingDate.getMonth() != useDate.getMonth()) {
                    break;
                } else {
                    html[html.length] = '<tr class="' + weekClass + '">';
                    if (showWeekHeader) { html = this.renderRowHeader(weekNum, html); }
                    for (var d = 0; d < 7; d++) { 
                        cellRenderers = [];
                        this.clearElement(cell);
                        cell.className = this.Style.CSS_CELL;
                        cell.id = this.id + cellPrefix + i;
                        if (workingDate.getDate() == todayDate &&
                        workingDate.getMonth() == todayMonth &&
                        workingDate.getFullYear() == todayYear) {
                            cellRenderers[cellRenderers.length] = cal.renderCellStyleToday;
                        }
                        var workingArray = [workingDate.getFullYear(), workingDate.getMonth() + 1, workingDate.getDate()];
                        this.cellDates[this.cellDates.length] = workingArray; 
                        if (workingDate.getMonth() != useDate.getMonth()) {
                            cellRenderers[cellRenderers.length] = cal.renderCellNotThisMonth;
                        } else {
                            Dom.addClass(cell, workingDayPrefix + workingDate.getDay());
                            Dom.addClass(cell, dayPrefix + workingDate.getDate());
                            for (var s = 0; s < this.renderStack.length; ++s) {
                                renderer = null;
                                var rArray = this.renderStack[s],
                                type = rArray[0],
                                month,
                                day,
                                year;
                                switch (type) {
                                    case LCalendar.DATE:
                                        month = rArray[1][1];
                                        day = rArray[1][2];
                                        year = rArray[1][0];
                                        if (workingDate.getMonth() + 1 == month && workingDate.getDate() == day && workingDate.getFullYear() == year) {
                                            renderer = rArray[2];
                                            this.renderStack.splice(s, 1);
                                        }
                                        break;
                                    case LCalendar.MONTH_DAY:
                                        month = rArray[1][0];
                                        day = rArray[1][1];
                                        if (workingDate.getMonth() + 1 == month && workingDate.getDate() == day) {
                                            renderer = rArray[2];
                                            this.renderStack.splice(s, 1);
                                        }
                                        break;
                                    case LCalendar.RANGE:
                                        var date1 = rArray[1][0],
                                        date2 = rArray[1][1],
                                        d1month = date1[1],
                                        d1day = date1[2],
                                        d1year = date1[0],
                                        d1 = Rui.util.LDate.getDate(d1year, d1month - 1, d1day),
                                        d2month = date2[1],
                                        d2day = date2[2],
                                        d2year = date2[0],
                                        d2 = Rui.util.LDate.getDate(d2year, d2month - 1, d2day);
                                        if (workingDate.getTime() >= d1.getTime() && workingDate.getTime() <= d2.getTime()) {
                                            renderer = rArray[2];
                                            if (workingDate.getTime() == d2.getTime()) {
                                                this.renderStack.splice(s, 1);
                                            }
                                        }
                                        break;
                                    case LCalendar.WEEKDAY:
                                        var weekday = rArray[1][0];
                                        if (workingDate.getDay() + 1 == weekday) {
                                            renderer = rArray[2];
                                        }
                                        break;
                                    case LCalendar.MONTH:
                                        month = rArray[1][0];
                                        if (workingDate.getMonth() + 1 == month) {
                                            renderer = rArray[2];
                                        }
                                        break;
                                }
                                if (renderer) {
                                    cellRenderers[cellRenderers.length] = renderer;
                                }
                            }
                        }
                        if (this._indexOfSelectedFieldArray(workingArray) > -1) {
                            cellRenderers[cellRenderers.length] = cal.renderCellStyleSelected;
                        }
                        if ((mindate && (workingDate.getTime() < mindate.getTime())) ||
                            (maxdate && (workingDate.getTime() > maxdate.getTime())) ) {
                            cellRenderers[cellRenderers.length] = cal.renderOutOfBoundsDate;
                        } else {
                            cellRenderers[cellRenderers.length] = cal.styleCellDefault;
                            cellRenderers[cellRenderers.length] = cal.renderCellDefault;
                        }
                        var eventParam = {date:workingDate, pageDate: useDate, cell: cell, stop: false};
                        this.renderCellEvent.fire(eventParam);
                        if(eventParam.stop !== true) {
                            for (var x = 0; x < cellRenderers.length; ++x) {
                                if (cellRenderers[x].call(cal, workingDate, cell) == LCalendar.STOP_RENDER) {
                                    break;
                                }
                            }
                        }
                        workingDate.setTime(workingDate.getTime() + Rui.util.LDate.ONE_DAY_MS);
                        workingDate = Rui.util.LDate.clearTime(workingDate);
                        if (i >= 0 && i <= 6) {
                            Dom.addClass(cell, this.Style.CSS_CELL_TOP);
                        }
                        if ((i % 7) === 0) {
                            Dom.addClass(cell, this.Style.CSS_CELL_LEFT);
                        }
                        if (((i + 1) % 7) === 0) {
                            Dom.addClass(cell, this.Style.CSS_CELL_RIGHT);
                        }
                        var postDays = this.postMonthDays;
                        if (hideBlankWeeks && postDays >= 7) {
                            var blankWeeks = Math.floor(postDays / 7);
                            for (var p = 0; p < blankWeeks; ++p) {
                                postDays -= 7;
                            }
                        }
                        if (i >= ((this.preMonthDays + postDays + this.monthDays) - 7)) {
                            Dom.addClass(cell, this.Style.CSS_CELL_BOTTOM);
                        }
                        if(Rui.useAccessibility()){
                            cell.setAttribute('role', 'gridcell');
                        }
                        html[html.length] = tempDiv.innerHTML;
                        i++;
                    }
                    if (showWeekFooter) { html = this.renderRowFooter(weekNum, html); }
                    html[html.length] = '</tr>';
                }
            }
            html[html.length] = '</tbody>';
            return html;
        },
        renderFooter: function(html) { return html; },
        render: function() {
            this.beforeRenderEvent.fire();
            var workingDate = Rui.util.LDate.getFirstDayOfMonth(this.cfg.getProperty(DEF_CFG.PAGEDATE.key));
            this.resetRenderers();
            this.cellDates.length = 0;
            Event.purgeElement(this.oDomContainer, true);
            var html = [];
            html[html.length] = '<table cellSpacing="0" class="' + this.Style.CSS_CALENDAR + ' y' + workingDate.getFullYear() + '" id="' + this.id + '-table" '+(Rui.useAccessibility() ? 'role="grid"' : '')+'>';
            html = this.renderHeader(html);
            html = this.renderBody(workingDate, html);
            html = this.renderFooter(html);
            html[html.length] = '</table>';
            this.oDomContainer.innerHTML = html.join('\n');
            this.applyListeners();
            this.cells = this.oDomContainer.getElementsByTagName('td');
            this.cfg.refireEvent(DEF_CFG.TITLE.key);
            this.cfg.refireEvent(DEF_CFG.CLOSE.key);
            this.cfg.refireEvent(DEF_CFG.IFRAME.key);
            this.renderEvent.fire();
        },
        applyListeners: function() {
            var root = this.oDomContainer,
            cal = this.parent || this,
            anchor = 'a',
            click = 'click';
            var linkLeft = Dom.getElementsByClassName(this.Style.CSS_NAV_LEFT, anchor, root),
            linkRight = Dom.getElementsByClassName(this.Style.CSS_NAV_RIGHT, anchor, root),
            yearLinkLeft = Dom.getElementsByClassName(this.Style.CSS_NAV_YEAR_LEFT, anchor, root),
            yearLinkRight = Dom.getElementsByClassName(this.Style.CSS_NAV_YEAR_RIGHT, anchor, root);
            if (linkLeft && linkLeft.length > 0) {
                this.linkLeft = linkLeft[0];
                Event.addListener(this.linkLeft, click, this.doPreviousMonthNav, cal, true);
            }
            if (linkRight && linkRight.length > 0) {
                this.linkRight = linkRight[0];
                Event.addListener(this.linkRight, click, this.doNextMonthNav, cal, true);
            }
            if (yearLinkLeft && yearLinkLeft.length > 0) {
                this.yearLinkLeft = yearLinkLeft[0];
                Event.addListener(this.yearLinkLeft, click, this.doPreviousYearNav, cal, true);
            }
            if (yearLinkRight && yearLinkRight.length > 0) {
                this.yearLinkRight = yearLinkRight[0];
                Event.addListener(this.yearLinkRight, click, this.doNextYearNav, cal, true);
            }
            if (cal.cfg.getProperty('navigator') !== null) {
                this.applyNavListeners();
            }
            if (this.domEventMap) {
                var el, elements;
                for (var cls in this.domEventMap) {
                    if (Lang.hasOwnProperty(this.domEventMap, cls)) {
                        var items = this.domEventMap[cls];
                        if (!(items instanceof Array)) {
                            items = [items];
                        }
                        for (var i = 0; i < items.length; i++) {
                            var item = items[i];
                            elements = Dom.getElementsByClassName(cls, item.tag, this.oDomContainer);
                            for (var c = 0; c < elements.length; c++) {
                                el = elements[c];
                                Event.addListener(el, item.event, item.handler, item.scope, item.correct);
                            }
                        }
                    }
                }
            }
            Event.addListener(this.oDomContainer, 'click', this.doSelectCell, this);
            Event.addListener(this.oDomContainer, 'mouseover', this.doCellMouseOver, this);
            Event.addListener(this.oDomContainer, 'mouseout', this.doCellMouseOut, this);
        },
        applyNavListeners: function() {
            var calParent = this.parent || this,
            cal = this,
            navBtns = Dom.getElementsByClassName(this.Style.CSS_NAV, 'a', this.oDomContainer);
            if (navBtns.length > 0) {
                Event.addListener(navBtns, 'click', function(e, obj) {
                    if(cal.beforeChangePageEvent.fire(this, e) == false) return;
                    var target = Event.getTarget(e);
                    if (this === target || Dom.isAncestor(this, target)) {
                        Event.preventDefault(e);
                    }
                    var navigator = calParent.oNavigator;
                    if (navigator) {
                        var pgdate = cal.cfg.getProperty('pagedate');
                        navigator.setYear(pgdate.getFullYear());
                        navigator.setMonth(pgdate.getMonth());
                        navigator.show();
                    }
                });
            }
        },
        getDateByCellId: function(id) {
            var date = this.getDateFieldsByCellId(id);
            return (date) ? Rui.util.LDate.getDate(date[0], date[1] - 1, date[2]) : null;
        },
        getDateFieldsByCellId: function(id) {
            id = this.getIndexFromId(id);
            return (id > -1) ? this.cellDates[id] : null;
        },
        getCellIndex: function(date) {
            var idx = -1;
            if (date) {
                var m = date.getMonth(),
                y = date.getFullYear(),
                d = date.getDate(),
                dates = this.cellDates;
                for (var i = 0; i < dates.length; ++i) {
                    var cellDate = dates[i];
                    if (cellDate[0] === y && cellDate[1] === m + 1 && cellDate[2] === d) {
                        idx = i;
                        break;
                    }
                }
            }
            return idx;
        },
        getIndexFromId: function(strId) {
            var idx = -1,
            li = strId.lastIndexOf('_cell');
            if (li > -1) {
                idx = parseInt(strId.substring(li + 5), 10);
            }
            return idx;
        },
        renderOutOfBoundsDate: function(workingDate, cell) {
            Dom.addClass(cell, this.Style.CSS_CELL_OOB);
            cell.innerHTML = workingDate.getDate();
            return LCalendar.STOP_RENDER;
        },
        renderRowHeader: function(weekNum, html) {
            html[html.length] = '<th class="L-calrowhead">' + weekNum + '</th>';
            return html;
        },
        renderRowFooter: function(weekNum, html) {
            html[html.length] = '<th class="L-calrowfoot">' + weekNum + '</th>';
            return html;
        },
        renderCellDefault: function(workingDate, cell) {
            cell.innerHTML = '<a href="#" class="' + this.Style.CSS_CELL_SELECTOR + '">' + this.buildDayLabel(workingDate) + "</a>";
        },
        styleCellDefault: function(workingDate, cell) {
            Dom.addClass(cell, this.Style.CSS_CELL_SELECTABLE);
        },
        renderCellStyleHighlight1: function(workingDate, cell) {
            Dom.addClass(cell, this.Style.CSS_CELL_HIGHLIGHT1);
        },
        renderCellStyleHighlight2: function(workingDate, cell) {
            Dom.addClass(cell, this.Style.CSS_CELL_HIGHLIGHT2);
        },
        renderCellStyleHighlight3: function(workingDate, cell) {
            Dom.addClass(cell, this.Style.CSS_CELL_HIGHLIGHT3);
        },
        renderCellStyleHighlight4: function(workingDate, cell) {
            Dom.addClass(cell, this.Style.CSS_CELL_HIGHLIGHT4);
        },
        renderCellStyleToday: function(workingDate, cell) {
            Dom.addClass(cell, this.Style.CSS_CELL_TODAY);
        },
        renderCellStyleSelected: function(workingDate, cell) {
            Dom.addClass(cell, this.Style.CSS_CELL_SELECTED);
            if(Rui.useAccessibility())
                cell.setAttribute('aria-selected', 'true');
        },
        renderCellNotThisMonth: function(workingDate, cell) {
            Dom.addClass(cell, this.Style.CSS_CELL_OOM);
            cell.innerHTML = workingDate.getDate();
            return LCalendar.STOP_RENDER;
        },
        renderBodyCellRestricted: function(workingDate, cell) {
            Dom.addClass(cell, this.Style.CSS_CELL);
            Dom.addClass(cell, this.Style.CSS_CELL_RESTRICTED);
            cell.innerHTML = workingDate.getDate();
            return LCalendar.STOP_RENDER;
        },
        addMonths: function(count) {
            var cfgPageDate = DEF_CFG.PAGEDATE.key;
            this.cfg.setProperty(cfgPageDate, Rui.util.LDate.add(this.cfg.getProperty(cfgPageDate), Rui.util.LDate.MONTH, count));
            this.resetRenderers();
            this.changePageEvent.fire();
        },
        subtractMonths: function(count) {
            var cfgPageDate = DEF_CFG.PAGEDATE.key;
            this.cfg.setProperty(cfgPageDate, Rui.util.LDate.subtract(this.cfg.getProperty(cfgPageDate), Rui.util.LDate.MONTH, count));
            this.resetRenderers();
            this.changePageEvent.fire();
        },
        addYears: function(count) {
            var cfgPageDate = DEF_CFG.PAGEDATE.key;
            this.cfg.setProperty(cfgPageDate, Rui.util.LDate.add(this.cfg.getProperty(cfgPageDate), Rui.util.LDate.YEAR, count));
            this.resetRenderers();
            this.changePageEvent.fire();
        },
        subtractYears: function(count) {
            var cfgPageDate = DEF_CFG.PAGEDATE.key;
            this.cfg.setProperty(cfgPageDate, Rui.util.LDate.subtract(this.cfg.getProperty(cfgPageDate), Rui.util.LDate.YEAR, count));
            this.resetRenderers();
            this.changePageEvent.fire();
        },
        nextMonth: function() {
            this.addMonths(1);
        },
        previousMonth: function() {
            this.subtractMonths(1);
        },
        nextYear: function() {
            this.addYears(1);
        },
        previousYear: function() {
            this.subtractYears(1);
        },
        reset: function() {
            this.cfg.resetProperty(DEF_CFG.SELECTED.key);
            this.cfg.resetProperty(DEF_CFG.PAGEDATE.key);
            this.resetEvent.fire();
        },
        clear: function() {
            this.cfg.setProperty(DEF_CFG.SELECTED.key, []);
            this.cfg.setProperty(DEF_CFG.PAGEDATE.key, new Date(this.today.getTime()));
            this.clearEvent.fire();
        },
        select: function(date,fireEvent) {
            fireEvent = fireEvent == null ? true : fireEvent;
            var aToBeSelected = this._toFieldArray(date),
            validDates = [],
            selected = [],
            cfgSelected = DEF_CFG.SELECTED.key;
            for (var a = 0; a < aToBeSelected.length; ++a) {
                var toSelect = aToBeSelected[a];
                var date = this._toDate(toSelect);
                if (!this.isDateOOB(date)) {
                    if (validDates.length === 0) {
                        if(fireEvent)
                            this.beforeSelectEvent.fire();
                        selected = this.cfg.getProperty(cfgSelected);
                    }
                    validDates.push(date);
                    if (this._indexOfSelectedFieldArray(toSelect) == -1) {
                        selected[selected.length] = toSelect;
                    }
                }
            }
            if (validDates.length > 0) {
                if (this.parent) {
                    this.parent.cfg.setProperty(cfgSelected, selected);
                } else {
                    this.cfg.setProperty(cfgSelected, selected);
                }
                if(fireEvent)
                    this.selectEvent.fire({
                        target: this,
                        date: this.MULTI_SELECT ? validDates : validDates[0]
                    });
            }
            return this.getSelectedDates();
        },
        selectCell: function(cellIndex) {
            var cell = this.cells[cellIndex],
            cellDate = this.cellDates[cellIndex],
            dCellDate = this._toDate(cellDate),
            selectable = Dom.hasClass(cell, this.Style.CSS_CELL_SELECTABLE);
            if (selectable) {
                this.beforeSelectEvent.fire();
                var cfgSelected = DEF_CFG.SELECTED.key;
                var selected = this.cfg.getProperty(cfgSelected);
                var selectDate = cellDate.concat();
                if (this._indexOfSelectedFieldArray(selectDate) == -1) {
                    selected[selected.length] = selectDate;
                }
                if (this.parent) {
                    this.parent.cfg.setProperty(cfgSelected, selected);
                } else {
                    this.cfg.setProperty(cfgSelected, selected);
                }
                this.renderCellStyleSelected(dCellDate, cell);
                var date = this.toDate(selectDate);
                this.selectEvent.fire({target: this, date: this.MULTI_SELECT ? [date] : date});
                this.doCellMouseOut.call(cell, null, this);
            }
            return this.getSelectedDates();
        },
        deselect: function(date) {
            var aToBeDeselected = this._toFieldArray(date),
            validDates = [],
            selected = [],
            cfgSelected = DEF_CFG.SELECTED.key;
            for (var a = 0; a < aToBeDeselected.length; ++a) {
                var toDeselect = aToBeDeselected[a];
                var date = this._toDate(toDeselect);
                if (!this.isDateOOB(date)) {
                    if (validDates.length === 0) {
                        this.beforeDeselectEvent.fire();
                        selected = this.cfg.getProperty(cfgSelected);
                    }
                    validDates.push(date);
                    var index = this._indexOfSelectedFieldArray(toDeselect);
                    if (index != -1) {
                        selected.splice(index, 1);
                    }
                }
            }
            if (validDates.length > 0) {
                if (this.parent) {
                    this.parent.cfg.setProperty(cfgSelected, selected);
                } else {
                    this.cfg.setProperty(cfgSelected, selected);
                }
                this.deselectEvent.fire({target: this, date: this.MULTI_SELECT ? validDates:validDates[0]});
            }
            return this.getSelectedDates();
        },
        deselectCell: function(cellIndex) {
            var cell = this.cells[cellIndex],
            cellDate = this.cellDates[cellIndex],
            cellDateIndex = this._indexOfSelectedFieldArray(cellDate);
            var selectable = Dom.hasClass(cell, this.Style.CSS_CELL_SELECTABLE);
            if (selectable) {
                this.beforeDeselectEvent.fire();
                var selected = this.cfg.getProperty(DEF_CFG.SELECTED.key),
                dCellDate = this._toDate(cellDate),
                selectDate = cellDate.concat();
                if (cellDateIndex > -1) {
                    if (this.cfg.getProperty(DEF_CFG.PAGEDATE.key).getMonth() == dCellDate.getMonth() &&
                    this.cfg.getProperty(DEF_CFG.PAGEDATE.key).getFullYear() == dCellDate.getFullYear()) {
                        Dom.removeClass(cell, this.Style.CSS_CELL_SELECTED);
                        if(Rui.useAccessibility())
                            cell.removeAttribute('aria-selected');
                    }
                    selected.splice(cellDateIndex, 1);
                }
                if (this.parent) {
                    this.parent.cfg.setProperty(DEF_CFG.SELECTED.key, selected);
                } else {
                    this.cfg.setProperty(DEF_CFG.SELECTED.key, selected);
                }
                var date = this.toDate(selectDate);
                this.deselectEvent.fire({
                    target: this,
                    date: this.MULTI_SELECT ? [date]:date
                });
            }
            return this.getSelectedDates();
        },
        deselectAll: function() {
            this.beforeDeselectEvent.fire();
            var cfgSelected = DEF_CFG.SELECTED.key,
            selected = this.cfg.getProperty(cfgSelected),
            count = selected.length,
            sel = selected.concat();
            if (this.parent) {
                this.parent.cfg.setProperty(cfgSelected, []);
            } else {
                this.cfg.setProperty(cfgSelected, []);
            }
            var dateList = [];
            for (var i = 0 ; i < sel.length ; i++)
                dateList.push(this.toDate(sel[i]));
            if (count > 0) {
                this.deselectEvent.fire({target: this, date: this.MULTI_SELECT ? dateList: dateList[0]});
            }
            return this.getSelectedDates();
        },
        _toFieldArray: function(date) {
            var returnDate = [];
            if (date instanceof Date) {
                returnDate = [[date.getFullYear(), date.getMonth() + 1, date.getDate()]];
            } else if (Rui.isString(date)) {
                returnDate = this._parseDates(date);
            } else if (Lang.isArray(date)) {
                for (var i = 0; i < date.length; ++i) {
                    var d = date[i];
                    returnDate[returnDate.length] = [d.getFullYear(), d.getMonth() + 1, d.getDate()];
                }
            }
            return returnDate;
        },
        toDate: function(dateFieldArray) {
            return this._toDate(dateFieldArray);
        },
        _toDate: function(dateFieldArray) {
            if (dateFieldArray instanceof Date) {
                return dateFieldArray;
            } else {
                return Rui.util.LDate.getDate(dateFieldArray[0], dateFieldArray[1] - 1, dateFieldArray[2]);
            }
        },
        _fieldArraysAreEqual: function(array1, array2) {
            var match = false;
            if (array1[0] == array2[0] && array1[1] == array2[1] && array1[2] == array2[2]) {
                match = true;
            }
            return match;
        },
        _indexOfSelectedFieldArray: function(find) {
            var selected = -1,
            seldates = this.cfg.getProperty(DEF_CFG.SELECTED.key);
            for (var s = 0; s < seldates.length; ++s) {
                var sArray = seldates[s];
                if (find[0] == sArray[0] && find[1] == sArray[1] && find[2] == sArray[2]) {
                    selected = s;
                    break;
                }
            }
            return selected;
        },
        isDateOOM: function(date) {
            return (date.getMonth() != this.cfg.getProperty(DEF_CFG.PAGEDATE.key).getMonth());
        },
        isDateOOB: function(date) {
            var minDate = this.cfg.getProperty(DEF_CFG.MINDATE.key),
            maxDate = this.cfg.getProperty(DEF_CFG.MAXDATE.key),
            dm = Rui.util.LDate;
            if (minDate) {
                minDate = dm.clearTime(minDate);
            }
            if (maxDate) {
                maxDate = dm.clearTime(maxDate);
            }
            var clearedDate = new Date(date.getTime());
            clearedDate = dm.clearTime(clearedDate);
            return ((minDate && clearedDate.getTime() < minDate.getTime()) || (maxDate && clearedDate.getTime() > maxDate.getTime()));
        },
        _parsePageDate: function(date) {
            var parsedDate;
            if (date) {
                if (date instanceof Date) {
                    parsedDate = Rui.util.LDate.getFirstDayOfMonth(date);
                } else {
                    var month, year, aMonthYear;
                    aMonthYear = date.split(this.cfg.getProperty(DEF_CFG.DATE_FIELD_DELIMITER.key));
                    month = parseInt(aMonthYear[this.cfg.getProperty(DEF_CFG.MY_MONTH_POSITION.key) - 1], 10) - 1;
                    year = parseInt(aMonthYear[this.cfg.getProperty(DEF_CFG.MY_YEAR_POSITION.key) - 1], 10);
                    parsedDate = Rui.util.LDate.getDate(year, month, 1);
                }
            } else {
                parsedDate = Rui.util.LDate.getDate(this.today.getFullYear(), this.today.getMonth(), 1);
            }
            return parsedDate;
        },
        onBeforeSelect: function() {
            if (this.cfg.getProperty(DEF_CFG.MULTI_SELECT.key) === false) {
                if (this.parent) {
                    this.parent.callChildFunction('clearAllBodyCellStyles', this.Style.CSS_CELL_SELECTED);
                    this.parent.deselectAll();
                } else {
                    this.clearAllBodyCellStyles(this.Style.CSS_CELL_SELECTED);
                    this.deselectAll();
                }
            }
        },
        onSelect: function(selected) {},
        onBeforeDeselect: function() { },
        onDeselect: function(deselected) { },
        onChangePage: function() {
            this.render();
        },
        onRender: function() { },
        onReset: function() { this.render(); },
        onClear: function() { this.render(); },
        validate: function() { return true; },
        _parseDate: function(sDate) {
            var aDate = sDate.split(this.Locale.DATE_FIELD_DELIMITER),
            rArray;
            if (aDate.length == 2) {
                rArray = [aDate[this.Locale.MD_MONTH_POSITION - 1], aDate[this.Locale.MD_DAY_POSITION - 1]];
                rArray.type = LCalendar.MONTH_DAY;
            } else {
                rArray = [aDate[this.Locale.MDY_YEAR_POSITION - 1], aDate[this.Locale.MDY_MONTH_POSITION - 1], aDate[this.Locale.MDY_DAY_POSITION - 1]];
                rArray.type = LCalendar.DATE;
            }
            for (var i = 0; i < rArray.length; i++) {
                rArray[i] = parseInt(rArray[i], 10);
            }
            return rArray;
        },
        _parseDates: function(sDates) {
            var aReturn = [],
            aDates = sDates.split(this.Locale.DATE_DELIMITER);
            for (var d = 0; d < aDates.length; ++d) {
                var sDate = aDates[d];
                if (sDate.indexOf(this.Locale.DATE_RANGE_DELIMITER) != -1) {
                    var aRange = sDate.split(this.Locale.DATE_RANGE_DELIMITER),
                    dateStart = this._parseDate(aRange[0]),
                    dateEnd = this._parseDate(aRange[1]),
                    fullRange = this._parseRange(dateStart, dateEnd);
                    aReturn = aReturn.concat(fullRange);
                } else {
                    var aDate = this._parseDate(sDate);
                    aReturn.push(aDate);
                }
            }
            return aReturn;
        },
        _parseRange: function(startDate, endDate) {
            var dCurrent = Rui.util.LDate.add(Rui.util.LDate.getDate(startDate[0], startDate[1] - 1, startDate[2]), Rui.util.LDate.DAY, 1),
            dEnd = Rui.util.LDate.getDate(endDate[0], endDate[1] - 1, endDate[2]),
            results = [];
            results.push(startDate);
            while (dCurrent.getTime() <= dEnd.getTime()) {
                results.push([dCurrent.getFullYear(), dCurrent.getMonth() + 1, dCurrent.getDate()]);
                dCurrent = Rui.util.LDate.add(dCurrent, Rui.util.LDate.DAY, 1);
            }
            return results;
        },
        resetRenderers: function() {
            this.renderStack = this._renderStack.concat();
        },
        removeRenderers: function() {
            this._renderStack = [];
            this.renderStack = [];
        },
        clearElement: function(cell) {
            cell.innerHTML = '&#160;';
            cell.className = '';
        },
        addRenderer: function(sDates, fnRender) {
            var aDates = this._parseDates(sDates);
            for (var i = 0; i < aDates.length; ++i) {
                var aDate = aDates[i];
                if (aDate.length == 2) { 
                    if (aDate[0] instanceof Array) { 
                        this._addRenderer(LCalendar.RANGE, aDate, fnRender);
                    } else { 
                        this._addRenderer(LCalendar.MONTH_DAY, aDate, fnRender);
                    }
                } else if (aDate.length == 3) {
                    this._addRenderer(LCalendar.DATE, aDate, fnRender);
                }
            }
        },
        _addRenderer: function(type, aDates, fnRender) {
            var add = [type, aDates, fnRender];
            this.renderStack.unshift(add);
            this._renderStack = this.renderStack.concat();
        },
        addMonthRenderer: function(month, fnRender) {
            this._addRenderer(LCalendar.MONTH, [month], fnRender);
        },
        addWeekdayRenderer: function(weekday, fnRender) {
            this._addRenderer(LCalendar.WEEKDAY, [weekday], fnRender);
        },
        clearAllBodyCellStyles: function(style) {
            for (var c = 0; c < this.cells.length; ++c) {
                Dom.removeClass(this.cells[c], style);
                if(Rui.useAccessibility()){
                    if(style == this.Style.CSS_CELL_SELECTED)
                        this.cells[c].removeAttribute('aria-selected');
                }
            }
        },
        setMonth: function(month) {
            var cfgPageDate = DEF_CFG.PAGEDATE.key,
            current = this.cfg.getProperty(cfgPageDate);
            current.setMonth(parseInt(month, 10));
            this.cfg.setProperty(cfgPageDate, current);
        },
        setYear: function(year) {
            var cfgPageDate = DEF_CFG.PAGEDATE.key,
            current = this.cfg.getProperty(cfgPageDate);
            current.setFullYear(parseInt(year, 10));
            this.cfg.setProperty(cfgPageDate, current);
        },
        getSelectedDates: function() {
            var returnDates = [],
            selected = this.cfg.getProperty(DEF_CFG.SELECTED.key);
            for (var d = 0; d < selected.length; ++d) {
                var dateArray = selected[d];
                var date = Rui.util.LDate.getDate(dateArray[0], dateArray[1] - 1, dateArray[2]);
                returnDates.push(date);
            }
            returnDates.sort(function(a, b) { return a - b; });
            return returnDates;
        },
        hide: function() {
            if (this.beforeHideEvent.fire()) {
                if(Rui.useAccessibility())
                    this.oDomContainer.setAttribute('aria-hidden', 'true');
                this.oDomContainer.style.display = 'none';
                this.hideEvent.fire();
            }
        },
        show: function() {
            if (this.beforeShowEvent.fire()) {
                this.oDomContainer.style.display = 'block';
                if(Rui.useAccessibility())
                    this.oDomContainer.setAttribute('aria-hidden', 'false');
                if(!this.isSyncIframeSize){
                    this._syncIframeSize();
                }
                this.showEvent.fire();
            }
        },
        _syncIframeSize : function(){
            if(this.iframe && this.oDomContainer){
                var containerEl = Rui.get(this.oDomContainer);                                
                this.iframe.style.width = containerEl.getWidth() + 'px';
                this.iframe.style.height = containerEl.getHeight() + 'px';
                this.isSyncIframeSize = true;
            }   
        },
        browser: (function() {
            var ua = navigator.userAgent.toLowerCase();
            if (ua.indexOf('opera') != -1) { 
                return 'opera';
            } else if (ua.indexOf('msie 7') != -1) { 
                return 'ie7';
            } else if (ua.indexOf('msie') != -1) { 
                return 'ie';
            } else if (ua.indexOf('safari') != -1) { 
                return 'safari';
            } else if (ua.indexOf('gecko') != -1) { 
                return 'gecko';
            } else {
                return false;
            }
        })(),
        toString: function() {
            return 'LCalendar ' + this.id;
        },
        destroy: function() {
            if (this.beforeDestroyEvent.fire()) {
                var cal = this;
                if (cal.navigator) {
                    cal.navigator.destroy();
                }
                if (cal.cfg) {
                    cal.cfg.destroy();
                }
                Event.purgeElement(cal.oDomContainer, true);
                Dom.removeClass(cal.oDomContainer, 'withtitle');
                Dom.removeClass(cal.oDomContainer, cal.Style.CSS_CONTAINER);
                Dom.removeClass(cal.oDomContainer, cal.Style.CSS_SINGLE);
                cal.oDomContainer.innerHTML = '';
                if(cal.oDomContainer.parentNode){
                    cal.oDomContainer.parentNode.removeChild(cal.oDomContainer);
                }
                cal.oDomContainer = null;
                cal.cells = null;
                this.destroyEvent.fire();
            }
        },
        on: function(p_type, p_fn, p_obj, p_override) {
            var ce = this[p_type + 'Event'];
            if(!ce) return;
            ce.on(p_fn, p_obj || this, Rui.isUndefined(p_override) ? true : p_override);
        }
    };
    Rui.ui.calendar.LCalendar = LCalendar;
})();
(function() {
    var Dom = Rui.util.LDom,
        LDateMath = Rui.util.LDate,
        Event = Rui.util.LEvent,
        LCalendar = Rui.ui.calendar.LCalendar;
    function LCalendarGroup(id, containerId, config) {
        if(arguments.length == 1 && (typeof id == 'object')) {
            config = id;
            id = containerId = (id.applyTo || id.renderTo) || Rui.id();
        }
        config = Rui.applyIf(config, Rui.getConfig().getFirst('$.ext.calendarGroup.defaultProperties'));
        if (arguments.length > 0) {
            this.init.call(this, id, containerId, config);
        }
        if(config) {
            if(config.applyTo){
                this.render();
            }else if(config.renderTo){
                this.render();
            }
        }
    }
    LCalendarGroup._DEFAULT_CONFIG = LCalendar._DEFAULT_CONFIG;
    LCalendarGroup._DEFAULT_CONFIG.PAGES = { key: 'pages', value: 2 };
    var DEF_CFG = LCalendarGroup._DEFAULT_CONFIG;
    LCalendarGroup.prototype = {
    	today: null,
        init: function(id, container, config) {
            var nArgs = this._parseArgs(arguments);
            id = nArgs.id;
            container = nArgs.container;
            config = nArgs.config;
            this.oDomContainer = Dom.get(container);
            if (!this.oDomContainer.id) {
                this.oDomContainer.id = Dom.generateId();
            }
            if (!id) {
                id = this.oDomContainer.id + '_t';
            }
            this.id = id;
            this.containerId = this.oDomContainer.id;
            this.initEvents();
            this.initStyles();
            this.pages = [];
            Dom.addClass(this.oDomContainer, LCalendarGroup.CSS_CONTAINER);
            Dom.addClass(this.oDomContainer, LCalendarGroup.CSS_MULTI_UP);
            Dom.addClass(this.oDomContainer, 'L-fixed');
            this.cfg = new Rui.ui.LConfig(this);
            this.Options = {};
            this.Locale = {};
            if(!this.today && config && config.today) this.today = config.today;
            this.setupConfig();
            if (config) {
                this.cfg.applyConfig(config, true);
            }
            this.cfg.fireQueue();
            if (Rui.browser.opera) {
                this.renderEvent.on(this._fixWidth, this, true);
                this.showEvent.on(this._fixWidth, this, true);
            }
        },
        setupConfig: function() {
            var cfg = this.cfg;
            cfg.addProperty(DEF_CFG.PAGES.key, { value: DEF_CFG.PAGES.value, validator: cfg.checkNumber, handler: this.configPages });
            cfg.addProperty(DEF_CFG.PAGEDATE.key, { value: new Date(), handler: this.configPageDate });
            cfg.addProperty(DEF_CFG.SELECTED.key, { value: [], handler: this.configSelected });
            cfg.addProperty(DEF_CFG.TITLE.key, { value: DEF_CFG.TITLE.value, handler: this.configTitle });
            cfg.addProperty(DEF_CFG.CLOSE.key, { value: DEF_CFG.CLOSE.value, handler: this.configClose });
            cfg.addProperty(DEF_CFG.IFRAME.key, { value: DEF_CFG.IFRAME.value, handler: this.configIframe, validator: cfg.checkBoolean });
            cfg.addProperty(DEF_CFG.MINDATE.key, { value: DEF_CFG.MINDATE.value, handler: this.delegateConfig });
            cfg.addProperty(DEF_CFG.MAXDATE.key, { value: DEF_CFG.MAXDATE.value, handler: this.delegateConfig });
            cfg.addProperty(DEF_CFG.MULTI_SELECT.key, { value: DEF_CFG.MULTI_SELECT.value, handler: this.delegateConfig, validator: cfg.checkBoolean });
            cfg.addProperty(DEF_CFG.START_WEEKDAY.key, { value: DEF_CFG.START_WEEKDAY.value, handler: this.delegateConfig, validator: cfg.checkNumber });
            cfg.addProperty(DEF_CFG.SHOW_WEEKDAYS.key, { value: DEF_CFG.SHOW_WEEKDAYS.value, handler: this.delegateConfig, validator: cfg.checkBoolean });
            cfg.addProperty(DEF_CFG.SHOW_WEEK_HEADER.key, { value: DEF_CFG.SHOW_WEEK_HEADER.value, handler: this.delegateConfig, validator: cfg.checkBoolean });
            cfg.addProperty(DEF_CFG.SHOW_WEEK_FOOTER.key, { value: DEF_CFG.SHOW_WEEK_FOOTER.value, handler: this.delegateConfig, validator: cfg.checkBoolean });
            cfg.addProperty(DEF_CFG.HIDE_BLANK_WEEKS.key, { value: DEF_CFG.HIDE_BLANK_WEEKS.value, handler: this.delegateConfig, validator: cfg.checkBoolean });
            cfg.addProperty(DEF_CFG.NAV_ARROW_LEFT.key, { value: DEF_CFG.NAV_ARROW_LEFT.value, handler: this.delegateConfig });
            cfg.addProperty(DEF_CFG.NAV_ARROW_RIGHT.key, { value: DEF_CFG.NAV_ARROW_RIGHT.value, handler: this.delegateConfig });
            cfg.addProperty(DEF_CFG.MONTHS_SHORT.key, { value: DEF_CFG.MONTHS_SHORT.value, handler: this.delegateConfig });
            cfg.addProperty(DEF_CFG.MONTHS_LONG.key, { value: DEF_CFG.MONTHS_LONG.value, handler: this.delegateConfig });
            cfg.addProperty(DEF_CFG.WEEKDAYS_1CHAR.key, { value: DEF_CFG.WEEKDAYS_1CHAR.value, handler: this.delegateConfig });
            cfg.addProperty(DEF_CFG.WEEKDAYS_SHORT.key, { value: DEF_CFG.WEEKDAYS_SHORT.value, handler: this.delegateConfig });
            cfg.addProperty(DEF_CFG.WEEKDAYS_MEDIUM.key, { value: DEF_CFG.WEEKDAYS_MEDIUM.value, handler: this.delegateConfig });
            cfg.addProperty(DEF_CFG.WEEKDAYS_LONG.key, { value: DEF_CFG.WEEKDAYS_LONG.value, handler: this.delegateConfig });
            cfg.addProperty(DEF_CFG.LOCALE_MONTHS.key, { value: DEF_CFG.LOCALE_MONTHS.value, handler: this.delegateConfig });
            cfg.addProperty(DEF_CFG.LOCALE_WEEKDAYS.key, { value: DEF_CFG.LOCALE_WEEKDAYS.value, handler: this.delegateConfig });
            cfg.addProperty(DEF_CFG.DATE_DELIMITER.key, { value: DEF_CFG.DATE_DELIMITER.value, handler: this.delegateConfig });
            cfg.addProperty(DEF_CFG.DATE_FIELD_DELIMITER.key, { value: DEF_CFG.DATE_FIELD_DELIMITER.value, handler: this.delegateConfig });
            cfg.addProperty(DEF_CFG.DATE_RANGE_DELIMITER.key, { value: DEF_CFG.DATE_RANGE_DELIMITER.value, handler: this.delegateConfig });
            cfg.addProperty(DEF_CFG.MY_MONTH_POSITION.key, { value: DEF_CFG.MY_MONTH_POSITION.value, handler: this.delegateConfig, validator: cfg.checkNumber });
            cfg.addProperty(DEF_CFG.MY_YEAR_POSITION.key, { value: DEF_CFG.MY_YEAR_POSITION.value, handler: this.delegateConfig, validator: cfg.checkNumber });
            cfg.addProperty(DEF_CFG.MD_MONTH_POSITION.key, { value: DEF_CFG.MD_MONTH_POSITION.value, handler: this.delegateConfig, validator: cfg.checkNumber });
            cfg.addProperty(DEF_CFG.MD_DAY_POSITION.key, { value: DEF_CFG.MD_DAY_POSITION.value, handler: this.delegateConfig, validator: cfg.checkNumber });
            cfg.addProperty(DEF_CFG.MDY_MONTH_POSITION.key, { value: DEF_CFG.MDY_MONTH_POSITION.value, handler: this.delegateConfig, validator: cfg.checkNumber });
            cfg.addProperty(DEF_CFG.MDY_DAY_POSITION.key, { value: DEF_CFG.MDY_DAY_POSITION.value, handler: this.delegateConfig, validator: cfg.checkNumber });
            cfg.addProperty(DEF_CFG.MDY_YEAR_POSITION.key, { value: DEF_CFG.MDY_YEAR_POSITION.value, handler: this.delegateConfig, validator: cfg.checkNumber });
            cfg.addProperty(DEF_CFG.MY_LABEL_MONTH_POSITION.key, { value: DEF_CFG.MY_LABEL_MONTH_POSITION.value, handler: this.delegateConfig, validator: cfg.checkNumber });
            cfg.addProperty(DEF_CFG.MY_LABEL_YEAR_POSITION.key, { value: DEF_CFG.MY_LABEL_YEAR_POSITION.value, handler: this.delegateConfig, validator: cfg.checkNumber });
            cfg.addProperty(DEF_CFG.MY_LABEL_MONTH_SUFFIX.key, { value: DEF_CFG.MY_LABEL_MONTH_SUFFIX.value, handler: this.delegateConfig });
            cfg.addProperty(DEF_CFG.MY_LABEL_YEAR_SUFFIX.key, { value: DEF_CFG.MY_LABEL_YEAR_SUFFIX.value, handler: this.delegateConfig });
            cfg.addProperty(DEF_CFG.NAV.key, { value: DEF_CFG.NAV.value, handler: this.configNavigator });
            cfg.addProperty(DEF_CFG.STRINGS.key, {
                value: DEF_CFG.STRINGS.value,
                handler: this.configStrings,
                validator: function(val) {
                    return Rui.isObject(val);
                },
                supercedes: DEF_CFG.STRINGS.supercedes
            });
        },
        initEvents: function() {
            var me = this,
            strEvent = 'Event',
            CE = Rui.util.LCustomEvent;
            var sub = function(fn, obj, bOverride) {
                for (var p = 0; p < me.pages.length; ++p) {
                    var cal = me.pages[p];
                    cal[this.type + strEvent].on(fn, obj, bOverride);
                }
            };
            var unsub = function(fn, obj) {
                for (var p = 0; p < me.pages.length; ++p) {
                    var cal = me.pages[p];
                    cal[this.type + strEvent].unOn(fn, obj);
                }
            };
            var defEvents = LCalendar._EVENT_TYPES;
            me.beforeSelectEvent = new CE(defEvents.BEFORE_SELECT);
            me.beforeSelectEvent.on = sub; me.beforeSelectEvent.unOn = unsub;
            me.selectEvent = new CE(defEvents.SELECT);
            me.selectEvent.on = sub; me.selectEvent.unOn = unsub;
            me.beforeDeselectEvent = new CE(defEvents.BEFORE_DESELECT);
            me.beforeDeselectEvent.on = sub; me.beforeDeselectEvent.unOn = unsub;
            me.deselectEvent = new CE(defEvents.DESELECT);
            me.deselectEvent.on = sub; me.deselectEvent.unOn = unsub;
            me.beforeChangePageEvent = new CE(defEvents.BEFORE_CHANGE_PAGE);
            me.beforeChangePageEvent.on = sub; me.beforeChangePageEvent.unOn = unsub;
            me.changePageEvent = new CE(defEvents.CHANGE_PAGE);
            me.changePageEvent.on = sub; me.changePageEvent.unOn = unsub;
            me.beforeRenderEvent = new CE(defEvents.BEFORE_RENDER);
            me.beforeRenderEvent.on = sub; me.beforeRenderEvent.unOn = unsub;
            me.renderEvent = new CE(defEvents.RENDER);
            me.renderEvent.on = sub; me.renderEvent.unOn = unsub;
            me.resetEvent = new CE(defEvents.RESET);
            me.resetEvent.on = sub; me.resetEvent.unOn = unsub;
            me.clearEvent = new CE(defEvents.CLEAR);
            me.clearEvent.on = sub; me.clearEvent.unOn = unsub;
            me.beforeShowEvent = new CE(defEvents.BEFORE_SHOW);
            me.showEvent = new CE(defEvents.SHOW);
            me.beforeHideEvent = new CE(defEvents.BEFORE_HIDE);
            me.hideEvent = new CE(defEvents.HIDE);
            me.beforeShowNavEvent = new CE(defEvents.BEFORE_SHOW_NAV);
            me.showNavEvent = new CE(defEvents.SHOW_NAV);
            me.beforeHideNavEvent = new CE(defEvents.BEFORE_HIDE_NAV);
            me.hideNavEvent = new CE(defEvents.HIDE_NAV);
            me.beforeRenderNavEvent = new CE(defEvents.BEFORE_RENDER_NAV);
            me.renderNavEvent = new CE(defEvents.RENDER_NAV);
            me.beforeDestroyEvent = new CE(defEvents.BEFORE_DESTROY);
            me.destroyEvent = new CE(defEvents.DESTROY);
        },
        configPages: function(type, args, obj) {
            var pageCount = args[0],
            cfgPageDate = DEF_CFG.PAGEDATE.key,
            sep = '_',
            caldate,
            firstPageDate = null,
            groupCalClass = 'groupcal',
            firstClass = 'first-of-type',
            lastClass = 'last-of-type';
            for (var p = 0; p < pageCount; ++p) {
                var calId = this.id + sep + p,
                calContainerId = this.containerId + sep + p,
                childConfig = this.cfg.getConfig();
                childConfig.close = false;
                childConfig.title = false;
                childConfig.navigator = null;
                if (p > 0) {
                    caldate = new Date(firstPageDate);
                    this._setMonthOnDate(caldate, caldate.getMonth() + p);
                    childConfig.pageDate = caldate;
                }
                var cal = this.constructChild(calId, calContainerId, childConfig);
                Dom.removeClass(cal.oDomContainer, this.Style.CSS_SINGLE);
                Dom.addClass(cal.oDomContainer, groupCalClass);
                if (p === 0) {
                    firstPageDate = cal.cfg.getProperty(cfgPageDate);
                    Dom.addClass(cal.oDomContainer, firstClass);
                }
                if (p == (pageCount - 1)) {
                    Dom.addClass(cal.oDomContainer, lastClass);
                }
                cal.parent = this;
                cal.index = p;
                this.pages[this.pages.length] = cal;
            }
        },
        configPageDate: function(type, args, obj) {
            var val = args[0],
            firstPageDate;
            var cfgPageDate = DEF_CFG.PAGEDATE.key;
            for (var p = 0; p < this.pages.length; ++p) {
                var cal = this.pages[p];
                if (p === 0) {
                    firstPageDate = cal._parsePageDate(val);
                    cal.cfg.setProperty(cfgPageDate, firstPageDate);
                } else {
                    var pageDate = new Date(firstPageDate);
                    this._setMonthOnDate(pageDate, pageDate.getMonth() + p);
                    cal.cfg.setProperty(cfgPageDate, pageDate);
                }
            }
        },
        configSelected: function(type, args, obj) {
            var cfgSelected = DEF_CFG.SELECTED.key;
            this.delegateConfig(type, args, obj);
            var selected = (this.pages.length > 0) ? this.pages[0].cfg.getProperty(cfgSelected) : [];
            this.cfg.setProperty(cfgSelected, selected, true);
        },
        delegateConfig: function(type, args, obj) {
            var val = args[0];
            var cal;
            for (var p = 0; p < this.pages.length; p++) {
                cal = this.pages[p];
                cal.cfg.setProperty(type, val);
            }
        },
        setProperty : function(key,value){
            this.cfg.setProperty(key,value);
        },
        setChildFunction: function(fnName, fn) {
            var pageCount = this.cfg.getProperty(DEF_CFG.PAGES.key);
            for (var p = 0; p < pageCount; ++p) {
                this.pages[p][fnName] = fn;
            }
        },
        callChildFunction: function(fnName, args) {
            var pageCount = this.cfg.getProperty(DEF_CFG.PAGES.key);
            for (var p = 0; p < pageCount; ++p) {
                var page = this.pages[p];
                if (page[fnName]) {
                    var fn = page[fnName];
                    fn.call(page, args);
                }
            }
        },
        constructChild: function(id, containerId, config) {
            var container = document.getElementById(containerId);
            if (!container) {
                container = document.createElement('div');
                container.id = containerId;
                this.oDomContainer.appendChild(container);
            }
            if(this.today) config.today = this.today;
            return new LCalendar(id, containerId, config);
        },
        setMonth: function(month) {
            month = parseInt(month, 10);
            var currYear;
            var cfgPageDate = DEF_CFG.PAGEDATE.key;
            for (var p = 0; p < this.pages.length; ++p) {
                var cal = this.pages[p];
                var pageDate = cal.cfg.getProperty(cfgPageDate);
                if (p === 0) {
                    currYear = pageDate.getFullYear();
                } else {
                    pageDate.setFullYear(currYear);
                }
                this._setMonthOnDate(pageDate, month + p);
                cal.cfg.setProperty(cfgPageDate, pageDate);
            }
        },
        setYear: function(year) {
            var cfgPageDate = DEF_CFG.PAGEDATE.key;
            year = parseInt(year, 10);
            for (var p = 0; p < this.pages.length; ++p) {
                var cal = this.pages[p];
                var pageDate = cal.cfg.getProperty(cfgPageDate);
                if ((pageDate.getMonth() + 1) == 1 && p > 0) {
                    year += 1;
                }
                cal.setYear(year);
            }
        },
        render: function() {
            this.renderHeader();
            for (var p = 0; p < this.pages.length; ++p) {
                var cal = this.pages[p];
                cal.render();
            }
            this.renderFooter();
        },
        select: function(date) {
            for (var p = 0; p < this.pages.length; ++p) {
                var cal = this.pages[p];
                cal.select(date);
            }
            return this.getSelectedDates();
        },
        selectCell: function(cellIndex) {
            for (var p = 0; p < this.pages.length; ++p) {
                var cal = this.pages[p];
                cal.selectCell(cellIndex);
            }
            return this.getSelectedDates();
        },
        deselect: function(date) {
            for (var p = 0; p < this.pages.length; ++p) {
                var cal = this.pages[p];
                cal.deselect(date);
            }
            return this.getSelectedDates();
        },
        deselectAll: function() {
            for (var p = 0; p < this.pages.length; ++p) {
                var cal = this.pages[p];
                cal.deselectAll();
            }
            return this.getSelectedDates();
        },
        deselectCell: function(cellIndex) {
            for (var p = 0; p < this.pages.length; ++p) {
                var cal = this.pages[p];
                cal.deselectCell(cellIndex);
            }
            return this.getSelectedDates();
        },
        reset: function() {
            for (var p = 0; p < this.pages.length; ++p) {
                var cal = this.pages[p];
                cal.reset();
            }
        },
        clear: function() {
            for (var p = 0; p < this.pages.length; ++p) {
                var cal = this.pages[p];
                cal.clear();
            }
            this.cfg.setProperty(DEF_CFG.SELECTED.key, []);
            this.cfg.setProperty(DEF_CFG.PAGEDATE.key, new Date(this.pages[0].today.getTime()));
            this.render();
        },
        nextMonth: function() {
            for (var p = 0; p < this.pages.length; ++p) {
                var cal = this.pages[p];
                cal.nextMonth();
            }
        },
        previousMonth: function() {
            for (var p = this.pages.length - 1; p >= 0; --p) {
                var cal = this.pages[p];
                cal.previousMonth();
            }
        },
        nextYear: function() {
            for (var p = 0; p < this.pages.length; ++p) {
                var cal = this.pages[p];
                cal.nextYear();
            }
        },
        previousYear: function() {
            for (var p = 0; p < this.pages.length; ++p) {
                var cal = this.pages[p];
                cal.previousYear();
            }
        },
        getSelectedDates: function() {
            var returnDates = [];
            var selected = this.cfg.getProperty(DEF_CFG.SELECTED.key);
            for (var d = 0; d < selected.length; ++d) {
                var dateArray = selected[d];
                var date = LDateMath.getDate(dateArray[0], dateArray[1] - 1, dateArray[2]);
                returnDates.push(date);
            }
            returnDates.sort(function(a, b) { return a - b; });
            return returnDates;
        },
        addRenderer: function(sDates, fnRender) {
            for (var p = 0; p < this.pages.length; ++p) {
                var cal = this.pages[p];
                cal.addRenderer(sDates, fnRender);
            }
        },
        addMonthRenderer: function(month, fnRender) {
            for (var p = 0; p < this.pages.length; ++p) {
                var cal = this.pages[p];
                cal.addMonthRenderer(month, fnRender);
            }
        },
        addWeekdayRenderer: function(weekday, fnRender) {
            for (var p = 0; p < this.pages.length; ++p) {
                var cal = this.pages[p];
                cal.addWeekdayRenderer(weekday, fnRender);
            }
        },
        removeRenderers: function() {
            this.callChildFunction('removeRenderers');
        },
        renderHeader: function() {
        },
        renderFooter: function() {
        },
        addMonths: function(count) {
            this.callChildFunction('addMonths', count);
        },
        subtractMonths: function(count) {
            this.callChildFunction('subtractMonths', count);
        },
        addYears: function(count) {
            this.callChildFunction('addYears', count);
        },
        subtractYears: function(count) {
            this.callChildFunction('subtractYears', count);
        },
        getCalendarPage: function(date) {
            var cal = null;
            if (date) {
                var y = date.getFullYear(),
                m = date.getMonth();
                var pages = this.pages;
                for (var i = 0; i < pages.length; ++i) {
                    var pageDate = pages[i].cfg.getProperty('pagedate');
                    if (pageDate.getFullYear() === y && pageDate.getMonth() === m) {
                        cal = pages[i];
                        break;
                    }
                }
            }
            return cal;
        },
        _setMonthOnDate: function(date, iMonth) {
            if (Rui.browser.webkit && Rui.browser.webkit < 420 && (iMonth < 0 || iMonth > 11)) {
                var newDate = LDateMath.add(date, LDateMath.MONTH, iMonth - date.getMonth());
                date.setTime(newDate.getTime());
            } else {
                date.setMonth(iMonth);
            }
        },
        _fixWidth: function() {
            var w = 0;
            for (var p = 0; p < this.pages.length; ++p) {
                var cal = this.pages[p];
                w += cal.oDomContainer.offsetWidth;
            }
            if (w > 0) {
                this.oDomContainer.style.width = w + 'px';
            }
        },
        toString: function() {
            return 'LCalendarGroup ' + this.id;
        },
        destroy: function() {
            if (this.beforeDestroyEvent.fire()) {
                var cal = this;
                if (cal.navigator) {
                    cal.navigator.destroy();
                }
                if (cal.cfg) {
                    cal.cfg.destroy();
                }
                Event.purgeElement(cal.oDomContainer, true);
                Dom.removeClass(cal.oDomContainer, LCalendarGroup.CSS_CONTAINER);
                Dom.removeClass(cal.oDomContainer, LCalendarGroup.CSS_MULTI_UP);
                for (var i = 0, l = cal.pages.length; i < l; i++) {
                    cal.pages[i].destroy();
                    cal.pages[i] = null;
                }
                cal.oDomContainer.innerHTML = '';
                cal.oDomContainer = null;
                this.destroyEvent.fire();
            }
        }
    };
    LCalendarGroup.CSS_CONTAINER = 'L-calcontainer';
    LCalendarGroup.CSS_MULTI_UP = 'L-multi';
    LCalendarGroup.CSS_2UPTITLE = 'L-title';
    LCalendarGroup.CSS_2UPCLOSE = 'close-icon';
    Rui.applyPrototype(LCalendarGroup, LCalendar, 'buildDayLabel',
         'buildMonthLabel',
         'renderOutOfBoundsDate',
         'renderRowHeader',
         'renderRowFooter',
         'renderCellDefault',
         'styleCellDefault',
         'renderCellStyleHighlight1',
         'renderCellStyleHighlight2',
         'renderCellStyleHighlight3',
         'renderCellStyleHighlight4',
         'renderCellStyleToday',
         'renderCellStyleSelected',
         'renderCellNotThisMonth',
         'renderBodyCellRestricted',
         'initStyles',
         'configTitle',
         'configClose',
         'configIframe',
         'configStrings',
         'configNavigator',
         'createTitleBar',
         'createCloseButton',
         'removeTitleBar',
         'removeCloseButton',
         'hide',
         'show',
         'toDate',
         '_toDate',
         '_parseArgs',
         'browser'
     );
    Rui.ui.calendar.LCalendarGroup = LCalendarGroup;
})();
Rui.ui.calendar.LCalendarNavigator = function(cal) {
    this.init(cal);
};
(function() {
    var CN = Rui.ui.calendar.LCalendarNavigator;
    CN.CLASSES = {
        NAV: 'L-cal-nav',
        NAV_VISIBLE: 'L-cal-nav-visible',
        MASK: 'L-cal-nav-mask',
        YEAR: 'L-cal-nav-y',
        MONTH: 'L-cal-nav-m',
        BUTTONS: 'L-cal-nav-b',
        BUTTON: 'L-cal-nav-btn',
        ERROR: 'L-cal-nav-e',
        YEAR_CTRL: 'L-cal-nav-yc',
        MONTH_CTRL: 'L-cal-nav-mc',
        INVALID: 'L-invalid',
        DEFAULT: 'L-default'
    };
    CN._DEFAULT_CFG = null;
    CN.ID_SUFFIX = '_nav';
    CN.MONTH_SUFFIX = '_month';
    CN.YEAR_SUFFIX = '_year';
    CN.ERROR_SUFFIX = '_error';
    CN.CANCEL_SUFFIX = '_cancel';
    CN.SUBMIT_SUFFIX = '_submit';
    CN.YR_MAX_DIGITS = 4;
    CN.YR_MINOR_INC = 1;
    CN.YR_MAJOR_INC = 10;
    CN.UPDATE_DELAY = 50;
    CN.YR_PATTERN = /^\d+$/;
    CN.TRIM = /^\s*(.*?)\s*$/;
})();
Rui.ui.calendar.LCalendarNavigator.prototype = {
    id: null,
    cal: null,
    navEl: null,
    maskEl: null,
    yearEl: null,
    monthEl: null,
    errorEl: null,
    submitEl: null,
    cancelEl: null,
    firstCtrl: null,
    lastCtrl: null,
    _doc: null,
    _year: null,
    _month: 0,
    __rendered: false,
    init: function(cal) {
        var calBox = cal.oDomContainer;
        this.cal = cal;
        this.id = calBox.id + Rui.ui.calendar.LCalendarNavigator.ID_SUFFIX;
        this._doc = calBox.ownerDocument;
        var ie = Rui.browser.msie;
        this.__isIEQuirks = (ie && ((ie <= 6) || (this._doc.compatMode == 'BackCompat')));
    },
    show: function() {
        var CLASSES = Rui.ui.calendar.LCalendarNavigator.CLASSES;
        if (this.cal.beforeShowNavEvent.fire()) {
            if (!this.__rendered) {
                this.render();
            }
            this.clearErrors();
            this._updateMonthUI();
            this._updateYearUI();
            this._show(this.monthComboEl, !Rui.isUndefined(Rui.ui.calendar.LMonthCalendar)?((this.cal instanceof Rui.ui.calendar.LMonthCalendar) ? false : true) : true );
            this._show(this.navEl, true);
            this.setInitialFocus();
            this.showMask();
            Rui.util.LDom.addClass(this.cal.oDomContainer, CLASSES.NAV_VISIBLE);
            this.cal.showNavEvent.fire();
        }
    },
    hide: function() {
        var CLASSES = Rui.ui.calendar.LCalendarNavigator.CLASSES;
        if (this.cal.beforeHideNavEvent.fire()) {
            this._show(this.navEl, false);
            this.hideMask();
            Rui.util.LDom.removeClass(this.cal.oDomContainer, CLASSES.NAV_VISIBLE);
            this.cal.hideNavEvent.fire();
        }
    },
    showMask: function() {
        this._show(this.maskEl, true);
        if (this.__isIEQuirks) {
            this._syncMask();
        }
    },
    hideMask: function() {
        this._show(this.maskEl, false);
    },
    getMonth: function() {
        return this._month;
    },
    getYear: function() {
        return this._year;
    },
    setMonth: function(nMonth) {
        if (nMonth >= 0 && nMonth < 12) {
            this._month = nMonth;
        }
        this._updateMonthUI();
    },
    setYear: function(nYear) {
        var yrPattern = Rui.ui.calendar.LCalendarNavigator.YR_PATTERN;
        if (Rui.isNumber(nYear) && yrPattern.test(nYear + '')) {
            this._year = nYear;
        }
        this._updateYearUI();
    },
    render: function() {
        this.cal.beforeRenderNavEvent.fire();
        if (!this.__rendered) {
            this.createNav();
            this.createMask();
            this.applyListeners();
            this.__rendered = true;
        }
        this.cal.renderNavEvent.fire();
    },
    createNav: function() {
        var NAV = Rui.ui.calendar.LCalendarNavigator;
        var doc = this._doc;
        var d = doc.createElement('div');
        d.className = NAV.CLASSES.NAV;
        var htmlBuf = this.renderNavContents([]);
        d.innerHTML = htmlBuf.join('');
        this.cal.oDomContainer.appendChild(d);
        this.navEl = d;
        this.monthComboEl = d.childNodes[0];
        this.yearEl = doc.getElementById(this.id + NAV.YEAR_SUFFIX);
        this.monthEl = doc.getElementById(this.id + NAV.MONTH_SUFFIX);
        this.errorEl = doc.getElementById(this.id + NAV.ERROR_SUFFIX);
        this.submitEl = doc.getElementById(this.id + NAV.SUBMIT_SUFFIX);
        this.cancelEl = doc.getElementById(this.id + NAV.CANCEL_SUFFIX);
        if (Rui.browser.gecko && this.yearEl && this.yearEl.type == 'text') {
            this.yearEl.setAttribute('autocomplete', 'off');
        }
        this._setFirstLastElements();
    },
    createMask: function() {
        var C = Rui.ui.calendar.LCalendarNavigator.CLASSES;
        var d = this._doc.createElement('div');
        d.className = C.MASK;
        this.cal.oDomContainer.appendChild(d);
        this.maskEl = d;
    },
    _syncMask: function() {
        var c = this.cal.oDomContainer;
        if (c && this.maskEl) {
            var r = Rui.util.LDom.getRegion(c);
            Rui.util.LDom.setStyle(this.maskEl, 'width', r.right - r.left + 'px');
            Rui.util.LDom.setStyle(this.maskEl, 'height', r.bottom - r.top + 'px');
        }
    },
    renderNavContents: function(html) {
        var NAV = Rui.ui.calendar.LCalendarNavigator,
            C = NAV.CLASSES,
            h = html; 
        h[h.length] = '<div class="' + C.MONTH + '">';
        this.renderMonth(h);
        h[h.length] = '</div>';
        h[h.length] = '<div class="' + C.YEAR + '">';
        this.renderYear(h);
        h[h.length] = '</div>';
        h[h.length] = '<div class="' + C.BUTTONS + '">';
        this.renderButtons(h);
        h[h.length] = '</div>';
        h[h.length] = '<div class="' + C.ERROR + '" id="' + this.id + NAV.ERROR_SUFFIX + '"></div>';
        return h;
    },
    renderMonth: function(html) {
        var NAV = Rui.ui.calendar.LCalendarNavigator,
            C = NAV.CLASSES;
        var id = this.id + NAV.MONTH_SUFFIX,
            mf = this.__getCfg('monthFormat'),
            months = this.cal.cfg.getProperty((mf == Rui.ui.calendar.LCalendar.SHORT) ? 'MONTHS_SHORT' : 'MONTHS_LONG'),
            h = html;
        if (months && months.length > 0) {
            h[h.length] = '<label for="' + id + '">';
            h[h.length] = this.__getCfg("month", true);
            h[h.length] = '</label>';
            h[h.length] = '<select name="' + id + '" id="' + id + '" class="' + C.MONTH_CTRL + '">';
            for (var i = 0; i < months.length; i++) {
                h[h.length] = '<option value="' + i + '">';
                h[h.length] = months[i];
                h[h.length] = '</option>';
            }
            h[h.length] = '</select>';
        }
        return h;
    },
    renderYear: function(html) {
        var NAV = Rui.ui.calendar.LCalendarNavigator,
            C = NAV.CLASSES;
        var id = this.id + NAV.YEAR_SUFFIX,
            size = NAV.YR_MAX_DIGITS,
            h = html;
        h[h.length] = '<label for="' + id + '">';
        h[h.length] = this.__getCfg('year', true);
        h[h.length] = '</label>';
        h[h.length] = '<input type="text" name="' + id + '" id="' + id + '" class="' + C.YEAR_CTRL + '" maxlength="' + size + '"/>';
        return h;
    },
    renderButtons: function(html) {
        var C = Rui.ui.calendar.LCalendarNavigator.CLASSES;
        var h = html;
        h[h.length] = '<span class="' + C.BUTTON + ' ' + C.DEFAULT + '">';
        h[h.length] = '<button type="button" id="' + this.id + '_submit' + '">';
        h[h.length] = this.__getCfg('submit', true);
        h[h.length] = '</button>';
        h[h.length] = '</span>';
        h[h.length] = '<span class="' + C.BUTTON + '">';
        h[h.length] = '<button type="button" id="' + this.id + '_cancel' + '">';
        h[h.length] = this.__getCfg('cancel', true);
        h[h.length] = '</button>';
        h[h.length] = '</span>';
        return h;
    },
    applyListeners: function() {
        var E = Rui.util.LEvent;
        function yearUpdateHandler() {
            if (this.validate()) {
                this.setYear(this._getYearFromUI());
            }
        }
        function monthUpdateHandler() {
            this.setMonth(this._getMonthFromUI());
        }
        E.on(this.submitEl, 'click', this.submit, this, true);
        E.on(this.cancelEl, 'click', this.cancel, this, true);
        E.on(this.yearEl, 'blur', yearUpdateHandler, this, true);
        E.on(this.monthEl, 'change', monthUpdateHandler, this, true);
        if (this.__isIEQuirks) {
            Rui.util.LEvent.on(this.cal.oDomContainer, 'resize', this._syncMask, this, true);
        }
        this.applyKeyListeners();
    },
    purgeListeners: function() {
        var E = Rui.util.LEvent;
        E.removeListener(this.submitEl, 'click', this.submit);
        E.removeListener(this.cancelEl, 'click', this.cancel);
        E.removeListener(this.yearEl, 'blur');
        E.removeListener(this.monthEl, 'change');
        if (this.__isIEQuirks) {
            E.removeListener(this.cal.oDomContainer, 'resize', this._syncMask);
        }
        this.purgeKeyListeners();
    },
    applyKeyListeners: function() {
        var E = Rui.util.LEvent,
            ua = Rui.browser;
        var arrowEvt = (ua.ie || ua.webkit) ? 'keydown' : 'keypress';
        var tabEvt = (ua.ie || ua.opera || ua.webkit) ? 'keydown' : 'keypress';
        E.on(this.yearEl, 'keypress', this._handleEnterKey, this, true);
        E.on(this.yearEl, arrowEvt, this._handleDirectionKeys, this, true);
        E.on(this.lastCtrl, tabEvt, this._handleTabKey, this, true);
        E.on(this.firstCtrl, tabEvt, this._handleShiftTabKey, this, true);
    },
    purgeKeyListeners: function() {
        var E = Rui.util.LEvent,
            ua = Rui.browser;
        var arrowEvt = (ua.ie || ua.webkit) ? 'keydown' : 'keypress';
        var tabEvt = (ua.ie || ua.opera || ua.webkit) ? 'keydown' : 'keypress';
        E.removeListener(this.yearEl, 'keypress', this._handleEnterKey);
        E.removeListener(this.yearEl, arrowEvt, this._handleDirectionKeys);
        E.removeListener(this.lastCtrl, tabEvt, this._handleTabKey);
        E.removeListener(this.firstCtrl, tabEvt, this._handleShiftTabKey);
    },
    submit: function() {
        if (this.validate()) {
            this.hide();
            this.setMonth(this._getMonthFromUI());
            this.setYear(this._getYearFromUI());
            var cal = this.cal;
            var delay = Rui.ui.calendar.LCalendarNavigator.UPDATE_DELAY;
            if (delay > 0) {
                var nav = this;
                window.setTimeout(function() { nav._update(cal); }, delay);
            } else {
                this._update(cal);
            }
        }
    },
    _update: function(cal) {
        cal.setYear(this.getYear());
        cal.setMonth(this.getMonth());
        cal.render();
    },
    cancel: function() {
        this.hide();
    },
    validate: function() {
        if (this._getYearFromUI() !== null) {
            this.clearErrors();
            return true;
        } else {
            this.setYearError();
            this.setError(this.__getCfg('invalidYear', true));
            return false;
        }
    },
    setError: function(msg) {
        if (this.errorEl) {
            this.errorEl.innerHTML = msg;
            this._show(this.errorEl, true);
        }
    },
    clearError: function() {
        if (this.errorEl) {
            this.errorEl.innerHTML = '';
            this._show(this.errorEl, false);
        }
    },
    setYearError: function() {
        Rui.util.LDom.addClass(this.yearEl, Rui.ui.calendar.LCalendarNavigator.CLASSES.INVALID);
    },
    clearYearError: function() {
        Rui.util.LDom.removeClass(this.yearEl, Rui.ui.calendar.LCalendarNavigator.CLASSES.INVALID);
    },
    clearErrors: function() {
        this.clearError();
        this.clearYearError();
    },
    setInitialFocus: function() {
        var el = this.submitEl,
            f = this.__getCfg('initialFocus');
        if (f && f.toLowerCase) {
            f = f.toLowerCase();
            if (f == 'year') {
                el = this.yearEl;
                try {
                    this.yearEl.select();
                } catch (selErr) {
                }
            } else if (f == 'month') {
                el = this.monthEl;
            }
        }
        if (el && Rui.isFunction(el.focus)) {
            try {
                el.focus();
            } catch (focusErr) {
            }
        }
    },
    erase: function() {
        if (this.__rendered) {
            this.purgeListeners();
            this.yearEl = null;
            this.monthEl = null;
            this.errorEl = null;
            this.submitEl = null;
            this.cancelEl = null;
            this.firstCtrl = null;
            this.lastCtrl = null;
            if (this.navEl) {
                this.navEl.innerHTML = '';
            }
            var p = this.navEl.parentNode;
            if (p) {
                p.removeChild(this.navEl);
            }
            this.navEl = null;
            var pm = this.maskEl.parentNode;
            if (pm) {
                pm.removeChild(this.maskEl);
            }
            this.maskEl = null;
            this.__rendered = false;
        }
    },
    destroy: function() {
        this.erase();
        this._doc = null;
        this.cal = null;
        this.id = null;
    },
    _show: function(el, bShow) {
        if (el) {
            Rui.util.LDom.setStyle(el, 'display', (bShow) ? 'block' : 'none');
        }
    },
    _getMonthFromUI: function() {
        if (this.monthEl) {
            return this.monthEl.selectedIndex;
        } else {
            return 0; 
        }
    },
    _getYearFromUI: function() {
        var NAV = Rui.ui.calendar.LCalendarNavigator;
        var yr = null;
        if (this.yearEl) {
            var value = this.yearEl.value;
            value = value.replace(NAV.TRIM, '$1');
            if (NAV.YR_PATTERN.test(value)) {
                yr = parseInt(value, 10);
            }
        }
        return yr;
    },
    _updateYearUI: function() {
        if (this.yearEl && this._year !== null) {
            this.yearEl.value = this._year;
        }
    },
    _updateMonthUI: function() {
        if (this.monthEl) {
            this.monthEl.selectedIndex = this._month;
        }
    },
    _setFirstLastElements: function() {
        this.firstCtrl = this.monthEl;
        this.lastCtrl = this.cancelEl;
        if (this.__isMac) {
            if (Rui.browser.webkit && Rui.browser.webkit < 420) {
                this.firstCtrl = this.monthEl;
                this.lastCtrl = this.yearEl;
            }
            if (Rui.browser.gecko) {
                this.firstCtrl = this.yearEl;
                this.lastCtrl = this.yearEl;
            }
        }
    },
    _handleEnterKey: function(e) {
        var KEYS = Rui.util.LKey.KEY;
        if (Rui.util.LEvent.getCharCode(e) == KEYS.ENTER) {
            Rui.util.LEvent.preventDefault(e);
            this.submit();
        }
    },
    _handleDirectionKeys: function(e) {
        var E = Rui.util.LEvent,
            KEYS = Rui.util.LKey.KEY,
            NAV = Rui.ui.calendar.LCalendarNavigator;
        var value = (this.yearEl.value) ? parseInt(this.yearEl.value, 10) : null;
        if (isFinite(value)) {
            var dir = false;
            switch (E.getCharCode(e)) {
                case KEYS.UP:
                    this.yearEl.value = value + NAV.YR_MINOR_INC;
                    dir = true;
                    break;
                case KEYS.DOWN:
                    this.yearEl.value = Math.max(value - NAV.YR_MINOR_INC, 0);
                    dir = true;
                    break;
                case KEYS.PAGE_UP:
                    this.yearEl.value = value + NAV.YR_MAJOR_INC;
                    dir = true;
                    break;
                case KEYS.PAGE_DOWN:
                    this.yearEl.value = Math.max(value - NAV.YR_MAJOR_INC, 0);
                    dir = true;
                    break;
                default:
                    break;
            }
            if (dir) {
                E.preventDefault(e);
                try {
                    this.yearEl.select();
                } catch (err) {
                }
            }
        }
    },
    _handleTabKey: function(e) {
        var E = Rui.util.LEvent,
            KEYS = Rui.util.LKey.KEY;
        if (E.getCharCode(e) == KEYS.TAB && !e.shiftKey) {
            try {
                E.preventDefault(e);
                this.firstCtrl.focus();
            } catch (err) {
            }
        }
    },
    _handleShiftTabKey: function(e) {
        var E = Rui.util.LEvent,
            KEYS = Rui.util.LKey.KEY;
        if (e.shiftKey && E.getCharCode(e) == KEYS.TAB) {
            try {
                E.preventDefault(e);
                this.lastCtrl.focus();
            } catch (err) {
            }
        }
    },
    getDefaultCfg: function() {
    	if(!Rui.ui.calendar.LCalendarNavigator._DEFAULT_CFG) {
    		var mm = Rui.getMessageManager(); 
    		Rui.ui.calendar.LCalendarNavigator._DEFAULT_CFG = {
		        strings: {
		            month: mm.get('$.core.calendarNavigatorLabelMonth'),
		            year: mm.get('$.core.calendarNavigatorLabelYear'),
		            submit: mm.get('$.base.msg044'),
		            cancel: mm.get('$.base.msg121'),
		            invalidYear: 'Year needs to be a number'
		        },
		        monthFormat: Rui.ui.calendar.LCalendar.LONG,
		        initialFocus: 'year'
		    };
    	}
    	return Rui.ui.calendar.LCalendarNavigator._DEFAULT_CFG;
    },
    __getCfg: function(prop, bIsStr) {
        var DEF_CFG = this.getDefaultCfg();
        var cfg = this.cal.cfg.getProperty('navigator');
        if (bIsStr) {
            return (cfg !== true && cfg.strings && cfg.strings[prop]) ? cfg.strings[prop] : DEF_CFG.strings[prop];
        } else {
            return (cfg !== true && cfg[prop]) ? cfg[prop] : DEF_CFG[prop];
        }
    },
    __isMac: (navigator.userAgent.toLowerCase().indexOf('macintosh') != -1)
};
Rui.namespace('Rui.ui.form');
Rui.ui.form.LForm = function(id, config){
    this.id = id;
    config = config || {};
    config = Rui.applyIf(config, Rui.getConfig().getFirst('$.ext.form.defaultProperties'));
    Rui.ui.form.LForm.superclass.constructor.call(this, config);
    this.validatorManager = null;
    Rui.applyObject(this, config, true);
    if(this.validatorManager == null && config.validators) {
       this.validatorManager = new Rui.validate.LValidatorManager({
            validators:config.validators
        });  
    }
    this.dm = new Rui.data.LDataSetManager(this.dataSetManagerOptions);
    this.dm.on('upload', this.onUpload, this, true);
    this.dm.on('success', this.onSuccess, this, true);
    this.dm.on('failure', this.onFailure, this, true);
    this.createEvent('beforesubmit');
    this.createEvent('invalid');
    this.createEvent('success');
    this.createEvent('failure');
    this.createEvent('reset');
};
Rui.extend(Rui.ui.form.LForm, Rui.ui.LUIComponent, {
    otype: 'Rui.ui.form.LForm',
    initComponent: function(config){
        var elList = Rui.select('form[name=' + this.id + ']');
        if(elList.length > 0)
            this.el = elList.getAt(0);
        else
            this.el = Rui.get(this.id);
    },
    setValidatorManager: function(validatorManager) {
        this.validatorManager = validatorManager;
    },
    submit: function() {
        if (this.fireEvent('beforesubmit', this) == false) return;
        if(this.validate()) {
            this.dm.updateForm({
                url: this.el.dom.action,
                form: this.id
            });
            return true;
        }
        return false;
    },
    onSuccess: function(e) {
        this.fireEvent('success', e);
    },
    onFailure: function(e) {
        this.fireEvent('failure', e);
    },
    onUpload: function(e) {
        this.fireEvent('success', e);
    },
    onReset: function() {
    },
    reset: function() {
        this.el.dom.reset();
        this.fireEvent('reset', { target: this });
    },
    validate: function() {
        if(this.validatorManager == null) return true;
        var isValid = this.validatorManager.validateGroup(this.id);
        if(isValid == false) {
            var invalidList = this.validatorManager.getInvalidList();
            this.fireEvent('invalid', {target:this, invalidList:invalidList, isValid:isValid});
        }
        return isValid;
    },
    clearInvalid: function() {
        var children = this._getChildList();
        var valid = true;
        Rui.util.LArray.each(children, function(f) {
            var child = Rui.get(f);
            child.valid();
        }, this);
    },
    enable: function(children) {
        children = Rui.isUndefined(children) ? this._getChildList() : children;
        Rui.util.LArray.each(children, function(f) {
            var child = Rui.get(f);
            if(child)
                child.enable();
        }, this);
    },
    disable: function(children) {
        children = Rui.isUndefined(children) ? this._getChildList() : children;
        Rui.util.LArray.each(children, function(f) {
            var child = Rui.get(f);
            if(child)
                child.disable();
        }, this);
    },
    isDisable: function(children) {
        var isDisable = false;
        children = Rui.isUndefined(children) ? this._getChildList() : children;
        Rui.util.LArray.each(children, function(f) {
            var child = Rui.get(f);
            if(child) {
                isDisable = child.isDisable();
                return;
            }
        }, this);
        return isDisable;
    },
    getValues: function() {
        var obj = {};
        var children = this._getChildList();
        Rui.util.LArray.each(children, function(child) {
            var f = Rui.get(child);
            var dom = f.dom;
            var name = dom.name || dom.id;
            var value = f.get('value');
            if(dom.type == 'checkbox' || dom.type == 'radio'){
                if(dom.checked === true)
                    obj[name] = value;
            }else{
                obj[name] = value;
            }
        }, this);
        return obj;
    },
    setValues: function(values) {
        var children = this._getChildList();
        Rui.util.LArray.each(children, function(child) {
            var el = Rui.get(child), 
                dom = el.dom,
                name = dom.name || dom.id,
                value = values[name];
            if(value){
                if(dom.type == 'radio' || dom.type == 'checkbox'){
                    dom.checked = (dom.value == value ? true : false);
                }else{
                    el.setValue(value);
                }
            }
        }, this);
    },
    findField: function(id) {
        var field = null;
        var children = this._getChildList();
        Rui.util.LArray.each(children, function(child) {
            var f = Rui.get(child);
            if(f.dom.id == id || f.dom.name == id) {
                field = f.dom;
                return false;
            }
        }, this);
        return field;
    },
    isValid: function() {
        var isValid = true;
        var children = this._getChildList();
        Rui.util.LArray.each(children, function(f) {
            var element = Rui.get(f);
            if(element.isValid() == false) {
                isValid = false;
                return false;
            }
        }, this);
        return isValid;
    },
    destroy: function(){
        this.unOnAll();
    },
    updateRecord: function(record) {
        var o = record.getValues();
        this.setValues(o);
    },
    loadRecord: function(record) {
        var o = this.getValues();
        record.setValues(o);
        return record;
    },
    _getChildList: function() {
        return Rui.util.LDomSelector.query('input,select,textarea', this.el.dom);
    }
});
(function() {
    var Ev = Rui.util.LEvent;
    Rui.ui.LActionMenuSupport = function(oConfig) {
    };
    Rui.ui.LActionMenuSupport = {
    	createActionMenu: function(gridPanel) {
    		if(gridPanel.useActionMenu == false) return;
    		var actionMenuGrid = new Rui.ui.grid.LActionMenuGrid({
    			gridPanel: gridPanel
    		});
        	gridPanel.el.on('touchstart', function(e){
            	if(e.touches && e.touches.length < 3) return;
            	this.showTabletViewer();
        	}, gridPanel, true);
    		gridPanel.on('cellMouseDown', actionMenuGrid.onCellMouseDown, actionMenuGrid, true, { system: true });
        	actionMenuGrid.el.setAttribute('data-menu-type', 'left');
        	gridPanel.on('cellclick', function(e) {
        		actionMenuGrid.setXY([Ev.getPageX(e.event), Ev.getPageY(e.event)]);
        	})
    		return actionMenuGrid;
    	}
    };
})();
(function() {
	var Ev = Rui.util.LEvent;
    Rui.ui.LActionMenu = function(oConfig) {
    	Rui.applyObject(this, oConfig, true);
    	this.createContainer();
    	this.gridPanel.on('cellClick', this.onCellClick, this, true);
    };
    Rui.ui.LActionMenu.prototype = {
    	createContainer: function() {
    		var master = new Rui.LTemplate(
    			'<div class="L-{cssBase} L-hide-display">',
    			'<ul>{menuList}</ul>',
    			'</div>'
    		);
    		var mm = Rui.getMessageManager();
    		var menuList = new Rui.LTemplate(
    			'<li class="L-action-menu-li L-menu-type-left L-hide-display L-mobile-menu"><span class="L-action-menu-item L-fn-on-dbl-click L-ignore-blur">{menuName}</span></li>',
    			'<li class="L-action-menu-li L-menu-type-left L-hide-display L-mobile-menu L-tablet-mode-{tabletMode}"><span class="L-action-menu-item L-fn-on-tablet-click L-ignore-blur">{tabletName}</span></li>',
    			'<li class="L-action-menu-li-hr L-menu-type-left L-hide-display L-mobile-menu"> </li>',
    			'<li class="L-action-menu-li L-menu-type-right"><span class="L-action-menu-item L-fn-on-sum-click L-ignore-blur">{sumName}</span></li>',
    			'<li class="L-action-menu-li-hr L-menu-type-left"> </li>',
    			'<li class="L-action-menu-li L-menu-type-right"><span class="L-action-menu-item L-fn-on-clipboard-copy L-ignore-blur">{clipboardCopy}</span></li>',
    			'<li class="L-action-menu-li-hr L-menu-type-left"> </li>',
    			'<li class="L-action-menu-li L-menu-type-right"><span class="L-action-menu-item L-fn-on-clipboard-paste L-ignore-blur">{clipboardPaste}</span></li>'
    		);
    		var menuListHtml = '';
    		menuListHtml += menuList.apply({ 
    			tabletMode: this.gridPanel.tabletMode,
    			menuName: 'Cell Double Click',
    			tabletName: 'Tablet Mode',
    			sumName: mm.get('$.base.msg139'),
    			clipboardCopy: mm.get('$.base.msg128'),
    			clipboardPaste: mm.get('$.base.msg129')
    		});
    		this.el = Rui.createElements(master.apply({ cssBase: this.CSS_BASE, menuList: menuListHtml })).getAt(0);
    		this.el.on('click', this.invokeClick, this, true);
    		Rui.util.LEvent.addListener(Rui.browser.msie ? document.body : document, 'mousedown', this.deferOnBlur, this, true);
    		Rui.getBody().appendChild(this.el);
    		if(Rui.platform.isMobile)
    			this.el.select('.L-mobile-menu').show();
    	},
    	deferOnBlur: function(e) {
            Rui.util.LFunction.defer(this.checkBlur, 10, this, [e]);
        },
        checkBlur:function(e) {
            if(e.deferCancelBubble == true || this.isFocus !== true) return;
            var target = e.target;
            if(!(this.gridPanel.el.isAncestor(target) || this.el.isAncestor(target)))
                this.hideActionMenu();         
        },
    	hideActionMenu: function(e) {
    		this.el.hide();
    	},
    	setXY: function(xy) {
    		xy[0] -= 70;
    		xy[1] -= 100;
    		this.el.setXY(xy);
    	},
    	onCellClick: function(e) {
    		if(!Rui.platform.isMobile) return;
    		this.el.setAttribute('data-menu-type', 'left');
    		var x = Ev.getPageX(e.event), y = Ev.getPageY(e.event);
    		this.el.show();
    		this.setXY([x, y]);
    	},
    	onCellMouseDown: function(e) {
            var gridPanel = this.gridPanel;
        	if((e.event.button === 2 || e.event.button === 3) && gridPanel.useRightActionMenu) {
        		this.el.setAttribute('data-menu-type', 'right');
        		this.el.show();
        		this.setXY([Ev.getPageX(e.event), Ev.getPageY(e.event)])
        	}
    	},
    	invokeClick: function(e) {
    		Rui.util.LDom.invokeFn(e.target, this, e);
    	},
    	onDblClick: function(e) {
    	},
    	onTabletClick: function(e) {
    		this.gridPanel.showTabletViewer();
    	}
    };
})();