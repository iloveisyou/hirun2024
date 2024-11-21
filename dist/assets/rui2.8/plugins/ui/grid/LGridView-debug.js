/*
 * @(#) LGridView-debug.js
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
    /**
     * @description 그리드의 데이터를 출력하는 LGridView (트리그리드, 소계, 합계 지원, 셀병합시 변경 처리 안함.)
     * @namespace Rui.ui.grid
     * @class LGridView
     * @extends Rui.ui.grid.LBufferGridView
     * @sample default
     * @plugin
     * @constructor LGridView
     * @param {Object} oConfig The intial LGridView.
     */
    Rui.ui.grid.LGridView = function(oConfig) {
        Rui.ui.grid.LGridView.superclass.constructor.call(this, oConfig);
    };

    var Dom = Rui.util.LDom;
    //var Ev = Rui.util.LEvent;
    //var GV = Rui.ui.grid.LBufferGridView;

    Rui.extend(Rui.ui.grid.LGridView, Rui.ui.grid.LBufferGridView, {
        /**
         * @description 가상 스크롤을 사용할지 여부를 결정한다.
         * @property isVirtualScroll
         * @type {boolean}
         * @private
         */
        isVirtualScroll: false,
        /**
         * @description 그리드의 row가 출력되는 만큼 자동으로 height가 넓어지는 기능
         * @config fitContentHeight
         * @type {boolean}
         * @default false
         */
       /**
         * @description 그리드의 row가 출력되는 만큼 자동으로 height가 넓어지는 기능
         * @property fitContentHeight
         * @type {boolean}
         * @protected
         */
        fitContentHeight: false,
        /**
         * @description rendering
         * @method doRender
         * @protected
         * @return {void}
         */
        doRender: function(appendToNode) {
            Rui.ui.grid.LGridView.superclass.doRender.call(this, appendToNode);
            this.scrollerEl.setStyle('overflow', 'auto');
            this.el.addClass('L-grid-view');
            
            Rui.util.LEvent.addListener(this.scrollerEl.dom, 'scroll', this.onScroll, this, true);
        },
        /**
         * @description body content rendering
         * @protected
         * @method doRenderData
         * @param {Object} e Event Object
         * @return {void}
         */
        doRenderData: function(e){
        	Rui.ui.grid.LGridView.superclass.doRenderData.call(this, e);
            if(this.columnModel.freezeColumnId) {
            	this.updateRowHeight();
                this.updateFirstLiStyle();
            }
        },
        /**
         * @description 틀고정일 경우 각 row의 height를 비교해서 height를 적용한다.
         * @protected
         * @method updateRowHeight
         * @return {void}
         */
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
        /**
         * @description rendering해야할 행 시작 index, 종료 index 계산후 return
         * @protected
         * @method getRenderRange
         * @return {object} start, end
         */
        getRenderRange: function(isUp){
            var renderRange,
                rowCount = this.getDataCount();
            if(rowCount > 0) {
                renderRange = {
                    start: 0,
                    end: rowCount - 1,
                    visibleStart: 0,
                    visibleEnd: rowCount - 1,
//                    renderRowCount: rowCount - 1,
                    rowCount: rowCount,
//                    frontCache : 0,
//                    backCache : 0,
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
        /**
         * @description 행이 없을 경우 메시지 출력
         * @method showEmptyDataMessage
         * @protected
         * @return {void}
         */
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
        /**
         * @description 현재 랜더링된 스크롤 범위에 추가될 row를 계산하여 반환한다.
         * @private
         * @method getGrowedCount
         * @return {int}
         */
        getGrowedCount: function(){
            return 0;
        },
        /**
         * @description 상태를 유지한체 전체를 새롭게 그리기
         * @method redoRender
         * @protected
         * @return {void}
         */
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
        /**
         * @description create,delete에 따라서 전체행 다시 그리기.
         * @protected
         * @method redoRenderData
         * @param {Object} options options 정보
         * @return {void}
         */
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
        /**
         * @description auto width의 경우 panel width가 조정될 경우 재계산
         * @method onWidthResize
         * @protected
         * @return {void}
         */
        onWidthResize: function(e){
        },
        /**
         * @description Scroller를 생성한다.  스크롤은 행수에 따른 고정 넓이를 할당하고 한화면에 보여줄 수 있는 행수를 계산하여 처리
         * @protected
         * @method makeScroll
         * @param {boolean} initScroll
         * @return {void}
         */
        makeScroll: function(initScroll){
        },
        /**
         * @description 실제 dom으로 출력된 행인지 점검하고 출력된 행이면 실제 dom상의 index return
         * @method getRenderedRow
         * @protected
         * @param {int} row row index
         * @return {int}
         */
        getRenderedRow: function(row){
            return row;
        },
        /**
         * @description grid body scroller LElement return
         * @method getScrollerEl
         * @protected
         * @return {Rui.LElement}
         */
        getScrollerEl: function() {
            return this.scrollerEl; 
        },
        /**
         * @description column resize에 따른 column 넓이 설정
         * @method updateColumnWidth
         * @protected
         * @param {int} cellIndex
         * @param {int} width
         * @return {void}
         */
        updateColumnWidth : function(cellIndex,oldWidth,newWidth){
            var diffWidth = newWidth - oldWidth;
            //column width가 변경될 경우 전체 cell에 적용, cell merge는 배제.                        
            var contentWidth = this.columnModel.getTotalWidth(true);
            var offsetWidth = contentWidth; // + this.scrollBarWidth;
            //width 변경해야할 것 : header offset, header table & cell width, grid-body, body table & cell width
            newWidth = this.adjustColumnWidth(newWidth);
            this.updateHeaderWidth(cellIndex,diffWidth,offsetWidth,contentWidth, newWidth);
            this.bodyEl.setWidth(contentWidth);
            //empty message div도 조정
            var isEmpty = this.updateEmptyWidth(contentWidth);
            if (!isEmpty) {
                if(this.dataSet.getCount() > 0) {
                    //성능을 위해 dom 직접 사용
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
        /**
         * @description column resize에 따른 header column 넓이 설정
         * @method updateHeaderWidth
         * @protected
         * @param {int} cellIndex
         * @param {int} diffWidth
         * @param {int} offsetWidth
         * @param {int} contentWidth
         * @param {int} newWidth
         * @return {void}
         */
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
                    //colSpan되는 cell의 index를 찾는다.
                    colSpan = rowArray[i][j].colSpan;
                    if(colSpan >= 1){
                        cellIdxs.push(rowArray[i][j].cellIndex);
                        break;
                    }
                }
            }
            var divEls = [];
            //값을 미리 계산한다.  할당하면 아래 cell에 영향을 줄수 있으므로.
            //innerWidth가 0이면 chrome에서 multiHeader가 망가진다.
            for (var i=0;i<cellIdxs.length;i++){
                var divEl = Rui.get(domTable.rows[i].cells[cellIdxs[i]]);
                divEls.push({el:divEl,width:divEl.getWidth()+diffWidth,calPad:divEl.getWidth() <= (divEl.getWidth() - (9+1)) ? false : true});
            }
            //할당한다.
            var width;
            for (var i=0;i<divEls.length;i++){
                //width = divEls[i].calPad ? divEls[i].width - this.cellInnerDivPadding : divEls[i].width;
                width = divEls[i].width;
                divEls[i].el.setWidth(width <= 0 ? 1 : width);
            }            
            //var iWidth = ((column.width - this.cellInnerDivPadding <= 0) ? 1 : column.width - this.cellInnerDivPadding);
            //cellEl.select('div.L-grid-header-inner').setWidth(iWidth);
        },
        /**
         * @description multiheader의 columnModel multiheaderHtml정보를 2차원 배열로 분석한것
         * @method getTableSpanInfo
         * @protected
         * @param {HTMLElement} domTable columnModel multiheaderHtml 정보를 dom으로 만든것
         * @param {int} colCount column 전체 갯수
         * @return {Array} 2차원 array
         */
        getTableSpanInfo : function(domTable, colCount){
            //ie6/7 및 !DU.isBorderBox(표준모드)일때 border 계산
            /*
             * [{cellIndex:1,rowSpan:1,colSpan:2,fieldName:xxx}]
             * */
            var rowArray = new Array();
            //1. cell colSpan정보를 저장할 2차원 배열 만들기, 아랫 배열도 동시에 update해야하므로 배열을 미리 만듬.
            var colArray;
            var rowCount = domTable.rows.length;
            for (var i = 0; i < rowCount; i++) {
                colArray = new Array();
                for (var j = 0; j < colCount; j++) colArray.push({cellIndex:-1,rowSpan:1,colSpan:1,fieldName:''});
                rowArray.push(colArray);
            }
            //2. 배열에 실제 cell의 colSpan, rowSpan정보를 넣기
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
                        //colSpan 갯수만큼 0을 입력
                        if (colS > 1) {
                            colS = colS - 1;
                            rowArray[i][j].colSpan = colS > 1 ? -1 : -2;//-1이거나 1보다 크면 아래 cell width에 + border width 한다.
                        }
                        else {
                            colS = cell.colSpan;
                            rowArray[i][j] = {cellIndex:cell.cellIndex,rowSpan:cell.rowSpan,colSpan:colS,fieldName:cell.id};
                        }
                        //rowSpan만큼 해당 cell에 0을 넣음
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
        /**
         * @description column resize하기
         * @method onColumnResize
         * @private
         * @param {Object} e 이벤트 객체
         * @return {void}
         */
        onColumnResize: function(e) {
            this.gridPanel.onColumnResize(e);
            var cellIndex = this.columnModel.getIndex(e.target, true);
            this.updateColumnWidth(cellIndex,e.oldWidth,e.newWidth);
            this.syncHeaderScroll();
        },
        /**
         * @description dataSet의 add 이벤트 발생시 호출되는 메소드
         * @method doAddData
         * @protected
         * @param {Object} e Event 객체
         * @return {void}
         */
        doAddData: function(e) {
            this.hideEmptyDataMessage();
            var row = e.row, record = e.record, ds = e.target, cm = this.columnModel;
            if(record.dataSet.getCount() < 50) {
            	// 건수를 늘리면 성능 저하가 발생함.
            	this.redoRenderData({ resetScroll: false, renderCheckFirst: true });
            	return;
            }
            
            var rowHtml = this.getRenderRow(row, record, ds);
            
            if(this.columnModel.freezeIndex > -1) {
            	var fistRowHtml = this.getRenderRow(row, record, ds, true);
                var firstBodyLi = this.getFirstLiEl();

                var firstTableDom = firstBodyLi.dom.firstChild;
                // 구현 방법 고민 필요
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
            // 구현 방법 고민 필요
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
        /**
         * @description dataSet의 update 이벤트 발생시 호출되는 메소드
         * @method doCellUpdateData
         * @protected
         * @param {Object} e Event 객체
         * @return {void}
         */
        doCellUpdateData: function(e) {
            var row = e.row, col = e.col, colId = e.colId, record = e.record;
            if(this.getColumnModel().isMerged()){
            	// 건수를 늘리면 성능 저하가 발생함.
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
        /**
         * @description dataSet의 remove 이벤트 발생시 호출되는 메소드
         * @method doRemoveData
         * @protected
         * @param {Object} e Event 객체
         * @return {boolean} 삭제여부
         */
        doRemoveData: function(e) {
            if(e.remainRemoved) return false;

            var row = e.row, record = e.record, dataSet = e.target;
            if(record.dataSet.getCount() < 50) {
            	// 건수를 늘리면 성능 저하가 발생함.
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
        /**
         * @description dataSet의 undo 이벤트 발생시 호출되는 메소드
         * @method doUndoData
         * @protected
         * @param {Object} e Event 객체
         * @return {void}
         */
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
        /**
         * @description focus된 row에 focusEl 이동하기
         * @method syncFocusRow
         * @protected
         * @param {int} row row index
         * @param {int} col column index
         * @return {void}
         */
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
        /**
         * @description 세로 스크롤을 제공된 row 기준으로 이동한다.
         * @method moveYScroll
         * @protected
         * @param {int} row row index
         * @return {object} .x .y
         */
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
                //윗쪽방향
                this.scrollerEl.dom.scrollTop = offsetTop;
            }else if(scrollTop + scrollHeight <= offsetTop){
                //아랫방향
                this.scrollerEl.dom.scrollTop = scrollTop + (offsetTop - (scrollTop + scrollHeight)) + rowHeight;
            }else{
                //보이는 영역 안에 있는경우 (보통 무시)
                if(offsetTop + rowHeight > scrollTop + scrollHeight){
                    //보이는 영역 가장 마지막 건이면서 일부가 안보이는 경우.
                    this.scrollerEl.dom.scrollTop = rowHeight - (scrollHeight - offsetTop);
//                    this.scrollerEl.dom.scrollTop += rowHeight;
                }
            }
        },
        /**
         * @description 가로 스크롤을 제공된 cell 기준으로 이동한다.
         * @method moveXScroll
         * @protected
         * @param {Object} cellDom 이동될 셀의 DOM
         * @param {int} col column index
         */
        moveXScroll: function(cellDom, col){
            var scrollerEl = this.getScrollerEl(),
                targetEl = Rui.get(cellDom),
                topLeft = scrollerEl.getVisibleScrollXY(targetEl, true, true, this.marginLeft, !!this.scroller);
            if(topLeft && !Rui.isEmpty(topLeft.left) && topLeft.left >= 0)
                scrollerEl.dom.scrollLeft = col > 0 ? topLeft.left : 0;
            scrollerEl = targetEl = null;
            this.syncHeaderScroll();
        },
        /**
         * @description 가로 또는 세로 스크롤이 이동되면 발생되는 스크롤이벤트 핸들러
         * @method onScroll
         * @private
         * @param {Object} e scroll event object
         */
        onScroll: function(e){
            this.headerEl.dom.scrollLeft = this.scrollerEl.dom.scrollLeft;
            if(this.columnModel.freezeColumnId) this.updateFirstLiStyle();
            this.gridPanel.stopEditor(true);
        },
        /**
         * @description 틀고정시 FirstLi의 하단 스크롤바를 가리지 않게 하는 소스
         * @method updateFirstLiStyle
         * @private
         */
        updateFirstLiStyle: function() {
        	var firstLi = this.getFirstLiEl();
        	var scrollBarSize = Math.abs(this.scrollerEl.dom.scrollWidth - this.scrollerEl.dom.offsetWidth) > 20 ? Rui.ui.LScroller.SCROLLBAR_SIZE : 0;
        	firstLi.setStyle('top', -(this.scrollerEl.dom.scrollTop - this.headerHeight) + 'px');
        	firstLi.setHeight(this.scrollerEl.getHeight() + this.scrollerEl.dom.scrollTop - scrollBarSize);
        },
        /**
         * @description 그리드의 row행을 출력한다.
         * @method showRow
         * @param {int} row 출력할 row행 index
         * @return {void}
         */
        showRow: function(row) {
            var r = this.dataSet.getAt(row);
            if(r) {
                r.setAttribute('_showRowDom', true);
                var rowDom = this.getRowDom(row);
                if(rowDom) Rui.get(rowDom).show();
            }
        },
        /**
         * @description 그리드의 row행을 숨긴다.
         * @method hideRow
         * @param {int} row 출력할 row행 index
         * @return {void}
         */
        hideRow: function(row) {
            var r = this.dataSet.getAt(row);
            if(r) {
                r.setAttribute('_showRowDom', hide);
                var rowDom = this.getRowDom(row);
                if(rowDom) Rui.get(rowDom).hide();
            }
        },
        /**
         * @description 그리드의 row행을 출력여부를 리턴한다.
         * @method isShowRow
         * @param {int} row 출력할 row행 index
         * @return {boolean} 출력 여부
         */
        isShowRow: function(row) {
            var r = this.dataSet.getAt(row);
            if(r)
                return (r.getAttribute('_showRowDom') !== false);
            return false;
        },
        /**
         * @description 그리드의 row행을 출력되어 있으면 숨기고 숨긴상태면 출력한다.
         * @method toggleShowRow
         * @param {int} row 출력할 row행 index
         * @return {void}
         */
        toggleShowRow: function(row) {
            if(this.isShowRow(row))
                this.hideRow(row);
            else
                this.showRow(row);
        },
        /**
         * @description 그리드 내부에 form submit을 위한 hidden input 태그를 생성한다.
         * @method createFormValues
         * @return {void}
         */
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
        /**
         * @description 그리드 내부에 생성한 form hidden input 태그를 삭제한다.
         * @method clearFormValues
         * @return {void}
         */
        clearFormValues: function() {
            if(this.hiddenFormEl) this.hiddenFormEl.html('');
        }
    });
})();
