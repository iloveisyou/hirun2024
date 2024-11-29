/*
 * @(#) LUnorderedList-debug.js
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
 * @description LUnorderedList
 * @module ui
 * @namespace Rui.ui
 * @class LUnorderedList
 * @extends Rui.ui.LUIComponent
 * @constructor
 * @protected
 * @param {Object} oConfig The intial LUnorderedList.
 */
if(!Rui.ui.LUnorderedList){
/**
 * tree나 menu와 같이 계층 구조를 가지는 객체들의 수정용(CUD) 상위 추상 클래스
 * @namespace Rui.ui
 * @plugin /ui/tree/rui_tree.js,/ui/tree/rui_tree.css
 * @class LUnorderedList
 * @extends Rui.ui.LUIComponent
 * @sample default
 * @constructor LUnorderedList
 * @protected
 * @param {Object} config The intial LUnorderedList.
 */
Rui.ui.LUnorderedList = function(config){
    config = config || {};
    config = Rui.applyIf(config, Rui.getConfig().getFirst('$.ext.unorderedList.defaultProperties'));
    if(Rui.platform.isMobile) config.useAnimation = false;
    /**
     * @description node click시 발생하는 event, node가 collapse/expand toggle된다.
     * @event nodeClick
     * @sample default
     * @param {Rui.ui.LUnorderedList} target this객체
     * @param {Rui.ui.LUnorderedListNode} node click한 node object
     */
    this.createEvent('nodeClick');
    /**
     * @description childDataSet을 지정했을 경우 node click시 발생하는 event로 child dataset을 load하면 된다.
     * @event dynamicLoadChild
     * @sample default
     * @param {Rui.ui.LUnorderedList} target this객체
     * @param {Rui.ui.LUnorderedListNode} node click한 node object
     * @param {Object} parentId click한 node의 record.get(this.fields.id)한 값
     */
    this.createEvent('dynamicLoadChild');
    /**
     * @description 리스트의 각 node가 선택되어 해당 node가 focus 되었을 경우 발생하는 이벤트
     * @event focusChanged
     * @sample default
     * @param {Rui.ui.LUnorderedList} target this객체
     * @param {Rui.ui.LUnorderedListNode} oldNode 이전 focus node
     * @param {Rui.ui.LUnorderedListNode} newNode 현재 focus node
     */
    this.createEvent('focusChanged');
    /**
     * @description node가 닫쳐졌을때 발생하는 이벤트
     * @event collapse
     * @sample default
     * @param {Rui.ui.LUnorderedList} target this객체
     * @param {Rui.ui.LUnorderedListNode} node
     */
    this.createEvent('collapse');
    /**
     * @description node를 expand했을 때 발생
     * @event expand
     * @sample default
     * @param {Rui.ui.LUnorderedList} target this객체
     * @param {Rui.ui.LUnorderedListNode} node
     */
    this.createEvent('expand');
    /**
     * @description dataSet의 내용으로 전체를 다시 그렸을때 발생하는 이벤트
     * @event renderData
     * @sample default
     */
    this.renderDataEvent = this.createEvent('renderData', {isCE:true});
    /**
     * @description setSyncDataSet 메소드가 호출되면 수행하는 이벤트
     * @event syncDataSet
     * @param {Object} target this객체
     * @param {boolean} isSync sync 여부
     */
    this.createEvent('syncDataSet');

    Rui.ui.LUnorderedList.superclass.constructor.call(this, config);
};

Rui.extend(Rui.ui.LUnorderedList, Rui.ui.LUIComponent, {
    /**
     * @description 객체의 문자열
     * @property otype
     * @private
     * @type {String}
     */
    otype: 'Rui.ui.LUnorderedList',
    /**
     * dataset
     * @config dataSet
     * @type {Rui.data.LDataSet}
     * @default null
     */
    /**
     * dataset
     * @property dataSet
     * @type {Rui.data.LDataSet}
     */
    dataSet: null,
    /**
     * @description label출력시 사용되는 renderer
     * @config renderer
     * @sample default
     * @type {Function}
     * @default null
     */
    /**
     * @description label출력시 사용되는 renderer
     * @property renderer
     * @type {Function}
     */
    renderer: null,
     /**
     * @description endDepth을 지정할 경우 해당 depth이상은 생성하지 않는다.
     * @property endDepth
     * @type {int}
     */
    endDepth: null,
    /**
     * A reference to the Node currently having the focus or null if none.
     * @property currentFocus
     * @type {Rui.ui.LUnorderedListNode}
     */
    currentFocus: null,
    /**
     * 마지막에 FOCUS되었던 노드 id 저장, dataSet reload시 사용.
     * @private
     * @property lastFocusId
     * @type {Object}
     */
    lastFocusId: undefined,
    /**
     * 마지막에 FOCUS되었던 노드 다시 focus할 지 여부.  dataSet load시.
     * @config focusLastest
     * @type {boolean}
     * @default true
     */
    /**
     * 마지막에 FOCUS되었던 노드 다시 focus할 지 여부.  dataSet load시.
     * @property focusLastest
     * @type Boolean
     */
    focusLastest: true,
    /**
     * 이전에 focus된 node
     * @private
     * @property prevFocusNode
     * @type {Rui.ui.LUnorderedListNode}
     * @default null
     */
    prevFocusNode: null,
    /**
     * 동적으로 load시 사용할 child용 dataSet
     * @config childDataSet
     * @type {Rui.data.LDataSet}
     * @default null
     */
    /**
     * 동적으로 load시 사용할 child용 dataSet
     * @property childDataSet
     * @type {Rui.data.LDataSet}
     * @default null
     */
    childDataSet: null,
    /**
     * fields hasChild의 값이 hasChildValue일 경우 child를 가지고 있는 것으로 처리한다.  child를 가지고 있는 여부를 나타내는 flag값중 참인값
     * @config hasChildValue
     * @type {Object}
     * @default 1
     */
    /**
     * fields hasChild의 값이 hasChildValue일 경우 child를 가지고 있는 것으로 처리한다.  child를 가지고 있는 여부를 나타내는 flag값중 참인값
     * @property hasChildValue
     * @type {Object}
     * @default 1
     */
    hasChildValue: 1,
    /**
     * 최초에 펼처질 depth를 결정한다.
     * @config defaultOpenDepth
     * @type {int}
     * @default -1
     */
    /**
     * tree나 menu가 로드될 경우 최초에 펼처질 레벨
     * @property defaultOpenDepth
     * @type {int}
     * @default -1
     */
    defaultOpenDepth: -1,
    /**
     * tree나 menu가 로드될 경우 최초에 펼처질 레벨의 index
     * @config defaultOpenTopIndex
     * @sample default
     * @type {int}
     * @default -1
     */
    /**
     * menu가 로드될 경우 최초에 펼처질 레벨의 index
     * @property defaultOpenTopIndex
     * @type {int}
     * @default -1
     */
    defaultOpenTopIndex: -1,
    /**
     * 하나의 node만 열리게 설정하고 하나가 열리면 다른 node는 다 닫힌다.
     * @config onlyOneTopOpen
     * @sample default
     * @type {boolean}
     * @default false
     */
    /**
     * 하나의 node만 열리게 설정하고 하나가 열리면 다른 node는 다 닫힌다.
     * @property onlyOneTopOpen
     * @type {boolean}
     * @default false
     */
    onlyOneTopOpen: false,
    /**
     * 각 node div에 title을 지정하여 브라우저 기본 tooltip이 나타나도록 한다.  
     * @config useTooltip
     * @sample default
     * @type {boolean}
     * @default false
     */
    /**
     * 각 node div에 title을 지정하여 브라우저 기본 tooltip이 나타나도록 한다.
     * @property useTooltip
     * @type {boolean}
     * @default false
     */
    useTooltip: false,
    /**
     * cache 및 신규 pk 생성등의 문제로 id-parentId 값을 json으로 관리
     * [
     *      {id:'r0001',hasChild:1,parentNodeInfo:null,children:[
     *          {id:'r0010',hasChild:1,children:[]}
     *          ,{id:'r0011',hasChild:1,children:[]}
     *      ]}
     *      ,{id:'r0002',hasChild:1,children:[
     *          {id:'r0020',hasChild:1,children:[]}
     *          ,{id:'r0021',hasChild:1,children:[]}
     *      ]}
     *      ,{id:'r0003',hasChild:1,children:[]}
     * ]
     * @private
     * @property ulData
     * @type {Array} json array
     */
    ulData: [],
    /**
     * 현재 선택된 node를 collapse, expand할 경우에 사용될 cache정보
     * @private
     * @property lastNodeInfos
     * @type {Rui.ui.LUnorderedListNode}
     * @default undefined
     */
    lastNodeInfos: undefined,
    /**
     * @description Expand 또는 Collapse시에 Animation 사용 할지 여부
     * @config useAnimation
     * @type {boolean}
     * @default false
     */
    /**
     * @description Expand 또는 Collapse시에 Animation 사용 할지 여부
     * @property useAnimation
     * @type {boolean}
     * @default false
     */
    useAnimation: false,
    /**
     * @description 메뉴의 animation효과 작동 시간 기본 0.3초
     * @property animDuration
     * @type {float}
     * @default 0.3
     */
    animDuration: 0.3,
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
     * @private
     */
    syncDataSet: true,
    /**
     * @description li width를 고정할 경우 사용.
     * @property liWidth
     * @type {int}
     * @default null
     */
    liWidth: null,
    /**
     * @description apply to treeview dom Id
     * @property container
     * @type {string}
     * @default null
     */
    container: null,
    /**
     * @description mark시 자식 노드들도 함께 자동으로 mark할지 여부
     * @config autoMark
     * @sample default
     * @type {boolean}
     * @default true
     */
    /**
     * @description mark시 자식 노드들도 함께 자동으로 mark할지 여부
     * @property autoMark
     * @type {boolean}
     * @default true
     */
    autoMark: true,
    /**
     * context context menu를 연결하는 LContextMenu의 객체
     * @config contextMenu
     * @sample default
     * @type {Rui.ui.menu.LContextMenu}
     * @default null
     */
    /**
     * context context menu를 연결하는 LContextMenu의 객체
     * @property contextMenu
     * @type {Rui.ui.menu.LContextMenu}
     * @default null
     */
    contextMenu: null,
     /**
     * 복사하고 붙여넣기시 tempId 사용할 지 여부, tempId를 사용하지 않으면 직접 id를 생성해서 작업해야 한다.
     * id는 업무 로직에 따라 생성 권장. 임시 id는 사용시 주의 요망(timestamp기반 값이 들어가므로 업무적으로 실제 id로 변경 처리 필요)
     * @config useTempId
     * @sample default
     * @type {boolean}
     * @default false
     */
    /**
     * 복사하고 붙여넣기시 tempId 사용할 지 여부, tempId를 사용하지 않으면 직접 id를 생성해서 작업해야 한다.
     * id는 업무 로직에 따라 생성 권장. 임시 id는 사용시 주의 요망(timestamp기반 값이 들어가므로 업무적으로 실제 id로 변경 처리 필요)
     * @property useTempId
     * @type {boolean}
     * @default false
     */
    useTempId: false,
    /**
     * 많은 record의 변경시 tree에 적용되지 않도록 할 때 처리.  결과만 적용되도록 처리할 때 사용.
     * @private
     * @property DATASET_EVENT_LOCK
     * @type {Object}
     */
    DATASET_EVENT_LOCK: {
        ADD: false,
        UPDATE: false,
        REMOVE: false,
        ROW_POS_CHANGED: false,
        ROW_SELECT_MARK: false
    },
    /**
     * 웹접근성 지원을위한 container의 role atrribute
     * @private
     * @property accessibilityELRole
     * @type {String}
     */
    accessibilityELRole: null,
    
    NODE_CONSTRUCTOR: 'Rui.ui.LUnorderedListNode',
    CSS_BASE: 'L-ul',
    CLASS_UL_FIRST: 'L-ul-first',
    CLASS_UL_DEPTH: 'L-ul-depth',
    CLASS_UL_HAS_CHILD_CLOSE_MID: 'L-ul-has-child-close-mid',
    CLASS_UL_HAS_CHILD_CLOSE_LAST: 'L-ul-has-child-close-last',
    CLASS_UL_HAS_CHILD_OPEN_MID: 'L-ul-has-child-open-mid',
    CLASS_UL_HAS_CHILD_OPEN_LAST: 'L-ul-has-child-open-last',
    CLASS_UL_HAS_NO_CHILD_MID: 'L-ul-has-no-child-mid',
    CLASS_UL_HAS_NO_CHILD_LAST: 'L-ul-has-no-child-last',
    CLASS_UL_NODE: 'L-ul-node',
    CLASS_UL_LI: 'L-ul-li',
    CLASS_UL_LI_DEPTH: 'L-ul-li-depth',
    CLASS_UL_LI_INDEX: 'L-ul-li-index',
    CLASS_UL_LI_DIV_DEPTH: 'L-ul-li-div-depth',
    CLASS_UL_LI_LINE: 'L-ul-li-line',
    CLASS_UL_LI_SELECTED: 'L-ul-li-selected',
    CLASS_UL_FOCUS_TOP_NODE: 'L-ul-focus-top-node',
    CLASS_UL_FOCUS_PARENT_NODE: 'L-ul-focus-parent-node',
    CLASS_UL_FOCUS_NODE: 'L-ul-focus-node',
    CLASS_UL_MARKED_NODE: 'L-ul-marked-node',
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

        this.dataSet.unOn('beforeLoad', this.doBeforeLoad, this);
        this.dataSet.unOn('load', this.onLoadDataSet, this);
        this.dataSet.unOn('add', this.onAddData, this);
        this.dataSet.unOn('dataChanged', this.onChangeData, this);
        this.dataSet.unOn('update', this.onUpdateData, this);
        this.dataSet.unOn('remove', this.onRemoveData, this);
        this.dataSet.unOn('undo', this.onUndoData, this);
        this.dataSet.unOn('rowPosChanged', this.onRowPosChangedData, this);
        this.dataSet.unOn('marked', this.onMarked, this);

        if(isSync === true) {
            this.dataSet.on('beforeLoad', this.doBeforeLoad, this, true, {system: true});
            this.dataSet.on('load', this.onLoadDataSet, this, true, {system: true});
            this.dataSet.on('add', this.onAddData, this, true, {system: true});
            this.dataSet.on('dataChanged', this.onChangeData, this, true, {system: true});
            this.dataSet.on('update', this.onUpdateData, this, true, {system: true});
            this.dataSet.on('remove', this.onRemoveData, this, true, {system: true});
            this.dataSet.on('undo', this.onUndoData, this, true, {system: true});
            this.dataSet.on('rowPosChanged', this.onRowPosChangedData, this, true, {system: true});
            this.dataSet.on('marked', this.onMarked, this, true, {system: true});
        }
        this.syncDataSet = isSync;
        this.fireEvent('syncDataSet', {
            target: this,
            isSync: isSync
        });
    },
    /**
     * @description dataSet과 sync상태를 셋팅하는 메소드 (대량 변경건 처리시 사용)
     * @method setSyncDataSet
     * @sample default
     * @param {boolean} isSync isSync값
     * @return {void}
     */
    setSyncDataSet: function(isSync) {
        this.cfg.setProperty('syncDataSet', isSync);
        if(isSync) this.doRenderData();
    },
    /**
     * node state, node의 상태의 종류로 state를 update하거나 check할때 사용된다.
     * @private
     * @property NODE_STATE
     * @type {object} json
     */
    NODE_STATE: {
        HAS_CHILD: 0,
        HAS_NO_CHILD: 1,
        MID: 2,
        LAST: 3,
        OPEN: 4,
        CLOSE: 5,
        MARK: 6,
        UNMARK: 7,
        FOCUS: 8,
        UNFOCUS: 9,
        FOCUS_TOP: 10,
        FOCUS_PARENT: 11,
        UNFOCUS_PARENT: 12
    },
    /**
     * @description 객체의 이벤트 초기화 메소드
     * @method initEvents
     * @protected
     * @return {void}
     */
    initEvents: function(){
        Rui.ui.LUnorderedList.superclass.initEvents.call(this);

        this._setSyncDataSet('syncDataSet', [this.syncDataSet]);
        if (this.childDataSet != null)
            this.childDataSet.on('load', this.onLoadChildDataSet, this, true, {system: true});
        this.on('expand', this.onExpand, this, true);

        if (this.contextMenu)
            this.contextMenu.on('triggerContextMenu', this.onTriggerContextMenu, this, true);

        this.on('dynamicLoadChild', this.onDynamicLoadChild, this, true);
    },
    /**
     * @description 객체를 Config정보를 초기화하는 메소드
     * @method initDkfaultConfig
     * @protected
     * @return {void}
     */
    initDefaultConfig: function() {
        Rui.ui.LUnorderedList.superclass.initDefaultConfig.call(this);
        this.cfg.addProperty('syncDataSet', {
                handler: this._setSyncDataSet,
                value: this.syncDataSet,
                validator: Rui.isBoolean
        });
    },
    /**
     * @description template 생성
     * @method createTemplate
     * @protected
     * @return {void}
     */
    createTemplate: function() {
        var ts = this.templates || {};
        if (!ts.master) {
            ts.master = new Rui.LTemplate('<ul class="{cssUlFirst} {cssUlDepth}" {accRole}>{li}</ul>');
        }

        if (!ts.li) {
            ts.li = new Rui.LTemplate(
                '<li class="{cssUlLiIndex} {cssUlLiDepth} {cssUlLiOthers}" style="{style}" {accRole}>',
                '<div class="{cssUlNode} {cssUlLiDivDepth} {cssNodeState} {cssUlNodeId} {cssMark}"' + (this.useTooltip ? 'title="{content}"' : '' ) + '>{content}</div>',
                '{childUl}',
                '</li>'
            );
        }
        this.templates = ts;
    },
    /**
     * ul html text 생성해서 가져오기
     * @private
     * @method getUlHtml
     * @param {Object} parentId 부모 id
     * @param {int} depth depth
     * @param {Array} nodeInfos json array로 ul을 만들 node 정보
     * @return {string} ul element의 html text
     */
    getUlHtml: function(parentId, depth, nodeInfos){
        var ts = this.templates || {};
        var nodes = '';
        if (this.endDepth === null || depth <= this.endDepth) {
            //render될때와 dynamic으로 생성될 때 두번 사용됨.  nodeInfos가 들어오면 dynamic add child, 안들어오면 render
            nodeInfos = nodeInfos ? nodeInfos : this.getChildNodeInfos(parentId);
            var nodeInfosLength = nodeInfos ? nodeInfos.length : 0;
            depth = !Rui.isEmpty(depth) ? depth + 1 : 0;

            if (nodeInfosLength > 0) {
                var liNodes = '';
                for (var i = 0; i < nodeInfosLength; i++) {
                    liNodes += this.getLiHtml(nodeInfos[i], depth, (nodeInfosLength - 1 == i ? true : false), i);
                }
                var aRole = this.getAccessibilityUlRole(depth);
                nodes = ts.master.apply({
                    cssUlFirst: (depth == 0 ? this.CLASS_UL_FIRST : ''),
                    cssUlDepth: this.CLASS_UL_DEPTH + '-' + depth,
                    accRole: (Rui.useAccessibility() && aRole ? 'role="'+aRole+'"' : ''),
                    li: liNodes
                });
            }
        }
        return nodes;
    },
    /**
     * li html text 생성해서 가져오기
     * @private
     * @method getLiHtml
     * @param {Object} nodeInfo json으로된 node정보
     * @param {int} depth depth
     * @param {boolean} isLast 마지막 여부
     * @return {string} li element의 html text
     */
    getLiHtml: function(nodeInfo, depth, isLast, index){
        depth = Rui.isEmpty(depth) ? 0 : depth;
        if(Rui.isEmpty(index)){
            var nodeInfos = nodeInfos ? nodeInfos : this.getChildNodeInfos(this.fields.rootValue);
            index = Rui.isEmpty(index) ? nodeInfos.length : index;
        }
        
        var ts = this.templates || {},
            record = this.getRecordByNodeInfo(nodeInfo),
            hasChild = nodeInfo.hasChild,
            cssNodeState = this.getNodeStateClass(hasChild, isLast),
            cssLine = ((this.defaultOpenDepth >= depth && isLast !== true) ? this.CLASS_UL_LI_LINE : ''),
            isMarked = this.isMarked(record),
            cssMarked = isMarked ? ' ' + this.CLASS_UL_MARKED_NODE : '',
            cssSelected = ((this.defaultOpenDepth >= depth && isLast !== true) ? this.CLASS_UL_LI_SELECTED : ''),
            width = this.liWidth ? 'width:' + this.liWidth + 'px;' : '',
            childUl = cssUlLiOthers = '';
        
        if(record.dataSet.remainRemoved !== true && record.state === Rui.data.LRecord.STATE_DELETE) return '';
        
        if(this.defaultOpenDepth >= depth) {
            var childNodeInfos = this.getChildNodeInfos(record.get(this.fields.id));
            childUl += this.getUlHtml(record.get(this.fields.id), depth, childNodeInfos, isLast);
            cssNodeState = hasChild ? (isLast ? this.CLASS_UL_HAS_CHILD_OPEN_LAST : this.CLASS_UL_HAS_CHILD_OPEN_MID) : this.CLASS_UL_HAS_NO_CHILD_LAST;
        }
        
        cssUlLiOthers = isLast ? this.CLASS_UL_LI + '-last' : (index == 0 ? this.CLASS_UL_LI + '-first' : '');
        if(record.state != Rui.data.LRecord.STATE_NORMAL) cssUlLiOthers += ' L-node-state-' + this.getState(record);
        
         var aRole = this.getAccessibilityLiRole();
         var content = this.getContent(record, cssNodeState, isMarked);
         var html = ts.li.apply({
             cssUlLiIndex: this.CLASS_UL_LI_INDEX + '-' + (index !== undefined ? index : ''),
             cssUlLiDepth: this.CLASS_UL_LI_DEPTH + '-' + depth + (cssLine ? ' ' + cssLine : ''),
             cssUlLiOthers: cssUlLiOthers,
             style: width,
             cssUlNode: this.CLASS_UL_NODE,
             cssUlLiDivDepth: this.CLASS_UL_LI_DIV_DEPTH + '-' + depth,
             cssNodeState: cssNodeState,
             cssUlNodeId: this.CLASS_UL_NODE + '-' + record.id,
             cssMark: cssMarked,
             accRole: (Rui.useAccessibility() && aRole ? 'role="'+aRole+'"' : ''),
             content: content,
             title: content,
             childUl: childUl
         });

         return html;
    },
    /**
     * 웹 접근성을 위한 UL Tag의 role 속성의 값을 가져온다.
     * @protected
     * @method getAccessibilityUlRole
     * @param {int} depth ul의 depth
     * @return {String} 웹접근성의 role 속성의 값
     */
    getAccessibilityUlRole: function(depth){
        return null;
    },
    /**
     * 웹 접근성을 위한 LI Tag의 role 속성의 값을 가져온다.
     * @protected
     * @method getAccessibilityLiRole
     * @return {String} 웹접근성의 role 속성의 값
     */
    getAccessibilityLiRole: function(){
        return null;
    },
    /**
     * node 상태 정보를 나타내는 class return
     * @private
     * @method getNodeStateClass
     * @param {boolean} hasChild 자식 존재 여부
     * @param {boolean} isLast 마지막 여부
     * @return {string} state css classname
     */
    getNodeStateClass: function(hasChild, isLast){
        var cssNodeState = '';
        if (hasChild)
            cssNodeState = isLast ? this.CLASS_UL_HAS_CHILD_CLOSE_LAST : this.CLASS_UL_HAS_CHILD_CLOSE_MID;
        else
            cssNodeState = isLast ? this.CLASS_UL_HAS_NO_CHILD_LAST : this.CLASS_UL_HAS_NO_CHILD_MID;
        return cssNodeState;
    },
    /**
     * li 내부의 div의 내용 return
     * @private
     * @method getContent
     * @param {Rui.data.LRecord} record content 정보 record
     * @param {string} cssNodeState node 상태를 나타내는 css classname
     * @return {string} content string
     */
    getContent: function(record, cssNodeState, isMarked){
        return this.getLabel(record, cssNodeState);
    },
    /**
     * node label, renderer가 적용된다.
     * @private
     * @method getLabel
     * @param {Rui.data.LRecord} record content 정보 record
     * @param {string} cssNodeState node 상태를 나타내는 css classname
     * @return {string} label string
     */
    getLabel: function(record, cssNodeState){
        var label = record.get(this.fields.label);
        label = label ? label : '&nbsp;';
        label = this.renderer ? this.renderer(label, record, cssNodeState) : label;
        return label;
    },
    /**
     * dataset의 행에 select mark가 있는지 여부 return
     * @private
     * @method isMarked
     * @param {Rui.data.LRecord} record content 정보 record
     * @return {boolean}
     */
    isMarked: function(record){
        return this.dataSet.isMarked(this.dataSet.indexOfKey(record.id));
    },
    /**
     * @description menu에 표시할 child record 목록, 최초 외에는 node click에 의해서 자식목록을 가져온다. 즉 dom에서 모두 가져올 수 있다.
     * @private
     * @method getChildNodeInfos
     * @param {Object} parentId 부모 id
     * @param {Rui.data.LDataSet} dataSet
     * @param {Array} parentDoms 부모 dom 정보 배열
     * @param {boolean} refresh cache를 날리고 children을 dataSet에서 가져온다.
     * @return {array} record object array
     */
    getChildNodeInfos: function(parentId, dataSet, parentDoms, refresh){
        //방금 사용한 cache 사용.
        var nodeInfos;
        if (parentId !== undefined) {
            nodeInfos = !refresh && this.lastNodeInfos && this.lastNodeInfos.parentId === parentId ? this.lastNodeInfos.nodeInfos : [];
            if (nodeInfos.length == 0) {
                nodeInfos = !parentDoms ? this.getChildNodeInfosByDataSet(parentId, dataSet) : this.getChildNodeInfosByDom(parentDoms, refresh);
                this.lastNodeInfos = {
                    parentId: parentId,
                    nodeInfos: nodeInfos
                };
            }
        }
        return nodeInfos;
    },
    /**
     * @description dom이나 cache에 nodeInfo가 없을 경우 nodeInfo를 dataSet에서 추출
     * @private
     * @method getChildNodeInfosByDataSet
     * @param {Object} parentId 부모 id
     * @param {Rui.data.LDataSet} dataSet
     * @return {array} nodeInfo object array
     */
    getChildNodeInfosByDataSet: function(parentId, dataSet){
        var nodeInfos = new Array();
        if(parentId === this.fields.rootValue){
            this.ulData = [];
            nodeInfos = this.ulData;
        }
        var records = this.getChildRecords(parentId,dataSet);
        //호환성 코딩
        if (this.fields.setRootFirstChild === true && !this.rootChanged && parentId === this.fields.rootValue && records.length > 0) {
            //rootValue 변경
            this.rootChanged = true;
            this.tempRootValue = records[0].get(this.fields.id);
            records = this.getChildRecords(this.tempRootValue);
        }
        for (var i = 0; i < records.length; i++)
            nodeInfos.push(this.getNodeInfoByRecord(records[i]));
        return nodeInfos;
    },
    /**
     * @description setRootFirstChild config에 의한 rootValue가져오기. -_-;
     * @private
     * @method getRootValue
     * @param {Object} parentId 부모 id
     * @param {Rui.data.LDataSet} dataSet
     * @return {array} Rui.data.LRecord array
     */
    getRootValue: function(){
        return this.fields.setRootFirstChild === true ? this.tempRootValue : this.fields.rootValue;
    },
    /**
     * @description parentId에 대한 자식 record return
     * @private
     * @method getChildRecords
     * @param {Object} parentId 부모 id
     * @param {Rui.data.LDataSet} dataSet
     * @return {array} Rui.data.LRecord array
     */
    getChildRecords: function(parentId, dataSet){
        var records = new Array();
        if (parentId !== undefined) {
            dataSet = dataSet ? dataSet : this.dataSet;
            parentId = parentId === undefined ? this.fields.rootValue : parentId;
            var rowCount = dataSet.getCount();
            var record = null;
            for (var i = 0; i < rowCount; i++) {
                record = dataSet.getAt(i);
                if (record.get(this.fields.parentId) === parentId)
                    records.push(record);
            }
            records = this.fields.order ? this.getSortedRecords(records) : records;
        }
        return records;
    },
    /**
     * @description sort column이 있는 경우 sorting해서 return하기
     * @private
     * @method getSortedRecords
     * @param {Array} records record array
     * @return {Array}
     */
    getSortedRecords: function(records){
        //1. order.idx 문자열값을 가지는 array를 record 수만큼 만든다.
        var sort_order_idx = new Array();
        var order;
        for (var i = 0; i < records.length; i++) {
            order = records[i].get(this.fields.order);
            sort_order_idx.push((order ? order : 10000000000) + '.' + i.toString());
        }
        //2. array를 order field를 기준으로 sort한다.
        sort_order_idx.sort(function(x, y){
            return x - y;
        });
        //3. sort한 순서대로 record array를 새로 만든다.
        var sorted_records = new Array();
        var idx = -1;
        var cur = -1;
        var s = null;
        for (var i = 0; i < sort_order_idx.length; i++) {
            s = sort_order_idx[i].split('.');
            idx = parseInt(s[1]);
            cur = parseInt(s[0]);
            sorted_records.push(records[idx]);
            prev = cur;
        }
        return sorted_records;
    },
    /**
     * cache 및 신규 pk 생성등의 문제로 id-parentId 값을 json으로 관리
     * [
     *      {id:'r0001',hasChild:1,order:0,children:[
     *          {id:'r0010',hasChild:1,order:0,children:[]}
     *          ,{id:'r0011',hasChild:1,order:1,children:[]}
     *      ]}
     *      ,{id:'r0002',hasChild:1,order:0,children:[
     *          {id:'r0020',hasChild:1,order:0,children:[]}
     *          ,{id:'r0021',hasChild:1,order:1,children:[]}
     *      ]}
     *      ,{id:'r0003',hasChild:1,order:0,children:[]}
     * ]
     * @private
     * @method getChildNodeInfosByDom
     * @param {Array} parentDoms 부모 dom array
     * @param {boolean} refresh cache를 삭제하고 update할 것인지 여부
     * @return {array} child node json array
     */
    getChildNodeInfosByDom: function(parentDoms,refresh){
        var nodeInfo = this.getNodeInfo(parentDoms);
        nodeInfo.children = (nodeInfo.hasChild && nodeInfo.children.length == 0) || refresh ? this.findChildNodeInfos(nodeInfo, parentDoms[0], refresh) : nodeInfo.children;
        if(refresh) nodeInfo.hasChild = nodeInfo.children.length > 0 ? this.hasChildValue : false;
        return nodeInfo.children;
    },
    /**
     * parent dom정보에서 node정보 가져오기
     * @private
     * @method getNodeInfo
     * @param {Array} parentDoms 부모 dom array
     * @return {Object} nodeInfo node에 대한 json으로된 정보
     */
    getNodeInfo: function(parentDoms){
        var searchSuccess = true;
        //nodeInfo의 children정보도 있어야 한다.
        //찾아 내려 가면서 NodeInfo가 없으면 만들어 내려간다.
        var nodeInfos = this.ulData;
        searchSuccess = parentDoms ? true : false;
        if (searchSuccess) {
            for (var i = parentDoms.length - 1; i >= 0; i--) {
                //nodeInfos에 dom에 해당하는 nodeInfo가 있는지 검사, nodeInfos가 없으면 dom에서 추출한다.
                nodeInfo = this.findNodeInfo(nodeInfos, parentDoms[i]);
                //현재 dom에 대해 nodeInfo가 있으면 nodeInfos에 children을 넘기고 다음 자식 dom을 검사한다.
                if (nodeInfo)
                    nodeInfos = nodeInfo.children;
                else {
                    searchSuccess = false;
                    break;
                }
            }
        }
        return searchSuccess ? nodeInfo : false;
    },
    /**
     * nodeInfos에서 dom에 해당되는 node 정보를 찾아서 return한다.
     * @private
     * @method findNodeInfo
     * @param {Array} nodeInfos nodeInfos에서 해당 dom에 대한 node info를 찾는다.
     * @return {Object} nodeInfo node에 대한 json으로된 정보
     */
    findNodeInfo: function(nodeInfos,dom){
        //nodeInfos는 ulData의 참조이다.  유지해야 한다.
        nodeInfos = nodeInfos.length == 0 ? this.getNodeInfos(this.getUL(dom)) : nodeInfos;
        return this.checkHasNode(nodeInfos,dom);
    },
    /**
     * ul아래에 있는 li에서 nodeInfo를 추출해 낸다.
     * @private
     * @method getNodeInfos
     * @param {HTMLElement} ul content div를 포함하는 ul
     * @return {Array} nodeInfos ul내의 node에 대한 정보 배열
     */
    getNodeInfos: function(ul){
        var nodeInfos = new Array();
        var liCount = ul.childNodes.length;
        for (var i=0;i<liCount;i++)
            nodeInfos.push(this.getNodeInfoByDom(ul.childNodes[i].firstChild,i));
        return nodeInfos.length > 0 ? nodeInfos : false;
    },
    /**
     * ul아래에 있는 li에서 nodeInfo를 추출해 낸다.
     * @private
     * @method findChildNodeInfos
     * @param {object} nodeInfo node에 대한 정보
     * @param {HTMLElement} dom content dom
     * @param {boolean} refresh true이면 dataSet에서 node정보를 가져온다.
     * @return {Array} nodeInfos ul내의 node에 대한 정보 배열
     */
    findChildNodeInfos: function(nodeInfo,dom,refresh){
        var nodeInfos = [];
        var ul = this.getChildUL(dom);
        if(ul && !refresh){
            nodeInfos = this.getNodeInfos(ul);
        } else {
            var record = this.getRecordByNodeInfo(nodeInfo);
            if(record) nodeInfos = this.getChildNodeInfosByDataSet(record.get(this.fields.id));
        }
        return nodeInfos;
    },
    /**
     * nodeInfos에 dom에 해당되는 nodeInfo가 있는지 검사
     * @private
     * @method checkHasNode
     * @param {Array} nodeInfos node에 대한 정보 array
     * @param {HTMLElement} dom content dom
     * @return {Object} nodeInfo dom에 대한 node정보
     */
    checkHasNode: function(nodeInfos,dom){
        var nodeInfo = null;
        if (nodeInfos) {
            var recordId = this.getRecordId(dom);
            for (var j = 0; j < nodeInfos.length; j++) {
                if (nodeInfos[j].id == recordId) {
                    nodeInfo = nodeInfos[j];
                    break;
                }
            }
        }
        return nodeInfo ? nodeInfo : false;
    },
     /**
     * record의 자식 record가 있는지 검사
     * @private
     * @method checkHasChild
     * @param {Rui.data.LRecord} record 부모 record
     * @return {boolean} hasChild 자식 존재 여부 return
     */
    checkHasChild: function(record){
        var hasChild = 0;
        if (this.fields.hasChild) {
            hasChild = record.get(this.fields.hasChild);
        }
        else {
            var parentId = record.get(this.fields.id);
            if (parentId !== undefined) {
                var rowCount = this.dataSet.getCount();
                for (var i = 0; i < rowCount; i++) {
                    if (this.dataSet.getAt(i).get(this.fields.parentId) === parentId) {
                        hasChild = this.hasChildValue;
                        break;
                    }
                }
            }
        }
        return hasChild;
    },
    /**
     * dom 상에 child가 존재하는지 검사.
     * @private
     * @method checkHasChildByDom
     * @param {HTMLElement} dom li child로 content를 표현하는 div의 dom이다.
     * @return {boolean} hasChild 자식 존재 여부 return
     */
    checkHasChildByDom: function(dom){
        //dom에 없으면 record를 검사한다.
        return this.getChildUL(dom) ? true : this.checkHasChild(this.dataSet.get(this.getRecordId(dom)));
    },
    /**
     * record로 nodeInfo 만들기
     * @private
     * @method getNodeInfoByRecord
     * @param {Rui.data.LRecord} record
     * @return {object} nodeInfo
     */
    getNodeInfoByRecord: function(record){
        return {id:record.id,hasChild:this.checkHasChild(record),order:record.get(this.fields.order),children:[]};
    },
    /**
     * dom으로 nodeInfo 만들기
     * @private
     * @method getNodeInfoByDom
     * @param {HTMLElement} dom
     * @param {int} idx order정보
     * @return {object} nodeInfo
     */
    getNodeInfoByDom: function(dom,idx){
        return {id:this.getRecordId(dom),hasChild:this.checkHasChildByDom(dom),order:idx,children:[]};
    },
    /**
     * nodeInfo로 record가져오기
     * @private
     * @method getRecordByNodeInfo
     * @param {object} nodeInfo
     * @return {Rui.data.LRecord} record object
     */
    getRecordByNodeInfo: function(nodeInfo){
        return this.dataSet.get(nodeInfo.id);
    },
    /**
     * html text를 dom object로 만들어서 return하기
     * @private
     * @method htmlToDom
     * @param {string} html
     * @return {HTMLElement} html의 dom
     */
    htmlToDom: function(html){
        //html문자열을 dom으로 return
        var div = document.createElement('div');
        div.innerHTML = html;
        return div.childNodes[0];
    },
    /**
     * 자식들 select mark하기
     * @private
     * @method markChilds
     * @param {bool} isMarked
     * @param {Rui.data.LRecord} record
     * @return {void}
     */
    markChilds: function (isMarked, record) {
        if (this.autoMark) {
            //한 depth만 표시한다.  재귀루프를 돌기 때문, findNode를 실패할 경우 더이상 진행하지 않게 하기위해 flag둠
            var records = this.getChildRecords(record.get(this.fields.id));
            for (var i = 0; i < records.length; i++){
                records[i].treeType = 'child';
                this.markData(this.dataSet.indexOfKey(records[i].id), isMarked);
            }
        }
        this.onRecordMarking = false;
    },
    /**
     * 부모들 select mark하기
     * @private
     * @method markParents
     * @param {bool} isMarked
     * @param {Rui.data.LRecord} record
     * @return {void}
     */
    markParents:function(isMarked, node){
        if(this.autoMark && node){
            var parentNode = node.getParentNode();
            if(parentNode){
                parentNode.getRecord().treeType = 'parent';
                if(!parentNode.isMarked() && !isMarked) return;
                if(!isMarked){
                    this.markData(this.dataSet.indexOfKey(parentNode.getRecord().id), isMarked);
                    return;
                }
                var markCount = 0;
                var nodeList = parentNode.getChildNodes();
                var median = nodeList.length/2;
                for(var i = nodeList.length-1; i>=median; i--){
                    if(parentNode.unorderList.findNode(nodeList[i].id).isMarked()) markCount++;
                    else return;
                }                
                for(var i = 0; i<median; i++){
                    if(parentNode.unorderList.findNode(nodeList[i].id).isMarked()) markCount++;
                    else return;
                }
                if(nodeList.length == markCount){   
                    this.markData(this.dataSet.indexOfKey(parentNode.getRecord().id), isMarked);
                }
          }
        }
    },
        /**
     * DataSet row 위치 마크 및 recursive 호출
     * @private
     * @method markData
     * @param {int} row
     * @param {bool} isSelect
     * @return {void}
     */
    markData:function(row, isSelect, force){
        if (row < 0 || row > this.dataSet.getCount()) return;
        if (this.dataSet.isMarked(row) == isSelect) return;
        if (!!!force && this.dataSet.isMarkable(row) == false) return;
        var record = this.dataSet.getAt(row);
        if (isSelect) {
            if (!this.dataSet.selectedData.has(record.id)) 
                this.dataSet.selectedData.add(record.id, record);
        } else {
            this.dataSet.selectedData.remove(record.id);
        }
        if(this.dataSet.isBatch !== true) {
            this.onMark(row, isSelect, record);
        }
    },
    /**
     * @description render시 호출되는 메소드
     * @private
     * @method doRender
     * @param {String|Object} container 부모객체 정보
     * @return {void}
     */
    doRender: function(container){
        this.createTemplate();
        this.el.addClass(this.CSS_BASE);
        this.el.addClass('L-fixed');

        Rui.util.LEvent.removeListener(this.el.dom, 'mousedown', this.onCheckFocus);
        Rui.util.LEvent.addListener(this.el.dom, 'mousedown', this.onCheckFocus, this, true);

        if(Rui.useAccessibility() && this.accessibilityELRole)
            this.el.setAttribute('role', this.accessibilityELRole);

        this.doRenderData();
        this.container = container;
        
        this._rendered = true;
    },
    /**
     * @description render후 호출되는 메소드
     * @method afterRender
     * @protected
     * @param {HTMLElement} container 부모 객체
     * @return {void}
     */
    afterRender: function(container){
        Rui.ui.LUnorderedList.superclass.afterRender.call(this, container);
        this.el.unOn('click', this.onNodeClick, this);
        this.el.on('click', this.onNodeClick, this, true);

        this.unOn('dynamicLoadChild', this.onDynamicLoadChild, this, true);
        this.on('dynamicLoadChild', this.onDynamicLoadChild, this, true);
    },
    /**
     * @description 최초 focus를 변경
     * @private
     * @method initDefaultFocus
     * @return {void}
     */
    initDefaultFocus: function(){
        if (!this.lastFocusId && this.defaultOpenTopIndex > -1)
            this.openFirstDepthNode(this.defaultOpenTopIndex);
        else {
            //이전에 마지막에 선택된 행이 있으면 setRow한다.
            if (!this.setFocusLastest())
                this.refocusNode(this.dataSet.getRow());
        }
    },
    /**
     * @description data를 rendering
     * @private
     * @method doRenderData
     * @return {void}
     */
    doRenderData: function(){
        if(!this.el) return;
        this.prevFocusNode = undefined;
        this.currentFocus = undefined;
        this.lastNodeInfos = undefined;
        this.rootChanged = false;
        this.el.html(this.getUlHtml(this.fields.rootValue));
        var firstLiEls = this.el.select('li.L-ul-li-depth-0');
        if(firstLiEls && firstLiEls.length){
            firstLiEls.getAt(0).setAttribute('tabindex', '0');
        }
        this.initDefaultFocus();
        this.renderDataEvent.fire();
    },
    /**
     * @description node click시 실행되는 내용
     * @method onNodeClick
     * @protected
     * @param {HTMLElement} _div click한 node div
     * @param {String} rId click한 menu object의 record id
     * @return {void}
     */
    onNodeClick: function(e){
        var node = this.findNodeByDom(e.target);
        if (node) {
            var r = this.fireEvent('nodeClick', {
                target: this,
                node: node,
                dom: e.target
            });
            if(r !== false){
                if(node !== this.currentFocus)
                    this.dataSet.setRow(node.getRow());
                this.toggleChild(node);
            }
        }
    },
    /**
     * @description node click시 toggle처리
     * @method toggleChild
     * @protected
     * @param {Rui.ui.LUnorderedListNode} node click된 node
     * @return {void}
     */
    toggleChild: function(node){
        node.toggleChild();
    },
    /**
     * 지정한 행 focus하기, dom이 없으면 만들어서 focus한다.
     * @private
     * @method focusNode
     * @param {int} row row index
     * @return {Rui.ui.LUnorderedListNode} currentFocus 현재 focus된 node를 return
     */
    focusNode: function(row){
        //focusing이 가능한지 판단
        if (!this.isPossibleNodeRecord(this.dataSet.getAt(row))) return false;
        if(this.currentFocus && this.currentFocus.getRow() === row) return false;
        //현재 dom에서 node를 찾는다.
        var nextFocusingNode = row >= 0 ? this.findNode(this.dataSet.getAt(row).id) : false;
        //없으면 node를 만들어가면서 찾는다.
        nextFocusingNode = !nextFocusingNode && row > -1 ? this.buildNodes(row) : nextFocusingNode;
        if (this.currentFocus) this.currentFocus.unfocus();
        this.prevFocusNode = this.currentFocus;
        this.currentFocus = nextFocusingNode;
        this.lastFocusId = this.currentFocus ? this.currentFocus.getIdValue() : undefined;
        if (this.currentFocus) {
            this.currentFocus.focus();
            this.el.moveScroll(this.currentFocus.el, false, true);
        }
        this.fireEvent('focusChanged', {
            target: this,
            oldNode: this.prevFocusNode,
            newNode: this.currentFocus
        });
        return this.currentFocus;
    },
    /**
     * 지정한 행 focus하기, 현재행이 row이면 focus 설정, 아니면 setRow를 해서 focusNode 호출
     * @private
     * @method refocusNode
     * @param {int} row row index
     * @param {boolean} ignoreCanRowPos row pos change event 무시할 지 여부
     * @return {void}
     */
    refocusNode: function(row,ignoreCanRowPos){
        ignoreCanRowPos = ignoreCanRowPos == true ? true : false;
        var currentRow = this.dataSet.getRow();
        if(currentRow == row)
            this.focusNode(row);
        else
            this.dataSet.setRow(row,{ignoreCanRowPosChangeEvent: ignoreCanRowPos});
    },
    /**
     * newRecord등으로 생성된 record는 parentId가 없으므로 node생성이 불가능한 record이다. 추가 행변경시 처리하지 않는다.
     * @private
     * @method isPossibleNodeRecord
     * @param {Rui.data.LRecord} record
     * @return {boolean}
     */
    isPossibleNodeRecord: function(record){
        return record === undefined || record.get(this.fields.parentId) === undefined ? false : true;
    },
    /**
     * ul에서 마지막 li가져오기
     * @private
     * @method getLastLi
     * @param {HTMLElement} ulDom ul dom
     * @return {HTMLElement} li dom
     */
    getLastLi: function(ulDom){
        return ulDom.childNodes && ulDom.childNodes.length > 0 ? ulDom.childNodes[ulDom.childNodes.length - 1] : false;
    },
    /**
     * ul에서 특정 index의 li가져오기
     * @private
     * @method getLi
     * @param {HTMLElement} ulDom ul dom
     * @param {int} index li index
     * @return {HTMLElement} li dom
     */
    getLi: function(ulDom,index){
        return index < ulDom.childNodes.length ? ulDom.childNodes[index] : false;
    },
    /**
     * dom을 포함하고 있는 ul을 가져온다.
     * @private
     * @method getUL
     * @param {HTMLElement} dom content div
     * @return {HTMLElement}
     */
    getUL: function (dom) {
        return dom.parentNode.parentNode;
    },
    /**
     * 자식이 있는지 검사, 있으면 ul return 없으면 false return
     * @private
     * @method getChildUL
     * @private
     * @param {HTMLElement} dom click한 node div
     * @return {HTMLElement}
     */
    getChildUL: function (dom) {
        //next sibling이 ul이면 자식이 있는 것.
        var n_node = Rui.util.LDom.getNextSibling(dom);
        //1은 element, ul
        return n_node && n_node.nodeType == 1 && n_node.tagName.toLowerCase() == 'ul' ? n_node : false;
    },
    /**
     * recordId에 해당되는 node을 찾아서 return한다.
     * @private
     * @method findNode
     * @param {object} recordId
     * @param {HTMLElement} dom 검색대상, 없으면 this.el검색
     * @return {HTMLElement}
     */
    findNode: function(recordId, dom, deleted){
        if(!deleted && !this.isPossibleNodeRecord(this.dataSet.get(recordId))) return false;
        var el = dom ? Rui.get(dom) : this.el,
            els = el.select('div.' + this.CLASS_UL_NODE + '-' + recordId,true);
        el = els.getAt(0);
        return el && els.length > 0 ? this.getNodeObject(el.dom) : false;
    },
    /**
     * findNode로 없을때 부모에서부터 노드를 만들어가면서 찾는 node를 return한다.
     * @private
     * @method buildNodes
     * @param {String} recordId
     * @return {Rui.ui.LUnorderedListNode}
     */
    buildNodes: function(row){
        var node = false;
        if (row > -1 && this.isPossibleNodeRecord(this.dataSet.getAt(row))) {
            var parentRecords = this.getParentRecords(row);
            //위에서 내려오면서 만들기
            var dom = this.el;
            for (var i = parentRecords.length - 1; i >= 0; i--) {
                node = this.findNode(parentRecords[i].id, dom);
                if (node && i !== 0) {
                    node.expand();
                    dom = node.getChildUL();
                } else break;
            }
        }
        return node;
    },
    /**
     * dom으로 node 찾기
     * @private
     * @method findNodeByDom
     * @param {HTMLElement} dom
     * @return {Rui.ui.LUnorderedListNode}
     */
    findNodeByDom: function(dom){
        var nodeDom = Rui.util.LDom.findParent(dom, 'div.' + this.CLASS_UL_NODE, 10);
        return this.getNodeObject(nodeDom);
    },
    /**
     * first depth의 특정 node 찾기
     * @method getFirstDepthNode
     * @private
     * @param {int} index first depth li의 index
     * @return {Rui.ui.LUnorderedListNode}
     */
    getFirstDepthNode: function(index){
        var rootUL = this.getRootUL();
        return rootUL ? this.getNodeObject(this.getLi(rootUL.dom,index)) : false;
    },
    /**
     * 데이터 로딩 후 펼쳐질 노드
     * @method openFirstDepthNode
     * @private
     * @param {int} index first depth li의 index
     * @return {void}
     */
    openFirstDepthNode: function(index){
        if (index > -1) {
            var node = this.getFirstDepthNode(index);
            if (node) {
                this.dataSet.setRow(node.getRow());
                if(this.currentFocus != null)
                    this.currentFocus.expand();
            }
        }
    },
    /**
     * row에 해당하는 노드를 반환
     * @private
     * @method getNode
     * @param {Rui.data.LRecord} record
     * @return {Rui.ui.LUnorderedListNode}
     */
    getNode: function(record){
        return this.findNode(record.id);
    },
    /**
     * node id에 해당하는 노드를 반환
     * @method getNodeById
     * @param {String} id node의 id 필드에 해당되는 값
     * @return {Rui.ui.LUnorderedListNode}
     */
    getNodeById: function(id) {
        var row = this.dataSet.findRow(this.fields.id, id);
        if(row < 0) return null;
        var r = this.dataSet.getAt(row);
        return this.getNode(r);
    },
    /**
     * dom으로 node 만들기
     * @private
     * @method getNodeObject
     * @param {HTMLElement} dom
     * @return {Rui.ui.LUnorderedListNode}
     */
    getNodeObject: function(dom){
        if(dom){
            //반복 생성 방지.
            var recordId = this.getRecordId(dom);
            if (this.currentFocus && this.currentFocus.getRecordId() == recordId)
                return this.currentFocus;
            else
                return this.createNodeObject(dom);
        } else return null;
    },
    /**
     * dom으로 node 만들기
     * @protected
     * @method createNodeObject
     * @param {HTMLElement} dom
     * @return {Rui.ui.LUnorderedListNode}
     */
    createNodeObject: function(dom){
        return new Rui.ui.LUnorderedListNode({
            unorderList: this,
            useAnimation: this.useAnimation,
            dom: dom
        });
    },
    /**
     * node 만들기
     * @protected
     * @method createNode
     * @param {Object} config
     * @return {Rui.ui.LUnorderedListNode}
     */
    createNode: function(config) {
        config = Rui.applyIf(config || {}, {
            unorderList: this,
            nodeConstructor: this.NODE_CONSTRUCTOR
        });
        return new eval(config.nodeConstructor + '.prototype.constructor')(config);
    },
    /**
     * 마지막에 선택한 node return하기
     * @method getFocusNode
     * @return {Rui.ui.LUnorderedListNode}
     */
    getFocusNode: function(){
        return this.currentFocus;
    },
    /**
     * @description 마지막에 선택한 node return하기 호환성 용
     * @private
     * @method getFocusedNode
     * @return {Rui.ui.LUnorderedListNode}
     */
    getFocusLastest: function(){
        return this.getFocusNode();
    },
    /**
     * root ul 가져오기
     * @private
     * @method getRootUL
     * @return {Rui.LElement}
     */
    getRootUL: function(){
        var els = this.el.select('.' + this.CLASS_UL_FIRST,true);
        return els.length > 0 ? els.getAt(0) : false;
    },
    /**
     * 부모 record 가져오기
     * @private
     * @method getParentRecord
     * @param {Rui.data.LRecord} record
     * @return {Rui.data.LRecord} record parent
     */
    getParentRecord: function(record){
        if(!this.isPossibleNodeRecord(record)) return false;
        var row = this.dataSet.findRow(this.fields.id, record.get(this.fields.parentId));
        return row > -1 ? this.dataSet.getAt(row) : false;
    },
    /**
     * 부모 record 목록 가져오기
     * @private
     * @method getParentRecords
     * @param {int} row row index
     * @return {Array} record parent array
     */
    getParentRecords: function(row){
        var parentRecords = new Array();
        if (row > -1) {
            var record = this.dataSet.getAt(row);
            parentRecords.push(record);
            var parentId;
            for (var i = 0; i < 1000; i++) {
                parentId = record.get(this.fields.parentId);
                if (parentId === this.fields.rootValue)
                    break;
                else {
                    record = this.getParentRecord(record);
                    if (record)
                        parentRecords.push(record);
                    else
                        break;
                }
            }
        }
        return parentRecords;
    },
    /**
     * Dom으로 부모 id 알아내기
     * @private
     * @method getParentId
     * @param {HTMLElement} dom node의 content div
     * @return {object} id
     */
    getParentId: function(dom){
        return this.dataSet.get(this.getRecordId(dom)).get(this.fields.id);
    },
    /**
     * dom에서 record id 추출하기
     * @private
     * @method getRecordId
     * @param {HTMLElement} dom
     * @return {Object} record.id
     */
    getRecordId: function(dom){
        dom = dom.tagName.toLowerCase() == 'li' ? dom.firstChild : dom;
        return Rui.util.LDom.findStringInClassName(dom, this.CLASS_UL_NODE + '-');
    },
    /**
     * 선택된 또는 지정한 node의 label을 return한다.
     * @private
     * @method getNodeLabel
     * @param {Rui.ui.LUnorderedListNode} node
     * @return {string}
     */
    getNodeLabel: function(node){
        node = node ? node : this.currentFocus;
        return node ? this.dataSet.get(node.getRecordId()).get(this.fields.label) : '';
    },
    /**
     * 마지막에 선택한 node 선택하기, dataSet 재 로드된 경우 등.
     * @private
     * @method setFocusLastest
     * @return {void}
     */
    setFocusLastest: function(){
        return (this.focusLastest && this.lastFocusId !== undefined && this.dataSet) ? this.setFocusById(this.lastFocusId) : false;
    },
    /**
     * @description id값을 참조해서 수동으로 focus 주기
     * @method setFocusById
     * @param {string} id
     * @return {void}
     */
    setFocusById : function(id){
        if (id !== undefined) {
            var idx = this.dataSet.findRow(this.fields.id, id);
            if (idx === this.dataSet.getRow())
                return false;
            else {
                this.dataSet.setRow(idx);
                return true;
            };
        }
    },
    /**
     * @description 지정한 rootValue값으로 tree 다시 그리기
     * @method setRootValue
     * @param {Object} rootValue
     * @return {void}
     */
    setRootValue : function(rootValue){
        this.fields.rootValue = rootValue;
        this.doRenderData();
    },
    doBeforeLoad: function(e) {
        this.showLoadingMessage();
    },
    /**
     * @description onLoadDataSet
     * @private
     * @method onLoadDataSet
     * @return {void}
     */
    onLoadDataSet: function(e){
        this.doRenderData();
        this.hideLoadingMessage();
    },
    /**
     * @description loading시 message 출력
     * @method showLoadingMessage
     * @protected
     * @return {void}
     */
    showLoadingMessage: function(){
        if(!this.el) return;
        this.el.mask();
    },
    /**
     * @description dataSet의 changed 이벤트 발생시 호출되는 메소드
     * @method hideLoadingMessage
     * @protected
     * @return {void}
     */
    hideLoadingMessage: function() {
        if(!this.el) return;
        this.el.unmask();
    },
    /**
     * @description dataSet의 onMarked event 처리, checkbox의 경우 동기화 한다.
     * @method onMarked
     * @private
     * @return {void}
     */
    onMarked: function(e){
        var node = !this.onRecordMarking ? this.findNode(e.record.id) : false;
        this.checkCount = 0;
        if (node) {
            if(e.isSelect){
                e.record.treeType = 'child';
                node.mark();
                e.record.treeType = 'parent';
                node.mark();
            }
            else {
                e.record.treeType = 'child';
                node.unmark();
                e.record.treeType = 'parent';
                node.unmark()       
            } 
        } else {
            this.onRecordMarking = true;
            this.markChilds(e.isSelect, e.record);
            this.markParents(e.isSelect, this.findNode(e.record.id));
        }
    },
    /**
     * @description dataSet의 onMarked event 처리, 재귀동작 처리를 위해 onMarked 이벤트 대신 동작
     * @method onMark
     * @private
     * @return {void}
     */
    onMark: function(row, isSelect, record){
        var node = !this.onRecordMarking ? this.findNode(record.id) : false;
        if (node) {
            if(isSelect) node.mark(); else node.unmark();
        } else {
            this.onRecordMarking = true;
            this.markChilds(isSelect, record);
            this.markParents(isSelect, this.findNode(record.id));
        }
    }, 
    /**
     * 자식 node가 펼쳐진 후 발생되는 이벤트
     * @method onExpand
     * @private
     * @return {void}
     */
    onExpand: function(e){
        var currentFocus = e.node;
        if(currentFocus && currentFocus.getParentId() == e.target.getIdValue()){
            this.el.moveScroll(currentFocus.el, false, true);
        }
    },
    /**
     * @description 데이터셋을 변경하는 메소드
     * @method setDataSet
     * @param {Rui.data.LDataSet} dataSet 반영할 데이터셋
     * @return {void}
     */
    setDataSet: function(dataSet) {
        this.setSyncDataSet(false);
        this.dataSet = dataSet;
        this.setSyncDataSet(true);
    },
    /**
     * parentId를 가진 모든 record 가져오기
     * @method getAllChildRecords
     * @param {object} parentId
     * @param {Rui.data.LDataSet} dataSet 검색할 dataSet으로 입력하지 않으면 tree의  dataSet으 사용한다.
     * @param {Array} rs record의 array 재귀호출용
     * @return {Array} record의 array
     */
    getAllChildRecords: function(parentId, dataSet, rs){
        rs = rs ? rs : new Array();
        if (parentId !== undefined) {
            dataSet = dataSet ? dataSet : this.dataSet;
            var rowCount = dataSet.getCount();
            var r = null;
            for (var i = 0; i < rowCount; i++) {
                r = dataSet.getAt(i);
                if (r.get(this.fields.parentId) === parentId) {
                    rs.push(r);
                    this.getAllChildRecords(r.get(this.fields.id), dataSet, rs);
                }
            }
        }
        return rs;
    },
    /**
     * parentId를 가진 모든 record 가져오기
     * @private
     * @method getAllChildRecordsClone
     * @param {object} parentId
     * @param {object} cloneParentId 재귀 호출용
     * @param {Rui.data.LDataSet} dataSet 검색할 dataSet으로 입력하지 않으면 tree의  dataSet으 사용한다.
     * @param {Array} rs record의 array 재귀호출용
     * @return {Array} record의 array
     */
    getAllChildRecordsClone: function(parentId, dataSet, initIdValue){
        return this.getCloneRecords(this.getAllChildRecords(parentId, dataSet),initIdValue);
    },
    /**
     * records clone하기
     * @private
     * @method getCloneRecords
     * @param {Array} records
     * @return {Array} record의 array
     */
    getCloneRecords: function(records,initIdValue){
        var cloneRecords = new Array();
        var record;
        for (var i = 0; i < records.length; i++) {
            record = records[i].clone();
            if(initIdValue) this.initIdValue(record,{ignoreEvent: true});
            cloneRecords.push(record);
        }
        return cloneRecords;
    },
    /**
     * @description context menu가 전시되었을 때 실행되는 handler
     * @private
     * @method onTriggerContextMenu
     * @param {object} e
     * @return {void}
     */
    onTriggerContextMenu: function(e){
        var node = this.findNodeByDom(this.contextMenu.contextEventTarget);
        if (!node)
            this.contextMenu.cancel(false);
        else
            this.refocusNode(node.getRow());
    },
    /**
     * @description childDataSet을 지정했을 경우 node click시 발생하는 event로 child dataset을 load
     * @private
     * @method onDynamicLoadChild
     * @param {object} e
     * @return {void}
     */
    onDynamicLoadChild: function(e){
    },
    /**
     * label 변경하기
     * @private
     * @method setNodeLabel
     * @param {string} label
     * @param {Rui.ui.LUnorderedListNode} node optional
     * @return {void}
     */
    setNodeLabel: function(label,node){
        //data값을 변경하면 event에 의해서 변경된다.
        node = node ? node : this.currentFocus;
        if(node) this.dataSet.get(node.getRecordId()).set(this.fields.label,label);
    },
    /**
     * 신규 record일 경우 임시 pk 만들기
     * @private
     * @method initIdValue
     * @param {Rui.data.LRecord} record
     * @param {object} option record option
     * @return {object} 생성한 id
     */
    initIdValue: function(record, option){
        var fieldValue = undefined;
        if (this.useTempId) {
            var field = record.findField(this.fields.id);
            var today = new Date;
            //중복 제거를 위해 붙임.
            var recordId = parseInt(Rui.util.LString.simpleReplace(record.id, 'r', ''), 10);
            switch (field.type) {
                case 'number':
                    fieldValue = today.getTime() + recordId;
                    break;
                case 'date':
                    fieldValue = Rui.util.LDate.add(today, Rui.util.LDate.MILLISECOND, recordId);
                    break;
                case 'string':
                    fieldValue = '' + today.getTime() + '' + recordId;
                    break;
            }
        }
        record.set(this.fields.id,fieldValue,option);
        return fieldValue;
    },
    /**
     * 최상위 depth에 label을 가지는 record 추가
     * @method addTopNode
     * @sample default
     * @param {string} label
     * @return {int} row [optional] 생성한 record의 index return
     */
    addTopNode: function(label,row){
        return this.addChildNode(label, true, row);
    },
    /**
     * 선택된 node 밑에 label을 가지는 record 추가
     * @method addChildNode
     * @sample default
     * @param {string} label
     * @param {boolean} addTop [optional] 최상위에 추가할 지 여부
     * @return {int} row 생성한 record의 index return
     */
    addChildNode: function(label, addTop, row){
        var parentId = addTop === true ? this.getRootValue() : (this.currentFocus ? this.currentFocus.getIdValue() : this.getRootValue());
        var record;
        if (typeof parentId !== 'undefined') {
            if (typeof row === 'undefined') {
                this.DATASET_EVENT_LOCK.ADD = true;
                this.DATASET_EVENT_LOCK.ROW_POS_CHANGED = true;
                //onAddData와 rowPosChanged가 동시에 발생
                row = this.dataSet.newRecord();
                this.DATASET_EVENT_LOCK.ROW_POS_CHANGED = false;
                this.DATASET_EVENT_LOCK.ADD = false;
            }
            record = this.dataSet.getAt(row);
            this.DATASET_EVENT_LOCK.UPDATE = true;
            this.initIdValue(record);
            record.set(this.fields.label, label);
            this.DATASET_EVENT_LOCK.UPDATE = false;
            record.set(this.fields.parentId, parentId);
            this.refocusNode(row);
        } else {
            //throw new Rui.LException('부모의 id가 없음.  tempId를 사용하려면 config.useTempId:true로 설정.  이 경우 create된 record는 id 또는 parentId가 temp값임');
            alert('부모의 id가 없음.  신규 추가한 node에 id가 있어야 자식을 추가할 수 있음. \r\ntempId를 사용하려면 config.useTempId:true로 설정.  \r\n이 경우 create된 record는 id 또는 parentId가 temp값이므로 DB업데이트시 주의요망');
        }
        return row;
    },
    /**
     * 선택된 node 밑에 label을 가지는 child dom 추가
     * @private
     * @method addChildNodeHtml
     * @param {string} label
     * @param {boolean} addTop 최상위에 추가할 지 여부
     * @return {void}
     */
    addChildNodeHtml: function(record, addTop, parentNode){
        var nodeInfos = [this.getNodeInfoByRecord(record)];
        parentNode = parentNode ? parentNode : this.currentFocus;
        if (!addTop && parentNode) {
            //record가 추가 되었으므로 다시 그린다.
            parentNode.open(true);
        }
        else {
            var rootUL = this.getRootUL();
            if (!rootUL) {
                //root에 하나도 없을때
                this.el.html(this.getUlHtml(undefined, null, nodeInfos));
            } else {
                //마지막 li를 mid로 변환
                var node = this.getNodeObject(this.getLastLi(rootUL.dom));
                node.changeStateTo(this.NODE_STATE.MID);
                rootUL.appendChild(this.htmlToDom(this.getLiHtml(nodeInfos[0], null, true)));
            }
            //root cache에도 추가한다.
            this.ulData.push(nodeInfos[0]);
        }
    },
    /**
     * array합치기, object array는 concat이 안된다.  별도 구현
     * @private
     * @method concatArray
     * @param {Array} origin
     * @param {Array} adding
     * @return {void}
     */
    concatArray: function(origin,adding){
        for (var i=0;i<adding.length;i++){
            origin.push(adding[i]);
        }
    },
    /**
     * 부모의 자식들의 변경으로 자식들을 다시 그린다.
     * @private
     * @method redrawParent
     * @param {Object} parentId
     * @param {int} focusChildRow 다시 그린후 focus를 줄 child row
     * @return {void}
     */
    redrawParent: function(parentId,focusChildRow,isDelete){
        isDelete = isDelete == true ? true : false;
        if (parentId !== undefined) {
            if (parentId !== this.getRootValue()) {
                var parentRow = this.dataSet.findRow(this.fields.id, parentId);
                //행이동을 하지 않고 다시 그리기
                this.focusNode(parentRow);
                if (this.currentFocus)
                    this.currentFocus.open(true);
                if (focusChildRow === undefined)
                    this.dataSet.setRow(parentRow, {ignoreCanRowPosChangeEvent: isDelete});
                else
                    this.refocusNode(focusChildRow,isDelete);
            }
            else
                this.doRenderData();
        }
    },
    /**
     * record 삭제
     * @private
     * @method deleteRecord
     * @param {Rui.data.LRecord} record 삭제할 record
     * @param {boolean} clone clone할지 여부
     * @param {boolean} childOnly 자신을 제외하고 자식만 삭제 여부
     * @return {array}
     */
    deleteRecord: function(record,clone,childOnly){
        //자식 삭제를 위해 목록 가져오기, record index가 높은것 부터 삭제.
        var rs = new Array();
        //childOnly면 자신은 뺀다.
        if(!childOnly) rs.push(record);
        this.concatArray(rs,this.getAllChildRecords(record.get(this.fields.id)));
        var cloneRecords = clone ? this.getCloneRecords(rs) : undefined;
        //이동처리할 필요가 없다. 밑에서 부터 삭제한다.
        this.DATASET_EVENT_LOCK.ROW_POS_CHANGED = true;
        for (var i=rs.length-1;i>-1;i--) {
            this.DATASET_EVENT_LOCK.REMOVE = true;
            this.dataSet.removeAt(this.dataSet.indexOfKey(rs[i].id));
            this.DATASET_EVENT_LOCK.REMOVE = false;
        }
        this.DATASET_EVENT_LOCK.ROW_POS_CHANGED = false;
        return cloneRecords;
    },
    /**
     * 특정 node 지우기, 지운 후에 clone한 record array를 return한다.
     * @method deleteNode
     * @sample default
     * @param {Rui.ui.LUnorderedListNode} node 삭제할 node
     * @param {boolean} clone clone할지 여부
     * @param {boolean} childOnly 자신을 제외하고 자식만 삭제 여부
     * @param {Object} parentId 이미 record가 삭제된 상태일 경우 record를 가져올 수 없으므로 parentId를 넘겨서 refresh 만 함.
     * @return {array}
     */
    deleteNode: function(node,clone,childOnly,parentId){
        node = node ? node : this.currentFocus;
        if(node){
            var record = node.getRecord();
            var rsClone;
            if (record) {
                parentId = record.get(this.fields.parentId);
                rsClone = this.deleteRecord(record, clone, childOnly);
            }
            if (parentId !== this.getRootValue())
                this.redrawParent(parentId,undefined,true);
            else {
                var siblingLi = node.getPreviousLi();
                siblingLi = siblingLi ? siblingLi : node.getNextLi();
                var siblingNode = siblingLi ? this.getNodeObject(siblingLi) : null;
                this.removeNodeDom(node);
                if (siblingNode)
                    this.dataSet.setRow(siblingNode.getRow(),{ignoreCanRowPosChangeEvent: true});
            }
            return rsClone;
        }
    },
    /**
     * node cut하기
     * @method cutNode
     * @param {Rui.ui.LUnorderedListNode} node cut할 node
     * @return {void}
     */
    cutNode: function(node){
        node = node ? node : this.currentFocus;
        this.deletedRecords = node ? this.deleteNode(node,true) : null;
    },
    /**
     * node copy하기, useTempId가 false이면 자식까지 copy되지 않는다.
     * @method copyNode
     * @param {boolean} widthChilds 자식들도 같이 복사할지 여부
     * @param {Rui.ui.LUnorderedListNode} node optional 지정하지 않으면 현재 선택된 node
     * @return {void}
     */
    copyNode: function(withChilds, node){
        node = node ? node : this.currentFocus;
        this.copiedRecordId = node ? node.getRecordId() : null;
        this.copyWithChilds = withChilds == undefined || withChilds == null || !this.useTempId ? false : withChilds;
    },
    /**
     * node paste하기
     * @method pasteNode
     * @param {Rui.ui.LUnorderedListNode} parentNode optional 지정하지 않으면 현재 선택된 node
     * @return {void}
     */
    pasteNode: function(parentNode){
        parentNode = parentNode ? parentNode : this.currentFocus;
        if (parentNode) {
            if (this.copiedRecordId) {
                var record = this.dataSet.get(this.copiedRecordId);
                //id도 새로 만들어야 한다.
                //펼치고, 마지막 자식의 order seq + 1해서 update한다.
                var newOrder = this.getMaxOrder(parentNode.getIdValue());
                if (!this.copyWithChilds) {
                    var cloneR = record.clone();
                    this.DATASET_EVENT_LOCK.ADD = true;
                    cloneR.setState(Rui.data.LRecord.STATE_INSERT);
                    this.dataSet.add(cloneR);
                    this.initIdValue(cloneR,{ignoreEvent: true});
                    cloneR.set(this.fields.parentId, parentNode.getIdValue(), {
                        ignoreEvent: true
                    });
                    if (this.fields.hasChild) {
                        cloneR.set(this.fields.hasChild, null, {
                            ignoreEvent: true
                        });
                    }
                    if(this.fields.order){
                       cloneR.set(this.fields.order, newOrder + 1, {
                            ignoreEvent: true
                        });
                    }
                    this.DATASET_EVENT_LOCK.ADD = false;
                }
                else {
                    //this.useTempId === true일 경우만 작동
                    var rsClone = new Array();
                    rsClone.push(record.clone());
                    this.concatArray(rsClone,this.getAllChildRecordsClone(record.get(this.fields.id)),true);
                    this.DATASET_EVENT_LOCK.ADD = true;
                    for (var i = 0; i < rsClone.length; i++) {
                        rsClone[i].setState(Rui.data.LRecord.STATE_INSERT);
                        this.dataSet.add(rsClone[i]);
                        this.initIdValue(rsClone[0],{ignoreEvent: true});
                        rsClone[0].set(this.fields.parentId, parentNode.getIdValue(), {
                            ignoreEvent: true
                        });
                        if(this.fields.order){
                           rsClone[0].set(this.fields.order, newOrder + 1, {
                                ignoreEvent: true
                            });
                        }
                    }
                    this.DATASET_EVENT_LOCK.ADD = false;
                }
                //복사된 node중 최상위 node만 dom을 만들면 된다.
                parentNode.open(true);
            }
            else
                if (this.deletedRecords) {
                    this.DATASET_EVENT_LOCK.ADD = true;
                    for (var i = 0; i < this.deletedRecords.length; i++) {
                        this.deletedRecords[i].setState(Rui.data.LRecord.STATE_INSERT);
                        this.dataSet.add(this.deletedRecords[i]);
                        this.deletedRecords[0].set(this.fields.parentId, parentNode.getIdValue(), {
                            ignoreEvent: true
                        });
                    }
                    this.DATASET_EVENT_LOCK.ADD = false;
                    //복사된 node중 최상위 node만 dom을 만들면 된다.
                    parentNode.open(true);
                }
        }
         this.copiedRecordId = null;
         this.copyWithChilds = null;
         this.deletedRecords = null;
    },
    /**
     * 자식의 maxOrder값
     * @private
     * @method getMaxOrder
     * @param {object} parentId
     * @return {int}
     */
    getMaxOrder: function(parentId){
        var maxOrder = -1;
        if (this.fields.order) {
            var rowCount = this.dataSet.getCount();
            var record;
            for (var i = 0; i < rowCount; i++) {
                record = this.dataSet.getAt(i);
                if (record.get(this.fields.parentId) === parentId) {
                    maxOrder = maxOrder < record.get(this.fields.order) ? record.get(this.fields.order) : maxOrder;
                }
            }
        }
        return maxOrder;
    },
    /**
     * 선택한 node의 dom 삭제
     * @private
     * @method removeNodeDom
     * @param {Rui.ui.LUnorderedListNode} node optional 지정하지 않으면 현재 선택된 node
     * @return {void}
     */
    removeNodeDom: function(node){
        node = node ? node : this.currentFocus;
        if (node) {
            var ulEl = Rui.get(node.getUL());
            var liCount = ulEl.select('> li').length;
            //Unique인지 검사, first & last parent no-child design
            if (liCount == 1) {
                if (node.getDepth() > 0) {
                    var pNode = this.getNodeObject(node.getParentLi());
                    pNode.changeStateTo(this.NODE_STATE.HAS_NO_CHILD);
                }
                //ul 삭제
                var ul = ulEl.dom;
                if (node === this.currentFocus) {
                    delete this.currentFocus;
                }
                delete node;
                delete ulEl;
                Rui.util.LDom.removeNode(ul);
            } else if(liCount > 1){
                //마지막인지 검사, previous sibling last design
                if (node.isLast()) {
                    var prevNode = this.getNodeObject(node.getPreviousLi());
                    if(prevNode) prevNode.changeStateTo(this.NODE_STATE.LAST);
                }
                 //li 삭제
                var li = node.getLi();
                if (node === this.currentFocus) delete this.currentFocus;
                delete node;
                Rui.util.LDom.removeNode(li);
            }
        }
    },
    /**
     * @description dataSet의 onAdd event 처리, id, parentId가 존재할 경우만 tree에서 의미가 있으므로 그때 처리된다.
     * @private
     * @method onAddData
     * @return {void}
     */
    onAddData: function(e){
        //data추가시 insert/new
        //e.target, e.record, e.row
        if (this.DATASET_EVENT_LOCK.ADD !== true) {
            if (this.isPossibleNodeRecord(e.record)) {
                //root에 추가
                if (e.record.get(this.fields.parentId) === this.getRootValue())
                    this.addChildNodeHtml(e.record, true);
                else {
                    var parentRecord = this.getParentRecord(e.record);
                    if (parentRecord) {
                        var node = this.findNode(parentRecord.id);//html dom에 없을 수도 있다.
                        //다시 그린다.
                        if (node)
                            node.open(true);
                    }
                }
            } else
                this.addTopNode(e.record.get(this.fields.label),e.row);
        }
    },
    /**
     * @description sorting/undoall/filter등에 의해 dataSet이 변경되었을 경우 다시 그린다.
     * @method onChangeData
     * @private
     * @return {void}
     */
    onChangeData: function(e){
        this.doRenderData();
    },
    /**
     * @description dataSet의 onUpdate event 처리, tree므로 label과 parent id가 변경되었을 경우만 처리된다.
     * @method onUpdateData
     * @private
     * @return {void}
     */
    onUpdateData: function(e){
        if (this.DATASET_EVENT_LOCK.UPDATE !== true) {
            //e.target, e.record, e.row, e.col, e.rowId(recordId), e.colId(fieldId), e.value, e.orginValue
            //수정 대상은 부모 자식 관계, 그리고 label
            var node = this.findNode(e.record.id);//html dom에 없을 수도 있다.
            var row = this.dataSet.getRow();
            if (e.colId == this.fields.parentId) {
                //node가 있으면 삭제한다.
                if (node)
                    this.removeNodeDom(node);
                if (e.value === this.getRootValue())
                    this.addChildNodeHtml(e.record, true);
                else {
                    var parentRecord = this.getParentRecord(e.record);
                    var parentNode = parentRecord ? this.findNode(parentRecord.id) : undefined;
                    this.addChildNodeHtml(e.record, false, parentNode);
                }
                //focus해야할 node이면 focus를 준다.
                if (e.row === row)
                    this.focusNode(row);
            }
            else
                if (node && e.colId == this.fields.label)
                    node.syncLabel();
                else
                    if (this.fields.order && e.colId == this.fields.order) {
                        this.redrawParent(e.record.get(this.fields.parentId), e.row);
                    }
                    else
                        if (node && e.colId == this.fields.id)
                            if (e.row === row)
                                this.lastFocusId = e.value;
        }
    },
    /**
     * @description dataSet의 onRemove event 처리, 해당 node를 삭제하고 부모에 focus가 간다.  자식을 다 삭제한다.
     * @method onRemoveData
     * @private
     * @return {void}
     */
    onRemoveData: function(e){
        if (this.DATASET_EVENT_LOCK.REMOVE !== true) {
            var deleted = true;
            var node = this.findNode(e.record.id,undefined,deleted);
            if (node) this.deleteNode(node, false, true, e.record.get(this.fields.parentId));
            else this.deleteRecord(e.record,false,true);
        }
    },
    /**
     * @description dataSet의 onUndo event 처리, 방금 수정한것 취소시, 이전 부모가 삭제되었을 수도 있으므로 다시 그려준다.
     * @method onUndoData
     * @private
     * @return {void}
     */
    onUndoData: function(e){
        //방금 수정한것 취소시, 이전 부모가 삭제되었을 수도 있으므로 다시 그려준다.
        this.doRenderData();
    },
    /**
     * @description dataset 지우기, 내용도 모두 지워진다.
     * @private
     * @method clearDataSet
     * @return {void}
     */
    clearDataSet: function(){
        this.doRenderData();
    },
    /**
     * @description dataset 행이동
     * @private
     * @method onRowPosChangedData
     * @return {void}
     */
    onRowPosChangedData: function(e){
        if (this.DATASET_EVENT_LOCK.ROW_POS_CHANGED !== true) {
            this.focusNode(e.row);
        }
    },
    /**
     * 자식 node를 동적으로 load
     * @method onLoadChildDataSet
     * @private
     * @return {void}
     */
    onLoadChildDataSet: function(e){
        var records = new Array(),
            nodeInfos = new Array(),
            isParentMarked = false,
            record, row, i;
        if (this.currentFocus) {
        	if(this.autoMark)
        		isParentMarked = this.dataSet.isMarked(this.dataSet.indexOfKey(this.currentFocus.getRecordId()));
            //현재 id를 부모로 하는 record들만 가져옴
            records = this.getChildRecords(this.currentFocus.getIdValue(), this.childDataSet);
            if (records.length > 0) {
                this.DATASET_EVENT_LOCK.ADD = true;
                for (i = 0; i < records.length; i++) {
                    record = records[i].clone();
                    row = this.dataSet.add(record);
                    if(this.autoMark && isParentMarked) this.dataSet.setMark(row, true);
                    nodeInfos.push(this.getNodeInfoByRecord(record));
                }
                this.DATASET_EVENT_LOCK.ADD = false;
            }
            this.currentFocus.renderChild(nodeInfos);
        }
    },
    /**
     * @description 콤포넌트가 render가 됐는지 여부
     * @method isRendered
     * @public
     * @return {boolean}
     */
    isRendered: function() {
        return this._rendered === true;
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
    },
    /**
     * DOM에서 패널 엘리먼트를 제거하고 모든 자식 엘리먼트들을 null로 설정한다.
     * @method destroy
     */
    destroy: function () {
        this.prevFocusNode = null;
        this.currentFocus = null;
        this.childDataSet = null;
        this.dataSet = null;
        Rui.ui.LUnorderedList.superclass.destroy.call(this);
    }
});
}