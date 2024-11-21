/*
 * @(#) LFileUploadPanel-debug.js
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
 * @description 파일을 첨부하여 서버로 업로드하는데 필요한 업로드용 panel
 * LFileUploadPanel
 * @namespace Rui.ui
 * @plugin
 * @class LFileUploadPanel
 * @extends Rui.ui.LCommonPanel
 * @constructor LFileUploadPanel
 * @param {Object} oConfig The intial LFileUploadPanel.
 */
Rui.ui.LFileUploadPanel = function(oConfig) {
    Rui.ui.LFileUploadPanel.superclass.constructor.call(this, oConfig);
};

Rui.extend(Rui.ui.LFileUploadPanel, Rui.ui.LCommonPanel, {

    /**
    * @description 기본 CSS
    * @property CSS_BASIC
    * @private
    * @type {String}
    */
    CSS_BASIC: 'L-file-upload-panel',
    
    isSecure: false,
    
    uploadUrl: 'consoleLog.dev',
    
    validate: Rui.emptyFn,
    
    success: Rui.emptyFn,
    
    /**
    * @description dialog를 초기화한다.
    * @method initView
    * @protected
    * @param {Object} oConfig 환경정보 객체
    * @return void
    */
    initView: function(oConfig){

        this.el.html(this.getBodyHtml());
        
        this.blockFileInputEl = this.el.select('#block' + this.id + '-input').getAt(0);
        
        this.formEl = this.el.select('.L-file-upload-form').getAt(0);
        
        var fileBox = new Rui.ui.form.LFileBox({
            id: this.id + 'fileBox',
            renderTo: this.id + 'fileBox'
        });

        var uploadBtn = new Rui.ui.LButton(this.id + 'Upload');
        uploadBtn.on('click', function(e){
            if(fileBox.getValue() == '') {
                alert('파일을 선택하세요.');
                return;
            }
            
            if(this.validate(fileBox.getValue()) === false) 
                return;

            var uploadHandler = Rui.util.LFunction.createDelegate(function(e) {
                this.success({ conn: e, value: fileBox.getValue() });
                fileBox.setValue('');
                this.hide();
            }, this);
            
            Rui.LConnect.setForm(this.formEl.dom, true, this.isSecure);
            Rui.LConnect.asyncRequest('POST', this.uploadUrl, {
                upload: uploadHandler
            });
            
        }, this, true);
        
        var closeBtn = new Rui.ui.LButton(this.id + 'Close');
        closeBtn.on('click', function(e){
            this.hide();
        }, this, true);
        
        this.isViewRendered = true;
    },
    
    /**
    * @description body html 생성
    * @method getBodyHtml
    * @private
    * @return {String}
    */
    getBodyHtml: function() {
        this.templates = new Rui.LTemplate(
            "<div id='{blockFileInput}'>",
            "<form name='fileUploadFrm' method='post' action='/consoleLog.dev' class='L-file-upload-form'>",
            "    <div id='" + this.id + "fileBox'></div>",
            "</form>",
            "<button id='" + this.id + "Upload'>upload</button>",
            "<button id='" + this.id + "Close'>Close</button>",
            "</div>"
        );
        
        var p = {
            blockFileInput: 'block' + this.id + '-input',
            blcokGridId: 'block' + this.id + '-grid'
        };

        return this.templates.apply(p);
    },
    
    /**
    * @description 객체 render
    * @method render
    * @private
    * @return {void}
    */
    render: function(el) {
        this.el = Rui.get(el);
        this.el.addClass(this.CSS_BASIC);
        this.afterRender(this.el);
        this.hide();
    },

    
    /**
    * @description 객체 render
    * @method show
    * @public
    * @return {void}
    */
    show: function(useAnim) {
        this.el.show(useAnim);
    },

    /**
    * @description 객체 render
    * @method hide
    * @public
    * @return {void}
    */
    hide: function(useAnim) {
        this.el.hide(useAnim);
    }
});
