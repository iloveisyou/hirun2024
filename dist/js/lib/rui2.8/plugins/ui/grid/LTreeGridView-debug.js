/*
 * @(#) LTreeGridView-debug.js
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
 * @description 트리 기능을 지원하는 그리드
 * @module ui_grid
 * @title LTreeGridView
 * @requires Rui.ui.grid.LGridView
 */
Rui.namespace('Rui.ui.grid');
(function() {
/**
 * @description 트리 기능을 지원하는 그리드
 * @namespace Rui.ui.grid
 * @class LTreeGridView
 * @extends Rui.ui.grid.LBufferGridView
 * @sample default
 * @plugin js,css
 * @constructor LTreeGridView
 * @param {Object} config The intial LTreeGridView.
 */
Rui.ui.grid.LTreeGridView = function(config) {
    config = config || {};
    config = Rui.applyIf(config, Rui.getConfig().getFirst('$.ext.treeGrid.defaultProperties'));
    this.showData = new Rui.util.LCollection();
    Rui.ui.grid.LTreeGridView.superclass.constructor.call(this, config);
};
Rui.extend(Rui.ui.grid.LTreeGridView, Rui.ui.grid.LBufferGridView, {
    otype: 'Rui.ui.grid.LTreeGridView',
    /**
     * 트리그리드의 펼침과 닫힘 이미지를 출력할 컬럼명
     * @config treeColumnId
     * @type {String}
     * @default null
     */
    /**
     * 트리그리드의 펼침과 닫힘 이미지를 출력할 컬럼명
     * @property treeColumnId
     * @type {String}
     * @private
     * @default null
     */
    treeColumnId: null,
    /**
     * 최초에 펼처질 depth를 결정한다.
     * @config defaultOpenDepth
     * @sample default
     * @type {int}
     * @default -1
     */
    /**
     * 최초에 펼처질 depth를 결정한다.
     * @property defaultOpenDepth
     * @type {int}
     * @private
     * @default -1
     */
    defaultOpenDepth: -1,
    /**
     * 출력하는 record객체만 가지는 객체
     * @property showData
     * @private
     * @type {Rui.util.LCollection}
     * @default null
     */
    showData: null,
    /**
     * 출력시 가상뷰인지 여부
     * @property isVirtualView
     * @private
     * @type {boolean}
     * @default false
     */
    isVirtualView: true,
    /**
     * 트리에서 사용하는 필드 정보를 정의한다.
     * @config fields
     * @type {Object}
     * @default null
     */
    /**
     * 트리에서 사용하는 필드 정보를 정의한다.
     * fields: {
     *     depthId: 'depth'
     * }
     * 이때 "depthId" 에 해당하는 값은 0 부터 시작하여야 하며 반드시 number형 이어야 합니다.
     * @property fields
     * @type {Object}
     * @private
     * @default null
     */
    fields: null,
    /**
     * 붙여넣기 시 dataset 기준이 아닌 그리드에 출력된 record에만 반영할지 여부
     * @property isShowDataPaste
     * @type {boolean}
     * @default false
     */
    isShowDataPaste: false,
    /**
     * @description panel에서 필요한 정보 가져오기
     * @method setPanel
     * @private
     * @param {Rui.ui.grid.LGridPanel} gridPanel
     * @return {void}
     */
    setPanel: function(gridPanel) {
        gridPanel.on('cellClick', this.onCellClick, this, true, { system: true });
        Rui.ui.grid.LTreeGridView.superclass.setPanel.call(this, gridPanel);
    },
    /**
     * @description 데이터셋의 load 이벤트 발생시 호출되는 메소드
     * @method onLoadDataSet
     * @private
     * @param {Object} e Event 객체
     * @return {void}
     */
    onLoadDataSet: function(e) {
        this.doLoadDataSet(this.defaultOpenDepth, e.add);
        Rui.ui.grid.LTreeGridView.superclass.onLoadDataSet.call(this, e);
    },
    /**
     * @description 데이터셋의 load 이벤트 수행시 호출되는 메소드
     * @method doLoadDataSet
     * @private
     * @param {int} depth 펼칠 depth값
     * @param {boolean} add 데이터를 추가할지 여부
     * @param {Array} oldShowList 로딩전에 이전 출력된 메타 데이터
     * @return {void}
     */
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
                
            /*if(r.get(dId) > pDepth && !r.pId) {
                r.pId = (pIdList.length > r.get(dId) - 1) ? pIdList[r.get(dId) - 1] : pIdList[pIdList.length - 1];
            }*/

            if(show) {
                this.showData.add(r.id, r);
            }
        }
    },
    /**
     * @description row 해당되는 부모단계의 계층별 상태를 펼친다.
     * @method updateParentExpand
     * @private
     * @param {int} row row 위치값
     * @return {void}
     */
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
    /**
     * @description row 해당되는 부모의 _expand값의 상태를 변경한다.
     * @method updateParentExpand
     * @private
     * @param {int} row row 위치값
     * @return {void}
     */
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
    /**
     * @description dataSet의 add 이벤트 발생시 호출되는 메소드
     * @method doAddData
     * @private
     * @param {Object} e Event 객체
     * @return {void}
     */
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
    /**
     * @description dataSet의 update 이벤트 발생시 호출되는 메소드
     * @method doCellUpdateData
     * @private
     * @param {Object} e Event 객체
     * @return {void}
     */
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
    /**
     * @description dataSet의 remove 이벤트 발생시 호출되는 메소드
     * @method doRemoveData
     * @private
     * @param {Object} e Event 객체
     * @return {void}
     */
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
    /**
     * @description dataSet의 undo 이벤트 발생시 호출되는 메소드
     * @method doUndoData
     * @private
     * @param {Object} e Event 객체
     * @return {void}
     */
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
    /**
     * @description dataSet의 changed 이벤트 발생시 호출되는 메소드
     * @method onChangeRenderData
     * @private
     * @param {Object} e Event 객체
     * @return {void}
     */
    onChangeRenderData: function(e) {
        var showList = {};
        /*
        for (var i = 0, len = this.showData.length; i < len; i++) {
            var r = this.showData.getAt(i);
            if(r.getAttribute('_show'))
                showList[r.id] = r.getAttribute('_expand');
        }
        */
        this.doLoadDataSet(this.defaultOpenDepth, false, showList);
        if(e.forceRow) {
            var row = this.dataSet.getRow();
            if(row > -1)
                this.expand(row);
        }
        delete showList;
        Rui.ui.grid.LTreeGridView.superclass.onChangeRenderData.call(this, e);
    },
    /**
     * @description LColumnModel에 columnsChanged 이벤트가 수행되면 호출되는 메소드 (미완성)
     * @method onColumnsChanged
     * @private
     * @param {Object} e 이벤트 객체
     * @return {void}
     */
    onColumnsChanged: function(e){
        this.doLoadDataSet(this.defaultOpenDepth);
        Rui.ui.grid.LTreeGridView.superclass.onColumnsChanged.call(this, e);
    },
    /**
     * @description cell click 이벤트가 발생하면 호출되는 메소드
     * @method onCellClick
     * @protected
     * @param {Object} e Event 객체
     * @return {void}
     */
    onCellClick: function(e) {
        var targetEl = Rui.get(e.event.target);
        if(targetEl.hasClass('L-grid-tree-col-icon')) {
            var row = this.findRow(e.event.target);
            this.toggle(row);
            Rui.util.LEvent.stopEvent(e);
            return false;
        }
    },
    /**
     * @description 트리 그리드에서 row 위치를 펼친다.
     * @method expand
     * @sample default
     * @param {int} row row 위치
     * @return {void}
     */
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
    /**
     * @description 트리 그리드에서 row 위치를 닫는다.
     * @method collapse
     * @sample default
     * @param {int} row row 위치
     * @return {void}
     */
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
//            this.scroller.onResize();
        this.redoRenderData({ resetScroll: true });
        return this;
    },
    /**
     * @description 트리 그리드에서 row 위치가 펼쳐 있으면 true를 그렇지 않으면 false 리턴한다.
     * @method isExpand
     * @sample default
     * @param {int} row row 위치
     * @return {boolean}
     */
    isExpand: function(row) {
        return this.dataSet.getAt(row).getAttribute('_expand') == 'open';
    },
    /**
     * @description 트리 그리드에서 row 위치가 펼쳐 있으면 닫고 닫쳐 있으면 펼친다.
     * @method toggle
     * @sample default
     * @param {int} row row 위치
     * @return {void}
     */
    toggle: function(row) {
        if(this.isExpand(row)) this.collapse(row); else this.expand(row);
        return this;
    },
    /**
     * @description depth값까지 모든 트리정보를 펼친다.
     * @method expandDepth
     * @sample default
     * @param {int} depth depth 펼치고자 하는 depth값
     * @return {void}
     */
    expandDepth: function(depth) {
        this.doLoadDataSet(depth);
        this.redoRenderData({ resetScroll: true });
        return this;
    },
    /**
     * @description row에 대한 class name 만들기
     * @method getRenderRowClassName
     * @protected
     * @param {int} row 현재행 번호
     * @param {Rui.data.LRecord} record
     * @param {int} rowCount
     * @return {String}
     */
    getRenderRowClassName: function(row, record, rowCount){
        var css = Rui.ui.grid.LTreeGridView.superclass.getRenderRowClassName.call(this, row, record, rowCount);
        var newCss = [];
        var dId = this.fields.depthId;
        var expand = record.getAttribute('_expand') || 'normal';
        newCss.push('L-grid-row-depth-' + (record.get(dId)));
        newCss.push('L-grid-row-expand-' + expand);
        return css + ' ' + newCss.join(' ');
    },
    /**
     * @description row Dom에 추가할 aria 속성을 리턴한다.
     * @method getAriaAttr
     * @protected
     * @return {String}
     */
    getAriaAttr: function(row, record) {
        var expand = record.getAttribute('_expand') || 'normal';
        if(expand === 'open')
            return 'aria-expand="true"';
        else if(expand === 'close')
            return 'aria-collapse="true"';
        return '';
    },
    /**
     * @description cell dom에 전에 탑재할 디자인용 html을 포함한다.
     * @method getRenderBeforeCell
     * @protected
     * @return {String}
     */
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
    /**
     * @description override getRow
     * @method getRowDom
     * @protected
     * @param {int} row dataSet 기준 실제 row index
     * @return {HTMLElement}
     */
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
//        /**
//         * @description dom에서 row index return
//         * @method findRow
//         * @public
//         * @param {HTMLElement} dom dom
//         * @param {int} y pageY
//         * @return {int}
//         */
//        findRow: function(dom, y) {
//            var row = Rui.ui.grid.LTreeGridView.superclass.findRowIndex.call(this, dom, y);
//            return this.getVisibleRow(row);
//        },
    /**
     * @description override getRenderBody
     * @private
     * @method getRenderBody
     * @return {String}
     */
    getRenderBody: function(checkRowHeight, redoRender) {
        //행높이를 알기 위해서 두번 그린다.
        var cm = this.columnModel;
        var ts = this.templates || {};
        var rowCount = this.showData.length;
        var rows1 = '';
        var rows2 = '';
        this.firstWidth = this.headerEl.dom.childNodes[0].childNodes[0].childNodes[0].childNodes[0].offsetWidth;
        this.lastWidth = this.headerEl.dom.childNodes[0].childNodes[0].childNodes[1].childNodes[0].offsetWidth;

        if(!redoRender) this.renderRange = this.getRenderRange();
        if (this.renderRange) {
            //행높이 측정용
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
    /**
     * @description rendering
     * @method doRender
     * @protected
     * @return {void}
     */
    doRender: function(appendToNode) {
        Rui.ui.grid.LTreeGridView.superclass.doRender.call(this, appendToNode);
        this.el.addClass('L-tree-grid');
        if(Rui.useAccessibility())
            this.el.setAttribute('role', 'treegrid');
    },
    /**
     * @description row에 대한 현재 보이는 실제 row값을 리턴한다.
     * @protected
     * @method getVisibleRow
     * @return {int}
     */
    getVisibleRow: function(row) {
        var r = this.dataSet.getAt(row);
        return (r) ? this.showData.indexOfKey(r.id) : row;
    },
    /**
     * @description row에 보이는 기준에서 moveRow값의 실제 row값을 리턴한다.
     * @protected
     * @method getBeforeVisibleRow
     * @return {int}
     */
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
    /**
     * @description 보이는 row에 대한 데이터셋의 실제 row값을 리턴한다.
     * @protected
     * @method getDataSetRow
     * @return {int}
     */
    getDataSetRow: function(row) {
        var r = this.getRowRecord(row);
        return (r) ? this.dataSet.indexOfKey(r.id) : row;
    },
    /**
     * @description 현재 그리드에서 row에 대한 레코드 객체를 리턴한다.
     * @private
     * @method getRowRecord
     * @return {Rui.data.LRecord}
     */
    getRowRecord: function(row) {
        return this.showData.getAt(row);
    },
    /**
     * @description 현재 그리드에서 데이터에 대한 총 건수를 리턴한다.
     * @private
     * @method getDataCount
     * @return {int}
     */
    getDataCount: function(){
        return this.showData.length;
    },
    /**
     * @description row에 부모의 row를 리턴한다. 부모가 없으면 -1을 리턴한다.
     * @method getParentRow
     * @param {int} row row 위치값
     * @return {int}
     */
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
    /**
     * @description row에 해당되는 같은 레벨의 이전 row 위치를 리턴한다.
     * @method getPrevSiblingRow
     * @sample default
     * @param {int} row row 위치값
     * @return {int}
     */
    getPrevSiblingRow: function(row) {
        var ds = this.dataSet, dId = this.fields.depthId;
        var depth = ds.getNameValue(row, dId);
        for (var i = row - 1; 0 <= i; i--) {
            if(ds.getNameValue(i, dId) == depth) return i;
        }
        return -1;
    },
    /**
     * @description row에 해당되는 같은 레벨의 다음 row 위치를 리턴한다.
     * @method getNextSiblingRow
     * @sample default
     * @param {int} row row 위치값
     * @return {int}
     */
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
    /**
     * @description row에 해당되는 자식 레벨의 1 depth 아래의 row 위치들을 리턴한다.
     * @method getChildRows
     * @sample default
     * @param {int} row row 위치값
     * @return {Array}
     */
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
    /**
     * @description row에 해당되는 자식 레벨의 모든 row 위치들을 리턴한다.
     * @method getAllChildRows
     * @sample default
     * @param {int} row row 위치값
     * @return {Array}
     */
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
    /**
     * @description TreeGrid의 dataSet에 filter를 적용한다.
     * function에서 true인 데이터만 남는다.
     * @method filter
     * @public
     * @sample default
     * @param {Function} fn 정보를 비교할 Function
     * @param {Object} scope [optional] scope정보 옵션
     * @return {void}
     */
    filter:function(func, scope){
        var ds = this.dataSet;
        ds.data = ds.snapshot.clone();
        ds.mergeModifiedData(ds.data);
        var newData = new Rui.util.LCollection();        
        var depth = 0;

        ds.data.each(function(id, item, i, count){ //id , LRecord, row, length
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
    /**
     * @description TreeGrid의 dataSet에 적용된 filter를 지운다.
     * @method clearFilter
     * @public
     * @sample default
     * @return {void}
     */
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