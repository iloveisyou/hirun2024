/*
 * @(#) LFrameDialog-debug.js
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
 * @description IFRAME으로 채워지는 Dialog
 * Dialog내부 BODY의 컨텐츠를 IFRAME을 이용하여 구성하며, 이 IFRAME에 URL을 지정하여 화면에 출력한다.
 * 
 * @namespace Rui.ui
 * @plugin js,css
 * @class LFrameDialog
 * @extends Rui.ui.LDialog
 * @sample default
 * @constructor LFrameDialog
 * @param {Object} config The intial LFrameDialog.
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
    /**
     * @description Dialog의 Title
     * @config title
     * @sample default
     * @type {String}
     * @default 'Dialog'
     */
    /**
     * @description Dialog의 Title
     * @property title
     * @private
     * @type {String}
     */
    title: 'Dialog',
    /**
     * @description IFrame의 contentWindow에 FrameDialog 객체를 전달할 Interval 값
     * FrameDialog 내부에 생성되는 IFrame에 컨텐츠가 준비되면 이 FrameDialog 객체를 IFrame내 contentWindow에 전달하여 컨텐츠내에서 사용할 수 있어야 한다.
     * 이때 전달할 시점을 정하는 Timer의 interval값
     * @config hostDialogDeliveryInterval
     * @sample default
     * @type {int}
     * @default 100
     */
    /**
     * @description IFrame의 contentWindow에 FrameDialog 객체를 전달할 Interval 값
     * @description dialog의 border width 값
     * @property hostDialogDeliveryInterval
     * @private
     * @type {int}
     */
    hostDialogDeliveryInterval: 100,
    /**
     * @description dialog의 border width 값
     * @property borderWidth
     * @private
     * @type {int}
     */
    borderWidth: 1,
    /**
     * @description frame의 width값
     * @property frameWidth
     * @private
     * @type {int}
     */
    frameWidth: 400,
    /**
     * @description frame의 height값
     * @property frameHeight
     * @private
     * @type {int}
     */
    frameHeight: 250,
    /**
     * frameDialog의 config가 초기화시 호출되는 메소드 
     * @method initDefaultConfig
     * @private
     */
    initDefaultConfig: function () {
        Rui.ui.LFrameDialog.superclass.initDefaultConfig.call(this);
        /**
         * Specifies whether the Module is visible on the page.
         * @config visible
         * @type Boolean
         * @default true
         */
        this.cfg.addProperty('url', {
            handler: this.configUrl, 
            value: ''
        });
    },
    /**
     * @description Dom객체 생성 및 초기화하는 메소드
     * @method initComponent
     * @protected
     * @param {Object} config 환경정보 객체 
     * @return {void}
     */
    initComponent: function(config){
         Rui.ui.LFrameDialog.superclass.initComponent.call(this, config);
          this.templates = new Rui.LTemplate(
                     "<iframe frameborder='0' src='{url}'></iframe>"
                 );
    }, 
    /**
     * @description 객체의 이벤트 초기화 메소드
     * @method initEvents
     * @protected
     * @return {void}
     */
    initEvents: function(){
         Rui.ui.LFrameDialog.superclass.initEvents.call(this);
         this.on('changeContent', this.onChangeContent, this, true);
    }, 
    /**
     * content의 내용이 변경되면 호출되는 이벤트 
     * @method onChangeContent
     * @private
     * @param {Object} e event객체
     */
    onChangeContent: function(e) {
        if(this.body) {
            this.center();
        }
    },
    /**
     * url 속성 변경시 호출 
     * @private 
     * @param {String} type The LCustomEvent type (usually the property name)
     * @param {Object[]} args The LCustomEvent arguments. For configuration 
     * handlers, args[0] will equal the newly applied value for the property.
     * @param {Object} obj The scope object. For configuration handlers, 
     * this will usually equal the owner.
     * @method configUrl
     */
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
            } catch(e){ /* cross domain error */ }
        }
        return this;
    },
    /**
     * @description body html 생성
     * @method getBodyHtml
     * @private
     * @return {String}
     */
    getBodyHtml: function() {
        var p = {
            url: this.cfg.getProperty('url')
        };
        return this.templates.apply(p);
    },
    /**
     * @description 객체 render
     * @method afterRender
     * @private
     * @return {void}
     */
    afterRender: function(container) {
        Rui.ui.LFrameDialog.superclass.afterRender.call(this, container);
        
        this.setHeader(this.title);
        this.setBody(this.getBodyHtml());

        this.frameEl = Rui.get(this.body).select('iframe').getAt(0);
        
        this.setWidth(this.width);
        this.setHeight(this.height);
        Rui.get(this.element).addClass('L-frame-dialog');
    },
    /**
     * @description iframe의 window 객체를 리턴한다.
     * @method getFrameWindow
     * @return {HTMLElement}
     */
    getFrameWindow: function() {
        return this.frameEl.dom.contentWindow;
    },
    /**
     * @description iframe의 document 객체를 리턴한다.
     * @method getFrameDocumentEl
     * @return {HTMLElement}
     */
    getFrameDocumentEl: function() {
        return new Rui.LElement(this.frameEl.dom.contentWindow.document);
    },
    /**
     * @description iframe에 url를 변경한다.
     * @method setUrl
     * @public
     * @parma {String} url 변경하고자 하는 url
     * @return {void}
     */
    setUrl: function(url) {
        this.cfg.setProperty('url', url);
    },
    /**
     * @description hide
     * @method hide
     * @public
     * @return {Object}
     */
    hide: function() {
        Rui.ui.LFrameDialog.superclass.hide.call(this);
        // id 잔상 남는 버그로 임시 해결
        try {
            this.getFrameWindow().document.body.style.zoom = '100%';
        } catch(e) {}
        return this;
    },
    /**
     * @description 다이얼로그의 너비 설정 
     * @method setWidth
     * @public
     * @param {int}
     * @return {Object}
     */
    setWidth: function(width) {
        if(this.frameEl){
            var bodyEl = Rui.get(this.body);
            this.frameWidth = width - bodyEl.getPadding('lr') - (this.borderWidth * 2);
            this.frameEl.setWidth(this.frameWidth);
        }
        Rui.ui.LFrameDialog.superclass.setWidth.call(this, width); 
        return this;
    },
    /**
     * @description 다이얼로그의 높이 설정 
     * @method setHeight
     * @public
     * @param {int}
     * @return {Object}
     */
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
    /**
     * close 아이콘을 위한 이벤트 핸들러
     * @method _doClose
     * @protected
     * @param {DOMEvent} e
     */
    _doClose: function (e) {
        Rui.util.LEvent.preventDefault(e);
        this.cancel(false);
    }
});
