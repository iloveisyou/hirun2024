/*
 * @(#) LFileUploadDialog.js
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

Rui.ui.LFileUploadDialog = function(config) {
    config = config || {};
    this.uploadDelegate = Rui.util.LFunction.createDelegate(this.onUpload, this);
    config = Rui.applyIf(config, {
        postmethod: 'async',
        visible: false,
        hideaftersubmit: false,
        callback: {
            upload: this.uploadDelegate
        },
        buttons : 
            [ 
                { text:"Upload", handler:this.handleSubmit, isDefault:true },
                { text:"Close", handler:this.handleCancel } 
            ]
    });
    this.activeTaskDelegate = Rui.util.LFunction.createDelegate(this.activeTask, this);
    this.updateProgressDelegate = Rui.util.LFunction.createDelegate(this.updateProgress, this);
    config = Rui.applyIf(config, Rui.getConfig().getFirst('$.ext.fileupload.defaultProperties'));
    this.url = config.url;
    this.useProgressBar = config.useProgressBar === true;
    Rui.ui.LFileUploadDialog.superclass.constructor.call(this, config);
    this.createEvent('success');
};
Rui.extend(Rui.ui.LFileUploadDialog, Rui.ui.LDialog, {
    isSecure: false,
    url: null,
    name: null,
    emptyMsg: null,
    useProgressBar: false,
    statusUrl: 'fileUploadStatus.jsp',
    params: null,
    delayTime: 500,
    onUpload: function(e) {
        this.formEl.dom.reset();
        if (this.useProgressBar) {
            this.setProgressValue(100); 
        }
        this.fireEvent('success', {target: this, conn: e, value: this.fileBox.getValue()});
        this.createFile(true);
        this.updateStatus(false);
        this.hide();
    },
    handleSubmit: function(e) {
        var value = this.fileBox.getValue();
        if(value == '') {
            Rui.alert(this.emptyMsg || Rui.getMessageManager().get('$.ext.msg023'));
            return;
        }
        this.updateStatus(true);
        Rui.LConnect._isFormSubmit = true;
        if(this.params) {
            Rui.select('.L-upload-parameters').remove();
            var html = '<div class="L-upload-parameters">';
            for (m in this.params) {
                var v = this.params[m];
                html += '<input type="hidden" name="' + m + '" value="' + v + '">';
            }
            html += '</div>';
            this.formEl.appendChild(html);
        }
        this.submit();
        if(this.useProgressBar) {
            this.startProgress();
        }
    },
    setParams: function(params) {
        this.params = params;
    },
    activeTask: function() {
        var uri = this.statusUrl;
        uri = Rui.util.LString.getTimeUrl(uri);
        Rui.LConnect.asyncRequest('GET', uri, {
            success: this.updateProgressDelegate,
            failure: Rui.util.LFunction.createDelegate(function(e) {
                Rui.alert(Rui.getMessageManager().get('$.base.msg101') + ' : ' + e.statusText);
            }, this)
        });
    },
    setProgressValue: function(percent) {
        this.progressMaskEl.setStyle('margin-left', percent + '%');
    },
    updateProgress: function(e) {
        try {
            var isUpdateStatus = this.isUpdateStatus() ;
            var percent = isUpdateStatus ? parseInt(e.responseText) : 100;
            this.setProgressValue(percent); 
            if(percent < 100 && isUpdateStatus)
                this.activeDelayedTask.delay(this.delayTime);
        } catch(e) {}
    },
    updateStatus: function(status) {
        var bodyEl = Rui.get(this.body);
        if (status) 
            bodyEl.addClass('upload-status');
        else
            bodyEl.removeClass('upload-status');
    },
    isUpdateStatus: function() {
        return Rui.get(this.body).hasClass('upload-status');
    },
    startProgress: function() {
        if(!this.activeDelayedTask)
            this.activeDelayedTask = new Rui.util.LDelayedTask(this.activeTaskDelegate);
        this.activeDelayedTask.delay(500);
    },
    handleCancel: function(e) {
        this.hide();
    },
    afterRender: function(bodyDom) {
        Rui.ui.LFileUploadDialog.superclass.afterRender.call(this, bodyDom);
        this.setHeader('File upload');
        this.setBody(this.getBodyHtml());
        this.createFile(false);            
        var bodyEl = Rui.get(this.body);
        this.formEl = bodyEl.select('.L-file-upload-form').getAt(0);
        this.progressMaskEl = bodyEl.select('.L-file-upload-progress-mask').getAt(0);
        this.formEl.dom.enctype = 'multipart/form-data';
        this.formEl.dom.encoding = 'multipart/form-data';
        this.on('show', this.onShow, this, true);
    },
    onShow: function(e){
        this.fileBox.focus();
        this.formEl.dom.reset();
    },
    createFile: function(isNew) {
        if(isNew) this.fileBox.destroy();
        this.fileBox = new Rui.ui.form.LFileBox({
            id: this.id + 'fileBox',
            width: 400,
            name: this.name,
            renderTo: this.id + 'fileBox'
        });
    },
    getBodyHtml: function() {
        this.templates = new Rui.LTemplate(
            "<div class='L-file-upload-progress L-file-upload-active-{active}'><div class='L-file-upload-progress-mask'></div></div>",
            "<form id='fileUploadFrm' name='fileUploadFrm' method='post' action='{url}' class='L-file-upload-form'>",
            "    <div id='" + this.id + "fileBox'></div>",
            "</form>"
        );
        var p = {
            url: this.url,
            active: this.useProgressBar,
            blockFileInput: 'block' + this.id + '-input',
            blcokGridId: 'block' + this.id + '-grid'
        };
        return this.templates.apply(p);
    },
    validate: function () {
        var isValid = Rui.ui.LFileUploadDialog.superclass.validate.call(this);
        if(this.useProgressBar) {
            this.setProgressValue(0);
        }
        this.updateStatus(false);
        return isValid;
    },
    getFileBox: function() {
        return this.fileBox;
    }, 
    getParams: function() {
        return this.params;
    },
    setParams: function(params) {
        this.params = params;
    },
    destroy: function(){
        this.unOn('show', this.onShow, this);
        Rui.ui.LFileUploadDialog.superclass.destroy.call(this);
    }
});
