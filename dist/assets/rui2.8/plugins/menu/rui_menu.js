/*
 * @(#) rui_menu.js
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
Rui.namespace('Rui.ui.menu');
(function(){
    var _DIV = "DIV",
        _HD = "hd",
        _BD = "bd",
        _FT = "ft",
        _LI = "LI",
        _DISABLED = "disabled",
        _MOUSEOVER = "mouseover",
        _MOUSEOUT = "mouseout",
        _MOUSEDOWN = "mousedown",
        _MOUSEUP = "mouseup",
        _FOCUS = Rui.browser.ie ? "focusin" : "focus",
        _CLICK = "click",
        _KEYDOWN = "keydown",
        _KEYUP = "keyup",
        _KEYPRESS = "keypress",
        _CLICK_TO_HIDE = "clicktohide",
        _POSITION = "position",
        _DYNAMIC = "dynamic",
        _SHOW_DELAY = "showdelay",
        _SELECTED = "selected",
        _VISIBLE = "visible",
        _UL = "UL",
        _MENUMANAGER = "LMenuManager",
        Dom = Rui.util.LDom,
        Event = Rui.util.LEvent;
    Rui.ui.menu.LMenuManager = function()
    {
        var m_bInitializedEventHandlers = false,
        m_oMenus = {},
        m_oVisibleMenus = {},
        m_oItems = {},
        m_oEventTypes = {
            "click": "clickEvent",
            "mousedown": "mouseDownEvent",
            "mouseup": "mouseUpEvent",
            "mouseover": "mouseOverEvent",
            "mouseout": "mouseOutEvent",
            "keydown": "keyDownEvent",
            "keyup": "keyUpEvent",
            "keypress": "keyPressEvent",
            "focus": "focusEvent",
            "focusin": "focusEvent",
            "blur": "blurEvent",
            "focusout": "blurEvent"
        },
        m_oFocusedElement = null,
        m_oFocusedMenuItem = null;
        function getMenuRootElement(p_oElement)
        {
            var oParentNode,
                returnVal;
            if (p_oElement && p_oElement.tagName)
            {
                switch (p_oElement.tagName.toUpperCase())
                {
                    case _DIV:
                        oParentNode = p_oElement.parentNode;
                        if ((
                            Dom.hasClass(p_oElement, _HD) ||
                            Dom.hasClass(p_oElement, _BD) ||
                            Dom.hasClass(p_oElement, _FT)
                        ) &&
                        oParentNode &&
                        oParentNode.tagName &&
                        oParentNode.tagName.toUpperCase() == _DIV)
                        {
                            returnVal = oParentNode;
                        }
                        else
                        {
                            returnVal = p_oElement;
                        }
                        break;
                    case _LI:
                        returnVal = p_oElement;
                        break;
                    default:
                        oParentNode = p_oElement.parentNode;
                        if (oParentNode)
                        {
                            returnVal = getMenuRootElement(oParentNode);
                        }
                        break;
                }
            }
            return returnVal;
        }
        function onDOMEvent(p_oEvent)
        {
            var oTarget = Event.getTarget(p_oEvent),
            oElement = getMenuRootElement(oTarget),
            sCustomEventType,
            sTagName,
            sId,
            oMenuItem,
            oMenu;
            if (oElement)
            {
                sTagName = oElement.tagName.toUpperCase();
                if (sTagName == _LI)
                {
                    sId = oElement.id;
                    if (sId && m_oItems[sId])
                    {
                        oMenuItem = m_oItems[sId];
                        oMenu = oMenuItem.parent;
                    }
                }
                else if (sTagName == _DIV)
                {
                    if (oElement.id)
                    {
                        oMenu = m_oMenus[oElement.id];
                    }
                }else{
                    return; 
                }
            }
            if (oMenu)
            {
                sCustomEventType = m_oEventTypes[p_oEvent.type];
                if (oMenuItem && !oMenuItem.cfg.getProperty(_DISABLED))
                {
                    if(sCustomEventType == "blurEvent"){
                        oMenuItem.fireEvent('blur', {target:this}); 
                    }else if(sCustomEventType == "focusEvent"){
                        oMenuItem.fireEvent('focus', {target:this});
                    }else{
                        oMenuItem[sCustomEventType].fire(p_oEvent);
                    }
                }              
                if(sCustomEventType == "blurEvent"){
                    oMenu.fireEvent('blur', {target:p_oEvent, item: oMenuItem}); 
                }else if(sCustomEventType == "focusEvent"){
                    oMenu.fireEvent('focus', {target:p_oEvent, item: oMenuItem});
                }else{
                    oMenu[sCustomEventType].fire(p_oEvent, oMenuItem);
                }
            }else if (p_oEvent.type == _MOUSEDOWN) {
                for (var i in m_oVisibleMenus)
                {
                    if (Rui.hasOwnProperty(m_oVisibleMenus, i))
                    {
                        oMenu = m_oVisibleMenus[i];
                        if (oMenu.cfg.getProperty(_CLICK_TO_HIDE) &&
                            !(oMenu instanceof Rui.ui.menu.LMenuBar) &&
                            oMenu.cfg.getProperty(_POSITION) == _DYNAMIC)
                        {
                            oMenu.hide();
                        }
                        else
                        {
                            if (oMenu.cfg.getProperty(_SHOW_DELAY) > 0)
                            {
                                oMenu._cancelShowDelay();
                            }
                            if (oMenu.activeItem)
                            {
                                oMenu.activeItem.blur();
                                oMenu.activeItem.cfg.setProperty(_SELECTED, false);
                                oMenu.activeItem = null;
                            }
                        }
                    }
                }
            }
            else if (p_oEvent.type == _FOCUS)
            {
                m_oFocusedElement = oTarget;
            }
        }
        function onMenuDestroy(e)
        {
            if (m_oMenus[e.target.id])
            {
                this.removeMenu(e.target);
            }
        }
        function onMenuFocus(e)
        {
            var oItem = e.item; 
            if (oItem)
            {
                m_oFocusedMenuItem = oItem;
            }
        }
        function onMenuBlur(e)
        {
            m_oFocusedMenuItem = null;
        }
        function onMenuHide(e) {
            var me = e.target; 
            if (me && me.focus)
            {
                try
                {
                    me.focus();
                }
                catch (ex)
                {
                }
            }
        }
        function onMenuShow(e)
        {
            var me = e.target; 
            if (me === me.getRoot() && me.cfg.getProperty(_POSITION) === _DYNAMIC)
            {
                   me.on('hide', onMenuHide, this, true);
                me.focus();
            }
        }
        function onMenuVisibleConfigChange(p_sType, p_aArgs)
        {
            var bVisible = p_aArgs[0],
                sId = this.id;
            if (bVisible)
            {
                m_oVisibleMenus[sId] = this;
            }
            else if (m_oVisibleMenus[sId])
            {
                delete m_oVisibleMenus[sId];
            }
        }
        function onItemDestroy(p_sType, p_aArgs)
        {
            removeItem(this);
        }
        function removeItem(p_oMenuItem)
        {
            var sId = p_oMenuItem.id;
            if (sId && m_oItems[sId])
            {
                if (m_oFocusedMenuItem == p_oMenuItem)
                {
                    m_oFocusedMenuItem = null;
                }
                delete m_oItems[sId];
                p_oMenuItem.destroyEvent.unOn(onItemDestroy);
            }
        }
        function onItemAdded(p_sType, p_aArgs)
        {
            var oItem = p_aArgs[0],
            sId;
            if (oItem instanceof Rui.ui.menu.LMenuItem)
            {
                sId = oItem.id;
                if (!m_oItems[sId])
                {
                    m_oItems[sId] = oItem;
                    oItem.destroyEvent.on(onItemDestroy);
                }
            }
        }
        return {
            addMenu: function(p_oMenu)
            {
                var oDoc;
                if (p_oMenu instanceof Rui.ui.menu.LMenu && p_oMenu.id && !m_oMenus[p_oMenu.id])
                {
                    m_oMenus[p_oMenu.id] = p_oMenu;
                    if (!m_bInitializedEventHandlers )
                    {
                        oDoc = document;
                        Event.on(oDoc, _MOUSEOVER, onDOMEvent, this, true);
                        Event.on(oDoc, _MOUSEOUT, onDOMEvent, this, true);
                        Event.on(oDoc, _MOUSEDOWN, onDOMEvent, this, true);
                        Event.on(oDoc, _MOUSEUP, onDOMEvent, this, true);
                        Event.on(oDoc, _CLICK, onDOMEvent, this, true);
                        Event.on(oDoc, _KEYDOWN, onDOMEvent, this, true);
                        Event.on(oDoc, _KEYUP, onDOMEvent, this, true);
                        Event.on(oDoc, _KEYPRESS, onDOMEvent, this, true);
                        Event.onFocus(oDoc, onDOMEvent, this, true);
                        Event.onBlur(oDoc, onDOMEvent, this, true);
                        m_bInitializedEventHandlers = true;
                    }
                    p_oMenu.cfg.subscribeToConfigEvent(_VISIBLE, onMenuVisibleConfigChange);
                    p_oMenu.on('destroy', onMenuDestroy, p_oMenu, true);
                    p_oMenu.itemAddedEvent.on(onItemAdded, this, true, {isCE:true});
                    p_oMenu.on('focus', onMenuFocus, this, true);
                    p_oMenu.on('blur', onMenuBlur, this, true);
                    p_oMenu.on('show', onMenuShow, this, true);
                }
                return this;
            },
            removeMenu: function(p_oMenu)
            {
                var sId, aItems, i;
                if (p_oMenu)
                {
                    sId = p_oMenu.id;
                    if ((sId in m_oMenus) && (m_oMenus[sId] == p_oMenu))
                    {
                        aItems = p_oMenu.getItems();
                        if (aItems && aItems.length > 0)
                        {
                            i = aItems.length - 1;
                            do
                            {
                                removeItem(aItems[i]);
                            }
                            while (i--);
                        }
                        delete m_oMenus[sId];
                        if ((sId in m_oVisibleMenus) && (m_oVisibleMenus[sId] == p_oMenu))
                        {
                            delete m_oVisibleMenus[sId];
                        }
                        if (p_oMenu.cfg)
                        {
                            p_oMenu.cfg.unsubscribeFromConfigEvent(_VISIBLE, onMenuVisibleConfigChange);
                        }
                        p_oMenu.unOn('destroy', onMenuDestroy, p_oMenu);
                        p_oMenu.itemAddedEvent.unOn(onItemAdded, this);
                        p_oMenu.unOn('focus', onMenuFocus, this);
                        p_oMenu.unOn('blur', onMenuBlur, this);
                    }
                }
                return this;
            },
            hideVisible: function()
            {
                var oMenu;
                for (var i in m_oVisibleMenus)
                {
                    if (Rui.hasOwnProperty(m_oVisibleMenus, i))
                    {
                        oMenu = m_oVisibleMenus[i];
                        if (!(oMenu instanceof Rui.ui.menu.LMenuBar) &&
                            oMenu.cfg.getProperty(_POSITION) == _DYNAMIC)
                        {
                            oMenu.hide();
                        }
                    }
                }
                return this;
            },
            getVisible: function()
            {
                return m_oVisibleMenus;
            },
            getMenus: function()
            {
                return m_oMenus;
            },
            getMenu: function(p_sId)
            {
                var returnVal;
                if (p_sId in m_oMenus)
                {
                    returnVal = m_oMenus[p_sId];
                }
                return returnVal;
            },
            getMenuItem: function(p_sId)
            {
                var returnVal;
                if (p_sId in m_oItems)
                {
                    returnVal = m_oItems[p_sId];
                }
                return returnVal;
            },
            getMenuItemGroup: function(p_sId)
            {
                var oUL = Dom.get(p_sId), aItems, oNode, oItem, sId, returnVal;
                if (oUL && oUL.tagName && oUL.tagName.toUpperCase() == _UL)
                {
                    oNode = oUL.firstChild;
                    if (oNode)
                    {
                        aItems = [];
                        do
                        {
                            sId = oNode.id;
                            if (sId)
                            {
                                oItem = this.getMenuItem(sId);
                                if (oItem)
                                {
                                    aItems[aItems.length] = oItem;
                                }
                            }
                        }
                        while ((oNode = oNode.nextSibling));
                        if (aItems.length > 0)
                        {
                            returnVal = aItems;
                        }
                    }
                }
                return returnVal;
            },
            getFocusedMenuItem: function()
            {
                return m_oFocusedMenuItem;
            },
            getFocusedMenu: function()
            {
                var returnVal;
                if (m_oFocusedMenuItem)
                {
                    returnVal = m_oFocusedMenuItem.parent.getRoot();
                }
                return returnVal;
            },
            toString: function()
            {
                return _MENUMANAGER;
            }
        };
    } ();
})();
Rui.namespace('Rui.ui.menu');
(function() {
    var _MENU = 'LMenu',
    _DIV_UPPERCASE = 'DIV',
    _DIV_LOWERCASE = 'div',
    _ID = 'id',
    _SELECT = 'SELECT',
    _XY = 'xy',
    _Y = 'y',
    _UL_UPPERCASE = 'UL',
    _UL_LOWERCASE = 'ul',
    _FIRST_OF_TYPE = 'first-of-type',
    _LI = 'LI',
    _OPTGROUP = 'OPTGROUP',
    _OPTION = 'OPTION',
    _DISABLED = 'disabled',
    _NONE = 'none',
    _SELECTED = 'selected',
    _GROUP_INDEX = 'groupindex',
    _INDEX = 'index',
    _SUBMENU = 'submenu',
    _VISIBLE = 'visible',
    _HIDE_DELAY = 'hidedelay',
    _POSITION = 'position',
    _DYNAMIC = 'dynamic',
    _STATIC = 'static',
    _DYNAMIC_STATIC = _DYNAMIC + ',' + _STATIC,
    _WINDOWS = 'windows',
    _URL = 'url',
    _HASH = '#',
    _TARGET = 'target',
    _MAX_HEIGHT = 'maxheight',
    _TOP_SCROLLBAR = 'topscrollbar',
    _BOTTOM_SCROLLBAR = 'bottomscrollbar',
    _UNDERSCORE = '_',
    _TOP_SCROLLBAR_DISABLED = _TOP_SCROLLBAR + _UNDERSCORE + _DISABLED,
    _BOTTOM_SCROLLBAR_DISABLED = _BOTTOM_SCROLLBAR + _UNDERSCORE + _DISABLED,
    _MOUSEMOVE = 'mousemove',
    _SHOW_DELAY = 'showdelay',
    _SUBMENU_HIDE_DELAY = 'submenuhidedelay',
    _IFRAME = 'iframe',
    _CONSTRAIN_TO_VIEWPORT = 'constraintoviewport',
    _PREVENT_CONTEXT_OVERLAP = 'preventcontextoverlap',
    _SUBMENU_ALIGNMENT = 'submenualignment',
    _AUTO_SUBMENU_DISPLAY = 'autosubmenudisplay',
    _CLICK_TO_HIDE = 'clicktohide',
    _CONTAINER = 'container',
    _SCROLL_INCREMENT = 'scrollincrement',
    _MIN_SCROLL_HEIGHT = 'minscrollheight',
    _CLASSNAME = 'classname',
    _SHADOW = 'shadow',
    _KEEP_OPEN = 'keepopen',
    _HD = 'hd',
    _HAS_TITLE = 'hastitle',
    _CONTEXT = 'context',
    _EMPTY_STRING = '',
    _MOUSEDOWN = 'mousedown',
    _KEYDOWN = 'keydown',
    _HEIGHT = 'height',
    _WIDTH = 'width',
    _PX = 'px',
    _EFFECT = 'effect',
    _MONITOR_RESIZE = 'monitorresize',
    _DISPLAY = 'display',
    _BLOCK = 'block',
    _ABSOLUTE = 'absolute',
    _ZINDEX = 'zindex',
    _RUI_MENU_BODY_SCROLLED = 'L-menu-body-scrolled',
    _NON_BREAKING_SPACE = '&#32;',
    _SPACE = ' ',
    _MOUSEOVER = 'mouseover',
    _MOUSEOUT = 'mouseout',
    _ITEM_ADDED = 'itemAdded',
    _ITEM_REMOVED = 'itemRemoved',
    _RUI_MENU_SHADOW = 'L-menu-shadow',
    _RUI_MENU_SHADOW_VISIBLE = _RUI_MENU_SHADOW + '-visible',
    _RUI_MENU_SHADOW_RUI_MENU_SHADOW_VISIBLE = _RUI_MENU_SHADOW + _SPACE + _RUI_MENU_SHADOW_VISIBLE;
    Rui.ui.menu.LMenu = function(oConfig) {
        var config = oConfig ||{};
        config = Rui.applyIf(config, Rui.getConfig().getFirst('$.ext.menu.defaultProperties'));
        if (config) {
            this.parent = config.parent;
            this.lazyLoad = config.lazyLoad === undefined ? true : config.lazyLoad;
            this.hideDelay = config.hideDelay === undefined ? 750 : config.hideDelay; 
            this.itemData = config.itemData || config.itemdata;
        }
        if (config.dataSet && config.fields)
        {
            this.dataSet = config.dataSet;
            this.fields = config.fields;
            this.dataSet.on("load", this.onLoadDataSet, this, true);
        }
        Rui.applyObject(this, config, true);
        Rui.ui.menu.LMenu.superclass.constructor.call(this, config);
    };
    function checkPosition(p_sPosition) {
        var returnVal = false;
        if (Rui.isString(p_sPosition)) {
            returnVal = (_DYNAMIC_STATIC.indexOf((p_sPosition.toLowerCase())) != -1);
        }
        return returnVal;
    }
    var Dom = Rui.util.LDom,
    Event = Rui.util.LEvent,    
    Panel = Rui.ui.LPanel,
    LMenu = Rui.ui.menu.LMenu,
    LMenuManager = Rui.ui.menu.LMenuManager,
    LCustomEvent = Rui.util.LCustomEvent,
    UA = Rui.browser,
    m_oShadowTemplate,
    EVENT_TYPES = [
       ["mouseOverEvent", _MOUSEOVER],
       ["mouseOutEvent", _MOUSEOUT],
       ["mouseDownEvent", _MOUSEDOWN],
       ["mouseUpEvent", "mouseup"],
       ["clickEvent", "click"],
       ["keyPressEvent", "keypress"],
       ["keyDownEvent", _KEYDOWN],
       ["keyUpEvent", "keyup"], 
       ["itemAddedEvent", _ITEM_ADDED],
       ["itemRemovedEvent", _ITEM_REMOVED]
    ],
    VISIBLE_CONFIG = {
            key: _VISIBLE,
            value: false,
            validator: Rui.isBoolean
    },
    CONSTRAIN_TO_VIEWPORT_CONFIG = {
            key: _CONSTRAIN_TO_VIEWPORT,
            value: true,
            validator: Rui.isBoolean,
            supercedes: [_IFRAME, "x", _Y, _XY]
    },
    PREVENT_CONTEXT_OVERLAP_CONFIG = {
            key: _PREVENT_CONTEXT_OVERLAP,
            value: true,
            validator: Rui.isBoolean,
            supercedes: [_CONSTRAIN_TO_VIEWPORT]
    },
    POSITION_CONFIG = {
            key: _POSITION,
            value: _DYNAMIC,
            validator: checkPosition,
            supercedes: [_VISIBLE, _IFRAME]
    },
    SUBMENU_ALIGNMENT_CONFIG = {
            key: _SUBMENU_ALIGNMENT,
            value: ["tl", "tr"]
    },
    AUTO_SUBMENU_DISPLAY_CONFIG = {
            key: _AUTO_SUBMENU_DISPLAY,
            value: true,
            validator: Rui.isBoolean,
            suppressEvent: true
    },
    SHOW_DELAY_CONFIG = {
            key: _SHOW_DELAY,
            value: 250,
            validator: Rui.isNumber,
            suppressEvent: true
    },
    HIDE_DELAY_CONFIG = {
            key: _HIDE_DELAY,
            value: 0,
            validator: Rui.isNumber,
            suppressEvent: true
    },
    SUBMENU_HIDE_DELAY_CONFIG = {
            key: _SUBMENU_HIDE_DELAY,
            value: 250,
            validator: Rui.isNumber,
            suppressEvent: true
    },
    CLICK_TO_HIDE_CONFIG = {
            key: _CLICK_TO_HIDE,
            value: true,
            validator: Rui.isBoolean,
            suppressEvent: true
    },
    CONTAINER_CONFIG = {
            key: _CONTAINER,
            suppressEvent: true
    },
    SCROLL_INCREMENT_CONFIG = {
            key: _SCROLL_INCREMENT,
            value: 1,
            validator: Rui.isNumber,
            supercedes: [_MAX_HEIGHT],
            suppressEvent: true
    },
    MIN_SCROLL_HEIGHT_CONFIG = {
            key: _MIN_SCROLL_HEIGHT,
            value: 90,
            validator: Rui.isNumber,
            supercedes: [_MAX_HEIGHT],
            suppressEvent: true
    },
    MAX_HEIGHT_CONFIG = {
            key: _MAX_HEIGHT,
            value: 0,
            validator: Rui.isNumber,
            supercedes: [_IFRAME],
            suppressEvent: true
    },
    CLASS_NAME_CONFIG = {
            key: _CLASSNAME,
            value: null,
            validator: Rui.isString,
            suppressEvent: true
    },
    DISABLED_CONFIG = {
            key: _DISABLED,
            value: false,
            validator: Rui.isBoolean,
            suppressEvent: true
    },
    SHADOW_CONFIG = {
            key: _SHADOW,
            value: true,
            validator: Rui.isBoolean,
            suppressEvent: true,
            supercedes: [_VISIBLE]
    },
    KEEP_OPEN_CONFIG = {
            key: _KEEP_OPEN,
            value: false,
            validator: Rui.isBoolean
    };
    Rui.extend(LMenu, Panel, {
        otype: "Rui.ui.menu.LMenu",
        CSS_CLASS_NAME: "L-ruimenu",
        ITEM_TYPE: null,
        GROUP_TITLE_TAG_NAME: "h6",
        OFF_SCREEN_POSITION: "-999em",
        _useHideDelay: false,
        _bHandledMouseOverEvent: false,
        _bHandledMouseOutEvent: false,
        _aGroupTitleElements: null,
        _aItemGroups: null,
        _aListElements: null,
        _nCurrentMouseX: 0,
        _bStopMouseEventHandlers: false,
        _sClassName: null,
        lazyLoad: false,
        itemData: null,
        activeItem: null,
        parent: null,
        srcElement: null,
        dataSet: null,
        fields: null,
        initDefaultConfig: function() {
            Panel.superclass.initDefaultConfig.call(this);
            this._initConfig();
            this.cfg.addProperty(
                    VISIBLE_CONFIG.key,
                    {
                        handler: this.configVisible,
                        value: VISIBLE_CONFIG.value,
                        validator: VISIBLE_CONFIG.validator
                    }
            );
            this.cfg.addProperty(
                    CONSTRAIN_TO_VIEWPORT_CONFIG.key,
                    {
                        handler: this.configConstrainToViewport,
                        value: CONSTRAIN_TO_VIEWPORT_CONFIG.value,
                        validator: CONSTRAIN_TO_VIEWPORT_CONFIG.validator,
                        supercedes: CONSTRAIN_TO_VIEWPORT_CONFIG.supercedes
                    }
            );
            this.cfg.addProperty(PREVENT_CONTEXT_OVERLAP_CONFIG.key, {
                value: PREVENT_CONTEXT_OVERLAP_CONFIG.value,
                validator: PREVENT_CONTEXT_OVERLAP_CONFIG.validator,
                supercedes: PREVENT_CONTEXT_OVERLAP_CONFIG.supercedes
            });
            this.cfg.addProperty(POSITION_CONFIG.key, {
                    handler: this.configPosition,
                    value: POSITION_CONFIG.value,
                    validator: POSITION_CONFIG.validator,
                    supercedes: POSITION_CONFIG.supercedes
                }
            );
            this.cfg.addProperty(SUBMENU_ALIGNMENT_CONFIG.key, {
                    value: SUBMENU_ALIGNMENT_CONFIG.value,
                    suppressEvent: SUBMENU_ALIGNMENT_CONFIG.suppressEvent
                }
            );
            this.cfg.addProperty( AUTO_SUBMENU_DISPLAY_CONFIG.key, {
                    value: AUTO_SUBMENU_DISPLAY_CONFIG.value,
                    validator: AUTO_SUBMENU_DISPLAY_CONFIG.validator,
                    suppressEvent: AUTO_SUBMENU_DISPLAY_CONFIG.suppressEvent
                }
            );
            this.cfg.addProperty(SHOW_DELAY_CONFIG.key, {
                    value: SHOW_DELAY_CONFIG.value,
                    validator: SHOW_DELAY_CONFIG.validator,
                    suppressEvent: SHOW_DELAY_CONFIG.suppressEvent
                }
            );
            this.cfg.addProperty(HIDE_DELAY_CONFIG.key, {
                    handler: this.configHideDelay,
                    value: HIDE_DELAY_CONFIG.value,
                    validator: HIDE_DELAY_CONFIG.validator,
                    suppressEvent: HIDE_DELAY_CONFIG.suppressEvent
                }
            );
            this.cfg.addProperty(SUBMENU_HIDE_DELAY_CONFIG.key, {
                    value: SUBMENU_HIDE_DELAY_CONFIG.value,
                    validator: SUBMENU_HIDE_DELAY_CONFIG.validator,
                    suppressEvent: SUBMENU_HIDE_DELAY_CONFIG.suppressEvent
                }
            );
            this.cfg.addProperty(CLICK_TO_HIDE_CONFIG.key, {
                    value: CLICK_TO_HIDE_CONFIG.value,
                    validator: CLICK_TO_HIDE_CONFIG.validator,
                    suppressEvent: CLICK_TO_HIDE_CONFIG.suppressEvent
                }
            );
            this.cfg.addProperty(CONTAINER_CONFIG.key, {
                    handler: this.configContainer,
                    value: document.body,
                    suppressEvent: CONTAINER_CONFIG.suppressEvent
                }
            );
            this.cfg.addProperty(SCROLL_INCREMENT_CONFIG.key, {
                    value: SCROLL_INCREMENT_CONFIG.value,
                    validator: SCROLL_INCREMENT_CONFIG.validator,
                    supercedes: SCROLL_INCREMENT_CONFIG.supercedes,
                    suppressEvent: SCROLL_INCREMENT_CONFIG.suppressEvent
                }
            );
            this.cfg.addProperty(MIN_SCROLL_HEIGHT_CONFIG.key, {
                    value: MIN_SCROLL_HEIGHT_CONFIG.value,
                    validator: MIN_SCROLL_HEIGHT_CONFIG.validator,
                    supercedes: MIN_SCROLL_HEIGHT_CONFIG.supercedes,
                    suppressEvent: MIN_SCROLL_HEIGHT_CONFIG.suppressEvent
                }
            );
            this.cfg.addProperty(MAX_HEIGHT_CONFIG.key, {
                    handler: this.configMaxHeight,
                    value: MAX_HEIGHT_CONFIG.value,
                    validator: MAX_HEIGHT_CONFIG.validator,
                    suppressEvent: MAX_HEIGHT_CONFIG.suppressEvent,
                    supercedes: MAX_HEIGHT_CONFIG.supercedes
                }
            );
            this.cfg.addProperty(CLASS_NAME_CONFIG.key, {
                    handler: this.configClassName,
                    value: CLASS_NAME_CONFIG.value,
                    validator: CLASS_NAME_CONFIG.validator,
                    supercedes: CLASS_NAME_CONFIG.supercedes
                }
            );
            this.cfg.addProperty(DISABLED_CONFIG.key, {
                    handler: this.configDisabled,
                    value: DISABLED_CONFIG.value,
                    validator: DISABLED_CONFIG.validator,
                    suppressEvent: DISABLED_CONFIG.suppressEvent
                }
            );
            this.cfg.addProperty(SHADOW_CONFIG.key, {
                    handler: this.configShadow,
                    value: SHADOW_CONFIG.value,
                    validator: SHADOW_CONFIG.validator
                }
            );
            this.cfg.addProperty(KEEP_OPEN_CONFIG.key, {
                    value: KEEP_OPEN_CONFIG.value,
                    validator: KEEP_OPEN_CONFIG.validator
                }
            );
        }, 
        initComponent: function(config){
            Rui.ui.menu.LMenu.superclass.initComponent.call(this); 
            this._aItemGroups = [];
            this._aListElements = [];
            this._aGroupTitleElements = [];
            if (!this.ITEM_TYPE) {
                this.ITEM_TYPE = Rui.ui.menu.LMenuItem;
            }
        }, 
        initEvents: function() {
            Rui.ui.menu.LMenu.superclass.initEvents.call(this);
            var i = EVENT_TYPES.length - 1,
            aEventData,
            oCustomEvent;
            do {
                aEventData = EVENT_TYPES[i];
                oCustomEvent = this.createEvent(aEventData[1], { isCE: true });
                oCustomEvent.signature = LCustomEvent.LIST;
                this[aEventData[0]] = oCustomEvent;
            }
            while (i--);
            this.on('init', this._onInit, this, true); 
            this.on('beforeRender', this._onBeforeRender, this, true);
            this.renderEvent.on(this._onRender, this, true);
            this.on('beforeShow', this._onBeforeShow, this, true);
            this.on('hide', this._onHide, this, true);
            this.on('show', this._onShow, this, true);
            this.on('beforeHide', this._onBeforeHide, this, true);
            this.mouseOverEvent.on(this._onMouseOver, this, true, {isCE:true});
            this.mouseOutEvent.on(this._onMouseOut, this, true, {isCE:true});
            this.clickEvent.on(this._onClick, this, true, {isCE:true});
            this.keyDownEvent.on(this._onKeyDown, this, true, {isCE:true});
            this.keyPressEvent.on(this._onKeyPress, this, true, {isCE:true});
            this.on('blur', this._onBlur, this, true);
            this.renderEvent.unOn(this.cfg.fireQueue, this.cfg); 
            this.renderEvent.on(this.cfg.fireQueue, this.cfg, true);
        },
        createContainer: function(appendToNode) {
            this.el = Rui.ui.menu.LMenu.superclass.createContainer.call(this);
            this.cfg.setProperty(CONTAINER_CONFIG.key, document.body);
            return this.el; 
        },
        doRender: function(container){
            if(this.element){
                Dom.addClass(this.element, this.CSS_CLASS_NAME);
                if ((UA.gecko && UA.gecko < 1.9) || UA.webkit) {
                    this.cfg.subscribeToConfigEvent(_Y, this._onYChange);
                }
                if(Rui.useAccessibility()){
                    this.element.setAttribute('role', 'menu');
                    this.element.setAttribute('aria-hidden', 'false');
                }
                LMenuManager.addMenu(this);
            }
        }, 
        render: function(appendToNode) {
            this.fireEvent('beforeRender', {target: this}); 
            Rui.ui.menu.LMenu.superclass.render.call(this, appendToNode);
        }, 
        afterRender: function(container) {
            LMenu.superclass.afterRender.call(this,container);
        }, 
        _initSubTree: function() {
            var oSrcElement = this.srcElement,
            sSrcElementTagName,
            nGroup,
            sGroupTitleTagName,
            oNode,
            aListElements,
            nListElements,
            i;
            if (oSrcElement) {
                sSrcElementTagName =
                    (oSrcElement.tagName && oSrcElement.tagName.toUpperCase());
                if (sSrcElementTagName == _DIV_UPPERCASE) {
                    oNode = this.body.firstChild;
                    if (oNode) {
                        nGroup = 0;
                        sGroupTitleTagName = this.GROUP_TITLE_TAG_NAME.toUpperCase();
                        do {
                            if (oNode && oNode.tagName) {
                                switch (oNode.tagName.toUpperCase()) {
                                case sGroupTitleTagName:
                                    this._aGroupTitleElements[nGroup] = oNode;
                                    break;
                                case _UL_UPPERCASE:
                                    this._aListElements[nGroup] = oNode;
                                    this._aItemGroups[nGroup] = [];
                                    nGroup++;
                                    break;
                                }
                            }
                        }
                        while ((oNode = oNode.nextSibling));
                        if (this._aListElements[0]) {
                            Dom.addClass(this._aListElements[0], _FIRST_OF_TYPE);
                        }
                    }
                }
                oNode = null;
                if (sSrcElementTagName) {
                    switch (sSrcElementTagName) {
                    case _DIV_UPPERCASE:
                        aListElements = this._aListElements;
                        nListElements = aListElements.length;
                        if (nListElements > 0) {
                            i = nListElements - 1;
                            do {
                                oNode = aListElements[i].firstChild;
                                if (oNode) {
                                    do {
                                        if (oNode && oNode.tagName && oNode.tagName.toUpperCase() == _LI) {
                                            this.addItem(new this.ITEM_TYPE(oNode, { parent: this }), i);
                                        }
                                    }
                                    while ((oNode = oNode.nextSibling));
                                }
                            }
                            while (i--);
                        }
                        break;
                    case _SELECT:
                        oNode = oSrcElement.firstChild;
                        do {
                            if (oNode && oNode.tagName) {
                                switch (oNode.tagName.toUpperCase()) {
                                case _OPTGROUP:
                                case _OPTION:
                                    this.addItem(new this.ITEM_TYPE( oNode, { parent: this }));
                                    break;
                                }
                            }
                        }
                        while ((oNode = oNode.nextSibling));
                        break;
                    }
                }
            }
        },
        _getFirstEnabledItem: function() {
            var aItems = this.getItems(),
            nItems = aItems.length,
            oItem,
            returnVal;
            for (var i = 0; i < nItems; i++) {
                oItem = aItems[i];
                if (oItem && !oItem.cfg.getProperty(_DISABLED) && oItem.element.style.display != _NONE) {
                    returnVal = oItem;
                    break;
                }
            }
            return returnVal;
        },
        _addItemToGroup: function(p_nGroupIndex, p_oItem, p_nItemIndex) {
            var oItem,
            nGroupIndex,
            aGroup,
            oGroupItem,
            bAppend,
            oNextItemSibling,
            nItemIndex,
            returnVal;
            function getNextItemSibling(p_aArray, p_nStartIndex) {
                return (p_aArray[p_nStartIndex] || getNextItemSibling(p_aArray, (p_nStartIndex + 1)));
            }
            if (p_oItem instanceof this.ITEM_TYPE) {
                oItem = p_oItem;
                oItem.parent = this;
            }
            else if (Rui.isString(p_oItem)) {
                oItem = new this.ITEM_TYPE(p_oItem, { parent: this });
            }
            else if (Rui.isObject(p_oItem)) {
                p_oItem.parent = this;
                oItem = new this.ITEM_TYPE(p_oItem.text, p_oItem);
            }
            if (oItem) {
                if (oItem.cfg.getProperty(_SELECTED)) {
                    this.activeItem = oItem;
                }
                nGroupIndex = Rui.isNumber(p_nGroupIndex) ? p_nGroupIndex : 0;
                aGroup = this._getItemGroup(nGroupIndex);
                if (!aGroup) {
                    aGroup = this._createItemGroup(nGroupIndex);
                }
                if (Rui.isNumber(p_nItemIndex)) {
                    bAppend = (p_nItemIndex >= aGroup.length);
                    if (aGroup[p_nItemIndex]) {
                        aGroup.splice(p_nItemIndex, 0, oItem);
                    }
                    else {
                        aGroup[p_nItemIndex] = oItem;
                    }
                    oGroupItem = aGroup[p_nItemIndex];
                    if (oGroupItem) {
                        if (bAppend && (!oGroupItem.element.parentNode ||
                                oGroupItem.element.parentNode.nodeType == 11)) {
                            this._aListElements[nGroupIndex].appendChild(oGroupItem.element);
                        }
                        else {
                            oNextItemSibling = getNextItemSibling(aGroup, (p_nItemIndex + 1));
                            if (oNextItemSibling && (!oGroupItem.element.parentNode ||
                                    oGroupItem.element.parentNode.nodeType == 11)) {
                                this._aListElements[nGroupIndex].insertBefore(
                                        oGroupItem.element, oNextItemSibling.element);
                            }
                        }
                        oGroupItem.parent = this;
                        this._subscribeToItemEvents(oGroupItem);
                        this._configureSubmenu(oGroupItem);
                        this._updateItemProperties(nGroupIndex);
                        this.itemAddedEvent.fire(oGroupItem);
                        this.fireEvent('changeContent', {target:this});
                        returnVal = oGroupItem;
                    }
                }
                else {
                    nItemIndex = aGroup.length;
                    aGroup[nItemIndex] = oItem;
                    oGroupItem = aGroup[nItemIndex];
                    if (oGroupItem) {
                        if (!Dom.isAncestor(this._aListElements[nGroupIndex], oGroupItem.element)) {
                            this._aListElements[nGroupIndex].appendChild(oGroupItem.element);
                        }
                        oGroupItem.element.setAttribute(_GROUP_INDEX, nGroupIndex);
                        oGroupItem.element.setAttribute(_INDEX, nItemIndex);
                        oGroupItem.parent = this;
                        oGroupItem.index = nItemIndex;
                        oGroupItem.groupIndex = nGroupIndex;
                        this._subscribeToItemEvents(oGroupItem);
                        this._configureSubmenu(oGroupItem);
                        if (nItemIndex === 0) {
                            Dom.addClass(oGroupItem.element, _FIRST_OF_TYPE);
                        }
                        this.itemAddedEvent.fire(oGroupItem);
                        this.fireEvent('changeContent', {target:this});
                        returnVal = oGroupItem;
                    }
                }
            }
            return returnVal;
        },
        _removeItemFromGroupByIndex: function(p_nGroupIndex, p_nItemIndex) {
            var nGroupIndex = Rui.isNumber(p_nGroupIndex) ? p_nGroupIndex : 0,
                    aGroup = this._getItemGroup(nGroupIndex),
                    aArray,
                    oItem,
                    oUL;
            if (aGroup) {
                aArray = aGroup.splice(p_nItemIndex, 1);
                oItem = aArray[0];
                if (oItem) {
                    this._updateItemProperties(nGroupIndex);
                    if (aGroup.length === 0) {
                        oUL = this._aListElements[nGroupIndex];
                        if (this.body && oUL) {
                            this.body.removeChild(oUL);
                        }
                        this._aItemGroups.splice(nGroupIndex, 1);
                        this._aListElements.splice(nGroupIndex, 1);
                        oUL = this._aListElements[0];
                        if (oUL) {
                            Dom.addClass(oUL, _FIRST_OF_TYPE);
                        }
                    }
                    this.itemRemovedEvent.fire(oItem);
                    this.fireEvent('changeContent', {target:this});
                }
            }
            return oItem;
        },
        _removeItemFromGroupByValue: function(p_nGroupIndex, p_oItem) {
            var aGroup = this._getItemGroup(p_nGroupIndex),
            nItems,
            nItemIndex,
            returnVal,
            i;
            if (aGroup) {
                nItems = aGroup.length;
                nItemIndex = -1;
                if (nItems > 0) {
                    i = nItems - 1;
                    do {
                        if (aGroup[i] == p_oItem) {
                            nItemIndex = i;
                            break;
                        }
                    }
                    while (i--);
                    if (nItemIndex > -1) {
                        returnVal = this._removeItemFromGroupByIndex(p_nGroupIndex, nItemIndex);
                    }
                }
            }
            return returnVal;
        },
        _updateItemProperties: function(p_nGroupIndex) {
            var aGroup = this._getItemGroup(p_nGroupIndex),
            nItems = aGroup.length,
            oItem,
            oLI,
            i;
            if (nItems > 0) {
                i = nItems - 1;
                do {
                    oItem = aGroup[i];
                    if (oItem) {
                        oLI = oItem.element;
                        oItem.index = i;
                        oItem.groupIndex = p_nGroupIndex;
                        oLI.setAttribute(_GROUP_INDEX, p_nGroupIndex);
                        oLI.setAttribute(_INDEX, i);
                        Dom.removeClass(oLI, _FIRST_OF_TYPE);
                    }
                }
                while (i--);
                if (oLI) {
                    Dom.addClass(oLI, _FIRST_OF_TYPE);
                }
            }
        },
        _createItemGroup: function(p_nIndex) {
            var oUL, returnVal;
            if (!this._aItemGroups[p_nIndex]) {
                this._aItemGroups[p_nIndex] = [];
                oUL = document.createElement(_UL_LOWERCASE);
                this._aListElements[p_nIndex] = oUL;
                returnVal = this._aItemGroups[p_nIndex];
            }
            return returnVal;
        },
        _getItemGroup: function(p_nIndex) {
            var nIndex = Rui.isNumber(p_nIndex) ? p_nIndex : 0,
                    aGroups = this._aItemGroups,
                    returnVal;
            if (nIndex in aGroups) {
                returnVal = aGroups[nIndex];
            }
            return returnVal;
        },
        _configureSubmenu: function(p_oItem) {
            var oSubmenu = p_oItem.cfg.getProperty(_SUBMENU);
            if (oSubmenu) {
                this.cfg.configChangedEvent.on(this._onParentMenuConfigChange, oSubmenu, true);
                this.renderEvent.on(this._onParentMenuRender, oSubmenu, true);
            }
        },
        _subscribeToItemEvents: function(p_oItem) {
            p_oItem.destroyEvent.on(this._onMenuItemDestroy, p_oItem, this, {isCE:true});
            p_oItem.cfg.configChangedEvent.on(this._onMenuItemConfigChange, p_oItem, this, {isCE:true});
        },
        _onVisibleChange: function(p_sType, p_aArgs) {
            var bVisible = p_aArgs[0];
            if (bVisible) {
                Dom.addClass(this.element, _VISIBLE);
            }
            else {
                Dom.removeClass(this.element, _VISIBLE);
            }
        },
        _cancelHideDelay: function() {
            var oTimer = this.getRoot()._hideDelayTimer;
            if (oTimer) {
                oTimer.cancel();
            }
        },
        _execHideDelay: function() {
            this._cancelHideDelay();
            var oRoot = this.getRoot();
            oRoot._hideDelayTimer = Rui.later(oRoot.cfg.getProperty(_HIDE_DELAY), this, function() {
                if (oRoot.activeItem) {
                    if (oRoot.hasFocus()) {
                        oRoot.activeItem.focus();
                    }
                    oRoot.clearActiveItem();
                }
                if (oRoot == this && !(this instanceof Rui.ui.menu.LMenuBar) &&
                        this.cfg.getProperty(_POSITION) == _DYNAMIC) {
                    this.hide();
                }
            });
        },
        _cancelShowDelay: function() {
            var oTimer = this.getRoot()._showDelayTimer;
            if (oTimer) {
                oTimer.cancel();
            }
        },
        _execSubmenuHideDelay: function(p_oSubmenu, p_nMouseX, p_nHideDelay) {
            p_oSubmenu._submenuHideDelayTimer = Rui.later(50, this, function() {
                if (this._nCurrentMouseX > (p_nMouseX + 10)) {
                    p_oSubmenu._submenuHideDelayTimer = Rui.later(p_nHideDelay, p_oSubmenu, function() {
                        this.hide();
                    });
                }
                else {
                    p_oSubmenu.hide();
                }
            });
        },
        _disableScrollHeader: function() {
            if (!this._bHeaderDisabled) {
                Dom.addClass(this.header, _TOP_SCROLLBAR_DISABLED);
                this._bHeaderDisabled = true;
            }
        },
        _disableScrollFooter: function() {
            if (!this._bFooterDisabled) {
                Dom.addClass(this.footer, _BOTTOM_SCROLLBAR_DISABLED);
                this._bFooterDisabled = true;
            }
        },
        _enableScrollHeader: function() {
            if (this._bHeaderDisabled) {
                Dom.removeClass(this.header, _TOP_SCROLLBAR_DISABLED);
                this._bHeaderDisabled = false;
            }
        },
        _enableScrollFooter: function() {
            if (this._bFooterDisabled) {
                Dom.removeClass(this.footer, _BOTTOM_SCROLLBAR_DISABLED);
                this._bFooterDisabled = false;
            }
        },
        _onMouseOver: function(p_sType, p_aArgs) {
            var oEvent = p_aArgs[0],
            oItem = p_aArgs[1],
            oTarget = Event.getTarget(oEvent),
            oRoot = this.getRoot(),
            oSubmenuHideDelayTimer = this._submenuHideDelayTimer,
            oParentMenu,
            nShowDelay,
            bShowDelay,
            oActiveItem,
            oItemCfg,
            oSubmenu;
            var showSubmenu = function() {
                if (this.parent.cfg.getProperty(_SELECTED)) {
                    this.show();
                }
            };
            if (!this._bStopMouseEventHandlers) {
                if (!this._bHandledMouseOverEvent && (oTarget == this.element ||
                        Dom.isAncestor(this.element, oTarget))) {
                    if (this._useHideDelay) {
                        this._cancelHideDelay();
                    }
                    this._nCurrentMouseX = 0;
                    Event.on(this.element, _MOUSEMOVE, this._onMouseMove, this, true);
                    if (!(oItem && Dom.isAncestor(oItem.element, Event.getRelatedTarget(oEvent)))) {
                        this.clearActiveItem();
                    }
                    if (this.parent && oSubmenuHideDelayTimer) {
                        oSubmenuHideDelayTimer.cancel();
                        this.parent.cfg.setProperty(_SELECTED, true);
                        oParentMenu = this.parent.parent;
                        oParentMenu._bHandledMouseOutEvent = true;
                        oParentMenu._bHandledMouseOverEvent = false;
                    }
                    this._bHandledMouseOverEvent = true;
                    this._bHandledMouseOutEvent = false;
                }
                if (oItem && !oItem.handledMouseOverEvent && !oItem.cfg.getProperty(_DISABLED) &&
                        (oTarget == oItem.element || Dom.isAncestor(oItem.element, oTarget))) {
                    nShowDelay = this.cfg.getProperty(_SHOW_DELAY);
                    bShowDelay = (nShowDelay > 0);
                    if (bShowDelay) {
                        this._cancelShowDelay();
                    }
                    oActiveItem = this.activeItem;
                    if (oActiveItem) {
                        oActiveItem.cfg.setProperty(_SELECTED, false);
                    }
                    oItemCfg = oItem.cfg;
                    oItemCfg.setProperty(_SELECTED, true);
                    if (this.hasFocus() || oRoot._hasFocus) {
                        oItem.focus();
                        oRoot._hasFocus = false;
                    }
                    if (this.cfg.getProperty(_AUTO_SUBMENU_DISPLAY)) {
                        oSubmenu = oItemCfg.getProperty(_SUBMENU);
                        if (oSubmenu) {
                            if (bShowDelay) {
                                oRoot._showDelayTimer =
                                    Rui.later(oRoot.cfg.getProperty(_SHOW_DELAY), oSubmenu, showSubmenu);
                            }
                            else {
                                oSubmenu.show();
                            }
                        }
                    }
                    oItem.handledMouseOverEvent = true;
                    oItem.handledMouseOutEvent = false;
                }
            }
        },
        _onMouseOut: function(p_sType, p_aArgs) {
            var oEvent = p_aArgs[0],
            oItem = p_aArgs[1],
            oRelatedTarget = Event.getRelatedTarget(oEvent),
            bMovingToSubmenu = false,
            oItemCfg,
            oSubmenu,
            nSubmenuHideDelay,
            nShowDelay;
            if (!this._bStopMouseEventHandlers) {
                if (oItem && !oItem.cfg.getProperty(_DISABLED)) {
                    oItemCfg = oItem.cfg;
                    oSubmenu = oItemCfg.getProperty(_SUBMENU);
                    if (oSubmenu && (oRelatedTarget == oSubmenu.element ||
                            Dom.isAncestor(oSubmenu.element, oRelatedTarget))) {
                        bMovingToSubmenu = true;
                    }
                    if (!oItem.handledMouseOutEvent && ((oRelatedTarget != oItem.element &&
                            !Dom.isAncestor(oItem.element, oRelatedTarget)) || bMovingToSubmenu)) {
                        if (!bMovingToSubmenu) {
                            oItem.cfg.setProperty(_SELECTED, false);
                            if (oSubmenu) {
                                nSubmenuHideDelay = this.cfg.getProperty(_SUBMENU_HIDE_DELAY);
                                nShowDelay = this.cfg.getProperty(_SHOW_DELAY);
                                if (!(this instanceof Rui.ui.menu.LMenuBar) && nSubmenuHideDelay > 0 &&
                                        nShowDelay >= nSubmenuHideDelay) {
                                    this._execSubmenuHideDelay(oSubmenu, Event.getPageX(oEvent),
                                            nSubmenuHideDelay);
                                }
                                else {
                                    oSubmenu.hide();
                                }
                            }
                        }
                        oItem.handledMouseOutEvent = true;
                        oItem.handledMouseOverEvent = false;
                    }
                }
                if (!this._bHandledMouseOutEvent && ((oRelatedTarget != this.element &&
                        !Dom.isAncestor(this.element, oRelatedTarget)) || bMovingToSubmenu)) {
                    if (this._useHideDelay) {
                        this._execHideDelay();
                    }
                    Event.removeListener(this.element, _MOUSEMOVE, this._onMouseMove);
                    this._nCurrentMouseX = Event.getPageX(oEvent);
                    this._bHandledMouseOutEvent = true;
                    this._bHandledMouseOverEvent = false;
                }
            }
        },
        _onMouseMove: function(p_oEvent, p_oMenu) {
            if (!this._bStopMouseEventHandlers) {
                this._nCurrentMouseX = Event.getPageX(p_oEvent);
            }
        },
        _onClick: function(p_sType, p_aArgs) {
            var oEvent = p_aArgs[0],
            oItem = p_aArgs[1],
            bInMenuAnchor = false,
            oSubmenu,
            oMenu,
            oRoot,
            sId,
            sURL,
            nHashPos,
            nLen;
            var hide = function() {
                if (!((UA.gecko && this.platform == _WINDOWS) && oEvent.button > 0)) {
                    oRoot = this.getRoot();
                    if (oRoot instanceof Rui.ui.menu.LMenuBar ||
                            oRoot.cfg.getProperty(_POSITION) == _STATIC) {
                        oRoot.clearActiveItem();
                    }
                    else {
                        oRoot.hide();
                    }
                }
            };
            if (oItem) {
                if (oItem.cfg.getProperty(_DISABLED)) {
                    Event.preventDefault(oEvent);
                    hide.call(this);
                }
                else {
                    oSubmenu = oItem.cfg.getProperty(_SUBMENU);
                    sURL = oItem.cfg.getProperty(_URL);
                    if (sURL) {
                        nHashPos = sURL.indexOf(_HASH);
                        nLen = sURL.length;
                        if (nHashPos != -1) {
                            sURL = sURL.substr(nHashPos, nLen);
                            nLen = sURL.length;
                            if (nLen > 1) {
                                sId = sURL.substr(1, nLen);
                                oMenu = Rui.ui.menu.LMenuManager.getMenu(sId);
                                if (oMenu) {
                                    bInMenuAnchor =
                                        (this.getRoot() === oMenu.getRoot());
                                }
                            }
                            else if (nLen === 1) {
                                bInMenuAnchor = true;
                            }
                        }
                    }
                    if (bInMenuAnchor && !oItem.cfg.getProperty(_TARGET)) {
                        Event.preventDefault(oEvent);
                        if (UA.webkit) {
                            oItem.focus();
                        }
                        else {
                            oItem.fireEvent('focus', {target:this}); 
                        }
                    }
                    if (!oSubmenu && !this.cfg.getProperty(_KEEP_OPEN)) {
                        hide.call(this);
                    }
                }
            }
        },
        _onKeyDown: function(p_sType, p_aArgs) {
            var oEvent = p_aArgs[0],
            oItem = p_aArgs[1],
            oSubmenu,
            oItemCfg,
            oParentItem,
            oRoot,
            oNextItem,
            oBody,
            nBodyScrollTop,
            nBodyOffsetHeight,
            aItems,
            nItems,
            nNextItemOffsetTop,
            nScrollTarget,
            oParentMenu;
            if (this._useHideDelay) {
                this._cancelHideDelay();
            }
            function stopMouseEventHandlers() {
                this._bStopMouseEventHandlers = true;
                Rui.later(10, this, function() {
                    this._bStopMouseEventHandlers = false;
                });
            }
            if (oItem && !oItem.cfg.getProperty(_DISABLED)) {
                oItemCfg = oItem.cfg;
                oParentItem = this.parent;
                switch (oEvent.keyCode) {
                case 38:    
                case 40:    
                    oNextItem = (oEvent.keyCode == 38) ?
                            oItem.getPreviousEnabledSibling() :
                                oItem.getNextEnabledSibling();
                            if (oNextItem) {
                                this.clearActiveItem();
                                oNextItem.cfg.setProperty(_SELECTED, true);
                                oNextItem.focus();
                                if (this.cfg.getProperty(_MAX_HEIGHT) > 0) {
                                    oBody = this.body;
                                    nBodyScrollTop = oBody.scrollTop;
                                    nBodyOffsetHeight = oBody.offsetHeight;
                                    aItems = this.getItems();
                                    nItems = aItems.length - 1;
                                    nNextItemOffsetTop = oNextItem.element.offsetTop;
                                    if (oEvent.keyCode == 40) {    
                                        if (nNextItemOffsetTop >= (nBodyOffsetHeight + nBodyScrollTop)) {
                                            oBody.scrollTop = nNextItemOffsetTop - nBodyOffsetHeight;
                                        }
                                        else if (nNextItemOffsetTop <= nBodyScrollTop) {
                                            oBody.scrollTop = 0;
                                        }
                                        if (oNextItem == aItems[nItems]) {
                                            oBody.scrollTop = oNextItem.element.offsetTop;
                                        }
                                    }
                                    else {  
                                        if (nNextItemOffsetTop <= nBodyScrollTop) {
                                            oBody.scrollTop = nNextItemOffsetTop - oNextItem.element.offsetHeight;
                                        }
                                        else if (nNextItemOffsetTop >= (nBodyScrollTop + nBodyOffsetHeight)) {
                                            oBody.scrollTop = nNextItemOffsetTop;
                                        }
                                        if (oNextItem == aItems[0]) {
                                            oBody.scrollTop = 0;
                                        }
                                    }
                                    nBodyScrollTop = oBody.scrollTop;
                                    nScrollTarget = oBody.scrollHeight - oBody.offsetHeight;
                                    if (nBodyScrollTop === 0) {
                                        this._disableScrollHeader();
                                        this._enableScrollFooter();
                                    }
                                    else if (nBodyScrollTop == nScrollTarget) {
                                        this._enableScrollHeader();
                                        this._disableScrollFooter();
                                    }
                                    else {
                                        this._enableScrollHeader();
                                        this._enableScrollFooter();
                                    }
                                }
                            }
                            Event.preventDefault(oEvent);
                            stopMouseEventHandlers();
                            break;
                case 39:    
                    oSubmenu = oItemCfg.getProperty(_SUBMENU);
                    if (oSubmenu) {
                        if (!oItemCfg.getProperty(_SELECTED)) {
                            oItemCfg.setProperty(_SELECTED, true);
                        }
                        oSubmenu.show();
                        oSubmenu.setInitialFocus();
                        oSubmenu.setInitialSelection();
                    }
                    else {
                        oRoot = this.getRoot();
                        if (oRoot instanceof Rui.ui.menu.LMenuBar) {
                            oNextItem = oRoot.activeItem.getNextEnabledSibling();
                            if (oNextItem) {
                                oRoot.clearActiveItem();
                                oNextItem.cfg.setProperty(_SELECTED, true);
                                oSubmenu = oNextItem.cfg.getProperty(_SUBMENU);
                                if (oSubmenu) {
                                    oSubmenu.show();
                                    oSubmenu.setInitialFocus();
                                }
                                else {
                                    oNextItem.focus();
                                }
                            }
                        }
                    }
                    Event.preventDefault(oEvent);
                    stopMouseEventHandlers();
                    break;
                case 37:    
                    if (oParentItem) {
                        oParentMenu = oParentItem.parent;
                        if (oParentMenu instanceof Rui.ui.menu.LMenuBar) {
                            oNextItem =
                                oParentMenu.activeItem.getPreviousEnabledSibling();
                            if (oNextItem) {
                                oParentMenu.clearActiveItem();
                                oNextItem.cfg.setProperty(_SELECTED, true);
                                oSubmenu = oNextItem.cfg.getProperty(_SUBMENU);
                                if (oSubmenu) {
                                    oSubmenu.show();
                                    oSubmenu.setInitialFocus();
                                }
                                else {
                                    oNextItem.focus();
                                }
                            }
                        }
                        else {
                            this.hide();
                            oParentItem.focus();
                        }
                    }
                    Event.preventDefault(oEvent);
                    stopMouseEventHandlers();
                    break;
                }
            }
            if (oEvent.keyCode == 27) { 
                if (this.cfg.getProperty(_POSITION) == _DYNAMIC) {
                    this.hide();
                    if (this.parent) {
                        this.parent.focus();
                    }
                }
                else if (this.activeItem) {
                    oSubmenu = this.activeItem.cfg.getProperty(_SUBMENU);
                    if (oSubmenu && oSubmenu.cfg.getProperty(_VISIBLE)) {
                        oSubmenu.hide();
                        this.activeItem.focus();
                    }
                    else {
                        this.activeItem.blur();
                        this.activeItem.cfg.setProperty(_SELECTED, false);
                    }
                }
                Event.preventDefault(oEvent);
            }
        },
        _onKeyPress: function(p_sType, p_aArgs) {
            var oEvent = p_aArgs[0];
            if (oEvent.keyCode == 40 || oEvent.keyCode == 38) {
                Event.preventDefault(oEvent);
            }
        },
        _onBlur: function(p_sType, p_aArgs) {
            if (this._hasFocus) {
                this._hasFocus = false;
            }
        },
        _onYChange: function(p_sType, p_aArgs) {
            var oParent = this.parent,
            nScrollTop,
            oIFrame,
            nY;
            if (oParent) {
                nScrollTop = oParent.parent.body.scrollTop;
                if (nScrollTop > 0) {
                    nY = (this.cfg.getProperty(_Y) - nScrollTop);
                    Dom.setY(this.element, nY);
                    oIFrame = this.iframe;
                    if (oIFrame) {
                        Dom.setY(oIFrame, nY);
                    }
                    this.cfg.setProperty(_Y, nY, true);
                }
            }
        },
        _onScrollTargetMouseOver: function(p_oEvent, p_oMenu) {
            var oBodyScrollTimer = this._bodyScrollTimer;
            if (oBodyScrollTimer) {
                oBodyScrollTimer.cancel();
            }
            this._cancelHideDelay();
            var oTarget = Event.getTarget(p_oEvent),
            oBody = this.body,
            nScrollIncrement = this.cfg.getProperty(_SCROLL_INCREMENT),
            nScrollTarget,
            fnScrollFunction;
            function scrollBodyDown() {
                var nScrollTop = oBody.scrollTop;
                if (nScrollTop < nScrollTarget) {
                    oBody.scrollTop = (nScrollTop + nScrollIncrement);
                    this._enableScrollHeader();
                }
                else {
                    oBody.scrollTop = nScrollTarget;
                    this._bodyScrollTimer.cancel();
                    this._disableScrollFooter();
                }
            }
            function scrollBodyUp() {
                var nScrollTop = oBody.scrollTop;
                if (nScrollTop > 0) {
                    oBody.scrollTop = (nScrollTop - nScrollIncrement);
                    this._enableScrollFooter();
                }
                else {
                    oBody.scrollTop = 0;
                    this._bodyScrollTimer.cancel();
                    this._disableScrollHeader();
                }
            }
            if (Dom.hasClass(oTarget, _HD)) {
                fnScrollFunction = scrollBodyUp;
            }
            else {
                nScrollTarget = oBody.scrollHeight - oBody.offsetHeight;
                fnScrollFunction = scrollBodyDown;
            }
            this._bodyScrollTimer = Rui.later(10, this, fnScrollFunction, null, true);
        },
        _onScrollTargetMouseOut: function(p_oEvent, p_oMenu) {
            var oBodyScrollTimer = this._bodyScrollTimer;
            if (oBodyScrollTimer) {
                oBodyScrollTimer.cancel();
            }
            this._cancelHideDelay();
        },
        _onInit: function(e) {
            this.cfg.subscribeToConfigEvent(_VISIBLE, this._onVisibleChange);
            var bRootMenu = !this.parent,
            bLazyLoad = this.lazyLoad;
            this._insertBody(""); 
            if (((bRootMenu && !bLazyLoad) ||
                    (bRootMenu && (this.cfg.getProperty(_VISIBLE) ||
                            this.cfg.getProperty(_POSITION) == _STATIC)) ||
                            (!bRootMenu && !bLazyLoad)) && this.getItemGroups().length === 0) {
                if (this.srcElement) {
                    this._initSubTree();
                }
                if (this.itemData) {
                    this.addItems(this.itemData);
                }
            }
            else if (bLazyLoad) {
                this.cfg.fireQueue();
            }
        },
        _onBeforeRender: function(e) {
            var oEl = this.element,
            nListElements = this._aListElements.length,
            bFirstList = true,
            i = 0,
            oUL,
            oGroupTitle;
            if (nListElements > 0) {
                do {
                    oUL = this._aListElements[i];
                    if (oUL) {
                        if (bFirstList) {
                            Dom.addClass(oUL, _FIRST_OF_TYPE);
                            bFirstList = false;
                        }
                        if (!Dom.isAncestor(oEl, oUL)) {
                            this.appendToBody(oUL);
                        }
                        oGroupTitle = this._aGroupTitleElements[i];
                        if (oGroupTitle) {
                            if (!Dom.isAncestor(oEl, oGroupTitle)) {
                                oUL.parentNode.insertBefore(oGroupTitle, oUL);
                            }
                            Dom.addClass(oUL, _HAS_TITLE);
                        }
                    }
                    i++;
                }
                while (i < nListElements);
            }
        },
        _onRender: function(p_sType, p_aArgs) {
            if (this.cfg.getProperty(_POSITION) == _DYNAMIC) {
                if (!this.cfg.getProperty(_VISIBLE)) {
                    this.positionOffScreen();
                }
            }
        },
        _onBeforeShow: function(e) {
            var nOptions,n,
            oSrcElement,
            oContainer = this.cfg.getProperty(_CONTAINER);
            if (this.lazyLoad && this.getItemGroups().length === 0) {
                if (this.srcElement) {
                    this._initSubTree();
                }
                if (this.itemData) {
                    if (this.parent && this.parent.parent &&
                            this.parent.parent.srcElement &&
                            this.parent.parent.srcElement.tagName.toUpperCase() ==_SELECT) {
                        nOptions = this.itemData.length;
                        for (n = 0; n < nOptions; n++) {
                            if (this.itemData[n].tagName) {
                                this.addItem((new this.ITEM_TYPE(this.itemData[n],{parent:this})));
                            }
                        }
                    }
                    else {
                        this.addItems(this.itemData);
                    }
                }
                oSrcElement = this.srcElement;
                if (oSrcElement) {
                    if (oSrcElement.tagName.toUpperCase() == _SELECT) {
                        if (Dom.inDocument(oSrcElement)) {
                            this.render(oSrcElement.parentNode);
                        }
                        else {
                            this.render(oContainer);
                        }
                    }
                    else {
                        this.render();
                    }
                }
                else {
                    if (this.parent) {
                        this.render(this.parent.element);
                    }
                    else {
                        this.render(oContainer);
                    }
                }
            }
            var oParent = this.parent,
            aAlignment;
            if (!oParent && this.cfg.getProperty(_POSITION) == _DYNAMIC) {
                this.cfg.refireEvent(_XY);
            }
            if (oParent) {
                aAlignment = oParent.parent.cfg.getProperty(_SUBMENU_ALIGNMENT);
                this.cfg.setProperty(_CONTEXT, [oParent.element, aAlignment[0], aAlignment[1]]);
                this.align();
            }
        },
        getConstrainedY: function(y) {
            var oMenu = this,
            aContext = oMenu.cfg.getProperty(_CONTEXT),
            nInitialMaxHeight = oMenu.cfg.getProperty(_MAX_HEIGHT),
            nMaxHeight,
            oOverlapPositions = {
                "trbr": true,
                "tlbl": true,
                "bltl": true,
                "brtr": true
            },
            bPotentialContextOverlap = (aContext && oOverlapPositions[aContext[1] + aContext[2]]),
            oMenuEl = oMenu.element,
            nMenuOffsetHeight = oMenuEl.offsetHeight,
            nViewportOffset = Panel.VIEWPORT_OFFSET,
            viewPortHeight = Dom.getViewportHeight(),
            scrollY = Dom.getDocumentScrollTop(),
            bCanConstrain =
                (oMenu.cfg.getProperty(_MIN_SCROLL_HEIGHT) + nViewportOffset < viewPortHeight),
                nAvailableHeight,
                oContextEl,
                nContextElY,
                nContextElHeight,
                bFlipped = false,
                nTopRegionHeight,
                nBottomRegionHeight,
                topConstraint = scrollY + nViewportOffset,
                bottomConstraint = scrollY + viewPortHeight - nMenuOffsetHeight - nViewportOffset,
                yNew = y;
            var flipVertical = function() {
                var nNewY;
                if ((oMenu.cfg.getProperty(_Y) - scrollY) > nContextElY) {
                    nNewY = (nContextElY - nMenuOffsetHeight);
                }
                else {  
                    nNewY = (nContextElY + nContextElHeight);
                }
                oMenu.cfg.setProperty(_Y, (nNewY + scrollY), true);
                return nNewY;
            };
            var getDisplayRegionHeight = function() {
                if ((oMenu.cfg.getProperty(_Y) - scrollY) > nContextElY) {
                    return (nBottomRegionHeight - nViewportOffset);
                }
                else {  
                    return (nTopRegionHeight - nViewportOffset);
                }
            };
            var alignY = function() {
                var nNewY;
                if ((oMenu.cfg.getProperty(_Y) - scrollY) > nContextElY) {
                    nNewY = (nContextElY + nContextElHeight);
                }
                else {
                    nNewY = (nContextElY - oMenuEl.offsetHeight);
                }
                oMenu.cfg.setProperty(_Y, (nNewY + scrollY), true);
            };
            var resetMaxHeight = function() {
                oMenu._setScrollHeight(this.cfg.getProperty(_MAX_HEIGHT));
            };
            var setVerticalPosition = function() {
                var nDisplayRegionHeight = getDisplayRegionHeight(),
                bMenuHasItems = (oMenu.getItems().length > 0),
                nMenuMinScrollHeight,
                fnReturnVal;
                if (nMenuOffsetHeight > nDisplayRegionHeight) {
                    nMenuMinScrollHeight =
                        bMenuHasItems ? oMenu.cfg.getProperty(_MIN_SCROLL_HEIGHT) : nMenuOffsetHeight;
                        if ((nDisplayRegionHeight > nMenuMinScrollHeight) && bMenuHasItems) {
                            nMaxHeight = nDisplayRegionHeight;
                        }
                        else {
                            nMaxHeight = nInitialMaxHeight;
                        }
                        oMenu._setScrollHeight(nMaxHeight);
                        oMenu.on('hide', resetMaxHeight, this, true);
                        alignY();
                        if (nDisplayRegionHeight < nMenuMinScrollHeight) {
                            if (bFlipped) {
                                flipVertical();
                            }
                            else {
                                flipVertical();
                                bFlipped = true;
                                fnReturnVal = setVerticalPosition();
                            }
                        }
                }
                else if (nMaxHeight && (nMaxHeight !== nInitialMaxHeight)) {
                    oMenu._setScrollHeight(nInitialMaxHeight);
                    oMenu.on('hide', resetMaxHeight, this, true);
                    alignY();
                }
                return fnReturnVal;
            };
            if (y < topConstraint || y > bottomConstraint) {
                if (bCanConstrain) {
                    if (oMenu.cfg.getProperty(_PREVENT_CONTEXT_OVERLAP) && bPotentialContextOverlap) {
                        oContextEl = aContext[0];
                        nContextElHeight = oContextEl.offsetHeight;
                        nContextElY = (Dom.getY(oContextEl) - scrollY);
                        nTopRegionHeight = nContextElY;
                        nBottomRegionHeight = (viewPortHeight - (nContextElY + nContextElHeight));
                        setVerticalPosition();
                        yNew = oMenu.cfg.getProperty(_Y);
                    }
                    else if (!(oMenu instanceof Rui.ui.menu.LMenuBar) &&
                            nMenuOffsetHeight >= viewPortHeight) {
                        nAvailableHeight = (viewPortHeight - (nViewportOffset * 2));
                        if (nAvailableHeight > oMenu.cfg.getProperty(_MIN_SCROLL_HEIGHT)) {
                            oMenu._setScrollHeight(nAvailableHeight);
                            oMenu.on('hide', resetMaxHeight, this, true);
                            alignY();
                            yNew = oMenu.cfg.getProperty(_Y);
                        }
                    }
                    else {
                        if (y < topConstraint) {
                            yNew = topConstraint;
                        } else if (y > bottomConstraint) {
                            yNew = bottomConstraint;
                        }
                    }
                }
                else {
                    yNew = nViewportOffset + scrollY;
                }
            }
            return yNew;
        },
        _onHide: function(p_sType, p_aArgs) {
            if (this.cfg.getProperty(_POSITION) === _DYNAMIC) {
                this.positionOffScreen();
            }
        },
        _onShow: function(p_sType, p_aArgs) {
            var oParent = this.parent,
            oParentMenu,
            oElement,
            nOffsetWidth,
            sWidth;
            function disableAutoSubmenuDisplay(p_oEvent) {
                var oTarget;
                if (p_oEvent.type == _MOUSEDOWN || (p_oEvent.type == _KEYDOWN && p_oEvent.keyCode == 27)) {
                    oTarget = Event.getTarget(p_oEvent);
                    if (oTarget != oParentMenu.element || !Dom.isAncestor(oParentMenu.element, oTarget)) {
                        oParentMenu.cfg.setProperty(_AUTO_SUBMENU_DISPLAY, false);
                        Event.removeListener(document, _MOUSEDOWN, disableAutoSubmenuDisplay);
                        Event.removeListener(document, _KEYDOWN, disableAutoSubmenuDisplay);
                    }
                }
            }
            function onSubmenuHide(p_sType, p_aArgs, p_sWidth) {
                this.cfg.setProperty(_WIDTH, _EMPTY_STRING);
            }
            if (oParent) {
                oParentMenu = oParent.parent;
                if (!oParentMenu.cfg.getProperty(_AUTO_SUBMENU_DISPLAY) &&
                        (oParentMenu instanceof Rui.ui.menu.LMenuBar ||
                                oParentMenu.cfg.getProperty(_POSITION) == _STATIC)) {
                    oParentMenu.cfg.setProperty(_AUTO_SUBMENU_DISPLAY, true);
                    Event.on(document, _MOUSEDOWN, disableAutoSubmenuDisplay);
                    Event.on(document, _KEYDOWN, disableAutoSubmenuDisplay);
                }
                if ((this.cfg.getProperty("x") < oParentMenu.cfg.getProperty("x")) &&
                        (UA.gecko && UA.gecko < 1.9) && !this.cfg.getProperty(_WIDTH)) {
                    oElement = this.element;
                    nOffsetWidth = oElement.offsetWidth;
                    oElement.style.width = nOffsetWidth + _PX;
                    sWidth = (nOffsetWidth - (oElement.offsetWidth - nOffsetWidth)) + _PX;
                    this.cfg.setProperty(_WIDTH, sWidth);
                    this.on('hide', onSubmenuHide, sWidth, this, true);
                }
            }
        },
        show: function (isAnim) {
            this.cfg.setProperty("visible", true);
            if(Rui.useAccessibility())
                this.el.setAttribute('aria-hidden', 'false');
            if(isAnim === true) {
                var left = Rui.util.LDom.getX(this.element);
                Rui.util.LDom.setX(this.element, 0);
                new Rui.fx.LAnim({
                    el: this.element.id, 
                    attributes: {
                        left: {from:0, to:left}
                    }, 
                    duration: 0.2
                }).animate();
            } 
        },
        _onBeforeHide: function(p_sType, p_aArgs) {
            var oActiveItem = this.activeItem,
            oRoot = this.getRoot(),
            oConfig,
            oSubmenu;
            if (oActiveItem) {
                oConfig = oActiveItem.cfg;
                oConfig.setProperty(_SELECTED, false);
                oSubmenu = oConfig.getProperty(_SUBMENU);
                if (oSubmenu) {
                    oSubmenu.hide();
                }
            }
            if (UA.msie && this.cfg.getProperty(_POSITION) === _DYNAMIC && this.parent) {
                oRoot._hasFocus = this.hasFocus();
            }
            if (oRoot == this) {
                oRoot.blur();
            }
        },
        _onParentMenuConfigChange: function(p_sType, p_aArgs, p_oSubmenu) {
            var sPropertyName = p_aArgs[0][0],
            oPropertyValue = p_aArgs[0][1];
            switch (sPropertyName) {
            case _IFRAME:
            case _CONSTRAIN_TO_VIEWPORT:
            case _HIDE_DELAY:
            case _SHOW_DELAY:
            case _SUBMENU_HIDE_DELAY:
            case _CLICK_TO_HIDE:
            case _EFFECT:
            case _CLASSNAME:
            case _SCROLL_INCREMENT:
            case _MAX_HEIGHT:
            case _MIN_SCROLL_HEIGHT:
            case _MONITOR_RESIZE:
            case _SHADOW:
            case _PREVENT_CONTEXT_OVERLAP:
                p_oSubmenu.cfg.setProperty(sPropertyName, oPropertyValue);
                break;
            case _SUBMENU_ALIGNMENT:
                if (!(this.parent.parent instanceof Rui.ui.menu.LMenuBar)) {
                    p_oSubmenu.cfg.setProperty(sPropertyName, oPropertyValue);
                }
                break;
            }
        },
        _onParentMenuRender: function(p_sType, p_aArgs, p_oSubmenu) {
            var oParentMenu = p_oSubmenu.parent.parent, oParentCfg = oParentMenu.cfg,
            oConfig = {
                    constraintoviewport: oParentCfg.getProperty(_CONSTRAIN_TO_VIEWPORT),
                    xy: [0, 0],
                    clicktohide: oParentCfg.getProperty(_CLICK_TO_HIDE),
                    effect: oParentCfg.getProperty(_EFFECT),
                    showdelay: oParentCfg.getProperty(_SHOW_DELAY),
                    hidedelay: oParentCfg.getProperty(_HIDE_DELAY),
                    submenuhidedelay: oParentCfg.getProperty(_SUBMENU_HIDE_DELAY),
                    classname: oParentCfg.getProperty(_CLASSNAME),
                    scrollincrement: oParentCfg.getProperty(_SCROLL_INCREMENT),
                    maxheight: oParentCfg.getProperty(_MAX_HEIGHT),
                    minscrollheight: oParentCfg.getProperty(_MIN_SCROLL_HEIGHT),
                    iframe: oParentCfg.getProperty(_IFRAME),
                    shadow: oParentCfg.getProperty(_SHADOW),
                    preventcontextoverlap: oParentCfg.getProperty(_PREVENT_CONTEXT_OVERLAP),
                    monitorresize: oParentCfg.getProperty(_MONITOR_RESIZE)
            },
            oLI;
            if (!(oParentMenu instanceof Rui.ui.menu.LMenuBar)) {
                oConfig[_SUBMENU_ALIGNMENT] = oParentCfg.getProperty(_SUBMENU_ALIGNMENT);
            }
            p_oSubmenu.cfg.applyConfig(oConfig);
            if (!this.lazyLoad) {
                oLI = this.parent.element;
                if (this.element.parentNode == oLI) {
                    this.render();
                }
                else {
                    this.render(oLI);
                }
            }
        },
        _onMenuItemDestroy: function(p_sType, p_aArgs, p_oItem) {
            this._removeItemFromGroupByValue(p_oItem.groupIndex, p_oItem);
        },
        _onMenuItemConfigChange: function(p_sType, p_aArgs, p_oItem) {
            var sPropertyName = p_aArgs[0][0],
            oPropertyValue = p_aArgs[0][1],
            oSubmenu;
            switch (sPropertyName) {
            case _SELECTED:
                if (oPropertyValue === true) {
                    this.activeItem = p_oItem;
                }
                break;
            case _SUBMENU:
                oSubmenu = p_aArgs[0][1];
                if (oSubmenu) {
                    this._configureSubmenu(p_oItem);
                }
                break;
            }
        },
        configVisible: function(p_sType, p_aArgs, p_oMenu) {
            var bVisible, sDisplay;
            if (this.cfg.getProperty(_POSITION) == _DYNAMIC) {
                LMenu.superclass.configVisible.call(this, p_sType, p_aArgs, p_oMenu);
            }
            else {
                bVisible = p_aArgs[0];
                sDisplay = Dom.getStyle(this.element, _DISPLAY);
                Dom.removeClass(this.element, "L-hidden");
                if (bVisible) {
                    if (sDisplay != _BLOCK) {
                        this.fireEvent('beforeShow', {target:this}); 
                        Dom.setStyle(this.element, _DISPLAY, _BLOCK);
                        if(Rui.useAccessibility())
                            this.element.setAttribute('aria-hidden', 'false');
                        this.fireEvent('show', {target:this});
                    }
                }
                else {
                    if (sDisplay == _BLOCK) {
                        this.fireEvent('beforeHide', {target:this});
                        Dom.setStyle(this.element, _DISPLAY, _NONE);
                        if(Rui.useAccessibility())
                            this.element.setAttribute('aria-hidden', 'true');
                        this.fireEvent('hide', {target:this});
                    }
                }
            }
        },
        configPosition: function(p_sType, p_aArgs, p_oMenu) {
            var oElement = this.element, 
            sCSSPosition = p_aArgs[0] == _STATIC ? _STATIC : _ABSOLUTE,
                    oCfg = this.cfg, nZIndex;
            Dom.setStyle(oElement, _POSITION, sCSSPosition);
            if (sCSSPosition == _STATIC) {
                Dom.setStyle(oElement, _DISPLAY, _BLOCK);
                oCfg.setProperty(_VISIBLE, true);
                if(Rui.useAccessibility())
                    oElement.setAttribute('aria-hidden', 'false');
            }
            else {
                Dom.addClass(oElement, "L-hidden");
                if(Rui.useAccessibility())
                    oElement.setAttribute('aria-hidden', 'true');
            }
            if (sCSSPosition == _ABSOLUTE) {
                nZIndex = oCfg.getProperty(_ZINDEX);
                if (!nZIndex || nZIndex === 0) {
                    oCfg.setProperty(_ZINDEX, 1);
                }
            }
        },
        configIframe: function(p_sType, p_aArgs, p_oMenu) {
            if (this.cfg.getProperty(_POSITION) == _DYNAMIC) {
                LMenu.superclass.configIframe.call(this, p_sType, p_aArgs, p_oMenu);
            }
        },
        configHideDelay: function(p_sType, p_aArgs, p_oMenu) {
            var nHideDelay = p_aArgs[0];
            this._useHideDelay = (nHideDelay > 0);
        },
        configContainer: function(p_sType, p_aArgs, p_oMenu) {
            var oElement = p_aArgs[0];
            if (Rui.isString(oElement)) {
                this.cfg.setProperty(_CONTAINER, Dom.get(oElement), true);
            }
        },
        _clearSetWidthFlag: function() {
            this._widthSetForScroll = false;
            this.cfg.unsubscribeFromConfigEvent(_WIDTH, this._clearSetWidthFlag);
        },
        _setScrollHeight: function(p_nScrollHeight) {
            var nScrollHeight = p_nScrollHeight,
            bRefireIFrameAndShadow = false,
            bSetWidth = false,
            oElement,
            oBody,
            oHeader,
            oFooter,
            fnMouseOver,
            fnMouseOut,
            nMinScrollHeight,
            nHeight,
            nOffsetWidth,
            sWidth;
            if (this.getItems().length > 0) {
                oElement = this.element;
                oBody = this.body;
                oHeader = this.header;
                oFooter = this.footer;
                fnMouseOver = this._onScrollTargetMouseOver;
                fnMouseOut = this._onScrollTargetMouseOut;
                nMinScrollHeight = this.cfg.getProperty(_MIN_SCROLL_HEIGHT);
                if (nScrollHeight > 0 && nScrollHeight < nMinScrollHeight) {
                    nScrollHeight = nMinScrollHeight;
                }
                Dom.setStyle(oBody, _HEIGHT, _EMPTY_STRING);
                Dom.removeClass(oBody, _RUI_MENU_BODY_SCROLLED);
                oBody.scrollTop = 0;
                bSetWidth = ((UA.gecko && UA.gecko < 1.9) || UA.msie);
                if (nScrollHeight > 0 && bSetWidth && !this.cfg.getProperty(_WIDTH)) {
                    nOffsetWidth = oElement.offsetWidth;
                    oElement.style.width = nOffsetWidth + _PX;
                    sWidth = (nOffsetWidth - (oElement.offsetWidth - nOffsetWidth)) + _PX;
                    this.cfg.unsubscribeFromConfigEvent(_WIDTH, this._clearSetWidthFlag);
                    this.cfg.setProperty(_WIDTH, sWidth);
                    this._widthSetForScroll = true;
                    this.cfg.subscribeToConfigEvent(_WIDTH, this._clearSetWidthFlag);
                }
                if (nScrollHeight > 0 && (!oHeader && !oFooter)) {
                    this.setHeader(_NON_BREAKING_SPACE);
                    this.setFooter(_NON_BREAKING_SPACE);
                    oHeader = this.header;
                    oFooter = this.footer;
                    Dom.addClass(oHeader, _TOP_SCROLLBAR);
                    Dom.addClass(oFooter, _BOTTOM_SCROLLBAR);
                    oElement.insertBefore(oHeader, oBody);
                    oElement.appendChild(oFooter);
                }
                nHeight = nScrollHeight;
                if (oHeader && oFooter) {
                    nHeight = (nHeight - (oHeader.offsetHeight + oFooter.offsetHeight));
                }
                if ((nHeight > 0) && (oBody.offsetHeight > nScrollHeight)) {
                    Dom.addClass(oBody, _RUI_MENU_BODY_SCROLLED);
                    Dom.setStyle(oBody, _HEIGHT, (nHeight + _PX));
                    if (!this._hasScrollEventHandlers) {
                        Event.on(oHeader, _MOUSEOVER, fnMouseOver, this, true);
                        Event.on(oHeader, _MOUSEOUT, fnMouseOut, this, true);
                        Event.on(oFooter, _MOUSEOVER, fnMouseOver, this, true);
                        Event.on(oFooter, _MOUSEOUT, fnMouseOut, this, true);
                        this._hasScrollEventHandlers = true;
                    }
                    this._disableScrollHeader();
                    this._enableScrollFooter();
                    bRefireIFrameAndShadow = true;
                }
                else if (oHeader && oFooter) {
                    if (this._widthSetForScroll) {
                        this._widthSetForScroll = false;
                        this.cfg.unsubscribeFromConfigEvent(_WIDTH, this._clearSetWidthFlag);
                        this.cfg.setProperty(_WIDTH, _EMPTY_STRING);
                    }
                    this._enableScrollHeader();
                    this._enableScrollFooter();
                    if (this._hasScrollEventHandlers) {
                        Event.removeListener(oHeader, _MOUSEOVER, fnMouseOver);
                        Event.removeListener(oHeader, _MOUSEOUT, fnMouseOut);
                        Event.removeListener(oFooter, _MOUSEOVER, fnMouseOver);
                        Event.removeListener(oFooter, _MOUSEOUT, fnMouseOut);
                        this._hasScrollEventHandlers = false;
                    }
                    try{
                        oElement.removeChild(oHeader);
                        oElement.removeChild(oFooter);
                    }catch(exception){}; 
                    this.header = null;
                    this.footer = null;
                    bRefireIFrameAndShadow = true;
                }
                if (bRefireIFrameAndShadow) {
                    this.cfg.refireEvent(_IFRAME);
                    this.cfg.refireEvent(_SHADOW);
                }
            }
        },
        _setMaxHeight: function(p_sType, p_aArgs, p_nMaxHeight) {
            this._setScrollHeight(p_nMaxHeight);
            this.renderEvent.unOn(this._setMaxHeight);
        },
        configMaxHeight: function(p_sType, p_aArgs, p_oMenu) {
            var nMaxHeight = p_aArgs[0];
            if (this.lazyLoad && !this.body && nMaxHeight > 0) {
                this.renderEvent.on(this._setMaxHeight, nMaxHeight, this, true);
            }
            else {
                this._setScrollHeight(nMaxHeight);
            }
        },
        configClassName: function(p_sType, p_aArgs, p_oMenu) {
            var sClassName = p_aArgs[0];
            if (this._sClassName) {
                Dom.removeClass(this.element, this._sClassName);
            }
            Dom.addClass(this.element, sClassName);
            this._sClassName = sClassName;
        },
        _onItemAdded: function(p_sType, p_aArgs) {
            var oItem = p_aArgs[0];
            if (oItem) {
                oItem.cfg.setProperty(_DISABLED, true);
            }
        },
        configDisabled: function(p_sType, p_aArgs, p_oMenu) {
            var bDisabled = p_aArgs[0],
            aItems = this.getItems(),
            nItems,
            i;
            if (Rui.isArray(aItems)) {
                nItems = aItems.length;
                if (nItems > 0) {
                    i = nItems - 1;
                    do {
                        aItems[i].cfg.setProperty(_DISABLED, bDisabled);
                    }
                    while (i--);
                }
                if (bDisabled) {
                    this.clearActiveItem(true);
                    Dom.addClass(this.element, _DISABLED);
                    this.itemAddedEvent.on(this._onItemAdded, this, true, {isCE:true});
                }
                else {
                    Dom.removeClass(this.element, _DISABLED);
                    this.itemAddedEvent.unOn(this._onItemAdded, this);
                }
            }
        },
        configShadow: function(p_sType, p_aArgs, p_oMenu) {
            var sizeShadow = function() {
                var oElement = this.element,
                oShadow = this._shadow;
                if (oShadow && oElement) {
                    if (oShadow.style.width && oShadow.style.height) {
                        oShadow.style.width = _EMPTY_STRING;
                        oShadow.style.height = _EMPTY_STRING;
                    }
                    oShadow.style.width = (oElement.offsetWidth + 6) + _PX;
                    oShadow.style.height = (oElement.offsetHeight + 1) + _PX;
                }
            };
            var replaceShadow = function() {
                this.element.appendChild(this._shadow);
            };
            var addShadowVisibleClass = function() {
                Dom.addClass(this._shadow, _RUI_MENU_SHADOW_VISIBLE);
            };
            var removeShadowVisibleClass = function() {
                Dom.removeClass(this._shadow, _RUI_MENU_SHADOW_VISIBLE);
            };
            var createShadow = function() {
                var oShadow = this._shadow,
                oElement;
                if (!oShadow) {
                    oElement = this.element;
                    if (!m_oShadowTemplate) {
                        m_oShadowTemplate = document.createElement(_DIV_LOWERCASE);
                        m_oShadowTemplate.className = _RUI_MENU_SHADOW_RUI_MENU_SHADOW_VISIBLE;
                    }
                    oShadow = m_oShadowTemplate.cloneNode(false);
                    oElement.appendChild(oShadow);
                    this._shadow = oShadow;
                    this.on('beforeShow',addShadowVisibleClass, this, true);
                    this.on('beforeHide', removeShadowVisibleClass, this, true);
                    if (UA.msie) {
                        Rui.later(0, this, function() {
                            sizeShadow.call(this);
                            this.syncIframe();
                        });
                        this.cfg.subscribeToConfigEvent(_WIDTH, sizeShadow);
                        this.cfg.subscribeToConfigEvent(_HEIGHT, sizeShadow);
                        this.cfg.subscribeToConfigEvent(_MAX_HEIGHT, sizeShadow);
                        this.on('changeContent', sizeShadow, this, true);
                        Panel.textResizeEvent.on(sizeShadow, this, true, {isCE:true});
                        this.on('destroy', function() {
                            Panel.textResizeEvent.unOn(sizeShadow, this);
                        }, this, true);
                    }
                    this.cfg.subscribeToConfigEvent(_MAX_HEIGHT, replaceShadow);
                }
            };
            var onBeforeShow = function() {
                if (this._shadow) {
                    replaceShadow.call(this);
                    if (UA.msie) {
                        sizeShadow.call(this);
                    }
                }
                else {
                    createShadow.call(this);
                }
            };
            var bShadow = p_aArgs[0];
            if (bShadow && this.cfg.getProperty(_POSITION) == _DYNAMIC) {
                if (this.cfg.getProperty(_VISIBLE)) {
                    if (this._shadow) {
                        replaceShadow.call(this);
                        if (UA.msie) {
                            sizeShadow.call(this);
                        }
                    }
                    else {
                        createShadow.call(this);
                    }
                }
                else {
                    this.on('beforeShow', onBeforeShow, this, true);
                }
            }
        },
        positionOffScreen: function() {
            var oIFrame = this.iframe,
            oElement = this.element,
            sPos = this.OFF_SCREEN_POSITION;
            if (oIFrame) {
                oElement.style.top = _EMPTY_STRING;
                oElement.style.left = _EMPTY_STRING;
                oIFrame.style.top = sPos;
                oIFrame.style.left = sPos;
            }
        },
        getRoot: function() {
            var oItem = this.parent, oParentMenu, returnVal;
            if (oItem) {
                oParentMenu = oItem.parent;
                returnVal = oParentMenu ? oParentMenu.getRoot() : this;
            }
            else {
                returnVal = this;
            }
            return returnVal;
        },
        toString: function(){
            var sReturnVal = _MENU,
            sId = this.id;
            if (sId){
                sReturnVal += (_SPACE + sId);
            }
            return sReturnVal;
        },
        setItemGroupTitle: function(p_sGroupTitle, p_nGroupIndex) {
            var nGroupIndex,
            oTitle,
            i,
            nFirstIndex;
            if (Rui.isString(p_sGroupTitle) && p_sGroupTitle.length > 0) {
                nGroupIndex = Rui.isNumber(p_nGroupIndex) ? p_nGroupIndex : 0;
                oTitle = this._aGroupTitleElements[nGroupIndex];
                if (oTitle) {
                    Rui.get(oTitle).html(p_sGroupTitle);
                }
                else {
                    oTitle = document.createElement(this.GROUP_TITLE_TAG_NAME);
                    Rui.get(oTitle).html(p_sGroupTitle);
                    this._aGroupTitleElements[nGroupIndex] = oTitle;
                }
                i = this._aGroupTitleElements.length - 1;
                do {
                    if (this._aGroupTitleElements[i]) {
                        Dom.removeClass(this._aGroupTitleElements[i], _FIRST_OF_TYPE);
                        nFirstIndex = i;
                    }
                }
                while (i--);
                if (nFirstIndex !== null) {
                    Dom.addClass(this._aGroupTitleElements[nFirstIndex],
                            _FIRST_OF_TYPE);
                }
                this.fireEvent('changeContent', {target: this});
            }
            return this;
        },
        addItem: function(p_oItem, p_nGroupIndex) {
            return this._addItemToGroup(p_nGroupIndex, p_oItem);
        },
        addItems: function(p_aItems, p_nGroupIndex) {
            var nItems, aItems, oItem, i, returnVal;
            if (Rui.isArray(p_aItems)) {
                nItems = p_aItems.length;
                aItems = [];
                for (i = 0; i < nItems; i++) {
                    oItem = p_aItems[i];
                    if (oItem) {
                        if (Rui.isArray(oItem)) {
                            aItems[aItems.length] = this.addItems(oItem, i);
                        }
                        else {
                            aItems[aItems.length] = this._addItemToGroup(p_nGroupIndex, oItem);
                        }
                    }
                }
            }
            return returnVal;
        },
        onLoadDataSet: function(){
            this.addItemsByDataSet();
            this.render();
        },
        addItemsByDataSet: function(p_nGroupIndex) {
            var ret_val = null;
            if (this.dataSet && this.dataSet) {
                var p_aItems = Rui.util.LJson.decode(this._getItemsByDataSet());
                ret_val = this.addItems(p_aItems, p_nGroupIndex);
            }
            return ret_val;
        },
        _getItemsByDataSet: function() {
            var rs_grouped = this._getChildRecords(this.fields.rootValue);
            var grouped = rs_grouped[1];
            var rs = rs_grouped[0];
            var level = 0;
            var child_list = "";
            var list = '[';
            var colon = "";
            var curr = "";
            var next = "";
            var prev = "";
            var start_b = "";
            var end_b = "";
            for (var i = 0; i < rs.length; i++) {
                colon = (list == "[") ? "" : ",";
                child_list = this._addChildItems(rs[i].get(this.fields.id), level);
                child_list = (child_list == "") ? "" : ",submenu:" + child_list;
                if (!grouped) {
                    list += colon + '{' + 'text:"' + rs[i].get(this.fields.text) + '",onclick:{fn:' + this.fields.onclick + ',obj:"' + rs[i].id + '"}';
                    list += child_list + '}';
                }
                else {
                    curr = rs[i].get(this.fields.order);
                    if (i == 0) {
                        next = rs[i + 1].get(this.fields.order);
                        start_b = "[";
                        end_b = (curr == next) ? "" : "]";
                    }
                    else if (rs.length == (i + 1)) {
                        prev = rs[i - 1].get(this.fields.order);
                        start_b = (curr == prev) ? "" : "[";
                        end_b = "]";
                    }
                    else {
                        prev = rs[i - 1].get(this.fields.order);
                        next = rs[i + 1].get(this.fields.order);
                        if (curr == next && curr == prev) {
                            start_b = "";
                            end_b = "";
                        }
                        else if (curr == prev && curr != next) {
                            start_b = "";
                            end_b = "]";
                        }
                        else if (curr != prev && curr == next) {
                            start_b = "[";
                            end_b = "";
                        }
                        else {
                            start_b = "[";
                            end_b = "]";
                        }
                    }
                    list += colon + start_b + '{' + 'text:"' + rs[i].get(this.fields.text) + '",onclick:{fn:' + this.fields.onclick + ',obj:"' + rs[i].id + '"}';
                    list += child_list + '}' + end_b;
                }
            }
            list += ']';
            return list;
        },
        _addChildItems: function(parent_id, level) {
            level += 1;
            var rs_grouped = this._getChildRecords(parent_id);
            var grouped = rs_grouped[1];
            var rs = rs_grouped[0];
            var child_list = "";
            var list = "";
            var colon = "";
            var curr = "";
            var next = "";
            var prev = "";
            var start_b = "";
            var end_b = "";
            if (rs.length != 0) {
                list = '{id:"' + parent_id + '",itemdata:[';
                for (var i = 0; i < rs.length; i++) {
                    colon = (i == 0) ? "" : ",";
                    child_list = this._addChildItems(rs[i].get(this.fields.id), level);
                    child_list = child_list == "" ? "" : ",submenu:" + child_list;
                    if (!grouped) {
                        list += colon + '{' + 'text:"' + rs[i].get(this.fields.text) + '",onclick:{fn:' + this.fields.onclick + ',obj:"' + rs[i].id + '"}';
                        list += child_list + '}';
                    }
                    else {
                        curr = rs[i].get(this.fields.order);
                        if (i == 0) {
                            next = rs[i + 1].get(this.fields.order);
                            start_b = "[";
                            end_b = (curr == next) ? "" : "]";
                        }
                        else if (rs.length == (i + 1)) {
                            prev = rs[i - 1].get(this.fields.order);
                            start_b = (curr == prev) ? "" : "[";
                            end_b = "]";
                        }
                        else {
                            prev = rs[i - 1].get(this.fields.order);
                            next = rs[i + 1].get(this.fields.order);
                            if (curr == next && curr == prev) {
                                start_b = "";
                                end_b = "";
                            }
                            else if (curr == prev && curr != next) {
                                start_b = "";
                                end_b = "]";
                            }
                            else if (curr != prev && curr == next) {
                                start_b = "[";
                                end_b = "";
                            }
                            else {
                                start_b = "[";
                                end_b = "]";
                            }
                        }
                        list += colon + start_b + '{' + 'text:"' + rs[i].get(this.fields.text) + '",onclick:{fn:' + this.fields.onclick + ',obj:"' + rs[i].id + '"}';
                        list += child_list + '}' + end_b;
                    }
                }
                list += ']}';
            }
            return list;
        },
        _getChildRecords: function(parent_id) {
            var rs = new Array();
            var row_count = this.dataSet.getCount();
            var r = null;
            for (var i = 0; i < row_count; i++) {
                r = this.dataSet.getAt(i);
                if (r.get(this.fields.parentId) == parent_id) {
                    rs.push(r);
                }
            }
            var grouped = false;
            if (this.fields.order) {
                var sr = this._getSortedRecords(rs);
                grouped = sr[0];
                rs = sr[1];
            }
            return [rs, grouped];
        },
        _getSortedRecords: function(rs) {
            var sort_order_idx = new Array();
            var order;
            for (var i = 0; i < rs.length; i++) {
                order = rs[i].get(this.fields.order);                
                sort_order_idx.push((order ? order : 10000000000) + "." + i.toString());
            }
            sort_order_idx.sort(function(x, y) { return x - y; });
            var sorted_rs = new Array();
            var idx = -1;
            var is_same_order = false;
            var prev = -1;
            var cur = -1;
            var s = null;
            for (var i = 0; i < sort_order_idx.length; i++) {
                s = sort_order_idx[i].split('.');
                idx = parseInt(s[1], 10);
                cur = parseInt(s[0], 10);
                if (!is_same_order) {
                    is_same_order = (cur == prev) ? true : false;
                }
                sorted_rs.push(rs[idx]);
                prev = cur;
            }
            return [is_same_order, sorted_rs];
        },
        insertItem: function(p_oItem, p_nItemIndex, p_nGroupIndex) {
            return this._addItemToGroup(p_nGroupIndex, p_oItem, p_nItemIndex);
        },
        removeItem: function(p_oObject, p_nGroupIndex) {
            var oItem, returnVal;
            if (!Rui.isUndefined(p_oObject)) {
                if (p_oObject instanceof Rui.ui.menu.LMenuItem) {
                    oItem = this._removeItemFromGroupByValue(p_nGroupIndex, p_oObject);
                }
                else if (Rui.isNumber(p_oObject)) {
                    oItem = this._removeItemFromGroupByIndex(p_nGroupIndex, p_oObject);
                }
                if (oItem) {
                    oItem.destroy();
                    returnVal = oItem;
                }
            }
            return returnVal;
        },
        getItems: function() {
            var aGroups = this._aItemGroups,
            nGroups,
            returnVal,
            aItems = [];
            if (Rui.isArray(aGroups)) {
                nGroups = aGroups.length;
                returnVal = ((nGroups == 1) ? aGroups[0] : (Array.prototype.concat.apply(aItems, aGroups)));
            }
            return returnVal;
        },
        getItemGroups: function() {
            return this._aItemGroups;
        },
        getItem: function(p_nItemIndex, p_nGroupIndex) {
            var aGroup, returnVal;
            if (Rui.isNumber(p_nItemIndex)) {
                aGroup = this._getItemGroup(p_nGroupIndex);
                if (aGroup) {
                    returnVal = aGroup[p_nItemIndex];
                }
            }
            return returnVal;
        },
        getSubmenus: function() {
            var aItems = this.getItems(),
            nItems = aItems.length,
            aSubmenus,
            oSubmenu,
            oItem,
            i;
            if (nItems > 0) {
                aSubmenus = [];
                for (i = 0; i < nItems; i++) {
                    oItem = aItems[i];
                    if (oItem) {
                        oSubmenu = oItem.cfg.getProperty(_SUBMENU);
                        if (oSubmenu) {
                            aSubmenus[aSubmenus.length] = oSubmenu;
                        }
                    }
                }
            }
            return aSubmenus;
        },
        clearContent: function() {
            var aItems = this.getItems(),
            nItems = aItems.length,
            oElement = this.element,
            oBody = this.body,
            oHeader = this.header,
            oFooter = this.footer,
            oItem,
            oSubmenu,
            i;
            if (nItems > 0) {
                i = nItems - 1;
                do {
                    oItem = aItems[i];
                    if (oItem) {
                        oSubmenu = oItem.cfg.getProperty(_SUBMENU);
                        if (oSubmenu) {
                            this.cfg.configChangedEvent.unOn(
                                    this._onParentMenuConfigChange, oSubmenu);
                            this.renderEvent.unOn(this._onParentMenuRender, oSubmenu);
                        }
                        this.removeItem(oItem, oItem.groupIndex);
                    }
                }
                while (i--);
            }
            if (oHeader) {
                Event.purgeElement(oHeader);
                oElement.removeChild(oHeader);
            }
            if (oFooter) {
                Event.purgeElement(oFooter);
                oElement.removeChild(oFooter);
            }
            if (oBody) {
                Event.purgeElement(oBody);
                Rui.get(oBody).html(_EMPTY_STRING);
            }
            this.activeItem = null;
            this._aItemGroups = [];
            this._aListElements = [];
            this._aGroupTitleElements = [];
            this.cfg.setProperty(_WIDTH, null);
            return this;
        },
        destroy: function() {
            this.clearContent();
            this._aItemGroups = null;
            this._aListElements = null;
            this._aGroupTitleElements = null;
            LMenu.superclass.destroy.call(this);
            return this;
        },
        setInitialFocus: function() {
            var oItem = this._getFirstEnabledItem();
            if (oItem) {
                oItem.focus();
            }
            return this;
        },
        setInitialSelection: function() {
            var oItem = this._getFirstEnabledItem();
            if (oItem) {
                oItem.cfg.setProperty(_SELECTED, true);
            }
            return this;
        },
        clearActiveItem: function(p_bBlur) {
            if (this.cfg.getProperty(_SHOW_DELAY) > 0) {
                this._cancelShowDelay();
            }
            var oActiveItem = this.activeItem,
            oConfig,
            oSubmenu;
            if (oActiveItem) {
                oConfig = oActiveItem.cfg;
                if (p_bBlur) {
                    oActiveItem.blur();
                    this.getRoot()._hasFocus = true;
                }
                oConfig.setProperty(_SELECTED, false);
                oSubmenu = oConfig.getProperty(_SUBMENU);
                if (oSubmenu) {
                    oSubmenu.hide();
                }
                this.activeItem = null;
            }
            return this;
        },
        focus: function() {
            if (!this.hasFocus()) {
                this.setInitialFocus();
            }
            return this;
        },
        blur: function() {
            var oItem;
            if (this.hasFocus()) {
                oItem = LMenuManager.getFocusedMenuItem();
                if (oItem) {
                    oItem.blur();
                }
            }
            return this;
        },
        hasFocus: function() {
            return (LMenuManager.getFocusedMenu() == this.getRoot());
        },
        disable: function(){
            this.cfg.setProperty(_DISABLED,true);
            return this;
        },
        enable: function(){
            this.cfg.setProperty(_DISABLED,false);
            return this;
        },
        on: function(p_type, p_fn, p_obj, p_override, options) {
            if(p_type instanceof String && typeof p_override !== 'undefined'){
                LMenu.superclass.on.apply(this, arguments);
            }else{
                this._on.apply(this, arguments); 
            }
        },
        _on: function() {
            function onItemAdded(p_sType, p_aArgs, p_oObject) {
                var oItem = p_aArgs[0],
                oSubmenu = oItem.cfg.getProperty(_SUBMENU);
                if (oSubmenu) {
                    oSubmenu._on.apply(oSubmenu, p_oObject);
                }
            }
            function onSubmenuAdded(p_sType, p_aArgs, p_oObject) {
                var oSubmenu = this.cfg.getProperty(_SUBMENU);
                if (oSubmenu) {
                    oSubmenu._on.apply(oSubmenu, p_oObject);
                }
            }
            LMenu.superclass.on.apply(this, arguments);
            LMenu.superclass.on.call(this, _ITEM_ADDED, onItemAdded, arguments);
            var aItems = this.getItems(),
                nItems,
                oItem,
                oSubmenu,
                i;
            if (aItems) {
                nItems = aItems.length;
                if (nItems > 0) {
                    i = nItems - 1;
                    do {
                        oItem = aItems[i];
                        oSubmenu = oItem.cfg.getProperty(_SUBMENU);
                        if (oSubmenu) {
                            oSubmenu._on.apply(oSubmenu, arguments);
                        }
                        else {
                            oItem.cfg.subscribeToConfigEvent(_SUBMENU, onSubmenuAdded, arguments);
                        }
                    }
                    while (i--);
                }
            }
        }
    });
})();
(function() {
    Rui.ui.menu.LMenuItem = function(p_oObject, p_oConfig) {
        if (p_oObject) {
            if (p_oConfig) {
                this.parent = p_oConfig.parent;
                this.value = p_oConfig.value;
                this.id = p_oConfig.id;
            }
            this.init(p_oObject, p_oConfig);
        }
    };
    var Dom = Rui.util.LDom,
    Panel = Rui.ui.LPanel,
    LMenu = Rui.ui.menu.LMenu,
    LMenuItem = Rui.ui.menu.LMenuItem,
    LCustomEvent = Rui.util.LCustomEvent,
    UA = Rui.browser,
    _TEXT = "text",
    _HASH = "#",
    _HYPHEN = "-",
    _HELP_TEXT = "helptext",
    _URL = "url",
    _TARGET = "target",
    _EMPHASIS = "emphasis",
    _STRONG_EMPHASIS = "strongemphasis",
    _CHECKED = "checked",
    _SUBMENU = "submenu",
    _DISABLED = "disabled",
    _SELECTED = "selected",
    _HAS_SUBMENU = "hassubmenu",
    _CHECKED_DISABLED = "checked-disabled",
    _HAS_SUBMENU_DISABLED = "hassubmenu-disabled",
    _HAS_SUBMENU_SELECTED = "hassubmenu-selected",
    _CHECKED_SELECTED = "checked-selected",
    _ONCLICK = "onclick",
    _CLASSNAME = "classname",
    _EMPTY_STRING = "",
    _OPTION = "OPTION",
    _OPTGROUP = "OPTGROUP",
    _LI_UPPERCASE = "LI",
    _HREF = "href",
    _SELECT = "SELECT",
    _DIV = "DIV",
    _START_HELP_TEXT = "<em class=\"helptext\">",
    _START_EM = "<em>",
    _END_EM = "</em>",
    _START_STRONG = "<strong>",
    _END_STRONG = "</strong>",
    _PREVENT_CONTEXT_OVERLAP = "preventcontextoverlap",
    _OBJ = "obj",
    _SCOPE = "scope",
    _NONE = "none",
    _VISIBLE = "visible",
    _SPACE = " ",
    _MENUITEM = "LMenuItem",
    _CLICK = "click",
    _SHOW = "show",
    _HIDE = "hide",
    _LI_LOWERCASE = "li",
    _ANCHOR_TEMPLATE = "<a href=\"#\"></a>",
    EVENT_TYPES = [
        ["mouseOverEvent", "mouseover"],
        ["mouseOutEvent", "mouseout"],
        ["mouseDownEvent", "mousedown"],
        ["mouseUpEvent", "mouseup"],
        ["clickEvent", _CLICK],
        ["keyPressEvent", "keypress"],
        ["keyDownEvent", "keydown"],
        ["keyUpEvent", "keyup"],
        ["focusEvent", "focus"],
        ["blurEvent", "blur"],
        ["destroyEvent", "destroy"]
    ],
    TEXT_CONFIG = {
        key: _TEXT,
        value: _EMPTY_STRING,
        validator: Rui.isString,
        suppressEvent: true
    },
    HELP_TEXT_CONFIG = {
        key: _HELP_TEXT,
        supercedes: [_TEXT],
        suppressEvent: true
    },
    URL_CONFIG = {
        key: _URL,
        value: _HASH,
        suppressEvent: true
    },
    TARGET_CONFIG = {
        key: _TARGET,
        suppressEvent: true
    },
    EMPHASIS_CONFIG = {
        key: _EMPHASIS,
        value: false,
        validator: Rui.isBoolean,
        suppressEvent: true,
        supercedes: [_TEXT]
    },
    STRONG_EMPHASIS_CONFIG = {
        key: _STRONG_EMPHASIS,
        value: false,
        validator: Rui.isBoolean,
        suppressEvent: true,
        supercedes: [_TEXT]
    },
    CHECKED_CONFIG = {
        key: _CHECKED,
        value: false,
        validator: Rui.isBoolean,
        suppressEvent: true,
        supercedes: [_DISABLED, _SELECTED]
    },
    SUBMENU_CONFIG = {
        key: _SUBMENU,
        suppressEvent: true,
        supercedes: [_DISABLED, _SELECTED]
    },
    DISABLED_CONFIG = {
        key: _DISABLED,
        value: false,
        validator: Rui.isBoolean,
        suppressEvent: true,
        supercedes: [_TEXT, _SELECTED]
    },
    SELECTED_CONFIG = {
        key: _SELECTED,
        value: false,
        validator: Rui.isBoolean,
        suppressEvent: true
    },
    ONCLICK_CONFIG = {
        key: _ONCLICK,
        suppressEvent: true
    },
    CLASS_NAME_CONFIG = {
        key: _CLASSNAME,
        value: null,
        validator: Rui.isString,
        suppressEvent: true
    },
    KEY_LISTENER_CONFIG = {
        key: "keylistener",
        value: null,
        suppressEvent: true
    },
    m_oMenuItemTemplate = null,
    CLASS_NAMES = {};
    var getClassNameForState = function(prefix, state) {
        var oClassNames = CLASS_NAMES[prefix];
        if (!oClassNames) {
            CLASS_NAMES[prefix] = {};
            oClassNames = CLASS_NAMES[prefix];
        }
        var sClassName = oClassNames[state];
        if (!sClassName) {
            sClassName = prefix + _HYPHEN + state;
            oClassNames[state] = sClassName;
        }
        return sClassName;
    };
    var addClassNameForState = function(state) {
        Dom.addClass(this.element, getClassNameForState(this.CSS_CLASS_NAME, state));
        Dom.addClass(this._oAnchor, getClassNameForState(this.CSS_LABEL_CLASS_NAME, state));
        if(Rui.useAccessibility()){
             this.element.setAttribute('aria-' + state,  'true');
            this._oAnchor.setAttribute('aria-' + state,  'true');
        }
    };
    var removeClassNameForState = function(state) {
        Dom.removeClass(this.element, getClassNameForState(this.CSS_CLASS_NAME, state));
        Dom.removeClass(this._oAnchor, getClassNameForState(this.CSS_LABEL_CLASS_NAME, state));
        if(Rui.useAccessibility()){
            this.element.setAttribute('aria-' + state,  'false');
            this._oAnchor.setAttribute('aria-' + state,  'false');
        }
    };
    LMenuItem.prototype = {
        CSS_CLASS_NAME: "L-ruimenuitem",
        CSS_LABEL_CLASS_NAME: "L-ruimenuitemlabel",
        SUBMENU_TYPE: null,
        _oAnchor: null,
        _oSubmenu: null,
        _oOnclickAttributeValue: null,
        _sClassName: null,
        constructor: LMenuItem,
        index: null,
        groupIndex: null,
        parent: null,
        element: null,
        srcElement: null,
        value: null,
        browser: Panel.prototype.browser,
        id: null,
        init: function(p_oObject, p_oConfig) {
            if (!this.SUBMENU_TYPE) {
                this.SUBMENU_TYPE = LMenu;
            }
            this.cfg = new Rui.ui.LConfig(this);
            this.initDefaultConfig();
            var oConfig = this.cfg,
            sURL = _HASH,
            oCustomEvent,
            aEventData,
            oAnchor,
            sTarget,
            sText,
            sId,
            i;
            if (Rui.isString(p_oObject)) {
                this._createRootNodeStructure();
                oConfig.queueProperty(_TEXT, p_oObject);
            }
            else if (p_oObject && p_oObject.tagName) {
                switch (p_oObject.tagName.toUpperCase()) {
                    case _OPTION:
                        this._createRootNodeStructure();
                        oConfig.queueProperty(_TEXT, p_oObject.text);
                        oConfig.queueProperty(_DISABLED, p_oObject.disabled);
                        this.value = p_oObject.value;
                        this.srcElement = p_oObject;
                        break;
                    case _OPTGROUP:
                        this._createRootNodeStructure();
                        oConfig.queueProperty(_TEXT, p_oObject.label);
                        oConfig.queueProperty(_DISABLED, p_oObject.disabled);
                        this.srcElement = p_oObject;
                        this._initSubTree();
                        break;
                    case _LI_UPPERCASE:
                        oAnchor = Dom.getFirstChild(p_oObject);
                        if (oAnchor) {
                            sURL = oAnchor.getAttribute(_HREF, 2);
                            sTarget = oAnchor.getAttribute(_TARGET);
                            sText = oAnchor.innerHTML;
                        }
                        this.srcElement = p_oObject;
                        this.element = p_oObject;
                        this._oAnchor = oAnchor;
                        oConfig.setProperty(_TEXT, sText, true);
                        oConfig.setProperty(_URL, sURL, true);
                        oConfig.setProperty(_TARGET, sTarget, true);
                        this._initSubTree();
                        break;
                }
            }
            if (this.element) {
                sId = (this.srcElement || this.element).id;
                if (!sId) {
                    sId = this.id || Dom.generateId();
                    this.element.id = sId;
                }
                this.id = sId;
                Dom.addClass(this.element, this.CSS_CLASS_NAME);
                Dom.addClass(this._oAnchor, this.CSS_LABEL_CLASS_NAME);
                if(Rui.useAccessibility())
                    this.element.setAttribute('role', 'menuitem');
                i = EVENT_TYPES.length - 1;
                do {
                    aEventData = EVENT_TYPES[i];
                    oCustomEvent = this.createEvent(aEventData[1], { isCE: true });
                    oCustomEvent.signature = LCustomEvent.LIST;
                    this[aEventData[0]] = oCustomEvent;
                }
                while (i--);
                if (p_oConfig) {
                    oConfig.applyConfig(p_oConfig);
                }
                oConfig.fireQueue();
            }
        },
        _createRootNodeStructure: function() {
            var oElement,
            oAnchor;
            if (!m_oMenuItemTemplate) {
                m_oMenuItemTemplate = document.createElement(_LI_LOWERCASE);
                m_oMenuItemTemplate.innerHTML = _ANCHOR_TEMPLATE;
            }
            oElement = m_oMenuItemTemplate.cloneNode(true);
            oElement.className = this.CSS_CLASS_NAME;
            oAnchor = oElement.firstChild;
            oAnchor.className = this.CSS_LABEL_CLASS_NAME;
            this.element = oElement;
            this._oAnchor = oAnchor;
        },
        _initSubTree: function() {
            var oSrcEl = this.srcElement,
            oConfig = this.cfg,
            oNode,
            aOptions,
            nOptions,
            oMenu,
            n;
            if (oSrcEl.childNodes.length > 0) {
                if (this.parent.lazyLoad && this.parent.srcElement &&
                this.parent.srcElement.tagName.toUpperCase() == _SELECT) {
                    oConfig.setProperty(
                        _SUBMENU,
                        { id: Dom.generateId(), itemdata: oSrcEl.childNodes }
                    );
                }
                else {
                    oNode = oSrcEl.firstChild;
                    aOptions = [];
                    do {
                        if (oNode && oNode.tagName) {
                            switch (oNode.tagName.toUpperCase()) {
                                case _DIV:
                                    oConfig.setProperty(_SUBMENU, oNode);
                                    break;
                                case _OPTION:
                                    aOptions[aOptions.length] = oNode;
                                    break;
                            }
                        }
                    }
                    while ((oNode = oNode.nextSibling));
                    nOptions = aOptions.length;
                    if (nOptions > 0) {
                        oMenu = new this.SUBMENU_TYPE({id:Dom.generateId()});
                        oConfig.setProperty(_SUBMENU, oMenu);
                        for (n = 0; n < nOptions; n++) {
                            oMenu.addItem((new oMenu.ITEM_TYPE(aOptions[n])));
                        }
                    }
                }
            }
        },
        configText: function(p_sType, p_aArgs, p_oItem) {
            var sText = p_aArgs[0],
            oConfig = this.cfg,
            oAnchor = this._oAnchor,
            sHelpText = oConfig.getProperty(_HELP_TEXT),
            sHelpTextHTML = _EMPTY_STRING,
            sEmphasisStartTag = _EMPTY_STRING,
            sEmphasisEndTag = _EMPTY_STRING;
            if (sText) {
                if (sHelpText) {
                    sHelpTextHTML = _START_HELP_TEXT + sHelpText + _END_EM;
                }
                if (oConfig.getProperty(_EMPHASIS)) {
                    sEmphasisStartTag = _START_EM;
                    sEmphasisEndTag = _END_EM;
                }
                if (oConfig.getProperty(_STRONG_EMPHASIS)) {
                    sEmphasisStartTag = _START_STRONG;
                    sEmphasisEndTag = _END_STRONG;
                }
                Rui.get(oAnchor).html(sEmphasisStartTag + sText + sEmphasisEndTag + sHelpTextHTML);
            }
        },
        configHelpText: function(p_sType, p_aArgs, p_oItem) {
            this.cfg.refireEvent(_TEXT);
        },
        configURL: function(p_sType, p_aArgs, p_oItem) {
            var sURL = p_aArgs[0];
            if (!sURL) {
                sURL = _HASH;
            }
            var oAnchor = this._oAnchor;
            if (UA.opera) {
                oAnchor.removeAttribute(_HREF);
            }
            oAnchor.setAttribute(_HREF, sURL);
        },
        configTarget: function(p_sType, p_aArgs, p_oItem) {
            var sTarget = p_aArgs[0],
            oAnchor = this._oAnchor;
            if (sTarget && sTarget.length > 0) {
                oAnchor.setAttribute(_TARGET, sTarget);
            }
            else {
                oAnchor.removeAttribute(_TARGET);
            }
        },        
        configEmphasis: function(p_sType, p_aArgs, p_oItem) {
            var bEmphasis = p_aArgs[0],
            oConfig = this.cfg;
            if (bEmphasis && oConfig.getProperty(_STRONG_EMPHASIS)) {
                oConfig.setProperty(_STRONG_EMPHASIS, false);
            }
            oConfig.refireEvent(_TEXT);
        },
        configStrongEmphasis: function(p_sType, p_aArgs, p_oItem) {
            var bStrongEmphasis = p_aArgs[0],
            oConfig = this.cfg;
            if (bStrongEmphasis && oConfig.getProperty(_EMPHASIS)) {
                oConfig.setProperty(_EMPHASIS, false);
            }
            oConfig.refireEvent(_TEXT);
        },
        configChecked: function(p_sType, p_aArgs, p_oItem) {
            var bChecked = p_aArgs[0],
            oConfig = this.cfg;
            if (bChecked) {
                addClassNameForState.call(this, _CHECKED);
            }
            else {
                removeClassNameForState.call(this, _CHECKED);
            }
            oConfig.refireEvent(_TEXT);
            if (oConfig.getProperty(_DISABLED)) {
                oConfig.refireEvent(_DISABLED);
            }
            if (oConfig.getProperty(_SELECTED)) {
                oConfig.refireEvent(_SELECTED);
            }
        },
        configDisabled: function(p_sType, p_aArgs, p_oItem) {
            var bDisabled = p_aArgs[0],
            oConfig = this.cfg,
            oSubmenu = oConfig.getProperty(_SUBMENU),
            bChecked = oConfig.getProperty(_CHECKED);
            if (bDisabled) {
                if (oConfig.getProperty(_SELECTED)) {
                    oConfig.setProperty(_SELECTED, false);
                }
                addClassNameForState.call(this, _DISABLED);
                if (oSubmenu) {
                    addClassNameForState.call(this, _HAS_SUBMENU_DISABLED);
                }
                if (bChecked) {
                    addClassNameForState.call(this, _CHECKED_DISABLED);
                }
            }
            else {
                removeClassNameForState.call(this, _DISABLED);
                if (oSubmenu) {
                    removeClassNameForState.call(this, _HAS_SUBMENU_DISABLED);
                }
                if (bChecked) {
                    removeClassNameForState.call(this, _CHECKED_DISABLED);
                }
            }
        },
        configSelected: function(p_sType, p_aArgs, p_oItem) {
            var oConfig = this.cfg,
            oAnchor = this._oAnchor,
            bSelected = p_aArgs[0],
            bChecked = oConfig.getProperty(_CHECKED),
            oSubmenu = oConfig.getProperty(_SUBMENU);
            if (UA.opera) {
                oAnchor.blur();
            }
            if (bSelected && !oConfig.getProperty(_DISABLED)) {
                addClassNameForState.call(this, _SELECTED);
                if (oSubmenu) {
                    addClassNameForState.call(this, _HAS_SUBMENU_SELECTED);
                }
                if (bChecked) {
                    addClassNameForState.call(this, _CHECKED_SELECTED);
                }
            }
            else {
                removeClassNameForState.call(this, _SELECTED);
                if (oSubmenu) {
                    removeClassNameForState.call(this, _HAS_SUBMENU_SELECTED);
                }
                if (bChecked) {
                    removeClassNameForState.call(this, _CHECKED_SELECTED);
                }
            }
            if (this.hasFocus() && UA.opera) {
                oAnchor.focus();
            }
        },
        _onSubmenuBeforeHide: function(p_sType, p_aArgs) {
            var oItem = this.parent,
            oMenu;
            function onHide() {
                oItem._oAnchor.blur();
            }
            if (oItem.hasFocus()) {
                oMenu = oItem.parent;
                oMenu.on('beforeHide', onHide, this, true);
            }
        },
        configSubmenu: function(p_sType, p_aArgs, p_oItem) {
            var oSubmenu = p_aArgs[0],
            oConfig = this.cfg,
            bLazyLoad = this.parent && this.parent.lazyLoad,
            oMenu,
            sSubmenuId,
            oSubmenuConfig;
            if (oSubmenu) {
                if (oSubmenu instanceof LMenu) {
                    oMenu = oSubmenu;
                    oMenu.parent = this;
                    oMenu.lazyLoad = bLazyLoad;
                }
                else if (Rui.isObject(oSubmenu) && oSubmenu.id && !oSubmenu.nodeType) {
                    oSubmenuConfig = oSubmenu;
                    oSubmenuConfig.lazyload = bLazyLoad;
                    oSubmenuConfig.parent = this;
                    oSubmenuConfig.id = oSubmenu.id; 
                    oSubmenuConfig.applyTo = oSubmenu.id; 
                    oMenu = new this.SUBMENU_TYPE(oSubmenuConfig);
                    oConfig.setProperty(_SUBMENU, oMenu, true);
                }
                else {
                     oMenu = new this.SUBMENU_TYPE({applyTo:oSubmenu, lazyload: bLazyLoad, parent: this});
                     oConfig.setProperty(_SUBMENU, oMenu, true);
                }
                if (oMenu) {
                    oMenu.cfg.setProperty(_PREVENT_CONTEXT_OVERLAP, true);
                    addClassNameForState.call(this, _HAS_SUBMENU);
                    if (oConfig.getProperty(_URL) === _HASH) {
                        oConfig.setProperty(_URL, (_HASH + oMenu.id));
                    }
                    this._oSubmenu = oMenu;
                    if (UA.opera) {
                        oMenu.on('beforeHide', this._onSubmenuBeforeHide, this, true);
                    }
                }
            }
            else {
                removeClassNameForState.call(this, _HAS_SUBMENU);
                if (this._oSubmenu) {
                    this._oSubmenu.destroy();
                }
            }
            if (oConfig.getProperty(_DISABLED)) {
                oConfig.refireEvent(_DISABLED);
            }
            if (oConfig.getProperty(_SELECTED)) {
                oConfig.refireEvent(_SELECTED);
            }
        },
        configOnClick: function(p_sType, p_aArgs, p_oItem) {
            var oObject = p_aArgs[0];
            if (this._oOnclickAttributeValue && (this._oOnclickAttributeValue != oObject)) {
                this.clickEvent.unOn(this._oOnclickAttributeValue.fn, this._oOnclickAttributeValue.obj);
                this._oOnclickAttributeValue = null;
            }
            if (!this._oOnclickAttributeValue && Rui.isObject(oObject) &&
            Rui.isFunction(oObject.fn)) {
                this.clickEvent.on(oObject.fn, ((_OBJ in oObject) ? oObject.obj : this),
                        ((_SCOPE in oObject) ? oObject.scope : null), {isCE:true});
                this._oOnclickAttributeValue = oObject;
            }
        },
        configClassName: function(p_sType, p_aArgs, p_oItem) {
            var sClassName = p_aArgs[0];
            if (this._sClassName) {
                Dom.removeClass(this.element, this._sClassName);
            }
            Dom.addClass(this.element, sClassName);
            this._sClassName = sClassName;
        },
        _dispatchClickEvent: function() {
            var oMenuItem = this,
            oAnchor,
            oEvent;
            if (!oMenuItem.cfg.getProperty(_DISABLED)) {
                oAnchor = Dom.getFirstChild(oMenuItem.element);
                if (UA.msie) {
                    oAnchor.fireEvent(_ONCLICK);
                }
                else {
                    if ((UA.gecko && UA.gecko >= 1.9) || UA.opera || UA.webkit) {
                        oEvent = document.createEvent("HTMLEvents");
                        oEvent.initEvent(_CLICK, true, true);
                    }
                    else {
                        oEvent = document.createEvent("MouseEvents");
                        oEvent.initMouseEvent(_CLICK, true, true, window, 0, 0, 0,
                        0, 0, false, false, false, false, 0, null);
                    }
                    oAnchor.dispatchEvent(oEvent);
                }
            }
        },
        _createKeyListener: function(type, args, keyData) {
            var oMenuItem = this,
            oMenu = oMenuItem.parent;
            var oKeyListener = new Rui.util.LKeyListener(
                                        oMenu.element.ownerDocument,
                                        keyData,
                                        {
                                            fn: oMenuItem._dispatchClickEvent,
                                            scope: oMenuItem,
                                            correctScope: true
                                        });
            if (oMenu.cfg.getProperty(_VISIBLE)) {
                oKeyListener.enable();
            }
            oMenu.on(_SHOW, oKeyListener.enable, null, oKeyListener);
            oMenu.on(_HIDE, oKeyListener.disable, null, oKeyListener);
            oMenuItem._keyListener = oKeyListener;
            oMenu.unOn(_SHOW, oMenuItem._createKeyListener, keyData);
        },
        configKeyListener: function(p_sType, p_aArgs) {
            var oKeyData = p_aArgs[0],
            oMenuItem = this,
            oMenu = oMenuItem.parent;
            if (oMenuItem._keyData) {
                oMenu.unOn(_SHOW,
                    oMenuItem._createKeyListener, oMenuItem._keyData);
                oMenuItem._keyData = null;
            }
            if (oMenuItem._keyListener) {
                oMenu.unOn(_SHOW, oMenuItem._keyListener.enable);
                oMenu.unOn(_HIDE, oMenuItem._keyListener.disable);
                oMenuItem._keyListener.disable();
                oMenuItem._keyListener = null;
            }
            if (oKeyData) {
                oMenuItem._keyData = oKeyData;
                oMenu.on(_SHOW, oMenuItem._createKeyListener,
                oKeyData, oMenuItem);
            }
        },
        initDefaultConfig: function() {
            var oConfig = this.cfg;
            oConfig.addProperty(
            TEXT_CONFIG.key,
            {
                handler: this.configText,
                value: TEXT_CONFIG.value,
                validator: TEXT_CONFIG.validator,
                suppressEvent: TEXT_CONFIG.suppressEvent
            }
        );
            oConfig.addProperty(
            HELP_TEXT_CONFIG.key,
            {
                handler: this.configHelpText,
                supercedes: HELP_TEXT_CONFIG.supercedes,
                suppressEvent: HELP_TEXT_CONFIG.suppressEvent
            }
        );
            oConfig.addProperty(
            URL_CONFIG.key,
            {
                handler: this.configURL,
                value: URL_CONFIG.value,
                suppressEvent: URL_CONFIG.suppressEvent
            }
        );
            oConfig.addProperty(
            TARGET_CONFIG.key,
            {
                handler: this.configTarget,
                suppressEvent: TARGET_CONFIG.suppressEvent
            }
        );
            oConfig.addProperty(
            EMPHASIS_CONFIG.key,
            {
                handler: this.configEmphasis,
                value: EMPHASIS_CONFIG.value,
                validator: EMPHASIS_CONFIG.validator,
                suppressEvent: EMPHASIS_CONFIG.suppressEvent,
                supercedes: EMPHASIS_CONFIG.supercedes
            }
        );
            oConfig.addProperty(
            STRONG_EMPHASIS_CONFIG.key,
            {
                handler: this.configStrongEmphasis,
                value: STRONG_EMPHASIS_CONFIG.value,
                validator: STRONG_EMPHASIS_CONFIG.validator,
                suppressEvent: STRONG_EMPHASIS_CONFIG.suppressEvent,
                supercedes: STRONG_EMPHASIS_CONFIG.supercedes
            }
        );
            oConfig.addProperty(
            CHECKED_CONFIG.key,
            {
                handler: this.configChecked,
                value: CHECKED_CONFIG.value,
                validator: CHECKED_CONFIG.validator,
                suppressEvent: CHECKED_CONFIG.suppressEvent,
                supercedes: CHECKED_CONFIG.supercedes
            }
        );
            oConfig.addProperty(
            DISABLED_CONFIG.key,
            {
                handler: this.configDisabled,
                value: DISABLED_CONFIG.value,
                validator: DISABLED_CONFIG.validator,
                suppressEvent: DISABLED_CONFIG.suppressEvent
            }
        );
            oConfig.addProperty(
            SELECTED_CONFIG.key,
            {
                handler: this.configSelected,
                value: SELECTED_CONFIG.value,
                validator: SELECTED_CONFIG.validator,
                suppressEvent: SELECTED_CONFIG.suppressEvent
            }
        );
            oConfig.addProperty(
            SUBMENU_CONFIG.key,
            {
                handler: this.configSubmenu,
                supercedes: SUBMENU_CONFIG.supercedes,
                suppressEvent: SUBMENU_CONFIG.suppressEvent
            }
        );
            oConfig.addProperty(
            ONCLICK_CONFIG.key,
            {
                handler: this.configOnClick,
                suppressEvent: ONCLICK_CONFIG.suppressEvent
            }
        );
            oConfig.addProperty(
            CLASS_NAME_CONFIG.key,
            {
                handler: this.configClassName,
                value: CLASS_NAME_CONFIG.value,
                validator: CLASS_NAME_CONFIG.validator,
                suppressEvent: CLASS_NAME_CONFIG.suppressEvent
            }
        );
            oConfig.addProperty(
            KEY_LISTENER_CONFIG.key,
            {
                handler: this.configKeyListener,
                value: KEY_LISTENER_CONFIG.value,
                suppressEvent: KEY_LISTENER_CONFIG.suppressEvent
            }
        );
        },
        getNextEnabledSibling: function() {
            var nGroupIndex,
            aItemGroups,
            oNextItem,
            nNextGroupIndex,
            aNextGroup,
            returnVal;
            function getNextArrayItem(p_aArray, p_nStartIndex) {
                return p_aArray[p_nStartIndex] || getNextArrayItem(p_aArray, (p_nStartIndex + 1));
            }
            if (this.parent instanceof LMenu) {
                nGroupIndex = this.groupIndex;
                aItemGroups = this.parent.getItemGroups();
                if (this.index < (aItemGroups[nGroupIndex].length - 1)) {
                    oNextItem = getNextArrayItem(aItemGroups[nGroupIndex],
                        (this.index + 1));
                }
                else {
                    if (nGroupIndex < (aItemGroups.length - 1)) {
                        nNextGroupIndex = nGroupIndex + 1;
                    }
                    else {
                        nNextGroupIndex = 0;
                    }
                    aNextGroup = getNextArrayItem(aItemGroups, nNextGroupIndex);
                    oNextItem = getNextArrayItem(aNextGroup, 0);
                }
                returnVal = (oNextItem.cfg.getProperty(_DISABLED) ||
                oNextItem.element.style.display == _NONE) ?
                oNextItem.getNextEnabledSibling() : oNextItem;
            }
            return returnVal;
        },
        getPreviousEnabledSibling: function() {
            var nGroupIndex,
            aItemGroups,
            oPreviousItem,
            nPreviousGroupIndex,
            aPreviousGroup,
            returnVal;
            function getPreviousArrayItem(p_aArray, p_nStartIndex) {
                return p_aArray[p_nStartIndex] || getPreviousArrayItem(p_aArray, (p_nStartIndex - 1));
            }
            function getFirstItemIndex(p_aArray, p_nStartIndex) {
                return p_aArray[p_nStartIndex] ? p_nStartIndex :
                getFirstItemIndex(p_aArray, (p_nStartIndex + 1));
            }
            if (this.parent instanceof LMenu) {
                nGroupIndex = this.groupIndex;
                aItemGroups = this.parent.getItemGroups();
                if (this.index > getFirstItemIndex(aItemGroups[nGroupIndex], 0)) {
                    oPreviousItem = getPreviousArrayItem(aItemGroups[nGroupIndex],
                        (this.index - 1));
                }
                else {
                    if (nGroupIndex > getFirstItemIndex(aItemGroups, 0)) {
                        nPreviousGroupIndex = nGroupIndex - 1;
                    }
                    else {
                        nPreviousGroupIndex = aItemGroups.length - 1;
                    }
                    aPreviousGroup = getPreviousArrayItem(aItemGroups,
                    nPreviousGroupIndex);
                    oPreviousItem = getPreviousArrayItem(aPreviousGroup,
                        (aPreviousGroup.length - 1));
                }
                returnVal = (oPreviousItem.cfg.getProperty(_DISABLED) ||
                oPreviousItem.element.style.display == _NONE) ?
                oPreviousItem.getPreviousEnabledSibling() : oPreviousItem;
            }
            return returnVal;
        },
        focus: function() {
            var oParent = this.parent,
            oAnchor = this._oAnchor,
            oActiveItem = oParent.activeItem;
            function setFocus() {
                try {
                    if (!(UA.msie && !document.hasFocus())) {
                        if (oActiveItem) {
                            oActiveItem.blurEvent.fire();
                        }
                        oAnchor.focus();
                        this.focusEvent.fire();
                    }
                }
                catch (e) {
                }
            }
            if (!this.cfg.getProperty(_DISABLED) && oParent && oParent.cfg.getProperty(_VISIBLE) &&
            this.element.style.display != _NONE) {
                Rui.later(0, this, setFocus);
            }
            return this;
        },
        blur: function() {
            var oParent = this.parent;
            if (!this.cfg.getProperty(_DISABLED) && oParent && oParent.cfg.getProperty(_VISIBLE)) {
                Rui.later(0, this, function() {
                    try {
                        this._oAnchor.blur();
                        this.blurEvent.fire();
                    }
                    catch (e) {
                    }
                }, 0);
            }
            return this;
        },
        hasFocus: function() {
            return (Rui.ui.menu.LMenuManager.getFocusedMenuItem() == this);
        },
        hasSubmenu: function() {
            return this._oSubmenu ? true : false;
        },
        getRootMenu: function() {
            var p = this.parent;
            var last_p = null;
            while (p) {
                last_p = p;
                p = p.parent;
            }
            return last_p;
        },
        destroy: function() {
            var oEl = this.element,
            oSubmenu,
            oParentNode,
            aEventData,
            i;
            if (oEl) {
                oSubmenu = this.cfg.getProperty(_SUBMENU);
                if (oSubmenu) {
                    oSubmenu.destroy();
                }
                oParentNode = oEl.parentNode;
                if (oParentNode) {
                    oParentNode.removeChild(oEl);
                    this.destroyEvent.fire();
                }
                i = EVENT_TYPES.length - 1;
                do {
                    aEventData = EVENT_TYPES[i];
                    this[aEventData[0]].unOnAll();
                }
                while (i--);
                this.cfg.configChangedEvent.unOnAll();
            }
            return this;
        },
        toString: function() {
            var sReturnVal = _MENUITEM,
            sId = this.id;
            if (sId) {
                sReturnVal += (_SPACE + sId);
            }
            return sReturnVal;
        },
        setText: function(text){
            this.cfg.setProperty(_TEXT,text);
            return this;
        },
        getText: function(){
            this.cfg.getProperty(_TEXT);
            return this;
        },
        setURL: function(url){
            this.cfg.setProperty(_URL,url);
            return this;
        },
        getURL: function(){
            this.cfg.getProperty(_URL);
            return this;
        },
        setTarget: function(target){
            this.cfg.setProperty(_TARGET,target);
            return this;
        },
        getTarget: function(){
            this.cfg.getProperty(_TARGET);
            return this;
        },
        check: function(){
            this.cfg.setProperty(_CHECKED,true);
            return this;
        },
        unCheck: function(){
            this.cfg.setProperty(_CHECKED,false);
            return this;
        },
        disable: function(){
            this.cfg.setProperty(_DISABLED,true);
            return this;
        },
        enable: function(){
            this.cfg.setProperty(_DISABLED,false);
            return this;
        },
        select: function(){
            this.cfg.setProperty(_SELECTED,true);
            return this;
        },
        unSelect: function(){
            this.cfg.setProperty(_SELECTED,false);
            return this;
        }
    };
    Rui.applyPrototype(LMenuItem, Rui.util.LEventProvider);
})();
(function()
{
        var _STATIC = "static",
        _DYNAMIC_STATIC = "dynamic," + _STATIC,
        _DISABLED = "disabled",
        _SELECTED = "selected",
        _AUTO_SUBMENU_DISPLAY = "autosubmenudisplay",
        _SUBMENU = "submenu",
        _VISIBLE = "visible",
        _SPACE = " ",
        _SUBMENU_TOGGLE_REGION = "submenutoggleregion",
        _MENUBAR = "LMenuBar";
    Rui.ui.menu.LMenuBar = function(oConfig)
    {
        oConfig = oConfig || {}; 
        Rui.ui.menu.LMenuBar.superclass.constructor.call(this, oConfig);
    };
    function checkPosition(p_sPosition)
    {
        var returnVal = false;
        if (Rui.isString(p_sPosition))
        {
            returnVal = (_DYNAMIC_STATIC.indexOf((p_sPosition.toLowerCase())) != -1);
        }
        return returnVal;
    }
    var Event = Rui.util.LEvent,
    LMenuBar = Rui.ui.menu.LMenuBar,
    POSITION_CONFIG = {
        key: "position",
        value: _STATIC,
        validator: checkPosition,
        supercedes: [_VISIBLE]
    },
    SUBMENU_ALIGNMENT_CONFIG = {
        key: "submenualignment",
        value: ["tl", "bl"]
    },
    AUTO_SUBMENU_DISPLAY_CONFIG = {
        key: _AUTO_SUBMENU_DISPLAY,
        value: false,
        validator: Rui.isBoolean,
        suppressEvent: true
    },
    SUBMENU_TOGGLE_REGION_CONFIG = {
        key: _SUBMENU_TOGGLE_REGION,
        value: false,
        validator: Rui.isBoolean
    };
    Rui.extend(LMenuBar, Rui.ui.menu.LMenu, {
        otype: "Rui.ui.menu.LMenuBar",
         initDefaultConfig: function() {
             LMenuBar.superclass.initDefaultConfig.call(this); 
         }, 
          initComponent: function(config){
              LMenuBar.superclass.initComponent.call(this,config); 
          },
          initEvents: function() {
              LMenuBar.superclass.initEvents.call(this); 
               if (!this.ITEM_TYPE)
               {
                   this.ITEM_TYPE = Rui.ui.menu.LMenuBarItem;
               }
          },
           createContainer: function() {
               return LMenuBar.superclass.createContainer.call(this); 
           },
       afterRender: function(container) {
           LMenuBar.superclass.afterRender.call(this,container);
       }, 
        CSS_CLASS_NAME: "L-ruimenubar",
        SUBMENU_TOGGLE_REGION_WIDTH: 20,
        _onKeyDown: function(p_sType, p_aArgs, p_oMenuBar)
        {
            var oEvent = p_aArgs[0],
            oItem = p_aArgs[1],
            oSubmenu,
            oItemCfg,
            oNextItem;
            if (oItem && !oItem.cfg.getProperty(_DISABLED))
            {
                oItemCfg = oItem.cfg;
                switch (oEvent.keyCode)
                {
                    case 37:    
                    case 39:    
                        if (oItem == this.activeItem && !oItemCfg.getProperty(_SELECTED))
                        {
                            oItemCfg.setProperty(_SELECTED, true);
                            if(Rui.useAccessibility())
                                oItemCfg.setAttribute('aria-selected', 'true');
                        }
                        else
                        {
                            oNextItem = (oEvent.keyCode == 37) ?
                            oItem.getPreviousEnabledSibling() :
                            oItem.getNextEnabledSibling();
                            if (oNextItem)
                            {
                                this.clearActiveItem();
                                oNextItem.cfg.setProperty(_SELECTED, true);
                                if(Rui.useAccessibility())
                                    oNextItem.setAttribute('aria-selected', 'true');
                                oSubmenu = oNextItem.cfg.getProperty(_SUBMENU);
                                if (oSubmenu)
                                {
                                    oSubmenu.show();
                                    oSubmenu.setInitialFocus();
                                }
                                else
                                {
                                    oNextItem.focus();
                                }
                            }
                        }
                        Event.preventDefault(oEvent);
                        break;
                    case 40:    
                        if (this.activeItem != oItem)
                        {
                            this.clearActiveItem();
                            oItemCfg.setProperty(_SELECTED, true);
                            if(Rui.useAccessibility())
                                oItemCfg.setAttribute('aria-selected', 'true');
                            oItem.focus();
                        }
                        oSubmenu = oItemCfg.getProperty(_SUBMENU);
                        if (oSubmenu)
                        {
                            if (oSubmenu.cfg.getProperty(_VISIBLE))
                            {
                                oSubmenu.setInitialSelection();
                                oSubmenu.setInitialFocus();
                            }
                            else
                            {
                                oSubmenu.show();
                                oSubmenu.setInitialFocus();
                            }
                        }
                        Event.preventDefault(oEvent);
                        break;
                }
            }
            if (oEvent.keyCode == 27 && this.activeItem)
            { 
                oSubmenu = this.activeItem.cfg.getProperty(_SUBMENU);
                if (oSubmenu && oSubmenu.cfg.getProperty(_VISIBLE))
                {
                    oSubmenu.hide();
                    this.activeItem.focus();
                }
                else
                {
                    this.activeItem.cfg.setProperty(_SELECTED, false);
                    if(Rui.useAccessibility())
                        oItemCfg.setAttribute('aria-selected', 'false');
                    this.activeItem.blur();
                }
                Event.preventDefault(oEvent);
            }
        },
        _onClick: function(p_sType, p_aArgs, p_oMenuBar)
        {
            LMenuBar.superclass._onClick.call(this, p_sType, p_aArgs, p_oMenuBar);
            var oItem = p_aArgs[1],
                bReturnVal = true,
                oItemEl,
                oEvent,
                oActiveItem,
                oConfig,
                oSubmenu,
                nMenuItemX,
                nToggleRegion;
            var toggleSubmenuDisplay = function()
            {
                if (oSubmenu.cfg.getProperty(_VISIBLE))
                {
                    oSubmenu.hide();
                }
                else
                {
                    oSubmenu.show();
                }
            };
            if (oItem && !oItem.cfg.getProperty(_DISABLED))
            {
                oEvent = p_aArgs[0];
                oActiveItem = this.activeItem;
                oConfig = this.cfg;
                if (oActiveItem && oActiveItem != oItem)
                {
                    this.clearActiveItem();
                }
                oItem.cfg.setProperty(_SELECTED, true);
                if(Rui.useAccessibility())
                    oItemCfg.setAttribute('aria-selected', 'true');
                oSubmenu = oItem.cfg.getProperty(_SUBMENU);
                if (oSubmenu)
                {
                    oItemEl = oItem.element;
                    nMenuItemX = Rui.util.LDom.getX(oItemEl);
                    nToggleRegion = nMenuItemX + (oItemEl.offsetWidth - this.SUBMENU_TOGGLE_REGION_WIDTH);
                    if (oConfig.getProperty(_SUBMENU_TOGGLE_REGION))
                    {
                        if (Event.getPageX(oEvent) > nToggleRegion)
                        {
                            toggleSubmenuDisplay();
                            Event.preventDefault(oEvent);
                            bReturnVal = false;
                        }
                    }
                    else
                    {
                        toggleSubmenuDisplay();
                    }
                }
            }
            return bReturnVal;
        },
        configSubmenuToggle: function(p_sType, p_aArgs)
        {
            var bSubmenuToggle = p_aArgs[0];
            if (bSubmenuToggle)
            {
                this.cfg.setProperty(_AUTO_SUBMENU_DISPLAY, false);
            }
        },
        toString: function()
        {
            var sReturnVal = _MENUBAR,
            sId = this.id;
            if (sId)
            {
                sReturnVal += (_SPACE + sId);
            }
            return sReturnVal;
        },
        initDefaultConfig: function()
        {
            LMenuBar.superclass.initDefaultConfig.call(this);
            var oCfg = this.cfg;
            oCfg.addProperty(
                POSITION_CONFIG.key,
                {
                    handler: this.configPosition,
                    value: POSITION_CONFIG.value,
                    validator: POSITION_CONFIG.validator,
                    supercedes: POSITION_CONFIG.supercedes
                }
            );
            oCfg.addProperty(
                SUBMENU_ALIGNMENT_CONFIG.key,
                {
                    value: SUBMENU_ALIGNMENT_CONFIG.value,
                    suppressEvent: SUBMENU_ALIGNMENT_CONFIG.suppressEvent
                }
            );
            oCfg.addProperty(
               AUTO_SUBMENU_DISPLAY_CONFIG.key,
               {
                   value: AUTO_SUBMENU_DISPLAY_CONFIG.value,
                   validator: AUTO_SUBMENU_DISPLAY_CONFIG.validator,
                   suppressEvent: AUTO_SUBMENU_DISPLAY_CONFIG.suppressEvent
               }
            );
            oCfg.addProperty(
               SUBMENU_TOGGLE_REGION_CONFIG.key,
               {
                   value: SUBMENU_TOGGLE_REGION_CONFIG.value,
                   validator: SUBMENU_TOGGLE_REGION_CONFIG.validator,
                   handler: this.configSubmenuToggle
               }
            );
        }
    }); 
} ());
Rui.ui.menu.LMenuBarItem = function(p_oObject, p_oConfig)
{
    Rui.ui.menu.LMenuBarItem.superclass.constructor.call(this, p_oObject, p_oConfig);
};
Rui.extend(Rui.ui.menu.LMenuBarItem, Rui.ui.menu.LMenuItem, {
    init: function(p_oObject, p_oConfig)
    {
        if (!this.SUBMENU_TYPE)
        {
            this.SUBMENU_TYPE = Rui.ui.menu.LMenu;
        }
        Rui.ui.menu.LMenuBarItem.superclass.init.call(this, p_oObject);
        var oConfig = this.cfg;
        if (p_oConfig)
        {
            oConfig.applyConfig(p_oConfig, true);
        }
        oConfig.fireQueue();
    },
    CSS_CLASS_NAME: "L-ruimenubaritem",
    CSS_LABEL_CLASS_NAME: "L-ruimenubaritemlabel",
    toString: function()
    {
        var sReturnVal = "LMenuBarItem";
        if (this.cfg && this.cfg.getProperty("text"))
        {
            sReturnVal += (": " + this.cfg.getProperty("text"));
        }
        return sReturnVal;
    }
}); 
Rui.namespace('Rui.ui.menu');
(function(){
    var _XY = 'xy',
        _MOUSEDOWN = 'mousedown',
        _CONTEXTMENU = 'LContextMenu',
        _SPACE = ' ';
    Rui.ui.menu.LContextMenu = function(config){
        config = config || {}; 
        Rui.ui.menu.LContextMenu.superclass.constructor.call(this, config);
        Rui.applyObject(this, config, true);
    };
    var Event = Rui.util.LEvent,
    UA = Rui.browser,
    LContextMenu = Rui.ui.menu.LContextMenu;
    EVENT_TYPES = {
        'TRIGGER_CONTEXT_MENU': 'triggerContextMenu',
        'CONTEXT_MENU': (UA.opera ? _MOUSEDOWN : 'contextmenu'),
        'CLICK': 'click'
    },
    TRIGGER_CONFIG = {
        key: 'trigger',
        suppressEvent: true
    };
    function position(p_sType, p_aArgs, p_aPos){
        this.cfg.setProperty(_XY, p_aPos);
    }
    Rui.extend(Rui.ui.menu.LContextMenu, Rui.ui.menu.LMenu, {
        otype: 'Rui.ui.menu.LContextMenu',
        _oTrigger: null,
        _bCancelled: false,
        _defaultContextMenu: true,
        contextEventTarget: null,
        initDefaultConfig: function(){
            Rui.ui.menu.LContextMenu.superclass.initDefaultConfig.call(this);
            this.cfg.addProperty(TRIGGER_CONFIG.key, {
                    handler: this.configTrigger,
                    suppressEvent: TRIGGER_CONFIG.suppressEvent
                }
            );
        },
        initEvents: function(){
            Rui.ui.menu.LContextMenu.superclass.initEvents.call(this);
            this.createEvent('triggerContextMenu'); 
            this._on('show', function(e){
                if(this._defaultContextMenu == false) this.hide();
            }, this, true);
        },
        cancel: function(defaultContextMenu){
            defaultContextMenu = Rui.isUndefined(defaultContextMenu) ? true : defaultContextMenu;
            if (defaultContextMenu == false) {
                this._defaultContextMenu = false;
            } else {
                this._bCancelled = true;
                this._defaultContextMenu = false;
            }
            return this;
        },
        _removeEventHandlers: function() {
            var oTrigger = this._oTrigger;
            if (oTrigger)
            {
                Event.removeListener(oTrigger, EVENT_TYPES.CONTEXT_MENU, this._onTriggerContextMenu);
                if (UA.opera)
                {
                    Event.removeListener(oTrigger, EVENT_TYPES.CLICK, this._onTriggerClick);
                }
            }
        },
        _onTriggerClick: function(p_oEvent, p_oMenu) {
            if (p_oEvent.ctrlKey) {
                Event.stopEvent(p_oEvent);
            }
        },
        _onTriggerContextMenu: function(p_oEvent, p_oMenu){
            var aXY;
            this._defaultContextMenu = true;
            if (!(p_oEvent.type == _MOUSEDOWN && !p_oEvent.ctrlKey)) {
                this.contextEventTarget = Event.getTarget(p_oEvent);
                this.fireEvent('triggerContextMenu', {target: p_oEvent});
                if (!this._bCancelled) {
                    Event.stopEvent(p_oEvent);
                    Rui.ui.menu.LMenuManager.hideVisible();
                    aXY = Event.getXY(p_oEvent);
                    if (!Rui.util.LDom.inDocument(this.element)) {
                        this.on('beforeShow', position, aXY, true);
                    } else {
                        this.cfg.setProperty(_XY, aXY);
                    }
                    this.cfg.setProperty('zindex', 99999);
                    this.show(); 
                }
                this._bCancelled = false;
            }
        },
        _onHide: function(p_sType, p_aArgs) {
            LContextMenu.superclass._onHide.call(this, p_sType, p_aArgs);
            this.cfg.setProperty('zindex', 1);
        },
        toString: function(){
            var sReturnVal = _CONTEXTMENU,
            sId = this.id;
            if (sId) {
                sReturnVal += (_SPACE + sId);
            }
            return sReturnVal;
        },
        destroy: function(){
            this._removeEventHandlers();
            LContextMenu.superclass.destroy.call(this);
            return this;
        },
        configTrigger: function(p_sType, p_aArgs, p_oMenu){
            var oTrigger = p_aArgs[0];
            if (oTrigger) {
                if (this._oTrigger)
                {
                    this._removeEventHandlers();
                }
                this._oTrigger = oTrigger;
                Event.on(oTrigger, EVENT_TYPES.CONTEXT_MENU, this._onTriggerContextMenu, this, true);
                if (UA.opera) {
                    Event.on(oTrigger, EVENT_TYPES.CLICK, this._onTriggerClick, this, true);
                }
            } else {
                this._removeEventHandlers();
            }
        }
    });
} ());
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
if(!Rui.ui.LUnorderedListNode){
Rui.ui.LUnorderedListNode = function (config) {
    Rui.applyObject(this, config);
    this.init();
};
Rui.ui.LUnorderedListNode.prototype = {
    el: null,
    otype: 'Rui.ui.LUnorderedListNode',
    recordId: null,
    idValue: null,
    depth: null,
    dom: null,
    isLeaf: null,
    unorderList: null,
    NODE_STATE: null,
    useAnimation: false,
    useCollapseAllSibling: false,
    childULHeight: 0,
    init: function () {
        this.dom = this.dom.tagName.toLowerCase() == 'li' ? this.dom.firstChild : this.dom;
        this.el = Rui.get(this.dom);
        this.NODE_STATE = this.unorderList.NODE_STATE;
        this.recordId = this.unorderList.getRecordId(this.dom);
        var depth = Rui.util.LDom.findStringInClassName(this.dom, this.unorderList.CLASS_UL_LI_DIV_DEPTH + '-');
        this.depth = depth == 'null' ? false : parseInt(depth);
        this.initIsLeaf();
    },
    initIsLeaf: function () {
        var isLeaf = true;
        var record = this.unorderList.dataSet.get(this.recordId);
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
    getRecordId: function () {
        return this.recordId;
    },
    getParentId: function () {
        var record = this.getRecord();
        return record ? record.get(this.unorderList.fields.parentId) : undefined;
    },
    getParentNode: function(){
    	if(this.getDepth() > 0){
    		var parentDom = this.getParentDom();
    		if(parentDom)
    			return this.unorderList.createNodeObject(parentDom);
    	}
    	return false;
    },
    getIdValue: function () {
        var record = this.getRecord();
        this.idValue = record ? record.get(this.unorderList.fields.id) : undefined;
        return this.idValue;
    },
    getRecord: function () {
        return this.unorderList.dataSet.get(this.getRecordId());
    },
    getRow: function () {
        return this.unorderList.dataSet.indexOfKey(this.getRecordId());
    },
    getDepth: function () {
        return this.depth;
    },
    hasChild: function () {
        return !this.isLeaf;
    },
    isFocus: function () {
        return this.checkNodeState(this.NODE_STATE.FOCUS);
    },
    focus: function () {
        this.changeStateTo(this.NODE_STATE.FOCUS);
        if(this.isTop()) this.changeStateTo(this.NODE_STATE.FOCUS_TOP);
    },
    unfocus: function () {
        this.changeStateTo(this.NODE_STATE.UNFOCUS);
    },
    isMarked: function () {
        return this.checkNodeState(this.NODE_STATE.MARK);
    },
    mark: function () {
        this.changeStateTo(this.NODE_STATE.MARK);
        if(this.getRecord().treeType == 'child'){
            this.unorderList.markChilds(true, this.getRecord());
        }
        else if (this.getRecord().treeType == 'parent'){
            this.unorderList.markParents(true, this);
        }
    },
    unmark: function () {
        this.changeStateTo(this.NODE_STATE.UNMARK);
        if(this.getRecord().treeType == 'child'){
            this.unorderList.markChilds(false, this.getRecord());
        }
        else if (this.getRecord().treeType == 'parent'){
            this.unorderList.markParents(false, this);
        }
    },
    isLast: function () {
        return this.checkNodeState(this.NODE_STATE.last);
    },
    isTop: function(){
        return this.depth == 0 ? true : false;
    },
    isExpand: function () {
        return this.checkNodeState(this.NODE_STATE.OPEN);
    },
    isCollaps: function () {
        return this.checkNodeState(this.NODE_STATE.CLOSE);
    },
    open: function (refresh) {
        var nodeInfos = new Array();
        if(refresh) this.removeChildUL(undefined,refresh);
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
    renderChild: function(nodeInfos,refresh){
        if (nodeInfos.length > 0) {
            this.addChildNodes(nodeInfos,refresh);
            this.changeStateTo(this.NODE_STATE.OPEN);
        } else {
            this.changeStateTo(this.NODE_STATE.HAS_NO_CHILD);
        }
    },
    close: function () {
        this.changeStateTo(this.NODE_STATE.CLOSE);
        this.removeChildUL();
    },
    syncLabel: function () {
        this.el.html(this.unorderList.getContent(this.getRecord()));
    },
    toggleChild: function () {
        if (this.isExpand()) {
            this.close();
        } else if (this.isCollaps()) {
            this.open();
        }
    },
    expand: function(){
        if(this.isCollaps()) this.open();
    },
    collapse: function(){
        if(this.isExpand()) this.close();
    },
    collapseAllSibling: function(){
        var ul = this.getUL();
        for (var i=0;i<ul.childNodes.length;i++){
            if(ul.childNodes[i].firstChild !== this.dom)
                this.unorderList.getNodeObject(ul.childNodes[i]).collapse();
        }
    },
    getOrder : function(){
        if(this.unorderList.fields.order) return this.getRecord().get(this.unorderList.fields.order); else return null;
    },
    getChildUL: function (dom) {
        return this.unorderList.getChildUL(dom ? dom : this.dom);
    },
    getChildULHeight : function(){
        return this.childULHeight;
    },
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
    getUL: function (dom) {
        return this.unorderList.getUL(dom ? dom : this.dom);
    },
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
    getLi: function (dom) {
        dom = dom ? dom : this.dom;
        return dom.parentNode;
    },
    getParentLi: function (dom) {
        dom = dom ? dom : this.dom;
        var li = dom.parentNode.parentNode.parentNode;
        li = li && li.tagName && li.tagName.toLowerCase() == 'li' ? li : null;
        return li;
    },
    getPreviousLi: function (dom) {
        dom = dom ? dom : this.dom;
        var li = this.getLi(dom);
        return Rui.util.LDom.getPreviousSibling(li);
    },
    getNextLi: function (dom) {
        dom = dom ? dom : this.dom;
        var li = this.getLi(dom);
        return Rui.util.LDom.getNextSibling(li);
    },
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
    getLastChildDom: function () {
        var ul = this.getChildUL();
        if (ul) return ul.lastChild.firstChild; else return null;
    },
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
    getParentDoms: function(exceptCurrent){
        var parentDoms = new Array();
        var dom = this.dom;
        if(exceptCurrent !== true) parentDoms.push(dom);
        for (var i=0;i<100;i++){
            dom = this.getParentDom(dom);
            if(dom) parentDoms.push(dom); else break;
        }
        return parentDoms;
    },
    addChildNodes: function (nodeInfos,refresh) {
        if (nodeInfos && nodeInfos.length > 0) {
            this.changeStateTo(this.NODE_STATE.HAS_CHILD);
            this.isLeaf = false;
            var ulDom = this.unorderList.htmlToDom(this.unorderList.getUlHtml(null, this.depth, nodeInfos));
            var ulEl = Rui.get(ulDom);
            if (!refresh || !this.isExpand()) {
                ulEl.setStyle('display', 'none');
            }
            this.el.parent().appendChild(ulDom);
            var wh = ulEl.getDimensions(); 
            this.childULHeight = wh.height;
            if (!refresh || !this.isExpand()) {
                if (this.useAnimation && (this.useAnimation === true || this.useAnimation.expand === true)) {
                    ulEl.setStyle('height', '1px');
                    ulEl.setStyle('display', '');
                    ulEl.setStyle('overflow', 'hidden');
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
    getChildNodes: function() {
        var records = [];
        if (this.unorderList)
            records = this.unorderList.getChildRecords(this.getIdValue(), this.childDataSet);
        return records;
    },
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
Rui.namespace('Rui.ui.menu');
Rui.ui.menu.LSlideMenu = function(oConfig){
    var config = oConfig || {};
    config = Rui.applyIf(config, Rui.getConfig().getFirst('$.ext.slideMenu.defaultProperties'));
    config.onlyOneTopOpen = config.onlyOneTopOpen !== undefined ? config.onlyOneTopOpen : config.onlyOneActiveMenuMode;
    config.defaultOpenTopIndex = config.defaultOpenTopIndex !== undefined ? config.defaultOpenTopIndex : config.defaultShowIndex;
    Rui.ui.menu.LSlideMenu.superclass.constructor.call(this, config);   
};
Rui.extend(Rui.ui.menu.LSlideMenu, Rui.ui.LUnorderedList, {
    otype: 'Rui.ui.menu.LSlideMenu',
    CSS_BASE: 'L-ul L-ul-slidemenu',
    accessibilityELRole: 'menubar',
    getAccessibilityUlRole: function(depth){
        if(depth == 0)
            return 'menubar';
        return 'menu';
    },
    getAccessibilityLiRole: function(){
        return 'menuitem';
    },
    createNodeObject: function(dom){
        return new Rui.ui.menu.LSlideMenuNode({
            useAnimation: this.useAnimation,
            unorderList: this,
            dom: dom
        });
    }
});
Rui.ui.menu.LSlideMenuNode = function(config){
    Rui.ui.menu.LSlideMenuNode.superclass.constructor.call(this, config);
};
Rui.extend(Rui.ui.menu.LSlideMenuNode, Rui.ui.LUnorderedListNode, {
    otype: 'Rui.ui.menu.LSlideMenuNode'
});
Rui.namespace('Rui.ui.menu');
Rui.ui.menu.LTabMenu = function(config){
    config = config || {};
    config = Rui.applyIf(config, Rui.getConfig().getFirst('$.ext.tabMenu.defaultProperties'));
    if(Rui.platform.isMobile){
    	config.expandOnOver = false;
    }
    Rui.ui.menu.LTabMenu.superclass.constructor.call(this, config);
    this.createEvent('nodeOver');
    this.createEvent('nodeOut');
    this.createEvent('nodeLazyCollapsed');
};
Rui.extend(Rui.ui.menu.LTabMenu, Rui.ui.LUnorderedList, {
    otype: 'Rui.ui.menu.LTabMenu',
    expandOnOver: false,
     accessibilityELRole: 'menubar',
     CSS_BASE: 'L-ul L-ul-tabmenu',
     CLASS_UL_TABMENU_CONTENT: 'L-ul-tabmenu-content',
    createNodeObject: function(dom){
        return new Rui.ui.menu.LTabMenuNode({
            unorderList: this,
            dom: dom,
            useAnimation: this.useAnimation,
            useCollapseAllSibling: true
        });
    },
    getContent: function(record, nodeStateClass, isMarked){
        return '<div class="' + this.CLASS_UL_TABMENU_CONTENT + '">' + this.getLabel(record, nodeStateClass) + '</div>';
    },
    toggleChild: function(node){
        node.expand();
    },
    afterRender: function(container){
        Rui.ui.menu.LTabMenu.superclass.afterRender.call(this, container);
        if(this.expandOnOver === true){
            this.el.unOn('mouseover', this.onMouseOver, this);
            this.el.on('mouseover', this.onMouseOver, this, true);
        }
    },
    getAccessibilityUlRole: function(depth){
        if(depth == 0)
            return 'menubar';
        return 'menu';
    },
    getAccessibilityLiRole: function(){
        return 'menuitem';
    },
    onMouseOver: function(e){
        var node = this.findNodeByDom(e.target);
        if (node) {
            if(node !== this.currentFocus)
                this.dataSet.setRow(node.getRow());
            Rui.get(node.dom).addClass('L-hover');
            this.fireEvent('nodeOver', {
                target: this,
                node: node,
                dom: e.target
            });
            if(this._beforeNode && this._beforeNode.getDepth() == node.getDepth()){
                this._beforeNode.collapse();
            }
            if(!node.isExpand())
                node.expand();
            this._beforeNode = node;
            var depth = node.getDepth();
            if(depth == 0){
                this.currentZeroNode = node;
            }
            if(!this.isFocus && this.expandOnOver)
            	this.onCheckFocus.call(this, e);
        }
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
                if(node === this.currentFocus && this.expandOnOver !== true){
                    if(node.isExpand()){
                        this.dataSet.setRow(node.getRow());
                        node.collapse();
                    }else{
                        node.expand();
                    }
                }else{
                    if(this.currentFocus && this.currentFocus.depth > 0 && this.currentFocus.getParentNode().dom == node.dom){
                        if(node.isExpand()){
                            this.dataSet.setRow(node.getRow());
                            node.collapse();
                        }
                    }else{
                        this.dataSet.setRow(node.getRow());
                        node.expand();
                    }
                }
            }
        }
    },
    onBlur: function(e) {
    	var node = this.getFocusNode();
    	if(node){
    		if(node.depth == 0)
    			node.collapse();
    		else{
    			while (true){
    			    node = node.getParentNode();
    			    if(node && node.depth == 0){
                        this.dataSet.setRow(node.getRow());
    			    	node.collapse();
    			    	break;
    			    }
    			}
    		}
    	}
        Rui.ui.LUnorderedList.superclass.onBlur.call(this, e);
    }
});
Rui.ui.menu.LTabMenuNode = function(config){
    Rui.ui.menu.LTabMenuNode.superclass.constructor.call(this, config);
};
Rui.extend(Rui.ui.menu.LTabMenuNode, Rui.ui.LUnorderedListNode, {
    otype: 'Rui.ui.menu.LTabMenuNode'
});
