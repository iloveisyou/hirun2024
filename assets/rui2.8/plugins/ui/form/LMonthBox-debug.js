/*
 * @(#) LMonthBox-debug.js
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
 * @description 연월을 입력받는 월력 입력 INPUT 박스
 * LMonthBox
 * @namespace Rui.ui.form
 * @plugin js,css
 * @class LMonthBox
 * @extends Rui.ui.form.LDateBox
 * @constructor LMonthBox
 * @sample default
 * @param config {Object} The intial LMonthBox. 
 */
Rui.ui.form.LMonthBox = function(config){
    config = Rui.applyIf(config || {}, Rui.getConfig().getFirst('$.ext.monthBox.defaultProperties'));
    Rui.ui.form.LMonthBox.superclass.constructor.call(this, config);
};

Rui.extend(Rui.ui.form.LMonthBox, Rui.ui.form.LDateBox, {
    /**
     * @description 객체의 문자열
     * @property otype
     * @private
     * @type {String}
     */
    otype: 'Rui.ui.form.LMonthBox',
    /**
     * @description 기본 CSS명
     * @property CSS_BASE
     * @private
     * @type {String}
     */
    CSS_BASE: 'L-monthbox',
    /**
     * @description 입출력 type
     * @property dateType
     * @private
     * @type {String}
     */
    dateType: 'date',
    /**
     * @description width
     * @config width
     * @type {int}
     * @default 80
     */
    /**
     * @description width 
     * @property width
     * @private
     * @type {int} 
     */ 
    width: 80,
    /**
     * @description mask를 제외한 실제 값의 format을 지정하는 속성, form submit시 적용되는 format
     * @config valueFormat
     * @sample default
     * @type {String}
     * @default '%Y-%m'
     */
    /**
     * @description mask를 제외한 실제 값의 format을 지정하는 속성, form submit시 적용되는 format
     * @property valueFormat
     * @private
     * @type {String}
     */
    valueFormat: '%Y-%m',
    /**
     * @description Dom객체 생성 및 초기화하는 메소드
     * @method initComponent
     * @protected
     * @param {Object} config 환경정보 객체 
     * @return {void}
     */
    initComponent: function(config){
    	if(Rui.platform.isMobile) this.type = 'month';
        Rui.ui.form.LMonthBox.superclass.initComponent.call(this, config);
        this.calendarClass = Rui.ui.calendar.LMonthCalendar;
    },
    /**
     * @description blur 이벤트 발생시 defer를 연결하는 메소드
     * @method deferOnBlur
     * @protected
     * @param {Object} e Event 객체
     * @return {void}
     */
    deferOnBlur: function(e) {
        if (this.calendarDivEl.isAncestor(e.target)) {
            var el = Rui.get(e.target);
            if (el.dom.tagName.toLowerCase() == "a" && el.hasClass("selector")) {
                var selectedDate = this.calendar.getProperty("pagedate");
                selectedDate = new Date(selectedDate.getFullYear(), parseInt(el.getHtml(), 10)-1, 1);
                   this.setValue(selectedDate);
                this.calendar.hide();
            }
        }
        Rui.util.LFunction.defer(this.checkBlur, 10, this, [e]);
    },
    /**
     * @description localeMask 초기화 메소드
     * @method initLocaleMask
     * @protected 
     * @return {void}
     */
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
        this.displayValue = this.getLocaleFormat();
    },
    /**
     * @description 현재 설정되어 있는 localeMask의 format을 리턴한다.
     * @method getLocaleFormat
     * @return {String}
     */
    getLocaleFormat: function() {
        var sLocale = Rui.getConfig().getFirst('$.core.defaultLocale');
        var xFormat = '%x';
        if(this.displayValue && this.displayValue.length < 4) {
        	var displayFormat = this.displayValue.substring(1);
            xFormat = Rui.util.LDateLocale[sLocale][displayFormat];
            
            var order = xFormat.split('%');
            var format = '';
            var c = '';
            for (var i=1;i<order.length;i++){
                c = order[i].toLowerCase().charAt(0);
                switch(c){
                    case 'y':
                    case 'm':
                    	format += '%' + order[i];
                    break;
                }
            }
            var lastChar = format.charAt(format.length - 1);
            if(lastChar.toLowerCase() != 'd' && lastChar.toLowerCase() != 'y') {
            	format = format.substring(0, format.length - 1);
            }
            xFormat = format;
        } else xFormat = this.displayValue;
        return xFormat;
    },
    /**
     * @description 날짜값을 반영한다.
     * @method setValue
     * @sample default
     * @param {Date} oDate
     * @return {void}
     */
    setValue : function(oDate, ignore){
        var bDate = oDate;
        //빈값을 입력하면 null, 잘못입력하면 이전값을 넣는다.
        if(typeof oDate === 'string'){
            //getUnmaskValue는 자리수로 검사하므로 mask안된 값이 들어오면 값을 잘라낸다.
            oDate = oDate.length == 6 ? oDate : this.getUnmaskValue(oDate);
            if(!Rui.isEmpty(oDate)) oDate = (this.localeMask) ? this.getDate(bDate) : this.getDate(oDate);
            else oDate = null;
        }        
        if (oDate === false) {
            this.getDisplayEl().dom.value = this.lastDisplayValue;
        } else {
            var hiddenValue = oDate ? this.getDateString(oDate, this.valueFormat) : '';
            var displayValue = oDate ? this.getDateString(oDate) : '';
            if(this.localeMask) {
                var xFormat = this.getLocaleFormat();
                displayValue = this.getDateString(oDate, xFormat);
            } else {
                this.getDisplayEl().dom.value = displayValue;
                displayValue = this.checkValue().displayValue;
            }
            this.getDisplayEl().dom.value = displayValue;
            if (this.hiddenInputEl.dom.value !== hiddenValue) {
                this.hiddenInputEl.setValue(hiddenValue);
                this.lastDisplayValue = displayValue;
                //값이 달라질 경우만 발생.
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
    /**
     * @description 입력된 날짜 가져오기
     * @method getValue
     * @sample default
     * @return {Date}
     */
    getValue: function(){
        var value = this.hiddenInputEl.getValue();
        var oDate = this.getDate(value);
        return this.dateType == 'date' ? (oDate ? oDate : null) : this.getDateString(oDate, this.valueFormat);
    }
});