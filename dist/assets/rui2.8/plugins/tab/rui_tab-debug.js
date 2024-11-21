/*
 * @(#) rui_tab-debug.js
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
Rui.namespace('Rui.ui.tab');
/**
 * Tab을 생성하고 관리하는 TabView 객체
 * @namespace Rui.ui.tab
 * @class LTabView
 * @extends Rui.ui.LUIComponent
 * @sample default
 * @constructor
 * @plugin /ui/tab/rui_tab.js,/ui/tab/rui_tab.css
 * @param {Object} config
 */
Rui.ui.tab.LTabView = function(config){
    config = config || {};
    config = Rui.applyIf(config, Rui.getConfig().getFirst('$.ext.tabView.defaultProperties'));
    Rui.ui.tab.LTabView.superclass.constructor.call(this,config);
};
Rui.extend(Rui.ui.tab.LTabView, Rui.ui.LUIComponent, {
    /**
     * @description 객체의 문자열
     * @property otype
     * @private
     * @type {String}
     */
    otype: 'Rui.ui.tab.LTabView',
    /**
     * @description 기본 CSS명
     * @property CSS_BASE
     * @private
     * @type {String}
     */
    CSS_BASE: 'L-tabview',
    /**
     * @description The className to add when building from scratch.
     * @property CLASSNAME
     * @private
     * @default 'navset'
     */
    CLASSNAME: 'L-navset',
    /**
     * @description The activated tab information.
     * Purpose: If the tabView page is loaded, Create only a selected tab's component.
     * @property activedTabs
     * @private
     * @type {Array}
     */
    _activatedTabs: null,
    /**
     * @description content Height
     * @property contentHeight
     * @public
     * @type {int}
     */
    contentHeight: null,
    /**
     * @description 현재 active tab
     * @property ACTIVE
     * @private
     * @static
     * @type {String}
     */
    ACTIVE: 'active',
    /**
     * @description 내부적으로 사용하는 탭 넘버링에 대한 일련 값
     * @property tabCnt
     * @private
     * @type {int}
     */
    tabCnt: 1, 
    /**
     * @description active tab
     * @property ACTIVE_TAB
     * @private
     * @static
     * @type {String}
     */
    ACTIVE_TAB: 'activeTab',
    /**
     * @description active index
     * @property ACTIVE_TAB
     * @private
     * @static
     * @type {String}
     */
    ACTIVE_INDEX: 'activeIndex',
    /**
     * @description 각 탭의 항목들을 json형식으로 정의한 배열
     * @config tabs
     * @sample default
     * @type {Array}
     * @default null
     */
    /**
     * @description 각 탭의 항목들을 json형식으로 정의한 배열
     * @property tabs
     * @default null
     */
    tabs: null,
    /**
     * @description tab's parent
     * @property _tabEl
     * @private
     * @type {Object} tab Parent Object
     */
    _tabEl: null,
    /**
     * @description content's parent
     * @property _contentEl
     * @private
     * @type {Object} conent Parent Object
     */
    _contentEl: null,
    /**
     * @description 탭뷰의 탭 위치를 하단으로 변경
     * @config changeTabsPosition
     * @type {boolean}
     * @default false
     */
    changeTabsPosition: false,
    /**
     * @description setAttributeConfigs LTabView specific properties.
     * @method initAttributes
     * @private
     * @param {Object} attr Hash of initial attributes
     */
    initDefaultConfig: function(){
        Rui.ui.tab.LTabView.superclass.initDefaultConfig.call(this);
        /**
         * @description The Tabs belonging to the LTabView instance.
         * @attribute tabs
         * @type Array
         */
        this.cfg.addProperty('tabs', {
            value: [],
            readOnly: true
        });
        /**
         * @description The index of the tab currently active.
         * @attribute activeIndex
         * @type Int
         */
        this.cfg.addProperty(this.ACTIVE_INDEX, {
            handler: this._setActiveIndex,
            value: this.activeIndex,
            validator: Rui.isNumber
        });
        /**
         * @description The tab currently active.
         * @attribute activeTab
         * @type Rui.ui.tab.LTab
         */
        this.cfg.addProperty(this.ACTIVE_TAB, {
            handler: this._setActiveTab,
            value: this.b4ActiveTab,
            validator: this._isValidActiveTab
        });
        /**
         * @description tab content height 설정
         * @attribute contentHeight
         * @type String
         */
        this.cfg.addProperty('contentHeight', {
            handler: this._setContentHeight,
            value: this.contentHeight,
            validator: Rui.isNumber
        });
    },
    /**
     * @description 객체의 이벤트 초기화 메소드
     * @method initEvents
     * @protected
     * @return {void}
     */
    initEvents: function(){
        Rui.ui.tab.LTabView.superclass.initEvents.call(this);
        /**
         * @description 탭이 변경되었을때 발생
         * @event canActiveTabChange
         * @sample default
         * @param {int} activeIndex active된 탭의 index
         * @param {Rui.ui.tab.LTab} activeTab active된 탭 객체
         * @param {Rui.ui.tab.LTab} beforeActiveTab 현재 active된 탭 이전에 active 상태였던 탭 객체
         */
        this.createEvent('canActiveTabChange');
        /**
         * @description 탭이 변경되었을때 발생
         * @event activeTabChange
         * @sample default
         * @param {int} activeIndex active된 탭의 index
         * @param {boolean} isFirst 처음 active 됬는지 여부
         * @param {Rui.ui.tab.LTab} activeTab active된 탭 객체
         * @param {Rui.ui.tab.LTab} beforeActiveTab 현재 active된 탭 이전에 active 상태였던 탭 객체
         */
        this.createEvent('activeTabChange');
        /**
         * @description 탭의 인덱스가 변경되었을때 발생
         * @event activeIndexChange
         * @sample default
         * @param {int} activeIndex active된 탭의 index
         * @param {boolean} isFirst 처음 active 됬는지 여부
         * @param {Rui.ui.tab.LTab} activeTab active된 탭 객체
         * @param {Rui.ui.tab.LTab} beforeActiveTab 현재 active된 탭 이전에 active 상태였던 탭 객체
         */
        this.createEvent('activeIndexChange');
    },
    /**
     * @description element Dom객체 생성
     * @method createContainer
     * @protected
     * @param {HTMLElement|String} container
     * @return {LElement}
     */
    createContainer: function(container){
        var el = Rui.ui.tab.LTabView.superclass.createContainer.call(this, Rui.get(container)),
            children, i = 0, len, parentEl = el.parent();
        if(parentEl == null || Rui.get(container).dom !== parentEl.dom){
            //applyTo가 아닌 renderTo방식의 랜더링을 선택시 선택된 DOM의 하위 DOM들을 생성된 컨테이너 아래로 옮겨야한다.
            //따라서 container에 이미 markup으로 그려져있는 DOM들을 el 아래로 이동한다. 
            children = Rui.get(container).getChildren();
            if((len = children.length) > 0){
                for (i = 0; i < len; i++){
                    el.appendChild(children[i]);
                }
            }
        }
    },
    /**
     * @description disabled 속성에 따른 실제 적용 메소드
     * @method _setDisabled
     * @protected
     * @param {String} type 속성의 이름
     * @param {Array} args 속성의 값 배열
     * @param {Object} obj 적용된 객체
     * @return {void}
     */
    _setDisabled: function(type, args, obj) {
        Rui.ui.tab.LTabView.superclass._setDisabled.call(this, type, args, obj);
        if(args[0] === false) this.el.unmask();
        else this.el.mask();
    },
    /**
     * @description render시 호출되는 메소드
     * @method doRender
     * @protected
     * @param {String|Object} container 부모객체 정보
     * @return {void}
     */
    doRender: function(container){
        Rui.ui.tab.LTabView.superclass.doRender.call(container);
        this.el.addClass(this.CSS_BASE);
        this.el.addClass('L-navset');

        var navArr = {};
        var postFix = '';
        if(this.changeTabsPosition) postFix = '-bottom';
        navArr["L-nav"] = 'L-nav' + postFix;
        navArr["L-content"] = 'L-content' + postFix;

        if(this.changeTabsPosition){
            var ctmpEl = document.createElement('div');
            ctmpEl.id = Rui.useFixedId() ? Rui.id(this.el, this.id + '-content') : Rui.id();
            this._contentEl = Rui.get(ctmpEl);
            this._contentEl.addClass(navArr["L-content"]);
            this.el.appendChild(this._contentEl);
        }

        //navigator scroll elements.
        var tsEl = document.createElement('div');
        tsEl.id = Rui.useFixedId() ? Rui.id(this.el, this.id + '-nav-scroll') : Rui.id();
        this._tabScrollEl = Rui.get(tsEl);
        this._tabScrollEl.addClass('L-nav-scroll');
        this.el.appendChild(this._tabScrollEl);
        
        //navigator elements.
        var tEl = document.createElement('ul');
        tEl.id = Rui.useFixedId() ? Rui.id(this.el, this.id + '-nav') : Rui.id();
        this._tabEl = Rui.get(tEl);
        this._tabEl.addClass(navArr["L-nav"] );
        if(Rui.useAccessibility()) this._tabEl.setAttribute('role', 'tablist');
        this._tabScrollEl.appendChild(this._tabEl);

        //spin left elements.
        var nslEl = document.createElement('div');
        nslEl.id = Rui.useFixedId() ? Rui.id(this.el, this.id + '-nav-spin-left') : Rui.id();
        this._tabLeftSpinerEl = Rui.get(nslEl);
        this._tabLeftSpinerEl.addClass('L-nav-spin-left');
        this._tabLeftSpinerEl.on('click', this.onSpinLeftClick, this, true);
        this._tabScrollEl.appendChild(this._tabLeftSpinerEl);

        //spin elements.
        var nsEl = document.createElement('div');
        nsEl.id = Rui.useFixedId() ? Rui.id(this.el, this.id + '-nav-spin') : Rui.id();
        this._tabSpinEl = Rui.get(nsEl);
        this._tabSpinEl.addClass('L-nav-spin');
        this._tabScrollEl.appendChild(this._tabSpinEl);

        //spin right elements.
        var nsrEl = document.createElement('div');
        nsrEl.id = Rui.useFixedId() ? Rui.id(this.el, this.id + '-nav-spin-right') : Rui.id();
        this._tabRightSpinerEl = Rui.get(nsrEl);
        this._tabRightSpinerEl.addClass('L-nav-spin-right');
        this._tabRightSpinerEl.on('click', this.onSpinRightClick, this, true);
        this._tabScrollEl.appendChild(this._tabRightSpinerEl);
        
        if(!this.changeTabsPosition){
            var ctmpEl = document.createElement('div');
            ctmpEl.id = Rui.useFixedId() ? Rui.id(this.el, this.id + '-content') : Rui.id();
            this._contentEl = Rui.get(ctmpEl);
            this._contentEl.addClass(navArr["L-content"]);
            this.el.appendChild(this._contentEl);
        }

        this._tabSpinEl.appendChild(this._tabEl);

        this._activatedTabs = [];
        if(this.tabs == null)
            this.addTabsByChild(this.el.dom);
        else
            this.addTabs(this.tabs);
        
        this.currentVisibleTabIndex = 0;
    },
    /**
     * @description render후 호출되는 메소드
     * @method afterRender
     * @protected
     * @param {HTMLElement} container 부모 객체
     * @return {void}
     */
    afterRender: function(container){
        Rui.ui.tab.LTabView.superclass.afterRender.call(this,container);
        this.set('tabs', this.tabs);
        /*
        //active된 탭이 하나도 없을 경우 0번째 탭을 선택함.
        var activeIndex = this.getActiveIndex();
        if(activeIndex === undefined && this.tabs && this.tabs.length){
            //this.set(this.ACTIVE_TAB, this.tabs[0]);
            this.set(this.ACTIVE_INDEX, 0);
        }
        */
        if(!this.reMon && this.width == null){
            this.reMon = new Rui.util.LResizeMonitor();
            this.reMon.monitor(this.el.dom);
            // 처음 랜더링시 ie일 경우 초기 스크롤이 생성되면 이벤트 발생하지 않음.
            this.reMon.on('contentResized',this.onContentResized, this, true);
        }
        //최종 load후 한번더 셋팅.  안맞는 부분이 있는듯.
        // window의 scroller가 생겨도 ie에서는 window resize 이벤트가 발생하지 않아 아래의 코딩이 필요함.
        if(Rui.browser.msie){
            if(this.width == null)
                Rui.later(1000, this, this.onContentResized);
        }
    },
    /**
     * @description 탭뷰의 크기가 변경되는등의 이유로 탭뷰를 갱신한다.
     * @method updateTabs
     * @private
     * @return {void}
     */
    updateTabs: function(){
        if(this.el.getWidth() > 0 && this._tabEl.getWidth() > this.el.getWidth()){
        	//this.el.getWidth() > 0 조건은 chrome의 일부버전에서 this._tabEl.getWidth()가 0보다 크나 this.el.getWidth()가 0인 경우가 발생됨에 따른 방어 조건
            this._useScroll = true;
            if(this._tabLeftSpinerEl){
                this._tabLeftSpinerEl.addClass('enable');
                this._tabSpinEl.addClass('enable');
                this._tabRightSpinerEl.addClass('enable');
            }
        }else{
            this._useScroll = false;
            if(this._tabLeftSpinerEl){
                this._tabLeftSpinerEl.removeClass('enable');
                this._tabSpinEl.removeClass('enable');
                this._tabRightSpinerEl.removeClass('enable');
            }
        }
    },
    /**
     * @description 탭 스크롤 좌측버튼을 클릭시의 이벤트 핸들러
     * @private
     * @method onSpinLeftClick
     * @return {void}
     */
    onSpinLeftClick: function(e){
        var tabs = this.tabs,
            len = tabs.length, i,
            before = this._tabEl.dom.offsetLeft,
            left, selected;
        if(before < 0){
            for (i = 0; i < len; i++){
                left = tabs[i].el.offsetLeft;
                if(left < (before * -1)){
                    selected = i;
                }else
                    break;
            }
            if(selected != undefined)
                this.moveTo(selected, true);
        }
    },
    /**
     * @description 탭 스크롤 우측버튼을 클릭시의 이벤트 핸들러
     * @private
     * @method onSpinRightClick
     * @return {void}
     */
    onSpinRightClick: function(e){
        var tabs = this.tabs,
            len = tabs.length, i,
            before = this._tabEl.dom.offsetLeft,
            area = this._tabSpinEl.getWidth(),
            right, selected;
        for (i = 0; i < len; i++){
            right = tabs[i].el.offsetLeft + tabs[i].el.offsetWidth;
            if(right <= area - before){
                selected = i;
            }else
                break;
        }
        if(selected != undefined){
            selected++;
            selected = selected < len-1 ? selected : len-1;
            this.moveTo(selected, true);
        }
    },
    /**
     * @description width가 지정되지 않은 탭뷰가 사용된 브라우저 width가 변경되어 브라우저 resize가 발생될 경우 실행되는 메소드
     * @private
     * @method onContentResized
     * @return {void}
     */
    onContentResized: function(e){
        this.updateTabs();
        this.moveTo(this.getActiveIndex(),false);
    },
    /**
     * @description change active tab index
     * @method _setActiveIndex
     * @private
     * @param {String} key value가 반환될 attribute.
     */
    _setActiveIndex: function(type, args, obj){
        var index = args[0],
            b4ActiveTab = this.b4ActiveTab,
            activeTab = this.getTab(index),
            isFirst;
        
        if(!activeTab) return;
        
        var r = this.fireEvent('canActiveTabChange', {target: this, activeIndex: index, activeTab: activeTab, beforeActiveTab: b4ActiveTab });
        if(r == false) return;
        
        isFirst = this._addTabStatus(index);

        if(b4ActiveTab) b4ActiveTab.set(this.ACTIVE, false);
        if(activeTab) activeTab.set(this.ACTIVE, true);

        if(activeTab && b4ActiveTab !== activeTab){ // no transition if only 1
            this.contentTransition(activeTab);
        }else if(activeTab){
            activeTab.set('contentVisible', true);
        }
        
        this.moveTo(index, true);
            
        this.fireEvent('activeTabChange', {target: this, activeIndex: index, isFirst: isFirst, activeTab: activeTab, beforeActiveTab: b4ActiveTab, newValue: activeTab, prevValue: b4ActiveTab  });
        this.fireEvent('activeIndexChange', {target: this, activeIndex: index, isFirst: isFirst, activeTab: activeTab, beforeActiveTab: b4ActiveTab });
        
        this.b4ActiveTab = activeTab;
    },
    /**
     * @description The tab currently active.
     * @method _setActiveTab
     * @private
     * @param {String} type 속성의 이름
     * @param {Array} args 속성의 값 배열
     * @param {Object} obj 적용된 객체
     * @return {Boolean}
     */
    _setActiveTab: function(type, args, obj){
        this.set(this.ACTIVE_INDEX, this.getTabIndex(args[0]));
    },
    /**
     * @description Add the actived tab index and the flag of component instance's state.
     *    [{'tabIndex': index, 'isActive': true or false}]
     * @method _addTabStatus
     * @private
     * @param {String} actived index key
     * @param {Boolean} actived(true or false)
     * @return {Boolean} If it is the first actived index, return true else false.
     */
    _addTabStatus: function(idx){
        var obj = this._activatedTabs;
        if(!obj) return false;
        for (var i=0, len = obj.length; i< len; i++){
            if(typeof obj[i] !== 'undefined' && typeof obj[i].tabIndex !== 'undefined' && obj[i].tabIndex == idx){
                obj[i].isActived = true;
                return false;
            }
        }
        obj.push({tabIndex: idx, isActived: true});
        return true;
    },
    /**
     * @description Remove the object of _activatedTabs with tab index
     * @method _removeTabStatus
     * @private
     * @param {Int} tab index
     */
    _removeTabStatus: function(idx){
        var obj = this._activatedTabs;
        for (prop in obj){
            if(obj.hasOwnProperty(prop)){
                if(obj[prop].tabIndex === idx){
                    delete obj[prop];
                    return;
                }
            }
        }
    },
    /**
     * @description setHeight 속성에 따른 실제 적용 메소드
     * @method _setHeight
     * @private
     * @param {String} type 속성의 이름
     * @param {Array} args 속성의 값 배열
     * @param {Object} obj 적용된 객체
     * @return {void}
     */
    _setHeight: function(type, args, obj){
        this.el.setHeight(args[0]);
        var tabHeight = this._tabEl.getHeight();
        this._contentEl.setHeight(args[0] - tabHeight);
    },
    /**
     * @description set content's height
     * @method _setContentHeight
     * @private
     * @param {String} type 속성의 이름
     * @param {Array} args 속성의 값 배열
     * @param {Object} obj 적용된 객체
     * @return {void}
     */
    _setContentHeight: function(type, args, obj){
        var contentHeight = args[0];
        if(!this.contentHeight){
            this.contentHeight = contentHeight;
            var tabHeight = this._tabEl.getHeight();
            if(contentHeight < (tabHeight || 1)) return;
            this.setHeight(contentHeight + tabHeight);
        }else{
            this._contentEl.setHeight(contentHeight);
        }
    },
    /**
     * @description id에 자식이 있을 경우 tab으로 만들기
     * @method addTabsByChild
     * @private
     * @param {HTMLElement}
     * @return {void}
     */
    addTabsByChild: function(dom){
        if(!this._childAdded){ //한번만 실행하기 위한 조건.
            var _active = true,
                nodes = dom.childNodes;
            if(nodes.length > 0){
                //text node 문제와 IE의 경우 tab으로 만들어 지는 순간 childNodes에서 빠져버려서 counting이 잘못된다.
                var childs = [],
                    node, i;
                for (i = 0, len = nodes.length; i < len; i++){
                    node = nodes[i];
                    if(!node.tagName) continue;
                    if(node.tagName.toLowerCase() == 'div' && (!node.className || node.className.indexOf('L-') < 0))
                        childs.push(node);
                }
                for (i = 0, len = childs.length; i < len; i++){
                    var _label = childs[i].title;
                    this.addTab(new Rui.ui.tab.LTab({
                        label: _label,
                        contentEl: childs[i],
                        active: _active,
                        tabView : this
                    }));
                    _active = false;
                }
                this.tabs = this.get('tabs');
            }
        }
        this._childAdded = true;
    },
    /**
     * @description LTab을 삭제한다.
     * @method removeTab
     * @protected
     * @sample default
     * @param {Rui.ui.tab.LTab} tab 삭제할 LTab 객체
     * @return {void}
     */
    removeTab: function(tab){
        if(!tab || typeof tab.el === 'undefined') return;

        var tabs = this.get('tabs'),
            index = this.getTabIndex(tab),
            b4ActiveIndex = this.get(this.ACTIVE_INDEX);
        
        tabs.splice(index, 1);

        this._tabEl.removeChild(tab.el);
        this._contentEl.removeChild(tab.get(tab.CONTENT_EL));
        
        if(this._rendered == true)
            this.updateTabs();

        if(tabs.length < 1){
            this.set(this.ACTIVE_INDEX, -1);
        }else{
            if(index === b4ActiveIndex){
                this.set(this.ACTIVE_INDEX, index > 0 ? index - 1 : 0);
            }
        }
        if(b4ActiveIndex != undefined){
            this.moveTo(this.get(this.ACTIVE_INDEX), true);
        }
        
        tab.fireEvent('remove', { type: 'remove', tabview: this }, this, true);
    },
    /**
     * @description The transiton to use when switching between tabs.
     * @method contentTransition
     * @private
     * @param {Rui.ui.tab.LTab} tab tab 객체
     */
    contentTransition: function(newTab){
        var tabs = this.get('tabs');
        for (var i=0,len = tabs.length; i<len; i++){
            if(newTab === tabs[i])
                newTab.set('contentVisible', true);
            else{
                if(tabs[i].set)
                    tabs[i].set('contentVisible', false);
            }
        }
    },
    /**
     * @description Get tab's status whether tab is activated with css style.
     * @method _isValidActiveTab
     * @private
     * @param {Rui.ui.tab.LTab} tab tab 객체
     * @return {Boolean}
     */
    _isValidActiveTab: function(tab){
        if(typeof tab === 'undefined' || tab == null)
            return false;
        var ret = true;
        if(tab && tab.get('disabled')){ // cannot activate if disabled
            ret = false;
        }
        return ret;
    },
    /**
     * @description 속성값을 설정한다.
     * @method set
     * @protected
     * @param {String} key 속성의 이름
     * @param {Any} value 속성에 적용할 값
     * @param {boolean} silent change event들에 대한 억제 여부
     * @return {boolean} 값이 설정되었는지에 대한 여부
     */
    set: function(key, value, silent){
        return this.cfg.setProperty(key, value, silent);
    },
    /**
     * @description 속성의 현재 설정되어 있는 값을 반환한다.
     * @method get
     * @protected
     * @param {String} key value가 반환될 속성명.
     * @return {Any} 속성의 현재 설정되어 있는 값.
     */
    get: function(key){
        return this.cfg.getProperty(key);
    },
    /**
     * @description contentHeight의 높이를 변경한다.
     * @method setContentHeight
     * @protected
     * @param {int} height contentHeight 높이 값
     */
    setContentHeight: function(height){
        this.set('contentHeight', height);
    },
    /**
     * @description index에 대한 tab 객체를 리턴한다.
     * @method getTab
     * @protected
     * @sample default
     * @param {Integer} index tab index
     * @return {Rui.ui.tab.LTab}
     */
    getTab: function(index){
        return this.get('tabs')[index];
    },
    /**
     * @description tab의 index를 리턴한다.
     * @method getTabIndex
     * @protected
     * @sample default
     * @param {Rui.ui.tab.LTab} tab tab 객체
     * @return {int}
     */
    getTabIndex: function(tab){
        var index = null,
        tabs = this.get('tabs');
        for (var i = 0, len = tabs.length; i < len; ++i){
            if(tab == tabs[i]){
                index = i;
                break;
            }
        }
        return index;
    },
    /**
     * @description tab의 갯수를 리턴한다.
     * @method getTabCount
     * @public
     * @return {int}
     */
    getTabCount: function(){
        return this.get('tabs').length;
    },
    /**
     * @description 활성화할 tab을 선택한다.
     * @method selectTab
     * @public
     * @sample default
     * @param {int} index 선택할 탭 index
     * @return {void}
     */
    selectTab: function(index){
        this.set(this.ACTIVE_INDEX, index);
    },
    /**
     * @description config를 통해 들어온 tabs 배열로 tab들을 추가한다.
     * @method addTabs
     * @public
     * @sample default
     * @param {Array} tabs[]
     * @return {void}
     */
    addTabs: function(tabs){
        if(tabs && tabs.length > 0){
            var len = tabs.length;
            this.tabs = [];
            this.set('tabs', this.tabs);
            for (var i = 0;  i < len; i++){
                tabs[i].tabView = this;
                if(tabs[i] instanceof Rui.ui.tab.LTab){
                    this.addTab(tabs[i]);
                }else
                    this.addTab(new Rui.ui.tab.LTab(tabs[i]));
            }
            this.tabs = this.get('tabs');
        }
    },
    /**
     * @description LTabView에 LTab을 추가하는 메소드
     * @method addTab
     * @public
     * @sample default
     * @param {Rui.ui.tab.LTab} tab LTab 객체
     * @param {Integer} index [optional] 추가할 index
     * @return {void}
     */
    addTab: function(tab, index){
        if(!this._tabEl){
            if(!this.tabs) this.tabs = [];
            this.tabs.push(tab);
            return;
        }
        var tabs = this.get('tabs'),
            before = index != undefined ? tabs[index] : null,
            tabParent = this._tabEl.dom,
            tabElement = tab.el,
            contentParent = this._contentEl.dom,
            contentEl = tab.get(tab.CONTENT_EL),
            b4Index;

        index = index != undefined ? index : tabs.length;

        Rui.get(contentEl).addClass(tab.CONTENT_CLASSNAME);
        if(before){
            tabParent.insertBefore(tabElement, before.el);
            tabs.splice(index, 0, tab);
            b4Index = index+1;
        }else{
            tabParent.appendChild(tabElement);
            tabs.push(tab);
        }
        if(contentParent && contentEl && !Rui.util.LDom.isAncestor(contentParent, contentEl)){
            contentParent.appendChild(contentEl);
        }

        if(!tab.get(this.ACTIVE)){
            tab.set('contentVisible', false, false);
            if(b4Index != undefined) this.set(this.ACTIVE_INDEX, b4Index);
            if(this._rendered = true) this.updateTabs();
            if(b4Index != undefined)
                this.moveTo(b4Index, true);
            
        }else{
            for (var i=0, len = tabs.length; i < len; i++){
                if(tabs[i].set && i !== index)
                    tabs[i].set('active', false);
            }
            this.set(this.ACTIVE_INDEX, index);
            
            if(this._rendered = true) this.updateTabs();
            this.moveTo(index, true);
        }
        tab.tabView = this;

        if(tab.el)
            Rui.get(tab.el).addListener(tab.get('activationEvent'), tab.onActivate, tab, true);
        
        if(Rui.useAccessibility()){
            contentEl.setAttribute('role', 'tabpanel');
            contentEl.setAttribute('aria-labelledby', tab.el.id);
            tab.el.setAttribute('aria-controls', contentEl.id);
        }
    },
    /**
     * @description render후 호출되는 메소드
     * @method moveTo
     * @public
     * @param {int} index 스크롤을 이동할 탭의 인덱스
     * @param {boolean} useAmim [optional] 탭 스크롤시 animation 사용여부 
     * @return {void}
     */
    moveTo: function(index, useAnim){
        if(!this.tabs || this.tabs.length == 0) return;
        var tab = this.tabs[index],
            before = this._tabEl.dom.offsetLeft - this._tabEl.getMargins('l'),
            area = this._tabSpinEl.getWidth(),
            left = tab.el.offsetLeft,
            width = tab.el.offsetWidth,
            right = left + width,
            offset = this._tabEl.getWidth() - area,
            after = 0;
        if(this._useScroll === true){
            if(right + before >= area){ //선택된 index가 영역 우측에 있을 경우
                after = -right + area;
            }else if(left <= -before){ //선택된 index가 영역 좌측에 있을 경우
                after = -left;
            }else if(left > -before){ //선택된 index가 영역 중간에 있을 경우
                after = before;
                if(area - before > this._tabEl.getWidth()){
                    after += area - before - this._tabEl.getWidth();
                }
            }
        }else{
            after = 0;
        }
        if(before == after) return;
        
        if(useAnim === true && !Rui.platform.isMobile){
            new Rui.fx.LAnim({
                el: this._tabEl.dom,
                attributes: {
                    left: {from: before, to: after}
                },
                duration: 0.3
            }).animate();
        }else{
            this._tabEl.setLeft(after);
        }
    },
    /**
     * @description index에 해당되는 LTab을 삭제한다.
     * @method removeAt
     * @public
     * @sample default
     * @param {int} inx 삭제할 tab index
     * @return {void}
     */
    removeAt: function(inx){
        this._removeTabStatus(inx);
        this.removeTab(this.getTab(inx));
    },
    /**
     * @description 현재 선택된 Tab의 index
     * @method getActiveIndex
     * @public
     * @return {int}
     */
    getActiveIndex: function(){
        return this.get(this.ACTIVE_INDEX);
    },
    /**
     * @description 현재 선택된 Tab을 리턴한다.
     * @method getActiveTab
     * @public
     * @return {Rui.ui.tab.LTab}
     */
    getActiveTab: function(){
        return this.getTab(this.get(this.ACTIVE_INDEX));
    },
    /**
     * @description DOM에서 패널 엘리먼트를 제거하고 모든 자식 엘리먼트들을 null로 설정한다.
     * @public
     * @method destroy
     */
    destroy: function (){
        this._activatedTabs = null;

        if(this._tabLeftSpinerEl){
            this._tabLeftSpinerEl.unOnAll();
            this._tabLeftSpinerEl.remove();
            delete this._tabLeftSpinerEl;
        }
        if(this._tabSpinEl){
            this._tabSpinEl.remove();
            delete this._tabSpinEl;
        }
        if(this._tabRightSpinerEl){
            this._tabRightSpinerEl.unOnAll();
            this._tabRightSpinerEl.remove();
            delete this._tabRightSpinerEl;
        }
        if(this._tabScrollEl){
            this._tabScrollEl.remove();
            delete this._tabScrollEl;
        }
        if(this._tabEl){
            this._tabEl.remove();
            delete this._tabEl;
        }
        if(this._contentEl){
            this._contentEl.remove();
            delete this._contentEl;
        }
        
        Rui.ui.tab.LTabView.superclass.destroy.call(this);
    },
    /**
     * @description 객체 정보
     * @method toString
     * @return {String}
     */
    toString: function(){
        return 'Rui.ui.tab.LTabView ' + this.id;
    }
});
(function() {
var Dom = Rui.util.LDom; 
/**
 * @description  TabView에 의해 생성되어 관리되는 Tab 객체
 * 탭의 label을 표시하며 컨텐츠를 표시한다.
 * @class LTab
 * @extends Rui.util.LEventProvider
 * @constructor
 * @plugin /ui/tab/rui_tab.js,/ui/tab/rui_tab.css
 * @param {Object} config The intial LUIComponent.
 */
Rui.ui.tab.LTab = function(config) {
    config = config || {};

    //추가, id를 넣으면 contentEl로 변환
    if (config.id) {
        var contentEl = Rui.get(config.id);
        if(contentEl && contentEl.dom){
            config.contentEl = contentEl.dom;
        }
    }
    //el이 입력되지 않았으면 attr로 el을 만든다.
    if (!config.element) {
        this.el = this.createElement(config);
    } 
    Rui.applyObject(this, config, true);
    Rui.ui.tab.LTab.superclass.constructor.call(this, config);
    this.init(config); 
};
Rui.extend(Rui.ui.tab.LTab, Rui.util.LEventProvider, {
    /**
     * @description 객체의 문자열
     * @property otype
     * @private
     * @type {String}
     */
    otype: 'Rui.ui.tab.LTab', 
    /**
     * @description The tab's label text or innerHTML
     * @property label
     * @public 
     * @type {String || HtmlElement}
     */
    label: null, 
    /**
     * @description label
     * @type String
     * @private
     * @static 
     * @default 'label'
     */
    LABEL: 'label',
    /**
     * @description label을 포함하는 element
     * @type String
     * @private
     * @static 
     * @default 'labelEl'
     */
    LABEL_EL: 'labelEl',
    /**
     * @description The tab's content. CONTENT_EL의 innerHTML에 할달될 내용
     * @config CONTENT
     * @sample default
     * @type String
     * @default 'content'
     */
    /**
     * @description content
     * @property CONTENT
     * @type String
     * @private
     * @static 
     * @default 'content'
     */
    CONTENT: 'content',
    /**
     * @description contentEl
     * @property CONTENT_EL
     * @type String
     * @private
     * @static 
     * @default 'contentEl'
     */
    CONTENT_EL: 'contentEl',
    /**
     * @description The tab's label text or innerHTML
     * @property contentEl
     * @public 
     * @type {string || HtmlElement }
     */
    contentEl: null, 
    /**
     * @description disabled tab class
     * @property DISABLED
     * @type String
     * @private
     * @default 'disabled'
     */
    DISABLED: 'disabled',
    /**
     * @description LTab 내부 element의 기본 tag name으로 em (Emphasized text)
     * @property LABEL_TAGNAME
     * @type String
     * @private
     * @default 'em'
     */
    LABEL_TAGNAME: 'em',
    /**
     * @description active tab에 설정될 class name
     * @property ACTIVE_CLASSNAME
     * @type String
     * @private
     * @default 'L-nav-selected'
     */
    ACTIVE_CLASSNAME: 'L-nav-selected',
    /**
     * @description content에 해당곳에 class 설정
     * @property CONTENT_CLASSNAME
     * @type String
     * @private
     * @default 'L-content-tab'
     */
    CONTENT_CLASSNAME: 'L-content-tab', 
    /**
     * @description The class name applied to hidden tabs.
     * @property HIDDEN_CLASSNAME
     * @type String
     * @private
     * @default 'L-nav-hidden'
     */
    HIDDEN_CLASSNAME: 'L-nav-hidden',
    /**
     * @description The title applied to active tabs.
     * @property ACTIVE_TITLE
     * @type String
     * @private
     * @default 'active'
     */
    ACTIVE_TITLE: 'active',
    /**
     * @description The class name applied to disabled tabs.
     * @property DISABLED_CLASSNAME
     * @type String
     * @private
     * @default 'disabled'
     */
    DISABLED_CLASSNAME: 'disabled',
    /**
     * @description 객체를 초기화하는 메소드
     * @method protected
     * @private
     * @param {Object} config 환경정보 객체 
     * @return {void}
     */
    init: function(config) {
        this.initDefaultConfig();
        if (config) {
            this.cfg.applyConfig(config, true);
        }

    	this.cfg.setProperty('disabled', Rui.isUndefined(config.disabled) ? false : config.disabled);
        this.cfg.setProperty('activationEvent', this.activationEvent || 'click');
        this.cfg.setProperty(this.LABEL, this.label);

        if(typeof this[this.CONTENT] !== 'undefined')
            this.cfg.setProperty(this.CONTENT_EL, document.createElement('div'));
        if(!Rui.isUndefined(this.tabView) && this.tabView.changeTabsPosition){
            this.ACTIVE_CLASSNAME = 'L-nav-bottom-selected';
        }
        this.cfg.setProperty(this.CONTENT, this.content);
        this.cfg.setProperty('active', this.active || this.hasClass(this.ACTIVE_CLASSNAME));
        this.cfg.setProperty('contentVisible', this.active || this.contentVisible);
    },
    /**
     * @description 객체를 Config정보를 초기화하는 메소드
     * @method initDefaultConfig
     * @protected 
     * @return {void}
     */
    initDefaultConfig: function(){
        this.cfg = new Rui.ui.LConfig(this);

        this.cfg.addProperty('activationEvent', {
            value: this.activationEvent || 'click'
        });

        /**
         * @description The tab's label text (or innerHTML).  없으면 labelEl 생성해서 설정
         * @attribute label
         * @type String
         */
        this.cfg.addProperty(this.LABEL, {
            handler: this._setLabel, 
            value:  this.label || this._getLabel()
        });
        /**
         * @description label을 포함하는 element를 설정.  같으면 설정하지 않고, 같지 않으면 입력한 element로 교체한다.
         * @attribute labelEl
         * @type HTMLElement
         */
        this.cfg.addProperty(this.LABEL_EL, {
            handler: this._setLabelEl, 
            value:  this[this.LABEL_EL] || this._getLabelEl()
        });
        /**
         * @description The tab's content. CONTENT_EL의 innerHTML에 할달될 내용
         * @attribute content
         * @type String
         */
        this.cfg.addProperty(this.CONTENT_EL, {
            handler: this._setContentEl, 
            value: this.get(this.CONTENT_EL) || this[this.CONTENT_EL] || document.createElement('div')
        });
        /**
         * @description The tab's content. CONTENT_EL의 innerHTML에 할달될 내용
         * @attribute content
         * @type String
         */
        this.cfg.addProperty(this.CONTENT, {
            handler: this._setContent, 
            value: this[this.CONTENT]
        }, false);
        /**
         * @description 현재 tab이 active이지 여부 
         * Whether or not the tab is currently active.
         * If a dataSrc is set for the tab, the content will be loaded from
         * the given source.
         * @attribute active
         * @type Boolean
         */
        this.cfg.addProperty(this.ACTIVE_TITLE, {
            handler: this._setActiveTitle,
            value: this.active || this.hasClass(this.ACTIVE_CLASSNAME), 
            validator: Rui.isBoolean
        });
        /**
         * @description Whether or not the tab is disabled.
         * @attribute disabled
         * @type Boolean
         */
        this.cfg.addProperty(this.DISABLED, {
            handler: this._setDisabled, 
            value: this.disabled || this.hasClass(this.DISABLED_CLASSNAME), 
            validator: Rui.isBoolean
        }); 
        /**
         * @description The Whether or not the tab's content is visible.
         * @attribute contentVisible
         * @type Boolean
         * @default false
         */
        this.cfg.addProperty('contentVisible', {
            handler: this._setContentVisible,
            value: this.contentVisible,
            validator: Rui.isBoolean
        });
    },
    /**
     * @description 컨테이너 객체를 리턴하는 메소드
     * @method getContainer
     * @sample default
     * @return {Rui.LElement} 
     */
    getContainer: function(){
        return this.el;
    },
    /**
     * @description element Dom객체 생성
     * @method _createTabElement
     * @protected
     * @param {config} option
     * @return {HTMLElement}
     */
    createElement: function(config) {
        var el = document.createElement('li'),
        a = document.createElement('a'),
        label = config.label || null,
        labelDom = config.labelEl || null;

        el.id = Rui.useFixedId() && !Rui.isUndefined(config.tabView) ? Rui.id(this.el, config.tabView.id + '-LTab-' + (config.tabView.tabCnt++)) : Rui.id();

        a.href = config.href || '#'; // TODO: Use Dom.setAttribute?
        
        if(Rui.useAccessibility()){
            el.setAttribute('role', 'tab');
       }

        el.appendChild(a);

        if (labelDom) { // user supplied labelEl
            if (!label) { // user supplied label
                label = this._getLabel();
            }
        } else {
            labelDom = this._createLabelEl();
        }

        a.appendChild(labelDom);
        return el;
    },
    /**
     * @description Dom에 css를 추가한다.
     * @method addClass
     * @sample default
     * @param {String} className 추가할 className
     * @return {Rui.LElement} this
     */
    addClass: function(className) {
        Dom.addClass(this.el, className);
        return this;
    },
    /**
     * @description Dom에 css가 존재하는지 여부를 리턴한다.
     * @method hasClass
     * @sample default
     * @param {String} className The className to add
     * @return {boolean} element가 class name을 가지고 있는지에 대한 여부
     */
    hasClass: function(className) {
        return Dom.hasClass(this.el, className);
    },
    /**
     * @description Dom에 적용된 css를 삭제한다.
     * @method removeClass
     * @sample default
     * @param {String|Array} className 삭제할 className
     * @return {Rui.LElement} this
     */
    removeClass: function(className) {
        var cnList = Rui.isArray(className) ? className : [className];
        Rui.util.LArray.each(cnList, function(cn) {
            Dom.removeClass(this.el, cn);
        }, this);
        return this;
    },
    /**
     * @description The Whether or not the tab's content is visible.
     * @attribute contentVisible
     * @private
     * @param {String} type 속성의 이름
     * @param {Array} args 속성의 값 배열
     * @param {Object} obj 적용된 객체
     * @default false
     */
    _setContentVisible: function(type, args, obj){
        if (args[0]) {
            Dom.removeClass(this.get(this.CONTENT_EL), this.HIDDEN_CLASSNAME);
            if(Rui.useAccessibility())
                this.get(this.CONTENT_EL).setAttribute('aria-hidden', 'false');
            if(Rui.browser.msies){
                setTimeout(function(){
                    contentDom.style.paddingRight = '0px';
                }, 10);
            }
        } else {
            Dom.addClass(this.get(this.CONTENT_EL), this.HIDDEN_CLASSNAME);
            if(Rui.useAccessibility())
                this.get(this.CONTENT_EL).setAttribute('aria-hidden', 'true');
            if(Rui.browser.msies){
                contentDom.style.paddingRight = '1px';
            }
        }
    },
    /**
     * @description Whether or not the tab is disabled.
     * @method disabled
     * @private
     * @param {String} type 속성의 이름
     * @param {Array} args 속성의 값 배열
     * @param {Object} obj 적용된 객체
     * @return {void}
     */
    _setDisabled: function(type, args, obj){
        if (args[0] === true) {
            Dom.addClass(this.el, this.DISABLED_CLASSNAME);
        } else {
            Dom.removeClass(this.el, this.DISABLED_CLASSNAME);
        }
    },
    /**
     * @description 현재 tab이 active이지 여부 
     * Whether or not the tab is currently active.
     * If a dataSrc is set for the tab, the content will be loaded from
     * the given source.
     * @method  _setActiveTitle
     * @private
     * @param {String} type 속성의 이름
     * @param {Array} args 속성의 값 배열
     * @param {Object} obj 적용된 객체
     * @return {void}
     */
    _setActiveTitle: function(type, args, obj){
        if (args[0] === true) {
            this.addClass(this.ACTIVE_CLASSNAME);
            this.set('title', this.ACTIVE_TITLE);

            if(Rui.useAccessibility())
                this.el.setAttribute('aria-selected', 'true');

        } else {
            this.removeClass(this.ACTIVE_CLASSNAME); 
            this.set('title', '');

            if(Rui.useAccessibility())
                this.el.setAttribute('aria-selected', 'false');
        }
    },
    /**
     * @description The HTMLElement that contains the tab's content. 없으면 div 생성.
     * @private
     * @Method _setContent
     * @param {String} type 속성의 이름
     * @param {Array} args 속성의 값 배열
     * @param {Object} obj 적용된 객체
     * @return {void}
     */
    _setContent: function(type, args, obj){
        var value = args[0],
        div =  document.createElement('div');
        Rui.util.LDom.appendHtml(div, value); 
    }, 
    /**
     * @description The tab's content. CONTENT_EL의 innerHTML에 할달될 내용
     * @private
     * @Method _setContentEl
     * @param {String} type 속성의 이름
     * @param {Array} args 속성의 값 배열
     * @param {Object} obj 적용된 객체
     * @return {void}
     */
    _setContentEl: function(type, args, obj){
        var value = args[0]; 
        var current = this.get(this.CONTENT); 
        if (current) {
            if (current === value) {
                return false; // already set
            }

            if (!this.get('selected')) {   
                Dom.addClass(value, this.HIDDEN_CLASSNAME);
            }

            //  current.parentNode.replaceChild(value, current);
            Rui.get(value).html(current); 
            this.set(this.CONTENT, value.innerHTML);
        }
    }, 
    /**
     * @description The tab's label text (or innerHTML).  없으면 labelEl 생성해서 설정
     * @private
     * @Method _setLabel
     * @param {String} type 속성의 이름
     * @param {Array} args 속성의 값 배열
     * @param {Object} obj 적용된 객체
     * @return {void}
     */
    _setLabel: function(type, args, obj){
        var labelDom = this.get(this.LABEL_EL);
        if (!labelDom) { // create if needed
            labelDom = this._createLabelEl();
            this.set(this.LABEL_EL, labelDom);
        }
        Rui.get(labelDom).html(args[0]); 
    }, 
    /**
     * @description label을 포함하는 element를 설정.  같으면 설정하지 않고, 같지 않으면 입력한 element로 교체한다.
     * @private
     * @Method _setContentEl
     * @param {String} type 속성의 이름
     * @param {Array} args 속성의 값 배열
     * @param {Object} obj 적용된 객체
     * @return {void}
     */
    _setLabelEl: function(type, args, obj){
        var value  = Dom.get(args[0]);
        var current = this.get(this.LABEL_EL);
        if (current) {
            if (current == value) {
                return false; // already set
            }
            current.parentNode.replaceChild(value, current);
            this.set(this.LABEL, value.innerHTML);
        }
    }, 
    /**
     * @description attribute의 현재 value를 반환한다.
     * @method get
     * @private 
     * @param {String} key value가 반환될 attribute.
     * @return {Any} attribute의 현재 value.
     */
    get: function(key) {
        return this.cfg.getProperty(key); 
    },
    /**
     * @description config의 값을 설정한다.
     * @method set
     * @private 
     * @param {String} key attribute의 이름
     * @param {Any} value attribute에 적용할 값
     * @param {boolean} silent change event들에 대한 억제 여부
     * @return {boolean} 값이 설정되었는지에 대한 여부
     */
    set: function(key, value, silent) {
        return this.cfg.setProperty(key, value, silent); 
    },
    /**
     * @description label읖 포함하는 element설정 
     * @method _getLabelEl
     * @private 
     * @return {HtmlElement} HtmlElement반환 
     */
    _getLabelEl: function() {
        return this.el.getElementsByTagName(this.LABEL_TAGNAME)[0];
    },
    /**
     * @description label읖 포함하는 element생성 
     * @method _createLabelEl
     * @private 
     * @return {HtmlElement} HtmlElement반환 
     */
    _createLabelEl: function() {
        return document.createElement(this.LABEL_TAGNAME);
    },
    /**
     * @description label Element에 있는 label을 반환 
     * @method _getLabel
     * @private 
     * @return {String} label반환 
     */
    _getLabel: function() {
        var el = this.get(this.LABEL_EL); 
        if (!el) {
            return;
        }
        return el.innerHTML;
    },
    /**
     * @description Set the current activated tab
     * @method onActivate
     * @protected
     * @return {Object} tab's event object 
     */
    onActivate: function(e) {
    	if(this.cfg.getProperty(this.DISABLED) === true) return;
        var tab = this,
            silent = false,
            index = this.tabView.getTabIndex(tab);
        if (tab === this.tabView.b4ActiveTab)
            silent = true; // dont fire activeTabChange if already active
        
        this.tabView.set(this.tabView.ACTIVE_INDEX, index, silent);
        Rui.util.LEvent.preventDefault(e);
    },
    /**
     * @description label을 바꾼다. 
     * @method setLabel
     * @param {String} html text or html 
     * @return {void}
     */
    setLabel: function(text) {
        this.set(this.LABEL, text);
    },
    /**
     * @description label 값을 리턴한다. 
     * @method getLabel
     * @return {String}
     */
    getLabel: function() {
        return this.get(this.LABEL);
    },
    /**
     * @description disabled 값을 변경한다. 
     * @method setDisabled
     * @param {boolean} disabled 설정할 disabled 속성값을 설정한다.
     * @return {void}
     */
    setDisabled: function(disabled) {
    	this.cfg.setProperty(this.DISABLED, disabled);
    },
    /**
     * @description disabled 값을 리턴한다. 
     * @method getDisabled
     * @return {Boolean}
     */
    getDisabled: function() {
    	return this.cfg.getProperty(this.DISABLED);
    },
    /**
     * DOM에서 패널 엘리먼트를 제거하고 모든 자식 엘리먼트들을 null로 설정한다.
     * @method destroy
     */
    destroy: function () {
        this.el = null;
        this.cfg = null; 
        Rui.ui.tab.LTab.superclass.destroy.call(this);
    },
    /**
     * @description Provides a readable name for the tab.
     * @method toString
     * @return {String}
     */
    toString: function() {
        return 'Rui.ui.tab.LTab ' + (el.id || this.id);
    }
});

})();