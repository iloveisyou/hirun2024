/*
 * @(#) rui_form.js
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
Rui.namespace('Rui.ui.form');
Rui.ui.form.LField = function(config){
    Rui.ui.form.LField.superclass.constructor.call(this, config);
    this.createEvent('changed');
    this.createEvent('valid');
    this.createEvent('invalid');
    this.createEvent('specialkey');
};
Rui.extend(Rui.ui.form.LField, Rui.ui.LUIComponent, {
    otype: 'Rui.ui.form.LField',
    fieldObject: true,
    name: null,
    borderSize: 1,
    checkContainBlur: false,
    initDefaultConfig: function() {
        Rui.ui.form.LField.superclass.initDefaultConfig.call(this);
        this.cfg.addProperty('editable', {
            handler: this._setEditable,
            value: this.editable,
            validator: Rui.isBoolean
        });
        this.cfg.addProperty('defaultValue', {
            handler: this._setDefaultValue,
            value: this.value
        });
    },
    getContentWidth: function(){
        var w = this.el.getWidth(true);
        return w < 1 ? this.width - (this.borderSize * 2) : w;
    },
    getContentHeight: function(){
        var h = this.el.getHeight(true);
        return h < 1 ? this.height - (this.borderSize * 2) : h;
    },
    setValue: function(o) {
        this.el.setValue(o);
    },
    getValue: function() {
        return this.el.getValue();
    },
    valid: function(){
        this.el.valid();
        this.fireEvent('valid');
        return this;
    },
    invalid: function(message) {
        this.el.invalid(message);
        this.fireEvent('invalid', message);
        return this;
    },
    setName: function(name) {
        this.name = name;
    },
    getName: function() {
        return this.name;
    },
    setEditable: function(isEditable) {
        this.cfg.setProperty('editable', this.disabled === true ? false : isEditable);
    },
    _setEditable: function(type, args, obj) {
        this.editable = !!args[0];
    },
    _setDefaultValue: function(type, args, obj) {
    	this.setValue(args[0]);
    },
    onFireKey: function(e){
        if(Rui.util.LEvent.isSpecialKey(e))
            this.fireEvent('specialkey', e);
    },
    toString: function() {
        return (this.otype || 'Rui.ui.form.LField ') + ' ' + this.id;
    }
});
Rui.namespace('Rui.ui.form');
(function(){
var Dom = Rui.util.LDom;
var KL = Rui.util.LKey;
var ST = Rui.util.LString;
var Ev = Rui.util.LEvent;
Rui.ui.form.LTextBox = function(config){
    config = Rui.applyIf(config || {}, Rui.getConfig().getFirst('$.ext.textBox.defaultProperties'));
    var configDataSet = Rui.getConfig().getFirst('$.ext.textBox.dataSet');
    if(configDataSet){
        if(!config.displayField && configDataSet.displayField)
            config.displayField = configDataSet.displayField;
    }
    this.overflowCSS = Rui.browser.opera ? 'overflow' : 'overflowY';
    this.useDataSet = config.autoComplete === true ? true : this.useDataSet;
    if (this.useDataSet === true && config.dataSet) {
        this.dataSet = config.dataSet;
        this.initDataSet();
        this.isLoad = true;
    }
    this.mask = config.mask || this.mask || null;
    if(this.mask) this.initMask();
    Rui.ui.form.LTextBox.superclass.constructor.call(this, config);
    if(this.mask) this.initMaskEvent();
    if(Rui.mobile.ios) this.mask = null;
    if(this.useDataSet === true) {
        if(Rui.isEmpty(this.dataSet) && Rui.isEmpty(config.dataSet)) {
            this.createDataSet();
        }
    }
    if (this.useDataSet === true) {
        if(this.dataSet) this.initDataSet();
        if(config.url) {
            this.dataSet.load({ url: config.url, params: config.params });
        }
    }
};
Rui.ui.form.LTextBox.ROW_RE = new RegExp('L-row-r([^\\s]+)', '');
Rui.extend(Rui.ui.form.LTextBox, Rui.ui.form.LField, {
    otype: 'Rui.ui.form.LTextBox',
    CSS_BASE: 'L-textbox',
    CSS_PLACEHOLDER: 'L-placeholder',
    displayField: 'text',
    type: 'text',
    editable: true,
    width: 100,
    height: -1,
    defaultValue: '',
    listWidth: -1,
    dataSetClassName: 'Rui.data.LJsonDataSet',
    filterMode: 'local',
    localDelayTime: 30,
    remoteDelayTime: 250,
    filterUrl: '',
    useDataSet: false,
    autoComplete: false,
    selectedIndex: false,
    firstChangedEvent: true,
    dataSet: null,
    marginTop: 0,
    marginLeft: 0,
    includeChars: null,
    inputType: null,
    currFocus: false,
    imeMode: 'auto',
    emptyText: 'Choose a state',
    useEmptyText: false,
    emptyValue: '',
    mask: null,
    maskValue: false,
    definitions: {
        '9': '[0-9]',
        'a': '[A-Za-z]',
        '*': '[A-Za-z0-9]'
    },
    maskPlaceholder: '_',
    placeholder: null,
    invalidBlur: false,
    filterFn: null,
    optionDivEl: null,
    expandCount: 0,
    stringFromChatCode: false,
    listRenderer: null,
    dataSetId: null,
    listPosition: 'auto',
    rowRe: new RegExp('L-row-r([^\\s]+)', ''),
    ignoreEvent: true,
    initEvents: function() {
        Rui.ui.form.LTextBox.superclass.initEvents.call(this);
        this.createEvent('keydown');
        this.createEvent('keyup');
        this.createEvent('keypress');
        this.createEvent('cut');
        this.createEvent('copy');
        this.createEvent('paste');
        this.createEvent('expand');
        this.createEvent('collapse');
    },
    initDefaultConfig: function() {
        Rui.ui.form.LTextBox.superclass.initDefaultConfig.call(this);
        this.cfg.addProperty('listWidth', {
                handler: this._setListWidth,
                value: this.listWidth,
                validator: Rui.isNumber
        });
        this.cfg.addProperty('useEmptyText', {
                handler: this._setAddEmptyText,
                value: this.useEmptyText,
                validator: Rui.isBoolean
        });
    },
    createContainer: function(parentNode){
        if(this.el) {
            this.oldDom = this.el.dom;
            if(this.el.dom.tagName == 'INPUT') {
                this.id = this.id || this.el.id;
                this.name = this.name || this.oldDom.name;
                var parent = this.el.parent();
                this.el = Rui.get(this.createElement().cloneNode(false));
                this.el.dom.id = this.id;
                Dom.replaceChild(this.el.dom, this.oldDom);
                this.el.appendChild(this.oldDom);
                Dom.removeNode(this.oldDom);
            }
            this.attrs = this.attrs || {};
            var items = this.oldDom.attributes;
            if(typeof items !== 'undefined'){
                if(Rui.browser.msie67){
                    for (var i=0, len = items.length; i<len; i++){
                        var v = items[i].value;
                        if(v && v !== 'null' && v !== '')
                            this.attrs[items[i].name] = Rui.util.LObject.parseObject(v);
                    }
                }else
                    for (var i=0, len = items.length; i<len; i++)
                        this.attrs[items[i].name] = items[i].value;
            }
            delete this.attrs.id;
            delete this.oldDom;
        }
        Rui.ui.form.LTextBox.superclass.createContainer.call(this, parentNode);
    },
    doRender: function(){
        this.createTemplate(this.el);
        this.inputEl.dom.instance = this;
        this.inputEl.addClass('L-instance');
        if (Rui.useAccessibility()) this.el.setAttribute('role', 'textbox');
    },
    createTemplate: function(el) {
        var elContainer = Rui.get(el);
        elContainer.addClass(this.CSS_BASE);
        elContainer.addClass('L-fixed');
        elContainer.addClass('L-form-field');
        var attrs = '';
        for (var key in this.attrs)
            attrs += ' ' + key + '="' + this.attrs[key] + '"';
        var autoComplete = '';
        if(this.autoComplete) autoComplete = ' autocomplete="off"';
        var input = Rui.createElements('<input type="' + this.type + '" ' + attrs + autoComplete + '>').getAt(0).dom;
        input.id = Rui.useFixedId() ? Rui.id(this.el, 'LTextBox-' + this.id) : Rui.id();
        input.name = this.name || input.name || this.id;
        elContainer.appendChild(input);
        this.inputEl = Rui.get(input);
        this.inputEl.addClass('L-display-field');
        return elContainer;
    },
    afterRender: function(container){
        Rui.ui.form.LTextBox.superclass.afterRender.call(this, container);
        var inputEl = this.getDisplayEl();
        inputEl.on('click', function(e) {
            if(this.editable != true){
                this.expand();
            }
        }, this, true);
        if(this.inputType != null)
            inputEl.on('keydown', this.onFilterKey, this, true);
        if(this.inputType != ST.PATTERN_TYPE_KOREAN){
            if(this.includeChars != null)
                this.imeMode = 'disabled';
            if(this.inputType != null)
                this.imeMode = 'disabled';
        }
        if(this.imeMode !== 'auto') inputEl.setStyle('ime-mode', this.imeMode);
        if (this.useDataSet === true && this.autoComplete === true)
            inputEl.on('keyup', this.onKeyAutoComplete, this, true);
        if(Rui.browser.webkit || Rui.browser.msie || Rui.browser.chrome) inputEl.on('keydown', this.onSpecialkeyEvent, this, true);
        else inputEl.on('keypress', this.onSpecialkeyEvent, this, true);
        inputEl.on('keydown', this.onKeydown, this, true);
        inputEl.on('keyup', this.onKeyup, this, true);
        inputEl.on('keypress', this.onKeypress, this, true);
        var keyEventName = Rui.browser.msie || Rui.browser.chrome || (Rui.browser.safari && Rui.browser.version == 3) ? 'keydown' : 'keypress';
        inputEl.on(keyEventName, this.onFireKey, this, true);
        this.createOptionDiv();
        if (this.optionDivEl) {
            if(this.useDataSet === true && Rui.isEmpty(this.dataSet)) this.createDataSet();
            else this.doLoadDataSet();
        }
        this.initFocus();
        if(this.type != 'text') this.initType();
        this.focusDefaultValue();
        this.setPlaceholder();
    },
    createDataSet: function() {
        if(!this.dataSet) {
            this.dataSet = new (eval(this.dataSetClassName))({
                id: this.dataSetId || (this.id + 'DataSet'),
                fields:[
                    {id:this.displayField}
                ],
                focusFirstRow: false
            });
        }
    },
    initType: function() {
        if (this.type == 'url') {
            this.placeholder = 'http://';
            this.inputEl.on('focus', function(){
                if (this.inputEl.getValue() == '')
                    this.inputEl.setValue(this.placeholder);
            }, this, true);
        } else if(this.type == 'email') {
            this.placeholder = Rui.getMessageManager().get('$.base.msg111');
        }
    },
    initDataSet: function() {
        this.doSyncDataSet();
    },
    doSyncDataSet: function() {
        if(this.isBindEvent !== true) {
            this.dataSet.on('beforeLoad', this.onBeforeLoadDataSet, this, true, { system: true } );
            this.dataSet.on('load', this.onLoadDataSet, this, true, { system: true } );
            this.dataSet.on('dataChanged', this.onDataChangedDataSet, this, true, { system: true } );
            this.dataSet.on('rowPosChanged', this.onRowPosChangedDataSet, this, true, { system: true } );
            this.dataSet.on('add', this.onAddData, this, true, { system: true } );
            this.dataSet.on('update', this.onUpdateData, this, true, { system: true } );
            this.dataSet.on('remove', this.onRemoveData, this, true, { system: true } );
            this.dataSet.on('undo', this.onUndoData, this, true, { system: true } );
            this.isBindEvent = true;
        }
    },
    doUnSyncDataSet: function(){
        this.dataSet.unOn('beforeLoad', this.onBeforeLoadDataSet, this);
        this.dataSet.unOn('load', this.onLoadDataSet, this);
        this.dataSet.unOn('dataChanged', this.onDataChangedDataSet, this);
        this.dataSet.unOn('rowPosChanged', this.onRowPosChangedDataSet, this);
        this.dataSet.unOn('add', this.onAddData, this);
        this.dataSet.unOn('update', this.onUpdateData, this);
        this.dataSet.unOn('remove', this.onRemoveData, this);
        this.dataSet.unOn('undo', this.onUndoData, this);
        this.isBindEvent = false;
    },
    initFocus: function() {
        var inputEl = this.getDisplayEl();
        if(inputEl) {
            inputEl.on('focus', this.onCheckFocus, this, true);
            inputEl.on('blur', this.checkBlur, this, true);
        }
    },
    setPlaceholder: function() {
        if(this.placeholder) {
            var displayEl = this.getDisplayEl();
            if(Rui.browser.msie6789 ){
                var value = displayEl.getValue();
                if(this.isFocus && this.editable === true){
                    if (this.placeholder && value === this.placeholder) {
                        displayEl.setValue('');
                    }
                    displayEl.removeClass(this.CSS_PLACEHOLDER);
                }else{
                    if((!value || value.length < 1) || (value === this.placeholder)){
                        displayEl.setValue(this.placeholder);
                        displayEl.addClass(this.CSS_PLACEHOLDER);
                    }else if(this.placeholder !== value){
                        displayEl.removeClass(this.CSS_PLACEHOLDER);
                    }
                }
            }else{
                this.getDisplayEl().dom.placeholder = this.placeholder;
            }
        }
    },
    onFilterKey: function(e){
            if(this.inputType == null){ return; }
         var KEY = KL.KEY;
         if(e.keyCode != KEY.SPACE && (Ev.isSpecialKey(e) || e.keyCode == KEY.BACK_SPACE || e.keyCode == KEY.DELETE)) {return;}
         var c = e.charCode || e.which || e.keyCode;
         if(c == 229 && ((this.inputType == ST.PATTERN_TYPE_STRING || this.inputType == ST.PATTERN_TYPE_NUMSTRING ))){Ev.preventDefault(e); return;} 
         var charCode = (this.stringFromChatCode === false) ? this.fromCharCode(c) : String.fromCharCode(c);
         var pattern = this.inputType;
         if(this.includeChars == null){
            if(this.inputType == ST.PATTERN_TYPE_KOREAN){
                if(!ST.isHangul(charCode)){ Ev.preventDefault(e); return;}
             } else if(!pattern.test(charCode) ){ Ev.preventDefault(e); return;}
         }
         if( this.ctrlKeypress && (c == 65 || c == 67 || c== 86 || c == 88)){return;}
    },
    fromCharCode: function(c) {
        if(c >= 96 && c <= 105) c -= 48;
        var charCode = String.fromCharCode(c);
        switch(c) {
            case 105:
                break;
            case 106:
                charCode = '*';
                break;
            case 107:
                charCode = '+';
                break;
            case 109:
                charCode = '-';
                break;
            case 110:
            case 190:
                charCode = '.';
                break;
            case 111:
                charCode = '/';
                break;
            case 188:
                charCode = ',';
                break;
            case 191:
                charCode = '/';
                break;
        }
        return charCode;
    },
    onFocus: function(e) {
        Rui.ui.form.LTextBox.superclass.onFocus.call(this, e);
        this.lastValue = this.getValue();
        this.lastDisplayValue = this.getDisplayValue();
        this.setPlaceholder();
        this.currFocus = true;
        this.doFocus(e);
    },
    doFocus: function(e){
    	return;
    	if(Rui.platform.isMobile) return;
        var byteLength = ST.getByteLength(this.getDisplayEl().dom.value);
        if(byteLength > 0){
            if(Rui.browser.webkit)
                Rui.later(85, this, function(){
                    this.setSelectionRange(0, byteLength);
                });
            else
                this.setSelectionRange(0, byteLength);
        }
    },
    setSelectionRange: function(start, end) {
        if(this.currFocus) Dom.setSelectionRange(this.getDisplayEl().dom, start, end);
    },
    checkBlur: function(e) {
        if(!this.isFocus) return;
        if(this.gridPanel && e.deferCancelBubble == true) return;
        var target = e.target;
        if(this.iconEl && this.iconEl.dom == target) return;
        if(this.el.dom === target) return;
        var isBlur = false;
        if(Rui.isUndefined(this.optionDivEl)) {
            if(!this.el.isAncestor(target)) {
            	isBlur = true;
            }
        } else {
            if(this.el.isAncestor(target) == false) {
                if(this.optionDivEl) {
                    if((this.optionDivEl.dom !== target && !this.optionDivEl.isAncestor(target))) isBlur = true;
                } else isBlur = true;
            }
        }
        if(this.checkContainBlur == false || isBlur == true) {
            if(this.onCanBlur(e) === false) {
                this.setValue(this.lastValue||'', true);
                return;
            }
            Ev.removeListener(Rui.browser.msie ? document.body : document, 'mousedown', this.deferOnBlur);
            this.onBlur.call(this, e);
        } else {
            e.deferCancelBubble = true;
        }
    },
    onCanBlur: function(e) {
        var displayValue = this.getDisplayEl().getValue();
        displayValue = this.getNormalValue(displayValue);
        if (displayValue && this.lastDisplayValue != displayValue && this.validateValue(displayValue) == false) {
            if(this.invalidBlur !== true) return false;
            this.setValue(this.lastValue, true);
            this.setDisplayValue(this.lastDisplayValue);
            return false;
        }
        return true;
    },
    onBlur: function(e) {
        if(!this.isFocus) return;
        this.isFocus = null;
        if(this.isExpand()) this.collapse();
        if(Rui.isUndefined(this.lastDisplayValue) == false && this.lastDisplayValue != this.getDisplayValue())
            this.doChangedDisplayValue(this.getDisplayValue());
        Rui.ui.form.LTextBox.superclass.onBlur.call(this, e);
        this.setPlaceholder();
    },
    doChangedDisplayValue: function(o) {
        this.setValue(o);
    },
    _setWidth: function(type, args, obj) {
        if(args[0] < 0) return;
        Rui.ui.form.LTextBox.superclass._setWidth.call(this, type, args, obj);
        this.getDisplayEl().setWidth(this.getContentWidth());
        if(this.optionDivEl){
            this.setListWidth(args[0]);
        }
    },
    _setHeight: function(type, args, obj) {
        if(args[0] < 0) return;
        Rui.ui.form.LTextBox.superclass._setHeight.call(this, type, args, obj);
        this.getDisplayEl().setHeight(this.getContentHeight() + (Rui.browser.msie67 ? -2 : 0));
        if(Rui.browser.msie && args[0] > -1)  this.getDisplayEl().setStyle('line-height', args[0] + 'px');
    },
    _setListWidth: function(type, args, obj) {
        if(!this.optionDivEl) return;
        var width = this.el.getWidth() || this.width;
        if(this.listWidth > 0)
        	width = Math.max(this.listWidth, width);
        this.optionDivEl.setWidth(width);
    },
    setListWidth: function(w) {
        this.cfg.setProperty('listWidth', w);
    },
    getListWidth: function() {
        return this.cfg.getProperty('listWidth');
    },
    _setAddEmptyText: function(type, args, obj) {
        if(!this.optionDivEl) return;
        if(args[0] == true && this.hasEmptyText() == false) this.createEmptyText();
        else this.removeEmptyText();
    },
    setAddEmptyText: function(useEmptyText) {
        this.cfg.setProperty('useEmptyText', useEmptyText);
    },
    getAddEmptyText: function() {
        return this.cfg.getProperty('useEmptyText');
    },
    setHeight: function(h) {
        this.cfg.setProperty('height', h);
    },
    getHeight: function() {
        return this.cfg.getProperty('height');
    },
    _setDisabled: function(type, args, obj) {
        this.disabled = !!args[0];
        if(this.el) {
            if(this.disabled === false) {
                this.el.removeClass('L-disabled');
                this.getDisplayEl().dom.disabled = false;
                this.getDisplayEl().dom.readOnly = this.latestEditable === undefined ? !this.editable : !this.latestEditable;
            } else {
                this.el.addClass('L-disabled');
                this.getDisplayEl().dom.disabled = true;
                this.getDisplayEl().dom.readOnly = true;
            }
        }
        this.fireEvent(this.disabled ? 'disable' : 'enable');
    },
    setEditable: function(isEditable) {
        this.cfg.setProperty('editable', this.disabled === true ? false : isEditable);
    },
    _setEditable: function(type, args, obj) {
        Rui.ui.form.LTextBox.superclass._setEditable.call(this, type, args, obj);
        this.latestEditable = this.editable;
        this.getDisplayEl().dom.readOnly = !this.editable;
    },
    getDisplayEl: function() {
        return this.inputEl || this.el;
    },
    focus: function() {
        this.getDisplayEl().focus();
    },
    blur: function() {
    	if(this.checkContainBlur) {
            Ev.removeListener(Rui.browser.msie ? document.body : document, 'mousedown', this.deferOnBlur);
            var e = { type: 'mousedown', target: document.body }
            this.onBlur.call(this, e);
    	} else this.getDisplayEl().blur();
    },
    isValid: function() {
        return this.getDisplayEl().isValid();
    },
    onKeyup: function(e) {
        var KEY = KL.KEY;
        if( e.keyCode == KEY.DOWN || e.keyCode == KEY.UP || e.keyCode == KEY.TAB){this.onFocus(); this.fireEvent('keydown', e); return;}
        if(this.inputType == null){this.fireEvent('keyup', e);return;}
        if(this.inputType != null && this.inputType != Rui.util.LString.PATTERN_TYPE_KOREAN){
         var s = this.getValue();
         if(s != null){
             var txt = (s + '').replace(/[\ㄱ-ㅎ가-힣]/g, '');
             if(txt != s){
                 this.setValue(txt);
                 Ev.stopEvent(e);
                  e.returnValue = false;
                  return;
             }
          }
        }
        if(e.shiftKey || e.altKey || e.ctrlKey){
            this.specialKeypress = false;
            this.ctrlKeypress = false;
        }
        this.fireEvent('keyup', e);
    },
    onKeydown: function(e){
        if (this.inputType != null) {
            var KEY = KL.KEY;
            if(e.keyCode != KEY.SPACE && e.keyCode != KEY.SHIFT && (Ev.isSpecialKey(e) || e.keyCode == KEY.BACK_SPACE || e.keyCode == KEY.DELETE)) {return;}
            var c = e.charCode || e.which || e.keyCode;
            if(c == 229 && ((this.inputType != ST.PATTERN_TYPE_KOREAN ))){Ev.preventDefault(e); return;} 
        }
        this.fireEvent('keydown', e);
    },
    onKeypress: function(e) {
        if(this.inputType==null){ this.fireEvent('keypress', e);return;}
        var c = e.charCode || e.which || e.keyCode;
        if(c == 8 || c == 39 || c == 45 || c == 46 ){ return;}
        if(this.ctrlKeypress && (c == 97 || c == 99 || c == 118 || c == 120)){ return;}
        var k =  String.fromCharCode(c);
        var pattern = this.inputType;
        var allowPattern = null;
        if(this.includeChars != null){
            allowPattern = new RegExp('[' + this.includeChars + ']','i');
            if(allowPattern.exec(k)){this.fireEvent('keypress', e); return;}
        }
        if(this.inputType == ST.PATTERN_TYPE_KOREAN){
            if(!ST.isHangul(k)){ Ev.preventDefault(e); return;}
        }else if(!pattern.test(k) ){ Ev.preventDefault(e); return;}
        this.fireEvent('keypress', e);
    },
    onSpecialkeyEvent: function(e) {
        if(this.checkContainBlur === true) {
            if (e.keyCode == KL.KEY.TAB) {
                if (this.onCanBlur(e) == false) {
                    this.focus();
                    try {Ev.stopEvent(e);}catch(e) {}
                    return false;
                } else {
                    Ev.removeListener(Rui.browser.msie ? document.body : document, 'mousedown', this.deferOnBlur);
                    this.onBlur.call(this, e);
                    this.isFocus = null;
                }
            }
        }
        if(this.optionDivEl) {
            this.doKeyMove(e);
        }
        if (e.ctrlKey && String.fromCharCode(e.keyCode) == 'X') {
            this.fireEvent('cut', e);
        } else if (e.ctrlKey && String.fromCharCode(e.keyCode) == 'C') {
            this.fireEvent('copy', e);
        } else if (e.ctrlKey && String.fromCharCode(e.keyCode) == 'V') {
            this.lastValue = null;
            this.fireEvent('paste', e);
        }
    },
    onKeyAutoComplete: function(e) {
        if (this.useDataSet === true && this.autoComplete === true) {
            this.doKeyInput(e);
        }
    },
    doKeyMove: function(e) {
        var k = KL.KEY;
        switch (e.keyCode) {
            case k.ENTER:
                var activeItem = this.getActive();
                if(activeItem != null) {
                    this.doChangedItem(activeItem.dom);
                }
                this.collapse();
                break;
            case k.DOWN:
                this.expand();
                this.nextActive();
                Ev.stopEvent(e);
                break;
            case k.UP:
                this.expand();
                this.prevActive();
                Ev.stopEvent(e);
                break;
            case k.PAGE_DOWN:
                this.pageDown(e);
                break;
            case k.PAGE_UP:
                this.pageUp();
                break;
            case k.ESCAPE:
                this.collapse();
                break;
            default:
                break;
        }
    },
    doKeyInput: function(e) {
        this.isForceCheck = false;
        if(KL.KEY.ENTER == e.keyCode) Ev.preventDefault(e);
        if (KL.KEY.TAB == e.keyCode)
            this.collapse();
        var k = KL.KEY;
        switch (e.keyCode) {
            case k.ENTER:
            case k.DOWN:
            case k.LEFT:
            case k.RIGHT:
            case k.UP:
                break;
            default:
            	if(this.getDisplayEl().getValue() == '' && this.dataSet.isFiltered()) {
            		this.clearFilter();
            	} else if(this.lastValue != this.getDisplayEl().getValue()) {
            		if(!this.autoComplete) this.lastValue = this.getDisplayEl().getValue();
                    if(this.filterTask) return;
                    if((e.altKey === true|| e.ctrlKey === true) && !(e.ctrlKey === true && String.fromCharCode(e.keyCode) == 'V')) return;
                    this.expand();
                    if(this.autoComplete) {
                        this.filterTask = new Rui.util.LDelayedTask(this.doFilter, this);
                        this.filterTask.delay(this.filterMode == 'remote' ? this.remoteDelayTime: this.localDelayTime);
                    }
                }
                break;
        }
    },
    doFilter: function(e){
        this.filterTask.cancel();
        this.filterTask = null;
        this.filter(this.getDisplayEl().getValue(), this.filterFn);
    },
    onOptionMouseDown: function(e) {
        this.collapseIf(e);
        var inputEl = this.getDisplayEl();
        inputEl.focus();
    },
    expand: function() {
        if(this.disabled === true) return;
        if(this.isLoad !== true)
            this.doLoadDataSet();
        if(this.optionDivEl && this.optionDivEl.hasClass('L-hide-display')) {
            this.doExpand();
            if(this.getActiveIndex() < 0)
                this.firstActive();
            try {
                this.getDisplayEl().focus();
            } catch (e) {}
        }
    },
    createOptionDiv: function() {
        if(this.useDataSet === true) {
            var inputEl = this.getDisplayEl();
            var optionDiv = document.createElement('div');
            optionDiv.id = Rui.useFixedId() ? Rui.id(this.el, 'LTextBox-opt-' + this.id) : Rui.id();
            this.optionDivEl = Rui.get(optionDiv);
            this.optionDivEl.setWidth((this.listWidth > -1 ? this.listWidth : (this.width - this.el.getBorderWidth('lr'))));
            this.optionDivEl.addClass(this.CSS_BASE + '-list-wrapper');
            this.optionDivEl.addClass('L-hide-display');
            if(Rui.useAccessibility()){
                this.optionDivEl.setAttribute('role', 'listbox');
                this.optionDivEl.setAttribute('aria-expaned', 'false');
            }
            this.optionDivEl.on('mousedown', this.onOptionMouseDown, this, true);
            if(this.listRenderer) this.optionDivEl.addClass('L-custom-list');
            document.body.appendChild(optionDiv);
        }
    },
    getOptionDiv: function() {
        return this.optionDivEl;
    },
    getActive: function() {
        var activeList = this.optionDivEl.select('.active');
        if(activeList.length < 1) return;
        return activeList.getAt(0);
    },
    getActiveIndex: function() {
        var optionList = this.optionDivEl.select('div.L-list');
        var idx = -1;
        for (var i = 0 ; i < optionList.length ; i++){
            if(optionList.getAt(i).hasClass('active')) {
                idx = i;
                break;
            }
        }
        return idx;
    },
    getDataIndex: function(h) {
        var optionList = this.optionDivEl.select('div.L-list');
        var idx = -1;
        for (var i = 0 ; i < optionList.length ; i++){
            var firstChild = optionList.getAt(i).select('.L-display-field').getAt(0).dom.firstChild;
            if(firstChild && Rui.util.LString.trim(firstChild.nodeValue) == (h && h.length > 0 && Rui.util.LString.trim(h))) {
                idx = i;
                break;
            }
        }
        if(idx > -1 && this.useEmptyText === true)
            idx--;
        return idx;
    },
    getItemByRecordId: function(h) {
    	if(!this.optionDivEl) return null;
        var optionList = this.optionDivEl.select('div.L-list');
        var rId = null;
        for (var i = 0 ; i < optionList.length ; i++){
        	var option = optionList.getAt(i);
            var firstChild = option.select('.L-display-field').getAt(0).dom.firstChild;
            if(firstChild && Rui.util.LString.trim(firstChild.nodeValue) == (h && h.length > 0 && Rui.util.LString.trim(h))) {
                rId = 'r' + option.dom.className.match(Rui.ui.form.LTextBox.ROW_RE)[1];
                break;
            }
        }
        return rId;
    },
    firstActive: function() {
        var firstChildElList = this.optionDivEl.select(':first-child');
        if(firstChildElList.length > 0)
            firstChildElList.getAt(0).addClass('active');
    },
    nextActive: function(){
        var activeEl = this.getActive();
        if(activeEl == null) {
            this.firstActive();
        } else {
            var nextDom = Dom.getNextSibling(activeEl.dom);
            if(nextDom == null) return;
            var nextEl = Rui.get(nextDom);
            activeEl.removeClass('active');
            nextEl.addClass('active');
            this.scrollDown();
        }
    },
    prevActive: function() {
        var activeEl = this.getActive();
        if(activeEl == null) {
            this.firstActive();
        } else {
            var prevDom = Dom.getPreviousSibling(activeEl.dom);
            if(prevDom == null) return;
            var prevEl = Rui.get(prevDom);
            activeEl.removeClass('active');
            prevEl.addClass('active');
            this.scrollUp();
        }
    },
    pageUp: function() {
        if(!this.dataSet) return;
        if(!this.isExpand()) this.expand();
        var ds = this.dataSet;
        var row = ds.getRow();
        var moveRow = row - this.expandCount;
        if (0 > moveRow) {
            if(this.useEmptyText === true) moveRow = -1;
            else moveRow = 0;
        }
        ds.setRow(moveRow);
    },
    pageDown: function() {
        if(!this.dataSet) return;
        if(!this.isExpand()) this.expand();
        var ds = this.dataSet;
        var row = ds.getRow();
        var moveRow = row + this.expandCount;
        if(ds.getCount() - 1 < moveRow) moveRow = ds.getCount() - 1;
        ds.setRow(moveRow);
    },
    scrollDown: function() {
        if (!('scroll' != this.optionDivEl.getStyle(this.overflowCSS) || 'auto' != this.optionDivEl.getStyle(this.overflowCSS))) return;
        var activeEl = this.getActive();
        var activeIndex = this.getActiveIndex() + 1;
        var minScroll = activeIndex * activeEl.getHeight() - this.optionDivEl.getHeight();
        if (this.optionDivEl.dom.scrollTop < minScroll)
            this.optionDivEl.dom.scrollTop = minScroll;
    },
    scrollUp: function() {
        if (!('scroll' != this.optionDivEl.getStyle(this.overflowCSS) || 'auto' != this.optionDivEl.getStyle(this.overflowCSS))) return;
        var activeEl = this.getActive();
        var maxScroll = this.getActiveIndex() * activeEl.getHeight();
        if (this.optionDivEl.dom.scrollTop > maxScroll)
            this.optionDivEl.dom.scrollTop = maxScroll;
    },
    doExpand: function() {
        this.optionDivEl.setTop(0);
        this.optionDivEl.setLeft(0);
        this.optionDivEl.removeClass('L-hide-display');
        this.optionDivEl.addClass('L-show-display');
        if(Rui.useAccessibility())
            this.optionDivEl.setAttribute('aria-expaned', 'true');
        var val = this.getDisplayEl().getValue();
        if(val === '' || (this.useEmptyText && val == this.emptyText)) {
        	this._itemRendered = false;
        	if(this.editable && this.autoComplete) this.dataSet.clearFilter(false);
        }
        if(this._itemRendered !== true)
            this.doDataChangedDataSet();
        this.optionAutoHeight();
        var vWidth = Rui.util.LDom.getViewport().width;
        var height = this.optionDivEl.getHeight();
        var width = this.optionDivEl.getWidth();
        var top = this.el.getTop();
        var left = this.el.getLeft();
        top = top + this.el.getHeight();
        if(!top) top = 0;
        if(!left) left = 0;
        if((this.listPosition == 'auto' && !Rui.util.LDom.isVisibleSide(height + top)) || this.listPosition == 'up')
            top = this.el.getTop() - height;
        if (Rui.rightToLeft()) {
            left -= width - this.getWidth() + (this.marginLeft + (Rui.browser.msie67 ? -2 : 0)) * 2;
            if(left < 0) {
                left += width - this.getWidth() + this.marginLeft + (Rui.browser.msie67 ? -2 : 0);
            }
        } else {
            left = left + this.marginLeft + (Rui.browser.msie67 ? -2 : 0);
            if(vWidth <= left + width && width > this.getWidth()) 
                left -= width - this.getWidth() + (this.marginLeft + (Rui.browser.msie67 ? -2 : 0)) * 2;
        }
        this.optionDivEl.setTop(top + this.marginTop + (Rui.browser.msie67 ? -2 : 0));
        this.optionDivEl.setLeft(left);
        this.optionDivEl.select('.L-list').removeClass('selected');
        this.activeItem();
        if(this.el.findParent('.L-overlay') != null) {
            this.checkOptionDivDelegate = Rui.later(100, this, this._checkOptionDiv, null, true);
        }
        this.reOnDeferOnBlur();
        this.fireEvent('expand');
    },
    _checkOptionDiv: function() {
        var left = this.inputEl.getLeft();
        var top = this.inputEl.getTop();
        if(!(Rui.browser.msie && Rui.browser.version == 8) && !((this.inputEl.getTop() - 2) <= top && this.inputEl.getTop() >= top) ||
            !((this.inputEl.getLeft() - 2) <= left && this.inputEl.getLeft() >= left)) {
            this.collapse();
        }
    },
    isExpand: function() {
        return this.optionDivEl && this.optionDivEl.hasClass('L-show-display');
    },
    collapseIf: function(e) {
        var target = e.target;
        if (((this.optionDivEl && this.optionDivEl.dom == target)) ||
            ((this.iconEl && this.iconEl.dom == target)) ||
            ((this.inputEl && this.inputEl.dom == target)))
            return;
        var targetEl = Rui.get(target);
        if(!targetEl) return;
        var isLList = targetEl.hasClass('L-list');
        if(!isLList) {
            var parentList = targetEl.findParent('div.L-list', 3);
            if(parentList) {
                targetEl = parentList;
                isLList = true;
            }
        }
        if(isLList) {
            targetEl.removeClass('active');
            this.doChangedItem(targetEl.dom);
        }
        this.collapse();
    },
    collapse: function() {
        this.optionDivEl.removeClass('L-show-display');
        this.optionDivEl.addClass('L-hide-display');
        if(Rui.useAccessibility()){
            this.optionDivEl.setAttribute('aria-expaned', 'false');
        }
        if(this.checkOptionDivDelegate) this.checkOptionDivDelegate.cancel();
        if(this.isFocus)
            this.getDisplayEl().focus();
        this.fireEvent('collapse');
        this.optionDivEl.select('.active').removeClass('active');
    },
    optionAutoHeight: function() {
        if(!this.optionDivEl) return;
        var count = this.dataSet.getCount();
        var existOptionDivHeight = this.optionDivEl.getHeight(); 
        var optionDivElHeight = existOptionDivHeight;
        if(this.useEmptyText) count++;
        if(!this.expandCount) this.expandCount = 10;
        if(count > this.expandCount){ 
           if(this.optionDivEl.dom.childNodes.length > 0) {
               var expandHeight = this.expandCount*childHeight;
               var childHeight = this.optionDivEl.dom.firstChild.offsetHeight;
               if(optionDivElHeight != expandHeight){
                   if(optionDivElHeight != expandHeight + this.optionDivEl.getStyle("border-top-width") + this.optionDivEl.getStyle("border-bottom-width")){
                       this.optionDivEl.setHeight(this.expandCount*(childHeight)+"px");
                   }
               }
           }
        }else{
            this.optionDivEl.setHeight('auto');
        }
        optionDivElHeight = this.optionDivEl.getHeight();
        var inputElTop = this.el.getTop();
        var optionDivElTop = this.optionDivEl.getTop();
        if(inputElTop>optionDivElTop){
            this.optionDivEl.setTop(inputElTop-optionDivElHeight);
        }
    },
    onScroll: function(){
        this.collapse();
    },
    activeItem: function() {
        this.isForceCheck = false;
        var value = this.getDisplayEl().getValue();
        if(value == '') return;
        var listElList = this.optionDivEl.select('.L-list');
        var r = this.dataSet.getAt(this.dataSet.getRow());
        if(r) {
            listElList.each(function(child){
                var selected = child.dom.className.indexOf('L-row-' + r.id) > -1 ? true : false;
                if(selected) {
                    child.addClass('selected');
                    child.addClass('active');
                    this.scrollDown();
                    return false;
                }
            }, this);
        }
    },
    doLoadDataSet: function() {
        this._itemRendered = false;
        if(this.optionDivEl) {
            this.doDataChangedDataSet();
            this.isLoad = true;
            this.focusDefaultValue();
        }
        this.doCacheData();
    },
    onBeforeLoadDataSet: function(e) {
        if(!this.bindMDataSet)
            this.dataSet.setRow(-1);
    },
    onLoadDataSet: function(e) {
    	this._newLoaded = true;
        this._itemRendered = false;
        this.doLoadDataSet();
        this.optionAutoHeight();
        if(this.bindMDataSet && this.bindMDataSet.getRow() > -1) {
        	var row = this.bindMDataSet.getRow();
            if(this.autoComplete !== true || this.dataSet.isLoad !== true)
			    this.setValue(this.bindMDataSet.getNameValue(row, this.bindObject.id), true);
        }
    },
    setDefaultValue: function(o) {
        this.defaultValue = o;
    },
    setSelectedIndex: function(idx) {
    	this.selectedIndex = idx;
    },
    focusDefaultValue: function() {
        if(this.bindMDataSet || this.autoComplete === true) return;
        if(this.isLoad !== true && Rui.isEmpty(this.defaultValue)) this.defaultValue = this.getValue();
        var ignore = false;
        if(this.ignoreEvent === true && this.gridPanel) ignore = true;
        if(!Rui.isEmpty(this.defaultValue))
            this.setValue(this.defaultValue, ignore);
        else if(this.selectedIndex !== false && this.selectedIndex >= 0) {
            if(this.dataSet.getCount() - 1 >= this.selectedIndex)
                this.setValue(this.dataSet.getNameValue(this.selectedIndex, this.valueField), ignore);
        } else if(this.firstChangedEvent) this.setValue(null, ignore);
    },
    doChangedItem: function(dom) {
        if(dom.innerHTML) {
            var firstChild = Rui.get(dom).select('.L-display-field').getAt(0).dom.firstChild;
            var displayValue = firstChild ? firstChild.nodeValue : '';
            this.setValue(displayValue);
            if(this.isFocus)
                this.getDisplayEl().focus();
        }
    },
    onRowPosChangedDataSet: function(e) {
    },
    onAddData: function(e) {
        var row = e.row, dataSet = e.target;
        var optionEl = this.createItem({
            record: this.dataSet.getAt(row),
            row: row
        });
        if(dataSet.getCount() > 1) {
            var beforeRow = row - 1;
            if(beforeRow < 0) {
                var nextRow = row + 1;
                var nextRowEl = this.getRowEl(nextRow);
                if(nextRowEl == null) return;
                nextRowEl.insertBefore(optionEl.dom);
            } else {
                var beforeRowEl = this.getRowEl(beforeRow);
                if(beforeRowEl == null) return;
                beforeRowEl.insertAfter(optionEl.dom);
            }
        } else {
            if(this.optionDivEl)
                this.getOptionDiv().appendChild(optionEl.dom);
        }
    },
    onUpdateData: function(e) {
        var row = e.row, colId = e.colId;
        if(colId != this.displayField) return;
        var currentRowEl = this.getRowEl(row);
        if(currentRowEl) {
            var r = this.dataSet.getAt(row);
            var optionEl = this.createItem({
                record: r,
                row: row
            });
            currentRowEl.html(optionEl.getHtml());
            if(row == this.dataSet.getRow()) {
                var inputEl = this.getDisplayEl();
                var displayValue = r.get(this.displayField);
                displayValue = Rui.isEmpty(displayValue) ? '' : displayValue;
                inputEl.setValue(displayValue);
            }
        }
    },
    onRemoveData: function(e) {
        var row = e.row;
        var currentRowEl = this.getRowEl(row);
        (currentRowEl != null) ? currentRowEl.remove() : '';
    },
    onUndoData: function(e) {
        var state = e.beforeState;
        if(state == Rui.data.LRecord.STATE_INSERT) {
            this.onRemoveData(e);
        }
    },
    onDataChangedDataSet: function(e) {
        this._itemRendered = false;
        this.doDataChangedDataSet();
    },
    doDataChangedDataSet: function() {
        if(this.autoComplete !== true && this.editable !== true && this.getValue() && !this.bindMDataSet) {
            var row = this.dataSet.findRow(this.valueField, this.getValue());
            if(row < 0) this.setValue('');
        }
        if(this.autoComplete !== true && !this.isFocus) return;
        this.removeAllItem();
        if(this.useEmptyText === true)
            this.createEmptyText();
        if(this.optionDivEl) {
            var DEL = Rui.data.LRecord.STATE_DELETE,
                dataSet = this.dataSet;
            for (var i = 0, len = dataSet.getCount(); i < len; i++) {
                if(DEL == dataSet.getState(i))
                    continue;
                var optionEl = this.createItem({
                    record: dataSet.getAt(i),
                    row: i
                });
                this.appendOption(optionEl.dom);
            }
            this._itemRendered = true;
        }
        if(this.autoComplete) this.optionAutoHeight();
    },
    appendOption: function(dom) {
        this.optionDivEl.appendChild(dom);
    },
    hasEmptyText: function() {
        if(!this.optionDivEl) return this.useEmptyText;
        if(this.optionDivEl.dom.childNodes.length < 1) return false;
        return Dom.hasClass(this.optionDivEl.dom.childNodes[0], 'L-empty');
    },
    createEmptyText: function() {
        try {
            if(!this.el) return;
            var data = {};
            if(this.valueField) data[this.valueField] = '';
            data[this.displayField] = this.emptyText;
            var record = this.dataSet.createRecord(data);
            var optionEl = this.createItem({
                record: record,
                row: -1
            });
            optionEl.addClass('L-empty');
            this.insertEmptyText(optionEl.dom);
        } catch(e){}
    },
    insertEmptyText: function(dom) {
        if(this.optionDivEl.dom.childNodes.length > 0)
            Dom.insertBefore(dom, this.optionDivEl.dom.childNodes[0]);
        else
            this.optionDivEl.appendChild(dom);
    },
    removeEmptyText: function() {
        if(this.hasEmptyText()) Dom.removeNode(this.optionDivEl.dom.childNodes[0]);
    },
    getRowEl: function(row) {
        if(this.optionDivEl) {
            var rowElList = this.optionDivEl.select('.L-list');
            return rowElList.length > 0 ? rowElList.getAt(this.useEmptyText ? row + 1 : row) : null;
        }
        return null;
    },
    createItem: function(e) {
        var record = e.record;
        var displayValue = record.get(this.displayField);
        displayValue = Rui.isEmpty(displayValue) ? '' : displayValue;
        var listHtml = '';
        if(this.listRenderer) {
            listHtml = this.listRenderer(record);
        } else {
            listHtml = '<div class="L-display-field" id="LTextBox-listItem-' + this.id + '-' + (e.row+1) +'">' + displayValue + '</div>';
        }
        var optionEl = Rui.createElements('<div class="L-list L-row-' + record.id + '" id="LTextBox-optList-' + this.id + '-' + (e.row+1) +'">' + listHtml + '</div>').getAt(0);
        var optionDivEl = this.optionDivEl;
        if(Rui.useAccessibility())
            optionEl.setAttribute('role', 'option');
        optionEl.hover(function(){
            this.addClass('active');
        }, function(){
            optionDivEl.select('.active').removeClass('active');
        });
        return optionEl;
    },
    findRowIndex: function(dom) {
        var list = Rui.get(dom).findParent('.L-list');
        if(!list) return -1;
        var r = list.dom;
        if(r && r.className) {
            var m = r.className.match(this.rowRe);
            if (m && m[1]) {
                var idx = this.dataSet.indexOfKey('r' + m[1]);
                return idx == -1 ? false : idx;
            } else -1;
        } else
            return -1;
    },
    add: function(o, option){
        var record = this.dataSet.createRecord(o, { id: Rui.data.LRecord.getNewRecordId() });
        this.dataSet.add(record, option);
    },
    addAll: function(o, option) {
        for (var i = 0 ; i < o.length ; i++) {
            this.add(o[i], option);
        }
    },
    setData: function(row, o) {
        if(row > this.dataSet.getCount() - 1 || row == 0) return;
        var record = this.dataSet.getAt(row);
        record.setValues(o);
    },
    removeAt: function(row) {
        this.dataSet.removeAt(row);
    },
    removeAllItem: function(){
        if(this.optionDivEl != null)
            this.optionDivEl.select('.L-list').remove();
    },
    getCount: function(){
        return this.dataSet.getCount();
    },
    filter: function(val, fn) {
        if(this.filterMode == 'remote') {
            var p = {};
            p[this.displayField] = val;
            this.dataSet.load({
                url: this.filterUrl,
                params: p
            });
        } else {
            fn = fn || function(id, record) {
                var val2 = record.get(this.displayField);
                if(ST.startsWith(val2.toLowerCase(), val.toLowerCase()))
                    return true;
            };
            this.dataSet.filter(fn, this, false);
        }
    },
    clearFilter: function(){
        if(this.dataSet) this.dataSet.clearFilter(false);
    },
    getValue: function() {
        var value = this.getDisplayEl().getValue();
        if(this.mask && value != null && value != '' && this.maskValue == false)
            value = this.getUnmaskValue(value);
        if(this.mask && value != null && value != '' && this.maskValue == true)
            value = this.getUnmaskValue(value) == '' ? '' : value;
        return (value == this.placeholder || value == '') ? this.getEmptyValue(value) : value;
    },
    getEmptyValue: function(val) {
        if(val === this.emptyValue) return val;
        else return this.emptyValue;
    },
    getUnmaskValue: function(value) {
        var realValue = [];
        Rui.each(value.split(''), function(c,i){
            if(this.tests[i] && this.tests[i].test(c)) {
                realValue.push(c);
            }
        }, this);
        return realValue.join('');
    },
    getBuffer: function(value){
        var defs = this.definitions;
        var buffer = [];
        var v = value.split('');
        var j = 0;
        Rui.each(this.mask.split(''), function(c, i) {
            if (c != '?')
                buffer.push(defs[c] ? this.maskPlaceholder : c);
            if (this.tests[i] && this.tests[i].test(c) && v.length > j) {
                buffer[i] = v[j++];
            }
        }, this);
        return buffer;
    },
    getDisplayValue: function() {
        return this.getDisplayEl().getValue();
    },
    setDisplayValue: function(o) {
        this.getDisplayEl().setValue(o);
    },
    setValue: function(o, ignoreEvent) {
        if(Rui.isUndefined(o) === true || (this.lastValue === o && this.inputType === null) ) return;
        var displayEl = this.getDisplayEl();
        if(displayEl) { 
            displayEl.dom.value = o;
            var displayValue = this.checkValue().displayValue;
            displayEl.dom.value = displayValue;
            this.lastDisplayValue = displayValue;
        }
        if(ignoreEvent !== true) this.doChanged();
        this.lastValue = o;
        this.setPlaceholder();
    },
    doChanged: function() {
        this.fireEvent('changed', {target:this, value:this.getValue(), displayValue:this.getDisplayValue()});
    },
    getDataSet: function() {
        return this.dataSet;
    },
    setDataSet: function(d) {
        this.doUnSyncDataSet();
        this.dataSet = d;
        this.initDataSet();
        this.onLoadDataSet();
    },
    doCacheData: Rui.emptyFn,
    onFireKey: function(e){
        if(Ev.isSpecialKey(e) && !this.isExpand() || (e.ctrlKey === true && (e.keyCode === 70 || String.fromCharCode(e.keyCode) == 'V'))){
            this.fireEvent('specialkey', e);
        }
    },
    initMask: function() {
        var defs = this.definitions;
        var tests = [];
        this.partialPosition = this.mask.length;
        this.firstNonMaskPos = null;
        this.maskLength = this.mask.length;
        Rui.each(this.mask.split(''), function(c, i) {
            if (c == '?') {
                this.maskLength--;
                this.partialPosition = i;
            } else if (defs[c]) {
                tests.push(new RegExp(defs[c]));
                if(this.firstNonMaskPos==null)
                    this.firstNonMaskPos =  tests.length - 1;
            } else {
                tests.push(null);
            }
        }, this);
        this.tests = tests;
        this.buffer = [];
        Rui.each(this.mask.split(''), function(c, i) {
            if (c != '?')
                this.buffer.push(defs[c] ? this.maskPlaceholder : c);
        }, this);
    },
    initMaskEvent: function() {
        this.on('focus', function() {
            if(!(Rui.mobile.ios && this.checkContainBlur == false)) {
	            var focusText = this.getDisplayValue();
	            if(focusText == this.placeholder) this.getDisplayEl().setValue('');
                var pos = this.checkValue().pos;
                if(this.editable !== false)
                    this.writeBuffer();
                setTimeout(Rui.util.LFunction.createDelegate(function() {
                    if (pos == this.mask.length)
                        this.setCaret(0, pos);
                    else
                        this.setCaret(pos);
                }, this), 0);
            }
        }, this, true);
        this.on('blur', function() {
        	if(!(Rui.mobile.ios && this.checkContainBlur == false)) {
                this.setDisplayValue(this.checkValue().displayValue);
        	}
        });
        if(!Rui.mobile.ios) {
            this.on('keydown', this.onKeyDownMask, this, true);
            this.on('keypress', this.onKeyPressMask, this, true);
        }
        this.on('paste', function(e) {
            if(this.cfg.getProperty('disabled')) return;
            if(!(Rui.mobile.ios && this.checkContainBlur == false))
            	setTimeout(Rui.util.LFunction.createDelegate(function() { this.setCaret(this.checkValue(true).pos); }, this), 0);
        }, this, true);
        if(!(Rui.mobile.ios && this.checkContainBlur == false) && this._rendered)
        	this.setDisplayValue(this.checkValue().displayValue); 
    },
    setCaret: function(begin, end) {
        var displayEl = this.getDisplayEl();
        var displayDom = displayEl.dom;
        end = (typeof end == 'number') ? end : begin;
        try{
            if (displayDom.setSelectionRange) {
                displayDom.focus();
                displayDom.setSelectionRange(begin, end);
            } else if (displayDom.createTextRange) {
                var range = displayDom.createTextRange();
                range.collapse(true);
                range.moveEnd('character', end);
                range.moveStart('character', begin);
                range.select();
            }
        }catch(e) {}
    },
    getCaret: function() {
        var displayEl = this.getDisplayEl();
        var displayDom = displayEl.dom;
        if (displayDom.setSelectionRange) {
            begin = displayDom.selectionStart;
            end = displayDom.selectionEnd;
        } else if (document.selection && document.selection.createRange) {
            var range = document.selection.createRange();
            begin = 0 - range.duplicate().moveStart('character', -100000);
            end = begin + range.text.length;
        }
        return { begin: begin, end: end };
    },
    clearBuffer: function(start, end) {
        for (var i = start; i < end && i < this.maskLength; i++) {
            if (this.tests[i])
                this.buffer[i] = this.maskPlaceholder;
        }
    },
    writeBuffer: function() {
        return this.setDisplayValue(this.buffer.join(''));
    },
    onKeyDownMask: function(e) {
        if(this.cfg.getProperty('disabled') || this.editable != true) return true;
        var pos = this.getCaret();
        var k = e.keyCode;
        this.ignore = (k < 16 || (k > 16 && k < 32) || (k > 32 && k < 41));
        if ((pos.begin - pos.end) != 0 && (!this.ignore || k == 8 || k == 46))
            this.clearBuffer(pos.begin, pos.end);
        if (k == 8 || k == 46) {
            this.shiftL(pos.begin + (k == 46 ? 0 : -1));
            Ev.preventDefault(e);
            return false;
        } else if (k == 27) {
        	if(!(this.checkContainBlur == false))
        		this.setCaret(0, this.checkValue().pos);
            Ev.preventDefault(e);
            return false;
        }
    },
    onKeyPressMask: function(e) {
        if (this.ignore) {
            this.ignore = false;
            return (e.keyCode == 8) ? false : null;
        }
        e = e || window.event;
        var k = e.charCode || e.keyCode || e.which;
        var pos = this.getCaret();
        if (e.ctrlKey || e.altKey || e.metaKey) {
            return true;
        } else if ((k >= 32 && k <= 125) || k > 186) {
            if(this.cfg.getProperty('disabled') || this.editable != true) return true;
            var p = this.seekNext(pos.begin - 1);
            if (p < this.maskLength) {
                var c = String.fromCharCode(k);
                if (this.tests[p].test(c)) {
                    this.shiftR(p);
                    this.buffer[p] = c;
                    this.writeBuffer();
                    var next = this.seekNext(p);
                    this.setCaret(next);
                }
            }
        }
        Ev.preventDefault(e);
        return false;
    },
    seekNext: function(pos) {
        while (++pos <= this.maskLength && !this.tests[pos]);
        return pos;
    },
    shiftL: function(pos) {
        while (!this.tests[pos] && --pos >= 0);
        for (var i = pos; i < this.maskLength; i++) {
            if (this.tests[i]) {
                this.buffer[i] = this.maskPlaceholder;
                var j = this.seekNext(i);
                if (j < this.maskLength && this.tests[i].test(this.buffer[j])) {
                    this.buffer[i] = this.buffer[j];
                } else
                    break;
            }
        }
        this.writeBuffer();
        this.setCaret(Math.max(this.firstNonMaskPos, pos));
    },
    shiftR: function(pos) {
        for (var i = pos, c = this.maskPlaceholder; i < this.maskLength; i++) {
            if (this.tests[i]) {
                var j = this.seekNext(i);
                var t = this.buffer[i];
                this.buffer[i] = c;
                if (j < this.maskLength && this.tests[j].test(t))
                    c = t;
                else
                    break;
            }
        }
    },
    checkValue: function(allow) {
        var test = this.getDisplayValue();
        var lastMatch = -1;
        for (var i = 0, pos = 0; i < this.maskLength; i++) {
            if (this.tests[i]) {
                this.buffer[i] = this.maskPlaceholder;
                while (pos++ < test.length) {
                    var c = test.charAt(pos - 1);
                    if (this.tests[i].test(c)) {
                        this.buffer[i] = c;
                        lastMatch = i;
                        break;
                    }
                }
                if (pos > test.length)
                    break;
            } else if (this.buffer[i] == test[pos] && i!=this.partialPosition) {
                pos++;
                lastMatch = i;
            }
        }
        if (!allow && lastMatch + 1 < this.partialPosition) {
            test = '';
            this.clearBuffer(0, this.maskLength);
        } else if (allow || lastMatch + 1 >= this.partialPosition) {
            this.writeBuffer();
            if (!allow) {
                test = this.getDisplayValue().substring(0, lastMatch + 1);
            };
        }
        return {
            pos: (this.partialPosition ? i : this.firstNonMaskPos),
            displayValue: test
        };
    },
    validateValue: function(value) {
        if (this.type == 'email' && this.getValue() != '')
            return new Rui.validate.LEmailValidator({id: this.id}).validate(this.getValue());
        return true;
    },
    findRowElById: function(rowId) {
    	if(!this.optionDivEl) return null;
        var rowEl = this.optionDivEl.select('.L-row-' + rowId);
        return rowEl.length > 0 ? rowEl.getAt(0) : null;
    },
    destroy: function() {
        if(this.dataSet)
            this.doUnSyncDataSet();
        if(this.inputEl) {
            this.inputEl.unOnAll();
            this.inputEl.remove();
            delete this.inputEl;
        }
        if (this.displayEl) {
        	this.displayEl.unOnAll();
            this.displayEl.remove();
            delete this.displayEl;
        }
        if (this.optionDivEl) {
        	this.optionDivEl.unOnAll();
            this.optionDivEl.remove();
            delete this.optionDivEl;
        }
        Rui.ui.form.LTextBox.superclass.destroy.call(this);
    },
    getNormalValue: function(val) {
    	return val;
    }
});
})();
Rui.namespace('Rui.ui.form');
Rui.ui.form.LCombo = function(config){
    config = Rui.applyIf(config || {}, Rui.getConfig().getFirst('$.ext.combo.defaultProperties'));
    var configDataSet = Rui.getConfig().getFirst('$.ext.combo.dataSet');
    if(configDataSet){
        if(!config.valueField && configDataSet.valueField)
            config.valueField = configDataSet.valueField;
        if(!config.displayField && configDataSet.displayField)
            config.displayField = configDataSet.displayField;
    }
    this.emptyText = config.emptyText || this.emptyText;
    this.dataMap = {};
    Rui.ui.form.LCombo.superclass.constructor.call(this, config);
    this.dataSet.focusFirstRow = Rui.isUndefined(this.focusFirstRow) == false ? this.focusFirstRow : false;
    if(this.dataSet.getRow() > -1 && this._rendered == true && this.forceSelection === true) {
        this.setDisplayValue(this.dataSet.getNameValue(this.dataSet.getRow(), this.displayField));
    }
    this.onWheelDelegate = Rui.util.LFunction.createDelegate(this.onWheel,this);
};
Rui.extend(Rui.ui.form.LCombo, Rui.ui.form.LTextBox, {
    otype: 'Rui.ui.form.LCombo',
    CSS_BASE: 'L-combo',
    valueField: 'value',
    displayField: 'text',
    emptyTextMessageCode: '$.base.msg108',
    emptyText: null,
    useEmptyText: true,
    iconWidth: 20,
    iconMarginLeft: 1,
    forceSelection: true,
    lastDisplayValue: '',
    changed: false,
    selectedIndex: -1,
    editable: false,
    useDataSet: true,
    checkContainBlur: true,
    rendererField: null,
    autoMapping: false,
    dataMap: null,
    dataSetId: null,
    items: null,
    initComponent: function(config) {
        this.emptyText = this.emptyText == null ? Rui.getMessageManager().get(this.emptyTextMessageCode) : this.emptyText;
        if(this.cfg.getProperty('useEmptyText') === true)
           this.forceSelection = false; 
        if(this.rendererField || this.autoMapping) this.beforeRenderer = this.comboRenderer;
        if(this.items) {
            this.createDataSet();
            this.loadItems();
            this.doDataChangedDataSet();
            this.isLoad = true;
            this.initDataSet();
            this.focusDefaultValue();
        }
    },
    initEvents: function() {
    	Rui.ui.form.LCombo.superclass.initEvents.call(this);
        this.initAutoMapDataSet();
    },
    initAutoMapDataSet: function() {
        if(this.autoMapping && this.dataSet) {
            this.doUnOnClearMapDataSet();
            this.doOnClearMapDataSet();
        }
    },
    initDataSet: function() {
        Rui.ui.form.LCombo.superclass.initDataSet.call(this);
        if(this.initSync && this.dataSet)
            this.dataSet.sync = true;
    },
    doRender: function(){
        this.createTemplate(this.el);
        var hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = this.name || this.id;
        hiddenInput.id = Rui.useFixedId() ? Rui.id(this.el, 'LCombo-hidden-' + this.id) : Rui.id();
        hiddenInput.instance = this;
        hiddenInput.className = 'L-instance L-hidden-field';
        this.el.appendChild(hiddenInput);
        this.hiddenInputEl = Rui.get(hiddenInput);
        this.hiddenInputEl.addClass('L-hidden-field');
        this.inputEl.removeAttribute('name');
        this.inputEl.setStyle('ime-mode', 'disabled'); 
        var input = this.inputEl.dom;
        if(Rui.useAccessibility()){
            input.setAttribute('role', 'combobox');
            input.setAttribute('aria-readonly', 'true');
            input.setAttribute('aria-autocomplete', 'none');
            hiddenInput.setAttribute('role', 'combobox');
            hiddenInput.setAttribute('aria-hidden', 'true');
        }
        this.doRenderButton();
    },
    doRenderButton: function(){
        var iconDiv = document.createElement('div');
        iconDiv.className = 'icon';
        iconDiv.id = Rui.useFixedId() ? Rui.id(this.el, 'LCombo-icon-' + this.id) : Rui.id();
        this.el.appendChild(iconDiv);
        this.iconEl = Rui.get(iconDiv);
    },
    onClearDataMap: function(e) {
        this.dataMap = {};
    },
    doOnClearMapDataSet: function() {
        this.dataSet.on('load', this.onClearDataMap, this, true);
        this.dataSet.on('dataChanged', this.onClearDataMap, this, true);
        this.dataSet.on('add', this.onClearDataMap, this, true);
        this.dataSet.on('update', this.onClearDataMap, this, true);
        this.dataSet.on('remove', this.onClearDataMap, this, true);
        this.dataSet.on('undo', this.onClearDataMap, this, true);
    },
    doUnOnClearMapDataSet: function(){
        this.dataSet.unOn('load', this.onClearDataMap, this);
        this.dataSet.unOn('dataChanged', this.onClearDataMap, this);
        this.dataSet.unOn('add', this.onClearDataMap, this);
        this.dataSet.unOn('update', this.onClearDataMap, this);
        this.dataSet.unOn('remove', this.onClearDataMap, this);
        this.dataSet.unOn('undo', this.onClearDataMap, this);
    },
    createContainer: function(parentNode) {
        if(this.el) {
            if(this.el.dom.tagName == 'SELECT') {
                var Dom = Rui.util.LDom;
                this.id = this.id || this.el.id;
                this.oldDom = this.el.dom;
                var opts = this.oldDom.options;
                if(opts && 0 < opts.length) {
                    this.items = [];
                    for (var i = 0 ; opts && i < opts.length; i++) {
                        if(Dom.hasClass(opts[i], 'empty')) {
                            this.cfg.setProperty('useEmptyText', true);
                            this.emptyText = opts[i].text;
                            continue;
                        }
                        var option = {};
                        option[this.valueField] = opts[i].value;
                        option[this.displayField] = opts[i].text;
                        this.items.push(option);
                        if(opts[i].selected) this.defaultValue = opts[i].value;
                    }
                }
                this.name = this.name || this.oldDom.name;
                var parent = this.el.parent();
                this.el = Rui.get(this.createElement().cloneNode(false));
                this.el.dom.id = this.id;
                Dom.replaceChild(this.el.dom, this.oldDom);
                this.el.appendChild(this.oldDom);
                Dom.removeNode(this.oldDom);
                delete this.oldDom;
            }
        }
        Rui.ui.form.LTextBox.superclass.createContainer.call(this, parentNode);
    },
    afterRender: function(container) {
        Rui.ui.form.LCombo.superclass.afterRender.call(this, container);
        if(this.items) {
            this.loadItems();
            this.doDataChangedDataSet();
            this.isLoad = true;
            this.initDataSet();
            this.focusDefaultValue();
        }
        if(Rui.useAccessibility()){
            this.inputEl.setAttribute('aria-owns', this.optionDivEl.id);
            this.iconEl.setAttribute('aria-controls', this.optionDivEl.id);
        }
        if(this.isGridEditor && this.rendererField) this.initUpdateEvent();
        if(this.forceSelection === true && this.dataSet.getRow() < 0)
            this.dataSet.setRow(0);
        if(this.iconEl) this.iconEl.on('click', this.doIconClick, this, true);
        this.applyEmptyText();
    },
    createDataSet: function() {
        if(!this.dataSet) {
            this.dataSet = new (eval(this.dataSetClassName))({
                id: this.dataSetId || (this.id + 'DataSet'),
                fields:[
                    {id:this.valueField},
                    {id:this.displayField}
                ],
                focusFirstRow: false,
                sync: this.initSync === true ? true : false
            });
        }
    },
    loadItems: function() {
        this.dataSet.batch(function() {
            for (var i = 0 ; i < this.items.length ; i++) {
                var rowData = {};
                rowData[this.valueField] = this.items[i][this.valueField];
                rowData[this.displayField] = this.items[i][this.displayField] || this.items[i][this.valueField];
                var record = new Rui.data.LRecord(rowData, { dataSet: this.dataSet });
                this.dataSet.add(record);
                this.dataSet.setState(this.dataSet.getCount() - 1, Rui.data.LRecord.STATE_NORMAL);
            }
        }, this);
        this.dataSet.commit();
        this.dataSet.isLoad = true;
        delete this.items;
    },
    doIconClick: function(e) {
        if(!this.isFocus) {
            this.onFocus(e);
        }
        if(this.isExpand()){
            this.collapse();
            Rui.util.LEvent.removeListener(document,'mousewheel',this.onWheelDelegate);
        }
        else { 
            this.expand();
            Rui.util.LEvent.addListener(document, 'mousewheel',this.onWheelDelegate,this); 
        }
    },
    onWheel: function(e){
        if(this.isExpand()){
             var target = e.target;
             if(this.el.isAncestor(target)){
                 this.collapse(); 
                 Rui.util.LEvent.addListener(document, 'mousewheel',this.onWheelDelegate,this);
             }
        }
    },
    _setWidth: function(type, args, obj) {
        if(args[0] < 0) return;
        Rui.ui.form.LCombo.superclass._setWidth.call(this, type, args, obj);
        this.getDisplayEl().setWidth(this.getContentWidth() - (this.iconEl.getWidth() || this.iconWidth) - this.iconMarginLeft);
    },
    setSelectedIndex: function(idx) {
        if(this.dataSet.getCount() - 1 < idx) return;
        this.setValue(this.dataSet.getNameValue(idx, this.valueField));
    },
    setDisplayValue: function(o) {
        if(o != this.getDisplayValue()) {
            o = this.forceSelection === true ? (this.isForceSelectValue(o) ? o : this.lastDisplayValue ) : o;
            this.inputEl.setValue(o);
            this.applyEmptyText();
            this.bindDataSet();
        }
        this.lastDisplayValue = this.inputEl.getValue();
        if(this.lastDisplayValue == this.emptyText)
            this.lastDisplayValue = '';
    },
    bindDataSet: function() {
    	var ds = this.dataSet;
        if(ds && !this.editable) {
        	var displayValue = this.getDisplayValue();
        	if(ds.getNameValue(ds.getRow(), this.displayField) != displayValue) {
            	var rId = this.getItemByRecordId(displayValue);
                if(rId) {
                	var dataIndex = ds.indexOfKey(rId);
            		ds.setRow(dataIndex, {isForce:ds.isFiltered()});
            		var r = ds.getAt(dataIndex);
                    if(r) this.hiddenInputEl.setValue(r.get(this.valueField));
                    else this.hiddenInputEl.setValue('');
                } else {
                    this.hiddenInputEl.setValue('');
                }
        	}
        }
        this.changed = true;
    },
    getRemovedSkipRow: function(idx) {
    	var ds = this.dataSet, r = null;
    	for (var i = 0, j = 0, len = ds.getCount(); i < len; i++) {
    		var r2 = ds.getAt(i);
        	if(r2.state != Rui.data.LRecord.STATE_DELETE) j++;
        	if(idx <= i && idx <= j) {
        		r = r2;
        		break;
        	}
    	}
    	return r;
    },
    getRemainRemovedRow: function(idx) {
    	var ds = this.dataSet, ri = -1;
    	for (var i = 0, j = 0; i < ds.getCount(); i++) {
    		var r2 = ds.getAt(i);
        	if(r2.state != Rui.data.LRecord.STATE_DELETE) j++;
        	if(idx == j) {
        		ri = j;
        		break;
        	}
    	}
    	return ri;
    },
    isForceSelectValue: function(o) {
        var listElList = this.optionDivEl.select('.L-list');
        var isSelection = false;
        listElList.each(function(child){
            var firstChild = child.select('.L-display-field').getAt(0).dom.firstChild;
            if(firstChild && firstChild.nodeValue == o) {
                isSelection = true;
                return false;
            }
        });
        return isSelection;
    },
    applyEmptyText: function() {
        if(this.useEmptyText == false) return;
        if(this.inputEl.getValue() == '' || this.inputEl.getValue() == this.emptyText) {
            this.inputEl.setValue(this.emptyText);
            this.inputEl.addClass('empty');
        } else {
            this.inputEl.removeClass('empty');
        }
    },
    getDisplayValue: function() {
        if(!this.inputEl) return null;
        var o = this.inputEl.getValue();
        o = (o == this.emptyText) ? '' : o;
        return o;
    },
    getBindValue: function(fieldName) {
        fieldName = fieldName || this.valueField;
        var val = this.getValue();
        var row = this.dataSet.findRow(this.valueField, val);
        if(row < 0) return '';
        return this.dataSet.getAt(row).get(fieldName);
    },
    repaint: function() {
        this.onLoadDataSet();
        this.applyEmptyText();
    },
    doChangedItem: function(dom) {
        var listDom = Rui.get(dom).select('.L-display-field').getAt(0).dom;
        var row = this.findRowIndex(listDom);
        var val = (row > -1) ? this.dataSet.getNameValue(row, this.valueField) : this.emptyValue;
        this.setValue(val);
        if(this.isFocus) this.getDisplayEl().focus();
    },
    onUpdateData: function(e) {
        Rui.ui.form.LCombo.superclass.onUpdateData.call(this, e);
        var row = e.row, colId = e.colId, r, inputEl, displayValue;
        if(row == this.dataSet.getRow() && this.hiddenInputEl) {
            r = this.dataSet.getAt(row);
            if(colId == this.valueField)
                this.hiddenInputEl.setValue(r.get(this.valueField));
            if(colId == this.displayField){
                inputEl = this.getDisplayEl();
                displayValue = r.get(this.displayField);
                displayValue = Rui.isEmpty(displayValue) ? '' : displayValue;
                inputEl.setValue(displayValue);
            }
        }
    },
    onRowPosChangedDataSet: function(e) {
        this.doRowPosChangedDataSet(e.row, true);
    },
    doRowPosChangedDataSet: function(row, ignoreEvent) {
        if(!this.hiddenInputEl) return;
        var ds = this.dataSet;
        var r = null;
        if(ds.remainRemoved) {
        	r = this.getRemovedSkipRow(row);
        } else r = ds.getAt(row);
        if(row < 0) {
        	this.hiddenInputEl.setValue('');
            this.setDisplayValue('');
        } else {
            if(row < 0 || row >= ds.getCount()) return;
            var value = r.get(this.valueField);
            value = Rui.isEmpty(value) ? '' : value;
            this.hiddenInputEl.setValue(value);
            var displayValue = r.get(this.displayField);
            displayValue = Rui.isEmpty(displayValue) ? '' : displayValue;
            this.inputEl.setValue(displayValue);
        }
        if(r) {
            var rowEl = this.findRowElById(r.id);
            if(rowEl) {
                if(!rowEl.hasClass('active')) {
                    this.optionDivEl.select('.active').removeClass('active');
                    rowEl.addClass('active');
                    rowEl.dom.tabIndex = 0;
                    rowEl.focus();
                    if(this.isFocus) this.getDisplayEl().focus();
                    rowEl.dom.removeAttribute('tabIndex');
                }
            }
        } else if(row === -1 && this.useEmptyText === true){
            this.optionDivEl.select('.active').removeClass('active');
            var rowEl = Rui.get(this.optionDivEl.dom.childNodes[0]);
            if(rowEl) {
                rowEl.addClass('active');
                rowEl.dom.tabIndex = 0;
                rowEl.focus();
                if(this.isFocus) this.getDisplayEl().focus();
                rowEl.dom.removeAttribute('tabIndex');
            }
        }
        if(this.ignoreChangedEvent !== true) {
            this.doChanged();
        }
    },
    getValue: function() {
        if(!this.hiddenInputEl) return this.emptyValue;
        var val = this.hiddenInputEl.getValue();
        if(val === '')
            return this.getEmptyValue(val);
        return val;
    },
    setValue: function(o, ignore) {
        if(!this.hiddenInputEl) return;
        if(this._newLoaded !== true && this.hiddenInputEl.dom.value === o) return;
        this._newLoaded = false;
        var ds = this.dataSet;
        if(this.bindMDataSet && this.bindMDataSet.getRow() > -1 && ds.isLoad !== true)
        	return;
        if(this.isLoad == true) {
            var row = ds.findRow(this.valueField, o);
            this.ignoreChangedEvent = true;
            if(row !== ds.getRow())
                ds.setRow(row);
            else {
                if(row > -1) {
                    this.hiddenInputEl.dom.value = o;
                    this.getDisplayEl().setValue(ds.getNameValue(row, this.displayField));
                }
            }
            row = ds.getRow();
            delete this.ignoreChangedEvent;
            if(this.forceSelection !== true && row < 0)
                this.hiddenInputEl.dom.value = '';
            if (row < 0) {
                this.getDisplayEl().setValue('');
                this.applyEmptyText();
            }
        } else 
            this.setDefaultValue(o);
        if(ignore !== true) this.doChanged();
    },
    _setDisabled: function(type, args, obj) {
        if(this.isExpand()) this.collapse();
        Rui.ui.form.LCombo.superclass._setDisabled.call(this, type, args, obj);
    },
    displayRenderer: function(combo) {
        var dataSet = combo.getDataSet();
        return function(val, p, record, row, i) {
            var displayValue = null;
            if(record.state == Rui.data.LRecord.STATE_NORMAL) {
                displayValue = record.get(combo.displayField);
            } else {
                var row = dataSet.findRow(combo.valueField, val);
                displayValue = (row > -1) ? dataSet.getAt(row).get(combo.displayField) : val;
            }
            return displayValue ;
        };
    },
    onFocus: function(e) {
        Rui.ui.form.LCombo.superclass.onFocus.call(this, e);
        var inputEl = this.getDisplayEl();
        inputEl.removeClass('empty');
        if(inputEl.getValue() == this.emptyText) {
            if(this.editable === true) 
                inputEl.setValue('');
        }
        if(this.editable) Rui.util.LEvent.addListener(Rui.browser.msie ? document.body : document, 'mousedown', this.onEditableChanged, this, true);
    },
    onEditableChanged: function(e) {
    	this.doEditableChanged();
    },
    doEditableChanged: function() {
        var displayValue = this.getDisplayValue();
        var findValue = this.findValueByDisplayValue(displayValue);
        if(this.forceSelection == false && (displayValue == '' || findValue == null)) this.setValue(this.emptyValue);
        else if(this.lastDisplayValue != displayValue) this.setValue(findValue);
    },
    onBlur: function(e) {
        Rui.ui.form.LCombo.superclass.onBlur.call(this, e);
        this.doForceSelection();
        this.applyEmptyText();
        if(this.editable) Rui.util.LEvent.removeListener(Rui.browser.msie ? document.body : document, 'mousedown', this.onEditableChanged);
        if(this.autoComplete && this.editable) this.clearFilter();
    },
    clearFilter: function() {
    	if(this.dataSet && this.dataSet.isFiltered() == true) {
    		var row = this.dataSet.getRow();
            var r = this.dataSet.getAt(row);
        	this.dataSet.clearFilter(false);
        	if(r !== undefined) {
	        	row = this.dataSet.indexOfKey(r.id);
	        	this.dataSet.focusRow({
	                ignoreCanRowPosChange: true,
	                forceRow: true,
	                row: row
	            });
        	}
        }
    },
    onKeydown: function(e){
    	if(this.editable)
            if(e.keyCode == Rui.util.LKey.KEY.TAB) this.doEditableChanged();
    	Rui.ui.form.LCombo.superclass.onKeydown.call(this, e);
    },
    comboRenderer: function(val, p, record, row, i) {
        if(Rui.isEmpty(val)) return '';
        var rVal = undefined;
        rVal = this.dataMap[val];
        if(Rui.isUndefined(rVal)) {
            if(this.autoMapping) {
                if(this.dataSet.isFiltered()) {
                    for (var i = 0, len = this.dataSet.snapshot.length; i < len ; i++) {
                        var r = this.dataSet.snapshot.getAt(i);
                        if(r.get(this.valueField) === val) {
                            rVal = r.get(this.displayField);
                            break;
                        }
                    }
                } else {
                    var cRow = this.dataSet.findRow(this.valueField, val);
                    if (cRow > -1) {
                        rVal = this.dataSet.getNameValue(cRow, this.displayField);
                    }
                }
            }
        }
        if(Rui.isUndefined(rVal)) rVal = this.rendererField ? record.get(this.rendererField) : val;
        if(Rui.isUndefined(rVal)) rVal = this.dataMap[val] ? this.dataMap[val] : rVal;
        this.dataMap[val] = rVal;
        return rVal;
    },
    initUpdateEvent: function() {
        if(!this.gridPanel || this.isInitUpdateEvent === true || !this.rendererField) return;
        var gridDataSet = this.gridPanel.getView().getDataSet();
        this.on('changed', function(e){
            gridDataSet.setNameValue(gridDataSet.getRow(), this.rendererField, this.dataSet.getNameValue(this.dataSet.getRow(), this.displayField));
        }, this, true);
        this.isInitUpdateEvent = true;
    },
    doChangedDisplayValue: function(o) {
        this.bindDataSet();
    },
    doForceSelection: function() {
        if(this.forceSelection === true) {
            if(this.changed == true) {
                var inputEl = this.getDisplayEl();
                var row = this.dataSet.findRow(this.displayField, inputEl.getValue());
                if(row < 0)
                    this.setDisplayValue(this.lastDisplayValue);
                else
                    this.bindDataSet();
            }
        }
    },
    setDataSet: function(d) {
        Rui.ui.form.LCombo.superclass.setDataSet.call(this, d);
        this.initAutoMapDataSet();
    },
    doCacheData: function() {
        for (var i = 0 ; i < this.dataSet.getCount(); i++) {
            this.dataMap[this.dataSet.getNameValue(i, this.valueField)] = this.dataSet.getNameValue(i, this.displayField);
        }
    },
    clearCacheData: function() {
        this.dataMap = {};
    },
    findValueByDisplayValue: function(displayValue) {
    	var eRow = -1;
        this.dataSet.data.each(function(id, record, i){
        	var recordValue = record.get(this.displayField);
            if (recordValue && recordValue.toLowerCase() == displayValue.toLowerCase()) {
            	eRow = i;
                return false;
            }
        }, this);
        if(eRow > -1)
            return this.dataSet.getAt(eRow).get(this.valueField);
        return null;
    },
    destroy: function() {
        if(this.iconEl) {
            this.iconEl.remove();
            delete this.iconEl;
        }
        Rui.ui.form.LCombo.superclass.destroy.call(this);
        this.dataMap = null;
        this.iconEl = null;
        this.hiddenInputEl = null;
    }
});
Rui.ui.form.LDateBox = function(config){
    config = Rui.applyIf(config || {}, Rui.getConfig().getFirst('$.ext.dateBox.defaultProperties'));
    if(Rui.platform.isMobile) {
    	config.localeMask = false;
    	config.picker = false;
    }
    if(config.localeMask) this.initLocaleMask();
    if(!config.placeholder) {
        var xFormat = this.getLocaleFormat();
        try { xFormat = xFormat.toLowerCase().replace('%y', 'yyyy').replace('%m', 'mm').replace('%d', 'dd'); } catch(e) {};
        config.placeholder = xFormat;
    }
    Rui.ui.form.LDateBox.superclass.constructor.call(this, config);
};
Rui.extend(Rui.ui.form.LDateBox, Rui.ui.form.LTextBox, {
    otype: 'Rui.ui.form.LDateBox',
    CSS_BASE: 'L-datebox',
    dateType: 'date',
    valueFormat: '%Y-%m-%d',
    selectingInputDate: true,
    width: 90,
    iconWidth: 20,
    iconMarginLeft: 1,
    localeMask: false,
    checkContainBlur: Rui.platform.isMobile ? false : true,
    listPosition: 'auto',
    picker: true,
    displayValue: Rui.platform.isMobile ? '%Y-%m-%d' : '%x',
    emptyValue: null,
    calendarConfig: null,
    iconTabIndex: 0,
    initComponent: function(config){
    	Rui.ui.form.LDateBox.superclass.initComponent.call(this, config);
        this.calendarClass = Rui.ui.calendar.LCalendar;
        var dvs = this.displayValue.split("%");
        if(dvs.length > 1 && dvs[1].length > 1)
        	this.displayValueSep = dvs[1].substring(1);
    },
    doRender: function(){
    	if(Rui.platform.isMobile && (this.type == null || this.type == 'text')) this.type = 'date';
        this.createTemplate(this.el);
        var hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = this.name || this.id;
        hiddenInput.id = Rui.useFixedId() ? Rui.id(this.el, 'LDateBox-hidden-' + this.id) : Rui.id();
        hiddenInput.instance = this;
        hiddenInput.className = 'L-instance L-hidden-field';
        this.el.appendChild(hiddenInput);
        this.hiddenInputEl = Rui.get(hiddenInput);
        this.hiddenInputEl.addClass('L-hidden-field');
        this.inputEl.removeAttribute('name');
        this.inputEl.setStyle('ime-mode', 'disabled'); 
        if(Rui.platform.isMobile) {
            this.inputEl.on('change', function(e){
            	this.setValue(this.inputEl.getValue());
            }, this, true);
        }
        this.doRenderCalendar();
    },
    doRenderCalendar: function(){
        if(!this.picker) return;
        var calendarDiv = document.createElement('div');
        calendarDiv.className = 'L-cal-container';
        calendarDiv.id = Rui.useFixedId() ? Rui.id(this.el, 'LDateBox-cal-' + this.id) : Rui.id();
        this.calendarDivEl = Rui.get(calendarDiv);
        document.body.appendChild(calendarDiv);
        var iconDom = document.createElement('a');
        iconDom.className = 'icon';
        iconDom.id = Rui.useFixedId() ? Rui.id(this.el, 'LDateBox-icon-' + this.id) : Rui.id();
        this.el.appendChild(iconDom);
        this.iconEl = Rui.get(iconDom);
        if(Rui.useAccessibility())
            this.iconEl.setAttribute('role', 'button');
        var config = this.calendarConfig || {};
        config.applyTo = this.calendarDivEl.id;
        this.calendarDivEl.addClass(this.CSS_BASE + '-calendar');
        this.calendar = new this.calendarClass(config);
        this.calendar.render();
        this.calendar.hide();
    },
    pickerOn: function(){
        if(!this.iconEl) return;
        this.iconEl.on('mousedown', this.onIconClick, this, true);
        this.iconEl.setStyle('cursor', 'pointer');
        if(this.iconTabIndex > -1) this.iconEl.setAttribute('tabindex', this.iconTabIndex);
    },
    pickerOff: function(){
        if(!this.iconEl) return;
        this.iconEl.unOn('mousedown', this.onIconClick, this);
        this.iconEl.setStyle('cursor', 'default');
        if(this.iconTabIndex > -1) this.iconEl.removeAttribute('tabindex');
    },
    deferOnBlur: function(e) {
        if (this.calendarDivEl ? this.calendarDivEl.isAncestor(e.target) : false) {
            var el = Rui.get(e.target);
            if (el.dom.tagName.toLowerCase() == 'a' && el.hasClass('selector')) {
                var selectedDate = this.calendar.getProperty('pagedate');
                selectedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), parseInt(el.getHtml()));
                this.setValue(selectedDate);
                if(this.calendar) 
                    this.calendar.hide();
            }
        }
        Rui.util.LFunction.defer(this.checkBlur, 10, this, [e]);
    },
    checkBlur: function(e) {
        if(e.deferCancelBubble == true || this.isFocus !== true) return;
        var target = e.target;
        var el = Rui.get(e.target);
        var calendarDivElId = this.calendar.id;
        if(target !== this.el.dom && !this.el.isAncestor(target) && ( this.calendarDivEl ? target !== this.calendarDivEl.dom && !(this.calendarDivEl.isAncestor(target)) && !(el.dom.tagName.toLowerCase() === 'a' && el.dom.id.indexOf(calendarDivElId) !== -1 ) : true)) {
            Rui.util.LEvent.removeListener(Rui.browser.msie ? document.body : document, 'mousedown', this.deferOnBlur);
            this.onBlur.call(this, e); 
            this.isFocus = false;
        }else{
            e.deferCancelBubble = true;
        }
    },
    onBlur: function(e){
        Rui.ui.form.LDateBox.superclass.onBlur.call(this, e);
        if(this.calendar)
            this.calendar.hide();
    },
    doChangedDisplayValue: function(o) {
        this.setValue(o);
    },
    getDate: function(sDate){
        if(sDate instanceof Date) {
            return sDate;
        }
        var oDate = Rui.util.LFormat.stringToDate(sDate, {format: this.displayValue || '%x'});
        if(!(oDate instanceof Date)) {
            oDate = Rui.util.LFormat.stringToDate(sDate, {format: this.valueFormat});
        }
        if(oDate instanceof Date) {
            return oDate;
        }else{
            return false;
        }
    },
    getDateString: function(oDate, format){
        format = format ? format : '%Y%m%d';
        var value = oDate ? Rui.util.LFormat.dateToString(oDate, {
            format: format
        }) : '';
        return value ? value : '';
    },
    setCalendarXY: function(){
        var h = this.calendarDivEl.getHeight() || 0,
            t = this.getDisplayEl().getTop() + this.getDisplayEl().getHeight(),
            l = this.getDisplayEl().getLeft();
        if((this.listPosition == 'auto' && !Rui.util.LDom.isVisibleSide(h+t)) || this.listPosition == 'up')
                t = this.getDisplayEl().getTop() - h;
        var vSize = Rui.util.LDom.getViewport();
        if(vSize.width <= (l + this.calendarDivEl.getWidth())) l -= (this.calendarDivEl.getWidth() / 2);
        this.calendarDivEl.setTop(t);
        this.calendarDivEl.setLeft(l);
    },
    onIconClick: function(e) {
        this.showCalendar();
        this.inputEl.focus();
        Rui.util.LEvent.preventDefault(e);
    },
    showCalendar: function(){
        if(this.disabled === true) return;
        this.calendarDivEl.setTop(0);
        this.calendarDivEl.setLeft(0);
        if (this.selectingInputDate)
            this.selectCalendarDate();
        this.calendar.show();
        this.setCalendarXY();
    },
    selectCalendarDate: function(date){
        date = date || this.getValue();
        if(!(date instanceof Date)) date = this.getDate(date);
        if (date) {
            this.calendar.clear();
            var selDates = this.calendar.select(date,false);
            if (selDates.length > 0) {
                this.calendar.cfg.setProperty('pagedate', selDates[0]);
                this.calendar.render();
            }
        }
    },
    initLocaleMask: function() {
    	if(!Rui.platform.isMobile) {
            var xFormat = this.getLocaleFormat();
            var order = xFormat.split('%');
            var mask = '';
            var c = '';
            for (var i=1;i<order.length;i++){
                c = order[i].toLowerCase().charAt(0);
                switch(c){
                    case 'y':
                    mask += '9999';
                    break;
                    case 'm':
                    mask += '99';
                    break;
                    case 'd':
                    mask += '99';
                    break;
                }
                if(order[i].length > 1) mask += order[i].charAt(1);
            }
            this.mask = mask;
    	}
        this.displayValue = '%x';
    },
    getLocaleFormat: function() {
        var sLocale = Rui.getConfig().getFirst('$.core.defaultLocale');
        var xFormat = '%x';
        if(this.displayValue && this.displayValue.length < 4) {
        	var displayFormat = this.displayValue.substring(1);
            xFormat = Rui.util.LDateLocale[sLocale][displayFormat];
        } else xFormat = this.displayValue;
        return xFormat;
    },
    _setWidth: function(type, args, obj) {
        if(args[0] < 0) return;
        Rui.ui.form.LDateBox.superclass._setWidth.call(this, type, args, obj);
        if(this.iconEl){
            this.getDisplayEl().setWidth(this.getContentWidth() - (this.iconEl.getWidth() || this.iconWidth) - this.iconMarginLeft);
        }
    },
    _setDisabled: function(type, args, obj) {
        if(args[0] === false) this.pickerOn();
        else this.pickerOff();
        Rui.ui.form.LDateBox.superclass._setDisabled.call(this, type, args, obj);
    },
    setValue: function(oDate, ignore){
        var bDate = oDate;
        if(typeof oDate === 'string'){
        	if(oDate && Rui.isString(oDate) && Rui.platform.isMobile === true) {
        		oDate = oDate.replace(/-/g, '');
        		oDate = Rui.util.LString.toDate(oDate, '%Y%m%d');
        	} else {
            	oDate = (oDate.length == 8 || oDate.length == 14 || Rui.util.LString.isHangul(oDate)) ? oDate : this.getUnmaskValue(oDate);
                if(!Rui.isEmpty(oDate)) oDate = (this.localeMask) ? this.getDate(bDate) : this.getDate(oDate);
                else oDate = null;
        	}
        }
        if (oDate === false) {
        	var invalidMsg = Rui.getMessageManager().get('$.base.msg016');
        	Rui.util.LDom.toast(invalidMsg, this.el.dom);
        	this.invalid(invalidMsg);
            this.getDisplayEl().dom.value = this.lastDisplayValue || '';
        } else {
            var hiddenValue = oDate === null ? '' : this.getDateString(oDate, this.valueFormat);
            var displayValue = oDate === null ? '' : this.getDateString(oDate);
            if(this.localeMask) {
                displayValue = this.getDateString(oDate, this.getLocaleFormat());
            } else {
            	if(Rui.platform.isMobile && oDate)
            		this.getDisplayEl().dom.value = oDate.format('%Y-%m-%d');
            	else
            		this.getDisplayEl().dom.value = displayValue;
                displayValue = this.checkValue().displayValue;
            }
            if(Rui.platform.isMobile) displayValue = this.getDisplayEl().dom.value;
            this.getDisplayEl().dom.value = displayValue;
            if (this.hiddenInputEl.dom.value !== hiddenValue) {
                this.hiddenInputEl.setValue(hiddenValue);
                this.lastDisplayValue = displayValue;
                if(ignore !== true) {
                    this.fireEvent('changed', {
                        target: this,
                        value: this.getValue(),
                        displayValue: this.getDisplayValue()
                    });
                }
            }
        }
    },
    getValue: function(){
        var value = Rui.ui.form.LDateBox.superclass.getValue.call(this);
        var oDate = null;
        if(this.localeMask) {
        	format = this.displayValue != '%x' ? Rui.util.LString.replaceAll(this.displayValue, this.displayValueSep, '') : '%q';
            oDate = Rui.util.LFormat.stringToDate(value,{format: format});
        } else oDate = this.getDate(value);
        return this.dateType == 'date' ? (oDate ? oDate : this.getEmptyValue(value)) : this.getDateString(oDate, this.valueFormat);
    },
    hide: function(anim) {
        if(this.calendar)
            this.calendar.hide();
        Rui.ui.form.LDateBox.superclass.hide.call(this,anim);
    },
    destroy: function() {
        if(this.iconEl) {
            this.iconEl.remove();
            delete this.iconEl;
        }
        if(this.calendar) this.calendar.destroy();
        Rui.ui.form.LDateBox.superclass.destroy.call(this);
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