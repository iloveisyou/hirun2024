/*
 * @(#) LPopupTextBox-debug.js
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
 * 
 * (추가) Plugin 하위 목록에 포함된 파일의 경우 프로젝트에서 임의로 customizing 해서 사용 가능합니다.
 * 단, 프로젝트에서 customizing 한 사항은 기술지원 대상 범위에서 제외됩니다.
 * 
 */
/**
 * @description TextBox에 팝업아이콘을 생성하는 PopupTextBox (beta)
 * LTextBox의 모든 속성이 적용되지 않는다. (mask)
 * LMonthBox
 * @namespace Rui.ui.form
 * @plugin js,css
 * @class LPopupTextBox
 * @extends Rui.ui.form.LTextBox
 * @constructor LPopupTextBox
 * @param config {Object} The intial LPopupTextBox. 
 */
Rui.ui.form.LPopupTextBox = function(config){
    config = config || {};
    config = Rui.applyIf(config, Rui.getConfig().getFirst('$.ext.popupTextBox.defaultProperties'));
    Rui.ui.form.LPopupTextBox.superclass.constructor.call(this, config);
    /**
     * @description popup 메소드가 호출되면 수행하는 이벤트
     * @event popup
     */
    this.createEvent('popup');
};

Rui.extend(Rui.ui.form.LPopupTextBox, Rui.ui.form.LTextBox, {
    /**
     * @description 객체의 문자열
     * @property otype
     * @private
     * @type {String}
     */
    otype: 'Rui.ui.form.LPopupTextBox',
    /**
     * @description 기본 CSS명
     * @property CSS_BASE
     * @private
     * @type {String}
     */    
    CSS_BASE: 'L-popuptextbox',
    /**
     * @description Picker Icon의 width
     * 기본값은 20이며 CSS에서 icon width를 변경할 경우 이 값도 동일하게 변경하여야 합니다.
     * @config iconWidth
     * @type {int}
     * @default 20
     */
    /**
     * @description Picker Icon의 width
     * 기본값은 20이며 CSS에서 icon width를 변경할 경우 이 값도 동일하게 변경하여야 합니다.
     * @property iconWidth
     * @private
     * @type {int} 
     */ 
    iconWidth: 20,
    /**
     * @description input과 Picker Icon간의 간격
     * @config iconMarginLeft
     * @type {int}
     * @default 1
     */
    /**
     * @description input과 Picker Icon간의 간격
     * @property iconMarginLeft
     * @private
     * @type {int}
     */
    iconMarginLeft: 1,
    /**
     * @description input박스에 키 입력이 가능한지 여부, 변경이 불가능한 읽기 전용 속성은 LUIComponent에 있는 disabled로 처리
     * @config editable
     * @type {boolean}
     * @default true
     */
    /**
     * @description input박스에 키 입력이 가능한지 여부, 변경이 불가능한 읽기 전용 속성은 LUIComponent에 있는 disabled로 처리
     * @property editable
     * @private
     * @type {boolean}
     */
    editable: false,
    /**
     * @description blur시 contains 체크를 할지 여부
     * @property checkContainBlur
     * @private
     * @type {boolean}
     */
    checkContainBlur: true,
    /**
     * @description 내부에 hidden input 태그를 생성하여 출력용 필드와 구분하여 처리할지 여부를 결정한다.
     * @config useHiddenValue
     * @type {boolean}
     * @default false
     */
    /**
     * @description 내부에 hidden input 태그를 생성하여 출력용 필드와 구분하여 처리할지 여부를 결정한다.
     * @property useHiddenValue
     * @private
     * @type {boolean}
     */
    useHiddenValue: false,
    /**
     * @description 엔터를 치면 popup 이벤트가 발생한다.
     * @config enterToPopup
     * @type {boolean}
     * @default false
     */
    /**
     * @description 엔터를 치면 popup 이벤트가 발생한다.
     * @property enterToPopup
     * @private
     * @type {boolean}
     */
    enterToPopup: false,
    /**
     * @description 팝업 아이콘 표시 여부
     * @config picker
     * @type {boolean}
     * @default true
     */
    /**
     * @description 팝업 아이콘 표시 여부
     * @property picker
     * @private
     * @type {boolean}
     */
    picker: true, 
    /**
     * @description render시 호출되는 메소드
     * @method doRender
     * @protected
     * @param {String|Object} parentNode 부모노드
     * @return {void}
     */
    doRender: function(){
        this.createTemplate(this.el);
        if(this.useHiddenValue) {
            var hiddenInput = document.createElement('input');
            hiddenInput.type = 'hidden';
            hiddenInput.name = this.name || this.id;
            hiddenInput.id = Rui.useFixedId() ? Rui.id(this.el, 'LPopupTextBox-hidden-' + this.id) : Rui.id();
            hiddenInput.instance = this;
            hiddenInput.className = 'L-instance L-hidden-field';
            this.el.appendChild(hiddenInput);
            this.hiddenInputEl = Rui.get(hiddenInput);
            this.hiddenInputEl.addClass('L-hidden-field');
            
            var input = this.inputEl.dom;
            input.removeAttribute('name');
        }else{
            this.inputEl.dom.instance = this;
            this.inputEl.addClass('L-instance');
        }
        this.doRenderPopup();
    },
    /**
     * @description Popup Button 생성
     * @method doRenderPopup
     * @private 
     * @return {void}
     */
    doRenderPopup: function(){
        if(!this.picker) return;
        
        var iconDom = document.createElement('a');
        iconDom.className = 'icon';
        iconDom.id = Rui.useFixedId() ? Rui.id(this.el, 'LPopupTextBox-icon-' + this.id) : Rui.id();
        this.el.appendChild(iconDom);
        this.iconEl = Rui.get(iconDom);
        if(Rui.useAccessibility())
            this.iconEl.setAttribute('role', 'button');
    },
    /**
     * @description Popup 기능을 동작하도록 한다.
     * @method popupOn
     * @protected
     * @return {void}
     */
    popupOn: function(){
        if(!this.iconEl) return;
        this.iconEl.unOn('click', this.onIconClick, this);
        this.iconEl.on('click', this.onIconClick, this, true);
        this.iconEl.setStyle('cursor', 'pointer');
        this.iconEl.setAttribute('tabindex', '0');
    },
    /**
     * @description Popup 기능을 동작하지 않도록 한다.
     * @method popupOff
     * @protected
     * @return {void}
     */
    popupOff: function(){
        if(!this.iconEl) return;
        this.iconEl.unOn('click', this.onIconClick, this);
        this.iconEl.setStyle('cursor', 'default');
        this.iconEl.removeAttribute('tabindex');
    },
    /**
     * @description width 속성에 따른 실제 적용 메소드
     * @method _setWidth
     * @protected
     * @param {String} type 속성의 이름
     * @param {Array} args 속성의 값 배열
     * @param {Object} obj 적용된 객체
     * @return {void}
     */
    _setWidth: function(type, args, obj) {
    	if(args[0] < 0) return;
        Rui.ui.form.LDateBox.superclass._setWidth.call(this, type, args, obj);
        if(this.iconEl){
            this.getDisplayEl().setWidth(this.getContentWidth() - (this.iconEl.getWidth() || this.iconWidth) - this.iconMarginLeft);
        }
    },
    /**
     * @description enter keydown이 발생하면 수행하는 메소드
     * @method onEnterKeyDown
     * @protected
     * @param {Object} e 이벤트 객체
     * @return {void} 
     */
    onEnterKeyDown: function(e) {
        if(e.keyCode === 13) {
            this.onIconClick(e);
            Rui.util.LEvent.stopEvent(e);
            return false;
        }
    },
    /**
     * @description onIconClick
     * @method onIconClick
     * @private
     * @param {Object} e
     * @return {void}
     */
    onIconClick: function(e) {
        try {
            this.inputEl.focus();
        } catch(e1) {}
        var value = (this.useHiddenValue) ? this.hiddenInputEl.getValue() : this.inputEl.getValue();
        var displayValue = this.inputEl.getValue();
        this.fireEvent('popup', { value: value, displayValue: displayValue });
    },
    /**
     * @description editable 속성에 따른 실제 적용 메소드
     * @method _setEditable
     * @protected
     * @param {String} type 속성의 이름
     * @param {Array} args 속성의 값 배열
     * @param {Object} obj 적용된 객체
     * @return {void}
     */
    _setEditable: function(type, args, obj) {
        Rui.ui.form.LPopupTextBox.superclass._setEditable.call(this, type, args, obj);
    	if(this.editable){
    		if(this.enterToPopup) {
    			this.inputEl.on('keydown', this.onEnterKeyDown, this, true);
    		}
    	}else{
            this.inputEl.unOn('keydown', this.onEnterKeyDown, this, true);
    	}
    },
    /**
     * @description disabled 속성에 따른 실제 적용 메소드
     * @method _setDisabled
     * @protected
     * @param {String} type 속성의 이름
     * @param {Array} args 속성의 값 배열
     * @param {Object} obj 적용된 객체
     * @return {void}
     */
    _setDisabled: function(type, args, obj) {
        if(args[0] === false) {
            this.popupOn();
        } else {
            this.popupOff();
        }
        Rui.ui.form.LPopupTextBox.superclass._setDisabled.call(this, type, args, obj);
    },
    /**
     * @description 값을 변경한다.
     * @method setValue
     * @public
     * @param {String} o 반영할 값
     * @return {void}
     */
    setValue: function(o, ignoreEvent) {
        if(Rui.isUndefined(o) == true || this.lastValue == o) return;
        if(this.useHiddenValue)
            this.hiddenInputEl.setValue(o);
        Rui.ui.form.LPopupTextBox.superclass.setValue.call(this, o, ignoreEvent);
    },
    /**
     * @description 출력객체에 내용을 변경한다.
     * @method setDisplayValue
     * @param {String} o 출력객체에 내용을 변경할 값
     * @return {void}
     */
    setDisplayValue: function(o) {
    	//protected to public이므로 삭제하지 말것
        Rui.ui.form.LPopupTextBox.superclass.setDisplayValue.call(this, o);
        this.lastDisplayValue = o;
    },
    /**
     * @description 현재 값을 리턴
     * @method getValue
     * @public
     * @return {String} 결과값
     */
    getValue: function() {
        var value = (this.useHiddenValue) ? this.hiddenInputEl.getValue() : this.inputEl.getValue();
        return value;
    },
    /**
     * @description 객체를 destroy하는 메소드
     * @method destroy
     * @public
     * @return {void}
     */
    destroy: function() {
        if (this.iconEl) {
            this.iconEl.remove();
            delete this.iconEl;
        }
        Rui.ui.form.LPopupTextBox.superclass.destroy.call(this);
    }
});