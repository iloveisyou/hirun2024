/*
 * @(#) LGuideManager-debug.js
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
 * @description 화면 가이드를 지원하는 LGuide객체 관리자
 * @namespace Rui.ui
 * @plugin
 * @class LGuideManager
 * @extends Rui.ui.LUIComponent
 * @constructor LGuideManager 
 * @sample default
 * @param {Object} oConfig The intial LGuideManager.
 */
Rui.ui.LGuideManager = function(oConfig){
    oConfig = Rui.applyIf(oConfig, Rui.getConfig().getFirst('$.base.guide.defaultProperties'));
    
    Rui.applyObject(this, oConfig, true);
    this.config = oConfig;
    
    this.init();
};

Rui.ui.LGuideManager.prototype = {
    /**
     * @description 가이드 기능을 실행할 것인지 여부
     * @config showPageGuide
     * @type {boolean}
     * @default true
     */
    /**
     * @description 가이드 기능을 실행할 것인지 여부
     * @property showPageGuide
     * @private
     * @type {boolean}
     */
    showPageGuide: true,
    /**
     * @description 현재 페이지의 고유 문자열
     * @config pageName
     * @type {String}
     * @default null
     */
    /**
     * @description 현재 페이지의 고유 문자열
     * @property pageName
     * @private
     * @type {String}
     */
    pageName: null,
    /**
     * @description guide 스크립트가 포함된 js 파일(쓰지 않으면 pageName + '_guide.js'로 기본지정)
     * @config pageUrl
     * @type {String}
     * @default null
     */
    /**
     * @description guide 스크립트가 포함된 js 파일(쓰지 않으면 pageName + '_guide.js'로 기본지정)
     * @property pageUrl
     * @private
     * @type {String}
     */
    pageUrl: null,
    /**
     * @description Rui.webdb.LWebStorage 객체
     * @config webStore
     * @type {Rui.webdb.LWebStorage}
     * @default null
     */
    /**
     * @description Rui.webdb.LWebStorage 객체
     * @property webStore
     * @private
     * @type {Rui.webdb.LWebStorage}
     */
    webStore: null,
    /**
     * @description params 객체
     * @config params
     * @type {Object}
     * @default null
     */
    /**
     * @description params 객체
     * @property params
     * @private
     * @type {Object}
     */
    params: null,
    /**
     * @description 초기화 메소드
     * @method init
     * @private
     * @return {void}
     */
    init: function() {
        if(!this.webStore)
            this.webStore = new Rui.webdb.LWebStorage();
        if(this.showPageGuide) {
            if(this.webStore.getBoolean('showGuide_' + this.pageName, false) === false) {
                var ruiPath = Rui.getRootPath();
                Rui.includeJs(ruiPath + '/plugins/ui/LNotification.js', true);
                Rui.includeJs(ruiPath + '/plugins/ui/LNotificationManager.js', true);
                Rui.includeJs(ruiPath + '/plugins/ui/LFocusNotification.js', true);
                Rui.includeJs(ruiPath + '/plugins/ui/LGuide.js', true);
                Rui.includeCss(ruiPath + '/plugins/ui/LFocusNotification.css', true);
                
                if(!this.pageUrl)
                    this.pageUrl = './' + this.pageName + '_guide.js';
                Rui.namespace('Rui.ui.guide');
                Rui.includeJs(this.pageUrl, true);
                var guideClassName = 'Rui.ui.guide.' + Rui.util.LString.firstUpperCase(this.pageName);
                var cls = null;
                try {
                    var obj = eval(guideClassName);
                    this.guide = new obj(this.config);
                    this.guide.webStore = this.webStore;
                } catch (e) {
                    alert('Guide class name is wrong : ' + guideClassName);
                }
                this.guide.onReady();
            }
        }
    },
    /**
     * @description 현재 페이지의 가이드 상태 정보를 모두 초기화한다.
     * @method clear
     * @return {void}
     */
    clear: function() {
        var guideKeys = this.webStore.get('gm_' + this.pageName + '_guide_keys', '');
        var keys = guideKeys.split('|');
        for (var i = 0, len = keys.length; i < len; i++) {
            this.webStore.remove('gm_' + this.pageName + '_' + keys[i]);
        }
    },
    /**
     * @description 사용자 가이드 메소드를 호출한다.
     * @method invokeGuideFn
     * @param {String} name 호출할 메소드 명
     * @return {void}
     */
    invokeGuideFn: function(name) {
        if(!this.guide) return;
        var fn = this.guide[name];
        if(fn) {
            fn.call(this.guide);
        } else {
            alert(name + ' Guide method name is wrong');
        }
    },
    /**
     * @description params 정보를 추가한다.
     * @method addParams
     * @param {Object} params params 정보
     * @return {void}
     */
    addParams: function(params) {
        this.params = Rui.applyIf(this.params, params);
        this.guide.params = this.params;
    }
};