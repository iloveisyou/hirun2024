/*
 * @(#) LPager-debug.js
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
 * @description 페이징 처리를 할 수 있게 지원하는 객체
 * @namespace Rui.ui
 * @plugin js,css
 * @class LPager
 * @sample default
 * @extends Rui.ui.LUIComponent
 * @constructor LPager
 * @param {Object} oConfig The intial LPager.
 */
Rui.ui.LPager = function(oConfig){
    var config = oConfig || {};
    config = Rui.applyIf(config, Rui.getConfig().getFirst('$.ext.pager.defaultProperties'));
    if (config.gridPanel) {
        config.gridView = config.gridPanel.getView();
        config.dataSet = config.gridView.getDataSet();
    }
    Rui.applyObject(this, config, true);

    /**
     * @description 페이지가 변경 되기전에 발생하는 이벤트
     * @event beforeChange
     * @sample default
     * @param {int} pageNumber 이동된 page 번호
     * @param {int} beforeViewPageNumber 이동전 page 번호
     */
    this.createEvent('beforeChange');
    /**
     * @description page number 선택으로 page가 변경된후 발생하는 event
     * @event changed
     * @sample default
     * @param {int} pageNumber 이동된 page 번호
     */
    this.createEvent('changed');
    Rui.ui.LPager.superclass.constructor.call(this);
};

