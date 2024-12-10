/*
 * @(#) rui_tab.js
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
 */
Rui.namespace('Rui.ui.tab');
Rui.ui.tab.LTabView = function(config){
    config = config || {};
    config = Rui.applyIf(config, Rui.getConfig().getFirst('$.ext.tabView.defaultProperties'));
    Rui.ui.tab.LTabView.superclass.constructor.call(this,config);
};
Rui.extend(Rui.ui.tab.LTabView, Rui.ui.LUIComponent, {
    otype: 'Rui.ui.tab.LTabView',
    CSS_BASE: 'L-tabview',
    CLASSNAME: 'L-navset',
    _activatedTabs: null,
    contentHeight: null,
    ACTIVE: 'active',
    tabCnt: 1, 
    ACTIVE_TAB: 'activeTab',
    ACTIVE_INDEX: 'activeIndex',
    tabs: null,
    _tabEl: null,
    _contentEl: null,
    changeTabsPosition: false,
    initDefaultConfig: function(){
        Rui.ui.tab.LTabView.superclass.initDefaultConfig.call(this);
        this.cfg.addProperty('tabs', {
            value: [],
            readOnly: true
        });
        this.cfg.addProperty(this.ACTIVE_INDEX, {
            handler: this._setActiveIndex,
            value: this.activeIndex,
            validator: Rui.isNumber
        });
        this.cfg.addProperty(this.ACTIVE_TAB, {
            handler: this._setActiveTab,
            value: this.b4ActiveTab,
            validator: this._isValidActiveTab
        });
        this.cfg.addProperty('contentHeight', {
            handler: this._setContentHeight,
            value: this.contentHeight,
            validator: Rui.isNumber
        });
    },
    initEvents: function(){
        Rui.ui.tab.LTabView.superclass.initEvents.call(this);
        this.createEvent('canActiveTabChange');
        this.createEvent('activeTabChange');
        this.createEvent('activeIndexChange');
    },
    createContainer: function(container){
        var el = Rui.ui.tab.LTabView.superclass.createContainer.call(this, Rui.get(container)),
            children, i = 0, len, parentEl = el.parent();
        if(parentEl == null || Rui.get(container).dom !== parentEl.dom){
            children = Rui.get(container).getChildren();
            if((len = children.length) > 0){
                for (i = 0; i < len; i++){
                    el.appendChild(children[i]);
                }
            }
        }
    },
    _setDisabled: function(type, args, obj) {
        Rui.ui.tab.LTabView.superclass._setDisabled.call(this, type, args, obj);
        if(args[0] === false) this.el.unmask();
        else this.el.mask();
    },
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
        var tsEl = document.createElement('div');
        tsEl.id = Rui.useFixedId() ? Rui.id(this.el, this.id + '-nav-scroll') : Rui.id();
        this._tabScrollEl = Rui.get(tsEl);
        this._tabScrollEl.addClass('L-nav-scroll');
        this.el.appendChild(this._tabScrollEl);
        var tEl = document.createElement('ul');
        tEl.id = Rui.useFixedId() ? Rui.id(this.el, this.id + '-nav') : Rui.id();
        this._tabEl = Rui.get(tEl);
        this._tabEl.addClass(navArr["L-nav"] );
        if(Rui.useAccessibility()) this._tabEl.setAttribute('role', 'tablist');
        this._tabScrollEl.appendChild(this._tabEl);
        var nslEl = document.createElement('div');
        nslEl.id = Rui.useFixedId() ? Rui.id(this.el, this.id + '-nav-spin-left') : Rui.id();
        this._tabLeftSpinerEl = Rui.get(nslEl);
        this._tabLeftSpinerEl.addClass('L-nav-spin-left');
        this._tabLeftSpinerEl.on('click', this.onSpinLeftClick, this, true);
        this._tabScrollEl.appendChild(this._tabLeftSpinerEl);
        var nsEl = document.createElement('div');
        nsEl.id = Rui.useFixedId() ? Rui.id(this.el, this.id + '-nav-spin') : Rui.id();
        this._tabSpinEl = Rui.get(nsEl);
        this._tabSpinEl.addClass('L-nav-spin');
        this._tabScrollEl.appendChild(this._tabSpinEl);
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
    afterRender: function(container){
        Rui.ui.tab.LTabView.superclass.afterRender.call(this,container);
        this.set('tabs', this.tabs);
        if(!this.reMon && this.width == null){
            this.reMon = new Rui.util.LResizeMonitor();
            this.reMon.monitor(this.el.dom);
            this.reMon.on('contentResized',this.onContentResized, this, true);
        }
        if(Rui.browser.msie){
            if(this.width == null)
                Rui.later(1000, this, this.onContentResized);
        }
    },
    updateTabs: function(){
        if(this.el.getWidth() > 0 && this._tabEl.getWidth() > this.el.getWidth()){
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
    onContentResized: function(e){
        this.updateTabs();
        this.moveTo(this.getActiveIndex(),false);
    },
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
        if(activeTab && b4ActiveTab !== activeTab){ 
            this.contentTransition(activeTab);
        }else if(activeTab){
            activeTab.set('contentVisible', true);
        }
        this.moveTo(index, true);
        this.fireEvent('activeTabChange', {target: this, activeIndex: index, isFirst: isFirst, activeTab: activeTab, beforeActiveTab: b4ActiveTab, newValue: activeTab, prevValue: b4ActiveTab  });
        this.fireEvent('activeIndexChange', {target: this, activeIndex: index, isFirst: isFirst, activeTab: activeTab, beforeActiveTab: b4ActiveTab });
        this.b4ActiveTab = activeTab;
    },
    _setActiveTab: function(type, args, obj){
        this.set(this.ACTIVE_INDEX, this.getTabIndex(args[0]));
    },
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
    _setHeight: function(type, args, obj){
        this.el.setHeight(args[0]);
        var tabHeight = this._tabEl.getHeight();
        this._contentEl.setHeight(args[0] - tabHeight);
    },
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
    addTabsByChild: function(dom){
        if(!this._childAdded){ 
            var _active = true,
                nodes = dom.childNodes;
            if(nodes.length > 0){
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
    _isValidActiveTab: function(tab){
        if(typeof tab === 'undefined' || tab == null)
            return false;
        var ret = true;
        if(tab && tab.get('disabled')){ 
            ret = false;
        }
        return ret;
    },
    set: function(key, value, silent){
        return this.cfg.setProperty(key, value, silent);
    },
    get: function(key){
        return this.cfg.getProperty(key);
    },
    setContentHeight: function(height){
        this.set('contentHeight', height);
    },
    getTab: function(index){
        return this.get('tabs')[index];
    },
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
    getTabCount: function(){
        return this.get('tabs').length;
    },
    selectTab: function(index){
        this.set(this.ACTIVE_INDEX, index);
    },
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
            if(right + before >= area){ 
                after = -right + area;
            }else if(left <= -before){ 
                after = -left;
            }else if(left > -before){ 
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
    removeAt: function(inx){
        this._removeTabStatus(inx);
        this.removeTab(this.getTab(inx));
    },
    getActiveIndex: function(){
        return this.get(this.ACTIVE_INDEX);
    },
    getActiveTab: function(){
        return this.getTab(this.get(this.ACTIVE_INDEX));
    },
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
    toString: function(){
        return 'Rui.ui.tab.LTabView ' + this.id;
    }
});
(function() {
var Dom = Rui.util.LDom; 
Rui.ui.tab.LTab = function(config) {
    config = config || {};
    if (config.id) {
        var contentEl = Rui.get(config.id);
        if(contentEl && contentEl.dom){
            config.contentEl = contentEl.dom;
        }
    }
    if (!config.element) {
        this.el = this.createElement(config);
    } 
    Rui.applyObject(this, config, true);
    Rui.ui.tab.LTab.superclass.constructor.call(this, config);
    this.init(config); 
};
Rui.extend(Rui.ui.tab.LTab, Rui.util.LEventProvider, {
    otype: 'Rui.ui.tab.LTab', 
    label: null, 
    LABEL: 'label',
    LABEL_EL: 'labelEl',
    CONTENT: 'content',
    CONTENT_EL: 'contentEl',
    contentEl: null, 
    DISABLED: 'disabled',
    LABEL_TAGNAME: 'em',
    ACTIVE_CLASSNAME: 'L-nav-selected',
    CONTENT_CLASSNAME: 'L-content-tab', 
    HIDDEN_CLASSNAME: 'L-nav-hidden',
    ACTIVE_TITLE: 'active',
    DISABLED_CLASSNAME: 'disabled',
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
    initDefaultConfig: function(){
        this.cfg = new Rui.ui.LConfig(this);
        this.cfg.addProperty('activationEvent', {
            value: this.activationEvent || 'click'
        });
        this.cfg.addProperty(this.LABEL, {
            handler: this._setLabel, 
            value:  this.label || this._getLabel()
        });
        this.cfg.addProperty(this.LABEL_EL, {
            handler: this._setLabelEl, 
            value:  this[this.LABEL_EL] || this._getLabelEl()
        });
        this.cfg.addProperty(this.CONTENT_EL, {
            handler: this._setContentEl, 
            value: this.get(this.CONTENT_EL) || this[this.CONTENT_EL] || document.createElement('div')
        });
        this.cfg.addProperty(this.CONTENT, {
            handler: this._setContent, 
            value: this[this.CONTENT]
        }, false);
        this.cfg.addProperty(this.ACTIVE_TITLE, {
            handler: this._setActiveTitle,
            value: this.active || this.hasClass(this.ACTIVE_CLASSNAME), 
            validator: Rui.isBoolean
        });
        this.cfg.addProperty(this.DISABLED, {
            handler: this._setDisabled, 
            value: this.disabled || this.hasClass(this.DISABLED_CLASSNAME), 
            validator: Rui.isBoolean
        }); 
        this.cfg.addProperty('contentVisible', {
            handler: this._setContentVisible,
            value: this.contentVisible,
            validator: Rui.isBoolean
        });
    },
    getContainer: function(){
        return this.el;
    },
    createElement: function(config) {
        var el = document.createElement('li'),
        a = document.createElement('a'),
        label = config.label || null,
        labelDom = config.labelEl || null;
        el.id = Rui.useFixedId() && !Rui.isUndefined(config.tabView) ? Rui.id(this.el, config.tabView.id + '-LTab-' + (config.tabView.tabCnt++)) : Rui.id();
        a.href = config.href || '#'; 
        if(Rui.useAccessibility()){
            el.setAttribute('role', 'tab');
       }
        el.appendChild(a);
        if (labelDom) { 
            if (!label) { 
                label = this._getLabel();
            }
        } else {
            labelDom = this._createLabelEl();
        }
        a.appendChild(labelDom);
        return el;
    },
    addClass: function(className) {
        Dom.addClass(this.el, className);
        return this;
    },
    hasClass: function(className) {
        return Dom.hasClass(this.el, className);
    },
    removeClass: function(className) {
        var cnList = Rui.isArray(className) ? className : [className];
        Rui.util.LArray.each(cnList, function(cn) {
            Dom.removeClass(this.el, cn);
        }, this);
        return this;
    },
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
    _setDisabled: function(type, args, obj){
        if (args[0] === true) {
            Dom.addClass(this.el, this.DISABLED_CLASSNAME);
        } else {
            Dom.removeClass(this.el, this.DISABLED_CLASSNAME);
        }
    },
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
    _setContent: function(type, args, obj){
        var value = args[0],
        div =  document.createElement('div');
        Rui.util.LDom.appendHtml(div, value); 
    }, 
    _setContentEl: function(type, args, obj){
        var value = args[0]; 
        var current = this.get(this.CONTENT); 
        if (current) {
            if (current === value) {
                return false; 
            }
            if (!this.get('selected')) {   
                Dom.addClass(value, this.HIDDEN_CLASSNAME);
            }
            Rui.get(value).html(current); 
            this.set(this.CONTENT, value.innerHTML);
        }
    }, 
    _setLabel: function(type, args, obj){
        var labelDom = this.get(this.LABEL_EL);
        if (!labelDom) { 
            labelDom = this._createLabelEl();
            this.set(this.LABEL_EL, labelDom);
        }
        Rui.get(labelDom).html(args[0]); 
    }, 
    _setLabelEl: function(type, args, obj){
        var value  = Dom.get(args[0]);
        var current = this.get(this.LABEL_EL);
        if (current) {
            if (current == value) {
                return false; 
            }
            current.parentNode.replaceChild(value, current);
            this.set(this.LABEL, value.innerHTML);
        }
    }, 
    get: function(key) {
        return this.cfg.getProperty(key); 
    },
    set: function(key, value, silent) {
        return this.cfg.setProperty(key, value, silent); 
    },
    _getLabelEl: function() {
        return this.el.getElementsByTagName(this.LABEL_TAGNAME)[0];
    },
    _createLabelEl: function() {
        return document.createElement(this.LABEL_TAGNAME);
    },
    _getLabel: function() {
        var el = this.get(this.LABEL_EL); 
        if (!el) {
            return;
        }
        return el.innerHTML;
    },
    onActivate: function(e) {
    	if(this.cfg.getProperty(this.DISABLED) === true) return;
        var tab = this,
            silent = false,
            index = this.tabView.getTabIndex(tab);
        if (tab === this.tabView.b4ActiveTab)
            silent = true; 
        this.tabView.set(this.tabView.ACTIVE_INDEX, index, silent);
        Rui.util.LEvent.preventDefault(e);
    },
    setLabel: function(text) {
        this.set(this.LABEL, text);
    },
    getLabel: function() {
        return this.get(this.LABEL);
    },
    setDisabled: function(disabled) {
    	this.cfg.setProperty(this.DISABLED, disabled);
    },
    getDisabled: function() {
    	return this.cfg.getProperty(this.DISABLED);
    },
    destroy: function () {
        this.el = null;
        this.cfg = null; 
        Rui.ui.tab.LTab.superclass.destroy.call(this);
    },
    toString: function() {
        return 'Rui.ui.tab.LTab ' + (el.id || this.id);
    }
});
})();