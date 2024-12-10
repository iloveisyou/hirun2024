/*
 * @(#) LDDList.js
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

(function() {
    Rui.namespace('Rui.dd');
    var Dom = Rui.util.LDom;
    var Event = Rui.util.LEvent;
    var LDDM = Rui.dd.LDragDropManager;
    Rui.dd.LDDList = function(config) {
        Rui.dd.LDDList.superclass.constructor.call(this, config);
        this.isProxy = Rui.applyIf(config.isProxy, {
            isProxy: true
        });
        this.logger = this.logger || Rui;
        var el = this.getDragEl();
        Dom.setStyle(el, 'opacity', 0.67); 
        this.goingUp = false;
        this.lastY = 0;
    };
    Rui.extend(Rui.dd.LDDList, Rui.dd.LDDProxy, {
        startDrag: function(x, y) {
            this.logger.log(this.id + ' startDrag');
            var dragEl = this.getDragEl();
            var clickEl = this.getEl();
            Dom.setStyle(clickEl, 'visibility', 'hidden');
            if(this.isProxy)
                dragEl.innerHTML = clickEl.innerHTML;
            Dom.setStyle(dragEl, 'color', Dom.getStyle(clickEl, 'color'));
            Dom.setStyle(dragEl, 'backgroundColor', Dom.getStyle(clickEl, 'backgroundColor'));
            Dom.setStyle(dragEl, 'border', '2px solid gray');
        },
        endDrag: function(e) {
            var srcEl = this.getEl();
            var proxy = this.getDragEl();
            Dom.setStyle(proxy, 'visibility', '');
            var a = new Rui.fx.LMotionAnim({
                el: proxy,
                attributes: {
                    points: { 
                        to: Dom.getXY(srcEl)
                    }
                },
                duration: 0.2,
                method: Rui.fx.LEasing.easeOut 
            });
            var proxyid = proxy.id;
            var thisid = this.id;
            a.on('complete', function() {
                Dom.setStyle(proxyid, 'visibility', 'hidden');
                Dom.setStyle(thisid, 'visibility', '');
            });
            a.animate();
        },
        onDragDrop: function(e, id) {
            if (LDDM.interactionInfo.drop.length === 1) {
                var pt = LDDM.interactionInfo.point; 
                var region = LDDM.interactionInfo.sourceRegion; 
                if (!region.intersect(pt)) {
                    var destEl = Dom.get(id);
                    var destDD = LDDM.getDDById(id);
                    destEl.appendChild(this.getEl());
                    destDD.isEmpty = false;
                    LDDM.refreshCache();
                }
            }
        },
        onDrag: function(e) {
            var y = Event.getPageY(e);
            if (y < this.lastY) {
                this.goingUp = true;
            } else if (y > this.lastY) {
                this.goingUp = false;
            }
            this.lastY = y;
        },
        onDragOver: function(e, id) {
            var srcEl = this.getEl();
            var destEl = Dom.get(id);
            if (destEl.nodeName.toLowerCase() == 'li') {
                var p = destEl.parentNode;
                if (this.goingUp) {
                    p.insertBefore(srcEl, destEl); 
                } else {
                    p.insertBefore(srcEl, destEl.nextSibling); 
                }
                LDDM.refreshCache();
            }
        }
    });
})();