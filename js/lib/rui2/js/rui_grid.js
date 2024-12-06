/*
 * @(#) rui_grid.js
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
 */

Rui.namespace('Rui.ui.grid');
Rui.ui.grid.LCellMerge = {    
    getMultiHeaderInfo: function(columns,rowCount){
        var column;
        var colCount = columns.length;
        var colInfos = [];
        var colInfo;
        var cell;
        var colIdx = 0, rowIdx = 0;
        var tempCount;
        var cCount;
        var dataColumns = [];
        var prevCol;
        rowCount = rowCount ? rowCount : this.getHeaderRowCount(columns);
        if (rowCount > 1) {
            for (var i = 0; i < colCount; i++) {
                prevCol = column;
                column = columns[i];
                if (i == 0) {
                    colInfos[colIdx] = [];
                    colInfo = colInfos[colIdx];
                }else if(this.isStartColumn(i, column, colCount, columns)) {
                    dataColumns.push(prevCol);
                    if ((rowIdx - 1) < (rowCount - 1)) {
                        rowspan = (rowCount - 1) - (rowIdx - 1) + 1;
                        colInfo[rowIdx - 1].rowspan = (rowCount - 1) - (rowIdx - 1) + 1;
                        tempCount = 1;
                        for (var j = rowIdx; j < rowCount; j++){
                            colInfo[j] = {
                                colspan: 0,
                                rowspan: -tempCount,
                                exist: false
                            };
                            tempCount++;
                        }
                    }
                    rowIdx = 0;
                    colIdx++;
                    if (colIdx > colInfos.length - 1) 
                        colInfos[colIdx] = [];
                    colInfo = colInfos[colIdx];
                }
                if(rowIdx > colInfo.length - 1 || !colInfo[rowIdx]){
                    colInfo[rowIdx] = {
                        id: column.id,
                        rowspan: 1,
                        colspan: 1,
                        label: column.getLabel(),
                        exist: true
                    };
                }else{
                    for (var j = rowIdx; j < rowCount; j++) {
                        if(j < colInfo.length && colInfo[j].exist === false){
                            rowIdx++;
                        }else{
                            break;
                        }
                    }
                    colInfo[rowIdx] = {
                        id: column.id,
                        rowspan: 1,
                        colspan: 1,
                        label: column.getLabel(),
                        exist: true
                    };
                }
                if(colInfo[rowIdx].exist === true){
                    cell = colInfo[rowIdx];
                    cell.colspan = this.getColSpan(i, column.id, colCount, columns);
                    if (cell.colspan > 1) {
                        cCount = colIdx + cell.colspan;
                        tempCount = 1;
                        for (var j = colIdx + 1; j < cCount; j++) {
                            if (j > colInfos.length - 1) {
                                colInfos[j] = [];
                            }
                            colInfos[j][rowIdx] = {
                                exist: false,
                                colspan: -tempCount,
                                rowspan: 0
                            };
                            tempCount++;
                        }
                    }
                }
                rowIdx++;
            }
            if (colInfo && (rowIdx - 1) < (rowCount - 1)) {
                rowspan = (rowCount - 1) - (rowIdx - 1) + 1;
                colInfo[rowIdx - 1].rowspan = (rowCount - 1) - (rowIdx - 1) + 1;
                tempCount = 1;
                for (var j = rowIdx; j < rowCount; j++){
                    colInfo[j] = {
                        colspan: 0,
                        rowspan: -tempCount,
                        exist: false
                    };
                    tempCount++;
                }
                rowspan = null;
            }
            if(column)
                dataColumns.push(column);
            colInfos = this.updateCellIndex(colInfos);
        }else{
            return null;
        }
        try {
            return{
                colInfos: colInfos,
                rowCount: rowCount,
                colCount: colCount,
                dataColumns: dataColumns,
                columns : columns
            };
        } finally {
            colInfos = dataColumns = columns = null;
        }
    },
    getHeaderRowCount : function(columns){
        var colCount = columns.length;
        var column;
        var colInfos = [];
        var colInfo;
        var cell;
        var colIdx = 0, rowIdx = 0;
        var cCount;
        for (var i = 0; i < colCount; i++) {
            column = columns[i];
            if(i == 0){
                colInfos[colIdx] = [];
                colInfo = colInfos[colIdx];
            }else if (this.isStartColumn(i, column, colCount, columns)) {
                rowIdx = 0;
                colIdx++;
                if (colIdx > colInfos.length - 1) 
                    colInfos[colIdx] = [];
                colInfo = colInfos[colIdx];
            }
            if(rowIdx > colInfo.length - 1 || !colInfo[rowIdx]){
                colInfo[rowIdx] = {
                    exist: true
                };
            }else{
                for (var j = rowIdx; j < colInfo.length; j++){
                    if (colInfo[j].exist === false) {
                        rowIdx++;
                    }
                    else {
                        break;
                    }
                }
                colInfo[rowIdx] = {
                    exist: true
                };
            }
            if (colInfo[rowIdx].exist === true) {
                cell = colInfo[rowIdx];
                cell.colspan = this.getColSpan(i, column.id, colCount, columns);
                if(cell.colspan > 1){
                    cCount = colIdx + cell.colspan;
                    for (var j = colIdx + 1; j < cCount; j++){
                        if(j > colInfos.length - 1){
                            colInfos[j] = [];
                        }
                        colInfos[j][rowIdx] = {
                            exist: false
                        };
                    }
                }
            }
            rowIdx++;
        }
        colCount = colInfos.length;
        var rowCount = 1;
        for (var i=0;i<colCount;i++){
            if(rowCount < colInfos[i].length) rowCount = colInfos[i].length;
        }
        return rowCount;
    },
    updateCellIndex: function(colInfos, colCount, rowCount){
        var colCount = colInfos.length;
        if (colCount == 0) 
            return;
        var rowCount = colInfos[0].length;
        var cellIndexes = [];
        var colInfo;
        for (var i = 0; i < colCount; i++) {
            if (colInfos[i]) {
                colInfo = colInfos[i];
                for (var j = 0; j < rowCount; j++) {
                    if (i == 0) {
                        cellIndexes[j] = 0;
                        colInfo[j].cellIndex = cellIndexes[j];
                    }
                    else {
                        if (colInfo[j].exist && colInfo[j].colspan < 0) {
                            cellIndexes[j] = cellIndexes[j] + 1;
                            colInfo[j].cellIndex = cellIndexes[j];
                        }
                    }
                }
            }
        }
        return colInfos;
    },
    isStartColumn: function(idx, column, colCount, columns){
        if (!column.groupId) 
            return true;
        if (columns[idx - 1].id === column.groupId) 
            return false;
        for (var i = idx - 1; i > -1; i--) {
            if (columns[i].groupId === column.groupId) {
                return true;
            }
        }
        return false;
    },
    getColSpan: function(colIdx, colId, colCount, columns){
        var colspan = 0, col, cCount, tCount;
        for (var i = colIdx + 1; i < colCount; i++) {
            col = columns[i];
            if (col.groupId === colId) {
                tCount = 1;
                cCount = this.getColSpan(i, col.id, colCount, columns);
                if (tCount < cCount) 
                    tCount = cCount;
                colspan = colspan + tCount;
            }
        }
        return colspan == 0 ? 1 : colspan;
    },
    getCellMergeInfo: function(cm, rowRange){
        var dataSet = cm.gridView.dataSet,
            colCount = cm.getColumnCount(true),
            columns = [], column, prevColumn,
            rows = [], cells = [],
            cell, prevRCell, prevCell, r, prevR, label, prevLabel, prevRLabel, prevRCrossLabel, colspan, rowspan,
            gMerge = cm.groupMerge,
            rowIdx = 0, canMerge,
            start = rowRange.start,
            end = rowRange.end,
            vstart = start, 
            vend = end, 
            afterRows = rowRange.afterRows,
            _vMerge;
        for (var i=0;i<colCount;i++){
            column = cm.getColumnAt(i, true);
            if(gMerge){
            	if(_vMerge == undefined && column.vMerge === true)
            		_vMerge = true;
            	if(_vMerge === true && column.vMerge !== true)
            		_vMerge = false;
            }
            columns.push({
                vMerge: _vMerge == undefined ? column.vMerge : _vMerge,
                hMerge: column.hMerge,
                field: column.field,
                mergeDateFormat: column.mergeDateFormat
            });
        }
        for (var i = start; i < end + 1; i++) {
            cells = [];
            prevMergeLabel = undefined;
            if (vstart <= i && i < vend + 1) {
                prevR = r;
                r = dataSet.getAt(i);
                column = undefined;
                label = '';
                var renderedRow = i - vstart, sumRowCnt = 0;
                if(renderedRow) {
                    var afterRowInfo = afterRows[renderedRow - 1].afterRowInfo;
                    sumRowCnt = (afterRowInfo) ? afterRowInfo.sumRowsInfo.length : 0;
                }
                for (var j = 0; j < colCount; j++) {
                    cell = {
                        colspan: 1,
                        rowspan: 1
                    };
                    prevColumn = column;
                    column = columns[j];
                    if(column.vMerge || column.hMerge){
                        var mergeDateFormat = column.mergeDateFormat;
                        prevLabel = prevColumn && prevColumn.hMerge ? label : undefined;
                        label = r.get(column.field);
                        if(Rui.isDate(label)){
                            label = label.format(mergeDateFormat);
                        }
                        if(label === undefined) label = '';
                        var prevValue = undefined;
                        if (prevR) {
                            prevValue = prevR.get(column.field);
                            if(Rui.isDate(prevValue)){
                                prevValue = prevValue.format(mergeDateFormat);
                            }
                        }
                        prevRLabel = prevR && rows[rowIdx-1][j].merge !== false ? prevValue : undefined;
                        if(column.vMerge && column.hMerge){
                            if (prevLabel === label || prevRLabel === label) {
                                if (prevColumn && prevLabel === label && prevRLabel === label) {
                                    if (!prevColumn.vMerge && prevColumn.hMerge) {
                                        colspan = cells[j - 1].colspan;
                                        colspan = colspan < 0 ? colspan - 1 : -1;  
                                        prevCell = cells[j + colspan];
                                        prevCell.colspan = prevCell.colspan + 1;
                                        cell.colspan = colspan;
                                    } else if(prevColumn.vMerge && !prevColumn.hMerge) {
                                        canMerge = true;
                                        if (gMerge && prevColumn.vMerge && cells[j - 1].rowspan > 0){
                                            canMerge = false;
                                        }
                                        if (canMerge) {
                                            rowspan = rows[rowIdx - 1][j].rowspan;
                                            rowspan = rowspan < 0 ? rowspan - 1 : -1;
                                            prevRCell = rows[rowIdx + rowspan][j];
                                            prevRCell.rowspan = prevRCell.rowspan + 1;
                                            cell.rowspan = rowspan;
                                        }
                                    } else if(prevColumn.vMerge && prevColumn.hMerge){
                                        prevRCrossLabel = prevR.get(prevColumn.field);
                                        if (Rui.isDate(prevRCrossLabel)) {
                                            prevRCrossLabel = prevRCrossLabel.format(mergeDateFormat);
                                        }
                                        if(prevRCrossLabel === label && rows[rowIdx-1][j].colspan < 1){
                                            canMerge = true;
                                            var prevColIdx = cells[j - 1].colspan == 1 ? 2 : Math.abs(cells[j - 1].colspan) + 2;
                                            if (gMerge && cells[j - 1].rowspan > 0 && (j - prevColIdx > -1) && cells[j - prevColIdx].rowspan > 0) {
                                                canMerge = false;
                                            }
                                            if (canMerge) {
                                                colspan = cells[j - 1].colspan;
                                                colspan = colspan < 0 ? colspan - 1 : -1;
                                                rowspan = rows[rowIdx - 1][j].rowspan;
                                                rowspan = rowspan < 0 ? rowspan - 1 : -1;
                                                if(prevMergeLabel !== label){
                                                    prevRCell = rows[rowIdx + rowspan][j + colspan];
                                                    prevRCell.rowspan = prevRCell.rowspan + 1;
                                                    prevMergeLabel = label;
                                                }   
                                                for (var k = Math.abs(colspan); k > 0; k--) {
                                                    cells[j - k].colspan = -(k - 1);
                                                    cells[j - k].rowspan = rowspan;
                                                }
                                                cell.colspan = colspan;
                                                cell.rowspan = rowspan;
                                            } else {
                                                colspan = cells[j - 1].colspan;
                                                colspan = colspan < 0 ? colspan - 1 : -1;  
                                                prevCell = cells[j + colspan];
                                                prevCell.colspan = prevCell.colspan + 1;
                                                cell.colspan = colspan;
                                            }
                                        }else{
                                            canMerge = true;
                                            if (gMerge && cells[j - 1].rowspan > 0){
                                                canMerge = false;
                                            }
                                            if (canMerge) {
                                                rowspan = rows[rowIdx - 1][j].rowspan;
                                                rowspan = rowspan < 0 ? rowspan - 1 : -1;
                                                prevRCell = rows[rowIdx + rowspan][j];
                                                prevRCell.rowspan = prevRCell.rowspan + 1;
                                                cell.rowspan = rowspan;
                                            } else {
                                                colspan = cells[j - 1].colspan;
                                                colspan = colspan < 0 ? colspan - 1 : -1;  
                                                prevCell = cells[j + colspan];
                                                prevCell.colspan = prevCell.colspan + 1;
                                                cell.colspan = colspan;
                                            }
                                        }
                                    } else if(!prevColumn.vMerge && !prevColumn.hMerge) {
                                        rowspan = rows[rowIdx - 1][j].rowspan;
                                        rowspan = rowspan < 0 ? rowspan - 1 : -1;
                                        prevRCell = rows[rowIdx + rowspan][j];
                                        prevRCell.rowspan = prevRCell.rowspan + 1;
                                        cell.rowspan = rowspan;
                                    }
                                }
                                else 
                                    if (prevColumn && prevLabel === label) {
                                        if (!prevColumn.vMerge && prevColumn.hMerge) {
                                            colspan = cells[j - 1].colspan;
                                            colspan = colspan < 0 ? colspan - 1 : -1;  
                                            prevCell = cells[j + colspan];
                                            prevCell.colspan = prevCell.colspan + 1;
                                            cell.colspan = colspan;
                                        } else if(prevColumn.vMerge && !prevColumn.hMerge) {
                                        } else if(prevColumn.vMerge && prevColumn.hMerge){
                                            if(cells[j - 1].rowspan == 1){
                                                colspan = cells[j - 1].colspan;
                                                colspan = colspan < 0 ? colspan - 1 : -1;  
                                                prevCell = cells[j + colspan];
                                                prevCell.colspan = prevCell.colspan + 1;
                                                cell.colspan = colspan;
                                            }
                                        } else if(!prevColumn.vMerge && !prevColumn.hMerge) {
                                        }
                                    }
                                    else 
                                        if (prevRLabel === label) {
                                            if(rows[rowIdx - 1][j].colspan == 1){
                                                canMerge = true;
                                                if (gMerge && prevColumn && prevColumn.vMerge && cells[j - 1].rowspan > 0){
                                                    canMerge = false;
                                                }
                                                if (canMerge && sumRowCnt < 1) {
                                                    rowspan = rows[rowIdx - 1][j].rowspan;
                                                    rowspan = rowspan < 0 ? rowspan - 1 : -1;
                                                    prevRCell = rows[rowIdx + rowspan][j];
                                                    prevRCell.rowspan = prevRCell.rowspan + 1;
                                                    cell.rowspan = rowspan;
                                                }
                                            }
                                        }
                            }
                        } else if(column.vMerge){
                            if (prevRLabel === label) {
                                if(rows[rowIdx - 1][j].colspan == 1){
                                    canMerge = true;
                                    if (gMerge && prevColumn && prevColumn.vMerge && cells[j - 1].rowspan > 0){
                                        canMerge = false;
                                    }
                                    if (canMerge && sumRowCnt < 1) {
                                        rowspan = rows[rowIdx - 1][j].rowspan;
                                        rowspan = rowspan < 0 ? rowspan - 1 : -1;
                                        prevRCell = rows[rowIdx + rowspan][j];
                                        prevRCell.rowspan = prevRCell.rowspan + 1;
                                        cell.rowspan = rowspan;
                                    }
                                }
                            }
                        } else if(column.hMerge) {
                            if (prevColumn && prevLabel === label) {
                                if (!prevColumn.vMerge && prevColumn.hMerge) {
                                    colspan = cells[j - 1].colspan;
                                    colspan = colspan < 0 ? colspan - 1 : -1;  
                                    prevCell = cells[j + colspan];
                                    prevCell.colspan = prevCell.colspan + 1;
                                    cell.colspan = colspan;
                                } else if(prevColumn.vMerge && !prevColumn.hMerge) {
                                } else if(prevColumn.vMerge && prevColumn.hMerge){
                                    if(cells[j - 1].rowspan == 1){
                                        colspan = cells[j - 1].colspan;
                                        colspan = colspan < 0 ? colspan - 1 : -1;  
                                        prevCell = cells[j + colspan];
                                        prevCell.colspan = prevCell.colspan + 1;
                                        cell.colspan = colspan;
                                    }
                                } else if(!prevColumn.vMerge && !prevColumn.hMerge) {
                                }
                            }
                        }
                    }
                    cells.push(cell);
                }
            } else {
                for (var j = 0; j < colCount; j++) {
                    cells.push({
                        colspan: 1,
                        rowspan: 1,
                        merge:false
                    });
                }
            }
            rows.push(cells);
            rowIdx++;
        }
        return rows;
    }
};
Rui.namespace('Rui.ui.grid');
Rui.ui.grid.LColumn = function(oConfigs) {
    var config = oConfigs || {};
    config = Rui.applyIf(config, Rui.getConfig().getFirst('$.ext.column.defaultProperties'));
    this.id = config.id || config.field || this.id;
    Rui.applyObject(this, config, true);
    this.label = this.label || this.field || this.id;
    this.createEvent('hidden');
    this.createEvent('sortable');
    this.createEvent('label');
    this.createEvent('columnResize');
    this.createEvent('editorChanged');
    this.init();
    this.editable = Rui.isUndefined(config.editable) == false ? config.editable : !this.editor ? false : true;
    if (this.editor)
        this.editor.isGridEditor = true;
    this.headerCss = [];
    config = null;
};
Rui.extend(Rui.ui.grid.LColumn, Rui.util.LEventProvider, {
    otype: 'Rui.ui.grid.LColumn',
    id: null,
    columnModel: null,
    label: null,
    field: null,
    width: null,
    minWidth: 25,
    autoWidth: false,
    maxAutoWidth: 1000,
    hidden: false,
    selected: true,
    resizable: true,
    fixed: false,
    sortable: null,
    align:'',
    draggable: null,
    editable: true,
    editor: null,
    cellStyle: null,
    headerCss: null,
    renderer: null,
    freeze: false,
    renderRow: false,
    expression: null,
    expressionType: null,
    vMerge: false,
    hMerge: false,
    mergeDateFormat: '%Y-%m-%d',
    columnType: 'data',
    renderExcel: true,
    tooltipText: null,
    summary: null,
    sumIds: null, 
    sumType: null,
    sumText: null,
    headerTool: true,
    clipboard: true,
    clipboardVirtual: true,
    clipboardRenderer: null,
    ignoreViewFocus: true,
    tablet: null,
    init: function() {
        this.initEvents();
    },
    initEvents: function() {
    },
    bindEvent: function(gridPanel) {
        if (this.editor) {
            this.editor.gridPanel = gridPanel;
        }
    },
    unbindEvent: function(gridPanel) {
    },
    getId: function() {
        return this.id;
    },
    getGroupId: function() {
        return this.groupId;
    },
    getField: function() {
        return this.field;
    },
    getColumnModel: function() {
        return this.columnModel;
    },
    setColumnModel: function(columnModel) {
        this.columnModel = columnModel;
    },
    getLabel: function() {
        return this.label;
    },
    setLabel: function(label) {
        this.label = label;
        var cm = this.columnModel;
        if(cm.isBasicColumnModel !== true && cm.isMultiheader()) {
            cm.getBasicColumnModel().getColumnById(this.id).setLabel(label);
        }
        var initOptions = cm.getInitOptions();
        if(!initOptions && cm.currentColumnModel) {
            initOptions = cm.currentColumnModel.getInitOptions();
        }
        if(initOptions) {
            var columns = initOptions.columns;
            for (var i = columns.length - 1; 0 <= i; i--) {
                if(columns[i].id == this.id) {
                    columns[i].label = label;
                    break;
                }
            }
            columns = null;
        }
        this.fireEvent('label', {target:this, label:label});
        cm = initOptions = null;
    },
    getWidth: function() {
        return this.width;
    },
    setWidth: function(width) {
        if (this.isResizable()) {
            var oldWidth = this.width;
            this.width = width;
            if (this.columnModel !== null) {
                this.columnModel.clearTotalWidth();
                if (this.columnModel.gridView && this.columnModel.gridView.useColumnResize) {
                    this.fireEvent('columnResize', {
                        target: this,
                        oldWidth: oldWidth,
                        newWidth: width
                    });
                }
            }
        }
    },
    getMinWidth: function() {
        return this.minWidth;
    },
    setMinWidth: function(minWidth) {
        this.minWidth = minWidth;
    },
    getMaxAutoWidth: function() {
        return this.maxAutoWidth;
    },
    setMaxAutoWidth: function(maxAutoWidth) {
        this.maxAutoWidth = maxAutoWidth;
    },
    isHidden: function() {
        return this.hidden;
    },
    setHidden: function(hidden) {
        this.hidden = hidden;
        var cm = this.columnModel;
        var currId = this.id;
        var initOptions = cm.getInitOptions();
        var columns = initOptions.columns;
        for (var i = columns.length - 1; 0 <= i; i--) {
            if(columns[i].id == currId) {
                columns[i].hidden = hidden;
                if(columns[i].groupId) {
                    var cnt = this.getShowChildColumnCount(columns, columns[i].groupId);
                    for (var j = i - 1; 0 <= j; j--) {
                        if(columns[j].id == columns[i].groupId) {
                            columns[j].hidden = (0 < cnt) ? false : true;
                            this.setHiddenGroup(columns, i);
                            break;
                        }
                    }
                }
            }
        }
        delete cm._initOptions;
        cm.init(initOptions);
        this.fireEvent('hidden', {target:this, hidden:hidden});
        cm = initOptions = columns = null;
    },
    setHiddenGroup: function(columns, i){
        if(columns[i].groupId) {
            var cnt = this.getShowChildColumnCount(columns, columns[i].groupId);
            for (var j = i - 1; 0 <= j; j--) {
                if(columns[j].id == columns[i].groupId) {
                    columns[j].hidden = (0 < cnt) ? false : true;
                    this.setHiddenGroup(columns, j);
                    break;
                }
            }
        }
        columns = null;
    },
    getShowChildColumnCount: function(columns, id) {
        var cnt = 0;
        for (var i = 0, len = columns.length; i < len; i++) {
            if(columns[i].groupId == id && columns[i].hidden !== true) {
                cnt++;
            }
        }
        columns = null;
        return cnt;
    },
    isSelected: function() {
        return this.selected;
    },
    setSelected: function(selected) {
        this.selected = selected;
    },
    isResizable: function() {
        return this.resizable;
    },
    setResizable: function(resizable) {
        this.resizable = resizable;
    },
    isFixed: function() {
        return this.fixed;
    },
    setFixed: function(fixed) {
        this.fixed = fixed;
    },
    isSortable: function() {
        return this.sortable === true;
    },
    setSortable: function(sortable) {
        this.fireEvent('sortable', {target:this, sortable:sortable});
        this.sortable = sortable;
    },
    isEditable: function() {
        return this.editable;
    },
    setEditable: function(editable){
        this.editable = editable;
    },
    getEditor: function() {
        return this.editor;
    },
    setEditor: function(editor) {
        if(this.editor === editor) return;
        this.editor = editor;
        if(this.editor) this.editor.isGridEditor = true;
        this.fireEvent('editorChanged', {target:this, id: this.id});
    },
    isDraggable: function() {
        return this.draggable;
    },
    setDraggable: function(draggable){
        this.draggable = draggable;
    },
    setColumnType: function(type){
        this.columnType = type;
    },
    getColumnType: function(){
        return this.columnType;
    },
    isDataColumn: function(){
        return this.columnType === 'data' ? true : false;
    },
    setSummary: function(summary) {
        Rui.applyObject(this, summary);
    },
    clone: function(){
        var options = {};
        Rui.applyObject(options, this);
        for (var m in options) {
            if(Rui.util.LString.startsWith(m, '_')) {
                delete options[m];
            }
        }
        try {
            return new this.constructor(options);
        } finally {
            options = null;
        }
    },
    addHeaderCss: function(css) {
        var cssIdx = Rui.util.LArray.indexOf(this.headerCss, css);
        if(cssIdx < 0)
            this.headerCss.push(css);
    },
    removeHeaderCss: function(css) {
        var cssIdx = Rui.util.LArray.indexOf(this.headerCss, css);
        if(cssIdx > -1)
            this.headerCss = Rui.util.LArray.removeAt(this.headerCss, cssIdx);
    },
    hasHeaderCss: function(css) {
        return Rui.util.LArray.indexOf(this.headerCss, css) > -1;
    }
});
Rui.ui.grid.LTriggerColumn = function(oConfigs) {
    Rui.ui.grid.LTriggerColumn.superclass.constructor.call(this, oConfigs);
    this.renderer = (oConfigs && oConfigs.renderer) ? oConfigs.renderer : this.doRenderer;
};
Rui.extend(Rui.ui.grid.LTriggerColumn, Rui.ui.grid.LColumn, {
    selected : false,
    sortable : false,
    gridPanel : null,
    gridView : null,
    editor : null,
    bindEvent: function(gridPanel) {
        Rui.ui.grid.LTriggerColumn.superclass.bindEvent.call(this, gridPanel);
        this.gridPanel = gridPanel;
        this.gridView = gridPanel.getView();
    },
    unbindEvent: function(gridPanel) {
        Rui.ui.grid.LTriggerColumn.superclass.unbindEvent.call(this, gridPanel);
        this.gridPanel = gridPanel;
        this.gridView = gridPanel.getView();
    },
    doRenderer: function(val, p, record, row, i) { return val; }
});
Rui.ui.grid.LNumberColumn = function(oConfigs) {
    Rui.ui.grid.LNumberColumn.superclass.constructor.call(this, oConfigs);
};
Rui.extend(Rui.ui.grid.LNumberColumn, Rui.ui.grid.LTriggerColumn, {
    otype: 'Rui.ui.grid.LNumberColumn',
    id : 'num',
    mappingField : null,
    label : 'No.',
    align : 'right',
    width : 35,
    resizable : true,
    systemColumn: true,
    bindEvent : function(gridPanel) {
        Rui.ui.grid.LNumberColumn.superclass.bindEvent.call(this, gridPanel);
        var view = gridPanel.getView();
        var ds = view.getDataSet();
        ds.on('add', this.onInvokeEvent, this, true);
        ds.on('remove', this.onInvokeEvent, this, true);
        ds.on('undo', this.onInvokeEvent, this, true);
        view = ds = null;
    },
    unbindEvent: function(gridPanel) {
        Rui.ui.grid.LNumberColumn.superclass.unbindEvent.call(this, gridPanel);
        var view = gridPanel.getView();
        var ds = view.getDataSet();
        ds.unOn('add', this.onInvokeEvent, this);
        ds.unOn('remove', this.onInvokeEvent, this);
        ds.unOn('undo', this.onInvokeEvent, this);
        view = ds = null;
    },
    doRenderer: function(val, p, record, row, i) {
        if(this.mappingField)
            return record.get(this.mappingField);
        else
            return row + 1;
    },
    onInvokeEvent: function(e) {
        this.doNumberRender(e.row);
    },
    doNumberRender: function(row) {
        var dataSet = this.gridView.getDataSet();
        var cell = this.getColumnModel().getIndexById(this.id, true);
        try {
            for (var i = row; i < dataSet.getCount() ; i++) {
                var record = dataSet.getAt(i);
                var cellDom = this.gridView.getCellDom(i, cell);
                if (!cellDom) {
                    return;
                }  
                var val = this.doRenderer(i, {}, record, i, i);
                cellDom.firstChild.innerHTML = val;
                record = null;
            }
        } finally {
            dataSet = cell = record = cellDom = null;
        }
    }
});
Rui.ui.grid.LStateColumn = function(oConfigs) {
    Rui.ui.grid.LStateColumn.superclass.constructor.call(this, oConfigs);
};
Rui.extend(Rui.ui.grid.LStateColumn, Rui.ui.grid.LTriggerColumn, {
    id : 'state',
    label : 'S',
    align : 'center',
    width : 15,
    fixed : true,
    resizable : false,
    clipboard: false,
    stateCol: -1,
    systemColumn: true,
    bindEvent: function(gridPanel) {
        Rui.ui.grid.LStateColumn.superclass.bindEvent.call(this, gridPanel);
        this.stateCol = this.columnModel.getIndexById(this.id, true);
        this.removeDataSetEvent();
        this.addDataSetEvent();
    },
    unbindEvent: function(gridPanel) {
        Rui.ui.grid.LStateColumn.superclass.unbindEvent.call(this, gridPanel);
        this.removeDataSetEvent();
    },
    addDataSetEvent: function() {
        var view = this.gridPanel.getView();
        var ds = view.getDataSet();
        ds.on('load', this.onChangeHeaderState, this, true);
        ds.on('add', this.onChangeHeaderState, this, true);
        ds.on('update', this.onUpdateState, this, true);
        ds.on('remove', this.onUpdateState, this, true);
        ds.on('undo', this.onUndo, this, true);
        ds.on('dataChanged', this.onChangeHeaderState, this, true);
        ds.on('commit', this.onCommit, this, true);
        ds.on('stateChanged', this.onStateChanged, this, true);
    },
    removeDataSetEvent: function() {
        var view = this.gridPanel.getView();
        var ds = view.getDataSet();
        ds.unOn('load', this.onChangeHeaderState, this);
        ds.unOn('add', this.onChangeHeaderState, this);
        ds.unOn('update', this.onUpdateState, this);
        ds.unOn('remove', this.onUpdateState, this);
        ds.unOn('undo', this.onUndo, this);
        ds.unOn('dataChanged', this.onChangeHeaderState, this);
        ds.unOn('commit', this.onCommit, this);
        ds.unOn('stateChanged', this.onStateChanged, this);
    },
    doRenderer: function(val, p, record, row, i) {
        var state = this.getState(record);
        if(state != '') 
            p.css.push('L-grid-cell-state-' + state);
        return '&nbsp;';
    },
    onUpdateState: function(e) {
        if(this.gridView)
            this.doChangeRowState(e.row, e.record, e.record.state);
        this.onChangeHeaderState();
    },
    onUndo: function(e) {
        this.doChangeRowState(e.row, e.record, e.beforeState);
        this.onChangeHeaderState();
    },
    onStateChanged: function(e) {
        var row = this.gridView.dataSet.indexOfKey(e.record.id);
        this.doChangeRowState(row, e.record, e.beforeState);
        this.onChangeHeaderState();
    },
    doChangeRowState: function(row, record, beforeState) {
        if(beforeState === Rui.data.LRecord.STATE_INSERT) return;
        var cell = this.gridView.getCellDom(row, this.stateCol);
        if(cell) {
            var cellEl = Rui.get(cell);
            if(cellEl.hasClass('L-grid-cell-state-I') || cellEl.hasClass('L-grid-cell-state-U') || cellEl.hasClass('L-grid-cell-state-D'))
                cellEl.removeClass('L-grid-cell-state-I').removeClass('L-grid-cell-state-U').removeClass('L-grid-cell-state-D');
            if((record.dataSet.remainRemoved === true) || (record.dataSet.remainRemoved !== true && record.state !== Rui.data.LRecord.STATE_DELETE)) {
                cellEl.addClass('L-grid-cell-state-' + this.getState(record));
            }
        }
    },
    onChangeHeaderState: function() {
        var cellEl = this.gridView.getHeaderCellEl(this.stateCol);
        if(!cellEl) return;
        this.gridView.dataSet.isUpdated() ? cellEl.addClass('L-grid-state-modified') : cellEl.removeClass('L-grid-state-modified');
    },
    onCommit: function() {
        var bodyEl = this.gridView.getBodyEl();
        var cellList = bodyEl.select('.L-grid-cell-state-I,.L-grid-cell-state-U,.L-grid-cell-state-D');
        cellList.removeClass(['L-grid-cell-state-I', 'L-grid-cell-state-U','L-grid-cell-state-D']);
        var cellEl = this.gridView.getHeaderCellEl(this.stateCol);
        cellEl.removeClass('L-grid-state-modified');
    },
    getState: function(record) {
        switch (record.state) {
            case Rui.data.LRecord.STATE_INSERT:
                return 'I';
                break;
            case Rui.data.LRecord.STATE_UPDATE:
                return 'U';
                break;
            case Rui.data.LRecord.STATE_DELETE:
                return 'D';
                break;
        }
        return '';
    }
});
Rui.ui.grid.LSelectionColumn = function(config) {
    config = config || {};
    Rui.ui.grid.LSelectionColumn.superclass.constructor.call(this, config);
};
Rui.extend(Rui.ui.grid.LSelectionColumn, Rui.ui.grid.LTriggerColumn, {
    id : 'selection',
    selectionType : 'checkBox',
    label : null,
    align : 'center',
    width : 28,
    fixed : true,
    resizable : false,
    syncRow: false,
    clipboard: false,
    systemColumn: true,
    init : function() {
        Rui.ui.grid.LSelectionColumn.superclass.init.call(this);
        var fixedId = Rui.useFixedId() ? Rui.id(this.el, 'LSelcol-header-' + this.id) : '';
        this.label = this.label != 'selection' ? this.label : '<div id=\"' + fixedId + '\" class="L-grid-header-' + this.selectionType + '" style="width:20px"></div>';
    },
    bindEvent : function(gridPanel) {
        Rui.ui.grid.LSelectionColumn.superclass.bindEvent.call(this, gridPanel);
        var view = gridPanel.getView();
        var ds = view.getDataSet();
        ds.on('allMarked', this.onAllMarked, this);
        ds.on('load', this.onLoad, this, true);
        if(this.syncRow) ds.on('rowPosChanged', this.onRowPosChanged, this);
    },
    unbindEvent: function(gridPanel) {
        Rui.ui.grid.LSelectionColumn.superclass.unbindEvent.call(this, gridPanel);
        var view = gridPanel.getView();
        var ds = view.getDataSet();
        ds.unOn('allMarked', this.onAllMarked, this);
        ds.unOn('load', this.onLoad, this);
        if(this.syncRow) ds.unOn('rowPosChanged', this.onRowPosChanged, this);
    },
    onLoad: function(e) {
        if(e.options.add !== true)
            this.onAllMarked({isSelect: false});
    },
    onRowPosChanged: function(e) {
        if(e.row < 0) return;
        var dataSet = e.target;
        dataSet.setMarkOnly(e.row, true);
    },
    onAllMarked: function(e) {
        var view = this.gridPanel.getView();
        var idx = this.columnModel.getIndexById(this.id, true);
        var cellEl = view.getHeaderCellEl(idx);
        if(!cellEl) return;
        if(e.isSelect == false) Rui.get(cellEl.dom.childNodes[0]).removeClass('L-grid-header-checkBox-mark');
        else Rui.get(cellEl.dom.childNodes[0]).addClass('L-grid-header-checkBox-mark');
    },
    onMarked: function(e) {
        var ds = e.target;
        var view = this.gridPanel.getView();
        var idx = this.columnModel.getIndexById(this.id, true);
        var cellEl = view.getHeaderCellEl(idx);
        if(!cellEl) return;
        var disabledItemLength = this.gridPanel.bodyEl.getElementsByClassName('L-grid-row-checkBox-disabled').length;
        if(ds.data.length === ds.selectedData.length + disabledItemLength) {
            Rui.get(cellEl.dom.childNodes[0]).addClass('L-grid-header-checkBox-mark');
        } else {
            Rui.get(cellEl.dom.childNodes[0]).removeClass('L-grid-header-checkBox-mark');
        }
    },
    doRenderer : function(val, p, record, row, i) {
        var ariaChecked = '';
        var fixedId = '';
        if(Rui.useAccessibility())
            ariaChecked = (record.dataSet.isMarked(row)) ? 'aria-checked="true"' : '';
        fixedId = Rui.useFixedId() ? Rui.id(this.el, 'LSelcol-' + row + '-' + this.id) : '';
        return '<div class="L-grid-row-' + this.selectionType + ' L-grid-row-' 
            + this.selectionType + (!record.dataSet.isMarkable(row) ? '-disabled' : '') 
            + '" style="width:16px" ' + ariaChecked + ' id=\"' + fixedId +'"></div>';
    }
});
Rui.ui.grid.LColumnModel = function(oConfigs) {
    var config = oConfigs || {};
    Rui.applyObject(this, config, true);
    this.cellConfig = {};
    this.init(config);
    this.createEvent('columnMove');
    this.createEvent('columnsChanged');
    this.createEvent('cellConfigChanged');
    config = null;
};
Rui.extend(Rui.ui.grid.LColumnModel, Rui.util.LEventProvider, {
    columns: null,
    defaultWidth: 100,
    totalWidth: null,
    defaultSortable: false,
    defaultEditable: true,
    autoWidthMargin: 2,
    groupMerge: false,
    defaultDraggable: true,
    columnList: null,
    showColumnList: null,
    columnMap: null,
    gridPanel: null,
    cellConfig: null,
    freezeColumnId: null,
    freezeIndex: -1,
    multiheaderInfos: null,
    merged : false,
    autoWidth: false,
    adjustAutoWidth: false,
    skipTags: true,
    _isAutoWidth : false,
    _isEditable: false,
    init: function(config) {
        var __RUI_events = this.__RUI_events || {};
        var __RUI_subscribers = this.__RUI_subscribers || {};
        this._isAutoWidth = this.autoWidth;
        var columns = config.columns;
        if(config.isBasicColumnModel != true) {
            this._initOptions = {};
            Rui.applyObject(this._initOptions, config);
        }
        this.clearTotalWidth();
        this.initColumns();
        var merged = false;
        this.freezeIndex = -1;
        this.freezeColumnId = config.freezeColumnId;
        var tempColumnMap = {};
        var newColumns = [];
        var summaryIds = [];
        var summaryCnt = 0, groupSummary = false;
        for (var i = 0, j = 0, len = columns.length; i < len; i++) {
            var column = null;
            if(Rui.isEmpty(columns[i])) continue;
            if(columns[i] instanceof Rui.ui.grid.LColumn)
                column = columns[i];
            else {
                if(columns[i].editor && Rui.isUndefined(columns[i].editable))
                    columns[i].editable = this.defaultEditable;
                column = new Rui.ui.grid.LColumn(columns[i]);
            }
            if(this.autoWidth)
                if(!(column instanceof Rui.ui.grid.LTriggerColumn)) column.autoWidth = true;
            if(column.summary && column.summary.ids) {
                summaryIds = Rui.util.LArray.concat(summaryIds, column.summary.ids);
                if(column.summary.ids.length > 1) groupSummary = true;
                summaryCnt++;
            }
            if (column.type == 'number' && column.defaultValue == null)
                column.defaultValue = 0;
            if(column.renderer && Rui.ui.grid.LColumnModel.rendererMapper[column.renderer])
                column.renderer = Rui.ui.grid.LColumnModel.rendererMapper[column.renderer];
            if(this.freezeColumnId == column.id) {
                this.freezeIndex = j;
                if(column.hidden) {
                    this.freezeColumnId = null;
                    this.freezeIndex = -1;
                }
            }
            if(column.hidden !== true) j++;
            if(column.autoWidth) {
                this._isAutoWidth = true;
            }
            tempColumnMap[column.id] = column;
            if(column.groupId && tempColumnMap[column.groupId]) {
                tempColumnMap[column.groupId].setColumnType('group');
            }
            if(column.summary) this._isSummary = true;
            column.setColumnModel(this);
            if(this.defaultSortable === true)
                if(column.field && Rui.isNull(column.sortable) && !(column instanceof Rui.ui.grid.LStateColumn || column instanceof Rui.ui.grid.LSelectionColumn)) column.sortable = this.defaultSortable;
            if(Rui.isNull(column.width) && this.defaultWidth) column.width = this.defaultWidth;
            if(Rui.isNull(column.draggable) && this.defaultDraggable) column.draggable = this.defaultDraggable;
            this.columnList.push(column);
            if(column.hidden !== true) this.showColumnList.push(column);
            this.columnMap[column.getId()] = column;
            this.columnIndex[column] = i;
            if(column.field) this.columnField[column.field] = column;
            if(column.editor) this._isEditable = true;
            newColumns.push(column);
            if(!merged && (column.vMerge || column.hMerge))
               merged = true;
            column = null;
        }
        if (config.isBasicColumnModel != true) {
            this._initOptions.columns = newColumns;
        }
        newColumns = null;
        delete tempColumnMap;
        this.merged = merged;
        this.initMultiheaderInfos();
        if(this.isMultiheader() &&
                Rui.isUndefined(config.makeDummyCell))
            this.makeDummyCell = true;
        this.__RUI_events = __RUI_events;
        this.__RUI_subscribers = __RUI_subscribers;
        __RUI_events = __RUI_subscribers = null;
        if(summaryCnt > 1 && groupSummary == false) {
            for (var i = 0, len = summaryIds.length; i < len; i++) {
                var column = this.columnMap[summaryIds[i]];
                column.fixed = true;
            }
        }
        summaryIds = null;
    },
    bindEvent: function(gridPanel) {
        this.gridPanel = gridPanel;
        this.gridView = gridPanel.getView();
        for (var i = 0, len = this.getColumnCount(); i < len; i++) {
            var column = this.getColumnAt(i);
            if(column.bindEvent) column.bindEvent(gridPanel);
            column = null;
        }
    },
    unbindEvent: function(gridPanel) {
        this.gridPanel = gridPanel;
        this.gridView = gridPanel.getView();
        for (var i = 0, len = this.getColumnCount(); i < len; i++) {
            var column = this.getColumnAt(i);
            if(column.unbindEvent) column.unbindEvent(gridPanel);
            column = null;
        }
    },
    getColumnById: function(id) {
        var column = this.columnMap[id];
        if(!column && this.isBasicColumnModel !== true && this.isMultiheader()) {
            var bcm = this.getBasicColumnModel();
            column = bcm ? bcm.getColumnById(id) : null;
            bcm = null;
        }
        try {
            return column;
        } finally {
            column = null;
        }
    },
    getColumnAt: function(idx, isVisibleOnly) {
        if (isVisibleOnly === true) {
            return this.showColumnList[idx];
        } else {
            return this.columnList[idx];
        }
    },
    isHidden: function(idx){
        return this.getColumnAt(idx).isHidden();
    },
    getIndexById: function(id, isVisibleOnly) {
        return this.getIndex(this.getColumnById(id), isVisibleOnly);
    },
    getIndex: function(column, isVisibleOnly){
        if(!column || column.isHidden()) return -1;
        var idx = this.columnIndex[column];
        if (isVisibleOnly) {
            for (var i=0, len = idx;i<=len;i++){
                if(this.getColumnAt(i).isHidden())
                    idx--;
            }
        }
        return idx == undefined ? -1 : idx;
    },
    getColumnByField: function(field) {
        return this.columnField[field];
    },
    moveColumn: function(oldIndex,newIndex) {
        this.clearTotalWidth();
        var columns = this.columnList;
        var colIdxs = this.columnIndex;
        var currOldIndex = currNewIndex = 0;
        var oldColumn = this.getColumnAt(oldIndex, true);
        var newColumn = this.getColumnAt(newIndex, true);
        for (var i = 0, len = columns.length; i < len ; i++) {
            var column = columns[i];
            if(column.id == oldColumn.id) break;
            currOldIndex++;
        }
        for (var i = 0, len = columns.length; i < len ; i++) {
            var column = columns[i];
            if(column.id == newColumn.id) break;
            currNewIndex++;
        }
        columns = Rui.util.LArray.moveItem(columns, currOldIndex, currNewIndex);
        var showColumns = this.showColumnList;
        showColumns = Rui.util.LArray.moveItem(showColumns, oldIndex, newIndex);
        this.freezeIndex = -1;
        var colCount = columns.length;
        for (var i = 0, j = 0; i < colCount; i++) {
            colIdxs[columns[i]] = i;
            if(this.freezeColumnId == columns[i].id)
                this.freezeIndex = j;
            if(columns[i].hidden !== true) j++;
        }
        this.columnList = columns;
        this.showColumnList = showColumns;
        this.columnIndex = colIdxs;
        this.initMultiheaderInfos();
        this.fireEvent('columnMove',{target:this,oldIndex:currOldIndex,newIndex:currNewIndex});
        columns = oldColumn = newColumn = showColumns = null;
    },
    getColumnsWidth: function(columns) {
        var totalWidth = 0;
        for (var i = 0, len = columns.length; i < len; i++)
            totalWidth += columns[i].getWidth();
        return totalWidth;
    },
    getFirstColumns: function(isVisibleOnly) {
        var columns = [];
        for (var i = 0, len = this.getColumnCount(); this.freezeIndex > -1 && i < len; i++) {
            var column = this.getColumnAt(i);
            if(isVisibleOnly === true) {
                if(column.hidden !== true)
                    columns.push(column);
            } else columns.push(column);
            if (column.id == this.freezeColumnId) {
                column = null;
                break;
            }
            column = null;
        }
        try {
            return columns;
        } finally {
            columns = null;
        }
    },
    getFirstColumnsWidth: function(isVisibleOnly) {
        if (!this.firstColumnsWidth) {
            this.firstColumnsWidth = 0;
            var columns = this.getFirstColumns(isVisibleOnly);
            this.firstColumnsWidth = this.getColumnsWidth(columns);
            columns = null;
        }
        return this.firstColumnsWidth;
    },
    getLastColumns: function(isVisibleOnly) {
        var columns = [];
        var add = this.freezeIndex > -1 ? false: true;
        for (var i = 0, len = this.getColumnCount(); i < len; i++) {
            var column = this.getColumnAt(i);
            if(add) {
                if(isVisibleOnly === true) {
                    if(column.hidden !== true)
                        columns.push(column);
                } else columns.push(column);
            }
            if(this.freezeColumnId == column.id) add = true;
            column = null;
        }
        try {
            return columns;
        } finally {
            columns = null;
        }
    },
    getLastColumnsWidth: function(isVisibleOnly) {
        if (!this.lastColumnsWidth) {
            this.lastColumnsWidth = 0;
            var columns = this.getLastColumns(isVisibleOnly);
            this.lastColumnsWidth = this.getColumnsWidth(columns);
            columns = null;
        }
        return this.lastColumnsWidth;
    },
    getTotalWidth: function(isVisibleOnly) {
        if (!this.totalWidth) {
            this.totalWidth = 0;
            var columns = [];
            for (var i = 0, len = this.getColumnCount(isVisibleOnly); i < len; i++)
                columns.push(this.getColumnAt(i, isVisibleOnly));
            this.totalWidth = this.getColumnsWidth(columns);
            columns = null;
        }
        return this.totalWidth;
    },
    clearTotalWidth: function(){
        this.firstColumnsWidth = null;
        this.lastColumnsWidth = null;
        this.totalWidth = null;
    },
    getFirstColumnCount: function(isVisibleOnly) {
        var count = 0;
        for (var i = 0; i <= this.freezeIndex; i++) {
            var column = this.getColumnAt(i);
            if (column == null) return count;
            if(isVisibleOnly === true) {
                if(column.hidden !== true)
                    count++;
            } else count++;
            column = null;
        }
        return count;
    },
    getLastColumnCount: function(isVisibleOnly) {
        var count = 0;
        for (var i = this.freezeIndex + 1, len = this.columnList.length; i <= len; i++) {
            var column = this.getColumnAt(i);
            if (column == null) return count;
            if(isVisibleOnly === true) {
                if(column.hidden !== true)
                    count++;
            } else count++;
            column = null;
        }
        return count;
    },
    getColumnCount: function(isVisibleOnly) {
        if (isVisibleOnly === true) {
            if(this.visibleColumnCount) {
                return this.visibleColumnCount;
            }
            var count = 0;
            for (var i = 0, len = this.columnList.length; i < len; i++) {
                var column = this.getColumnAt(i, true);
                if (column == null) return count;
                column = null;
                count++;
            }
            this.visibleColumnCount = count;
            return count;
        } else {
            return this.columnList.length;
        }
    },
    setCellConfig: function(row, col, key, val, options) {
    	options = Rui.applyIf(options || {}, { ignoreEvent: false });
        var record = this.gridPanel.dataSet.getAt(row);
        if(record == null) return;
        var column = null;
        if(typeof col == 'string') {
            column = this.getColumnById(col);
            col = this.getIndex(column, true);
        } else {
            column = this.getColumnAt(col, true);
        }
        var rowData = this.cellConfig[record.id] || {};
        this.cellConfig[record.id] = rowData;
        var cellData = rowData[column.id] || {};
        rowData[column.id] = cellData;
        cellData[key] = val;
        if(options.ignoreEvent !== true) this.fireEvent('cellConfigChanged', { target:this, row: row, rowId: record.id, col: col, colId: column.id, key: key, value: val });
        record = val = column = rowData = cellData = null;
    },
    getCellConfig: function(row, col, key) {
    	if(!this.gridView) return {};
        var record = this.gridView.dataSet.getAt(row);
        if(record == null) return;
        var column = (typeof col == 'string') ? this.getColumnById(col) : this.getColumnAt(col, true);
        var rowData = this.cellConfig[record.id] || {};
        if(!rowData) return null;
        var cellData = rowData[column.id] || {};
        try {
            return cellData[key];
        } finally {
            record = column = rowData = cellData = null;
        }
    },
    clearCellConfig: function() {
        this.cellConfig = null;
        delete this.cellConfig;
        this.cellConfig = {};
        this.rowData = null;
        delete this.rowData;
        this.rowData = {};
    },
    getMultiheaderInfos: function(index) {
        index = Rui.isUndefined(index) ? this.multiheaderInfos.length - 1 : index;
        return this.multiheaderInfos[index];
    },
    getMultiheaderAllColumns: function(){
        var rtnColumns =[];
        var i=0,j=0, len = this.multiheaderInfos.length;
        for (i; i<len; i++){
            for (j=0; j<this.multiheaderInfos[i].columns.length; j++){
                rtnColumns.push(this.multiheaderInfos[i].columns[j]);
            }
        }
        try {
            return rtnColumns;
        } finally {
            rtnColumns = null;
        }
    },
    initMultiheaderInfos: function(){
        if(this.isBasicColumnModel) return;
        this.multiheaderInfos = [];
        if(this.freezeIndex > -1) {
            var rowCount = this.getRowCount();
            var fColumns = this.getFirstColumns(true);
            var lColumns = this.getLastColumns(true);
            var mInfos = this.createMultiheaderInfos(fColumns,rowCount);
            if(mInfos) this.multiheaderInfos.push(mInfos);
            mInfos = this.createMultiheaderInfos(lColumns,rowCount);
            if(mInfos) this.multiheaderInfos.push(mInfos);
            fColumns = lColumns = mInfos = null;
        } else {
            var columns = this.getLastColumns(true);
            var mInfos = this.createMultiheaderInfos(columns);
            if(mInfos) this.multiheaderInfos.push(mInfos);
            columns = mInfos = null;
        }
        if(this.multiheaderInfos.length < 1) this.multiheaderInfos = null;
        if(!this.isBasicColumnModel)
            this.createDataColumns();
    },
    getRowCount: function(){
        if (this.isMultiheader()) {
            return Rui.ui.grid.LCellMerge.getHeaderRowCount(this.getBasicColumnModel().columnList);
        }
        else
            return 1;
    },
    getBasicColumnModel: function() {
        if(!this.basicColumnModel) {
            if(this.isMultiheader() && this._initOptions) {
                var options = {};
                Rui.applyObject(options, this._initOptions);
                options.isBasicColumnModel = true;
                var columns = [];
                for (var i = 0, len = options.columns.length; i < len; i++) {
                    columns.push(options.columns[i].clone());
                }
                options.columns = columns;
                this.basicColumnModel = new this.constructor(options);
                this.basicColumnModel.currentColumnModel = this;
                options = columns = null;
            }
            else  {
                this.basicColumnModel = this;
            }
        }
        return this.basicColumnModel;
    },
    createMultiheaderInfos: function(columns,rowCount) {
        var mInfos = Rui.ui.grid.LCellMerge.getMultiHeaderInfo(columns,rowCount);
        if(!mInfos) return false;
        try {
            return mInfos;
        } finally {
            mInfos = null;
        }
    },
    createDataColumns: function() {
        if(!this.isMultiheader()) return;
        var newColumnList = this.columnList;
        this.initColumns();
        var column = null;
        this.freezeIndex = -1;
        for (var i = 0, j = 0, k = 0, len = newColumnList.length; i < len; i++) {
            column = newColumnList[i];
            if(column.getColumnType() != 'data') continue;
            if(this.freezeColumnId == column.id)
                this.freezeIndex = k;
            this.columnList.push(column);
            if(column.hidden !== true) this.showColumnList.push(column);
            this.columnMap[column.getId()] = column;
            this.columnIndex[column] = j++;
            if(column.hidden !== true) k++;
            if(column.field) this.columnField[column.field] = column;
        }
        newColumnList = column = null;
    },
    hasFreezeColumn: function() {
        return (this.freezeIndex > -1);
    },
    initColumns: function() {
        this.columnList = [];
        this.showColumnList = [];
        this.columnMap = {};
        this.columnIndex = {};
        this.columnField = {};
        delete this.visibleColumnCount;
    },
    isMultiheader: function(){
        return this.multiheaderInfos ? true : false;
    },
    setColumns: function(config, ignoreEvent) {
        var __RUI_events = {};
        if(this.basicColumnModel) {
            __RUI_events = this.basicColumnModel.__RUI_events;
        }
        var cm = this;
        if(this.gridPanel){
            for (var i = 0, len = cm.getColumnCount() ; i < len; i++) {
                var c = cm.getColumnAt(i);
                if(c.editor && c.editor.gridFixed){
                    c.editor.gridUnBindEvent(this.gridPanel);
                }
            }
            if(this.gridPanel.getView().syncDataSet) {
                this.gridPanel.getView().doUnSyncDataSet();
            }
        }
        delete this.basicColumnModel;
        this.init(config);
        var bcm = this.getBasicColumnModel();
        if (bcm) {
            bcm.__RUI_events = __RUI_events;
        }
        if(this.gridPanel){
            for (var i = 0, len = cm.getColumnCount() ; i < len; i++) {
                var c = cm.getColumnAt(i);
                if(c.editor && c.editor.gridFixed) {
                    c.editor.gridFieldId = c.id;
                    c.editor.gridBindEvent(this.gridPanel);
                }
            }
            if(this.gridPanel.getView().syncDataSet) {
                this.gridPanel.getView().doSyncDataSet();
            }
        }
        this.gridPanel.oldWidth = 0;
        this.gridPanel.updateColumnsAutoWidth();
        this.cellConfig = {};
        if(ignoreEvent !== true) this.fireEvent('columnsChanged',{target:this});
        __RUI_events = bcm = null;
    },
    isMerged : function(){
        return this.merged;
    },
    setFreezeColumnId: function(id) {
        this.clearTotalWidth();
        var newOption = {};
        Rui.applyObject(newOption, this._initOptions);
        newOption.freezeColumnId = id;
        this.setColumns(newOption);
        newOption = null;
    },
    getInitOptions: function() {
        return this._initOptions;
    },
    updateColumnsAutoWidth: function(maxWidth) {
        this.clearTotalWidth();
        var sumFixedWidth = sumAutoWidth = 0;
        var autoWidthColumns = [];
        for (var i = 0, len = this.getColumnCount(true); i < len ; i++) {
            var column = this.getColumnAt(i, true);
            if (!(column instanceof Rui.ui.grid.LTriggerColumn) && column.isResizable() && (this.autoWidth || column.autoWidth)) {
                sumAutoWidth += column.width;
                autoWidthColumns.push(column);
            } else
                sumFixedWidth += column.width;
            column = null;
        }
        var maxAutoWidth = maxWidth - sumFixedWidth - 1;
        if(maxAutoWidth > 0) {
            var widths = [];
            var isResize = this.calColumnAutoWidths(widths, autoWidthColumns, maxAutoWidth, sumAutoWidth);
            if(isResize) {
                var resizeAutoWidthColumns = [];
                sumAutoWidth = 0;
                for (var i = 0, len = widths.length; i < len; i++) {
                    var column = widths[i].column;
                    var width = widths[i].width;
                    if(widths[i].isResize) {
                        maxAutoWidth -= width;
                        column.setWidth(width);
                    } else {
                        sumAutoWidth += column.width;
                        resizeAutoWidthColumns.push(widths[i].column);
                    }
                    column = null;
                }
                widths = [];
                this.calColumnAutoWidths(widths, resizeAutoWidthColumns, maxAutoWidth, sumAutoWidth);
                resizeAutoWidthColumns = null;
            }
            for (var i = 0, len = widths.length; i < len; i++) {
            	if(i == (len - 1)) widths[i].width = widths[i].width - this.autoWidthMargin;
                widths[i].column.setWidth(widths[i].width);
            }
            widths = null;
        }
        autoWidthColumns = null;
    },
    calColumnAutoWidths: function(widths, autoWidthColumns, maxAutoWidth, sumAutoWidth) {
        var isResize = false;
        var sumWidth = 0;
        for (var i = 0, len = autoWidthColumns.length; i < len; i++) {
            var column = autoWidthColumns[i];
            var width = maxAutoWidth * (column.width / sumAutoWidth);
            width = Math.floor(width);
            sumWidth += width;
            var widthInfo = { column: column };
            if(column.minWidth > width) {
                width = column.minWidth;
                isResize = true;
                widthInfo.isResize = true;
            } else if(column.maxAutoWidth < width) {
                width = column.maxAutoWidth;
                isResize = true;
                widthInfo.isResize = true;
            } else
                widthInfo.isResize = this.adjustAutoWidth === true; 
            widthInfo.width = width;
            widths.push(widthInfo);
        }
        if(widths.length > 0)
            widths[widths.length - 1].width = widths[widths.length - 1].width + (maxAutoWidth - sumWidth);
        autoWidthColumns = widths = null;
        return this.adjustAutoWidth === true ? true : isResize;
    },
    isSummary: function() {
        return this._isSummary;
    },
    isAutoWidth: function() {
        return this._isAutoWidth;
    },
    toString: function() {
        return 'Rui.ui.grid.LColumnModel ' + this.id;
    },
    destroy: function() {
        if(this.basicColumnModel)
            this.basicColumnModel.destroy();
        Rui.ui.grid.LColumnModel.superclass.destroy.call(this);
    }
});
Rui.ui.grid.LColumnModel.rendererMapper = [];
Rui.ui.grid.LRowModel = function(config) {
    config = config || {};
    Rui.applyObject(this, config, true);
    this.rowConfig = {};
    this.createEvent('rowConfigChanged');
};
Rui.extend(Rui.ui.grid.LRowModel, Rui.util.LEventProvider, {
    gridPanel : null,
    rowConfig: null,
    renderer: null,
    init: function(config) {
    },
    bindEvent: function(gridPanel) {
        this.gridPanel = gridPanel;
    },
    unbindEvent: function(gridPanel) {
        this.gridPanel = gridPanel;
    },
    setRowConfig: function(row, key, val) {
        var gridView = this.gridPanel.getView();
        var record = gridView.dataSet.getAt(row);
        if(record == null) return;
        var rowData = this.rowConfig[record.id] || {};
        this.rowConfig[record.id] = rowData;
        rowData[key] = val;
        this.fireEvent('rowConfigChanged', { target:this, row: row, rowId: record.id, key: key, value: val });
    },
    getRowConfig: function(row, key) {
        var gridView = this.gridPanel.getView();
        var record = gridView.dataSet.getAt(row);
        if(record == null) return;
        var rowData = this.rowConfig[record.id] || {};
        return rowData[key];
    },
    destroy: function() {
        this.rowConfig = null;
        delete this.rowConfig;
        this.renderer = null;
        delete this.renderer;
        Rui.ui.grid.LRowModel.superclass.destroy.call(this);
    },
    toString: function() {
        return 'Rui.ui.grid.LRowModel ' + this.id;
    }
});
Rui.ui.grid.LColumnResizer = function(grid) {
    this.grid = grid;
    var id = this.grid.el.id + 'columnResizerProxy';
    Rui.ui.grid.LColumnResizer.superclass.constructor.call(this, {
        id: this.grid.headerEl.dom.id, 
        group: id, 
        attributes: {
            dragElId: this.grid.resizeProxyEl.id,
            resizeFrame: false
        }
    });
};
Rui.extend(Rui.ui.grid.LColumnResizer, Rui.dd.LDDProxy, {
    otype: 'Rui.ui.grid.LColumnResizer',
    cellIndex: null,
    startX: null,
    b4StartDrag: function(x,y){
        this.grid.headerDisabled = true;        
        var height = this.grid.el.getHeight();
        var width = this.grid.columnModel.getColumnAt(this.cellIndex, true).getWidth();
        var minWidth = (width - this.grid.getMinColumnWidth());
        minWidth = minWidth > 0 ? minWidth : 0;
        this.grid.resizeProxyEl.setHeight(height);
        this.resetConstraints();
        this.setXConstraint(minWidth, 1000);
        this.setYConstraint(0, 0);
        this.minX = x - minWidth;
        this.maxX = x + 1000;
        this.startX = x;
        Rui.dd.LDDProxy.prototype.b4StartDrag.call(this, x, y);
    },
    handleMouseDown: function(e){
        var headerCellDom = this.grid.findHeaderCellDom(e.target);
        if(headerCellDom){
            var headerCellEl = Rui.get(headerCellDom);
            var xy = headerCellEl.getXY(), x = xy[0]; 
            var exy = Rui.util.LEvent.getXY(e);
            var ex = exy[0];
            var w = headerCellEl.getWidth(), adjust = false;
            if((ex - x) <= this.grid.resizeHandleWidth){
                adjust = -1;
            }else if((x+w) - ex <= this.grid.resizeHandleWidth){
                adjust = 0;
            }
            if(adjust !== false){                
                var ci = this.grid.getCell(headerCellEl.dom, e.pageX);
                this.cellIndex = ci+adjust;
                var column = this.grid.columnModel.getColumnAt(this.cellIndex, true);
                if(column && column.isResizable()){
                    Rui.ui.grid.LColumnResizer.superclass.handleMouseDown.apply(this, arguments);
                }
            }else if(this.grid.columnDD){
                this.grid.columnDD.callHandleMouseDown(e);
            }
        }
    },
    endDrag: function(e){
        var pX = Rui.util.LEvent.getPageX(e);
        var endX = (this.minX >= pX) ? this.minX : pX;
        var diff = endX - this.startX;
        var column = this.grid.columnModel.getColumnAt(this.cellIndex, true);
        var width = column.getWidth() + diff;
        if(column.minWidth > width) width = column.minWidth;
        column.setWidth(width);
        this.grid.headerDisabled = false;
    },
    autoOffset: function(){
        this.setDelta(0,0);
    }
});
Rui.ui.grid.LColumnDD = function(grid) {
    this.grid = grid;
    this.cellIndex = null;
    this.newCellIndex = null;
    this.headerCellEl = null;
    var id = this.grid.el.id + 'columnDDProxy';
    Rui.ui.grid.LColumnDD.superclass.constructor.call(this, {
        id: this.grid.headerEl.dom.id, 
        group: id, 
        attributes: {
            dragElId: this.grid.ddProxyEl.id,
            resizeFrame: false
        }
    });
};
Rui.extend(Rui.ui.grid.LColumnDD, Rui.dd.LDDProxy, {
    otype: 'Rui.ui.grid.LColumnDD',
    b4StartDrag: function(x,y){
        this.grid.headerDisabled = true;
        var height = this.grid.el.getHeight();
        var c = this.grid.columnModel.getColumnAt(this.cellIndex, true);
        if(c.draggable !== true) return;
        var width = c.getWidth();
        var region = this.grid.el.getRegion();
        this.grid.ddProxyEl.setHeight(height);
        this.grid.ddProxyEl.setWidth(width);
        this.grid.ddTargetEl.setHeight(height);
        var minWidth = region.left;
        var maxWidth = region.right;
        this.resetConstraints();
        this.setXConstraint(minWidth, maxWidth);
        this.setYConstraint(0, this.grid.headerEl.getHeight());
        Rui.dd.LDDProxy.prototype.b4StartDrag.call(this, x, y);
    },
    clickValidator: function(e) {
        var headerCellDom = this.grid.findHeaderCellDom(e.target);
        if (headerCellDom) {
            this.headerCellEl = Rui.get(headerCellDom);
            this.cellIndex = this.grid.getCell(headerCellDom, e.pageX);
            this.newCellIndex = this.cellIndex;
            var column = this.grid.columnModel.getColumnAt(this.cellIndex, true);
            if (this.grid._useColumnDD && column.isDraggable() && !column.isFixed()) {
                var target = Rui.util.LEvent.getTarget(e);
                return (this.id == this.handleElId || this.LDDM.handleWasClicked(target, this.id));
            }
        }
    },
    onDrag: function(e) {
        var headerCellDom = this.grid.findHeaderCellDom(e.target);
        if(headerCellDom) {
            var headerCellEl = Rui.get(headerCellDom);
            var newCellIndex = this.grid.getCell(headerCellEl.dom);
            var column = this.grid.columnModel.getColumnAt(newCellIndex, true);
            if (column.isDraggable() && !column.isFixed()) {
                var xy = headerCellEl.getXY();
                this.grid.ddTargetEl.setXY([xy[0], xy[1] - 5]);
                this.grid.ddTargetEl.show();
                var ex = Rui.util.LEvent.getPageX(e);
                var targetX = headerCellEl.getX();
                var midX = targetX + (headerCellEl.getWidth() / 2);
                if(ex < midX){
                    this.grid.ddTargetEl.setX(targetX);
                    adjust = 'front';
                }else{
                    var targetWidth = headerCellEl.getWidth();
                    this.grid.ddTargetEl.setX(targetX + targetWidth);
                    adjust = 'back';
                }
                if(this.cellIndex > newCellIndex){
                    if (adjust == 'back') {
                        newCellIndex++;
                    }
                    this.newCellIndex = newCellIndex;
                }else if (this.cellIndex < newCellIndex) {
                    if (adjust == 'front') {
                        newCellIndex--;
                    }
                    this.newCellIndex = newCellIndex;
                }
            }
        }
    },
    endDrag: function() {
        this.grid.ddTargetEl.hide();
        if(this.cellIndex !== this.newCellIndex) this.grid.columnModel.moveColumn(this.cellIndex, this.newCellIndex);
        this.newCellIndex = null;
        this.grid.headerDisabled = false;
    },
    autoOffset: function(){
        this.setDelta(0,-5);
    },
    callHandleMouseDown: function(e){
        Rui.ui.grid.LColumnDD.superclass.handleMouseDown.call(this, e);
    }
});
(function() {
    var Dom = Rui.util.LDom;
    Rui.ui.grid.LBufferGridView = function(config) {
        config = config || {};
        config = Rui.applyIf(config, Rui.getConfig().getFirst('$.ext.grid.defaultProperties'));
        this.renderBodyEvent = this.createEvent('renderBody', { isCE: true });
        this.createEvent('syncDataSet');
        this.createEvent('beforeRender');
        this.createEvent('rendered');
        this.createEvent('rowRendered');
        this.createEvent('cellRendered');
        this.createEvent('sortField');
        this.createEvent('bodyScroll');
        this.createEvent('redoRender');
        this.createEvent('renderData');
        this.createEvent('scrollY');
        this.createEvent('scrollX');
        this.dataSetEvents = {};
        this.subTotalLabel = Rui.getMessageManager().get('$.base.msg122');
        delete this.applyTo;
        delete config.applyTo;
        delete this.renderTo;
        delete config.renderTo;
        Rui.ui.grid.LBufferGridView.superclass.constructor.call(this, config);
        this.webStorage = new Rui.webdb.LWebStorage();
        config = null;
    };
    var GV = Rui.ui.grid.LBufferGridView;
    GV.DEFAULT_ROW_HEIGHT = 27;
    GV.CELLP_CONFIG = {
        editable: 'L-grid-cell-editable',
        tooltipText: 'L-grid-cell-tooltip'
    };
    Rui.applyObject(Rui.ui.grid.LBufferGridView, {
        CLASS_GRIDVIEW: 'L-grid',
        CLASS_GRIDVIEW_SCROLLER: 'L-grid-scroller',
        CLASS_GRIDVIEW_FOCUS: 'L-grid-focus',
        CLASS_GRIDVIEW_RESIZE_PROXY: 'L-grid-resize-proxy',
        CLASS_GRIDVIEW_DD_PROXY: 'L-grid-dd-proxy',
        CLASS_GRIDVIEW_DD_TARGET: 'L-grid-dd-target',
        CLASS_GRIDVIEW_COL: 'L-grid-col',
        CLASS_GRIDVIEW_HEADER: 'L-grid-header',
        CLASS_GRIDVIEW_HEADER_OFFSET: 'L-grid-header-offset',
        CLASS_GRIDVIEW_HEADER_ROW: 'L-grid-header-row',
        CLASS_GRIDVIEW_HEADER_CELL: 'L-grid-header-cell',
        CLASS_GRIDVIEW_HEADER_INNER: 'L-grid-header-inner',
        CLASS_GRIDVIEW_HEADER_BTN: 'L-grid-header-btn',
        CLASS_GRIDVIEW_HEADER_OVER: 'L-grid-header-over',
        CLASS_GRIDVIEW_BODY: 'L-grid-body',
        CLASS_GRIDVIEW_BODY_EMPTY: 'L-grid-body-empty',
        CLASS_GRIDVIEW_ROW: 'L-grid-row',
        CLASS_GRIDVIEW_ROW_FIRST: 'L-grid-row-first',
        CLASS_GRIDVIEW_ROW_LAST: 'L-grid-row-last',
        CLASS_GRIDVIEW_ROW_ODD: 'L-grid-row-odd',
        CLASS_GRIDVIEW_ROW_EVEN: 'L-grid-row-even',
        CLASS_GRIDVIEW_ROW_OVER: 'L-grid-row-over',
        CLASS_GRIDVIEW_CELL: 'L-grid-cell',
        CLASS_GRIDVIEW_CELL_FIRST: 'L-grid-cell-first',
        CLASS_GRIDVIEW_CELL_LAST: 'L-grid-cell-last',
        CLASS_GRIDVIEW_CELL_INNER: 'L-grid-cell-inner',
        CLASS_GRIDVIEW_SORT_ASC: 'L-grid-sort-asc',
        CLASS_GRIDVIEW_SORT_DESC: 'L-grid-sort-desc',
        CLASS_GRIDVIEW_ROW_SELECTED: 'L-grid-row-selected',
        CLASS_GRIDVIEW_ROW_SELECT_MARK: 'L-grid-row-marked',
        CLASS_GRIDVIEW_CELL_SELECTED: 'L-grid-cell-selected',
        CLASS_GRIDVIEW_CELL_EDITED: 'L-grid-cell-edited',
        CLASS_MULTI_HEADER: 'L-grid-multi-header'
   });
    Rui.extend(Rui.ui.grid.LBufferGridView, Rui.ui.LUIComponent, {
        otype: 'Rui.ui.grid.LBufferGridView',
        columnModel: null,
        templates: null,
        dataSet: null,
        syncDataSet: true,
        loadingMessage: '',
        emptyDataMessageCode: null,
        scrollerConfig: null,
        borderWidth: 1,
        scrollerEl: null,
        headerEl: null,
        focusEl: null,
        headerOffsetEl: null,
        bodyEl: null,
        resizeProxyEl: null,
        resizeHandleWidth: 8,
        rowHoverStyle: true,
        minColumnWidth: 10,
        cellSelector: '.' + GV.CLASS_GRIDVIEW_CELL,
        cellSelectorDepth:10,
        rowSelector: '.' + GV.CLASS_GRIDVIEW_ROW,
        rowSelectorDepth: 10,
        headerDisabled: false,
        useColumnResize: true,
        useColumnDD: true,
        headerTools: false,
        activeHeaderEl: null,
        columnResizer: null,
        cellRe: new RegExp('L-grid-cell-([^\\s]+)', ''),
        rowRe: new RegExp('L-grid-row-r([^\\s]+)', ''),
        ddProxyEl: null,
        ddTargetEl: null,
        gridPanel: null,
        sortField: null,
        sortDir: null,
        isRemoteSort: false,
        dataSetEvents: null,
        scroller: null,
        renderRange: null,
        skipRowCellEvent: true,
        renderTime: 50,
        renderDataTime: 50,
        rowRenderingLimit: 10,
        scrollTimeout: 20,
        autoMappingSortable: false,
        modifiedDate: new Date(),
        pluginSpaceHeight: 0,
        irregularScroll: false,
        irregularField: null,
        customSortable: false,
        syncYFocusRow: true,
        gridScrollMessage: true,
        gridId: null,
        initComponent: function(oConfig) {
            this._useColumnDD = this.useColumnDD;
            this.irregularScroll = this.irregularScroll || !!this.columnModel.isSummary();
            this.createTemplate();
        },
        initEvents: function() {
            Rui.ui.grid.LBufferGridView.superclass.initEvents.call(this);
            this.renderBodyEvent.unOnAll();
            this.renderEvent.on(this.onRender, this);
        },
        initDefaultConfig: function() {
            Rui.ui.grid.LBufferGridView.superclass.initDefaultConfig.call(this);
            this.cfg.addProperty('syncDataSet', {
                    handler: this._setSyncDataSet,
                    value: this.syncDataSet,
                    validator: Rui.isBoolean
            });
        },
        bindColumns: function() {
            this.columnAddListener();
            if(this.useColumnResize !== false)
                this.columnResizer = new Rui.ui.grid.LColumnResizer(this);
            if(this.useColumnDD !== false)
                this.columnDD = new Rui.ui.grid.LColumnDD(this);
            var colCount = this.columnModel.getColumnCount(true);
            if (this.useColumnResize) {
                for (var i = 0; i < colCount; i++) {
                    this.columnModel.getColumnAt(i,true).unOn('columnResize', this.onColumnResize, this);
                    this.columnModel.getColumnAt(i,true).on('columnResize', this.onColumnResize, this, true);
                }
            }
        },
        setPanel: function(gridPanel) {
            gridPanel.unOn('headerClick', this.onHeaderClick, this);
            gridPanel.on('headerClick', this.onHeaderClick, this, true, { system: true });
            gridPanel.unOn('headerDblClick', this.onHeaderDblClick, this);
            gridPanel.on('headerDblClick', this.onHeaderDblClick, this, true, { system: true });
            gridPanel.unOn('widthResize', this.onWidthResize, this);
            gridPanel.on('widthResize', this.onWidthResize, this, true, { system: true });
            gridPanel.unOn('cellClick', this.onCellClick, this);
            gridPanel.on('cellClick', this.onCellClick, this, true, { system: true });
            this.gridPanel = gridPanel;
            this.columnModel = this.gridPanel.columnModel;
            this.selectionModel = this.gridPanel.selectionModel;
        },
        getDataSet: function() {
            return this.dataSet;
        },
        renderMaster: function(headerHtml) {
            var cm = this.columnModel;
            var contentWidth = cm.getTotalWidth(true);
            var scrollWidth = 0;
            if(this.gridPanel.autoWidth === true || !this.width || (this.width - contentWidth < 0))
                scrollWidth = Rui.ui.LScroller.SCROLLBAR_SIZE;
            this.gridId = this.el.findParentNode('.L-grid-panel').parentNode.id;
            var html = this.templates.master.apply({
                ghId: Rui.useFixedId() ? 'LGrid-header-' + this.gridId : Rui.id(),
                ghoId: Rui.useFixedId() ? 'LGrid-header-offset-' + this.gridId : Rui.id(),
                gscrId: Rui.useFixedId() ? 'LGrid-header-scroll-' + this.gridId : Rui.id(),
                header: headerHtml,
                ostyle: 'width:' + (contentWidth + scrollWidth) + 'px',
                bstyle: 'width:' + contentWidth + 'px'
            });
            var masked = this.el.isMask();
            this.el.html(html);
            if(masked === true) this.showLoadingMessage();
            if(cm.isMultiheader()) this.el.addClass(GV.CLASS_MULTI_HEADER);
            if(cm.freezeIndex > -1) this.el.addClass('L-grid-column-freeze');
            else this.el.removeClass('L-grid-column-freeze');
            if(this.gridPanel.editable) this.el.addClass("L-editable");
            cm = null;
        },
        renderMultiHeader: function(){
            this.headerOffsetEl.html(this.getRenderMultiheader());
        },
        getRenderRowBody: function(row,record,contentWidth, firstColumns, spans){
            var ts = this.templates || {};
            var cm = this.columnModel;
            contentWidth = contentWidth ? contentWidth : cm.getTotalWidth(true);
            var colCount = cm.getColumnCount(true);
            var cells = '';
            var freezeIndex = cm.freezeIndex;
            if(freezeIndex > -1) {
                colCount = firstColumns ? freezeIndex + 1 : colCount;
                for (var i = (firstColumns ? 0 : (freezeIndex + 1)); i < colCount; i++) {
                    if(spans && (spans[i].rowspan < 0 || spans[i].colspan < 0)) continue;
                    cells += this.getRenderCell(row, i, colCount, record, spans ? spans[i] : undefined);
                }
            } else {
                for (var i = 0; i < colCount; i++) {
                    if(spans && spans[i] && (spans[i].rowspan < 0 || spans[i].colspan < 0)) continue;
                    cells += this.getRenderCell(row, i, colCount, record, spans ? spans[i] : undefined);
                }
            }
            cells += this.getRenderDummyCell(row);
            var tstyle = 'width:' + contentWidth + 'px;';
            var rowBody = ts.rowBody.apply({
                tstyle: tstyle,
                cells: cells
            });
            cm = ts = record = spans = null;
            return rowBody;
        },
        showEmptyDataMessage: function(){
            while (this.bodyEl.dom.childNodes.length > 0 && 0 < this.bodyEl.dom.childNodes[0].childNodes.length)
                Dom.removeNode(this.bodyEl.dom.childNodes[0].childNodes[0]);
            var messageCode = (this.emptyDataMessageCode != null) ? this.emptyDataMessageCode : '$.base.msg115';
            var emptyDataMessage = Rui.getMessageManager().get(messageCode);
            var trHtml = '<tr class="' + GV.CLASS_GRIDVIEW_BODY_EMPTY + '"><td colspan="' + this.columnModel.getColumnCount(true) + '">' + emptyDataMessage + '</td></tr>';
            var newRowDom = document.createElement('div');
            newRowDom.innerHTML = '<li></li><table></table><li><table>' + trHtml + '</table></li>';
            var newDom0 = newRowDom.getElementsByTagName('li')[0];
            var newDom1 = newRowDom.getElementsByTagName('li')[1];
            var ulEl = this.bodyEl.select('> .L-grid-ul');
            ulEl.appendChild(newDom0.cloneNode(true));
            ulEl.appendChild(newDom1.cloneNode(true));
            newRowDom = newDom0 = newDom1 = ulEl = null;
        },
        hideEmptyDataMessage: function() {
            this.bodyEl.select(' > .' + GV.CLASS_GRIDVIEW_BODY_EMPTY).remove();
        },
        updateEmptyWidth: function(contentWidth) {
            return Rui.get(this.bodyEl.dom.firstChild).hasClass('.L-grid-body-empty');
        },
        hasRows: function(){
            if(!this.bodyEl || !this.bodyEl.dom.childNodes || this.bodyEl.dom.childNodes.length < 1 || !this.bodyEl.dom.childNodes[0].childNodes) return false;
            if(this.bodyEl.dom.childNodes[0].childNodes.length < 1) return false;
            var tableDom = this.bodyEl.dom.childNodes[0].childNodes[1].childNodes[0];
            var rows = tableDom.rows;
            try {
                return rows.length > 0 && rows[0].className != GV.CLASS_GRIDVIEW_BODY_EMPTY;
            } finally {
                rows = null;
            }
        },
        getRows: function(index){
            if(!this.hasRows()) return [];
            if(index === 0) {
                var liEl = this.getFirstLiEl();
                return liEl.dom.childNodes[0].rows;
            } else {
                var liEl = this.getLastLiEl();
                return liEl.dom.childNodes[0].rows;
            }
        },
        syncLiFirst: function(scrollTop) {
            if(this.columnModel.freezeIndex > -1) {
                this.getFirstLiEl().setStyle('top', ('-' + scrollTop + 'px'));
            }
        },
        updateTotalWidth: function() {
            var contentWidth = this.columnModel.getTotalWidth(true);
            this.bodyEl.setWidth(contentWidth);
            var isEmpty = this.updateEmptyWidth(contentWidth);
            if (!isEmpty) {
                var gridRows = this.bodyEl.dom.childNodes;
                var row = null;
                for (var i = 0; i < gridRows.length; i++) {
                    row = gridRows[i];
                    if (row.firstChild && row.firstChild.style) {
                        row.firstChild.style.width = contentWidth + 'px';
                    }
                    row.style.width = contentWidth + 'px';
                }
                gridRows = row = null;
            }
        },
        redoRender: function(system, scrollLeft){
            if(system !== true && this.renderTime > 0) {
                if(!this.delayRR)
                    this.delayRR = Rui.later(this.renderTime, this, this._redoRender, [system, scrollLeft], true);
            }
            if(this.renderTime < 1 || system === true)
                this._redoRender.call(this, system, scrollLeft);
        },
        _redoRender: function(system, scrollLeft) {
            var compTime = new Date() - this.modifiedDate;
            if (compTime < this.renderTime && system !== true) {
                Rui.log('ignore');
                return;
            }
            if(this.delayRR)
                this.delayRR.cancel();
            this.delayRR = null;
            this.gridPanel.doRedoRender();
            var coord = this.scroller ? this.scroller.getScroll() : null;
            if(this.scroller) {
                this.scroller.destroy();
                this.scroller = null;
            }
            this.growedRowCount = 0;
            this._temporaryGrowedCount = null;
            var hiddenParentEl = this.el ? Rui.util.LDom.getHiddenParent(this.el) : null;
            if (hiddenParentEl) {
                hiddenParentEl = Rui.get(hiddenParentEl);
                hiddenParentEl.addClass('L-block-display');
            }
            this.updateView();
            this.updateSizes(true);
            this.makeScroll(false, scrollLeft);
            this.renderBody(this.getRenderBody(true), {ignoreEvent : true});
            this.getRenderRange();
            this.setLastGrowed();
            this.setLastGrowed();
            this.bodyEl.html(this.getRenderBody());
            this.doEmptyDataMessage();
            this.bindColumns();
            this.resetScroller();
            if(this.scroller && coord) this.scroller.setScroll(coord);
            this.onBodyScroll();
            this.syncHeaderScroll();
            if(this.plugins) {
                for (var i = 0, len = this.plugins.length; i < len; i++) {
                    this.plugins[i].updatePlugin({ isRendered: true });
                }
            }
            if (hiddenParentEl) hiddenParentEl.removeClass('L-block-display');
            if(this.dataSet.getCount() > 0 && this.dataSet.getCount() == this.dataSet.selectedData.length)
            	this.getHeaderEl().select('.L-grid-header-selection').addClass('L-grid-header-checkBox-mark');
            if(this.cfg.getProperty('disabled'))
                this.disable();
            this.fireEvent('redoRender');
            coord = null;
        },
        _setHeight: function(type, args, obj){
            if(this._rendered && this.height === args[0]) return;
            Rui.ui.grid.LBufferGridView.superclass._setHeight.call(this,type, args, obj);
            if(this._rendered) {
                this.updateSizes();
                this.redoRenderData({ resetScroll: true, renderCheckFirst: true });
            }
        },
        _setWidth: function(type, args, obj){
            if(this._rendered && this.width === args[0]) return;
            Rui.ui.grid.LBufferGridView.superclass._setWidth.call(this,type, args, obj);
            if(this._rendered)
                this.updateSizes();
        },
        updateHeaderSize: function() {
            if(this.scroller) {
                var cm = this.columnModel;
                var contentWidth = cm.getTotalWidth(true);
                var scrollWidth = this.scroller && this.scroller.existScrollbar(true) ? Rui.ui.LScroller.SCROLLBAR_SIZE : 0;
                this.headerOffsetEl.setWidth(contentWidth + scrollWidth);
            }
        },
        syncHeaderScroll: function(){
            if(this.scroller) {
                this.headerEl.dom.scrollLeft = this.scroller.getScrollLeft();
            }
        },
        makeScroll: function(initScroll, scrollLeft){
            if(!this.scroller){
                var scrollConfig = Rui.merge({
                    scrollbar: this.columnModel.isAutoWidth() ? 'y' : 'auto',
                        applyTo: this.scrollerEl,
                        content: this.bodyEl,
                        controlScrollbarDrag: this.pagerMode == 'scroll'
                    }, this.scrollerConfig || {});
                if(this.pagerMode === 'scroll') scrollConfig.wheelStep = 1;
                this.scroller = new Rui.ui.grid.LGridScroller(scrollConfig);
                this.scroller.on('scrollY', this.onScrollY, this, true);
                this.scroller.on('scrollX', this.onScrollX, this, true);
                if(scrollLeft) this.scroller.createScrollLeft = scrollLeft;
                if(this.scrollInit) this.scrollInit(this.scroller);
            }
            if(this.pluginSpaceHeight > 0){
                this.scroller.setSpace(this.pluginSpaceHeight, false, 'bottom');
            }
        },
        resetScroller: function(goFirst){
            if(this.scroller){
                var scrollCount = this.getDataCount(),
                    vrc = this.renderRange ? this.renderRange.visibleRowCount : 0;
                if(scrollCount > 0){
                    if(this.irregularScroll){
                        scrollCount = scrollCount - vrc + this.growedRowCount;
                        this.scroller.setSizes(scrollCount, 0, 0, Math.max(vrc - (this.getFirstGrowedCount()+1), 1));
                    }else{
                        if(this.pagerMode === 'scroll')
                            scrollCount = Math.ceil(scrollCount / this.pager.pageSize)-1;
                        else
                            scrollCount = scrollCount - this.getVisibleRowCount(true);
                        this.scroller.setSizes(scrollCount, 0, 0, vrc);
                    }
                }
                this.scroller.refresh(goFirst === true);
            }
            if(goFirst) {
                this.syncLiFirst(0);
            }
        },
        setLastGrowed: function(){
            if(!this.renderRange) return;
            if(this.irregularScroll !== true) return;
            this.growedRowCount = this.getLastGrowedCount();
        },
        getLastGrowedCount: function(){
            if(this.irregularScroll !== true)
                return 0;
            if(!Rui.isEmpty(this._temporaryGrowedCount)){
                return this._temporaryGrowedCount;
            }
            var growed = 0,
                rows, expactRow, startRow,
                rowCount = this.getDataCount(),
                visibleRowCount = this.renderRange ? this.renderRange.visibleRowCount : this.getVisibleRowCount(true, this.getIrregularRowHeight(false));
            rows = this._getRenderedLastRows(rowCount, Math.min(Math.max(visibleRowCount, 3), rowCount));
            expactRow = this._getExpectedStartRow(rows);
            startRow = this.getVisibleRow(this.findRow(rows[expactRow]));
            if(startRow == -1){
                while (expactRow++){
                    startRow = this.getVisibleRow(this.findRow(rows[expactRow]));
                    if(startRow !== -1){
                        break;
                    }
                }
            }
            if(startRow > 0){
                growed = startRow - (rowCount - visibleRowCount);
                if(growed >= visibleRowCount)
                    growed = visibleRowCount -1;
            }
            this._temporaryGrowedCount = growed;
            return growed;
        },
        getFirstGrowedCount: function(){
            if(this.irregularScroll !== true)
                return 0;
            var growed = 0,
                rows, expactRow, startRow, visibleLastRow,
                rowCount = this.getDataCount(),
                visibleRowCount = this.renderRange ? this.renderRange.visibleRowCount : this.getVisibleRowCount(true, this.getIrregularRowHeight(false));
            rows = this.getRows();
            expactRow = this._getExpectedLastRow(rows, true);
            if(expactRow == rows.length-1)
                return 0;
            startRow = this.getVisibleRow(this.findRow(rows[0]));
            visibleLastRow = this.getVisibleRow(this.findRow(rows[expactRow]));
            if(visibleLastRow == -1){
                while (expactRow--){
                    visibleLastRow = this.getVisibleRow(this.findRow(rows[expactRow]));
                    if(visibleLastRow !== -1){
                        break;
                    }
                }
            }
            growed = visibleLastRow - startRow +1;
            return growed;
        },
        _getRenderedLastRows: function(rowCount, visibleRowCount){
            if(this.renderRange){
                var fakeRR = this.renderRange;
                rowCount = rowCount || this.getDataCount(),
                visibleRowCount = visibleRowCount || this.getVisibleRowCount(true);
                if(rowCount < visibleRowCount)
                    visibleRowCount = rowCount;
                fakeRR.rowCount = rowCount;
                fakeRR.end = rowCount-1;
                fakeRR.start = fakeRR.end - (visibleRowCount - 1);
                fakeRR.visibleStart = fakeRR.start;
                fakeRR.visibleEnd = fakeRR.end;
                this.bodyEl.html(this.getRenderBody(false, true, fakeRR));
            }
            return this.getRows();
        },
        _getExpectedStartRow: function(rows, offset){
            var len = rows.length - (offset || 0),
                i = len,
                cumulatedHeight = 0,
                scrollHeight = this.scroller.getScrollHeight();
            while (i){
                i--;
                cumulatedHeight += this._getRowHeight(rows[i]);
                if(cumulatedHeight > scrollHeight){
                    i++;
                    if(i >= len) i = len -1;
                    break;
                }
            }
            return i;
        },
        _getExpectedLastRow: function(rows, excludeOver){
            var i = 0,
                len = rows.length,
                cumulatedHeight = 0,
                scrollHeight = this.scroller.getScrollHeight();
            while (i < len){
                cumulatedHeight += this._getRowHeight(rows[i]);
                if(cumulatedHeight > scrollHeight){
                    break;
                }
                i++;
            }
            return excludeOver && i > 0 ? i-1: i;
        },
        doRender: function(appendToNode) {
            var cm = this.columnModel;
            if(cm.isAutoWidth()) {
                var width = this.gridPanel.width;
                var tWidth = cm.getTotalWidth(true);
                if(tWidth < width) {
                    var columnAutoWidth = width;
                    var scrollerWidth = 0;
                    var borderWidth = 0;
                    if(this.scrollerConfig && this.scrollerConfig.scrollbar === 'n') {
                        borderWidth = this.gridPanel.borderWidth * 2;
                    } else scrollerWidth = Rui.ui.LScroller.SCROLLBAR_SIZE;
                    columnAutoWidth = width - scrollerWidth - borderWidth;
                    cm.updateColumnsAutoWidth(columnAutoWidth);
                }
            }
            this.el.addClass(GV.CLASS_GRIDVIEW);
            this.el.addClass('L-fixed');
            if(Rui.useAccessibility())
                this.el.setAttribute('role', 'grid');
            this.updateView();
            if(this.useColumnDD){
                cm.unOn('columnMove',this.onColumnMove, this);
                cm.on('columnMove',this.onColumnMove, this, true);
            }
            cm.unOn('columnsChanged', this.onColumnsChanged, this);
            cm.on('columnsChanged', this.onColumnsChanged, this, true);
            Rui.util.LEvent.removeListener(this.el.dom, 'mousedown', this.onCheckFocus);
            Rui.util.LEvent.addListener(this.el.dom, 'mousedown', this.onCheckFocus, this, true);
            this.updateSizes();
            if(this.getDataCount() > 0 && this.syncDataSet) {
                this.doUnSyncDataSet();
                this.doSyncDataSet();
            }
            this.doRenderData();
            this.bindColumns();
            if(this.tooltip != null) this.tooltip.gridEvents(this.gridPanel);
            this._rendered = true;
            cm = null;
        },
        doRenderData: function(e){
            if(!e || e.cached !== true) {
                this.renderRange = null;
                this.growedRowCount = 0;
                this._redoRenderDataOptions = {};
                this._temporaryGrowedCount = null;
                this.renderBody(this.getRenderBody(true), {ignoreEvent : true});
                this.getRenderRange();
                this.setLastGrowed();
                for (var i = 0, len = this.columnModel.getColumnCount(true); this._rendered && i < len; i++) {
                    var column = this.columnModel.getColumnAt(i, true);
                    if(column.editor && column.editor.dataSet) {
                        var isCheck = false;
                        if(this.renderRange && column.field) {
                            for (var j = this.renderRange.visibleStart ; j <= this.renderRange.visibleEnd; j++) {
                                if(this.dataSet.getNameValue(j, column.field)) {
                                    isCheck = true;
                                    break;
                                }
                            }
                        }
                        if(isCheck === true && column.editor.dataSet.isLoad !== true) {
                            this.redoRenderData({ resetScroll: true, isDataChanged: true, renderCheckFirst: true });
                            return;
                        }
                    }
                }
                this.renderBody(this.getRenderBody());
                if(this.plugins) {
                    for (var i = 0, len = this.plugins.length; i < len; i++) {
                        this.plugins[i].updatePlugin({ isRendered: true });
                    }
                }
                if(!this.scroller)
                    this.makeScroll(true);
                if(this.pagerMode == 'scroll') {
                    if(this.pager.loadDataSetByPager === false) this.resetScroller();
                } else {
                    this.resetScroller();
                }
                this.updateHeaderSize();
                this.syncHeaderScroll();
                var e = {scrollbarXSize: 0, scrollbarYSize: 0};
                if(this.scroller){
                    e.scrollbarXSize = this.scroller.existScrollbar(true) ? Rui.ui.LScroller.SCROLLBAR_SIZE : 0;
                    e.scrollbarYSize = this.scroller.existScrollbar() ? Rui.ui.LScroller.SCROLLBAR_SIZE : 0;
                }
                var rows = this.getRows();
                if(rows.length > 0) {
                    var h = this.getRowHeight(rows[0]);
                    if(h > 0) {
                        this.webStorage.set('DEFAULT_ROW_HEIGHT', h);
                    } else {
                        h = this.webStorage.get('DEFAULT_ROW_HEIGHT', 27);
                    }
                    GV.DEFAULT_ROW_HEIGHT = h;
                }
                this.fireEvent('renderData', e);
            }
            if(this.el.isMask() && this.dataSet.isLoad)
                this.hideLoadingMessage();
        },
        redoRenderData: function(options){
            if(!this._rendered || this.syncDataSet !== true) return;
            options = options || {system: false};
            Rui.applyObject(this._redoRenderDataOptions, options);
            if(!this.delayRRD && options.system !== true && this.renderDataTime > 0) {
                this.delayRRD = Rui.later(this.renderDataTime, this, this._redoRenderData, null, true);
            }else if(options.system === true || this.renderDataTime < 1)
                this._redoRenderData.call(this);
        },
        _redoRenderData: function() {
            try {
                this.delayEditorRender = this.delayEditorRender || 0;
                if(!this.isDelayEditorRender) {
                    var compTime1 = new Date() - this.modifiedDate;
                    if (compTime1 < 5000) {
                        for (var i = 0, len = this.columnModel.getColumnCount(true); this.delayEditorRender < 300 && i < len; i++) {
                            var column = this.columnModel.getColumnAt(i, true);
                            if(column.editor && column.editor.dataSet) {
                                var isCheck = false;
                                if(this.renderRange && column.field) {
                                    for (var j = this.renderRange.visibleStart ; j <= this.renderRange.visibleEnd; j++) {
                                        if(this.dataSet.getNameValue(j, column.field)) {
                                            isCheck = true;
                                            break;
                                        }
                                    }
                                }
                                if(isCheck === true && column.editor.dataSet.isLoad !== true) {
                                    return; 
                                }
                            }
                        }
                    }
                    this.isDelayEditorRender = true;
                }
                var opt = this._redoRenderDataOptions,
                    compTime = new Date() - this.modifiedDate;
                if (compTime < this.renderDataTime && opt.system !== true) {
                    Rui.log('ignore');
                    return; 
                }
                if(this.delayRRD)
                    this.delayRRD.cancel();
                this.delayRRD = null;
                if((this.irregularScroll && opt.isDataChanged) || opt.renderCheckFirst === true || (this.getDataCount() > 0 && this.getRows().length < 1)){
                    if(opt.resetScroll === true){
                        this.growedRowCount = 0;
                        this._temporaryGrowedCount = null;
                    }
                    this.renderBody('', {ignoreEvent : true});
                    this.renderBody(this.getRenderBody(true), {ignoreEvent : true});
                    this.getRenderRange();
                    if(this.renderRange)
                        this.setLastGrowed();
                }else{
                    if(opt.resetScroll === true){
                        this.setLastGrowed();
                    }
                }
                this.renderBody(this.getRenderBody());
                if(this.el.isMask() && this.dataSet.isLoad)
                    this.hideLoadingMessage();
                if(opt.resetScroll === true){
                    this.resetScroller();
                }
                this.syncHeaderScroll();
                if(this.plugins) {
                    for (var i = 0, len = this.plugins.length; i < len; i++) {
                        this.plugins[i].updatePlugin({ isDataChanged: opt.isDataChanged, resetScroll: opt.resetScroll });
                    }
                }
                this._redoRenderDataOptions = {};
                if(this.scroller && this.scroller.scrollEl) {
                    if (Rui.rightToLeft()) {
                        if (this.headerEl.dom.scrollLeft >= 0) 
                            this.scroller.syncScrollLeft(); 
                    }
                    else {
                        if (this.headerEl.dom.scrollLeft > 0) 
                            this.scroller.syncScrollLeft();
                    }  
                }
                this.fireEvent('renderData', { 
                    scrollXSize: this.scroller.existScrollbar(true) ? Rui.ui.LScroller.SCROLLBAR_SIZE : 0,
                    scrollYSize: this.scroller.existScrollbar() ? Rui.ui.LScroller.SCROLLBAR_SIZE : 0
                });
            } catch(e) {
                Rui.log('error : '+ e.message);
            } finally {
            }
        },
        setSyncDataSet: function(isSync) {
            this.cfg.setProperty('syncDataSet', isSync);
            if(isSync) this.doRenderData();
        },
        isSyncDataSet: function() {
            return this.syncDataSet;
        },
        getMinColumnWidth: function(idx){
            if(idx) {
                return this.cm.getColumnAt(idx, true).getMinWidth() || this.minColumnWidth;
            } else {
                return this.minColumnWidth;
            }
        },
        getRenderBody: function(checkRowHeight, redoRender, renderRange) {
            var cm = this.columnModel;
            var ts = this.templates || {};
            var rowCount = this.getDataCount();
            var rows1 = '';
            var rows2 = '';
            if(this.headerEl) {
                var headerUl = this.headerEl.dom.childNodes[0].childNodes[0];
                this.firstWidth = parseFloat(Rui.util.LString.simpleReplace(Rui.get(headerUl.childNodes[0].childNodes[0]).getStyle('width'), 'px', '').trim(), 10);
                this.lastWidth = parseFloat(Rui.util.LString.simpleReplace(Rui.get(headerUl.childNodes[1].childNodes[0]).getStyle('width'), 'px', '').trim(), 10);
            }
            if (checkRowHeight === true) {
                delete this.cellMergeInfoSet;
                var record;
                var irregularFieldIndex = this.columnModel.getIndexById(this.irregularField);
                if(this.irregularScroll && irregularFieldIndex > -1){
                    var count = Math.min(rowCount, 2000);
                    for (var i = 0; i < rowCount; i++){
                        record = this.getRowRecord(i);
                        rows2 += this.getRenderRow(i, record, rowCount, false, false, irregularFieldIndex);
                    }
                }else{
                    record = this.getRowRecord(0);
                    if(record)
                        rows2 = this.getRenderRow(0, record, rowCount, false, false);
                    record = this.getRowRecord(1);
                    if(record)
                        rows2 += this.getRenderRow(1, record, rowCount, false, false);
                }
                record = null;
            }else{
                if(!renderRange){
                    if(redoRender !== true){
                        renderRange = this.getRenderRange();
                    }else{
                        renderRange = this.renderRange;
                    }
                }
                if (renderRange) {
                    var sIdx = renderRange.start;
                    var eIdx = renderRange.end + 1;
                    if(this.pagerMode) {
                        sIdx = 0;
                        eIdx = this.getDataCount() > 10 ? 10 : this.getDataCount();
                    }
                    var sumAfterRow = 0;
                    renderRange.afterRows = {};
                    var afterRows = renderRange.afterRows;
                    if(cm.isSummary())
                        this.summaryInfos = this.getSummaryInfos();
                    for (var idx = 0, row = sIdx; row < eIdx; row++, idx++) {
                        var record = this.getRowRecord(row);
                        if(!record) debugger;
                        var afterRowsInfo = this.getAfterRowInfo(row, record, rowCount, true);
                        var visibleRow = (row - sIdx) + sumAfterRow;
                        afterRows[(row - sIdx)] = { visibleRow: visibleRow, afterRow: sumAfterRow, afterRowsInfo: afterRowsInfo };
                        if(afterRowsInfo){
                            sumAfterRow += afterRowsInfo.idColumnCount;
                        }
                        record = afterRowsInfo = null;
                    }
                    var mergeInfos = null;
                    if(this.getColumnModel().isMerged()){
                        mergeInfos = Rui.ui.grid.LCellMerge.getCellMergeInfo(cm, renderRange);
                        if(this.selectionMergedCell === true){
                            var selectedRow = this.dataSet.rowPosition;
                            var renderedRow = this.getRenderedRow(selectedRow);
                            var mergeColInfos = mergeInfos[renderedRow],
                            mergeColInfo;
                            if(mergeColInfos){
                                for (var col = 0, len = mergeColInfos.length; col < len ; col++){
                                    mergeColInfo = mergeColInfos[col];
                                    if(mergeColInfo.rowspan < 0){
                                        mergeInfos[selectedRow + mergeColInfo.rowspan][col].cls = 'L-grid-merged-cell-selected';
                                    }
                                    mergeColInfo = null;
                                }
                            }
                            mergeColInfos = null;
                        }
                        this.cellMergeInfoSet = mergeInfos;
                    }
                    var i = 0;
                    for (var idx = 0, row = sIdx; row < eIdx; row++, idx++) {
                        var record = this.getRowRecord(row);
                        var isMerge = mergeInfos ? mergeInfos[i] : undefined;
                        var afterRowsInfo = afterRows[(row - sIdx)].afterRowsInfo;
                        if(cm.freezeIndex > -1) {
                            rows1 += this.getRenderRow(row, record, rowCount, true, isMerge);
                            if(this.isAfterRenderRow || afterRowsInfo)
                                rows1 += this.getAfterRenderRow(row, record, rowCount, true, isMerge, afterRowsInfo);
                        }
                        rows2 += this.getRenderRow(row, record, rowCount, false, isMerge);
                        if(this.isAfterRenderRow || afterRowsInfo){
                            rows2 += this.getAfterRenderRow(row, record, rowCount, false, isMerge, afterRowsInfo);
                        }
                        i++;
                        record = afterRowsInfo = null;
                    }
                    mergeInfos = afterRows = null;
                    this.renderRange.afterRows = renderRange.afterRows;
                }
            }
            var tstyle1 = 'width:' + this.firstWidth + 'px;';
            var tstyle2 = 'width:' + this.lastWidth + 'px;';
            if(cm.freezeIndex > -1) {
                this.marginLeft = cm.getFirstColumnsWidth(true);
                tstyle2 += 'margin-left:' + this.marginLeft + 'px';
            }
            var listyle = '';
            if(this.headerHeight)
                listyle = 'top:' + this.headerHeight + 'px';
            try {
                return ts.body.apply({ listyle: listyle, rows1: rows1, tstyle1: tstyle1, rows2: rows2, tstyle2: tstyle2 });
            } finally {
                ts = cm = null;
            }
        },
        renderBody: function(bodyHtml,option) {
            option = option || {};
            this.bodyEl.html(bodyHtml);
            this.updateIrregularMinMaxSize();
            this.doEmptyDataMessage();
            if(option.ignoreEvent !== true) {
                this.renderBodyEvent.fire();
            }
            option = null;
        },
        updateIrregularMinMaxSize: function(){
            if(this.irregularScroll !== true)
                return;
            var rows = this.getRows(),
                len = rows.length, 
                h, min = 0, max = 0;
            if(len < 1) return;
            min = this.minRowHeight || this._getRowHeight(rows[0]);
            max = this.maxRowHeight || min;
            for (var i = 0; i < len; i++){
                h = this._getRowHeight(rows[i]);
                if(h < min) min = h;
                if(h > max) max = h;
            }
            this.minRowHeight = min;
            this.maxRowHeight = Math.min(max, this.scroller.getScrollHeight());
        },
        moveYScroll: function(row){
            if(row < 0 || !this.renderRange) return;
            var rr = this.renderRange,
                scroller = this.scroller,
                visibleRow = row > -1 ? this.getVisibleRow(row) : 0,
                lastGrowed = (rr.rowCount - (rr.visibleEnd - rr.visibleStart) - 1) <= row ? true : false,
                growedCount = lastGrowed ? this.getLastGrowedCount() : this.getFirstGrowedCount(),
                visibleStart = 0, visibleEnd;
            visibleStart = rr.visibleStart;
            visibleEnd = growedCount > 0 ? rr.visibleStart + (growedCount-1) : rr.visibleEnd;
            if (visibleStart > visibleRow) {
                if (visibleRow === 0)
                    scroller.goStart();
                else
                    scroller.go(visibleRow);
            } else if (visibleEnd < visibleRow) {
                var startRow, expactRow;
                if(this.columnModel.isSummary()){
                    startRow = this.getVisibleStartRowForSubSumOf(row);
                }else if(this.irregularScroll){
                    startRow = row;
                }else{
                    startRow = visibleRow - (visibleEnd-visibleStart);
                }
                if(this.irregularScroll === true){
                    var rows = this.getRows(),
                        visibleRowId = this.dataSet.getAt(visibleRow).id,
                        m, i;
                    for (i = rows.length-1; i >= 0; i--){
                        row = rows[i];
                        m = row.className.match(this.rowRe);
                        if (m && m[1] && m[1] == visibleRowId.substring(1)) {
                            break;
                        }
                    }
                    if(i > -1){
                        expactRow = this._getExpectedStartRow(rows, rows.length - (i + 1));
                        startRow = this.findRow(rows[expactRow]);
                        if(startRow == -1){
                            while (expactRow++){
                                startRow = this.findRow(rows[expactRow]);
                                if(startRow !== -1){
                                    break;
                                }
                            }
                        }
                    }
                }
                scroller.go(startRow);
            } else {
                if (visibleEnd === visibleRow){
                    var scrollerEl = this.getScrollerEl();
                    var rowDom = this.getRowDom(row);
                    if(rowDom && rowDom.offsetTop + rowDom.offsetHeight > scrollerEl.getHeight(true)){
                        var startRow;
                        if(this.columnModel.isSummary()){
                            startRow = this.getVisibleStartRowForSubSumOf(row);
                        }else{
                            startRow = visibleRow - (visibleEnd-visibleStart) + 1;
                        }
                        scroller.go(startRow);
                    }
                }else if(this.irregularScroll && visibleEnd > visibleRow){
                    var rows = this.getRows(),
                        len = rows.length,
                        scrollHeight = this.scroller.getScrollHeight(),
                        h = 0, i = 0;
                    for (; i < len; i++){
                        h += this._getRowHeight(rows[i]);
                        if(this.findRow(rows[i]) >= visibleRow) break;
                    }
                    if(h > scrollHeight)
                        scroller.go(visibleRow);
                }
            }
            rr = scroller = null;
        },
        getVisibleStartRowForSubSumOf: function(endRow){
            var startRow = 0,
                scrollHeight = this.getScrollerEl().getHeight(true),
                rowHeight = this.getRowHeight(),
                visibleRowCount = this.getVisibleRowCount(true, rowHeight),
                rowCount = this.getDataCount(),
                row = endRow - visibleRowCount,
                idx = 0, afterRowsInfo, cumAfterRows = 0,
                afterRows = [],
                s = 0, len;
            if(row < 1)
                row = 0;
            start = row;
            for (; row <= endRow; row++){
                afterRowsInfo = this.getAfterRowInfo(row, this.getRowRecord(row), rowCount, true);
                idx = row - start;
                afterRows[idx + cumAfterRows] = row;
                for (s = 0, len = afterRowsInfo && afterRowsInfo.currentSumRows ? afterRowsInfo.currentSumRows.length : 0; s < len; s++)
                    afterRows[idx + cumAfterRows + s + 1] = -1;
                cumAfterRows += len;
            }
            row = afterRows.length - Math.floor(scrollHeight / rowHeight);
            startRow = afterRows[row];
            if(startRow === -1){
                for (len = afterRows.length; row++ < len;){
                    startRow = afterRows[row];
                    if(startRow !== -1){
                        break;
                    }
                }
            }
            return startRow;
        },
        moveXScroll: function(cellDom, col){
            var cm = this.columnModel,
                scrollerEl = this.getScrollerEl(),
                targetEl = Rui.get(cellDom),
                topLeft = scrollerEl.getVisibleScrollXY(targetEl, true, true, this.marginLeft, !!this.scroller);
            if(topLeft && !Rui.isEmpty(topLeft.left) && topLeft.left >= 0)
                if(this.scroller && (cm.freezeIndex < 0 || cm.freezeIndex < col)) {
                    this.scroller.setScrollLeft(col > 0 ? topLeft.left : 0);
                    if(this.gridPanel && this.gridPanel.currentCellEditor && this.gridPanel.currentCellEditor.isShow()) {
                        Rui.later(this.renderDataTime + 10, this, function(e){
                            var sm = this.gridPanel.getSelectionModel();
                            this.gridPanel.startEditor(sm.getRow(), sm.getCol());
                        });
                    }
                }
            cm = scrollerEl = targetEl = null;
        },
        getCellXY: function(cellDom){
            var xy = !Rui.isEmpty(cellDom) ? Rui.get(cellDom).getXY() : this.scrollerEl.getXY();
            cellDom = null;
            return {x: xy[0], y: xy[1]};
        },
        getScrollerEl: function() {
            return this.scroller ? this.scroller.scrollEl : this.scrollerEl;
        },
        getScroller: function() {
            return this.scroller;
        },
        getRowDom: function(row, index) {
            row = this.getRenderedRow(row);
            if(row !== null && row !== -1) {
                try {
                    var rows = this.getRows(index);
                    if(this.renderRange) {
                        var afterRows = this.renderRange.afterRows;
                        if(afterRows[row]) {
                            return rows[afterRows[row].visibleRow];
                        } else
                            return rows[row];
                    } else
                        return rows[row];
                } finally {
                    afterRows = null;
                }
            }
            return row === null ? row : this.getRows(index)[row];
        },
        getRenderedRow: function(row){
            if(!this.renderRange) return null;
            row = row - this.renderRange.start;
            if(row < 0) return null;
            return row;
        },
        showLoadingMessage: function(){
            this.el.mask();
        },
        hideLoadingMessage: function() {
            this.el.unmask();
        },
        doEmptyDataMessage: function() {
            if(this.getDataCount() == 0) {
                if(this.dataSet.isLoad === true) this.showEmptyDataMessage();
            } else {
                this.hideEmptyDataMessage();
            }
        },
        getIrregularRowHeight: function(max){
            if(this.irregularScroll === true)
                return max ? this.maxRowHeight : this.minRowHeight || this.getRowHeight();
            return this.getRowHeight();
        },
        getRowHeight: function(){
            var rows = this.getRows(), h = 0;
            try{
                if(rows.length > 0)
                    h = this._getRowHeight(rows[rows.length -1]);
                if(h < 1)
                    h = GV.DEFAULT_ROW_HEIGHT;
                if(!this._cacheRowHeight || (h > 0 && this._cacheRowHeight != h))
                    this._cacheRowHeight = h;
                h = this._cacheRowHeight;
                return h;
            }finally{
                rows = null;
            }
        },
        _getRowHeight: function(row){
            if(Rui.browser.msie)
                return row.cells[row.cells.length -1].offsetHeight;
            else
                return row.offsetHeight;
        },
        getVisibleRow: function(row) {
            return row;
        },
        getVisibleRowCount: function(excludeOver, rowHeight){
            var vrc = this._getVisibleRowCount(rowHeight);
            return (vrc < 1) ? 0 : (excludeOver === true ? Math.floor(vrc) : Math.ceil(vrc));
        },
        _getVisibleRowCount: function(rowHeight){
            var h = this.scroller ? this.scroller.getScrollHeight() : this.scrollerEl.getHeight(),
                rh = rowHeight || this.getRowHeight();
            if(h > 0)
                this._cacheHeight = h;
            h = this._cacheHeight || 0;
            return rh > 0 ? h / rh : 0;
        },
        getRenderRange: function(isUp){
            var renderRange,
                scroller = this.scroller,
                visibleRowCount, renderRowCount, rowCount = this.getDataCount(),
                realRowCount,
                startIndex = 0, endIndex = 0;
            if(rowCount > 0) {
                realRowCount = rowCount + (this.growedRowCount || 0);
                visibleRowCount = this._getVisibleRowCount(this.getIrregularRowHeight(false));
                renderRowCount = Math.ceil(visibleRowCount);
                visibleRowCount = Math.floor(visibleRowCount);
                startIndex = scroller ? scroller.getStartRow() : 0;
                startIndex = startIndex >= 0 ? startIndex : 0;
                if(visibleRowCount > realRowCount || startIndex > rowCount-1)
                    startIndex = 0;
                endIndex = (renderRowCount == 0 ? startIndex : startIndex + (renderRowCount-1));
                if(endIndex > realRowCount)
                    endIndex = realRowCount - this.growedRowCount -1;
                if(endIndex > (rowCount-1)){
                    endIndex = (rowCount-1);
                }
                var visibleEnd = endIndex;
                if(realRowCount > visibleRowCount)
                    visibleEnd = endIndex + (visibleRowCount !== renderRowCount ? -1 : 0);
                    if((rowCount - startIndex) < (visibleRowCount - 3)) {
                    	endIndex = rowCount - 1;
                    	if(endIndex < 0) endIndex = 0;
                    	visibleEnd = endIndex;
                    }
                renderRange = {
                    start: startIndex,
                    end: endIndex,
                    visibleStart: startIndex,
                    visibleEnd: visibleEnd,
                    rowCount: rowCount,
                    visibleRowCount: visibleRowCount,
                    afterRows: {}
                };
                if(this.pagerMode === 'scroll') {
                    renderRange.start = renderRange.visibleStart = 0;
                    if(renderRange.end > this.pager.pageSize)
                        renderRange.end = renderRange.visibleEnd = this.pager.pageSize;
                }
            } else {
                renderRange = null;
            }
            this.renderRange = renderRange;
            try {
                return renderRange;
            } finally {
               oldRange = renderRange = null;
            }
        },
        getCellDom: function(row, col) {
            var index = 1;
            if(this.columnModel.freezeIndex > -1)
                index = (col <= this.columnModel.freezeIndex) ? 0 : 1;
            if(this.isVirtualScroll && this.cellMergeInfoSet && this.getColumnModel().isMerged() && col > 0){
                renderedRow = this.getRenderedRow(row);
                if(renderedRow == null)
                    return null;
                var frontCache = row - renderedRow;
                var mergeInfos = this.cellMergeInfoSet;
                var mergeColInfos = mergeInfos[renderedRow];
                if(mergeColInfos == null)
                    return null;
                var mergeColInfo = mergeColInfos[col];
                var r = renderedRow;
                if(mergeColInfo.rowspan < 0){
                    r += mergeColInfo.rowspan;
                }
                mergeColInfos = mergeInfos[r];
                var mergedColCount = 0;
                for (var c = 0, len = Math.min(mergeColInfos.length, col+1); c < len; c++){
                    mergeColInfo = mergeColInfos[c];
                    if(mergeColInfo.colspan < 0 || mergeColInfo.rowspan < 0){
                        mergedColCount++;
                    }
                    mergeColInfo = null;
                }
                col = col - mergedColCount;
                row = r + frontCache;
                mergeInfos = mergeColInfos = null;
            }
            var rowDom = this.getRowDom(row, index);
            if(rowDom == null) return null;
            try {
                return this.getRowCellDom(rowDom, row, col);
            } finally {
                rowDom = null;
            }
        },
        getRowCellDom: function(rowDom, row, col) {
            var freezeIndex = this.columnModel.freezeIndex;
            	var mergedColCount = 0;
                if(this.cellMergeInfoSet && this.getColumnModel().isMerged()){
                    var renderedRow = this.getRenderedRow(row);
                    if(renderedRow != null){
                        var mergeColInfos = this.cellMergeInfoSet[renderedRow];
                        if(mergeColInfos){
                            var len = Math.min(col, mergeColInfos.length);
                            for (var c = 0; c < len; c++){
                                mergeColInfo = mergeColInfos[c];
                                if(mergeColInfo.colspan < 0 || mergeColInfo.rowspan < 0){
                                	if(freezeIndex > -1 && c <= freezeIndex) continue;
                                    mergedColCount++;
                                }
                                mergeColInfo = null;
                            }
                        }
                        mergeColInfos = null;
                    }
                }
                if(this.columnModel.freezeIndex > -1 && col > this.columnModel.freezeIndex)
                    col = col - (freezeIndex + 1) - mergedColCount;
                else
                    col = col - mergedColCount;
            try {
                return rowDom.cells[col];
            } finally {
                rowDom = null;
            }
        },
        getCell: function(dom, x) {
            try {
                if(dom.className) {
                    var m = dom.className.match(this.cellRe);
                    if(m && m[1]){
                        var idx = this.columnModel.getIndexById(m[1], true);
                        if(idx == -1)
                            return false;
                        if(this.columnModel.isMerged() && x){
                            if(dom.colSpan > 1){
                                var headerCells = this.getHeaderCellEls(),
                                    headerCell,
                                    scrollX = this.scroller ? this.scroller.getScrollLeft() : 0;
                                for (var i = idx, len = headerCells.length; i < len; i++){
                                    headerCell = headerCells.getAt(i);
                                    var offsetLeft = headerCell.dom.offsetLeft,
                                        freezedIndex = this.columnModel.freezeIndex;
                                    if(freezedIndex > -1 && freezedIndex < i){
                                        offsetLeft += this.marginLeft;
                                    }
                                    offsetLeft += this.el.getLeft();
                                    if(offsetLeft >= x + scrollX){
                                        idx = i-1;
                                        break;
                                    }
                                    headerCell = null;
                                }
                                headerCells = null;
                            }
                        }
                        return idx;
                    }
                }
                return false;
            } finally {
                dom = null;
            }
        },
        getHeaderCellEl: function(colIndex) {
            var column = this.columnModel.getColumnAt(colIndex, true);
            var cellElList = null;
            try {
                if(column) {
                    cellElList = this.headerEl.select('.L-grid-cell-' + column.getId());
                    if(cellElList.length > 0)
                        return cellElList.getAt(0);
                }
                return null;
            } finally {
                cellElList = null;
                column = null;
            }
        },
        getHeaderEl: function() {
            return this.headerEl;
        },
        findHeaderCell: function(dom, x) {
            return this.findCell(dom, x, GV.CLASS_GRIDVIEW_HEADER_CELL);
        },
        findRow: function(dom, y, isMerge) {
            var r = this.findRowDom(dom, y, isMerge);
            if(r && r.className) {
                var m = r.className.match(this.rowRe);
                if (m && m[1]) {
                    var idx = this.dataSet.indexOfKey('r' + m[1]);
                    return idx == -1 ? false : idx;
                } else -1;
            } else
                return -1;
        },
        findCell: function(dom, x, requiredCls) {
            var cellDom = this.findCellDom(dom);
            try {
                if(cellDom && (!requiredCls || Dom.hasClass(cellDom, requiredCls))){
                    var cellIndex = this.getCell(cellDom, x);
                    return cellIndex;
                }
                return -1;
            } finally {
                cellDom = null;
            }
        },
        findRowDom: function(dom, y, isMerge) {
            isMerge = Rui.isUndefined(isMerge) ? true : isMerge;
            var rDom = Dom.findParent(dom, this.rowSelector, 10),
                cDom, cy, gap, h, _dom, i;
            try {
                if(rDom && this.columnModel.isMerged() && isMerge){
                    cDom = this.findCellDom(dom);
                    if(cDom && cDom.rowSpan > 1){
                        h = Rui.get(rDom).getHeight();
                        if(Rui.browser.msie){
                            _dom = rDom.getElementsByTagName('td')[rDom.cells.length -1];
                            h = Rui.get(_dom).getHeight();
                        }
                        if(h == 0) return rDom;
                        cy = Dom.getXY(cDom)[1];
                        gap = y - cy;
                        for (i = 1; i < cDom.rowSpan; i++){
                            if(h > gap) break;
                            rDom = Dom.getNextSibling(rDom);
                            h += Rui.get(rDom).getHeight();
                        }
                    }
                }
                return rDom;
            } finally {
                rDom = cDom = _dom = null;
            }
        },
        findCellDom: function(dom){
            return Dom.findParent(dom, this.cellSelector, this.cellSelectorDepth);
        },
        findHeaderCellDom: function(dom) {
            var cellDom = this.findCellDom(dom);
            try {
                if(cellDom && Dom.hasClass(cellDom, GV.CLASS_GRIDVIEW_HEADER_CELL)){
                    return cellDom;
                }
                else {
                    return null;
                }
            } finally {
                cellDom = null;
            }
        },
        doSortField: function(colIndex) {
            if(this.selectionModel.isLocked()) return;
            var column = this.columnModel.getColumnAt(colIndex, true);
            var ds = this.dataSet;
            var field = column.field;
            if(column && column.isSortable() && field) {
                var dir = null;
                var hdCellEl = this.getHeaderCellEl(colIndex);
                var mSort = ds.multiSortable;
                ds.sortDirection = ds.sortDirection || {};
                if(hdCellEl && hdCellEl.hasClass(GV.CLASS_GRIDVIEW_HEADER_CELL) && field) {
                    dir = ds.sortDirection[field];
                    if(dir == 'asc') dir = 'desc';
                    else if(dir == 'desc') dir = '';
                    else dir = 'asc';
                    if(this.isRemoteSort === true || mSort !== true)
                        this.clearFieldSortClass();
                    if(dir == 'asc') {
                        hdCellEl.replaceClass(GV.CLASS_GRIDVIEW_SORT_DESC, GV.CLASS_GRIDVIEW_SORT_ASC);
                        if(Rui.useAccessibility()) hdCellEl.setAttribute('aria-sort', 'ascending');
                    } else if(dir == 'desc') {
                        hdCellEl.replaceClass(GV.CLASS_GRIDVIEW_SORT_ASC, GV.CLASS_GRIDVIEW_SORT_DESC);
                        if(Rui.useAccessibility()) hdCellEl.setAttribute('aria-sort', 'descending');
                    } else {
                        hdCellEl.removeClass([GV.CLASS_GRIDVIEW_SORT_ASC, GV.CLASS_GRIDVIEW_SORT_DESC]);
                        if(Rui.useAccessibility()) hdCellEl.setAttribute('aria-sort', '');
                    }
                    if(this.isRemoteSort !== true) {
                        var editor = column.editor;
                        if(editor && editor.rendererField) {
                            var rendererField = editor.rendererField;
                            if(this.autoMappingSortable && !ds.getFieldById(rendererField)) {
                                var editorDs = editor.getDataSet();
                                var mapData = {};
                                for (var i = 0, len =  ds.getCount(); i < len; i++) {
                                    var val = null;
                                    var code = ds.getAt(i).get(editor.valueField);
                                    if(Rui.isUndefined(mapData[code])) {
                                        var fRow = editorDs.findRow(editor.valueField, code);
                                        if(fRow > -1) {
                                            mapData[code] = editorDs.getAt(fRow).get(rendererField);
                                        }
                                    }
                                    ds.getAt(i).data[rendererField] = mapData[code];
                                }
                                editorDs = mapData = null;
                            }
                            delete ds.sortDirection[field];
                            if(this.customSortable !== true)
                                dir = ds.sortField(rendererField, dir);
                            delete ds.sortDirection[rendererField];
                        } else {
                            if(this.customSortable !== true)
                                dir = this.dataSet.sortField(field, dir);
                        }
                        editor = null;
                    }
                    if(dir) ds.sortDirection[field] = dir;
                    else delete ds.sortDirection[field];
                    this.sortField = field;
                    this.sortDir = dir;
                    this.fireEvent('sortField', {target:this, sortId: column.id, sortField:this.sortField, sortDir:this.sortDir, sortDirection: ds.sortDirection });
                }
                hdCellEl = null;
            }
            column = ds = field = null;
        },
        getLastSortInfo: function(){
            return {field : this.sortField, dir : this.sortDir};
        },
        clearFieldSortClass: function() {
            this.headerEl.select('.' + GV.CLASS_GRIDVIEW_SORT_ASC + ',.' + GV.CLASS_GRIDVIEW_SORT_DESC).removeClass([GV.CLASS_GRIDVIEW_SORT_ASC, GV.CLASS_GRIDVIEW_SORT_DESC]);
        },
        findFieldName: function(dom) {
            var fieldName = null;
            var cellDom = this.findHeaderCellDom(dom);
            if(cellDom) {
                var cns = cellDom.className.split(' ');
                Rui.util.LArray.each(cns, function(cn){
                    var prefix = GV.CLASS_GRIDVIEW_CELL + '-';
                    if(Rui.util.LString.startsWith(cn, prefix)) {
                        var name = cn.substring(prefix.length);
                        var field = this.dataSet.getFieldById(name);
                        if(field) {
                            fieldName = name;
                            return false;
                        }
                    }
                });
                cellDom = cns = null;
            }
            return fieldName;
        },
        addRowClass: function(row, className) {
            var rowDom = this.getRowDom(row, 1);
            if(rowDom) Dom.addClass(rowDom, className);
            if(this.columnModel.freezeIndex > -1) {
                rowDom = this.getRowDom(row, 0);
                if(rowDom) Dom.addClass(rowDom, className);
            }
            rowDom = null;
        },
        removeRowClass: function(row, className) {
            var rowDom = this.getRowDom(row, 1);
            if(rowDom) Dom.removeClass(rowDom, className);
            if(this.columnModel.freezeIndex > -1) {
                rowDom = this.getRowDom(row, 0);
                if(rowDom) Dom.removeClass(rowDom, className);
            }
            rowDom = null;
        },
        addCellClass: function(row, cell, className) {
            var cellDom = this.getCellDom(row, cell);
            if (cellDom) Dom.addClass(cellDom, className);
            cellDom = null;
        },
        removeCellClass: function(row, cell, className) {
            var cellDom = this.getCellDom(row, cell);
            if (cellDom) Dom.removeClass(cellDom, className);
            cellDom = null;
        },
        getCellAlt: function(row, cell) {
            var cellDom = this.getCellDom(row, cell);
            try {
                if (cellDom != null) return cellDom.title;
                else return null;
            } finally {
                cellDom = null;
            }
        },
        addCellAlt: function(row, cell, title) {
            var cellDom = this.getCellDom(row, cell);
            if (cellDom) cellDom.title = title;
            cellDom = null;
        },
        removeCellAlt: function(row, cell) {
            var cellDom = this.getCellDom(row, cell);
            if (cellDom != null) cellDom.title = '';
            cellDom = null;
        },
        setValue: function(row, col, html) {
            var currentCellDom = this.getCellDom(row, col);
            if(currentCellDom) {
                var divDom = document.createElement('div');
                divDom.innerHTML = '<table><tr>' + html + '</tr></table>';
                var tdDom = divDom.getElementsByTagName('td')[0];
                currentCellDom.parentNode.replaceChild(tdDom, currentCellDom);
                tdDom = divDom = null;
            }
            currentCellDom = null;
        },
        getValue: function(row, col) {
            var currentCellDom = this.getCellDom(row, col);
            try {
                return currentCellDom ? currentCellDom.innerHTML : null;
            } finally {
                currentCellDom = null;
            }
        },
        setRowValue: function(row, html) {
            var currentRowDom = this.getRowDom(row);
            if(currentRowDom) {
                var newRowDom = document.createElement('div');
                newRowDom.innerHTML = html;
                currentRowDom.innerHTML = newRowDom.firstChild.innerHTML;
                newRowDom = null;
                currentRowDom = null;
            }
        },
        getBodyEl: function() {
            return this.bodyEl;
        },
        getColumnModel: function() {
            return this.columnModel;
        },
        getBorderWidth: function() {
            return this.borderWidth;
        },
        focusRow: function(row, col) {
            if(this.scroller && (this.isFocus !== true || this.gridPanel.isEdit === true)) return;
            this.syncFocusRow(row, col);
            if (!this.delayTask) {
                this.delayTask = new Rui.util.LDelayedTask(function(){
                        if (this.isFocus === true) {
                            if(this.gridPanel.isEdit !== true) {
                                if(this.focusEl.isFocus !== true) {
                                    if(this.scroller) {
                                        try {
                                            var x = this.focusEl.getX();
                                            if (Rui.rightToLeft()) {
                                                if (this.scroller.scrollEl.getLeft() > x - 10) {
                                                    x = this.scroller.scrollEl.getLeft() + 10;
                                                    this.focusEl.setX(x);
                                                }
                                            } else {
                                                if (this.scroller.scrollEl.getRight() < x + 10) {
                                                    x = this.scroller.scrollEl.getRight() - 10;
                                                    this.focusEl.setX(x);
                                                }
                                            }
                                        } catch(e) {}
                                    }
                                    if(!Rui.platform.isMobile && window.isRuiBlur !== true) this.focusEl.focus();
                                }
                            }
                        }
                    this.delayTask = null;
                }, this);
                this.delayTask.delay(50);
            }
        },
        cancelViewFocus: function() {
            if(this.delayTask) {
                this.delayTask.cancel();
                this.delayTask = null;
            }
        },
        updateView: function() {
            var hiddenParentEl = this.el ? Rui.util.LDom.getHiddenParent(this.el) : null;
            if (hiddenParentEl) {
                hiddenParentEl = Rui.get(hiddenParentEl);
                hiddenParentEl.addClass('L-block-display');
                this.width = this.el.getWidth();
            }
            Rui.ui.grid.LBufferGridView.superclass.updateView.call(this);
            this.renderMaster(this.getRenderHeader());
            if (hiddenParentEl)
                hiddenParentEl.removeClass('L-block-display');
            if(this.headerEl)
                this.headerEl.unOnAll();
            if(this.scrollerEl)
                this.scrollerEl.unOnAll();
            if(this.bodyEl)
                this.bodyEl.unOnAll();
            if(this.focusEl)
                this.focusEl.unOnAll();
            if(this.resizeProxyEl)
                this.resizeProxyEl.unOnAll();
            if(this.ddProxyEl)
                this.ddProxyEl.unOnAll();
            if(this.ddTargetEl)
                this.ddTargetEl.unOnAll();
            this.headerEl = Rui.get(this.el.dom.childNodes[0]);
            this.headerOffsetEl = Rui.get(this.el.dom.childNodes[0].childNodes[0]);
            this.scrollerEl = Rui.get(this.el.dom.childNodes[1]);
            this.bodyEl = Rui.get(this.el.dom.childNodes[1].childNodes[0]);
            this.focusEl = Rui.get(this.scrollerEl.dom.childNodes[1]);
            this.focusEl.on('blur', function(e){
                this.isFocus = false;
            });
            this.resizeProxyEl = Rui.get(this.el.dom.childNodes[2]);
            this.ddProxyEl = Rui.get(this.el.dom.childNodes[3]);
            this.ddTargetEl = Rui.get(this.el.dom.childNodes[4]);
            this.headerEl.on('mouseover', this.onHeaderMouseOver, this, true);
            this.headerEl.on('mousemove', this.onHeaderMouseMove, this, true);
            this.headerEl.on('mouseout', this.onHeaderMouseOut, this, true);
            this.bodyEl.on('mouseover', this.onBodyMouseOver, this, true);
            this.bodyEl.on('mouseout', this.onBodyMouseOut, this, true);
            Rui.util.LEvent.removeListener(this.scrollerEl.dom,'scroll',this.onBodyScroll);
            Rui.util.LEvent.addListener(this.scrollerEl.dom,'scroll',this.onBodyScroll, this, true);
            if(this.headerTools && !Rui.ui.grid.LHeaderContextMenu) this.headerTools = false;
            if(this.headerTools) {
                var sorts = [];
                var filters = {};
                if(this.headerContextMenu) {
                    sorts = this.headerContextMenu.sorts;
                    filters = this.headerContextMenu.filters;
                    this.headerContextMenu.destroy();
                }
                this.headerContextMenu = new Rui.ui.grid.LHeaderContextMenu({gridView: this, headerToolOptions: this.headerToolOptions });
                this.headerContextMenu.render(this.el.dom);
                this.headerContextMenu.hide();
                this.headerContextMenu.sorts = sorts;
                this.headerContextMenu.filters = filters;
                sorts = filters = null;
            }
            this.headerCellsCache = null;
        },
        updateSizes: function(resize){
            var width = this.width;
            if ( width) {
                if(Rui.browser.msie67) {
                    this.headerEl.setStyle('width', width + 'px');
                    this.scrollerEl.setStyle('width', width + 'px');
                }
            }
            var scrollerHeight = 0;
            if (resize || (this.height && this.scrollerEl && this.scrollerEl.getHeight() + this.headerEl.getHeight() !== this.height)) {
                scrollerHeight = this.height - this.headerEl.getHeight();
                if(scrollerHeight > 0) {
                    this.scrollerEl.setHeight(scrollerHeight);
                    if(this.scroller) this.scroller.setHeight(scrollerHeight);
                }
            }
            if(this.el && this.el.getHeight() < 1)
                this.el.setStyle('height', '');
            if(this.plugins) {
                for (var i = 0, len = this.plugins.length; i < len; i++) {
                    this.plugins[i].updatePlugin({ isRendered: true });
                }
            }
            if(this.scroller && (scrollerHeight > 0 && this.scroller.getScrollHeight() < 1)) {
                this.scroller.refresh();
                this.redoRenderData({ resetScroll: true });
            }
        },
        syncFocusRow: function(row,col) {
            try{
                var cellDom = this.getCellDom(row, col);
                this.moveXScroll(cellDom, col);
                var xy = this.getCellXY(cellDom);
                if (xy.x != false) {
                    if (Rui.rightToLeft()) {
                        if(this.scroller.scrollEl.Left() < xy.x - 10)
                            xy.x = this.scroller.scrollEl.getLeft() + 10;
                    } else {
                        if(this.scroller.scrollEl.getRight() < xy.x + 10)
                            xy.x = this.scroller.scrollEl.getRight() - 10;
                    }
                    this.focusEl.setX(xy.x);
                }
                if(this.syncYFocusRow || !this.scroller){
                    if (xy.y != false) {
                        this.focusEl.setY(xy.y);
                    }
                }
            }catch(e) {};
        },
        focus: function() {
            this.onCheckFocus();
            if(!Rui.platform.isMobile) this.focusEl.focus();
        },
        blur: function() {
            Rui.getBody().focus();
        },
        getLi: function(col) {
            var idx = 1;
            var cm = this.columnModel;
            if(cm.freezeIndex > -1) {
                if(cm.freezeIndex > col)
                    idx = 0;
            }
            cm = null;
            return idx;
        },
        getFirstLiEl: function(isHeader) {
            var ul = null;
            if(isHeader)
                ul = this.getHeaderEl().dom.childNodes[0].childNodes;
            else
                ul = this.getBodyEl().dom.childNodes;
            try {
                if(ul && ul.length > 0)
                    return Rui.get(ul[0].childNodes[0]);
                return null;
            } finally {
                ul = null;
            }
        },
        getLastLiEl: function(isHeader) {
            var ul = null;
            if(isHeader)
                ul = this.getHeaderEl().dom.childNodes[0].childNodes;
            else
                ul = this.getBodyEl().dom.childNodes;
            try {
                if(ul)
                    return Rui.get(ul[0].childNodes[ul[0].childNodes.length - 1]);
                return null;
            } finally {
                ul = null;
            }
        },
        getRowRecord: function(row) {
            return this.dataSet.getAt(row);
        },
        getDataCount: function() {
            return (this.pagerMode === 'scroll') ? this.dataSet.getTotalCount() : this.dataSet.getCount();
        },
        getHeaderCellEls: function(){
            if(this.headerCellsCache){
                return this.headerCellsCache;
            }
            var cm = this.getColumnModel();
            var headerCells;
            if(!cm.isMultiheader()){
                headerCells = this.headerEl.select('.L-grid-header-cell');
            }else{
                var selectors = [];
                var columnCount = cm.getColumnCount(true);
                for (var i = 0; i < columnCount; i++){
                    var column = cm.getColumnAt(i, true);
                    selectors.push('.L-grid-cell-' + column.getId());
                    column = null;
                }
                headerCells = this.headerEl.select(selectors.join(', '));
            }
            cm = null;
            return this.headerCellsCache = headerCells;
        },
        updateColumnFit: function(colIdx) {
            var column = this.columnModel.getColumnAt(colIdx, true);
            if(!column) return;
            var rr = this.renderRange;
            if(!rr) return;
            var maxWidth = 0;
            for (var i = rr.start ; i <= rr.end; i++) {
                var row = this.getVisibleRow(i);
                var cellEl = Rui.get(this.getCellDom(row, colIdx));
                if(cellEl == null) continue;
                var innerEl = cellEl.select('.L-grid-cell-inner').getAt(0);
                var text = innerEl.dom.innerText || innerEl.dom.textContent;
                var widthEl = Rui.createElements('<span class="L-cell-width-temp">' + text + '</span>');
                this.el.appendChild(widthEl);
                var curWidth = widthEl.getWidth();
                if(curWidth > maxWidth) { maxWidth = curWidth; }
                widthEl.remove();
                widthEl = cellEl = innerEl = null;
            }
            column.setWidth(maxWidth + 25);
            column = rr = null;
        },
        updateColumnsAutoWidth: function(maxWidth) {
            maxWidth = maxWidth || this.gridPanel.width - Rui.ui.LScroller.SCROLLBAR_SIZE;
            this.columnModel.updateColumnsAutoWidth(maxWidth);
            this.redoRender();
        },
        updateEditable: function(editable) {
            if(this.gridPanel) editable ? this.el.addClass("L-editable") : this.el.removeClass("L-editable");
        },
        destroy: function () {
            this.doUnSyncDataSet();
            this.renderEvent.unOn(this.onRender, this);
            if(this.gridPanel)
                this.gridPanel.unOn('widthResize',this.onWidthResize, this);
            if(this.headerEl) {
                this.headerEl.remove();
                delete this.headerEl;
            }
            if(this.bodyEl) {
                this.bodyEl.remove();
                delete this.bodyEl;
            }
            if(this.headerContextMenu) this.headerContextMenu.destroy();
            Rui.ui.grid.LBufferGridView.superclass.destroy.call(this);
        },
        toString: function() {
            return 'Rui.ui.grid.LBufferGridView ' + this.id;
        }
    });
})();
(function() {
    var GV = Rui.ui.grid.LBufferGridView;
    var DBW = Rui.browser;
    Rui.applyObject(Rui.ui.grid.LBufferGridView.prototype, {
        createTemplate: function() {
            var ts = this.templates || {};
            if (!ts.master) {
                ts.master = new Rui.LTemplate(
                '<div class="L-grid-header" style="{hstyle}" id=\"{ghId}\">',
                    '<div class="L-grid-header-offset" style="{ostyle}" id=\"{ghoId}\">{header}</div>',
                    '<div class="L-grid-header-tool L-hide-display"><span class="L-grid-header-tool-icon"></span></div>',
                '</div>',
                '<div class="L-grid-scroller" style="{sstyle}" id=\"{gscrId}\">',
                    '<div class="L-grid-body L-grid-col-line" style="{bstyle}"></div><a class="L-grid-focus" tabIndex="-1" style="position:absolute;"></a>',
                '</div>',
                '<div class="L-grid-resize-proxy">&#160;</div>',
                '<div class="L-grid-dd-proxy"><div>&#160;</div></div>',
                '<div class="L-grid-dd-target">&#160;</div>'
                );
            }
            if (!ts.header) {
                ts.header = new Rui.LTemplate(
                '<ul class="L-grid-ul">',
                '<li class="L-grid-li-first">',
                '<table id=\"{ghftId}\" border="0" cellspacing="0" cellpadding="0" style="{tstyle1}" class="L-grid-header-table">',
                    '<thead>{hrow1}</thead>',
                '</table>',
                '</li>',
                '<li class="L-grid-li-last">',
                '<table id=\"{ghflId}\" border="0" cellspacing="0" cellpadding="0" style="{tstyle2}" class="L-grid-header-table">',
                    '<thead>{hrow2}</thead>',
                '</table>',
                '</li>',
                '</ul>'
                );
            }
            if (!ts.hrow) {
                ts.hrow = new Rui.LTemplate(
                '<tr class="L-grid-header-row {first_last}">{hcells}</tr>'
                );
            }
            if (!ts.hcell) {
                ts.hcell = new Rui.LTemplate(
                '<td id=\"{hcId}\" class="L-grid-header-cell L-grid-cell L-grid-cell-{id} {first_last} {hidden} {sortable} {css}" style="{style}" colspan="{colSpan}" rowSpan="{rowSpan}">',
                    '<div id=\"{hcInId}\" class="L-grid-header-inner L-grid-header-{id}" style="{istyle}">',
                        '<a id=\"{hcBtnId}\" class="L-grid-header-btn" >{value}</a><img id=\"{hcSrtId}\" src="' + Rui.getRootPath() + Rui.BLANK_IMAGE_URL + '" class="L-grid-sort-icon"/>',
                    '</div>',
                '</td>'
                );
            }
            if (!ts.hcellLabel) {
                ts.hcellLabel = new Rui.LTemplate(
                '<td id=\"{hcId}\" class="L-grid-header-cell L-grid-cell L-grid-cell-{id} {first_last} {css} " style="{style}" colspan="{colSpan}" rowSpan="{rowSpan}">',
                    '<div id=\"{hcInId}\" class="L-grid-header-inner L-grid-header-{id}" style="{istyle}">',
                        '<a id=\"{hcBtnId}\" class="L-grid-header-btn" >{value}</a>',
                    '</div>',
                '</td>'
                );
            }
            if (!ts.body) {
                ts.body = new Rui.LTemplate(
                '<ul class="L-grid-ul">',
                '<li class="L-grid-li-first" style="{listyle}">',
                '<table cellspacing="0" cellpadding="0" style="{tstyle1}">{rows1}</table>',
                '</li>',
                '<li class="L-grid-li-last">',
                '<table cellspacing="0" cellpadding="0" style="{tstyle2}">{rows2}</table>',
                '</li>',
                '</ul>'
                );
            }
            if (!ts.row) {
                var role = (Rui.useAccessibility()) ? 'role="row" {ariaAttr}' : '';
                ts.row = new Rui.LTemplate(
                    '<tr class="{className}" style="{rstyle}" ' + role + '>{rowBody}</tr>'
                );
            }
            if (!ts.rowBody) {
                ts.rowBody = new Rui.LTemplate(
                    '{cells}'
                );
            }
            if (!ts.cell) {
                var aria = (Rui.useAccessibility()) ? 'role="gridcell" {tabIndex} {ariaInvalid} ' : '';
                ts.cell = new Rui.LTemplate(
                    '<td id=\"{cId}\" class=\"L-grid-col L-grid-cell L-grid-cell-{id} {first_last} {hidden} {css} \" style=\"{style}\" colspan="{colspan}" rowspan="{rowspan}" ' + aria + ' >',
                        '<div id=\"{cInId}\" class=\"L-grid-cell-inner L-grid-col-{id}\" style="{istyle}">{bcell}{value}</div>',
                    '</td>'
                );
            }
            this.templates = ts;
            ts = null;
        },
        adjustColumnWidth: function(width){
            var borderWidth = this._getBorderWidth();
            return width + borderWidth > 0 ? width + borderWidth : 0;
        },
        _getBorderWidth: function(){
            return Rui.isBorderBox ? 0 : -this.borderWidth; 
        },
        getColumnWidth: function(column){
            return this.adjustColumnWidth(column.width);
        },
        getRenderHeader: function(columnId,hidden) {
            this.initColumn();
            return !this.columnModel.isMultiheader() ? this.getRenderBasicHeader() : this.getRenderMultiheader();
        },
        getRenderBasicHeader: function() {
            var ts = this.templates || {};
            var cm = this.columnModel;
            var columnCount = cm.getColumnCount(true);
            var hcells = '';
            for (var i = 0; i <= cm.freezeIndex; i++) {
                var column = cm.getColumnAt(i,true);
                hcells += this.getRenderCellBasicHeader(column, i, columnCount);
                column = null;
            }
            var hrowHtml1 = ts.hrow.apply({
                hcells: hcells,
                first_last: 'L-grid-header-row-first L-grid-header-row-last'
            });
            var freezeTotalWidth = cm.getFirstColumnsWidth(true);
            var tstyle1 = (cm.freezeIndex > -1) ? 'width:' + freezeTotalWidth + 'px;' : '';
            hcells = '';
            for (var i = cm.freezeIndex + 1; i < columnCount; i++) {
                var column = cm.getColumnAt(i,true);
                hcells += this.getRenderCellBasicHeader(column, i, columnCount);
                column = null;
            }
            var hrowHtml2 = ts.hrow.apply({
                hcells: hcells,
                first_last: 'L-grid-header-row-first L-grid-header-row-last'
            });
            var lastWidth = (cm.getLastColumnsWidth(true) - (cm.getLastColumnCount(true) - (this.borderWidth * 2))) || 1;
            var tstyle2 = 'width:' + lastWidth + 'px;';
            if(cm.freezeIndex > -1)
                tstyle2 += 'margin-left:' + freezeTotalWidth + 'px';
            var headerHtml = ts.header.apply({
                ghftId: Rui.useFixedId() ? 'LGrid-header-ft-' + this.gridId : Rui.id(),
                ghflId: Rui.useFixedId() ? 'LGrid-header-lt-' + this.gridId : Rui.id(),
                hrow1: hrowHtml1,
                tstyle1: tstyle1,
                hrow2: hrowHtml2,
                tstyle2: tstyle2
            });
            ts = null;
            cm = null;
            return headerHtml;
        },
        getRenderCellBasicHeader: function(column, i, columnCount) {
            var ts = this.templates || {};
            var first_last = (i == 0) ? 'L-grid-cell-first' : (i == columnCount - 1) ? 'L-grid-cell-last' : '';
            var colWidth = this.adjustColumnWidth(column.width);
            var style = 'width:' + colWidth + 'px;' + '';
            if(column.cellStyle)
                style += column.cellStyle + ';';
            var sortable = column.isSortable()? 'L-grid-cell-sortable' : '';
            var sortDir = '';
            if(column.field && this.dataSet.sortDirection) 
            	sortDir = this.dataSet.sortDirection[column.field];
            if (sortDir) sortable += ' L-grid-sort-' + sortDir;
            var css = [].concat(column.headerCss);
            var p = {
                id: column.id,
                hcId: Rui.useFixedId() ? 'LGridHeaderCell-' + this.gridId + '-' + column.id : undefined,
                hcInId: Rui.useFixedId() ? 'LGridHeaderCell-inner-' + this.gridId + '-' + column.id : undefined,
                hcBtnId: Rui.useFixedId() ? 'LGridHeaderCell-btn-' + this.gridId + '-' + column.id : undefined,
                hcSrtId: Rui.useFixedId() ? 'LGridHeaderCell-sort-' + this.gridId + '-' + column.id : undefined,
                first_last: first_last,
                style: style,
                sortable:sortable,
                value: column.getLabel(),
                css: css.join(' '),
                colSpan : '1',
                rowSpan : '1'
            };
            try {
                return ts.hcell.apply(p);
            } finally {
                column = null;
                css = null;
                ts = null;
            }
        },
        getRenderMultiheader: function() {
            this.useColumnDD = false;
            var cm = this.columnModel;
            var hrows1='',hrows2='',fwidth=0,lwidth=0,hInfos;
            if(cm.freezeIndex > -1){
                hInfos = cm.getMultiheaderInfos(0);
                hrows1 = this.getMultiheaderHtml(hInfos, 0);
                fwidth = cm.getFirstColumnsWidth(true);
                hInfos = cm.getMultiheaderInfos(1);
                hrows2 = this.getMultiheaderHtml(hInfos, 1);
                lwidth = cm.getLastColumnsWidth(true) - (cm.getLastColumnCount(true) - (this.borderWidth * 2));
            } else {
                hInfos = cm.getMultiheaderInfos();
                hrows2 = this.getMultiheaderHtml(hInfos, 1);
                lwidth = cm.getLastColumnsWidth(true) - (cm.getColumnCount(true) - (this.borderWidth * 2));
            }
            var tstyle2 = 'width:' + lwidth + 'px;';
            var freezeTotalWidth = cm.getFirstColumnsWidth(true);
            if(cm.freezeIndex > -1)
                tstyle2 += 'margin-left:' + freezeTotalWidth + 'px';
            var ts = this.templates || {};
            var html = ts.header.apply({
                ghftId: Rui.useFixedId() ? 'LGrid-header-ft-' + this.gridId : Rui.id(),
                ghflId: Rui.useFixedId() ? 'LGrid-header-lt-' + this.gridId : Rui.id(),
                hrow1 : hrows1,
                tstyle1 : 'width:' + fwidth + 'px;',
                hrow2 : hrows2,
                tstyle2: tstyle2
            });
            hInfos = null;
            cm = null;
            ts = null;
            return html;
        },
        getMultiheaderHtml: function(hInfos, liIndex) {
            var basicCm = this.columnModel.getBasicColumnModel();
            var cm = this.columnModel;
            var colInfos = hInfos.colInfos;
            var rowCount = hInfos.rowCount;
            var colCount = colInfos ? colInfos.length : 0;
            var colInfo,findDataCol,p;
            var first_last = '';
            var style = '';
            var sortable = '';
            var ts = this.templates || {};
            var sortDirection = this.dataSet.sortDirection;
            var rows = [];
            for (var i = 0; i < rowCount; i++) {
                rows.push('');
            }
            for (var i = 0; i < colCount; i++) {
                if (colInfos[i]) {
                    findDataCol = false;
                    for (var j = rowCount-1; j > -1; j--) {
                        colInfo = colInfos[i][j];
                        if (colInfo.exist) {
                            first_last = (i == 0) ? 'L-grid-cell-first' : (i == colCount - 1) ? 'L-grid-cell-last' : '';
                            if (!findDataCol) {
                                findDataCol = true;
                                var column = cm.getColumnById(colInfo.id);
                                if(!column)
                                    column = basicCm.getColumnById(colInfo.id);
                                width = this.adjustColumnWidth(column.width);
                                style = 'width:'+(column.width - this.borderWidth)+'px;';
                                if (column.cellStyle)
                                    style += column.cellStyle + ';';
                                sortable = column.isSortable() ? 'L-grid-cell-sortable' : '';
                                var sortDir = '';
                                if(column.field && sortDirection) 
                                	sortDir = sortDirection[column.field];
                                if (sortDir) sortable += ' L-grid-sort-' + sortDir;
                                var istyle = '';
                                var css = [].concat(column.headerCss);
                                css.push('L-grid-header-cell-type-data');
                                if(colInfo.rowspan > 1){
                                    css.push(' L-grid-cell-rowspan-' + colInfo.rowspan);
                                }
                                p = {
                                    id: colInfo.id,
                                    hcId: Rui.useFixedId() ? 'LGridHeaderCell-' + this.gridId + '-' + column.id : undefined,
                                    hcInId: Rui.useFixedId() ? 'LGridHeaderCell-inner-' + this.gridId + '-' + column.id : undefined,
                                    hcBtnId: Rui.useFixedId() ? 'LGridHeaderCell-btn-' + this.gridId + '-' + column.id : undefined,
                                    hcSrtId: Rui.useFixedId() ? 'LGridHeaderCell-sort-' + this.gridId + '-' + column.id : undefined,
                                    first_last: first_last,
                                    hidden: '',
                                    style: style,
                                    sortable: sortable,
                                    css: css.join(' '),
                                    value: column.label,
                                    colSpan : colInfo.colspan,
                                    rowSpan : colInfo.rowspan,
                                    istyle : istyle
                                };
                                rows[j] = rows[j] + ts.hcell.apply(p);
                                p = css = column = null;
                            }
                            else {
                                var columnIndex = (liIndex > 0) ? (cm.freezeIndex + i + 1) : i;
                                var innerWidth = this.getMultiHeaderInnerWidth(colInfo, columnIndex, j, colCount) - this.borderWidth;
                                innerWidth = innerWidth <= 0 ? 1 : innerWidth;
                                var column = cm.getColumnById(colInfo.id);
                                p = {
                                    id: colInfo.id,
                                    hcId: Rui.useFixedId() ? 'LGridHeaderCell-' + this.gridId + '-' + column.id : undefined,
                                    hcInId: Rui.useFixedId() ? 'LGridHeaderCell-inner-' + this.gridId + '-' + column.id : undefined,
                                    hcBtnId: Rui.useFixedId() ? 'LGridHeaderCell-btn-' + this.gridId + '-' + column.id : undefined,
                                    first_last: first_last,
                                    css: '',
                                    style: '',
                                    sortable: '',
                                    value: column.label,
                                    colSpan : colInfo.colspan,
                                    rowSpan : colInfo.rowspan,
                                    istyle: 'overflow: hidden;' 
                                };
                                rows[j] = rows[j] + ts.hcellLabel.apply(p);
                                p = null;
                            }
                        }
                        colInfo = null;
                    }
                }
            }
            var dummyCell = '';
            if(cm.makeDummyCell && this.makeDummyCell === undefined) {
                p = {
                        style: '',
                        istyle: 'overflow: hidden;width:0px;',
                        value: '',
                        css: 'L-grid-dummy-cell'
                    };
                dummyCell = ts.hcellLabel.apply(p);
                p = null;
            }
            var hrows= '';
            for (var i=0;i<rowCount;i++){
                first_last = (i == 0) ? 'L-grid-header-row-first' : (i == rowCount - 1) ? 'L-grid-header-row-last' : '';
                hrows += ts.hrow.apply({
                    hcells: rows[i] + dummyCell,
                    first_last:first_last
                });
            }
            var rowDummyCell ='';  
            if(cm.makeDummyCell && this.makeDummyCell === undefined){
                rowDummyCell = '<tr class="L-grid-row-dummy" >';
                var startCol = 0;
                var endCol = cm.getColumnCount(true) - 1;
                if(cm.freezeIndex > -1){
                    if(liIndex == 0) {
                        startCol = 0;
                        endCol = cm.freezeIndex;
                    } else {
                        startCol = cm.freezeIndex + 1;
                    }
                }
                for (var i = startCol; i <= endCol; i++) {
                    var column = cm.getColumnAt(i, true);
                    var width = this.adjustColumnWidth(column.width);
                    rowDummyCell += '<td class="L-grid-row-dummy-cell" style="width:' + width + 'px"></td>';
                    column = null;
                }
                rowDummyCell += '</tr>';
            }
            rows = ts = cm = basicCm = colInfos = null;
            return rowDummyCell + hrows;
        },
        getMultiHeaderInnerWidth: function(colInfo, colIdx, rowIdx, colCount) {
            var basicCm = this.columnModel.getBasicColumnModel();
            try {
                return this.adjustColumnWidth(basicCm.getColumnById(colInfo.id).width);
            } finally {
                basicCm = null;
            }
        },
        initColumn: function(){
            var columnCount = this.columnModel.getColumnCount();
            for (var i = 0 ; i < columnCount; i++) {
                var column = this.columnModel.getColumnAt(i);
                if(column.field) {
                    var field = this.dataSet.getFieldById(column.field);
                    if(!field) throw new Error('DataSet field name was not found! Column Field name is \'' + column.field + '\' [grid id: ' + this.gridPanel.id + ']');
                    column.type = field.type;
                }
                column = null;
            }
        },
        getRenderRow: function(row, record, rowCount, firstColumns, spans, checkFieldIndex) {
            var cm = this.columnModel;
            var ts = this.templates || {};
            var contentWidth = 0;
            if (cm.freezeIndex > -1) {
                contentWidth = (firstColumns) ? this.firstWidth : this.lastWidth;
            } else contentWidth = this.lastWidth;
            var className = this.getRenderRowClassName(row, record, rowCount, firstColumns);
            var rowBody = this.getRenderRowBody(row, record, contentWidth, firstColumns, spans, checkFieldIndex);
            var rstyle = 'width:' + contentWidth + 'px;';
            var pRow = {
                className: className,
                rowBody: rowBody,
                ariaAttr: this.getAriaAttr(row, record),
                rstyle: rstyle
            };
            try {
                return ts.row.apply(pRow);
            } finally {
                ts = cm = pRow = record = spans = null;
            }
        },
        getAriaAttr: function(row, record) {
            return '';
        },
        getSummaryInfos: function() {
            var idColumns = {};
            var sumColumns = {};
            var sums = [];
            var idColumnCount = 0;
            var cm = this.columnModel;
            for (var col = 0, len = cm.getColumnCount(true); col < len; col++) {
                var column = cm.getColumnAt(col, true);
                var summary = column.summary;
                if (summary) {
                    if(summary.ids) {
                        sums.push(summary);
                        for (var i = 0, iLen = summary.ids.length; i < iLen; i++) {
                            idColumns[summary.ids[i]] = true;
                            idColumnCount++;
                        }
                    }
                    var sumFn = (typeof summary.type === 'function') ? summary.type : GV.getSummaryFunction(summary.type || 'sum');
                    sumColumns[col] = {
                        col: col,
                        column: column,
                        sumType: sumFn
                    };
                }
                column = summary = null;
            }
            try {
                return { idColumns: idColumns, idColumnCount: idColumnCount, sumColumns: sumColumns, summarys: sums};
            } finally {
                cm = idColumns = sumColumns = sums = null;
            }
        },
        getAfterRowInfo: function(row, record, rowCount, firstColumns){
            var cm = this.columnModel, ds = this.dataSet, cnt = ds.getCount();
            var sums = [], currentSumRows;
            var afterRowsInfo = {};
            var si = this.summaryInfos, addSumCount = 0;
            if(cm.isSummary()) {
                sums = si.summarys;
                currentSumRows = [], depth = sums.length;
                for (var i = sums.length - 1; 0 <= i; i--) {
                    var ids = sums[i].ids;
                    var isAdd = false;
                    for (var j = 0, len = ids.length; j < len; j++) {
                        var currId = ids[j];
                        var v1 = record.get(currId);
                        if((row + 1) < cnt) {
                            var v2 = ds.getAt(row + 1).get(currId);
                            if(isAdd === false && String(v1) != String(v2)) {
                                depth = Math.min(depth, i);
                                isAdd = true;
                            }
                            if(isAdd) break;
                        }
                    }
                    if(isAdd) break;
                }
                if(row == rowCount - 1) depth = 0;
                var dupSums = {};
                for (var i = sums.length - 1; depth <= i && 0 <= i; i--) {
                	var ids = sums[i].ids;
                	for (var k = 0 ; k < ids.length; k++) {
                        if(!dupSums[ids[k]]) {
                            var currId = ids[k];
                            var v1 = record.get(currId);
                            var r2 = ds.getAt(row + 1);
                            var v2 = r2 ? r2.get(currId) : null;
                            if(String(v1) != String(v2)) {
                            	for (var l = ids.length - 1; l >= k; l--) {
                            		if(!dupSums[ids[l]]) {
                                        currentSumRows.push({ summary: sums[i], labelId: sums[i].labelId, label: sums[i].label, sumColId: ids[l] });
                                        dupSums[ids[l]] = true;
                                        addSumCount++;
                            		}
                            	}
                            }
                        }
                	}
                }
                var loopCnt = 0, dataRowCnt = 0;
                for (var j = 0, len = currentSumRows.length; j < len; j++) {
                    for (var k = currentSumRows[j].summary.ids.length - 1 ; k >= 0 ; k-- ) {
                        var currId = currentSumRows[j].sumColId;
                        var v1 = ds.getAt(row).get(currId);
                        for (var c = row; c >= 0; c--) {
                            var r = ds.getAt(c - 1);
                            dataRowCnt++;
                            if(!r || String(v1) != String(r.get(currId))) {
                                loopCnt++;
                                dataRowCnt = this.getBeforeDataRowCount(sums, row, currId, dataRowCnt);
                                if((len - k - 1) == j)
                                	currentSumRows[j].dataRowCnt = dataRowCnt;
                                dataRowCnt = 0;
                                break;
                            }
                        }
                    }
                }
                sums = null;
            }
            try {
                if(currentSumRows && currentSumRows.length > 0) {
                    afterRowsInfo.idColumns = si.idColumns;
                    afterRowsInfo.idColumnCount = addSumCount;
                    afterRowsInfo.currentSumRows = currentSumRows;
                    afterRowsInfo.sumColumns = si.sumColumns;
                    return afterRowsInfo;
                } else {
                    return null;
                }
            } finally {
                currentSumRows = idColumns = null; 
            }
        },
        getBeforeDataRowCount: function(sums, row, colId, dataRowCnt) {
        	if(dataRowCnt < 1) return dataRowCnt;
        	var colIdx = -1;
        	var currColId = colId;
        	for (var i = 0 ; i < sums.length; i++) {
        		for (var k = 0 ; k < sums[i].ids.length; k++) {
            		if(sums[i].ids[k] == colId) {
            			currColId = sums[i].ids[k - 1];
            			if(!currColId || currColId == colId) continue;
            			colIdx = i - 1;
            			colIdx = (colIdx < 0) ? 0 : colIdx;
            			break;
            		}
        		}
        		if(colIdx >= 0) break;
        	}
        	if(!currColId || currColId == colId) return dataRowCnt;
        	var ds = this.dataSet, cnt = 0;
        	var v1 = ds.getNameValue(row, currColId);
        	for (var i = row ; i >= 0; i--, cnt++) {
        		var v2 = ds.getNameValue(i, currColId);
        		if(String(v1) != String(v2)) {
        			break;
        		}
        	}
        	if(colIdx > 0) 
        		return this.getBeforeDataRowCount(sums, row, currColId, Math.min(dataRowCnt, cnt));
        	return Math.min(dataRowCnt, cnt);
        },
        getAfterRenderRow: function(row, record, rowCount, firstColumns, spansm, afterRowsInfo){
            var html = '';
            var cm = this.columnModel, colCount = cm.getColumnCount(true);
            var ts = this.templates || {};
            var freezeIndex = cm.freezeIndex;
            var idColumns = afterRowsInfo.idColumns;
            var sumLabelInfo = {};
            var sumLabelInfoIndex = [];
            var sumCnt = afterRowsInfo.currentSumRows.length;
            for (var i = 0; i < sumCnt; i++) {
            	for (var k = 0 ; k < afterRowsInfo.currentSumRows[i].summary.ids.length; k++) {
                    var sumLabelColId = afterRowsInfo.currentSumRows[i].labelId || afterRowsInfo.currentSumRows[i].summary.ids[k];
                    var sumLabelColIdx = cm.getIndexById(sumLabelColId);
                    sumLabelInfo[sumLabelColId] = sumLabelColIdx;
                    sumLabelInfoIndex.push(sumLabelColId);
            	}
            }
            var dupSummary = {};
            for (var i = 0; i < sumCnt; i++) {
                var colHtml = '';
                var col = 0;
                if (freezeIndex > -1) {
                    colCount = firstColumns ? freezeIndex + 1 : colCount;
                    col = (firstColumns ? 0 : (freezeIndex + 1));
                }
                var sumInfo = afterRowsInfo.currentSumRows[i].summary;
                var dataRowCnt = afterRowsInfo.currentSumRows[i].dataRowCnt;
                var sumLabelColId = afterRowsInfo.currentSumRows[i].labelId || sumLabelInfoIndex[i];
                if(dupSummary[sumLabelColId]) continue;
                var startRow = row - dataRowCnt + 1;
                var isLabel = firstColumns ? false : (freezeIndex > -1 && col > freezeIndex) ? true : false;
                var mergeCnt = 1;
                var sumColCss = 'L-grid-summary-col-' + sumLabelColId;
                for (; col < colCount; col++) {
                    var sumHtml = '';
                    var sumColInfo = afterRowsInfo.sumColumns[col];
                    var p = {
                        id: '',
                        cId: Rui.useFixedId() ? 'LGridDummy-' + this.gridId + '-' + row + '-' + sumLabelColId + '-' + col : undefined,
                        cInId: Rui.useFixedId() ? 'LGridDummy-inner-' + this.gridId + '-' + row + '-' + sumLabelColId + '-' + col : undefined,
                        first_last: '',
                        css: [],
                        style: '',
                        editable: false,
                        tooltip: false,
                        tooltipText: '',
                        istyle:'',
                        isSummary: true
                    };
                    if (col == sumLabelInfo[sumLabelColId]) {
                        var label = sumInfo.label || this.subTotalLabel;
                        if(Rui.isFunction(label))
                            label = sumInfo.label.call(this, row, col, column);
                        p.value = label;
                        p.css = 'L-grid-summary-col L-grid-summary-label ' + sumColCss;
                        if(mergeCnt) {
                            p.colspan = mergeCnt;
                            mergeCnt = 0;
                        }
                        sumHtml = ts.cell.apply(p);
                        isLabel = true;
                    } else if(sumColInfo){
                        var column = sumColInfo.column;
                        var value = sumColInfo.sumType.call(this, startRow, row, col, p, column);
                        p.id = column.id;
                        p.css = [ 'L-grid-summary-col', 'L-grid-summary-data', sumColCss ];
                        p.style = 'text-align:' + column.align+';';
                        p.value = !idColumns[p.id] ? this.getRendererValue(value, p, record, column, row, col) : '';
                        p.css = p.css.join(' ');
                        if(mergeCnt) {
                            p.colspan = mergeCnt;
                            mergeCnt = 0;
                        }
                        sumHtml = ts.cell.apply(p);
                    } else {
                        if(isLabel) {
                            var column = cm.getColumnAt(col);
                            if(column.expression) {
                                var value = 0, ds = this.dataSet;
                                var sumType = Rui.isFunction(column.expressionType) ? column.expressionType : GV.getSummaryFunction(column.expressionType ? column.expressionType : 'sum');
                                value = sumType.call(this, startRow, row, col, p, column);
                                p.id = column.id;
                                p.css = [ 'L-grid-summary-col', 'L-grid-summary-data', sumColCss ];
                                p.value = !idColumns[p.id] ? this.getRendererValue(value, p, record, column, row, col) : '';
                                p.style = 'text-align:' + column.align+';';
                                p.css = p.css.join(' ');
                                p.isSummary = true;
                                if(mergeCnt) {
                                    p.colspan = mergeCnt;
                                    mergeCnt = 0;
                                }
                                sumHtml = ts.cell.apply(p);
                            } else {
                                var dId = Rui.useFixedId() ? 'LGridDummy-' + row + '-' + sumLabelColId + '-' + col : Rui.id();
                                sumHtml = '<td id="' + dId +'" class="L-grid-col L-grid-cell L-grid-summary-col ' + sumColCss + '" ></td>';
                            }
                        }
                        else mergeCnt++; 
                    }
                    colHtml += sumHtml;
                    dupSummary[sumLabelColId] = true;
                    p = column = sumColInfo = null;
                }
                html += '<tr class="L-grid-summary-row L-grid-summary-depth-' + i + '">';
                html += colHtml;
                html += '</tr>';
                sumInfo = null;
            }
            cm = ds = sumLabelInfo = ts = afterRowsInfo = dupSummary = null; 
            return html;
        },
        getRenderRowClassName: function(row, record, rowCount, firstColumns){
            var first_last = (row == 0) ? 'L-grid-row-first' : (row == rowCount - 1) ? 'L-grid-row-last' : '';
            var even_odd = ((row % 2) == 0) ? 'odd' : 'even';
            var css = [];
            if(this.skipRowCellEvent !== true)
                this.fireEvent('rowRendered', {css:css, row:row, record:record});
            var rowModel = this.gridPanel.getRowModel();
            if(rowModel.renderer)
                rowModel.renderer(css, row, record);
            if(this.dataSet.isMarked(row)) css.push(GV.CLASS_GRIDVIEW_ROW_SELECT_MARK);
            var cn = 'L-grid-row L-grid-row-' + record.id + ' L-grid-row-' + even_odd + ' ' + first_last + ' ';
            cn += css.join(' ');
            if(row == this.dataSet.rowPosition) cn += ' ' + GV.CLASS_GRIDVIEW_ROW_SELECTED;
            rowModel = css = record = null;
            return cn;
        },
        getRenderRowBody: function(row, record, contentWidth, firstColumns, spans, checkFieldIndex){
            var ts = this.templates || {};
            var cm = this.columnModel;
            var colCount = cm.getColumnCount(true);
            var cells = '';
            if(checkFieldIndex != null && this.irregularScroll && this.irregularField){
                cells += this.getRenderCell(row, checkFieldIndex, colCount, record, spans ? spans[i] : undefined, true);
            }else{
                var freezeIndex = cm.freezeIndex;
                if(freezeIndex > -1) {
                    colCount = firstColumns ? freezeIndex + 1 : colCount;
                    for (var i = (firstColumns ? 0 : (freezeIndex + 1)); i < colCount; i++) {
                        if(spans && (spans[i].rowspan < 0 || spans[i].colspan < 0)) continue;
                        cells += this.getRenderCell(row, i, colCount, record, spans ? spans[i] : undefined);
                    }
                } else {
                    for (var i = 0; i < colCount; i++) {
                        if(spans && spans[i] && (spans[i].rowspan < 0 || spans[i].colspan < 0)) continue;
                        cells += this.getRenderCell(row, i, colCount, record, spans ? spans[i] : undefined);
                    }
                }
                cells += this.getRenderDummyCell(row);
            }
            contentWidth = contentWidth ? contentWidth : cm.getTotalWidth(true);
            var tstyle = 'width:' + contentWidth + 'px;';
            var rowBody = ts.rowBody.apply({
                tstyle: tstyle,
                cells: cells
            });
            cs = ts = spans = record = null;
            return rowBody;
        },
        getRenderDummyCell: function(row){
            var cm = this.getColumnModel();
            var ts = p = null;
            try {
                if((cm.makeDummyCell && this.makeDummyCell === undefined) || cm.merged === true) {
                    ts = this.templates || {};
                    p = {
                            style: '',
                            istyle: 'overflow: hidden;width:0px;',
                            value: 'test',
                            css: 'L-grid-dummy-cell'
                        };
                    return ts.cell.apply(p);
                }
                return '';
            } finally {
                cm = ts = p = null;
            }
        },
        getRenderCell: function(row, i, columnCount, record, span, isFieldCheck) {
            var ts = this.templates || {};
            var cm = this.columnModel;
            var column = cm.getColumnAt(i,true);
            var css = [];
            if(column.field && record.isModifiedField(column.field)) css.push('L-grid-cell-update');
            if(this.skipRowCellEvent !== true) this.fireEvent('cellRendered', {css:css, row:row, col:i, record:record});
            css = this.getRenderCellClass(css, row, i, record, column);
            var p = this.getRenderCellParams(row, col, columnCount, column, record);
            var edit = p.editable;
            if (edit === true) p.css.push(this.gridPanel.CLASS_GRID_CELL_EDITABLE);
            if(!this.dataSet.isValid(row, record.id, i, column.field)) {
                p.css.push('L-invalid');
                if(Rui.useAccessibility()) p.ariaInvalid = 'aria-invalid="true"';
            }
            if(Rui.useAccessibility()) {
                var tabIndex = -1;
                if(row === 0 && i === 0) tabIndex = 0;
                p.tabIndex = 'tabIndex="' + tabIndex + '"';
            }
            var tooltipText = cm.getCellConfig(row, column.id, 'tooltipText');
            if(Rui.isUndefined(tooltipText)) {
                tooltipText = p.tooltipText;
                if(!Rui.isEmpty(p.tooltipText))
                    cm.setCellConfig(row, column.id, 'tooltipText', tooltipText);
            }
            if (this.tooltip != null) {
                if(p.value != '' && p.tooltip != false){
                    if (!Rui.isEmpty(column.tooltipText)) p.css.push('L-grid-cell-tooltip');
                    if (!Rui.isEmpty(tooltipText)) {
                        p.css.push('L-grid-cell-tooltip');
                        this.tooltip.text = tooltipText;
                    }
                }
            }
            for (var j = 0; j < p.css.length; j++)
                css.push(p.css[j]);
            if(this.selectionMergedCell === true && this.cellMergeInfoSet && this.getColumnModel().isMerged()){
                if(this.cellMergeInfoSet[row] && this.cellMergeInfoSet[row][i]){
                    var cls = this.cellMergeInfoSet[row][i].cls;
                    if(cls)
                        css.push(cls);
                }
            }
            p.css = css.join(' ');
            var style, colWidth = this.adjustColumnWidth(column.width);
            if(span && span.colspan && span.colspan > 1){
                var col = i+1,
                    colspans = span.colspan;
                while (--colspans){
                    colWidth += this.adjustColumnWidth(cm.getColumnAt(col, true).width);
                    col++;
                }
            }
            if(span){
                if(span.colspan && span.colspan > 1)
                    colWidth += (span.colspan -1);
            }
            style = 'width:' + colWidth + 'px;';
            if(column.align != '') style += 'text-align:' + column.align+';';
            if(column.cellStyle) style += column.cellStyle + ';';
            if(isFieldCheck) style += 'display:table;';
            p.style += style;
            p.bcell = this.getRenderBeforeCell(p, record, column, row, i);
            if (Rui.isEmpty(p.value)) p.value = DBW.msie6 ? '&nbsp;' : '';
            if (span) {
                if(span.rowspan && span.rowspan > 1) p.rowspan = span.rowspan;
                if(span.colspan && span.colspan > 1) p.colspan = span.colspan;
            }
            p.cId = Rui.useFixedId() ? 'LGridCell-' + this.gridId + '-' + row + '-' + column.id : undefined;
            p.cInId = Rui.useFixedId() ? 'LGridCell-inner-' + this.gridId + '-' + row + '-' + column.id : undefined;
            try {
                return ts.cell.apply(p);
            } finally {
                ts = column = css = p = span = record = null;
            }
        },
        getRenderCellParams: function(row, col, columnCount, column, record) {
            var cm = this.columnModel;
            var defaultCss = (col == 0) ? 'L-grid-cell-first' : (col == columnCount - 1) ? 'L-grid-cell-last' : '';
            var p = {
                id: column.id,
                first_last: defaultCss,
                css: [],
                style: '',
                editable: column.editable,
                tooltip: true,
                tooltipText: '',
                istyle:''
            };
            p.value = this.getRenderCellValue(p, record, column, row, col);
            if(this.isExcel && cm.skipTags === true && typeof p.value === 'string') p.value = Rui.util.LString.skipTags(p.value);
            var edit = cm.getCellConfig(row, column.id, 'editable');
            if(Rui.isUndefined(edit)){
                edit = p.editable;
                if(!Rui.isUndefined(p.editable)) cm.setCellConfig(row, column.id, 'editable', edit, { ignoreEvent: true });
            } else {
                if(!Rui.isUndefined(p.editable)){
                    if(edit != p.editable){
                        edit = p.editable;
                        cm.setCellConfig(row, column.id, 'editable', edit, { ignoreEvent: true });
                    }
                }
            }
            p.editable = edit;
            return p;
        },
        getRenderBeforeCell: function(p, record, column, row, i) {
            return '';
        },
        getRenderCellClass: function(css, row, i, record, column) {
            var sm = this.selectionModel;
            if(!sm) return [];
            if(sm.getRow() == row && sm.getCol && sm.getCol() == i)
                css.push(GV.CLASS_GRIDVIEW_CELL_SELECTED);
            else if(sm.hasSelectedCell(row, i)) css.push(GV.CLASS_GRIDVIEW_CELL_SELECTED);
            if(column.field && record.isModifiedField(column.field)) css.push(GV.CLASS_GRIDVIEW_CELL_EDITED);
            try {
                return css;
            } finally {
                sm = css = null;
            }
        },
        getRenderCellValue: function(p, record, column, row, i) {
            var value = record.get(column.field);
            return this.getRendererValue(value, p, record, column, row, i);
        },
        getRendererValue: function(value, p, record, column, row, i) {
            try {
                if(this.isExcel && !column.renderExcel) return '';
                if (column.editor) {
                    if(column.editor.beforeRenderer)
                        value = column.editor.beforeRenderer(value, p, record, row, i);
                    if(column.editor.renderer) {
                    	var renderValue = column.renderer(value, p, record, row, i);
                        column.columnModel.setCellConfig(row, column.id, 'tooltipText', p.tooltipText);
                        return renderValue;
                    }
                }
                if(column.expression && (!p.isSummary || p.isSummary !== true))
                    value = column.expression(value, record, row, i);
                if(column.beforeRenderer)
                    value = column.beforeRenderer(value, p, record, row, i);
                if(column.renderer) { 
                    p.excel = (this.isExcel === true);
                    var renderValue = column.renderer(value, p, record, row, i);
                    column.columnModel.setCellConfig(row, column.id, 'tooltipText', p.tooltipText);
                    return renderValue;
                }
                return value;
            } catch(e) {
            	Rui.log(e.message, 'ERROR');
            } finally {
                value = column = record = p = null;
            }
        },
        updateRenderRows: function(row) {
            var rowsEl = this.bodyEl.select('.L-grid-row:nth-child(n+' + row + ')');
            if(rowsEl.length < 1) return;
            var isEven = rowsEl.getAt(0).hasClass('L-grid-row-even') ? true:false;
            rowsEl.each(function(rowEl){
                if(isEven)
                    rowEl.replaceClass('L-grid-row-odd', 'L-grid-row-even');
                else
                    rowEl.replaceClass('L-grid-row-even', 'L-grid-row-odd');
                isEven = !isEven;
            });
            if(row == 0) {
                if(rowsEl.length > 1)
                    rowsEl.getAt(1).removeClass('L-grid-row-first');
                rowsEl.getAt(0).addClass('L-grid-row-first');
            }
            if((rowsEl.length - 2) > 0)
                rowsEl.getAt(rowsEl.length - 2).removeClass('L-grid-row-last');
            rowsEl.getAt(rowsEl.length - 1).addClass('L-grid-row-last');
            this.rowsMap = rowsEl = null;
        },
        updateEmptyWidth: function(contentWidth) {
            var firstRow = this.bodyEl.dom.firstChild;
            try {
                var borderWidth = Rui.isBorderBox ? 0 : this.borderWidth;
                if (firstRow && firstRow.className == 'L-grid-body-empty') {
                    firstRow.style.width = (contentWidth - borderWidth) + 'px';
                    return true;
                }
                return false;
            } finally {
                firstRow = null;
            }
        }
    });
    GV.SUMMARY_FN = {
        sum: function(startRow, endRow, col, p, column) {
            if(column.expression && p.isSummary) {
                return GV.getCalculateValue.call(this, startRow, endRow, col, p, column);
            } else 
                return this.dataSet.sum(column.field, startRow, endRow);
        },
        avg: function(startRow, endRow, col, p, column) {
            if(column.expression && p.isSummary) {
                var val = GV.getCalculateValue.call(this, startRow, endRow, col, p, column);
                return val / (endRow - startRow + 1);
            } else 
                return this.dataSet.avg(column.id, startRow, endRow);
        },
        max: function(startRow, endRow, col, p, column) {
            var ds = this.dataSet, maxVal = 0;
            for (var row = startRow; row <= endRow; row++) {
                var r = ds.getAt(row);
                var value = r.get(column.field);
                var val = column.expression ? column.expression(value, r, row, col) : value;
                if(maxVal < val)
                    maxVal = val;
            }
            return maxVal;
        },
        min: function(startRow, endRow, col, p, column) {
            var ds = this.dataSet, minVal;
            for (var row = startRow; row <= endRow; row++) {
                var r = ds.getAt(row);
                var value = r.get(column.field);
                var val = column.expression ? column.expression(value, r, row, col) : value;
                if(row == startRow)
                    minVal = val;
                else if(minVal > val) minVal = val;
            }
            return minVal;
        },
        count: function(startRow, endRow, col, p, column) {
            return endRow - startRow + 1;
        },
        countExcludeEmpty: function(startRow, endRow, col, p, column) {
        	var ds = this.dataSet;
        	var count = 0;
            for (var row = startRow; row <= endRow; row++) {
                var r = ds.getAt(row);
                var value = r.get(column.field);
                if(!Rui.isEmpty(value)) count++;
            }
            return count;
        },
        empty: function(startRow, endRow, col, p, column) {
            return '';
        }
    };
    GV.getSummaryFunction = function(type) {
        return GV.SUMMARY_FN[type];
    };
    GV.getCalculateValue = function(startRow, endRow, col, p, column) {
        var ds = this.dataSet, val = 0;
        for (var row = startRow; row <= endRow; row++) {
            var r = ds.getAt(row);
            var value = r.get(column.id);
            val += column.expression ? column.expression(value, r, row, col) : value;
        }
        return val;
    };
})();
Rui.applyObject(Rui.ui.grid.LBufferGridView.prototype, {
    _setSyncDataSet: function(type, args, obj) {
        var isSync = args[0];
        this.doUnSyncDataSet();
        if(isSync === true) this.doSyncDataSet();
        this.syncDataSet = isSync;
        this.fireEvent('syncDataSet', {
            target: this,
            isSync: isSync
        });
    },
    doSyncDataSet: function() {
        this.dataSet.on('add', this.doAddData, this, true, {system: true});
        this.dataSet.on('update', this.doCellUpdateData, this, true, {system: true});
        this.dataSet.on('remove', this.doRemoveData, this, true, {system: true});
        this.dataSet.on('undo', this.doUndoData, this, true, {system: true});
        this.dataSet.on('beforeLoad', this.doBeforeLoad, this, true, {system: true});
        this.dataSet.on('load', this.onLoadDataSet, this, true, {system: true});
        this.dataSet.on('dataChanged', this.onChangeRenderData, this, true, {system: true});
        this.dataSet.on('commit', this.onCommitData, this, true, {system: true});
        this.dataSet.on('rowPosChanged', this.onRowPosChangedData, this, true, {system: true});
        this.dataSet.on('allMarked', this.onAllMarked, this, true, {system: true});
        this.dataSet.on('invalid', this.onInvalid, this, true, {system: true});
        this.dataSet.on('valid', this.onValid, this, true, {system: true});
        this.dataSet.on('stateChanged', this.onAllMarked, this, true, {system: true});
        this.dataSet.on('fieldsChanged', this.onFieldsChanged, this, true, {system: true});
        if (this.gridPanel) {
            this.columnModel.on('cellConfigChanged', this.onUpdateCellConfig, this, true);
            this.columnModel.bindEvent(this.gridPanel);
        }
    },
    doUnSyncDataSet: function(){
        this.dataSet.unOn('add', this.doAddData, this);
        this.dataSet.unOn('update', this.doCellUpdateData, this);
        this.dataSet.unOn('remove', this.doRemoveData, this);
        this.dataSet.unOn('undo', this.doUndoData, this);
        this.dataSet.unOn('beforeLoad', this.doBeforeLoad, this);
        this.dataSet.unOn('load', this.onLoadDataSet, this);
        this.dataSet.unOn('dataChanged', this.onChangeRenderData, this);
        this.dataSet.unOn('commit', this.onCommitData, this);
        this.dataSet.unOn('rowPosChanged', this.onRowPosChangedData, this);
        this.dataSet.unOn('allMarked', this.onAllMarked, this);
        this.dataSet.unOn('invalid', this.onInvalid, this);
        this.dataSet.unOn('valid', this.onValid, this);
        this.dataSet.unOn('stateChanged', this.onAllMarked, this);
        this.dataSet.unOn('fieldsChanged', this.onFieldsChanged, this);
        if (this.gridPanel) {
            this.columnModel.unOn('cellConfigChanged', this.onUpdateCellConfig, this);
            this.columnModel.unbindEvent(this.gridPanel);
        }
    }
});
(function(){
    var Dom = Rui.util.LDom;
    var GV = Rui.ui.grid.LBufferGridView;
    Rui.applyObject(Rui.ui.grid.LBufferGridView.prototype, {
        onRender: function() {
        },
        doBeforeLoad: function(e) {
            this.modifiedDate = new Date();
            this.showLoadingMessage();
        },
        onLoadDataSet: function(e) {
            if(this.pagerMode === 'scroll') this.pager.cancelTimer();
            if(this.pagerMode == 'scroll' && this.pager.loadDataSetByPager !== false) {
                if(this.el.isMask() && this.dataSet.isLoad)
                    this.hideLoadingMessage();
            }
            this.columnModel.clearCellConfig();
            this.onRenderData(e);
            if(this.irregularScroll == true && this.columnModel.merged == true) this.redoRender();
        },
        onRenderData: function(e) {
            if(Rui.isDebugTI)
                Rui.log('grid start', 'time');
            this.fireEvent('beforeRender');
            if(e.options && e.options.add !== true) this.columnModel.cellConfig = {};
            this.doRenderData(e);
            if (e.options && e.options.add !== true && this.scroller && this.pagerMode !== 'scroll') {
                if(!Rui.rightToLeft()) this.scroller.setScrollLeft(0);
            }
            if(Rui.isDebugTI)
                Rui.log('grid rendered', 'time');
            this.fireEvent('rendered');
        },
        onChangeRenderData: function(e) {
        	if(e && e.eventType == 0)
                if(this.scroller) this.scroller.setScrollLeft(0);
            this.doRenderData(e);
            if(this.scroller) this.scroller.onScrollX({ isForce: true });
            e = null;
        },
        onWidthResize: function(e){
            this.redoRender(true);
        },
        doAddData: function(e) {
            this.modifiedDate = new Date();
            this.redoRenderData({ resetScroll: true, isDataChanged: true });
        },
        doCellUpdateData: function(e) {
            var cm = this.columnModel;
            var c = cm.getColumnById(e.colId);
            this.modifiedDate = new Date();
            var isChangeCell = true;
            if(c && (c.vMerge || c.hMerge || c.summary))
                isChangeCell = false;
            var sumInfos = this.summaryInfos;
            if(sumInfos) {
                if(isChangeCell && sumInfos.idColumns[e.colId]) {
                    isChangeCell = false;
                }
            }
            var renderRange = this.getRenderRange();
            if (isChangeCell) {
                this._doCellUpdateData(e);
                if(this.irregularScroll){
                    var resetScroll = e.row >= (e.target.getCount() - this.renderRange.visibleRowCount -1);
                    if(resetScroll){
                        this.growedRowCount = 0;
                        this._temporaryGrowedCount = null;
                    }
                    this.redoRenderData({ resetScroll: resetScroll});
                }
                if(this.plugins) {
                    for (var i = 0, len = this.plugins.length; i < len; i++) {
                        this.plugins[i].updatePlugin({ isRendered: false, isDataChanged: true });
                    }
                }
            } else {
                if(c) {
                    var vRow = this.getVisibleRow(e.row);
                    if(renderRange && renderRange.start <= vRow && renderRange.end >= vRow)
                        this.redoRenderData({ resetScroll: true, system: e.system, isDataChanged: true });
                } 
            }
            cm = c = e = null;
        },
        _doCellUpdateData: function(e) {
            var row = e.row, col = e.col, colId = e.colId, record = e.record;
            var renderRange = this.getRenderRange();
            var vRow = this.getVisibleRow(row);
            if(renderRange && renderRange.start <= vRow && renderRange.end >= vRow) {
                col = this.columnModel.getIndexById(colId, true);
                if(col >= 0) this.doRenderCell(row, col, record);
                var spans = this.cellMergeInfoSet;
                var renderRange = this.renderRange;
                for (var i = 0, len = this.columnModel.getColumnCount(true) ; i < len; i++) {
                    if (this.columnModel.getColumnAt(i, true).renderRow === true) {
                        var span = spans ? spans[row - renderRange.start][i] : undefined;
                        this.doRenderCell(row, i, record, span);
                        span = null;
                    }
                }
            }
            record = spans = renderRange = null;
        },
        onUpdateCellConfig: function(e) {
            if(e.key == 'editable') {
                if(this.hasRows() === false) return;
                var visibleRow = this.getVisibleRow(e.row);
                if (visibleRow > -1) {
                    var cellDom = this.getCellDom(e.row, e.col);
                    if(!cellDom) return;
                    var cellEl = Rui.get(cellDom);
                    (e.value === true) ? cellEl.addClass(GV.CELLP_CONFIG[e.key]) : cellEl.removeClass(GV.CELLP_CONFIG[e.key]);
                    cellDom = cellEl = null;
                }
            }
            if(e.key == 'tooltipText') {
                if(this.hasRows() === false) return;
                var visibleRow = this.getVisibleRow(e.row);
                if (visibleRow > -1) {
                    var cellDom = this.getCellDom(e.row, e.col);
                    if(!cellDom) return;
                    var cellEl = Rui.get(cellDom);
                    (!Rui.isEmpty(e.value)) ? cellEl.addClass(GV.CELLP_CONFIG[e.key]) : cellEl.removeClass(GV.CELLP_CONFIG[e.key]);
                }
            }
        },
        onStateChanged: function(e) {
            var row = e.row, col = e.col, colId = e.colId, record = e.record;
            col = this.columnModel.getIndexById(colId, true);
            if(col >= 0) this.doRenderCell(row, col, record);
            var spans = this.cellMergeInfoSet;
            var renderRange = this.renderRange;
            for (var i = 0, len = this.columnModel.getColumnCount(true) ; i < len; i++) {
                if (this.columnModel.getColumnAt(i, true).renderRow === true) {
                    var span = spans ? spans[row - renderRange.start][i] : undefined;
                    this.doRenderCell(row, i, record, span);
                    span = null;
                }
            }
            record = spans = null;
        },
        doRenderCell: function(row, col, record, span) {
            this.setValue(row, col, this.getRenderCell(row, col, this.columnModel.getColumnCount(true), record, span));
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
                currentRowDomEl = newRowDom = record = dataSet = currentRowDom = newDivDom = null;
            }
        },
        doRemoveData: function(e) {
            this.modifiedDate = new Date();
            this.redoRenderData({ resetScroll: true, isDataChanged: true });
        },
        doUndoData: function(e) {
            this.modifiedDate = new Date();
            this.redoRenderData({ resetScroll: true, isDataChanged: true });
        },
        onCommitData: function(e) {
            this.getBodyEl().select('.' + GV.CLASS_GRIDVIEW_CELL_EDITED).removeClass(GV.CLASS_GRIDVIEW_CELL_EDITED);
        },
        onRowPosChangedData: function(e){
            if(!this.scroller) {
                var col = this.selectionModel.getCol ? this.selectionModel.getCol() : 0;
                this.syncFocusRow(e.row, col);
            }
            this.moveYScroll(e.row);
        },
        onAllMarked: function(e) {
            if(!e.isSelect){
                var len = this.dataSet.getCount(), row, rowId,
                    rc = GV.CLASS_GRIDVIEW_ROW,
                    mc = GV.CLASS_GRIDVIEW_ROW_SELECT_MARK;
                for (row = 0; row < len; row++){
                    if(!this.dataSet.isMarked(row)){
                        rowId = this.dataSet.getAt(row).id;
                        Rui.select('.L-grid-row-'+ rowId + '.' + mc).removeClass(mc);
                    }
                }
            }
        },
        onFieldsChanged: function(e) {
            this.updateView();
        },
        onBodyMouseOver: function(e) {
            if(this.getColumnModel().isMerged() === true || this.rowHoverStyle === false)
                return;
            var rowDom = this.findRowDom(e.target, e.pageY);
            if(rowDom) {
                Dom.addClass(rowDom, GV.CLASS_GRIDVIEW_ROW_OVER);
                rowDom = e = null;
            }
        },
        onBodyMouseOut: function(e) {
            if(this.getColumnModel().isMerged() === true || this.rowHoverStyle === false)
                return;
            var rowDom = this.findRowDom(e.target, e.pageY);
            if(rowDom) {
                Dom.removeClass(rowDom, GV.CLASS_GRIDVIEW_ROW_OVER);
                rowDom = e = null;
            }
        },
        onHeaderMouseOver: function(e) {
            var cellDom = this.findHeaderCellDom(e.target);
            if(cellDom && !this.headerDisabled) {
                this.activeHeaderColumnIndex = this.getCell(cellDom, e.pageX);
                if(this.activeHeaderColumnIndex > -1)
                    this.activeHeaderEl = Rui.get(cellDom);
                Dom.addClass(cellDom, GV.CLASS_GRIDVIEW_HEADER_OVER);
            }
            cellDom = e = null;
        },
        onHeaderMouseMove: function(e){
            if(!this.headerDisabled && this.activeHeaderColumnIndex > -1 && this.activeHeaderEl){
                if (this.useColumnResize) {
                    var headerRegion = this.activeHeaderEl.getRegion();
                    var colIdx = this.activeHeaderColumnIndex;
                    var column = this.columnModel.getColumnAt(colIdx, true);
                    if(column) {
                        var showLeftCursor = true;
                        if (colIdx > 0) {
                            showLeftCursor = this.columnModel.getColumnAt(colIdx - 1, true).isResizable();
                        }
                        var x = Rui.util.LEvent.getPageX(e);
                         if ((headerRegion.right - x) <= this.resizeHandleWidth && column.isResizable()) {
                            this.activeHeaderEl.setStyle('cursor', 'col-resize');
                            this._useColumnDD = false;
                        }
                        else {
                            this.activeHeaderEl.setStyle('cursor', '');
                            this._useColumnDD = true;
                        }
                    }
                    headerRegion = column = e = null;
                }
            }
        },
        onHeaderMouseOut: function(e) {
            var cellDom = this.findHeaderCellDom(e.target);
            if(cellDom) {
                Dom.setStyle(cellDom, 'cursor','');
                Dom.removeClass(cellDom, GV.CLASS_GRIDVIEW_HEADER_OVER);
                this.activeHeaderEl = null;
                this.activeHeaderColumnIndex = -1;
                cellDom = null;
            }
        },
        onHeaderClick: function(e) {
            var targetEl = Rui.get(e.event.target);
            try {
                if(targetEl.getStyle('cursor') == 'col-resize' || e.col === false) 
                    return;
                if(targetEl.hasClass('L-grid-sort-icon'))
                    this.doSortField(e.col);
            } finally {
                targetEl = e = null;
            }
        },
        onHeaderDblClick: function(e) {
            var targetEl = Rui.get(e.event.target);
            try {
                if(targetEl.getStyle('cursor') == 'col-resize') {
                    var colIdx = this.activeHeaderColumnIndex;
                    this.updateColumnFit(colIdx);
                }
            } finally {
                targetEl = e = null;
            }
        },
        onBodyScroll: function(e){
            this.syncHeaderScroll();
            this.fireEvent('bodyScroll');
        },
        onScrollX: function(e){
            this.onBodyScroll(e);
            this.fireEvent('scrollX', e);
        },
        onScrollY: function(e){
            try {
                if(this.pagerMode === 'scroll') {
                    this.pager.timerGoPage(e);
                }
                else {
                    this.redoRenderData();
                    if(Rui.platform.isMobile && this.gridScrollMessage !== false){
                        var msg;
                        if(e.isFirst)
                            msg = Rui.getMessageManager().get('$.base.msg126');
                        else if(e.isEnd)
                            msg = Rui.getMessageManager().get('$.base.msg127');
                        if(msg)
                            Rui.later(600, this, function(){
                                this.gridPanel.toast(msg, { delay: 700 });
                            });
                    }
                }
                this.fireEvent('scrollY', e);
            } catch(e1) {
                Rui.log(e1.message);
            }
        },
        columnAddListener: function() {
            var cm = this.columnModel;
            for (var i = 0, len = cm.getColumnCount(); i < len ; i++) {
                var c = cm.getColumnAt(i);
                c.unOn('hidden', this.onColumnHidden, this);
                c.on('hidden', this.onColumnHidden, this, true);
                c.unOn('sortable', this.onColumnSortable, this);
                c.on('sortable', this.onColumnSortable, this, true);
                c.unOn('label', this.onUpdateColumnLabel, this);
                c.on('label', this.onUpdateColumnLabel, this, true);
                c = null;
            }
            if(cm.isMultiheader()) {
                var bcm = cm.getBasicColumnModel();
                if(bcm) {
                    for (var i = 0, len = bcm.getColumnCount() ; i < len; i++) {
                        var c = bcm.getColumnAt(i);
                        if(c.getColumnType() != 'data') {
                            c.unOn('label', this.onUpdateColumnLabel, this, true);
                            c.on('label', this.onUpdateColumnLabel, this, true);
                        }
                        c = null;
                    }
                }
                bcm = null;
            }
            cm = null;
        },
        onColumnHidden: function(e) {
            this.modifiedDate = new Date();
            this.redoRender();
        },
        onColumnSortable: function(e) {
            var column = e.target;
            var elList = this.el.select('.L-grid-cell-' + column.id);
            if(e.sortable) elList.addClass('L-grid-cell-sortable');
            else elList.removeClass('L-grid-cell-sortable');
            column = elList = e = null;
        },
        onUpdateColumnLabel: function(e) {
            var column = e.target;
            this.getHeaderEl().select('.L-grid-header-' + column.id + ' a').html(e.label);
            column = e = null;
        },
        onRowSelect: function(row) {
            this.addRowClass(row, GV.CLASS_GRIDVIEW_ROW_SELECTED);
            if(this.selectionMergedCell === true && this.cellMergeInfoSet && this.getColumnModel().isMerged() && row > 0){
                var renderedRow = this.getRenderedRow(row);
                var mergeInfos = this.cellMergeInfoSet;
                var mergeColInfos = mergeInfos[renderedRow], 
                    mergeColInfo;
                if(!mergeColInfos)
                    return;
                for (var col = 0, len = mergeColInfos.length; col < len ; col++){
                    mergeColInfo = mergeColInfos[col];
                    if(mergeColInfo.rowspan < 0){
                        var cellDom = this.getCellDom(row + mergeColInfo.rowspan, col);
                        Dom.addClass(cellDom, 'L-grid-merged-cell-selected');
                        cellDom = null;
                    }
                    mergeColInfo = null;
                }
                mergeInfos = mergeColInfo = null;
            }
        },
        onRowDeselect: function(row) {
            this.removeRowClass(row, GV.CLASS_GRIDVIEW_ROW_SELECTED);
            if(this.selectionMergedCell === true && this.cellMergeInfoSet && this.getColumnModel().isMerged() && row > 0){
                var renderedRow = this.getRenderedRow(row);
                var mergeInfos = this.cellMergeInfoSet;
                var mergeColInfos = mergeInfos[renderedRow], 
                    mergeColInfo;
                if(!mergeColInfos)
                    return;
                for (var col = 0, len = mergeColInfos.length; col < len ; col++){
                    mergeColInfo = mergeColInfos[col];
                    if(mergeColInfo.rowspan < 0){
                        var cellDom = this.getCellDom(row + mergeColInfo.rowspan, col);
                        Dom.removeClass(cellDom, 'L-grid-merged-cell-selected');
                        cellDom = null;
                    }
                }
                mergeInfos = mergeColInfo = null;
            }
        },
        onCellClick: function(e) {
            if(!this.scroller) return;
            var row = e.row;
            if(this.dataSet.getRow() == row) {
                if(row == (this.getDataCount() - 1)|| row == 0) {
                    var scr = this.scroller;
                    var cr = Rui.get(this.getRowDom(row, 1)).getRegion();
                    if(scr) {
                        var sr = scr.getScrollRegion();
                        if(sr) {
                            if (row == 0) {
                                if(cr.top < sr.top)
                                    scr.goStart();
                            } else {
                                if(cr.bottom > sr.bottom - scr.getSpace('bottom'))
                                    scr.goEnd();
                            }
                        }
                    }
                    scr = cr = sr = null;
                }
            }
            if(this.columnModel.freezeIndex > -1) {
            	if(this.columnModel.freezeIndex >= e.col)
            		this.scroller.setScrollLeft(0);
            }
        },
        onCellSelect: function(row, cell) {
            var renderRange = this.renderRange;
            var vRow = this.getVisibleRow(row);
            if(this.isVirtualScroll === false || (renderRange && renderRange.start <= vRow && renderRange.end >= vRow)) {
                this.addCellClass(row, cell, GV.CLASS_GRIDVIEW_CELL_SELECTED);
                if(Rui.useAccessibility()) {
                    var cellDom = this.getCellDom(row, cell);
                    if(cellDom) cellDom.setAttribute('aria-selected', true);
                }
            }
        },
        onCellDeselect: function(row, cell) {
            var renderRange = this.renderRange;
            var vRow = this.getVisibleRow(row);
            if (this.isVirtualScroll === false || (renderRange && renderRange.start <= vRow && renderRange.end >= vRow)) {
                this.removeCellClass(row, cell, GV.CLASS_GRIDVIEW_CELL_SELECTED);
                if(Rui.useAccessibility()) {
                    var cellDom = this.getCellDom(row, cell);
                    if(cellDom) cellDom.setAttribute('aria-selected', false);
                }
            }
        },
        onMark: function(row){
            var renderRange = this.renderRange;
            var visibleRow = this.getVisibleRow(row);
            if (this.isVirtualScroll === false || (renderRange && renderRange.start <= visibleRow && renderRange.end >= visibleRow)) {
                this.addRowClass(row, GV.CLASS_GRIDVIEW_ROW_SELECT_MARK);
                if(this.headerSelectionMarkEvent) {
                    var selectionColumn = this.columnModel.getColumnById('selection');
                    if((this.dataSet.getCount() - 1) == this.dataSet.selectedData.length) {
                        var idx = this.columnModel.getIndex(selectionColumn);
                        var cellEl = this.getHeaderCellEl(idx);
                        cellEl = null;
                    }
                    selectionColumn = null;
                }
            }
        },
        onDemark: function(row) {
            var renderRange = this.renderRange;
            var visibleRow = this.getVisibleRow(row);
            if (this.isVirtualScroll === false || (renderRange && renderRange.start <= visibleRow && renderRange.end >= visibleRow)) {
                this.removeRowClass(row, GV.CLASS_GRIDVIEW_ROW_SELECT_MARK);
                if(this.headerSelectionMarkEvent) {
                    var selectionColumn = this.columnModel.getColumnById('selection');
                    if(selectionColumn && this.dataSet.selectedData.length < 1) {
                        var idx = this.columnModel.getIndex(selectionColumn);
                        var cellEl = this.getHeaderCellEl(idx);
                        cellEl = null;
                    }
                    selectionColumn = null;
                }
            }
        },
        onCheckFocus: function(e) {
            if(!this.isFocus) {
                this.onFocus.call(this, e);
                this.isFocus = true;
                Rui.util.LEvent.addListener(Rui.browser.msie ? document.body : document, 'mousedown', this.deferOnBlur, this, true);
            }
        },
        onInvalid: function(e) {
            var renderRange = this.renderRange;
            var vRow = this.getVisibleRow(e.row);
            if (this.isVirtualScroll === false || (renderRange && renderRange.start <= vRow && renderRange.end >= vRow)) {
                var column = this.columnModel.getColumnById(e.colId);
                if(column) {
                    var col = this.columnModel.getIndexById(e.colId, true);
                    this.addCellClass(e.row, col, 'L-invalid');
                    this.addCellAlt(e.row, col, e.message);
                    if (Rui.useAccessibility()) {
                        var cellDom = this.getCellDom(e.row, col);
                        cellDom.setAttribute('aria-invalid', true);
                    }
                    column = null;
                }
            }
        },
        onValid: function(e) {
            var renderRange = this.renderRange;
            var vRow = this.getVisibleRow(e.row);
            if (this.isVirtualScroll === false || (renderRange && renderRange.start <= vRow && renderRange.end >= vRow)) {
                var column = this.columnModel.getColumnById(e.colId);
                if(column) {
                    var col = this.columnModel.getIndexById(e.colId, true);
                    this.removeCellClass(e.row, col, 'L-invalid');
                    this.removeCellAlt(e.row, col);
                    if (Rui.useAccessibility()) {
                        var cellDom = this.getCellDom(e.row, col);
                        cellDom.setAttribute('aria-invalid', false);
                    }
                    column = null;
                }
            }
        },
        onColumnResize: function(e) {
            this.gridPanel.onColumnResize(e);
            var scrollLeft = (this.scroller) ? this.scroller.getScrollLeft() : 0;
            this.redoRender(false, scrollLeft);
        },
        onColumnMove: function(e){
            this.gridPanel.onColumnMove(e);
            var scrollLeft = (this.scroller) ? this.scroller.getScrollLeft() : 0;
            this.redoRender(false, scrollLeft);
        },
        onColumnsChanged: function(e){
            this.modifiedDate = new Date();
            this.redoRender(true);
        },
        deferOnBlur: function(e){
            Rui.util.LFunction.defer(this.checkBlur, 20, this, [e]);
        },
        checkBlur: function(e){
            if(e.deferCancelBubble == true || this.isFocus !== true) return;
            var target = e.target;
            try {
                var targetEl = Rui.get(target);
                if(targetEl.hasClass('L-ignore-blur')) return;
                var ieBug = (targetEl == null && Rui.browser.msie678);
                if(!ieBug){
                    if(targetEl.hasClass(GV.CLASS_GRIDVIEW_CELL)) return;
                }
                if(!this.el.isAncestor(target)){
                    if(this.onCanBlur(e) === false) return;
                    this.onBlur.call(this, e);
                }else
                    e.deferCancelBubble = true;
            } finally {
                target = e = null;
            }
        },
        onBlur: function(e){
            Rui.util.LEvent.removeListener(Rui.browser.msie ? document.body : document, 'mousedown', this.deferOnBlur);
            Rui.ui.grid.LBufferGridView.superclass.onBlur.call(this, e);
        }
    });
})();
(function(){
    var Dom = Rui.util.LDom;
    var Event = Rui.util.LEvent;
    var GV = Rui.ui.grid.LBufferGridView;
    Rui.ui.grid.LSelectionModel = function(config) {
        config = config || {};
        Rui.applyObject(this, config, true);
        Rui.ui.grid.LSelectionModel.superclass.constructor.call(this);
        this.createEvent('selectRow');
        this.createEvent('deselectRow');
        this.createEvent('selectCell');
        this.createEvent('deselectCell');
        config = null;
    };
    Rui.extend(Rui.ui.grid.LSelectionModel, Rui.util.LEventProvider, {
        locked: false,
        otype: 'Rui.ui.grid.LSelectionModel',
        marked: false,
        pageUpDownRow: 10,
        oldRow: -1,
        oldCell: 0,
        currentCol: 0,
        tabToMove: true,
        enterToMove: true,
        selection: {},
        init: function(gridPanel) {
            this.gridPanel = gridPanel;
            this.view = gridPanel.getView();
            this.oldRow = gridPanel.getView().getDataSet().getRow();
            this.initEvents();
        },
        initEvents: function() {
            var view = this.gridPanel.getView();
            var keyEventName = Rui.browser.msie || Rui.browser.chrome || (Rui.browser.safari && Rui.browser.version == 3) ? 'keydown' : 'keypress';
            this.gridPanel.unOn(keyEventName, this.onKeydown, this);
            this.gridPanel.on(keyEventName, this.onKeydown, this, true, { system: true });
            this.gridPanel.unOn('headerClick', this.onHdMouseDown, this);
            this.gridPanel.on('headerClick', this.onHdMouseDown, this, true, { system: true });
            this.gridPanel.unOn('cellClick', this.onBodyMouseDown, this);
            this.gridPanel.on('cellClick', this.onBodyMouseDown, this, true, { system: true });
            var selectionColumn = view.columnModel.getColumnById('selection');
            if(selectionColumn && selectionColumn.selectionType == 'radio') this.selectOne = true;
            this.gridPanel.unOn('rowClick', this.onRowClick, this);
            this.gridPanel.on('rowClick', this.onRowClick, this, true, { system: true });
            this.gridPanel.unOn('cellClick', this.onCellClick, this);
            this.gridPanel.on('cellClick', this.onCellClick, this, true, { system: true });
            this.gridPanel.columnModel.unOn('columnMove', this.onRemoveSelectionAll, this);
            this.gridPanel.columnModel.on('columnMove', this.onRemoveSelectionAll, this, true, { system: true });
            this.doSetSyncDataSet(true);
            view = selectionColumn = null;
        },
        doSetSyncDataSet: function(isSync) {
            if(isSync) this.unlock();
            else this.lock();
            var view = this.gridPanel.getView();
            var dataSet = view.getDataSet();
            dataSet.unOn('add', this.onAdd, this);
            dataSet.unOn('rowPosChanged', this.onRowPosChanged, this);
            dataSet.unOn('marked', this.onMarked, this);
            dataSet.unOn('load', this.onLoad, this);
            dataSet.unOn('dataChanged', this.onRemoveSelectionAll, this);
            dataSet.unOn('remove', this.onRemoveSelectionAll, this);
            dataSet.unOn('undo', this.onRemoveSelectionAll, this);
            dataSet.unOn('commit', this.onRemoveSelectionAll, this);
            if(isSync) {
                dataSet.on('add', this.onAdd, this, true, {system: true});
                dataSet.on('rowPosChanged', this.onRowPosChanged, this, true, {system: true});
                dataSet.on('marked', this.onMarked, this, true, {system: true});
                dataSet.on('load', this.onLoad, this, true, {system: true});
                dataSet.on('dataChanged', this.onRemoveSelectionAll, this, true, {system: true});
                dataSet.on('remove', this.onRemoveSelectionAll, this, true, {system: true});
                dataSet.on('undo', this.onRemoveSelectionAll, this, true, {system: true});
                dataSet.on('commit', this.onRemoveSelectionAll, this, true, {system: true});
            }
            view = dataSet = null;
        },
        onLoad: function(e) {
            if(!e.add) this.currentCol = 0;
            this.onRemoveSelectionAll(e);
        },
        onRemoveSelectionAll: function(e) {
            this.selection = {};
            this.isSelectionData = false;
        },
        lock: function(){
            this.locked = true;
        },
        unlock: function(){
            this.locked = false;
        },
        isLocked: function(){
            return this.locked;
        },
        onRowClick: function(e) {
        },
        onCellClick: function(e) {
            var evt = e.event ? e.event : e; 
            if(evt.type == 'click' && ( evt.ctrlKey === true || evt.shiftKey === true)){
                this.selectCell(e.row, e.col);
            }
            e = null;
        },
        onAdd: function(e) {
            this.onRemoveSelectionAll(e);
            var row = e.row;
            var sm = this.gridPanel.getSelectionModel();
            var ds = this.gridPanel.dataSet;
            var col = sm.currentCol;
            if (ds.getRow() < e.row) {
                this.deSelectRow(e.currentRow);
                this.doDeSelectCell(e.currentRow, col);
            } else {
                this.deSelectRow(e.currentRow + 1);
                this.doDeSelectCell(e.currentRow + 1, col);
            }
            if(!this.delayTask) {
                this.delayTask = new Rui.util.LDelayedTask(function(){
                    this.doSelectCell(row, col);
                    if(this.oldRow != row)
                        this.oldRow = row;
                    this.view.focusRow(row,col);
                    this.delayTask = null;
                }, this);
                this.delayTask.delay(250);
            }
            sm = null;
        },
        onRowPosChanged: function(e) {
            this.doMoveSelectRow(e.oldRow, e.row);
        },
        doMoveSelectRow: function(oldRow, row) {
            if(this.isMoveCell) return;
            var col = this.currentCol;
            if(this.isMultiCell !== true && oldRow > -1) {
                this.deSelectRow(oldRow);
                this.doDeSelectCell(oldRow, this.currentCol);
            }
            this.isMultiCell = false;
            this.selectRow(row);
            if(this._processSelectCell !== true)
                this.doSelectCell(row, col);
            if(this.oldRow != row)
                this.oldRow = row;
        },
        doFocusRow: function(row){
        },
        selectRow: function(row) {
            this.view.onRowSelect(row);
            this.doFocusRow(row);
            this.currentRow = row;
            this.fireEvent('selectRow', {target:this, row:row});
        },
        deSelectRow: function(row) {
            this.view.onRowDeselect(row);
            this.fireEvent('deselectRow', {target:this, row:row});
        },
        selectCell: function(row, col) {
            var dataSet = this.view.getDataSet();
            if(row < 0 || row > dataSet.getCount() - 1) return;
            var isSelect = this.doSelectCell(row, col);
            if(isSelect) {
                this.currentRow = row;
                this.currentCol = col;
            }
            dataSet = null;
            return isSelect;
        },
        doSelectCell: function(row, cell) {
            if(this._selectCell) return false;
            if(row < 0) return false;
            var columnModel = this.gridPanel.columnModel, view = this.view;
            if(cell < 0 || cell > columnModel.getColumnCount(true) - 1) return false;
            var ds = view.getDataSet();
            this._selectCell = true;
            view.onCellSelect(row, cell);
            var realRow = row;
            var cellId = undefined;
            if(row > -1) {
                var column = columnModel.getColumnAt(cell, true);
                cellId = column.id;
                var r = ds.getAt(row);
                if(r) {
                    var rowId = r.id;
                    if(cellId) {
                        if(!this.selection[rowId]) {
                            this.selection[rowId] = {};
                            this.selection[rowId].cellCount = 0;
                        }
                        if(this.selection[rowId][cellId] !== true) {
                            this.selection[rowId][cellId] = true;
                            this.selection[rowId].cellCount++;
                            this.isSelectionData = true;
                        }
                    }
                    realRow = view.isVirtualView === true ? ds.indexOfKey(r.id) : row;
                }
                column = r = null;
            }
            this.fireEvent('selectCell', {target:this, row:realRow, col:cell, colId: cellId});
            delete this._selectCell;
            columnModel = ds = null;
            return true;
        },
        doDeSelectCell: function(row, cell) {
            var columnModel = this.gridPanel.columnModel, view = this.view;
            if(cell < 0 || cell > columnModel.getColumnCount(true) - 1 || row < 0) return;
            view.onCellDeselect(row, cell);
            var ds = view.getDataSet();
            var realRow = row;
            if(row > -1) {
                var r = view.getRowRecord(row);
                if(r) {
                    var rowId = r.id;
                    var column = columnModel.getColumnAt(cell, true);
                    var cellId = column.id || column.field;
                    var selectionRow = this.selection[rowId];
                    if (selectionRow) {
                        if(selectionRow[cellId] === true) {
                            delete selectionRow[cellId];
                            selectionRow.cellCount--;
                            if(selectionRow.cellCount == 0) delete this.selection[rowId];
                        }
                    }
                    realRow = view.isVirtualView === true ? ds.indexOfKey(r.id) : row;
                    column = selectionRow = null;
                }
            }
            this.fireEvent('deselectCell', {target:this, row:realRow, col:cell});
            columnModel = view = ds = null;
        },
        hasSelectedCell: function(row, cell) {
            var view = this.view;
            var dataSet = view.getDataSet();
            var cm = view.columnModel;
            if(row < 0 || cell < 0 || row > view.getDataCount() - 1) return false;
            var rowId = dataSet.getAt(row).id;
            var cellId = cm.getColumnAt(cell).id;
            var selectionRow = this.selection[rowId];
            try {
                if (selectionRow) {
                    return (selectionRow[cellId] === true);
                }
                return false;
            } finally {
                dataSet = selectionRow = null;
            }
        },
        doRowSelectionCell: function(row, isDeSelection) {
            var cm = this.gridPanel.columnModel;
            var ds = this.view.getDataSet();
            for (var col = 0, len = cm.getColumnCount() ; col < len ; col++) {
                var column = cm.getColumnAt(col);
                if(column) {
                    if(isDeSelection === true) this.doDeSelectCell(row, col); else this.doSelectCell(row, col);
                }
                column = null;
            }
            cm = ds = null;
        },
        onTabMoveCell: function(e) {
        	if(this.isLocked()) return;
            var gridPanel = this.gridPanel, k = Rui.util.LKey.NAVKEY;
            var dataSet = gridPanel.getView().getDataSet();
            try {
                var dir = (e.keyCode !== k.RIGHT && e.shiftKey === true) ? -1 : 1;
                var moveCell = this.currentCol;
                moveCell = this.getVisibleColIndex(moveCell, dir);
                var row = dataSet.getRow();
                var sm = this.gridPanel.getSelectionModel();
                var oldRow = sm.getRow(), oldCell = sm.getCol();
                if(moveCell < 0) {
                    var start = dir > 0 ? 0 : (this.view.columnModel.getColumnCount(true) - 1);
                    moveCell = start;
                    row += dir;
                    if(row < 0 || row > this.getDataCount()) return;
                }
                if(moveCell < 0) return;
                if(e.ctrlKey !== true && e.shiftKey !== true) this.clearSelection();
                this.doDeSelectCell(oldRow, oldCell);
                gridPanel.doSelectCell(row, moveCell);
            } finally {
                gridPanel = dataSet = null;
            }
        },
        getVisibleColIndex: function(col, calCol) {
            if(col < 0 || col > this.view.columnModel.getColumnCount(true) - 1) return -1;
            var column = this.view.columnModel.getColumnAt(col + calCol, true);
            if(column == null) return -1;
            column = null;
            return col + calCol;
        },
        onKeydown: function(e) {
            if(!Event.isNavKey(e) && !(e.ctrlKey == true || e.shiftKey == true || e.keyCode === 113 || e.keyCode === 46) || this.isLocked()) return;
            var gridPanel = this.gridPanel;
            if(gridPanel.useMultiCellDeletable !== true && e.keyCode == 46) return;
            var columnModel = gridPanel.columnModel;
            var view = this.view;
            var dataSet = view.getDataSet();
            if(gridPanel.isEdit == true) return;
            var k = Rui.util.LKey.NAVKEY;
            var row = this.getRow(), col = this.getCol();
            switch (e.keyCode) {
                case k.DOWN:
                    var moveRow = this.getMoveRow(row, 1);
                    if(moveRow < view.getDataCount()) {
                        if(e.ctrlKey !== true && e.shiftKey !== true) this.clearSelection();
                        gridPanel.doSelectCell(moveRow, this.currentCol, e.shiftKey ? false : undefined);
                        gridPanel.systemSelect = true;
                    }
                    gridPanel.focusRow();
                    Event.stopEvent(e);
                    break;
                case k.UP:
                    var moveRow = this.getMoveRow(row, -1);
                    if(moveRow > -1) {
                        if(e.ctrlKey !== true && e.shiftKey !== true) this.clearSelection();
                        gridPanel.doSelectCell(moveRow, this.currentCol, e.shiftKey ? false : undefined);
                        gridPanel.systemSelect = true;
                    }
                    gridPanel.focusRow();
                    Event.stopEvent(e);
                    break;
                case k.PAGE_DOWN:
                    this.onPageDown(e);
                    gridPanel.focusRow();
                    Event.stopEvent(e);
                    break;
                case k.PAGE_UP:
                    this.onPageUp(e);
                    gridPanel.focusRow();
                    Event.stopEvent(e);
                    break;
                case k.HOME:
                    if(e.ctrlKey) gridPanel.doSelectCell(view.getVisibleRow(0), 0);
                    gridPanel.doSelectCell(dataSet.getRow(), 0);
                    break;
                case k.END:
                    if(e.ctrlKey) {
                        gridPanel.doSelectCell(view.getDataCount() - 1, columnModel.getColumnCount(true) - 1);
                    } else {
                        for (var i = columnModel.getColumnCount(true) - 1 ; -1 < i ; i--) {
                            var column = columnModel.getColumnAt(i, true);
                            if(Rui.isUndefined(column)) continue;
                            gridPanel.doSelectCell(dataSet.getRow(), i);
                            break;
                        }
                    }
                    break;
                case k.LEFT:
                    var dir = (e.keyCode == k.LEFT) ? -1 : 1;
                    var moveCell = this.currentCol;
                    moveCell = this.getVisibleColIndex(moveCell, dir);
                    if(moveCell < 0) return;
                    if(this.currentCol !== moveCell && e.ctrlKey !== true && e.shiftKey !== true) this.clearSelection();
                    gridPanel.doSelectCell(dataSet.getRow(), moveCell, e.shiftKey ? false : undefined);
                    gridPanel.focusRow();
                    break;
                case k.RIGHT:
                    this.onTabMoveCell(e);
                    gridPanel.focusRow();
                    break;
                case k.TAB:
                    if(this.tabToMove === true && !Rui.useAccessibility()) {
                        this.onTabMoveCell(e);
                        gridPanel.focusRow();
                    }
                    break;
                case 113:
                case k.ENTER:
                    if(gridPanel.isEdit != true) {
                        gridPanel.startEditor(row, col);
                    }
                    break;
                case 70:
                    gridPanel.showSearchDialog();
                    break;
                case 46:
                    gridPanel.multiCellDeletable();
                    break;
            }
            if(e.ctrlKey === true || e.shiftKey === true) {
                switch (Event.getCharCode(e)) {
                    case 97: 
                    case 65: 
                        var ds = view.dataSet;
                        var cnt = this.getDataCount();
                        if(this.view.pagerMode === 'scroll' && cnt > this.view.pager.pageSize) cnt = this.view.pager.pageSize; 
                        var endId = ds.getAt(cnt - 1).id;
                        var startRow = 0, endRow = cnt - 1;
                        for (var row = startRow; row <= endRow ; row++) {
                            var r = view.getRowRecord(row);
                            var realRow = view.isVirtualView === true ? ds.indexOfKey(r.id) : row;
                            this.doRowSelectionCell(realRow, e.shiftKey);
                            if(r.id == endId) break;
                        }
                        break;
                }
            }
            Event.stopEvent(e);
            gridPanel = null;
            columnModel = null;
            dataSet = null;
        },
        onPageUp: function(e) {
            var view = this.gridPanel.getView(), ds = view.getDataSet();
            var irregularRowHeight = view.getIrregularRowHeight ? view.getIrregularRowHeight(false) : null;
            var visibleRowCount = view.getVisibleRowCount ? view.getVisibleRowCount(true, irregularRowHeight) : this.pageUpDownRow;
            var row = this.getMoveRow(ds.getRow(), -visibleRowCount);
            row = (row < 0) ? 0 : row;
            if(row !== ds.getRow() && e.ctrlKey !== true && e.shiftKey !== true) this.clearSelection();
            view.getDataSet().setRow(row);
            ds = view = null;
        },
        onPageDown: function(e) {
            var view = this.gridPanel.getView(), ds = view.getDataSet();
            var irregularRowHeight = view.getIrregularRowHeight ? view.getIrregularRowHeight(false) : null;
            var visibleRowCount = view.getVisibleRowCount ? view.getVisibleRowCount(true, irregularRowHeight) : this.pageUpDownRow;
            var row = this.getMoveRow(ds.getRow(), visibleRowCount);
            row = (row > view.getDataCount() - 1) ? view.getDataCount() - 1 : row;
            if(row !== ds.getRow() && e.ctrlKey !== true && e.shiftKey !== true) this.clearSelection();
            view.getDataSet().setRow(row);
            ds = view = null;
        },
        onHdMouseDown: function(e) {
            if(this.isLocked()) return;
            var event = e.event;
            if(Dom.hasClass(event.target, 'L-grid-header-checkBox')) {
                var view = this.view;
                if(view.isSyncDataSet() == false) return;
                var cellDom = view.findCellDom(event.target);
                if(!cellDom) return;
                var ds = view.getDataSet();
            	var hdEl = Rui.get(event.target).findParent('.L-grid-header-selection', 3);
                if(hdEl.hasClass('L-grid-header-checkBox-mark'))
                    ds.setMarkAll(false);
                else
                    ds.setMarkAll(true);
                view = cellDom = ds = null;
            }
            event = null;
        },
        onBodyMouseDown: function(e) {
            if(this.isLocked()) return;
            if(e.target && e.target.className && e.target.className.indexOf('L-ignore-event') > -1) return;
            var gridPanel = this.gridPanel;
            if(gridPanel.isEdit == true)
                gridPanel.stopEditor(true);
            e = e.event ? e.event : e;;
            var target = e.target;
            var pageX = e.pageX;
            var pageY = e.pageY;
            if(Dom.hasClass(target, 'L-grid-row-select-ignore')) return;
            var view = this.view;
            if(view.isSyncDataSet() == false) return;
            var dataSet = view.getDataSet();
            var row = view.findRow(target, pageY);
            var col = view.findCell(target, pageX);
            if(Dom.hasClass(target, 'L-grid-row-checkBox') || Dom.hasClass(target, 'L-grid-row-radio')) {
            	if(!Dom.hasClass(target, 'L-grid-row-checkBox-disabled') && !Dom.hasClass(target, 'L-grid-row-radio-disabled')) {
                    if(e.ctrlKey === true) {
                        if(row > -1) {
                            if(dataSet.isMarked(row))
                                this.selectOne ? dataSet.setMarkOnly(row, false) : dataSet.setMark(row, false);
                            else
                                this.selectOne ? dataSet.setMarkOnly(row, true) : dataSet.setMark(row, true);
                        }
                    } else if(e.shiftKey === true) {
                        if(row > -1) {
                            var currRow = dataSet.rowPosition;
                            var isSelect = !dataSet.isMarked(row);
                            for (var i = row; (i > -1 && i >= currRow); i--) 
                                this.selectOne ? dataSet.setMarkOnly(i, isSelect) : dataSet.setMark(i, isSelect);
                        }
                    } else {
                        if (dataSet.isMarked(row)) 
                            this.selectOne ? dataSet.setMarkOnly(row, false) : dataSet.setMark(row, false);
                        else {
                            if(this.oldMark > -1 && this.oldMark < this.view.getDataCount())
                                this.selectOne ? dataSet.setMarkOnly(this.oldMark, false) : dataSet.setMark(this.oldMark, false);
                            this.selectOne ? dataSet.setMarkOnly(row, true) : dataSet.setMark(row, true);
                            if(Dom.hasClass(target, 'L-grid-row-radio')) {
                                this.oldMark = row;
                                this.doMoveRow(row);
                            }
                        }
                    }
            	}
            }
            if (e.ctrlKey !== true && e.shiftKey !== true && !Dom.hasClass(target, 'L-grid-row-checkBox') && !Dom.hasClass(target, 'L-grid-row-radio') && row > -1) {
                this.doMoveRow(row);
            }
            try{
                if(row < 0 || col < 0) return;
                var column = gridPanel.columnModel.getColumnAt(col, true);
                if(column && column.editor && column.editable) Event.preventDefault(e);
                if (e.ctrlKey !== true && e.shiftKey !== true) {
                    this.clearSelection();
                } else {
                    if(e.ctrlKey === true) {
                    	if(gridPanel.enableCtrlKey === true) {
                            var cellEl = Rui.get(view.getCellDom(row, col));
                            if(cellEl.hasClass(GV.CLASS_GRIDVIEW_CELL_SELECTED))
                                this.doDeSelectCell(row, col);
                            else
                                this.doSelectCell(row, col);
                    	}
                    } else if(e.shiftKey === true) {
                        this.clearSelection();
                        if(gridPanel.enableShiftKey === true) {
                            var startRow = this.currentRow;
                            var startCell = this.currentCol;
                            this.isMultiCell = true;
                            var ds = view.dataSet;
                            var endId = ds.getAt(row).id;
                            for (var currRow = startRow, len = view.getDataCount(); currRow <= len; currRow++ ) {
                                var r = view.getRowRecord(currRow);
                                var realRow = view.isVirtualView === true ? ds.indexOfKey(r.id) : currRow;
                                for (var currCol = startCell; currCol <= col ; currCol++) {
                                    this.doSelectCell(realRow, currCol);
                                }
                                if(r.id == endId) break;
                                r = null;
                            }
                            if(this.oldRow> -1)
                                this.deSelectRow(this.oldRow);
                            try{
                            	Dom.setSelectionRange(document.body, 0, 0);
                                var sel = window.getSelection();
                                if(sel) sel.removeAllRanges();
                            } catch(e1) {}
                        }
                    }
                }
            }catch(error){ Rui.log(Rui.dump(error)); } finally {
                gridPanel = view = dataSet = null;
            }
        },
        clearSelection: function() {
            if(this.isSelectionData === true) this.view.getBodyEl().select('.' + GV.CLASS_GRIDVIEW_CELL_SELECTED).removeClass(GV.CLASS_GRIDVIEW_CELL_SELECTED);
            this.selection = {};
            this.isSelectionData = false;
        },
        doMoveRow: function(row) {
        },
        onMarked: function(e) {
            if(e.isSelect === true) {
                this.doMarked(e.row);
            } else {
                this.deDemarked(e.row);
            }
        },
        doMarked: function(row) {
            this.view.onMark(row);
        },
        deDemarked: function(row) {
            this.view.onDemark(row);
        },
        getRow: function() {
            return this.gridPanel.getView().getDataSet().getRow();
        },
        getDataCount: function() {
            return this.view.getDataCount();
        },
        getSelection: function() {
            return this.selection;
        },
        getCol: function() {
            return this.currentCol;
        },
        getColId: function() {
            var cm = this.gridPanel.columnModel;
            if(this.currentCol < 0) return null;
            var column = cm.getColumnAt(this.currentCol, true);
            if(!column) return null;
            return column.getId();
        },
        getMoveRow: function(row, moveIdx) {
            return row + moveIdx;
        },
        destroy: function(){
            if(this.gridPanel) {
                var keyEventName = Rui.browser.msie || Rui.browser.chrome || (Rui.browser.safari && Rui.browser.version == 3) ? 'keydown' : 'keypress';
                this.gridPanel.unOn(keyEventName, this.onKeydown, this);
                this.gridPanel.unOn('headerClick', this.onHdMouseDown, this);
                this.gridPanel.unOn('cellClick', this.onBodyMouseDown, this);
                this.gridPanel.unOn('rowClick', this.onRowClick, this);
                this.gridPanel.unOn('cellClick', this.onCellClick, this);
                this.gridPanel.columnModel.unOn('columnMove', this.onRemoveSelectionAll, this);
            }
            var view = this.gridPanel.getView();
            if(view) {
                var dataSet = view.getDataSet();
                dataSet.unOn('add', this.onAdd, this);
                dataSet.unOn('rowPosChanged', this.onRowPosChanged, this);
                dataSet.unOn('marked', this.onMarked, this);
                dataSet.unOn('load', this.onRemoveSelectionAll, this);
                dataSet.unOn('dataChanged', this.onRemoveSelectionAll, this);
                dataSet.unOn('remove', this.onRemoveSelectionAll, this);
                dataSet.unOn('undo', this.onRemoveSelectionAll, this);
                dataSet.unOn('commit', this.onRemoveSelectionAll, this);
            }
            Rui.ui.grid.LSelectionModel.superclass.destroy.call(this);
        }
    });
})();
(function() {
    var Dom = Rui.util.LDom;
    var Ev = Rui.util.LEvent;
    Rui.ui.grid.LGridPanel = function(oConfig) {
        var config = oConfig || {};
        Rui.applyIf(config, {
            id: Rui.id(),
            visible:true,
            draggable:false,
            underlay:'',
            close:false,
            width: 0,
            height: 0,
            viewConfig : {}
        });
        config = Rui.applyIf(config, Rui.getConfig().getFirst('$.ext.gridPanel.defaultProperties'));
        if(config.autoWidth === true) delete config.width;
        Rui.applyObject(config.viewConfig, config, true);
        Rui.applyObject(this, config, true);
        this.createEvent('click');
        this.createEvent('dblclick');
        this.createEvent('mousedown');
        this.createEvent('mouseup');
        this.createEvent('mouseover');
        this.createEvent('mouseout');
        this.createEvent('cellMouseDown');
        this.createEvent('rowMouseDown');
        this.createEvent('headerMouseDown');
        this.createEvent('cellClick');
        this.createEvent('cellDblClick');
        this.createEvent('rowClick');
        this.createEvent('rowDblClick');
        this.createEvent('headerClick');
        this.createEvent('headerDblClick');
        this.createEvent('copy');
        this.createEvent('paste');
        this.createEvent('keydown');
        this.createEvent('keypress');
        this.createEvent('widthResize');
        this.createEvent('beforeEdit');
        this.createEvent('popup');
        this.createEvent('pasteCell');
         this.createEvent('pasteCompleted');        
        Rui.ui.grid.LGridPanel.superclass.constructor.call(this, config);
        config = null;
    };
    Rui.extend(Rui.ui.grid.LGridPanel, Rui.ui.LPanel, {
        otype: 'Rui.ui.grid.LGridPanel',
        view : null,
        columnModel: null,
        rowModel: null,
        borderWidth: 0,
        selectionModel: null,
        autoWidth: false,
        autoHeight: false,
        autoHeightParentId: null,
        rtrimWhiteSpace: true,
        clickToEdit: true,
        autoToEdit: false,
        enterToEdit: true,
        isEdit: false,
        editable: null,
        skipRowCellEvent: true,
        rendererConfig: true,
        systemSelect: true,
        tooltip: null,
        stopEventBubble: false,
        mouseEvent: false,
        virtualClipboard: true,
        contentResizeWidth: -1,
        multiLineEditor: false,
        useClipboard: true,
        clipValue: null,
        useMultiCellDeletable: false,
        usePasteCellEvent: false,
        usePaste: true,
        useRightActionMenu: true,
        tabletMode: true,
        tabletViewerUrl: null,
        enableCtrlKey: true,
        enableShiftKey: true,
        gridId: null,
        CLASS_GRID_ROW_EDITABLE: 'L-grid-row-editable',
        CLASS_GRID_CELL_EDITABLE: 'L-grid-cell-editable',
        initComponent: function(config){
            Rui.ui.grid.LGridPanel.superclass.initComponent.call(this);
            this.columnModel.gridPanel = this;
            if (config) {
                this.cfg.applyConfig(config, true);
            }
        },
        initEvents: function () {
            Rui.ui.grid.LGridPanel.superclass.initEvents.call(this);
            this.on('headerMouseDown', this.onApplyStopEditor, this, true);
            this.on('headerClick', this.onApplyStopEditor, this, true);
        },
        doRender: function(container) {
            Rui.ui.grid.LGridPanel.superclass.doRender.call(this, container);
            this.fireEvent('beforeInit', {target: this});
            Dom.addClass(this.element, 'L-grid-panel');
            this._insertBody('');
            var view = this.getView();
            this.getSelectionModel().init(this);
            this.initBodyEvent();
            view.setPanel(this);
            view.on('focus', function(e){
                if(!e.target) return;
                var targetEl = Rui.get(e.target);
                if(targetEl.hasClass('L-ignore-event')) return;
                var cView = this.getView();
                var sm = this.getSelectionModel();
                var c = this.columnModel.getColumnAt(sm.getCol(), true);
                if ((c && c.ignoreViewFocus !== false) || window.isRuiBlur !== false) {
                    cView.focusRow(sm.getRow(), sm.getCol());
                } else {
                    cView.cancelViewFocus();
                }
                Ev.addListener(Rui.getBody(true), 'selectstart', this.onSelectStart, this, true);
            }, this, true);
            this.editable = Rui.isNull(this.editable) ? this.columnModel._isEditable : this.editable;
            var hiddenParentEl = this.el ? Rui.util.LDom.getHiddenParent(this.el) : null;
            if (hiddenParentEl) {
                hiddenParentEl = Rui.get(hiddenParentEl);
                hiddenParentEl.addClass('L-block-display');
            }
            this.updateSizes();
            if(this.footerBar)
                this.footerBar.init(this);
            if(this.autoHeight) {
                this.availableHeight(this.autoHeightParentId);
                this.fillHeight();
            }
            if(view.fitContentHeight !== true) {
                var gridHeight = Rui.get(this.body).getHeight();
                view.cfg.queueProperty('height', gridHeight);
                view.height = gridHeight;
            }
            if(this.width) {
                view.cfg.queueProperty('width', this.width);
                view.width = this.width;
            }
            view.render(this.body);
            if (hiddenParentEl)
                hiddenParentEl.removeClass('L-block-display');
            var cm = this.columnModel;
            for (var i = 0, len = cm.getColumnCount() ; i < len; i++) {
                var c = cm.getColumnAt(i);
                if(c.editor && c.editor.gridFixed) {
                    c.editor.gridFieldId = c.id;
                    c.editor.gridBindEvent(this);
                }
            }
            if (!this.reMon && this.autoWidth === true) {
                this.reMon = new Rui.util.LResizeMonitor();
                this.reMon.monitor(this.element);
                this.reMon.on('contentResized',this.onContentResized, this, true);
            }
            if(this.autoWidth === true) {
                if(Rui.browser.msie)
                    Rui.later(1000, this, this._onContentResized);
            }
            if(!this.actionMenuGrid) this.actionMenuGrid = Rui.ui.LActionMenuSupport.createActionMenu(this);
            view = null;
        },
        afterRender: function(container) {
            Rui.ui.grid.LGridPanel.superclass.afterRender.call(this, container);
            var view = this.getView();
            var ds = view.getDataSet();
            this.gridId = this.dom.parentNode.id;
            if(view.columnDD) {
                view.columnDD.on('startDragEvent', this.onApplyStopEditor, this, true);
            }
            if(this.skipRowCellEvent !== true){
                view.on('renderRow', function(e){
                    var css = e.css;
                    css.push(this.CLASS_GRID_ROW_EDITABLE);
                }, this, true);
            }
            view.on('blur', this.onViewBlur, this, true);
            view.on('redoRender',this.onRedoRender, this, true);
            this.onRedoRender();
            this.on('cellClick', this.onCellclick, this, true, { system: true });
            this.on('cellDblClick', this.onCelldblclick, this, true, { system: true });
            ds.on('canRowPosChange', this.onApplyStopEditor, this, true, { system: true });
            this.initColumns();
            view = ds = null;
        },
        initBodyEvent: function() {
            this.bodyEl = Rui.get(this.body);
            this.bodyEl.on('mousedown', this.onMouseDown, this, true, { system: true });
            if(this.mouseEvent) {
               this.bodyEl.on('mouseup', this.onMouseUp, this, true, { system: true });
               this.bodyEl.on('mouseover', this.onMouseOver, this, true, { system: true });
               this.bodyEl.on('mouseout', this.onMouseOut, this, true, { system: true });
            }
            this.bodyEl.on('paste', this.onPaste, this, true, { system: true });
            this.bodyEl.on('click', this.onClick, this, true, { system: true });
            this.bodyEl.on('dblclick', this.onDblClick, this, true, { system: true });
            this.bodyEl.on('contextMenu', this.onContextMenu, this, true, { system: true });
            this.bodyEl.on('keydown', this.onCopyPaste, this, true, { system: true });
            this.bodyEl.on('keydown', this.onKeyDown, this, true, { system: true });
            this.bodyEl.on('keypress', this.onKeypress, this, true, { system: true });
        },
        onPaste: function(e) {
            this.stopEditor(false);
            this.clipboardToLoad(false, e);
        },
        _onContentResized: function() {
            this.onContentResized();
        },
        onRedoRender: function(e) {
            var view = this.getView();
            if(view.scroller) {
                view.scroller.unOn('scrollX', this.onReStartEditor, this);
                view.scroller.on('scrollX', this.onReStartEditor, this, true);
                view.scroller.unOn('scrollY', this.onReStartEditor, this);
                view.scroller.on('scrollY', this.onReStartEditor, this, true);
            }
            this.fragmentToEditor();
            view = null;
        },
        onContentResized: function(e){
            this.contentResizeCount = this.contentResizeCount || 0;
            if(this.contentResizeCount == 0)
                this.contentResizeModifiedTime = new Date();
            var compareTime = (new Date().getTime() - this.contentResizeModifiedTime.getTime());
            if(compareTime < 1000) this.contentResizeCount++;
            else this.contentResizeCount = 0;
            if(this.contentResizeCount > 10) {
                return;
            }
            if(this.reMon) this.reMon.resizeLock = true;
            this.updateWidth();
            var view  = this.getView();
            if(this.width && view._rendered) {
                var width = this.width;
                if(this.oldWidth != width && Math.abs(this.oldWidth - width) > this.contentResizeWidth)
                    view.setWidth(this.width);
                this.updateColumnsAutoWidth();
            }
            this.fillHeight();
            this.fireEvent('widthResize', {
                target: this,
                event: e
            });
            if(this.reMon) this.reMon.resizeLock = false;
            view = null;
        },
        doRedoRender: function() {
            this.editorToFragment();
        },
        getSelectionModel: function() {
            if(this.selectionModel == null) {
                this.selectionModel = new Rui.ui.grid.LSelectionModel();
            }
            return this.selectionModel;
        },
        invokeEvent: function(name, e){
            this.fireEvent(name.toLowerCase(), e);
            var v = this.view;
            var header = v.findHeaderCell(e.target,e.pageX);
            var eventName = name.charAt(0).toUpperCase() + name.substring(1);
            if(header > -1){
                this.fireEvent('header' + eventName, {
                    target: this,
                    col: header,
                    event: e
                });
            }else{
                var row = v.findRow(e.target, Ev.getPageY(e));
                var cell = v.findCell(e.target, Ev.getPageX(e));
                if(row > -1){
                    this.fireEvent('row' + eventName, {
                        target: this,
                        row: row,
                        event: e
                    });
                    if(cell > -1){
                        var column = v.columnModel.getColumnAt(cell, true);
                        var colId = null;
                        if(column) colId = column.id;
                        var ret = this.fireEvent('cell' + eventName, {
                            target: this,
                            row: row,
                            col: cell,
                            colId: colId,
                            event: e
                        });
                        if(ret === false) {
                            v.cancelViewFocus();
                        }
                    }
                }
            }
            if(this.stopEventBubble)
                Ev.stopEvent(e);
            v = e = null;
        },
        onClick: function(e){
            this.invokeEvent('click', e);
        },
        onMouseDown: function(e){
            this.invokeEvent('mouseDown', e);
        },
        onMouseUp: function(e){
            this.invokeEvent('mouseUp', e);
        },
        onMouseOver: function(e){
            this.invokeEvent('mouseOver', e);
        },
        onMouseOut: function(e){
            this.invokeEvent('mouseOut', e);
        },
        onContextMenu: function(e, t){
            this.invokeEvent('contextMenu', e);
        },
        onDblClick: function(e){
            this.invokeEvent('dblClick', e);
        },
        onKeyDown: function(e) {
            if (e.ctrlKey === true && (e.keyCode == 67 || e.keyCode == 86)) {
                return false;
            }
            if(e.ctrlKey == true && e.keyCode === 70)
                this.showSearchDialog(e);
            else if(e.keyCode === 112) {
                window.open(Rui.getRootPath() + '/docs/guide/guide.html');
                Ev.stopEvent(e);
            }
            this.invokeEvent('keydown', e);
        },
        onKeypress: function(e) {
            this.invokeEvent('keypress', e);
        },
        onCellclick: function(e) {
            var row = e.row, col = e.col;
            var view = this.getView(), column, tdEl, targetEl, sm = this.getSelectionModel();
            if(e.event.shiftKey !== true && e.event.ctrlKey !== true && !sm.isLocked()) {
                if(this.systemSelect)
                    this.doSelectCell(row, col);
                this.systemSelect = true;
            }
            var c = this.columnModel.getColumnAt(sm.getCol(), true);
            if((c && c.ignoreViewFocus !== false) || window.isRuiBlur !== false) view.focusRow(sm.getRow(), sm.getCol());
            else view.cancelViewFocus();
            try {
                column = view.getColumnModel().getColumnAt(col, true);
                if(column && !sm.isLocked()) {
                    targetEl = Rui.get(e.event.target);
                    var isPopupButton = targetEl.hasClass('L-popup-button-icon');
                    var isPopupAction = targetEl.hasClass('L-popup-action');
                    if(isPopupButton || isPopupAction) {
                        tdEl = targetEl.findParent('td', 5);
                        var isCellEditable = tdEl.hasClass(this.CLASS_GRID_CELL_EDITABLE);
                        if(isPopupButton && isCellEditable == false) return;
                        this.fireEvent('popup', {target:this, row:row, col:col, colId: column.getId(), buttonEl: targetEl, editable: isCellEditable });
                        Ev.stopPropagation(e);
                        view.onBlur({ target: view });
                        return false;
                    }
                }
                var conf = Rui.getConfig();
                var guideShow = conf.getFirst('$.base.guide.show');
                if(guideShow && this.checkGuideGrid !== false) {
                    var webStorage = new Rui.webdb.LWebStorage();
                    var cnt = webStorage.getInt('rui.ui.grid.guide.show', 1);
                    var limitGuideCount = conf.getFirst('$.base.guide.limitGuideCount');
                    if(cnt <= limitGuideCount) {
                        this.toast('<a href="' + Rui.getRootPath() + '/docs/guide/guide.html" target="_new">RUI 사용법 보기 (F1)</a><p>이 메시지는 ' + limitGuideCount + '번까지만 출력됩니다. [' + cnt + ']번째</p>');
                    } else this.checkGuideGrid = false;
                    webStorage.set('rui.ui.grid.guide.show', ++cnt);
                }
            } finally {
                column = view = tdEl = targetEl = null;
            }
        },
        setFooter: function (footerContent) {
            Rui.ui.grid.LGridPanel.superclass.setFooter.call(this, footerContent);
            if(this._rendered && this.footer)
                this.updateViewHeight(this.cfg.getProperty('height') - this.footer.offsetHeight);
        },
        updateSizes: function(){
            this.stopEditor(false);
            var el = Rui.get(this.element);
            if(this.autoWidth === true){
                this.updateWidth();
            }else{
                var width = this.cfg.getProperty('width');
                if (width) {
                    el.setWidth(width);
                    var innerEl = Rui.get(this.innerElement);
                    var borderWidth = innerEl.getBorderWidth('lr');
                    width = width - borderWidth;
                    var hd, ft, bd;
                    if (this.header) {
                        hd = Rui.get(this.header);
                        hd.setWidth(width);
                    }
                    if (this.footer) {
                        ft = Rui.get(this.footer);
                        ft.setWidth(width);
                    }
                    if (this.body) {
                        bd = Rui.get(this.body);
                        bd.setWidth(width);
                        if(!Rui.browser.chrome) bd.setStyle('overflow', 'hidden');
                    }
                    hd = ft = bd = null;
                }
            }
            var height = this.cfg.getProperty('height');
            if (height) {
                el.setHeight(height);
                var innerEl = Rui.get(this.innerElement);
                innerEl.setHeight(height);
            }
            this.fillHeight();
            var bd = Rui.get(this.body);
            this.width = bd.getWidth();
            var view = this.getView();
            if(view._rendered) {
                var elBorderWidth = this.el.getBorderWidth('tb');
                view.setWidth(this.width - elBorderWidth);
            }
            view = null;
        },
        updateWidth: function(){
            this.oldWidth = this.width;
            var width = 0;
            if (this.autoWidth === true) {
                var hd, ft, bd;
                width = 0;
                if (this.header) {
                    hd = Rui.get(this.header);
                    hd.setStyle('width','100%');
                }
                if (this.footer) {
                    ft = Rui.get(this.footer);
                    ft.setStyle('width','100%');
                }
                if (this.body) {
                    bd = Rui.get(this.body);
                    bd.setStyle('width','100%');
                    if(!Rui.browser.chrome) bd.setStyle('overflow', 'hidden');
                    var hiddenParentEl = Rui.util.LDom.getHiddenParent(bd);
                    if(hiddenParentEl) {
                        hiddenParentEl = Rui.get(hiddenParentEl);
                        hiddenParentEl.addClass('L-block-display');
                        width = bd.getWidth();
                        hiddenParentEl.removeClass('L-block-display');
                    } else {
                        width = bd.getWidth();
                    }
                    this.width = width;
                }
                hd = ft = bd = null;
            }
            return width;
        },
        fillHeight: function(el) {
            el = el ? el : this.body;
            if (el) {
                var container = this.element || this.innerElement,
                    containerEls = [this.header, this.body, this.footer],
                    containerEl,
                    total = 0,
                    filled = 0,
                    remaining = 0,
                    validEl = false;
                for (var i = 0, l = containerEls.length; i < l; i++) {
                    containerEl = containerEls[i];
                    if (containerEl) {
                        if (el !== containerEl) {
                            filled += this._getPreciseHeight(containerEl);
                        } else {
                            validEl = true;
                        }
                    }
                }
                if (validEl) {
                    var view = this.getView();
                    if (Rui.browser.msie || Rui.browser.opera) {
                        if(view.fitContentHeight !== true)
                            Dom.setStyle(el, 'height', 0 + 'px');
                    }
                    total = this._getComputedHeight(container);
                    if (total === null) {
                        Dom.addClass(container, "L-override-padding");
                        total = container.clientHeight; 
                        Dom.removeClass(container, "L-override-padding");
                    }
                    var elBorderWidth = 0; 
                    remaining = total - filled - elBorderWidth;
                    remaining = remaining < 0 ? 0 : remaining;
                    if(view.fitContentHeight !== true) {
                        Dom.setStyle(el, "height", remaining + "px");
                    }
                }
                container = containerEls = containerEl = null;
            }
            el = null;
        },
        availableHeight: function(parentId, margin) {
            var wrapperEl = Rui.get(this.element);
            if(parentId)
                wrapperEl.setHeight(Rui.get(parentId).getHeight());
            else
                wrapperEl.availableHeight(parentId, margin);
            this.height = wrapperEl.getHeight();
            this.setHeight(this.height);
            this.cfg.queueProperty('height', this.height);
        },
        _setHeight: function(type, args, obj) {
            if(this._rendered && this.height === args[0]) return;
            Rui.ui.grid.LGridPanel.superclass._setHeight.apply(this, arguments);
            if(this._rendered) this.updateSizes();
            this.updateViewHeight(this.height);
        },
        _setWidth: function(type, args, obj) {
            if(this._rendered && this.width === args[0]) return;
            Rui.ui.grid.LGridPanel.superclass._setWidth.apply(this, arguments);
            if(this._rendered) this.updateSizes();
        },
        setWidth: function(width){
            if(this.cfg.getProperty('width') == width) return;
            this.cfg.setProperty('width', width);
        },
        setHeight: function(height){
            if(this.cfg.getProperty('height') == height) return;
            this.cfg.setProperty('height', height);
        },
        updateViewHeight: function(height) {
            var footerHeight = this.footer ? this.footer.offsetHeight : 0;
            var view = this.getView();
            if(view.fitContentHeight !== true) {
                var elBorderWidth = this.el.getBorderWidth('tb');
                view.setHeight(height - elBorderWidth - footerHeight);
            }
        },
        getBorderWidth: function() {
            return this.borderWidth;
        },
        selectCell: function(row, col, edit){
            if(edit === true) this.systemSelect = true;
            var isMove = this.doSelectCell(row, col, edit);
            if(isMove === true && edit === true)
                this.focusRow();
            this.systemSelect = false;
            return isMove;
        },
        doSelectCell: function(row, col, edit) {
            var view = this.getView();
            if(view.isSyncDataSet() == false) return;
            var ds = view.getDataSet();
            var sm = this.getSelectionModel();
            var oldRow = sm.getRow();
            var oldCol = sm.getCol();
            var cm = view.columnModel;
            if(typeof col == 'string')
                col = cm.getIndexById(col, true);
            var moveRow = true;
            if(row != ds.getRow()) {
                if(row == oldRow) {
                    sm.isMoveCell = true;
                }
                sm._processSelectCell = true;
                moveRow = ds.setRow(row);
                delete sm.isMoveCell;
                delete sm._processSelectCell;
            }
            var isSelect = false;
                if(moveRow) {
                    if(oldRow == row && oldCol != col)
                        sm.doDeSelectCell(oldRow, oldCol);
                    sm.selectCell(row, col);
                }
                if(moveRow != false && moveRow > -1) {
                    if(edit || (edit !== false && this.autoToEdit && !Rui.useAccessibility())) {
                        if(edit === true) this.stopEditor(true);
                        this.startEditor(row, col);
                    }
                    isSelect =  true;
                }
            if(moveRow && view.scroller) {
                var cellEl = Rui.get(view.getHeaderCellEl(col));
                var cellRight = cellEl.getRight();
                var right = view.getContainer().getRight();
                if(cellRight > right)
                    view.scroller.setScrollLeft(cellRight - right + view.scroller.getScrollbarSize(true));
            }
            view = sm = ds = null;
            return isSelect;
        },
        onCelldblclick: function(e) {
            if (e.event.shiftKey !== true && e.event.ctrlKey !== true && !this.getSelectionModel().isLocked()) {
                if(this.systemSelect && this.doSelectCell(e.row, e.col, true) === true) Ev.stopEvent(e);
                this.systemSelect = true;
            }
        },
        onColumnResize: function(e) {
            this.stopEditor(true);
            this.editorToFragment();
        },
        onColumnMove: function(e) {
            this.stopEditor(true);
            this.editorToFragment();
        },
        onColumnsChanged: function(e) {
            this.stopEditor(true);
            this.editorToFragment();
        },
        onEditorChanged: function(e) {
            var sm = this.getSelectionModel();
            if(this.isEdit) this.applyValue(sm.getRow(), sm.getCol(), true, false);
            sm = null;
        },
        onEditorBlur: function(e) {
            var target = e;
            if (this.stopEditor(true) == false) {
                target.focus();
            } else {
                this.selectionModel.unlock();
            }
            target = null;
            delete this._applyValue;
        },
        onDataSetChanged: function(e) {
            if(this.isEdit !== true || this.editColId != e.colId || this.beforeEditorValue == e.value) return;
            var view = this.getView();
            if(e.row !== view.dataSet.getRow()) return;
            var columnModel = view.getColumnModel();
            var column = columnModel.getColumnById(e.colId);
            if(column) {
                var editor = column.getEditor();
                editor.setValue(e.value, true);
            }
            view = column = columnModel = null;
        },
        onCopyPaste: function(e) {
            if(e.ctrlKey === true && (e.keyCode == 67 || e.keyCode == 86)) {
                try{
                    var webStorage = new Rui.webdb.LWebStorage();
                    if(!Rui.browser.msie && webStorage.getBoolean('rui.ui.grid.clipboard.noti', false) == false) {
                        var mm = Rui.getMessageManager();
                        var msg = 'UI ' + mm.get('$.base.msg128') + ' : Ctrl + C, UI ' + mm.get('$.base.msg129') + ' : Ctrl + V<br/>';
                        msg += 'Excel ' + mm.get('$.base.msg128') + ' : Ctrl + Shift + C, Excel ' + mm.get('$.base.msg129') + ' : Ctrl + Shift + V';
                        this.toast(msg, { delay: 10000 });
                        webStorage.set('rui.ui.grid.clipboard.noti', true)
                    }
                    if(e.keyCode == 67)
                        this.dataToClipboard(false);
                    else if(e.keyCode == 86) {
                        this.clipboardToLoad(false);
                    }
                } catch(e1){}
            }
        },
        dataToClipboard: function(localData) {
            var selection = this.selectionModel.getSelection();
            var view = this.getView();
            var dataSet = view.getDataSet();
            try {
                var rowValue = [], rowId;
                if(this.virtualClipboard) {
                    for (rowId in selection) {
                        var record = dataSet.get(rowId);
                        if(record) {
                            var rowObj = selection[rowId];
                            var colValue = [];
                            var row = dataSet.indexOfKey(rowId);
                            var fieldMap = {};
                            for (var i = 0, len = dataSet.fields.length ; i < len; i++) {
                                fieldMap[dataSet.fields[i].id] = dataSet.fields[i];
                            }
                            for (var i = 0, len = this.columnModel.getColumnCount(true); i < len ; i++) {
                                var column = this.columnModel.getColumnAt(i, true);
                                var val = '';
                                if(rowObj[column.id]) {
                                    if (!column.clipboard) {
                                        colValue.push('');
                                        continue;
                                    }
                                    val = (column.field) ? record.get(column.field): undefined;
                                    if(column instanceof Rui.ui.grid.LSelectionColumn || column instanceof Rui.ui.grid.LStateColumn) {
                                        val = '';
                                    } else {
                                        if(column.clipboardVirtual === true || !column.field) {
                                            var p = {
                                                id: column.id,
                                                first_last: '',
                                                css: [],
                                                style: '',
                                                editable: column.editable,
                                                tooltip: true,
                                                tooltipText: '',
                                                istyle:'',
                                                clipboard: true
                                            };
                                            if(column.clipboardRenderer)
                                                val = column.clipboardRenderer(val, p, record, column, row, i) || '';
                                            else
                                                val = view.getRendererValue(val, p, record, column, row, i) || '';
                                            if(this.columnModel.skipTags === true && val && typeof val === 'string')  val = Rui.util.LString.skipTags(val);
                                        }
                                    }
                                    colValue.push(val);
                                }
                            }
                            rowValue.push(colValue);
                            fieldMap = null;
                        }
                    }
                } else {
                    for (rowId in selection) {
                        var record = dataSet.get(rowId);
                        if(record) {
                            var rowObj = selection[rowId];
                            var colValue = [];
                            for (var i = 0; i < this.columnModel.getColumnCount(true) ; i++) {
                                var column = this.columnModel.getColumnAt(i, true);
                                if(!column.clipboard) continue;
                                if(rowObj[column.id]) {
                                    var v = record.get(column.field);
                                    colValue.push(v || '');
                                }
                            }
                            rowValue.push(colValue);
                        }
                    }
                }
                var p = {data:rowValue};
                this.fireEvent('copy', p);
                var rowValues = [];
                for (var row = 0 ; row < p.data.length; row++) {
                    var colData = p.data[row];
                    rowValues.push(colData.join('\t'));
                }
                if(localData) {
                    Rui._clipboardData = rowValues.join('\r\n');
                } else {
                    if(Rui.browser.msie) {
                        if(Rui.util.LString.toClipboard(rowValues.join('\r\n')) == false)
                            alert(Rui.getMessageManager().get('$.base.msg113'));
                    } else {
                        if(this.useClipboard == true) {
                            function copyHandler(e) {
                                e.clipboardData.setData('text/plain', rowValues.join('\r\n'));
                                Ev.stopEvent(e);
                                document.removeEventListener('copy', copyHandler, true);
                            }
                            document.addEventListener('copy', copyHandler, true);
                            document.execCommand('copy');
                            document.clipGrid = this;
                        }
                    }
                }
                this.toast(Rui.getMessageManager().get('$.base.msg141'), { delay: 700 });
                rowValues = p = null;
            } catch (e) {
            } finally {
                selection = view = dataSet = null;
            }
        },
        pasteHandler: function(e) {
            this.clipValue = e.clipboardData.getData('text');
            Ev.stopEvent(e);
            if(!(this instanceof Rui.ui.grid.LGridPanel)){
                document.removeEventListener('paste', this.clipGrid.pasteHandler, true);
            }
            document.clipGrid.setClipData(this.clipValue);
        },
        clipboardToLoad: function(localData, e) {
            if(this.usePaste === false) return;
            var value = null;
            if(localData) {
                if(Rui._clipboardData) this.setClipData(Rui._clipboardData);
            } else {
                if (Rui.browser.msie) { 
                    value = Rui.util.LString.getClipboard();
                    if(this.rtrimWhiteSpace)
                        value = value.replace(/\s+$/g,'');
                    this.setClipData(value);
                } else {
                    if(this.useClipboard == true) {
                        document.clipGrid = this;
                        if(!e){
                            document.addEventListener('paste', this.pasteHandler, true);
                        }else{
                            this.pasteHandler(e);  
                        }
                    }
                }
            }
            this.toast(Rui.getMessageManager().get('$.base.msg140'), { delay: 700 });
        },
        createClipboard: function() {
            var cbEl = this.clipBoardEl;
            if(!cbEl) {
                var id = Rui.id();
                var mm = Rui.getMessageManager();
                var html = '<div class="L-clipboard" id="clipboard_' + id + '"><div class="L-clipboard-title">' + mm.get('$.base.msg125');
                html += ' <span class="L-clipboard-title-copy">' + mm.get('$.base.msg128') + '</span><span class="L-clipboard-title-paste">' + mm.get('$.base.msg129') + '</span>';
                html += '</div>';
                html += '<textarea rows="30" cols="80"></textarea>';
                html += '<div class="L-clipboard-infomation">' + mm.get('$.base.msg130') + '</div>';
                html += '<div class="L-buttons"><button class="L-apply">' + mm.get('$.base.msg120') + '</button><button class="L-close">' + mm.get('$.base.msg124') + '</button></div>';
                html += '</div>';
                Rui.getBody().appendChild(html);
                cbEl = Rui.get('clipboard_' + id);
                cbEl.select('button.L-apply').on('click', function(e) {
                    var value = cbEl.select('textarea').getValue();
                    if(this.setClipData(value))
                        cbEl.hide();
                }, this, true);
                cbEl.select('button.L-close').on('click', function(e) {
                    cbEl.hide();
                }, this, true);
                this.clipBoardEl = cbEl;
            }
        },
        setClipData: function(value){
            if(value) {
                var view = this.getView();
                var dataSet = view.getDataSet();
                var cm = this.columnModel;
                var row = dataSet.getRow();
                var col = this.selectionModel.getCol();
                if(row < 0 || col < 0) return;
                value = value.replace(/\r|\n?$/g,'');
                var rowValue = value.split('\n');
                var rowData = [];
                var dateReadFieldFormater = dataSet.readFieldFormater['date'];
                var dsCount = dataSet.getCount();
                for (var currRow = 0 ; currRow < rowValue.length && currRow < dsCount ; currRow++) {
                    if(rowValue[currRow] == '' && (currRow < (rowValue.length  - 1))) continue;
                    var colValue = rowValue[currRow].split('\t');
                    var colData = [];
                    for (var currCol = 0 ; currCol < colValue.length ; currCol++) {
                        var column = cm.getColumnAt(currCol + col, true);
                        if(!column) continue;
                        var id = column.field || column.id;
                        if(!id) continue;
                        var value = '';
                        if(column.field) {
                            var field = dataSet.getFieldById(column.field);
                            value = colValue[currCol].trim();
                            if(field.type == 'number'){
                                var oldValue = value;
                                value = value.replace(/,/g,'');
                                value = parseFloat(value);
                                if(isNaN(value)) {
                                    alert('Paste failed. : [rows:' + currRow + ':' + column.label + '] => ' + oldValue + ', ' + Rui.getMessageManager().get('$.base.msg005'));
                                    return false;
                                }
                            }
                            else if(field.type == 'date') {
                                try{
                                    var oldValue = value;
                                    value = value ? dateReadFieldFormater(value) : null;
                                    if(value === false || !value.getFullYear()) {
                                        alert('Paste failed. : [rows:' + currRow + ':' + column.label + '] => ' + oldValue + ', ' + Rui.getMessageManager().get('$.base.msg016'));
                                        return false;
                                    }
                                } catch(e) {
                                }
                            }
                        }
                        colData.push({id:id, value:value, isSkip:false });
                        column = null;
                    }
                    rowData.push(colData);
                }
                var p = {data:rowData};
                this.fireEvent('paste', p);
                var sm = this.selectionModel;
                var autoMappingMap = {};
                for (var currRow = 0, len = p.data.length; currRow < len && currRow < dsCount; currRow++) {
                    var colData = p.data[currRow];
                    var colLen = colData.length;
                    for (var currCol = 0; currCol < colLen ; currCol++) {
                        if(colData[currCol].isSkip === true) continue;
                        var c = cm.getColumnAt(sm.getCol() + currCol, true);
                        if(!c) continue;
                        var cellEditable = cm.getCellConfig(currRow + row, c.id, 'editable');
                        if(Rui.isUndefined(cellEditable))
                            cellEditable = c.editable;
                        if(cellEditable === false) continue;
                        for (var rowIdx = currRow; rowIdx < dsCount ; rowIdx++) {
                            var r = dataSet.getAt(currRow + row);
                            try {
                                if(r) {
                                    if(!!view.isShowDataPaste && Rui.hasOwnProperty(r.attrData, '_show')){
                                        if(!r.getAttribute('_show')){
                                            row++;
                                            continue;
                                        }
                                    }
                                    var isRendererField = false;
                                    var val = (colData[currCol].value === 0) ? 0 : colData[currCol].value || '';
                                    if(c && c.editor) {
                                        if(c.editor.autoMapping || c.editor.rendererField) {
                                            if(val && autoMappingMap[val]) {
                                                val = autoMappingMap[val];
                                            } else {
                                                var eVal = c.editor.findValueByDisplayValue(val);
                                                if(eVal) {
                                                    autoMappingMap[val] = eVal;
                                                    val = eVal;
                                                }
                                            }
                                            if(c.editor.rendererField) isRendererField = true;
                                        }
                                    }
                                    if(this.usePasteCellEvent) {
                                        var cp = {row: currRow + row, col: sm.getCol() + currCol, colId: c.field || c.id, value: val};
                                        this.fireEvent('pasteCell', cp );
                                        val = cp.value !== val ? cp.value : val;
                                    }
                                    r.set(colData[currCol].id, val);
                                    if(isRendererField) r.set(c.editor.rendererField, colData[currCol].value);
                                    break;
                                }else{
                                    Rui.log('Can not find target row');
                                    break;
                                }
                            } catch(e) {
                                alert('Paste failed. : [' + currRow + ':' + currCol + '] => ' + e.message);
                                return;
                            }
                        }
                        c = r = null;
                    }
                    colData = null;
                }
                this.fireEvent('pasteCompleted', p);
                view = dataSet = fieldMap = p = cm = null;
                document.clipGrid = null;
            }
            return true;
        },
        setSyncDataSet: function(isSync) {
            this.getView().setSyncDataSet(isSync);
        },
        setDataSet: function(dataSet) {
            var view = this.getView();
            view.setSyncDataSet(false);
            view.dataSet = dataSet;
            this.dataSet = dataSet;
            view.setSyncDataSet(true);
            this.getSelectionModel().init(this);
            view.setPanel(this);
            this.unOn('headerClick', this.onApplyStopEditor, this);
            this.on('headerClick', this.onApplyStopEditor, this, true);
            this.unOn('cellClick', this.onCellclick, this);
            this.on('cellClick', this.onCellclick, this, true, { system: true });
            if(this.footerBar)
                this.footerBar.init(this);
            view = dataSet = null;
        },
        setCellConfig: function(row, colId, key, val) {
            this.columnModel.setCellConfig(row, colId, key, val);
        },
        editorToFragment: function() {
            if(this.fragmentEditorList) return;
            this.frag = document.createDocumentFragment();
            var cm = this.columnModel;
            cm.editors = cm.editors || {};
            this.fragmentEditorList = {};
            for (m in cm.editors) {
                var ep = cm.editors[m];
                if(ep instanceof Rui.ui.grid.LEditorPanel) {
                    this.frag.appendChild(ep.el.dom);
                    this.fragmentEditorList[m] = ep;
                }
                ep = null;
            }
            cm.editors = {};
            cm = null;
        },
        fragmentToEditor: function() {
            var view = this.getView(), cm = this.columnModel;
            cm.editors = cm.editors || {};
            for (var m in this.fragmentEditorList) {
                var ep = this.fragmentEditorList[m];
                if (ep instanceof Rui.ui.grid.LEditorPanel) {
                    view.getScrollerEl().appendChild(ep.el.dom);
                    cm.editors[m] = ep;
                }
                ep = null;
            }
            delete this.fragmentEditorList;
            delete this.frag;
            view = cm = null;
        },
        createEditorTimer: function(obj) {
            this.dtStartEditor = Rui.later(50, this, this.doStartEditor, [ obj ]);
            this.dtStartEditor.row = obj.row;
            this.dtStartEditor.col = obj.col;
        },
        destroyEditorTimer: function() {
            this.dtStartEditor.cancel();
            this.dtStartEditor = null;
            delete this.dtStartEditor;
        },
        startEditor: function(row, col) {
            if(Rui.platform.isMobile) {
                this.doStartEditor({ row: row, col: col });
            } else {
                if(this.dtStartEditor && (this.dtStartEditor.row !== row || this.dtStartEditor.col !== col)) this.destroyEditorTimer();
                if(!this.dtStartEditor) this.createEditorTimer({ row: row, col: col });
            }
        },
        doStartEditor: function(options) {
            try {
                if(this.dtStartEditor) this.destroyEditorTimer();
                var row = options.row, col = options.col;
                if(this.isEdit === true || this.editable == false) return;
                if(this.autoToEdit === true) this.stopEditor(false);
                if(row < 0 || col < 0) return;
                var view = this.getView();
                if(view.isSyncDataSet() == false) return;
                var cm = view.getColumnModel();
                var column = cm.getColumnAt(col, true);
                if(this.skipRowCellEvent !== true) {
                    var rowDom = view.getRowDom(row, 1);
                    if (rowDom && Dom.hasClass(rowDom, this.CLASS_GRID_ROW_EDITABLE) == false) {
                        rowDom = null;
                        return;
                    }
                }
                var cellDom = view.getCellDom(row, col);    
                if(!cellDom) return;
                var region = this.getCellRegion(row, col);
                if(!region)
                    region = Dom.getRegion(cellDom);
                if(cm.freezeIndex > -1 && cm.freezeIndex < col) {
                    var firstLiRight = view.getFirstLiEl().getRight();
                    region.left = (region.left < firstLiRight) ? firstLiRight : region.left;
                    region.right = (region.right > view.scrollerEl.getRight()) ? view.scrollerEl.getRight() : region.right;
                }
                this.restartCount = this.restartCount || 0;
                if(view.scroller) {
                    var scrollRight = view.scrollerEl.getRight() - view.scroller.getScrollbarSize();
                    var scrollBottom = view.scrollerEl.getBottom() - view.scroller.spaceBottom - view.scroller.getScrollbarSize(true);
                    var right = region ? scrollRight - region.right : 0;
                    if(this.restartCount < 2 && (this.isReStartEditor !== true && (region && scrollRight < (region.right - 2)) ||
                        (region && scrollBottom <= (region.bottom - 2)))) {
                        if(false && region && right < 20) {
                            region.right += right;
                        } else {
                            Rui.later(view.renderDataTime + 10, this, this.restartEditor, [row, col]);
                            this.isReStartEditor = true;
                            if(this.dtStartEditor) this.destroyEditorTimer();
                            this.restartCount++;
                            return;
                        }
                    }
                }
                this.isReStartEditor = false;
                delete this.restartCount;
                var edit = cm.getCellConfig(row, column.id, 'editable');
                if(edit === false) return;
                if(this.rendererConfig !== true) {
                    if(!cellDom || !column.isEditable()) return;
                } else if(cellDom && Dom.hasClass(cellDom, this.CLASS_GRID_CELL_EDITABLE) == false)
                        return;
                cm.editors = cm.editors || {};
                var ds = view.getDataSet();
                var record = ds.getAt(row);
                if(record.state == Rui.data.LRecord.STATE_DELETE) return;
                var editor = column.editor;
                var editorId = editor ? editor.editorId : null;
                var cellEditor = null;
                if(this.fragmentEditorList) {
                    this.fragmentToEditor();
                }
                cellEditor = cm.editors[editorId];
                var currVal;
                if(record != undefined){ 
                    currVal = record.get(column.field);
                    this.systemSelect = true;
                }
                delete this.emptyValue;
                if(currVal == null || currVal == undefined || currVal === '') {
                    this.emptyValue = currVal;
                    currVal = '';
                }
                if(!cellEditor) {
                    if(editor == null) return;
                    column.editor = editor;
                    editor.gridFieldId = column.id;
                    editor.gridPanel = this;
                    editor.invalidBlur = false;
                    editorId = Rui.useFixedId() ? 'ep-' + this.gridId + '-' + column.id : 'ep_' + Rui.id();
                    cellEditor = new Rui.ui.grid.LEditorPanel({
                        id: editorId,
                        editor: editor,
                        column: column,
                        view: view
                    });
                    cellEditor.render(view.getScrollerEl().dom);
                    cm.editors[editorId] = cellEditor;
                    if (!editor._rendered) {
                        editor.render(cellEditor.getContainer());
                        editor.editorId = editorId;
                    }
                    editor.unOn('changed', this.onEditorChanged, this);
                    editor.on('changed', this.onEditorChanged, this, true);
                    editor.unOn('blur', this.onEditorBlur, this);
                    editor.on('blur', this.onEditorBlur, this, true);
                    editor.unOn('specialkey', this.onEditorKey, this);
                    editor.on('specialkey', this.onEditorKey, this, true);
                    editor.on('keydown', this.onEditorKeyDown, this, true);
                    ds.unOn('update', this.onDataSetChanged, this);
                    ds.on('update', this.onDataSetChanged, this, true, {system: true});
                }
                if(this.fireEvent('beforeEdit', { target: this, row: row, col:col, colId: column.getId() }) == false) return;
                Ev.removeListener(Rui.getBody(true), 'selectstart', this.onSelectStart, this);
                cellEditor.show();
                if(this.multiLineEditor && editor.multiLine === true)
                    if(view.el.getBottom() > (region.bottom + 80)) region.bottom += 50;
                    else region.top -= 50;
                cellEditor.setRegion(region);
                editor.valid();
                editor.lastValue = null;
                editor.setValue(currVal, true);
                editor.focus();
                this.editColId = column.getField();
                this.currentCellEditor = cellEditor;
                view.reOnDeferOnBlur();
                this.isEdit = true;
                delete this._applyValue;
                this.beforeEditorValue = currVal;
                this.editRow = row;
                this.editCol = col;
                this.focusTime = new Date();
                return true;
            } finally {
                view = cm = column = region = ds = editor = cellEditor = editor = null;
            }
        },
        restartEditor: function(row, col) {
            this.startEditor(row, col);
        },
        getCellRegion: function(row, col){
            try{
                var view = this.view,
                cm = view.getColumnModel();
                var rowDom;
                if(cm.isMerged()){
                    rowDom = view.getRowDom(row, 1),
                    headerCells = view.getHeaderCellEls();
                    var rowRegion;
                    if(Rui.browser.msie){
                        rowRegion = Dom.getRegion(rowDom.cells[rowDom.cells.length -1]);
                    }else{
                        rowRegion = Dom.getRegion(rowDom);
                    }
                    var headerRegion = Dom.getRegion(headerCells.getAt(col).dom);
                    var region = {
                            '0': headerRegion.left,
                            left: headerRegion.left,
                            '1': rowRegion.top,
                            top: rowRegion.top,
                            right: headerRegion.right,
                            bottom: rowRegion.bottom
                    };
                    return region;
                }else{
                    var cellDom = view.getCellDom(row, col);
                    return Dom.getRegion(cellDom);
                }
            }catch(err){
            } finally {
                view = cm = rowDom = null;
            }
        },
        onEditorKey: function(e) {
            var k = Rui.util.LKey.KEY;
            if(e.keyCode == k.TAB || e.keyCode == k.ESCAPE || e.keyCode == k.ENTER) {
                if(this.currentCellEditor) {
                    if(this.currentCellEditor.editor.onCanBlur.call(this.currentCellEditor.editor, e) == false) return;
                }
            }
            var sm = this.getSelectionModel();
            var row = sm.getRow(), col = sm.getCol();
            var view = this.getView();
            var editor = this.currentCellEditor ? this.currentCellEditor.editor : null;
            switch (e.keyCode) {
                case k.DOWN:
                case k.UP:
                    if(!editor || editor.multiLine !== true) {
                        var dir = (e.keyCode == k.UP) ? -1 : 1;
                        var moveRow = sm.getMoveRow(row, dir);
                        if(moveRow < view.getDataCount() && moveRow >= 0) {
                            this.stopEditor(true);
                            this.systemSelect = true;
                            this.doSelectCell(moveRow, col, e.shiftKey ? false : undefined);
                        }
                        this.focusRow();
                        Ev.stopEvent(e);
                    }
                    break;
                case k.PAGE_DOWN:
                    if(!editor || editor.multiLine !== true) {
                        this.stopEditor(true);
                        this.systemSelect = true;
                        sm.onPageDown(e);
                        this.focusRow();
                        Ev.stopEvent(e);
                    }
                    break;
                case k.PAGE_UP:
                    if(!editor || editor.multiLine !== true) {
                        this.stopEditor(true);
                        this.systemSelect = true;
                        sm.onPageUp(e);
                        this.focusRow();
                        Ev.stopEvent(e);
                    }
                    break;
                case k.TAB:
                    this.stopEditor(true);
                    this.systemSelect = true;
                    sm.onTabMoveCell(e);
                    this.focusRow();
                    Ev.stopEvent(e);
                    break;
                case k.ESCAPE:
                    this.stopEditor(false);
                    view.focus();
                    Ev.stopEvent(e);
                    break;
                case k.ENTER:
                    if(this.isEdit) {
                        if(!editor || editor.multiLine !== true) {
                            this.stopEditor(true);
                            if(sm.enterToMove === true && c && c.ignoreViewFocus) sm.onTabMoveCell(e);
                            var cm = view.getColumnModel();
                            var c = cm.getColumnAt(col, true);
                            if ((c && c.ignoreViewFocus !== false) || window.isRuiBlur !== false) this.focusRow();
                            Ev.stopEvent(e);
                        }
                    }
                    break;
                case 70: 
                    if(e.ctrlKey == true) {
                        this.stopEditor(false);
                        this.showSearchDialog(e);
                        Ev.stopEvent(e);
                    }
                    break;
                case 86: 
                    if(!editor || (editor && editor.multiLine !== true)) {
                        if (e.ctrlKey == true) {
                            if(false) {
                                if(!editor || (Rui._clipboardData && Rui._clipboardData.indexOf('\n') > -1)) {
                                    this.stopEditor(false);
                                    if(Rui._clipboardData) this.setClipData(Rui._clipboardData);
                                }
                            } else {
                                if (Rui.browser.msie) { 
                                    value = Rui.util.LString.getClipboard();
                                    if(value && (value.indexOf('\n')> -1 || value.indexOf('\t')> -1)) {
                                        this.stopEditor(false);
                                        if(this.rtrimWhiteSpace)
                                            value = value.replace(/\s+$/g,'');
                                        this.setClipData(value);
                                        Ev.stopEvent(e);
                                    }
                                } else {
                                    if(this.useClipboard == true) {
                                        return false;
                                    }
                                }
                            }
                        }
                    }
                    break;
            }
            sm = view = null;
        },
        onEditorKeyDown: function(e) {
            if(e.keyCode === 112) { 
                window.open(Rui.getRootPath() + '/docs/guide/guide.html');
                Ev.stopEvent(e);
            } else if(e.keyCode === 229) { 
                if(e.ctrlKey === true) {
                    var row = this.editRow, col = this.editCol, cm = this.columnModel, view = this.getView();
                    var column = cm.getColumnAt(col, true);
                    var record = view.getDataSet().getAt(row);
                    var originData = record.getOriginData();
                    var val = originData[column.field];
                    record.set(column.field, val);
                }
            }
        },
        stopEditor: function(isApply) {
            if(this.dtStartEditor) this.destroyEditorTimer();
            if(this.isEdit === false || this.editable == false) return;
            var row = this.editRow, col = this.editCol;
            if(Rui.isUndefined(row) || Rui.isUndefined(col)) {
                throw new Error('stopEditor position error!');
            }
            if(Rui.platform.isMobile && this.focusTime) {
                var term = new Date().getTime() - this.focusTime.getTime();
                if(term < 300) return;
            }
            this.applyValue(row, col, isApply, true);
            delete this.editColId;
            delete this.editRow;
            delete this.editCol;
            this.isEdit = false;
            Ev.addListener(Rui.getBody(true), 'selectstart', this.onSelectStart, this, true);
            if(this.currentCellEditor) this.currentCellEditor.hide();
            this.currentCellEditor = null;
            return true;
        },
        onViewBlur: function(e) {
            this.onApplyStopEditor();
            Ev.removeListener(Rui.getBody(true), 'selectstart', this.onSelectStart, this);
        },
        onSelectStart: function(e) {
            return false;
        },
        onApplyStopEditor: function() {
            this.stopEditor(true);
        },
        onReStartEditor: function() {
            if(this.dtStartEditor) {
                var view = this.getView();
                var sm = this.getSelectionModel();
                Rui.later(view.renderDataTime + 10, this, this.restartEditor, [sm.getRow(), sm.getCol()]);
            }
            this.stopEditor(true);
        },
        applyValue: function(row, col, isApply, isStopEditor) {
            var view = this.getView();
            var columnModel = view.getColumnModel();
            var column = columnModel.getColumnAt(col, true);
            var record, editor, cellEditor;
            if (column) {
                columnModel.editors = columnModel.editors || {};
                record = view.getDataSet().getAt(row);
                editor = column.editor;
                var editorId = editor ? editor.editorId : null;
                cellEditor = columnModel.editors[editorId];
                if(!Rui.isUndefined(cellEditor)) {
                    if(cellEditor.isShow()) {
                        if(isApply === true && editor.fieldObject === true) {
                            if(record != null) {
                                var val = null;
                                val = editor.getValue();
                                if(this.beforeEditorValue !== val) {
                                    if(Rui.isEmpty(val) && !Rui.isUndefined(this.emptyValue)) val = this.emptyValue;
                                    if(column.type == 'number' && typeof val == 'string')
                                        val = (val == '') ? 0 : parseFloat(val, 10);
                                    if (column.properties) {
                                        var prop = column.properties[record.id];
                                        prop = prop || {};
                                        prop.val = undefined;
                                    }
                                    if(Rui.isUndefined(this._applyValue) || this.beforeEditorValue != val) {
                                        this._applyValue = val;
                                        record.set(column.field, val, {system: true});
                                        this.beforeEditorValue = val;
                                    }
                                }
                            }
                        }
                        if (isStopEditor) {
                            cellEditor.hide();
                            if(editor.isFocus) {
                                editor.onBlur({ target: editor });
                            }
                        }
                    }
                }
            }
            view = columnModel = column = record = null;
        },
        focusRow: function() {
            var sm = this.getSelectionModel(), view = this.getView();
            if(this.isEdit) {
                this.currentCellEditor.focus();
            } else {
                view.focusRow(sm.getRow(), sm.getCol());
            }
            view = sm = null;
        },
        setEditable: function(editable) {
            this.editable = editable;
            if(this.view) this.view.updateEditable(editable);
        },
        isEditable: function() {
            return this.editable;
        },
        getView: function() {
            if(this.view == null) {
                var rowModel = this.getRowModel();
                this.viewConfig = Rui.applyIf(this.viewConfig, {
                    rowModel: rowModel
                });
                this.view = new Rui.ui.grid.LBufferGridView(this.viewConfig);
                var me = this;
                var canBlurDelegate = function(e) {
                    if(me.isEdit == true) return me.currentCellEditor.editor.onCanBlur.call(me.currentCellEditor.editor, e);
                };
                this.view.onCanBlur = canBlurDelegate;
                rowModel = null;
            }
            return this.view;
        },
        getRowModel: function() {
            if(this.rowModel == null) {
                this.rowModel = new Rui.ui.grid.LRowModel({
                    renderer: function(css, row, record) {
                        css.push(Rui.ui.grid.LGridPanel.prototype.CLASS_GRID_ROW_EDITABLE);
                        return css;
                    }
                });
                this.rowModel.bindEvent(this);
            }
            return this.rowModel;
        },
        getEditView: function() {
            if(!this.editViewEl) {
                if (!this.rowEditorPanel) {
                    this.editViewEl = Rui.createElements('<div class="L-grid-row-inline-editor"></div>').getAt(0);
                    this.editViewEl.appendTo(this.body);
                    this.rowEditorPanelWidth = this.element.offsetWidth;
                } else {
                    this.editViewEl = Rui.get(this.rowEditorPanel);
                    this.rowEditorPanelWidth = this.editViewEl.getWidth() - 20;
                }
                this.editViewEl.addClass('L-grid-row-editor');
                Rui.createElements('<div class="L-grid-row-editor-inner"></div>').appendTo(this.editViewEl);
                this.editViewEl.hide();
                this.editViewEl.on('click', function(e){
                    Ev.stopEvent(e);
                });
            }
            return this.editViewEl;
        },
        initColumns: function() {
            var view = this.getView();
            var cm = view.getColumnModel();
            for (var i = 0, len = cm.getColumnCount(); i < len; i++) {
                var c = cm.getColumnAt(i);
                c.unOn('hidden', this.onColumnHidden, this);
                c.on('hidden', this.onColumnHidden, this, true);
                c = null;
            }
            cm.unOn('columnsChanged', this.onColumnsChanged, this);
            cm.on('columnsChanged', this.onColumnsChanged, this, true);
            view = cm = null;
        },
        onColumnHidden: function(e) {
            this.editorToFragment();
        },
        showSearchDialog: function(e) {
            if(!this.searchDialog) {
                var ds = this.dataSet;
                var sm = this.getSelectionModel();
                var cm = this.columnModel;
                var view = this.getView();
                var grid = this;
                var bodyHtml = '<div class="L-title">Find in column.</div>';
                bodyHtml += '</div>';
                bodyHtml += '<input type="text" name="searchText" class="L-search-text" value="">';
                bodyHtml += '<div class="L-infomation">Enter: Next, Shift+Enter:Prev</div>';
                this.searchDialog = new Rui.ui.LDialog( {
                    id: 'LGrid-srch',
                    defaultCss: 'L-grid-search-dialog',
                    width: 300,
                    header: 'Search',
                    body: bodyHtml,
                    visible: false,
                    modal: false,
                    buttons: [
                        {
                            text: 'Next',
                            disableDbClick: false,
                            handler: function() {
                                var val = this.searchInputEl.getValue();
                                if(!val) return;
                                val = val.toLowerCase();
                                var searchFlag = false;
                                var searchCount = 0;
                                var startCol = sm.getCol() + 1;
                                for (var row = ds.getRow(), rowLen = ds.getCount(); row < rowLen; row++) {
                                    var record = ds.getAt(row);
                                    for (var i = startCol, len = cm.getColumnCount(true); i < len; i++) {
                                        var column = cm.getColumnAt(i, true);
                                        var findVal = column.field ? record.get(column.field) : '';
                                        if (!(column instanceof Rui.ui.grid.LSelectionColumn || column instanceof Rui.ui.grid.LStateColumn)) {
                                            var p = {
                                                id: column.id,
                                                first_last: '',
                                                css: [],
                                                style: '',
                                                editable: column.editable,
                                                tooltip: true,
                                                tooltipText: '',
                                                istyle:'',
                                                clipboard: true
                                            };
                                            findVal = view.getRendererValue(findVal, p, record, column, row, i) || '';
                                            findVal += '';
                                            if(findVal && findVal.toLowerCase().indexOf(val) > -1) {
                                                searchFlag = true;
                                                grid.selectCell(row, column.id, false);
                                                this.searchInputEl.focus();
                                                return;
                                            }
                                        }
                                    }
                                    startCol = 0;
                                    if(row == rowLen-1 && (searchFlag || searchCount==0)){
                                        row = -1;
                                        searchCount++;
                                        searchFlag = false;
                                    }
                                }
                            }
                        },{
                            text: 'Previous',
                            disableDbClick: false,
                            handler: function() {
                                var val = this.searchInputEl.getValue();
                                if(!val) return;
                                var searchFlag = false;
                                var searchCount = 0;
                                val = val.toLowerCase();
                                var len = cm.getColumnCount(true);
                                var startCol = sm.getCol() - 1;
                                for (var row = ds.getRow(); row > -1; row--) {
                                    var record = ds.getAt(row);
                                    for (var i = startCol; 0 <= i; i--) {
                                        var column = cm.getColumnAt(i, true);
                                        var findVal = column.field ? record.get(column.field) : '';
                                        if (!(column instanceof Rui.ui.grid.LSelectionColumn || column instanceof Rui.ui.grid.LStateColumn)) {
                                            var p = {
                                                id: column.id,
                                                first_last: '',
                                                css: [],
                                                style: '',
                                                editable: column.editable,
                                                tooltip: true,
                                                tooltipText: '',
                                                istyle:'',
                                                clipboard: true
                                            };
                                            findVal = view.getRendererValue(findVal, p, record, column, row, i) || '';
                                            findVal += '';
                                            if(findVal && findVal.toLowerCase().indexOf(val) > -1) {
                                                searchFlag = true;
                                                grid.selectCell(row, column.id, false);
                                                this.searchInputEl.focus();
                                                return;
                                            }
                                        }
                                    }
                                    startCol = len - 1;
                                    if(row == 0 && (searchFlag || searchCount==0)){
                                        row = ds.getCount();
                                        searchCount++;
                                        searchFlag = false;
                                    }
                                }
                            }
                        },{
                            text: 'Close',
                            handler: function() {
                                this.cancel(false);
                            }
                        }]
                });
                this.searchDialog.render(document.body);
                this.searchDialog.searchInputEl = this.searchDialog.getContainer().select('.L-grid-search-dialog .L-search-text').getAt(0);
                this.searchDialog.searchInputEl.on('keydown', this.onSearchDialogKeyDown, this, true);
            }
            this.searchDialog.show(false);
            this.searchDialog.getContainer().select('.L-search-text').getAt(0).focus();
        },
        onSearchDialogKeyDown: function(e) {
            var k = Rui.util.LKey.KEY;
            if(e.shiftKey && e.keyCode === k.ENTER)
                this.searchDialog.getButtons()[1].click();
            else if(e.keyCode === k.ENTER)
                this.searchDialog.getButtons()[0].click();
            else if(e.keyCode == k.ESCAPE)
                this.searchDialog.hide(false);
        },
        multiCellDeletable: function() {
            var sm = this.getSelectionModel(), dataSet = this.dataSet;
            var selection = sm.getSelection(), cm = this.columnModel;
            var rowId = null;
            for (rowId in selection) {
                var record = dataSet.get(rowId);
                if(record) {
                    var rowObj = selection[rowId];
                    var colId = null;
                    for (colId in rowObj) {
                        var column = columnModel.getColumnById(colId);
                        if(!column) continue;
                        if(!column.field || !column.editor) continue;
                        var row = dataSet.indexOfKey(rowId);
                        var edit = cm.getCellConfig(row, column.id, 'editable');
                        if(Rui.isUndefined(edit))
                            edit = column.editable;
                        if (edit) {
                            if(row > -1) {
                                var field = dataSet.getFieldById(column.field);
                                dataSet.setNameValue(row, column.field, null);
                            }
                        }
                    }
                }
            }
        },
        updateColumnsAutoWidth: function() {
            var width = this.width;
            var cm = this.columnModel;
            if(cm.isAutoWidth() && this.oldWidth != width && Math.abs(this.oldWidth - width) > this.contentResizeWidth) {
                var tWidth = cm.getTotalWidth(true);
                var scrollbarSize = Rui.ui.LScroller.SCROLLBAR_SIZE;
                var maxWidth = this.width - ((this.scrollerConfig && this.scrollerConfig.scrollbar === 'n') ? 0 : scrollbarSize);
                if (tWidth < maxWidth || cm.adjustAutoWidth === true)
                    this.columnModel.updateColumnsAutoWidth(maxWidth);
            }
        },
        destroy: function () {
            var view = this.getView();
            if(Rui.isUndefined(this.reMon) == false)
                this.reMon.unOnAll();
            if(this.bodyEl) {
                this.bodyEl.remove();
                delete this.bodyEl;
            }
            if(this.excelDialog) this.excelDialog.destroy();
            var isExcel = view.isExcel;
            view.destroy();
            if(this.selectionModel) this.selectionModel.destroy();
            if(this.rowModel) this.rowModel.destroy();
            var cm = this.columnModel;
            for (var i = 0, len = cm.getColumnCount() ; i < len; i++) {
                var c = cm.getColumnAt(i);
                if(c.editor && c.editor.gridFixed)
                    c.editor.gridUnBindEvent(this);
            }
            if(isExcel !== true) cm.destroy();
            Rui.ui.grid.LGridPanel.superclass.destroy.call(this);
            view = null;
        },
        focus: function() {
            var view = this.getView();
            if(view) view.focus();
            else this.el.focus();
        },
        blur: function() {
            var view = this.getView();
            if(view) view.blur();
            else this.el.blur();
        },
        showTabletViewer: function() {
            if(this.tabletMode !== true) return;
            if(Rui._tabletData) return;
            Rui._tabletData = { gridPanel: this }
            document.body.scrollTop = 0;
            var h = Rui.getBody().getHeight();
            var url = (this.tabletViewerUrl) ? this.tabletViewerUrl : Rui.getRootPath() + '/plugins/ui/tabletViewer.html';
            this.tabletViewerEl = Rui.createElements('<div class="L-ux-container"><iframe frameborder="0" src="' + url + '" width="100%" height="100%"></iframe></div>').getAt(0);
            Rui._tabletViewerEl = this.tabletViewerEl;
            var bodyEl = Rui.getBody();
            bodyEl.appendChild(this.tabletViewerEl);
            this.oldOverflow = bodyEl.getStyle('overflow');
            bodyEl.setStyle('overflow', 'hidden');
            var uxContainer = Rui.select('.L-ux-container').getAt(0);
            this.resizeTabletViewer = setInterval(function() {
                var ifm = uxContainer.select('iframe').getAt(0).dom;
                var contentDocument = ifm.contentWindow.document;
                var tv = null;
                if(!contentDocument.body) return;
                for (var i = 0 ; i < contentDocument.body.childNodes.length; i++) {
                    var id = contentDocument.body.childNodes[i].id;
                    if(id == 'LTabletViewport') {
                        tv = contentDocument.body.childNodes[i];
                        break;
                    }
                }
                if(!tv) return;
                h = Rui.get(tv).getHeight();
                if(h < self.innerHeight) h = self.innerHeight - 12;
                uxContainer.setStyle('height', h + 'px');
            }, 500);
        },
        closeTabletViewer: function() {
            delete Rui._tabletData;
            this.tabletViewerEl.remove();
            delete Rui._tabletViewerEl;
            Rui._tabletViewerEl = null;
            Rui.getBody().setStyle('overflow', this.oldOverflow);
            delete this.oldOverflow;
            clearInterval(this.resizeTabletViewer);
        },
        toString: function() {
            return 'Rui.ui.grid.LGridPanel ' + this.id;
        }
    });
})();
(function() {
    Rui.ui.grid.LEditorPanel = function(oConfig) {
        var config = oConfig || {};
        Rui.ui.grid.LEditorPanel.superclass.constructor.call(this, config);
        config = null;
    };
    Rui.extend(Rui.ui.grid.LEditorPanel, Rui.ui.LUIComponent, {
        otype: 'Rui.ui.grid.LEditorPanel',
        editor: null,
        column:null,
        view:null,
        afterRender: function(container) {
            var el = this.el;
            el.addClass('L-editor-panel');
            el.addClass('L-hide-display');
            var editor = this.column.getEditor();
            if(!Rui.isUndefined(editor.marginLeft)){
                if(!Rui.rightToLeft()) editor.marginLeft = -2;
                else editor.marginLeft = -1;
            }
            editor.on('keydown', Rui.util.LEvent.stopPropagation);
            editor.on('keypress', Rui.util.LEvent.stopPropagation);
            this.el = el;
            el = editor = null;
        },
        setRegion: function(region) {
            var editor = this.column.getEditor();
            this.el.setRegion(region);
            var width = region.right - region.left;
            this.el.setWidth(width);
            var lrBWidth = this.el.getBorderWidth('lr');
            if(Rui.browser.msie67) lrBWidth++;
            editor.setWidth(width - lrBWidth);
            var height = region.bottom - region.top;
            this.el.setHeight(height);
            if(editor.setHeight) {
                var tbBWidth = this.el.getBorderWidth('tb');
                if(Rui.browser.msie67) tbBWidth++;
                editor.setHeight(height - tbBWidth);
            }
            editor = null;
        }
    });
})();
Rui.ui.grid.LGridScroller = function(config){
    config = config || {};
    config = Rui.applyIf(config, Rui.getConfig().getFirst('$.ext.gridScroller.defaultProperties'));
    Rui.ui.grid.LGridScroller.superclass.constructor.call(this, config);
};
Rui.extend(Rui.ui.grid.LGridScroller, Rui.ui.LScroller, {
    otype: 'Rui.ui.grid.LGridScroller',
    manageSteps: true,
    scrollStep: 1,
    wheelStep: 1,
    useVirtual: true,
    scrollCount: 0,
    initComponent: function(config){
        Rui.ui.grid.LGridScroller.superclass.initComponent.call(this, config);
        this.setSizes(this.scrollCount, this.scrollStep, this.wheelStep);
    },
    doRender: function(){
        this.scrollEl = Rui.get(this.createElement());
        this.scrollEl.addClass('L-scroll');
        Rui.get(this.el.dom.firstChild).insertBefore(this.scrollEl);
        this.scrollEl.appendChild(this.contentEl);
        this.setupSizes();
        this.scrollTop = 0;
    },
    setupScrollbars: function(){
        Rui.ui.grid.LGridScroller.superclass.setupScrollbars.call(this);
        var Evt = Rui.util.LEvent;
        if(this.yScrollbarEl && this.controlScrollbarDrag == true){
        	Evt.removeListener(this.yScrollbarEl.dom, 'mousedown', this.onYScrollbarMousedown);
        	Evt.addListener(this.yScrollbarEl.dom, 'mousedown', this.onYScrollbarMousedown, this, true);
        	if(Rui.browser.msie678){
        		Evt.removeListener(this.yScrollbarEl.dom, 'mousemove', this.onYScrollbarMouseup);
            	Evt.addListener(this.yScrollbarEl.dom, 'mousemove', this.onYScrollbarMouseup, this, true);
        	}else{
            	Evt.removeListener(this.yScrollbarEl.dom, 'mouseup', this.onYScrollbarMouseup);
            	Evt.addListener(this.yScrollbarEl.dom, 'mouseup', this.onYScrollbarMouseup, this, true);
        	}
        }
        if(this.manageSteps && !Rui.platform.mac && !Rui.browser.chrome){
            if(this.yScrollbarEl){
                if(!this.yScrollbarPrevButtonEl){
                    this.yScrollbarPrevButtonEl = Rui.get(document.createElement('div'));
                    this.el.appendChild(this.yScrollbarPrevButtonEl);
                    this.yScrollbarPrevButtonEl.addClass('L-scrollbar-y-btn-prev');
                    Evt.addListener(this.yScrollbarPrevButtonEl.dom, 'mousedown', this.onMousedownYPrev, this, true);
                    Evt.addListener(this.yScrollbarPrevButtonEl.dom, 'mouseup', this.onMouseup, this, true);
                    Evt.addListener(this.yScrollbarPrevButtonEl.dom, 'mouseout', this.onMouseup, this, true);
                    this.yScrollbarNextButtonEl = Rui.get(document.createElement('div'));
                    this.el.appendChild(this.yScrollbarNextButtonEl);
                    this.yScrollbarNextButtonEl.addClass('L-scrollbar-y-btn-next');
                    Evt.addListener(this.yScrollbarNextButtonEl.dom, 'mousedown', this.onMousedownYNext, this, true);
                    Evt.addListener(this.yScrollbarNextButtonEl.dom, 'mouseup', this.onMouseup, this, true);
                    Evt.addListener(this.yScrollbarNextButtonEl.dom, 'mouseout', this.onMouseup, this, true);
                }
                var bottom = 0;
                if(this.xScrollbarEl)
                    bottom += this.scrollbarSize;
                bottom += this.getSpace('bottom');
                this.yScrollbarNextButtonEl.setStyle('bottom', bottom + 'px');
            }else{
                if(this.yScrollbarPrevButtonEl){
                    Evt.removeListener(this.yScrollbarPrevButtonEl.dom, 'mousedown', this.onMousedownYPrev);
                    Evt.removeListener(this.yScrollbarPrevButtonEl.dom, 'mouseup', this.onMouseup);
                    Evt.removeListener(this.yScrollbarPrevButtonEl.dom, 'mouseout', this.onMouseup);
                    this.yScrollbarPrevButtonEl.remove();
                    this.yScrollbarPrevButtonEl = null;
                    Evt.removeListener(this.yScrollbarNextButtonEl.dom, 'mousedown', this.onMousedownYNext);
                    Evt.removeListener(this.yScrollbarNextButtonEl.dom, 'mouseup', this.onMouseup);
                    Evt.removeListener(this.yScrollbarNextButtonEl.dom, 'mouseout', this.onMouseup);
                    this.yScrollbarNextButtonEl.remove();
                    this.yScrollbarNextButtonEl = null;
                }
            }
            if(this.xScrollbarEl){
                if(!this.xScrollbarPrevButtonEl){
                    this.xScrollbarPrevButtonEl = Rui.get(document.createElement('div'));
                    this.el.appendChild(this.xScrollbarPrevButtonEl);
                    this.xScrollbarPrevButtonEl.addClass('L-scrollbar-x-btn-prev');
                    Evt.addListener(this.xScrollbarPrevButtonEl.dom, 'mousedown', this.onMousedownXPrev, this, true);
                    Evt.addListener(this.xScrollbarPrevButtonEl.dom, 'mouseup', this.onMouseup, this, true);
                    Evt.addListener(this.xScrollbarPrevButtonEl.dom, 'mouseout', this.onMouseup, this, true);
                    this.xScrollbarNextButtonEl = Rui.get(document.createElement('div'));
                    this.el.appendChild(this.xScrollbarNextButtonEl);
                    this.xScrollbarNextButtonEl.addClass('L-scrollbar-x-btn-next');
                    Evt.addListener(this.xScrollbarNextButtonEl.dom, 'mousedown', this.onMousedownXNext, this, true);
                    Evt.addListener(this.xScrollbarNextButtonEl.dom, 'mouseup', this.onMouseup, this, true);
                    Evt.addListener(this.xScrollbarNextButtonEl.dom, 'mouseout', this.onMouseup, this, true);
                }
                if(this.yScrollbarEl){
                    this.xScrollbarNextButtonEl.setStyle('right', this.scrollbarSize + 'px');
                }else{
                    this.xScrollbarNextButtonEl.setStyle('right', '0px');
                }
            }else{
                if(this.xScrollbarPrevButtonEl){
                    Evt.removeListener(this.xScrollbarPrevButtonEl.dom, 'mousedown', this.onMousedownXPrev);
                    Evt.removeListener(this.xScrollbarPrevButtonEl.dom, 'mouseup', this.onMouseup);
                    Evt.removeListener(this.xScrollbarPrevButtonEl.dom, 'mouseout', this.onMouseup);
                    this.xScrollbarPrevButtonEl.remove();
                    this.xScrollbarPrevButtonEl = null;
                    Evt.removeListener(this.xScrollbarNextButtonEl.dom, 'mousedown', this.onMousedownXNext);
                    Evt.removeListener(this.xScrollbarNextButtonEl.dom, 'mouseup', this.onMouseup);
                    Evt.removeListener(this.xScrollbarNextButtonEl.dom, 'mouseout', this.onMouseup);
                    this.xScrollbarNextButtonEl.remove();
                    this.xScrollbarNextButtonEl = null;
                }
            }
        }
    },
    setupSizes: function(){
        if(this.isWidthZero())
            return false;
        Rui.ui.grid.LGridScroller.superclass.setupSizes.call(this);
        if(Rui.browser.msie10){
            if(this.yScrollbarPrevButtonEl){
                this.yScrollbarPrevButtonEl.setHeight(34);
                this.yScrollbarNextButtonEl.setHeight(34);
            }
            if(this.xScrollbarPrevButtonEl){
                this.xScrollbarPrevButtonEl.setWidth(34);
                this.xScrollbarNextButtonEl.setWidth(34);
            }
        }
    },
    setSizes: function(scrollCount, scrollStep, wheelStep, touchScrollStep){
        this.scrollCount = scrollCount;
        var height = 40;
        if(Rui.browser.msie){
            if(scrollCount < 1)
                scrollCount = 1;
            height = 1000000 / scrollCount;
            if(height > 10)
                height = 10;
        }
        this.virtualRowHeight = height;
        this.yScrollStep = this.virtualRowHeight * (scrollStep && scrollStep > 0 ? scrollStep : this.scrollStep);
        this.yWheelStep = this.virtualRowHeight * (wheelStep && wheelStep > 0 ? wheelStep : this.wheelStep);
        this.yTouchScrollStep = (touchScrollStep && touchScrollStep > 0 ? touchScrollStep : 3);
    },
    getStartRow: function(){
        if(this.scrollCount < 1)
            return 0;
        var top = this.getScrollTop(),
            start = top < 1 ? 0 : Math.floor(top / this.virtualRowHeight);
        return start;
    },
    getScrollRegion: function(){
        return this.scrollEl ? this.scrollEl.getRegion() : null;
    },
    getContentHeight: function(){
        return this.scrollCount * this.virtualRowHeight + this.getScrollHeight();
    },
    getMaxScrollTop: function(margin){
        return this.getContentHeight() - this.scrollEl.getHeight(true);
    },
    getMaxScrollLeft: function(margin){
        return this.getContentWidth() - this.scrollEl.getWidth(true);
    },
    getScrollTop: function(virtual){
        if(this.virtualScrollRate == 1 || virtual != true)
            return this.yScrollbarEl ? this.yScrollbarEl.dom.scrollTop : 0;
        else
            return this.scrollTop;
    },
    isStart: function(x){
        if(x)
            return this.getScrollLeft() == 0 ? true : false;
        else
            return this.getScrollTop() < this.virtualRowHeight ? true : false; 
    },
    isEnd: function(x){
        if(x)
            return !this.xScrollbarEl ? true : (this.getScrollLeft() >= this.getMaxScrollLeft() ? true : false);
        else
            return !this.yScrollbarEl ? true : (this.getScrollTop() > this.getMaxScrollTop() - this.virtualRowHeight ? true : false);
    },
    go: function(row, x){
        var p = row * this.getStep();
        return Rui.ui.grid.LGridScroller.superclass.go.call(this, p, x);
    },
    getPrevious: function(x){
        if(x)
            return this.getScrollLeft() - this.getStep(false, true);
        else{
            var maxScrollTop = this.getMaxScrollTop();
            if(this.getScrollTop() == maxScrollTop){
                var remain = maxScrollTop % this.getStep();
                return this.getScrollTop() - (remain ? remain : this.getStep());
            }
            return this.getScrollTop() - this.getStep();
        }
    },
    getScroll: function(){
        return {
            top: this.getScrollTop() / this.getStep(false),
            left: this.getScrollLeft() / this.getStep(false, true)
        };
    },
    onYScrollbarMousedown: function(e){
    	if(this.controlScrollbarDrag == true)
    		this._dragging = true;
    },
    onYScrollbarMouseup: function(e){
        if(this._dragging !== true) return;
        var scrollTop = (e && e.target) ? e.target.scrollTop : this.getScrollTop(),
            beforeScrollTop = this.scrollTop;
        scrollTop = this.virtualScrollRate * scrollTop;
        if(scrollTop !== beforeScrollTop){
            this.scrollTop = scrollTop;
            if (beforeScrollTop || scrollTop){
                this.fireEvent('scrollY', {
                    target: this,
                    beforeScrollTop: beforeScrollTop,
                    scrollTop: scrollTop,
                    isFirst: scrollTop === 0 ? true : false,
                    isEnd: scrollTop >= this.getMaxScrollTop() ? true : false,
                    isUp: beforeScrollTop < scrollTop ? false : true
                });
            }
        }
        this._dragging = false;
    },
    onMouseup: function(e){
        this.isDownClicked = false;
        Rui.util.LEvent.stopEvent(e);
    },
    onMousedownYPrev: function(e){
        if(this.needScroll.Y != true)
            return;
        this.goPrevious();
        Rui.util.LEvent.stopEvent(e);
        var me = this;
        me.isDownClicked = true;
        setTimeout(function(){
            if(me.isDownClicked == true){
                var later = Rui.later(50, me, function(){
                    if(this.isDownClicked != true || this.getScrollTop() < 1){
                        later.cancel();
                    }else{
                        this.goPrevious();
                    }
                }, null, true);
            }
        }, 250);
    },
    onMousedownYNext: function(e){
        if(this.needScroll.Y != true)
            return;
        this.goNext();
        Rui.util.LEvent.stopEvent(e);
        var me = this;
        me.isDownClicked = true;
        setTimeout(function(){
            if(me.isDownClicked == true){
                var later = Rui.later(50, me, function(){
                    if(this.isDownClicked != true || this.getScrollTop() >= this.getMaxScrollTop()){
                        later.cancel();
                    }else{
                        this.goNext();
                    }
                }, null, true);
            }
        }, 250);
    },
    onMousedownXPrev: function(e){
        if(this.needScroll.X != true)
            return;
        this.goPrevious(true);
        Rui.util.LEvent.stopEvent(e);
        var me = this;
        me.isDownClicked = true;
        setTimeout(function(){
            if(me.isDownClicked == true){
                var later = Rui.later(50, me, function(){
                    if(this.isDownClicked != true || this.getScrollTop() < 1){
                        later.cancel();
                    }else{
                        this.goPrevious(true);
                    }
                }, null, true);
            }
        }, 250);
    },
    onMousedownXNext: function(e){
        if(this.needScroll.X != true)
            return;
        this.goNext(true);
        Rui.util.LEvent.stopEvent(e);
        var me = this;
        me.isDownClicked = true;
        setTimeout(function(){
            if(me.isDownClicked == true){
                var later = Rui.later(50, me, function(){
                    if(this.isDownClicked != true || this.getScrollTop() >= this.getMaxScrollTop()){
                        later.cancel();
                    }else{
                        this.goNext(true);
                    }
                }, null, true);
            }
        }, 250);
    },
    onScrollY: function(e){
        if (!this.yScrollbarEl) return;
        if(this._dragging === true) return;
        var scrollTop = (e && e.target) ? e.target.scrollTop : this.getScrollTop(),
            beforeScrollTop = this.scrollTop;
        scrollTop = this.virtualScrollRate * scrollTop;
        if(scrollTop !== beforeScrollTop){
            this.scrollTop = scrollTop;
            if (beforeScrollTop || scrollTop){
            	if(this.ignoreEvent === true) {
            		delete this.ignoreEvent;
            		return;
            	}
                this.fireEvent('scrollY', {
                    target: this,
                    beforeScrollTop: beforeScrollTop,
                    scrollTop: scrollTop,
                    isFirst: scrollTop === 0 ? true : false,
                    isEnd: scrollTop >= this.getMaxScrollTop() ? true : false,
                    isUp: beforeScrollTop < scrollTop ? false : true
                });
            }
        }
    },
    onScrollX: function(e){
        if (!this.xScrollbarEl)
            return;
        var scrollLeft = (e && e.target) ? e.target.scrollLeft : this.getScrollLeft();
        var beforeScrollLeft = this.scrollLeft;
        if(this.createScrollLeft) {
        	this.scrollLeft = this.createScrollLeft;
        	this.setScrollLeft(this.scrollLeft);
        	delete this.createScrollLeft;
        }
        if (beforeScrollLeft !== scrollLeft || (e && e.isForce)){
            this.scrollEl.dom.scrollLeft = scrollLeft;
            this.scrollLeft = scrollLeft;
            if (beforeScrollLeft || scrollLeft){
                this.fireEvent('scrollX', {
                    target: this,
                    beforeScrollLeft: beforeScrollLeft,
                    scrollLeft: scrollLeft
                });
            }
        }
    },
    onTouchMove: function(e){
        if(this.touchStart === true){
            var t = e.targetTouches ? e.targetTouches[0] : e,
                mp = {
                    x: this.touchStartXY.x - (t.pageX),
                    y: this.touchStartXY.y - (t.pageY)
                },
                y = 0, x = 0;
            if(mp.y != 0){
                this._touchMoveY = this._touchMoveY || 0;
                this._touchMoveY += mp.y;
            }
            if(mp.x != 0){
                this._touchMoveX = this._touchMoveX || 0;
                this._touchMoveX += mp.x;
            }
            this.touchStartXY = {x: t.pageX, y: t.pageY};
            Rui.util.LEvent.preventDefault(e);
        }
    },
    onTouchEnd: function(e){
        if(this._touchMoveY && this._touchMoveX){
            if(Math.abs(this._touchMoveY) >= Math.abs(this._touchMoveX)){
                var coord = this.getScroll();
                this.go(coord.top + (this._touchMoveY > 0 ? this.yTouchScrollStep : -this.yTouchScrollStep));
            }else{
                var left = this.getScrollLeft();
                this.setScrollLeft(left + this._touchMoveX);
            }
        }
        this._touchMoveY = 0;
        this._touchMoveX = 0;
        Rui.ui.grid.LGridScroller.superclass.onTouchEnd.call(this, e);
    },
    destroy: function(){
        var Event = Rui.util.LEvent;
        if(this.yScrollbarEl){
        	Event.removeListener(this.yScrollbarEl.dom, 'mousedown', this.onYScrollbarMousedown);
        	Event.removeListener(this.yScrollbarEl.dom, 'mouseup', this.onYScrollbarMouseup);
        	Event.removeListener(this.yScrollbarEl.dom, 'mousemove', this.onYScrollbarMouseup);
        }
        if(this.xScrollbarPrevButtonEl){
            Event.removeListener(this.xScrollbarPrevButtonEl.dom, 'mousedown', this.onMousedownXPrev);
            Event.removeListener(this.xScrollbarPrevButtonEl.dom, 'mouseup', this.onMouseup);
            this.xScrollbarPrevButtonEl.remove();
            this.xScrollbarPrevButtonEl = null;
        }
        if(this.xScrollbarNextButtonEl){
            Event.removeListener(this.xScrollbarNextButtonEl.dom, 'mousedown', this.onMousedownXNext);
            Event.removeListener(this.xScrollbarNextButtonEl.dom, 'mouseup', this.onMouseup);
            this.xScrollbarNextButtonEl.remove();
            this.xScrollbarNextButtonEl = null;
        }
        if(this.yScrollbarPrevButtonEl){
            Event.removeListener(this.yScrollbarPrevButtonEl.dom, 'mousedown', this.onMousedownYPrev);
            Event.removeListener(this.yScrollbarPrevButtonEl.dom, 'mouseup', this.onMouseup);
            this.yScrollbarPrevButtonEl.remove();
            this.yScrollbarPrevButtonEl = null;
        }
        if(this.yScrollbarNextButtonEl){
            Event.removeListener(this.yScrollbarNextButtonEl.dom, 'mousedown', this.onMousedownYNext);
            Event.removeListener(this.yScrollbarNextButtonEl.dom, 'mouseup', this.onMouseup);
            this.yScrollbarNextButtonEl.remove();
            this.yScrollbarNextButtonEl = null;
        }
        Rui.ui.grid.LGridScroller.superclass.destroy.call(this);
    }
});
(function() {
    var Ev = Rui.util.LEvent;
    Rui.ui.grid.LActionMenuGrid = function(oConfig) {
    	var config = oConfig || {};
    	config.event = Rui.applyIf(config.event || {}, {
    		event: {
    			onCellClick: true
    		}
    	});
    	Rui.ui.grid.LActionMenuGrid.superclass.constructor.call(this, config);
    };
    Rui.extend(Rui.ui.grid.LActionMenuGrid, Rui.ui.LActionMenu, {
    	CSS_BASE: 'grid-action-menu',
    	onDblClick: function(e) {
    		Ev.stopEvent(e);
    		var gridPanel = this.gridPanel, cm = gridPanel.columnModel;
    		var sm = gridPanel.getSelectionModel();
    		var row = sm.getRow();
    		var col = sm.getCol();
    		var colId = cm.getColumnAt(col).id;
    		var dblClickEvent = { target: gridPanel, event: e, row: row, col: col, colId: colId };
            var ret = gridPanel.fireEvent('cellDblClick', dblClickEvent);
            if(ret === false) {
                gridPanel.getView().cancelViewFocus();
            }
            this.hideActionMenu();
    	},
    	onSumClick: function(e) {
    		Ev.stopEvent(e);
    		var gridPanel = this.gridPanel, cm = gridPanel.columnModel, sm = gridPanel.getSelectionModel(), ds = this.gridPanel.dataSet;
    		var rowId, selection = sm.getSelection();
            var val = 0;
            var cellCount = 0;
            var otherCellCount = 0;
    		for (rowId in selection) {
    			var rowObj = selection[rowId];
                var colValue = [];
                var row = ds.indexOfKey(rowId);
                if(row < 0) continue;
                var record = ds.getAt(row);
                for (var i = 0, len = cm.getColumnCount(true); i < len ; i++) {
                    var column = cm.getColumnAt(i, true);
                    if(rowObj[column.id]) {
                        if(column.field && column.type === 'number') {
                            val += (column.field) ? parseInt(record.get(column.field), 10): 0;
                            cellCount++;
                        } else otherCellCount++;
                    }
                }
    		}
            this.hideActionMenu();
            var mm = Rui.getMessageManager();
            var text = mm.get('$.base.msg136') + ' : ' + cellCount + ', ';
            if(otherCellCount > 0) text += mm.get('$.base.msg137') + ' : ' + otherCellCount + ', ';
            text += mm.get('$.base.msg123') + ' : ' + val + ', ';
            text += mm.get('$.base.msg138') + ' : ' + (val / cellCount);
    		Rui.alert(text);
        },
        onClipboardCopy: function(e) {
        	this.gridPanel.dataToClipboard();
        	this.hideActionMenu();
        },
        onClipboardPaste: function(e) {
        	this.gridPanel.clipboardToLoad();
        	this.hideActionMenu();
        }
    });
})();