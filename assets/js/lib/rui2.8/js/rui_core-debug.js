/*
 * @(#) rui_core-debug.js
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
/**
 * Rui 객체는 네임스페이스, 상속, 로깅을 포함하는 utility이다. 
 * @module core
 * @namespace
 * @title  Rui Global
 */
(function(){
    /**
     * Rui global namespace object.  
     * Rui가 이미 정의된 경우, 기존에 존재하는 Rui object는 정의된 namespace들이
     * 보존되도록 덮어쓰여지지 않는다.
     * @class Rui
     * @static
     */
    /**
     * millisecond 이후에 제공된 obecjt의 컨텍스트에서 제공된 함수를 실행한다.
     * periodic을 true로 설정하지 않는다면, 함수를 한번만 실행한다.
     * @method later
     * @static
     * @since 2.4.0
     * @param when {int} fn이 실행될 때까지 기다릴 millisecond 숫자
     * @param {object} o 컨텍스트 object
     * @param {Function|String} fn 실행할 'o' object에서 실행할 함수나 method의 이름
     * @param {Array} data  함수에 제공될 데이터.  
     * 이것은 하나의 항목이나 array를 받아들인다.
     * array가 제공되는 경우 함수는 각 array 항목에 대해 하나의 paprameter를 가지고 실행된다.  
     * 하나의 array parameter를 전달할 필요가 있는 경우, 이것은 array [myarray]에서
     * wrapping 되어야 할 필요가 있을 것이다. 
     * @param {boolean} periodic true인 경우 취소될 때까지 제공된 interval에서
     * 주기적으로 실행된다.
     * @return {object} timer object. timer를 멈추기 위하여 해당 object에서 cancel() method를 호출한다.
     */
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
    /**
     * 적합한 non-null값을 찾기 위한 유틸리티 method.
     * null/undefined/NaN에 대해서는 false, 0/false/''을 포함한 다른 값에 대해서는
     * true를 반환한다. 
     * @method isValue
     * @static
     * @since 2.3.0
     * @param {any} o 테스트할 항목
     * @return {boolean} null/undefined/NaN이 아니라면 true
     */
    Rui.isValue = function(o) {
        // return (o || o === false || o === 0 || o === ''); // Infinity fails
        return (Rui.isObject(o) || Rui.isString(o) || Rui.isNumber(o) || Rui.isBoolean(o));
    };
    /**
     * LConfiguration 객체를 리턴한다.
     * @method getConfig
     * @static
     * @sample default
     * @param {boolean} isNew [optional] 신규 객체 여부
     * @return {Rui.config.LConfiguration} 
     */
    Rui.getConfig = function(isNew) {
        isNew = isNew && isNew == true ? true : false;
        if(Rui.isUndefined(this._configuration) || isNew) {
            this._configuration = Rui.config.LConfiguration.getInstance();
        }
        return this._configuration;
    },
    /**
     * LMessageManager 객체를 리턴한다.
     * @method getMessageManager
     * @static
     * @sample default
     * @param {Object} config 환경정보 객체
     * @param {boolean} isNew [optional] 신규 객체 여부
     * @return {Rui.message.LMessageManager} 
     */
    Rui.getMessageManager = function(config, isNew) {
        this._messageManager = isNew ? undefined : this._messageManager;
        if(Rui.isUndefined(this._messageManager)) {
            this._messageManager = new Rui.message.LMessageManager(config);
        }
        return this._messageManager;
    },
    /**
     * js파일을 동적으로 로딩한다.
     * <pre>
     * Rui.includeJs('/rui/js/locale/lang-en.js');
     * </pre>
     * @method includeJs
     * @static
     * @return {void}
     */
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
    /**
     * css파일을 동적으로 로딩한다. (async로 처리되므로 같은 style에 대해서 우선 순위가 바뀔 수 있으므로 체크해야 함) 
     * <pre>
     * Rui.includeCSS('/rui/resources/css/rui_logger.css');
     * </pre>
     * @method includeCss
     * @static
     * @return {void}
     */
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
    /**
     * queryString에 대한 parameter를 json 객체로 리턴한다.
     * @method urlParams
     * @static
     * return {Object}
     */
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
    /**
     * window가 resize되면 fn을 수행한다.
     * @method onResize
     * @static
     * @param {function} fn function 객체
     * @param {boolean} firstFireEvent 처음 한번 resize 이벤트가 발생지 여부를 결정한다.
     * @return {void} 
     */
    Rui.onResize = function(fn, firstFireEvent) {
    	if(firstFireEvent === true) {
    		fn.call(window);
    		setTimeout(function() {
                Rui.util.LEvent.addListener(window, 'resize', fn);
    		}, 1000);
    	} else Rui.util.LEvent.addListener(window, 'resize', fn);
    };
    /**
     * 만약 widget이 사용가능하다면, log message를 출력하기 위하여 Rui.ui.LLogger를 사용한다. 
     * @method log
     * @static
     * @sample default
     * @param  {String}  msg  log 할 message
     * @param  {String}  cat  message에 대한 log 분류. 
     *                        기본 분류는 "info", "warn", "error", "time"이다.
     *                        custom 분류들은 잘 사용될 수 있다.(optional)
     * @param  {String}  src  message의 source(optional)
     * @return {boolean}      만약 log 작업이 성공했을 경우 True.
     */
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
    
    /**
     * 웹접근성 태그를 지원할지 여부를 리턴한다.
     * @method useAccessibility
     * @static
     * @return {boolean}
     */
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

    /**
     * 컴포넌트의 el DOM의 고정 ID 생성 여부를 설정한다.
     * @method useFixedId
     * @static
     * @return {boolean}
     */
    Rui.useFixedId = function() {
        if(!Rui.getConfig) return false;
        if(Rui.isUndefined(Rui._useFixedId))
            Rui._useFixedId = Rui.getConfig().getFirst('$.core.useFixedId') === true;
        return Rui._useFixedId;
    };

    /**
     * rui_config.js에 정의되어 있는 contextPath와 ruiRootPath값의 조합하여 RUI의 root 위치를 리턴한다. rui_config.js파일이 초기화되지 않으면 사용할 수 없다.
     * @method getRootPath
     * @static
     * @return {String}
     */
    Rui.getRootPath = function() {
    	var ruiPath = Rui.getConfig().getFirst('$.core.contextPath') + Rui.getConfig().getFirst('$.core.ruiRootPath');
    	return ruiPath;
    },

    /**
     * 개발자 가이드를 위한 추가 정보를 출력한다. rui_config.js의 환경 설정에서 개발자 모드일 경우에만 수행된다.
     * @method devGuide
     * @static
     * @param  {Object}  scope scope 객체
     * @param  {String}  methodName 수행할 메소드 명
     * @param {Object} params 파라미터 객체
     * @return {void}
     */
    Rui.devGuide = function(scope, methodName, params) {
        if(!this._webStore) this._webStore = new Rui.webdb.LWebStorage();
        if(Rui.getConfig().getProvider().isLoad()) {
            if(Rui.isUndefined(Rui._devGuide))
                Rui._devGuide = Rui.getConfig().getFirst('$.core.debug.notice');
            //Rui._devGuide = this._devGuide == null ? this._webStore && this._webStore.getBoolean('showDevGuide', false) ? true : false : this._devGuide;
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
            // check newest version
            /*
            if(document.domain == 'localhost' || document.domain == '127.0.0.1') {
                var versionDomain = 'http://www.dev-on.com/rui';
                window['newVersion'] = function(data) {
                    var versionHtml = '<br/>최신 버전입니다.';
                    if(Rui.env.getVersion() != data) {
                        versionHtml = '<br/>현재 버전: ' + Rui.env.getVersion() + ', 최신 버전: <span class="ruiNewVersion">' + data + '</span>';
                    }
                    Rui.select('.L-lcl-container').appendChild(versionHtml);
                };
                var url = versionDomain + '/rui2/version.txt?callback=newVersion';
                Rui.ajax({
                    crossDomain: true,
                    url: url
                })
            }
            */
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
        // 개발자들에게 개발 가이드를 알림
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
                    Rui.devGuide(this, 'Rui_load');
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
    /**
     * Element는 event listener들을 쉽게 추가하고, dom method들을 사용하거나,
     * sttribute를 관리하는 wrapper object를 제공한다.
     * @module core
     * @namespace Rui
     * @requires dom, event
     */
    /**
     * Element는 event listener들을 쉽게 추가하고, dom method들을 사용하거나 sttribute를 관리하는 wrapper object를 제공한다.
     * <br/>sample : <a href="/sample/general/base/elementSample.html">/sample/general/base/elementSample.html</a>
     * @class LElement
     * @sample default
     * @uses Rui.util.LAttributeProvider
     * @constructor
     * @param {HTMLElement | String} el LElement를 표현하는 html element
     * @param {Object} map 초기 config 이름과 값들의 key-value map
     */
    var Dom = Rui.util.LDom;

    Rui.applyObject(Rui.LElement.prototype, {
        /**
         * box-model 이슈를 위해 width와 height 설정을 자동으로
         * 조절하기 위해서 true로 설정(기본적으로 true)
         */
        autoBoxAdjust: true,
        /**
         * The default unit to append to CSS values where a unit isn't provided (defaults to px).
         * unit이 제공되지 않는 CSS 값들에 추가하기 위한 기본 unit(기본적으로 px).
         * @property defaultUnit
         * @protected
         * @type String
         */
        defaultUnit: 'px',
        /**
         * @description element의 disabled CSS
         * @property CSS_ELEMENT_DISABLED
         * @private
         * @type {String}
         */
        CSS_ELEMENT_DISABLED: 'L-disabled',
        /**
         * @description element의 invalid CSS
         * @property CSS_ELEMENT_INVALID
         * @private
         * @type {String}
         */
        CSS_ELEMENT_INVALID: 'L-invalid',
        /**
         * @description element의 repaint CSS
         * @property CSS_ELEMENT_REPAINT
         * @private
         * @type {String}
         */
        CSS_ELEMENT_REPAINT: 'L-repaint',
        /**
         * @description element의 masked CSS
         * @property CSS_ELEMENT_MASKED
         * @private
         * @type {String}
         */
        CSS_ELEMENT_MASKED: 'L-masked',
        /**
         * @description element의 masked의 출력 Panel CSS
         * @property CSS_ELEMENT_MASKED_PANEL
         * @private
         * @type {String}
         */
        CSS_ELEMENT_MASKED_PANEL: 'L-masked-panel',
        /**
         * @description HTMLElement method에 대한 Wrapper.
         * @method removeChild
         * @param {HTMLElement} child 삭제할 HTMLElement
         * @return {HTMLElement} 삭제된 DOM element.
         */
        removeChild: function(child) {
            child = child.dom ? child.dom : child.get ? child.get('element') : child;
            return this.get('element').removeChild(child);
        },
        /**
         * @description oldClassName으로 적용된 css를 newClassName css로 변경한다.
         * @method replaceClass
         * @sample default
         * @param {String} oldClassName 교체할 클래스 이름
         * @param {String} newClassName 추가할 클래스 이름
         * @return {Boolean | Array} 성공/실패 boolean이나 boolean값들의 array
         */
        replaceClass: function(oldClassName, newClassName) {
            return Dom.replaceClass(this.dom,
                    oldClassName, newClassName);
        },
        /**
         * @description toggle시에 class를 추가하거나 제거한다.
         * @method toggleClass
         * @sample default
         * @param {String} className 추가할 클래스 이름
         * @return {Rui.LElement} this
         */
        toggleClass: function(className) {
            return this.hasClass(className) ? this.removeClass(className) : this.addClass(className);
        },
        /**
         * @description style 정보를 모두 적용한다.
         * @method applyStyles
         * @param {String|Object|Function} styles 적용할 style정보
         * @return {Rui.LElement} this
         */
        applyStyles: function(styles){
            Rui.util.LDom.applyStyles(this, styles);
            return this;
        },
        /**
         * @description 페이지 좌표에 기반한 element의 현재 위치를 가져온다.
         * @method getXY
         * @sample default
         * @return {Array} element의 XY 위치
         */
        getXY: function() {
            return Dom.getXY(this.dom);
        },
        /**
         * @description element가 위치되는 방법에 개의치 않고 페이지 좌표에서 html element의 위치를 설정한다.
         * element는 반드시 페이지 좌표를 가지는 DOM 트리의 부분이어야 한다
         * (display:none 혹은 element들이 추가되어 있지 않으면 false를 반환).
         * @method setXY
         * @sample default
         * @param {Array} pos 새 위치에 대한 X & Y를 포함한 값들(페이지에 기반한 좌표)
         * @param {boolean} noRetry [optional] 첫번째가 실패할 경우 기본적으로 두번째로 위치를 설정한다.
         * @return {Rui.LElement} this
         */
        setXY: function(pos, noRetry) {
            Dom.setXY(this.dom, pos, noRetry);
            return this;
        },
        /**
         * @description 페이지 좌표에 기반한 element의 현재 X 위치를 가져온다.
         * element는 반드시 페이지 좌표를 가지는 DOM 트리의 부분이어야 한다
         * (display:none 혹은 element들이 추가되어 있지 않으면 false를 반환).
         * @method getX
         * @return {Number | Array} element의 X 위치
         */
        getX: function() {
            return Dom.getX(this.dom);
        },
        /**
         * @description element가 위치되는 방법에 개의치 않고 페이지 좌표에서 html element의 X 위치를 설정한다.
         * element는 반드시 페이지 좌표를 가지는 DOM 트리의 부분이어야 한다
         * (display:none 혹은 element들이 추가되어 있지 않으면 false를 반환).
         * @method setX
         * @param {int} x element에 대한 X 좌표로 사용할 값.
         * @return {Rui.LElement} this
         */
        setX: function(x) {
            Dom.setX(this.dom, x);
            return this;
        },
        /**
         * @description 페이지 좌표에 기반한 element의 현재 Y 위치를 가져온다.
         * element는 반드시 페이지 좌표를 가지는 DOM 트리의 부분이어야 한다
         * (display:none 혹은 element들이 추가되어 있지 않으면 false를 반환).
         * @method getY
         * @return {Number | Array} element의 Y 위치
         */
        getY: function() {
            return Dom.getY(this.dom);
        },
        /**
         * @description element가 위치되는 방법에 개의치 않고 페이지 좌표에서 html element의 Y 위치를 설정한다.
         * element는 반드시 페이지 좌표를 가지는 DOM 트리의 부분이어야 한다
         * (display:none 혹은 element들이 추가되어 있지 않으면 false를 반환).
         * @method setY
         * @param {int} y element에 대한 Y 좌표로 사용할 값.
         * @return {Rui.LElement} this
         */
        setY: function(y) {
            Dom.setY(this.dom, y);
            return this;
        },
        /**
         * @description element가 위치되는 방법에 개의치 않고 페이지 좌표에서 element의 위치를 설정한다.
         * element는 반드시 페이지 좌표를 가지는 DOM 트리의 부분이어야 한다
         * (display:none 혹은 element들이 추가되어 있지 않으면 false를 반환).
         * @method moveTo
         * @param {Number} x 새로운 위치에 대한 X값(페이지에 기반한 좌표)
         * @param {Number} y 새로운 위치에 대한 Y값(페이지에 기반한 좌표)
         * @param {Boolean/Object} anim (optional) 기본 animation에 대한 true, 혹은 표준 standard Element animation config object
         * @return {Rui.LElement} this
         */
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
        /**
         * @description animation 효과를 적용한다.
         * @method animate
         * @sample default
         * @param {Object} anim animation 효과를 적용할 정보
         * @return {Rui.LElement} this
         */
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

        /*
         * @private
         */
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
        /**
         * @description CSS 스타일을 사용하여 element의 left 위치를 직접 설정한다.
         * @method setLeft
         * @param {String} left left CSS property 값
         * @return {Rui.LElement} this
         */
        setLeft: function(left){
            this.setStyle('left', this.addUnits(left));
            return this;
        },
        /**
         * @description CSS 스타일을 사용하여 element의 top 위치를 직접 설정한다.
         * @method setTop
         * @param {String} top top CSS property 값
         * @return {Rui.LElement} this
         */
        setTop: function(top){
            this.setStyle('top', this.addUnits(top));
            return this;
        },
        /**
         * @description element의 CSS right 스타일을 설정한다.
         * @method setRight
         * @param {String} right right CSS property 값
         * @return {Rui.LElement} this
         */
        setRight: function(right){
            this.setStyle('right', this.addUnits(right));
            return this;
        },
        /**
         * @description element의 CSS bottom 스타일을 설정한다.
         * @method setBottom
         * @param {String} bottom bottom CSS property 값
         * @return {Rui.LElement} this
         */
        setBottom: function(bottom){
            this.setStyle('bottom', this.addUnits(bottom));
            return this;
        },
        /**
         * @description size를 설정한다.
         * @method setSize
         * @param {String} width element의 width offset
         * @param {String} height element의 height offset
         * @param {Boolean/Object} anim (optional) 기본 animation에 대한 true, 혹은 표준 standard Element animation config object
         * @return {Rui.LElement} this
         */
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
        /**
         * @description left X 좌표를 가져온다.
         * @method getLeft
         * @param {boolean} local 페이지 좌표 대신 local css 위치를 가져오기 위해서는 true
         * @return {Number}
         */
        getLeft: function(local){
            return !local ? this.getX() : parseInt(this.getStyle('left'), 10) || 0;
        },
        /**
         * @description element의 right X 좌표를 가져온다.(element의 X 위치 + element width)
         * @method getRight
         * @param {boolean} local 페이지 좌표 대신 local css 위치를 가져오기 위해서는 true
         * @return {Number}
         */
        getRight: function(local){
            return !local ? this.getX() + this.getWidth() : (this.getLeft(true) + this.getWidth()) || 0;
        },
        /**
         * @description top Y 좌표를 가져온다.
         * @method getTop
         * @param {boolean} local 페이지 좌표 대신 local css 위치를 가져오기 위해서는 true
         * @return {Number}
         */
        getTop: function(local) {
            return !local ? this.getY() : parseInt(this.getStyle('top'), 10) || 0;
        },
        /**
         * @description element의 bottom Y 좌표를 가져온다.(element의 Y 위치 + element height)
         * @method getBottom
         * @param {boolean} local 페이지 좌표 대신 local css 위치를 가져오기 위해서는 true
         * @return {Number}
         */
        getBottom: function(local){
            return !local ? this.getY() + this.getHeight() : (this.getTop(true) + this.getHeight()) || 0;
        },
        /**
         * @description 여러 attribute의 값들을 설정한다.
         * @method setAttributes
         * @private
         * @param {Object} map  attribute들의 key-value map
         * @param {boolean} silent change event들의 억제 여부
         */
        setAttributes: function(map, silent){
            var el = this.get('element');
            for (var key in map) {
                // need to configure if setting unconfigured HTMLElement attribute
                if ( !this._configs[key] && !Rui.isUndefined(el[key]) ) {
                    this.setAttributeConfig(key);
                }
            }
            // set based on configOrder
            for (var i = 0, len = this._configOrder.length; i < len; ++i) {
                if (map[this._configOrder[i]] !== undefined) {
                    this.set(this._configOrder[i], map[this._configOrder[i]], silent);
                }
            }
        },
        /**
         * 현재 overflow 설정을 저장하고 element의 overflow를 고정시킨다. - 삭제하기 위해서 unclip을 사용한다.
         * @method clip
         * @return {Rui.LElement} this
         */
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
        /**
         * @description clip 호출되기 전에 원래 clip된 overflow를 반환한다.
         * @method unclip
         * @return {Rui.LElement} this
         */
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
        /**
         * @description 객체를 다시 그린다.
         * @method repaint
         * @return {Rui.Elemnent} this
         */
        repaint: function() {
            var thisObj = this;
            if(!thisObj.hasClass(thisObj.CSS_ELEMENT_REPAINT))
             thisObj.addClass(thisObj.CSS_ELEMENT_REPAINT);

             setTimeout(Rui.util.LFunction.createDelegate(function() {
                thisObj.removeClass(thisObj.CSS_ELEMENT_REPAINT);
             }, thisObj), 1);

             return thisObj;
        },
        /**
         * 특정 anchor 포인트들로 연결되는 다른 element를 가지고 해당 element를 정렬한다.
         * 다른 element가 socument인 경우 그것은 viewport(화면상의 화상표시 영역)로 정렬한다.
         * 다음은 지원되는 anchor 위치들의 모든 목록이다: tl, t, tr, l, c, r, bl, b, br
         * @method alignTo
         * @param {Mixed} element 정렬할 element
         * @param {String} position 정렬할 위치
         * @param {Array} offsets (optional) [x, y]에 의한 위치 offset
         * @return {Rui.LElement} this
         */
        alignTo: function(element, position, offsets){
            this.setXY(this.getAlignToXY(element, position, offsets));
            return this;
        },
        /**
         * element의 anchor 위치에 의해 명시된 x,y 좌표를 가져온다.
         * @method getAnchorXY
         * @param {String} anchor (optional) 명시된 anchor 위치(기본적으로 'c').
         * 제공되는 anchor 위치들에 대한 세부사항은 {@link #alignTo}을 참조한다.
         * @param {boolean} local (optional) 페이지 좌표대신 local (element top/left-relative) anchor 위치를
         * 가져오기 위해서는 true
         * of page coordinates
         * @param {Object} size (optional) anchor 위치를 계산하기 위해 사용되는 size를 포함한 object
         * {width: (target width), height: (target height)} (기본적으로 element의 현재 사이즈)
         * @return {Array} [x, y] element의 x와 y 좌표를 포함하는 array
         */
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
        /**
         * 다른 element와 해당 element를 정렬하기 위한 x,y 좌표를 가져온다.
         * 지원되는 위치 값들에 대한 더 많은 정보를 위해서는 {@link #alignTo}를 참조한다.
         * @param {Mixed} element 정렬하기 위한 element
         * @param {String} position 정렬하기 위한 위치
         * @param {Array} offsets (optional) [x, y]에 의한 위치 offset
         * @return {Array} [x, y]
         */
        getAlignToXY: function(el, p, o){
            el = Rui.get(el);
            if(!el || !el.dom)
                throw "LElement.alignToXY with an element that doesn't exist";

            o = o || [0,0];
            p = (p == '?' ? 'tl-bl?' : (!/-/.test(p) && p !== '' ? 'tl-' + p  :  p || 'tl-bl')).toLowerCase();

            //var d = this.dom, a1, a2, w, h, x, y, r, c = false, p1 = '', p2 = '';
            var dw = Rui.util.LDom.getViewportWidth() -10, // ie는 margin 10px
                dh = Rui.util.LDom.getViewportHeight()-10; // ie는 margin 10px
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
        /**
         * viewport의 element나 다른 element를 중앙에 위치시킨다.
         * @method center
         * @param {Mixed} centerIn (optional) element 중앙에 위치시킬 element
         * @return {Rui.LElement} this
         */
        center: function(centerIn){
            this.alignTo(centerIn || document, 'c-c');
            return this;
        },
        /**
         * element의 현재 스크롤 위치를 반환한다.
         * @method getScroll
         * @return {Object} {left: (scrollLeft), top: (scrollTop)} 포맷의  스크롤 위치를 포함한 object
         */
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
        /**
         * @description scroll position 설정
         * @method setScroll
         * @param {object} objLeftTop (left:scrollLeft,top:scrollTop)
         * @return {Rui.LElement} this
         */
        setScroll: function(objLeftTop){
            if(!objLeftTop) return null;
            var d = this.dom,
                doc = document,
                body = doc.body,
                docElement = doc.documentElement;
//            var l, t, ret;

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
        /**
         * @description targetEl이 안보이는 경우 scroll 이동하기
         * @method getVisibleScrollXY
         * @param {string|HTMLElement} id
         * @param {boolean} movingX x축 자동 scroll 여부, default는 true
         * @param {boolean} movingY y축 자동 scroll 여부, default는 true
         * @param {int} paddingLeft left의 padding값
         * @return {array} [x,y] child의 변경된 좌표 return
         */
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
                    //가상 scroller의 scrollerEl은 scrollbar 안쪽에 있어 scrollbar를 포함할 필요가 없다.
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
                /* // scroll event가 늦게 발생되는 문제로 custom event먼저 처리된 후 scroll event가 발생해 처리되지 결과적으로 되지 않는다.
         if(!this.delayTask) {
         this.delayTask = new Rui.util.LDelayedTask(function(){
         scrollerEl.setScroll(newScroll);
         this.delayTask = null;
         }, this);
         this.delayTask.delay(1000);
         }
         //*/
                }
            }
            return newScroll;
        },
        /**
         * @description targetEl이 안보이는 경우 scroll 이동하기
         * @method moveScroll
         * @param {string|HTMLElement} childId child dom 객체의 id
         * @param {boolean} movingX x축 자동 scroll 여부, default는 true
         * @param {boolean} movingY y축 자동 scroll 여부, default는 true
         * @param {int} paddingLeft left의 padding값
         * @return {array} [x,y] child의 변경된 좌표 return
         */
        moveScroll: function(childId,movingX,movingY, paddingLeft){
            var targetEl = Rui.get(childId);
            var newScroll = this.getVisibleScrollXY(targetEl,movingX,movingY, paddingLeft);
            if(newScroll != null) this.setScroll(newScroll);
            return targetEl.getXY();
        },
        /**
         * Mask 적용 여부
         * @method isMask
         * @return {boolean}
         */
        isMask: function() {
            return this.waitMaskEl && this.waitMaskEl.isShow();
        },
        /**
         * @description element에 포커싱을 시도한다. 모든 실행들은 캐치되거나 무시된다.
         * @method focus
         * @public
         * @return {Rui.LElement} this
         */
        focus: function() {
            try{
                this.dom.focus();
            }catch(e){}
            return this;
        },
        /**
         * @description element에 blur를 시도한다. 모든 실행들은 캐치되거나 무시된다.
         * @method blur
         * @public
         * @return {Rui.LElement} this
         */
        blur: function() {
            try{
                this.dom.blur();
            }catch(e){}
            return this;
        },
        /**
         * @description element의 width와 height offset을 반환한다.  부모가 안보이면 계산되지 못한다. 0,0으로 나와 계신되지 못 한다. 이 메소드를 이용하면 display 속성이 none dom의 width와 height도 리턴된다.
         * @method getDimensions
         * @public
         * @param {boolean} contentOnly (optional) border와 padding을 뺀 width와 height를 얻으려면 true
         * @param {boolean} checkStyle (optional) 0일 경우 style 값도 검사
         * @return {Number} element의 width와 height
         */
        getDimensions: function(contentOnly,checkStyle) {
            //display none일 경우 0이 return 되므로, block으로 계산한후 원복시킴
            var element = this.dom;
            var w = 0;
            var h = 0;
            var display = this.getStyle('display');
            if (display != 'none' && display != null) // Safari bug
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

            //border와 padding 제거
            if (contentOnly) {
                w = w - this.getBorderWidth('lr') - this.getPadding('lr');
                h = h - this.getBorderWidth('tb') - this.getPadding('tb');
            }

            //음수값 사용안함
            w = w < 0 ? 0 : w;
            h = h < 0 ? 0 : h;

            return { width: w, height: h };
        },
        /**
         * @description element의 height offset을 반환한다.
         * @method getHeight
         * @public
         * @param {boolean} contentHeight (optional) border와 padding을 뺀 height를 얻으려면 true
         * @return {Number} element의 height
         */
        getHeight: function(contentHeight){
            var h = this.dom.offsetHeight || 0;
            h = !contentHeight ? h : h - this.getBorderWidth('tb') - this.getPadding('tb');
            return h < 0 ? 0 : h;
        },
        // private  => used by Fx  box Model에 대해 체크되어야 함.
        adjustWidth: function(width) {
            var isNum = (typeof width == 'number');
            if(isNum && this.autoBoxAdjust && !this.isBorderBox()){
               width -= (this.getBorderWidth('lr') + this.getPadding('lr'));
            }
            return (isNum && width < 0) ? 0 : width;
        },
        // private  => used by Fx
        adjustHeight: function(height) {
            var isNum = (typeof height == 'number');
            if(isNum && this.autoBoxAdjust && !this.isBorderBox()){
               height -= (this.getBorderWidth('tb') + this.getPadding('tb'));
            }
            return (isNum && height < 0) ? 0 : height;
        },
        /**
         * size가 unit을 가지고 있는 경우 테스트, 그렇지 않으면 기본값을 추가한다.
         * @private
         * @param {object} size
         */
        addUnits: function(size){
            if(size === '' || size == 'auto' || size === undefined){
                size = size || '';
            } else if(!isNaN(size) || !Rui.LElement.unitPattern.test(size)){
                size = size + (this.defaultUnit || 'px');
            }
            return size;
        },
        /**
         * @description 자신의 dom이 보이지 않아도 부모들중 보이는 dom을 찾아서 width 값을 리턴한다.
         * @method getHiddenWidth
         * @protected
         * @param {int} maxDepth [optional] 최대 부모 검색 갯수
         * @return {int} width 값
         */
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
        /**
         * @description 자신의 dom이 보이지 않아도 부모들중 보이는 dom을 찾아서 height 값을 리턴한다.
         * @method getHiddenHeight
         * @protected
         * @param {int} maxDepth [optional] 최대 부모 검색 갯수
         * @return {int} height 값
         */
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
        /**
         * @description 해당 element의 width를 설정한다.
         * @method setWidth
         * @public
         * @sample default
         * @param {Mixed} width 새로운 width.
         * @param {Boolean/Object} anim (optional) 기본 animation에 대한 true,
         *                                         혹은 표준 standard Element animation config object
         * @return {Rui.LElement} this
         */
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
        /**
         * @description 해당 element의 height를 설정한다.
         * @method setHeight
         * @sample default
         * @param {Mixed} height 새로운 height.
         * @param {Boolean/Object} anim (optional) 기본 animation에 대한 true or animation 객체
         * @return {Rui.LElement} this
         */
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
        /**
         * @description Heigth를 자동으로 셋팅한다.
         * @method autoHeight
         * @return {Rui.LElement} this
         */
        autoHeight: function() {
            this.clip();
            var height = parseInt(this.dom.scrollHeight, 10);
            this.setHeight(height);
            this.unclip();
            return this;
        },
        /**
         * @description 자신의 부모의 하위 dom들의 height를 제외하고 남은 공간을 계산하여 자신의 height에 적용한다.
         * @method availableHeight
         * @public
         * @param {String|HTMLElement} parentId [optional] 기준이 되는 부모 객체의 id나 dom
         * @param {int} margin [optional] 추가 여유 공간을 확보하기 위해 마이너스할 높이
         * @return {Rui.LElement} this
         */
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
        /**
         * Mask 적용
         * @method mask
         * @param {String} contentHtml [optional] 적용할 html 내용
         * @return {void}
         */
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
        /**
         * Mask 해제
         * @method unmask
         * @return {void}
         */
        unmask: function() {
            if (this.waitMaskEl) this.waitMaskEl.hide();
        },
        /**
         * node가 하위에 포함되어 있는지 확인하는 메소드
         * @method isAncestor
         * @param {HTMLElement} node 포함여부를 확인하는 객체
         * @return {boolean} 포함여부
         */
        isAncestor: function(node) {
            node = node.dom || node;
            return Rui.util.LDom.isAncestor(this.dom, node);
        },
        /**
         * @description 주어진 element의 region 위치를 반환한다.
         * element는 반드시 region을 가진 DOM tree의 일부분이어야 한다
         * (diplay:none 혹은 element들이 추가되어 있지 않으면 false를 반환한다).
         * @method getRegion
         * @return {Region | Array} 'top, left, bottom, right' 멤버데이터를 포함하는 region 인스턴스의 array나 region
         */
        getRegion: function() {
            return Dom.getRegion(this.dom);
        },
        /**
         * @description 현재 위치 정보를 {Rui.util.LRegion} 객체 정보로 셋팅한다.
         * @method setRegion
         * @param {Rui.util.LRegion} region Region객체
         * @param {Boolean/Object} anim (optional) 기본 animation에 대한 true,
         *                                         혹은 표준 standard Element animation config object
         * @return {Rui.LElement} this
         */
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
        /**
         * @description 객체를 사용 가능하게 하는 메소드
         * @method enable
         * @public
         * @return {Rui.LElement} this
         */
        enable: function() {
            if(this.dom) {
                if(this.isFormField()) if(this.invokeField.call(this, 'enable', arguments) == true) return this;
                this.dom.disabled = false;
                this.removeClass(this.CSS_ELEMENT_DISABLED);
            }
            return this;
        },
        /**
         * @description 객체를 사용 불가능하게 하는 메소드
         * @method disable
         * @public
         * @return {Rui.LElement} this
         */
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
        /**
         * @description 객체를 사용 가능여부를 확인하는 메소드
         * @method isDisable
         * @public
         * @return {void}
         */
        isDisable: function() {
            return this.dom ? this.hasClass(this.CSS_ELEMENT_DISABLED) : false;
        },
        /**
         * @description 객체를 유효한 상태로 설정하는 메소드
         * @method valid
         * @public
         * @return {Rui.LElement} this
         */
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

        /**
         * @description 객체를 유효하지 않은 상태로 설정하는 메소드
         * @method invalid
         * @public
         * @return {Rui.LElement} this
         */
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
        /**
         * @description 객체를 유효여부를 확인하는 메소드
         * @method isValid
         * @public
         * @return {boolean}
         */
        isValid: function() {
            return this.dom ? !this.hasClass(this.CSS_ELEMENT_INVALID) : true;
        },
        /**
         * @description 특정 side에 대한 border의 width를 가져온다.
         * @method getBorderWidth
         * @public
         * @param {String} side 여러값들을 추가하기 위하여 t, l, r, b나 이것들의 조합이 될 수 있음.
         * 예를 들어, <tt>'lr'</tt>을 전달하면, <b><u>l</u></b>eft width border + <b><u>r</u></b>ight width border 를 가져올 것이다.
         * @return {Number} 함께 추가되어 전달된 side들의 width
         */
        getBorderWidth: function(side){
            return this.addStyles.call(this, side, Rui.LElement.borders);
        },
        /**
         * @description 특정 side에 대한 padding의 width를 가져온다.
         * @method getPadding
         * @public
         * @param {String} side 여러값들을 추가하기 위하여 t, l, r, b나 이것들의 조합이 될 수 있음.
         * 예를 들어, <tt>'lr'</tt>을 전달하면, <b><u>l</u></b>eft width padding + <b><u>r</u></b>ight width padding 를 가져올 것이다.
         * @return {Number} 함께 추가되어 전달된 side들의 padding
         */
        getPadding: function(side){
            return this.addStyles.call(this, side, Rui.LElement.paddings);
        },
        /**
         * @description 특정 side에 대한 margin의 width를 가져온다.
         * @method getMargins
         * @public
         * @param {String} side 여러값들을 추가하기 위하여 t, l, r, b나 이것들의 조합이 될 수 있음.
         * 예를 들어, <tt>'lr'</tt>을 전달하면, <b><u>l</u></b>eft width padding + <b><u>r</u></b>ight width padding 를 가져올 것이다.
         * @return {Number} 함께 추가되어 전달된 side들의 padding
         */
        getMargins: function(side){
            return this.addStyles.call(this, side, Rui.LElement.margins);
        },
        /**
         * @description 해당 Dom으로 생성된 콤로넌트 인스턴스를 리턴한다.
         * @method getComponent
         * @public
         * @return {LUIComponent} LUICompenent를 상속받은 UI 콤포넌트
         */
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

/**
 * LException 정의 
 * @class LException
 * @private
 * @constructor LException
 * @param {Error|String} message 생성할 메시지나 Error 객체
 * @param {Object} o 에러가 발생한 객체 정보 otype속성이 존재하는 객체만 지원
 */
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

    /**
     * @description 에러 메시지
     * @property message
     * @public
     * @type {String}
     */
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
    /**
     * 객체의 Object Type을 리턴한다.
     * @method getOType
     * @return {String} 에러가 발생한 객체의 otype 값, otype값이 없으면 ''문자 
     */
    getOType: function() {
        return this.callerOType;
    },
    /**
     * 에러 메시지를 리턴한다.
     * @method getMessage
     * @return {String} 에러 메시지 
     */
    getMessage: function() {
        return this.message;
    },
    /**
     * stack 정보로 현재 에러 정보를 생성한다.
     * @method createExceptionInfo
     * @private
     * @param {Object} excp 에러 객체
     * @return {void}  
     */
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
    /**
     * 에러의 위치를 찾기 위한 Stack 정보를 리턴, 브라우져마다 안되는 경우 많음.
     * @method getErrorStack
     * @private
     * @return {String} Stack 정보를 리턴 
     */
    getErrorStack: function(excp){
        var stack = [];
//        var name;
        if (!excp || !excp.stack) {
            return stack;
        }
        var stacklist = excp.stack.split('\n');
        stack = stacklist;
/*
        for (var i = 0; i < stacklist.length - 1; i++)
        {
            var framedata = stacklist[i];
    
            name = framedata.match(/^(\w*)/)[1];
            if (!name) {
                name = 'anonymous';
            }
    
            stack[stack.length] = name;
        }
        // remove top level anonymous functions to match IE

        while (stack.length && stack[stack.length - 1] == 'anonymous')
        {
            stack.length = stack.length - 1;
        }
*/
        return stack;
    },
    /**
     * function의 이름을 리턴하는 메소드
     * @method getFunctionName
     * @private
     * @return {String} 해당 Function의 이름, 단 test = function()  이런 구조여야 가능 
     */
    getFunctionName: function (aFunction) {
        var regexpResult = aFunction.toString().match(/function(\s*)(\w*)/);
        if (regexpResult && regexpResult.length >= 2 && regexpResult[2]) {
            return regexpResult[2];
        }
        return 'anonymous';
    },
    /**
     * StackTrace 정보를 리턴
     * @method getStackTrace
     * @return {String} StackTrace 정보를 리턴값 
     */
    getStackTrace: function() {
        var result = '';
        var caller = arguments.caller;

        if (typeof(this.caller) != 'undefined') { // IE, not ECMA
            for (var a = Rui.isUndefined(this.caller) ? caller : this.caller; a != null; a = a.caller) {
                result += '> ' + this.getFunctionName(a.callee) + '\n';
                if (a.caller == a) {
                    result += '*';
                    break;
                }
            }
        } else { // Mozilla, not ECMA
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
/**
R * @description The static String class provides helper functions to deal with data of type String
 * @module util
 * @title LString
 * @requires Rui
 */
Rui.namespace('Rui.util');

/**
 * @description LString
 * @namespace Rui.util
 * @class LString
 * @static
 */
Rui.applyObject(Rui.util.LString, {
    /**
     * @description 문자열에 모든 공백 제거
     * @method trimAll
     * @param {String} s 문자열
     * @return {String} 모든 공백 제거된 문자열
     */
    trimAll: function(s){
        return s.replace(/\s*/g, '');
    },
    /**
     * @description 문자열을 처음부터 주어진 위치까지 잘라낸다.
     * @method lastCut
     * @param {String} s 문자열
     * @param {int} pos 잘라낼 위치
     * @return {String} 잘라낸 후 문자열
     */
    lastCut: function(s, pos){
        if (s != null && s.length > pos)
            s = s.substring(0, s.length - pos);
        return s;
    },
    /**
     * @description 문자열이 null이면 '' 공백 문자로 리턴
     * @method nvl
     * @param {String} val 값
     * @return {String} val
     */
    nvl: function(val){
        return (val === null) ? '' : val;
    },
    /**
     * @description 입력된 camel 표기법(firstName)의 문자열을 hungarian 표기법(first_name) 문자열로 변환한다.
     * @method camelToHungarian
     * @param {String} camel 문자열
     * @return {String}
     */
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
    /**
     * @description 입력된 camel 표기법(firstName) 의 문자열을 function 문자열로 변환하여 리턴한다.
     * @method getCamelToFunctionName
     * @param {String} hungarian 문자열
     * @return {String}
     */
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
    /**
     * @description 입력된 문자열이 한글로 된 정보인지를 체크한다. 해당문자열이 한글과 스페이스의 조합일때만 true를 리턴한다.
     * @method isHangul
     * @static
     * @param {String} oValue 문자열
     * @return {boolean} 한글 여부
     */
    isHangul: function(oValue){
        var i,ch,len;
        for (i=0, len = oValue.length; i<len;i++) {
            ch = escape(oValue.charAt(i));  //ISO-Latin-1 문자셋으로 변경
            if (this.isHangulChar(ch) == true) { //한글이 아닐 경우
                return true;
            }
        }
        return false;
    },
    /**
     * @description 입력된 문자열이 한글로 된 정보인지를 체크한다.
     * @method isHangulChar
     * @param {String} oValue 문자열
     * @return {boolean} 한글 여부
     */
    isHangulChar: function(oValue){
        if (oValue.substring(0, 2) == '%u') {
            if (oValue.substring(2,4) == '00'){ return false;}
            else { return true;}        //한글
        } else if(oValue == '%20'){ return true; } // space
        else if (oValue.substring(0,1) == '%') {
            return  parseInt(oValue.substring(1,3), 16) > 127 ;
        } else { return false; }
    },
    /**
     * @description 입력된 문자열에서 한글만 제거하고 리턴한다.
     * @method getSkipHangulChar
     * @param {String} oValue 문자열
     * @return {String} 한글을 제거한 문자열
     */
    getSkipHangulChar: function(oValue){
        var s = '';
        var i,ch,len;
        for (i=0, len = oValue.length; i<len;i++) {
            var c = oValue.charAt(i);
            ch = escape(c);  //ISO-Latin-1 문자셋으로 변경
            if (this.isHangulChar(ch) !== true) { //한글이 아닐 경우
                s += c;
            }
        }
        return s;
    },
    /**
     * @description 입력된 문자열이 email로 된 정보인지를 체크한다.
     * @method isEmail
     * @static
     * @param {String} oValue 문자열
     * @return {boolean} email 여부
     */
    isEmail: function(value) {
        return !(value.search(Rui.util.LString.format) == -1);
    },
    /**
     * @description 입력된 문자열이 csn로 된 정보인지를 체크한다.
     * @method isCsn
     * @static
     * @param {String} oValue 문자열
     * @return {boolean} csn 여부
     */
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
    /**
     * @description 입력된 문자열이 주민등록번호로 된 정보인지를 체크한다.
     * @method isSsn
     * @static
     * @param {String} oValue 문자열
     * @return {boolean} ssn 여부
     */
    isSsn: function(value){
        if ( !value || (value+'').length != 13 || isNaN(value))
            return false;

        value += '';

        var jNum1 = value.substr(0, 6);
        var jNum2 = value.substr(6);

        /* ----------------------------------------------------------------
           잘못된 생년월일을 검사합니다.
           2000년도부터 성구별 번호가 바뀌였슴으로 구별수가 2보다 작다면
           1900년도 생이되고 2보다 크다면 2000년도 이상생이 됩니다.
           단 1800년도 생은 계산에서 제외합니다.
        ---------------------------------------------------------------- */

        bYear = (jNum2.charAt(0) <= '2') ? '19' : '20';
        // 주민번호의 앞에서 2자리를 이어서 4자리의 생년을 저장합니다.
        bYear += jNum1.substr(0, 2);
        // 달을 구합니다. 1을 뺀것은 자바스크립트에서는 1월을 0으로 표기하기 때문입니다.
        bMonth = jNum1.substr(2, 2) - 1;
        bDate = jNum1.substr(4, 2);

        bSum = new Date(bYear, bMonth, bDate);

        // 생년월일의 타당성을 검사하여 거짓이 있을시 에러메세지를 나타냄
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
            // 각 수와 곱할 수를 뽑아냅니다. 곱수가 만일 10보다 크거나 같다면 계산식에 의해 2로 다시 시작하게 됩니다.
            if(k >= 10) k = k % 10 + 2;
            // 각 자리수와 계산수를 곱한값을 변수 total에 누적합산시킵니다.
            total = total + (temp[i] * k);
        }
        // 마지막 계산식을 변수 last_num에 대입합니다.
        last_num = (11- (total % 11)) % 10;
        // laster_num이 주민번호의마지막수와 같은면 참을 틀리면 거짓을 반환합니다.
        if(last_num != temp[13]) {
            return false;
        }
        return true;
    },
    /**
     * @description 입력된 문자열이 시간으로 된 정보인지를 체크한다.
     * @method isTime
     * @static
     * @param {String} oValue 문자열
     * @return {boolean} ssn 여부
     */
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
    /**
     * 자바스크립트의 내장 객체인 String 객체에 simpleReplace 메소드를 추가한다. simpleReplace 메소드는
     * 스트링 내에 있는 특정 스트링을 다른 스트링으로 모두 변환한다. String 객체의 replace 메소드와 동일한
     * 기능을 하지만 간단한 스트링의 치환시에 보다 유용하게 사용할 수 있다.
     * <pre>
     *     var str = 'abcde'
     *     str = simpleReplace(str, 'cd', 'xx');
     * </pre>
     * 위의 예에서 str는 'abxxe'가 된다.
     * @static
     * @param {String} str required 기존의 스트링
     * @param {String} oldStr required 바뀌어야 될 기존의 스트링
     * @param {String} newStr required 바뀌어질 새로운 스트링
     * @return {String} replaced String.
     */
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
    /**
     * html 값의 '&lt;' 문자열을 & lt; 값으로 변경한다.
     * @method replaceHtml
     * @static
     * @param {String} html html태그 문자열
     * @return {String} 변경 결과
     */
    replaceHtml: function(html) {
        if(html) {
            html = html.replace(/\</gi, '&lt;');
            html = html.replace(/\>/gi, '&gt;');
        }
        return html;
    },
    /**
     * 태그를 모두 제거하고 html의 순수 문자열만 리턴한다.
     * @method skipTags
     * @static
     * @param {String} html html태그 문자열
     * @return {String} 변경 결과
     */
    skipTags: function(html) {
    	if(!html) return '';
    	return html.replace(/<\/?([a-z][a-z0-9]*)\b[^>]*>/gi, '');
    },
    /**
     * value의 값을 클립보드에 저장한 후 결과를 리턴한다.
     * @method toClipboard
     * @static
     * @param {String} value 저장할 값
     * @return {boolean} 결과 여부
     */
    toClipboard: function(value) {
        try {
            if(window.clipboardData){
                clipboardData.setData('text',value);
                return true;
            }else if(window.netscape){
                //http://www-archive.mozilla.org/xpfe/xptoolkit/clipboard.html
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
                try{  // 크
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
    /**
     * value의 값을 클립보드값을 리턴한다.
     * @method getClipboard
     * @static
     * @return {String} 결과
     */
    getClipboard: function() {
        try {
            if(window.clipboardData){
                return clipboardData.getData('text');;
            }else if(window.netscape){
                //http://www-archive.mozilla.org/xpfe/xptoolkit/clipboard.html
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
            else{   // 크
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
    /**
     * chrome에서 비동기로 수신되는 메시지를 처리함.
     * @method getPlugInMsg
     * @private
     * @return {void} void
     */
    getPlugInMsg: function(callback, pEvent){
        this.fireClipboardEvent(pEvent,'clipboardPasteEventDiv',null);
        if(typeof callback !== 'function')
            callback = false;
        this.async( function(){callback();});
    },
    async: function (fn) {
       setTimeout(fn, 10);
    },
    /**
     * 수신된 메시지를 화면에 표시
     * @method displayMsg
     * @private
     * @return {void} void
     */
    displayMsg: function(){
    	var div = top.document.getElementById('clipboardPasteEventDiv');
        var value = div.innerText || div.textContent;
        if(typeof Rui.util.LString.clipConfig.rtrimWhiteSpace !== undefined
        		&& Rui.util.LString.clipConfig.rtrimWhiteSpace)
        	value = value.replace(/\s+$/g,'');
        Rui.util.LString.clipConfig.clipData.setClipData(value, Rui.util.LString.clipConfig.view);
    },
    /**
     * Chrome.extension으로 Event를 전달한다.
     * @method firePasteClipboardEvent
     * @private
     * @param {Event} pEvent customEvent
     * @param {String} data 복사한 데이터
     * @return {void}
     */
    fireClipboardEvent: function(pEvent,pEl,data){
        var hiddenDiv = top.document.getElementById(pEl);
        if(data != null)
            hiddenDiv.innerText = data;
        hiddenDiv.dispatchEvent(pEvent);
    },
    /**
     * @description 캐쉬되지 않는 고유한 Url을 만든다.
     * @method getTimeUrl
     * @param {String} url Array 배열
     * @return {String} QueryString형 문자열 id=ddd&pwd=ccc
     */
    getTimeUrl: function(url){
        return this.getAppendUrl(url, '_dc', (new Date().getTime()));
    },
    /**
     * url에 해당되는 파라미터를 추가한다.
     * @method getAppendUrl
     * @static
     * @param {String} url url값
     * @param {String} key key값
     * @param {String} value value값
     * @return {Object} 결과
     */
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
    /**
     * url에 해당되는 파라미터를 object형으로 리턴한다.
     * @method getUrlParams
     * @static
     * @param {String} url url값
     * @return {Object} 결과
     */
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
    /**
     * 한글이 포함된 문자열의 경우 byte로 계산하여 substring을 한다.
     * @method getByteSubstring
     * @static
     * @param {String} str 문자열
     * @param {int} start 시작 index
     * @param {int} length 짤라낼 길이
     * @return {string}
     */
    getByteSubstring: function(str, start, size) {
        var c = byteLength = 0;
        for (var i = pos = 0; pos < start ; i++) {
            c = escape(str.charAt(i));
            if (c.length == 1) { // when English then 1byte
                byteLength = 1;
            } else if (c.indexOf('%u') != -1) { // when Korean then 2byte
                byteLength = 3; // utf-8 : 3
            } else {
                if (c.indexOf('%') != -1) { // else 3byte
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
            if (c.length == 1)        // when English then 1byte
                byteLength = 1;
            else if (c.indexOf('%u') != -1) { // when Korean then 2byte
                byteLength = 3; // utf-8 : 3
            } else {
                if (c.indexOf('%') != -1) { // else 3byte
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
/**
 * @requires Rui
 * @namespace Rui.util
 * @class LDate
 * @static
 */
Rui.applyObject(Rui.util.LDate, {
    /**
     * Date객체의 Pattern에 따른 날짜 비교
     * @method compareString
     * @static
     * @param {Date} date1   Date1 객체
     * @param {Date} date2   Date2 객체
     * @param {String} pattern format pattern 문자
     * @return {boolean}
     */
    compareString: function(date1, date2, pattern) {
        var dateString1 = this.format(date1, pattern);
        var dateString2 = this.format(date2, pattern);
        return (dateString1 == dateString2);
    },
    /**
     * 주어진 연도의 1월 1일을 표시하는 자바스크립트 date object를 조회한다.
     * @method getJan1
     * @static
     * @param {Number} calendarYear      1월 1일을 조회하기 위한 달력의 연도
     * @return {Date}    명시된 달력 연도의 1월 1일
     */
    getJan1: function(calendarYear) {
        return this.getDate(calendarYear, 0, 1);
    },
    /**
     * 특정 연도의 1월 1일부터 특정 일자까지의 일수를 계산한다.
     * 0의 offset 값을 이 함수에서 반환하기 위해서는 1월 1일을 전달한다.
     * @method getDayOffset
     * @static
     * @param {Date} date    offset을 찾을 자바크스립트 date
     * @param {Number} calendarYear  offset을 결정하기 위해 사용하는 연도
     * @return {Number}  주어진 연도의 1월 1일 부터의 일수
     */
    getDayOffset: function(date, calendarYear) {
        var beginYear = this.getJan1(calendarYear); // Find the start of the year. This will be in week 1.
        // Find the number of days the passed in date is away from the calendar year start
        var dayOffset = Math.ceil((date.getTime() - beginYear.getTime()) / this.ONE_DAY_MS);
        return dayOffset;
    },
    /**
     * 주어진 week가 두개의 다른 연도에 겹쳐지는지 대한 여부를 결정한다.
     * ex) 2012년 12월 31일은 2013년 1월 1일과 같은 week 이므로 true
     * @method isYearOverlapWeek
     * @static
     * @param {Date} weekBeginDate  주의 첫번째 날짜를 표시하는 자바스크립트 Date
     * @return {boolean} 날짜가 두개의 다른 연도에 겹쳐지면 true
     */
    isYearOverlapWeek: function(weekBeginDate) {
        var overlaps = false;
        var nextWeek = this.add(weekBeginDate, this.DAY, 6);
        if (nextWeek.getFullYear() != weekBeginDate.getFullYear())
            overlaps = true;
        return overlaps;
    },
    /**
     * 주어진 week가 두개의 다른 달에 겹쳐지는지 대한 여부를 결정한다.
     * @method isMonthOverlapWeek
     * @static
     * @param {Date} weekBeginDate   주의 첫번째 날짜를 표시하는 자바스크립트 Date
     * @return {boolean} 날짜가 두개의 다른 달에 겹쳐지면 true
     */
    isMonthOverlapWeek: function(weekBeginDate) {
        var overlaps = false;
        var nextWeek = this.add(weekBeginDate, this.DAY, 6);
        if (nextWeek.getMonth() != weekBeginDate.getMonth())
            overlaps = true;
        return overlaps;
    },
    /***************************************LDateMath에서 가져온 function 끝***************************************/
    /**
     * @description inx월에 다국어 표현 날짜 (예: 01월)
     * @method getMonthInYear
     * @static
     * @param {int} inx
     * @return {String}
     */
    getMonthInYear: function(inx) {
        return Rui.getMessageManager().get('$.core.monthInYear')[inx];
    },
    /**
     * @description inx월에 다국어 표현 짧은 날짜 (예: 1월)
     * @method getShortMonthInYear
     * @static
     * @param {int} inx
     * @return {String}
     */
    getShortMonthInYear: function(inx) {
        return Rui.getMessageManager().get('$.core.shortMonthInYear')[inx];
    },
    /**
     * @description inx에 해당되는 다국어 요일 (예: 월요일)
     * @method getDayInWeek
     * @static
     * @param {int} inx
     * @return {String}
     */
    getDayInWeek: function(inx) {
        return Rui.getMessageManager().get('$.core.dayInWeek')[inx];
    },
    /**
     * @description inx에 해당되는 다국어 짧은 요일 (예: 월)
     * @method getShortDayInWeek
     * @static
     * @param {int} inx
     * @return {String}
     */
    getShortDayInWeek: function(inx) {
        return Rui.getMessageManager().get('$.core.shortDayInWeek')[inx];
    },
    /**
     * 주어진 날짜에 대한 week number를 계산한다.
     * 올해의 첫번째 주를 1월 1일로 정의하는 것에 기반하는 standard U.S. week number와
     * 올해의 첫번째 주를 1월 4일로 정의하는 것에 기반하는 ISO8601 week number를 일번적으로 지원할 수 있다.
     * 
     * @method getWeekNumber
     * @static
     * @param {Date} date week number를 찾을 자바스크립트 date
     * @param {Number} firstDayOfWeek 주의 첫번째 날짜의 인덱스(0 = Sun, 1 = Mon ... 6 = Sat). 기본값은 0
     * @param {Number} janDate 올해의 한주를 정의 하는 1월의 첫째주의 date
     * 기본값은 1(Jan 1st)인, Rui.ui.LDateMath.WEEK_ONE_JAN_DATE의 값.
     * U.S에 대해서는 일반적으로 1월 1일 이다. ISO8601은 올해의 첫째주를 정의하기 위하여 1월 4일을 사용한다.
     * @return {Number} 주어진 날짜를 포함하는 week numner
     */
    getWeekNumber: function(date, firstDayOfWeek, janDate) {
         // Setup Defaults
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
//         var startTime = startOfWeek.getTime();

         // DST shouldn't be a problem here, math is quicker than setDate();
         endOfWeek = new Date(startOfWeek.getTime() + 6 * this.ONE_DAY_MS);

         var weekNum;
         if (startYear !== endOfWeek.getFullYear() && endOfWeek.getDate() >= janDate) {
             // If years don't match, endOfWeek is in Jan. and if the 
             // week has WEEK_ONE_JAN_DATE in it, it's week one by definition.
             weekNum = 1;
         } else {
             // Get the 1st day of the 1st week, and 
             // find how many days away we are from it.
             var weekOne = this.clearTime(this.getDate(startYear, 0, janDate)),
                 weekOneDayOne = this.getFirstDayOfWeek(weekOne, firstDayOfWeek);

             // Round days to smoothen out 1 hr DST diff
             var daysDiff = Math.round((targetDate.getTime() - weekOneDayOne.getTime()) / this.ONE_DAY_MS);

             // Calc. Full Weeks
             var rem = daysDiff % 7;
             var weeksDiff = (daysDiff - rem) / 7;
             weekNum = weeksDiff + 1;
         }
         return weekNum;
     }
});
/**
 * static Array 클래스는 Array 타입의 데이터를 처리하는데 도움을 주는 함수들을 제공한다.
 * @module util
 * @namespace Rui.util
 * @requires Rui
 * @class LArray
 * @static
 */
Rui.applyObject(Rui.util.LArray, {
    /**
     * QueryString형 문자로 리턴한다.
     * @method serialize
     * @param {Array} params Array 배열
     * @param {String] prefix [optional] 그룹을 구분하는 prefix 값. 기본 '&'
     * @return {String} QueryString형 문자열 id=ddd&pwd=ccc
     */
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
    /**
     * @description 객체를 복사하는 메소드
     * @method clone
     * @public
     * @param {Object} obj 복사하고자 하는 원본 객체
     * @return {Object} 복사된 객체
     */
    clone: function(obj){
        return [].concat(obj);
    },
    /**
     * items 배열에서 oldIndex에 해당되는 데이터를 newIndex로 이동하는 메소드
     * @method moveItem
     * @param {Array} items Array 배열
     * @param {int} oldIndex 이동할 위치
     * @param {int} newIndex 이동될 위치
     * @return {Object} 삭제된 위치
     */
    moveItem: function(items, oldIndex, newIndex){
        var temp = items[oldIndex];
        items = Rui.util.LArray.removeAt(items, oldIndex);            
        var a = items.slice(0, newIndex);
        var b = items.slice(newIndex, items.length);
        a.push(temp);
        return a.concat(b);
    },
    /**
     * items1 배열에 item2 배열의 중복되지 않은 값만 합쳐서 리턴한다. 
     * @method concat
     * @param {Array} items1 Array 배열
     * @param {Array} items2 Array 배열
     * @return {Array} 
     */
    concat: function(items1, items2) {
        var newItems = this.clone(items1);
        for (var i = 0 , len = items2.length; i < len; i++) {
            if(Rui.util.LArray.contains(items1, items2[i]) == false)
                newItems.push(items2[i]);
        }
        return newItems;
    }
});
/**
 * @description 숫자 유틸리티
 * @module util
 * @title LNumber
 * @namespace Rui.util
 * @class LNumber
 * @static
 */

/**
 * @description LNumber
 * @namespace Rui.util
 * @class LNumber
 */
Rui.applyObject(Rui.util.LNumber, {
    /**
     * @description 소수점 숫자 반올림
     * @method round
     * @static
     * @param {Int/String} value 반올림 할 값.
     * @param {int} precision 반올림 자리수.
     * @return {int} 반올림된 값.
     */
    round: function(value, precision) {
        var result = Number(value);
        if (typeof precision == 'number') {
            result = Number(this.format(value, { decimalPlaces: precision }));
        }
        return result;
    },
    /**
     * @description 통화량(돈)으로 숫자를 형식화 한다.
     * @method toMoney
     * @static
     * @param {Number/String} value 형식화 할 숫자값
     * @param {String} currency 통화 문자
     * @return {String} 형식화 된 통화량 문자열
     */
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
    /**
     * @description US 통화 단위로 숫자를 형식화 한다.
     * @method usMoney
     * @static
     * @param {Number/String} value 형식화 할 숫자 값
     * @return {String} 형식화된 통화량 문자열
     */
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
/**
 * dom 모듈은 dom element들을 조작하기 위해 도움이 되는 method들을 제공한다.
 * @module util
 * @title LDom Utility
 * @namespace Rui.util
 * @requires Rui
 */
(function() {
    var Y = Rui.util,     // internal shorthand
        document = window.document;     // cache for faster lookups

    // brower detection
    var isOpera = Rui.browser.opera,
        isSafari = Rui.browser.webkit,
        isIE = Rui.browser.msie;

    var LString = Rui.util.LString;
    // regex cache
    var patterns = {
        HYPHEN: /(-[a-z])/i, // to normalize get/setStyle
        ROOT_TAG: /^body|html$/i, // body for quirks mode, html for standards,
        OP_SCROLL:/^(?:inline|table-row)$/i
    };

    /**
     * DOM element들에 대해 도움이 되는 method들을 제공한다.
     * @namespace Rui.util
     * @class LDom
     */
    Rui.applyObject(Rui.util.LDom, {
        /**
         * 페이지 좌표에 기반한 element의 현재 위치를 가져온다.
         * element는 반드시 페이지 좌표를 가진 DOM 트리의 일부여야 한다.
         * (display:none이거나 element가 append되어 있지 않다면 false를 반환)
         * @method getXY
         * @static
         * @param {String | HTMLElement | Array} el ID로서 사용할 문자열이나, 실제 DOM 참조, HTMLElement나 ID들의 array를 허용한다.
         * @return {Array} element의 XY 위치
         */
        getXY: function(el) {
            var f = function(el) {
                // has to be part of document to have pageXY
                // el.ownerDocument 객체가 존재하지않을 수 도 있음.
                if(el.ownerDocument === null) return false;
                if ( ((el.parentNode === null || el.offsetParent === null ||
                       this.getStyle(el, 'display') == 'none') && el != el.ownerDocument.body)) {
                   return false;
                }
                return getXY(el);
            };
            return Y.LDom.batch(el, f, Y.LDom, true);
        },
        /**
         * 페이지 좌표에 기반한 element의 현재 X 위치를 가져온다.
         * element는 반드시 페이지 좌표를 가진 DOM 트리의 일부여야 한다.
         * (display:none이거나 element가 append되어 있지 않다면 false를 반환)
         * @method getX
         * @static
         * @param {String | HTMLElement | Array} el ID로서 사용할 문자열이나, 실제 DOM 참조, HTMLElement나 ID들의 array를 허용한다.
         * @return {Number | Array} element의 X 위치
         */
        getX: function(el) {
            var f = function(el) {
                return Y.LDom.getXY(el)[0];
            };
            return Y.LDom.batch(el, f, Y.LDom, true);
        },
        /**
         * 페이지 좌표에 기반한 element의 현재 Y 위치를 가져온다.
         * element는 반드시 페이지 좌표를 가진 DOM 트리의 일부여야 한다.
         * (display:none이거나 element가 append되어 있지 않다면 false를 반환)
         * @static
         * @method getY
         * @param {String | HTMLElement | Array} el ID로서 사용할 문자열이나, 실제 DOM 참조, HTMLElement나 ID들의 array를 허용한다.
         * @return {Number | Array} element의 Y 위치
         */
        getY: function(el) {
            var f = function(el) {
                return Y.LDom.getXY(el)[1];
            };
            return Y.LDom.batch(el, f, Y.LDom, true);
        },
        /**
         * element가 어떻게 위치되었는지에 상관없이 페이지 좌표안에서 html element의 위치를 설정한다.
         * element는 반드시 페이지 좌표를 가진 DOM 트리의 일부여야 한다.
         * (display:none이거나 element가 append되어 있지 않다면 false를 반환)
         * @method setXY
         * @static
         * @param {String | HTMLElement | Array} el ID로서 사용할 문자열이나, 실제 DOM 참조, HTMLElement나 ID들의 array를 허용한다.
         * @param {Array} pos 새로운 위치에 대한 X와 Y값을 포함하는 array(페이지에 기반한 좌표)
         * @param {boolean} noRetry [optional] 기본적으로 처음 시도가 실패하는 경우 두번째로 위치를 설정하려고 시도한다.
         * @return {void}
         */
        setXY: function(el, pos, noRetry) {
            var f = function(el) {
                var style_pos = this.getStyle(el, 'position');
                if (style_pos == 'static') { // default to relative
                   this.setStyle(el, 'position', 'relative');
                   style_pos = 'relative';
                }

                var pageXY = this.getXY(el);
                if (pageXY === false) { // has to be part of doc to have pageXY
                   return false;
                }

                // L-hidden일 경우 -10000 제거
                if(Rui.get(el).hasClass('L-hidden')) {
                   pageXY[0] += 10000;
                   pageXY[1] += 10000;
                }

                var delta = [ // assuming pixels; if not we will have to retry
                   parseInt( this.getStyle(el, 'left'), 10 ),
                   parseInt( this.getStyle(el, 'top'), 10 )
                ];

                if ( isNaN(delta[0]) ) {// in case of 'auto'
                   delta[0] = (style_pos == 'relative') ? 0 : el.offsetLeft;
                }

                if ( isNaN(delta[1]) ) { // in case of 'auto'
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

                   // if retry is true, try one more time if we miss
                  if ( (pos[0] !== null && newXY[0] != pos[0]) ||
                       (pos[1] !== null && newXY[1] != pos[1]) ) {
                      this.setXY(el, pos, true);
                  }
                }
            };

            Y.LDom.batch(el, f, Y.LDom, true);
        },
        /**
         * element가 어떻게 위치되었는지에 상관없이 페이지 좌표안에서 html element의 X 위치를 설정한다.
         * element는 반드시 페이지 좌표를 가진 DOM 트리의 일부여야 한다.
         * (display:none이거나 element가 append되어 있지 않다면 false를 반환)
         * @method setX
         * @static
         * @param {String | HTMLElement | Array} el ID로서 사용할 문자열이나, 실제 DOM 참조, HTMLElement나 ID들의 array를 허용한다.
         * @param {int} x element에 대한 X 좌표로서 사용될 값
         */
        setX: function(el, x) {
            Y.LDom.setXY(el, [x, null]);
        },
        /**
         * element가 어떻게 위치되었는지에 상관없이 페이지 좌표안에서 html element의 Y 위치를 설정한다.
         * element는 반드시 페이지 좌표를 가진 DOM 트리의 일부여야 한다.
         * (display:none이거나 element가 append되어 있지 않다면 false를 반환)
         * @method setY
         * @static
         * @param {String | HTMLElement | Array} el ID로서 사용할 문자열이나, 실제 DOM 참조, HTMLElement나 ID들의 array를 허용한다.
         * @param {int} y element에 대한 Y 좌표로서 사용될 값
         */
        setY: function(el, y) {
            Y.LDom.setXY(el, [null, y]);
        },
        /**
         * 주어진 element의 region 위치를 반환한다.
         * element는 반드시 페이지 좌표를 가진 DOM 트리의 일부여야 한다.
         * (display:none이거나 element가 append되어 있지 않다면 false를 반환)
         * @method getRegion
         * @static
         * @param {String | HTMLElement | Array} el ID로서 사용할 문자열이나, 실제 DOM 참조, HTMLElement나 ID들의 array를 허용한다.
         * @return {Region | Array} Region이나 'top, left, bottom, right' 멤버 데이터를 포함하는 Region 인스턴스의 array
         */
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
        /**
         * document에 연관된 viewport에 기반한 Region을 생성한다.
         * @static
         * @method getClientRegion
         * @return {Region} document 스크롤을 차지하는 viewport를 표현하는 Region object
         */
        getClientRegion: function() {
            var t = Y.LDom.getDocumentScrollTop(),
                l = Y.LDom.getDocumentScrollLeft(),
                r = Y.LDom.getViewportWidth() + l,
                b = Y.LDom.getViewportHeight() + t;
            return new Y.LRegion(t, r, b, l);
        },
        /**
         * 클라이언트의 width를 반환한다.(viewport:화면 상의 화상 표시영역)
         * @method getClientWidth
         * @deprecated 지금은 getViewportWidth을 사용한다. 이 인터페이스는 예전 compat를 위해 그대로 유지됐다.
         * @return {int} 페이지의 표시가능한 영역의 width
         */
        getClientWidth: function() {
            return Y.LDom.getViewportWidth();
        },
        /**
         * 클라이언트의 height를 반환한다.(viewport:화면 상의 화상 표시영역)
         * @method getClientHeight
         * @deprecated 지금은 getViewportHeight을 사용한다. 이 인터페이스는 예전 compat를 위해 그대로 유지됐다.
         * @return {int} 페이지의 표시가능한 영역의 height
         */
        getClientHeight: function() {
            return Y.LDom.getViewportHeight();
        },
        /**
         * document의 height를 반환한다.
         * @static
         * @method getDocumentHeight
         * @return {int} 실제 document의 height(body와 그것의 공백을 포함하는)
         */
        getDocumentHeight: function() {
            var scrollHeight = (document.compatMode != 'CSS1Compat') ? document.body.scrollHeight : document.documentElement.scrollHeight;
            return Math.max(scrollHeight, Y.LDom.getViewportHeight());
        },
        /**
         * document의 width를 반환한다.
         * @static
         * @method getDocumentWidth
         * @return {int} 실제 document의 width(body와 그것의 공백을 포함하는)
         */
        getDocumentWidth: function() {
            var scrollWidth = (document.compatMode != 'CSS1Compat') ? document.body.scrollWidth : document.documentElement.scrollWidth;
            return Math.max(scrollWidth, Y.LDom.getViewportWidth());
        },
        /**
         * document의 왼쪽 스크롤 값을 반환한다.
         * @static
         * @method getDocumentScrollLeft
         * @param {HTMLDocument} document (optional) 스크롤 값을 가져올 document
         * @return {int}  document가 왼쪽으로 스크롤되어 있는 값
         */
        getDocumentScrollLeft: function(doc) {
            doc = doc || document;
            return Math.max(doc.documentElement.scrollLeft, doc.body.scrollLeft);
        },
        /**
         * document의 top 스크롤 값을 반환한다.
         * @static
         * @method getDocumentScrollTop
         * @param {HTMLDocument} document (optional) 스크롤 값을 가져올 document
         * @return {int}  document가 top으로 스크롤되어 있는 값
         */
        getDocumentScrollTop: function(doc) {
            doc = doc || document;
            return Math.max(doc.documentElement.scrollTop, doc.body.scrollTop);
        },
        /**
         * viewport의 object 정보를 리턴한다. width/height 등...
         * @method getViewport
         * @return {Object}
         * @static
         * @mobile
         */
        getViewport: function(){
            return {width:this.getViewportWidth(),height:this.getViewportHeight()};
        },
        /**
         * viewport의 현재 height를 반환한다.
         * @static
         * @method getViewportHeight
         * @return {int} 페이지의 표시 가능한 부분의 height(스크롤바는 제외).
         */
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
        	var height = self.innerHeight; // Safari, Opera
            var mode = document.compatMode;
            if ( (mode || isIE) && !isOpera ) { // IE, Gecko
                height = (mode == 'CSS1Compat') ?
                        document.documentElement.clientHeight : // Standards
                        document.body.clientHeight; // Quirks
            }
            return height;
        },
        /**
         * viewport의 현재 width를 반환한다.
         * @static
         * @method getViewportWidth
         * @return {int} 페이지의 표시 가능한 부분의 width(스크롤바는 제외).
         */
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
        	var width = self.innerWidth;  // Safari
            var mode = document.compatMode;
            if (mode || isIE) { // IE, Gecko, Opera
                width = (mode == 'CSS1Compat') ?
                    document.documentElement.clientWidth : // Standards
                    document.body.clientWidth; // Quirks
            }
            return width;
        },
        /**
         * @description dom에서 지정한 prefix를 className의 prefix로 가지는 className의 뒷값 가져오기
         * @method findStringInClassName
         * @private
         * @param {HTMLElement} dom
         * @return {string} value
         */
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
        /**
         * document에 픽셀 단위값을 제거하고 숫자값만 반
         * @static
         * @method toPixelNumber
         * @param {String} px string
         * @return {int} 문자중에 px를 제외한 숫자 값
         */
        toPixelNumber: function(px) {
        	if(px && typeof px == 'string'){
    			px = px.replace(/px/, '');
    			px = parseFloat(px, 10);
        	}else
        		return 0;
        	return px;
        },
        /**
         * node의 특정 방향 t,r,b,t(top,right,bottom,left)중의 한 방향이 화면에서 안보이는지 여부 top,right,bottom,left
         * bottom 좌표값이 99인데 화면에 안가렸냐? isVisibleSide(99);, right 좌표값이 99인데 화면에 안가렸냐 ? isVisibleSide(99,'r');
         * @method isVisibleSide
         * @static
         * @param {int} coord 비교하려는 방향의 좌표값
         * @param {String} side t,r,b,t 비교하려는 방향 default는 b(bottom)
         * @return {boolean}
         */
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
        /**
         * @description 선택된 객체의 커서 위치 변경
         * @method setCaretToPos
         * @static
         * @param {HtmlElement} dom dom객체
         * @param {int} pos 커서 위치값
         * @return {void}
         */
        setCaretToPos: function(dom, pos){
             Rui.util.LDom.setSelectionRange(dom, pos, pos);
        },
        /**
         * @description dom의 여부 공간이 존재하는 height 값을 리턴한다.
         * @method getAvailableHeight
         * @static
         * @param {HTMLElement} dom dom객체
         * @return {int}
         */
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
        /**
         * @description 선택된 객체의 커서 위치 변경
         * @method setSelectionRange
         * @static
         * @param {HtmlElement} dom dom객체
         * @param {int} begin 커서 시작 위치
         * @param {int} end 커서 끝 위치
         * @return {void}
         */
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
        /**
         * @description 선택된 객체의 커서 위치 정보 반환
         * @method getSelectionInfo
         * @static
         * @param {HtmlElement} dom dom객체
         * @return {Object}
         */
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
        /**
         * @description 선택된 객체의 커서 시작위치 반환
         * @method getSelectionStart
         * @static
         * @param {HtmlElement} dom dom객체
         * @return {int} 커서 시작위치 반환
         */
        getSelectionStart: function(s) {
            if (s.createTextRange && document.selection) { // < IE8
                var r = document.selection.createRange().duplicate();
                r.moveEnd('character', s.value.length);
                if (r.text == '') return s.value.length;
                return s.value.lastIndexOf(r.text);
            } else return s.selectionStart; // IE9, firfox, chrome
        },
        /**
         * @description 선택된 객체의 커서 마지막 위치 반환
         * @method getSelectionEnd
         * @static
         * @param {HtmlElement} dom dom 객체
         * @return {int} 커서 마지막 위치 반환
         */
        getSelectionEnd: function(s) {
             if (s.createTextRange && document.selection) {
                 var r = document.selection.createRange().duplicate();
                 r.moveStart('character', -s.value.length);
                 return r.text.length;
             } else return s.selectionEnd;
        },
        /**
         * 범위 객체안에 입력 field의 value값들을 object형으로 만들어서 리턴한다.
         * @method getFormValues
         * @sample default
         * @static
         * @param {String|HTMLElement} id 범위 객체
         * @return {Object}
         */
        getFormValues: function(id) {
            return this.getValues('input[type=text], input[type=password], input[type=hidden], textarea, input:checked, select:selected', id);
        },
        /**
         * 범위 객체안에 selector에 대한 입력 field의 value값들을 object형으로 만들어서 리턴한다.
         * @method getValues
         * @sample default
         * @static
         * @param {selector} selector selector 문자열
         * @param {String|HTMLElement} id 범위 객체
         * @return {Object}
         */
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
        /**
         * @description 자신의 dom이 보이지 않아도 부모들중 안보이는 dom을 찾아서 리턴한다.
         * @method getHiddenParent
         * @protected
         * @param {int} maxDepth [optional] 최대 부모 검색 갯수
         * @return {HTMLELement}
         */
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
        /**
         * @description 현재 페이지의 GET 방식의 파라미터를 Object 형으로 리턴한다.
         * @method getParams
         * @protected
         * @return {Object}
         */
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
        /**
         * android의 toast 메시지 처럼 잠시 메시지를 잠시 출력했다가 사라진다. IE8이상 지원
         * @method toast
         * @param {String} text 출력할 메시지
         * @param {String|HTMLElement} dom dom 아이디나 객체
         * @param {object} options 환경 설정값
         * @return {void}
         */
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
        /**
         * dom에 정의되어 있는 css중에 L-fn-로 시작하는 css를 찾아서 그 이름 뒤에 해당되는 문자열에 해당되는 function을 호출한다.
         * @method invokeFn
         * @param {String|HTMLElement} dom dom 아이디나 객체
         * @param {Object} scope 호출할 scope
         * @param {Object} event event 객체 
         * @return {Boolean}
         */
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

        if (document.documentElement.getBoundingClientRect) { // IE
            return function(el) {
                var box = el.getBoundingClientRect(),
                    round = Math.round;

                var rootNode = el.ownerDocument;
                return [round(box.left + Y.LDom.getDocumentScrollLeft(rootNode)), round(box.top + Y.LDom.getDocumentScrollTop(rootNode))];
            };
        } else {
            return function(el) { // manually calculate by crawling up offsetParents
                var pos = [el.offsetLeft, el.offsetTop];
                var parentNode = el.offsetParent;

                // safari: subtract body offsets if el is abs (or any offsetParent), unless body is offsetParent
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

                if (accountForBody) { //safari doubles in this case
                    pos[0] -= el.ownerDocument.body.offsetLeft;
                    pos[1] -= el.ownerDocument.body.offsetTop;
                }
                parentNode = el.parentNode;

                // account for any scrolled ancestors
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
    }(); // NOTE: Executing for loadtime branching

})();


/**
 * static LXML 클래스는 Xml 타입의 데이터를 처리하는데 도움을 주는 함수들을 제공한다.
 * @module util
 * @namespace Rui.util
 * @requires Rui
 * @class LXml
 * @static
 */
Rui.util.LXml = {
    /**
     * xml document를 생성한다.
     * @method createDocument
     * @param {String} docName document의 이름을 입력한다.
     * @return {XmlDocument} 
     */
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
    /**
     * 하위의 element를 생성한다.
     * @method createChild
     * @param {Element} el 붙이고자 하는 Xml부모 객체
     * @param {String} name element의 이름
     * @return {XmlDocument} 
     */
    createChild: function(el, name) {
    	var doc = el.ownerDocument;
    	var child = doc.createElement(name);
    	el.appendChild(child);
    	return child;
    },
    /**
     * 하위의 text element를 생성한다.
     * @method createTextValue
     * @param {Element} el 붙이고자 하는 Xml부모 객체
     * @param {String} name element의 이름
     * @param {Boolean} isCData [optional] cdata 여부
     * @return {XmlDocument} 
     */
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
    /**
     * xml 정보를 문자열로 리턴한다.
     * @method serialize
     * @param {XmlDocuement} doc xml document
     * @return {String} 
     */
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
/**
 * LKeyListener는 DOM element를 감시하며 keydown/keyup event를 listening하는데 인테페이스를 제공하는 유틸리티이다. 
 * @namespace Rui.util
 * @class LKeyListener
 * @constructor
 * @sample default
 * @param {HTMLElement} attachTo key event가 첨부되어야할 element나 element ID
 * @param {String}      attachTo key event가 첨부되어야할 element나 element ID
 * @param {Object}      keyData  감지할 key를 표시하는 object literal. 
 *                               가능한 attribute들은 shift(boolean), alt(boolean), ctrl(boolean),
 *                               keys(키코드를 표시하는 정수나 정수들의 배열)가 있다.
 * @param {Function}    handler  keyevent가 감지되었을때 발생시킬 LCustomEvent handler
 * @param {Object}      handler  handler를 표시하는 object literal. 
 * @param {String}      event    (Optional) listening할 keydown이나 keyup 이벤트.
 *                               자동적으로 기본값은 keydown.
 *
 * @knownissue 'keypress' event는 Safari 2.x나 그 이하 버전에서 완전히 깨진다.
 *             해결 방법은 key listening을 위해 'keydown'을 사용하는 것이다.
 *             그러나 기본적인 키 입력 행동을 막고자 하는 경우, 이것은
 *             키 핸들링을 꽤 지저분하게 만들 것이다. 
 * @knownissue keydown은 또한 Safari 2.x나 그 이하 버전에서 ESC 키에 대해 깨진다.
 *             이것은 listening에 대한 다른 키를 선택하더라도 현재 해결방법은 없다. 
 */
//@TODO optimize
//@TODO use event utility, lang abstractions
//@TODO replace
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
    /**
     * 키가 눌렸을때 내부적으로 LCustomEvent가 발생한다.
     * @event keyPressed
     * @private
     * @param {Object} keyData 감지할 key를 표시하는 object literal
     *                         가능한 attribute들은 shift(boolean), alt(boolean), ctrl(boolean), 
     *                         keys(키코드를 표시하는 정수나 정수들의 배열)가 있다. 
     */
    var keyEvent = new Rui.util.LCustomEvent('keyPressed');
    /**
     * enable() 함수를 통해 LKeyListener가 활성화 될 때, LCustomEvent가 발생한다.
     * @event enabled
     * @param {Object} keyData 감지할 key를 표시하는 object literal
     *                         가능한 attribute들은 shift(boolean), alt(boolean), ctrl(boolean), 
     *                         keys(키코드를 표시하는 정수나 정수들의 배열)가 있다. 
     */
    this.enabledEvent = new Rui.util.LCustomEvent('enabled');
    /**
     * disable() 함수를 통해 LKeyListener가 비활성화 될 때, LCustomEvent가 발생한다.
     * @event disabled
     * @param {Object} keyData 감지할 key를 표시하는 object literal
     *                         가능한 attribute들은 shift(boolean), alt(boolean), ctrl(boolean), 
     *                         keys(키코드를 표시하는 정수나 정수들의 배열)가 있다. 
     */
    this.disabledEvent = new Rui.util.LCustomEvent('disabled');

    if (typeof attachTo == 'string') {
        attachTo = document.getElementById(attachTo);
    }
    if (typeof handler == 'function') {
        keyEvent.on(handler);
    } else {
        keyEvent.on(handler.fn, handler.scope, handler.correctScope);
    }
    /**
     * 키가 눌렸을 때 key event를 핸들링한다.
     * @method handleKeyPress
     * @private
     * @param {DOMEvent} e   The keypress DOM event
     * @param {Object}   obj The DOM event scope object
     */
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

        // check held down modifying keys first
        if (e.shiftKey == keyData.shift && 
            e.altKey   == keyData.alt &&
            e.ctrlKey  == keyData.ctrl) { // if we pass this, all modifiers match
            
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
    /**
     * 대상 DOM element에 DOM event listener를 붙임으로써 LKeyListener를 활성화 한다.
     * @method enable
     */
    this.enable = function() {
        if (! this.enabled) {
            Rui.util.LEvent.addListener(attachTo, event, handleKeyPress);
            this.enabledEvent.fire(keyData);
        }
        /**
         * LTooltip의 활성/비활성 상태를 나태느는 boolean 값
         * @property enabled
         * @type Boolean
         */
        this.enabled = true;
    };
    /**
     * 대상 DOM element로 부터 DOM event listener를 삭제함으로써 LKeyListener를 비활성화 한다.
     * @method disable
     */
    this.disable = function() {
        if (this.enabled) {
            Rui.util.LEvent.removeListener(attachTo, event, handleKeyPress);
            this.disabledEvent.fire(keyData);
        }
        this.enabled = false;
    };
    /**
     * object를 나타내는 문자열을 반환한다.
     * @method toString
     * @return {String}  LKeyListener의 문자열 표현
     */ 
    this.toString = function() {
        return 'LKeyListener [' + keyData.keys + '] ' + attachTo.tagName + (attachTo.id ? '[' + attachTo.id + ']' : '');
    };
};
/**
 * DOM 'keydown' event를 표시하는 상수
 * @property KEYDOWN
 * @static
 * @final
 * @type String
 */
Rui.util.LKeyListener.KEYDOWN = 'keydown';
/**
 * DOM 'keyup' event를 표시하는 상수
 * @property KEYUP
 * @static
 * @final
 * @type String
 */
Rui.util.LKeyListener.KEYUP = 'keyup';
/**
 * Collection 관리를 위한 유틸리티
 * @module util
 * @title LCollection Utility
 * @namespace Rui.util
 * @requires Rui
 */
Rui.namespace("util");
/**
 * LCollection utility.
 * @class LCollection
 * @static
 */
Rui.util.LCollection = function(){
    this.items = [];
    this.keys = [];
    this.map = {};
    this.length = 0;    
};
Rui.util.LCollection.prototype = {
    /**
     * item을 idx위치에 삽입하는 메소드
     * @method insert
     * @param {int} idx 삽입할 위치
     * @param {String} key 키
     * @param {Object} item 입력할 객체
     * @return {void}
     */
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
    /**
     * item을 추가하는 메소드
     * @method add
     * @param {String} key 키
     * @param {Object} item 입력할 객체
     * @return {void}
     */
    add: function(key, item) {
        if (arguments.length == 1) {
            item = key;
            key = key.id ? key.id : null;
        }
        this.keys.push(key);
        this.items.push(item);
        /*this.items.splice(this.length, 0, item);
        this.keys.splice(this.length, 0, key);*/
        this.map[key] = this.length;
        this.length++;
    },
    /**
     * item을 삭제하는 메소드
     * @method remove
     * @param {String} key 키
     * @return {boolean}
     */
    remove: function(key) {
        //var o = this.map[key];
        var idx = this.map[key];
//        var idx = Rui.util.LArray.indexOf(this.keys, key);
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
    /**
     * map의 index 정보를 갱신한다.
     * @method _updateIndex
     * @private
     * @param {int} idx 갱신 위치
     * @return {void}
     */
    _updateIndex: function(idx) {
        for (var i = idx, len = this.length; i < len; i++) {
            var key = this.keys[i];
            this.map[key] = i;
        }
    },
    /**
     * key에 해당하는 item의 위치를 리턴하는 메소드
     * @method indexOfKey
     * @param {String} key 키
     * @return {int}
     */
    indexOfKey: function(key) {
        var idx = this.map[key];
        return (typeof idx === 'undefined') ? -1 : idx;
    },
    /**
     * key에 해당하는 item을 리턴하는 메소드
     * @method get
     * @param {String} key 키
     * @return {Object}
     */
    get: function(key) {
        var idx = this.map[key];
        return this.items[idx];
    },
    /**
     * key에 해당하는 item을 변경하는 메소드
     * @method set
     * @param {String} key 키
     * @param {Object} item 객체
     * @return {Object}
     */
    set: function(key, item) {
        var idx = this.map[key];
        //var oldData = this.items[idx];
        //this.map[key] = item;
        //var idx = Rui.util.LArray.indexOf(this.items, oldData);
        if(idx < 0 || typeof idx === 'undefined') {
            throw new Rui.LException('Collection.set() : IndexOutOfBoundsException['+idx+']');
        }
        this.items[idx] = item;
    },
    /**
     * idx에 해당하는 key값을 리턴하는 메소드
     * @method getKey
     * @param {int} idx 위치
     * @return {String}
     */
    getKey: function(idx) {
        return this.keys[idx];
    },
    /**
     * idx 위치에 해당하는 item을 리턴하는 메소드
     * @method getAt
     * @param {int} idx 위치
     * @return {Object}
     */
    getAt: function(idx) {
        return this.items[idx];
    },
    /**
     * key 값이 존재하는지 여부
     * @method has
     * @param {String} key 키값
     * @return {Object}
     */
    has: function(key) {
        return (typeof this.map[key] !== 'undefined');
    },
    /**
     * 모두 초기화 하는 메소드
     * @method clear
     * @return {void}
     */
    clear: function() {
        this.items = [];
        this.keys = [];
        this.map = {};
        this.length = 0;
    },
    /**
     * items 정보에 해당되는 객체를 Function으로 호출하는 메소드
     * @method each
     * @param {Function} func Array 배열
     * @param {Object} scope Array 배열
     * @return {void}
     */
    each: function(func, scope) {
//        var newItems = [].concat(this.items);
        var count = this.length;
        for (var i = 0 ; i < count; i++) {
            if(func.call(scope || window, this.keys[i], this.items[i], i, count) == false) 
                break;
        }
    },
    /**
     * func에 해당되는 값을 LCollection으로 리턴하는 메소드
     * @method query
     * @param {Function} func Array 배열
     * @param {Object} scope Array 배열
     * @return {Rui.util.LCollection}
     */
    query: function(func, scope) {
        var newData = new Rui.util.LCollection();
        this.each(function(id, item, i, count){
            if(func.call(scope || this, id, item, i) === true) {
                newData.add(id, item);
            }
        }, this);
        
        return newData;
    },
    /**
     * func에 해당되는 값으로 정렬하는 메소드
     * @method sort
     * @param {Function} func Array 배열
     * @param {String} dir 정렬 방향
     * @return {void}
     */
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
    /**
     * 역순 정렬하는 메소드
     * @method reverse
     * @return {void}
     */
    reverse: function() {
        this.items.reverse();
        this._updateIndex(0);
    },
    /**
     * LCollection을 복제하여 리턴하는 메소드
     * @method clone
     * @return {Rui.util.LCollection}
     */
    clone: function() {
        var o = new Rui.util.LCollection();
        var len = this.length;
        for (var i = 0 ; i < len ; i++) {
            var key = this.getKey(i);
            o.insert(i, key, this.get(key));
        }
        return o; 
    },
    /**
     * @description 객체의 toString
     * @method toString
     * @public
     * @return {String}
     */
    toString: function() {
        return 'Rui.util.LCollection ';
    }
};

/**
 * @description LResizeMonitor, autoWidth일 경우 부모가 display none에서 block으로 될때 resize event를 fire한다.
 * 이때 자식들의 sizing을 할 수 있다.
 * @module util
 * @title LResizeMonitor
 * @requires Rui.util.LEventProvider
 */

/**
 * @description LResizeMonitor
 * @namespace Rui.util
 * @class LResizeMonitor
 * @sample default
 * @static
 */
Rui.util.LResizeMonitor = function(config){
    config = config || {};
    Rui.util.LResizeMonitor.superclass.constructor.call(this);
    Rui.applyObject(this, config, true);

    /**
     * 지정한 content가 resized되면 이벤트가 발생된다.
     * @event contentResized
     */
    this.createEvent('contentResized');
};
Rui.extend(Rui.util.LResizeMonitor, Rui.util.LEventProvider, {
    /**
     * @description 객체의 이름
     * @property otype
     * @private
     * @type {String}
     */
    otype: 'Rui.util.LResizeMonitor',
    /**
     * @description monitor target이 resize되었을 경우 실행(iframe을 사용한 트릭)
     * @method onContentResized
     * @private
     * @param {Object} e event객체
     * @return {void}
     */
    onContentResized: function(e){
        //window resize와 중복 실행 방지
        if (this.resizeLock || !this.isNeedResizing()) return;
        this.resizeLock = true;
        this.fireEvent('contentResized', e);
        this.resizeLock = false;
    },
    /**
     * @description window가 resize되었을 경우 실행
     * @method onWindowResized
     * @private
     * @param {Object} e event객체
     * @return {void}
     */
    onWindowResized: function(e){
        //content resize와 중복 실행 방지   
        if(this.resizeLock || !this.isNeedResizing()) return;
        this.resizeLock = true;
        this.fireEvent('contentResized', e);
        this.initFrame();
        this.resizeLock = false;
    },
    /**
     * @description resize할 필요가 있는지 검사, 현재 width값이 0이거나, 이전값하고 같으면 resize 필요 없다.
     * @method isNeedResizing
     * @private
     * @return {Boolean}
     */
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
    /**
     * @description window가 resize되었을 때 hidden 상태일때 content resize를 발생시키기 위해 ifrm초기화(IE전용 문제) 
     * @method initFrame
     * @private
     * @return {void}
     */
    initFrame: function(){
        //window resize가 발생 했을 경우 보이지 않는 content도 content resize가 발생할 수 있도록 iframe을 초기화 한다.
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
    /**
     * @description width auto시 resize가 일어나는지 모니터링하는 target object 설정
     * @method monitor 
     * @public
     * @param {String|Object} target 객체를 붙이고자 하는 Node정보
     * @return {void}
     */
    monitor: function(target){
        //중복 실행 방지.
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
        //ifrm.className = 'L-grid-resize-monitor';
        //dom.appendChild(ifrm);
        wrap.appendChild(ifrm);
        // webkit 계열은 컨테이너 dom이 iframe 자체가 들어가면서 하단에 공백이 생김.
        if(Rui.browser.webkit) dom.style.overflow = 'hidden';
        if (!this.delayTask) {
            this.delayTask = new Rui.util.LDelayedTask(function(){
                //ie는 iframe을 가장 늦게 해석?
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
        //IE의 width auto일때 content size이하로 container width가 안줄어드는 버그(?) 해결
        Rui.util.LEvent.removeListener(dom, 'resize', this.onContentResized);
        Rui.util.LEvent.addListener(dom, 'resize', this.onContentResized, this, true);
    }
});

/**
 * LDelayedTask 클래스는 새로운 타임아웃이 예전 타임아웃을 취소하는 serTimeout를 수행하는
 * method의 실행을 'buffer'하기 위해 쉬운 방법을 제공한다.
 * 취소될때, 타스크는 실행 전에 특정 time period를 기다릴 것이다. 
 * 해당 time period 동안 타스크가 다시 취소된다면, 원래 호출도 취소될 것이다. 
 * 이러한 연속성때문에 함수는 각 반복에 대해 오직 한번만 호출된다.
 * 이 method는 사용자가 텍스트 필드에 타이핑을 마쳤는지의 여부를 확인하는 것 같은
 * 일들에 특별히 유용하다. 
 * 예제로써, 키가 눌렸을때 validation을 수행하는 것이다.
 * 밀리초의 특정 번호에 대한 키입력 이벤트를 버퍼링하기 위해 이 클래스를 사용할수 있으며,
 * 그것들이 그정도의 시간동안 중지하는 경우에만 수행을 한다. 
 * @class LDelayedTask
 * @constructor
 * @sample default
 * @param {Function} fn (optional) 타임아웃에 대한 기본 함수
 * @param {Object} scope (optional) 타임아웃에 대한 기본 scope
 * @param {Array} args (optional) 기본 argument array
 */
Rui.util.LDelayedTask = function(fn, scope, args){
    var me = this,
        id,
        call = function(){
            clearInterval(id);
            id = null;
            fn.apply(scope, args || []);
        };

    /**
     * 보류중인 타임아웃을 취소하고 새로운 것을 큐에 넣는다.
     * @method delay
     * @param {Number} delay 지연을 위한 밀리초
     * @param {Function} newFn (optional) 생성자에 전달될 오버라이딩된 함수
     * @param {Object} newScope (optional) 생성자에 전달될 오버라이딩된 scope
     * @param {Array} newArgs (optional) 생성자에 전달될 오버라이딩된 인자들
     * @return {void}
     */
    me.delay = function(delay, newFn, newScope, newArgs){
        me.cancel();
        fn = newFn || fn;
        scope = newScope || scope;
        args = newArgs || args;
        id = setInterval(call, delay);
    };
    /**
     * 마지막 큐의 타임아웃을 취소한다.
     * @method cancel
     * @return {void}
     */
    me.cancel = function(){
        if(id){
            clearInterval(id);
            id = null;
        }
    };
};
/**
 * @description LFormat
 * @module util
 * @title LFormat
 * @requires Rui
 */
 Rui.namespace('Rui.util');

(function(){
    /**
     * @description LFormat
     * @namespace Rui.util
     * @class LFormat
     * @static
     */
    Rui.util.LFormat = {
        numberFormatFn: [],
        moneyFormatFn: [],
        /**
         * @description String을 Data Object로 변환한다.
         * format 형식은 LDate 객체 참조
         * - config 파라메터가 존재하지 않을 경우 %Y-%m-%d로 파싱한다.
         * - '%Y%m%d', '%Y%m%d%H%M%s', '%X' 포맷의 경우 빠르게 파싱한다.
         * @method stringToDate
         * @static
         * @param {String} sDate
         * @param {Object} config : config.format(strptime), config.locale
         * @return {Date|boolean} parsing에 성공한 경우 Date를 실패한 경우 false를 반환한다.
         */
        stringToDate: function(sDate, config){
            if(sDate){
            	if(sDate.getFullYear) return sDate;
                var r, dates, yyyy, MM, dd, HH, mm, ss;
                if(!config){
                    if(sDate.length !== 10 || sDate.indexOf('-') < 0) return false;
                    //format과 locale이 없으면 default로 변환
                    //java.sql.date의 toString은 yyyy-MM-dd로 return이 된다.
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
        /**
         * @description stringToDate의 기능중 type q에 해당되는 변환이 많이 발생하여 미리 구현해 놓음.
         * type q : '%y%m%d
         * @method stringToDateByTypeQ
         * @static
         * @param {String} sDate
         * @return {Date}
         */
        stringToDateByTypeQ: function(sDate) {
            return Rui.util.LFormat.stringToDate(sDate, { format: '%Y%m%d' });
        },
        /**
         * @description String을 Data Object로 변환한다.
         * java.sql.timestamp의 toString은 yyyy-MM-dd HH:mm:ss.ms로 return되므로 이에 대응.
         * @method stringToTimestamp
         * @static
         * @param {String} sDate
         * @param {Object} oConfig : oConfig.format(strptime), oConfig.locale
         * @return {Date}
         */
        stringToTimestamp: function(sDate, oConfig){
            if(sDate){
            	if(sDate.getFullYear) return sDate;
                if(!oConfig){
                    //format과 locale이 없으면 default로 변환
                    //java.sql.timestamp의 toString은 yyyy-MM-dd HH:mm:ss.ms로 return이 된다.
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
        /**
         * @description Date값을 지정된 포맷 형식으로 변환한다.
         * @method dateToString
         * @static
         * @param {Date} oDate
         * @param {Object} oConfig : oConfig.format(strptime), oConfig.locale
         * @return {String} 지정된 포맷의 날짜
         */
        dateToString: function(oDate, oConfig){
            if(!oDate || (oDate && isNaN(oDate.getDay()))){
                return '';
            }
            return Rui.util.LDate.format(oDate, oConfig);
        },
        /**
         * @description 값을 천단위 구분 쉼표(',')로 표시한다.
         * @method numberFormat
         * @static
         * @param {int} v
         * @param {Object} oConfig 환경 정보 
         * @param {String} locale locale 값 ko_KR 등...
         * <div class='param-option'>
         *   thousandsSeparator {String} 천단위 구분 쉼표
         * </div>
         * @return {String}
         */
        numberFormat: function(v, locale) {
            locale = locale || Rui.getConfig().getFirst('$.core.defaultLocale');
            if(!Rui.util.LFormat.numberFormatFn[locale]) {
                if(!Rui.message.locale[locale])
                    Rui.getMessageManager().load({locale:locale});
                Rui.util.LFormat.numberFormatFn[locale] = Rui.message.locale[locale].numberFormat;
            }
            return Rui.util.LFormat.numberFormatFn[locale].call(this, v);
        },
        /**
         * @description config에서 설정된 default rocale을 참조하여 해당 국가의 통화를 리턴한다.
         * @method moneyFormat
         * @static
         * @param {int} v
         * @param {String} locale locale 값 ko_KR 등...
         * @return {String}
         */
        moneyFormat: function(v, locale) {
            locale = locale || Rui.getConfig().getFirst('$.core.defaultLocale');
            if(!Rui.util.LFormat.moneyFormatFn[locale]) {
                if(!Rui.message.locale[locale])
                    Rui.getMessageManager().load({locale:locale});
                Rui.util.LFormat.moneyFormatFn[locale] = Rui.message.locale[locale].moneyFormat;
            }
            return Rui.util.LFormat.moneyFormatFn[locale].call(this, v);
        },
        /**
         * @description 비율(%)을 표시하고, 소수점자리 수를 지정하면 그 밑으로 반올림하여 해당 소수점을 표시한다.
         * @method rateFormat
         * @static
         * @param {int} v
         * @param {String} rate 비율단위
         * @param {int} point 소수점자리수
         * @return {String}
         */
        rateFormat: function(v, rate, point) {
            var format = new Object();
            format.decimalPlaces = point || {};
            format.suffix = rate;
            return Rui.util.LNumber.format(v, format);
        },
        /**
         * @description 어떤 값을 지정된 포맷 패턴을 사용하여 Time 형식으로 바꾸어준다.
         * @method timeFormat
         * @static
         * @param {String} sTime 595959
         * @param {Object} oConfig : oConfig.format(strptime), oConfig.locale
         * @return {Object}
         */
        timeFormat: function (sTime, oConfig) {
            oConfig = oConfig || {};
            var format = '%Y%m%d%H%M%S';
            if(sTime == null || sTime == undefined || sTime.length == 0)
                return '';
            var length = sTime.length;
            // sTime의 자리수 6자리로 만들기
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
        /**
         * @description 중량 단위를 표시한다.
         * @method weightFormat
         * @static
         * @param {int} v
         * @param {String} unit 중량의 단위 ex.kg, g, mg
         * @param {boolean} thousandsSeparator 천 단위 쉼표
         * @param {int} point 소수점 자리수
         * @return {String}
         */
        weightFormat: function(v, unit, thousandsSeparator, point) {
            var format = new Object();
            format.decimalPlaces = point || {};
            format.suffix = unit || {};
            if(thousandsSeparator) {
                format.thousandsSeparator = ',';
            }
            return Rui.util.LNumber.format(v, format);
        },
        /**
         * @description 길이 단위를 표시한다.
         * @method lengthFormat
         * @static
         * @param {int} v 
         * @param {String} unit 길이 단위 ex.m, km 
         * @param {int} point 소수점 자리수
         * @param {boolean} thousandsSeparator 천 단위 쉼표
         * @return {String}
         */
        lengthFormat: function(v, unit, thousandsSeparator, point) {
            var format = new Object();
            format.decimalPlaces = point || {};
            format.suffix = unit || {};
            if(thousandsSeparator) {
                format.thousandsSeparator = ',';
            }
            return Rui.util.LNumber.format(v, format);
        },
        /**
         * @description LFormat에 등록된 모든 function을 renderer로 처리할 수 있게 해주는 메소드 
         * LFormat에 있는 Function의 arguments는 fnName뒤에 순차적으로 넣으면 됨.
         * <pre><code>
         * Rui.util.LFormat.rendererWrapper('dateToString', {format:'%x'});
         * Rui.util.LRenderer.dateRenderer('%x')
         * 위 두개는 동일한 기능으로 수행 가능
         * </code></pre>
         * @method rendererWrapper
         * @static
         * @param {String} fnName LFormat에 등록된 모든 function명
         * @return {Function}
         */    
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
 /**
 * Renderer
 * @namespace Rui.util
 * @requires Rui
 * @class LRenderer
 * @sample default
 * @static
 */
Rui.util.LRenderer = {
    /**
     * 날짜(date) 형식으로 데이터가 표현되는 랜더러
     * <p>Date형식의 값을 이용하며 locale에 따라 출력될 포맷이 정해진다. </p>
     * @method dateRenderer
     * @static
     * @param {String} format
     * @param {String} locale
     * @return {function}
     */
    dateRenderer: function(format,locale){
        return function(v){
            return Rui.util.LFormat.dateToString(v, {format:format,locale:locale});
        };
    },
    /**
     * 숫자(number) 형식으로 데이터가 표현되는 랜더러
     * <p>천단위 구분기호인 콤마(,)등이 함께 출력된다. </p>
     * @method numberRenderer
     * @static
     * @return {function}
     */
    numberRenderer: function() {
        return function(v){
            return Rui.util.LFormat.numberFormat(v);
        };
    },
    /**
     * 통화(currenty) 문자와 함께 데이터가 표현되는 랜더러
     * <p>locale에 따라서 원화, 달러, 엔화 등이 값과 함계 표현된다.
     * @method moneyRenderer
     * @static
     * @param {String} currency
     * @return {function}
     */
    moneyRenderer: function(currency) {
        return function(v){
            return Rui.util.LFormat.moneyFormat(v, currency);
        };
    },
    /**
     * 비율(rate) 형식으로 데이터를 표현하는데 사용되는 랜더러
     * <p>값과 함께 %가 표현된다.</p>
     * @method rateRenderer
     * @static
     * @param {Object} point
     * @return {function}
     */
    rateRenderer: function(point) {
        return function(v){
            return Rui.util.LFormat.rateFormat(v, '%', point);
        };
    },
    /**
     * 시간(time) 형식으로 데이터를 표현하는데 사용되는 랜더러
     * <p>23:59 형식으로 포맷이 변환되어 표현된다.</p>
     * @method timeRenderer
     * @static
     * @param {Object} format
     * @return {function}
     */
    timeRenderer: function (format) {
        return function(v){
            return Rui.util.LFormat.timeFormat(v, {format:format});
        };
    },
    /**
     * 무게(weight) 단위를 표현하는데 사용되는 랜더러
     * @method weightRenderer
     * @static
     * @param {Object} unit
     * @param {Object} point
     * @param {Object} thousandsSeparator
     * @return {function}
     */
    weightRenderer: function(unit, thousandsSeparator, point) {
        return function(v){
            return Rui.util.LFormat.weightFormat(v, unit, thousandsSeparator, point);
        };
    },
    /**
     * 길이(length) 단위를 표현하는데 사용되는 랜더러
     * @method lengthRenderer
     * @static
     * @param {Object} unit
     * @param {Object} point
     * @param {Object} thousandsSeparator
     * @return {function}
     */
    lengthRenderer: function(unit, thousandsSeparator, point) {
        return function(v){
            return Rui.util.LFormat.lengthFormat(v, unit, thousandsSeparator, point);
        };
    },
    /**
     * 그리드 셀에 팝업 아이콘을 추가하는 랜더러
     * @method popupRenderer
     * @static
     * @return {function}
     */
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
    /**
     * LPlugin
     * @namespace Rui.util
     * @class LPlugin
     * @extends Rui.util.LEventProvider
     * @protected
     * @constructor
     * @param {Object} config 해당 overlay에 대한 집합이어 하는 설정을 포함하는 설정 object literal. 
     * 더 자세한 사항은 설정 문서를 참고 한다.
     */
    Rui.util.LPlugin = function (config) {
        config = config || {};
        Rui.applyObject(this, config, true);
    };
    Rui.extend(Rui.util.LPlugin, Rui.util.LEventProvider, {
        /**
         * @description 플러그인 초기화
         * @method initPlugin
         * @protected
         * @return void
         */
        initPlugin: function(parent) {
            for (m in this) {
                if(m != 'constructor' && m != 'initPlugin' && !Rui.util.LEventProvider.prototype[m] && !Rui.util.LString.startsWith(m, '_')) {
                    parent[m] = this[m];
                }
            }
        },
        /**
         * @description 기능의 값이 바뀌면 호출되는 이벤트(LPlugin 객체가 생성된후 반복 수행됨/이때 이벤트는 탑재해서는 안됨.)
         * @method updatePlugin
         * @protected
         * @return void
         */
        updatePlugin: Rui.emptyFn,
        /**
         * @description 기능의 전체가 수정되면 호출되는 이벤트(LPlugin 객체가 생성된후 한번만 수행됨/이때 이벤트는 탑재해서는 안됨.)
         * @method updatePluginView
         * @protected
         * @return void
         */
        updatePluginView: Rui.emptyFn
    });
}());
/**
 * region은 그리드 상에서의 object의 표시이다.  
 * 이것은 기본적으로 직사각형인 top, right, bottom, left의 범위에 의해 정의된다. 
 * 만약 다른 형태의 모양이 필요한 경우 해당 클래스는 그것을 지원하기 위하여 상속될 수 있다.
 * @module util
 * @namespace Rui.util
 * @class LRegion
 * @param {int} t top 범위
 * @param {int} r right 범위
 * @param {int} b bottom 범위
 * @param {int} l left 범위
 * @constructor
 */
Rui.util.LRegion = function(t, r, b, l) {
    /**
     * region의 top 범위
     * @property top
     * @type Int
     */
    this.top = t;
    /**
     * set/getXY를 가진 대칭에 대한 인덱스로서의 region의 top 범위
     * @property 1
     * @private
     * @type Int
     */
    this[1] = t;
    /**
     * region의 right 범위
     * @property right
     * @type int
     */
    this.right = r;
    /**
     * region의 bottom 범위
     * @property bottom
     * @type Int
     */
    this.bottom = b;
    /**
     * region의 left 범위
     * @property left
     * @type Int
     */
    this.left = l;
    /**
     * set/getXY를 가진 대칭에 대한 인덱스로서의 region의 left 범위
     * @property 0
     * @private
     * @type Int
     */
    this[0] = l;
};
/**
 * 해당 region이 전달된 region을 포함하는 경우 true를 반환한다.
 * @method contains
 * @param  {Region}  region 평가할 region
 * @return {boolean}        region에 해당 region이 포함되어 있으면 true, 아니면 false
 */
Rui.util.LRegion.prototype.contains = function(region) {
    return (
        region.left   >= this.left   && 
        region.right  <= this.right  && 
        region.top    >= this.top    && 
        region.bottom <= this.bottom
    );
};
/**
 * region의 영역을 반환한다.
 * @method getArea
 * @return {int} region의 영역
 */
Rui.util.LRegion.prototype.getArea = function() {
    return ( (this.bottom - this.top) * (this.right - this.left) );
};
/**
 * 해당 region와 중복되는 region에 전달되는 region을 반환한다.
 * @method intersect
 * @param  {Region} region 교차되는 region
 * @return {Region}        중복된 region이나 중복되지 않는 경우 null
 */
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
/**
 * 해당 region과 전달된 region을 둘다 포함하는 가장 작은 영역을 표시하는 
 * region을 반환한다.
 * @method union
 * @param  {Region} region 조합되어 만들기 위한 region
 * @return {Region}        조합된 region
 */
Rui.util.LRegion.prototype.union = function(region) {
    var t = Math.min( this.top,    region.top    );
    var r = Math.max( this.right,  region.right  );
    var b = Math.max( this.bottom, region.bottom );
    var l = Math.min( this.left,   region.left   );
    return new Rui.util.LRegion(t, r, b, l);
};
/**
 * toString
 * @method toString
 * @return region property 문자열
 */
Rui.util.LRegion.prototype.toString = function() {
    return ( 'Region {'    +
         'top: '       + this.top    + 
         ', right: '   + this.right  + 
         ', bottom: '  + this.bottom + 
         ', left: '    + this.left   + 
         '}' );
};
/**
 * DOM element에 의해 차지되는 region을 반환한다.
 * @method getRegion
 * @param  {HTMLElement} el The element
 * @return {Region}         element가 차지하는 region
 * @static
 */
Rui.util.LRegion.getRegion = function(el) {
    var p = Rui.util.LDom.getXY(el);
    var t = p[1];
    var r = p[0] + el.offsetWidth;
    var b = p[1] + el.offsetHeight;
    var l = p[0];
    return new Rui.util.LRegion(t, r, b, l);
};
/**
 * point는 그리드 상에서의 싱글 포인트를 표현하는 특정한 영역이다.
 * @module util
 * @namespace Rui.util
 * @class LPoint
 * @param {int} x point의 X 위치
 * @param {int} y point의 Y 위치
 * @constructor
 * @extends Rui.util.LRegion
 */
Rui.util.LPoint = function(x, y) {
    if (Rui.isArray(x)) { // accept input from Dom.getXY, Event.getXY, etc.
        y = x[1]; // dont blow away x yet
        x = x[0];
    }
    /**
     * right, left나 인덱스가 0인 point의 X 위치(Dom.getXY symmetry에 대한)
     * @property x
     * @type Int
     */
    this.x = this.right = this.left = this[0] = x;
    /**
     * The Y position of the point, which is also the top, bottom and index one (for Dom.getXY symmetry)
     * top, bottom이나 인덱스가 1인 point의 Y 위치(Dom.getXY symmetry에 대한)
     * @property y
     * @type Int
     */
    this.y = this.top = this.bottom = this[1] = y;
};
Rui.util.LPoint.prototype = new Rui.util.LRegion();
/**
 * Utilities for storage management
 * @module storage
 * @title LAbstractProvider Utility
 * @namespace Rui.webdb
 * @requires Rui
 */
Rui.namespace('Rui.webdb');
/**
 * Abstract LAbstractProvider utility. 
 * @namespace Rui.webdb
 * @class LAbstractProvider
 * @extends Rui.util.LEventProvider
 * @constructor LAbstractProvider
 * @param hash {Object} The intial LAbstractProvider.
 */
Rui.webdb.LAbstractProvider = function(){
    /**
     * @description 키와 값을 가지는 속성.
     * @property storage
     * @private
     * @static
     * @type Object
     */
    this.storage = {};
    /**
     * @description 값의 상태가 바뀌면 호출되는 이벤트.
     * @event stateChanged
     * @param {Object} target this객체
     * @param {String} type 변경 종류
     * @param {String} key 키
     * @param {Array|Object} value 값
     */
    this.createEvent('stateChanged');
    
    Rui.webdb.LAbstractProvider.superclass.constructor.call(this);
};
/**
 * @description localStorage를 사용 가능한지 여부를 검사한다.
 * Mobile Safari등의 경우 private browsing등의 이유로 localStorage 사용이 제한될 수 있다. 
 * localStorage가 private browsing의 이유로 막힌경우 다음 오류가 발생한다.
 * "QuotaExceededError: DOM Exception 22: An attempt was made to add something to storage that exceeded the quota."
 * Safari의 보안 옵션에 따라 제한을 해제 할 수 있으나 이 옵션에 관계없이 localStorage를 사용할 수 있는 브라우저인지를 직접 localStorage.setItem을 시도해 이상유무를 검사할 수 있다.
 * @method isLocalStorageSupported
 * @public
 * @static
 * @type boolean
 */
Rui.webdb.LAbstractProvider.isLocalStorageSupported = function(){
    var k = '_rui_ls_test',
        s = window.localStorage;
    try{
    	s.setItem(k, '1'); // storage가 undefined인 경우 브라우져가 지원 안 함, 또한 setItem 하다가 QuotaExceededError가 일어나면 private browsing으로 막혀져 있음
    	s.removeItem(k);
    	return true;
    }catch(e){ return false; }
};
// Copy static members to DataSource class
Rui.extend(Rui.webdb.LAbstractProvider, Rui.util.LEventProvider, {
    /**
     * @description localStorage 사용 여부
     * @property useLocalStorage
     * @private
     * @type boolean
     */
    useLocalStorage: true,
    isLocalStorage: function() {
        return !(typeof localStorage === 'undefined');
    },
    /**
     * @description 상태정보를 얻어오는 메소드
     * @method get
     * @public
     * @param {String} key 상태정보를 얻어오는 키 이름
     * @param {Object} defaultValue 값이 없을 경우 리턴되는 기본값
     * @return {Object} 키 이름에 해당되는 결과 값
     */
    get: function(key, defaultValue){
        var val = (this.useLocalStorage && this.isLocalStorage()) ? localStorage.getItem(key) : this.storage[key];
        return val || defaultValue;
    },
    /**
     * @description 상태정보를 저장하는 메소드
     * @method set
     * @public
     * @param {String} key 저장하고자 하는 키 이름
     * @param {Object} value 저장하고자 하는 키 이름
     * @return {void}
     */
    set: function(key, value){
        if(this.useLocalStorage && this.isLocalStorage()) {
            localStorage.setItem(key, value);
        } else {
            this.storage[key] = value;
        }
        this.fireEvent('stateChanged', { target: this, type:'set', key: key, value: value});
        return this;
    },
    /**
     * @description 상태정보를 삭제하는 메소드
     * @method remove
     * @public
     * @param {String} key 지우고자 하는 키 이름
     * @return {void}
     */
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
    /**
     * @description 상태정보를 모두 삭제하는 메소드
     * @method clear
     * @public
     * @return {void}
     */
    clear: function(){
        if (this.useLocalStorage && this.isLocalStorage())
            localStorage.clear();
        else
            this.storage = {};
        return this;
    }
});

/**
 * Cookie Provider
 * @module storage
 * @title Cookie Provider
 * @namespace Rui.webdb
 */
Rui.namespace('Rui.webdb');

/**
 * Cookie Provider utility.
 * @namespace Rui.webdb
 * @class LCookieProvider
 * @extends Rui.webdb.LAbstractProvider
 * @constructor LCookieProvider
 * @param {Object} oConfig The intial LCookieProvider.
 */
Rui.webdb.LCookieProvider = function(oConfig){
    Rui.webdb.LCookieProvider.superclass.constructor.call(this);
    
    /**
     * domain정보를 가지는 문자열
     * @property domain
     * @type Object
     * @private
     */
    this.domain = null;
    
    /**
     * Cookie 만료 Date 객체
     * @property expires
     * @type {Date}
     * @private
     */
    this.expires = new Date(new Date().getTime() + (1000 * 60 * 60 * 24)); //1 days;
    
    /**
     * Cookie Path
     * @property path
     * @type {String}
     * @private
     */
    this.path = '/';
    
    /**
     * Cookie secure
     * @property secure
     * @type {boolean}
     * @private
     */
    this.secure = false;
    
    var config = oConfig || {};
    
    Rui.applyObject(this, config);
    
    /**
     * @description 키와 값을 가지는 속성.
     * @property storage
     * @private
     * @static
     * @type Object
     */
    this.storage = Rui.util.LCookie._parseCookieString(document.cookie);
};

Rui.extend(Rui.webdb.LCookieProvider, Rui.webdb.LAbstractProvider, {
    /**
     * @description localStorage 사용 여부
     * @property useLocalStorage
     * @private
     * @type boolean
     */
    useLocalStorage: false,
    /**
     * @description 상태정보를 저장하는 메소드
     * @method set
     * @public
     * @param {String} key 저장하고자 하는 키 이름
     * @param {Object} value 저장하고자 하는 키 이름
     * @return {void}
     */
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
    /**
     * @description 상태정보를 삭제하는 메소드
     * @method remove
     * @public
     * @param {String} key 지우고자 하는 키 이름
     * @return {void}
     */
    remove: function(name){
        if (!Rui.isString(name)) {
            throw new TypeError('LCookieProvider.set(): Argument must be an string.');
        }

        Rui.util.LCookie.remove(name);

        Rui.webdb.LCookieProvider.superclass.remove.call(this, name);

        return this;
    }
});

/**
 * Utilities for state management
 * @module storage
 * @title Provider Utility
 * @namespace Rui.webdb
 * @requires Rui
 */
Rui.namespace('Rui.webdb');

/**
 * 각 객체의 state상태를 관리하는 객체
 * @namespace Rui.webdb
 * @class LWebStorage
 * @constructor LWebStorage
 */
Rui.webdb.LWebStorage = function(provider){
    /**
     * @description 현재 provider 객체
     * @property provider
     * @private
     * @type Object
     */
    this.provider = provider;

    if(this.provider == null || !(provider instanceof Rui.webdb.LAbstractProvider)) {
        this.provider = Rui.webdb.LAbstractProvider.isLocalStorageSupported() ? new Rui.webdb.LAbstractProvider() : new Rui.webdb.LCookieProvider();
    }
};

// Copy static members to DataSource class
Rui.webdb.LWebStorage.prototype = {
    /**
     * @description 상태정보를 얻어오는 메소드
     * @method get
     * @public
     * @param {String} key 상태정보를 얻어오는 키 이름
     * @param {Object} defaultValue 값이 없을 경우 리턴되는 기본값
     * @return {Object} 키 이름에 해당되는 결과 값
     */
    get: function(key, defaultValue){
        return this.provider.get(key, defaultValue);
    },
    /**
     * @description 상태정보를 boolean값으로 얻어오는 메소드
     * @method getBoolean
     * @public
     * @param {String} key 상태정보를 얻어오는 키 이름
     * @param {Object} defaultValue 값이 없을 경우 리턴되는 기본값
     * @return {boolean} 키 이름에 해당되는 결과 값
     */
    getBoolean: function(key, defaultValue){
        var v = this.get(key, defaultValue);
        return String(v) == 'true';
    },
    /**
     * @description 상태정보를 Int로 얻어오는 메소드
     * @method getInt
     * @public
     * @param {String} key 상태정보를 얻어오는 키 이름
     * @param {Object} defaultValue 값이 없을 경우 리턴되는 기본값
     * @return {int} 키 이름에 해당되는 결과 값
     */
    getInt: function(key, defaultValue){
        return parseInt(this.get(key, defaultValue), 10);
    },
    /**
     * @description 상태정보를 문자로 얻어오는 메소드
     * @method getString
     * @public
     * @param {String} key 상태정보를 얻어오는 키 이름
     * @param {Object} defaultValue 값이 없을 경우 리턴되는 기본값
     * @return {int} 키 이름에 해당되는 결과 값
     */
    getString: function(key, defaultValue){
        return this.get(key, defaultValue) + '';
    },
    /**
     * @description 상태정보를 저장하는 메소드
     * @method set
     * @public
     * @param {String} key 저장하고자 하는 키 이름
     * @param {Object} value 저장하고자 하는 키 이름
     * @return {void}
     */
    set: function(key, value){
        this.provider.set(key, value);
        return this;
    },
    /**
     * @description 상태정보를 삭제하는 메소드
     * @method remove
     * @public
     * @param {String} key 지우고자 하는 키 이름
     * @return {void}
     */
    remove: function(key){
        this.provider.remove(key);
        return this;
    },
    /**
     * @description 상태정보를 모두 삭제하는 메소드
     * @method clear
     * @public
     * @return {void}
     */
    clear: function(key){
        this.provider.clear(key);
        return this;
    },
    /**
     * @description Provider정보를 셋팅하는 메소드
     * @method setProvider
     * @public
     * @param {String} provider 셋팅하고자 하는 provider
     * @return {void}
     */
    setProvider: function(provider) {
        this.provider = provider;
        return this;
    },
    /**
     * @description Provider정보를 리턴하는 메소드
     * @method getProvider
     * @public
     * @return {Rui.webdb.LAbstractProvider} 선택된 provider 정보
     */
    getProvider: function() {
        return this.provider;
    }
};

/**
 * LConfiguration Provider
 * @module config
 * @title LConfiguration Provider
 * @namespace Rui.config
 * @requires Rui
 */
Rui.namespace('Rui.config');
/**
 * LConfiguration Provider utility.
 * @namespace Rui.config
 * @class LConfigurationProvider
 * @extends Rui.webdb.LAbstractProvider
 * @constructor LConfigurationProvider
 * @param {Object} config The intial LConfigurationProvider.
 */
Rui.config.LConfigurationProvider = function(config){
    Rui.config.LConfigurationProvider.superclass.constructor.call(this);
    /**
     * @description Object data 객체
     * @property data
     * @private
     * @type object
     */
    this.data = null;
    config = config || {};
    Rui.applyObject(this, config, true);
    this.reload();
};

Rui.extend(Rui.config.LConfigurationProvider, Rui.webdb.LAbstractProvider, {
    useLocalStorage: false,
    /**
     * @description 상태정보를 얻어오는 메소드
     * @method get
     * @public
     * @param {String} key 상태정보를 얻어오는 키 이름
     * @param {Object} defaultValue 값이 없을 경우 리턴되는 기본값
     * @return {Object} 키 이름에 해당되는 결과 값
     */
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
    /**
     * @description 상태정보를 저장하는 메소드
     * @method set
     * @public
     * @param {String} key 저장하고자 하는 키 이름
     * @param {Object} value 저장하고자 하는 키 이름
     * @return {void}
     */
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
    /**
     * @description 상태정보를 삭제하는 메소드
     * @method remove
     * @public
     * @param {String} key 지우고자 하는 키 이름
     * @return {void}
     */
    remove: function(name){
        if (!Rui.isString(name)) {
            throw new TypeError('LConfigurationProvider.set(): Argument must be an string.');
        }
        Rui.config.LConfigurationProvider.superclass.remove.call(this, name);
        return this;
    },
    /**
     * @description 상태정보를 다시 읽어드리는 메소드
     * @method reload
     * @public
     * @return {void}
     */
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
    /**
     * @description 상태정보를 읽었는지 여부
     * @method isLoad
     * @public
     * @return {boolean}
     */
    isLoad: function() {
        return this.data && this.data.core ? true : false;
    }
});

/**
 * LConfiguration 유틸리티
 * @module config
 * @title Provider Utility
 * @namespace Rui.config
 * @requires Rui
 */
Rui.namespace('Rui.config');
/**
 * rui_config.js 파일의 정보를 읽어오거나 변경할 수 있는 객체
 * @namespace Rui.config
 * @class LConfiguration
 * @extends Rui.webdb.LWebStorage
 * @sample default
 * @constructor LConfiguration
 */
Rui.config.LConfiguration = function(){
    if(Rui.config.LConfiguration.caller != Rui.config.LConfiguration.getInstance){
        throw new Rui.LException("Can't call the constructor method.", this);
     }
    Rui.config.LConfiguration.superclass.constructor.call(this);
    /**
     * @description provider 객체
     * @property provider
     * @private
     * @type object
     */
    this.provider = new Rui.config.LConfigurationProvider();
};

Rui.config.LConfiguration.instanceObj = null;
/**
 * @description 인스턴스를 얻어오는 메소드
 * @method getInstance
 * @public
 * @static
 * @return {Rui.config.LConfiguration}
 */
Rui.config.LConfiguration.getInstance = function() {
    if(this.instanceObj == null){
        this.instanceObj = new Rui.config.LConfiguration(new Rui.config.LConfigurationProvider());
    }
    return this.instanceObj ;
};
Rui.extend(Rui.config.LConfiguration, Rui.webdb.LWebStorage, {
    /**
     * @description 객체의 문자열
     * @property otype
     * @private
     * @type {String}
     */
    otype: 'Rui.config.LConfiguration',
    /**
     * @description 상태정보를 다시 읽어드리는 메소드
     * @method reload
     * @public
     * @return {void}
     */
    reload: function() {
        this.provider.reload();
        return this;
    },
    /**
     * @description 가장 첫번째 데이터를 리턴한다.
     * @method getFirst
     * @public
     * @return {Object}
     */
    getFirst: function(key, defaultValue) {
        var list = this.get(key);
        if(list != null && list.length > 0) {
            return (Rui.isArray(list)) ? list[0] : list;
        } 
        return defaultValue ? defaultValue : null;
    } 
});

/**
 * @module message
 * @title Rui Global
 * @static
 */
Rui.namespace('Rui.message');

/**
 * 다국어 메시지를 관리하는 기능
 * @namespace Rui.message
 * @class LMessageManager
 * @extends Rui.util.LEventProvider
 * @sample default
 * @constructor LMessageManager
 * @static
 */
Rui.message.LMessageManager = function(oConfig) {
    Rui.message.LMessageManager.superclass.constructor.call(this);
    /**
     * 메시지 데이터를 담아 놓은 객체
     * @property localeData
     * @type Object
     * @private
     */
    this.localeData = {};
    /**
     * 현재 설정된 Locale 정보
     * @property currentLocale
     * @type Object
     * @private
     */
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
    /**
     * @description Core Locale 정보를 읽어올때 발생하는 이벤트
     * @event createRootLocale
     */
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
    /**
     * @description 해당 Locale의 메시지가 없을 경우 서버에서 자동으로 Locale에 해당되는 메시지를 읽어 올지 결정하는 변수
     * @property useAutoLoad
     * @type Boolean
     * @public
     */
    useAutoLoad: true,
    /**
     * @description 해당 Locale의 메시지가 없을 경우 defaultLocale에 해당되는 메시지를 출력할지 결정하는 변수
     * @property useApplyDefaultMessage
     * @type Boolean
     * @public
     */ 
    useApplyDefaultMessage: true,
    /**
     * 현재 셋팅되어 있는 Locale 정보를 변경한다. 
     * @method setLocale
     * @sample default
     * @param {String} currentLocale 변경하고자 하는 locale 정보
     * @return {void}
     */
    setLocale: function(currentLocale) {
        this.currentLocale = currentLocale;
        this.load({locale:this.currentLocale});
        return this;
    },
    /**
     * 메시지 데이터를 직접 추가한다. 
     * @method addLocaleData
     * @sample default
     * @param {Object} localeData 실제 메시지 데이터를 가지는 객체
     * @return {void}
     */
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
    /**
     * 메시지 데이터를 읽어 온다.
     * @method get
     * @sample default
     * @param {Object} name 읽어오고자하는 메시지 키값
     * @param {Array} paramArray 읽어올때 @로 대체될 값
     * @return {String} 결과 메시지
     */
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
//        var re = /@/g;
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
    /**
     * Locale에 해당되는 데이터를 읽어온다.
     * @method load
     * @param {Object} oConfig 읽어올 환경정보를 가지는 객체
     * @return {void}
     */
    load: function(oConfig) {
        oConfig = oConfig ? oConfig : {locale:this.currentLocale};
        this.createRootLocale(oConfig);
        // 업무 메시지 로드
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
    /**
     * Core Locale에 해당되는 데이터를 읽어온다.
     * @method createRootLocale
     * @private
     * @param {Object} oConfig 읽어올 환경정보를 가지는 객체
     * @return {void}
     */
    createRootLocale: function(oConfig) {
        // core 메시지 로드
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

/**
 * HTMLElement에 animation 효과주는 class
 * @module animation
 * @requires event, dom
 */

/**
 * Base animation class는 animation효과들을 주는 interface를 제공한다.
 * <p>Usage: var myAnim = new Rui.fx.LAnim(el, { width: { from: 10, to: 100 } }, 1, Rui.fx.LEasing.easeOut);</p>
 * @class LAnim
 * @namespace Rui.fx
 * @requires Rui.fx.LAnimManager
 * @requires Rui.fx.LEasing
 * @requires Rui.util.LEventProvider
 * @constructor
 * @param {String | HTMLElement} el animation효과가 적용될 element
 * @param {Object} attributes animation효과 관련 attribute, 각 attribute는 object로 to나 by가 정의되어 있다. 이외에 from, units(px)가 있으며 camelCase로 표기한다.  
 * @param {Number} duration (optional, defaults to 1 second) Length of animation (frames or seconds), defaults to time-based
 * @param {Function} method (optional, defaults to Rui.fx.LEasing.easeNone) Computes the values that are applied to the attributes per frame (generally a Rui.fx.LEasing method)
 */
Rui.fx.LAnim = function(config) {
    config = config || {};
    //for Simple Syntax
    if(config.applyTo)
        config.el = config.applyTo;

    this.init(config);
    /**
     * @description animation이 시작되면 호출되는 이벤트
     * @event start
     */
    this.createEvent('start');
    /**
     * @description animation의 매 frame마다 호출되는 이벤트
     * @event tween
     */
    this.createEvent('tween');
    /**
     * @description animation이 종료되면 호출되는 이벤트
     * @event complete
     */
    this.createEvent('complete');

};

Rui.extend(Rui.fx.LAnim, Rui.util.LEventProvider, {
    otype: 'Rui.fx.LAnim',
    patterns: { // cached for performance
        noNegatives: /width|height|opacity|padding/i, // keep at zero or above
        offsetAttribute: /^((width|height)|(top|left))$/, // use offsetValue as default
        defaultUnit: /width|height|top$|bottom$|left$|right$/i, // use 'px' by default
        offsetUnit: /\d+(em|%|en|ex|pt|in|cm|mm|pc)$/i // IE may return these, so convert these to offset
    },
    /**
     * animation의 'method'에 의해 계산된 값을 return
     * @method doMethod
     * @protected
     * @param {String} attr The name of the attribute.
     * @param {Number} start The value this attribute should start from for this animation.
     * @param {Number} end  The value this attribute should end at for this animation.
     * @return {Number} The Value to be applied to the attribute.
     */
    doMethod: function(attr, start, end) {
        return this.method(this.currentFrame, start, end - start, this.totalFrames);
    },
    /**
     * attribute에 값 설정
     * @method setAttribute
     * @protected
     * @param {String} attr attribute명.
     * @param {Number} val attribute에 할당될 값.
     * @param {String} unit 값의 unit ('px', '%', etc.)
     */
    setAttribute: function(attr, val, unit) {
        if ( this.patterns.noNegatives.test(attr) ) {
            val = (val > 0) ? val : 0;
        }
        Rui.util.LDom.setStyle(this.getEl(), attr, val + unit);
    },
    /**
     * attribute의 값 return.
     * @method getAttribute
     * @protected
     * @param {String} attr attribute명
     * @return {Number} val 값
     */
    getAttribute: function(attr) {
        var el = this.getEl();
        var val = Rui.util.LDom.getStyle(el, attr);

        if (val !== 'auto' && !this.patterns.offsetUnit.test(val)) {
            return parseFloat(val);
        }
        
        var a = this.patterns.offsetAttribute.exec(attr) || [];
        var pos = !!( a[3] ); // top or left
        var box = !!( a[2] ); // width or height
        
        // use offsets for width/height and abs pos top/left
        if ( box || (Rui.util.LDom.getStyle(el, 'position') == 'absolute' && pos) ) {
            val = el['offset' + a[0].charAt(0).toUpperCase() + a[0].substr(1)];
        } else { // default to zero for other 'auto'
            val = 0;
        }

        return val;
    },
    /**
     * 기본 unit
     * @method getDefaultUnit
     * @private
     * @param {attr} attr attribute명
     * @return {String} 기본 unit
     */
    getDefaultUnit: function(attr) {
        if ( this.patterns.defaultUnit.test(attr) ) {
           return 'px';
        }
        return '';
    },
    /**
     * animation동안 사용될 실제 값들. subclass를 사용할때만 사용됨.
     * @method setRuntimeAttribute
     * @protected 
     * @param {Object} attr attribute object
     */
    setRuntimeAttribute: function(attr) {
        var start;
        var end;
        var attributes = this.attributes;

        this.runtimeAttributes[attr] = {};
        
        var isset = function(prop) {
            return (typeof prop !== 'undefined');
        };
        
        if ( !isset(attributes[attr]['to']) && !isset(attributes[attr]['by']) ) {
            return false; // note return; nothing to animate to
        }
        
        start = ( isset(attributes[attr]['from']) ) ? attributes[attr]['from'] : this.getAttribute(attr);

        // To beats by, per SMIL 2.1 spec
        if ( isset(attributes[attr]['to']) ){
            end = attributes[attr]['to'];
        }else if( isset(attributes[attr]['by']) ){
            if (start.constructor == Array) {
                end = [];
                for (var i = 0, len = start.length; i < len; ++i) {
                    end[i] = start[i] + attributes[attr]['by'][i] * 1; // times 1 to cast 'by' 
                }
            } else {
                end = start + attributes[attr]['by'] * 1;
            }
        }
        
        this.runtimeAttributes[attr].start = start;
        this.runtimeAttributes[attr].end = end;

        // set units if needed
        this.runtimeAttributes[attr].unit = ( isset(attributes[attr].unit) ) ? attributes[attr]['unit'] : this.getDefaultUnit(attr);
        return true;
    },

    /**
     * Constructor for LAnim instance.
     * @method init
     * @private
     * @param {String | HTMLElement} el animate될 element
     * @param {Object} attributes animation효과 관련 attribute, 각 attribute는 object로 to나 by가 정의되어 있다. 이외에 from, units(px)가 있으며 camelCase로 표기한다.
     * @param {Number} duration (optional, defaults to 1 second) Length of animation (frames or seconds), defaults to time-based
     * @param {Function} method (optional, defaults to Rui.fx.LEasing.easeNone) Computes the values that are applied to the attributes per frame (generally a Rui.fx.LEasing method)
     */ 
    init: function(config) {
        /**
         * animation이 작동될 지 여부
         * @property isAnimated
         * @private
         * @type Boolean
         */
        var isAnimated = false;
        /**
         * animation 시작시 생성되는 date object
         * @property startTime
         * @private
         * @type Date
         */
        var startTime = null;
        /**
         * animation 실행시 보여질 frame 수
         * @property actualFrames
         * @private
         * @type Int
         */
        var actualFrames = 0; 
        /**
         * animate될 element
         * @property el
         * @private
         * @type HTMLElement
         */
        var el = config.el ? Rui.util.LDom.get(config.el) : null;
        /**
         * animate될 attribute들의 collection  
         * 각 attribute들은 적어도 'to' 또는 'by'가 정의되어 있어야 한다.  
         * 'to'를 설정하면 해당 값으로 animation이 끝난다.  
         * 'by'를 설정하면 시작값에 해당 값을 더해서 animation이 끝난다. 
         * 둘다 설정하면 'to'만 사용되고 'by'는 무시된다. 
         * option으로 'from'은 animation시작값으로 기본값은 현재 값이다. 그리고 'unit'은 값들의 단위를 지정한다.
         * @property attributes
         * @private
         * @type Object
         */
        this.attributes = config.attributes || {};
        /**
         * animation 시간으로 기본값은 '1'(초)
         * @property duration
         * @private
         * @type Number
         */
        this.duration = !Rui.isUndefined(config.duration) ? config.duration : 1;
        /**
         * animation동안 attribute에 제공될 값을 만드는 method 
         * Default는 'Rui.fx.LEasing.easeNone'.
         * @property method
         * @private
         * @type Function
         */
        this.method = config.method || Rui.fx.LEasing.easeNone;
        /**
         * duration에 초를 사용할 지 여부
         * Defaults to true.
         * @property useSeconds
         * @private
         * @type Boolean
         */
        this.useSeconds = true; // default to seconds
        /**
         * timeline에서 현재 animation의 위치
         * time-based animation에서 LAnimManager에 의해 animation이 제시간에 끝났는지 확인용으로 사용된다.
         * @property currentFrame
         * @private
         * @type Int
         */
        this.currentFrame = 0;
        /**
         * 실행될 총 frame수
         * time-based animation에서 LAnimManager에 의해 animation이 제시간에 끝났는지 확인용으로 사용된다.
         * @property totalFrames
         * @private
         * @type Int
         */
        this.totalFrames = Rui.fx.LAnimManager.fps;
        /**
         * animate될 element를 변경한다.
         * @method setEl
         * @protected
         * @param {HTMLElement} el
         */
        this.setEl = function(element) {
            el = Rui.util.LDom.get(element);
        };
        /**
         * animate될 element를 return
         * @method getEl
         * @protected
         * @return {HTMLElement}
         */
        this.getEl = function() { return el; };
        /**
         * animate되고 있는지 여부 return
         * @method isAnimated
         * @protected
         * @return {boolean} isAnimated의 현재 값     
         */
        this.isAnimated = function() {
            return isAnimated;
        };
        /**
         * animation 시작 시간 return
         * @method getStartTime
         * @protected
         * @return {Date} 시작시간      
         */
        this.getStartTime = function() {
            return startTime;
        };        
        this.runtimeAttributes = {};
        /**
         * animation manager에 등록하면서 animation을 시작한다. 
         * @method animate
         */
        this.animate = function() {
            if ( this.isAnimated() || !el) {
                return false;
            }
            
            this.currentFrame = 0;
            
            this.totalFrames = ( this.useSeconds ) ? Math.ceil(Rui.fx.LAnimManager.fps * this.duration) : this.duration;
    
            if (this.duration === 0 && this.useSeconds) { // jump to last frame if zero second duration 
                this.totalFrames = 1; 
            }
            Rui.fx.LAnimManager.registerElement(this);
            return true;
        };
        /**
         * animation을 정지한다.  일반적으로 animation이 끝났을 경우 LAnimManager에 의해 call된다.
         * @method stop
         * @param {boolean} finish (optional) true면 마지막 frame로 이동한다.
         */ 
        this.stop = function(finish) {
            if (!this.isAnimated()) { // nothing to stop
                return false;
            }

            if (finish) {
                 this.currentFrame = this.totalFrames;
                 this.tween();
            }
            Rui.fx.LAnimManager.stop(this);
        };
        /**
         * animation을 시작한다.
         * @method start
         * @protected
         */
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
        /**
         * 각각의 animated attribute에 대한 시작값, 종료값을 각 프레임 별로 넣고, 결과값을 각 attribute에 적용한다.
         * @protected
         */
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
        /**
         * animation을 종료한다.
         * @method complete
         * @protected
         */
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
    /**
     * LAnim instance에 대한 이름
     * @method toString
     * @public
     * @return {String}
     */
    toString: function() {
        var el = this.getEl() || {};
        var id = el.id || el.tagName;
        return (this.otype + ': ' + id);
    }
});

/**
 * animation과 theading 처리
 * LAnim과 subclass 들에서 사용됨
 * @class LAnimManager
 * @private
 * @static
 * @namespace Rui.fx
 */
Rui.fx.LAnimManager = new function() {
    /** 
     * animation Interval을 위한 참조값.
     * @property thread
     * @private
     * @type Int
     */
    var thread = null;
    /** 
     * 등록된 animation object들 중 현재 queue object.
     * @property queue
     * @private
     * @type Array
     */    
    var queue = [];
    /** 
     * 활성화(active)된 animation 갯수.
     * @property tweenCount
     * @private
     * @type Int
     */        
    var tweenCount = 0;
    /** 
     * 기본 frame 비율 (frames per second).
     * 더 나은 x-browser calibration을 위해 임의로 증가(느린 브라우저들은 frame이 더 떨어짐)
     * @property fps
     * @type Int
     * 
     */
    this.fps = 1000;
    /** 
     * milliseconds 단위의 지연 간격, 가능한 가장 빠른 속도로 deafult 설정된다.
     * @property delay
     * @private
     * @type Int
     */
    this.delay = 1;
    /**
     * animation queue에 animation instance를 추가한다. 
     * 모든 animation instance는 움직이기 위해 반드시 등록되어야 한다.
     * @method registerElement
     * @private
     * @param {object} tween 등록될 LAnim instance 객체 
     */
    this.registerElement = function(tween) {
        queue[queue.length] = tween;
        tweenCount += 1;
        tween.start();
        this.start();
    };
    /**
     * animation queue로 부터 animation instace를 제거한다.
     * 모든 animation instance는 움직이기 위해 반드시 등록되어야 한다.
     * @method unRegister
     * @private
     * @param {object} tween 등록된 LAnim instance 객체 
     * @param {int} index LAnim instance의 index
     */
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
    /**
     * animation thread를 시작한다.
     * 한번에 오직 하나의 thread만 실행할 수 있다.
     * @method start
     * @protected
     */    
    this.start = function() {
        if (thread === null) {
            thread = setInterval(this.run, this.delay);
        }
    };
    /**
     * animation thread나 특정 animation instance를 중지한다.
     * @method stop
     * @protected
     * @param {object} tween 중지할 특정 LAnim instance(optional)
     * 만약 instance가 주어지지 않는다면, Manager는 thread와 모든 animation을 중지한다.
     */    
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
    /**
     * 각각의 animation frame를 처리하는 간격마다 호출된다.
     * @method run
     * @private
     */    
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
                return i; // note return;
            }
        }
        return -1;
    };
    /**
     * animation을 제시간으로 유지하기 위한 fly frame correction.
     * @method correctFrame
     * @private
     * @param {Object} tween The LAnim instance being corrected.
     */
    var correctFrame = function(tween) {
        var frames = tween.totalFrames;
        var frame = tween.currentFrame;
        var expected = (tween.currentFrame * tween.duration * 1000 / tween.totalFrames);
        var elapsed = (new Date() - tween.getStartTime());
        var tweak = 0;
        
        if (elapsed < tween.duration * 1000) { // check if falling behind
            tweak = Math.round((elapsed / expected - 1) * tween.currentFrame);
        } else { // went over duration, so jump to end
            tweak = frames - (frame + 1); 
        }
        if (tweak > 0 && isFinite(tweak)) { // adjust if needed
            if (tween.currentFrame + tweak >= frames) {// dont go past last frame
                tweak = frames - (frame + 1);
            }
            tween.currentFrame += tweak;      
        }
    };
};

/**
 * 처음부터 끝까지 어떻게 animation을 진행할지 결정하는 Singleton 패턴
 * @class LEasing
 * @namespace Rui.fx
 * @static
*/
Rui.fx.LEasing = {
    /**
     * point들 간의 speed를 통일한다. 
     * @method easeNone
     * @static
     * @param {Number} t 현재값을 계산하기 위해 사용되는 시간값
     * @param {Number} b 시작값
     * @param {Number} c 시작값과 종료값 사이의 Delta
     * @param {Number} d animation 총 길이
     * @return {Number} 현재 animation 프레임에 대한 계산된 값
     */
    easeNone: function (t, b, c, d) {
        return c*t/d + b;
    },
    /**
     * 끝쪽을 향하여 천천히 가속하기 시작한다.
     * @method easeIn
     * @static
     * @param {Number} t 현재값을 계산하기 위해 사용되는 시간값
     * @param {Number} b 시작값
     * @param {Number} c 시작값과 종료값 사이의 Delta
     * @param {Number} d animation 총 길이
     * @return {Number} 현재 animation 프레임에 대한 계산된 값
     */
    easeIn: function (t, b, c, d) {
        return c*(t/=d)*t + b;
    },
    /**
     * 끝쪽을 향하여 빠르게 감속하기 시작한다.
     * @method easeOut
     * @static
     * @param {Number} t 현재값을 계산하기 위해 사용되는 시간값
     * @param {Number} b 시작값
     * @param {Number} c 시작값과 종료값 사이의 Delta
     * @param {Number} d animation 총 길이
     * @return {Number} 현재 animation 프레임에 대한 계산된 값
     */
    easeOut: function (t, b, c, d) {
        return -c *(t/=d)*(t-2) + b;
    },
    /**
     * 끝쪽을 향하여 천천히 감속하기 시작한다.
     * @method easeBoth
     * @static
     * @param {Number} t 현재값을 계산하기 위해 사용되는 시간값
     * @param {Number} b 시작값
     * @param {Number} c 시작값과 종료값 사이의 Delta
     * @param {Number} d animation 총 길이
     * @return {Number} 현재 animation 프레임에 대한 계산된 값
     */
    easeBoth: function (t, b, c, d) {
        if ((t/=d/2) < 1) {
            return c/2*t*t + b;
        }
        return -c/2 * ((--t)*(t-2) - 1) + b;
    },
    /**
     * 끝쪽을 향하여 천천히 가속하기 시작한다.
     * @method easeInStrong
     * @static
     * @param {Number} t 현재값을 계산하기 위해 사용되는 시간값
     * @param {Number} b 시작값
     * @param {Number} c 시작값과 종료값 사이의 Delta
     * @param {Number} d animation 총 길이
     * @return {Number} 현재 animation 프레임에 대한 계산된 값
     */
    easeInStrong: function (t, b, c, d) {
        return c*(t/=d)*t*t*t + b;
    },
    /**
     * 끝쪽을 향하여 빠르게 감속하기 시작한다. 
     * @method easeOutStrong
     * @static
     * @param {Number} t 현재값을 계산하기 위해 사용되는 시간값
     * @param {Number} b 시작값
     * @param {Number} c 시작값과 종료값 사이의 Delta
     * @param {Number} d animation 총 길이
     * @return {Number} 현재 animation 프레임에 대한 계산된 값
     */
    easeOutStrong: function (t, b, c, d) {
        return -c * ((t=t/d-1)*t*t*t - 1) + b;
    },
    /**
     * 끝쪽을 향하여 천천히 감속하기 시작한다.
     * @method easeBothStrong
     * @static
     * @param {Number} t 현재값을 계산하기 위해 사용되는 시간값
     * @param {Number} b 시작값
     * @param {Number} c 시작값과 종료값 사이의 Delta
     * @param {Number} d animation 총 길이
     * @return {Number} 현재 animation 프레임에 대한 계산된 값
     */
    easeBothStrong: function (t, b, c, d) {
        if ((t/=d/2) < 1) {
            return c/2*t*t*t*t + b;
        }
        return -c/2 * ((t-=2)*t*t*t - 2) + b;
    },
    /**
     * 탄성 효과 snap in
     * @method elasticIn
     * @static
     * @param {Number} t 현재값을 계산하기 위해 사용되는 시간값
     * @param {Number} b 시작값
     * @param {Number} c 시작값과 종료값 사이의 Delta
     * @param {Number} d animation 총 길이
     * @param {Number} a 진폭 (optional)
     * @param {Number} p 주기 (optional)
     * @return {Number} 현재 animation 프레임에 대한 계산된 값
     */
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
    /**
     * 탄성 효과 snap out
     * @method elasticOut
     * @static
     * @param {Number} t 현재값을 계산하기 위해 사용되는 시간값
     * @param {Number} b 시작값
     * @param {Number} c 시작값과 종료값 사이의 Delta
     * @param {Number} d animation 총 길이
     * @param {Number} a 진폭 (optional)
     * @param {Number} p 주기 (optional)
     * @return {Number} 현재 animation 프레임에 대한 계산된 값
     */
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
    /**
     * 탄성 효과 snap both
     * @method elasticBoth
     * @static
     * @param {Number} t 현재값을 계산하기 위해 사용되는 시간값
     * @param {Number} b 시작값
     * @param {Number} c 시작값과 종료값 사이의 Delta
     * @param {Number} d animation 총 길이
     * @param {Number} a 진폭 (optional)
     * @param {Number} p 주기 (optional)
     * @return {Number} 현재 animation 프레임에 대한 계산된 값
     */
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
    /**
     * Backtracks slightly, then reverses direction and moves to end.
     * @method backIn
     * @static
     * @param {Number} t 현재값을 계산하기 위해 사용되는 시간값
     * @param {Number} b 시작값
     * @param {Number} c 시작값과 종료값 사이의 Delta
     * @param {Number} d animation 총 길이
     * @param {Number} s Overshoot (optional)
     * @return {Number} 현재 animation 프레임에 대한 계산된 값
     */
    backIn: function (t, b, c, d, s) {
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        return c*(t/=d)*t*((s+1)*t - s) + b;
    },
    /**
     * Overshoots end, then reverses and comes back to end.
     * @method backOut
     * @static
     * @param {Number} t 현재값을 계산하기 위해 사용되는 시간값
     * @param {Number} b 시작값
     * @param {Number} c 시작값과 종료값 사이의 Delta
     * @param {Number} d animation 총 길이
     * @param {Number} s Overshoot (optional)
     * @return {Number} 현재 animation 프레임에 대한 계산된 값
     */
    backOut: function (t, b, c, d, s) {
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    },
    /**
     * Backtracks slightly, then reverses direction, overshoots end, 
     * then reverses and comes back to end.
     * @method backBoth
     * @static
     * @param {Number} t 현재값을 계산하기 위해 사용되는 시간값
     * @param {Number} b 시작값
     * @param {Number} c 시작값과 종료값 사이의 Delta
     * @param {Number} d animation 총 길이
     * @param {Number} s Overshoot (optional)
     * @return {Number} 현재 animation 프레임에 대한 계산된 값
     */
    backBoth: function (t, b, c, d, s) {
        if (typeof s == 'undefined') {
            s = 1.70158; 
        }
        if ((t /= d/2 ) < 1) {
            return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        }
        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    },
    /**
     * Bounce off of start.
     * @method bounceIn
     * @static
     * @param {Number} t 현재값을 계산하기 위해 사용되는 시간값
     * @param {Number} b 시작값
     * @param {Number} c 시작값과 종료값 사이의 Delta
     * @param {Number} d animation 총 길이
     * @return {Number} 현재 animation 프레임에 대한 계산된 값
     */
    bounceIn: function (t, b, c, d) {
        return c - Rui.fx.LEasing.bounceOut(d-t, 0, c, d) + b;
    },
    /**
     * Bounces off end.
     * @method bounceOut
     * @static
     * @param {Number} t 현재값을 계산하기 위해 사용되는 시간값
     * @param {Number} b 시작값
     * @param {Number} c 시작값과 종료값 사이의 Delta
     * @param {Number} d animation 총 길이
     * @return {Number} 현재 animation 프레임에 대한 계산된 값
     */
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
    /**
     * Bounces off start and end.
     * @method bounceBoth
     * @static
     * @param {Number} t 현재값을 계산하기 위해 사용되는 시간값
     * @param {Number} b 시작값
     * @param {Number} c 시작값과 종료값 사이의 Delta
     * @param {Number} d animation 총 길이
     * @return {Number} 현재 animation 프레임에 대한 계산된 값
     */
    bounceBoth: function (t, b, c, d) {
        if (t < d/2) {
            return Rui.fx.LEasing.bounceIn(t*2, 0, c, d) * .5 + b;
        }
        return Rui.fx.LEasing.bounceOut(t*2-d, 0, c, d) * .5 + c*.5 + b;
    }
};
/**
 * 'attribute'의 'points' member에 의해 정의된 경로를 따라 element들을 이동하기 위한 LAnim subclass.
 * 모든 'points'는 x, y 좌표 배열이다.
 * <p>Usage: <code>var myAnim = new Rui.fx.LMotionAnim(el, { points: { to: [800, 800] } }, 1, Rui.fx.LEasing.easeOut);</code></p>
 * @class LMotionAnim
 * @namespace Rui.fx
 * @requires Rui.fx.LAnim
 * @requires Rui.fx.LAnimManager
 * @requires Rui.fx.LEasing
 * @requires Rui.fx.LBezier
 * @requires Rui.util.LDom
 * @constructor
 * @extends Rui.fx.LAnim
 * @param {String | HTMLElement} el animated 되어질 element에 대한 참조
 * @param {Object} attributes animated될 attribute  
 * 각각의 attribute는 최소한 'to'나 'by' member가 정의된 object이다.
 * 추가적인 옵션 member들은 'from'(defaults to current value)과 'unit'(defaults to 'px') 이다.
 * 모든 attribute 이름은 camelCase 방식을 사용한다.
 * @param {Number} duration (optional, 기본값 1초) animation의 길이 (frames or seconds), defaults to time-based
 * @param {Function} method (optional, Rui.fx.LEasing.easeNone 기본값) 각 frame별 attribute에 적용되는 값을 계산 (일반적으로 Rui.fx.LEasing method)
 */
Rui.fx.LMotionAnim = function(config) {
    config = config || {};
    if (config.el || config.applyTo) { // dont break existing subclasses not using Rui.extend
        Rui.fx.LMotionAnim.superclass.constructor.call(this, config);
    }
    this.patterns.points = /^points$/i;
};
Rui.extend(Rui.fx.LMotionAnim, Rui.fx.LAnim, {
    otype: 'Rui.fx.LMotionAnim',
    /**
     * @description attribute값 설정
     * @method setAttribute
     * @protected
     * @param {Object} attr
     * @param {Object} value
     * @param {Object} unit
     * @return {void}
     */
    setAttribute: function(attr, val, unit) {
        if (this.patterns.points.test(attr)) {
            unit = unit || 'px';
            Rui.fx.LMotionAnim.superclass.setAttribute.call(this, 'left', val[0], unit);
            val[1] ? Rui.fx.LMotionAnim.superclass.setAttribute.call(this, 'top', val[1], unit) : '';
        } else {
            Rui.fx.LMotionAnim.superclass.setAttribute.call(this, attr, val, unit);
        }
    },
    /**
     * @description attribute값 반환
     * @method getAttribute
     * @protected
     * @param {Object} attr
     * @param {Object} value
     * @param {Object} unit
     * @return {void}
     */
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
    /**
     * @description animation의 'method'에 의해 계산된 값을 반환
     * @method doMethod
     * @private
     * @param {String} attr attribute명
     * @param {Number} start The value this attribute should start from for this animation.
     * @param {Number} end  The value this attribute should end at for this animation.
     * @return {Number} The Value to be applied to the attribute.
     */
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
    /**
     * @description animation동안 사용될 실제 값들.
     * @method setRuntimeAttribute
     * @private 
     * @param {Object} attr attribute object
     */
    setRuntimeAttribute: function(attr) {
        if ( this.patterns.points.test(attr) ) {
            var el = this.getEl();
            var attributes = this.attributes;
            var start;
            var control = attributes['points']['control'] || [];
            var end;
            var i, len;
            var Dom = Rui.util.LDom;
            
            if (control.length > 0 && !(control[0] instanceof Array) ) { // could be single point or array of points
                control = [control];
            } else { // break reference to attributes.points.control
                var tmp = []; 
                for (i = 0, len = control.length; i< len; ++i) {
                    tmp[i] = control[i];
                }
                control = tmp;
            }

            if (Dom.getStyle(el, 'position') == 'static') { // default to relative
                Dom.setStyle(el, 'position', 'relative');
            }

            if ( this.isset(attributes['points']['from']) ) {
                Dom.setXY(el, attributes['points']['from']); // set position to from point
            } 
            else { Dom.setXY( el, Dom.getXY(el) ); } // set it to current position

            start = this.getAttribute('points'); // get actual top & left

            // TO beats BY, per SMIL 2.1 spec
            if ( this.isset(attributes['points']['to']) ) {
                end = this.translateValues(attributes['points']['to'], start);
//                    var pageXY = Dom.getXY(this.getEl());
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

/**
 * control point 들의 숫자에 대한 LBezier spline 들을 계산하기 위하여 사용된다.
 * @class LBezier
 * @namespace Rui.fx
 */
Rui.fx.LBezier = new function() {
    /**
     * t 에 기반한 animated element의 현재 위치를 가져온다.
     * 각각의 point는 'x'와 'y' 값들의 array 이다. (0 = x, 1 = y)
     * 적어도 start와 end의 2개 point가  필요하다.
     * 처음 point는 start이며, 마지막 point는 end이다. 
     * 추가적인 control point들은 옵션이다.
     * @method getPosition
     * @protected
     * @param {Array} points LBezier point들을 포함하고 있는 array
     * @param {Number} t 현재 위치를 지정하기 위한 기본이 되는 0에서 1사이의 숫자
     * @return {Array} 정수 x와 y member data를 포함하는 array
     */
    this.getPosition = function(points, t) {
        var n = points.length;
        var tmp = [];
        for (var i = 0; i < n; ++i){
            tmp[i] = [points[i][0], points[i][1]]; // save input
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
/**
 * 드래그드랍 유틸리티는 드래그드랍 어플케이션을 만드는데 대한 프레임웍을 제공한다.
 * 특정 element에 대하여 드래그드랍을 활성화 하는 것에 더하여, 
 * 드래그드랍 element들이 매니저 클래스에 의하여 추적되고, 다양한 element들
 * 사이에 상호작용이 드래그 동안 추적되고 구현 코드들은 이러한 중요한 순간들에
 * 대하여 통지를 받는다.
 * @module dragdrop
 * @title Drag and Drop
 * @requires dom,event
 */

// Only load the library once.  Rewriting the manager class would orphan 
// existing drag and drop instances.
if(!Rui.dd.LDragDropManager){

/**
 * LDragDropManager는 window에서 모든 LDragDrop 항목에 대한 element 상호작용을
 * 추적하는 싱글턴 패턴이다.
 * 일반적으로 이 클래스를 직접 호출하지는 않겠지만, 이것은 LDragDrop에
 * 유용할 수 있는 도움을 주는 method를 가진다. 
 * @class LDragDropManager
 * @static
 * @private
 * @namespace Rui.dd
 */
Rui.dd.LDragDropManager = function(){

    var Event = Rui.util.LEvent,
        Dom = Rui.util.LDom;

    return {
        /**
        * 이 property는 모든 LDragDrop 인스턴스에서의 shim element의 광범위한 사용 전환에 사용된다,
        * 기본적으로 backcompat에 대해 false이다.(사용법: Rui.dd.LDDM.useShim = true)
        * @property useShim
        * @type Boolean
        * @static
        */
        useShim: false,
        /**
        * 이 property는 shim이 화면 상에 활성화 되어 있는지 여부를 결정하는데 사용되며, 기본적으로 false이다.
        * @private
        * @property _shimActive
        * @type Boolean
        * @static
        */
        _shimActive: false,
        /**
        * 이 property는 LDDM.useShim의 현재 상태를 저장하기 위한 LDragDrop object에
        * useShim이 설정될 때 사용되며 이것은 드래그 작업이 완료되었을때 재설정 될 수 있다.
        * @private
        * @property _shimState
        * @type Boolean
        * @static
        */
        _shimState: false,
        /**
        * 이 property는 useShim이 true로 설정될 때 사용되며, 이것은 디버깅에 대한
        * shim의 opacity를 .5로 설정할 것이다. (사용법: Rui.dd.LDDM._debugShim = true;)
        * @private
        * @property _debugShim
        * @type Boolean
        * @static
        */
        _debugShim: false,
        /**
        * shim element를 생성할 method(L-ddm-shim의 id가 주어진), 이것은 또한 mousemove와
        * mouseup listener에 붙으며, window에 스크롤 listener에 붙는다.
        * @private
        * @method _createShim
        * @static
        */
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
        /**
        * window 스크롤 event와 활성화로부터 호출된 shim의 사이즈를 변경한다.
        * @private
        * @method _sizeShim
        * @static
        */
        _sizeShim: function(){
            if(this._shimActive){
                var s = this._shim;
                s.style.height = Dom.getDocumentHeight() + 'px';
                s.style.width = Dom.getDocumentWidth() + 'px';
                s.style.top = '0';
                s.style.left = '0';
            }
        },
        /**
        * 이 method는 필요한 경우 shim element를 생성하고 shim element를 보여주며,
        * element의 사이즈를 변경하고 true로 _shimActive property를 설정한다.
        * @private
        * @method _activateShim
        * @static
        */
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
        /**
        * shim element를 숨기고 _shimActive property를 false로 설정한다.
        * @private
        * @method _deactivateShim
        * @static
        */
        _deactivateShim: function(){
            this._shim.style.display = 'none';
            this._shimActive = false;
        },
        /**
        * 마우스 이동을 추적하기 위해 document위에 shim으로써 사용하기 위해 만들어진 HTML element
        * @private
        * @property _shim
        * @type HTMLElement
        * @static
        */
        _shim: null,
        /**
         * 등록된 LDragDrop object들의 2차원 배열. 첫번재 차원은
         * LDragDrop 항목 그룹이며, 두번째는 LDragDrop object이다.
         * @property ids
         * @type {string: string}
         * @private
         * @static
         */
        ids: {},

        /**
         * 드래그 handle들에 의해 정의된 element id들의 array.
         * html element 자신이 아닌 실제 handle인 mousedown event를 생성한 element인지에
         * 대한 여부를 결정하는데 사용된다.
         * @property handleIds
         * @type {string: string}
         * @private
         * @static
         */
        handleIds: {},

        /**
         * 현재 드래그 되고 있는 LDragDrop object
         * @property dragCurrent
         * @type LDragDrop
         * @private
         * @static
         **/
        dragCurrent: null,

        /**
         * 위에 떠 있는 LDragDrop object(s)
         * @property dragOvers
         * @type Array
         * @private
         * @static
         */
        dragOvers: {},

        /**
         * 커서와 드래그 되고 있는 object 사이의 X 거리
         * @property deltaX
         * @type int
         * @private
         * @static
         */
        deltaX: 0,

        /**
         * 커서와 드래그 되고 있는 object 사이의 Y 거리
         * @property deltaY
         * @type int
         * @private
         * @static
         */
        deltaY: 0,

        /**
         * 정의한 event들의 기본 작업을 막아야 할지에 대한 여부를 결정하기 위한 flag.
         * 기본적으로 true 이지만, 기본 작업을 원하는 경우 false로 설정할 수 있다.(추천하지는 않음)
         * @property preventDefault
         * @type boolean
         * @static
         */
        preventDefault: true,

        /**
         * 생성한 event들의 전파를 그만두어야 할지에 대한 여부를 결정하기 위한 flag.
         * 기본적으로 true 이지만 마우스 클릭이 필요한 다른 특징을 포함하는
         * html element인 경우 false로 설정하고자 할 수도 있다.
         * @property stopPropagation
         * @type boolean
         * @static
         */
        stopPropagation: true,

        /**
         * 드래그와 드랍이 초기화 되었을때 true로 설정된 내부적인 flag.
         * @property initialized
         * @private
         * @static
         */
        initialized: false,

        /**
         * 모든 드래그와 드랍은 비활성화 될 수 있다.
         * @property locked
         * @private
         * @static
         */
        locked: false,

        /**
         * 상호작용의 현재 집합에 대한 추가적인 정보를 제공한다.
         * event hanlder들로부터 액세스될 수 있다.
         * 이것은 다음과 같은 property들을 포함한다:
         * <pre>
         *
         *       out:       onDragOut interactions
         *       enter:     onDragEnter interactions
         *       over:      onDragOver interactions
         *       drop:      onDragDrop interactions
         *       point:     커서의 위치
         *       draggedRegion: interaction시 드래그된 element의 위치
         *       sourceRegion: interaction시 source element의 위치
         *       validDrop: boolean
         * </pre>
         * @property interactionInfo
         * @type object
         * @static
         */
        interactionInfo: null,

        /**
         * element가 등록된 처음에 호출된다.
         * @method init
         * @private
         * @static
         */
        init: function(){
            this.initialized = true;
        },

        /**
         * point 모드에서 드래그드랍 상호작용은 드래그드랍 동안 커서의 위치에 의해 정의된다.
         * @property POINT
         * @type int
         * @static
         * @final
         */
        POINT: 0,

        /**
         * intersect에서 드래그드랍 상호작용은 커서 위치나 두개 혹은 그 이상의
         * 드래그드랍 object들의 overlap 양에 의해 정의된다.
         * @property INTERSECT
         * @type int
         * @static
         * @final
         */
        INTERSECT: 1,

        /**
         * intersect에서 드래그드랍 상호작용은 두개 혹은 그 이상의
         * 드래그드랍 object들의 overlap에 의해서만 정의된다.
         * @property STRICT_INTERSECT
         * @type int
         * @static
         * @final
         */
        STRICT_INTERSECT: 2,

        /**
         * The current drag and drop mode.  Default: POINT
         * @property mode
         * @type int
         * @static
         */
        mode: 0,

        /**
         * 모드 드래그드랍 object들의 method를 실행한다.
         * @method _execOnAll
         * @private
         * @static
         */
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

        /**
         * 드래그다랍의 초기화. 전역 event handler를 설정한다.
         * @method _onLoad
         * @private
         * @static
         */
        _onLoad: function(){
            this.init();
            Event.on(document, 'mouseup', this.handleMouseUp, this, true);
            Event.on(document, 'mousemove', this.handleMouseMove, this, true);
            Event.on(window, 'unload', this._onUnload, this, true);
            Event.on(window, 'resize', this._onResize, this, true);
            // Event.on(window,   'mouseout',    this._test);
        },

        /**
         * 모든 드래드드랍 object들에 제한을 재설정한다.
         * @method _onResize
         * @private
         * @static
         */
        _onResize: function(e){
            this._execOnAll('resetConstraints', []);
        },

        /**
         * 모든 드래그드랍을 기능적으로 lock 한다.
         * @method lock
         * @static
         */
        lock: function(){ this.locked = true; },

        /**
         * 모든 드래그드랍을 기능적으로 unlock 한다.
         * @method unlock
         * @static
         */
        unlock: function(){ this.locked = false; },

        /**
         * 드래그드랍이 lock 되어 있는지 여부 확인
         * @method isLocked
         * @return {boolean} 드래그드랍이 lock되어 있으면 true 아니면 false
         * @static
         */
        isLocked: function(){ return this.locked; },

        /**
         * 드래그가 초기화 되었을때 모든 드래그드랍 object들에 대해 설정된
         * 위치 캐시는 드래그가 종료되었을 때 삭제된다.
         * @property locationCache
         * @private
         * @static
         */
        locationCache: {},

        /**
         * 드래그 하는 동안 끊임없는 각 드래그드랍 linked element의 lookup을
         * 강제하고자 하는 경우 useCache를 false로 설정한다.
         * @property useCache
         * @type boolean
         * @static
         */
        useCache: true,

        /**
         * 드래그가 초기화 되기 이전 mousedown이후에 마우스를 움직일
         * 필요가 있을 경우 픽셀의 숫자. 기본값은 3
         * @property clickPixelThresh
         * @type int
         * @static
         */
        clickPixelThresh: 3,

        /**
         * mouseup event를 가져오지 않는 경우 드래그를 초기화 하기 위한
         * mousedown event이후의 밀리초 숫자. 기본값은 1000.
         * @property clickTimeThresh
         * @type int
         * @static
         */
        clickTimeThresh: 1000,

        /**
         * 드래그 픽셀 threshold나 mousedown 시간 threshold가 만났는지를
         * 표시하는 flag
         * @property dragThreshMet
         * @type boolean
         * @private
         * @static
         */
        dragThreshMet: false,

        /**
         * 클릭시간 threshold에 대해 사용된 타임아웃
         * @property clickTimeout
         * @type Object
         * @private
         * @static
         */
        clickTimeout: null,

        /**
         * 드래그 threshold이 만났을때 나중에 사용하기 위해 저장된
         * mousedown event의 X 위치
         * @property startX
         * @type int
         * @private
         * @static
         */
        startX: 0,

        /**
         * 드래그 threshold이 만났을때 나중에 사용하기 위해 저장된
         * mousedown event의 Y 위치
         * @property startY
         * @type int
         * @private
         * @static
         */
        startY: 0,

        /**
         * 드래그 event가 마우스 이동 threshold가 아닌 클릭 타임아웃으로 부터
         * 발생한 경우인지에 대해 결정하기 위한 flag
         * @property fromTimeout
         * @type boolean
         * @private
         * @static
         */
        fromTimeout: false,

        /**
         * 각각의 LDragDrop 인스턴스는 반드시 LDragDropManager와 같이 등록되어야 한다.
         * 이것은 LDragDrop.init()에서 실행된다.
         * @method regDragDrop
         * @param {Rui.dd.LDragDrop} oDD 등록할 LDragDrop object
         * @param {String} group 해당 element가 속할 그룹의 이름
         * @static
         */
        regDragDrop: function(oDD, group){
            if(!this.initialized){ this.init(); }
            
            if(!this.ids[group]){
                this.ids[group] = {};
            }
            this.ids[group][oDD.id] = oDD;
        },

        /**
         * 제공된 그룹으로 부터 제공된 dd 인스턴스를 제거한다.
         * LDragDrop.removeFromGroup에 의해 실행되며 해당 함수를 직접 호출하지는 않는다.
         * @method removeDDFromGroup
         * @private
         * @static
         */
        removeDDFromGroup: function(oDD, group){
            if(!this.ids[group]){
                this.ids[group] = {};
            }

            var obj = this.ids[group];
            if(obj && obj[oDD.id]){
                delete obj[oDD.id];
            }
        },

        /**
         * 드래그드랍 항목을 등록 취소한다.
         * 이것은 LDragDrop.unreg에서 실행되며, 이것을 직접 호출하는대신 method를 사용한다.
         * @method _remove
         * @private
         * @static
         */
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

        /**
         * 각각의 LDragDrop handle element는 반드시 등록되어야 한다.
         * 이것은 LDragDrop.setHandleElId()이 실행될때 자동적으로 수행된다.
         * @method regHandle
         * @param {String} sDDId element가 핸들링 할 LDragDrop id
         * @param {String} sHandleId 드래그 될 element의 id 
         * handle
         * @static
         */
        regHandle: function(sDDId, sHandleId){
            if(!this.handleIds[sDDId]){
                this.handleIds[sDDId] = {};
            }
            this.handleIds[sDDId][sHandleId] = sHandleId;
        },

        /**
         * 주어진 element가 드래그드랍 항목으로써 등록되어 있는지에 대한
         * 여부를 결정하는 유틸리티 함수
         * @method isDragDrop
         * @param {String} id 체크할 element id
         * @return {boolean} 해당 element가 LDragDrop인 경우 true, 아니면 false
         * @static
         */
        isDragDrop: function(id){
            return ( this.getDDById(id) ) ? true : false;
        },

        /**
         * 인스턴스가 속할 모든 그룹에 전달된 드래그드랍 인스턴스들을 반환한다.
         * @method getRelated
         * @param {Rui.dd.LDragDrop} p_oDD 연관된 데이터를 가져올 object
         * @param {boolean} bTargetsOnly true인 경우 타겟팅 가능한 object만 반환한다.
         * @return {LDragDrop[]} 연관된 인스턴스
         * @static
         */
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

        /**
         * 특정 드래그 obj에 대해 특정 dd 대상이 유효한 대상인 경우 true를 반환한다.
         * @method isLegalTarget
         * @param {Rui.dd.LDragDrop} oDD 드래그 obj
         * @param {Rui.dd.LDragDrop} oTargetDD 대상
         * @return {boolean} dd obj애 대해 대상이 유요한 대상인 경우 true
         * @static
         */
        isLegalTarget: function(oDD, oTargetDD){
            var targets = this.getRelated(oDD, true);
            for (var i=0, len=targets.length;i<len;++i){
                if(targets[i].id == oTargetDD.id){
                    return true;
                }
            }
            return false;
        },

        /**
         * object가 LDragDrop typeof인지 LDragDrop의 정확한 서브클래스인지를
         * 투명하게 결정할 수 있는 것이 목표이다.
         * typeof는 'object'를 반환하며, oDD.constructor.toString()은 항상 
         *  서브클래스의 이름이 아닌 'LDragDrop'을 반환한다.
         * 그래서 지금은 그냥 LDragDrop에서 잘 알려진 변수를 평가한다.
         * @method isTypeOfDD
         * @param {Object} oDD 평가할 object
         * @return {boolean} typeof oDD가 LDragDrop와 같은 경우 true
         * @static
         */
        isTypeOfDD: function(oDD){
            return (oDD && oDD.__ygDragDrop);
        },

        /**
         * 주오진 드래그드랍 object에 대해 주어진 element가 드래그드랍 handle로써
         * 등록되었는지에 대한 여부를 결정하는 유틸리티 함수
         * @method isHandle
         * @param {String} id 체크할 element id
         * @return {boolean} 해당 element가 LDragDrop handle인 경우 true, 아니면 false 
         * @static
         */
        isHandle: function(sDDId, sHandleId){
            return ( this.handleIds[sDDId] && 
                            this.handleIds[sDDId][sHandleId] );
        },

        /**
         * Returns the LDragDrop instance for a given id
         * 주어진 id에 대한 LDragDrop 인스턴스를 반환한다.
         * @method getDDById
         * @param {String} id LDragDrop object의 id
         * @return {Rui.dd.LDragDrop} 드래그드랍 object, 찾지 못한 경우 null
         * @static
         */
        getDDById: function(id){
            for (var i in this.ids){
                if(this.ids[i][id]){
                    return this.ids[i][id];
                }
            }
            return null;
        },

        /**
         * 등록된 LDragDrop object가 mousedown event를 가져온 이후에 발생한다.
         * 드래그된 object를 추적하기 위해 필요한 event들을 설정한다.
         * @method handleMouseDown
         * @param {Event} e the event
         * @param {Rui.dd.LDragDrop} oDD 드래그될 LDragDrop object
         * @private
         * @static
         */
        handleMouseDown: function(e, oDD){
            //this._activateShim();

            this.currentTarget = Rui.util.LEvent.getTarget(e);
            this.dragCurrent = oDD;
            var el = oDD.getEl();

            // track start position
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

        /**
         * 드래그 픽셀 threshold나 mousedown hold 시간 threshold가
         * 만났을때 발생한다.
         * @method startDrag
         * @param {int} x 원래 mousedown의 X 위치
         * @param {int} y 원래 mousedown의 Y 위치
         * @static
         */
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

        /**
         * mouseup event를 핸들링 하기 위한 내부적인 함수
         * document의 context로부터 호출될 것이다.
         * @method handleMouseUp
         * @param {Event} e the event
         * @private
         * @static
         */
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

        /**
         * 이 항목이 켜지는 경우 event의 디폴트 처리와 event의 전파를 막는 유틸리티
         * @method stopEvent
         * @param {Event} e the event as returned by this.getEvent()
         * @static
         */
        stopEvent: function(e){
            if(this.stopPropagation){
                Rui.util.LEvent.stopPropagation(e);
            }

            if(this.preventDefault){
                Rui.util.LEvent.preventDefault(e);
            }
        },

        /** 
         * 현재의 드래그를 끝내고 상태를 초기화 하며, endDrag와 mouseUp event들을 발생시킨다.
         * 드래그 하는 동안 mouseup이 감지 되었을때 내부적으로 호출된다.
         * 다른 event(이를테면, onDrag에서 받는 mousemove event)나 pageX와 pageY로 정의된
         * fake event(그래서 endDrag와 onMouseUp은 사용가능한 위치데이터를 가짐)에 의해
         * 전달됨으로써 드래그 하는 동안 수동적으로 발생할 수 있다.
         * 대안으로, silent parameter에 대해 true를 전달해서 ednDrag나 onMouseUp event들이
         * 스킵되도록 한다.(그래서 event 데이터가 필요하지 않다.)
         *
         * @method stopDrag
         * @param {Event} e mouseup event나 다른 pageX and pageY로 정의된 event(아니면 fake event)나 
         *                  silent parameter가 true인 경우에는 없음
         * @param {boolean} silent true인 경우 enddrag와 mouseup event를 스킵한다.
         * @static
         */
        stopDrag: function(e, silent){
            var dc = this.dragCurrent;
            // Fire the drag end event for the item that was dragged
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

        /** 
         * mousemove event를 핸들링하기 위한 내부적인 함수
         * html element의 context로부터 호출될 것이다.
         *
         * @TODO window 한계 넘어로 사용자가 object를 드래그 하는 경우 마우스 event들을
         * 잃어버릴수 있음을 해결한다.
         * 일반적으로 mousemove event 동안 마우스가 눌려 있는 것을 확인함으로써 
         * internet explorer 브라우저에서 이것이 감지될 수 있다.
         * Firefox 브라우저는 mousemove event에 대한 버튼 상태를 주지 않는다.
         * @method handleMouseMove
         * @param {Event} e the event
         * @private
         * @static
         */
        handleMouseMove: function(e){

            var dc = this.dragCurrent;
            if(dc){
                // var button = e.which || e.button;

                // check for IE mouseup outside of page boundary
                if(Rui.util.LEvent.isIE && Rui.browser.version < 9 && !e.button){
                    this.stopEvent(e);
                    return this.handleMouseUp(e);
//                }else{
//                    if(e.clientX < 0 || e.clientY < 0){
//                        //This will stop the element from leaving the viewport in FF, Opera & Safari
//                        //Not turned on yet
//                        //this.stopEvent(e);
//                        //return false;
//                    }
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
        
        /**
         * 위(hover)에 있거나 드랍한 LDragDrop element를 찾기 위해 모든 element들을 반복
         * @method fireEvents
         * @param {Event} e the event
         * @param {boolean} isDrop 드랍 작업인지 mouseover 작업인지 여부
         * @private
         * @static
         */
        fireEvents: function(e, isDrop){
            var dc = this.dragCurrent;

            // If the user did the mouse up outside of the window, we could 
            // get here even though we have ended the drag.
            // If the config option dragOnly is true, bail out and don't fire the events
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
                oldOvers = [], // cache the previous dragOver array
                inGroupsObj  = {},
                inGroups  = [],
                data = {
                    outEvts: [],
                    overEvts: [],
                    dropEvts: [],
                    enterEvts: []
                };


            // Check to see if the object(s) we were hovering over is no longer 
            // being hovered over so we can fire the onDragOut event
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
                            // look for drop interactions
                            if(isDrop){
                                data.dropEvts.push( oDD );
                            // look for drag enter and drag over interactions
                            }else{

                                // initial drag over: dragEnter fires
                                if(!oldOvers[oDD.id]){
                                    data.enterEvts.push( oDD );
                                // subsequent drag overs: dragOver fires
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

            // notify about a drop that did not find a target
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

        /**
         * INTERSECT 모드에 있을때 드래그드랍 event들에 의해 반환된 드래그드랍
         * object들의 목록으로부터 가장 일치하는 것을 가져오는 helper 함수
         * 이는 커서가 가리키는 첫번째 object나 드래그된 element와 가장 크게
         * 오버랩된 object를 반환한다.
         * @method getBestMatch
         * @param  {LDragDrop[]} dds 드래그드랍 object들의 array 
         * targeted
         * @return {Rui.dd.LDragDrop}       가장 일치하는 object
         * @static
         */
        getBestMatch: function(dds){
            var winner = null;

            var len = dds.length;

            if(len == 1){
                winner = dds[0];
            }else{
                // Loop through the targeted items
                for (var i=0; i<len; ++i){
                    var dd = dds[i];
                    // If the cursor is over the object, it wins.  If the 
                    // cursor is over multiple matches, the first one we come
                    // to wins.
                    if(this.mode == this.INTERSECT && dd.cursorIsOver){
                        winner = dd;
                        break;
                    // Otherwise the object with the most overlap wins
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

        /**
         * 특정 그룹에서 드래그드랍 object들의 top-left와 bottom-right 지점의
         * 캐시를 새로고침한다.
         * 이것은 드래그드랍 인스턴스에 저장되는 포맷이며, 전형적인 사용법은 다음과 같다:
         * <code>
         * Rui.dd.LDragDropManager.refreshCache(ddinstance.groups);
         * </code>
         * 다른 방법으로:
         * <code>
         * Rui.dd.LDragDropManager.refreshCache({group1:true, group2:true});
         * </code>
         * @TODO 이것은 실제 인덱싱 배열이어야 한다. 이 method는 둘중에 
         * 양자택일로 선택되어야 한다.
         * @method refreshCache
         * @param {Object} groups 새로고침할 그룹들의 연관 배열
         * @static
         */
        refreshCache: function(groups){

            // refresh everything if group array is not provided
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

        /**
         * element가 존재하고 DOM안에 있는지 확인하기 위해 체크한다.
         * 주요 목적은 innerHTML 에서 DOM으로부터 드래그드랍 object를 제거하기 위해
         * 사용되는 경우를 핸들링하는 것이다.
         * IE 브라우저는 그런 element의 offsetParent를 액세스 하려고 할때
         * 'unspecified error'를 제공한다.
         * @method verifyEl
         * @param {HTMLElement} el 체크할 element
         * @return {boolean} element가 사용가능한 경우 true
         * @static
         */
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
        
        /**
         * 설정할 padding 값을 포함한 드래그드랍 element의 위치와 사이즈를 포함하는
         * Region object를 반환한다.
         * @method getLocation
         * @param {Rui.dd.LDragDrop} oDD 위치를 가져올 드래그드랍 object
         * @return {Rui.util.LRegion} a 설정될 padding 인스턴스를 포함한 element가 나타내는
         *                             전체 영역을 표시하는 Region object
         * @static
         */
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

        /**
         * 커서가 대상 위에 있는 경우 확인하기 위한 커서 위치를 체크한다.
         * @method isOverTarget
         * @param {Rui.util.LPoint} pt 평가할 지점(point)
         * @param {Rui.dd.LDragDrop} oTarget 검사할 LDragDrop object
         * @param {boolean} intersect intersect mode인 경우 true
         * @param {Rui.util.LRegion} curRegion 드래그된 element의 사전에 캐싱된 위치
         * @return {boolean} 마우스가 대상 위에 있는 경우 true
         * @private
         * @static
         */
        isOverTarget: function(pt, oTarget, intersect, curRegion){
            // use cache if available
            var loc = this.locationCache[oTarget.id];
            if(!loc || !this.useCache){
                loc = this.getLocation(oTarget);
                this.locationCache[oTarget.id] = loc;
            }

            if(!loc){
                return false;
            }

            oTarget.cursorIsOver = loc.contains( pt );

            // LDragDrop is using this as a sanity check for the initial mousedown
            // in this case we are done.  In POINT mode, if the drag obj has no
            // contraints, we are done. Otherwise we need to evaluate the 
            // region the target as occupies to determine if the dragged element
            // overlaps with it.
            
            var dc = this.dragCurrent;
            if(!dc || (!intersect && !dc.constrainX && !dc.constrainY)){

                //if(oTarget.cursorIsOver){
                //}
                return oTarget.cursorIsOver;
            }

            oTarget.overlap = null;


            // Get the current location of the drag element, this is the
            // location of the mouse event less the delta that represents
            // where the original mousedown happened on the element.  We
            // need to consider constraints and ticks as well.

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

        /**
         * unload event handler
         * @method _onUnload
         * @private
         * @static
         */
        _onUnload: function(e, me){
            this.unregAll();
        },

        /**
         * 드래그드랍 event와 object들을 깨끗이 삭제한다.
         * @method unregAll
         * @private
         * @static
         */
        unregAll: function(){

            if(this.dragCurrent){
                this.stopDrag();
                this.dragCurrent = null;
            }

            this._execOnAll('unreg', []);

            //for (var i in this.elementCache){
                //delete this.elementCache[i];
            //}
            //this.elementCache = {};

            this.ids = {};
        },

        /**
         * DOM element들의 캐시
         * @property elementCache
         * @private
         * @static
         * @deprecated elements are not cached now
         */
        elementCache: {},
        
        /**
         * 명시된 DOM element에 대한 wrapper를 가져온다.
         * @method getElWrapper
         * @param {String} id 가져올 element의 id
         * @return {ElementWrapper} wrapping된 element
         * @private
         * @deprecated 이 wrapper는 유용하지 않다.
         * @static
         */
        getElWrapper: function(id){
            var oWrapper = this.elementCache[id];
            if(!oWrapper || !oWrapper.el){
                oWrapper = this.elementCache[id] = new this.ElementWrapper(Rui.util.LDom.get(id));
            }
            return oWrapper;
        },

        /**
         * 실제 DOM element를 반환한다.
         * @method getElement
         * @param {String} id 가져올 element의 id
         * @return {Object} The element
         * @deprecated 대신 Rui.util.LDom.get을 사용한다.
         * @static
         */
        getElement: function(id){
            return Rui.util.LDom.get(id);
        },
        
        /**
         * DOM element에 대한 스타일 property를 반환한다.(다시 말하면, document.getElById(id).style)
         * @method getCss
         * @param {String} id 가져올 element의 id
         * @return {Object} element의 스타일 property
         * @deprecated 대신 Rui.util.LDom 을 사용한다.
         * @static
         */
        getCss: function(id){
            var el = Rui.util.LDom.get(id);
            return (el) ? el.style : null;
        },

        /**
         * 캐시된 element에 대한 inner 클래스
         * @private
         * @deprecated
         */
        ElementWrapper: function(el){
            /**
             * The element
             * @property el
             */
            this.el = el || null;
            /**
             * The element id
             * @property id
             */
            this.id = this.el && el.id;
            /**
             * A reference to the style property
             * @property css
             */
            this.css = this.el && el.style;
        },

        /**
         * html element에 대한 X 위치를 반환한다.
         * @method getPosX
         * @param el 위치를 가져올 element
         * @return {int} X 좌표
         * @deprecated 대신 Rui.util.LDom.getX을 사용한다.
         * @static
         */
        getPosX: function(el){
            return Rui.util.LDom.getX(el);
        },

        /**
         * html element에 대한 Y 위치를 반환한다.
         * @method getPosY
         * @param el 위치를 가져올 element
         * @return {int} Y 좌표
         * @deprecated 대신 Rui.util.LDom.getY을 사용한다.
         * @static
         */
        getPosY: function(el){
            return Rui.util.LDom.getY(el); 
        },

        /**
         * 두 노드를 바꾼다.
         * IE 브라우저에서는 다른 IE 작동을 에뮬레이팅 하기 위해서 native method를 사용한다.
         * @method swapNode
         * @param n1 바꿀 첫번째 노드
         * @param n2 바꿀 두번째 노드
         * @static
         */
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

        /**
         * 현재 스크롤 위치를 반환한다.
         * @method getScroll
         * @private
         * @static
         */
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

        /**
         * 특정 element의 스타일 property를 반환한다.
         * @method getStyle
         * @param {HTMLElement} el          element
         * @param {string}      styleProp   스타일 property
         * @return {string} 스타일 property의 값
         * @deprecated 대신 Rui.util.LDom.getStyle을 사용한다.
         * @static
         */
        getStyle: function(el, styleProp){
            return Rui.util.LDom.getStyle(el, styleProp);
        },

        /**
         * scrollTop을 가져온다.
         * @method getScrollTop
         * @return {int} document의 scrollTop
         * @static
         */
        getScrollTop: function(){ return this.getScroll().top; },

        /**
         * scrollLeft을 가져온다.
         * @method getScrollLeft
         * @return {int} document의 scrollTop
         * @static
         */
        getScrollLeft: function(){ return this.getScroll().left; },

        /**
         * 대상 element의 위치에 대한 element의 x/y 위치를 설정한다.
         * @method moveToEl
         * @param {HTMLElement} moveEl      이동할 element
         * @param {HTMLElement} targetEl    element의 위치 참조
         * @static
         */
        moveToEl: function(moveEl, targetEl){
            var aCoord = Rui.util.LDom.getXY(targetEl);
            Rui.util.LDom.setXY(moveEl, aCoord);
        },

        /**
         * 클라이언트 height를 가져온다.
         * @method getClientHeight
         * @return {int} 픽셀 단위의 클라이언트 height
         * @deprecated 대신 Rui.util.LDom.getViewportHeight을 사용한다.
         * @static
         */
        getClientHeight: function(){
            return Rui.util.LDom.getViewportHeight();
        },

        /**
         * 클라이언트 width를 가져온다.
         * @method getClientWidth
         * @return {int} 픽셀 단위의 클라이언트 width
         * @deprecated 대신 Rui.util.LDom.getViewportWidth을 사용한다.
         * @static
         */
        getClientWidth: function(){
            return Rui.util.LDom.getViewportWidth();
        },

        /**
         * 숫자 배열 정렬 함수
         * @method numericSort
         * @static
         */
        numericSort: function(a, b){ return (a - b); },

        /**
         * 내부적인 카운터
         * @property _timeoutCount
         * @private
         * @static
         */
        _timeoutCount: 0,

        /**
         * 덜 중요한 로딩 순서를 만들려고 시도한다.
         * 해당 파일이 event 유틸리티 이전에 로딩된 경우 이것이 없으면 에러를 가져온다.
         * @method _addListeners
         * @private
         * @static
         */
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

        /**
         * 클릭되었는지 여부를 결정하기 위해서 handle element에 대해
         * 인접한 parent와 모든 child 노드를 재귀적으로 탐색한다.
         * @method handleWasClicked
         * @param node 검사할 html element
         * @static
         */
        handleWasClicked: function(node, id){
            if(this.isHandle(id, node.id)){
                return true;
            }else{
                // check to see if this is a text node child of the one we want
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

// shorter alias, save a few bytes
Rui.dd.LDDM = Rui.dd.LDragDropManager;
Rui.dd.LDDM._addListeners();
}
(function() {

var Event=Rui.util.LEvent; 
var Dom=Rui.util.LDom;

/**
 * 대상을 드래그하거나 드랍할 수 있는 항목의 인터페이스나 기본 작업을 정의한다.
 * 이것은 startDrag, onDrag, onDragOver, onDragOut에 대한
 * event handler 오버라이딩 되거나 상속되도록 디자인 되어졌다. 
 * html 참조가 LDragDrop 인스턴스와 연결될 수 있는 건 3개 까지이다.
 * <ul>
 * <li>linked element: 생성자에 전달된 element.
 * 이것은 다른 LDragDrop object들과 상호작용하는데 대한 경계를 정의하는 element이다.</li>
 * <li>handle element(s): 클릭된 element가handle element와 매치되는 경우에만 발생하는 드래그 작업.
 * 기본적으로 이것은 linked element이지만 드래그 작업을 초기화 하기 위한
 * linked element의 부분으로만 여겨질 기회는 있으며, setHandleElId() method는
 * 이것을 정의하기 위한 방법을 제공한다.</li>
 * <li>drag element: 이것은 드래그 작업 동안 커서와 함께 움직여야 하는 element를 표현한다.
 * 기본적으로 이것은 {@link Rui.dd.LDD}로써 그자체로의 linked element이다.
 * setDragElId()은 {@link Rui.dd.LDDProxy}로써 움직여야 할 분리된 element를
 * 정의하게 해준다.
 * </li>
 * </ul>
 * 이 클래스는 연결된 element가 사용 가능한지를 확인하는 onload event까지
 * 인스턴스화 될 수 없다.
 * 다음은 'group1' 그룹의 어떤 다른 LDragDrop obj와 상호작용할
 * LDragDrop obj을 정의한다:  
 * <pre>
 *  dd = new Rui.dd.LDragDrop('div1', 'group1');
 * </pre>
 * 구현된 event handler가 없기 때문에, 위의 코드를 실행하고자 하는 경우
 * 실제 아무 것도 일어나지 않는다.
 * 일반적으로 이 클래스 또는 기본 구현중의 하나를 오버라이드 하거나, 또한 클래스의 인스턴스에서
 * 원하는 method를 오버라이드 할 수 있다.
 * <pre>
 *  dd.onDragDrop = function(e, id) {
 *  &nbsp;&nbsp;alert('dd was dropped on ' + id);
 *  }
 * </pre>
 * @namespace Rui.dd
 * @class LDragDrop
 * @extends Rui.util.LEventProvider
 * @constructor
 * @param {String} id 해당 인스턴스에 연결된 element의 id
 * @param {String} group LDragDrop object들과 연관된 그룹
 * @param {object} attributes 설정가능한 attribue를 포함한 object
 *                LDragDrop에 대해 유요한 property들: 
 *                    padding, isTarget, maintainOffset, primaryButtonOnly,
 */
Rui.dd.LDragDrop = function(config) {
    config = config || {};
    /*
    if(id.length == 1 && (typeof id == 'object' && !id.tagName)){
        group = id.group;
        attributes = id.attributes;
        id = id.applyTo || id.id;
    }
    */
    if (config.id) {
        this.init(config.id, config.group, config.attributes); 
    }
};

Rui.extend(Rui.dd.LDragDrop, Rui.util.LEventProvider, {
    /**
     * 사용될 event들을 포함하는 object literal
     * 이것들중 어떤 것이든 false로 설정하면, event는 발생하지 않을 것이다.
     * @property events
     * @type object
     * @private
     */
    events: null,
    /**
    * @method on
    * @private
    * @description LEventProvider.on에 대한 바로가기, <a href="Rui.util.LEventProvider.html#on">Rui.util.LEventProvider.on</a>을 참조한다.
    */
    /*
     * 상속이 되어 있으므로 제거, 이 주석을 제외시키면 반복 참조로 인한 스텍 에러 발생
    on: function() {
        this.on.apply(this, arguments);
    },
    */
    /**
     * 해당 object와 연관된 element의 id
     * 사이즈와 해당 element의 위치가 드래그와 드랍 object가 상호작용할때 
     * 결정하기 위해서 사용되기 때문에 이것은 'linked element'로서 참조되는 것이다.
     * @property id
     * @private
     * @type String
     */
    id: null,

    /**
     * 생성자에 전달된 LConfiguration attribute
     * @property attributes
     * @private
     * @type object
     */
    attributes: null,

    /**
     * 드래그 될 element의 id
     * 기본적으로 이것은 linked element로써 동일하나 다른 element로 바뀔 수 있다. 예:Rui.dd.LDDProxy 
     * @property dragElId
     * @type String
     * @private
     */
    dragElId: null, 

    /**
     * 드래그 작업을 초기화 하는 element의 id
     * 기본적으로 이것은 linked element이나 해당 element의 child로 바뀔 수 있다.
     * linked html element 안의 header element가 클릭되었을 때
     * 이것은 오직 드래그를 시작하는 것과 같은 것을 할 수 있게 한다.
     * @property handleElId
     * @type String
     * @private
     */
    handleElId: null, 

    /**
     * 클릭된 경우 무시될 HTML 태그들의 연관 배열
     * @property invalidHandleTypes
     * @private
     * @type {string: string}
     */
    invalidHandleTypes: null, 

    /**
     * 클릭된 경우 무시될 element들에 대한 id들의 연관 배열
     * @property invalidHandleIds
     * @private
     * @type {string: string}
     */
    invalidHandleIds: null, 

    /**
     * 클릭된 경우 무시될 element에 대한 css 클래스 이름들의 인덱싱 배열
     * @property invalidHandleClasses
     * @private
     * @type string[]
     */
    invalidHandleClasses: null, 

    /**
     * 드래그가 시작될때 linked element의 absolute X 위치
     * @property startPageX
     * @type int
     * @private
     */
    startPageX: 0,

    /**
     * 드래그가 시작될때 linked element의 absolute Y 위치
     * @property startPageY
     * @type int
     * @private
     */
    startPageY: 0,

    /**
     * 그룹은 관련된 LDragDrop object들의 집합을 정의한다.
     * 인스턴스는 같은 그룹의 다른 LDragDrop object와 상호작용할 때만 event를 가져온다.  
     * 이것은 원하는 경우 여러 그룹에 하나의 LDragDrop subclass 사용을 하게 해준다.
     * @property groups
     * @type {string}
     */
    groups: null,

    /**
     * 개별적인 그래드/드랍 인스턴스들은 lock 될 수 있다.
     * 이것은 onmousedown 드래그 시작을 방지할 것이다.
     * @property locked
     * @type boolean
     * @private
     */
    locked: false,

    /**
     * 해당 인스턴스를 lock 한다.
     * @method lock
     */
    lock: function() { this.locked = true; },

    /**
     * 해당 인스턴스를 unlock 한다.
     * @method unlock
     */
    unlock: function() { this.locked = false; },

    /**
     * 기본적으로 모든 인스턴스들은 드랍 대상이 될 수 있다.
     * 이것은 isTarget을 false로 설정함으로써 비활성화 될 수 있다.
     * @property isTarget
     * @type boolean
     */
    isTarget: true,

    /**
     * 해당 object와의 드랍 교차점 계산을 위한 이 드래그드랍 object에 대한
     * 설정된 padding 값
     * @property padding
     * @private
     * @type int[]
     */
    padding: null,
    /**
     * 해당 flag가 true인 경우 드랍 event들을 발생시키지 않는다.
     * element는 유일한 drag element이다.(드랍이 아닌 이동에 대해)
     * @property dragOnly
     * @type Boolean
     */
    dragOnly: false,

    /**
     * 해당 flag가 true인 경우 shim은 마우스 event 추적을 위한 screen/viewable 영역에 배치될 것이다.
     * iframe과 다른 컨트롤에서의 element 드래그에 도움이 된다.
     * @property useShim
     * @type Boolean
     */
    useShim: false,

    /**
     * linked element에 대한 참조를 캐싱한다.
     * @property _domRef
     * @private
     */
    _domRef: null,

    /**
     * 내부적인 typeof flag
     * @property __ygDragDrop
     * @private
     */
    __ygDragDrop: true,

    /**
     * 수평 제한이 적용됐을 때 true로 설정한다.
     * @property constrainX
     * @type boolean
     * @private
     */
    constrainX: false,

    /**
     * 수직 제한이 적용됐을 때 true로 설정한다.
     * @property constrainY
     * @type boolean
     * @private
     */
    constrainY: false,

    /**
     * left 제한
     * @property minX
     * @type int
     * @private
     */
    minX: 0,

    /**
     * right 제한
     * @property maxX
     * @type int
     * @private
     */
    maxX: 0,

    /**
     * up 제한 
     * @property minY
     * @type int
     * @type int
     * @private
     */
    minY: 0,

    /**
     * down 제한 
     * @property maxY
     * @type int
     * @private
     */
    maxY: 0,

    /**
     * 클릭 위치와 소스 element의 위치 사이의 차이
     * @property deltaX
     * @type int
     * @private
     */
    deltaX: 0,

    /**
     * 클릭 위치와 소스 element의 위치 사이의 차이
     * @property deltaY
     * @type int
     * @private
     */
    deltaY: 0,

    /**
     * 제한을 재설정할 때 offset를 포함한다.
     * 페이지가 바뀔때 element의 위치를 그것의 parent와 똑같게 유지하고자
     * 한다면 true로 설정한다.
     * @property maintainOffset
     * @private
     * @type boolean
     */
    maintainOffset: false,

    /**
     * 수평 눈금/간격을 명시하고자 하는 경우 element가 snap할 픽셀 위치의 array.
     * 해당 array는 tick 간격을 정의할때 자동적으로 생성된다.
     * @property xTicks
     * @private
     * @type int[]
     */
    xTicks: null,

    /**
     * 수직 눈금/간격을 명시하고자 하는 경우 element가 snap할 픽셀 위치의 array.
     * 해당 array는 tick 간격을 정의할때 자동적으로 생성된다.
     * @property yTicks
     * @private
     * @type int[]
     */
    yTicks: null,

    /**
     * 기본적으로 드래그와 드랍 인스턴스는 첫번째 버튼 클릭에만
     * 반응을 한다.(오른손잡이용 마우스에 대한 왼쪽 클릭)
     * 브라우저에 의해 전달되는 마우스 클릭으로 시작하는 드래그와 드랍을
     * 가능하게 하기 위해서 true로 설정한다.
     * @property primaryButtonOnly
     * @type boolean
     */
    primaryButtonOnly: true,

    /**
     * 연결된 dom element가 약세스 가능할때까지 사용가능한 property는 false이다.
     * @property available
     * @type boolean
     */
    available: false,

    /**
     * 기본적으로 드래그는 mousedown이 linked element 영역 안에서
     * 일어나는 경우에만 초기화 될 수 있다.
     * 이것은 이전의 mouseup이 window 밖에서 발생한 경우 mousedown을
     * 잘못 보고하는 몇몇 브라우저 들에서 버그를 부분적으로 해결하기 위해 일부 이루어진다.
     * outer handle이 정의되어 있는 경우 해당 property를 true로 설정한다.
     *
     * @property hasOuterHandles
     * @type boolean
     * @default false
     */
    hasOuterHandles: false,

    /**
     * 다른 dd object에 의해 대상이 된 경우 확인하기 위해 테스팅 할때
     * 드래그와 드랍 object에 할당되는 property.
     * 이 property는 마우스 교차의 포커스를 결정하는데 도움을 주기 위하여
     * 교차 모드가 사용될 수 있다.
     * LDDM.getBestMatch은 여러 대상들이 같은 상호작용의 일부분일때
     * 교차 모드에서 가장 가까운 일치점을 결정하는데 이 property를 처음으로 사용한다.
     * @property cursorIsOver
     * @type boolean
     */
    cursorIsOver: false,

    /**
     * 다른 dd object에 의해 대상이 된 경우 확인하기 위해 테스팅 할때
     * 드래그와 드랍 object에 할당되는 property.
     * 이것은 해당 대상에 오버랩되는 드래그 가능한 element 영역을 표시하는 region 이다.
     * LDDM.getBestMatch는 여러 대상들이 같은 상호작용의 일부분일때
     * 교차 모드에서 가장 가까운 일치점을 결정하기 위해서 다른 대상의 사이즈에
     * 오버랩의 사이즈를 비교하기 위하여 이 property를 사용한다.
     * @property overlap 
     * @private
     * @type Rui.util.LRegion
     */
    overlap: null,

    /**
     * startDrag event 전에 즉시 실행하는 코드
     * @method b4StartDrag
     * @private
     */
    b4StartDrag: function(x, y) { },

    /**
     * 드래그/드랍 object가 클릭되고 드래그나 mousedown 시간 초입이
     * 만난 이후에 호출되는 추상 method.
     * @method startDrag
     * @param {int} X 클릭 위치
     * @param {int} Y 클릭 위치
     */
    startDrag: function(x, y) { /* override this */ },

    /**
     * onDrag event 이전에 즉시 실행되는 코드
     * @method b4Drag
     * @private
     */
    b4Drag: function(e) { },

    /**
     * object를 드래그 할때 onMouseMove event 동안 호출되는 추상 method.
     * @method onDrag
     * @private
     * @param {Event} e mousemove event
     */
    onDrag: function(e) { /* override this */ },

    /**
     * 해당 element가 처음으로 다른 LDragDrop obj위에 올라갔을때 호출되는 추상 method
     * @method onDragEnter
     * @private
     * @param {Event} e mousemove event
     * @param {String|LDragDrop[]} id POINT 모드에서 위에 올라가는 element의 id.
     * INTERSECT 모드에서, 위에 올라가는 하나 혹은 그 이상의 dragdrop 항목들의 array.
     */
    onDragEnter: function(e, id) { /* override this */ },

    /**
     * onDragOver event이전에 즉시 실행되는 코드
     * @method b4DragOver
     * @private
     */
    b4DragOver: function(e) { },

    /**
     * 해당 element가 처음으로 다른 LDragDrop obj위에 올라갔을때 호출되는 추상 method
     * @method onDragOver
     * @private
     * @param {Event} e mousemove event
     * @param {String|LDragDrop[]} id POINT 모드에서, 위에 올라가는 element의 id.
     * INTERSECT 모드에서, 위에 올라가는 하나 혹은 그 이상의 dragdrop 항목들의 array.
     */
    onDragOver: function(e, id) { /* override this */ },

    /**
     * onDragOut event 이전에 즉시 실행되는 코드
     * @method b4DragOut
     * @private
     */
    b4DragOut: function(e) { },

    /**
     * element위에 더 이상 아무것도 없을때 호출되는 추상 method.
     * @method onDragOut
     * @private
     * @param {Event} e mousemove event
     * @param {String|LDragDrop[]} id POINT 모드에서, 위에 올라가는 element의 id.
     * INTERSECT 모드에서, 위에 올라가는 하나 혹은 그 이상의 dragdrop 항목들의 array.
     */
    onDragOut: function(e, id) { /* override this */ },

    /**
     * onDragDrop event 이전에 즉시 실행되는 코드
     * @method b4DragDrop
     * @private
     */
    b4DragDrop: function(e) { },

    /**
     * 다른 LDragDrop obj 위에 해당 항목이 드랍 되었을때 호출되는 추상 method.
     * @method onDragDrop
     * @private
     * @param {Event} e mouseup event
     * @param {String|LDragDrop[]} id POINT 모드에서, 위에 올라가는 element의 id.
     * INTERSECT 모드에서, 위에 올라가는 하나 혹은 그 이상의 dragdrop 항목들의 array.
     */
    onDragDrop: function(e, id) { /* override this */ },

    /**
     * 드랍 대상을 가지고 있지 않은 영역에 항목을 드랍했을때 호출되는 추상 method
     * @method onInvalidDrop
     * @private
     * @param {Event} e mouseup event
     */
    onInvalidDrop: function(e) { /* override this */ },

    /**
     * endDrag event 이전에 즉시 실행되는 코드
     * @method b4EndDrag
     * @private
     */
    b4EndDrag: function(e) { },

    /**
     * object 드래그가 완료되었을때 발생하는 event
     * @method endDrag
     * @private
     * @param {Event} e mouseup event
     */
    endDrag: function(e) { /* override this */ },

    /**
     * onMouseDown event 이전에 즉시 실행되는 코드
     * @method b4MouseDown
     * @private
     * @param {Event} e mousedown event
     */
    b4MouseDown: function(e) {  },

    /**
     * 드래그/드랍 obj가 mousedown을 가질때 발생하는 event handler
     * @method onMouseDown
     * @private
     * @param {Event} e mousedown event
     */
    onMouseDown: function(e) { /* override this */ },

    /**
     * 드래그/드랍 obj가 mouseup을 가질때 발생하는 event handler
     * @method onMouseUp
     * @private
     * @param {Event} e mouseup event
     */
    onMouseUp: function(e) { /* override this */ },
   
    /**
     * 초기 위치가 결정된 이후에 어떻게 해야할지에 대한 onAvailable method를 오버라이드 한다.
     * @method onAvailable
     * @private
     */
    onAvailable: function () { 
    },

    /**
     * linked element에 대한 참조를 반환한다.
     * @method getEl
     * @return {HTMLElement} html element 
     */
    getEl: function() { 
        if (!this._domRef) {
            this._domRef = Dom.get(this.id); 
        }
        return this._domRef;
    },

    /**
     * 드래그한 실제 element에 대한 참조를 반환한다.
     * 이것은 html element로써 같지만, 다른 element에 할당될 수도 있다.
     * 이에 대한 예제는 Rui.dd.LDDProxy에서 찾을 수 있다.
     * @method getDragEl
     * @return {HTMLElement} html element 
     */
    getDragEl: function() {
        return Dom.get(this.dragElId);
    },

    /**
     * LDragDrop object을 설정한다.
     * Rui.dd.LDragDrop subclass의 생성자에서 반드시 호출되어야 한다.
     * @method init
     * @private
     * @param id linked element의 id
     * @param {String} group 연관된 항목들의 그룹
     * @param {object} attributes 설정 attribute들
     */
    init: function(id, group, attributes) {
        this.initTarget(id, group, attributes);
        Event.on(this._domRef || this.id, 'mousedown', this.handleMouseDown, this, true);

        // Event.on(this.id, 'selectstart', Event.preventDefault);
        for (var i in this.events) {
            this.createEvent(i + 'Event');
        }
    },

    /**
     * 타겟팅 기능만 초기화 한다. object는 mousedown handler를 가져오지 않는다. 
     * @method initTarget
     * @private
     * @param id linked element의 id
     * @param {String} group 연관된 항목들의 그룹
     * @param {object} attributes 설정 attribute들
     */
    initTarget: function(id, group, attributes) {

        // attributesuration attributes 
        this.attributes = attributes || {};

        this.events = {};

        // create a local reference to the drag and drop manager
        this.LDDM = Rui.dd.LDDM;

        // initialize the groups object
        this.groups = {};

        // assume that we have an element reference instead of an id if the
        // parameter is not a string
        if (typeof id !== 'string') {
            this._domRef = id;
            id = Dom.generateId(id);
        }

        // set the id
        this.id = id;

        // add to an interaction group
        this.addToGroup((group) ? group : 'default');

        // We don't want to register this as the handle with the manager
        // so we just set the id rather than calling the setter.
        this.handleElId = id;

        Event.onAvailable(id, this.handleOnAvailable, this, true);

        // the linked element is the element that gets dragged by default
        this.setDragElId(id); 

        // by default, clicked anchors will not start drag operations. 
        // @TODO what else should be here?  Probably form fields.
        this.invalidHandleTypes = { A: 'A' };
        this.invalidHandleIds = {};
        this.invalidHandleClasses = [];

        this.applyConfig();
    },

    /**
     * 생성자에 전달된 설정 paramete들을 적용한다.
     * 이것은 상속된 체인을 통해 각 레벨에서 발생하는 것으로 되어 있다.
     * 그래서 LDDProxy 구현은 각 object에서 사용가능한 모든 parameter들을 가져오기 위해서
     * LDDProxy, LDD, LDragDrop에 대한 설정 적용을 실행할 것이다. 
     * @method applyConfig
     * @private
     */
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

        // configurable properties: 
        //    padding, isTarget, maintainOffset, primaryButtonOnly
        this.padding           = this.attributes.padding || [0, 0, 0, 0];
        this.isTarget          = (this.attributes.isTarget !== false);
        this.maintainOffset    = (this.attributes.maintainOffset);
        this.primaryButtonOnly = (this.attributes.primaryButtonOnly !== false);
        this.dragOnly = ((this.attributes.dragOnly === true) ? true : false);
        this.useShim = ((this.attributes.useShim === true) ? true : false);
    },

    /**
     * linked element가 사용 가능할때 실행한다.
     * @method handleOnAvailable
     * @private
     */
    handleOnAvailable: function() {
        this.available = true;
        this.resetConstraints();
        this.onAvailable();
    },

     /**
     * 대상 지역에 픽셀 단위의 padding을 설정한다.
     * 대상을 계산하는데에 대한 가상 object 사이즈를 효과적으로 증가(감소)시킨다.  
     * 약칭의 css-style을 제공한다; 하나의 parameter만 전달된 경우 모든 side가
     * padding을 가질 것이며, 두개만 전달된 경우 top과 bottom은 첫번째 parameter,
     * left와 right는 두번째를 가질 것이다.
     * @method setPadding
     * @param {int} iTop    Top pad
     * @param {int} iRight  Right pad
     * @param {int} iBot    Bot pad
     * @param {int} iLeft   Left pad
     */
    setPadding: function(iTop, iRight, iBot, iLeft) {
        // this.padding = [iLeft, iRight, iTop, iBot];
        if (!iRight && 0 !== iRight) {
            this.padding = [iTop, iTop, iTop, iTop];
        } else if (!iBot && 0 !== iBot) {
            this.padding = [iTop, iRight, iTop, iRight];
        } else {
            this.padding = [iTop, iRight, iBot, iLeft];
        }
    },

    /**
     * linked element의 초기 배치를 저장한다.
     * @method setInitialPosition
     * @private
     * @param {int} diffX   X offset, 기본값 0
     * @param {int} diffY   Y offset, 기본값 0
     */
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

    /**
     * element의 시작 위치를 설정한다.
     * 이것은 obj가 초기화될 때 설정되며, 드래그가 시작될 때 재설정 된다.
     * @method setStartPosition
     * @private
     * @param {int} pos 현재 위치 (이전 확인지점으로부터)
     */
    setStartPosition: function(pos) {
        var p = pos || Dom.getXY(this.getEl());

        this.deltaSetXY = null;

        this.startPageX = p[0];
        this.startPageY = p[1];
    },

    /**
     * 해당 인스턴스를 연관된 드래그/드랍 object들의 그룹에 추가한다.
     * 모든 인스턴스는 적어도 하나의 그룹에 속하며, 필요한 만큼 많은 그룹에 속할 수 있다.
     * @method addToGroup
     * @param {string} group 그룹의 이름
     */
    addToGroup: function(group) {
        this.groups[group] = true;
        this.LDDM.regDragDrop(this, group);
    },

    /**
     * 제공된 상호작용 그룹으로부터 해당 인스턴스를 제거한다.
     * @method removeFromGroup
     * @param {string}  group  드랍할 그룹
     */
    removeFromGroup: function(group) {
        if (this.groups[group]) {
            delete this.groups[group];
        }

        this.LDDM.removeDDFromGroup(this, group);
    },

    /**
     * 드래그 동안 커서와 함께 움직일 linked element이외의 element를
     * 명시하게 한다.
     * @method setDragElId
     * @param {string} id 드래그를 초기화 하기 위해 사용될 element의 id
     */
    setDragElId: function(id) {
        this.dragElId = id;
    },

    /**
     * 드래그 작업을 초기화하기 위해 사용되어야 할 linked element의 child를
     * 명시하게 한다.
     * content div가 텍스트와 링크들을 가지는 경우가 이에 대한 예제가 될 것이다.
     * content 영역의 어디든지 클릭하는 것은 일반적으로 드래그 작업을 시작할 것이다.
     * 드래그 작업을 시작하는 content div 안의 element를 명시하기 위해 
     * 이 method를 사용한다. 
     * @method setHandleElId
     * @param {string} id 드래그를 초기화 하기 위해 사용되는 element의 id
     */
    setHandleElId: function(id) {
        if (typeof id !== 'string') {
            id = Dom.generateId(id);
        }
        this.handleElId = id;
        this.LDDM.regHandle(this.id, id);
    },

    /**
     * 드래그 handle로써 linked element의 바깥 element를 설정하게 한다.
     * @method setOuterHandleElId
     * @param {string} id 드래그를 초기화 하기 위해 사용되는 element의 id
     */
    setOuterHandleElId: function(id) {
        if (typeof id !== 'string') {
            id = Dom.generateId(id);
        }
        Event.on(id, 'mousedown', this.handleMouseDown, this, true);
        this.setHandleElId(id);

        this.hasOuterHandles = true;
    },

    /**
     * 해당 element에 대한 모든 드래그와 드랍에 대한 연결 정보를 삭제한다. 
     * @method unreg
     */
    unreg: function() {
        Event.removeListener(this.id, 'mousedown', this.handleMouseDown);
        this._domRef = null;
        this.LDDM._remove(this);
    },

    /**
     * 해당 인스턴스가 lock 되어 있거나 드래그드랍 매니저가 lock 되어 있는 경우 true를 반환한다.
     * (이는 페이지에 모든 드래그/드랍이 비활성되어 있는 것을 의미함.)
     * @method isLocked
     * @return {boolean} 해당 obj나 모든 드래그/드랍이 lock되어 있으면 true, 아니면 false
     */
    isLocked: function() {
        return (this.LDDM.isLocked() || this.locked);
    },

    /**
     * 해당 object가 클릭 되었을때 발생한다.
     * @method handleMouseDown
     * @private
     * @param {Event} e event 객체
     * @param {Rui.dd.LDragDrop} oDD 클릭된 dd object(해당 dd obj)
     */
    handleMouseDown: function(e, oDD) {
        var button = e.which || e.button;

        if (this.primaryButtonOnly && button > 1) {
            return;
        }

        if (this.isLocked()) {
            return;
        }

        // firing the mousedown events prior to calculating positions
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
        // var self = this;
        // setTimeout( function() { self.LDDM.refreshCache(self.groups); }, 0);

        // Only process the event if we really clicked within the linked 
        // element.  The reason we make this check is that in the case that 
        // another element was moved between the clicked element and the 
        // cursor in the time between the mousedown and mouseup events. When 
        // this happens, the element gets the next mousedown event 
        // regardless of where on the screen it happened.  
        var pt = new Rui.util.LPoint(Event.getPageX(e), Event.getPageY(e));
        if (!this.hasOuterHandles && !this.LDDM.isOverTarget(pt, this) )  {
        } else {
            if (this.clickValidator(e)) {
                // set the initial element position
                this.setStartPosition();

                // start tracking mousemove distance and mousedown time to
                // determine when to start the actual drag
                this.LDDM.handleMouseDown(e, this);

                // this mousedown is mine
                this.LDDM.stopEvent(e);
            }
        }
    },

    /**
     * @method clickValidator
     * @private
     * @description 클릭된 element가 실제 핸들이거나 handle의 유효한 child인지를
     * 유효성 검사하는 method.
     * @param {Event} e event 객체
     */
    clickValidator: function(e) {
        var target = Rui.util.LEvent.getTarget(e);
        return ( this.isValidHandleChild(target) && (this.id == this.handleElId || this.LDDM.handleWasClicked(target, this.id)) );
    },

    /**
     * 마우스 위치의 click offset보다 적은 위치로 옮기고자 하는 경우에
     * 위치하기 위한 element의 위치를 찾는다.
     * @method getTargetCoord
     * @private
     * @param {int} iPageX 클릭의 X 좌표
     * @param {int} iPageY 클릭의 Y 좌표
     * @return 좌표를 포함하는 object (Object.x and Object.y)
     */
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

    /**
     * 클릭됐을 때 드래그 작업을 시작하지 말아야할 tag 이름을 명시하게 한다.
     * 이것은 드래그를 시작하는 것 이외의 다른 일을 하는 드래그 handle 안에
     * 링크들을 끼워 넣기 용이하도록 디자인 된다.
     * @method addInvalidHandleType
     * @param {string} tagName 제외되는 element의 타입
     */
    addInvalidHandleType: function(tagName) {
        var type = tagName.toUpperCase();
        this.invalidHandleTypes[type] = type;
    },

    /**
     * 드래그를 초기화 하지 말아야 할 드래그 handle의 child에 대한 element id를 명시하게 해준다.
     * @method addInvalidHandleId
     * @param {string} id 무시하고자 하는 element의 id
     */
    addInvalidHandleId: function(id) {
        if (typeof id !== 'string') {
            id = Dom.generateId(id);
        }
        this.invalidHandleIds[id] = id;
    },


    /**
     * 드래그를 초기화 하지 않아야 할 element들의 css 클래스를 명시하게 해준다.
     * @method addInvalidHandleClass
     * @param {string} cssClass 무시하고자 하는 element의 클래스
     */
    addInvalidHandleClass: function(cssClass) {
        this.invalidHandleClasses.push(cssClass);
    },

    /**
     * Unsets an excluded tag name set by addInvalidHandleType
     * addInvalidHandleType에 의해 설정한 제외된 tag 이름을 unset한다.
     * @method removeInvalidHandleType
     * @param {string} tagName 제외하지 않을 element의 타입
     */
    removeInvalidHandleType: function(tagName) {
        var type = tagName.toUpperCase();
        // this.invalidHandleTypes[type] = null;
        delete this.invalidHandleTypes[type];
    },
    
    /**
     * 유효하지 않은 handle id를 제거한다.
     * @method removeInvalidHandleId
     * @param {string} id 다시 활성화할 element의 id
     */
    removeInvalidHandleId: function(id) {
        if (typeof id !== 'string') {
            id = Dom.generateId(id);
        }
        delete this.invalidHandleIds[id];
    },

    /**
     * 유효하지 않은 css 클래스를 제거한다.
     * @method removeInvalidHandleClass
     * @param {string} cssClass 다시 활성화하고자 하는 element의 클래스
     */
    removeInvalidHandleClass: function(cssClass) {
        for (var i=0, len=this.invalidHandleClasses.length; i<len; ++i) {
            if (this.invalidHandleClasses[i] == cssClass) {
                delete this.invalidHandleClasses[i];
            }
        }
    },

    /**
     * 해당 클릭이 무시되어야 하는 경우 확인하기 위한 tag 제외 목록을 체크한다.
     * @method isValidHandleChild
     * @param {HTMLElement} node 평가할 HTMLElement
     * @return {boolean} 유효한 tag 타입인 경우 true, 아니면 false
     */
    isValidHandleChild: function(node) {
        var valid = true;
        // var n = (node.nodeName == '#text') ? node.parentNode : node;
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

    /**
     * 간격이 setXConstraint()에서 명시된 경우 수평 tick 마크의 array를 생성한다.
     * @method setXTicks
     * @private
     */
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

    /**
     * 간격이 setYConstraint()에서 명시된 경우 수직 tick 마크의 array를 생성한다.
     * @method setYTicks
     * @private
     */
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

    /**
     * 기본적으로 element는 화면에서 어떤 곳에든 드래그될 수 있다.
     * element의 수평 움직임을 제한하기 위해서 이 method를 사용한다.
     * y 축에의 드래그를 lock 하고자 하는 경우 parameter에 0,0을 전달한다.
     * @method setXConstraint
     * @param {int} iLeft element가 left로 움직일 수 있는 픽셀 숫자
     * @param {int} iRight element가 right로 움직일 수 있는 픽셀 숫자
     * @param {int} iTickSize element가 한번에 움직여야 할 iTickSize 픽셀을 명시하기 위한 부가적인 parameter
     */
    setXConstraint: function(iLeft, iRight, iTickSize) {
        this.leftConstraint = parseInt(iLeft, 10);
        this.rightConstraint = parseInt(iRight, 10);

        this.minX = this.initPageX - this.leftConstraint;
        this.maxX = this.initPageX + this.rightConstraint;
        if (iTickSize) { this.setXTicks(this.initPageX, iTickSize); }

        this.constrainX = true;
    },

    /**
     * 해당 인스턴스에 적용된 모든 제한을 삭제한다.
     * 그것들은 시간에 대한 제한의 종속성을 유지할 수가 없기 때문에 tick들 또한 삭제한다.
     * @method clearConstraints
     */
    clearConstraints: function() {
        this.constrainX = false;
        this.constrainY = false;
        this.clearTicks();
    },

    /**
     * 해당 인스턴스에 대해 정의된 tick 간격을 삭제한다.
     * @method clearTicks
     */
    clearTicks: function() {
        this.xTicks = null;
        this.yTicks = null;
        this.xTickSize = 0;
        this.yTickSize = 0;
    },

    /**
     * 기본적으로 element는 화면에서 어떤 곳에든 드래그될 수 있다.
     * element의 수직 움직임을 제한하기 위해서 이 method를 사용한다.
     * x 축에의 드래그를 lock 하고자 하는 경우 parameter에 0,0을 전달한다.
     * @method setYConstraint
     * @param {int} iUp element가 up으로 움직일 수 있는 픽셀 숫자
     * @param {int} iDown element가 down으로 움직일 수 있는 픽셀 숫자
     * @param {int} iTickSize element가 한번에 움직여야 할 iTickSize 픽셀을 명시하기 위한 부가적인 parameter
     */
    setYConstraint: function(iUp, iDown, iTickSize) {
        this.topConstraint = parseInt(iUp, 10);
        this.bottomConstraint = parseInt(iDown, 10);

        this.minY = this.initPageY - this.topConstraint;
        this.maxY = this.initPageY + this.bottomConstraint;
        if (iTickSize) { this.setYTicks(this.initPageY, iTickSize); }

        this.constrainY = true;
    },

    /**
     * 수동으로 dd element의 재위치 하고자 하는 경우 resetConstraints가 반드시 호출되어야 한다.
     * @method resetConstraints
     */
    resetConstraints: function() {
        // Maintain offsets if necessary
        if (this.initPageX || this.initPageX === 0) {
            // figure out how much this thing has moved
            var dx = (this.maintainOffset) ? this.lastPageX - this.initPageX : 0;
            var dy = (this.maintainOffset) ? this.lastPageY - this.initPageY : 0;

            this.setInitPosition(dx, dy);

        // This is the first time we have detected the element's position
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

    /**
     * 일반적으로 드래그 element는 픽셀 단위로 움직이지만 한번에 픽셀의 숫자 단위로
     * 움직이게 명시할 수가 있다.
     * 이와 같이 설정했을때 이 method는 위치를 결정한다.
     * @method getTick
     * @private
     * @param {int} val object를 위치시키고자 하는 곳
     * @param {int[]} tickArray 유요한 지점의 정렬된 array
     * @return {int} 가장 가까운 tick
     */
    getTick: function(val, tickArray) {

        if (!tickArray) {
            // If tick interval is not defined, it is effectively 1 pixel, 
            // so we return the value passed to us.
            return val; 
        } else if (tickArray[0] >= val) {
            // The value is lower than the first tick, so we return the first
            // tick.
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

            // The value is larger than the last tick, so we return the last
            // tick.
            return tickArray[tickArray.length - 1];
        }
    },

    /**
     * 객체명
     * @method toString
     * @public
     * @return {String}
     */
    toString: function() {
        return ('LDragDrop ' + this.id);
    }

});

/**
* @description mousedown event에의 접근을 제공한다. mousedown는 드래그 작업에서 항상 같은 결과를 내지 않는다.
* @event mouseDown
* @type Rui.util.LCustomEvent
*/

/**
* @description mouseDownEvent가 발생하기 전에 mousedown event에의 접근을 제공한다. false 반환은 드래그를 취소한다.
* @event b4MouseDown
* @type Rui.util.LCustomEvent
*/

/**
* @description 드래그 작업이 끝났을 때 LDragDropManager 안에서부터 발생하는 이벤트
* @event mouseUp
* @type Rui.util.LCustomEvent
*/

/**
* @description startDragEvent 전에 발생하며 false 반환은 startDrag Event를 취소한다.
* @event b4StartDrag
* @type Rui.util.LCustomEvent
*/

/**
* @description mousedown과 드래그 threshold가 만난 이후에 발생한다. 드래그 threshold 기본값은 마우스 움직임의 3픽셀이거나 mousedown의 홀딩의 1초이다.
* @event startDrag
* @type Rui.util.LCustomEvent
*/

/**
* @description endDragEvent 이전에 발생한다. false 반환은 event를 취소한다.
* @event b4EndDrag
* @type Rui.util.LCustomEvent
*/

/**
* @description 드래그가 초기화된 이후에 mouseup event에서 발생한다.(startDrag 발생)
* @event endDrag
* @type Rui.util.LCustomEvent
*/

/**
* @description 드래그 하는 동안 모든 mousemove event가 발생한다. 
* @event drag
* @type Rui.util.LCustomEvent
*/

/**
* @description dragEvent 이전에 발생한다.
* @event b4Drag
* @type Rui.util.LCustomEvent
*/

/**
* @description 드래그된 object가 드랍 대상을 포함하고 있지 않은 위치에 드랍되었을때 발생한다.
* @event invalidDrop
* @type Rui.util.LCustomEvent
*/

/**
* @description dragOutEvent 이전에 발생한다.
* @event b4DragOut
* @type Rui.util.LCustomEvent
*/

/**
* @description 드래그된 object가 onDragEnter를 발생시킨 object 위에 더 이상 있지 않으면 발생한다.
* @event dragOut
* @type Rui.util.LCustomEvent
*/

/**
* @description 드래그된 object가 다른 타겟가능한 드래그나 드랍 object와 처음으로 상호작용할 때 발생한다.
* @event dragEnter
* @type Rui.util.LCustomEvent
*/

/**
* @description dragOverEvent 이전에 발생한다.
* @event b4DragOver
* @type Rui.util.LCustomEvent
*/

/**
* @description 드래그와 드랍 object위에 있는 동안 모든 mousemove event가 발생한다. 
* @event dragOver
* @type Rui.util.LCustomEvent
*/

/**
* @description dragDropEvent 이전에 발생한다.
* @event b4DragDrop
* @type Rui.util.LCustomEvent
*/

/**
* @description 드래그된 object가 다른데 드랍됐을 때 발생한다.
* @event dragDrop
* @type Rui.util.LCustomEvent
*/
})();
/**
 * 드래그 하는 동안 연결된 element가 마우스 커서를 따라가는 
 * 것에 대한 LDragDrop 구현  
 * @namespace Rui.dd
 * @class LDD
 * @extends Rui.dd.LDragDrop
 * @constructor
 * @param {String} id 연결된 element의 id 
 * @param {String} group 연관된 LDragDrop 항목들의 그룹
 * @param {object} attributes LDD에 대한 설정 가능한 attribute Vaild attribute를 포함한 object: scroll 
 */
Rui.dd.LDD = function(config) {
    Rui.dd.LDD.superclass.constructor.call(this, config);
};

Rui.extend(Rui.dd.LDD, Rui.dd.LDragDrop, {

    /**
     * true로 설정하는 경우 유틸리티는 drag and drop element가 viewport 경계 근처까지 드래그될 때
     * 브라우저 window를 스크롤하려고 자동적으로 시도할 것이다.
     * 기본값은 true.
     * @property scroll
     * @private
     * @default true
     * @type boolean
     */
    scroll: true, 

    /**
     * 연결된 element의 top left corner와 element가 클릭된 위치 사이의 거리에 대한
     * 포인터 offset을 설정한다.
     * @method autoOffset
     * @private
     * @param {int} iPageX 클릭의 X 좌표
     * @param {int} iPageY 클릭의 Y 좌표
     */
    autoOffset: function(iPageX, iPageY) {
        var x = iPageX - this.startPageX;
        var y = iPageY - this.startPageY;
        this.setDelta(x, y);
    },

    /** 
     * 포인터 offset을 설정한다.  
     * 특정 위치에 offset이 가도록 강제하기 위해서 이것을 직접 호출할 수 있다.
     * (예를 들어, Rui.ui.Slider로 다 object의 중앙에 설정하기 위해 0,0을 전달한다)
     * @method setDelta
     * @private
     * @param {int} iDeltaX left로부터의 거리
     * @param {int} iDeltaY top부터의 거리
     */
    setDelta: function(iDeltaX, iDeltaY) {
        this.deltaX = iDeltaX;
        this.deltaY = iDeltaY;
    },

    /**
     * 드래그 element를 클릭된 element상의 위치에 관련된 
     * 커서 위치를 포함하는 mousedown이나 클릭 event의 위치에 설정한다.
     * 커서가 있는 곳에 element를 놓고자 하는 경우 이것을 override 한다.
     * @method setDragElPos
     * @param {int} iPageX mousedown이나 드래그 event의 X 좌표
     * @param {int} iPageY mousedown이나 드래그 event의 Y 좌표
     */
    setDragElPos: function(iPageX, iPageY) {
        // the first time we do this, we are going to check to make sure
        // the element has css positioning
        var el = this.getDragEl();
        this.alignElWithMouse(el, iPageX, iPageY);
    },

    /**
     * element를 클릭된 element상의 위치에 관련된 
     * 커서 위치를 포함하는 mousedown이나 클릭 event의 위치에 설정한다.
     * 커서가 있는 곳에 element를 놓고자 하는 경우 이것을 override 한다.
     * @method alignElWithMouse
     * @private
     * @param {HTMLElement} el the element to move
     * @param {int} iPageX mousedown이나 드래그 event의 X 좌표
     * @param {int} iPageY mousedown이나 드래그 event의 Y 좌표
     */
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

    /**
     * 필요시 container들을 리셋하고 체크 마크를 하기 위하여 가장 최근 위치를 저장한다. 
     * 원래 위치로부터의 offset인 element의 픽셀 숫자를 계산하기 위하여 이것을
     * 알아야 할 필요가 있다. 
     * @method cachePosition
     * @private
     * @param iPageX 현재 x 위치(부가적으로, 이것은 다시 찾아볼 필요가 없도록 그냥 만들어짐)
     * @param iPageY 현재 y 위치(부가적으로, 이것은 다시 찾아볼 필요가 없도록 그냥 만들어짐)
     */
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

    /**
     * 드래그된 object가 window의 보이는 경계 너머로 이동한 경우
     * window를 자동 스크롤한다. 
     * @method autoScroll
     * @private
     * @param {int} x 드래그 element의 x 위치
     * @param {int} y 드래그 element의 x 위치
     * @param {int} h 드래그 element의 height
     * @param {int} w 드래그 element의 width
     */
    autoScroll: function(x, y, h, w) {
        if (this.scroll) {
            // The client height
            var clientH = this.LDDM.getClientHeight();

            // The client width
            var clientW = this.LDDM.getClientWidth();

            // The amt scrolled down
            var st = this.LDDM.getScrollTop();

            // The amt scrolled right
            var sl = this.LDDM.getScrollLeft();

            // Location of the bottom of the element
            var bot = h + y;

            // Location of the right of the element
            var right = w + x;

            // The distance from the cursor to the bottom of the visible area, 
            // adjusted so that we don't scroll if the cursor is beyond the
            // element drag constraints
            var toBot = (clientH + st - y - this.deltaY);

            // The distance from the cursor to the right of the visible area
            var toRight = (clientW + sl - x - this.deltaX);


            // How close to the edge the cursor must be before we scroll
            // var thresh = (document.all) ? 100 : 40;
            var thresh = 40;

            // How many pixels to scroll per autoscroll op.  This helps to reduce 
            // clunky scrolling. IE is more sensitive about this ... it needs this 
            // value to be higher.
            var scrAmt = (document.all) ? 80 : 30;

            // LScroll down if we are near the bottom of the visible page and the 
            // obj extends below the crease
            if ( bot > clientH && toBot < thresh ) { 
                window.scrollTo(sl, st + scrAmt); 
            }

            // LScroll up if the window is scrolled down and the top of the object
            // goes above the top border
            if ( y < st && st > 0 && y - st < thresh ) { 
                window.scrollTo(sl, st - scrAmt); 
            }

            // LScroll right if the obj is beyond the right border and the cursor is
            // near the border.
            if ( right > clientW && toRight < thresh ) { 
                window.scrollTo(sl + scrAmt, st); 
            }

            // LScroll left if the window has been scrolled to the right and the obj
            // extends past the left border
            if ( x < sl && sl > 0 && x - sl < thresh ) { 
                window.scrollTo(sl - scrAmt, st);
            }
        }
    },

    /*
     * Sets up attributes options specific to this class. Overrides
     * Rui.dd.LDragDrop, but all versions of this method through the 
     * inheritance chain are called
     */
    applyConfig: function() {
        Rui.dd.LDD.superclass.applyConfig.call(this);
        this.scroll = (this.attributes.scroll !== false);
    },

    /*
     * Event that fires prior to the onMouseDown event.  Overrides 
     * Rui.dd.LDragDrop.
     */
    b4MouseDown: function(e) {
        this.setStartPosition();
        // this.resetConstraints();
        this.autoOffset(Rui.util.LEvent.getPageX(e), Rui.util.LEvent.getPageY(e));
    },

    /*
     * Event that fires prior to the onDrag event.  Overrides 
     * Rui.dd.LDragDrop.
     */
    b4Drag: function(e) {
        this.setDragElPos(Rui.util.LEvent.getPageX(e), Rui.util.LEvent.getPageY(e));
    },

    /**
     * 객체명
     * @method toString
     * @public
     * @return {String}
     */
    toString: function() {
        return ('LDD ' + this.id);
    }

    //////////////////////////////////////////////////////////////////////////
    // Debugging ygDragDrop events that can be overridden
    //////////////////////////////////////////////////////////////////////////
    /*
    startDrag: function(x, y) {
    },

    onDrag: function(e) {
    },

    onDragEnter: function(e, id) {
    },

    onDragOver: function(e, id) {
    },

    onDragOut: function(e, id) {
    },

    onDragDrop: function(e, id) {
    },

    endDrag: function(e) {
    }

    */

});
/**
 * @description 드래그 작업동안 커서를 따라가는 document안의 빈 bordered div를 삽입하는 LDragDrop 구현
 * 클릭할 때, frame div은 연결된 html element의 치수로 사이즈가 변경되며,
 * 연결된 element의 정확한 위치로 이동된다.
 *
 * "frame" element에 대한 참조는 페이지의 모든 LDDProxy element들의 위치에
 * 드래그되면서 만들어진 싱글 proxy element를 참조하십시오.
 * 
 * @namespace Rui.dd
 * @class LDDProxy
 * @extends Rui.dd.LDD
 * @constructor
 * @param {String} id 연결된 html element의 id
 * @param {String} group 연관된 LDragDrop object들의 그룹
 * @param {object} attributes 설정 가능한 attribute를 포함한 object
 *                LDragDrop에 추가적으로 LDDProxy에 대해 유효한 속성들: resizeFrame, centerFrame, dragElId
 */
Rui.dd.LDDProxy = function(config) {
    config = config || {};
    Rui.dd.LDDProxy.superclass.constructor.call(this, config);
    if (config.id) {
        this.initFrame(); 
    }
};

/**
 * 기본 드래그 frame div id
 * @property dragElId
 * @type String
 * @static
 */
Rui.dd.LDDProxy.dragElId = 'ruiddfdiv';

Rui.extend(Rui.dd.LDDProxy, Rui.dd.LDD, {

    /**
     * 기본적으로 드래그하고 싶은 element와 사이즈를 같게 하기 위하여 
     * 드래그 frame을 리사이즈 한다.(이것은 프레임 효과를 얻을 것이다.)
     * 다른 행동을 원하는 경우 이것을 꺼버릴 수 있다.
     * @property resizeFrame
     * @private
     * @type boolean
     */
    resizeFrame: true,

    /**
     * 기본적으로 프레임은 드래그 element가 있는 곳에 정확하게 위치하며, 
     * Rui.dd.LDD에 의해 제공되는 커서 offset을 사용한다.
     * 커서를 중심으로 드래그 frame을 가진 obj를 포함하지 않는 경우에만 
     * 다른 옵션이 작동한다. 이 효과를 위해서 centerFrame을 true로 설정한다.
     * @property centerFrame
     * @private
     * @type boolean
     */
    centerFrame: false,

    /**
     * proxy element가 아직 존재하지 않는 경우 생성한다.
     * @method createFrame
     * @protected
     */
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
            /*
            * If the proxy element has no background-color, then it is considered to the 'transparent' by Internet Explorer.
            * Since it is 'transparent' then the events pass through it to the iframe below.
            * So creating a 'fake' div inside the proxy element and giving it a background-color, then setting it to an
            * opacity of 0, it appears to not be there, however IE still thinks that it is so the events never pass through.
            */
            Dom.setStyle(_data, 'background-color', '#ccc');
            Dom.setStyle(_data, 'opacity', '0');
            div.appendChild(_data);

            /*
            * It seems that IE will fire the mouseup event if you pass a proxy element over a select box
            * Placing the IFRAME element inside seems to stop this issue
            */
            if (Rui.browser.msie) {
                //Only needed for Internet Explorer
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

            // appendChild can blow up IE if invoked prior to the window load event
            // while rendering a table.  It is possible there are other scenarios 
            // that would cause this to happen as well.
            body.insertBefore(div, body.firstChild);
        }
    },

    /**
     * 드래그 frame element에 대한 초기화. 모든 subclass들의 생성자에서 호출되어야 한다.
     * @method initFrame
     * @private
     */
    initFrame: function() {
        this.createFrame();
    },

    applyConfig: function() {
        Rui.dd.LDDProxy.superclass.applyConfig.call(this);

        this.resizeFrame = (this.attributes.resizeFrame !== false);
        this.centerFrame = (this.attributes.centerFrame);
        this.setDragElId(this.attributes.dragElId || Rui.dd.LDDProxy.dragElId);
    },

    /**
     * 드래그 frame을 클릭된 object의 수치로 리사이즈하고 object의 위로 위치시키고,
     * 최종적으로 그것을 표시한다.
     * @method showFrame
     * @private
     * @param {int} iPageX X click position
     * @param {int} iPageY Y click position
     */
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

    /**
     * proxy는 resizeFrame가 false로 설정되어 있지 않다면, 드래그가 초기화 될때
     * 연결된 element의 수치로 자동적으로 리사이즈 된다.
     * @method _resizeProxy
     * @private
     */
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

    // overrides Rui.dd.LDragDrop
    b4MouseDown: function(e) {
        this.setStartPosition();
        var x = Rui.util.LEvent.getPageX(e);
        var y = Rui.util.LEvent.getPageY(e);
        this.autoOffset(x, y);

        // This causes the autoscroll code to kick off, which means autoscroll can
        // happen prior to the check for a valid drag handle.
        // this.setDragElPos(x, y);
    },

    // overrides Rui.dd.LDragDrop
    b4StartDrag: function(x, y) {
        // show the drag frame
        this.showFrame(x, y);
    },

    // overrides Rui.dd.LDragDrop
    b4EndDrag: function(e) {
        Rui.util.LDom.setStyle(this.getDragEl(), 'visibility', 'hidden'); 
    },

    // overrides Rui.dd.LDragDrop
    // By default we try to move the element to the last location of the frame.  
    // This is so that the default behavior mirrors that of Rui.dd.LDD.  
    endDrag: function(e) {
        var DOM = Rui.util.LDom;
        var lel = this.getEl();
        var del = this.getDragEl();

        // Show the drag frame briefly so we can get its position
        // del.style.visibility = '';
        DOM.setStyle(del, 'visibility', ''); 

        // Hide the linked element before the move to get around a Safari 
        // rendering bug.
        //lel.style.visibility = 'hidden';
        DOM.setStyle(lel, 'visibility', 'hidden'); 
        Rui.dd.LDDM.moveToEl(lel, del);
        //del.style.visibility = 'hidden';
        DOM.setStyle(del, 'visibility', 'hidden'); 
        //lel.style.visibility = '';
        DOM.setStyle(lel, 'visibility', ''); 
    },

    /**
     * 객체명
     * @method toString
     * @public
     * @return {String}
     */
    toString: function() {
        return ('LDDProxy ' + this.id);
    }
/**
* @event mouseDown
* @description Provides access to the mousedown event. The mousedown does not always result in a drag operation.
* @type Rui.util.LCustomEvent See <a href="Rui.LElement.html#addListener">Element.addListener</a> for more information on listening for this event.
*/

/**
* @event b4MouseDown
* @description Provides access to the mousedown event, before the mouseDownEvent gets fired. Returning false will cancel the drag.
* @type Rui.util.LCustomEvent See <a href="Rui.LElement.html#addListener">Element.addListener</a> for more information on listening for this event.
*/

/**
* @event mouseUp
* @description Fired from inside LDragDropManager when the drag operation is finished.
* @type Rui.util.LCustomEvent See <a href="Rui.LElement.html#addListener">Element.addListener</a> for more information on listening for this event.
*/

/**
* @event b4StartDrag
* @description Fires before the startDragEvent, returning false will cancel the startDrag Event.
* @type Rui.util.LCustomEvent See <a href="Rui.LElement.html#addListener">Element.addListener</a> for more information on listening for this event.
*/

/**
* @event startDrag
* @description Occurs after a mouse down and the drag threshold has been met. The drag threshold default is either 3 pixels of mouse movement or 1 full second of holding the mousedown. 
* @type Rui.util.LCustomEvent See <a href="Rui.LElement.html#addListener">Element.addListener</a> for more information on listening for this event.
*/

/**
* @event b4EndDrag
* @description Fires before the endDragEvent. Returning false will cancel.
* @type Rui.util.LCustomEvent See <a href="Rui.LElement.html#addListener">Element.addListener</a> for more information on listening for this event.
*/

/**
* @event endDrag
* @description Fires on the mouseup event after a drag has been initiated (startDrag fired).
* @type Rui.util.LCustomEvent See <a href="Rui.LElement.html#addListener">Element.addListener</a> for more information on listening for this event.
*/

/**
* @event drag
* @description Occurs every mousemove event while dragging.
* @type Rui.util.LCustomEvent See <a href="Rui.LElement.html#addListener">Element.addListener</a> for more information on listening for this event.
*/

/**
* @event b4Drag
* @description Fires before the dragEvent.
* @type Rui.util.LCustomEvent See <a href="Rui.LElement.html#addListener">Element.addListener</a> for more information on listening for this event.
*/

/**
* @event invalidDrop
* @description Fires when the dragged objects is dropped in a location that contains no drop targets.
* @type Rui.util.LCustomEvent See <a href="Rui.LElement.html#addListener">Element.addListener</a> for more information on listening for this event.
*/

/**
* @event b4DragOut
* @description Fires before the dragOutEvent
* @type Rui.util.LCustomEvent See <a href="Rui.LElement.html#addListener">Element.addListener</a> for more information on listening for this event.
*/

/**
* @event dragOut
* @description Fires when a dragged object is no longer over an object that had the onDragEnter fire. 
* @type Rui.util.LCustomEvent See <a href="Rui.LElement.html#addListener">Element.addListener</a> for more information on listening for this event.
*/

/**
* @event dragEnter
* @description Occurs when the dragged object first interacts with another targettable drag and drop object.
* @type Rui.util.LCustomEvent See <a href="Rui.LElement.html#addListener">Element.addListener</a> for more information on listening for this event.
*/

/**
* @event b4DragOver
* @description Fires before the dragOverEvent.
* @type Rui.util.LCustomEvent See <a href="Rui.LElement.html#addListener">Element.addListener</a> for more information on listening for this event.
*/

/**
* @event dragOver
* @description Fires every mousemove event while over a drag and drop object.
* @type Rui.util.LCustomEvent See <a href="Rui.LElement.html#addListener">Element.addListener</a> for more information on listening for this event.
*/

/**
* @event b4DragDrop
* @description Fires before the dragDropEvent
* @type Rui.util.LCustomEvent See <a href="Rui.LElement.html#addListener">Element.addListener</a> for more information on listening for this event.
*/

/**
* @event dragDrop
* @description Fires when the dragged objects is dropped on another.
* @type Rui.util.LCustomEvent See <a href="Rui.LElement.html#addListener">Element.addListener</a> for more information on listening for this event.
*/

});
/**
 * 이동이 아닌, 대상이 드랍될 수 있는 LDragDrop 구현.
 * You would get the same result by simply omitting implementation 
 * for the event callbacks, but this way we reduce the processing cost of the 
 * event listener and the callbacks.
 * event callbakc에 대한 간단하게 생략된 구현에 의해 똑같은 결과를 얻을 수 있다.
 * 그러나 이러한 방법은 event listener나 callback의 처리 비용을 감소시킨다. 
 * @class LDDTarget
 * @extends Rui.dd.LDragDrop 
 * @constructor
 * @param {String} id 드랍 대상인 element의 id
 * @param {String} group 연관된 LDragDrop object들의 그룹
 * @param {object} attributes 설정 가능한 attribute를 포함한 object
 *                 LDragDrop에 추가적으로 LDDTarget에 대해 유효한 속성들: 
 *                    none
 */
Rui.dd.LDDTarget = function(config) {
    config = config || {};
    if (config.id) {
        this.initTarget(config.id, config.group, config.attributes);
    }
};

Rui.extend(Rui.dd.LDDTarget, Rui.dd.LDragDrop, {

    /**
     * 객체명
     * @method toString
     * @public
     * @return {String}
     */
    toString: function() {
        return ('LDDTarget ' + this.id);
    }
});
Rui.namespace('Rui.data');
/**
 * LDataSet
 * @module data
 * @requires Rui, event
 * @title LDataSet Utility
 */
(function(){
    /**
     * 콤포넌트와 연계된 데이터를 처리하는 객체
     * @namespace Rui.data
     * @class LDataSet
     * @extends Rui.util.LEventProvider
     * @constructor LDataSet
     * @sample default
     * @param {Object} config The intial LDataSet.
     */
    Rui.data.LDataSet = function(config){
        config = config || {};
        config = Rui.applyIf(config, Rui.getConfig().getFirst('$.base.dataSet.defaultProperties'));
        Rui.applyObject(this, config);
        /**
         * @description fields의 내용을 모둔 변경하면 수행하는 이벤트 setFields ...등
         * @event fieldsChanged
         * @param {Object} target this객체
         */
        this.createEvent('fieldsChanged');
        /**
         * @description 데이터 전체의 구조가 변경될 경우 수행하는 이벤트 sort, filter ...등
         * @event dataChanged
         * @private
         * @param {Object} target this객체
         * @param {boolean} moveRow dataChanged 이벤트 수행 후 -1번 위치로 이동할지 지정할 row 이동할지 여부 (false: 이동안함, true: focusRow메소드 발생, -1보다 클 경우 setRow 호출)
         * @param {boolean} forceRow setRow 수행시 강제로 rowPosChanged 이벤트를 발생시킬지 여부
         */
        this.createEvent('dataChanged');
        /**
         * @description Record 객체가 추가될 경우 수행하는 이벤트
         * @event add
         * @sample default
         * @param {Object} target this객체
         * @param {Rui.data.LRecord} record record객체
         * @param {int} row row의 값
         */
        this.createEvent('add');
        /**
         * @description Record객체의 값이 변경될 경우 수행하는 이벤트
         * @event update
         * @sample default
         * @param {Object} target this객체
         * @param {Rui.data.LRecord} record record객체
         * @param {int} row row의 값
         * @param {int} col col의 값
         * @param {String} rowId row의 record id값
         * @param {String} colId col의 column field id값
         * @param {Object} value 값
         * @param {Object} originValue 원본값
         * @param {Object} beforeValue 이전값
         */
        this.createEvent('update');
        /**
         * @description Record객체가 삭제될 경우 수행하는 이벤트
         * @event remove
         * @sample default
         * @param {Object} target this객체
         * @param {Rui.data.LRecord} record record객체
         * @param {int} row row의 값
         */
        this.createEvent('remove');
        /**
         * @description load이 발생하기전 수행하는 이벤트
         * @event beforeLoad
         * @sample default
         */
        this.createEvent('beforeLoad');
        /**
         * @description 서버에서 데이터를 로딩한 후 메모리로 로딩하기전 호출되는 이벤트
         * @event beforeLoadData
         * @protected
         */
        this.createEvent('beforeLoadData');
        /**
         * @description load 메소드가 실행되면 호출되는 이벤트
         * @event load
         * @sample default
         * @param {Object} target this객체
         */
        this.createEvent('load');
        /**
         * @description load딩시 에러가 발생했을 경우 호출되는 이벤트
         * @event loadException
         * @sample default
         * @param {Object} target this객체
         * @param {Object} throwObject Exception 객체
         */
        this.createEvent('loadException');
        /**
         * @description Row가 변경되지전에 변경을 해도 되는지 체크하는 이벤트. 일반적으로 유효성 체크로 사용
         * @event canRowPosChange
         * @sample default
         * @param {Object} target this객체
         * @param {int} row target 위치
         * @param {int} oldRow 현재 row 위치
         */
        this.createEvent('canRowPosChange');
        /**
         * @description Row의 변경이 된 후 수행하는 이벤트
         * @event rowPosChanged
         * @sample default
         * @param {Object} target this객체
         * @param {int} row 현재 위치
         * @param {int} oldRow 이전 위치
         */
        this.createEvent('rowPosChanged');
        /**
         * @description commit시 발생하는 이벤트
         * @event commit
         * @param {Object} target this객체
         */
        this.createEvent('commit');
        /**
         * @description undo시 발생하는 이벤트
         * @event undo
         * @sample default
         * @param {Object} target this객체
         * @param {int} row 현재 위치
         * @param {Rui.data.LRecord} record record 객체
         * @param {int} beforeState 이전 Record 상태 (Rui.data.LRecord.STATE_NORMAL | Rui.data.LRecord.STATE_INSERT | Rui.data.LRecord.STATE_UPDATE | Rui.data.LRecord.STATE_DELETE)
         */
        this.createEvent('undo');
        /**
         * @description row가 선택이 가능한지 여부를 리턴하는 이벤트
         * @event canMarkable
         * @sample default
         * @param {Object} target this객체
         * @param {int} row 현재 위치
         */
        this.createEvent('canMarkable');
        /**
         * @description marked를 호출 할 수 있는지 여부 이벤트
         * @event marked
         * @sample default
         * @param {Object} target this객체
         * @param {int} row 현재 위치
         * @param {boolean} isSelect 선택 여부
         * @param {Rui.data.LRecord} record record 객체
         */
        this.createEvent('marked');
        /**
         * @description setMarkAll메소드나 clearMark 메소드가 호출되면 발생하는 이벤트
         * @event allMarked
         * @sample default
         * @param {Object} target this객체
         * @param {boolean} isSelect 선택 여부
         */
        this.createEvent('allMarked');
        /**
         * @description 데이터의 row가 invalid될 경우 호출되는 이벤트
         * @event invalid
         * @param {Object} target this객체
         * @param {int} row row의 위치값
         * @param {String} colId field의 아이디
         * @param {String} message 출력될 메시지
         * @param {Object} value 값
         */
        this.createEvent('invalid');
        /**
         * @description 데이터의 row가 valid될 경우 호출되는 이벤트
         * @event valid
         * @param {Object} target this객체
         * @param {int} row row의 위치값
         * @param {String} colId field의 아이디
         */
        this.createEvent('valid');
        /**
         * @description 데이터의 row의 state가 변경되는 경우 호출되는 이벤트
         * @event stateChanged
         * @param {Object} target this객체
         * @param {Rui.data.LRecord} record record객체
         * @param {int} state state값
         * @param {int} beforeState 이전 state값
         */
        this.createEvent('stateChanged');
        
        this.dataSetId = this.dataSetId || Rui.id();
        
        Rui.data.LDataSet.superclass.constructor.call(this);
        
        /**
         * @description Record정보를 가지는 Collection객체
         * @property data
         * @private
         * @type {Rui.util.LCollection}
         */
        this.data = new Rui.util.LCollection();
        
        /**
         * @description Select된 LRecord id정보를 객체
         * @property selectedData
         * @private
         * @type {Rui.util.LCollection}
         */
        this.selectedData = new Rui.util.LCollection();
        
        /**
         * @description 변경 Record정보를 가지는 Collection객체
         * @property modified
         * @private
         * @type {Rui.util.LCollection}
         */
        this.modified = new Rui.util.LCollection();
        
        /**
         * @description 데이터셋의 초기값을 가지는 Collection객체
         * @property snapshot
         * @private
         * @type {Rui.util.LCollection}
         */
        this.snapshot = new Rui.util.LCollection();
        
        this.invalidData = {};
        
        this.setFields(config.fields);
        
        if (this.defaultLoadExceptionHandler === true || this.defaultFailureHandler === true) {
            var loadExceptionHandler = Rui.getConfig().getFirst('$.base.dataSet.loadExceptionHandler');
            this.on('loadException', loadExceptionHandler, this, true);
        }
        
        this.init();
        delete config;
        Rui.devGuide(this, 'LDataSet_constructor');
    };

    var _DS = Rui.data.LDataSet;     

    // array type
    _DS.DATA_TYPE = 0;
    _DS.DATA_CHANGED_TYPE1 = 0; // row 데이터건이 바뀔 경우
    _DS.DATA_CHANGED_TYPE2 = 1; // row 데이터건이 안 바뀔 경우

    Rui.extend(Rui.data.LDataSet, Rui.util.LEventProvider, {
        otype: 'Rui.data.LDataSet',
        /**
         * @description 데이터 처리 방식 (기본 0:Array)
         * @property dataSetType
         * @private
         * @type {int}
         */
        dataSetType: Rui.data.LDataSet.DATA_TYPE,
        /**
         * @description 현재 위치
         * @property rowPosition
         * @private
         * @type {int}
         */
        rowPosition: -1,
        /**
         * @description dataSet의 id
         * @config id
         * @type {String}
         * @default null
         */
        /**
         * @description dataSet의 id
         * @property id
         * @type {String}
         */
        id: null,
        /**
         * @description 데이터 load 후에 선택될 레코드를 지정한다. 
         * 기본값은 -1이며, 0 이상의 값을 입력시 해당 행의 레코드가 focus된다.
         * @config focusFirstRow
         * @sample default
         * @type {int}
         * @default -1
         */
        /**
         * @description 데이터 load 후에 선택될 레코드를 지정한다. 
         * 기본값은 -1이며, 0 이상의 값을 입력시 해당 행의 레코드가 focus된다.
         * @property focusFirstRow
         * @private
         * @type {int}
         */
        focusFirstRow: -1,
        /**
         * @description Field 정보를 가지는 배열
         * @config fields
         * @sample default
         * @type {Array}
         * @default null
         */
        /**
         * @description Field 정보를 가지는 배열
         * @property fields
         * @protected
         * @type {Array}
         */
        fields: null,
        /**
         * @description 최종 Option정보를 가지는 객체
         * @property lastOptions
         * @protected
         * @type {Object}
         */
        lastOptions: null,
        /**
         * @description server에서 return된 metaData의 total count, 전체 record수이며, paging시에는 전체 count 수이다.
         * @property totalCount
         * @protected
         * @type {int}
         */
        totalCount: null,
        /**
         * @description response timeout 시간 (async일때만 작동함.)
         * @config timeout
         * @type {int}
         * @default null
         */
        /**
         * @description response timeout 시간 (async일때만 작동함.)
         * @property timeout
         * @protected
         * @type {int}
         */
        timeout: null,
        /**
         * @description canMarkable 이벤트를 수행할 지 여부
         * (사용할 경우 성능 저하가 발생합니다. 꼭 필요한 경우만 사용하세요.)
         * @config canMarkableEvent
         * @type {boolean}
         * @default false
         */
        /**
         * @description canMarkable 이벤트를 수행할 지 여부
         * 이 기능을 활성화 하면 LSelectionColumn을 사용할 때 
         * (사용할 경우 성능 저하가 발생합니다. 꼭 필요한 경우만 사용하세요.)
         * @property canMarkableEvent
         * @protected
         * @type {boolean}
         */
        canMarkableEvent: false,
        /**
         * @description invalid된 데이터의 정보
         * @property invalidData
         * @protected
         * @type {Object}
         */
        invalidData: null,
        /**
         * @description 삭제시 삭제건으로 처리하지 않고 state만 바꾼다.
         * @config remainRemoved
         * @type {boolean}
         * @default false
         */
        /**
         * @description 삭제시 삭제건으로 처리하지 않고 state만 바꾼다.
         * @property remainRemoved
         * @protected
         * @type {boolean}
         */
        remainRemoved: false,
        /**
         * @description 배치 처리 여부
         * @property isBatch
         * @protected
         * @type {boolean}
         */
        isBatch: false,
        /**
         * @description rui_config.js 에 있는 기본 failure handler를 사용할지 여부를 리턴한다.
         * @config defaultFailureHandler
         * @type {boolean}
         * @default false
         */
        /**
         * @description rui_config.js 에 있는 기본 failure handler를 사용할지 여부를 리턴한다.
         * @property defaultFailureHandler
         * @protected
         * @type {boolean}
         */
        defaultFailureHandler: false,
        /**
         * @description 서버에서 받은 데이터가 기존에 받은 데이터와 같으면 데이터를 로딩하지 않는다. (같은 데이터면 모든 이벤트도 작동 안함)
         * @config loadCache
         * @type {boolean}
         * @default false
         */
        /**
         * @description 서버에서 받은 데이터가 기존에 받은 데이터와 같으면 데이터를 로딩하지 않는다. (같은 데이터면 모든 이벤트도 작동 안함)
         * @property loadCache
         * @protected
         * @type {boolean}
         */
        loadCache: false,
        /**
         * @description ajax request를 호출할 때 GET 방식으로 처리할 지 POST방식으로 처리할 지 결정한다.
         * @config method
         * @type {String}
         * @default POST
         */
        /**
         * @description ajax request를 호출할 때 GET 방식으로 처리할 지 POST방식으로 처리할 지 결정한다.
         * @property method
         * @protected
         * @type {String}
         */
        method: 'POST',
        /**
         * @description DataSet을 serialize할 때 metaData를 포함할지 여부.
         * @config serializeMetaData
         * @type {boolean}
         * @default true
         */
        /**
         * @description DataSet을 serialize할 때 metaData를 포함할지 여부.
         * @property serializeMetaData
         * @protected
         * @type {boolean}
         */
        serializeMetaData: true,
        /**
         * @description 대량건의 데이터를 로딩할 경우 timer로 처리하여 ie에서 스크립트 로딩 메시지가 출력하지 않게 한다.
         * @config lazyLoad
         * @type {boolean}
         * @default false
         */
        /**
         * @description 대량건의 데이터를 로딩할 경우 timer로 처리하여 ie에서 스크립트 로딩 메시지가 출력하지 않게 한다.
         * @property lazyLoad
         * @protected
         * @type {boolean}
         */
        lazyLoad: false,
        /**
         * @description 대량건의 데이터를 몇건씩 분할하여 처리할 것인지 결정하는 속성 
         * @config lazyLoadCount
         * @type {Int}
         * @default 5000
         */
        /**
         * @description 대량건의 데이터를 몇건씩 분할하여 처리할 것인지 결정하는 속성
         * @property lazyLoadCount
         * @protected
         * @type {Int}
         */
        lazyLoadCount: 5000,
        /**
         * @description 대량건의 데이터를 분할하여 처리할 때 timer의 시간(ms)
         * @config lazyLoadTime
         * @type {Int}
         * @default 50
         */
        /**
         * @description 대량건의 데이터를 분할하여 처리할 때 timer의 시간(ms)
         * @property lazyLoadTime
         * @protected
         * @type {Int}
         */
        lazyLoadTime: 50,
        /**
         * @description sortable을 멀티 필드로 적용할지 여부를 결정한다.
         * @config multiSortable
         * @type {Boolean}
         * @default true
         */
        /**
         * @description sortable을 멀티 필드로 적용할지 여부를 결정한다.
         * @property multiSortable
         * @protected
         * @type {Boolean}
         */
        multiSortable: true,
        /**
         * @description 객체의 이벤트 초기화 메소드
         * @method init
         * @protected
         * @return {void}
         */
        init: function(){
        },
        /**
         * @description idx위치에 Record객체를 추가하고 add 이벤트를 발생시킨다.
         * @method insert
         * @sample default
         * @public
         * @param {int} idx 입력 위치값
         * @param {Rui.data.LRecord} record 입력하고자 하는 record 객체
         * @param {Object} option [optional] 환경정보 객체
         * <div class='param-options'>
         * ignoreEvent {boolean} 이벤트 무시
         * </div>
         * @return {int} row 값
         */
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
        /**
         * @description Record객체를 추가한다. 이 메소드는 다른 DataSet에 포함된 record객체를 add 하면 안된다.
         * @method add
         * @public
         * @sample default
         * @param {Rui.data.LRecord} record 입력하고자 하는 record 객체
         * @param {Object} option [optional] 환경정보 객체
         * @return {int} row 값
         */
        add: function(record, option){
            return this.insert(this.data.length, record, option);
        },
        /**
         * @description 배열에 들어있는 LRecord객체들을 한꺼번에 추가한다.
         * @method addAll
         * @private
         * @param {Rui.data.LRecord} records 입력하고자 하는 record 객체 배열
         * @param {Object} option [optional] 환경정보 객체
         * @return {void}
         */
        addAll: function(records, option){
            for (var i = 0; i < records.length; i++) {
                this.add(records[i].clone(), option);
            }
        },
        /**
         * @description id로 Record 객체를 삭제한다. (성능이 낮음)
         * @method remove
         * @public
         * @param {String} key 지우고자 하는 키값
         * @param {Object} option [optional] 환경정보 객체
         * @return {Rui.data.LRecord} 삭세된 Record객체
         */
        remove: function(key, option){
            var idx = this.indexOfKey(key);
            if(idx < 0) return null;
            this.removeAt(idx, option); 
        },
        /**
         * @description Record객체를 삭제하고 remove 이벤트를 발생시킨다.
         * @method removeAt
         * @public
         * @sample default
         * @param {int} index 지우고자 하는 위치값
         * @param {Object} option [optional] 환경정보 객체
         * @return {Rui.data.LRecord} 삭세된 Record객체
         */
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
        /**
         * @description 모든 Record객체를 지우고 dataChanged 이벤트를 발생시킨다.
         * @method removeAll
         * @public
         * @sample default
         * @param {Object} option [optional] 환경정보 객체
         * @return {void}
         */
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
        /**
         * @description fields 정보를 제외한 모든 정보를 초기화 한다.
         * @method clearData
         * @public
         * @sample default
         * @param {Object} option [optional] 환경정보 객체
         * @return {void}
         */
        clearData: function(option){
            option = option || {};
            var count = this.getCount();
            var event = (count > 0 || this.modified.length > 0 || this.snapshot.length > 0);
            //this.data = null;
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
        /**
         * @description Id에 해당되는 Record객체를 리턴한다.
         * @method get
         * @public
         * @sample default
         * @param {String} id 얻고자 하는 Record객체의 아이디
         * @return {Rui.data.LRecord} 아이디에 해당되는 LRecord 객체
         */
        get: function(id){
            return this.data.get(id);
        },
        /**
         * @description 위치값에 해당되는 Record객체를 리턴한다.
         * @method getAt
         * @public
         * @sample default
         * @param {int} idx 얻고자 하는 Record객체의 위치값
         * @return {Rui.data.LRecord} 아이디에 해당되는 LRecord 객체
         */
        getAt: function(idx){
            return this.data.getAt(idx);
        },
        /**
         * @description Id에 해당되는 Record의 index를 리턴한다.
         * @method indexOfKey
         * @public
         * @sample default
         * @param {String} id 얻고자 하는 Record객체의 아이디
         * @return {int}
         */
        indexOfKey: function(id){
            return this.data.indexOfKey(id);
        },
        /**
         * @description Id에 해당되는 Record의 index를 리턴한다.
         * 주의! 이 메소드는 내부에서 전체 레코드를 대상으로 결과 index를 검색하므로 사용시 성능저하가 발생될 수 있습니다.
         * @method findRow
         * @public
         * @sample default
         * @param {String} fieldName 검색할 field명
         * @param {String} value 검색할 field의 값
         * @param {int} startIndex [optional] 검색 시작할 index
         * @return {int}
         */
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
        /**
         * @description id정보에 해당되는 field 배열 index를 리턴
         * @method getFieldIndex
         * @sample default
         * @param {String} id field의 Id
         * @return {int}
         */
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
        /**
         * @description id정보에 해당되는 {Rui.data.LField} 객체 리턴
         * @method getFieldById
         * @sample default
         * @param {String} id field의 Id
         * @return {Rui.data.LField}
         */
        getFieldById: function(id){
            var idx = this.getFieldIndex(id);
            if (idx > -1) {
                return this.fields[idx];
            } else {
                return null;
            }
        },
        /**
         * @description DataSet객체 정보를 모두 지운다. (이벤트 포함)
         * @method destroy
         * @public
         * @return {void}
         */
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
        /**
         * @description URL을 통해 데이터정보를 읽어온다.
         * @method load
         * @public
         * @sample default
         * @param {Object} options 환경정보 객체
         * <div class='param-options'>
         * url {String} 서버 호출 url<br>
         * params {Object} 서버에 전달할 파라미터 객체<br>
         * method {String} get or post<br>
         * sync {boolean} sync 여부 (default : false)<br>
         * state {Rui.data.LRecord.STATE_INSERT|Rui.data.LRecord.STATE_UPDATE|Rui.data.LRecord.STATE_DELETE} load시 record의 기본 상태
         * dataSetId {String} 서버에서 받아온 결과값의 dataSet의 id
         * </div>
         * @return {void}
         */
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
        /**
         * @description URL을 통해 데이터정보를 읽어온다.
         * @method doSuccess
         * @private
         * @param {Object} dataSet LDataSet 객체
         * @param {Object} conn 응답 객체
         * @return {void}
         */
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
                //var dataSetData = this.getReadData(conn);
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
        /**
         * @description 현재 DataSet 기준으로 결과 데이터를 Object로 변환하여 리턴
         * @method getReadData
         * @sample default
         * @param {Object} conn 응답 객체
         * @return {Object}
         */
        getReadData: function(conn, config){
            return {
                records: this.getReadDataMulti(this, conn, config)
            };
        },
        /**
         * @description 현재 DataSet 기준으로 결과 데이터를 Object로 변환하여 리턴
         * @method getReadResponseData
         * @param {Object} conn 응답 객체
         * @return {Object}
         */
        getReadResponseData: function(conn) {
            var data = null;
            try{
                // eval이 multi load시 반복 수행됨.
                if(Rui.isDebugTI)
                    Rui.log('dataSet load start', 'time');
                if(this._cachedData) return this._cachedData; // LDataSetManager의 캐쉬 데이터                
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
        /**
         * @description 결과 데이터를 Array로 변환하여 리턴
         * @method getReadDataMulti
         * @private
         * @param {Object} dataSet LDataSet 객체
         * @param {Object} conn 응답 객체
         * @return {Array]
         */
        getReadDataMulti: function(dataSet, conn, config){
            throw new Rui.LException('구현 안됨.');
        },
        /**
         * @description 신규 Record객체를 생성하고 row위치를 이동한다. 생성된 레코드는 DataSet에 반영된 상태이다. 반복적인 레코드 추가는 반드시 add 메소드를 이용한다. 성능차이가 많이 발생됨.
         * @method newRecord
         * @public
         * @sample default
         * @param {int} idx [optional] 위치
         * @param {Object} option [optional] option객체
         * <div class='param-options'>
         * isInitData {boolean} 데이터를 초기화할지 여부를 설정<br>
         * moveRow {boolean} record 추가시 해당 위치로 이동할지 여부
         * </div>
         * @return {int}
         */
        newRecord: function(idx, option){
            if (idx < 0) return;
            Rui.devGuide(this, 'LDataSet_newRecord');
            //신규 생성후 해당 행으로 이동 부분 option추가 - 채민철K
            option = Rui.applyIf(option ||
            {}, {
                initData: true,
                moveRow: true
            });
            var id = Rui.data.LRecord.getNewRecordId();
            //            var state = Rui.data.LRecord.STATE_INSERT;
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
        /**
         * @description Record객체를 생성한다. 생성된 레코드는 DataSet에 반영되지 않은 상태이다. 순수하게 LRecord객체만 생성된다.
         * @method createRecord
         * @public
         * @sample default
         * @param {Object} data 데이터 객체
         * @param {Object} option [optional] option 객체
         * @return {Rui.data.LRecord}
         */
        createRecord: function(arrayData, option){
            try {
                option = Rui.applyIf(option || {}, { id: null });
                
                option.fields = this.fields;
                //option.dataSet = this;
                
                return new Rui.data.LRecord(arrayData, option);
            } finally {
                option = null;
            }
        },
        /**
         * @description record의 값이 변경되면 호출되는 이벤트
         * @method onFieldChanged
         * @protected
         * @param {Object} e event객체
         * @return {void}
         */
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
        /**
         * @description record의 state값이 변경되면 호출되는 이벤트
         * @method onStateChanged
         * @protected
         * @param {Object} e event객체
         * @return {void}
         */
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
        /**
         * @description data에서 Record형 객체를 읽어온다.
         * @method loadRecord
         * @private
         * @param {Object} data 데이터 객체
         * @param {Object} options 환경정보 객체
         * <div class='param-options'>
         * add {boolean} 신규 여부
         * </div>
         * @return {void}
         */
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
        /**
         * @description data를 읽어온다.
         * @method loadData
         * @public
         * @sample default
         * @param {Object} data 데이터 객체
         * @param {Object} options [optional] 환경정보 객체
         * <div class='param-options'>
         *  state {Rui.data.LRecord.STATE_INSERT|Rui.data.LRecord.STATE_UPDATE|Rui.data.LRecord.STATE_DELETE} load시 record의 기본 상태
         * </div>
         * @return {void}
         */
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
                            // if (this.lastSortInfo.fieldName) 
                            //     this.sortField(this.lastSortInfo.fieldName, this.lastSortInfo.direction);
                            // else 
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
                            
                            Rui.devGuide(this, 'LDataSet_load');
                        } catch(e) {
                            this.isLoadException = true;
                            if(this.fireEvent('loadException', {
                                type: 'loadException',
                                target: this,
                                throwObject: e
                            }) !== false)
                                //throw new Rui.LException(e);
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
                    //dataRecords = null;
                }
            }
            options = null;
        },
        /**
         * @description 데이터의 갯수를 리턴한다.
         * @method getCount
         * @public
         * @sample default
         * @return {int} 결과값
         */
        getCount: function(){
            return this.data.length;
        },
        /**
         * @description 변경된 데이터 정보를 리턴한다.
         * @method getModifiedRecords
         * @public
         * @sample default
         * @return {Rui.util.LCollection} 변경된 Record객체 배열
         */
        getModifiedRecords: function(){
            return this.modified == null ? new Rui.util.LCollection() : this.modified;
        },
        /**
         * @description 데이터 정보를 문자열로 리턴한다.
         * @method serialize
         * @public
         * @sample default
         * @return {String} 문자열
         */
        serialize: function(){
            var result = [];
            for (var i = 0; i < this.getCount(); i++) {
                var record = this.getAt(i);
                result.push(record.serialize());
            }
            
            return result.join('&');
        },
        /**
         * @description 변경된 데이터 정보를 문자열로 리턴한다.
         * @method serializeModified
         * @param {boolean} isAll [optional] true일 경우 변경된 전체 데이터를 리턴
         * @public
         * @sample default
         * @return {String} 변경된 문자열
         */
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
        /**
         * @description 선택된 데이터 정보를 문자열로 리턴한다.
         * @method serializeMarkedOnly
         * @public
         * @sample default
         * @return {String} 변경된 문자열
         */
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
        /**
         * @description LDataSet 배열의 데이터 정보를 리턴한다.
         * @method serializeDataSetList
         * @protected
         * @param {Array} dataSets 데이터 객체 배열
         * @return {String}
         */
        serializeDataSetList: function(dataSets){
            var params = [];
            for (var i = 0; i < dataSets.length; i++) {
                var dataSetEl = Rui.util.LDom.get(dataSets[i]);
                params.push(dataSetEl.serialize());
            }
            return params.join('&');
        },
        /**
         * @description LDataSet 배열의 변경된 데이터 정보를 리턴한다.
         * @method serializeModifiedDataSetList
         * @protected
         * @param {Array} dataSets 데이터 객체 배열
         * @return {String}
         */
        serializeModifiedDataSetList: function(dataSets){
            var params = [];
            for (var i = 0; i < dataSets.length; i++) {
                var dataSetEl = Rui.util.LDom.get(dataSets[i]);
                params.push(dataSetEl.serializeModified());
            }
            return params.join('&');
        },
        /**
         * @description LDataSet 배열의 선택된 데이터 정보를 리턴한다.
         * @method serializeMarkedOnlyDataSetList
         * @protected
         * @param {Array} dataSets 데이터 객체 배열
         * @return {String}
         */
        serializeMarkedOnlyDataSetList: function(dataSets){
            var params = [];
            for (var i = 0; i < dataSets.length; i++) {
                var dataSetEl = Rui.util.LDom.get(dataSets[i]);
                params.push(dataSetEl.serializeMarkedOnly());
            }
            return params.join('&');
        },
        /**
         * @description 변경된 데이터 정보를 확정한다.
         * @method commit
         * @public
         * @return {void}
         */
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
        /**
         * @description record들을 모두 commit한다.
         * @method commitRecords
         * @protected
         * @return {void}
         */
        commitRecords: function() {
            this.data.each(function(id, record){
                record.commit();
            }, this.data);
        },
        /**
         * @description idx에 해당되는 Record를 복원한다.
         * @method undo
         * @public
         * @sample default
         * @param {int} idx 복원하고자 하는 위치값
         * @return {void}
         */
        undo: function(idx){
            var record = this.data.getAt(idx);
            var state = record.state;
            if (state == Rui.data.LRecord.STATE_NORMAL) 
                return;
            record.undo();
            this.modified.remove(record.id);
            if (state == Rui.data.LRecord.STATE_INSERT) 
                // 신규건일때는 record에서 수정건에 대해서 처리 못함.
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
        /**
         * @description 전체 데이터를 초기 로딩데이터로 복원한다.
         * @method undoAll
         * @public
         * @sample default
         * @return {void}
         */
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
            //this.modified = new Rui.util.LCollection();
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
        /**
         * @description DataSet의 dataChanged 이벤트를 수행한다.
         * @method dataChanged
         * @public
         * @return {void}
         */
        dataChanged: function(){
            if(this.isBatch !== true) {
                this.fireEvent('dataChanged', {
                    type: 'dataChanged',
                    target: this,
                    eventType: _DS.DATA_CHANGED_TYPE1
                });
            }
        },
        /**
         * @description 현재 위치가 선택이 안되어 있으면 현재 위치를 셋팅하는 메소드
         * @method focusRow
         * @param {boolean} ignoreCanRowPosChange canRowPosChange 이벤트를 무시할지 여부
         * @private
         * @return {void}
         */
        focusRow: function(config){
            if(this.isBatch) return;
            config = Rui.applyIf(config ||
            {}, {
                ignoreCanRowPosChange: false,
                forceRow: false,
                row: this.getRow()
            });
            //try {
                var row = config.row;
                var count = this.getCount();
                if (count > 0 && row > -1) {
                    if (row > count - 1) {
                        config.forceRow = false;
                        this.setRow(count - 1, config); // forceRow가 없어야 함.
                    }
                    else 
                        this.setRow(row, config);
                }
                else {
                    this.setRow(-1, config);
                }
            /*} 
            catch (e1) {
                throw Rui.LException.getException(e1);
            }*/
        },
        /**
         * @description 현재 위치를 리턴
         * @method getRow
         * @public
         * @return {int} 현재 위치를 리턴
         */
        getRow: function(){
            return this.rowPosition;
        },
        /**
         * @description 현재 위치를 변경하기전에 canRowPosChange이벤트를 발생하여 이동 가능여부를 체크하고 가능하면 현재 위치를 변경한 후 rowPosChanged 이벤트를 발생시킨다.
         * @method setRow
         * @public
         * @sample default
         * @param {int} row 변경하고자 하는 위치값
         * @param {Object} config config 객체
         *                 (forceRow : [optional] 같은 위치가 선택되어도 다시 이벤트를 호출하게 하는 속성,
         *                 ignoreCanRowPosChange : [optional] canRowPosChange 이벤트를 무시할지 여부)
         * @return {boolean}
         */
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
        /**
         * @description row 위치를 변경 할 수 있는지 여부
         * @method doCanRowPosChange
         * @protected
         * @param {int} row 변경할 row 값
         * @return {boolean}
         */
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
        /**
         * @description row 위치를 변경
         * @method doRowPosChange
         * @protected
         * @param {int} row 변경할 row 값
         * @param {boolean} forceRow [optional] 같은 위치가 선택되어도 다시 이벤트를 호출하게 하는 속성
         * @return {boolean}
         */
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
        /**
         * @description 현재 Row가 Insert상태 여부 확인
         * @public
         * @sample default
         * @method isRowInserted
         * @param {int} row 상태 확인 위치
         * @return {boolean}
         */
        isRowInserted: function(row){
            if (row < 0) 
                return false;
            return this.getAt(row).state == Rui.data.LRecord.STATE_INSERT;
        },
        /**
         * @description 현재 Row가 Update상태 여부 확인
         * @public
         * @sample default
         * @method isRowUpdated
         * @param {int} row 상태 확인 위치
         * @return {boolean}
         */
        isRowUpdated: function(row){
            if (row < 0) 
                return false;
            return this.getAt(row).state == Rui.data.LRecord.STATE_UPDATE;
        },
        /**
         * @description 현재 Row가 delete상태 여부 확인. DataSet의 생성자속성의 remainRemoved값이 true일 경우만 사용이 가능하다.
         * @public
         * @method isRowDeleted
         * @param {int} row 상태 확인 위치
         * @return {boolean}
         */
        isRowDeleted: function(row){
            if (row < 0) 
                return false;
            return this.getAt(row).state == Rui.data.LRecord.STATE_DELETE;
        },
        /**
         * @description 현재 Row가 변경상태 여부 확인
         * @public
         * @sample default
         * @method isRowModified
         * @param {int} row 상태 확인 위치
         * @return {boolean}
         */
        isRowModified: function(row){
            return this.isRowInserted(row) || this.isRowUpdated(row) || this.isRowDeleted(row);
        },
        /**
         * @description DataSet에 변경정보가 존재하는지 확인
         * @method isUpdated
         * @public
         * @sample default
         * @return {boolean}
         */
        isUpdated: function(){
            return this.modified.length > 0 ? true : false;
        },
        /**
         * @description DataSet의 row 위치를 마크가 가능한지 체크하는 canMarkable 이벤트를 발생시킨다. 리턴값이 false이면 마크되지 않는다.
         * @method isMarkable
         * @public
         * @param {int} row 위치
         * @return {void}
         */
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
        /**
         * @description DataSet의 row 위치를 마크한다.
         * @method setMark
         * @public
         * @sample default
         * @param {int} row 위치
         * @param {boolean} isSelect 마크 여부
         * @return {void}
         */
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
        /**
         * @description DataSet의 row 위치 하나만 남기고 나머지는 모두 선택을 취소한다.
         * @method setMarkOnly
         * @public
         * @param {int} row 위치
         * @param {boolean} isSelect 마크 여부
         * @return {void}
         */
        setMarkOnly: function(row, isSelect){
            if (row < 0 || row > this.getCount())
                return;
            this.setDemarkExcept(row);
            this.setMark(row, isSelect);
        },
        /**
         * @description 지정된 row외의 DataSet에 선택된 row를 선택 false로 설정한다.
         * @method setDemarkExcept
         * @public
         * @sample default
         * @param {int} row 지정된 row index외의 select된 행을 false로 설정한다.
         * @return {void}
         */
        setDemarkExcept: function(row){
            //선택한 것 외에는 선택 해제하기
            if (this.getMarkedCount() > 0) {
                for (var i = 0; i < this.getCount(); i++) {
                    if (this.isMarked(i) && i != row) 
                        this.setMark(i, false);
                }
            }
        },
        /**
         * @description DataSet의 row 위치가 마크되어 있는지 리턴한다.
         * @method isMarked
         * @public
         * @sample default
         * @param {int} row 위치
         * @return {boolean} 마크 여부
         */
        isMarked: function(row){
            var record = this.getAt(row);
            if (record && this.selectedData.has(record.id)) 
                return true;
            else 
                return false;
        },
        /**
         * @description DataSet의 마크된 건수를 리턴한다.
         * @method getMarkedCount
         * @public
         * @return {int} 마크된 건수 리턴
         */
        getMarkedCount: function(){
            return this.selectedData.length;
        },
        /**
         * @description DataSet을 sInx부터 eInx까지 마크한다.
         * @method setMarkRange
         * @public
         * @sample default
         * @param {int} sInx 시작 위치
         * @param {int} eInx 종료 위치
         * @param {boolean} isSelect 마크 여부
         * @return {void}
         */
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
        /**
         * @description DataSet을 mark 모든 LRecord객체의 값을 가지는 LCollection을 리턴한다.
         * @method getMarkedRange
         * @public
         * @return {Rui.util.LCollection}
         */
        getMarkedRange: function() {
        	return this.selectedData;
        },
        /**
         * @description DataSet을 전체의 마크를 설정한다.
         * @method setMarkAll
         * @public
         * @sample default
         * @param {boolean} isSelect 마크 여부
         * @return {void}
         */
        setMarkAll: function(isSelect){
            // LCollection.remove 메소드  성능때문에 불필요한 소스 추가 ie6,7을 포기하면 아래의 소스는 지워야 함.
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
        /**
         * @description DataSet에 선택된 모든 마크 정보를 지운다.
         * @method clearMark
         * @public
         * @sample default
         * @return {void}
         */
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
        	// 메소드 삭제 예정 (2.2 이후 적절한 버전 릴리즈시 삭제요망) 
        	this.removeMarkedRows(option);
        },
        /**
         * @description DataSet에 마크된 row를 모두 삭제한다.
         * @method removeMarkedRows
         * @public
         * @sample default
         * @return {void}
         */
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
        /**
         * @description DataSet에 filter를 적용한다. 
         * function에서 true인 데이터만 남는다.
         * @method filter
         * @public
         * @sample default
         * @param {Function} fn 정보를 비교할 Function
         * @param {Object} scope [optional] scope정보 옵션
         * @param {boolean} focusRow [optional] 필터후 원 위치로 이동할지 여부(기본값 true)
         * @return {void}
         */
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
                //if (focusRow && this.getCount() > 0 && (r && rId != r.id))
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
        /**
         * @description DataSet에 적용된 filter를 지운다.
         * @method clearFilter
         * @public
         * @sample default
         * @return {void}
         */
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
                //if (focusRow && this.getCount() > 0 && (r && rId != r.id))
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
        /**
         * @description DataSet에 filter가 적용되었는지 여부
         * @method isFiltered
         * @public
         * @sample default
         * @return {void}
         */
        isFiltered: function(){
            return !!this._isFiltered;
        },
        /**
         * @description 변경건 이력을 인수에 해당되는 Collection에 추가한다.
         * @method mergeModifiedData
         * @private
         * @return {void}
         */
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
        /**
         * @description DataSet에 query에 해당되는 데이터를 리턴한다.
         * 주의! 이 메소드는 반복 사용시 성능저하가 발생될 수 있습니다.
         * @method query
         * @public
         * @param {Function} fn 정보를 비교할 Function
         * @param {Object} scope scope정보 옵션
         * @return {Rui.util.LCollection}
         */
        query: function(fn, scope){
            this.data = this.snapshot.clone();
            this.mergeModifiedData(this.data);
            return this.data.query(fn, scope || this);
        },
        /**
         * @description 서버에서 리턴한 DataSet의 총 갯수를 리턴한다.
         * @method getTotalCount
         * @public
         * @sample default
         * @return {int} 총갯수
         */
        getTotalCount: function(){
            return this.totalCount || this.snapshot.length;
        },
        /**
         * @description DataSet의 시작위치 부터 끝위치에 해당하는 Record배열을 리턴한다.
         * @method getRecords
         * @public
         * @param {int} startIndex 시작 위치
         * @param {int} endIndex 끝 위치
         * @return {Array}
         */
        getRecords: function(startIndex, endIndex){
            startIndex = startIndex || 0;
            endIndex = (Rui.isUndefined(endIndex) || (endIndex > this.getCount() - 1)) ? this.getCount() - 1 : endIndex;
            var recordList = new Array();
            
            for (var i = startIndex; i <= endIndex; i++) 
                recordList.push(this.getAt(i));
            
            return recordList;
        },
        /**
         * @description DataSet을 정렬한다.
         * 주의! 이 메소드는 반복 사용시 성능저하가 발생될 수 있습니다.
         * @method sort
         * @public
         * @param {Function} fn 정보를 비교할 Function
         * @param {String} desc 정렬 방식 [asc|desc]
         * @return {Array}
         */
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
            //this.selectedData.clear();
            //this.selectedData = new Rui.util.LCollection();

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
        /**
         * @description field에 해당하는 DataSet을 정렬한다.
         * @method sortField
         * @public
         * @param {String} fieldName field 명
         * @param {String} desc 정렬 방식 [asc|desc]
         * @return {boolean} desc 정렬 방식 [asc|desc]
         */
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
        /**
         * @description json형 object의 정보로 DataSet을 정렬한다. { col1: 'asc', col2: 'desc' }
         * @method sorts
         * @public
         * @param {Object} sortInfos sort할 정보
         * @return {void} 
         */
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
        /**
         * data의 reverse 메소드 수행
         * @method reverse
         * @return {void}
         */
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
        /**
         * 현재 정렬된 기준으로 sort 데이터를 확정한다. 메소드가 호출되면 데이터는 현재 그대로 남기고 정렬정보만 모두 초기화 된다.
         * @method commitSort
         * @return {viod} 
         */
        commitSort: function() {
            delete this.sortDirection;
            delete this.lastSortInfo;
        },
        /**
         * record의 row 위치를 리턴한다. 이 메소드는 데이터셋의 row 위치를 검색하므로 성능 느리니 권장하지 않는다.
         * @method indexOfRecord
         * @param record {Rui.data.LRecord} LRecord 객체
         * @return {int} Record의 row 위치
         */
        indexOfRecord: function(oRecord){
            if (oRecord)
                return this.data.indexOfKey(oRecord.id);
            return null;
        },
        /**
         * DataSet의 row 위치 데이터의 상태를 변경한다.
         * @method setState
         * @sample default
         * @param row {int} row 위치
         * @param state {Rui.data.LRecord.STATE_NORMAL|Rui.data.LRecord.STATE_INSERT|Rui.data.LRecord.STATE_UPDATE|Rui.data.LRecord.STATE_DELETE} state Record에 해당되는 상태값
         * @return {void}
         */
        setState: function(row, state){
            var record = this.getAt(row);
            if (record.state != state) 
                record.setState(state);
            //this.updateState(record);
        },
        /**
         * LRecord의 state에 따라 변경건을 등록한다.
         * @method updateState
         * @protected
         * @param {Rui.data.LRecord} record LRecord객체
         * @return {void}
         */
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
        /**
         * DataSet의 fields의 모든 항목을 변경한다.
         * @method setFields
         * @sample default
         * @param {Array} fields 위치
         * @return {void}
         */
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
        /**
         * DataSet의 fields의 모든 항목을 리턴한다.
         * @method getFields
         * @return {Array}
         */
        getFields: function(){
            return this.fields;
        },
        /**
         * DataSet의 row 위치 데이터의 상태를 반환한다.
         * @method getState
         * @param {int} row row 위치
         * @return {int} {Rui.data.LRecord.STATE_NORMAL|Rui.data.LRecord.STATE_INSERT|Rui.data.LRecord.STATE_UPDATE|Rui.data.LRecord.STATE_DELETE} state Record에 해당되는 상태값
         */
        getState: function(row){
            var record = this.getAt(row);
            return record ? record.state : Rui.data.LRecord.STATE_NORMAL;
        },
        /**
         * @description DataSet를 newId객체로 복사하여 리턴한다.
         * @method clone
         * @public
         * @sample default
         * @param {String|Object} newId 신규 DataSet객체 id 문자거나 id와 fields가 필수로 들어 있는 config객체
         * @return {Rui.data.LDataSet}
         */
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
        /**
         * @description DataSet의 row와 col의 값을 리턴한다.
         * @method getValue
         * @public
         * @sample default
         * @param {int} row row의 위치
         * @param {int} col col의 위치
         * @return {Object}
         */
        getValue: function(row, col){
            if (col < 0 || col > this.fields.length - 1) 
                return null;
            var colId = this.fields[col].id;
            return this.getNameValue(row, colId);
        },
        /**
         * @description DataSet의 row와 col의 값을 리턴한다.
         * @method getNameValue
         * @public
         * @sample default
         * @param {int} row row의 위치
         * @param {String} colId col의 Id
         * @return {Object}
         */
        getNameValue: function(row, colId){
            if (row < 0 || row > this.getCount() - 1) 
                return null;
            var record = this.getAt(row);
            return record.get(colId);
        },
        /**
         * @description DataSet의 row와 col의 값을 셋팅한다.
         * @method setValue
         * @public
         * @sample default
         * @param {int} row row의 위치
         * @param {int} col col의 위치
         * @param {Object} value value 값
         * @return {Object}
         */
        setValue: function(row, col, value, option){
            if (col < 0 || col > this.fields.length - 1) 
                throw new Rui.LException('Invalid col');
            var colId = this.fields[col].id;
            this.setNameValue(row, colId, value, option);
        },
        /**
         * @description DataSet의 row와 colId의 값을 셋팅한다.
         * @method setNameValue
         * @public
         * @sample default
         * @param {int} row row의 위치
         * @param {String} colId col의 Id
         * @param {Object} value value 값
         * @return {Object}
         */
        setNameValue: function(row, colId, value, option){
            if (row < 0 || row > this.getCount() - 1) 
                throw new Rui.LException('Invalid row');
            var record = this.getAt(row);
            record.set(colId, value, option);
        },
        /**
         * @description DataSet의 colId의 해당되는 컬럼값의 합계를 리턴한다.
         * 주의! 이 메소드는 반복 사용시 성능저하가 발생될 수 있습니다.
         * @method sum
         * @param {String} colId col의 Id
         * @param {int} startRow [optional] row의 시작위치
         * @param {int} endRow [optional] row의 종료위치
         * @return {int}
         */
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
        /**
         * @description DataSet의 colId의 해당되는 컬럼값의 max를 리턴한다.
         * 주의! 이 메소드는 반복 사용시 성능저하가 발생될 수 있습니다.
         * @method max
         * @param {String} colId col의 Id
         * @param {int} startRow [optional] row의 시작위치
         * @param {int} endRow [optional] row의 종료위치
         * @return {int}
         */
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
        /**
         * @description DataSet의 colId의 해당되는 컬럼값의 max를 리턴한다.
         * 주의! 이 메소드는 반복 사용시 성능저하가 발생될 수 있습니다.
         * @method min
         * @param {String} colId col의 Id
         * @param {int} startRow [optional] row의 시작위치
         * @param {int} endRow [optional] row의 종료위치
         * @return {int}
         */
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
        /**
         * @description DataSet의 colId의 해당되는 컬럼값의 평균을 리턴한다.
         * 주의! 이 메소드는 반복 사용시 성능저하가 발생될 수 있습니다.
         * @method max
         * @param {String} colId col의 Id
         * @param {int} startRow [optional] row의 시작위치
         * @param {int} endRow [optional] row의 종료위치
         * @return {int}
         */
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
        /**
         * @description DataSet의 row가 invalid될경우 호출되는 메소드
         * @method invalid
         * @protected
         * @param {int} row row의 위치
         * @param {String} rowId row의 아이디
         * @param {int} col col의 위치
         * @param {String} colId field의 아이디
         * @param {String} message 출력할 메시지
         * @param {Object} value 원본 값
         * @param {boolean} isMulti 멀티건 여부
         * @return {void}
         */
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
        /**
         * @description DataSet의 row가 valid될경우 호출되는 메소드
         * @method valid
         * @protected
         * @param {int} row row의 위치
         * @param {String} rowId row의 아이디
         * @param {int} col col의 위치
         * @param {String} colId field의 아이디
         * @param {boolean} isMulti 멀티건 여부
         * @return {void}
         */
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
        /**
         * @description DataSet의 cell의 invalid 여부
         * @method isValid
         * @protected
         * @param {int} row row의 위치
         * @param {String} rowId row의 아이디
         * @param {int} col col의 위치
         * @param {String} colId field의 아이디
         * @return {boolean}
         */
        isValid: function(row, rowId, col, colId){
            if (this.invalidData[rowId]) {
                return this.invalidData[rowId][colId] === true ? false : true;
            }else 
                return true;
        },
        /**
         * @description DataSet의 row가 valid될경우 호출되는 메소드
         * @method validRow
         * @public
         * @param {int} row row의 위치
         * @return {void}
         */
        validRow: function(row){
            var rowId = this.getAt(row).id;
            for (var i = 0; i < this.fields.length; i++) 
                this.valid(row, rowId, i, this.fields[i].id, false);
        },
        /**
         * @description DataSet의 대량건의 변경이 발생하여 성능 저하가 발생할 경우 이벤트를 발생시키지 않고 처리하는 메소드
         * @method batch
         * @public
         * @sample default
         * @param {Function} fn 수행할 Function
         * @param {Object} scope [optional] scope 정보
         * @return {void}
         */
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
        /**
         * @description 객체의 toString
         * @method toString
         * @public
         * @return {String}
         */
        toString: function(){
            return 'Rui.data.LDataSet ' + this.id;
        }
    });
})();

/**
 * 데이터의 컬럼정보를 가지는 객체
 *
 * @namespace Rui.data
 * @module data
 * @requires Rui
 * @requires event
 */

/**
 * LField utility.
 * @namespace Rui.data
 * @class LField
 * @constructor LField
 */
Rui.namespace('Rui.data');
Rui.data.LField = function(config){
    if(typeof config == 'string'){
        config = {id: config, name:config};
    }
    this.id = config.id;
    Rui.applyObject(this, config);
};
Rui.data.LField.prototype = {
    /**
     * @description field의 id
     * @config id
     * @type {String}
     * @default null
     */
    /**
     * @description field의 id
     * @property id
     * @private
     * @type {String}
     */
    id: null,
    /**
     * @description 객체의 문자열
     * @property otype
     * @private
     * @type {String}
     */
    otype:'Rui.data.LField',
    /**
     * @description field객체의 종류(number, string, date)
     * @config type
     * @type {String}
     * @default 'string'
     */
    /**
     * @description field객체의 종류(number, string, date)
     * @property type
     * @private
     * @type {String}
     */
    type:'string',
    /**
     * @description field의 기본 출력값
     * @config defaultValue
     * @type {String|Int|Date}
     * @default undefined
     */
    /**
     * @description field의 기본 출력값
     * @property defaultValue
     * @private
     * @type {String|Int|Date}
     */
    defaultValue: undefined,
    /**
     * @description field의 정렬시 데이터 처리 Function
     * @property sortType
     * @private
     * @type {Function}
     */
    sortType: function(s) {return s;}
};
/**
 * 데이터의 실제 값을 가지는 객체
 * @namespace Rui.data
 * @module data
 * @requires Rui
 * @requires event
 */

/**
 * 데이터의 실제 값을 가지는 객체
 * @namespace Rui.data
 * @class LRecord
 * @sample default
 * @constructor LRecord
 * @param {Object} data 초기 데이터.
 * @param {Object} config The intial LDataSet.
 */
Rui.namespace('Rui.data');
Rui.data.LRecord = function(data, config) {
    config = config || { dataSet: null };
    //config.fields = config.fields || (config.dataSet ? config.dataSet.fields : null);
    /**
     * @description Record의 데이터 객체로 json형 데이터객체를 저장한다.
     * @config data
     * @sample default
     * @type {Object}
     * @default null
     */
     /**
     * @description Record의 데이터 객체로 json형 데이터객체를 저장한다.
     * @property data
     * @private
     * @type {Object}
     */
    this.data = data;
    /**
     * @description Record의 attribute 데이터 객체로 변경건과 무관하게 임시 저장공간으로 처리된다.
     * @property attrData
     * @private
     * @type {Object}
     */
    this.attrData = null;
    /**
     * @description LDataSet 객체
     * @property dataSet
     * @private
     * @type {Rui.data.LDataSet}
     */
    this.dataSet = config.dataSet;
    /**
     * @description Record의 상태 정보
     * @property state
     * @private
     * @type {Rui.data.LRecord.STATE_NORMAL|Rui.data.LRecord.STATE_INSERT|Rui.data.LRecord.STATE_UPDATE|Rui.data.LRecord.STATE_DELETE}
     */
    this.state = Rui.isUndefined(config.state) == false ? config.state : Rui.data.LRecord.STATE_INSERT;
    /**
     * @description Config 생성시 마지막 상태 정보
     * @property lastConfig
     * @private
     * @type {Object}
     */    
    this.lastConfig = config;
    /**
     * @description LRecord id
     * @config id
     * @type {String}
     * @default new record id
     */
    /**
     * @description LRecord id
     * @property id
     * @public
     * @type {String}
     */
    this.id = (config.id || config.id == 0) ? config.id : null;
    /**
     * @description 데이터를 초기화할지 여부를 설정
     * @property initData
     * @private
     * @type {boolean}
     */
    this.initData = typeof config.initData !== 'undefined' ? config.initData : false;
    this.isLoad = config.isLoad;
    //this.initRecord();

    //this.onFieldChanged = null;
    //this.onStateChanged = null;
    config = null;
};
Rui.data.LRecord.prototype = {
    /**
     * @description 객체의 문자열
     * @property otype
     * @private
     * @type {String}
     */
    otype: 'Rui.data.LRecord',
    /**
     * @description 변경 Field정보를 가지는 Collection객체
     * @property modified
     * @private
     * @type {Rui.util.LCollection}
     */
    modified: null,
    /**
     * @description 변경전 Field정보를 가지는 Collection객체
     * @property originData
     * @private
     * @type {Rui.util.LCollection}
     */
    originData: null,
    /**
     * @description originData Collection객체
     * @property getOriginData
     * @private
     * @type {Rui.util.LCollection}
     */
    getOriginData: function() {
        if(!this.originData)
            this.originData = new Rui.util.LCollection();
        return this.originData;
    },
    /**
     * @description 데이터를 초기화하는 메소드
     * @method initRecord
     * @protected
     * @return {void}
     */
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
    /**
     * @description Record의 id를 리턴하는 메소드
     * @method getId
     * @public
     * @return {String}
     */
    getId: function() {
        return this.id;
    },
    /**
     * @description key에 해당되는 데이터를 리턴하는 메소드
     * @method get
     * @public
     * @param {String} key Field id
     * @return {Object}
     */
    get: function(key) {
        return this.data[key];
    },
    /**
     * @description key에 해당되는 value를 저장하는 메소드
     * @method set
     * @public
     * @param {String} key Field id
     * @param {Object} value Field에 대항되는 값
     * @param {Object} option [optional] 환경정보 객체
     * @return {void}
     */
    set: function(key, value, option) {
        if((option && option.system) && this.state === Rui.data.LRecord.STATE_DELETE) return;
        option = option || {};
        var field = originData = orgValue = null;
        try {
            field = this.findField(key);
            if(field == null)
                field = new Rui.data.LField({ id: key }); // dataSet에 등록되지 않은 Record
            
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
    /**
     * @description ui용 attributes에 해당되는 데이터를 리턴하는 메소드
     * @method getAttributes
     * @protected
     * @return {Object}
     */
    getAttributes: function() {
        return this.attrData || {};
    },
    /**
     * @description ui용 attribute key에 해당되는 데이터를 리턴하는 메소드.
     * @method getAttribute
     * @public
     * @param {String} key Field id
     * @return {Object}
     */
    getAttribute: function(key) {
        return this.attrData ? this.attrData[key] : null;
    },
    /**
     * @description ui용 attribute key에 해당되는 value를 저장하는 메소드. 이 메소드로 값을 변경해도 데이터셋에서는 변경건 처리를 하지 않는다.
     * @method setAttribute
     * @public
     * @param {String} key Field id
     * @param {Object} value Field에 대항되는 값
     * @return {void}
     */
    setAttribute: function(key, value) {
        if(!this.attrData) this.attrData = {};
        this.attrData[key] = value;
    },
    /**
     * @description state 정보를 갱신하는 메소드 
     * @method updateState
     * @private
     * @return {void}
     */
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
    /**
     * @description 현재 Record를 undo하는 메소드
     * @method undo
     * @public
     * @sample default
     * @return {void}
     */
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
            // insert일 경우 undo는 update 이벤트는 실행되지 않고 row 위치가 바뀌면서 rowPosChanged 이벤트로 처리 
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
    /**
     * @description 현재 Record의 상태를 변경한다.
     * @method setState
     * @public
     * @sample default
     * @param {Rui.data.LRecord.STATE_NORMAL|Rui.data.LRecord.STATE_INSERT|Rui.data.LRecord.STATE_UPDATE|Rui.data.LRecord.STATE_DELETE} state Record에 해당되는 상태값
     * @return {void}
     */
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
    /**
     * @description 현재 Record의 상태를 리턴한다.
     * @method getState
     * @public
     * @return {Rui.data.LRecord.STATE_NORMAL|Rui.data.LRecord.STATE_INSERT|Rui.data.LRecord.STATE_UPDATE|Rui.data.LRecord.STATE_DELETE} Record에 해당되는 상태값
     */
    getState: function() {
        return this.state;
    },
    /**
     * @description 현재 상태를 commit한다.
     * @method commit
     * @public
     * @return {void}
     */
    commit: function() {
        this.state = Rui.data.LRecord.STATE_NORMAL;
        this.getOriginData().clear();
    },
    /**
     * @description record 데이터중에 field의 값이 변경된 데이터만 json object형으로 리턴한다.
     * @method getModifiedData
     * @public
     * @return {Object}
     */
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
    /**
     * @description 현재 변경상태 정보를 QueryString형 문자열로 리턴한다.
     * @method serialize
     * @private
     * @return {String}
     */
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
    /**
     * @description Record의 전체값을 json형 Object 객체로 리턴한다.
     * @method getValues
     * @public
     * @sample default
     * @return {Object}
     */
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
    /**
     * @description id에 해당되는 fields의 객체를 찾는다.
     * @method findField
     * @private
     * @param {String} id 검색할 Field의 id
     * @return {Object} 검색된 Field객체
     */
    findField: function(id) {
        return this.dataSet ? this.dataSet.getFieldById(id) : null;
    },
    /**
     * @description Record에 json형 Object의 객체 정보의 값을 반영한다.
     * @method setValues
     * @public
     * @sample default
     * @param {Object} o Record에 반영할 Object 객체
     * @return {Object}
     */
    setValues: function(o) {
        for (id in o) {
            if(!this.dataSet || this.findField(id) != null)
                this.set(id, o[id]);
        }
    },
    /**
     * @description Record에 id에 해당되는 Field가 변경 데이터인지 여부를 리턴한다.
     * @method isModifiedField
     * @public
     * @sample default
     * @param {Object} id 검색할 Field의 id
     * @return {boolean} 변경 여부
     */
    isModifiedField: function(id) {
        return this.originData && this.getOriginData().has(id);
    },
    /**
     * @description Record가 변경되었는지를 true or false로 리턴한다.
     * @method isModified
     * @public
     * @sample default
     * @return {boolean} 변경 여부
     */
    isModified: function() {
        if (!this.dataSet) {
            return (this.getOriginData().length > 0) ? true : false;
        }
        return ((this.getOriginData().length > 0) ? true : false) || (this.dataSet.lastOptions ? this.dataSet.lastOptions.state != this.state : this.state != 0);
    },
    /**
     * @description Record를 newId객체로 복사하여 리턴한다.
     * @method clone
     * @public
     * @sample default
     * @param {Object} config (optional) state:상태값, id:신규 Record객체 Id
     * @return {Rui.data.LRecord}
     */
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
            //fields: this.dataSet.fields,
            //dataSet: this.dataSet,
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
    /**
     * @description DataSet객체 정보를 모두 지운다. (이벤트 포함)
     * @method destroy
     * @public
     * @return {void}
     */
    destroy: function() {
        delete this.data;
        delete this.attrData;
        delete this.modified;
        delete this.dataSet;
        delete this.id;
    },
    /**
     * @description 객체의 toString
     * @method toString
     * @public
     * @return {String}
     */
    toString: function() {
        return 'Rui.data.LRecord ' + this.id;
    }
};

Rui.data.LRecord.AUTO_ID = 1000;
Rui.data.LRecord.STATE_NORMAL = 0;
Rui.data.LRecord.STATE_INSERT = 1;
Rui.data.LRecord.STATE_UPDATE = 2;
Rui.data.LRecord.STATE_DELETE = 3;

/**
 * @description LRecord 객체의 자동 순번 id
 * @method getNewRecordId
 * @public
 * @static
 * @return {String}
 */
Rui.data.LRecord.getNewRecordId = function(){
    return 'r' + (++Rui.data.LRecord.AUTO_ID);
};
/**
 * Json 데이터의 컬럼정보를 가지는 객체
 * @namespace Rui.data
 * @module data
 * @requires Rui
 * @requires event
 */

/**
 * LJsonDataSet
 * @namespace Rui.data
 * @class LJsonDataSet
 * @extends Rui.data.LDataSet
 * @constructor LJsonDataSet
 * @param config {Object} The intial LJsonDataSet. 
 */
Rui.data.LJsonDataSet = function(config) {
    Rui.data.LJsonDataSet.superclass.constructor.call(this, config);
    /**
     * @description 데이터 처리 방식 (1:Json);
     * @property dataSetType
     * @private
     * @type {int}
     */        
    this.dataSetType = Rui.data.LJsonDataSet.DATA_TYPE; 
};

Rui.extend(Rui.data.LJsonDataSet, Rui.data.LDataSet, {
    /**
     * @description 결과 데이터를 Array로 변환하여 리턴
     * @method getReadDataMulti
     * @private
     * @param {Object} dataSet LDataSet 객체
     * @param {Object} conn 응답 객체
     * @return {void}
     */
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
            //총갯수 저장
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
    /**
     * @description 데이터 정보를 문자열로 리턴한다.
     * @method serialize
     * @public
     * @return {String} 문자열
     */
    serialize: function() {
        var result = {};
        var count = this.getCount();
        //add metaData
        result.metaData = {
            dataSetId:this.id,
            count: count,
            totalCount: this.getTotalCount()
        };
        if(this.serializeMetaData !== false){
            //add metaData fields
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
    /**
     * @description 변경된 데이터 정보를 문자열로 리턴한다.
     * @method serializeModified
     * @param {boolean} isAll [optional] true일 경우 변경된 전체 데이터를 리턴
     * @public
     * @return {String} 변경된 문자열
     */
    serializeModified: function(isAll) {
        return this.serializeRecords(this.getModifiedRecords(), isAll);
    },
    /**
     * @description 변경된 데이터 정보를 문자열로 리턴한다.
     * @method serializeMarkedOnly
     * @public
     * @return {String} 변경된 문자열
     */
    serializeMarkedOnly: function() {
    	return this.serializeRecords(this.selectedData, true);
    },
    /**
     * @description 변경된 데이터 정보를 문자열로 리턴한다.
     * @method serializeRecords
     * @public
     * @return {String} 변경된 문자열
     */
    serializeRecords: function(selectedRecords, isAll) {
        var result = {};
        var count = selectedRecords.length;
        //add metaData
        result.metaData = {
            dataSetId:this.id,
            count: count,
            totalCount: this.getTotalCount()
        };
        if(this.serializeMetaData !== false){
            //add metaData fields
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
    /**
     * @description LDataSet 배열의 데이터 정보를 리턴한다.
     * @method serializeDataSetList
     * @private
     * @param {Array} dataSets 데이터 객체 배열
     * @return {String} 
     */
    serializeDataSetList: function(dataSets) {
        return this.serializeFnNameDataSetList(dataSets, 'serialize');
    },
    /**
     * @description LDataSet 배열의 변경된 데이터 정보를 리턴한다.
     * @method serializeModifiedDataSetList
     * @private
     * @param {Array} dataSets 데이터 객체 배열
     * @return {String} 
     */
    serializeModifiedDataSetList: function(dataSets) {
        return this.serializeFnNameDataSetList(dataSets, 'serializeModified');
    },
    /**
     * @description LDataSet 배열의 변경된 데이터 정보를 리턴한다.
     * @method serializeMarkedOnlyDataSetList
     * @private
     * @param {Array} dataSets 데이터 객체 배열
     * @return {String} 
     */
    serializeMarkedOnlyDataSetList: function(dataSets) {
        return this.serializeFnNameDataSetList(dataSets, 'serializeMarkedOnly');
    },
    /**
     * @description LDataSet 배열의 변경된 데이터 정보를 리턴한다.
     * @method serializeFnNameDataSetList
     * @private
     * @param {Array} dataSets 데이터 객체 배열
     * @return {String} 
     */
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
// json type
Rui.data.LJsonDataSet.DATA_TYPE = 1;
/**
 * Json 데이터의 컬럼정보를 가지는 객체
 * @namespace Rui.data
 * @module data
 * @requires Rui
 * @requires event
 */

/**
 * LDelimiterDataSet
 * @namespace Rui.data
 * @class LDelimiterDataSet
 * @extends Rui.data.LDataSet
 * @constructor LDelimiterDataSet
 * @param config {Object} The intial LDelimiterDataSet. 
 * { id:'dataSet',
 *      fields:[
 *          {id:'col1'}
 *      ]
 * } 
 */
Rui.data.LDelimiterDataSet = function(config) {
    Rui.data.LDelimiterDataSet.superclass.constructor.call(this, config);
    
    /**
     * @description 데이터 처리 방식 (1:Json);
     * @property dataSetType
     * @private
     * @type {int}
     */        
    this.dataSetType = Rui.data.LDelimiterDataSet.DATA_TYPE; 
};

Rui.extend(Rui.data.LDelimiterDataSet, Rui.data.LDataSet, {
    dataSetDelimiter: '¶',
    recordDelimiter: '\r\n',
    fieldDelimiter: '‡',
    /**
     * @description 현재 DataSet 기준으로 결과 데이터를 Object로 변환하여 리턴
     * @method getReadResponseData
     * @param {Object} conn 응답 객체
     * @return {Object}
     */
    getReadResponseData: function(conn) {
        var data = null;
        try{
        	if(this._cachedData) return this._cachedData; // LDataSetManager의 캐쉬 데이터
            data = conn.responseText;
        } catch(e) {
            throw new Error(Rui.getMessageManager().get('$.base.msg110') + ':' + conn.responseText);
        }
        return data;
    },
    /**
     * @description URL을 통해 데이터정보를 읽어온다.
     * @method doSuccess
     * @private
     * @param {Object} dataSet LDataSet 객체
     * @param {Object} conn 응답 객체
     * @return {void}
     */
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
                //throw new Rui.LException(e);
                throw e; 
        }
        if (this.focusFirstRow !== false && this.focusFirstRow > -1) 
            this.focusRow({
                row: this.focusFirstRow
            });
    },
    /**
     * @description 데이터가 로딩되면 타임머로 로딩된 데이터를 LRecord로 변환한다.
     * @method doDelayLoad
     * @private
     * @return {void}
     */
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
    /**
     * @description Record객체를 생성한다. 생성된 레코드는 DataSet에 반영되지 않은 상태이다. 순수하게 LRecord객체만 생성된다.
     * @method createDelimiterRecord
     * @public
     * @param {String} data 데이터 문자
     * @param {Object} option [optional] option 객체
     * @return {Rui.data.LRecord}
     */
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
    /**
     * @description Id에 해당되는 Record객체를 리턴한다.
     * @method get
     * @public
     * @param {String} id 얻고자 하는 Record객체의 아이디
     * @return {Rui.data.LRecord} 아이디에 해당되는 LRecord 객체
     */
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
    /**
     * @description 위치값에 해당되는 Record객체를 리턴한다.
     * @method getAt
     * @public
     * @param {int} idx 얻고자 하는 Record객체의 위치값
     * @return {Rui.data.LRecord} 아이디에 해당되는 LRecord 객체
     */
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
    /**
     * @description record들을 모두 commit한다.
     * @method commitRecords
     * @protected
     * @return {void}
     */
    commitRecords: function() {
        this.data.each(function(id, record){
            if(record && (record instanceof Rui.data.LRecord))
                record.commit();
        }, this.data);
    },
    /**
     * @description 결과 데이터를 Array로 변환하여 리턴
     * @method getReadDataMulti
     * @private
     * @param {Object} dataSet LDataSet 객체
     * @param {Object} conn 응답 객체
     * @return {void}
     */
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
    /**
     * @description 데이터 정보를 문자열로 리턴한다.
     * @method serialize
     * @public
     * @return {String} 문자열
     */
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
    /**
     * @description 변경된 데이터 정보를 문자열로 리턴한다.
     * @method serializeModified
     * @param {boolean} isAll [optional] true일 경우 변경된 전체 데이터를 리턴
     * @public
     * @return {String} 변경된 문자열
     */
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
    /**
     * @description LDataSet 배열의 데이터 정보를 리턴한다.
     * @method serializeDataSetList
     * @private
     * @param {Array} dataSets 데이터 객체 배열
     * @return {String} 
     */
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
    /**
     * @description LDataSet 배열의 변경된 데이터 정보를 리턴한다.
     * @method serializeModifiedDataSetList
     * @private
     * @param {Array} dataSets 데이터 객체 배열
     * @return {String} 
     */
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
    /**
     * @description DataSet에 query에 해당되는 데이터를 리턴한다.
     * 주의! 이 메소드는 반복 사용시 성능저하가 발생될 수 있습니다.
     * @method query
     * @public
     * @param {Function} fn 정보를 비교할 Function
     * @param {Object} scope scope정보 옵션
     * @return {Rui.util.LCollection}
     */
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

    /**
     * @description DataSet을 정렬한다.
     * 주의! 이 메소드는 반복 사용시 성능저하가 발생될 수 있습니다.
     * @method sort
     * @public
     * @param {Function} fn 정보를 비교할 Function
     * @param {String} desc 정렬 방식 [asc|desc]
     * @return {Array}
     */
    sort: function(fn, desc){
    	if(this.delayLoadTasking) throw new Error('데이터를 로딩중입니다.');
    	Rui.data.LDelimiterDataSet.superclass.sort.call(this, fn, desc);
    }
});
// json type
Rui.data.LDelimiterDataSet.DATA_TYPE = 3;
/**
 * Form
 * @module data
 * @title LBind
 * @requires Rui
 */
Rui.namespace('Rui.data');

/**
 * html form object와 dataSet을 연결하는 객체
 * @namespace Rui.data
 * @class LBind
 * @extends Rui.util.LEventProvider
 * @constructor LBind
 * @sample default
 * @param {Object} config The intial LBind.
 */
Rui.data.LBind = function(config){
    Rui.data.LBind.superclass.constructor.call(this);
    config = config || {};

    /**
     * @description bindRow 위치
     * @property bindRow
     * @protected
     * @type Int
     */
    this.bindRow = 1;
    /**
    * @description LBind 여부
    * @config bind
    * @type {boolean}
    * @default true
    */
    /**
     * @description LBind 여부
     * @property bind
     * @protected
     * @type Boolean
     */
    this.bind = true;
    /**
     * @description Group 객체 Id
     * @property groupId
     * @protected
     * @type String
     */
    this.groupId = config.groupId;
    /**
    * @description Bind객체 정보
    * @config bindInfo
    * @sample default
    * @type {Object}
    * @default null
    */
    /**
     * @description Bind객체 정보
     * @property bindInfo
     * @protected
     * @type Object
     */
    this.bindInfo = null;
    /**
    * @description validate를 처리할 지 여부
    * @config isValidation
    * @type {boolean}
    * @default true
    */
    /**
     * @description validate를 처리할 지 여부
     * @property isValidation
     * @protected
     * @type boolean
     */
    this.isValidation = true;
    /**
     * @description Group을 가지는 Element
     * @property groupEl
     * @protected
     * @type Rui.LElement
     */
    this.groupEl = Rui.get(this.groupId);
    if(!this.groupEl)
        throw new Error('Can\'t find groupId : ' + this.groupId);
    Rui.applyObject(this, config, true);
    this.onChangeDelegate = Rui.util.LFunction.createDelegate(this.onChangeEvent, this);
    this.init();
};

Rui.extend(Rui.data.LBind, Rui.util.LEventProvider, {
    /**
     * @description bind 객체를 찾는 selector 문장
     * @config selector
     * @sample default
     * @type {String}
     * @default 'input,select,textarea,span[id]'
     */
    /**
     * @description bind 객체를 찾는 selector 문장
     * @property selector
     * @private
     * @type {String}
     */
    selector: 'input,select,textarea,span[id]',
    /**
     * @description 객체 초기화 메소드
     * @method init
     * @private
     * @return {void}
     */
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
    /**
     * @description event들을 초기화하는 메소드
     * @method initEvent
     * @private
     * @return {void}
     */
    initEvent: function() {
        this.rebind();
        this.initEventDataSet();
    },
    /**
     * @description dataSet객체의 이벤트를 연결하는 메소드
     * @method initEventDataSet
     * @private
     * @return {void}
     */
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
    /**
     * @description groupId에 있는 객체들을 다시 bind 시킨다.
     * @method rebind
     * @sample default
     * @return {void}
     */
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
    /**
     * @description bindInfo 정보를 추가한다.
     * @method addBindInfo
     * @param {Object} bindInfo 추가할 bindInfo
     * @return {void}
     */
    addBindInfo: function(bindInfo) {
        this.bindInfo.push(bindInfo);
    },
    /**
     * @description dataSet객체의 rowPosChanged 이벤트가 발생하면 호출되는 메소드
     * @method onRowPosChanged
     * @private
     * @param {Object} e Event 객체
     * @return {void}
     */
    onRowPosChanged: function(e) {
        if(this.bind !== true || this.dataSet.isLoading === true) return;
        //this.children = null;
        // 삭제건일 경우 disabled 기능을 구현해야 함.
        var row = e.row;
        this.bindRow = row;
        if(this.cacheRecordId && row > -1 && this.cacheRecordId == this.dataSet.getAt(row).id) return;
        this.load(row);
        this.cacheRecordId = (row > -1) ? this.dataSet.getAt(row).id : null;
    },
    /**
     * @description dataSet객체의 update 이벤트가 발생하면 호출되는 메소드
     * @method onUpdate
     * @private
     * @param {Object} e Event 객체
     * @return {void}
     */
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
    /**
     * @description 객체의 change 이벤트가 발생하면 호출되는 메소드
     * @method onChangeEvent
     * @private
     * @param {Object} e Event 객체
     * @return {void}
     */
    onChangeEvent: function(e) {
    	if(this.bind !== true) return;
        var childObject = e.target;
        var value = childObject.fieldObject === true ? childObject.getValue() : childObject.value;
        this.doChangeEvent(this, childObject, value);
    },
    /**
     * @description invalid시 호출되는 이벤트 메소드
     * @method onInvalid
     * @protected
     * @param {Object} e Event 객체
     * @return {void}
     */
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
    /**
     * @description valid시 호출되는 이벤트 메소드
     * @method onValid
     * @protected
     * @param {Object} e Event 객체
     * @return {void}
     */
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
    /**
     * @description changedData 이벤트 발생시 호출되는 메소드
     * @method onValidAll
     * @protected
     * @param {Object} e Event 객체
     * @return {void}
     */
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
    /**
     * @description 객체의 change 이벤트를 수행하는 메소드
     * @method doChangeEvent
     * @private
     * @return {void}
     */
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
    /**
     * @description Bind정보배열을 리턴
     * @method getBindInfoByObject
     * @private
     * @param {Object} child Child 객체
     * @return {Array}
     */
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
                            // SPAN은 출력용이므로 이벤트가 필요 없음.
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
    /**
     * @description bindInfoMap cache를 지운다.
     * @method clearBindInfoMap
     * @public
     * @return {void}
     */
    clearBindInfoMap: function() {
        this.bindInfoMap = null;
    },
    /**
     * @description Bind정보를 가지는 객체를 리턴
     * @method getBindInfoByDom
     * @private
     * @param {Object} child Child 객체
     * @return {Object}
     */
    getBindInfoByDom: function(child) {
        var bindInfoList = this.getBindInfoByObject(child);
        return bindInfoList.length > 0 ? bindInfoList[0] : null;
    },
    /**
     * @description Bind정보를 가지는 객체를 리턴
     * @method getBindInfoById
     * @private
     * @param {Object} id dataSet 변경 id
     * @return {Object}
     */
    getBindInfoById: function(id) {
        for (var i = 0, len = this.bindInfo.length; i < len; i++) {
            if(this.bindInfo[i].id == id) return this.bindInfo[i];
        }
        return null;
    },
    /**
     * @description Bind정보를 가지는 객체를 리턴
     * @method getIdByChild
     * @private
     * @param {Object} id 객체의 id
     * @return {Object}
     */
    getIdByChild: function(child) {
        var obj = child.instance;
        return (obj && obj.fieldObject === true && obj.id) ? (obj.name || obj.id) : (child.name || child.id);
    },
    /**
     * @description DataSet의 row 위치에 해당되는 정보를 읽는 메소드
     * @method load
     * @public
     * @param {int} row 읽어올 위치 값
     * @return {void}
     */
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
    /**
    * @description 
    * @method getChildren
    * @private
    * @return {Array}
    */
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
    /**
     * @description 객체의 setValue를 재구현한다.
     * @method bindSetValueInit
     * @private
     * @param {childEl} childEl child element 객체
     * @param {function} fn fn 객체
     * @return {void}
     */
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
    /**
     * @description 객체에 값 대입
     * @method doChangeSetValue
     * @private
     * @param {Object} children 배열 객체 리스트
     * @param {Object} child 현재 child 객체
     * @param {Object} bindObject bind 정보 객체
     * @param {Object} value 대입할 값
     * @return {void}
     */
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
                                //if(obj && obj.fieldObject === true && obj.cfg.getProperty('checked') != true) obj.setValue(true);
                            }else {
                                currentChild.checked = false;
                                //if(obj && obj.fieldObject === true && obj.cfg.getProperty('checked') != false) obj.getValue(false);
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
    /**
     * @description 객체 배열을 Function객체로 반복 호출하는 메소드
     * @method each
     * @private
     * @param {Object} children 배열 객체 리스트
     * @param {Object} fn Function 객체
     * @return {void}
     */
    each: function(children, fn) {
        for (var i = 0; i < children.length; i++) {
            var id = children[i].id || children[i].name;
            if(Rui.isUndefined(id) == false && Rui.isNull(id) == false && id != '') {
                if(fn.call(this, children[i]) == false) break;
            }
        }
    },
    /**
     * @description 데이터셋을 변경하는 메소드
     * @method setDataSet
     * @param {Rui.data.LDataSet} dataSet 반영할 데이터셋
     * @return {void}
     */
    setDataSet: function(dataSet) {
        this.dataSet = dataSet;
        this.initEventDataSet();
    },
    /**
     * @description bind 속성을 변경하는 메소드
     * @method setBind
     * @param {boolean} isBind 바인드할지 여부
     * @return {void}
     */
    setBind: function(isBind) {
        this.bind = isBind;
        this.rebind();
        this.load(this.dataSet.getRow());
    },
    /**
     * @description 객체의 toString
     * @method toString
     * @public
     * @return {String}
     */
    toString: function() {
        return 'Rui.data.LBind ' + this.groupId;
    }
});

/**
 * LDataSetManager
 * @module data
 * @title LDataSetManager
 * @requires Rui
 */
Rui.namespace('Rui.data');

/**
 * 변경된 dataSet을 서버에 전송하거나 멀티건의 dataSet을 load하는 객체
 * @namespace Rui.data
 * @class LDataSetManager
 * @extends Rui.util.LEventProvider
 * @sample default
 * @constructor LDataSetManager
 * @param {Object} config The intial LDataSetManager.
 */
Rui.data.LDataSetManager = function(config){
    Rui.data.LDataSetManager.superclass.constructor.call(this);
    config = config ||{};
    config = Rui.applyIf(config, Rui.getConfig().getFirst('$.base.dataSetManager.defaultProperties'));

    /**
     * @description field의 id
     * @property id
     * @public
     * @type {String}
     */
    this.id = config.formId;

    Rui.applyObject(this, config, true);

    /**
     * @description requset의 transaction id
     * @property transaction
     * @private
     * @type {String}
     */
    this.transaction = null;
    /**
     * @description Update가 성공할 경우 발생하는 이벤트
     * @event success
     * @sample default
     * @param {XMLHttpRequest} conn ajax response 객체
     */
    this.createEvent('success');
    /**
     * @description Update가 실패할 경우 발생하는 이벤트
     * @event failure
     * @sample default
     * @param {XMLHttpRequest} conn ajax response 객체
     */
    this.createEvent('failure');
    /**
     * @description upload를 할 경우 발생하는 이벤트. 
     * @event upload
     * @sample default
     * @param {XMLHttpRequest} conn ajax response 객체
     */
    this.createEvent('upload');
    /**
     * @description Update를 실행하기전에 실행여부를 판단하는 이벤트
     * @event beforeUpdate
     * @sample default
     * @param {Object} target this객체
     * @param {String} url url 정보
     * @param {HtmlElement} form form 객체
     * @param {Object} params parameter 객체
     * @param {Rui.data.LDataSet} dataSets dataset 객체
     */
    this.createEvent('beforeUpdate');
    /**
     * @description load이 발생하기전 수행하는 이벤트
     * @event beforeLoad
     * @param {Object} target this객체
     */
    this.createEvent('beforeLoad');
    /**
     * @description 서버에서 데이터를 로딩한 후 메모리로 로딩하기전 호출되는 이벤트
     * @event beforeLoadData
     * @protected
     */
    this.createEvent('beforeLoadData');
    /**
     * @description loadDataSet메소드 호출시 수행되는 이벤트
     * @event load
     * @sample default
     * @param {Object} target this객체
     */
    this.createEvent('load');
    /**
     * @description loadDataSet메소드 호출시 에러가 발생했을 경우
     * @event loadException
     * @sample default
     * @param {Object} target this객체
     * @param {Object} throwObject exception 객체
     */
    this.createEvent('loadException');
    /**
     * @description success를 처리하는 Function delegate객체
     * @property doSuccessDelegate
     * @private
     * @type Object
     */
    this.doSuccessDelegate = Rui.util.LFunction.createDelegate(this.doSuccess, this);
    /**
     * @description failure를 처리하는 Function delegate객체
     * @property failureDelegate
     * @private
     * @type Object
     */
    this.doFailureDelegate = Rui.util.LFunction.createDelegate(this.doFailure, this);
    /**
     * @description upload를 처리하는 Function delegate객체
     * @property doUploadDelegate
     * @private
     * @type Object
     */    
    this.doUploadDelegate = Rui.util.LFunction.createDelegate(this.doUpload, this);

    this.on('success', this.onSuccess, this, true);
    /**
     * @description rui_config.js에 있는 defaultSuccessHandler를 사용할지 여부
     * @config defaultSuccessHandler
     * @type {boolean}
     * @default false
     */
    /**
     * @description rui_config.js에 있는 defaultSuccessHandler를 사용할지 여부
     * @property defaultSuccessHandler
     * @private
     * @type {boolean}
     */
    if (this.defaultSuccessHandler === true) {
        this.on('success', function(e) {
            Rui.alert(Rui.getMessageManager().get('$.base.msg100'));
        }, this, true);
    }
    /**
     * @description rui_config.js에 있는 defaultFailureHandler를 사용할지 여부
     * @config defaultFailureHandler
     * @type {boolean}
     * @default false
     */
    /**
     * @description rui_config.js에 있는 defaultFailureHandler를 사용할지 여부
     * @property defaultFailureHandler
     * @private
     * @type {boolean}
     */
    if (this.defaultFailureHandler === true) {
        var failureHandler = Rui.getConfig().getFirst('$.base.dataSetManager.failureHandler');
        this.on('failure', failureHandler, this, true);
    }
    /**
     * @description rui_config.js에 있는 defaultLoadExceptionHandler를 사용할지 여부
     * @config defaultLoadExceptionHandler
     * @type {boolean}
     * @default false
     */
    /**
     * @description rui_config.js에 있는 defaultLoadExceptionHandler를 사용할지 여부
     * @property defaultLoadExceptionHandler
     * @private
     * @type {boolean}
     */
    if (this.defaultLoadExceptionHandler === true) {
        var loadExceptionHandler = Rui.getConfig().getFirst('$.base.dataSetManager.loadExceptionHandler');
        this.on('loadException', loadExceptionHandler, this, true);
    }

    if(Rui.ui.LWaitPanel && !Rui.data.LDataSetManager.waitPanel)
        Rui.data.LDataSetManager.waitPanel = new Rui.ui.LWaitPanel();
};

Rui.extend(Rui.data.LDataSetManager, Rui.util.LEventProvider, {
    /**
     * @description URL에 대한 Cache 여부
     * @config disableCaching
     * @type {boolean}
     * @default true
     */
    /**
     * @description URL에 대한 Cache 여부
     * @property disableCaching
     * @private
     * @type {boolean}
     */
    disableCaching: true,
    /**
     * @description Request의 timeout값
     * @config timeout
     * @type {int}
     * @default 30
     */
    /**
     * @description Request의 timeout값
     * @property timeout
     * @private
     * @type {int}
     */
    timeout: 30,
    /**
     * @description ssl에 해당되는 blank url
     * @property sslBlankUrl
     * @private
     * @type {String}
     */
    sslBlankUrl: 'about:blank',
    /**
     * @description DataSet의 변경건을 확인할지 여부를 결정한다.
     * @property checkIsUpdate
     * @private
     * @type {boolean}
     */    
    checkIsUpdate: true,
    /**
     * @description 서버에서 받은 데이터가 기존에 받은 데이터와 같으면 데이터를 로딩하지 않는다. (같은 데이터면 모든 이벤트도 작동 안함)
     * @config loadCache
     * @type {boolean}
     * @default false
     */
    /**
     * @description 서버에서 받은 데이터가 기존에 받은 데이터와 같으면 데이터를 로딩하지 않는다. (같은 데이터면 모든 이벤트도 작동 안함)
     * @property loadCache
     * @protected
     * @type {boolean}
     */
    loadCache: false,
    /**
     * @description waitPanel(mask)을 사용할지 여부를 결정한다.
     * @config useWaitPanel
     * @type {boolean}
     * @default true
     */
    /**
     * @description waitPanel(mask)을 사용할지 여부를 결정한다.
     * @property useWaitPanel
     * @protected
     * @type {boolean}
     */
    useWaitPanel: true,
    /**
     * @description updateDataSet할 때 서버로 전송될 DataSet 값의 parameter name.
     * @config dataParameterName
     * @type {String}
     * @default 'dui_datasetdata'
     */
    /**
     * @description updateDataSet할 때 서버로 전송될 DataSet 값의 parameter name.
     * @property useWaitPanel
     * @protected
     * @type {boolean}
     */
    dataParameterName: 'dui_datasetdata',
    /**
     * @description updateDataSet할 때 서버로 전송될 DataSet Type 값의 parameter name.
     * @config dataTypeParameterName
     * @type {String}
     * @default 'dui_datasetdatatype'
     */
    /**
     * @description updateDataSet할 때 서버로 전송될 DataSet Type 값의 parameter name.
     * @property useWaitPanel
     * @protected
     * @type {boolean}
     */
    dataTypeParameterName: 'dui_datasetdatatype',
    /**
     * @description params정보를 가지고 url로 서버를 호출하는 메소드
     * @method update
     * @public
     * @sample default
     * @param {Object} options 호출할때 전달할 Option정보 객체
     * @return {void}
     */
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
    /**
     * @description form의 element정보를 가지고 url로 서버를 호출하는 메소드
     * @method updateForm
     * @public
     * @sample default
     * @param {Object} options 호출할때 전달할 Option정보 객체
     * @return {void}
     */
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
    /**
     * @description dataSet의 변경정보를 가지고 url로 서버를 호출하는 메소드
     * @method updateDataSet
     * @public
     * @sample default
     * @param {Object} options 호출할때 전달할 Option정보 객체
     * @return {void}
     */
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
    /**
     * @description dataSet의 update를 수행하는 메소드
     * @method doUpdateDataSet
     * @protected
     * @param {Object} options 호출할때 전달할 Option정보 객체
     * @param {Array} dataSets 서버에 전달할 데이터셋 리스트
     * @return {void}
     */
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

        // onSuccess 이벤트에서 처리할 수 있게 현재 dataSets 등록 (구조를 delegate구조로 바꾸고 싶으나 데이터 전달 방법의 구조를 잡기 어려움. ㅜㅜ)
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
    /**
     * @description 여러개의 {Rui.data.LDataSet}에 해당되는 queryString을 리턴한다.
     * @method serializeByModifiedDataSet
     * @public
     * @param {Array} dataSets 데이터셋 리스트
     * @return {void}
     */
    serializeByModifiedDataSet: function(dataSets) {
        var params = this.dataParameterName + '=';
        if(dataSets.length > 0) {
            var dataSetEl = Rui.util.LDom.get(dataSets[0]);
            params += encodeURIComponent(dataSetEl.serializeModifiedDataSetList(dataSets));
            params += '&'+this.dataTypeParameterName+'=' + dataSetEl.dataSetType;
        }
        return params;
    },
    /**
     * @description 여러개의 {Rui.data.LDataSet}에 해당되는 queryString을 리턴한다.
     * @method serializeByDataSet
     * @public
     * @param {Array} dataSets 데이터셋 리스트
     * @return {void}
     */
    serializeByDataSet: function(dataSets) {
        var params = this.dataParameterName + '=';
        if(dataSets.length > 0) {
            var dataSetEl = Rui.util.LDom.get(dataSets[0]);
            params += encodeURIComponent(dataSetEl.serializeDataSetList(dataSets));
            params += '&'+this.dataTypeParameterName+'=' + dataSetEl.dataSetType;
        }
        return params;
    },
    /**
     * @description 여러개의 {Rui.data.LDataSet}에 해당되는 queryString을 리턴한다.
     * @method serializeByMarkedOnlyDataSet
     * @public
     * @param {Array} dataSets 데이터셋 리스트
     * @return {void}
     */
    serializeByMarkedOnlyDataSet: function(dataSets) {
        var params = this.dataParameterName + '=';
        if(dataSets.length > 0) {
            var dataSetEl = Rui.util.LDom.get(dataSets[0]);
            params += encodeURIComponent(dataSetEl.serializeMarkedOnlyDataSetList(dataSets));
            params += '&'+this.dataTypeParameterName+'=' + dataSetEl.dataSetType;
        }
        return params;
    },
    /**
     * @description 여러개의 {Rui.data.LDataSet}을 서버에서 load하는 메소드
     * @method loadDataSet
     * @public
     * @sample default
     * @param {Object} options 호출할때 전달할 Option정보 객체
     * @return {void}
     */
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
//                    if(config.sync !== true)
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
    /**
     * @description  HttpResponse 결과를 여러개의 {Rui.data.LDataSet}에 반영하는 메소드
     * <p>Sample: <a href="./../sample/general/data/dataSetManagerMultidatasetSample.html" target="_sample">보기</a></p>
     * @method loadDataResponse
     * @public
     * @param {Array} dataSets DataSet 배열
     * @param {Object} conn HttpResponse 객체
     * @param {Object} config 호출할때 전달할 Option정보 객체
     * <div class='param-options'>
     * state {Rui.data.LRecord.STATE_INSERT|Rui.data.LRecord.STATE_UPDATE|Rui.data.LRecord.STATE_DELETE} load시 record의 기본 상태
     * </div>
     * @return {void}
     */
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
    /**
     * @description success를 처리하는 Function delegate객체
     * @method doSuccess
     * @private
     * @param {Object} response response객체
     * @return {void}
     */
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
    /**
     * @description failure를 처리하는 Function delegate객체
     * @method doFailure
     * @private
     * @param {Object} response response객체
     * @return {void}
     */
    doFailure: function(response) {
        this.waitPanelHide();
        this.transaction = null;
        response.target = this;
        this.fireEvent('failure', response);
        if (typeof response.argument.callback == 'function') {
            response.argument.callback(this, false);
        }
    },
    /**
     * @description failure를 처리하는 Function delegate객체
     * @method doUpload
     * @private
     * @param {Object} response response객체
     * @return {void}
     */
    doUpload: function(response) {
        this.waitPanelHide();
        this.transaction = null;
        response.target = this;
        this.fireEvent('upload', response);
        if (typeof response.argument.callback == 'function') {
            response.argument.callback(this, false);
        }
    },
    /**
     * @description updateDataSet시 정상적으로 success일 경우 모든 데이터셋 commit 처리
     * @method onSuccess
     * @private
     * @return {void}
     */
    onSuccess: function() {
        for (var i = 0 ; this.dataSets != null && i < this.dataSets.length ; i++) {
            var dataSetEl = this.dataSets[i];
            dataSetEl.commit();
        }

        this.dataSets = null;
    },
    /**
     * @description request를 중단하는 메소드
     * @method abort
     * @public
     * @return {void}
     */
    abort: function() {
        if (this.transaction) {
            Rui.LConnect.abort(this.transaction);
        }
    },
    /**
     * @description update를 호출했는지 판단하는 메소드
     * @method isUpdating
     * @public
     * @return {void}
     */
    isUpdating: function() {
        if (this.transaction) {
            return Rui.LConnect.isCallInProgress(this.transaction);
        }
        return false;
    },
    /**
     * @description wait panel을 출력하는 메소드
     * @method waitPanelShow
     * @public
     * @return {void}
     */
    waitPanelShow: function() {
        var dm = Rui.data.LDataSetManager;
        if(dm.waitPanel && this.useWaitPanel){
            if(!dm.waitPanelCount)
                dm.waitPanelCount = 0;
            dm.waitPanelCount ++;
            dm.waitPanel.show();
        }
    },
    /**
     * @description wait panel을 숨기는 메소드
     * @method waitPanelHide
     * @public
     * @return {void}
     */
    waitPanelHide: function() {
        var dm = Rui.data.LDataSetManager;
        if(dm.waitPanel && this.useWaitPanel){
            if(dm.waitPanelCount)
                dm.waitPanelCount--;
            if(dm.waitPanelCount < 1)
                dm.waitPanel.hide();
        }
    },
    /**
     * @description 객체의 toString
     * @method toString
     * @public
     * @return {String}
     */
    toString: function() {
        return 'Rui.data.LDataSetManager ' + this.id;
    } 
});
/**
 * Validator
 * @module validate
 * @title Validator
 * @requires Rui
 */
Rui.namespace('Rui.validate');
/**
 * Validator
 * @namespace Rui.validate
 * @class LValidator
 * @protected
 * @constructor LValidator
 * @param {string} id field id
 * @param {object} config label등 validator 속성
 */
Rui.validate.LValidator = function(id, config){
    config = config || {};
    Rui.applyObject(this, config, true);
    this.id = id;
};
Rui.validate.LValidator.prototype = {
    /**
     * @description validator id
     * @property id
     * @private
     * @type {String}
     */
    id: null,
    /**
     * @description 출력할 컬럼명
     * @property itemName
     * @private
     * @type {String}
     */
    itemName: null,
    /**
     * @description 유효성을 체크하는 로직이 들어 있는 Function
     * @property fn
     * @private
     * @type {Function}
     */
    fn: null,
    /**
     * @description object type 명
     * @property otype
     * @private
     * @type {String}
     */
    otype: 'Rui.util.LValidator',
    /**
     * @description validate하는 메소드
     * @method validate
     * @public
     * @param {Object} value 비교 값
     * @return {boolean} 비교 결과값
     */
    validate: function(value) {
        return true;
    },
    /**
     * @description 객체의 toString
     * @method toString
     * @public
     * @return {String}
     */
    toString: function() {
        return (this.otype || 'Rui.validate.LValidator') + ' ' + this.id;
    }
};
/**
 * LValidator 기반의 각종 FORM, UI Component, DataSet 등의 객체 유효성을 관리하는 컴포넌트
 * @namespace Rui.validate
 * @class LValidatorManager
 * @sample default
 * @constructor LValidatorManager
 * @param {Object} config The intial LValidatorManager.
 */
Rui.validate.LValidatorManager = function(config){
    var config = config || {};
    this.selector = config.selector || 'input,select,textarea';
    this.validators = new Rui.util.LCollection();
    if(config.validators)
        this.parse(config.validators);
};
Rui.validate.LValidatorManager.prototype = {
    /**
     * @description LValidator들을 가지는 객체
     * @config validators
     * @sample default
     * @type {Array}
     * @default null
     */
    /**
     * @description LValidator들을 가지는 객체
     * @property validators
     * @private
     * @type {Rui.util.LCollection}
     */
    validators: null,
    /**
     * @description invalid 된 객체들의 정보 배열
     * @property invalidList
     * @private
     * @type {Array}
     */
    invalidList: null,
    /**
     * validators 객체 정보 parse
     * @method parse
     * @private
     * @param {Array} validators validator Array객체
     * @return {void}
     */
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
                //var sArr = Rui.util.LString.advancedSplit(vExps[i], '=', 'it');
                if (Rui.isNull(sArr[0])) throw new Rui.LException(label+' : '+Rui.getMessageManager().get('$.base.msg050', vExps[i]));
                if (sArr.length>1 && Rui.util.LString.trim(sArr[1]) == '') throw new Rui.LException(label+' : '+Rui.getMessageManager().get('$.base.msg050', vExps[i]));
                var firstUpperCase = Rui.util.LString.firstUpperCase(sArr[0]);
                if (!Rui.validate['L'+firstUpperCase+'Validator']) throw new Rui.LException(label+' : '+Rui.getMessageManager().get('$.base.msg051', vExps[i]));
                //if (!eval('Rui.validate.L'+firstUpperCase+'Validator')) throw new Rui.LException(label+' : '+Rui.getMessageManager().get('$.base.msg051', vExps[i]));
                try {
                    var validatorObj = null;
                    //if (sArr[1]) validatorObj = eval('new Rui.validate.L'+firstUpperCase+'Validator("'+id+'","'+sArr[1]+'")');
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
    /**
     * Validator객체를 추가하는 메소드
     * @method add
     * @public
     * @param {String} id validation할 객체의 id
     * @param {Rui.validate.LValidator} validator validator 객체
     * @return {void}
     */
    add: function(id, validator) {
        this.validators.add(id, validator);
        return this;
    },
    /**
     * validation를 object에 가지고 있는 키,값으로 수행하는 메소드
     * @method validate
     * @public
     * @param {Object} obj Validation할 object
     * @return {boolean} validate 여부
     */
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
    /**
     * 지정한 id의 DOM 하위에 구성된 INPUT, TextArea, CheckBox, Radio등의 입력폼 안에서 유효성을 검사하는 메소드
     * @method validateGroup
     * @sample default
     * @param {String} id Validation할 group id
     * @return {boolean} validate 여부
     */
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
                    // radio나 checkbox일경우 중복되므로 _message로 체크하여 메시지 탑재
                    if(message != _message) itemMessageList = itemMessageList.concat(message);
                    _message = message;
                }
            }
        }, this);
        
        this.messageList = itemMessageList;
        
        return isValid;
    },
    /**
     * 지정한 id의 INPUT, TextArea, CheckBox, Radio등의 입력 폼 값의 유효성을 검사하는 메소드
     * validation 결과 => isValid: {boolean}, id: {string}, label: {string}, message: {string}, messages: {string[]}
     * @method validateField
     * @param {String} id Validation할 field
     * @param {Object} value Validation할 object
     * @return {Object} row 
     */
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
    /**
     * 지정한 el의 INPUT, TextArea, CheckBox, Radio 및 Rui.ui.form.LField 컴포넌트의 입력 폼 값의 유효성을 검사하는 메소드
     * validation 결과 => isValid: {boolean}, id: {string}, label: {string}, message: {string}, messages: {string[]}
     * @method validateEl
     * @param {Rui.LElement} el Validation할 Element객체
     * @return {boolean} validate 여부
     */
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
    /**
     * dataSet의 값을 기준으로 유효성체크를 한다.
     * @method validateDataSet
     * @sample default
     * @param {Rui.data.LDataSet} dataSet Validation할 dataSet객체
     * @param {int} row [optional] Validation할 dataSet객체의 행 번호, 생략할 경우 전체 행을 검사한다.
     * @return {boolean} validate 여부
     */
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
    /**
     * validateGrid 수행하는 메소드
     * @method validateGrid
     * @private
     * @param {Rui.ui.LGridPanel} gridPanel Validation할 gridPanel객체
     * @return {boolean} validate 여부
     */
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
    /**
     * validate, validateField, validateGroup 메소드 실행의 결과로 invalid 상태가 된 각종 폼객체들을 일괄 valid 상태로 만든다.
     * 주의!! validateDataSet, validateGrid등에 의해 invalid 상태가 된 경우는 이 메소드를 사용해선 안된다.
     * @method clearInvalids
     * @return {void}
     */
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
    /**
     * validator의 id에 해당되는 LValidator를 배열로 리턴한다.
     * @method getValidatorList
     * @public
     * @param {String} id validator id
     * @return {ArrayList}
     */
    getValidatorList: function(id) {
        var validatorList = [];
        for (var i = 0; i < this.validators.length ; i++) {
            var item = this.validators.getAt(i);
            if(id == item.id)
                validatorList.push(item);
        };
        return validatorList;
    },
    /**
     * validator의 id에 해당되는 LValidator를 리턴한다.
     * @method getValidator
     * @param {String} id validator id
     * @param {String} validatorId validator 종류(ex. date, length, minDate 등)
     * @return {object}
     */
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
    /**
     * invalid된 객체를 담아 배열로 리턴한다.
     * @method getInvalidList
     * @return {Array} invalid 배열
     */
    getInvalidList: function() {
        return this.invalidList;
    },
    /**
     * 출력했던 메시지를 문자로 리턴한다.
     * @method getMessageList
     * @return {String} 출력했던 전체 메시지
     */
    getMessageList: function() {
        return this.messageList;
    },
    /**
     * @description 객체의 toString
     * @method toString
     * @public
     * @return {String}
     */
    toString: function() {
        return 'Rui.validate.LValidatorManager ' + this.id;
    }
};

/**
 * LLengthValidator 전체 글자의 길이를 체크하는 validator<br>
 * { id: 'col2', validExp:'Col2:true:length=4'}
 * @namespace Rui.validate
 * @class LLengthValidator
 * @protected
 * @extends Rui.validate.LValidator
 * @constructor LLengthValidator
 * @param {string} id field id
 * @param {int} length 검사할 문자의 길이
 * @param {object} config label등 validator 속성
 */
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
/**
 * <pre>
 * LDateValidator 날짜의 유효성을 체크하는 validator
 * { id: 'col11', validExp:'Col11:true:date=YYYYMMDD'}
 * format문자 :  YYYY,  -> 4자리 년도
 *               YY,    -> 2자리 년도. 2000년 이후.
 *               MM,    -> 2자리 숫자의 달. 
 *               DD,    -> 2자리 숫자의 일. 
 *               hh,    -> 2자리 숫자의 시간. 12시 기준
 *               HH,    -> 2자리 숫자의 시간. 24시 기준 
 *               mm,    -> 2자리 숫자의 분. 
 *               ss     -> 2자리 숫자의 초.
 * 
 * 예) 
 *     'YYYYMMDD' -> '20020328'    
 *     'YYYY/MM/DD' -> '2002/03/28'
 *     'Today : YY-MM-DD' -> 'Today : 02-03-28'
 * 
 * 참고) 
 *       format문자가 중복해서 나오더라도 처음 나온 문자에 대해서만
 *       format문자로 인식된다. YYYY와 YY, hh와 HH 도 중복으로 본다.
 *       날짜는 년,월이 존재할 때만 정확히 체크하고 만일 년, 월이 없다면
 *       1 ~ 31 사이인지만 체크한다.
 * </pre>
 * @namespace Rui.validate
 * @class LDateValidator
 * @protected
 * @extends Rui.validate.LValidator
 * @constructor LDateValidator
 * @param {string} id field id
 * @param {string} dateExpr 허용되는 byte길이
 * @param {object} config label등 validator 속성
 */
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
/**
 * LFormatValidator format에 맞는 값인지를 체크하는 validator<br>
 * { id: 'col17', validExp:'Col17:true:format=abc'}
 * @namespace Rui.validate
 * @class LFormatValidator
 * @protected
 * @extends Rui.validate.LValidator
 * @constructor LFormatValidator
 * @param {string} id field id
 * @param {string} format 검사 포맷
 * @param {object} config label등 validator 속성
 */
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
/**
 * LNumberValidator
 * @module validate
 * @title Validator
 * @requires Rui
 */
Rui.namespace('Rui.validate');

/**
 * LNumberValidator 숫자 여부를 판단하는 validator<br>
 * { id: 'col6', validExp:'Col6:true:number'}
 * @namespace Rui.validate
 * @class LNumberValidator
 * @protected
 * @extends Rui.validate.LValidator
 * @constructor LNumberValidator
 * @param {string} id field id
 * @param {string} format 검사할 숫자 포맷, 소숫점 포함 여부 등
 * @param {object} config label등 validator 속성
 */
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
/**
 * LRequiredValidator 필수 여부
 * @namespace Rui.validate
 * @class LRequiredValidator
 * @protected
 * @extends Rui.validate.LValidator
 * @constructor LRequiredValidator
 * @param {string} id field id
 * @param {object} config label등 validator 속성
 */
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
/**
 * LByteLengthValidator byte로 길이를 체크하는 validator<br>
 * { id: 'col4', validExp:'Col4:true:byteLength=4'}
 * @namespace Rui.validate
 * @class LByteLengthValidator
 * @protected
 * @extends Rui.validate.LValidator
 * @constructor LByteLengthValidator
 * @param {string} id field id
 * @param {string} length 허용되는 byte길이
 * @param {object} config label등 validator 속성
 */
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
                // utf-8일 경우 3byte
                byteLength += 3;        
            } else if (c.indexOf('%') != -1)  {  
                byteLength += c.length/3;                
            }
        }
        return byteLength;   
    },
    checkCondition: function (value, vValue) { return value == vValue; }
});
/**
 * <pre>
 * filterValidator : 지정된 문자가 들어있을 경우 유효하지 않은 것으로 판단한다.
 * { id: 'col16', validExp:'Col16:true:filter=%;<;\\h;\\;;haha' } 
 * Wild 문자
 *   ;    - \;
 *   한글 - \h  
 *   영문 - \a
 *   숫자 - \n
 * </pre>
 * @namespace Rui.validate
 * @class LFilterValidator
 * @protected
 * @extends Rui.validate.LValidator
 * @constructor LFilterValidator
 * @param {string} id field id
 * @param {string} filterExpr 허용되는 byte길이
 * @param {object} config label등 validator 속성
 */
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
/**
 * LInNumberValidator 범위안에 숫자가 존재하는지 체크하는 validator<br>
 * { id: 'col10', validExp:'Col10:true:inNumber=90~100'}
 * @namespace Rui.validate
 * @class LInNumberValidator
 * @protected
 * @extends Rui.validate.LValidator
 * @constructor LInNumberValidator
 * @param {string} id field id
 * @param {string} inNumber 숫자의 범위 (ex, '90~100')
 * @param {object} config label등 validator 속성
 */
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

/**
 * LMinByteLengthValidator
 * @module validate
 * @title Validator
 * @requires Rui
 */
Rui.namespace('Rui.validate');

/**
 * LMinByteLengthValidator byte로 최소 길이를 체크하는 validator<br>
 * { id: 'col5', validExp:'Col5:true:minByteLength=8'}
 * @namespace Rui.validate
 * @class LMinByteLengthValidator
 * @protected
 * @extends Rui.validate.LValidator
 * @constructor LMinByteLengthValidator
 * @param {Object} oConfig The intial LMinByteLengthValidator.
 */
Rui.validate.LMinByteLengthValidator = function(id, length, oConfig){
    Rui.validate.LMinByteLengthValidator.superclass.constructor.call(this, id, oConfig);
    this.length = parseInt(length, 10);
    this.msgId = '$.base.msg030';
};

Rui.extend(Rui.validate.LMinByteLengthValidator, Rui.validate.LByteLengthValidator, {
    otype: 'Rui.validate.LMinByteLengthValidator',
    checkCondition: function (value, vValue) { return value >= vValue; }
});
/**
 * LMinDateValidator 최소 입력 날짜인지 확인하는 validator<br>
 * { id: 'col12', validExp:'Col12:true:minDate=2008/11/11(YYYY/MM/DD)'}
 * @namespace Rui.validate
 * @class LMinDateValidator
 * @protected
 * @extends Rui.validate.LValidator
 * @constructor LMinDateValidator
 * @param {string} id field id
 * @param {string} minDate 검사할 min date string (ex, '20081111' or '2008/11/11(YYYY/MM/DD)')
 * @param {object} config label등 validator 속성
 */
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

/**
 * LMinLengthValidator
 * @module validate
 * @title Validator
 * @requires Rui
 */
Rui.namespace('Rui.validate');

/**
 * LMinLengthValidator 최소 길이를 확인하는 validator<br>
 * { id: 'col3', validExp:'Col3:true:minLength=6'}
 * @namespace Rui.validate
 * @class LMinLengthValidator
 * @protected
 * @extends Rui.validate.LValidator
 * @constructor LMinLengthValidator
 * @param {string} id field id
 * @param {int} minLength 검사할 min length
 * @param {object} config label등 validator 속성
 */
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
/**
 * LMinNumberValidator 최소 숫자를 확인하는 validator<br>
 * { id: 'col8', validExp:'Col8:true:minNumber=100'}
 * @namespace Rui.validate
 * @class LMinNumberValidator
 * @protected
 * @extends Rui.validate.LValidator
 * @constructor LMinNumberValidator
 * @param {string} id field id
 * @param {int} minNumber 검사할 min number
 * @param {object} config label등 validator 속성
 */
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

/**
 * LMaxByteLengthValidator byte로 최대 길이를 체크하는 validator<br>
 * { id: 'col5', validExp:'Col5:true:maxByteLength=8'}
 * @namespace Rui.validate
 * @class LMaxByteLengthValidator
 * @protected
 * @extends Rui.validate.LValidator
 * @constructor LMaxByteLengthValidator
 * @param {string} id field id
 * @param {int} length 검사할 문자의 byte 길이
 * @param {object} config label등 validator 속성
 */
Rui.validate.LMaxByteLengthValidator = function(id, length, config){
    Rui.validate.LMaxByteLengthValidator.superclass.constructor.call(this, id, length, config);
    this.msgId = '$.base.msg031';
};
Rui.extend(Rui.validate.LMaxByteLengthValidator, Rui.validate.LByteLengthValidator, {
    otype: 'Rui.validate.LMaxByteLengthValidator',
    checkCondition: function (value, vValue) { return value <= vValue; }
});
/**
 * LMaxDateValidator 기준 날짜를 초과하는지 체크하는 validator<br>
 * { id: 'col13', validExp:'Col13:true:maxDate=20081111'}
 * @namespace Rui.validate
 * @class LMaxDateValidator
 * @protected
 * @extends Rui.validate.LValidator
 * @constructor LMaxDateValidator
 * @param {string} id field id
 * @param {string} maxDate 검사할 max date string (ex, '20081111' or '2008/11/11(YYYY/MM/DD)')
 * @param {object} config label등 validator 속성
 */
Rui.validate.LMaxDateValidator = function(id, maxDate, config){
    Rui.validate.LMaxDateValidator.superclass.constructor.call(this, id, maxDate, config);
    this.msgId = '$.base.msg023';
};
Rui.extend(Rui.validate.LMaxDateValidator, Rui.validate.LMinDateValidator, {
    otype: 'Rui.validate.LMaxDateValidator',
    checkCondition: function (value, vValue) { return (value <= vValue); }
});

/**
 * LMaxLengthValidator 최대 길이를 초과하는지 체크하는 validator<br>
 * { id: 'col3', validExp:'Col3:true:maxLength=6'}
 * @namespace Rui.validate
 * @class LMaxLengthValidator
 * @protected
 * @extends Rui.validate.LValidator
 * @constructor LMaxLengthValidator
 * @param {string} id field id
 * @param {int} maxLength 검사할 max length
 * @param {object} config label등 validator 속성
 */
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
/**
 * LMaxNumberValidator 최대 숫자를 초과하는지 체크하는 validator<br>
 * { id: 'col9', validExp:'Col9:true:maxNumber=100'}
 * @namespace Rui.validate
 * @class LMaxNumberValidator
 * @protected
 * @extends Rui.validate.LValidator
 * @constructor LMaxNumberValidator
 * @param {string} id field id
 * @param {int} maxNumber 검사할 max number
 * @param {object} config label등 validator 속성
 */
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

/**
 * LSsnValidator 주민번호인지 체크하는 validator
 * @namespace Rui.validate
 * @class LSsnValidator
 * @protected
 * @extends Rui.validate.LValidator
 * @constructor LSsnValidator
 * @param {string} id field id
 * @param {object} config label등 validator 속성
 */
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
    
        /* ----------------------------------------------------------------
           잘못된 생년월일을 검사합니다.
           2000년도부터 성구별 번호가 바뀌였슴으로 구별수가 2보다 작다면
           1900년도 생이되고 2보다 크다면 2000년도 이상생이 됩니다. 
           단 1800년도 생은 계산에서 제외합니다.
        ---------------------------------------------------------------- */
        
        bYear = (jNum2.charAt(0) <= '2') ? '19' : '20';
    
        // 주민번호의 앞에서 2자리를 이어서 4자리의 생년을 저장합니다.
        bYear += jNum1.substr(0, 2);
    
        // 달을 구합니다. 1을 뺀것은 자바스크립트에서는 1월을 0으로 표기하기 때문입니다.
        bMonth = jNum1.substr(2, 2) - 1;
    
        bDate = jNum1.substr(4, 2);
    
        bSum = new Date(bYear, bMonth, bDate);
    
        // 생년월일의 타당성을 검사하여 거짓이 있을시 에러메세지를 나타냄
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
            // 각 수와 곱할 수를 뽑아냅니다. 곱수가 만일 10보다 크거나 같다면 계산식에 의해 2로 다시 시작하게 됩니다.
            if(k >= 10) k = k % 10 + 2;
            // 각 자리수와 계산수를 곱한값을 변수 total에 누적합산시킵니다.
            total = total + (temp[i] * k);
        }
        // 마지막 계산식을 변수 last_num에 대입합니다.
        last_num = (11- (total % 11)) % 10;
        // laster_num이 주민번호의마지막수와 같은면 참을 틀리면 거짓을 반환합니다.
        if(last_num != temp[13]) {
            this.message = Rui.getMessageManager().get('$.base.msg014');
            return false;
        }
        return true;
    }
});
/**
 * LCsnValidator 사업자 번호인지 체크하는 validator<br>
 * { id: 'col15', validExp:'Col15:true:csn'} 
 * @namespace Rui.validate
 * @class LCsnValidator
 * @protected
 * @extends Rui.validate.LValidator
 * @constructor LCsnValidator
 * @param {string} id field id
 * @param {object} config label등 validator 속성
 */
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
/**
 * LEmailValidator 이메일인지 체크하는 validator<br>
 * { id: 'col18', validExp:'Col18:true:email'}
 * @namespace Rui.validate
 * @class LEmailValidator
 * @protected
 * @extends Rui.validate.LValidator
 * @constructor LEmailValidator
 * @param {string} id field id
 * @param {object} config label등 validator 속성
 */
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

/**
 * <pre>
 * AllowCharValidator : 지정된 문자가 들어있을 경우 유효한것으로 판단한다.
 * { id: 'col17', validExp:'Col17:true:allow=\\a;\\n'} 
 * Wild 문자
 *   ;    - \;
 *   한글 - \h  
 *   영문 - \a
 *   숫자 - \n
 * </pre>
 * @namespace Rui.validate
 * @class LAllowValidator
 * @protected
 * @extends Rui.validate.LValidator
 * @constructor LAllowValidator
 * @param {string} id field id
 * @param {string} allowExpr 허용문자 표현식
 * @param {object} config label등 validator 속성
 */
Rui.validate.LAllowValidator = function(id, allowExpr, config){
    Rui.validate.LAllowValidator.superclass.constructor.call(this, id, config);
    this.exprs = Rui.util.LString.advancedSplit(allowExpr, ";", "i");
    this.msgId = '$.base.msg038';
    var msgFStr = allowExpr.split(';');
    for (var i = 0; i < msgFStr.length; i++) {
        if (msgFStr[i] == "\\h" || msgFStr[i] == "\h") { 
            msgFStr[i] = Rui.getMessageManager().get('$.core.kor'); //  한글
        } else if(msgFStr[i] == "\\a" || msgFStr[i] == "\a") {
            msgFStr[i] = Rui.getMessageManager().get('$.core.eng'); //  영어
        } else if(msgFStr[i] == "\\n" || msgFStr[i] == "\n") {
            msgFStr[i] = Rui.getMessageManager().get('$.core.num'); //  숫자
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
/**
 * Checkbox나 Radiobox의 필수 여부를 체크하는 validator<br>
 * { id: 'col18', validExp:'Col18:true:groupName=col8'}
 * @namespace Rui.validate
 * @class LGroupRequireValidator
 * @protected
 * @extends Rui.validate.LValidator
 * @constructor LGroupRequireValidator
 * @param {string} id field id
 * @param {string} groupName 그룹명
 * @param {object} config label등 validator 속성
 */
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
