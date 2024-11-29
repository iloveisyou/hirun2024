/*
 * @(#) LFocusNotification.js
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

Rui.ui.LFocusNotification = function(oConfig){
    var width = Rui.util.LDom.getDocumentWidth();
    var height = Rui.util.LDom.getDocumentHeight();
    oConfig = Rui.applyIf(oConfig || {}, { body: 'body가 없음', width: width, x: 0, height: height, fixedcenter: false, modal: false, zIndex: 1000, visible: true, close: false });
    var view = oConfig.view;
    if(!oConfig.dialog) {
        var dr = Rui.util.LObject.clone(oConfig.view);
        dr.top = oConfig.view.bottom + 20;
        dr.bottom = dr.top + 100;
        oConfig.dialog = dr;
    }
    this.createEvent('closed');
    Rui.ui.LFocusNotification.superclass.constructor.call(this, oConfig);
};
Rui.extend(Rui.ui.LFocusNotification, Rui.ui.LNotification, {
    otype: 'Rui.ui.LFocusNotification',
    CSS_BASE: 'L-focus-notification',
    arrowCss: 'L-fn-arrow',
    createTemplate: function() {
        var ts = this.templates || {};
        if (!ts.master) {
            ts.master = new Rui.LTemplate(
                '<div class="L-fn-top"></div>',
                '<div class="L-fn-left"></div>',
                '<div class="L-fn-right"></div>',
                '<div class="L-fn-bottom"></div>',
                '<div class="L-fn-mask"></div>',
                '<div class="L-fn-viewer">',
                    '<div class="' + this.arrowCss + '"></div>',
                    '<div class="L-fn-title"></div>',
                    '<div class="L-fn-topLine"><h2></h2></div>',
                    '<div class="L-fn-view">{text}',
                    '</div>',
                    '<div class="L-fn-bottomLine"><h2></h2></div>',
                    '<div class="L-fn-buttons">',
                        '<button class="L-fn-buttun">OK</botton>',
                    '</div>',
                '</div>'
            );
        }
        this.templates = ts;
        ts = null;
    },
    doRender: function(appendToNode) {
        Rui.ui.LFocusNotification.superclass.doRender.call(this, appendToNode);
        this.el.addClass(this.CSS_BASE);
        this.el.addClass(this.CSS_BASE + '-' + this.id);
        this.createTemplate();
        var wrapperEl = Rui.get(this.element);
        wrapperEl.addClass(this.CSS_BASE + '-wrap');
        wrapperEl.addClass(this.CSS_BASE + '-wrap-' + this.id);
        var ts = this.templates || {};
        var html = ts.master.apply({ text: this.text });
        var bodyEl = this.getBody();
        bodyEl.html(html);
        this.topEl = bodyEl.select('.L-fn-top').getAt(0);
        this.leftEl = bodyEl.select('.L-fn-left').getAt(0);
        this.rightEl = bodyEl.select('.L-fn-right').getAt(0);
        this.bottomEl = bodyEl.select('.L-fn-bottom').getAt(0);
        this.maskEl = bodyEl.select('.L-fn-mask').getAt(0);
        this.viewerEl = bodyEl.select('.L-fn-viewer').getAt(0);
        var view = this.view, vt = view.top, vl = view.left, vr = view.right, vb = view.bottom;
        var d = this.dialog, dt = d.top, dl = d.left, dr = d.right, db = d.bottom;
        var vh = vb - vt, vw = vr - vl, dh = db - dt, dw = dr - dl;
        var vWidth = Rui.util.LDom.getDocumentWidth(), vHeight = Rui.util.LDom.getDocumentHeight();
        this.topEl.setHeight(vt + this.topEl.getBorderWidth('lr') + this.topEl.getPadding('lr'));
        this.leftEl.setTop(vt);
        this.leftEl.setHeight(vh + this.leftEl.getBorderWidth('lr') + this.leftEl.getPadding('lr'));
        this.leftEl.setWidth(vl);
        this.rightEl.setTop(vt);
        this.rightEl.setHeight(vh + this.rightEl.getBorderWidth('lr') + this.rightEl.getPadding('lr'));
        this.rightEl.setWidth(vWidth - (vl + vw));
        this.bottomEl.setHeight(vHeight - (vt + vh) - 2);
        var boxWidth = (this.viewerEl.getBorderWidth('lr') + this.viewerEl.getPadding('lr'));
        var boxHeigh = (this.viewerEl.getBorderWidth('tb') + this.viewerEl.getPadding('tb'));
        this.viewerEl.setSize(dr - dl + boxWidth, db - dt + boxHeigh);
        this.viewerEl.setTop(dt);
        this.viewerEl.setLeft(dl);
        this.maskEl.setSize(vWidth + boxWidth, vHeight + boxHeigh);
        this.buttonElOk = bodyEl.select('.L-fn-buttun').getAt(0);
        this.buttonElOk.on('click', this.onClickButtonOk, this, true);
    },
    hide: function(){
        Rui.ui.LFocusNotification.superclass.hide.call(this, false);
        this.fireEvent('closed', {
            type: 'closed',
            target: this
        });
        this.destroy();
    },
    onClickButtonOk: function(e) {
        this.hide(false);
    },
    onClickButtonSkip: function(e) {
        this.hide(false);
    },
    destroy: function(){
        this.buttonElOk.unOn('click', this.onClickButtonOk, this);
        Rui.ui.LFocusNotification.superclass.destroy.call(this);
    }
});