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
Rui.namespace('Rui.ui.form');
Rui.ui.form.LCheckBox = function(config){
    config = Rui.applyIf(config || {}, Rui.getConfig().getFirst('$.ext.checkBox.defaultProperties'));
    Rui.ui.form.LCheckBox.superclass.constructor.call(this, config);
};
Rui.extend(Rui.ui.form.LCheckBox, Rui.ui.form.LField, {
    otype: 'Rui.ui.form.LCheckBox',
    CSS_BASE: 'L-checkbox',
    label: '',
    value: null,
    checked: false,
    bindValues: null,
    bindFn: null,
    gridFixed: false, 
    initDefaultConfig: function() {
        Rui.ui.form.LCheckBox.superclass.initDefaultConfig.call(this);
        this.cfg.addProperty('checked', {
            handler: this._setChecked
        });
    },
    initComponent: function(config){
        Rui.ui.form.LCheckBox.superclass.initComponent.call(this);
        if(this.gridFixed) this.beforeRenderer = this.gridFixedRenderer;
    },
    createContainer: function(parentNode) {
        if(this.el) {
            if(this.el.dom.tagName == 'INPUT') {
                var Dom = Rui.util.LDom;
                var dom = this.el.dom;
                this.id = this.id || this.el.id;
                if(this.checked === false) {
                    this.cfg.setProperty('checked', dom.checked);
                    this.checked = dom.checked;
                }
                this.name = this.name || dom.name;
                this.value = this.value || dom.value;
                var parent = this.el.parent();
                this.el = Rui.get(this.createElement().cloneNode(false));
                this.el.dom.id = this.id;
                Dom.replaceChild(this.el.dom, dom);
                this.el.appendChild(dom);
                Dom.removeNode(dom);
                this.el.dom.id = dom.id;
            }
        }
        Rui.ui.form.LCheckBox.superclass.createContainer.call(this, parentNode);
    },
    doRender: function(appendToNode) {
        this.createTemplate();
        this.el.addClass(this.CSS_BASE + '-panel');
        this.el.addClass('L-fixed');
        this.el.addClass('L-form-field');
        if(this.width)
            this.el.setWidth(!Rui.isBorderBox ? this.width - 1 : this.width - 2);
        var html = this.getRenderBody();
        this.el.html(html);
        var input = this.el.select('input').getAt(0).dom;
        if (this.attrs) for (var m in this.attrs) input[m] = this.attrs[m];
        var displayEl = this.getDisplayEl();
        var keyEventName = Rui.browser.msie || Rui.browser.chrome || (Rui.browser.safari && Rui.browser.version == 3) ? 'keydown' : 'keypress';
        displayEl.on(keyEventName, this.onFireKey, this, true);
        input.instance = this;
        input.className = 'L-instance';
    },
    gridBindEvent: function(gridPanel) {
        if(gridPanel && this.gridFixed == true && gridPanel.isExcel !== true) {
            gridPanel.on('beforeEdit', this.onBeforeEdit, this, true);
            gridPanel.on('cellClick', this.onCellClick, this, true);
            gridPanel.on('keypress', this.onCellKeypress, this, true);
        }
    },
    gridUnBindEvent: function(gridPanel) {
        if(gridPanel && this.gridFixed == true && gridPanel.isExcel !== true) {
            gridPanel.unOn('beforeEdit', this.onBeforeEdit, this);
            gridPanel.unOn('cellClick', this.onCellClick, this);
            gridPanel.unOn('keypress', this.onCellKeypress, this);
        }
    },
    createTemplate: function() {
        var ts = this.templates || {};
        ts.input = new Rui.LTemplate('<input id="{id}" type="checkbox" name="{name}" class="' + this.CSS_BASE + '" style="{style}" value="{value}" {checked} />');
        ts.label = new Rui.LTemplate('<label for="{id}" class="L-label">{label}</label>');
        this.templates = ts;
    },
    getRenderBody: function() {
        var ts = this.templates || {},
            html, p;
        p = {
            id: Rui.id(this.el, 'LCheckBox-' + this.id),
            name: this.name || this.id,
            value: this.value,
            label: this.label,
            checked: this.checked ? 'checked=""' : ''
        };
        html = ts.input.apply(p);
        if(this.label){
            html += ts.label.apply(p);
        }
        return html;
    },
    afterRender: function(container) {
        Rui.ui.form.LCheckBox.superclass.afterRender.call(this, container);
        this.getDisplayEl().dom.checked = this.cfg.getProperty('checked');
        this.el.on('click', function(e) {
            this.getDisplayEl().focus();
            Rui.util.LEvent.stopPropagation(e);
        }, this, true);
        var displayEl = this.getDisplayEl();
        if(displayEl) {
            displayEl.on('focus', this.onCheckFocus, this, true);
            displayEl.on('click', this.onClick, this, true);
        }
        if(Rui.useAccessibility()){
            this.el.setAttribute('role', 'checkbox');
            this.el.setAttribute('aria-checked', false);
            this.el.setAttribute('aria-describedby', 'checkbox ' + (this.name ? this.name:this.id));
        }
    },
    getDisplayEl: function() {
        if(!this.displayEl && this.el) {
            this.displayEl = this.el.select('input').getAt(0);
            this.displayEl.addClass('L-display-field');
        }
        return this.displayEl;
    },
    focus: function() {
        this.getDisplayEl().focus();
        return this;
    },
    blur: function() {
        this.getDisplayEl().blur();
        return this;
    },
    setValue: function(val) {
    	var ignoreEvent = false; 
        var checked = (Rui.isBoolean(val)) ? val : (this.bindValues) ? this.bindValues[0] == val ? true : false : (Rui.isEmpty(val) == false && this.getRawValue() == val ? true:false);
        if(ignoreEvent !== true) this.cfg.setProperty('checked', checked);
        return this;
    },
    getValue: function() {
        if(this.groupInstance) {
            return this.groupInstance.getValue();
        } else {
            var checked = this.cfg.getProperty('checked');
            return (this.bindFn) ? this.bindFn.call(this, checked) : (this.bindValues ? this.bindValues[checked ? 0 : 1] : this.getRawValue());
        }
    },
    isChecked: function(){
    	return this.cfg.getProperty('checked');
    },
    setChecked: function(isChecked) {
        this.cfg.setProperty('checked', isChecked);
        return this;
    },
    getRawValue: function() {
        if(this.cfg.getProperty('checked')) return this.getDisplayEl().getValue();
        else return '';
    },
    _setChecked: function(type, args, obj) {
        var val = args[0];
        if(this._rendered)
        	this.getDisplayEl().dom.checked = val;
        if(val) this.el.addClass('L-checked');
        else this.el.removeClass('L-checked');
        if (Rui.useAccessibility()) this.el.dom.setAttribute('aria-checked', val);
        this.fireEvent('changed', {target:this, value:val});
    },
    _setDisabled: function(type, args, obj) {
        if(args[0] === false) {
            this.el.removeClass('L-disabled');
            this.getDisplayEl().dom.disabled = false;
            this.fireEvent('enable');
        } else {
            this.el.addClass('L-disabled');
            this.getDisplayEl().dom.disabled = true;
            this.fireEvent('disable');
        }
    },
    onFocus: function(e) {
        Rui.ui.form.LCheckBox.superclass.onFocus.call(this, e);
        this.doFocus();
    },
    doFocus: function(e) {
        Rui.util.LEvent.addListener(Rui.browser.msie ? document.body : document, 'mousedown', this.deferOnBlur, this, true);
    },
    onBlur: function(e) {
        if(this.cfg.getProperty('checked') != this.getDisplayEl().dom.checked)
            this.cfg.setProperty('checked', this.getDisplayEl().dom.checked);
        Rui.ui.form.LCheckBox.superclass.onBlur.call(this, e);
    },
    deferOnBlur: function(e) {
        Rui.util.LFunction.defer(this.onBlurContains, 10, this, [e]);
    },
    onBlurContains: function(e) {
        if(e.deferCancelBubble == true) return;
        var target = e.target;
        if (this.el.dom !== target && !this.el.isAncestor(target)) {
            Rui.util.LEvent.removeListener(Rui.browser.msie ? document.body : document, 'mousedown', this.deferOnBlur);
            this.onBlur(e);
            this.isFocus = null;
        } else 
            e.deferCancelBubble = true;
    },
    onClick: function(e) {
        this.cfg.setProperty('checked', e.target.checked);
        return this;
    },
    onCheckFocus: function(e) {
        if(!this.isFocus) {
            this.doFocus(this, e);
            this.isFocus = true;
        }
    },
    onBeforeEdit : function(e) {
        if(e.colId == this.gridFieldId) return false;
    },
    onCellClick : function(e) {
    	if(e.event.shiftKey || e.event.ctrlKey || e.event.altKey) return;
    	var gridPanel = this.gridPanel, view = gridPanel.getView();
        var sm = gridPanel.getSelectionModel();
        if(sm.isLocked()) return;
        var column = gridPanel.columnModel.getColumnById(e.colId);
        if(column.editable !== true) return;
        var view = gridPanel.getView();
        var cm = view.getColumnModel();
        if(gridPanel.dataSet.getRow() != e.row) return;
        var cellDom = view.getCellDom(e.row, e.col);
        if(!cellDom) return;
        var cellEl = Rui.get(cellDom);
        if(!cellEl.hasClass('L-grid-cell-editable')) return;
        if(column.getId() == this.gridFieldId) {
            var dataSet = view.getDataSet();
            if(this.bindValues[0] == dataSet.getNameValue(e.row, column.getField()))
                dataSet.setNameValue(e.row, column.getField(), this.bindValues[1]);
            else dataSet.setNameValue(e.row, column.getField(), this.bindValues[0]);
            Rui.util.LEvent.stopEvent(e);
        }
    },
    onCellKeypress: function(e) {
        if((e.which || e.keyCode) == Rui.util.LKey.KEY.SPACE) {
            var gridPanel = this.gridPanel, view = gridPanel.getView();
            var sm = gridPanel.getSelectionModel(), col = sm.getCol(), cm = view.getColumnModel();
            if(sm.isLocked()) return;
            var column = cm.getColumnAt(col, true);
            if(!column || column.id != this.gridFieldId || column.editable == false) return;
            var gridColumn = cm.getColumnById(this.gridFieldId);
            var dataSet = view.getDataSet();
            var row = dataSet.getRow();
            if(this.bindValues[0] == dataSet.getNameValue(row, gridColumn.getField()))
                dataSet.setNameValue(row, gridColumn.getField(), this.bindValues[1]);
            else dataSet.setNameValue(row, gridColumn.getField(), this.bindValues[0]);
            Rui.util.LEvent.stopEvent(e);
        }
    },
    gridFixedRenderer : function(value, p, record, row, colIndex){
        if(value == this.bindValues[0])
            p.css.push('L-grid-col-select-mark');
        return '<div class="L-grid-col-checkBox L-ignore-event"/>';
    },
    destroy: function() {
        if(this.getDisplayEl()) {
            this.displayEl.remove();
            delete this.displayEl;
        }
        Rui.ui.form.LCheckBox.superclass.destroy.call(this);
        return this;
    }
});
Rui.namespace('Rui.ui.form');
Rui.ui.form.LCheckBoxGroup = function(config){
    this.items = [];
    Rui.ui.form.LCheckBoxGroup.superclass.constructor.call(this, config);
};
Rui.extend(Rui.ui.form.LCheckBoxGroup, Rui.ui.form.LField, {
    otype: 'Rui.ui.form.LCheckBoxGroup',
    CSS_BASE: 'L-checkbox-group',
    items: null,
    width: null,
    checkContainBlur: true,
    initComponent: function(config){
        Rui.ui.form.LCheckBoxGroup.superclass.initComponent.call(this);
        this.name = this.name || Rui.id(this.el, 'LCheckBoxGrp-' + this.id);
    },
    doRender: function(appendToNode) {
        this.el.addClass(this.CSS_BASE);
        this.el.addClass('L-fixed');
        this.el.addClass('L-form-field');
        if (Rui.useAccessibility()) this.el.setAttribute('role', 'group');
        if(this.width) this.el.setWidth(!Rui.isBorderBox ? this.width - 1 : this.width - 2);
        Rui.util.LArray.each(this.items, function(item, i){
            if((item instanceof Rui.ui.form.LCheckBox) == false) {
                item.name = this.name;
                item.id = item.id || item.value;
                item = new Rui.ui.form.LCheckBox(item);
                this.items[i] = item;
            }
            item.render(this.el.dom);
        }, this);
    },
    afterRender: function(container) {
        Rui.ui.form.LCheckBoxGroup.superclass.afterRender.call(this, container);
        this.el.on('click', function(e){
            if(this.items.length > 0)
                this.items[0].focus();
            Rui.util.LEvent.stopPropagation(e);
        }, this, true);
        Rui.util.LArray.each(this.items, function(item){
        	item.unOn('changed', this.onChanged, this);
        	item.unOn('focus', this.onItemFocus, this);
        	item.unOn('blur', this.onItemBlur, this);
            item.on('changed', this.onChanged, this, true);
            item.on('focus', this.onItemFocus, this, true);
            item.on('blur', this.onItemBlur, this, true);
        }, this);
    },
    invoke: function(fn, args){
        var els = this.items;
        Rui.each(els, function(e) {
            Rui.ui.form.LCheckBox.prototype[fn].apply(e, args);
        }, this);
        return this;
    },
    onChanged: function(e) {
        this.fireEvent('changed', e);
    },
    onItemFocus: function(e) {
        if(!this.isFocus) {
            this.doFocus(this, e);
            this.isFocus = true;
        }
    },
    doFocus: function(e) {
        this.onFocus(e);
        Rui.util.LEvent.addListener(Rui.browser.msie ? document.body : document, 'mousedown', this.deferOnBlur, this, true);
    },
    onItemBlur: function(e) {
    	this.deferOnBlur(e);
    },
    deferOnBlur: function(e) {
        Rui.util.LFunction.defer(this.onBlurContains, 10, this, [e]);
    },
    onBlurContains: function(e) {
        var target = e.target;
        if(e.deferCancelBubble == true) return;
        if(this.el.dom !== target && !this.el.isAncestor(target)) {
            Rui.util.LEvent.removeListener(Rui.browser.msie ? document.body : document, 'mousedown', this.deferOnBlur);
            this.onBlur(e);
            this.isFocus = null;
        } else
            e.deferCancelBubble = true;
    },
    _setDisabled: function(type, args, obj) {
        if(args[0] === false) {
            Rui.util.LArray.each(this.items, function(item){
                item.enable();
            }, this);
        } else {
            Rui.util.LArray.each(this.items, function(item){
                item.disable();
            }, this);
        }
    },
    focus: function() {
        if(this.items.length > 0) this.items[0].focus();
        return this;
    },
    setValue: function(val) {
    	var ignoreEvent = false; ; 
        Rui.util.LArray.each(this.items, function(item){
            item.setValue(val, ignoreEvent);
        }, this);
        return this;
    },
    getValue: function() {
        var val = [];
        Rui.util.LArray.each(this.items, function(item){
            val.push(item.getValue());
        }, this);
        return val;
    },
    getItem: function(idx) {
        return this.items[idx];
    },
    destroy: function() {
        Rui.ui.form.LCheckBoxGroup.superclass.destroy.call(this);
        return this;
    }
});
(function(){
    var CbProto = Rui.ui.form.LCheckBox.prototype,
        CbgProto = Rui.ui.form.LCheckBoxGroup.prototype;
    for (var fnName in CbProto){
        if(Rui.isFunction(CbProto[fnName])){
            (function(fnName){
                CbgProto[fnName] = CbgProto[fnName] || function(){
                    return this.invoke(fnName, arguments);
                };
            }).call(CbgProto, fnName);
        }
    };
})();
Rui.namespace('Rui.ui.form');
Rui.ui.form.LRadio = function(config){
    config = Rui.applyIf(config || {}, Rui.getConfig().getFirst('$.ext.radio.defaultProperties'));
    Rui.applyObject(this, config, true);
    Rui.ui.form.LRadio.superclass.constructor.call(this, config);
};
Rui.extend(Rui.ui.form.LRadio, Rui.ui.form.LCheckBox, {
    otype: 'Rui.ui.form.LRadio',
    CSS_BASE: 'L-radio',
    checkContainBlur: true,
    createTemplate: function() {
        var ts = this.templates || {};
        ts.input = new Rui.LTemplate('<input id="{id}" type="radio" name="{name}" class="' + this.CSS_BASE + ' L-fixed " style="{style}" value="{value}" {checked} />');
        ts.label = new Rui.LTemplate('<label for="{id}" class="L-label">{label}</label>');
        this.templates = ts;
    },
    afterRender: function(container) {
        Rui.ui.form.LRadio.superclass.afterRender.call(this, container);
        if(Rui.useAccessibility()){
            this.el.setAttribute('role', 'radio');
            this.el.setAttribute('aria-checked', false);
            this.el.setAttribute('aria-describedby', 'radio ' + (this.label ? this.label : this.id));
        }
    }
});
Rui.namespace('Rui.ui.form');
Rui.ui.form.LRadioGroup = function(config){
    Rui.ui.form.LRadioGroup.superclass.constructor.call(this, config);
};
Rui.extend(Rui.ui.form.LRadioGroup, Rui.ui.form.LCheckBoxGroup, {
    otype: 'Rui.ui.form.LRadioGroup',
    CSS_BASE: 'L-radio-group',
    checkContainBlur: true,
    initEvents: function() {
        Rui.ui.form.LRadioGroup.superclass.initEvents.call(this);
        var seq = 1;
        Rui.util.LArray.each(this.items, function(item, i){
            if((item instanceof Rui.ui.form.LRadio) == false) {
                item.name = this.name;
                item.id = this.name + '' + seq++;
                item = new Rui.ui.form.LRadio(item);
                this.items[i] = item;
            }
            item.groupInstance = this;
            item.on('specialkey', this._onSpecialkey, this, true);
        }, this);
    },
    doRender: function(appendToNode) {
        this.el.addClass(this.CSS_BASE);
        this.el.addClass('L-fixed');
        this.el.addClass('L-form-field');
        if (Rui.useAccessibility()) this.el.setAttribute('role', 'radiogroup');
        if(this.width) this.el.setWidth(!Rui.isBorderBox ? this.width - 5 : this.width - 2);
        Rui.util.LArray.each(this.items, function(item){
        	if(item._rendered) {
        		this.el.appendChild(item.el);
        	} else
        		item.render(this.el.dom);
        }, this);
    },
    clearAllChecked: function(ignoreEvent) {
        Rui.util.LArray.each(this.items, function(item, i){
            item.setValue(false, ignoreEvent);
        }, this);
        return this;
    },
    onChanged: function(e) {
        var item = this.getCheckedItem();
        var target = e.target;
        Rui.util.LArray.each(this.items, function(item){
            if(item !== target) {
                item.checked = false;
                item.el.removeClass('L-checked');
                if (Rui.useAccessibility()) item.el.setAttribute('aria-checked', false);
            }
        }, this);
        if(item == null || e.target == item) {
        	e.target = this;
        	Rui.ui.form.LRadioGroup.superclass.onChanged.call(this, e);
        }
    },
    getCheckedItem: function() {
        var checkedItem = null;
        Rui.util.LArray.each(this.items, function(item, i){
            if(item.getDisplayEl().dom.checked === true) {
                checkedItem = item;
                return false;
            }
        }, this);
        return checkedItem;
    },
    getCheckedIndex: function() {
        var idx = -1;
        Rui.util.LArray.each(this.items, function(item, i){
            if(item.getDisplayEl().dom.checked === true) {
                idx = i;
                return false;
            }
        }, this);
        return idx;
    },
    setCheckedIndex: function(idx) {
        if(this.items.length < idx) return;
        this.items[idx].setChecked(true);
        return this;
    },
    setValue: function(val) {
    	var ignoreEvent = false; 
        var radio = this.getRadioElByVal(val);
        if (radio == null) {
            this.clearAllChecked(ignoreEvent);
            return;
        } else {
            for (var i = 0 ; i < this.items.length ; i++) {
                if(this.items[i] == radio) {
                    this.items[i].setValue(true, ignoreEvent);
                } else {
                    this.items[i].setValue(false, ignoreEvent);
                }
            }
        }
        return this;
    },
    getValue: function() {
        var item = this.getCheckedItem();
        return (item != null) ? item.getRawValue() : null;
    },
    getRadioElByVal: function(val) {
        var retItem = null;
        Rui.util.LArray.each(this.items, function(item, i){
            if(item.getDisplayEl().dom.value == val) {
                retItem = item;
                return false;
            }
        }, this);
        return retItem;
    },
    before: function() {
        var idx = this.getCheckedIndex();
        if(idx < 1) return;
        this.setCheckedIndex(--idx);
        return this;
    },
    next: function() {
        var idx = this.getCheckedIndex();
        if(idx >= this.items.length - 1) return;
        this.setCheckedIndex(++idx);
        return this;
    },
    _onSpecialkey: function(e) {
        var KEY = Rui.util.LKey.KEY;
        if (e.keyCode == KEY.LEFT) {
            this.before();
            Rui.util.LEvent.stopEvent(e);
            return false;
        } else if (e.keyCode == KEY.RIGHT) {
            this.next();
            Rui.util.LEvent.stopEvent(e);
            return false;
        }
        this.onFireKey(e);
    },
    gridFixedRenderer : function(val, p, record){
        var html = '<div class="L-radio-panel L-fixed L-form-field">';
        Rui.util.LArray.each(this.items, function(item, i){
            html += '<div class="L-radio-group L-fixed L-form-field">';
            var chk = (val == item.value) ? 'checked' : '';
            html += '<input type="radio" class="' + this.CSS_BASE + '" value="' + item.value + '" ' + chk + ' />'
                  + '<label>' + item.label + '</label></div>';        
        }, this);
        return html+ '</div>';
    }
});
(function(){
    var CbProto = Rui.ui.form.LRadio.prototype,
        groupProto = Rui.ui.form.LRadioGroup.prototype;
    for (var fnName in CbProto){
        if(Rui.isFunction(CbProto[fnName])){
            (function(fnName){
                groupProto[fnName] = groupProto[fnName] || function(){
                    return this.invoke(fnName, arguments);
                };
            }).call(groupProto, fnName);
        }
    };
})();
Rui.namespace('Rui.ui.form');
Rui.ui.form.LTextArea = function(config){
    config = Rui.applyIf(config || {}, Rui.getConfig().getFirst('$.ext.textArea.defaultProperties'));
    Rui.ui.form.LTextArea.superclass.constructor.call(this, config);
};
Rui.extend(Rui.ui.form.LTextArea, Rui.ui.form.LTextBox, {
    otype: 'Rui.ui.form.LTextArea',
    CSS_BASE: 'L-textarea',
    width: 180,
    multiLine: true,
    initEvents: function() {
        Rui.ui.form.LTextArea.superclass.initEvents.call(this);
        this.on('specialkey', this._onSpecialkey, this, true);
    },
    createContainer: function(parentNode){
        if(this.el) {
            if(this.el.dom.tagName == 'TEXTAREA') {
                this.id = this.id || this.el.id;
                this.oldDom = this.el.dom;
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
                this.attrs.value = this.oldDom.value;
                this.name = this.name || this.oldDom.name;
                var parent = this.el.parent();
                this.el = Rui.get(this.createElement().cloneNode(false));
                this.el.dom.id = this.id;
                Rui.util.LDom.replaceChild(this.el.dom, this.oldDom);
                this.el.appendChild(this.oldDom);
                Rui.util.LDom.removeNode(this.oldDom);
                delete this.oldDom;
            }
        }
        Rui.ui.form.LTextArea.superclass.createContainer.call(this, parentNode);
    },
    createTemplate: function(el) {
        var elContainer = Rui.get(el);
        elContainer.addClass(this.CSS_BASE);
        elContainer.addClass('L-fixed');
        elContainer.addClass('L-form-field');
        var input = document.createElement('textarea');
        if(this.autoComplete) input.autocomplete = 'off';
        for (var key in this.attrs){
            if(key == 'value') input.value = this.attrs.value;
            else input.setAttribute(key, this.attrs[key]);
        }
        input.id = Rui.useFixedId() ? Rui.id(this.el, 'LTextArea-' + this.id) : Rui.id();
        input.name = this.name || input.name || this.id;
        elContainer.appendChild(input);
        this.inputEl = Rui.get(input);
        this.inputEl.addClass('L-display-field');
        return elContainer;
    },
    _onSpecialkey: function(e) {
        var k = Rui.util.LKey.KEY;
        switch (e.keyCode) {
            case k.DOWN:
            case k.UP:
            case k.LEFT:
            case k.RIGHT:
                Rui.util.LEvent.stopPropagation(e);
                return false;
                break;
        }
    },
    onKeyup: function(e) {
        var KEY = Rui.util.LKey.KEY;
        if( e.keyCode == KEY.DOWN || e.keyCode == KEY.UP){
            Rui.util.LEvent.stopEvent(e); return;
        } else if(e.keyCode == KEY.TAB){
            this.onFocus();
            this.fireEvent('keydown', e); return;
        }
        this.fireEvent('keyup', e);
    },
    _setHeight: function(type, args, obj) {
        Rui.ui.form.LTextArea.superclass._setHeight.call(this, type, args, obj);
        if(Rui.browser.msie) 
            this.getDisplayEl().setStyle('line-height', '');
    },
    getRenderBody: function() {
        var ts = this.templates || {};
        var p = {
            id: Rui.id(),
            name: this.name || this.id,
            value: this.value || ''
        };
        return ts.apply(p);
    },
    getDisplayEl: function() {
        if(!this.displayEl && this.el)
            this.displayEl = this.el.select('textarea').getAt(0);
        return this.displayEl;
    },
    onFireKey: function(e){
        if(Rui.util.LEvent.isSpecialKey(e) && e.keyCode != Rui.util.LKey.KEY.ENTER)
            this.fireEvent('specialkey', e);
    }
});
Rui.namespace('Rui.ui.form');
(function(){
    var DL = Rui.util.LDom;
    var ST = Rui.util.LString;
Rui.ui.form.LNumberBox = function(config){
    config = Rui.applyIf(config ||{}, Rui.getConfig().getFirst('$.ext.numberBox.defaultProperties'));
    Rui.ui.form.LNumberBox.superclass.constructor.call(this, config);
};
Rui.extend(Rui.ui.form.LNumberBox, Rui.ui.form.LTextBox, {
    otype: 'Rui.ui.form.LNumberBox',
    CSS_BASE: 'L-numberbox',
    includeChars: '0123456789',
    decimalPrecision: -1,
    dummyDecimalPrecision: -1,
    minValue: null,
    maxValue: null,
    thousandsSeparator: ',',
    decimalSeparator: '.',
    checkContainBlur: false,
    specialKeypress: false,
    ctrlKeypress: false,
    filterKey: true,
    progress: false,
    constValue: null,
    caretPos: 0,
    selectedText: '',
    caretS: 0,
    caretE: 0,
    emptyValue: null,
    isCurrency: true,
    initComponent: function(config) {
        if(this.decimalPrecision != 0)
            this.includeChars += this.decimalSeparator;
        if(this.minValue != null && this.minValue < 0)
            this.includeChars += '-';
        if(this.isCurrency)
            this.includeChars += this.thousandsSeparator;
    },
    createTemplate: function(el) {
    	var elContainer = Rui.ui.form.LNumberBox.superclass.createTemplate.call(this, el);
    	if(Rui.platform.isMobile) this.inputEl.dom.type = 'number';
    	if(this.maxValue != null) this.inputEl.dom.max = this.maxValue;
    	if(this.minValue != null) this.inputEl.dom.min = this.minValue;
        return elContainer;
    },
    doRender: function(){
        this.createTemplate(this.el);
        var hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = this.name || this.id;
        hiddenInput.instance = this;
        hiddenInput.className = 'L-instance L-hidden-field';
        this.el.appendChild(hiddenInput);
        this.hiddenInputEl = Rui.get(hiddenInput);
        this.hiddenInputEl.addClass('L-hidden-field');
        this.inputEl.removeAttribute('name');
        this.inputEl.setStyle('ime-mode', 'disabled'); 
    },
    isLimitValue: function(e) {
        if(this.mask != null)return false;
        if(this.getValue() == null) return false;
        if(this.maxValue == null && this.decimalPrecision < 1) return false;
        this.progress = false;
        this.constValue = null;
         var pos = DL.getSelectionStart(this.getDisplayEl().dom);
         var s = this.getDisplayEl().dom;
        if(Rui.browser.msie) pos = s.value.toString().length;
        var preCaret = s.value.substring(0, pos).replace(/ /g, '\xa0') || '\xa0';
        if(this.caretE == 0)
            return true;
        var prePos = preCaret.split(this.decimalSeparator);
        var maxLength = this.maxValue ? this.maxValue.toString().length : 20;
        if(this.maxValue < prePos[0] ){
            Rui.util.LEvent.stopEvent(e);
            e.returnValue = false;
            this.progress = true;
            this.constValue = s.value;
            return true;
        }
        if(this.maxValue <= s.value){
            Rui.util.LEvent.stopEvent(e);
            e.returnValue = false;
            this.progress = true;
            this.constValue = prePos[0];
            return true;
        }
        if( (pos == maxLength || pos > maxLength) && prePos.length < 2){
            Rui.util.LEvent.stopEvent(e);
            e.returnValue = false;
            this.progress = true;
            this.constValue = prePos[0];
            return true;
        }
        if(prePos.length < 2) {
            s.value = s.value + this.decimalSeparator + '0';
            Rui.util.LEvent.stopEvent(e);
            e.returnValue = false;
            this.constValue = s.value;
            return true;
        }
        if(this.decimalPrecision == 1){
            Rui.util.LEvent.stopEvent(e);
            e.returnValue = false;
            this.constValue =  prePos[0] + this.decimalSeparator;
            return true;
        }
        if(this.decimalPrecision >= prePos[1].length){
            Rui.util.LEvent.stopEvent(e);
            e.returnValue = false;
            this.constValue = s.value;
            return true;
        }
    },
    updatePos: function(o) {
    	if(Rui.platform.isMobile) return;
        var dl = DL.getSelectionInfo(o);
        if(dl == null)return;
        this.caretPos = dl.begin;
        this.selectedText = dl.selectedText;
        this.preText = dl.preText;
        this.afterText = dl.afterText;
        this.maxLength = dl.maxLength;
        this.caretS = dl.begin;
        this.caretE = dl.end;
    },
    onFilterKey: function(e) {
        if(!this.filterKey) return;
        if(this.cfg.getProperty('disabled') || this.cfg.getProperty('editable') != true) return;
        this.updatePos(this.getDisplayEl().dom);
        if(this.includeChars == null || this.includeChars == '') return;
        var KEY = Rui.util.LKey.KEY;
        if(e.shiftKey || e.altKey || e.ctrlKey){
            this.specialKeypress = true;
            if(e.keyCode == KEY.CONTROL) {
                this.ctrlKeypress = true;
                return;
            }
        }
        if(e.keyCode != KEY.SPACE && (Rui.util.LEvent.isSpecialKey(e) || e.keyCode == KEY.BACK_SPACE || e.keyCode == KEY.DELETE) || (e.ctrlKey === true && (e.keyCode === 70 || String.fromCharCode(e.keyCode) == 'V')))
            return;
        var c = e.charCode || e.which || e.keyCode;
        var charCode = this.fromCharCode(c);
        if(charCode == this.decimalSeparator){
        	if(this.decimalPrecision > -1 && this.decimalPrecision < 1) {
        		Rui.util.LEvent.stopEvent(e);
        		return;
        	}
            var v = this.getValue();
            if(v) String(v).replace(this.selectedText,charCode);
            return;
        }
        if(this.includeChars.indexOf(charCode) === -1){
            if( this.ctrlKeypress && (c == 65 || c == 67 || c== 86 || c == 88))return;
            if(c == 189 || c == 109 )
                if(this.caretPos == 0)return; 
            Rui.util.LEvent.stopEvent(e);
            e.returnValue = false;
        } else{
            if(c == 189 || c == 109 ){
                if(this.caretPos == 0)return; 
                else if(this.caretPos > 0){
                    Rui.util.LEvent.stopEvent(e);
                     e.returnValue = false;
                     return;
                }
            }
            if(this.mask != null) return;
            if(charCode == this.decimalSeparator){
            	if(this.decimalPrecision > -1 && this.decimalPrecision < 1) {
            		Rui.util.LEvent.stopEvent(e);
            		return;
            	}
                var s = this.getDisplayEl().dom;
                this.setCaret(s.value.length+1);
                return;
            }
            if(this.isCurrency && charCode == this.thousandsSeparator) return;
            if(this.preText === undefined) return;
            var preDiv = this.preText.split(this.decimalSeparator);
            if(preDiv.length == 0) return;
            if(this.selectedText.trim().length == 0 && preDiv.length > 1 && preDiv[1].length != this.decimalPrecision){
                var decimalValue = this.getDisplayEl().dom.value.split(this.decimalSeparator)[1];
                if(decimalValue.length != this.decimalPrecision) return;
            }
            if(preDiv.length < 2) return;
            if(this.decimalPrecision > 0) {
                this.arrangeValues(e,charCode);
            }
         }
     },
     onKeypress: function(e) {
        if(!this.filterKey) return;
        var KEY = Rui.util.LKey.KEY;
        var c = e.charCode || e.which || e.keyCode;
        var s = this.getDisplayEl().dom;
        if(c == KEY.BACK_SPACE || (!this.specialKeypress && c == 37) || c == 39 || c == 45 || c == 46 ){
            if(c == 46) {
                if(s.value.indexOf(this.decimalSeparator) > -1) {
                	Rui.util.LEvent.stopEvent(e);
                    return;
                }
            }
            if(c == 46 && this.decimalPrecision > -1 && this.decimalPrecision < 1)
                Rui.util.LEvent.stopEvent(e);
            return;
        }
        if(c == 189 || c == 109) return;
        if(this.ctrlKeypress && (c == 97 || c == 99 || c == 118 || c == 120)) return;
        if(c == 189 || c == 109)return; 
        var k =  String.fromCharCode(c);
        if(k == this.decimalSeparator) {
        	if(s.value.indexOf(this.decimalSeparator) > -1 || s.value == '')
         		Rui.util.LEvent.stopEvent(e);
        }
        var pattern = new RegExp('[0-9\\' + this.decimalSeparator + (this.isCurrency?this.thousandsSeparator:'') + ']');
        if(!pattern.test(k))
        	Rui.util.LEvent.stopEvent(e);
     },
     onKeyup: function(e) {
        if(!this.filterKey) return;
        var KEY = Rui.util.LKey.KEY;
        if(Rui.util.LEvent.isSpecialKey(e)){
           if(e.keyCode == KEY.SHIFT || e.keyCode == KEY.ALT || e.keyCode == KEY.CONTROL){
               this.specialKeypress = false;
               if(e.keyCode == KEY.CONTROL){
                  this.ctrlKeypress = false;
               }
           }
            this.fireEvent('keyup', e); 
            return;
        }
        var c = e.charCode || e.which || e.keyCode;
        var charCode = this.fromCharCode(c);
        var s = this.getValue();
        if(this.includeChars.indexOf(charCode) === -1){
            if( this.ctrlKeypress && (c == 65 || c == 67 || c== 86 || c == 88))return;
            if(c == 189 || c == 109)return; 
         	    var txt = (s + '').replace(/[\ㄱ-ㅎ가-힣]/g, '');
                if(txt != s)
                    this.setValue(txt);
                var displayEl = this.getDisplayEl();
                if(ST.isHangul(displayEl.getValue()))
                    displayEl.setValue(ST.getSkipHangulChar(displayEl.getValue()));
            Rui.util.LEvent.stopEvent(e);
            e.returnValue = false;
            return;
        } else{
            if(c == 189 || c == 109) return;
        }
        this.fireEvent('keyup', e);
     },
    arrangeValues: function(e,charCode){
        var s = this.getDisplayEl().dom;
        if(s.value == '') return;
        s.value = s.value.toString();
        if(this.currFocus){
            if(s.value != '-' && this.caretPos == 0
                    && this.caretS == 0 && this.caretE == 0
                    && this.afterText.length == 0)
                s.value = '';
            this.currFocus = false;
        }
        if(this.isLimitValue(e)){
            var sValue = s.value;
            if(sValue != null){
                if( this.caretPos <= sValue.length && ( this.caretPos != 0 || (this.caretS != this.caretE))){
                    this.selectedText  = this.selectedText;
                    this.preText = this.preText.replace(/^\xa0'*|\xa0'*$/g, '');
                    this.afterText = this.afterText.replace(/^\xa0'*|\xa0'*$/g, '');
                    if(this.caretS == 0 && (this.caretE-this.caretS) == 1  ){
                        if(this.preText == '')
                            s.value = charCode.toString() + this.afterText;
                        else
                            s.value = sValue.concat(charCode);
                        this.setCaret(this.caretE + 1);
                        this.caretPos = 0;
                        this.progress = false;
                        Rui.util.LEvent.stopEvent(e);
                         e.returnValue = false;
                        return;
                    } else if(this.caretPos !=0 && this.caretS > 0 && (this.caretS == this.caretE) ){
                        var preDiv = this.preText.split(this.decimalSeparator);
                        if(preDiv.length == 2 && preDiv[1].length == this.decimalPrecision)
                            s.value = s.value.substring(0,s.value.length-1) + charCode + this.afterText;
                        else{
                            var decimalValue = s.value.split(this.decimalSeparator)[1];
                            if(decimalValue.length != this.decimalPrecision) s.value = this.preText + charCode + this.afterText;
                            else s.value = this.preText + charCode + this.afterText.substring(1, this.afterText.length);
                        }
                        this.setCaret(this.caretE +1);
                        return;
                    } else
                    s.value = sValue.replace(/^\xa0'*|\xa0'*$/g, '');
                    if(this.caretS != this.caretE ){
                         s.value = this.preText + charCode + this.afterText;
                         this.setCaret(this.caretS + 1);
                    }
                    this.caretPos = 0;
                    this.progress = false;
                    return;
                } else if( this.caretE == 0){
                    s.value = charCode + this.afterText;
                    this.setCaret(this.caretE + 1);
                    this.progress = true;
                    Rui.util.LEvent.stopEvent(e);
                     e.returnValue = false;
                    return;
                }
                this.concatValues(s,sValue,charCode);
            }
        }
    },
    concatValues: function(s,sValue,charCode){
        var v;
        if(this.maxValue == this.constValue){
            s.value = this.constValue.substr(0,  this.constValue.length-1);
            v = s.value.concat(charCode);
            if(this.maxValue >= v ){
                s.value = v;
                this.progress = false;
            }
            else {
                s.value = this.maxValue;
                this.progress = false;
                return;
            }
        }
        else{
            if(Rui.browser.msie){
                s.value = this.constValue;
                this.caretPos = this.caretPos + 1;
            }
            else {s.value = sValue.substr(0, sValue.length-1);}
        }
        if(this.progress && this.decimalPrecision > 0){
            s.value = this.constValue.concat(this.decimalSeparator);
            v = s.value.concat(charCode);
        } else {v = s.value.concat(charCode);}
        s.value = v;
        this.progress = false;
    },
    afterRender: function(container) {
        Rui.ui.form.LNumberBox.superclass.afterRender.call(this, container);
        var inputEl = this.getDisplayEl();
        if(this.filterKey)
            inputEl.on('keydown', this.onFilterKey, this, true);
        if(this.mask && !Rui.platform.isMobile){
            inputEl.on('keydown', this.onKeyDownMask, this, true);
            inputEl.on('keypress', this.onKeyPressMask, this, true);
        }
    },
    validateValue: function(value) {
        if(value === this.lastValue) return true;
        value = String(value);
        var isValid = true;
        isValid = new Rui.validate.LNumberValidator({id: this.id}).validate(value);
        if(isValid == false) return false;
        if(!Rui.isUndefined(value) && !Rui.isNull(value))
            if(this.validateMaxValue(value) == false || this.validateMinValue(value) == false) return false;
        var pos = value.indexOf(this.decimalSeparator) || 0;
        if(pos > 0) {
            var dpValue = value.substring(pos + 1);
            if(this.decimalPrecision > 0 && dpValue.length > this.decimalPrecision) return false;
        }
        this.valid();
        return isValid;
    },
    validateMaxValue: function(value) {
        if(this.isNumberValue(value) == false) return false;
        if(this.maxValue != null && this.maxValue < value) {
            DL.toast(Rui.getMessageManager().get('$.base.msg012', [this.maxValue]), this.el.dom);
            this.setValue(this.lastValue, true);
            this.inputEl.focus();
            return false;
        }
        return true;
    },
    validateMinValue: function(value) {
        if(this.isNumberValue(value) == false) return false;
        if(this.minValue != null && this.minValue > value) {
            DL.toast(Rui.getMessageManager().get('$.base.msg011', [this.minValue]), this.el.dom);
            this.setValue(this.lastValue, true);
            this.inputEl.focus();
            return false;
        }
        return true;
    },
    isNumberValue: function(value) {
        if(Rui.isUndefined(value) || Rui.isNull(value) || value === false) return false;
        value = value == '' ? 0 : value;
        if(value != parseFloat(value, 10)) return false;
        return true;
    },
    validateCurrencyValue: function(value) {
        if(value === '') return true;
        var regExp = Rui.getMessageManager().get('$.core.currencyRegExp');
        if(value.match(regExp) === null){
            DL.toast(Rui.getMessageManager().get('$.base.msg143'), this.el.dom);
            return false;
        }
        return true;
    },
    getValue: function() {
        var val = Rui.ui.form.LNumberBox.superclass.getValue.call(this);
        val = typeof val === 'string' ? this.getNormalValue(val) : val;
        if(this.validateValue(val)) { 
            if(Rui.isUndefined(this.lastValue) || val == this.lastValue) {
                if(!Rui.isEmpty(val))
                    val = parseFloat(val, 10);
                return val;
            }
            if(Rui.isEmpty(val)) return this.getEmptyValue(val);
            if(val && this.decimalSeparator != '.')
                val = String(val).replace(this.decimalSeparator, '.');
            val = parseFloat(val, 10);
            this.hiddenInputEl.setValue(val);
        } else val = this.lastValue ? this.lastValue : this.getEmptyValue(val);
        return val;
    },
    getDecimalValue: function(value) {
        var newValue = value;
        var sValue = value + '';
        var pos = sValue.indexOf(this.decimalSeparator) || 0;
        if(pos > 0) {
            var dpValue = sValue.substring(pos + 1);
            if(this.decimalPrecision > 0 && dpValue.length > this.decimalPrecision)
                dpValue = dpValue.substring(0, this.decimalPrecision);
            dpValue = Rui.util.LString.rPad(dpValue, '0', this.decimalPrecision);
            newValue = (value+'').substring(0, pos + 1) + dpValue;
        } else newValue += this.decimalSeparator + ST.rPad('', '0', this.decimalPrecision > -1 ? this.decimalPrecision : 0);
        newValue = newValue.charAt(newValue.length - 1) == this.decimalSeparator ? newValue.substring(0, newValue.length - 1) : newValue;
        return newValue;
    },
    doChangedDisplayValue: function(o) {
        var val = String(o);
        val = this.getNormalValue(val);
        if(this.isNumberValue(val) || val === null || val === '') this.setValue(val);
    },
    setValue: function(val, ignore) {
        if(Rui.isUndefined(val) == true) return;
        val = Rui.isNull(val) ? '' : val;
        if(this.validateValue(val)) {
            this.hiddenInputEl.setValue(val);
            var displayValue = val;
            if(!Rui.isEmpty(displayValue)) {
                displayValue = String(displayValue)
                displayValue = this.getNormalValue(displayValue);
                if(this.thousandsSeparator || this.decimalSeparator) {
                    if(this.isCurrency) displayValue = Rui.util.LNumber.format(parseFloat(displayValue, 10), {thousandsSeparator: this.thousandsSeparator, decimalSeparator: this.decimalSeparator});
                    else displayValue = Rui.util.LNumber.format(parseFloat(displayValue, 10), {decimalSeparator: this.decimalSeparator});
                }
                if(this.decimalPrecision > 0)
                    displayValue = this.getDecimalValue(displayValue);
            }
        	this.getDisplayEl().setValue(Rui.platform.isMobile ? val : displayValue);
        	if(this.isFocus){
        		var byteLength = ST.getByteLength(displayValue);
        		this.setSelectionRange(0, byteLength);
        	}
        	if(ignore !== true) this.fireEvent('changed', {target:this, value:this.getValue(), displayValue:this.getDisplayValue()});
        }
        this.setPlaceholder();
    },
    onCanBlur: function(e) {
        var ret = Rui.ui.form.LNumberBox.superclass.onCanBlur.call(this, e);
    	var value = this.getDisplayEl().getValue();
        if(this.isCurrency) {
            if(this.validateCurrencyValue(value) == false) return false;
        }
        return ret;
    },
    getNormalValue: function(val) {
    	var r = Rui.util.LString.replaceAll(val, this.thousandsSeparator, '');
    	r = (r) ? r.replace(',', '.') : r;
    	return r;
    }
});
})();
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
Rui.ui.form.LTimeBox = function(config){
    config = Rui.applyIf(config || {}, Rui.getConfig().getFirst('$.ext.timeBox.defaultProperties'));
    Rui.ui.form.LTimeBox.superclass.constructor.call(this, config);
};
Rui.extend(Rui.ui.form.LTimeBox, Rui.ui.form.LTextBox, {
    otype: 'Rui.ui.form.LTimeBox',
    CSS_BASE: 'L-timebox',
    includeChars: '0123456789',
    mask: '99:99',
    width: 50,
    iconWidth: 9,
    iconMarginLeft: 1,
    iconTabIndex: 0,
    spinner: Rui.platform.isMobile ? false : true,
    checkContainBlur: Rui.platform.isMobile ? false : true,
    doRender: function(){
    	if(Rui.platform.isMobile) this.type = 'time';
        Rui.ui.form.LTimeBox.superclass.doRender.call(this);
        if(Rui.platform.isMobile) {
            var inputEl = this.getDisplayEl();
            inputEl.on('change', this.onChange, this, true, { system: true });
        }
        this.doRenderSpinner();
    },
    doRenderSpinner: function() {
        if(this.spinner !== true || Rui.platform.isMobile) return;
        var iconDiv = document.createElement('div');
        iconDiv.className = 'icon';
        iconDiv.id = Rui.useFixedId() ? Rui.id(this.el, 'LTimeBox-icon-' + this.id) : Rui.id();
        this.iconDivEl = Rui.get(iconDiv);
        this.el.appendChild(iconDiv);
        var spinUpDom = document.createElement('div');
        spinUpDom.className = 'L-spin-up';
        spinUpDom.id = Rui.useFixedId() ? Rui.id(this.el, 'LTimeBox-spinup-' + this.id) : Rui.id();
        this.spinUpEl = Rui.get(spinUpDom);
        this.iconDivEl.appendChild(spinUpDom);
        var spinDownDom = document.createElement('div');
        spinDownDom.id = Rui.useFixedId() ? Rui.id(this.el, 'LTimeBox-spindown-' + this.id) : Rui.id();
        spinDownDom.className = 'L-spin-down';
        this.spinDownEl = Rui.get(spinDownDom);
        this.iconDivEl.appendChild(spinDownDom);
    },
    spinnerOn: function(){
        if(!this.iconDivEl) return;
        this.spinUpEl.on('mousedown', this.onSpinUpMouseEvent, this, true);
        this.spinUpEl.on('mouseup', this.onSpinUpMouseEvent, this, true);
        this.spinDownEl.on('mousedown', this.onSpinDownMouseEvent, this, true);
        this.spinDownEl.on('mouseup', this.onSpinDownMouseEvent, this, true);
        this.spinUpEl.on('click', this.spinUp, this, true);
        this.spinDownEl.on('click', this.spinDown, this, true);
        this.spinUpEl.setStyle('cursor', 'pointer');
        this.spinDownEl.setStyle('cursor', 'pointer');
        if(this.iconTabIndex > -1) {
            this.spinUpEl.setAttribute('tabindex', '0');
            this.spinDownEl.setAttribute('tabindex', '0');
        }
    },
    spinnerOff: function(){
        if(!this.iconDivEl) return;
        this.spinUpEl.unOn('mousedown', this.onSpinUpMouseEvent, this);
        this.spinUpEl.unOn('mouseup', this.onSpinUpMouseEvent, this);
        this.spinDownEl.unOn('mousedown', this.onSpinDownMouseEvent, this);
        this.spinDownEl.unOn('mouseup', this.onSpinDownMouseEvent, this);
        this.spinUpEl.unOn('click', this.spinUp, this);
        this.spinDownEl.unOn('click', this.spinDown, this);
        this.spinUpEl.setStyle('cursor', 'default');
        this.spinDownEl.setStyle('cursor', 'default');
        if(this.iconTabIndex > -1) {
            this.spinUpEl.removeAttribute('tabindex');
            this.spinDownEl.removeAttribute('tabindex');
        }
    },
    onSpinUpMouseEvent: function(e){
        switch(e.type){
        case 'mousedown':
            this.spinUpEl.addClass('L-spin-up-click');
            return;
        case 'mouseup':
            this.spinUpEl.removeClass('L-spin-up-click');
            return;
        }
    },
    onSpinDownMouseEvent: function(e){
        switch(e.type){
        case 'mousedown':
            this.spinDownEl.addClass('L-spin-down-click');
            return;
        case 'mouseup':
            this.spinDownEl.removeClass('L-spin-down-click');
            return;
        }
    },
    onChange: function(e) {
    	var value = e.target.value;
    	this.setValue(value);
    },
    spinUp: function() {
        if(this.disabled || this.cfg.getProperty('editable') === false) return;
        var value = this.getValue() || '0000';
        value = value.replace(':', '');
        var hh = parseInt(value.substring(0, 2), 10);
        var mm = parseInt(value.substring(2, 4), 10);
        if(mm == 59) {
            hh = hh == 23 ? 0: (hh + 1);
            mm = 0;
        } else mm++;
        this.setValue(Rui.util.LString.lPad(hh, '0', 2) + Rui.util.LString.lPad(mm, '0', 2));
    },
    spinDown: function() {
        if(this.disabled || this.cfg.getProperty('editable') === false) return;
        var value = this.getValue() || '0000';
        value = value.replace(':', '');
        var hh = parseInt(value.substring(0, 2), 10);
        var mm = parseInt(value.substring(2, 4), 10);
        if(mm == 00) {
            hh = hh == 0 ? 23: (hh - 1);
            mm = 59;
        } else mm--;
        this.setValue(Rui.util.LString.lPad(hh, '0', 2) + Rui.util.LString.lPad(mm, '0', 2));
    },
    _setWidth: function(type, args, obj) {
    	if(args[0] < 0) return;
        Rui.ui.form.LTimeBox.superclass._setWidth.call(this, type, args, obj);
        if(this.iconDivEl){
            this.getDisplayEl().setWidth(this.getContentWidth() - (this.iconDivEl.getWidth() || this.iconWidth) - this.iconMarginLeft);
        }
    },
    _setDisabled: function(type, args, obj) {
        if(args[0] === false) {
            this.spinnerOn();
        } else {
            this.spinnerOff();
        }
        Rui.ui.form.LTimeBox.superclass._setDisabled.call(this, type, args, obj);
    },
    validateValue: function(val) {
        var r = Rui.isEmpty(val) ? true : Rui.util.LString.isTime(val);
        if(r == false){
        	Rui.util.LDom.toast(Rui.getMessageManager().get('$.base.msg040'), this.el.dom);
        	this.rollback();
        }
        return r;
    },
    rollback: function(){
    	this.setDisplayValue(this.lastDisplayValue);
    },
    setValue: function(val, ignoreEvent) {
    	if(val && Rui.platform.isMobile && val.indexOf(':') < 0)
    		val = val.substring(0, 2) + ':' + val.substring(2);
        Rui.ui.form.LTimeBox.superclass.setValue.call(this, val, ignoreEvent);
        var displayValue = this.getDisplayValue();
        if(displayValue && displayValue.length != 5)
            this.setDisplayValue(val.substring(0, 2) + ':' + val.substring(2, 4));
    },
    beforeRenderer: function(val, p, record, row, i) {
    	if(!val) return '';
    	if(val.indexOf(':') > 0) return val;
    	return val.substring(0, 2) + ':' + val.substring(2);
    }
});
