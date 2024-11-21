/*
 * @(#) LResize.js
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

(function() {
    var D = Rui.util.LDom,
        Event = Rui.util.LEvent;
    var Resize = function(config) {
        config = config || {};
        Resize.superclass.constructor.call(this, config.el, config.attributes);
    };
    Resize._instances = {};
    Resize.getResizeById = function(id) {
        if (Resize._instances[id]) {
            return Resize._instances[id];
        }
        return false;
    };
    Rui.extend(Resize, Rui.LElement, {
        otype: 'Rui.util.LResize',
        CSS_RESIZE: 'L-resize',
        CSS_DRAG: 'L-draggable',
        CSS_HOVER: 'L-resize-hover',
        CSS_PROXY: 'L-resize-proxy',
        CSS_WRAP: 'L-resize-wrap',
        CSS_KNOB: 'L-resize-knob',
        CSS_HIDDEN: 'L-resize-hidden',
        CSS_HANDLE: 'L-resize-handle',
        CSS_STATUS: 'L-resize-status',
        CSS_GHOST: 'L-resize-ghost',
        CSS_RESIZING: 'L-resize-resizing',
        _resizeEvent: null,
        dd: null,
        browser: Rui.browser,
        _locked: null,
        _positioned: null,
        _dds: null,
        _wrap: null,
        _proxy: null,
        _handles: null,
        _currentHandle: null,
        _currentDD: null,
        _cache: null,
        _active: null,
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
        _createWrap: function() {
            this._positioned = false;
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
        _setupDragDrop: function() {
            D.addClass(this._wrap, this.CSS_DRAG);
            this.dd = new Rui.dd.LDD(this._wrap, this.get('id') + '-resize', { dragOnly: true, useShim: this.get('useShim') });
            this.dd.on('dragEvent', function() {
                this.fireEvent('dragEvent', arguments);
            }, this, true);
        },
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
        _ieSelectFix: function() {
            return false;
        },
        _ieSelectBack: null,
        _setAutoRatio: function(ev) {
            if (this.get('autoRatio')) {
                if (ev && ev.shiftKey) {
                    this.set('ratio', true);
                } else {
                    this.set('ratio', this._configs.ratio._initialConfig.value);
                }
            }
        },
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
        _handleMouseOver: function(ev) {
            if (this._locked) {
                return false;
            }
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
            D.addClass(this._wrap, this.CSS_RESIZE);
        },
        _handleMouseOut: function(ev) {
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
            D.addClass(this._wrap, this.CSS_RESIZE);
        },
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
        _setRatio: function(h, w, t, l) {
            var oh = h, ow = w;
            if (this.get('ratio')) {
                var nh = parseInt(this.get('height'), 10),
                    nw = parseInt(this.get('width'), 10),
                    maxH = this.get('maxHeight'),
                    minH = this.get('minHeight');
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
        lock: function(dd) {
            this._locked = true;
            if (dd && this.dd) {
                D.removeClass(this._wrap, 'L-draggable');
                this.dd.lock();
            }
            return this;
        },
        unlock: function(dd) {
            this._locked = false;
            if (dd && this.dd) {
                D.addClass(this._wrap, 'L-draggable');
                this.dd.unlock();
            }
            return this;
        },
        isLocked: function() {
            return this._locked;
        },
        reset: function() {
            this.resize(null, this._cache.start.height, this._cache.start.width, this._cache.start.top, this._cache.start.left, true);
            return this;
        },
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
                t = D.getY(el);
            }
            if (l == 0) {
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
        _handle_for_br: function(args) {
            var newW = this._setWidth(args.e);
            var newH = this._setHeight(args.e);
            this.resize(args.e, (newH + 1), newW, 0, 0);
        },
        _handle_for_bl: function(args) {
            var newW = this._setWidth(args.e, true);
            var newH = this._setHeight(args.e);
            var l = (newW - this._cache.width);
            this.resize(args.e, newH, newW, 0, l);
        },
        _handle_for_tl: function(args) {
            var newW = this._setWidth(args.e, true);
            var newH = this._setHeight(args.e, true);
            var t = (newH - this._cache.height);
            var l = (newW - this._cache.width);
            this.resize(args.e, newH, newW, t, l);
        },
        _handle_for_tr: function(args) {
            var newW = this._setWidth(args.e);
            var newH = this._setHeight(args.e, true);
            var t = (newH - this._cache.height);
            this.resize(args.e, newH, newW, t, 0);
        },
        _handle_for_r: function(args) {
            this._dds.r.setYConstraint(0,0);
            var newW = this._setWidth(args.e);
            this.resize(args.e, 0, newW, 0, 0);
        },
        _handle_for_l: function(args) {
            this._dds.l.setYConstraint(0,0);
            var newW = this._setWidth(args.e, true);
            var l = (newW - this._cache.width);
            this.resize(args.e, 0, newW, 0, l);
        },
        _handle_for_b: function(args) {
            this._dds.b.setXConstraint(0,0);
            var newH = this._setHeight(args.e);
            this.resize(args.e, newH, 0, 0, 0);
        },
        _handle_for_t: function(args) {
            this._dds.t.setXConstraint(0,0);
            var newH = this._setHeight(args.e, true);
            var t = (newH - this._cache.height);
            this.resize(args.e, newH, 0, t, 0);
        },
        _setWidth: function(ev, flip) {
            var xy = this._cache.xy[0],
                x = Event.getPageX(ev),
                nw = (x - xy);
                if (flip) {
                    nw = (xy - x) + parseInt(this.get('width'), 10);
                }
                nw = this._snapTick(nw, this.get('yTicks'));
                nw = this._checkWidth(nw);
            return nw;
        },
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
        _setHeight: function(ev, flip) {
            var xy = this._cache.xy[1],
                y = Event.getPageY(ev),
                nh = (y - xy);
                if (flip) {
                    nh = (xy - y) + parseInt(this.get('height'), 10);
                }
                nh = this._snapTick(nh, this.get('xTicks'));
                nh = this._checkHeight(nh);
            return nh;
        },
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
        getProxyEl: function() {
            return this._proxy;
        },
        getWrapEl: function() {
            return this._wrap;
        },
        getStatusEl: function() {
            return this._status;
        },
        getActiveHandleEl: function() {
            return this._handles[this._currentHandle];
        },
        isActive: function() {
            return ((this._active) ? true : false);
        },
        initAttributes: function(attr) {
            Resize.superclass.initAttributes.call(this, attr);
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
            this.setAttributeConfig('setSize', {
                value: ((attr.setSize === false) ? false : true),
                validator: Rui.isBoolean
            });
            this.setAttributeConfig('wrap', {
                writeOnce: true,
                validator: Rui.isBoolean,
                value: attr.wrap || false
            });
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
            this.setAttributeConfig('minWidth', {
                value: attr.minWidth || 15,
                validator: Rui.isNumber
            });
            this.setAttributeConfig('minHeight', {
                value: attr.minHeight || 15,
                validator: Rui.isNumber
            });
            this.setAttributeConfig('maxWidth', {
                value: attr.maxWidth || 10000,
                validator: Rui.isNumber
            });
            this.setAttributeConfig('maxHeight', {
                value: attr.maxHeight || 10000,
                validator: Rui.isNumber
            });
            this.setAttributeConfig('minY', {
                value: attr.minY || false
            });
            this.setAttributeConfig('minX', {
                value: attr.minX || false
            });
            this.setAttributeConfig('maxY', {
                value: attr.maxY || false
            });
            this.setAttributeConfig('maxX', {
                value: attr.maxX || false
            });
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
            this.setAttributeConfig('animateEasing', {
                value: attr.animateEasing || function() {
                    var easing = false;
                    if (Rui.util.LEasing && Rui.util.LEasing.easeOut) {
                        easing = Rui.util.LEasing.easeOut;
                    }
                    return easing;
                }()
            });
            this.setAttributeConfig('animateDuration', {
                value: attr.animateDuration || 0.5
            });
            this.setAttributeConfig('proxy', {
                value: attr.proxy || false,
                validator: Rui.isBoolean
            });
            this.setAttributeConfig('ratio', {
                value: attr.ratio || false,
                validator: Rui.isBoolean
            });
            this.setAttributeConfig('ghost', {
                value: attr.ghost || false,
                validator: Rui.isBoolean
            });
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
            this.setAttributeConfig('hover', {
                value: attr.hover || false,
                validator: Rui.isBoolean
            });
            this.setAttributeConfig('hiddenHandles', {
                value: attr.hiddenHandles || false,
                validator: Rui.isBoolean
            });
            this.setAttributeConfig('knobHandles', {
                value: attr.knobHandles || false,
                validator: Rui.isBoolean
            });
            this.setAttributeConfig('xTicks', {
                value: attr.xTicks || false
            });
            this.setAttributeConfig('yTicks', {
                value: attr.yTicks || false
            });
            this.setAttributeConfig('status', {
                value: attr.status || false,
                validator: Rui.isBoolean
            });
            this.setAttributeConfig('autoRatio', {
                value: attr.autoRatio || false,
                validator: Rui.isBoolean
            });
        },
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
            for (var i in this) {
                if (Rui.hasOwnProperty(this, i)) {
                    this[i] = null;
                    delete this[i];
                }
            }
        },
        toString: function() {
            if (this.get) {
                return 'Resize (#' + this.get('id') + ')';
            }
            return 'Resize Utility';
        }
    });
    Rui.util.LResize = Resize;
})();
