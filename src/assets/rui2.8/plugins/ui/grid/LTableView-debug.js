/*
 * @(#) LTableView-debug.js
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
 * @description LTableView 성능을 위해 보이는 부분만 rendering하는 grid
 * @module ui_grid
 * @title LTableView
 * @requires Rui.ui.grid.LGridView
 */
Rui.namespace('Rui.ui.grid');
(function() {
    var Dom = Rui.util.LDom;
    var GV = Rui.ui.grid.LGridView;
    /**
     * @description Table태그를 사용한 rendering하는 grid
     * @plugin
     * @namespace Rui.ui.grid
     * @class LTableView
     * @extends Rui.ui.grid.LGridView
     * @private
     * @plugin
     * @constructor LTableView
     * @param {Object} oConfig The intial LTableView.
     */
    Rui.ui.grid.LTableView = function(oConfig) {  
        Rui.ui.grid.LTableView.superclass.constructor.call(this,oConfig);
    };
    
    Rui.extend(Rui.ui.grid.LTableView, Rui.ui.grid.LGridView, {
        /**
         * @description row selector class name
         * @property rowSelector
         * @type {string}
         * @private
         */
        rowSelector: '.' + GV.CLASS_GRIDVIEW_ROW,
        /**
         * @description cell selector class name
         * @property cellSelector
         * @type {string}
         * @private
         */
        cellSelector: '.' + GV.CLASS_GRIDVIEW_CELL,
        /**
         * @description template 생성
         * @method createTemplate
         * @protected
         * @return {void}
         */
        createTemplate: function() {

            var ts = this.templates || {};

            if (!ts.master) {
                ts.master = new Rui.LTemplate(
                            '<table border="0" cellspacing="0" cellpadding="0" class="L-grid-view-table" style="{tstyle}">',
                            '{header}',
                            '<tbody>{body}</tbody>',
                            '</table>',
                            '<div class="L-grid-loading-panel"></div>'
                        );
            }

            if (!ts.header) {
                ts.header = new Rui.LTemplate(
                            '<thead class="L-grid-header">{hrow}</thead>'
                        );
            }

            if (!ts.hrow) {
                ts.hrow = new Rui.LTemplate(
                        '<tr class="L-grid-header-row {first_last}" >{hcells}</tr>'
                        );
            }

            if (!ts.hcell) {
                //{css}는 config를 통해 개발자가 th에 대한 css class name을 지정하는 용도로 사용된다.
                //{style}도 마찬가지로 custom한 style을 지정하는 용도이다.  내부 + custom
                ts.hcell = new Rui.LTemplate(
                        '<th class="L-grid-header-cell L-grid-cell L-grid-cell-{id} {first_last}" style="{style}" colspan="{colSpan}" rowSpan="{rowSpan}">',
                            '{value}',
                        '</th>'
                        );
            }
            
            if (!ts.body) {
                ts.body = new Rui.LTemplate('{rows}');
            }

            if (!ts.row) {
                ts.row = new Rui.LTemplate(
                    '<tr class="{className}" style="{rstyle}">{rowBody}</tr>'
                );
            }
            
            if (!ts.rowBody) {
                ts.rowBody = new Rui.LTemplate(
                    '{cells}'
                );
            }

            if (!ts.cell) {
                ts.cell = new Rui.LTemplate(
                        '<td class=\"L-grid-col L-grid-cell L-grid-cell-{id} {first_last} {hidden} {css} \" style=\"{style}\" >',
                            '{value}',
                        '</td>'
                        );
            }

            this.templates = ts;
        },
        /**
         * @description rendering
         * @method doRender
         * @protected
         * @return {void}
         */
        doRender: function(appendToNode) {
            this.createTemplate();
            this.updateView();
            this.el.addClass('L-tableview');
            this.headerEl = Rui.get(this.el.dom.childNodes[0].childNodes[0]);
            this.bodyEl = Rui.get(this.el.dom.childNodes[0].childNodes[1]);
            this.loadMessageEl = Rui.get(this.el.dom.childNodes[1]);
            this.doRenderData();
        },
        /**
         * @description body content rendering
         * @method renderBody
         * @param {String} bodyHtml body rendering한 html
         * @protected
         * @return {void}
         */
        renderBody: function(bodyHtml) {
            if(Rui.browser.msie) {
                var newDivDom = document.createElement('div');
                newDivDom.innerHTML = '<table><tbody>' + bodyHtml + '</tbody></table>';
                for (; 0 < this.bodyEl.dom.childNodes.length ;)
                    Dom.removeNode(this.bodyEl.dom.childNodes[0]);
                var tbodyChild = newDivDom.getElementsByTagName('tbody')[0].cloneNode(true);
                var newTrDomList = tbodyChild.getElementsByTagName('tr');
                for (var i = 0 ; i < newTrDomList.length ; i++)    
                    this.bodyEl.appendChild(newTrDomList[i].cloneNode(true));
            } else 
                this.bodyEl.html(bodyHtml);
            this.doEmptyDataMessage();
            this.renderBodyEvent.fire();
        },
        /**
         * @description focus된 row에 focusEl 이동하기
         * @method syncFocusRow
         * @public
         * @param {int} row row index
         * @param {int} col column index
         * @return {void}
         */
        syncFocusRow: function(row, col){
            // 무시
        },
        /**
         * @description row에 focus주기
         * @method focusRow
         * @private
         * @param {int} row row index
         * @param {int} col column index
         * @return {void}
         */
        focusRow: function(row, col){
            // 무시
        },
        /**
         * @description render 이벤트 발생시 호출되는 메소드
         * @method onRender
         * @private
         * @param {Object} e Event 객체
         * @return void
         */
        onRender : function() {
            // 무시
        },
        /**
         * @description grid의 scroll영역의 height 설정하기
         * @method updateSizes
         * @protected
         * @return {void}
         */
        updateSizes:function(){
            // 무시
        },
        /**
         * @description 행이 없을 경우 메시지 출력
         * @method showEmptyDataMessage
         * @private
         * @return {void}
         */
        showEmptyDataMessage : function(){
            var borderWidth = Rui.isBorderBox ? 0 : this.borderWidth;

            if(Rui.browser.msie) {
                for (; 0 < this.bodyEl.dom.childNodes.length ;)
                    Dom.removeNode(this.bodyEl.dom.childNodes[0]);

                var messageCode = (this.emptyDataMessageCode != null) ? this.emptyDataMessageCode : '$.base.msg115';
                var emptyDataMessage = Rui.getMessageManager().getFirst(messageCode);
                var trHtml = '<tr class="' + GV.CLASS_GRIDVIEW_BODY_EMPTY + '"><td colspan="' + this.columnModel.getColumnCount() + '" style="width:' + (this.columnModel.getTotalWidth(true) - borderWidth) + 'px;">' + emptyDataMessage + '</td></tr>';
                
                var newRowDom = document.createElement('div');
                newRowDom.innerHTML = '<table>' + trHtml + '</table>';
                var newDom = newRowDom.getElementsByTagName('tr')[0];
                
                this.bodyEl.appendChild(newDom.cloneNode(true));
            } else
                this.bodyEl.dom.innerHTML = '';
        },
        /**
         * @description 행이 없을 경우에 출력 되는 메시지 해제
         * @method hideEmptyDataMessage
         * @private
         * @return {void}
         */
        hideEmptyDataMessage : function() {
            var firstRow = this.bodyEl.dom.firstChild;
            if(firstRow && firstRow.className == GV.CLASS_GRIDVIEW_BODY_EMPTY) 
                Rui.get(firstRow).remove();
        },
        /**
         * @description Row가 존재하는지 여부 리턴
         * @method hasRows
         * @public
         * @return {Boolean}
         */
        hasRows : function(){
            var firstRow = this.bodyEl.dom.firstChild;
            return firstRow && firstRow.className != GV.CLASS_GRIDVIEW_BODY_EMPTY;
        },
        /**
         * @description Row의 Dom Array return
         * @method getRows
         * @public
         * @return {Array}
         */
        getRows : function(){
            return this.hasRows() ? this.bodyEl.dom.childNodes : [];
        },
        /**
         * @description dataSet의 add 이벤트 발생시 호출되는 메소드
         * @method doAddData
         * @private
         * @param {Object} e Event 객체
         * @return void
         */
        doAddData: function(e) {
            this.hideEmptyDataMessage();
            
            var row = e.row, record = e.record, dataSet = e.target;
            var rowHtml = this.getRenderRow(row, record, dataSet);

            // 구현 방법 고민 필요
            var newRowDom = document.createElement('div');
            newRowDom.innerHTML = '<table>' + rowHtml + '</table>';
            var newDom = newRowDom.getElementsByTagName('tr')[0];

            if(dataSet.getCount(true) > 1) {
                var rowDom = this.getRowDom(row);
                if(rowDom) {
                    Dom.insertBefore(newDom, rowDom);
                } else {
                    rowDom = this.getRowDom(row - 1);
                    Dom.insertAfter(newDom, rowDom);
                }
            } else {
                this.bodyEl.appendChild(newDom);
            }
            this.updateRenderRows(row);
            this.focusRow(row,0);
        },
        /**
         * @description dataSet의 update 이벤트 발생시 호출되는 메소드
         * @method onRowUpdateData
         * @private
         * @param {Object} e Event 객체
         * @return void
         */
        onRowUpdateData: function(e) {
            var row = e.row, record = e.record, dataSet = e.target;
            var currentRowDom = this.getRowDom(row);
            if(currentRowDom) {
                // row 전체를 갱신하면 성능 저하 및 값 변경시 해당 객체가 사라지므로 다른 이벤트들도 다 제거되어 처리가 안됨. 
                var rowHtml = this.getRenderRow(row, record, dataSet.getCount());
                var newDivDom = document.createElement('div');
                newDivDom.innerHTML = '<table>' + rowHtml + '</table>';
                var newRowDom = newDivDom.getElementsByTagName('tr')[0];
                for (; 0 < currentRowDom.childNodes.length ; )
                    Dom.removeNode(currentRowDom.childNodes[0]);
                    
                var currentRowDomEl = Rui.get(currentRowDom);
                for (var i = 0 ; i < newRowDom.childNodes.length ; i++)
                    currentRowDomEl.appendChild(newRowDom.childNodes[i].cloneNode(true));
            }
        },
        /**
         * @description dataSet의 update 이벤트 발생시 호출되는 메소드
         * @method onCellUpdateData
         * @private
         * @param {Object} e Event 객체
         * @return void
         */
        doCellUpdateData: function(e) {
            var row = e.row, col = e.col, colId = e.colId, record = e.record;
            col = this.columnModel.getIndexById(colId);
            if(col < 0) return;
            var currentCellDom = this.getCellDom(row, col);
            if(currentCellDom) {
                var cellHtml = this.getRenderCell(row, col, this.columnModel.getColumnCount(), record);
                if(cellHtml == '') return;
                var newRowDom = document.createElement('div');
                newRowDom.innerHTML = '<table><tr>' + cellHtml + '</tr></table>';
                var newDom = newRowDom.getElementsByTagName('td')[0];

                currentCellDom.parentNode.replaceChild(newDom, currentCellDom);
            }
        }
    });
})();