/*
 * @(#) LFrameDialog.js
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

Rui.ui.LFrameDialog = function(config) {
    config = config || {};
    config.width = config.width || this.frameWidth;
    config.height = config.height || this.frameHeight;
    this.title = config.title || this.title;
    Rui.ui.LFrameDialog.superclass.constructor.call(this, config);
    this.createEvent('ready');
};
Rui.ui.LFrameDialog.getHostDialog = function() {
    return window._hostDialog;
};
Rui.extend(Rui.ui.LFrameDialog, Rui.ui.LDialog, {
    title: 'Dialog',
    hostDialogDeliveryInterval: 100,
    borderWidth: 1,
    frameWidth: 400,
    frameHeight: 250,
    initDefaultConfig: function () {
        Rui.ui.LFrameDialog.superclass.initDefaultConfig.call(this);
        this.cfg.addProperty('url', {
            handler: this.configUrl, 
            value: ''
        });
    },
    initComponent: function(config){
         Rui.ui.LFrameDialog.superclass.initComponent.call(this, config);
          this.templates = new Rui.LTemplate(
                     "<iframe frameborder='0' src='{url}'></iframe>"
                 );
    }, 
    initEvents: function(){
         Rui.ui.LFrameDialog.superclass.initEvents.call(this);
         this.on('changeContent', this.onChangeContent, this, true);
    }, 
    onChangeContent: function(e) {
        if(this.body) {
            this.center();
        }
    },
    configUrl: function (type, args, obj) {
        var url = args[0];
        if(this.frameEl) {
        	Rui.util.LEvent.on(this.frameEl.dom, 'load', function(){
        		var later = Rui.later(this.hostDialogDeliveryInterval, this, function() {
        			var win = this.frameEl.dom.contentWindow;
        			if(win.document.body && win.document.readyState === 'complete') {
        				win._hostDialog = this;
        				later.cancel();
        				this.fireEvent('ready', {target: this, frameWindow: this.getFrameWindow()});
        			}
        		}, this, true);
        	}, this, true);
            this.frameEl.dom.src = url;
            try{
                if(this.frameEl.dom.contentDocument && this.frameEl.dom.contentDocument.body)
                    this.frameEl.dom.contentDocument.body.style.display = 'none';
            } catch(e){  }
        }
        return this;
    },
    getBodyHtml: function() {
        var p = {
            url: this.cfg.getProperty('url')
        };
        return this.templates.apply(p);
    },
    afterRender: function(container) {
        Rui.ui.LFrameDialog.superclass.afterRender.call(this, container);
        this.setHeader(this.title);
        this.setBody(this.getBodyHtml());
        this.frameEl = Rui.get(this.body).select('iframe').getAt(0);
        this.setWidth(this.width);
        this.setHeight(this.height);
        Rui.get(this.element).addClass('L-frame-dialog');
    },
    getFrameWindow: function() {
        return this.frameEl.dom.contentWindow;
    },
    getFrameDocumentEl: function() {
        return new Rui.LElement(this.frameEl.dom.contentWindow.document);
    },
    setUrl: function(url) {
        this.cfg.setProperty('url', url);
    },
    hide: function() {
        Rui.ui.LFrameDialog.superclass.hide.call(this);
        try {
            this.getFrameWindow().document.body.style.zoom = '100%';
        } catch(e) {}
        return this;
    },
    setWidth: function(width) {
        if(this.frameEl){
            var bodyEl = Rui.get(this.body);
            this.frameWidth = width - bodyEl.getPadding('lr') - (this.borderWidth * 2);
            this.frameEl.setWidth(this.frameWidth);
        }
        Rui.ui.LFrameDialog.superclass.setWidth.call(this, width); 
        return this;
    },
    setHeight: function(height) {
        if(this.frameEl){
            var headerEl = Rui.get(this.header),
                bodyEl = Rui.get(this.body),
                footerEl = Rui.get(this.footer);
            this.frameHeight = height - headerEl.getHeight() - footerEl.getHeight() - bodyEl.getPadding('tb') - (this.borderWidth * 2);
            this.frameEl.setHeight(this.frameHeight);
        }
        Rui.ui.LFrameDialog.superclass.setHeight.call(this, height); 
        return this;
    },
    _doClose: function (e) {
        Rui.util.LEvent.preventDefault(e);
        this.cancel(false);
    }
});
