/*
 * @(#) LTooltip.js
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

(function(){
var Event = Rui.util.LEvent;
Rui.namespace('Rui.ui');
Rui.ui.LTooltip = function(config){
    Rui.ui.LTooltip.superclass.constructor.call(this, config);
};
Rui.extend(Rui.ui.LTooltip, Rui.ui.LUIComponent, {
    otype: 'Rui.ui.LTooltip',
    CSS_BASE: 'L-stt',
    id: null,
    showdelay: 500,
    autodismissdelay: 5000,
    showmove: false,
    context: null,
    text: null,
    gridPanel: null,
    margin: 5,
    initComponent: function(config){
        Rui.ui.LTooltip.superclass.initComponent.call(this);
        if(!this.id) this.id = (config && config.id) || Rui.id();
    },
    initDefaultConfig: function(){
        Rui.ui.LTooltip.superclass.initDefaultConfig.call(this);
        this.cfg.addProperty('showdelay', {
            value: this.showdelay,
            validator: Rui.isNumber
        });
        this.cfg.addProperty('autodismissdelay', {
            value: this.autodismissdelay,
            validator: Rui.isNumber
        });
    },
    initEvents: function(){
        this.ctxEl = Rui.get(this.context);
        this._createEvents();
    },
    gridEvents: function (grid){
        this.gridPanel = grid;
        this.ctxEl = this.gridPanel.getView().el;
        this._createEvents();
    },
    _createEvents: function(){
        if(this.ctxEl == null) return;
        this.ctxEl.on('mouseover', this.onContextMouseOver, this, true, {system: true});
        if(this.showmove){
            this.ctxEl.on('mousemove', this.onContextMouseMove, this, true, {system: true});
        }
        this.ctxEl.on('mouseout', this.onContextMouseOut, this, true, {system: true});
    },
    _createElement: function(){
        var ttEl = document.createElement('div');
        ttEl.id = this.id;
        ttEl = Rui.get(ttEl);
        ttEl.addClass(this.CSS_BASE);
        ttEl.addClass('L-fixed');
        ttEl.addClass('L-hide-display');
        if(Rui.useAccessibility()){
            ttEl.setAttribute('role', 'tooltip');
            ttEl.setAttribute('aria-hidden', true);
        }
        document.body.appendChild(ttEl.dom);
        this.ttEl = ttEl;
        if(this.showmove){
        	this.ttEl.on('mousemove', this.onTooltipMouseMove, this, true, {system: true});
        }
        this.ttEl.on('mouseout', this.onTooltipMouseOut, this, true, {system: true});
    },
    onContextMouseOver: function(e){
        if(this.oldDom === e.target) return; 
        this.pageX = Event.getPageX(e);
        this.pageY = Event.getPageY(e);
        var cell = e.target;
        if(!this.ttEl) this._createElement();
        if(!this.gridPanel){
            var contextEl = this.ctxEl;
            if(contextEl.dom.title){
                this._tempTitle = contextEl.dom.title;
                contextEl.dom.title = '';
            }
        } else {
            var view = this.gridPanel.getView();
            var idx = view.findCell(cell, Event.getPageX(e));
            if(idx < 0) return;
            var cm = view.getColumnModel();
            var col = cm.getColumnAt(idx, true);
            var row = view.findRow(cell, Event.getPageY(e), false);
            var val = cm.getCellConfig(row, idx, 'tooltipText');
            if(col !== undefined && row > -1){
                var c = Rui.get(cell);
                if( c.hasClass('L-grid-cell-tooltip') || Rui.get(c.dom.parentNode).hasClass('L-grid-cell-tooltip')){
                    this.text = (val === undefined) ? col.tooltipText : val;
                    if(Rui.isEmpty(this.text)){
                        if(cell.rowSpan > 1){
                            for (var i = 1; i < cell.rowSpan; i++){
                                val = cm.getCellConfig(row + i, idx, 'tooltipText');
                                if(val) break;
                            }
                        }
                    }
                } else this.text = '';
            } else {
                this.text = '';
            }
            this.text = this.text ? Rui.trim(this.text.toString()) : this.text;
            if(idx == -1 || Rui.isEmpty(this.text)) return;
        }
        if(this.delayShow){
            this.delayShow.cancel();
            delete this.delayShow;
        }
        this.delayShow = Rui.later(this.showdelay, this, this.show, this);
        if(this.autodismissShow){
            this.autodismissShow.cancel();
            delete this.autodismissShow;
        }
        this.autodismissShow = Rui.later(this.autodismissdelay, this, this.hide, this);
        this.oldDom = cell;
    },
    onContextMouseMove: function(e){
        if(this.delayShow == undefined) return;
        this.pageX = Event.getPageX(e);
        this.pageY = Event.getPageY(e);
        if(this.showmove){
            this.setTooltipXY();
        }
    },
    onTooltipMouseMove: function(e){
        this.onContextMouseMove(e);
        if(!this.isPointerStillShowing())
            this.hide();
    },
    onContextMouseOut: function(e){
        this.pageX = Event.getPageX(e);
        this.pageY = Event.getPageY(e);
        if(Rui.get(e.target).hasClass('L-grid-body')) return;
        if(this._tempTitle){
            this.ctxEl.dom.title = this._tempTitle;
            this._tempTitle = null;
        }
        if(!this.isPointerStillShowing()){
        	this.hide();
        }else{
            this.hide();
            if(this.delayShow){
                this.delayShow.cancel();
                delete this.delayShow;
            }
        }
        this.oldDom = null;
    },
    onTooltipMouseOut: function(e){
        this.onContextMouseOut(e);
    },
    isPointerStillShowing: function(){
        var pt = new Rui.util.LPoint(this.pageX, this.pageY),
            region = this.ctxEl.getRegion();
        if(region && region.contains(pt)) return true;
        return false;
    },
    setTooltipXY: function(){
        var h = this.ttEl.getHeight() || 0,
            w = this.ttEl.getWidth(),
            t = this.pageY,
            l = this.pageX,
            vp = Rui.util.LDom.getViewport(),
            vw = vp.width + (document.documentElement && document.documentElement.scrollLeft) || document.body.scrollLeft,
            vh = vp.height + (document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop;
        if(w < 1 || h < 1){
        	t = this.ctxEl.getTop();
        	l = this.ctxEl.getLeft();
        }else{
        	if(vh <= (t + h + this.margin)) t = vh - h;
        	else t += this.margin;
        	if(vw <= (l + w + this.margin)) l = vw - w;
        	else l += this.margin;
        }
        this.ttEl.setTop(t);
        this.ttEl.setLeft(l);
    },
    show: function(){
        Rui.get(this.id).html(this.text);
        this.ttEl.removeClass('L-hide-display');
        this.width = this.ttEl.getWidth();
        if(Rui.useAccessibility()) this.ttEl.setAttribute('aria-hidden', false);
        if(this.pageX > 0 && this.pageY > 0){
            this.setTooltipXY();
        }
    },
    hide: function(){
        if(Rui.isUndefined(this.ttEl)) return false;
        this.ttEl.addClass('L-hide-display');
        if(Rui.useAccessibility()) this.ttEl.setAttribute('aria-hidden', true);
        if(this.delayShow){
            this.delayShow.cancel();
            delete this.delayShow;
        }
        if(this.autodismissShow){
            this.autodismissShow.cancel();
            delete this.autodismissShow;
        }
    },
    setText: function(text){
        this.text = text;
    },
    destroy: function(){
        if(this.ttEl){
            this.ttEl.unOnAll();
            this.ttEl.remove();
            this.ttEl = null;
        }
        this.ctxEl.unOnAll();
        Rui.ui.LTooltip.superclass.destroy.call(this);
    }
});
})();