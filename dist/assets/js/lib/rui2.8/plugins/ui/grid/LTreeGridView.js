/*
 * @(#) LTreeGridView.js
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

Rui.namespace('Rui.ui.grid');
(function() {
Rui.ui.grid.LTreeGridView = function(config) {
    config = config || {};
    config = Rui.applyIf(config, Rui.getConfig().getFirst('$.ext.treeGrid.defaultProperties'));
    this.showData = new Rui.util.LCollection();
    Rui.ui.grid.LTreeGridView.superclass.constructor.call(this, config);
};
Rui.extend(Rui.ui.grid.LTreeGridView, Rui.ui.grid.LBufferGridView, {
    otype: 'Rui.ui.grid.LTreeGridView',
    treeColumnId: null,
    defaultOpenDepth: -1,
    showData: null,
    isVirtualView: true,
    fields: null,
    isShowDataPaste: false,
    setPanel: function(gridPanel) {
        gridPanel.on('cellClick', this.onCellClick, this, true, { system: true });
        Rui.ui.grid.LTreeGridView.superclass.setPanel.call(this, gridPanel);
    },
    onLoadDataSet: function(e) {
        this.doLoadDataSet(this.defaultOpenDepth, e.add);
        Rui.ui.grid.LTreeGridView.superclass.onLoadDataSet.call(this, e);
    },
    doLoadDataSet: function(depth, add, oldShowList) {
        var ds = this.dataSet, dId = this.fields.depthId, len = ds.getCount();
        if(add !== true)
            this.showData = new Rui.util.LCollection();
        var pDepth = 0;
        var pIdList = [];
        var pId = null;
        for (var i = 0 ; i < len; i++) {
            var r = ds.getAt(i);
            var _expand = 'normal';
            if ((i + 1) < len) {
                var nextRecord = ds.getAt(i + 1);
                if (oldShowList && oldShowList[r.id]) {
                    if ((r.get(dId)) < nextRecord.get(dId) && oldShowList[nextRecord.id]) {
                        _expand = 'open';
                    } else if(oldShowList[r.id] == 'close') _expand = 'close';
                } else {
                    if ((r.get(dId) + 1) == nextRecord.get(dId)) {
                        _expand = (depth + 1) > nextRecord.get(dId) ? 'open' : 'close';
                    }
                }
            }
            r.setAttribute('_expand', _expand);
            var show = false;
            if(oldShowList && oldShowList[r.id]) {
                show = true;
            } else {
                if(r.get(dId) === undefined || r.get(dId) < 1) {
                    show = true;
                    pDepth = 0;
                    pIdList = [];
                } else {
                    if(r.get(dId) > pDepth && (i > 0) && (i - 1 < len) && ds.getAt(i - 1).getAttribute('_expand') == 'open')
                        pDepth = r.get(dId);
                    if(pDepth >= r.get(dId))
                        show = true;
                }
            }
            r.setAttribute('_show', show);
            if(r.get(dId) < pIdList.length){
                pIdList = pIdList.slice(0, r.get(dId));
            }
            if(_expand != 'normal') {
                pId = r.id;
                pIdList.push(r.id);
            }
            if ((i + 1) < len) {
                var nextRecord = ds.getAt(i + 1);
                nextRecord.pId = pIdList[nextRecord.get(dId) - 1];
            } else if(pId && r.id != pId && ds.get(pId).get(dId) < r.get(dId)) {
                r.pId = pIdList[r.get(dId) - 1];
                if(!r.pId) debugger;
            }
            if(show) {
                this.showData.add(r.id, r);
            }
        }
    },
    updateDepthExpand: function(row) {
        var ds = this.dataSet, dId = this.fields.depthId;
        if(row > ds.getCount() - 1) return;
        var record = ds.getAt(row);
        var cDepth = record.get(dId);
        var pId = record.pId;
        var currRecord = record;
        while (0 <= cDepth) {
            if(currRecord.getAttribute('_expand') == 'close')
                currRecord.setAttribute('_expand', 'open');
            currRecord = ds.get(pId);
            if(!currRecord) break;
            pId = currRecord.pId;
            cDepth = currRecord.get(dId);
        }
    },
    updateParentExpand: function(row) {
        var ds = this.dataSet, dId = this.fields.depthId, len = ds.getCount();
        if(len < 2) {
            var r = ds.getAt(row - 1);
            if(r) r.setAttribute('_expand', 'normal');
        } 
        else if(len > 1) {
            var r = ds.getAt(row - 1);
            if(r) {
                if (row == ds.getCount())
                    r.setAttribute('_expand', 'normal');
                else if ((r.get(dId) == ds.getAt(row).get(dId)) || (r.get(dId) != ds.getAt(row).get(dId) - 1))
                    r.setAttribute('_expand', 'normal');
                else if((r.get(dId) == ds.getAt(row).get(dId) - 1) && ds.getAt(row).getAttribute('_show') == true)
                    r.setAttribute('_expand', 'open');
            }
        }
    },
    doAddData: function(e) {
        var ds = this.dataSet, dId = this.fields.depthId;
        var record = ds.getAt(e.row);
        var pRow = this.getParentRow(e.row);
        var pRecord;
        if(0 <= pRow) {
            pRecord = ds.getAt(pRow);
            record.pId = pRecord.id;
        }
        var pDepth = record.get(dId);
        if(Rui.isUndefined(pDepth) || pDepth == 0)
            record.setAttribute('_show', true);
        if(pRecord) {
            if(pRecord.getAttribute('_expand') == 'open')
                record.setAttribute('_show', true);
            if(pRecord.getAttribute('_expand') === 'normal')
                pRecord.setAttribute('_expand', 'close');
        }
        if(record.getAttribute('_show')) {
            if(this.showData.indexOfKey(record.id) < 0) {
                var visibleRow = 0 < e.row ? this.getVisibleRow(e.row - 1) : -1;
                visibleRow = (visibleRow < 0) ? this.getBeforeVisibleRow(e.row, 1) : visibleRow;
                this.showData.insert(visibleRow + 1, record.id, record);
            }
            if(pDepth !== 0 && !Rui.isUndefined(pDepth))
                this.updateParentExpand(e.row);
        }
        if(!record.getAttribute('_expand')) {
            record.setAttribute('_expand', 'normal');
            if((e.row + 1) < ds.getCount()) {
                var cRecord = ds.getAt(e.row + 1);
                if(record.get(dId) < cRecord.get(dId)) {
                    cRecord.pId = record.id;
                    record.setAttribute('_expand', 'close');
                }
            }
        }
        Rui.ui.grid.LTreeGridView.superclass.doAddData.call(this, e);
    },
    doCellUpdateData: function(e) {
        var dId = this.fields.depthId;
        if(e.colId == dId) {
            var ds = this.dataSet;
            var record = ds.getAt(e.row);
            var pRow = this.getParentRow(e.row);
            var pRecord;
            if(0 <= pRow) {
                pRecord = ds.getAt(pRow);
                record.pId = pRecord.id;
            }
            if(pRecord) {
                if(pRecord.getAttribute('_expand') == 'close' || pRecord.getAttribute('_expand') == 'normal') {
                    pRecord.setAttribute('_expand', 'close');
                }
                if(pRecord.getAttribute('_show') === false || pRecord.getAttribute('_expand') == 'close') {
                    this.showData.remove(record.id);
                    record.setAttribute('_show', false);
                }
            } else {
                var pDepth = record.get(dId);
                if(e.row < 1 || (ds.getAt(e.row - 1).get(dId) == record.get(dId) && ds.getAt(e.row - 1).getAttribute('_show')) ||
                    (ds.getAt(e.row - 1).get(dId) == (record.get(dId) - 1) && ds.getAt(e.row - 1).getAttribute('_show'))) {
                    record.setAttribute('_show', true);
                    this.updateParentExpand(e.row);
                }
                if(pDepth < 1) {
                    record.setAttribute('_show', true);
                }
                if(record.getAttribute('_show') == true) {
                    if(this.showData.indexOfKey(record.id) < 0) {
                        var vibibleRow = 0 < e.row ? this.getVisibleRow(e.row - 1) : 0;
                        this.showData.insert(vibibleRow + 1, record.id, record);
                    }
                } else {
                    this.showData.remove(record.id);
                }
            }
        }
        if(this.fields.depthId == e.colId) {
            e.system = false;
            this.redoRenderData({ resetScroll: true});
            return;
        }
        Rui.ui.grid.LTreeGridView.superclass.doCellUpdateData.call(this, e);
    },
    doRemoveData: function(e) {
        var ds = this.dataSet, dId = this.fields.depthId;
        var c = e.record;
        var len = ds.getCount();
        if(e.remainRemoved == false && c.getAttribute('_show') == true) {
            var b = (e.row > 0) ? this.getRowRecord(this.getVisibleRow(e.row - 1)) : null;
            var n = (e.row < len) ? ds.getAt(e.row) : null;
            if(b && b.getAttribute('_show') == true && (b || n)) {
                if(!n || b.get(dId) >= n.get(dId))
                    b.setAttribute('_expand', 'normal');
            }
            this.showData.remove(c.id);
        } else {
        	var r = this.showData.get(c.id);
        	if(r && r.state == Rui.data.LRecord.STATE_INSERT) this.showData.remove(c.id);
        }
        Rui.ui.grid.LTreeGridView.superclass.doRemoveData.call(this, e);
    },
    doUndoData: function(e) {
        var ds = this.dataSet, dId = this.fields.depthId;
        var c = e.record;
        var len = ds.getCount();
        if(c.state == Rui.data.LRecord.STATE_INSERT && c.getAttribute('_show') == true) {
            var b = (e.row > 0) ? this.getRowRecord(this.getVisibleRow(e.row - 1)) : null;
            var n = (e.row < len) ? ds.getAt(e.row) : null;
            if(b && b.getAttribute('_show') == true && (b || n)) {
                if(!n || b.get(dId) >= n.get(dId))
                    b.setAttribute('_expand', 'normal');
            }
            this.showData.remove(c.id);
        }
        Rui.ui.grid.LTreeGridView.superclass.doUndoData.call(this, e);
    },
    onChangeRenderData: function(e) {
        var showList = {};
        this.doLoadDataSet(this.defaultOpenDepth, false, showList);
        if(e.forceRow) {
            var row = this.dataSet.getRow();
            if(row > -1)
                this.expand(row);
        }
        delete showList;
        Rui.ui.grid.LTreeGridView.superclass.onChangeRenderData.call(this, e);
    },
    onColumnsChanged: function(e){
        this.doLoadDataSet(this.defaultOpenDepth);
        Rui.ui.grid.LTreeGridView.superclass.onColumnsChanged.call(this, e);
    },
    onCellClick: function(e) {
        var targetEl = Rui.get(e.event.target);
        if(targetEl.hasClass('L-grid-tree-col-icon')) {
            var row = this.findRow(e.event.target);
            this.toggle(row);
            Rui.util.LEvent.stopEvent(e);
            return false;
        }
    },
    expand: function(row) {
        var ds = this.dataSet, dId = this.fields.depthId, len = ds.getCount();
        if(row > ds.getCount() - 1) return;
        var record = ds.getAt(row);
        if(!record) debugger;
        var currDepth = record.get(dId);
        var beforeIdx = 0;
        var startIdx = 0;
        for (var i = row; 0 <= i; i--) {
            var r = ds.getAt(i);
            if(r.getAttribute('_show') && beforeIdx == 0)
                beforeIdx = this.showData.indexOfKey(r.id);
            if(r.get(dId) == 0) {
                startIdx = i;
                break;
            }
        }
        record.setAttribute('_show', true);
        if(record.getAttribute('_expand') != 'normal')
            record.setAttribute('_expand', 'open');
        this.updateDepthExpand(row);
        for (var i = startIdx; i <= row; i++) {
            var r = ds.getAt(i);
            if(r.get(dId) <= currDepth && r.getAttribute('_expand') == 'close')
                r.setAttribute('_show', true);
            if(r.get(dId) <= currDepth && r.pId) {
                if(ds.get(r.pId).getAttribute('_expand') == 'open' && ds.get(r.pId).getAttribute('_show') == true)
                    r.setAttribute('_show', true);
                else
                    r.setAttribute('_show', false);
            }
            if(r.getAttribute('_show')) {
                if(this.showData.indexOfKey(r.id) < 0)
                    this.showData.insert(++beforeIdx, r.id, r);
            }
        }
        for (var i = row + 1; i < len; i++) {
            var r = ds.getAt(i);
            if(r.get(dId) == 0) break;
            if(r.pId) {
                if(ds.get(r.pId).getAttribute('_expand') == 'open' && ds.get(r.pId).getAttribute('_show') == true)
                    r.setAttribute('_show', true);
                else
                    r.setAttribute('_show', false);
            }
            this.updateParentExpand(i);
            if(r.getAttribute('_show'))
                if(this.showData.indexOfKey(r.id) < 0) 
                    this.showData.insert(++beforeIdx, r.id, r);
        }
        this.redoRenderData({ resetScroll: true });
        return this;
    },
    collapse: function(row) {
        var ds = this.dataSet, dId = this.fields.depthId;
        var len = ds.getCount();
        if(row > ds.getCount() - 1) return;
        var record = ds.getAt(row);
        var pDepth = record.get(dId);
        if(record.getAttribute('_expand') == 'open')
            record.setAttribute('_expand', 'close');
        for (var i = row + 1; i < len; i++) {
            var r = ds.getAt(i);
            if(pDepth == r.get(dId)) break;
            if(pDepth < r.get(dId)) {
                r.setAttribute('_show', false);
            }
            if(r.getAttribute('_show') == false && this.showData.indexOfKey(r.id) > -1) {
                this.showData.remove(r.id);
            }
        }
        this.redoRenderData({ resetScroll: true });
        return this;
    },
    isExpand: function(row) {
        return this.dataSet.getAt(row).getAttribute('_expand') == 'open';
    },
    toggle: function(row) {
        if(this.isExpand(row)) this.collapse(row); else this.expand(row);
        return this;
    },
    expandDepth: function(depth) {
        this.doLoadDataSet(depth);
        this.redoRenderData({ resetScroll: true });
        return this;
    },
    getRenderRowClassName: function(row, record, rowCount){
        var css = Rui.ui.grid.LTreeGridView.superclass.getRenderRowClassName.call(this, row, record, rowCount);
        var newCss = [];
        var dId = this.fields.depthId;
        var expand = record.getAttribute('_expand') || 'normal';
        newCss.push('L-grid-row-depth-' + (record.get(dId)));
        newCss.push('L-grid-row-expand-' + expand);
        return css + ' ' + newCss.join(' ');
    },
    getAriaAttr: function(row, record) {
        var expand = record.getAttribute('_expand') || 'normal';
        if(expand === 'open')
            return 'aria-expand="true"';
        else if(expand === 'close')
            return 'aria-collapse="true"';
        return '';
    },
    getRenderBeforeCell: function(p, record, column, row, i) {
        if(column.id == this.treeColumnId) {
            p.css += ' L-grid-tree-column';
            var html = '<div class="L-grid-tree-col L-grid-tree-col-depth-' + record.get(this.fields.depthId) + '" style="">';
            html += '<div class="L-grid-tree-col-space"></div><div class="L-grid-tree-col-icon L-grid-row-select-ignore"></div>';
            html += '</div>';
            return html;
        }
        else return '';
    },
    getRowDom: function(row, index) {
        if(row < 0 || row > this.dataSet.getCount() - 1) return null;
        var r = this.getRowRecord(this.getVisibleRow(row));
        if(!r) return null;
        var id = r.id;
        var li = (index < 1) ? this.getFirstLiEl() : this.getLastLiEl();
        var rowDoms = li.dom.children[0].rows;
        for (var i = 0 ; i < rowDoms.length ; i++) {
            if(Rui.util.LDom.hasClass(rowDoms[i], ('L-grid-row-' + id))) {
                row = i;
                break;
            }
        }
        return row === null ? row : this.getRows(index)[row];
    },
    getRenderBody: function(checkRowHeight, redoRender) {
        var cm = this.columnModel;
        var ts = this.templates || {};
        var rowCount = this.showData.length;
        var rows1 = '';
        var rows2 = '';
        this.firstWidth = this.headerEl.dom.childNodes[0].childNodes[0].childNodes[0].childNodes[0].offsetWidth;
        this.lastWidth = this.headerEl.dom.childNodes[0].childNodes[0].childNodes[1].childNodes[0].offsetWidth;
        if(!redoRender) this.renderRange = this.getRenderRange();
        if (this.renderRange) {
            if (checkRowHeight === true) {
                var record = this.showData.getAt(0);
                rows2 = this.getRenderRow(0, record, rowCount, false);
            } else {
                for (var row = this.renderRange.start; row < this.renderRange.end + 1; row++) {
                    var record = this.getRowRecord(row);
                    var realRow = this.dataSet.indexOfKey(record.id);
                    if(cm.freezeIndex > -1)
                        rows1 += this.getRenderRow(realRow, record, rowCount, true);
                    rows2 += this.getRenderRow(realRow, record, rowCount, false);
                }
            }
        }
        var tstyle1 = 'width:' + this.firstWidth + 'px;';
        var tstyle2 = 'width:' + this.lastWidth + 'px;';
        if(cm.freezeIndex > -1) {
            this.marginLeft = cm.getFirstColumnsWidth(true);
            tstyle2 += 'margin-left:' + this.marginLeft + 'px';
        }
        var listyle = '';
        return ts.body.apply({ listyle: listyle, rows1: rows1, tstyle1: tstyle1, rows2: rows2, tstyle2: tstyle2 });
    },
    doRender: function(appendToNode) {
        Rui.ui.grid.LTreeGridView.superclass.doRender.call(this, appendToNode);
        this.el.addClass('L-tree-grid');
        if(Rui.useAccessibility())
            this.el.setAttribute('role', 'treegrid');
    },
    getVisibleRow: function(row) {
        var r = this.dataSet.getAt(row);
        return (r) ? this.showData.indexOfKey(r.id) : row;
    },
    getBeforeVisibleRow: function(row, moveRow) {
        var beforeRow = -1, ds = this.dataSet;
        var calRow = 0;
        for (var i = row - 1 ; -1 < i; i--) {
            if(ds.getAt(i).getAttribute('_show') == true)
                calRow++;
            if (calRow >= moveRow) {
                beforeRow = i;
                break;
            }
        }
        return (beforeRow > -1) ? this.getVisibleRow(beforeRow) : beforeRow;
    },
    getDataSetRow: function(row) {
        var r = this.getRowRecord(row);
        return (r) ? this.dataSet.indexOfKey(r.id) : row;
    },
    getRowRecord: function(row) {
        return this.showData.getAt(row);
    },
    getDataCount: function(){
        return this.showData.length;
    },
    getParentRow: function(row) {
        var pRow = -1;
        var ds = this.dataSet, dId = this.fields.depthId;
        var pId = ds.getAt(row).pId;
        var depth = ds.getAt(row).get(dId);
        if(depth < 1) return -1;
        for (var i = row - 1; 0 <= i; i--) {
            if(pId) {
                if(ds.getAt(i).id == pId)
                    return i;
            } else {
                if((ds.getAt(i).get(dId) + 1) == depth)
                    return i;
            }
        }
        return pRow;
    },
    getPrevSiblingRow: function(row) {
        var ds = this.dataSet, dId = this.fields.depthId;
        var depth = ds.getNameValue(row, dId);
        for (var i = row - 1; 0 <= i; i--) {
            if(ds.getNameValue(i, dId) == depth) return i;
        }
        return -1;
    },
    getNextSiblingRow: function(row) {
        var ds = this.dataSet, dId = this.fields.depthId, len = this.dataSet.getCount();
        var depth = ds.getNameValue(row, dId);
        for (var i = row + 1; i < len; i++) {
            var d = ds.getNameValue(i, dId);
            if(d < depth) break;
            if(d == depth) return i;
        }
        return -1;
    },
    getChildRows: function(row) {
        var ds = this.dataSet, dId = this.fields.depthId, len = this.dataSet.getCount();
        var depth = ds.getNameValue(row, dId);
        var childRows = [];
        for (var i = row + 1; i < len; i++) {
            var r = ds.getNameValue(i, dId);
            if(r < depth) break;
            if(r == depth) break;
            if(r == (depth + 1)) {
                childRows.push(i);
            }
        }
        return childRows;
    },
    getAllChildRows: function(row) {
        var ds = this.dataSet, dId = this.fields.depthId, len = this.dataSet.getCount();
        var depth = ds.getNameValue(row, dId);
        var childRows = [];
        for (var i = row + 1; i < len; i++) {
            var r = ds.getNameValue(i, dId);
            if(r < depth) break;
            if(r == depth) break;
            childRows.push(i);
        }
        return childRows;
    },
    filter:function(func, scope){
        var ds = this.dataSet;
        ds.data = ds.snapshot.clone();
        ds.mergeModifiedData(ds.data);
        var newData = new Rui.util.LCollection();        
        var depth = 0;
        ds.data.each(function(id, item, i, count){ 
            if(func.call(scope || this, id, item, i) === true) {
                var localDepth = 0;
                var me = this;
                (function findParent(row){
                    if(me.getParentRow(row) != -1) {
                        localDepth++;
                        var pRow = me.getParentRow(row);
                        findParent.call(this, pRow);
                    }
                    if(!newData.has(ds.getAt(row).id)){
                        newData.add(ds.getAt(row).id, ds.getAt(row));
                    }  
                    return;
                })(i);
                depth = (localDepth>depth)?localDepth:depth;
            }
        }, this);
        this._isFiltered = true;
        ds.data = newData;
        ds.rowPosition = -1;
        this.expandDepth(depth);
    },
    clearFilter: function(){
        var ds = this.dataSet;
        var count = ds.getCount();
        if (count < 1 && ds.modified.length < 1 && ds.snapshot.length < 1) 
            return;
        ds.data = ds.snapshot.clone();
        ds.mergeModifiedData(ds.data);
        delete ds._isFiltered;
        ds.rowPosition = -1;
        this.doLoadDataSet(this.defaultOpenDepth, false);
        this.redoRenderData({ resetScroll: true });
    }
});
})();