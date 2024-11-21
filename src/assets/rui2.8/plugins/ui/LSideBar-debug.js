/*
 * @(#) LSideBar-debug.js
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
 * @description 스크롤되지 않고 고정된 영역의 Bar를 관리한다. 
 * @namespace Rui.ui
 * @plugin
 * @class LSideBar
 * @extends Rui.ui.LUIComponent
 * @sample default
 * @constructor LSideBar
 * @param {Object} config The intial LSideBar.
 */
Rui.ui.LSideBar = function(config) {
    Rui.ui.LSideBar.superclass.constructor.call(this, config);
};
Rui.extend(Rui.ui.LSideBar, Rui.ui.LUIComponent, {
    /**
     * @description side bar에 놓여질 컨텐츠의 좌측 마진 값을 설정한다 (px)
     * @config x
     * @sample default
     * @type {int}
     * @default 0
     */
    /**
     * @description side bar에 놓여질 컨텐츠의 좌측 마진 값을 설정한다 (px)
     * @property x
     * @type {int}
     * @default 0
     */
    x: 0,
    /**
     * @description side bar에 놓여질 컨텐츠의 상단 마진 값을 설정한다 (px)
     * @config y
     * @sample default
     * @type {int}
     * @default 0
     */
    /**
     * @description side bar에 놓여질 컨텐츠의 상단 마진 값을 설정한다 (px)
     * @property y
     * @type {int}
     * @default 0
     */
    y: 0,
    /**
     * @description side bar가 고정될 형태를 지정한다. 
     * [static, vertical, horizontal]을 지정할 수 있다.
     * @config type
     * @sample default
     * @type {String}
     * @default 1
     */
    /**
     * @descriptionside bar가 고정될 형태를 지정한다. 
     * [static, vertical, horizontal]을 지정할 수 있다.
     * @property type
     * @type {String}
     * @default 1
     */
    type: 'vertical',
    /**
     * @description pager 기본 구조 dom 생성
     * @method initEvents
     * @protected
     * @return {void}
     */
    initEvents: function() {
        Rui.util.LEvent.addListener(window, "scroll", this.onScrollY, this, true);
    },
    /**
     * @description pager 기본 구조 dom 생성
     * @method renderMaster
     * @protected
     * @return {void}
     */
    onScrollY: function(e) {
        if(this.type == 'vertical' || this.type == 'static') {
            var scrollTop = Math.max(document.documentElement.scrollTop, document.body.scrollTop);
            this.el.setTop(scrollTop + this.y);
        }
        if(this.type == 'horizontal' || this.type == 'static') {
            var scrollLeft = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
            this.el.setLeft(scrollLeft + this.x);
        }
    },
    /**
     * @description pager 기본 구조 dom 생성
     * @method initEvents
     * @protected
     * @return {void}
     */
    afterRender: function(appendToNode){
        this.el.setStyle('position', 'absolute');
        this.el.setTop(this.y);
        this.el.setLeft(this.x);
    }
});
