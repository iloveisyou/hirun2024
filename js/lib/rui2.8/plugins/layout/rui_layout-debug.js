/*
 * @(#) rui_layout-debug.js
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
Rui.namespace('Rui.ui.layout');

/**
 * <p>
 * Provides a fixed layout containing, top, bottom, left, right and center
 * layout units. It can be applied to either the body or an element.
 * </p>
 * 
 * @module ui_layout
 * @namespace Rui.ui.layout
 * @requires dom, element, event
 */
(function() {
    var Dom = Rui.util.LDom, Event = Rui.util.LEvent;

    /**
     * <p>
     * Provides a fixed layout containing, top, bottom, left, right and center
     * layout units. It can be applied to either the body or an element.
     * </p>
     * 
     * @class LLayoutManager
     * @extends Rui.LElement
     * @constructor
     * @plugin /ui/layout/rui_layout.js,/ui/layout/rui_layout.css
     * @param {String/HTMLElement}
     *            el The element to make contain a layout.
     * @param {Object}
     *            attrs Object liternal containing configuration parameters.
     */
    var LLayoutManager = function(el, config) {
        if (Rui.isObject(el) && !el.tagName) {
            config = el;
            el = null;
        }

        config = config || {};
        config = Rui.applyIf(config, Rui.getConfig().getFirst('$.base.layout.defaultProperties'));

        if (Rui.isString(el)) {
            if (Dom.get(el)) {
                el = Dom.get(el);
            }
        }
        if (!el) {
            el = document.body;
        }

        var oConfig = {
                element : el,
                attributes : config || {}
        };

        LLayoutManager.superclass.constructor.call(this, oConfig.element, oConfig.attributes);
    };

    /**
     * @description Internal hash table for all layout instances
     * @private
     * @static
     * @property _instances
     * @type Object
     */
    LLayoutManager._instances = {};

    /**
     * @description Get's a layout object by the HTML id of the element
     *              associated with the LLayoutManager object.
     * @static
     * @method getLayoutById
     * @return {Object} The LLayoutManager Object
     */
    LLayoutManager.getLayoutById = function(id) {
        if (LLayoutManager._instances[id]) {
            return LLayoutManager._instances[id];
        }
        return false;
    };

    Rui.extend(LLayoutManager, Rui.LElement, {
        /**
         * @description A modified version of the Rui.browser
         *              object*
         * @property browser
         * @type Object
         */
        browser : function() {
            var b = Rui.browser;
            b.standardsMode = false;
            b.secure = false;
            return b;
        }(),
        /**
         * @description An object literal that contains a list
         *              of units in the layout
         * @private
         * @property _units
         * @type Object
         */
        _units : null,
        /**
         * @description Set to true when the layout is rendered
         * @private
         * @property _rendered
         * @type Boolean
         */
        _rendered : null,
        /**
         * @description The zIndex to set all LayoutUnits to
         * @private
         * @property _zIndex
         * @type Number
         */
        _zIndex : null,
        /**
         * @description A collection of the current sizes of all
         *              usable LayoutUnits to be used for
         *              calculations
         * @private
         * @property _sizes
         * @type Object
         */
        _sizes : null,
        /**
         * @description Used to set the body size of the layout,
         *              sets the height and width of the parent
         *              container
         * @private
         * @method _setBodySize
         * @param {boolean}
         *            set If set to false, it will NOT set the
         *            size, just perform the calculations (used
         *            for collapsing units)
         */
        _setBodySize : function(set) {
            var h = 0, w = 0;
            set = ((set === false) ? false : true);

            if (this._isBody) {
                h = Dom.getClientHeight();
                w = Dom.getClientWidth();
            } else {
                h = parseInt(this.getStyle('height'), 10);
                w = parseInt(this.getStyle('width'), 10);
                if (isNaN(w)) {
                    w = this.get('element').clientWidth;
                }
                if (isNaN(h)) {
                    h = this.get('element').clientHeight;
                }
            }
            if (this.get('minWidth')) {
                if (w < this.get('minWidth')) {
                    w = this.get('minWidth');
                }
            }
            if (this.get('minHeight')) {
                if (h < this.get('minHeight')) {
                    h = this.get('minHeight');
                }
            }
            if (set) {
                Dom.setStyle(this._doc, 'height', h + 'px');
                Dom.setStyle(this._doc, 'width', w + 'px');
            }
            this._sizes.doc = {
                    h : h,
                    w : w
            };
            this._setSides(set);
        },
        /**
         * @description Used to set the size and position of the
         *              left, right, top and bottom units
         * @private
         * @method _setSides
         * @param {boolean}
         *            set If set to false, it will NOT set the
         *            size, just perform the calculations (used
         *            for collapsing units)
         */
        _setSides : function(set) {
            var h1 = ((this._units.top) ? this._units.top.get('height') : 0), 
            h2 = ((this._units.bottom) ? this._units.bottom.get('height') : 0), 
            h = this._sizes.doc.h,
            w = this._sizes.doc.w;
            set = ((set === false) ? false : true);

            this._sizes.top = {
                    h : h1,
                    w : ((this._units.top) ? w : 0),
                    t : 0
            };
            this._sizes.bottom = {
                    h : h2,
                    w : ((this._units.bottom) ? w : 0)
            };

            var newH = (h - (h1 + h2));

            this._sizes.left = {
                    h : newH,
                    w : ((this._units.left) ? this._units.left
                            .get('width') : 0)
            };
            this._sizes.right = {
                    h : newH,
                    w : ((this._units.right) ? this._units.right.get('width') : 0),
                    l : ((this._units.right) ? (w - this._units.right.get('width')) : 0),
                    t : ((this._units.top) ? this._sizes.top.h : 0)
            };

            if (this._units.right && set) {
                this._units.right.set('top', this._sizes.right.t);
                if (!this._units.right._collapsing) {
                    this._units.right.set('left', this._sizes.right.l);
                }
                this._units.right.set('height', this._sizes.right.h, true);
            }
            if (this._units.left) {
                this._sizes.left.l = 0;
                if (this._units.top) {
                    this._sizes.left.t = this._sizes.top.h;
                } else {
                    this._sizes.left.t = 0;
                }
                if (set) {
                    this._units.left.set('top', this._sizes.left.t);
                    this._units.left.set('height', this._sizes.left.h, true);
                    this._units.left.set('left', 0);
                }
            }
            if (this._units.bottom) {
                this._sizes.bottom.t = this._sizes.top.h + this._sizes.left.h;
                if (set) {
                    this._units.bottom.set('top', this._sizes.bottom.t);
                    this._units.bottom.set('width', this._sizes.bottom.w, true);
                }
            }
            if (this._units.top) {
                if (set) {
                    this._units.top.set('width', this._sizes.top.w, true);
                }
            }
            this._setCenter(set);
        },
        /**
         * @description Used to set the size and position of the
         *              center unit
         * @private
         * @method _setCenter
         * @param {boolean}
         *            set If set to false, it will NOT set the
         *            size, just perform the calculations (used
         *            for collapsing units)
         */
        _setCenter : function(set) {
            set = ((set === false) ? false : true);
            var h = this._sizes.left.h;
            var w = (this._sizes.doc.w - (this._sizes.left.w + this._sizes.right.w));
            if(set){
                this._units.center.set('height', h, true);
                this._units.center.set('width', w, true);
                this._units.center.set('top', this._sizes.top.h);
                this._units.center.set('left', this._sizes.left.w);
            }
            this._sizes.center = {
                    h : h,
                    w : w,
                    t : this._sizes.top.h,
                    l : this._sizes.left.w
            };
        },
        /**
         * @description Get a reference to the internal LLayoutManager
         *              Unit sizes object used to build the
         *              layout wireframe
         * @method getSizes
         * @return {Object} An object of the layout unit sizes
         */
        getSizes : function() {
            return this._sizes;
        },
        /**
         * @description Get the LLayout by it's position in
         *              this layout
         * @method getUnitByPosition
         * @param {String}
         *            pos The position of the unit in this
         *            layout
         * @return {<a
         *         href="Rui.ui.layout.LLayout.html">Rui.ui.layout.LLayout</a>}
         *         The LLayout instance
         */
        getUnitByPosition : function(pos) {
            if (pos) {
                pos = pos.toLowerCase();
                if (this._units[pos]) {
                    return this._units[pos];
                }
                return false;
            }
            return false;
        },
        /**
         * @description Remove the unit from this layout and
         *              resize the layout.
         * @method removeUnit
         * @param {Object}
         *            unit The LLayout that you want to
         *            remove
         */
        removeUnit : function(unit) {
            delete this._units[unit.get('position')];
            this.resize();
        },
        /**
         * @description Add a unit to this layout and if the
         *              layout is rendered, resize the layout.
         * @method addUnit
         * @param {Object}
         *            cfg The config for the LLayout that
         *            you want to add
         * @return {<a
         *         href="Rui.ui.layout.LLayout.html">Rui.ui.layout.LLayout</a>}
         *         The LLayout instance
         */
        addUnit : function(cfg) {
            if (!cfg.position) {
                return false;
            }
            if (this._units[cfg.position]) {
                return false;
            }
            var element = null, el = null;

            if (cfg.id) {
                if (Dom.get(cfg.id)) {
                    element = Dom.get(cfg.id);
                    delete cfg.id;

                }
            }
            if (cfg.element) {
                element = cfg.element;
            }

            if (!el) {
                el = document.createElement('div');
                var id = Dom.generateId();
                el.id = id;
            }

            if (!element) {
                element = document.createElement('div');
            }
            Dom.addClass(element, 'L-layout-wrap');
            if (this.browser.msie && !this.browser.standardsMode) {
                el.style.zoom = 1;
                element.style.zoom = 1;
            }

            if (el.firstChild) {
                el.insertBefore(element, el.firstChild);
            } else {
                el.appendChild(element);
            }
            this._doc.appendChild(el);

            var h = false, w = false;

            if (cfg.height) {
                h = parseInt(cfg.height, 10);
            }
            if (cfg.width) {
                w = parseInt(cfg.width, 10);
            }
            var unitConfig = {};
            Rui.applyObject(unitConfig, cfg);

            unitConfig.parent = this;
            unitConfig.wrap = element;
            unitConfig.height = h;
            unitConfig.width = w;

            var unit = new Rui.ui.layout.LLayout(el, unitConfig);

            unit.on('heightChange', this.resize, this, true);
            unit.on('widthChange', this.resize, this, true);
            unit.on('gutterChange', this.resize, this, true);
            this._units[cfg.position] = unit;

            if (this._rendered) {
                this.resize();
            }

            return unit;
        },
        /**
         * @description Private method to create units from the
         *              config that was passed in.
         * @private
         * @method _createUnits
         */
        _createUnits : function() {
            var units = this.get('units');
            for ( var i in units) {
                if (Rui.hasOwnProperty(units, i)) {
                    this.addUnit(units[i]);
                }
            }
        },
        /**
         * @description Starts the chain of resize routines that
         *              will resize all the units.
         * @method resize
         * @param {boolean}
         *            set If set to false, it will NOT set the
         *            size, just perform the calculations (used
         *            for collapsing units)
         * @return {<a
         *         href="Rui.ui.layout.LLayoutManager.html">Rui.ui.layout.LLayoutManager</a>}
         *         The LLayoutManager instance
         */
        resize : function(set) {
            set = ((set === false) ? false : true);
            if (set) {
                var retVal = this.fireEvent('beforeResize', {
                    target : this
                });
                if (retVal === false) {
                    set = false;
                }
                if (this.browser.msie) {
                    if (this._isBody) {
                        Dom.removeClass(document.documentElement, 'L-layout');
                        Dom.addClass(document.documentElement, 'L-layout');
                    } else {
                        this.removeClass('L-layout');
                        this.addClass('L-layout');
                    }
                }
            }
            this._setBodySize(set);
            if (set) {
                this.fireEvent('resize', {
                    target : this,
                    sizes : this._sizes
                });
            }
            return this;
        },
        /**
         * @description Sets up the main doc element when using
         *              the body as the main element.
         * @private
         * @method _setupBodyElements
         */
        _setupBodyElements : function() {
            this._doc = Dom.get('layout-doc');
            if (!this._doc) {
                this._doc = document.createElement('div');
                this._doc.id = 'layout-doc';
                if (document.body.firstChild) {
                    document.body.insertBefore(this._doc, document.body.firstChild);
                } else {
                    document.body.appendChild(this._doc);
                }
            }
            this._createUnits();
            this._setBodySize();

            Event.on(window, 'resize', this.resize, this, true);
            Dom.addClass(this._doc, 'L-layout-doc');
        },
        /**
         * @description Sets up the main doc element when not
         *              using the body as the main element.
         * @private
         * @method _setupElements
         */
        _setupElements : function() {
            this._doc = this.getElementsByClassName('L-layout-doc')[0];
            if (!this._doc) {
                this._doc = document.createElement('div');
                this.get('element').appendChild(this._doc);
            }
            this._createUnits();
            this._setBodySize();
            Dom.addClass(this._doc, 'L-layout-doc');
        },
        /**
         * @description Flag to determine if we are using the
         *              body as the root element.
         * @private
         * @property _isBody
         * @type Boolean
         */
        _isBody : null,
        /**
         * @description Reference to the root element
         * @private
         * @property _doc
         * @type HTMLElement
         */
        _doc : null,
        /**
         * @description The LLayoutManager class' initialization method
         * @private
         * @method init
         */
        init : function(p_oElement, p_oAttributes) {

            this._zIndex = 0;

            LLayoutManager.superclass.init.call(this, p_oElement, p_oAttributes);

            if (this.get('parent')) {
                this._zIndex = this.get('parent')._zIndex + 10;
            }

            this._sizes = {};
            this._units = {};

            var id = p_oElement;
            if (!Rui.isString(id)) {
                id = Dom.generateId(id);
            }
            LLayoutManager._instances[id] = this;
        },
        /**
         * @description This method starts the render process,
         *              applying classnames and creating
         *              elements
         * @method render
         * @return {<a
         *         href="Rui.ui.layout.LLayoutManager.html">Rui.ui.layout.LLayoutManager</a>}
         *         The LLayoutManager instance
         */
        render : function() {
            this._stamp();
            var el = this.get('element');
            if (el && el.tagName
                    && (el.tagName.toLowerCase() == 'body')) {
                this._isBody = true;
                Dom.addClass(document.body, 'L-layout');
                if (Dom.hasClass(document.body, 'L-skin-sam')) {
                    // Move the class up so we can have a css
                    // chain
                    Dom.addClass(document.documentElement, 'L-skin-sam');
                    Dom.removeClass(document.body, 'L-skin-sam');
                }
                this._setupBodyElements();
            } else {
                this._isBody = false;
                this.addClass('L-layout');
                this._setupElements();
            }
            this.resize();
            this._rendered = true;
            this.fireEvent('render', {
                target : this
            }, {
                isCE : true
            });

            return this;
        },
        /**
         * @description Stamps the root node with a secure
         *              classname for ease of use. Also sets the
         *              this.browser.standardsMode variable.
         * @private
         * @method _stamp
         */
        _stamp : function() {
            if (document.compatMode == 'CSS1Compat') {
                this.browser.standardsMode = true;
            }
            if (window.location.href.toLowerCase().indexOf('https') === 0) {
                Dom.addClass(document.documentElement, 'secure');
                this.browser.secure = true;
            }
        },
        /**
         * @description Processes the config
         * @private
         * @method initAttributes
         */
        initAttributes : function(attr) {
            LLayoutManager.superclass.initAttributes.call(this, attr);
            /**
             * @description An array of config definitions for
             *              the LayoutUnits to add to this
             *              layout
             * @attribute units
             * @type Array
             */
            this.setAttributeConfig('units', {
                writeOnce : true,
                validator : Rui.isArray,
                value : attr.units || []
            });

            /**
             * @description The minimum height in pixels
             * @attribute minHeight
             * @type Number
             */
            this.setAttributeConfig('minHeight', {
                value : attr.minHeight || false,
                validator : Rui.isNumber
            });

            /**
             * @description The minimum width in pixels
             * @attribute minWidth
             * @type Number
             */
            this.setAttributeConfig('minWidth', {
                value : attr.minWidth || false,
                validator : Rui.isNumber
            });

            /**
             * @description The height in pixels
             * @attribute height
             * @type Number
             */
            this.setAttributeConfig('height', {
                value : attr.height || false,
                validator : Rui.isNumber,
                method : function(h) {
                    this.setStyle('height', h + 'px');
                }
            });

            /**
             * @description The width in pixels
             * @attribute width
             * @type Number
             */
            this.setAttributeConfig('width', {
                value : attr.width || false,
                validator : Rui.isNumber,
                method : function(w) {
                    this.setStyle('width', w + 'px');
                }
            });

            /**
             * @description If this layout is to be used as a
             *              child of another LLayoutManager instance,
             *              this config will bind the resize
             *              events together.
             * @attribute parent
             * @type Object Rui.ui.layout.LLayoutManager
             */
            this.setAttributeConfig('parent', {
                writeOnce : true,
                value : attr.parent || false,
                method : function(p) {
                    if (p) {
                        p.on('resize', this.resize, this, true);
                    }
                }
            });
        },
        /**
         * @description Removes this layout from the page and
         *              destroys all units that it contains.
         *              This will destroy all data inside the
         *              layout and it's children.
         * @method destroy
         */
        destroy : function() {
            var par = this.get('parent');
            if (par) {
                par.removeListener('resize', this.resize, this);
            }
            Event.removeListener(window, 'resize', this.resize);

            this.unOnAll();
            for ( var u in this._units) {
                if (Rui.hasOwnProperty(this._units, u)) {
                    if (this._units[u]) {
                        this._units[u].destroy(true);
                    }
                }
            }

            Event.purgeElement(this.get('element'));
            this.get('parentNode').removeChild(this.get('element'));

            delete Rui.ui.layout.LLayoutManager._instances[this.get('id')];
            // Brutal Object Destroy
            for ( var i in this) {
                if (Rui.hasOwnProperty(this, i)) {
                    this[i] = null;
                    delete this[i];
                }
            }

            if (par) {
                par.resize();
            }
        },
        /**
         * @description Returns a string representing the
         *              LLayoutManager.
         * @method toString
         * @return {String}
         */
        toString : function() {
            if (this.get) {
                return 'LLayoutManager #' + this.get('id');
            }
            return 'LLayoutManager';
        }
    });
    /**
     * @description Fired when this.resize is called
     * @event resize
     * @type Rui.util.LCustomEvent
     */
    /**
     * @description Fired when the Resize Utility for a Unit fires it's
     *              startResize Event.
     * @event startResize
     * @type Rui.util.LCustomEvent
     */
    /**
     * @description Fires at the beginning of the resize method. If you return
     *              false, the resize is cancelled.
     * @event beforeResize
     * @type Rui.util.LCustomEvent
     */
    /**
     * @description Fired after the render method completes.
     * @event render
     * @type Rui.util.LCustomEvent
     */

    Rui.ui.layout.LLayoutManager = LLayoutManager;
})();

