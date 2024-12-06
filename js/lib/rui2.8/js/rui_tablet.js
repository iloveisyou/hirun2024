/*
 * @(#) rui_ui.js
 * build version : 2.8
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

/**
 * @description 태블릿에서 태블릿 UI를 제공해주는 클래스
 * @module ui
 * @namespace Rui.ui.grid
 * @class LTabletViewer
 * @extends Rui.util.LEventProvider
 * @constructor
 * @param {Object} config The intial LTabletViewer.
 */
Rui.ui.grid.LTabletViewer = function(config){
    Rui.ui.grid.LTabletViewer.superclass.constructor.call(this, config);
    
    /**
     * @description rowclick을 하면 발생하는 이벤트
     * @event rowclick
     * @param {Object} target this객체
     * @param {boolean} row row index
     */
    this.createEvent('rowclick');
    
    /**
     * @description rowedit을 하면 발생하는 이벤트
     * @event rowedit
     * @param {Object} target this객체
     * @param {boolean} row row index
     */
    this.createEvent('rowedit');
    
    this.webStorage = new Rui.webdb.LWebStorage();
}

Rui.extend(Rui.ui.grid.LTabletViewer, Rui.ui.LUIComponent, {
    /**
     * editorList
     * @property editorList
     * @type Array
     * @protected
     */
	editorList: null,
    /**
     * row를 찾는 정규식객체
     * @property rowRe
     * @type RegExp
     * @protected
     */
	rowRe: new RegExp('L-row-id-r([^\\s]+)', ''),
    /**
     * col를 찾는 정규식객체
     * @property colRe
     * @type RegExp
     * @protected
     */
	colRe: new RegExp('L-detail-col-([^\\s]+)', ''),
	/**
     * pager 객체
     * @property pager
     * @type Rui.ui.LPager
     * @protected
     */
	pager: null,

    viewportWidth: Rui.util.LDom.getViewportWidth(),
    /**
     * @description Dom객체 생성 및 초기화하는 메소드
     * @method initComponent
     * @protected
     * @param {String|Object} el 객체의 아이디나 객체
     * @param {Object} oConfig 환경정보 객체
     * @return {void}
     */
    initComponent: function(oConfig) {
    	this.editorList = [];
    	this.dataSet = this.gridPanel.dataSet;
    	this.pagerId = 'pager_' + Rui.id();
    },
    /**
     * @description 객체의 이벤트 초기화 메소드
     * @method initEvents
     * @protected
     * @return {void}
     */
    initEvents: function() {
        Rui.ui.grid.LTabletViewer.superclass.initEvents.call(this);
        this.detachEvent();
        this.attachEvent();
    },
    /**
     * @description 객체에 다른 콤포넌트의 이벤트를 연결하는 메소드
     * @method attachEvent
     * @protected
     * @return {void}
     */
    attachEvent: function() {
        this.dataSet.on('load', this.onLoadDataSet, this, true, { system: true });
        this.dataSet.on('rowPosChanged', this.onRowPosChangedDataSet, this, true, { system: true });
    	this.dataSet.on('update', this.onUpdate, this, true, { system: true });
    	this.gridPanel.columnModel.on('cellConfigChanged', this.onCellConfigChanged, this, true);
    },
    /**
     * @description 객체에 다른 콤포넌트의 이벤트를 분리하는 메소드
     * @method detachEvent
     * @protected
     * @return {void}
     */
    detachEvent: function() {
    	this.dataSet.unOn('load', this.onLoadDataSet, this);
    	this.dataSet.unOn('rowPosChanged', this.onRowPosChangedDataSet, this);
    	this.dataSet.unOn('update', this.onUpdate, this);
    	this.gridPanel.columnModel.unOn('cellConfigChanged', this.onCellConfigChanged, this);
    },
    /**
     * @description element Dom객체 생성
     * @method createElement
     * @protected
     * @return {HTMLElement}
     */
    createElement: function() {
    	var bodyContainer = document.createElement('div');
    	bodyContainer.id = 'LTabletViewport'
    	bodyContainer.className = 'L-tablet-viewport';
        return bodyContainer;
    },
    /**
     * @description template 생성
     * @method createTemplate
     * @protected
     * @return {void}
     */
    createTemplate: function() {
        var ts = this.templates || {};
        var mm = Rui.getMessageManager();
        if (!ts.master) {
            ts.master = new Rui.LTemplate(
            	'<div class="L-view-container">',
	            '<div class="L-container-header" style="{hstyle}">{header}</div>',
	            '<div class="L-container-body" style="{bstyle}">{body}</div>',
	            '<div class="L-container-footer" style="{fstyle}">{footer}</div>',
	            '</div>',
	            '{editContainer}'
            );
        }
        if (!ts.header) {
            ts.header = new Rui.LTemplate(
        		'<div class="LblockViewList">',
        		'<div class="LblockHeaderTop">',
        		'<div class="LblockTopLogo">',
        		'<a href="#" class="L-header-focus"><span class="L-header-title">List</span></a>',
        		'</div>',
        		'</div>',
        		'<div class="LblockTopMenuTitle"><a href="#">Grid List</a></div>',
        		'</div>'
            );
        }
        if (!ts.footer) {
            ts.footer = new Rui.LTemplate(
        		'<div class="L-block-buttons">',
      		  	'<button class="L-btn-close" rui-click="closeViewPanel()">' + mm.get('$.base.msg124') + '</button>',
      		    '<div class="L-block-font-size"><a href="#" class="L-btn-font-small" rui-click="downUX()" alt="폰트 작게"></a><a href="#" class="L-btn-font-big" rui-click="upUX()" alt="폰트 크게"></a></div>',
      		  	'</div>'
            );
        }
        if (!ts.rows) {
            ts.rows = new Rui.LTemplate(
        		'<ul class="L-list">{rows}</ul>'
            );
        }
        if (!ts.row) {
            ts.row = new Rui.LTemplate(
        		'<li class="L-list-row L-row-id-{recordId}">{rowItem}</li>'
            );
        }
        if (!ts.rowItem) {
            ts.rowItem = new Rui.LTemplate(
          		'{cells}',
        		'<button class="L-edit-button {editable}">Edit</button>'
            );
        }
        if (!ts.cell) {
            ts.cell = new Rui.LTemplate(
      		  	'<span class="L-data-col L-data-{viewType} L-{columnId}" style="{style}">{value}</span>'
            );
        }
        if (!ts.edit) {
            ts.edit = new Rui.LTemplate(
	            '<div class="L-edit-container L-hide-display"><div class="LblockHeaderTop">',
	            '<div class="LblockTopLogo"><a href="#" class="L-header-focus"><span class="L-header-title">List</span></a></div></div>',
	            '<div class="LblockTopMenuTitle"><a href="#">Grid Edit</a></div>',
	            '<div class="L-block-buttons">',
	            '  <button class="L-btn-before" rui-click="beforeEditPanel()">' + mm.get('$.base.msg042') + '</button>',
	            '  <button class="L-btn-after" rui-click="afterEditPanel()">' + mm.get('$.base.msg043') + '</button>',
	            //'  <button class="L-btn-apply" rui-click="applyEditPanel()">적용</button>',
	            '  <button class="L-btn-close" rui-click="closeEditPanel()">' + mm.get('$.base.msg124') + '</button>',
	            '</div>',
	            '<div class="L-edit-list"></div>',
	            '<div class="L-block-buttons">',
	            '  <button class="L-btn-before" rui-click="beforeEditPanel()">' + mm.get('$.base.msg042') + '</button>',
	            '  <button class="L-btn-after" rui-click="afterEditPanel()">' + mm.get('$.base.msg043') + '</button>',
	            //'  <button class="L-btn-apply" rui-click="applyEditPanel()">적용</button>',
	            '  <button class="L-btn-close" rui-click="closeEditPanel()">' + mm.get('$.base.msg124') + '</button>',
	            '</div>',
	            '</div>'
            );
        }
        if (!ts.editItems) {
            ts.editItems = new Rui.LTemplate(
	            '<table class="L-edit-items">',
	            '{editItem}',
	            '</table>'
            );
        }
        if (!ts.editItem) {
            ts.editItem = new Rui.LTemplate(
	            '<tr class="L-edit-item">',
	            '<th class="L-edit-label L-{columnId}">{columnLabel}</th>',
	            '<td class="L-edit-cell L-edit-cell-{columnId}">{value}</td>',
	            '</tr>'
            );
        }
        if (!ts.detailItems) {
            ts.detailItems = new Rui.LTemplate(
	            '<table class="L-detail-view" border="0">',
	            '{detailItems}',
	            '</table>'
            );
        }
        if (!ts.detailItem) {
            ts.detailItem = new Rui.LTemplate(
	            '<tr class="L-detail-item">',
	            '<th class="L-detail-col L-detail-col-{columnId}">{columnLabel}</th><td class="{css}">{value}</td>',
	            '</tr>'
            );
        }
        this.templates = ts;
        ts = null;
    },
    /**
     * @description 데이터셋의 load 이벤트 발생시 호출되는 메소드
     * @method onLoadDataSet
     * @private
     * @param {Object} e Event 객체
     * @return {void}
     */
    onLoadDataSet: function(e) {
    	if(!this._rendered) return;
    	this.renderBody(this.getRenderBody());
    },
    /**
     * @description 데이터셋의 rowPosChanged 이벤트 발생시 호출되는 메소드
     * @method onRowPosChangedDataSet
     * @private
     * @param {Object} e Event 객체
     * @return {void}
     */
    onRowPosChangedDataSet: function(e) {
    	if(!this._rendered || this._viewPanelClicked) return;
    	this.showRenderEdit(e.row);
    },
    /**
     * @description columnModel의 cellConfigChanged 이벤트가 발생하면 호출되는 메소드
     * @method onCellConfigChanged
     * @private
     * @param {Object} e Event 객체
     * @return {void}
     */
    onCellConfigChanged: function(e) {
    	if(e.key == 'editable') {
    		var colId = e.colId, value = e.value, editorInfo = this.getEditor(colId);
    		if(editorInfo) (value == true) ? editorInfo.editor.enable() : editorInfo.editor.disable();
    	}
    },
    /**
     * @description viewpanel에 click이 발생하면 호출되는 메소드
     * @method onViewPanelClick
     * @private
     * @param {Object} e Event 객체
     * @return {void}
     */
    onViewPanelClick: function(e) {
    	var targetEl = Rui.get(e.target);
    	var rowDom = targetEl.findParent('.L-list-row');
    	if(rowDom) {
    		var row = this.getRowByDom(rowDom.dom);
    		if(targetEl.hasClass('L-edit-button')) {
        		this._viewPanelClicked = true;
        		if(row != this.dataSet.getRow()) {
        			if(!this.dataSet.setRow(row)) {
        				Rui.alert(Rui.getMessageManager().get('$.base.msg041'));
        				return;
        			}
        		}
        		this.showEditPanel();
        		this._viewPanelClicked = false;
        		this.fireEvent('rowedit', { target: this, row: row });
        	} else {
                var isPopupButton = targetEl.hasClass('L-popup-button-icon');
                var isPopupAction = targetEl.hasClass('L-popup-action');
                if(isPopupButton || isPopupAction) {
                    tdEl = targetEl.findParent('td', 5);
                    var thEl = tdEl.getPreviousSibling();
                    var r = thEl.dom;
                    if(r && r.className) {
                        var m = r.className.match(this.colRe);
                        if (m && m[1]) {
                            var colId = m[1], gridPanel = this.gridPanel, cm = gridPanel.columnModel;
                            var edit = cm.getCellConfig(row, colId, 'editable');
                            var col = cm.getIndexById(colId);
                            var column = cm.getColumnAt(col, true);
                            if(edit) gridPanel.fireEvent('popup', {target:gridPanel, row:row, col:col, colId: column.getId(), buttonEl: targetEl, editable: edit });                            	
                        }
                    } 
                    Rui.util.LEvent.stopPropagation(e);
                } else {
            		var detailView = targetEl.findParent('.L-detail-view');
            		if(detailView) return;
            		//if(!targetEl.hasClass('.L-data-col')) return;
            		this.showViewDetail(row);
            		this.fireEvent('rowclick', { target: this, row: row });
                }
        	}
    	}
    	this.doDomClick(e.target);
    },
    /**
     * @description editpanel에 click이 발생하면 호출되는 메소드
     * @method onEditPanelClick
     * @private
     * @param {Object} e Event 객체
     * @return {void}
     */
    onEditPanelClick: function(e) {
    	this.doDomClick(e.target);
    },
    /**
     * @description dom에 click 이벤트를 호출하는 메소드
     * @method doDomClick
     * @private
     * @param {HTMLElement} dom dom 객체
     * @return {void}
     */
    doDomClick: function(dom) {
    	var attr = Rui.util.LDom.getRuiAttributes(dom);
    	var m;
    	for(m in attr) {
    		var val = attr[m];
    		// () 차후 개선 예정
    		var idx = val.indexOf('(');
    		if(idx> -1) val = val.substring(0, idx);
    		if(!this[val]) throw new Error('Can not find the method! : ' + val);
    		this[val]();
    	}
    },
    /**
     * @description dataSet의 update이벤트가 발생되면 호출되는 메소드
     * @method onUpdate
     * @private
     * @param {Object} e Event 객체
     * @return {void}
     */
    onUpdate: function(e) {
    	var r = this.dataSet.getAt(e.row);
    	var rowEl = this.viewPanelEl.select('.L-row-id-' + r.id, true);
    	if(rowEl) rowEl.html(this.getRenderRow(e.row));
    	var editorInfo = this.getEditor(e.colId);
    	if(editorInfo) {
    		// 무한루프에 빠질 수 있음.
    		editorInfo.editor.setValue(e.value);
    	}
    },
    /**
     * @description render시 호출되는 메소드
     * @method doRender
     * @protected 
     * @param {String|Object} parentNode 부모노드
     * @return {void}
     */
    doRender: function(parentNode){
    	var uxSize = this.webStorage.getBoolean('RUI_TABLET_UX_BIG_SIZE', false);
    	this.createTemplate();
    	this.renderMaster();
    	this.viewPanelEl = this.el.select('.L-view-container', true).getAt(0);
    	this.bodyEl = this.el.select('.L-container-body', true).getAt(0);
    	this.editPanelEl = this.el.select('.L-edit-container', true).getAt(0);
    	this.editList = this.el.select('.L-edit-container .L-edit-list', true).getAt(0);
    	this.doRenderBody();
    	this.el.setAttribute('rui-ux-big-size', uxSize);
    },
    /**
     * @description pager에서 changed 이벤트가 발생하면 호출되는 메소드
     * @method onChangedPager
     * protected
     * @param {Object} e Event 객체
     * @return {void}
     */
    onChangedPager: function(e) {
    	this.doRenderBody();
    	Rui.select('.L-header-focus').focus();
    },
    
    /**
     * @description body내용을 재생성하는 메소드
     * @method doRenderBody
     * @protected
     * @return {void}
     */
    doRenderBody: function() {
    	var pageNumber = 1;
    	if(this.pager) {
    		pageNumber = this.pager.getPageNumber();
    		this.pager.destroy();
    	}
    	this.pager = new Rui.ui.LPager({
    		id: this.pagerId,
    		pageNumber: pageNumber,
            totalCount: this.dataSet.getCount(),
            pageSize: this.pageSize || 10,
            pageGroupSize: this.pageGroupSize || 5
        });
    	
    	this.renderBody(this.getRenderBody());
    	this.pager.render(this.pagerId);

        this.pager.unOn('changed', this.onChangedPager, this);
    	this.viewPanelEl.unOn('click', this.onViewPanelClick, this);
    	this.editPanelEl.unOn('click', this.onEditPanelClick, this);

        this.pager.on('changed', this.onChangedPager, this, true);
    	this.viewPanelEl.on('click', this.onViewPanelClick, this, true);
    	this.editPanelEl.on('click', this.onEditPanelClick, this, true);
    },
    /**
     * @description render후 호출되는 메소드
     * @method afterRender
     * @protected
     * @param {HTMLElement} container 부모 객체
     * @return {void}
     */
    afterRender: function(container) {
    },
    /**
     * @description 구조 rendering
     * @method renderMaster
     * @protected
     * @return {void}
     */
    renderMaster: function() {
        this.el.html(this.templates.master.apply({
        	header: this.getRenderHeader(),
        	footer: this.getRenderFooter(),
        	editContainer: this.getRenderEdit()
        }));
    },
    /**
     * @description override getRenderHeader
     * @protected
     * @method getRenderHeader
     * @return {String}
     */
    getRenderHeader: function() {
        return this.templates.header.apply();
    },
    /**
     * @description override getRenderFooter
     * @protected
     * @method getRenderFooter
     * @return {String}
     */
    getRenderFooter: function() {
        return this.templates.footer.apply();
    },
    /**
     * @description override getRenderEdit
     * @protected
     * @method getRenderEdit
     * @return {String}
     */
    getRenderEdit: function() {
        return this.templates.edit.apply();
    },
    /**
     * @description 전체 list를 출력하는 html만드는 메소드
     * @protected
     * @method getRenderBody
     * @return {String}
     */
    getRenderBody: function() {
    	var gridPanel = this.gridPanel, dataSet = gridPanel.dataSet, pg = this.pager;
    	var pNum = pg.pageNumber, pSize = pg.pageSize;
    	var start = ((pNum - 1) * pSize), end = ((pNum - 1) * pSize) + pSize - 1;
    	if(end >= dataSet.getCount()) end = dataSet.getCount() - 1;
		var html = '';
		for ( var row = start; row <= end; row++)
			html += this.templates.row.apply({ recordId: dataSet.getAt(row).id, rowItem: this.getRenderRow(row) });
		var liHtml = this.templates.rows.apply({ rows: html });
		liHtml += this.getRenderPager();
        return liHtml;
    },
    /**
     * @description 전체 list의 row를 출력하는 html만드는 메소드
     * @protected
     * @method getRenderRow
     * @param {int} row row값
     * @return {String}
     */
    getRenderRow: function(row) {
		var gridPanel = this.gridPanel, cm = gridPanel.columnModel, columnCount = cm.getColumnCount(true), view = gridPanel.getView();
		var ds = gridPanel.dataSet;
		var r = ds.getAt(row);
    	var cellHtml = '';
    	var isTableColumn = false;
		for(var col = 0; col < columnCount; col++) {
			var column = cm.getColumnAt(col, true);
            if(column.tablet === false) continue;
			if(column.tablet) {
				isTableColumn = true;
				// getRenderCell에서 나오는 td를 없애는 메소드가 필요함. td에 style이 없는 dom으로 나와야 함.
				var value = view.getRenderCell(row, col, columnCount, r);
				var tablet = (typeof column.tablet == 'object') ? column.tablet : {};
				tablet.width = tablet.width || 200;
				var style = 'width:' + tablet.width + ';';
				if(tablet.align) style += 'text-align:' + tablet.align;
                cellHtml += this.templates.cell.apply({ 
                	viewType: tablet.viewType || 'title1',
                	columnId: column.id,
                	style: style,
                	value: value
                });
			}
		}
		if(isTableColumn == false) {
			var len = Math.min(columnCount, 3);
			for(var col = 0; col < len; col++) {
				var column = cm.getColumnAt(col, true);
	            if(column.systemColumn) {
	            	len++;
	            	continue;
	            }
				// getRenderCell에서 나오는 td를 없애는 메소드가 필요함. td에 style이 없는 dom으로 나와야 함.
				var value = view.getRenderCell(row, col, columnCount, r);
                cellHtml += this.templates.cell.apply({ 
                	viewType: 'title1',
                	columnId: column.id,
                	style: 'width:200px',
                	value: value
                });
			}
		}
		var editable = !gridPanel.isEditable() ? 'L-hide-display' : '';
		return this.templates.rowItem.apply({ 
        	cells: cellHtml,
        	editable: editable
        });
    },
    /**
     * @description 페이지를 출력하는 html만드는 메소드
     * @protected
     * @method getRenderPager
     * @return {String}
     */
    getRenderPager: function() {
    	return '<div id="' + this.pagerId + '" ></div>';
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
    	this.bodyEl.html(bodyHtml);
    },
    /**
     * @description dom에 대한 row값을 리턴하는 메소드
     * @method getRowByDom
     * @param {HTMLElement} dom dom 객체
     * @protected
     * @return {Int}
     */
    getRowByDom: function(dom) {
        var className = dom.className;
        var m = className.match(this.rowRe);
        var row = -1;
        if (m && m[1]) {
            var idx = this.dataSet.indexOfKey('r' + m[1]);
            row = idx == -1 ? false : idx;
        }
        return row;
    },
    /**
     * @description row에 대한 detail view를 출력하는 메소드
     * @method showViewDetail
     * @param {Int} row row값
     * @protected
     * @return {void}
     */
    showViewDetail: function(row) {
    	var gridPanel = this.gridPanel, ds = gridPanel.dataSet, cm = gridPanel.columnModel, columnCount = cm.getColumnCount(true), view = gridPanel.getView();
    	var rowEl = this.el.select('.L-row-id-' + ds.getAt(row).id, true).getAt(0);
    	var detailView = rowEl.select('.L-detail-view');
    	if(detailView.length > 0) {
        	rowEl.select('.L-detail-view').remove();
        	return;
    	}
        var detailHtml = '';
        for ( var col = 0; col < columnCount; col++) {
	    	var column = cm.getColumnAt(col, true);
	    	if(column.tablet === false) continue;
	    	if(column.id == 'selection' || column.id == 'state' || column.id == 'num') continue;
	    	var record = ds.getAt(row);
    		var p = view.getRenderCellParams(row, col, columnCount, column, record);
    	    var value = p.value;
    	    var css = p.css.join(' ');
    	    detailHtml += this.templates.detailItem.apply({
	        	columnId: column.id,
	        	columnLabel: column.label,
	        	css: css,
	        	value: value || ''
	        });
        }
        rowEl.appendChild(this.templates.detailItems.apply({
        	detailItems: detailHtml
        }));

    },
    /**
     * @description edit panel을 출력하는 메소드
     * @method showEditPanel
     * @protected
     * @return {void}
     */
    showEditPanel: function() {
		this.viewPanelEl.hide();
		this.editPanelEl.show();
    	this.showRenderEdit(this.dataSet.getRow());
    	try { this.el.select('.L-btn-after', true).focus(); } catch(e) {}
    },
    /**
     * @description view panel을 닫는 메소드
     * @method closeViewPanel
     * @protected
     * @return {void}
     */
    closeViewPanel: function() {
    	this.detachEvent();
    	this.gridPanel.closeTabletViewer();
    },
    /**
     * @description edit panel을 닫는 메소드
     * @method closeEditPanel
     * @protected
     * @return {void}
     */
    closeEditPanel: function() {
    	this.applyEditPanel();
		this.viewPanelEl.show();
		this.editPanelEl.hide();
		this.destroyEditor();
    },
    /**
     * @description edit panel에 변경된 값을 dataSet에 반영하는 메소드
     * @method applyEditPanel
     * @protected
     * @param {boolean} isMessage 메시지 출력 여부
     * @return {boolean}
     */
    applyEditPanel: function(isMsg) {
    	isMsg = Rui.isUndefined(isMsg) ? true: isMsg;
    	var ds = this.dataSet;
        var editorList = this.editorList;
        var row = ds.getRow();
        var changed = false;
        for(var i = 0 ; i < editorList.length; i++) {
            var value = editorList[i].editor.getValue();
            var r = ds.getAt(ds.getRow());
            var orgValue = r.get(editorList[i].field);
            if(String(orgValue) != String(value)) {
                r.set(editorList[i].field, value);
                changed = true;
            }
        }
        if(changed) Rui.util.LDom.toast(Rui.getMessageManager().get('$.base.msg109'));
        if(isMsg) {
        	if(!changed) Rui.util.LDom.toast(Rui.getMessageManager().get('$.base.msg102'));
        }
        return changed;
    },
    /**
     * @description edit panel의 editor들을 생성하는 메소드
     * @method showRenderEdit
     * @protected
     * @param {Int} row row값
     * @return {void}
     */
    showRenderEdit: function(row) {
    	this.destroyEditor();
        this.editorList = [];
        var editorList = this.editorList;
		var gridPanel = this.gridPanel;
		var view = gridPanel.getView();
		var cm = gridPanel.columnModel;
		var columnCount = cm.getColumnCount(true);
		var ds = gridPanel.dataSet;
		// pre rendering
		this.editList.html(this.templates.editItems.apply({
        	editItem: '<table class="L-edit-items">' + this.templates.editItem.apply({}) + '</table>'
        }));
        var editLabelEls = Rui.select('.L-edit-label');
        var width = 400;
        if(editLabelEls.length > 0) width = editLabelEls.getAt(0).getWidth();
        width = (width > 400) ? 400 : width;
        var editItemHtml = '';
        for ( var col = 0; col < columnCount; col++) {
            var column = cm.getColumnAt(col, true);
            if(column.tablet === false) continue;
            if(column.systemColumn) continue;
            var record = ds.getAt(row);
            var value = '';
            if(column.editor) {
                var id = Rui.id();
                var editor = null;
                var editorConfig = column.editor.initConfig;
                var editLabelEls = Rui.select('.L-edit-label');
                editorConfig.width = this.viewportWidth - 50 - width;
                editorConfig.id = id;
                if(column.editor.otype) {
                	var formObject = eval(column.editor.otype);
                	if(column.editor.dataSet) {
                		editorConfig.dataSet = column.editor.dataSet;
                		delete editorConfig.url;
                		editor = new formObject(editorConfig);
                	} else {
                		if(editorConfig.items) {
                			var newItems = [];
                			for(var i = 0 ; i < editorConfig.items.length; i++) {
                				var item = editorConfig.items[i];
                				if(item.otype) {
                					newItems.push({
                						label: item.label,
                						value: item.value
                					});
                				} else {
                					newItems = editorConfig.items;
                					break;
                				}
                			}
                			editorConfig.items = newItems;
                			editor = new formObject(editorConfig);
                		} else
                			editor = new formObject(editorConfig);
                	}
                } else {
                    editor = new Rui.ui.form.LTextBox(editorConfig);
                }
                editor.__simple_events = column.editor.__simple_events;
                editor.columnId = column.id;
                value = ds.getNameValue(row, column.field);
                var edit = cm.getCellConfig(row, column.id, 'editable');
                if(edit) {
                    editorList.push({
                        editor: editor,
                        field: column.field,
                        columnId: column.id,
                        id: id,
                        value: value
                    });
                    value = '<div id="' + id + '"></div>';
                } else {
                	var p = view.getRenderCellParams(row, col, columnCount, column, record);
                	value = p.value;
                }
            } else {
            	var p = view.getRenderCellParams(row, col, columnCount, column, record);
                value = p.value;
            }
            editItemHtml += this.templates.editItem.apply({
            	columnId: column.id,
            	columnLabel: column.label,
            	value: value || ''
            });
        }
        this.editList.html(this.templates.editItems.apply({
        	editItem: editItemHtml
        }));
        this.initEditor = true;
        for(var i = 0 ; i < editorList.length; i++) {
            editorList[i].editor.renderAt(editorList[i].id);
            editorList[i].editor.on('changed', this.onChangedByEditor, this, true, { system: true });
            editorList[i].editor.setValue(editorList[i].value, true);
        }
    },
    /**
     * @description editor들을 destroy 하는 메소드
     * @method destroyEditor
     * @protected
     * @return {void}
     */
    destroyEditor: function() {
    	for(var i = 0 ; i < this.editorList.length ; i++) {
    		this.editorList[i].editor.unOn('changed', this.onChangedByEditor, this);
    		this.editorList[i].editor.__simple_events = null;
    		this.editorList[i].editor.destroy();
    	}
    },
    /**
     * @description editor에서 changed 이벤트가 발생하면 호출되는 메소드
     * @method onChangedByEditor
     * protected
     * @param {Object} e Event 객체
     * @return {void}
     */
    onChangedByEditor: function(e) {
    	var editor = e.target;
    	var ds = this.dataSet, row = ds.getRow();
    	ds.setNameValue(row, editor.columnId, e.value, { ignoreEvent: true });
    },
    /**
     * @description id에 대한 editor를 리턴한다.
     * @method getEditor
     * @protected
     * @param {String} id column id
     * @return {void}
     */
    getEditor: function(id) {
    	for(var i = 0 ; i < this.editorList.length ; i++) {
    		if(this.editorList[i].columnId == id) {
    			return this.editorList[i];
    		}
    	}
    	return null;
    },
    /**
     * @description editor객체에 대한 field id를 리턴한다.
     * @method getIdByEditor
     * @protected
     * @param {Rui.ui.form.LField} editor editor 객체
     * @return {String}
     */
    getIdByEditor: function(editor) {
    	for(var i = 0 ; i < this.editorList.length ; i++) {
    		if(this.editorList[i].editor === editor) {
    			return this.editorList[i].columnId;
    		}
    	}
    	return null;
    },
    /**
     * @description dataSet의 이전 row로 이동하는 메소드
     * @method beforeEditPanel
     * @protected
     * @return {void}
     */
    beforeEditPanel: function() {
    	//this.applyEditPanel(false);
    	var ds = this.dataSet, row = ds.getRow();
        if(row > 0) ds.setRow(row - 1);
    },
    /**
     * @description dataSet의 다음 row로 이동하는 메소드
     * @method afterEditPanel
     * @protected
     * @return {void}
     */
    afterEditPanel: function() {
    	//this.applyEditPanel(false);
    	var ds = this.dataSet, row = ds.getRow();
        if(row < ds.getCount()) ds.setRow(row + 1);
    },
    /**
     * @description 화면 UX 사이즈를 크게 한다.
     * @method upUX
     * @protected
     * @return {void}
     */
    upUX: function() {
    	var uxSize = true;
    	this.el.setAttribute('rui-ux-big-size', uxSize);
    	this.webStorage.set('RUI_TABLET_UX_BIG_SIZE', uxSize);
    },
    /**
     * @description 화면 UX 사이즈를 작게 한다.
     * @method downUX
     * @protected
     * @return {void}
     */
    downUX: function() {
    	var uxSize = false;
    	this.el.setAttribute('rui-ux-big-size', uxSize);
    	this.webStorage.set('RUI_TABLET_UX_BIG_SIZE', uxSize);
    }
});