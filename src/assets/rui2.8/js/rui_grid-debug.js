/*
 * @(#) rui_grid-debug.js
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
/**
 * @description Widget Grid
 * @module ui_grid
 * @title Widget Grid
 * @requires Rui
 */
Rui.namespace('Rui.ui.grid');
/**
 * @description Grid관련 Table cell처리 유틸
 * @namespace Rui.ui.grid
 * @class LCellMerge
 * @private
 * @constructor LCellMerge
 * @static
 */
Rui.ui.grid.LCellMerge = {    
    /**
     * @description Grid에 multi header정보가 입력될 경우 렌더링관련 처리를 위해 2차원 배열 및 기타 정보 Json으로 리턴
     * @method getMultiHeaderInfo
     * @private
     * @static
     * @param {Array} columns grid의 column 배열
     * @return {Object} colInfos: colInfos,rowCount: rowCount,colCount: colCount,dataColumns: dataColumns
     */
    getMultiHeaderInfo: function(columns,rowCount){
        var column;
        var colCount = columns.length;
        //[[{id:'xx',colspan:1,rowspan:1,label:''}],[{},{}]]
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
                //1. 구한 열에대한 셀정보를 배열에 저장, 순서대로 쌓인다. 앞이 exist=false가 아닌데 false가 나올 수는 없다.
                if (i == 0) {
                    colInfos[colIdx] = [];
                    colInfo = colInfos[colIdx];
                }else if(this.isStartColumn(i, column, colCount, columns)) {
                    dataColumns.push(prevCol);
                    //앞의 마지막 행번호가 실제 마지막 행번호 보다 작으면 rowspan넣기 1,2 2-1+1
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
                //2. 기본값 설정
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
                    //3. colspan구하기, 현재 id를 groupid로 가지고 있는 셀수, 바로 밑에 있는 놈 제외
                    //자식이 colspan을 가지고 있을 수도 있으므로 재귀루프로 실제 colspan을 구해야 한다.
                    cell.colspan = this.getColSpan(i, column.id, colCount, columns);
                    //4. colspan만큼 뒤에 빈셀 넣기
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
            
            //앞의 마지막 행번호가 실제 마지막 행번호 보다 작으면 rowspan넣기 1,2 2-1+1
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
            //cellIndex넣기
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
    /**
     * 멀티헤더의 경우 행수를 알아온다.
     * @method getHeaderRowCount
     * @private
     * @static
     * @param {Int} colCount
     * @param {Array} columns
     * @return {Int} rowCount
     */
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
            //1. 구한 열에대한 셀정보를 배열에 저장, 순서대로 쌓인다. 앞이 exist=false가 아닌데 false가 나올 수는 없다.
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
            //2. 기본값 설정
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
                //3. colspan구하기, 현재 id를 groupid로 가지고 있는 셀수, 바로 밑에 있는 놈 제외
                //자식이 colspan을 가지고 있을 수도 있으므로 재귀루프로 실제 colspan을 구해야 한다.
                cell.colspan = this.getColSpan(i, column.id, colCount, columns);
                //4. colspan만큼 뒤에 빈셀 넣기
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
    /**
     * @description colInfos에 렌더링시 실제 cellIndex정보 넣기
     * @method updateCellIndex
     * @private
     * @static
     * @param {Array} colInfos
     * @param {Int} colCount
     * @param {Int} rowCount
     * @return {Array} colInfos
     */
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
    /**
     * @description colInfos생성시 열이 바뀌는지 여부 리턴
     * @method isStartColumn
     * @private
     * @static
     * @param {Int} idx
     * @param {Rui.ui.grid.LColumn} column
     * @param {Int} colCount
     * @param {Array} columns grid의 column 배열
     * @return {Boolean}
     */
    isStartColumn: function(idx, column, colCount, columns){
        //multiheader에서 컬럼 시작인지 식별
        //groupId가 없다,앞의 id가 나의 groupId이면 아니다,앞에 groupId가 같은 놈이 있으면 다른 열이다.
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
    /**
     * @description colInfos생성시 colspan정보 계산
     * @method getColSpan
     * @private
     * @static
     * @param {Int} colIdx
     * @param {String} colId
     * @param {Int} colCount
     * @param {Array} columns grid의 column 배열
     * @return {Int}
     */
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
    /**
     * @description Grid Column의 cell merge info 
     * @method getCellMergeInfo
     * @private
     * @static
     * @param {Rui.ui.grid.LColumnModel} cm
     * @param {Object} rowRange
     * @return {Object}
     */
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
            vstart = start, //rowRange.visibleStart,
            vend = end, //rowRange.visibleEnd,
            afterRows = rowRange.afterRows,
            _vMerge;
        
        //prepare - cell merge column 정보 교정
        for (var i=0;i<colCount;i++){
            column = cm.getColumnAt(i, true);
            if(gMerge){
            	//groupMerge를 사용중 중간에 vMerge가 false일 경우 이후 컬럼은 vMerge하지 않는다.
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

        //visible start로 하면 label이 계속 보일 수 있다.
        //rows와 cells는 0부터 시작해야 한다.
        for (var i = start; i < end + 1; i++) {
            cells = [];
            prevMergeLabel = undefined;
            if (vstart <= i && i < vend + 1) {
                //초기화
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
                                    //둘다 같기 때문에, 앞,위 모두 셀이 존재하며, 뚫을지 않 뚫을지 판단만 해주면 된다.
                                    //BA
                                    //AA의 경우는 세로로 뚫는다.
                                    //AA
                                    //AB의 경우는 위에 가로로 뚫려 있기 때문에 세로로 뚫지 않는다.
                                    if (!prevColumn.vMerge && prevColumn.hMerge) {
                                        //앞이 hMerge이기 때문에 뚫음
                                        colspan = cells[j - 1].colspan;
                                        colspan = colspan < 0 ? colspan - 1 : -1;  
                                        prevCell = cells[j + colspan];
                                        prevCell.colspan = prevCell.colspan + 1;
                                        cell.colspan = colspan;
                                    } else if(prevColumn.vMerge && !prevColumn.hMerge) {
                                        //앞에 셀이 위아래로 뚫려 있어야만 위아래로 뚫을 수 있다. 즉 앞에 셀의 rowspan값이 -값이어야만 한다.
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
                                        //대각선이 같으냐 다르냐
                                        prevRCrossLabel = prevR.get(prevColumn.field);
                                        if (Rui.isDate(prevRCrossLabel)) {
                                            prevRCrossLabel = prevRCrossLabel.format(mergeDateFormat);
                                        }
                                        if(prevRCrossLabel === label && rows[rowIdx-1][j].colspan < 1){
                                            //같지만 앞열의 row가 뚫려있고, 뒤에는 안뚫려 있을 경우, 즉 윗셀의 colspan이 -가 아니면
                                            //colspan은 cross에 있는 것을 가져온다.  위에 colspan일 경우 rowspan이 안뚤리기 때문 
                                            canMerge = true;
                                            var prevColIdx = cells[j - 1].colspan == 1 ? 2 : Math.abs(cells[j - 1].colspan) + 2;
                                            if (gMerge && cells[j - 1].rowspan > 0 && (j - prevColIdx > -1) && cells[j - prevColIdx].rowspan > 0) {
                                                //colspan인 경우(앞의 셀과 라벨이 같은 경우는 그 앞의 rowspan을 확인해야 한다.
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
                                                //앞의 셀도 -값을 넣어야 한다.
                                                for (var k = Math.abs(colspan); k > 0; k--) {
                                                    cells[j - k].colspan = -(k - 1);
                                                    cells[j - k].rowspan = rowspan;
                                                }
                                                cell.colspan = colspan;
                                                cell.rowspan = rowspan;
                                            } else {
                                                //세로가 안뚫리면 가로를 뚫을 수 있다.
                                                colspan = cells[j - 1].colspan;
                                                colspan = colspan < 0 ? colspan - 1 : -1;  
                                                prevCell = cells[j + colspan];
                                                prevCell.colspan = prevCell.colspan + 1;
                                                cell.colspan = colspan;
                                            }
                                        }else{
                                            //가로 세로 다 뚫을 수 있으나 세로로만 뚫는다.  세로가 우선.
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
                                                //세로가 안뚫리면 가로를 뚫을 수 있다.
                                                colspan = cells[j - 1].colspan;
                                                colspan = colspan < 0 ? colspan - 1 : -1;  
                                                prevCell = cells[j + colspan];
                                                prevCell.colspan = prevCell.colspan + 1;
                                                cell.colspan = colspan;
                                            }
                                        }
                                    } else if(!prevColumn.vMerge && !prevColumn.hMerge) {
                                        //앞에는 둘다 아님
                                        //둘다 아니더라도 vMerge는 작동해야 한다.
                                        rowspan = rows[rowIdx - 1][j].rowspan;
                                        rowspan = rowspan < 0 ? rowspan - 1 : -1;
                                        prevRCell = rows[rowIdx + rowspan][j];
                                        prevRCell.rowspan = prevRCell.rowspan + 1;
                                        cell.rowspan = rowspan;
                                    }
                                }
                                else 
                                    if (prevColumn && prevLabel === label) {
                                        //앞에것과 같기 때문에, 앞으로 뚫을지 않 뚫을지 판단만 해주면 된다.
                                        if (!prevColumn.vMerge && prevColumn.hMerge) {
                                            //앞이 hMerge이기 때문에 뚷음
                                            colspan = cells[j - 1].colspan;
                                            colspan = colspan < 0 ? colspan - 1 : -1;  
                                            prevCell = cells[j + colspan];
                                            prevCell.colspan = prevCell.colspan + 1;
                                            cell.colspan = colspan;
                                        } else if(prevColumn.vMerge && !prevColumn.hMerge) {
                                        } else if(prevColumn.vMerge && prevColumn.hMerge){
                                            //이미 앞에서 세로로 뚤려 있으면 못뚫는다.
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
                                            //위의 label가 같지만 이미 뚤려 있을 때는 못 뚫는다.
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
                                //위의 label가 같지만 이미 뚤려 있을 때는 못 뚫는다.
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
                            //앞에것이 rowspan 되었으면 뚫지 않는다.
                            if (prevColumn && prevLabel === label) {
                                //앞에것과 같기 때문에, 앞으로 뚫을지 않 뚫을지 판단만 해주면 된다.
                                if (!prevColumn.vMerge && prevColumn.hMerge) {
                                    //앞이 hMerge이기 때문에 뚷음
                                    colspan = cells[j - 1].colspan;
                                    colspan = colspan < 0 ? colspan - 1 : -1;  
                                    prevCell = cells[j + colspan];
                                    prevCell.colspan = prevCell.colspan + 1;
                                    cell.colspan = colspan;
                                } else if(prevColumn.vMerge && !prevColumn.hMerge) {
                                } else if(prevColumn.vMerge && prevColumn.hMerge){
                                    //이미 앞에서 세로로 뚤려 있으면 못뚫는다.
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

/**
 * @description Widget Grid
 * @module ui_grid
 * @title Widget Grid
 * @requires Rui
 */
Rui.namespace('Rui.ui.grid');

/**
 * @description 그리드의 LColumn 객체
 * @namespace Rui.ui.grid
 * @class LColumn
 * @sample default
 * @constructor
 * @param {Object} oConfigs 생성자 Config 객체
 */
Rui.ui.grid.LColumn = function(oConfigs) {
    var config = oConfigs || {};
    
    config = Rui.applyIf(config, Rui.getConfig().getFirst('$.ext.column.defaultProperties'));

    this.id = config.id || config.field || this.id;

    Rui.applyObject(this, config, true);

    this.label = this.label || this.field || this.id;

    /**
     * @description hidden 기능이 호출되면 수행하는 이벤트
     * @event hidden
     * @sample default
     * @param {Object} target this객체
     * @param {boolean} hidden hidden값
     */
    this.createEvent('hidden');

    /**
     * @description sortable 기능이 호출되면 수행하는 이벤트
     * @event sortable
     * @sample default
     * @param {Object} target this객체
     * @param {boolean} sortable sortable값
     */
    this.createEvent('sortable');

    /**
     * @description label일 변경되면 호출되면 수행하는 이벤트
     * @event label
     * @sample default
     * @param {Object} target this객체
     * @param {boolean} label sortable값
     */
    this.createEvent('label');
    
    /**
     * @description LGridPanel의 컬럼의 width길이를 변경하면 호출되는 columnResize 이벤트
     * @event columnResize
     * @sample default
     * @param {Object} target this객체
     * @param {int} oldWidth pixel
     * @param {int} newWidth pixel
     */
    this.createEvent('columnResize');
    
    /**
     * @description editor가 바뀌면 호출되는 editorChanged 이벤트
     * @event editorChanged
     * @param {Object} target this객체
     */
    this.createEvent('editorChanged');
    
    this.init();

    this.editable = Rui.isUndefined(config.editable) == false ? config.editable : !this.editor ? false : true;
    if (this.editor)
        this.editor.isGridEditor = true;
    
    this.headerCss = [];
    config = null;
};

Rui.extend(Rui.ui.grid.LColumn, Rui.util.LEventProvider, {
    /**
     * @description 객체의 문자열
     * @property otype
     * @private
     * @type {String}
     */
    otype: 'Rui.ui.grid.LColumn',
    /**
     * @description columnModel에서 구분할 수 있는 column객체의 id
     * @config id
     * @sample default
     * @type {String}
     * @default null
     */
    /**
     * @description columnModel에서 구분할 수 있는 column객체의 id
     * @property id
     * @private
     * @type {String}
     */
    id: null,
    /**
     * @description Column Model
     * @property columnModel
     * @private
     * @type {Rui.ui.grid.LColumnModel}
     */
    columnModel: null,
    /**
     * @description 그리드의 헤더 이름을 출력하는 속성
     * @config label
     * @type {String}
     * @default null
     */
    /**
     * @description 그리드의 헤더 이름을 출력하는 속성
     * @property label
     * @private
     * @type {String}
     */
    label: null,
    /**
     * @description dataSet과 연결할 field 명
     * @config field
     * @sample default
     * @type {String}
     * @default null
     */
    /**
     * @description dataSet과 연결할 field 명
     * @property field
     * @private
     * @type {String}
     */
    field: null,
    /**
     * @description Column width
     * @config width
     * @type {int}
     * @default null
     */
    /**
     * @description Column width
     * @property width
     * @private
     * @type {int}
     */
    width: null,
    /**
     * @description Column의 최소 width
     * @config minWidth
     * @type {int}
     * @default 25
     */
    /**
     * @description Column의 최소 width
     * @property minWidth
     * @private
     * @type {int}
     */
    minWidth: 25,
    /**
     * @description Column 자동 width
     * @config autoWidth
     * @type {boolean}
     * @default false
     */
    /**
     * @description Column 자동 width
     * @property autoWidth
     * @private
     * @type {boolean}
     */
    autoWidth: false,
    /**
     * @description Column 자동 max width
     * @config maxAutoWidth
     * @type {int}
     * @default 1000
     */
    /**
     * @description Column 자동 max width
     * @property maxAutoWidth
     * @private
     * @type {int}
     */
    maxAutoWidth: 1000,
    /**
     * @description Column hidden 속성 (hidden 이벤트 참조)
     * @config hidden
     * @type {boolean}
     * @default false
     */
    /**
     * @description Column hidden 속성
     * @property hidden
     * @private
     * @type {boolean}
     */
    hidden: false,
    /**
     * @description Column selected 속성
     * @config selected
     * @type {boolean}
     * @default true
     */
    /**
     * @description Column selected 속성
     * @property selected
     * @private
     * @type {boolean}
     */
    selected: true,
    /**
     * @description Column resizable 속성
     * @config resizable
     * @type {boolean}
     * @default true
     */
    /**
     * @description Column resizable 속성
     * @property resizable
     * @private
     * @type {boolean}
     */
    resizable: true,
    /**
     * @description Column의 width를 조정할 수 있는 여부를 설정한다.
     * @config fixed
     * @type {boolean}
     * @default false
     */
    /**
     * @description Column의 width를 조정할 수 있는 여부를 설정한다.
     * @property fixed
     * @private
     * @type {boolean}
     */
    fixed: false,
    /**
     * @description Column 정렬 속성. sortable 이벤트 참조
     * @config sortable
     * @type {boolean}
     * @default null
     */
    /**
     * @description Column 정렬 속성. sortable 이벤트 참조
     * @property sortable
     * @private
     * @type {boolean}
     */
    sortable: null,
    /**
     * @description 내용의 Column 가로 정렬 속성. 값종류: left, center, right
     * @config align
     * @type {String}
     * @default ''
     */
    /**
     * @description 내용의 Column 가로 정렬 속성. 값종류: left, center, right
     * @property align
     * @private
     * @type {String}
     */
    align:'',
    /**
     * @description Column draggable 속성. 그리드 헤더를 drag를 통해 컬럼 순서를 변경할 수 있는지를 설정한다. 
     * @config draggable
     * @type {boolean}
     * @default null
     */
    /**
     * @description Column draggable 속성. 그리드 헤더를 drag를 통해 컬럼 순서를 변경할 수 있는지를 설정한다.
     * @property draggable
     * @private
     * @type {boolean}
     */
    draggable: null,
    /**
     * @description Column 편집 가능 여부 속성
     * @config editable
     * @sample default
     * @type {boolean}
     * @default true
     */
    /**
     * @description Column 편집 가능 여부 속성
     * @property editable
     * @private
     * @type {boolean}
     */
    editable: true,
    /**
     * @description Column의 편집기 설정
     * @config editor
     * @sample default
     * @type {Object}
     * @default null
     */
    /**
     * @description Column의 편집기 설정
     * @property editor
     * @private
     * @type {Object}
     */
    editor: null,
    /**
     * @description Column style 속성
     * @property cellStyle
     * @private
     * @type {String}
     */
    cellStyle: null,
    /**
     * @description Column header css 속성
     * @property headerCss
     * @private
     * @type {Array}
     */
    headerCss: null,
    /**
     * @description Column 의 디자인이나 값을 변경할 수 있는 function
     * @config renderer
     * @sample default
     * @type {Function}
     * @default null
     */
    /**
     * @description Column 의 디자인이나 값을 변경할 수 있는 function
     * @property renderer
     * @private
     * @type {Function}
     */
    renderer: null,
    /**
     * @description 그리드의 틀고정 Column을 지정한다.
     * @config freeze
     * @type {boolean}
     * @default false
     */
    /**
     * @description 그리드의 틀고정 Column을 지정한다.
     * @property freeze
     * @private
     * @type {freeze}
     */
    freeze: false,
    /**
     * @description Column 의 row의 값이 바뀌면 무조건 render를 할지 여부
     * @config renderRow
     * @sample default
     * @type {boolean}
     * @default null
     */
    /**
     * @description Column 의 row의 값이 바뀌면 무조건 render를 할지 여부
     * @property renderRow
     * @private
     * @type {boolean}
     */
    renderRow: false,
    /**
     * @description field가 없는 Column이 소계가 들어갈 경우 각 row별 공식을 적용하는 function
     * @config expression
     * @sample default
     * @type {Function}
     * @default null
     */
    /**
     * @description field가 없는 Column이 소계가 들어갈 경우 각 row별 공식을 적용하는 function
     * @property expression
     * @private
     * @type {Function}
     */
    expression: null,
    /**
     * @description expression 속성 적용시 소계의 각 row의 합계 처리 방식을 어떤걸로 처리 할 지 결정 (sum/avg/max/min/count)
     * @config expressionType
     * @type {String|function}
     * @default null
     */
    /**
     * @description expression 속성 적용시 소계의 각 row의 합계 처리 방식을 어떤걸로 처리 할 지 결정 (sum/avg/max/min/count)
     * @property expressionType
     * @private
     * @type {String|function}
     */
    expressionType: null,
    /**
     * @description 그리드에서 Column을 vertical merge 한다.
     * @config vMerge
     * @type {boolean}
     * @default false
     */
    /**
     * @description 그리드에서 Column을 vertical merge 한다.
     * @property vMerge
     * @private
     * @type {boolean}
     */
    vMerge: false,
    /**
     * @description 그리드에서 Column을 horizontal merge 한다.
     * @config hMerge
     * @type {boolean}
     * @default false
     */
    /**
     * @description 그리드에서 Column을 horizontal merge 한다.
     * @property hMerge
     * @private
     * @type {boolean}
     */
    hMerge: false,
    /**
     * @description 그리드에서 Date형 Column을 merge 할때 포멧을 정의한다. 포멧은 LDate api 참조 
     * @config mergeDateFormat
     * @type {String}
     * @default '%Y-%m-%d'
     */
    /**
     * @description 그리드에서 Date형 Column을 merge 할때 포멧을 정의한다. 포멧은 LDate api 참조
     * @property mergeDateFormat
     * @private
     * @type {String}
     */
    mergeDateFormat: '%Y-%m-%d',
    /**
     * @description multi header등에서 dummy컬럼인지 data영역 rendering용 column인지등 column을 식별하기 위한 값
     * @property columnType
     * @private
     * @type {string}
     * @default 'data'
     */
    columnType: 'data',
    /**
     * @description 출력할 컬럼인지 여부를 결정한다. false로 설졍되면 공백값으로 출력된다.
     * @config renderExcel
     * @type {boolean}
     * @default true
     */
    /**
     * @description 출력할 컬럼인지 여부를 결정한다. false로 설졍되면 공백값으로 출력된다.
     * @property renderExcel
     * @private
     * @type {boolean}
     * @default true
     */
    renderExcel: true,
    /**
     * @description 그리드에서 툴팁을 표시하기 위해 필요한 데이터셋 field 명
     * @property tooltipText
     * @private
     * @type {string}
     */
    tooltipText: null,
    /**
     * @description 소계 정보를 가지는 객체 예) summary: { ids: ['col1', 'col2' ], type: 'sum', label: '소계', labelId: 'col2' }
     * type 종류 : sum/avg/max/min/count
     * @config summary
     * @type {Object}
     * @default null
     */
    /**
     * @description 소계 정보를 가지는 객체 예) summary: { ids: ['col1', 'col2' ], type: 'sum', label: '소계', labelId: 'col2' }
     * type 종류 : sum/avg/max/min/count
     * @property summary
     * @private
     * @type {Object}
     */
    summary: null,
    /**
     * @description 소계의 기준이 되는 필드 정보 배열
     * @config sumIds
     * @type {Array}
     * @default null
     */
    /**
     * @description 소계의 기준이 되는 필드 정보 배열
     * @property sumIds
     * @private
     * @type {Array}
     */
    sumIds: null, 
    /**
     * @description 소계를 할때 sum/avg/max/min/count 종류를 지정하는 속성
     * @config sumType
     * @type {String}
     * @default null
     */
    /**
     * @description 소계를 할때 sum/avg/max/min/count 종류를 지정하는 속성
     * @property sumType
     * @private
     * @type {String}
     */
    sumType: null,
    /**
     * @description 소계의 앞에 출력될 문장 속성
     * @config sumText
     * @type {String}
     * @default null
     */
    /**
     * @description 소계의 앞에 출력될 문장 속성
     * @property sumText
     * @private
     * @type {String}
     */
    sumText: null,
    /**
     * @description headerTool을 출력할지 여부를 결정한다. (Plugin중에 LHeaderContextMenu를 사용할 경우 작동된다.)
     * @config headerTool
     * @type {boolean}
     * @default true
     */
    /**
     * @description headerTool을 출력할지 여부를 결정한다. (Plugin중에 LHeaderContextMenu를 사용할 경우 작동된다.)
     * @property headerTool
     * @private
     * @type {boolean}
     */
    headerTool: true,
    /**
     * @description copy시 clipboard에 넣을지 여부를 결정한다.
     * @config clipboard
     * @type {boolean}
     * @default true
     */
    /**
     * @description copy시 clipboard에 넣을지 여부를 결정한다.
     * @property clipboard
     * @private
     * @type {boolean}
     */
    clipboard: true,
    /**
     * @description copy시 clipboard에 넣을때 renderer 값으로 처리할지 DataSet의 원값으로 처리할지 여부를 결정한다.
     * @config clipboardVirtual
     * @type {boolean}
     * @default true
     */
    /**
     * @description copy시 clipboard에 넣을때 renderer 값으로 처리할지 DataSet의 원값으로 처리할지 여부를 결정한다.
     * @property clipboardVirtual
     * @private
     * @type {boolean}
     */
    clipboardVirtual: true,
    /**
     * @description copy시 clipboard에 넣을때 처리할 renderer를 지정한다. 
     * @config clipboardRenderer
     * @type {Function}
     * @default null
     */
    /**
     * @description copy시 clipboard에 넣을때 처리할 renderer를 지정한다.
     * @property clipboardRenderer
     * @private
     * @type {Function}
     */
    clipboardRenderer: null,
    /**
     * @description enter key 입력이나 cell click 시 컬럼을 이동할지 여부를 결정한다. 
     * 컬럼에 a태그 링크로 팝업이 뜨는 경우에 팝업창이 뒤에서 떴다가 앞으로 올 경우 적용한다.
     * @config ignoreViewFocus
     * @type {boolean}
     * @default true
     */
    /**
     * @description enter key 입력이나 cell click 시 컬럼을 이동할지 여부를 결정한다. 
     * 컬럼에 a태그 링크로 팝업이 뜨는 경우에 팝업창이 뒤에서 떴다가 앞으로 올 경우 적용한다.
     * @property ignoreViewFocus
     * @private
     * @type {boolean}
     */
    ignoreViewFocus: true,
    /**
     * @description Tablet 출력시 옵션 
     * 예)
     * { width: '20%', align: 'center' }
     * Tablet은 width가 %로도 적용이 가능하고 문자여야 한다. 
     * @config tablet
     * @type {Object}
     * @default null
     */
    /**
     * @description Tablet 출력시 옵션
     * @property tablet
     * @private
     * @type {Object}
     */
    tablet: null,
    /**
     * @description 객체를 초기화하는 메소드
     * @method init
     * @private
     * @return {void}
     */
    init: function() {
        this.initEvents();
    },
    /**
     * @description 객체의 이벤트 초기화 메소드
     * @method initEvents
     * @protected
     * @return {void}
     */
    initEvents: function() {
    },
    /**
     * @description gridview의 event를 연결하는 메소드
     * @method bindEvent
     * @protected
     * @param {Rui.ui.grid.LGridPanel} gridPanel gridPanel 객체
     * @return {void}
     */
    bindEvent: function(gridPanel) {
        if (this.editor) {
            this.editor.gridPanel = gridPanel;
        }
    },
    /**
     * @description gridview의 event를 연결하는 메소드
     * @method unbindEvent
     * @protected
     * @param {Rui.ui.grid.LGridPanel} gridPanel gridPanel 객체
     * @return {void}
     */
    unbindEvent: function(gridPanel) {
    },
    /**
     * @description 객체의 Id값을 리턴하는 메소드
     * @method getId
     * @return {String}
     */
    getId: function() {
        return this.id;
    },
    /**
     * @description 객체의 groupId값을 리턴하는 메소드
     * @method getGroupId
     * @return {String}
     */
    getGroupId: function() {
        return this.groupId;
    },
    /**
     * @description 객체의 field값을 리턴하는 메소드
     * @method getField
     * @return {String}
     */
    getField: function() {
        return this.field;
    },
    /**
     * @description 객체의 column model값을 리턴하는 메소드
     * @method getColumnModel
     * @return {Rui.ui.grid.LColumnModel}
     */
    getColumnModel: function() {
        return this.columnModel;
    },
    /**
     * @description 객체의 column model값을 셋팅하는 메소드
     * @method setColumnModel
     * @private
     * @param {Rui.ui.grid.LColumnModel} columnModel column model 객체
     * @return {void}
     */
    setColumnModel: function(columnModel) {
        this.columnModel = columnModel;
    },
    /**
     * @description 객체의 lable값을 셋팅하는 메소드
     * @method getLabel
     * @return {String}
     */
    getLabel: function() {
        return this.label;
    },
    /**
     * @description 객체의 column label값을 셋팅하는 메소드. label 이벤트가 발생한다.
     * @method setLabel
     * @param {String} label column lable값
     * @return {void}
     */
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
    /**
     * @description 객체의 width값을 리턴하는 메소드
     * @method getWidth
     * @return {int}
     */
    getWidth: function() {
        return this.width;
    },
    /**
     * @description 객체의 column width값을 셋팅하는 메소드. columnResize 이벤트가 발생한다.
     * @method setWidth
     * @param {int} width width 값
     * @return {void}
     */
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
    /**
     * @description 객체의 minWidth값을 셋팅하는 메소드
     * @method getMinWidth
     * @return {int}
     */
    getMinWidth: function() {
        return this.minWidth;
    },
    /**
     * @description 객체의 column minWidth값을 셋팅하는 메소드
     * @method setMinWidth
     * @param {int} minWidth minWidth값
     * @return {void}
     */
    setMinWidth: function(minWidth) {
        this.minWidth = minWidth;
    },
    /**
     * @description 객체의 width값을 셋팅하는 메소드
     * @method getMaxAutoWidth
     * @return {int}
     */
    getMaxAutoWidth: function() {
        return this.maxAutoWidth;
    },
    /**
     * @description 객체의 column maxAutoWidth값을 셋팅하는 메소드
     * @method setMaxAutoWidth
     * @param {int} maxAutoWidth maxAutoWidth값
     * @return {void}
     */
    setMaxAutoWidth: function(maxAutoWidth) {
        this.maxAutoWidth = maxAutoWidth;
    },
    /**
     * @description 객체의 hidden값을 리턴하는 메소드
     * @method isHidden
     * @return {boolean}
     */
    isHidden: function() {
        return this.hidden;
    },
    /**
     * @description 객체의 column hidden 값을 셋팅하는 메소드. hidden 이벤트가 발생한다.
     * @method setHidden
     * @param {boolean} hidden hidden값
     * @return {void}
     */
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
    /**
     * @description 객체의 selected값을 리턴하는 메소드
     * @method isSelected
     * @return {boolean}
     */
    isSelected: function() {
        return this.selected;
    },
    /**
     * @description 객체의 column selected 값을 셋팅하는 메소드
     * @method setSelected
     * @param {boolean} selected selected 값
     * @return {void}
     */
    setSelected: function(selected) {
        this.selected = selected;
    },
    /**
     * @description 객체의 resizable값을 리턴하는 메소드
     * @method isResizable
     * @return {boolean}
     */
    isResizable: function() {
        return this.resizable;
    },
    /**
     * @description 객체의 column resizable 값을 셋팅하는 메소드
     * @method setResizable
     * @param {boolean} resizable resizable 값
     * @return {void}
     */
    setResizable: function(resizable) {
        this.resizable = resizable;
    },
    /**
     * @description 객체의 fixed값을 리턴하는 메소드
     * @method isFixed
     * @return {boolean}
     */
    isFixed: function() {
        return this.fixed;
    },
    /**
     * @description 객체의 column fixed 값을 셋팅하는 메소드
     * @method setFixed
     * @param {boolean} fixed fixed 값
     * @return {void}
     */
    setFixed: function(fixed) {
        this.fixed = fixed;
    },
    /**
     * @description 객체의 sortable값을 리턴하는 메소드
     * @method isSortable
     * @return {boolean}
     */
    isSortable: function() {
        return this.sortable === true;
    },
    /**
     * @description 객체의 column sortable 값을 셋팅하는 메소드. sortable 이벤트가 발생한다.
     * @method setSortable
     * @param {boolean} sortable sortable 값
     * @return {void}
     */
    setSortable: function(sortable) {
        this.fireEvent('sortable', {target:this, sortable:sortable});
        this.sortable = sortable;
    },
    /**
     * @description 객체의 editable값을 리턴하는 메소드
     * @method isEditable
     * @return {boolean}
     */
    isEditable: function() {
        return this.editable;
    },
    /**
     * @description 객체의 column editable 값을 셋팅하는 메소드(사용안함)
     * @method setEditable
     * @param {boolean} editable editable 값
     * @return {void}
     */
    setEditable: function(editable){
        this.editable = editable;
    },
    /**
     * @description 객체의 editor값을 리턴하는 메소드
     * @method getEditor
     * @return {Object}
     */
    getEditor: function() {
        return this.editor;
    },
    /**
     * @description 객체의 column editor 값을 셋팅하는 메소드
     * @method setEditor
     * @sample default
     * @param {Object} editor editor 값
     * @return {void}
     */
    setEditor: function(editor) {
        if(this.editor === editor) return;
        this.editor = editor;
        if(this.editor) this.editor.isGridEditor = true;
        this.fireEvent('editorChanged', {target:this, id: this.id});
    },
    /**
     * @description 객체의 draggable값을 리턴하는 메소드
     * @method isDraggable
     * @return {boolean}
     */
    isDraggable: function() {
        return this.draggable;
    },
    /**
     * @description 객체의 column draggable 값을 셋팅하는 메소드
     * @method setDraggable
     * @param {boolean} draggable draggable 값
     * @return {void}
     */
    setDraggable: function(draggable){
        this.draggable = draggable;
    },
    /**
     * @description columnType설정
     * @method setColumnType
     * @private
     * @param {string} type
     * @return {void}
     */
    setColumnType: function(type){
        this.columnType = type;
    },
    /**
     * @description columnType 가져오기
     * @method getColumnType
     * @return {string}
     */
    getColumnType: function(){
        return this.columnType;
    },
    /**
     * @description columnType이 data인지 여부
     * @method isDataColumn
     * @return {boolean}
     */
    isDataColumn: function(){
        return this.columnType === 'data' ? true : false;
    },
    /**
     * @description summary 정보를 변경한다. 예: { sumIds: ['company', 'date'], sumType: 'sum', sumText: '소계' }
     * @method setSummary
     * @param {Object} summary summary 변경 객체 정보
     * @return {void}
     */
    setSummary: function(summary) {
        Rui.applyObject(this, summary);
    },
    /**
     * @description LColumn을 복제한다. (일반 개발자는 사용하면 안됨) 
     * @method clone
     * @protected
     * @return {Rui.ui.grid.LColumn}
     */
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
    /**
     * @description 그리드 header에 css 를 탑재한다. 
     * @method addHeaderCss
     * @protected
     * @param {string} css 탑재할 css
     * @return {void}
     */
    addHeaderCss: function(css) {
        var cssIdx = Rui.util.LArray.indexOf(this.headerCss, css);
        if(cssIdx < 0)
            this.headerCss.push(css);
    },
    /**
     * @description 그리드 header에 css 를 제거한다. 
     * @method removeHeaderCss
     * @protected
     * @param {string} css 삭제할 css
     * @return {void}
     */
    removeHeaderCss: function(css) {
        var cssIdx = Rui.util.LArray.indexOf(this.headerCss, css);
        if(cssIdx > -1)
            this.headerCss = Rui.util.LArray.removeAt(this.headerCss, cssIdx);
    },
    /**
     * @description 그리드 header에 css 탑재 여부를 리턴한다. 
     * @method hasHeaderCss
     * @protected
     * @param {string} css 삭제할 css
     * @return {boolean}
     */
    hasHeaderCss: function(css) {
        return Rui.util.LArray.indexOf(this.headerCss, css) > -1;
    }
});
/**
 * @description LTriggerColumn
 * @namespace Rui.ui.grid
 * @class LTriggerColumn
 * @extends Rui.ui.grid.LColumn
 * @constructor
 * @param {Object} oConfigs Object literal of definitions.
 */
Rui.ui.grid.LTriggerColumn = function(oConfigs) {
    Rui.ui.grid.LTriggerColumn.superclass.constructor.call(this, oConfigs);
    this.renderer = (oConfigs && oConfigs.renderer) ? oConfigs.renderer : this.doRenderer;
};

Rui.extend(Rui.ui.grid.LTriggerColumn, Rui.ui.grid.LColumn, {
    /**
     * @description selected 속성
     * @config selected
     * @type {boolean}
     * @default false
     */
    /**
     * @description selected 속성
     * @property selected
     * @private
     * @type {boolean}
     */
    selected : false,
    /**
     * @description sortable 속성
     * @config sortable
     * @type {boolean}
     * @default false
     */
     /**
     * @description sortable 속성
     * @property sortable
     * @private
     * @type {boolean}
     */
    sortable : false,
    /**
     * @description gridPanel 객체
     * @property gridPanel
     * @private
     * @type {Rui.ui.grid.LGridPanel}
     */
    gridPanel : null,
    /**
     * @description gridView 객체
     * @property gridView
     * @private
     * @type {Rui.ui.grid.LGridView}
     */
    gridView : null,
    /**
     * @description editor 속성
     * @config editor
     * @type {Object}
     * @default null
     */
     /**
     * @description editor 속성
     * @property editor
     * @private
     * @type {Object}
     */
    editor : null,
    /**
     * @description gridview의 event를 연결하는 메소드
     * @method bindEvent
     * @protected
     * @param {Rui.ui.grid.LGridPanel} gridPanel gridPanel 객체
     * @return {void}
     */
    bindEvent: function(gridPanel) {
        Rui.ui.grid.LTriggerColumn.superclass.bindEvent.call(this, gridPanel);
        this.gridPanel = gridPanel;
        this.gridView = gridPanel.getView();
    },
    /**
     * @description gridview의 event를 연결하는 메소드
     * @method unbindEvent
     * @protected
     * @param {Rui.ui.grid.LGridPanel} gridPanel gridPanel 객체
     * @return {void}
     */
    unbindEvent: function(gridPanel) {
        Rui.ui.grid.LTriggerColumn.superclass.unbindEvent.call(this, gridPanel);
        this.gridPanel = gridPanel;
        this.gridView = gridPanel.getView();
    },
    /**
     * @description renderer를 수행하는 메소드
     * @method doRenderer
     * @protected
     * @return {String}
     */
    doRenderer: function(val, p, record, row, i) { return val; }
});
/**
 * @description LNumberColumn
 * @namespace Rui.ui.grid
 * @class LNumberColumn
 * @extends Rui.ui.grid.LTriggerColumn
 * @sample default
 * @constructor
 * @param {Object} oConfigs Object literal of definitions.
 */
Rui.ui.grid.LNumberColumn = function(oConfigs) {
    Rui.ui.grid.LNumberColumn.superclass.constructor.call(this, oConfigs);
};

Rui.extend(Rui.ui.grid.LNumberColumn, Rui.ui.grid.LTriggerColumn, {
    /**
     * @description 객체의 문자열
     * @property otype
     * @private
     * @type {String}
     */
    otype: 'Rui.ui.grid.LNumberColumn',
    /**
     * @description Column id 속성
     * @config id
     * @type {String}
     * @default 'num'
     */
    /**
     * @description Column id 속성
     * @property id
     * @private
     * @type {String}
     */
    id : 'num',
    
    /**
    * @description Column과 mapping field 속성
    * @config mappingField
    * @type {String}
    * @default null
    */
    /**
    * @description Column과 mapping field 속성
    * @property mappingField
    * @private
    * @type {String}
    */
    mappingField : null,
    /**
     * @description Column의 label 속성
     * @config label
     * @type {String}
     * @default 'Num'
     */
    /**
     * @description Column의 label 속성
     * @property label
     * @private
     * @type {String}
     */
    label : 'No.',
    /**
     * @description Column의 align 속성
     * @config align
     * @type {String}
     * @default 'right'
     */
    /**
     * @description Column의 align 속성
     * @property align
     * @private
     * @type {String}
     */
    align : 'right',
    /**
     * @description Column의 width 속성
     * @config width
     * @type {int}
     * @default 35
     */
    /**
     * @description Column의 width 속성
     * @property width
     * @private
     * @type {int}
     */
    width : 35,
    /**
     * @description resizable 속성
     * @config resizable
     * @type {boolean}
     * @default true
     */
    /**
     * @description resizable 속성
     * @property resizable
     * @private
     * @type {boolean}
     */
    resizable : true,
    systemColumn: true,
    /**
     * @description gridview의 event를 연결하는 메소드
     * @method bindEvent
     * @protected
     * @param {Rui.ui.grid.LGridPanel} gridPanel gridPanel 객체
     * @return {void}
     */
    bindEvent : function(gridPanel) {
        Rui.ui.grid.LNumberColumn.superclass.bindEvent.call(this, gridPanel);
        var view = gridPanel.getView();
        var ds = view.getDataSet();
        
        ds.on('add', this.onInvokeEvent, this, true);
        ds.on('remove', this.onInvokeEvent, this, true);
        ds.on('undo', this.onInvokeEvent, this, true);
        view = ds = null;
    },
    /**
     * @description gridview의 event를 연결하는 메소드
     * @method unbindEvent
     * @protected
     * @param {Rui.ui.grid.LGridPanel} gridPanel gridPanel 객체
     * @return {void}
     */
    unbindEvent: function(gridPanel) {
        Rui.ui.grid.LNumberColumn.superclass.unbindEvent.call(this, gridPanel);
        var view = gridPanel.getView();
        var ds = view.getDataSet();
        
        ds.unOn('add', this.onInvokeEvent, this);
        ds.unOn('remove', this.onInvokeEvent, this);
        ds.unOn('undo', this.onInvokeEvent, this);
        view = ds = null;
    },
    /**
     * @description reder시 출력해야하는 데이터를 리턴하는 메소드
     * @method doRenderer
     * @protected
     * @return {String}
     */
    doRenderer: function(val, p, record, row, i) {
        if(this.mappingField)
            return record.get(this.mappingField);
        else
            return row + 1;
    },
    /**
     * @description DataSet의 add 이벤트 발생시 호출되는 메소드
     * @method onAdd
     * @private
     * @param {Object} e Event 객체
     * @return {void}
     */
    onInvokeEvent: function(e) {
        this.doNumberRender(e.row);
    },
    /**
     * @description DataSet number를 update하는 메소드
     * @method doNumberRender
     * @protected
     * @param {int} row row 위치
     * @return {void}
     */
    doNumberRender: function(row) {
        var dataSet = this.gridView.getDataSet();
        var cell = this.getColumnModel().getIndexById(this.id, true);
//        var record, cellDom;
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
/**
 * @description LStateColumn
 * @namespace Rui.ui.grid
 * @class LStateColumn
 * @extends Rui.ui.grid.LTriggerColumn
 * @constructor
 * @param {Object} oConfigs config 객체
 */
Rui.ui.grid.LStateColumn = function(oConfigs) {
    Rui.ui.grid.LStateColumn.superclass.constructor.call(this, oConfigs);
};

Rui.extend(Rui.ui.grid.LStateColumn, Rui.ui.grid.LTriggerColumn, {
    /**
     * @description Column id 속성
     * @config id
     * @type {String}
     * @default 'state'
     */
    /**
     * @description Column id 속성
     * @property id
     * @private
     * @type {String}
     */
    id : 'state',
    /**
     * @description Column의 label 속성
     * @config label
     * @type {String}
     * @default 'S'
     */
     /**
     * @description Column의 label 속성
     * @property label
     * @private
     * @type {String}
     */
    label : 'S',
    /**
     * @description Column의 align 속성
     * @config align
     * @type {String}
     * @default 'center'
     */
     /**
     * @description Column의 align 속성
     * @property align
     * @private
     * @type {String}
     */
    align : 'center',
    /**
     * @description Column의 width 속성
     * @config width
     * @type {int}
     * @default 15
     */
     /**
     * @description Column의 width 속성
     * @property width
     * @private
     * @type {int}
     */
    width : 15,
     /**
     * @description fixed 속성
     * @property fixed
     * @private
     * @type {boolean}
     */
    fixed : true,
    /**
     * @description resizable 속성
     * @property resizable
     * @private
     * @type {boolean}
     */
    resizable : false,
    /**
     * @description copy시 clipboard에 넣을지 여부를 결정한다.
     * @config clipboard
     * @type {boolean}
     * @default false
     */
    /**
     * @description copy시 clipboard에 넣을지 여부를 결정한다.
     * @property clipboard
     * @private
     * @type {boolean}
     */
    clipboard: false,
    stateCol: -1,
    systemColumn: true,
    /**
     * @description gridview의 event를 연결하는 메소드
     * @method bindEvent
     * @protected
     * @param {Rui.ui.grid.LGridPanel} gridPanel gridPanel 객체
     * @return {void}
     */
    bindEvent: function(gridPanel) {
        Rui.ui.grid.LStateColumn.superclass.bindEvent.call(this, gridPanel);
        this.stateCol = this.columnModel.getIndexById(this.id, true);
        this.removeDataSetEvent();
        this.addDataSetEvent();
    },
    /**
     * @description gridview의 event를 연결하는 메소드
     * @method unbindEvent
     * @protected
     * @param {Rui.ui.grid.LGridPanel} gridPanel gridPanel 객체
     * @return {void}
     */
    unbindEvent: function(gridPanel) {
        Rui.ui.grid.LStateColumn.superclass.unbindEvent.call(this, gridPanel);
        this.removeDataSetEvent();
    },
    /**
     * @description 데이터셋의 이벤트를 탑재한다.
     * @method addDataSetEvent
     * @protected
     * @return {String}
     */
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
    /**
     * @description 데이터셋의 이벤트를 삭제한다.
     * @method removeDataSetEvent
     * @protected
     * @return {String}
     */
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
    /**
     * @description renderer를 수행하는 메소드
     * @method doRenderer
     * @protected
     * @return {String}
     */
    doRenderer: function(val, p, record, row, i) {
        var state = this.getState(record);
        if(state != '') 
            p.css.push('L-grid-cell-state-' + state);
        return '&nbsp;';
    },
    /**
     * @description DataSet의 update 이벤트 발생시 호출되는 메소드
     * @method onUpdateState
     * @private
     * @param {Object} e Event 객체
     * @return {void}
     */
    onUpdateState: function(e) {
        if(this.gridView)
            this.doChangeRowState(e.row, e.record, e.record.state);
        this.onChangeHeaderState();
    },
    /**
     * @description DataSet의 undo 이벤트 발생시 호출되는 메소드
     * @method onUndo
     * @private
     * @param {Object} e Event 객체
     * @return {void}
     */
    onUndo: function(e) {
        this.doChangeRowState(e.row, e.record, e.beforeState);
        this.onChangeHeaderState();
    },
    /**
     * @description DataSet의 undo 이벤트 발생시 호출되는 메소드
     * @method onStateChanged
     * @private
     * @param {Object} e Event 객체
     * @return {void}
     */
    onStateChanged: function(e) {
        var row = this.gridView.dataSet.indexOfKey(e.record.id);
        this.doChangeRowState(row, e.record, e.beforeState);
        this.onChangeHeaderState();
    },
    /**
     * @description row 위치값의 state cell의 값을 변경한다.
     * @method doChangeRowState
     * @private
     * @param {int} row row 값
     * @param {Rui.data.LRecord} record record 객체
     * @param {int} beforeState before state 값
     * @return {void}
     */
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
    /**
     * @description dataSet의 상태를 LStateColumn의 헤더에 반영한다.
     * @method onChangeHeaderState
     * @private
     * @return {void}
     */
    onChangeHeaderState: function() {
        var cellEl = this.gridView.getHeaderCellEl(this.stateCol);
        if(!cellEl) return;
        this.gridView.dataSet.isUpdated() ? cellEl.addClass('L-grid-state-modified') : cellEl.removeClass('L-grid-state-modified');
    },
    /**
     * @description dataSet의 상태가 commit 될 경우
     * @method onCommit
     * @private
     * @return {void}
     */
    onCommit: function() {
//       var dataSet = this.gridView.dataSet;
        var bodyEl = this.gridView.getBodyEl();
        var cellList = bodyEl.select('.L-grid-cell-state-I,.L-grid-cell-state-U,.L-grid-cell-state-D');
        cellList.removeClass(['L-grid-cell-state-I', 'L-grid-cell-state-U','L-grid-cell-state-D']);
        var cellEl = this.gridView.getHeaderCellEl(this.stateCol);
        cellEl.removeClass('L-grid-state-modified');
    },
    /**
     * @description state값을 리턴하는 메소드
     * @method getState
     * @protected
     * @return {String}
     */
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
/**
 * @description 그리드의 row를 선택할 수 있게 하는 LColumn. 체크가 되면 LDataSet의 marked 이벤트가 발생한다. marked 이벤트 참조 
 * @namespace Rui.ui.grid
 * @class LSelectionColumn
 * @extends Rui.ui.grid.LTriggerColumn
 * @sample default
 * @constructor
 * @param {Object} config Object literal of definitions.
 */
Rui.ui.grid.LSelectionColumn = function(config) {
    config = config || {};
    Rui.ui.grid.LSelectionColumn.superclass.constructor.call(this, config);
    Rui.devGuide(this, 'LSelectionColumn_constructor', [ config ]);
};

Rui.extend(Rui.ui.grid.LSelectionColumn, Rui.ui.grid.LTriggerColumn, {
    /**
     * @description Column id 속성
     * @config id
     * @type {String}
     * @default Rui.id()
     */
    /**
     * @description Column id 속성
     * @property id
     * @private
     * @type {String}
     */
    id : 'selection',
    /**
     * @description checkbox형식으로 출력할지 radio형식으로 출력할지 결정하는 속성
     * @config selectionType
     * @sample default
     * @type {String}
     * @default 'checkBox'
     */
    /**
     * @description checkbox형식으로 출력할지 radio형식으로 출력할지 결정하는 속성
     * @property selectionType
     * @private
     * @type {String}
     */
    selectionType : 'checkBox',
    /**
     * @description Column의 label 속성
     * @config label
     * @type {String}
     * @default '<div class="L-grid-header-checkBox" />'
     */
    /**
     * @description Column의 label 속성
     * @property label
     * @private
     * @type {String}
     */
    label : null,
    /**
     * @description Column의 align 속성
     * @config align
     * @type {String}
     * @default 'center'
     */
    /**
     * @description Column의 align 속성
     * @property align
     * @private
     * @type {String}
     */
    align : 'center',
    /**
     * @description Column의 width 속성
     * @config width
     * @type {int}
     * @default 28
     */
    /**
     * @description Column의 width 속성
     * @property width
     * @private
     * @type {int}
     */
    width : 28,
    /**
     * @description fixed 속성
     * @property fixed
     * @private
     * @type {boolean}
     */
    fixed : true,
    /**
     * @description resizable 속성
     * @property resizable
     * @private
     * @type {boolean}
     */
    resizable : false,
    /**
     * @description selectionType이 radio일 경우 dataSet의 row 위치에 자동으로 선택되하게 하는 기능
     * @config syncRow
     * @sample default
     * @type {boolean}
     * @default false
     */
    /**
     * @description selectionType이 radio일 경우 dataSet의 row 위치에 자동으로 선택되하게 하는 기능
     * @property syncRow
     * @private
     * @type {boolean}
     */
    syncRow: false,
    /**
     * @description copy시 clipboard에 넣을지 여부를 결정한다.
     * @config clipboard
     * @type {boolean}
     * @default false
     */
    /**
     * @description copy시 clipboard에 넣을지 여부를 결정한다.
     * @property clipboard
     * @private
     * @type {boolean}
     */
    clipboard: false,
    systemColumn: true,
    /**
     * @description 객체를 초기화하는 메소드
     * @method init
     * @private
     * @return {void}
     */
    init : function() {
        Rui.ui.grid.LSelectionColumn.superclass.init.call(this);
        var fixedId = Rui.useFixedId() ? Rui.id(this.el, 'LSelcol-header-' + this.id) : '';
        this.label = this.label != 'selection' ? this.label : '<div id=\"' + fixedId + '\" class="L-grid-header-' + this.selectionType + '" style="width:20px"></div>';
    },
    /**
     * @description gridview의 event를 연결하는 메소드
     * @method bindEvent
     * @protected
     * @param {Rui.ui.grid.LGridPanel} gridPanel gridPanel 객체
     * @return {void}
     */
    bindEvent : function(gridPanel) {
        Rui.ui.grid.LSelectionColumn.superclass.bindEvent.call(this, gridPanel);
        var view = gridPanel.getView();
        var ds = view.getDataSet();
        ds.on('allMarked', this.onAllMarked, this);
        ds.on('load', this.onLoad, this, true);
        if(this.syncRow) ds.on('rowPosChanged', this.onRowPosChanged, this);
    },
    /**
     * @description gridview의 event를 연결하는 메소드
     * @method unbindEvent
     * @protected
     * @param {Rui.ui.grid.LGridPanel} gridPanel gridPanel 객체
     * @return {void}
     */
    unbindEvent: function(gridPanel) {
        Rui.ui.grid.LSelectionColumn.superclass.unbindEvent.call(this, gridPanel);
        var view = gridPanel.getView();
        var ds = view.getDataSet();
        ds.unOn('allMarked', this.onAllMarked, this);
        ds.unOn('load', this.onLoad, this);
        if(this.syncRow) ds.unOn('rowPosChanged', this.onRowPosChanged, this);
    },
    /**
     * @description DataSet의 load 이벤트 발생시 수행되는 메소드
     * @method onLoad
     * @private
     * @param {Object} options options
     * @param {String} message message
     * @param {Rui.data.LDataSet} dataSet DataSet 객체
     * @return {void}
     */
    onLoad: function(e) {
        if(e.options.add !== true)
            this.onAllMarked({isSelect: false});
    },
    /**
     * @description dataSet의 rowPosChanged 이벤트가 발생하면 호출되는 메소드
     * @method onRowPosChanged
     * @protected
     * @param {Object} e Event 객체
     * @return {void}
     */
    onRowPosChanged: function(e) {
        if(e.row < 0) return;
        var dataSet = e.target;
        dataSet.setMarkOnly(e.row, true);
    },
    /**
     * @description dataSet의 allMarked 이벤트가 발생하면 호출되는 메소드
     * @method onAllMarked
     * @protected
     * @param {Object} e Event 객체
     * @return {void}
     */
    onAllMarked: function(e) {
        var view = this.gridPanel.getView();
        var idx = this.columnModel.getIndexById(this.id, true);
        var cellEl = view.getHeaderCellEl(idx);
        if(!cellEl) return;
        if(e.isSelect == false) Rui.get(cellEl.dom.childNodes[0]).removeClass('L-grid-header-checkBox-mark');
        else Rui.get(cellEl.dom.childNodes[0]).addClass('L-grid-header-checkBox-mark');
    },
    /**
     * @description dataSet의 marked 이벤트가 발생하면 호출되는 메소드
     * @method onMarked
     * @protected
     * @param {Object} e Event 객체
     * @return {void}
     */
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
    /**
     * @description renderer를 수행하는 메소드
     * @method doRenderer
     * @protected
     * @return {String}
     */
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
/**
 * @description 그리드에 출력할 LColumn들의 집합을 관리하는 객체로 LColumn의 전체 제어에 해당되는 기능을 가지고 있다.
 * @namespace Rui.ui.grid
 * @class LColumnModel
 * @sample default
 * @extends Rui.util.LEventProvider
 * @constructor
 * @param {Object} oConfigs 생성자 config 객체
 */
Rui.ui.grid.LColumnModel = function(oConfigs) {
    var config = oConfigs || {};

    Rui.applyObject(this, config, true);

    this.cellConfig = {};

    this.init(config);

    /**
     * @description 컬럼의 순서가 바뀌면 호출되면 이벤트
     * @event columnMove
     * @sample default
     * @param {Object} target this
     * @param {int} oldIndex
     * @param {int} newIndex
     */
    this.createEvent('columnMove');
    /**
     * @description 컬럼 정보가 바뀌면 호출되는 이벤트
     * @event columnsChanged
     * @param {Object} target this
     */
    this.createEvent('columnsChanged');

    /**
     * @description getRenderCell 메소드가 호출되면 수행하는 이벤트
     * @event cellConfigChanged
     * @param {Object} css css객체
     * @param {int} row row값
     * @param {String} rowId row id
     * @param {int} col col값
     * @param {String} colId col id
     * @param {String} key config key
     * @param {Object} value config value
     * @param {Rui.data.LRecord} record record 객체
     */
    this.createEvent('cellConfigChanged');
    config = null;
};

Rui.extend(Rui.ui.grid.LColumnModel, Rui.util.LEventProvider, {
    /**
     * @description 컬럼 정보를 받는 배열
     * @config columns
     * @type {Array}
     * @default null
     */
    /**
     * @description 컬럼 정보를 받는 배열
     * @property columns
     * @private
     * @type {Array}
     */
    columns: null,
    /**
     * @description LColumn default width 속성
     * @config defaultWidth
     * @type {int}
     * @default 100
     */
    /**
     * @description LColumn default width 속성
     * @property defaultWidth
     * @private
     * @type {int}
     */
    defaultWidth: 100,
    /**
     * @description LColumn total width 속성
     * @property totalWidth
     * @private
     * @type {int}
     */
    totalWidth: null,
    /**
     * @description LColumn default sortable 속성
     * @config defaultSortable
     * @sample default
     * @type {boolean}
     * @default false
     */
    /**
     * @description LColumn default sortable 속성
     * @property defaultSortable
     * @private
     * @type {boolean}
     */
    defaultSortable: false,
    /**
     * @description LColumn default editable 속성
     * @config defaultEditable
     * @type {boolean}
     * @default true
     */
    /**
     * @description LColumn default editable 속성
     * @property defaultEditable
     * @private
     * @type {boolean}
     */
    defaultEditable: true,
    /**
     * @description autoWidth를 적용시 우측 마진값으로 값에 따라서 스크롤이 생기지 않게 한다.
     * @config autoWidthMargin
     * @type {Int}
     * @default 2
     */
    /**
     * @description autoWidth를 적용시 우측 마진값으로 값에 따라서 스크롤이 생기지 않게 한다.
     * @property autoWidthMargin
     * @private
     * @type {Int}
     */
    autoWidthMargin: 2,
    /**
     * @description LColumn의 merge시 앞의 기준으로 merge가 되게 묶는 기능
     * @config groupMerge
     * @type {boolean}
     * @default false
     */
    /**
     * @description LColumn의 merge시 앞의 기준으로 merge가 되게 묶는 기능
     * @property groupMerge
     * @private
     * @type {boolean}
     */
    groupMerge: false,
    /**
     * @description LColumn의 draggable 속성을 모두 default로 설정한다.
     * @config defaultDraggable
     * @type {boolean}
     * @default true
     */
    /**
     * @description LColumn의 draggable 속성을 모두 default로 설정한다.
     * @property defaultDraggable
     * @private
     * @type {boolean}
     */
    defaultDraggable: true,
    /**
     * @description LColumn List 배열 속성
     * @property columnList
     * @private
     * @type {Array}
     */
    columnList: null,
    /**
     * @description 보이는 LColumn List 배열 속성
     * @property showColumnList
     * @private
     * @type {Array}
     */
    showColumnList: null,
    /**
     * @description LColumn Map 속성
     * @property columnMap
     * @private
     * @type {Object}
     */
    columnMap: null,
    /**
     * @description grid view 객체 속성
     * @property gridPanel
     * @private
     * @type {Rui.ui.grid.LGridPanel}
     */
    gridPanel: null,
    /**
     * @description cell renderer시 설정된 객체 정보
     * @property cellConfig
     * @type {Object}
     * @private
     */
    cellConfig: null,
    /**
     * @description 틀고정을 할 LColumn의 id
     * @config freezeColumnId
     * @sample default
     * @type {String}
     * @default null
     */
    /**
     * @description 틀고정을 할 LColumn의 id
     * @property freezeColumnId
     * @private
     * @type {String}
     */
    freezeColumnId: null,
    /**
     * @description freeze 컬럼의 index
     * @property freezeIndex
     * @private
     * @type {int}
     */
    freezeIndex: -1,
    /**
     * @description multiheader 구성정보
     * @property multiheaderInfos
     * @private
     * @type {Array}
     */
    multiheaderInfos: null,
    /**
     * @description merge된 컬럼이 있는지 여부
     * @property merged
     * @private
     * @type {Boolean}
     */
    merged : false,
    /**
     * @description LTriggerColumn을 제외한 모든 컬럼에 autoWidth를 적용한다. autoWidth가 적용되면 세로 스크롤러는 무조건 출력됩니다.
     * autoWidth를 적용하였을때는 기본적으로 그리드의 width보다 적을경우에만 반영한다. 
     * 무조건 autoWidth로 계산을 처리해서 반영하려고 한다면 adjustAutoWidth 속성을 true로 적용한다.
     * @config autoWidth
     * @sample default
     * @type {boolean}
     * @default false
     */
    /**
     * @description LTriggerColumn을 제외한 모든 컬럼에 autoWidth를 적용한다. autoWidth가 적용되면 세로 스크롤러는 무조건 출력됩니다.
     * autoWidth를 적용하였을때는 기본적으로 그리드의 width보다 적을경우에만 반영한다. 
     * 무조건 autoWidth로 계산을 처리해서 반영하려고 한다면 adjustAutoWidth 속성을 true로 적용한다.
     * @property autoWidth
     * @private
     * @type {boolean}
     */
    autoWidth: false,
    /**
     * @description autoWidth를 적용할 경우 그리드의 사이즈와 상관없이 무조건 autoWidth를 적용할지 여부를 결정한다.
     * @config adjustAutoWidth
     * @type {boolean}
     * @default false
     */
    /**
     * @description autoWidth를 적용할 경우 그리드의 사이즈와 상관없이 무조건 autoWidth를 적용할지 여부를 결정한다.
     * autoWidth를 적용하여도 width의 기본값은 반드시 적용한다.
     * @property adjustAutoWidth
     * @type {boolean}
     * @protected
     */
    adjustAutoWidth: false,
    /**
     * @description 엑셀 다운로드나 클립보드 복사시 태그를 제외하게 하는 속성을 설정한다. (성능이 높여야 하는 경우 이 속성을 false로 적용하고 각 컬럼별로 renderer에서 구현한다.
     * @config skipTags
     * @type {boolean}
     * @default true
     */
    /**
     * @description 엑셀 다운로드나 클립보드 복사시 태그를 제외하게 하는 속성을 설정한다. (성능이 높여야 하는 경우 이 속성을 false로 적용하고 각 컬럼별로 renderer에서 구현한다.
     * @property skipTags
     * @private
     * @type {boolean}
     */
    skipTags: true,
    /**
     * @description autoWidth가 적용된 LColumn이 있으면 true로 설정된다.
     * @property isAutoWidth
     * @private
     * @type {Boolean}
     */
    _isAutoWidth : false,
    /**
     * @description editor가 존재하면 true 아니면 false
     * @property _isEditable
     * @private
     * @type {Boolean}
     */
    _isEditable: false,
    /**
     * @description 객체를 초기화하는 메소드
     * @method init
     * @private
     * @param {Object} oConfig 환경정보 객체
     * @return {void}
     */
    init: function(config) {
        var __RUI_events = this.__RUI_events || {};
        var __RUI_subscribers = this.__RUI_subscribers || {};
//        var bcm__RUI_events = null;
//        var bcm__RUI_subscribers = null;
        //if(config.isBasicColumnModel !== true && this.isMultiheader()) {
            //bcm__RUI_events = this.getBasicColumnModel().__RUI_events;
            //bcm__RUI_subscribers = this.getBasicColumnModel().__RUI_subscribers;
            //delete this.basicColumnModel;
        //}
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
        //Multiheader일 경우 dataColumn만 컬럼정보로 남는다.
        this.initMultiheaderInfos();

        if(this.isMultiheader() &&
                Rui.isUndefined(config.makeDummyCell))
            this.makeDummyCell = true;
        /* 중간에 걸리면 중간 컬럼이 두개로 분할되어야할 수도 있다. => 이런 경우는 없다고 가정한다면 간단.
         * multiheader info는 rendering용이다.
         * */
        this.__RUI_events = __RUI_events;
        this.__RUI_subscribers = __RUI_subscribers;
        __RUI_events = __RUI_subscribers = null;
        //if(config.isBasicColumnModel !== true && bcm__RUI_events && this.isMultiheader()) {
        //    this.getBasicColumnModel().__RUI_events = bcm__RUI_events;
        //    this.getBasicColumnModel().__RUI_subscribers = bcm__RUI_subscribers;
        //}
        if(summaryCnt > 1 && groupSummary == false) {
            for (var i = 0, len = summaryIds.length; i < len; i++) {
                var column = this.columnMap[summaryIds[i]];
                column.fixed = true;
            }
        }
        Rui.devGuide(this, 'LColumnModel_init');
        summaryIds = null;
    },
    /**
     * @description LColumn의 이벤트를 연결하는 메소드
     * @method bindEvent
     * @protected
     * @param {Rui.ui.grid.LGridPanel} gridPanel gridPanel 객체
     * @return {void}
     */
    bindEvent: function(gridPanel) {
        this.gridPanel = gridPanel;
        this.gridView = gridPanel.getView();
        for (var i = 0, len = this.getColumnCount(); i < len; i++) {
            var column = this.getColumnAt(i);
            if(column.bindEvent) column.bindEvent(gridPanel);
            column = null;
        }
    },
    /**
     * @description LColumn의 이벤트를 연결하는 메소드
     * @method unbindEvent
     * @protected
     * @param {Rui.ui.grid.LGridPanel} gridPanel gridPanel 객체
     * @return {void}
     */
    unbindEvent: function(gridPanel) {
        this.gridPanel = gridPanel;
        this.gridView = gridPanel.getView();
        for (var i = 0, len = this.getColumnCount(); i < len; i++) {
            var column = this.getColumnAt(i);
            if(column.unbindEvent) column.unbindEvent(gridPanel);
            column = null;
        }
    },
    /**
     * @description id에 해당되는 LColumn을 리턴하는 메소드
     * @method getColumnById
     * @sample default
     * @param {String} id column의 id값
     * @return {Rui.ui.grid.LColumn}
     */
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
    /**
     * @description idx 위치에 해당되는 LColumn을 리턴하는 메소드
     * @method getColumnAt
     * @sample default
     * @param {int} idx 위치값
     * @param {boolean} isVisibleOnly [optional] 보이는 컬럼만 선택 여부
     * @return {Rui.ui.grid.LColumn}
     */
    getColumnAt: function(idx, isVisibleOnly) {
        if (isVisibleOnly === true) {
            return this.showColumnList[idx];
            /*
            var column = null;
            var curIdx = -1;
            var totalCount = this.getColumnCount(false);
            for (var i = 0; idx < totalCount && i < totalCount; i++) {
                column = this.columnList[i];
                if (!column.isHidden()) curIdx++;
                if (curIdx == idx) return column;
            }
            return null;
            */
        } else {
            return this.columnList[idx];
        }
    },
    /**
     * @description idx에 해당되는 LColumn이 hidden인지를 리턴하는 메소드
     * @method isHidden
     * @param {int} col 위치값
     * @return {boolean}
     */
    isHidden: function(idx){
        return this.getColumnAt(idx).isHidden();
    },
    /**
     * @description id에 해당되는 LColumn의 index를 리턴하는 메소드
     * @method getIndexById
     * @param {String} id id명
     * @param {boolean} isVisibleOnly [optional] 보이는 컬럼
     * @return {int}
     */
    getIndexById: function(id, isVisibleOnly) {
        return this.getIndex(this.getColumnById(id), isVisibleOnly);
    },
    /**
     * @description LColumn의 index를 리턴하는 메소드
     * @method getIndex
     * @param {Rui.ui.grid.LColumn} column column 객체
     * @param {boolean} isVisibleOnly [optional] 보이는 컬럼 기준 index
     * @return {int}
     */
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
    /**
     * @description field에 해당되는 LColumn을 리턴하는 메소드
     * @method getColumnByField
     * @param {String} field field명
     * @return {Rui.ui.grid.LColumn}
     */
    getColumnByField: function(field) {
        return this.columnField[field];
    },
    /**
     * @description oldIndex의 LColumn을 newIndex위치로 이동하는 메소드
     * @method moveColumn
     * @param {int} oldIndex 이동할 LColumn의 위치
     * @param {int} newIndex 이동될 LColumn의 위치
     * @return {void}
     */
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

        //index 재정리
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
    /**
     * @description column 배열의 모든 width의 합을 리턴하는 메소드
     * @method getColumnsWidth
     * @protected
     * @param {Array} columns LColumn객체 컬럼 배열
     * @return {int}
     */
    getColumnsWidth: function(columns) {
        var totalWidth = 0;
        for (var i = 0, len = columns.length; i < len; i++)
            totalWidth += columns[i].getWidth();
        return totalWidth;
    },
    /**
     * @description freeze 컬럼의 이전 컬럼들을 리턴하는 메소드
     * @method getFirstColumns
     * @protected
     * @param {boolean} isVisibleOnly [optional] 보이는 컬럼만 선택 여부
     * @return {int}
     */
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
    /**
     * @description freeze 컬럼의 이전 컬럼들의 width의 합을 리턴하는 메소드
     * @method getFirstColumnsWidth
     * @protected
     * @param {boolean} isVisibleOnly [optional] 보이는 컬럼만 선택 여부
     * @return {int}
     */
    getFirstColumnsWidth: function(isVisibleOnly) {
        if (!this.firstColumnsWidth) {
            this.firstColumnsWidth = 0;
            var columns = this.getFirstColumns(isVisibleOnly);
            this.firstColumnsWidth = this.getColumnsWidth(columns);
            columns = null;
        }
        return this.firstColumnsWidth;
    },
    /**
     * @description freeze 컬럼의 이후 컬럼들을 리턴하는 메소드
     * @method getLastColumns
     * @protected
     * @param {boolean} isVisibleOnly [optional] 보이는 컬럼만 선택 여부
     * @return {int}
     */
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
    /**
     * @description freeze 컬럼의 이후 컬럼들의 width의 합을 리턴하는 메소드
     * @method getLastColumnsWidth
     * @protected
     * @param {boolean} isVisibleOnly [optional] 보이는 컬럼만 선택 여부
     * @return {int}
     */
    getLastColumnsWidth: function(isVisibleOnly) {
        if (!this.lastColumnsWidth) {
            this.lastColumnsWidth = 0;
            var columns = this.getLastColumns(isVisibleOnly);
            this.lastColumnsWidth = this.getColumnsWidth(columns);
            columns = null;
        }
        return this.lastColumnsWidth;
    },
    /**
     * @description 전체 column의 width를 리턴하는 메소드
     * @method getTotalWidth
     * @param {boolean} isVisibleOnly [optional] 보이는 컬럼만 선택 여부
     * @return {int}
     */
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
    /**
     * @description setwidth, setHidden등에 의해 size변동이 생기면 cache값 초기화
     * @private
     * @method clearTotalWidth
     * @return {void}
     */
    clearTotalWidth: function(){
        this.firstColumnsWidth = null;
        this.lastColumnsWidth = null;
        this.totalWidth = null;
    },
    /**
     * @description freeze컬럼 기준으로 앞의 LColumn의 갯수를 리턴하는 메소드
     * @method getFirstColumnCount
     * @protected
     * @sample default
     * @param {boolean} isVisibleOnly [optional] 보이는 컬럼만 선택 여부
     * @return {int}
     * @deprecated
     */
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
    /**
     * @description freeze컬럼 기준으로 뒤의 LColumn의 갯수를 리턴하는 메소드
     * @method getLastColumnCount
     * @protected
     * @sample default
     * @param {boolean} isVisibleOnly [optional] 보이는 컬럼만 선택 여부
     * @return {int}
     */
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
    /**
     * @description 전체 LColumn의 갯수를 리턴하는 메소드
     * @method getColumnCount
     * @sample default
     * @param {boolean} isVisibleOnly [optional] 보이는 컬럼만 선택 여부
     * @return {int}
     */
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
    /**
     * @description cell config 정보를 설정한다.
     * @method setCellConfig
     * @public
     * @param {int} row row 위치
     * @param {int|String} col col 위치
     * @param {String} key config 키
     * @param {Object} value config 값
     * @return {void}
     */
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
    /**
     * @description cell config 정보를 리턴한다.
     * @method getCellConfig
     * @public
     * @param {int} row row 위치
     * @param {int|String} col col 위치
     * @param {String} key config 키
     * @return {Object}
     */
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
    /**
     * @description cell config 정보를 초기화한다.
     * @method clearCellConfig
     * @public
     * @return {void}
     */
    clearCellConfig: function() {
        this.cellConfig = null;
        delete this.cellConfig;
        this.cellConfig = {};
        this.rowData = null;
        delete this.rowData;
        this.rowData = {};
    },
    /**
     * @description multiheaderInfos가져오기
     * {colInfos: colInfos,rowCount: rowCount,colCount: colCount,dataColumns: dataColumns}
     * @method getMultiheaderInfos
     * @protected
     * @param {int} index 틀고정 multiheader정보의 index
     * @return {Object}
     */
    getMultiheaderInfos: function(index) {
        index = Rui.isUndefined(index) ? this.multiheaderInfos.length - 1 : index;
        return this.multiheaderInfos[index];
    },
    /**
     * @description FreezColumn정보를 포함한  multiheaderInfos가져오기
     * {colInfos: colInfos,rowCount: rowCount,colCount: colCount,dataColumns: dataColumns}
     * @method getMultiheaderAllColumns
     * @protected
     * @return {Object}
     */
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
    /**
     * @description multiheaderInfos초기화
     * @method initMultiheaderInfos
     * @private
     * @return {Object}
     */
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
    /**
     * @description header 행 수 리턴
     * @method getRowCount
     * @private
     * @return {Int}
     */
    getRowCount: function(){
        if (this.isMultiheader()) {
            return Rui.ui.grid.LCellMerge.getHeaderRowCount(this.getBasicColumnModel().columnList);
        }
        else
            return 1;
    },
    /**
     * @description 처음 생성한 기준에서의 컬럼 모델을 생성한다.
     * @method getBasicColumnModel
     * @private
     * @return {Rui.ui.grid.LColumnModel}
     */
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
    /**
     * @description multiheaderInfos를 생성한다.
     * @method createMultiheaderInfos
     * @private
     * @param {Array} columns columns 객체 배열
     * @return {Object}
     */
    createMultiheaderInfos: function(columns,rowCount) {
        var mInfos = Rui.ui.grid.LCellMerge.getMultiHeaderInfo(columns,rowCount);
        if(!mInfos) return false;
        try {
            return mInfos;
        } finally {
            mInfos = null;
        }
    },
    /**
     * @description data column 기준으로 컬럼정보를 재 생성한다.
     * @method createDataColumns
     * @private
     * @return {Object}
     */
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
    /**
     * @description freeze column 여부를 리턴한다.
     * @method hasFreezeColumn
     * @return {boolean}
     */
    hasFreezeColumn: function() {
        return (this.freezeIndex > -1);
    },
    /**
     * @description columnList, columnMap, columnIndex, columnField의 객체를 초기화 한다.
     * @method initColumns
     * @private
     * @return {void}
     */
    initColumns: function() {
        this.columnList = [];
        this.showColumnList = [];
        this.columnMap = {};
        this.columnIndex = {};
        this.columnField = {};
        delete this.visibleColumnCount;
    },
    /**
     * @description multiheader여부
     * @method isMultiheader
     * @public
     * @return {Boolean}
     */
    isMultiheader: function(){
        return this.multiheaderInfos ? true : false;
    },
    /**
     * @description 컬럼들 모두 재정의 한다. (그리드의 전체 랜더링이 발생하므로 성능 저하 발생)
     * @method setColumns
     * @public
     * @sample default
     * @param {Object} columns 변경할 컬럼 config 정보
     * @param {boolean} ignoreEvent 변경할 컬럼 config 정보
     * @return {void}
     */
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
                    // need to destroy, do here
                    // c.editor.destroy();
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
    /**
     * @description merge 되었는지 여부
     * @method isMerged
     * @public
     * @return {Boolean}
     */
    isMerged : function(){
        return this.merged;
    },
    /**
     * @description 틀고정 컬럼을 변경한다.
     * @method setFreezeColumnId
     * @public
     * @param {String} id LColumn의 id
     * @return {void}
     */
    setFreezeColumnId: function(id) {
        this.clearTotalWidth();
        var newOption = {};
        Rui.applyObject(newOption, this._initOptions);
        newOption.freezeColumnId = id;
        this.setColumns(newOption);
        newOption = null;
    },
    /**
     * @description 초기 컬럼모델 옵션정보를 리턴한다.
     * @method getInitOptions
     * @protected
     * @return {void}
     */
    getInitOptions: function() {
        return this._initOptions;
    },
    /**
     * @description autoWidth가 적용된 컬럼을 maxWidth에 맞춰서 자동으로 width를 변경한다.
     * @method updateColumnsAutoWidth
     * @public
     * @param {int} maxWidth 전체 컬럼에 적용할 width
     * @return {String}
     */
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
                // minWidth/maxAutoWidth가 적용되면 다시 계산
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
    /**
     * @description autoWidth가 적용할 컬럼 정보를 계산하여 widths에 넣고 재계산 여부를 리턴한다.
     * @method calColumnAutoWidths
     * @private
     * @param {Array} widths 적용되는 컬럼 목록을 받는 배열
     * @param {Array} autoWidthColumns 적용할 컬럼 배열
     * @param {int} maxAutoWidth autoWidth가 적용되는 컬럼의 전체 넓이
     * @param {int} sumAutoWidth autoWidth가 적용되는 현재 컬럼의 넓이 합계
     * @return {boolean}
     */
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
    /**
     * @description summary 컬럼이 존재하는지 여부를 리턴한다.
     * @method isSummary
     * @public
     * @return {boolean}
     */
    isSummary: function() {
        return this._isSummary;
    },
    /**
     * @description autoWidth가 적용된 LColumn이 있으면 true를 리턴한다.
     * @method isAutoWidth
     * @public
     * @return {boolean}
     */
    isAutoWidth: function() {
        return this._isAutoWidth;
    },
    /**
     * @description 객체의 toString
     * @method toString
     * @public
     * @return {String}
     */
    toString: function() {
        return 'Rui.ui.grid.LColumnModel ' + this.id;
    },
    /**
     * DOM에서 패널 엘리먼트를 제거하고 모든 자식 엘리먼트들을 null로 설정한다.
     * @method destroy
     */
    destroy: function() {
        if(this.basicColumnModel)
            this.basicColumnModel.destroy();
        Rui.ui.grid.LColumnModel.superclass.destroy.call(this);
    }
});
Rui.ui.grid.LColumnModel.rendererMapper = [];
/**
 * @description 그리드에 출력할 row들의 집합을 관리하는 객체.
 * row에 대한 랜더링 및 이벤트 제어용.
 * @namespace Rui.ui.grid
 * @class LRowModel
 * @extends Rui.util.LEventProvider
 * @sample default
 * @constructor
 * @param {Object} config 생성자 config 객체
 */
Rui.ui.grid.LRowModel = function(config) {
    config = config || {};

    Rui.applyObject(this, config, true);

    this.rowConfig = {};

    /**
     * @description getRenderRow 메소드가 호출되면 수행하는 이벤트
     * @event rowConfigChanged
     * @param {int} row row값
     * @param {String} rowId rowId값
     * @param {String} key key값
     * @param {Object} value value값
     * @param {Rui.data.LRecord} record record 객체
     */
    this.createEvent('rowConfigChanged');
};

Rui.extend(Rui.ui.grid.LRowModel, Rui.util.LEventProvider, {
    /**
     * @description grid view 객체 속성
     * @property gridPanel
     * @private
     * @type {Rui.ui.grid.LGridPanel}
     */
    gridPanel : null,
    /**
     * @description row renderer시 설정된 객체 정보
     * @property rowConfig
     * @type {Object}
     * @private
     */
    rowConfig: null,
    /**
     * @description row renderer시 수행되는 메소드
     * @config renderer
     * @type {Function}
     * @default null
     */
    /**
     * @description row renderer시 수행되는 메소드
     * @property renderer
     * @type {Function}
     * @private
     */
    renderer: null,
    /**
     * @description 객체를 초기화하는 메소드
     * @method init
     * @private
     * @param {Object} oConfig 환경정보 객체
     * @return {void}
     */
    init: function(config) {
    },
    /**
     * @description LColumn의 이벤트를 연결하는 메소드
     * @method bindEvent
     * @protected
     * @param {Rui.ui.grid.LGridPanel} gridPanel gridPanel 객체
     * @return {void}
     */
    bindEvent: function(gridPanel) {
        this.gridPanel = gridPanel;
        //this.gridView = gridPanel.getView();
    },
    /**
     * @description LColumn의 이벤트를 연결하는 메소드
     * @method unbindEvent
     * @protected
     * @param {Rui.ui.grid.LGridPanel} gridPanel gridPanel 객체
     * @return {void}
     */
    unbindEvent: function(gridPanel) {
        this.gridPanel = gridPanel;
        //this.gridView = gridPanel.getView();
    },
    /**
     * @description row config 정보를 설정한다.
     * @method setRowConfig
     * @public
     * @param {int} row row 위치
     * @param {String} key config 키
     * @param {Object} value config 값
     * @return {void}
     */
    setRowConfig: function(row, key, val) {
        var gridView = this.gridPanel.getView();
        var record = gridView.dataSet.getAt(row);
        if(record == null) return;
        var rowData = this.rowConfig[record.id] || {};
        this.rowConfig[record.id] = rowData;
        rowData[key] = val;
        this.fireEvent('rowConfigChanged', { target:this, row: row, rowId: record.id, key: key, value: val });
    },
    /**
     * @description row config 정보를 리턴한다.
     * @method getRowConfig
     * @public
     * @param {int} row row 위치
     * @param {String} key config 키
     * @return {Object}
     */
    getRowConfig: function(row, key) {
        var gridView = this.gridPanel.getView();
        var record = gridView.dataSet.getAt(row);
        if(record == null) return;
        var rowData = this.rowConfig[record.id] || {};
        return rowData[key];
    },
    /**
     * DOM에서 패널 엘리먼트를 제거하고 모든 자식 엘리먼트들을 null로 설정한다.
     * @method destroy
     */
    destroy: function() {
        this.rowConfig = null;
        delete this.rowConfig;
        this.renderer = null;
        delete this.renderer;
        Rui.ui.grid.LRowModel.superclass.destroy.call(this);
    },
    /**
     * @description 객체의 toString
     * @method toString
     * @public
     * @return {String}
     */
    toString: function() {
        return 'Rui.ui.grid.LRowModel ' + this.id;
    }
});



/**
 * @description LColumnResizer
 * @namespace Rui.ui.grid
 * @class LColumnResizer
 * @private
 * @extends Rui.dd.LDDProxy
 * @constructor
 * @param {Object} oConfigs Object literal of definitions.
 */
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

    //selected header cell index
    cellIndex: null,

    startX: null,

    b4StartDrag: function(x,y){
        //drag동안 header click안되게 등.
        this.grid.headerDisabled = true;        
        var height = this.grid.el.getHeight();
        //grid에 출력된 cell은 보이는 cell이다.
        var width = this.grid.columnModel.getColumnAt(this.cellIndex, true).getWidth();
        var minWidth = (width - this.grid.getMinColumnWidth());
        //drag 가능한 범위
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
            var xy = headerCellEl.getXY(), x = xy[0]; //, y = xy[1];
            var exy = Rui.util.LEvent.getXY(e);
            var ex = exy[0];
            var w = headerCellEl.getWidth(), adjust = false;
            if((ex - x) <= this.grid.resizeHandleWidth){
                adjust = -1;
            }else if((x+w) - ex <= this.grid.resizeHandleWidth){
                adjust = 0;
            }
            if(adjust !== false){                
                var ci = this.grid.getCell(headerCellEl.dom, e.pageX);//headerCellEl.dom.cellIndex;
                this.cellIndex = ci+adjust;
                var column = this.grid.columnModel.getColumnAt(this.cellIndex, true);
                //this.split = headerCellEl.dom;
                if(column && column.isResizable()){
                    Rui.ui.grid.LColumnResizer.superclass.handleMouseDown.apply(this, arguments);
                }
            }else if(this.grid.columnDD){
                //범위가 아니면 columnDD호출
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

/**
 * @description LColumnDD column을 drag drop으로 이동을 위한 class
 * @namespace Rui.ui.grid
 * @class LColumnDD
 * @private
 * @extends Rui.dd.LDDProxy
 * @constructor LColumnDD
 * @param {Rui.ui.grid.LGridView} grid column dd를 적용할 gridview
 */
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
    /**
     * @description 객체의 이름
     * @property otype
     * @private
     * @type {String}
     */
    otype: 'Rui.ui.grid.LColumnDD',
    /**
     * @description drag start전에 실행되는 method
     * @private
     * @method b4StartDrag
     * @param {int} x drag 시작 좌표
     * @param {int} y drag 시작 좌표
     * @return {void}
     */
    b4StartDrag: function(x,y){
        //drag동안 header click안되게 등.
        this.grid.headerDisabled = true;
        var height = this.grid.el.getHeight();
        //grid에 출력된 cell은 보이는 cell이다.
        var c = this.grid.columnModel.getColumnAt(this.cellIndex, true);
        if(c.draggable !== true) return;
        var width = c.getWidth();
//            var containerWidth = this.grid.el.getWidth();
        var region = this.grid.el.getRegion();
        this.grid.ddProxyEl.setHeight(height);
        this.grid.ddProxyEl.setWidth(width);
        this.grid.ddTargetEl.setHeight(height);
        var minWidth = region.left;
        var maxWidth = region.right;
        this.resetConstraints();
        this.setXConstraint(minWidth, maxWidth);
        this.setYConstraint(0, this.grid.headerEl.getHeight());
        //var xy = this.headerCellEl.getXY();
        //this.setDelta(x-xy[0],y-xy[1]);
        Rui.dd.LDDProxy.prototype.b4StartDrag.call(this, x, y);
    },
    /**
     * @description click시 drag할 상황인지 판단하는 method 
     * @private
     * @method clickValidator  
     * @param {object} e event object
     * @return {void}
     */
    clickValidator: function(e) {
        var headerCellDom = this.grid.findHeaderCellDom(e.target);
        if (headerCellDom) {
            this.headerCellEl = Rui.get(headerCellDom);
            this.cellIndex = this.grid.getCell(headerCellDom, e.pageX);
            this.newCellIndex = this.cellIndex;
            var column = this.grid.columnModel.getColumnAt(this.cellIndex, true);
            if (this.grid._useColumnDD && column.isDraggable() && !column.isFixed()) {
                //A tag는 기본적으로 drag가능하므로 isValidHandleChild에서 검사하도록 되어있다.  통과되도록 뺀다.
                var target = Rui.util.LEvent.getTarget(e);// this.isValidHandleChild(target) &&
                return (this.id == this.handleElId || this.LDDM.handleWasClicked(target, this.id));
            }
        }
    },
    /**
     * @description drag시 실행되는 event handler 
     * @private
     * @method onDrag
     * @param {object} e event object
     * @return {void}
     */
    onDrag: function(e) {
        var headerCellDom = this.grid.findHeaderCellDom(e.target);
        if(headerCellDom) {
            var headerCellEl = Rui.get(headerCellDom);
            var newCellIndex = this.grid.getCell(headerCellEl.dom);
            var column = this.grid.columnModel.getColumnAt(newCellIndex, true);
            if (column.isDraggable() && !column.isFixed()) {
                //target위치 잡기
                var xy = headerCellEl.getXY();
                this.grid.ddTargetEl.setXY([xy[0], xy[1] - 5]);//-5는 target의 width
                this.grid.ddTargetEl.show();

                //이동할 곳 표시선 표시
                //이동할 곳이 this.cellIndex가 아니고 이전 또는 이후면서 
                //이전일 경우는 +상태, 이후일 경우는 -상태일 경우
//                    var adjuust = '';
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
                //var colCount = this.grid.columnModel.getColumnCount(true);
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
    /**
     * @description drag시 종료시 실행되는 method 
     * @private
     * @method endDrag
     * @return {void}
     */
    endDrag: function() {
        this.grid.ddTargetEl.hide();
        if(this.cellIndex !== this.newCellIndex) this.grid.columnModel.moveColumn(this.cellIndex, this.newCellIndex);
        this.newCellIndex = null;
        this.grid.headerDisabled = false;
    },
    /**
     * @description autoOffset 
     * @private
     * @method autoOffset
     * @return {void}
     */
    autoOffset: function(){
        this.setDelta(0,-5);
    },
    /**
     * @description callHandleMouseDown 
     * @private
     * @method callHandleMouseDown
     * @return {void}
     */
    callHandleMouseDown: function(e){
        Rui.ui.grid.LColumnDD.superclass.handleMouseDown.call(this, e);
    }
});


(function() {
    var Dom = Rui.util.LDom;
    /**
     * @description LBufferGridView 성능을 위해 보이는 부분만 rendering하는 grid
     * @namespace Rui.ui.grid
     * @class LBufferGridView
     * @extends Rui.ui.LUIComponent
     * @constructor LBufferGridView
     * @param {Object} config The intial LBufferGridView.
     */
    Rui.ui.grid.LBufferGridView = function(config) {
        config = config || {};

        config = Rui.applyIf(config, Rui.getConfig().getFirst('$.ext.grid.defaultProperties'));

        /**
         * @description 그리드의 데이터부분이 다시 렌더링되면 호출되는 이벤트
         * @event renderBody
         * @sample default
         */
        this.renderBodyEvent = this.createEvent('renderBody', { isCE: true });

        /**
         * @description setSyncDataSet 메소드가 호출되면 수행하는 이벤트
         * @event syncDataSet
         * @param {Object} target this객체
         * @param {boolean} isSync sync 여부
         */
        this.createEvent('syncDataSet');

        /**
         * @description 그리드의 데이터가 랜더링되기 전 경우 호출되는 이벤트 (상황에 따라 반복 호출됨)
         * @event beforeRender
         * @protected
         */
        this.createEvent('beforeRender');

        /**
         * @description 그리드의 데이터가 랜더링된 후 경우 호출되는 이벤트 (상황에 따라 반복 호출됨)
         * @event rendered
         * @protected
         */
        this.createEvent('rendered');

        /**
         * @description getRenderRow 메소드가 호출되면 수행하는 이벤트
         * @event rowRendered
         * @sample default
         * @param {Object} css css객체
         * @param {int} row row값
         * @param {Rui.data.LRecord} record record 객체
         *
         */
        this.createEvent('rowRendered');

        /**
         * @description getRenderCell 메소드가 호출되면 수행하는 이벤트
         * @event cellRendered
         * @param {Object} css css객체
         * @param {int} row row값
         * @param {int} col col값
         * @param {Rui.data.LRecord} record record 객체
         */
        this.createEvent('cellRendered');

        /**
         * @description dataSet의 sortField 메소드가 호출되거나 그리드에서 정렬버튼을 클릭할 경우 수행하는 이벤트
         * @event sortField
         * @sample default
         * @param {Object} target this 객체
         * @param {String} sortField sortField값
         * @param {String} sortDir sortDir값
         */
        this.createEvent('sortField');

        /**
         * @description panel이 bodyScroll 되면 호출되는 이벤트
         * @event bodyScroll
         */
        this.createEvent('bodyScroll');

        /**
         * @description 버퍼 그리드의 전체가 랜더링 될 경우 호출되는 이벤트 (상황에 따라 반복 호출됨)
         * @event redoRender
         * @protected
         */
        this.createEvent('redoRender');

        /**
         * @description 그리드의 데이터가 출력될 경우 호출되는 이벤트 (상황에 따라 반복 호출됨)
         * @event renderData
         * @protected
         */
        this.createEvent('renderData');

        /**
         * @description 그리드의 세로 스크롤이 되면 발생되는 이벤트
         * 속성 : beforeScrollTop: 이전 위치, scrollTop: 현재 위치, isFirst: 처음 여부, isEnd: 마지막 여부, isUp: 위로 올라갈 경우 
         * @event scrollY
         * @protected
         */
        this.createEvent('scrollY');

        /**
         * @description 그리드의 가로 스크롤이 되면 발생되는 이벤트
         * 속성 : beforeScrollLeft: 이전 위치, scrollLeft: 현재 위치
         * @event scrollX
         * @protected
         */
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
        /**
         * @description object type
         * @property otype
         * @protected
         * @type {String}
         */
        otype: 'Rui.ui.grid.LBufferGridView',
        /**
         * @description LColumnModel 객체
         * @config columnModel
         * @type {Rui.ui.grid.LColumnModel}
         * @default null
         */
        /**
         * @description LColumnModel 객체
         * @property columnModel
         * @type {Rui.ui.grid.LColumnModel}
         * @protected
         */
        columnModel: null,
        /**
         * @description template 객체
         * @property templates
         * @type {Rui.LTemplate}
         * @protected
         */
        templates: null,
        /**
         * @description DataSet 객체
         * @config dataSet
         * @type {Rui.data.LDataSet}
         * @default null
         */
       /**
         * @description DataSet 객체
         * @property dataSet
         * @type {Rui.data.LDataSet}
         * @protected
         */
        dataSet: null,
        /**
         * @description DataSet과 sync 여부 객체
         * @config syncDataSet
         * @type {boolean}
         * @default true
         */
        /**
         * @description DataSet과 sync 여부 객체
         * @property syncDataSet
         * @type {boolean}
         * @protected
         */
        syncDataSet: true,
        /**
         * @description load message
         * @config loadingMessage
         * @type {String}
         * @default 'Loading...'
         */
        /**
         * @description load message
         * @property loadingMessage
         * @type {String}
         * @protected
         */
        loadingMessage: '',
        /**
         * @description empty data message의 메시지코드
         * @config emptyDataMessageCode
         * @sample default
         * @type {String}
         * @default '$.base.msg115'
         */
        /**
         * @description empty data message의 메시지코드
         * @property emptyDataMessageCode
         * @type {String}
         * @protected
         */
        emptyDataMessageCode: null,
        /**
         * @description scroller 설정값 { scrollbar: 'y' }
         * @config scrollerConfig
         * @type {Object}
         * @default null
         */
        /**
         * @description scroller 설정값 { scrollbar: 'y' }
         * @property scrollerConfig
         * @type {Object}
         * @protected
         */
        scrollerConfig: null,
        /**
         * @description boder의 width 값
         * 나머지 모두는 cell div에 border를 할당했지만, right border는 td에 할당 => 내부 div에 할당시 padding에 의해 우측 border가 td범위 넘어서서 출력되지 않음
         * @config borderWidth
         * @type {int}
         * @default 1
         */
        /**
         * @description boder의 width 값
         * 나머지 모두는 cell div에 border를 할당했지만, right border는 td에 할당 => 내부 div에 할당시 padding에 의해 우측 border가 td범위 넘어서서 출력되지 않음
         * @property borderWidth
         * @type {int}
         * @protected
         */
        borderWidth: 1,
        /**
         * @description scroller LElement object
         * @property scrollerEl
         * @type {Rui.LElement}
         * @protected
         */
        scrollerEl: null,
        /**
         * @description header LElement object
         * @property headerEl
         * @type {Rui.LElement}
         * @protected
         */
        headerEl: null,
        /**
         * @description focus LElement object
         * @property focusEl
         * @type {Rui.LElement}
         * @protected
         */
        focusEl: null,
        /**
         * @description header offset LElement object
         * @property headerOffsetEl
         * @type {Rui.LElement}
         * @protected
         */
        headerOffsetEl: null,
        /**
         * @description header offset LElement object
         * @property bodyEl
         * @type {Rui.LElement}
         * @protected
         */
        bodyEl: null,
        /**
         * @description resize proxy LElement object
         * @property resizeProxyEl
         * @type {Rui.LElement}
         * @protected
         */
        resizeProxyEl: null,
        /**
         * @description resize handle width
         * @config resizeHandleWidth
         * @type {int}
         * @default 5
         */
         /**
         * @description resize handle width
         * @property resizeHandleWidth
         * @type {int}
         * @protected
         */
        resizeHandleWidth: 8,
        /**
         * @description grid body영역의 row에 mouseover됬을 경우 L-grid-row-over class를 추가 할 지 여부
         * @config rowHoverStyle
         * @type {boolean}
         * @default true
         */
        /**
         * @description grid body영역의 row에 mouseover됬을 경우 L-grid-row-over class를 추가 할 지 여부
         * @property rowHoverStyle
         * @type {boolean}
         * @protected
         */
        rowHoverStyle: true,
        /**
         * @description minimum column width
         * @config minColumnWidth
         * @type {int}
         * @default 10
         */
         /**
         * @description minimum column width
         * @property minColumnWidth
         * @type {int}
         * @protected
         */
        minColumnWidth: 10,
        /**
         * @description cell selector class name
         * @property cellSelector
         * @type {string}
         * @protected
         */
        cellSelector: '.' + GV.CLASS_GRIDVIEW_CELL,
        /**
         * @description cell selector search depth
         * @property cellSelectorDepth
         * @type {int}
         * @protected
         */
        cellSelectorDepth:10,
        /**
         * @description row selector class name
         * @property rowSelector
         * @type {string}
         * @protected
         */
        rowSelector: '.' + GV.CLASS_GRIDVIEW_ROW,
        /**
         * @description row selector search depth
         * @property rowSelectorDepth
         * @type {int}
         * @protected
         */
        rowSelectorDepth: 10,
        /**
         * @description if header is disabled
         * @property headerDisabled
         * @type {boolean}
         * @protected
         */
        headerDisabled: false,
        /**
         * @description can resize column
         * @property useColumnResize
         * @type {boolean}
         * @protected
         */
        useColumnResize: true,
        /**
         * @description can drag and drop column
         * @property useColumnDD
         * @type {boolean}
         * @protected
         */
        useColumnDD: true,
        /**
         * @description header tool 사용 여부
         * @property headerTools
         * @type {boolean}
         * @protected
         */
        headerTools: false,
        /**
         * @description mouse over시 활성화된 header cell저장
         * @property activeHeaderEl
         * @type {Rui.LElement}
         * @protected
         */
        activeHeaderEl: null,
        /**
         * @description colum resizer object
         * @property columnResizer
         * @type {Rui.ui.grid.LColumnResizer}
         * @protected
         */
        columnResizer: null,
        /**
         * @description regular expression for finding cell
         * @property cellRe
         * @type {string}
         * @protected
         */
        cellRe: new RegExp('L-grid-cell-([^\\s]+)', ''),
        /**
         * @description regular expression for finding row
         * @property rowRe
         * @type {string}
         * @protected
         */
        rowRe: new RegExp('L-grid-row-r([^\\s]+)', ''),
        /**
         * @description drag and drop proxy element object
         * @property ddProxyEl
         * @type {Rui.LElement}
         * @protected
         */
        ddProxyEl: null,
        /**
         * @description drag and drop target element object
         * @property ddTargetEl
         * @type {Rui.LElement}
         * @protected
         */
        ddTargetEl: null,
        /**
         * @description grid panel object
         * @property gridPanel
         * @type {Rui.ui.grid.LGridPanel}
         * @protected
         */
        gridPanel: null,
        /**
         * @description sort field name
         * @property sortFieldName
         * @type {string}
         * @protected
         */
        sortField: null,
        /**
         * @description sort direction asc, desc
         * @property sortDirection
         * @type {string}
         * @protected
         */
        sortDir: null,
        /**
         * @description remote sort 여부
         * @property isRemoteSort
         * @type {boolean}
         * @protected
         */
        isRemoteSort: false,
        /**
         * @description 성능을 위해 데이터셋의 이벤트를 하나로 처리하게 구현
         * @property dataSetEvents
         * @type {Object}
         * @protected
         */
        dataSetEvents: null,
        /**
         * @description Rui.ui.grid.LScroller
         * @property scroller
         * @protected
         * @type {Rui.ui.grid.LScroller}
         * @default null
         */
        scroller: null,
        /**
         * @description 보여지는 범위 계산용 내부 변수
         * @property renderRange
         * @protected
         * @type {int}
         * @default null
         */
        renderRange: null,
        /**
         * @description 그리드가 render시 row와 cell 관련 render event들를 실행할지 여부
         * (row, cell관련 render이벤트를 사용시 성능 저하가 발생하므로 대량건 처리시는 반드시 true로 설정하여 이 기능을 skip해야함)
         * @config skipRowCellEvent
         * @type {boolean}
         * @default true
         */
         /**
         * @description 그리드가 render시 row와 cell 관련 render event들를 실행할지 여부
         * (row, cell관련 render이벤트를 사용시 성능 저하가 발생하므로 대량건 처리시는 반드시 true로 설정하여 이 기능을 skip해야함)
         * @property skipRowCellEvent
         * @type {boolean}
         * @protected
         */
        skipRowCellEvent: true,
        /**
         * @description 그리드를 몇초간격으로 랜더링할지 시간(밀리세컨드)
         * @config renderTime
         * @type {int}
         * @default 50
         */
        /**
         * @description 그리드를 몇초간격으로 랜더링할지 시간(밀리세컨드)
         * @property renderTime
         * @type {int}
         * @protected
         */
        renderTime: 50,
        /**
         * @description 그리드의 데이터를 몇초간격으로 랜더링할지 시간(밀리세컨드)
         * @config renderDataTime
         * @type {int}
         * @default 50
         */
        /**
         * @description 그리드의 데이터를 몇초간격으로 랜더링할지 시간(밀리세컨드)
         * @property renderDataTime
         * @type {int}
         * @protected
         */
        renderDataTime: 50,
        /**
         * @description 행단위 렌더링 맥스값, 한번 스크롤에 limit이상 scroll되면 page단위 렌더링이 일어나며,
         * scrollTimetout값에 따라서 page rendering이 skip될 수 있다.
         * @config rowRenderingLimit
         * @type {int}
         * @default 10
         */
        /**
         * @description 행단위 렌더링 맥스값, 한번 스크롤에 limit이상 scroll되면 page단위 렌더링이 일어나며,
         * scrollTimetout값에 따라서 page rendering이 skip될 수 있다.
         * @property rowRenderingLimit
         * @type {int}
         * @protected
         */
        rowRenderingLimit: 10,
        /**
         * @description page rendering이 지정한 시간내에 두번 이상 발생하면 skip된다.
         * @config scrollTimeout
         * @type {int}
         * @default 20
         */
        /**
         * @description page rendering이 지정한 시간내에 두번 이상 발생하면 skip된다.
         * @property scrollTimeout
         * @type {int}
         * @protected
         */
        scrollTimeout: 20,
        /**
         * @description LColumn의 editor에 해당되는 객체가 autoMapping을 지원하는 rendererField가 있을 경우 rendererField 기준으로 정렬이 가능하게 한다.
         * @config autoMappingSortable
         * @type {boolean}
         * @default false
         */
        /**
         * @description LColumn의 editor에 해당되는 객체가 autoMapping을 지원하는 rendererField가 있을 경우 rendererField 기준으로 정렬이 가능하게 한다.
         * @property autoMappingSortable
         * @type {boolean}
         * @protected
         */
        autoMappingSortable: false,
        /**
         * @description 데이터 값이 변환 최종 시간을 저장한다.
         * @property modifiedDate
         * @type {int}
         * @protected
         */
        modifiedDate: new Date(),
        /**
         * @description plugin등이 추가되어 scroller의 scroll height이 고정으로 줄어들어야 할 경우 이 값을 설정한다.
         * 예를 들어 Total Summary Plugin이 추가되면 이 값이 고정된 값으로 설정되어 scroller의 height이 줄어든다.
         * @property pluginSpaceHeight
         * @type {int}
         * @protected
         */
        pluginSpaceHeight: 0,
        /**
         * @description 불규칙적인 row height을 감안한 스크롤러를 사용할지 여부.
         * 이 값을 true로 해야 br, 소계등 기능 사용시 전체 row를 바르게 스크롤할 수 있다.
         * 또한 이 값을 true로 지정할 경우 성능 저하가 발생될 수 있으므로 반드시 필요한 경우에만 사용하여야 한다.
         * 기본 그리드뷰어인 LBufferGridView에서 irregularScroll 기능을 사용하지 않고, 몇가지 조건에 맞다면 LGridView 사용하는것이 좋다.
         * 이는 irregularScroll의 경우 스크롤 제어를 위한 스크립트 처리 비용이 높아 성능 저하가 발생하며, 부자연스러운 스크롤 동작이 발생할수 있는데 반해
         * LGridView의 경우 브라우저가 생성해내는 스크롤을 직접 사용하므로 빠르고 매끄럽기 때문이다.
         * 다만 LGridView의 경우 대량건의 데이터 처리에 적합하지 않고, 소계, 합계 등 일부 기능을 지원 하지 않는다. 
         * @config irregularScroll
         * @type {boolean}
         * @default false
         */
        /**
         * @description 불규칙적인 row height을 감안한 스크롤러를 사용할지 여부.
         * 이 값을 true로 해야 br, 소계등 기능 사용시 전체 row를 바르게 스크롤할 수 있다.
         * 또한 이 값을 true로 지정할 경우 성능 저하가 발생될 수 있으므로 반드시 필요한 경우에만 사용하여야 한다.
         * @property irregularScroll
         * @type {boolean}
         * @protected
         */
        irregularScroll: false,
        /**
         * @description 불규칙적인 row height을 감안한 스크롤러를 사용할때 불규칙적인 row의 원인 field를 지정하여 정확도를 높인다.
         * BR 태그등이 사용되는 필드id를 지정한다.
         * @config irregularField
         * @type {string}
         * @default null
         */
        /**
         * @description 불규칙적인 row height을 감안한 스크롤러를 사용할때 불규칙적인 row의 원인 field를 지정하여 정확도를 높인다.
         * BR 태그등이 사용되는 필드id를 지정한다.
         * @property irregularField
         * @type {string}
         * @protected
         */
        irregularField: null,
        /**
         * @description 콤포넌트 내부적으로 소팅을 하는게 아닌 개발자가 이벤트로 직접 DataSet의 sort를 처리할 수 있게 한다.
         * @config customSortable
         * @type {boolean}
         * @default false
         */
        /**
         * @description 콤포넌트 내부적으로 소팅을 하는게 아닌 개발자가 이벤트로 직접 DataSet의 sort를 처리할 수 있게 한다.
         * @property customSortable
         * @private
         * @type {boolean}
         */
        customSortable: false,
        /**
         * focusEl의 y값을 쉘에 맞출것인지 여부
         */
        syncYFocusRow: true,
        /**
         * @description 모바일에서 스크롤 첫번째 행이나 마지막핼일때 출력하는 메시지를 출력할지 여부를 결정한다.
         * @config gridScrollMessage
         * @type {boolean}
         * @default false
         */
        /**
         * @description 모바일에서 스크롤 첫번째 행이나 마지막핼일때 출력하는 메시지를 출력할지 여부를 결정한다.
         * @property gridScrollMessage
         * @private
         * @type {boolean}
         */
        gridScrollMessage: true,
        /**
         * @description DOM ID를 동적으로 생성할때 참조하는 내부 Grid 최상단 Panel ID
         * @property gridId
         * @private
         * @type {String}
         */
        gridId: null,
        /**
         * @description Dom객체 생성 및 초기화하는 메소드
         * @method initComponent
         * @protected
         * @param {Object} oConfig 환경정보 객체
         */
        initComponent: function(oConfig) {
            //Y축 scroll이 없으면 scrollbar width는 필요없다.
            this._useColumnDD = this.useColumnDD;

            //irregularScroll은 성능상의 이유로 기본 false이다.
            this.irregularScroll = this.irregularScroll || !!this.columnModel.isSummary();
            Rui.devGuide(this, 'LBufferGridView_irregularScroll', [ this ]);
            this.createTemplate();
        },
        /**
         * @description 객체의 이벤트 초기화 메소드
         * @method initEvents
         * @protected
         * @return {void}
         */
        initEvents: function() {
            Rui.ui.grid.LBufferGridView.superclass.initEvents.call(this);

            //this._setSyncDataSet('syncDataSet', [this.syncDataSet]);

            // renderBody 처리후 메시지 출력
            this.renderBodyEvent.unOnAll();

            this.renderEvent.on(this.onRender, this);

            // Add the document level click listener
            // blur에 관련해서 초기화 할 필요가 있을 경우 구현 필요
            //Rui.util.LEvent.addListener(document, 'click', this._onDocumentClick, this);
        },
        /**
         * @description 객체를 Config정보를 초기화하는 메소드
         * @method initDefaultConfig
         * @protected
         * @return {void}
         */
        initDefaultConfig: function() {
            Rui.ui.grid.LBufferGridView.superclass.initDefaultConfig.call(this);
            this.cfg.addProperty('syncDataSet', {
                    handler: this._setSyncDataSet,
                    value: this.syncDataSet,
                    validator: Rui.isBoolean
            });
        },
        /**
         * @description columns들에 이벤트를 탑재한다.
         * @method bindColumns
         * @protected
         * @return {void}
         */
        bindColumns: function() {
            // 컬럼 hidden
            this.columnAddListener();

            if(this.useColumnResize !== false)
                this.columnResizer = new Rui.ui.grid.LColumnResizer(this);

            if(this.useColumnDD !== false)
                this.columnDD = new Rui.ui.grid.LColumnDD(this);

            //column에 columnResize event 걸기
            var colCount = this.columnModel.getColumnCount(true);
            if (this.useColumnResize) {
                for (var i = 0; i < colCount; i++) {
                    this.columnModel.getColumnAt(i,true).unOn('columnResize', this.onColumnResize, this);
                    this.columnModel.getColumnAt(i,true).on('columnResize', this.onColumnResize, this, true);
                }
            }
        },
        /**
         * @description panel에서 필요한 정보 가져오기
         * @method setPanel
         * @protected
         * @param {Rui.ui.grid.LGridPanel} gridPanel
         * @return {void}
         */
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
            //필요한 속성 copy
            this.columnModel = this.gridPanel.columnModel;
            this.selectionModel = this.gridPanel.selectionModel;
        },
        /**
         * @description dataset return
         * @method getDataSet
         * @public
         * @return {Rui.data.LDataSet}
         */
        getDataSet: function() {
            return this.dataSet;
        },
        /**
         * @description 구조 rendering
         * @method renderMaster
         * @param {String} headerHtml header rendering한 html
         * @protected
         * @return {void}
         */
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
        /**
         * @description column resize의 경우 multiheader의 경우 다시 그려야만 width가 정상 적용된다.
         * @method renderMultiHeader
         * @param {String} headerHtml header rendering한 html
         * @protected
         * @return {void}
         */
        renderMultiHeader: function(){
            this.headerOffsetEl.html(this.getRenderMultiheader());
        },
        /**
         * @description cell등의 row의 내용 rendering후 결과 문자열 return
         * @protected
         * @method getRenderRowContent
         * @param {int} row 현재행 번호
         * @param {Rui.data.LRecord} record
         * @param {int} contentWidth
         * @param {boolean} firstColumns
         * @return {String}
         */
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
                    //span이 -값이면 그리지 않는다.
                    if(spans && (spans[i].rowspan < 0 || spans[i].colspan < 0)) continue;
                    cells += this.getRenderCell(row, i, colCount, record, spans ? spans[i] : undefined);
                }
            } else {
                for (var i = 0; i < colCount; i++) {
                    //span이 -값이면 그리지 않는다.
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
        /**
         * @description 행이 없을 경우 메시지 출력
         * @method showEmptyDataMessage
         * @protected
         * @return {void}
         */
        showEmptyDataMessage: function(){
            //var borderWidth = Rui.isBorderBox ? 0 : this.borderWidth;
            while (this.bodyEl.dom.childNodes.length > 0 && 0 < this.bodyEl.dom.childNodes[0].childNodes.length)
                Dom.removeNode(this.bodyEl.dom.childNodes[0].childNodes[0]);
            var messageCode = (this.emptyDataMessageCode != null) ? this.emptyDataMessageCode : '$.base.msg115';
            var emptyDataMessage = Rui.getMessageManager().get(messageCode);
            //table은 width 100%로 style설정 되므로 width설정이 필요없다.
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
        /**
         * @description 행이 없을 경우에 출력 되는 메시지 해제
         * @method hideEmptyDataMessage
         * @protected
         * @return {void}
         */
        hideEmptyDataMessage: function() {
            this.bodyEl.select(' > .' + GV.CLASS_GRIDVIEW_BODY_EMPTY).remove();
        },
        /**
         * @description body의 empty 의 width 길이를 재 계산하여 적용한다.
         * @method updateEmptyWidth
         * @protected
         * @return {void}
         */
        updateEmptyWidth: function(contentWidth) {
            //table의 width는 설정할 필요가 없다.  100%이면 된다.
            return Rui.get(this.bodyEl.dom.firstChild).hasClass('.L-grid-body-empty');
        },
        /**
         * @description Row가 존재하는지 여부 리턴
         * @method hasRows
         * @protected
         * @return {Boolean}
         */
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
        /**
         * @description Row의 Dom Array return
         * @method getRows
         * @protected
         * @return {Array}
         */
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
        /**
         * @description 틀고정시 li first의 top값을 일치시킨다.
         * @method syncLiFirst
         * @protected
         * @return {void}
         */
        syncLiFirst: function(scrollTop) {
            if(this.columnModel.freezeIndex > -1) {
                this.getFirstLiEl().setStyle('top', ('-' + scrollTop + 'px'));
            }
        },
        /**
         * @description 행 넓이 설정
         * @method updateTotalWidth
         * @protected
         * @return {void}
         */
        updateTotalWidth: function() {
            var contentWidth = this.columnModel.getTotalWidth(true);
            //var offsetWidth = contentWidth + Rui.ui.LScroller.SCROLLBAR_SIZE;
            //grid-body
            this.bodyEl.setWidth(contentWidth);
            //empty message div도 조정
            var isEmpty = this.updateEmptyWidth(contentWidth);
            if (!isEmpty) {
                //성능을 위해 dom 직접 사용
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
        /**
         * @description 상태를 유지한체 전체를 새롭게 그리기
         * @method redoRender
         * @protected
         * @return {void}
         */
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
            //this.updateSizes(true);
            //doRenderData(); 대신 아래와 같이 처리

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
        /**
         * @description grid의 height 재설정하기
         * @method _setHeight
         * @private
         * @return {void}
         */
        _setHeight: function(type, args, obj){
            if(this._rendered && this.height === args[0]) return;
            Rui.ui.grid.LBufferGridView.superclass._setHeight.call(this,type, args, obj);
            if(this._rendered) {
                this.updateSizes();
                this.redoRenderData({ resetScroll: true, renderCheckFirst: true });
            }
        },
        /**
         * @description grid의 width 재설정하기
         * @method _setWidth
         * @protected
         * @return {void}
         */
        _setWidth: function(type, args, obj){
            if(this._rendered && this.width === args[0]) return;
            Rui.ui.grid.LBufferGridView.superclass._setWidth.call(this,type, args, obj);
            if(this._rendered)
                this.updateSizes();
        },
        /**
         * @description scroll 생성 여부에 따라 header의 width를 변경한다.
         * @method updateHeaderSize
         * @protected
         * @return {void}
         */
        updateHeaderSize: function() {
            if(this.scroller) {
                var cm = this.columnModel;
                var contentWidth = cm.getTotalWidth(true);
                var scrollWidth = this.scroller && this.scroller.existScrollbar(true) ? Rui.ui.LScroller.SCROLLBAR_SIZE : 0;
                this.headerOffsetEl.setWidth(contentWidth + scrollWidth);
            }
        },
        /**
         * @description header의 scroll위치를 변경한다.
         * @method syncHeaderScroll
         * @protected
         * @return {void}
         */
        syncHeaderScroll: function(){
            if(this.scroller) {
                this.headerEl.dom.scrollLeft = this.scroller.getScrollLeft();
                //this.headerEl.dom.scrollLeft = this.scroller.getScrollLeft();
            }
        },
        /**
         * @description 스크롤러를 생성한다. 스크롤은 행수에 따른 고정 넓이를 할당하고 한화면에 보여줄 수 있는 행수를 계산하여 처리
         * @protected
         * @method makeScroll
         * @param {boolean} initScroll
         * @return {void}
         */
        makeScroll: function(initScroll, scrollLeft){
            if(!this.scroller){
                var scrollConfig = Rui.merge({
                    scrollbar: this.columnModel.isAutoWidth() ? 'y' : 'auto',
                        applyTo: this.scrollerEl,
                        content: this.bodyEl,
                        controlScrollbarDrag: this.pagerMode == 'scroll'
                    }, this.scrollerConfig || {});
                //if(!initScroll) scrollConfig.marginLeft = this.marginLeft;
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
        /**
         * @description 스크롤러를 재설정 한다.
         * @protected
         * @method resetScroller
         * @param {boolean} goFirst
         * @return {void}
         */
        resetScroller: function(goFirst){
            if(this.scroller){
                var scrollCount = this.getDataCount(),
                    vrc = this.renderRange ? this.renderRange.visibleRowCount : 0;
                if(scrollCount > 0){
                    if(this.irregularScroll){
                        //scrollCount = scrollCount - this.getVisibleRowCount(true, this.getIrregularRowHeight(false)) + this.growedRowCount;
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
        /**
         * @description 스크롤 범위에 추가될 row를 재 계산한다.
         * visibleRowCount 기준으로 마지막 renderRange를 임의로 만들어 그 기준으로 랜더링 한 후 최종 추가될 row를 계산하여
         * growedRowCount를 지정한다.
         * 이후 랜더링시 growedRowCount가 반영된 renderRange를 기준으로 랜더링 하게 된다.
         * growedRowCount는 scrollHeight에 visibleRowCount만큼의 행이 그려져야 하는데 br 태그등의 이유로 visibleRowCount보다 적게 그려지는데  그 수.
         * @private
         * @method setLastGrowed
         * @return {void}
         */
        setLastGrowed: function(){
            if(!this.renderRange) return;
            if(this.irregularScroll !== true) return;
            this.growedRowCount = this.getLastGrowedCount();
        },
        /**
         * @description 현재 랜더링된 스크롤 범위에 추가될 row를 계산하여 반환한다.
         * 불규칙적인 row height의 데이터들이 존재할 경우 마지막 몇개의 행 정도의 높이가 늘어난다. 이를 계산하여 몇개정도의 행이 늘어난것인지를 이 메소드를 통해 확인할 수 있다.
         * 마지막 페이지를 랜더링 하여 하여 growed count를 계산하므로 랜더링 이후 실행하면 그리드가 튄다. 초기 랜더링 시에만 사용해야한다. 
         * @private
         * @method getLastGrowedCount
         * @return {int}
         */
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
                //visibleRowCount = this.getVisibleRowCount(true, this.getIrregularRowHeight(false));
            
            rows = this._getRenderedLastRows(rowCount, Math.min(Math.max(visibleRowCount, 3), rowCount));
            expactRow = this._getExpectedStartRow(rows);
//            if(expactRow == rows.length-1)
//                return 0;
//            var startRow = this.getVisibleRow(this.findRow(rows[0]));
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
                //growed = rowCount - startRow;
                if(growed >= visibleRowCount)
                    growed = visibleRowCount -1;
            }
            this._temporaryGrowedCount = growed;
            return growed;
        },
        /**
         * @description 현재 랜더링된 스크롤 범위에 추가될 row를 계산하여 반환한다.
         * 불규칙적인 row height의 데이터들이 존재할 경우 마지막 몇개의 행 정도의 높이가 늘어난다. 이를 계산하여 몇개정도의 행이 늘어난것인지를 이 메소드를 통해 확인할 수 있다.
         * @private
         * @method getFirstGrowedCount
         * @return {int}
         */
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
//            growed = visibleRowCount - (visibleLastRow - startRow +1);
            growed = visibleLastRow - startRow +1;
            return growed;
        },
        _getRenderedLastRows: function(rowCount, visibleRowCount){
            if(this.renderRange){
                //소계, BR등을 대비하기 위해 마지막 페이지를 우선 랜더링하여 스크롤 사이즈 계산에 필요한 growedRowCount를 계산한다.
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
        /**
         * @description rendering
         * @method doRender
         * @protected
         * @return {void}
         */
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

            //data를 rendering하기 전에 sizing을 해야지만 window scroll등이 발생하지 않음.
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
        /**
         * @description body content rendering
         * @protected
         * @method doRenderData
         * @param {Object} e Event Object
         * @return {void}
         */
        doRenderData: function(e){
            //rendering관련 global 변수 초기화
            if(!e || e.cached !== true) {
                this.renderRange = null;
                this.growedRowCount = 0;
                this._redoRenderDataOptions = {};
                this._temporaryGrowedCount = null;

                //행높이를 알기 위해서 두번 그린다.
                this.renderBody(this.getRenderBody(true), {ignoreEvent : true});
                this.getRenderRange();
                this.setLastGrowed();
                // 콤보와 같은 Editor가 load중이면 redoRenderData로 처리한다.
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
       /**
         * @description create,delete에 따라서 전체행 다시 그리기.
         * @protected
         * @method redoRenderData
         * @param {Object} options options 정보
         * @return {void}
         */
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
                                    return; //Rui.later로 반복수행중이므로 다음 interval에서 재시도
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
                    return; //Rui.later로 반복수행중이므로 다음 interval에서 재시도
                }
                if(this.delayRRD)
                    this.delayRRD.cancel();
                this.delayRRD = null;

                if((this.irregularScroll && opt.isDataChanged) || opt.renderCheckFirst === true || (this.getDataCount() > 0 && this.getRows().length < 1)){
                    if(opt.resetScroll === true){
                        this.growedRowCount = 0;
                        this._temporaryGrowedCount = null;
                    }
                    //doRenderData 시점에 데이터가 없어서 행높이계산용 row를 그리지 않은상황.
                    //행높이를 알기 위해서 먼저 한번 그린다.
                    this.renderBody('', {ignoreEvent : true});
                    this.renderBody(this.getRenderBody(true), {ignoreEvent : true});
                    this.getRenderRange();
                    if(this.renderRange)
                        this.setLastGrowed();
//                    if(opt.resetScroll === true)
//                        this.resetScroller();

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
                
                // RTL 기능 적용시 스크롤이 맨 좌측인 경우 스크롤 sync가 맞지 않아 조건절 변경처리
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
        /**
         * @description dataset의 변경에 따른 body content rendering
         * @method setSyncDataSet
         * @param {boolean} isSync
         * @protected
         * @return {void}
         */
        setSyncDataSet: function(isSync) {
            this.cfg.setProperty('syncDataSet', isSync);
            if(isSync) this.doRenderData();
        },
        /**
         * @description dataset의 변경에 따른 body content rendering되었는지 여부
         * @method isSyncDataSet
         * @protected
         * @return {boolean}
         */
        isSyncDataSet: function() {
            return this.syncDataSet;
        },
        /**
         * @description grid의 최소 column width return
         * @method getMinColumnWidth
         * @param {int} idx column index
         * @protected
         * @return {int}
         */
        getMinColumnWidth: function(idx){
            if(idx) {
                return this.cm.getColumnAt(idx, true).getMinWidth() || this.minColumnWidth;
            } else {
                return this.minColumnWidth;
            }
        },
        /**
         * @description override getRenderBody
         * @protected
         * @method getRenderBody
         * @param {boolean} checkRowHeight [optional] row의 height 검사용으로 일부만 랜더링 할지 여부
         * @param {boolean} redoRender [optional] 이미 생성된 renderRange를 사용하여 랜더링할지 여부
         * @param {Object} renderRange [optional] 랜더링 할 때 사용할 renderRange
         * @return {String}
         */
        getRenderBody: function(checkRowHeight, redoRender, renderRange) {
            //행높이를 알기 위해서 두번 그린다.
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
                //행높이 측정용
                delete this.cellMergeInfoSet;
                var record;
                var irregularFieldIndex = this.columnModel.getIndexById(this.irregularField);
                if(this.irregularScroll && irregularFieldIndex > -1){
                    //irregularField를 지정받아 지정된 필드의 전체 행을 랜더링할 경우
                    var count = Math.min(rowCount, 2000);
                    for (var i = 0; i < rowCount; i++){
                        record = this.getRowRecord(i);
                        rows2 += this.getRenderRow(i, record, rowCount, false, false, irregularFieldIndex);
                    }
                }else{
                    //행 높이 계산을 위해 1~2개의 행을 전체 필드로 랜더링 할 경우
                    record = this.getRowRecord(0);
                    if(record)
                        rows2 = this.getRenderRow(0, record, rowCount, false, false);
                    //그리드 body table에 border-collapse: collapse; CSS를 사용할 경우 1번째 row의 offsetHeight은 믿을수 없는 값이나오므로 2번째 row를 생성하여 행높이를 측정한다. - 문혁찬
                    record = this.getRowRecord(1);
                    if(record)
                        rows2 += this.getRenderRow(1, record, rowCount, false, false);
                }
                record = null;
            }else{
                //정상 랜더링용
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
                            //TODO : merged cell 또한 선택된 row와 동일하게 칠하려 할 경우의 코드 향후 정리할것.
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
        /**
         * @description body content rendering
         * @method renderBody
         * @param {String} bodyHtml body rendering한 html
         * @param {Object} option [optional] 환경정보 객체
         * @protected
         * @return {void}
         */
        renderBody: function(bodyHtml,option) {
            //행높이를 알기 위해서 두번 그린다.  이때 event를 발생시키지 않기 위해서 option을 둔다.
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
        /**
         * @description 세로 스크롤을 제공된 row 기준으로 이동한다.
         * @method moveYScroll
         * @protected
         * @param {int} row row index
         */
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
                //#1.그리드에 보이는 영역보다 위쪽의 row가 선택된 경우
                if (visibleRow === 0)
                    scroller.goStart();
                else
                    scroller.go(visibleRow);
            } else if (visibleEnd < visibleRow) {
                //#2.그리드에 보이는 영역보다 아래쪽의 row가 선택된 경우 (그리드의 하단에 걸친 경우도 여기에 포함)
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
                //#3.그리드 보이는 영역의 row가 선택된 경우
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
        /**
         * @description 화면에 그려질 마지막 row index를 제공하여 동시에 그려질 첫번째 row의 index를 구한다.
         * 소계를 사용할 경우 선택된 row가 그리드의 적절한 위치에 focus되어야 하는데 이 함수를 통해 정확하게 계산할 수 있다.
         * 소계를 사용하지 않고 &lt;br&gt;등을 사용하여 row의 height이 불규칙적인 경우는 이 함수로 계산할 수 없다.
         * 데이터 row와 소계 row의 height은 동일해야 정확한 계산이 가능하다.
         * @method getVisibleStartRowForSubSumOf
         * @private
         * @param {int} endRow 선택된 row
         * @return {int} startRow
         */
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
        /**
         * @description 가로 스크롤을 제공된 cell 기준으로 이동한다.
         * @method moveXScroll
         * @protected
         * @param {Object} cellDom 이동될 셀의 DOM
         * @param {int} col column index
         * @return {object} .x .y
         */
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
        /**
         * @description scroll 관련, 신규 또는 변경된 행으로 scroll 이동하기 위한 좌표 return
         * @method getCellXY
         * @protected
         * @param {Object} cellDom 이동될 셀의 DOM
         * @return {object} .x .y
         */
        getCellXY: function(cellDom){
            var xy = !Rui.isEmpty(cellDom) ? Rui.get(cellDom).getXY() : this.scrollerEl.getXY();
            cellDom = null;
            return {x: xy[0], y: xy[1]};
        },
        /**
         * @description override getScrollerEl => Editor에 의해 마지막 가린줄 클릭할 경우 scroller.el이 scroll되는것을 방지.
         * @method getScrollerEl
         * @protected
         * @return {Rui.LElement}
         */
        getScrollerEl: function() {
            return this.scroller ? this.scroller.scrollEl : this.scrollerEl;
        },
        /**
         * @description scroller 객체를 리턴한다.
         * @method getScroller
         * @return {Rui.ui.LScroller}
         */
        getScroller: function() {
            return this.scroller;
        },
        /**
         * @description override getRow
         * @method getRowDom
         * @protected
         * @param {int} row dataSet 기준 실제 row index
         * @return {HTMLElement}
         */
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
        /**
         * @description 실제 dom으로 출력된 행인지 점검하고 출력된 행이면 실제 dom상의 index return
         * @method getRenderedRow
         * @protected
         * @param {int} row row index
         * @return {int}
         */
        getRenderedRow: function(row){
            if(!this.renderRange) return null;
            row = row - this.renderRange.start;
            if(row < 0) return null;
            return row;
        },
        /**
         * @description loading시 message 출력
         * @method showLoadingMessage
         * @protected
         * @return {void}
         */
        showLoadingMessage: function(){
            this.el.mask();
        },
        /**
         * @description dataSet의 changed 이벤트 발생시 호출되는 메소드
         * @method hideLoadingMessage
         * @protected
         * @return {void}
         */
        hideLoadingMessage: function() {
            this.el.unmask();
        },
        /**
         * @description 행이 없을 경우에 출력 되는 메시지 처리
         * @method doEmptyDataMessage
         * @protected
         * @return {void}
         */
        doEmptyDataMessage: function() {
            if(this.getDataCount() == 0) {
                if(this.dataSet.isLoad === true) this.showEmptyDataMessage();
            } else {
                this.hideEmptyDataMessage();
            }
        },
        /**
         * @description 불규칙적인 행의 높이 반환. irregularScroll 사용시의 행높이 반환.
         * @protected
         * @method getIrregularRowHeight
         * @param {boolean} max [optional] 불규칙 row의 max height을 반환할지 여부, false인 경우 min값 반환
         * @return {int}
         */
        getIrregularRowHeight: function(max){
            if(this.irregularScroll === true)
                return max ? this.maxRowHeight : this.minRowHeight || this.getRowHeight();
            return this.getRowHeight();
        },
        /**
         * @description 규칙적인 행의 높이 반환 (보통 행 랜더링시 사용함)
         * @protected
         * @method getRowHeight
         * @return {int}
         */
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
        /**
         * @description row에 대한 현재 보이는 실제 row값을 리턴한다.
         * @protected
         * @method getVisibleRow
         * @return {int}
         */
        getVisibleRow: function(row) {
            return row;
        },
        /**
         * @description 보이는 영역에 그려져야할 행의 수를 계산하여 반환
         * @protected
         * @method getVisibleRowCount
         * @param {boolean} excludeOver [optional] 보이는 영역 끝에 걸친 row는 제외하고 계산함.
         * @param {int} rowHeight [optional] 계산할 때 사용할 행의 높이
         * @return {int}
         */
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
        /**
         * @description rendering해야할 행 시작 index, 종료 index 계산후 return
         * @protected
         * @method getRenderRange
         * @return {object} start, end
         */
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
                    //irregularScroll 상태에서 아래 visibleRowCount와 renderRowCount가 동일할 경우 마지막 한건 스크롤 문제 발생
                    //visibleRowCount = renderRowCount;    //맨 마지막 row까지 그려져야 므로 visibleRowCount를 renderRowCount랑 맞춰준다.
                }

                var visibleEnd = endIndex;
                if(realRowCount > visibleRowCount)
                    visibleEnd = endIndex + (visibleRowCount !== renderRowCount ? -1 : 0);
                //if(Rui.browser.msie6789 && visibleRowCount > 0) {
                	// 소개와 합계가 들어갈 경우 마지막행에 너무 큰 공백이 생길 수 있으므로 마지막 라인에 맞추게 하는 기능, 단 마지막 하단이 row의 3건보다 큰 경우에만 처리
                    if((rowCount - startIndex) < (visibleRowCount - 3)) {
                    	endIndex = rowCount - 1;
                    	if(endIndex < 0) endIndex = 0;
                    	visibleEnd = endIndex;
                    	//startIndex = endIndex - visibleRowCount + 1;
                    	//if(startIndex < 0) startIndex = 0;
                    }
                //}
                
                renderRange = {
                    start: startIndex,
                    end: endIndex,
                    visibleStart: startIndex,
                    visibleEnd: visibleEnd,
                    rowCount: rowCount,
                    visibleRowCount: visibleRowCount,//visibleEnd - startIndex + 1,
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
        /**
         * @description 지정한 cell return
         * @method getCellDom
         * @protected
         * @param {int} row row index
         * @param {int} col column index
         * @return {HTMLElement}
         */
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
                        //merged cell
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
        /**
         * @description 지정한 row의 cell return
         * @method getRowCellDom
         * @protected
         * @param {HTMLElement} rowDom row element
         * @param {int} row column index
         * @param {int} col column index
         * @return {HTMLElement}
         */
        getRowCellDom: function(rowDom, row, col) {
            var freezeIndex = this.columnModel.freezeIndex;
            //if(freezeIndex > -1){
            	var mergedColCount = 0;
                if(this.cellMergeInfoSet && this.getColumnModel().isMerged()){
                    var renderedRow = this.getRenderedRow(row);
                    if(renderedRow != null){
                        var mergeColInfos = this.cellMergeInfoSet[renderedRow];
                        if(mergeColInfos){
                            var len = Math.min(col, mergeColInfos.length);
                            //var len = (freezeIndex > -1) ? Math.min(mergeColInfos.length, freezeIndex+1) : mergeColInfos.length;
                            for (var c = 0; c < len; c++){
                                mergeColInfo = mergeColInfos[c];
                                if(mergeColInfo.colspan < 0 || mergeColInfo.rowspan < 0){
                                	if(freezeIndex > -1 && c <= freezeIndex) continue;
                                    //merged cell
                                    mergedColCount++;
                                }
                                mergeColInfo = null;
                            }
                            //freezeIndex = freezeIndex - mergedColCount;
                        }
                        mergeColInfos = null;
                    }
                }
                if(this.columnModel.freezeIndex > -1 && col > this.columnModel.freezeIndex)
                    col = col - (freezeIndex + 1) - mergedColCount;
                else
                    col = col - mergedColCount;
            //}
            try {
                return rowDom.cells[col];
            } finally {
                rowDom = null;
            }
        },
        /**
         * @description cell dom에서 cell index return
         * @method getCell
         * @protected
         * @param {HTMLElement} dom cell dom
         * @param {int} x pageX
         * @return {int}
         */
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
        /**
         * @description 지정한 column index의 header cell return
         * @method getHeaderCellEl
         * @protected
         * @param {int} colIndex column index
         * @return {Rui.LElement}
         */
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
        /**
         * @description header LElement return
         * @method getHeaderEl
         * @protected
         * @return {Rui.LElement}
         */
        getHeaderEl: function() {
            return this.headerEl;
        },
        /**
         * @description dom에서 cell index return
         * @method findHeaderCell
         * @protected
         * @param {HTMLElement} dom dom
         * @param {int} x pageX
         * @return {int}
         */
        findHeaderCell: function(dom, x) {
            return this.findCell(dom, x, GV.CLASS_GRIDVIEW_HEADER_CELL);
        },
        /**
         * @description 제공된 dom을 가지는 row를 찾아 그 index를 반환한다.
         * @method findRow
         * @public
         * @param {HTMLElement} dom dom
         * @param {int} y pageY
         * @param {boolean} isMerge merge값 적용 여부에 대한 row 여부 (default true)
         * @return {int}
         */
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
        /**
         * @description dom에서 cell index return
         * @method findCell
         * @protected
         * @param {HTMLElement} dom dom
         * @param {int} x pageX
         * @param {string} requiredCls css class name
         * @return {int}
         */
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
        /**
         * @description dom에서 row return
         * @method findRowDom
         * @protected
         * @param {HTMLElement} dom dompublic
         * @param {int} y pageY
         * @return {HTMLElement}
         */
        findRowDom: function(dom, y, isMerge) {
            isMerge = Rui.isUndefined(isMerge) ? true : isMerge;
            var rDom = Dom.findParent(dom, this.rowSelector, 10),
                cDom, cy, gap, h, _dom, i;
            try {
                //rowspan이 있으면 계산 필요
                if(rDom && this.columnModel.isMerged() && isMerge){
                    cDom = this.findCellDom(dom);
                    if(cDom && cDom.rowSpan > 1){
                        //행높이는 같다고 가정.
                        h = Rui.get(rDom).getHeight();
                        if(Rui.browser.msie){
                            //IE에선 병합될 cell을 포함한 row의 height이 다른 브라우저와 다르게 colspan이 적용된 전체 크기가 나옴.
                            _dom = rDom.getElementsByTagName('td')[rDom.cells.length -1];
                            h = Rui.get(_dom).getHeight();
                        }
                        //Infinity 방지
                        if(h == 0) return rDom;
                        //좌표 계산 해야한다.  cell의 y구하고, event발생한 지점의 y와 비교해서 몇번재행을 클릭했는지 찾아낸다.
                        cy = Dom.getXY(cDom)[1];
                        gap = y - cy;
                        //gap이 몇번째 행인지 알아 낸다.
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
        /**
         * @description dom에서 cell return
         * @method findCellDom
         * @protected
         * @param {HTMLElement} dom dom
         * @return {HTMLElement}
         */
        findCellDom: function(dom){
            return Dom.findParent(dom, this.cellSelector, this.cellSelectorDepth);
        },
        /**
         * @description dom에서 header cell return
         * @method findHeaderCellDom
         * @protected
         * @param {HTMLElement} dom dom
         * @return {HTMLElement}
         */
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
        /**
         * @description sorting하기
         * @method doSortField
         * @protected
         * @param {int} colIndex column index
         * @return {void}
         */
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
                    //sort field와 direction 정보 저장하기
                    this.sortField = field;
                    this.sortDir = dir;
                    // sortField 이벤트를 LDataSet으로 옮겨야 하나 우선 진행
                    this.fireEvent('sortField', {target:this, sortId: column.id, sortField:this.sortField, sortDir:this.sortDir, sortDirection: ds.sortDirection });
                }
                hdCellEl = null;
            }
            column = ds = field = null;
        },
        /**
         * @description 마지막 sort 정보
         * @method getLastSortInfo
         * @public
         * @return {Object} object.field object.dir
         */
        getLastSortInfo: function(){
            return {field : this.sortField, dir : this.sortDir};
        },
        /**
         * @description  그리드 header에 sort정보들 삭제
         * @method clearFieldSortClass
         * @public
         * @return {void}
         */
        clearFieldSortClass: function() {
            this.headerEl.select('.' + GV.CLASS_GRIDVIEW_SORT_ASC + ',.' + GV.CLASS_GRIDVIEW_SORT_DESC).removeClass([GV.CLASS_GRIDVIEW_SORT_ASC, GV.CLASS_GRIDVIEW_SORT_DESC]);
        },
        /**
         * @description dom에서 field name return
         * @method findFieldName
         * @protected
         * @param {HTMLElement} dom dom
         * @return {string}
         */
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
        /**
         * @description row에 css class 할당
         * @method addRowClass
         * @protected
         * @param {int} row row index
         * @param {string} className row css class name
         * @return {void}
         */
        addRowClass: function(row, className) {
            var rowDom = this.getRowDom(row, 1);
            if(rowDom) Dom.addClass(rowDom, className);
            if(this.columnModel.freezeIndex > -1) {
                rowDom = this.getRowDom(row, 0);
                if(rowDom) Dom.addClass(rowDom, className);
            }
            rowDom = null;
        },
        /**
         * @description row에 css class 제거
         * @method removeRowClass
         * @protected
         * @param {int} row row index
         * @param {string} className row css class name
         * @return {void}
         */
        removeRowClass: function(row, className) {
            var rowDom = this.getRowDom(row, 1);
            if(rowDom) Dom.removeClass(rowDom, className);
            if(this.columnModel.freezeIndex > -1) {
                rowDom = this.getRowDom(row, 0);
                if(rowDom) Dom.removeClass(rowDom, className);
            }
            rowDom = null;
        },
        /**
         * @description cell에 css class 할당
         * @method addCellClass
         * @protected
         * @param {int} row row index
         * @param {int} cell cell index
         * @param {string} className cell css class name
         * @return {void}
         */
        addCellClass: function(row, cell, className) {
            var cellDom = this.getCellDom(row, cell);
            if (cellDom) Dom.addClass(cellDom, className);
            cellDom = null;
        },
        /**
         * @description cell에 css class 삭제
         * @method removeCellClass
         * @protected
         * @param {int} row row index
         * @param {int} cell cell index
         * @param {string} className cell css class name
         * @return {void}
         */
        removeCellClass: function(row, cell, className) {
            var cellDom = this.getCellDom(row, cell);
            if (cellDom) Dom.removeClass(cellDom, className);
            cellDom = null;
        },
        /**
         * @description cell에 할당된 Alt값을 리턴한다.
         * @method getCellAlt
         * @public
         * @param {int} row row index
         * @param {int} cell cell index
         * @return {String}
         */
        getCellAlt: function(row, cell) {
            var cellDom = this.getCellDom(row, cell);
            try {
                if (cellDom != null) return cellDom.title;
                else return null;
            } finally {
                cellDom = null;
            }
        },
        /**
         * @description cell에 Alt값을 할당
         * @method addCellAlt
         * @public
         * @param {int} row row index
         * @param {int} cell cell index
         * @param {string} title cell Alt
         * @return {void}
         */
        addCellAlt: function(row, cell, title) {
            var cellDom = this.getCellDom(row, cell);
            if (cellDom) cellDom.title = title;
            cellDom = null;
        },
        /**
         * @description cell에 Alt값을 삭제
         * @method removeCellAlt
         * @public
         * @param {int} row row index
         * @param {int} cell cell index
         * @return {void}
         */
        removeCellAlt: function(row, cell) {
            var cellDom = this.getCellDom(row, cell);
            if (cellDom != null) cellDom.title = '';
            cellDom = null;
        },
        /**
         * @description row 와 col의 위치값의 html 내용을 바꾼다.
         * @method setValue
         * @protected
         * @param {int} row row index
         * @param {int} col col index
         * @param {String} html 변경할 html 값
         * @return {void}
         */
        setValue: function(row, col, html) {
            var currentCellDom = this.getCellDom(row, col);
            if(currentCellDom) {
                // 생성방법 개선 필요
                var divDom = document.createElement('div');
                divDom.innerHTML = '<table><tr>' + html + '</tr></table>';
                var tdDom = divDom.getElementsByTagName('td')[0];
                currentCellDom.parentNode.replaceChild(tdDom, currentCellDom);
                tdDom = divDom = null;
            }
            currentCellDom = null;
        },
        /**
         * @description row 와 col의 위치값의 html 내용을 리턴한다.
         * @method getValue
         * @protected
         * @param {int} row row index
         * @param {int} col col index
         * @return {String}
         */
        getValue: function(row, col) {
            var currentCellDom = this.getCellDom(row, col);
            try {
                return currentCellDom ? currentCellDom.innerHTML : null;
            } finally {
                currentCellDom = null;
            }
        },
        /**
         * @description row 위치값의 html 내용을 바꾼다.
         * @method setRowValue
         * @protected
         * @param {int} row row index
         * @param {String} html 변경할 html 값
         * @return {void}
         */
        setRowValue: function(row, html) {
            var currentRowDom = this.getRowDom(row);
            if(currentRowDom) {
                // row 전체를 갱신하면 성능 저하 및 값 변경시 해당 객체가 사라지므로 다른 이벤트들도 다 제거되어 처리가 안됨.
                var newRowDom = document.createElement('div');
                newRowDom.innerHTML = html;
                currentRowDom.innerHTML = newRowDom.firstChild.innerHTML;
                newRowDom = null;
                currentRowDom = null;
            }
        },
        /**
         * @description grid body LElement return
         * @method getBodyEl
         * @protected
         * @return {Rui.LElement}
         */
        getBodyEl: function() {
            return this.bodyEl;
        },
        /**
         * @description grid column model return
         * @method getColumnModel
         * @public
         * @return {Rui.ui.grid.LColumnModel}
         */
        getColumnModel: function() {
            return this.columnModel;
        },
        /**
         * @description grid border width return
         * @method getBorderWidth
         * @public
         * @return {int}
         */
        getBorderWidth: function() {
            return this.borderWidth;
        },
        /**
         * @description row에 focus주기
         * @method focusRow
         * @protected
         * @param {int} row row index
         * @param {int} col column index
         * @return {void}
         */
        focusRow: function(row, col) {
            if(this.scroller && (this.isFocus !== true || this.gridPanel.isEdit === true)) return;
            //Rui.log(row + '|' + col);
            //방향키 사용시 IE의 경우 event의한 scroll을 한 후에 방향키에 의한 IE자체 메커니즘에 의해 스크롤바가 이동됨.  따라서 좌표가 맞지 않을 수 있음
            //IE자체 메커니즘에 의한 스크롤바 이동후 event에 의한 scroll bar이동을 설정하기 위해 0.001초 늦게 작동을 시킴.
            //이동후 focus를 줘야함.
            this.syncFocusRow(row, col);
            if (!this.delayTask) {
                this.delayTask = new Rui.util.LDelayedTask(function(){
                    //if(!Rui.browser.msie)//ie에서 이상없음.  해제함.  문제있음 연락바람 - 채민철K
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
                                    //Rui.log('this.focusEl : focus');
                                }
                            }
                        }
                    this.delayTask = null;
                }, this);
                this.delayTask.delay(50);
            }
        },
        /**
         * @description focus delayTask를 취소한다.
         * @method cancelViewFocus
         * @protected
         * @return {void}
         */
        cancelViewFocus: function() {
            if(this.delayTask) {
                this.delayTask.cancel();
                this.delayTask = null;
            }
        },
        /**
         * @description 그리드를 모두 다시 그린다.
         * @method updateView
         * @protected
         * @return {void}
         */
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
        /**
         * @description grid의 내부의 width, height 설정
         * 그리드 및 상위가 display:none 으로 인해 안보이는 상태에서는 height할당되어있어도 getHeight는 0이다.
         * @method updateSizes
         * @protected
         * @param {boolean} resize resize인지 여부
         * @return {void}
         */
        updateSizes: function(resize){
            var width = this.width;
            if (/*resize ||*/ width) {
                if(Rui.browser.msie67) {
                    this.headerEl.setStyle('width', width + 'px');
                    this.scrollerEl.setStyle('width', width + 'px');
                }
                /*
                LUIComponent의 _setDisabled 메소드 setRegion 메소드 제거로 css로 처리
                if(this.disabled)
                    this.el.select('> .L-disable-mask').setWidth(width);*/
            }
            var scrollerHeight = 0;
            if (resize || (this.height && this.scrollerEl && this.scrollerEl.getHeight() + this.headerEl.getHeight() !== this.height)) {
//              if(Rui.browser.chrome) this.headerEl.setStyle('display', 'inline-block');
//              var headerHeight = this.headerEl.getHeight();
//              if(headerHeight > 0) {
                scrollerHeight = this.height - this.headerEl.getHeight();
                //header height에 border height가 빠져있으면 scrollerHeight에 +1해줘야함.=> borderBox문제, 해결않되었음.
                if(scrollerHeight > 0) {
                    this.scrollerEl.setHeight(scrollerHeight);
                    if(this.scroller) this.scroller.setHeight(scrollerHeight);
                }
                /*
                LUIComponent의 _setDisabled 메소드 setRegion 메소드 제거로 css로 처리
                if(this.disabled) {
                    this.el.select('> .L-disable-mask').setHeight(height);
                }
                */
//                }
            }
            if(this.el && this.el.getHeight() < 1)
                this.el.setStyle('height', '');
//            if(this.scrollerEl.getHeight() < 1){
//                try{
//                    //chrome에서 body의 height이 안보이는 문제 해결을 위한 방어코딩.
//                    //this.bodyEl.setHeight(this.gridPanel.height - this.headerEl.getHeight() - (this.borderWidth * 2));
//                    //Rui.later(300, this, this.updateSizes);
//                }catch(e){
//                }
//            } else {
            if(this.plugins) {
                for (var i = 0, len = this.plugins.length; i < len; i++) {
                    this.plugins[i].updatePlugin({ isRendered: true });
                }
            }
//            }
            if(this.scroller && (scrollerHeight > 0 && this.scroller.getScrollHeight() < 1)) {
                this.scroller.refresh();
                this.redoRenderData({ resetScroll: true });
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
        /**
         * @description 객체를 focus한다.
         * @method focus
         * @public
         * @return {void}
         */
        focus: function() {
            this.onCheckFocus();
            if(!Rui.platform.isMobile) this.focusEl.focus();
        },
        /**
         * @description 객체를 blur한다.
         * @method blur
         * @public
         * @return {void}
         */
        blur: function() {
            Rui.getBody().focus();
        },
        /**
         * @description Body ul의 첫번째 li 객체를 리턴한다.
         * @method getLi
         * @protected
         * @return {int}
         */
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
        /**
         * @description Body ul의 첫번째 li 객체를 리턴한다.
         * @method getFirstLiEl
         * @protected
         * @param {boolean} isHeader
         * @return {LElement}
         */
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
        /**
         * @description Body ul의 마지막 li 객체를 리턴한다.
         * @method getLastLiEl
         * @protected
         * @param {boolean} isHeader
         * @return {LElement}
         */
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
        /**
         * @description 현재 그리드에서 row에 대한 레코드 객체를 리턴한다.
         * @protected
         * @method getRowRecord
         * @param {int} row
         * @return {Rui.data.LRecord}
         */
        getRowRecord: function(row) {
            return this.dataSet.getAt(row);
        },
        /**
         * @description 현재 그리드에서 데이터에 대한 총 건수를 리턴한다.
         * @protected
         * @method getDataCount
         * @return {int}
         */
        getDataCount: function() {
            return (this.pagerMode === 'scroll') ? this.dataSet.getTotalCount() : this.dataSet.getCount();
        },
        /**
         * @description Header cell element list
         * @method getHeaderCellEls
         * @protected
         * @return {Rui.LElementList}
         */
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
        /**
        * @description column의 width를 보이는 가장 긴 데이터를 기준으로 width를 변경한다.
        * @method updateColumnFit
        * @param {int} colIdx column idex
        * @return {void}
        */
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
        /**
        * @description column의 width를 그리드의 width 맞게 변경한다.
        * @method updateColumnsAutoWidth
        * @param {int} maxWidth [optional] 늘리고자 하는 최대값
        * @return {void}
        */
        updateColumnsAutoWidth: function(maxWidth) {
            maxWidth = maxWidth || this.gridPanel.width - Rui.ui.LScroller.SCROLLBAR_SIZE;
            this.columnModel.updateColumnsAutoWidth(maxWidth);
            this.redoRender();
        },
        /**
        * @description editable 속성에 따라 dom의 css를 변경한다.
        * @method updateEditable
        * @private
        * @param {boolean} editable editable 여부
        * @return {void}
        */
        updateEditable: function(editable) {
            if(this.gridPanel) editable ? this.el.addClass("L-editable") : this.el.removeClass("L-editable");
        },
        /**
         * DOM에서 패널 엘리먼트를 제거하고 모든 자식 엘리먼트들을 null로 설정한다.
         * @method destroy
         */
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
        /**
         * @description 객체의 toString
         * @method toString
         * @public
         * @return {String}
         */
        toString: function() {
            return 'Rui.ui.grid.LBufferGridView ' + this.id;
        }
    });
})();

(function() {
//    var Dom = Rui.util.LDom;
//    var Ev = Rui.util.LEvent;
    var GV = Rui.ui.grid.LBufferGridView;
    var DBW = Rui.browser;
    Rui.applyObject(Rui.ui.grid.LBufferGridView.prototype, {
        
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
                //{css}는 config를 통해 개발자가 th에 대한 css class name을 지정하는 용도로 사용된다.
                //{style}도 마찬가지로 custom한 style을 지정하는 용도이다.  내부 + custom
                ts.hcell = new Rui.LTemplate(
                '<td id=\"{hcId}\" class="L-grid-header-cell L-grid-cell L-grid-cell-{id} {first_last} {hidden} {sortable} {css}" style="{style}" colspan="{colSpan}" rowSpan="{rowSpan}">',
                    '<div id=\"{hcInId}\" class="L-grid-header-inner L-grid-header-{id}" style="{istyle}">',
                        '<a id=\"{hcBtnId}\" class="L-grid-header-btn" >{value}</a><img id=\"{hcSrtId}\" src="' + Rui.getRootPath() + Rui.BLANK_IMAGE_URL + '" class="L-grid-sort-icon"/>',
                    '</div>',
                '</td>'
                );
            }
            
            if (!ts.hcellLabel) {
                //multi header에서 label용도로만 사용되는 cell
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
        /**
         * @description column의 width를 계산하여 리턴하는 메소드
         * @method adjustColumnWidth
         * @protected
         * @param {int} width
         * @return {int}
         */
        adjustColumnWidth: function(width){
            //width는 계산을 쉽게 하기 위해 border를 포함한 값이다.
            var borderWidth = this._getBorderWidth();
            return width + borderWidth > 0 ? width + borderWidth : 0;
        },
        _getBorderWidth: function(){
            //Rui.isBorderBox가 true이면 border를 포함한 것이 width이다.
            /*
             * style width 적용시
             * safari, chrome은 표준/비표준 관계없이 border를 포함한다.
             *
             * */
            //IE9 -> 8로 마이그레이션 했을때 chrome true떨어지는 버그 ㅋ;
//            var isChrome = DBW.chrome; //DBW.msie678 ? false : DBW.chrome;
            return Rui.isBorderBox ? 0 : -this.borderWidth; 
        },
        /**
         * @description column의 width를 계산하여 리턴하는 메소드
         * @method getColumnWidth
         * @private
         * @param {Rui.ui.grid.LColumn} column column객체
         * @return {int}
         */
        getColumnWidth: function(column){
            return this.adjustColumnWidth(column.width);
        },
        /**
         * @description header html을 생성하여 리턴하는 메소드
         * @method getRenderHeader
         * @protected
         * @param {String} columnId hidden여부의 column id
         * @param {boolean} hidden hidden 여부
         * @return {String}
         */
        getRenderHeader: function(columnId,hidden) {
            this.initColumn();
            return !this.columnModel.isMultiheader() ? this.getRenderBasicHeader() : this.getRenderMultiheader();
        },
        /**
         * @description header html을 생성하여 리턴하는 메소드
         * @method getRenderBasicHeader
         * @protected
         * @return {String}
         */
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
            //multi header의 경우 필요, 현재는 한줄밖에 없으므로 아래와 같이 처리
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
        /**
         * @description header cell의 html을 생성하여 리턴하는 메소드
         * @method getRenderCellBasicHeader
         * @protected
         * @return {String}
         */
        getRenderCellBasicHeader: function(column, i, columnCount) {
            var ts = this.templates || {};
            var first_last = (i == 0) ? 'L-grid-cell-first' : (i == columnCount - 1) ? 'L-grid-cell-last' : '';
            var colWidth = this.adjustColumnWidth(column.width);//(column.width - 1)
            var style = 'width:' + colWidth + 'px;' + '';//(DBW.msie678 ? 'display: inline-block' :'');
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
        /**
         * @description multiheader html을 생성하여 리턴하는 메소드
         * @method getRenderMultiheader
         * @protected
         * @return {String}
         */
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
        /**
         * @description multiheader html을 생성하여 리턴하는 메소드, 틀고정에 따라 
         * @method getMultiheaderHtml
         * @protected
         * @return {String}
         */
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
                //hidden은 null이다.
                if (colInfos[i]) {
                    findDataCol = false;
                    for (var j = rowCount-1; j > -1; j--) {
                        colInfo = colInfos[i][j];
                        //밑에서 첫번째는 dataColumn이다.
                        if (colInfo.exist) {
                            first_last = (i == 0) ? 'L-grid-cell-first' : (i == colCount - 1) ? 'L-grid-cell-last' : '';
                            if (!findDataCol) {
                                findDataCol = true;
                                var column = cm.getColumnById(colInfo.id);
                                if(!column)
                                    column = basicCm.getColumnById(colInfo.id);
                                width = this.adjustColumnWidth(column.width);
                                //if(Rui.browser.msie67) style += 'display:inline;zoom:1;';
                                style = 'width:'+(column.width - this.borderWidth)+'px;';
                                if (column.cellStyle)
                                    style += column.cellStyle + ';';
                                sortable = column.isSortable() ? 'L-grid-cell-sortable' : '';
                                var sortDir = '';
                                if(column.field && sortDirection) 
                                	sortDir = sortDirection[column.field];
                                if (sortDir) sortable += ' L-grid-sort-' + sortDir;
                                //chrome은 table-layout:fixed가 아니므로 td내부에 있는 div에 width를 모두 적용해야 한다.
                                var istyle = '';
                                var css = [].concat(column.headerCss);
                                css.push('L-grid-header-cell-type-data');
                                if(colInfo.rowspan > 1){
                                    css.push(' L-grid-cell-rowspan-' + colInfo.rowspan);
                                }
                                //istyle += Rui.browser.msie67 ? 'display:inline;zoom:1;overflow: hidden;' : (Rui.browser.msie8 ? 'overflow: hidden;': '');
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
                                //innerWidth가 0이면 chrome에서 multiHeader가 망가진다. updateColumnWidth도 마찬가지.
                                //colSpan한 cell의 width를 조정해도 chrome에서 의미가 없다.
                                //inner width는 multi header의 컬럼 width조정시만 필요.
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
                                    istyle: 'overflow: hidden;' //width:' + innerWidth + 'px'
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
        /**
         * @description column들을 초기화하는 메소드
         * @method initColumn
         * @protected
         * @return {void}
         */
        initColumn: function(){
            var columnCount = this.columnModel.getColumnCount();
            //column 초기화, getRenderBody에서 getRenderHeader로 옮김
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
        /**
         * @description body의 row html을 생성하여 리턴하는 메소드
         * @method getRenderRow
         * @protected
         * @param {int} row 현재행 번호
         * @param {Rui.data.LRecord} record
         * @param {int} rowCount row 출력 총 카운트
         * @param {boolean} firstColumns 틀고정 전/후 여부
         * @param {int} checkFieldIndex rowHeight을 검사하기위해 단일 컬럼만 랜더링 할때의 대상 fieldIndex
         * @return {String}
         */
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
        /**
         * @description row Dom에 추가할 aria 속성을 리턴한다.
         * @method getAriaAttr
         * @protected
         * @return {String}
         */
        getAriaAttr: function(row, record) {
            return '';
        },
        /**
         * @description row를 생성한 후 추가할 row 정보를 계산한다.
         * @method getSummaryInfos
         * @protected
         * @return {Object}
         */
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
        /**
         * @description row를 생성한 후 추가할 row 정보를 계산한다.
         * @method getAfterRowInfo
         * @protected
         * @param {int} row 현재행 번호
         * @param {Rui.data.LRecord} record
         * @param {int} rowCount
         * @param {int} rowCount row 출력 총 카운트
         * @param {boolean} firstColumns 틀고정 전/후 여부
         * @return {String}
         */
        getAfterRowInfo: function(row, record, rowCount, firstColumns){
            var cm = this.columnModel, ds = this.dataSet, cnt = ds.getCount();
            // currentSumRows의 배열 0번은 가장 안쪽 소계, 1번은 소계보다 상위가 된다. 
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
                        //var currId = currentSumRows[j].summary.ids[k];
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
        /**
         * @description colId의 소계를 계산할 row 건수의 이전 colId의 소계를 시작할 row 위치를 리턴한다.
         * @method getBeforeColSumCount
         * @protected
         * @param {Array} sums 소계 정보 배열
         * @param {int} row 현재 row 위치
         * @param {String} colId colId 값
         * @param {Int} dataRowCnt 현재 위치의 소계를 계산할 row 건수
         * @return {String}
         */
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
                        // sumCnt 기준으로 컬럼 합계 계산
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
        /**
         * @description row에 대한 class name 만들기
         * @method getRenderRowClassName
         * @protected
         * @param {int} row 현재행 번호
         * @param {Rui.data.LRecord} record
         * @param {int} rowCount
         * @param {boolean} firstColumns
         * @return {String}
         */
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

            //L-grid-row L-grid-row-{id} L-grid-row-{even_odd} {first_last} {css}
            var cn = 'L-grid-row L-grid-row-' + record.id + ' L-grid-row-' + even_odd + ' ' + first_last + ' ';
            cn += css.join(' ');
            if(row == this.dataSet.rowPosition) cn += ' ' + GV.CLASS_GRIDVIEW_ROW_SELECTED;
            rowModel = css = record = null;
            return cn;
        },
        /**
         * @description cell등의 row의 내용 rendering후 결과 문자열 return
         * @protected
         * @method getRenderRowContent
         * @param {int} row 현재행 번호
         * @param {Rui.data.LRecord} record
         * @param {int} contentWidth
         * @param {boolean} firstColumns
         * @param {int} checkFieldIndex
         * @return {String}
         */
        getRenderRowBody: function(row, record, contentWidth, firstColumns, spans, checkFieldIndex){
            var ts = this.templates || {};
            var cm = this.columnModel;
            var colCount = cm.getColumnCount(true);
            var cells = '';
            if(checkFieldIndex != null && this.irregularScroll && this.irregularField){
            	//BR 태그등이 사용된 경우
                cells += this.getRenderCell(row, checkFieldIndex, colCount, record, spans ? spans[i] : undefined, true);
            }else{
                var freezeIndex = cm.freezeIndex;
                if(freezeIndex > -1) {
                    colCount = firstColumns ? freezeIndex + 1 : colCount;
                    for (var i = (firstColumns ? 0 : (freezeIndex + 1)); i < colCount; i++) {
                        //span이 -값이면 그리지 않는다.                   
                        if(spans && (spans[i].rowspan < 0 || spans[i].colspan < 0)) continue;
                        cells += this.getRenderCell(row, i, colCount, record, spans ? spans[i] : undefined);
                    }
                } else {
                    for (var i = 0; i < colCount; i++) {
                        //span이 -값이면 그리지 않는다.
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
        /**
         * @description body의 cell html을 생성하여 리턴하는 메소드
         * @method getRenderDummyCell
         * @protected
         * @return {String}
         */
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
        /**
         * @description body의 cell html을 생성하여 리턴하는 메소드
         * @method getRenderCell
         * @protected
         * @return {String}
         */
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
                //TODO : merged cell 또한 선택된 row와 동일하게 칠하려 할 경우의 코드 향후 정리할것.
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
/*
            var style = 'width:' + ((0 < i) ? colWidth - 1 : colWidth + 1) + 'px;';
            if(Rui.browser.msie) {
                style = 'width:' + ((0 < i) ? colWidth - 1 : colWidth + 1) + 'px;';
            }
            */
            if(column.align != '') style += 'text-align:' + column.align+';';

            if(column.cellStyle) style += column.cellStyle + ';';

            //irregularField 적용시 실제 width를 적용하기 위해 임시로 inline-block을 적용한다.
            if(isFieldCheck) style += 'display:table;';

            p.style += style;
            p.bcell = this.getRenderBeforeCell(p, record, column, row, i);

            //p.istyle = 'width:' + (colWidth-9) + 'px;';

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
        /**
         * @description cell의 params 정보를 리턴한다.
         * @method getRenderCellParams
         * @protected
         * @param {int} row row index값
         * @param {int} col col index값
         * @param {int} columnCount 보여지는 컬럼의 총 건수
         * @param {Rui.ui.grid.LColumn} column column객체
         * @param {Rui.data.LRecord} record record객체
         * @return {String}
         */
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
        /**
         * @description cell dom에 전에 탑재할 디자인용 html을 포함한다.
         * @method getRenderBeforeCell
         * @protected
         * @return {String}
         */
        getRenderBeforeCell: function(p, record, column, row, i) {
            return '';
        },
        /**
         * @description cell dom에 기본 css를 탑재한다.
         * @method getRenderCellClass
         * @protected
         * @param {Array} css css 배열
         * @param {int} row row 값
         * @param {int} col col 값
         * @param {Rui.data.LRecord} record 현재 행의 record 객체
         * @param {Rui.ui.grid.LColumn} column 현재 위치의 LColumn 객체
         * @return {Array}
         */
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
        /**
         * @description body의 cell의 value를 생성하여 리턴하는 메소드
         * @method getRenderCellValue
         * @protected
         * @return {String}
         */
        getRenderCellValue: function(p, record, column, row, i) {
            var value = record.get(column.field);
            return this.getRendererValue(value, p, record, column, row, i);
        },
        /**
         * @description row위치의 내용을 update하는 메소드
         * @method getRendererValue
         * @protected
         * @return {String}
         */
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
        /**
         * @description row위치의 내용을 update하는 메소드
         * @method updateRenderRows
         * @protected
         * @param {int} row row값
         * @return {void}
         */
        updateRenderRows: function(row) {
            // 중간에 데이터 추가시 성능 저하가 발생할 수 있음. 차후 성능 저하시 변경 필요
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
        /**
         * @description body의 empty 의 width 길이를 재 계산하여 적용한다.
         * @method updateEmptyWidth
         * @protected
         * @return {void}
         */
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
    /**
     * @description syncDataSet 속성에 따른 실제 적용 메소드
     * @method _setSyncDataSet
     * @protected
     * @param {String} type 속성의 이름
     * @param {Array} args 속성의 값 배열
     * @param {Object} obj 적용된 객체
     * @return {void}
     */
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
    /**
     * @description dataSet의 sync 적용 메소드
     * @method doSyncDataSet
     * @protected
     * @return {void}
     */
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
    /**
     * @description dataSet의 unsync 적용 메소드
     * @method doUnSyncDataSet
     * @protected
     * @return {void}
     */
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
    //var Ev = Rui.util.LEvent;
    var GV = Rui.ui.grid.LBufferGridView;
    Rui.applyObject(Rui.ui.grid.LBufferGridView.prototype, {
        /**
         * @description render 이벤트 발생시 호출되는 메소드
         * @method onRender
         * @private
         * @param {Object} e Event 객체
         * @return {void}
         */
        onRender: function() {
        },
        /**
         * @description dataSet의 beforeLoad 이벤트 발생시 호출되는 메소드
         * @method doBeforeLoad
         * @private
         * @param {Object} e Event 객체
         * @return {void}
         */
        doBeforeLoad: function(e) {
            this.modifiedDate = new Date();
            this.showLoadingMessage();
        },
        /**
         * @description 데이터셋의 load 이벤트 발생시 호출되는 메소드
         * @method onLoadDataSet
         * @private
         * @param {Object} e Event 객체
         * @return {void}
         */
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
        /**
         * @description renderData 이벤트 발생시 호출되는 메소드
         * @method onRenderData
         * @private
         * @param {Object} e Event 객체
         * @return {void}
         */
        onRenderData: function(e) {
            if(Rui.isDebugTI)
                Rui.log('grid start', 'time');
            this.fireEvent('beforeRender');

            if(e.options && e.options.add !== true) this.columnModel.cellConfig = {};
            //dataset load
            this.doRenderData(e);
            //this.focusRow(0,0);
            if (e.options && e.options.add !== true && this.scroller && this.pagerMode !== 'scroll') {
                if(!Rui.rightToLeft()) this.scroller.setScrollLeft(0);
            }
            if(Rui.isDebugTI)
                Rui.log('grid rendered', 'time');
            this.fireEvent('rendered');
        },
        /**
         * @description dataSet의 changed 이벤트 발생시 호출되는 메소드
         * @method onChangeRenderData
         * @private
         * @param {Object} e Event 객체
         * @return {void}
         */
        onChangeRenderData: function(e) {
            //if(this.selectionModel.isLocked()) return;
            //dataset datachanged : sorting 등
        	if(e && e.eventType == 0)
                if(this.scroller) this.scroller.setScrollLeft(0);
            this.doRenderData(e);
            if(this.scroller) this.scroller.onScrollX({ isForce: true });
            e = null;
        },
        /**
         * @description auto width의 경우 panel width가 조정될 경우 재계산
         * @method onWidthResize
         * @protected
         * @return {void}
         */
        onWidthResize: function(e){
            this.redoRender(true);
        },
        /**
         * @description dataSet의 add 이벤트 발생시 호출되는 메소드
         * @method doAddData
         * @private
         * @param {Object} e Event 객체
         * @return {void}
         */
        doAddData: function(e) {
            this.modifiedDate = new Date();
            // 건수가 바뀌면서 자동 랜더링됨.
            this.redoRenderData({ resetScroll: true, isDataChanged: true });
        },
        /**
         * @description dataSet의 update 이벤트 발생시 호출되는 메소드
         * @method doCellUpdateData
         * @private
         * @param {Object} e Event 객체
         * @return {void}
         */
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
                // 셀단위 변경
                this._doCellUpdateData(e);
                if(this.irregularScroll){
                    //셀의 값이 변경된 후 변경된 값에 <BR>등이 들어가 행의 높이가 달라질 경우 스크롤에 변화가 발생되어야 한다. 단, irregularScroll true인 경우만 적용
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
                    // 전체 데이터 변경 
                    var vRow = this.getVisibleRow(e.row);
                    if(renderRange && renderRange.start <= vRow && renderRange.end >= vRow)
                        this.redoRenderData({ resetScroll: true, system: e.system, isDataChanged: true });
                } 
            }
            cm = c = e = null;
        },
        /**
         * @description dataSet의 update 이벤트 발생시 호출되는 메소드
         * @method _doCellUpdateData
         * @private
         * @param {Object} e Event 객체
         * @return {void}
         */
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
        /**
         * @description cellConfigChanged 이벤트 발생시 호출되는 메소드
         * @method onUpdateCellConfig
         * @private
         * @param {Object} e Event 객체
         * @return {void}
         */
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
        /**
         * @description dataSet의 update 이벤트 발생시 호출되는 메소드
         * @method onStateChanged
         * @private
         * @param {Object} e Event 객체
         * @return {void}
         */
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
        /**
         * @description row와 col의 값에 해당되는 dom 객체에 데이터를 반영한다.
         * @method doRenderCell
         * @private
         * @param {int} row row 값
         * @param {int} col col 값
         * @param {Rui.data.LRecord} record record 객체
         * @return {void}
         */
        doRenderCell: function(row, col, record, span) {
            this.setValue(row, col, this.getRenderCell(row, col, this.columnModel.getColumnCount(true), record, span));
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
                currentRowDomEl = newRowDom = record = dataSet = currentRowDom = newDivDom = null;
            }
        },
        /**
         * @description dataSet의 remove 이벤트 발생시 호출되는 메소드
         * @method doRemoveData
         * @private
         * @param {Object} e Event 객체
         * @return {void}
         */
        doRemoveData: function(e) {
            this.modifiedDate = new Date();
            // 건수가 바뀌면서 자동 랜더링됨.
            this.redoRenderData({ resetScroll: true, isDataChanged: true });
        },
        /**
         * @description dataSet의 undo 이벤트 발생시 호출되는 메소드
         * @method doUndoData
         * @private
         * @param {Object} e Event 객체
         * @return {void}
         */
        doUndoData: function(e) {
            this.modifiedDate = new Date();
            this.redoRenderData({ resetScroll: true, isDataChanged: true });
        },
        /**
         * @description dataSet의 commit 이벤트 발생시 호출되는 메소드
         * @method onCommitData
         * @private
         * @param {Object} e Event 객체
         * @return {void}
         */
        onCommitData: function(e) {
            this.getBodyEl().select('.' + GV.CLASS_GRIDVIEW_CELL_EDITED).removeClass(GV.CLASS_GRIDVIEW_CELL_EDITED);
        },
        /**
         * @description dataSet의 rowPosChanged 이벤트 발생시 호출되는 메소드
         * @method onRowPosChangedData
         * @private
         * @param {Object} e Event 객체
         * @return {void}
         */
        onRowPosChangedData: function(e){
            if(!this.scroller) {
                var col = this.selectionModel.getCol ? this.selectionModel.getCol() : 0;
                this.syncFocusRow(e.row, col);
            }
            this.moveYScroll(e.row);
        },
        /**
         * @description dataSet의 allMarked 이벤트 발생시 호출되는 메소드
         * @method onAllMarked
         * @private
         * @param {Object} e Event 객체
         * @return {void}
         */
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
        /**
         * @description dataSet의 fieldsChanged 이벤트 발생시 호출되는 메소드
         * @method onFieldsChanged
         * @private
         * @param {Object} e Event 객체
         * @return {void}
         */
        onFieldsChanged: function(e) {
            this.updateView();
        },
        /**
         * @description body에 mouseOver 이벤트 발생시 호출되는 메소드
         * @method onBodyMouseOver
         * @private
         * @param {Object} e Event 객체
         * @return {void}
         */
        onBodyMouseOver: function(e) {
            if(this.getColumnModel().isMerged() === true || this.rowHoverStyle === false)
                return;
            var rowDom = this.findRowDom(e.target, e.pageY);
            if(rowDom) {
                Dom.addClass(rowDom, GV.CLASS_GRIDVIEW_ROW_OVER);
                rowDom = e = null;
            }
        },
        /**
         * @description body에 mouseOut 이벤트 발생시 호출되는 메소드
         * @method onBodyMouseOut
         * @private
         * @param {Object} e Event 객체
         * @return {void}
         */
        onBodyMouseOut: function(e) {
            if(this.getColumnModel().isMerged() === true || this.rowHoverStyle === false)
                return;
            var rowDom = this.findRowDom(e.target, e.pageY);
            if(rowDom) {
                Dom.removeClass(rowDom, GV.CLASS_GRIDVIEW_ROW_OVER);
                rowDom = e = null;
            }
        },
        /**
         * @description header에 mouseOver 이벤트 발생시 호출되는 메소드
         * @method onHeaderMouseOver
         * @private
         * @param {Object} e Event 객체
         * @return {void}
         */
        onHeaderMouseOver: function(e) {
            var cellDom = this.findHeaderCellDom(e.target);
            if(cellDom && !this.headerDisabled) {
                //columnResize를 위한것.
                this.activeHeaderColumnIndex = this.getCell(cellDom, e.pageX);
                if(this.activeHeaderColumnIndex > -1)
                    this.activeHeaderEl = Rui.get(cellDom);
                Dom.addClass(cellDom, GV.CLASS_GRIDVIEW_HEADER_OVER);
            }
            cellDom = e = null;
        },
        /**
         * @description header에 mouseMove 이벤트 발생시 호출되는 메소드
         * @method onHeaderMouseMove
         * @private
         * @param {Object} e Event 객체
         * @return {void}
         */
        onHeaderMouseMove: function(e){
            if(!this.headerDisabled && this.activeHeaderColumnIndex > -1 && this.activeHeaderEl){
                if (this.useColumnResize) {
                    //column resize start
                    var headerRegion = this.activeHeaderEl.getRegion();
                    //var cellIndex = this.activeHeaderEl.dom.cellIndex;//multiHeader로 수정.
                    var colIdx = this.activeHeaderColumnIndex;
                    var column = this.columnModel.getColumnAt(colIdx, true);
                    if(column) {
                        var showLeftCursor = true;
                        if (colIdx > 0) {
                            showLeftCursor = this.columnModel.getColumnAt(colIdx - 1, true).isResizable();
                        }
                        var x = Rui.util.LEvent.getPageX(e);//e.clientX;
                        /*if ((x - headerRegion.left) <= this.resizeHandleWidth && column.isResizable()) {
                            if (showLeftCursor) {
                                this.activeHeaderEl.setStyle('cursor', 'col-resize');
                                this._useColumnDD = false;
                            }
                        } else */ if ((headerRegion.right - x) <= this.resizeHandleWidth && column.isResizable()) {
                            this.activeHeaderEl.setStyle('cursor', 'col-resize');
                            this._useColumnDD = false;
                        }
                        else {
                            this.activeHeaderEl.setStyle('cursor', '');
                            this._useColumnDD = true;
                        }
                    }
                    //column resize end
                    headerRegion = column = e = null;
                }
            }
        },
        /**
         * @description header에 mouseOut 이벤트 발생시 호출되는 메소드
         * @method onHeaderMouseOut
         * @private
         * @param {Object} e Event 객체
         * @return {void}
         */
        onHeaderMouseOut: function(e) {
//            var target = e.target;
            var cellDom = this.findHeaderCellDom(e.target);
            if(cellDom) {
                Dom.setStyle(cellDom, 'cursor','');
                Dom.removeClass(cellDom, GV.CLASS_GRIDVIEW_HEADER_OVER);
                this.activeHeaderEl = null;
                this.activeHeaderColumnIndex = -1;
                cellDom = null;
            }
        },
        /**
         * @description header에 click 이벤트 발생시 호출되는 메소드
         * @method onHeaderClick
         * @private
         * @param {Object} e Event 객체
         * @return {void}
         */
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
        /**
         * @description header에 dblclick 이벤트 발생시 호출되는 메소드
         * @method onHeaderDblClick
         * @private
         * @param {Object} e Event 객체
         * @return {void}
         */
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
        /**
         * @description bodyScroll 이벤트 발생시 호출되는 메소드
         * @method onBodyScroll
         * @private
         * @param {Object} e Event 객체
         * @return {void}
         */
        onBodyScroll: function(e){
            this.syncHeaderScroll();
            this.fireEvent('bodyScroll');
        },
        /**
         * @description x scroll handler
         * @method onScrollX
         * @private
         * @return {void}
         */
        onScrollX: function(e){
            this.onBodyScroll(e);
            this.fireEvent('scrollX', e);
        },
        /**
         * @description y scroll handler
         * @method onScrollY
         * @private
         * @return {void}
         */
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
        /**
         * @description column 이벤트 발생시 호출되는 메소드
         * @method columnAddListener
         * @private
         * @return {void}
         */
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
        /**
         * @description column의 hidden 속성이 바뀌면 호출되는 메소드
         * @method onColumnHidden
         * @private
         * @param {Object} e Event 객체
         * @return {void}
         */
        onColumnHidden: function(e) {
            this.modifiedDate = new Date();
            this.redoRender();
        },
        /**
         * @description column의 sortable 속성이 바뀌면 호출되는 메소드
         * @method onColumnSortable
         * @private
         * @param {Object} e Event 객체
         * @return {void}
         */
        onColumnSortable: function(e) {
            var column = e.target;
            var elList = this.el.select('.L-grid-cell-' + column.id);
            if(e.sortable) elList.addClass('L-grid-cell-sortable');
            else elList.removeClass('L-grid-cell-sortable');
            column = elList = e = null;
        },
        /**
         * @description column의 label 이벤트 발생시 호출되는 메소드
         * @method doUpdateColumnLabel
         * @private
         * @param {Rui.ui.grid.LColumn} column column 객체
         * @param {string} label 변경할 label 명
         * @return {void}
         */
        onUpdateColumnLabel: function(e) {
            var column = e.target;
            this.getHeaderEl().select('.L-grid-header-' + column.id + ' a').html(e.label);
            column = e = null;
        },
        /**
         * @description rowSelect 이벤트 발생시 호출되는 메소드
         * @method onRowSelect
         * @private
         * @param {Object} e Event 객체
         * @return {void}
         */
        onRowSelect: function(row) {
            this.addRowClass(row, GV.CLASS_GRIDVIEW_ROW_SELECTED);

            if(this.selectionMergedCell === true && this.cellMergeInfoSet && this.getColumnModel().isMerged() && row > 0){
                //TODO : merged cell 또한 선택된 row와 동일하게 칠하려 할 경우의 코드 향후 정리할것.
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
        /**
         * @description rowDeSelect 이벤트 발생시 호출되는 메소드
         * @method onRowDeselect
         * @private
         * @param {Object} e Event 객체
         * @return {void}
         */
        onRowDeselect: function(row) {
            this.removeRowClass(row, GV.CLASS_GRIDVIEW_ROW_SELECTED);
            
            if(this.selectionMergedCell === true && this.cellMergeInfoSet && this.getColumnModel().isMerged() && row > 0){
                //TODO : merged cell 또한 선택된 row와 동일하게 칠하려 할 경우의 코드 향후 정리할것.
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
        /**
         * @description cell click 이벤트 발생시 호출되는 메소드
         * @method onCellClick
         * @private
         * @param {Object} e Event 객체
         * @return {void}
         */
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
        /**
         * @description cellSelect 이벤트 발생시 호출되는 메소드
         * @method onCellSelect
         * @private
         * @param {int} row row 위치
         * @param {int} cell cell 위치
         * @return {void}
         */
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
        /**
         * @description cellDeSelect 이벤트 발생시 호출되는 메소드
         * @method onCellDeselect
         * @private
         * @param {int} row row 위치
         * @param {int} cell cell 위치
         * @return {void}
         */
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
        /**
         * @description marked 이벤트 발생시 호출되는 메소드
         * @method onMark
         * @private
         * @param {int} row row 위치
         * @return {void}
         */
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
                        //if(cellEl) Rui.get(cellEl.dom.childNodes[0]).addClass('L-grid-header-checkBox-mark');
                        cellEl = null;
                    }
                    selectionColumn = null;
                }
            }
        },
        /**
         * @description demark 이벤트 발생시 호출되는 메소드
         * @method onDemark
         * @private
         * @param {int} row row 위치
         * @return {void}
         */
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
                        //if(cellEl) Rui.get(cellEl.dom.childNodes[0]).removeClass('L-grid-header-checkBox-mark');
                        cellEl = null;
                    }
                    selectionColumn = null;
                }
            }
        },
        /**
         * @description focus 여부를 확인하는 메소드
         * @method onCheckFocus
         * @protected
         * @param {Object} e Event 객체
         * @return {void}
         */
        onCheckFocus: function(e) {
            if(!this.isFocus) {
                this.onFocus.call(this, e);
                this.isFocus = true;
                Rui.util.LEvent.addListener(Rui.browser.msie ? document.body : document, 'mousedown', this.deferOnBlur, this, true);
            }
        },
        /**
         * @description invalid시 호출되는 이벤트 메소드
         * @method onInvalid
         * @protected
         * @param {Object} e Event 객체
         * @return {void}
         */
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
        /**
         * @description valid시 호출되는 이벤트 메소드
         * @method onValid
         * @protected
         * @param {Object} e Event 객체
         * @return {void}
         */
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
        /**
         * @description column resize하기
         * @method onColumnResize
         * @private
         * @param {Object} e 이벤트 객체
         * @return {void}
         */
        onColumnResize: function(e) {
            this.gridPanel.onColumnResize(e);
            var scrollLeft = (this.scroller) ? this.scroller.getScrollLeft() : 0;
            this.redoRender(false, scrollLeft);
        },
        /**
         * @description column 이동하기
         * @method onColumnMove
         * @private
         * @param {Object} e 이벤트 객체
         * @return {void}
         */
        onColumnMove: function(e){
            this.gridPanel.onColumnMove(e);
            var scrollLeft = (this.scroller) ? this.scroller.getScrollLeft() : 0;
            this.redoRender(false, scrollLeft);
        },
        /**
         * @description LColumnModel에 columnsChanged 이벤트가 수행되면 호출되는 메소드 (미완성)
         * @method onColumnsChanged
         * @private
         * @param {Object} e 이벤트 객체
         * @return {void}
         */
        onColumnsChanged: function(e){
            this.modifiedDate = new Date();
            this.redoRender(true);
        },
        /**
         * @description blur 이벤트 발생시 defer를 연결하는 메소드
         * @method deferOnBlur
         * @protected 
         * @param {Object} e Event 객체
         * @return {void}
         */
        deferOnBlur: function(e){
            Rui.util.LFunction.defer(this.checkBlur, 20, this, [e]);
        },
        checkBlur: function(e){
            if(e.deferCancelBubble == true || this.isFocus !== true) return;
            var target = e.target;
            // 방어 코딩 그리드의 dom을 선택했는데 해당 dom이 L-grid에 있는 dom이 아니라는 단판을 함.
            try {
                //IE8에서 target이 껍데기 object가 나오는 경우가 있다.
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
        /**
         * @description blur 이벤트 발생시 호출되는 메소드
         * @method onBlur
         * @protected
         * @param {Object} e Event 객체
         * @return {void}
         */
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
    /**
     * @description 그리드에서 cell을 선택시 흐름 제어를 하는 객체
     * @namespace Rui.ui.grid
     * @class LSelectionModel
     * @sample default
     * @extends Rui.util.LEventProvider
     * @constructor
     * @param {Object} config
     */
    Rui.ui.grid.LSelectionModel = function(config) {
        config = config || {};
        Rui.applyObject(this, config, true);

        Rui.ui.grid.LSelectionModel.superclass.constructor.call(this);
        /**
         * @description 그리드에서 row 선택시 발생하는 이벤트
         * @event selectRow
         * @sample default
         * @param {Object} target this객체
         * @param {int} row row값
         */
        this.createEvent('selectRow');

        /**
         * @description 그리드에서 row 선택 취소시 발생하는 이벤트
         * @event deselectRow
         * @sample default
         * @param {Object} target this객체
         * @param {int} row row값
         */
        this.createEvent('deselectRow');
        
        /**
         * @description 그리드에서 cell 선택시 발생하는 이벤트 (이 이벤트는 멀티 선택이 가능하다) 
         * @event selectCell
         * @sample default
         * @param {Object} target this객체
         * @param {int} row row 값
         * @param {int} col col값
         */
        this.createEvent('selectCell');

        /**
         * @description 그리드에서 cell 선택 취소시 발생하는 이벤트
         * @event deselectCell
         * @sample default
         * @param {Object} target this객체
         * @param {int} row row 값
         * @param {int} col col값
         */
        this.createEvent('deselectCell');
        config = null;
    };

    Rui.extend(Rui.ui.grid.LSelectionModel, Rui.util.LEventProvider, {
        /**
         * @description locked 속성
         * @config locked
         * @type {boolean}
         * @default false
         */
        /**
         * @description locked 속성
         * @property locked
         * @private
         * @type {boolean}
         */
        locked: false,
        /**
         * @description object type 속성
         * @property otype
         * @private
         * @type {String}
         */
        otype: 'Rui.ui.grid.LSelectionModel',
        /**
         * @description row 선택시 자동 mark 를 처리할지 여부
         * @config marked
         * @type {boolean}
         * @default false
         */
        /**
         * @description row 선택시 자동 mark 를 처리할지 여부
         * @property marked
         * @private
         * @type {boolean}
         */
        marked: false,
        /**
         * @description page up/down시 row 이동 값 속성
         * @config pageUpDownRow
         * @type {int}
         * @default 10
         */
        /**
         * @description page up/down시 row 이동 값 속성
         * @property pageUpDownRow
         * @private
         * @type {int}
         */
        pageUpDownRow: 10,
        /**
         * @description 이전에 선택된 row의 위치
         * @property oldRow
         * @private
         * @type {int}
         */
        oldRow: -1,
        /**
         * @description 이전에 선택된 cell의 위치
         * @property oldCell
         * @private
         * @type {int}
         */
        oldCell: 0,
        /**
         * @description 선택된 cell의 위치
         * @property currentCol
         * @private
         * @type {int}
         */
        currentCol: 0,
        /**
         * @description Tab키 입력시 이동여부
         * @config tabToMove
         * @type {boolean}
         * @default true
         */
        /**
         * @description Tab키 입력시 이동여부
         * @property tabToMove
         * @private
         * @type {boolean}
         */
        tabToMove: true,
        /**
         * @description editor상태에서 enter를 치면 다음 editor cell로 이동할지 여부 속성
         * @config enterToMove
         * @type {boolean}
         * @default true
         */
        /**
         * @description editor상태에서 enter를 치면 다음 editor cell로 이동할지 여부 속성
         * @property enterToMove
         * @private
         * @type {boolean}
         */
        enterToMove: true,
        /**
         * @description cell 선택 정보
         * @property selection
         * @private
         * @type {Object}
         */
        selection: {},
        /**
         * @description 객체를 초기화하는 메소드
         * @method init
         * @protected
         * @param {Rui.ui.grid.LGridPanel} gridPanel
         * @return {void}
         */
        init: function(gridPanel) {
            this.gridPanel = gridPanel;
            this.view = gridPanel.getView();
            this.oldRow = gridPanel.getView().getDataSet().getRow();
            this.initEvents();
        },
        /**
         * @description 객체의 이벤트 초기화 메소드
         * @method initEvents
         * @protected
         * @return {void}
         */
        initEvents: function() {
            var view = this.gridPanel.getView();

            //view.on('syncDataSet', this.onSetSyncDataSet, this, true);
            //this.doSetSyncDataSet(view.isSyncDataSet());
            
            var keyEventName = Rui.browser.msie || Rui.browser.chrome || (Rui.browser.safari && Rui.browser.version == 3) ? 'keydown' : 'keypress';
            this.gridPanel.unOn(keyEventName, this.onKeydown, this);
            this.gridPanel.on(keyEventName, this.onKeydown, this, true, { system: true });
            
            //this.gridPanel.on('keypress', this.onKeydown, this, true);
            
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
        /**
         * @description DataSet의 syncDataSet 이벤트 발생시 수행되는 메소드
         * @method doSetSyncDataSet
         * @protected
         * @param {boolean} isSync sync 여부
         * @return {void}
         */
        doSetSyncDataSet: function(isSync) {
            //var view = this.gridPanel.getView();
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
        /**
         * @description 그리드의 row나 cell의 선택을 안되게 막는 메소드
         * @method lock
         * @sample default
         * @return {void}
         */
        lock: function(){
            this.locked = true;
        },
        /**
         * @description 그리드의 row나 cell의 선택을 안되게 막혀 있던 기능을 다시 선택되게 하는 메소드
         * @method unlock
         * @sample default
         * @return {void}
         */
        unlock: function(){
            this.locked = false;
        },
        /**
         * @description 그리드의 모든 row나 cell이 선택이 가능한지 여부를 리턴하는 메소드
         * @method isLocked
         * @sample default
         * @return {boolean}
         */
        isLocked: function(){
            return this.locked;
        },
        /**
         * @description row click 이벤트 발생시 호출되는 메소드
         * @method onRowClick
         * @protected
         * @param {Object} e Event 객체
         * @return {void}
         */
        onRowClick: function(e) {
            //var gridPanel = e.target;
            //var dataSet = this.view.getDataSet();
            //dataSet.setRow(e.row);
        },
        /**
         * @description cell click 이벤트가 발생하면 호출되는 메소드
         * @method onCellClick
         * @protected
         * @param {Object} e Event 객체
         * @return {void}
         */
        onCellClick: function(e) {
            var evt = e.event ? e.event : e; 
            if(evt.type == 'click' && ( evt.ctrlKey === true || evt.shiftKey === true)){
                this.selectCell(e.row, e.col);
            }
            e = null;
        },
        /**
         * @description DataSet의 add 이벤트 발생시 호출되는 메소드
         * @method onAdd
         * @protected
         * @param {Object} e Event 객체
         * @return {void}
         */
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
                    //this.doDeSelectCell(this.oldRow, col);
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
        /**
         * @description DataSet의 rowPosChanged 이벤트 발생시 호출되는 메소드
         * @method onRowPosChanged
         * @protected
         * @param {Object} e Event 객체
         * @return {void}
         */
        onRowPosChanged: function(e) {
            this.doMoveSelectRow(e.oldRow, e.row);
        },
        /**
         * @description row 위치로 이동시키는 메소드
         * @method doMoveSelectRow
         * @protected
         * @param {int} oldRow 전 row 위치
         * @param {int} row 후 row 위치
         * @return {void}
         */
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
            //this.view.focusRow(row,col);
        },
        /**
         * @description row 위치로 focus하는 메소드
         * @method doFocusRow
         * @protected
         * @param {int} row row 위치
         * @return {void}
         */
        doFocusRow: function(row){
            //this.gridPanel.getView().focusRow(row,undefined);
        },
        /**
         * @description row 위치를 select하는 메소드
         * @method selectRow
         * @protected
         * @param {int} row row 위치
         * @return {void}
         */
        selectRow: function(row) {
            this.view.onRowSelect(row);
            this.doFocusRow(row);
            this.currentRow = row;
            this.fireEvent('selectRow', {target:this, row:row});
        },
        /**
         * @description row 위치를 select를 취소하는 메소드
         * @method deSelectRow
         * @protected
         * @param {int} row row 위치
         * @return {void}
         */
        deSelectRow: function(row) {
            this.view.onRowDeselect(row);
            this.fireEvent('deselectRow', {target:this, row:row});
        },
        /**
         * @description cell 위치로 이동시키는 메소드
         * @method selectCell
         * @param {int} row 이동 위치
         * @param {int} col 이동 위치
         * @return {boolean}
         */
        selectCell: function(row, col) {
            var dataSet = this.view.getDataSet();
            if(row < 0 || row > dataSet.getCount() - 1) return;
            //this.doMoveSelectCell(row, col);
            var isSelect = this.doSelectCell(row, col);
            if(isSelect) {
                this.currentRow = row;
                this.currentCol = col;
            }
            dataSet = null;
            return isSelect;
        },
        /**
         * @description cell를 선택하는 메소드
         * @method doSelectCell
         * @private
         * @param {int} row 이동 위치
         * @param {int} col 이동 위치
         * @return {boolean}
         */
        doSelectCell: function(row, cell) {
            // row 값은 DataSet의 실제 row값으로 들어와야 함.
            if(this._selectCell) return false;
            if(row < 0) return false;
            var columnModel = this.gridPanel.columnModel, view = this.view;
            if(cell < 0 || cell > columnModel.getColumnCount(true) - 1) return false;
            var ds = view.getDataSet();
            //if(row == ds.getRow() && cell == this.currentCol) return;
            this._selectCell = true;
            view.onCellSelect(row, cell);
            //view.onRowSelect(row);
            var realRow = row;
            var cellId = undefined;
            if(row > -1) {
                var column = columnModel.getColumnAt(cell, true);
                cellId = column.id;
                // 트리그리드와 같은 row가 감춰지는 행이 있는 경우 row값이 실제 row값인지 숨긴 행을 제외한것인지 확인 필요
                //var r = view.getRowRecord(row);
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
        /**
         * @description cell를 선택 취소하는 메소드
         * @method doDeSelectCell
         * @protected
         * @param {int} row 이동 위치
         * @param {int} col 이동 위치
         * @return {void}
         */
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
        /**
         * @description cell이 선택되었는지 여부를 리턴하는 메소드
         * @method hasSelectedCell
         * @protected
         * @param {int} row 이동 위치
         * @param {int} col 이동 위치
         * @return {boolean}
         */
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
        /**
         * @description row의 전체 cell을 선택한다.
         * @method doRowSelectionCell
         * @protected
         * @param {int} row row값
         * @param {boolean} isDeSelection 선택 취소 여부
         * @return {void}
         */
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
        /**
         * @description tab키 이동 이벤트시 호출되는 메소드
         * @method onTabMoveCell
         * @protected
         * @param {Object} e Event 객체
         * @return {void}
         */
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
                // 이동값 계산
                this.doDeSelectCell(oldRow, oldCell);
                gridPanel.doSelectCell(row, moveCell);
            } finally {
                gridPanel = dataSet = null;
            }
        },
        /**
         * @description col 위치에 해당되는 컬럼중 보이는 컬럼 index를 리턴하는 메소드
         * @method getVisibleColIndex
         * @private
         * @param {int} col col 위치
         * @param {int} calCol 계산 값
         * @return {void}
         */
        getVisibleColIndex: function(col, calCol) {
            if(col < 0 || col > this.view.columnModel.getColumnCount(true) - 1) return -1;
            var column = this.view.columnModel.getColumnAt(col + calCol, true);
            if(column == null) return -1;
            column = null;
            return col + calCol;
        },
        /**
         * @description keydown 이벤트 발생시 호출되는 메소드
         * @method onKeydown
         * @protected
         * @param {Object} e Event 객체
         * @return {void}
         */
        onKeydown: function(e) {
            // 46 : del 키
            if(!Event.isNavKey(e) && !(e.ctrlKey == true || e.shiftKey == true || e.keyCode === 113 || e.keyCode === 46) || this.isLocked()) return;
            var gridPanel = this.gridPanel;
            if(gridPanel.useMultiCellDeletable !== true && e.keyCode == 46) return;
            var columnModel = gridPanel.columnModel;
            var view = this.view;
            var dataSet = view.getDataSet();
            if(gridPanel.isEdit == true) return;
            //Rui.ui.grid.LSelectionModel.superclass.onKeydown.call(this, e);
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
                    case 97: //a
                    case 65: //A
                    // 이동값 계산
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
            //Rui.log('Event.stopEvent');
            gridPanel = null;
            columnModel = null;
            dataSet = null;
        },
        /**
         * @description page up 이벤트 발생시 호출되는 메소드
         * @method onPageUp
         * @protected
         * @param {Object} e Event 객체
         * @return {void}
         */
        onPageUp: function(e) {
            var view = this.gridPanel.getView(), ds = view.getDataSet();
            var irregularRowHeight = view.getIrregularRowHeight ? view.getIrregularRowHeight(false) : null;
            var visibleRowCount = view.getVisibleRowCount ? view.getVisibleRowCount(true, irregularRowHeight) : this.pageUpDownRow;
            var row = this.getMoveRow(ds.getRow(), -visibleRowCount);
            row = (row < 0) ? 0 : row;
            if(row !== ds.getRow() && e.ctrlKey !== true && e.shiftKey !== true) this.clearSelection();
            // 이동값 계산
            view.getDataSet().setRow(row);
            ds = view = null;
        },
        /**
         * @description page down 이벤트 발생시 호출되는 메소드
         * @method onPageDown
         * @protected
         * @param {Object} e Event 객체
         * @return {void}
         */
        onPageDown: function(e) {
            var view = this.gridPanel.getView(), ds = view.getDataSet();
            var irregularRowHeight = view.getIrregularRowHeight ? view.getIrregularRowHeight(false) : null;
            var visibleRowCount = view.getVisibleRowCount ? view.getVisibleRowCount(true, irregularRowHeight) : this.pageUpDownRow;
            var row = this.getMoveRow(ds.getRow(), visibleRowCount);
            row = (row > view.getDataCount() - 1) ? view.getDataCount() - 1 : row;
            if(row !== ds.getRow() && e.ctrlKey !== true && e.shiftKey !== true) this.clearSelection();
            // 이동값 계산
            view.getDataSet().setRow(row);
            ds = view = null;
        },
        /**
         * @description header mousedown 이벤트 발생시 호출되는 메소드
         * @method onHdMouseDown
         * @protected
         * @param {Object} e Event 객체
         * @return {void}
         */
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
        /**
         * @description body mousedown 이벤트 발생시 호출되는 메소드
         * @method onBodyMouseDown
         * @protected
         * @param {Object} e Event 객체
         * @return {void}
         */
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
                                // 이동값 계산
                                this.doMoveRow(row);
                            }
                        }
                    }
            	}
            }
            if (e.ctrlKey !== true && e.shiftKey !== true && !Dom.hasClass(target, 'L-grid-row-checkBox') && !Dom.hasClass(target, 'L-grid-row-radio') && row > -1) {
                // 이동값 계산
                this.doMoveRow(row);
            }
            
            try{
                if(row < 0 || col < 0) return;
                var column = gridPanel.columnModel.getColumnAt(col, true);
                // Event.preventDefault 필요한 이유?
                if(column && column.editor && column.editable) Event.preventDefault(e);
                if (e.ctrlKey !== true && e.shiftKey !== true) {
                    this.clearSelection();
                    // 한건일 경우에는 LGridPanel이 selectCell로 처리함.
                    //this.doDeSelectCell(this.getRow(), this.getCol());
                    //this.selectCell(row, col);
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
                            // 이동값 계산
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
                /*
                if(row >= 0 && col >= 0)
                    this.view.focusRow(row, col);
                    */
            }catch(error){ Rui.log(Rui.dump(error)); } finally {
                gridPanel = view = dataSet = null;
            }
        },
        /**
         * @description selection된 값들을 모두 clear 한다.
         * @method clearSelection
         * @return {void}
         */
        clearSelection: function() {
            if(this.isSelectionData === true) this.view.getBodyEl().select('.' + GV.CLASS_GRIDVIEW_CELL_SELECTED).removeClass(GV.CLASS_GRIDVIEW_CELL_SELECTED);
            this.selection = {};
            this.isSelectionData = false;
        },
        doMoveRow: function(row) {
            // 이동값 계산
            //this.view.getDataSet().setRow(row);
        },
        /**
         * @description DataSet의 marked 이벤트 발생시 호출되는 메소드
         * @method onMarked
         * @protected
         * @param {Object} e Event 객체
         * @return {void}
         */
        onMarked: function(e) {
            if(e.isSelect === true) {
                this.doMarked(e.row);
            } else {
                this.deDemarked(e.row);
            }
        },
        /**
         * @description grid view의 row를 선택하는 메소드
         * @method doMarked
         * @protected
         * @param {int} row row 위치
         * @return {void}
         */
        doMarked: function(row) {
            this.view.onMark(row);
        },
        /**
         * @description grid view의 row를 선택을 취소하는 메소드
         * @method deDemarked
         * @protected
         * @param {int} row row 위치
         * @return {void}
         */
        deDemarked: function(row) {
            this.view.onDemark(row);
        },
        /**
         * @description row의 위치를 리턴한다.
         * @method getRow
         * @return {int}
         */
        getRow: function() {
            return this.gridPanel.getView().getDataSet().getRow();
        },
        /**
         * @description 데이터의 총건수를 리턴한다.
         * @method getDataCount
         * @protected
         * @return {int}
         */
        getDataCount: function() {
            return this.view.getDataCount();
        },
        /**
         * @description 선택한 cell 정보를 리턴합니다.
         * @method getSelection
         * @return {Object}
         */
        getSelection: function() {
            return this.selection;
        },
        /**
         * @description 선택한 cell Index를 리턴합니다.
         * @method getCol
         * @return {int}
         */
        getCol: function() {
            return this.currentCol;
        },
        /**
         * @description 현재 선택한 col의 id를 리턴합니다.
         * @method getColId
         * @return {String}
         */
        getColId: function() {
            var cm = this.gridPanel.columnModel;
            if(this.currentCol < 0) return null;
            var column = cm.getColumnAt(this.currentCol, true);
            if(!column) return null;
            return column.getId();
        },
        /**
         * @description row에서 moveIdx만큼 이동할 row를 계산하여 리턴한다.
         * @method getMoveRow
         * @protected
         * @param {int} row row 위치
         * @return {int}
         */
        getMoveRow: function(row, moveIdx) {
            return row + moveIdx;
        },
        /**
         * DOM에서 패널 엘리먼트를 제거하고 모든 자식 엘리먼트들을 null로 설정한다.
         * @method destroy
         * @return {void}
         */
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

    /**
     * @description 그리드의 편집기능을 탑재하는 Panel
     * @namespace Rui.ui.grid
     * @class LGridPanel
     * @extends Rui.ui.LPanel
     * @sample default
     * @constructor LGridPanel
     * @param {Object} oConfig The intial LGridPanel.
     */
    Rui.ui.grid.LGridPanel = function(oConfig) {
        var config = oConfig || {};
        
        Rui.applyIf(config, {
            id: Rui.id(),
           // appendtodocumentbody:true,
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

        /**
         * @description panel이 click 되면 호출되는 이벤트
         * @event click
         * @sample default
         */
        this.createEvent('click');
        /**
         * @description panel이 dblClick 되면 호출되는 이벤트
         * @event dblclick
         * @sample default
         */
        this.createEvent('dblclick');

        /**
         * @description panel이 mousedown 되면 호출되는 이벤트
         * @event mousedown
         * @sample default
         */
        this.createEvent('mousedown');

        /**
         * @description panel이 mouseup 되면 호출되는 이벤트 (mouseEvent 생성자 속성이 true일 경우에만 작동한다. 성능이 느려지므로 그리드 3개 이상이 포함된 화면에서 사용 불가)
         * @event mouseup
         * @sample default
         */
        this.createEvent('mouseup');

        /**
         * @description panel이 mouseover 되면 호출되는 이벤트 (mouseEvent 생성자 속성이 true일 경우에만 작동한다. 성능이 느려지므로 그리드 3개 이상이 포함된 화면에서 사용 불가)
         * @event mouseover
         * @sample default
         */
        this.createEvent('mouseover');

        /**
         * @description panel이 mouseout 되면 호출되는 이벤트 (mouseEvent 생성자 속성이 true일 경우에만 작동한다. 성능이 느려지므로 그리드 3개 이상이 포함된 화면에서 사용 불가)
         * @event mouseout
         * @sample default
         */
        this.createEvent('mouseout');

        /**
         * @description panel이 cellMouseDown 되면 호출되는 이벤트
         * @event cellMouseDown
         * @sample default
         */
        this.createEvent('cellMouseDown');

        /**
         * @description panel이 rowMouseDown 되면 호출되는 이벤트
         * @event rowMouseDown
         * @sample default
         */
        this.createEvent('rowMouseDown');

        /**
         * @description panel이 headerMouseDown 되면 호출되는 이벤트
         * @event headerMouseDown
         * @sample default
         */
        this.createEvent('headerMouseDown');

        /**
         * @description panel이 cellClick 되면 호출되는 이벤트
         * @event cellClick
         * @sample default
         * @param {Object} target this객체
         * @param {int} row row값
         * @param {int} col col값
         * @param {String} colId col의 id
         * @param {Object} e event객체
         */
        this.createEvent('cellClick');

        /**
         * @description panel이 cellDblClick 되면 호출되는 이벤트
         * @event cellDblClick
         * @sample default
         * @param {Object} target this객체
         * @param {int} row row값
         * @param {int} col col값
         * @param {String} colId col의 id
         * @param {Object} e event객체
         */
        this.createEvent('cellDblClick');

        /**
         * @description panel이 rowClick 되면 호출되는 이벤트
         * @event rowClick
         * @sample default
         * @param {Object} target this객체
         * @param {int} row row값
         * @param {Object} e event객체
         */
        this.createEvent('rowClick');

        /**
         * @description panel이 rowDblClick 되면 호출되는 이벤트
         * @event rowDblClick
         * @sample default
         * @param {Object} target this객체
         * @param {int} row row값
         * @param {Object} e event객체
         */
        this.createEvent('rowDblClick');

        /**
         * @description panel이 headerClick 되면 호출되는 이벤트
         * @event headerClick
         * @sample default
         * @param {Object} target this객체
         * @param {int} col col값
         * @param {Object} e event객체
         */
        this.createEvent('headerClick');

        /**
         * @description panel이 headerDblClick 되면 호출되는 이벤트
         * @event headerDblClick
         * @sample default
         * @param {Object} target this객체
         * @param {int} col col값
         * @param {Object} e event객체
         */
        this.createEvent('headerDblClick');

        /**
         * @description copy시 호출되는 이벤트
         * @event copy
         * @sample default
         */
        this.createEvent('copy');

        /**
         * @description paste시 호출되는 이벤트
         * @event paste
         * @sample default
         */
        this.createEvent('paste');

        /**
         * @description panel이 keydown 되면 호출되는 이벤트
         * @event keydown
         * @sample default
         */
        this.createEvent('keydown');

        /**
         * @description panel이 keypress 되면 호출되는 이벤트
         * @event keypress
         * @sample default
         */
        this.createEvent('keypress');

        /**
         * @description panel이 autoWidth === true일 경우 resizing이 발생했을 경우 발생하는 event
         * @event widthResize
         * @sample default
         */
        this.createEvent('widthResize');

        /**
         * @description edit가 되기전에 호출되는 이벤트
         * @event beforeEdit
         * @param {Object} target this객체
         * @param {int} row row값
         * @param {int} col col값
         * @param {String} colId colId값
         */
        this.createEvent('beforeEdit');

        /**
         * @description cellClick시 해당 cell에 'L-popup-button-icon' css가 탑재되면 호출되는 popup 이벤트
         * @event popup
         * @param {Object} target this객체
         * @param {int} row row값
         * @param {int} col col값
         * @param {String} colId colId값
         * @param {Rui.LElement} buttonEl 클릭된 버튼
         * @param {Boolean} editable 셀 에디터 가능 여부
         */
        this.createEvent('popup');

        /**
         * @description paste시 해당 cell에 붙여넣기 시 발생하는 이벤트로 usePasteCellEvent 생성자 값이 true일 경우에반 발생한다.
         * @event pasteCell
         * @sample default
         * @param {int} row row값
         * @param {int} col col값
         * @param {String} colId colId값
         * @param {Object} value 현재 값
         */
        this.createEvent('pasteCell');

        /**
         * @description paste 완료 시 호출되는 이벤트
         * @event pasteCompleted
         * @sample default
         */
         this.createEvent('pasteCompleted');        

        Rui.ui.grid.LGridPanel.superclass.constructor.call(this, config);

        config = null;
    };

    Rui.extend(Rui.ui.grid.LGridPanel, Rui.ui.LPanel, {
        /**
         * @description object type 속성
         * @property otype
         * @protected
         * @type {String}
         */
        otype: 'Rui.ui.grid.LGridPanel',
        /**
         * GridView
         * @property view
         * @type Rui.ui.grid.LGridView
         * @protected
         */
        view : null,
        /**
         * @description columnModel 객체
         * @config columnModel
         * @type {Rui.ui.grid.LColumnModel}
         * @default null
         */
        /**
         * @description columnModel 객체
         * @property columnModel
         * @type {Rui.ui.grid.LColumnModel}
         * @protected
         */
        columnModel: null,
        /**
         * @description rowModel 객체
         * @config rowModel
         * @type {Rui.ui.grid.LRowModel}
         * @default null
         */
        /**
         * @description rowModel 객체
         * @property rowModel
         * @type {Rui.ui.grid.LRowModel}
         * @protected
         */
        rowModel: null,
        /**
         * @description LGridPanel의 border width값
         * @config borderWidth
         * @type {int}
         * @default 0
         */
        /**
         * @description LGridPanel의 border width값
         * @property borderWidth
         * @type {int}
         * @protected
         */
        borderWidth: 0,
        /**
         * @description 그리드의 row나 cell 선택시 기능을 처리하는 객체
         * @config selectionModel
         * @sample default
         * @type {Rui.ui.grid.LSelectionModel}
         * @default null
         */
        /**
         * @description 그리드의 row나 cell 선택시 기능을 처리하는 객체
         * @property selectionModel
         * @type {Rui.ui.grid.LSelectionModel}
         * @protected
         */
        selectionModel: null,
        /**
         * @description 그리드의 width를 자동으로 부모 사이즈에 맞춰주는 기능.
         * autoWidth를 적용하여도 width의 기본값은 반드시 적용한다.
         * @config autoWidth
         * @type {boolean}
         * @default false
         */
        /**
         * @description 그리드의 width를 자동으로 부모 사이즈에 맞춰주는 기능
         * autoWidth를 적용하여도 width의 기본값은 반드시 적용한다.
         * @property autoWidth
         * @type {boolean}
         * @protected
         */
        autoWidth: false,
        /**
         * @description 그리드의 height를 자동으로 부모 사이즈에 맞춰주는 기능. height를 맞추기 위해서는 그리드 부모 dom이 100%가 적용되어야 한다. 부모가 늘어나지 않으면 적용되지 않음.
         * autoHeight를 적용하여도 height의 기본값은 반드시 적용한다.
         * @config autoHeight
         * @type {boolean}
         * @default false
         */
        /**
         * @description 그리드의 height를 자동으로 부모 사이즈에 맞춰주는 기능. height를 맞추기 위해서는 그리드 부모 dom이 100%가 적용되어야 한다. 부모가 늘어나지 않으면 적용되지 않음.
         * autoHeight를 적용하여도 height의 기본값은 반드시 적용한다.
         * @property autoHeight
         * @type {boolean}
         * @protected
         */
        autoHeight: false,
        /**
         * @description autoHeight 적용시 기준이 될 부모 HTML 의 id를 적용한다. parent dom이 반드시 보여야 한다. 보아지 않을 경우 height는 0이 될 수 있다.
         * @config autoHeightParentId
         * @type {String}
         * @default null
         */
        /**
         * @description autoHeight 적용시 기준이 될 부모 HTML 의 id를 적용한다. parent dom이 반드시 보여야 한다. 보아지 않을 경우 height는 0이 될 수 있다.
         * @property autoHeightParentId
         * @type {String}
         * @protected
         */
        autoHeightParentId: null,
        /**
         * @description 클립보드 copy & Paste시 오른쪽 마지막 공백을 제거함
         * @property rtrimWhiteSpace
         * @type {boolean}
         * @protected
         */
        rtrimWhiteSpace: true,
        /**
         * @description click시 edit상태로 전환할지 여부 속성
         * @config clickToEdit
         * @type {boolean}
         * @default false
         */
        /**
         * @description click시 edit상태로 전환할지 여부 속성
         * @property clickToEdit
         * @protected
         * @type {boolean}
         */
        clickToEdit: true,
        /**
         * @description cell focus시 자동 edit상태로 전환할지 여부 속성
         * <p>Sample: <a href="./../sample/general/ui/grid/gridpanelEditSample.html" target="_sample">보기</a></p>
         * @config autoToEdit
         * @type {boolean}
         * @default false
         */
        /**
         * @description cell focus시 자동 edit상태로 전환할지 여부 속성
         * @property autoToEdit
         * @protected
         * @type {boolean}
         */
        autoToEdit: false,
        /**
         * @description enter시 edit상태로 전환할지 여부 속성
         * @config enterToEdit
         * @type {boolean}
         * @default true
         */
        /**
         * @description enter시 edit상태로 전환할지 여부 속성
         * @property enterToEdit
         * @protected
         * @type {boolean}
         */
        enterToEdit: true,
        /**
         * @description editor 상태인지를 여부 속성
         * @property isEdit
         * @protected
         * @type {boolean}
         */
        isEdit: false,
        /**
         * @description 편집기가 수행할 수 있는지 여부를 정하는 속성
         * @config editable
         * @type {boolean}
         * @default null
         */
        /**
         * @description edit가 가능한지 여부 속성
         * @property editable
         * @protected
         * @type {boolean}
         */
        editable: null,
        /**
         * 그리드가 render시 row와 cell render event를 skip할지 여부(성능과 연관되므로 대량건 처리시는 false로 처리)
         * @property skipRowCellEvent
         * @type {boolean}
         * @protected
         */
        skipRowCellEvent: true,
        rendererConfig: true,
        /**
         * 편집의 값이 바뀔 경우 시스템 콤포넌트에 의해서 값이 바꿨는지 사용자가 바꿨는지 판단하는 값
         * @property systemSelect
         * @type {boolean}
         * @protected
         */
        systemSelect: true,
        /**
         * @description 그리드에 툴팁을 표시하기 위해 사용할 툴팁 객체
         * @config tooltip
         * @type {Rui.ui.grid.LTooltip}
         * @default true
         */
        /**
         * @description 그리드에 툴팁을 표시하기 위해 사용할 툴팁 객체
         * @property tooltip
         * @protected
         * @type {Rui.ui.grid.LTooltip}
         */
        tooltip: null,
        /**
         * @description 그리드의 이벤트를 bubble 처리를 할지 여부를 결정한다.
         * @config stopEventBubble
         * @type {boolean}
         * @default true
         */
        /**
         * @description 그리드의 이벤트를 bubble 처리를 할지 여부를 결정한다.
         * @property stopEventBubble
         * @protected
         * @type {boolean}
         */
        stopEventBubble: false,
         /**
         * @description 그리드의 mouse관련 이벤트를 활성화 할지 여부를 결정
         * @config mouseEvent
         * @type {boolean}
         * @default false
         */
        /**
         * @description 그리드의 mouse관련 이벤트를 활성화 할지 여부를 결정
         * @property mouseEvent
         * @protected
         * @type {boolean}
         */
        mouseEvent: false,
        /**
         * @description 복사/붙여넣기시 그리드의 가상 랜더링 기준으로 복사할지 여부를 결정한다. (false면 DataSet기준, true면 가상 랜더링 기준)
         * @config virtualClipboard
         * @type {boolean}
         * @default true
         */
        /**
         * @description 복사/붙여넣기시 그리드의 가상 랜더링 기준으로 복사할지 여부를 결정한다. (false면 DataSet기준, true면 가상 랜더링 기준)
         * @property virtualClipboard
         * @protected
         * @type {boolean}
         */
        virtualClipboard: true,
        /**
         * @description 그리드를 감싸고 있는 HTML Element(td?)등이 %로 처리되면 view의 width가 변경될 경우 %가 바뀌므로
         *     contentResized 이벤트가 발생하여 무한 반복되면서 그리드 사이즈가 계속 늘거나 줄어듬. 퍼센트에 영향을 안 반게 하기 위해 13이라는 임의수 숫자를 적용함.
         * @property contentResizeWidth
         * @private
         * @type {int}
         */
        contentResizeWidth: -1,
        /**
         * @description multiLine이 들어가 있는 컬럼의 editor는 height를 30을 더 높게 출력한다.
         * @config multiLineEditor
         * @type {boolean}
         * @default false
         */
        /**
         * @description multiLine이 들어가 있는 컬럼의 editor는 height를 30을 더 높게 출력한다.
         * @property multiLineEditor
         * @protected
         * @type {boolean}
         */
        multiLineEditor: false,
        /**
          * @description copy&paste 수행시 클립보드를 띄울지 여부를 결정한다.
          * @config useClipboard
          * @type {boolean}
          * @default false
          */
         /**
          * @description copy&paste 수행시 클립보드를 띄울지 여부를 결정한다.
          * @property useClipboard
          * @protected
          * @type {boolean}
          */
        useClipboard: true,
        clipValue: null,
        /**
         * @description multi cell을 선택한 후 delete key로 데이터를 삭제할 수 있는지 여부를 결정한다.
         * @config useMultiCellDeletable
         * @type {boolean}
         * @default false
         */
        /**
         * @description multi cell을 선택한 후 delete key로 데이터를 삭제할 수 있는지 여부를 결정한다.
         * @property useMultiCellDeletable
         * @protected
         * @type {boolean}
         */
        useMultiCellDeletable: false,
        /**
         * @description paste 이벤트에서 cell단위 paste 이벤트를 발생할 지 여부를 결정한다.(true 로 하면 이벤트가 발생하나 성능이 떨어진다.)
         * @config usePasteCellEvent
         * @type {boolean}
         * @default false
         */
        /**
         * @description usePasteCellEvent
         * @property usePasteCellEvent
         * @protected
         * @type {boolean}
         */
        usePasteCellEvent: false,
        /**
         * @description paste 기능을 활성화 할지 여부를 결정한다.
         * @config usePaste
         * @type {boolean}
         * @default true
         */
        /**
         * @description paste 기능을 활성화 할지 여부를 결정한다.
         * @property usePaste
         * @protected
         * @type {boolean}
         */
        usePaste: true,
        /**
         * @description 오른쪽 마우스를 클릭할때 action menu가 활성화될지 여부
         * @config useRightActionMenu
         * @type {boolean}
         * @default true
         */
        /**
         * @description 오른쪽 마우스를 클릭할때 action menu가 활성화될지 여부
         * @property useRightActionMenu
         * @protected
         * @type {boolean}
         */
        useRightActionMenu: true,
        /**
         * @description Tablet 모드를 적용할지 여부를 결정한다.
         * @config tabletMode
         * @type {boolean}
         * @default true
         */
        /**
         * @description Tablet 모드를 적용할지 여부를 결정한다.
         * @property tabletMode
         * @protected
         * @type {boolean}
         */
        tabletMode: true,
        /**
         * @description Tablet 모드를 출력할 tabletViewer의 url를 지정한다.
         * @config tabletViewerUrl
         * @type {String}
         * @default null
         */
        /**
         * @description Tablet 모드를 출력할 tabletViewer의 url를 지정한다.
         * @property tabletViewerUrl
         * @protected
         * @type {String}
         */
        tabletViewerUrl: null,
        /**
         * @description 그리드에서 Ctrl Key를 이용하여 쉘을 선택할지 여부를 결정한다.
         * @config enableCtrlKey
         * @type {Boolean}
         * @default true
         */
        /**
         * @description 그리드에서 Ctrl Key를 이용하여 쉘을 선택할지 여부를 결정한다.
         * @property enableCtrlKey
         * @protected
         * @type {Boolean}
         */
        enableCtrlKey: true,
        /**
         * @description 그리드에서 Shift Key를 이용하여 쉘을 선택할지 여부를 결정한다.
         * @config enableShiftKey
         * @type {Boolean}
         * @default null
         */
        /**
         * @description 그리드에서 Shift Key를 이용하여 쉘을 선택할지 여부를 결정한다.
         * @property enableShiftKey
         * @protected
         * @type {Boolean}
         */
        enableShiftKey: true,
        /**
         * @description DOM ID를 동적으로 생성할때 참조하는 내부 Grid 최상단 Panel ID
         * @property gridId
         * @private
         * @type {String}
         */
        gridId: null,
        /**
         * @description LBufferGridView의 DataSet과 sync 여부 객체
         * @config syncDataSet
         * @type {boolean}
         * @default true
         */
        /**
         * @description LBufferGridView의 load message
         * @config loadingMessage
         * @type {String}
         * @default 'Loading...'
         */
        /**
         * @description LBufferGridView의 empty data message의 메시지코드
         * @config emptyDataMessageCode
         * @sample default
         * @type {String}
         * @default '$.base.msg115'
         */
        /**
         * @description LBufferGridView의 scroller 설정값 { scrollbar: 'y' }
         * @config scrollerConfig
         * @sample default
         * @type {Object}
         * @default null
         */
        /**
         * @description LBufferGridView의 그리드가 render시 row와 cell render event를 skip할지 여부(성능과 연관되므로 대량건 처리시는 false로 처리)
         * @config skipRowCellEvent
         * @type {boolean}
         * @default true
         */
        /**
         * @description LBufferGridView의 그리드를 몇초간격으로 랜더링할지 시간(밀리세컨드)
         * @config renderTime
         * @type {int}
         * @default 50
         */
        /**
         * @description LBufferGridView의 그리드의 데이터를 몇초간격으로 랜더링할지 시간(밀리세컨드)
         * @config renderDataTime
         * @type {int}
         * @default 50
         */
        /**
         * @description LBufferGridView의 행단위 렌더링 맥스값, 한번 스크롤에 limit이상 scroll되면 page단위 렌더링이 일어나며,
         * scrollTimetout값에 따라서 page rendering이 skip될 수 있다.
         * @config rowRenderingLimit
         * @type {int}
         * @default 10
         */
        /**
         * @description LBufferGridView의 page rendering이 지정한 시간내에 두번 이상 발생하면 skip된다.
         * @config scrollTimeout
         * @type {int}
         * @default 20
         */
         /**
          * @description row 의 css가 editable이 적용될시 사용하는 CSS값
          * @property CLASS_GRID_ROW_EDITABLE
          * @protected
          * @type {String}
          */
        CLASS_GRID_ROW_EDITABLE: 'L-grid-row-editable',
        /**
         * @description cell 의 css가 editable이 적용될시 사용하는 CSS값
         * @property CLASS_GRID_CELL_EDITABLE
         * @protected
         * @type {String}
         */
        CLASS_GRID_CELL_EDITABLE: 'L-grid-cell-editable',
        /**
         * @description 객체를 초기화하는 메소드
         * @method initComponent
         * @protected
         * @param {Object} config 환경정보 객체
         * @return {void}
         */
        initComponent: function(config){
            Rui.ui.grid.LGridPanel.superclass.initComponent.call(this);
            this.columnModel.gridPanel = this;
            if (config) {
                this.cfg.applyConfig(config, true);
            }
        },
        /**
         * Initializes the custom events for Dialog which are fired
         * automatically at appropriate times by the Dialog class.
         * @method initEvents
         * @protected
         */
        initEvents: function () {
            Rui.ui.grid.LGridPanel.superclass.initEvents.call(this);
            //this.on('beforeRender', this._onSetBody, this, true);
            this.on('headerMouseDown', this.onApplyStopEditor, this, true);
            this.on('headerClick', this.onApplyStopEditor, this, true);
        },
        /**
         * @description render시 호출되는 메소드
         * @method doRender
         * @protected
         * @param {HTMLElement} container 부모 객체
         * @return {void}
         */
        doRender: function(container) {
            Rui.ui.grid.LGridPanel.superclass.doRender.call(this, container);

            this.fireEvent('beforeInit', {target: this});
            Dom.addClass(this.element, 'L-grid-panel');

            this._insertBody('');

            //header footer가 먼저 render 되어야 gridview에서 height를 계산할 수 있다.
            var view = this.getView();
            //buffered grid의 onRowPosChanged event가 먼저 작동해야 하므로 view.render 이후에 selection model 탑제
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

            //config.width가 render후에 발생하므로,
            //render시 header/scroller width에 의해 width가 늘어난 상태에서 계산하므로 원하는 width가 생성되지 않는다.
            //따라서 render전에 config.width/height/fillHeight 처리를 해야한다.
            this.updateSizes();

            //var footerHeight = this.footer ? this.footer.offsetHeight : 0;
            if(this.footerBar)
                this.footerBar.init(this);

            if(this.autoHeight) {
                this.availableHeight(this.autoHeightParentId);
                this.fillHeight();
            }
            if(view.fitContentHeight !== true) {
                var gridHeight = Rui.get(this.body).getHeight();// - footerHeight;
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

            //100%일 경우 필요.
            if (!this.reMon && this.autoWidth === true) {
                this.reMon = new Rui.util.LResizeMonitor();
                this.reMon.monitor(this.element);
                // 처음 랜더링시 ie일 경우 초기 스크롤이 생성되면 이벤트 발생하지 않음.
                this.reMon.on('contentResized',this.onContentResized, this, true);
            }
            //최종 load후 한번더 셋팅.  안맞는 부분이 있는듯.
            // window의 scroller가 생겨도 ie에서는 window resize 이벤트가 발생하지 않아 아래의 코딩이 필요함.
            if(this.autoWidth === true) {
                if(Rui.browser.msie)
                    Rui.later(1000, this, this._onContentResized);
            }

            if(!this.actionMenuGrid) this.actionMenuGrid = Rui.ui.LActionMenuSupport.createActionMenu(this);
            view = null;
        },
        /**
         * @description render후 호출되는 메소드
         * @method afterRender
         * @protected
         * @param {HTMLElement} container 부모 객체
         * @return {void}
         */
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
                    var css = e.css;//, row = e.row, record = e.record;
                    css.push(this.CLASS_GRID_ROW_EDITABLE);
                }, this, true);
            }

            view.on('blur', this.onViewBlur, this, true);
            view.on('redoRender',this.onRedoRender, this, true);

            this.onRedoRender();

            //view.on('bodyScroll', this.onBodyScroll, this, true);

            this.on('cellClick', this.onCellclick, this, true, { system: true });
            this.on('cellDblClick', this.onCelldblclick, this, true, { system: true });

            ds.on('canRowPosChange', this.onApplyStopEditor, this, true, { system: true });
            this.initColumns();

            Rui.devGuide(this, 'LGridPanel_afterRender');
            view = ds = null;
        },
        /**
         * @description this.body에 이벤트를 탑재한다.
         * @protected
         * @method initBodyEvent
         * @return {void}
         */
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
        /**
         * @description paste 이벤트 발생시 호출되는 메소드
         * @method onClick
         * @protected
         * @param {Object} e Event 객체
         * @return {void}
         */
        onPaste: function(e) {
            this.stopEditor(false);
            this.clipboardToLoad(false, e);
        },
        _onContentResized: function() {
            this.onContentResized();
        },
        /**
         * @description buffer view에 redoRender 이벤트 발생시 호출되는 메소드
         * @method onRedoRender
         * @protected
         * @param {Object} e Event 객체
         * @return {void}
         */
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
        /**
         * @description autoWidth === true시 gridView header, scroller width 재계산 용도
         * @protected
         * @method onContentResized
         * @return {void}
         */
        onContentResized: function(e){
            // 컨텐츠 부모 % 적용에 따른 size 무한 변경 문제 방지
            this.contentResizeCount = this.contentResizeCount || 0;
            if(this.contentResizeCount == 0)
                this.contentResizeModifiedTime = new Date();
            var compareTime = (new Date().getTime() - this.contentResizeModifiedTime.getTime());
            if(compareTime < 1000) this.contentResizeCount++;
            else this.contentResizeCount = 0;
            if(this.contentResizeCount > 10) {
                Rui.devGuide(this, 'LGridPanel_onContentResized');
                return;
            }

            if(this.reMon) this.reMon.resizeLock = true;
            this.updateWidth();

            var view  = this.getView();
            if(this.width && view._rendered) {
                // 그리드를 감싸고 있는 HTML Element(td?)등이 %로 처리되면 view의 width가 변경될 경우 %가 바뀌므로
                // contentResized 이벤트가 발생하여 무한 반복되면서 그리드 사이즈가 계속 늘거나 줄어듬. 퍼센트에 영향을 안 반게 하기 위해 13이라는 임의수 숫자를 적용함.
                var width = this.width;
                if(this.oldWidth != width && Math.abs(this.oldWidth - width) > this.contentResizeWidth)
                    view.setWidth(this.width);

                this.updateColumnsAutoWidth();
            }

            //content가 resize되는 것은 hidden상태에서 show로 바뀌는 것이므로 height도 계산을 해야 한다.
            this.fillHeight();
            //this.stopEditor(false);
            this.fireEvent('widthResize', {
                target: this,
                event: e
            });
            if(this.reMon) this.reMon.resizeLock = false;
            view = null;
        },
        /**
         * @description Grid view에 redoRender가 발생하면 호출되는 메소드
         * @method doRedoRender
         * @protected
         * @return {void}
         */
        doRedoRender: function() {
            this.editorToFragment();
        },
        /**
         * @description selection model을 리턴하는 메소드
         * @method getSelectionModel
         * @sample default
         * @return {Rui.ui.grid.LSelectionModel}
         */
        getSelectionModel: function() {
            if(this.selectionModel == null) {
                this.selectionModel = new Rui.ui.grid.LSelectionModel();
            }
            return this.selectionModel;
        },

        // private
        invokeEvent: function(name, e){
            //if(e.target && e.target.className && e.target.className.indexOf('L-ignore-event') > -1) return;
            //좌표 찾기, 클릭한 지점의 셀 좌표 시작 xy찾기
            this.fireEvent(name.toLowerCase(), e);
//            var t = e.target;
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
        /**
         * @description click 이벤트 발생시 호출되는 메소드
         * @method onClick
         * @protected
         * @param {Object} e Event 객체
         * @return {void}
         */
        onClick: function(e){
            this.invokeEvent('click', e);
        },
        /**
         * @description mousedown 이벤트 발생시 호출되는 메소드
         * @method onMouseDown
         * @protected
         * @param {Object} e Event 객체
         * @return {void}
         */
        onMouseDown: function(e){
            this.invokeEvent('mouseDown', e);
        },
        /**
         * @description mouseup 이벤트 발생시 호출되는 메소드
         * @method onMouseUp
         * @protected
         * @param {Object} e Event 객체
         * @return {void}
         */
        onMouseUp: function(e){
            this.invokeEvent('mouseUp', e);
        },
        /**
         * @description mouseover 이벤트 발생시 호출되는 메소드
         * @method onMouseOver
         * @protected
         * @param {Object} e Event 객체
         * @return {void}
         */
        onMouseOver: function(e){
            this.invokeEvent('mouseOver', e);
        },
        /**
         * @description mouseout 이벤트 발생시 호출되는 메소드
         * @method onMouseOut
         * @protected
         * @param {Object} e Event 객체
         * @return {void}
         */
        onMouseOut: function(e){
            this.invokeEvent('mouseOut', e);
        },
        /**
         * @description contextmenu 이벤트 발생시 호출되는 메소드
         * @method onContextMenu
         * @protected
         * @param {Object} e Event 객체
         * @return {void}
         */
        onContextMenu: function(e, t){
            this.invokeEvent('contextMenu', e);
        },
        /**
         * @description dblclick 이벤트 발생시 호출되는 메소드
         * @method onDblClick
         * @protected
         * @param {Object} e Event 객체
         * @return {void}
         */
        onDblClick: function(e){
            this.invokeEvent('dblClick', e);
        },
        /**
         * @description keydown 이벤트 발생시 호출되는 메소드
         * @method onKeyDown
         * @protected
         * @param {Object} e Event 객체
         * @return {void}
         */
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
        /**
         * @description keypress 이벤트 발생시 호출되는 메소드
         * @method onKeypress
         * @protected
         * @param {Object} e Event 객체
         * @return {void}
         */
        onKeypress: function(e) {
            this.invokeEvent('keypress', e);
        },
        /**
         * @description cellClick 이벤트 발생시 호출되는 메소드
         * @method onCellclick
         * @protected
         * @param {Object} e Event 객체
         * @return {void}
         */
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
        /**
         * @description footer를 변경한다.
         * @method setFooter
         * @return {void}
         */
        setFooter: function (footerContent) {
            Rui.ui.grid.LGridPanel.superclass.setFooter.call(this, footerContent);
            if(this._rendered && this.footer)
                this.updateViewHeight(this.cfg.getProperty('height') - this.footer.offsetHeight);
        },
        /**
         * LGridPanel Size를 재계산
         * @method updateSizes
         * @protected
         * @return {void}
         */
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
                    width = width - borderWidth;//border를 뺀다.
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
                        // TODO 크롬 43 버전 버그로 인해 css에서 javascript로 처리
                        if(!Rui.browser.chrome) bd.setStyle('overflow', 'hidden');
                    }
                    hd = ft = bd = null;
                }
            }

            var height = this.cfg.getProperty('height');
            if (height) {
                el.setHeight(height);
                //ie6에서 하단 선이 안나오는 버그 해결.  border width 고려 필요.
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
        /**
         * LGridPanel autoWidth === true일 경우 동작  IE의 size 안 줄어드는 버그 해결.
         * @method updateWidth
         * @protected
         * @return {int} width값
         */
        updateWidth: function(){
            //100%일 경우 이상증상으로 overflow되어 panel right border가 가려짐.  100%때의 width로 설정하면 해결됨.
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
                    // TODO 크롬 43 버전 버그로 인해 css에서 javascript로 처리
                    if(!Rui.browser.chrome) bd.setStyle('overflow', 'hidden');
                    //border 빼기, 안빼면 content resize 무한 루프
                    //width = bd.getWidth()-(this.borderWidth*2);
                    //Rui.get(this.element.firstChild).setWidth(width);
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
                /*
                if (width > 0) {
                    if (hd)
                        hd.setWidth(width);
                    if (ft)
                        ft.setWidth(width);
                    if (bd)
                        bd.setWidth(width);
                }
                */
            }
            return width;
        },

        /**
         * Overlay fillHeight에서 container = this.element || this.innerElement, this.element가 우선이 되도록 순서 변경. panel을 height를 부모의 나머지 공간까지 채우는 메소드
         * @method fillHeight
         * @protected
         * @param {HTMLElement} el The element which should be resized to fill out the height of the container element.
         */
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
                        // Need to set height to 0, to allow height to be reduced
                        if(view.fitContentHeight !== true)
                            Dom.setStyle(el, 'height', 0 + 'px');
                    }

                    total = this._getComputedHeight(container);

                    // Fallback, if we can't get computed value for content height
                    if (total === null) {
                        Dom.addClass(container, "L-override-padding");
                        total = container.clientHeight; // Content, No Border, 0 Padding (set by L-override-padding)
                        Dom.removeClass(container, "L-override-padding");
                    }
                    var elBorderWidth = 0; //this.el.getBorderWidth('tb');
                    remaining = total - filled - elBorderWidth;//border를 빼줘야 한다.
                    remaining = remaining < 0 ? 0 : remaining;

                    if(view.fitContentHeight !== true) {
                        Dom.setStyle(el, "height", remaining + "px");
                    }

                    // Re-adjust height if required, to account for el padding and border
                    //rendering 방식의 변화로 offsetHeight를 구할 수 없음.  body rendering은 나중에 이루어지기 때문, 0일때 계산하지 않음
                    /*if (el.offsetHeight != 0 && el.offsetHeight != remaining) {
                        remaining = remaining - (el.offsetHeight - remaining);
                        Dom.setStyle(el, "height", remaining + "px");
                    }*/
                }
                container = containerEls = containerEl = null;
            }
            el = null;
        },
        /**
         * @description 부모의 dom 객체를 기준으로 height 100%으로 채운다.
         * @method availableHeight
         * @param {String|HTMLElement} parentId [optional] 기준이 되는 부모 객체의 id나 dom
         * @param {int} margin [optional] 추가 여유 공간을 확보하기 위해 마이너스할 높이
         * @return {void}
         */
        availableHeight: function(parentId, margin) {
            var wrapperEl = Rui.get(this.element);
            if(parentId)
                wrapperEl.setHeight(Rui.get(parentId).getHeight());
            else
                wrapperEl.availableHeight(parentId, margin);
            //Rui.ui.grid.LGridPanel.superclass.availableHeight.call(this, parentId, margin);
            this.height = wrapperEl.getHeight();
            this.setHeight(this.height);
            this.cfg.queueProperty('height', this.height);
        },
        /*
        configHeight: function (type, args, obj) {
            var height = args[0],
                el = this.element;
            Dom.setStyle(el, 'height', height + 'px');
            this.cfg.refireEvent('iframe');
            if(this._rendered) this.updateSizes();
            this.updateViewHeight(height);
            el = null;
        },
        */

        /*
        configWidth: function (type, args, obj) {
            var width = args[0],
                el = this.element;
            var sWidth = (typeof width == 'string' && Rui.util.LString.endsWith(width, 'px'))? width: width + 'px';
            Dom.setStyle(el, 'width', sWidth);
            this.cfg.refireEvent('iframe');
            if(this._rendered) this.updateSizes();
            var view = this.getView();
            if(view._rendered)
                view.setWidth(width - (this.borderWidth * 2));
            view = el = null;
        },
        */
        /**
         * config의 height값을 적용하는 메소드
         * LPanel처럼 innerElement로 계산하면 sizing이 안된다.
         * @method _setHeight
         * @protected
         * @param {String} type 이벤트 종류 값
         * @param {Object[]} args 이벤트 인수
         * @param {Object} obj 호출할 scope 객체
         */
        _setHeight: function(type, args, obj) {
            if(this._rendered && this.height === args[0]) return;
            Rui.ui.grid.LGridPanel.superclass._setHeight.apply(this, arguments);
            if(this._rendered) this.updateSizes();
            this.updateViewHeight(this.height);

        },
        /**
         * config의 width값을 적용하는 메소드
         * @method _setWidth
         * @protected
         * @param {String} type 이벤트 종류 값
         * @param {Object[]} args 이벤트 인수
         * @param {Object} obj 호출할 scope 객체
         */
        _setWidth: function(type, args, obj) {
            if(this._rendered && this.width === args[0]) return;
            Rui.ui.grid.LGridPanel.superclass._setWidth.apply(this, arguments);
            if(this._rendered) this.updateSizes();
        },
        /**
         * @description 엘리먼트의 넓이를 설정한다.
         * @method setWidth
         * @public
         * @param {int} width 새로운 넓이.
         * @return {void}
         */
        setWidth: function(width){
            if(this.cfg.getProperty('width') == width) return;
            this.cfg.setProperty('width', width);
        },
        /**
         * 엘리먼트의 높이를 설정한다.
         * @method setHeight
         * @param {int} height 새로운 높이.
         * @return {void}
         */
        setHeight: function(height){
            if(this.cfg.getProperty('height') == height) return;
            this.cfg.setProperty('height', height);
        },
        /**
         * @description LGridView를 리턴하는 메소드
         * @method updateViewHeight
         * @protected
         * @return {Rui.ui.grid.LGridView}
         */
        updateViewHeight: function(height) {
            var footerHeight = this.footer ? this.footer.offsetHeight : 0;
            var view = this.getView();
            if(view.fitContentHeight !== true) {
                var elBorderWidth = this.el.getBorderWidth('tb');
                view.setHeight(height - elBorderWidth - footerHeight);
            }
        },
        /**
         * @description grid panel border width
         * @method getBorderWidth
         * @public
         * @return {int}
         */
        getBorderWidth: function() {
            return this.borderWidth;
        },
        /**
         * @description cell 강제 선택하는 메소드
         * @method selectCell
         * @param {int} row row 위치
         * @param {int|String} col col 위치
         * @param {boolean} edit edit 여부
         * @return {boolean}
         */
        selectCell: function(row, col, edit){
            if(edit === true) this.systemSelect = true;
            var isMove = this.doSelectCell(row, col, edit);
            if(isMove === true && edit === true)
                this.focusRow();
            this.systemSelect = false;
            return isMove;
        },
        /**
         * @description cell 강제 선택하는 메소드
         * @method doSelectCell
         * @protected
         * @param {int} row row 위치
         * @param {int|String} col col 위치
         * @param {boolean} edit edit 여부
         * @return {boolean}
         */
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
                //sm.currentCol = col;
                sm._processSelectCell = true;
                moveRow = ds.setRow(row);
                delete sm.isMoveCell;
                delete sm._processSelectCell;
            }
            var isSelect = false;
            //if(this.systemSelect) {
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
            //}
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
        /**
         * @description celldbclick 이벤트 발생시 호출되는 메소드
         * @method onCelldblclick
         * @protected
         * @param {Object} e Event 객체
         * @return {void}
         */
        onCelldblclick: function(e) {
            if (e.event.shiftKey !== true && e.event.ctrlKey !== true && !this.getSelectionModel().isLocked()) {
                if(this.systemSelect && this.doSelectCell(e.row, e.col, true) === true) Ev.stopEvent(e);
                this.systemSelect = true;
            }
        },
        /**
         * @description columnResize 이벤트 발생시 호출되는 메소드
         * @method onColumnResize
         * @protected
         * @param {Object} e Event 객체
         * @return {void}
         */
        onColumnResize: function(e) {
            this.stopEditor(true);
            this.editorToFragment();
        },
        /**
         * @description columnMove 이벤트 발생시 호출되는 메소드
         * @method onColumnMove
         * @protected
         * @param {Object} e Event 객체
         * @return {void}
         */
        onColumnMove: function(e) {
            this.stopEditor(true);
            this.editorToFragment();
        },
        /**
         * @description columnsChanged 이벤트 발생시 호출되는 메소드
         * @method onColumnsChanged
         * @protected
         * @param {Object} e Event 객체
         * @return {void}
         */
        onColumnsChanged: function(e) {
            this.stopEditor(true);
            this.editorToFragment();
        },
        /**
         * @description editor에서 changed 이벤트 발생시 호출되는 메소드
         * @method onEditorChanged
         * @protected
         * @param {Object} e Event 객체
         * @return {void}
         */
        onEditorChanged: function(e) {
            var sm = this.getSelectionModel();
            if(this.isEdit) this.applyValue(sm.getRow(), sm.getCol(), true, false);
            sm = null;
        },
        /**
         * @description editor에서 blur 이벤트 발생시 호출되는 메소드
         * @method onEditorBlur
         * @protected
         * @param {Object} e Event 객체
         * @return {void}
         */
        onEditorBlur: function(e) {
            var target = e;
            if (this.stopEditor(true) == false) {
                target.focus();
            } else {
                this.selectionModel.unlock();
                //this.focusRow();
            }
            target = null;
            delete this._applyValue;
        },
        /**
         * @description editor 수행된후에 dataSet의 값이 변경되면 호출되는 메소드
         * @method onDataSetChanged
         * @protected
         * @param {Object} e Event 객체
         * @return {void}
         */
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
        /**
         * @description copy paste를 판단하는 이벤트
         * @method onCopyPaste
         * @protected
         * @param {Object} e Event 객체
         * @return {void}
         */
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
        /**
         * @description 데이터를 클립보드로 복사한다.
         * @method dataToClipboard
         * @return {void}
         */
        dataToClipboard: function(localData) {
            var selection = this.selectionModel.getSelection();
            var view = this.getView();
            var dataSet = view.getDataSet();
            try {
                // copy
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
        /**
         * @description 클립보드의 데이터를 적용한다.
         * @method clipboardToLoad
         * @return {void}
         */
        clipboardToLoad: function(localData, e) {
            if(this.usePaste === false) return;
            // paste
            var value = null;
            if(localData) {
                if(Rui._clipboardData) this.setClipData(Rui._clipboardData);
            } else {
                if (Rui.browser.msie) { // 비동기 메시지 처리를 위해 로직 분리함
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
        /**
         * @description 클립보드 데이터를 그리드에 반영
         * @method setClipData
         * @protected
         * @param {String} clipboard data
         * @param {Object} LGridView
         * @return {void}
         */
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
                        //var cellEditable = cm.getCellConfig(row, column.id, 'editable');
                        if(!column) continue;
                        var id = column.field || column.id;
                        if(!id) continue;
                        //if(!(Rui.isUndefined(cellEditable) ? column.editable : cellEditable )) continue;
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
        /**
         * @description dataSet과 sync상태를 셋팅하는 메소드 (대량 변경건 처리시 사용)
         * @method setSyncDataSet
         * @sample default
         * @param {boolean} isSync isSync값
         * @return {void}
         */
        setSyncDataSet: function(isSync) {
            this.getView().setSyncDataSet(isSync);
        },
        /**
         * @description 데이터셋을 변경하는 메소드
         * @method setDataSet
         * @sample default
         * @param {Rui.data.LDataSet} dataSet 반영할 데이터셋
         * @return {void}
         */
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
        /**
         * @description cell config 정보를 설정한다.
         * @method setCellConfig
         * @public
         * @sample default
         * @param {int} row row 위치
         * @param {String} colId col id
         * @param {String} key config 키
         * @param {Object} value config 값
         * @return {void}
         */
        setCellConfig: function(row, colId, key, val) {
            this.columnModel.setCellConfig(row, colId, key, val);
        },
        /**
         * @description 현재 사용중인 editor들을 fragment로 백업한다.
         * @method editorToFragment
         * @protected
         * @return {void}
         */
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
        /**
         * @description 현재 사용중인 fragment에 있는 editor들을 editor로 복원한다.
         * @method fragmentToEditor
         * @protected
         * @return {void}
         */
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
        /**
         * @description edit 상태로 시작하는 메소드
         * @method startEditor
         * @protected
         * @return {void}
         */
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
                var cellDom = view.getCellDom(row, col);    // 수정1 : getCell에서 입력되는 row, col이 merged인 경우에도 merge된 셀이 나와야 하나 현재 다른 셀이 나옴.
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
                //this.selectionModel.lock();
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
        /**
         * @description editor를 다시 실행한다.
         * @method restartEditor
         * @protected
         * @return {void}
         */
        restartEditor: function(row, col) {
            this.startEditor(row, col);
        },

        getCellRegion: function(row, col){
            try{
                var view = this.view,
                cm = view.getColumnModel();
                var rowDom;
                if(cm.isMerged()){
                    //Cell Merge를 사용할 경우는 cellDom기준이 아닌 rowDom과 header기준으로 좌표를 계산하여 editor를 랜더링 한다.
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
        /**
         * @description Editor시 키 이벤트 처리 메소드
         * @method onEditorKey
         * @protected
         * @param {Object} e Event 객체
         * @return {void}
         */
        onEditorKey: function(e) {
            var k = Rui.util.LKey.KEY;
            if(e.keyCode == k.TAB || e.keyCode == k.ESCAPE || e.keyCode == k.ENTER) {
                if(this.currentCellEditor) {
                    if(this.currentCellEditor.editor.onCanBlur.call(this.currentCellEditor.editor, e) == false) return;
                }
            }
//            var dataSet = this.dataSet;
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
                            // 이동값 계산
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
                case 70: // F
                    if(e.ctrlKey == true) {
                        this.stopEditor(false);
                        this.showSearchDialog(e);
                        Ev.stopEvent(e);
                    }
                    break;
                case 86: // paste
                    if(!editor || (editor && editor.multiLine !== true)) {
                        if (e.ctrlKey == true) {
                            if(false) {
                                if(!editor || (Rui._clipboardData && Rui._clipboardData.indexOf('\n') > -1)) {
                                    this.stopEditor(false);
                                    if(Rui._clipboardData) this.setClipData(Rui._clipboardData);
                                }
                            } else {
                                if (Rui.browser.msie) { // 비동기 메시지 처리를 위해 로직 분리함
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
        /**
         * @description Editor시 키다운 이벤트 처리 메소드
         * @method onEditorKeyDown
         * @protected
         * @param {Object} e Event 객체
         * @return {void}
         */
        onEditorKeyDown: function(e) {
            if(e.keyCode === 112) { // F1
                window.open(Rui.getRootPath() + '/docs/guide/guide.html');
                Ev.stopEvent(e);
            } else if(e.keyCode === 229) { // Z
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
        /**
         * @description edit 상태로 종료하는 메소드
         * @method stopEditor
         * @param {boolean} isApply 종료시 dataSet에 반영 여부
         * @return {void}
         */
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
            //this.selectionModel.unlock();
            return true;
        },
        /**
         * @description view 에 blur 이벤트가 발생하면 호출되는 메소드
         * @method onViewBlur
         * @protected
         * @return {void}
         */
        onViewBlur: function(e) {
            /*if(this.searchDialog)
                this.searchDialog.hide(false);*/
            this.onApplyStopEditor();
            Ev.removeListener(Rui.getBody(true), 'selectstart', this.onSelectStart, this);
        },
        onSelectStart: function(e) {
            return false;
        },
        /**
         * @description edit 상태로 종료하는 이벤트 메소드
         * @method onApplyStopEditor
         * @protected
         * @return {void}
         */
        onApplyStopEditor: function() {
            this.stopEditor(true);
        },
        /**
         * @description edit 상태로 종료하는 이벤트 메소드
         * @method onReStartEditor
         * @protected
         * @return {void}
         */
        onReStartEditor: function() {
            if(this.dtStartEditor) {
                var view = this.getView();
                var sm = this.getSelectionModel();
                Rui.later(view.renderDataTime + 10, this, this.restartEditor, [sm.getRow(), sm.getCol()]);
            }
            this.stopEditor(true);
        },
        /**
         * @description editor한 값을 반영하는 메소드
         * @method applyValue
         * @protected
         * @param {boolean} isApply 종료시 dataSet에 반영 여부
         * @param {boolean} isStopEditor Editor를 stop할지 여부
         * @return {void}
         */
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
                //var customEditor = column.customEditor;
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
                                    // this._applyValue는 changed와 blur의 두가지를 모두 처리하기 위해 필요한 변수
                                    // blur가 타임머가 존재하므로 우선순위의 계산을 못하여 데이터셋의 update이벤트에서 같은 필드에 대해서 값이 다시
                                    // 변경되면 두번째 호출될때에는 값 바뀌는 처리를 무시한다.
                                    //Rui.log('this.beforeEditorValue : ' + this.beforeEditorValue + '\r\nval : ' + val);
                                    if(Rui.isUndefined(this._applyValue) || this.beforeEditorValue != val) {
                                        this._applyValue = val;
                                        record.set(column.field, val, {system: true});
                                        this.beforeEditorValue = val;
                                    }
                                    //editor.setValue(undefined);
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
        /**
         * @description grid에서 focus되어야 할 위치 지정 메소드
         * @protected
         * @method focusRow
         * @return {void}
         */
        focusRow: function() {
            var sm = this.getSelectionModel(), view = this.getView();
            //view.onCellSelect(sm.getRow(), sm.getCol());
            if(this.isEdit) {
                this.currentCellEditor.focus();
            } else {
                view.focusRow(sm.getRow(), sm.getCol());
            }
            view = sm = null;
        },
        /**
         * @description 객체의 editable 값을 셋팅하는 메소드
         * @method setEditable
         * @param {boolean} editable editable값
         * @return {void}
         */
        setEditable: function(editable) {
            this.editable = editable;
            if(this.view) this.view.updateEditable(editable);
        },
        /**
         * @description 객체의 editable값을 리턴하는 메소드
         * @method isEditable
         * @return {boolean}
         */
        isEditable: function() {
            return this.editable;
        },
        /**
         * @description gridview를 리턴하는 메소드
         * @method getView
         * @return {Rui.ui.grid.LGridView}
         */
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
        /**
         * @description row model을 리턴하는 메소드
         * @method getRowModel
         * @return {Rui.ui.grid.LRowModel}
         */
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
        /**
         * @description grid의 row edit view를 리턴하는 메소드
         * @method getEditView
         * @protected
         * @return {Rui.LElement}
         */
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
        /**
         * @description Column 객체들을 초기화 한다.
         * @method initColumns
         * @protected
         * @return {void}
         */
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
        /**
         * @description Column 객체들을 hidden시 백업한다.
         * @method onColumnHidden
         * @protected
         * @return {void}
         */
        onColumnHidden: function(e) {
            this.editorToFragment();
        },
        /**
         * @description 검색 dialog를 출력한다.
         * @method showSearchDialog
         * @return {void}
         */
        showSearchDialog: function(e) {
            if(!this.searchDialog) {
                var ds = this.dataSet;
                var sm = this.getSelectionModel();
                var cm = this.columnModel;
                var view = this.getView();
                var grid = this;
                var bodyHtml = '<div class="L-title">Find in column.</div>';
                /*
                 * 2차 기능 개선때는 전체검색, like,startsWith, endsWith, 개발자 find 이벤트 추가
                bodyHtml += '<div class="L-condition" style="display:none;">';
                bodyHtml += '<input type="radio" name="condition" value="A" checked><label>전체컬럼</label>';
                bodyHtml += '<input type="radio" name="condition" value="C"><label>선택컬럼만</label>';*/
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
        /**
         * selected된 cell의 데이터를 삭제한다.
         * @method multiCellDeletable
         * @protected
         * @return {void}
         */
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
        /**
         * @description column의 width를 그리드의 width 맞게 변경한다.
         * @method updateColumnsAutoWidth
         * @return {void}
         */
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
        /**
         * DOM에서 패널 엘리먼트를 제거하고 모든 자식 엘리먼트들을 null로 설정한다.
         * @method destroy
         * @return {void}
         */
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
        /**
         * @description 객체를 focus한다.
         * @method focus
         * @public
         * @return {void}
         */
        focus: function() {
            var view = this.getView();
            if(view) view.focus();
            else this.el.focus();
        },
        /**
         * @description 객체를 blur한다.
         * @method blur
         * @public
         * @return {void}
         */
        blur: function() {
            var view = this.getView();
            if(view) view.blur();
            else this.el.blur();
        },
        /**
         * @description Tablet뷰어로 그리드를 출력합니다.
         * @method showTabletViewer
         * @public
         * @return {void}
         */
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
        /**
         * @description Tablet뷰어를 닫습니다.
         * @method closeTabletViewer
         * @public
         * @return {void}
         */
        closeTabletViewer: function() {
            delete Rui._tabletData;
            this.tabletViewerEl.remove();
            delete Rui._tabletViewerEl;
            Rui._tabletViewerEl = null;
            Rui.getBody().setStyle('overflow', this.oldOverflow);
            delete this.oldOverflow;
            clearInterval(this.resizeTabletViewer);
        },
        /**
         * @description 객체의 toString
         * @method toString
         * @public
         * @return {String}
         */
        toString: function() {
            return 'Rui.ui.grid.LGridPanel ' + this.id;
        }
    });
})();
(function() {
    /**
     * @description LEditorPanel
     * @namespace Rui.ui.grid
     * @class LEditorPanel
     * @extends Rui.ui.LUIComponent
     * @protected
     * @constructor LEditorPanel
     * @param {Object} oConfig The intial LEditorPanel.
     */
    Rui.ui.grid.LEditorPanel = function(oConfig) {
        var config = oConfig || {};
        Rui.ui.grid.LEditorPanel.superclass.constructor.call(this, config);
        config = null;
    };

//    var Dom = Rui.util.LDom;
//    var Ev = Rui.util.LEvent;

    Rui.extend(Rui.ui.grid.LEditorPanel, Rui.ui.LUIComponent, {
        otype: 'Rui.ui.grid.LEditorPanel',
        /**
         * @description editor 속성
         * @config editor
         * @type {Object}
         * @default null
         */
        /**
         * @description editor 속성
         * @property editor
         * @private
         * @type {Object}
         */
        editor: null,
        /**
         * @description column 속성
         * @config otype
         * @type {Rui.ui.grid.LColumn}
         * @default null
         */
        /**
         * @description column 속성
         * @property otype
         * @private
         * @type {Rui.ui.grid.LColumn}
         */
        column:null,
        /**
         * @description grid view 속성
         * @property view
         * @private
         * @type {Rui.ui.grid.LGridView}
         */
        view:null,
        /**
         * @description render후 호출되는 메소드
         * @method afterRender
         * @protected
         * @param {HTMLElement} container 부모 객체
         * @return {void}
         */
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
        /**
         * @description editor의 region값을 셋팅하는 메소드
         * @method setRegion
         * @param {Rui.util.LRegion} region region값
         * @return {void}
         */
        setRegion: function(region) {
            var editor = this.column.getEditor();
            //region.top = region.top - 2;

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

/**
 * @description LGridScroller
 * @namespace Rui.ui.grid
 * @class LGridScroller
 * @extends Rui.ui.LUIComponent
 * @constructor LGridScroller
 * @param {Object} config LGridScroller의 초기 설정값
 */
Rui.ui.grid.LGridScroller = function(config){
    config = config || {};
    config = Rui.applyIf(config, Rui.getConfig().getFirst('$.ext.gridScroller.defaultProperties'));
    Rui.ui.grid.LGridScroller.superclass.constructor.call(this, config);
};

Rui.extend(Rui.ui.grid.LGridScroller, Rui.ui.LScroller, {
    /**
     * @description 객체의 이름
     * @property otype
     * @private
     * @type {String}
     */
    otype: 'Rui.ui.grid.LGridScroller',
    /**
     * @description y스크롤바의 상하 스크롤 버튼을 제어하여 한번에 한개의 row씩만 스크롤할 수 있도록 한다.
     * @config manageSteps
     * @type {boolean}
     * @default true
     */
    /**
     * @description y스크롤바의 상하 스크롤 버튼을 제어하여 한번에 한개의 row씩만 스크롤할 수 있도록 한다.
     * @property manageSteps
     * @private
     * @type {boolean}
     * @default true
     */
    manageSteps: true,
    /**
     * @description 마우스 상하 스크롤 한 단위에 이동할 row수
     * @config scrollStep
     * @type {int}
     * @default 1
     */
    /**
     * @description 마우스 상하 스크롤 한 단위에 이동할 row수
     * @property scrollStep
     * @private
     * @type {int}
     * @default 1
     */
    scrollStep: 1,
    /**
     * @description 마우스 상하 휠스크롤 한 단위에 이동할 row수
     * @config wheelStep
     * @type {int}
     * @default 2
     */
    /**
     * @description 마우스 상하 휠스크롤 한 단위에 이동할 row수
     * @property wheelStep
     * @private
     * @type {int}
     * @default 2
     */
    wheelStep: 1,
    /**
     * @description 가상의 content를 scroll, scrollY event를 처리해야 한다.
     * @property useVirtual
     * @private
     * @type {boolean}
     * @default true
     */
    useVirtual: true,
    /**
     * @description 그리드의 데이터 row 갯수
     * @property scrollCount
     * @private
     * @type {int}
     * @default 0
     */
    scrollCount: 0,
    /**
     * @description Dom객체 생성 및 초기화하는 메소드
     * @method initComponent
     * @protected
     * @param {Object} config 환경정보 객체 
     * @return {void}
     */
    initComponent: function(config){
        Rui.ui.grid.LGridScroller.superclass.initComponent.call(this, config);
        this.setSizes(this.scrollCount, this.scrollStep, this.wheelStep);
    },
    /**
     * @description render시 호출되는 메소드
     * @method doRender
     * @private
     * @return {void}
     */
    doRender: function(){
        this.scrollEl = Rui.get(this.createElement());
        this.scrollEl.addClass('L-scroll');
        Rui.get(this.el.dom.firstChild).insertBefore(this.scrollEl);
        this.scrollEl.appendChild(this.contentEl);
        
        this.setupSizes();
        
        this.scrollTop = 0;
    },
    /**
     * @description X, Y scrollbar를 생성한다.
     * @method setupScrollbars
     * @private
     * @return {void}
     */
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
    /**
     * @description resize등에 따른 size 조정하기
     * @method setupSizes
     * @private
     * @return {void}
     */
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
    /**
     * @description grid scroller의 값들을 설정 또는 재설정 한다.
     * @method setSizes
     * @protected
     * @param {int} scrollCount
     * @param {int} scrollStep [optional]
     * @param {int} wheelStep [optional]
     * @param {int} touchScrollStep [optional]
     * @return {void}
     */
    setSizes: function(scrollCount, scrollStep, wheelStep, touchScrollStep){
        this.scrollCount = scrollCount;
        var height = 40;
        if(Rui.browser.msie){
            //msie의 경우 scrollCount가 없더라도 1로 가정하여 height을 10으로 사용하도록 함.
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
        //this.scrollTop = 0;
    },
    /**
     * @description 그리드에서 현재 보이는 영역 제일위에 위치 할 row의 index를 반환한다. 
     * @method getStartRow
     * @protected
     * @return {void}
     */
    getStartRow: function(){
        if(this.scrollCount < 1)
            return 0;
        var top = this.getScrollTop(),
            start = top < 1 ? 0 : Math.floor(top / this.virtualRowHeight);
        return start;
    },
    /**
     * @description L-scroll DOM의 region을 반환한다.
     * @method getScrollRegion
     * @protected
     * @return {Object}
     */
    getScrollRegion: function(){
        return this.scrollEl ? this.scrollEl.getRegion() : null;
    },
    /**
     * @description Content Height을 반환한다. 
     * margin등의 계산을 위해 wrapper를 사용할 경우는 wrapper의 height을,
     * wrapper를 사용하지 않을경우 content의 height을 반환한다.
     * @method getContentHeight
     * @private
     * @return {int}
     */
    getContentHeight: function(){
        return this.scrollCount * this.virtualRowHeight + this.getScrollHeight();
    },
    /**
     * @description Y scroller의 최대 스크롤값(scrollTop)을 반환한다.
     * @method getMaxScrollTop
     * @protected
     * @param {int} margin [optional]
     * @return {int}
     */
    getMaxScrollTop: function(margin){
        return this.getContentHeight() - this.scrollEl.getHeight(true);
    },
    /**
     * @description X scroller의 최대 스크롤값(scrollLeft)을 반환한다.
     * @method getMaxScrollLeft
     * @protected
     * @param {int} margin [optional]
     * @return {int}
     */
    getMaxScrollLeft: function(margin){
        return this.getContentWidth() - this.scrollEl.getWidth(true);
    },
    /**
     * @description scroll의 scrollTop 값을 반환
     * @method getScrollTop
     * @protected
     * @return {int}
     */
    getScrollTop: function(virtual){
        if(this.virtualScrollRate == 1 || virtual != true)
            return this.yScrollbarEl ? this.yScrollbarEl.dom.scrollTop : 0;
        else
            return this.scrollTop;
    },
    /**
     * @description scroll이 처음 위치에 있는지 여부 반환.
     * @method isStart
     * @public
     * @param {boolean} x [optional] x-scrollbar의 값을 조회하는지 여부
     * @return {int}
     */
    isStart: function(x){
        if(x)
            return this.getScrollLeft() == 0 ? true : false;
        else
            return this.getScrollTop() < this.virtualRowHeight ? true : false; 
    },
    /**
     * @description scroll이 끝 위치에 있는지 여부 반환.
     * @method isEnd
     * @public
     * @param {boolean} x [optional] x-scrollbar의 값을 조회하는지 여부
     * @return {int}
     */
    isEnd: function(x){
        if(x)
            return !this.xScrollbarEl ? true : (this.getScrollLeft() >= this.getMaxScrollLeft() ? true : false);
        else
            return !this.yScrollbarEl ? true : (this.getScrollTop() > this.getMaxScrollTop() - this.virtualRowHeight ? true : false);
    },
    /**
     * @description scroll을 원하는 위치로 이동시킨다.
     * go 함수의 경우 스크롤 위치를 기억한다. 이동되어야 할 위치가 없더라도 후에 재 랜더링 시에 이동되어야 할 위치가 확보되면 그때 이동한다.
     * @method go
     * @public
     * @param {int} 이동할 위치 px (scrollTop 또는 scrollLeft)
     * @param {boolean} x [optional] x-scrollbar를 이동할지 여부
     * @return {int}
     */
    go: function(row, x){
        var p = row * this.getStep();
        return Rui.ui.grid.LGridScroller.superclass.go.call(this, p, x);
    },
    /**
     * @description scroll의 1단위 이전 scroll 값을 반환한다.
     * @method getPrevious
     * @protected
     * @param {boolean} x [optional] x-scrollbar의 값을 조회할 지 여부
     * @return {int}
     */
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
    /**
     * @description scroll x,y 가져오기
     * @method getScroll
     * @public
     * @return {Object} coord
     */
    getScroll: function(){
        return {
            top: this.getScrollTop() / this.getStep(false),
            left: this.getScrollLeft() / this.getStep(false, true)
        };
    },
    /**
     * @description y scrollbar를 드래그 하기위해 마우스를 클릭했을 때의 이벤트
     * 이 이벤트는 Grid의 pagerMode인 경우 사용된다. pagerMode는 매 회 스크롤시마다 데이터를 서버로부터 조회하는데 이 시점을 조절하기 위해서이다. 
     * @method onYScrollbarMousedown
     * @private
     * @return {void}
     */
    onYScrollbarMousedown: function(e){
    	if(this.controlScrollbarDrag == true)
    		this._dragging = true;
    },
    /**
     * @description y scrollbar를 드래그한 후 마우스 클릭을 해제했을 때 이벤트
     * 이 이벤트는 Grid의 pagerMode인 경우 사용된다. pagerMode는 매 회 스크롤시마다 데이터를 서버로부터 조회하는데 이 시점을 조절하기 위해서이다.  
     * @method onYScrollbarMouseup
     * @private
     * @return {void}
     */
    onYScrollbarMouseup: function(e){
        if(this._dragging !== true) return;
        var scrollTop = (e && e.target) ? e.target.scrollTop : this.getScrollTop(),
            beforeScrollTop = this.scrollTop;
        scrollTop = this.virtualScrollRate * scrollTop;
        if(scrollTop !== beforeScrollTop){
            //그리드의 경우 scrollEl의 scrollTop을 이동하여 스크롤하는 방식이 아닌 버퍼드 랜더링 방식으로 스크롤 하므로 아래는 필요없음.
            //this.scrollEl.dom.scrollTop = scrollTop * this.virtualScrollRate;
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
    /**
     * @description scrollbar 버튼에서 마우스 클릭된 상태를 해제 했을 때의 핸들
     * @method onMouseup
     * @private
     * @return {void}
     */
    onMouseup: function(e){
        this.isDownClicked = false;
        Rui.util.LEvent.stopEvent(e);
    },
    /**
     * @description y scrollbar의 previous 버튼(상단)을 mouse down했을 경우의 핸들
     * 마우스를 지속적으로 누르고 있을 경우 반복 수행하는 기능을 포함한다.
     * @method onMousedownYPrev
     * @private
     * @return {void}
     */
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
    /**
     * @description y scrollbar의 next 버튼(하단)을 mouse down했을 경우의 핸들
     * 마우스를 지속적으로 누르고 있을 경우 반복 수행하는 기능을 포함한다.
     * @method onMousedownYNext
     * @private
     * @return {void}
     */
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
    /**
     * @description x scrollbar의 previous 버튼(좌측)을 mouse down했을 경우의 핸들
     * 마우스를 지속적으로 누르고 있을 경우 반복 수행하는 기능을 포함한다.
     * @method onMousedownXPrev
     * @private
     * @return {void}
     */
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
    /**
     * @description x scrollbar의 next 버튼(우측)을 mouse down했을 경우의 핸들
     * 마우스를 지속적으로 누르고 있을 경우 반복 수행하는 기능을 포함한다.
     * @method onMousedownXNext
     * @private
     * @return {void}
     */
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
    /**
     * @description y scroll시 handler, scrollTop의 max값은 content height - scrollbar height
     * @method onScrollY
     * @private
     * @return {void}
     */
    onScrollY: function(e){
        if (!this.yScrollbarEl) return;
        if(this._dragging === true) return;
        var scrollTop = (e && e.target) ? e.target.scrollTop : this.getScrollTop(),
            beforeScrollTop = this.scrollTop;
        scrollTop = this.virtualScrollRate * scrollTop;
        if(scrollTop !== beforeScrollTop){
            //그리드의 경우 scrollEl의 scrollTop을 이동하여 스크롤하는 방식이 아닌 버퍼드 랜더링 방식으로 스크롤 하므로 아래는 필요없음.
            //this.scrollEl.dom.scrollTop = scrollTop * this.virtualScrollRate;
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
    /**
     * @description x scroll시 handler
     * @method onScrollX
     * @private
     * @return {void}
     */
    onScrollX: function(e){
        if (!this.xScrollbarEl)
            return;
        var scrollLeft = (e && e.target) ? e.target.scrollLeft : this.getScrollLeft();
        var beforeScrollLeft = this.scrollLeft;
        // scroller가 처음 생성되면 브라우저에 따라서 scrollLeft가 다르게 설정되어 튀는 문제가 발생할 수 있다.
        // 제일 처음에 생성되는 경우에 this.createScrollLeft값이 존재하면 해당 값으로 scrollLeft를 설정한다. 예) column move, column resize 
        if(this.createScrollLeft) {
        	this.scrollLeft = this.createScrollLeft;
        	this.setScrollLeft(this.scrollLeft);
        	delete this.createScrollLeft;
        }
        if (beforeScrollLeft !== scrollLeft || (e && e.isForce)){
            //틀고정등 여러 상황에 대처하기 위해 grid view에 위임함.
            this.scrollEl.dom.scrollLeft = scrollLeft;
            this.scrollLeft = scrollLeft;
            if (beforeScrollLeft || scrollLeft){
            	//Rui.log('scrollLeft: ' + scrollLeft);
                this.fireEvent('scrollX', {
                    target: this,
                    beforeScrollLeft: beforeScrollLeft,
                    scrollLeft: scrollLeft
                });
            }
        }
    },
    /**
     * @description touch scroll move시 handler (mobile touch지원 브라우저)
     * @method onTouchMove
     * @private
     * @return {void}
     */
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
    /**
     * @description touch scroll end시 handler (mobile touch지원 브라우저)
     * @method onTouchEnd
     * @private
     * @return {void}
     */
    onTouchEnd: function(e){
        if(this._touchMoveY && this._touchMoveX){
            if(Math.abs(this._touchMoveY) >= Math.abs(this._touchMoveX)){
                //move y scroll
                var coord = this.getScroll();
                this.go(coord.top + (this._touchMoveY > 0 ? this.yTouchScrollStep : -this.yTouchScrollStep));
            }else{
                //move x scroll
                var left = this.getScrollLeft();
                this.setScrollLeft(left + this._touchMoveX);
            }
        }
        this._touchMoveY = 0;
        this._touchMoveX = 0;
        Rui.ui.grid.LGridScroller.superclass.onTouchEnd.call(this, e);
    },
    /**
     * @description 객체를 destroy하는 메소드
     * @method destroy
     * @protected
     * @sample default
     * @return {void}
     */
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

/**
 * @description RUI에서 Tablet 인터페이스는 콤포넌트로 지원되게 하는 클래스(Beta)
 * @module ui
 * @title LActionMenuGrid
 */
(function() {
    var Ev = Rui.util.LEvent;
    
    /**
     * @description 마우스나 키보드를 적용하는 action 메뉴를 출력한다.
     * @namespace Rui.ui.grid
     * @class LActionMenuGrid
     * @constructor LActionMenuGrid
     * @param {Object} oConfig The intial LActionMenuGrid.
     */
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