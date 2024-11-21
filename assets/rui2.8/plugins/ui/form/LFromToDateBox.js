/*
 * @(#) LFromToDateBox.js
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
Rui.namespace('Rui.ui.form');
Rui.ui.form.LFromToDateBox = function(config){
    config = Rui.applyIf(config ||{}, Rui.getConfig().getFirst('$.ext.fromtodateBox.defaultProperties'));
    if(Rui.platform.isMobile) config.picker = false;
    Rui.ui.form.LFromToDateBox.superclass.constructor.call(this, config);
};
Rui.extend(Rui.ui.form.LFromToDateBox, Rui.ui.form.LField, {
    otype: 'Rui.ui.form.LFromToDateBox',
    CSS_BASE: 'L-fromtodatebox',
    valueFormat: '%Y-%m-%d',
    separator: '~',
    listPosition: 'auto',
    dateBoxWidth: 90,
    separatorWidth: 15,
    iconWidth: 20,
    iconMarginLeft: 1,
    picker: true,
    fromPlaceholder: null,
    toPlaceholder: null,
    editable: true,
    selectOnPicker: true,
    initDefaultConfig: function() {
        Rui.ui.form.LField.superclass.initDefaultConfig.call(this);
        this.cfg.addProperty('editable', {
            handler: this._setEditable,
            value: this.editable,
            validator: Rui.isBoolean
        });
    },
    createTemplate: function(el) {
        var elContainer = Rui.get(el);
        elContainer.addClass(this.CSS_BASE);
        elContainer.addClass('L-fixed');
        elContainer.addClass('L-form-field');
        return elContainer;
    },
    doRender: function(container){
        this.createTemplate(this.el);
        var hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = this.name || this.id;
        hiddenInput.id = Rui.useFixedId() ? Rui.id(this.el, 'LFromToDateBox-hidden-' + this.id) : Rui.id();
        hiddenInput.instance = this;
        hiddenInput.className = 'L-instance L-hidden-field';
        this.el.appendChild(hiddenInput);
        this.hiddenInputEl = Rui.get(hiddenInput);
        this.hiddenInputEl.addClass('L-hidden-field');
        var startBoxDiv = document.createElement('div'),
            endBoxDiv = document.createElement('div'),
            waveDiv = document.createElement('div');
            startBoxDiv.id = Rui.useFixedId() ? Rui.id(this.el, 'LFromToDateBox-startbox-' + this.id) : Rui.id();
            endBoxDiv.id = Rui.useFixedId() ? Rui.id(this.el, 'LFromToDateBox-endbox-' + this.id) : Rui.id();
            waveDiv.id = Rui.useFixedId() ? Rui.id(this.el, 'LFromToDateBox-wave-' + this.id) : Rui.id();
        var startBoxEl = Rui.get(startBoxDiv),
            endBoxEl = Rui.get(endBoxDiv),
            waveEl = Rui.get(waveDiv);
        waveEl.addClass('L-date-separator');
        waveEl.html('~');
        this.el.appendChild(startBoxEl);
        this.el.appendChild(waveEl);
        this.el.appendChild(endBoxEl);
        var waveWidth = waveEl.getWidth(),
            borderLR = this.el.getBorderWidth('lr');
        if(this.width > (this.dateBoxWidth * 2) + waveWidth + borderLR) {
            this.dateBoxWidth = (this.width - borderLR - waveWidth) / 2;
        }
        this.startDateBox = new Rui.ui.form.LDateBox({
            applyTo: startBoxEl.id,
            dateType: 'string',
            name: this.id + 'StartDate',
            valueFormat: '%Y%m%d',
            placeholder: this.fromPlaceholder,
            defaultValue: this.startDate,
            width: this.dateBoxWidth
        });
        this.endDateBox = new Rui.ui.form.LDateBox({
            applyTo: endBoxEl.id,
            dateType: 'string',
            name: this.id + 'EndDate',
            valueFormat: '%Y%m%d',
            placeholder: this.toPlaceholder,
            defaultValue: this.endDate,
            width: this.dateBoxWidth
        });
        this.startDateBox.el.addClass('startDateBox');
        this.endDateBox.el.addClass('endDateBox');
    },
    afterRender: function(container) {
        Rui.ui.form.LFromToDateBox.superclass.afterRender.call(this, container);
        this.startDateBox.on('changed', this.onStartDateChanged, this, true, {system: true});
        this.startDateBox.on('specialkey', this.onFireKey, this, true);
        this.startDateBox.on('focus', this.onCheckFocus, this, true);
        this.startDateBox.on('blur', this.deferOnBlur, this, true);
        this.endDateBox.on('changed', this.onEndDateChanged, this, true, {system: true});
        this.endDateBox.on('specialkey', this.onFireKey, this, true);
        this.endDateBox.on('focus', this.onCheckFocus, this, true);
        this.endDateBox.on('blur', this.deferOnBlur, this, true);
        this.doRenderCalendar();
        if(this.calendar) this.calendar.on('select', this.onCalendarSelect, this, true, {system: true});
        this.startDateBox.pickerOff();
        this.endDateBox.pickerOff();
        this.startDateBox.onIconClick = Rui.util.LFunction.createDelegate(this.onIconClick, this);
        this.endDateBox.onIconClick = Rui.util.LFunction.createDelegate(this.onIconClick, this);
        this.startDateBox.pickerOn();
        this.endDateBox.pickerOn();
        this.initFocus();
    },
    doRenderCalendar: function(){
        var config = this.calendarConfig || {width: 390};
        config.draggable = false;
        config.id = Rui.useFixedId() ? Rui.id(this.el, 'LFromToDateBox-' + this.id) : Rui.id();
        this.calendar = new Rui.ui.calendar.LFromToCalendar(config);
        this.calendar.setHeader(Rui.getMessageManager().get('$.ext.msg020'));
        this.calendar.render(document.body);
        this.calendar.hide();
        this.calendar.el.addClass('L-fromtodatebox-calendar');
    },
    initFocus: function() {
        var startInputEl = this.startDateBox.getDisplayEl();
        var endInputEl = this.endDateBox.getDisplayEl();
        if(startInputEl) {
            startInputEl.on('focus', this.onCheckFocus, this, true, {system: true});
            startInputEl.on('blur', this.deferOnBlur, this, true, {system: true});
        }
        if(endInputEl) {
            endInputEl.on('focus', this.onCheckFocus, this, true, {system: true});
            endInputEl.on('blur', this.deferOnBlur, this, true, {system: true});
        }
    },
    onStartDateChanged: function(e){
        if(!this.validateValue()){
            Rui.util.LDom.toast(Rui.getMessageManager().get('$.ext.msg022'), this.el.dom);
            this.startDateBox.setValue(this.lastStartValue);
        }else{
            this.doChanged();
        }
    },
    onEndDateChanged: function(e){
        if(!this.validateValue()){
            Rui.util.LDom.toast(Rui.getMessageManager().get('$.ext.msg022'), this.el.dom);
            this.endDateBox.setValue(this.lastEndValue);
        }else{
            this.doChanged();
        }
    },
    onCalendarSelect: function(e){
        if(e.start){
            this.setStartValue(e.start);
            this.selectStart = true;
        }
        if(e.end){
            this.setEndValue(e.end);
            this.selectEnd = true;
        }
        if(this.selectStart && this.selectEnd){
            if(this.validateValue())
                this.calendar.hide();
            if(this.el.hasClass('L-binded') === true)
                this.selectStart = this.selectEnd = null;
        }
    },
    onIconClick: function (e) {
        this.showCalendar();
    },
    doChanged: function() {
        var startValue = this.getStartValue(); 
        var endValue = this.getEndValue(); 
        var value = this.getValue();
        var dates = value.split(this.separator);
        dates[0] = Rui.util.LFormat.stringToDate(startValue, {format: '%Y%m%d'});
        dates[1] = Rui.util.LFormat.stringToDate(endValue, {format: '%Y%m%d'});
        dates[0] = Rui.util.LFormat.dateToString(dates[0], {format: this.valueFormat});
        dates[1] = Rui.util.LFormat.dateToString(dates[1], {format: this.valueFormat});
        value = dates.join(this.separator);
        this.hiddenInputEl.setValue(value);
        this.fireEvent('changed', {target:this, startValue: startValue, endValue: endValue, value: value});
    },
    validateValue: function() {
        var startValue = this.startDateBox.getValue(),
            endValue = this.endDateBox.getValue();
        if(!startValue || !endValue) return true;
        if(this.startDateBox.dateType == 'date'){
            if (startValue > endValue)
                return false;
        }else{
            if (parseInt(startValue, 10) > parseInt(endValue, 10))
                return false;
        }
        return true;
    },
    showCalendar: function(){
        if(this.disabled === true) return;
        if (this.selectOnPicker)
            this.setCalendarDates();
        this.setCalendarXY();
        this.calendar.show();
    },
    setCalendarDates: function(){
        var startValue = this.getStartValue(),
            endValue = this.getEndValue();
        if(!(startValue instanceof Date)) startValue = this.startDateBox.getDate(startValue);
        if(!(endValue instanceof Date)) endValue = this.endDateBox.getDate(endValue);
        if (startValue) {
            this.calendar.clear();
            this.calendar.select(startValue, endValue, false);
        }
    },
    setCalendarXY: function(){
        var calendarEl = this.calendar.el,
            h = calendarEl.getHeight() || 0,
            t = this.el.getTop() + this.el.getHeight(),
            l = this.el.getLeft(),
            vSize = Rui.util.LDom.getViewport();
        if((this.listPosition == 'auto' && !Rui.util.LDom.isVisibleSide(h+t)) || this.listPosition == 'up')
            t = this.el.getTop() - h;
        if(vSize.width <= (l + calendarEl.getWidth())) l -= (calendarEl.getWidth() / 2);
        calendarEl.setTop(t);
        calendarEl.setLeft(l);
    },
    _setWidth: function(type, args, obj) {
        if(args[0] < 0) return;
        Rui.ui.form.LFromToDateBox.superclass._setWidth.call(this, type, args, obj);
        if(this.iconEl){
            var inputWidth = this.getContentWidth() - this.separatorWidth - (this.iconEl.getWidth() || this.iconWidth) - this.iconMarginLeft;
            inputWidth = (inputWidth % 2 == 1) ? ((inputWidth-1)/2) : inputWidth/2;
            this.startDateBox.setWidth(inputWidth);
            this.endDateBox.setWidth(inputWidth);
        }
        Rui.ui.form.LFromToDateBox.superclass._setWidth.call(this, type, args, obj);
    },
    _setEditable: function(type, args, obj) {
        Rui.ui.form.LFromToDateBox.superclass._setEditable.call(this, type, args, obj);
        this.startDateBox.setEditable(args[0]);
        this.endDateBox.setEditable(args[0]);
    },
    _setHeight: function(type, args, obj) {
        Rui.ui.form.LFromToDateBox.superclass._setHeight.call(this, type, args, obj);
        var height = this.getContentHeight();
        this.startDateBox.setHeight(height);
        this.endDateBox.setHeight(height);
    },
    _setDisabled: function(type, args, obj) {
        if(args[0] === false) {
            this.disabled = false;
            this.el.removeClass('L-disabled');
            this.startDateBox.enable();
            this.endDateBox.enable();
            this.setEditable(this.latestEditable === undefined ? this.editable : this.latestEditable);
            this.fireEvent('enable');
        } else {
            this.disabled = true;
            this.el.addClass('L-disabled');
            this.latestEditable = this.editable;
            this.setEditable(false);
            this.startDateBox.disable();
            this.endDateBox.disable();
            this.fireEvent('disable');
        }
    },
    deferOnBlur: function (e) {
        if (this.calendar.calContainerEl ? this.calendar.calContainerEl.isAncestor(e.target) : false) { 
            var el = Rui.get(e.target);
            if (el.dom.tagName.toLowerCase() == 'a' && el.hasClass('selector')) {
                if (this.calendar.fromCalendarEl ? this.calendar.fromCalendarEl.isAncestor(e.target) : false) {
                    this.calendar.fromCalendar.doSelectCell(e, this.calendar.fromCalendar);
                } else if (this.calendar.toCalendarEl ? this.calendar.toCalendarEl.isAncestor(e.target) : false) {
                    this.calendar.toCalendar.doSelectCell(e, this.calendar.toCalendar);
                }
            }
        }
        Rui.util.LFunction.defer(this.checkBlur, 10, this, [e]);
    },
    checkBlur: function(e) {
        if(e.deferCancelBubble == true || this.isFocus !== true) return;
        var target = e.target;
        if(!this.el.isAncestor(target) && !this.startDateBox.el.isAncestor(target) && !this.endDateBox.el.isAncestor(target) && !(this.calendar.el && this.calendar.el.isAncestor(target)) ) { 
            Rui.ui.form.LFromToDateBox.superclass.checkBlur.call(this, e);
        } else 
            e.deferCancelBubble = true;
    },
    setValue: function(value){
        if(!value) return;
        this.hiddenInputEl.setValue(value);
        var dates = value.split(this.separator);
        this.setStartValue(Rui.util.LFormat.stringToDate(dates[0], {format: this.valueFormat}));
        this.setEndValue(Rui.util.LFormat.stringToDate(dates[1], {format: this.valueFormat}));
    },
    setStartValue: function(value){
        if(value == this.lastStartValue) return;
        this.lastStartValue = this.startDateBox.getValue();
        this.startDateBox.setValue(value);
    },
    setEndValue: function(value){
        if(value == this.lastEndValue) return;
        this.lastEndValue = this.endDateBox.getValue();
        this.endDateBox.setValue(value);
    },
    getStartValue: function(){
        return this.startDateBox.getValue();
    },
    getEndValue: function(){
        return this.endDateBox.getValue();
    },
    getValue: function(){
        return this.hiddenInputEl.getValue();
    },
    setEditable: function(isEditable) {
        this.cfg.setProperty('editable', this.disabled === true ? false : isEditable);
    },
    focus: function() {
        this.startDateBox.focus();
    },
    blur: function() {
        this.startDateBox.blur();
        this.endDateBox.blur();
    },
    destroy: function () {
        this.startDateBox.destroy();
        this.endDateBox.destroy();
        Rui.ui.form.LFromToDateBox.superclass.destroy.call(this);
    },
    toString: function() {
        return (this.otype || 'Rui.ui.form.LFromToDateBox') + ' ' + this.id;
    }
});