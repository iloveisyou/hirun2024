/*
 * @(#) rui_core.js
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

(function(){
    Rui.later = function(when, o, fn, data, periodic) {
        when = when || 0; 
        o = o || {};
        var m=fn, d=data, f, r;
        if (Rui.isString(fn)) {
            m = o[fn];
        }
        if (!m) {
            throw new TypeError("method undefined");
        }
        if (!Rui.isArray(d)) {
            d = [data];
        }
        f = function() {
            m.apply(o, d);
        };
        r = (periodic) ? setInterval(f, when) : setTimeout(f, when);
        return {
            interval: periodic,
            cancel: function() {
                if (this.interval) {
                    clearInterval(r);
                } else {
                    clearTimeout(r);
                }
            }
        };
    };
    Rui.isValue = function(o) {
        return (Rui.isObject(o) || Rui.isString(o) || Rui.isNumber(o) || Rui.isBoolean(o));
    };
    Rui.getConfig = function(isNew) {
        isNew = isNew && isNew == true ? true : false;
        if(Rui.isUndefined(this._configuration) || isNew) {
            this._configuration = Rui.config.LConfiguration.getInstance();
        }
        return this._configuration;
    },
    Rui.getMessageManager = function(config, isNew) {
        this._messageManager = isNew ? undefined : this._messageManager;
        if(Rui.isUndefined(this._messageManager)) {
            this._messageManager = new Rui.message.LMessageManager(config);
        }
        return this._messageManager;
    },
    Rui.includeJs = function(jsFile, sync) {
        var oHead = document.getElementsByTagName('head')[0];
        var isInclude = false;
        var newJsFile = jsFile;
        newJsFile = Rui.util.LString.startsWith(newJsFile, "./") ? newJsFile.substring(1) : newJsFile;
        var fullUrl = location.host + newJsFile;
        var childNodes = oHead.childNodes;
        for (var i = 0 ; i < childNodes.length; i++) {
            var headNode = childNodes[i]; 
            if(headNode){
                var currentSrc = headNode.syncSrc || headNode.src;
                if(currentSrc == fullUrl) {
                    isInclude = true;
                    break;
                }
            }
        }
        if (isInclude == false) {
            var oScript = document.createElement('script');
            oScript.type = 'text/javascript';
            if(sync || sync == true) {
                var o = Rui.LConnect.getConnectionObject();
                o.conn.open('GET', jsFile, false);
                o.conn.send(null);
                oScript.text = o.conn.responseText;
                oScript.syncSrc = fullUrl;
            } else {
                oScript.src = jsFile;
            }
            oHead.appendChild(oScript);
        }
    },
    Rui.includeCss = function(cssFile, charset, sync) {
        charset = Rui.isUndefined(charset) ? Rui.getConfig().get('$.core.css.charset')[0] : charset; 
        var oHead = document.getElementsByTagName('head')[0];
        var isInclude = false;
        for (var i = 0 ; i < oHead.childNodes.length; i++) {
            if(oHead.childNodes && oHead.childNodes[i].href && oHead.childNodes[i].href == location.host + cssFile)
                isInclude = true;
        }
        if(isInclude == false) {
        	if(sync) {
        		Rui.ajax({
        			url: cssFile,
        			success: function(e) {
                        var oLink = document.createElement('style');
                		oLink.textContent = e.responseText;
                        oHead.appendChild(oLink);
        			},
        			failure: function(e) {
        				throw new Error(e.responseText);
        			},
        			sync: true
        		});
        	} else {
                var oLink = document.createElement('link');
                oLink.rel = 'stylesheet';
                oLink.type = 'text/css';
                oLink.charset = charset;
                oLink.href = cssFile;
                oHead.appendChild(oLink);
        	}
        }
    };
    Rui.urlParams = function() {
        var url = document.location + '';
        var params = {};
        var idx = url.indexOf('?');
        if(idx > 0) {
            var queryString = url.substring(idx + 1);
            var paramList = queryString.split('&');
            for (var i = 0 ; i < paramList.length; i++) {
                var param = paramList[i].split('=');
                if(param.length > 1)
                    params[param[0]] = param[1];
            }
        }
        return params;
    };
    Rui.onResize = function(fn, firstFireEvent) {
    	if(firstFireEvent === true) {
    		fn.call(window);
    		setTimeout(function() {
                Rui.util.LEvent.addListener(window, 'resize', fn);
    		}, 1000);
    	} else Rui.util.LEvent.addListener(window, 'resize', fn);
    };
    Rui.log = function(msg, cat, src) {
        var l = null;
        try {
            if(Rui.debugWin) {
                l = Rui.debugWin;
            }
            if(l && l.log) {
                if(cat && typeof cat == 'object') {
                    src = cat.src;
                    cat = cat.cat;
                }
                return l.log(msg, cat, src);
            } else {
                var isLogging = false;
                cat = cat || 'debug';
                var catCode = cat.substring(0, 2).toUpperCase();
                if(catCode !== 'ER') {
                    if((Rui.isDebugIN && catCode == 'IN') ||
                    (Rui.isDebugWA && catCode == 'WA') ||
                    (Rui.isDebugTI && catCode == 'TI') ||
                    (Rui.isDebugWI && catCode == 'WI') ||
                    (Rui.isDebugEV && catCode == 'EV') ||
                    (Rui.isDebugCR && catCode == 'CR') ||
                    (Rui.isDebugXH && catCode == 'XH')) {
                        isLogging = true;
                    } else if(catCode == 'DV')
                        isLogging = true;
                } else if(catCode == 'ER') 
                    isLogging = true;
                if(isLogging) {
                    this.logList = this.logList || [];
                    this.logList.push({ id: Rui.id(), time: new Date(), msg:msg, cat:cat, src:src });
                }
                if(console) {
                    if(!isLogging || catCode == 'ER') 
                        try {
                            console.log(msg);
                        } catch(e1) {}
                }
                return isLogging;
            }
        } catch(e){};
    };
    Rui.activeTimeDebugger = function(time) {
        time = time || 0;
        Rui._activeTime = new Date().getTime();
        Rui._activeTime = Rui._activeTime + time;
    };
    Rui.timeDebugger = function() {
        if(Rui._activeTime && Rui._activeTime < new Date().getTime()) 
            debugger;
    };
    Rui.updateLog = function(message, filename, lineno){
        var l=null;
        try {
            var msg = message.replace('Uncaught TypeError: ', '');
            if(Rui.debugWin) {
                l=Rui.debugWin;
            }
            if (l && l.log) {
                l.updateLog(msg, filename, lineno);
            } else {
                this.logList = this.logList || [];
                for (var i = this.logList.length - 1; i >= 0 ; i--) {
                    var data = this.logList[i];
                    if(data.cat == 'error' && data.msg == msg) {
                        data.msg = 'filename : ' + filename + '\r\nlineno : ' + lineno + '\r\nmessage : ' + data.msg;
                    }
                }
            }
        } catch(e) {};
    };
    Rui.useAccessibility = function() {
        if(!Rui.getConfig) return false;
        if(Rui.isUndefined(Rui._useAria))
            Rui._useAria = Rui.getConfig().getFirst('$.core.useAccessibility') === true;
        return Rui._useAria;
    };
    Rui.rightToLeft = function() {
        if(!Rui.getConfig) return false;
        if(Rui.isUndefined(Rui._useRtl))
            Rui._useRtl = Rui.getConfig().getFirst('$.core.rightToLeft') === true;
        return Rui._useRtl;
    };
    Rui.useFixedId = function() {
        if(!Rui.getConfig) return false;
        if(Rui.isUndefined(Rui._useFixedId))
            Rui._useFixedId = Rui.getConfig().getFirst('$.core.useFixedId') === true;
        return Rui._useFixedId;
    };
    Rui.getRootPath = function() {
    	var ruiPath = Rui.getConfig().getFirst('$.core.contextPath') + Rui.getConfig().getFirst('$.core.ruiRootPath');
    	return ruiPath;
    },
    Rui.devGuide = function(scope, methodName, params) {
        if(!this._webStore) this._webStore = new Rui.webdb.LWebStorage();
        if(Rui.getConfig().getProvider().isLoad()) {
            if(Rui.isUndefined(Rui._devGuide))
                Rui._devGuide = Rui.getConfig().getFirst('$.core.debug.notice');
            if(Rui._devGuide === true) {
                if(!Rui._guide) {
                    var ruiPath = Rui.getRootPath();
                    Rui.includeJs(ruiPath + '/js/rui_dev-guide.js', true);
                    Rui._guide = new Rui.dev.LGuide();
                }
                var fn = Rui._guide[methodName];
                if(fn) {
                    fn.call(Rui._guide, scope, params);
                } else {
                    alert(methodName + ' method name is wrong');
                }
            }
        }
    };
    Rui.checkLicense = function() {
        var isLCL = false;
        var isExpired = false;
        var isPLCL = false;
        var isExistPC = false;
        if(!Rui.isUndefined(Rui.License)) {
            var ruiPath = Rui.getRootPath();
            Rui.includeJs(ruiPath + '/resources/ext/jsrsasign-all-min.js', true);
            if(!Rui.isUndefined(Rui.PK)){
                var pKey = KEYUTIL.getKey({ n: Rui.PK.n, e: Rui.PK.ex });           
                var flag = Rui.LBase64.decode(Rui.PK.u.v);
                if(flag == 'true' &&  pKey.verify(flag, Rui.PK.u.ss)){
                    var today = Rui.util.LFormat.dateToString(new Date(), {
                        format: '%Y-%m-%d'
                    });
                    var sDate = Rui.LBase64.decode(Rui.PK.s.v);
                    var eDate = Rui.LBase64.decode(Rui.PK.e.v);
                    if(sDate <= today && eDate >= today && pKey.verify(sDate, Rui.PK.s.ss) && pKey.verify(eDate, Rui.PK.e.ss)){
                        var keys = Rui.LBase64.decode(Rui.License).split(';');
                        var sMsg = Rui.LBase64.decode(Rui.License);
                        if(pKey.verify(sMsg, Rui.PK.ss)){
                            for (var i = 0 ; i < keys.length ; i++) {
                                if(keys[i].toLowerCase() == document.domain.toLowerCase()) {
                                    isLCL = true;
                                    break;
                                }
                            }
                        }
                    }else if(eDate < today){
                        isExpired = true;
                    }
                }
                if(!Rui.isUndefined(Rui.ui) && !Rui.isUndefined(Rui.ui.pivot)) isExistPC = true;
                if( isExistPC ){
                    if(!Rui.isUndefined(Rui.PK.f.LPivot) && pKey.verify('LPivot', Rui.PK.f.LPivot)){
                        isPLCL = true;
                    } 
                }
            }          
        }
        if( isLCL === false || (isPLCL === false && isExistPC === true) ) {
            var height = Rui.util.LDom.getViewportHeight();
            var width = Rui.util.LDom.getViewportWidth();
            var lclDiv = document.createElement('div');
            lclDiv.id = Rui.useFixedId() ? Rui.id(this.el, 'L-License-div') : Rui.id();
            lclDiv.className = 'L-lcl-container';
            lclDiv.style.position = 'absolute';
            lclDiv.style.top = '0px';
            lclDiv.style.padding = '3px';
            lclDiv.style.zIndex = 1;
            lclDiv.style.left = (width / 2 - 140) + 'px';
            Rui.get(lclDiv).on('click', function() {this.hide()});
            var LCMsg = isLCL ? '' : 'DevOn RUI';
            var PLCMsg = (!isExistPC || isPLCL) ? '' : 'DevOn RUI Pivot';
            var isBoth = (!isLCL && (!isPLCL && isExistPC)) ? ' & ' : '';
            var ExMsg = isExpired ? '<br>해당 라이선스는 만료되었습니다.' : '';
            lclDiv.innerHTML = LCMsg + isBoth + PLCMsg + ' 라이선스가 트라이얼 버전입니다.' + ExMsg + '<br>라이선스 요청 : devon@lgcns.com' + '<br>라이선스 이외 문의는 시스템 담당자에게 문의하세요.';
            try { document.body.appendChild(lclDiv); } catch(e) {}
        }
    };
    Rui.browserRecommend = function(){
        if(Rui.getConfig().getFirst('$.ext.browser.recommend') === true && Rui.browser.msie678) {
            var webStore = new Rui.webdb.LWebStorage();
            var recommend = webStore.getInt('recommend', 0);
            if(recommend < Rui.getConfig().getFirst('$.ext.browser.recommendCount')) {
                webStore.set('recommend', ++recommend);
                var msg = Rui.getMessageManager().get('$.ext.msg016');
                var html = '<div id="unsupported_browser_version" style="position:absolute;top:0;background-color:rgb(248,198,34);width:100%;z-index:2;"><p style="line-height:31px;color:#017ace;margin-left:auto;margin-right:auto;width:1000px;">' + msg + '</p></div>';
                Rui.getBody().appendChild(Rui.createElements(html));
                Rui.later(5000, this, function() {
                    Rui.select('#unsupported_browser_version').hide();
                });
            }
        }
    }
    Rui.noticeDebug = function(){
        if(Rui.getConfig().getFirst('$.core.debug.notice') === true) {
            var servers = Rui.getConfig().getFirst('$.core.debug.servers');
            var isServer = false;
            for (var i = 0 ; i < servers.length ; i++) {
                if(servers[i] == document.domain) {
                    isServer = true;
                    break;
                }
            }
            if(isServer) {
                var ruiPath = Rui.getRootPath();
                Rui.includeJs(ruiPath + '/js/rui_dev-guide.js', true);
                if(!Rui._guide) Rui._guide = new Rui.dev.LGuide();
                var html = '<a href="' + (ruiPath + '/plugins/debug/console.html') + '" target="_new"><div class="L-developer-guide L-hidden" style="position:absolute;top:10px;right:10px;padding:2px;background-color:rgb(248,198,34);width:50px;height:25px;color:#017ace;font-size:12px;z-index:10000;"></div></a>';
                Rui.getBody().appendChild(Rui.createElements(html));
                Rui.later(5000, this, function() {
                    if(Rui._guide.isNotice && (Rui._guide.warnCount || Rui._guide.infoCount)) {
                        Rui.select('.L-developer-guide').removeClass('L-hidden').html('<font color="red" title="개발 위험도">Warn: ' + Rui._guide.warnCount + '</font><br>&nbsp;<font color="black"  title="개발 정보">Info : ' + Rui._guide.infoCount + '</font>');
                    }
                }, null, true);
                setTimeout(function(){
                }, 3000);
            }
        }
    }
    var r = null;
    var bodyReady = function() {
    	if(!Rui.config || !Rui.config.ConfigData) {
    		return;
    	}
    	clearInterval(r);
        Rui.checkLicense();
        Rui.browserRecommend();
    };
    r = setInterval(bodyReady, 2000);
    Rui.isDebugER = true;
    Rui.fwType = 'vp-pc';
})();
(function() {
    var Dom = Rui.util.LDom;
    Rui.applyObject(Rui.LElement.prototype, {
        autoBoxAdjust: true,
        defaultUnit: 'px',
        CSS_ELEMENT_DISABLED: 'L-disabled',
        CSS_ELEMENT_INVALID: 'L-invalid',
        CSS_ELEMENT_REPAINT: 'L-repaint',
        CSS_ELEMENT_MASKED: 'L-masked',
        CSS_ELEMENT_MASKED_PANEL: 'L-masked-panel',
        removeChild: function(child) {
            child = child.dom ? child.dom : child.get ? child.get('element') : child;
            return this.get('element').removeChild(child);
        },
        replaceClass: function(oldClassName, newClassName) {
            return Dom.replaceClass(this.dom,
                    oldClassName, newClassName);
        },
        toggleClass: function(className) {
            return this.hasClass(className) ? this.removeClass(className) : this.addClass(className);
        },
        applyStyles: function(styles){
            Rui.util.LDom.applyStyles(this, styles);
            return this;
        },
        getXY: function() {
            return Dom.getXY(this.dom);
        },
        setXY: function(pos, noRetry) {
            Dom.setXY(this.dom, pos, noRetry);
            return this;
        },
        getX: function() {
            return Dom.getX(this.dom);
        },
        setX: function(x) {
            Dom.setX(this.dom, x);
            return this;
        },
        getY: function() {
            return Dom.getY(this.dom);
        },
        setY: function(y) {
            Dom.setY(this.dom, y);
            return this;
        },
        moveTo: function(x, y, anim){
            if(anim) {
                if(anim === true)
                    anim = { points: { to: [x, y] } };
                anim = Rui.applyIf(anim, { type: 'LMotionAnim' });
            }
            var currAnim = this.getAnimation(anim, this.dom.id);
            (currAnim != null) ? currAnim.animate() : this.setXY([x, y]);
            return this;
        },
        animate: function(anim) {
            anim.type = anim.type || 'LMotionAnim';
            var currAnim = this.getAnimation(anim, this.dom.id);
            if (currAnim != null) {
                if (anim.delay) {
                    Rui.util.LFunction.defer(function(){
                        if (anim.onStart) currAnim.on('start', anim.onStart, this, true);
                        currAnim.animate();
                    }, anim.delay, this);
                }
                else {
                    if (anim.onStart) currAnim.on('start', anim.onStart, this, true);
                    currAnim.animate();
                }
            }
            return this;
        },
        addUnits: function(v, defaultUnit){
            if(v === '' || v == 'auto'){
                return v;
            }
            if(v === undefined){
                return '';
            }
            if(typeof v == 'number' || !El.unitPattern.test(v)){
                return v + (defaultUnit || 'px');
            }
            return v;
        },
        setLeft: function(left){
            this.setStyle('left', this.addUnits(left));
            return this;
        },
        setTop: function(top){
            this.setStyle('top', this.addUnits(top));
            return this;
        },
        setRight: function(right){
            this.setStyle('right', this.addUnits(right));
            return this;
        },
        setBottom: function(bottom){
            this.setStyle('bottom', this.addUnits(bottom));
            return this;
        },
        setSize: function(width, height, anim) {
            if(anim) {
                if(anim === true)
                    anim = { width: { to: width }, height: { to: height } };
                anim = Rui.applyIf(anim, { type: 'LAnim' });
            }
            var currAnim = this.getAnimation(anim, this.dom.id);
            if (currAnim != null) {
                currAnim.animate();
            } else {
                this.setWidth(width);
                this.setHeight(height);
            }
        },
        getLeft: function(local){
            return !local ? this.getX() : parseInt(this.getStyle('left'), 10) || 0;
        },
        getRight: function(local){
            return !local ? this.getX() + this.getWidth() : (this.getLeft(true) + this.getWidth()) || 0;
        },
        getTop: function(local) {
            return !local ? this.getY() : parseInt(this.getStyle('top'), 10) || 0;
        },
        getBottom: function(local){
            return !local ? this.getY() + this.getHeight() : (this.getTop(true) + this.getHeight()) || 0;
        },
        setAttributes: function(map, silent){
            var el = this.get('element');
            for (var key in map) {
                if ( !this._configs[key] && !Rui.isUndefined(el[key]) ) {
                    this.setAttributeConfig(key);
                }
            }
            for (var i = 0, len = this._configOrder.length; i < len; ++i) {
                if (map[this._configOrder[i]] !== undefined) {
                    this.set(this._configOrder[i], map[this._configOrder[i]], silent);
                }
            }
        },
        clip: function(){
            if(!this.isClipped){
               this.isClipped = true;
               this.originalClip = {
                   o: this.getStyle('overflow'),
                   x: this.getStyle('overflow-x'),
                   y: this.getStyle('overflow-y')
               };
               this.setStyle('overflow', 'hidden');
               this.setStyle('overflow-x', 'hidden');
               this.setStyle('overflow-y', 'hidden');
            }
            return this;
        },
        unclip: function(){
            if(this.isClipped){
                this.isClipped = false;
                var o = this.originalClip;
                if(o.o){this.setStyle('overflow', o.o);}
                if(o.x){this.setStyle('overflow-x', o.x);}
                if(o.y){this.setStyle('overflow-y', o.y);}
            }
            return this;
        },
        repaint: function() {
            var thisObj = this;
            if(!thisObj.hasClass(thisObj.CSS_ELEMENT_REPAINT))
             thisObj.addClass(thisObj.CSS_ELEMENT_REPAINT);
             setTimeout(Rui.util.LFunction.createDelegate(function() {
                thisObj.removeClass(thisObj.CSS_ELEMENT_REPAINT);
             }, thisObj), 1);
             return thisObj;
        },
        alignTo: function(element, position, offsets){
            this.setXY(this.getAlignToXY(element, position, offsets));
            return this;
        },
        getAnchorXY: function(anchor, local, s){
            anchor = (anchor || 'tl').toLowerCase();
            s = s || {};
            var vp = this.dom == document.body || this.dom == document;
            var w = s.width || vp ? Rui.util.LDom.getViewportWidth() : this.getWidth();
            var h = s.height || vp ? Rui.util.LDom.getViewportHeight() : this.getHeight();
            var xy;
            var r = Math.round;
            var o = this.getXY();
            var scroll = this.getScroll();
            var extraX = vp ? scroll.left : !local ? o[0] : 0;
            var extraY = vp ? scroll.top : !local ? o[1] : 0;
            var hash = {
                c: [r(w * 0.5), r(h * 0.5)],
                t: [r(w * 0.5), 0],
                l: [0, r(h * 0.5)],
                r: [w, r(h * 0.5)],
                b: [r(w * 0.5), h],
                tl: [0, 0],
                bl: [0, h],
                br: [w, h],
                tr: [w, 0]
            };
            xy = hash[anchor];
            return [xy[0] + extraX, xy[1] + extraY];
        },
        getAlignToXY: function(el, p, o){
            el = Rui.get(el);
            if(!el || !el.dom)
                throw "LElement.alignToXY with an element that doesn't exist";
            o = o || [0,0];
            p = (p == '?' ? 'tl-bl?' : (!/-/.test(p) && p !== '' ? 'tl-' + p  :  p || 'tl-bl')).toLowerCase();
            var dw = Rui.util.LDom.getViewportWidth() -10, 
                dh = Rui.util.LDom.getViewportHeight()-10; 
            var p1y, p1x, p2y, p2x, swapY, swapX;
            var doc = document, docElement = doc.documentElement, docBody = doc.body;
            var scrollX = (docElement.scrollLeft || (docBody && docBody.scrollLeft) || 0)+5;
            var scrollY = (docElement.scrollTop || (docBody && docBody.scrollTop) || 0)+5;
            var m = p.match(/^([a-z]+)-([a-z]+)(\?)?$/);
            if(!m)
               throw 'LElement.alignTo with an invalid alignment ' + p;
            p2 = m[2];
            p1 = m[1];
            c = !!m[3];
            a2 = el.getAnchorXY(p2, false);
            a1 = this.getAnchorXY(p1, true);
            x = a2[0] - a1[0] + o[0];
            y = a2[1] - a1[1] + o[1];
            if(c){
               h = this.getHeight();
               w = this.getWidth();
               r = el.getRegion();
               p2y = p2.charAt(0);
               p2x = p2.charAt(p2.length-1);
               p1y = p1.charAt(0);
               p1x = p1.charAt(p1.length-1);
               swapX = ( (p1x=='r' && p2x=='l') || (p1x=='l' && p2x=='r') );
               swapY = ( (p1y=='t' && p2y=='b') || (p1y=='b' && p2y=='t') );
               if (x + w > dw + scrollX)
                    x = swapX ? r.left-w : dw+scrollX-w;
               if (x < scrollX)
                   x = swapX ? r.right : scrollX;
               if (y + h > dh + scrollY)
                    y = swapY ? r.top-h : dh+scrollY-h;
               if (y < scrollY)
                   y = swapY ? r.bottom : scrollY;
            }
            return [x,y];
        },
        center: function(centerIn){
            this.alignTo(centerIn || document, 'c-c');
            return this;
        },
        getScroll: function(){
            var d = this.dom,
                doc = document,
                body = doc.body,
                docElement = doc.documentElement,
                l,
                t,
                ret;
            if(d == doc || d == body){
                if(Rui.browser.msie && Rui.isStrict){
                    l = docElement.scrollLeft;
                    t = docElement.scrollTop;
                }else{
                    l = window.pageXOffset;
                    t = window.pageYOffset;
                }
                ret = {left: l || (body ? body.scrollLeft : 0), top: t || (body ? body.scrollTop : 0)};
            }else{
                ret = {left: d.scrollLeft, top: d.scrollTop};
            }
            return ret;
        },
        setScroll: function(objLeftTop){
            if(!objLeftTop) return null;
            var d = this.dom,
                doc = document,
                body = doc.body,
                docElement = doc.documentElement;
            if(d == doc || d == body){
                if (objLeftTop.left !== null) {
                    var setOk = false;
                    if (Rui.browser.msie && Rui.isStrict) {
                        if (docElement.scrollLeft) {
                            docElement.scrollLeft = objLeftTop.left;
                            setOk = true;
                        }
                    }
                    else {
                        if (window.pageXOffset) {
                            window.pageXOffset = objLeftTop.left;
                            setOk = true;
                        }
                    }
                    if(!setOk && body){
                        body.scrollLeft = objLeftTop.left;
                    }
                }
                if (objLeftTop.top !== null) {
                    var setOk = false;
                    if (Rui.browser.msie && Rui.isStrict) {
                        if (docElement.scrollTop) {
                            docElement.scrollTop = objLeftTop.top;
                            setOk = true;
                        }
                    }
                    else {
                        if (window.pageYOffset) {
                            window.pageYOffset = objLeftTop.top;
                            setOk = true;
                        }
                    }
                    if(!setOk && body){
                        body.scrollTop = objLeftTop.top;
                    }
                }
            }else{
                if (objLeftTop.left !== null) {
                    d.scrollLeft = objLeftTop.left;
                }
                if(objLeftTop.top !== null){
                    d.scrollTop = objLeftTop.top;
                }
            }
            return this;
        },
        getVisibleScrollXY: function(targetEl, movingX, movingY, paddingLeft, useVirtualScroll){
            movingX = movingX === false ? false : true;
            movingY = movingY === false ? false : true;
            paddingLeft = paddingLeft || 0;
            useVirtualScroll = !!useVirtualScroll;
            var newScroll = null;
            if (movingX || movingY) {
                newScroll = {};
                var scrollerEl = this;
                var scroll = scrollerEl.getScroll();
                var startXY = scrollerEl.getXY();
                var scrollerWH = [scrollerEl.getWidth(), scrollerEl.getHeight()];
                scrollerWH[0] = scrollerWH[0] - paddingLeft;
                var endXY = [startXY[0] + scrollerWH[0], startXY[1] + scrollerWH[1]];
                var targetXY = targetEl.getXY();
                targetXY[0] = targetXY[0] - paddingLeft;
                var targetWH = [targetEl.getWidth(), targetEl.getHeight()];
                var childs = scrollerEl.getChildren();
                if (childs.length > 0) {
                    var childEl = Rui.get(childs[0]),
                        childWH = [childEl.getWidth(), childEl.getHeight()],
                        scrollBarWH = [0, 0];
                    if(useVirtualScroll !== true)
                        scrollBarWH = [childWH[1] > scrollerWH[1] ? 17 : 0, childWH[0] > scrollerWH[0] ? 17 : 0];
                    if (movingX) {
                        if (targetXY[0] >= startXY[0] && targetXY[0] + targetWH[0] <= endXY[0] - scrollBarWH[0]) {
                            newScroll.left = null;
                        }
                        else {
                            if (targetXY[0] < startXY[0]) {
                                newScroll.left = scroll.left - (startXY[0] - targetXY[0]);
                            }
                            else
                                if (targetXY[0] + targetWH[0] > endXY[0] - scrollBarWH[0]) {
                                    newScroll.left = scroll.left + (targetXY[0] + targetWH[0] - (endXY[0] - scrollBarWH[0]));
                                }
                        }
                    }
                    if (movingY) {
                        if (targetXY[1] >= startXY[1] && targetXY[1] + targetWH[1] <= endXY[1] - scrollBarWH[1]) {
                            newScroll.top = null;
                        }
                        else {
                            if (targetXY[1] < startXY[1]) {
                                newScroll.top = scroll.top - (startXY[1] - targetXY[1]);
                            }
                            else
                                if (targetXY[1] + targetWH[1] > endXY[1] - scrollBarWH[1]) {
                                    newScroll.top = scroll.top + (targetXY[1] + targetWH[1] - (endXY[1] - scrollBarWH[1]));
                                }
                        }
                    }
                }
            }
            return newScroll;
        },
        moveScroll: function(childId,movingX,movingY, paddingLeft){
            var targetEl = Rui.get(childId);
            var newScroll = this.getVisibleScrollXY(targetEl,movingX,movingY, paddingLeft);
            if(newScroll != null) this.setScroll(newScroll);
            return targetEl.getXY();
        },
        isMask: function() {
            return this.waitMaskEl && this.waitMaskEl.isShow();
        },
        focus: function() {
            try{
                this.dom.focus();
            }catch(e){}
            return this;
        },
        blur: function() {
            try{
                this.dom.blur();
            }catch(e){}
            return this;
        },
        getDimensions: function(contentOnly,checkStyle) {
            var element = this.dom;
            var w = 0;
            var h = 0;
            var display = this.getStyle('display');
            if (display != 'none' && display != null) 
            {
                w = element.offsetWidth || 0;
                h = element.offsetHeight || 0;
            }
            else {
                var els = element.style;
                var originalDisplay = els.display;
                var originalPosition = els.position;
                var originalVisibility = els.visibility;
                var originalLeft = els.left;
                els.position = 'absolute';
                els.visibility = 'visible';
                els.display = 'block';
                els.left = '0px';
                h = element.clientHeight || 0;
                w = element.clientWidth || 0;
                els.position = originalPosition;
                els.display = originalDisplay;
                els.visibility = originalVisibility;
                els.left = originalLeft;
            }
            if(checkStyle && w == 0){
                w = Rui.util.LString.simpleReplace(this.getStyle('width'), 'px', '').trim();
                h = Rui.util.LString.simpleReplace(this.getStyle('height'), 'px','').trim();
            }
            if (contentOnly) {
                w = w - this.getBorderWidth('lr') - this.getPadding('lr');
                h = h - this.getBorderWidth('tb') - this.getPadding('tb');
            }
            w = w < 0 ? 0 : w;
            h = h < 0 ? 0 : h;
            return { width: w, height: h };
        },
        getHeight: function(contentHeight){
            var h = this.dom.offsetHeight || 0;
            h = !contentHeight ? h : h - this.getBorderWidth('tb') - this.getPadding('tb');
            return h < 0 ? 0 : h;
        },
        adjustWidth: function(width) {
            var isNum = (typeof width == 'number');
            if(isNum && this.autoBoxAdjust && !this.isBorderBox()){
               width -= (this.getBorderWidth('lr') + this.getPadding('lr'));
            }
            return (isNum && width < 0) ? 0 : width;
        },
        adjustHeight: function(height) {
            var isNum = (typeof height == 'number');
            if(isNum && this.autoBoxAdjust && !this.isBorderBox()){
               height -= (this.getBorderWidth('tb') + this.getPadding('tb'));
            }
            return (isNum && height < 0) ? 0 : height;
        },
        addUnits: function(size){
            if(size === '' || size == 'auto' || size === undefined){
                size = size || '';
            } else if(!isNaN(size) || !Rui.LElement.unitPattern.test(size)){
                size = size + (this.defaultUnit || 'px');
            }
            return size;
        },
        getHiddenWidth: function(maxDepth) {
            maxDepth = maxDepth || 10;
            var w = this.getWidth();
            var depth = 0, parent, currEl = this;
            while ((parent = currEl.parent()) != null && depth < maxDepth && w < 1) {
                depth++;
                if(currEl.getStyle('display') == 'none') {
                    if(currEl.hasClass('L-hide-display')) {
                        currEl.removeClass('L-hide-display');
                        w = this.getWidth();
                        currEl.addClass('L-hide-display');
                    } else {
                        currEl.setStyle('display', 'block');
                        w = this.getWidth();
                        currEl.setStyle('display', 'none');
                    }
                    break;
                }
                currEl = parent;
            }
            currEl = parent = null;
            return w;
        },
        getHiddenHeight: function(maxDepth) {
            maxDepth = maxDepth || 10;
            var h = this.getHeight();
            var depth = 0, parent, currEl = this;
            while ((parent = currEl.parent()) != null && depth < maxDepth && h < 1) {
                depth++;
                if(currEl.getStyle('display') == 'none') {
                    if(currEl.hasClass('L-hide-display')) {
                        currEl.removeClass('L-hide-display');
                        h = this.getHeight();
                        currEl.addClass('L-hide-display');
                    } else {
                        currEl.setStyle('display', 'block');
                        h = this.getHeight();
                        currEl.setStyle('display', 'none');
                    }
                    break;
                }
                currEl = parent;
            }
            currEl = parent = null;
            return h;
        },
        setWidth: function(width, anim){
            if(anim) {
                if(anim === true)
                    anim = { width: { to: width } };
                anim = Rui.applyIf(anim, { type: 'LAnim' });
            }
            width = this.adjustWidth(width);
            if(!anim) {
                 this.dom.style.width = this.addUnits(width);
            } else {
                this.getAnimation(anim, this.id).animate();
            }
            return this;
        },
         setHeight: function(height, anim){
            height = this.adjustHeight(height);
            if (!anim) {
                this.dom.style.height = this.addUnits(height);
            } else {
                var animConf = (typeof anim == 'object') ? anim : {height: { to: height }} ;
                new Rui.fx.LAnim({
                    el: this.id,
                    attributes: animConf
                }).animate();
            }
            return this;
        },
        autoHeight: function() {
            this.clip();
            var height = parseInt(this.dom.scrollHeight, 10);
            this.setHeight(height);
            this.unclip();
            return this;
        },
        availableHeight: function(parentId, margin) {
            margin = margin || 0;
            parentId = parentId || this.parent().dom;
            var parentDom = Rui.getDom(parentId);
            var height = Dom.getAvailableHeight(parentDom);
            var t = this.dom.offsetHeight;
            var p = this.getPadding('tb');
            height = height + t - margin - p;
            this.setHeight(height);
            return this;
        },
        mask: function(contentHtml) {
            contentHtml = contentHtml || '';
            if(!this.waitMaskEl) {
                var template = new Rui.LTemplate('<div class="L-masked-panel">',
                    '<div class="L-masked"></div>',
                    '<div class="L-masked-message">{contentHtml}</div>',
                    '</div>'
                );
                this.waitMaskEl = Rui.createElements(template.apply({
                    contentHtml: contentHtml
                })).getAt(0);
                if(!(this.dom == document.body || this.dom == document)) this.setStyle('position', 'relative');
                this.waitMaskEl.appendTo((this.dom == document.body || this.dom == document) ? document.body : this.dom);
            }
            if((this.dom == document.body || this.dom == document)) {
                var doc = document.body || document;
                this.waitMaskEl.setHeight(doc.scrollHeight || doc.clientHeight);
            }
            this.waitMaskEl.show();
        },
        unmask: function() {
            if (this.waitMaskEl) this.waitMaskEl.hide();
        },
        isAncestor: function(node) {
            node = node.dom || node;
            return Rui.util.LDom.isAncestor(this.dom, node);
        },
        getRegion: function() {
            return Dom.getRegion(this.dom);
        },
        setRegion: function(region, anim) {
            var width = region.right - region.left;
            var height = region.bottom-region.top;
            var x = region.left;
            var y = region.top;
            if(anim) {
                if(anim === true)
                    anim = { points: {to: [x, y]}, width: { to: width }, height: { to: height } };
                anim = Rui.applyIf(anim, { type: 'LMotionAnim' });
            }
            var currAnim = this.getAnimation(anim, this.dom.id);
            if(currAnim != null)
                currAnim.animate();
            else {
                this.setSize(width, height);
                this.moveTo(x, y);
            }
            return this;
        },
        enable: function() {
            if(this.dom) {
                if(this.isFormField()) if(this.invokeField.call(this, 'enable', arguments) == true) return this;
                this.dom.disabled = false;
                this.removeClass(this.CSS_ELEMENT_DISABLED);
            }
            return this;
        },
        disable: function() {
            if(this.dom) {
                if(this.isFormField()) if(this.invokeField.call(this, 'disable', arguments) == true) return this;
                this.dom.disabled = true;
                this.addClass(this.CSS_ELEMENT_DISABLED);
            }
            return this;
        },
        isFormField: function() {
            return this.hasClass('L-form-field');
        },
        invokeField: function(fnName, arguments) {
            var displayEl = this.select('.L-hidden-field, .L-display-field').getAt(0);
            if(displayEl && displayEl.dom.instance) {
                var obj = displayEl.dom.instance;
                if(obj[fnName]) {
                    obj[fnName].call(obj, arguments);
                    return true;
                }
            }
            return false;
        },
        isDisable: function() {
            return this.dom ? this.hasClass(this.CSS_ELEMENT_DISABLED) : false;
        },
        valid: function() {
            if(this.dom) {
                this.removeClass(this.CSS_ELEMENT_INVALID);
                if(Rui.useAccessibility()) this.dom.setAttribute('aria-invalid', false);
                if(this.dom.invalidTooltip) {
                    this.dom.invalidTooltip.destroy();
                    this.dom.invalidTooltip = null;
                }
            }
            return this;
        },
        invalid: function(message) {
            if(this.dom) {
                message = message || Rui.getMessageManager().get('$.base.msg052');
                this.addClass(this.CSS_ELEMENT_INVALID);
                if(Rui.useAccessibility()) this.dom.setAttribute('aria-invalid', true);
                if(Rui.ui && Rui.ui.LTooltip) {
                    this.dom.invalidTooltip = this.dom.invalidTooltip || new Rui.ui.LTooltip({ context:this.dom.id, text:message});
                }
            }
            return this;
        },
        isValid: function() {
            return this.dom ? !this.hasClass(this.CSS_ELEMENT_INVALID) : true;
        },
        getBorderWidth: function(side){
            return this.addStyles.call(this, side, Rui.LElement.borders);
        },
        getPadding: function(side){
            return this.addStyles.call(this, side, Rui.LElement.paddings);
        },
        getMargins: function(side){
            return this.addStyles.call(this, side, Rui.LElement.margins);
        },
        getComponent: function() {
            var obj = null;
            if(this.dom) {
                var instanceEl = Rui.get(this.dom).select('.L-instance');
                if(instanceEl != null && instanceEl.length > 0)
                    obj = instanceEl.getAt(0).dom.instance;
            }
            return obj;
        }
    });
})();
(function(){
    var ElProto = Rui.LElement.prototype,
        CelProto = Rui.LElementList.prototype;
    for (var fnName in ElProto){
        if(Rui.isFunction(ElProto[fnName])){
            (function(fnName){ 
                CelProto[fnName] = CelProto[fnName] || function(){
                    return this.invoke(fnName, arguments);
                };
            }).call(CelProto, fnName);
        }
    };
})();
Rui.LException = function(message, o) {
    if (message instanceof Rui.LException) {
        this.message = message.message;
        this.name = message.name;
        this.fileName = message.fileName;
        this.number = message.number || message.lineNumber;
        this.description = message.description;
        this.stack = message.stack;
    } else if(typeof message == 'string') {
        this.message = message;
    } else {
        if(message) {
            this.message = message.message;
            this.name = message.name;
            this.fileName = message.fileName;
            this.number = message.lineNumber || '0';
            this.stack = message.stack;
            if(this.stack && !this.fileName) {
                var sList = this.stack.split('\n');
                var sPos = sList[1].indexOf('http://');
                if(sPos > 0) {
                    this.fileName = sList[1].substring(sPos, sList[1].length - 1);
                    this.fileName = this.fileName.substring(this.fileName.lastIndexOf('/') + 1);
                    var line = this.fileName.split(':');
                    this.number = line[line.length - 2];
                }
            }
            if(!this.fileName) {
                this.fileName = document.location.href;
                this.fileName = this.fileName.substring(this.fileName.lastIndexOf('/') + 1);
            }
        }
    }
    this.callerOType = '';
    if(Rui.isUndefined(o) == false) {
        if(typeof o == 'string') 
            this.callerOType = o;
        else
            this.callerOType = o.otype ? o.otype : '';
    }
    this.caller = arguments.caller;
    if (!this.stack && !Rui.browser.msie) {
        this.error = null;
        try {
            foo.bar;
        } catch(testExcp) {
            this.error = testExcp; 
        }
        if(!this.fileName && !this.isExceptionInfo && this.error.stack) {
           this.createExceptionInfo(this.error);
        }
    }   
};
Rui.extend(Rui.LException, Error, {
    getOType: function() {
        return this.callerOType;
    },
    getMessage: function() {
        return this.message;
    },
    createExceptionInfo: function(excp) {
        this.isExceptionInfo = true;
        var stackTrace = this.getErrorStack(excp);
        if(stackTrace.length > 1) {
            var idx = stackTrace[1].lastIndexOf(':');
            if(idx > 0) {
                this.lineNumber = stackTrace[1].substring(idx + 1, stackTrace[1].length - 1);
                this.fileName = stackTrace[1].substring(0, idx);
            }
        }
    },
    getErrorStack: function(excp){
        var stack = [];
        if (!excp || !excp.stack) {
            return stack;
        }
        var stacklist = excp.stack.split('\n');
        stack = stacklist;
        return stack;
    },
    getFunctionName: function (aFunction) {
        var regexpResult = aFunction.toString().match(/function(\s*)(\w*)/);
        if (regexpResult && regexpResult.length >= 2 && regexpResult[2]) {
            return regexpResult[2];
        }
        return 'anonymous';
    },
    getStackTrace: function() {
        var result = '';
        var caller = arguments.caller;
        if (typeof(this.caller) != 'undefined') { 
            for (var a = Rui.isUndefined(this.caller) ? caller : this.caller; a != null; a = a.caller) {
                result += '> ' + this.getFunctionName(a.callee) + '\n';
                if (a.caller == a) {
                    result += '*';
                    break;
                }
            }
        } else { 
            var stack = this.getErrorStack(this.error);
            for (var i = 1; i < stack.length; i++) {
                result += '> ' + stack[i] + '\n';
            }
        }
        return result;
    },
    toString: function() {
        return '[' + this.fileName + ':' + this.number + '] : ' + this.message;
    }
});
Rui.LException.getException = function(message, o) {
    if (message instanceof Rui.LException) {
        return message;
    } else {
        return new Rui.LException(message, o);
    }
};
Rui.getException = Rui.LException.getException;
Rui.namespace('Rui.util');
Rui.applyObject(Rui.util.LString, {
    trimAll: function(s){
        return s.replace(/\s*/g, '');
    },
    lastCut: function(s, pos){
        if (s != null && s.length > pos)
            s = s.substring(0, s.length - pos);
        return s;
    },
    nvl: function(val){
        return (val === null) ? '' : val;
    },
    camelToHungarian: function(camel){
        var caps = camel.match(/[A-Z]/g);
        if (caps) {
            var capsCount = caps.length;
            var c;
            if (capsCount > 0) {
                for (var i = 0; i < capsCount; i++) {
                    c = caps[i];
                    camel = camel.replace(c, '_' + c.toLowerCase());
                }
            }
        }
        return camel;
    },
    getCamelToFunctionName: function(camel){
    	var s = '';
        var caps = camel.split('-');
        if (caps) {
            var capsCount = caps.length;
            var c;
            if (capsCount > 0) {
            	s = caps[0];
                for (var i = 1; i < capsCount; i++) {
                    c = caps[i];
                    s += this.firstUpperCase(c);
                }
            }
        }
        return s;
    },
    isHangul: function(oValue){
        var i,ch,len;
        for (i=0, len = oValue.length; i<len;i++) {
            ch = escape(oValue.charAt(i));  
            if (this.isHangulChar(ch) == true) { 
                return true;
            }
        }
        return false;
    },
    isHangulChar: function(oValue){
        if (oValue.substring(0, 2) == '%u') {
            if (oValue.substring(2,4) == '00'){ return false;}
            else { return true;}        
        } else if(oValue == '%20'){ return true; } 
        else if (oValue.substring(0,1) == '%') {
            return  parseInt(oValue.substring(1,3), 16) > 127 ;
        } else { return false; }
    },
    getSkipHangulChar: function(oValue){
        var s = '';
        var i,ch,len;
        for (i=0, len = oValue.length; i<len;i++) {
            var c = oValue.charAt(i);
            ch = escape(c);  
            if (this.isHangulChar(ch) !== true) { 
                s += c;
            }
        }
        return s;
    },
    isEmail: function(value) {
        return !(value.search(Rui.util.LString.format) == -1);
    },
    isCsn: function(value) {
        if (!value || (value+'').length != 10 || isNaN(value)) {
            return false;
        }
        value += '';
        var sum = 0, nam = 0, checkDigit = -1;
        var checkArray = [1, 3, 7, 1, 3, 7, 1, 3, 5];
        for (var i = 0; i < 9; i++)
            sum += value.charAt(i) * checkArray[i];
        sum = sum + ((value.charAt(8) * 5) / 10);
        nam = Math.floor(sum) % 10;
        checkDigit = (nam == 0) ? 0 : 10 - nam;
        if (value.charAt(9) != checkDigit) {
            return false;
        }
        return true;
    },
    isSsn: function(value){
        if ( !value || (value+'').length != 13 || isNaN(value))
            return false;
        value += '';
        var jNum1 = value.substr(0, 6);
        var jNum2 = value.substr(6);
        bYear = (jNum2.charAt(0) <= '2') ? '19' : '20';
        bYear += jNum1.substr(0, 2);
        bMonth = jNum1.substr(2, 2) - 1;
        bDate = jNum1.substr(4, 2);
        bSum = new Date(bYear, bMonth, bDate);
        if ( bSum.getYear() % 100 != jNum1.substr(0, 2) || bSum.getMonth() != bMonth || bSum.getDate() != bDate) {
            return false;
        }
        total = 0;
        var temp = [];
        for (var i = 1; i <= 6; i++)
            temp[i] = jNum1.charAt(i-1);
        for (var i = 7; i <= 13; i++)
            temp[i] = jNum2.charAt(i-7);
        for (var i = 1; i <= 12; i++) {
            k = i + 1;
            if(k >= 10) k = k % 10 + 2;
            total = total + (temp[i] * k);
        }
        last_num = (11- (total % 11)) % 10;
        if(last_num != temp[13]) {
            return false;
        }
        return true;
    },
    isTime: function(value) {
        var pos = value.indexOf(':');
        if(pos > 0)
            value = Rui.util.LString.cut(value, pos, 1);
        if(value.length != 4) return false;
        var hh = value.substring(0,2);
        var mm = value.substring(2,4);
        if(hh < 0 || hh > 23) return false;
        if(mm < 0 || mm > 59) return false;
        return true;
    },
    simpleReplace: function(str, oldStr, newStr) {
        var rStr = oldStr;
        rStr = rStr.replace(/\\/g, '\\\\');
        rStr = rStr.replace(/\^/g, '\\^');
        rStr = rStr.replace(/\$/g, '\\$');
        rStr = rStr.replace(/\*/g, '\\*');
        rStr = rStr.replace(/\+/g, '\\+');
        rStr = rStr.replace(/\?/g, '\\?');
        rStr = rStr.replace(/\./g, '\\.');
        rStr = rStr.replace(/\(/g, '\\(');
        rStr = rStr.replace(/\)/g, '\\)');
        rStr = rStr.replace(/\|/g, '\\|');
        rStr = rStr.replace(/\,/g, '\\,');
        rStr = rStr.replace(/\{/g, '\\{');
        rStr = rStr.replace(/\}/g, '\\}');
        rStr = rStr.replace(/\[/g, '\\[');
        rStr = rStr.replace(/\]/g, '\\]');
        rStr = rStr.replace(/\-/g, '\\-');
        var re = new RegExp(rStr, 'g');
        return str.replace(re, newStr);
    },
    replaceHtml: function(html) {
        if(html) {
            html = html.replace(/\</gi, '&lt;');
            html = html.replace(/\>/gi, '&gt;');
        }
        return html;
    },
    skipTags: function(html) {
    	if(!html) return '';
    	return html.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, '');
    },
    toClipboard: function(value) {
        try {
            if(window.clipboardData){
                clipboardData.setData('text',value);
                return true;
            }else if(window.netscape){
                netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
                var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
                if(!clip) return;
                var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
                if(!trans) return;
                trans.addDataFlavor('text/unicode');
                var str = Components.classes['@mozilla.org/supports-string;1'].createInstance(Components.interfaces.nsISupportsString);
                str.data=value;
                trans.setTransferData('text/unicode',str,value.length*2);
                var clipid=Components.interfaces.nsIClipboard;
                if(!clipid) return false;
                clip.setData(trans,null,clipid.kGlobalClipboard);
                return true;
            }
            else {
                try{  
                      var customEvent =document.createEvent('Event');
                      customEvent.initEvent('clipboardEvent', true, true);
                      this.fireClipboardEvent(customEvent,'clipboardEventDiv',value);
                      return true;
                }catch(e){ return true;}
            }
        } catch(e) {
            return false;
        }
        return false;
    },
    getClipboard: function() {
        try {
            if(window.clipboardData){
                return clipboardData.getData('text');;
            }else if(window.netscape){
                netscape.security.PrivilegeManager.enablePrivilege('UniversalXPConnect');
                var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
                if (!clip) return;
                var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
                if (!trans) return;
                trans.addDataFlavor('text/unicode');
                clip.getData(trans,clip.kGlobalClipboard);
                var str = new Object();
                var len = new Object();
                try { trans.getTransferData('text/unicode',str,len); }
                catch(error) { return; }
                if (str) {
                  if (Components.interfaces.nsISupportsWString) str=str.value.QueryInterface(Components.interfaces.nsISupportsWString);
                  else if (Components.interfaces.nsISupportsString) str=str.value.QueryInterface(Components.interfaces.nsISupportsString);
                  else str = null;
                }
                if (str) return(str.data.substring(0,len.value / 2));
            }
            else{   
                    if(top.document.getElementById('clipboardEventDiv') == null){
                    var pluginPath = 'http://www.dev-on.com/rui/jsp/uip/rui/clipboard/clipboard_app.crx';
                    Rui.alert({
                        text: '<a href="' + pluginPath + '">클립보드 플러그인을 설치를 위해 선택해주세요.</a>',
                        handler: function() {
                            location.reload();
                            return;
                        }
                 });
                 return false;
                }
                var customEvent = document.createEvent('Event');
                customEvent.initEvent('clipboardPasteEvent', true, true);
                if(typeof arguments === undefined)
                    return;
                Rui.util.LString.clipConfig = {clipData:arguments[0], view:arguments[1], rtrimWhiteSpace:arguments[2]};
                this.getPlugInMsg(this.displayMsg, customEvent);
            }
        } catch(e) {
            return false;
        }
    },
    getPlugInMsg: function(callback, pEvent){
        this.fireClipboardEvent(pEvent,'clipboardPasteEventDiv',null);
        if(typeof callback !== 'function')
            callback = false;
        this.async( function(){callback();});
    },
    async: function (fn) {
       setTimeout(fn, 10);
    },
    displayMsg: function(){
    	var div = top.document.getElementById('clipboardPasteEventDiv');
        var value = div.innerText || div.textContent;
        if(typeof Rui.util.LString.clipConfig.rtrimWhiteSpace !== undefined
        		&& Rui.util.LString.clipConfig.rtrimWhiteSpace)
        	value = value.replace(/\s+$/g,'');
        Rui.util.LString.clipConfig.clipData.setClipData(value, Rui.util.LString.clipConfig.view);
    },
    fireClipboardEvent: function(pEvent,pEl,data){
        var hiddenDiv = top.document.getElementById(pEl);
        if(data != null)
            hiddenDiv.innerText = data;
        hiddenDiv.dispatchEvent(pEvent);
    },
    getTimeUrl: function(url){
        return this.getAppendUrl(url, '_dc', (new Date().getTime()));
    },
    getAppendUrl: function(url, key, value) {
        var append = key + '=' + value;
        if (url.indexOf('?') !== -1) {
            url += '&' + append;
        }
        else {
            url += '?' + append;
        }
        return url;
    },
    getUrlParams: function(url) {
        var urls = url.split('?');
        if(urls.length < 2) return {};
        url = urls[urls.length - 1];
        var params = url.split('&');
        var o = {};
        for (var i = 0 ; i < params.length ; i++) {
            var param = params[i].split('=');
            o[param[0]] = param.length > 0 ? param[1] : undefined;
        }
        return o;
    },
    getByteSubstring: function(str, start, size) {
        var c = byteLength = 0;
        for (var i = pos = 0; pos < start ; i++) {
            c = escape(str.charAt(i));
            if (c.length == 1) { 
                byteLength = 1;
            } else if (c.indexOf('%u') != -1) { 
                byteLength = 3; 
            } else {
                if (c.indexOf('%') != -1) { 
                    byteLength = c.length / 3;
                }
            }
            pos += byteLength;
        }
        var beg = i;
        var lim = 0;
        var len = Rui.util.LString.getByteLength(str);
        c = byteLength = 0;
        for (var i = beg ; i < len ; i++) {
            var v = str.charAt(i);
            c = escape(v);
            byteLength = 1;
            if (c.length == 1)        
                byteLength = 1;
            else if (c.indexOf('%u') != -1) { 
                byteLength = 3; 
            } else {
                if (c.indexOf('%') != -1) { 
                    byteLength = c.length / 3;
                }
            }
            lim += byteLength;
            if (lim > size){
                return str.substring(beg, i);
            }
        }
        return null;
    }
});
Rui.util.LString.PATTERN_TYPE_NUMBER = /[0-9]/;
Rui.util.LString.PATTERN_TYPE_STRING = /[a-zA-Z]/;
Rui.util.LString.PATTERN_TYPE_NUMSTRING = /[0-9a-zA-Z]/;
Rui.util.LString.PATTERN_TYPE_KOREAN = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힝]/;
Rui.util.LString.PATTERN_TYPE_NONE = null;
Rui.util.LString.format = /^((\w|[\-\.])+)@((\w|[\-\.])+)\.([A-Za-z]+)$/;
Rui.applyObject(Rui.util.LDate, {
    compareString: function(date1, date2, pattern) {
        var dateString1 = this.format(date1, pattern);
        var dateString2 = this.format(date2, pattern);
        return (dateString1 == dateString2);
    },
    getJan1: function(calendarYear) {
        return this.getDate(calendarYear, 0, 1);
    },
    getDayOffset: function(date, calendarYear) {
        var beginYear = this.getJan1(calendarYear); 
        var dayOffset = Math.ceil((date.getTime() - beginYear.getTime()) / this.ONE_DAY_MS);
        return dayOffset;
    },
    isYearOverlapWeek: function(weekBeginDate) {
        var overlaps = false;
        var nextWeek = this.add(weekBeginDate, this.DAY, 6);
        if (nextWeek.getFullYear() != weekBeginDate.getFullYear())
            overlaps = true;
        return overlaps;
    },
    isMonthOverlapWeek: function(weekBeginDate) {
        var overlaps = false;
        var nextWeek = this.add(weekBeginDate, this.DAY, 6);
        if (nextWeek.getMonth() != weekBeginDate.getMonth())
            overlaps = true;
        return overlaps;
    },
    getMonthInYear: function(inx) {
        return Rui.getMessageManager().get('$.core.monthInYear')[inx];
    },
    getShortMonthInYear: function(inx) {
        return Rui.getMessageManager().get('$.core.shortMonthInYear')[inx];
    },
    getDayInWeek: function(inx) {
        return Rui.getMessageManager().get('$.core.dayInWeek')[inx];
    },
    getShortDayInWeek: function(inx) {
        return Rui.getMessageManager().get('$.core.shortDayInWeek')[inx];
    },
    getWeekNumber: function(date, firstDayOfWeek, janDate) {
         firstDayOfWeek = firstDayOfWeek || 0;
         janDate = janDate || this.WEEK_ONE_JAN_DATE;
         var targetDate = this.clearTime(date),
             startOfWeek,
             endOfWeek;
         if (targetDate.getDay() === firstDayOfWeek) {
             startOfWeek = targetDate;
         } else {
             startOfWeek = this.getFirstDayOfWeek(targetDate, firstDayOfWeek);
         }
         var startYear = startOfWeek.getFullYear();
         endOfWeek = new Date(startOfWeek.getTime() + 6 * this.ONE_DAY_MS);
         var weekNum;
         if (startYear !== endOfWeek.getFullYear() && endOfWeek.getDate() >= janDate) {
             weekNum = 1;
         } else {
             var weekOne = this.clearTime(this.getDate(startYear, 0, janDate)),
                 weekOneDayOne = this.getFirstDayOfWeek(weekOne, firstDayOfWeek);
             var daysDiff = Math.round((targetDate.getTime() - weekOneDayOne.getTime()) / this.ONE_DAY_MS);
             var rem = daysDiff % 7;
             var weeksDiff = (daysDiff - rem) / 7;
             weekNum = weeksDiff + 1;
         }
         return weekNum;
     }
});
Rui.applyObject(Rui.util.LArray, {
    serialize: function(params, prefix) {
        prefix = prefix || '&';
        var buf = [];
        for (var key in params) {
            if (typeof params[key] != 'function') {
                buf.push(encodeURIComponent(key), '=', encodeURIComponent(params[key]), prefix);
            }
        }
        delete buf[buf.length - 1];
        params = buf.join('');
        return params;
    },
    clone: function(obj){
        return [].concat(obj);
    },
    moveItem: function(items, oldIndex, newIndex){
        var temp = items[oldIndex];
        items = Rui.util.LArray.removeAt(items, oldIndex);            
        var a = items.slice(0, newIndex);
        var b = items.slice(newIndex, items.length);
        a.push(temp);
        return a.concat(b);
    },
    concat: function(items1, items2) {
        var newItems = this.clone(items1);
        for (var i = 0 , len = items2.length; i < len; i++) {
            if(Rui.util.LArray.contains(items1, items2[i]) == false)
                newItems.push(items2[i]);
        }
        return newItems;
    }
});
Rui.applyObject(Rui.util.LNumber, {
    round: function(value, precision) {
        var result = Number(value);
        if (typeof precision == 'number') {
            result = Number(this.format(value, { decimalPlaces: precision }));
        }
        return result;
    },
    toMoney: function(v,currency){
        currency = currency || '';
        v = (Math.round((v-0)*100))/100;
        v = String(v);
        var decimalIdx = v.indexOf('.');
        var decimalValue = '';
        if(decimalIdx > 0) {
            decimalValue = v.substring(decimalIdx);
            v = v.substring(0, decimalIdx);
        }
        var count = Math.ceil(v.length / 3);
        var fstVal = '';
        var newVal = '';
        fstVal = v.substring(0, (v.length % 3) == 0 ? 3 : parseInt(v.length % 3, 10));
        for (var idx = 1; idx < count; idx++) {
            var k = v.substr(v.length - 3 * idx, 3);
            newVal = ',' + k + newVal;
        }
        v = fstVal + newVal;
        return currency +  v + decimalValue;
    },
    usMoney: function(v){
        v = (Math.round((v-0)*100))/100;
        v = (v == Math.floor(v)) ? v + '.00' : ((v*10 == Math.floor(v*10)) ? v + '0' : v);
        v = String(v);
        var ps = v.split('.');
        var whole = ps[0];
        var sub = ps[1] ? '.'+ ps[1] : '.00';
        var count = Math.ceil(whole.length / 3);
        var fstVal = '';
        var newVal = '';
        fstVal = whole.substring(0, (whole.length % 3) == 0 ? 3 : parseInt(whole.length % 3, 10));
        for (var idx = 1; idx < count; idx++) {
            var k = v.substr(whole.length - 3 * idx, 3);
            newVal = ',' + k + newVal;
        }
        whole = fstVal + newVal;
        v = whole + sub;
        return '$'+  v;
    }
});
(function() {
    var Y = Rui.util,     
        document = window.document;     
    var isOpera = Rui.browser.opera,
        isSafari = Rui.browser.webkit,
        isIE = Rui.browser.msie;
    var LString = Rui.util.LString;
    var patterns = {
        HYPHEN: /(-[a-z])/i, 
        ROOT_TAG: /^body|html$/i, 
        OP_SCROLL:/^(?:inline|table-row)$/i
    };
    Rui.applyObject(Rui.util.LDom, {
        getXY: function(el) {
            var f = function(el) {
                if(el.ownerDocument === null) return false;
                if ( ((el.parentNode === null || el.offsetParent === null ||
                       this.getStyle(el, 'display') == 'none') && el != el.ownerDocument.body)) {
                   return false;
                }
                return getXY(el);
            };
            return Y.LDom.batch(el, f, Y.LDom, true);
        },
        getX: function(el) {
            var f = function(el) {
                return Y.LDom.getXY(el)[0];
            };
            return Y.LDom.batch(el, f, Y.LDom, true);
        },
        getY: function(el) {
            var f = function(el) {
                return Y.LDom.getXY(el)[1];
            };
            return Y.LDom.batch(el, f, Y.LDom, true);
        },
        setXY: function(el, pos, noRetry) {
            var f = function(el) {
                var style_pos = this.getStyle(el, 'position');
                if (style_pos == 'static') { 
                   this.setStyle(el, 'position', 'relative');
                   style_pos = 'relative';
                }
                var pageXY = this.getXY(el);
                if (pageXY === false) { 
                   return false;
                }
                if(Rui.get(el).hasClass('L-hidden')) {
                   pageXY[0] += 10000;
                   pageXY[1] += 10000;
                }
                var delta = [ 
                   parseInt( this.getStyle(el, 'left'), 10 ),
                   parseInt( this.getStyle(el, 'top'), 10 )
                ];
                if ( isNaN(delta[0]) ) {
                   delta[0] = (style_pos == 'relative') ? 0 : el.offsetLeft;
                }
                if ( isNaN(delta[1]) ) { 
                   delta[1] = (style_pos == 'relative') ? 0 : el.offsetTop;
                }
                if(Rui.get(el).hasClass('L-hidden') && delta[0] == -10000) {
                   delta[0] += 10000;
                }
                if(Rui.get(el).hasClass('L-hidden') && delta[1] == -10000) {
                   delta[1] += 10000;
                }
                if (pos[0] !== null) { el.style.left = pos[0] - pageXY[0] + delta[0] + 'px'; }
                if (pos[1] !== null) { el.style.top = pos[1] - pageXY[1] + delta[1] + 'px'; }
                if (!noRetry) {
                	return;
                   var newXY = this.getXY(el);
                   if(false) {
                       if(Rui.get(el).hasClass('L-hidden')) {
                           newXY[0] += 10000;
                           newXY[1] += 10000;
                       }
                   }
                  if ( (pos[0] !== null && newXY[0] != pos[0]) ||
                       (pos[1] !== null && newXY[1] != pos[1]) ) {
                      this.setXY(el, pos, true);
                  }
                }
            };
            Y.LDom.batch(el, f, Y.LDom, true);
        },
        setX: function(el, x) {
            Y.LDom.setXY(el, [x, null]);
        },
        setY: function(el, y) {
            Y.LDom.setXY(el, [null, y]);
        },
        getRegion: function(el) {
            var f = function(el) {
                if ( (el.parentNode === null || el.offsetParent === null ||
                       this.getStyle(el, 'display') == 'none') && el != el.ownerDocument.body) {
                   return false;
                }
                var region = Y.LRegion.getRegion(el);
                return region;
            };
            return Y.LDom.batch(el, f, Y.LDom, true);
        },
        getClientRegion: function() {
            var t = Y.LDom.getDocumentScrollTop(),
                l = Y.LDom.getDocumentScrollLeft(),
                r = Y.LDom.getViewportWidth() + l,
                b = Y.LDom.getViewportHeight() + t;
            return new Y.LRegion(t, r, b, l);
        },
        getClientWidth: function() {
            return Y.LDom.getViewportWidth();
        },
        getClientHeight: function() {
            return Y.LDom.getViewportHeight();
        },
        getDocumentHeight: function() {
            var scrollHeight = (document.compatMode != 'CSS1Compat') ? document.body.scrollHeight : document.documentElement.scrollHeight;
            return Math.max(scrollHeight, Y.LDom.getViewportHeight());
        },
        getDocumentWidth: function() {
            var scrollWidth = (document.compatMode != 'CSS1Compat') ? document.body.scrollWidth : document.documentElement.scrollWidth;
            return Math.max(scrollWidth, Y.LDom.getViewportWidth());
        },
        getDocumentScrollLeft: function(doc) {
            doc = doc || document;
            return Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft);
        },
        getDocumentScrollTop: function(doc) {
            doc = doc || document;
            return Math.max(doc.documentElement.scrollTop, doc.body.scrollTop);
        },
        getViewport: function(){
            return {width:this.getViewportWidth(),height:this.getViewportHeight()};
        },
        getViewportHeight: function() {
            if(!Rui.platform.isMobile) {
                if(Rui.getConfig) {
                    var agentPatterns = Rui.getConfig().getFirst('$.core.screen.mobile.agentPatterns');
                    if(agentPatterns) {
                        var userAgent = navigator.userAgent.toLowerCase();
                    	for (var i = 0 ; i < agentPatterns.length; i++) {
                    		var pattern = new RegExp(agentPatterns[i].pattern);
                    		if(pattern.test(userAgent)) {
                    			return agentPatterns[i].heightFn();
                    		}
                    	}
                    }
                }
            }
        	var height = self.innerHeight; 
            var mode = document.compatMode;
            if ( (mode || isIE) && !isOpera ) { 
                height = (mode == 'CSS1Compat') ?
                        document.documentElement.clientHeight : 
                        document.body.clientHeight; 
            }
            return height;
        },
        getViewportWidth: function() {
        	if(!Rui.platform.isMobile) {
                if(Rui.getConfig) {
                    var agentPatterns = Rui.getConfig().getFirst('$.core.screen.mobile.agentPatterns');
                    if(agentPatterns) {
                        var userAgent = navigator.userAgent.toLowerCase();
                    	for (var i = 0 ; i < agentPatterns.length; i++) {
                    		var pattern = new RegExp(agentPatterns[i].pattern);
                    		if(pattern.test(userAgent)) {
                    			return agentPatterns[i].widthFn();
                    		}
                    	}
                    }
                }
        	} 
        	var width = self.innerWidth;  
            var mode = document.compatMode;
            if (mode || isIE) { 
                width = (mode == 'CSS1Compat') ?
                    document.documentElement.clientWidth : 
                    document.body.clientWidth; 
            }
            return width;
        },
        findStringInClassName: function(dom, prefix){
            var value = null;
            if (dom && prefix) {
                var cns = dom.className.split(' ');
                Rui.util.LArray.each(cns, function(cn){
                    if (LString.startsWith(cn, prefix)) {
                        value = cn.substring(prefix.length);
                    }
                });
            }
            return value;
        },
        toPixelNumber: function(px) {
        	if(px && typeof px == 'string'){
    			px = px.replace(/px/, '');
    			px = parseFloat(px, 10);
        	}else
        		return 0;
        	return px;
        },
        isVisibleSide: function(coord,side){
            var region = Y.LDom.getClientRegion();
            side = side ? side : 'b';
            switch(side){
                case 't':
                    return region.top - coord < 0 ? false : true;
                break;
                case 'r':
                    return region.right - coord < 0 ? false : true;
                break;
                case 'b':
                    return region.bottom - coord < 0 ? false : true;
                break;
                case 'l':
                    return region.left - coord < 0 ? false : true;
                break;
            }
        },
        setCaretToPos: function(dom, pos){
             Rui.util.LDom.setSelectionRange(dom, pos, pos);
        },
        getAvailableHeight: function(dom) {
            var height = Rui.util.LDom.getY(dom) + dom.offsetHeight;
            var paddingTop = this.getStyle(dom, 'padding-top');
            var paddingBottom = this.getStyle(dom, 'padding-bottom');
            var tPadding = (paddingTop !== 'auto') ? this.toPixelNumber(paddingTop) : 0;
            var bPadding = (paddingBottom !== 'auto') ? this.toPixelNumber(paddingBottom) : 0;
            var useHeight = 0;
            var len = dom.children.length;
            if(len > 0) {
                var lastDom = null;
                for (var i = len - 1; i >= 0 ; i--) {
                    var currDom = dom.children[i];
                    if(this.getStyle(currDom, 'display') != 'none') {
                        lastDom = currDom;
                        break;
                    }
                }
                if(lastDom) {
                    useHeight += Rui.util.LDom.getY(lastDom) + lastDom.offsetHeight;
                    var marginTop = this.getStyle(lastDom, 'margin-top');
                    var marginBottom = this.getStyle(lastDom, 'margin-bottom');
                    if(marginTop !== 'auto')
                        useHeight += this.toPixelNumber(marginTop);
                    if(marginBottom !== 'auto')
                        useHeight += this.toPixelNumber(marginBottom);
                }
            }
            height = height - (useHeight + tPadding + bPadding);
            if(height < 0) height = 0;
            return height;
        },
        setSelectionRange: function(dom, begin, end){
            try{
                if (dom.setSelectionRange) {
                    dom.setSelectionRange(begin, end);
                }else if (dom.createTextRange) {
                    var range = dom.createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', end);
                    range.moveStart('character', begin);
                    range.select();
                }
            }catch(ex){}
        },
        getSelectionInfo: function(o) {
            var t = Rui.isUndefined(o.value) ? o.innerHTML : o.value, s = Rui.util.LDom.getSelectionStart(o), e = Rui.util.LDom.getSelectionEnd(o);
            if (s == Rui.util.LDom.CARET_START && e == Rui.util.LDom.CARET_END && s == e) return null;
            var selectedText = t.substring(s, e).replace(/ /g, '\xa0') || '\xa0';
            var preText = t.substring(0, s).replace(/ /g, '\xa0') || '\xa0';
            var afterText = t.substring(e, o.value.length).replace(/ /g, '\xa0') || '\xa0';
            var maxLength = t.length;
            var begin = s;
            var end = e;
            Rui.util.LDom.CARET_START = s;
            Rui.util.LDom.CARET_END = e;
            return {
                preText : preText,
                afterText : afterText,
                selectedText : selectedText,
                maxLength : maxLength,
                value : o.value,
                begin : begin,
                end : end
            };
        },
        getSelectionStart: function(s) {
            if (s.createTextRange && document.selection) { 
                var r = document.selection.createRange().duplicate();
                r.moveEnd('character', s.value.length);
                if (r.text == '') return s.value.length;
                return s.value.lastIndexOf(r.text);
            } else return s.selectionStart; 
        },
        getSelectionEnd: function(s) {
             if (s.createTextRange && document.selection) {
                 var r = document.selection.createRange().duplicate();
                 r.moveStart('character', -s.value.length);
                 return r.text.length;
             } else return s.selectionEnd;
        },
        getFormValues: function(id) {
            return this.getValues('input[type=text], input[type=password], input[type=hidden], textarea, input:checked, select:selected', id);
        },
        getValues: function(selector, id) {
            var obj = {};
            var el = Rui.get(id);
            var children = Rui.util.LDomSelector.query(selector, el.dom);
            Rui.util.LArray.each(children, function(child) {
                var f = Rui.get(child);
                var name = f.dom.name || f.dom.id;
                if(f.hasClass('empty')) return true;
                var value = f.get('value');
                if (f.dom.type == 'checkbox' || f.dom.type == 'radio') {
                    if (/LRadio/.test(f.dom.declaredClass)) {
                        if (value !== false) {
                            obj[name] = value;
                        }
                    } else {
                        var ary = obj[name];
                        if (!ary) {
                            ary = [];
                            obj[name] = ary;
                        }
                        if (value !== false) {
                            ary.push(value);
                        }
                    }
                } else {
                    obj[name] = value;
                }
            }, this);
            return obj;
        },
        getHiddenParent: function(dom, maxDepth) {
            var el = Rui.get(dom);
            maxDepth = maxDepth || 10;
            var depth = 0, parent, currEl = el;
            try{
                while ((parent = currEl.parent()) != null && depth < maxDepth) {
                    depth++;
                    if(currEl.getStyle('display') == 'none' || currEl.hasClass('L-hidden'))
                        return currEl.dom;
                    currEl = parent;
                }
                return null;
            } finally {
                currEl = parent = el = null;
            }
        },
        getParams: function() {
            var href = document.location.href;
            var i = href.indexOf('?');
            var params = {};
            if(i > 0) {
                var s1 = href.substring(i + 1).split('&');
                for (var i = 0, len = s1.length; i < len; i++) {
                    var s2 = s1[i].split('=');
                    params[s2[0]] = s2[1];
                }
            }
            return params;
        },
        toast: function(text, dom, options){
        	if(Rui.browser.msie && Rui.browser.version < 8) return;
            options = Rui.applyIf(options || {}, { delay: 1500 });
            this.toastList = this.toastList || [];
            for (var i = 0, len = this.toastList.length; i < len ; i++)
            	if(text == this.toastList[i].text) return;
            this.toastList.push({
            	dom: dom || document.body,
            	text: text,
            	options: options
            });
            var me = Rui.util.LDom;
            if(this.toastList.length > 0) {
            	var fn = function(e) {
                    if(!this.toastEl) {
                    	this.toastEl = Rui.createElements('<div class="L-toast"><div class="L-toast-inner"></div></div>');
                    	this.toastEl.appendTo(document.body);
                    }
                    if(this.toastList.length < 1) {
                    	if(me.laterObj) me.laterObj.cancel();
                    	me.laterObj = null;
                    	return;
                    }
                    var options = this.toastList[0].options;
                    this.toastEl.select('div').html(this.toastList[0].text);
                    this.toastEl.show();
                    if(options.x) {
                    	this.toastEl.setLeft(options.x);
                    } else {
                        var w = this.getViewportWidth();
                        w = (w / 2) - (this.toastEl.getWidth() / 2);
                        this.toastEl.setLeft(w);
                    }
                    if(options.y) {
                    	this.toastEl.setTop(options.y);
                    } else {
                        if(document.body !== this.toastList[0].dom) {
                        	var domEl = Rui.get(this.toastList[0].dom);
                        	var y = domEl.getY() + (domEl.getHeight() / 2) + 100;
                        	this.toastEl.setTop(y);
                        } else {
                        	var y = (this.getViewportHeight() / 2) + document.body.scrollTop + 100;
                        	this.toastEl.setTop(y);
                        }
                    }
                    this.toastEl.animate({
                        opacity: { from:1, to: 0 },
                        delay: options.delay,
                        callback: Rui.util.LFunction.createDelegate(function() {
                        	this.toastEl.setStyle('opacity', 1);
                        	this.toastEl.hide();
                        	this.toastList = Rui.util.LArray.removeAt(this.toastList, 0);
                        }, this)
                    });
            	};
            	if(this.toastList.length === 1) {
            		fn.call(this);
            	} else if(me.laterObj == null) {
            		me.laterObj = Rui.later(3000, this, fn, null, true);
            	}
            } else {
            	if(me.laterObj) me.laterObj.cancel();
            	me.laterObj = null;
            }
        },
        invokeFn: function(dom, scope, event) {
        	scope = scope || this;
        	var className = dom.className;
        	var css = className.split(' ');
        	for (var i = 0, len = css.length; i < len; i++) {
        		var cs = LString.trim(css[i]);
        		if(LString.startsWith(cs, 'L-fn-')) {
        			var sFn = cs.substring(5);
        			sFn = LString.getCamelToFunctionName(sFn);
        			var fn = null;
        			try {
            			fn = scope[sFn];
            			if(fn.call(scope, event) === false) return;
					} catch (e) {
						throw new Error('css function을 수행할 수 없습니다. : ' + cs + ' => ' + e.message);
					}
        		}
        	}
        }
    });
    Rui.util.LDom.CARET_START = 0;
    Rui.util.LDom.CARET_END = 0;
    var getXY = function() {
        if (document.documentElement.getBoundingClientRect) { 
            return function(el) {
                var box = el.getBoundingClientRect(),
                    round = Math.round;
                var rootNode = el.ownerDocument;
                return [round(box.left + Y.LDom.getDocumentScrollLeft(rootNode)), round(box.top + Y.LDom.getDocumentScrollTop(rootNode))];
            };
        } else {
            return function(el) { 
                var pos = [el.offsetLeft, el.offsetTop];
                var parentNode = el.offsetParent;
                var accountForBody = (isSafari && Y.LDom.getStyle(el, 'position') == 'absolute' && el.offsetParent == el.ownerDocument.body);
                if (parentNode != el) {
                    while (parentNode) {
                        pos[0] += parentNode.offsetLeft;
                        pos[1] += parentNode.offsetTop;
                        if (!accountForBody && isSafari &&
                                Y.LDom.getStyle(parentNode,'position') == 'absolute' ) {
                            accountForBody = true;
                        }
                        parentNode = parentNode.offsetParent;
                    }
                }
                if (accountForBody) { 
                    pos[0] -= el.ownerDocument.body.offsetLeft;
                    pos[1] -= el.ownerDocument.body.offsetTop;
                }
                parentNode = el.parentNode;
                while ( parentNode.tagName && !patterns.ROOT_TAG.test(parentNode.tagName) )
                {
                    if (parentNode.scrollTop || parentNode.scrollLeft) {
                        pos[0] -= parentNode.scrollLeft;
                        pos[1] -= parentNode.scrollTop;
                    }
                    parentNode = parentNode.parentNode;
                }
                return pos;
            };
        }
    }(); 
})();
Rui.util.LXml = {
    createDocument: function(docName) {
    	var xmlDoc = null;
    	if (Rui.browser.msie || Rui.browser.msie11) {
    		xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
    		xmlDoc.validateOnParse = false;
    		xmlDoc.resolveExternals = true;
    		xmlDoc.async = false;
    		xmlDoc.documentElement = xmlDoc.createElement(docName);
    	} else {
    		xmlDoc = document.implementation.createDocument('', docName, null);
    	}
        return xmlDoc;
    },
    createChild: function(el, name) {
    	var doc = el.ownerDocument;
    	var child = doc.createElement(name);
    	el.appendChild(child);
    	return child;
    },
    createTextValue: function(el, value, isCData) {
		var c = null;
		if (el.hasChildNodes() && (3 == el.firstChild.nodeType || 4 == el.firstChild.nodeType) && !isCData) {
			el.firstChild.nodeValue = value
		} else {
			if (isCData) {
				c = el.ownerDocument.createCDATASection(value);
			} else {
				c = el.ownerDocument.createTextNode(value);
			}
			el.appendChild(c);
		}
		return c;
    },
    serialize: function(doc) {
    	var s = null;
    	if (Rui.browser.msie || Rui.browser.msie11) {
    		s = doc.xml
    	} else {
    		s = new XMLSerializer().serializeToString(doc)
    	}
    	return s
    }
};
Rui.util.LKeyListener = function(attachTo, keyData, handler, event) {
    if(arguments.length == 1 && (typeof attachTo == 'object' && attachTo.keyData)){
        keyData = attachTo.keyData;
        handler = attachTo.handler;
        event = attachTo.event;
        attachTo = attachTo.applyTo || attachTo.attachTo;
    }
    if (!event) {
        event = Rui.util.LKeyListener.KEYDOWN;
    }
    var keyEvent = new Rui.util.LCustomEvent('keyPressed');
    this.enabledEvent = new Rui.util.LCustomEvent('enabled');
    this.disabledEvent = new Rui.util.LCustomEvent('disabled');
    if (typeof attachTo == 'string') {
        attachTo = document.getElementById(attachTo);
    }
    if (typeof handler == 'function') {
        keyEvent.on(handler);
    } else {
        keyEvent.on(handler.fn, handler.scope, handler.correctScope);
    }
    function handleKeyPress(e, obj) {
        if (! keyData.shift) {  
            keyData.shift = false; 
        }
        if (! keyData.alt) {    
            keyData.alt = false;
        }
        if (! keyData.ctrl) {
            keyData.ctrl = false;
        }
        if (e.shiftKey == keyData.shift && 
            e.altKey   == keyData.alt &&
            e.ctrlKey  == keyData.ctrl) { 
            var dataItem;
            if (keyData.keys instanceof Array) {
                for (var i=0;i<keyData.keys.length;i++) {
                    dataItem = keyData.keys[i];
                    if (dataItem == e.charCode ) {
                        keyEvent.fire(e.charCode, e);
                        break;
                    } else if (dataItem == e.keyCode) {
                        keyEvent.fire(e.keyCode, e);
                        break;
                    }
                }
            } else {
                dataItem = keyData.keys;
                if (dataItem == e.charCode ) {
                    keyEvent.fire(e.charCode, e);
                } else if (dataItem == e.keyCode) {
                    keyEvent.fire(e.keyCode, e);
                }
            }
        }
    }
    this.enable = function() {
        if (! this.enabled) {
            Rui.util.LEvent.addListener(attachTo, event, handleKeyPress);
            this.enabledEvent.fire(keyData);
        }
        this.enabled = true;
    };
    this.disable = function() {
        if (this.enabled) {
            Rui.util.LEvent.removeListener(attachTo, event, handleKeyPress);
            this.disabledEvent.fire(keyData);
        }
        this.enabled = false;
    };
    this.toString = function() {
        return 'LKeyListener [' + keyData.keys + '] ' + attachTo.tagName + (attachTo.id ? '[' + attachTo.id + ']' : '');
    };
};
Rui.util.LKeyListener.KEYDOWN = 'keydown';
Rui.util.LKeyListener.KEYUP = 'keyup';
Rui.namespace("util");
Rui.util.LCollection = function(){
    this.items = [];
    this.keys = [];
    this.map = {};
    this.length = 0;    
};
Rui.util.LCollection.prototype = {
    insert: function(idx, key, item) {
        if (arguments.length == 2) {
            item = key;
            key = key.id ? key.id : null;
        }
        if(idx >= this.length)
            return this.add(key, item);
        this.items.splice(idx, 0, item);
        this.keys.splice(idx, 0, key);
        if(!key) throw new Error('Can not find the key!');
        this.length++;
        this.map[key] = idx;
        this._updateIndex(idx);
    },
    add: function(key, item) {
        if (arguments.length == 1) {
            item = key;
            key = key.id ? key.id : null;
        }
        this.keys.push(key);
        this.items.push(item);
        this.map[key] = this.length;
        this.length++;
    },
    remove: function(key) {
        var idx = this.map[key];
        if(idx < 0 || typeof idx === 'undefined') return false;
        this.keys.splice(idx, 1);
        delete this.map[key];
        this.items.splice(idx, 1);
        this.length--;
        if(this.length < 0)
            throw new Rui.LException('Collection.remove() : IndexOutOfBoundsException ['+this.length+']');
        this._updateIndex(idx);
        return true;
    },
    _updateIndex: function(idx) {
        for (var i = idx, len = this.length; i < len; i++) {
            var key = this.keys[i];
            this.map[key] = i;
        }
    },
    indexOfKey: function(key) {
        var idx = this.map[key];
        return (typeof idx === 'undefined') ? -1 : idx;
    },
    get: function(key) {
        var idx = this.map[key];
        return this.items[idx];
    },
    set: function(key, item) {
        var idx = this.map[key];
        if(idx < 0 || typeof idx === 'undefined') {
            throw new Rui.LException('Collection.set() : IndexOutOfBoundsException['+idx+']');
        }
        this.items[idx] = item;
    },
    getKey: function(idx) {
        return this.keys[idx];
    },
    getAt: function(idx) {
        return this.items[idx];
    },
    has: function(key) {
        return (typeof this.map[key] !== 'undefined');
    },
    clear: function() {
        this.items = [];
        this.keys = [];
        this.map = {};
        this.length = 0;
    },
    each: function(func, scope) {
        var count = this.length;
        for (var i = 0 ; i < count; i++) {
            if(func.call(scope || window, this.keys[i], this.items[i], i, count) == false) 
                break;
        }
    },
    query: function(func, scope) {
        var newData = new Rui.util.LCollection();
        this.each(function(id, item, i, count){
            if(func.call(scope || this, id, item, i) === true) {
                newData.add(id, item);
            }
        }, this);
        return newData;
    },
    sort: function(fn, dir) {
        var desc = String(dir).toUpperCase() == "DESC" ? -1 : 1;
        var nItems = [];
        for (var i = 0, len = this.items.length; i < len; i++) {
            nItems[i] = {
                key: this.keys[i],
                value: this.items[i],
                index: i
            }
        }
        nItems.sort(function(a, b) {return fn(a, b, dir) * desc;});
        for (var i = 0, len = nItems.length; i < len; i++) {
            this.keys[i] = nItems[i].key;
            this.items[i] = nItems[i].value;
        }
        this._updateIndex(0);
        nItems = null;
    },
    reverse: function() {
        this.items.reverse();
        this._updateIndex(0);
    },
    clone: function() {
        var o = new Rui.util.LCollection();
        var len = this.length;
        for (var i = 0 ; i < len ; i++) {
            var key = this.getKey(i);
            o.insert(i, key, this.get(key));
        }
        return o; 
    },
    toString: function() {
        return 'Rui.util.LCollection ';
    }
};
Rui.util.LResizeMonitor = function(config){
    config = config || {};
    Rui.util.LResizeMonitor.superclass.constructor.call(this);
    Rui.applyObject(this, config, true);
    this.createEvent('contentResized');
};
Rui.extend(Rui.util.LResizeMonitor, Rui.util.LEventProvider, {
    otype: 'Rui.util.LResizeMonitor',
    onContentResized: function(e){
        if (this.resizeLock || !this.isNeedResizing()) return;
        this.resizeLock = true;
        this.fireEvent('contentResized', e);
        this.resizeLock = false;
    },
    onWindowResized: function(e){
        if(this.resizeLock || !this.isNeedResizing()) return;
        this.resizeLock = true;
        this.fireEvent('contentResized', e);
        this.initFrame();
        this.resizeLock = false;
    },
    isNeedResizing:function(){
        var dom = this.monitorDom;
        var result = false;
        if(dom){
            var w = Rui.get(dom).getWidth();
            result = w != 0 && w !== this.oldWidth ? true : false;
            if(result) this.oldWidth = w;
        }
        return result;
    },
    initFrame: function(){
        if(!this.ifrm) return;
        var ifrm = this.ifrm;
        if (!this.delayTaskIfrm) {
            this.delayTaskIfrm = new Rui.util.LDelayedTask(function(){
                this.resizeLock = true;
                ifrm.style.width = '0px';
                ifrm.style.width = '90%';
                this.resizeLock = false;
                this.delayTaskIfrm = null;
            }, this);
            this.delayTaskIfrm.delay(1);
        }  
    },
    monitor: function(target){
        if (!this.monitorDom) {
            this.monitorDom = typeof target === 'string' ? document.getElementById(target) : target;
            this.oldWidth = Rui.get(target).getWidth();
            this.monitorContentResizeByIFrame();
        }
    },
    monitorContentResizeByIFrame: function(){
        Rui.util.LEvent.addListener(window, 'resize', this.onWindowResized, this, true);
        var dom = this.monitorDom,
            wrap = document.createElement('div'),
            ifrm = document.createElement('iframe');
        wrap.className = 'L-grid-resize-monitor';
        wrap.style.height = '0px';
        wrap.style.overflow = 'hidden';
        dom.appendChild(wrap);
        ifrm.scrolling = 'no';
        ifrm.frameBorder = '0';
        ifrm.style.width = '90%';
        ifrm.style.height = '0px';
        wrap.appendChild(ifrm);
        if(Rui.browser.webkit) dom.style.overflow = 'hidden';
        if (!this.delayTask) {
            this.delayTask = new Rui.util.LDelayedTask(function(){
                var iframeWin = ifrm.contentWindow || ifrm.contentDocument;
                if (iframeWin) {
                    iframeWin = iframeWin.document ? iframeWin : iframeWin.parent;
                    this.bindResize(iframeWin);
                }
                this.delayTask = null;
            }, this);
            this.delayTask.delay(1);
        }
        this.ifrm = ifrm;
    },
    bindResize: function(dom) {
        Rui.util.LEvent.removeListener(dom, 'resize', this.onContentResized);
        Rui.util.LEvent.addListener(dom, 'resize', this.onContentResized, this, true);
    }
});
Rui.util.LDelayedTask = function(fn, scope, args){
    var me = this,
        id,
        call = function(){
            clearInterval(id);
            id = null;
            fn.apply(scope, args || []);
        };
    me.delay = function(delay, newFn, newScope, newArgs){
        me.cancel();
        fn = newFn || fn;
        scope = newScope || scope;
        args = newArgs || args;
        id = setInterval(call, delay);
    };
    me.cancel = function(){
        if(id){
            clearInterval(id);
            id = null;
        }
    };
};
 Rui.namespace('Rui.util');
