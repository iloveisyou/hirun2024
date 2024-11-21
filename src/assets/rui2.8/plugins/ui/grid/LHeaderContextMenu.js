/*
 * @(#) LHeaderContextMenu.js
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
    Rui.ui.grid.LHeaderContextMenu = function(oConfig) {
        var mm = Rui.getMessageManager();
        this.groups = [
            { id: 'gridMenu', name: mm.get('$.ext.msg008') },
            { id: 'columnMenu', name: mm.get('$.ext.msg009') },
            { id: 'infoMenu', name: mm.get('$.ext.msg010') }
        ];
        oConfig = Rui.applyIf(oConfig, Rui.getConfig().getFirst('$.ext.headerContextMenu.defaultProperties'));
        var htOptions = Rui.applyIf(oConfig.headerToolOptions || {}, {
            useSaveExcel: true,
            useFreezeColumn: true,
            useDataSort: true,
            useAutoAllUpdateColumnFit: true,
            useAutoUpdateColumnsAutoWidth: true,
            useDataFilterClear: true,
            useDataFilter: true,
            useUpdateColumnFit: true,
            useBrowserRecommand: true,
            useSearchDialog: true
        });
        this.menuItems = [];
        if(htOptions.useSaveExcel)
            this.menuItems.push({ 
                id: 'saveExcel',
                groupId: 'gridMenu',
                name: mm.get('$.ext.msg001'),
                items: []
            });
        if(htOptions.useFreezeColumn)
            this.menuItems.push({ 
                id: 'freezeColumn',
                groupId: 'gridMenu',
                name: mm.get('$.ext.msg002'),
                items: []
            });
        this.menuItems.push({ 
            id: 'noFreezeColumn',
            groupId: 'gridMenu',
            name: mm.get('$.ext.msg002') + ' ' + mm.get('$.base.msg121'),
            items: []
        });
        if(htOptions.useDataSort)
            this.menuItems.push({ 
                id: 'dataSort',
                groupId: 'gridMenu',
                name: mm.get('$.ext.msg003'),
                items: []
            });
        if(htOptions.useAutoAllUpdateColumnFit)
            this.menuItems.push({ 
                id: 'autoAllUpdateColumnFit',
                groupId: 'gridMenu',
                name: mm.get('$.ext.msg011'),
                items: []
            });
        if(htOptions.useAutoUpdateColumnsAutoWidth)
            this.menuItems.push({ 
                id: 'autoUpdateColumnsAutoWidth',
                groupId: 'gridMenu',
                name: mm.get('$.ext.msg015'),
                items: []
            });
        if(htOptions.useDataFilterClear)
            this.menuItems.push({ 
                id: 'dataFilterClear',
                groupId: 'gridMenu',
                name: mm.get('$.ext.msg013'),
                items: []
            });
        if(htOptions.useSearchDialog)
            this.menuItems.push({
                id: 'searchDialog',
                groupId: 'gridMenu',
                name: mm.get('$.ext.msg021'),
                items: []
            });
        if(htOptions.useDataFilter)
            this.menuItems.push({ 
                id: 'dataFilter',
                groupId: 'columnMenu',
                name: mm.get('$.ext.msg004'),
                items: []
            });
        if(htOptions.useUpdateColumnFit)
            this.menuItems.push({ 
                id: 'updateColumnFit',
                groupId: 'columnMenu',
                name: mm.get('$.ext.msg012'),
                items: []
            });
        if(htOptions.useBrowserRecommand)
            if(Rui.browser.msie678) {
                this.menuItems.push({
                    id: 'browserRecommand',
                    groupId: 'infoMenu',
                    name: '브라우져 권장',
                    items: []
                });
            }
        Rui.ui.grid.LHeaderContextMenu.superclass.constructor.call(this, oConfig);
        this.gridView.createEvent('renderMenuRow');
        this.sorts = [];
        this.filters = {};
        this.gridId = this.gridView.gridId;
    };
    Rui.extend(Rui.ui.grid.LHeaderContextMenu, Rui.ui.LUIComponent, {
        sorts: null,
        filters: null,
        gridId: null,
        maxFilterCount: 30,
        createTemplate: function() {
            var ts = this.templates || {};
            if (!ts.master) {
                ts.master = new Rui.LTemplate(
                    '<a href="#" class="L-header-focus" tabIndex="-1" style="position:absolute;"></a>',
                    '<div class="L-header-master-menu" style="{tstyle}">',
                    '{menuBody}',
                    '</div>',
                    '<div class="L-header-sub-menu L-hide-display" style="{tstyle}">',
                    '{subMenuBody}',
                    '</div>'
                );
            }
            if (!ts.menuBody) {
                ts.menuBody = new Rui.LTemplate(
                    '<ul class=\"L-header-{type}-menu-body \" style=\"{style}\" >',
                        '{menuBodyRows}',
                    '</ul>'
                );
            }
            if (!ts.groupMenuBody) {
                ts.groupMenuBody = new Rui.LTemplate(
                    '<li class=\"L-header-group-menu-row\ {itemId}" id=\"{id}\" style=\"{style}\" >',
                        '{rowData}',
                    '</li>'
                );
            }
            if (!ts.menuBodyRow) {
                ts.menuBodyRow = new Rui.LTemplate(
                    '<li class=\"L-header-menu-row\ {itemId}" id=\"{id}\" style=\"{style}\" >',
                        '{rowData}',
                    '</li>'
                );
            }
            this.templates = ts;
        },
        renderMaster: function(headerHtml) {
            var offsetWidth = 100;
            var html = this.templates.master.apply({
                menuBody: headerHtml,
                ostyle: 'width:' + offsetWidth + 'px'
            });
            this.el.html(html);
            this.el.addClass('L-fixed');
        },
        getRenderMenuBody: function(type) {
            var ts = this.templates || {};
            var menuBodyRows = '';
            var groupId;
            for (var i = 0 ; i < this.menuItems.length; i++) {
                var menuItem = this.menuItems[i];
                if(this.gridView.fireEvent('renderMenuRow', {target: this.gridView, item: menuItem}) === false) continue;
                if(groupId !== menuItem.groupId) {
                    menuBodyRows += this.getRenderGroupMenuBody(this.getGroupItem(menuItem.groupId));
                    groupId = menuItem.groupId;
                }
                menuBodyRows += this.getRenderMenuBodyRow(menuItem);
            }
            return ts.menuBody.apply({
                type: type,
                menuBodyRows: menuBodyRows 
            });
        },
        getGroupItem: function(groupId) {
            for (var i = 0, len = this.groups.length; i < len; i++) {
                if(this.groups[i].id === groupId) {
                    return this.groups[i];
                }
            }
            return null;
        },
        getRenderGroupMenuBody: function(item) {
            var ts = this.templates || {};
            return ts.groupMenuBody.apply({
                id: Rui.useFixedId() ? 'LGrid-header-grpmenu-' + this.gridId + '-' + item.id : Rui.id(),
                itemId: item.id,
                rowData: item.name
            });
        },
        getRenderMenuBodyRow: function(item) {
            var ts = this.templates || {};
            return ts.menuBodyRow.apply({
                id: Rui.useFixedId() ? 'LGrid-header-menu-' + this.gridId + '-' + item.id : Rui.id(),
                itemId: item.id,
                rowData: item.name
            });
        },
        getRenderSortColumns: function(columnId) {
            var mm = Rui.getMessageManager();
            var ts = this.templates || {};
            var columnsHtml = '<ul class="L-header-menu-rows">';
            var cm = this.gridView.columnModel;
            var ds = this.gridView.dataSet;
            var ignoreLabel = mm.get('$.ext.msg014');
            var ascLabel = mm.get('$.ext.msg005');
            var descLabel = mm.get('$.ext.msg006');
            var sortDirection = ds.sortDirection || {};;
            this.sorts = [];
            for (var i = 0, len = cm.getColumnCount(true) ; i < len; i++) {
                var c = cm.getColumnAt(i, true);
                if(!c.field || !c.sortable) continue;
                this.sorts.push({id:c.field, dir: (sortDirection[c.field] || '') });
            }
            for (var i = 0, len = this.sorts.length ; i < len; i++) {
                var sInfo = this.sorts[i];
                var dir = sortDirection[sInfo.id];
                var c = cm.getColumnById(sInfo.id);
                var label = c.label || c.id;
                var checked1 = 'checked';
                var checked2 = '';
                var checked3 = '';
                if(dir) {
                    if(dir == 'desc')
                        checked3 = 'checked';
                    else if(dir == 'asc')
                        checked2 = 'checked';
                }
                var id = Rui.useFixedId() ? 'LGrid-header-menu-sort-' + this.gridId + '-' + c.id : Rui.id();
                var rowData = '<span class="L-sort-label">' + label + '</span>';
                rowData += '<input type="radio" name="' + id + '" id="' + id + '1" value="" ' + checked1 + ' class="L-field-' + c.id + '"> <label for="' + id + '1">' + ignoreLabel + '</label>';
                rowData += '<input type="radio" name="' + id + '" id="' + id + '2" value="asc" ' + checked2 + ' class="L-field-' + c.id + '"> <label for="' + id + '2">' + ascLabel + '</label>';
                rowData += '<input type="radio" name="' + id + '" id="' + id + '3" value="desc" ' + checked3 + ' class="L-field-' + c.id + '"> <label for="' + id + '3">' + descLabel + '</label>';
                columnsHtml += ts.menuBodyRow.apply({
                    id: id,
                    rowData: rowData
                });
            }
            columnsHtml += '</ul>';
            if(!this.sorts.length) {
                columnsHtml += '<p>정렬 가능한 컬럼이 없습니다.</p>';
            }
            return columnsHtml;
        },
        getRenderFilterColumns: function(columnId) {
            var mm = Rui.getMessageManager();
            var ts = this.templates || {};
            var columnsHtml = '<ul class="L-header-menu-rows">';
            var cm = this.gridView.columnModel;
            var dataSet = this.gridView.dataSet;
            var column = cm.getColumnById(columnId);
            if(!column) return;
            var f = dataSet.getFieldById(column.field);
            var snapshot = (dataSet.snapshot && dataSet.snapshot.length > 0) ? dataSet.snapshot : dataSet.data;
            var cntId = 0;
            var id = Rui.useFixedId() ? 'LGrid-header-submenu-filter-' + this.gridId + '-' + columnId + '-' + (cntId++) : Rui.id();
            var checked = (snapshot.length == dataSet.data.length) ? 'checked' : '';
            columnsHtml += ts.menuBodyRow.apply({
                id: id,
                rowData: '<input type="checkbox" id="' + id + '-chkbox" value="" ' + checked + ' class="L-checked-all"> <label for="' + id + '-chkbox">' + mm.get('$.base.msg119') + '</label>'
            });
            var dupData = [];
            for (var i = 0, len = snapshot.length ; i < len; i++) {
                var record = snapshot.getAt(i);
                var value = record.get(column.getField());
                value = (value || value === 0) ? value : '';
                var display = value;
                if((column.editor && column.editor.beforeRenderer) || column.renderer) {
                    var row = record.dataSet.indexOfRecord(record);
                    var col = column.columnModel.getIndex(column, true);
                    if(column.editor && column.editor.beforeRenderer)
                        display = column.editor.beforeRenderer(display, { css: [] }, record, row, col);
                    else display = column.renderer(display, { css: [] }, record, row, col);
                }
                if (f.type === 'date')
                    value = Rui.util.LDate.format(value, { format: '%Y%m%d' });
                else if (f.type === 'number'){
                    if(!Rui.isEmpty(value))
                        value = parseFloat(value);
                    else
                        value = 0;
                        display = value;
                }
                if(Rui.util.LArray.contains(dupData, display)) continue;
                dupData.push(display);
                if (dupData.length > this.maxFilterCount) {
                    columnsHtml += ts.menuBodyRow.apply({
                        id: '',
                        rowData: mm.get('$.ext.msg007', [this.maxFilterCount])
                    });
                    break;
                }
                var checkedList = 'checked';
                if(checked == ''){
                    if(this.filters[column.id]) {
                        if(f.type === 'number' && !Rui.isEmpty(value))
                            checkedList = Rui.util.LArray.contains(this.filters[column.id], 0 + value) ? 'checked' : '';
                        else
                            checkedList = Rui.util.LArray.contains(this.filters[column.id], '' + value) ? 'checked' : '';
                    }else{
                        for(var j = 0, dataLen = dataSet.data.length ; j < dataLen; j++){
                            var filteredRecord = dataSet.data.getAt(j);
                            var filteredValue = filteredRecord.get(column.getField());
                            filteredValue = filteredValue || '';
                            if (f.type === 'date')
                                filteredValue = Rui.util.LDate.format(filteredValue, { format: '%Y%m%d' });
                            else if (f.type === 'number' && !Rui.isEmpty(filteredValue))
                                filteredValue = parseFloat(value);
                            if(value == filteredValue){
                                checkedList = 'checked';
                                break;
                            }else checkedList = '';
                        }
                    }
                }
                id = Rui.useFixedId() ? 'LGrid-header-submenu-filter-' + this.gridId + '-' + columnId + '-' + (cntId++) : Rui.id();
                columnsHtml += ts.menuBodyRow.apply({
                    id: id,
                    rowData: '<input type="checkbox" id="' + id + '-chkbox" value="' + value + '" ' + checkedList + ' class="L-checked"> <label for="' + id + '-chkbox">' + display + '</label>'
                });
            }
            columnsHtml += '</ul>';
            columnsHtml += '<div class="L-header-sub-menu-buttons"><button id="';
            columnsHtml += Rui.useFixedId() ? 'LGrid-header-submenu-filter-' + this.gridId + '-btn' : Rui.id();
            columnsHtml += '" type="button" name="applyBtn" class="L-filter-btn">' + mm.get('$.base.msg120') + '</button></div>';
            return columnsHtml;
        },
        doRender: function(appendToNode) {
            if(this.gridView.dataSet.multiSortable !== true) {
            	for (var i = 0 ; i < this.menuItems.length; i++) {
    		    	if(this.menuItems[i].id == 'dataSort') {
    		    		this.menuItems = Rui.util.LArray.removeAt(this.menuItems, i);
    		    		break;
    		    	}
            	}
		    }
            this.createTemplate();
            this.renderMaster(this.getRenderMenuBody('master'));
            this.el.addClass('L-header-context-menu');
            this.el.on('click', this.onClick, this, true);
            this.on('show', this.onShow, this, true);
            this.on('hide', this.onHide, this, true);
            this.doRedoRender();
            this.detachEvent();
            this.attachEvent();
        },
        attachEvent: function() {
            var view = this.gridView;
            if(view) {
            	var gridPanel = view.gridPanel, ds = view.dataSet, sm = gridPanel.getSelectionModel();
                view.on('bodyScroll', this.onHideHeaderToolEl, this, true, { system: true });
                view.on('blur', this.onHideHeaderToolEl, this, true, { system: true });
                view.on('sortField', this.onSortField, this, true, { system: true });
                view.on('redoRender', this.onRedoRender, this, true, { system: true });
                if(this.el.getHeight() > gridPanel.getHeight()) {
                	this.el.setHeight(gridPanel.getHeight() - 30);
                	this.el.setStyle('overflow-y', 'scroll');
                }
                gridPanel.on('click', this.onHideHeaderToolEl, this, true, { system: true });
                gridPanel.on('widthResize', this.onHideHeaderToolEl, this, true, { system: true });
                ds.on('load', this.onLoad, this, true, { system: true });
                sm.on('selectCell', this.onSelectCell, this, true, { system: true });
            }
        },
        detachEvent: function() {
            var view = this.gridView;
            if(view) {
            	var gridPanel = view.gridPanel, ds = view.dataSet, sm = gridPanel.getSelectionModel();
                view.unOn('bodyScroll', this.onHideHeaderToolEl, this);
                view.unOn('blur', this.onHideHeaderToolEl, this);
                view.unOn('sortField', this.onSortField, this);
                view.unOn('redoRender', this.onRedoRender, this);
                gridPanel.unOn('click', this.onHideHeaderToolEl, this);
                gridPanel.unOn('widthResize', this.onHideHeaderToolEl, this);
                ds.unOn('load', this.onLoad, this);
                sm.unOn('selectCell', this.onSelectCell, this);
            }
        },
        onClick: function(e) {
            var targetEl = Rui.get(e.target);
            if(targetEl.hasClass('L-header-menu-row')) {
                var ruiRootPath = Rui.getRootPath();
                var gridView = this.gridView;
                var gridPanel = gridView.gridPanel;
                var cm = gridView.columnModel;
                if (targetEl.hasClass('freezeColumn')) {
                    cm.setFreezeColumnId(this.currColumnId);
                } else if(targetEl.hasClass('noFreezeColumn')) {
                	cm.setFreezeColumnId(null);
                } else if (targetEl.hasClass('saveExcel')) {
                    if(typeof Rui.ui.grid.LGridView === 'undefined') 
                        Rui.includeJs(ruiRootPath + '/plugins/ui/grid/LGridView.js', true);
                    if(typeof Rui.ui.grid.LGridPanel.prototype.saveExcel === 'undefined') 
                        Rui.includeJs(ruiRootPath + '/plugins/ui/grid/LGridPanelExt.js', true);
                    var fileName = (gridPanel.title || '');
                    if(fileName) fileName += '_' + Rui.util.LDate.format(new Date(), { format: '%q' }) + '.xls';
                    gridView.gridPanel.saveExcel(fileName);
                } else if (targetEl.hasClass('dataSort')) {
                    var mm = Rui.getMessageManager();
                    var handleApply = function(){
                        var bodyEl = this.headerDialog.getBody();
                        var inputList = bodyEl.select('input');
                        this.sorts = [];
                        inputList.each(function(item, i){
                            if(item.dom.checked) {
                                var colId = item.dom.className.substring(8);
                                var column = cm.getColumnById(colId);
                                var idx = cm.getIndex(column, true);
                                var hdCellEl = gridView.getHeaderCellEl(idx);
                                var val = item.dom.value;
                                column.removeHeaderCss(['L-grid-sort-asc', 'L-grid-sort-desc']);
                                hdCellEl.removeClass(['L-grid-sort-asc', 'L-grid-sort-desc']);
                                this.sorts.push({id: colId, dir: val});
                                if (val) {
                                    column.addHeaderCss('L-grid-sort-' + val);
                                    hdCellEl.addClass('L-grid-sort-' + val);
                                }
                            } 
                        }, this, true);
                        var sortInfos = {};
                        for (var i = 0, len = this.sorts.length; i < len; i++) {
                            if(this.sorts[i].dir) sortInfos[this.sorts[i].id] = this.sorts[i].dir;
                        }
                        gridView.dataSet.sorts(sortInfos);
                        this.headerDialog.submit(true);
                    };
                    var handleCancel = function(){
                        this.headerDialog.cancel(true);
                    };
                    var buttons = [{
                        text: mm.get('$.base.msg120'),
                        handler: Rui.util.LFunction.createDelegate(handleApply, this),
                        isDefault: true
                    }, {
                        text: mm.get('$.base.msg121'),
                        handler: Rui.util.LFunction.createDelegate(handleCancel, this)
                    }];
                    var dialog = this.getHeaderToolDialog(buttons);
                    dialog.setHeader('Sort');
                    dialog.setBody(this.getRenderSortColumns(this.currColumnId));
                    if(typeof Rui.dd.LDDList === 'undefined')
                        Rui.includeJs(ruiRootPath + '/plugins/dd/LDDList.js', true);
                    var liList = dialog.getBody().select('.L-header-menu-row');
                    for (var j=0, len = liList.length ; j < len ; j++) {
                        new Rui.dd.LDDList({
                            isProxy: false,
                            id: liList.getAt(j).id
                        });
                    }
                    dialog.show();
                    this.headerToolEl.hide();
                } else if (targetEl.hasClass('autoAllUpdateColumnFit')) {
                    for (var i = 0, len = cm.getColumnCount(true); i < len; i++) {
                        gridView.updateColumnFit(i);
                    }
                } else if (targetEl.hasClass('autoUpdateColumnsAutoWidth')) {
                    gridView.updateColumnsAutoWidth();
                } else if (targetEl.hasClass('dataFilter')) {
                    this.subMenuEl.html(this.getRenderFilterColumns(this.currColumnId));
                } else if(targetEl.hasClass('dataFilterClear')) {
                    gridView.dataSet.clearFilter();
                    gridView.getHeaderEl().select('.L-filtered').removeClass('L-filtered');
                    var columnList = gridView.columnModel.columnList;
                    for(var i = 0; i < columnList.length; i++){
                        columnList[i].removeHeaderCss('L-filtered');
                    }
                    var inputList = this.subMenuEl.select('input');
                    inputList.each(function(item,i){
                        if(!item.dom.checked){
                            item.dom.checked = true;
                        }
                    },this,true);
                    this.filters = {};
                } else if(targetEl.hasClass('searchDialog')) {
                	this.el.hide();
                	gridPanel.showSearchDialog();
                } else if (targetEl.hasClass('updateColumnFit')) {
                    var colIdx = cm.getIndexById(this.currColumnId);
                    gridView.updateColumnFit(colIdx);
                    this.headerToolEl.hide();
                } else if(targetEl.hasClass('browserRecommand')) {
                    var info = '<p>현재 사용하고 있는 IE 브라우져(버전 6,7,8)는 다른 브라우져에 비해서 성능이 많이 떨어집니다.<p/>';
                    info += '<p>또한 Window XP의 IE 브라우져와 Window 7 이상버전에서의 브라우져 성능은 최소 2배이상 차이가 납니다.<p/>';
                    info += '<p>쾌적환 기능을 사용하기 위해 OS 및 브라우져를 업그레이드 하거나 성능 높은 다른 브라우져를 사용하기를 권장합니다.<p/>';
                    var conf = Rui.getConfig();
                    info += '<p><a href="http://browsehappy.com" target="_new">최신 브라우저 다운로드</a></p>';
                    Rui.alert(info);
                }
                if (targetEl.hasClass('dataFilter')) {
                    this.subMenuEl.select('button').unOn('click', this.onApply, this);
                    this.subMenuEl.select('button').on('click', this.onApply, this, true);
                    this.subMenuEl.show();
                    var subMenuLeft = this.getWidth();
                    var menuLeft = this.subMenuEl.getLeft() + this.subMenuEl.getWidth();
                    if ((menuLeft + 100) > (gridView.el.getRight() - this.subMenuEl.getWidth())) 
                        this.subMenuEl.setLeft(this.subMenuEl.getWidth() * -1);
                    else 
                        this.subMenuEl.setLeft(subMenuLeft);
                    this.subMenuEl.setTop(targetEl.getTop(true) + 5);
                }
            } else if(targetEl.hasClass('L-checked-all')) {
                this.subMenuEl.select('input').each(function(item, i){
                    item.dom.checked = targetEl.dom.checked;
                });
            } else if(targetEl.hasClass('L-checked')) {
                var isAllSelect = true;
                this.subMenuEl.select('.L-checked').each(function(item, i){
                    if(!item.dom.checked) isAllSelect = false;
                });
                this.subMenuEl.select('.L-checked-all').each(function(item, i){
                    item.dom.checked = isAllSelect;
                });
            }
            Rui.util.LEvent.stopPropagation(e);
        },
        onShow: function() {
            var column = this.gridView.columnModel.getColumnById(this.currColumnId);
            column && column.getField() ? this.el.addClass('L-use-field') : this.el.removeClass('L-use-field');
            this.focusEl.focus();
        },
        onHide: function() {
            this.subMenuEl.hide();
        },
        onClickHeaderTool: function(e) {
            var cellEl = Rui.get(e.target);
            if(cellEl && (this.headerToolEl.dom == cellEl.dom || this.headerToolEl.isAncestor(cellEl.dom))) {
                this.subMenuEl.hide();
                var gridview = this.gridView;
                var currColId = this.headerToolEl.currColumnId;
                gridview.headerContextMenu.currColumnId = currColId;
                var column = gridview.columnModel.getColumnById(currColId);
                if(column) {
                    this.selectId = currColId;
                    gridview.headerContextMenu.show();
                    var menuLeft = this.headerToolEl.getLeft() + this.headerToolEl.getWidth(true) - gridview.el.getLeft();
                    if(menuLeft > (gridview.el.getRight() - 120))
                        menuLeft -= 120;
                    gridview.headerContextMenu.setLeft(menuLeft);
                }
            }
            Rui.util.LEvent.stopEvent(e);
        },
        onHideHeaderToolEl: function(e) {
            if (this.headerToolEl) 
                this.headerToolEl.hide();
            var gridView = this.gridView;
            if (gridView.headerContextMenu) 
                gridView.headerContextMenu.hide();
        },
        onHeaderMouseOver: function(e) {
            var target = e.target;
            var gridView = this.gridView;
            var cellDom = gridView.findHeaderCellDom(e.target);
            if(cellDom && !gridView.headerDisabled) {
                if(this.headerToolEl.isShow() === false || this.activeRowDom !== cellDom && target !== this.headerToolEl.dom) {
                	this.showIcon(gridView.activeHeaderColumnIndex);
                }
            }
        },
        showIcon: function(headerIndex) {
            var gridView = this.gridView;
            var column = gridView.columnModel.getColumnAt(headerIndex, true);
            if(column instanceof Rui.ui.grid.LTriggerColumn) return;
            var cellDom = gridView.getHeaderCellEl(headerIndex);
            var cellEl = Rui.get(cellDom);
            if(column && column.headerTool) {
                if(cellEl.getWidth() > 30) {
                    this.headerToolEl.currColumnId = column.id;
                    this.activeRowDom = cellDom;
                    this.headerToolEl.show();
                    var scrollLeft = (gridView.scroller) ? gridView.scroller.getScrollLeft() : gridView.headerEl.dom.scrollLeft;
                    var headerLeft = scrollLeft + cellEl.getRight() - this.headerToolEl.getWidth() - gridView.headerEl.dom.scrollLeft - gridView.el.getLeft();
                    this.headerToolEl.setTop(cellEl.dom.offsetTop);
                    if(gridView.el.getRight() - 30 < headerLeft) {
                    	this.headerToolEl.hide();
                    } else 
                    	this.headerToolEl.setLeft(headerLeft);
                }
            }
        },
        onHeaderMouseOut: function(e) {
            var gridView = this.gridView;
            var cellDom = gridView.findHeaderCellDom(e.target);
            if((this.activeRowDom && this.activeRowDom.dom) !== cellDom) {
                this.headerToolEl.hide();
                this.activeRowDom = null;
            }
        },
        onSelectCell: function(e) {
        	this.showIcon(e.col);
        },
        onApply: function(e) {
            var targetEl = Rui.get(e.target);
            var inputList = this.subMenuEl.select('input');
            var gridView = this.gridView;
            var dataSet = gridView.dataSet;
            var cm = gridView.columnModel;
            if (targetEl.hasClass('L-filter-btn')) {
                this.filters[this.selectId] = [];
                var isAllSelect = true;
                var column = cm.getColumnById(this.selectId);
                this.currField = dataSet.getFieldById(column.field);
                inputList.each(function(item, i){
                    if(i !== 0) {
                        if(item.dom.checked) {
                            var value = item.getValue();
                            if (this.currField.type === 'number' && !Rui.isEmpty(value))
                                value = parseInt(value, 10);
                            this.filters[this.selectId].push(value);
                        } 
                    }
                    if(!item.dom.checked) isAllSelect = false;
                }, this, true);
                var idx = cm.getIndex(column, true);
                var hdCellEl = gridView.getHeaderCellEl(idx);
                var filterSize = 0;
                for(var filter in this.filters){
                    if(this.filters.hasOwnProperty(filter)) filterSize++;
                }
                if (isAllSelect) {
                    gridView.dataSet.clearFilter();
                    column.removeHeaderCss('L-filtered');
                    hdCellEl.removeClass('L-filtered');
                    delete this.filters[this.selectId];
                } 
                if(filterSize > 1 || !isAllSelect){
                    column.addHeaderCss('L-filtered');
                    hdCellEl.addClass('L-filtered');
                    var filterIds = [];
                    var m;
                    for (m in this.filters)
                        filterIds.push(m);
                    gridView.dataSet.filter(function(id, record){
                        var ret = true;
                        for (var i = 0, len = filterIds.length ; i < len; i++) {
                            var filterId = filterIds[i];
                            var filterType = dataSet.getFieldById(filterId).type;
                            if(this.currField && filterType === 'date') {
                                if(Rui.util.LArray.contains(this.filters[filterId], Rui.util.LDate.format(record.get(filterId), { format: '%Y%m%d'})) === false) {
                                    ret = false;
                                    break;
                                }
                            } else if(this.currField && filterType === 'number') {
                                var recordData = record.get(filterId);
                                if(recordData === undefined || recordData === null || recordData == ''){
                                    recordData = 0;
                                }
                                if(Rui.util.LArray.contains(this.filters[filterId], recordData) === false) {
                                    ret = false;
                                    break;
                                }  
                            } else {
                                if(Rui.util.LArray.contains(this.filters[filterId], '' + record.get(filterId)) === false) {
                                    ret = false;
                                    break;
                                }
                            }
                        }
                        return ret;
                    }, this, true);
                } 
            }
            this.hide();
        },
        onRedoRender: function(e) {
            this.doRedoRender();
        },
        doRedoRender: function() {
            var gridView = this.gridView;
            var headerEl = gridView.headerEl;
            this.focusEl = Rui.get(this.el.dom.childNodes[0]); 
            this.subMenuEl = Rui.get(this.el.dom.childNodes[2]);
            var maxHeight = (gridView.height - 50);
            maxHeight = maxHeight < 0 ? 0 : maxHeight;
            this.subMenuEl.setStyle('max-height', maxHeight + 'px');
            headerEl.unOn('mouseover', this.onHeaderMouseOver, this);
            headerEl.unOn('mouseout', this.onHeaderMouseOut, this);
            headerEl.on('mouseover', this.onHeaderMouseOver, this, true);
            headerEl.on('mouseout', this.onHeaderMouseOut, this, true);
            if(this.headerToolEl)
                this.headerToolEl.unOn('click', this.onClickHeaderTool, this);
            this.headerToolEl = gridView.headerEl.select('.L-grid-header-tool').getAt(0);
            this.headerToolEl.on('click', this.onClickHeaderTool, this, true);
        },
        onSortField: function(e) {
            this.sorts = [];
            var cm = this.gridView.columnModel;
            for (var i = 0, len = cm.getColumnCount(true) ; i < len; i++) {
                var c = cm.getColumnAt(i, true);
                if(!c.field || !c.sortable) continue;
                if(e.sortField == c.field) {
                	c.removeHeaderCss('L-grid-sort-asc');
                	c.removeHeaderCss('L-grid-sort-desc');
                	if(e.sortDir) c.addHeaderCss('L-grid-sort-' + e.sortDir);
                    this.sorts.push({id:e.sortField, dir: e.sortDir});
                } else 
                    this.sorts.push({id:c.field, dir:''});
            }
        },
        onLoad: function(e) {
        	if(e.options && e.options.add === true) return;
            var view = this.gridView;
            view.getHeaderEl().select('.L-filtered').removeClass('L-filtered');
        },
        getHeaderToolDialog: function(buttons) {
            if(!this.headerDialog) {
                var cm = this.gridView.columnModel;
                var sortCnt = 0;
                for (var i = 0, len = cm.getColumnCount(true); i < len; i++) {
                    var c = cm.getColumnAt(i, true);
                    if (c.field && c.sortable)
                        sortCnt++;
                }
                this.headerDialog = new Rui.ui.LDialog({
                	id: this.gridView.gridId + '-HeaderToolDialog',
                	defaultCss: 'L-grid-header-tool-dialog',
                    width: 320,
                    height: (sortCnt * 25 + 90),
                    visible : false,
                    buttons: buttons
                });
                this.headerDialog.render(document.body);
                this.headerDialog.getBody().addClass('L-grid-header-tool-dialog');
            }
            return this.headerDialog;
        },
        destroy: function() {
            if(this.el) this.el.unOnAll();
            if(this.subMenuEl) this.subMenuEl.unOnAll();
            if(this.headerToolEl) this.headerToolEl.unOnAll();
            this.detachEvent();
            Rui.ui.grid.LHeaderContextMenu.superclass.destroy.call(this);
            return this;
        }
    });
})();