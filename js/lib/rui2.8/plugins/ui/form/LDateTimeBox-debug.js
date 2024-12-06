/*
 * @(#) LDateTimeBox-debug.js
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
(function(){
/**
 * 날짜를 입력하는 LDateTimeBox (Beta)
 * @namespace Rui.ui.form
 * @class LDateTimeBox
 * @extends Rui.ui.form.LTextBox
 * @sample default
 * @constructor LDateTimeBox
 * @param {Object} config The intial LDateTimeBox.
 */
Rui.ui.form.LDateTimeBox = function(config){
    config = Rui.applyIf(config || {}, Rui.getConfig().getFirst('$.ext.datetimeBox.defaultProperties'));
    Rui.ui.form.LDateTimeBox.superclass.constructor.call(this, config);
};
var DT_FORMAT = '%Y%m%d%H%M%S';
Rui.extend(Rui.ui.form.LDateTimeBox, Rui.ui.form.LField, {
    /**
     * @description 객체의 문자열
     * @property otype
     * @private
     * @type {String}
     */
    otype: 'Rui.ui.form.LDateTimeBox',
    /**
     * @description 기본 CSS명
     * @property CSS_BASE
     * @private
     * @type {String}
     */    
    CSS_BASE: 'L-datetimebox',
    /**
     * @description mask를 제외한 실제 값의 format을 지정하는 속성, form submit시 적용되는 format
     * @config valueFormat
     * @sample default
     * @type {String}
     * @default '%Y-%m-%d %H:%M:%S'
     */
    /**
     * @description mask를 제외한 실제 값의 format을 지정하는 속성, form submit시 적용되는 format
     * @property valueFormat
     * @private
     * @type {String}
     */
    valueFormat: '%Y-%m-%d %H:%M:%S',
    /**
     * @description 입출력 값을 Date형으로 할것인지 String형으로 할 것인지 결정한다.
     * 기본 값은 Date형 이며, String형으로 사용 할 경우 입출력 값의 포맷은 valueFormat 속성값에 따른다.
     * @config dateType
     * @type {String}
     * @default 'date'
     */
    /**
     * @description 입출력 값을 Date형으로 할것인지 String형으로 할 것인지 결정한다.
     * 기본 값은 Date형 이며, String형으로 사용 할 경우 입출력 값의 포맷은 valueFormat 속성값에 따른다.
     * @property dateType
     * @private
     * @type {String}
     */
    dateType: 'date',
    /**
     * @description DateTimeBox에서 DateBox의 width를 지정한다.
     * @config dateBoxWidth
     * @sample default
     * @type {int}
     * @default 100
     */
    /**
     * @description DateTimeBox에서 DateBox의 width를 지정한다.
     * @property dateBoxWidth
     * @private
     * @type {int}
     */
    dateBoxWidth: 90,
    /**
     * @description DateTimeBox에서 TimeBox의 width를 지정한다.
     * @config timeBoxWidth
     * @sample default
     * @type {int}
     * @default 60
     */
    /**
     * @description DateTimeBox에서 TimeBox의 width를 지정한다.
     * @property timeBoxWidth
     * @private
     * @type {int}
     */
    timeBoxWidth: 50,
    /**
     * @description html5에 있는 placeholder 기능과 같은 역할이며, DateBox에 지정할 placeholder값
     * @config datePlaceholder
     * @sample default
     * @type {String}
     * @default null
     */
    /**
     * @description html5에 있는 placeholder 기능과 같은 역할이며, DateBox에 지정할 placeholder값
     * @property datePlaceholder
     * @private
     * @type {String}
     */
    datePlaceholder: null,
    /**
     * @description html5에 있는 placeholder 기능과 같은 역할이며, TimeBox에 지정할 placeholder값
     * @config timePlaceholder
     * @sample default
     * @type {String}
     * @default null
     */
    /**
     * @description html5에 있는 placeholder 기능과 같은 역할이며, TimeBox에 지정할 placeholder값
     * @property timePlaceholder
     * @private
     * @type {String}
     */
    timePlaceholder: null,
    /**
     * @description blur시 contains 체크를 할지 여부
     * @property checkContainBlur
     * @private
     * @type {boolean}
     */
    checkContainBlur: true,
    /**
     * @description DateBox에 지정할 defaultValue 값
     * @property dateDefaultValue
     * @private
     * @type {String}
     */
    dateDefaultValue: null,
    /**
     * @description TimeBox에 지정할 defaultValue 값
     * @property timeDefaultValue
     * @private
     * @type {String}
     */
    timeDefaultValue: null,
    /**
     * @description TimeBox에 지정할 dateDisabled 값
     * @property dateDisabled
     * @private
     * @type {boolean}
     */
    dateDisabled: false,
    /**
     * @description TimeBox에 지정할 timeDisabled 값
     * @property timeDisabled
     * @private
     * @type {boolean}
     */
    timeDisabled: false,
    /**
     * @description render시 호출되는 메소드
     * @method doRender
     * @protected
     * @param {String|Object} parentNode 부모노드
     * @return {void}
     */
    doRender: function(){
        var elContainer = Rui.get(this.el);
        elContainer.addClass(this.CSS_BASE);
        elContainer.addClass('L-fixed');
        elContainer.addClass('L-form-field');
        
        var id = this.el.id || Rui.id();
        
        var hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.id = Rui.useFixedId() ? Rui.id(this.el, 'LDateTimeBox-hidden-' + this.id) : Rui.id();
        hiddenInput.name = this.name || this.id;
        hiddenInput.instance = this;
        hiddenInput.className = 'L-instance L-hidden-field';
        this.el.appendChild(hiddenInput);
        this.hiddenInputEl = Rui.get(hiddenInput);
        this.hiddenInputEl.addClass('L-hidden-field');
        
        this.dateBoxId = id + 'DateBox';
        this.timeBoxId = id + 'TimeBox';
        
        var html = '<input type="text" id="' + this.dateBoxId + '"> <input type="text" id="' + this.timeBoxId + '">';
        
        elContainer.appendChild(html);
        
        if(this.width > (this.dateBoxWidth + this.timeBoxWidth)) {
        	var borderLR = this.el.getBorderWidth('lr');
        	this.dateBoxWidth = this.width * 0.7 - (borderLR || 2);
        	this.timeBoxWidth = this.width * 0.3 - (borderLR || 2);
        }
    },
    /**
     * @description render후 호출되는 메소드
     * @method afterRender
     * @protected
     * @param {HTMLElement} container 부모 객체
     * @return {void}
     */
    afterRender: function(container) {
        var dateBoxConfig = {
            applyTo: this.dateBoxId,
            emptyValue: '',
            dateType: 'string',
            valueFormat: '%Y%m%d',
            placeholder: this.datePlaceholder,
            width: this.dateBoxWidth,
            defaultValue: this.dateDefaultValue,
            disabled : this.dateDisabled
        };
        
        this.dateBox = new Rui.ui.form.LDateBox(dateBoxConfig);
        
        var timeBoxConfig = {
            applyTo: this.timeBoxId,
            emptyValue: '',
            placeholder: this.timePlaceholder,
            width: this.timeBoxWidth,
            defaultValue: this.timeDefaultValue,
            disabled : this.timeDisabled
        };
        
        this.timeBox = new Rui.ui.form.LTimeBox(timeBoxConfig);
        
        this.dateBox.on('changed', this.onDateBoxChanged, this, true);
        this.dateBox.on('specialkey', this.onFireKey, this, true);
        this.dateBox.on('focus', this.onCheckFocus, this, true);
        this.dateBox.on('blur', this.deferOnBlur, this, true);
        this.dateBox.on('invalid', this.onInvalid, this, true);
        
        this.timeBox.on('changed', this.onTimeBoxChanged, this, true);
        this.timeBox.on('focus', this.onCheckFocus, this, true);
        this.timeBox.on('blur', this.deferOnBlur, this, true);
        this.timeBox.on('specialkey', this.onFireKey, this, true);
        this.timeBox.on('invalid', this.onInvalid, this, true);
    },
    /**
     * @description datebox의 changed 이벤트 발생시 호출되는 메소드
     * @method onDateBoxChanged
     * @protected
     * @param {Object} e Event 객체
     * @return {void}
     */
    onDateBoxChanged: function(e) {
        var time = this.timeBox.getValue();
        time = (!time) ? (Rui.platform.isMobile ? '00:00' : '0000') : time;
        this.timeBox.setValue(time, true);
        var date = this.dateBox.getValue();
        
        var value = (date + time + (this.sec || '00')).toDate(DT_FORMAT);
        var displayValue = this.dateBox.getDisplayValue() + ' ' + (time.substring(0, 2) + ':' + time.substring(2, 4));
        if(this._isDateEvent == true || Rui.isUndefined(this._isDateEvent)) {
            this.fireEvent('changed', {
                target: this,
                value: value,
                displayValue: displayValue
            });
        }
    },
    /**
     * @description timebox의 changed 이벤트 발생시 호출되는 메소드
     * @method onDateBoxChanged
     * @protected
     * @param {Object} e Event 객체
     * @return {void}
     */
    onTimeBoxChanged: function(e) {
        var date = this.dateBox.getValue();
        var time = this.timeBox.getValue();
        if(time) time = time.replace(':', '');
        if(time && !date) this.dateBox.setValue(new Date(), true);
        var value = (date + time + (this.sec || '00')).toDate(DT_FORMAT);
        var displayValue = this.dateBox.getDisplayValue() + ' ' + (time.substring(0, 2) + ':' + time.substring(2, 4));
        if(this._isTimeEvent == true || Rui.isUndefined(this._isTimeEvent)) {
            this.fireEvent('changed', {
                target: this,
                value: value,
                displayValue: displayValue
            });
        }
    },
    /**
     * @description datebox나 timebox의 invalid 이벤트 발생시 호출되는 메소드
     * @method onInvalid
     * @protected
     * @param {Object} e Event 객체
     * @return {void}
     */
    onInvalid: function(message) {
    	this.invalid({ type: 'invalid', message: message });
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
        var editable = !!args[0];
        this.dateBox.setEditable(editable);
        this.timeBox.setEditable(editable);
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
        if(args[0] === this.disabled){
        	if(this.dateBox === undefined && this.timeBox === undefined && this.disabled === true){
        		this.dateDisabled = true;
        		this.timeDisabled = true;
        	}
        	return;
        }
        this.disabled = !!args[0];
        
    	if(this.disabled === false) {
            this.dateBox.enable();
            this.timeBox.enable();
        } else {
            this.dateBox.disable();
            this.timeBox.disable();
        }       	

    },
    /**
     * @description height 속성에 따른 실제 적용 메소드
     * @method _setHeight
     * @protected
     * @param {String} type 속성의 이름
     * @param {Array} args 속성의 값 배열
     * @param {Object} obj 적용된 객체
     * @return {void}
     */
    _setHeight: function(type, args, obj) {
        Rui.ui.form.LDateTimeBox.superclass._setHeight.call(this, type, args, obj);
        var height = this.getContentHeight();
        this.dateBox.setHeight(height);
        this.timeBox.setHeight(height);
    },
    /**
     * @description 특별한 키에 대한 이벤트 기능 연결 메소드
     * @method onSpecialkey
     * @private
     * @param {Object} e Event 객체
     * @return {void}
     */
    onSpecialkey: function(e) {
        this.fireEvent('specialkey', e);
    },
    /**
     * @description 입력된 날짜와 시간을 Date형으로 반환한다.
     * @method getDateValue
     * @private
     * @return {Date}
     */
    getDateValue: function(){
        var value = this.getStringValue();
        if(!value) return null;
        return Rui.util.LDate.parse(value, {format: DT_FORMAT});
    },
    /**
     * @description 입력된 날짜와 시간을 DT_FORMAT형의 String형으로 반환한다.
     * @method getStringValue
     * @private
     * @return {String}
     */
    getStringValue: function(){
        var date = this.dateBox.getValue();
        var time = this.timeBox.getValue();
        if(!date || !time) return null;
        time = time + (this.sec || '00');
        return date + time;
    },
    /**
     * @description 날짜 및 시간값을 변경한다.
     * @method setValue
     * @sample default
     * @param {Date} value
     * @return {void}
     */
    setValue: function(value, ignoreEvent){
        if(value && Rui.isString(value))
            value = Rui.util.LFormat.stringToDate(value, {format: this.valueFormat});
        var newDate = null;
        var newTime = null;
        var date = null;
        var time = null;
        if(value) {
            var valueString = Rui.util.LDate.format(value, {format: DT_FORMAT});
            newDate = valueString.substring(0, 8);
            newTime = valueString.substring(8, 12);
            var sec = valueString.substring(12);
            if(this.dateBox !== undefined && this.timeBox !== undefined){
            	date = this.dateBox.getValue();
            	time = this.timeBox.getValue();
            }
            if(newDate + newTime == date + time) return;
            if(newTime == time) {
                this._isDateEvent = true;
                this._isTimeEvent = false;
            } else {
                this._isDateEvent = false;
                this._isTimeEvent = true;
            }
        }
        if(this.dateBox !== undefined && this.timeBox !== undefined){
        	this.dateBox.setValue(newDate, ignoreEvent);
        	this.timeBox.setValue(newTime, ignoreEvent);
        }else{
        	this.dateDefaultValue = newDate;
        	this.timeDefaultValue = newTime;
        }
        //hidden 처리 (bind 및 form 전송을 위한 값)
    	var hiddenValue = '';
    	if(value) hiddenValue = Rui.util.LDate.format(value, {format: this.valueFormat});
        this.hiddenInputEl.setValue(hiddenValue);
        
        this.sec = sec;
        delete this._isDateEvent;
        delete this._isTimeEvent;
    },
    /**
     * @description 입력된 날짜 및 시간 가져오기
     * @method getValue
     * @sample default
     * @return {Date}
     */
    getValue: function(){
        var value = this.getDateValue();
        if(!value) return null;
        if(this.dateType === 'date'){
        	if(Rui.isString(value)) return Rui.util.LString.toDate(value, DT_FORMAT);
        	else return value;
        }else{
            return Rui.util.LDate.format(value, {format: this.valueFormat});
        }
    },
    /**
     * @description Tries to focus the element. Any exceptions are caught and ignored.
     * <p>Sample: <a href="./../sample/general/ui/form/textboxSample.html" target="_sample">보기</a></p>
     * @method focus
     * @public
     * @return {void}
     */
    focus: function() {
        this.dateBox.focus();
    },
    /**
     * @description Tries to blur the element. Any exceptions are caught and ignored.
     * <p>Sample: <a href="./../sample/general/ui/form/textboxSample.html" target="_sample">보기</a></p>
     * @method blur
     * @public
     * @return {void}
     */
    blur: function() {
        this.dateBox.blur();
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
        if(target !== this.el.dom && !this.el.isAncestor(target) && (this.calendarDivEl ? target !== this.calendarDivEl.dom && !this.calendarDivEl.isAncestor(target) : true) ) {
            Rui.util.LEvent.removeListener(Rui.browser.msie ? document.body : document, 'mousedown', this.deferOnBlur);
            //this.onBlur.call(this, e); 
            this.isFocus = false;
        }else{
            e.deferCancelBubble = true;
        }
    },
    
    /**
     * @description 객체를 destroy하는 메소드
     * @method destroy
     * @public
     * @return {void}
     */
    destroy: function() {
        if(this.dateBox) this.dateBox.destroy();
        if(this.timeBox) this.timeBox.destroy();
        Rui.ui.form.LDateTimeBox.superclass.destroy.call(this);
    }
});
})();
