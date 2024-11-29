/*
 * @(#) LResize-debug.js
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
 * @description <p>사이즈 조절 가능한 element를 만든다.</p>
 * @namespace Rui.util
 * @requires Rui, dom, dragdrop, element, event
 * @optional animation
 * @module util
 */
(function() {

    var D = Rui.util.LDom,
        Event = Rui.util.LEvent;

    /**
     * @description <p>사이즈 조절 가능한 element를 만든다.</p>
     * @class LResize
     * @constructor
     * @plugin
     * @extends Rui.LElement
     * @param {String/HTMLElement} el 리사이즈 가능하게 만들 element
     * @param {Object} attrs 설정 parameter를 포함하는 Object liternal
    */
    var Resize = function(config) {
        config = config || {};
        Resize.superclass.constructor.call(this, config.el, config.attributes);
    };

    /**
    * @description 모든 리사이즈 인스턴스에 대한 내부적인 hash 테이블
    * @private
    * @static
    * @property _instances
    * @type Object
    */ 
    Resize._instances = {};
    
    /**
    * @description resize object와 연관된 element의 HTML id로 resize object를 가져온다.
    * @method getResizeById 
    * @static
    * @return {Object} The Resize Object
    */ 
    Resize.getResizeById = function(id) {
        if (Resize._instances[id]) {
            return Resize._instances[id];
        }
        return false;
    };

    Rui.extend(Resize, Rui.LElement, {
        /**
         * @description 객체의 이름
         * @property otype
         * @private
         * @type {String}
         */
        otype: 'Rui.util.LResize',
        /**
        * @description 기본 CSS 클래스 이름
        * @private
        * @property CSS_RESIZE
        * @static
        * @final
        * @type String
        */ 
        CSS_RESIZE: 'L-resize',
        /**
        * @description 드래그가 가능할때 추가되는 클래스 이름
        * @property CSS_DRAG
        * @private
        * @static
        * @final
        * @type String
        */ 
        CSS_DRAG: 'L-draggable',
        /**
        * @description 핸들링만 하는 hover에 대해 사용된 클래스 이름
        * @private
        * @property CSS_HOVER
        * @static
        * @final
        * @type String
        */ 
        CSS_HOVER: 'L-resize-hover',
        /**
        * @description proxy element에 주어진 클래스 이름
        * @private
        * @property CSS_PROXY
        * @static
        * @final
        * @type String
        */ 
        CSS_PROXY: 'L-resize-proxy',
        /**
        * @description wrap element에 주어진 클래스 이름
        * @private
        * @property CSS_WRAP
        * @static
        * @final
        * @type String
        */ 
        CSS_WRAP: 'L-resize-wrap',
        /**
        * @description knob style 핸들링을 만들기 위해 사용된 클래스 이름
        * @private
        * @property CSS_KNOB
        * @static
        * @final
        * @type String
        */ 
        CSS_KNOB: 'L-resize-knob',
        /**
        * @description 히든값의 모든 것을 핸들링 하기 위한 wrap element에 주어진 클래스 이름
        * @private
        * @property CSS_HIDDEN
        * @static
        * @final
        * @type String
        */ 
        CSS_HIDDEN: 'L-resize-hidden',
        /**
        * @description 단일 핸들링의 이름에 대한 기반으로 사용하는 모든 핸들링에 주어진 클래스 이름.
        * Handle "t"는 this.CSS_HANDLE 뿐만 아니라 this.CSS_HANDLE + '-t'을 가져 올것이다.
        * @private
        * @property CSS_HANDLE
        * @static
        * @final
        * @type String
        */ 
        CSS_HANDLE: 'L-resize-handle',
        /**
        * @description status element에 주어진 클래스 이름
        * @property CSS_STATUS
        * @private
        * @static
        * @final
        * @type String
        */ 
        CSS_STATUS: 'L-resize-status',
        /**
        * @description ghost property가 활성화 될때 wrap element에 주어진 클래스 이름
        * @property CSS_GHOST
        * @private
        * @static
        * @final
        * @type String
        */ 
        CSS_GHOST: 'L-resize-ghost',
        /**
        * @description 리사이즈 액션이 자리를 차지할때 wrap element에 주어진 클래스 이름.
        * @property CSS_RESIZING
        * @private
        * @static
        * @final
        * @type String
        */ 
        CSS_RESIZING: 'L-resize-resizing',
        /**
        * @description 리사이즈하는데 사용되는 마우스 even
        * @property _resizeEvent
        * @private
        * @type Event
        */ 
        _resizeEvent: null,
        /**
        * @description 드래그 설정가능이 true인 경우 사용된
        * <a href="Rui.dd.LDragDrop.html">Rui.dd.LDragDrop</a> 인스턴스
        * @property dd
        * @private
        * @type Object
        */ 
        dd: null,
        /** 
        * @description Rui.env.ua property의 복사본
        * @property browser
        * @private
        * @type Object
        */
        browser: Rui.browser,
        /** 
        * @description 리사이즈가 잠긴 경우를 표시하기 위한 flag
        * @property _locked
        * @private
        * @type Boolean
        */
        _locked: null,
        /** 
        * @description element가 절대 좌표로 위치한 경우를 표시하기 위한 flag
        * @property _positioned
        * @private
        * @type Boolean
        */
        _positioned: null,
        /** 
        * @description 리사이즈를 핸들링 하기 위해 사용되는 
        * <a href="Rui.dd.LDragDrop.html">Rui.dd.LDragDrop</a> 인스턴스들의 모든 것에 대한 참조를 포함하는 object
        * @private
        * @property _dds
        * @type Object
        */
        _dds: null,
        /** 
        * @description element wrapper의 HTML 참조
        * @property _wrap
        * @private
        * @type HTMLElement
        */
        _wrap: null,
        /** 
        * @description element proxy의 HTML 참조
        * @property _proxy
        * @private
        * @type HTMLElement
        */
        _proxy: null,
        /** 
        * @description 리사이즈 핸들링의 모든 것에 대한 참조들을 포함하고 있는 object
        * @property _handles
        * @private
        * @type Object
        */
        _handles: null,
        /** 
        * @description 현재 활성화된 핸들링의 문자열 식별자. 예. 'r', 'br', 'tl'
        * @property _currentHandle
        * @private
        * @type String
        */
        _currentHandle: null,
        /** 
        * @description 현재 활성화된 LDD object에의 링크
        * @property _currentDD
        * @private
        * @type Object
        */
        _currentDD: null,
        /** 
        * @description 리사이즈된 element에 대한 key 정보를 포함하는 조회 테이블.
        * 예. height, width, x 위치, y 위치 등..
        * @property _cache
        * @private
        * @type Object
        */
        _cache: null,
        /** 
        * @description 리사이즈가 활성화 되어 있는 경우를 표시하기 위한 flag. event들을 위해 사용된다.
        * @property _active
        * @private
        * @type Boolean
        */
        _active: null,
        /** 
        * @description proxy 설정이 true인 경우 proxy element를 생성한다.
        * @method _createProxy
        * @private
        */
        _createProxy: function() {
            if (this.get('proxy')) {
                this._proxy = document.createElement('div');
                this._proxy.className = this.CSS_PROXY;
                this._proxy.style.height = this.get('element').clientHeight + 'px';
                this._proxy.style.width = this.get('element').clientWidth + 'px';
                this._wrap.parentNode.appendChild(this._proxy);
            } else {
                this.set('animate', false);
            }
        },
        /** 
        * @description wrap 설정이 true인 경우 wrap element를 생성한다.
        * 다음 element 타입들은 자동으로 wrap 될것이다: img, textarea, input, iframe, select
        * @method _createWrap
        * @private
        * @return {void}
        */
        _createWrap: function() {
            this._positioned = false;
            //Force wrap for elements that can't have children 
            switch (this.get('element').tagName.toLowerCase()) {
                case 'img':
                case 'textarea':
                case 'input':
                case 'iframe':
                case 'select':
                    this.set('wrap', true);
                    break;
            }
            if (this.get('wrap') === true) {
                this._wrap = document.createElement('div');
                this._wrap.id = this.get('element').id + '_wrap';
                this._wrap.className = this.CSS_WRAP;
                D.setStyle(this._wrap, 'width', this.get('width') + 'px');
                D.setStyle(this._wrap, 'height', this.get('height') + 'px');
                D.setStyle(this._wrap, 'z-index', this.getStyle('z-index'));
                this.setStyle('z-index', 0);
                var pos = D.getStyle(this.get('element'), 'position');
                D.setStyle(this._wrap, 'position', ((pos == 'static') ? 'relative' : pos));
                D.setStyle(this._wrap, 'top', D.getStyle(this.get('element'), 'top'));
                D.setStyle(this._wrap, 'left', D.getStyle(this.get('element'), 'left'));
                if (D.getStyle(this.get('element'), 'position') == 'absolute') {
                    this._positioned = true;
                    D.setStyle(this.get('element'), 'position', 'relative');
                    D.setStyle(this.get('element'), 'top', '0');
                    D.setStyle(this.get('element'), 'left', '0');
                }
                var par = this.get('element').parentNode;
                par.replaceChild(this._wrap, this.get('element'));
                this._wrap.appendChild(this.get('element'));
            } else {
                this._wrap = this.get('element');
                if (D.getStyle(this._wrap, 'position') == 'absolute') {
                    this._positioned = true;
                }
            }
            if (this.get('draggable')) {
                this._setupDragDrop();
            }
            if (this.get('hover')) {
                D.addClass(this._wrap, this.CSS_HOVER);
            }
            if (this.get('knobHandles')) {
                D.addClass(this._wrap, this.CSS_KNOB);
            }
            if (this.get('hiddenHandles')) {
                D.addClass(this._wrap, this.CSS_HIDDEN);
            }
            D.addClass(this._wrap, this.CSS_RESIZE);
        },
        /** 
        * @description element에 <a href="Rui.dd.LDragDrop.html">Rui.dd.LDragDrop</a> 인스턴스를 셋업한다.
        * @method _setupDragDrop
        * @private
        * @return {void}
        */
        _setupDragDrop: function() {
            D.addClass(this._wrap, this.CSS_DRAG);
            this.dd = new Rui.dd.LDD(this._wrap, this.get('id') + '-resize', { dragOnly: true, useShim: this.get('useShim') });
            this.dd.on('dragEvent', function() {
                this.fireEvent('dragEvent', arguments);
            }, this, true);
        },
        /** 
        * @description 설정에 명시된대로 핸들링을 생성한다.
        * @method _createHandles
        * @private
        */
        _createHandles: function() {
            this._handles = {};
            this._dds = {};
            var h = this.get('handles');
            for (var i = 0; i < h.length; i++) {
                this._handles[h[i]] = document.createElement('div');
                this._handles[h[i]].id = D.generateId(this._handles[h[i]]);
                this._handles[h[i]].className = this.CSS_HANDLE + ' ' + this.CSS_HANDLE + '-' + h[i];
                var k = document.createElement('div');
                k.className = this.CSS_HANDLE + '-inner-' + h[i];
                this._handles[h[i]].appendChild(k);
                this._wrap.appendChild(this._handles[h[i]]);
                Event.on(this._handles[h[i]], 'mouseover', this._handleMouseOver, this, true);
                Event.on(this._handles[h[i]], 'mouseout', this._handleMouseOut, this, true);
                this._dds[h[i]] = new Rui.dd.LDragDrop({
                    id: this._handles[h[i]], 
                    group: this.get('id') + '-handle-' + h,
                    attributes: { 
                        useShim: this.get('useShim')
                    }
                });
                this._dds[h[i]].setPadding(15, 15, 15, 15);
                this._dds[h[i]].on('startDragEvent', this._handleStartDrag, this);
                this._dds[h[i]].on('mouseDownEvent', this._handleMouseDown, this);
            }
            this._status = document.createElement('span');
            this._status.className = this.CSS_STATUS;
            document.body.insertBefore(this._status, document.body.firstChild);
        },
        /** 
        * @description Internet Explorer에서 드래그를 시작할때 onselectstart handler로써 사용할 함수
        * @method _ieSelectFix
        * @private
        */
        _ieSelectFix: function() {
            return false;
        },
        /** 
        * @description 해당 property에 현재 "onselectstart" method의 복사본을 유지할 것이며,
        * 그것을 사용한 이후에 그것을 재설정한다.
        * @property _ieSelectBack
        * @private
        */
        _ieSelectBack: null,
        /** 
        * @description 이 method는 "autoRatio" 설정이 되어 있는 경우를 확인한다.
        * 만약 설정된 경우 "Shift Key"가 눌린 경우를 확인한다. 또한 그런 경우 config ratio를 true로 설정한다.
        * @private
        * @method _setAutoRatio
        * @param {Event} ev 마우스 event.
        */
        _setAutoRatio: function(ev) {
            if (this.get('autoRatio')) {
                if (ev && ev.shiftKey) {
                    //Shift Pressed
                    this.set('ratio', true);
                } else {
                    this.set('ratio', this._configs.ratio._initialConfig.value);
                }
            }
        },
        /** 
        * @description 이 method는 MouseDown에 autoRatio를 준비한다. 
        * @private
        * @method _handleMouseDown
        * @param {Event} ev 마우스 event.
        */
        _handleMouseDown: function(e) {
            if (this._locked) {
                return false;
            }
            if (D.getStyle(this._wrap, 'position') == 'absolute') {
                this._positioned = true;
            }
            if (e) {
                this._setAutoRatio(e);
            }
            if (this.browser.msie) {
                this._ieSelectBack = document.body.onselectstart;
                document.body.onselectstart = this._ieSelectFix;
            }
        },
        /** 
        * @description 핸들링에 대한 CSS 클래스 이름들을 추가한다.
        * @private
        * @method _handleMouseOver
        * @param {Event} ev 마우스 event.
        */
        _handleMouseOver: function(ev) {
            if (this._locked) {
                return false;
            }
            //Internet Explorer needs this
            D.removeClass(this._wrap, this.CSS_RESIZE);
            if (this.get('hover')) {
                D.removeClass(this._wrap, this.CSS_HOVER);
            }
            var tar = Event.getTarget(ev);
            if (!D.hasClass(tar, this.CSS_HANDLE)) {
                tar = tar.parentNode;
            }
            if (D.hasClass(tar, this.CSS_HANDLE) && !this._active) {
                D.addClass(tar, this.CSS_HANDLE + '-active');
                for (var i in this._handles) {
                    if (Rui.hasOwnProperty(this._handles, i)) {
                        if (this._handles[i] == tar) {
                            D.addClass(tar, this.CSS_HANDLE + '-' + i + '-active');
                            break;
                        }
                    }
                }
            }

            //Internet Explorer needs this
            D.addClass(this._wrap, this.CSS_RESIZE);
        },
        /** 
        * @description 핸들링에 대한 CSS 클래스 이름을 제거한다.
        * @private
        * @method _handleMouseOut
        * @param {Event} ev 마우스 event.
        */
        _handleMouseOut: function(ev) {
            //Internet Explorer needs this
            D.removeClass(this._wrap, this.CSS_RESIZE);
            if (this.get('hover') && !this._active) {
                D.addClass(this._wrap, this.CSS_HOVER);
            }
            var tar = Event.getTarget(ev);
            if (!D.hasClass(tar, this.CSS_HANDLE)) {
                tar = tar.parentNode;
            }
            if (D.hasClass(tar, this.CSS_HANDLE) && !this._active) {
                D.removeClass(tar, this.CSS_HANDLE + '-active');
                for (var i in this._handles) {
                    if (Rui.hasOwnProperty(this._handles, i)) {
                        if (this._handles[i] == tar) {
                            D.removeClass(tar, this.CSS_HANDLE + '-' + i + '-active');
                            break;
                        }
                    }
                }
            }
            //Internet Explorer needs this
            D.addClass(this._wrap, this.CSS_RESIZE);
        },
        /** 
        * @description proxy를 리사이즈 하고, <a href="Rui.dd.LDragDrop.html">Rui.dd.LDragDrop</a> handler를
        * 셋업하고 div의 상태를 업데이트 하며, 캐시를 준비한다.
        * @private
        * @method _handleStartDrag
        * @param {Object} args LCustomEvent로부터 전달된 argument들
        * @param {Object} dd 작업할 <a href="Rui.dd.LDragDrop.html">Rui.dd.LDragDrop</a> object
        */
        _handleStartDrag: function(e) {
            var dd = e.dd,
                tar = dd.getDragEl();
            if (D.hasClass(tar, this.CSS_HANDLE)) {
                if (D.getStyle(this._wrap, 'position') == 'absolute') {
                    this._positioned = true;
                }
                this._active = true;
                this._currentDD = dd;
                if (this._proxy) {
                    this._proxy.style.visibility = 'visible';
                    this._proxy.style.zIndex = '1000';
                    this._proxy.style.height = this.get('element').clientHeight + 'px';
                    this._proxy.style.width = this.get('element').clientWidth + 'px';
                }

                for (var i in this._handles) {
                    if (Rui.hasOwnProperty(this._handles, i)) {
                        if (this._handles[i] == tar) {
                            this._currentHandle = i;
                            var handle = '_handle_for_' + i;
                            D.addClass(tar, this.CSS_HANDLE + '-' + i + '-active');
                            dd.on('dragEvent', this[handle], this, true);
                            dd.on('mouseUpEvent', this._handleMouseUp, this, true);
                            break;
                        }
                    }
                }

                D.addClass(tar, this.CSS_HANDLE + '-active');

                if (this.get('proxy')) {
                    var xy = D.getXY(this.get('element'));
                    D.setXY(this._proxy, xy);
                    if (this.get('ghost')) {
                        this.addClass(this.CSS_GHOST);
                    }
                }
                D.addClass(this._wrap, this.CSS_RESIZING);
                this._setCache();
                this._updateStatus(this._cache.height, this._cache.width, this._cache.top, this._cache.left);
                this.fireEvent('startResize', { type: 'startresize', target: this});
            }
        },
        /** 
        * @description this._cache hash 테이블을 셋업한다.
        * @private
        * @method _setCache
        */
        _setCache: function() {
            this._cache.xy = D.getXY(this._wrap);
            D.setXY(this._wrap, this._cache.xy);
            this._cache.height = this.get('clientHeight');
            this._cache.width = this.get('clientWidth');
            this._cache.start.height = this._cache.height;
            this._cache.start.width = this._cache.width;
            this._cache.start.top = this._cache.xy[1];
            this._cache.start.left = this._cache.xy[0];
            this._cache.top = this._cache.xy[1];
            this._cache.left = this._cache.xy[0];
            this.set('height', this._cache.height, true);
            this.set('width', this._cache.width, true);
        },
        /** 
        * @description listener들을 초기화 하고, proxy element를 숨기며 클래스 이름을 삭제한다. 
        * @private
        * @method _handleMouseUp
        * @param {Event} ev 마우스 event.
        */
        _handleMouseUp: function(ev) {
            this._active = false;

            var handle = '_handle_for_' + this._currentHandle;
            this._currentDD.unOn('dragEvent', this[handle], this, true);
            this._currentDD.unOn('mouseUpEvent', this._handleMouseUp, this, true);

            if (this._proxy) {
                this._proxy.style.visibility = 'hidden';
                this._proxy.style.zIndex = '-1';
                if (this.get('setSize')) {
                    this.resize(ev, this._cache.height, this._cache.width, this._cache.top, this._cache.left, true);
                } else {
                    this.fireEvent('resize', { ev: 'resize', target: this, height: this._cache.height, width: this._cache.width, top: this._cache.top, left: this._cache.left });
                }

                if (this.get('ghost')) {
                    this.removeClass(this.CSS_GHOST);
                }
            }

            if (this.get('hover')) {
                D.addClass(this._wrap, this.CSS_HOVER);
            }
            if (this._status) {
                D.setStyle(this._status, 'display', 'none');
            }
            if (this.browser.msie) {
                document.body.onselectstart = this._ieSelectBack;
            }

            if (this.browser.msie) {
                D.removeClass(this._wrap, this.CSS_RESIZE);
            }

            for (var i in this._handles) {
                if (Rui.hasOwnProperty(this._handles, i)) {
                    D.removeClass(this._handles[i], this.CSS_HANDLE + '-active');
                }
            }
            if (this.get('hover') && !this._active) {
                D.addClass(this._wrap, this.CSS_HOVER);
            }
            D.removeClass(this._wrap, this.CSS_RESIZING);

            D.removeClass(this._handles[this._currentHandle], this.CSS_HANDLE + '-' + this._currentHandle + '-active');
            D.removeClass(this._handles[this._currentHandle], this.CSS_HANDLE + '-active');

            if (this.browser.msie) {
                D.addClass(this._wrap, this.CSS_RESIZE);
            }

            this._resizeEvent = null;
            this._currentHandle = null;
            
            if (!this.get('animate')) {
                this.set('height', this._cache.height, true);
                this.set('width', this._cache.width, true);
            }

            this.fireEvent('endResize', { ev: 'endResize', target: this, height: this._cache.height, width: this._cache.width, top: this._cache.top, left: this._cache.left });
        },
        /** 
        * @description Height, Width, Top, Left을 사용하여 원래 element 사이즈에 기반해서 재계산을 한다.
        * @private
        * @method _setRatio
        * @param {Number} h The height offset.
        * @param {Number} w The with offset.
        * @param {Number} t The top offset.
        * @param {Number} l The left offset.
        * @return {Array} 새로운 Height, Width, Top, Left 설정
        */
        _setRatio: function(h, w, t, l) {
            var oh = h, ow = w;
            if (this.get('ratio')) {
//                var orgH = this._cache.height,
//                    orgW = this._cache.width;
                var nh = parseInt(this.get('height'), 10),
                    nw = parseInt(this.get('width'), 10),
                    maxH = this.get('maxHeight'),
                    minH = this.get('minHeight');
//                var maxW = this.get('maxWidth'),
//                    minW = this.get('minWidth');

                switch (this._currentHandle) {
                    case 'l':
                        h = nh * (w / nw);
                        h = Math.min(Math.max(minH, h), maxH);
                        w = nw * (h / nh);
                        t = (this._cache.start.top - (-((nh - h) / 2)));
                        l = (this._cache.start.left - (-((nw - w))));
                        break;
                    case 'r':
                        h = nh * (w / nw);
                        h = Math.min(Math.max(minH, h), maxH);
                        w = nw * (h / nh);
                        t = (this._cache.start.top - (-((nh - h) / 2)));
                        break;
                    case 't':
                        w = nw * (h / nh);
                        h = nh * (w / nw);
                        l = (this._cache.start.left - (-((nw - w) / 2)));
                        t = (this._cache.start.top - (-((nh - h))));
                        break;
                    case 'b':
                        w = nw * (h / nh);
                        h = nh * (w / nw);
                        l = (this._cache.start.left - (-((nw - w) / 2)));
                        break;
                    case 'bl':
                        h = nh * (w / nw);
                        w = nw * (h / nh);
                        l = (this._cache.start.left - (-((nw - w))));
                        break;
                    case 'br':
                        h = nh * (w / nw);
                        w = nw * (h / nh);
                        break;
                    case 'tl':
                        h = nh * (w / nw);
                        w = nw * (h / nh);
                        l = (this._cache.start.left - (-((nw - w))));
                        t = (this._cache.start.top - (-((nh - h))));
                        break;
                    case 'tr':
                        h = nh * (w / nw);
                        w = nw * (h / nh);
                        l = (this._cache.start.left);
                        t = (this._cache.start.top - (-((nh - h))));
                        break;
                }
                oh = this._checkHeight(h);
                ow = this._checkWidth(w);
                if ((oh != h) || (ow != w)) {
                    t = 0;
                    l = 0;
                    if (oh != h) {
                        ow = this._cache.width;
                    }
                    if (ow != w) {
                        oh = this._cache.height;
                    }
                }
            }
            return [oh, ow, t, l];
        },
        /** 
        * @description Height, Width, Top, Left을 사용하여 element 사이즈를 가지고 status element를 업데이트 한다.
        * @private
        * @method _updateStatus
        * @param {Number} h 새로운 height 설정
        * @param {Number} w 새로운 width 설정
        * @param {Number} t 새로운 top 설정
        * @param {Number} l 새로운 left 설정
        */
        _updateStatus: function(h, w, t, l) {
            if (this._resizeEvent && (!Rui.isString(this._resizeEvent))) {
                if (this.get('status')) {
                    D.setStyle(this._status, 'display', 'inline');
                }
                h = ((h === 0) ? this._cache.start.height : h);
                w = ((w === 0) ? this._cache.start.width : w);
                var h1 = parseInt(this.get('height'), 10),
                    w1 = parseInt(this.get('width'), 10);
                
                if (isNaN(h1)) {
                    h1 = parseInt(h, 10);
                }
                if (isNaN(w1)) {
                    w1 = parseInt(w, 10);
                }
                var diffH = (parseInt(h, 10) - h1);
                var diffW = (parseInt(w, 10) - w1);
                this._cache.offsetHeight = diffH;
                this._cache.offsetWidth = diffW;
                this._status.style.position = 'absolute';
                D.setXY(this._status, [Event.getPageX(this._resizeEvent) + 12, Event.getPageY(this._resizeEvent) + 12]);
                this._status.innerHTML = '<strong>' + parseInt(h, 10) + ' x ' + parseInt(w, 10) + '</strong><em>' + ((diffH > 0) ? '+' : '') + diffH + ' x ' + ((diffW > 0) ? '+' : '') + diffW + '</em>';
            }
        },
        /** 
        * @description 리사이즈 될 수 없도록 리사이즈를 locking 한다.
        * @public 
        * @method lock
        * @param {boolean} dd 드래그 가능하도록 설정되어 있는 경우에도 역시 lock 됨
        * @return {<a href="Rui.util.LResize.html">Rui.util.LResize</a>} 리사이즈 인스턴스
        */
        lock: function(dd) {
            this._locked = true;
            if (dd && this.dd) {
                D.removeClass(this._wrap, 'L-draggable');
                this.dd.lock();
            }
            return this;
        },
        /** 
        * @description 리사이즈 될 수 있도록 unlocking 한다.
        * @public 
        * @method unlock
        * @param {boolean} dd 드래그 가능하도록 설정되어 있는 경우에도 역시 unlock 됨
        * @return {<a href="Rui.util.LResize.html">Rui.util.LResize</a>} 리사이즈 인스턴스
        */
        unlock: function(dd) {
            this._locked = false;
            if (dd && this.dd) {
                D.addClass(this._wrap, 'L-draggable');
                this.dd.unlock();
            }
            return this;
        },
        /**
        * @description 리사이즈 인스턴스의 lock 상태를 체크한다.
        * @public 
        * @method isLocked
        * @return {boolean}
        */
        isLocked: function() {
            return this._locked;
        },
        /** 
        * @description start 상태가 되도록 element를 리셋한다.
        * @public 
        * @method reset
        * @return {<a href="Rui.util.LResize.html">Rui.util.LResize</a>} 리사이즈 인스턴스
        */
        reset: function() {
            this.resize(null, this._cache.start.height, this._cache.start.width, this._cache.start.top, this._cache.start.left, true);
            return this;
        },
        /** 
        * @description handler로 부터의 데이터에 기반한 wrapper나 proxy element를 리사이즈 한다.
        * @private
        * @method resize
        * @param {Event} ev 마우스 event.
        * @param {Number} h 새로운 height 설정
        * @param {Number} w 새로운 width 설정
        * @param {Number} t 새로운 top 설정
        * @param {Number} l 새로운 left 설정
        * @param {boolean} force element를 리사이즈한다.(proxy 리사이즈에 대해 사용됨)
        * @param {boolean} silent beforeResize Event 전에는 발생하지 않도록 한다.
        * @return {<a href="Rui.util.LResize.html">Rui.util.LResize</a>} 리사이즈 인스턴스
        */
        resize: function(ev, h, w, t, l, force, silent) {
            if (this._locked) {
                return false;
            }
            this._resizeEvent = ev;
            var el = this._wrap, anim = this.get('animate'), set = true;
            if (this._proxy && !force) {
                el = this._proxy;
                anim = false;
            }
            this._setAutoRatio(ev);
            if (this._positioned) {
                if (this._proxy) {
                    t = this._cache.top - t;
                    l = this._cache.left - l;
                }
            }

            var ratio = this._setRatio(h, w, t, l);
            h = parseInt(ratio[0], 10);
            w = parseInt(ratio[1], 10);
            t = parseInt(ratio[2], 10);
            l = parseInt(ratio[3], 10);

            if (t == 0) {
                //No Offset, get from cache
                t = D.getY(el);
            }
            if (l == 0) {
                //No Offset, get from cache
                l = D.getX(el);
            }

            

            if (this._positioned) {
                if (this._proxy && force) {
                    if (!anim) {
                        el.style.top = this._proxy.style.top;
                        el.style.left = this._proxy.style.left;
                    } else {
                        t = this._proxy.style.top;
                        l = this._proxy.style.left;
                    }
                } else {
                    if (!this.get('ratio') && !this._proxy) {
                        t = this._cache.top + -(t);
                        l = this._cache.left + -(l);
                    }
                    if (t) {
                        if (this.get('minY')) {
                            if (t < this.get('minY')) {
                                t = this.get('minY');
                            }
                        }
                        if (this.get('maxY')) {
                            if (t > this.get('maxY')) {
                                t = this.get('maxY');
                            }
                        }
                    }
                    if (l) {
                        if (this.get('minX')) {
                            if (l < this.get('minX')) {
                                l = this.get('minX');
                            }
                        }
                        if (this.get('maxX')) {
                            if ((l + w) > this.get('maxX')) {
                                l = (this.get('maxX') - w);
                            }
                        }
                    }
                }
            }
            if (!silent) {
                var beforeReturn = this.fireEvent('beforeResize', { ev: 'beforeResize', target: this, height: h, width: w, top: t, left: l });
                if (beforeReturn === false) {
                    return false;
                }
            }

            this._updateStatus(h, w, t, l);

            if (this._positioned) {
                if (this._proxy && force) {
                    //Do nothing
                } else {
                    if (t) {
                        D.setY(el, t);
                        this._cache.top = t;
                    }
                    if (l) {
                        D.setX(el, l);
                        this._cache.left = l;
                    }
                }
            }
            if (h) {
                if (!anim) {
                    set = true;
                    if (this._proxy && force) {
                        if (!this.get('setSize')) {
                            set = false;
                        }
                    }
                    if (set) {
                        if (this.browser.msie > 6) {
                            if (h === this._cache.height) {
                                h = h + 1;
                            }
                        }
                        el.style.height = h + 'px';
                    }
                    if ((this._proxy && force) || !this._proxy) {
                        if (this._wrap != this.get('element')) {
                            this.get('element').style.height = h + 'px';
                        }
                    }
                }
                this._cache.height = h;
            }
            if (w) {
                this._cache.width = w;
                if (!anim) {
                    set = true;
                    if (this._proxy && force) {
                        if (!this.get('setSize')) {
                            set = false;
                        }
                    }
                    if (set) {
                        el.style.width = w + 'px';
                    }
                    if ((this._proxy && force) || !this._proxy) {
                        if (this._wrap != this.get('element')) {
                            this.get('element').style.width = w + 'px';
                        }
                    }
                }
            }
            if (anim) {
                if (Rui.fx.LAnim) {
                    var _anim = new Rui.fx.LAnim({
                        el: el, 
                        attributes: {
                            height: {
                                to: this._cache.height
                            },
                            width: {
                                to: this._cache.width
                            }
                        }, 
                        duration: this.get('animateDuration'), 
                        method: this.get('animateEasing')
                    });
                    if (this._positioned) {
                        if (t) {
                            _anim.attributes.top = {
                                to: parseInt(t, 10)
                            };
                        }
                        if (l) {
                            _anim.attributes.left = {
                                to: parseInt(l, 10)
                            };
                        }
                    }

                    if (this._wrap != this.get('element')) {
                        _anim.onTween.on(function() {
                            this.get('element').style.height = el.style.height;
                            this.get('element').style.width = el.style.width;
                        }, this, true);
                    }

                    _anim.onComplete.on(function() {
                        this.set('height', h);
                        this.set('width', w);
                        this.fireEvent('resize', { ev: 'resize', target: this, height: h, width: w, top: t, left: l });
                    }, this, true);
                    _anim.animate();

                }
            } else {
                if (this._proxy && !force) {
                    this.fireEvent('proxyResize', { ev: 'proxyresize', target: this, height: h, width: w, top: t, left: l });
                } else {
                    this.fireEvent('resize', { ev: 'resize', target: this, height: h, width: w, top: t, left: l });
                }
            }
            return this;
        },
        /** 
        * @description Bottom Right handle에 대한 사이즈를 핸들링 한다.
        * @private
        * @method _handle_for_br
        * @param {Object} args LCustomEvent로부터의 argument
        */
        _handle_for_br: function(args) {
            var newW = this._setWidth(args.e);
            var newH = this._setHeight(args.e);
            this.resize(args.e, (newH + 1), newW, 0, 0);
        },
        /** 
        * @description Bottom Left handle에 대한 사이즈를 핸들링 한다.
        * @private
        * @method _handle_for_bl
        * @param {Object} args LCustomEvent로부터의 argument
        */
        _handle_for_bl: function(args) {
            var newW = this._setWidth(args.e, true);
            var newH = this._setHeight(args.e);
            var l = (newW - this._cache.width);
            this.resize(args.e, newH, newW, 0, l);
        },
        /** 
        * @description Top Left handle에 대한 사이즈를 핸들링 한다.
        * @private
        * @method _handle_for_tl
        * @param {Object} args LCustomEvent로부터의 argument
        */
        _handle_for_tl: function(args) {
            var newW = this._setWidth(args.e, true);
            var newH = this._setHeight(args.e, true);
            var t = (newH - this._cache.height);
            var l = (newW - this._cache.width);
            this.resize(args.e, newH, newW, t, l);
        },
        /** 
        * @description Top Right handle에 대한 사이즈를 핸들링 한다.
        * @private
        * @method _handle_for_tr
        * @param {Object} args LCustomEvent로부터의 argument
        */
        _handle_for_tr: function(args) {
            var newW = this._setWidth(args.e);
            var newH = this._setHeight(args.e, true);
            var t = (newH - this._cache.height);
            this.resize(args.e, newH, newW, t, 0);
        },
        /** 
        * @description Right handle에 대한 사이즈를 핸들링 한다.
        * @private
        * @method _handle_for_r
        * @param {Object} args LCustomEvent로부터의 argument
        */
        _handle_for_r: function(args) {
            this._dds.r.setYConstraint(0,0);
            var newW = this._setWidth(args.e);
            this.resize(args.e, 0, newW, 0, 0);
        },
        /** 
        * @description Left handle에 대한 사이즈를 핸들링 한다.
        * @private
        * @method _handle_for_l
        * @param {Object} args LCustomEvent로부터의 argument
        */
        _handle_for_l: function(args) {
            this._dds.l.setYConstraint(0,0);
            var newW = this._setWidth(args.e, true);
            var l = (newW - this._cache.width);
            this.resize(args.e, 0, newW, 0, l);
        },
        /** 
        * @description Bottom handle에 대한 사이즈를 핸들링 한다.
        * @private
        * @method _handle_for_b
        * @param {Object} args LCustomEvent로부터의 argument
        */
        _handle_for_b: function(args) {
            this._dds.b.setXConstraint(0,0);
            var newH = this._setHeight(args.e);
            this.resize(args.e, newH, 0, 0, 0);
        },
        /** 
        * @description Top handle에 대한 사이즈를 핸들링 한다.
        * @private
        * @method _handle_for_t
        * @param {Object} args LCustomEvent로부터의 argument
        */
        _handle_for_t: function(args) {
            this._dds.t.setXConstraint(0,0);
            var newH = this._setHeight(args.e, true);
            var t = (newH - this._cache.height);
            this.resize(args.e, newH, 0, t, 0);
        },
        /** 
        * @description 마우스 event에 기반한 width를 계산한다.
        * @private
        * @method _setWidth
        * @param {Event} ev 마우스 event.
        * @param {boolean} flip 이동의 방향성 여부에 대한 argument
        * @return {Number} 새로운 값
        */
        _setWidth: function(ev, flip) {
            var xy = this._cache.xy[0],
            // w = this._cache.width,
                x = Event.getPageX(ev),
                nw = (x - xy);

                if (flip) {
                    nw = (xy - x) + parseInt(this.get('width'), 10);
                }
                
                nw = this._snapTick(nw, this.get('yTicks'));
                nw = this._checkWidth(nw);
            return nw;
        },
        /** 
        * @description maxWidth와 minWidth에 대하여 전달된 값을 체크한다.
        * @private
        * @method _checkWidth
        * @param {Number} w 체크할 width
        * @return {Number} 새로운 값
        */
        _checkWidth: function(w) {
            if (this.get('minWidth')) {
                if (w <= this.get('minWidth')) {
                    w = this.get('minWidth');
                }
            }
            if (this.get('maxWidth')) {
                if (w >= this.get('maxWidth')) {
                    w = this.get('maxWidth');
                }
            }
            return w;
        },
        /** 
        * @description maxHeight와 minHeight에 대하여 전달된 값을 체크한다.
        * @private
        * @method _checkHeight
        * @param {Number} h 체크할 height
        * @return {Number} The new value
        */
        _checkHeight: function(h) {
            if (this.get('minHeight')) {
                if (h <= this.get('minHeight')) {
                    h = this.get('minHeight');
                }
            }
            if (this.get('maxHeight')) {
                if (h >= this.get('maxHeight')) {
                    h = this.get('maxHeight');
                }
            }
            return h;
        },
        /** 
        * @description 마우스 event에 기반한 height를 계산한다.
        * @private
        * @method _setHeight
        * @param {Event} ev 마우스 event.
        * @param {boolean} flip 이동의 방향성 여부에 대한 argument
        * @return {Number} 새로운 값
        */
        _setHeight: function(ev, flip) {
            var xy = this._cache.xy[1],
//                h = this._cache.height,
                y = Event.getPageY(ev),
                nh = (y - xy);

                if (flip) {
                    nh = (xy - y) + parseInt(this.get('height'), 10);
                }
                nh = this._snapTick(nh, this.get('xTicks'));
                nh = this._checkHeight(nh);
                
            return nh;
        },
        /** 
        * @description 사용된 tick에 기반한 숫자를 조절한다.
        * @private
        * @method _snapTick
        * @param {Number} size tick에 대한 사이즈
        * @param {Number} pix The tick pixels.
        * @return {Number} 새로 snap된 위치
        */
        _snapTick: function(size, pix) {
            if (!size || !pix) {
                return size;
            }
            var _s = size;
            var _x = size % pix;
            if (_x > 0) {
                if (_x > (pix / 2)) {
                    _s = size + (pix - _x);
                } else {
                    _s = size - _x;
                }
            }
            return _s;
        },
        /** 
        * @description Resize 클래스의 초기화 method
        * @private
        * @method init
        */        
        init: function(p_oElement, p_oAttributes) {
            this._locked = false;
            this._cache = {
                xy: [],
                height: 0,
                width: 0,
                top: 0,
                left: 0,
                offsetHeight: 0,
                offsetWidth: 0,
                start: {
                    height: 0,
                    width: 0,
                    top: 0,
                    left: 0
                }
            };

            Resize.superclass.init.call(this, p_oElement, p_oAttributes);

            this.set('setSize', this.get('setSize'));

            if (p_oAttributes.height) {
                this.set('height', parseInt(p_oAttributes.height, 10));
            }
            if (p_oAttributes.width) {
                this.set('width', parseInt(p_oAttributes.width, 10));
            }
            
            var id = p_oElement;
            if (!Rui.isString(id)) {
                id = D.generateId(id);
            }
            Resize._instances[id] = this;

            this._active = false;
            
            this._createWrap();
            this._createProxy();
            this._createHandles();

        },
        /**
        * @description proxy에 대한 HTML 참조를 가져오며, proxy가 아닌 경우 null을 반환한다
        * @method getProxyEl.
        * @return {HTMLElement} The proxy element
        */      
        getProxyEl: function() {
            return this._proxy;
        },
        /**
        * @description wrap element에 대한 HTML 참조를 가져오며, warp되어 있지 않다면, 현재 element를 반환한다.
        * @method getWrapEl
        * @return {HTMLElement} The wrap element
        */      
        getWrapEl: function() {
            return this._wrap;
        },
        /**
        * @description status element에 대한 HTML 참조를 가져온다.
        * @method getStatusEl
        * @return {HTMLElement} The status element
        */      
        getStatusEl: function() {
            return this._status;
        },
        /**
        * @description 현재 활성화된 resize handle에 대한 HTML 참조를 가져온다.
        * @method getActiveHandleEl
        * @return {HTMLElement} 활성화된 handle element
        */      
        getActiveHandleEl: function() {
            return this._handles[this._currentHandle];
        },
        /**
        * @description 리사이즈 작업이 현재 element에 활성화 되어 있는지에 따라 true나 false를 반환한다.
        * @method isActive
        * @return {boolean}
        */      
        isActive: function() {
            return ((this._active) ? true : false);
        },
        /**
        * @description 리사이즈 가능한 element를 생성하기 위해 사용된 설정 attribute의 모든 것을 초기화 한다.
        * @private
        * @method initAttributes
        * @param {Object} attr 유틸리티를 생성하기 위해 사용된 설정 attribute의 집합을 명시하는 Object literal 
        */      
        initAttributes: function(attr) {
            Resize.superclass.initAttributes.call(this, attr);

            /**
            * @description 이 설정은 resize handle과 드래그 가능한 property에 대하여
            * LDragDrop 인스턴스에 전달될 것이다.
            * 이 property는 iframe과 다른 element들에 대하여 작업하기 위해서 resize를
            * 핸들링하고자 하는 경우 사용되어야 한다.
            * @attribute useShime
            * @type Boolean
            */
            this.setAttributeConfig('useShim', {
                value: ((attr.useShim === true) ? true : false),
                validator: Rui.isBoolean,
                method: function(u) {
                    for (var i in this._dds) {
                        if (Rui.hasOwnProperty(this._dds, i)) {
                            this._dds[i].useShim = u;
                        }
                    }
                    if (this.dd) {
                        this.dd.useShim = u;
                    }
                }
            });
            /**
            * @description 리사이즈된 element의 사이즈를 설정하며 false로 설정하면 element는 자동으로
            * 라사이즈 되지 않는다. resize event는 최종 사용자가 리사이즈 할수 있는 배열을 포함할 것이다.
            * 이 설정은 true 설정인 proxy와 false 설정인 animattion에서만 작동할 것이다.
            * @attribute setSize
            * @type Boolean
            */
            this.setAttributeConfig('setSize', {
                value: ((attr.setSize === false) ? false : true),
                validator: Rui.isBoolean
            });

            /**
            * @description element를 wrapping 한다.
            * @attribute wrap
            * @type Boolean
            */
            this.setAttributeConfig('wrap', {
                writeOnce: true,
                validator: Rui.isBoolean,
                value: attr.wrap || false
            });

            /**
            * @description 사용하기 위한 handle들(다음 조합의): 't', 'b', 'r', 'l', 'bl', 'br', 'tl', 'tr'. 기본값: ['r', 'b', 'br'].
            * 모든 바로 가기를 사용할 수 있다. 참고: 8방향의 리사이징은 absolute 위치인 element에 대하여 수행되어야 한다.
            * @attribute handles
            * @type Array
            */
            this.setAttributeConfig('handles', {
                writeOnce: true,
                value: attr.handles || ['r', 'b', 'br'],
                validator: function(handles) {
                    if (Rui.isString(handles) && handles.toLowerCase() == 'all') {
                        handles = ['t', 'b', 'r', 'l', 'bl', 'br', 'tl', 'tr'];
                    }
                    if (!Rui.isArray(handles)) {
                        handles = handles.replace(/, /g, ',');
                        handles = handles.split(',');
                    }
                    this._configs.handles.value = handles;
                }
            });

            /**
            * @description element의 width
            * @attribute width
            * @type Number
            */
            this.setAttributeConfig('width', {
                value: attr.width || parseInt(this.getStyle('width'), 10),
                validator: Rui.isNumber,
                method: function(width) {
                    width = parseInt(width, 10);
                    if (width > 0) {
                        if (this.get('setSize')) {
                            this.setStyle('width', width + 'px');
                        }
                        this._cache.width = width;
                        this._configs.width.value = width;
                    }
                }
            });

            /**
            * @description element의 height
            * @attribute height
            * @type Number
            */
            this.setAttributeConfig('height', {
                value: attr.height || parseInt(this.getStyle('height'), 10),
                validator: Rui.isNumber,
                method: function(height) {
                    height = parseInt(height, 10);
                    if (height > 0) {
                        if (this.get('setSize')) {
                            this.setStyle('height', height + 'px');
                        }
                        this._cache.height = height;
                        this._configs.height.value = height;
                    }
                }
            });

            /**
            * @description element의 최소 width
            * @attribute minWidth
            * @type Number
            */
            this.setAttributeConfig('minWidth', {
                value: attr.minWidth || 15,
                validator: Rui.isNumber
            });

            /**
            * @description element의 최소 height
            * @attribute minHeight
            * @type Number
            */
            this.setAttributeConfig('minHeight', {
                value: attr.minHeight || 15,
                validator: Rui.isNumber
            });

            /**
            * @description element의 최대 width
            * @attribute maxWidth
            * @type Number
            */
            this.setAttributeConfig('maxWidth', {
                value: attr.maxWidth || 10000,
                validator: Rui.isNumber
            });

            /**
            * @description element의 최대 height
            * @attribute maxHeight
            * @type Number
            */
            this.setAttributeConfig('maxHeight', {
                value: attr.maxHeight || 10000,
                validator: Rui.isNumber
            });

            /**
            * @description element의 최소 y 좌표
            * @attribute minY
            * @type Number
            */
            this.setAttributeConfig('minY', {
                value: attr.minY || false
            });

            /**
            * @description element의 최소 x 좌표
            * @attribute minX
            * @type Number
            */
            this.setAttributeConfig('minX', {
                value: attr.minX || false
            });
            /**
            * @description element의 최대 y 좌표
            * @attribute maxY
            * @type Number
            */
            this.setAttributeConfig('maxY', {
                value: attr.maxY || false
            });

            /**
            * @description element의 최대 x 좌표
            * @attribute maxX
            * @type Number
            */
            this.setAttributeConfig('maxX', {
                value: attr.maxX || false
            });

            /**
            * @description element를 리사이즈 하기 위해서 animation을 사용하여야 한다.(proxy를 사용하는 경우만 사용할 수 있음)
            * @attribute animate
            * @type Boolean
            */
            this.setAttributeConfig('animate', {
                value: attr.animate || false,
                validator: function(value) {
                    var ret = true;
                    if (!Rui.fx.LAnim) {
                        ret = false;
                    }
                    return ret;
                }               
            });

            /**
            * @description animation에 대해 적용하기 위한 LEasing.
            * @attribute animateEasing
            * @type Object
            */
            this.setAttributeConfig('animateEasing', {
                value: attr.animateEasing || function() {
                    var easing = false;
                    if (Rui.util.LEasing && Rui.util.LEasing.easeOut) {
                        easing = Rui.util.LEasing.easeOut;
                    }
                    return easing;
                }()
            });

            /**
            * @description The Duration to apply to the animation.
            * animation에 대해 적용하기 위한 Duration
            * @attribute animateDuration
            * @type Number
            */
            this.setAttributeConfig('animateDuration', {
                value: attr.animateDuration || 0.5
            });

            /**
            * @description 실제 element 대신 proxy element를 리사이즈 한다.
            * @attribute proxy
            * @type Boolean
            */
            this.setAttributeConfig('proxy', {
                value: attr.proxy || false,
                validator: Rui.isBoolean
            });

            /**
            * @description 리사이징할 때 element의 ratio를 유지한다.
            * @attribute ratio
            * @type Boolean
            */
            this.setAttributeConfig('ratio', {
                value: attr.ratio || false,
                validator: Rui.isBoolean
            });

            /**
            * @description 리사이즈 되는 element에 대한 불투명 필터를 적용한다.(proxy에서만 작동함)
            * @attribute ghost
            * @type Boolean
            */
            this.setAttributeConfig('ghost', {
                value: attr.ghost || false,
                validator: Rui.isBoolean
            });

            /**
            * @description element를 드래그 가능하게 만들기 위한 편의성 method
            * @attribute draggable
            * @type Boolean
            */
            this.setAttributeConfig('draggable', {
                value: attr.draggable || false,
                validator: Rui.isBoolean,
                method: function(dd) {
                    if (dd && this._wrap) {
                        this._setupDragDrop();
                    } else {
                        if (this.dd) {
                            D.removeClass(this._wrap, this.CSS_DRAG);
                            this.dd.unreg();
                        }
                    }
                }
            });

            /**
            * @description 마우스가 over 됐을때 handle만 보여준다.
            * @attribute hover
            * @type Boolean
            */
            this.setAttributeConfig('hover', {
                value: attr.hover || false,
                validator: Rui.isBoolean
            });

            /**
            * @description handle을 보여주지 않고, 사용자가 커서만 사용하게 한다.
            * @attribute hiddenHandles
            * @type Boolean
            */
            this.setAttributeConfig('hiddenHandles', {
                value: attr.hiddenHandles || false,
                validator: Rui.isBoolean
            });

            /**
            * @description 최대 사이즈 handle의 경우 대신 더 작은 handle을 사용한다.
            * @attribute knobHandles
            * @type Boolean
            */
            this.setAttributeConfig('knobHandles', {
                value: attr.knobHandles || false,
                validator: Rui.isBoolean
            });

            /**
            * @description 리사이즈할 span에 대한 x tick의 숫자
            * @attribute xTicks
            * @type Number or False
            */
            this.setAttributeConfig('xTicks', {
                value: attr.xTicks || false
            });

            /**
            * @description 리사이즈할 span에 대한 y tick의 숫자
            * @attribute yTicks
            * @type Number or False
            */
            this.setAttributeConfig('yTicks', {
                value: attr.yTicks || false
            });

            /**
            * @description resize의 상태(새로운 사이즈)를 보여준다.
            * @attribute status
            * @type Boolean
            */
            this.setAttributeConfig('status', {
                value: attr.status || false,
                validator: Rui.isBoolean
            });

            /**
            * @description 리사이즈하는 동안 shift 키를 사용하는 것은 ratio 설정을 토글할 것이다.
            * @attribute autoRatio
            * @type Boolean
            */
            this.setAttributeConfig('autoRatio', {
                value: attr.autoRatio || false,
                validator: Rui.isBoolean
            });

        },
        /**
        * @description resize object와 그것의 모든 element와 listner들을 없앤다. 
        * @method destroy
        */        
        destroy: function() {
            for (var h in this._handles) {
                if (Rui.hasOwnProperty(this._handles, h)) {
                    Event.purgeElement(this._handles[h]);
                    this._handles[h].parentNode.removeChild(this._handles[h]);
                }
            }
            if (this._proxy) {
                this._proxy.parentNode.removeChild(this._proxy);
            }
            if (this._status) {
                this._status.parentNode.removeChild(this._status);
            }
            if (this.dd) {
                this.dd.unreg();
                D.removeClass(this._wrap, this.CSS_DRAG);
            }
            if (this._wrap != this.get('element')) {
                this.setStyle('position', '');
                this.setStyle('top', '');
                this.setStyle('left', '');
                this._wrap.parentNode.replaceChild(this.get('element'), this._wrap);
            }
            this.removeClass(this.CSS_RESIZE);

            delete Rui.util.LResize._instances[this.get('id')];
            //Brutal Object Destroy
            for (var i in this) {
                if (Rui.hasOwnProperty(this, i)) {
                    this[i] = null;
                    delete this[i];
                }
            }
        },
        /**
        * @description Resize object를 표한하는 문자열을 반환한다.
        * @method toString
        * @return {String}
        */        
        toString: function() {
            if (this.get) {
                return 'Resize (#' + this.get('id') + ')';
            }
            return 'Resize Utility';
        }
    });

    Rui.util.LResize = Resize;
 
    /**
    * @description <a href="Rui.dd.LDragDrop.html">Rui.dd.LDragDrop</a> dragEvent가 드래그 가능한 설정 옵션에 대해 발생되었을때 발생하는 event
    * @event dragEvent
    * @type Rui.util.LCustomEvent
    */
    /**
    * @description resize 액션이 시작되었을때 발생하는 event
    * @event startResize
    * @type Rui.util.LCustomEvent
    */
    /**
    * @description 드래그 인스턴스로부터의 mouseUp event가 발생했을때 발생하는 event
    * @event endResize
    * @type Rui.util.LCustomEvent
    */
    /**
    * @description 모든 element 리사이즈에 발생하는 event(proxy 설정 세팅에 사용될때 오직 한번만 발생함)
    * @event resize
    * @type Rui.util.LCustomEvent
    */
    /**
    * @description 모든 element 리사이즈 이전 및 사이즈 계산 후에 발생하며, 리사이즈가 중단될때 false를 반환하는 event
    * @event beforeResize
    * @type Rui.util.LCustomEvent
    */
    /**
    * @description 모든 proxy 리사이즈에 발생하는 event(proxy 설정 세팅에 사용될때만 발생함)
    * @event proxyResize
    * @type Rui.util.LCustomEvent
    */

})();
