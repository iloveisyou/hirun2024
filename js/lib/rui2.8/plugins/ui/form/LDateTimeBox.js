/*
 * @(#) LDateTimeBox.js
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
Rui.ui.form.LDateTimeBox = function(config){
    config = Rui.applyIf(config || {}, Rui.getConfig().getFirst('$.ext.datetimeBox.defaultProperties'));
    Rui.ui.form.LDateTimeBox.superclass.constructor.call(this, config);
};
var DT_FORMAT = '%Y%m%d%H%M%S';
Rui.extend(Rui.ui.form.LDateTimeBox, Rui.ui.form.LField, {
    otype: 'Rui.ui.form.LDateTimeBox',
    CSS_BASE: 'L-datetimebox',
    valueFormat: '%Y-%m-%d %H:%M:%S',
    dateType: 'date',
    dateBoxWidth: 90,
    timeBoxWidth: 50,
    datePlaceholder: null,
    timePlaceholder: null,
    checkContainBlur: true,
    dateDefaultValue: null,
    timeDefaultValue: null,
    dateDisabled: false,
    timeDisabled: false,
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
    onInvalid: function(message) {
    	this.invalid({ type: 'invalid', message: message });
    },
    _setEditable: function(type, args, obj) {
        var editable = !!args[0];
        this.dateBox.setEditable(editable);
        this.timeBox.setEditable(editable);
    },
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
    _setHeight: function(type, args, obj) {
        Rui.ui.form.LDateTimeBox.superclass._setHeight.call(this, type, args, obj);
        var height = this.getContentHeight();
        this.dateBox.setHeight(height);
        this.timeBox.setHeight(height);
    },
    onSpecialkey: function(e) {
        this.fireEvent('specialkey', e);
    },
    getDateValue: function(){
        var value = this.getStringValue();
        if(!value) return null;
        return Rui.util.LDate.parse(value, {format: DT_FORMAT});
    },
    getStringValue: function(){
        var date = this.dateBox.getValue();
        var time = this.timeBox.getValue();
        if(!date || !time) return null;
        time = time + (this.sec || '00');
        return date + time;
    },
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
    	var hiddenValue = '';
    	if(value) hiddenValue = Rui.util.LDate.format(value, {format: this.valueFormat});
        this.hiddenInputEl.setValue(hiddenValue);
        this.sec = sec;
        delete this._isDateEvent;
        delete this._isTimeEvent;
    },
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
    focus: function() {
        this.dateBox.focus();
    },
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
            this.isFocus = false;
        }else{
            e.deferCancelBubble = true;
        }
    },
    destroy: function() {
        if(this.dateBox) this.dateBox.destroy();
        if(this.timeBox) this.timeBox.destroy();
        Rui.ui.form.LDateTimeBox.superclass.destroy.call(this);
    }
});
})();