(function(){
    Rui.util.LFormat = {
        numberFormatFn: [],
        moneyFormatFn: [],
        stringToDate: function(sDate, config){
            if(sDate){
            	if(sDate.getFullYear) return sDate;
                var r, dates, yyyy, MM, dd, HH, mm, ss;
                if(!config){
                    if(sDate.length !== 10 || sDate.indexOf('-') < 0) return false;
                    dates = sDate.split('-');
                    yyyy = parseInt(dates[0], 10);
                    MM = parseInt(dates[1], 10);
                    dd = parseInt(dates[2], 10);
                    r = new Date(yyyy, MM-1, dd);
                }else{
                    if(config && config.format === '%Y%m%d'){
                        if(sDate.length !== 8) return false;
                        yyyy = parseInt(sDate.substring(0, 4), 10);
                        MM = parseInt(sDate.substring(4, 6), 10);
                        dd = parseInt(sDate.substring(6, 8), 10);
                        r = new Date(yyyy, MM-1, dd);
                    }else if(config && (config.format === '%Y%m%d%H%M%s' || config.format === '%X')){
                        if(sDate.length !== 14) return false;
                        yyyy = parseInt(sDate.substring(0, 4), 10);
                        MM = parseInt(sDate.substring(4, 6), 10);
                        dd = parseInt(sDate.substring(6, 8), 10);
                        HH = parseInt(sDate.substring(8, 10), 10);
                        mm = parseInt(sDate.substring(10, 12), 10);
                        ss = parseInt(sDate.substring(12, 14), 10);
                        r = new Date(yyyy, MM-1, dd, HH, mm, ss);
                    }else{
                        r = Rui.util.LDate.parse(sDate, config);
                    }
                }
                if(!(r instanceof Date)) return false;
                if(yyyy && MM && dd){
                	if(r.getFullYear() != yyyy || r.getMonth()+1 !== MM || r.getDate() !== dd) return false;
                }
                if(HH && mm && ss){
                    if(r.getHours() != HH || r.getMinutes() !== mm || r.getSeconds() !== ss) return false;
                }
                return r;
            }else{
                return sDate;
            }
        },
        stringToDateByTypeQ: function(sDate) {
            return Rui.util.LFormat.stringToDate(sDate, { format: '%Y%m%d' });
        },
        stringToTimestamp: function(sDate, oConfig){
            if(sDate){
            	if(sDate.getFullYear) return sDate;
                if(!oConfig){
                    if(sDate.length > 8)
                        sDate = (sDate.charAt(10) == ' ') ? sDate.substring(0, 10) + sDate.substring(11) : sDate;
                    sDate = sDate.replace(/[\s-|:|.]/g, '')
                    var yyyy = parseInt(sDate.substring(0, 4), 10);
                    var MM = parseInt(sDate.substring(4, 6), 10)-1;
                    var dd = parseInt(sDate.substring(6, 8), 10);
                    var HH = 0;
                    var mm = 0;
                    var ss = 0;
                    var ms = 0;
                    if(sDate.length > 8) {
                        HH = parseInt(sDate.substring(8, 10), 10);
                        mm = parseInt(sDate.substring(10, 12), 10);
                        ss = parseInt(sDate.substring(12, 14), 10);
                        if(sDate.length > 14)
                            ms = parseInt(sDate.substring(14), 10);
                    }
                    return new Date(yyyy,MM,dd,HH,mm,ss,ms);
                }else{
                    return Rui.util.LDate.parse(sDate, oConfig);
                }
            }
            else
            {
                return sDate;
            }
        },
        dateToString: function(oDate, oConfig){
            if(!oDate || (oDate && isNaN(oDate.getDay()))){
                return '';
            }
            return Rui.util.LDate.format(oDate, oConfig);
        },
        numberFormat: function(v, locale) {
            locale = locale || Rui.getConfig().getFirst('$.core.defaultLocale');
            if(!Rui.util.LFormat.numberFormatFn[locale]) {
                if(!Rui.message.locale[locale])
                    Rui.getMessageManager().load({locale:locale});
                Rui.util.LFormat.numberFormatFn[locale] = Rui.message.locale[locale].numberFormat;
            }
            return Rui.util.LFormat.numberFormatFn[locale].call(this, v);
        },
        moneyFormat: function(v, locale) {
            locale = locale || Rui.getConfig().getFirst('$.core.defaultLocale');
            if(!Rui.util.LFormat.moneyFormatFn[locale]) {
                if(!Rui.message.locale[locale])
                    Rui.getMessageManager().load({locale:locale});
                Rui.util.LFormat.moneyFormatFn[locale] = Rui.message.locale[locale].moneyFormat;
            }
            return Rui.util.LFormat.moneyFormatFn[locale].call(this, v);
        },
        rateFormat: function(v, rate, point) {
            var format = new Object();
            format.decimalPlaces = point || {};
            format.suffix = rate;
            return Rui.util.LNumber.format(v, format);
        },
        timeFormat: function (sTime, oConfig) {
            oConfig = oConfig || {};
            var format = '%Y%m%d%H%M%S';
            if(sTime == null || sTime == undefined || sTime.length == 0)
                return '';
            var length = sTime.length;
            if(length > 6) {
                sTime = sTime.substr(0, 6);
            } else {
                sTime = sTime + '';
                for (var idx = 0; idx < (6-length); idx++) 
                    sTime = sTime + '0';
            }
            var sDate = '20090909' + sTime;
            var oDate = Rui.util.LDate.parse(sDate, {format:format,locale:oConfig.locale});
            if (oConfig.format == undefined || oConfig.format == null)
                oConfig.format = '%T';
            return Rui.util.LDate.format(oDate, oConfig);
        },
        weightFormat: function(v, unit, thousandsSeparator, point) {
            var format = new Object();
            format.decimalPlaces = point || {};
            format.suffix = unit || {};
            if(thousandsSeparator) {
                format.thousandsSeparator = ',';
            }
            return Rui.util.LNumber.format(v, format);
        },
        lengthFormat: function(v, unit, thousandsSeparator, point) {
            var format = new Object();
            format.decimalPlaces = point || {};
            format.suffix = unit || {};
            if(thousandsSeparator) {
                format.thousandsSeparator = ',';
            }
            return Rui.util.LNumber.format(v, format);
        },
        rendererWrapper: function(fnName) {
            var fn = eval('Rui.util.LFormat.' + fnName);
            var a=arguments;
            var param = [];
            for (var i = 1 ; i < a.length; i++)
                param.push(a[i]);
            return function(v){
                return fn.call(v, param);
            };
        }
     };
 })();
