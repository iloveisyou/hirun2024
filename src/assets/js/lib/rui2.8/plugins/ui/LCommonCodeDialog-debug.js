/*
 * @(#) LCommonCodeDialog-debug.js
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
 * LCommonCodeDialog 예제 입니다. 
 * 이 플러그인을 복사하여 프로젝트 환경에 맞게 재구성 하세요.
 * @namespace Rui.ui
 * @plugin js,css
 * @class LCommonCodeDialog
 * @extends Rui.ui.LBasicDialog
 * @constructor LCommonCodeDialog
 * @param {Object} config The intial LCommonCodeDialog.
 */
Rui.ui.LCommonCodeDialog = function(config) {
    Rui.ui.LCommonCodeDialog.superclass.constructor.call(this, config);

	this.appendSuccessDelegator = Rui.util.LFunction.createDelegate(this.onAppendSuccess, this);
	
};
Rui.extend(Rui.ui.LCommonCodeDialog, Rui.ui.LBasicDialog, {
    /**
     * @description 기본 CSS
     * @property CSS_BASIC
     * @private
     * @type {String}
     */
    CSS_BASIC: 'L-common-dialog',
    /**
     * @description dialog title
     * @property title
     * @private
     * @type {String}
     */
    title: 'Dialog',
    /**
     * @description 포함할 페이지 url
     * @property url
     * @private
     * @type {String}
     */
    url: './codeDialogSubSample.html',
    /**
     * @description Dialog와 함께 생성될 TextBox의 width
     * @property textboxWidth
     * @private
     * @type {String}
     */
    textboxWidth: 100,
    /**
     * @description Dialog와 함께 생성될 TextBox의 id
     * @property textboxId
     * @private
     * @type {String}
     */
    textboxId: null,
    /**
     * @description body html 생성
     * @method getBodyHtml
     * @private
     * @return {String}
     */
    getBodyHtml: function() {
        this.templates = new Rui.LTemplate('<div id="' + this.id + 'Dialog"></div>');
        return this.templates.apply();
    },
    /**
     * @description dialog를 초기화한다.
     * @method initView
     * @protected
     * @return void
     */
    initView: function() {
        Rui.ui.LCommonCodeDialog.superclass.initView.call(this);
        this.dialog.on('show', this.onShow, this, true);
    },
    /**
     * @description render후 호출되는 메소드
     * @method afterRender
     * @protected
     * @param {Rui.LElement} container 부모 el 객체
     * @return void
     */
    afterRender : function(el) {
        var textBoxId = this.textboxId || this.id + 'Value';

        this.el.html('<div id="'+textBoxId+'"></div>');
        var textbox = new Rui.ui.form.LPopupTextBox({
            applyTo: textBoxId,
            width: this.textboxWidth,
            useHiddenValue: true,
            enterToPopup: true
        });
        textbox.on('popup', function(){
            this.showDialog();
        }, this, true);
        
        this.popupTextBox = textbox;
    },
    /**
     * @description dialog에서 apply 버튼을 클릭했을 경우 handle
     * @method onHandleApply
     * @protected
     * @return {void}
     */
    onHandleApply: function() {
        this.applyDialog();
    },
    /**
     * @description dialog에서 apply를 수행하는 메소드
     * @method applyDialog
     * @protected
     * @return {void}
     */        
    applyDialog: function() {
        if(this.handleApply) {
            var resultValue = this.handleApply.call(this, { dialog: this });
            if(resultValue === false) return;
        }
        this.dialog.submit(true);
    },
    /**
     * @description dialog에서 cancel 버튼을 클릭했을 경우 handle
     * @method onHandleCancel
     * @protected
     * @return {void}
     */
    onHandleCancel: function() {
        this.dialog.cancel();
        this.popupTextBox.focus();
    },
    /**
     * @description dialog에서 show 이벤트 처리할 경우 handle
     * @method onShow
     * @protected
     * @return {void}
     */
    onShow: function(e) {
        var params = {
                dialogId: this.id + 'Dialog',
                value: this.popupTextBox.getValue()
            }
        if(!this.bodyRendered) {
            Rui.get(this.id + 'Dialog').appendChildByAjax({
                url: this.url,
                cache: false,
                params: params,
                success: this.appendSuccessDelegator
            });

            window.currentParentDialog = this;
            
            this.bodyRendered = true;
        }
        this.lastParams = params;
    },
	onAppendSuccess: function(){
    	Rui.later(1, this, function(){
    		this.dialog.center();
    	});
	},
});

window.getParentDialog = function() {
    return window.currentParentDialog;
};