/*
 * @(#) LMultiCombo-debug.js
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
 * Combo의 값을 여러개 선택할 수 있는 콤보
 *  
 * @plugin js,css
 * @namespace Rui.ui.form
 * @class LMultiCombo
 * @extends Rui.ui.form.LCombo
 * @constructor LMultiCombo
 * @sample default
 * @param {Object} config The intial LMultiCombo.
 */
Rui.ui.form.LMultiCombo = function(config){
    config = Rui.applyIf(config || {}, Rui.getConfig().getFirst('$.ext.multicombo.defaultProperties'));
    config.useEmptyText = false;
    Rui.ui.form.LMultiCombo.superclass.constructor.call(this, config);
};
Rui.extend(Rui.ui.form.LMultiCombo, Rui.ui.form.LCombo, {
    /**
     * @description 객체의 문자열
     * @property otype
     * @private
     * @type {String}
     */
    otype: 'Rui.ui.form.LMultiCombo',
    /**
     * @description '선택하세요.' 항목 추가 여부
     * <p>Sample: <a href="./../sample/general/ui/form/textboxSample.html" target="_sample">보기</a></p>
     * @config useEmptyText
     * @sample default
     * @type {boolean}
     * @default false
     */
    /**
     * @description '선택하세요.' 항목 추가 여부
     * @property useEmptyText
     * @private
     * @type {boolean}
     */
    useEmptyText: false,
    
    /**
     * @description 데이터를 반드시 선택해야 하는 필수 여부
     * @config forceSelection
     * @sample default
     * @type {boolean}
     * @default false
     */
    /**
     * @description 데이터를 반드시 선택해야 하는 필수 여부
     * @property forceSelection
     * @private
     * @type {boolean}
     */
    forceSelection: false,
    /**
     * @description getValue나 getValue시 멀티 선택값의 구분자 문자열
     * @config separator
     * @type {String}
     * @default ','
     */
    /**
     * @description getValue나 getValue시 멀티 선택값의 구분자 문자열
     * @property separator
     * @private
     * @type {String}
     */
    separator: ',',
    /**
     * @description render시 호출되는 메소드
     * @method doRender
     * @protected
     * @param {String|Object} parentNode 부모노드
     * @return {void}
     */
    doRender: function(){
        Rui.ui.form.LMultiCombo.superclass.doRender.call(this);
        this.el.addClass('L-multi-combo');
    },
    /**
     * @description render 후 호출하는 메소드
     * @method afterRender
     * @protected
     * @param {HttpElement} container 부모 객체
     * @return {void}
     */
    afterRender: function(container) {
        Rui.ui.form.LMultiCombo.superclass.afterRender.call(this, container);
        this.dataSet.on('marked', this.onMarked, this, true);
        this.dataSet.on('allMarked', this.onAllMarked, this, true);
    },
    /**
     * @description option div 객체 생성
     * @method createOptionDiv
     * @protected
     * @return {void}
     */
    createOptionDiv: function() {
        Rui.ui.form.LMultiCombo.superclass.createOptionDiv.call(this);
        this.optionDivEl.addClass('L-multi-combo');
    },
    /**
     * @description 목록의 Item을 생성
     * @method createItem
     * @private
     * @param {Object} e Event 객체
     * @return {void}
     */
    createItem: function(e){
        var record = e.record;
        var ds = record.dataSet;
        var displayValue = record.get(this.displayField);
        displayValue = Rui.isEmpty(displayValue) ? '' : displayValue;
        var listHtml = '';
        if(this.listRenderer) {
            listHtml = this.listRenderer(record);
        } else {
            listHtml = '<div class="L-selection"></div><div class="L-display-field">' + displayValue + '</div>';
        }
        var isMarked = (e.row > -1) ? ds.isMarked(e.row) : false;
        var optionEl = Rui.createElements('<div class="L-list L-row-' + record.id + (isMarked ? ' L-marked' : '') + '">' + listHtml + '</div>').getAt(0);
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
    /**
     * @description 현재 데이터셋으로 리스트를 다시 생성하는 메소드
     * @method doDataChangedDataSet
     * @private
     * @return {void}
     */
    doDataChangedDataSet: function() {
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
    /**
     * @description options div를 mousedown할 경우 호출되는 메소드
     * @method onOptionMouseDown
     * @protected
     * @param {Object} e Event 객체
     * @return {void}
     */
    onOptionMouseDown: function(e) {
        var targetEl = Rui.get(e.target);
        var row = this.findRowIndex(e.target);
        if(row > -1) {
            var ds = this.dataSet;
            var isMarked = ds.isMarked(row);
            this.dataSet.setMark(row, !isMarked);
        }
        var inputEl = this.getDisplayEl();
        inputEl.focus();
    },
    /**
     * @description marked 이벤트가가 발생하면 호출되는 메소드
     * @method onMarked
     * @protected
     * @param {Object} e Event 객체
     * @return {void}
     */
    onMarked: function(e) {
    	if(!this.optionDivEl) return;
        var rowEl = this.findRowElById(e.record.id);
        if(rowEl) {
            if(e.isSelect) rowEl.addClass('L-marked');
            else rowEl.removeClass('L-marked');
        }
        this.updateValues();
    },
    /**
     * @description allMarked 이벤트가가 발생하면 호출되는 메소드
     * @method onAllMarked
     * @protected
     * @param {Object} e Event 객체
     * @return {void}
     */
    onAllMarked: function(e) {
        var listEl = this.optionDivEl.select('.L-list');
        if(e.isSelect) listEl.addClass('L-marked');
        else listEl.removeClass('L-marked');
        //this.updateValues();
    },
    /**
     * @description Keypress 이벤트가 발생하면 처리하는 메소드
     * @method onKeypress
     * @private
     * @param {Object} e Event 객체
     * @return {void}
     */
    onKeypress: function(e) {
        Rui.ui.form.LMultiCombo.superclass.onKeypress.call(this, e);
        if((e.which || e.keyCode) === Rui.util.LKey.KEY.SPACE) {
            if(this.optionDivEl) {
                var ds = this.dataSet;
                var activeEl = this.optionDivEl.select('.active');
                if(activeEl.length > 0) {
                    var row = this.findRowIndex(activeEl.getAt(0).dom);
                    if(row > -1)
                        ds.setMark(row, !ds.isMarked(row));
                }
            }
        }
    },
    /**
     * @description 목록에서 선택되면 출력객체에 값을 반영하는 메소드
     * @method doChangedItem
     * @private
     * @param {HTMLElement} dom Dom 객체
     * @return {void}
     */
    doChangedItem: function(dom) {
    },
    /**
     * @description 데이터셋이 RowPosChanged 메소드가 호출되면 수행하는 메소드
     * @method onRowPosChangedDataSet
     * @protected
     * @param {int} row row 값
     * @param {boolean ignoreEvent [optional] event 무시 여부
     * @return {void}
     */
    onRowPosChangedDataSet: function(e) {
        this.doRowPosChangedDataSet(e.row, false);
    },
    /**
     * @description 출력데이터가 변경되면 호출되는 메소드
     * @method doChangedDisplayValue
     * @private
     * @param {String} o 적용할 값
     * @return {void}
     */
    doChangedDisplayValue: function(o) {
    },
    /**
     * @description 현재 가지고 있는 값을 input 태그에 반영한다.
     * @method updateValues
     * @private
     * @return {void}
     */
    updateValues: function() {
        var ds = this.dataSet;
        var values = [];
        var displayValues = [];
        if(ds.getMarkedCount() > 0) {
            for (var i = 0, len = ds.getCount(); i < len; i++) {
                var isMarked = ds.isMarked(i);
                if(isMarked) {
                    var r = ds.getAt(i);
                    values.push(r.get(this.valueField));
                    displayValues.push(r.get(this.displayField));
                }
            }
        }
        this.hiddenInputEl.setValue(values.join(this.separator));
        this.getDisplayEl().setValue(displayValues.join(this.separator));
        if(!this._ignoreEvent) this.doChanged();
    },
    /**
     * @description 이 메소드는 LMultiCombo에서 지원 안한다.
     * @method setSelectedIndex
     * @public
     * @param {int} idx 위치를 변경할 값
     * @return {void}
     */
    setSelectedIndex: function(idx) {
    },
    /**
     * @description renderer를 수행하는 메소드
     * @method comboRenderer
     * @protected
     * @return {String}
     */
    comboRenderer: function(val, p, record, row, i) {
        if(Rui.isEmpty(val)) return '';
        var rVal = undefined;
        rVal = this.dataMap[val];
        var sVal = val.split(this.separator);
        if(Rui.isUndefined(rVal)) {
            if(this.autoMapping) {
                if(this.dataSet.isFiltered()) {
                	rVal = this.getDisplayValueByValue(this.dataSet.snapshot, sVal);
                } else {
                	rVal = this.getDisplayValueByValue(this.dataSet.data, sVal);
                }
            }
        }
        if(Rui.isUndefined(rVal)) rVal = this.rendererField ? record.get(this.rendererField) : val;
        if(Rui.isUndefined(rVal)) rVal = this.dataMap[val] ? this.dataMap[val] : rVal;
        this.dataMap[val] = rVal;
        return rVal;
    },
    /**
     * @description 그리드에 올라가는 콤보의 경우 code값이 변경될 경우 display값도 변경되게 수정 
     * @method initUpdateEvent
     * @private
     * @return {void}
     */
    initUpdateEvent: function() {
        if(!this.gridPanel || this.isInitUpdateEvent === true || !this.rendererField) return;
        var gridDataSet = this.gridPanel.getView().getDataSet();
        this.on('changed', function(e){
            gridDataSet.setNameValue(gridDataSet.getRow(), this.rendererField, this.getDisplayValue());
        }, this, true);
        this.isInitUpdateEvent = true;
    },
    /**
     * @description dislayField에 해당되는 값으로 row를 찾는다.
     * @method findRowByDisplayValue
     * @param {Sring} displayValue 찾고자하는 display값
     * @return {String}
     */
    findValueByDisplayValue: function(displayValue) {
        var val = '';
        var values = displayValue.split(this.separator);
        for (var i = 0, len = values.length; i < len; i++) {
            var value = values[i] ? Rui.util.LString.trim(values[i]) : values[i];
            var eRow = this.dataSet.findRow(this.displayField, value);
            if(eRow > -1)
                val += this.dataSet.getAt(eRow).get(this.valueField) + this.separator;
        }
        if(val.length > 0) val = val.substring(0, val.length - 1);
        return val;
    },
    /**
     * @description sVal에 해당되는 값을 찾아서 리턴한다.
     * @method getDisplayValueByValue
     * @param {Rui.util.LCollection} items 찾고자 하는 컬렉션 객체
     * @param {Sring} displayValue 찾고자하는 display값
     * @return {String}
     */
    getDisplayValueByValue: function(items, sVal) {
    	var rVal = '';
    	for (var j = 0, len = sVal.length; j < len; j++) {
            for (var i = 0, len1 = items.length; i < len1 ; i++) {
                var r = items.getAt(i);
                if(r.get(this.valueField) === sVal[j]) {
                    rVal = rVal + r.get(this.displayField) + this.separator;
                    break;
                }
            }
    	}
    	if(rVal.length > 0) rVal = rVal.substring(0, rVal.length - 1);
    	return rVal;
    },
    /**
     * @description 값을 변경한다. 멀티로 선택할 경우에는 구분자 값(생성자 속성:separator)으로 처리해야 한다.
     * @method setValue
     * @public
     * @param {String} o 반영할 값 문자
     * @return {void}
     */
    setValue: function(o, ignore) {
        o = o || '';
        if(!this.hiddenInputEl) return;
        if(this.hiddenInputEl.dom.value === o) return;
        o = Rui.util.LString.trim((o + ''));
        var ds = this.dataSet;
        if(this.bindMDataSet && this.bindMDataSet.getRow() > -1 && ds.isLoad !== true) return;
        this._ignoreEvent = !!ignore;
        var s = []; 
        var valuesMap = {};
        if(o.length > 0) {
            s = o.split(this.separator);
            for (var i = 0, len = s.length ; i < len; i++) {
                valuesMap[s[i]] = true;
            }
        }
        if(ds) {
            if(s.length === ds.getCount()) {
                ds.setMarkAll(true);
            } else if(s.length === 0) {
                if(ds.getMarkedCount() !== 0) ds.setMarkAll(false);
            }else {
                for (var i = 0, len = ds.getCount(); i < len; i++) {
                    var currVal = ds.getNameValue(i, this.valueField);
                    ds.setMark(i, valuesMap[currVal] === true ? true : false);
                }
            }
            this.updateValues();
        }
        this._ignoreEvent = false;
    },
    setDataSet: function(d) {
        this.dataSet.unOn('marked', this.onMarked, this, true);
        this.dataSet.unOn('allMarked', this.onAllMarked, this, true);
        Rui.ui.form.LMultiCombo.superclass.setDataSet.call(this, d);
        this.dataSet.on('marked', this.onMarked, this, true);
        this.dataSet.on('allMarked', this.onAllMarked, this, true);
    }
});