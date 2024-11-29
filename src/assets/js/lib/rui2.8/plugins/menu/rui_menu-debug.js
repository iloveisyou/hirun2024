/*
 * @(#) rui_menu-debug.js
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
/**
* @description
* LMenuManager
* @module ui_menu
* @title LMenuManager
* @namespace Rui.ui.menu
*/
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

    /**
    * @description Singleton that manages a collection of all menus and menu items.  Listens 
    * for DOM events at the document level and dispatches the events to the 
    * corresponding menu or menu item.
    * @plugin /ui/menu/rui_menu.js,/ui/menu/rui_menu.css
    * @namespace Rui.ui.menu
    * @class LMenuManager
    * @static
    */
    Rui.ui.menu.LMenuManager = function()
    {
        // Private member variables

        // Flag indicating if the DOM event handlers have been attached
        var m_bInitializedEventHandlers = false,

        // Collection of menus
        m_oMenus = {},

        // Collection of visible menus
        m_oVisibleMenus = {},

        //  Collection of menu items 
        m_oItems = {},

        // Map of DOM event types to their equivalent LCustomEvent types
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

        // The element in the DOM that currently has focus
        m_oFocusedElement = null,
        m_oFocusedMenuItem = null;

        // Private methods

        /**
        * @description Finds the root DIV node of a menu or the root LI node of 
        * a menu item.
        * @method getMenuRootElement
        * @private
        * @param {Object} p_oElement <a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/
        * level-one-html.html#ID-58190037">HTMLElement</a> 
        * specifying an HTML element.
        */
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

                        // Check if the DIV is the inner "body" node of a menu
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


        // Private event handlers

        /**
        * @description Generic, global event handler for all of a menu's 
        * DOM-based events.  This listens for events against the document 
        * object.  If the target of a given event is a member of a menu or 
        * menu item's DOM, the instance's corresponding Custom Event is fired.
        * @method onDOMEvent        
        * @private
        * @param {Event} p_oEvent Object representing the DOM event object  
        * passed back by the event utility (Rui.util.LEvent).
        */
        function onDOMEvent(p_oEvent)
        {
            // Get the target node of the DOM event
            var oTarget = Event.getTarget(p_oEvent),
           
            // See if the target of the event was a menu, or a menu item
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
                
                // Fire the Custom Event that corresponds the current DOM event    
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
                /*
                If the target of the event wasn't a menu, hide all 
                dynamically positioned menus
                */
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

        /**
        * @description "destroy" event handler for a menu.
        * @method onMenuDestroy        
        * @private
        * @param {String} p_sType String representing the name of the event 
        * that was fired.
        * @param {Array} p_aArgs Array of arguments sent when the event 
        * was fired.
        * @param {Rui.ui.menu.LMenu} p_oMenu The menu that fired the event.
        */
        function onMenuDestroy(e)
        {
            if (m_oMenus[e.target.id])
            {
                this.removeMenu(e.target);
            }
        }

        /**
        * @description "focus" event handler for a LMenuItem instance.
        * @method onMenuFocus        
        * @private
        * @param {String} p_sType String representing the name of the event 
        * that was fired.
        * @param {Array} p_aArgs Array of arguments sent when the event 
        * was fired.
        */
        function onMenuFocus(e)
        {
            var oItem = e.item; 

            if (oItem)
            {
                m_oFocusedMenuItem = oItem;
            }
        }
   

        /**
        * @description "blur" event handler for a LMenuItem instance.
        * @method onMenuBlur        
        * @private
        * @param {String} p_sType String representing the name of the event  
        * that was fired.
        * @param {Array} p_aArgs Array of arguments sent when the event 
        * was fired.
        */
        function onMenuBlur(e)
        {
            m_oFocusedMenuItem = null;
        }

        /**
        * @description "hide" event handler for a LMenu instance.
        * @method onMenuHide        
        * @private
        * @param {String} p_sType String representing the name of the event  
        * that was fired.
        * @param {Array} p_aArgs Array of arguments sent when the event 
        * was fired.
        * @param <a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/
        * level-one-html.html#ID-58190037">p_oFocusedElement</a> The HTML element that had focus
        * prior to the LMenu being made visible
        */
        function onMenuHide(e) {
            
            var me = e.target; 
            /*
            Restore focus to the element in the DOM that had focus prior to the LMenu 
            being made visible
            */
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
            //me.unOn('hide', onMenuHide, me);
           
        }

        /**
        * @description "show" event handler for a LMenuItem instance.
        * @method onMenuShow        
        * @private
        * @param {String} p_sType String representing the name of the event  
        * that was fired.
        * @param {Array} p_aArgs Array of arguments sent when the event 
        * was fired.
        */
        function onMenuShow(e)
        {
            var me = e.target; 
            /*
            Dynamically positioned, root Menus focus themselves when visible, and will then, 
            when hidden, restore focus to the UI control that had focus before the LMenu was 
            made visible
            */
            if (me === me.getRoot() && me.cfg.getProperty(_POSITION) === _DYNAMIC)
            {
                // comment by sglee because scope error occurred!!! 
               // this.on('hide', onMenuHide, m_oFocusedElement,true);
                   me.on('hide', onMenuHide, this, true);
                me.focus();
            }
        }

        /**
        * @description Event handler for when the "visible" configuration  
        * property of a LMenu instance changes.
        * @method onMenuVisibleConfigChange        
        * @private
        * @param {String} p_sType String representing the name of the event  
        * that was fired.
        * @param {Array} p_aArgs Array of arguments sent when the event 
        * was fired.
        */
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

        /**
        * @description "destroy" event handler for a LMenuItem instance.
        * @method onItemDestroy        
        * @private
        * @param {String} p_sType String representing the name of the event  
        * that was fired.
        * @param {Array} p_aArgs Array of arguments sent when the event 
        * was fired.
        */
        function onItemDestroy(p_sType, p_aArgs)
        {
            removeItem(this);
        }

        /**
        * @description Removes a LMenuItem instance from the LMenuManager's collection of MenuItems.
        * @method removeItem        
        * @private
        * @param {LMenuItem} p_oMenuItem The LMenuItem instance to be removed.
        */
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

        /**
        * @description "itemadded" event handler for a LMenu instance.
        * @method onItemAdded        
        * @private
        * @param {String} p_sType String representing the name of the event  
        * that was fired.
        * @param {Array} p_aArgs Array of arguments sent when the event 
        * was fired.
        */
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
        
        //instance return, public method등이 정의되어 있다.
        return {

            // Privileged methods

        /**            
        * @description Adds a menu to the collection of known menus.
        * @method addMenu            
        * @param {Rui.ui.menu.LMenu} p_oMenu Object specifying the LMenu  
        * instance to be added.
        */
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

            /**
            * @description Removes a menu from the collection of known menus.
            * @method removeMenu            
            * @param {Rui.ui.menu.LMenu} p_oMenu Object specifying the LMenu  
            * instance to be removed.
            */
            removeMenu: function(p_oMenu)
            {
                var sId, aItems, i;

                if (p_oMenu)
                {
                    sId = p_oMenu.id;

                    if ((sId in m_oMenus) && (m_oMenus[sId] == p_oMenu))
                    {
                        // Unregister each menu item
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

                        // Unregister the menu
                        delete m_oMenus[sId];

                        /*
                        Unregister the menu from the collection of 
                        visible menus
                        */
                        if ((sId in m_oVisibleMenus) && (m_oVisibleMenus[sId] == p_oMenu))
                        {
                            delete m_oVisibleMenus[sId];
                        }

                        // Unsubscribe event listeners
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

            /**
            * @description Hides all visible, dynamically positioned menus 
            * (excluding instances of Rui.ui.menu.LMenuBar).
            * @method hideVisible            
            */
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

            /**
            * @description Returns a collection of all visible menus registered with the menu manger.
            * @method getVisible            
            * @return {Object}
            */
            getVisible: function()
            {
                return m_oVisibleMenus;
            },

            /**
            * @description Returns a collection of all menus registered with the menu manger.
            * @method getMenus            
            * @return {Object}
            */
            getMenus: function()
            {
                return m_oMenus;
            },

            /**
            * @description Returns a menu with the specified id.
            * @method getMenu            
            * @param {String} p_sId String specifying the id of the 
            * <code>&#60;div&#62;</code> element representing the menu to
            * be retrieved.
            * @return {Rui.ui.menu.LMenu}
            */
            getMenu: function(p_sId)
            {
                var returnVal;

                if (p_sId in m_oMenus)
                {
                    returnVal = m_oMenus[p_sId];
                }

                return returnVal;
            },

            /**
            * @description Returns a menu item with the specified id.
            * @method getMenuItem            
            * @param {String} p_sId String specifying the id of the 
            * <code>&#60;li&#62;</code> element representing the menu item to
            * be retrieved.
            * @return {Rui.ui.menu.LMenuItem}
            */
            getMenuItem: function(p_sId)
            {
                var returnVal;

                if (p_sId in m_oItems)
                {
                    returnVal = m_oItems[p_sId];
                }

                return returnVal;
            },

            /**
            * @description Returns an array of menu item instances whose 
            * corresponding <code>&#60;li&#62;</code> elements are child 
            * nodes of the <code>&#60;ul&#62;</code> element with the 
            * specified id.
            * @param {String} p_sId String specifying the id of the 
            * <code>&#60;ul&#62;</code> element representing the group of 
            * menu items to be retrieved.
            * @method getMenuItemGroup            
            * @return {Array}
            */
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

            /**
            * @description Returns a reference to the menu item that currently 
            * @method getFocusedMenuItem            
            * has focus.
            * @return {Rui.ui.menu.LMenuItem}
            */
            getFocusedMenuItem: function()
            {
                return m_oFocusedMenuItem;
            },

            /**
            * @description Returns a reference to the menu that currently 
            * @method getFocusedMenu            
            * has focus.
            * @return {Rui.ui.menu.LMenu}
            */
            getFocusedMenu: function()
            {
                var returnVal;

                if (m_oFocusedMenuItem)
                {
                    returnVal = m_oFocusedMenuItem.parent.getRoot();
                }

                return returnVal;
            },

            /**
            * @description Returns a string representing the menu manager.
            * @method toString            
            * @return {String}
            */
            toString: function()
            {
                return _MENUMANAGER;
            }
        };
    } ();
})();

Rui.namespace('Rui.ui.menu');
(function() {
    // String constants
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

    /**
     * The LMenu class creates a container that holds a vertical list representing 
     * a set of options or commands.  LMenu is the base class for all 
     * menu containers. 
     * @module ui_menu
     * @namespace Rui.ui.menu
     * @class LMenu
     * @constructor
     * @plugin /ui/menu/rui_menu.js,/ui/menu/rui_menu.css
     * @param {String} p_oElement id
     * @param {Object} p_oConfig config
     * @extends Rui.ui.LPanel
     */
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

    /**
     * @description Checks to make sure that the value of the "position" property 
     * is one of the supported strings. Returns true if the position is supported.
     * @method checkPosition
     * @private
     * @param {Object} p_sPosition String specifying the position of the menu.
     * @return {boolean}
     */
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
        /**
         * @description String representing the CSS class(es) to be applied to the 
         * menu's <code>&#60;div&#62;</code> element.
         * @property CSS_CLASS_NAME
         * @default "L-ruimenu"
         * @private
         * @type String
         */
        CSS_CLASS_NAME: "L-ruimenu",
        /**
         * @description Object representing the type of menu item to instantiate and 
         * add when parsing the child nodes (either <code>&#60;li&#62;</code> element, 
         * <code>&#60;optgroup&#62;</code> element or <code>&#60;option&#62;</code>) 
         * of the menu's source HTML element.
         * @property ITEM_TYPE
         * @default Rui.ui.menu.LMenuItem
         * @private
         * @type Rui.ui.menu.LMenuItem
         */
        ITEM_TYPE: null,
        /**
         * @description String representing the tagname of the HTML element used to 
         * title the menu's item groups.
         * @property GROUP_TITLE_TAG_NAME
         * @default H6
         * @private
         * @type String
         */
        GROUP_TITLE_TAG_NAME: "h6",
        /**
         * @description Array representing the default x and y position that a menu 
         * should have when it is positioned outside the viewport by the 
         * "poistionOffScreen" method.
         * @property OFF_SCREEN_POSITION
         * @default "-999em"
         * @private
         * @type String
         */
        OFF_SCREEN_POSITION: "-999em",
        // Private properties
        /** 
         * @description Boolean indicating if the "mouseover" and "mouseout" event 
         * handlers used for hiding the menu via a call to "Rui.later" have 
         * already been assigned.
         * @property _useHideDelay
         * @default false
         * @private
         * @type Boolean
         */
        _useHideDelay: false,
        /**
         * @description Boolean indicating the current state of the menu's 
         * "mouseover" event.
         * @property _bHandledMouseOverEvent
         * @default false
         * @private
         * @type Boolean
         */
        _bHandledMouseOverEvent: false,
        /**
         * @description Boolean indicating the current state of the menu's
         * "mouseout" event.
         * @property _bHandledMouseOutEvent
         * @default false
         * @private
         * @type Boolean
         */
        _bHandledMouseOutEvent: false,
        /**
         * @description Array of HTML element used to title groups of menu items.
         * @property _aGroupTitleElements
         * @default []
         * @private
         * @type Array
         */
        _aGroupTitleElements: null,
        /**
         * @property _aItemGroups
         * @description Multi-dimensional Array representing the menu items as they
         * are grouped in the menu.
         * @default []
         * @private
         * @type Array
         */
        _aItemGroups: null,
        /**
         * @description Array of <code>&#60;ul&#62;</code> elements, each of which is 
         * the parent node for each item's <code>&#60;li&#62;</code> element.
         * @property _aListElements
         * @default []
         * @private
         * @type Array
         */
        _aListElements: null,
        /**
         * @description The current x coordinate of the mouse inside the area of 
         * the menu.
         * @property _nCurrentMouseX
         * @default 0
         * @private
         * @type Number
         */
        _nCurrentMouseX: 0,
        /**
         * @description Stops "mouseover," "mouseout," and "mousemove" event handlers 
         * from executing.
         * @property _bStopMouseEventHandlers
         * @default false
         * @private
         * @type Boolean
         */
        _bStopMouseEventHandlers: false,
        /**
         * @description The current value of the "classname" configuration attribute.
         * @property _sClassName
         * @default null
         * @private
         * @type String
         */
        _sClassName: null,

        // Public properties
        /**
         * @description Boolean indicating if the menu's "lazy load" feature is 
         * enabled.  If set to "true," initialization and rendering of the menu's 
         * items will be deferred until the first time it is made visible.  This 
         * property should be set via the constructor using the configuration 
         * object literal.
         * @property lazyLoad
         * @default false
         * @type Boolean
         */
        lazyLoad: false,
        /**
         * @description Array of items to be added to the menu.  The array can contain 
         * strings representing the text for each item to be created, object literals 
         * representing the menu item configuration properties, or LMenuItem instances.  
         * This property should be set via the constructor using the configuration 
         * object literal.
         * @property itemData
         * @default null
         * @type Array
         */
        itemData: null,
        /**
         * @description Object reference to the item in the menu that has is selected.
         * @property activeItem
         * @default null
         * @type Rui.ui.menu.LMenuItem
         */
        activeItem: null,
        /**
         * @description Object reference to the menu's parent menu or menu item.  
         * This property can be set via the constructor using the configuration 
         * object literal.
         * @property parent
         * @default null
         * @type Rui.ui.menu.LMenuItem
         */
        parent: null,
        /**
         * @description Object reference to the HTML element (either 
         * <code>&#60;select&#62;</code> or <code>&#60;div&#62;</code>) used to 
         * create the menu.
         * @property srcElement
         * @default null
         * @type <a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/
         * level-one-html.html#ID-94282980">HTMLSelectElement</a>|<a 
         * href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-html.
         * html#ID-22445964">HTMLDivElement</a>
         */
        srcElement: null,
        /**
         * @description Menu의 Data가될 dataset
         * @property dataSet
         * @type Rui.data.LDataSet
         * @default null
         */
        dataSet: null,
        /**
         * Menu의 Data가될 DataSet의 field 정보
         * @property fields
         * @type object
         * @default null
         */
        fields: null,

        // Events
        /**
         * @description Fires when the mouse has entered the menu.  Passes back 
         * the DOM Event object as an argument.
         * @event mouseOver
         */
        /**
         * @description Fires when the mouse has left the menu.  Passes back the DOM 
         * Event object as an argument.
         * @event mouseOut
         * @type Rui.util.LCustomEvent
         */
        /**
         * @description Fires when the user mouses down on the menu.  Passes back the 
         * DOM Event object as an argument.
         * @event mouseDown
         * @type Rui.util.LCustomEvent
         */
        /**
         * @description Fires when the user releases a mouse button while the mouse is 
         * over the menu.  Passes back the DOM Event object as an argument.
         * @event mouseUp
         * @type Rui.util.LCustomEvent
         */
        /**
         * @description Fires when the user clicks the on the menu.  Passes back the 
         * DOM Event object as an argument.
         * @event click
         * @type Rui.util.LCustomEvent
         */
        /**
         * @description Fires when the user presses an alphanumeric key when one of the
         * menu's items has focus.  Passes back the DOM Event object as an argument.
         * @event keyPress
         * @type Rui.util.LCustomEvent
         */
        /**
         * @description Fires when the user presses a key when one of the menu's items 
         * has focus.  Passes back the DOM Event object as an argument.
         * @event keyDown
         * @type Rui.util.LCustomEvent
         */
        /**
         * @description Fires when the user releases a key when one of the menu's items 
         * has focus.  Passes back the DOM Event object as an argument.
         * @event keyUp
         * @type Rui.util.LCustomEvent
         */
        /**
         * @description Fires when an item is added to the menu.
         * @event itemAdded
         * @type Rui.util.LCustomEvent
         */
        /**
         * @description Fires when an item is removed to the menu.
         * @event itemRemoved
         * @type Rui.util.LCustomEvent
         */
        /**
         * @description Initializes the class's configurable properties which can be
         * changed using the menu's Config object ("cfg").
         * @private
         * @method initDefaultConfig
         */
        initDefaultConfig: function() {

            Panel.superclass.initDefaultConfig.call(this);
            this._initConfig();

            // Module documentation overrides
            /**
             * @description Object or array of objects representing the ContainerEffect 
             * classes that are active for animating the container.  When set this 
             * property is automatically applied to all submenus.
             * @config effect
             * @type Object
             * @default null
             */

            // Overlay documentation overrides
            /**
             * @description Number representing the absolute x-coordinate position of 
             * the LMenu.  This property is only applied when the "position" 
             * configuration property is set to dynamic.
             * @config x
             * @type Number
             * @default null
             */
            /**
             * @description Number representing the absolute y-coordinate position of 
             * the LMenu.  This property is only applied when the "position" 
             * configuration property is set to dynamic.
             * @config y
             * @type Number
             * @default null
             */
            /**
             * @description Array of the absolute x and y positions of the LMenu.  This 
             * property is only applied when the "position" configuration property is 
             * set to dynamic.
             * @config xy
             * @type Number[]
             * @default null
             */
            /**
             * @description Array of context arguments for context-sensitive positioning.  
             * The format is: [id or element, element corner, context corner]. 
             * For example, setting this property to ["img1", "tl", "bl"] would 
             * align the Mnu's top left corner to the context element's 
             * bottom left corner.  This property is only applied when the "position" 
             * configuration property is set to dynamic.
             * @config context
             * @type Array
             * @default null
             */
            /**
             * @description Boolean indicating if the LMenu should be anchored to the 
             * center of the viewport.  This property is only applied when the 
             * "position" configuration property is set to dynamic.
             * @config fixedcenter
             * @type Boolean
             * @default false
             */
            /**
             * @description Boolean indicating whether or not the LMenu should 
             * have an IFRAME shim; used to prevent SELECT elements from 
             * poking through an Overlay instance in IE6.  When set to "true", 
             * the iframe shim is created when the LMenu instance is intially
             * made visible.  This property is only applied when the "position" 
             * configuration property is set to dynamic and is automatically applied 
             * to all submenus.
             * @config iframe
             * @type Boolean
             * @default true for IE6 and below, false for all other browsers.
             */

            // Add configuration attributes

            /*
            Change the default value for the "visible" configuration 
            property to "false" by re-adding the property.
             */
            /**
             * @description Boolean indicating whether or not the menu is visible.  If 
             * the menu's "position" configuration property is set to "dynamic" (the 
             * default), this property toggles the menu's <code>&#60;div&#62;</code> 
             * element's "visibility" style property between "visible" (true) or 
             * "hidden" (false).  If the menu's "position" configuration property is 
             * set to "static" this property toggles the menu's 
             * <code>&#60;div&#62;</code> element's "display" style property 
             * between "block" (true) or "none" (false).
             * @config visible
             * @default false
             * @type Boolean
             */
            this.cfg.addProperty(
                    VISIBLE_CONFIG.key,
                    {
                        handler: this.configVisible,
                        value: VISIBLE_CONFIG.value,
                        validator: VISIBLE_CONFIG.validator
                    }
            );

            /*
            Change the default value for the "constraintoviewport" configuration 
            property (inherited by Rui.ui.menu.LOverlay) to "true" by re-adding the property.
             */
            /**
             * @description Boolean indicating if the menu will try to remain inside 
             * the boundaries of the size of viewport.  This property is only applied 
             * when the "position" configuration property is set to dynamic and is 
             * automatically applied to all submenus.
             * @config constraintoviewport
             * @default true
             * @type Boolean
             */
            this.cfg.addProperty(
                    CONSTRAIN_TO_VIEWPORT_CONFIG.key,
                    {
                        handler: this.configConstrainToViewport,
                        value: CONSTRAIN_TO_VIEWPORT_CONFIG.value,
                        validator: CONSTRAIN_TO_VIEWPORT_CONFIG.validator,
                        supercedes: CONSTRAIN_TO_VIEWPORT_CONFIG.supercedes
                    }
            );

            /*
            Change the default value for the "preventcontextoverlap" configuration 
            property (inherited by Rui.ui.menu.LOverlay) to "true" by re-adding the property.
             */
            /**
             * @description Boolean indicating whether or not a submenu should overlap its parent LMenuItem 
             * when the "constraintoviewport" configuration property is set to "true".
             * @config preventcontextoverlap
             * @type Boolean
             * @default true
             */
            this.cfg.addProperty(PREVENT_CONTEXT_OVERLAP_CONFIG.key, {

                value: PREVENT_CONTEXT_OVERLAP_CONFIG.value,
                validator: PREVENT_CONTEXT_OVERLAP_CONFIG.validator,
                supercedes: PREVENT_CONTEXT_OVERLAP_CONFIG.supercedes

            });

            /**
             * @description String indicating how a menu should be positioned on the 
             * screen.  Possible values are "static" and "dynamic."  Static menus are 
             * visible by default and reside in the normal flow of the document 
             * (CSS position: static).  Dynamic menus are hidden by default, reside 
             * out of the normal flow of the document (CSS position: absolute), and 
             * can overlay other elements on the screen.
             * @config position
             * @default dynamic
             * @type String
             */
            this.cfg.addProperty(POSITION_CONFIG.key, {
                    handler: this.configPosition,
                    value: POSITION_CONFIG.value,
                    validator: POSITION_CONFIG.validator,
                    supercedes: POSITION_CONFIG.supercedes
                }
            );

            /**
             * @description Array defining how submenus should be aligned to their 
             * parent menu item. The format is: [itemCorner, submenuCorner]. By default
             * a submenu's top left corner is aligned to its parent menu item's top 
             * right corner.
             * @config submenualignment
             * @default ["tl","tr"]
             * @type Array
             */
            this.cfg.addProperty(SUBMENU_ALIGNMENT_CONFIG.key, {
                    value: SUBMENU_ALIGNMENT_CONFIG.value,
                    suppressEvent: SUBMENU_ALIGNMENT_CONFIG.suppressEvent
                }
            );

            /**
             * @description Boolean indicating if submenus are automatically made 
             * visible when the user mouses over the menu's items.
             * @config autosubmenudisplay
             * @default true
             * @type Boolean
             */
            this.cfg.addProperty( AUTO_SUBMENU_DISPLAY_CONFIG.key, {
                    value: AUTO_SUBMENU_DISPLAY_CONFIG.value,
                    validator: AUTO_SUBMENU_DISPLAY_CONFIG.validator,
                    suppressEvent: AUTO_SUBMENU_DISPLAY_CONFIG.suppressEvent
                }
            );

            /**
             * @description Number indicating the time (in milliseconds) that should 
             * expire before a submenu is made visible when the user mouses over 
             * the menu's items.  This property is only applied when the "position" 
             * configuration property is set to dynamic and is automatically applied 
             * to all submenus.
             * @config showdelay
             * @default 250
             * @type Number
             */
            this.cfg.addProperty(SHOW_DELAY_CONFIG.key, {
                    value: SHOW_DELAY_CONFIG.value,
                    validator: SHOW_DELAY_CONFIG.validator,
                    suppressEvent: SHOW_DELAY_CONFIG.suppressEvent
                }
            );

            /**
             * @description Number indicating the time (in milliseconds) that should 
             * expire before the menu is hidden.  This property is only applied when 
             * the "position" configuration property is set to dynamic and is 
             * automatically applied to all submenus.
             * @config hidedelay
             * @default 0
             * @type Number
             */
            this.cfg.addProperty(HIDE_DELAY_CONFIG.key, {
                    handler: this.configHideDelay,
                    value: HIDE_DELAY_CONFIG.value,
                    validator: HIDE_DELAY_CONFIG.validator,
                    suppressEvent: HIDE_DELAY_CONFIG.suppressEvent
                }
            );

            /**
             * @description Number indicating the time (in milliseconds) that should 
             * expire before a submenu is hidden when the user mouses out of a menu item 
             * heading in the direction of a submenu.  The value must be greater than or 
             * equal to the value specified for the "showdelay" configuration property.
             * This property is only applied when the "position" configuration property 
             * is set to dynamic and is automatically applied to all submenus.
             * @config submenuhidedelay
             * @default 250
             * @type Number
             */
            this.cfg.addProperty(SUBMENU_HIDE_DELAY_CONFIG.key, {
                    value: SUBMENU_HIDE_DELAY_CONFIG.value,
                    validator: SUBMENU_HIDE_DELAY_CONFIG.validator,
                    suppressEvent: SUBMENU_HIDE_DELAY_CONFIG.suppressEvent
                }
            );

            /**
             * @description Boolean indicating if the menu will automatically be 
             * hidden if the user clicks outside of it.  This property is only 
             * applied when the "position" configuration property is set to dynamic 
             * and is automatically applied to all submenus.
             * @config clicktohide
             * @default true
             * @type Boolean
             */
            this.cfg.addProperty(CLICK_TO_HIDE_CONFIG.key, {
                    value: CLICK_TO_HIDE_CONFIG.value,
                    validator: CLICK_TO_HIDE_CONFIG.validator,
                    suppressEvent: CLICK_TO_HIDE_CONFIG.suppressEvent
                }
            );

            /**
             * @description HTML element reference or string specifying the id 
             * attribute of the HTML element that the menu's markup should be 
             * rendered into.
             * @config container
             * @type <a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/
             * level-one-html.html#ID-58190037">HTMLElement</a>|String
             * @default document.body
             */
            this.cfg.addProperty(CONTAINER_CONFIG.key, {
                    handler: this.configContainer,
                    value: document.body,
                    suppressEvent: CONTAINER_CONFIG.suppressEvent
                }
            );

            /**
             * @description Number used to control the scroll speed of a menu.  Used to 
             * increment the "scrollTop" property of the menu's body by when a menu's 
             * content is scrolling.  When set this property is automatically applied 
             * to all submenus.
             * @config scrollincrement
             * @default 1
             * @type Number
             */
            this.cfg.addProperty(SCROLL_INCREMENT_CONFIG.key, {
                    value: SCROLL_INCREMENT_CONFIG.value,
                    validator: SCROLL_INCREMENT_CONFIG.validator,
                    supercedes: SCROLL_INCREMENT_CONFIG.supercedes,
                    suppressEvent: SCROLL_INCREMENT_CONFIG.suppressEvent
                }
            );

            /**
             * @description Number defining the minimum threshold for the "maxheight" 
             * configuration property.  When set this property is automatically applied 
             * to all submenus.
             * @config minscrollheight
             * @default 90
             * @type Number
             */
            this.cfg.addProperty(MIN_SCROLL_HEIGHT_CONFIG.key, {
                    value: MIN_SCROLL_HEIGHT_CONFIG.value,
                    validator: MIN_SCROLL_HEIGHT_CONFIG.validator,
                    supercedes: MIN_SCROLL_HEIGHT_CONFIG.supercedes,
                    suppressEvent: MIN_SCROLL_HEIGHT_CONFIG.suppressEvent
                }
            );

            /**
             * @description Number defining the maximum height (in pixels) for a menu's 
             * body element (<code>&#60;div class="bd"&#60;</code>).  Once a menu's body 
             * exceeds this height, the contents of the body are scrolled to maintain 
             * this value.  This value cannot be set lower than the value of the 
             * "minscrollheight" configuration property.
             * @config maxheight
             * @default 0
             * @type Number
             */
            this.cfg.addProperty(MAX_HEIGHT_CONFIG.key, {
                    handler: this.configMaxHeight,
                    value: MAX_HEIGHT_CONFIG.value,
                    validator: MAX_HEIGHT_CONFIG.validator,
                    suppressEvent: MAX_HEIGHT_CONFIG.suppressEvent,
                    supercedes: MAX_HEIGHT_CONFIG.supercedes
                }
            );

            /**
             * @description String representing the CSS class to be applied to the 
             * menu's root <code>&#60;div&#62;</code> element.  The specified class(es)  
             * are appended in addition to the default class as specified by the menu's
             * CSS_CLASS_NAME constant. When set this property is automatically 
             * applied to all submenus.
             * @config classname
             * @default null
             * @type String
             */
            this.cfg.addProperty(CLASS_NAME_CONFIG.key, {
                    handler: this.configClassName,
                    value: CLASS_NAME_CONFIG.value,
                    validator: CLASS_NAME_CONFIG.validator,
                    supercedes: CLASS_NAME_CONFIG.supercedes
                }
            );

            /**
             * @description Boolean indicating if the menu should be disabled.  
             * Disabling a menu disables each of its items.  (Disabled menu items are 
             * dimmed and will not respond to user input or fire events.)  Disabled
             * menus have a corresponding "disabled" CSS class applied to their root
             * <code>&#60;div&#62;</code> element.
             * @config disabled
             * @default false
             * @type Boolean
             */
            this.cfg.addProperty(DISABLED_CONFIG.key, {
                    handler: this.configDisabled,
                    value: DISABLED_CONFIG.value,
                    validator: DISABLED_CONFIG.validator,
                    suppressEvent: DISABLED_CONFIG.suppressEvent
                }
            );

            /**
             * @description Boolean indicating if the menu should have a shadow.
             * @config shadow
             * @default true
             * @type Boolean
             */
            this.cfg.addProperty(SHADOW_CONFIG.key, {
                    handler: this.configShadow,
                    value: SHADOW_CONFIG.value,
                    validator: SHADOW_CONFIG.validator
                }
            );

            /**
             * @description Boolean indicating if the menu should remain open when clicked.
             * @config keepopen
             * @default false
             * @type Boolean
             */
            this.cfg.addProperty(KEEP_OPEN_CONFIG.key, {
                    value: KEEP_OPEN_CONFIG.value,
                    validator: KEEP_OPEN_CONFIG.validator
                }
            );

        }, 
        /**
         * @description Dom객체 생성 및 초기화하는 메소드
         * @method initComponent
         * @protected
         * @param {Object} config 환경정보 객체 
         * @return {void}
         */
        initComponent: function(config){
            Rui.ui.menu.LMenu.superclass.initComponent.call(this); 

            this._aItemGroups = [];
            this._aListElements = [];
            this._aGroupTitleElements = [];

            if (!this.ITEM_TYPE) {
                this.ITEM_TYPE = Rui.ui.menu.LMenuItem;
            }
        }, 

        /**
         * @method initEvents
         * @private
         * @description Initializes the custom events for the menu.
         */
        initEvents: function() {

            Rui.ui.menu.LMenu.superclass.initEvents.call(this);

            // Create custom events
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

            // panel dorender 
            this.renderEvent.unOn(this.cfg.fireQueue, this.cfg); 
            this.renderEvent.on(this.cfg.fireQueue, this.cfg, true);
        },

        /**
         * @description element Dom객체 생성
         * @method createContainer
         * @protected
         * @return {LElement}
         */
        createContainer: function(appendToNode) {
            this.el = Rui.ui.menu.LMenu.superclass.createContainer.call(this);
            this.cfg.setProperty(CONTAINER_CONFIG.key, document.body);
            return this.el; 
        },

        /**
         * @description render시 호출되는 메소드
         * @method doRender
         * @protected 
         * @param {String|Object} container 부모객체 정보
         * @return {void}
         */
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

        /**
         * @description render후 호출되는 메소드
         * @method afterRender
         * @protected
         * @param {HTMLElement} container 부모 객체
         * @return {void}
         */
        afterRender: function(container) {
            LMenu.superclass.afterRender.call(this,container);
        }, 

        // Private methods

        /**
         * @description Iterates the childNodes of the source element to find nodes 
         * used to instantiate menu and menu items.
         * @method _initSubTree
         * @private
         */
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
                    //  Populate the collection of item groups and item group titles
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
                        /*
                        Apply the "first-of-type" class to the first UL to mimic 
                        the ":first-of-type" CSS3 psuedo class.
                         */
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

        /**
         * @description Returns the first enabled item in the menu.
         * @method _getFirstEnabledItem
         * @return {Rui.ui.menu.LMenuItem}
         * @private
         */
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

        /**
         * @description Adds a menu item to a group.
         * @method _addItemToGroup
         * @private
         * @param {Number} p_nGroupIndex Number indicating the group to which the 
         * item belongs.
         * @param {Rui.ui.menu.LMenuItem} p_oItem Object reference for the LMenuItem 
         * instance to be added to the menu.
         * @param {String} p_oItem String specifying the text of the item to be added 
         * to the menu.
         * @param {Object} p_oItem Object literal containing a set of menu item 
         * configuration properties.
         * @param {Number} p_nItemIndex Optional. Number indicating the index at 
         * which the menu item should be added.
         * @return {Rui.ui.menu.LMenuItem}
         */
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

        /**
         * @description Removes a menu item from a group by index.  Returns the menu 
         * item that was removed.
         * @method _removeItemFromGroupByIndex
         * @private
         * @param {Number} p_nGroupIndex Number indicating the group to which the menu 
         * item belongs.
         * @param {Number} p_nItemIndex Number indicating the index of the menu item 
         * to be removed.
         * @return {Rui.ui.menu.LMenuItem}
         */
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
                    // Update the index and className properties of each member        
                    this._updateItemProperties(nGroupIndex);

                    if (aGroup.length === 0) {
                        // Remove the UL
                        oUL = this._aListElements[nGroupIndex];

                        if (this.body && oUL) {
                            this.body.removeChild(oUL);
                        }

                        // Remove the group from the array of items
                        this._aItemGroups.splice(nGroupIndex, 1);
                        // Remove the UL from the array of ULs
                        this._aListElements.splice(nGroupIndex, 1);
                        /*
                        Assign the "first-of-type" class to the new first UL 
                        in the collection
                         */
                        oUL = this._aListElements[0];

                        if (oUL) {
                            Dom.addClass(oUL, _FIRST_OF_TYPE);
                        }
                    }

                    this.itemRemovedEvent.fire(oItem);
                    this.fireEvent('changeContent', {target:this});
                }
            }
            // Return a reference to the item that was removed
            return oItem;
        },

        /**
         * @description Removes a menu item from a group by reference.  Returns the 
         * menu item that was removed.
         * @method _removeItemFromGroupByValue
         * @private
         * @param {Number} p_nGroupIndex Number indicating the group to which the
         * menu item belongs.
         * @param {Rui.ui.menu.LMenuItem} p_oItem Object reference for the LMenuItem 
         * instance to be removed.
         * @return {Rui.ui.menu.LMenuItem}
         */
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

        /**
         * @description Updates the "index," "groupindex," and "className" properties 
         * of the menu items in the specified group. 
         * @method _updateItemProperties
         * @private
         * @param {Number} p_nGroupIndex Number indicating the group of items to update.
         */
        _updateItemProperties: function(p_nGroupIndex) {
            var aGroup = this._getItemGroup(p_nGroupIndex),
            nItems = aGroup.length,
            oItem,
            oLI,
            i;

            if (nItems > 0) {
                i = nItems - 1;
                // Update the index and className properties of each member
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

        /**
         * @description Creates a new menu item group (array) and its associated 
         * <code>&#60;ul&#62;</code> element. Returns an aray of menu item groups.
         * @method _createItemGroup
         * @private
         * @param {Number} p_nIndex Number indicating the group to create.
         * @return {Array}
         */
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

        /**
         * @description Returns the menu item group at the specified index.
         * @method _getItemGroup
         * @private
         * @param {Number} p_nIndex Number indicating the index of the menu item group 
         * to be retrieved.
         * @return {Array}
         */
        _getItemGroup: function(p_nIndex) {
            var nIndex = Rui.isNumber(p_nIndex) ? p_nIndex : 0,
                    aGroups = this._aItemGroups,
                    returnVal;

            if (nIndex in aGroups) {
                returnVal = aGroups[nIndex];
            }
            return returnVal;
        },

        /**
         * @description Subscribes the menu item's submenu to its parent menu's events.
         * @method _configureSubmenu
         * @private
         * @param {Rui.ui.menu.LMenuItem} p_oItem Object reference for the LMenuItem 
         * instance with the submenu to be configured.
         */
        _configureSubmenu: function(p_oItem) {

            var oSubmenu = p_oItem.cfg.getProperty(_SUBMENU);
            if (oSubmenu) {
                /*
                Listen for configuration changes to the parent menu 
                so they they can be applied to the submenu.
                 */
                this.cfg.configChangedEvent.on(this._onParentMenuConfigChange, oSubmenu, true);
                this.renderEvent.on(this._onParentMenuRender, oSubmenu, true);
            }
        },

        /**
         * @description Subscribes a menu to a menu item's event.
         * @method _subscribeToItemEvents
         * @private
         * @param {Rui.ui.menu.LMenuItem} p_oItem Object reference for the LMenuItem 
         * instance whose events should be subscribed to.
         */
        _subscribeToItemEvents: function(p_oItem) {
            p_oItem.destroyEvent.on(this._onMenuItemDestroy, p_oItem, this, {isCE:true});
            p_oItem.cfg.configChangedEvent.on(this._onMenuItemConfigChange, p_oItem, this, {isCE:true});
        },

        /**
         * @description Change event handler for the the menu's "visible" configuration
         * @method _onVisibleChange
         * property.
         * @private
         * @param {String} p_sType String representing the name of the event that 
         * was fired.
         * @param {Array} p_aArgs Array of arguments sent when the event was fired.
         */
        _onVisibleChange: function(p_sType, p_aArgs) {
            var bVisible = p_aArgs[0];

            if (bVisible) {
                Dom.addClass(this.element, _VISIBLE);
            }
            else {
                Dom.removeClass(this.element, _VISIBLE);
            }
        },

        /**
         * @description Cancels the call to "hideMenu."
         * @method _cancelHideDelay
         * @private
         */
        _cancelHideDelay: function() {
            var oTimer = this.getRoot()._hideDelayTimer;
            if (oTimer) {
                oTimer.cancel();
            }
        },

        /**
         * @description Hides the menu after the number of milliseconds specified by 
         * the "hidedelay" configuration property.
         * @method _execHideDelay
         * @private
         */
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

        /**
         * @description Cancels the call to the "showMenu."
         * @method _cancelShowDelay
         * @private
         */
        _cancelShowDelay: function() {
            var oTimer = this.getRoot()._showDelayTimer;
            if (oTimer) {
                oTimer.cancel();
            }
        },

        /**
         * @description Hides a submenu after the number of milliseconds specified by 
         * the "submenuhidedelay" configuration property have ellapsed.
         * @method _execSubmenuHideDelay
         * @private
         * @param {Rui.ui.menu.LMenu} p_oSubmenu Object specifying the submenu that  
         * should be hidden.
         * @param {Number} p_nMouseX The x coordinate of the mouse when it left 
         * the specified submenu's parent menu item.
         * @param {Number} p_nHideDelay The number of milliseconds that should ellapse
         * before the submenu is hidden.
         */
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

        // Protected methods
        /**
         * @description Disables the header used for scrolling the body of the menu.
         * @method _disableScrollHeader
         * @protected
         */
        _disableScrollHeader: function() {
            if (!this._bHeaderDisabled) {
                Dom.addClass(this.header, _TOP_SCROLLBAR_DISABLED);
                this._bHeaderDisabled = true;
            }
        },

        /**
         * @description Disables the footer used for scrolling the body of the menu.
         * @method _disableScrollFooter
         * @protected
         */
        _disableScrollFooter: function() {
            if (!this._bFooterDisabled) {
                Dom.addClass(this.footer, _BOTTOM_SCROLLBAR_DISABLED);
                this._bFooterDisabled = true;
            }
        },

        /**
         * @description Enables the header used for scrolling the body of the menu.
         * @method _enableScrollHeader
         * @protected
         */
        _enableScrollHeader: function() {
            if (this._bHeaderDisabled) {
                Dom.removeClass(this.header, _TOP_SCROLLBAR_DISABLED);
                this._bHeaderDisabled = false;
            }
        },

        /**
         * @description Enables the footer used for scrolling the body of the menu.
         * @method _enableScrollFooter
         * @protected
         */
        _enableScrollFooter: function() {
            if (this._bFooterDisabled) {
                Dom.removeClass(this.footer, _BOTTOM_SCROLLBAR_DISABLED);
                this._bFooterDisabled = false;
            }
        },

        /**
         * @description "mouseover" event handler for the menu.
         * @method _onMouseOver
         * @protected
         * @param {String} p_sType String representing the name of the event that 
         * was fired.
         * @param {Array} p_aArgs Array of arguments sent when the event was fired.
         */
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
                //if(typeof this.parent !== "undefined" && typeof this.parent.cfg !== "undefined")                
                if (this.parent.cfg.getProperty(_SELECTED)) {
                    this.show();
                }
            };

            if (!this._bStopMouseEventHandlers) {
                if (!this._bHandledMouseOverEvent && (oTarget == this.element ||
                        Dom.isAncestor(this.element, oTarget))) {
                    // LMenu mouseover logic
                    if (this._useHideDelay) {
                        this._cancelHideDelay();
                    }
                    this._nCurrentMouseX = 0;
                    Event.on(this.element, _MOUSEMOVE, this._onMouseMove, this, true);

                    /*
                    If the mouse is moving from the submenu back to its corresponding menu item, 
                    don't hide the submenu or clear the active LMenuItem.
                     */
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

                    // LMenu Item mouseover logic
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
                    // Select and focus the current menu item
                    oItemCfg.setProperty(_SELECTED, true);

                    if (this.hasFocus() || oRoot._hasFocus) {
                        oItem.focus();
                        oRoot._hasFocus = false;
                    }

                    if (this.cfg.getProperty(_AUTO_SUBMENU_DISPLAY)) {
                        // Show the submenu this menu item
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

        /**
         * @description "mouseout" event handler for the menu.
         * @method _onMouseOut
         * @protected
         * @param {String} p_sType String representing the name of the event that 
         * was fired.
         * @param {Array} p_aArgs Array of arguments sent when the event was fired.
         */
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

                        // LMenu Item mouseout logic
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
                    // LMenu mouseout logic
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

        /**
         * @description "click" event handler for the menu.
         * @method _onMouseMove
         * @protected
         * @param {Event} p_oEvent Object representing the DOM event object passed 
         * back by the event utility (Rui.util.LEvent).
         * @param {Rui.ui.menu.LMenu} p_oMenu Object representing the menu that 
         * fired the event.
         */
        _onMouseMove: function(p_oEvent, p_oMenu) {
            if (!this._bStopMouseEventHandlers) {
                this._nCurrentMouseX = Event.getPageX(p_oEvent);
            }
        },

        /**
         * @description "click" event handler for the menu.
         * @method _onClick
         * @protected
         * @param {String} p_sType String representing the name of the event that 
         * was fired.
         * @param {Array} p_aArgs Array of arguments sent when the event was fired.
         */
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
                /*
                There is an inconsistency between Firefox for Mac OS X and Firefox Windows 
                regarding the triggering of the display of the browser's context menu and the 
                subsequent firing of the "click" event. In Firefox for Windows, when the user 
                triggers the display of the browser's context menu the "click" event also fires 
                for the document object, even though the "click" event did not fire for the 
                element that was the original target of the "contextmenu" event. This is unique 
                to Firefox on Windows. For all other A-Grade browsers, including Firefox for 
                Mac OS X, the "click" event doesn't fire for the document object. 

                This bug in Firefox for Windows affects LMenu as LMenu instances listen for 
                events at the document level and have an internal "click" event handler they 
                use to hide themselves when clicked. As a result, in Firefox for Windows a 
                LMenu will hide when the user right clicks on a LMenuItem to raise the browser's 
                default context menu, because its internal "click" event handler ends up 
                getting called.  The following line fixes this bug.
                 */
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

                    /*
                    Check if the URL of the anchor is pointing to an element that is 
                    a child of the menu.
                     */
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

        /**
         * @description "keydown" event handler for the menu.
         * @method _onKeyDown
         * @protected
         * @param {String} p_sType String representing the name of the event that 
         * was fired.
         * @param {Array} p_aArgs Array of arguments sent when the event was fired.
         */
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

            /*
            This function is called to prevent a bug in Firefox.  In Firefox,
            moving a DOM element into a stationary mouse pointer will cause the 
            browser to fire mouse events.  This can result in the menu mouse
            event handlers being called uncessarily, especially when menus are 
            moved into a stationary mouse pointer as a result of a 
            key event handler.
             */
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
                case 38:    // Up arrow
                case 40:    // Down arrow
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

                                    if (oEvent.keyCode == 40) {    // Down
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
                                    else {  // Up
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

                case 39:    // Right arrow
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

                case 37:    // Left arrow
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

            if (oEvent.keyCode == 27) { // Esc key
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

        /**
         * @description "keypress" event handler for a LMenu instance.
         * @method _onKeyPress
         * @protected
         * @param {String} p_sType The name of the event that was fired.
         * @param {Array} p_aArgs Collection of arguments sent when the event 
         * was fired.
         */
        _onKeyPress: function(p_sType, p_aArgs) {
            var oEvent = p_aArgs[0];
            if (oEvent.keyCode == 40 || oEvent.keyCode == 38) {
                Event.preventDefault(oEvent);
            }
        },

        /**
         * @method _onBlur
         * @description "blur" event handler for a LMenu instance.
         * @protected
         * @param {String} p_sType The name of the event that was fired.
         * @param {Array} p_aArgs Collection of arguments sent when the event 
         * was fired.
         */
        _onBlur: function(p_sType, p_aArgs) {
            if (this._hasFocus) {
                this._hasFocus = false;
            }
        },

        /**
         * @description "y" event handler for a LMenu instance.
         * @method _onYChange
         * @protected
         * @param {String} p_sType The name of the event that was fired.
         * @param {Array} p_aArgs Collection of arguments sent when the event 
         * was fired.
         */
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

        /**
         * @description "mouseover" event handler for the menu's "header" and "footer" 
         * elements.  Used to scroll the body of the menu up and down when the 
         * menu's "maxheight" configuration property is set to a value greater than 0.
         * @method _onScrollTargetMouseOver
         * @protected
         * @param {Event} p_oEvent Object representing the DOM event object passed 
         * back by the event utility (Rui.util.LEvent).
         * @param {Rui.ui.menu.LMenu} p_oMenu Object representing the menu that 
         * fired the event.
         */
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

        /**
         * @description "mouseout" event handler for the menu's "header" and "footer" 
         * elements.  Used to stop scrolling the body of the menu up and down when the 
         * menu's "maxheight" configuration property is set to a value greater than 0.
         * @method _onScrollTargetMouseOut
         * @protected
         * @param {Event} p_oEvent Object representing the DOM event object passed 
         * back by the event utility (Rui.util.LEvent).
         * @param {Rui.ui.menu.LMenu} p_oMenu Object representing the menu that 
         * fired the event.
         */
        _onScrollTargetMouseOut: function(p_oEvent, p_oMenu) {
            var oBodyScrollTimer = this._bodyScrollTimer;
            if (oBodyScrollTimer) {
                oBodyScrollTimer.cancel();
            }
            this._cancelHideDelay();
        },

        // Private methods
        /**
         * @description "init" event handler for the menu.
         * @method _onInit
         * @private
         * @param {String} p_sType String representing the name of the event that 
         * was fired.
         * @param {Array} p_aArgs Array of arguments sent when the event was fired.
         */
        _onInit: function(e) {
            this.cfg.subscribeToConfigEvent(_VISIBLE, this._onVisibleChange);
            var bRootMenu = !this.parent,
            bLazyLoad = this.lazyLoad;
            /*
            Automatically initialize a menu's subtree if:
            1) This is the root menu and lazyload is off
            2) This is the root menu, lazyload is on, but the menu is 
                already visible
            3) This menu is a submenu and lazyload is off
             */            
            //this.body 만들기, LModule이 변경되어서 추가
            //this.setBody("");
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

        /**
         * @description "beforerender" event handler for the menu.  Appends all of the 
         * <code>&#60;ul&#62;</code>, <code>&#60;li&#62;</code> and their accompanying 
         * title elements to the body element of the menu.
         * @method _onBeforeRender
         * @private
         * @param {String} p_sType String representing the name of the event that 
         * was fired.
         * @param {Array} p_aArgs Array of arguments sent when the event was fired.
         */
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

        /**
         * @description "render" event handler for the menu.
         * @method _onRender
         * @private
         * @param {String} p_sType String representing the name of the event that 
         * was fired.
         * @param {Array} p_aArgs Array of arguments sent when the event was fired.
         */
        _onRender: function(p_sType, p_aArgs) {
            if (this.cfg.getProperty(_POSITION) == _DYNAMIC) {
                if (!this.cfg.getProperty(_VISIBLE)) {
                    this.positionOffScreen();
                }
            }
        },

        /**
         * @description "beforeshow" event handler for the menu.
         * @method _onBeforeShow
         * @private
         * @param {String} p_sType String representing the name of the event that 
         * was fired.
         * @param {Array} p_aArgs Array of arguments sent when the event was fired.
         */
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
                // The LMenu is below the context element, flip it above
                if ((oMenu.cfg.getProperty(_Y) - scrollY) > nContextElY) {
                    nNewY = (nContextElY - nMenuOffsetHeight);
                }
                else {  // The LMenu is above the context element, flip it below
                    nNewY = (nContextElY + nContextElHeight);
                }
                oMenu.cfg.setProperty(_Y, (nNewY + scrollY), true);
                return nNewY;
            };

            /*
            Uses the context element's position to calculate the availble height 
            above and below it to display its corresponding LMenu.
             */
            var getDisplayRegionHeight = function() {
                // The LMenu is below the context element
                if ((oMenu.cfg.getProperty(_Y) - scrollY) > nContextElY) {
                    return (nBottomRegionHeight - nViewportOffset);
                }
                else {  // The LMenu is above the context element
                    return (nTopRegionHeight - nViewportOffset);
                }
            };

            /*
            Sets the LMenu's "y" configuration property to the correct value based on its
            current orientation.
             */
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

            //  Resets the maxheight of the LMenu to the value set by the user
            var resetMaxHeight = function() {
                oMenu._setScrollHeight(this.cfg.getProperty(_MAX_HEIGHT));
                //oMenu.unOn('hide', resetMaxHeight, this);
            };

            /*
            Trys to place the LMenu in the best possible position (either above or 
            below its corresponding context element).
             */
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

                        // Re-align the LMenu since its height has just changed
                        // as a result of the setting of the maxheight property.
                        alignY();

                        if (nDisplayRegionHeight < nMenuMinScrollHeight) {
                            if (bFlipped) {
                                /*
                            All possible positions and values for the "maxheight" 
                            configuration property have been tried, but none were 
                            successful, so fall back to the original size and position.
                                 */
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

                    // Re-align the LMenu since its height has just changed
                    // as a result of the setting of the maxheight property.
                    alignY();
                }
                return fnReturnVal;
            };

            // Determine if the current value for the LMenu's "y" configuration property will
            // result in the LMenu being positioned outside the boundaries of the viewport
            if (y < topConstraint || y > bottomConstraint) {
                // The current value for the LMenu's "y" configuration property WILL
                // result in the LMenu being positioned outside the boundaries of the viewport
                if (bCanConstrain) {
                    if (oMenu.cfg.getProperty(_PREVENT_CONTEXT_OVERLAP) && bPotentialContextOverlap) {
                        //  SOLUTION #1:
                        //  If the "preventcontextoverlap" configuration property is set to "true", 
                        //  try to flip and/or scroll the LMenu to both keep it inside the boundaries of the 
                        //  viewport AND from overlaping its context element (LMenuItem or LMenuBarItem).
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
                        //  SOLUTION #2:
                        //  If the LMenu exceeds the height of the viewport, introduce scroll bars
                        //  to keep the LMenu inside the boundaries of the viewport
                        nAvailableHeight = (viewPortHeight - (nViewportOffset * 2));

                        if (nAvailableHeight > oMenu.cfg.getProperty(_MIN_SCROLL_HEIGHT)) {
                            oMenu._setScrollHeight(nAvailableHeight);
                            oMenu.on('hide', resetMaxHeight, this, true);
                            alignY();
                            yNew = oMenu.cfg.getProperty(_Y);
                        }
                    }
                    else {
                        //  SOLUTION #3:
                        if (y < topConstraint) {
                            yNew = topConstraint;
                        } else if (y > bottomConstraint) {
                            yNew = bottomConstraint;
                        }
                    }
                }
                else {
                    //  The "y" configuration property cannot be set to a value that will keep
                    //  entire LMenu inside the boundary of the viewport.  Therefore, set  
                    //  the "y" configuration property to scrollY to keep as much of the 
                    //  LMenu inside the viewport as possible.
                    yNew = nViewportOffset + scrollY;
                }
            }
            return yNew;
        },

        /**
         * @description "hide" event handler for the menu.
         * @method _onHide
         * @private
         * @param {String} p_sType String representing the name of the event that 
         * was fired.
         * @param {Array} p_aArgs Array of arguments sent when the event was fired.
         */
        _onHide: function(p_sType, p_aArgs) {
            if (this.cfg.getProperty(_POSITION) === _DYNAMIC) {
                this.positionOffScreen();
            }
        },

        /**
         * @description "show" event handler for the menu.
         * @method _onShow
         * @private
         * @param {String} p_sType String representing the name of the event that 
         * was fired.
         * @param {Array} p_aArgs Array of arguments sent when the event was fired.
         */
        _onShow: function(p_sType, p_aArgs) {
            var oParent = this.parent,
            oParentMenu,
            oElement,
            nOffsetWidth,
            sWidth;

            function disableAutoSubmenuDisplay(p_oEvent) {
                var oTarget;

                if (p_oEvent.type == _MOUSEDOWN || (p_oEvent.type == _KEYDOWN && p_oEvent.keyCode == 27)) {
                    /*  
                    Set the "autosubmenudisplay" to "false" if the user
                    clicks outside the menu bar.
                     */
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

                //  The following fixes an issue with the selected state of a LMenuItem 
                //  not rendering correctly when a submenu is aligned to the left of
                //  its parent LMenu instance.
                if ((this.cfg.getProperty("x") < oParentMenu.cfg.getProperty("x")) &&
                        (UA.gecko && UA.gecko < 1.9) && !this.cfg.getProperty(_WIDTH)) {
                    oElement = this.element;
                    nOffsetWidth = oElement.offsetWidth;
                    /*
                    Measuring the difference of the offsetWidth before and after
                    setting the "width" style attribute allows us to compute the 
                    about of padding and borders applied to the element, which in 
                    turn allows us to set the "width" property correctly.
                     */
                    oElement.style.width = nOffsetWidth + _PX;
                    sWidth = (nOffsetWidth - (oElement.offsetWidth - nOffsetWidth)) + _PX;

                    this.cfg.setProperty(_WIDTH, sWidth);
                    this.on('hide', onSubmenuHide, sWidth, this, true);
                }
            }
        },

        /**
         * Shows the Module element by setting the visible configuration 
         * property to true. Also fires two events: beforeShowEvent prior to 
         * the visibility change, and showEvent after.
         * @method show
         */
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
        
        /**
         * @description "beforehide" event handler for the menu.
         * @method _onBeforeHide
         * @private
         * @param {String} p_sType String representing the name of the event that 
         * was fired.
         * @param {Array} p_aArgs Array of arguments sent when the event was fired.
         */
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

            /*
            Focus can get lost in IE when the mouse is moving from a submenu back to its parent LMenu.  
            For this reason, it is necessary to maintain the focused state in a private property 
            so that the _onMouseOver event handler is able to determined whether or not to set focus
            to MenuItems as the user is moving the mouse.
             */
            if (UA.msie && this.cfg.getProperty(_POSITION) === _DYNAMIC && this.parent) {
                oRoot._hasFocus = this.hasFocus();
            }

            if (oRoot == this) {
                oRoot.blur();
            }
        },

        /**
         * @description "configchange" event handler for a submenu.
         * @method _onParentMenuConfigChange
         * @private
         * @param {String} p_sType String representing the name of the event that 
         * was fired.
         * @param {Array} p_aArgs Array of arguments sent when the event was fired.
         * @param {Rui.ui.menu.LMenu} p_oSubmenu Object representing the submenu that 
         * subscribed to the event.
         */
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

        /**
         * @description "render" event handler for a submenu.  Renders a  
         * submenu in response to the firing of its parent's "render" event.
         * @method _onParentMenuRender
         * @private
         * @param {String} p_sType String representing the name of the event that 
         * was fired.
         * @param {Array} p_aArgs Array of arguments sent when the event was fired.
         * @param {Rui.ui.menu.LMenu} p_oSubmenu Object representing the submenu that 
         * subscribed to the event.
         */
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

        /**
         * @description "destroy" event handler for the menu's items.
         * @method _onMenuItemDestroy
         * @private
         * @param {String} p_sType String representing the name of the event 
         * that was fired.
         * @param {Array} p_aArgs Array of arguments sent when the event was fired.
         * @param {Rui.ui.menu.LMenuItem} p_oItem Object representing the menu item 
         * that fired the event.
         */
        _onMenuItemDestroy: function(p_sType, p_aArgs, p_oItem) {
            this._removeItemFromGroupByValue(p_oItem.groupIndex, p_oItem);
        },

        /**
         * @description "configchange" event handler for the menu's items.
         * @method _onMenuItemConfigChange
         * @private
         * @param {String} p_sType String representing the name of the event that 
         * was fired.
         * @param {Array} p_aArgs Array of arguments sent when the event was fired.
         * @param {Rui.ui.menu.LMenuItem} p_oItem Object representing the menu item 
         * that fired the event.
         */
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

        // Public event handlers for configuration properties

        /**
         * @description Menu의 "visible" configuration property가 변경될때 발생하는 Event 처리 handler
         * @method configVisible        
         * @private
         * @param {String} p_sType 발생한 Event명
         * @param {Array} p_aArgs 발생한 Event의 parameter array
         * @param {Rui.ui.menu.LMenu} p_oMenu Event를 발생시킨 LMenu object
         */
        configVisible: function(p_sType, p_aArgs, p_oMenu) {
            var bVisible, sDisplay;

            if (this.cfg.getProperty(_POSITION) == _DYNAMIC) {
                LMenu.superclass.configVisible.call(this, p_sType, p_aArgs, p_oMenu);
            }
            else {
                bVisible = p_aArgs[0];
                sDisplay = Dom.getStyle(this.element, _DISPLAY);
                //Dom.setStyle(this.element, _VISIBILITY, _VISIBLE);
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

        /**
         * @description Menu의 "position" configuration property가 변경될때 발생하는 Event 처리 handler
         * @method configPosition
         * @private
         * @param {String} p_sType 발생한 Event명
         * @param {Array} p_aArgs 발생한 Event의 parameter array
         * @param {Rui.ui.menu.LMenu} p_oMenu Event를 발생시킨 LMenu object
         */
        configPosition: function(p_sType, p_aArgs, p_oMenu) {
            var oElement = this.element, 
            sCSSPosition = p_aArgs[0] == _STATIC ? _STATIC : _ABSOLUTE,
                    oCfg = this.cfg, nZIndex;

            Dom.setStyle(oElement, _POSITION, sCSSPosition);

            if (sCSSPosition == _STATIC) {
                // Statically positioned menus are visible by default
                Dom.setStyle(oElement, _DISPLAY, _BLOCK);
                oCfg.setProperty(_VISIBLE, true);
                if(Rui.useAccessibility())
                    oElement.setAttribute('aria-hidden', 'false');
            }
            else {
                /*
                Even though the "visible" property is queued to 
                "false" by default, we need to set the "visibility" property to 
                "hidden" since Overlay's "configVisible" implementation checks the 
                element's "visibility" style property before deciding whether 
                or not to show an Overlay instance.
                 */
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

        /**
         * @method configIframe
         * @private
         * @description Menu의 "iframe" configuration property가 변경될때 발생하는 Event 처리 handler
         * @param {String} p_sType 발생한 Event명
         * @param {Array} p_aArgs 발생한 Event의 parameter array
         * @param {Rui.ui.menu.LMenu} p_oMenu Event를 발생시킨 LMenu object
         */
        configIframe: function(p_sType, p_aArgs, p_oMenu) {
            if (this.cfg.getProperty(_POSITION) == _DYNAMIC) {
                LMenu.superclass.configIframe.call(this, p_sType, p_aArgs, p_oMenu);
            }
        },

        /**
         * @description Menu의 "hidedelay" configuration property가 변경될때 발생하는 Event 처리 handler
         * @method configHideDelay 
         * @private
         * @param {String} p_sType 발생한 Event명
         * @param {Array} p_aArgs 발생한 Event의 parameter array
         * @param {Rui.ui.menu.LMenu} p_oMenu Event를 발생시킨 LMenu object
         */
        configHideDelay: function(p_sType, p_aArgs, p_oMenu) {
            var nHideDelay = p_aArgs[0];
            this._useHideDelay = (nHideDelay > 0);
        },

        /**
         * @description Menu의 "container" configuration property가 변경될때 발생하는 Event 처리 handler
         * @method configContainer 
         * @private
         * @param {String} p_sType 발생한 Event명
         * @param {Array} p_aArgs 발생한 Event의 parameter array
         * @param {Rui.ui.menu.LMenu} p_oMenu Event를 발생시킨 LMenu object
         */
        configContainer: function(p_sType, p_aArgs, p_oMenu) {
            var oElement = p_aArgs[0];

            if (Rui.isString(oElement)) {
                this.cfg.setProperty(_CONTAINER, Dom.get(oElement), true);
            }
        },

        /**
         * @description Change event listener for the "width" configuration property.  This listener is 
         * added when a LMenu's "width" configuration property is set by the "_setScrollHeight" method, and 
         * is used to set the "_widthSetForScroll" property to "false" if the "width" configuration property 
         * is changed after it was set by the "_setScrollHeight" method.  If the "_widthSetForScroll" 
         * property is set to "false", and the "_setScrollHeight" method is in the process of tearing down 
         * scrolling functionality, it will maintain the LMenu's new width rather than reseting it.
         * @method _clearSetWidthFlag
         * @private
         */
        _clearSetWidthFlag: function() {
            this._widthSetForScroll = false;
            this.cfg.unsubscribeFromConfigEvent(_WIDTH, this._clearSetWidthFlag);
        },

        /**
         * @description 
         * @method _setScrollHeight
         * @param {String} p_nScrollHeight Number representing the scrolling height of the LMenu.
         * @private
         */
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

                //  Need to set a width for the LMenu to fix the following problems in 
                //  Firefox 2 and IE:

                //  #1) Scrolled Menus will render at 1px wide in Firefox 2

                //  #2) There is a bug in gecko-based browsers where an element whose 
                //  "position" property is set to "absolute" and "overflow" property is 
                //  set to "hidden" will not render at the correct width when its 
                //  offsetParent's "position" property is also set to "absolute."  It is 
                //  possible to work around this bug by specifying a value for the width 
                //  property in addition to overflow.

                //  #3) In IE it is necessary to give the LMenu a width before the 
                //  scrollbars are rendered to prevent the LMenu from rendering with a 
                //  width that is 100% of the browser viewport.

                bSetWidth = ((UA.gecko && UA.gecko < 1.9) || UA.msie);

                if (nScrollHeight > 0 && bSetWidth && !this.cfg.getProperty(_WIDTH)) {
                    nOffsetWidth = oElement.offsetWidth;
                    /*
                    Measuring the difference of the offsetWidth before and after
                    setting the "width" style attribute allows us to compute the 
                    about of padding and borders applied to the element, which in 
                    turn allows us to set the "width" property correctly.
                     */
                    oElement.style.width = nOffsetWidth + _PX;
                    sWidth = (nOffsetWidth - (oElement.offsetWidth - nOffsetWidth)) + _PX;
                    this.cfg.unsubscribeFromConfigEvent(_WIDTH, this._clearSetWidthFlag);
                    this.cfg.setProperty(_WIDTH, sWidth);

                    /*
                    Set a flag (_widthSetForScroll) to maintain some history regarding how the 
                    "width" configuration property was set.  If the "width" configuration property 
                    is set by something other than the "_setScrollHeight" method, it will be 
                    necessary to maintain that new value and not clear the width if scrolling 
                    is turned off.
                     */
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
                    /*
                    Only clear the the "width" configuration property if it was set the 
                    "_setScrollHeight" method and wasn't changed by some other means after it was set.
                     */
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

        /**
         * @description "renderEvent" handler used to defer the setting of the 
         * "maxheight" configuration property until the menu is rendered in lazy 
         * load scenarios.
         * @method _setMaxHeight
         * @param {String} p_sType The name of the event that was fired.
         * @param {Array} p_aArgs Collection of arguments sent when the event 
         * was fired.
         * @param {Number} p_nMaxHeight Number representing the value to set for the 
         * "maxheight" configuration property.
         * @private
         */
        _setMaxHeight: function(p_sType, p_aArgs, p_nMaxHeight) {
            this._setScrollHeight(p_nMaxHeight);
            this.renderEvent.unOn(this._setMaxHeight);
        },

        /**
         * @description Menu의 "maxheight" configuration property가 변경될때 발생하는 Event 처리 handler
         * @method configMaxHeight
         * @private 
         * @param {String} p_sType 발생한 Event명
         * @param {Array} p_aArgs 발생한 Event의 parameter array
         * @param {Rui.ui.menu.LMenu} p_oMenu Event를 발생시킨 LMenu object
         */
        configMaxHeight: function(p_sType, p_aArgs, p_oMenu) {
            var nMaxHeight = p_aArgs[0];
            if (this.lazyLoad && !this.body && nMaxHeight > 0) {
                this.renderEvent.on(this._setMaxHeight, nMaxHeight, this, true);
            }
            else {
                this._setScrollHeight(nMaxHeight);
            }
        },

        /**
         * @description Menu의 "classname" configuration property가 변경될때 발생하는 Event 처리 handler
         * @method configClassName
         * @private 
         * @param {String} p_sType 발생한 Event명
         * @param {Array} p_aArgs 발생한 Event의 parameter array
         * @param {Rui.ui.menu.LMenu} p_oMenu Event를 발생시킨 LMenu object
         */
        configClassName: function(p_sType, p_aArgs, p_oMenu) {
            var sClassName = p_aArgs[0];
            if (this._sClassName) {
                Dom.removeClass(this.element, this._sClassName);
            }
            Dom.addClass(this.element, sClassName);
            this._sClassName = sClassName;
        },

        /**
         * @description "itemadded" event handler for a LMenu instance.
         * @method _onItemAdded
         * @private
         * @param {String} p_sType The name of the event that was fired.
         * @param {Array} p_aArgs Collection of arguments sent when the event 
         * was fired.
         */
        _onItemAdded: function(p_sType, p_aArgs) {
            var oItem = p_aArgs[0];
            if (oItem) {
                oItem.cfg.setProperty(_DISABLED, true);
            }
        },

        /**
         * @description Menu의 "disabled" configuration property가 변경될때 발생하는 Event 처리 handler
         * @method configDisabled
         * @private        
         * @param {String} p_sType 발생한 Event명
         * @param {Array} p_aArgs 발생한 Event의 parameter array
         * @param {Rui.ui.menu.LMenu} p_oMenu Event를 발생시킨 LMenu object
         */
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

        /**
         * @description Menu의 "shadow" configuration property가 변경될때 발생하는 Event 처리 handler
         * @method configShadow
         * @private
         * @param {String} p_sType 발생한 Event명
         * @param {Array} p_aArgs 발생한 Event의 parameter array
         * @param {Rui.ui.menu.LMenu} p_oMenu Event를 발생시킨 LMenu object
         */
        configShadow: function(p_sType, p_aArgs, p_oMenu) {
            var sizeShadow = function() {
                var oElement = this.element,
                oShadow = this._shadow;

                if (oShadow && oElement) {
                    // Clear the previous width
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
                        /*
                        Need to call sizeShadow & syncIframe via setTimeout for 
                        IE 7 Quirks Mode and IE 6 Standards Mode and Quirks Mode 
                        or the shadow and iframe shim will not be sized and 
                        positioned properly.
                         */
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
                    // If called because the "shadow" event was refired - just append again and resize
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
                        // If the "shadow" event was refired - just append again and resize
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

        /**
         * @description Positions the menu outside of the boundaries of the browser's 
         * viewport.  Called automatically when a menu is hidden to ensure that 
         * it doesn't force the browser to render unnecessary scrollbars.  
         * Menu가 browser를 벗어 났을 경우 필요없는 scrollbar를 생기지 않게 하는 method 
         * @method positionOffScreen
         */
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

        /**
         * @description Finds the menu's root menu.
         * @method getRoot
         */
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

        /**
         * @description Returns a string representing the menu.
         * @method toString
         * @return {String}
         */
        toString: function(){
            var sReturnVal = _MENU,
            sId = this.id;
            if (sId){
                sReturnVal += (_SPACE + sId);
            }
            return sReturnVal;
        },

        /**
         * @description Sets the title of a group of menu items.
         * @method setItemGroupTitle
         * @param {String} p_sGroupTitle String specifying the title of the group.
         * @param {Number} p_nGroupIndex Optional. Number specifying the group to which
         * the title belongs.
         */
        setItemGroupTitle: function(p_sGroupTitle, p_nGroupIndex) {
            var nGroupIndex,
            oTitle,
            i,
            nFirstIndex;

            if (Rui.isString(p_sGroupTitle) && p_sGroupTitle.length > 0) {
                nGroupIndex = Rui.isNumber(p_nGroupIndex) ? p_nGroupIndex : 0;
                oTitle = this._aGroupTitleElements[nGroupIndex];

                if (oTitle) {
                    //oTitle.innerHTML = p_sGroupTitle;
                    Rui.get(oTitle).html(p_sGroupTitle);
                }
                else {
                    oTitle = document.createElement(this.GROUP_TITLE_TAG_NAME);
                    //oTitle.innerHTML = p_sGroupTitle;
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

        /**
         * @description Appends an item to the menu.
         * @method addItem
         * @param {Rui.ui.menu.LMenuItem} p_oItem Object reference for the LMenuItem 
         * instance to be added to the menu.
         * @param {String} p_oItem String specifying the text of the item to be added 
         * to the menu.
         * @param {Object} p_oItem Object literal containing a set of menu item 
         * configuration properties.
         * @param {Number} p_nGroupIndex Optional. Number indicating the group to
         * which the item belongs.
         * @return {Rui.ui.menu.LMenuItem}
         */
        addItem: function(p_oItem, p_nGroupIndex) {
            return this._addItemToGroup(p_nGroupIndex, p_oItem);
        },

        /**
         * @description Adds an array of items to the menu.
         * @method addItems
         * @param {Array} p_aItems Array of items to be added to the menu.  The array 
         * can contain strings specifying the text for each item to be created, object
         * literals specifying each of the menu item configuration properties, 
         * or LMenuItem instances.
         * @param {Number} p_nGroupIndex Optional. Number specifying the group to 
         * which the items belongs.
         * @return {Array}
         */
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

        /**
         * @description load DataSet
         * @private
         * @method onLoadDataSet        
         * @param {LDataSet} Menu정보를 포함하는 LDataSet
         * @return {void}
         */
        onLoadDataSet: function(){
            this.addItemsByDataSet();
            this.render();
        },

        /**
         * @description DataSet에서 menu item을 추출해서 addItems를 수행한다.
         * @method addItemsByDataSet        
         * @param {LDataSet} Menu정보를 포함하는 LDataSet
         * @param {Array} fields는 rootValue값과, parentId, id, text, url 정보를 가지고 있는 field name을 저장한다.
         * @param {Number} p_nGroupIndex Optional. Number specifying the group to 
         * which the items belongs.
         * @return {Array}
         */
        addItemsByDataSet: function(p_nGroupIndex) {
            var ret_val = null;
            if (this.dataSet && this.dataSet) {
                var p_aItems = Rui.util.LJson.decode(this._getItemsByDataSet());
                ret_val = this.addItems(p_aItems, p_nGroupIndex);
            }
            return ret_val;
        },

        /**
         * @description DataSet에서 정보를 추출하여 menu의 json형식으로 변환
         * @method _getItemsByDataSet
         * @private        
         * @return {String}
         */
        _getItemsByDataSet: function() {
            //1.최상위 목록을 가져온다.
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
                //자식이 있으면 submenu로 감싼다.
                child_list = this._addChildItems(rs[i].get(this.fields.id), level);
                child_list = (child_list == "") ? "" : ",submenu:" + child_list;

                if (!grouped) {
                    //DataSet으로 binding할경우 menu item click시 itemClick function을 실행한다.  parameter로 record id
                    list += colon + '{' + 'text:"' + rs[i].get(this.fields.text) + '",onclick:{fn:' + this.fields.onclick + ',obj:"' + rs[i].id + '"}';
                    list += child_list + '}';
                }
                else {
                    //grouping일 경우 []로 싼다.
                    curr = rs[i].get(this.fields.order);
                    if (i == 0) {
                        //첫번째
                        next = rs[i + 1].get(this.fields.order);
                        start_b = "[";
                        end_b = (curr == next) ? "" : "]";
                    }
                    else if (rs.length == (i + 1)) {
                        //마지막
                        //이전값과 비교
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
                            //둘다 같지 않으면
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
        /**
         * @description DataSet에서 자식 item목록 가져오기
         * @method _addChildItems
         * @private        
         * @return {String}
         */
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
                        //grouping일 경우 []로 싼다.
                        curr = rs[i].get(this.fields.order);
                        if (i == 0) {
                            //첫번째
                            next = rs[i + 1].get(this.fields.order);
                            start_b = "[";
                            end_b = (curr == next) ? "" : "]";
                        }
                        else if (rs.length == (i + 1)) {
                            //마지막
                            //이전값과 비교
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
                                //둘다 같지 않으면
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
        /**
         * @description DataSet에서 자식 record목록, group이 있는지 여부 같이 return
         * @method _getChildRecords
         * @private        
         * @return {Array}
         */
        _getChildRecords: function(parent_id) {
            var rs = new Array();
            var row_count = this.dataSet.getCount();
            var r = null;
            for (var i = 0; i < row_count; i++) {
                r = this.dataSet.getAt(i);
                if (r.get(this.fields.parentId) == parent_id) {
                    //부모id가 같으면 행 저장
                    rs.push(r);
                }
            }
            //order field 번호가 중복값이 있으면 group끼리 []로 싸준다.
            //중복값이 있으면 rs sorting을 해서 return
            var grouped = false;
            if (this.fields.order) {
                var sr = this._getSortedRecords(rs);
                grouped = sr[0];
                rs = sr[1];
            }
            return [rs, grouped];
        },
        /**
         * @description sort column이 있는 경우 sorting해서 return하기, grouping된 경우는 grouping 여부를 같이 return
         * @method _getSortedRecords
         * @private        
         * @return {Array}
         */
        _getSortedRecords: function(rs) {
            //1. order.idx 문자열값을 가지는 array를 record 수만큼 만든다.
            var sort_order_idx = new Array();
            var order;
            for (var i = 0; i < rs.length; i++) {
                order = rs[i].get(this.fields.order);                
                sort_order_idx.push((order ? order : 10000000000) + "." + i.toString());
            }
            //2. array를 order field를 기준으로 sort한다.
            sort_order_idx.sort(function(x, y) { return x - y; });
            //3. sort한 순서대로 record array를 새로 만든다.
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
                //같은 order가 있는지 검사하기
                if (!is_same_order) {
                    is_same_order = (cur == prev) ? true : false;
                }
                sorted_rs.push(rs[idx]);
                prev = cur;
            }
            return [is_same_order, sorted_rs];
        },
        /**
         * @description Inserts an item into the menu at the specified index.
         * @method insertItem
         * @param {Rui.ui.menu.LMenuItem} p_oItem Object reference for the LMenuItem 
         * instance to be added to the menu.
         * @param {String} p_oItem String specifying the text of the item to be added 
         * to the menu.
         * @param {Object} p_oItem Object literal containing a set of menu item 
         * configuration properties.
         * @param {Number} p_nItemIndex Number indicating the ordinal position at which
         * the item should be added.
         * @param {Number} p_nGroupIndex Optional. Number indicating the group to which 
         * the item belongs.
         * @return {Rui.ui.menu.LMenuItem}
         */
        insertItem: function(p_oItem, p_nItemIndex, p_nGroupIndex) {
            return this._addItemToGroup(p_nGroupIndex, p_oItem, p_nItemIndex);
        },

        /**
         * @description Removes the specified item from the menu.
         * @method removeItem
         * @param {Rui.ui.menu.LMenuItem} p_oObject Object reference for the LMenuItem 
         * instance to be removed from the menu.
         * @param {Number} p_oObject Number specifying the index of the item 
         * to be removed.
         * @param {Number} p_nGroupIndex Optional. Number specifying the group to 
         * which the item belongs.
         * @return {Rui.ui.menu.LMenuItem}
         */
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

        /**
         * @method getItems
         * @description Returns an array of all of the items in the menu.
         * @return {Array}
         */
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

        /**
         * @description Multi-dimensional Array representing the menu items as they 
         * @method getItemGroups
         * are grouped in the menu.
         * @return {Array}
         */
        getItemGroups: function() {
            return this._aItemGroups;
        },

        /**
         * @description Returns the item at the specified index.
         * @method getItem
         * @param {Number} p_nItemIndex Number indicating the ordinal position of the 
         * item to be retrieved.
         * @param {Number} p_nGroupIndex Optional. Number indicating the group to which 
         * the item belongs.
         * @return {Rui.ui.menu.LMenuItem}
         */
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

        /**
         * @description Returns an array of all of the submenus that are immediate 
         * children of the menu.
         * @method getSubmenus
         * @return {Array}
         */
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

        /**
         * @description Removes all of the content from the menu, including the menu 
         * items, group titles, header and footer.
         * @method clearContent
         */
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

        /**
         * @description Removes the menu's <code>&#60;div&#62;</code> element 
         * (and accompanying child nodes) from the document.
         * @method destroy
         */
        destroy: function() {

            // Remove all items
            this.clearContent();
            this._aItemGroups = null;
            this._aListElements = null;
            this._aGroupTitleElements = null;
            // Continue with the superclass implementation of this method
            LMenu.superclass.destroy.call(this);
            return this;
        },

        /**
         * @description Sets focus to the menu's first enabled item.
         * @method setInitialFocus
         */
        setInitialFocus: function() {
            var oItem = this._getFirstEnabledItem();
            if (oItem) {
                oItem.focus();
            }
            return this;
        },

        /**
         * @description Sets the "selected" configuration property of the menu's first 
         * enabled item to "true."
         * @method setInitialSelection
         */
        setInitialSelection: function() {
            var oItem = this._getFirstEnabledItem();
            if (oItem) {
                oItem.cfg.setProperty(_SELECTED, true);
            }
            return this;
        },

        /**
         * @description Sets the "selected" configuration property of the menu's active
         * item to "false" and hides the item's submenu.
         * @method clearActiveItem
         * @param {boolean} p_bBlur Boolean indicating if the menu's active item 
         * should be blurred.  
         */
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

        /**
         * @description Causes the menu to receive focus and fires the "focus" event.
         * @method focus
         */
        focus: function() {
            if (!this.hasFocus()) {
                this.setInitialFocus();
            }
            return this;
        },

        /**
         * @method blur
         * @description Causes the menu to lose focus and fires the "blur" event.
         */
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

        /**
         * @description Returns a boolean indicating whether or not the menu has focus.
         * @method hasFocus
         * @return {boolean}
         */
        hasFocus: function() {
            return (LMenuManager.getFocusedMenu() == this.getRoot());
        },

        /**
         * @description menu를 disable 상태로 만들기
         * @method disable
         * @return {void}
         */
        disable: function(){
            this.cfg.setProperty(_DISABLED,true);
            return this;
        },

        /**
         * @description menu를 enable 상태로 만들기
         * @method enable
         * @return {void}
         */
        enable: function(){
            this.cfg.setProperty(_DISABLED,false);
            return this;
        },

        /**
         * Adds the specified LCustomEvent subscriber to the menu and each of 
         * its submenus.
         * @method subscribe
         * @param {string}   p_type     the type, or name of the event
         * @param {function} p_fn       the function to exectute when the event fires
         * @param {Object}   p_obj      An object to be passed along when the event 
         *                              fires
         * @param {boolean}  p_override If true, the obj passed in becomes the 
         *                              execution scope of the listener
         */

        /*
         * If Object's instance is LContextMenu or Event's option isCE equal to true, 
         * Apply to CustomEvent. 
         */
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

    /**
    * Creates an item for a menu.
    * 
    * @module ui_menu
    * @plugin /ui/menu/rui_menu.js,/ui/menu/rui_menu.css
    * @class LMenuItem
    * @constructor
    * @param {String} p_oObject String specifying the text of the menu item.
    * @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
    * one-html.html#ID-74680021">HTMLLIElement</a>} p_oObject Object specifying 
    * the <code>&#60;li&#62;</code> element of the menu item.
    * @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
    * one-html.html#ID-38450247">HTMLOptGroupElement</a>} p_oObject Object 
    * specifying the <code>&#60;optgroup&#62;</code> element of the menu item.
    * @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
    * one-html.html#ID-70901257">HTMLOptionElement</a>} p_oObject Object 
    * specifying the <code>&#60;option&#62;</code> element of the menu item.
    * @param {Object} p_oConfig Optional. Object literal specifying the 
    * configuration for the menu item. See configuration class documentation 
    * for more details.
    */
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

    // Private string constants

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

    /**
    * @description Returns a class name for the specified prefix and state.  If the class name does not 
    * yet exist, it is created and stored in the CLASS_NAMES object to increase performance.
    * @method getClassNameForState
    * @private
    * @param {String} prefix String representing the prefix for the class name
    * @param {String} state String representing a state - "disabled," "checked," etc.
    */
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

    /**
    * @description Applies a class name to a LMenuItem instance's &#60;LI&#62; and &#60;A&#62; elements
    * that represents a LMenuItem's state - "disabled," "checked," etc.
    * @method addClassNameForState
    * @private
    * @param {String} state String representing a state - "disabled," "checked," etc.
    */
    var addClassNameForState = function(state) {
        Dom.addClass(this.element, getClassNameForState(this.CSS_CLASS_NAME, state));
        Dom.addClass(this._oAnchor, getClassNameForState(this.CSS_LABEL_CLASS_NAME, state));
        
        if(Rui.useAccessibility()){
             this.element.setAttribute('aria-' + state,  'true');
            this._oAnchor.setAttribute('aria-' + state,  'true');
        }
    };

    /**
    * @description Removes a class name from a LMenuItem instance's &#60;LI&#62; and &#60;A&#62; elements
    * that represents a LMenuItem's state - "disabled," "checked," etc.
    * @method removeClassNameForState
    * @private
    * @param {String} state String representing a state - "disabled," "checked," etc.
    */
    var removeClassNameForState = function(state) {
        Dom.removeClass(this.element, getClassNameForState(this.CSS_CLASS_NAME, state));
        Dom.removeClass(this._oAnchor, getClassNameForState(this.CSS_LABEL_CLASS_NAME, state));
        
        if(Rui.useAccessibility()){
            this.element.setAttribute('aria-' + state,  'false');
            this._oAnchor.setAttribute('aria-' + state,  'false');
        }
    };

    LMenuItem.prototype = {
        /**
        * @description String representing the CSS class(es) to be applied to the 
        * <code>&#60;li&#62;</code> element of the menu item.
        * @property CSS_CLASS_NAME
        * @default "L-ruimenuitem"
        * @private
        * @type String
        */
        CSS_CLASS_NAME: "L-ruimenuitem",

        /**
        * @description String representing the CSS class(es) to be applied to the 
        * menu item's <code>&#60;a&#62;</code> element.
        * @property CSS_LABEL_CLASS_NAME
        * @default "L-ruimenuitemlabel"
        * @private
        * @type String
        */
        CSS_LABEL_CLASS_NAME: "L-ruimenuitemlabel",

        /**
        * @description Object representing the type of menu to instantiate and 
        * add when parsing the child nodes of the menu item's source HTML element.
        * @property SUBMENU_TYPE
        * @private
        * @type Rui.ui.menu.LMenu
        */
        SUBMENU_TYPE: null,

        // Private member variables
        /**
        * @description Object reference to the menu item's 
        * <code>&#60;a&#62;</code> element.
        * @property _oAnchor
        * @default null 
        * @private
        * @type <a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
        * one-html.html#ID-48250443">HTMLAnchorElement</a>
        */
        _oAnchor: null,

        /**
        * @description Object reference to the menu item's submenu.
        * @property _oSubmenu
        * @default null
        * @private
        * @type Rui.ui.menu.LMenu
        */
        _oSubmenu: null,

        /** 
        * @description Object reference to the menu item's current value for the 
        * "onclick" configuration attribute.
        * @property _oOnclickAttributeValue
        * @default null
        * @private
        * @type Object
        */
        _oOnclickAttributeValue: null,

        /**
        * @description The current value of the "classname" configuration attribute.
        * @property _sClassName
        * @default null
        * @private
        * @type String
        */
        _sClassName: null,


        // Public properties

        /**
        * @description Object reference to the menu item's constructor function.
        * @property constructor
        * @default Rui.ui.menu.LMenuItem
        * @type Rui.ui.menu.LMenuItem
        */
        constructor: LMenuItem,

        /**
        * @description Number indicating the ordinal position of the menu item in 
        * its group.
        * @property index
        * @default null
        * @type Number
        */
        index: null,

        /**
        * @description Number indicating the index of the group to which the menu 
        * item belongs.
        * @property groupIndex
        * @default null
        * @type Number
        */
        groupIndex: null,

        /**
        * @description Object reference to the menu item's parent menu.
        * @property parent
        * @default null
        * @type Rui.ui.menu.LMenu
        */
        parent: null,

        /**
        * @description Object reference to the menu item's 
        * <code>&#60;li&#62;</code> element.
        * @property element
        * @default <a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level
        * -one-html.html#ID-74680021">HTMLLIElement</a>
        * @type <a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
        * one-html.html#ID-74680021">HTMLLIElement</a>
        */
        element: null,

        /**
        * @description Object reference to the HTML element (either 
        * <code>&#60;li&#62;</code>, <code>&#60;optgroup&#62;</code> or 
        * <code>&#60;option&#62;</code>) used create the menu item.
        * @property srcElement
        * @default <a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/
        * level-one-html.html#ID-74680021">HTMLLIElement</a>|<a href="http://www.
        * w3.org/TR/2000/WD-DOM-Level-1-20000929/level-one-html.html#ID-38450247"
        * >HTMLOptGroupElement</a>|<a href="http://www.w3.org/TR/2000/WD-DOM-
        * Level-1-20000929/level-one-html.html#ID-70901257">HTMLOptionElement</a>
        * @type <a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
        * one-html.html#ID-74680021">HTMLLIElement</a>|<a href="http://www.w3.
        * org/TR/2000/WD-DOM-Level-1-20000929/level-one-html.html#ID-38450247">
        * HTMLOptGroupElement</a>|<a href="http://www.w3.org/TR/2000/WD-DOM-
        * Level-1-20000929/level-one-html.html#ID-70901257">HTMLOptionElement</a>
        */
        srcElement: null,

        /**
        * @description Object reference to the menu item's value.
        * @property value
        * @default null
        * @type Object
        */
        value: null,

        /**
        * @deprecated Use Rui.browser
        * @property browser
        * @description String representing the browser.
        * @type String
        */
        browser: Panel.prototype.browser,

        /**
        * @description Id of the menu item's root <code>&#60;li&#62;</code> 
        * element.  This property should be set via the constructor using the 
        * configuration object literal.  If an id is not specified, then one will 
        * be created using the "generateId" method of the Dom utility.
        * @property id
        * @default null
        * @type String
        */
        id: null,


        // Events
        /**
        * @description Fires when the menu item's <code>&#60;li&#62;</code> 
        * element is removed from its parent <code>&#60;ul&#62;</code> element.
        * @event destroy
        * @type Rui.util.LCustomEvent
        */

        /**
        * @description Fires when the mouse has entered the menu item.  Passes 
        * back the DOM Event object as an argument.
        * @event mouseOver
        * @type Rui.util.LCustomEvent
        */

        /**
        * @description Fires when the mouse has left the menu item.  Passes back 
        * the DOM Event object as an argument.
        * @event mouseOut
        * @type Rui.util.LCustomEvent
        */

        /**
        * @description Fires when the user mouses down on the menu item.  Passes 
        * back the DOM Event object as an argument.
        * @event mouseDown
        * @type Rui.util.LCustomEvent
        */

        /**
        * @description Fires when the user releases a mouse button while the mouse 
        * is over the menu item.  Passes back the DOM Event object as an argument.
        * @event mouseUp
        * @type Rui.util.LCustomEvent
        */

        /**
        * @description Fires when the user clicks the on the menu item.  Passes 
        * back the DOM Event object as an argument.
        * @event click
        * @type Rui.util.LCustomEvent
        */

        /**
        * @description Fires when the user presses an alphanumeric key when the 
        * menu item has focus.  Passes back the DOM Event object as an argument.
        * @event keyPress
        * @type Rui.util.LCustomEvent
        */

        /**
        * @description Fires when the user presses a key when the menu item has 
        * focus.  Passes back the DOM Event object as an argument.
        * @event keyDown
        * @type Rui.util.LCustomEvent
        */

        /**
        * @description Fires when the user releases a key when the menu item has 
        * focus.  Passes back the DOM Event object as an argument.
        * @event keyUp
        * @type Rui.util.LCustomEvent
        */

        /**
        * @description Fires when the menu item receives focus.
        * @event focus
        * @type Rui.util.LCustomEvent
        */

        /**
        * @description Fires when the menu item loses the input focus.
        * @event blur
        * @type Rui.util.LCustomEvent
        */

        /**
        * @description The LMenuItem class's initialization method. This method is 
        * automatically called by the constructor, and sets up all DOM references 
        * for pre-existing markup, and creates required markup if it is not 
        * already present.
        * @method init
        * @private
        * @param {String} p_oObject String specifying the text of the menu item.
        * @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
        * one-html.html#ID-74680021">HTMLLIElement</a>} p_oObject Object specifying 
        * the <code>&#60;li&#62;</code> element of the menu item.
        * @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
        * one-html.html#ID-38450247">HTMLOptGroupElement</a>} p_oObject Object 
        * specifying the <code>&#60;optgroup&#62;</code> element of the menu item.
        * @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
        * one-html.html#ID-70901257">HTMLOptionElement</a>} p_oObject Object 
        * specifying the <code>&#60;option&#62;</code> element of the menu item.
        * @param {Object} p_oConfig Optional. Object literal specifying the 
        * configuration for the menu item. See configuration class documentation 
        * for more details.
        */
        init: function(p_oObject, p_oConfig) {
            if (!this.SUBMENU_TYPE) {
                this.SUBMENU_TYPE = LMenu;
            }

            // Create the config object
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
                        // Get the anchor node (if it exists)
                        oAnchor = Dom.getFirstChild(p_oObject);

                        // Capture the "text" and/or the "URL"
                        if (oAnchor) {
                            sURL = oAnchor.getAttribute(_HREF, 2);
                            sTarget = oAnchor.getAttribute(_TARGET);
                            sText = oAnchor.innerHTML;
                        }

                        this.srcElement = p_oObject;
                        this.element = p_oObject;
                        this._oAnchor = oAnchor;

                        /*
                        Set these properties silently to sync up the 
                        configuration object without making changes to the 
                        element's DOM
                        */
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


        // Private methods
        /**
        * @description Creates the core DOM structure for the menu item.
        * @method _createRootNodeStructure
        * @private
        */
        _createRootNodeStructure: function() {
            var oElement,
            oAnchor;

            if (!m_oMenuItemTemplate) {
                m_oMenuItemTemplate = document.createElement(_LI_LOWERCASE);
                m_oMenuItemTemplate.innerHTML = _ANCHOR_TEMPLATE;
               // Rui.get(m_oMenuItemTemplate).html(_ANCHOR_TEMPLATE);
            }

            oElement = m_oMenuItemTemplate.cloneNode(true);
            oElement.className = this.CSS_CLASS_NAME;

            oAnchor = oElement.firstChild;
            oAnchor.className = this.CSS_LABEL_CLASS_NAME;

            this.element = oElement;
            this._oAnchor = oAnchor;
            //m_oMenuItemTemplate = null; 
        },

        /**
        * @description Iterates the source element's childNodes collection and uses 
        * the child nodes to instantiate other menus.
        * @method _initSubTree
        * @private
        */
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
                       // oMenu = new this.SUBMENU_TYPE(Dom.generateId());

                        oConfig.setProperty(_SUBMENU, oMenu);

                        for (n = 0; n < nOptions; n++) {
                            oMenu.addItem((new oMenu.ITEM_TYPE(aOptions[n])));
                        }
                    }
                }
            }
        },

        // Event handlers for configuration properties
        /**
        * @description Event handler for when the "text" configuration property of 
        * the menu item changes.
        * @method configText
        * @private
        * @param {String} p_sType String representing the name of the event that 
        * was fired.
        * @param {Array} p_aArgs Array of arguments sent when the event was fired.
        * @param {Rui.ui.menu.LMenuItem} p_oItem Object representing the menu item
        * that fired the event.
        */
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

               // oAnchor.innerHTML = (sEmphasisStartTag + sText + sEmphasisEndTag + sHelpTextHTML);
                Rui.get(oAnchor).html(sEmphasisStartTag + sText + sEmphasisEndTag + sHelpTextHTML);
            }
        },

        /**
        * @description Event handler for when the "helptext" configuration property 
        * of the menu item changes.
        * @method configHelpText
        * @private
        * @param {String} p_sType String representing the name of the event that 
        * was fired.
        * @param {Array} p_aArgs Array of arguments sent when the event was fired.
        * @param {Rui.ui.menu.LMenuItem} p_oItem Object representing the menu item
        * that fired the event.
        */
        configHelpText: function(p_sType, p_aArgs, p_oItem) {
            this.cfg.refireEvent(_TEXT);
        },

        /**
        * @description Event handler for when the "url" configuration property of 
        * the menu item changes.
        * @method configURL
        * @private
        * @param {String} p_sType String representing the name of the event that 
        * was fired.
        * @param {Array} p_aArgs Array of arguments sent when the event was fired.
        * @param {Rui.ui.menu.LMenuItem} p_oItem Object representing the menu item
        * that fired the event.
        */
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

        /**
        * @description Event handler for when the "target" configuration property 
        * of the menu item changes.  
        * @method configTarget
        * @private
        * @param {String} p_sType String representing the name of the event that 
        * was fired.
        * @param {Array} p_aArgs Array of arguments sent when the event was fired.
        * @param {Rui.ui.menu.LMenuItem} p_oItem Object representing the menu item
        * that fired the event.
        */
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

        /**
        * @description Event handler for when the "emphasis" configuration property
        * of the menu item changes.
        * @method configEmphasis
        * @private
        * @param {String} p_sType String representing the name of the event that 
        * was fired.
        * @param {Array} p_aArgs Array of arguments sent when the event was fired.
        * @param {Rui.ui.menu.LMenuItem} p_oItem Object representing the menu item
        * that fired the event.
        */
        configEmphasis: function(p_sType, p_aArgs, p_oItem) {
            var bEmphasis = p_aArgs[0],
            oConfig = this.cfg;

            if (bEmphasis && oConfig.getProperty(_STRONG_EMPHASIS)) {
                oConfig.setProperty(_STRONG_EMPHASIS, false);
            }

            oConfig.refireEvent(_TEXT);
        },

        /**
        * @description Event handler for when the "strongemphasis" configuration 
        * property of the menu item changes.
        * @method configStrongEmphasis
        * @private
        * @param {String} p_sType String representing the name of the event that 
        * was fired.
        * @param {Array} p_aArgs Array of arguments sent when the event was fired.
        * @param {Rui.ui.menu.LMenuItem} p_oItem Object representing the menu item
        * that fired the event.
        */
        configStrongEmphasis: function(p_sType, p_aArgs, p_oItem) {
            var bStrongEmphasis = p_aArgs[0],
            oConfig = this.cfg;

            if (bStrongEmphasis && oConfig.getProperty(_EMPHASIS)) {
                oConfig.setProperty(_EMPHASIS, false);
            }

            oConfig.refireEvent(_TEXT);
        },

        /**
        * @description Event handler for when the "checked" configuration property 
        * of the menu item changes. 
        * @method configChecked
        * @private
        * @param {String} p_sType String representing the name of the event that 
        * was fired.
        * @param {Array} p_aArgs Array of arguments sent when the event was fired.
        * @param {Rui.ui.menu.LMenuItem} p_oItem Object representing the menu item
        * that fired the event.
        */
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

        /**
        * @description Event handler for when the "disabled" configuration property 
        * of the menu item changes. 
        * @method configDisabled
        * @private
        * @param {String} p_sType String representing the name of the event that 
        * was fired.
        * @param {Array} p_aArgs Array of arguments sent when the event was fired.
        * @param {Rui.ui.menu.LMenuItem} p_oItem Object representing the menu item
        * that fired the event.
        */
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

        /**
        * @description Event handler for when the "selected" configuration property 
        * of the menu item changes. 
        * @method configSelected
        * @private
        * @param {String} p_sType String representing the name of the event that 
        * was fired.
        * @param {Array} p_aArgs Array of arguments sent when the event was fired.
        * @param {Rui.ui.menu.LMenuItem} p_oItem Object representing the menu item
        * that fired the event.
        */
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

        /**
        * @description "beforehide" Custom Event handler for a submenu.
        * @method _onSubmenuBeforeHide
        * @private
        * @param {String} p_sType String representing the name of the event that 
        * was fired.
        * @param {Array} p_aArgs Array of arguments sent when the event was fired.
        */
        _onSubmenuBeforeHide: function(p_sType, p_aArgs) {
            var oItem = this.parent,
            oMenu;

            function onHide() {
                oItem._oAnchor.blur();
                //oMenu.unOn('beforeHide', onHide, this);
            }

            if (oItem.hasFocus()) {
                oMenu = oItem.parent;
                oMenu.on('beforeHide', onHide, this, true);
            }
        },

        /**
        * @description Event handler for when the "submenu" configuration property 
        * of the menu item changes. 
        * @method configSubmenu
        * @private
        * @param {String} p_sType String representing the name of the event that 
        * was fired.
        * @param {Array} p_aArgs Array of arguments sent when the event was fired.
        * @param {Rui.ui.menu.LMenuItem} p_oItem Object representing the menu item
        * that fired the event.
        */
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
                    
                    //sSubmenuId = oSubmenu.id;
                    oSubmenuConfig = oSubmenu;
                    oSubmenuConfig.lazyload = bLazyLoad;
                    oSubmenuConfig.parent = this;
                    oSubmenuConfig.id = oSubmenu.id; 
                    oSubmenuConfig.applyTo = oSubmenu.id; 

                    oMenu = new this.SUBMENU_TYPE(oSubmenuConfig);
                    //oMenu = new this.SUBMENU_TYPE(sSubmenuId, oSubmenuConfig);

                    // Set the value of the property to the LMenu instance
                    oConfig.setProperty(_SUBMENU, oMenu, true);
                }
                else {
                     oMenu = new this.SUBMENU_TYPE({applyTo:oSubmenu, lazyload: bLazyLoad, parent: this});
                     // oMenu = new this.SUBMENU_TYPE(oSubmenu, { lazyload: bLazyLoad, parent: this });

                     // Set the value of the property to the LMenu instance
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

        /**
        * @description Event handler for when the "onclick" configuration property 
        * of the menu item changes. 
        * @method configOnClick
        * @private
        * @param {String} p_sType String representing the name of the event that 
        * was fired.
        * @param {Array} p_aArgs Array of arguments sent when the event was fired.
        * @param {Rui.ui.menu.LMenuItem} p_oItem Object representing the menu item
        * that fired the event.
        */
        configOnClick: function(p_sType, p_aArgs, p_oItem) {
            
            var oObject = p_aArgs[0];

            /*
            Remove any existing listeners if a "click" event handler has 
            already been specified.
            */
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

        /**
        * @description Event handler for when the "classname" configuration 
        * property of a menu item changes.
        * @method configClassName
        * @private
        * @param {String} p_sType String representing the name of the event that 
        * was fired.
        * @param {Array} p_aArgs Array of arguments sent when the event was fired.
        * @param {Rui.ui.menu.LMenuItem} p_oItem Object representing the menu item
        * that fired the event.
        */
        configClassName: function(p_sType, p_aArgs, p_oItem) {
            var sClassName = p_aArgs[0];

            if (this._sClassName) {
                Dom.removeClass(this.element, this._sClassName);
            }

            Dom.addClass(this.element, sClassName);
            this._sClassName = sClassName;
        },

        /**
        * @description Dispatches a DOM "click" event to the anchor element of a 
        * LMenuItem instance.
        * @method _dispatchClickEvent
        * @private    
        */
        _dispatchClickEvent: function() {
            var oMenuItem = this,
            oAnchor,
            oEvent;

            if (!oMenuItem.cfg.getProperty(_DISABLED)) {
                oAnchor = Dom.getFirstChild(oMenuItem.element);

                //    Dispatch a "click" event to the LMenuItem's anchor so that its
                //    "click" event handlers will get called in response to the user 
                //    pressing the keyboard shortcut defined by the "keylistener"
                //    configuration property.
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

        /**
        * @description "show" event handler for a LMenu instance - responsible for 
        * setting up the LKeyListener instance for a LMenuItem.
        * @method _createKeyListener
        * @private    
        * @param {String} type String representing the name of the event that 
        * was fired.
        * @param {Array} args Array of arguments sent when the event was fired.
        * @param {Array} keyData Array of arguments sent when the event was fired.
        */
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

        /**
        * @description Event handler for when the "keylistener" configuration 
        * property of a menu item changes.
        * @method configKeyListener
        * @private
        * @param {String} p_sType String representing the name of the event that 
        * was fired.
        * @param {Array} p_aArgs Array of arguments sent when the event was fired.
        */
        configKeyListener: function(p_sType, p_aArgs) {
            var oKeyData = p_aArgs[0],
            oMenuItem = this,
            oMenu = oMenuItem.parent;

            if (oMenuItem._keyData) {

                //    Unsubscribe from the "show" event in case the keylistener 
                //    config was changed before the LMenu was ever made visible.
                oMenu.unOn(_SHOW,
                    oMenuItem._createKeyListener, oMenuItem._keyData);

                oMenuItem._keyData = null;
            }

            //    Tear down for the previous value of the "keylistener" property
            if (oMenuItem._keyListener) {
                oMenu.unOn(_SHOW, oMenuItem._keyListener.enable);
                oMenu.unOn(_HIDE, oMenuItem._keyListener.disable);

                oMenuItem._keyListener.disable();
                oMenuItem._keyListener = null;
            }

            if (oKeyData) {
                oMenuItem._keyData = oKeyData;

                //    Defer the creation of the LKeyListener instance until the 
                //    parent LMenu is visible.  This is necessary since the 
                //    LKeyListener instance needs to be bound to the document the 
                //    LMenu has been rendered into.  Deferring creation of the 
                //    LKeyListener instance also improves performance.
                oMenu.on(_SHOW, oMenuItem._createKeyListener,
                oKeyData, oMenuItem);
            }
        },

        // Public methods
        /**
        * @description Initializes an item's configurable properties.
        * @method initDefaultConfig
        * @private
        */
        initDefaultConfig: function() {
            var oConfig = this.cfg;

            // Define the configuration attributes
            /**
            * @config text
            * @description String specifying the text label for the menu item.  
            * When building a menu from existing HTML the value of this property
            * will be interpreted from the menu's markup.
            * @default ""
            * @type String
            */
            oConfig.addProperty(
            TEXT_CONFIG.key,
            {
                handler: this.configText,
                value: TEXT_CONFIG.value,
                validator: TEXT_CONFIG.validator,
                suppressEvent: TEXT_CONFIG.suppressEvent
            }
        );

            /**
            * @description String specifying additional instructional text to 
            * accompany the text for the menu item.
            * @deprecated Use "text" configuration property to add help text markup.  
            * For example: <code>oMenuItem.cfg.setProperty("text", "Copy &#60;em 
            * class=\"helptext\"&#62;Ctrl + C&#60;/em&#62;");</code>
            * @config helptext
            * @default null
            * @type String|<a href="http://www.w3.org/TR/
            * 2000/WD-DOM-Level-1-20000929/level-one-html.html#ID-58190037">
            * HTMLElement</a>
            */
            oConfig.addProperty(
            HELP_TEXT_CONFIG.key,
            {
                handler: this.configHelpText,
                supercedes: HELP_TEXT_CONFIG.supercedes,
                suppressEvent: HELP_TEXT_CONFIG.suppressEvent
            }
        );

            /**
            * @description String specifying the URL for the menu item's anchor's 
            * "href" attribute.  When building a menu from existing HTML the value 
            * of this property will be interpreted from the menu's markup.
            * @config url
            * @default "#"
            * @type String
            */
            oConfig.addProperty(
            URL_CONFIG.key,
            {
                handler: this.configURL,
                value: URL_CONFIG.value,
                suppressEvent: URL_CONFIG.suppressEvent
            }
        );

            /**
            * @description String specifying the value for the "target" attribute 
            * of the menu item's anchor element. <strong>Specifying a target will 
            * require the user to click directly on the menu item's anchor node in
            * order to cause the browser to navigate to the specified URL.</strong> 
            * When building a menu from existing HTML the value of this property 
            * will be interpreted from the menu's markup.
            * @config target
            * @default null
            * @type String
            */
            oConfig.addProperty(
            TARGET_CONFIG.key,
            {
                handler: this.configTarget,
                suppressEvent: TARGET_CONFIG.suppressEvent
            }
        );

            /**
            * @description Boolean indicating if the text of the menu item will be 
            * rendered with emphasis.
            * @deprecated Use the "text" configuration property to add emphasis.  
            * For example: <code>oMenuItem.cfg.setProperty("text", "&#60;em&#62;Some 
            * Text&#60;/em&#62;");</code>
            * @config emphasis
            * @default false
            * @type Boolean
            */
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

            /**
            * @description Boolean indicating if the text of the menu item will be 
            * rendered with strong emphasis.
            * @deprecated Use the "text" configuration property to add strong emphasis.  
            * For example: <code>oMenuItem.cfg.setProperty("text", "&#60;strong&#62; 
            * Some Text&#60;/strong&#62;");</code>
            * @config strongemphasis
            * @default false
            * @type Boolean
            */
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

            /**
            * @description Boolean indicating if the menu item should be rendered 
            * with a checkmark.
            * @config checked
            * @default false
            * @type Boolean
            */
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

            /**
            * @description Boolean indicating if the menu item should be disabled.  
            * (Disabled menu items are  dimmed and will not respond to user input 
            * or fire events.)
            * @config disabled
            * @default false
            * @type Boolean
            */
            oConfig.addProperty(
            DISABLED_CONFIG.key,
            {
                handler: this.configDisabled,
                value: DISABLED_CONFIG.value,
                validator: DISABLED_CONFIG.validator,
                suppressEvent: DISABLED_CONFIG.suppressEvent
            }
        );

            /**
            * @description Boolean indicating if the menu item should 
            * be highlighted.
            * @config selected
            * @default false
            * @type Boolean
            */
            oConfig.addProperty(
            SELECTED_CONFIG.key,
            {
                handler: this.configSelected,
                value: SELECTED_CONFIG.value,
                validator: SELECTED_CONFIG.validator,
                suppressEvent: SELECTED_CONFIG.suppressEvent
            }
        );

            /**
            * @description Object specifying the submenu to be appended to the 
            * menu item.  The value can be one of the following: <ul><li>Object 
            * specifying a LMenu instance.</li><li>Object literal specifying the
            * menu to be created.  Format: <code>{ id: [menu id], itemdata: 
            * [<a href="Rui.ui.menu.LMenu.html#itemData">array of values for 
            * items</a>] }</code>.</li><li>String specifying the id attribute 
            * of the <code>&#60;div&#62;</code> element of the menu.</li><li>
            * Object specifying the <code>&#60;div&#62;</code> element of the 
            * menu.</li></ul>
            * @config submenu
            * @default null
            * @type LMenu|String|Object|<a href="http://www.w3.org/TR/2000/
            * WD-DOM-Level-1-20000929/level-one-html.html#ID-58190037">
            * HTMLElement</a>
            */
            oConfig.addProperty(
            SUBMENU_CONFIG.key,
            {
                handler: this.configSubmenu,
                supercedes: SUBMENU_CONFIG.supercedes,
                suppressEvent: SUBMENU_CONFIG.suppressEvent
            }
        );

            /**
            * @description Object literal representing the code to be executed when 
            * the item is clicked.  Format:<br> <code> {<br> 
            * <strong>fn:</strong> Function,   &#47;&#47; The handler to call when 
            * the event fires.<br> <strong>obj:</strong> Object, &#47;&#47; An 
            * object to  pass back to the handler.<br> <strong>scope:</strong> 
            * Object &#47;&#47; The object to use for the scope of the handler.
            * <br> } </code>
            * @config onclick
            * @type Object
            * @default null
            */
            oConfig.addProperty(
            ONCLICK_CONFIG.key,
            {
                handler: this.configOnClick,
                suppressEvent: ONCLICK_CONFIG.suppressEvent
            }
        );

            /**
            * @description CSS class to be applied to the menu item's root 
            * <code>&#60;li&#62;</code> element.  The specified class(es) are 
            * appended in addition to the default class as specified by the menu 
            * item's CSS_CLASS_NAME constant.
            * @config classname
            * @default null
            * @type String
            */
            oConfig.addProperty(
            CLASS_NAME_CONFIG.key,
            {
                handler: this.configClassName,
                value: CLASS_NAME_CONFIG.value,
                validator: CLASS_NAME_CONFIG.validator,
                suppressEvent: CLASS_NAME_CONFIG.suppressEvent
            }
        );

            /**
            * @description Object literal representing the key(s) that can be used 
            * to trigger the LMenuItem's "click" event.  Possible attributes are 
            * shift (boolean), alt (boolean), ctrl (boolean) and keys (either an int 
            * or an array of ints representing keycodes).
            * @config keylistener
            * @default null
            * @type Object
            */
            oConfig.addProperty(
            KEY_LISTENER_CONFIG.key,
            {
                handler: this.configKeyListener,
                value: KEY_LISTENER_CONFIG.value,
                suppressEvent: KEY_LISTENER_CONFIG.suppressEvent
            }
        );
        },

        /**
        * @description Finds the menu item's next enabled sibling.
        * @method getNextEnabledSibling
        * @return Rui.ui.menu.LMenuItem
        */
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

                    // Retrieve the first menu item in the next group
                    oNextItem = getNextArrayItem(aNextGroup, 0);
                }

                returnVal = (oNextItem.cfg.getProperty(_DISABLED) ||
                oNextItem.element.style.display == _NONE) ?
                oNextItem.getNextEnabledSibling() : oNextItem;
            }

            return returnVal;
        },

        /**
        * @description Finds the menu item's previous enabled sibling.
        * @method getPreviousEnabledSibling
        * @return {Rui.ui.menu.LMenuItem}
        */
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

        /**
         * @description Causes the menu item to receive the focus and fires the 
         * focus event.
         * @method focus
        */
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

                /*
                Setting focus via a timer fixes a race condition in Firefox, IE 
                and Opera where the browser viewport jumps as it trys to 
                position and focus the menu.
                */
                Rui.later(0, this, setFocus);
            }
            return this;
        },

        /**
        * @description Causes the menu item to lose focus and fires the 
        * blur event.
        * @method blur
        */
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

        /**
        * @description Returns a boolean indicating whether or not the menu item
        * has focus.
        * @method hasFocus
        * @return {boolean}
        */
        hasFocus: function() {
            return (Rui.ui.menu.LMenuManager.getFocusedMenuItem() == this);
        },

        /**
        * @description 하위 메뉴를 가졌는지 true/false return        
        * @method hasSubmenu
        * @return {boolean}
        */
        hasSubmenu: function() {
            return this._oSubmenu ? true : false;
        },

        /**
        * @description LMenu - LMenuItem - LMenu - MenuItem의 Parent - Child 구조에서, 최상위 menu를 return 
        * @method getRootMenu
        * @return {Rui.ui.menu.LMenu}
        */
        getRootMenu: function() {
            var p = this.parent;
            var last_p = null;
            while (p) {
                last_p = p;
                p = p.parent;
            }
            return last_p;
        },

        /**
        * @description Removes the menu item's <code>&#60;li&#62;</code> element 
        * from its parent <code>&#60;ul&#62;</code> element.
        * @method destroy
        */
        destroy: function() {
            var oEl = this.element,
            oSubmenu,
            oParentNode,
            aEventData,
            i;

            if (oEl) {
                // If the item has a submenu, destroy it first
                oSubmenu = this.cfg.getProperty(_SUBMENU);

                if (oSubmenu) {
                    oSubmenu.destroy();
                }

                // Remove the element from the parent node
                oParentNode = oEl.parentNode;
                if (oParentNode) {
                    oParentNode.removeChild(oEl);
                    this.destroyEvent.fire();
                }

                // Remove LCustomEvent listeners
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

        /**
        * @description Returns a string representing the menu item.
        * @method toString
        * @return {String}
        */
        toString: function() {
            var sReturnVal = _MENUITEM,
            sId = this.id;

            if (sId) {
                sReturnVal += (_SPACE + sId);
            }

            return sReturnVal;
        },
        
        /**
        * @description text 변경
        * @method setText
        * @param {String} text String 메뉴명
        */
        setText: function(text){
            this.cfg.setProperty(_TEXT,text);
            return this;
        },
        
        /**
        * @description 메뉴 text 가져오기
        * @method getText
        */
        getText: function(){
            this.cfg.getProperty(_TEXT);
            return this;
        },
        
        /**
        * @description url 변경
        * @method setURL
        * @param {String} text String url
        */
        setURL: function(url){
            this.cfg.setProperty(_URL,url);
            return this;
        },
        
        /**
        * @description 메뉴 url 가져오기
        * @method getURL
        */
        getURL: function(){
            this.cfg.getProperty(_URL);
            return this;
        },
        
        /**
        * @description url target 변경
        * @method setTarget
        * @param {String} text String url target
        */
        setTarget: function(target){
            this.cfg.setProperty(_TARGET,target);
            return this;
        },
        
        /**
        * @description 메뉴 url target 가져오기
        * @method getTarget
        */
        getTarget: function(){
            this.cfg.getProperty(_TARGET);
            return this;
        },
        
        /**
        * @description 메뉴 check 표시
        * @method check
        */
        check: function(){
            this.cfg.setProperty(_CHECKED,true);
            return this;
        },
        
        /**
        * @description 메뉴 check 표시 제거
        * @method unCheck
        */
        unCheck: function(){
            this.cfg.setProperty(_CHECKED,false);
            return this;
        },
        
        /**
        * @description 메뉴 비활성화
        * @method disable
        */
        disable: function(){
            this.cfg.setProperty(_DISABLED,true);
            return this;
        },
        
        /**
        * @description 메뉴 활성화
        * @method enable
        */
        enable: function(){
            this.cfg.setProperty(_DISABLED,false);
            return this;
        },
        
        /**
        * @description 메뉴 선택
        * @method select
        */
        select: function(){
            this.cfg.setProperty(_SELECTED,true);
            return this;
        },
        
        /**
        * @description 메뉴 선택해제
        * @method unSelect
        */
        unSelect: function(){
            this.cfg.setProperty(_SELECTED,false);
            return this;
        }
    };

    Rui.applyPrototype(LMenuItem, Rui.util.LEventProvider);
})();
//build order : 6
(function()
{
    // String constants

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

    /**
    * Horizontal collection of items, each of which can contain a submenu.
    * 
    * @module widget_menu
    * @plugin /ui/menu/rui_menu.js,/ui/menu/rui_menu.css
    * @class LMenuBar
    * @constructor
    * @param {String} p_oElement String specifying the id attribute of the 
    * <code>&#60;div&#62;</code> element of the menu bar.
    * @param {String} p_oElement String specifying the id attribute of the 
    * <code>&#60;select&#62;</code> element to be used as the data source for the 
    * menu bar.
    * @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
    * one-html.html#ID-22445964">HTMLDivElement</a>} p_oElement Object specifying 
    * the <code>&#60;div&#62;</code> element of the menu bar.
    * @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
    * one-html.html#ID-94282980">HTMLSelectElement</a>} p_oElement Object 
    * specifying the <code>&#60;select&#62;</code> element to be used as the data 
    * source for the menu bar.
    * @param {Object} p_oConfig Optional. Object literal specifying the 
    * configuration for the menu bar. See configuration class documentation for
    * more details.
    * @extends Rui.ui.menu.LMenu
    * @namespace Rui.ui.menu
    */
    Rui.ui.menu.LMenuBar = function(oConfig)
    {
        oConfig = oConfig || {}; 
        Rui.ui.menu.LMenuBar.superclass.constructor.call(this, oConfig);
    };

    /**
    * @description Checks to make sure that the value of the "position" property 
    * is one of the supported strings. Returns true if the position is supported.
    * @method checkPosition
    * @private
    * @param {Object} p_sPosition String specifying the position of the menu.
    * @return {boolean}
    */
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
       
        /**
         * @description 객체를 Config정보를 초기화하는 메소드
         * @method initDefaultConfig
         * @protected 
         * @return {void}
         */
         initDefaultConfig: function() {
             LMenuBar.superclass.initDefaultConfig.call(this); 
         }, 
         
         /**
          * @description Dom객체 생성 및 초기화하는 메소드
          * @method initComponent
          * @protected
          * @param {Object} config 환경정보 객체 
          * @return {void}
          */
          initComponent: function(config){
              LMenuBar.superclass.initComponent.call(this,config); 
          },
          
          /**
          * @description 객체의 이벤트 초기화 메소드
          * @method initEvents
          * @protected
          * @return {void}
          */
          initEvents: function() {
              LMenuBar.superclass.initEvents.call(this); 
              
               if (!this.ITEM_TYPE)
               {
                   this.ITEM_TYPE = Rui.ui.menu.LMenuBarItem;
               }
          },
          
          /**
           * @description element Dom객체 생성
           * @method createContainer
           * @protected
           * @return {LElement}
           */
           createContainer: function() {
               return LMenuBar.superclass.createContainer.call(this); 
           },
        
        /**
         * @description render후 호출되는 메소드
         * @method afterRender
         * @protected
         * @param {HTMLElement} container 부모 객체
         * @return {void}
         */
       afterRender: function(container) {
           LMenuBar.superclass.afterRender.call(this,container);
       }, 

        // Constants
        /**
        * @description String representing the CSS class(es) to be applied to the menu 
        * bar's <code>&#60;div&#62;</code> element.
        * @property CSS_CLASS_NAME
        * @default "L-ruimenubar"
        * @private
        * @type String
        */
        CSS_CLASS_NAME: "L-ruimenubar",

        /**
        * @description Width (in pixels) of the area of a LMenuBarItem that, when pressed, will toggle the
        * display of the LMenuBarItem's submenu.
        * @property SUBMENU_TOGGLE_REGION_WIDTH
        * @default 20
        * @private
        * @type Number
        */
        SUBMENU_TOGGLE_REGION_WIDTH: 20,

        // Protected event handlers
        /**
        * @description "keydown" Custom Event handler for the menu bar.
        * @method _onKeyDown
        * @private
        * @param {String} p_sType String representing the name of the event that 
        * was fired.
        * @param {Array} p_aArgs Array of arguments sent when the event was fired.
        * @param {Rui.ui.menu.LMenuBar} p_oMenuBar Object representing the menu bar 
        * that fired the event.
        */
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
                    case 37:    // Left arrow
                    case 39:    // Right arrow
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

                    case 40:    // Down arrow
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
            { // Esc key
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

        /**
        * @description "click" event handler for the menu bar.
        * @method _onClick
        * @protected
        * @param {String} p_sType String representing the name of the event that 
        * was fired.
        * @param {Array} p_aArgs Array of arguments sent when the event was fired.
        * @param {Rui.ui.menu.LMenuBar} p_oMenuBar Object representing the menu bar 
        * that fired the event.
        */
        _onClick: function(p_sType, p_aArgs, p_oMenuBar)
        {
            LMenuBar.superclass._onClick.call(this, p_sType, p_aArgs, p_oMenuBar);

            var oItem = p_aArgs[1],
                bReturnVal = true,
                oItemEl,
                oEvent,
//                oTarget,
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
//                oTarget = Event.getTarget(oEvent);
                oActiveItem = this.activeItem;
                oConfig = this.cfg;

                // Hide any other submenus that might be visible
                if (oActiveItem && oActiveItem != oItem)
                {
                    this.clearActiveItem();
                }

                oItem.cfg.setProperty(_SELECTED, true);
                
                if(Rui.useAccessibility())
                    oItemCfg.setAttribute('aria-selected', 'true');

                // Show the submenu for the item
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

                            /*
                            Return false so that other click event handlers are not called when the 
                            user clicks inside the toggle region.
                            */
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

        // Public methods
        /**
        * @description Event handler for when the "submenutoggleregion" configuration property of 
        * a LMenuBar changes.
        * @method configSubmenuToggle
        * @private
        * @param {String} p_sType The name of the event that was fired.
        * @param {Array} p_aArgs Collection of arguments sent when the event was fired.
        */
        configSubmenuToggle: function(p_sType, p_aArgs)
        {
            var bSubmenuToggle = p_aArgs[0];

            if (bSubmenuToggle)
            {
                this.cfg.setProperty(_AUTO_SUBMENU_DISPLAY, false);
            }
        },

        /**
        * @description Returns a string representing the menu bar.
        * @method toString
        * @return {String}
        */
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

        /**
        * @description Initializes the class's configurable properties which can be
        * changed using the menu bar's Config object ("cfg").
        * @method initDefaultConfig
        * @private
        * @return {void}
        */
        initDefaultConfig: function()
        {
            LMenuBar.superclass.initDefaultConfig.call(this);
            var oCfg = this.cfg;

            // Add configuration properties
            /*
            Set the default value for the "position" configuration property
            to "static" by re-adding the property.
            */
            /**
            * @description String indicating how a menu bar should be positioned on the 
            * screen.  Possible values are "static" and "dynamic."  Static menu bars 
            * are visible by default and reside in the normal flow of the document 
            * (CSS position: static).  Dynamic menu bars are hidden by default, reside
            * out of the normal flow of the document (CSS position: absolute), and can 
            * overlay other elements on the screen.
            * @config position
            * @default static
            * @type String
            */
            oCfg.addProperty(
                POSITION_CONFIG.key,
                {
                    handler: this.configPosition,
                    value: POSITION_CONFIG.value,
                    validator: POSITION_CONFIG.validator,
                    supercedes: POSITION_CONFIG.supercedes
                }
            );

            /*
            Set the default value for the "submenualignment" configuration property
            to ["tl","bl"] by re-adding the property.
            */
            /**
            * @description Array defining how submenus should be aligned to their 
            * parent menu bar item. The format is: [itemCorner, submenuCorner].
            * @config submenualignment
            * @default ["tl","bl"]
            * @type Array
            */
            oCfg.addProperty(
                SUBMENU_ALIGNMENT_CONFIG.key,
                {
                    value: SUBMENU_ALIGNMENT_CONFIG.value,
                    suppressEvent: SUBMENU_ALIGNMENT_CONFIG.suppressEvent
                }
            );

            /*
            Change the default value for the "autosubmenudisplay" configuration 
            property to "false" by re-adding the property.
            */
            /**
            * @description Boolean indicating if submenus are automatically made 
            * visible when the user mouses over the menu bar's items.
            * @config autosubmenudisplay
            * @default false
            * @type Boolean
            */
            oCfg.addProperty(
               AUTO_SUBMENU_DISPLAY_CONFIG.key,
               {
                   value: AUTO_SUBMENU_DISPLAY_CONFIG.value,
                   validator: AUTO_SUBMENU_DISPLAY_CONFIG.validator,
                   suppressEvent: AUTO_SUBMENU_DISPLAY_CONFIG.suppressEvent
               }
            );

            /**
            * @description Boolean indicating if only a specific region of a LMenuBarItem should toggle the 
            * display of a submenu.  The default width of the region is determined by the value of the
            * SUBMENU_TOGGLE_REGION_WIDTH property.  If set to true, the autosubmenudisplay 
            * configuration property will be set to false, and any click event listeners will not be 
            * called when the user clicks inside the submenu toggle region of a LMenuBarItem.  If the 
            * user clicks outside of the submenu toggle region, the LMenuBarItem will maintain its 
            * standard behavior.
            * @config submenutoggleregion
            * @default false
            * @type Boolean
            */
            oCfg.addProperty(
               SUBMENU_TOGGLE_REGION_CONFIG.key,
               {
                   value: SUBMENU_TOGGLE_REGION_CONFIG.value,
                   validator: SUBMENU_TOGGLE_REGION_CONFIG.validator,
                   handler: this.configSubmenuToggle
               }
            );
        }
    }); // END Rui.extend
} ());
/**
 * Creates an item for a menu bar.
 * 
 * @module ui_menu
 * @plugin /ui/menu/rui_menu.js,/ui/menu/rui_menu.css
 * @class LMenuBarItem
 * @extends Rui.ui.menu.LMenuItem
 * @constructor
 * @param {String} p_oObject String specifying the text of the menu bar item.
 * @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
 * one-html.html#ID-74680021">HTMLLIElement</a>} p_oObject Object specifying the 
 * <code>&#60;li&#62;</code> element of the menu bar item.
 * @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
 * one-html.html#ID-38450247">HTMLOptGroupElement</a>} p_oObject Object 
 * specifying the <code>&#60;optgroup&#62;</code> element of the menu bar item.
 * @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
 * one-html.html#ID-70901257">HTMLOptionElement</a>} p_oObject Object specifying 
 * the <code>&#60;option&#62;</code> element of the menu bar item.
 * @param {Object} p_oConfig Optional. Object literal specifying the 
 * configuration for the menu bar item. See configuration class documentation 
 * for more details.
 * @extends Rui.ui.menu.LMenuItem
 * @plugin menu/rui_menu.js
 */
Rui.ui.menu.LMenuBarItem = function(p_oObject, p_oConfig)
{
    Rui.ui.menu.LMenuBarItem.superclass.constructor.call(this, p_oObject, p_oConfig);
};

Rui.extend(Rui.ui.menu.LMenuBarItem, Rui.ui.menu.LMenuItem, {
    /**
     * @description The LMenuBarItem class's initialization method. This method is 
     * automatically called by the constructor, and sets up all DOM references for 
     * pre-existing markup, and creates required markup if it is not already present.
     * @method init
     * @private
     * @param {String} p_oObject String specifying the text of the menu bar item.
     * @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
     * one-html.html#ID-74680021">HTMLLIElement</a>} p_oObject Object specifying the 
     * <code>&#60;li&#62;</code> element of the menu bar item.
     * @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
     * one-html.html#ID-38450247">HTMLOptGroupElement</a>} p_oObject Object 
     * specifying the <code>&#60;optgroup&#62;</code> element of the menu bar item.
     * @param {<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/level-
     * one-html.html#ID-70901257">HTMLOptionElement</a>} p_oObject Object specifying 
     * the <code>&#60;option&#62;</code> element of the menu bar item.
     * @param {Object} p_oConfig Optional. Object literal specifying the 
     * configuration for the menu bar item. See configuration class documentation 
     * for more details.
     */
    init: function(p_oObject, p_oConfig)
    {
        if (!this.SUBMENU_TYPE)
        {
            this.SUBMENU_TYPE = Rui.ui.menu.LMenu;
        }

        /* 
        Call the init of the superclass (Rui.ui.menu.LMenuItem)
        Note: We don't pass the user config in here yet 
        because we only want it executed once, at the lowest 
        subclass level.
         */
        Rui.ui.menu.LMenuBarItem.superclass.init.call(this, p_oObject);

        var oConfig = this.cfg;

        if (p_oConfig)
        {
            oConfig.applyConfig(p_oConfig, true);
        }

        oConfig.fireQueue();
    },

    // Constants
    /**
     * @description String representing the CSS class(es) to be applied to the 
     * <code>&#60;li&#62;</code> element of the menu bar item.
     * @property CSS_CLASS_NAME
     * @default "L-ruimenubaritem"
     * @private
     * @type String
     */
    CSS_CLASS_NAME: "L-ruimenubaritem",

    /**
     * @description String representing the CSS class(es) to be applied to the 
     * menu bar item's <code>&#60;a&#62;</code> element.
     * @property CSS_LABEL_CLASS_NAME
     * @default "L-ruimenubaritemlabel"
     * @private
     * @type String
     */
    CSS_LABEL_CLASS_NAME: "L-ruimenubaritemlabel",

    // Public methods
    /**
     * @description Returns a string representing the menu bar item.
     * @method toString
     * @return {String}
     */
    toString: function()
    {
        var sReturnVal = "LMenuBarItem";

        if (this.cfg && this.cfg.getProperty("text"))
        {
            sReturnVal += (": " + this.cfg.getProperty("text"));
        }

        return sReturnVal;
    }
}); // END Rui.extend
Rui.namespace('Rui.ui.menu');
(function(){
    var _XY = 'xy',
        _MOUSEDOWN = 'mousedown',
        _CONTEXTMENU = 'LContextMenu',
        _SPACE = ' ';

    /**
     * html context 메뉴를 생성한다.
     * @module ui_menu
     * @plugin /ui/menu/rui_menu.js,/ui/menu/rui_menu.css
     * @class LContextMenu
     * @sample default
     * @constructor
     * @param {Object} config The intial LContextMenu.
     * @extends Rui.ui.menu.LMenu
     * @namespace Rui.ui.menu
     */
    Rui.ui.menu.LContextMenu = function(config){
        config = config || {}; 
        Rui.ui.menu.LContextMenu.superclass.constructor.call(this, config);
        Rui.applyObject(this, config, true);
    };

    var Event = Rui.util.LEvent,
    UA = Rui.browser,
    LContextMenu = Rui.ui.menu.LContextMenu;

    /**
     * Constant representing the name of the LContextMenu's events
     * @property EVENT_TYPES
     * @private
     * @final
     * @type Object
     */
    EVENT_TYPES = {
        'TRIGGER_CONTEXT_MENU': 'triggerContextMenu',
        'CONTEXT_MENU': (UA.opera ? _MOUSEDOWN : 'contextmenu'),
        'CLICK': 'click'
    },

    /**
     * Constant representing the LContextMenu's configuration properties
     * @property DEFAULT_CONFIG
     * @private
     * @final
     * @type Object
     */
    TRIGGER_CONFIG = {
        key: 'trigger',
        suppressEvent: true
    };

    /**
     * @method position
     * @description 'beforeShow' event handler used to position the contextmenu.
     * @private
     * @param {String} p_sType String representing the name of the event that was fired.
     * @param {Array} p_aArgs Array of arguments sent when the event was fired.
     * @param {Array} p_aPos Array representing the xy position for the context menu.
     */
    function position(p_sType, p_aArgs, p_aPos){
        this.cfg.setProperty(_XY, p_aPos);
        //this.unOn('beforeShow', position, p_aPos);
    }

    Rui.extend(Rui.ui.menu.LContextMenu, Rui.ui.menu.LMenu, {
        otype: 'Rui.ui.menu.LContextMenu',
        // Private properties
        /**
         * @description Object reference to the current value of the 'trigger' 
         * configuration property.
         * @property _oTrigger
         * @default null
         * @private
         * @type String|<a href="http://www.w3.org/TR/2000/WD-DOM-Level-1-20000929/leve
         * l-one-html.html#ID-58190037">HTMLElement</a>|Array
         */
        _oTrigger: null,
        /**
         * @description Boolean indicating if the display of the context menu should 
         * be cancelled.
         * @property _bCancelled
         * @default false
         * @private
         * @type Boolean
         */
        _bCancelled: false,
        /**
         * @description 브라우져 context 메뉴를 출력할지 여부
         * @property defaultContextMenu
         * @default true
         * @private
         *   @type Boolean
         */
        _defaultContextMenu: true,
        // Public properties
        /**
         * @description Object reference for the HTML element that was the target of the
         * 'contextmenu' DOM event ('mousedown' for Opera) that triggered the display of 
         * the context menu.
         * @property contextEventTarget
         * @private
         * @default null
         * @type {HTMLElement}
         */
        contextEventTarget: null,
        /**
         * @description Initializes the class's configurable properties which can be 
         * changed using the context menu's Config object ('cfg').
         * @method initDefaultConfig
         * @protected
         * @return {void}
         */
        initDefaultConfig: function(){
            Rui.ui.menu.LContextMenu.superclass.initDefaultConfig.call(this);

            /**
             * @description context menu가 출력될 경우의 범위를 지정하는 html dom id
             * @config trigger
             * @sample default
             * @default null
             * @type String|HTMLElement|Array
             */
            this.cfg.addProperty(TRIGGER_CONFIG.key, {
                    handler: this.configTrigger,
                    suppressEvent: TRIGGER_CONFIG.suppressEvent
                }
            );
        },
        /**
         * @description Initializes the custom events for the context menu.
         * @method initEvents
         * @protected
         * @return {void}
         */
        initEvents: function(){
            Rui.ui.menu.LContextMenu.superclass.initEvents.call(this);
            this.createEvent('triggerContextMenu'); 
            this._on('show', function(e){
                if(this._defaultContextMenu == false) this.hide();
            }, this, true);
        },

        /**
         * @description Cancels the display of the context menu.
         * @method cancel
         * @param {boolean} defaultContextMenu [optional] 브라우져 기본 context메뉴 출력 여부 (기본 true)
         * @return {void}
         */
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

        // Private methods
        /**
         * @description Removes all of the DOM event handlers from the HTML element(s) 
         * whose 'context menu' event ('click' for Opera) trigger the display of 
         * the context menu.
         * @method _removeEventHandlers
         * @private
         * @return {void}
         */
        _removeEventHandlers: function() {
            var oTrigger = this._oTrigger;
            // Remove the event handlers from the trigger(s)
            if (oTrigger)
            {
                Event.removeListener(oTrigger, EVENT_TYPES.CONTEXT_MENU, this._onTriggerContextMenu);
                if (UA.opera)
                {
                    Event.removeListener(oTrigger, EVENT_TYPES.CLICK, this._onTriggerClick);
                }
            }
        },

        // Private event handlers
        /**
         * @description 'click' event handler for the HTML element(s) identified as the 
         * 'trigger' for the context menu.  Used to cancel default behaviors in Opera.
         * @method _onTriggerClick
         * @private
         * @param {Event} p_oEvent Object representing the DOM event object passed back by the event utility (Rui.util.LEvent).
         * @param {Rui.ui.menu.LContextMenu} p_oMenu Object representing the context  menu that is handling the event.
         */
        _onTriggerClick: function(p_oEvent, p_oMenu) {
            if (p_oEvent.ctrlKey) {
                Event.stopEvent(p_oEvent);
            }
        },
        /**
         * @description 'contextmenu' event handler ('mousedown' for Opera) for the HTML 
         * element(s) that trigger the display of the context menu.
         * @method _onTriggerContextMenu
         * @private
         * @param {Event} p_oEvent Object representing the DOM event object passed back by the event utility (Rui.util.LEvent).
         * @param {Rui.ui.menu.LContextMenu} p_oMenu Object representing the context  menu that is handling the event.
         */
        _onTriggerContextMenu: function(p_oEvent, p_oMenu){
            var aXY;
            this._defaultContextMenu = true;
            if (!(p_oEvent.type == _MOUSEDOWN && !p_oEvent.ctrlKey)) {
                this.contextEventTarget = Event.getTarget(p_oEvent);
                //this.triggerContextMenuEvent.fire(p_oEvent);
                this.fireEvent('triggerContextMenu', {target: p_oEvent});

                
                if (!this._bCancelled) {
                    /*
                    Prevent the browser's default context menu from appearing and 
                    stop the propagation of the 'contextmenu' event so that 
                    other LContextMenu instances are not displayed.
                    */
                    Event.stopEvent(p_oEvent);
                    
                    // Hide any other LMenu instances that might be visible
                    Rui.ui.menu.LMenuManager.hideVisible();
                    
                    
                    // Position and display the context menu
                    aXY = Event.getXY(p_oEvent);

                    if (!Rui.util.LDom.inDocument(this.element)) {
                        
                        //this.beforeShowEvent.on(position, aXY);
                        this.on('beforeShow', position, aXY, true);
                    } else {
                        this.cfg.setProperty(_XY, aXY);
                    }

                    // 강제로 최대로 올림.
                    this.cfg.setProperty('zindex', 99999);
                     
                    this.show(); 
                }
                this._bCancelled = false;
            }
        },
        /**
         * @description 'hide' event handler for the menu.
         * @method _onHide
         * @private
         * @param {String} p_sType String representing the name of the event that was fired.
         * @param {Array} p_aArgs Array of arguments sent when the event was fired.
         */
        _onHide: function(p_sType, p_aArgs) {
            LContextMenu.superclass._onHide.call(this, p_sType, p_aArgs);
            // 강제로 최하로 내림.
            this.cfg.setProperty('zindex', 1);
        },
        // Public methods
        /**
         * @description Returns a string representing the context menu.
         * @method toString
         * @return {String}
         */
        toString: function(){
            var sReturnVal = _CONTEXTMENU,
            sId = this.id;
            if (sId) {
                sReturnVal += (_SPACE + sId);
            }
            return sReturnVal;
        },
        /**
         * @description Removes the context menu's <code>&#60;div&#62;</code> element 
         * (and accompanying child nodes) from the document.
         * @method destroy
         */
        destroy: function(){
            // Remove the DOM event handlers from the current trigger(s)
            this._removeEventHandlers();

            // Continue with the superclass implementation of this method
            LContextMenu.superclass.destroy.call(this);
            return this;
        },
        // Protected event handlers for configuration properties
        /**
         * @description Event handler for when the value of the 'trigger' configuration 
         * property changes. 
         * @method configTrigger
         * @protected
         * @param {String} p_sType String representing the name of the event that was fired.
         * @param {Array} p_aArgs Array of arguments sent when the event was fired.
         * @param {Rui.ui.menu.LContextMenu} p_oMenu Object representing the context menu that fired the event.
         */
        configTrigger: function(p_sType, p_aArgs, p_oMenu){
            var oTrigger = p_aArgs[0];
            if (oTrigger) {
                /*
                If there is a current 'trigger' - remove the event handlers 
                from that element(s) before assigning new ones
                */
                if (this._oTrigger)
                {
                    this._removeEventHandlers();
                }
                this._oTrigger = oTrigger;

                /*
                Listen for the 'mousedown' event in Opera b/c it does not 
                support the 'contextmenu' event
                */                
                Event.on(oTrigger, EVENT_TYPES.CONTEXT_MENU, this._onTriggerContextMenu, this, true);

                /*
                Assign a 'click' event handler to the trigger element(s) for
                Opera to prevent default browser behaviors.
                */
                if (UA.opera) {
                    Event.on(oTrigger, EVENT_TYPES.CLICK, this._onTriggerClick, this, true);
                }
            } else {
                this._removeEventHandlers();
            }
        }
    });
} ());
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
Rui.namespace('Rui.ui.menu');

/**
 * @description 메뉴를 slide 형식으로 생성한다.
 * @namespace Rui.ui.menu
 * @plugin /ui/menu/rui_menu.js,/ui/menu/rui_menu.css
 * @class LSlideMenu
 * @extends Rui.ui.LUnorderedList
 * @sample default
 * @constructor LSlideMenu
 * @param {Object} oConfig The intial LSlideMenu.
 */
Rui.ui.menu.LSlideMenu = function(oConfig){
    var config = oConfig || {};
    config = Rui.applyIf(config, Rui.getConfig().getFirst('$.ext.slideMenu.defaultProperties'));
    //이전버전 호환성 코드
    config.onlyOneTopOpen = config.onlyOneTopOpen !== undefined ? config.onlyOneTopOpen : config.onlyOneActiveMenuMode;
    config.defaultOpenTopIndex = config.defaultOpenTopIndex !== undefined ? config.defaultOpenTopIndex : config.defaultShowIndex;
    Rui.ui.menu.LSlideMenu.superclass.constructor.call(this, config);   
};

Rui.extend(Rui.ui.menu.LSlideMenu, Rui.ui.LUnorderedList, {
    /**
     * @description 객체의 문자열
     * @property otype
     * @private
     * @type {String}
     */
    otype: 'Rui.ui.menu.LSlideMenu',
    CSS_BASE: 'L-ul L-ul-slidemenu',
    /**
     * 웹접근성 지원을위한 container의 role atrribute
     * @private  
     * @property accessibilityELRole
     * @type {String}
     */
    accessibilityELRole: 'menubar',
    /**
     * 웹 접근성을 위한 UL Tag의 role 속성의 값을 가져온다.
     * @protected
     * @method getAccessibilityUlRole
     * @param {int} depth ul의 depth
     * @return {String} 웹접근성의 role 속성의 값
     */
    getAccessibilityUlRole: function(depth){
        if(depth == 0)
            return 'menubar';
        return 'menu';
    },
    /**
     * 웹 접근성을 위한 LI Tag의 role 속성의 값을 가져온다.
     * @protected
     * @method getAccessibilityLiRole
     * @return {String} 웹접근성의 role 속성의 값
     */
    getAccessibilityLiRole: function(){
        //메뉴의 li 태그에는 menuitemcheckbox, menuitemradio, separator 등이 더 사용될 수 있다. 현재 LSlideMenu는 이런 기능이 없다.
        return 'menuitem';
    },
    /**
     * dom으로 node 만들기
     * @protected 
     * @method createNodeObject
     * @param {HTMLElement} dom
     * @return {Rui.ui.menu.LTabMenuNode}
     */
    createNodeObject: function(dom){
        return new Rui.ui.menu.LSlideMenuNode({
            useAnimation: this.useAnimation,
            unorderList: this,
            dom: dom
        });
    }
});

/**
 * SlideMenu의 Node
 * @namespace Rui.ui.menu
 * @class LSlideMenuNode
 * @extends Rui.ui.LUnorderedListNode
 * @constructor LSlideMenuNode
 * @param {Object} oConfig The intial LSlideMenuNode.
 * @plugin /ui/menu/rui_menu.js,/ui/menu/rui_menu.css
 */
Rui.ui.menu.LSlideMenuNode = function(config){
    Rui.ui.menu.LSlideMenuNode.superclass.constructor.call(this, config);
};
Rui.extend(Rui.ui.menu.LSlideMenuNode, Rui.ui.LUnorderedListNode, {
    /**
     * @description 객체의 문자열
     * @property otype
     * @private
     * @type {String}
     */
    otype: 'Rui.ui.menu.LSlideMenuNode'
});

Rui.namespace('Rui.ui.menu');
/**
 * @description tab 형식의 menu를 생성한다.
 * @namespace Rui.ui.menu
 * @plugin /ui/menu/rui_menu.js,/ui/menu/rui_menu.css
 * @class LTabMenu
 * @extends Rui.ui.LUnorderedList
 * @sample default
 * @constructor LTabMenu
 * @param {Object} config The intial LTabMenu.
 */
Rui.ui.menu.LTabMenu = function(config){
    config = config || {};
    config = Rui.applyIf(config, Rui.getConfig().getFirst('$.ext.tabMenu.defaultProperties'));
    
    if(Rui.platform.isMobile){
    	config.expandOnOver = false;
    }
    
    Rui.ui.menu.LTabMenu.superclass.constructor.call(this, config);
    /**
     * @description node에 mouseover시 발생하는 event, node가 expand된다.
     * @event nodeOver
     * @param {Rui.ui.LUnorderedList} target this객체
     * @param {Rui.ui.LUnorderedListNode} node click한 node object
     */
    this.createEvent('nodeOver');
    /**
     * @description node에 mouseout시 발생하는 event, 사용자 설정에 따라 node가 collapse된다.
     * @event nodeOut
     * @param {Rui.ui.LUnorderedList} target this객체
     * @param {Rui.ui.LUnorderedListNode} node click한 node object
     */
    this.createEvent('nodeOut');
    /**
     * @description node가 lazy collapsed되면 발생하는 이벤트
     * @event nodeLazyCollapsed
     * @param {Rui.ui.LUnorderedList} target this객체
     * @param {Rui.ui.LUnorderedListNode} collapsed된 node object
     */
    this.createEvent('nodeLazyCollapsed');
};
Rui.extend(Rui.ui.menu.LTabMenu, Rui.ui.LUnorderedList, {
    /**
     * @description 객체의 문자열
     * @property otype
     * @private
     * @type {String}
     */
    otype: 'Rui.ui.menu.LTabMenu',
    /**
     * @description click이 아닌 mouseover만으로도 하위 메뉴를 나타낼지 여부
     * @config expandOnOver
     * @sample default
     * @type {Rui.ui.grid.LColumnModel}
     * @default false
     */
    /**
     * @description click이 아닌 mouseover만으로도 하위 메뉴를 나타낼지 여부
     * @property expandOnOver
     * @type {Rui.ui.grid.LColumnModel}
     */
    expandOnOver: false,
    /**
     * @description mouseover만으로도 하위 메뉴를 나타내는 expandOnOver기능을 사용시 메뉴들로부터 mouseout되면 하위메뉴들을 자동으로 collapse할지 여부
     * @property collapseWhenOut
     * @type {Rui.ui.grid.LColumnModel}
     */
    //collapseWhenOut: true,
    /**
     * 웹접근성 지원을위한 container의 role atrribute
     * @private  
     * @property accessibilityELRole
     * @type {String}
     */
     accessibilityELRole: 'menubar',
     CSS_BASE: 'L-ul L-ul-tabmenu',
     CLASS_UL_TABMENU_CONTENT: 'L-ul-tabmenu-content',
    /**
     * dom으로 node 만들기
     * @protected
     * @method createNodeObject
     * @param {HTMLElement} dom
     * @return {Rui.ui.menu.LTabMenuNode}
     */
    createNodeObject: function(dom){
        return new Rui.ui.menu.LTabMenuNode({
            unorderList: this,
            dom: dom,
            useAnimation: this.useAnimation,
            useCollapseAllSibling: true
        });
    },
    /**
     * li 내부의 div의 내용 return
     * @private
     * @method getContent
     * @param {Rui.data.LRecord} record content 정보 record
     * @param {string} nodeStateClass node 상태를 나타내는 css classname
     * @return {string} content string
     */
    getContent: function(record, nodeStateClass, isMarked){
        return '<div class="' + this.CLASS_UL_TABMENU_CONTENT + '">' + this.getLabel(record, nodeStateClass) + '</div>';
    },
    /**
     * @description node click시 toggle처리
     * @method toggleChild
     * @protected
     * @param {Rui.ui.menu.LTabMenuNode} node click된 node
     * @return {void}
     */
    toggleChild: function(node){
        node.expand();
    },
    /**
     * @description render후 호출되는 메소드
     * @method afterRender
     * @protected
     * @param {HTMLElement} container 부모 객체
     * @return {void}
     */
    afterRender: function(container){
        Rui.ui.menu.LTabMenu.superclass.afterRender.call(this, container);
        if(this.expandOnOver === true){
            this.el.unOn('mouseover', this.onMouseOver, this);
            this.el.on('mouseover', this.onMouseOver, this, true);
            //this.el.unOn('mouseout', this.onMouseOut, this);
            //this.el.on('mouseout', this.onMouseOut, this, true);
        }
    },
    /**
     * 웹 접근성을 위한 UL Tag의 role 속성의 값을 가져온다.
     * @protected
     * @method getAccessibilityUlRole
     * @param {int} depth ul의 depth
     * @return {String} 웹접근성의 role 속성의 값
     */
    getAccessibilityUlRole: function(depth){
        if(depth == 0)
            return 'menubar';
        return 'menu';
    },
    /**
     * 웹 접근성을 위한 LI Tag의 role 속성의 값을 가져온다.
     * @protected
     * @method getAccessibilityLiRole
     * @return {String} 웹접근성의 role 속성의 값
     */
    getAccessibilityLiRole: function(){
        //메뉴의 li 태그에는 menuitemcheckbox, menuitemradio, separator 등이 더 사용될 수 있다. 현재 LSlideMenu는 이런 기능이 없다.
        return 'menuitem';
    },
    /**
     * @description node의 mouseover 이벤트 핸들러
     * @method onMouseOver
     * @protected
     * @param {HTMLElement} _div click한 node div
     * @param {String} rId click한 menu object의 record id
     * @return {void}
     */
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
                            //node.focus();
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
    /**
     * @description blur 이벤트 발생시 호출되는 메소드
     * @method onBlur
     * @protected
     * @param {Object} e Event 객체
     * @return {void}
     */
    onBlur: function(e) {
    	//collapse 0 depth node
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
    /**
     * @description node의 mouseout 이벤트 핸들러
     * @method onMouseOut
     * @protected
     * @param {HTMLElement} _div click한 node div
     * @param {String} rId click한 menu object의 record id
     * @return {void}
    onMouseOut: function(e){
        return;
        var node = this.findNodeByDom(e.target);
        if (node) {
            Rui.get(node.dom).removeClass('L-hover');
            this.fireEvent('nodeOut', {
                target: this,
                node: node,
                dom: e.target
            });
            if(this.currentZeroNode && this.collapseWhenOut === true){
                this._lazyCollapse(this.currentZeroNode);
//                this.currentZeroNode.collapse();
                this.currentZeroNode = null;
            }
        }
    },
    lazyCollapse: function(node){
        if(!this._lazyCollapseExecute){
            Rui.later(800, this, this._lazyCollapse, [node], false);
            this._lazyCollapseExecute = true;
        }
    },
    _lazyCollapse: function(node){
        if(this.el.select('.L-hover').length == 0){
            node.collapse();
            this.fireEvent('nodeLazyCollapsed', {
                target: this,
                node: node
            });
        }
        this._lazyCollapseExecute = false;
    }
     */
});
/**
 * LTabMenuNode
 * @namespace Rui.ui.menu
 * @plugin /ui/menu/rui_menu.js,/ui/menu/rui_menu.css
 * @class LTabMenuNode
 * @extends Rui.ui.LUnorderedListNode
 * @constructor LTabMenuNode
 * @param {Object} oConfig The intial LTabMenuNode.
 */
Rui.ui.menu.LTabMenuNode = function(config){
    Rui.ui.menu.LTabMenuNode.superclass.constructor.call(this, config);
};
Rui.extend(Rui.ui.menu.LTabMenuNode, Rui.ui.LUnorderedListNode, {
    /**
     * @description 객체의 문자열
     * @property otype
     * @private
     * @type {String}
     */
    otype: 'Rui.ui.menu.LTabMenuNode'
});