/**
 * <p>Provides a fixed position unit containing a header, body and footer for use with a Rui.ui.layout.LLayoutManager instance.</p>
 * @module ui_layout
 * @namespace Rui.ui.layout
 * @requires Rui, dom, element, event, layout
 * @optional animation, dragdrop, selector
 */
(function(){
    var Dom = Rui.util.LDom,
        Sel = Rui.util.Selector,
        Event = Rui.util.LEvent;

    /**
    * @description
    * <p>Provides a fixed position unit containing a header, body and footer for use with a Rui.ui.layout.LLayoutManager instance.</p>
    * @class LLayout
    * @extends Rui.LElement
    * @constructor
    * @plugin /ui/layout/rui_layout.js,/ui/layout/rui_layout.css
    * @param {String/HTMLElement} el The element to make a unit.
    * @param {Object} attrs Object liternal containing configuration parameters.
    */
    var LLayout = function(el, config){
        var oConfig = {
            element: el,
            attributes: config || {}
        };
        LLayout.superclass.constructor.call(this, oConfig.element, oConfig.attributes);
    };

    /**
      * @description Internal hash table for all layout unit instances
      * @private
      * @static
      * @property _instances    
      * @type Object
      */
    LLayout._instances = {};
    /**
       * @description Get's a layout unit object by the HTML id of the element associated with the LLayoutManager Unit object.
       * @static
       * @method getLayoutUnitById     
       * @return {Object} The LLayoutManager Object
       */
    LLayout.getLayoutUnitById = function(id){
        if (LLayout._instances[id])
        {
            return LLayout._instances[id];
        }
        return false;
    };

    Rui.extend(LLayout, Rui.LElement, {
        /**
          * @description String used for close button title
          * @property STR_CLOSE
          * @private
          * @type {String}
          */
        STR_CLOSE: 'Click to close this pane.',
        /**
          * @description String used for collapse button title
          * @property STR_COLLAPSE
          * @private
          * @type {String}
          */
        STR_COLLAPSE: 'Click to collapse this pane.',
        /**
          * @description String used for expand button title
          * @property STR_EXPAND
          * @private
          * @type {String}
          */
        STR_EXPAND: 'Click to expand this pane.',
        /**
          * The class name applied to dynamic tabs while loading.
          * @property LOADING_CLASSNAME
          * @private
          * @type String
          * @default "disabled"
          */
        LOADING_CLASSNAME: 'loading',
        /**
          * @description A modified version of the Rui.browser object
          * @property browser        
          * @type Object
          */
        browser: null,
        /**
          * @description A collection of the current sizes of the contents of this LLayoutManager Unit
          * @private
          * @property _sizes        
          * @type Object
          */
        _sizes: null,
        /**
          * @description A reference to the Animation instance used by this LayouUnit
          * @private
          * @property _anim        
          * @type Rui.util.LAnim
          */
        _anim: null,
        /**
          * @description A reference to the Resize instance used by this LLayout
          * @private
          * @property _resize        
         * @type Rui.util.LResize
         */
        _resize: null,
        /**
         * @description A reference to the clip element used when collapsing the unit
         * @private
         * @property _clip        
         * @type HTMLElement
         */
        _clip: null,
        /**
         * @description A simple hash table used to store the gutter to apply to the Unit
         * @private
         * @property _gutter        
         * @type Object
         */
        _gutter: null,
        /**
         * @description A reference to the HTML element used for the Header
         * @property header        
         * @type HTMLELement
         */
        header: null,
        /**
         * @description A reference to the HTML element used for the body
         * @property body        
         * @type HTMLElement
         */
        body: null,
        /**
         * @description A reference to the HTML element used for the footer
         * @property footer        
         * @type HTMLElement
         */
        footer: null,
        /**
         * @description Flag to determine if the unit is collapsed or not.
         * @private
         * @property _collapsed        
         * @type Boolean
         */
        _collapsed: null,
        /**
         * @description A flag set while the unit is being collapsed, used so we don't fire events while animating the size
         * @private
         * @property _collapsing        
         * @type Boolean
         */
        _collapsing: null,
        /**
         * @description A holder for the last known width of the unit
         * @private
         * @property _lastWidth        
         * @type Number
         */
        _lastWidth: null,
        /**
         * @description A holder for the last known height of the unit
         * @private
         * @property _lastHeight        
         * @type Number
         */
        _lastHeight: null,
        /**
         * @description A holder for the last known top of the unit
         * @private
         * @property _lastTop        
         * @type Number
         */
        _lastTop: null,
        /**
         * @description A holder for the last known left of the unit
         * @private
         * @property _lastLeft        
         * @type Number
         */
        _lastLeft: null,
        /**
         * @description A holder for the last known scroll state of the unit
         * @private
         * @property _lastScroll        
         * @type Boolean
         */
        _lastScroll: null,
        /**
         * @description A holder for the last known scroll state of the center unit
         * @private
         * @property _lastCenetrScroll        
         * @type Boolean
         */
        _lastCenterScroll: null,
        /**
         * @description A holder for the last known scrollTop state of the unit
         * @private
         * @property _lastScrollTop        
         * @type Number
         */
        _lastScrollTop: null,
        /**
         * @description Resize either the unit or it's clipped state, also updating the box inside
         * @method resize        
         * @param {boolean} force This will force full calculations even when the unit is collapsed
         * @return {<a href="Rui.ui.layout.LLayout.html">Rui.ui.layout.LLayout</a>} The LLayout instance
         */
        resize: function(force) {
            var retVal = this.fireEvent('beforeResize', {target: this});
            if (retVal === false) {
                return this;
            }
            if (!this._collapsing || (force === true)) {
                var scroll = this.get('scroll');
                this.set('scroll', false);

                var hd = this._getBoxSize(this.header),
                    ft = this._getBoxSize(this.footer),
                    box = [this.get('height'), this.get('width')];

                var nh = (box[0] - hd[0] - ft[0]) - (this._gutter.top + this._gutter.bottom),
                    nw = box[1] - (this._gutter.left + this._gutter.right);

                var wrapH = (nh + (hd[0] + ft[0])),
                    wrapW = nw;

                if (this._collapsed && !this._collapsing){
                    this._setHeight(this._clip, wrapH);
                    this._setWidth(this._clip, wrapW);
                    Dom.setStyle(this._clip, 'top', this.get('top') + this._gutter.top + 'px');
                    Dom.setStyle(this._clip, 'left', this.get('left') + this._gutter.left + 'px');
                } else if (!this._collapsed || (this._collapsed && this._collapsing)) {
                    wrapH = this._setHeight(this.get('wrap'), wrapH);
                    wrapW = this._setWidth(this.get('wrap'), wrapW);
                    this._sizes.wrap.h = wrapH;
                    this._sizes.wrap.w = wrapW;

                    Dom.setStyle(this.get('wrap'), 'top', this._gutter.top + 'px');
                    Dom.setStyle(this.get('wrap'), 'left', this._gutter.left + 'px');

                    this._sizes.header.w = this._setWidth(this.header, wrapW);
                    this._sizes.header.h = hd[0];

                    this._sizes.footer.w = this._setWidth(this.footer, wrapW);
                    this._sizes.footer.h = ft[0];

                    Dom.setStyle(this.footer, 'bottom', '0px');

                    this._sizes.body.h = this._setHeight(this.body, (wrapH - (hd[0] + ft[0])));
                    this._sizes.body.w = this._setWidth(this.body, wrapW);
                    Dom.setStyle(this.body, 'top', hd[0] + 'px');

                    this.set('scroll', scroll);
                    //this.fireEvent('resize', {target: this}, {isCE: true});
                    this.fireEvent('resize', { target: this, sizes: this._sizes }, {isCE: true});
                }
            }
            return this;
        },
        
        /**
         * @description Sets the width of the element based on the border size of the element.
         * @private
         * @method _setWidth        
         * @param {HTMLElement} el The HTMLElement to have it's width set
         * @param {Number} w The width that you want it the element set to
         * @return {Number} The new width, fixed for borders and IE QuirksMode
         */
        _setWidth: function(el, w){
            if (el){
                var b = this._getBorderSizes(el);
                w = (w - (b[1] + b[3]));
                w = this._fixQuirks(el, w, 'w');
                if (w < 0){
                    w = 0;
                }
                Dom.setStyle(el, 'width', w + 'px');
            }
            return w;
        },
        
        /**
         * @description Sets the height of the element based on the border size of the element.
         * @private
         * @method _setHeight        
         * @param {HTMLElement} el The HTMLElement to have it's height set
         * @param {Number} h The height that you want it the element set to
         * @return {Number} The new height, fixed for borders and IE QuirksMode
         */
        _setHeight: function(el, h){
            if (el){
                var b = this._getBorderSizes(el);
                h = (h - (b[0] + b[2]));
                h = this._fixQuirks(el, h, 'h');
                if (h < 0){
                    h = 0;
                }
                Dom.setStyle(el, 'height', h + 'px');
            }
            return h;
        },
        
        /**
         * @description Fixes the box calculations for IE in QuirksMode
         * @private
         * @method _fixQuirks        
         * @param {HTMLElement} el The HTMLElement to set the dimension on
         * @param {Number} dim The number of the dimension to fix
         * @param {String} side The dimension (h or w) to fix. Defaults to h
         * @return {Number} The fixed dimension
         */
        _fixQuirks: function(el, dim, side){
            var i1 = 0, i2 = 2;
            if (side == 'w'){
                i1 = 1;
                i2 = 3;
            }
            if (this.browser.msie && !this.browser.standardsMode){
                //Internet Explorer - Quirks Mode
                var b = this._getBorderSizes(el),
                    bp = this._getBorderSizes(el.parentNode);
                if ((b[i1] === 0) && (b[i2] === 0)){
                    //No Borders, check parent
                    if ((bp[i1] !== 0) && (bp[i2] !== 0)){
                        //Parent has Borders
                        dim = (dim - (bp[i1] + bp[i2]));
                    }
                } else {
                    if ((bp[i1] === 0) && (bp[i2] === 0)){
                        dim = (dim + (b[i1] + b[i2]));
                    }
                }
            }
            return dim;
        },
        /**
         * @description Get's the elements clientHeight and clientWidth plus the size of the borders
         * @private
         * @method _getBoxSize        
         * @param {HTMLElement} el The HTMLElement to get the size of
         * @return {Array} An array of height and width
         */
        _getBoxSize: function(el){
            var size = [0, 0];
            if (el) {
                if (this.browser.msie && !this.browser.standardsMode) {
                    el.style.zoom = 1;
                }
                var b = this._getBorderSizes(el);
                size[0] = el.clientHeight + (b[0] + b[2]);
                size[1] = el.clientWidth + (b[1] + b[3]);
            }
            return size;
        },
        /**
         * @description Get the CSS border size of the element passed.
         * @private
         * @method _getBorderSizes        
         * @param {HTMLElement} el The element to get the border size of
         * @return {Array} An array of the top, right, bottom, left borders.
         */
        _getBorderSizes: function(el) {
            var s = [];
            el = el || this.get('element');
            if (this.browser.msie && !this.browser.standardsMode) {
                el.style.zoom = 1;
            }
            s[0] = parseInt(Dom.getStyle(el, 'borderTopWidth'), 10);
            s[1] = parseInt(Dom.getStyle(el, 'borderRightWidth'), 10);
            s[2] = parseInt(Dom.getStyle(el, 'borderBottomWidth'), 10);
            s[3] = parseInt(Dom.getStyle(el, 'borderLeftWidth'), 10);

            //IE will return NaN on these if they are set to auto, we'll set them to 0
            for (var i = 0; i < s.length; i++){
                if (isNaN(s[i])){
                    s[i] = 0;
                }
            }
            return s;
        },
        /**
         * @description Create the clip element used when the Unit is collapsed
         * @private
         * @method _createClip        
         */
        _createClip: function()
        {
            if (!this._clip)
            {
                this._clip = document.createElement('div');
                this._clip.className = 'L-layout-clip L-layout-clip-' + this.get('position');
                this._clip.innerHTML = '<div class="collapse"></div>';
                var c = this._clip.firstChild;
                c.title = this.STR_EXPAND;
                Event.on(c, 'click', this.expand, this, true);
                this.get('element').parentNode.appendChild(this._clip);
            }
        },
        /**
         * @description Toggle th current state of the Clip element and set it's height, width and position
         * @private
         * @method _toggleClip        
         */
        _toggleClip: function(){
            if (!this._collapsed){
                //show
                var hd = this._getBoxSize(this.header),
                    ft = this._getBoxSize(this.footer),
                    box = [this.get('height'), this.get('width')];

                var nh = (box[0] - hd[0] - ft[0]) - (this._gutter.top + this._gutter.bottom),
                    nw = box[1] - (this._gutter.left + this._gutter.right),
                    wrapH = (nh + (hd[0] + ft[0]));

                switch (this.get('position')){
                    case 'top':
                    case 'bottom':
                        this._setWidth(this._clip, nw);
                        this._setHeight(this._clip, this.get('collapseSize'));
                        Dom.setStyle(this._clip, 'left', (this._lastLeft + this._gutter.left) + 'px');
                        if (this.get('position') == 'bottom'){
                            Dom.setStyle(this._clip, 'top', ((this._lastTop + this._lastHeight) - (this.get('collapseSize') - this._gutter.top)) + 'px');
                        } else {
                            Dom.setStyle(this._clip, 'top', this.get('top') + this._gutter.top + 'px');
                        }
                        break;
                    case 'left':
                    case 'right':
                        this._setWidth(this._clip, this.get('collapseSize'));
                        this._setHeight(this._clip, wrapH);
                        Dom.setStyle(this._clip, 'top', (this.get('top') + this._gutter.top) + 'px');
                        if (this.get('position') == 'right'){
                            Dom.setStyle(this._clip, 'left', (((this._lastLeft + this._lastWidth) - this.get('collapseSize')) - this._gutter.left) + 'px');
                        } else {
                            Dom.setStyle(this._clip, 'left', (this.get('left') + this._gutter.left) + 'px');
                        }
                        break;
                }

                Dom.setStyle(this._clip, 'display', 'block');
                this.setStyle('display', 'none');
            } else
            {
                //Hide
                Dom.setStyle(this._clip, 'display', 'none');
            }
        },
        /**
         * @description Get a reference to the internal sizes object for this unit
         * @method getSizes        
         * @return {Object} An object of the sizes used for calculations
         */
        getSizes: function(){
            return this._sizes;
        },
        /**
         * @description Toggles the Unit, replacing it with a clipped version.
         * @method toggle        
         * @return {<a href="Rui.ui.layout.LLayout.html">Rui.ui.layout.LLayout</a>} The LLayout instance
         */
        toggle: function(){
            if (this._collapsed){
                this.expand();
            } else {
                this.collapse();
            }
            return this;
        },
        /**
         * @description Expand the Unit if it is collapsed.
         * @method expand        
         * @return {<a href="Rui.ui.layout.LLayout.html">Rui.ui.layout.LLayout</a>} The LLayout instance
         */
        expand: function(){
            if (!this._collapsed){
                return this;
            }
            var retVal = this.fireEvent('beforeExpand', {target: this});
            if (retVal === false){
                return this;
            }

            this._collapsing = true;
            this.setStyle('zIndex', this.get('parent')._zIndex + 1);

            if (this._anim){
                this.setStyle('display', 'none');
                var attr = {}, s;

                switch (this.get('position')){
                    case 'left':
                    case 'right':
                        this.set('width', this._lastWidth, true);
                        this.setStyle('width', this._lastWidth + 'px');
                        this.get('parent').resize(false);
                        s = this.get('parent').getSizes()[this.get('position')];
                        this.set('height', s.h, true);
                        var left = s.l;
                        attr = {
                            left: {
                                to: left
                            }
                        };
                        if (this.get('position') == 'left')
                        {
                            attr.left.from = (left - s.w);
                            this.setStyle('left', (left - s.w) + 'px');
                        }
                        break;
                    case 'top':
                    case 'bottom':
                        this.set('height', this._lastHeight, true);
                        this.setStyle('height', this._lastHeight + 'px');
                        this.get('parent').resize(false);
                        s = this.get('parent').getSizes()[this.get('position')];
                        this.set('width', s.w, true);
                        var top = s.t;
                        attr = {
                            top: {
                                to: top
                            }
                        };
                        if (this.get('position') == 'top')
                        {
                            this.setStyle('top', (top - s.h) + 'px');
                            attr.top.from = (top - s.h);
                        }
                        break;
                }

                this._anim.attributes = attr;
                var exStart = function(){
                    this.setStyle('display', 'block');
                    this.resize(true);
                    //this._anim.onStart.unsubscribe(exStart, this, true);
                    this._anim.unOn(exStart, this, true);
                };
                var expand = function(){
                    this._collapsing = false;
                    this.setStyle('zIndex', this.get('parent')._zIndex);
                    this.set('width', this._lastWidth);
                    this.set('height', this._lastHeight);
                    this._collapsed = false;
                    this.resize();
                    this.set('scroll', this._lastScroll);
                    if (this._lastScrollTop > 0){
                        this.body.scrollTop = this._lastScrollTop;
                    }
                    //this._anim.onComplete.unsubscribe(expand, this, true);
                    this._anim.unOn('complete', expand, this, true);
                    this.fireEvent('expand', {target: this});
                };
                //this._anim.onStart.subscribe(exStart, this, true);
                this._anim.on('start', exStart, this, true);
                //this._anim.onComplete.subscribe(expand, this, true);
                this._anim.on('complete', expand, this, true);
                this._anim.animate();
                this._toggleClip();
            } else{
                this._collapsing = false;
                this._toggleClip();
                this._collapsed = false;
                this.setStyle('zIndex', this.get('parent')._zIndex);
                this.setStyle('display', 'block');
                this.set('width', this._lastWidth);
                this.set('height', this._lastHeight);
                this.resize();
                this.set('scroll', this._lastScroll);
                if (this._lastScrollTop > 0){
                    this.body.scrollTop = this._lastScrollTop;
                }
                this.fireEvent('expand', {target: this}, {isCE: true});
            }
            return this;
        },
        /**
         * @description Collapse the Unit if it is not collapsed.
         * @method collapse        
         * @return {<a href="Rui.ui.layout.LLayout.html">Rui.ui.layout.LLayout</a>} The LLayout instance
         */
        collapse: function(){
            if (this._collapsed)
                return this;
            var retValue = this.fireEvent('beforeCollapse', {target: this}, {isCE: true});
            if (retValue === false)
                return this;
            if (!this._clip)
                this._createClip();
            this._collapsing = true;
            var w = this.get('width'),
                h = this.get('height'),
                attr = {};
            this._lastWidth = w;
            this._lastHeight = h;
            this._lastScroll = this.get('scroll');
            this._lastScrollTop = this.body.scrollTop;
            this.set('scroll', false, true);
            this._lastLeft = parseInt(this.get('element').style.left, 10);
            this._lastTop = parseInt(this.get('element').style.top, 10);
            if (isNaN(this._lastTop)){
                this._lastTop = 0;
                this.set('top', 0);
            }
            if (isNaN(this._lastLeft)){
                this._lastLeft = 0;
                this.set('left', 0);
            }
            this.setStyle('zIndex', this.get('parent')._zIndex + 1);
            var pos = this.get('position');

            switch (pos){
                case 'top':
                case 'bottom':
                    this.set('height', (this.get('collapseSize') + (this._gutter.top + this._gutter.bottom)));
                    attr = {
                        top: {
                            to: (this.get('top') - h)
                        }
                    };
                    if (pos == 'bottom')
                    {
                        attr.top.to = (this.get('top') + h);
                    }
                    break;
                case 'left':
                case 'right':
                    this.set('width', (this.get('collapseSize') + (this._gutter.left + this._gutter.right)));
                    attr = {
                        left: {
                            to: -(this._lastWidth)
                        }
                    };
                    if (pos == 'right'){
                        attr.left = {
                            to: (this.get('left') + w)
                        };
                    }
                    break;
            }
            if (this._anim){
                this._anim.attributes = attr;
                var collapse = function(){
                    this._collapsing = false;
                    this._toggleClip();
                    this.setStyle('zIndex', this.get('parent')._zIndex);
                    this._collapsed = true;
                    this.get('parent').resize();
                    //this._anim.onComplete.unsubscribe(collapse, this, true);
                    this._anim.unOn('complete', collapse, this, true);
                    this.fireEvent('collapse', {target: this});
                };
                //this._anim.onComplete.subscribe(collapse, this, true);
                this._anim.on('complete', collapse, this, true);
                this._anim.animate();
            } else{
                this._collapsing = false;
                this.setStyle('display', 'none');
                this._toggleClip();
                this.setStyle('zIndex', this.get('parent')._zIndex);
                this.get('parent').resize();
                this._collapsed = true;
                this.fireEvent('collapse', {target: this}, {isCE: true});
            }
            return this;
        },
        /**
         * @description Close the unit, removing it from the parent LLayoutManager.
         * @method close        
         * @return {<a href="Rui.ui.layout.LLayoutManager.html">Rui.ui.layout.LLayoutManager</a>} The parent LLayoutManager instance
         */
        close: function(){
            this.setStyle('display', 'none');
            this.get('parent').removeUnit(this);
            this.fireEvent('close', {target: this}, {isCE: true});
            if (this._clip){
                this._clip.parentNode.removeChild(this._clip);
                this._clip = null;
            }
            return this.get('parent');
        },
        /**
         * @description unit의 body에 대한 content html을 설정한다.
         * @method bodyHtml        
         */
        bodyHtml: function(body_html){
            this.body.innerHTML = body_html;
            this.resize(true);
        },
        /**
         * @description The initalization method inherited from Element.
         * @private
         * @method init        
         */
        init: function(p_oElement, p_oAttributes){
            this._gutter = {
                left: 0,
                right: 0,
                top: 0,
                bottom: 0
            };
            this._sizes = {
                wrap: {
                    h: 0,
                    w: 0
                },
                header: {
                    h: 0,
                    w: 0
                },
                body: {
                    h: 0,
                    w: 0
                },
                footer: {
                    h: 0,
                    w: 0
                }
            };

            LLayout.superclass.init.call(this, p_oElement, p_oAttributes);

            this.browser = this.get('parent').browser;

            var id = p_oElement;
            if (!Rui.isString(id)){
                id = Dom.generateId(id);
            }
            LLayout._instances[id] = this;

            this.setStyle('position', 'absolute');

            this.addClass('L-layout-unit');
            this.addClass('L-layout-unit-' + this.get('position'));

            var header = this.getElementsByClassName('L-layout-hd', 'div')[0];
            if (header)
                this.header = header;
            var body = this.getElementsByClassName('L-layout-bd', 'div')[0];
            if (body)
                this.body = body;
            var footer = this.getElementsByClassName('L-layout-ft', 'div')[0];
            if (footer)
                this.footer = footer;

            this.on('contentChange', this.resize, this, true);
            this._lastScrollTop = 0;

            this.set('animate', this.get('animate'));
        },
        /**
         * @description Processes the config
         * @private
         * @method initAttributes        
         */
        initAttributes: function(attr){
            LLayout.superclass.initAttributes.call(this, attr);

            /**
             * @description A reference to the wrap element
             * @private
             * @attribute wrap            
             * @type HTMLElement
             */
            this.setAttributeConfig('wrap', {
                value: attr.wrap || null,
                method: function(w){
                    if (w){
                        var id = Dom.generateId(w);
                        LLayout._instances[id] = this;
                    }
                }
            });
            /**
             * @description Set this option to true if you want the LLayout to fix the first layer of YUI CSS Grids (margins)
             * @attribute grids            
             * @type Boolean
             */
            this.setAttributeConfig('grids', {
                value: attr.grids || false
            });
            /**
             * @description The current top positioning of the Unit
             * @private
             * @attribute top            
             * @type Number
             */
            this.setAttributeConfig('top', {
                value: attr.top || 0,
                validator: Rui.isNumber,
                method: function(t){
                    if (!this._collapsing)
                        this.setStyle('top', t + 'px');
                }
            });
            /**
             * @description The current left position of the Unit
             * @private
             * @attribute left            
             * @type Number
             */
            this.setAttributeConfig('left', {
                value: attr.left || 0,
                validator: Rui.isNumber,
                method: function(l){
                    if (!this._collapsing)
                        this.setStyle('left', l + 'px');
                }
            });

            /**
             * @description The minWidth parameter passed to the Resize Utility
             * @attribute minWidth            
             * @type Number
             */
            this.setAttributeConfig('minWidth', {
                value: attr.minWidth || false,
                validator: Rui.isNumber
            });

            /**
             * @description The maxWidth parameter passed to the Resize Utility
             * @attribute maxWidth            
             * @type Number
             */
            this.setAttributeConfig('maxWidth', {
                value: attr.maxWidth || false,
                validator: Rui.isNumber
            });

            /**
             * @description The minHeight parameter passed to the Resize Utility
             * @attribute minHeight            
             * @type Number
             */
            this.setAttributeConfig('minHeight', {
                value: attr.minHeight || false,
                validator: Rui.isNumber
            });

            /**
             * @description The maxHeight parameter passed to the Resize Utility
             * @attribute maxHeight            
             * @type Number
             */
            this.setAttributeConfig('maxHeight', {
                value: attr.maxHeight || false,
                validator: Rui.isNumber
            });

            /**
             * @description The height of the Unit
             * @attribute height            
             * @type Number
             */
            this.setAttributeConfig('height', {
                value: attr.height,
                validator: Rui.isNumber,
                method: function(h){
                    if (!this._collapsing){
                        if (h < 0)
                            h = 0;
                        this.setStyle('height', h + 'px');
                    }
                }
            });

            /**
             * @description The width of the Unit
             * @attribute width            
             * @type Number
             */
            this.setAttributeConfig('width', {
                value: attr.width,
                validator: Rui.isNumber,
                method: function(w){
                    if (!this._collapsing){
                        if (w < 0)
                            w = 0;
                        this.setStyle('width', w + 'px');
                    }
                }
            });
            /**
             * @description The CSS zIndex to give to the unit, so you can have overlapping elements such as menus in a unit.
             * @attribute zIndex            
             * @type {Number}
             */
            this.setAttributeConfig('zIndex', {
                value: attr.zIndex || false,
                method: function(z){
                    this.setStyle('zIndex', z);
                }
            });
            /**
             * @description The position (top, right, bottom, left or center) of the Unit in the LLayoutManager
             * @attribute position            
             * @type {String}
             */
            this.setAttributeConfig('position', {
                value: attr.position
            });
            /**
             * @description The gutter that we should apply to the parent LLayoutManager around this Unit. Supports standard CSS markup: (2 4 0 5) or (2) or (2 5)
             * @attribute gutter            
             * @type String
             */
            this.setAttributeConfig('gutter', {
                value: attr.gutter || 0,
                validator: Rui.isString,
                method: function(gutter){
                    var p = gutter.split(' ');
                    if (p.length){
                        this._gutter.top = parseInt(p[0], 10);
                        
                        if (p[1])
                            this._gutter.right = parseInt(p[1], 10);
                        else
                            this._gutter.right = this._gutter.top;
                        
                        if (p[2])
                            this._gutter.bottom = parseInt(p[2], 10);
                        else
                            this._gutter.bottom = this._gutter.top;
                        
                        if (p[3])
                            this._gutter.left = parseInt(p[3], 10);
                        else if (p[1])
                            this._gutter.left = this._gutter.right;
                        else                        
                            this._gutter.left = this._gutter.top;                        
                    }
                }
            });
            /**
             * @description The parent LLayoutManager that we are assigned to
             * @attribute parent            
             * @type {Object} Rui.ui.layout.LLayoutManager
             */
            this.setAttributeConfig('parent', {
                writeOnce: true,
                value: attr.parent || false,
                method: function(p){
                    if (p)
                        p.on('resize', this.resize, this, true);
                }
            });
            /**
             * @description The pixel size of the Clip that we will collapse to
             * @attribute collapseSize            
             * @type Number
             */
            this.setAttributeConfig('collapseSize', {
                value: attr.collapseSize || 25,
                validator: Rui.isNumber
            });
            /**
             * @description The duration to give the Animation Utility when animating the opening and closing of Units
             * @attribute duration            
             */
            this.setAttributeConfig('duration', {
                value: attr.duration || 0.5
            });
            /**
             * @description The Animation LEasing to apply to the Animation instance for this unit.
             * @attribute easing            
             */
            this.setAttributeConfig('easing', {
                value: attr.easing || ((Rui.util && Rui.util.LEasing) ? Rui.util.LEasing.BounceIn : 'false')
            });
            /**
             * @description Use animation to collapse/expand the unit
             * @attribute animate            
             * @type Boolean
             */
            this.setAttributeConfig('animate', {
                value: ((attr.animate === false) ? false : true),
                validator: function(){
                    if (Rui.util.LAnim)
                        return true;
                    return false;
                },
                method: function(anim){
                    if (anim){
                        this._anim = new Rui.util.LAnim({
                            el: this.get('element'), 
                            attributes: {}, 
                            duration: this.get('duration'), 
                            method: this.get('easing')
                        });
                    }else{
                        this._anim = false;
                    }
                }
            });
            /**
             * @description The text to use as the Header of the Unit
             * @attribute header            
             */
            this.setAttributeConfig('header', {
                value: attr.header || false,
                method: function(txt){
                    if (txt === false){
                        //Remove the footer
                        if (this.header){
                            Dom.addClass(this.body, 'L-layout-bd-nohd');
                            this.header.parentNode.removeChild(this.header);
                            this.header = null;
                        }
                    } else{
                        if (!this.header){
                            var header = this.getElementsByClassName('L-layout-hd', 'div')[0];
                            if (!header){
                                header = this._createHeader();
                            }
                            this.header = header;
                        }
                        var h = this.header.getElementsByTagName('h2')[0];
                        if (!h){
                            h = document.createElement('h2');
                            this.header.appendChild(h);
                        }
                        h.innerHTML = txt;
                        if (this.body){
                            Dom.removeClass(this.body, 'L-layout-bd-nohd');
                        }
                    }
                    this.fireEvent('contentChange', { target: 'header' }, {isCE: true});
                }
            });
            /**
             * @description Use the proxy config setting for the Resize Utility
             * @attribute proxy            
             * @type Boolean
             */
            this.setAttributeConfig('proxy', {
                writeOnce: true,
                value: ((attr.proxy === false) ? false : true)
            });
            /**
             * @description The content for the body. If we find an element in the page with an id that matches the passed option we will move that element into the body of this unit.
             * @attribute body            
             */
            this.setAttributeConfig('body', {
                value: attr.body || false,
                method: function(content){
                    if (!this.body) {
                        var body = this.getElementsByClassName('L-layout-bd', 'div')[0];
                        if (body) {
                            this.body = body;
                        } else {
                            body = document.createElement('div');
                            body.className = 'L-layout-bd';
                            this.body = body;
                            this.get('wrap').appendChild(body);
                        }
                    }
                    if (!this.header){
                        Dom.addClass(this.body, 'L-layout-bd-nohd');
                    }
                    Dom.addClass(this.body, 'L-layout-bd-noft');

                    var el = null;
                    if (Rui.isString(content))
                        el = Dom.get(content);
                    else if (content && content.tagName)
                        el = content;

                    if (el){
                        var id = Dom.generateId(el);
                        LLayout._instances[id] = this;
                        this.body.appendChild(el);
                    } else
                        this.body.innerHTML = content;          

                    this._cleanGrids();
                    this.fireEvent('contentChange', { target: 'body' }, {isCE: true});
                }
            });

            /**
             * @description The content for the footer. If we find an element in the page with an id that matches the passed option we will move that element into the footer of this unit.
             * @attribute footer            
             */
            this.setAttributeConfig('footer', {
                value: attr.footer || false,
                method: function(content){
                    if (content === false){
                        //Remove the footer
                        if (this.footer){
                            Dom.addClass(this.body, 'L-layout-bd-noft');
                            this.footer.parentNode.removeChild(this.footer);
                            this.footer = null;
                        }
                    } else {
                        if (!this.footer){
                            var ft = this.getElementsByClassName('L-layout-ft', 'div')[0];
                            if (!ft){
                                ft = document.createElement('div');
                                ft.className = 'L-layout-ft';
                                this.footer = ft;
                                this.get('wrap').appendChild(ft);
                            } else
                                this.footer = ft;                        
                        }
                        
                        var el = null;
                        if (Rui.isString(content))
                            el = Dom.get(content);
                        else if (content && content.tagName)
                            el = content;
                        
                        if (el)                        
                            this.footer.appendChild(el);
                        else
                            this.footer.innerHTML = content;

                        Dom.removeClass(this.body, 'L-layout-bd-noft');
                    }
                    this.fireEvent('contentChange', { target: 'footer' }, {isCE: true});
                }
            });
            /**
             * @description Adds a close icon to the unit
             * @attribute close            
             */
            this.setAttributeConfig('close', {
                value: attr.close || false,
                method: function(close){
                    //Position Center doesn't get this
                    if (this.get('position') == 'center')
                        return false;

                    if (!this.header)
                        this._createHeader();

                    var c = Dom.getElementsByClassName('close', 'div', this.header)[0];
                    if (close){
                        //Force some header text if there isn't any
                        if (!this.get('header'))
                            this.set('header', '&nbsp;');
                        
                        if (!c){
                            c = document.createElement('div');
                            c.className = 'close';
                            this.header.appendChild(c);
                            Event.on(c, 'click', this.close, this, true);
                        }
                        c.title = this.STR_CLOSE;
                    } else if (c) {
                        Event.purgeElement(c);
                        c.parentNode.removeChild(c);
                    }
                    this._configs.close.value = close;
                    this.set('collapse', this.get('collapse')); //Reset so we get the right classnames
                }
            });

            /**
             * @description Adds a collapse icon to the unit
             * @attribute collapse            
             */
            this.setAttributeConfig('collapse', {
                value: attr.collapse || false,
                method: function(collapse){
                    //Position Center doesn't get this
                    if (this.get('position') == 'center')
                        return false;
                    
                    if (!this.header)
                        this._createHeader();

                    var c = Dom.getElementsByClassName('collapse', 'div', this.header)[0];
                    if (collapse) {
                        //Force some header text if there isn't any
                        if (!this.get('header'))
                            this.set('header', '&nbsp;');

                        if (!c) {
                            c = document.createElement('div');
                            this.header.appendChild(c);
                            Event.on(c, 'click', this.collapse, this, true);
                        }
                        c.title = this.STR_COLLAPSE;
                        c.className = 'collapse' + ((this.get('close')) ? ' collapse-close' : '');
                    } else if (c) {
                        Event.purgeElement(c);
                        c.parentNode.removeChild(c);
                    }
                }
            });
            /**
             * @description Adds a class to the unit to allow for overflow: auto (L-layout-scroll), default is overflow: hidden (L-layout-noscroll). If true scroll bars will be placed on the element when the content exceeds the given area, false will put overflow hidden to hide the content. Passing null will render the content as usual overflow.
             * @attribute scroll            
             * @type Boolean/Null
             */

            this.setAttributeConfig('scroll', {
                value: (((attr.scroll === true) || (attr.scroll === false) || (attr.scroll === null)) ? attr.scroll : false),
                method: function(scroll){
                    if ((scroll === false) && !this._collapsed){
                        //Removing scroll bar
                        if (this.body){
                            if (this.body.scrollTop > 0)
                                this._lastScrollTop = this.body.scrollTop;
                        }
                    }

                    if (scroll === true){
                        this.addClass('L-layout-scroll');
                        this.removeClass('L-layout-noscroll');
                        if (this._lastScrollTop > 0){
                            if (this.body)
                                this.body.scrollTop = this._lastScrollTop;
                        }
                    } else if (scroll === false){
                        this.removeClass('L-layout-scroll');
                        this.addClass('L-layout-noscroll');
                    } else if (scroll === null){
                        this.removeClass('L-layout-scroll');
                        this.removeClass('L-layout-noscroll');
                    }
                }
            });
            /**
             * @description Config option to pass to the Resize Utility
             * @attribute hover            
             */
            this.setAttributeConfig('hover', {
                writeOnce: true,
                value: attr.hover || false,
                validator: Rui.isBoolean
            });
            /**
             * @description Config option to pass to the Resize Utility
             * @attribute useShim            
             */
            this.setAttributeConfig('useShim', {
                value: attr.useShim || false,
                validator: Rui.isBoolean,
                method: function(u){
                    if (this._resize)
                        this._resize.set('useShim', u);
                }
            });
            /**
             * @description Should a Resize instance be added to this unit
             * @attribute resize            
             */

            this.setAttributeConfig('resize', {
                value: attr.resize || false,
                validator: function(r){
                    if (Rui.util && Rui.util.LResize)
                        return true;
                    return false;
                },
                method: function(resize){
                    if (resize && !this._resize){
                        //Position Center doesn't get this
                        if (this.get('position') == 'center')
                            return false;

                        var handle = false; //To catch center
                        switch (this.get('position')){
                            case 'top':
                                handle = 'b';
                                break;
                            case 'bottom':
                                handle = 't';
                                break;
                            case 'right':
                                handle = 'l';
                                break;
                            case 'left':
                                handle = 'r';
                                break;
                        }

                        this.setStyle('position', 'absolute'); //Make sure Resize get's a position

                        if (handle){
                            this._resize = new Rui.util.LResize({
                                el: this.get('element'),
                                attributes: {
                                    proxy: this.get('proxy'),
                                    hover: this.get('hover'),
                                    status: false,
                                    autoRatio: false,
                                    handles: [handle],
                                    minWidth: this.get('minWidth'),
                                    maxWidth: this.get('maxWidth'),
                                    minHeight: this.get('minHeight'),
                                    maxHeight: this.get('maxHeight'),
                                    height: this.get('height'),
                                    width: this.get('width'),
                                    setSize: false,
                                    useShim: this.get('useShim'),
                                    wrap: false
                                }
                            });

                            this._resize._handles[handle].innerHTML = '<div class="L-layout-resize-knob"></div>';

                            if (this.get('proxy')){
                                var proxy = this._resize.getProxyEl();
                                proxy.innerHTML = '<div class="L-layout-handle-' + handle + '"></div>';
                            }
                            this._resize.on('startResize', function(ev){
                                this._lastScroll = this.get('scroll');
                                this.set('scroll', false);
                                if (this.get('parent')){
                                    this.get('parent').fireEvent('startResize', {target: this});
                                    var c = this.get('parent').getUnitByPosition('center');
                                    this._lastCenterScroll = c.get('scroll');
                                    c.addClass(this._resize.CSS_RESIZING);
                                    c.set('scroll', false);
                                }
                                this.fireEvent('startResize', {target: this});
                            }, this, true);
                            this._resize.on('resize', function(ev){
                                this.set('height', ev.height);
                                this.set('width', ev.width);
                            }, this, true);
                            this._resize.on('endResize', function(ev){
                                this.set('scroll', this._lastScroll);
                                if (this.get('parent')){
                                    var c = this.get('parent').getUnitByPosition('center');
                                    c.set('scroll', this._lastCenterScroll);
                                    c.removeClass(this._resize.CSS_RESIZING);
                                }
                                this.resize();
                                this.fireEvent('endResize', {target: this});
                            }, this, true);
                        }
                    } else {
                        if (this._resize){
                            this._resize.destroy();
                        }
                    }
                }
            });
            /**
             * The unit data source, used for loading content dynamically.
             * @attribute dataSrc
             * @type String
             */
            this.setAttributeConfig('dataSrc', {
                value: attr.dataSrc
            });
            /**
             * The method to use for the data request.
             * @attribute loadMethod
             * @type String
             * @default "GET"
             */
            this.setAttributeConfig('loadMethod', {
                value: attr.loadMethod || 'GET',
                validator: Rui.isString
            });
            /**
             * Whether or not any data has been loaded from the server.
             * @attribute dataLoaded
             * @type Boolean
             */
            this.setAttributeConfig('dataLoaded', {
                value: false,
                validator: Rui.isBoolean,
                writeOnce: true
            });
            /**
             * Number if milliseconds before aborting and calling failure handler.
             * @attribute dataTimeout
             * @type Number
             * @default null
             */
            this.setAttributeConfig('dataTimeout', {
                value: attr.dataTimeout || null,
                validator: Rui.isNumber
            });
        },
        /**
         * @description This method attempts to clean up the first level of the YUI CSS Grids, Rui.util.Selector is required for this operation.
         * @private
         * @method _cleanGrids        
         */
        _cleanGrids: function(){
            if (this.get('grids')){
                var b = Sel.query('div.L-b', this.body, true);
                if (b)
                    Dom.removeClass(b, 'L-b');

                Event.onAvailable('L-main', function(){
                    Dom.setStyle(Sel.query('#L-main'), 'margin-left', '0');
                    Dom.setStyle(Sel.query('#L-main'), 'margin-right', '0');
                });
            }
        },
        /**
         * @description Creates the HTMLElement for the header
         * @private
         * @method _createHeader        
         * @return {HTMLElement} The new HTMLElement
         */
        _createHeader: function(){
            var header = document.createElement('div');
            header.className = 'L-layout-hd';
            if (this.get('firstChild'))
                this.get('wrap').insertBefore(header, this.get('wrap').firstChild);
            else
                this.get('wrap').appendChild(header);
            
            this.header = header;
            return header;
        },
        /**
         * @description Removes this unit from the parent and cleans up after itself.
         * @method destroy
         * @param {boolean} force Don't report to the parent, because we are being called from the parent.        
         * @return {<a href="Rui.ui.layout.LLayoutManager.html">Rui.ui.layout.LLayoutManager</a>} The parent LLayoutManager instance
         */
        destroy: function(force){
            if (this._resize)
                this._resize.destroy();

            var par = this.get('parent');

            this.setStyle('display', 'none');
            if (this._clip){
                this._clip.parentNode.removeChild(this._clip);
                this._clip = null;
            }

            if (!force)
                par.removeUnit(this);

            if (par)
                par.removeListener('resize', this.resize, this);

            //this.unsubscribeAll(); // undefined
            Event.purgeElement(this.get('element'));
            this.get('parentNode').removeChild(this.get('element'));

            delete Rui.ui.layout.LLayout._instances[this.get('id')];
            //Brutal Object Destroy
            for (var i in this){
                if (Rui.hasOwnProperty(this, i)){
                    this[i] = null;
                    delete this[i];
                }
            }
            return par;
        },
        /**
         * @description Returns a string representing the LLayout.
         * @method toString        
         * @return {String}
         */
        toString: function(){
            if (this.get)
                return 'LLayout #' + this.get('id') + ' (' + this.get('position') + ')';

            return 'LLayout';
        }
        /**
         * @description Fired when this.resize is called
         * @event resize        
         * @type Rui.util.LCustomEvent
         */
        /**
         * @description Fired when the Resize Utility fires it's startResize Event.
         * @event startResize        
         * @type Rui.util.LCustomEvent
         */
        /**
         * @description Fired when the Resize Utility fires it's endResize Event.
         * @event endResize        
         * @type Rui.util.LCustomEvent
         */
        /**
         * @description Fired at the beginning of the resize method. If you return false, the resize is cancelled.
         * @event beforeResize        
         * @type Rui.util.LCustomEvent
         */
        /**
         * @description Fired when the content in the header, body or footer is changed via the API
         * @event contentChange        
         * @type Rui.util.LCustomEvent
         */
        /**
         * @description Fired when the unit is closed
         * @event close        
         * @type Rui.util.LCustomEvent
         */
        /**
         * @description Fired before the unit is collapsed. If you return false, the collapse is cancelled.
         * @event beforeCollapse        
         * @type Rui.util.LCustomEvent
         */
        /**
         * @description Fired when the unit is collapsed
         * @event collapse        
         * @type Rui.util.LCustomEvent
         */
        /**
         * @description Fired when the unit is exanded
         * @event expand        
         * @type Rui.util.LCustomEvent
         */
        /**
         * @description Fired before the unit is exanded. If you return false, the collapse is cancelled.
         * @event beforeExpand        
         * @type Rui.util.LCustomEvent
         */
        /**
         * @description Fired when data is loaded via the dataSrc config.
         * @event load        
         * @type Rui.util.LCustomEvent
         */
        /**
         * @description Fired when an error occurs loading data via the dataSrc config. Error message is passed as argument to this event.
         * @event loadError        
         * @type Rui.util.LCustomEvent
         */
    });

    Rui.ui.layout.LLayout = LLayout;
})();