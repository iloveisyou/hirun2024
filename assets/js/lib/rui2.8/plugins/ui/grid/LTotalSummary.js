/*
 * @(#) LTotalSummary.js
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

Rui.ui.grid.LTotalSummary = function(oConfigs) {
    Rui.ui.grid.LTotalSummary.superclass.constructor.call(this, oConfigs);
    this.createEvent('renderTotal');
    this.createEvent('renderTotalCell');
};
Rui.extend(Rui.ui.grid.LTotalSummary, Rui.util.LPlugin, {
    gridView: null,
    useExcel: false,
    renderSummaryTime: 50,
    initPlugin: function(gridView) {
        this.gridView = gridView;
        Rui.ui.grid.LTotalSummary.superclass.initPlugin.call(this, gridView);
        var ts = gridView.templates || {};
        ts.totalSummaryRow = new Rui.LTemplate(
            '<div class="L-grid-row-summary-total" >',
                '<div class="L-grid-summary-scroller" style="{sstyle}">',
                    '<ul class="L-grid-ul">',
                    '<li class="L-grid-li-first">',
                    '<table border="0" cellspacing="0" cellpadding="0" style="{style1}">',
                        '<tbody>',
                            '<tr>{cells1}</tr>',
                        '</tbody>',
                    '</table>',
                    '</li>',
                    '<li class="L-grid-li-last" style="{style}">',
                    '<table border="0" cellspacing="0" cellpadding="0" style="{style2}">',
                        '<tbody>',
                            '<tr>{cells2}</tr>',
                        '</tbody>',
                    '</table>',
                    '</li>',
                    '</ul>',
                '</div>',
            '</div>'
        );
        if(!Rui.isUndefined(this.useExcel) && this.useExcel){
             ts.totalSummaryRow = new Rui.LTemplate(
                 '<div class="L-grid-row-summary-total" >',
                     '<div class="L-grid-summary-scroller" style="{sstyle}">',
                         '<table border="1" cellspacing="0" cellpadding="0" >',
                             '<tbody>',
                                 '<tr>{cells1}{cells2}</tr>',
                             '</tbody>',
                         '</table>',
                     '</div>',
                 '</div>'
             );
        }
        gridView.templates = ts;
        this.gridView.unOn('syncDataSet', this._setSymmarySyncDataSet, this);
        this.gridView.on('syncDataSet', this._setSymmarySyncDataSet, this, true);
        ts = gridView = null;
    },
    updatePlugin: function(e) {
        if(e.isRendered) {
            if(this.gridView && this.gridView.isVirtualScroll === false) {
                this.gridView.bodyEl.setStyle('margin-bottom', '27px');
            }
        }
        if(this.delaySct) {
            this.delaySct.cancel();
            delete this.delaySct;
        }
        if(!e) debugger;
        if(!this._updateRenderTotalOptions)
        	this._updateRenderTotalOptions = {};
        Rui.applyIf(this._updateRenderTotalOptions, e || {});
        this.delaySct = Rui.later(50, this, this.updateRenderTotal, e);
    },
    _setSymmarySyncDataSet: function(e){
        var isSync = e.isSync;
        if(isSync === true) {
            e.isRendered = true;
            this.updateRenderTotal(e);
        }
    },
    initPluginContainer: function() {
        if(this.gridView.isVirtualScroll === false) {
            Rui.util.LEvent.addListener(this.gridView.scrollerEl.dom, 'scroll', this.onSyncSummaryScrollLeft, this, true);
        } else {
            if(this.gridView.scroller) {
                this.gridView.scroller.unOn('scrollX', this.onSyncSummaryScrollLeft, this);
                this.gridView.scroller.on('scrollX', this.onSyncSummaryScrollLeft, this, true);
            }
        }
        var summaryTotalEl = Rui.get(document.createElement('div'));
        summaryTotalEl = Rui.get(document.createElement('div'));
        summaryTotalEl.html('Total');
        summaryTotalEl.addClass('L-grid-total-summary');
        var scrollerEl = this.gridView.scrollerEl;
        Rui.util.LDom.insertAfter(summaryTotalEl.dom, scrollerEl.dom);
        summaryTotalEl.html(this.getRenderTotal());
        this.summaryScrollerEl = this.gridView.el.select('.L-grid-summary-scroller').getAt(0);
        if(this.summaryTotalEl) 
            this.summaryTotalEl.remove();
        this.summaryTotalEl = summaryTotalEl;
        summaryTotalEl = scrollerEl = null;
        this.resizeScroller();
    },
    resizeScroller: function(){
        var gridView = this.gridView,
            scroller = gridView.scroller,
            summaryTotalEl = this.summaryTotalEl;
        if (scroller && summaryTotalEl) {
            summaryTotalEl.setStyle('margin-bottom', (scroller.existScrollbar(true) ? (scroller.getScrollbarSize(true)) : 0) + 'px');
            if(Rui.rightToLeft()) {
                summaryTotalEl.setStyle('margin-left', (scroller.existScrollbar() ? (scroller.getScrollbarSize()) : 0) + 'px');    
            } else {
                summaryTotalEl.setStyle('margin-right', (scroller.existScrollbar() ? (scroller.getScrollbarSize()) : 0) + 'px');
            }
            gridView.pluginSpaceHeight = summaryTotalEl.getHeight() == 0 ? gridView.getRowHeight() : summaryTotalEl.getHeight();
            scroller.setSpace(gridView.pluginSpaceHeight, false, 'bottom');
            gridView.resetScroller();
        }
        var width = gridView.scroller ? gridView.scroller.getScrollWidth() : gridView.getScrollerEl().getWidth();
        if(width < 1) width = Rui.util.LString.simpleReplace(gridView.headerOffsetEl.getStyle('width'), 'px', '').trim();
        this.summaryTotalEl.select('.L-grid-row-summary-total').setWidth(width - (this.gridView.isVirtualScroll === false ? Rui.ui.LScroller.SCROLLBAR_SIZE : 0));
        gridView = scroller = summaryTotalEl = null;
    },
    getRenderTotal: function() {
        var gridView = this.gridView;
        var cm = gridView.columnModel;
        var ts = gridView.templates || {};
        var columnCount = cm.getColumnCount(true);
        var cells1 = '';
        var cells2 = '';
        this.fireEvent('renderTotal', {target:this});
        var freezeIndex = cm.freezeIndex;
        this._renderLabel = false;
        if(freezeIndex > -1) {
            for (var i = 0; i <= freezeIndex; i++)
                cells1 += this.getRenderTotalCell(i, columnCount);
            for (var i = freezeIndex + 1; i < columnCount; i++)
                cells2 += this.getRenderTotalCell(i, columnCount);
        } else {
            for (var i = 0; i < columnCount; i++)
                cells2 += this.getRenderTotalCell(i, columnCount);
        }
        var tstyle1 = '';
        var tstyle2 = 'width:' + (cm.getLastColumnsWidth(true) - (cm.getLastColumnCount(true) - 2)) + 'px';
        var freezeTotalWidth = cm.getFirstColumnsWidth(true);
        if(freezeIndex > -1) {
            tstyle1 = 'width:' + freezeTotalWidth + 'px';
            tstyle2 += ';margin-left:' + freezeTotalWidth + 'px';
        }
        var pRow = {
            sstyle: '',
            style: 'width: ' + cm.getTotalWidth(true) + 'px',
            cells1: cells1,
            cells2: cells2,
            style1 : tstyle1,
            style2 : tstyle2
        };
        try {
            return ts.totalSummaryRow.apply(pRow);
        } finally {
            gridView = cm = ts = pRow = null;
        }
    },
    getRenderTotalCell: function(col) {
        var ts = this.gridView.templates || {};
        var cm = this.gridView.columnModel;
        var column = cm.getColumnAt(col, true);
        if(this.useExcel && (column instanceof Rui.ui.grid.LSelectionColumn || column instanceof Rui.ui.grid.LStateColumn || column instanceof Rui.ui.grid.LNumberColumn)){
            return ''; 
        }
        var first_last = '';
        var style = 'width:' + this.gridView.adjustColumnWidth(column.width) + 'px;';
        if(column.align != '')
            style += 'text-align:' + column.align+';';
        var hidden = column.isHidden()? 'L-hide-display' : '';
        if(column.cellStyle) style += column.cellStyle + ';';
        var p = {
            id: column.getId(),
            first_last: first_last,
            css:[],
            style: style,
            hidden:hidden
        };
        if(col === 0) p.css.push('L-grid-total-summary-col-first');
        if(col === cm.getColumnCount(true) - 1) p.css.push('L-grid-total-summary-col-last');
        var param = {
            target: this,
            col: col,
            colId: column.getId(),
            labelRendered: false,
            p: p,
            value: ''
        };
        this.fireEvent('renderTotalCell', param);
        p.value = param.value;
        if(param.labelRendered === true) this._renderLabel = true;
        if(this._renderLabel !== true) p.css.push('L-grid-total-summary-dummy');
        if(p.value == null) p.value = '';
        try {
            p.css = p.css.join(' ');
            return ts.cell.apply(p);
        } finally {
            ts = column = p = param = cm = null;
        }
    },
    onSyncSummaryScrollLeft: function(e) {
        var left = 0;
        if(this.gridView.isVirtualScroll === false) {
            left = e.target.scrollLeft;
        } else 
            left = this.gridView.scroller.getScrollLeft();
        if(this.summaryScrollerEl) {
            try{
                this.summaryScrollerEl.dom.scrollLeft = left;
            } catch(e) {}
        }
    },
    updateRenderTotal: function(e) {
        var fn = function(){
            if(!this.gridView || !this.gridView.el) return;
            var compTime = new Date() - this.modifiedDate;
            if (compTime < this.renderSummaryTime) {
                Rui.log('ignore');
                return;
            }
            clearInterval(this.delaySRRId);
            this.delaySRRTask = null;
            e = this._updateRenderTotalOptions;
            if(e !== undefined){
                if(e.isRendered) {
                    this.initPluginContainer();
                } else if(e.isDataChanged || e.resetScroll) {
                    this.updateRenderDataTotal();
                }
            }
            this._updateRenderTotalOptions = {};
        };
        if(this.renderSummaryTime > 0) {
            if(!this.delaySRRTask) {
                this.delaySRRTask = Rui.util.LFunction.createDelegate(fn, this);
                this.delaySRRId = setInterval(this.delaySRRTask, this.renderSummaryTime);
            }
        }
        if(this.renderSummaryTime < 1) {
            fn.call(this);
        }
        fn = null;
    },
    updateRenderDataTotal: function() {
        if(this.summaryTotalEl)
            this.summaryTotalEl.html(this.getRenderTotal());
        this.summaryScrollerEl = this.gridView.el.select('.L-grid-summary-scroller').getAt(0);
        this.updateWidthSummaryBar();
        this.onSyncSummaryScrollLeft();
    },
    updateWidthSummaryBar: function() {
        if(!this.summaryTotalEl) return;
        this.resizeScroller();
    },
    renderer: function(options) {
        return function(e) {
            var ds = this.gridView.dataSet;
            if(options.label) {
                var firstColumn = this.gridView.columnModel.getColumnAt(0, true);
                if(firstColumn.id == e.colId) this._renderLabel = false;
                if(e.colId === options.label.id) {
                    e.value = options.label.text;
                    e.p.css.push('L-grid-total-summary-title');
                    this._renderLabel = true;
                }
                e.p.css.push(this._renderLabel === false ? 'L-grid-total-summary-dummy' : '');
            }
            var opt = options.columns[e.colId];
            if(opt) {
                if(typeof opt === 'string')
                    opt = { type:'sum' };
                if(opt.type === 'sum')
                    e.value = ds.sum(e.colId);
                else if(opt.type === 'avg') {
                    var value = 0;
                    for (var row = 0; row < ds.getCount(); row++) {
                        var record = ds.getAt(row);
                        value += parseFloat(record.get(e.colId), 10) || 0;
                        record = null;
                    }
                    value = value > 0 ? value / ds.getCount() : 0;
                    e.value = value / 100;
                }
                if(opt.renderer) {
                    if(typeof opt.renderer === 'string')
                        opt.renderer = Rui.ui.grid.LColumnModel.rendererMapper[opt.renderer];
                    e.value = opt.renderer(e.value);
                }
            }
        };
    },
    destroy: function(){
         this.gridView.unOn('syncDataSet', this._setSymmarySyncDataSet, this);
         if(this.gridView.scroller)
             this.gridView.scroller.unOn('scrollX', this.onSyncSummaryScrollLeft, this);
        Rui.ui.grid.LTotalSummary.superclass.destroy.call(this);
    }
});
