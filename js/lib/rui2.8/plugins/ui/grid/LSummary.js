/*
 * @(#) LSummary.js
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

Rui.ui.grid.LSummary = function(oConfigs) {
    Rui.ui.grid.LSummary.superclass.constructor.call(this, oConfigs);
};
Rui.extend(Rui.ui.grid.LSummary, Rui.util.LPlugin, {
    subSumList : null,
    subSumExpr : null,
    dateComparePattern : '%x',
    initPlugin : function(gridView) {
        this.gridView = gridView;
        this.subSumList = this.subSumExpr.split(',');
        Rui.ui.grid.LSummary.superclass.initPlugin.call(this, gridView);
        var ts = gridView.templates || {};
        ts.summaryRow = new Rui.LTemplate(
                '<div class="L-grid-row-summary L-grid-row-summary-{summaryId}">',
                    '<table border="0" cellspacing="0" cellpadding="0" >',
                        '<tbody>',
                            '<tr>{cells}</tr>',
                        '</tbody>',
                    '</table>',
                '</div>'
                );
        ts.summaryTotalRow = new Rui.LTemplate(
                '<div class="L-grid-row-summary-total">',
                    '<table border="0" cellspacing="0" cellpadding="0" >',
                        '<tbody>',
                            '<tr>{cells}</tr>',
                        '</tbody>',
                    '</table>',
                '</div>'
                );
        gridView.templates = ts;
        gridView.getRows = this.getRows;
    },
    isSubSum : function(subSumList, record, newRecord, currentSubSumId) {
        var listCount = subSumList.length;
        for (var i = listCount - 1 ; i >= 0; i--) {
            var colId = subSumList[i];
            if(currentSubSumId && currentSubSumId == colId) continue;
            var value1 = record.get(colId);
            var value2 = newRecord ? newRecord.get(colId) : null;
            var isCompare = (value1 instanceof Date) ? Rui.util.LDate.compareString(value1, value2, this.dateComparePattern) : (value1 == value2);
            if(!isCompare) {
                return true;
            }
        }
        return false;
    },
    getBeforeSubSumColId : function(subSumList, record, newRecord, currentSubSumId) {
        if(currentSubSumId == subSumList[0]) return null; 
        var listCount = subSumList.length;
        for (var i = listCount - 1 ; i >= 0; i--) {
            var colId = subSumList[i];
            if(currentSubSumId && currentSubSumId == colId) continue;
            var value1 = record.get(colId);
            var value2 = newRecord ? newRecord.get(colId) : null;
            var isCompare = (value1 instanceof Date) ? Rui.util.LDate.compareString(value1, value2, this.dateComparePattern) : (value1 == value2);
            if(!isCompare) {
                return colId;
            }
        }
        return null;
    },
    getSubSumIndex : function(subSumList, colId) {
        for (var i = 0 ; i < subSumList.length ; i++) {
            if(subSumList[i] == colId) {
                return i;
            }
        }
        return -1;
    },
    getRows : function() {
        return this.hasRows() ? this.bodyEl.query('.L-grid-row') : [];
    },
    getRenderBody: function() {
        var plugin = this.plugins[0];
        var ts = this.templates || {};
        var rowCount = this.dataSet.getCount();
        var rows = '';
        var columnModel = this.columnModel;
        var columnCount = columnModel.getColumnCount();
        var summaryLevelList = [];
        var subSumList = plugin.subSumList;
        var currentSubSumId = null;
        var isTotal = subSumList[0] == 'total' ? true:false;
        if(isTotal) subSumList = Rui.util.LArray.removeAt(subSumList, 0);
        var totalSummaryResult = {};
        for (var row = 0; row < rowCount; row++) {
            var record = this.dataSet.getAt(row);
            rows += this.getRenderRow(row, record, rowCount);
            var newRecord = this.dataSet.getAt(row + 1);
            for (var col = 0; col < columnCount; col++) {
                var column = columnModel.getColumnAt(col);
                if(column.sumType) {
                    var colId = column.getId();
                    for (var level = 0 ; level < subSumList.length ; level++){
                        var summaryResult = summaryLevelList[level];
                        summaryResult = summaryResult == null ? {} : summaryResult;
                        var val = plugin.getSumTypeValue(summaryResult, record, column, row, col);
                        summaryResult[colId] = val;
                        summaryLevelList[level] = summaryResult;
                        totalSummaryResult[colId] = val;
                    }
                } 
            }
            var isSubSum = plugin.isSubSum(subSumList, record, newRecord, currentSubSumId);
            if(isSubSum) currentSubSumId = subSumList[subSumList.length - 1];
            while (currentSubSumId != null) {
                var subi = plugin.getSubSumIndex(subSumList, currentSubSumId);
                var summaryResult = summaryLevelList[subi];
                var cells = '';
                for (var col = 0; col < columnCount; col++) {
                    cells += plugin.getSummaryRenderCell(row, col, columnCount, record, summaryResult);
                }
                var subColId = currentSubSumId;
                var p = {
                    summaryId : subColId,
                    cells : cells
                };
                rows += ts.summaryRow.apply(p);
                for (var col = 0; col < columnCount; col++) {
                    var column = columnModel.getColumnAt(col);
                    if (column.sumType) {
                        var colId = column.getId();
                        summaryResult[colId] = 0;
                    }
                }
                currentSubSumId = plugin.getBeforeSubSumColId(subSumList, record, newRecord, currentSubSumId);
            }
        }
        return ts.body.apply({ rows: rows });
    },
    getSummaryRenderCell : function(row, i, columnCount, record, summaryResult) {
        var gridView = this.gridView;
        var ts = gridView.templates || {};
        var column = gridView.columnModel.getColumnAt(i);
        var first_last = (i == 0) ? 'L-grid-cell-first' : (i == columnCount - 1) ? 'L-grid-cell-last' : '';
        var style = 'width:' + gridView.getColumnWidth(column) + 'px;';
        if(column.align != '')
            style += 'text-align:' + column.align+';';
        var hidden = column.isHidden()? 'L-hide-display' : '';
        var css = [];
        if(record.isModifiedField(column.field)) css.push('L-grid-cell-update');
        if(gridView.skipRowCellEvent !== true)
            gridView.fireEvent('cellRendered', {css:css, row:row, col:i, record:record});
        if(column.cellStyle)
            style += column.cellStyle + ';';
        var p = {
            id: column.getId(),
            first_last: first_last,
            css: css,
            style: style,
            hidden:hidden
        };
        p.value = this.getSummaryRenderCellValue(p, record, column, row, i, summaryResult[column.getId()]);
        p.css = p.css.join(' ');
        return ts.cell.apply(p);
    },
    getSummaryCalculatorCellValue: function(record, column, row, i) {
        var value = record.get(column.field);
        if(column.expression)
            value = column.expression(value, record, row, i);
        if(!column.sumType) value = '';
        return value;
    },
    getSummaryRenderCellValue: function(p, record, column, row, i, value) {
        value = value || record.get(column.field);
        if(column.renderer) {
            value = column.renderer(value, p, record, row, i);
        }
        if(!column.sumType) value = '';
        return value;
    },
    getSumTypeValue : function(summaryResult, record, column, row, col) {
        var colId = column.getId();
        var val = 0;
        if (Rui.isFunction(column.sumType)) {
            val = column.sumType.call(this, summaryResult, record, column, row, col);
        } else 
            val = summaryResult[colId] ? summaryResult[colId] : 0;
        return val + this.getSummaryCalculatorCellValue(record, column, row, col);
    },
    updateSummary : function() {
    }
});