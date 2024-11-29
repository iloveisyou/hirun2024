/*
 * @(#) LPager.js
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

Rui.ui.LPager = function(oConfig){
    var config = oConfig || {};
    config = Rui.applyIf(config, Rui.getConfig().getFirst('$.ext.pager.defaultProperties'));
    if (config.gridPanel) {
        config.gridView = config.gridPanel.getView();
        config.dataSet = config.gridView.getDataSet();
    }
    Rui.applyObject(this, config, true);
    this.createEvent('beforeChange');
    this.createEvent('changed');
    Rui.ui.LPager.superclass.constructor.call(this);
};
Rui.extend(Rui.ui.LPager, Rui.ui.LUIComponent, {
    otype: 'Rui.ui.LPager',
    pageNumber: 1,
    pageSize: 10,
    pageGroupSize: 10,
    useDivider: false,
    totalCount: 0,
    pageCount: 0,
    pageGroupCount: 0,
    startPageNumber: 1,
    pageGroupNumber: 1,
    itemRenderer: null,
    itemDividerText: '',
    firstPageText: '',
    prevPageGroupText: '',
    prevPageText: '&nbsp',
    nextPageText: '&nbsp',
    nextPageGroupText: '',
    lastPageText: '',
    width: null,
    height: 24,
    dataSet: null,
    showPageCount: false,
    pageNumberFieldName: 'pageNumber',
    pageSizeFieldName: 'pageSize',
    viewPageStartRowIndexFieldName: 'startRowIndex',
    sortFieldName: 'sortField',
    sortDirFieldName: 'sortDir',
    sortQueryFieldName: 'sortQuery',
    gridView: null,
    gridPanel: null,
    addingGridFooter: true,
    loadDataSetByPager : false,
    isFirstLoading : true,
    disableDbClick: true,
    disableDbClickInterval: 500,
    pagerNumberRe : new RegExp('L-pager-number-([^\\s]+)', ''),
    CLASS_PAGER: 'L-pager',
    CLASS_PAGER_WRAP: 'L-pager-wrap',
    CLASS_PAGER_SELECTED: 'L-pager-selected',
    CLASS_PAGER_FIRST: 'L-pager-first',
    CLASS_PAGER_FIRST_WRAP: 'L-pager-first-wrap',
    CLASS_PAGER_PREV_GROUP: 'L-pager-prev-group',
    CLASS_PAGER_PREV_GROUP_WRAP: 'L-pager-prev-group-wrap',
    CLASS_PAGER_PREV_WRAP: 'L-pager-prev-wrap',
    CLASS_PAGER_PREV: 'L-pager-prev',
    CLASS_PAGER_NEXT: 'L-pager-next',
    CLASS_PAGER_NEXT_WRAP: 'L-pager-next-wrap',
    CLASS_PAGER_NEXT_GROUP: 'L-pager-next-group',
    CLASS_PAGER_NEXT_GROUP_WRAP: 'L-pager-next-group-wrap',
    CLASS_PAGER_LAST: 'L-pager-last',
    CLASS_PAGER_LAST_WRAP: 'L-pager-last-wrap',
    CLASS_PAGER_ITEMS: 'L-pager-items',
    CLASS_PAGER_ITEMS_WRAP: 'L-pager-items-wrap',
    CLASS_PAGER_ITEM: 'L-pager-item',
    CLASS_PAGER_ITEM_WRAP: 'L-pager-item-wrap',
    CLASS_PAGER_ITEM_DIVIDER: 'L-pager-item-divider',
    CLASS_PAGER_ITEM_DIVIDER_WRAP: 'L-pager-item-divider-wrap',
    CLASS_HIDE_VISIBILITY : 'L-hide-visibility',
    computePage: function(pageNumber){
        if (this.dataSet != null) {
            this.setTotalCount(this.dataSet.getTotalCount(), false);
        }
        this.pageNumber = pageNumber || this.pageNumber || 1;
        this.pageCount = Math.floor(this.totalCount / this.pageSize) + 1;
        if (this.totalCount % this.pageSize == 0) {
            if (this.pageCount > 1) {
                this.pageCount = this.pageCount - 1;
            }
        }
        var boundary = 0;
        if (this.pageNumber % this.pageGroupSize == 0) {
            boundary = -1;
        }
        this.startPageNumber = (Math.floor(this.pageNumber / this.pageGroupSize) + boundary) * this.pageGroupSize + 1;
        this.pageGroupNumber = Math.floor(this.pageNumber / this.pageGroupSize) + 1 + boundary;
        this.pageGroupCount = Math.ceil(this.pageCount / this.pageGroupSize);
    },
    createTemplate: function(){
        var ts = this.templates ||
        {};
        if (!ts.master) {
            ts.master = new Rui.LTemplate('<table border="0" cellpadding="0" cellspacing="0" class="' + this.CLASS_PAGER_WRAP + '">',
            '<td align="center" class="' + this.CLASS_PAGER_FIRST_WRAP + '"><div class="' + this.CLASS_PAGER_FIRST + '">{firstPage}</div></td>',
            '<td align="center" class="' + this.CLASS_PAGER_PREV_GROUP_WRAP + '"><div class="' + this.CLASS_PAGER_PREV_GROUP + '">{prevPageGroup}</div></td>',
            !this.prevPageText ? '' : '<td align="center" class="' + this.CLASS_PAGER_PREV_WRAP + '"><div class="' + this.CLASS_PAGER_PREV + '">{prevPage}</div></td>',
            '<td align="center" class="' + this.CLASS_PAGER_ITEMS_WRAP + '"><div class="' + this.CLASS_PAGER_ITEMS + '">{items}</div></td>',
            !this.nextPageText ? '' : '<td align="center" class="' + this.CLASS_PAGER_NEXT_WRAP + '"><div class="' + this.CLASS_PAGER_NEXT + '">{nextPage}</div></td>',
            '<td align="center" class="' + this.CLASS_PAGER_NEXT_GROUP_WRAP + '"><div class="' + this.CLASS_PAGER_NEXT_GROUP + '">{nextPageGroup}</div></td>',
            '<td align="center" class="' + this.CLASS_PAGER_LAST_WRAP + '"><div class="' + this.CLASS_PAGER_LAST + '">{lastPage}</div></td>', '</table>');
        }
        if (!ts.items) {
            ts.items = new Rui.LTemplate('<table border="0" cellspacing="0" cellpadding="0" class="' + this.CLASS_PAGER_ITEMS_WRAP + '"><tr>{items}</tr></table>');
        }
        if (!ts.itemDivider) {
            ts.itemDivider = new Rui.LTemplate('<td align="center" class="' + this.CLASS_PAGER_ITEM_DIVIDER_WRAP + '"><div class="' + this.CLASS_PAGER_ITEM_DIVIDER + '">{divider}</div></td>');
        }
        if (!ts.item) {
            ts.item = new Rui.LTemplate('<td align="center" class="' + this.CLASS_PAGER_ITEM_WRAP + ' L-pager-number-{pageNumber}"><div class="' + this.CLASS_PAGER_ITEM + ' {selected}"><a>{item}</a></div></td>');
        }
        this.templates = ts;
    },
    renderMaster: function(){
        this.el.html((this.templates || {}).master.apply({
            firstPage: this.firstPageText,
            prevPageGroup: this.prevPageGroupText,
            prevPage: this.prevPageText,
            items: '',
            nextPage: this.nextPageText,
            nextPageGroup: this.nextPageGroupText,
            lastPage: this.lastPageText
        }));
        this.el.addClass(this.CLASS_PAGER);
        this.el.addClass('L-fixed');
        if(this.width)this.el.setWidth(this.width);
    },
    renderItems: function(){
        var num = 0;
        var pageNumList = '';
        for (var i = 0; i < this.pageGroupSize; i++) {
            num = i + this.startPageNumber; 
            if (num <= this.pageCount && num > 0) {
                if (num == this.pageNumber) {
                    pageNumList += this.getRenderItem(num, this.CLASS_PAGER_SELECTED);
                    selected = true;
                }
                else {
                    pageNumList += this.getRenderItem(num);
                }
                if (this.useDivider && i < this.pageGroupSize - 1 && num < this.pageCount) {
                    pageNumList += this.getRenderItemDivider();
                }
            }
            else {
                break;
            }
        }
        this.itemsEl.html((this.templates || {}).items.apply({
            items: pageNumList
        }));
        this.selectedItemEl = this.itemsEl.select('div.' + this.CLASS_PAGER_SELECTED, true);
        this.initDisplay();
    },
    getRenderItemDivider: function(){
        return (this.templates || {}).itemDivider.apply({
            divider: this.itemDividerText
        });
    },
    getRenderItem: function(pageNumber, selected){
        selected = selected || '';
        var item = pageNumber;
        if (this.itemRenderer != null) {
            item = this.itemRenderer(pageNumber);
        }
        return (this.templates || {}).item.apply({
            pageNumber: pageNumber,
            selected: selected,
            item: item
        });
    },
    render: function(appendToNode){
        if (this.gridView && this.addingGridFooter) {
            appendToNode = document.createElement('div');
        }
        this.createContainer(appendToNode);
        this.doRender(appendToNode);
        if (appendToNode) {
            this.appendTo(appendToNode);
        }
        if(this.gridView){
            this.gridView.pagerMode = this.mode;
            this.gridView.pager = this;
            if(this.gridView.pagerMode) this.el.addClass('L-mode-' + this.gridView.pagerMode);
            if (this.gridView && this.addingGridFooter) {
                this.gridPanel.setFooter(appendToNode);
                this.gridPanel.unOn('widthResize', this.onWidthResize, this);
                this.gridPanel.on('widthResize', this.onWidthResize, this, true);
            }
        }
        this.renderEvent.fire();
        this._rendered = true;
        this.afterRender(appendToNode);
        return this.el.dom;
    },
    doRender: function(container){
        this.createTemplate();
        this.initGridView();
        this.initDataSet(false);
        this.computePage();
        this.renderMaster();
        this.firstPageEl = this.el.select('div.' + this.CLASS_PAGER_FIRST, true);
        this.prevPageGroupEl = this.el.select('div.' + this.CLASS_PAGER_PREV_GROUP, true);
        this.prevPageEl = this.el.select('div.' + this.CLASS_PAGER_PREV, true);
        this.nextPageEl = this.el.select('div.' + this.CLASS_PAGER_NEXT, true);
        this.nextPageGroupEl = this.el.select('div.' + this.CLASS_PAGER_NEXT_GROUP, true);
        this.lastPageEl = this.el.select('div.' + this.CLASS_PAGER_LAST, true);
        this.itemsEl = this.getItemsEl();
        this.renderItems();
        this.firstPageEl.on('click', this.onFirstPage, this, true);
        this.prevPageGroupEl.on('click', this.onPrevGroup, this, true);
        if(this.prevPageText)
            this.prevPageEl.on('click', this.onPrevPage, this, true);
        if(this.nextPageText)
            this.nextPageEl.on('click', this.onNextPage, this, true);
        this.nextPageGroupEl.on('click', this.onNextGroup, this, true);
        this.lastPageEl.on('click', this.onLastPage, this, true);
        this.itemsEl.on('click', this.onItemsElClick, this, true);
    },
    updateWidth: function(){
        this.el.setWidth(Rui.get(this.gridPanel.footer).getWidth());
    },
    onWidthResize: function(e){
        this.updateWidth();
    },
    goPage: function(number, reload){
        if (this.pageNumber != number)
            return this.setPageNumber(number, reload);
        return false;
    },
    timerGoPage: function(options) {
        if(!this.pagerTask) {
            this.pagerTask = Rui.later(50, this, function(){
                var startRow = this.gridView.scroller.getStartRow();
                startRow++;
                if(this.getPageNumber() === startRow) {
                    this.cancelTimer();
                } else {
                    if(this.goPage(startRow) === false) 
                        this.gridView.scroller.setScrollTop(options.beforeScrollTop, true);
                }
            });
        }
    },
    isTimer: function() {
        return !!this.pagerTask;
    },
    cancelTimer: function() {
        if(this.pagerTask) {
            this.pagerTask.cancel();
            delete this.pagerTask;
        }
    },
    onFirstPage: function(e){
        this.moveFirstPage();
    },
    moveFirstPage: function(reload){
    	this._setPageNumber(1, reload);
    },
    onPrevGroup: function(e){
        this.movePrevGroup();
    },
    movePrevGroup: function(){
        if (this.startPageNumber != 1) {
        	this._setPageNumber(this.startPageNumber - 1);
        }
    },
    onPrevPage: function(e){
        this.movePrevPage();
    },
    movePrevPage: function(){
        if (this.pageNumber != 1) {
        	this._setPageNumber(this.pageNumber - 1);
        }
    },
    onNextPage: function(e){
        this.moveNextPage();
    },
    moveNextPage: function(){
        if (this.pageNumber != this.pageCount) {
        	this._setPageNumber(this.pageNumber + 1);
        }
    },
    onNextGroup: function(e){
        this.moveNextGroup();
    },
    moveNextGroup: function(){
        if (this.pageGroupNumber != this.pageGroupCount) {
            var pageNumber = this.pageGroupNumber * this.pageGroupSize + 1;
        	this._setPageNumber(pageNumber);
        }
    },
    onLastPage: function(e){
        this.moveLastPage();
    },
    moveLastPage: function(){
        if (this.pageNumber != this.pageCount) {
        	this._setPageNumber(this.pageCount);
        }
    },
    onItemsElClick: function(e){
        var dom = e.target;
        var itemDom = Rui.util.LDom.findParent(dom, 'td.' + this.CLASS_PAGER_ITEM_WRAP, 5);
        if (itemDom) {
            if(itemDom.className) {
                var m = itemDom.className.match(this.pagerNumberRe);
                if(m && m[1]){
                    this._setPageNumber(parseInt(m[1], 10));
                }
            }
        }
    },
    _setPageNumber: function(pageNumber, reload){
    	if(this.gridView && this.gridView.pagerMode == 'scroll'){
    		this.gridView.scroller.go(pageNumber > 0 ? pageNumber -1 : 0);
    	}else
    		this.setPageNumber(pageNumber, reload);
    },
    getItemsEl: function(){
        return this.el.select('div.' + this.CLASS_PAGER_ITEMS, true);
    },
    initSelectedItemEl: function(){
        this.selectedItemEl.removeClass(this.CLASS_PAGER_SELECTED);
        this.selectedItemEl = this.itemsEl.select('div.' + this.CLASS_PAGER_ITEM).getAt(this.pageNumber - this.startPageNumber);
        this.selectedItemEl.addClass(this.CLASS_PAGER_SELECTED);
    },
    setPage: function(config){
        this.setPageNumber(config.pageNumber, false);
        this.setPageSize(config.pageSize, false);
        this.setPageGroupSize(config.pageGroupSize, false);
        this.setTotalCount(config.totalCount, false);
        this.renderItems();
    },
    getPageNumber: function() {
        return this.pageNumber;
    },
    setPageNumber: function(pageNumber, reload){
        if (this.pageNumber != pageNumber) {
            if(this.fireEvent('beforeChange', {
                pageNumber: pageNumber
            }) === false) {
                this.cancelTimer();
                return false;
            }
            var oldPageGroupNumber = this.pageGroupNumber;
            this.pageNumber = pageNumber;
            this.computePage();
            if (oldPageGroupNumber != this.pageGroupNumber || !this.loadDataSetByPager) {
                this.renderItems();
                if(this.disableDbClick) {
                    if(this.disableDbClick == false) return;
                    this.onItemsElDisable();
                    var me = this;
                    this._timeout = setTimeout(function(){
                        me.onItemsElEnable();
                    }, this.disableDbClickInterval);
                }
            }
            else {
                this.initSelectedItemEl();
            }
            this.initVisible();
            if((Rui.isEmpty(reload) || reload == true) && this.dataSet != null) {
                this.reloadDataSet();
            } else this.fireEvent('changed', { pageNumber: this.pageNumber});
            return true;
        }
    },
    onSortField: function(e){
        if (this.dataSet.getTotalCount() > 0) {
            this.reloadDataSet();
        }
    },
    reloadDataSet: function(){
        if (this.dataSet != null) {
            this.loadDataSetByPager = true;
            var params = Rui.util.LObject.clone(this.dataSet.lastOptions.params);
            this.dataSet.lastOptions.params = Rui.merge(this.dataSet.lastOptions.params, this.getParams());
            this.dataSet.load(this.dataSet.lastOptions);
            this.dataSet.lastOptions.params = Rui.util.LObject.clone(params);
        }
    },
    getParams: function(pageNumber){
        var params = {};
        pageNumber = pageNumber == null || pageNumber == undefined ? this.pageNumber : pageNumber;
        params[this.pageNumberFieldName] = pageNumber;
        params[this.viewPageStartRowIndexFieldName] = pageNumber * this.pageSize - (this.pageSize - 1);
        params[this.pageSizeFieldName] = this.pageSize;
        if (this.gridView != null) {
            var sortInfo = this.gridView.getLastSortInfo();
            if (sortInfo.field) {
                params[this.sortFieldName] = sortInfo.field || '';
                params[this.sortDirFieldName] = sortInfo.dir || '';
            	params[this.sortQueryFieldName] = 'order by ' + Rui.util.LString.camelToHungarian(sortInfo.field) + ' ' + sortInfo.dir;
            	if(this.applyParamsFn) params = this.applyParamsFn(sortInfo, params);
            }
        }
        return params;
    },
    initDisplay: function(){
        this.initVisible();
        if (this.showPageCount) {
            var page = this.pageCount > 1 ? 'pages' : 'page';
            this.lastPageEl.html(this.pageCount + page);
            this.firstPageEl.html('1page');
        }
    },
    initVisible: function(){
        this.firstPageEl.removeClass(this.CLASS_HIDE_VISIBILITY);
        this.prevPageGroupEl.removeClass(this.CLASS_HIDE_VISIBILITY);
        this.prevPageEl.removeClass(this.CLASS_HIDE_VISIBILITY);
        this.nextPageEl.removeClass(this.CLASS_HIDE_VISIBILITY);
        this.nextPageGroupEl.removeClass(this.CLASS_HIDE_VISIBILITY);
        this.lastPageEl.removeClass(this.CLASS_HIDE_VISIBILITY);
        if (this.pageCount == 1) {
            this.firstPageEl.addClass(this.CLASS_HIDE_VISIBILITY);
            this.prevPageGroupEl.addClass(this.CLASS_HIDE_VISIBILITY);
            this.prevPageEl.addClass(this.CLASS_HIDE_VISIBILITY);
            this.nextPageEl.addClass(this.CLASS_HIDE_VISIBILITY);
            this.nextPageGroupEl.addClass(this.CLASS_HIDE_VISIBILITY);
            this.lastPageEl.addClass(this.CLASS_HIDE_VISIBILITY);
        } else {
            if (this.pageNumber == 1) {
                this.firstPageEl.addClass(this.CLASS_HIDE_VISIBILITY);
                this.prevPageGroupEl.addClass(this.CLASS_HIDE_VISIBILITY);
                this.prevPageEl.addClass(this.CLASS_HIDE_VISIBILITY);
            }
            if (this.pageNumber == this.pageCount) {
                this.nextPageEl.addClass(this.CLASS_HIDE_VISIBILITY);
            }
            if (this.pageGroupNumber == 1) {
                this.firstPageEl.addClass(this.CLASS_HIDE_VISIBILITY);
                this.prevPageGroupEl.addClass(this.CLASS_HIDE_VISIBILITY);
            }
            if (this.pageGroupNumber == this.pageGroupCount) {
                this.nextPageGroupEl.addClass(this.CLASS_HIDE_VISIBILITY);
                this.lastPageEl.addClass(this.CLASS_HIDE_VISIBILITY);
            }
        }
    },
    setPageSize: function(pageSize, rerender){
        rerender = rerender == null ? true : rerender;
        if (this.pageSize != pageSize) {
            this.pageSize = pageSize;
            if (rerender) {
                this.rerender();
            }
        }
    },
    setPageGroupSize: function(pageGroupSize, rerender){
        rerender = rerender == null ? true : rerender;
        if (this.pageGroupSize != pageGroupSize) {
            this.pageGroupSize = pageGroupSize;
            if (rerender) {
                this.rerender();
            }
        }
    },
    setTotalCount: function(totalCount, rerender){
        rerender = rerender == null ? true : rerender;
        if (this.totalCount != totalCount) {
            this.totalCount = totalCount;
            if (rerender) {
                this.rerender();
            }
        }
    },
    onLoadDataSet: function(){
        this.rerender(true);
        this.isFirstLoading = false;
    },
    onDataChanged: function(){
        this.rerender(true);
    },
    rerender: function(initPage){
        this.computePage();
        this.renderItems();
        if (initPage && !this.isFirstLoading) {
            if (!this.loadDataSetByPager) {
                this.moveFirstPage(false);
            }
            else {
                this.loadDataSetByPager = false;
            }
        }
        this.fireEvent('changed', {pageNumber: this.pageNumber});
    },
    initDataSet: function(rerender){
        rerender = rerender == null ? true : rerender;
        if (this.dataSet != null) {
            this.dataSet.unOn('load', this.onLoadDataSet, this);
            this.dataSet.on('load', this.onLoadDataSet, this, true);
            this.dataSet.unOn('dataChanged', this.onDataChanged, this);
            this.dataSet.on('dataChanged', this.onDataChanged, this, true);
            if (rerender) {
                this.rerender();
            }
        }
    },
    initGridView: function(){
        if (this.gridView != null) {
            this.gridView.isRemoteSort = true;
            this.gridView.unOn('sortField', this.onSortField, this);
            this.gridView.on('sortField', this.onSortField, this, true);
        }
    },
    setDataSet: function(dataSet){
        if (dataSet != null) {
            this.dataSet = dataSet;
            this.initDataSet();
        }
    },
    onItemsElEnable: function(){
        var itemList = this.el.select('.L-pager-wrap');
        for(var index = 0 ; index<itemList.length ; index++){
            itemList.getAt(index).removeClass('L-pager-disable');
        }
    },
    onItemsElDisable: function(){
        var itemList = this.el.select('.L-pager-wrap');
        for(var index = 0 ; index<itemList.length ; index++){
            itemList.getAt(index).addClass('L-pager-disable');
        }
    }
});