Rui.extend(Rui.ui.LPager, Rui.ui.LUIComponent, {
    /**
     * @description 객체의 이름
     * @property otype
     * @private
     * @type {String}
     */
    otype: 'Rui.ui.LPager',
    /**
     * @description 페이지번호: 출력할 현재 페이지번호
     * 페이지당 데이터(레코드)수 가 10이며, 페이지번호가 3인 경우 데이터(레코드)의 출력 범위는 31~40 이다.
     * @config pageNumber
     * @sample default
     * @type {int}
     * @default 1
     */
    /**
     * @description 페이지번호: 출력할 현재 페이지번호
     * 페이지당 데이터(레코드)수 가 10이며, 페이지번호가 3인 경우 데이터(레코드)의 출력 범위는 31~40 이다.
     * @property pageNumber
     * @private
     * @type {int}
     * @default 1
     */
    pageNumber: 1,
    /**
     * @description 페이지당 데이터(레코드) 수: 한개의 페이지에 보여질 데이터(레코드)의 수
     * 총 500개의 데이터가 존재한다면, 이 값인 pageSize가 10인 경우 총 50개의 페이지로 나눠진다. 
     * @config pageSize
     * @sample default
     * @type {int}
     * @default 10
     */
    /**
     * @description 페이지당 데이터(레코드) 수: 한개의 페이지에 보여질 데이터(레코드)의 수
     * 총 500개의 데이터가 존재한다면, 이 값인 pageSize가 10인 경우 총 50개의 페이지로 나눠진다. 
     * @property pageSize
     * @private
     * @type {int}
     * @default 10
     */
    pageSize: 10,
    /**
     * @description 페이지그룹 크기: 사용자가 페이지를 이동시키는데 사용할 페이지 네비게이터에 표시될 페이저 링크의 갯수
     * 총 500개의 데이터가 존재하며, pageSize가 10인 경우 총 50개의 페이지로 나눠진다. 이때 이 값인 pageGroupSize가 10인 경우
     * 페이지 네비게이터에 총 5개의 페이지그룹이 생성된다.
     * @config pageGroupSize
     * @sample default
     * @type {int}
     * @default 10
     */
    /**
     * @description 페이지그룹 크기: 사용자가 페이지를 이동시키는데 사용할 페이지 네비게이터에 표시될 페이저 링크의 갯수
     * 총 500개의 데이터가 존재하며, pageSize가 10인 경우 총 50개의 페이지로 나눠진다. 이때 이 값인 pageGroupSize가 10인 경우
     * 페이지 네비게이터에 총 5개의 페이지그룹이 생성된다.
     * @property pageGroupSize
     * @private
     * @type {int}
     * @default 10
     */
    pageGroupSize: 10,
    /**
     * @description 페이저인 페이지 이동 링크 사이에 구분자를 넣을 지 여부
     * @config useDivider
     * @sample default
     * @type {boolean}
     * @default false
     */
    /**
     * @description 페이저인 페이지 이동 링크 사이에 구분자를 넣을 지 여부
     * @property useDivider
     * @private
     * @type {boolean}
     * @default: false
     */
    useDivider: false,
    /**
     * @description 총 행수
     * @property totalCount
     * @private
     * @type {int}
     * @default 0
     */
    totalCount: 0,
    /**
     * @description 총 page수
     * @property pageCount
     * @private
     * @type {int}
     * @default 0
     */
    pageCount: 0,
    /**
     * @description 총 page group수
     * @property pageGroupCount
     * @private
     * @type {int}
     * @default 0
     */
    pageGroupCount: 0,
    /**
     * @description 현재 group의 시작 page번호
     * @property startPageNumber
     * @type {int}
     * @private
     * @default 1
     */
    startPageNumber: 1,
    /**
     * @description 현재 group 번호
     * @property pageGroupNumber
     * @type {int}
     * @private
     * @default 1
     */
    pageGroupNumber: 1,
    /**
     * @description page번호는 기본적으로 숫자이지만 itemRenderer 함수를 정의해서 변경할 수 있다.  인자는 pageNumber가 넘어온다.
     * @property itemRenderer
     * @private
     * @type {function}
     * @default null
     */
    itemRenderer: null,
    /**
     * @description 페이지 구분자로 문자를 사용할 경우 문자 기술
     * @property itemDividerText
     * @private
     * @type {string}
     */
    itemDividerText: '',
    /**
     * @description 첫페이지 이동 표시에 문자를 사용할 경우 문자 기술
     * @property firstPageText
     * @private
     * @type {string}
     */
    firstPageText: '',
    /**
     * @description 이전 페이지 그룹 이동 표시에 문자를 사용할 경우 문자 기술
     * @property prevPageGroupText
     * @private
     * @type {string}
     */
    prevPageGroupText: '',
    /**
     * @description 이전 페이지 이동 표시에 문자를 사용할 경우 문자 기술
     * @property prevPageText
     * @type {string}
     */
    prevPageText: '&nbsp',
    /**
     * @description 다음 페이지 이동 표시에 문자를 사용할 경우 문자 기술
     * @property nextPageText
     * @private
     * @type {string}
     */
    nextPageText: '&nbsp',
    /**
     * @description 다음 페이지 그룹 이동 표시에 문자를 사용할 경우 문자 기술
     * @property nextPageGroupText
     * @type {string}
     */
    nextPageGroupText: '',
    /**
     * @description 마지막 페이지 이동 표시에 문자를 사용할 경우 문자 기술
     * @property lastPageText
     * @private
     * @type {string}
     */
    lastPageText: '',
    /**
     * @description 넓이 지정, 기본값 100%
     * @property width
     * @private
     * @type {int}
     * @default null
     */
    width: null,
    /**
     * @description 높이 지정, 기본값 24
     * @property height
     * @private
     * @type {int}
     * @default 24
     */
    height: 24,
    /**
     * @description paging dataset
     * @property dataSet
     * @private
     * @type {Rui.data.LDataSet}
     * @default null
     */
    dataSet: null,
    /**
     * @description 첫페이지 마지막 페이지 표시에 페이지 수 링크 표시 여부
     * @property showPageCount
     * @private
     * @type {boolean}
     * @default true
     */
    showPageCount: false,
    /**
     * @description 페이지 이동을 위해 서버로 전송될 요청의 query string에 포함될 pageNumber명으로 이 값을 key로 하여 설정된 pageNumber가 전송된다.
     * ex) ./list?pageNumber=3
     * @config pageNumberFieldName
     * @type {string}
     * @default 'pageNumber'
     */
    /**
     * @description 페이지 이동을 위해 서버로 전송될 요청의 query string에 포함될 pageNumber명으로 이 값을 key로 하여 설정된 pageNumber가 전송된다.
     * ex) ./list?pageNumber=3
     * @property pageNumberFieldName
     * @private
     * @type {string}
     * @default 'pageNumber'
     */
    pageNumberFieldName: 'pageNumber',
    /**
     * @description 페이지 이동을 위해 서버로 전송될 요청의 query string에 포함될 pageSize 명으로 이 값을 Key로 하여 설정된 pageSize가 전송된다.
     * ex) ./list?pageSize=10
     * @config pageSizeFieldName
     * @type {string}
     * @default 'pageSize'
     */
    /**
     * @description 페이지 이동을 위해 서버로 전송될 요청의 query string에 포함될 pageSize 명으로 이 값을 Key로 하여 설정된 pageSize가 전송된다.
     * ex) ./list?pageSize=10
     * @property pageSizeFieldName
     * @private
     * @type {string}
     * @default 'pageSize'
     */
    pageSizeFieldName: 'pageSize',
    /**
     * @description 페이지 이동을 위해 서버로 전송될 요청의 query string에 포함될 시작 데이터(레코드) index 명으로 이 값을 Key로 하여 시작 데이터(레코드)의 index가 전송된다.
     * ex) pageSize가 10이며, pageNumber가 2인 경우 출력될 데이터의 범위는 11~20이다. 이때의 startowIndex는 11이며 다음과 같이 전송된다.
     * ./list?pageNumber=1&pageSize=10&startRowIndex=11
     * @config viewPageStartRowIndexFieldName
     * @type {string}
     * @default 'startRowIndex'
     */
    /**
     * @description 페이지 이동을 위해 서버로 전송될 요청의 query string에 포함될 시작 데이터(레코드) index 명으로 이 값을 Key로 하여 시작 데이터(레코드)의 index가 전송된다.
     * ex) pageSize가 10이며, pageNumber가 2인 경우 출력될 데이터의 범위는 11~20이다. 이때의 startowIndex는 11이며 다음과 같이 전송된다.
     * ./list?pageNumber=1&pageSize=10&startRowIndex=11
     * @property viewPageStartRowIndexFieldName
     * @private
     * @type {string}
     * @default 'startRowIndex'
     */
    viewPageStartRowIndexFieldName: 'startRowIndex',
    /**
     * @description 페이지 정렬을 위해 서버로 전송될 요청의 query string에 포함될 정렬 대상 필드명으로 이 값을 key로 하여 정렬대상 필드명이 전송된다.
     * ex) ./list?sortField=NAME
     * @config sortFieldName
     * @type {string}
     * @default sortField
     */
    /**
     * @description 페이지 정렬을 위해 서버로 전송될 요청의 query string에 포함될 정렬 대상 필드명으로 이 값을 key로 하여 정렬대상 필드명이 전송된다.
     * ex) ./list?sortField=NAME
     * @property sortFieldName
     * @private
     * @type {string}
     * @default sortField
     */
    sortFieldName: 'sortField',
    /**
     * @description 페이지 정렬을 위해 서버로 전송될 요청의 query string에 포함될 정렬 방향으로 이 값을 key로 하여 정렬 방향이 전송된다.
     * ex) ./list?sortDir=DESC
     * @config sortDirFieldName
     * @type {string}
     * @default sortDir
     */
    /**
     * @description 페이지 정렬을 위해 서버로 전송될 요청의 query string에 포함될 정렬 방향으로 이 값을 key로 하여 정렬 방향이 전송된다.
     * ex) ./list?sortDir=DESC
     * @property sortDirFieldName
     * @private
     * @type {string}
     * @default sortDir
     */
    sortDirFieldName: 'sortDir',
    /**
     * @description 페이지 정렬을 위해 서버로 전송될 요청의 query string에 포함될 정렬 조건이며, 이 값을 key로 DB Query이 생성되어 전송된다.  
     * ex) ./list?sortQuery=order by NAME DESC
     * @config sortQueryFieldName
     * @type {string}
     * @default devonOrderBy
     */
    /**
     * @description 페이지 정렬을 위해 서버로 전송될 요청의 query string에 포함될 정렬 조건이며, 이 값을 key로 DB Query이 생성되어 전송된다.  
     * ex) ./list?sortQuery=order by NAME DESC
     * @property sortQueryFieldName
     * @private
     * @type {string}
     * @default devonOrderBy
     */
    sortQueryFieldName: 'sortQuery',
    /**
     * @description sort 정보등을 알아내기 위한것.
     * @property gridView
     * @private
     * @type {Rui.ui.grid.LGridView}
     * @default null
     */
    gridView: null,
    /**
     * @description sort 정보등을 알아내기 위한것.
     * @property gridPanel
     * @private
     * @type {Rui.ui.grid.LGridPanel}
     * @default null
     */
    gridPanel: null,
    /**
     * @description gridview가 있을 경우 gridpanel footer에 pager를 넣을지 여부
     * @property addingGridFooter
     * @private
     * @type {boolean}
     * @default true
     */
    addingGridFooter: true,
    /**
     * @description pager에 의해 dataset이 load 되었는지 여부, pager에 의해 load되지 않았다면 1page로 이동한다.
     * @property loadDataSetByPager
     * @private
     * @type {boolean}
     * @default false
     */
    loadDataSetByPager : false,
    /**
     * @description 첫번째 load인지 검사 flag, 최초 load 이후에는 false가 된다.
     * @property isFirstLoading
     * @private
     * @type {boolean}
     * @default true
     */
    isFirstLoading : true,
        /**
     * @description 더블클릭 방지 기능을 사용할 지 여부
     * 더블클릭 방지 기능을 사용할 경우 버튼이 클릭되는 순간부터 disableDbClickInterval에 설정된 시간동안 버튼이 disable된다.
     * @config disableDbClick
     * @sample default
     * @type {boolean}
     * @default true
     */
    /**
     * @description 더블클릭 방지 기능을 사용할 지 여부
     * 더블클릭 방지 기능을 사용할 경우 버튼이 클릭되는 순간부터 disableDbClickInterval에 설정된 시간동안 버튼이 disable된다.
     * @property disableDbClick
     * @private
     * @type {boolean}
     */
    disableDbClick: true,
    /**
     * @description 더블클릭 방지 기능을 사용할 경우의 disable interval
     * @config disableDbClickInterval
     * @sample default
     * @type {int}
     * @default 500
     */
    /**
     * @description 더블클릭 방지 기능을 사용할 경우의 disable interval
     * @property disableDbClickInterval
     * @private
     * @type {int}
     */
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

    /**
     * @description page관련 숫자 계산
     * @method computePage
     * @private
     * @param {int} pageNumber 현재 page번호
     * @return {void}
     */
    computePage: function(pageNumber){
        if (this.dataSet != null) {
            this.setTotalCount(this.dataSet.getTotalCount(), false);
        }
        this.pageNumber = pageNumber || this.pageNumber || 1;
        this.pageCount = Math.floor(this.totalCount / this.pageSize) + 1;
        //행수가 딱 맞으면 -1
        if (this.totalCount % this.pageSize == 0) {
            if (this.pageCount > 1) {
                this.pageCount = this.pageCount - 1;
            }
        }

        var boundary = 0;
        //경계부분이면 1을 빼준다.
        if (this.pageNumber % this.pageGroupSize == 0) {
            boundary = -1;
        }

        this.startPageNumber = (Math.floor(this.pageNumber / this.pageGroupSize) + boundary) * this.pageGroupSize + 1;
        this.pageGroupNumber = Math.floor(this.pageNumber / this.pageGroupSize) + 1 + boundary;
        this.pageGroupCount = Math.ceil(this.pageCount / this.pageGroupSize);
    },
    /**
     * @description template 생성
     * @method createTemplate
     * @protected
     * @return {void}
     */
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
    /**
     * @description pager 기본 구조 dom 생성
     * @method renderMaster
     * @protected
     * @return {void}
     */
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
        //this.el.setHeight(this.height);
    },
    /**
     * @description pager에 표시한 페이지 번호 dom load
     * @method renderItems
     * @protected
     * @return {void}
     */
    renderItems: function(){
        var num = 0;
        var pageNumList = '';
        //var selected = false;//없는 page번호를 요청할 경우 에러 발생
        for (var i = 0; i < this.pageGroupSize; i++) {
            //페이지 번호 생성.
            num = i + this.startPageNumber; //이전 페이지 번호는 현재 페이지 전번호
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
    /**
     * @description page 숫자 구분자 html text생성
     * @method getRenderItemDivider
     * @protected
     * @return {void}
     */
    getRenderItemDivider: function(){
        return (this.templates || {}).itemDivider.apply({
            divider: this.itemDividerText
        });
    },
    /**
     * @description page 표시 item html text 생성
     * @method getRenderItem
     * @protected
     * @param {int} pageNumber render할 page번호
     * @param {string} selected 현재 page일 경우 select하기위한 css class
     * @return {void}
     */
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
    /**
     * @description 객체를 Render하는 메소드
     * @method render
     * @public
     * @param {String|Object} appendToNode 객체를 붙이고자 하는 Node정보
     * @return {HTMLElement}
     */
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
                //this.gridPanel.fillHeight();
                this.gridPanel.unOn('widthResize', this.onWidthResize, this);
                this.gridPanel.on('widthResize', this.onWidthResize, this, true);
            }
        }

        this.renderEvent.fire();

        this._rendered = true;
        this.afterRender(appendToNode);

        return this.el.dom;
    },
    /**
     * @description render시 호출되는 메소드
     * @method doRender
     * @protected
     * @param {String|Object} container 부모객체 정보
     * @return {void}
     */
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
    /**
    * @description panel footer의 width를 구해서 할당.
    * @method updateWidth
    * @protected
    * @return {void}
    */
    updateWidth: function(){
        this.el.setWidth(Rui.get(this.gridPanel.footer).getWidth());
    },
    /**
    * @description auto width의 경우 panel width가 조정될 경우 재계산
    * @method onWidthResize
    * @protected
    * @return {void}
    */
    onWidthResize: function(e){
        this.updateWidth();
    },
    /**
     * @description 페이지 이동
     * @method goPage
     * @public
     * @param {int} number 이동할 page번호
     * @param {boolean} reload [optional] dataset을 reload할지 여부. default는 dataset을 reload 한다.
     * @return {boolean}
     */
    goPage: function(number, reload){
        if (this.pageNumber != number)
            return this.setPageNumber(number, reload);
        return false;
    },
    /**
     * @description 페이지 이동의 중복 실행을 막는다.
     * @method timergoPage
     * @private
     * @param {Object} options beforeScrollTop 이전 top 좌료를 가지는 객체
     * @return {void}
     */
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
    /**
     * @description 페이지 이동의 실행 여부를 리턴한다.
     * @method isTimer
     * @private
     * @return {boolean}
     */
    isTimer: function() {
        return !!this.pagerTask;
    },
    /**
     * @description 페이지 이동의 실행을 취소한다.
     * @method isTimer
     * @private
     * @return {boolean}
     */
    cancelTimer: function() {
        if(this.pagerTask) {
            this.pagerTask.cancel();
            delete this.pagerTask;
        }
    },
    /**
     * @description first page로 이동
     * @method onFirstPage
     * @private
     * @param {Object} e
     * @return {void}
     */
    onFirstPage: function(e){
        this.moveFirstPage();
    },
    /**
     * @description first page로 이동
     * @method moveFirstPage
     * @public
     * @return {void}
     */
    moveFirstPage: function(reload){
    	this._setPageNumber(1, reload);
    },
    /**
     * @description prev page group으로 이동
     * @method onPrevGroup
     * @private
     * @param {object} e
     * @return {void}
     */
    onPrevGroup: function(e){
        this.movePrevGroup();
    },
    /**
     * @description prev page group으로 이동
     * @method movePrevGroup
     * @public
     * @return {void}
     */
    movePrevGroup: function(){
        if (this.startPageNumber != 1) {
        	this._setPageNumber(this.startPageNumber - 1);
        }
    },
    /**
     * @description prev page로 이동
     * @method onPrevPage
     * @private
     * @param {object} e
     * @return {void}
     */
    onPrevPage: function(e){
        this.movePrevPage();
    },
    /**
     * @description prev page로 이동
     * @method movePrevPage
     * @public
     * @return {void}
     */
    movePrevPage: function(){
        if (this.pageNumber != 1) {
        	this._setPageNumber(this.pageNumber - 1);
        }
    },
    /**
     * @description next page로 이동
     * @method onNextPage
     * @private
     * @param {object} e
     * @return {void}
     */
    onNextPage: function(e){
        this.moveNextPage();
    },
    /**
     * @description next page로 이동
     * @method moveNextPage
     * @public
     * @return {void}
     */
    moveNextPage: function(){
        if (this.pageNumber != this.pageCount) {
        	this._setPageNumber(this.pageNumber + 1);
        }
    },
    /**
     * @description next page group으로 이동
     * @method onNextGroup
     * @private
     * @param {object} e
     * @return {void}
     */
    onNextGroup: function(e){
        this.moveNextGroup();
    },
    /**
     * @description next page group으로 이동
     * @method moveNextGroup
     * @public
     * @return {void}
     */
    moveNextGroup: function(){
        if (this.pageGroupNumber != this.pageGroupCount) {
            var pageNumber = this.pageGroupNumber * this.pageGroupSize + 1;
        	this._setPageNumber(pageNumber);
        }
    },
    /**
     * @description last page로 이동
     * @method onLastPage
     * @private
     * @param {object} e
     * @return {void}
     */
    onLastPage: function(e){
        this.moveLastPage();
    },
    /**
     * @description last page로 이동
     * @method moveLastPage
     * @public
     * @return {void}
     */
    moveLastPage: function(){
        if (this.pageNumber != this.pageCount) {
        	this._setPageNumber(this.pageCount);
        }
    },
    /**
     * @description page 번호 클릭시 실행됨
     * @method onItemsElClick
     * @private
     * @param {object} e
     * @return {void}
     */
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
    /**
     * @description 현재 페이지를 다른 페이지로 이동한다. 
     * 단 pagerMode가 scroll인 경우는 그리드의 스크롤러를 이동시켜서 페이지가 이동되도록 한다.
     * @method _setPageNumber
     * @protected
     * @sample default
     * @param {int} pageNumber 현재 page번호
     * @param {boolean} reload [optional] 이동될 페이지를 reload한다. 기본값 true로 기본 reload하나 pagerMode에선 무조건 reload한다.
     */
    _setPageNumber: function(pageNumber, reload){
    	if(this.gridView && this.gridView.pagerMode == 'scroll'){
    		this.gridView.scroller.go(pageNumber > 0 ? pageNumber -1 : 0);
    	}else
    		this.setPageNumber(pageNumber, reload);
    },
    /**
     * @description itemsEl 가져오기
     * @method getItemsEl
     * @private
     * @return {void}
     */
    getItemsEl: function(){
        return this.el.select('div.' + this.CLASS_PAGER_ITEMS, true);
    },
    /**
     * @description page선택시 선택 표시하기
     * @method initSelectedItemEl
     * @private
     * @return {void}
     */
    initSelectedItemEl: function(){
        //renderItems 안한 경우는 class만 설정
        this.selectedItemEl.removeClass(this.CLASS_PAGER_SELECTED);
        this.selectedItemEl = this.itemsEl.select('div.' + this.CLASS_PAGER_ITEM).getAt(this.pageNumber - this.startPageNumber);
        this.selectedItemEl.addClass(this.CLASS_PAGER_SELECTED);
    },
    /**
     * @description page정보 설정하기, item이 새로 rendering됨
     * @method setPage
     * @protected
     * @param {Object} config config.pageNumber, config.pageSize, config.pageGroupSize, config.totalCount
     * @return {void}
     */
    setPage: function(config){
        this.setPageNumber(config.pageNumber, false);
        this.setPageSize(config.pageSize, false);
        this.setPageGroupSize(config.pageGroupSize, false);
        this.setTotalCount(config.totalCount, false);
        this.renderItems();
    },
    /**
     * @description 현재 페이지를 번호를 리턴한다.
     * @method getPageNumber
     * @public
     * @return {int} pageNumber 현재 page번호
     */
    getPageNumber: function() {
        return this.pageNumber;
    },
    /**
     * @description 현재 페이지를 다른 페이지로 이동한다.
     * @method setPageNumber
     * @public
     * @sample default
     * @param {int} pageNumber 현재 page번호
     * @param {boolean} reload [optional] 이동될 페이지를 reload한다. 기본값 true
     * @return {boolean}
     */
    setPageNumber: function(pageNumber, reload){
        //class만 변경한다.
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
            //page가 다른 pageGroup 소속이면 다시 그려 준다.
            if (oldPageGroupNumber != this.pageGroupNumber || !this.loadDataSetByPager) {
                //새로그리면 selected Item도 설정된다.
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
                //class만 변경 하기
                this.initSelectedItemEl();
            }

            this.initVisible();

            if((Rui.isEmpty(reload) || reload == true) && this.dataSet != null) {
                this.reloadDataSet();
            } else this.fireEvent('changed', { pageNumber: this.pageNumber});
            return true;
        }
    },
    /**
     * @description server sorting
     * @method onSortField
     * @private
     * @param {object} e e.target(gridView), e.sortField, e.sortDir
     * @return {void}
     */
    onSortField: function(e){
        //e.target(gridView), e.sortField, e.sortDir
        if (this.dataSet.getTotalCount() > 0) {
            this.reloadDataSet();
        }
    },
    /**
     * @description page click시 dataSet request하기
     * @method reloadDataSet
     * @private
     * @return {void}
     */
    reloadDataSet: function(){
        if (this.dataSet != null) {
            this.loadDataSetByPager = true;
            var params = Rui.util.LObject.clone(this.dataSet.lastOptions.params);
            this.dataSet.lastOptions.params = Rui.merge(this.dataSet.lastOptions.params, this.getParams());
            this.dataSet.load(this.dataSet.lastOptions);
            //load end init params
            this.dataSet.lastOptions.params = Rui.util.LObject.clone(params);
        }
    },
    /**
     * @description 서버에 전송하기 위해 paging 관련 parameter 값을 얻어온다.
     * @method getParams
     * @public
     * @sample default
     * @param {int } pageNumber [optional] 해당 page번호를 가지는 page naviagtion query를 return
     * @return {object} parameters
     */
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
                // TODO 차후 상위 버전에서는 sortInfo.dir값이 빈문자열일 경우 order by 값 처리를 안하는걸로 수정해야 함.
            	params[this.sortQueryFieldName] = 'order by ' + Rui.util.LString.camelToHungarian(sortInfo.field) + ' ' + sortInfo.dir;
            	if(this.applyParamsFn) params = this.applyParamsFn(sortInfo, params);
            }
        }
        return params;
    },
    /**
     * @description 현재 페이지에 따른 링크 표시 여부 설정
     * @method initDisplay
     * @private
     * @return {void}
     */
    initDisplay: function(){
        this.initVisible();
        if (this.showPageCount) {
            var page = this.pageCount > 1 ? 'pages' : 'page';
            this.lastPageEl.html(this.pageCount + page);
            this.firstPageEl.html('1page');
        }
    },
    /**
     * @description 현재 페이지 번호에 따른 pager 링크 요소 show/hide하기
     * @method initVisible
     * @private
     * @return {void}
     */
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
    /**
     * @description 페이지당 데이터(레코드) 수인 pageSize값을 변경한 후 필요시 페이저를 다시 랜더링한다.
     * @method setPageSize
     * @public
     * @param {int} pageSize
     * @param {boolean} rerender 다시 render할지 여부, default로 true
     * @return {void}
     */
    setPageSize: function(pageSize, rerender){
        rerender = rerender == null ? true : rerender;
        //기본적으로 다시 그린다.
        if (this.pageSize != pageSize) {
            this.pageSize = pageSize;
            if (rerender) {
                this.rerender();
            }
        }
    },
    /**
     * @description 페이지그룹 크기 값을 변경한 후 필요시 페이저를 다시 랜더링한다. 
     * @method setPageGroupSize
     * @public
     * @param {int} pageGroupSize
     * @param {boolean} rerender 다시 render할지 여부, default로 true
     * @return {void}
     */
    setPageGroupSize: function(pageGroupSize, rerender){
        rerender = rerender == null ? true : rerender;
        if (this.pageGroupSize != pageGroupSize) {
            this.pageGroupSize = pageGroupSize;
            if (rerender) {
                this.rerender();
            }
        }
    },
    /**
     * @description 전체 데이터(레코드) 수를 재 설정하며 필요시 페이저를 다시 랜더링한다.
     * @method setTotalCount
     * @public
     * @param {int} totalCount
     * @param {boolean} rerender 다시 render할지 여부, default로 true
     * @return {void}
     */
    setTotalCount: function(totalCount, rerender){
        rerender = rerender == null ? true : rerender;
        if (this.totalCount != totalCount) {
            this.totalCount = totalCount;
            if (rerender) {
                this.rerender();
            }
        }
    },

    /**
     * @description dataSet on load시 실행할 method
     * @method onLoadDataSet
     * @protected
     * @return {void}
     */
    onLoadDataSet: function(){
        this.rerender(true);
        this.isFirstLoading = false;
    },
    /**
     * @description dataSet data Changed시 실행할 method
     * @method onDataChanged
     * @protected
     * @return {void}
     */
    onDataChanged: function(){
        this.rerender(true);
    },
    /**
     * @description pager 다시 그리기
     * @method rerender
     * @protected
     * @return {void}
     */
    rerender: function(initPage){
        this.computePage();
        this.renderItems();
        if (initPage && !this.isFirstLoading) {
            if (!this.loadDataSetByPager) {
                //pager에 의해 click이 안되었으면 1페이지로 이동
                this.moveFirstPage(false);
            }
            else {
                this.loadDataSetByPager = false;
            }
        }
        this.fireEvent('changed', {pageNumber: this.pageNumber});
    },
    /**
     * @description dataSet관련 초기화
     * @method initDataSet
     * @private
     * @param {boolean} rerender re render할지 여부, default true
     * @return {void}
     */
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
    /**
     * @description gridView 초기화
     * @method initGridView
     * @private
     * @return {void}
     */
    initGridView: function(){
        if (this.gridView != null) {
            //remote로 변경
            this.gridView.isRemoteSort = true;
            this.gridView.unOn('sortField', this.onSortField, this);
            this.gridView.on('sortField', this.onSortField, this, true);
        }
    },
    /**
     * @description dataSet 재 할당하기
     * @method setDataSet
     * @public
     * @param {Rui.data.LDataSet} dataSet
     * @return {void}
     */
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

        // for(var item in itemList){
        //     item.removeClass('L-pager-disable');
        // }
    },

    onItemsElDisable: function(){
        var itemList = this.el.select('.L-pager-wrap');
        for(var index = 0 ; index<itemList.length ; index++){
            itemList.getAt(index).addClass('L-pager-disable');
        }
    }

});