/*
 * @(#) LGridView.js
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
    Rui.ui.grid.LGridView = function(oConfig) {
        Rui.ui.grid.LGridView.superclass.constructor.call(this, oConfig);
    };
    var Dom = Rui.util.LDom;
    Rui.extend(Rui.ui.grid.LGridView, Rui.ui.grid.LBufferGridView, {
        isVirtualScroll: false,
        fitContentHeight: false,
        doRender: function(appendToNode) {
            Rui.ui.grid.LGridView.superclass.doRender.call(this, appendToNode);
            this.scrollerEl.setStyle('overflow', 'auto');
            this.el.addClass('L-grid-view');
            Rui.util.LEvent.addListener(this.scrollerEl.dom, 'scroll', this.onScroll, this, true);
        },
        doRenderData: function(e){
        	Rui.ui.grid.LGridView.superclass.doRenderData.call(this, e);
            if(this.columnModel.freezeColumnId) {
            	this.updateRowHeight();
                this.updateFirstLiStyle();
            }
        },
        updateRowHeight: function() {
        	var lastHeaderLi = this.getLastLiEl(true);
        	this.headerHeight = lastHeaderLi.getHeight(true) + this.headerEl.getBorderWidth('tb');
        	var firstLi = this.getFirstLiEl();
        	firstLi.setStyle('top', this.headerHeight + 'px');
        	var lastLi = this.getLastLiEl();
        	if(firstLi && firstLi.dom.childNodes.length > 0 && lastLi && lastLi.dom.childNodes.length > 0) {
                var firstTableDom = firstLi.dom.childNodes[0];
                var firstRows = firstTableDom.rows;
                var lastTableDom = lastLi.dom.childNodes[0];
                var lastRows = lastTableDom.rows;
                for (var i = 0; i < lastRows.length; i++) {
                	var firstRowEl = Rui.get(firstRows[i]);
                	if(!firstRowEl) return;
                	var lastRowEl = Rui.get(lastRows[i]);
                	if(lastRowEl.hasClass(this.CLASS_GRIDVIEW_BODY_EMPTY)) return;
                	var h1 = firstRowEl.getHeight();
                	var h2 = lastRowEl.getHeight();
                	if(h1 < h2) {
                		firstRowEl.setHeight(h2);
                	} else if(h1 > h2) {
                		lastRowEl.setHeight(h1);
                	}
                }
        	}
        },
        getRenderRange: function(isUp){
            var renderRange,
                rowCount = this.getDataCount();
            if(rowCount > 0) {
                renderRange = {
                    start: 0,
                    end: rowCount - 1,
                    visibleStart: 0,
                    visibleEnd: rowCount - 1,
                    rowCount: rowCount,
                    afterRows: {}
                };
            } else {
                renderRange = null;
            }
            this.renderRange = renderRange;
            try {
                return renderRange;
            } finally {
               renderRange = null;
            }
        },
        showEmptyDataMessage: function(){
            var bodyLi = this.getLastLiEl();
            var tableDom = bodyLi.dom.firstChild;
            var messageCode = (this.emptyDataMessageCode != null) ? this.emptyDataMessageCode : '$.base.msg115';
            var emptyDataMessage = Rui.getMessageManager().get(messageCode);
            var trHtml = '<tr class="' + Rui.ui.grid.LBufferGridView.CLASS_GRIDVIEW_BODY_EMPTY + '"><td colspan="' + this.columnModel.getColumnCount(true) + '">' + emptyDataMessage + '</td></tr>';
            var newRowDom = Rui.createElements(trHtml);
            var newDom = newRowDom.getAt(0).dom;
            var oldDom = tableDom.insertRow(0);
            Dom.replaceChild(newDom, oldDom);
            newRowDom = newDom = oldDom = null;
        },
        getGrowedCount: function(){
            return 0;
        },
        redoRender: function(system){
            Rui.ui.grid.LGridView.superclass.redoRender.call(this, system);
        },
        _redoRender: function(system) {
            Rui.ui.grid.LGridView.superclass._redoRender.call(this, system);
            this.scrollerEl.setStyle('overflow', 'auto');
            Rui.util.LEvent.addListener(this.scrollerEl.dom, 'scroll', this.onScroll, this, true);
            if(this.columnModel.freezeColumnId) {
            	this.updateRowHeight();
                this.updateFirstLiStyle();
            }
        },
        redoRenderData: function(options){
            if(options && options.renderCheckFirst)
                Rui.ui.grid.LGridView.superclass.redoRenderData.call(this, options);
        },
        _redoRenderData: function(opt) {
            try {
                this.delayEditorRender = this.delayEditorRender || 0;
                if(!this.isDelayEditorRender) {
                    var compTime1 = new Date() - this.modifiedDate;
                    if (compTime1 < 5000) {
                        for (var i = 0, len = this.columnModel.getColumnCount(true); this.delayEditorRender < 300 && i < len; i++) {
                            var column = this.columnModel.getColumnAt(i, true);
                            if(column.editor && column.editor.dataSet && column.editor.dataSet.isLoad !== true)
                                return;
                        }
                    }
                    this.isDelayEditorRender = true;
                }
                if(this.delayRRD)
                    this.delayRRD.cancel();
                this.delayRRD = null;
                this.doRenderData();
            } catch(e) {
                Rui.log('error : '+ e.message);
            }
        },
        onWidthResize: function(e){
        },
        makeScroll: function(initScroll){
        },
        getRenderedRow: function(row){
            return row;
        },
        getScrollerEl: function() {
            return this.scrollerEl; 
        },
        updateColumnWidth : function(cellIndex,oldWidth,newWidth){
            var diffWidth = newWidth - oldWidth;
            var contentWidth = this.columnModel.getTotalWidth(true);
            var offsetWidth = contentWidth; 
            newWidth = this.adjustColumnWidth(newWidth);
            this.updateHeaderWidth(cellIndex,diffWidth,offsetWidth,contentWidth, newWidth);
            this.bodyEl.setWidth(contentWidth);
            var isEmpty = this.updateEmptyWidth(contentWidth);
            if (!isEmpty) {
                if(this.dataSet.getCount() > 0) {
                    var cm = this.columnModel;
                    var firstWidth = cm.getFirstColumnsWidth(true);
                    var lastWidth = cm.getLastColumnsWidth(true);
                    var firstRows = null;
                    var firstLiEl = this.getFirstLiEl();
                    var lastLiEl = this.getLastLiEl();
                    if(this.columnModel.freezeIndex > -1) {
                        var firstTableDom = firstLiEl.dom.childNodes[0];
                        firstRows = firstTableDom.rows;
                    }
                    var lastTableDom = lastLiEl.dom.childNodes[0];
                    var lastRows = lastTableDom.rows;
                    var row = null;
                    for (var i = 0; i < lastRows.length; i++) {
                        if(firstRows && firstRows[i]) {
                            var firstRow = Rui.get(firstRows[i]);
                            if(firstRow.hasClass('L-grid-row')) {
                                firstRow.setWidth(firstWidth);
                                if(cellIndex <= this.columnModel.freezeIndex) {
                                    var cellDom = this.getRowCellDom(firstRow.dom, i, cellIndex);
                                    cellDom.style.width = newWidth + 'px';
                                }
                            }
                        }
                        row = Rui.get(lastRows[i]);
                        row.setWidth(lastWidth);
                        if(row.hasClass('L-grid-row')) {
                            if (cellIndex > this.columnModel.freezeIndex) {
                                var cellDom = this.getRowCellDom(row.dom, i, cellIndex);
                                cellDom.style.width = newWidth + 'px';
                            }
                        }
                    }
                    var firstTable = Rui.get(firstLiEl.dom.firstChild);
                    var lastTable = Rui.get(lastLiEl.dom.firstChild);
                    firstTable.setWidth(firstWidth);
                    lastTable.setWidth(lastWidth);
                    lastTable.setStyle('margin-left', firstWidth + 'px');
                }
            }
        },
        updateHeaderWidth : function(cellIndex,diffWidth,offsetWidth,contentWidth, newWidth){
            var cm = this.columnModel;
            var column = cm.getColumnAt(cellIndex, true);
            var index = 1;
            if(cm.freezeIndex > -1)
                index = (cellIndex <= cm.freezeIndex) ? 0 : 1;
            var headerLi = (index === 0) ? this.getFirstLiEl(true) : this.getLastLiEl(true);
            var tblEl = headerLi.select('table').getAt(0);
            var columnCount = cm.getColumnCount(true);
            var cellEl = tblEl.select('.L-grid-cell-' + column.id).getAt(0);
            if(cm.isMultiheader()) {
                this.updateHeaderInnerWidth(cellIndex,tblEl.dom,cellEl,column,diffWidth,columnCount);
            }
            cellEl.dom.style.width = newWidth + 'px';
            this.headerOffsetEl.setWidth(offsetWidth);
            if(cm.freezeIndex > -1) {
                var firstWidth = cm.getFirstColumnsWidth(true);
                var lastWidth = cm.getLastColumnsWidth(true);
                var firstTable = Rui.get(this.getFirstLiEl(true).dom.firstChild);
                var lastTable = Rui.get(this.getLastLiEl(true).dom.firstChild);
                firstTable.setWidth(firstWidth);
                lastTable.setWidth(lastWidth);
                lastTable.setStyle('margin-left', firstWidth + 'px');
            } else 
                tblEl.setWidth(contentWidth);
        },
        updateHeaderInnerWidth: function(cellIndex,domTable,cellEl,column,diffWidth,columnCount){
            var cm = this.columnModel;
            if(cm.freezeIndex > -1)
            	cellIndex = (cellIndex <= cm.freezeIndex) ? cellIndex : cellIndex - cm.freezeIndex - 1;
            var rowArray = this.getTableSpanInfo(domTable,columnCount);
            var rowCount = rowArray.length;
            var cellIdxs = new Array();
            var colSpan;         
            for (var i=0;i<rowCount-1;i++){         
                for (var j=cellIndex+1;j--;){
                    colSpan = rowArray[i][j].colSpan;
                    if(colSpan >= 1){
                        cellIdxs.push(rowArray[i][j].cellIndex);
                        break;
                    }
                }
            }
            var divEls = [];
            for (var i=0;i<cellIdxs.length;i++){
                var divEl = Rui.get(domTable.rows[i].cells[cellIdxs[i]]);
                divEls.push({el:divEl,width:divEl.getWidth()+diffWidth,calPad:divEl.getWidth() <= (divEl.getWidth() - (9+1)) ? false : true});
            }
            var width;
            for (var i=0;i<divEls.length;i++){
                width = divEls[i].width;
                divEls[i].el.setWidth(width <= 0 ? 1 : width);
            }            
        },
        getTableSpanInfo : function(domTable, colCount){
            var rowArray = new Array();
            var colArray;
            var rowCount = domTable.rows.length;
            for (var i = 0; i < rowCount; i++) {
                colArray = new Array();
                for (var j = 0; j < colCount; j++) colArray.push({cellIndex:-1,rowSpan:1,colSpan:1,fieldName:''});
                rowArray.push(colArray);
            }
            var colS = 1;
            var cellIndex,cellCount;
            for (var i = 0; i < rowCount; i++) {
                row = domTable.rows[i];
                cellCount = row.cells.length;
                cellIndex = 0;
                for (var j = 0; j < colCount; j++) {
                    if (rowArray[i][j].colSpan != 0) {
                        if (colS == 1 && cellIndex < cellCount) {
                            cell = row.cells[cellIndex];
                            rowArray[i][j] = {cellIndex:cell.cellIndex,rowSpan:cell.rowSpan,colSpan:cell.colSpan,fieldName:cell.id};
                            cellIndex++;
                        }
                        if (colS > 1) {
                            colS = colS - 1;
                            rowArray[i][j].colSpan = colS > 1 ? -1 : -2;
                        }
                        else {
                            colS = cell.colSpan;
                            rowArray[i][j] = {cellIndex:cell.cellIndex,rowSpan:cell.rowSpan,colSpan:colS,fieldName:cell.id};
                        }
                        for (var k = 1; k < cell.rowSpan; k++) {
                            if (i + k <= rowCount - 1) {
                                rowArray[i + k][j].rowSpan = 0;
                                rowArray[i + k][j].colSpan = 0;
                            }
                            else
                                break;
                        }
                    }
                }
            }
            return rowArray;
        },
        onColumnResize: function(e) {
            this.gridPanel.onColumnResize(e);
            var cellIndex = this.columnModel.getIndex(e.target, true);
            this.updateColumnWidth(cellIndex,e.oldWidth,e.newWidth);
            this.syncHeaderScroll();
        },
        doAddData: function(e) {
            this.hideEmptyDataMessage();
            var row = e.row, record = e.record, ds = e.target, cm = this.columnModel;
            if(record.dataSet.getCount() < 50) {
            	this.redoRenderData({ resetScroll: false, renderCheckFirst: true });
            	return;
            }
            var rowHtml = this.getRenderRow(row, record, ds);
            if(this.columnModel.freezeIndex > -1) {
            	var fistRowHtml = this.getRenderRow(row, record, ds, true);
                var firstBodyLi = this.getFirstLiEl();
                var firstTableDom = firstBodyLi.dom.firstChild;
                var firstNewRowDom = Rui.createElements(fistRowHtml);
                var firstNewDom = firstNewRowDom.getAt(0).dom;
                if(ds.getCount() > 0 && firstTableDom.rows.length) {
                    if(row === 0) {
                        var rowDom = this.getRowDom(row);
                        if(rowDom) {
                            var oldDom = firstTableDom.insertRow(row);
                            Dom.replaceChild(firstNewDom, oldDom);
                            oldDom = null;
                        }
                    } else {
                        var oldDom = firstTableDom.insertRow(row);
                        Dom.replaceChild(firstNewDom, oldDom);
                        oldDom = null;
                    }
                } else {
                    var oldDom = firstTableDom.insertRow();
                    Dom.replaceChild(firstNewDom, oldDom); 
                    oldDom = null;
                }
                firstNewDom = null;
            }
            var bodyLi = this.getLastLiEl();
            var tableDom = bodyLi.dom.firstChild;
            var newRowDom = Rui.createElements(rowHtml);
            var newDom = newRowDom.getAt(0).dom;
            if(ds.getCount() > 0 && tableDom.rows.length) {
                if(row === 0) {
                    var rowDom = this.getRowDom(row);
                    if(rowDom) {
                        var oldDom = tableDom.insertRow(row);
                        Dom.replaceChild(newDom, oldDom);
                        oldDom = null;
                    }
                } else {
                    var oldDom = tableDom.insertRow(row);
                    Dom.replaceChild(newDom, oldDom);
                    oldDom = null;
                }
            } else {
                var oldDom = tableDom.insertRow();
                Dom.replaceChild(newDom, oldDom); 
                oldDom = null;
            }
            newDom = null;
            this.updateRenderRows(row);
            var dataSetRow = ds.getRow();
            if(dataSetRow > -1) {
                this.gridPanel.getSelectionModel().selectRow(dataSetRow);
            }
            this.focusRow(row,0);
        },
        doCellUpdateData: function(e) {
            var row = e.row, col = e.col, colId = e.colId, record = e.record;
            if(this.getColumnModel().isMerged()){
            	this.redoRenderData({ resetScroll: false, renderCheckFirst: true });
            	return;
            } else {
                col = this.columnModel.getIndexById(colId, true);
                if(col >= 0) this.doRenderCell(row, col, record);
                var spans = this.cellMergeInfoSet;
                for (var i = 0, len = this.columnModel.getColumnCount(true) ; i < len; i++) {
                    if (this.columnModel.getColumnAt(i, true).renderRow === true) {
                        var span = spans ? spans[row][i] : undefined;
                        this.doRenderCell(row, i, record, span);
                    }
                }
            }
        },
        doRemoveData: function(e) {
            if(e.remainRemoved) return false;
            var row = e.row, record = e.record, dataSet = e.target;
            if(record.dataSet.getCount() < 50) {
            	this.redoRenderData({ resetScroll: false, renderCheckFirst: true });
            	return;
            }
            var cm = this.columnModel;
            if (cm.freezeIndex > -1) {
                var rowDom = this.getRowDom(e.row, 0);
                Dom.removeNode(rowDom);
            }
            var currentRowDom = this.getRowDom(row, 1);
            Dom.removeNode(currentRowDom);
            this.updateRenderRows(row);
            this.doEmptyDataMessage();
            return true;
        },
        doUndoData: function(e) {
            var state = e.beforeState, row = e.row;
            if(state == Rui.data.LRecord.STATE_INSERT) {
                var cm = this.columnModel;
                if (cm.freezeIndex > -1) {
                    var rowDom = this.getRowDom(e.row, 0);
                    Dom.removeNode(rowDom);
                }
                var currentRowDom = this.getRowDom(row, 1);
                Dom.removeNode(currentRowDom);
                this.updateRenderRows(row);
                this.doEmptyDataMessage();
            } else if(state == Rui.data.LRecord.STATE_UPDATE) {
                this.onRowUpdateData(e);
                this.updateRenderRows(row);
                this.doEmptyDataMessage();
            }
        },
        syncFocusRow: function(row,col) {
            try{
                var cellDom = this.getCellDom(row, col);
                this.moveXScroll(cellDom, col);
                var xy = this.getCellXY(cellDom);
                if (xy.x != false) {
                    this.focusEl.setX(xy.x);
                }
                if (xy.y != false) {
                    this.focusEl.setY(xy.y);
                }
            }catch(e) {};
        },
        moveYScroll: function(row){
            if(row < 0)
                return;
            var rowDom = this.getRowDom(row);
            if(!rowDom) return;
            var scrollTop = this.scrollerEl.dom.scrollTop,
                offsetTop = rowDom.offsetTop,
                rowHeight = rowDom.offsetHeight,
                scrollHeight = this.scrollerEl.getHeight(true),
                scrollWidth = this.scrollerEl.getWidth(true),
                bodyWidth = this.bodyEl.getWidth(),
                scrollbarHeight = 0;
            scrollbarHeight = bodyWidth > scrollWidth ? 17 : 0;
            scrollHeight = scrollHeight - scrollbarHeight;
            if(scrollTop > offsetTop){
                this.scrollerEl.dom.scrollTop = offsetTop;
            }else if(scrollTop + scrollHeight <= offsetTop){
                this.scrollerEl.dom.scrollTop = scrollTop + (offsetTop - (scrollTop + scrollHeight)) + rowHeight;
            }else{
                if(offsetTop + rowHeight > scrollTop + scrollHeight){
                    this.scrollerEl.dom.scrollTop = rowHeight - (scrollHeight - offsetTop);
                }
            }
        },
        moveXScroll: function(cellDom, col){
            var scrollerEl = this.getScrollerEl(),
                targetEl = Rui.get(cellDom),
                topLeft = scrollerEl.getVisibleScrollXY(targetEl, true, true, this.marginLeft, !!this.scroller);
            if(topLeft && !Rui.isEmpty(topLeft.left) && topLeft.left >= 0)
                scrollerEl.dom.scrollLeft = col > 0 ? topLeft.left : 0;
            scrollerEl = targetEl = null;
            this.syncHeaderScroll();
        },
        onScroll: function(e){
            this.headerEl.dom.scrollLeft = this.scrollerEl.dom.scrollLeft;
            if(this.columnModel.freezeColumnId) this.updateFirstLiStyle();
            this.gridPanel.stopEditor(true);
        },
        updateFirstLiStyle: function() {
        	var firstLi = this.getFirstLiEl();
        	var scrollBarSize = Math.abs(this.scrollerEl.dom.scrollWidth - this.scrollerEl.dom.offsetWidth) > 20 ? Rui.ui.LScroller.SCROLLBAR_SIZE : 0;
        	firstLi.setStyle('top', -(this.scrollerEl.dom.scrollTop - this.headerHeight) + 'px');
        	firstLi.setHeight(this.scrollerEl.getHeight() + this.scrollerEl.dom.scrollTop - scrollBarSize);
        },
        showRow: function(row) {
            var r = this.dataSet.getAt(row);
            if(r) {
                r.setAttribute('_showRowDom', true);
                var rowDom = this.getRowDom(row);
                if(rowDom) Rui.get(rowDom).show();
            }
        },
        hideRow: function(row) {
            var r = this.dataSet.getAt(row);
            if(r) {
                r.setAttribute('_showRowDom', hide);
                var rowDom = this.getRowDom(row);
                if(rowDom) Rui.get(rowDom).hide();
            }
        },
        isShowRow: function(row) {
            var r = this.dataSet.getAt(row);
            if(r)
                return (r.getAttribute('_showRowDom') !== false);
            return false;
        },
        toggleShowRow: function(row) {
            if(this.isShowRow(row))
                this.hideRow(row);
            else
                this.showRow(row);
        },
        createFormValues: function() {
            if(!this.hiddenFormEl) {
                this.hiddenFormEl = Rui.createElements('<div class="L-hidden-forms"></div>').getAt(0);
                this.el.appendChild(this.hiddenFormEl);
                this.templates.hiddenFormInput = new Rui.LTemplate(
                    '<input type="hidden" name="{name}" value="{value}">'
                );
            }
            var html = '';
            var fields = this.dataSet.getFields();
            var records = this.dataSet.getModifiedRecords();
            for (var i = 0, len = records.length; i < len; i++) {
                var r = records.getAt(i);
                html += this.templates.hiddenFormInput.apply({
                    name: 'rid',
                    value: r.id
                });
                html += this.templates.hiddenFormInput.apply({
                    name: 'state',
                    value: r.state
                });
                for (var j = 0, fLen = fields.length; j < fLen; j++) {
                    var f = fields[j];
                    var value = r.get(f.id);
                    var formater = this.dataSet.writeFieldFormater[f.type];
                    if(formater) value = formater(value);
                    if(value == null) value = '';
                    html += this.templates.hiddenFormInput.apply({
                        name: f.id,
                        value: value
                    });
                }
            }
            if(html)
                this.hiddenFormEl.html(html);
        },
        clearFormValues: function() {
            if(this.hiddenFormEl) this.hiddenFormEl.html('');
        }
    });
})();
