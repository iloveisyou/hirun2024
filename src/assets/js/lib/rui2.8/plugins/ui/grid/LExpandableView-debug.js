/*
 * @(#) LExpandableView-debug.js
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
 * @description 그리드의 기능 확장을 rendering하는 grid
 * IE 8 이하에서는 지원하지 않음.
 * @module ui_grid
 * @title LExpandableView
 * @requires Rui.ui.grid.LBufferGridView
 */
(function() {
    var Dom = Rui.util.LDom;
    /**
     * @description Table태그를 사용한 rendering하는 grid
     * @namespace Rui.ui.grid
     * @class LExpandableView
     * @extends Rui.ui.grid.LGridView
     * @sample default
     * @plugin
     * @constructor LExpandableView
     * @param {Object} oConfig The intial LExpandableView.
     */
    Rui.ui.grid.LExpandableView = function(oConfig) {  
        Rui.ui.grid.LExpandableView.superclass.constructor.call(this,oConfig);
        
        /**
         * @description expand 메소드가 호출되면 수행하는 이벤트
         * @event expand
         * @param {Object} target this객체
         * @param {HtmlElement} expandableTarget 그리드안에 target되는 dom객체
         * @param {int} row row 아이디
         * @param {boolean} isFirst 처음 펼쳐졌는지 여부
         */
        this.createEvent('expand');
        
        /**
         * @description collapse 메소드가 호출되면 수행하는 이벤트
         * @event collapse
         * @param {Object} target this객체
         * @param {HtmlElement} expandableTarget 그리드안에 target되는 dom객체
         * @param {int} row row 아이디
         */
        this.createEvent('collapse');
    };
    
    Rui.extend(Rui.ui.grid.LExpandableView, Rui.ui.grid.LGridView, {
        isAfterRenderRow: true,
        /**
         * @description expandable에 단순히 내용만 출력하는 function. 리턴값을 바로 하단에 출력한다.
         * function의 파라미터 : row, record, 리턴형은 문자
         * @config rowRenderer
         * @type {Function}
         * @default Rui.emptyFn
         */
        /**
         * @description expandable에 단순히 내용만 출력하는 function. 리턴값을 바로 하단에 출력한다.
         * function의 파라미터 : row, record, 리턴형은 문자
         * @property rowRenderer
         * @type {Function}
         * @protected
         */
        rowRenderer: function(row, record) {
            return '';
        },
        /**
         * @description 현재 선택된 행 return
         * @method getRow
         * @protected
         * @param {int} row row index
         * @return {HTMLElement}
         */
        getRowDom: function(row, index) {
            if(row < 0) return null;
            return this.getRows(index)[row * 2];
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
            var rowHtml = this.getRenderRow(row, record, ds);
            var bodyLi = this.getLastLiEl();
            var tableDom = bodyLi.dom.firstChild;
            // 구현 방법 고민 필요
            var newRowDom = Rui.createElements(rowHtml);
            //newRowDom.innerHTML = rowHtml;
            var newDom = newRowDom.getAt(0).dom;
            if(ds.getCount() > 1) {
                if (row === 0) {
                    var rowDom = this.getRowDom(row);
                    if (rowDom) {
                        var oldDom = tableDom.insertRow(row);
                        Dom.replaceChild(newDom, oldDom);
                        oldDom = null;
                    }
                } else {
                    var oldDom = tableDom.insertRow(row * 2);
                    Dom.replaceChild(newDom, oldDom);
                    oldDom = null;
                }
            } else {
                var oldDom = tableDom.insertRow();
                Dom.replaceChild(newDom, oldDom); 
                oldDom = null;
            }
            this.updateRenderRows(row);

            if (cm.freezeIndex > -1) {
                var rowDom = this.getRowDom(row, 0);
                rowDom = Rui.util.LDom.getNextSibling(rowDom);
                var rowHtml = this.getAfterRenderRow(e.row, e.record, ds.getCount(), true, null);
                var newRowEl = Rui.createElements(rowHtml);
                Dom.insertAfter(newRowEl.getAt(0).dom, rowDom);
            }
            var rowDom = this.getRowDom(row);
            var rowHtml = this.getAfterRenderRow(e.row, e.record, ds.getCount(), false, null);
            var newRowEl = Rui.createElements(rowHtml);
            var oldDom = tableDom.insertRow(row * 2 + 1);
            Dom.replaceChild(newRowEl.getAt(0).dom, oldDom);
            oldDom = null;

            var dataSetRow = ds.getRow();
            
            if(dataSetRow > -1) {
                this.gridPanel.getSelectionModel().selectRow(dataSetRow);
            }
            this.focusRow(row,0);
        },
        /**
         * @description dataSet의 remove 이벤트 발생시 호출되는 메소드
         * @method doRemoveData
         * @protected
         * @param {Object} e Event 객체
         * @return {boolean} 삭제여부
         */
        doRemoveData: function(e) {
            if(e.remainRemoved !== true) {
                var cm = this.columnModel;
                if (cm.freezeIndex > -1) {
                    var rowDom = this.getRowDom(e.row, 0);
                    rowDom = Rui.util.LDom.getNextSibling(rowDom);
                    rowDom.colspan = 1;
                    Dom.removeNode(rowDom);
                }
                var rowDom = this.getRowDom(e.row, 1);
                rowDom = Rui.util.LDom.getNextSibling(rowDom);
                rowDom.colspan = 1;
                Dom.removeNode(rowDom);
            }
            Rui.ui.grid.LExpandableView.superclass.doRemoveData.call(this, e);
        },
        /**
         * @description dataSet의 undo 이벤트 발생시 호출되는 메소드
         * @method doUndoData
         * @protected
         * @param {Object} e Event 객체
         * @return {void}
         */
        doUndoData: function(e) {
            var firstDom, lastDom = null;
            if (e.beforeState == Rui.data.LRecord.STATE_INSERT) {
                var cm = this.columnModel;
                if (cm.freezeIndex > -1) {
                    firstDom = this.getRowDom(e.row, 0);
                    firstDom = Rui.util.LDom.getNextSibling(rowDom);
                }
                var lastDom = this.getRowDom(e.row, 1);
                lastDom = Rui.util.LDom.getNextSibling(lastDom);
            }
            Rui.ui.grid.LExpandableView.superclass.doUndoData.call(this, e);
            var state = e.beforeState, row = e.row;//, record = e.record, dataSet = e.target;
            if(state == Rui.data.LRecord.STATE_INSERT) {
                if(firstDom) {
                    firstDom.colspan = 1;
                    Dom.removeNode(firstDom);
                }
                if(lastDom) {
                    lastDom.colspan = 1;
                    Dom.removeNode(lastDom);
                }
            }
        },
        /**
         * @description row를 생성한 후 추가할 row 정보를 계산한다.
         * @method getAfterRenderRow
         * @protected
         * @param {int} row 현재행 번호
         * @param {Rui.data.LRecord} record
         * @param {int} rowCount
         * @param {int} rowCount row 출력 총 카운트
         * @param {boolean} firstColumns 틀고정 전/후 여부
         * @param {boolean} spansm 셀 머지 여부
         * @param {Object} sumRowsInfo 소계 정보
         * @return {String}
         */
        getAfterRenderRow: function(row, record, rowCount, firstColumns, spansm, sumRowsInfo){
            var cm = this.columnModel;
            var colspan = cm.getColumnCount(true);
            if(this.rowRenderer) {
                var html = this.rowRenderer(row, record);
                var contentWidth = this.columnModel.getTotalWidth(true);
                return '<tr class="L-grid-row-expandable L-grid-row-expandable-' + record.id + '" style="width:' + contentWidth + 'px"><td colspan="' + colspan + '" style="width:' + contentWidth + 'px" class="L-grid-col-expandable">' + html + '</td></tr>';
            } else return '';
        },
        /**
         * @description row의 expand 속성 여부 
         * @method hasExpand
         * @param {int} row 현재행 번호
         * @return {boolean}
         */
        hasExpand: function(row) {
            var rowDom = this.getRowDom(row);
            rowDom = Rui.util.LDom.getNextSibling(rowDom);
            var rowEl = Rui.get(rowDom);
            return rowEl.hasClass('L-expand');
        },
        /**
         * @description row의 expand 속성 설정 
         * @method setExpand
         * @param {int} row 현재행 번호
         * @param {boolean} isExpand expand 여부
         * @return {void}
         */
        setExpand: function(row, isExpand) {
            var rowDom = this.getRowDom(row);
            rowDom = Rui.util.LDom.getNextSibling(rowDom);
            var rowEl = Rui.get(rowDom);
            if(isExpand) rowEl.addClass('L-expand'); else rowEl.removeClass('L-expand');
            var isFirst = !rowEl.hasClass('L-expanded');
            rowEl.addClass('L-expanded');
            var options = { target: this, expandableTarget: rowEl.dom.firstChild, row: row, isFirst: isFirst };
            if(isExpand)
                this.fireEvent('expand', options);
            else
                this.fireEvent('collapse', options);
        },
        /**
         * @description 규칙적인 행의 높이 반환 (보통 행 랜더링시 사용함)
         * @protected
         * @method getRowHeight
         * @return {int}
         */
        getRowHeight: function(){
            var rows = this.getRows(), h = 30;
            if(rows.length < 1)
            	return 30;
            return this._getRowHeight(rows[0]);
        }
    });
})();