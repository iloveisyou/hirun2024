/*
 * @(#) LTableView.js
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
    var Dom = Rui.util.LDom;
    var GV = Rui.ui.grid.LGridView;
    Rui.ui.grid.LTableView = function(oConfig) {  
        Rui.ui.grid.LTableView.superclass.constructor.call(this,oConfig);
    };
    Rui.extend(Rui.ui.grid.LTableView, Rui.ui.grid.LGridView, {
        rowSelector: '.' + GV.CLASS_GRIDVIEW_ROW,
        cellSelector: '.' + GV.CLASS_GRIDVIEW_CELL,
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
        doRender: function(appendToNode) {
            this.createTemplate();
            this.updateView();
            this.el.addClass('L-tableview');
            this.headerEl = Rui.get(this.el.dom.childNodes[0].childNodes[0]);
            this.bodyEl = Rui.get(this.el.dom.childNodes[0].childNodes[1]);
            this.loadMessageEl = Rui.get(this.el.dom.childNodes[1]);
            this.doRenderData();
        },
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
        syncFocusRow: function(row, col){
        },
        focusRow: function(row, col){
        },
        onRender : function() {
        },
        updateSizes:function(){
        },
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
        hideEmptyDataMessage : function() {
            var firstRow = this.bodyEl.dom.firstChild;
            if(firstRow && firstRow.className == GV.CLASS_GRIDVIEW_BODY_EMPTY) 
                Rui.get(firstRow).remove();
        },
        hasRows : function(){
            var firstRow = this.bodyEl.dom.firstChild;
            return firstRow && firstRow.className != GV.CLASS_GRIDVIEW_BODY_EMPTY;
        },
        getRows : function(){
            return this.hasRows() ? this.bodyEl.dom.childNodes : [];
        },
        doAddData: function(e) {
            this.hideEmptyDataMessage();
            var row = e.row, record = e.record, dataSet = e.target;
            var rowHtml = this.getRenderRow(row, record, dataSet);
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
        onRowUpdateData: function(e) {
            var row = e.row, record = e.record, dataSet = e.target;
            var currentRowDom = this.getRowDom(row);
            if(currentRowDom) {
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