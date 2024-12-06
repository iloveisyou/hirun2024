/*
 * @(#) LFileBox.js
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

Rui.ui.form.LFileBox = function(config) {
    config = Rui.applyIf(config || {}, Rui.getConfig().getFirst('$.ext.fileBox.defaultProperties'));
    Rui.ui.form.LFileBox.superclass.constructor.call(this, config);
};
Rui.extend(Rui.ui.form.LFileBox, Rui.ui.form.LTextBox, {
    otype: 'Rui.ui.form.LFileBox',
    CSS_BASE: 'L-filebox',
    width: 200,
    buttonWidth: 80,
    buttonMarginLeft: 1,
    fileName: 'fileName',
    checkContainBlur : true,
    title: 'Browse...',
    editable: false,
    createTemplate: function() {
        this.template = new Rui.LTemplate(
            '<input id="{inputId}" type="text" name="{fileName}Input" class="{cssBase}-text">',
            '<button id="{btnId}" type="button" class="{cssBase}-button">{title}</button>',
            '<input id="{fileId}" type="file" name="{fileName}" class="{cssBase}-input">'
        );
    },
    doRender: function() {
        var p = {
            inputId: Rui.useFixedId() ? Rui.id(this.el, 'LFileBox-input-' + this.id) : Rui.id(),
            btnId: Rui.useFixedId() ? Rui.id(this.el, 'LFileBox-btn-' + this.id) : Rui.id(),
            fileId: Rui.useFixedId() ? Rui.id(this.el, 'LFileBox-file-' + this.id) : Rui.id(),
            cssBase: this.CSS_BASE,
            fileName: this.name || this.fileName,
            title: this.title
        };
        this.createTemplate();
        var html = this.template.apply(p);
        this.el.html(html);
        this.el.addClass(this.CSS_BASE);
        this.el.addClass('L-fixed');
        this.el.addClass('L-form-field');
        this.inputEl = this.el.select('.' + this.CSS_BASE + '-text').getAt(0);
        this.fileEl = this.el.select('.' + this.CSS_BASE + '-input').getAt(0);
        this.buttonEl = this.el.select('.' + this.CSS_BASE + '-button').getAt(0);
    },
    afterRender: function(container) {
        this.fileEl.on('change', this.onChange, this, true);
        this.inputEl.dom.readOnly = true;
        this.setPlaceholder();
    },
    onChange: function(e){
        var value = this.fileEl.getValue(),
            fileName = value;
        var idx = fileName.lastIndexOf('\\');
        if(idx > -1) fileName = fileName.substring(idx + 1);
        this.getDisplayEl().setValue(fileName);
        this.fireEvent('changed', {target: this, value: this.getValue(), displayValue: this.getDisplayValue(), files: this.fileEl.dom.files});
    },
    getValue: function() {
        return this.fileEl.getValue();
    },
    _setWidth: function(type, args, obj) {
    	if(args[0] < 0) return;
        Rui.ui.form.LFileBox.superclass._setWidth.call(this, type, args, obj);
        var cw = this.getContentWidth();
        this.getDisplayEl().setWidth(this.getContentWidth() - (this.buttonEl.getWidth() || this.buttonWidth) - this.buttonMarginLeft);
        this.fileEl.setWidth(cw);
    },
    _setDisabled: function(type, args, obj) {
        if(args[0] === false) {
            this.fileEl.dom.disabled = false;
        } else {
            this.fileEl.dom.disabled = true;
        }
        Rui.ui.form.LFileBox.superclass._setDisabled.call(this, type, args, obj);
    },
    getDisplayEl: function() {
        return this.inputEl || this.el;
    },
    destroy: function(){
        this.fileEl.unOn('change', this.onChange, this);
        Rui.ui.form.LFileBox.superclass.destroy.call(this);
    }
});
