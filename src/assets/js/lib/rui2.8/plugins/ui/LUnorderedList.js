/*
 * @(#) LUnorderedList.js
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

if(!Rui.ui.LUnorderedList){
Rui.ui.LUnorderedList = function(config){
    config = config || {};
    config = Rui.applyIf(config, Rui.getConfig().getFirst('$.ext.unorderedList.defaultProperties'));
    if(Rui.platform.isMobile) config.useAnimation = false;
    this.createEvent('nodeClick');
    this.createEvent('dynamicLoadChild');
    this.createEvent('focusChanged');
    this.createEvent('collapse');
    this.createEvent('expand');
    this.renderDataEvent = this.createEvent('renderData', {isCE:true});
    this.createEvent('syncDataSet');
    Rui.ui.LUnorderedList.superclass.constructor.call(this, config);
};
Rui.extend(Rui.ui.LUnorderedList, Rui.ui.LUIComponent, {
    otype: 'Rui.ui.LUnorderedList',
    dataSet: null,
    renderer: null,
    endDepth: null,
    currentFocus: null,
    lastFocusId: undefined,
    focusLastest: true,
    prevFocusNode: null,
    childDataSet: null,
    hasChildValue: 1,
    defaultOpenDepth: -1,
    defaultOpenTopIndex: -1,
    onlyOneTopOpen: false,
    useTooltip: false,
    ulData: [],
    lastNodeInfos: undefined,
    useAnimation: false,
    animDuration: 0.3,
    syncDataSet: true,
    liWidth: null,
    container: null,
    autoMark: true,
    contextMenu: null,
    useTempId: false,
    DATASET_EVENT_LOCK: {
        ADD: false,
        UPDATE: false,
        REMOVE: false,
        ROW_POS_CHANGED: false,
        ROW_SELECT_MARK: false
    },
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
    setSyncDataSet: function(isSync) {
        this.cfg.setProperty('syncDataSet', isSync);
        if(isSync) this.doRenderData();
    },
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
    initDefaultConfig: function() {
        Rui.ui.LUnorderedList.superclass.initDefaultConfig.call(this);
        this.cfg.addProperty('syncDataSet', {
                handler: this._setSyncDataSet,
                value: this.syncDataSet,
                validator: Rui.isBoolean
        });
    },
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
    getUlHtml: function(parentId, depth, nodeInfos){
        var ts = this.templates || {};
        var nodes = '';
        if (this.endDepth === null || depth <= this.endDepth) {
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
    getAccessibilityUlRole: function(depth){
        return null;
    },
    getAccessibilityLiRole: function(){
        return null;
    },
    getNodeStateClass: function(hasChild, isLast){
        var cssNodeState = '';
        if (hasChild)
            cssNodeState = isLast ? this.CLASS_UL_HAS_CHILD_CLOSE_LAST : this.CLASS_UL_HAS_CHILD_CLOSE_MID;
        else
            cssNodeState = isLast ? this.CLASS_UL_HAS_NO_CHILD_LAST : this.CLASS_UL_HAS_NO_CHILD_MID;
        return cssNodeState;
    },
    getContent: function(record, cssNodeState, isMarked){
        return this.getLabel(record, cssNodeState);
    },
    getLabel: function(record, cssNodeState){
        var label = record.get(this.fields.label);
        label = label ? label : '&nbsp;';
        label = this.renderer ? this.renderer(label, record, cssNodeState) : label;
        return label;
    },
    isMarked: function(record){
        return this.dataSet.isMarked(this.dataSet.indexOfKey(record.id));
    },
    getChildNodeInfos: function(parentId, dataSet, parentDoms, refresh){
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
    getChildNodeInfosByDataSet: function(parentId, dataSet){
        var nodeInfos = new Array();
        if(parentId === this.fields.rootValue){
            this.ulData = [];
            nodeInfos = this.ulData;
        }
        var records = this.getChildRecords(parentId,dataSet);
        if (this.fields.setRootFirstChild === true && !this.rootChanged && parentId === this.fields.rootValue && records.length > 0) {
            this.rootChanged = true;
            this.tempRootValue = records[0].get(this.fields.id);
            records = this.getChildRecords(this.tempRootValue);
        }
        for (var i = 0; i < records.length; i++)
            nodeInfos.push(this.getNodeInfoByRecord(records[i]));
        return nodeInfos;
    },
    getRootValue: function(){
        return this.fields.setRootFirstChild === true ? this.tempRootValue : this.fields.rootValue;
    },
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
    getSortedRecords: function(records){
        var sort_order_idx = new Array();
        var order;
        for (var i = 0; i < records.length; i++) {
            order = records[i].get(this.fields.order);
            sort_order_idx.push((order ? order : 10000000000) + '.' + i.toString());
        }
        sort_order_idx.sort(function(x, y){
            return x - y;
        });
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
    getChildNodeInfosByDom: function(parentDoms,refresh){
        var nodeInfo = this.getNodeInfo(parentDoms);
        nodeInfo.children = (nodeInfo.hasChild && nodeInfo.children.length == 0) || refresh ? this.findChildNodeInfos(nodeInfo, parentDoms[0], refresh) : nodeInfo.children;
        if(refresh) nodeInfo.hasChild = nodeInfo.children.length > 0 ? this.hasChildValue : false;
        return nodeInfo.children;
    },
    getNodeInfo: function(parentDoms){
        var searchSuccess = true;
        var nodeInfos = this.ulData;
        searchSuccess = parentDoms ? true : false;
        if (searchSuccess) {
            for (var i = parentDoms.length - 1; i >= 0; i--) {
                nodeInfo = this.findNodeInfo(nodeInfos, parentDoms[i]);
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
    findNodeInfo: function(nodeInfos,dom){
        nodeInfos = nodeInfos.length == 0 ? this.getNodeInfos(this.getUL(dom)) : nodeInfos;
        return this.checkHasNode(nodeInfos,dom);
    },
    getNodeInfos: function(ul){
        var nodeInfos = new Array();
        var liCount = ul.childNodes.length;
        for (var i=0;i<liCount;i++)
            nodeInfos.push(this.getNodeInfoByDom(ul.childNodes[i].firstChild,i));
        return nodeInfos.length > 0 ? nodeInfos : false;
    },
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
    checkHasChildByDom: function(dom){
        return this.getChildUL(dom) ? true : this.checkHasChild(this.dataSet.get(this.getRecordId(dom)));
    },
    getNodeInfoByRecord: function(record){
        return {id:record.id,hasChild:this.checkHasChild(record),order:record.get(this.fields.order),children:[]};
    },
    getNodeInfoByDom: function(dom,idx){
        return {id:this.getRecordId(dom),hasChild:this.checkHasChildByDom(dom),order:idx,children:[]};
    },
    getRecordByNodeInfo: function(nodeInfo){
        return this.dataSet.get(nodeInfo.id);
    },
    htmlToDom: function(html){
        var div = document.createElement('div');
        div.innerHTML = html;
        return div.childNodes[0];
    },
    markChilds: function (isMarked, record) {
        if (this.autoMark) {
            var records = this.getChildRecords(record.get(this.fields.id));
            for (var i = 0; i < records.length; i++){
                records[i].treeType = 'child';
                this.markData(this.dataSet.indexOfKey(records[i].id), isMarked);
            }
        }
        this.onRecordMarking = false;
    },
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
    afterRender: function(container){
        Rui.ui.LUnorderedList.superclass.afterRender.call(this, container);
        this.el.unOn('click', this.onNodeClick, this);
        this.el.on('click', this.onNodeClick, this, true);
        this.unOn('dynamicLoadChild', this.onDynamicLoadChild, this, true);
        this.on('dynamicLoadChild', this.onDynamicLoadChild, this, true);
    },
    initDefaultFocus: function(){
        if (!this.lastFocusId && this.defaultOpenTopIndex > -1)
            this.openFirstDepthNode(this.defaultOpenTopIndex);
        else {
            if (!this.setFocusLastest())
                this.refocusNode(this.dataSet.getRow());
        }
    },
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
    toggleChild: function(node){
        node.toggleChild();
    },
    focusNode: function(row){
        if (!this.isPossibleNodeRecord(this.dataSet.getAt(row))) return false;
        if(this.currentFocus && this.currentFocus.getRow() === row) return false;
        var nextFocusingNode = row >= 0 ? this.findNode(this.dataSet.getAt(row).id) : false;
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
    refocusNode: function(row,ignoreCanRowPos){
        ignoreCanRowPos = ignoreCanRowPos == true ? true : false;
        var currentRow = this.dataSet.getRow();
        if(currentRow == row)
            this.focusNode(row);
        else
            this.dataSet.setRow(row,{ignoreCanRowPosChangeEvent: ignoreCanRowPos});
    },
    isPossibleNodeRecord: function(record){
        return record === undefined || record.get(this.fields.parentId) === undefined ? false : true;
    },
    getLastLi: function(ulDom){
        return ulDom.childNodes && ulDom.childNodes.length > 0 ? ulDom.childNodes[ulDom.childNodes.length - 1] : false;
    },
    getLi: function(ulDom,index){
        return index < ulDom.childNodes.length ? ulDom.childNodes[index] : false;
    },
    getUL: function (dom) {
        return dom.parentNode.parentNode;
    },
    getChildUL: function (dom) {
        var n_node = Rui.util.LDom.getNextSibling(dom);
        return n_node && n_node.nodeType == 1 && n_node.tagName.toLowerCase() == 'ul' ? n_node : false;
    },
    findNode: function(recordId, dom, deleted){
        if(!deleted && !this.isPossibleNodeRecord(this.dataSet.get(recordId))) return false;
        var el = dom ? Rui.get(dom) : this.el,
            els = el.select('div.' + this.CLASS_UL_NODE + '-' + recordId,true);
        el = els.getAt(0);
        return el && els.length > 0 ? this.getNodeObject(el.dom) : false;
    },
    buildNodes: function(row){
        var node = false;
        if (row > -1 && this.isPossibleNodeRecord(this.dataSet.getAt(row))) {
            var parentRecords = this.getParentRecords(row);
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
    findNodeByDom: function(dom){
        var nodeDom = Rui.util.LDom.findParent(dom, 'div.' + this.CLASS_UL_NODE, 10);
        return this.getNodeObject(nodeDom);
    },
    getFirstDepthNode: function(index){
        var rootUL = this.getRootUL();
        return rootUL ? this.getNodeObject(this.getLi(rootUL.dom,index)) : false;
    },
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
    getNode: function(record){
        return this.findNode(record.id);
    },
    getNodeById: function(id) {
        var row = this.dataSet.findRow(this.fields.id, id);
        if(row < 0) return null;
        var r = this.dataSet.getAt(row);
        return this.getNode(r);
    },
    getNodeObject: function(dom){
        if(dom){
            var recordId = this.getRecordId(dom);
            if (this.currentFocus && this.currentFocus.getRecordId() == recordId)
                return this.currentFocus;
            else
                return this.createNodeObject(dom);
        } else return null;
    },
    createNodeObject: function(dom){
        return new Rui.ui.LUnorderedListNode({
            unorderList: this,
            useAnimation: this.useAnimation,
            dom: dom
        });
    },
    createNode: function(config) {
        config = Rui.applyIf(config || {}, {
            unorderList: this,
            nodeConstructor: this.NODE_CONSTRUCTOR
        });
        return new eval(config.nodeConstructor + '.prototype.constructor')(config);
    },
    getFocusNode: function(){
        return this.currentFocus;
    },
    getFocusLastest: function(){
        return this.getFocusNode();
    },
    getRootUL: function(){
        var els = this.el.select('.' + this.CLASS_UL_FIRST,true);
        return els.length > 0 ? els.getAt(0) : false;
    },
    getParentRecord: function(record){
        if(!this.isPossibleNodeRecord(record)) return false;
        var row = this.dataSet.findRow(this.fields.id, record.get(this.fields.parentId));
        return row > -1 ? this.dataSet.getAt(row) : false;
    },
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
    getParentId: function(dom){
        return this.dataSet.get(this.getRecordId(dom)).get(this.fields.id);
    },
    getRecordId: function(dom){
        dom = dom.tagName.toLowerCase() == 'li' ? dom.firstChild : dom;
        return Rui.util.LDom.findStringInClassName(dom, this.CLASS_UL_NODE + '-');
    },
    getNodeLabel: function(node){
        node = node ? node : this.currentFocus;
        return node ? this.dataSet.get(node.getRecordId()).get(this.fields.label) : '';
    },
    setFocusLastest: function(){
        return (this.focusLastest && this.lastFocusId !== undefined && this.dataSet) ? this.setFocusById(this.lastFocusId) : false;
    },
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
    setRootValue : function(rootValue){
        this.fields.rootValue = rootValue;
        this.doRenderData();
    },
    doBeforeLoad: function(e) {
        this.showLoadingMessage();
    },
    onLoadDataSet: function(e){
        this.doRenderData();
        this.hideLoadingMessage();
    },
    showLoadingMessage: function(){
        if(!this.el) return;
        this.el.mask();
    },
    hideLoadingMessage: function() {
        if(!this.el) return;
        this.el.unmask();
    },
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
    onExpand: function(e){
        var currentFocus = e.node;
        if(currentFocus && currentFocus.getParentId() == e.target.getIdValue()){
            this.el.moveScroll(currentFocus.el, false, true);
        }
    },
    setDataSet: function(dataSet) {
        this.setSyncDataSet(false);
        this.dataSet = dataSet;
        this.setSyncDataSet(true);
    },
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
    getAllChildRecordsClone: function(parentId, dataSet, initIdValue){
        return this.getCloneRecords(this.getAllChildRecords(parentId, dataSet),initIdValue);
    },
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
    onTriggerContextMenu: function(e){
        var node = this.findNodeByDom(this.contextMenu.contextEventTarget);
        if (!node)
            this.contextMenu.cancel(false);
        else
            this.refocusNode(node.getRow());
    },
    onDynamicLoadChild: function(e){
    },
    setNodeLabel: function(label,node){
        node = node ? node : this.currentFocus;
        if(node) this.dataSet.get(node.getRecordId()).set(this.fields.label,label);
    },
    initIdValue: function(record, option){
        var fieldValue = undefined;
        if (this.useTempId) {
            var field = record.findField(this.fields.id);
            var today = new Date;
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
    addTopNode: function(label,row){
        return this.addChildNode(label, true, row);
    },
    addChildNode: function(label, addTop, row){
        var parentId = addTop === true ? this.getRootValue() : (this.currentFocus ? this.currentFocus.getIdValue() : this.getRootValue());
        var record;
        if (typeof parentId !== 'undefined') {
            if (typeof row === 'undefined') {
                this.DATASET_EVENT_LOCK.ADD = true;
                this.DATASET_EVENT_LOCK.ROW_POS_CHANGED = true;
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
            alert('부모의 id가 없음.  신규 추가한 node에 id가 있어야 자식을 추가할 수 있음. \r\ntempId를 사용하려면 config.useTempId:true로 설정.  \r\n이 경우 create된 record는 id 또는 parentId가 temp값이므로 DB업데이트시 주의요망');
        }
        return row;
    },
    addChildNodeHtml: function(record, addTop, parentNode){
        var nodeInfos = [this.getNodeInfoByRecord(record)];
        parentNode = parentNode ? parentNode : this.currentFocus;
        if (!addTop && parentNode) {
            parentNode.open(true);
        }
        else {
            var rootUL = this.getRootUL();
            if (!rootUL) {
                this.el.html(this.getUlHtml(undefined, null, nodeInfos));
            } else {
                var node = this.getNodeObject(this.getLastLi(rootUL.dom));
                node.changeStateTo(this.NODE_STATE.MID);
                rootUL.appendChild(this.htmlToDom(this.getLiHtml(nodeInfos[0], null, true)));
            }
            this.ulData.push(nodeInfos[0]);
        }
    },
    concatArray: function(origin,adding){
        for (var i=0;i<adding.length;i++){
            origin.push(adding[i]);
        }
    },
    redrawParent: function(parentId,focusChildRow,isDelete){
        isDelete = isDelete == true ? true : false;
        if (parentId !== undefined) {
            if (parentId !== this.getRootValue()) {
                var parentRow = this.dataSet.findRow(this.fields.id, parentId);
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
    deleteRecord: function(record,clone,childOnly){
        var rs = new Array();
        if(!childOnly) rs.push(record);
        this.concatArray(rs,this.getAllChildRecords(record.get(this.fields.id)));
        var cloneRecords = clone ? this.getCloneRecords(rs) : undefined;
        this.DATASET_EVENT_LOCK.ROW_POS_CHANGED = true;
        for (var i=rs.length-1;i>-1;i--) {
            this.DATASET_EVENT_LOCK.REMOVE = true;
            this.dataSet.removeAt(this.dataSet.indexOfKey(rs[i].id));
            this.DATASET_EVENT_LOCK.REMOVE = false;
        }
        this.DATASET_EVENT_LOCK.ROW_POS_CHANGED = false;
        return cloneRecords;
    },
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
    cutNode: function(node){
        node = node ? node : this.currentFocus;
        this.deletedRecords = node ? this.deleteNode(node,true) : null;
    },
    copyNode: function(withChilds, node){
        node = node ? node : this.currentFocus;
        this.copiedRecordId = node ? node.getRecordId() : null;
        this.copyWithChilds = withChilds == undefined || withChilds == null || !this.useTempId ? false : withChilds;
    },
    pasteNode: function(parentNode){
        parentNode = parentNode ? parentNode : this.currentFocus;
        if (parentNode) {
            if (this.copiedRecordId) {
                var record = this.dataSet.get(this.copiedRecordId);
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
                    parentNode.open(true);
                }
        }
         this.copiedRecordId = null;
         this.copyWithChilds = null;
         this.deletedRecords = null;
    },
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
    removeNodeDom: function(node){
        node = node ? node : this.currentFocus;
        if (node) {
            var ulEl = Rui.get(node.getUL());
            var liCount = ulEl.select('> li').length;
            if (liCount == 1) {
                if (node.getDepth() > 0) {
                    var pNode = this.getNodeObject(node.getParentLi());
                    pNode.changeStateTo(this.NODE_STATE.HAS_NO_CHILD);
                }
                var ul = ulEl.dom;
                if (node === this.currentFocus) {
                    delete this.currentFocus;
                }
                delete node;
                delete ulEl;
                Rui.util.LDom.removeNode(ul);
            } else if(liCount > 1){
                if (node.isLast()) {
                    var prevNode = this.getNodeObject(node.getPreviousLi());
                    if(prevNode) prevNode.changeStateTo(this.NODE_STATE.LAST);
                }
                var li = node.getLi();
                if (node === this.currentFocus) delete this.currentFocus;
                delete node;
                Rui.util.LDom.removeNode(li);
            }
        }
    },
    onAddData: function(e){
        if (this.DATASET_EVENT_LOCK.ADD !== true) {
            if (this.isPossibleNodeRecord(e.record)) {
                if (e.record.get(this.fields.parentId) === this.getRootValue())
                    this.addChildNodeHtml(e.record, true);
                else {
                    var parentRecord = this.getParentRecord(e.record);
                    if (parentRecord) {
                        var node = this.findNode(parentRecord.id);
                        if (node)
                            node.open(true);
                    }
                }
            } else
                this.addTopNode(e.record.get(this.fields.label),e.row);
        }
    },
    onChangeData: function(e){
        this.doRenderData();
    },
    onUpdateData: function(e){
        if (this.DATASET_EVENT_LOCK.UPDATE !== true) {
            var node = this.findNode(e.record.id);
            var row = this.dataSet.getRow();
            if (e.colId == this.fields.parentId) {
                if (node)
                    this.removeNodeDom(node);
                if (e.value === this.getRootValue())
                    this.addChildNodeHtml(e.record, true);
                else {
                    var parentRecord = this.getParentRecord(e.record);
                    var parentNode = parentRecord ? this.findNode(parentRecord.id) : undefined;
                    this.addChildNodeHtml(e.record, false, parentNode);
                }
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
    onRemoveData: function(e){
        if (this.DATASET_EVENT_LOCK.REMOVE !== true) {
            var deleted = true;
            var node = this.findNode(e.record.id,undefined,deleted);
            if (node) this.deleteNode(node, false, true, e.record.get(this.fields.parentId));
            else this.deleteRecord(e.record,false,true);
        }
    },
    onUndoData: function(e){
        this.doRenderData();
    },
    clearDataSet: function(){
        this.doRenderData();
    },
    onRowPosChangedData: function(e){
        if (this.DATASET_EVENT_LOCK.ROW_POS_CHANGED !== true) {
            this.focusNode(e.row);
        }
    },
    onLoadChildDataSet: function(e){
        var records = new Array(),
            nodeInfos = new Array(),
            isParentMarked = false,
            record, row, i;
        if (this.currentFocus) {
        	if(this.autoMark)
        		isParentMarked = this.dataSet.isMarked(this.dataSet.indexOfKey(this.currentFocus.getRecordId()));
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
    isRendered: function() {
        return this._rendered === true;
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
    },
    destroy: function () {
        this.prevFocusNode = null;
        this.currentFocus = null;
        this.childDataSet = null;
        this.dataSet = null;
        Rui.ui.LUnorderedList.superclass.destroy.call(this);
    }
});
}