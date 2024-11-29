/*
 * @(#) LFileBox-debug.js
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
 * @description 파일 첨부용 input box
 * LFileBox
 * @namespace Rui.ui.form
 * @plugin js,css
 * @class LFileBox
 * @extends Rui.ui.form.LTextBox
 * @constructor LFileBox
 * @sample default
 * @param config {Object} The intial LFileBox. 
 */
Rui.ui.form.LFileBox = function(config) {
    config = Rui.applyIf(config || {}, Rui.getConfig().getFirst('$.ext.fileBox.defaultProperties'));
    Rui.ui.form.LFileBox.superclass.constructor.call(this, config);
};
Rui.extend(Rui.ui.form.LFileBox, Rui.ui.form.LTextBox, {
    /**
     * @description 객체의 문자열
     * @property otype
     * @private
     * @type {String}
     */
    otype: 'Rui.ui.form.LFileBox',
    /**
     * @description 기본 CSS명
     * @property CSS_BASE
     * @private
     * @type {String}
     */
    CSS_BASE: 'L-filebox',
    /**
     * @description 가로 길이
     * <p>Sample: <a href="./../sample/general/ui/form/textboxSample.html" target="_sample">보기</a></p>
     * @config width
     * @type {int}
     * @default 200
     */
    /**
     * @description 가로 길이
     * @property width
     * @private
     * @type {String}
     */
    width: 200,
    /**
     * @description Picker Icon의 width
     * 기본값은 20이며 CSS에서 icon width를 변경할 경우 이 값도 동일하게 변경하여야 합니다.
     * @config iconWidth
     * @type {int}
     * @default 80
     */
    /**
     * @description Picker Icon의 width
     * 기본값은 20이며 CSS에서 icon width를 변경할 경우 이 값도 동일하게 변경하여야 합니다.
     * @property iconWidth
     * @private
     * @type {int} 
     */ 
    buttonWidth: 80,
    /**
     * @description iconMarginLeft, input과 달력 icon간의 간격
     * @config buttonMarginLeft
     * @type {int}
     * @default 0
     */
    /**
     * @description iconMarginLeft, input과 달력 icon간의 간격
     * @property buttonMarginLeft
     * @private
     * @type {int} 
     */ 
    buttonMarginLeft: 1,
    /**
     * @description 파일명
     * @property fileName
     * @private
     * @type {String}
     */
    fileName: 'fileName',
    /**
     * @description blur시 contains 체크를 할지 여부
     * @property checkContainBlur
     * @private
     * @type {Boolean}
     */
    checkContainBlur : true,
    /**
    * @description 버튼의 글자
    * @config title
    * @type {String}
    * @default Browse...
    */
    /**
    * @description 버튼의 글자
    * @property title
    * @private
    * @type {String}
    */
    title: 'Browse...',
    /**
     * @description input박스에 키 입력이 가능한지 여부, 변경이 불가능한 읽기 전용 속성은 LUIComponent에 있는 disabled로 처리
     * @property editable
     * @private
     * @type {boolean}
     */
    editable: false,
    /**
     * @description Dom객체 생성
     * @method createTemplate
     * @private 
     * @param {String|Object} el 객체의 아이디나 객체
     * @return {Rui.LElement} Element 객체
     */
    createTemplate: function() {
        this.template = new Rui.LTemplate(
            '<input id="{inputId}" type="text" name="{fileName}Input" class="{cssBase}-text">',
            '<button id="{btnId}" type="button" class="{cssBase}-button">{title}</button>',
            '<input id="{fileId}" type="file" name="{fileName}" class="{cssBase}-input">'
        );
    },
    /**
     * @description render시 발생하는 메소드
     * @method doRender
     * @protected
     * @param {HttpElement} appendToNode 부모 객체
     * @return {void}
     */
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
    /**
     * @description render 후 호출하는 메소드
     * @method afterRender
     * @protected
     * @param {HttpElement} container 부모 객체
     * @return {String}
     */
    afterRender: function(container) {
        //Rui.ui.form.LFileBox.superclass.afterRender.call(this, container);
        this.fileEl.on('change', this.onChange, this, true);
        this.inputEl.dom.readOnly = true;
        
//        var labels = Rui.select('label[for='+this.id+']');
//        for (var i = 0, len = labels.length; i < len; i++){
//            labels.getAt(i).setAttribute('for', this.fileEl.dom.id).addClass('L-label');
//        }
        this.setPlaceholder();
    },
    /**
     * @description dom value change handler
     * @method onChange
     * @protected
     * @param {Event} e handler 이벤트
     * @return void
     */
    onChange: function(e){
        var value = this.fileEl.getValue(),
            fileName = value;
        var idx = fileName.lastIndexOf('\\');
        if(idx > -1) fileName = fileName.substring(idx + 1);
        this.getDisplayEl().setValue(fileName);
        this.fireEvent('changed', {target: this, value: this.getValue(), displayValue: this.getDisplayValue(), files: this.fileEl.dom.files});
    },
    /**
     * @description 선택된 값을 반환
     * @method getValue
     * @public
     * @return {String} 결과값
     */
    getValue: function() {
        return this.fileEl.getValue();
    },
    /**
     * @description width 속성에 따른 실제 적용 메소드
     * @method _setWidth
     * @protected
     * @param {String} type 속성의 이름
     * @param {Array} args 속성의 값 배열
     * @param {Object} obj 적용된 객체
     * @return void
     */
    _setWidth: function(type, args, obj) {
    	if(args[0] < 0) return;
        Rui.ui.form.LFileBox.superclass._setWidth.call(this, type, args, obj);
        var cw = this.getContentWidth();
        this.getDisplayEl().setWidth(this.getContentWidth() - (this.buttonEl.getWidth() || this.buttonWidth) - this.buttonMarginLeft);
        this.fileEl.setWidth(cw);
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
            this.fileEl.dom.disabled = false;
        } else {
            this.fileEl.dom.disabled = true;
        }
        Rui.ui.form.LFileBox.superclass._setDisabled.call(this, type, args, obj);
    },
    /**
     * @description 화면 출력되는 객체 리턴
     * @method getDisplayEl
     * @protected
     * @return {Rui.LElement} Element 객체
     */
    getDisplayEl: function() {
        return this.inputEl || this.el;
    },
    /**
     * @description 객체를 destroy한다.
     * @method destroy
     * @public
     * @return {void}
     */
    destroy: function(){
        this.fileEl.unOn('change', this.onChange, this);
        Rui.ui.form.LFileBox.superclass.destroy.call(this);
    }
});
