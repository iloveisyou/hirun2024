/*
 * @(#) LTooltip-debug.js
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
 * LTooltip
 * @module ui
 * @title LTooltip
 * @requires Rui
 */
(function(){
var Event = Rui.util.LEvent;

Rui.namespace('Rui.ui');
/**
 * LTooltip
 * @namespace Rui.ui
 * @class LTooltip
 * @plugin js,css
 * @sample default
 * @constructor LTooltip
 * @param {Object} config The intial LTooltip.
 */
Rui.ui.LTooltip = function(config){
    Rui.ui.LTooltip.superclass.constructor.call(this, config);
};
Rui.extend(Rui.ui.LTooltip, Rui.ui.LUIComponent, {
    /**
     * @description object type 속성
     * @property otype
     * @protected
     * @type {String}
     */
    otype: 'Rui.ui.LTooltip',
    /**
     * @description 기본 CSS명
     * @property CSS_BASE
     * @private
     * @type {String}
    */
    CSS_BASE: 'L-stt',
    /**
     * @description 툴팁 div id
     * @config id
     * @type {String}
     * @default null
     */
    /**
     * @description 툴팁 div id
     * @property id
     * @private
     * @type {String}
     */
    id: null,
    /**
     * @description 툴팁 표시 delaytime(ms 단위)
     * @config showdelay
     * @type {Int}
     * @default 500
     */
    /**
     * @description 툴팁 표시 delaytime(ms 단위)
     * @property showdelay
     * @type {Int}
     */
    showdelay: 500,
    /**
     * @description 툴팁 표시 후 hide time(ms 단위)
     * @config autodismissdelay
     * @type {Int}
     * @default 5000
     */
    /**
     * @description 툴팁 표시 후 hide time(ms 단위)
     * @property autodismissdelay
     * @type {Int}
     */
    autodismissdelay: 5000,
    /**
     * @description 마우스 이동시 툴팁 동시 이동 여부
     * @config showmove
     * @type {boolean}
     * @default false
     */
    /**
     * @description 마우스 이동시 툴팁 동시 이동 여부
     * @property showmove
     * @type {boolean}
     */
    showmove: false,
    /**
     * @description 툴팁이 적용될 DOM element
     * @config context
     * @type {Object}
     * @default null
     */
    /**
     * @description 툴팁이 적용될 DOM element
     * @property context
     * @type {Object}
     */
    context: null,
    /**
     * @description 툴팁에 표시될 텍스트
     * @config text
     * @type {String}
     * @default null
     */
    /**
     * @description 툴팁에 표시될 텍스트
     * @property text
     * @type {String}
     */
    text: null,
    /**
     * @description 그리드 툴팁 적용할 gridPanel
     * @property grid
     * @private
     * @type {Object}
     */
    gridPanel: null,
    /**
     * @description 툴팁이 표시될 위치 margin
     * @config margin
     * @type {int}
     * @default 5
     */
    /**
     * @description 툴팁이 표시될 위치 margin
     * @property margin
     * @type {int}
     */
    margin: 5,
    /**
     * 초기화시 호출되는 메소드 
     * @method init
     * @private
     */
    initComponent: function(config){
        Rui.ui.LTooltip.superclass.initComponent.call(this);
        if(!this.id) this.id = (config && config.id) || Rui.id();
    },
    /**
     * @description 객체를 Config정보를 초기화하는 메소드
     * @method initDefaultConfig
     * @protected
     * @return {void}
     */
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
    /**
     * LTooltip의 커스텀 이벤트를 초기화한다.
     * @method initEvents
     * @private
     */
    initEvents: function(){
        this.ctxEl = Rui.get(this.context);
        this._createEvents();
    },
    /**
     * LTooltip의 그리드 커스텀 이벤트를 초기화한다.
     * @method gridEvents
     * @private
     * @param {Rui.ui.grid.LGridPanel} grid 툴팁이 적용될 Grid Panel 객체
     */
    gridEvents: function (grid){
        this.gridPanel = grid;
        this.ctxEl = this.gridPanel.getView().el;
        this._createEvents();
    },
    /**
     * @description 툴팁 대상 객체에 대한 이벤트 생성
     * @method _createEvents
     * @private
     */
    _createEvents: function(){
        if(this.ctxEl == null) return;
        this.ctxEl.on('mouseover', this.onContextMouseOver, this, true, {system: true});
        if(this.showmove){
            this.ctxEl.on('mousemove', this.onContextMouseMove, this, true, {system: true});
        }
        this.ctxEl.on('mouseout', this.onContextMouseOut, this, true, {system: true});
    },
    /**
     * @description element Dom객체 생성
     * @method _createElement
     * @private
     */
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
    /**
     * 사용자가 마우스를 컨텍스트 엘리먼트에 가져다 댔을 때 기본 이벤트 핸들러가 실행된다.
     * @method onContextMouseOver
     * @private
     * @param {DOMEvent} e The current DOM event
     */
    onContextMouseOver: function(e){
        if(this.oldDom === e.target) return; //console.debug('Return~!');

        this.pageX = Event.getPageX(e);
        this.pageY = Event.getPageY(e);
        
        var cell = e.target;

        // 셀 병합 상태에서 제대로 표시 되지 않는 문제
        // cell-inner 처리에 대한 사항을 확인해봐야 됨
//            var cellEl = Rui.get(e.target);
//            if(!cellEl.hasClass('L-grid-cell-inner')) return;
//            var cell = cellEl.findParent('.L-grid-cell', 2).dom;

        if(!this.ttEl) this._createElement();
        if(!this.gridPanel){
            var contextEl = this.ctxEl;
            if(contextEl.dom.title){
                this._tempTitle = contextEl.dom.title;
                contextEl.dom.title = '';
            }
        } else {
            //if(cell.title != '') return;
            var view = this.gridPanel.getView();
            var idx = view.findCell(cell, Event.getPageX(e));
            if(idx < 0) return;
            var cm = view.getColumnModel();
            var col = cm.getColumnAt(idx, true);
            var row = view.findRow(cell, Event.getPageY(e), false);
            var val = cm.getCellConfig(row, idx, 'tooltipText');
            
            if(col !== undefined && row > -1){
                var c = Rui.get(cell);
                //셀의 td나 div에서 툴팁 세팅 여부를 클래스로 확인
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
    /**
     * 컨텍스트 엘리먼트에 마우스가 있을 동안 사용자가 마우스를 움직일 때 
     * 기본 이벤트 핸들러가 실행된다. 
     * @method onContextMouseMove
     * @private
     * @param {DOMEvent} e The current DOM event
     */
    onContextMouseMove: function(e){
        if(this.delayShow == undefined) return;
        
        this.pageX = Event.getPageX(e);
        this.pageY = Event.getPageY(e);
        if(this.showmove){
            this.setTooltipXY();
        }
    },
    /**
     * tooltip dom에 마우스가 있을 동안 사용자가 마우스를 움직일 때 
     * 기본 이벤트 핸들러가 실행된다. 
     * @method onContextMouseMove
     * @private
     * @param {DOMEvent} e The current DOM event
     */
    onTooltipMouseMove: function(e){
        this.onContextMouseMove(e);
        if(!this.isPointerStillShowing())
            this.hide();
    },
    /**
     * 마우스가 컨텍스트 엘리먼트에 밖으로 마우스를 움직일 때 실행되는 기본 이벤트 핸들러
     * @method onContextMouseOut
     * @private
     * @param {DOMEvent} e The current DOM event
     */
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
    /**
     * 마우스가 tooltip dom 밖으로 마우스를 움직일 때 실행되는 기본 이벤트 핸들러
     * @method onTooltipMouseOut
     * @private
     * @param {DOMEvent} e The current DOM event
     */
    onTooltipMouseOut: function(e){
        this.onContextMouseOut(e);
    },
    /**
     * @description 마우스 pointer위 치에 따라 tooltip이 여전히 보여지는 상태여야 하는지 여부
     * 현재 마우스의 위치가 context dom 내부 이거나 tooltip dom 내부일 수 있으며, 이 두경우 모두 tooltip은 계속 show 상태여야 한다. 이를 판단하는 메소드 
     * @method isPointerStillShowing
     * @private
     * @return {void}
     */
    isPointerStillShowing: function(){
        var pt = new Rui.util.LPoint(this.pageX, this.pageY),
            region = this.ctxEl.getRegion();
        if(region && region.contains(pt)) return true;
        return false;
    },
    /**
     * @description tooltip 전시 위치 설정
     * @method setTooltipXY
     * @private
     * @return {void}
     */
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
    /**
     * @description 툴팁 show
     * @method show
     * @private
     */
    show: function(){
        Rui.get(this.id).html(this.text);
        this.ttEl.removeClass('L-hide-display');
        this.width = this.ttEl.getWidth();
        if(Rui.useAccessibility()) this.ttEl.setAttribute('aria-hidden', false);
        if(this.pageX > 0 && this.pageY > 0){
            this.setTooltipXY();
        }
    },
    /**
     * @description 툴팁 hide
     * @method show
     * @private
     */
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
    /**
     * 툴팁 표시 text를 변경한다.
     * @method setText
     * @public
     * @param {String} text tooltip에 표현될 text
     */
    setText: function(text){
        this.text = text;
    },
    /**
     * DOM에서 tooltip 엘리먼트를 제거하고 관련 이벤트를 unOn처리 한다.
     * @public
     * @method destroy
     */
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