/*
 * @(#) LTreeGridSelectionModel.js
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
(function(){
	var Event = Rui.util.LEvent;
    Rui.ui.grid.LTreeGridSelectionModel = function(oConfig) {
        Rui.ui.grid.LTreeGridSelectionModel.superclass.constructor.call(this, oConfig);
    };
    Rui.extend(Rui.ui.grid.LTreeGridSelectionModel, Rui.ui.grid.LSelectionModel, {
        otype : 'Rui.ui.grid.LTreeGridSelectionModel',
        getDataCount: function() {
            return this.view.showData.length;
        },
        getMoveRow: function(row, moveIdx) {
            var ds = this.view.getDataSet(), len = this.view.getDataCount(), realLen = ds.getCount();
            var currRow = row, currCount = 0, calVal = 0;
            var n = 0 < moveIdx ? 1 : -1;
            while (0 <= currRow && currRow < realLen) {
                if(currRow != row && ds.getAt(currRow).getAttribute('_show')) {
                    currCount += n;
                    if(currCount == moveIdx) {
                        break;
                    }
                }
                calVal++;
                currRow = currRow + n;
            }
            if(0 > ((row + calVal * n))) {
                return (0 < len ? 0 : -1);
            }
            return row + (calVal * n);
        },
        onPageDown: function(e) {
            var view = this.gridPanel.getView(), ds = view.getDataSet();
            var visibleRowCount = view.getVisibleRowCount ? view.getVisibleRowCount(true) : this.pageUpDownRow;
            var row = this.getMoveRow(ds.getRow(), visibleRowCount);
            row = view.getDataSetRow(row);
            row = (row > view.getDataCount() - 1) ? view.getDataSetRow(view.getDataCount() - 1) : row;
            view.getDataSet().setRow(row);
            ds = view = null;
        },
        onKeydown: function(e){
            var view = this.view, gridPanel = view.gridPanel, ds = view.getDataSet(), row = ds.getRow(), realCount = ds.getCount(), colId = this.getColId();
            var k = Rui.util.LKey.NAVKEY;
            var isCellMove = true;
            var r = ds.getAt(row);
            switch (e.keyCode) {
                case k.LEFT:
                	if(row > -1 && colId && this.gridPanel.isEdit !== true && colId == view.treeColumnId) {
                        var pRow = row;
                        if(r.getAttribute('_expand') == 'normal')
                            pRow = view.getParentRow(row);
                        else if(r.getAttribute('_expand') == 'close')
                            pRow = view.getParentRow(row);
                        if(pRow > -1) {
                            ds.setRow(pRow);
                            view.collapse(pRow);
                            isCellMove = false;
                        }
                	}
                	break;
                case k.RIGHT:
                	if(row > -1 && colId && this.gridPanel.isEdit !== true && colId == view.treeColumnId) {
                        var pRow = row;
                        if (r.getAttribute('_expand') == 'normal')
                        	break;
                        else if (r.getAttribute('_expand') == 'close') 
                                pRow = row;
                        else pRow = -1;
                        if(pRow > -1) {
                            ds.setRow(pRow);
                            view.expand(pRow);
                            isCellMove = false;
                        }
                	}
                	break;
                case k.DOWN:
                    var moveRow = this.getMoveRow(row, 1);
                    if(moveRow < realCount) {
                        if(e.ctrlKey !== true && e.shiftKey !== true) this.clearSelection();
                        gridPanel.doSelectCell(moveRow, this.currentCol, e.shiftKey ? false : undefined);
                        gridPanel.systemSelect = true;
                    }
                    gridPanel.focusRow();
                    isCellMove = false;
                    Event.stopEvent(e);
                    break;
            }
            if(isCellMove)
                Rui.ui.grid.LTreeGridSelectionModel.superclass.onKeydown.call(this, e);
            ds = view = null;
        }
    });
})();