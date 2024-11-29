/*
 * @(#) LUnorderedListNode-debug.js
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
 * @description LUnorderedListNode
 * @module ui
 * @namespace Rui.ui
 * @class LUnorderedListNode
 * @constructor
 * @param {Object} oConfig The intial LUnorderedListNode.
 */
if(!Rui.ui.LUnorderedListNode){
/**
 * @description tree나 menu 콤포넌트의 node의 최상위 클래스
 * @namespace Rui.ui
 * @plugin /ui/tree/rui_tree.js,/ui/tree/rui_tree.css
 * @class LUnorderedListNode
 * @sample default
 * @constructor LUnorderedListNode
 * @protected
 * @param {Object} oConfig The intial LUnorderedList.
 */
Rui.ui.LUnorderedListNode = function (config) {
    Rui.applyObject(this, config);
    this.init();
};
Rui.ui.LUnorderedListNode.prototype = {
    /**
     * node의 LElement
     * @private
     * @property el
     * @type {Rui.LElement}
     * @default null
     */
    el: null,
    /**
     * @description 객체의 문자열
     * @property otype
     * @private
     * @type {String}
     */
    otype: 'Rui.ui.LUnorderedListNode',
    /**
     * node의 record id
     * @private
     * @property recordId
     * @type {string}
     * @default null
     */
    recordId: null,
    /**
     * data id
     * @private
     * @property idValue
     * @type {object}
     * @default null
     */
    idValue: null,
    /**
     * depth
     * @private
     * @property depth
     * @type {int}
     * @default null
     */
    depth: null,
    /**
     * dom
     * @private
     * @property dom
     * @type {HTMLElement}
     * @default null
     */
    dom: null,
    /**
     * 마지막 node인지 여부
     * @private
     * @property isLeaf
     * @type {boolean}
     * @default null
     */
    isLeaf: null,
    /**
     * unorderList
     * @private
     * @property unorderList
     * @type {Rui.ui.LUnorderedList}
     * @default null
     */
    unorderList: null,
    /**
     * NODE_STATE
     * @private
     * @property NODE_STATE
     * @type {Object}
     * @default null
     */
    NODE_STATE: null,
    /**
     * animation 작동 여부
     * @config useAnimation
     * @type {boolean}
     * @default false
     */
    /**
     * animation 작동 여부
     * @property useAnimation
     * @type {boolean}
     * @default false
     */
    useAnimation: false,
    /**
     * expand시 다른 slibling을 닫을지 여부
     * @config useCollapseAllSibling
     * @type {boolean}
     * @default false
     */
    /**
     * expand시 다른 slibling을 닫을지 여부
     * @property useCollapseAllSibling
     * @type {boolean}
     * @default false
     */
    useCollapseAllSibling: false,
    /**
     * expand시 자식 ul의 height
     * @property childULHeight
     * @type {int}
     * @default 0
     */
    childULHeight: 0,
    /**
     * @description ul node 초기화
     * @method init
     * @private
     * @return {void}
     */
    init: function () {
        this.dom = this.dom.tagName.toLowerCase() == 'li' ? this.dom.firstChild : this.dom;
        this.el = Rui.get(this.dom);
        this.NODE_STATE = this.unorderList.NODE_STATE;
        this.recordId = this.unorderList.getRecordId(this.dom);
        var depth = Rui.util.LDom.findStringInClassName(this.dom, this.unorderList.CLASS_UL_LI_DIV_DEPTH + '-');
        this.depth = depth == 'null' ? false : parseInt(depth);
        this.initIsLeaf();
    },
    /**
     * @description leaf인지 검사후 설정
     * @method initIsLeaf
     * @private
     * @return {void}
     */
    initIsLeaf: function () {
        var isLeaf = true;
        var record = this.unorderList.dataSet.get(this.recordId);
        //record가 삭제된 경우 pass
        if (record) {
            if (this.unorderList.fields.hasChild) {
                var hasChild = record.get(this.unorderList.fields.hasChild);
                if (this.unorderList.hasChildValue != null) {
                    hasChild = hasChild == this.unorderList.hasChildValue ? true : false;
                }
                isLeaf = hasChild ? false : true;
            }
            else {
                var parentId = record.get(this.unorderList.fields.id);
                var row_count = this.unorderList.dataSet.getCount();
                var r = null;
                for (var i = 0; i < row_count; i++) {
                    r = this.unorderList.dataSet.getAt(i);
                    if (r.get(this.unorderList.fields.parentId) === parentId) {
                        isLeaf = false;
                        break;
                    }
                }
            }
        }
        this.isLeaf = isLeaf;
    },
    /**
     * @description 현재 자신의 dataSet에 해당되는 record의 id를 리턴한다.
     * @method getRecordId
     * @public
     * @sample default
     * @return {string} recordId
     */
    getRecordId: function () {
        return this.recordId;
    },
    /**
     * 자신의 부모 node에 대한 dataSet에 해당되는 record의 id를 리턴한다.
     * @method getParentId
     * @public
     * @sample default
     * @return {string} recordId
     */
    getParentId: function () {
        var record = this.getRecord();
        return record ? record.get(this.unorderList.fields.parentId) : undefined;
    },
    /**
     * 자신의 부모에 해당되는 node를 찾아 리턴한다.
     * @method getParentNode
     * @public
     * @sample default
     * @return {Rui.ui.LUnorderedListNode}
     */
    getParentNode: function(){
    	if(this.getDepth() > 0){
    		var parentDom = this.getParentDom();
    		if(parentDom)
    			return this.unorderList.createNodeObject(parentDom);
    	}
    	return false;
    },
    /**
     * ID field에 해당하는 값을 반환한다.
     * @method getIdValue
     * @public
     * @return {object}
     */
    getIdValue: function () {
        var record = this.getRecord();
        this.idValue = record ? record.get(this.unorderList.fields.id) : undefined;
        return this.idValue;
    },
    /**
     * 현재 node에 해당되는 dataSet의 record 객체를 리턴한다.
     * @method getRecord
     * @public
     * @sample default
     * @return {Rui.data.LRecord}
     */
    getRecord: function () {
        return this.unorderList.dataSet.get(this.getRecordId());
    },
    /**
     * 현재 node에 해당되는 dataSet의 record index를 리턴한다.
     * @method getRow
     * @public
     * @sample default
     * @return {int}
     */
    getRow: function () {
        return this.unorderList.dataSet.indexOfKey(this.getRecordId());
    },
    /**
     * @description depth return
     * @method getDepth
     * @public
     * @return {int} depth
     */
    getDepth: function () {
        return this.depth;
    },
    /**
     * @description 자식을 가지고 있는지 검사
     * @method hasChild
     * @public
     * @return {boolean} 자식이 있으면 true
     */
    hasChild: function () {
        return !this.isLeaf;
    },
    /**
     * 현재 node가 focus된 상태인지를 리턴한다.
     * @method isFocus
     * @public
     * @sample default
     * @return {boolean}
     */
    isFocus: function () {
        return this.checkNodeState(this.NODE_STATE.FOCUS);
    },
    /**
     * focus style 적용
     * @private
     * @method focus
     * @return {void}
     */
    focus: function () {
        this.changeStateTo(this.NODE_STATE.FOCUS);
        if(this.isTop()) this.changeStateTo(this.NODE_STATE.FOCUS_TOP);
    },
    /**
     * focus style 삭제
     * @private
     * @method unfocus
     * @return {void}
     */
    unfocus: function () {
        this.changeStateTo(this.NODE_STATE.UNFOCUS);
    },
    /**
     * 현재 node의 상태가 마크되었는지를 리턴한다.
     * @method isMarked
     * @public
     * @sample default
     * @return {boolean}
     */
    isMarked: function () {
        return this.checkNodeState(this.NODE_STATE.MARK);
    },
    /**
     * 현재 node의 상태를 mark 상태로 설정한다.
     * @method mark
     * @public
     * @sample default
     * @return {void}
     */
    mark: function () {
        this.changeStateTo(this.NODE_STATE.MARK);
        if(this.getRecord().treeType == 'child'){
            this.unorderList.markChilds(true, this.getRecord());
        }
        else if (this.getRecord().treeType == 'parent'){
            this.unorderList.markParents(true, this);
        }
    },
    /**
     * 현재 node의 상태를 mark 상태를 취소한다.
     * @method unmark
     * @public
     * @sample default
     * @return {void}
     */
    unmark: function () {
        this.changeStateTo(this.NODE_STATE.UNMARK);
        if(this.getRecord().treeType == 'child'){
            this.unorderList.markChilds(false, this.getRecord());
        }
        else if (this.getRecord().treeType == 'parent'){
            this.unorderList.markParents(false, this);
        }
    },
    /**
     * 현재 node가 현재 같은 레벨(sibling)의 마지막 node인지 여부를 리턴한다.
     * @method isLast
     * @public
     * @sample default
     * @return {boolean}
     */
    isLast: function () {
        return this.checkNodeState(this.NODE_STATE.last);
    },
    /**
     * 최상위(root) node인지 여부를 리턴한다.
     * @method isTop
     * @public
     * @sample default
     * @return {boolean}
     */
    isTop: function(){
        return this.depth == 0 ? true : false;
    },
    /**
     * 현재 node가 펼쳐진 상태인지 여부를 리턴한다.
     * @method isExpand
     * @public
     * @sample default
     * @return {boolean}
     */
    isExpand: function () {
        return this.checkNodeState(this.NODE_STATE.OPEN);
    },
    /**
     * 현재 node가 닫혀진 상태인지 여부를 리턴한다.
     * @method isCollaps
     * @public
     * @sample default
     * @return {boolean}
     */
    isCollaps: function () {
        return this.checkNodeState(this.NODE_STATE.CLOSE);
    },
    /**
     * 노드를 펼친다.
     * @private
     * @method open
     * @param {boolean} refresh 지우고 다시 그릴지 여부
     * @return {void}
     */
    open: function (refresh) {
        var nodeInfos = new Array();
        //지우고 다시 그린다.
        if(refresh) this.removeChildUL(undefined,refresh);
        //cache가 있으면 그것 사용
        nodeInfos = this.unorderList.getChildNodeInfos(this.getIdValue(), null, this.getParentDoms(), refresh);
        if (!refresh && nodeInfos.length == 0) {
             this.unorderList.fireEvent('dynamicLoadChild',{
                 target: this.unorderList,
                 node: this,
                 parentId: this.getIdValue()
             });
        } else {
            this.renderChild(nodeInfos,refresh);
        }
        if(this.useCollapseAllSibling || (this.getDepth() === 0 && this.unorderList.onlyOneTopOpen === true))
            this.collapseAllSibling();
    },
    /**
     * 노드가 펼쳐질때 하위에 나타날 자식노드를 랜더링한다.
     * @private
     * @method renderChild
     * @param {array} nodeInfos 그릴 자식 node info array
     * @param {boolean} refresh 지우고 다시 그릴지 여부
     * @return {void}
     */
    renderChild: function(nodeInfos,refresh){
        if (nodeInfos.length > 0) {
            this.addChildNodes(nodeInfos,refresh);
            this.changeStateTo(this.NODE_STATE.OPEN);
        } else {
            //자식이 없다.
            this.changeStateTo(this.NODE_STATE.HAS_NO_CHILD);
        }
    },
    /**
     * 노드를 접는다.
     * @private
     * @method close
     * @return {void}
     */
    close: function () {
        this.changeStateTo(this.NODE_STATE.CLOSE);
        this.removeChildUL();
    },
    /**
     * label을 dataSet과 동기화하기
     * @private
     * @method syncLabel
     * @return {void}
     */
    syncLabel: function () {
        //label을 record값과 sync
        this.el.html(this.unorderList.getContent(this.getRecord()));
    },
    /**
     * 노드 펼치고 접기 토글
     * @method toggleChild
     * @public
     * @return {void}
     */
    toggleChild: function () {
        if (this.isExpand()) {
            this.close();
        } else if (this.isCollaps()) {
            this.open();
        }
    },
    /**
     * 현재 node를 펼친다.
     * @method expand
     * @public
     * @sample default
     * @return {void}
     */
    expand: function(){
        if(this.isCollaps()) this.open();
    },
    /**
     * 현재 node를 닫는다.
     * @method collapse
     * @public
     * @sample default
     * @return {void}
     */
    collapse: function(){
        if(this.isExpand()) this.close();
    },
    /**
     * 자신의 노드를 제외한 다른 형제노드들을 모두 접는다.
     * @method collapseAllSibling
     * @public
     * @sample default
     * @param {int} exceptIndex 닫지 않는 top node index
     * @return {void}
     */
    collapseAllSibling: function(){
        var ul = this.getUL();
        for (var i=0;i<ul.childNodes.length;i++){
            if(ul.childNodes[i].firstChild !== this.dom)
                this.unorderList.getNodeObject(ul.childNodes[i]).collapse();
        }
    },
    /**
     * 순서 index 가져오기
     * @method getOrder
     * @public
     * @return {int}
     */
    getOrder : function(){
        if(this.unorderList.fields.order) return this.getRecord().get(this.unorderList.fields.order); else return null;
    },
    /**
     * @description 자식이 있는지 검사, 있으면 ul return 없으면 false return
     * @method getChildUL
     * @private
     * @param {HTMLElement} dom click한 node div
     * @return {HTMLElement}
     */
    getChildUL: function (dom) {
        return this.unorderList.getChildUL(dom ? dom : this.dom);
    },
    /**
     * @description child ul의 height
     * @method getChildULHeight
     * @private
     * @return {int}
     */
    getChildULHeight : function(){
        return this.childULHeight;
    },
    /**
     * child ul dom 지우기
     * @private
     * @method removeChildUL
     * @param {HTMLElement} dom
     * @param {boolean} refresh 다시 그리는 경우는 anim 동작 안함
     * @return {void}
     */
    removeChildUL: function (dom,refresh) {
        var ul = this.getChildUL(dom);
        if (ul) {
            var li = this.getLi();
            if (!refresh && this.useAnimation && (this.useAnimation === true || this.useAnimation.collapse === true)) {
                li.style.overflow = 'hidden';
                var anim = new Rui.fx.LAnim({
                    el: ul,
                    attributes: {
                        height: {
                            to: 1
                        }
                    },
                    duration: this.unorderList.animDuration
                });
                var thisNode = this;
                anim.on('complete', function(){
                    li.removeChild(ul);
                    thisNode.unorderList.fireEvent('collapse', {
                        target: thisNode,
                        node: thisNode.unorderList.currentFocus
                    });
                    li.style.overflow = '';
                });
                anim.animate();
            }else{
                li.style.overflow = 'hidden';
                li.removeChild(ul);
                this.unorderList.fireEvent('collapse', {
                    target: this,
                    node: this.unorderList.currentFocus
                });
                li.style.overflow = '';
            }
        }
    },
    /**
     * ul 가져오기
     * @private
     * @method getUL
     * @param {HTMLElement} dom optional
     * @return {HTMLElement}
     */
    getUL: function (dom) {
        return this.unorderList.getUL(dom ? dom : this.dom);
    },
    /**
     * 현재 dom의 ul하에서의 index 가져오기
     * @private
     * @method getIndex
     * @return {int}
     */
    getIndex: function(){
        var ul = this.getUL();
        var li = this.getLi();
        var index = -1;
        for (var i=0;i<ul.childNodes.length;i++){
            if(li === ul.childNodes[i]){
                index = i;
                break;
            }
        }
        return index;
    },
    /**
     * li 가져오기
     * @private
     * @method getLi
     * @param {HTMLElement} dom optional
     * @return {HTMLElement}
     */
    getLi: function (dom) {
        dom = dom ? dom : this.dom;
        return dom.parentNode;
    },
    /**
     * parent li 가져오기
     * @private
     * @method getParentLi
     * @param {HTMLElement} dom optional
     * @return {HTMLElement}
     */
    getParentLi: function (dom) {
        dom = dom ? dom : this.dom;
        var li = dom.parentNode.parentNode.parentNode;
        li = li && li.tagName && li.tagName.toLowerCase() == 'li' ? li : null;
        return li;
    },
    /**
     * previous sibling li 가져오기
     * @private
     * @method getPreviousLi
     * @param {HTMLElement} dom optional
     * @return {HTMLElement}
     */
    getPreviousLi: function (dom) {
        dom = dom ? dom : this.dom;
        var li = this.getLi(dom);
        return Rui.util.LDom.getPreviousSibling(li);
    },
    /**
     * next sibling li 가져오기
     * @private
     * @method getNextLi
     * @param {HTMLElement} dom optional
     * @return {HTMLElement}
     */
    getNextLi: function (dom) {
        dom = dom ? dom : this.dom;
        var li = this.getLi(dom);
        return Rui.util.LDom.getNextSibling(li);
    },
    /**
     * next sibling dom 가져오기
     * @private
     * @method getNextDom
     * @param {HTMLElement} dom optional
     * @return {HTMLElement}
     */
    getNextDom: function(dom){
        dom = dom ? dom : this.dom;
        var li = this.getNextLi(dom);
        var div = null;
        if(li){
            div = li.firstChild;
            div = div && div.tagName && div.tagName.toLowerCase() == 'div' ? div : null;
        }
        return div;
    },
    /**
     * previous sibling dom 가져오기
     * @private
     * @method getPreviousDom
     * @param {HTMLElement} dom optional
     * @return {HTMLElement}
     */
    getPreviousDom: function(dom){
        dom = dom ? dom : this.dom;
        var li = this.getPreviousLi(dom);
        var div = null;
        if(li){
            div = li.firstChild;
            div = div && div.tagName && div.tagName.toLowerCase() == 'div' ? div : null;
        }
        return div;
    },
    /**
     * 마지막 자식 content dom(div) 가져오기
     * @private
     * @method getLastChildDom
     * @return {HTMLElement}
     */
    getLastChildDom: function () {
        var ul = this.getChildUL();
        if (ul) return ul.lastChild.firstChild; else return null;
    },
    /**
     * 부모 content dom(div) 가져오기
     * @private
     * @method getParentDom
     * @return {HTMLElement}
     */
    getParentDom: function(dom){
        dom = dom ? dom : this.dom;
        var li = this.getParentLi(dom);
        var div = null;
        if(li){
            div = li.firstChild;
            div = div && div.tagName && div.tagName.toLowerCase() == 'div' ? div : null;
        }
        return div;
    },
    /**
     * 현재를 포함한 부모 dom을 역순으로 가져온다.
     * @private
     * @method getParentDoms
     * @param {boolean} exceptCurrent true이면 현재 dom은 포함하지 않는다.
     * @return {HTMLElement}
     */
    getParentDoms: function(exceptCurrent){
        var parentDoms = new Array();
        var dom = this.dom;
        // var recordId = null;
        if(exceptCurrent !== true) parentDoms.push(dom);
        for (var i=0;i<100;i++){
            dom = this.getParentDom(dom);
            if(dom) parentDoms.push(dom); else break;
        }
        return parentDoms;
    },
    /**
     * 자식node 추가하기
     * @private
     * @method addChildNodes
     * @param {Array} nodeInfos nodeInfo의 array
     * @param {boolean} refresh 지우고 다시 그림, refresh의 경우는 animation중지.
     * @return {void}
     */
    addChildNodes: function (nodeInfos,refresh) {
        if (nodeInfos && nodeInfos.length > 0) {
            //add unique child, 부모 state 변경해야 한다.
            this.changeStateTo(this.NODE_STATE.HAS_CHILD);
            this.isLeaf = false;
            var ulDom = this.unorderList.htmlToDom(this.unorderList.getUlHtml(null, this.depth, nodeInfos));
            var ulEl = Rui.get(ulDom);
            //animation 효과 주기
            if (!refresh || !this.isExpand()) {
                ulEl.setStyle('display', 'none');
            }
            this.el.parent().appendChild(ulDom);
            var wh = ulEl.getDimensions(); //width,height 가져오기, none된 부분도 구해옮
            this.childULHeight = wh.height;
            if (!refresh || !this.isExpand()) {
                if (this.useAnimation && (this.useAnimation === true || this.useAnimation.expand === true)) {
                    ulEl.setStyle('height', '1px');
                    ulEl.setStyle('display', '');
                    ulEl.setStyle('overflow', 'hidden');
                    //animation효과로 높이 키우기
                    var anim = new Rui.fx.LAnim({
                        el: ulDom,
                        attributes: {
                            height: {
                                from: 1,
                                to: wh.height
                            }
                        }
                    });
                    anim.duration = this.unorderList.animDuration;
                    anim.animate();
                    var thisNode = this;
                    anim.on('complete', function(){
                        ulEl.setStyle('height', 'auto');
                        thisNode.unorderList.fireEvent('expand', {
                            target: thisNode,
                            node: thisNode.unorderList.currentFocus
                        });
                        ulEl.setStyle('overflow', '');
                    });
                } else {
                    ulEl.setStyle('display', '');
                    ulEl.setStyle('overflow', 'hidden');
                    ulEl.setStyle('height', 'auto');
                    this.unorderList.fireEvent('expand', {
                        target: this,
                        node: this.unorderList.currentFocus
                    });
                    ulEl.setStyle('overflow', '');
                }
            }
        }
    },
    /**
     * 하위 노드들을 배열로 리턴한다.
     * @method getChildNodes
     * @return {Array}
     */
    getChildNodes: function() {
        var records = [];
        if (this.unorderList)
            records = this.unorderList.getChildRecords(this.getIdValue(), this.childDataSet);
        return records;
    },

    /**
     * 지정한 node state인지 여부
     * @private
     * @method checkNodeState
     * @param {object} NODE_STATE struct
     * @return {boolean}
     */
    checkNodeState: function (NODE_STATE) {
        switch (NODE_STATE) {
            case this.NODE_STATE.HAS_CHILD:
                return this.el.hasClass(this.unorderList.CLASS_UL_HAS_CHILD_CLOSE_LAST)
                    || this.el.hasClass(this.unorderList.CLASS_UL_HAS_CHILD_CLOSE_MID)
                    || this.el.hasClass(this.unorderList.CLASS_UL_HAS_CHILD_OPEN_LAST)
                    || this.el.hasClass(this.unorderList.CLASS_UL_HAS_CHILD_OPEN_MID);
                break;
            case this.NODE_STATE.HAS_NO_CHILD:
                return this.el.hasClass(this.unorderList.CLASS_UL_HAS_NO_CHILD_MID)
                    || this.el.hasClass(this.unorderList.CLASS_UL_HAS_NO_CHILD_LAST);
                break;
            case this.NODE_STATE.MID:
                return this.el.hasClass(this.unorderList.CLASS_UL_HAS_CHILD_CLOSE_MID)
                    || this.el.hasClass(this.unorderList.CLASS_UL_HAS_CHILD_OPEN_MID)
                    || this.el.hasClass(this.unorderList.CLASS_UL_HAS_NO_CHILD_MID);
                break;
            case this.NODE_STATE.LAST:
                return this.el.hasClass(this.unorderList.CLASS_UL_HAS_CHILD_CLOSE_LAST)
                    || this.el.hasClass(this.unorderList.CLASS_UL_HAS_CHILD_OPEN_LAST)
                    || this.el.hasClass(this.unorderList.CLASS_UL_HAS_NO_CHILD_LAST);
                break;
            case this.NODE_STATE.OPEN:
                return this.el.hasClass(this.unorderList.CLASS_UL_HAS_CHILD_OPEN_MID)
                    || this.el.hasClass(this.unorderList.CLASS_UL_HAS_CHILD_OPEN_LAST);
                break;
            case this.NODE_STATE.CLOSE:
                return this.el.hasClass(this.unorderList.CLASS_UL_HAS_CHILD_CLOSE_LAST)
                    || this.el.hasClass(this.unorderList.CLASS_UL_HAS_CHILD_CLOSE_MID);
                break;
            case this.NODE_STATE.MARK:
                return this.el.hasClass(this.unorderList.CLASS_UL_MARKED_NODE);
                break;
            case this.NODE_STATE.UNMARK:
                return !this.el.hasClass(this.unorderList.CLASS_UL_MARKED_NODE);
                break;
            case this.NODE_STATE.FOCUS:
                return this.el.hasClass(this.unorderList.CLASS_UL_FOCUS_NODE);
                break;
            case this.NODE_STATE.UNFOCUS:
                return !this.el.hasClass(this.unorderList.CLASS_UL_FOCUS_NODE);
                break;
            default:
                return false;
                break;
        }
    },
    /**
     * 지정한 node state로 변경
     * @private
     * @method changeStateTo
     * @param {object} NODE_STATE struct
     * @return {void}
     */
    changeStateTo: function (NODE_STATE) {
        switch (NODE_STATE) {
            case this.NODE_STATE.HAS_CHILD:
                if (this.el.hasClass(this.unorderList.CLASS_UL_HAS_NO_CHILD_MID)) {
                    this.el.replaceClass(this.unorderList.CLASS_UL_HAS_NO_CHILD_MID, this.unorderList.CLASS_UL_HAS_CHILD_OPEN_MID);
                    Rui.get(this.getLi()).addClass(this.unorderList.CLASS_UL_LI_LINE);
                }
                else if (this.el.hasClass(this.unorderList.CLASS_UL_HAS_NO_CHILD_LAST)) this.el.replaceClass(this.unorderList.CLASS_UL_HAS_NO_CHILD_LAST, this.unorderList.CLASS_UL_HAS_CHILD_OPEN_LAST);
                break;
            case this.NODE_STATE.HAS_NO_CHILD:
                if (this.el.hasClass(this.unorderList.CLASS_UL_HAS_CHILD_CLOSE_MID)) this.el.replaceClass(this.unorderList.CLASS_UL_HAS_CHILD_CLOSE_MID, this.unorderList.CLASS_UL_HAS_NO_CHILD_MID);
                else if (this.el.hasClass(this.unorderList.CLASS_UL_HAS_CHILD_CLOSE_LAST)) this.el.replaceClass(this.unorderList.CLASS_UL_HAS_CHILD_CLOSE_LAST, this.unorderList.CLASS_UL_HAS_NO_CHILD_LAST);
                else if (this.el.hasClass(this.unorderList.CLASS_UL_HAS_CHILD_OPEN_MID)) this.el.replaceClass(this.unorderList.CLASS_UL_HAS_CHILD_OPEN_MID, this.unorderList.CLASS_UL_HAS_NO_CHILD_MID);
                else if (this.el.hasClass(this.unorderList.CLASS_UL_HAS_CHILD_OPEN_LAST)) this.el.replaceClass(this.unorderList.CLASS_UL_HAS_CHILD_OPEN_LAST, this.unorderList.CLASS_UL_HAS_NO_CHILD_LAST);
                Rui.get(this.getLi()).removeClass(this.unorderList.CLASS_UL_LI_LINE);
                break;
            case this.NODE_STATE.MID:
                if (this.el.hasClass(this.unorderList.CLASS_UL_HAS_CHILD_CLOSE_LAST)) this.el.replaceClass(this.unorderList.CLASS_UL_HAS_CHILD_CLOSE_LAST, this.unorderList.CLASS_UL_HAS_CHILD_CLOSE_MID);
                else if (this.el.hasClass(this.unorderList.CLASS_UL_HAS_CHILD_OPEN_LAST)) {
                    this.el.replaceClass(this.unorderList.CLASS_UL_HAS_CHILD_OPEN_LAST, this.unorderList.CLASS_UL_HAS_CHILD_OPEN_MID);
                    Rui.get(this.getLi()).addClass(this.unorderList.CLASS_UL_LI_LINE);
                }
                else
                    if (this.el.hasClass(this.unorderList.CLASS_UL_HAS_NO_CHILD_LAST))
                        this.el.replaceClass(this.unorderList.CLASS_UL_HAS_NO_CHILD_LAST, this.unorderList.CLASS_UL_HAS_NO_CHILD_MID);
                break;
            case this.NODE_STATE.LAST:
                if (this.el.hasClass(this.unorderList.CLASS_UL_HAS_CHILD_CLOSE_MID)) this.el.replaceClass(this.unorderList.CLASS_UL_HAS_CHILD_CLOSE_MID, this.unorderList.CLASS_UL_HAS_CHILD_CLOSE_LAST);
                else if (this.el.hasClass(this.unorderList.CLASS_UL_HAS_CHILD_OPEN_MID)) this.el.replaceClass(this.unorderList.CLASS_UL_HAS_CHILD_OPEN_MID, this.unorderList.CLASS_UL_HAS_CHILD_OPEN_LAST);
                else if (this.el.hasClass(this.unorderList.CLASS_UL_HAS_NO_CHILD_MID)) this.el.replaceClass(this.unorderList.CLASS_UL_HAS_NO_CHILD_MID, this.unorderList.CLASS_UL_HAS_NO_CHILD_LAST);
                Rui.get(this.getLi()).removeClass(this.unorderList.CLASS_UL_LI_LINE);
                break;
            case this.NODE_STATE.OPEN:
                if (this.el.hasClass(this.unorderList.CLASS_UL_HAS_CHILD_CLOSE_MID)) {
                    this.el.replaceClass(this.unorderList.CLASS_UL_HAS_CHILD_CLOSE_MID, this.unorderList.CLASS_UL_HAS_CHILD_OPEN_MID);
                    Rui.get(this.getLi()).addClass(this.unorderList.CLASS_UL_LI_LINE);
                }
                else
                    if (this.el.hasClass(this.unorderList.CLASS_UL_HAS_CHILD_CLOSE_LAST))
                        this.el.replaceClass(this.unorderList.CLASS_UL_HAS_CHILD_CLOSE_LAST, this.unorderList.CLASS_UL_HAS_CHILD_OPEN_LAST);
                break;
            case this.NODE_STATE.CLOSE:
                if (this.el.hasClass(this.unorderList.CLASS_UL_HAS_CHILD_OPEN_MID)) this.el.replaceClass(this.unorderList.CLASS_UL_HAS_CHILD_OPEN_MID, this.unorderList.CLASS_UL_HAS_CHILD_CLOSE_MID);
                else if (this.el.hasClass(this.unorderList.CLASS_UL_HAS_CHILD_OPEN_LAST)) this.el.replaceClass(this.unorderList.CLASS_UL_HAS_CHILD_OPEN_LAST, this.unorderList.CLASS_UL_HAS_CHILD_CLOSE_LAST);
                Rui.get(this.getLi()).removeClass(this.unorderList.CLASS_UL_LI_LINE);
                break;
            case this.NODE_STATE.MARK:
                this.el.addClass(this.unorderList.CLASS_UL_MARKED_NODE);
                break;
            case this.NODE_STATE.UNMARK:
                //부모가 checked되어있으면 제거 => 보류, 회색 상태를 만들어야함.  상태 저장이 필요.
                //var pLi = this.getParentLi();
                //if (pLi) Rui.get(pLi.firstChild).removeClass(this.unorderList.CLASS_UL_MARKED_NODE);
                this.el.removeClass(this.unorderList.CLASS_UL_MARKED_NODE);
                break;
            case this.NODE_STATE.FOCUS:
                this.el.addClass(this.unorderList.CLASS_UL_FOCUS_NODE);
                var parent = this.getParentNode();
                if(parent)
                    parent.changeStateTo(this.NODE_STATE.FOCUS_PARENT);
                break;
            case this.NODE_STATE.UNFOCUS:
                this.el.removeClass(this.unorderList.CLASS_UL_FOCUS_NODE);
                var parent = this.getParentNode();
                if(parent)
                    parent.changeStateTo(this.NODE_STATE.UNFOCUS_PARENT);
                break;
            case this.NODE_STATE.FOCUS_PARENT:
                this.el.addClass(this.unorderList.CLASS_UL_FOCUS_PARENT_NODE);
                var parent = this.getParentNode();
                if(parent)
                    parent.changeStateTo(this.NODE_STATE.FOCUS_PARENT);
                break;
            case this.NODE_STATE.UNFOCUS_PARENT:
                this.el.removeClass(this.unorderList.CLASS_UL_FOCUS_PARENT_NODE);
                if(parent)
                    parent.changeStateTo(this.NODE_STATE.UNFOCUS_PARENT);
                break;
            case this.NODE_STATE.FOCUS_TOP:
                var ul = this.getUL();
                for (var i = 0, len = ul.childNodes.length; i < len; i++){
                    if(ul.childNodes[i].firstChild !== this.dom)
                        this.unorderList.getNodeObject(ul.childNodes[i]).el.removeClass(this.unorderList.CLASS_UL_FOCUS_TOP_NODE);
                }
                this.el.addClass(this.unorderList.CLASS_UL_FOCUS_TOP_NODE);
                break;
        }
    }
};
};