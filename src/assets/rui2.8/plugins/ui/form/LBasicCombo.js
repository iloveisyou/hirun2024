/*
 * @(#) LBasicCombo.js
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

Rui.ui.form.LBasicCombo = function(config){
    config = config || {}; 
    Rui.ui.form.LBasicCombo.superclass.constructor.call(this, config);
};
Rui.extend(Rui.ui.form.LBasicCombo, Rui.ui.form.LCombo, {
    otype: 'Rui.ui.form.LBasicCombo',
    forceSelection: false,
    createComboTemplete: function(el){
        var elContainer = el;
        var parent = null;
        if(elContainer.dom.tagName == 'DIV') {
            parent = elContainer.parent();
            var select = document.createElement('select');
            parent.appendChild(select);
            elContainer.removeNode();
            elContainer = Rui.get(select);            
        }
        elContainer.addClass(this.CSS_BASE);
        elContainer.addClass('L-fixed');
        this.el = elContainer;
        this.inputEl = elContainer;
        this.hiddenInputEl = elContainer;
        return elContainer;
    },
    initFocus: function(){
    },
    createOptionDiv: function(){
        if(this.useDataSet === true){
            var inputEl = this.getDisplayEl();
            var optionDiv = document.createElement('div');
            optionDiv.id = Rui.id();
            this.optionDivEl = Rui.get(optionDiv);
            this.optionDivEl.setWidth(this.listWidth);
            this.optionDivEl.addClass(this.CSS_BASE + '-list-wrapper-nobg');
            this.optionDivEl.addClass('L-hide-display');
            this.optionDivEl.on('click', function(e) {
                this.collapseIf(e);
                inputEl.focus(); 
            }, this, true);
            if(this.listRenderer) this.optionDivEl.addClass('L-custom-list');
            document.body.appendChild(optionDiv);
        }
    },
    afterRender: function(container){
        Rui.ui.form.LBasicCombo.superclass.afterRender.call(this, container);
        this.inputEl.on('change', function(e){
            var row = this.inputEl.dom.selectedIndex;
            row = (this.useEmptyText === true) ? row - 1 : row;
            this.dataSet.setRow(row);
        }, this, true);
        this.dataSet.setRow(this.forceSelection === true ? 0 : -1);
        this.applyEmptyText();
    },
    doDataChangedDataSet: function() {
        this.removeAllItem();
        if(this.useEmptyText === true) 
            this.createEmptyText();
        if(this.optionDivEl) {
            var DEL = Rui.data.LRecord.STATE_DELETE,
                dataSet = this.dataSet;
            for (var i = 0 ; i < this.dataSet.getCount() ; i++) {
                if(DEL == dataSet.getState(i))
                    continue;
                var optionEl = this.createItem({
                    record: this.dataSet.getAt(i)
                });
                this.appendOption(optionEl.dom);
            }
            this._itemRendered = true;
        }
        if(this.autoComplete) this.optionAutoHeight();
    },
    _setWidth: function(type, args, obj){
        var width = args[0];
        if (!Rui.isBorderBox) {
            this.el.setWidth(width);
        } else {
            this.el.setWidth(width - 4);
        }
        this.width = width;
        this.cfg.setProperty('width', this.width, true);
    },
    appendOption: function(dom){
        this.getDisplayEl().appendChild(dom);        
    },
    removeAllItem: function(){
        this.getDisplayEl().html('');
    },
    createItem: function(e){
        var record = e.record;
        var codeValue = record.get(this.valueField);
        var displayValue = record.get(this.displayField);
        var option = document.createElement('option');
        var optionEl = Rui.get(option);
        option.value = codeValue;
        var txtNode = document.createTextNode(displayValue);
        optionEl.appendChild(txtNode);
        return optionEl;
    },
    insertEmptyText: function(dom){
        if(this.optionDivEl.dom.childNodes.length > 0)
            Rui.util.LDom.insertBefore(dom, this.inputEl.dom.childNodes[0]);
        else
            this.inputEl.appendChild(dom);
    },
    getValue: function() {
        return (this.inputEl.dom.selectedIndex > -1) ? this.inputEl.dom[this.inputEl.dom.selectedIndex].value : null;
    },
    getDisplayValue: function() {
        return (this.inputEl.dom.selectedIndex > -1) ? this.inputEl.dom[this.inputEl.dom.selectedIndex].text : '';
    },
    onRowPosChangedDataSet: function(e) {
        if(this.inputEl.dom.length > 0) return;
        var len = this.dataSet.getCount(); 
        if( this.inputEl.dom.length == 0 && len > 0 && !this._itemRendered ){
              if(this.useEmptyText === true) 
                    this.createEmptyText();
             for (var i = 0 ; i < this.dataSet.getCount() ; i++) {
                 var optionEl = this.createItem({
                     record: this.dataSet.getAt(i)
                 });
                 this.appendOption(optionEl.dom);
             }
             this._itemRendered = true;
         }
        if(this.inputEl.dom.length == 0) return; 
        var row = (this.useEmptyText === true) ? e.row + 1 : e.row;
        this.setValue(row < 0 ? '' : this.inputEl.dom[row].value);
        this.fireEvent('changed', {target:this, value:this.getValue(), displayValue:this.getDisplayValue()});
    },
    setValue: function(o) {
        var row = this.dataSet.findRow(this.valueField, o);
        this.dataSet.setRow(row);
        row = (this.useEmptyText === true) ? row + 1 : row;
        if(this.inputEl.dom[row]) this.inputEl.dom[row].selected = true;
    },
    getRowEl: function(row) {
        row = (this.useEmptyText === true) ? row + 1 : row;
        return Rui.get(this.inputEl.dom[row]);
    },
    getOptionDiv: function() {
        return this.inputEl;
    },
    getDataIndex: function(h) {
        var optionList = this.inputEl.dom.options;
        var idx = -1;
        for (var i = 0, len = optionList.length; i < len ; i++){
            if(optionList[i].text == h) {
                idx = i;
                break;
            }            
        }
        if(idx > -1 && this.useEmptyText === true)
            idx--;
        return idx;
    }
});