Rui.namespace('Rui.util');
Rui.util.LRenderer = {
    dateRenderer: function(format,locale){
        return function(v){
            return Rui.util.LFormat.dateToString(v, {format:format,locale:locale});
        };
    },
    numberRenderer: function() {
        return function(v){
            return Rui.util.LFormat.numberFormat(v);
        };
    },
    moneyRenderer: function(currency) {
        return function(v){
            return Rui.util.LFormat.moneyFormat(v, currency);
        };
    },
    rateRenderer: function(point) {
        return function(v){
            return Rui.util.LFormat.rateFormat(v, '%', point);
        };
    },
    timeRenderer: function (format) {
        return function(v){
            return Rui.util.LFormat.timeFormat(v, {format:format});
        };
    },
    weightRenderer: function(unit, thousandsSeparator, point) {
        return function(v){
            return Rui.util.LFormat.weightFormat(v, unit, thousandsSeparator, point);
        };
    },
    lengthRenderer: function(unit, thousandsSeparator, point) {
        return function(v){
            return Rui.util.LFormat.lengthFormat(v, unit, thousandsSeparator, point);
        };
    },
    popupRenderer: function(type) {
    	if(type === Rui.data.LRecord.STATE_INSERT) {
            return function(val, p, record, row, i) {
                val = (Rui.isEmpty(val)) ? '&nbsp;' : val;
                if(p.excel || p.clipboard) return val;
                if(record.getState() === Rui.data.LRecord.STATE_INSERT) {
                    p.editable = true;
                    return '<div class="L-popup-renderer">' + 
                        '<div class="L-popup-button">' + val + '</div>' + 
                        '<span class="L-popup-button-icon L-ignore-event" style="position:absolute">&nbsp;</span>' + 
                        '</div>';
                } else {
                    p.editable = false;
                    return val;
                }
            };
    	} else {
            return function(val, p, record, row, i) {
                val = (Rui.isEmpty(val)) ? '&nbsp;' : val;
                if(p.excel || p.clipboard) return val;
                p.editable = true;
                return '<div class="L-popup-renderer">' + 
                    '<div class="L-popup-button">' + val + '</div>' + 
                    '<span class="L-popup-button-icon L-ignore-event" style="position:absolute">&nbsp;</span>' + 
                    '</div>';
            };
    	}
    }
};
(function () {
    Rui.util.LPlugin = function (config) {
        config = config || {};
        Rui.applyObject(this, config, true);
    };
    Rui.extend(Rui.util.LPlugin, Rui.util.LEventProvider, {
        initPlugin: function(parent) {
            for (m in this) {
                if(m != 'constructor' && m != 'initPlugin' && !Rui.util.LEventProvider.prototype[m] && !Rui.util.LString.startsWith(m, '_')) {
                    parent[m] = this[m];
                }
            }
        },
        updatePlugin: Rui.emptyFn,
        updatePluginView: Rui.emptyFn
    });
}());
Rui.util.LRegion = function(t, r, b, l) {
    this.top = t;
    this[1] = t;
    this.right = r;
    this.bottom = b;
    this.left = l;
    this[0] = l;
};
Rui.util.LRegion.prototype.contains = function(region) {
    return (
        region.left   >= this.left   && 
        region.right  <= this.right  && 
        region.top    >= this.top    && 
        region.bottom <= this.bottom
    );
};
Rui.util.LRegion.prototype.getArea = function() {
    return ( (this.bottom - this.top) * (this.right - this.left) );
};
Rui.util.LRegion.prototype.intersect = function(region) {
    var t = Math.max( this.top,    region.top    );
    var r = Math.min( this.right,  region.right  );
    var b = Math.min( this.bottom, region.bottom );
    var l = Math.max( this.left,   region.left   );
    if (b >= t && r >= l) {
        return new Rui.util.LRegion(t, r, b, l);
    } else {
        return null;
    }
};
Rui.util.LRegion.prototype.union = function(region) {
    var t = Math.min( this.top,    region.top    );
    var r = Math.max( this.right,  region.right  );
    var b = Math.max( this.bottom, region.bottom );
    var l = Math.min( this.left,   region.left   );
    return new Rui.util.LRegion(t, r, b, l);
};
Rui.util.LRegion.prototype.toString = function() {
    return ( 'Region {'    +
         'top: '       + this.top    + 
         ', right: '   + this.right  + 
         ', bottom: '  + this.bottom + 
         ', left: '    + this.left   + 
         '}' );
};
Rui.util.LRegion.getRegion = function(el) {
    var p = Rui.util.LDom.getXY(el);
    var t = p[1];
    var r = p[0] + el.offsetWidth;
    var b = p[1] + el.offsetHeight;
    var l = p[0];
    return new Rui.util.LRegion(t, r, b, l);
};
Rui.util.LPoint = function(x, y) {
    if (Rui.isArray(x)) { 
        y = x[1]; 
        x = x[0];
    }
    this.x = this.right = this.left = this[0] = x;
    this.y = this.top = this.bottom = this[1] = y;
};
Rui.util.LPoint.prototype = new Rui.util.LRegion();
Rui.namespace('Rui.webdb');
Rui.webdb.LAbstractProvider = function(){
    this.storage = {};
    this.createEvent('stateChanged');
    Rui.webdb.LAbstractProvider.superclass.constructor.call(this);
};
Rui.webdb.LAbstractProvider.isLocalStorageSupported = function(){
    var k = '_rui_ls_test',
        s = window.localStorage;
    try{
    	s.setItem(k, '1'); 
    	s.removeItem(k);
    	return true;
    }catch(e){ return false; }
};
Rui.extend(Rui.webdb.LAbstractProvider, Rui.util.LEventProvider, {
    useLocalStorage: true,
    isLocalStorage: function() {
        return !(typeof localStorage === 'undefined');
    },
    get: function(key, defaultValue){
        var val = (this.useLocalStorage && this.isLocalStorage()) ? localStorage.getItem(key) : this.storage[key];
        return val || defaultValue;
    },
    set: function(key, value){
        if(this.useLocalStorage && this.isLocalStorage()) {
            localStorage.setItem(key, value);
        } else {
            this.storage[key] = value;
        }
        this.fireEvent('stateChanged', { target: this, type:'set', key: key, value: value});
        return this;
    },
    remove: function(key){
        if (this.useLocalStorage && this.isLocalStorage()) {
            localStorage.removeItem(key);
        } else {
            var value = this.storage[key];
            delete this.storage[key];
        }
        this.fireEvent('stateChanged', { target: this, type:'remove', key: key, value: value});
        return this;
    },
    clear: function(){
        if (this.useLocalStorage && this.isLocalStorage())
            localStorage.clear();
        else
            this.storage = {};
        return this;
    }
});
Rui.namespace('Rui.webdb');
Rui.webdb.LCookieProvider = function(oConfig){
    Rui.webdb.LCookieProvider.superclass.constructor.call(this);
    this.domain = null;
    this.expires = new Date(new Date().getTime() + (1000 * 60 * 60 * 24)); 
    this.path = '/';
    this.secure = false;
    var config = oConfig || {};
    Rui.applyObject(this, config);
    this.storage = Rui.util.LCookie._parseCookieString(document.cookie);
};
Rui.extend(Rui.webdb.LCookieProvider, Rui.webdb.LAbstractProvider, {
    useLocalStorage: false,
    set: function(name, value){
        if (!Rui.isString(name)) {
            throw new TypeError('LCookieProvider.set(): Argument must be an string.');
        }
        if (Rui.isUndefined(value)) {
            throw new TypeError('LCookieProvider.set(): Value cannot be undefined.');
        }
        document.cookie = Rui.util.LCookie._createCookieString(name, value, false, this);
        Rui.webdb.LCookieProvider.superclass.set.call(this, name, value);
        return this;
    },
    remove: function(name){
        if (!Rui.isString(name)) {
            throw new TypeError('LCookieProvider.set(): Argument must be an string.');
        }
        Rui.util.LCookie.remove(name);
        Rui.webdb.LCookieProvider.superclass.remove.call(this, name);
        return this;
    }
});
Rui.namespace('Rui.webdb');
Rui.webdb.LWebStorage = function(provider){
    this.provider = provider;
    if(this.provider == null || !(provider instanceof Rui.webdb.LAbstractProvider)) {
        this.provider = Rui.webdb.LAbstractProvider.isLocalStorageSupported() ? new Rui.webdb.LAbstractProvider() : new Rui.webdb.LCookieProvider();
    }
};
Rui.webdb.LWebStorage.prototype = {
    get: function(key, defaultValue){
        return this.provider.get(key, defaultValue);
    },
    getBoolean: function(key, defaultValue){
        var v = this.get(key, defaultValue);
        return String(v) == 'true';
    },
    getInt: function(key, defaultValue){
        return parseInt(this.get(key, defaultValue), 10);
    },
    getString: function(key, defaultValue){
        return this.get(key, defaultValue) + '';
    },
    set: function(key, value){
        this.provider.set(key, value);
        return this;
    },
    remove: function(key){
        this.provider.remove(key);
        return this;
    },
    clear: function(key){
        this.provider.clear(key);
        return this;
    },
    setProvider: function(provider) {
        this.provider = provider;
        return this;
    },
    getProvider: function() {
        return this.provider;
    }
};
Rui.namespace('Rui.config');
Rui.config.LConfigurationProvider = function(config){
    Rui.config.LConfigurationProvider.superclass.constructor.call(this);
    this.data = null;
    config = config || {};
    Rui.applyObject(this, config, true);
    this.reload();
};
Rui.extend(Rui.config.LConfigurationProvider, Rui.webdb.LAbstractProvider, {
    useLocalStorage: false,
    get: function(name) {
        var value = Rui.config.LConfigurationProvider.superclass.get.call(this, name);
        if(Rui.isUndefined(value)== false) {
            return value;
        } else {
            value = Rui.util.LJson.jsonPath(this.data, name, {resultType: 'VALUE'});
            if (value === false) {
                value = null;
            }
            else {
                this.storage[name] = value;
            } 
            return value;
        }
    },
    set: function(name, value){
        if (!Rui.isString(name)) {
            throw new TypeError('LConfigurationProvider.set(): Argument must be an string.');
        } 
        if (Rui.isUndefined(value)) {
            throw new TypeError('LConfigurationProvider.set(): Value cannot be undefined.');
        }
        var nameList = name.split('.'), i = 1, dataObj = this.data;
        for (; i < nameList.length - 1; i++) {
            if(!dataObj[nameList[i]])
                dataObj[nameList[i]] = {};
            dataObj = dataObj[nameList[i]];
        }
        dataObj[nameList[i]] = value;
        Rui.config.LConfigurationProvider.superclass.set.call(this, name, value);
        return this;
    },
    remove: function(name){
        if (!Rui.isString(name)) {
            throw new TypeError('LConfigurationProvider.set(): Argument must be an string.');
        }
        Rui.config.LConfigurationProvider.superclass.remove.call(this, name);
        return this;
    },
    reload: function() {
        if(Rui.isNull(this.data) || !this.data.base) {
            if(Rui.isUndefined(Rui.config.ConfigData)) {
            	try{ debugger; } catch(e) {}
            	throw new Error('LConfiguration not initialized.');
            }
            this.data = Rui.config.ConfigData;
        }
        this.storage = {};
        return this;
    },
    isLoad: function() {
        return this.data && this.data.core ? true : false;
    }
});
Rui.namespace('Rui.config');
Rui.config.LConfiguration = function(){
    if(Rui.config.LConfiguration.caller != Rui.config.LConfiguration.getInstance){
        throw new Rui.LException("Can't call the constructor method.", this);
     }
    Rui.config.LConfiguration.superclass.constructor.call(this);
    this.provider = new Rui.config.LConfigurationProvider();
};
Rui.config.LConfiguration.instanceObj = null;
Rui.config.LConfiguration.getInstance = function() {
    if(this.instanceObj == null){
        this.instanceObj = new Rui.config.LConfiguration(new Rui.config.LConfigurationProvider());
    }
    return this.instanceObj ;
};
Rui.extend(Rui.config.LConfiguration, Rui.webdb.LWebStorage, {
    otype: 'Rui.config.LConfiguration',
    reload: function() {
        this.provider.reload();
        return this;
    },
    getFirst: function(key, defaultValue) {
        var list = this.get(key);
        if(list != null && list.length > 0) {
            return (Rui.isArray(list)) ? list[0] : list;
        } 
        return defaultValue ? defaultValue : null;
    } 
});
Rui.namespace('Rui.message');
Rui.message.LMessageManager = function(oConfig) {
    Rui.message.LMessageManager.superclass.constructor.call(this);
    this.localeData = {};
    this.currentLocale = Rui.getConfig().getFirst('$.core.defaultLocale') || 'ko_KR';
    if(this.useApplyDefaultMessage) {
        var currentLocaleData = this.localeData[this.currentLocale];
        if(!currentLocaleData) {
            var defaultMessage = Rui.getConfig().get('$.core.message.defaultMessage');
            if(!defaultMessage || (defaultMessage && !defaultMessage[0])) {
                if(Rui.message && Rui.message.locale && Rui.message.locale.ko_KR )
                    defaultMessage = Rui.message.locale.ko_KR;
                else {
                    this.load({locale:this.currentLocale});
                    defaultMessage = Rui.message.locale[this.currentLocale];
                }
            } else
                defaultMessage = defaultMessage[0];
            this.localeData[this.currentLocale] = defaultMessage;
        }
    }
    this.createEvent('createRootLocale');
    if(Rui.isObject(oConfig)) {
        if(oConfig.locale) {
            this.currentLocale = oConfig.locale;
        }
        if(oConfig.useAutoLoad) {
            this.useAutoLoad = oConfig.useAutoLoad;
        }
    }
};
Rui.extend(Rui.message.LMessageManager, Rui.util.LEventProvider, {
    useAutoLoad: true,
    useApplyDefaultMessage: true,
    setLocale: function(currentLocale) {
        this.currentLocale = currentLocale;
        this.load({locale:this.currentLocale});
        return this;
    },
    addLocaleData: function(localeData) {
        if(!localeData.locale) {
            throw new TypeError('LMessageManager.addLocaleData(): Not found locale attribute in localeData.');
        }
        var oldData = this.localeData[localeData.locale] || null;
        if(!oldData) {
        	if(Rui.message.locale[localeData.locale]) {
        		oldData = Rui.message.locale[localeData.locale];
        		this.localeData[localeData.locale] = oldData;
        	} else {
            	this.load({locale:localeData.locale});
        	}
        	oldData = oldData || {};
        }
        var rootLevel = Rui.message.LMessageManager.ROOT_LEVEL;
        for (var i = 0 ; i < rootLevel.length ; i++) {
            if(!oldData[rootLevel[i]]) {
                oldData[rootLevel[i]] = {};
            }
        }
        for (var i = 0 ; i < rootLevel.length ; i++) {
            var levelCode = rootLevel[i];
            for (m in localeData[levelCode]) {
                if(!Object.prototype[m]) {
                    oldData[levelCode][m] = localeData[levelCode][m];
                }
            }
        }
        this.localeData[localeData.locale] = oldData;
        return this;
    },
    get: function(name, paramArray, locale) {
        if(Rui.isUndefined(name)) {
            throw new TypeError('LMessageManager.get(): not found name attribute. [name: ' + name + ']');
        }
        if(!Rui.isUndefined(locale)) this.setLocale(locale);
        var currentLocaleData = this.localeData[this.currentLocale];
        var message = currentLocaleData ? Rui.util.LJson.jsonPath(currentLocaleData, name, {resultType: 'VALUE'})[0] : null;
        if(Rui.isNull(message) || Rui.isUndefined(message)) {
        	var currentLocale = this.currentLocale;
    		if(this.useApplyDefaultMessage) {
        		var defaultLocale = Rui.getConfig().getFirst('$.core.defaultLocale');
        		currentLocale = defaultLocale;
        		currentLocaleData = this.localeData[currentLocale];
    		}
            if(this.useAutoLoad) {
            	if(!currentLocaleData)
            		this.load({locale:currentLocale});
                currentLocaleData = this.localeData[currentLocale];
                if (!currentLocaleData) {
                    throw new Error('LMessageManager.get(): Not found message Data. [' + name + ':' + this.currentLocale + ']');
                }
                message = Rui.util.LJson.jsonPath(currentLocaleData, name, {resultType: 'VALUE'})[0];
            } else {
                throw new Error('LMessageManager.get(): Not found message Data. : [' + name + ':' + this.currentLocale + ']');
            }
        }
        if (Rui.isNull(message) || Rui.isUndefined(message)) {
            throw new Error('LMessageManager.get(): Not found message Data. : [' + name + ':' + this.currentLocale + ']');
        }
        if(message === false)
            return null;
        var index = 0;
        var count = 0;
        if (paramArray == null) {
            return message;
        }
        while ( (index = message.indexOf('@', index)) != -1) {
            if (paramArray[count] == null) {
                paramArray[count] = '';
            }
            message = message.substr(0, index) + String(paramArray[count]) +
                      message.substring(index + 1);
            index = index + String(paramArray[count++]).length;
        }
        return message;
    },
    load: function(oConfig) {
        oConfig = oConfig ? oConfig : {locale:this.currentLocale};
        this.createRootLocale(oConfig);
        var ruiRootPath = Rui.getRootPath();
        var localePath = Rui.getConfig().getFirst('$.core.message.localePath');
        if(!oConfig.jsFile) {
            oConfig.jsFile = 'lang-' + oConfig.locale + '.js';
        }
        Rui.includeJs(ruiRootPath + localePath + '/' + oConfig.jsFile, true);
        var currentLocaleData = eval('Rui.message.locale.' + oConfig.locale);
        this.addLocaleData(currentLocaleData);
        return this;
    },
    createRootLocale: function(oConfig) {
        this.fireEvent('createRootLocale');
        var localeObj = eval('Rui.message.locale.' + oConfig.locale);
        if(Rui.isUndefined(localeObj)) {
            Rui.namespace('Rui.message.locale.' + oConfig.locale);
        }
    }
});
Rui.message.LMessageManager.ROOT_LEVEL = ['core', 'base', 'ext', 'message'];
function connectDebugger() {
    var manager = new Rui.webdb.LWebStorage(new Rui.webdb.LCookieProvider());
    Rui.isDebug = manager.get('debugYn', 'true') == 'true';
    Rui.isDebugDE = manager.get('debugDEYn', 'false') == 'true';
    Rui.isDebugIN = manager.get('debugINYn', 'false') == 'true';
    Rui.isDebugWA = manager.get('debugWAYn', 'false') == 'true';
    Rui.isDebugER = manager.get('debugERYn', 'true') == 'true';
    Rui.isDebugTI = manager.get('debugTIYn', 'false') == 'true';
    Rui.isDebugWI = manager.get('debugWIYn', 'false') == 'true';
    Rui.isDebugEV = manager.get('debugEVYn', 'false') == 'true';
    Rui.isDebugCR = manager.get('debugCRYn', 'false') == 'true';
    Rui.isDebugXH = manager.get('debugXHYn', 'false') == 'true';
    if(Rui.isDebug) {
        Rui.log('connect start', 'info', 'Global');
    }
}
connectDebugger();
Rui.namespace('Rui.fx');
Rui.fx.LAnim = function(config) {
    config = config || {};
    if(config.applyTo)
        config.el = config.applyTo;
    this.init(config);
    this.createEvent('start');
    this.createEvent('tween');
    this.createEvent('complete');
};
Rui.extend(Rui.fx.LAnim, Rui.util.LEventProvider, {
    otype: 'Rui.fx.LAnim',
    patterns: { 
        noNegatives: /width|height|opacity|padding/i, 
        offsetAttribute: /^((width|height)|(top|left))$/, 
        defaultUnit: /width|height|top$|bottom$|left$|right$/i, 
        offsetUnit: /\d+(em|%|en|ex|pt|in|cm|mm|pc)$/i 
    },
    doMethod: function(attr, start, end) {
        return this.method(this.currentFrame, start, end - start, this.totalFrames);
    },
    setAttribute: function(attr, val, unit) {
        if ( this.patterns.noNegatives.test(attr) ) {
            val = (val > 0) ? val : 0;
        }
        Rui.util.LDom.setStyle(this.getEl(), attr, val + unit);
    },
    getAttribute: function(attr) {
        var el = this.getEl();
        var val = Rui.util.LDom.getStyle(el, attr);
        if (val !== 'auto' && !this.patterns.offsetUnit.test(val)) {
            return parseFloat(val);
        }
        var a = this.patterns.offsetAttribute.exec(attr) || [];
        var pos = !!( a[3] ); 
        var box = !!( a[2] ); 
        if ( box || (Rui.util.LDom.getStyle(el, 'position') == 'absolute' && pos) ) {
            val = el['offset' + a[0].charAt(0).toUpperCase() + a[0].substr(1)];
        } else { 
            val = 0;
        }
        return val;
    },
    getDefaultUnit: function(attr) {
        if ( this.patterns.defaultUnit.test(attr) ) {
           return 'px';
        }
        return '';
    },
    setRuntimeAttribute: function(attr) {
        var start;
        var end;
        var attributes = this.attributes;
        this.runtimeAttributes[attr] = {};
        var isset = function(prop) {
            return (typeof prop !== 'undefined');
        };
        if ( !isset(attributes[attr]['to']) && !isset(attributes[attr]['by']) ) {
            return false; 
        }
        start = ( isset(attributes[attr]['from']) ) ? attributes[attr]['from'] : this.getAttribute(attr);
        if ( isset(attributes[attr]['to']) ){
            end = attributes[attr]['to'];
        }else if( isset(attributes[attr]['by']) ){
            if (start.constructor == Array) {
                end = [];
                for (var i = 0, len = start.length; i < len; ++i) {
                    end[i] = start[i] + attributes[attr]['by'][i] * 1; 
                }
            } else {
                end = start + attributes[attr]['by'] * 1;
            }
        }
        this.runtimeAttributes[attr].start = start;
        this.runtimeAttributes[attr].end = end;
        this.runtimeAttributes[attr].unit = ( isset(attributes[attr].unit) ) ? attributes[attr]['unit'] : this.getDefaultUnit(attr);
        return true;
    },
    init: function(config) {
        var isAnimated = false;
        var startTime = null;
        var actualFrames = 0; 
        var el = config.el ? Rui.util.LDom.get(config.el) : null;
        this.attributes = config.attributes || {};
        this.duration = !Rui.isUndefined(config.duration) ? config.duration : 1;
        this.method = config.method || Rui.fx.LEasing.easeNone;
        this.useSeconds = true; 
        this.currentFrame = 0;
        this.totalFrames = Rui.fx.LAnimManager.fps;
        this.setEl = function(element) {
            el = Rui.util.LDom.get(element);
        };
        this.getEl = function() { return el; };
        this.isAnimated = function() {
            return isAnimated;
        };
        this.getStartTime = function() {
            return startTime;
        };        
        this.runtimeAttributes = {};
        this.animate = function() {
            if ( this.isAnimated() || !el) {
                return false;
            }
            this.currentFrame = 0;
            this.totalFrames = ( this.useSeconds ) ? Math.ceil(Rui.fx.LAnimManager.fps * this.duration) : this.duration;
            if (this.duration === 0 && this.useSeconds) { 
                this.totalFrames = 1; 
            }
            Rui.fx.LAnimManager.registerElement(this);
            return true;
        };
        this.stop = function(finish) {
            if (!this.isAnimated()) { 
                return false;
            }
            if (finish) {
                 this.currentFrame = this.totalFrames;
                 this.tween();
            }
            Rui.fx.LAnimManager.stop(this);
        };
        this.start = function() {
            this.fireEvent('start');
            this.runtimeAttributes = {};
            for (var attr in this.attributes) {
                this.setRuntimeAttribute(attr);
            }
            isAnimated = true;
            actualFrames = 0;
            startTime = new Date(); 
        };
        this.tween = function() {
            var data = {
                duration: new Date() - this.getStartTime(),
                currentFrame: this.currentFrame
            };
            data.toString = function() {
                return (
                    'duration: ' + data.duration +
                    ', currentFrame: ' + data.currentFrame
                );
            };
            this.fireEvent('tween', data);
            var runtimeAttributes = this.runtimeAttributes;
            for (var attr in runtimeAttributes) {
                this.setAttribute(attr, this.doMethod(attr, runtimeAttributes[attr].start, runtimeAttributes[attr].end), runtimeAttributes[attr].unit); 
            }
            actualFrames += 1;
        };
        this.complete = function() {
            var actual_duration = (new Date() - startTime) / 1000 ;
            var data = {
                duration: actual_duration,
                frames: actualFrames,
                fps: actualFrames / actual_duration
            };
            data.toString = function() {
                return (
                    'duration: ' + data.duration +
                    ', frames: ' + data.frames +
                    ', fps: ' + data.fps
                );
            };
            isAnimated = false;
            actualFrames = 0;
            this.fireEvent('complete', data);
        };
    },
    toString: function() {
        var el = this.getEl() || {};
        var id = el.id || el.tagName;
        return (this.otype + ': ' + id);
    }
});
Rui.fx.LAnimManager = new function() {
    var thread = null;
    var queue = [];
    var tweenCount = 0;
    this.fps = 1000;
    this.delay = 1;
    this.registerElement = function(tween) {
        queue[queue.length] = tween;
        tweenCount += 1;
        tween.start();
        this.start();
    };
    this.unRegister = function(tween, index) {
        index = index || getIndex(tween);
        if (!tween.isAnimated() || index == -1) {
            return false;
        }
        tween.complete();
        queue.splice(index, 1);
        tweenCount -= 1;
        if (tweenCount <= 0) {
            this.stop();
        }
        return true;
    };
    this.start = function() {
        if (thread === null) {
            thread = setInterval(this.run, this.delay);
        }
    };
    this.stop = function(tween) {
        if (!tween) {
            clearInterval(thread);
            for (var i = 0, len = queue.length; i < len; ++i) {
                this.unRegister(queue[0], 0);  
            }
            queue = [];
            thread = null;
            tweenCount = 0;
        } else {
            this.unRegister(tween);
        }
    };
    this.run = function() {
        for (var i = 0, len = queue.length; i < len; ++i) {
            var tween = queue[i];
            if (!tween || !tween.isAnimated()) { continue; }
            if (tween.currentFrame < tween.totalFrames || tween.totalFrames === null){
                tween.currentFrame += 1;
                if(tween.useSeconds){
                    correctFrame(tween);
                }
                tween.tween();
            }else{ 
                Rui.fx.LAnimManager.stop(tween, i);
            }
        }
    };
    var getIndex = function(anim) {
        for (var i = 0, len = queue.length; i < len; ++i) {
            if (queue[i] == anim) {
                return i; 
            }
        }
        return -1;
    };
    var correctFrame = function(tween) {
        var frames = tween.totalFrames;
        var frame = tween.currentFrame;
        var expected = (tween.currentFrame * tween.duration * 1000 / tween.totalFrames);
        var elapsed = (new Date() - tween.getStartTime());
        var tweak = 0;
        if (elapsed < tween.duration * 1000) { 
            tweak = Math.round((elapsed / expected - 1) * tween.currentFrame);
        } else { 
            tweak = frames - (frame + 1); 
        }
        if (tweak > 0 && isFinite(tweak)) { 
            if (tween.currentFrame + tweak >= frames) {
                tweak = frames - (frame + 1);
            }
            tween.currentFrame += tweak;      
        }
    };
};
Rui.fx.LEasing = {
    easeNone: function (t, b, c, d) {
        return c*t/d + b;
    },
    easeIn: function (t, b, c, d) {
        return c*(t/=d)*t + b;
    },
    easeOut: function (t, b, c, d) {
        return -c *(t/=d)*(t-2) + b;
    },
    easeBoth: function (t, b, c, d) {
        if ((t/=d/2) < 1) {
            return c/2*t*t + b;
        }
        return -c/2 * ((--t)*(t-2) - 1) + b;
    },
    easeInStrong: function (t, b, c, d) {
        return c*(t/=d)*t*t*t + b;
    },
    easeOutStrong: function (t, b, c, d) {
        return -c * ((t=t/d-1)*t*t*t - 1) + b;
    },
    easeBothStrong: function (t, b, c, d) {
        if ((t/=d/2) < 1) {
            return c/2*t*t*t*t + b;
        }
        return -c/2 * ((t-=2)*t*t*t - 2) + b;
    },
    elasticIn: function (t, b, c, d, a, p) {
        if (t == 0) {
            return b;
        }
        if ( (t /= d) == 1 ) {
            return b+c;
        }
        if (!p) {
            p=d*.3;
        }
        var s;
        if (!a || a < Math.abs(c)) {
            a = c; 
            s = p/4;
        } else {
            s = p/(2*Math.PI) * Math.asin (c/a);
        }
        return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    },
    elasticOut: function (t, b, c, d, a, p) {
        if (t == 0) {
            return b;
        }
        if ( (t /= d) == 1 ) {
            return b+c;
        }
        if (!p) {
            p=d*.3;
        }
        var s;
        if (!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        } else {
            s = p/(2*Math.PI) * Math.asin (c/a);
        }
        return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    },
    elasticBoth: function (t, b, c, d, a, p) {
        if (t == 0) {
            return b;
        }
        if ( (t /= d/2) == 2 ) {
            return b+c;
        }
        if (!p) {
            p = d*(.3*1.5);
        }
        var s;
        if ( !a || a < Math.abs(c) ) {
            a = c; 
            s = p/4;
        } else {
            s = p/(2*Math.PI) * Math.asin (c/a);
        }
        if (t < 1) {
            return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        }
        return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
    },
    backIn: function (t, b, c, d, s) {
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        return c*(t/=d)*t*((s+1)*t - s) + b;
    },
    backOut: function (t, b, c, d, s) {
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    },
    backBoth: function (t, b, c, d, s) {
        if (typeof s == 'undefined') {
            s = 1.70158; 
        }
        if ((t /= d/2 ) < 1) {
            return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        }
        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    },
    bounceIn: function (t, b, c, d) {
        return c - Rui.fx.LEasing.bounceOut(d-t, 0, c, d) + b;
    },
    bounceOut: function (t, b, c, d) {
        if ((t/=d) < (1/2.75)) {
            return c*(7.5625*t*t) + b;
        } else if (t < (2/2.75)) {
            return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
        } else if (t < (2.5/2.75)) {
            return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
        }
        return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
    },
    bounceBoth: function (t, b, c, d) {
        if (t < d/2) {
            return Rui.fx.LEasing.bounceIn(t*2, 0, c, d) * .5 + b;
        }
        return Rui.fx.LEasing.bounceOut(t*2-d, 0, c, d) * .5 + c*.5 + b;
    }
};
Rui.fx.LMotionAnim = function(config) {
    config = config || {};
    if (config.el || config.applyTo) { 
        Rui.fx.LMotionAnim.superclass.constructor.call(this, config);
    }
    this.patterns.points = /^points$/i;
};
Rui.extend(Rui.fx.LMotionAnim, Rui.fx.LAnim, {
    otype: 'Rui.fx.LMotionAnim',
    setAttribute: function(attr, val, unit) {
        if (this.patterns.points.test(attr)) {
            unit = unit || 'px';
            Rui.fx.LMotionAnim.superclass.setAttribute.call(this, 'left', val[0], unit);
            val[1] ? Rui.fx.LMotionAnim.superclass.setAttribute.call(this, 'top', val[1], unit) : '';
        } else {
            Rui.fx.LMotionAnim.superclass.setAttribute.call(this, attr, val, unit);
        }
    },
    getAttribute: function(attr) {
        if (this.patterns.points.test(attr)) {
            var val = [
                Rui.fx.LMotionAnim.superclass.getAttribute.call(this, 'left'),
                Rui.fx.LMotionAnim.superclass.getAttribute.call(this, 'top')
            ];
        } else {
            val = Rui.fx.LMotionAnim.superclass.getAttribute.call(this, attr);
        }
        return val;
    },
    doMethod: function(attr, start, end) {
        var val = null;
        if ( this.patterns.points.test(attr) ) {
            var t = this.method(this.currentFrame, 0, 100, this.totalFrames) / 100;
            val = Rui.fx.LBezier.getPosition(this.runtimeAttributes[attr], t);
        } else {
            val = Rui.fx.LMotionAnim.superclass.doMethod.call(this, attr, start, end);
        }
        return val;
    },
    setRuntimeAttribute: function(attr) {
        if ( this.patterns.points.test(attr) ) {
            var el = this.getEl();
            var attributes = this.attributes;
            var start;
            var control = attributes['points']['control'] || [];
            var end;
            var i, len;
            var Dom = Rui.util.LDom;
            if (control.length > 0 && !(control[0] instanceof Array) ) { 
                control = [control];
            } else { 
                var tmp = []; 
                for (i = 0, len = control.length; i< len; ++i) {
                    tmp[i] = control[i];
                }
                control = tmp;
            }
            if (Dom.getStyle(el, 'position') == 'static') { 
                Dom.setStyle(el, 'position', 'relative');
            }
            if ( this.isset(attributes['points']['from']) ) {
                Dom.setXY(el, attributes['points']['from']); 
            } 
            else { Dom.setXY( el, Dom.getXY(el) ); } 
            start = this.getAttribute('points'); 
            if ( this.isset(attributes['points']['to']) ) {
                end = this.translateValues(attributes['points']['to'], start);
                for (i = 0, len = control.length; i < len; ++i) {
                    control[i] = this.translateValues(control[i], start);
                }
            } else if ( this.isset(attributes['points']['by']) ) {
                end = [ start[0] + attributes['points']['by'][0], start[1] + attributes['points']['by'][1] ];
                for (i = 0, len = control.length; i < len; ++i) {
                    control[i] = [ start[0] + control[i][0], start[1] + control[i][1] ];
                }
            }
            this.runtimeAttributes[attr] = [start];
            if (control.length > 0) {
                this.runtimeAttributes[attr] = this.runtimeAttributes[attr].concat(control); 
            }
            this.runtimeAttributes[attr][this.runtimeAttributes[attr].length] = end;
        }
        else {
            Rui.fx.LMotionAnim.superclass.setRuntimeAttribute.call(this, attr);
        }
    },
    translateValues: function(val, start) {
        var pageXY = Rui.util.LDom.getXY(this.getEl());
        val = [ val[0] - pageXY[0] + start[0], val[1] - pageXY[1] + start[1] ];
        return val; 
    },
    isset: function(prop) {
        return (typeof prop !== 'undefined');
    }
});
Rui.fx.LBezier = new function() {
    this.getPosition = function(points, t) {
        var n = points.length;
        var tmp = [];
        for (var i = 0; i < n; ++i){
            tmp[i] = [points[i][0], points[i][1]]; 
        }
        for (var j = 1; j < n; ++j) {
            for (i = 0; i < n - j; ++i) {
                tmp[i][0] = (1 - t) * tmp[i][0] + t * tmp[parseInt(i + 1, 10)][0];
                tmp[i][1] = (1 - t) * tmp[i][1] + t * tmp[parseInt(i + 1, 10)][1]; 
            }
        }
        return [ tmp[0][0], tmp[0][1] ]; 
    };
};
Rui.namespace('Rui.dd');
if(!Rui.dd.LDragDropManager){
Rui.dd.LDragDropManager = function(){
    var Event = Rui.util.LEvent,
        Dom = Rui.util.LDom;
    return {
        useShim: false,
        _shimActive: false,
        _shimState: false,
        _debugShim: false,
        _createShim: function(){
            var s = document.createElement('div');
            s.id = 'L-ddm-shim';
            if(document.body.firstChild){
                document.body.insertBefore(s, document.body.firstChild);
            }else{
                document.body.appendChild(s);
            }
            s.style.display = 'none';
            s.style.backgroundColor = 'red';
            s.style.position = 'absolute';
            s.style.zIndex = '99999';
            Dom.setStyle(s, 'opacity', '0');
            this._shim = s;
            Event.on(s, 'mouseup',   this.handleMouseUp, this, true);
            Event.on(s, 'mousemove', this.handleMouseMove, this, true);
            Event.on(window, 'scroll', this._sizeShim, this, true);
        },
        _sizeShim: function(){
            if(this._shimActive){
                var s = this._shim;
                s.style.height = Dom.getDocumentHeight() + 'px';
                s.style.width = Dom.getDocumentWidth() + 'px';
                s.style.top = '0';
                s.style.left = '0';
            }
        },
        _activateShim: function(){
            if(this.useShim){
                if(!this._shim){
                    this._createShim();
                }
                this._shimActive = true;
                var s = this._shim,
                    o = '0';
                if(this._debugShim){
                    o = '.5';
                }
                Dom.setStyle(s, 'opacity', o);
                this._sizeShim();
                s.style.display = 'block';
            }
        },
        _deactivateShim: function(){
            this._shim.style.display = 'none';
            this._shimActive = false;
        },
        _shim: null,
        ids: {},
        handleIds: {},
        dragCurrent: null,
        dragOvers: {},
        deltaX: 0,
        deltaY: 0,
        preventDefault: true,
        stopPropagation: true,
        initialized: false,
        locked: false,
        interactionInfo: null,
        init: function(){
            this.initialized = true;
        },
        POINT: 0,
        INTERSECT: 1,
        STRICT_INTERSECT: 2,
        mode: 0,
        _execOnAll: function(sMethod, args){
            for (var i in this.ids){
                for (var j in this.ids[i]){
                    var oDD = this.ids[i][j];
                    if(! this.isTypeOfDD(oDD)){
                        continue;
                    }
                    oDD[sMethod].apply(oDD, args);
                }
            }
        },
        _onLoad: function(){
            this.init();
            Event.on(document, 'mouseup', this.handleMouseUp, this, true);
            Event.on(document, 'mousemove', this.handleMouseMove, this, true);
            Event.on(window, 'unload', this._onUnload, this, true);
            Event.on(window, 'resize', this._onResize, this, true);
        },
        _onResize: function(e){
            this._execOnAll('resetConstraints', []);
        },
        lock: function(){ this.locked = true; },
        unlock: function(){ this.locked = false; },
        isLocked: function(){ return this.locked; },
        locationCache: {},
        useCache: true,
        clickPixelThresh: 3,
        clickTimeThresh: 1000,
        dragThreshMet: false,
        clickTimeout: null,
        startX: 0,
        startY: 0,
        fromTimeout: false,
        regDragDrop: function(oDD, group){
            if(!this.initialized){ this.init(); }
            if(!this.ids[group]){
                this.ids[group] = {};
            }
            this.ids[group][oDD.id] = oDD;
        },
        removeDDFromGroup: function(oDD, group){
            if(!this.ids[group]){
                this.ids[group] = {};
            }
            var obj = this.ids[group];
            if(obj && obj[oDD.id]){
                delete obj[oDD.id];
            }
        },
        _remove: function(oDD){
            for (var g in oDD.groups){
                if(g){
                    var item = this.ids[g];
                    if(item && item[oDD.id]){
                        delete item[oDD.id];
                    }
                }
            }
            delete this.handleIds[oDD.id];
        },
        regHandle: function(sDDId, sHandleId){
            if(!this.handleIds[sDDId]){
                this.handleIds[sDDId] = {};
            }
            this.handleIds[sDDId][sHandleId] = sHandleId;
        },
        isDragDrop: function(id){
            return ( this.getDDById(id) ) ? true : false;
        },
        getRelated: function(p_oDD, bTargetsOnly){
            var oDDs = [];
            for (var i in p_oDD.groups){
                for (var j in this.ids[i]){
                    var dd = this.ids[i][j];
                    if(! this.isTypeOfDD(dd)){
                        continue;
                    }
                    if(!bTargetsOnly || dd.isTarget){
                        oDDs[oDDs.length] = dd;
                    }
                }
            }
            return oDDs;
        },
        isLegalTarget: function(oDD, oTargetDD){
            var targets = this.getRelated(oDD, true);
            for (var i=0, len=targets.length;i<len;++i){
                if(targets[i].id == oTargetDD.id){
                    return true;
                }
            }
            return false;
        },
        isTypeOfDD: function(oDD){
            return (oDD && oDD.__ygDragDrop);
        },
        isHandle: function(sDDId, sHandleId){
            return ( this.handleIds[sDDId] && 
                            this.handleIds[sDDId][sHandleId] );
        },
        getDDById: function(id){
            for (var i in this.ids){
                if(this.ids[i][id]){
                    return this.ids[i][id];
                }
            }
            return null;
        },
        handleMouseDown: function(e, oDD){
            this.currentTarget = Rui.util.LEvent.getTarget(e);
            this.dragCurrent = oDD;
            var el = oDD.getEl();
            this.startX = Rui.util.LEvent.getPageX(e);
            this.startY = Rui.util.LEvent.getPageY(e);
            this.deltaX = this.startX - el.offsetLeft;
            this.deltaY = this.startY - el.offsetTop;
            this.dragThreshMet = false;
            this.clickTimeout = setTimeout(function(){ 
                var LDDM = Rui.dd.LDDM;
                LDDM.startDrag(LDDM.startX, LDDM.startY);
                LDDM.fromTimeout = true;
            }, this.clickTimeThresh);
        },
        startDrag: function(x, y){
            if(this.dragCurrent && this.dragCurrent.useShim){
                this._shimState = this.useShim;
                this.useShim = true;
            }
            this._activateShim();
            clearTimeout(this.clickTimeout);
            var dc = this.dragCurrent;
            if(dc && dc.events.b4StartDrag){
                dc.b4StartDrag(x, y);
                dc.fireEvent('b4StartDragEvent', { x: x, y: y, dd: dc });
            }
            if(dc && dc.events.startDrag){
                dc.startDrag(x, y);
                dc.fireEvent('startDragEvent', { x: x, y: y, dd: dc });
            }
            this.dragThreshMet = true;
        },
        handleMouseUp: function(e){
            if(this.dragCurrent){
                clearTimeout(this.clickTimeout);
                if(this.dragThreshMet){
                    if(this.fromTimeout){
                        this.fromTimeout = false;
                        this.handleMouseMove(e);
                    }
                    this.fromTimeout = false;
                    this.fireEvents(e, true);
                }else{
                }
                this.stopDrag(e);
                this.stopEvent(e);
            }
        },
        stopEvent: function(e){
            if(this.stopPropagation){
                Rui.util.LEvent.stopPropagation(e);
            }
            if(this.preventDefault){
                Rui.util.LEvent.preventDefault(e);
            }
        },
        stopDrag: function(e, silent){
            var dc = this.dragCurrent;
            if(dc && !silent){
                if(this.dragThreshMet){
                    if(dc.events.b4EndDrag){
                        dc.b4EndDrag(e);
                        dc.fireEvent('b4EndDragEvent', { e: e });
                    }
                    if(dc.events.endDrag){
                        dc.endDrag(e);
                        dc.fireEvent('endDragEvent', { e: e });
                    }
                }
                if(dc.events.mouseUp){
                    dc.onMouseUp(e);
                    dc.fireEvent('mouseUpEvent', { e: e });
                }
            }
            if(this._shimActive){
                this._deactivateShim();
                if(this.dragCurrent && this.dragCurrent.useShim){
                    this.useShim = this._shimState;
                    this._shimState = false;
                }
            }
            this.dragCurrent = null;
            this.dragOvers = {};
        },
        handleMouseMove: function(e){
            var dc = this.dragCurrent;
            if(dc){
                if(Rui.util.LEvent.isIE && Rui.browser.version < 9 && !e.button){
                    this.stopEvent(e);
                    return this.handleMouseUp(e);
                }
                if(!this.dragThreshMet){
                    var diffX = Math.abs(this.startX - Rui.util.LEvent.getPageX(e));
                    var diffY = Math.abs(this.startY - Rui.util.LEvent.getPageY(e));
                    if(diffX > this.clickPixelThresh || diffY > this.clickPixelThresh){
                        this.startDrag(this.startX, this.startY);
                    }
                }
                if(this.dragThreshMet){
                    if(dc && dc.events.b4Drag){
                        dc.b4Drag(e);
                        dc.fireEvent('b4DragEvent', { e: e});
                    }
                    if(dc && dc.events.drag){
                        dc.onDrag(e);
                        dc.fireEvent('dragEvent', { e: e});
                    }
                    if(dc){
                        this.fireEvents(e, false);
                    }
                }
                this.stopEvent(e);
            }
        },
        fireEvents: function(e, isDrop){
            var dc = this.dragCurrent;
            if(!dc || dc.isLocked() || dc.dragOnly){
                return;
            }
            var x = Rui.util.LEvent.getPageX(e),
                y = Rui.util.LEvent.getPageY(e),
                pt = new Rui.util.LPoint(x,y),
                pos = dc.getTargetCoord(pt.x, pt.y),
                el = dc.getDragEl(),
                events = ['out', 'over', 'drop', 'enter'],
                curRegion = new Rui.util.LRegion( pos.y, 
                   pos.x + el.offsetWidth,
                   pos.y + el.offsetHeight, 
                   pos.x ),
                oldOvers = [], 
                inGroupsObj  = {},
                inGroups  = [],
                data = {
                    outEvts: [],
                    overEvts: [],
                    dropEvts: [],
                    enterEvts: []
                };
            for (var i in this.dragOvers){
                var ddo = this.dragOvers[i];
                if(! this.isTypeOfDD(ddo)){
                    continue;
                }
                if(! this.isOverTarget(pt, ddo, this.mode, curRegion)){
                    data.outEvts.push( ddo );
                }
                oldOvers[i] = true;
                delete this.dragOvers[i];
            }
            for (var group in dc.groups){
                if('string' != typeof group){
                    continue;
                }
                for (i in this.ids[group]){
                    var oDD = this.ids[group][i];
                    if(! this.isTypeOfDD(oDD)){
                        continue;
                    }
                    if(oDD.isTarget && !oDD.isLocked() && oDD != dc){
                        if(this.isOverTarget(pt, oDD, this.mode, curRegion)){
                            inGroupsObj[group] = true;
                            if(isDrop){
                                data.dropEvts.push( oDD );
                            }else{
                                if(!oldOvers[oDD.id]){
                                    data.enterEvts.push( oDD );
                                }else{
                                    data.overEvts.push( oDD );
                                }
                                this.dragOvers[oDD.id] = oDD;
                            }
                        }
                    }
                }
            }
            this.interactionInfo = {
                out: data.outEvts,
                enter: data.enterEvts,
                over: data.overEvts,
                drop: data.dropEvts,
                point: pt,
                draggedRegion: curRegion,
                sourceRegion: this.locationCache[dc.id],
                validDrop: isDrop
            };
            for (var inG in inGroupsObj){
                inGroups.push(inG);
            }
            if(isDrop && !data.dropEvts.length){
                this.interactionInfo.validDrop = false;
                if(dc.events.invalidDrop){
                    dc.onInvalidDrop(e);
                    dc.fireEvent('invalidDropEvent', { e: e });
                }
            }
            for (i = 0; i < events.length; i++){
                var tmp = null;
                if(data[events[i] + 'Evts']){
                    tmp = data[events[i] + 'Evts'];
                }
                if(tmp && tmp.length){
                    var type = events[i].charAt(0).toUpperCase() + events[i].substr(1),
                        ev = 'onDrag' + type,
                        b4 = 'b4Drag' + type,
                        cev = 'drag' + type + 'Event',
                        check = 'drag' + type;
                    if(this.mode){
                        if(dc.events[b4]){
                            dc[b4](e, tmp, inGroups);
                            dc.fireEvent(b4 + 'Event', { event: e, info: tmp, group: inGroups });
                        }
                        if(dc.events[check]){
                            dc[ev](e, tmp, inGroups);
                            dc.fireEvent(cev, { event: e, info: tmp, group: inGroups });
                        }
                    }else{
                        for (var b = 0, len = tmp.length; b < len; ++b){
                            if(dc.events[b4]){
                                dc[b4](e, tmp[b].id, inGroups[0]);
                                dc.fireEvent(b4 + 'Event', { event: e, info: tmp[b].id, group: inGroups[0] });
                            }
                            if(dc.events[check]){
                                dc[ev](e, tmp[b].id, inGroups[0]);
                                dc.fireEvent(cev, { event: e, info: tmp[b].id, group: inGroups[0] });
                            }
                        }
                    }
                }
            }
        },
        getBestMatch: function(dds){
            var winner = null;
            var len = dds.length;
            if(len == 1){
                winner = dds[0];
            }else{
                for (var i=0; i<len; ++i){
                    var dd = dds[i];
                    if(this.mode == this.INTERSECT && dd.cursorIsOver){
                        winner = dd;
                        break;
                    }else{
                        if(!winner || !winner.overlap || (dd.overlap &&
                            winner.overlap.getArea() < dd.overlap.getArea())){
                            winner = dd;
                        }
                    }
                }
            }
            return winner;
        },
        refreshCache: function(groups){
            var g = groups || this.ids;
            for (var group in g){
                if('string' != typeof group){
                    continue;
                }
                for (var i in this.ids[group]){
                    var oDD = this.ids[group][i];
                    if(this.isTypeOfDD(oDD)){
                        var loc = this.getLocation(oDD);
                        if(loc){
                            this.locationCache[oDD.id] = loc;
                        }else{
                            delete this.locationCache[oDD.id];
                        }
                    }
                }
            }
        },
        verifyEl: function(el){
            try {
                if(el){
                    var parent = el.offsetParent;
                    if(parent){
                        return true;
                    }
                }
            } catch(e){
            }
            return false;
        },
        getLocation: function(oDD){
            if(! this.isTypeOfDD(oDD)){
                return null;
            }
            var el = oDD.getEl(), pos, x1, x2, y1, y2, t, r, b, l;
            try {
                pos= Rui.util.LDom.getXY(el);
            } catch (e){ }
            if(!pos){
                return null;
            }
            x1 = pos[0];
            x2 = x1 + el.offsetWidth;
            y1 = pos[1];
            y2 = y1 + el.offsetHeight;
            t = y1 - oDD.padding[0];
            r = x2 + oDD.padding[1];
            b = y2 + oDD.padding[2];
            l = x1 - oDD.padding[3];
            return new Rui.util.LRegion( t, r, b, l );
        },
        isOverTarget: function(pt, oTarget, intersect, curRegion){
            var loc = this.locationCache[oTarget.id];
            if(!loc || !this.useCache){
                loc = this.getLocation(oTarget);
                this.locationCache[oTarget.id] = loc;
            }
            if(!loc){
                return false;
            }
            oTarget.cursorIsOver = loc.contains( pt );
            var dc = this.dragCurrent;
            if(!dc || (!intersect && !dc.constrainX && !dc.constrainY)){
                return oTarget.cursorIsOver;
            }
            oTarget.overlap = null;
            if(!curRegion){
                var pos = dc.getTargetCoord(pt.x, pt.y);
                var el = dc.getDragEl();
                curRegion = new Rui.util.LRegion( pos.y, 
                                                   pos.x + el.offsetWidth,
                                                   pos.y + el.offsetHeight, 
                                                   pos.x );
            }
            var overlap = curRegion.intersect(loc);
            if(overlap){
                oTarget.overlap = overlap;
                return (intersect) ? true : oTarget.cursorIsOver;
            }else{
                return false;
            }
        },
        _onUnload: function(e, me){
            this.unregAll();
        },
        unregAll: function(){
            if(this.dragCurrent){
                this.stopDrag();
                this.dragCurrent = null;
            }
            this._execOnAll('unreg', []);
            this.ids = {};
        },
        elementCache: {},
        getElWrapper: function(id){
            var oWrapper = this.elementCache[id];
            if(!oWrapper || !oWrapper.el){
                oWrapper = this.elementCache[id] = new this.ElementWrapper(Rui.util.LDom.get(id));
            }
            return oWrapper;
        },
        getElement: function(id){
            return Rui.util.LDom.get(id);
        },
        getCss: function(id){
            var el = Rui.util.LDom.get(id);
            return (el) ? el.style : null;
        },
        ElementWrapper: function(el){
            this.el = el || null;
            this.id = this.el && el.id;
            this.css = this.el && el.style;
        },
        getPosX: function(el){
            return Rui.util.LDom.getX(el);
        },
        getPosY: function(el){
            return Rui.util.LDom.getY(el); 
        },
        swapNode: function(n1, n2){
            if(n1.swapNode){
                n1.swapNode(n2);
            }else{
                var p = n2.parentNode;
                var s = n2.nextSibling;
                if(s == n1){
                    p.insertBefore(n1, n2);
                } else if(n2 == n1.nextSibling){
                    p.insertBefore(n2, n1);
                }else{
                    n1.parentNode.replaceChild(n2, n1);
                    p.insertBefore(n1, s);
                }
            }
        },
        getScroll: function(){
            var t, l, dde=document.documentElement, db=document.body;
            if(dde && (dde.scrollTop || dde.scrollLeft)){
                t = dde.scrollTop;
                l = dde.scrollLeft;
            } else if(db){
                t = db.scrollTop;
                l = db.scrollLeft;
            }
            return { top: t, left: l };
        },
        getStyle: function(el, styleProp){
            return Rui.util.LDom.getStyle(el, styleProp);
        },
        getScrollTop: function(){ return this.getScroll().top; },
        getScrollLeft: function(){ return this.getScroll().left; },
        moveToEl: function(moveEl, targetEl){
            var aCoord = Rui.util.LDom.getXY(targetEl);
            Rui.util.LDom.setXY(moveEl, aCoord);
        },
        getClientHeight: function(){
            return Rui.util.LDom.getViewportHeight();
        },
        getClientWidth: function(){
            return Rui.util.LDom.getViewportWidth();
        },
        numericSort: function(a, b){ return (a - b); },
        _timeoutCount: 0,
        _addListeners: function(){
            var LDDM = Rui.dd.LDDM;
            if( Rui.util.LEvent && document ){
                LDDM._onLoad();
            }else{
                if(LDDM._timeoutCount > 2000){
                }else{
                    setTimeout(LDDM._addListeners, 10);
                    if(document && document.body){
                        LDDM._timeoutCount += 1;
                    }
                }
            }
        },
        handleWasClicked: function(node, id){
            if(this.isHandle(id, node.id)){
                return true;
            }else{
                var p = node.parentNode;
                while (p){
                    if(this.isHandle(id, p.id)){
                        return true;
                    }else{
                        p = p.parentNode;
                    }
                }
            }
            return false;
        }
    };
}();
Rui.dd.LDDM = Rui.dd.LDragDropManager;
Rui.dd.LDDM._addListeners();
}
(function() {
var Event=Rui.util.LEvent; 
var Dom=Rui.util.LDom;
Rui.dd.LDragDrop = function(config) {
    config = config || {};
    if (config.id) {
        this.init(config.id, config.group, config.attributes); 
    }
};
Rui.extend(Rui.dd.LDragDrop, Rui.util.LEventProvider, {
    events: null,
    id: null,
    attributes: null,
    dragElId: null, 
    handleElId: null, 
    invalidHandleTypes: null, 
    invalidHandleIds: null, 
    invalidHandleClasses: null, 
    startPageX: 0,
    startPageY: 0,
    groups: null,
    locked: false,
    lock: function() { this.locked = true; },
    unlock: function() { this.locked = false; },
    isTarget: true,
    padding: null,
    dragOnly: false,
    useShim: false,
    _domRef: null,
    __ygDragDrop: true,
    constrainX: false,
    constrainY: false,
    minX: 0,
    maxX: 0,
    minY: 0,
    maxY: 0,
    deltaX: 0,
    deltaY: 0,
    maintainOffset: false,
    xTicks: null,
    yTicks: null,
    primaryButtonOnly: true,
    available: false,
    hasOuterHandles: false,
    cursorIsOver: false,
    overlap: null,
    b4StartDrag: function(x, y) { },
    startDrag: function(x, y) {  },
    b4Drag: function(e) { },
    onDrag: function(e) {  },
    onDragEnter: function(e, id) {  },
    b4DragOver: function(e) { },
    onDragOver: function(e, id) {  },
    b4DragOut: function(e) { },
    onDragOut: function(e, id) {  },
    b4DragDrop: function(e) { },
    onDragDrop: function(e, id) {  },
    onInvalidDrop: function(e) {  },
    b4EndDrag: function(e) { },
    endDrag: function(e) {  },
    b4MouseDown: function(e) {  },
    onMouseDown: function(e) {  },
    onMouseUp: function(e) {  },
    onAvailable: function () { 
    },
    getEl: function() { 
        if (!this._domRef) {
            this._domRef = Dom.get(this.id); 
        }
        return this._domRef;
    },
    getDragEl: function() {
        return Dom.get(this.dragElId);
    },
    init: function(id, group, attributes) {
        this.initTarget(id, group, attributes);
        Event.on(this._domRef || this.id, 'mousedown', this.handleMouseDown, this, true);
        for (var i in this.events) {
            this.createEvent(i + 'Event');
        }
    },
    initTarget: function(id, group, attributes) {
        this.attributes = attributes || {};
        this.events = {};
        this.LDDM = Rui.dd.LDDM;
        this.groups = {};
        if (typeof id !== 'string') {
            this._domRef = id;
            id = Dom.generateId(id);
        }
        this.id = id;
        this.addToGroup((group) ? group : 'default');
        this.handleElId = id;
        Event.onAvailable(id, this.handleOnAvailable, this, true);
        this.setDragElId(id); 
        this.invalidHandleTypes = { A: 'A' };
        this.invalidHandleIds = {};
        this.invalidHandleClasses = [];
        this.applyConfig();
    },
    applyConfig: function() {
        this.events = {
            mouseDown: true,
            b4MouseDown: true,
            mouseUp: true,
            b4StartDrag: true,
            startDrag: true,
            b4EndDrag: true,
            endDrag: true,
            drag: true,
            b4Drag: true,
            invalidDrop: true,
            b4DragOut: true,
            dragOut: true,
            dragEnter: true,
            b4DragOver: true,
            dragOver: true,
            b4DragDrop: true,
            dragDrop: true
        };
        if (this.attributes.events) {
            for (var i in this.attributes.events) {
                if (this.attributes.events[i] === false) {
                    this.events[i] = false;
                }
            }
        }
        this.padding           = this.attributes.padding || [0, 0, 0, 0];
        this.isTarget          = (this.attributes.isTarget !== false);
        this.maintainOffset    = (this.attributes.maintainOffset);
        this.primaryButtonOnly = (this.attributes.primaryButtonOnly !== false);
        this.dragOnly = ((this.attributes.dragOnly === true) ? true : false);
        this.useShim = ((this.attributes.useShim === true) ? true : false);
    },
    handleOnAvailable: function() {
        this.available = true;
        this.resetConstraints();
        this.onAvailable();
    },
    setPadding: function(iTop, iRight, iBot, iLeft) {
        if (!iRight && 0 !== iRight) {
            this.padding = [iTop, iTop, iTop, iTop];
        } else if (!iBot && 0 !== iBot) {
            this.padding = [iTop, iRight, iTop, iRight];
        } else {
            this.padding = [iTop, iRight, iBot, iLeft];
        }
    },
    setInitPosition: function(diffX, diffY) {
        var el = this.getEl();
        if (!this.LDDM.verifyEl(el)) {
            if (el && el.style && (el.style.display == 'none')) {
            } else {
            }
            return;
        }
        var dx = diffX || 0;
        var dy = diffY || 0;
        var p = Dom.getXY( el );
        this.initPageX = p[0] - dx;
        this.initPageY = p[1] - dy;
        this.lastPageX = p[0];
        this.lastPageY = p[1];
        this.setStartPosition(p);
    },
    setStartPosition: function(pos) {
        var p = pos || Dom.getXY(this.getEl());
        this.deltaSetXY = null;
        this.startPageX = p[0];
        this.startPageY = p[1];
    },
    addToGroup: function(group) {
        this.groups[group] = true;
        this.LDDM.regDragDrop(this, group);
    },
    removeFromGroup: function(group) {
        if (this.groups[group]) {
            delete this.groups[group];
        }
        this.LDDM.removeDDFromGroup(this, group);
    },
    setDragElId: function(id) {
        this.dragElId = id;
    },
    setHandleElId: function(id) {
        if (typeof id !== 'string') {
            id = Dom.generateId(id);
        }
        this.handleElId = id;
        this.LDDM.regHandle(this.id, id);
    },
    setOuterHandleElId: function(id) {
        if (typeof id !== 'string') {
            id = Dom.generateId(id);
        }
        Event.on(id, 'mousedown', this.handleMouseDown, this, true);
        this.setHandleElId(id);
        this.hasOuterHandles = true;
    },
    unreg: function() {
        Event.removeListener(this.id, 'mousedown', this.handleMouseDown);
        this._domRef = null;
        this.LDDM._remove(this);
    },
    isLocked: function() {
        return (this.LDDM.isLocked() || this.locked);
    },
    handleMouseDown: function(e, oDD) {
        var button = e.which || e.button;
        if (this.primaryButtonOnly && button > 1) {
            return;
        }
        if (this.isLocked()) {
            return;
        }
        var b4Return = this.b4MouseDown(e),
        b4Return2 = true;
        if (this.events.b4MouseDown) {
            b4Return2 = this.fireEvent('b4MouseDownEvent', e);
        }
        var mDownReturn = this.onMouseDown(e),
            mDownReturn2 = true;
        if (this.events.mouseDown) {
            mDownReturn2 = this.fireEvent('mouseDownEvent', e);
        }
        if ((b4Return === false) || (mDownReturn === false) || (b4Return2 === false) || (mDownReturn2 === false)) {
            return;
        }
        this.LDDM.refreshCache(this.groups);
        var pt = new Rui.util.LPoint(Event.getPageX(e), Event.getPageY(e));
        if (!this.hasOuterHandles && !this.LDDM.isOverTarget(pt, this) )  {
        } else {
            if (this.clickValidator(e)) {
                this.setStartPosition();
                this.LDDM.handleMouseDown(e, this);
                this.LDDM.stopEvent(e);
            }
        }
    },
    clickValidator: function(e) {
        var target = Rui.util.LEvent.getTarget(e);
        return ( this.isValidHandleChild(target) && (this.id == this.handleElId || this.LDDM.handleWasClicked(target, this.id)) );
    },
    getTargetCoord: function(iPageX, iPageY) {
        var x = iPageX - this.deltaX;
        var y = iPageY - this.deltaY;
        if (this.constrainX) {
            if (x < this.minX) { x = this.minX; }
            if (x > this.maxX) { x = this.maxX; }
        }
        if (this.constrainY) {
            if (y < this.minY) { y = this.minY; }
            if (y > this.maxY) { y = this.maxY; }
        }
        x = this.getTick(x, this.xTicks);
        y = this.getTick(y, this.yTicks);
        return {x:x, y:y};
    },
    addInvalidHandleType: function(tagName) {
        var type = tagName.toUpperCase();
        this.invalidHandleTypes[type] = type;
    },
    addInvalidHandleId: function(id) {
        if (typeof id !== 'string') {
            id = Dom.generateId(id);
        }
        this.invalidHandleIds[id] = id;
    },
    addInvalidHandleClass: function(cssClass) {
        this.invalidHandleClasses.push(cssClass);
    },
    removeInvalidHandleType: function(tagName) {
        var type = tagName.toUpperCase();
        delete this.invalidHandleTypes[type];
    },
    removeInvalidHandleId: function(id) {
        if (typeof id !== 'string') {
            id = Dom.generateId(id);
        }
        delete this.invalidHandleIds[id];
    },
    removeInvalidHandleClass: function(cssClass) {
        for (var i=0, len=this.invalidHandleClasses.length; i<len; ++i) {
            if (this.invalidHandleClasses[i] == cssClass) {
                delete this.invalidHandleClasses[i];
            }
        }
    },
    isValidHandleChild: function(node) {
        var valid = true;
        var nodeName;
        try {
            nodeName = node.nodeName.toUpperCase();
        } catch(e) {
            nodeName = node.nodeName;
        }
        valid = valid && !this.invalidHandleTypes[nodeName];
        valid = valid && !this.invalidHandleIds[node.id];
        for (var i=0, len=this.invalidHandleClasses.length; valid && i<len; ++i) {
            valid = !Dom.hasClass(node, this.invalidHandleClasses[i]);
        }
        return valid;
    },
    setXTicks: function(iStartX, iTickSize) {
        this.xTicks = [];
        this.xTickSize = iTickSize;
        var tickMap = {};
        for (var i = this.initPageX; i >= this.minX; i = i - iTickSize) {
            if (!tickMap[i]) {
                this.xTicks[this.xTicks.length] = i;
                tickMap[i] = true;
            }
        }
        for (i = this.initPageX; i <= this.maxX; i = i + iTickSize) {
            if (!tickMap[i]) {
                this.xTicks[this.xTicks.length] = i;
                tickMap[i] = true;
            }
        }
        this.xTicks.sort(this.LDDM.numericSort) ;
    },
    setYTicks: function(iStartY, iTickSize) {
        this.yTicks = [];
        this.yTickSize = iTickSize;
        var tickMap = {};
        for (var i = this.initPageY; i >= this.minY; i = i - iTickSize) {
            if (!tickMap[i]) {
                this.yTicks[this.yTicks.length] = i;
                tickMap[i] = true;
            }
        }
        for (i = this.initPageY; i <= this.maxY; i = i + iTickSize) {
            if (!tickMap[i]) {
                this.yTicks[this.yTicks.length] = i;
                tickMap[i] = true;
            }
        }
        this.yTicks.sort(this.LDDM.numericSort) ;
    },
    setXConstraint: function(iLeft, iRight, iTickSize) {
        this.leftConstraint = parseInt(iLeft, 10);
        this.rightConstraint = parseInt(iRight, 10);
        this.minX = this.initPageX - this.leftConstraint;
        this.maxX = this.initPageX + this.rightConstraint;
        if (iTickSize) { this.setXTicks(this.initPageX, iTickSize); }
        this.constrainX = true;
    },
    clearConstraints: function() {
        this.constrainX = false;
        this.constrainY = false;
        this.clearTicks();
    },
    clearTicks: function() {
        this.xTicks = null;
        this.yTicks = null;
        this.xTickSize = 0;
        this.yTickSize = 0;
    },
    setYConstraint: function(iUp, iDown, iTickSize) {
        this.topConstraint = parseInt(iUp, 10);
        this.bottomConstraint = parseInt(iDown, 10);
        this.minY = this.initPageY - this.topConstraint;
        this.maxY = this.initPageY + this.bottomConstraint;
        if (iTickSize) { this.setYTicks(this.initPageY, iTickSize); }
        this.constrainY = true;
    },
    resetConstraints: function() {
        if (this.initPageX || this.initPageX === 0) {
            var dx = (this.maintainOffset) ? this.lastPageX - this.initPageX : 0;
            var dy = (this.maintainOffset) ? this.lastPageY - this.initPageY : 0;
            this.setInitPosition(dx, dy);
        } else {
            this.setInitPosition();
        }
        if (this.constrainX) {
            this.setXConstraint( this.leftConstraint, this.rightConstraint, this.xTickSize);
        }
        if (this.constrainY) {
            this.setYConstraint( this.topConstraint, this.bottomConstraint, this.yTickSize);
        }
    },
    getTick: function(val, tickArray) {
        if (!tickArray) {
            return val; 
        } else if (tickArray[0] >= val) {
            return tickArray[0];
        } else {
            for (var i=0, len=tickArray.length; i<len; ++i) {
                var next = i + 1;
                if (tickArray[next] && tickArray[next] >= val) {
                    var diff1 = val - tickArray[i];
                    var diff2 = tickArray[next] - val;
                    return (diff2 > diff1) ? tickArray[i] : tickArray[next];
                }
            }
            return tickArray[tickArray.length - 1];
        }
    },
    toString: function() {
        return ('LDragDrop ' + this.id);
    }
});
})();
Rui.dd.LDD = function(config) {
    Rui.dd.LDD.superclass.constructor.call(this, config);
};
Rui.extend(Rui.dd.LDD, Rui.dd.LDragDrop, {
    scroll: true, 
    autoOffset: function(iPageX, iPageY) {
        var x = iPageX - this.startPageX;
        var y = iPageY - this.startPageY;
        this.setDelta(x, y);
    },
    setDelta: function(iDeltaX, iDeltaY) {
        this.deltaX = iDeltaX;
        this.deltaY = iDeltaY;
    },
    setDragElPos: function(iPageX, iPageY) {
        var el = this.getDragEl();
        this.alignElWithMouse(el, iPageX, iPageY);
    },
    alignElWithMouse: function(el, iPageX, iPageY) {
        var oCoord = this.getTargetCoord(iPageX, iPageY);
        if (!this.deltaSetXY) {
            var aCoord = [oCoord.x, oCoord.y];
            Rui.util.LDom.setXY(el, aCoord);
            var newLeft = parseInt( Rui.util.LDom.getStyle(el, 'left'), 10 );
            var newTop  = parseInt( Rui.util.LDom.getStyle(el, 'top' ), 10 );
            this.deltaSetXY = [ newLeft - oCoord.x, newTop - oCoord.y ];
        } else {
            Rui.util.LDom.setStyle(el, 'left', (oCoord.x + this.deltaSetXY[0]) + 'px');
            Rui.util.LDom.setStyle(el, 'top',  (oCoord.y + this.deltaSetXY[1]) + 'px');
        }
        this.cachePosition(oCoord.x, oCoord.y);
        var self = this;
        setTimeout(function() {
            self.autoScroll.call(self, oCoord.x, oCoord.y, el.offsetHeight, el.offsetWidth);
        }, 0);
    },
    cachePosition: function(iPageX, iPageY) {
        if (iPageX) {
            this.lastPageX = iPageX;
            this.lastPageY = iPageY;
        } else {
            var aCoord = Rui.util.LDom.getXY(this.getEl());
            this.lastPageX = aCoord[0];
            this.lastPageY = aCoord[1];
        }
    },
    autoScroll: function(x, y, h, w) {
        if (this.scroll) {
            var clientH = this.LDDM.getClientHeight();
            var clientW = this.LDDM.getClientWidth();
            var st = this.LDDM.getScrollTop();
            var sl = this.LDDM.getScrollLeft();
            var bot = h + y;
            var right = w + x;
            var toBot = (clientH + st - y - this.deltaY);
            var toRight = (clientW + sl - x - this.deltaX);
            var thresh = 40;
            var scrAmt = (document.all) ? 80 : 30;
            if ( bot > clientH && toBot < thresh ) { 
                window.scrollTo(sl, st + scrAmt); 
            }
            if ( y < st && st > 0 && y - st < thresh ) { 
                window.scrollTo(sl, st - scrAmt); 
            }
            if ( right > clientW && toRight < thresh ) { 
                window.scrollTo(sl + scrAmt, st); 
            }
            if ( x < sl && sl > 0 && x - sl < thresh ) { 
                window.scrollTo(sl - scrAmt, st);
            }
        }
    },
    applyConfig: function() {
        Rui.dd.LDD.superclass.applyConfig.call(this);
        this.scroll = (this.attributes.scroll !== false);
    },
    b4MouseDown: function(e) {
        this.setStartPosition();
        this.autoOffset(Rui.util.LEvent.getPageX(e), Rui.util.LEvent.getPageY(e));
    },
    b4Drag: function(e) {
        this.setDragElPos(Rui.util.LEvent.getPageX(e), Rui.util.LEvent.getPageY(e));
    },
    toString: function() {
        return ('LDD ' + this.id);
    }
});
Rui.dd.LDDProxy = function(config) {
    config = config || {};
    Rui.dd.LDDProxy.superclass.constructor.call(this, config);
    if (config.id) {
        this.initFrame(); 
    }
};
Rui.dd.LDDProxy.dragElId = 'ruiddfdiv';
Rui.extend(Rui.dd.LDDProxy, Rui.dd.LDD, {
    resizeFrame: true,
    centerFrame: false,
    createFrame: function() {
        var self=this, body=document.body;
        if (!body || !body.firstChild) {
            setTimeout( function() { self.createFrame(); }, 50 );
            return;
        }
        var div=this.getDragEl(), Dom=Rui.util.LDom;
        if (!div) {
            div    = document.createElement('div');
            div.id = this.dragElId;
            var s  = div.style;
            s.position   = 'absolute';
            s.visibility = 'hidden';
            s.cursor     = 'move';
            s.border     = '2px solid #aaa';
            s.zIndex     = 999;
            s.height     = '25px';
            s.width      = '25px';
            var _data = document.createElement('div');
            Dom.setStyle(_data, 'height', '100%');
            Dom.setStyle(_data, 'width', '100%');
            Dom.setStyle(_data, 'background-color', '#ccc');
            Dom.setStyle(_data, 'opacity', '0');
            div.appendChild(_data);
            if (Rui.browser.msie) {
                var ifr = document.createElement('iframe');
                ifr.setAttribute('src', 'javascript: false;');
                ifr.setAttribute('scrolling', 'no');
                ifr.setAttribute('frameborder', '0');
                div.insertBefore(ifr, div.firstChild);
                Dom.setStyle(ifr, 'height', '100%');
                Dom.setStyle(ifr, 'width', '100%');
                Dom.setStyle(ifr, 'position', 'absolute');
                Dom.setStyle(ifr, 'top', '0');
                Dom.setStyle(ifr, 'left', '0');
                Dom.setStyle(ifr, 'opacity', '0');
                Dom.setStyle(ifr, 'zIndex', '-1');
                Dom.setStyle(ifr.nextSibling, 'zIndex', '2');
            }
            body.insertBefore(div, body.firstChild);
        }
    },
    initFrame: function() {
        this.createFrame();
    },
    applyConfig: function() {
        Rui.dd.LDDProxy.superclass.applyConfig.call(this);
        this.resizeFrame = (this.attributes.resizeFrame !== false);
        this.centerFrame = (this.attributes.centerFrame);
        this.setDragElId(this.attributes.dragElId || Rui.dd.LDDProxy.dragElId);
    },
    showFrame: function(iPageX, iPageY) {
        var dragEl = this.getDragEl();
        var s = dragEl.style;
        this._resizeProxy();
        if (this.centerFrame) {
            this.setDelta( Math.round(parseInt(s.width,  10)/2), 
                           Math.round(parseInt(s.height, 10)/2) );
        }
        this.setDragElPos(iPageX, iPageY);
        Rui.util.LDom.setStyle(dragEl, 'visibility', 'visible'); 
    },
    _resizeProxy: function() {
        if (this.resizeFrame) {
            var DOM    = Rui.util.LDom;
            var el     = this.getEl();
            var dragEl = this.getDragEl();
            var bt = parseInt( DOM.getStyle(dragEl, 'borderTopWidth'    ), 10);
            var br = parseInt( DOM.getStyle(dragEl, 'borderRightWidth'  ), 10);
            var bb = parseInt( DOM.getStyle(dragEl, 'borderBottomWidth' ), 10);
            var bl = parseInt( DOM.getStyle(dragEl, 'borderLeftWidth'   ), 10);
            if (isNaN(bt)) { bt = 0; }
            if (isNaN(br)) { br = 0; }
            if (isNaN(bb)) { bb = 0; }
            if (isNaN(bl)) { bl = 0; }
            var newWidth  = Math.max(0, el.offsetWidth  - br - bl);                                                                                           
            var newHeight = Math.max(0, el.offsetHeight - bt - bb);
            DOM.setStyle( dragEl, 'width',  newWidth  + 'px' );
            DOM.setStyle( dragEl, 'height', newHeight + 'px' );
        }
    },
    b4MouseDown: function(e) {
        this.setStartPosition();
        var x = Rui.util.LEvent.getPageX(e);
        var y = Rui.util.LEvent.getPageY(e);
        this.autoOffset(x, y);
    },
    b4StartDrag: function(x, y) {
        this.showFrame(x, y);
    },
    b4EndDrag: function(e) {
        Rui.util.LDom.setStyle(this.getDragEl(), 'visibility', 'hidden'); 
    },
    endDrag: function(e) {
        var DOM = Rui.util.LDom;
        var lel = this.getEl();
        var del = this.getDragEl();
        DOM.setStyle(del, 'visibility', ''); 
        DOM.setStyle(lel, 'visibility', 'hidden'); 
        Rui.dd.LDDM.moveToEl(lel, del);
        DOM.setStyle(del, 'visibility', 'hidden'); 
        DOM.setStyle(lel, 'visibility', ''); 
    },
    toString: function() {
        return ('LDDProxy ' + this.id);
    }
});
Rui.dd.LDDTarget = function(config) {
    config = config || {};
    if (config.id) {
        this.initTarget(config.id, config.group, config.attributes);
    }
};
Rui.extend(Rui.dd.LDDTarget, Rui.dd.LDragDrop, {
    toString: function() {
        return ('LDDTarget ' + this.id);
    }
});
Rui.namespace('Rui.data');
(function(){
    Rui.data.LDataSet = function(config){
        config = config || {};
        config = Rui.applyIf(config, Rui.getConfig().getFirst('$.base.dataSet.defaultProperties'));
        Rui.applyObject(this, config);
        this.createEvent('fieldsChanged');
        this.createEvent('dataChanged');
        this.createEvent('add');
        this.createEvent('update');
        this.createEvent('remove');
        this.createEvent('beforeLoad');
        this.createEvent('beforeLoadData');
        this.createEvent('load');
        this.createEvent('loadException');
        this.createEvent('canRowPosChange');
        this.createEvent('rowPosChanged');
        this.createEvent('commit');
        this.createEvent('undo');
        this.createEvent('canMarkable');
        this.createEvent('marked');
        this.createEvent('allMarked');
        this.createEvent('invalid');
        this.createEvent('valid');
        this.createEvent('stateChanged');
        this.dataSetId = this.dataSetId || Rui.id();
        Rui.data.LDataSet.superclass.constructor.call(this);
        this.data = new Rui.util.LCollection();
        this.selectedData = new Rui.util.LCollection();
        this.modified = new Rui.util.LCollection();
        this.snapshot = new Rui.util.LCollection();
        this.invalidData = {};
        this.setFields(config.fields);
        if (this.defaultLoadExceptionHandler === true || this.defaultFailureHandler === true) {
            var loadExceptionHandler = Rui.getConfig().getFirst('$.base.dataSet.loadExceptionHandler');
            this.on('loadException', loadExceptionHandler, this, true);
        }
        this.init();
        delete config;
    };
    var _DS = Rui.data.LDataSet;     
    _DS.DATA_TYPE = 0;
    _DS.DATA_CHANGED_TYPE1 = 0; 
    _DS.DATA_CHANGED_TYPE2 = 1; 
    Rui.extend(Rui.data.LDataSet, Rui.util.LEventProvider, {
        otype: 'Rui.data.LDataSet',
        dataSetType: Rui.data.LDataSet.DATA_TYPE,
        rowPosition: -1,
        id: null,
        focusFirstRow: -1,
        fields: null,
        lastOptions: null,
        totalCount: null,
        timeout: null,
        canMarkableEvent: false,
        invalidData: null,
        remainRemoved: false,
        isBatch: false,
        defaultFailureHandler: false,
        loadCache: false,
        method: 'POST',
        serializeMetaData: true,
        lazyLoad: false,
        lazyLoadCount: 5000,
        lazyLoadTime: 50,
        multiSortable: true,
        init: function(){
        },
        insert: function(idx, record, option){
            if (idx < 0) 
                return;
            try {
                option = option || {};
                if (record.dataSet && record.dataSet.id != this.id) {
                    throw new Error('LRecord객체에 기존에 맵핑된 데이터셋이 존재합니다. 신규 데이터셋에 add 할경우에는 record.clone() 기능으로 구현하세요.');
                }
                record.dataSet = this;
                record.id = record.id || Rui.data.LRecord.getNewRecordId();
                record.initRecord();
                this.data.insert(idx, record);
                if (record.state != Rui.data.LRecord.STATE_NORMAL) 
                    this.modified.add(record.id, record);
                this.isLoad = true;
                if (option.ignoreEvent !== true && this.isBatch !== true) {
                    this.fireEvent('add', {
                        type: 'add',
                        target: this,
                        record: record,
                        row: idx,
                        currentRow: this.rowPosition
                    });
                }
                return idx;
            } finally {
                option = null;
            }
        },
        add: function(record, option){
            return this.insert(this.data.length, record, option);
        },
        addAll: function(records, option){
            for (var i = 0; i < records.length; i++) {
                this.add(records[i].clone(), option);
            }
        },
        remove: function(key, option){
            var idx = this.indexOfKey(key);
            if(idx < 0) return null;
            this.removeAt(idx, option); 
        },
        removeAt: function(index, option){
            option = option || {};
            var record = this.data.getAt(index);
            if (!this.remainRemoved || record.state === Rui.data.LRecord.STATE_INSERT) 
                this.data.remove(record.id);
            this.selectedData.remove(record.id);
            if (record.state === Rui.data.LRecord.STATE_INSERT) {
                this.modified.remove(record.id);
            }
            else {
                if (!this.modified.has(record.id))
                    this.modified.add(record.id, record);
                record.setState(Rui.data.LRecord.STATE_DELETE);
            }
            record.removeRow = index;
            if (option.ignoreEvent !== true && this.isBatch !== true) {
                this.fireEvent('remove', {
                    type: 'remove',
                    target: this,
                    record: record,
                    row: index,
                    currentRow: this.rowPosition,
                    remainRemoved: this.remainRemoved
                });
            }
            option.forceRow = option.forceRow === false ? false : true;
            if (record.state === Rui.data.LRecord.STATE_INSERT || (this.remainRemoved !== true && option.moveRow !== false)) 
                this.focusRow(option);
            return record;
        },
        removeAll: function(option){
            option = option || { moveRow: false, forceRow: false };
            if (this.getCount() > 0) {
                while (0 < this.getCount()) 
                    this.removeAt(0, option);
            }
            if (option.ignoreEvent !== true && this.isBatch !== true) {
                this.fireEvent('dataChanged', {
                    type: 'dataChanged',
                    target: this,
                    eventType: _DS.DATA_CHANGED_TYPE1,
                    moveRow: option.moveRow,
                    forceRow: option.forceRow
                });
            }
            this.focusRow();
        },
        clearData: function(option){
            option = option || {};
            var count = this.getCount();
            var event = (count > 0 || this.modified.length > 0 || this.snapshot.length > 0);
            delete this.data;
            this.data = new Rui.util.LCollection();
            delete this.snapshot;
            delete this.modified;
            delete this.selectedData;
            this.data = new Rui.util.LCollection();
            this.modified = new Rui.util.LCollection();
            this.selectedData = new Rui.util.LCollection();
            this.snapshot = new Rui.util.LCollection();
            this.invalidData = {};
            if(option && option.ignoreMetaData !== true)
                this.totalCount = 0;
            if (event) {
                if (option.ignoreEvent != true && this.isBatch !== true) {
                    this.fireEvent('dataChanged', {
                        type: 'dataChanged',
                        target: this,
                        eventType: _DS.DATA_CHANGED_TYPE1,
                        moveRow: false,
                        forceRow: false,
                        oldCount: count
                    });
                }
            }
            if(option.ignoreEvent != true && this.isBatch !== true) {
                this.focusRow({
                    ignoreCanRowPosChange: true,
                    forceRow: true
                });
            }
            options = null;
        },
        get: function(id){
            return this.data.get(id);
        },
        getAt: function(idx){
            return this.data.getAt(idx);
        },
        indexOfKey: function(id){
            return this.data.indexOfKey(id);
        },
        findRow: function(fieldName, value, startIndex){
            var idx = -1;
            startIndex = startIndex || 0;
            this.data.each(function(id, record, i){
                if (i < startIndex) 
                    return;
                if (record.get(fieldName) == value) {
                    idx = i;
                    return false;
                }
            }, this.data);
            return idx;
        },
        getFieldIndex: function(id){
            this.fieldMap = this.fieldMap || {};
            var idx = this.fieldMap[id];
            if (!idx) {
                for (var i = 0; i < this.fields.length; i++) {
                    if (this.fields[i].id == id) {
                        this.fieldMap[id] = i;
                        return i;
                    }
                }
                idx = -1;
            }
            return idx;
        },
        getFieldById: function(id){
            var idx = this.getFieldIndex(id);
            if (idx > -1) {
                return this.fields[idx];
            } else {
                return null;
            }
        },
        destroy: function(){
            this.data = null;
            this.modified.clear();
            this.modified = null;
            this.selectedData.clear();
            this.selectedData = null;
            this.snapshot.clear();
            this.snapshot = null;
            this.totalCount = 0;
            this.unOnAll();
        },
        load: function(options){
            this.isLoad = false;
            var config = options || {};
            var currentDataSet = this;
            this.onSuccessDelegate = Rui.util.LFunction.createDelegate(this.onSuccess, this);
            config = Rui.applyIf(config, {
                method: this.method || 'POST',
                callback: {
                    success: this.onSuccessDelegate,
                    failure: function(conn){
                        var e = new Error(conn.responseText);
                        try{
                            if(currentDataSet.fireEvent('loadException', {
                                type: 'loadException',
                                target: currentDataSet,
                                throwObject: e,
                                conn: conn
                            }) !== false) throw e;
                        } finally {
                            currentDataSet = null;
                            e = null;
                        }
                    }
                },
                url: null,
                params: {},
                sync: this.sync,
                cache: this.cache || false
            });
            config.callback = Rui.applyIf(config.callback, {
                timeout: ((this.timeout || 60) * 1000)
            });
            this.lastOptions = config;
            this.lastOptions.state = this.lastOptions.state || Rui.data.LRecord.STATE_NORMAL;
            this.lastOptions.isLoad = true;
            var params = '';
            if (typeof config.params == 'object') 
                params = Rui.util.LObject.serialize(config.params);
            else 
                params = config.params;
            params.duDataSetId = this.id;
            this.fireEvent('beforeLoad', {
                type: 'beforeLoad',
                target: this
            });
            Rui.LConnect._isFormSubmit = false;
            if (config.sync && config.sync == true) {
                Rui.LConnect.syncRequest(config.method, config.url, config.callback, params, config);
            } else {
                Rui.LConnect.asyncRequest(config.method, config.url, config.callback, params, config);
            }
            this.onSuccessDelegate = null;
            config = null;
        },
        onSuccess: function(conn) {
            this.doSuccess(this, conn);
        },
        doSuccess: function(dataSet, conn){
            var records = null;
            var dataSetData = null;
            try {
                var cached = false;
                if(this.loadCache && this.oldResponseText == conn.responseText) cached = true;
                if(cached === false) {
                    records = this.getReadDataMulti(this, conn, dataSet.lastOptions);
                    dataSetData = {
                        records: records
                    };
                }
                dataSet.loadData(dataSetData, dataSet.lastOptions, cached);
                this.oldResponseText = conn.responseText;
            } 
            catch (e) {
                var isLoadException = dataSet.isLoadException;
                if(isLoadException) throw e;
                if(dataSet.fireEvent('loadException', {
                    type: 'loadException',
                    target: dataSet,
                    throwObject: e,
                    conn: conn
                }) !== false)
                    throw e;
            } finally {
                conn = null;
                dataSet = null;
                records = null;
                dataSetData = null;
            }
        },
        getReadData: function(conn, config){
            return {
                records: this.getReadDataMulti(this, conn, config)
            };
        },
        getReadResponseData: function(conn) {
            var data = null;
            try{
                if(Rui.isDebugTI)
                    Rui.log('dataSet load start', 'time');
                if(this._cachedData) return this._cachedData; 
                if(Rui.browser.msie67 || !window.JSON) {
                    data = eval('(' + conn.responseText +  ')');
                } else {
                	var len = conn.responseText ? conn.responseText.length : 0;
                	if (len > 11 && conn.responseText.slice(0, 5).toLowerCase()  == '<pre>' && conn.responseText.slice(-6).toLowerCase() == '</pre>') {
                        data = JSON.parse(conn.responseText.substring(5, len - 6));
                	} else {
                        data = JSON.parse(conn.responseText);
                	}
                }
            } catch(e) {
                throw new Error(Rui.getMessageManager().get('$.base.msg110') + ':' + conn.responseText);
            }
            return data;
        },
        getReadDataMulti: function(dataSet, conn, config){
            throw new Rui.LException('구현 안됨.');
        },
        newRecord: function(idx, option){
            if (idx < 0) return;
            option = Rui.applyIf(option ||
            {}, {
                initData: true,
                moveRow: true
            });
            var id = Rui.data.LRecord.getNewRecordId();
            var arrayData = {
                id: id
            };
            var fLen = this.fields.length;
            for (var i = 0; i < fLen; i++) 
                arrayData[this.fields[i].id] = !Rui.isUndefined(this.fields[i].defaultValue) ? this.fields[i].defaultValue : undefined;
            var newRecord = this.createRecord(arrayData, {
                id: id,
                state: option.state,
                initData: option.initData
            });
            var row = Rui.isUndefined(idx) ? this.getCount() : idx;
            if (option.moveRow) {
                var recordId = (this.getRow() > -1) ? this.getAt(this.getRow()).getId() : null;
                if (this.doCanRowPosChange(row) == false) 
                    return false;
                if (recordId != null) 
                    row = this.indexOfKey(recordId) < 0 ? this.getRow() + 1 : row;
            }
            this.insert(row, newRecord, option);
            if (option.moveRow) {
                this.doRowPosChange(row, true);
            }
            option = null;
            arrayData = null;
            newRecord = null;
            return row;
        },
        createRecord: function(arrayData, option){
            try {
                option = Rui.applyIf(option || {}, { id: null });
                option.fields = this.fields;
                return new Rui.data.LRecord(arrayData, option);
            } finally {
                option = null;
            }
        },
        onFieldChanged: function(e){
            var record = e.target;
            var row = this.indexOfKey(record.id);
            this.setState(row, record.state);
            if(this.isBatch !== true) {
                var obj = {
                    type: 'update',
                    target: this,
                    record: record,
                    row: row,
                    col: this.getFieldIndex(e.colId),
                    rowId: record.id,
                    colId: e.colId,
                    value: e.value,
                    originValue: e.originValue,
                    beforeValue: e.beforeValue,
                    system: e.system
                };
                this.fireEvent('update', obj);
            }
            record = null;
        },
        onStateChanged: function(e){
            if(this.isBatch !== true) {
                this.fireEvent('stateChanged', {
                    type: 'stateChanged',
                    target: this,
                    record: e.target,
                    state: e.state,
                    beforeState: e.beforeState
                });
            }
        },
        loadRecord: function(data, options){
            var records = data.records;
            var len = records.length;
            for (var i = 0; i < len; i++) {
                this.add(records[i], {
                    ignoreEvent: true,
                    isLoad: true
                });
            }
            records = null;
        },
        loadData: function(data, options, cached){
            if(cached !== true) {
                this.fireEvent('beforeLoadData');
                this.isLoading = true;
                delete this.isLoadException;
                delete this._isFiltered;
                options = options || {};
                var dataRecords = data.records;
                var state = options.state || Rui.data.LRecord.STATE_NORMAL;
                if (!options.add || options.add == false) {
                    this.rowPosition = -1;
                    this.clearData({ ignoreEvent: true, ignoreMetaData: true });
                }
                var rOption = { id: null, fields: this.fields, state: state, isLoad: options && options.isLoad === true ?  true : false, dataSet: this };
                var fn = function(startIdx, options, data) {
                    var len = dataRecords.length;
                	var i = j = 0, lazyLoadCount = this.lazyLoad ? this.lazyLoadCount : len;
                    for (i = startIdx; i < len && j < lazyLoadCount; i++, j++) {
                    	rOption.id = Rui.data.LRecord.getNewRecordId();
                        var record = new Rui.data.LRecord(dataRecords[i], rOption);
                        this.add(record, {
                            ignoreEvent: true,
                            isLoad: true
                        });
                        record = null;
                    }
                    if(i > dataRecords.length - 1) {
                        this.snapshot = this.data.clone();
                        if (this.lastSortInfo) {
                            this.sort(this.lastSortInfo.fn, this.lastSortInfo.direction);
                        }
                        if(Rui.isDebugTI)
                            Rui.log('dataSet load end. Count: ' + this.getCount(), 'time');
                        this.isLoading = false;
                        this.isLoad = true;
                        try{
                            this.fireEvent('load', {
                                type: 'load',
                                target: this,
                                options: options,
                                message: cached ? '' : data.message,
                                cached: cached
                            });
                        } catch(e) {
                            this.isLoadException = true;
                            if(this.fireEvent('loadException', {
                                type: 'loadException',
                                target: this,
                                throwObject: e
                            }) !== false)
                                throw e;
                        } finally {
                            data = null;
                            dataRecords = null;
                        }
                        if (this.focusFirstRow !== false && this.focusFirstRow > -1) 
                            this.focusRow({
                                row: this.data.length > 0 ? this.focusFirstRow : -1,
                                forceRow: true
                            });
                    } else 
                    	Rui.later(this.lazyLoadTime, this, fn, [i, options, data]);
                }
                if(this.lazyLoad === true) {
                	Rui.later(this.lazyLoadTime, this, fn, [0, options, data]);
                } else {
                	fn.call(this, 0, options, data);
                }
            }
            options = null;
        },
        getCount: function(){
            return this.data.length;
        },
        getModifiedRecords: function(){
            return this.modified == null ? new Rui.util.LCollection() : this.modified;
        },
        serialize: function(){
            var result = [];
            for (var i = 0; i < this.getCount(); i++) {
                var record = this.getAt(i);
                result.push(record.serialize());
            }
            return result.join('&');
        },
        serializeModified: function(isAll){
            var modifiedRecords = this.getModifiedRecords();
            var result = [];
            for (var i = 0; i < modifiedRecords.length; i++) {
                var record = modifiedRecords.getAt(i);
                if (isAll !== true && (record.state != Rui.data.LRecord.STATE_DELETE && Rui.isEmpty(this.get(record.id)))) 
                    continue;
                result.push(record.serialize());
            }
            return result.join('&');
        },
        serializeMarkedOnly: function(){
            var records = this.selectedData;
            var result = [];
            for (var i = 0; i < records.length; i++) {
                var record = records.getAt(i);
                if (isAll !== true && (record.state != Rui.data.LRecord.STATE_DELETE && Rui.isEmpty(this.get(record.id)))) 
                    continue;
                result.push(record.serialize());
            }
            return result.join('&');
        },
        serializeDataSetList: function(dataSets){
            var params = [];
            for (var i = 0; i < dataSets.length; i++) {
                var dataSetEl = Rui.util.LDom.get(dataSets[i]);
                params.push(dataSetEl.serialize());
            }
            return params.join('&');
        },
        serializeModifiedDataSetList: function(dataSets){
            var params = [];
            for (var i = 0; i < dataSets.length; i++) {
                var dataSetEl = Rui.util.LDom.get(dataSets[i]);
                params.push(dataSetEl.serializeModified());
            }
            return params.join('&');
        },
        serializeMarkedOnlyDataSetList: function(dataSets){
            var params = [];
            for (var i = 0; i < dataSets.length; i++) {
                var dataSetEl = Rui.util.LDom.get(dataSets[i]);
                params.push(dataSetEl.serializeMarkedOnly());
            }
            return params.join('&');
        },
        commit: function(){
            if(this._isFiltered == true) {
            	this.filterData = this.data.clone();
            	this.mergeModifiedData(this.data);
            }
            if (this.remainRemoved) {
            	if(this._isFiltered === true) this.filterModified = this.modified.clone();
                while (this.modified.length > 0) {
                    var record = this.modified.getAt(0);
                    if (record.state == Rui.data.LRecord.STATE_DELETE) {
                        this.data.remove(record.id);
                        if(this.filterData){
                            this.filterData.remove(record.id);
                            this.snapshot.remove(record.id);
                        } 
                    }
                    if(this._isFiltered !== true) record.commit();
                    this.modified.remove(record.id);
                }
                if(this._isFiltered === true) {
                	this.modified = this.filterModified;
                	delete this.filterModified;
                }
                if(this._isFiltered !== true) this.dataChanged();
            }
            else 
                this.commitRecords();
            if(this._isFiltered == true) {
            	this.mergeModifiedData(this.snapshot);
            	this.data = this.filterData;
            	delete this.filterData;
                this.modified.each(function(id, record){
                    record.state = Rui.data.LRecord.STATE_NORMAL;
                    delete record.originData;
                }, this.data);
                this.modified.clear();
            	this.dataChanged();
            } else {
                this.modified.clear();
                this.snapshot = this.data.clone();
            }
            this.invalidData = {};
            this.fireEvent('commit', {
                type: 'commit',
                target: this
            });
        },
        commitRecords: function() {
            this.data.each(function(id, record){
                record.commit();
            }, this.data);
        },
        undo: function(idx){
            var record = this.data.getAt(idx);
            var state = record.state;
            if (state == Rui.data.LRecord.STATE_NORMAL) 
                return;
            record.undo();
            this.modified.remove(record.id);
            if (state == Rui.data.LRecord.STATE_INSERT) 
                this.data.remove(record.id);
            else 
                this.setMark(idx, false);
            delete this.invalidData[record.id];
            if(this.isBatch !== true) {
                this.fireEvent('undo', {
                    type: 'undo',
                    target: this,
                    row: idx,
                    record: record,
                    beforeState: state
                });
            }
            if(state !== Rui.data.LRecord.STATE_INSERT)
                this.validRow(idx);
            this.focusRow({
                ignoreCanRowPosChange: true,
                forceRow: (state == Rui.data.LRecord.STATE_INSERT)
            });
        },
        undoAll: function(){
            this.data = this.snapshot.clone();
            while (this.modified.length > 0) {
                var record = this.modified.getAt(this.modified.length - 1);
                if (record.isModified()) {
                    record.undo();
                    record.state = this.lastOptions ? this.lastOptions.state : Rui.data.LRecord.STATE_NORMAL;
                }
                this.modified.remove(record.id);
            }
            this.modified.clear();
            this.invalidData = {};
            if(this.isBatch !== true) {
                this.fireEvent('dataChanged', {
                    type: 'dataChanged',
                    target: this,
                    eventType: _DS.DATA_CHANGED_TYPE1,
                    moveRow: false,
                    forceRow: true
                });
            }
            this.focusRow({
                ignoreCanRowPosChange: true,
                forceRow: true
            });
        },
        dataChanged: function(){
            if(this.isBatch !== true) {
                this.fireEvent('dataChanged', {
                    type: 'dataChanged',
                    target: this,
                    eventType: _DS.DATA_CHANGED_TYPE1
                });
            }
        },
        focusRow: function(config){
            if(this.isBatch) return;
            config = Rui.applyIf(config ||
            {}, {
                ignoreCanRowPosChange: false,
                forceRow: false,
                row: this.getRow()
            });
                var row = config.row;
                var count = this.getCount();
                if (count > 0 && row > -1) {
                    if (row > count - 1) {
                        config.forceRow = false;
                        this.setRow(count - 1, config); 
                    }
                    else 
                        this.setRow(row, config);
                }
                else {
                    this.setRow(-1, config);
                }
        },
        getRow: function(){
            return this.rowPosition;
        },
        setRow: function(row, config){
            config = Rui.applyIf(config ||
            {}, {
                forceRow: false,
                ignoreCanRowPosChange: false
            });
            if (this.getCount() - 1 < row || -1 > row || (this.getRow() == row && config.forceRow !== true)) 
                return false;
            if (row > this.getCount() || (config.ignoreCanRowPosChange == false && this.doCanRowPosChange(row) == false)) 
                return false;
            return this.doRowPosChange(row, config.forceRow);
        },
        doCanRowPosChange: function(row){
            if (this.rowPosition < 0 || this.getCount() - 1 < this.rowPosition) 
                return true;
            if(this.remainRemoved === true && this.getAt(this.rowPosition).state == Rui.data.LRecord.STATE_DELETE) return true;
            if(this.isBatch !== true) {
                return this.fireEvent('canRowPosChange', {
                    type: 'canRowPosChange',
                    target: this,
                    row: row,
                    oldRow: this.rowPosition
                });
            }
            return true;
        },
        doRowPosChange: function(row, forceRow){
            forceRow = forceRow === true ? true : false;
            if (this.getCount() < row || -1 > row || (this.getRow() == row && forceRow !== true)) 
                return false;
            var oldRowPosition = this.rowPosition;
            this.rowPosition = row;
            if(this.isBatch !== true) {
                this.fireEvent('rowPosChanged', {
                    type: 'rowPosChanged',
                    target: this,
                    row: this.rowPosition,
                    oldRow: oldRowPosition
                });
            }
            return true;
        },
        isRowInserted: function(row){
            if (row < 0) 
                return false;
            return this.getAt(row).state == Rui.data.LRecord.STATE_INSERT;
        },
        isRowUpdated: function(row){
            if (row < 0) 
                return false;
            return this.getAt(row).state == Rui.data.LRecord.STATE_UPDATE;
        },
        isRowDeleted: function(row){
            if (row < 0) 
                return false;
            return this.getAt(row).state == Rui.data.LRecord.STATE_DELETE;
        },
        isRowModified: function(row){
            return this.isRowInserted(row) || this.isRowUpdated(row) || this.isRowDeleted(row);
        },
        isUpdated: function(){
            return this.modified.length > 0 ? true : false;
        },
        isMarkable: function(row){
            if (this.isBatch !== true) {
                if (this.canMarkableEvent && this.fireEvent('canMarkable', {
                    type: 'canMarkable',
                    target: this,
                    row: row
                }) === false) 
                    return false;
            }
            return true;
        },
        setMark: function(row, isSelect, force){
            if (row < 0 || row > this.getCount()) return;
            if (this.isMarked(row) == isSelect) return;
            if (!!!force && this.isMarkable(row) == false) return;
            var record = this.getAt(row);
            if (isSelect) {
                if (!this.selectedData.has(record.id)) 
                    this.selectedData.add(record.id, record);
            } else {
                this.selectedData.remove(record.id);
            }
            if(this.isBatch !== true) {
                this.fireEvent('marked', {
                    type: 'marked',
                    target: this,
                    row: row,
                    isSelect: isSelect,
                    record: record
                });
            }
        },
        setMarkOnly: function(row, isSelect){
            if (row < 0 || row > this.getCount())
                return;
            this.setDemarkExcept(row);
            this.setMark(row, isSelect);
        },
        setDemarkExcept: function(row){
            if (this.getMarkedCount() > 0) {
                for (var i = 0; i < this.getCount(); i++) {
                    if (this.isMarked(i) && i != row) 
                        this.setMark(i, false);
                }
            }
        },
        isMarked: function(row){
            var record = this.getAt(row);
            if (record && this.selectedData.has(record.id)) 
                return true;
            else 
                return false;
        },
        getMarkedCount: function(){
            return this.selectedData.length;
        },
        setMarkRange: function(sInx, eInx, isSelect){
        	if(isSelect === true) {
                for (var i = sInx; i <= eInx; i++) {
                    this.setMark(i, isSelect);
                }
        	} else {
        		for (var i = eInx; i >= sInx; i--) {
                    this.setMark(i, isSelect);
                }
        	}
        },
        getMarkedRange: function() {
        	return this.selectedData;
        },
        setMarkAll: function(isSelect){
            if(Rui.browser.msie67 && !isSelect) {
                var canMarkableEvent = this.__simple_events['canMarkable'];
                var markedEvent = this.__simple_events['marked'];
                var isRemove = false;
                if(!canMarkableEvent || !markedEvent) {
                    isRemove = true;
                } else {
                    isRemove = true;
                    for (var i = 0, len = canMarkableEvent.length; i < len; i++) {
                        if(!canMarkableEvent[i].system) {
                            isRemove = false;
                            break;
                        }
                    }
                    for (var i = 0, len = markedEvent.length; i < len; i++) {
                        if(!markedEvent[i].system) {
                            isRemove = false;
                            break;
                        }
                    }
                    if(isRemove) this.selectedData.clear();
                }
            }
            this.setMarkRange(0, this.getCount() - 1, isSelect);
            if(this.isBatch !== true) {
                this.fireEvent('allMarked', {
                    type: 'allMarked',
                    target: this,
                    isSelect: isSelect
                });
            }
        },
        clearMark: function(){
            this.selectedData.clear();
            if(this.isBatch !== true) {
                this.fireEvent('allMarked', {
                    type: 'allMarked',
                    target: this,
                    isSelect: false
                });
            }
        },
        removeMarkedRow: function(option){
        	this.removeMarkedRows(option);
        },
        removeMarkedRows: function(option){
            option = Rui.applyIf(option || {}, {
                ignoreEvent: true,
                moveRow: false
            });
            while (this.selectedData.length > 0) {
                var key = this.selectedData.getKey(0);
                var row = this.indexOfKey(key);
                this.removeAt(row, option);
            }
            if (option.ignoreEvent === true && this.isBatch !== true) {
                this.fireEvent('dataChanged', {
                    type: 'dataChanged',
                    target: this,
                    eventType: _DS.DATA_CHANGED_TYPE1,
                    moveRow: option.moveRow,
                    forceRow: true
                });
                if (this.rowPosition > this.getCount() - 1) 
                    this.focusRow({
                        ignoreCanRowPosChange: true,
                        forceRow: true
                    });
            }
        },
        filter: function(fn, scope, focusRow){
            focusRow = focusRow !== false ? true : false;
            var rId = null;
            var row = this.getRow();
            var r = this.data.getAt(row);
            if(focusRow && r && row > -1)
                rId = r.id;
            this.data = this.query(fn, scope || this);
            if(this.lastSortInfo)
                this.sort(this.lastSortInfo.fn, this.lastSortInfo.direction);
            this._isFiltered = true;
            row = this.data.indexOfKey(rId);
            if(this.isBatch !== true) {
                this.fireEvent('dataChanged', {
                    type: 'dataChanged',
                    target: this,
                    eventType: _DS.DATA_CHANGED_TYPE1,
                    moveRow: false,
                    forceRow: focusRow
                });
                r = this.data.getAt(row);
                if (focusRow){
                    if(Rui.isUndefined(r) && this.getCount() > 0) row = 0; 
                    this.focusRow({
                        ignoreCanRowPosChange: true,
                        forceRow: focusRow,
                        row: row
                    });
                }
            }
            if(this.rowPosition >= this.data.length) this.rowPosition = -1;
        },
        clearFilter: function(focusRow){
            focusRow = focusRow !== false ? true : false;
            var count = this.getCount();
            if (count < 1 && this.modified.length < 1 && this.snapshot.length < 1) 
                return;
            var rId = null;
            var row = this.getRow();
            var r = this.data.getAt(row);
            if(focusRow && r && row > -1)
                rId = r.id;
            this.data = this.snapshot.clone();
            this.mergeModifiedData(this.data);
            if(this.lastSortInfo)
                this.sort(this.lastSortInfo.fn, this.lastSortInfo.direction);
            delete this._isFiltered;
            row = this.data.indexOfKey(rId);
            focusRow = focusRow !== false ? true : false;
            if(this.isBatch !== true) {
                this.fireEvent('dataChanged', {
                    type: 'dataChanged',
                    target: this,
                    eventType: _DS.DATA_CHANGED_TYPE1,
                    moveRow: false,
                    forceRow: focusRow
                });
                if (focusRow){
                    if(Rui.isUndefined(r) && this.getCount() > 0) row = 0; 
                    this.focusRow({
                        ignoreCanRowPosChange: true,
                        forceRow: focusRow,
                        row: row
                    });
                }
            }
            if(this.rowPosition >= this.data.length) this.rowPosition = -1;
        },
        isFiltered: function(){
            return !!this._isFiltered;
        },
        mergeModifiedData: function(data) {
            var modiCnt = this.modified.length;
            if(modiCnt > 0) {
            	for (var i = 0; i < modiCnt; i++) {
            		var mRecord = this.modified.getAt(i);
            		if(mRecord.state === Rui.data.LRecord.STATE_INSERT) {
            			if(!data.has(mRecord.id)) data.insert(data.length, mRecord);
            		} else if(mRecord.state === Rui.data.LRecord.STATE_DELETE) {
            			if(!this.remainRemoved) data.remove(mRecord.id);
            		}
            	}
            }
        },
        query: function(fn, scope){
            this.data = this.snapshot.clone();
            this.mergeModifiedData(this.data);
            return this.data.query(fn, scope || this);
        },
        getTotalCount: function(){
            return this.totalCount || this.snapshot.length;
        },
        getRecords: function(startIndex, endIndex){
            startIndex = startIndex || 0;
            endIndex = (Rui.isUndefined(endIndex) || (endIndex > this.getCount() - 1)) ? this.getCount() - 1 : endIndex;
            var recordList = new Array();
            for (var i = startIndex; i <= endIndex; i++) 
                recordList.push(this.getAt(i));
            return recordList;
        },
        sort: function(fn, desc){
        	desc = desc || 'asc';
            var row = this.getRow();
            var rId = null;
            if (row > -1 && row < this.getCount()) 
                rId = this.getAt(row).id;
            this.data.sort(fn, desc);
            this.lastSortInfo = {
                fn: fn,
                direction: desc
            };
            if(this.isBatch !== true) {
                this.fireEvent('dataChanged', {
                    type: 'dataChanged',
                    target: this,
                    eventType: _DS.DATA_CHANGED_TYPE2,
                    moveRow: true,
                    forceRow: true
                });
                if (rId) {
                    row = this.data.indexOfKey(rId);
                    if (row > -1) 
                        this.focusRow({
                            ignoreCanRowPosChange: true,
                            forceRow: true,
                            row: row
                        });
                }
                else 
                    this.focusRow({
                        ignoreCanRowPosChange: true,
                        forceRow: true
                    });
            }
        },
        sortField: function(fieldName, desc){
            var field = this.getFieldById(fieldName);
            var sortType = function(s) {return s;};
            if (field != null) sortType = field.sortType;
            if(this.multiSortable !== true) {
            	this.sortDirection = {};
            } else this.sortDirection = this.sortDirection || {};
            if (Rui.isUndefined(desc)) {
                var fieldDesc = this.sortDirection[fieldName];
                desc = !fieldDesc ? '' : (fieldDesc == 'asc') ? 'desc' : 'asc';
            }
            this.sortDirection[fieldName] = desc;
            var sortInfos = this.sortDirection;
            this.sorts(sortInfos);
            if(desc == '') {
            	delete this.sortDirection[fieldName];
            	var m, isSortData = false;
            	for (m in this.sortDirection) {
            		isSortData = true;
            		break;
            	}
            	if(isSortData == false) delete this.lastSortInfo;
            } else {
                this.lastSortInfo.fieldName = fieldName;
            }
            return desc;
        },
        sorts: function(sortInfos) {
        	this.sortDirection = sortInfos;
            this.sort(function(vo1, vo2, c){
                var r1 = vo1.value;
                var r2 = vo2.value;
                var key1 = vo1.key;
                var key2 = vo2.key;
                var ret = 0;
                for (f in sortInfos) {
                    var dir = sortInfos[f];
                    var v1 = r1.get(f);
                    var v2 = r2.get(f);
                    if(dir) {
                    	if(typeof v1 === 'string') v1 = v1.toLowerCase();
                    	if(typeof v2 === 'string') v2 = v2.toLowerCase();
                    	if(Rui.isEmpty(v1)) v1 = '';
                    	if(Rui.isEmpty(v2)) v2 = '';
                        ret = (v1 > v2 ? 1 : (v1 < v2 ? -1 : 0)) * (dir === 'asc' ? 1 : -1);
                        if(ret != 0) break; 
                    } else {
                        ret = key1 > key2 ? 1 : (key1 < key2 ? -1 : 0);
                    }
                }
                return ret;
            }, 'asc');
        },
        reverse: function(){
            this.data.reverse();
            if(this.isBatch !== true) {
                this.fireEvent('dataChanged', {
                    type: 'dataChanged',
                    target: this,
                    eventType: _DS.DATA_CHANGED_TYPE2,
                    moveRow: true,
                    forceRow: true
                });
                this.focusRow({
                    ignoreCanRowPosChange: false,
                    forceRow: true
                });
            }
        },
        commitSort: function() {
            delete this.sortDirection;
            delete this.lastSortInfo;
        },
        indexOfRecord: function(oRecord){
            if (oRecord)
                return this.data.indexOfKey(oRecord.id);
            return null;
        },
        setState: function(row, state){
            var record = this.getAt(row);
            if (record.state != state) 
                record.setState(state);
        },
        updateState: function(record){
            if (record.state == Rui.data.LRecord.STATE_NORMAL && record.getOriginData().length == 0) 
                this.modified.remove(record.id);
            else {
                if (!this.modified.has(record.id)) {
                    this.modified.add(record.id, record);
                }
                else {
                    this.modified.set(record.id, record);
                }
            }
        },
        setFields: function(f){
            if (this.getCount() > 0 || this.modified.length > 0) 
                this.clearData();
            for (var i = 0; i < f.length; i++) {
                if (!(f[i] instanceof Rui.data.LField)) 
                    f[i] = new Rui.data.LField(f[i]);
            }
            this.fields = f;
            delete this.fieldMap;
            this.fireEvent('fieldsChanged', {
                type: 'fieldsChanged',
                target: this
            });
            this.focusRow({
                ignoreCanRowPosChange: true,
                forceRow: true,
                row: 0
            });
        },
        getFields: function(){
            return this.fields;
        },
        getState: function(row){
            var record = this.getAt(row);
            return record ? record.state : Rui.data.LRecord.STATE_NORMAL;
        },
        clone: function(id){
            var config = (typeof id == 'object') ? id : {
                id: id,
                fields: this.fields
            };
            var newDataSet = new this.constructor(config);
            newDataSet.isLoad = this.isLoad;
            for (var i = 0, len = this.data.length; i < len; i++) {
                var record = this.data.getAt(i);
                var newRecord = record.clone();
                newRecord.state = record.state;
                newRecord.dataSet = undefined;
                newDataSet.add(newRecord);
                newDataSet.snapshot.add(newRecord);
            }
            return newDataSet;
        },
        getValue: function(row, col){
            if (col < 0 || col > this.fields.length - 1) 
                return null;
            var colId = this.fields[col].id;
            return this.getNameValue(row, colId);
        },
        getNameValue: function(row, colId){
            if (row < 0 || row > this.getCount() - 1) 
                return null;
            var record = this.getAt(row);
            return record.get(colId);
        },
        setValue: function(row, col, value, option){
            if (col < 0 || col > this.fields.length - 1) 
                throw new Rui.LException('Invalid col');
            var colId = this.fields[col].id;
            this.setNameValue(row, colId, value, option);
        },
        setNameValue: function(row, colId, value, option){
            if (row < 0 || row > this.getCount() - 1) 
                throw new Rui.LException('Invalid row');
            var record = this.getAt(row);
            record.set(colId, value, option);
        },
        sum: function(colId, startRow, endRow){
            startRow = startRow || 0;
            endRow = typeof endRow !== 'undefined' ? endRow : (this.getCount() - 1);
            var value = 0;
            for (var row = startRow; row <= endRow; row++) {
                var r = this.getAt(row);
                if(r.state !== Rui.data.LRecord.STATE_DELETE)
                    value += parseFloat(r.get(colId), 10) || 0;
            } 
            return value;
        },
        max: function(colId, startRow, endRow){
            startRow = startRow || 0;
            endRow = typeof endRow !== 'undefined' ? endRow : (this.getCount() - 1);
            var value = 0;
            for (var row = startRow; row <= endRow; row++) {
                var r = this.getAt(row);
                var currVal = 0;
                if(r.state !== Rui.data.LRecord.STATE_DELETE)
                	currVal += parseFloat(r.get(colId), 10) || 0;
                if(value < currVal) value = currVal;
            }
            return value;
        },
        min: function(colId, startRow, endRow){
            startRow = startRow || 0;
            endRow = typeof endRow !== 'undefined' ? endRow : (this.getCount() - 1);
            var value = 0;
            for (var row = startRow; row <= endRow; row++) {
                var r = this.getAt(row);
                if(row === startRow) value = parseFloat(r.get(colId), 10) || 0;
                var currVal = 0;
                if(r.state !== Rui.data.LRecord.STATE_DELETE)
                	currVal += parseFloat(r.get(colId), 10) || 0;
                if(value > currVal) value = currVal;
            }
            return value;
        },
        avg: function(colId, startRow, endRow){
            startRow = startRow || 0;
            endRow = typeof endRow !== 'undefined' ? endRow : (this.getCount() - 1);
            var value = cnt = 0;
            for (var row = startRow; row <= endRow; row++) {
                var r = this.getAt(row);
                if(r.state !== Rui.data.LRecord.STATE_DELETE)
                    value += parseFloat(r.get(colId), 10) || 0;
                cnt++;
            }
            value = value / cnt;
            return value;
        },
        invalid: function(row, rowId, col, colId, message, value, isMulti){
            if(this.isBatch !== true) {
                this.fireEvent('invalid', {
                    type: 'invalid',
                    target: this,
                    row: row,
                    rowId: rowId,
                    col: col,
                    colId: colId,
                    message: message,
                    value: value,
                    isMulti: isMulti
                });
            }
            this.invalidData[rowId] = this.invalidData[rowId] || {};
            this.invalidData[rowId][colId] = true;
        },
        valid: function(row, rowId, col, colId, isMulti){
            if(this.isBatch !== true) {
                this.fireEvent('valid', {
                    type: 'valid',
                    target: this,
                    row: row,
                    rowId: rowId,
                    col: col,
                    colId: colId,
                    isMulti: isMulti
                });
            }
            this.invalidData[rowId] = this.invalidData[rowId] || {};
            delete this.invalidData[rowId][colId];
        },
        isValid: function(row, rowId, col, colId){
            if (this.invalidData[rowId]) {
                return this.invalidData[rowId][colId] === true ? false : true;
            }else 
                return true;
        },
        validRow: function(row){
            var rowId = this.getAt(row).id;
            for (var i = 0; i < this.fields.length; i++) 
                this.valid(row, rowId, i, this.fields[i].id, false);
        },
        batch: function(fn, scope) {
            this.isBatch = true;
            scope = scope || this;
            fn.call(scope);
            this.isBatch = false;
            this.fireEvent('dataChanged', {
                type: 'dataChanged',
                target: this,
                eventType: _DS.DATA_CHANGED_TYPE2
            });
        },
        toString: function(){
            return 'Rui.data.LDataSet ' + this.id;
        }
    });
})();
Rui.namespace('Rui.data');
Rui.data.LField = function(config){
    if(typeof config == 'string'){
        config = {id: config, name:config};
    }
    this.id = config.id;
    Rui.applyObject(this, config);
};
Rui.data.LField.prototype = {
    id: null,
    otype:'Rui.data.LField',
    type:'string',
    defaultValue: undefined,
    sortType: function(s) {return s;}
};
Rui.namespace('Rui.data');
Rui.data.LRecord = function(data, config) {
    config = config || { dataSet: null };
    this.data = data;
    this.attrData = null;
    this.dataSet = config.dataSet;
    this.state = Rui.isUndefined(config.state) == false ? config.state : Rui.data.LRecord.STATE_INSERT;
    this.lastConfig = config;
    this.id = (config.id || config.id == 0) ? config.id : null;
    this.initData = typeof config.initData !== 'undefined' ? config.initData : false;
    this.isLoad = config.isLoad;
    config = null;
};
Rui.data.LRecord.prototype = {
    otype: 'Rui.data.LRecord',
    modified: null,
    originData: null,
    getOriginData: function() {
        if(!this.originData)
            this.originData = new Rui.util.LCollection();
        return this.originData;
    },
    initRecord: function() {
        if(this.dataSet) {
            if(this.initData || (this.state != Rui.data.LRecord.STATE_NORMAL)) {
                var len = this.dataSet.fields.length;
                var originData = this.getOriginData();
                for (var i = 0 ; i < len ; i++) {
                    var field = this.dataSet.fields[i];
                    var value = this.data[field.id];
                    if(this.initData) {
                        value = Rui.isUndefined(value) ? field.defaultValue : value;
                        this.data[field.id] = value;
                    }
                    if (this.state != Rui.data.LRecord.STATE_NORMAL) {
                        originData.add(field.id, this.data[field.id]);
                    }
                    field = null;
                    value = null;
                }
                originData = null;
            }
        }
    },
    getId: function() {
        return this.id;
    },
    get: function(key) {
        return this.data[key];
    },
    set: function(key, value, option) {
        if((option && option.system) && this.state === Rui.data.LRecord.STATE_DELETE) return;
        option = option || {};
        var field = originData = orgValue = null;
        try {
            field = this.findField(key);
            if(field == null)
                field = new Rui.data.LField({ id: key }); 
            var originData = this.getOriginData();
            if(Rui.isEmpty(value) == false) {
                if((field.type == 'number' && typeof parseFloat(value) != 'number') || (field.type == 'number' && isNaN(value)) || (field.type == 'date' && typeof value != 'object'))
                    throw new Rui.LException(key + ': Invalid type [' + field.type + ':' + value + ']');
                 value = (field.type == 'string' && typeof value != 'string') ? value + '' : value;
            }
            var beforeValue = this.data[key];
            orgValue = originData.get(key);
            if((String(orgValue) == String(value) && originData.has(key)) ||
                    (orgValue === undefined && value === undefined)) {
                originData.remove(key);
                this.updateState();
                this.data[key] = value;
            } else {
                if (String(this.data[key]) == String(value)) {
                    this.updateState();
                    return;
                }
                if (!originData.has(key)) {
                    originData.add(key, this.data[key]);
                }
                if(this._unDo !== true) {
                    this.data[key] = value;
                    if(this.state === Rui.data.LRecord.STATE_NORMAL)
                        this.state = Rui.data.LRecord.STATE_UPDATE;
                }
            }
            if(!this.dataSet) {
                return;
            }
            if(this.dataSet)
                this.dataSet.updateState(this);
            if(option.ignoreEvent !== true) {
                var isEvent = false;
                if(this._unDo === true) {
                    if(this._unDoKey[key] !== true) {
                        this._unDoKey[key] = isEvent = true;
                    }
                } else isEvent = true;
                if(isEvent === true && this.dataSet && this.dataSet.onFieldChanged) {
                    var originValue = originData.has(key) ? originData.get(key) : value;
                    this.dataSet.onFieldChanged.call(this.dataSet, {
                        target: this,
                        colId: key,
                        value: value,
                        originValue: originValue,
                        beforeValue: beforeValue,
                        system: option.system
                    });
                }
            }
        } finally {
            option = field = originData = orgValue = null;
        }
    },
    getAttributes: function() {
        return this.attrData || {};
    },
    getAttribute: function(key) {
        return this.attrData ? this.attrData[key] : null;
    },
    setAttribute: function(key, value) {
        if(!this.attrData) this.attrData = {};
        this.attrData[key] = value;
    },
    updateState: function() {
        var originData = this.getOriginData();
        if(this.state !== Rui.data.LRecord.STATE_DELETE) {
            if (this.state != Rui.data.LRecord.STATE_INSERT) {
                if(!Rui.isUndefined(this.lastConfig.state) && this.lastConfig.state != Rui.data.LRecord.STATE_NORMAL)
                    this.state = this.lastConfig.state;
                else if(originData.length > 0 && this.state == Rui.data.LRecord.STATE_NORMAL) {
                    this.state = Rui.data.LRecord.STATE_UPDATE;
                } else if(originData.length == 0){
                    this.state = Rui.data.LRecord.STATE_NORMAL;
                }
            }
        }
        originData = null;
    },
    undo: function(ignoreEvent) {
        var originData = this.getOriginData();
        this._unDo = true;
        this._unDoKey = {};
        if(this.state != Rui.data.LRecord.STATE_INSERT) {
            this._unDo = true;
            var max = originData.length;
            while (max > 0) {
                this.set(originData.getKey(max - 1), originData.getAt(max - 1), { ignoreEvent: ignoreEvent });
                max = originData.length;
            }
            this._unDo = false;
        } else {
            for (var i = 0 ; i < originData.length ; i++) {
                var key = originData.getKey(i);
                var value = originData.getAt(i);
                this.data[key] = value;
            }
            originData.clear();
        }
        delete this._unDoKey;
        delete this._unDo;
        this.state = Rui.isUndefined(this.lastConfig.state) ? Rui.data.LRecord.STATE_INSERT :this.lastConfig.state;
        originData = null;
    },
    setState: function(state) {
        var beforeState = this.state;
        this.state = state;
        if(this.state == Rui.data.LRecord.STATE_NORMAL)
            delete this.originData;
        if(this.dataSet && this.dataSet.onStateChanged) {
            this.dataSet.updateState(this);
            if(this.dataSet.isBatch !== true)
                this.dataSet.onStateChanged.call(this.dataSet, {
                    target: this,
                    state: state,
                    beforeState: beforeState
                });
        }
    },
    getState: function() {
        return this.state;
    },
    commit: function() {
        this.state = Rui.data.LRecord.STATE_NORMAL;
        this.getOriginData().clear();
    },
    getModifiedData: function() {
        var originData = this.getOriginData();
        var newData = {};
        for (var i = 0 ; i < originData.length ; i++) {
            var key = originData.getKey(i);
            newData[key] = this.get(key);
        }
        try {
            return newData;
        } finally {
            originData = null;
            newData = null;
        }
    },
    serialize: function(isOrigin) {
        isOrigin = isOrigin || false;
        var prefix = isOrigin ? '' : 'rui_' + this.dataSet.id.toLowerCase() + '_';
        var result = 'rui_' + this.dataSet.id.toLowerCase() + '_Id=' + this.id + '_' + this.state + '&';
        for (var i = 0 ; i < this.dataSet.fields.length ; i++) {
            var value = this.get(this.dataSet.fields[i].id);
            if(value == null) value = '';
            result += prefix + this.dataSet.fields[i].id + '=' + value + '&';
            value = null;
        }
        result = Rui.util.LString.lastCut(result, 1);
        return result;
    },
    getValues: function() {
        var o = {};
        if (!this.dataSet) {
            Rui.applyObject(o, this.data);
        } else {
            Rui.util.LArray.each(this.dataSet.fields, function(c) {
                o[c.id] = this.data[c.id];
            }, this);
        }
        try {
            return o;
        } finally {
            o = null;
        }
    },
    findField: function(id) {
        return this.dataSet ? this.dataSet.getFieldById(id) : null;
    },
    setValues: function(o) {
        for (id in o) {
            if(!this.dataSet || this.findField(id) != null)
                this.set(id, o[id]);
        }
    },
    isModifiedField: function(id) {
        return this.originData && this.getOriginData().has(id);
    },
    isModified: function() {
        if (!this.dataSet) {
            return (this.getOriginData().length > 0) ? true : false;
        }
        return ((this.getOriginData().length > 0) ? true : false) || (this.dataSet.lastOptions ? this.dataSet.lastOptions.state != this.state : this.state != 0);
    },
    clone: function(config) {
        config = config || {};
        config.id = config.id || Rui.data.LRecord.getNewRecordId();
        config.state = !Rui.isUndefined(config.state) ? config.state : this.state;
        var newData = {};
        Rui.applyObject(newData, this.data);
        var newAttrData = {};
        Rui.applyObject(newAttrData, this.getAttributes());
        var record = new Rui.data.LRecord(newData, {
            id: config.id,
            state : config.state
        });
        record.attrData = newAttrData;
        try {
            return record;
        } finally {
            config = null;
            newData = null;
            newAttrData = null;
            record = null;
        }
    },
    destroy: function() {
        delete this.data;
        delete this.attrData;
        delete this.modified;
        delete this.dataSet;
        delete this.id;
    },
    toString: function() {
        return 'Rui.data.LRecord ' + this.id;
    }
};
Rui.data.LRecord.AUTO_ID = 1000;
Rui.data.LRecord.STATE_NORMAL = 0;
Rui.data.LRecord.STATE_INSERT = 1;
Rui.data.LRecord.STATE_UPDATE = 2;
Rui.data.LRecord.STATE_DELETE = 3;
Rui.data.LRecord.getNewRecordId = function(){
    return 'r' + (++Rui.data.LRecord.AUTO_ID);
};
Rui.data.LJsonDataSet = function(config) {
    Rui.data.LJsonDataSet.superclass.constructor.call(this, config);
    this.dataSetType = Rui.data.LJsonDataSet.DATA_TYPE; 
};
Rui.extend(Rui.data.LJsonDataSet, Rui.data.LDataSet, {
    getReadDataMulti: function(dataSet, conn, config){
        var data = this.getReadResponseData(conn);
        var isMulti = config && config.multi === true;
        var dataIndex = dataSet.dataIndex;
        var dataSetId = config && config.dataSetId ? config.dataSetId : dataSet.id;
        if(Rui.isUndefined(dataIndex)) {
            for (var i = 0 ; i < data.length ; i++) {
                if(data[i].metaData && data[i].metaData.dataSetId == dataSetId) {
                    dataIndex = i;
                    break;
                }
            }
            if(isMulti !== true) dataIndex = Rui.isUndefined(dataIndex) ? 0 : dataIndex;
        }
        var rowData = [];
        if(!Rui.isUndefined(dataIndex)) {
            var rootData = data[dataIndex].records;
            this.totalCount = (data[dataIndex].metaData && data[dataIndex].metaData.totalCount) ? data[dataIndex].metaData.totalCount : rootData.length;
            var rLen = rootData.length;
            var fLen = dataSet.fields.length;
            for (var i = 0; i < rLen; i++) {
                var node = rootData[i];
                var colData = node;
                for (var col = 0 ; col < fLen ; col++) {
                    var field = dataSet.fields[col];
                    var value = node[field.id];
                    if(this.readFieldFormater) {
                        var formater = this.readFieldFormater[field.type];
                        value = formater ? formater(value) : value;
                    }
                    colData[field.id] = value;
                }
                rowData.push(colData);
            }
        }
        try {
            return rowData;
        } finally {
            rootData = rowData = data = null;
        }
    },
    serialize: function() {
        var result = {};
        var count = this.getCount();
        result.metaData = {
            dataSetId:this.id,
            count: count,
            totalCount: this.getTotalCount()
        };
        if(this.serializeMetaData !== false){
            var fields = [{name: 'duistate', dataType: 'int'}];
            for (var i = 0, len = this.fields.length; i < len; i++){
                var field = this.fields[i],
                    f = {name: field.id};
                if(field.type) f.dataType = field.type;
                if(field.defaultValue) f.defaultValue = field.defaultValue;
                fields.push(f);
            }
            result.metaData.fields = fields;
        }
        var records = [];
        for (var i = 0 ; i < count ; i++) {
            var record = this.getAt(i);
            var r = {
                duistate: record.state
            };
            for (var j = 0, len = this.fields.length ; j < len ; j++) {
                var field = this.fields[j];
                var value = record.get(field.id);
                if (this.writeFieldFormater) {
                    var formater = this.writeFieldFormater[field.type];
                    if(formater) value = formater(value);
                }
                if(value == null) value = '';
                r[this.fields[j].id] = value; 
            }
            records.push(r);
        }
        result.records = records;
        return Rui.util.LJson.encode(result);
    },
    serializeModified: function(isAll) {
        return this.serializeRecords(this.getModifiedRecords(), isAll);
    },
    serializeMarkedOnly: function() {
    	return this.serializeRecords(this.selectedData, true);
    },
    serializeRecords: function(selectedRecords, isAll) {
        var result = {};
        var count = selectedRecords.length;
        result.metaData = {
            dataSetId:this.id,
            count: count,
            totalCount: this.getTotalCount()
        };
        if(this.serializeMetaData !== false){
            var fields = [{name: 'duistate', dataType: 'int'}];
            for (var i = 0, len = this.fields.length; i < len; i++){
                var field = this.fields[i],
                    f = {name: field.id};
                if(field.type) f.dataType = field.type;
                if(field.defaultValue) f.defaultValue = field.defaultValue;
                fields.push(f);
            }
            result.metaData.fields = fields;
        }
        var records = [];
        for (var i = 0 ; i < count ; i++) {
            var record = selectedRecords.getAt(i);
            if(isAll !== true && (record.state != Rui.data.LRecord.STATE_DELETE && Rui.isEmpty(this.get(record.id)))) continue;
            var r = {
                duistate: record.state
            };
            for (var j = 0, len = this.fields.length ; j < len ; j++) {
                var field = this.fields[j];
                var value = record.get(field.id);
                if (this.writeFieldFormater) {
                    var formater = this.writeFieldFormater[field.type];
                    if(formater) value = formater(value);
                }
                if(value == null) value = '';
                r[this.fields[j].id] = value; 
            }
            records.push(r);
        }
        result.records = records;
        return Rui.util.LJson.encode(result);
    },
    serializeDataSetList: function(dataSets) {
        return this.serializeFnNameDataSetList(dataSets, 'serialize');
    },
    serializeModifiedDataSetList: function(dataSets) {
        return this.serializeFnNameDataSetList(dataSets, 'serializeModified');
    },
    serializeMarkedOnlyDataSetList: function(dataSets) {
        return this.serializeFnNameDataSetList(dataSets, 'serializeMarkedOnly');
    },
    serializeFnNameDataSetList: function(dataSets, fnName) {
        var buf = [];
        buf.push('[');
        for (var i = 0 ; i < dataSets.length ; i++) {
            var dataSetEl = Rui.util.LDom.get(dataSets[i]);
            buf.push(dataSetEl[fnName](), ',');
        }
        if(buf[buf.length - 1] == ',')
            delete buf[buf.length - 1];
        buf.push(']');
        var params = buf.join('');
        return params;
    }
});
Rui.data.LJsonDataSet.DATA_TYPE = 1;
Rui.data.LDelimiterDataSet = function(config) {
    Rui.data.LDelimiterDataSet.superclass.constructor.call(this, config);
    this.dataSetType = Rui.data.LDelimiterDataSet.DATA_TYPE; 
};
Rui.extend(Rui.data.LDelimiterDataSet, Rui.data.LDataSet, {
    dataSetDelimiter: '¶',
    recordDelimiter: '\r\n',
    fieldDelimiter: '‡',
    getReadResponseData: function(conn) {
        var data = null;
        try{
        	if(this._cachedData) return this._cachedData; 
            data = conn.responseText;
        } catch(e) {
            throw new Error(Rui.getMessageManager().get('$.base.msg110') + ':' + conn.responseText);
        }
        return data;
    },
    doSuccess: function(dataSet, conn){
        try {
            dataSet.firstLoadData(conn, dataSet.lastOptions);
        } 
        catch (e) {
            var isLoadException = dataSet.isLoadException;
            if(isLoadException) throw e;
            if(dataSet.fireEvent('loadException', {
                type: 'loadException',
                target: dataSet,
                throwObject: e,
                conn: conn
            }) !== false)
                throw e;
        }
    },
    firstLoadData: function(conn, options) {
        this.fireEvent('beforeLoadData');
        this.isLoading = true;
        options = options || {};
        delete this.isLoadException;
        var data = null;
        if (!options.add || options.add == false) {
            this.clearData({ ignoreEvent: true, ignoreMetaData: true });
        }
        data = this.getReadResponseData(conn);
        try {
            var groupData = data.split(this.dataSetDelimiter);
            var metaDatas = groupData[0].split(this.fieldDelimiter);
            this.totalCount = parseInt(metaDatas[1], 10);
            this.loadFieldMap = {};
            for (var i = 2 ; i < metaDatas.length ; i++) {
            	var f = metaDatas[i];
            	this.loadFieldMap[f] = i - 2;
            }
            var stateIdx = this.loadFieldMap['state'] || -1;
            var list = (groupData[1] == '') ? [] : groupData[1].split(this.recordDelimiter);
            for (var i = 0, len = list.length; i < len ; i++) {
                var record = list[i];
                var id = Rui.data.LRecord.getNewRecordId();
                if(stateIdx > -1 && false) {
                	var state = record.split(this.fieldDelimiter)[stateIdx];
                	if(state !== Rui.data.LRecord.STATE_NORMAL) {
                        record = this.createDelimiterRecord(record, options);
                        record.state = parseInt(state, 10);
                        record.dataSet = this;
                        this.modified.add(id, record);
                	}
                }
                this.data.add(id, record);
            }
            this.doDelayLoad();
        } finally {
            list = null;
            conn = null;
        }
        this.snapshot = this.data.clone();
        if(Rui.isDebugTI)
            Rui.log('dataSet load end', 'time');
        this.isLoading = false;
        this.isLoad = true;
        try{
            this.fireEvent('load', {
                type: 'load',
                target: this,
                options: options,
                message: data.message
            });
            data = null;
        } catch(e) {
            this.isLoadException = true;
            if(this.fireEvent('loadException', {
                type: 'loadException',
                target: this,
                throwObject: e
            }) !== false)
                throw e; 
        }
        if (this.focusFirstRow !== false && this.focusFirstRow > -1) 
            this.focusRow({
                row: this.focusFirstRow
            });
    },
    doDelayLoad: function() {
    	return;
    	this.delayLoadTasking = true;
    	if(this.delayLoadTask) {
    		this.delayLoadTask.cancel();
    		delete this.delayLoadTask;
    	}
    	this.delayStartRow = 0;
    	var delayFn = function(){
			var i = this.delayStartRow;
    		for (var j = 0; i < this.data.length && j < this.lazyLoadCount; i++, j++) {
    			this.getAt(i);
    		}
    		this.delayStartRow = i;
    		if(this.delayStartRow > this.data.length - 1) this.delayLoadTasking = false;
    		else this.delayLoadTask = Rui.later(this.lazyLoadTime, this, delayFn);
    	};
		this.delayLoadTask = Rui.later(this.lazyLoadTime, this, delayFn);
    },
    createDelimiterRecord: function(firstRowData, options) {
        var fields = this.fields;
        var options = Rui.applyIf(options, this.lastOptions);
        var dataList = firstRowData.split(this.fieldDelimiter);
        var sIdx = this.loadFieldMap['state'];
        var state = 0;
        var rowData = { state: state };
        if(!Rui.isUndefined(sIdx))
        	rowData.state = parseInt(dataList[sIdx], 10);
        for (var j = 0, flen = fields.length; j < flen ; j++) {
        	var idx = this.loadFieldMap[fields[j].id];
        	if(!Rui.isUndefined(idx)) {
                var value = dataList[idx];
                if(value === 'null') value = null;
                var formater = this.readFieldFormater[fields[j].type];
                rowData[fields[j].id] = (formater) ? formater(value) : value;
                formater = null;
        	}
        }
        var record = this.createRecord(rowData, {
            id: options.id || Rui.data.LRecord.getNewRecordId(),
            state: state,
            isLoad: options && options.isLoad === true ?  true : false
        });
        return record;
    },
    get: function(id){
        var record = this.data.get(id);
        if(record && !(record instanceof Rui.data.LRecord)) {
            var newRecord = this.createDelimiterRecord(record, { id: id });
            newRecord.dataSet = this;
            this.data.set(id, newRecord);
            if(newRecord.state != Rui.data.LRecord.STATE_NORMAL)
                this.updateState(newRecord);
            return newRecord;
        }
        return record;
    },
    getAt: function(idx){
        var record = this.data.getAt(idx);
        if(record && !(record instanceof Rui.data.LRecord)) {
            var id = this.data.getKey(idx);
            var newRecord = this.createDelimiterRecord(record, { id: id });
            newRecord.dataSet = this;
            this.data.set(id, newRecord);
            if(newRecord.state != Rui.data.LRecord.STATE_NORMAL)
                this.updateState(newRecord);
            return newRecord;
        }
        return record;
    },
    commitRecords: function() {
        this.data.each(function(id, record){
            if(record && (record instanceof Rui.data.LRecord))
                record.commit();
        }, this.data);
    },
    getReadDataMulti: function(dataSet, conn){
        var rootData = [];
        var data = this.getReadResponseData(conn);
        try {
            var fields = this.fields;
            var groupData = data.split(this.dataSetDelimiter);
            var selectData = '';
            for (var i = 0, len = groupData.length; i < len; i++) {
                if(groupData[i] == this.id) {
                    selectData = groupData[i + 1];
                    break;
                }
                i = i + 2;
            }
            var list = (selectData == '') ? [] : selectData.split(this.recordDelimiter);
            for (var i = 0, len = list.length; i < len; i++) {
                var dataList = list[i].split(this.fieldDelimiter);
                var sIdx = this.loadFieldMap['state'];
                var state = 0;
                var rowData = { state: state };
                if(!Rui.isUndefined(sIdx))
                	rowData.state = parseInt(dataList[sIdx], 10);
                for (var j = 0, flen = fields.length; j < flen ; j++) {
                	var idx = this.loadFieldMap[fields[j].id];
                	if(!Rui.isUndefined(idx)) {
                        var value = dataList[idx];
                        if(value === 'null') value = null;
                        var formater = this.readFieldFormater[fields[j].type];
                        rowData[fields[j].id] = (formater) ? formater(value) : value;
                        formater = null;
                	}
                }
                rootData.push(rowData);
                dataList = null;
                rowData = null;
            }
            list = null;
            return rootData;
        } finally {
            rootData = null;
            data = null;
        }
    },
    serialize: function() {
        var fields = this.fields;
        var result = this.id + this.fieldDelimiter;
        result += this.getCount() + this.fieldDelimiter;
        result += 'state' + this.fieldDelimiter;
        for (var i = 0 ; i < fields.length; i++) {
        	result += fields[i].id + ':' + fields[i].type.toLowerCase();
        	if(i < fields.length - 1) result += this.fieldDelimiter;
        }
        result += this.dataSetDelimiter;
        for (var i = 0, len = this.getCount() ; i < len ; i++) {
            var record = this.getAt(i);
            result += record.state + this.fieldDelimiter;
            for (var j = 0, flen = fields.length ; j < flen ; j++) {
                var field = fields[j];
                var value = record.get(field.id);
                var formater = this.writeFieldFormater[field.type];
                if(formater) value = formater(value);
                if(value == null) value = '';
                result += value;
                if(j < flen - 1)
                    result += this.fieldDelimiter; 
            }
            if(i < len - 1)
            	result += this.recordDelimiter;
        }
        result += this.dataSetDelimiter;
        return result;
    },
    serializeModified: function(isAll) {
        var fields = this.fields;
        var modifiedRecords = this.getModifiedRecords();
        var result = this.id + this.fieldDelimiter;
        result += modifiedRecords.length + this.fieldDelimiter;
        result += 'state' + this.fieldDelimiter;
        for (var i = 0 ; i < fields.length; i++) {
        	result += fields[i].id + ':' + fields[i].type.toLowerCase();
        	if(i < fields.length - 1) result += this.fieldDelimiter;
        }
        result += this.dataSetDelimiter;
        for (var i = 0, len = modifiedRecords.length ; i < len ; i++) {
            var record = modifiedRecords.getAt(i);
            if(isAll !== true && (record.state != Rui.data.LRecord.STATE_DELETE && Rui.isEmpty(this.get(record.id)))) continue;
            result += record.state + this.fieldDelimiter;
            for (var j = 0, flen = fields.length ; j < flen ; j++) {
                var field = fields[j];
                var value = record.get(field.id);
                var formater = this.writeFieldFormater[field.type];
                if(formater) value = formater(value);
                if(value == null) value = '';
                result += value;
                if(j < flen - 1)
                    result += this.fieldDelimiter; 
            }
            if(i < len - 1)
            	result += this.recordDelimiter;
        }
        result += this.dataSetDelimiter;
        return result;
    },
    serializeDataSetList: function(dataSets) {
        var buf = '';
        for (var i = 0, len = dataSets.length ; i < len ; i++) {
            var dataSetEl = Rui.util.LDom.get(dataSets[i]);
            buf += dataSetEl.serialize();
            if(i < len - 1)
                buf += this.dataSetDelimiter;
        }
        return buf;
    },
    serializeModifiedDataSetList: function(dataSets) {
        var buf = '';
        for (var i = 0, len = dataSets.length ; i < len ; i++) {
            var dataSetEl = Rui.util.LDom.get(dataSets[i]);
            buf += dataSetEl.serializeModified();
            if(i < len - 1)
                buf += this.dataSetDelimiter;
        }
        return buf;
    },
    query: function(fn, scope){
    	if(this.delayLoadTasking) throw new Error('데이터를 로딩중입니다.');
        this.data = this.snapshot.clone();
        this.mergeModifiedData(this.data);
        var newData = new Rui.util.LCollection();
        for (var i = 0 ; i < this.data.length; i++) {
        	var id = this.data.getKey(i);
        	var item = this.getAt(i);
		    if(fn.call(scope || this, id, item, i) === true) {
                newData.add(id, item);
            }
        }
        return newData;
    },
    sort: function(fn, desc){
    	if(this.delayLoadTasking) throw new Error('데이터를 로딩중입니다.');
    	Rui.data.LDelimiterDataSet.superclass.sort.call(this, fn, desc);
    }
});
Rui.data.LDelimiterDataSet.DATA_TYPE = 3;
Rui.namespace('Rui.data');
Rui.data.LBind = function(config){
    Rui.data.LBind.superclass.constructor.call(this);
    config = config || {};
    this.bindRow = 1;
    this.bind = true;
    this.groupId = config.groupId;
    this.bindInfo = null;
    this.isValidation = true;
    this.groupEl = Rui.get(this.groupId);
    if(!this.groupEl)
        throw new Error('Can\'t find groupId : ' + this.groupId);
    Rui.applyObject(this, config, true);
    this.onChangeDelegate = Rui.util.LFunction.createDelegate(this.onChangeEvent, this);
    this.init();
};
Rui.extend(Rui.data.LBind, Rui.util.LEventProvider, {
    selector: 'input,select,textarea,span[id]',
    init: function() {
        if(this.dataSet) {
            if(this.bind && this.bind == true) {
                if(this.dataSet.getCount() > 0) {
                    this.load(this.dataSet.getRow());
                }
            }
            this.initEvent();
        }
    },
    initEvent: function() {
        this.rebind();
        this.initEventDataSet();
    },
    initEventDataSet: function() {
        this.dataSet.unOn('rowPosChanged', this.onRowPosChanged, this);
        this.dataSet.unOn('update', this.onUpdate, this);
        this.dataSet.unOn('invalid', this.onInvalid, this);
        this.dataSet.unOn('valid', this.onValid, this);
        this.dataSet.unOn('dataChanged', this.onValidAll, this);
        this.dataSet.on('rowPosChanged', this.onRowPosChanged, this, true);
        this.dataSet.on('update', this.onUpdate, this, true);
        this.dataSet.on('invalid', this.onInvalid, this, true);
        this.dataSet.on('valid', this.onValid, this, true);
        this.dataSet.on('dataChanged', this.onValidAll, this, true);
    },
    rebind: function() {
        if(this.bind !== true) return;
        this.bindInfoMap = {};
        this.childrenIdMap = {};
        this.childrenNameMap = {};
        this.childrenCtrlIdMap = {};
        this.children = this.getChildren();
        var dupMap = {};
        this.children.each(function(id, child) {
            var bindObject = null;
            var obj = child.instance;
            if (obj && obj.fieldObject === true) {
                bindObject = this.getBindInfoByDom(obj);
                if(bindObject == null) return;
                if(dupMap[bindObject.id]) {
                    bindObject.multi = true;
                    dupMap[bindObject.id].multi = true;
                }
                dupMap[bindObject.id] = bindObject;
                var field = this.dataSet.getFieldById(bindObject.id);
                if(!field) return;
                var fn = bindObject.fn || this.onChangeDelegate;
                obj.unOn('changed', fn, obj);
                obj.on('changed', fn, obj);
                obj.bindMDataSet = this.dataSet;
                obj.bindObject = bindObject;
                obj.el.addClass('L-binded');
                if(this.dataSet.getRow() < -1)
                	obj.el.addClass('L-bind-disabled');
            } else {
                bindObject = this.getBindInfoByDom(child);
                if(bindObject == null) return;
                if(dupMap[bindObject.id]) {
                    bindObject.multi = true;
                    dupMap[bindObject.id].multi = true;
                }
                dupMap[bindObject.id] = bindObject;
                var field = this.dataSet.getFieldById(bindObject.id);
                if(!field) return;
                var fn = bindObject.fn || this.onChangeDelegate;
                Rui.util.LEvent.removeListener(child, bindObject.eventName, fn);
                Rui.util.LEvent.addListener(child, bindObject.eventName, fn, child, true);
                var childEl = Rui.get(child);
                if(childEl.id) if(!Rui.LElement.elCache[childEl.id]) Rui.LElement.elCache[childEl.id] = childEl;
                this.bindSetValueInit(childEl, fn);
                childEl.addClass('L-binded');
                if(this.dataSet.getRow() < -1)
                	childEl.addClass('L-bind-disabled');
            }
            this.childrenCtrlIdMap[bindObject.ctrlId] = child;
            if(child.id) this.childrenIdMap[child.id] = child;
            if(child.name) this.childrenNameMap[child.name] = child;
        }, this);
        multiMap = null;
    },
    addBindInfo: function(bindInfo) {
        this.bindInfo.push(bindInfo);
    },
    onRowPosChanged: function(e) {
        if(this.bind !== true || this.dataSet.isLoading === true) return;
        var row = e.row;
        this.bindRow = row;
        if(this.cacheRecordId && row > -1 && this.cacheRecordId == this.dataSet.getAt(row).id) return;
        this.load(row);
        this.cacheRecordId = (row > -1) ? this.dataSet.getAt(row).id : null;
    },
    onUpdate: function(e) {
        if(this.bind == false) return;
        if(e.row !== this.dataSet.getRow()) return;
        this.children = this.children || this.getChildren();
        var bindObject = this.getBindInfoById(e.colId);
        if(bindObject == null) return;
        var child = this.childrenCtrlIdMap[bindObject.ctrlId];
        if(child) this.doChangeSetValue(this.children, child, bindObject, e.value);
        if(bindObject.multi) {
            for (var i = 0, len = this.bindInfo.length; i < len; i++) {
                if(this.bindInfo[i] !== bindObject && this.bindInfo[i].id == bindObject.id) {
                    child = this.childrenCtrlIdMap[this.bindInfo[i].ctrlId];
                    if(child) this.doChangeSetValue(this.children, child, this.bindInfo[i], e.value);
                }
            }
        }
    },
    onChangeEvent: function(e) {
    	if(this.bind !== true) return;
        var childObject = e.target;
        var value = childObject.fieldObject === true ? childObject.getValue() : childObject.value;
        this.doChangeEvent(this, childObject, value);
    },
    onInvalid: function(e) {
        if(this.bind !== true || this.isValidation == false || e.row != this.bindRow) return;
        var bindObject = this.getBindInfoById(e.colId);
        if(bindObject) {
            this.children = this.children || this.getChildren();
            var child = this.children.get(bindObject.ctrlId);
            if(child) {
                var obj = child.instance;
                if (obj && obj.fieldObject === true) {
                    obj.invalid(e.message);
                } else {
                    var childEl = Rui.get(child);
                    childEl.invalid(e.message);
                }
            }
        }
    },
    onValid: function(e) {
        if (this.bind !== true || this.isValidation == false || e.row != this.bindRow) return;
        var bindObject = this.getBindInfoById(e.colId);
        if(bindObject) {
            this.children = this.children || this.getChildren();
            var child = this.children.get(bindObject.ctrlId);
            if(child) {
                var obj = child.instance;
                if (obj && obj.fieldObject === true) obj.valid(); else Rui.get(child).valid();
            }
        }
    },
    onValidAll: function(e) {
        if(this.bind !== true) return; 
        this.children = this.children || this.getChildren();
        this.children.each(function(id, child) {
            var obj = child.instance;
            if (obj && obj.fieldObject === true) {
                obj.valid();
            } else {
                Rui.get(child).valid();
            }
        }, this);
    },
    doChangeEvent: function(bindObject, child, newValue) {
        if(bindObject.bind == false) return;
        if(bindObject.dataSet.getCount() - 1 < bindObject.bindRow) return;
        var ctrlObject = child;
        var bindInfoList = bindObject.getBindInfoByObject(ctrlObject);
        for (var i = 0 ; i < bindInfoList.length ; i++) {
            var bindInfo = bindInfoList[i];
            var value = null;
            if(bindObject.bindRow > -1) {
                var record = bindObject.dataSet.getAt(bindObject.bindRow);
                if (ctrlObject.fieldObject === true && bindInfo.value == 'text') {
                    value = ctrlObject.getDisplayValue ? ctrlObject.getDisplayValue() : ctrlObject.getValue();
                } else if(ctrlObject.fieldObject === true) {
                    value = ctrlObject.getValue();
                } else if(ctrlObject.tagName.toLowerCase() == 'select' && bindInfo.value == 'text') {
                    value = ctrlObject.options[ctrlObject.selectedIndex].text;
                } else {
                    value = Rui.isUndefined(ctrlObject[bindInfo.value]) == false ? ctrlObject[bindInfo.value] : null;
                    if(ctrlObject.tagName.toLowerCase() == 'input' && ctrlObject.type == 'checkbox') {
                        if(ctrlObject.checked == false) value = '';
                        else value = newValue;
                    }
                }
                var column = bindObject.dataSet.getFieldById(bindInfo.id);
                if(column && column.type == 'number' && typeof value == 'string') {
                    value = value == '' ? 0 : parseFloat(value, 10);
                }
                record.set(bindInfo.id, value);
            }
        }
    },
    getBindInfoByObject: function(child) {
        this.bindInfoMap = this.bindInfoMap || {};
        var bindInfoList = this.bindInfoMap[child.name] || this.bindInfoMap[child.id] ;
        if(!bindInfoList) {
            bindInfoList = [];
            for (var i = 0 ; i < this.bindInfo.length; i++) {
                if(this.bindInfo[i].ctrlId == child.name || this.bindInfo[i].ctrlId == child.id) {
                    if(!this.bindInfo[i].eventName) {
                        if(child.fieldObject === true) {
                            this.bindInfo[i].eventName = 'changed';
                        } else if (child.tagName == 'INPUT' || child.tagName == 'TEXTAREA' || child.tagName == 'SELECT') {
                            if (child.tagName == 'INPUT' && (child.type == 'radio' || child.type == 'checkbox')) {
                                this.bindInfo[i].eventName = 'click';
                            } else 
                                this.bindInfo[i].eventName = 'change';
                        } else if(child.tagName == 'SPAN') {
                        } else {
                            throw new Error('LBind.getBindInfoByObject() : Bind를 지원하는 객체가 아닙니다.');
                        }
                    }
                    bindInfoList[bindInfoList.length] = this.bindInfo[i];
                }
            }
            if((child.name || child.id))
                this.bindInfoMap[child.name || child.id] = bindInfoList;
        }
        return bindInfoList;
    },
    clearBindInfoMap: function() {
        this.bindInfoMap = null;
    },
    getBindInfoByDom: function(child) {
        var bindInfoList = this.getBindInfoByObject(child);
        return bindInfoList.length > 0 ? bindInfoList[0] : null;
    },
    getBindInfoById: function(id) {
        for (var i = 0, len = this.bindInfo.length; i < len; i++) {
            if(this.bindInfo[i].id == id) return this.bindInfo[i];
        }
        return null;
    },
    getIdByChild: function(child) {
        var obj = child.instance;
        return (obj && obj.fieldObject === true && obj.id) ? (obj.name || obj.id) : (child.name || child.id);
    },
    load: function(row) {
        if(Rui.isUndefined(row)) row = 0;
        if(this.bind !== true || (row < -1 || this.dataSet.getCount() - 1 < row)) return;
        this.bindRow = row;
        this.children = this.children || this.getChildren();
        var children = this.children;
        this.children.each(function(id, child) {
            var obj = child.instance,
            	bindObject = (obj && obj.fieldObject === true) ? this.getBindInfoByDom(obj) : this.getBindInfoByDom(child);
            if(bindObject == null) return;
            if(bindObject)
            var field = this.dataSet.getFieldById(bindObject.id);
            if(field) {
                if(this.dataSet.getCount() - 1 < row) return;
                var value = (row > -1) ? this.dataSet.getAt(row).get(field.id) : null;
                this.doChangeSetValue(children, child, bindObject, value);
                if(row < 0){
                	if(obj){
                		obj.el.addClass('L-bind-disabled');
                	}else{
                		Rui.get(child).addClass('L-bind-disabled');
                	}
                }else{
                	if(obj){
            			obj.el.removeClass('L-bind-disabled');
                	}else{
                		Rui.get(child).removeClass('L-bind-disabled');
                	}
                }
            }
        }, this);
    },
    getChildren: function() {
        var data = new Rui.util.LCollection();
        var children = Rui.util.LDomSelector.query(this.selector, this.groupEl.dom);
        for (var i = 0 ; i < children.length ; i++) {
            var id = (children[i].name || children[i].id);
            if(children[i].type == 'radio' || data.indexOfKey(id) < 0) {
                data.add(id, children[i]);
            }
        }
        return data;
    },
    bindSetValueInit: function(childEl, fn) {
        if(childEl.setValue) {
            var setValueDelegate = function() {
                if(childEl.getValue() === arguments[0]) return;
                childEl.oldSetValue(arguments[0]);
                fn.call(childEl, {target:childEl.dom});
            };
            childEl.oldSetValue = childEl.setValue;
            childEl.setValue = setValueDelegate;
        }
    },
    doChangeSetValue: function(children, child, bindObject, value) {
        if(child.tagName == 'INPUT' && (child.type == 'radio' || child.type == 'checkbox')) {
            var obj = child.instance;
            id = this.getIdByChild(child);
            if(child.type == 'radio') {
                this.children.each(function(id, currentChild){
                    if(currentChild.name == child.name) {
                        if(obj && obj.groupInstance) {
                            obj.groupInstance.setValue(value);
                            return false;
                        } else {
                            if(currentChild.value == value) {
                                currentChild.checked = true;
                            }else {
                                currentChild.checked = false;
                            }
                        }
                    }
                }, this);
            } else {
                if(child.value == value) {
                    child.checked = true;
                    if(obj && obj.fieldObject === true) obj.setValue(true);
                }else {
                    child.checked = false;
                    if(obj && obj.fieldObject === true) obj.setValue(false);
                }
            }
        } else {
            if(value == null) value = '';
            var obj = child.instance;
            if (obj && obj.fieldObject === true && bindObject.value == 'value') {
                obj.setValue(value, true);
            } else if (bindObject.value == 'html') {
                value = bindObject.renderer ? bindObject.renderer(value) : value;
                child.innerHTML = value;
            } else {
                if(child.type != 'file') child[bindObject.value] = value;
            }
        }
    },
    each: function(children, fn) {
        for (var i = 0; i < children.length; i++) {
            var id = children[i].id || children[i].name;
            if(Rui.isUndefined(id) == false && Rui.isNull(id) == false && id != '') {
                if(fn.call(this, children[i]) == false) break;
            }
        }
    },
    setDataSet: function(dataSet) {
        this.dataSet = dataSet;
        this.initEventDataSet();
    },
    setBind: function(isBind) {
        this.bind = isBind;
        this.rebind();
        this.load(this.dataSet.getRow());
    },
    toString: function() {
        return 'Rui.data.LBind ' + this.groupId;
    }
});
Rui.namespace('Rui.data');
Rui.data.LDataSetManager = function(config){
    Rui.data.LDataSetManager.superclass.constructor.call(this);
    config = config ||{};
    config = Rui.applyIf(config, Rui.getConfig().getFirst('$.base.dataSetManager.defaultProperties'));
    this.id = config.formId;
    Rui.applyObject(this, config, true);
    this.transaction = null;
    this.createEvent('success');
    this.createEvent('failure');
    this.createEvent('upload');
    this.createEvent('beforeUpdate');
    this.createEvent('beforeLoad');
    this.createEvent('beforeLoadData');
    this.createEvent('load');
    this.createEvent('loadException');
    this.doSuccessDelegate = Rui.util.LFunction.createDelegate(this.doSuccess, this);
    this.doFailureDelegate = Rui.util.LFunction.createDelegate(this.doFailure, this);
    this.doUploadDelegate = Rui.util.LFunction.createDelegate(this.doUpload, this);
    this.on('success', this.onSuccess, this, true);
    if (this.defaultSuccessHandler === true) {
        this.on('success', function(e) {
            Rui.alert(Rui.getMessageManager().get('$.base.msg100'));
        }, this, true);
    }
    if (this.defaultFailureHandler === true) {
        var failureHandler = Rui.getConfig().getFirst('$.base.dataSetManager.failureHandler');
        this.on('failure', failureHandler, this, true);
    }
    if (this.defaultLoadExceptionHandler === true) {
        var loadExceptionHandler = Rui.getConfig().getFirst('$.base.dataSetManager.loadExceptionHandler');
        this.on('loadException', loadExceptionHandler, this, true);
    }
    if(Rui.ui.LWaitPanel && !Rui.data.LDataSetManager.waitPanel)
        Rui.data.LDataSetManager.waitPanel = new Rui.ui.LWaitPanel();
};
Rui.extend(Rui.data.LDataSetManager, Rui.util.LEventProvider, {
    disableCaching: true,
    timeout: 30,
    sslBlankUrl: 'about:blank',
    checkIsUpdate: true,
    loadCache: false,
    useWaitPanel: true,
    dataParameterName: 'dui_datasetdata',
    dataTypeParameterName: 'dui_datasetdatatype',
    update: function(options){
        var config = options || {};
        config = Rui.applyIf(config, {
            url:null, 
            params:{}, 
            callback:{}, 
            discardUrl:false
        });
        var url = config.url;
        var params = config.params;
        var callback = config.callback;
        var discardUrl = config.discardUrl;
        if (config.beforeUpdateEvent !== false && this.fireEvent('beforeUpdate', {
            target: this.el,
            url: url,
            params: params
        }) === false) return;
        if (!discardUrl) {
            this.defaultUrl = url;
        }
        if (params && typeof params != 'string') {
            params = Rui.util.LObject.serialize(params);
        }
        var callbackDelegate = {
                success: this.doSuccessDelegate,
                failure: this.doFailureDelegate,
                timeout: (this.timeout * 1000),
                cache: !this.disableCaching,
                argument: {
                    'url': url,
                    'form': null,
                    'callback': callback,
                    'params': params
                }
        };
        this.waitPanelShow();
        var method = params ? 'POST': 'GET';
        if(this.sync || this.sync == true) {
            this.transaction = Rui.LConnect.syncRequest(method, url, callbackDelegate, params, config);
        } else {
            this.transaction = Rui.LConnect.asyncRequest(method, url, callbackDelegate, params, config);
        }
    },
    updateForm: function(options) {
        var config = options || {};
        config = Rui.applyIf(config, {
            url:null, 
            form:null, 
            callback:{},
            params:{}, 
            reset:false
        });
        var url = config.url;
        var form = config.form;
        var callback = config.callback;
        var reset = config.reset;
        if (config.beforeUpdateEvent !== false && this.fireEvent('beforeUpdate', {
            target: this.el,
            url: url,
            form:form
        }) === false) return;
        var formEl = Rui.util.LDom.get(form);
        url = url || formEl.action;
        var callbackDelegate = {
                success: this.doSuccessDelegate,
                failure: this.doFailureDelegate,
                upload: this.doUploadDelegate,
                timeout: (this.timeout * 1000),
                argument: {
                    'url': url,
                    'form': form,
                    'callback': callback,
                    'reset': reset
                }
        };
        var isUpload = false;
        var enctype = formEl.getAttribute('enctype');
        if (enctype && enctype.toLowerCase() == 'multipart/form-data') {
            isUpload = true;
            config = Rui.applyIf(config, { isFileUpload: true });
        }
        Rui.LConnect.setForm(form, isUpload, this.sslBlankUrl);
        postData = Rui.util.LObject.serialize(config.params);
        this.waitPanelShow();
        if(this.sync || this.sync == true) {
            this.transaction = Rui.LConnect.syncRequest('POST', url, callbackDelegate, postData, config);
        } else {
            this.transaction = Rui.LConnect.asyncRequest('POST', url, callbackDelegate, postData, config);
        }
    },
    updateDataSet: function(options) {
        var config = options || {};
        config = Rui.applyIf(config, {
            dataSets:[],
            url:null, 
            params:{}, 
            callback:{},
            checkIsUpdate: config.modifiedOnly === false ? false : this.checkIsUpdate,
            cache: this.cache || false,
            markedOnly: this.markedOnly || false
        });
        var dataSets = config.dataSets;
        if(this.filterTask) return;
        this.filterTask = new Rui.util.LDelayedTask(Rui.util.LFunction.createDelegate(function() {this.doUpdateDataSet(config, dataSets);}, this));
        this.filterTask.delay(500);
    },
    doUpdateDataSet: function(config, dataSets) {
        if (config.beforeUpdateEvent !== false && this.fireEvent('beforeUpdate', {
            target: this.el,
            url: config.url,
            dataSets: dataSets
        }) === false) {
            delete this.filterTask;
            return;
        }
        var isUpdated = false;
        if(config.markedOnly == false && config.checkIsUpdate == true) {
            for (var i = 0 ; i < dataSets.length ; i++) {
                var dataSetEl = Rui.util.LDom.get(dataSets[i]);
                isUpdated = (isUpdated === false) ? dataSetEl.isUpdated() : isUpdated;  
                if(isUpdated === true) break;
            }
        } else isUpdated = true;
        if(isUpdated === false) {
            Rui.alert(Rui.getMessageManager().get('$.base.msg102'));
            delete this.filterTask;
            return;
        }
        var url = config.url;
        var callback = config.callback;
        var params = null;
        if(config.markedOnly) {
        	params = this.serializeByMarkedOnlyDataSet(dataSets);
        } else if(config.modifiedOnly === false) {
        	params = this.serializeByDataSet(dataSets);
        } else {
        	params = this.serializeByModifiedDataSet(dataSets);
        }
        if (typeof config.params == 'object')
            params += '&' + Rui.util.LObject.serialize(config.params);
        else 
            params += '&' + config.params;
        var callbackDelegate = {
            success: this.doSuccessDelegate,
            failure: this.doFailureDelegate,
            timeout: (this.timeout * 1000),
            argument: {
                'url': config.url,
                'dataSets': dataSets,
                'callback': callback,
                'params': config.params
            }
        };
        this.dataSets = dataSets;
        this.waitPanelShow();
        Rui.LConnect._isFormSubmit = false;
        if(this.sync || this.sync == true) {
            this.transaction = Rui.LConnect.syncRequest('POST', url, callbackDelegate, params, config);
        } else {
            this.transaction = Rui.LConnect.asyncRequest('POST', url, callbackDelegate, params, config);
        }
        delete this.filterTask;
    },
    serializeByModifiedDataSet: function(dataSets) {
        var params = this.dataParameterName + '=';
        if(dataSets.length > 0) {
            var dataSetEl = Rui.util.LDom.get(dataSets[0]);
            params += encodeURIComponent(dataSetEl.serializeModifiedDataSetList(dataSets));
            params += '&'+this.dataTypeParameterName+'=' + dataSetEl.dataSetType;
        }
        return params;
    },
    serializeByDataSet: function(dataSets) {
        var params = this.dataParameterName + '=';
        if(dataSets.length > 0) {
            var dataSetEl = Rui.util.LDom.get(dataSets[0]);
            params += encodeURIComponent(dataSetEl.serializeDataSetList(dataSets));
            params += '&'+this.dataTypeParameterName+'=' + dataSetEl.dataSetType;
        }
        return params;
    },
    serializeByMarkedOnlyDataSet: function(dataSets) {
        var params = this.dataParameterName + '=';
        if(dataSets.length > 0) {
            var dataSetEl = Rui.util.LDom.get(dataSets[0]);
            params += encodeURIComponent(dataSetEl.serializeMarkedOnlyDataSetList(dataSets));
            params += '&'+this.dataTypeParameterName+'=' + dataSetEl.dataSetType;
        }
        return params;
    },
    loadDataSet: function(option) {
        var config = option || {};
        var dataSets = config.dataSets;
        config.dataSets = null;
        config.multi = true;
        var me = this;
        config = Rui.applyIf(config, {
            method: 'POST',
            callback: {
                success: function(conn) {
                    me.loadDataResponse(dataSets, conn, config);
                },
                failure: function(conn) {
                    me.waitPanelHide();
                    var e = new Error(conn.responseText);
                    if(me.fireEvent('loadException', {target:me, throwObject:e, conn:conn}) !== false)
                        throw e;
                }
            },
            url: null,
            params:{},
            cache: this.cache || false
        });
        this.lastOptions = config;
        this.lastOptions.state = Rui.isUndefined(this.lastOptions.state) == false ? this.lastOptions.state : Rui.data.LRecord.STATE_NORMAL;
        var params = '';
        if (typeof config.params == 'object')
            params = Rui.util.LObject.serialize(config.params);
        else 
            params = config.params;
        this.fireEvent('beforeLoad', {target:this});
        Rui.LConnect._isFormSubmit = false;
        this.waitPanelShow();
        if(config.sync && config.sync == true) {
            Rui.LConnect.syncRequest(config.method, config.url, config.callback, params, config);
        } else {
            Rui.LConnect.asyncRequest(config.method, config.url, config.callback, params, config);
        }
    },
    loadDataResponse: function(dataSets, conn, config) {
        try {
            this.fireEvent('beforeLoadData');
            var cached = false;
            if(this.loadCache && this.oldResponseText == conn.responseText) cached = true;
            if (cached === false) {
            	var cachedData = null;
                for (var i = 0 ; i < dataSets.length ; i++) {
                    var dataSet = dataSets[i];
                    if(dataSets.length === 1) config.multi = false;
                    cachedData = dataSet.getReadResponseData(conn);
                    dataSet._cachedData = cachedData;
                    var dataSetData = dataSet.getReadData(conn, config);
                    dataSet.loadData(dataSetData, config);
                    delete dataSet._cachedData;
                }
                this.oldResponseText = cachedData;
            }
            this.waitPanelHide();
            this.fireEvent('load', {target:this, conn: conn});
        } catch(e) {
            this.waitPanelHide();
            if(this.fireEvent('loadException', {target:this, throwObject:e, conn: conn}) !== false)
                throw e;
        }
    },
    doSuccess: function(response) {
        this.waitPanelHide();
        this.transaction = null;
        if (response.argument.form && response.argument.reset) {
            try {
                response.argument.form.reset();
            } catch(e) {}
        }
        response.target = this;
        this.fireEvent('success', response);
        if (typeof response.argument.callback == 'function') {
            response.argument.callback(this, true);
        }
    },
    doFailure: function(response) {
        this.waitPanelHide();
        this.transaction = null;
        response.target = this;
        this.fireEvent('failure', response);
        if (typeof response.argument.callback == 'function') {
            response.argument.callback(this, false);
        }
    },
    doUpload: function(response) {
        this.waitPanelHide();
        this.transaction = null;
        response.target = this;
        this.fireEvent('upload', response);
        if (typeof response.argument.callback == 'function') {
            response.argument.callback(this, false);
        }
    },
    onSuccess: function() {
        for (var i = 0 ; this.dataSets != null && i < this.dataSets.length ; i++) {
            var dataSetEl = this.dataSets[i];
            dataSetEl.commit();
        }
        this.dataSets = null;
    },
    abort: function() {
        if (this.transaction) {
            Rui.LConnect.abort(this.transaction);
        }
    },
    isUpdating: function() {
        if (this.transaction) {
            return Rui.LConnect.isCallInProgress(this.transaction);
        }
        return false;
    },
    waitPanelShow: function() {
        var dm = Rui.data.LDataSetManager;
        if(dm.waitPanel && this.useWaitPanel){
            if(!dm.waitPanelCount)
                dm.waitPanelCount = 0;
            dm.waitPanelCount ++;
            dm.waitPanel.show();
        }
    },
    waitPanelHide: function() {
        var dm = Rui.data.LDataSetManager;
        if(dm.waitPanel && this.useWaitPanel){
            if(dm.waitPanelCount)
                dm.waitPanelCount--;
            if(dm.waitPanelCount < 1)
                dm.waitPanel.hide();
        }
    },
    toString: function() {
        return 'Rui.data.LDataSetManager ' + this.id;
    } 
});
Rui.namespace('Rui.validate');
Rui.validate.LValidator = function(id, config){
    config = config || {};
    Rui.applyObject(this, config, true);
    this.id = id;
};
Rui.validate.LValidator.prototype = {
    id: null,
    itemName: null,
    fn: null,
    otype: 'Rui.util.LValidator',
    validate: function(value) {
        return true;
    },
    toString: function() {
        return (this.otype || 'Rui.validate.LValidator') + ' ' + this.id;
    }
};
Rui.validate.LValidatorManager = function(config){
    var config = config || {};
    this.selector = config.selector || 'input,select,textarea';
    this.validators = new Rui.util.LCollection();
    if(config.validators)
        this.parse(config.validators);
};
Rui.validate.LValidatorManager.prototype = {
    validators: null,
    invalidList: null,
    parse: function(validators) {
        for (var vi = 0 ; vi < validators.length ; vi++) {
            var validator = validators[vi];
            var id = validator.id;
            var expression = validator.validExp;
            var columns = Rui.util.LString.advancedSplit(expression, ':', 'it');
            var label = columns[0];
            var required = columns[1] == 'true' ? true : false;
            if(required) {
                var requiredValidator = new Rui.validate.LRequiredValidator(id);
                requiredValidator.required = required;
                requiredValidator.label = label;
                this.add(id, requiredValidator);
            }
            if (Rui.isNull(columns[2])) return;
            var vExps = Rui.util.LString.advancedSplit(columns[2], '&', 'it');
            for (var i = 0; i < vExps.length; i++) {
                if (Rui.isNull(vExps[i])) continue;
                var p = vExps[i].indexOf('=');
                var sArr = [];
                var sArr = [];
                if(p == -1){
                    sArr.push(vExps[i]);
                }else{
                    sArr.push(vExps[i].substring(0, p));
                    sArr.push(vExps[i].substring(p+1));
                }
                if (Rui.isNull(sArr[0])) throw new Rui.LException(label+' : '+Rui.getMessageManager().get('$.base.msg050', vExps[i]));
                if (sArr.length>1 && Rui.util.LString.trim(sArr[1]) == '') throw new Rui.LException(label+' : '+Rui.getMessageManager().get('$.base.msg050', vExps[i]));
                var firstUpperCase = Rui.util.LString.firstUpperCase(sArr[0]);
                if (!Rui.validate['L'+firstUpperCase+'Validator']) throw new Rui.LException(label+' : '+Rui.getMessageManager().get('$.base.msg051', vExps[i]));
                try {
                    var validatorObj = null;
                    if (sArr[1]) validatorObj = new Rui.validate['L'+firstUpperCase+'Validator'](id, sArr[1]);
                    else validatorObj = new Rui.validate['L'+firstUpperCase+'Validator'](id);
                    validatorObj.required = required;
                    validatorObj.fn = validator.fn;
                    validatorObj.label = label;
                    this.add(id, validatorObj);
                } catch (e) {
                    if (e instanceof Rui.LException) e.message = label+' : '+Rui.getMessageManager().get('$.base.msg050', vExps[i]);
                    throw e;
                }
            }
        }
    },
    add: function(id, validator) {
        this.validators.add(id, validator);
        return this;
    },
    validate: function(obj, row) {
        var isValid = true,
        invalidList = [],
        messageList = [],
        value, invalidInfo;
        for (var id in obj) {
            value = obj[id];
            invalidInfo = this.validateField(id, value, row);
            if(invalidInfo.isValid == false) {
                invalidList.push({
                    row: row,
                    id: invalidInfo.id,
                    value: invalidInfo.value,
                    label: invalidInfo.label,
                    message: invalidInfo.message
                });
                if(!Rui.util.LArray.indexOf(messageList, invalidInfo.message) <= 0) {
                    messageList = messageList.concat(invalidInfo.message);
                }
                isValid = false;
            }
        }
        this.invalidList = invalidList;
        this.messageList = messageList;
        return isValid;
    },
    validateGroup: function(groupEl){
        var isValid = true,
        itemMessageList = [];
        this.invalidList = [];
        groupEl = Rui.get(groupEl);
        var childList = Rui.util.LDomSelector.query(this.selector, groupEl.dom);
        var _message = null;
        Rui.util.LArray.each(childList, function(f) {
            var child = Rui.get(f);
            var id = f.name || f.id;
            var validator = this.validators.get(id);
            if(validator) {
                if(this.validateEl(child) == false) {
                    var colLabel = (validator != null) ? validator.label : id;
                    isValid = false;
                    this.invalidList.push({
                        id: id,
                        label: colLabel,
                        value: child.getValue(),
                        messageList: this.messageList
                    });
                    var message = colLabel + ' : ' + this.messageList + '\r\n';
                    if(message != _message) itemMessageList = itemMessageList.concat(message);
                    _message = message;
                }
            }
        }, this);
        this.messageList = itemMessageList;
        return isValid;
    },
    validateField: function(id, value, row) {
        var isValid = true,
        label = id,
        messageList = [],
        validatorList = this.getValidatorList(id);
        for (var i = 0 ; i < validatorList.length ; i++){
            var item = validatorList[i];
            if(item){
                var currentValid = true;
                if(item.fn) currentValid = item.fn.call(item, value, row);
                else if(!(item.required === false && Rui.isEmpty(value))) currentValid = item.validate(value);
                if (currentValid == false){
                    label = item.label || id;
                    isValid = currentValid;
                    messageList.push(item.message);
                }
            }
        }
        return {
            isValid: isValid,
            id: id,
            label: label,
            message: messageList.join('\r\n'),
            messages: messageList
        };
    },
    validateEl: function(el) {
        var isValid = true,
        dm = '<ul style="margin:0px;padding-left:20px">',
        objId, obj, o, value, newMessageList, validatorList;
        if(el.gridFieldId){
            o = el;
            objId = el.gridFieldId;
        }else if(el.fieldObject == true){
            o = el;
            objId = el.id;
        }else{
            el = Rui.get(el);
            if(el == null) throw new Rui.LException('Unknown element');
            obj = el.dom.instance;
            if(obj && obj.fieldObject === true){
                o = obj;
                objId = obj.name || obj.id;
            }else{
                o = el;
                objId = el.dom.name || el.dom.id;
            }
        }
        value = o.getValue();
        newMessageList = [];
        validatorList = this.getValidatorList(objId);
        for (var i = 0; i < validatorList.length; i++){
            var item = validatorList[i];
            if (item){
                var currentValid = true;
                if (item.fn) currentValid = item.fn.call(item, value);
                else if(el.dom && el.dom.type == 'radio'){
                    if(item instanceof Rui.validate.LRequiredValidator) {
                    	if(el.dom.name) {
                    		currentValid = false;
                    		var radios = el.parentDepth(3).select('input[name=' + el.dom.name + ']');
                    		radios.each(function(item, i) {
                    			if(item.dom.checked === true) {
                    				currentValid = true;
                    				return false;
                    			}
                    		});
                    	}
                    	if(currentValid === false) item.message = Rui.getMessageManager().get('$.base.msg001');
                    } else currentValid = item.validate(value);
                }else if(!(item.required === false && Rui.isEmpty(value))) 
                    currentValid = item.validate(value);
                if(currentValid == false && !Rui.util.LArray.indexOf(newMessageList, item.message) <= 0){
                    dm += '<li>' + item.message + '</li>';
                    newMessageList.push(item.message);
                    isValid = false;
                } else o.valid();
            }
        }
        dm += '</ul>';
        isValid ? o.valid() : o.invalid(dm);
        this.messageList = newMessageList;
        return isValid;
    },
    validateDataSet: function(dataSet, row) {
        if(dataSet.getCount() < 1) return true;
        var isValid = true;
        var messageList = [];
        var isMulti = !Rui.isUndefined(row) ? false : true;
        row = !Rui.isUndefined(row) && row < 0 ? 0 : row;
        var count = !Rui.isUndefined(row) ? row + 1 : dataSet.getCount();
        var isValidMulti = false;
        for (var currRow = (row || 0) ; currRow < count ; currRow++) {
            var record = dataSet.getAt(currRow);
            if(dataSet.isRowModified(currRow)) {
                for (var col = 0, len = dataSet.fields.length ; record && col < len; col++) {
                    var colId = dataSet.fields[col].id;
                    var value = record.get(colId);
                    if(dataSet.remainRemoved === true && dataSet.isRowDeleted(currRow)) continue;
                    var invalidInfo = this.validateField(colId, value, currRow);
                    if (invalidInfo.isValid == false) {
                        isValid = false;
                        dataSet.invalid(currRow, record.id, col, invalidInfo.id, invalidInfo.message, invalidInfo.value, isMulti);
                        messageList.push('[' + (currRow + 1) +  ' row : ' + invalidInfo.label + '] => ' + invalidInfo.message);
                    } else {
                        dataSet.valid(currRow, record.id, col, invalidInfo.id, isMulti);
                    }
                }
            }else{
                for (var col = 0, len = dataSet.fields.length ; record && col < len; col++) {
                    var colId = dataSet.fields[col].id;
                    if(!isMulti)
                        dataSet.valid(currRow, record.id, col, colId, isMulti);
                    else if(isMulti && isValidMulti == false) {
                        dataSet.valid(currRow, record.id, col, colId, isMulti);
                        isValidMulti = true;
                    }
                }
            }
        }
        this.messageList = messageList;
        return isValid;
    },
    validateGrid: function(gridPanel) {
        var view = gridPanel.getView();
        var dataSet = view.dataSet;
        var isValid = true;
        var newMessageList = [];
        for (var row = 0 ; row < dataSet.getCount() ; row++) {
            if(dataSet.isRowModified(row)) {
                var record = dataSet.getAt(row);
                var currentValid = this.validate(record.getValues(), row);
                isValid = isValid ? currentValid : isValid;
                var invalidList = this.getInvalidList();
                var colMap = {};
                for (var i = 0 ; i < invalidList.length ; i++) {
                    var column = view.columnModel.getColumnById(invalidList[i].id);
                    var colId = invalidList[i].id;
                    var validator = this.validators.get(colId);
                    colLabel = (validator != null) ? validator.label : (column != null) ? column.getLabel() : colLabel;
                    if(column != null) {
                        var col = view.columnModel.getIndexById(colId, true);
                        view.addCellClass(row, col, 'L-invalid');
                        if(!colMap[colId]) view.removeCellAlt(row, col);
                        var alt = view.getCellAlt(row, col);
                        view.addCellAlt(row, col, (alt ? alt + '/' : alt) + invalidList[i].message);
                        colMap[colId] = col;
                    }
                    var message = invalidList[i].message;
                    newMessageList.push('[' + (row + 1) +  ' row : ' + colLabel + '] => ' + message);
                } 
            }
        }
        this.messageList = newMessageList;
        return isValid;
    },
    clearInvalids: function(){
        var invalids = this.getInvalidList(), obj;
        if(!invalids) return;
        for (var i = 0, len = invalids.length; i < len; i++){
            var obj = Rui.get(invalids[i].id);
            if(obj){
                obj.valid();
            }
        }
        this.invalidList = null;
    },
    getValidatorList: function(id) {
        var validatorList = [];
        for (var i = 0; i < this.validators.length ; i++) {
            var item = this.validators.getAt(i);
            if(id == item.id)
                validatorList.push(item);
        };
        return validatorList;
    },
    getValidator: function(id, validatorId) { 
        var firstUpperCase = Rui.util.LString.firstUpperCase(validatorId);
        var validatorList = this.getValidatorList(id);
        for (var i = 0 ; i < validatorList.length ; i++) {
            if(validatorList[i] instanceof Rui.validate['L'+firstUpperCase+'Validator']) {
                return validatorList[i];
            }
        }
        return null;
    },
    getInvalidList: function() {
        return this.invalidList;
    },
    getMessageList: function() {
        return this.messageList;
    },
    toString: function() {
        return 'Rui.validate.LValidatorManager ' + this.id;
    }
};
Rui.validate.LLengthValidator = function(id, length, config){
    Rui.validate.LLengthValidator.superclass.constructor.call(this, id, config);
    this.length = parseInt(length, 10);
    this.msgId = '$.base.msg003';
};
Rui.extend(Rui.validate.LLengthValidator, Rui.validate.LValidator, {
    otype: 'Rui.validate.LLengthValidator',
    validate: function(value) {
        if(Rui.isNull(value) || Rui.isUndefined(value)) return true;
        value += '';
        if (!this.checkCondition(value, this.length)) {
            this.message = Rui.getMessageManager().get(this.msgId, [this.length]);
            return false;
        }
        return true;
    },
    checkCondition: function (value, vValue) { return value.length == vValue; }
});
Rui.validate.LDateValidator = function(id, dateExpr, config){
    Rui.validate.LDateValidator.superclass.constructor.call(this, id, config);
    this.dateExp = dateExpr;
    this.lastDateExp = this.dateExp;
    this.year = null;
    this.month = null;
    this.value = null;
};
Rui.extend(Rui.validate.LDateValidator, Rui.validate.LValidator, {
    otype: 'Rui.validate.LDateValidator',
    validate: function(value) {
        if(value instanceof Date) return true;
        this.value = value;
        this.dateExp = this.lastDateExp;
        if(Rui.isEmpty(value)) return true;
        return (
            this.checkLength(value) &&
            this.checkYear(value) &&
            this.checkMonth(value) &&
            this.checkDay(value) &&
            this.checkHour(value) &&
            this.checkMin(value) &&
            this.checkSec(value) &&
            this.checkRest(value)
        );
    },
    checkLength: function () {
        if (this.value.length != this.dateExp.length) {
            this.message = Rui.getMessageManager().get('$.base.msg037', [this.dateExp]);
            return false;
        }
        return true;
    },
    checkYear: function () {
        var index = -1;
        if ( (index = this.dateExp.indexOf('YYYY')) != -1 ) {
            subValue = this.value.substr(index, 4);
            if ( !isNaN(subValue) && (subValue > 0) ) {
                this.dateExp = Rui.util.LString.cut(this.dateExp, index, 4);
                this.value = Rui.util.LString.cut(this.value, index, 4);
                this.year = subValue;
                return true;
            } else {
                this.message = Rui.getMessageManager().get('$.base.msg013');
                return false;
            }
        } 
        if ( (index = this.dateExp.indexOf('YY')) != -1 ) {
            subValue = '20' + this.value.substr(index, 2);
            if ( !isNaN(subValue) && (subValue > 0) ) {
                this.dateExp = Rui.util.LString.cut(this.dateExp, index, 2);
                this.value = Rui.util.LString.cut(this.value, index, 2);
                this.year = subValue;
                return true;
            } else {
                this.message = Rui.getMessageManager().get('$.base.msg013');
                return false;
            }
        } 
        return true;
    },
    checkMonth: function () {
        var index = -1;
        if ( (index = this.dateExp.indexOf('MM')) != -1 ) {
            subValue = this.value.substr(index, 2);
            if ( !isNaN(subValue) && (subValue > 0) && (subValue <= 12) ) {
                this.dateExp = Rui.util.LString.cut(this.dateExp, index, 2);
                this.value = Rui.util.LString.cut(this.value, index, 2);
                this.month = subValue;
                return true;
            } else {
                this.message = Rui.getMessageManager().get('$.base.msg017');
                return false;
            }
        } 
        return true;
    },
    checkDay: function () {
        var index = -1;
        var days = 0;
        if ( (index = this.dateExp.indexOf('DD')) != -1 ) {
            if ( (this.year) && (this.month) ) {
                days = (this.month != 2) ? Rui.util.LDate.getDayInMonth(this.month-1) : (( (this.year % 4) == 0 && (this.year % 100) != 0 || (this.year % 400) == 0 ) ? 29 : 28 );
            } else {
                days = 31;
            }
            subValue = this.value.substr(index, 2);
            if ( (!isNaN(subValue)) && (subValue > 0) && (subValue <= days) ) {
                this.dateExp = Rui.util.LString.cut(this.dateExp, index, 2);
                this.value = Rui.util.LString.cut(this.value, index, 2);
                return true;
            } else {
                this.message = Rui.getMessageManager().get('$.base.msg018');
                return false;
            }
        } 
        return true;
    },
    checkHour: function () {
        var index = -1;
        if ( (index = this.dateExp.indexOf('hh')) != -1 ) {
            subValue = this.value.substr(index, 2);
            if ( !isNaN(subValue) && ((subValue=Number(subValue)) >= 0) && (subValue <= 12) ) {
                this.dateExp = Rui.util.LString.cut(this.dateExp, index, 2);
                this.value = Rui.util.LString.cut(this.value, index, 2);
                return true;
            } else {
                this.message = Rui.getMessageManager().get('$.base.msg019');
                return false;
            }
        } 
        if ( (index = this.dateExp.indexOf('HH')) != -1 ) {
            subValue = this.value.substr(index, 2);
            if ( !isNaN(subValue) && ((subValue=Number(subValue)) >= 0) && (subValue < 24) ) {
                this.dateExp = Rui.util.LString.cut(this.dateExp, index, 2);
                this.value = Rui.util.LString.cut(this.value, index, 2);
                return true;
            } else {
                this.message = Rui.getMessageManager().get('$.base.msg019');
                return false;
            }
        } 
        return true;
    },
    checkMin: function () {
        var index = -1;
        if ( (index = this.dateExp.indexOf('mm')) != -1 ) {
            subValue = this.value.substr(index, 2);
            if ( !isNaN(subValue) && ((subValue=Number(subValue)) >= 0) && (subValue < 60 ) ) {
                this.dateExp = Rui.util.LString.cut(this.dateExp, index, 2);
                this.value = Rui.util.LString.cut(this.value, index, 2);
                this.month = subValue;
                return true;
            } else {
                this.message = Rui.getMessageManager().get('$.base.msg020');
                return false;
            }
        } 
        return true;
    },
    checkSec: function () {
        var index = -1;
        if ( (index = this.dateExp.indexOf('ss')) != -1 ) {
            subValue = this.value.substr(index, 2);
            if ( (!isNaN(subValue)) && ((subValue=Number(subValue)) >= 0) && (subValue < 60 ) ) {
                this.dateExp = Rui.util.LString.cut(this.dateExp, index, 2);
                this.value = Rui.util.LString.cut(this.value, index, 2);
                this.month = subValue;
                return true;
            } else {
                this.message = Rui.getMessageManager().get('$.base.msg021');
                return false;
            }
        } 
        return true;
    },
    checkRest: function () {
        if (this.value == this.dateExp) return true;
        return false;
    }
});
Rui.validate.LFormatValidator = function(id, format, config){
    Rui.validate.LFormatValidator.superclass.constructor.call(this, id, config);
    this.format = format;
};
Rui.extend(Rui.validate.LFormatValidator, Rui.validate.LValidator, {
    otype: 'Rui.validate.LFormatValidator',
    validate: function(value) {
        if(Rui.isEmpty(value)) return true;
        if (value.length != this.format.length) {
            this.message = Rui.getMessageManager().get('$.base.msg024', [this.format]);
            return false;
        }
        var invalid = false;
        for (var i = 0; i < this.format.length; i++) {
            var chr = value.charAt(i);
            var cCode = value.charCodeAt(i);
            switch (this.format.charAt(i)) {
                case 'h':
                    if ((chr == ' ') ||
                    !((0xAC00 <= cCode && cCode <= 0xD7A3) || (0x3131 <= cCode && cCode <= 0x318E))) invalid = true;
                    break;
                case 'H':
                    var cCode = value.charCodeAt(i);
                    if ((chr != ' ') &&
                    !((0xAC00 <= cCode && cCode <= 0xD7A3) || (0x3131 <= cCode && cCode <= 0x318E))) invalid = true;
                    break;
                case '0':
                    if (isNaN(chr) || chr == ' ') invalid = true;
                    break;
                case '9':
                    if (isNaN(chr)) {
                        if (chr != ' ') invalid = true;
                    }
                    break;
                case 'A':
                    if ((chr == ' ') || !isNaN(chr)) invalid = true;
                    break;
                case 'Z':
                    if ((chr != ' ') && !isNaN(chr)) invalid = true;
                    break;
                case '#':
                    break;
                default:
                    if (chr != this.format.charAt(i)) invalid = true;
            }
            if (invalid) {
                this.message = Rui.getMessageManager().get('$.base.msg024', [this.format]);
                return false;
            }
        }
    }
});
Rui.namespace('Rui.validate');
Rui.validate.LNumberValidator = function(id, format, config){
    Rui.validate.LNumberValidator.superclass.constructor.call(this, id, config);
    if (!format) return;
    var r = format.match(Rui.validate.LNumberValidator.re);
    if (r) {
        this.iLength = Number(r[1]);
        this.dLength = Number(r[2]);
    } else {
        this.iLength = null;
        this.dLength = null;
    }
};
Rui.extend(Rui.validate.LNumberValidator, Rui.validate.LValidator, {
    otype: 'Rui.validate.LNumberValidator',
    validate: function(value) {
        if (isNaN(value)) {
            this.message = Rui.getMessageManager().get('$.base.msg005');
            return false;
        }
        try{
            parseFloat(value);
            if(String(value).length > 0 && String(value).indexOf('-') > 0)
                throw new Error();
        }catch(e) {
            this.message = Rui.getMessageManager().get('$.base.msg005');
            return false;
        }
        if (Rui.isNull(this.iLength) || Rui.isUndefined(this.iLength)) return true;
        var strValue = String(value);
        var idx = strValue.indexOf('.');
        if (idx == -1) {
            this.message = Rui.getMessageManager().get('$.base.msg036', [this.dLength]);
            return false;
        }
        var iNumStr = strValue.substr(0, idx);
        var dNumStr = strValue.substr(idx + 1);
        if (iNumStr.length > this.iLength) {
            this.message = Rui.getMessageManager().get('$.base.msg035', [this.iLength]);
            return false;
        } else  if (dNumStr.length != this.dLength) {
            this.message = Rui.getMessageManager().get('$.base.msg036', [this.dLength]);
            return false;
        }
        return true;
    }
});
Rui.validate.LNumberValidator.re = /\s*(\d+)\s*.\s*(\d+)\s*/;
Rui.validate.LRequiredValidator = function(id, config){
    Rui.validate.LRequiredValidator.superclass.constructor.call(this, id, config);
    this.msgId = '$.base.msg001';
};
Rui.extend(Rui.validate.LRequiredValidator, Rui.validate.LValidator, {
    otype: 'Rui.validate.LRequiredValidator',
    validate: function(value) {
        if (Rui.isEmpty(value)) {
            this.message = Rui.getMessageManager().get(this.msgId);
            return false;
        }
        return true;
    }
});
Rui.validate.LByteLengthValidator = function(id, length, config){
    Rui.validate.LByteLengthValidator.superclass.constructor.call(this, id, config);
    this.length = parseInt(length, 10);
    this.msgId = '$.base.msg029';
};
Rui.extend(Rui.validate.LByteLengthValidator, Rui.validate.LValidator, {
    otype: 'Rui.validate.LByteLengthValidator',
    validate: function(value) {
        if(Rui.isNull(value) || Rui.isUndefined(value)) return true;
        value += '';
        if (!this.checkCondition(this.getByteLength(value), this.length)) {
            this.message = Rui.getMessageManager().get(this.msgId, [this.length, Math.round(this.length / 3)]);
            return false;
        }
        return true;
    },
    getByteLength: function (value) {
        var byteLength = 0, c;
        for (var i = 0; i < value.length; i++) {
            c = escape(value.charAt(i));      
            if (c.length == 1) {  
                byteLength ++;          
            } else if (c.indexOf('%u') != -1)  {
                byteLength += 3;        
            } else if (c.indexOf('%') != -1)  {  
                byteLength += c.length/3;                
            }
        }
        return byteLength;   
    },
    checkCondition: function (value, vValue) { return value == vValue; }
});
Rui.validate.LFilterValidator = function(id, filterExpr, config){
    Rui.validate.LFilterValidator.superclass.constructor.call(this, id, config);
    this.exprs = Rui.util.LString.advancedSplit(filterExpr, ';', 'i');
    for (var i = 0; i < this.exprs.length; i++) {
        if (this.exprs[i] == '\\h') {
            this.exprs[i] = '한글';
        } else if (this.exprs[i] == '\\a') {
            this.exprs[i] = '영문';
        } else if (this.exprs[i] == '\\n') {
            this.exprs[i] = '숫자';
        }
    }
    this.msgId = '$.base.msg033';
};
Rui.extend(Rui.validate.LFilterValidator, Rui.validate.LValidator, {
    otype: 'Rui.validate.LFilterValidator',
    validate: function(value) {
        for (var i = 0; i < this.exprs.length; i++) {
            var fStr = this.exprs[i];
            if ( ((fStr == '한글' || fStr == '영문' || fStr == '숫자') && !this.checkWildChr(value, fStr)) || ( value && value.indexOf(fStr) != -1) ) {
                this.message = Rui.getMessageManager().get(this.msgId, [fStr]);
                return false;
            }
        }
        return true;
    },
    checkWildChr: function (value, fChr) {
        for (var i = 0; i < value.length; i++) {
            var chr = value.charAt(i);
            var cCode = chr.charCodeAt(0);
            if ((fChr == '한글' && ((0xAC00 <= cCode && cCode <= 0xD7A3) || (0x3131 <= cCode && cCode <= 0x318E))) ||
                (fChr == '영문' && ((0x61 <= cCode && cCode <= 0x7A) || (0x41 <= cCode && cCode <= 0x5A))) ||
                (fChr == '숫자' && !isNaN(chr)) ) {
                return false;
            }
        }
        return true;
    }
});
Rui.validate.LInNumberValidator = function(id, inNumber, config){
    var index = inNumber.indexOf('~');
    this.minNumber = inNumber.substring(0, index);
    this.maxNumber = inNumber.substr(index+1);
    if (isNaN(this.minNumber) || isNaN(this.maxNumber)) throw new Rui.LException();
    Rui.validate.LInNumberValidator.superclass.constructor.call(this, id, config);
    this.minNumber = Number(this.minNumber);
    this.maxNumber = Number(this.maxNumber);
};
Rui.extend(Rui.validate.LInNumberValidator, Rui.validate.LValidator, {
    otype: 'Rui.validate.LInNumberValidator',
    validate: function(value) {
        if (isNaN(value)) {
            this.message = Rui.getMessageManager().get('$.base.msg005');
            return false;
        }
        value = Number(value);
        if (value < this.minNumber || value > this.maxNumber) {
            this.message = Rui.getMessageManager().get('$.base.msg004', [this.minNumber, this.maxNumber]);
            return false;
        }
        return true;
    }
});
Rui.namespace('Rui.validate');
Rui.validate.LMinByteLengthValidator = function(id, length, oConfig){
    Rui.validate.LMinByteLengthValidator.superclass.constructor.call(this, id, oConfig);
    this.length = parseInt(length, 10);
    this.msgId = '$.base.msg030';
};
Rui.extend(Rui.validate.LMinByteLengthValidator, Rui.validate.LByteLengthValidator, {
    otype: 'Rui.validate.LMinByteLengthValidator',
    checkCondition: function (value, vValue) { return value >= vValue; }
});
Rui.validate.LMinDateValidator = function(id, minDate, config){
    var index = minDate.indexOf('(');
    this.format = 'YYYYMMDD';
    this.minDate = minDate;
    if (index != -1) {
        this.minDate = minDate.substring(0, index);
        this.format = minDate.substring(index + 1, minDate.length - 1);
    }
    if (!(new Rui.validate.LDateValidator(id, this.format).validate(this.minDate))) throw new Rui.LException();
    Rui.validate.LMinDateValidator.superclass.constructor.call(this, id, config);
    this.msgId = '$.base.msg022';
};
Rui.extend(Rui.validate.LMinDateValidator, Rui.validate.LValidator, {
    otype: 'Rui.validate.LMinDateValidator',
    validate: function(value) {
        if(Rui.isEmpty(value)) return true;
        if (!(new Rui.validate.LDateValidator(this.id, this.format).validate(value))) {
            this.message = Rui.getMessageManager().get(this.msgId);
            return false;
        }
        var LS = Rui.util.LString;
        if(value instanceof Date) value = value.getFullYear() + LS.lPad(value.getMonth() + 1, '0', 2) + LS.lPad(value.getDate(), '0', 2);
        if (!this.checkCondition(value, this.minDate)) {
            var msgParams = new Array(4);
            msgParams[0] = this.minDate.substring(0,4);
            msgParams[1] = this.minDate.substring(4,5) == '0' ? this.minDate.substring(5,6) : this.minDate.substring(4,6);
            msgParams[2] = this.minDate.substring(6,7) == '0' ? this.minDate.substring(7,8) : this.minDate.substring(6,8);
            this.message = Rui.getMessageManager().get(this.msgId, msgParams);
            return false;
        }
        return true;
    },
    checkCondition: function (value, vValue) { return (value >= vValue); }
});
Rui.namespace('Rui.validate');
Rui.validate.LMinLengthValidator = function(id, minLength, config){
    Rui.validate.LMinLengthValidator.superclass.constructor.call(this, id, config);
    this.length = parseInt(minLength, 10);
    this.msgId = '$.base.msg009';
};
Rui.extend(Rui.validate.LMinLengthValidator, Rui.validate.LValidator, {
    otype: 'Rui.validate.LMinLengthValidator',
    validate: function(value) {
        if(Rui.isNull(value) || Rui.isUndefined(value)) return true;
        value += '';
        if (!this.checkCondition(value, this.length)) {
            this.message = Rui.getMessageManager().get(this.msgId, [this.length]);
            return false;
        }
        return true;
    },
    checkCondition: function (value, length) { return value.length >= length; }
});
Rui.validate.LMinNumberValidator = function(id, minNumber, config){
    if (isNaN(minNumber)) throw new Rui.LException();
    Rui.validate.LMinNumberValidator.superclass.constructor.call(this, id, config);
    this.minNumber = Number(minNumber);
};
Rui.extend(Rui.validate.LMinNumberValidator, Rui.validate.LValidator, {
    otype: 'Rui.validate.LMinNumberValidator',
    validate: function(value) {
        if (isNaN(value)) {
            this.message = Rui.getMessageManager().get('$.base.msg005');
            return false;
        }
        this.minNumber = Number(this.minNumber);
        value = Number(value);
        if (value < this.minNumber) {
            this.message = Rui.getMessageManager().get('$.base.msg011', [this.minNumber]);
            return false;
        }
        return true;
    }
});
Rui.validate.LMaxByteLengthValidator = function(id, length, config){
    Rui.validate.LMaxByteLengthValidator.superclass.constructor.call(this, id, length, config);
    this.msgId = '$.base.msg031';
};
Rui.extend(Rui.validate.LMaxByteLengthValidator, Rui.validate.LByteLengthValidator, {
    otype: 'Rui.validate.LMaxByteLengthValidator',
    checkCondition: function (value, vValue) { return value <= vValue; }
});
Rui.validate.LMaxDateValidator = function(id, maxDate, config){
    Rui.validate.LMaxDateValidator.superclass.constructor.call(this, id, maxDate, config);
    this.msgId = '$.base.msg023';
};
Rui.extend(Rui.validate.LMaxDateValidator, Rui.validate.LMinDateValidator, {
    otype: 'Rui.validate.LMaxDateValidator',
    checkCondition: function (value, vValue) { return (value <= vValue); }
});
Rui.validate.LMaxLengthValidator = function(id, maxLength, config){
    Rui.validate.LMaxLengthValidator.superclass.constructor.call(this, id, maxLength, config);
    this.msgId = '$.base.msg010';
    this.length = parseInt(maxLength, 10);
};
Rui.extend(Rui.validate.LMaxLengthValidator, Rui.validate.LValidator, {
    otype: 'Rui.validate.LMaxLengthValidator',
    validate: function(value) {
        if(Rui.isNull(value) || Rui.isUndefined(value)) return true;
        value += '';
        if (!this.checkCondition(value, this.length)) {
            this.message = Rui.getMessageManager().get(this.msgId, [this.length]);
            return false;
        }
        return true;
    },
    checkCondition: function (value, length) { return (value+'').length <= length; }
});
Rui.validate.LMaxNumberValidator = function(id, maxNumber, oConfig){
    if (isNaN(maxNumber)) throw new Rui.LException();
    Rui.validate.LMaxNumberValidator.superclass.constructor.call(this, id, oConfig);
    this.maxNumber = Number(maxNumber);
};
Rui.extend(Rui.validate.LMaxNumberValidator, Rui.validate.LValidator, {
    otype: 'Rui.validate.LMaxNumberValidator',
    validate: function(value) {
        if (isNaN(value)) {
            this.message = Rui.getMessageManager().get('$.base.msg005');
            return false;
        }
        this.maxNumber = Number(this.maxNumber);
        value = Number(value);
        if (value > this.maxNumber) {
            this.message = Rui.getMessageManager().get('$.base.msg012', [this.maxNumber]);
            return false;
        }
        return true;
    }
});
Rui.validate.LSsnValidator = function(id, config){
    Rui.validate.LSsnValidator.superclass.constructor.call(this, id, config);
};
Rui.extend(Rui.validate.LSsnValidator, Rui.validate.LValidator, {
    otype: 'Rui.validate.LSsnValidator',
    validate: function(value) {
        if(Rui.isEmpty(value)) return true;
        if ( !value || (value+'').length != 13 || isNaN(value) )  {
            this.message = Rui.getMessageManager().get('$.base.msg014');
            return false;
        }
        value += '';
        var jNum1 = value.substr(0, 6);
        var jNum2 = value.substr(6);
        bYear = (jNum2.charAt(0) <= '2') ? '19' : '20';
        bYear += jNum1.substr(0, 2);
        bMonth = jNum1.substr(2, 2) - 1;
        bDate = jNum1.substr(4, 2);
        bSum = new Date(bYear, bMonth, bDate);
        if ( bSum.getYear() % 100 != jNum1.substr(0, 2) || bSum.getMonth() != bMonth || bSum.getDate() != bDate) {
            this.message = Rui.getMessageManager().get('$.base.msg014');
            return false;
        }
        total = 0;
        temp = new Array(13);
        for (var i = 1; i <= 6; i++) 
            temp[i] = jNum1.charAt(i-1);
        for (var i = 7; i <= 13; i++)
            temp[i] = jNum2.charAt(i-7);
        for (var i = 1; i <= 12; i++) {
            k = i + 1;
            if(k >= 10) k = k % 10 + 2;
            total = total + (temp[i] * k);
        }
        last_num = (11- (total % 11)) % 10;
        if(last_num != temp[13]) {
            this.message = Rui.getMessageManager().get('$.base.msg014');
            return false;
        }
        return true;
    }
});
Rui.validate.LCsnValidator = function(id, config){
    Rui.validate.LCsnValidator.superclass.constructor.call(this, id, config);
};
Rui.extend(Rui.validate.LCsnValidator, Rui.validate.LValidator, {
    otype: 'Rui.validate.LCsnValidator',
    validate: function(value) {
        if(Rui.isEmpty(value)) return true;
        if (!value || (value+'').length != 10 || isNaN(value)) {
            this.message = Rui.getMessageManager().get('$.base.msg015');
            return false;
        }
        if (Rui.util.LString.isCsn(value) == false) {
            this.message = Rui.getMessageManager().get('$.base.msg015');
            return false;
        }
        return true;
    }
});
Rui.validate.LEmailValidator = function(id, config){
    Rui.validate.LEmailValidator.superclass.constructor.call(this, id, config);
};
Rui.extend(Rui.validate.LEmailValidator, Rui.validate.LValidator, {
    otype: 'Rui.validate.LEmailValidator',
    validate: function(value) {
        if(Rui.isEmpty(value)) return true;
        if (Rui.util.LString.isEmail(value) == false) {
            this.message = Rui.getMessageManager().get('$.base.msg034');
            return false;
        }
        return true;
    }
});
Rui.validate.LAllowValidator = function(id, allowExpr, config){
    Rui.validate.LAllowValidator.superclass.constructor.call(this, id, config);
    this.exprs = Rui.util.LString.advancedSplit(allowExpr, ";", "i");
    this.msgId = '$.base.msg038';
    var msgFStr = allowExpr.split(';');
    for (var i = 0; i < msgFStr.length; i++) {
        if (msgFStr[i] == "\\h" || msgFStr[i] == "\h") { 
            msgFStr[i] = Rui.getMessageManager().get('$.core.kor'); 
        } else if(msgFStr[i] == "\\a" || msgFStr[i] == "\a") {
            msgFStr[i] = Rui.getMessageManager().get('$.core.eng'); 
        } else if(msgFStr[i] == "\\n" || msgFStr[i] == "\n") {
            msgFStr[i] = Rui.getMessageManager().get('$.core.num'); 
        }
    }
    this.message = Rui.getMessageManager().get(this.msgId, [msgFStr.join(',')]);
};
Rui.extend(Rui.validate.LAllowValidator, Rui.validate.LValidator, {
    otype: 'Rui.validate.LAllowValidator',
    validate: function(value) {
        value += '';
        for (var i = 0; i < value.length; i++) {
            var chr = value.charAt(i);
            var cCode = chr.charCodeAt(0);
            if ((0xAC00 <= cCode && cCode <= 0xD7A3) || (0x3131 <= cCode && cCode <= 0x318E)) {
                if(Rui.util.LArray.indexOf(this.exprs, '\\h') == -1 && Rui.util.LArray.indexOf(this.exprs, '\h') == -1) return false;
            } else if((0x61 <= cCode && cCode <= 0x7A) || (0x41 <= cCode && cCode <= 0x5A)) {
                if(Rui.util.LArray.indexOf(this.exprs, '\\a') == -1 && Rui.util.LArray.indexOf(this.exprs, '\a') == -1) return false;
            } else if(!isNaN(parseInt(chr, 10))) {
                if(Rui.util.LArray.indexOf(this.exprs, '\\n') == -1 && Rui.util.LArray.indexOf(this.exprs, '\n') == -1) return false;
            } else {
                var isValid = false;
                for (var j = 0 ; j < this.exprs.length; j++) {
                    if(this.exprs[j] == '\\h' || this.exprs[j] == '\\a' || this.exprs[j] == '\\n' || this.exprs[j] == '\h' || this.exprs[j] == '\a' || this.exprs[j] == '\n') continue;
                    isValid = true;
                    if(this.exprs[j].indexOf(chr) < 0) {
                        isValid = false;
                        break;
                    }
                }
                if(isValid == false) return false;
            }
        }
        return true;
    }
});
Rui.validate.LGroupRequireValidator = function(id, groupName, config){
    Rui.validate.LGroupRequireValidator.superclass.constructor.call(this, id, config);
    this.groupName = groupName;
    this.message = Rui.getMessageManager().get('$.base.msg039', [1]);
};
Rui.extend(Rui.validate.LGroupRequireValidator, Rui.validate.LValidator, {
    otype: 'Rui.validate.LGroupRequireValidator',
    validate: function(value) {
        if(Rui.select('input[name="' + this.groupName + '"]:checked').length == 0) return false;
        return true;
    }
});
