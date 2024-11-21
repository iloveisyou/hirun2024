/*
 * @(#) LFromToDateBox-debug.js
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
/**
 * 기간을 입력하는 LFromToDateBox
 * @plugin js,css
 * @namespace Rui.ui.form
 * @class LFromToDateBox
 * @extends Rui.ui.form.LField
 * @constructor LFromToDateBox
 * @param {Object} config The intial Field.
 */
Rui.ui.form.LFromToDateBox = function(config){
    config = Rui.applyIf(config ||{}, Rui.getConfig().getFirst('$.ext.fromtodateBox.defaultProperties'));
    if(Rui.platform.isMobile) config.picker = false;
    Rui.ui.form.LFromToDateBox.superclass.constructor.call(this, config);

    /**
     * @description 시작 및 종료일 폼의 값이 변경되면 발생되는 이벤트
     * @event changed
     * @sample default
     * @param {Object} target this객체
     * @param {Date|String} startValue 시작일자 폼의 값으로 dateType에 맞는 유형의 값
     * @param {Date|String} endValue 종료일자 폼의 값으로 dateType에 맞는 유형의 값
     * @param {String} value 시작 및 종료일자 폼의 값 문자열
     */
};
Rui.extend(Rui.ui.form.LFromToDateBox, Rui.ui.form.LField, {
    /**
     * @description 객체의 문자열
     * @property otype
     * @private
     * @type {String}
     */
    otype: 'Rui.ui.form.LFromToDateBox',
    /**
     * @description 기본 CSS명
     * @property CSS_BASE
     * @private
     * @type {String}
     */
    CSS_BASE: 'L-fromtodatebox',
    /**
     * @description mask를 제외한 실제 값의 format을 지정하는 속성, form submit시 적용되는 format
     * @config valueFormat
     * @sample default
     * @type {String}
     * @default '%Y-%m-%d'
     */
    /**
     * @description mask를 제외한 실제 값의 format을 지정하는 속성, form submit시 적용되는 format
     * @property valueFormat
     * @private
     * @type {String}
     */
    valueFormat: '%Y-%m-%d',
    /**
     * @description 시작일과 종료일을 구분하는 구분자
     * @config separator
     * @sample default
     * @type {String}
     * @default '~'
     */
    /**
     * @description 시작일과 종료일을 구분하는 구분자
     * @property separator
     * @private
     * @type {String}
     */
    separator: '~',
    /**
     * @description calendar picker의 펼쳐짐 방향 (auto|up|down) 
     * @property listPosition
     * @private
     * @type {String}
     */
    listPosition: 'auto',
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
     * @description 시작일 달력과 종료일 달력 사이의 구분자 DOM의 간격
     * @config separatorWidth
     * @type {int}
     * @default 15
     */
    /**
     * @description 시작일 달력과 종료일 달력 사이의 구분자 DOM의 간격
     * @property separatorWidth
     * @private
     * @type {int} 
     */ 
    separatorWidth: 15,
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
     * @description 달력아이콘 표시 여부
     * @config picker
     * @type {boolean}
     * @default true
     */
    /**
     * @description 달력아이콘 표시 여부
     * @property picker
     * @private
     * @type {boolean}
     */
    picker: true,
    /**
     * @description html5에 있는 placeholder 기능과 같은 역할이며, From DateBox에 지정할 placeholder값
     * @config fromPlaceholder
     * @sample default
     * @type {String}
     * @default null
     */
    /**
     * @description html5에 있는 placeholder 기능과 같은 역할이며, From DateBox에 지정할 placeholder값
     * @property datePlaceholder
     * @private
     * @type {String}
     */
    fromPlaceholder: null,
    /**
     * @description html5에 있는 placeholder 기능과 같은 역할이며, To DateBox에 지정할 placeholder값
     * @config toPlaceholder
     * @sample default
     * @type {String}
     * @default null
     */
    /**
     * @description html5에 있는 placeholder 기능과 같은 역할이며, To DateBox에 지정할 placeholder값
     * @property toPlaceholder
     * @private
     * @type {String}
     */
    toPlaceholder: null,
    /**
     * @description input박스에 키 입력이 가능한지 여부, 변경이 불가능한 읽기 전용 속성은 LUIComponent에 있는 disabled로 처리
     * @config editable
     * @sample default
     * @type {boolean}
     * @default true
     */
    /**
     * @description input박스에 키 입력이 가능한지 여부, 변경이 불가능한 읽기 전용 속성은 LUIComponent에 있는 disabled로 처리
     * @property editable
     * @private
     * @type {boolean}
     */
    editable: true,
    /**
     * @description calendar picker show할때 입력된 날짜를 calendar에서 선택할지 여부 
     * @property selectOnPicker
     * @private
     * @type {boolean}
     */
    selectOnPicker: true,
    /**
     * @description 객체를 Config정보를 초기화하는 메소드
     * @method initDefaultConfig
     * @protected
     * @return {void}
     */
    initDefaultConfig: function() {
        Rui.ui.form.LField.superclass.initDefaultConfig.call(this);
        this.cfg.addProperty('editable', {
            handler: this._setEditable,
            value: this.editable,
            validator: Rui.isBoolean
        });
    },
    /**
     * @description Dom객체 생성
     * @method createTemplate
     * @private 
     * @param {String|Object} el 객체의 아이디나 객체
     * @return {Rui.LElement} Element 객체
     */
    createTemplate: function(el) {
        var elContainer = Rui.get(el);
        elContainer.addClass(this.CSS_BASE);
        elContainer.addClass('L-fixed');
        elContainer.addClass('L-form-field');
        return elContainer;
    },
    /**
     * @description render시 호출되는 메소드
     * @method doRender
     * @protected 
     * @param {String|Object} container 부모객체 정보
     * @return {void}
     */
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
    /**
     * @description afterRender
     * @method afterRender
     * @private 
     * @param {HTMLElement} container
     * @return {void}
     */
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
    /**
     * @description doRenderCalendar
     * @method doRenderCalendar
     * @private 
     * @return {void}
     */
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
    /**
     * @description container안의 content의 focus/blur 연결 설정
     * @method initFocus
     * @private
     * @return {void}
     */
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
    /**
     * @description 시작일 DateBox의 changed이벤트 핸들러
     * @method onStartDateChanged
     * @private
     * @param {Object} e
     * @return {void}
     */
    onStartDateChanged: function(e){
        if(!this.validateValue()){
            Rui.util.LDom.toast(Rui.getMessageManager().get('$.ext.msg022'), this.el.dom);
            this.startDateBox.setValue(this.lastStartValue);
        }else{
            this.doChanged();
        }
    },
    /**
     * @description 종료일 DateBox의 changed이벤트 핸들러
     * @method onEndDateChanged
     * @private
     * @param {Object} e
     * @return {void}
     */
    onEndDateChanged: function(e){
        if(!this.validateValue()){
            Rui.util.LDom.toast(Rui.getMessageManager().get('$.ext.msg022'), this.el.dom);
            this.endDateBox.setValue(this.lastEndValue);
        }else{
            this.doChanged();
        }
    },
    /**
     * @description 달력의 select 이벤트 핸들러인 onCalendarSelect 메소드
     * @method onCalendarSelect
     * @private
     * @param {Object} e
     * @return {void}
     */
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
            //무조건 양쪽을 클릭할 경우 달력을 닫고자 할 경우 아래 라인을 사용한다.
            if(this.el.hasClass('L-binded') === true)
                this.selectStart = this.selectEnd = null;
        }
    },
        /**
     * @description onIconClick
     * @method onIconClick
     * @private
     * @param {Object} e
     * @return {void}
     */
    onIconClick: function (e) {
        this.showCalendar();
    },
    /**
     * @description changed 이벤트를 발생한다.
     * @method doChanged
     * @protected
     * @return {Rui.data.DataSet}
     */
    doChanged: function() {
        var startValue = this.getStartValue(); //%Y%m%d
        var endValue = this.getEndValue(); //%Y%m%d
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
    /**
     * @description 입력된 값의 유효성 검사
     * @method validateValue
     * @protected
     * @return {boolean}
     */
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
    /**
     * @description Calendar를 출력한다.
     * @method showCalendar
     * @private
     * @return {void}
     */
    showCalendar: function(){
        if(this.disabled === true) return;
        if (this.selectOnPicker)
            this.setCalendarDates();
        this.setCalendarXY();
        this.calendar.show();
    },
    /**
     * @description 입력된 날짜 선택하기
     * @method setCalendarDates
     * @private
     * @return {void}
     */
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
    /**
     * @description calendar 전시 위치 설정
     * @method setCalendarXY 
     * @private
     * @return {void}
     */
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
        Rui.ui.form.LFromToDateBox.superclass._setWidth.call(this, type, args, obj);
        if(this.iconEl){
            var inputWidth = this.getContentWidth() - this.separatorWidth - (this.iconEl.getWidth() || this.iconWidth) - this.iconMarginLeft;
            inputWidth = (inputWidth % 2 == 1) ? ((inputWidth-1)/2) : inputWidth/2;
            this.startDateBox.setWidth(inputWidth);
            this.endDateBox.setWidth(inputWidth);
        }
        Rui.ui.form.LFromToDateBox.superclass._setWidth.call(this, type, args, obj);
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
        Rui.ui.form.LFromToDateBox.superclass._setEditable.call(this, type, args, obj);
        this.startDateBox.setEditable(args[0]);
        this.endDateBox.setEditable(args[0]);
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
        Rui.ui.form.LFromToDateBox.superclass._setHeight.call(this, type, args, obj);
        var height = this.getContentHeight();
        this.startDateBox.setHeight(height);
        this.endDateBox.setHeight(height);
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
        //if(args[0] === this.disabled) return;
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
    /**
     * @description blur 호출 지연 메소드
     * @method deferOnBlur
     * @private
     * @param {Object} e event 객체
     * @return {void}
     */
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
    /**
     * @descriptiono Blur 이벤트 발생 시 onBlur를 호출하는 조건을 체크하는 메소드
     * @method checkBlur
     * @private
     * @param {Object} e Event 객체
     * @return {void}
     */    
    checkBlur: function(e) {
        if(e.deferCancelBubble == true || this.isFocus !== true) return;
        var target = e.target;
        if(!this.el.isAncestor(target) && !this.startDateBox.el.isAncestor(target) && !this.endDateBox.el.isAncestor(target) && !(this.calendar.el && this.calendar.el.isAncestor(target)) ) { 
            Rui.ui.form.LFromToDateBox.superclass.checkBlur.call(this, e);
        } else 
            e.deferCancelBubble = true;
    },
    /**
     * @description 날짜 및 시간값을 변경한다.
     * 값의 format은 valueFormat에 따른다.
     * @method setValue
     * @sample default
     * @param {String} value
     * @return {void}
     */
    setValue: function(value){
        if(!value) return;
        this.hiddenInputEl.setValue(value);
        
        var dates = value.split(this.separator);
        this.setStartValue(Rui.util.LFormat.stringToDate(dates[0], {format: this.valueFormat}));
        this.setEndValue(Rui.util.LFormat.stringToDate(dates[1], {format: this.valueFormat}));
    },
    /**
     * @description 시작일자 폼의 값을 dateType에 맞는 유형으로 지정
     * @method setStartValue
     * @public
     * @param {Date|String} value 입력할 값
     * @return {void}
     */
    setStartValue: function(value){
        if(value == this.lastStartValue) return;
        this.lastStartValue = this.startDateBox.getValue();
        this.startDateBox.setValue(value);
    },
    /**
     * @description 종료일자 폼의 값을 dateType에 맞는 유형으로 지정
     * @method setEndValue
     * @public
     * @param {Date|String} value 입력할 값
     * @return {void}
     */
    setEndValue: function(value){
        if(value == this.lastEndValue) return;
        this.lastEndValue = this.endDateBox.getValue();
        this.endDateBox.setValue(value);
    },
    /**
     * @description 시작일자 폼의 값을 dateType에 맞는 유형으로 반환
     * @method getStartValue
     * @public
     * @return {Date|String}
     */
    getStartValue: function(){
        return this.startDateBox.getValue();
    },
    /**
     * @description 종료일자 폼의 값을 dateType에 맞는 유형으로 반환
     * @method getEndValue
     * @public
     * @return {Date|String}
     */
    getEndValue: function(){
        return this.endDateBox.getValue();
    },
    /**
     * @description 입력된 날짜 및 시간 가져오기
     * @method getValue
     * @sample default
     * @return {Date}
     */
    getValue: function(){
        return this.hiddenInputEl.getValue();
    },
    /**
     * @description editable 값을 셋팅하는 메소드
     * @method setEditable
     * @public
     * @param {boolean} isEditable editable 셋팅 값
     * @return {void}
     */
    setEditable: function(isEditable) {
        this.cfg.setProperty('editable', this.disabled === true ? false : isEditable);
    },
    /**
     * @description Tries to focus the element. Any exceptions are caught and ignored.
     * <p>Sample: <a href="./../sample/general/ui/form/textboxSample.html" target="_sample">보기</a></p>
     * @method focus
     * @public
     * @return {void}
     */
    focus: function() {
        this.startDateBox.focus();
    },
    /**
     * @description Tries to blur the element. Any exceptions are caught and ignored.
     * <p>Sample: <a href="./../sample/general/ui/form/textboxSample.html" target="_sample">보기</a></p>
     * @method blur
     * @public
     * @return {void}
     */
    blur: function() {
        this.startDateBox.blur();
        this.endDateBox.blur();
    },
    /**
     * DOM에서 패널 엘리먼트를 제거하고 모든 자식 엘리먼트들을 null로 설정한다.
     * @method destroy
     */
    destroy: function () {
        this.startDateBox.destroy();
        this.endDateBox.destroy();
        Rui.ui.form.LFromToDateBox.superclass.destroy.call(this);
    },
    /**
     * @description 객체의 toString
     * @method toString
     * @public
     * @return {String}
     */
    toString: function() {
        return (this.otype || 'Rui.ui.form.LFromToDateBox') + ' ' + this.id;
    }
});