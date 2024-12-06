/*
 * @(#) rui_base-debug.js
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
if (typeof Rui == 'undefined' || !Rui) {
    /**
     * Rui는 global namespace object 이다..  
     * 만약 Rui가 이미 정의되어 있으면, 기존의 Rui object는 정의된 namespace들이 보존되도록
     * overwrite 않을 것이다. 
     * @class Rui
     * @static
     * @sample default
     */
    var Rui = { };
}

(function(){
    Rui.env = Rui.env || {
        version: '2.8',
        build: '2022/10/28',
        modules: [],
        listeners: []
    };

    var userAgent = navigator.userAgent.toLowerCase();
    // API 작성기때문에 주석을 가장 아래로 옮겼음.
    docMode = document.documentMode;
    Rui.browser = {
        version: (userAgent.match( /.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/ ) || [])[1],
        opera: /opera/.test( userAgent ),
        chrome:/chrome/.test( userAgent ),
        webkit:/webkit/.test(userAgent),        
        safari: !/chrome/.test( userAgent ) && /safari/.test( userAgent ),
        safari2: /safari/.test( userAgent ) && /applewebkit\/4/.test( userAgent ),
        safari3: /safari/.test( userAgent ) && /version\/3/.test( userAgent ),
        safari4: /safari/.test( userAgent ) && /version\/4/.test( userAgent ),
        safari5: /safari/.test( userAgent ) && /version\/5/.test( userAgent ),
        msie: /trident/.test( userAgent ) && !/opera/.test( userAgent ),
        msie6: /msie/.test( userAgent ) && /msie 6/.test( userAgent ),
        msie7: /msie/.test( userAgent ) && (docMode == 7 || (/msie 7/.test( userAgent ) && docMode != 8 && docMode != 9 && docMode != 10 && docMode != 11)),
        msie8: /msie/.test( userAgent ) && (docMode == 8 || (/msie 8/.test( userAgent ) && docMode != 7 && docMode != 9 && docMode != 10 && docMode != 11)),
        msie9: /msie/.test( userAgent ) && (docMode == 9 || (/msie 9/.test( userAgent ) && docMode != 7 && docMode != 8 && docMode != 10 && docMode != 11)),
        msie10: /msie/.test( userAgent ) && (docMode == 10 || (/msie 10/.test( userAgent ) && docMode != 7 && docMode != 8 && docMode != 9 && docMode != 11)),
        msie11: /trident/.test( userAgent ) && docMode == 11,
        mozilla: !/trident/.test( userAgent ) && /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent ),
        gecko: !/webkit/.test(userAgent) && /gecko/.test(userAgent),
        gecko2: !/webkit/.test(userAgent) && /gecko/.test(userAgent) && /rv:1\.8/.test(userAgent),
        gecko3: !/webkit/.test(userAgent) && /gecko/.test(userAgent) && /rv:1\.9/.test(userAgent),
        css3d: 'WebKitCSSMatrix' in window && 'm11' in new WebKitCSSMatrix(),
        touch: 'ontouchstart' in window,
        orientation: 'orientation' in window
    };
    
    Rui.browser.msie67 = (Rui.browser.msie && (Rui.browser.msie6 || Rui.browser.msie7));
    Rui.browser.msie678 = (Rui.browser.msie67 || Rui.browser.msie8);
    Rui.browser.msie6789 = (Rui.browser.msie678 || Rui.browser.msie9);
    
    Rui.mobile = {
        android: /android/.test( userAgent ),
        iphone: /iphone/.test( userAgent ),
        ipad: /ipad/.test( userAgent ),
        playbook: /playbook/.test( userAgent ),
        blackberry: /Blackberry/.test( userAgent),
        ios: (/iphone|ipad/gi).test(navigator.appVersion)
    };

    Rui.platform = {
        window: /window/.test( userAgent ) || /win32/.test( userAgent ),
        mac: /macintosh/.test( userAgent ),
        air: /adobeair/.test( userAgent ),
        linux: /linux/.test( userAgent ),
        isMobile: (Rui.mobile.android || Rui.mobile.iphone || Rui.mobile.ipad || Rui.mobile.playbook || Rui.mobile.blackberry)        
    };
    
    //Rui.platform.isMobile = true;

    var htmlCss = [], m;
    for (m in Rui.browser) {
        if(Rui.browser[m]) htmlCss.push('L-ua-' + m);
    }
    if(Rui.platform.isMobile) {
        for (m in Rui.mobile) {
            if(Rui.mobile[m]) htmlCss.push('L-ua-' + m);
        }
    }
    var BI = Rui.browser;
    if(Rui.browser.msie) {
        if (userAgent.indexOf("msie 7") > -1 && userAgent.indexOf("mozilla/4") > -1 && userAgent.indexOf("trident/6") > -1) {
            // IE10 호환성 보기
            htmlCss.push('L-ua-compatible');
        } else if (userAgent.indexOf("msie 9") > -1 && userAgent.indexOf("mozilla/4") > -1 && userAgent.indexOf("trident/5") > -1) {
            // IE9 호환성 보기
            htmlCss.push('L-ua-compatible');
        } else if (userAgent.indexOf("msie 7") > -1 && userAgent.indexOf("trident") > -1) {
            // IE8 호환성 보기
            htmlCss.push('L-ua-compatible');
        }
    }
    if(Rui.platform.isMobile) htmlCss.push('L-ua-mobile');
    	
    document.documentElement.className += ' ' + htmlCss.join(' ');
    
    // remove css image flicker
    if(Rui.browser.msie6){
        try{
            document.execCommand('BackgroundImageCache', false, true);
        }catch(e){}
    }

    /**
     * @description https가 적용되었는지 확인하는 속성
     * @property isSecure
     * @public
     * @static
     * @type {boolean}
     */
    Rui.isSecure = (window.location.href.toLowerCase().indexOf('https') === 0) ? true : false;

    /**
     * @description css의 compatMode가 CSS1Compat인지 확인하는 속성
     * @property isStrict
     * @public
     * @static
     * @type {boolean}
     */
    Rui.isStrict = document.compatMode == 'CSS1Compat';

    /**
     * @description Border가 box 모델이 적용이 안되는 상태인지 확인하는 속성 (true면 박스모델이 아님: ie6에 doctype이 없을 경우)
     * @property isBorderBox
     * @public
     * @static
     * @type {boolean}
     */
    Rui.isBorderBox = Rui.browser.msie && !Rui.isStrict;

    /**
     * namespace를 지정하고 만약 존재하지 않는 경우 생성하고 리턴한다.
     * @method namespace
     * @static
     * @sample default
     * @param  {String} i 생성할 1-n namespace들의 argument들 
     * @return {Object} j 생성된 마지막 namespace object의 reference
     */
    Rui.namespace = function() {
        var a=arguments, o=null, i, j, d;
        for (i=0; i<a.length; i=i+1) {
            d=a[i].split('.');
            o=Rui;

            // Rui is implied, so it is ignored if it is included
            for (j=(d[0] == 'Rui') ? 1 : 0; j<d.length; j=j+1) {
                o[d[j]]=o[d[j]] || {};
                o=o[d[j]];
            }
        }
    
        return o;
    };
    /**
     * 콘솔에 로그를 출력한다. (상황에 따라 브라우저 콘솔이나 RUI 콘솔로 출력된다.) 
     * @method log
     * @static
     * @sample default
     * @param  {String}  msg  log 할 message
     * @param  {String}  cat  message에 대한 log 분류. 
     *                        기본 분류는 'info', 'warn', 'error', 'time'이다.
     *                        custom 분류들은 잘 사용될 수 있다.(optional)
     * @param  {String}  src  message의 source(optional)
     * @return {boolean}      만약 log 작업이 성공했을 경우 True.
     */
    Rui.log = function(msg, cat, src){
        if(window.console){
            console.log((cat ? cat + ': ' : '') + msg + (src ? ' - ' + src : ''));
        }
    };
    /**
     * @description 값이 null인지 검사한다.
     * @method isNull
     * @static
     * @param {Object} o 검사할 object
     * @return {boolean} 결과
     */
    Rui.isNull = function(o){
        return Rui.util.LObject.isNull(o);
    };
    /**
     * @description 값이 undefined인지 검사한다.
     * @method isUndefined
     * @static
     * @param {Object} o 검사할 object
     * @return {boolean}
     */
    Rui.isUndefined = function(o){
        return Rui.util.LObject.isUndefined(o);
    };
    /**
     * @description object 타입이거나 함수인지 검사한다.
     * @method isObject
     * @static
     * @param {Object} o 검사할 object
     * @return {boolean}
     */
    Rui.isObject = function(o){
        return Rui.util.LObject.isObject(o);
    };
    /**
     * @description 값이 함수인지 검사한다.
     * @method isFunction
     * @static
     * @param {Object} o 검사할 object
     * @return {boolean}
     */
    Rui.isFunction = function(o){
        return Rui.util.LObject.isFunction(o);
    };
    /**
     * @description 값이 boolean (true or false) 형인지 검사한다.
     * @method isBoolean
     * @static
     * @param {Object} o 검사할 object
     * @return {boolean}
     */
    Rui.isBoolean = function(o){
        return Rui.util.LObject.isBoolean(o);
    };
    /**
     * @description 값이 문자열인지 검사한다.
     * @method isString
     * @static
     * @param {Object} o 검사할 object
     * @return {boolean}
     */
    Rui.isString = function(o){
        return Rui.util.LString.isString(o);
    };
    /**
     * @description 값이 array 형인지에 검사한다.
     * Array prototype을 대상으로 테스트하기 위한 다른 프레임으로의 
     * reference가 없다면, Safari에서 프레임 boundary를 넘어 array들의
     * typeof/instanceof/constructor 테스트는 불가능하다.
     * 이러한 케이스를 처리하기 위해, 대신 잘 알려진 array property들을 테스트 한다.
     * @method isArray
     * @static
     * @param {Object} o 검사할 object
     * @return {boolean}
     */
    Rui.isArray = function(o){
        return Rui.util.LArray.isArray(o);
    };
    /**
     * @description 값이 number형인지 검사한다.
     * @method isNumber
     * @static
     * @param {Object} o 검사할 object
     * @return {boolean}
     */
    Rui.isNumber = function(o){
        return Rui.util.LNumber.isNumber(o);
    };
    /**
     * @description 값이 date형인지 검사한다.
     * @method isDate
     * @static
     * @param {Object} o 검사할 object
     * @return {boolean}
     */
    Rui.isDate = function(o){
        return Rui.util.LDate.isDate(o);
    };
    /**
     * @description 값이 빈 값인지 검사한다.
     * undefined, null, '' 등은 모두 빈 값이다.
     * @method isEmpty
     * @static
     * @param {String} s 검사할 문자(열)
     * @return {boolean}
     */
    Rui.isEmpty = function(s){
        return Rui.util.LObject.isEmpty(s);
    };
    
    /**
     * 선행, 후행 공백을 제외한 문자열을 리턴한다.
     * 만약 입력값이 문자열이 아니면, 입력값은 처리되지 않고 반환될 것이다.
     * @method trim
     * @static
     * @param s {string} trim 처리할 문자열
     * @return {string} trim 처리된 문자열
     */
    Rui.trim = function(s){
        return Rui.util.LString.trim(s);
    };
    
    /**
     * 빈 function
     * @method emptyFn
     * @static
     * @return {void}
     */
    Rui.emptyFn = function() {};
 
    /**
     * 함수가 override된 경우에도 IE는 파생된 object에서의 native함수를 계산하지 않는다.
     * 이것은 Object prototype에서 우려되는 특정 함수들에 대한 해결책이다. 
     * @property _IEEnumFix
     * @static
     * @private
     * @param {Function} r  argument를 받을 object
     * @param {Function} s  argument로 propery들을 제공할 object
     */
    Rui._IEEnumFix = (Rui.browser.msie) ? function(r, s) {
        ADD = ['toString', 'valueOf'];
        for (var i=0, l = ADD.length; i<l ; i++) {
            var fname = ADD[i],
                f = s[fname];
            if (Rui.isFunction(f) && f != Object.prototype[fname]) {
                r[fname] = f;
            }
        }
    } : function(){};
       
    /**
     * constructor들과 method들을 연결할 수 있는 상속 전략을 지원하는
     * prototype, constructor, superclass property들을 설정하는 유틸리티.
     * Static member들은 상속되지 않는다.
     * @method extend
     * @static
     * @sample default
     * @param {Function} subc   변경할 object
     * @param {Function} superc 상속할 object
     * @param {Object} overrides  subclass prototype으로 추가할 추가적인 property와 method들.
     *                            이것들은 superclass가 존재한다면, 포함된 일치 항목들을
     *                            override 할 것이다.
     */
    Rui.extend = function(subc, superc, overrides) {
        if (!superc||!subc) {
            throw new Error('extend failed, please check that ' +
                            'all dependencies are included.');
        }
        var F = function() {};
        F.prototype=superc.prototype;
        subc.prototype=new F();
        subc.prototype.constructor=subc;
        subc.superclass=superc.prototype;
        if (superc.prototype.constructor == Object.prototype.constructor) {
            superc.prototype.constructor=superc;
        }
    
        if (overrides) {
            for (var i in overrides) {
                if (Rui.hasOwnProperty(overrides, i)) {
                    subc.prototype[i]=overrides[i];
                }
            }

            Rui._IEEnumFix(subc.prototype, overrides);
        }
    };
   
    /**
     * 만약 receiver가 property들을 아직 가지고 있지 않다면,
     * receiver에의 supplier에서 모든 propery들에 적용을 한다.
     * 부가적으로 하나 혹은 그 이상의 method/property들이 명시될 수 있다(추가적인 
     * parameter들로서). 이러한 option은 receiver가 이미 가지고 있는 property를
     * overwrite할 것이다. 만약 세번째 parameter에 true가 전송되면,
     * 모든 property는 receiver에서 overwrite되고 적용될 것이다.  
     *
     * @method applyObject
     * @static
     * @sample default
     * @since 2.3.0
     * @param {Function} r  argument를 받을 object
     * @param {Function} s  argument로 propery들을 제공할 object
     */
    Rui.applyObject = function(r, s) {
        if (!s||!r) {
            throw new Error('Absorb failed, verify dependencies.');
        }
        var a=arguments, i, p, override=a[2];
        override=true;
        if (override && override!==true) { // only absorb the specified properties
            for (i=2; i<a.length; i=i+1) {
                r[a[i]] = s[a[i]];
            }
        } else { // take everything, overwriting only if the third parameter is true
            for (p in s) {
                if (override || !(p in r)) {
                    r[p] = s[p];
                }
            }
            
            Rui._IEEnumFix(r, s);
        }
    };
 
    /**
     * prototype property만 적용하는 것을 제외하고 Rui.apply와 동일하다.
     * @see Rui.apply
     * @method applyPrototype
     * @static
     * @param {Function} r  argument를 받을 object
     * @param {Function} s  argument로 propery들을 제공할 object
     * @param {String|boolean} arguments  receiver에 전달될 0 혹은 그 이상의 property method들.
     *        아무것도 명시되지 않을 경우 supplier의 모든 것들은 receiver에
     *        존재하는 property가 overwrite되지 않는다면 사용될 것이다.
     *        만약 세번째 parameter로 true가 명시되면, 모든 property들은
     *        receiver에 존재하는 property를 overwrite하고 적용될 것이다.   
     */
    Rui.applyPrototype = function(r, s) {
        if (!s||!r) {
            throw new Error('Augment failed, verify dependencies.');
        }
        //var a=[].concat(arguments);
        var a=[r.prototype,s.prototype];
        for (var i=2;i<arguments.length;i=i+1) {
            a.push(arguments[i]);
        }

        Rui.applyIf.apply(this, a);
    };
    
    /**
     * conifg에 존재하는 모든 property를 obj에 복사한다
     * @method applyIf
     * @static
     * @sample default
     * @param {Object} obj property들의 receiver
     * @param {Object} config property들의 source
     * @return {Object} 반환될 obj
     */
    Rui.applyIf = function(o, c){
        if(o && c){
            for (var p in c){
                if(typeof o[p] == 'undefined'){ o[p] = c[p]; }
            }
        }
        return o;
    };

    /**
     * 모든 제공된 object들의 모든 property들을 포함하는 새로운 object를 리턴한다.
     * 더 이후의 object들로부터의 property들은 
     * 더 이전의 object들의 property들을 overwrite한다.
     * @method merge
     * @static
     * @since 2.3.0
     * @param {Object} arguments 병합할 object들
     * @return {object} 새로 병합된 object
     */
    Rui.merge = function() {
        var o={}, a=arguments;
        for (var i=0, l=a.length; i<l; i=i+1) {
            Rui.applyObject(o, a[i], true);
        }
        return o;
    };

    /**
     * Dom 객체를 리턴한다.
     * @method getDom
     * @static
     * @param {Object} id dom id
     * @return {HTMLElement}
     */
    Rui.getDom = function(el) {
        var o = null;
        if(typeof el == 'string') {
            o = document.getElementById(el);
        } else if(el instanceof Rui.LElement) {
            o = el.dom;
        } else 
            o = el;
        return o;
    };

    /**
     * 현재 HTML document object를 리턴한다.
     * @method getDoc
     * @static
     * @return Rui.LElement The document
     */
    Rui.getDoc = function(isDom){
        var doc = window.document;
        return isDom ? doc : Rui.get(doc);
    };

    /**
     * 현재 document body를 리턴한다.
     * @method getBody
     * @static
     * @return Rui.LElement The document body
     */
    Rui.getBody = function(isDom){
        var body = document.body || document.documentElement;
        return isDom ? body : Rui.get(body);
    };

    /**
     * DOM이 처음으로 사용가능할때 제공된 callback을 실행한다. (window.onload와 동일)
     * @method onReady
     * @sample default
     * @param {function} p_fn element가 발견되었을때 실행할 함수.
     * @param {object}   p_obj p_fn에 대한 parameter로 다시 전달하는 부가적인 object
     * @param {boolean|object}  p_scope 만약 true로 설정하면, p_fn은 p_onj의 scope에서 실행을 하며, object로 설정할 경우 그 object의 scope에서 실행한다.
     * @static
     * @return {void}
     */
    Rui.onReady = function(p_fn, p_obj, p_override){
        Rui.util.LEvent.onDOMReady(p_fn, p_obj, p_override);
    };

    /**
     * onAvaliable과 같은 방식으로 실행되지만, 추가적으로 
     * 사용가능한 element의 content를 수정하기 위한 안전 여부를 결정하기 위하여,
     * sibling element들의 상태를 체크한다.
     * @method onContentReady
     * @param {string}   p_id 찾을 element의 id.
     * @param {function} p_fn element가 준비되었을때 실행할 함수.
     * @param {object}   p_obj p_fn에 대한 parameter로 다시 전달하는 부가적인 object
     * @param {boolean|object}  p_scope 만약 true로 설정하면, p_fn은 p_onj의 scope에서 실행을 하며, object로 설정할 경우 그 object의 scope에서 실행한다.
     * @static
     * @return {void}
     */
    Rui.onContentReady = function(p_id, p_fn, p_obj, p_override) {
        Rui.util.LEvent.onContentReady(p_id, p_fn, p_obj, p_override);
    };

    /**
     * Ajax로 서버에 데이터를 요청한다.
     * @method ajax
     * @static
     * @sample default
     * @param {object} config config : url(String), method(String/optional), success(Function), failure(Function/optional), params(Object/optional), sync(Boolean/optional)
     * @return {object} connection object를 반환.
     */
    Rui.ajax = function(config) {
        config = Rui.applyIf(config, {
            method: 'GET',
            failure: Rui.emptyFn
        });
        return config.sync ? 
            Rui.LConnect.syncRequest(config.method, config.url, {
            success: config.success,
            failure: config.failure
        }, config.params, config): 
            Rui.LConnect.asyncRequest(config.method, config.url, {
            success: config.success,
            failure: config.failure
        }, config.params, config);
    };

    /**
     * 유일한 id들을 생성한다. 만약 element가 이미 id를 가지고 있으면, 그것은 변하지 않는다.
     * @method id
     * @static
     * @sample default
     * @param {Mixed} el (optional) id가 생성될 element
     * @param {String} prefix (optional) Id prefix (기본 'ext-gen')
     * @return {String} 생성된 Id.
     */
    Rui.id = function(el, prefix){
        return Rui.util.LDom.generateId(el, prefix);
    };

    /**
     * 주어진 CSS selector에 기반한 node들의 집합을 조회하여 Rui.LElementList로 리턴한다.
     * @method select
     * @sample default
     * @param {string} selector 테스트 할 CSS LDomSelector.
     * @param {HTMLElement | String} root optional query로 부터 시작할 id나 HTMLElement. 기본은 LDomSelector.document.
     * @param {boolean} firstOnly optional 처음 일치하는 값만 반환할지에 대한 여부.
     * @return {Rui.LElementList} 주어진 selector와 일치하는 node들의 array.
     * @static
     * @return {Rui.LElementList}
     */            
    Rui.select = function (selector, root, firstOnly) {
        if(selector.charAt(0) === '<' && selector.charAt(selector.length - 1) === '>' && selector.length >= 3) {
            return Rui.createElements(selector);
        }
        var n = Rui.util.LDomSelector.query(selector, root, firstOnly);
        var element = [];
        if(Rui.util.LArray.isArray(n)) {
            Rui.each(n, function(child) {
                element.push(new Rui.LElement(child));
            });
        } else {
            if(!Rui.isEmpty(n)) element.push(new Rui.LElement(n));
        }
        return new Rui.LElementList(element);
    };

    /**
     * 주어진 CSS selector에 기반한 node들의 집합을 조회한다.
     * @method query
     * @param {string} selector node를 상대로 테스트할 CSS LDomSelector.
     * @param {HTMLElement | String} root optional query로 부터 시작할 id나 HTMLElement. 기본은 LDomSelector.document.
     * @param {boolean} firstOnly optional 처음 일치하는 값만 반환할지에 대한 여부.
     * @return {Rui.LElementList} 주어진 selector와 일치하는 node들의 array.
     * @static
     * @return {Array}
     */
    Rui.query = function (selector, root, firstOnly) {
        return Rui.util.LDomSelector.query(selector, root, firstOnly);
    };

     /**
      * items 정보에 해당되는 객체를 Function으로 호출하는 메소드
      * @method each
      * @static
      * @param {Array} items Array 배열
      * @param {Function} func Array 배열
      * @param {Object} scope Array 배열
      * @return {void}
      */
     Rui.each = function(items, func, scope) {
         return Rui.util.LArray.each(items, func, scope);
     };

    /**
     * object나 array를 표현하는 간단한 문자열을 리턴한다.
     * @method dump
     * @static
     * @sample default
     * @since 2.3.0
     * @param {Object} o dump 할 object
     * @param {int} d child object를 탐색할 깊이(deep), 기본적으로 3
     * @return {String} dump 결과
     */
    Rui.dump = function(o, d) {
        var i, len, s=[], OBJ='{...}', FUN='f(){...}',
            COMMA=', ', ARROW=' => ';

        // Cast non-objects to string
        // Skip dates because the std toString is what we want
        // Skip HTMLElement-like objects because trying to dump 
        // an element will cause an unhandled exception in FF 2.x
        if (!Rui.isObject(o)) {
            return o + '';
        } else if (o instanceof Date || ('nodeType' in o && 'tagName' in o)) {
            return o;
        } else if  (Rui.isFunction(o)) {
            return FUN;
        }

        // dig into child objects the depth specifed. Default 3
        d = (Rui.util.LNumber.isNumber(d)) ? d : 3;

        // arrays [1, 2, 3]
        if (Rui.util.LArray.isArray(o)) {
            s.push('[');
            for (i=0,len=o.length;i<len;i=i+1) {
                if (Rui.isObject(o[i])) {
                    s.push((d > 0) ? Rui.dump(o[i], d-1) : OBJ);
                } else {
                    s.push(o[i]);
                }
                s.push(COMMA);
            }
            if (s.length > 1) {
                s.pop();
            }
            s.push(']');
        // objects {k1 => v1, k2 => v2}
        } else {
            s.push('{');
            for (i in o) {
                if (Rui.hasOwnProperty(o, i)) {
                    s.push(i + ARROW);
                    if (Rui.isObject(o[i])) {
                        s.push((d > 0) ? Rui.dump(o[i], d-1) : OBJ);
                    } else {
                        s.push(o[i]);
                    }
                    s.push(COMMA);
                }
            }
            if (s.length > 1) {
                s.pop();
            }
            s.push('}');
        }

        return s.join('');
    };

    /**
     * html 해당되는 객체를 생성한후 LElementList로 리턴한다.
     * @method createElements
     * @static
     * @sample default
     * @param {String} html 생성할 html
     * @param {object} options [optional] 추가 설정 
     * @return {Rui.LElementList} 
     */
    Rui.createElements = function(html, options) {
        return Rui.util.LDom.createElements(html, options);
    };
    
    /**
     * object instance에 property이 존재하는지 여부를 리턴한다.  
     * @method hasOwnProperty
     * @static
     * @sample default
     * @param {Object} o 테스트될 object
     * @param {string} prop 테스트할 property의 이름
     * @return {boolean} 결과
     */
    Rui.hasOwnProperty = (Object.prototype.hasOwnProperty) ?
        function(o, prop) {
            return o && o.hasOwnProperty(prop);
        } : function(o, prop) {
            return !Rui.isUndefined(o[prop]) && o.constructor.prototype[prop] !== o[prop];
        };

    Rui.augment = Rui.applyPrototype;

    /**
     * @description Rui.LElement object들을 조회하기 위한 Static method.
     * @method get
     * @static
     * @sample default
     * @param {Mixed} el DOM node나 존재하고 있는 Element의 id.
     * @return {Rui.LElement} object나 맞는 element를 찾지 못했으면 null
     */

    /**
     * Rui.env는 Rui 라이브러리나 브라우징 환경에 대해 알려진 항목들을 추적하는데 사용된다.
     * @class Rui.env
     * @static
     */

    /**
     * 명시된 모듈들에 대한 version 데이터를 반환한다:
     *      <dl>
     *      <dt>name:</dt>      <dd>모듈의 이름</dd>
     *      <dt>version:</dt>   <dd>사용중인 버전</dd>
     *      <dt>build:</dt>     <dd>사용중인 빌드 번호</dd>
     *      <dt>versions:</dt>  <dd>등록된 모든 버전들</dd>
     *      <dt>builds:</dt>    <dd>등록된 모든 빌드들</dd>
     *      <dt>mainClass:</dt> <dd>현재 버전과 빌드가 stamp된 object.
     *                 만약 mainClass.VERSION != version 이거나, mainClass.BUILD != build 이거나
     *                 라이브러리 조각의 여러 버전들이 로딩되어 있으면 잠재적으로 
     *                 이슈가 야기 될 수 있다.</dd>
     *       </dl>
     *
     * @method getVersion
     * @static
     * @param {String}  name 모듈의 이름(event, slider 등)
     * @return {Object} version 정보
     */
    Rui.env.getVersion = function(name) {
        return name ? Rui.env.modules[name] || null : Rui.env.version;
    };

    Rui.env._id_counter = Rui.env._id_counter || 0;

    window.$E = function(id) {
        return Rui.get(id);
    };

    window.$S = function(selector) {
        return Rui.select(selector);
    };

    window.$C = function(selector, root, firstOnly) {
        return Rui.select(selector, root, firstOnly);
    };

    /**
     * browser의 agent 정보
     * @namespace Rui
     * @class browser
     * @static
     */

    /**
     * @description 브라우져 버전 정보
     * @property version
     * @public
     * @static
     * @type {String}
     */

    /**
     * @description opera 브라우져 여부
     * @property opera
     * @public
     * @static
     * @type {boolean}
     */

    /**
     * @description chrome 브라우져 여부
     * @property chrome
     * @public
     * @static
     * @type {boolean}
     */

    /**
     * @description webkit 브라우져 여부
     * @property webkit
     * @public
     * @static
     * @type {boolean}
     */

    /**
     * @description safari 브라우져 여부
     * @property safari
     * @public
     * @static
     * @type {boolean}
     */

    /**
     * @description safari2 브라우져 여부
     * @property safari2
     * @public
     * @static
     * @type {boolean}
     */

    /**
     * @description safari3 브라우져 여부
     * @property safari3
     * @public
     * @static
     * @type {boolean}
     */

    /**
     * @description safari4 브라우져 여부
     * @property safari4
     * @public
     * @static
     * @type {boolean}
     */

    /**
     * @description safari5 브라우져 여부
     * @property safari5
     * @public
     * @static
     * @type {boolean}
     */

    /**
     * @description msie 브라우져 여부
     * @property msie
     * @public
     * @static
     * @type {boolean}
     */

    /**
     * @description msie6 브라우져 여부
     * @property msie6
     * @public
     * @static
     * @type {boolean}
     */

    /**
     * @description msie7 브라우져 여부
     * @property msie7
     * @public
     * @static
     * @type {boolean}
     */

    /**
     * @description msie8 브라우져 여부
     * @property msie8
     * @public
     * @static
     * @type {boolean}
     */

    /**
     * @description msie67 브라우져 여부
     * @property msie67
     * @public
     * @static
     * @type {boolean}
     */

    /**
     * @description msie678 브라우져 여부
     * @property msie678
     * @public
     * @static
     * @type {boolean}
     */

    /**
     * @description msie9 브라우져 여부
     * @property msie9
     * @public
     * @static
     * @type {boolean}
     */

    /**
     * @description msie10 브라우져 여부
     * @property msie10
     * @public
     * @static
     * @type {boolean}
     */

    /**
     * @description msie11 브라우져 여부
     * @property msie11
     * @public
     * @static
     * @type {boolean}
     */

    /**
     * @description mozilla 브라우져 여부
     * @property mozilla
     * @public
     * @static
     * @type {boolean}
     */

    /**
     * @description gecko 브라우져 여부
     * @property gecko
     * @public
     * @static
     * @type {boolean}
     */

    /**
     * @description gecko2 브라우져 여부
     * @property gecko2
     * @public
     * @static
     * @type {boolean}
     */

    /**
     * @description gecko3 브라우져 여부
     * @property gecko3
     * @public
     * @static
     * @type {boolean}
     */

    /**
     * pc의 platform 정보
     * @namespace Rui
     * @class platform
     * @static
     */

    /**
     * @description window os 여부
     * @property window
     * @public
     * @static
     * @type {boolean}
     */

    /**
     * @description mac os 여부
     * @property mac
     * @public
     * @static
     * @type {boolean}
     */

    /**
     * @description air 여부
     * @property air
     * @public
     * @static
     * @type {boolean}
     */

    /**
     * @description linux os 여부
     * @property linux
     * @public
     * @static
     * @type {boolean}
     */

    /**
     * @description isMobile 브라우져 여부
     * @property isMobile
     * @public
     * @static
     * @type {boolean}
     */
})();

if(document.attachEvent) {
    window.attachEvent('onerror', function(message, filename, lineno){
        Rui.updateLog(message, filename, lineno);
    });
}

Rui.namespace('Rui.util');

/**
 * Static Number 클래스는 Number 형식의 데이터를 처리하는 helper 함수들을 제공한다.
 * @module util
 * @namespace Rui.util
 * @requires Rui
 * @class LNumber
 * @static
 */
Rui.util.LNumber = {
    /**
     * @description 값이 number형인지 검사한다.
     * @method isNumber
     * @static
     * @param {Object} o 검사할 object
     * @return {boolean}
     */
    isNumber: function(o) {
        return (o instanceof Number || typeof o === 'number') && isFinite(o);
    },
    /**
     * @description native 자바스크립트 Number를 가져오고 사용자에서 표시할 문자열로 형식화 한다.
     * @method format
     * @static
     * @param nData {int} Number.
     * @param {Object} oConfig (Optional) config 객체
     *   prefix {String} 통화 지정자 '$'과 같은 각 숫자 앞에 문자열을 추가.
     *   decimalPrecision {Number} 반올림할 소수 자릿수의 숫자
     *   decimalSeparator {String} 소수점 구분기호
     *   thousandsSeparator {String} 천단위 구분기호
     *   suffix {String} 문자열은 '항목'(공백주의)처럼 각 번호 뒤에 추가
     * @return {String} Formatted number for display.
     */
    format: function(nData, oConfig){
        if (Rui.isNumber(nData)) {
            var bNegative = (nData < 0);
            var sOutput = nData + '';
            var sDecimalSeparator = (oConfig.decimalSeparator) ? oConfig.decimalSeparator : '.';
            var nDotIndex;
            // decimalPlaces를 decimalPrecision로 이름 변경 
            oConfig.decimalPrecision = oConfig.decimalPlaces || oConfig.decimalPrecision;

            // Manage decimals
            if (Rui.isNumber(oConfig.decimalPrecision)) {
                // Round to the correct decimal place
                var nDecimalPlaces = oConfig.decimalPrecision;
                var nDecimal = Math.pow(10, nDecimalPlaces);
                //sOutput = Math.round(nData * nDecimal) / nDecimal + '';
                sOutput = +(Math.round(nData + "e+" + nDecimalPlaces)  + "e-" + nDecimalPlaces) + '';
                
                nDotIndex = sOutput.lastIndexOf('.');
                
                if (nDecimalPlaces > 0) {
                    // Add the decimal separator
                    if (nDotIndex < 0) {
                        sOutput += sDecimalSeparator;
                        nDotIndex = sOutput.length - 1;
                    }
                    // Replace the '.'
                    else 
                        if (sDecimalSeparator !== '.') {
                            sOutput = sOutput.replace('.', sDecimalSeparator);
                        }
                    // Add missing zeros
                    while ((sOutput.length - 1 - nDotIndex) < nDecimalPlaces) {
                        sOutput += '0';
                    }
                }
            }
            
            var decimalValue = '';
            var sPos = sOutput.indexOf('.');
            if(sPos > -1) {
            	decimalValue = sOutput.substring(sPos + 1);
            	sOutput = sOutput.substring(0, sPos);
            }
            
            // Add the thousands separator
            if (oConfig.thousandsSeparator) {
                var sThousandsSeparator = oConfig.thousandsSeparator;
                nDotIndex = sOutput.lastIndexOf(sDecimalSeparator);
                nDotIndex = (nDotIndex > -1) ? nDotIndex : sOutput.length;
                var sNewOutput = sOutput.substring(nDotIndex);
                var nCount = -1;
                for (var i = nDotIndex; i > 0; i--) {
                    nCount++;
                    if ((nCount % 3 === 0) && (i !== nDotIndex) && (!bNegative || (i > 1)))
                        sNewOutput = sThousandsSeparator + sNewOutput;
                    sNewOutput = sOutput.charAt(i - 1) + sNewOutput;
                }
                sOutput = sNewOutput;
            }

            if(decimalValue && sDecimalSeparator)
            sOutput += sDecimalSeparator + decimalValue;
            
            // Prepend prefix
            sOutput = (oConfig.prefix) ? oConfig.prefix + sOutput : sOutput;
            // Append suffix
            sOutput = (oConfig.suffix) ? sOutput + oConfig.suffix : sOutput;
                        
            return sOutput;
        }
        // Still not a Number, just return unaltered
        else {
            return nData;
        }
    },
    /**
     * @description 범위값에 맞는 random값을 생성하여 리턴한다.
     * @method random
     * @static
     * @param {int} range 범위값
     * @return {int}
     */
    random: function(range) {
        return Math.ceil(Math.random()*range);
    }
};
Rui.namespace('Rui.util');

/**
 * Static Array 클래스는 Array 형식의 데이터를 처리하는 helper 함수들을 제공한다.
 * @module util
 * @namespace Rui.util
 * @requires Rui
 * @class LArray
 * @static
 */
Rui.util.LArray = {
    /**
     * items 정보에 해당되는 객체를 Function으로 호출하는 메소드
     * @method each
     * @param {Array} items Array 배열
     * @param {Function} func Array 배열
     * @param {Object} scope Array 배열
     * @return {void}
     */
    each: function(items, func, scope) {
        //var newItems = [].concat(items);
        var max = items.length;
        for (var i = 0 ; i < max; i++) {
            if(func.call(scope || window, items[i], i, max) == false) 
                break;
        }
    },
    /**
     * items 배열에서 item이 몇번째인지를 리턴하는 메소드
     * @method indexOf
     * @param {Array} items Array 배열
     * @param {Object} item Array 배열
     * @param {int} i [optional] 시작 위치
     * @return {int}
     */
    indexOf: function(items, item, i) {
        i || (i = 0);
        if(Rui.browser.msie678 || (typeof items.indexOf === 'undefined')) {
            var length = items.length;
            if (i < 0) i = length + i;
            for (; i < length; i++)
              if (items[i] === item) return i;
            return -1;
        } else return items.indexOf(item, i);
    },
    /**
     * items 배열에서 item이 존재하는지 여부를 리턴하는 메소드
     * @method contains
     * @param {Array} items Array 배열
     * @param {Object} item Array 배열
     * @return {boolean}
     */
    contains: function(items, item) {
        return (this.indexOf(items, item) >= 0) ? true : false;
    },
    /**
     * items 배열에서 index에 해당하는 객체를 삭제하는 메소드
     * @method removeAt
     * @param {Array} items Array 배열
     * @param {int} idx 삭제할 위치
     * @return {Object} 삭제된 위치
     */
     removeAt: function(items,idx){
         if (items.length > 0) {
             if (idx == 0) {
                 return items.slice(1, items.length);
             }
             else if (idx == items.length - 1) {
                 return items.slice(0, items.length - 1);
             }
             else {
                 var a = items.slice(0, idx);
                 var b = items.slice(idx + 1, items.length);
                 return a.concat(b);
             }
         } else {
             return items;
         }
     },
    /**
     * @description 값이 array 형인지에 검사한다.
     * Array prototype을 대상으로 테스트하기 위한 다른 프레임으로의 
     * reference가 없다면, Safari에서 프레임 boundary를 넘어 array들의
     * typeof/instanceof/constructor 테스트는 불가능하다.
     * 이러한 케이스를 처리하기 위해, 대신 잘 알려진 array property들을 테스트 한다.
     * @method isArray
     * @static
     * @param {Object} o 검사할 object
     * @return {boolean}
     */
    isArray: function(o) { 
        if (o) {
           return Rui.isNumber(o.length) && Rui.isFunction(o.splice);
        }
        return false;
    }
};
/**
 * The static String class provides helper functions to deal with data of type
 * Number.
 * static 문자열 클래스는 number 타입의 데이터를 처리하는데 도움을 주는 함수들을 제공한다.
 * @module core
 * @title Rui Global
 * @namespace prototype
 * @class String
 */

/**
 * @description static 문자열 클래스는 문자열 타입의 데이터를 처리하는데 도움을 주는 함수들을 제공한다.
 * @module util
 * @title LString
 * @requires Rui
 */
Rui.namespace('Rui.util');

(function(){
    /**
     * @description LString
     * @namespace Rui.util
     * @class LString
     * @static
     */
    Rui.util.LString = {
        /**
         * @description 문자열 앞뒤 공백 제거
         * @method trim
         * @static
         * @param {String} s 문자열
         * @return {String} 공백 제거된 문자열
         */
        trim: function(s){
            return s.replace(/^\s+|\s+$/g, '');
        },
        /**
         * @description 시작 문자열이 pattern에 맞는지 여부를 리턴한다.
         * @method startsWith
         * @param {String} s 작업 대상 문자열
         * @param {String} pattern 문자패턴
         * @return {boolean} 결과
         */
        startsWith: function(s, pattern){
            return s.indexOf(pattern) === 0;
        },
        /**
         * @description 종료 문자열이 pattern에 맞는지 여부를 리턴한다.
         * @method endsWith
         * @param {String} s 작업 대상 문자열
         * @param {String} pattern 문자패턴
         * @return {boolean} 결과
         */
        endsWith: function(s, pattern){
            var d = s.length - pattern.length;
            return d >= 0 && s.lastIndexOf(pattern) === d;
        },
        /**
        * @description 문자열의 왼쪽부터 특정 문자를 주어진 갯수만큼 붙여넣는다.
        * @method lPad
        * @static
        * @param {String} x 작업 대상 문자열
        * @param {String} pad padding할 문자
        * @param {int} r 붙이는 갯수
        * @return {String} 결과 문자열
        */
        lPad: function(x, pad, r){
            x += '';
            r = r || x.length + 1;
            for (; x.length < r && r > 0; ) {
                x = pad.toString() + x;
            }
            return x.toString();
        },
       /**
        * @description 문자열의 오른쪽부터 특정 문자를 주어진 갯수만큼 붙여넣는다.
        * @method rPad
        * @static
        * @param {String} x 작업 대상 문자열
        * @param {String} pad padding할 문자
        * @param {int} r 붙이는 갯수
        * @return {String} 결과 문자열
        */
        rPad: function(x, pad, r){
            x += '';
            r = r || x.length + 1;
            for (; x.length < r && r > 0; ) {
                x = x + pad.toString();
            }
            return x.toString();
        },
        /**
         * @description 문자열을 주어진 길이만큼 잘라낸다.
         * @method cut
         * @param {String} s 문자열
         * @param {int} start 시작위치
         * @param {int} length 잘라낼 길이
         * @return {String} 잘라낸 후 문자열
         */
        cut: function(s, start, length){
            return s.substring(0, start) + s.substr(start + length);
        },
        /**
         * @description 문자열을 주어진 format에 따라 Date 객체로 변환
         * @method toDate
         * @static
         * @param {String} sDate
         * @param {Object} oConfig oConfig.format/oConfig.locale
         * @return {Date} oDate
         */
        toDate: function(sDate, oConfig){
             return Rui.util.LDate.parse(sDate, oConfig);
        },
        /**
         * @description 입력된 xml 문자열을 xml document object model로 변환해서 return
         * @method toXml
         * @static
         * @param {String} text
         * @return {object} xml dom
         */
        toXml: function(text){
            var xmlDoc = null;
            if (window.DOMParser) {
                var parser = new DOMParser();
                xmlDoc = parser.parseFromString(text, 'text/xml');
            }
            else // Internet Explorer
            {
                xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
                xmlDoc.async = 'false';
                xmlDoc.loadXML(text);
            }
            return xmlDoc;
        },
        /**
         * @description 값이 문자열인지 검사한다.
         * @method isString
         * @static
         * @param {Object} o 검사할 object
         * @return {boolean}
         */
        isString: function(o) {
            return typeof o === 'string';
        },
        /**
         * @description 값이 빈 값인지 검사한다.
         * undefined, null, '' 등은 모두 빈 값이다.
         * @method isEmpty
         * @static
         * @param {String} s 검사할 문자(열)
         * @return {boolean}
         */
        isEmpty: function(s){
            return (s === null || s === undefined || s === '');
        },
        /**
         * @description 문자열을 구분자를 통해 잘라낸다.
         * @method advancedSplit
         * @param {String} s 문자열
         * @param {String} delim 구분자
         * @parma {String} 옵션 I : 옵션 T:
         * @return {Array}
         */
        advancedSplit: function(s, delim, options){
        	if(Rui.isEmpty(s)) return [''];
            if (options == null || Rui.util.LString.trim(options) == '') {
                return s.split(delim);
            }
            var optionI = false;
            var optionT = false;
            options = Rui.util.LString.trim(options).toUpperCase();
            for (var i = 0; i < options.length; i++) {
                if (options.charAt(i) == 'I') {
                    optionI = true;
                }
                else
                    if (options.charAt(i) == 'T') {
                        optionT = true;
                    }
            }

            var arr = [];
            var cnt = 0;
            var startIdx = 0;
            var delimIdx = -1;
            var str = s;
            while ((delimIdx = (str == null) ? -1 : str.indexOf(delim, startIdx)) != -1) {
                if (optionI && str.substr(delimIdx - 1, (1+delimIdx)) == '\\' + delim) {
                    str = Rui.util.LString.cut(str, delimIdx - 1, 1);
                    startIdx = delimIdx;
                    continue;
                }
                arr[cnt++] = optionT ? Rui.util.LString.trim(str.substring(0, delimIdx)) : str.substring(0, delimIdx);
                str = str.substr(delimIdx + 1);
                startIdx = 0;
            }
            if(!Rui.isEmpty(str))
            	arr[cnt] = str;
            return arr;
        },
        /**
         * @description 첫 문자만 대문자로 변환한다.
         * @method firstUpperCase
         * @param {String} s 문자열
         * @return {String} 변환 후 문자열
         */
        firstUpperCase: function(s){
            if (s != null && s.length > 0)
                return s.charAt(0).toUpperCase() + s.substring(1);
            return s;
        },
        /**
         * @description 첫 문자만 소문자로 변환한다.
         * @method firstLowerCase
         * @param {String} s 문자열
         * @return {String} 변환 후 문자열
         */
        firstLowerCase: function(s){
            if (s != null && s.length > 0)
                return s.charAt(0).toLowerCase() + s.substring(1);
            return s;
        },
        /**
         * @description 스트링의 자릿수를 Byte 단위로 환산하여 알려준다. 영문, 숫자는 1Byte이고 한글은 2Byte이다.(자/모 중에 하나만 있는 글자도 2Byte이다.)
         * @method getByteLength
         * @param {String} value
         * @return {int} 스트링의 길이
         */
        getByteLength: function(value){
            var byteLength = 0;

            if (Rui.isEmpty(value)) {
                return 0;
            }
            var c;
            for (var i = 0; i < value.length; i++) {
                c = escape(value.charAt(i));
                // alert(value.charAt(i) + '/' + c);
                if (c.length == 1) {        // when English then 1byte
                    byteLength ++;
                } else if (c.indexOf('%u') != -1)  {    // when Korean then 2byte
                    // if charset = utf8 then length = 3
                    //byteLength += 2;
                    byteLength += 3;    // utf-8 : 3
                } else if (c.indexOf('%') != -1)  { // else 3byte
                    byteLength += c.length/3;
                }
            }
            return byteLength;
        },
        /**
         * @description 문자열에 포함된 문자값을 모두 변경한다.
         * @method replaceAll
         * @param {String} s1 기본 문자열
         * @param {String} s2 변경할 문자열
         * @param {String} s3 변경될 문자열
         * @return {String} 결과값
         */
        replaceAll: function(s1, s2, s3) {
        	var r = null;
        	if(s1) {
        		r = s1.split(s2).join(s3);
        	}
        	return r;
        }
    };

    Rui.util.LString.format = /^((\w|[\-\.])+)@((\w|[\-\.])+)\.([A-Za-z]+)$/;
})();
/**
 * static 문자열 클래스는 object 타입의 데이터를 처리하는데 도움을 주는 함수들을 제공한다.
 * @module util
 * @title LObject
 * @namespace Rui.util
 * @class LObject
 * @static
 */
Rui.namespace('Rui.util');

Rui.util.LObject = {
    /**
     * @description 객체를 복사하는 메소드
     * @method clone
     * @public
     * @static
     * @param {Object} o 복사하고자 하는 원본 객체
     * @param {boolean} literal (optional) literal 객체 여부
     * @param {Functdion} fn (optional) Function 객체.
     * @return {Object} 복사된 객체
     */
    clone: function(o, literal, fn){
        var loop = 0;
        var maxLoop = 1000;//무한루프방지
        var cloneFn = function(o, literal, fn) {
            if(literal)
                return [].concat(o);
            else {
                if(!Rui.isValue(o)) {
                    return o;
                }
                
                var copy = {};
                
                if(fn && fn.apply(this, o) === true) {
                    copy = o;
                }
                else if(Rui.isFunction(o)) {
                    copy = o;
                }
                else if(Rui.isArray(o)) {
                    var array = [];
                    for (var i=0,len=o.length;i<len;i++) {
                        if (loop > maxLoop) {
                            continue;
                        }
                        loop++;
                        array[i] = Rui.util.LObject.clone(o[i], literal, fn);
                    }
                    copy = array;
                }
                else if(Rui.isObject(o)) { 
                    for (var x in o){
                        if(Rui.hasOwnProperty(o, x)) {
                            if(Rui.isValue(o[x]) && Rui.isObject(o[x]) || Rui.isArray(o[x])) {
                                if (loop > maxLoop) {
                                    continue;
                                }
                                loop++;
                                copy[x] = cloneFn(o[x], literal, fn);
                            }else{
                                copy[x] = o[x];
                            }
                        }
                    }
                } else {
                    copy = o;
                }

                return copy;
            }
        };

        return cloneFn(o, literal, fn);
    },
    /**
     * QueryString형 문자로 리턴한다.
     * @method serialize
     * @static
     * @param {Array} params Array 배열
     * @return {String} QueryString형 문자열 id=ddd&pwd=ccc
     */
    serialize: function(params) {
        var buf = [];
        for (var key in params) {
            if (typeof params[key] != 'function') {
                buf.push(encodeURIComponent(key), '=', encodeURIComponent(params[key]), '&');
            }
        }
        delete buf[buf.length - 1];
        params = buf.join('');
        return params;
    },
    /**
     * @description 값이 boolean (true or false) 형인지 검사한다.
     * @method isBoolean
     * @static
     * @param {Object} o 검사할 object
     * @return {boolean}
     */
    isBoolean: function(o) {
        return typeof o === 'boolean';
    },
    /**
     * @description 값이 함수인지 검사한다.
     * @method isFunction
     * @static
     * @param {Object} o 검사할 object
     * @return {boolean}
     */
    isFunction: function(o) {
        return typeof o === 'function';
    },
    /**
     * @description 값이 null인지 검사한다.
     * @method isNull
     * @static
     * @param {Object} o 검사할 object
     * @return {boolean} 결과
     */
    isNull: function(o) {
        return o === null;
    },
    /**
     * @description 값이 undefined인지 검사한다.
     * @method isUndefined
     * @static
     * @param {Object} o 검사할 object
     * @return {boolean}
     */
    isUndefined: function(o) {
        return  o === undefined;
    },
    /**
     * @description 값이 빈 값인지 검사한다.
     * undefined, null, '' 등은 모두 빈 값이다.
     * @method isEmpty
     * @static
     * @param {String} s 검사할 문자(열)
     * @return {boolean}
     */
    isEmpty: function(s){
        return (s === null || s === undefined || s === '');
    },
    /**
     * @description object 타입이거나 함수인지 검사한다.
     * @method isObject
     * @static
     * @param {Object} o 검사할 object
     * @return {boolean}
     */
    isObject: function(o) {
        return (o && (typeof o === 'object' || Rui.isFunction(o))) || false;
    },
    /**
     * @description 문자열 값을 본래의 객체 형태로 반환하는 함수 (IE6,7의 DOMCollection 버그 패치용 값 변환기)
     * @method parseObject
     * @protected
     * @static
     * @param {Object} o 검사할 object
     * @return {boolean}
     */
    parseObject: function(v){
        if(v === 'null')
            return null;
        if(v === 'true')
            return true;
        if(v === 'false')
            return false;
        if(isNaN(parseInt(v, 10)) === false)
            return parseInt(v, 10);
        return v;
    },
    /**
     * @description object에 key에 해당되는 변수가 선언되어 있는지 여부를 리턴한다.
     * @method hasKey
     * @static
     * @param {Object} obj 검사할 object
     * @param {String} key 키값
     * @return {boolean}
     */
    hasKey: function(obj, key) {
    	var m;
    	for (m in obj) {
    		if(m == key) {
    			return true;
    		}
    	}
    	return false;
    }
};

/**
 * @module
 * @namespace Rui.util
 * @requires Rui
 */
(function(){

    var xPad = function(x, pad, r){
        r = r || 10;
        for (; parseInt(x, 10) < r && r > 1; r /= 10) {
            x = pad.toString() + x;
        }
        return x.toString();
    };
    
    /**
     * Date type의 데이터를 다루는데 도움이 되는 function을 제공하는 static Date 클래스 
     * java.sql.date의 toString은 yyyy-MM-dd로 return이 되므로 이에 대응
     *  <dl>
     *   <dt>config.format의 약어 내용은 아래와 같다.</dt>
     *   <dd>strftime에 정의된 format을 지원한다.</dd>
     *  </dl>
     *  strftime은 http://www.opengroup.org/onlinepubs/007908799/xsh/strftime.html에
     *  오픈 그룹에 의해 정의된 여러가지 format 지정자들을 가지고 있다. 
     *
     *  PHP는 http://www.php.net/strftime에 정의된 자체의 몇가지 항목들을 추가한다.
     *
     *  이러한 자바스크립트 구현은 모든 PHP 지정자와 몇가지를 더 지원한다.
     *
     *  <br/>arg \%a - 현재 locale의 요일의 단축표시 ex) ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
     *  <br/>arg \%A - 현재 locale의 요일 표시 ex) ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
     *  <br/>arg \%b - 현재 locale의 달의 단축표시 ex) ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
     *  <br/>arg \%B - 현재 locale의 달 표시 ex) ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
     *  <br/>arg \%c - 현재 locale의 선호되는 날짜와 시간 표시 ex) 미국 : %a %d %b %Y %T %Z, 한국 : %Y년 %b %d %a %T %Z
     *  <br/>arg \%C - century number 현재 년도를 100으로 나누고 정수로 만든값으로 00~99
     *  <br/>arg \%d - 달의 일을 표시하는 값으로 01 ~ 31을 표시
     *  <br/>arg \%D - %m/%d/%y와 같다.
     *  <br/>arg \%e - %d와 비슷하나 1자리수의 경우 0대신이 공백이 들어간다. ' 1' ~ '31'
     *  <br/>arg \%F - %Y-%m-%d와 같다. (ISO 8601 date format)
     *  <br/>arg \%g - Two digit representation of the year going by ISO-8601:1988 standards (see %V)
     *  <br/>arg \%G - The full four-digit version of %g
     *  <br/>arg \%h - %b와 같다.
     *  <br/>arg \%H - 24-hour 00 ~ 23
     *  <br/>arg \%I - 12-hour 01 ~ 12
     *  <br/>arg \%j - 년중 몇번째 일인지 표시 001 ~ 366
     *  <br/>arg \%k - 24-hour 0 ~ 23
     *  <br/>arg \%l - 12-hour 1 ~ 12 
     *  <br/>arg \%m - month 01 ~ 12
     *  <br/>arg \%M - minute 00 ~ 59
     *  <br/>arg \%n - 줄바꿈문자
     *  <br/>arg \%p - 현재 locale의 `AM', `PM'
     *  <br/>arg \%P - %p와 같으나 소문자 'am', 'pm'
     *  <br/>arg \%q - 입력용 format으로 년월일을 표시하며 기본 %Y%m%d이다.
     *  <br/>arg \%Q - 입력용 format으로 년월일시분초를 표시하면 기본 %Y%m%d%H%M%S이다. 
     *  <br/>arg \%r - %p를 붙인 12시간제 시간 표시 %I:%M:%S %p와 같다.
     *  <br/>arg \%R - 24시간 표시 %H:%M와 같다.
     *  <br/>arg \%s - Unix Epoch Time timestamp, 1970-01-01 00:00:00 UTC이후의 초 ex) 305815200는 September 10, 1979 08:40:00 AM이다.
     *  <br/>arg \%S - 초 00 ~ 59
     *  <br/>arg \%t - tab문자
     *  <br/>arg \%T - 현재시간 %H:%M:%S와 같다.
     *  <br/>arg \%u - 요일을 숫자로 표시 1이 월요일이다.  1 ~ 7
     *  <br/>arg \%U - 지정한 년의 주번호 첫번째 일요일 부터 한주로 계산한다.
     *  <br/>arg \%V - 지정한 년의 주번호(ISO 8601:1988) 첫번째 월요일 부터 한주로 계산한다.  단 첫주는 적어도 4일이상이 되어야 한다. 01~53
     *  <br/>arg \%w - 요일을 숫자로 표시 0이 일요일이다.  0 ~ 6
     *  <br/>arg \%W - 지정한 년의 주번호 첫번째 월요일 부터 한주로 계산.
     *  <br/>arg \%x - 현재 locale의 기본 년월일 format ex) 2010-05-14, 14/05/10
     *  <br/>arg \%X - 현재 locale의 시간 ex) 2010-05-14 15:59:16
     *  <br/>arg \%y - century를 뺀 년도 00 ~ 99
     *  <br/>arg \%Y - century를 포함한 년도 ex) 2010
     *  <br/>arg \%z - time zone(UTC) 약어 또는 전체 명 ex) -0500 또는 EST for Eastern Time
     *  <br/>arg \%Z - time zone name / abbreviation
     *  <br/>arg \%% - a literal `\%' character   
     * @requires Rui
     * @namespace Rui.util
     * @class LDate
     * @static
     */
    var Dt = {
    
/***************************************LDateMath에서 가져온 function 시작***************************************/
    
        /**
         * representing Day 상수 field
         * @property DAY
         * @static
         * @final
         * @type String
         */
        DAY: "D",

        /**
         * representing Week 상수 field
         * @property WEEK
         * @static
         * @final
         * @type String
         */
        WEEK: "W",

        /**
         * representing Year 상수 field
         * @property YEAR
         * @static
         * @final
         * @type String
         */
        YEAR: "Y",

        /**
         * representing Month 상수 field
         * @property MONTH
         * @static
         * @final
         * @type String
         */
        MONTH: "M",

        /**
         * representing Hour 상수 field
         * @property HOUR
         * @static
         * @final
         * @type String
         */
        HOUR:"H",

        /**
         * representing Minute 상수 field
         * @property MINUTE
         * @static
         * @final
         * @type String
         */
        MINUTE: "m",

        /**
         * representing Second 상수 field
         * @property SECOND
         * @static
         * @final
         * @type String
         */
        SECOND: "S",

        /**
         * representing Milisecond 상수 field
         * @property MILISECOND
         * @static
         * @final
         * @type String
         */
        MILLISECOND: "s",

        /**
         * representing one day, in milliseconds 상수 field
         * @property ONE_DAY_MS
         * @static
         * @final
         * @type Number
         */
        ONE_DAY_MS: 1000* 60* 60* 24,

        /**
         * Constant field representing the date in first week of January
         * which identifies the first week of the year.
         * 한해의 첫주를 식별하게 하는 1월의 첫째주에 대한 date를 표시하는 상수 field
         * <p>
         * 미국에서는 1월 1일이 보통 한주의 일요일 시작을 기반으로 사용된다.
         * 유럽에서 넓게 사용되는 ISO 8601 은 한주의 월요일 시작을 기반으로한 1월 4일을 사용한다.
         * </p>
         * @property WEEK_ONE_JAN_DATE
         * @static
         * @final
         * @type Number
         */
        WEEK_ONE_JAN_DATE: 1,

        /**
         * 해당 instance에 특정 시간량을 추가한다.
         * @method add
         * @static
         * @param {Date} date    추가적으로 실행될 JavaScript Date object
         * @param {String} field 추가적인 실행에 사용되는 field constant
         * @param {Number} amount  날짜에 추가하기 위한 unit들의 number(field constant에서 측정된)
         * @return {Date} Date object의 결과
         */
        add: function(date, field, amount) {
            var d = new Date(date.getTime());
            switch (field) {
                case this.MONTH:
                    var newMonth = date.getMonth() + amount;
                    var years = 0;
    
                    if (newMonth < 0) {
                        while (newMonth < 0) {
                            newMonth += 12;
                            years -= 1;
                        }
                    } else if (newMonth > 11) {
                        while (newMonth > 11) {
                            newMonth -= 12;
                            years += 1;
                        }
                    }
    
                    d.setMonth(newMonth);
                    d.setFullYear(date.getFullYear() + years);
                    break;
                case this.DAY:
                    this._addDays(d, amount);
                    break;
                case this.YEAR:
                    d.setFullYear(date.getFullYear() + amount);
                    break;
                case this.WEEK:
                    this._addDays(d, (amount* 7));                
                    break;
                case this.HOUR:
                    date.setHours(date.getHours()+amount);
                    d = date;
                    break;
                case this.MINUTE:
                    date.setMinutes(date.getMinutes()+ amount);
                    d = date;
                    break;
                case this.SECOND:
                    date.setSeconds(date.getSeconds()+ amount);
                    d = date;
                    break;
                case this.MILLISECOND:
                    date.setMilliseconds(date.getMilliseconds()+ amount);
                    d = date;
                    break;
            }
            return d;
        },

        /**
         * Subtracts the specified amount of time from the this instance.
         * 해당 인스턴스로 부터 지정된 분량의 시간을 차감한다.
         * @method subtract
         * @static
         * @param {Date} date    차감시 수행할 자바스크립트 Date object
         * @param {Number} field 차감 실행에 대해 사용될 필드 상수
         * @param {Number} amount    date로부터 차감할 유닛들의 숫자(필드 상수에서 측정된)
         * @return {Date} Date object 결과
         */
        subtract: function(date, field, amount) {
            return this.add(date, field, (amount * -1));
        },

        /**
         * Date.setDate(n)의 n값이 -128 미만이거나 127보다 클때, 
         * Safari 2 (webkit < 420) 버그에 대해 담당 하는 private helper method.
         * <p>
         * 해결 접근 및 문제 원인은 다음에서 찾을 수 있다.:
         * http://brianary.blogspot.com/2006/03/safari-date-bug.html
         * </p>
         * @method _addDays
         * @private
         * @static
         * @param {Date} d JavaScript date object
         * @param {Number} nDays date object에 추가할 날짜들의 number(음수 가능)
         */
        _addDays: function(d, nDays) {
            if (Rui.browser.webkit && Rui.browser.webkit < 420) {
                if (nDays < 0) {
                    // Ensure we don't go below -128 (getDate() is always 1 to 31, so we won't go above 127)
                    for (var min = -128; nDays < min; nDays -= min) {
                        d.setDate(d.getDate() + min);
                    }
                } else {
                    // Ensure we don't go above 96 + 31 = 127
                    for (var max = 96; nDays > max; nDays -= max) {
                        d.setDate(d.getDate() + max);
                    }
                }
                // nDays should be remainder between -128 and 96
            }
            d.setDate(d.getDate() + nDays);
        },

        /***************************************LDateMath에서 가져온 function 끝***************************************/
        
        /**
         * 출처 : http://pubs.opengroup.org/onlinepubs/007908799/xsh/strftime.html
         * @property format
         * @private
         * @static
         */
        formats: {
            a: function (d, l) { return l.a[d.getDay()]; },
            A: function (d, l) { return l.A[d.getDay()]; },
            b: function (d, l) { return l.b[d.getMonth()]; },
            B: function (d, l) { return l.B[d.getMonth()]; },
            C: function (d) { return xPad(parseInt(d.getFullYear()/100, 10), 0); },
            d: ['getDate', '0'],
            e: ['getDate', ' '],
            g: function (d) { return xPad(parseInt(Dt.formats.G(d)%100, 10), 0); },
            G: function (d) {
                    var y = d.getFullYear();
                    var V = parseInt(Dt.formats.V(d), 10);
                    var W = parseInt(Dt.formats.W(d), 10);
        
                    if(W > V) {
                        y++;
                    } else if(W===0 && V>=52) {
                        y--;
                    }
        
                    return y;
                },
            H: ['getHours', '0'],
            I: function (d) { var I=d.getHours()%12; return xPad(I===0?12:I, 0); },
            j: function (d) {
                    var gmd_1 = new Date('' + d.getFullYear() + '/1/1 GMT');
                    var gmdate = new Date('' + d.getFullYear() + '/' + (d.getMonth()+1) + '/' + d.getDate() + ' GMT');
                    var ms = gmdate - gmd_1;
                    var doy = parseInt(ms/60000/60/24, 10)+1;
                    return xPad(doy, 0, 100);
                },
            k: ['getHours', ' '],
            l: function (d) { var I=d.getHours()%12; return xPad(I===0?12:I, ' '); },
            m: function (d) { return xPad(d.getMonth()+1, 0); },
            M: ['getMinutes', '0'],
            p: function (d, l) { return l.p[d.getHours() >= 12 ? 1 : 0 ]; },
            P: function (d, l) { return l.P[d.getHours() >= 12 ? 1 : 0 ]; },
            s: function (d, l) { return parseInt(d.getTime()/1000, 10); },
            S: ['getSeconds', '0'],
            u: function (d) { var dow = d.getDay(); return dow===0?7:dow; },
            U: function (d) {
                    var doy = parseInt(Dt.formats.j(d), 10);
                    var rdow = 6-d.getDay();
                    var woy = parseInt((doy+rdow)/7, 10);
                    return xPad(woy, 0);
                },
            V: function (d) {
                    var woy = parseInt(Dt.formats.W(d), 10);
                    var dow1_1 = (new Date('' + d.getFullYear() + '/1/1')).getDay();
                    // First week is 01 and not 00 as in the case of %U and %W,
                    // so we add 1 to the final result except if day 1 of the year
                    // is a Monday (then %W returns 01).
                    // We also need to subtract 1 if the day 1 of the year is 
                    // Friday-Sunday, so the resulting equation becomes:
                    var idow = woy + (dow1_1 > 4 || dow1_1 <= 1 ? 0 : 1);
                    if(idow === 53 && (new Date('' + d.getFullYear() + '/12/31')).getDay() < 4){
                        idow = 1;
                    }
                    else if(idow === 0){
                        idow = Dt.formats.V(new Date('' + (d.getFullYear()-1) + '/12/31'));
                    }
                    return xPad(idow, 0);
                },
            w: 'getDay',
            W: function (d) {
                    var doy = parseInt(Dt.formats.j(d), 10);
                    var rdow = 7-Dt.formats.u(d);
                    var woy = parseInt((doy+rdow)/7, 10);
                    return xPad(woy, 0, 10);
                },
            y: function (d) { return xPad(d.getFullYear()%100, 0); },
            Y: 'getFullYear',
            z: function (d) {
                    var o = d.getTimezoneOffset();
                    var H = xPad(parseInt(Math.abs(o/60), 10), 0);
                    var M = xPad(Math.abs(o%60), 0);
                    return (o>0?'-':'+') + H + M;
                },
            Z: function (d) {
                    var tz = d.toString().replace(/^.*:\d\d( GMT[+-]\d+)? \(?([A-Za-z ]+)\)?\d*$/, '$2').replace(/[a-z ]/g, '');
                    if(tz.length > 4) {
                        tz = Dt.formats.z(d);
                    }
                    return tz;
                },
            '%': function (d) { return '%'; }
        },

        aggregates: {
            c: 'locale',
            D: '%m/%d/%y',
            F: '%Y-%m-%d',
            h: '%b',
            n: '\n',
            q: 'locale',//숫자형 날짜형식 short
            Q: 'locale',//숫자형 날짜형식 long
            r: 'locale',
            R: '%H:%M',
            t: '\t',
            T: '%H:%M:%S',
            x: 'locale',
            X: 'locale'
            //'+': '%a %b %e %T %Z %Y'
        },

        /**
         * 내장된 JavaScript Date를 가져오고 사용자에게 표시할 문자열로 formating 처리.
         * @method format
         * @static
         * @param date {Date} Date.
         * @param {Object} config (Optional) 부가적인 configuration 값:
         * @return {String} 표시할 Formatted date.
         */
        format: function (date, config) {
            config = config || {};
            if(Rui.isString(date)) {
                // 바꾸고자 하는 값이 Date 객체가 아니라 문자열인 경우에 Date 객체로 변환한다.            
                date = Rui.util.LDate.parse(date,{locale:config.locale});
            }
            var sLocale = config.locale;
            var format = config.format;
            if(!format && Rui.isString(config)) format = config;
            format = Dt.getFormat(format, sLocale);
            
            if(!date.getFullYear)
            	return Rui.isValue(date) ? date : "";
            
            // Be backwards compatible, support strings that are
            // exactly equal to YYYY/MM/LDD, LDD/MM/YYYY and MM/LDD/YYYY
            if(format === 'YYYY/MM/LDD') {
                format = '%Y/%m/%d';
            } else if(format === 'LDD/MM/YYYY') {
                format = '%d/%m/%Y';
            } else if(format === 'MM/LDD/YYYY') {
                format = '%m/%d/%Y';
            }
            // end backwards compatibility block
            
            var aLocale = Dt.getLocale(sLocale);
            
            var replace_aggs = function (m0, m1) {
                var f = Dt.aggregates[m1];
                return (f === 'locale' ? aLocale[m1] : f);
            };
            
            // First replace aggregates (run in a loop because an agg may be made up of other aggs)
            while (format.match(/%[cDFhnrRtTxX]/)) {
                format = format.replace(/%([cDFhnrRtTxX])/g, replace_aggs);
            }
    
            var replace_formats = function (m0, m1) {
                var f = Dt.formats[m1];
                if(typeof f === 'string') {             // string => built in date function
                    return date[f]();
                } else if(typeof f === 'function') {    // function => our own function
                    return f.call(date, date, aLocale);
                } else if(typeof f === 'object' && typeof f[0] === 'string') {  // built in function with padding
                    return xPad(date[f[0]](), f[1]);
                } else {
                    return m1;
                }
            };        
    
            // Now replace formats (do not run in a loop otherwise %%a will be replace with the value of %a)
            var str = format.replace(/%([aAbBCdegGHIjklmMpPsSuUVwWyYzZ%])/g, replace_formats);
            replace_aggs = replace_formats = undefined;
            return str;
        },

        /**
         * @description 기본 local 정보 등을 가져온다.
         * @method getLocale
         * @static
         * @param {String} sLocale
         * @return Rui.util.LDateLocale
         */
        getLocale: function (sLocale){
            sLocale = sLocale || ((Rui.getConfig) ? Rui.getConfig().getFirst("$.core.defaultLocale") : "ko");
            // Make sure we have a definition for the requested locale, or default to ko.
            /*
            if(!(sLocale in Rui.util.LDateLocale)) {
                if(sLocale.replace(/-[a-zA-Z]+$/, '') in Rui.util.LDateLocale) {
                    sLocale = sLocale.replace(/-[a-zA-Z]+$/, '');
                } else {
                    sLocale = "ko";
                }
            }
            */
            return Rui.util.LDateLocale.getInstance(sLocale);
        },

        /**
         * @description format 문자열 return, 입력값 없을 경우 default return
         * @method getFormat
         * @static
         * @param {String} format
         * @param {String} locale
         * @return {string}
         */
        getFormat: function(format, locale){       
            format = format || "%x";       
            if(format == "%x" || format == "%q" || format == "%Q" || format == "%T" || format == "%R" || format == "%r"){
                var aLocale = Dt.getLocale(locale);
                for (var f in Dt.aggregates){
                    if(Dt.aggregates[f] != 'locale'){
                        aLocale[f] = Dt.aggregates[f]; 
                    }
                }
                format = aLocale[format.replace('%','')];
            }
            return format;
        },

        /**
         * @description 두 날짜를 format 형식에 맞게 비교한다. config를 주지 않을경우 %x(yyyy-mm-dd)로 비교한다.
         * @method equals
         * @static
         * @param {Date} date1 대상 date 객체
         * @param {Date} date2 비교 대상 date 객체
         * @param {Object} config [optional] format등 옵션
         * @return {boolean}
         */
        equals: function(d1, d2, config) {
            config = config || { format:'%x' };
            return (d1.format(config.format) == d2.format(config.format));
        },

        /**
         * 주어진 년, 월, 일을 표시하는 새로운 자바스크립트 Date object를 반환한다. 
         * 새로운 Date object의 시간 필드(hr, min, sec, ms)들은 0으로 설정된다. 
         * method는 100이하의 연도로 생성되기 위한 Date 인스턴스들을 허용한다.  
         * "new Date(year, month, date)" 구현은 100 이하의 year (xx)가 제공되는 경우
         * 19xx로 연도를 설정한다. 
         * <p>
         * <em>NOTE:</em>argument의 Validation은 실행되지 않는다. 
         * new Date(year, month[, date]) 생성자에 대해 ECMAScript-262 Date object 명시에 따라서
         * argument의 적합성을 확보하는 것은 caller의 책임이다.
         * </p>
         * @method getDate
         * @static
         * @param {Number} y Year.
         * @param {Number} m 0(Jan)부터 11(Dec)까지의 월 인덱스
         * @param {Number} d (optional) 1부터 31까지의 날짜. 만약 제공되지 않으면 기본적으로 1.
         * @return {Date} 제공된 년월일로 설정된 자바스크립트 date object
         */
        getDate: function(y, m, d) {
            var dt = null;
            if (Rui.isUndefined(d)) {
                d = 1;
            }
            if (y >= 100) {
                dt = new Date(y, m, d);
            } else {
                dt = new Date();
                dt.setFullYear(y);
                dt.setMonth(m);
                dt.setDate(d);
                dt.setHours(0, 0, 0, 0);
            }
            return dt;
        },
        /**
         * @description inx월에 해당되는 마지막 날짜
         * @method getDayInMonth
         * @static
         * @param {int} inx
         * @return {int}
         */
        getDayInMonth: function(inx){
            return Rui.util.LDate.DAYS_IN_MONTH[inx];
        },
        /**
         * 주어진 날짜를 포함하는 달의 첫번째 날짜를 가져온다.
         * @method getFirstDayOfMonth
         * @static
         * @param {Date} date    달의 시작을 계산하는데 사용할 자바스크립트 Date
         * @return {Date}        달의 첫째날을 표시하는 자바스크립트 Date
         */
        getFirstDayOfMonth: function(date) {
            var start = this.getDate(date.getFullYear(), date.getMonth(), 1);
            return start;
        },
        
        /**
         * 주어진 날짜를 포함하는 달의 마지막 날짜를 가져온다.
         * @method getLastDayOfMonth
         * @static
         * @param {Date} date    달의 끝을 계산하는데 사용할 자바스크릅트 Date
         * @return {Date}        달의 마지막날을 표시하는 자바스크립트 Date
         */
        getLastDayOfMonth: function(date) {
            var start = this.getFirstDayOfMonth(date);
            var nextMonth = this.add(start, this.MONTH, 1);
            var end = this.subtract(nextMonth, this.DAY, 1);
            return end;
        },

        /**
         * 주어진 날짜에 대한 주의 첫번째 날짜를 가져 온다.
         * @param getFirstDayOfWeek
         * @static
         * @param {Date} dt 첫번째 날짜가 필요한 주의 date
         * @param {Number} startOfWeek 주의 첫번째 날짜에 대한 인덱스, 0 = Sun, 1 = Mon ... 6 = Sat (기본값은 0)
         * @return {Date} 주의 첫번째 날짜
         */
        getFirstDayOfWeek: function(dt, startOfWeek) {
            startOfWeek = startOfWeek || 0;
            var dayOfWeekIndex = dt.getDay(),
                dayOfWeek = (dayOfWeekIndex - startOfWeek + 7) % 7;
            return this.subtract(dt, this.DAY, dayOfWeek);
        },


        /**
         * 주어진 날짜로부터 시간 필드를 초기화 하고, 효과적으로 시간을 낮 12시로 설정한다.
         * @method clearTime
         * @static
         * @param {Date} date    초기화할 시간 필드에 대한 자바스크립트 Date
         * @return {Date}        모든 시간 필드들이 초기화 된 자바스크립트 Date
         */
        clearTime: function(date) {
            date.setHours(12, 0, 0, 0);
            return date;
        },
        
        /**
         * @description o의 객체가 Date객체인지 여부
         * @method isDate
         * @static
         * @param {Object} o
         * @return {boolean}
         */
        isDate: function(o) {
            return o && (typeof o.getFullYear == 'function');
        },

        /**
         * 주어진 날짜가 달력의 다른 날짜 이전인지 여부에 대하여 결정한다.
         * @method before
         * @static
         * @param {Date} date        비교 argument와 비교할 Date object
         * @param {Date} compareTo   비교시 사용할 Date object
         * @return {boolean} 비교 날짜 이전에 날짜가 있으면 true, 아니면 false
         */
        before: function(date, compareTo) {
            if (date.getTime() < compareTo.getTime())
                return true;
            else
                return false;
        },

        /**
         * 주어진 날짜가 달력의 다른날짜 이후인지 여부에 대하여 결정한다.
         * @method after
         * @static
         * @param {Date} date        비교 argument와 비교할 Date object
         * @param {Date} compareTo   비교시 사용할 Date object
         * @return {boolean} 비교 날짜 이후에 날짜가 있으면 true, 아니면 false
         */
        after: function(date, compareTo) {
            if (date.getTime() > compareTo.getTime())
                return true;
            else
                return false;
        },

        /**
         * 주어진 날짜가 달력의 두 날짜 사이에 있는지 여부에 대하여 결정한다.
         * @method between
         * @static
         * @param {Date} date        체크할 날짜
         * @param {Date} dateBegin   범위의 시작일
         * @param {Date} dateEnd     범위의 종료일
         * @return {boolean} 비교할 날짜가 중간에 있으면 true, 아니면 false
         */
        between: function(date, dateBegin, dateEnd) {
            if (this.after(date, dateBegin) && this.before(date, dateEnd))
                return true;
            else
                return false;
        }

    };
     
     
    /**
     * format 문자열에 기반한 문자열로부터 세부 시간 정보를 parsing 하는 
     * <code>strptime</code>에 대한 부분적인 implementation.
     * <p>
     * This implementation largely takes its cue from the documentation for Python's
     * <code>time</code> module, as documented at
     * http://docs.python.org/lib/module-Dt.html; with the exception of seconds
     * formatting, which is restricted to the range [00,59] rather than [00,61].
     * <p>
     * 지원되는 formatting directive들:
     * <table>
     * <thead>
     *   <tr>
     *     <th>Directive</th>
     *     <th>Meaning</th>
     *   </tr>
     * </thead>
     * <tbody>
     *   <tr>
     *     <td><code>%b</code></td>
     *     <td>Locale의 단축된 월 이름.</td>
     *   </tr>
     *   <tr>
     *     <td><code>%B</code></td>
     *     <td>Locale의 전체 월 이름.</td>
     *   </tr>
     *   <tr>
     *     <td><code>%d</code></td>
     *     <td>[01,31]의 십진수로된 월의 날짜.</td>
     *   </tr>
     *   <tr>
     *     <td><code>%H</code></td>
     *     <td>[00,23]의 십진수로된 시간(24시간제).</td>
     *   </tr>
     *   <tr>
     *     <td><code>%I</code></td>
     *     <td>[00,12]의 십진수로된 시간(12시간제).</td>
     *   </tr>
     *   <tr>
     *     <td><code>%m</code></td>
     *     <td>[01,12]의 십진수로된 월.</td>
     *   </tr>
     *   <tr>
     *     <td><code>%M</code></td>
     *     <td>[00,59]의 십진수로된 분.</td>
     *   </tr>
     *   <tr>
     *     <td><code>%p</code></td>
     *     <td>
     *       Locale의 AM이나 PM 표시(시간을 분류하기 위해 <code>%I</code> directive 가
     *       사용되는 경우에 시간 출력 field에만 영향을 미친다.)
     *     </td>
     *   </tr>
     *   <tr>
     *     <td><code>%S</code></td>
     *     <td>[00,59]의 십진수로된 초.</td>
     *   </tr>
     *   <tr>
     *     <td><code>%y</code></td>
     *     <td>[00,99]의 십진수로된 세기값이 없는 년도.</td>
     *   </tr>
     *   <tr>
     *     <td><code>%Y</code></td>
     *     <td>십진수로된 세기값을 포함한 년도.</td>
     *   </tr>
     *   <tr>
     *     <td><code>%%</code></td>
     *     <td>"<tt>%</tt>" 문자 literal .</td>
     *   </tr>
     * </tbody>
     * </table>
     *
     * @class Parser
     * @private
     * @param {String} format 특정 formatting directive 문자열.
     * @param {Object} locale 해당 parser를 생성하기 위해 사용되는 locale object.
     * @constructor
     */
    Dt.Parser = function(format, locale){
        /**
         * 주어진 original formatting 문자열
         *
         * @type String
         */
        this.format = format;
    
        // Normalise whitespace before further processing
        format = format.split(/(?:\s|%t|%n)+/).join(" ");
        var pattern = [];
        var expected = [];
        var c;
    
        for (var i = 0, l = format.length; i < l; i++){
            c = format.charAt(i);
            if (c == "%"){
                if (i == l - 1){
                    throw new Error("strptime format ends with raw %");
                }
                c = format.charAt(++i);
                var directiveType = typeof Dt.Parser.DIRECTIVE_PATTERNS[c];
                if (directiveType == "undefined"){
                    throw new Error("strptime format contains a bad directive: '%" + c + "'");
                }else if (directiveType == "function"){
                    pattern[pattern.length] = Dt.Parser.DIRECTIVE_PATTERNS[c](locale);
                }else{
                    pattern[pattern.length] = Dt.Parser.DIRECTIVE_PATTERNS[c];
                }
                expected = expected.concat(Dt.Parser.EXPECTED_DATA_TYPES[c]);
            }else{
                pattern[pattern.length] = c;
            }
        }
    
        /**
         * 해당 parser를 생성하기 위해 사용되는 locale object.
         * @private
         * @type Object
         */
        this.locale = locale;
    
        /**
         * 해당 parser가 parsing을 위해 생성한 format을 위해 생성된 정규표헌식.
         * @type RegExp
         */
        this.regexp = new RegExp("^" + pattern.join("") + "$");
    
        /**
         * 순서에 따라 일차하는 자리를 차지할 것으로 예상되는 
         * 해당 paeser의 <code>regexp</code>에 의해 일치될 예상 directives code의 list
         * @type Array
         */
        this.expected = expected;
    };

    /**
     * directive에 해당하는 데이터, 혹은 locale에 의존하는 directive의 경우에나
     * locale을 가지고 정규표현식 패턴 조각을 생성하는 함수를 
     * 캡쳐할 정규표현식 패턴 조각에 directive code들을 맵핑.
     * @private
     * @type Object
     */
    Dt.Parser.DIRECTIVE_PATTERNS = {
        "a": function(l) { return "(" + l.a.join("|") + ")"; },
        // Locale's abbreviated month name
        "b": function(l) { return "(" + l.b.join("|") + ")"; },
        // Locale's full month name
        "B": function(l) { return "(" + l.B.join("|") + ")"; },
        // Locale's equivalent of either AM or PM.
        "p": function(l) { return "(" + l.p.join("|") + ")"; },
    
        "d": "(\\d\\d?)",      // Day of the month as a decimal number [01,31]
        "H": "(\\d\\d?)",      // Hour (24-hour clock) as a decimal number [00,23]
        "I": "(\\d\\d?)",      // Hour (12-hour clock) as a decimal number [01,12]
        "m": "(\\d\\d?)",      // Month as a decimal number [01,12]
        "M": "(\\d\\d?)",      // Minute as a decimal number [00,59]
        "S": "(\\d\\d?)",      // Second as a decimal number [00,59]
        "y": "(\\d\\d?)",      // Year without century as a decimal number [00,99]
        "Y": "(\\d\\d\\d\\d)", // Year with century as a decimal number
        "%": "%"               // A literal "%" character
    };

    /**
     * 각 directive에 대해 예상되는 캡쳐된 directive code들을 directive code들에 맵핑.
     * - 여러 데이터 항목들을 포함할 수 있는 어떤 directive들로 지정한 목록.
     * @private
     * @type Object
     */
    Dt.Parser.EXPECTED_DATA_TYPES = {
        "b": ["b"],
        "B": ["B"],
        "d": ["d"],
        "H": ["H"],
        "I": ["I"],
        "m": ["m"],
        "M": ["M"],
        "p": ["p"],
        "S": ["S"],
        "y": ["y"],
        "Y": ["Y"],
        "%": []
    };

    Dt.Parser.prototype = {
        /*
         * Attempts to extract date and time details from the given input.
         * <p>
         * Time fields in this method's result are as follows:
         * <table>
         * <thead>
         *   <tr>
         *     <th>Index</th>
         *     <th>Represents</th>
         *     <th>Values</th>
         *   </tr>
         * </thead>
         * <tbody>
         *   <tr>
         *     <td><code>0</code></td>
         *     <td>Year</td>
         *     <td>(for example, 1993)</td>
         *   </tr>
         *   <tr>
         *     <td><code>1</code></td>
         *     <td>Month</td>
         *     <td>range [1,12]</td>
         *   </tr>
         *   <tr>
         *     <td><code>2</code></td>
         *     <td>Day</td>
         *     <td>range [1,31]</td>
         *   </tr>
         *   <tr>
         *     <td><code>3</code></td>
         *     <td>Hour</td>
         *     <td>range [0,23]</td>
         *   </tr>
         *   <tr>
         *     <td><code>4</code></td>
         *     <td>Minute</td>
         *     <td>range [0,59]</td>
         *   </tr>
         *   <tr>
         *     <td><code>5</code></td>
         *     <td>Second</td>
         *     <td>range [0,59]</td>
         *   </tr>
         *   <tr>
         *     <td><code>6</code></td>
         *     <td>Day of week (not implemented - always <code>0</code>)</td>
         *     <td>range [0,6], Monday is 0</td>
         *   </tr>
         *   <tr>
         *     <td><code>7</code></td>
         *     <td>Day of year (not implemented - always <code>1</code>)</td>
         *     <td>range [1,366]</td>
         *   </tr>
         *   <tr>
         *     <td><code>8</code></td>
         *     <td>Daylight savings flag (not implemented - always <code>-1</code>)</td>
         *     <td>0, 1 or -1</td>
         *   </tr>
         * </tbody>
         * </table>
         *
         * @param {String} input the time string to be parsed.
         *
         * @return a list of 9 integers, each corresponding to a time field.
         * @type Array
         */
        parse: function(input){
            var matches = this.regexp.exec(input);
            if (matches === null){
                return false;
                //throw new Error("Time data did not match format: data=" + input +
                //                ", format=" + this.format);
            }
    
            // Collect matches in an object under properties corresponding to their
            // data types.
            var data = {};
            for (var i = 1, l = matches.length; i < l; i++){
                data[this.expected[i -1]] = matches[i];
            }
    
            // Default values for when more accurate values cannot be inferred
            var time = [1900, 1, 1, 0, 0, 0, 0, 1, -1];
    
            // Extract year
            if (typeof data["Y"] != "undefined"){
                var year = parseInt(data["Y"], 10);            
                if (year < 1900)
                {
                    //throw new Error("Year is out of range: " + year);
                    return false;
                }
                time[0] = year;
            }else if (typeof data["y"] != "undefined"){
                var year = parseInt(data["y"], 10);
                if (year < 68)
                {
                    year = 2000 + year;
                }
                else if (year < 100)
                {
                    year = 1900 + year;
                }
                time[0] = year;
            }
    
            // Extract month
            if (typeof data["m"] != "undefined"){
                var month = parseInt(data["m"], 10);
                if (month < 1 || month > 12)
                {
                    //throw new Error("Month is out of range: " + month);
                    return false;
                }
                time[1] = month;
            }else if (typeof data["B"] != "undefined"){
                time[1] = this._indexOf(data["B"], this.locale.B) + 1;
            }else if (typeof data["b"] != "undefined"){
                time[1] = this._indexOf(data["b"], this.locale.b) + 1;
            }
    
            // Extract day of month
            if (typeof data["d"] != "undefined"){
                var day = parseInt(data["d"], 10);
                if (day < 1 || day > 31){
                    //throw new Error("Day is out of range: " + day);
                    return false;
                }
                time[2] = day;
            }
    
            // Extract hour
            if (typeof data["H"] != "undefined"){
                var hour = parseInt(data["H"], 10);
                if (hour > 23){
                    //throw new Error("Hour is out of range: " + hour);
                    return false;
                }
                time[3] = hour;
            }else if (typeof data["I"] != "undefined"){
                var hour = parseInt(data["I"], 10);
                if (hour < 1 || hour > 12){
                    //throw new Error("Hour is out of range: " + hour);
                    return false;
                }
    
                // If we don't get any more information, we'll assume this time is
                // a.m. - 12 a.m. is midnight.
                if (hour == 12){
                    hour = 0;
                }
    
                time[3] = hour;
    
                if (typeof data["p"] != "undefined"){
                    if (data["p"] == this.locale.p[1]){
                        // We've already handled the midnight special case, so it's
                        // safe to bump the time by 12 hours without further checks.
                        time[3] = time[3] + 12;
                    }
                }
            }
    
            // Extract minute
            if (typeof data["M"] != "undefined"){
                var minute = parseInt(data["M"], 10);
                if (minute > 59){
                    //throw new Error("Minute is out of range: " + minute);
                    return false;
                }
                time[4] = minute;
            }
    
            // Extract seconds
            if (typeof data["S"] != "undefined"){
                var second = parseInt(data["S"], 10);
                if (second > 59){
                    //throw new Error("Second is out of range: " + second);
                    return false;
                }
                time[5] = second;
            }
    
            // Validate day of month
            var day = time[2], month = time[1], year = time[0];
            if (((month == 4 || month == 6 || month == 9 || month == 11) && day > 30)
                || (month == 2 && day > ((year % 4 == 0 && year % 100 != 0 || year % 400 == 0) ? 29 : 28))) {
                //throw new Error("Day " + day + " is out of range for month " + month);
                return false;
            }
            return new Date(time[0],time[1]-1,time[2],time[3],time[4],time[5]);
        },
    
        _indexOf: function(item, list){
            for (var i = 0, l = list.length; i < l; i++){
                if (item === list[i]){
                    return i;
                }
            }
            return -1;
        }
    };

    /**
     * @description 지정한 format의 문자열을 date로 변환
     * @method parse
     * @private
     * @param {String} sDate
     * @param {Object} config
     * @return {Date}
     */
    Dt.parse = function(sDate, config) {
        sDate = Rui.util.LString.trim(sDate);
        config = config || {};
        var format = config.format;
        if(!format){
            //입력용의 길이를 검사해서 입력날짜 길이와 같이면 해당 것으로 변환 
            var tempDate = Dt.format(new Date(),{locale:config.locale,format:"%q"});
            if(sDate.length == tempDate.length)
                format = "%Y%m%d";
            else        
                format = '%Y%m%d%H%M%S';
        }
        var locale = config.locale;
        return new Dt.Parser(Dt.getFormat(format,locale), Dt.getLocale(locale)).parse(sDate);
    };

    /* //strftime, strptime 구현시 아래와 같이 하면 된다. 
    Dt.strptime = function(sDate, format, locale)
    {
        return new Dt.Parser(format, Dt.getLocale(locale)).parse(sDate);
    };
    Dt.strftime = function(date, format, locale){
        return Dt.format(date,{format:format,locale:locale});
    };
    */

    Rui.namespace('Rui.util');
    Rui.util.LDate = Dt;
    Rui.util.LDate.DAYS_IN_MONTH = [31,28,31,30,31,30,31,31,30,31,30,31];
})();
/**
 * The static Function class provides helper functions to deal with data of type Function.
 * statice 함수 클래스는 함수 타입의 데이터를 처리하는데 도움을 주는 함수들을 제공한다. 
 * @namespace Rui.util
 * @requires Rui
 * @class LFunction
 * @static
 */
Rui.util.LFunction = {
    /**
     * @description Function의 Delegate를 생성한다.
     * @method createDelegate
     * @static
     * @param {Function} fn function 객체
     * @param {Object} obj 수행할 오브젝트
     * @param {Object} args 파라미터
     * @param {boolean} appendArgs 추가 파라미터를 붙일지 여부
     * @return {Function} Function 객체 
     */
    createDelegate: function(fn, obj, args, appendArgs) {
        var method = fn;
        return function() {
            var callargs = args || arguments;
            if (appendArgs) {
                callargs = Array.prototype.concat.apply(arguments, args);
            }
            return method.apply(obj || window, callargs);
        };
    },
    /**
     * @description  Delegate를 생성하여 수행하는데 millis초값 만큼 시간이 지난후에 fn을 수행한다.
     * @method defer
     * @static
     * @param {Function} fn function 객체
     * @param {int} millis 몇초후에 수행할지 값 (천분의 1초)
     * @param {Object} obj 수행할 오브젝트
     * @param {Object} args 파라미터
     * @param {boolean} appendArgs 추가 파라미터를 붙일지 여부
     * @return {Function} Function 객체 
     */
    defer: function(fn, millis, obj, args, appendArgs){
        fn = Rui.util.LFunction.createDelegate(fn, obj, args, appendArgs);
        if(millis > 0)
            return setTimeout(fn, millis);
        fn();
        return 0;
    },
    /**
     * @description  fcn을 수행하여 결과에 따라 fn을 대신 수행하는 Interceptor 메소드
     * @method createInterceptor
     * @static
     * @param {Function} fn function 객체
     * @param {Function} fcn fn 의 해당되는 기능을 수할하지 여부를 판단하는 Function
     * @param {Object} scope 수행할 오브젝트
     * @return {Function} Function 객체 
     */
    createInterceptor: function(fn, fcn, scope){
        var method = fn;
        return !Rui.isFunction(fcn) ? this : function() {
            var me = this,
                args = arguments;
            fcn.target = me;
            fcn.method = method;
            return (fcn.apply(scope || me || window, args) !== false) ?
                method.apply(me || window, args) :
                null;
        };
    }
};
/**
 * Json 문자열을 파싱하는 method를 제공하고 Json 문자열로 object들을 변환한다. 
 * @class LJson
 * @static
 * @namespace Rui.util
 */
Rui.util.LJson = (function(){
    
    var useHasOwn = !!{}.hasOwnProperty;
    var lPad = Rui.util.LString.lPad;

    var m = {
        "\b": '\\b',
        "\t": '\\t',
        "\n": '\\n',
        "\f": '\\f',
        "\r": '\\r',
        '"': '\\"',
        "\\": '\\\\'
    };

    var encodeString = function(s){
        if (/["\\\x00-\x1f]/.test(s)) {
            return '"' + s.replace(/([\x00-\x1f\\"])/g, function(a, b) {
                var c = m[b];
                if(c){
                    return c;
                }
                c = b.charCodeAt();
                return "\\u00" + Math.floor(c / 16).toString(16) + (c % 16).toString(16);
            }) + '"';
        }
        return '"' + s + '"';
    };

    var encodeArray = function(o){
        var a = ["["], b, i, l = o.length, v;
        for (i = 0; i < l; i += 1) {
            v = o[i];
            switch (typeof v) {
                case "undefined":
                case "function":
                case "unknown":
                    break;
                default:
                    if (b) {
                        a.push(',');
                    }
                    a.push(v === null ? "null" : Rui.util.LJson.encode(v));
                    b = true;
            }
        }
        a.push("]");
        return a.join("");
    };

    // Return the public API
    return {
        /**
         * object, array 그외 다른 값을 인코딩한다.
         * @method encodeDate
         * @static
         * @param {Mixed} o 인코딩할 변수
         * @return {String} The Json string
         */
        encodeDate: function(o){
            return '"' + o.getFullYear() + "-" +
                lPad(o.getMonth() + 1, '0') + "-" +
                lPad(o.getDate(), '0') + "T" +
                lPad(o.getHours(), '0') + ":" +
                lPad(o.getMinutes(), '0') + ":" +
                lPad(o.getSeconds(), '0') + '"';
        },

        /**
         * object, array 그외 다른 값을 인코딩한다.
         * @method encode
         * @static
         * @param {Mixed} o 인코딩할 변수
         * @return {String} The Json string
         */
        encode: function(o){
            if(typeof o == "undefined" || o === null){
                return "null";
            }else if(Rui.isArray(o)){
                return encodeArray(o);
            }else if(Rui.util.LDate.isDate(o)){
                return Rui.util.LJson.encodeDate(o);
            }else if(typeof o == "string"){
                return encodeString(o);
            }else if(typeof o == "number"){
                return isFinite(o) ? String(o) : "null";
            }else if(typeof o == "boolean"){
                return String(o);
            }else {
                var a = ["{"], b, i, v;
                for (i in o) {
                    if(!useHasOwn || o.hasOwnProperty(i)) {
                        v = o[i];
                        switch (typeof v) {
                        case "undefined":
                        case "function":
                        case "unknown":
                            break;
                        default:
                            if(b){
                                a.push(',');
                            }
                            a.push(this.encode(i), ":",
                                    v === null ? "null" : this.encode(v));
                            b = true;
                        }
                    }
                }
                a.push("}");
                return a.join("");
            }
        },

        /**
         * object에 Json 문자열을 디코딩한다. Json이 유효하지 않을 경우
         * safe 옵션이 설정되어 있지 않다면 이 함수는 SyntaxError를 발생시킨다.
         * @method decode
         * @static
         * @param {String} json The Json string
         * @param {boolean} safe (optional) true로 설정하고 Json이 잘못된 경우 null이 반환된다.
         * @return {Object} 결과 object
         */
        decode: function(data, safe){
            var fn = function(){
                return window.JSON && window.JSON.parse ? window.JSON.parse( data ) : (new Function("return " + data))();
            };
            if(safe){
                try{
                    return fn();
                }catch(e){
                    return null;
                }
            }else{
                return fn();
            }
        },

        /**
         * Json을 XPath형식으로 정보를 얻어오는 메소드
         * <pre>
         * alert(config.get("$.core.defaultLocale"));
         * </pre>
         * @method jsonPath
         * @static
         * @param {Object} obj Json Object
         * @param {Object} expr Date의 문자열 serialization
         * @param {Object} arg 규칙
         * @return {Object}
         */
        jsonPath: function(obj, expr, arg){
            var resultType = Rui.util.LJson.P.getResultType(arg);
            Rui.util.LJson.P.init(resultType);
            var $ = obj;
            if (expr && obj && (resultType == "VALUE" || resultType == "PATH")) {
                Rui.util.LJson.P.trace(Rui.util.LJson.P.normalize(expr).replace(/^\$;/, ""), obj, "$");
                return Rui.util.LJson.P.result.length ? Rui.util.LJson.P.result : false;
            }
        }
    };
})();

var LJson = Rui.util.LJson;

    LJson.P = {
        result: null,
        resultType: null,
        init: function(resultType) {
            this.result = [];
            this.resultType = resultType;
        },
        getResultType: function(arg) {
            return arg && arg.resultType || "VALUE";
        },
        normalize: function(expr){
            var subx = [];
            return expr.replace(/[\['](\??\(.*?\))[\]']/g, function($0, $1){
                return "[#" + (subx.push($1) - 1) + "]";
            }).replace(/'?\.'?|\['?/g, ";").replace(/;;;|;;/g, ";..;").replace(/;$|'?\]|'$/g, "").replace(/#([0-9]+)/g, function($0, $1){
                return subx[$1];
            });
        },
        asPath: function(path){
            var x = path.split(";"), p = "$";
            for (var i = 1, n = x.length; i < n; i++) 
                p += /^[0-9*]+$/.test(x[i]) ? ("[" + x[i] + "]") : ("['" + x[i] + "']");
            return p;
        },
        store: function(p, v){
            if (p)
                LJson.P.result[LJson.P.result.length] = LJson.P.resultType == "PATH" ? LJson.P.asPath(p) : v;
            return !!p;
        },
        trace: function(expr, val, path){
            if (expr) {
                var x = expr.split(";"), loc = x.shift();
                x = x.join(";");
                if (val && val.hasOwnProperty(loc)) 
                    LJson.P.trace(x, val[loc], path + ";" + loc);
                else 
                    if (loc === "*") 
                        LJson.P.walk(loc, x, val, path, function(m, l, x, v, p){
                            LJson.P.trace(m + ";" + x, v, p);
                        });
                    else 
                        if (loc === "..") {
                            LJson.P.trace(x, val, path);
                            LJson.P.walk(loc, x, val, path, function(m, l, x, v, p){
                                typeof v[m] === "object" && LJson.P.trace("..;" + x, v[m], p + ";" + m);
                            });
                        }
                        else 
                            if (/,/.test(loc)) { // [name1,name2,...]
                                for (var s = loc.split(/'?,'?/), i = 0, n = s.length; i < n; i++) 
                                    LJson.P.trace(s[i] + ";" + x, val, path);
                            }
                            else 
                                if (/^\(.*?\)$/.test(loc)) // [(expr)]
                                    LJson.P.trace(LJson.P.eval(loc, val, path.substr(path.lastIndexOf(";") + 1)) + ";" + x, val, path);
                                else 
                                    if (/^\?\(.*?\)$/.test(loc)) // [?(expr)]
                                        LJson.P.walk(loc, x, val, path, function(m, l, x, v, p){
                                            if (LJson.P.eval(l.replace(/^\?\((.*?)\)$/, "$1"), v[m], m)) 
                                                LJson.P.trace(m + ";" + x, v, p);
                                        });
                                    else 
                                        if (/^(-?[0-9]*):(-?[0-9]*):?([0-9]*)$/.test(loc)) // [start:end:step]  phyton slice syntax
                                            LJson.P.slice(loc, x, val, path);
            }
            else 
                LJson.P.store(path, val);
        },
        walk: function(loc, expr, val, path, f){
            if (val instanceof Array) {
                for (var i = 0, n = val.length; i < n; i++) 
                    if (i in val) 
                        f(i, loc, expr, val, path);
            }
            else 
                if (typeof val === "object") {
                    for (var m in val) 
                        if (val.hasOwnProperty(m)) 
                            f(m, loc, expr, val, path);
                }
        },
        slice: function(loc, expr, val, path){
            if (val instanceof Array) {
                var len = val.length, start = 0, end = len, step = 1;
                loc.replace(/^(-?[0-9]*):(-?[0-9]*):?(-?[0-9]*)$/g, function($0, $1, $2, $3){
                    start = parseInt($1 || start);
                    end = parseInt($2 || end);
                    step = parseInt($3 || step);
                });
                start = (start < 0) ? Math.max(0, start + len) : Math.min(len, start);
                end = (end < 0) ? Math.max(0, end + len) : Math.min(len, end);
                for (var i = start; i < end; i += step) 
                    LJson.P.trace(i + ";" + expr, val, path);
            }
        },
        eval: function(x, _v, _vname){
            try {
                return $ && _v && eval(x.replace(/@/g, "_v"));
            } 
            catch (e) {
                throw new SyntaxError("jsonPath: " + e.message + ": " + x.replace(/@/g, "_v").replace(/\^/g, "_a"));
            }
        }
    };

/**
 * dom 모듈은 dom element들을 조작하기 위해 도움이 되는 method들을 제공한다.
 * @module util
 * @title LDom Utility
 * @namespace Rui.util
 * @requires Rui
 */
(function() {
    var Y = Rui.util,     // internal shorthand
        getStyle,           // for load time browser branching
        setStyle,           // ditto
        propertyCache = {}, // for faster hyphen converts
        reClassNameCache = {},          // cache regexes for className
        document = window.document;     // cache for faster lookups

    Rui.env._id_counter = Rui.env._id_counter || 0;     // for use with generateId (global to save state if Dom is overwritten)

    // brower detection
    var isIE678 = Rui.browser.msie678;

    // regex cache
    var patterns = {
        HYPHEN: /(-[a-z])/i, // to normalize get/setStyle
        ROOT_TAG: /^body|html$/i, // body for quirks mode, html for standards,
        OP_SCROLL:/^(?:inline|table-row)$/i
    };

    var testElement = function(node, method) {
        return node && node.nodeType == 1 && ( !method || method(node) );
    };

    var toCamel = function(property) {
        if ( !patterns.HYPHEN.test(property) ) {
            return property; // no hyphens
        }
        
        if (propertyCache[property]) { // already converted
            return propertyCache[property];
        }

        var converted = property;
 
        while ( patterns.HYPHEN.exec(converted) ) {
            converted = converted.replace(RegExp.$1,
                    RegExp.$1.substr(1).toUpperCase());
        }
        
        propertyCache[property] = converted;
        return converted;
        //return property.replace(/-([a-z])/gi, function(m0, m1) {return m1.toUpperCase()}) // cant use function as 2nd arg yet due to safari bug
    };

    var getClassRegEx = function(className) {
        var re = reClassNameCache[className];
        if (!re) {
            re = new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)');
            reClassNameCache[className] = re;
        }
        return re;
    };

    // branching at load instead of runtime
    if (document.defaultView && document.defaultView.getComputedStyle && !isIE678) { // W3C DOM method
        getStyle = function(el, property) {
            var value = null;
            
            if (property == 'float') { // fix reserved word
                property = 'cssFloat';
            }

            var computed = el.ownerDocument.defaultView.getComputedStyle(el, '');
            if (computed) { // test computed before touching for safari
                value = computed[toCamel(property)];
            }
            
            return el.style[property] || value;
        };
    } else if (document.documentElement.currentStyle && isIE678) { // IE method
        getStyle = function(el, property) {                         
            switch( toCamel(property) ) {
                case 'opacity':// IE opacity uses filter
                    var val = 100;
                    try { // will error if no DXImageTransform
                        val = el.filters['DXImageTransform.Microsoft.Alpha'].opacity;

                    } catch(e) {
                        try { // make sure its in the document
                            val = el.filters('alpha').opacity;
                        } catch(e) {
                        }
                    }
                    return val / 100;
                case 'float': // fix reserved word
                    property = 'styleFloat'; // fall through
                default: 
                    // test currentStyle before touching
                    var value = el.currentStyle ? el.currentStyle[property] : null;
                    return ( el.style[property] || value );
            }
        };
    } else { // default to inline only
        getStyle = function(el, property) { return el.style[property]; };
    }

    if (isIE678) {
        setStyle = function(el, property, val) {
            switch (property) {
                case 'opacity':
                    if ( Rui.isString(el.style.filter) ) { // in case not appended
                        el.style.filter = 'alpha(opacity=' + val * 100 + ')';
                        
                        if (!el.currentStyle || !el.currentStyle.hasLayout) {
                            el.style.zoom = 1; // when no layout or cant tell
                        }
                    }
                    break;
                case 'float':
                    property = 'styleFloat';
                case 'cursor':
                    val = val == 'col-resize' ? (Rui.browser.webkit ? 'e-resize' : 'col-resize') : val;
                default:
                el.style[property] = val;
            }
        };
    } else {
        setStyle = function(el, property, val) {
            if (property == 'float') {
                property = 'cssFloat';
            }
            el.style[property] = val;
        };
    }
    
    /**
     * DOM element들을 위해 도움을 주는 method들을 제공한다.
     * @namespace Rui.util
     * @class LDom
     * @static
     * @sample default
     */
    Rui.util.LDom = {
            
        /**
         * ID를 반환하고, 만약 제공된 경우 'el' element로 적용된다. 
         * @static
         * @method generateId  
         * @param {String | HTMLElement | Array} el (optional) ID를 추가할 optional element의 array
         *                                       (하나라도 이미 존재한다면, ID는 추가되지 않는다.)
         * @param {String} prefix (optional) 사용할 optional perfix(기본은 'L-gen')
         * @return {String | Array} 생성된 ID나, 생성된 ID들의 array
         *                          (아니면, element에 이미 존재할 경우 original ID)
         */
        generateId: function(el, prefix) {
            prefix = prefix || 'L-gen';

            var f = function(el) {
                if (el && el.id && !(Rui.useFixedId())) { // do not override existing ID 
                    return el.id;
                } 

                //var id = prefix + Rui.env._id_counter++;
                var id = (prefix.indexOf('L-gen') != -1) ? prefix + Rui.env._id_counter++ : prefix;

                if (el) {
                    el.id = id;
                }
                
                return id;
            };

            // batch fails when no element, so just generate and return single ID
            return Y.LDom.batch(el, f, Y.LDom, true) || f.apply(Y.LDom, arguments);
        },
        
        /**
         * HTMLElement refrence를 반환한다.
         * @static
         * @method get
         * @param {String | HTMLElement |Array} el DOM reference, 실제 DOM reference,
         *                                         혹은 ID들이나 HTMLElement들의 Array를 가져오기 위한
         *                                         ID 로서 사용하기 위한 문자열 Accepts 
         * @return {HTMLElement | Array} HTML element나 HTMLElement들의 array에 대한 DOM reference
         */
        get: function(el) {
            if (el) {
                // GridView가 ScrollingGridView 일경우 el이 slider이면 nodeType 에러가 발생함. 원인 확인 필요 
                if (el.nodeType || el.item) { // Node, or NodeList
                    return el;
                }

                if (typeof el === 'string') { // id
                    return document.getElementById(el);
                }
                
                if ('length' in el) { // array-like 
                    var c = [];
                    for (var i = 0, len = el.length; i < len; ++i) {
                        c[c.length] = Y.LDom.get(el[i]);
                    }
                    
                    return c;
                }

                return el; // some other object, just pass it back
            }

            return null;
        },

        /**
         * currentStyle과 ComputedStyle의 일반화(Normalize).
         * @static
         * @method getStyle
         * @sample default
         * @param {String | HTMLElement |Array} el ID로서 사용할 실제 DOM reference, 혹은 ID들이나
         *                                         HTMLElement들의 Array의 문자열 Accepts 
         * @param {String} property 값이 반환될 style property.
         * @return {String | Array} element를 위한 style property의 현재값.
         */
        getStyle: function(el, property) {
            property = toCamel(property);
            
            var f = function(element) {
                return getStyle(element, property);
            };
            
            return Y.LDom.batch(el, f, Y.LDom, true);
        },

        /**
         * Wrapper for setting style properties of HTMLElements.
         * 최신 브라우저을 통해 'opacity'를 일반화(Normalize).
         * @static
         * @method setStyle
         * @sample default
         * @param {String | HTMLElement |Array} el ID로서 사용할 실제 DOM reference, 혹은 ID들이나
         *                                         HTMLElement들의 Array의 문자열 Accepts 
         * @param {String} property 설정될 style property.
         * @param {String} val 주어진 property에 적용될 값.
         * @return {void}
         */
        setStyle: function(el, property, val) {
        	if(val < 0) debugger;
            property = toCamel(property);

            var f = function(element) {
                setStyle(element, property, val);
            };
            try {
                Y.LDom.batch(el, f, Y.LDom, true);
            } catch(e) {
            	Rui.log('setStyle error => id: ' + el.id + ', ' + property + ': ' + val, 'ERROR');
            	throw e;
            }
        },
            
        /**
         * element에 style specification을 적용한다.
         * @method applyStyles
         * @param {String/HTMLElement} el style이 적용될 element
         * @param {String/Object/Function} styles 스타일 지정 문자열, 예: 'width:100px', 
         *                                        form의 {width:'100px'} object,
         *                                        specification을 반환하는 함수
         * @return {void}  
         */
        applyStyles: function(el, styles){
            if(styles){
                el = Rui.get(el);
               if(typeof styles == 'string'){
                   var re = /\s?([a-z\-]*)\:\s?([^;]*);?/gi;
                   var matches;
                   while ((matches = re.exec(styles)) != null){
                       el.setStyle(matches[1], matches[2]);
                   }
               }else if (typeof styles == 'object'){
                   for (var style in styles){
                      el.setStyle(style, styles[style]);
                   }
               }else if (typeof styles == 'function'){
                    Rui.util.LDom.applyStyles(el, styles.call());
               }
            }
        },

        /**
         * HTMLElement가 주어진 class 이름을 가졌는지에 대한 여부. 
         * @static 
         * @method hasClass
         * @sample default
         * @param {String | HTMLElement | Array} el test할 element나 collection
         * @param {String} className 검색할 class 이름
         * @return {Boolean | Array} boolean값이나 boolean값의 array
         */
        hasClass: function(el, className) {
            var re = getClassRegEx(className);

            var f = function(el) {
                return re.test(el.className);
            };

            return Y.LDom.batch(el, f, Y.LDom, true);
        },

        /**
         * 주어진 element나 element들의 collection에 class 이름을 추가한다.
         * @static 
         * @method addClass
         * @sample default
         * @param {String | HTMLElement | Array} el class를 추가할 element나 collection
         * @param {String} className class attribute에 추가할 class 이름
         * @return {Boolean | Array} pass/fail의 boolean 값이나 boolean값의 array
         */
        addClass: function(el, className) {
            var f = function(el) {
                if (this.hasClass(el, className)) {
                    return false; // already present
                }
                el.className = Rui.trim([el.className, className].join(' '));
                return true;
            };
            
            return Y.LDom.batch(el, f, Y.LDom, true);
        },

        /**
         * Removes a class name from a given element or collection of elements.
         * 주어진 element나 element들의 collection으로부터 class 이름을 삭제한다.
         * @static 
         * @method removeClass
         * @sample default
         * @param {String | HTMLElement | Array} el class를 삭제할 element나 collection
         * @param {String} className class attribute에 삭제할 class 이름
         * @return {Boolean | Array} pass/fail의 boolean 값이나 boolean값의 array
         */
        removeClass: function(el, className) {
            var ret = [];
            var cnList = Rui.isArray(className) ? className : [className];
            Rui.util.LArray.each(cnList, function(cn) {
                var re = getClassRegEx(cn);
                
                var f = function(el) {
                    var ret = false,
                        current = el.className;

                    if (cn && current && this.hasClass(el, cn)) {
                        
                        el.className = current.replace(re, ' ');
                        if ( this.hasClass(el, cn) ) { // in case of multiple adjacent
                            this.removeClass(el, cn);
                        }

                        el.className = Rui.trim(el.className); // remove any trailing spaces
                        if (el.className === '') { // remove class attribute if empty
                            var attr = (el.hasAttribute) ? 'class' : 'className';
                            el.removeAttribute(attr);
                        }
                        ret = true;
                    }
                    return ret;
                };

                ret.push(Y.LDom.batch(el, f, Y.LDom, true));
            }, this);
            return ret.length == 1 ? ret[0]: ret;
        },

        /**
         * 주어진 element나 element의 collection에 대해 다른 클래스로 클래스를 교체한다.
         * 기존 클래스 이름이 존재하지 않는 경우 새로운 클래스 이름이 간단하게 추가된다.
         * @method replaceClass  
         * @static 
         * @param {String | HTMLElement | Array} el 클래스로부터 제거할 element나 collection
         * @param {String} oldClassName 교체될 클래스 이름
         * @param {String} newClassName 예전 클래스 이름을 교체할 클래스 이름
         * @return {Boolean | Array} 성공/실패 boolean이나 boolean값들의 array
         */
        replaceClass: function(el, oldClassName, newClassName) {
            if (!newClassName || oldClassName === newClassName) { // avoid infinite loop
                return false;
            }
            
            var re = getClassRegEx(oldClassName);

            var f = function(el) {
            
                if ( !this.hasClass(el, oldClassName) ) {
                    this.addClass(el, newClassName); // just add it if nothing to replace
                    return true; // NOTE: return
                }
            
                el.className = el.className.replace(re, ' ' + newClassName + ' ');

                if ( this.hasClass(el, oldClassName) ) { // in case of multiple adjacent
                    this.removeClass(el, oldClassName);
                }

                el.className = Rui.trim(el.className); // remove any trailing spaces
                return true;
            };
            
            return Y.LDom.batch(el, f, Y.LDom, true);
        },

        /**
         * 주어진 class의 HTMLElement들의 array를 반환한다.
         * 최적화된 성능을 위해서 가능한한 태그 및 또는 root node를 포함한다.
         * Note: 이 callback(node들의 추가/삭제 등)에서의 collection 변경 같은,
         * live collecttion에 반하는 운영 method는 부작용을 갖는다. 
         * native 'getElementsByTagName' method와 마찬가지로,  
         * 대신 node array 반환을 반복해야 한다.
         * @static 
         * @method getElementsByClassName
         * @param {String} className 일치하는 class 이름
         * @param {String} tag (optional) collect될 element들의 태그 이름
         * @param {String | HTMLElement} root (optional) 시작지점으로 사용할 HTMLElement나 ID 
         * @param {Function} apply (optional) 발견했을때 각 element에 적용할 함수 
         * @return {Array} 주어진 class이름을 가진 element들의 array
         */
        getElementsByClassName: function(className, tag, root, apply) {
            className = Rui.trim(className);
            tag = tag || '*';
            root = (root) ? Y.LDom.get(root) : null || document; 
            if (!root) {
                return [];
            }

            var nodes = [],
                elements = root.getElementsByTagName(tag),
                re = getClassRegEx(className);

            for (var i = 0, len = elements.length; i < len; ++i) {
                if ( re.test(elements[i].className) ) {
                    nodes[nodes.length] = elements[i];
                    if (apply) {
                        apply.call(elements[i], elements[i]);
                    }
                }
            }

            return nodes;
        },
        
        /**
         * 제공된 boolean method에 의해 적용된 테스트로 전달되는 HTMLElement의 array를 반환한다.
         * 최적화된 성능을 위해 가능한 경우, tag나 root 노드를 포함한다.
         * 주의: 이 method는 live collection에 반하여 작동하며
         * callback(노드의 삭제/추가 등)에서의 collection 수정은 역효과가 생길 것이다.
         * 대신 native 'getElementsByTagName' method와 마찬가지로 반환된 노드 array를 반복해야 한다.
         * @static 
         * @method getElementsBy
         * @param {Function} method element의 argument로서만 element를 받는 element들을 테스트 하기 위한 boolean method.
         * @param {String} tag (optional) collect 될 element들의 tag 이름
         * @param {String | HTMLElement} root (optional) 시작지점으로서 사용할 HTMLElement나 ID 
         * @param {Function} apply (optional) 검색되었을때 각 element에 적용할 함수 
         * @return {Array} HTMLElement의 array
         */
        getElementsBy: function(method, tag, root, apply) {
            tag = tag || '*';
            root = (root) ? Y.LDom.get(root) : null || document; 

            if (!root) {
                return [];
            }

            var nodes = [],
                elements = root.getElementsByTagName(tag);
            
            for (var i = 0, len = elements.length; i < len; ++i) {
                if ( method(elements[i]) ) {
                    nodes[nodes.length] = elements[i];
                    if (apply) {
                        apply(elements[i]);
                    }
                }
            }
            return nodes;
        },
        
        /**
         * 제공된 boolean method에 의해 적용된 테스트로 전달되는 가장 가까운 ancestor를 반환한다.
         * 성능상의 이유로, ID들은 허용되지 않으며 argument의 validation은 생략한다.
         * @static 
         * @method getAncestorBy
         * @param {HTMLElement} node 시작지점으로서 사용할 HTMLElement 
         * @param {Function} method element의 argument로서만 element를 받는 element들을 테스트 하기 위한 boolean method.
         * @return {Object} HTMLElement나 만약 찾지 못하는 경우 null
         */
        getAncestorBy: function(node, method) {
            while ( (node = node.parentNode) ) { // NOTE: assignment
                if ( testElement(node, method) ) {
                    return node;
                }
            } 
        
            return null;
        },
         
        /**
         * 주어진 클래스 이름을 가진 가장 가까운 ancestor를 반환한다.
         * @static 
         * @method getAncestorByClassName
         * @param {String | HTMLElement} node HTMLElement나 시작지점으로서 사용할 ID 
         * @param {String} className 클래스 이름
         * @return {Object} HTMLElement
         */
        getAncestorByClassName: function(node, className) {
            node = Y.LDom.get(node);
            if (!node) {
                return null;
            }
            var method = function(el) { return Y.LDom.hasClass(el, className); };
            return Y.LDom.getAncestorBy(node, method);
        },

        /**
         * 주어진 tag 이름을 가진 가까운 ancestor를 반환한다.
         * @static 
         * @method getAncestorByTagName
         * @param {String | HTMLElement} node HTMLElement나 시작지점으로서 사용할 ID 
         * @param {String} tag 이름
         * @return {Object} HTMLElement
         */
        getAncestorByTagName: function(node, tagName) {
            node = Y.LDom.get(node);
            if (!node) {
                return null;
            }
            var method = function(el) {
                return el.tagName && el.tagName.toUpperCase() == tagName.toUpperCase();
            };
            return Y.LDom.getAncestorBy(node, method);
        },

        /**
         * HTMLElement가 DOM 계층구조에서 다른 HTML element의 ancestor 인지에 대한 여부
         * @static 
         * @method isAncestor
         * @param {String | HTMLElement} haystack 가능한 ancestor
         * @param {String | HTMLElement} needle 가능한 descendent
         * @return {boolean} haystack이 needle의 ancestor인지에 대한 여부
         */
        isAncestor: function(haystack, needle) {
            haystack = Y.LDom.get(haystack);
            needle = Y.LDom.get(needle);
            
            var ret = false;

            if ( (haystack && needle) && (haystack.nodeType && needle.nodeType) ) {
                if (haystack.contains && haystack !== needle) { // contains returns true when equal
                    ret = haystack.contains(needle);
                }
                else if (haystack.compareDocumentPosition) { // gecko
                    ret = !!(haystack.compareDocumentPosition(needle) & 16);
                }
            } else {
            }
            return ret;
        },

        /**
         * HTMLElement가 현재 document에 존재하는지에 대한 여부
         * @static 
         * @method inDocument
         * @param {String | HTMLElement} el 검색할 element
         * @return {boolean} element가 현재 document에 존재하는지에 대한 여부
         */
        inDocument: function(el) {
            return this.isAncestor(document.documentElement, el);
        },

        /**
         * Collection/Array의 각 항목에 대해 제공되는 method를 실행한다.
         * method는 첫번째 인자로 element를, 두번째로 method(el, o) 같은 optional 인자를 가지고 호출된다.
         * @static 
         * @method batch
         * @param {String | HTMLElement | Array} el method가 적용할 element나 element들의 array
         * @param {Function} method element로 적용할 method
         * @param {Any} o (optional) 제공될 method로 전달할 optional arg
         * @param {boolean} override (optional) 'o'와 'method'의 scope를 override할지에 대한 여부
         * @return {Any | Array} 제공된 method로 부터의 반환값(들)
         */
        batch: function(el, method, o, override) {
            el = (el && (el.tagName || el.item)) ? el : Y.LDom.get(el); // skip get() when possible

            if (!el || !method) {
                return false;
            } 
            var scope = (override) ? o : window;
            
            if (el.tagName || el.length === undefined) { // element or not array-like 
                return method.call(scope, el, o);
            } 

            var collection = [];
            
            for (var i = 0, len = el.length; i < len; ++i) {
                collection[collection.length] = method.call(scope, el[i], o);
            }
            
            return collection;
        },
 
        /**
         * HTMLElement childNode들의 array를 반환한다.
         * @static 
         * @method getChildren
         * @param {String | HTMLElement} node 시작점으로 사용할 HTMLElement나 ID 
         * @return {Array} HTMLElement들의 static array
         */
        getChildren: function(node) {
            node = Y.LDom.get(node);
            return Y.LDom.getChildrenBy(node);
        },

        /**
         * test method로 전달할 HTMLElement childNode들의 array를 반환한다.
         * @static 
         * @method getChildrenBy
         * @param {HTMLElement} node 시작될 HTMLElemwnt
         * @param {Function} method 그것의 유일한 인자값으로 test되는 node를 받는 
         *                          children test에 사용되는 boolean 함수
         * @return {Array} HTMLElement들의 static array
         */
        getChildrenBy: function(node, method) {
            var child = Y.LDom.getFirstChildBy(node, method);
            var children = child ? [child] : [];

            Y.LDom.getNextSiblingBy(child, function(node) {
                if ( !method || method(node) ) {
                    children[children.length] = node;
                }
                return false; // fail test to collect all children
            });

            return children;
        },

        /**
         * 맨 처음 HTMLElement child를 반환한다.
         * @static 
         * @method getFirstChild
         * @param {String | HTMLElement} node The HTMLElement or an ID to use as the starting point 
         * @return {Object} HTMLElement or null if not found
         */
        getFirstChild: function(node, method) {
            node = Y.LDom.get(node);
            if (!node) {
                return null;
            }
            return Y.LDom.getFirstChildBy(node);
        }, 
        
        /**
         * test method로 전달할 처음 HTMLElement child를 반환한다.
         * @static 
         * @method getFirstChildBy
         * @param {HTMLElement} node 시작점으로 사용할 HTMLElement 
         * @param {Function} method 그것의 유일한 인자값으로 test되는 node를 받는 
         *                          children test에 사용되는 boolean 함수
         * @return {Object} HTMLElement나 발견되지 않았을 경우엔 null
         */
        getFirstChildBy: function(node, method) {
            var child = ( testElement(node.firstChild, method) ) ? node.firstChild : null;
            return child || Y.LDom.getNextSiblingBy(node.firstChild, method);
        },

        /**
         * node의 자식중 해당 tagName을 가지는 첫번째 element를 return한다. 
         * @static 
         * @method getFirstChildByTagName
         * @param {HTMLElement} node 부모 node 
         * @param {String} tagName 자식의 tagName
         * @return {Object} HTMLElement 또는 null
         */
        getFirstChildByTagName: function(node,tagName){
            //selecter 성능 문제때문에 childNodes를 search해서 찾음.
            var element = null;
            var child = null;    
            var nodeCount = node.childNodes.length;
            for (var i=0;i<nodeCount ;i++){
                child = node.childNodes[i];
                if(child.tagName && child.tagName.toLowerCase() == tagName.toLowerCase()){
                   element = child;
                   break; 
                }
            }
            return element;
        },

        /**
         * Returns the last HTMLElement child. 
         * @static 
         * @method getLastChild
         * @param {String | HTMLElement} node 시작지점으로서 사용할 HTMLElement난 ID 
         * @return {Object} HTMLElement나 찾지 못하는 경우 null
         */
        getLastChild: function(node) {
            node = Y.LDom.get(node);
            return Y.LDom.getLastChildBy(node);
        },

        /**
         * Returns the last HTMLElement child that passes the test method. 
         * @static 
         * @method getLastChildBy
         * @param {HTMLElement} node The HTMLElement to use as the starting point 
         * @param {Function} method A boolean function used to test children
         * that receives the node being tested as its only argument
         * @return {Object} HTMLElement or null if not found
         */
        getLastChildBy: function(node, method) {
            if (!node) {
                return null;
            }
            var child = ( testElement(node.lastChild, method) ) ? node.lastChild : null;
            return child || Y.LDom.getPreviousSiblingBy(node.lastChild, method);
        },

        /**
         * HTMLElement child 노드들의 array를 반환한다. 
         * @static 
         * @method getAllChildrenBy
         * @param {String | HTMLElement} node 시작지점으로서 사용할 HTMLElement난 ID 
         * @param {Array} list 배열
         * @param {Function} method 비교 function 
         * @return {Array} HTMLElement의 static array
         */
        getAllChildrenBy: function(parent, list, method) {
            parent = parent || document;
            list = list || [];
        
            var nodelist = parent.childNodes;
            for (var i = 0 ; i < nodelist.length ; i++) {
                var node = nodelist[i];
                if(node.nodeType === 1 || node.nodeType === 9) {
                    if(method && method(node))
                        list[list.length] = node;
                }
        
                this.getAllChildrenBy(node, list, method);
            }
        
            return list;  
        },

        /**
         * 이전에 sibling되어 있는 HTMLElement를 반환한다.
         * @static 
         * @method getPreviousSibling
         * @param {String | HTMLElement} node 시작지점으로서 사용할 HTMLElement나 ID 
         * @return {Object} HTMLElement나 찾지 못하는 경우 null
         */
        getPreviousSibling: function(node) {
            node = Y.LDom.get(node);
            if (!node) {
                return null;
            }
            return Y.LDom.getPreviousSiblingBy(node);
        }, 
        
        /**
         * 이전에 sibling되어 있는 HTMLElement를 반환한다.
         * 성능상의 이유로, ID들은 허용되지 않으며 argument의 validation은 생략한다.
         * Returns the nearest HTMLElement sibling if no method provided.
         * method가 제공되지 않는 경우 가장 가까운 sibling HTMLElement를 반환한다.
         * @static 
         * @method getPreviousSiblingBy
         * @param {HTMLElement} node 시작지점으로서 사용할 HTMLElement 
         * @param {Function} method 노드의 argument로서만 테스트될 sibling 노드를 받는 
         * sibling을 테스트하기 위하여 사용되는 boolean 함수
         * @return {Object} HTMLElement나 찾지 못하는 경우 null
         */
        getPreviousSiblingBy: function(node, method) {
            while (node) {
                node = node.previousSibling;
                if ( testElement(node, method) ) {
                    return node;
                }
            }
            return null;
        },

        /**
         * 다음에 sibling 되어 있는 HTMLElement를 반환한다.
         * @static 
         * @method getNextSibling
         * @param {String | HTMLElement} node 시작지점으로서 사용할 HTMLElement난 ID 
         * @return {Object} HTMLElement나 찾지 못하는 경우 null
         */
        getNextSibling: function(node) {
            node = Y.LDom.get(node);
            if (!node) {
                return null;
            }
            return Y.LDom.getNextSiblingBy(node);
        },
        
        /**
         * boolean method로 전달할 다음 형제 HTMLElement를 반환한다.
         * 성능상의 이유로, ID들은 허용되지 않으며, argument validation은 생략된다.
         * @static 
         * @method getNextSiblingBy
         * @param {HTMLElement} node 시작점으로 사용할 HTMLElement 
         * @param {Function} method 그것의 유일한 인자값으로 test되는 sibling node를 받는 
         *                          siblings test에 사용되는 boolean 함수
         * @return {Object} HTMLElement나 발견되지 않았을 경우엔 null
         */
        getNextSiblingBy: function(node, method) {
            while (node) {
                node = node.nextSibling;
                if ( testElement(node, method) ) {
                    return node;
                }
            }
            return null;
        }, 
 
        /**
         * 해당 element의 첫번째 child로서 element나 DomHelper 설정을 삽입하거나 생성한다.
         * @static
         * @method insertFirst
         * @param {String/HTMLElement} newNode 삽입할 id나 element, 삽입하거나 생성할 DomHelper 설정
         * @param {String/HTMLElement} referenceNode 이후에 새로운 노느가 삽입될 노드
         * @return {HTMLElement} 새로운 child
         */
        insertFirst: function(newNode, referenceNode){
            newNode = Y.LDom.get(newNode); 
            if (!newNode || !referenceNode || !referenceNode.parentNode) {
                return null;
            }       
            if(referenceNode.firstChild) {
                referenceNode.parentNode.insertBefore(newNode, referenceNode);
            } else {
                referenceNode.parentNode.appendChild(newNode);
            }
            return newNode;
        },
        
        /**
         * reference node의 이전 sibling으로 새 node를 삽입한다. 
         * @static
         * @method insertBefore
         * @param {String | HTMLElement} newNode 삽입될 node
         * @param {String | HTMLElement} referenceNode 새로운 node 이전에 삽입할 node 
         * @return {HTMLElement} 삽입된 node(만약 삽입이 실패되면 null) 
         */
        insertBefore: function(newNode, referenceNode) {
            newNode = Y.LDom.get(newNode); 
            referenceNode = Y.LDom.get(referenceNode); 
            if (!newNode || !referenceNode || !referenceNode.parentNode) {
                return null;
            }       
            return referenceNode.parentNode.insertBefore(newNode, referenceNode); 
        },

        /**
         * reference node의 다음 sibling으로 새 node를 삽입한다. 
         * @static
         * @method insertAfter
         * @param {String | HTMLElement} newNode 삽입될 node
         * @param {String | HTMLElement} referenceNode 새로운 node 이후에 삽입할 node 
         * @return {HTMLElement} 삽입된 node(만약 삽입이 실패되면 null) 
         */
        insertAfter: function(newNode, referenceNode) {
            newNode = Y.LDom.get(newNode); 
            referenceNode = Y.LDom.get(referenceNode); 
            if (!newNode || !referenceNode || !referenceNode.parentNode) {
                return null;
            }
            if (referenceNode.nextSibling) {
                return referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling); 
            } else {
                return referenceNode.parentNode.appendChild(newNode);
            }
        },

        /**
         * @description document로부터 DOM node를 삭제한다. body node는 전달될 경우 무시될 것이다. 
         * @method removeNode
         * @param {HTMLElement} node 삭제할 node
         * @return {void}
         */
        removeNode:function(n){
            Rui.util.LEvent.purgeElement(n, true);
            return Rui.browser.msie ? this._removeNode1(n) : this._removeNode2(n);
        },
        _removeNode1: function(n){
            if(n && n.tagName != 'BODY'){
                if(!this.removeDiv)
                    this.removeDiv = document.createElement('div');
                this.removeDiv.appendChild(n);
                this.removeDiv.innerHTML = '';
            }
        },
        _removeNode2: function(n){
            if(n && n.parentNode && n.tagName != 'BODY'){
                n.parentNode.removeChild(n);
                try { n.innerHTML = ''; } catch(e) {}
            }
        },
        
        /**
         * @description LElement의 모든 하위 객체들을 지운다.
         * @method removeChildNodes
         * @private
         * @return {Rui.LElement} 
         */
        removeChildNodes: function(dom){
            return;
            while (dom.firstChild) {
                dom.removeChild(dom.firstChild);
            }
        },

        /**
         * @description HTMLElement method를 위한 Wrapper.
         * @method replaceChild
         * @param {HTMLElement} newNode 삽입할 HTMLElement
         * @param {HTMLElement} oldNode 교체할 HTMLElement
         * @return {HTMLElement} 교체된 DOM element 
         */
        replaceChild: function(newNode, oldNode) {
            return oldNode.parentNode.replaceChild(newNode, oldNode);
        },

        /**
         * html내용을 dom객체에 추가한다.(script/css 태그 작동)
         * @method appendHtml
         * @static
         * @param {HTMLElement} dom 객체 
         * @param {String} html html 내용
         * @return {void} 
         */
        appendHtml: function(dom, html) {
            if(Rui.platform.isMobile == true) 
                Rui.util.LDom.appendHtml1(dom, html);
            else 
                Rui.util.LDom.appendHtml2(dom, html);
        },

        /**
         * html내용을 dom객체에 추가한다.(script/css 태그 작동)
         * @method appendHtml1
         * @private
         * @param {HTMLElement} 객체 
         * @param {String} html html 내용
         * @return {void} 
         * @static
         */
        appendHtml1: function(dom, html) {
           var scriptFragment = '<script[^>]*>([\\S\\s]*?)<\/script>|<style[^>]*>([\\S\\s]*?)<\/style>|<link[^>]*/>|<meta[^>]*/>|<title[^>]*>([\\S\\s]*?)<\/title>';
           var regexp = new RegExp(scriptFragment);
           
           var matches;
           var heads = [];
           while ((matches = regexp.exec(html)) != null){
               heads.push(matches[0]);
               html = html.replace(matches[0], '');
           }

           for (var i = 0 ; i < heads.length; i++) {
               var headData = Rui.createElements(heads[i]);
               var headDataDom = headData.getAt(0).dom;
               dom.appendChild(headDataDom);
               if(!Rui.browser.mozilla && headDataDom.tagName == 'SCRIPT') {
                   eval.call(window, headDataDom.text);
               }
           }

           var container = document.createElement('div');
           container.innerHTML = html;
           while (0 < container.childNodes.length) {
               var node = container.childNodes[0];
               dom.appendChild(node);
           }
        },

        /**
         * html내용을 dom객체에 추가한다.(script/css 태그 작동)
         * @method appendHtml2
         * @private
         * @param {HTMLElement} 객체 
         * @param {String} html html 내용
         * @return {void} 
         * @static
         */
        appendHtml2: function(dom, html) {
           var scriptFragment = '<script[^>]*>([\\S\\s]*?)<\/script>|<style[^>]*>([\\S\\s]*?)<\/style>|<link[^>]*/>';
           var regexp = new RegExp(scriptFragment);
           var head = document.getElementsByTagName('head')[0];
           
           var matches;
           var heads = [];
           while ((matches = regexp.exec(html)) != null){
               heads.push(matches[0]);
               html = html.replace(matches[0], '');
           }
           var container = document.createElement('div');
           container.innerHTML = html;
           while (0 < container.childNodes.length) {
               var node = container.childNodes[0];
               dom.appendChild(node);
           }
           
           for (var i = 0 ; i < heads.length; i++) {
               var headHtml = Rui.util.LString.trim(heads[i]);
               //var tags = headHtml.replace(/^\s+/, '').substring(0, 10).toLowerCase();
               //var headDataDom = null;
               var tagData = this.getTagData(headHtml);
               if (tagData.tagName == 'script') {
                   var script = document.createElement('script');
                   script.type = 'text/javascript';
                   for (m in tagData.attrs)
                       script[m] = tagData.attrs[m];
                   if (!tagData.attrs.src)
                       script.text = tagData.text;
                   head.appendChild(script);
               } else if (tagData.tagName == 'link' || tagData.tagName == 'style') {
                   var style = tagData.tagName == 'link' ? document.createElement('link') : document.createElement('style');
                   style.type = 'text/css';
                   for (m in tagData.attrs)
                       style[m] = tagData.attrs[m];
                   if (!tagData.attrs.href) {
                       if (Rui.browser.msie && Rui.browser.version < 11) style.styleSheet.cssText = tagData.text;
                       else style.textContent = tagData.text;
                   }
                   head.appendChild(style);
               }
           }           
        },
        getTagData: function(html) {
            var sPos = html.indexOf('>');
            var ePos = html.lastIndexOf('<');
            var sTag = html.substring(0, sPos + 1);
            var text = html.substring(sPos + 1, ePos);
            var eTag = html.substring(ePos);
            var attrs = this.getTagAttr(sTag);
            var tagName = new RegExp('(<script|<link|<style)').exec(sTag.toLowerCase())[0].substring(1);
            
            var tagData = {
                startTagHtml: sTag,
                tagName: tagName,
                text: text,
                endTagHtml: eTag,
                attrs: attrs
            };
            return tagData;
        },
        getTagAttr: function(html) {
            var attrs = {};
            var inx = html.indexOf(' ');
            if(inx > -1) {
                var aHtml = html.substring(inx, html.length - 1);
                aHtml = aHtml.substring(aHtml.length -1) == '/' ? aHtml.substring(0, aHtml.length -1): aHtml;
                aHtml = Rui.util.LString.trim(aHtml);
                var attrData = aHtml.split(' ');
                for (var i = 0 ; i < attrData.length; i++) {
                    var a = attrData[i].split('=');
                    attrs[Rui.util.LString.trim(a[0])] = Rui.util.LString.trim(a[1].substring(1, a[1].length -1));
                }
            }
            return attrs;
        },
        
        /**
         * html 해당되는 객체를 생성한후 LElementList로 리턴한다.
         * @method createElements
         * @static
         * @sample default
         * @param {String} html 생성할 html
         * @param {object} options [optional] 추가 설정 
         * @return {Rui.LElementList} 
         */
        createElements: function(html, options) {
            html = Rui.util.LString.trim(html);
            options = options || {};
            var match = /^<(\w+)\s*\/?>$/.exec(html);
            if(match) return Rui.get(document.createElement(match[1]));
            var div = document.createElement('div');
            var tags = html.replace(/^\s+/, '').substring(0, 10).toLowerCase();
            var wrap =
                // option or optgroup
                !tags.indexOf('<opt') &&
                [ 1, "<select multiple='multiple'>", "</select>" ] ||
    
                !tags.indexOf("<leg") &&
                [ 1, "<fieldset>", "</fieldset>" ] ||
    
                tags.match(/^<(thead|tbody|tfoot|colg|cap)/) &&
                [ 1, "<table>", "</table>" ] ||
    
                !tags.indexOf("<tr") &&
                [ 2, "<table><tbody>", "</tbody></table>" ] ||
    
                // <thead> matched above
                (!tags.indexOf("<td") || !tags.indexOf("<th")) &&
                [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ] ||
    
                !tags.indexOf("<col") &&
                [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ] ||
    
                // IE can't serialize <link> and <script> tags normally
                /*!jQuery.support.htmlSerialize &&
                [ 1, "div<div>", "</div>" ] ||*/
    
                [ 0, '', '' ];
    
            // Go to html and back, then peel off extra wrappers
            div.innerHTML = wrap[1] + html + wrap[2];
    
            // Move to the right depth
            while ( wrap[0]-- )
                div = div.lastChild;
                
            // jquery처럼 tbody를 체크해야 하는가?
    
            var element = [];
            for (var i = 0 ; i < div.childNodes.length; i++) {
                var dom = div.childNodes[i];
                for (m in options) dom[m] = options[m];
                element.push(Rui.get(dom));
            }
            return new Rui.LElementList(element);
        },

        /**
         * @description 전달된 simple selector의 match를 위한 현재 node와 parent node를 찾는다.(예: div.some-class or span:first-child)
         * @method findParent
         * @param {HTMLElement} node The node
         * @param {String} selector test를 위한 simple selector
         * @param {Number/Mixed} maxDepth (optional) element나 number로서 검색하기 위한 depth max값
         *                       (defaults to 10 || document.body)
         * @return {HTMLElement} 매치되는 DOM node(매치되는 값을 찾지 못하면 null)
         */
        findParent: function(dom, simpleSelector, maxDepth){
            var p = dom, 
                 b = document.body, 
                 depth = 0, 
                 dq = Rui.util.LDomSelector, 
                 stopEl;
                 
            maxDepth = maxDepth || 50;
            if(typeof maxDepth != 'number'){
                stopEl = Rui.getDom(maxDepth);
                maxDepth = 10;
            }
            Rui.get(p);
            while (p && p.nodeType == 1 && depth < maxDepth && p != b && p != stopEl){
                if(dq.test(p, simpleSelector)){
                    return p;
                }
                depth++;
                p = p.parentNode;
            }
            return null;
        },

        /**
         * @description Looks at parent nodes for a match of the passed simple selector (e.g. div.some-class or span:first-child)
         * @description 전달된 simple selector의 match를 위한 parent node들을 찾는다.(예: div.some-class or span:first-child)
         * @method findParentNode
         * @param {HTMLElement} node The node
         * @param {String} selector test를 위한 simple selector
         * @param {Number/Mixed} maxDepth (optional) element나 number로서 검색하기 위한 depth max값
         *                       (defaults to 10 || document.body)
         * @return {HTMLElement} 매치되는 DOM node(매치되는 값을 찾지 못하면 null)
         */
        findParentNode: function(dom, simpleSelector, maxDepth){
            return this.findParent(dom.parentNode, simpleSelector, maxDepth);
        },
        
        /**
         * dom 객체가 존재하는지 여부를 리턴한다.
         * @method isDom
         * @static
         * @param {String} id dom 객체를 찾을 id
         * @return {boolean} the result
         */
        isDom: function(id) {
            return document.getElementById(id) != null;
        },
        /**
         * dom 객체에 rui- 속성들을 json 객체로 리턴
         * @method getRuiAttributes
         * @static
         * @param {HTMLElement} dom dom 객체
         * @return {Object} json 객체
         */
        getRuiAttributes: function(dom) {
        	var attrs = {};
        	var map = dom.attributes;
        	for (var i = 0, len = map.length ; i < len; i++) {
        		if(Rui.util.LString.startsWith(map[i].name, 'rui-')) {
        			var key = map[i].name.substring(4);
        			attrs[key] = map[i].firstChild.textContent;
        		}
        	}
        	return attrs;
        } 
    };

})();

/**
 * Json 문자열을 파싱하는 method를 제공하고 Json 문자열로 object들을 변환한다. 
 * @class LKey
 * @static
 * @namespace Rui.util
 * @private
 */
if(!Rui.util.LKey){
    Rui.util.LKey = {
        /**
         * 특수 키의 집합에 대한 키들의 코드 상수
         * @property KEY
         * @static
         * @final
         */
        KEY: {
            ALT: 18,
            BACK_SPACE: 8,
            CAPS_LOCK: 20,
            CONTROL: 17,
            DELETE: 46,
            DOWN: 40,
            END: 35,
            ENTER: 13,
            ESCAPE: 27,
            HOME: 36,
            LEFT: 37,
            META: 224,
            NUM_LOCK: 144,
            PAGE_DOWN: 34,
            PAGE_UP: 33, 
            PAUSE: 19,
            PRINTSCREEN: 44,
            RIGHT: 39,
            SCROLL_LOCK: 145,
            SHIFT: 16,
            SPACE: 32,
            TAB: 9,
            UP: 38
        },
        /**
         * 방향, 위치이동, 탐색 등에 사용되는 키들의 코드 상수
         * @property NAVKEY
         * @static
         * @final
         */
        NAVKEY: {
            ENTER: 13,
            UP: 38,
            DOWN: 40,
            LEFT: 37,
            RIGHT: 39,
            HOME: 36,
            END: 35,
            PAGE_UP: 33, 
            PAGE_DOWN: 34,
            SHIFT: 16,
            TAB: 9
        }
    };
}

/**
 * Event 유틸리티는 event 시스템들을 만들기 위한 DOM Event들과 도구들을 관리하는
 * 유틸리티들을 제공한다.
 * @module util
 * @title Event Utility
 * @namespace Rui.util
 * @requires Rui
 */

/**
 * event가 발생할때 사용되기 위한 subscriber 정보를 저장한다.
 * @class LSubscriber
 * @protected
 * @constructor LSubscriber
 * @param {Function} fn       실행할 함수
 * @param {Object}   obj      event가 발생할때 전달될 object
 * @param {boolean}  override true인 경우 If true, 전달된 obj는 listener의 실행 범위가 된다.
 * @param {boolean}  p_system true일 경우 시스템 이벤트로 등록되어 우선순위가 올라간다.
 */
Rui.util.LSubscriber = function(fn, obj, override, system) {
    /**
     * event가 발생할때 실행될 callback
     * @property fn
     * @type function
     */
    this.fn = fn;
    /**
     * callback으로 전달되는 부가적인 custom object
     * the event fires
     * @property obj
     * @type object
     */
    this.obj = Rui.isUndefined(obj) ? null : obj;
    /**
     * event listener에 대한 기본적인 실행 scope는 event가 생성될때
     * 정의된다(일반적으로 event에 포함된 object).
     * override를 true로 설정함으로 인하여 실행 scope는 subscriber로 인해
     * 전달되는 custom object가 된다.
     * override가 object인 경우 해당 object는 scope가 된다.
     * @property override
     * @type boolean|object
     */
    this.override = override;
    /**
     * 시스템 이벤트인지 여부로 이벤트 우선 실행 우선순위가 올라간다.
     * @property system
     * @type boolean
     */
    this.system = system;
};
/**
 * 해당 listener에 대한 실행 scope를 반환한다. 
 * override가 true로 설정되어 있을 경우 custom obj가 scope가 될 것이다.
 * override가 object인 경우, 그것은 scope가 되며, 
 * 그렇지 않은 경우에는 기본 scope가 사용될 것이다.
 * @method getScope
 * @param {Object} defaultScope 해당 listener가 override 되지 않은 경우 사용할 scope.
 */
Rui.util.LSubscriber.prototype.getScope = function(defaultScope) {
    if (this.override) {
        if (this.override === true) {
            return this.obj;
        } else {
            return this.override;
        }
    }
    return defaultScope;
};
/**
 * fn과 obj가 해당 object들의 property들과 일치하는 경우 true를 반환한다.
 * 정확한 subscriber 일치를 위하여 unsubscribe method에 의해 사용된다.
 *
 * @method contains
 * @param {Function} fn 실행할 함수
 * @param {Object} obj event가 발생할때 전달될 object
 * @return {boolean} 제공된 argument들이 해당 subscriber의 signature와 일치하는 경우 true.
 */
Rui.util.LSubscriber.prototype.contains = function(fn, obj) {
    if (obj) {
        return (this.fn == fn && this.obj == obj);
    } else {
        return (this.fn == fn);
    }
};
/**
 * @method toString
 */
Rui.util.LSubscriber.prototype.toString = function() {
    return "Subscriber { obj: " + this.obj  + ", override: " +  (this.override || "no") + " }";
};

/**
 * Event 유틸리티는 event 시스템들을 만들기 위한 DOM Event들과 도구들을 관리하는
 * 유틸리티들을 제공한다.
 *
 * @module util
 * @title Event Utility
 * @namespace Rui.util
 * @requires Rui
 */

/**
 * LEventProvider는 event들이 이름으로 subscribe되거나 발생시키는 것이 
 * 가능하게 하는 인터페이스에서 CustomEvent들을 wrapping하기 위한 
 * Du.argument와 함께 사용되도록 디자인 된다.
 * 이것은 아직 만들어지지 않았거나, 전혀 만들어지지 않을 event에 
 * subscribe 하기 위한 코드 구현을 가능하게 한다.
 * @class LEventProvider
 */
Rui.util.LEventProvider = function() { };

Rui.util.LEventProvider.prototype = {
    /**
     * @description 객체의 문자열
     * @property otype
     * @private
     * @type {String}
     */
    otype: 'Rui.util.LEventProvider',
    /**
     * custom event들의 private 저장공간
     * @property __RUI_events
     * @type Object[]
     * @private
     */
    __RUI_events: null,
    /**
     * custom event subsctiber들의 private 저장공간
     * @property __RUI_subscribers
     * @type Object[]
     * @private
     */
    __RUI_subscribers: null,
    /**
     * simple custom event들의 private 저장공간
     * @property __simple_events
     * @type Object
     * @private
     */
    __simple_events: null,
    /**
     * 명시된 타입의 새로운 custom event를 생성한다.
     * 이미 존재하는 이름의 custom event일 경우 그것은 재생성 되지 않을 것이다.
     * 두 경우 모두 custom event가 반환된다.
     * @method createEvent
     * @protected
     * @param {string} type 타입 혹은 event의 이름
     * @param {object} options optional config params. 유효한 속성은 다음과 같다:
     * @return {LCustomEvent} the custom event
     */
    createEvent: function(p_type, options) {
        options = options || {};
        //options.isCE = true;
        if(this.ceMap && this.ceMap[p_type]) {
            options.isCE = true;
        }
        try {
            if (options && options.isCE === true) {
                if(this.__simple_events && this.__simple_events[p_type]) {
                    throw new Error('같은 type의 이벤트가 두가지 방식으로 처리되었습니다. : ' + p_type + ' ' + this);
                }
                this.ceMap = this.ceMap || {};
                this.ceMap[p_type] = true;
                return this.cCreateEvent(p_type, options);
            } else {
                this.sCreateEvent(p_type, options);
                if(this.ceMap)
                    delete this.ceMap[p_type]; 
            }
        } finally {
            options = null;
        }
    },
    /**
     * event 타입에 의해 LCustomEvent에 subscribe
     * @method on
     * @sample default
     * @param {string}   p_type     타입이나 event의 이름
     * @param {function} p_fn       event가 발생할때 실행할 함수
     * @param {Object}   p_obj      event가 발생할때 전달되는 object
     * @param {boolean}  p_override true일 경우, obj가 listener의 실행 scope가 된다.
     * @param {Object}  options [optional] true일 경우 시스템 이벤트로 등록되어 우선순위가 올라간다.
     * @return {void}
     */
    on: function(p_type, p_fn, p_obj, p_override, options) {
        Rui.devGuide(this, 'LEventProvider_on', [p_type, p_fn, p_obj, p_override, options]);
        options = options || {};
        //options.isCE = true;
        if(options && options.isCE === true || (this.ceMap && this.ceMap[p_type]))
            this.cOn(p_type, p_fn, p_obj, p_override, options.system);
        else
            this.sOn(p_type, p_fn, p_obj, p_override, options);
        options = null;
        return this;
    },
    /**
     * 특정 event로 부터 하나 혹은 그 이상의 listener들을 unsubscribe 한다.
     * @method unOn
     * @sample default
     * @param {string}   type 타입, 혹은 event의 이름.
     *                          타입을 명시하지 않은 경우, 모든 host된 event들로부터 listener를
     *                          제거하기 위해 시도할 것이다.
     * @param {Function} fn   unsubscribe 하기 위한 subsctibe된 함수.
     *                          제공되지 않는 경우 모든 subscriber가 삭제될 것이다.
     * @param {Object}   obj  subscribe하기 위해 전달되는 custom object.
     *                        이것은 옵션이지만, 만약 제공되면 같은 여러 개의 listener들을
     *                        명확하게 하는데 사용될 것이다.(예들 들어, prototype에 존재하는
     *                        함수를 사용하여 많은 object를 subscribe 하는 것을 들수 있다.)  
     * @return {boolean} subscriber가 발견되고 detach 된 경우 true.
     */
    unOn: function(type, fn, obj, options) {
        options = options || {};
        try {
            //options.isCE = true;
            if(options && options.isCE === true || (this.ceMap && this.ceMap[type]))
                return this.cUnOn(type, fn, obj);
            else {
                // 여기서 debugger가 걸리면 홍준희K한테 연락 바람.
                if(typeof obj == 'undefined') debugger;
                return this.sUnOn(type, fn, obj);
            }
            return false;
        } finally {
            options = null;
        }
    },
    /**
     * 이름으로 custom event를 발생시킨다.
     * callback 함수들은 event가 생성될 때 지정된 scope에서 실행되며,
     * 다음과 같은 parameter들을 가진다:
     *   <ul>
     *   <li>fire()는 첫번째 argument로 실행</li>
     *   <li>subscribe() method로 전달된 custom object</li>
     *   </ul>
     * @method fireEvent
     * @protected
     * @param {string}  type    타입 혹은 event의 이름
     * @param {Object} arguments [optional] handler로 전달할 parameter들의 임의의 집합.
     * @return {boolean} LCustomEvent.fire부터의 리턴값
     */
    fireEvent: function(type, arg1, options) {
        options = options || {};
        try {
            //options.isCE = true;
            if(options && options.isCE === true || (this.ceMap && this.ceMap[type]))
                return this.cFireEvent(type, arg1, options);
            else
                return this.sFireEvent(type, arg1);
        } finally {
            options = null;
        }
    },
    /**
     * event 타입에 의해 LCustomEvent에 subscribe
     * @method cOn
     * @private
     * @param {string}   p_type     타입이나 event의 이름
     * @param {function} p_fn       event가 발생할때 실행할 함수
     * @param {Object}   p_obj      event가 발생할때 전달되는 object
     * @param {boolean}  p_override true일 경우, obj가 listener의 실행 scope가 된다.
     * @param {boolean}  p_system true일 경우 시스템 이벤트로 등록되어 우선순위가 올라간다.
     * @return {void}
     */
    cOn: function(p_type, p_fn, p_obj, p_override, p_system) {
        this.__RUI_events = this.__RUI_events || {};
        var ce = this.__RUI_events[p_type];

        if (ce) {
            ce.on(p_fn, p_obj, p_override, p_system);
        } else {
            this.__RUI_subscribers = this.__RUI_subscribers || {};
            var subs = this.__RUI_subscribers;
            if (!subs[p_type]) {
                subs[p_type] = [];
            }
            subs[p_type].push(
                { fn: p_fn, obj: p_obj, override: p_override } );

            Rui.util.LEvent.isDuplicateEvent(p_type, subs[p_type], p_fn, this, p_obj);
            subs = null;
        }
        ce = null;
    },
    /**
     * 특정 event로 부터 하나 혹은 그 이상의 listener들을 unsubscribe 한다.
     * @method cUnOn
     * @private
     * @param {string}   p_type 타입, 혹은 event의 이름.
     *                          타입을 명시하지 않은 경우, 모든 host된 event들로부터 listener를
     *                          제거하기 위해 시도할 것이다.
     * @param {Function} p_fn   unsubscribe 하기 위한 subsctibe된 함수.
     *                          제공되지 않는 경우 모든 subscriber가 삭제될 것이다.
     * @param {Object}   p_obj  subscribe하기 위해 전달되는 custom object.
     *                        이것은 옵션이지만, 만약 제공되면 같은 여러 개의 listener들을
     *                        명확하게 하는데 사용될 것이다.(예들 들어, prototype에 존재하는
     *                        함수를 사용하여 많은 object를 subscribe 하는 것을 들수 있다.)  
     * @return {boolean} subscriber가 발견되고 detach 된 경우 true.
     */
    cUnOn: function(p_type, p_fn, p_obj) {
        this.__RUI_events = this.__RUI_events || {};
        var evts = this.__RUI_events;
        var ce = null;
        try {
            if (p_type) {
                ce = evts[p_type];
                if (ce) {
                    return ce.unOn(p_fn, p_obj);
                }
            } else {
                var ret = true;
                for (var i in evts) {
                    if (Rui.hasOwnProperty(evts, i)) {
                        ret = ret && evts[i].unOn(p_fn, p_obj);
                    }
                }
                return ret;
            }
    
            return false;
        } finally {
            ce = null;
            evts = null;
        }
    },
    /**
     * 모든 listener들을 제거한다. 
     * @method unOnAll
     * @sample default
     * @return {void}
     */
    unOnAll: function() {
        this.__RUI_events = this.__RUI_events || {};
        for (var m in this.__RUI_events) {
            if (m) {
                var ce = this.__RUI_events[m];
                if (ce) ce.unOn();
                this.__RUI_events[m] = null;
                delete this.__RUI_events[m];
            }
        }
        this.__simple_events = this.__simple_events || {};
        for (var m in this.__simple_events) {
            if (m) {
                this.__simple_events[m] = null;
                delete this.__simple_events[m];
            }
        }
        return this;
    },
    /**
     * 명시된 타입의 새로운 custom event를 생성한다.
     * 이미 존재하는 이름의 custom event일 경우 그것은 재생성 되지 않을 것이다.
     * 두 경우 모두 custom event가 반환된다.
     * @method cCreateEvent
     * @private
     * @param {string} p_type 타입 혹은 event의 이름
     * @param {object} p_config optional config params. 유효한 속성은 다음과 같다:
     * @return {LCustomEvent} the custom event
     */
    cCreateEvent: function(p_type, p_config) {
        this.__RUI_events = this.__RUI_events || {};
        var opts = p_config || {};
        var events = this.__RUI_events;

        if (events[p_type]) {
        } else {

            var scope  = opts.scope  || this;
            var silent = (opts.silent);
            
            var signature = opts.signature || Rui.util.LCustomEvent.FLAT;

            var ce = new Rui.util.LCustomEvent(p_type, scope, silent,
                    signature);
            events[p_type] = ce;

            if (opts.onSubscribeCallback) {
                ce.subscribeEvent.on(opts.onSubscribeCallback);
            }

            this.__RUI_subscribers = this.__RUI_subscribers || {};
            var qs = this.__RUI_subscribers[p_type];

            if (qs) {
                for (var i=0; i<qs.length; ++i) {
                    ce.on(qs[i].fn, qs[i].obj, qs[i].override);
                }
            }
            qs = null;
            ce = null;
            scope = null;
        }

        try {
            return events[p_type];
        } finally {
            opts = null;
            events = null;
        }
    },
    /**
     * 이름으로 custom event를 발생시킨다.
     * callback 함수들은 event가 생성될 때 지정된 scope에서 실행되며,
     * 다음과 같은 parameter들을 가진다:
     * 
     *   <ul>
     *   <li>fire()는 첫번째 argument로 실행</li>
     *   <li>subscribe() method로 전달된 custom object</li>
     *   </ul>
     * @method cFireEvent
     * @private
     * @param {string}  p_type    타입 혹은 event의 이름
     * @param {Object} arguments handler로 전달할 parameter들의 임의의 집합.
     * @return {boolean} LCustomEvent.fire부터의 리턴값
     */
    cFireEvent: function(p_type, arg1, arg2, etc) {
        this.__RUI_events = this.__RUI_events || {};
        var ce = this.__RUI_events[p_type];
        if (!ce) {
            return null;
        }
        var args = [];
        for (var i=1; i<arguments.length; ++i) {
            args.push(arguments[i]);
        }
        try {
            return ce.fire.apply(ce, args);
        } finally {
            ce = null;
            args = null;
        }
    },
    /**
     * 제공된 타입의 custom event가 crateEvent에 의해 생성된 경우 true를 반환한다.
     * @method hasEvent
     * @protected
     * @param {string} type 타입 혹은 event의 이름
     * @param {Function} fn 탑재한 Function
     * @param {Object} obj scope 객체
     * @return {boolean}
     */
    hasEvent: function(type, fn, obj) {
        if(this.ceMap && this.ceMap[type]) {
            throw new Error('simple event만 처리 가능합니다.');
        } else if(this.__simple_events){
            var eventList = this.__simple_events[type];
            var len = eventList.length;
            if(len > 0) {
                var i = len - 1;
                do {
                    if(eventList[i].scope && eventList[i].scope == obj && eventList[i].fn == fn)
                        return true;
                }
                while (i--);
            }
            eventList = null;
        }
        return false;
    },
    /**
     * 경량화된 이벤트를 생성한다.
     * @method sCreateEvent
     * @private
     * @param {string} p_type 타입 혹은 event의 이름
     * @return {LCustomEvent} the custom event
     */
    sCreateEvent: function(type) {
        this.__simple_events = this.__simple_events || {};
        if(!this.__simple_events[type])
            this.__simple_events[type] = [];
    },
    /**
     * @description 이벤트를 탑재한다.
     * @method sOn
     * @private
     * @param {String} type 이벤트 구분
     * @param {function} fn       event가 발생할때 실행할 함수
     * @param {Object}   scope      event가 발생할때 전달되는 object
     * @param {boolean}  override true일 경우, obj가 listener의 실행 scope가 된다.
     * @param {Object}  options options 객체
     * @return {void}
     */
    sOn: function(type, fn, scope, override, options) {
        this.__simple_events = this.__simple_events || {};
        var event = { fn: fn, scope: scope || this, system: (options && options.system === true) };
        if(!this.__simple_events[type]) return;
        var eventList = this.__simple_events[type];
        var len = eventList.length;
        if(event.system && len > 0) {
            var idx = len;
            for (var i = 0 ; i < len; i++) {
                if(eventList[i].system !== true) {
                    idx = i;
                    break;
                }
            }
            var userEvents = eventList.splice(idx, eventList.length);
            eventList.push(event);
            eventList = eventList.concat(userEvents);
            this.__simple_events[type] = eventList;
            userEvents = null;
        } else eventList.push( event );

        Rui.util.LEvent.isDuplicateEvent(type, eventList, fn, this, scope);

        event = null;
        eventList = null;
    },
    /**
     * @description 데이터셋의 이벤트가 수행시 같이 수행할 Function을 삭제한다.
     * @method sUnOn
     * @private
     * @param {String} type 이벤트 구분
     * @param {Function} fn 수행할 Function
     * @param {Object} scope 탑재한 객체
     * @return {boolean} 이벤트가 있고 detach 되어 있으면 true.
     */
    sUnOn: function(type, fn, scope) {
        var found = false;
        if(!this.__simple_events) return;
        var eventList = this.__simple_events[type];
        if(!eventList) return;
        for (var i = eventList.length ; i--;) {
            var s = eventList[i];
            if(scope) {
                if(s.fn == fn && scope == s.scope) {
                    eventList.splice(i, 1);
                    found = true;
                }
            } else {
                if(s.fn == fn) {
                    eventList.splice(i, 1);
                    found = true;
                }
            }
            s = null;
        }
        eventList = null;
        return found;
    },
    /**
     * @description 이벤트를 강제 호출한다.
     * @method sFireEvent
     * @private
     * @param {String} type 이벤트 구분
     * @param {Object} eventObject 이벤트 파라미터
     * @return {void}
     */
    sFireEvent: function(type, eo) {
        if(!type) throw new Error('type이 없습니다.');
        this.__simple_events = this.__simple_events || {};
        var eventList = this.__simple_events[type];
        if(!eventList) return;
        eo = eo || { type: type };
        //eo.type = type;
        for (var i = 0; i < eventList.length; i++) {
            var event = Rui.util.LEvent.getEvent(eo);
            /*if (eo.srcElement && !eo.target) // supplement IE with target
                eo.target = eo.srcElement;*/
            try{
                if (Rui.isDebugEV && (this.otype || eventList[i].scope)) {
                    var source = (this.otype || eventList[i].scope) + '';
                    Rui.log('type : SEvent ' + type + ', scope: ' + eventList[i].scope + ', source: ' + source + '\r\n function : ' + eventList[i].fn, 'event', source);
                }
                if(eventList[i].fn.call(eventList[i].scope, event) === false) return false;
            } catch(e1) {
                var source = ((eventList[i].scope && eventList[i].scope.otype) || eventList[i].scope || this.otype) + '';
                if (Rui.isDebugER) {
                    //var source = (this.otype || eventList[i].scope) + '';
                    if(e1.stack)
                        Rui.log('Event error : ' + source + '\r\nmessage : ' + e1.message + '\r\nstack : ' + e1.stack + '\r\nfunction : ' + eventList[i].fn, 'error', source);
                    else
                        Rui.log('Event error : ' + source + '\r\nmessage : ' + e1.message + '\r\ntype : ' + type + ', scope: ' + eventList[i].scope + ', source: ' + source + '\r\nfunction : ' + eventList[i].fn, 'error', source);
                }
                var msg = 'Event error : ' + source;
                if(eventList[i].scope && eventList[i].scope.id) msg += '[' + eventList[i].scope.id + ']';
                msg += ', event name : ' + type + '\r\nmessage : ' + e1.message + '\r\nstack : ' + e1.stack + '\r\nfunction : ' + eventList[i].fn;
                var host = window.location.hostname;
                Rui.util.LEvent.showErrorMessage(e1);
                if(host.search(/^localhost$/) !== -1 || host.search(/^127\.0\.0\.1$/) !== -1)
                	alert(msg, 'error', source);
                throw e1;
            }
            event = null;
        }
        eo = null;
        eventList = null;
        return true;
    },
    /**
     * DOM에서 패널 엘리먼트를 제거하고 모든 자식 엘리먼트들을 null로 설정한다.
     * @method destroy
     */
    destroy: function() {
        this.unOnAll();
        delete this.__RUI_events;
        delete this.__RUI_subscribers;
        for (m in this) {
            this[m] = null;
            delete this[m];
        }
    },
    /**
     * @description 객체의 toString
     * @method toString
     * @public
     * @return {String}
     */
    toString: function() {
        return this.otype + ' ' + (this.id || 'Unknown');
    }
};

// 아래의 내용은 제외되어야 하는데 LDragDrop.js의 this.subscribe.apply(this, arguments); 이 부분에서 on으로 처리되면 에러가 발생하여 어쩔 수 없이 넣음.
//Rui.util.LEventProvider.prototype.subscribe = Rui.util.LEventProvider.prototype.on;
/**
 * Event Utiltity는 event 시스템들을 구성하기 위한 DOM event와 도구들의 관리에 대한
 * utility들을 제공한다.
 * @module util
 * @title Event Utility
 * @namespace Rui.util
 * @requires Rui
 */

/**
 * LCustomEvent class는 하나 또는 그이상의 독립된 compnent에 소속될 수 있는
 * 어플리케이션을 위한 event들을 정의하게 해준다.
 *
 * @param {String}  type event가 발생할 때 callback으로 전송되는 event의 type
 * @param {Object}  oScope event로부터 발생될 context.
 *                  이것은 callback에서 해당 object를 참조한다. 
 *                  기본값: window object. listener는 이것을 override 할 수 있다.
 * @param {boolean} silent debugsystem에의 writing으로부터의 event를 방지하기 위해서는 true를 전송
 * @param {int}     signature custom event subscriber가 받을 signature.
 *                  Rui.util.LCustomEvent.LIST 혹은 Rui.util.LCustomEvent.FLAT.  
 *                  기본은 Rui.util.LCustomEvent.LIST 이다.
 * @namespace Rui.util
 * @class LCustomEvent
 * @constructor
 */
Rui.util.LCustomEvent = function(type, oScope, silent, signature) {
    /**
     * event가 발생할 때 subcriber들에게 반환되는 event의 type.
     * @property type
     * @type string
     */
    this.type = type;
    if(oScope && !(oScope === window)) {
        oScope.ceMap = oScope.ceMap || {};
        oScope.ceMap[type] = true;
    }
    /**
     * event가 기본적으로 발생할 scope. 기본값은 window obj 까지
     * @property scope
     * @type object
     */
    this.scope = oScope || window;
    /**
     * 기본적으로 모든 custom event들은 debug build에서 logging 되며, 
     * 이 event를 위해 debug output을 비활성화 하기 위해선 true로 설정한다.
     * @property silent
     * @type boolean
     */
    this.silent = silent;
    /**
     * Custom event들은 event subscriber들에게 제공되는 두가지 스타일의 인자들을 지원한다.  
     * <ul>
     * <li>Rui.util.LCustomEvent.LIST: 
     *   <ul>
     *   <li>param1: event name</li>
     *   <li>param2: 발생시키기 위해 전송되는 argument들의 array</li>
     *   <li>param3: <optional> subscriber에 의해 제공되는 custom object</li>
     *   </ul>
     * </li>
     * <li>Rui.util.LCustomEvent.FLAT
     *   <ul>
     *   <li>param1: 발생시키기 위해여 전달되는 첫번째 argument.
     *           만약 여러 parameter들을 전달하고자 한다면, array나 object literal을 사용한다.</li>
     *   <li>param2: <optional> subscriber에 의해 제공되는 custom object</li>
     *   </ul>
     * </li>
     * </ul>
     *   @property signature
     *   @type int
     */
    this.signature = signature || Rui.util.LCustomEvent.LIST;
    /**
     * 해당 event를 위한 subscriber들
     * @property subscribers
     * @private
     * @type Subscriber[]
     */
    this.subscribers = [];

    var onsubscribeType = "_RUICEOnSubscribe";

    // Only add subscribe events for events that are not generated by 
    // LCustomEvent
    if (type !== onsubscribeType) {
        /**
         * Csutom event들은 event에 새로운 subscriber가 있을때 마다 발생되는
         * custom event를 제공한다.
         * 그리고 새로운 subscriber를 가지고 이미 fire된
         * non-repeating 이벤트가 있는 경우를 제어하는 기회를 제공한다.
         * 
         * @event subscribeEvent
         * @type Rui.util.LCustomEvent
         * @param {Function} fn 실행할 function
         * @param {Object}   obj event가 발생할때 전달될 object An object to be passed along when the event fires
         * @param {boolean|Object}  override 만약 true면, 전달된 obj가 listener의 실행 scope가 된다.
         *                                   만약 object면, 그 object가 실행 scope가 된다.
         */
        this.subscribeEvent = new Rui.util.LCustomEvent(onsubscribeType, this, true);
    } 
    /**
     * exception이 발생했을때 subscriber 스택의 나머지를 실행 가능하게 하기 위하여
     * subscriber exception들이 잡힌다. 가장 최근의 exception이 이 propery에 저장된다.
     * @property lastError
     * @type Error
     */
    this.lastError = null;
};
/**
 * subscriber listener signature 상수.
 * LIST type은 세가지 parameter들을 반환한다: event type, 발생할때 전달되는 args의 array,
 * 그리고 optional custom object.
 * @property LIST
 * @static
 * @type int
 */
Rui.util.LCustomEvent.LIST = 0;
/**
 * subscriber listener signature 상수.
 * FLAT type은 두가지 parameter들을 반환한다: 발생할때 전달되는 첫번째 argument와
 * optional custom object
 * @property FLAT
 * @static
 * @type int
 */
Rui.util.LCustomEvent.FLAT = 1;
Rui.util.LCustomEvent.prototype = {
    /**
     * Subscribes the caller to this event
     * 이 event로의 caller 를 명시한다.
     * @method on
     * @param {Function} fn        실행할 function
     * @param {Object}   obj       event 발생시에 전달될 object 
     * @param {boolean|Object}  override 만약 true면, 전달된 obj가 listener의 실행 scope가 된다.
     *                                   만약 object면, 그 object가 실행 scope가 된다.
     * @param {boolean}  p_system [optional] true일 경우 시스템 이벤트로 등록되어 우선순위가 올라간다.
     */
    on: function(fn, obj, override, p_system) {
        if (!fn) {
            throw new Error("Invalid callback for subscriber to '" + this.type + "'");
        }
        if (this.subscribeEvent) {
            this.subscribeEvent.fire(fn, obj, override, p_system);
        }
        var subscriber = new Rui.util.LSubscriber(fn, obj, override, p_system);
        var len = this.subscribers.length;
        if(p_system && len > 0) {
            var idx = len;
            for (var i = 0 ; i < len; i++) {
                if(!this.subscribers[i].system) {
                    idx = i;
                    break;
                }
            }
            var userScripbers = this.subscribers.splice(idx, this.subscribers.length);
            this.subscribers.push(subscriber);
            this.subscribers = this.subscribers.concat(userScripbers);
        } else this.subscribers.push( subscriber );
    },
    /**
     * unOns subscribers.
     * @method unOn
     * @param {Function} fn  삭제하기 위하여 명시된 function, 만약 제공되지 않으면,
     *                       모든 function이 삭제될 것이다.
     * @param {Object}   obj  subscribe로 전달된 custom object.
     *                        이것은 option 이지만, 만약 명확한 여러 listener들에서 사용되게
     *                        제공되는 것은 모두 같을 것이다.
     *                        (e.g., prototype상에서 존재하는 function을 사용하는 
     *                        많은 object를 명시한다.)
     * @return {boolean} subscriber가 있고 detach 되어 있으면 true.
     */
    unOn: function(fn, obj) {
        if (!fn) {
            return this.unOnAll();
        }
        var found = false;
        for (var i=0, len=this.subscribers.length; i<len; ++i) {
            var s = this.subscribers[i];
            if (s && s.contains(fn, obj)) {
                this._delete(i);
                found = true;
            }
        }
        return found;
    },
    /**
     * Notifies the subscribers.
     * callback 함수는 event가 생성될때 특정 scope로 부터 실행될 것이다.
     * event는 아래와 같은 parameter를 가진다:
     *   <ul>
     *   <li>event의 type</li>
     *   <li>array로서 실행된 모든 arguments fire()</li>
     *   <li>(만약 있다면,) subscribe() method로 전달된 custom object</li>
     *   </ul>
     * @method fire 
     * @param {Object*} arguments handler로 전달할 parameter들의 임의 set 
     * @return {boolean} 만약 subscriber가 false 를 반환하면 false 이고 아니면 true
     */
    fire: function() {
        this.lastError = null;
        var len=this.subscribers.length;
       
        if (!len) {
            return true;
        }
        var args=[].slice.call(arguments, 0), ret=true, i, rebuild=false;

        // make a copy of the subscribers so that there are
        // no index problems if one subscriber removes another.
        var subs = this.subscribers.slice(), throwErrors = Rui.util.LEvent.throwErrors;

        for (i=0; i<len; ++i) {
            var s = subs[i];
            if (!s) {
                rebuild=true;
            } else {

                var scope = s.getScope(this.scope);

                if (this.signature == Rui.util.LCustomEvent.FLAT) {
                    var param = null;
                    if (args.length > 0) {
                        param = args[0];
                    }

                    //try {
                        ret = s.fn.call(scope, param, s.obj);
                    //} catch(e) {
                        /*if (Rui.isDebugER) {
                            var source = (scope.otype || scope) + '';
                            Rui.log(e.message, 'error', source);
                        }
                        alert(e.message, 'error', source);
                        Rui.util.LEvent.showErrorMessage(e);
                        this.lastError = e;
                        // errors.push(e);
                        if (throwErrors) {
                            throw e;
                        //}
                    }*/
                } else {
                    //try {
                        ret = s.fn.call(scope, this.type, args, s.obj);
                    /*} catch(ex1) {
                        if (Rui.isDebugER) {
                            var source = (scope.otype || scope) + '';
                            Rui.log(ex1.message, 'error', source);
                        }
                        //alert(ex.message, 'error', source);
                        Rui.util.LEvent.showErrorMessage(ex1);
                        this.lastError = ex1;
                        if (throwErrors) {
                            if(ex1 instanceof SyntaxError)
                            	throw ex1;
                        }
                    }*/
                }

                if (false === ret) {
                    break;
                    // return false;
                }
            }
        }
        return (ret !== false);
    },
    /**
     * 모든 listener들을 삭제한다.
     * @method unOnAll
     * @return {int} unsubscribe 된 listener의 개수
     */
    unOnAll: function() {
        for (var i=this.subscribers.length-1; i>-1; i--) {
            this._delete(i);
        }
        this.subscribers=[];
        return i;
    },
    /**
     * @method _delete
     * @private
     */
    _delete: function(index) {
        var s = this.subscribers[index];
        if (s) {
            delete s.fn;
            delete s.obj;
        }
        // this.subscribers[index]=null;
        this.subscribers.splice(index, 1);
    },
    /**
     * @method toString
     */
    toString: function() {
         return "LCustomEvent: " + "'" + this.type  + "', " + 
             "scope: " + this.scope;
    }
};
/**
 * Event 유틸리티는 event 시스템들을 만들기 위한 DOM Event들과 도구들을 관리하는
 * 유틸리티들을 제공한다.
 * @module util
 * @title LEvent Utility
 * @namespace Rui.util
 * @requires Rui
 */

// The first instance of Event will win if it is loaded more than once.
// @TODO this needs to be changed so that only the state data that needs to
// be preserved is kept, while methods are overwritten/added as needed.
// This means that the module pattern can't be used.
if (!Rui.util.LEvent) {
    /**
     * event 유틸리티는 event listener들과 event cleansing을 추가하거나 삭제하는
     * 함수들을 제공한다. 이것은 또한 unload event 동안 등록되는 listener들을
     * 제거하려고 시도한다.
     * @class LEvent
     * @static
     */
    Rui.util.LEvent = function() {

        /**
         * onload event가 발생한 후에 True
         * @property loadComplete
         * @type boolean
         * @static
         * @private
         */
        var loadComplete =  false;

        /**
         * Wrapping 된 listener들의 캐시
         * @property listeners
         * @type array
         * @static
         * @private
         */
        var listeners = [];

        /**
         * 모든 event들이 detach 되기 전에 발생되는 사용자 정의 unload 함수
         * @property unloadListeners
         * @type array
         * @static
         * @private
         */
        var unloadListeners = [];

        /**
         * Safari에서 DOM2 event들의 이슈 해결을 위한 DOM0 event handler들의 캐시
         * @property legacyEvents
         * @static
         * @private
         */
        var legacyEvents = [];

        /**
         * DOM0 event들에 대한 listener 스택
         * @property legacyHandlers
         * @static
         * @private
         */
        var legacyHandlers = [];

        /**
         * window.onload 이후에 polling 할 횟수. 이 숫자는 페이지 로딩 이후에
         * 추가적인 late-bound handler들이 요청될 경우 증가한다.
         * @property retryCount
         * @static
         * @private
         */
        var retryCount = 0;

        /**
         * onAvailable listeners
         * @property onAvailStack
         * @static
         * @private
         */
        var onAvailStack = [];

        /**
         * legacy event들에 대한 Lookup 테이블
         * @property legacyMap
         * @static
         * @private
         */
        var legacyMap = [];

        /**
         * 자동 id 생성에 대한 count
         * @property counter
         * @static
         * @private
         */
        var counter = 0;

        /**
         * webkit/safari에 대한 일반화된 keycode들
         * @property webkitKeymap
         * @type {int: int}
         * @private
         * @static
         * @final
         */
        var webkitKeymap = {
            63232: 38, // up
            63233: 40, // down
            63234: 37, // left
            63235: 39, // right
            63276: 33, // page up
            63277: 34, // page down
            25: 9      // SHIFT-TAB (Safari provides a different key code in
                       // this case, even though the shiftKey modifier is set)
        };

        // String constants used by the addFocusListener and removeFocusListener methods
        var _FOCUS = Rui.browser.msie ? 'focusin' : 'focus';
        var _BLUR = Rui.browser.msie ? 'focusout' : 'blur';

        return {

            /**
             * document가 로딩되고 event가 요청되는 시점에서 DOM에 있지 않은
             * element들을 찾기 위한 횟수.
             * 기본값은 2000@amp;20 ms 이며, 40초 혹은 모든 outstanding handler들이
             * 바운딩 되는(둘중 먼저 오는) 동안 polling 될 것이다.
             * @property POLL_RETRYS
             * @type int
             * @static
             * @final
             */
            POLL_RETRYS: 2000,

            /**
             * millisecond 단위의 polling 간격
             * @property POLL_INTERVAL
             * @type int
             * @static
             * @final
             */
            POLL_INTERVAL: 20,

            /**
             * 바인드할 element, 정수형 상수
             * @property EL
             * @type int
             * @private
             * @static
             * @final
             */
            EL: 0,

            /**
             * event의 타입, 정수형 상수
             * @property TYPE
             * @type int
             * @static
             * @final
             */
            TYPE: 1,

            /**
             * 실행할 함수, 정수형 상수
             * @property FN
             * @type int
             * @private
             * @static
             * @final
             */
            FN: 2,

            /**
             * scope 수정 및 정리를 위한 함수 wrapping, 정수형 상수
             * @property WFN
             * @type int
             * @static
             * @final
             */
            WFN: 3,

            /**
             * callback에의 parameter로서 반환될 사용자에 의해 전달되는 object, 정수형 상수.
             * listener들을 unload 하기 위해 명시된다.
             * @property UNLOAD_OBJ
             * @type int
             * @static
             * @final
             */
            UNLOAD_OBJ: 3,

            /**
             * event에 등록하는 element나 listener에 의해 전달되는 custom object의
             * 범위 조정, 정수형 상수
             * @property ADJ_SCOPE
             * @type int
             * @private
             * @static
             * @final
             */
            ADJ_SCOPE: 4,

            /**
             * addListener로 전달되는 original obj
             * @property OBJ
             * @type int
             * @static
             * @final
             */
            OBJ: 5,

            /**
             * addListener로 전달되는 original scope parameter
             * @property OVERRIDE
             * @type int
             * @static
             * @final
             */
            OVERRIDE: 6,

            /**
             * addListener로 전달되는 original capture parameter
             * @property CAPTURE
             * @type int
             * @static
             * @final
             */
            CAPTURE: 7,

            /**
             * addListener/removeListener는 예기치 않은 시나리오에서 에러를 throw 할수 있다.
             * 이런 에러들은 억제되며, hethod는 false를 반환하고, 해당 property를 설정한다.
             * @property lastError
             * @static
             * @type Error
             */
            lastError: null,

            /**
             * webkit 버전
             * @property webkit
             * @type string
             * @private
             * @static
             * @deprecated use Rui.browser.webkit
             */
            webkit: Rui.browser.webkit,

            /**
             * IE 브라우저 인식
             * @property isIE
             * @private
             * @static
             * @deprecated use Rui.browser.msie
             */
            isIE: Rui.browser.msie,

            /**
             * poll handle
             * @property _interval
             * @static
             * @private
             */
            _interval: null,

            /**
             * document readystate poll handle
             * @property _dri
             * @static
             * @private
             */
             _dri: null,

            /**
             * document가 처음으로 사용할 수 있을때 True
             * @property DOMReady
             * @type boolean
             * @static
             */
            DOMReady: false,

            /**
             * custom event들의 subscriber에 의해 전달된 에러들이 캐치되고,
             * 에러 제세지는 debug 콘솔에 출력된다.
             * 이 property를 true로 설정할 경우, 에러를 re-throw 할 것이다.
             * @property throwErrors
             * @type boolean
             * @default false
             */
            throwErrors: true,

            /**
             * @method startInterval
             * @static
             * @private
             */
            startInterval: function() {
                if (!this._interval) {
                    var self = this;
                    var callback = function() { self._tryPreloadAttach(); };
                    this._interval = setInterval(callback, this.POLL_INTERVAL);
                }
            },

            /**
             * 제공된 id의 항목이 발견됐을 때 제공된 callback을 실행한다.
             * 이것은 페이지 로딩시 가능한 빨리 동작을 실행하는데
             * 사용될 수 있음을 의미한다.
             * 이것을 초기 페이지 로딩 이후에 사용할 경우, element에 대한
             * 고정된 시간으로 polling을 할 것이다.
             * polling 횟수와 주기는 config 가능하다.
             * 기본적으로 10초 동안 polling 할 것이다.
             * <p>callback은 하나의 parameter를 가지고 실행된다:
             * custom object parameter를 제공하는 경우.</p>
             *
             * @method onAvailable
             *
             * @param {string||string[]} p_id element의 id나, 찾아야 할 id들의 array
             * @param {function} p_fn element를 찾았을때, 실행할 함수.
             * @param {object}   p_obj p_fn의 parameter로서 전달될 optional object.
             * @param {boolean|object}  p_override true가 설정될 경우, p_fn은 p_obj의 scope로
             *                   실행할 것이며, object가 설정될 경우, 해당 object의 scope로
             *                   실행할 것이다.
             * @param checkContent {boolean} child 노드의 준비성을 체크한다.(onContentReady)
             * @static
             */
            onAvailable: function(p_id, p_fn, p_obj, p_override, checkContent) {

                var a = (Rui.isString(p_id)) ? [p_id] : p_id;

                for (var i=0; i<a.length; i=i+1) {
                    onAvailStack.push({id:         a[i],
                                       fn:         p_fn,
                                       obj:        p_obj,
                                       override:   p_override,
                                       checkReady: checkContent });
                }

                retryCount = this.POLL_RETRYS;

                this.startInterval();
            },

            /**
             * onAvailable과 같은 방식으로 작동하지만 추가적으로, 사용가능한 element의
             * 내용이 변경하기 위해 안전한지를 결정하기 위하여 연결된 element들의
             * 상태를 체크한다.
             *
             * <p>callback은 하나의 parameter를 가지고 실행된다:
             * custom object parameter를 제공하는 경우.</p>
             *
             * @method onContentReady
             *
             * @param {string}   p_id 찾아야 할 element의 id
             * @param {function} p_fn element가 준비되었을때 실행할 함수
             * @param {object}   p_obj p_fn의 parameter로서 전달될 optional object
             * @param {boolean|object}  p_override true가 설정될 경우, p_fn은 p_obj의 scope로
             *                   실행할 것이며, object가 설정될 경우, 해당 object의 scope로
             *                   실행할 것이다.
             *
             * @static
             */
            onContentReady: function(p_id, p_fn, p_obj, p_override) {
                this.onAvailable(p_id, p_fn, p_obj, p_override, true);
            },

            /**
             * DOM이 처음으로 사용가능할 때 제공된 callback을 실행한다.
             * 이것은 DOMReady event가 발생된 이후에 호출될 경우 즉시 실행될 것이다.
             * @todo DOMContentReady event는 스크립트가 페이지에 동적으로 삽입된 경우
             * 발생하지 않을 것이다.
             * 이것은 DOMReady custom event가 library가 삽입될때 FireFox나 Opera 브라우저에서
             * 절대 발생하지 않음을 의미한다.
             * 이것은 Safari 브라우저에서는 발생할 것이며, IE의 구현에서는
             * 지연된 스크립트가 사용가능하지 않은 경우 발생하도록 고려할 수 있다.
             * 우리는 이것이 모든 브라우저에서 동일하게 작동하게 하고 싶다.
             * 스크립트가 included inline 대신에 삽입되었을 때 확인할 방법이 있는가?
             * window onload event가 첨부된 listener를 가지지 않고 발생할수 있을지
             * 에 대해서 알 수 있는 방법이 있는가?
             *
             * <p>callback은 LCustomEvent이며, signature는 다음과 같다:</p>
             * <p>type &lt;string&gt;, args &lt;array&gt;, customobject &lt;object&gt;</p>
             * <p>DOMReady event들에 대해, 발생 argument들은 없으며, signature는 다음과 같다:</p>
             * <p>'DOMReady', [], obj</p>
             *
             *
             * @method onDOMReady
             *
             * @param {function} p_fn element를 찾았을 때 실행할 함수
             * @param {object}   p_obj p_fn의 parameter로서 전달될 optional object
             * @param {boolean|object}  p_scope true가 설정될 경우, p_fn은 p_obj의 scope로
             *                   실행할 것이며, object가 설정될 경우, 해당 object의 scope로
             *                   실행할 것이다.
             *
             * @static
             */
            onDOMReady: function(p_fn, p_obj, p_override) {
                if (this.DOMReady) {
                    setTimeout(function() {
                        var s = window;
                        if (p_override) {
                            if (p_override === true) {
                                s = p_obj;
                            } else {
                                s = p_override;
                            }
                        }
                        p_fn.call(s, 'DOMReady', [], p_obj);
                    }, 0);
                } else {
                    this.DOMReadyEvent.on(p_fn, p_obj, p_override);
                }
            },

            /**
             * event handlet를 추가한다.
             *
             * @method _addListener
             *
             * @param {String|HTMLElement|Array|NodeList} el listener에 할당할 id나
             *  element reference 혹은 id나 element들의 collection.
             * @param {String}   sType     추가할 event의 타입
             * @param {Function} fn        event가 수행하는 method
             * @param {Object}   obj    handler에 parameter로서 전달될 임의의 object
             * @param {Boolean|object}  override  true일 결우, obj가 listener의 실행 scope가 된다.
             *                             object일 경우, object가 실행 scope가 된다.
             * @param {boolen}      capture [optional] capture or bubble phase
             * @return {boolean} action이 성공이거나 defred일 경우 true,
             *                        하나 혹은 그 이상의 element들이 첨부된 listener를 가질
             *                        수 없었거나 operation에서 exception이 발생했을 경우 false.
             * @private
             * @static
             */
            _addListener: function(el, sType, fn, obj, override, capture) {

                if (!fn || !fn.call) {
                    return false;
                }

                // The el argument can be an array of elements or element ids.
                if ( this._isValidCollection(el)) {
                    var ok = true;
                    for (var i=0,len=el.length; i<len; ++i) {
                        ok = this._addListener(el[i],
                                       sType,
                                       fn,
                                       obj,
                                       override,
                                       capture) && ok;
                    }
                    return ok;

                } else if (Rui.isString(el)) {
                    var oEl = this.getEl(el);
                    // If the el argument is a string, we assume it is
                    // actually the id of the element.  If the page is loaded
                    // we convert el to the actual element, otherwise we
                    // defer attaching the event until onload event fires

                    // check to see if we need to delay hooking up the event
                    // until after the page loads.
                    if (oEl) {
                        el = oEl;
                    } else {
                        // defer adding the event until the element is available
                        this.onAvailable(el, function() {
                           Rui.util.LEvent._addListener(el, sType, fn, obj, override, capture);
                        });

                        return true;
                    }
                }

                // Element should be an html element or an array if we get
                // here.
                if (!el) {
                    return false;
                }

                // we need to make sure we fire registered unload events
                // prior to automatically unhooking them.  So we hang on to
                // these instead of attaching them to the window and fire the
                // handles explicitly during our one unload event.
                if ('unload' == sType && obj !== this) {
                    unloadListeners[unloadListeners.length] =
                            [el, sType, fn, obj, override, capture];
                    return true;
                }

                // if the user chooses to override the scope, we use the custom
                // object passed in, otherwise the executing scope will be the
                // HTML element that the event is registered on
                var scope = el;
                if (override) {
                    if (override === true) {
                        scope = obj;
                    } else {
                        scope = override;
                    }
                }

                // wrap the function so we can return the obj object when
                // the event fires;
                var wrappedFn = function(ev) {
                    try {
                        return fn.call(scope, Rui.util.LEvent.getEvent(ev, el),
                                obj);
                    }catch(e) {
                        Rui.util.LEvent.showErrorMessage(e);
                        throw e;
                    }
                };

                var li = [el, sType, fn, wrappedFn, scope, obj, override, capture];
                var index = listeners.length;
                // cache the listener so we can try to automatically unload
                listeners[index] = li;

                if (this.useLegacyEvent(el, sType)) {
                    var legacyIndex = this.getLegacyIndex(el, sType);

                    // Add a new dom0 wrapper if one is not detected for this
                    // element
                    if ( legacyIndex == -1 || el != legacyEvents[legacyIndex][0] ) {

                        legacyIndex = legacyEvents.length;
                        legacyMap[el.id + sType] = legacyIndex;

                        // cache the signature for the DOM0 event, and
                        // include the existing handler for the event, if any
                        legacyEvents[legacyIndex] =
                            [el, sType, el['on' + sType]];
                        legacyHandlers[legacyIndex] = [];

                        el['on' + sType] =
                            function(e) {
                                Rui.util.LEvent.fireLegacyEvent(
                                    Rui.util.LEvent.getEvent(e), legacyIndex);
                            };
                    }

                    // add a reference to the wrapped listener to our custom
                    // stack of events
                    //legacyHandlers[legacyIndex].push(index);
                    legacyHandlers[legacyIndex].push(li);

                } else {
                    try {
                        this._simpleAdd(el, sType, wrappedFn, capture);
                    } catch(ex) {
                        // handle an error trying to attach an event.  If it fails
                        // we need to clean up the cache
                        this.lastError = ex;
                        this._removeListener(el, sType, fn, capture);
                        return false;
                    }
                }

                return true;
            },

            /**
             * event handler를 추가한다.
             * @method addListener
             * @param {String|HTMLElement|Array|NodeList} el listener에 할당할 id나
             *  element reference 혹은 id나 element들의 collection.
             * @param {String}   sType     추가할 event의 타입
             * @param {Function} fn        event가 수행하는 method
             * @param {Object}   obj    handler에 parameter로서 전달될 임의의 object
             * @param {Boolean|object}  override  true일 결우, obj가 listener의 실행 scope가 된다.
             *                             object일 경우, object가 실행 scope가 된다.
             * @param {boolen}      capture capture or bubble phase
             * @return {boolean} action이 성공이거나 defred일 경우 true,
             *                        하나 혹은 그 이상의 element들이 첨부된 listener를 가질
             *                        수 없었거나 operation에서 exception이 발생했을 경우 false.
             * @static
             */
            addListener: function (el, sType, fn, obj, override) {
                return this._addListener(el, sType, fn, obj, override, false);
            },

            /**
             * focus event handler를 추가한다. (focusin event는 Internet Explorer, WebKit,
             * Gecko, Opera에 대한 capture-event, focus에서 사용된다.)
             * @method addFocusListener
             * @param {String|HTMLElement|Array|NodeList} el listener에 할당할 id나
             *  element reference 혹은 id나 element들의 collection.
             * @param {Function} fn        event가 수행하는 method
             * @param {Object}   obj    handler에 parameter로서 전달될 임의의 object
             * @param {Boolean|object}  override  true일 결우, obj가 listener의 실행 scope가 된다.
             *                             object일 경우, object가 실행 scope가 된다.
             * @return {boolean} action이 성공이거나 defred일 경우 true,
             *                        하나 혹은 그 이상의 element들이 첨부된 listener를 가질
             *                        수 없었거나 operation에서 exception이 발생했을 경우 false.
             * @static
             */
            addFocusListener: function (el, fn, obj, override) {
                return this._addListener(el, _FOCUS, fn, obj, override, true);
            },

            /**
             * focus event listener를 삭제한다.
             *
             * @method removeFocusListener
             *
             * @param {String|HTMLElement|Array|NodeList} el listener로부터 삭제할 id나
             *  element reference 혹은 id나 element들의 collection.
             * @param {Function} fn event가 수행하는 method.
             *  fn이 undefined일 경우 event의 type에 대한 모든 event handler들은 삭제된다.
             * @return {boolean} unbind가 성공이면 true, 그외에는 false
             * @static
             */
            removeFocusListener: function (el, fn) {
                return this._removeListener(el, _FOCUS, fn, true);
            },

            /**
             * blur event handler를 추가한다. (focusout event는 Internet Explorer, WebKit,
             * Gecko, Opera에 대한 capture-event, focus에서 사용된다.)
             * @method addBlurListener
             * @static
             * @param {String|HTMLElement|Array|NodeList} el listener에 할당할 id나
             *  element reference 혹은 id나 element들의 collection.
             * @param {Function} fn        event가 수행하는 method
             * @param {Object}   obj    handler에 parameter로서 전달될 임의의 object
             * @param {Boolean|object}  override  true일 결우, obj가 listener의 실행 scope가 된다.
             *                             object일 경우, object가 실행 scope가 된다.
             * @return {boolean} action이 성공이거나 defred일 경우 true,
             *                        하나 혹은 그 이상의 element들이 첨부된 listener를 가질
             *                        수 없었거나 operation에서 exception이 발생했을 경우 false.
             */
            addBlurListener: function (el, fn, obj, override) {
                return this._addListener(el, _BLUR, fn, obj, override, true);
            },

            /**
             * blur event listener를 삭제한다.
             *
             * @method removeBlurListener
             *
             * @param {String|HTMLElement|Array|NodeList} el listener로부터 삭제할 id나
             *  element reference 혹은 id나 element들의 collection.
             * @param {Function} fn event가 수행하는 method.
             *  fn이 undefined일 경우 event의 type에 대한 모든 event handler들은 삭제된다.
             * @return {boolean} unbind가 성공이면 true, 그외에는 false
             * @static
             */
            removeBlurListener: function (el, fn) {
                return this._removeListener(el, _BLUR, fn, true);
            },

            /**
             * legacy event들을 사용할때, handler는 custom listener stack을 발생시킬 수
             * 있도록 해당 object로 라우팅된다.
             * @method fireLegacyEvent
             * @static
             * @private
             */
            fireLegacyEvent: function(e, legacyIndex) {
                var ok=true, le, lh, li, scope, ret;

                lh = legacyHandlers[legacyIndex].slice();
                for (var i=0, len=lh.length; i<len; ++i) {
                // for (var i in lh.length) {
                    li = lh[i];
                    if ( li && li[this.WFN] ) {
                        scope = li[this.ADJ_SCOPE];
                        ret = li[this.WFN].call(scope, e);
                        ok = (ok && ret);
                    }
                }

                // Fire the original handler if we replaced one.  We fire this
                // after the other events to keep stopPropagation/preventDefault
                // that happened in the DOM0 handler from touching our DOM2
                // substitute
                le = legacyEvents[legacyIndex];
                if (le && le[2]) {
                    le[2](e);
                }

                return ok;
            },

            /**
             * 제공된 signature에 맞는 lefacy event index를 반환한다.
             * @method getLegacyIndex
             * @static
             * @private
             */
            getLegacyIndex: function(el, sType) {
                var key = this.generateId(el) + sType;
                if (typeof legacyMap[key] == 'undefined') {
                    return -1;
                } else {
                    return legacyMap[key];
                }
            },

            /**
             * DOM2 event들 대신 자동적으로 lefacy event들을 사용하도록 하고자 할때
             * 결정하는 logic.
             * 일반적으로 이것은 broken preventDefault를 가진 구 Safari 브라우저에서 제한된다.
             * @method useLegacyEvent
             * @static
             * @private
             */
            useLegacyEvent: function(el, sType) {
                return (this.webkit && this.webkit < 419 && ('click'==sType || 'dblclick'==sType));
            },

            /**
             * event listener를 삭제한다.
             *
             * @method _removeListener
             *
             * @param {String|HTMLElement|Array|NodeList} el listener로부터 삭제할 id나
             *  element reference 혹은 id나 element들의 collection.
             * @param {String} sType 삭제할 event의 타입
             * @param {Function} fn event가 수행하는 method.
             *  fn이 undefined일 경우 event의 type에 대한 모든 event handler들은 삭제된다.
             * @param {boolen}      capture capture or bubble phase
             * @return {boolean} unbind가 성공이면 true, 그외에는 false
             * @static
             * @private
             */
            _removeListener: function(el, sType, fn, capture) {
                var i, len, li;

                // The el argument can be a string
                if (typeof el == 'string') {
                    el = this.getEl(el);
                // The el argument can be an array of elements or element ids.
                } else if ( this._isValidCollection(el)) {
                    var ok = true;
                    for (i=el.length-1; i>-1; i--) {
                        ok = ( this._removeListener(el[i], sType, fn, capture) && ok );
                    }
                    return ok;
                }

                if (!fn || !fn.call) {
                    //return false;
                    return this.purgeElement(el, false, sType);
                }

                if ('unload' == sType) {

                    for (i=unloadListeners.length-1; i>-1; i--) {
                        li = unloadListeners[i];
                        if (li &&
                            li[0] == el &&
                            li[1] == sType &&
                            li[2] == fn) {
                                unloadListeners.splice(i, 1);
                                // unloadListeners[i]=null;
                                return true;
                        }
                    }

                    return false;
                }

                var cacheItem = null;

                // The index is a hidden parameter; needed to remove it from
                // the method signature because it was tempting users to
                // try and take advantage of it, which is not possible.
                var index = arguments[4];

                if ('undefined' === typeof index) {
                    index = this._getCacheIndex(el, sType, fn);
                }

                if (index >= 0) {
                    cacheItem = listeners[index];
                }

                if (!el || !cacheItem) {
                    return false;
                }

                if (this.useLegacyEvent(el, sType)) {
                    var legacyIndex = this.getLegacyIndex(el, sType);
                    var llist = legacyHandlers[legacyIndex];
                    if (llist) {
                        for (i=0, len=llist.length; i<len; ++i) {
                        // for (i in llist.length) {
                            li = llist[i];
                            if (li &&
                                li[this.EL] == el &&
                                li[this.TYPE] == sType &&
                                li[this.FN] == fn) {
                                    llist.splice(i, 1);
                                    // llist[i]=null;
                                    break;
                            }
                        }
                    }

                } else {
                    try {
                        this._simpleRemove(el, sType, cacheItem[this.WFN], capture);
                    } catch(ex) {
                        this.lastError = ex;
                        return false;
                    }
                }

                // removed the wrapped handler
                delete listeners[index][this.WFN];
                delete listeners[index][this.FN];
                listeners.splice(index, 1);
                // listeners[index]=null;
                return true;
            },
            /**
             * event listener를 삭제한다.
             *
             * @method removeListener
             * @param {String|HTMLElement|Array|NodeList} el listener로부터 삭제할 id나
             *  element reference 혹은 id나 element들의 collection.
             * @param {String} sType 삭제할 event의 타입
             * @param {Function} fn event가 수행하는 method.
             *  fn이 undefined일 경우 event의 type에 대한 모든 event handler들은 삭제된다.
             * @return {boolean} unbind가 성공이면 true, 그외에는 false
             * @static
             */
            removeListener: function(el, sType, fn) {
                    return this._removeListener(el, sType, fn, false);
            },
            /**
             * 중복된 이벤트를 log로 출력한다.
             * @method isDuplicateEvent
             * @private
             * @param {Array} eventList 이벤트가 탑재된 배열
             * @param {Function} fn event가 수행하는 method.
             * @param {Object} thisObj 현재 탭재될 객체
             * @param {Object} scope scope 정보
             * @return {void}
             * @static
             */
            isDuplicateEvent: function(type, eventList, fn, thisObj, scope) {
                if(Rui.isDebugWA) {
                    var foundCnt = 0 ;
                    for (var i = 0, len = eventList.length; i < len; i++) {
                        var s = eventList[i];
                        if(scope) {
                            if(s.fn == fn && (scope == (s.obj || s.scope)))
                                foundCnt++;
                        } else {
                            if(s.fn == fn)
                                foundCnt++;
                        }
                        if(foundCnt > 1) {
                            var otype = (scope || thisObj.otype);
                            Rui.log('중복된 이벤트가 탑재되었습니다. => type: ' + type + ', scope: ' + otype + ', fn: ' + fn, 'warning', otype)
                            return true;
                        }
                    }
                }
                return false;
            },

            /**
             * event의 target element를 반환한다.
             * Safari 브라우저는 종종 텍스트 노드를 제공하며, 이것은 다른 브라우저들처럼 동작하는
             * 텍스트 노드의 paranet로 자동적으로 resolve 된다.
             * @method getTarget
             * @param {Event} ev the event
             * @param {boolean} resolveTextNode true로 설정되면, target이 텍스트 노드일 경우,
             *                  target의 parent가 반환될 것이다. @deprecated, 텍스트 노드는
             *                  이제 자동적으로 resolev된다.
             * @return {HTMLElement} the event's target
             * @static
             */
            getTarget: function(ev, resolveTextNode) {
                var t = ev.target || ev.srcElement;
                return this.resolveTextNode(t);
            },

            /**
             * 어떤 경우에는 일부 브라우저들은 targeting 된 실제 element 내부의
             * 텍스트 노드를 반환할 것이다.
             * 이런 normalizes는 getTarget and getRelatedTarget에 대한 값을 반환한다.
             * @method resolveTextNode
             * @param {HTMLElement} node resolve 할 노드
             * @return {HTMLElement} the normized node
             * @static
             */
            resolveTextNode: function(n) {
                try {
                    if (n && 3 == n.nodeType) {
                        return n.parentNode;
                    }
                } catch(e) { }

                return n;
            },

            /**
             * Returns the event's pageX
             * event의 pageX를 반환한다.
             * @method getPageX
             * @param {Event} ev the event
             * @return {int} event의 pageX
             * @static
             */
            getPageX: function(ev) {
                var x = ev.pageX;
                if (!x && 0 !== x) {
                    x = ev.clientX || 0;

                    if ( this.isIE ) {
                        x += this._getScrollLeft();
                    }
                }
                return x;
            },

            /**
             * event의 pageY를 반환한다.
             * @method getPageY
             * @param {Event} ev the event
             * @return {int} event의 pageY
             * @static
             */
            getPageY: function(ev) {
                var y = ev.pageY;
                if (!y && 0 !== y) {
                    y = ev.clientY || 0;

                    if ( this.isIE ) {
                        y += this._getScrollTop();
                    }
                }
                return y;
            },

            /**
             * index된 array로 pageX와 pageY rpoperty들을 반환한다.
             * @method getXY
             * @param {Event} ev the event
             * @return {Object} event의 pageX와 pageY property들 [x, y]
             * @static
             */
            getXY: function(ev) {
                return [this.getPageX(ev), this.getPageY(ev)];
            },

            /**
             * event의 연관된 target을 반환한다.
             * @method getRelatedTarget
             * @param {Event} ev the event
             * @return {HTMLElement} event의 연관된 target
             * @static
             */
            getRelatedTarget: function(ev) {
                var t = ev.relatedTarget;
                if (!t) {
                    if (ev.type == 'mouseout') {
                        t = ev.toElement;
                    } else if (ev.type == 'mouseover') {
                        t = ev.fromElement;
                    }
                }
                return this.resolveTextNode(t);
            },

            /**
             * event의 시간을 반환한다. 시간이 포함되어 있지 않은 경우,
             * event는 현재 시간을 사용하도록 변경된다.
             * @method getTime
             * @param {Event} ev the event
             * @return {Date} event의 시간
             * @static
             */
            getTime: function(ev) {
                if (!ev.time) {
                    var t = new Date().getTime();
                    try {
                        ev.time = t;
                    } catch(ex) {
                        this.lastError = ex;
                        return t;
                    }
                }
                return ev.time;
            },

            /**
             * stopPropagation와 preventDefault에 대해 수행하는 method
             * @method stopEvent
             * @param {Event} ev the event
             * @static
             */
            stopEvent: function(ev) {
                this.stopPropagation(ev);
                this.preventDefault(ev);
            },

            /**
             * event 확대를 중지한다.
             * @method stopPropagation
             * @param {Event} ev the event
             * @static
             */
            stopPropagation: function(ev) {
                if (ev.stopPropagation) {
                    ev.stopPropagation();
                } else {
                    ev.cancelBubble = true;
                }
            },

            /**
             * event의 기본 동작을 방지한다.
             * @method preventDefault
             * @param {Event} ev the event
             * @static
             */
            preventDefault: function(ev) {
                if (ev.preventDefault) {
                    ev.preventDefault();
                } else {
                    ev.returnValue = false;
                }
            },

            /**
             * window object나 caller의 argument 혹은 callstack에서의 또 다른
             * method의 argument에서 event를 찾는다.
             * 이것은 event 매니저를 통해 등록된 event들을 위해 자동으로 실행된다.
             * 그리고 implementer는 일반적으로 전혀 이 함수를 실행할 필요가 없다.
             * @method getEvent
             * @param {Event} e handler로부터의 event parameter
             * @param {HTMLElement} boundEl listener가 첨부될 element
             * @return {Event} the event
             * @static
             */
            getEvent: function(e, boundEl) {
                var ev = e || window.event;
                if (!ev) {
                    var c = this.getEvent.caller;
                    while (c) {
                        ev = c.arguments[0];
                        if (ev && Event == ev.constructor) {
                            break;
                        }
                        c = c.caller;
                    }
                }
                if(!ev.target)
                    ev.target = ev.srcElement;
                return ev;
            },

            /**
             * event를 위한 문자코드를 반환한다.
             * @method getCharCode
             * @param {Event} ev the event
             * @return {int} event의 문자코드
             * @static
             */
            getCharCode: function(ev) {
                var code = ev.keyCode || ev.charCode || 0;
                // webkit key normalization
                if (Rui.browser.webkit && (code in webkitKeymap)) {
                    code = webkitKeymap[code];
                }
                return code;
            },

            /**
             * specialkey 여부를 리턴한다.
             * @method isSpecialKey
             * @param {Event} ev the event
             * @return {boolean}
             * @static
             */
            isSpecialKey: function(e) {
                if(e.type == 'keypress' && e.ctrlKey) return true;
                var KEY = Rui.util.LKey.KEY;
                for (k in KEY) {
                    if(KEY[k] == e.keyCode) return true;
                }
                return false;
            },

            /**
             * navKey 여부를 리턴한다.
             * @method isNavKey
             * @param {Event} ev the event
             * @return {boolean}
             * @static
             */
            isNavKey: function(e) {
                var KEY = Rui.util.LKey.NAVKEY;
                for (k in KEY) {
                    if(KEY[k] == e.keyCode) return true;
                }
                return false;
            },

            /**
             * 함수 참조에 의해 저장된 event handler 데이터를 찾는다.
             * @method _getCacheIndex
             * @static
             * @private
             */
            _getCacheIndex: function(el, sType, fn) {
                for (var i=0, l=listeners.length; i<l; i=i+1) {
                    var li = listeners[i];
                    if ( li                 &&
                         li[this.FN] == fn  &&
                         li[this.EL] == el  &&
                         li[this.TYPE] == sType ) {
                        return i;
                    }
                }

                return -1;
            },

            /**
             * element가 이미 ID가 없는 경우 element에 대한 유일한 ID를 생성한다.
             * @method generateId
             * @param el id를 생성할 element
             * @return {string} element의 결과 id
             * @static
             */
            generateId: function(el) {
                var id = el.id;

                if (!id) {
                    id = 'Ruievtautoid-' + counter;
                    ++counter;
                    el.id = id;
                }

                return id;
            },


            /**
             * 우리는 event 그룹에 첨부할 collection으로서 getElementsByTagName을
             * 사용하고 싶어 한다.
             * 불행하게도, 다른 브라우저들은 다른 collection의 타입을 반환한다.
             * 이 함수는 object가 배열화 되어 있는 경우를 결정하기 위해 테스트한다.
             * 이것은 또한 object가 array이지만, 비어있는 경우 fail이 될 것이다.
             * @method _isValidCollection
             * @param o 테스트할 object
             * @return {boolean} 만약 object가 배열화 되어 있고, 존재한다면 true
             * @static
             * @private
             */
            _isValidCollection: function(o) {
                try {
                    return ( o                     && // o is something
                             typeof o !== 'string' && // o is not a string
                             o.length              && // o is indexed
                             !o.tagName            && // o is not an HTML element
                             !o.alert              && // o is not a window
                             typeof o[0] !== 'undefined' );
                } catch(ex) {
                    return false;
                }

            },

            /**
             * @private
             * @property elCache
             * DOM element cache
             * @static
             * @deprecated element가 제거되거나 다시 추가될때 발생하는 문제로 인하여
             * element들은 캐시되지 않는다.
             */
            elCache: {},

            /**
             * unload event가 발생할 때, 더이상 document.getElementById를
             * 사용하지 못하므로 id로 바인딩 되는 element들을 캐시한다.
             * @method getEl
             * @static
             * @private
             * @deprecated element들은 더 이상 캐시되지 않는다.
             */
            getEl: function(id) {
                return (typeof id === 'string') ? document.getElementById(id) : id;
            },

            /**
             * dom을 처음 사용할때 발생하는 custom event
             * @event DOMReadyEvent
             */
            DOMReadyEvent: new Rui.util.LCustomEvent('DOMReady', this),

            /**
             * deferred listener들에 연결한다.
             * @method _load
             * @static
             * @private
             */
            _load: function(e) {

                if (!loadComplete) {
                    loadComplete = true;
                    var EU = Rui.util.LEvent;

                    // Just in case DOMReady did not go off for some reason
                    EU._ready();

                    // Available elements may not have been detected before the
                    // window load event fires. Try to find them now so that the
                    // the user is more likely to get the onAvailable notifications
                    // before the window load notification
                    EU._tryPreloadAttach();

                }
            },

            /**
             * document가 사용가능한 처음 시점에 DOMReady event listener들을 발생시킨다.
             * @method _ready
             * @static
             * @private
             */
            _ready: function(e) {
                var EU = Rui.util.LEvent;
                if (!EU.DOMReady) {
                    EU.DOMReady=true;

                    // Fire the content ready custom event
                    //try{
                        EU.DOMReadyEvent.fire();
                        // Remove the DOMContentLoaded (FF/Opera)
                        EU._simpleRemove(document, 'DOMContentLoaded', EU._ready);
                        /*
                    } catch(e1) {
                        //Rui.log(e1.message, 'error');
                        //Rui.log(Rui.dump(e1), 'error');
                        EU.showErrorMessage(e1);
                        throw e1;
                    }*/
                }
            },

            showErrorMessage: function(e1, fnName) {
                var isDebugNotice = true;
                if(Rui.getConfig) {
                    var isNotice = Rui.getConfig().getFirst('$.core.debug.notice');
                    isDebugNotice = Rui.isEmpty(isNotice) ? isDebugNotice : isNotice;
                }
                if(isDebugNotice == true) {
                    var stack = '' + e1.stack;
                    stack = stack.split('(http').join('<br>(http');
                    var errorMessage = (!Rui.browser.msie ? ((e1.fileName || '') + '[' + (e1.lineNumber || e1.number) + '] \r\n' + stack): fnName) + e1.message;
                    var dnDom = null;
                    if(!document.body.duNotice) {
                        dnDom = document.createElement('div');
                        dnDom.className = 'L-notice';
                        document.body.appendChild(dnDom);
                        document.body.duNotice = dnDom;
                        // rui_base에 해당되므로 css가 아닌 style로 처리
                        dnDom.style.position = 'absolute';
                        dnDom.style.top = '10px';
                        dnDom.style.right = '10px';
                        dnDom.style.width = '1px';
                        dnDom.style.height = '1px';
                        dnDom.style.zIndex = 10000;
                        dnDom.style.backgroundColor = 'orange';
                        dnDom.style.border = '2px solid black';
                        dnDom.style.padding = '1px 1px';
                        dnDom.style.color = 'red';
                        dnDom.style.fontWeight = 'bold';
                        dnDom.style.overflow = 'hidden';
                        Rui.util.LEvent.addListener(dnDom, 'click', function(e){
                            if(dnDom.style.width == '90%') {
                                dnDom.style.width = '1px';
                                dnDom.style.height = '1px';
                            } else {
                                dnDom.style.width = '90%';
                                dnDom.style.height = 'auto';
                            }
                        });
                    } else {
                        dnDom = document.body.duNotice;
                    }
                    dnDom.style.display = '';
                    dnDom.innerHTML = 'PAGE ERROR: ' + errorMessage;
                }
            },

            /**
             * DOM 노드들이 사용할 수 있는대로 연결 시도를 하는 onload event가
             * 발생하기 전에 실행되는 polling 함수
             * @method _tryPreloadAttach
             * @static
             * @private
             */
            _tryPreloadAttach: function() {

                if (onAvailStack.length === 0) {
                    retryCount = 0;
                    clearInterval(this._interval);
                    this._interval = null;
                    return;
                }

                if (this.locked) {
                    return;
                }

                if (this.isIE) {
                    // Hold off if DOMReady has not fired and check current
                    // readyState to protect against the IE operation aborted
                    // issue.
                    if (!this.DOMReady) {
                        this.startInterval();
                        return;
                    }
                }

                this.locked = true;


                // keep trying until after the page is loaded.  We need to
                // check the page load state prior to trying to bind the
                // elements so that we can be certain all elements have been
                // tested appropriately
                var tryAgain = !loadComplete;
                if (!tryAgain) {
                    tryAgain = (retryCount > 0 && onAvailStack.length > 0);
                }

                // onAvailable
                var notAvail = [];

                var executeItem = function (el, item) {
                    var scope = el;
                    if (item.override) {
                        if (item.override === true) {
                            scope = item.obj;
                        } else {
                            scope = item.override;
                        }
                    }
                    item.fn.call(scope, item.obj);
                };

                var i, len, item, el, ready=[];

                // onAvailable onContentReady
                for (i=0, len=onAvailStack.length; i<len; i=i+1) {
                    item = onAvailStack[i];
                    if (item) {
                        el = this.getEl(item.id);
                        if (el) {
                            if (item.checkReady) {
                                if (loadComplete || el.nextSibling || !tryAgain) {
                                    ready.push(item);
                                    onAvailStack[i] = null;
                                }
                            } else {
                                executeItem(el, item);
                                onAvailStack[i] = null;
                            }
                        } else {
                            notAvail.push(item);
                        }
                    }
                }

                // make sure onContentReady fires after onAvailable
                for (i=0, len=ready.length; i<len; i=i+1) {
                    item = ready[i];
                    executeItem(this.getEl(item.id), item);
                }


                retryCount--;

                if (tryAgain) {
                    for (i=onAvailStack.length-1; i>-1; i--) {
                        item = onAvailStack[i];
                        if (!item || !item.id) {
                            onAvailStack.splice(i, 1);
                        }
                    }

                    this.startInterval();
                } else {
                    clearInterval(this._interval);
                    this._interval = null;
                }

                this.locked = false;

            },

            /**
             * addListener를 통해 주어진 element에 연결된 모든 listener를 제거한다.
             * 부가적으로 노드의 chidren도 제거될 수 있다.
             * 또한 삭제될 event의 특정 타입을 명시할 수 있다.
             * @method purgeElement
             * @param {HTMLElement} el 제거할 element
             * @param {boolean} recurse element의 children을 재귀적으로 제거한다.
             *                  주의해서 사용해야 한다.
             * @param {string} sType 제거할 listener의 optional 타입.
             *                 남겨둘 경우, 모든 listener들이 삭제될 것이다.
             * @static
             */
            purgeElement: function(el, recurse, sType) {
                var oEl = (Rui.isString(el)) ? this.getEl(el) : el;
                var elListeners = this.getListeners(oEl, sType), i, len;
                if (elListeners) {
                    for (i=elListeners.length-1; i>-1; i--) {
                        var l = elListeners[i];
                        this._removeListener(oEl, l.type, l.fn, l.capture);
                    }
                }

                if (recurse && oEl && oEl.childNodes) {
                    for (i=0,len=oEl.childNodes.length; i<len ; ++i) {
                        this.purgeElement(oEl.childNodes[i], recurse, sType);
                    }
                }
            },

            /**
             * addListener를 통해 주어진 element에 연결된 모든 listener를 반환한다.
             * 부가적으로 반환될 event의 특정 타입을 명시할 수 있다.
             * @method getListeners
             * @param {HTMLElement|string} el 검사할 element나 element id
             * @param {string} sType 반환할 listener의 optional 타입.
             *                 남겨둘 경우, 모든 listener들이 반환될 것이다.
             * @return {Object} listener. 다음 필드들을 포함한다:
             * &nbsp;&nbsp;type:   (string)   event의 타입
             * &nbsp;&nbsp;fn:     (function) addListener에 제공되는 callback
             * &nbsp;&nbsp;obj:    (object)   addListener에 제공되는 custom object
             * &nbsp;&nbsp;adjust: (boolean|object)  기본 scope를 조절할지에 대한 여부
             * &nbsp;&nbsp;scope: (boolean)  조절된 papameter를 기본으로 하는 파생된 scope
             * &nbsp;&nbsp;scope: (capture)  addListener에 제공되는 capture parameter
             * &nbsp;&nbsp;index:  (int)     event util listener 캐시에서의 위치
             * @static
             */
            getListeners: function(el, sType) {
                var results=[], searchLists;
                if (!sType) {
                    searchLists = [listeners, unloadListeners];
                } else if (sType === 'unload') {
                    searchLists = [unloadListeners];
                } else {
                    searchLists = [listeners];
                }

                var oEl = (Rui.isString(el)) ? this.getEl(el) : el;

                for (var j=0;j<searchLists.length; j=j+1) {
                    var searchList = searchLists[j];
                    if (searchList) {
                        for (var i=0,len=searchList.length; i<len ; ++i) {
                            var l = searchList[i];
                            if ( l  && l[this.EL] === oEl &&
                                    (!sType || sType === l[this.TYPE]) ) {
                                results.push({
                                    type:   l[this.TYPE],
                                    fn:     l[this.FN],
                                    obj:    l[this.OBJ],
                                    adjust: l[this.OVERRIDE],
                                    scope:  l[this.ADJ_SCOPE],
                                    capture:  l[this.CAPTURE],
                                    index:  i
                                });
                            }
                        }
                    }
                }

                return (results.length) ? results : null;
            },

            /**
             * pe.event에 의해 등록된 모든 listener를 삭제한다.
             * unload event 동안 자동적으로 호출된다.
             * @method _unload
             * @static
             * @private
             */
            _unload: function(e) {
                var EU = Rui.util.LEvent, i, j, l, len,
//                    index,
                    ul = unloadListeners.slice();

                // execute and clear stored unload listeners
                for (i=0,len=unloadListeners.length; i<len; ++i) {
                    l = ul[i];
                    if (l) {
                        var scope = window;
                        if (l[EU.ADJ_SCOPE]) {
                            if (l[EU.ADJ_SCOPE] === true) {
                                scope = l[EU.UNLOAD_OBJ];
                            } else {
                                scope = l[EU.ADJ_SCOPE];
                            }
                        }

                        l[EU.FN].call(scope, EU.getEvent(e, l[EU.EL]), l[EU.UNLOAD_OBJ] );
                        ul[i] = null;
                        l=null;
                        scope=null;
                    }
                }

                unloadListeners = null;

                // Remove listeners to handle IE memory leaks
                //if (Rui.browser.msie && listeners && listeners.length > 0) {

                // 2.5.0 listeners are removed for all browsers again.  FireFox preserves
                // at least some listeners between page refreshes, potentially causing
                // errors during page load (mouseover listeners firing before they
                // should if the user moves the mouse at the correct moment).
                if (listeners) {
                    for (j=listeners.length-1; j>-1; j--) {
                        l = listeners[j];
                        if (l) {
                            EU._removeListener(l[EU.EL], l[EU.TYPE], l[EU.FN], l[EU.CAPTURE], j);
                        }
                    }
                    l=null;
                }

                legacyEvents = null;

                EU._simpleRemove(window, 'unload', EU._unload);

            },

            /**
             * scrollLeft를 반환한다.
             * @method _getScrollLeft
             * @static
             * @private
             */
            _getScrollLeft: function() {
                return this._getScroll()[1];
            },

            /**
             * scrollTop을 반환한다.
             * @method _getScrollTop
             * @static
             * @private
             */
            _getScrollTop: function() {
                return this._getScroll()[0];
            },

            /**
             * scrollTop과 scrollLeft를 반환한다.
             * Internet Explorer 브라우저에서 pageX와 pageY를 계산하기 위하여 사용된다.
             * @method _getScroll
             * @static
             * @private
             */
            _getScroll: function() {
                var dd = document.documentElement, db = document.body;
                if (dd && (dd.scrollTop || dd.scrollLeft)) {
                    return [dd.scrollTop, dd.scrollLeft];
                } else if (db) {
                    return [db.scrollTop, db.scrollLeft];
                } else {
                    return [0, 0];
                }
            },

            getStack: function() {
            	var stack = '';
            	try {
            		throw new Error('stack trace');
            	} catch(e) {
                    stack = '' + e.stack;
                    stack = stack.split('(http').join('<br>(http');
            	}
            	return stack;
            },

            /**
             * 캐싱, cleanup, scope 조정 등을 거치지 않고 직접 DOM event를 추가한다.
             *
             * @method _simpleAdd
             * @param {HTMLElement} el      handler에 바인드할 element
             * @param {string}      sType   event handler의 타입
             * @param {function}    fn      수행할 callback
             * @param {boolen}      capture capture or bubble phase
             * @static
             * @private
             */
            _simpleAdd: function () {
                if (window.addEventListener) {
                    return function(el, sType, fn, capture) {
                        if (sType == 'mouseenter') {
                            fn = Rui.util.LFunction.createInterceptor(fn, checkRelatedTarget);
                            el.addEventListener('mouseover', fn, (capture));
                        } else if (sType == 'mouseleave') {
                            fn = Rui.util.LFunction.createInterceptor(fn, checkRelatedTarget);
                            el.addEventListener('mouseout', fn, (capture));
                        } else {
                            el.addEventListener(sType, fn, (capture));
                        }
                    };
                } else if (window.attachEvent) {
                    return function(el, sType, fn, capture) {
                        el.attachEvent('on' + sType, fn);
                    };
                } else {
                    return function(){};
                }
            }(),

            /**
             * 기본적인 listener 삭제
             *
             * @method _simpleRemove
             * @param {HTMLElement} el      handler에 바인드될 element
             * @param {string}      sType   event handler의 타입
             * @param {function}    fn      수행할 callback
             * @param {boolen}      capture capture or bubble phase
             * @static
             * @private
             */
            _simpleRemove: function() {
                if (window.removeEventListener) {
                    return function (el, sType, fn, capture) {
                        if (sType == 'mouseenter') {
                            sType = 'mouseover';
                        } else if (sType == 'mouseleave') {
                            sType = 'mouseout';
                        }
                        el.removeEventListener(sType, fn, (capture));
                    };
                } else if (window.detachEvent) {
                    return function (el, sType, fn) {
                        el.detachEvent('on' + sType, fn);
                    };
                } else {
                    return function(){};
                }
            }()
        };

        function checkRelatedTarget(e) {
            var related = e.relatedTarget,
                isXulEl = Object.prototype.toString.apply(related) == '[object XULElement]';
            if (!related) return false;
            return (!isXulEl && related != this && this.tag != 'document' && !elContains(this, related));
        }

        function elContains(parent, child) {
            while (child) {
                if(child === parent) {
                    return true;
                }
                try {
                    child = child.parentNode;
                } catch(e) {
                    // In FF if you mouseout an text input element
                    // thats inside a div sometimes it randomly throws
                    // Permission denied to get property HTMLDivElement.parentNode
                    // See https://bugzilla.mozilla.org/show_bug.cgi?id=208427
                    return false;
                }
                if(child && (child.nodeType != 1)) {
                    child = null;
                }
            }
            return false;
        }

    }();

    (function() {
        var EU = Rui.util.LEvent;

        /**
         * Rui.util.LEvent.on는 addListener를 위한 alias이다.
         * @method on
         * @static
         * @param {String|HTMLElement|Array|NodeList} el listener에 할당할 id나
         *  element reference 혹은 id나 element들의 collection.
         * @param {String}   sType     추가할 event의 타입
         * @param {Function} fn        event가 수행하는 method
         * @param {Object}   obj    handler에 parameter로서 전달될 임의의 object
         * @param {Boolean|object}  override  true일 결우, obj가 listener의 실행 scope가 된다.
         *                             object일 경우, object가 실행 scope가 된다.
         * @param {boolen}      capture capture or bubble phase
         * @return {boolean} action이 성공이거나 defred일 경우 true,
         *                        하나 혹은 그 이상의 element들이 첨부된 listener를 가질
         *                        수 없었거나 operation에서 exception이 발생했을 경우 false.
         * @see addListener
         */
        EU.on = EU.addListener;

        /**
         * Rui.util.LEvent.onFocus는 addFocusListener 위한 alias이다.
         * @method onFocus
         * @static
         * @param {String|HTMLElement|Array|NodeList} el listener에 할당할 id나
         *  element reference 혹은 id나 element들의 collection.
         * @param {Function} fn        event가 수행하는 method
         * @param {Object}   obj    handler에 parameter로서 전달될 임의의 object
         * @param {Boolean|object}  override  true일 결우, obj가 listener의 실행 scope가 된다.
         *                             object일 경우, object가 실행 scope가 된다.
         * @return {boolean} action이 성공이거나 defred일 경우 true,
         *                        하나 혹은 그 이상의 element들이 첨부된 listener를 가질
         *                        수 없었거나 operation에서 exception이 발생했을 경우 false.
         * @see addFocusListener
         */
        EU.onFocus = EU.addFocusListener;

        /**
         * Rui.util.LEvent.onBlur is an alias for addBlurListener
         * Rui.util.LEvent.onBlur는 addBlurListener 위한 alias이다.
         * @method onBlur
         * @static
         * @param {String|HTMLElement|Array|NodeList} el listener에 할당할 id나
         *  element reference 혹은 id나 element들의 collection.
         * @param {Function} fn        event가 수행하는 method
         * @param {Object}   obj    handler에 parameter로서 전달될 임의의 object
         * @param {Boolean|object}  override  true일 결우, obj가 listener의 실행 scope가 된다.
         *                             object일 경우, object가 실행 scope가 된다.
         * @return {boolean} action이 성공이거나 defred일 경우 true,
         *                        하나 혹은 그 이상의 element들이 첨부된 listener를 가질
         *                        수 없었거나 operation에서 exception이 발생했을 경우 false.
         * @see addBlurListener
         */
        EU.onBlur = EU.addBlurListener;

/*! DOMReady: based on work by: Dean Edwards/John Resig/Matthias Miller */

        // Internet Explorer: use the readyState of a defered script.
        // This isolates what appears to be a safe moment to manipulate
        // the DOM prior to when the document's readyState suggests
        // it is safe to do so.
        if (EU.isIE) {
            if (self !== self.top) {
                document.onreadystatechange = function(){
                    if (document.readyState == 'complete') {
                        document.onreadystatechange = null;
                        EU._ready();
                    }
                };
            }
            else {
                // Process onAvailable/onContentReady items when the
                // DOM is ready.
                Rui.util.LEvent.onDOMReady(
                        Rui.util.LEvent._tryPreloadAttach,
                        Rui.util.LEvent, true);

                var n = document.createElement('p');

                EU._dri = setInterval(function() {
                    try {
                        // throws an error if doc is not ready
                        n.doScroll('left');
                        clearInterval(EU._dri);
                        EU._dri = null;
                        EU._ready();
                        n = null;
                    } catch (ex) {
                    }
                }, EU.POLL_INTERVAL);
            }

        // The document's readyState in Safari currently will
        // change to loaded/complete before images are loaded.
        } else if (EU.webkit && EU.webkit < 525) {

            EU._dri = setInterval(function() {
                var rs=document.readyState;
                if ('loaded' == rs || 'complete' == rs) {
                    clearInterval(EU._dri);
                    EU._dri = null;
                    EU._ready();
                }
            }, EU.POLL_INTERVAL);

        // FireFox and Opera: These browsers provide a event for this
        // moment.  The latest WebKit releases now support this event.
        } else {
            EU._simpleAdd(document, 'DOMContentLoaded', EU._ready);
        }
        /////////////////////////////////////////////////////////////
        EU._simpleAdd(window, 'load', EU._load);
        EU._simpleAdd(window, 'unload', EU._unload);
        EU._simpleAdd((Rui.browser.msie ? document : window), 'keydown', function(e){
            if(e.keyCode == 123 && e.ctrlKey && e.shiftKey) {
                var ruiPath = Rui.getConfig().getFirst('$.core.contextPath') + Rui.getConfig().getFirst('$.core.ruiRootPath');
                Rui.debugWin = window.open(ruiPath + '/plugins/debug/console.html', 'DevOnConsole');
                Rui.debugWin.focus();
            }
        });
        EU._tryPreloadAttach();
        
        EU.addListener(window, 'blur', function() {
            window.isRuiBlur = true;
        });
        
        EU.addListener(window, 'focus', function() {
            window.isRuiBlur = false;
        });
    })();
}
/**
 * Connection Manager는 XMLHttpRequest object로의 단순화된 인터페이스를 제공한다.
 * 그리고 Connnection Manager는 XMLHttpRequest의 cross-browser의 인스턴스화,
 * 양방향의 상태값과 서버 response에 대한 처리,
 * 사용자가 만든 미리 정의된 callback으로의 결과 반환 등을 처리한다.
 * @namespace Rui
 * @module core
 * @requires Rui
 * @requires event
 */

/**
 * Connection Manager singleton 패턴은 비동기화 transaction들을 만들고 관리하기 위한 method를 제공한다.
 * 기본적으로 ajax 호출은 Rui.ajax로 호출하고 내부 콤포넌트 및 request 헤더값을 제어할 때는 제외하면 이 객체는 바로 사용하지 않는다. 
 * @namespace Rui
 * @class LConnect
 * @sample default
 * @static
 */
Rui.LConnect = {
    /**
     * @description XMLHttpRequest를 위한 MSFT ActiveX id들의 Array
     * @property _msxml_progid
     * @private
     * @static
     * @type array
     */
    _msxml_progid: [
        'Microsoft.XMLHTTP',
        'MSXML2.XMLHTTP.3.0',
        'MSXML2.XMLHTTP'
    ],
    /**
     * @description HTTP header의 object literal
     * @property _http_header
     * @private
     * @static
     * @type object
     */
    _http_headers: {},
    /**
     * @description HTTP header들이 설정되어 있는지 결정한다.
     * @property _has_http_headers
     * @private
     * @static
     * @type boolean
     */
    _has_http_headers: false,
    /**
     * @description POST transaction들을 위한 client들의 HTTP header 전송시에 
     * 'application/x-www-form-urlencoded' content-type을 기본 header로 추가할 것인지에 대해 결정한다.
     * @property _use_default_post_header
     * @private
     * @static
     * @type boolean
     */
    _use_default_post_header: true,
    /**
     * @description POST transaction에서 사용되는 기본 header
     * @property _default_post_header
     * @private
     * @static
     * @type boolean
     */
    _default_post_header: 'application/x-www-form-urlencoded; charset=UTF-8',
    /**
     * @description HTML form 사용을 포함하는 transaction에서 사용되는 기본 header
     * @property _default_form_header
     * @private
     * @static
     * @type boolean
     */
    _default_form_header: 'application/x-www-form-urlencoded',
    /**
     * @description 각 transaction에 'X-Requested-With: XMLHttpRequest'을 기본 header로 추가할지 결정한다.
     * @property _use_default_xhr_header
     * @private
     * @static
     * @type boolean
     */
    _use_default_xhr_header: true,
    /**
     * @description 'X-Requested-With'에 대한 기본 header 값.
     * 이것은 기본적으로 Rui Connection Manager에 의해 만들어진 request를 확인하기 위한 각각의 트랜잭션과 함께 전송된다.
     * @property _default_xhr_header
     * @private
     * @static
     * @type boolean
     */
    _default_xhr_header: 'XMLHttpRequest',
    /**
     * @description 각 transaction에 대해 custom, default header를 설정할지 결정한다.
     * @property _has_default_headers
     * @private
     * @static
     * @type boolean
     */
    _has_default_headers: true,
    /**
     * @description 각 transaction에 대해 custom, default header를 설정할지 결정한다.
     * @property _has_default_header
     * @private
     * @static
     * @type boolean
     */
    _default_headers: {},
    /**
     * @description HTML form에 의해 데이터가 submit 되어야할지 결정하기 위해
     * setForm()에 의해 변경되는 property.
     * @property _isFormSubmit
     * @private
     * @static
     * @type boolean
     */
    _isFormSubmit: false,
    /**
     * @description 원하는 action이 파일업로드일 경우, HTML form node로의 참조를 설정하기 위해 
     * serForm()에 의해 변경되는 property. 
     * @property _formNode
     * @private
     * @static
     * @type object
     */
    _formNode: null,
    /**
     * @description 각 transaction에 대한 HTML form 데이터를 설정하기 위해
     * serForm()에 의해 변경되는 property. 
     * @property _sFormData
     * @private
     * @static
     * @type string
     */
    _sFormData: '',
    /**
     * @description handleReadyState 상태에서 polling 메커니즘으로의 polling 참조 collection.
     * @property _poll
     * @private
     * @static
     * @type object
     */
    _poll: {},
    /**
     * @description 정의된 timeout value를 가지고 있는 각 transaction callback을 위한 timeput값의 queue
     * @property _timeOut
     * @private
     * @static
     * @type object
     */
    _timeOut: {},
    /**
     * @description transaction의 XHR readyState를 결정하기 위한 시도를 할 때 
     * HandleReadyState 상태를 위한 milliseconds 단위의 polling 빈도수
     * 기본값은 50 milliseconds 이다.
     * @property _polling_interval
     * @private
     * @static
     * @type int
     */
    _polling_interval: 50,
    /**
     * @description 각 transaction에 대한 transaction id의 증가가 되는 transaction counter.
     * @property _transaction_id
     * @private
     * @static
     * @type int
     */
    _transaction_id: 0,
    /**
     * @description Rui.util.LEvent가 가능하고, HTML form에서 여러 개의 submit 버튼이 존재할 경우
     * 'clicked' submit 버튼의 name-value pair에 대한 트랙들.
     * @property _submitElementValue
     * @private
     * @static
     * @type string
     */
    _submitElementValue: null,
    /**
     * @description Rui.util.LEvent가 가능한지 결정해서 true or false를 반환한다.
     * 만약 true면, eventlistener는 'Submit'의 target 타입으로 결정한 
     * 클릭 event를 trap 하기 위한 dcoument level에 바인딩 된다.
     * 이 listener는 HTML form에서 여러 submit 버튼의 클릭된 'Submit' 값을 
     * 결정하기 위한 setForm()을 활성화 할 것이다.
     * @property _hasSubmitListener
     * @private
     * @static
     */
    _hasSubmitListener: (function(){
        if(Rui.util.LEvent){
            Rui.util.LEvent.addListener(document, 'click', function(e){
                var obj = Rui.util.LEvent.getTarget(e);
                if(obj.nodeName.toLowerCase() == 'input' && (obj.type && obj.type.toLowerCase() == 'submit')){
                    Rui.LConnect._submitElementValue = encodeURIComponent(obj.name) + '=' + encodeURIComponent(obj.value);
                }
            });
            return true;
        }
        return false;
    })(),
     /**
      * @description transaction의 시작에서 발생시키는 custom event
      * @property startEvent
      * @private
      * @static
      * @type LCustomEvent
      */
    startEvent: new Rui.util.LCustomEvent('start'),
    /**
     * @description transaction rseponse가 완료되었을때 발생시키는 custom event
     * @property completeEvent
     * @private
     * @static
     * @type LCustomEvent
     */
    completeEvent: new Rui.util.LCustomEvent('complete'),
    /**
     * @description handleTransactionResponse() method가 HTTP 2xx range에서 
     * response를 결정할 때 발생시키는 custom enevt
     * @property successEvent
     * @private
     * @static
     * @type LCustomEvent
     */
    successEvent: new Rui.util.LCustomEvent('success'),
    /**
     * @description handleTransactionResponse() method가 HTTP 4xx/5xx range에서 
     * response를 결정할 때 발생시키는 custom enevt
     * @property failureEvent
     * @private
     * @static
     * @type LCustomEvent
     */
    failureEvent: new Rui.util.LCustomEvent('failure'),
    /**
     * @description handleTransactionResponse() method가 HTTP 4xx/5xx range에서 
     * response를 결정할 때 발생시키는 custom enevt
     * @property uploadEvent
     * @private
     * @static
     * @type LCustomEvent
     */
    uploadEvent: new Rui.util.LCustomEvent('upload'),
    /**
     * @description transaction이 성공적으로 aborted 됐을 때 발생시키는 custom event.
     * @property abortEvent
     * @private
     * @static
     * @type LCustomEvent
     */
    abortEvent: new Rui.util.LCustomEvent('abort'),
    /**
     * @description callback custom event들을 특정 event name에 mapping하는 참조 테이블
     * @property _customEvents
     * @private
     * @static
     * @type object
     */
    _customEvents: {
        onStart:['startEvent', 'start'],
        onComplete:['completeEvent', 'complete'],
        onSuccess:['successEvent', 'success'],
        onFailure:['failureEvent', 'failure'],
        onUpload:['uploadEvent', 'upload'],
        onAbort:['abortEvent', 'abort']
    },
    /**
     * @description 기존 xml_progid array에 ActiveX id를 추가하기 위한 member.
     * 새로 소개된 ActiveX id event에서 이것은 내부적인 코드 수정없이 추가될 수 있다. 
     * @method setProgId
     * @private
     * @static
     * @param {string} id XHR object를 초기화하기 위하여 추가될 ActiveX id
     * @return {void}
     */
    setProgId: function(id){
        this._msxml_progid.unshift(id);
    },
    /**
     * @description 기본 POST header를 override 하기 위한 member.
     * @method setDefaultPostHeader
     * @public
     * @static
     * @param {boolean} b default header를 설정하고 사용함. - true or false
     * @return {void}
     */
    setDefaultPostHeader: function(b){
        if(typeof b == 'string'){
            this._default_post_header = b;
        }else if(typeof b == 'boolean'){
            this._use_default_post_header = b;
        }
    },
    /**
     * @description 기본 transaction header를 override 하기 위한 member.
     * @method setDefaultXhrHeader
     * @public
     * @static
     * @param {boolean} b default header를 설정하고 사용함. - true or false
     * @return {void}
     */
    setDefaultXhrHeader: function(b){
        if(typeof b == 'string'){
            this._default_xhr_header = b;
        }else{
            this._use_default_xhr_header = b;
        }
    },
    /**
     * @description 기본 polling 간격을 변경하기 위한 member.
     * @method setPollingInterval
     * @public
     * @static
     * @param {int} i milliseconds 단위의 polling 간격
     * @return {void}
     */
    setPollingInterval: function(i){
        if(typeof i == 'number' && isFinite(i)){
            this._polling_interval = i;
        }
    },
    /**
     * @description XMLHttpRequest object를 인스턴스화 하고, 2개의 property와 같이 반환한다:
     * XMLHttpRequest instance와 transaction id.
     * @method createXhrObject
     * @private
     * @static
     * @param {int} transactionId 해당 transaction을 위하여 transaction id를 포함하고 있는 property
     * @return {object} xhr
     */
    createXhrObject: function(transactionId){
        var http;
        if(window.XMLHttpRequest){
            //IE7의 경우 XMLHttpRequest를 사용하면 memory leak이 발생된다.
            if(Rui.browser.msie && window.ActiveXObject){
                http = this.createMSXhrObject();
                if(Rui.isDebugDE)
                    Rui.log('createMSXhrObject 1', 'debug', 'Rui.LConnect');
            }else{
                // Instantiates XMLHttpRequest in non-IE browsers and assigns to http.
                http = new XMLHttpRequest();
                if(Rui.isDebugDE)
                    Rui.log('XMLHttpRequest', 'debug', 'Rui.LConnect');
            }
        }else{
            // Instantiates XMLHttpRequest for IE and assign to http
            http = this.createMSXhrObject();
            if(Rui.isDebugDE)
                Rui.log('createMSXhrObject 2', 'debug', 'Rui.LConnect');
        }
        //  Object literal with http and tId properties
        return { conn: http, tId: transactionId };
    },
    /**
     * @description IE의 ActiveXObject의 xhr object를 인스턴스화한다.
     * @method createMSXhrObject
     * @private
     * @static
     * @return {object} xhr
     */
    createMSXhrObject: function(){
        for (var i=0; i < this._msxml_progid.length; ++i){
            try{
                // Instantiates XMLHttpRequest for IE and assign to http
                return new ActiveXObject(this._msxml_progid[i]);
            }catch(e){}
        }
    },
    /**
     * @description 본 method는 transaction에서의 valid connection object를 
     * 생성하기 위한 asyncRequest에 의해 호출된다.
     * 이것은 또한 transaction id를 전달하고. transaction id counter를 증가시킨다.
     * @method getConnectionObject
     * @private
     * @static
     * @return {object}
     */
    getConnectionObject: function(isFileUpload, crossDomain){
        var o;
        var tId = this._transaction_id;
        try{
            if(!isFileUpload && !crossDomain){
                o = this.createXhrObject(tId);
            } else {
                o = {};
                o.tId = tId;
                o.isUpload = true;
                if (crossDomain) {
                    o.crossDomain = true;
                    o.conn = document.createElement('script');
                    o.conn.id = 'conn_' + tId;
                    o.conn.type = 'text/javascript';
                }
            }
            if(o){
                this._transaction_id++;
            }
        }catch(e){}
        return o;
    },
    /**
     * @description ajax connection 객체를 open한다.
     * @method openConnection
     * @private
     * @static
     * @return {void}
     */
    openConnection: function(o, method, uri, async){
        o.conn.open(method, uri, async);
    },
    /**
     * @description XHR object를 통한 비동기 request를 초기화 하기 위한 method.
     * @method ajaxRequest
     * @private
     * @static
     * @param {string} method HTTP transaction method
     * @param {string} uri 확실히 검증된 resource의 경로
     * @param {callback} callback 사용자 정의된 callback 함수나 object
     * @param {string|object} postData POST body
     * @param {object} config config
     * @return {object} connection object를 반환
     */
    ajaxRequest: function(method, uri, callback, postData, config){
    	config = config || {};
        var fileUpload = config && config.isFileUpload === true;
        var crossDomain = config && config.crossDomain === true;
        
        var o = this.getConnectionObject(fileUpload, crossDomain);
        var args = (callback && callback.argument) ? callback.argument : null;
        //params object일 경우도 있음.
        if (postData && typeof postData == 'object') {
            postData = Rui.util.LObject.serialize(postData);
        }

        if(!o){
            return null;
        }else{
            var isPost = (method.toUpperCase() != 'GET'); 
            // Intialize any transaction-specific custom events, if provided.
            if(callback && callback.customevents){
                this.initCustomEvents(o, callback);
            }

            if(this._isFormSubmit){
                if(fileUpload){
                    this.uploadFile(o, callback, uri, postData);
                    return o;
                }

                // If the specified HTTP method is GET, setForm() will return an
                // encoded string that is concatenated to the uri to
                // create a querystring.
                if(!isPost){
                    if(this._sFormData.length !== 0){
                        // If the URI already contains a querystring, append an ampersand
                        // and then concatenate _sFormData to the URI.
                        uri += ((uri.indexOf('?') == -1)?'?':'&') + this._sFormData;
                    }
                }else if(isPost){
                    // If POST data exist in addition to the HTML form data,
                    // it will be concatenated to the form data.
                    postData = postData?this._sFormData + '&' + postData:this._sFormData;
                }
            }
            
            if(!isPost && postData)
                uri += ((uri.indexOf('?') == -1)?'?':'&') + postData;
            
            if(!isPost && (config.cache === false)){
                // If callback.cache is defined and set to false, a
                // timestamp value will be added to the querystring.
                uri += ((uri.indexOf('?') == -1)?'?':'&') + 'rnd=' + new Date().valueOf().toString();
            }
            
            if(config.proxy === true) {
                uri = Rui.getConfig().getFirst('$.core.contextURL') + '/httpProxy/' + uri;
            }

            if(crossDomain) {
                this.jsonp(o, callback, uri, postData, config);
                return o;
            }

            this.openConnection(o, method, uri, config.async);

            if(config.headers) {
            	var prop;
            	for (prop in config.headers) o.conn.setRequestHeader(prop, config.headers[prop]);
            }
            
            // Each transaction will automatically include a custom header of
            // 'X-Requested-With: XMLHttpRequest' to identify the request as
            // having originated from Connection Manager.
            if(this._use_default_xhr_header){
                if(!this._default_headers['X-Requested-With']){
                    this.initHeader('X-Requested-With', this._default_xhr_header, true);
                }
            }

            //If the transaction method is POST and the POST header value is set to true
            //or a custom value, initalize the Content-Type header to this value.
            if((isPost && this._use_default_post_header) && this._isFormSubmit === false){
                this.initHeader('Content-Type', this._default_post_header);
            }

            //Initialize all default and custom HTTP headers,
            if(this._has_default_headers || this._has_http_headers){
                this.setHeader(o);
            }
            
            var isXecureWeb = document.XecureWeb ? true: false;
            if(typeof callback == 'object' && !Rui.isUndefined(callback.isXecureWeb))
                isXecureWeb = callback.isXecureWeb;

            if(config.async == true)
                this.handleReadyState(o, callback);
                
            if (Rui.isDebugXH)
                Rui.log('async : ' + config.async + '\r\nuri : ' + uri + '\r\nparams : ' + postData, 'xhr', 'Rui.LConnect');
                
            Rui.devGuide(this, 'LConnect_ajaxRequest', [ config, uri, postData ]);

            if(isXecureWeb === true){
                o.conn.setRequestHeader('xecure-request', 'true');
                var path = getPath(uri);
                var cipher = document.XecureWeb.BlockEnc(xgate_addr, path, postData ? decodeURIComponent(postData): postData, 'GET');
                o.conn.send('q='+encodeURIComponent(cipher));
            }else
                o.conn.send(isPost ? (postData || ''):'');

            if(config.async == false)
                this.handleReadyState(o, callback, true);


            // Reset the HTML form data and state properties as
            // soon as the data are submitted.
            if(this._isFormSubmit === true){
                this.resetFormState();
            }

            // Fire global custom event -- startEvent
            this.startEvent.fire(o, args);

            if(o.startEvent){
                // Fire transaction custom event -- startEvent
                o.startEvent.fire(o, args);
            }

            return o;
        }
    },
    /**
     * @description XHR object를 통한 비동기 request를 초기화 하기 위한 method.
     * @method asyncRequest
     * @public
     * @static
     * @sample default
     * @param {string} method HTTP transaction method
     * @param {string} uri 확실히 검증된 resource의 경로
     * @param {callback} callback 사용자 정의된 callback 함수나 object
     * @param {string|object} postData POST body
     * @param {object} config config
     * @return {object} connection object를 반환
     */
    asyncRequest: function(method, uri, callback, postData, config){
        config = config || {};
        config.async = true;
        return this.ajaxRequest(method, uri, callback, postData, config);
    },
    /**
     * @description Method for initiating an asynchronous request via the XHR object.
     * @description XHR object를 통한 동기 request를 초기화 하기 위한 method.
     * @method syncRequest
     * @public
     * @static
     * @sample default
     * @param {string} method HTTP transaction method
     * @param {string} uri 확실히 검증된 resource의 경로
     * @param {callback} callback 사용자 정의된 callback 함수나 object
     * @param {string|object} postData POST body
     * @param {object} config config
     * @return {object} connection object를 반환
     */
    syncRequest: function(method, uri, callback, postData, config){
        config = config || {};
        config.async = false;
        return this.ajaxRequest(method, uri, callback, postData, config);
    },
    /**
     * @description 각 transaction을 명세화 하는 custom event들을 생성하고 명시하는 method.
     * @method initCustomEvents
     * @private
     * @static
     * @param {object} o The connection object
     * @param {callback} callback 사용자 정의된 callback object
     * @return {void}
     */
    initCustomEvents: function(o, callback){
        var prop;
        // Enumerate through callback.customevents members and bind/on
        // events that match in the _customEvents table.
        for (prop in callback.customevents){
            if(this._customEvents[prop][0]){
                // Create the custom event
                o[this._customEvents[prop][0]] = new Rui.util.LCustomEvent(this._customEvents[prop][1], (callback.scope)?callback.scope:null);

                // Subscribe the custom event
                o[this._customEvents[prop][0]].on(callback.customevents[prop]);
            }
        }
    },
    /**
     * @description 이 method는 onreadystatechange event로의 callback binding 대신, 
     * 하나의 transaction 동안 XHR object의 readyState property를 poll하는 timer의 역할을 한다.
     * readyState 4 동안, handleTransactionResponse는 response를 처리할 것이며, timer는 삭제될 것이다.
     * @method handleReadyState
     * @private
     * @static
     * @param {object} o The connection object
     * @param {callback} callback 사용자 정의된 callback object
     * @return {void}
     */
    handleReadyState: function(o, callback, sync){
       sync = sync && sync === true ? true : false;
        var oConn = this;
        var args = (callback && callback.argument)?callback.argument:null;

        if(callback && callback.timeout){
            this._timeOut[o.tId] = window.setTimeout(function(){ oConn.abort(o, callback, true); }, callback.timeout);
        }

        if(sync) {
            if(callback && callback.timeout){
                window.clearTimeout(oConn._timeOut[o.tId]);
                delete oConn._timeOut[o.tId];
            }

            // Fire global custom event -- completeEvent
            oConn.completeEvent.fire(o, args);

            if(o.completeEvent){
                // Fire transaction custom event -- completeEvent
                o.completeEvent.fire(o, args);
            }

            oConn.handleTransactionResponse(o, callback);
        } else {
            this._poll[o.tId] = window.setInterval(function(){
                if(o.conn && o.conn.readyState === 4){
    
                    // Clear the polling interval for the transaction
                    // and remove the reference from _poll.
                    window.clearInterval(oConn._poll[o.tId]);
                    delete oConn._poll[o.tId];
    
                    if(callback && callback.timeout){
                        window.clearTimeout(oConn._timeOut[o.tId]);
                        delete oConn._timeOut[o.tId];
                    }
                    // Fire global custom event -- completeEvent
                    oConn.completeEvent.fire(o, args);
    
                    if(o.completeEvent){
                        // Fire transaction custom event -- completeEvent
                        o.completeEvent.fire(o, args);
                    }
                    oConn.handleTransactionResponse(o, callback);
                }
            },this._polling_interval);
        }
    },
    /**
     * @description 이 method는 서버 response 해석을 시도하며, transaction이 성공인지,
     * 아니면, error나 exception이 발생하였는지에 대하여 결정한다.
     * @method handleTransactionResponse
     * @private
     * @static
     * @param {object} o The connection object
     * @param {object} callback 사용자 정의된 callback object
     * @param {boolean} isAbort transaction이 abort()를 통해 종료되었는지에 대한 결정
     * @return {void}
     */
    handleTransactionResponse: function(o, callback, isAbort){
        var httpStatus, responseObject;
        var args = (callback && callback.argument)?callback.argument:null;

        try{
            if(o.conn.status !== undefined && o.conn.status !== 0){
                httpStatus = o.conn.status;
            }else{
                httpStatus = this.isLocal() ? (o.conn.responseText ? 200 : 404) : 13030;
            }
        }catch(e){
             // 13030 is a custom code to indicate the condition -- in Mozilla/FF --
             // when the XHR object's status and statusText properties are
             // unavailable, and a query attempt throws an exception.
            httpStatus = 13030;
        }

        if(httpStatus >= 200 && httpStatus < 300 || httpStatus === 1223){
            responseObject = this.createResponseObject(o, args);
            if(callback && callback.success){
                if(!callback.scope){
                    callback.success(responseObject);
                }else{
                    // If a scope property is defined, the callback will be fired from
                    // the context of the object.
                    callback.success.apply(callback.scope, [responseObject]);
                }
            }

            // Fire global custom event -- successEvent
            this.successEvent.fire(responseObject);

            if(o.successEvent){
                // Fire transaction custom event -- successEvent
                o.successEvent.fire(responseObject);
            }
        }else{
            switch(httpStatus){
                // The following cases are wininet.dll error codes that may be encountered.
                case 12002: // Server timeout
                case 12029: // 12029 to 12031 correspond to dropped connections.
                case 12030:
                case 12031:
                case 12152: // Connection closed by server.
                case 13030: // See above comments for variable status.
                    responseObject = this.createExceptionObject(o.tId, args, (isAbort?isAbort:false));
                    if(callback && callback.failure){
                        if(!callback.scope){
                            callback.failure(responseObject);
                        }
                        else{
                            callback.failure.apply(callback.scope, [responseObject]);
                        }
                    }

                    break;
                case 404:
                    responseObject = this.createResponseObject(o, args);
                    responseObject.statusText = 'Can not find the page.\n' + responseObject.statusText;
                    if(callback && callback.failure){
                        if(!callback.scope){
                            callback.failure(responseObject);
                        }
                        else{
                            callback.failure.apply(callback.scope, [responseObject]);
                        }
                    }
                    break;
                default:
                    responseObject = this.createResponseObject(o, args);
                    if(callback && callback.failure){
                        if(!callback.scope){
                            callback.failure(responseObject);
                        }
                        else{
                            callback.failure.apply(callback.scope, [responseObject]);
                        }
                    }
            }

            // Fire global custom event -- failureEvent
            this.failureEvent.fire(responseObject);

            if(o.failureEvent){
                // Fire transaction custom event -- failureEvent
                o.failureEvent.fire(responseObject);
            }

        }

        this.releaseObject(o);
        responseObject = null;
    },
    /**
     * @description 이 method는 서버 response를 평가하고 그것의 property를 통해 결과를 생성하고 반환한다.
     * 성공/실패 케이스들은 response object의 property 값들에 차이가 있을 것이다.
     * @method createResponseObject
     * @private
     * @static
     * @param {object} o The connection object
     * @param {callbackArg} callbackArg 사용자 정의된 argument나 callback으로 전달될 argument들
     * @return {object}
     */
    createResponseObject: function(o, callbackArg){
        var obj = {};
        var headerObj = {};

        try{
            var headerStr = o.conn.getAllResponseHeaders();
            var header = headerStr.split('\n');
            for (var i=0; i<header.length; i++){
                var delimitPos = header[i].indexOf(':');
                if(delimitPos != -1){
                    headerObj[header[i].substring(0,delimitPos)] = header[i].substring(delimitPos+2);
                }
            }
        }catch(e){}

        obj.tId = o.tId;
        // Normalize IE's response to HTTP 204 when Win error 1223.
        obj.status = (o.conn.status == 1223)?204:o.conn.status;
        // Normalize IE's statusText to 'No Content' instead of 'Unknown'.
        obj.statusText = (o.conn.status == 1223)?'No Content':o.conn.statusText;
        obj.getResponseHeader = headerObj;
        obj.getAllResponseHeaders = headerStr;
        if(o.crossDomain) {
            obj.responseText = Rui.LConnect['response_data_' + o.tId];
            obj.responseXML = null;
            delete Rui.LConnect['response_data_' + o.tId];
        } else {
            if (o.conn.getResponseHeader('xecure-response') == 'true') {
                var responseText = o.conn.responseText;
                obj.responseXML = null;
                if(responseText != null && responseText != '') {
                    obj.responseText = BlockDec(responseText);
                    xmlDom = Rui.util.LString.toXml(obj.responseText);
                    delete domParser;
                    obj.responseXML = xmlDom.documentElement;
                }
            }else{
                obj.responseText = o.conn.responseText ;
                obj.responseXML = o.conn.responseXML;
            } 
        }

        if(callbackArg){
            obj.argument = callbackArg;
        }

        return obj;
    },
    /**
     * @description 만약 transaction이 connection의 중단이나 종료때문에 완료될 수 없으면,
     * 완전한 response object를 만들기 위한 충분한 정보가 없을 수 있다.
     * failure callback이 발생될 것이며, 이런 특정 상태는 0의 status property값으로 식별될 수 있다.
     *
     * 만약 abort가 성공한다면, status property는 -1의 값을 report 할 것이다.
     * @method createExceptionObject
     * @private
     * @static
     * @param {int} tId The Transaction Id
     * @param {callbackArg} callbackArg 사용자 정의된 argument나 callback으로 전달될 argument들
     * @param {boolean} isAbort transaction abort에 의해 야기된 exception의 경우에 대한 여부
     * @return {object}
     */
    createExceptionObject: function(tId, callbackArg, isAbort){
        var COMM_CODE = 0;
        var COMM_ERROR = 'communication failure';
        var ABORT_CODE = -1;
        var ABORT_ERROR = 'transaction aborted';

        var obj = {};

        obj.tId = tId;
        if(isAbort){
            obj.status = ABORT_CODE;
            obj.statusText = ABORT_ERROR;
        }else{
            obj.status = COMM_CODE;
            obj.statusText = COMM_ERROR;
        }

        if(callbackArg){
            obj.argument = callbackArg;
        }

        return obj;
    },
    /**
     * @description 각 transaction에 대한 custom HTTP header들을 초기화 하는 method.
     * @method initHeader
     * @public
     * @static
     * @param {string} label HTTP header label
     * @param {string} value HTTP header 값
     * @param {string} isDefault 특정 header가 각 transaction에 
     * 자동적으로 전송되는 기본 header인지에 대한 여부
     * @return {void}
     */
    initHeader: function(label, value, isDefault){
        var headerObj = isDefault ? this._default_headers : this._http_headers;
        headerObj[label] = value;

        if(isDefault){
            this._has_default_headers = true;
        }else{
            this._has_http_headers = true;
        }
    },
    /**
     * @description 각 transaction에 대한 HTTP header를 설정하는 접근자.
     * @method setHeader
     * @private
     * @static
     * @param {object} o tansaction을 위한 connection object
     * @return {void}
     */
    setHeader: function(o){
        var prop;
        if(this._has_default_headers){
            for (prop in this._default_headers){
                if(Rui.hasOwnProperty(this._default_headers, prop)){
                    o.conn.setRequestHeader(prop, this._default_headers[prop]);
                }
            }
        }

        if(this._has_http_headers){
            for (prop in this._http_headers){
                if(Rui.hasOwnProperty(this._http_headers, prop)){
                    o.conn.setRequestHeader(prop, this._http_headers[prop]);
                }
            }
            delete this._http_headers;

            this._http_headers = {};
            this._has_http_headers = false;
        }
    },
    /**
     * @description 기본 HTTP header object를 재설정한다.
     * @method resetDefaultHeaders
     * @public
     * @static
     * @return {void}
     */
    resetDefaultHeaders: function(){
        delete this._default_headers;
        this._default_headers = {};
        this._has_default_headers = false;
    },
    /**
     * @description 이 method는 form label과 값의 짝을 조합하고, encoding된 문자열을 생성한다.
     * asyncRequest()는 'application/x-www-form-urlencoded'의 HTTP header Content-type을
     * 가진 transaction을 자동적으로 초기화 할 것이다.
     * @method setForm
     * @public
     * @static
     * @sample default
     * @param {string || object} form attribute id나 이름 혹은 form object
     * @param {boolean} optional file upload 가능 여부
     * @param {boolean} optional enable IE에서의 SSL을 통한 file upload 가능 여부
     * @return {string} HTML form field 이름과 값의 짝으로 이루어진 문자열
     */
    setForm: function(formId, isUpload, secureUri){
        var oForm, oElement, oName, oValue, oDisabled,
            hasSubmit = false,
            data = [], item = 0,
            i,len,j,jlen,opt;

        this.resetFormState();

        if(typeof formId == 'string'){
            // Determine if the argument is a form id or a form name.
            // Note form name usage is deprecated by supported
            // here for legacy reasons.
            oForm = (document.getElementById(formId) || document.forms[formId]);
        }else if(typeof formId == 'object'){
            // Treat argument as an HTML form object.
            oForm = formId;
        }else{
            return;
        }

        // If the isUpload argument is true, setForm will call createFrame to initialize
        // an iframe as the form target.
        //
        // The argument secureURI is also required by IE in SSL environments
        // where the secureURI string is a fully qualified HTTP path, used to set the source
        // of the iframe, to a stub resource in the same domain.
        if(isUpload){
            // Create iframe in preparation for file upload.
            this.createFrame(secureUri?secureUri:null);

            // Set form reference and file upload properties to true.
            this._isFormSubmit = true;
            this._formNode = oForm;

            return;
        }

        // Iterate over the form elements collection to construct the
        // label-value pairs.
        for (i=0,len=oForm.elements.length; i<len; ++i){
            oElement  = oForm.elements[i];
            oDisabled = oElement.disabled;
            oName     = oElement.name;

            // Do not submit fields that are disabled or
            // do not have a name attribute value.
            if(!oDisabled && oName){
                oName  = encodeURIComponent(oName)+'=';
                oValue = encodeURIComponent(oElement.value);

                switch(oElement.type){
                    // Safari, Opera, FF all default opt.value from .text if
                    // value attribute not specified in markup
                    case 'select-one':
                        if (oElement.selectedIndex > -1) {
                            opt = oElement.options[oElement.selectedIndex];
                            data[item++] = oName + encodeURIComponent(
                                (opt.attributes.value && opt.attributes.value.specified) ? opt.value : opt.text);
                        }
                        break;
                    case 'select-multiple':
                        if (oElement.selectedIndex > -1) {
                            for (j=oElement.selectedIndex, jlen=oElement.options.length; j<jlen; ++j){
                                opt = oElement.options[j];
                                if (opt.selected) {
                                    data[item++] = oName + encodeURIComponent(
                                        (opt.attributes.value && opt.attributes.value.specified) ? opt.value : opt.text);
                                }
                            }
                        }
                        break;
                    case 'radio':
                    case 'checkbox':
                        if(oElement.checked){
                            data[item++] = oName + oValue;
                        }
                        break;
                    case 'file':
                        // stub case as XMLHttpRequest will only send the file path as a string.
                    case undefined:
                        // stub case for fieldset element which returns undefined.
                    case 'reset':
                        // stub case for input type reset button.
                    case 'button':
                        // stub case for input type button elements.
                        break;
                    case 'submit':
                        if(hasSubmit === false){
                            if(this._hasSubmitListener && this._submitElementValue){
                                data[item++] = this._submitElementValue;
                            }
                            else{
                                data[item++] = oName + oValue;
                            }

                            hasSubmit = true;
                        }
                        break;
                    default:
                        data[item++] = oName + oValue;
                }
            }
        }

        this._isFormSubmit = true;
        this._sFormData = data.join('&');

        this.initHeader('Content-Type', this._default_form_header);

        return this._sFormData;
    },
    /**
     * @description HTML form이나 파일업로드 transaction이 같이 있는 HTML form이 전송될 때 
     * HTML form property들을 재설정 한다. 
     * @method resetFormState
     * @private
     * @static
     * @return {void}
     */
    resetFormState: function(){
        this._isFormSubmit = false;
        this._formNode = null;
        this._sFormData = '';
    },
    /**
     * @description 파일업로드 form을 위해 사용될 iframe을 생성한다.
     * 이것은 파일업로드 transaction이 완료되면 document로 부터 제거된다. 
     * @method createFrame
     * @private
     * @static
     * @param {string} optional IE에서 SSL을 위한 iframe resource의 검증된 경로
     * @return {void}
     */
    createFrame: function(secureUri){
        // IE does not allow the setting of id and name attributes as object
        // properties via createElement().  A different iframe creation
        // pattern is required for IE.
        var frameId = 'ruiIO' + this._transaction_id;
        var io;
        if(Rui.browser.msie678){
            io = document.createElement('<iframe id="' + frameId + '" name="' + frameId + '" />');

            // IE will throw a security exception in an SSL environment if the
            // iframe source is undefined.
            if(typeof secureUri == 'boolean'){
                io.src = 'javascript:false';
            }
        }
        else{
            io = document.createElement('iframe');
            io.id = frameId;
            io.name = frameId;
        }

        io.style.position = 'absolute';
        io.style.top = '-1000px';
        io.style.left = '-1000px';

        document.body.appendChild(io);
    },
    /**
     * @description POST 데이터를 파싱하고, 각 key-value에 대한 hidden form element들을 생성하여,
     * HTML form object에 그것들을 붙인다.   
     * @method appendPostData
     * @private
     * @static
     * @param {string} postData HTTP POST 데이터
     * @return {array} hidden field들의 formElements collection
     */
    appendPostData: function(postData){
        var formElements = [],
            postMessage = postData.split('&'),
            i, delimitPos;
        for (i=0; i < postMessage.length; i++){
            delimitPos = postMessage[i].indexOf('=');
            if(delimitPos != -1){
                formElements[i] = document.createElement('input');
                formElements[i].type = 'hidden';
                formElements[i].name = decodeURIComponent(postMessage[i].substring(0,delimitPos));
                formElements[i].value = decodeURIComponent(postMessage[i].substring(delimitPos+1));
                this._formNode.appendChild(formElements[i]);
            }
        }
        return formElements;
    },
    /**
     * @description transaction을 용이하게 하기 위한 createFrame에서 만든 iframe을 사용한
     * 파일들과 첨부를 포함하는 HTML form을 업로드 한다.
     * @method uploadFile
     * @private
     * @static
     * @param {int} id The transaction id.
     * @param {object} callback 사용자 정의된 callback object
     * @param {string} uri 완전히 검증된 resource 경로
     * @param {string} postData HTML form이외에 submit될 POST 데이터
     * @return {void}
     */
    uploadFile: function(o, callback, uri, postData){

        // Each iframe has an id prefix of 'ruiIO' followed
        // by the unique transaction id.
        var frameId = 'ruiIO' + o.tId,
            uploadEncoding = 'multipart/form-data',
            io = document.getElementById(frameId),
            oConn = this,
            args = (callback && callback.argument) ? callback.argument : null,
            oElements,i,prop,obj;

        // Track original HTML form attribute values.
        var rawFormAttributes = {
            action:this._formNode.getAttribute('action'),
            method:this._formNode.getAttribute('method'),
            target:this._formNode.getAttribute('target')
        };

        // Initialize the HTML form properties in case they are
        // not defined in the HTML form.
        this._formNode.setAttribute('action', uri);
        this._formNode.setAttribute('method', 'POST');
        this._formNode.setAttribute('target', frameId);

        if(Rui.browser.msie){
            // IE does not respect property enctype for HTML forms.
            // Instead it uses the property - 'encoding'.
            this._formNode.setAttribute('encoding', uploadEncoding);
        }else{
            this._formNode.setAttribute('enctype', uploadEncoding);
        }

        if(postData){
            oElements = this.appendPostData(postData);
        }

        // Start file upload.
        this._formNode.submit();

        // Fire global custom event -- startEvent
        this.startEvent.fire(o, args);

        if(o.startEvent){
            // Fire transaction custom event -- startEvent
            o.startEvent.fire(o, args);
        }

        // Start polling if a callback is present and the timeout
        // property has been defined.
        if(callback && callback.timeout){
            this._timeOut[o.tId] = window.setTimeout(function(){ oConn.abort(o, callback, true); }, callback.timeout);
        }

        // Remove HTML elements created by appendPostData
        if(oElements && oElements.length > 0){
            for (i=0; i < oElements.length; i++){
                this._formNode.removeChild(oElements[i]);
            }
        }

        // Restore HTML form attributes to their original
        // values prior to file upload.
        for (prop in rawFormAttributes){
            if(Rui.hasOwnProperty(rawFormAttributes, prop)){
                if(rawFormAttributes[prop]){
                    this._formNode.setAttribute(prop, rawFormAttributes[prop]);
                }else{
                    this._formNode.removeAttribute(prop);
                }
            }
        }

        // Reset HTML form state properties.
        this.resetFormState();

        // Create the upload callback handler that fires when the iframe
        // receives the load event.  Subsequently, the event handler is detached
        // and the iframe removed from the document.
        var uploadCallback = function(){
            if(callback && callback.timeout){
                window.clearTimeout(oConn._timeOut[o.tId]);
                delete oConn._timeOut[o.tId];
            }

            // Fire global custom event -- completeEvent
            oConn.completeEvent.fire(o, args);

            if(o.completeEvent){
                // Fire transaction custom event -- completeEvent
                o.completeEvent.fire(o, args);
            }

            obj = {
                tId: o.tId,
                argument: callback.argument
            };

            try{
                // responseText and responseXML will be populated with the same data from the iframe.
                // Since the HTTP headers cannot be read from the iframe
                // 브라우져 버전 업되어 pre가 자동으로 생김.
                obj.responseText = io.contentWindow.document.body?io.contentWindow.document.body.innerHTML:io.contentWindow.document.documentElement.textContent;
                obj.responseXML = io.contentWindow.document.XMLDocument?io.contentWindow.document.XMLDocument:io.contentWindow.document;
            }catch(e){}
            
            if(callback && callback.upload){
                if(!callback.scope){
                    callback.upload(obj);
                }else{
                    callback.upload.apply(callback.scope, [obj]);
                }
            }

            // Fire global custom event -- uploadEvent
            oConn.uploadEvent.fire(obj);

            if(o.uploadEvent){
                // Fire transaction custom event -- uploadEvent
                o.uploadEvent.fire(obj);
            }

            Rui.util.LEvent.removeListener(io, 'load', uploadCallback);

            setTimeout(function(){
                document.body.removeChild(io);
                oConn.releaseObject(o);
            }, 100);
        };

        // Bind the onload handler to the iframe to detect the file upload response.
        Rui.util.LEvent.addListener(io, 'load', uploadCallback);
    },
    /**
     * @description readyState 4 상태에 도달하지 못했을 경우 transaction을 종료시키기 위한 method.
     * @method abort
     * @public
     * @static
     * @param {object} o asyncRequest에 의해 반환되는 connection object
     * @param {object} callback 사용자 정의된 callback object
     * @param {string} isTimeout callback timeout의 결과 abort 경우를 나타내기 위한 bollean값
     * @return {boolean}
     */
    abort: function(o, callback, isTimeout){
        var abortStatus;
        var args = (callback && callback.argument)?callback.argument:null;
        if(o && o.conn){
            if(this.isCallInProgress(o)){
                // Issue abort request
                o.conn.abort();

                window.clearInterval(this._poll[o.tId]);
                delete this._poll[o.tId];

                if(isTimeout){
                    window.clearTimeout(this._timeOut[o.tId]);
                    delete this._timeOut[o.tId];
                }

                abortStatus = true;
            }
        }else if(o && o.isUpload === true){
            var frameId = 'ruiIO' + o.tId;
            var io = document.getElementById(frameId);

            if(io){
                // Remove all listeners on the iframe prior to
                // its destruction.
                Rui.util.LEvent.removeListener(io, 'load');
                // Destroy the iframe facilitating the transaction.
                document.body.removeChild(io);

                if(isTimeout){
                    window.clearTimeout(this._timeOut[o.tId]);
                    delete this._timeOut[o.tId];
                }

                abortStatus = true;
            }
        }else{
            abortStatus = false;
        }

        if(abortStatus === true){
            // Fire global custom event -- abortEvent
            this.abortEvent.fire(o, args);

            if(o.abortEvent){
                // Fire transaction custom event -- abortEvent
                o.abortEvent.fire(o, args);
            }

            this.handleTransactionResponse(o, callback, true);
        }

        return abortStatus;
    },

    /**
    * @description transaction이 아직 처리중인지에 대해서 결정한다.
    * @method isCallInProgress
    * @public
    * @static
    * @param {object} o asyncRequest에 의해 반환되는 connection object
    * @return {boolean}
    */
    isCallInProgress: function(o){
        // if the XHR object assigned to the transaction has not been dereferenced,
        // then check its readyState status.  Otherwise, return false.
        if(o && o.conn){
            return o.conn.readyState !== 4 && o.conn.readyState !== 0;
        }else if(o && o.isUpload === true){
            var frameId = 'ruiIO' + o.tId;
            return document.getElementById(frameId)?true:false;
        }else{
            return false;
        }
    },
    /**
     * @description transaction이 완료된 후의 connection object와 XHR instance에 대한 역참조
     * @method releaseObject
     * @private
     * @static
     * @param {object} o The connection object
     * @return {void}
     */
     releaseObject: function(o){
         if(o && o.conn){
             if (o.crossDomain) {
                 Rui.util.LEvent.removeListener(o.conn, "load", this.jsonpOnLoad);
                 var oHead = document.getElementsByTagName('head')[0];
                 for (var i = 0, len = oHead.children.length; i < len; i++) {
                     if(oHead.children[i].id == 'conn_' + o.tId) {
                         Rui.util.LDom.removeNode(oHead.children[i]);
                         break;
                     }
                 }
                 delete Rui.LConnect['_conn' + o.tId];
             }
             //dereference the XHR instance.
             o.conn = null;
             //dereference the connection object.
             o = null;
         }
     },
    isLocal: function(){
        if(Rui.isUndefined(this.isLocalProtocol)){
            var rlocalProtocol = /^(?:about|app|app\-storage|.+\-extension|file|res|widget):$/;
            var rurl = /^([\w\+\.\-]+:)(?:\/\/([^\/?#:]*)(?::(\d+))?)?/;
            var ajaxLocation = null;
            try{
                ajaxLocation = location.href;
            }catch( e ){
                // Use the href attribute of an A element
                // since IE will modify it given document.location
                ajaxLocation = document.createElement( 'a' );
                ajaxLocation.href = '';
                ajaxLocation = ajaxLocation.href;
            }
            var urlParts = rurl.exec(ajaxLocation.toLowerCase());
            this.isLocalProtocol = rlocalProtocol.test(urlParts[1]);
        }
        return this.isLocalProtocol;
    },
    jsonp: function(o, callback, uri, postData, config) {
        var oHead = document.getElementsByTagName('head')[0];
        var params = Rui.util.LString.getUrlParams(uri);
        if(!params || !(params && params.callback)) {
            uri = Rui.util.LString.getAppendUrl(uri, 'callback', 'Rui.LConnect._conn' + o.tId);
        }
        this.handleReadyState(o, callback);
        Rui.LConnect['_conn' + o.tId] = function(data) {
            Rui.LConnect['response_data_' + o.tId] = data;
        };
        Rui.util.LEvent.addListener(o.conn, "load", this.jsonpOnLoad, o);
        o.conn.src = uri + '&tId=' + o.tId;
        oHead.appendChild(o.conn);
    },
    jsonpOnLoad: function(e, o) {
        o.conn.readyState = 4;
        o.conn.status = 200;
    }
};

/**
 * Element는 event listener들의 추가, dom method들의 사용, attribute들의 관리 등을 
 * 쉽게 하는 wrapper object를 제공한다.
 * @module util
 * @namespace Rui
 * @requires dom, event
 */

/**
 * Rui.util.LAttribute instance를 제공하고 관리한다.
 * @namespace Rui.util
 * @class LAttributeProvider
 * @private
 * @uses Rui.util.LEventProvider
 */
Rui.util.LAttributeProvider = function(){
};
Rui.util.LAttributeProvider.prototype = {
    /**
     * attribute config의 key-value map 
     * @property _configs
     * @protected (may be used by subclasses and augmentors)
     * @private
     * @type {Object}
     */
    _configs: null,
    /**
     * attribute의 현재 값을 반환한다.
     * @method get
     * @param {String} key 반환될 attribute의 값
     * @return {Any} attribute의 현재 값
     */
    get: function(key){
        this._configs = this._configs || {};
        var config = this._configs[key];
        
        if (!config || !this._configs.hasOwnProperty(key)) {
            return undefined;
        }
        
        return config.value;
    },
    /**
     * config의 값을 설정한다.
     * @method set
     * @param {String} key attribute의 이름
     * @param {Any} value attribute에 적용할 값
     * @param {boolean} silent change event들의 억제 여부
     * @return {boolean} 값의 설정 여부
     */
    set: function(key, value, silent){
        this._configs = this._configs || {};
        var config = this._configs[key];
        if (!config)
            return false;
        return config.setValue(value, silent);
    },
    /**
     * attribute 이름들에 대한 array를 반환한다.
     * @method getAttributeKeys
     * @return {Array} attribute 이름들의 array
     */
    getAttributeKeys: function(){
        this._configs = this._configs || {};
        var keys = [];
        var config;
        for (var key in this._configs) {
            config = this._configs[key];
            if (Rui.hasOwnProperty(this._configs, key) &&
            !Rui.isUndefined(config)) {
                keys[keys.length] = key;
            }
        }
        return keys;
    },
    /**
     * 여러 attribute의 값을 설정한다.
     * @method setAttributes
     * @param {Object} map attribute들의 key-value map
     * @param {boolean} silent change event들의 억제 여부
     */
    setAttributes: function(map, silent){
        for (var key in map) {
            if (Rui.hasOwnProperty(map, key)) {
                this.set(key, map[key], silent);
            }
        }
    },
    /**
     * 특정 attribute의 값을 초기값으로 재설정한다.
     * @method resetValue
     * @param {String} key attribute의 이름
     * @param {boolean} silent change event들의 억제 여부
     * @return {boolean} 값의 설정 여부
     */
    resetValue: function(key, silent){
        this._configs = this._configs || {};
        if (this._configs[key]) {
            this.set(key, this._configs[key]._initialConfig.value, silent);
            return true;
        }
        return false;
    },
    /**
     * attribute의 값을 현재값으로 설정한다.
     * @method refresh
     * @param {String | Array} key refresh할 attribute
     * @param {boolean} silent change event들의 억제 여부
     */
    refresh: function(key, silent){
        this._configs = this._configs || {};
        var configs = this._configs;
        key = ((Rui.isString(key)) ? [key] : key) || this.getAttributeKeys();
        for (var i = 0, len = key.length; i < len; ++i) {
            if (configs.hasOwnProperty(key[i])) {
                this._configs[key[i]].refresh(silent);
            }
        }
    },
    /**
     * LAttributeProvider instance에 attribute를 추가한다.
     * @method register
     * @param {String} key attribute의 이름
     * @param {Object} map attribute의 property를 포함하고 있는 key-value map
     * @deprecated Use setAttributeConfig
     */
    register: function(key, map){
        this.setAttributeConfig(key, map);
    },
    /**
     * attribute의 property들을 반환한다.
     * @method getAttributeConfig
     * @param {String} key attribute의 이름
     * @private
     * @return {object} attribute의 property들을 모두 포함하는 key-value map
     */
    getAttributeConfig: function(key){
        this._configs = this._configs || {};
        var config = this._configs[key] || {};
        var map = {}; // returning a copy to prevent overrides
        for (key in config) {
            if (Rui.hasOwnProperty(config, key)) {
                map[key] = config[key];
            }
        }
        return map;
    },
    /**
     * attribute insatance의 property들을 업데이트 하거나 설정한다.
     * @method setAttributeConfig
     * @param {String} key attribute의 이름
     * @param {Object} map attribute property들의 key-value map
     * @param {boolean} init 초기 설정 적용 여부
     */
    setAttributeConfig: function(key, map, init){
        this._configs = this._configs || {};
        map = map || {};
        if (!this._configs[key]) {
            map.name = key;
            this._configs[key] = this.createAttribute(map);
        } else {
            this._configs[key].configure(map, init);
        }
    },
    /**
     * attribute insatance의 property들을 업데이트 하거나 설정한다.
     * @method configureAttribute
     * @private
     * @param {String} key attribute의 이름
     * @param {Object} map attribute property들의 key-value map
     * @param {boolean} init 초기 설정 적용 여부
     * @deprecated Use setAttributeConfig
     */
    configureAttribute: function(key, map, init){
        this.setAttributeConfig(key, map, init);
    },
    /**
     * attribute를 초기 config로 재설정한다.
     * @method resetAttributeConfig
     * @param {String} key attribute의 이름
     * @private
     */
    resetAttributeConfig: function(key){
        this._configs = this._configs || {};
        this._configs[key].resetConfig();
    },
    // wrapper for LEventProvider.on
    // to create events on the fly
    on: function(type, callback){
        this._events = this._events || {};
        if (!(type in this._events)) {
            this._events[type] = this.createEvent(type);
        }
        Rui.util.LEventProvider.prototype.on.apply(this, arguments);
    },
    on: function(){
        this.on.apply(this, arguments);
    },
    addListener: function(){
        this.on.apply(this, arguments);
    },
    /**
     * attribute의 beforeChange event를 발생시킨다.
     * @method fireBeforeChangeEvent
     * @private
     * @param {String} key attribute의 이름
     * @param {Obj} e handler들에게 전달할 event object
     */
    fireBeforeChangeEvent: function(e){
        var type = 'before';
        type += e.type.charAt(0).toUpperCase() + e.type.substr(1) + 'Change';
        e.type = type;
        return this.fireEvent(e.type, e);
    },
    /**
     * attribute의 change event를 발생시킨다.
     * @method fireChangeEvent
     * @private
     * @param {String} key attribute의 이름
     * @param {Obj} e handler들에게 전달할 event object
     */
    fireChangeEvent: function(e){
        e.type += 'Change';
        return this.fireEvent(e.type, e);
    },
    createAttribute: function(map){
        return new Rui.util.LAttribute(map, this);
    }
};
Rui.augment(Rui.util.LAttributeProvider, Rui.util.LEventProvider);

/**
 * Element는 event listener들의 추가, dom method들의 사용, attribute들의 관리 등을 
 * 쉽게 하는 wrapper object를 제공한다.
 * @module util
 * @namespace Rui
 * @requires dom, event
 */

/**
 * LAttribute의 configuration을 제공한다.
 * @namespace Rui.util
 * @class LAttribute
 * @private
 * @constructor
 * @param hash {Object} The initial LAttribute.
 * @param {Rui.util.LAttributeProvider} LAttribute instance의 owner.
 */
Rui.util.LAttribute = function(hash, owner) {
    if (owner) { 
        this.owner = owner;
        this.configure(hash, true);
    }
};
Rui.util.LAttribute.prototype = {
    /**
     * attribute의 이름
     * @property name
     * @type String
     */
    name: undefined,
    /**
     * attribute의 값
     * @property value
     * @type String
     */
    value: null,
    /**
     * attribute의 owner
     * @property owner
     * @type Rui.util.LAttributeProvider
     */
    owner: null,
    /**
     * attribute의 read only 여부
     * @property readOnly
     * @type Boolean
     */
    readOnly: false,
    /**
     * atrribute의 written once 여부
     * @property writeOnce
     * @type Boolean
     */
    writeOnce: false,
    /**
     * attribute의 초기화 configuration
     * @private
     * @property _initialConfig
     * @type Object
     */
    _initialConfig: null,
    /**
     * attribute의 값 설정 여부
     * @private
     * @property _written
     * @type Boolean
     */
    _written: false,
    /**
     * attribute의 값을 설정할때 사용하는 method.
     * method는 오직 인자로만 새 값을 받는다.
     * @property method
     * @type Function
     */
    method: null,
    /**
     * attribute의 값을 설정할때 사용하는 validator
     * @property validator
     * @type Function
     * @return {boolean}
     */
    validator: null,
    /**
     * attribute의 현재 값을 받는다.
     * @method getValue
     * @return {any} attribute의 현재값
     */
    getValue: function() {
        return this.value;
    },
    /**
     * attribute의 값을 설정하고 beforeChange와 change event를 발생시킨다.
     * @method setValue
     * @param {Any} value attribute에 적용되는 값
     * @param {boolean} silent [optional] 만약 true면, change event를 발생시키지 않는다.
     * @return {boolean} 값의 설정 여부
     */
    setValue: function(value, silent) {
        var beforeRetVal;
        var owner = this.owner;
        var name = this.name;
        
        var event = {
            type: name, 
            prevValue: this.getValue(),
            newValue: value
        };
        
        if (this.readOnly || ( this.writeOnce && this._written) ) {
            return false; // write not allowed
        }
        
        if (this.validator && !this.validator.call(owner, value) ) {
            return false; // invalid value
        }

        if (!silent) {
            beforeRetVal = owner.fireBeforeChangeEvent(event);
            if (beforeRetVal === false) {
                return false;
            }
        }

        if (this.method) {
            this.method.call(owner, value);
        }
        
        this.value = value;
        this._written = true;
        
        event.type = name;
        
        if (!silent) {
            this.owner.fireChangeEvent(event);
        }
        
        return true;
    },
    /**
     * attribute의 property를 config 할 수 있다.
     * @method configure
     * @private
     * @param {Object} map A key-value map of Attribute properties.
     * @param {boolean} init config 초기화에 대한 여부
     */
    configure: function(map, init) {
        map = map || {};

        this._written = false; // reset writeOnce
        this._initialConfig = this._initialConfig || {};
        
        for (var key in map) {
            if ( map.hasOwnProperty(key) ) {
                this[key] = map[key];
                if (init) {
                    this._initialConfig[key] = map[key];
                }
            }
        }
    },
    /**
     * Resets the value to the initial config value.
     * 초기 config 값을 재설정한다.
     * @method resetValue
     * @return {boolean} 값의 설정 여부
     */
    resetValue: function() {
        return this.setValue(this._initialConfig.value);
    },
    /**
     * 초기 config 상태로 attribute config를 재설정 한다.
     * @method resetConfig
     */
    resetConfig: function() {
        this.configure(this._initialConfig);
    },
    /**
     * 현재 값으로 값을 재설정한다.
     * 값들이 실제 property와 동기화 되지 않았을 경우에 유용하다.
     * @method refresh
     * @return {boolean} 값의 설정 여부
     */
    refresh: function(silent) {
        this.setValue(this.value, silent);
    }
};

(function() {
    // internal shorthand
    var Dom = Rui.util.LDom,
        LAttributeProvider = Rui.util.LAttributeProvider;

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
    Rui.LElement = function(el, map) {
        /**
         * @description LElement가 가지고 있는 실제 html dom 객체
         * @property dom
         * @public
         * @sample default
         * @type {Object}
         */
        this.dom = typeof el == 'string' ? document.getElementById(el) : el;

        if (arguments.length) {
            this.init(el, map);
        }

        /**
         * @description LElement가 가지고 있는 실제 html dom 객체의 id
         * @property id
         * @public
         * @sample default
         * @type {String}
         */
        this.id = (this.dom ? this.dom.id : '') || Rui.id(this.dom);

        if(typeof el == 'string' && DEl.elCache[this.id]) {
            return DEl.elCache[this.id];
        }

    };

    var DEl = Rui.LElement;
    var docEl;

    Rui.LElement.prototype = {
        /**
         * @description Element instance에 의해 지원되는 Dom event들.
         * @property DOM_EVENTS
         * @private
         * @type Object
         */
        DOM_EVENTS: null,
        /**
         * @description visibilityMode가 true면 visibility에 설정 false거나 없으면 display에 설정한다.
         * @property visibilityMode
         * @private
         * @type {boolean}
         */
        visibilityMode: false,
        /**
         * 해당 element가 border box를 사용하는 경우 다양한 css rule/브라우저들을 테스트한다.
         * @return {boolean}
         */
        isBorderBox: function(){
            return noBoxAdjust[((this.dom && this.dom.tagName) || '').toLowerCase()] || Rui.isBorderBox;
        },
        /**
         * @description CSS Selector로 child 객체를 LElement객체로 만들어 Rui.LElementList로 리턴한다.
         * @method select
         * @sample default
         * @param {String} selector CSS selector 문자열
         * @param {boolean} firstOnly [optional] 찾은 객체의 무조건 첫번째 객체를 리턴한다.
         * @return {Rui.LElementList} Rui.LElementList 객체 리턴
         */
        select: function(selector, firstOnly) {
            var n = Rui.util.LDomSelector.query(selector, this.dom, firstOnly);
            return this.createElementList(n);
        },
        /**
         * @description CSS Selector로 child html 객체를 배열로 리턴한다.
         * @method query
         * @sample default
         * @param {String} selector CSS selector 문자열
         * @param {boolean} firstOnly [optional] 찾은 객체의 무조건 첫번째 객체를 리턴한다.
         * @return {Array} Array 객체 리턴
         */
        query: function(selector, firstOnly) {
            return Rui.util.LDomSelector.query(selector, this.dom, firstOnly);
        },
        /**
         * @description CSS Selector로 현재 node중 selector로 지정된 child node만 배열로 리턴한다.
         * @method filter
         * @param {String} selector CSS selector 문자열
         * @return {Rui.LElementList} Rui.LElementList 객체 리턴
         */
        filter: function(selector) {
            var nodes = this.query('*');
            return this.createElementList(Rui.util.LDomSelector.filter(nodes, selector));
        },
        /**
         * @description CSS Selector로 현재 dom이 selector에 해당되는 객체인지 여부를 리턴한다.
         * @method test
         * @sample default
         * @param {String} selector CSS selector 문자열
         * @return {boolean}  객체 리턴
         */
        test: function(selector) {
            return Rui.util.LDomSelector.test(this.dom, selector);
        },
        /**
         * @description list에 해당되는 배열을 LElement 개체의 배열인 LElementList객체로 만들어 리턴한다.
         * @method createElementList
         * @private
         * @param {Array} list list 객체
         * @return {Rui.LElementList}
         */
        createElementList: function(list) {
            var element = [];
            if(list && Rui.isArray(list)) {
                Rui.each(list, function(child) {
                    if(child) element.push(Rui.get(child.instance ? child.id : child));
                });
            } else {
                if(list) element.push(Rui.get(list.instance ? list.id : list));
            }
            try {
                return new Rui.LElementList(element);
            } finally {
                element = null;
            }
        },
        /**
         * @description Dom객체의 value값을 리턴한다.
         * @method getValue
         * @return {Object} 객체에 들어 있는 값
         */
        getValue: function() {
            return this.dom.value;
        },
        /**
         * @description Dom객체의 value값을 저장한다. dom.value는 change 이벤트가 발생하지 않으므로 사용하면 안된다.
         * @method setValue
         * @param {Object} value 저장할 결과값
         * @return {Rui.LElement}
         */
        setValue: function(value) {
            this.dom.value = value;
            return this;
        },
        /**
         * @description Dom객체의 checked값을 저장한다. dom.value는 change 이벤트가 발생하지 않으므로 사용하면 안된다.
         * @method setChecked
         * @param {Object} value 저장할 결과값
         * @return {Rui.LElement}
         */
        setChecked: function(value) {
            this.dom.checked = value;
            return this;
        },
        /**
         * @description Dom객체의 checked값을 리턴한다.
         * @method isChecked
         * @return {boolean}
         */
        isChecked: function() {
            return this.dom.checked;
        },
        /**
         * @description HTMLElement method를 위한 Wrapper.
         * @method getElementsByTagName
         * @param {String} tag collect 할 tag 이름
         * @return {HTMLCollection} DOM element들의 collection.
         */
        getElementsByTagName: function(tag) {
            return this.dom.getElementsByTagName(tag);
        },
        /**
         * @description HTMLElement method를 위한 Wrapper.
         * @method hasChildNodes
         * @return {boolean} element가 child node들을 가지고 있는지에 대한 여부
         */
        hasChildNodes: function() {
            return this.dom.hasChildNodes();
        },
        /**
         * @description HTMLElement chid 노드들의 array를 반환한다.
         * @method getChildren
         * @return {Array} HTMLElement들의 static array
         */
        getChildren: function(isDom) {
            var list = Rui.util.LDom.getChildren(this.dom);
            if(!isDom || isDom === true) {
                for (var i = 0 ; i < list.length ; i++)
                    list[i] = Rui.get(list[i]);
            }
            return list;
        },
        /**
         * @description element의 구체적인 attribute들을 등록한다..
         * @method initAttributes
         * @private
         * @param {Object} map 초기 attribute config들의 key-value map
         */
        initAttributes: function(map) {
        },
        /**
         * @description 주어진 event에 대해 listener를 추가한다.
         * @method addListener
         * @private
         * @param {String} type listen될 event의 이름
         * @param {Function} fn event가 발생할때 호출할 handler
         * @param {Any} obj handler에게 전달할 변수
         * @param {Object} scope handler의 scope를 위해 사용할 object
         * @return {void}
         */
        addListener: function(type, fn, obj, scope, options) {
            var el = this.dom || this.id;
            scope = scope || this;

            if(!this._events) throw new Error('Unknown element : ' + this.id);

            var self = this;
            if (!this._events[type]) { // create on the fly
                if (el && this.DOM_EVENTS[type]) {
                    Rui.util.LEvent.addListener(el, type, function(e) {
                        if (e.srcElement && !e.target) { // supplement IE with target
                            e.target = e.srcElement;
                        }
                        self.fireEvent(type, e );
                    }, obj, scope);
                }
                this.createEvent(type, options);
            }
            return Rui.util.LEventProvider.prototype.on.call(this, type, fn, obj, scope, options); // notify via customEvent
        },
        /**
         * @description 주어진 event에 대해 listener를 추가한다.
         * 이것은 DOM이나 customEvent listener들이 될 수 있다.
         * frieEvent를 통해 발생한 어떤 event들도 listen될 수 있다.
         * 모든 handler들은 event object를 받는다.
         * @method on
         * @sample default
         * @param {String} type listen될 event의 이름
         * @param {Function} fn event가 발생할때 호출할 handler
         * @param {Object} scope handler의 scope를 위해 사용할 object
         * @param {boolean|Object}  override 만약 true면, 전달된 obj가 listener의 실행 scope가 된다.
          *                          만약 object면, 그 object가 실행 scope가 된다.
         * @return {void}
         */
        on: function() {
            return this.addListener.apply(this, arguments);
        },
        /**
         * @description event listener를 삭제한다.
         * @method removeListener
         * @private
         * @param {String} type listen될 event의 이름
         * @param {Function} fn event가 발생할때 호출할 handler
         * @return {void}
         */
        removeListener: function(type, fn) {
            return this.unOn.apply(this, arguments);
        },
        /**
         * @description event listener를 삭제한다.
         * @method unOn
         * @sample default
         * @param {String} type listen될 event의 이름
         * @param {Function} fn event가 발생할때 호출할 handler
         * @return {void}
         */
        unOn: function(type, fn) {
            return Rui.util.LEventProvider.prototype.unOn.apply(this, arguments); // notify via customEvent
        },
        /**
         * @description 모든 event listener를 삭제한다.
         * @method unOnAll
         * @return {void}
         */
        unOnAll: function() {
            return Rui.util.LEventProvider.prototype.unOnAll.apply(this, arguments); // notify via customEvent
        },
        /**
         * @description Dom에 css를 추가한다.
         * @method addClass
         * @sample default
         * @param {String} className 추가할 className
         * @return {Rui.LElement} this
         */
        addClass: function(className) {
            Dom.addClass(this.dom, className);
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
            return Dom.hasClass(this.dom, className);
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
                Dom.removeClass(this.dom, cn);
            }, this);
            return this;
        },
        /**
         * @description Dom method를 위한 Wrapper.
         * @method getElementsByClassName
         * @param {String} className collect할 className
         * @param {String} tag (optional) class name과 함께 사용할 태그
         * @return {Array} HTMLElement들의 array
         */
        getElementsByClassName: function(className, tag) {
            return Dom.getElementsByClassName(className, tag,
                    this.dom );
        },
        /**
         * @description Dom에 style을 주는 메소드
         * @method setStyle
         * @sample default
         * @param {String} property 설정할 style property
         * @param {String} value style property에 적용할 값
         */
        setStyle: function(property, value) {
            var el = this.dom;
            if (!el) {
                return this._queue[this._queue.length] = ['setStyle', arguments];
            }
            Dom.setStyle(el,  property, value);
            return this;
        },
        /**
         * @description Dom에 style을 가져오는 메소드
         * @method getStyle
         * @sample default
         * @param {String} property 조회할 style property
         * @return {String} property의 현재값
         */
        getStyle: function(property) {
            return Dom.getStyle(this.dom,  property);
        },
        /**
         * @description Dom에 style들을 주는 메소드(json 형 객체)
         * @method setStyles
         * @sample default
         * @param {Object} props 설정할 style property 객체
         * @return {Rui.LElement}
         */
        setStyles: function(props) {
            for (prop in props) {
                this.setStyle(prop, props[prop]);
            }
            return this;
        },
        /**
         * @description Dom에 style들을 가져오는 메소드(json 형 객체)
         * @method getStyles
         * @sample default
         * return {Object} props 설정한 style property 객체
         */
         getStyles: function(props) {
            for (prop in props) {
                props[prop] = this.getStyle(prop);
            }
            return props;
        },
        /**
         * @description queue set 호출을 적용한다.
         * @method fireQueue
         * @private
         */
        fireQueue: function() {
            var queue = this._queue;
            for (var i = 0, len = queue.length; i < len; ++i) {
                this[queue[i][0]].apply(this, queue[i][1]);
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
            var configs = this._configs || {};
            var el = configs.element; // avoid loop due to 'element'
            if (el && !configs[key] && !Rui.isUndefined(el.value[key]) ) {
                return el.value[key];
            }

            return LAttributeProvider.prototype.get.call(this, key);
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
            var el = this.dom;
            if (!el) {
                this._queue[this._queue.length] = ['set', arguments];
                if (this._configs[key]) {
                    this._configs[key].value = value; // so 'get' works while queueing

                }
                return;
            }
            // set it on the element if not configured and is an HTML attribute
            if ( !this._configs[key] && !Rui.isUndefined(el[key]) ) {
                _registerHTMLAttr.call(this, key);
            }
            return LAttributeProvider.prototype.set.apply(this, arguments);
        },
        /**
         * @description attribute instance의 property들을 설정하거나 업데이트한다.
         * @method setAttributeConfig
         * @private
         * @param {String} key attribute의 이름.
         * @param {Object} map attribute propwerty들의 key-value map
         * @param {boolean} init 해당 attribute가 초기 config가 되어야할지에 대한 여부.
         * @return {void}
         */
        setAttributeConfig: function(key, map, init) {
            var el = this.dom;
            if (el && !this._configs[key] && !Rui.isUndefined(el[key]) ) {
                _registerHTMLAttr.call(this, key, map);
            } else {
                LAttributeProvider.prototype.setAttributeConfig.apply(this, arguments);
            }
            this._configOrder.push(key);
        },
        /**
         * @description attribute의 property들을 반환한다.
         * @method getAttributeConfig
         * @param {String} key attribute의 이름
         * @private
         * @return {object} 모든 attribute의 property들을 포함하고 있는 key-value map.
         */
        getAttributeKeys: function() {
            var el = this.dom;
            var keys = LAttributeProvider.prototype.getAttributeKeys.call(this);
            //add any unconfigured element keys
            for (var key in el) {
                if (!this._configs[key]) {
                    keys[key] = keys[key] || el[key];
                }
            }
            return keys;
        },

        createEvent: function(type, options) {
            this._events[type] = true;
            LAttributeProvider.prototype.createEvent.apply(this, arguments);
        },

        init: function(el, attr) {
            _initElement.apply(this, arguments);
        },
        /**
         * @description 전달된 simple selector의 match를 위한 현재 node와 parent node를 LElement로 리턴한다.(예: div.some-class or span:first-child)
         * @method findParent
         * @sample default
         * @param {String} selector test를 위한 simple selector
         * @param {Number/Mixed} maxDepth (optional) element나 number로서 검색하기 위한 depth max값 (defaults to 10 || document.body)
         * @return {Rui.LElement} LElement 객체
         */
        findParent: function(simpleSelector, maxDepth){
            var pDom = Dom.findParent(this.dom, simpleSelector, maxDepth);
            return pDom ? Rui.get(pDom) : null;
        },
        /**
         * @description 전달된 simple selector의 match를 위한 parent node들을 찾는다.(예: div.some-class or span:first-child)
         * @method findParentNode
         * @sample default
         * @param {String} selector test를 위한 simple selector
         * @param {Number/Mixed} maxDepth (optional) element나 number로서 검색하기 위한 depth max값 (defaults to 10 || document.body)
         * @param {boolean} returnEl (optional) DOM node 대신 Rui.LElement object를 반환하기 위해서는 True
         * @return {HTMLElement} 매치되는 DOM node(매치되는 값을 찾지 못하면 null)
         */
        findParentNode: function(simpleSelector, maxDepth, returnEl){
            return Dom.findParentNode(this.dom, simpleSelector, maxDepth, returnEl);
        },
        matchNode: function(dir, start, selector, returnDom){
            var n = this.dom[start];
            while (n){
                if(n.nodeType == 1 && (!selector || Rui.util.LDomSelector.test(n, selector))){
                    return !returnDom ? Rui.get(n) : n;
                }
                n = n[dir];
            }
            return null;
        },
        /**
         * @description 해당 element에 대한 parent node를 가져오고, 부가적으로 일치하는 selector를 찾는다.
         * @method parent
         * @sample default
         * @param {String} selector (optional) 전달된 simple selector와 일치하는 parent node를 찾는다.
         * @param {boolean} returnDom (optional) Rui.LElement 대신 raw dom node를 반환하기 위해서는 True
         * @return {Rui.LElement|HTMLElement} parent node 혹은 null
         */
        parent: function(selector, returnDom){
            return this.matchNode('parentNode', 'parentNode', selector, returnDom);
        },
        /**
         * @description 해당 element에 대한 parent node를 가져오고, 부가적으로 일치하는 selector를 찾는다.
         * @method parent
         * @param {int} depth 상위 부모 객체의 depth까지 찾는다 부모가 null이 나오면 그전까지 찾는다.
         * @return {Rui.LElement} parent LElement
         */
        parentDepth: function(depth) {
        	var beforeEl = currEl = this, currDepth = 0;
        	while ((currEl = currEl.parent())) {
        		if(currDepth >= depth) break; 
        		currDepth++;
        		beforeEl = currEl;
        	}
        	var retEl = currEl ? currEl : beforeEl;
        	return retEl;
        },
        /**
         * 이전에 sibling되어 있는 HTMLElement를 반환한다.
         * @method getPreviousSibling
         * @return {Object} HTMLElement나 찾지 못하는 경우 null
         */
        getPreviousSibling: function() {
            if(!this.dom) return null;
            var prevDom = Dom.getPreviousSibling(this.dom);
            return prevDom ? Rui.get(prevDom) : null;
        },
        /**
         * 다음에 sibling 되어 있는 HTMLElement를 반환한다.
         * @method getNextSibling
         * @return {Object} HTMLElement나 찾지 못하는 경우 null
         */
        getNextSibling: function() {
            if(!this.dom) return null;
            var prevDom = Dom.getNextSibling(this.dom);
            return prevDom ? Rui.get(prevDom) : null;
        },
        /**
         * @description 현재 dom에 이전 sibling으로 새 node를 삽입한다.
         * @method insertBefore
         * @sample default
         * @param {HTMLElement} newNode 삽입될 node
         * @return {Rui.LElement} this
         */
        insertBefore: function(child) {
            var elems = [];
            if(!child.elements) elems.push(child); else elems = child.elements;
            Rui.util.LArray.each(elems, function(item){
                Dom.insertBefore(this.getDom(item), this.dom);
            }, this);
            return this;
        },
        /**
         * @description 현재 dom에 다음 sibling으로서 새로운 node를 삽입한다.
         * @method insertAfter
         * @sample default
         * @param {String | HTMLElement} newNode 삽입될 node
         * @return {Rui.LElement} this
         */
        insertAfter: function(child) {
            var elems = [];
            if(!child.elements) elems.push(child); else elems = child.elements;
            Rui.util.LArray.each(elems, function(item){
                Dom.insertAfter(this.getDom(item), this.dom);
            }, this);
            return this;
        },
        /**
         * @description DOM으로 부터 해당 element를 삭제하고 캐시로부터 그것을 지운다.
         * @method remove
         * @return {Rui.LElement}
         */
        remove: function(){
            delete DEl.elCache[this.dom.id];
            this.removeNode();
            return this;
        },
        /**
         * @description document로 부터 DOM node를 삭제한다. body node는 전달될 경우 무시될 것이다.
         * @method removeNode
         * @return {Rui.LElement}
         */
        removeNode: function(){
            Dom.removeNode(this.dom);
            delete this.dom;
            return this;
        },
        /**
         * @description dom객체 하위에 child dom객체를 붙인다.
         * @method appendChild
         * @sample default
         * @param {Rui.LElement || HTMLElement} child 추가할 element.
         * @return {Rui.LElement} this
         */
        appendChild: function(child) {
            var elems;
            if (typeof child === 'string') {
                if(child.indexOf('<') > -1) {
                    elems = Rui.createElements(child);
                } else elems = Rui.select(child);
            } else {
                elems = new Rui.LElementList();
                if (!child.elements) elems.add(child);
                else elems = child;
            }
            elems.each(function(item){
                this.dom.appendChild(this.getDom(item));
            }, this);
            return this;
        },
        /**
         * @description dom객체를 리턴한다.
         * @method getDom
         * @private
         * @param {HTMLElement | Rui.LElement} el 객체
         * @return {HTMLElement} 추가된 DOM element
         */
        getDom: function(item) {
            return item && item.dom ? item.dom : (item && item.get) ?
                    item.get('element') : Dom.get(item);
        },
        /**
         * @description 제공된 parent 노드에 HTMLElement를 추가한다.
         * @method appendTo
         * @sample default
         * @param {HTMLElement | Element} parentNode 추가될 노드
         * @param {HTMLElement | Element} before 이전에 삽입할 부가적인 노드
         * @return {HTMLElement} 추가된 DOM element
         */
        appendTo: function(parent, before) {
            parent = this.getDom(parent);
/*
            LAttributeProvider.prototype.fireEvent.apply(this, 'beforeAppendTo', {
                type: 'beforeAppendTo',
                target: parent
            });
            */
            before = this.getDom(before);
            var element = this.dom;
            if (!element) {
                return false;
            }
            if (!parent) {
                return false;
            }
            if (element.parent != parent) {
                if (before) {
                    parent.insertBefore(element, before);
                } else {
                    parent.appendChild(element);
                }
            }
            return element;
        },
        /**
         * @description ajax를 호출하여 해당 결과를 현재 dom객체에 추가한다.
         * @method appendChildByAjax
         * @sample default
         * @param {Object} option 호출시 속성 (ajax 속성)
         * @return {Rui.LElement} this
         */
        appendChildByAjax: function(option) {
            var me = this;
            option.successOld = option.success || Rui.emptyFn;
            delete option.success;
            option = Rui.applyIf(option, {
               success: function(e){
                   var html = e.responseText;
                    Dom.appendHtml(me.dom, html);
                    var scriptFragment = '<title>([\\S\\s]*?)<\/title>';
                    var regexp = new RegExp(scriptFragment);
                    var matches;
                    //var heads = [];
                    if ((matches = regexp.exec(html)) != null) {
                        e.title = matches[0].substring(7,matches[0].indexOf('</title>'));
                    }
                    option.successOld.call(me, e);
               }
            });
            Rui.ajax(option);
            return this;
        },
        /**
         * @description element의 height offset을 반환한다.
         * @method getHeight
         * @public
         * @param {boolean} contentHeight (optional) height의 border, padding의 음수값을 가져오려면 True
         * @return {Number} element의 height
         */
        getHeight: function(contentHeight){
            var h = this.dom.offsetHeight || 0;
            h = !contentHeight ? h : h - this.getBorderWidth('tb') - this.getPadding('tb');
            return h < 0 ? 0 : h;
        },
        /**
         * @description element의 width offset을 반환한다.
         * @method getWidth
         * @public
         * @param {boolean} contentWidth (optional) width의 border, padding의 음수값을 가져오려면 True
         * @return {Number} element의 width
         */
        getWidth: function(contentWidth){
            var w = this.dom.offsetWidth || 0;
            w = !contentWidth ? w : w - this.getBorderWidth('lr') - this.getPadding('lr');
            return w < 0 ? 0 : w;
        },
        // private (needs to be called => addStyles.call(this, sides, styles))
        addStyles: function(sides, styles){
            var val = 0;
            Rui.each(sides.match(/\w/g), function(s) {
                if (s = parseFloat(this.getStyle(styles[s]), 10)) {
                    val += Math.abs(s);
                }
            },
            this);
            return val;
        },
        /**
         * @description 특정 side에 대한 border의 width를 가져온다.
         * @method getBorderWidth
         * @public
         * @param {String} side 여러값들을 추가하기 위해 t, l, r, b나 이런 것들의 어떤 조합도 가능하다.
         *        예를 들어, <tt>'lr'</tt>을 전달하면 <b><u>l</u></b>eft width + the border <b><u>r</u></b>ight width를 가져올 것이다.
         * @return {Number} 추가적으로 전달된 side들의 width
         */
        getBorderWidth: function(side){
            return this.addStyles(side, Rui.LElement.borders);
        },
        /**
         * @description 특정 side에 대한 padding의 width를 가져온다.
         * @method getPadding
         * @public
         * @param {String} side 여러값들을 추가하기 위해 t, l, r, b나 이런 것들의 어떤 조합도 가능하다.
         *        예를 들어, <tt>'lr'</tt>을 전달하면 <b><u>l</u></b>eft width + the border <b><u>r</u></b>ight width를 가져올 것이다.
         * @return {Number} 추가적으로 전달된 side들의 padding
         */
        getPadding: function(side){
            return this.addStyles(side, Rui.LElement.paddings);
        },

        getAnimation: function(anim, domId) {
            var currAnim = null;
            if(typeof anim == 'object' && anim.type) {
                var animation = eval('Rui.fx.' + anim.type);
                try{
                    currAnim = new animation({
                        el: domId,
                        attributes: anim,
                        duration: anim.duration,
                        method: anim.method
                    });
                    if(anim.callback) {
                        currAnim.on('complete', anim.callback, Rui.get(domId), true);
                    }
                } catch(e) {}
            }
            return currAnim;
        },
        /**
         * @description visMode가 true면 visibility에 설정 false거나 없으면 display에 설정한다.
         * @method setVisibilityMode
         * @sample default
         * @param {boolean} visMode visibility로 설정할지 display로 설정할지 결정하는 값
         * @return {Rui.LElement} this
         */
        setVisibilityMode: function(visMode) {
            this.visibilityMode = visMode;
            return this;
        },
        /**
         * @description 객체를 보이게 설정하는 메소드
         * @method show
         * @public
         * @sample default
         * @param {Boolean|Rui.fx.LAnim} anim (optional) Animation 여부를 설정한다. Boolean값이면 디폴트 animation을 실행하고 객체면 해당 객체에 설정된 animation을 수행한다.
         * @return {Rui.LElement} this
         */
        show: function(anim) {
            if(this.dom) {
                var width = this.dom.ordWidth || this.getWidth(true);
                if(anim) {
                    if(anim === true)
                        anim = { width: { from:0, to: width }, duration: 0.4 };
                    anim = Rui.applyIf(anim, { type: 'LAnim' });
                }
                this._show();

                var currAnim = (Rui.fx && anim instanceof Rui.fx.LAnim) ? anim : this.getAnimation(anim, this.dom.id);
                if(currAnim != null) {
                    currAnim.animate();
                }
            }
            return this;
        },
        _show: function() {
            if(this.dom.instance && this.dom.instance.show) this.dom.instance.show();
            else this.visibilityMode ? this.removeClass('L-hide-visibility') : this.removeClass('L-hide-display');
        },
        /**
         * @description 객체를 안보이게 설정하는 메소드
         * @method hide
         * @public
         * @sample default
         * @param {Boolean|Rui.fx.LAnim} anim (optional) Animation 여부를 설정한다. Boolean값이면 디폴트 animation을 실행하고 객체면 해당 객체에 설정된 animation을 수행한다.
         * @return {Rui.LElement} this
         */
        hide: function(anim) {
            if(this.dom) {
                var width = this.getWidth(true);
                this.dom.ordWidth = width;
                if(anim) {
                    if(anim === true)
                        anim = { width: { from:width, to: 0 }, duration: 0.4 };
                    anim = Rui.applyIf(anim, { type: 'LAnim' });
                }

                var currAnim = (Rui.fx && anim instanceof Rui.fx.LAnim) ? anim : this.getAnimation(anim, this.dom.id);
                if(currAnim != null) {
                    currAnim.on('complete', function() {
                        this._hide();
                    }, this, true);
                    currAnim.animate();
                } else {
                    this._hide();
                }
            }
            return this;
        },
        _hide: function() {
            this.visibilityMode ? this.addClass('L-hide-visibility') : this.addClass('L-hide-display');
        },
        /**
         * @description 객체가 보이는지 여부를 확인하는 메소드
         * @method isShow
         * @public
         * @sample default
         * @return {void}
         */
        isShow: function() {
            if(this.dom) {
                return (this.hasClass('L-hidden') || this.hasClass('L-hide-display') || this.hasClass('L-hide-visibility') || this.dom.style.visibility === 'hidden' || this.dom.style.display === 'none')? false : true;
            } else {
                return false;
            }
        },
        /**
         * @description LElement의 모든 하위 객체들을 지운다.
         * @method removeChildNodes
         * @private
         * @return {Rui.LElement}
         */
        removeChildNodes: function() {
            Dom.removeChildNodes(this.dom);
            return this;
        },
        /**
         * @description innerHTML에 html 내용을 채워넣는 메소드
         * @method html
         * @public
         * @param {String} html innerHTML 넣은 HTML 문자열
         * @return {Rui.LElement} this
         */
        html: function(html) {
            if (this.dom) {
            	if(this.waitMaskEl) delete this.waitMaskEl;
                //this.removeChildNodes();
                this.dom.innerHTML = html;
            }
            return this;
        },
        /**
         * @description innerHTML에 html 내용을 리턴하는 메소드
         * @method getHtml
         * @public
         * @sample default
         * @return {String} html 내용
         */
        getHtml: function() {
            if(this.dom)
                return this.dom.innerHTML;
            else
                return '';
        },
        /**
         * @description 출력상태가 show이면 hide로 hide면 show로 변경한다.
         * @method toggle
         * @sample default
         * @return {Rui.Elemnent} this
         */
        toggle: function(ani) {
            var me = this;
            me.isShow() ? me.hide() : me.show();
        },
        /**
         * @description 마우스가 Element에 안밖으로 움직일때 전달된 함수들을 호출하기 위한 event 핸들러를 설정한다.
         * @method hover
         * @sample default
         * @param {Function} overFn 마우스가 Element에 들어갔을해 호출할 함수
         * @param {Function} outFn 마우스가 Element에서 나왔을때 호출할 함수
         * @param {Object} scope (optional) 함수들이 실행될 scope(<tt>this</tt> reference). 기본적으로 Element의 DOM element.
         * @param {Object} options (optional) listener를 위한 옵션들. {@link Rui.util.LEventProvider#addListener the <tt>options</tt> parameter} 를 참조.
         * @return {Rui.LElement} this
         */
        hover: function(overFn, outFn, scope, options){
            this.on('mouseenter', overFn, scope || this, options);
            this.on('mouseleave', outFn, scope || this, options);
            return this;
        },
        /**
         * @description HTMLElement dom 객체의 attribute 속성을 추가한다.
         * @method setAttribute
         * @param {String} key key값
         * @param {String} value value값
         * @return {Rui.LElement} this
         */
        setAttribute: function(key, value) {
            if(this.dom)
                this.dom.setAttribute(key, value);
            return this;
        },
        /**
         * @description HTMLElement dom 객체의 attribute 속성값을 리턴한다.
         * @method getAttribute
         * @param {String} key key값
         * @return {String} attribute 속성 값
         */
        getAttribute: function(key) {
            if(this.dom)
                return this.dom.getAttribute(key);
            return null;
        },
        /**
         * @description HTMLElement dom 객체의 attribute 속성을 삭제한다.
         * @method removeAttribute
         * @param {String} key key값
         * @return {Rui.LElement} this
         */
        removeAttribute: function(key) {
            if(this.dom)
                this.dom.removeAttribute(key);
            return this;
        },
        /**
         * @description HTMLElement dom 객체의 click 메소드를 호출한다.
         * @method click
         * @return {Rui.LElement} this
         */
        click: function() {
        	this.dom.click();
        },
        /**
        * @description 객체의 toString
        * @method toString
        * @public
        * @return {String}
        */
        toString: function() {
            return 'Rui.LElement ' + this.id;
        }
    };

    var _initElement = function(el, attr) {
        this._queue = this._queue || [];
        this._events = this._events || {};
        this._configs = this._configs || {};
        this._configOrder = [];
        attr = attr || {};
        attr.element = attr.element || el || null;

        this.DOM_EVENTS = {
            'copy': true,
            'paste': true,
            'click': true,
            'dblclick': true,
            'keydown': true,
            'keypress': true,
            'keyup': true,
            'mouseenter': true,
            'mouseleave': true,
            'mousedown': true,
            'mousemove': true,
            'mouseout': true,
            'mouseover': true,
            'mouseup': true,
            'focus': true,
            'blur': true,
            'submit': true,
            // select 태그에 변경 이벤트가 처리되지 않아 추가함.
            'change':true,
            'touchstart': true,
            'touchmove': true,
            'touchend': true,
            'onorientationchange': true,
            'resize': true,
            'DOMSubtreeModified': true,
            'webkitTransitionEnd': true
        };

        var isReady = false;  // to determine when to init HTMLElement and content

        if (typeof attr.element === 'string') { // register ID for get() access
            _registerHTMLAttr.call(this, 'id', { value: attr.element });
        }

        if (Dom.get(attr.element)) {
            isReady = true;
            _initHTMLElement.call(this, attr);
            _initContent.call(this, attr);
        }

        Rui.util.LEvent.onAvailable(attr.element, function() {
            if (!isReady) { // otherwise already done
                _initHTMLElement.call(this, attr);
            }

            this.fireEvent('available', { type: 'available', target: Dom.get(attr.element) });
        }, this, true);

        Rui.util.LEvent.onContentReady(attr.element, function() {
            if (!isReady) { // otherwise already done
                _initContent.call(this, attr);
            }
            this.fireEvent('contentReady', { type: 'contentReady', target: Dom.get(attr.element) });
        }, this, true);
    };

    var _initHTMLElement = function(attr) {
        /**
         * @description Element instance가 참조할 HTMLElement.
         * @attribute element
         * @type HTMLElement
         */
        this.setAttributeConfig('element', {
            value: Dom.get(attr.element),
            readOnly: true
         });
    };

    var _initContent = function(attr) {
        this.initAttributes(attr);
        this.setAttributes(attr, true);
        this.fireQueue();
    };

    /**
     * @description property에 값을 설정하고 beforeChange와 change event를 발생시틴다.
     * @private
     * @method _registerHTMLAttr
     * @param {Rui.LElement} element config에 등록할 Element instance.
     * @param {String} key 등록할 config의 이름
     * @param {Object} map config 인자의 key-value map
     */
    var _registerHTMLAttr = function(key, map) {
        var el = this.dom;
        map = map || {};
        map.name = key;
        map.method = map.method || function(value) {
            if (el) {
                el[key] = value;
            }
        };
        map.value = map.value || el[key];
        this._configs[key] = new Rui.util.LAttribute(map, this);
    };

    /**
     * 페이지 로드시 dom 객체가 로드되면 수행되는 이벤트
     * @event available
     */

    /**
     * Fires after the Element is appended to another Element.
     * @event appendTo
     */
    Rui.augment(Rui.LElement, LAttributeProvider);

    // speedy lookup for elements never to box adjust
    var noBoxAdjust = Rui.isStrict ? {
        select:1
    } : {
        input:1, select:1, textarea:1
    };
    if(Rui.browser.msie || Rui.browser.gecko){
        noBoxAdjust['button'] = 1;
    }

DEl.get = function(el){
    var ex, elm;
    //var id;
    if(!el){ return null; }
    if(typeof el == 'string'){ // element id
        if(!(elm = document.getElementById(el))){
            return null;
        }
        if(ex = DEl.elCache[el]){
            ex.dom = elm;
        }else{
            ex = DEl.elCache[el] = new Rui.LElement(elm);
        }
        return ex;
    }else if(el.tagName){ // dom element
        ex = new DEl(el);
        return ex;
    }else if(el instanceof DEl){
        if(el != docEl){
            el.dom = document.getElementById(el.id) || el.dom; // refresh dom element in case no longer valid,
            // catch case where it hasn't been appended
        }
        return el;
    }else if(el.isComposite){
        return el;
    }else if(Rui.isArray(el)){
        var obj = [];
        for (var i = 0 ; i < el.length ; i++)
            obj.push(new Rui.LElement(el[i]));
        return obj; //DEl.select(el);
    }else if(el == document){
        // create a bogus element object representing the document object
        if(!docEl){
            var f = function(){};
            f.prototype = DEl.prototype;
            docEl = new f();
            docEl.dom = document;
        }
        return docEl;
    }else if(el.nodeType == 3 && el.nodeName == '#text') {
        ex = new DEl(el);
        return ex;
    }
    return null;
};

Rui.get = DEl.get;

DEl.elCache = {};

DEl.PADDING = 'padding';DEl.MARGIN = 'margin';DEl.BORDER = 'border';DEl.LEFT = '-left';
DEl.RIGHT = '-right';DEl.TOP = '-top';DEl.BOTTOM = '-bottom';DEl.WIDTH = '-width';
DEl.unitPattern = /\d+(px|em|%|en|ex|pt|in|cm|mm|pc)$/i;
DEl.borders = {l: DEl.BORDER + DEl.LEFT + DEl.WIDTH, r: DEl.BORDER + DEl.RIGHT + DEl.WIDTH, t: DEl.BORDER + DEl.TOP + DEl.WIDTH, b: DEl.BORDER + DEl.BOTTOM + DEl.WIDTH};
DEl.paddings = {l: DEl.PADDING + DEl.LEFT, r: DEl.PADDING + DEl.RIGHT, t: DEl.PADDING + DEl.TOP, b: DEl.PADDING + DEl.BOTTOM};
DEl.margins = {l: DEl.MARGIN + DEl.LEFT, r: DEl.MARGIN + DEl.RIGHT, t: DEl.MARGIN + DEl.TOP, b: DEl.MARGIN + DEl.BOTTOM};
})();
( function() {
    /**
     * Element 객체를 Chain 구조로 처리하는 객체 (Rui.LElement의 메소드를 모두 사용할 수 있음.) 
     * @class LElementList
     * @sample default
     * @constructor LElementList
     * @param o {HTMLElement} The html element that 
     */
    Rui.LElementList = function(o) {
        /**
         * @description element의 배열 객체
         * @property elements
         * @private
         * @type {Array}
         */
        this.elements = [];
        /**
         * @description element의 배열 갯수
         * @property length
         * @private
         * @type {int}
         */
        this.length = 0;
        return this.init(o);
    };

    Rui.LElementList.prototype = {
        init: function(selector) {
            if ( !selector ) {
                return this;
            }
            if (selector instanceof Rui.LElement || Rui.isArray(selector)) {
                this.add(selector);
                return this;
            } else if (typeof selector.length === 'number') {
                for (var i = 0, len = selector.length; i < len; i++) {
                    this.add(new Rui.LElement(selector[i]));
                }
                return this;
            } 
            return Rui.select(selector);
        },
        /**
         * @description Element객체 추가
         * @method add
         * @param {Rui.LElement} els 추가할 Element 객체
         * @return {Rui.LElementList} Rui.LElementList 객체 리턴 
         */
        add: function(els) {
            if (els) {
                if (!Rui.isArray(els)) {
                    this.elements = this.elements.concat(els);
                } else {
                    var yels = this.elements;
                    Rui.each(els, function(e) {
                        yels.push(e);
                    });
                }
                this.length = this.elements.length;
            }
            return this;
        },
        /**
         * @description index에 대한 Element객체 리턴
         * @method getAt
         * @sample default
         * @param {int} index 리턴할 위치
         * @return {Rui.LElement} Rui.LElement 객체 리턴 
         */
        getAt: function(index) {
            var me = this;
            if(!me.elements[index]){
                return null;
            }
            return me.elements[index];
        },
        /**
         * @description each 메소드
         * @method each
         * @private
         * @param {Function} fn 비교할 Function
         * @param {Object} scope this로 인식할 객체 정보
         * @return {Rui.LElementList} Rui.LElementList 객체 리턴 
         */
        each: function(fn, scope){       
            var me = this;
            Rui.each(me.elements, function(e,i) {    
                return fn.call(scope || e, e, i, me);
            });
            return me;
        },
        /**
         * @description 배열 초기화 메소드
         * @method clear
         * @return {Rui.LElementList} Rui.LElementList 객체 리턴 
         */
        clear: function(){
            this.elements = [];
            this.length = 0;
            return this;
        },
        /**
         * @description item들의 dom select 메소드
         * @method select
         * @sample default
         * @param {String} selector selector 문장
         * @param {boolean} firstOnly [optional] 첫번째 Dom을 리턴할지 여부
         * @return {Rui.LElementList} Rui.LElementList 객체 리턴 
         */
        select: function(selector, firstOnly) {
            var newElement = [];
            this.each(function(item) {
                var me = item.select(selector, firstOnly);
                newElement = newElement.concat(me.elements || me);
            }, this.elements);
            return new Rui.LElementList(newElement);
        },
        /**
         * @description item들의 dom query 메소드
         * @method query
         * @private
         * @param {String} selector selector 문장
         * @param {boolean} firstOnly [optional] 첫번째 Dom을 리턴할지 여부
         * @return {Rui.LElementList} Rui.LElementList 객체 리턴 
         */
        query: function(selector, firstOnly) {
            var newElement = [];
            this.each(function(item) {
                var me = item.query(selector, firstOnly);
                newElement = newElement.concat(me);
            }, this.elements);
            return newElement; 
        },
        /**
         * @description item들의 dom filter 메소드
         * @method filter
         * @private
         * @param {String} selector selector 문장
         * @return {Rui.LElementList} Rui.LElementList 객체 리턴 
         */
        filter: function(selector) {
            var newElements = [];
            this.each(function(item) {
                newElements.push(item.dom);
            }, this.elements);
            newElements = Rui.util.LDomSelector.filter(newElements, selector);
            for (var i = 0 ; i < newElements.length; i++) newElements[i] = new Rui.LElement(newElements[i]);
            return new Rui.LElementList(newElements); 
        },
        /**
         * @description item들의 parent dom에 붙인다ㅏ.
         * @method appendTo
         * @param {HTMLElement|Rui.LElement} parent parent 객체
         * @return {Rui.LElementList} Rui.LElementList 객체 리턴 
         */
        appendTo: function(parent) {
            //var newElement = [];
            this.each(function(item) {
                item.appendTo(parent);
            }, this.elements);
            return this;
        },
        /**
         * @description LElement 배열을 리턴한다.
         * @method toArray
         * @return {Array}  
         */        
        toArray: function(isDom) {
            if(isDom) {
                var doms = [];
                for (var i = 0 ; i < this.elements.length; i++){
                    doms.push(this.elements[i].dom);
                };
                return doms;
            } else 
                return this.elements;
        },
        /**
         * @description 현재 item들이 selector에 맞는 객체인지 확인하는 메소드
         * @method test
         * @param {String} selector selector 문장
         * @return {boolean}  
         */
        test: function(selector) {
            var isTest = true;
            this.each(function(item) {
                var isV = item.test(selector);
                isTest = isV;
                return !isTest ? false:true;
            }, this.elements);
            return isTest;
        },
        invoke: function(fn, args){
            var els = this.elements;
            var me = this;
            var list = [];
            Rui.each(els, function(el) {
                var ret = Rui.LElement.prototype[fn].apply(el, args);
                if(ret !== el) {
                    list.push(ret);
                }
            }, this);
            var v = (list.length > 0 && list.length == me.length) ? list : me;
            if(list.length == 1) v = list[0];
            return v;
        },
        /**
        * @description 객체의 toString
        * @method toString
        * @public
        * @return {String}
        */
        toString: function() {
            return 'Rui.LElementList ';
        }
    };
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
 * select 모듈은 CSS3 selector들이 DOM element들과 함께 사용될 수 있게 도움을 주는 method들을 제공한다. 
 * @module util
 * @title Selector Utility
 * @namespace Rui.util
 * @requires Rui, dom
 */

(function() {
/**
 * DOM element들의 collecting과 filtering에 도움을 주는 method들을 제공한다.
 * @namespace Rui.util
 * @class LDomSelector
 * @static
 */
var LDomSelector = function() {};

var Y = Rui.util;

var reNth = /^(?:([-]?\d*)(n){1}|(odd|even)$)*([-+]?\d*)$/;
//var chunker = /((?:\((?:\([^()]+\)|[^()]+)+\)|\[(?:\[[^[\]]*\]|['"][^'"]*['"]|[^[\]'"]+)+\]|\\.|[^ >+~,(\[\\]+)+|[>+~])(\s*,\s*)?/g;

LDomSelector.prototype = {
    /**
     * query들을 사용하기 위한 기본 document
     * @property document
     * @type object
     * @default window.document
     */
    document: window.document,
    /**
     * 일반적으로 JS 예약어와 충돌하는 HTMLAttibute를 해결하기 위하여,
     * alias로 attribute를 매핑한다. 
     * @property attrAliases
     * @private
     * @type object
     */
    attrAliases: {
    },
    /**
     * attribute selector에 대응되는 shorthand 토큰의 매핑
     * @property shorthand
     * @private
     * @type object
     */
    shorthand: {
        //'(?:(?:[^\\)\\]\\s*>+~,]+)(?:-?[_a-z]+[-\\w]))+#(-?[_a-z]+[-\\w]*)': '[id=$1]',
        '\\#(-?[_a-z]+[-\\w]*)': '[id=$1]',
        '\\.(-?[_a-z]+[-\\w]*)': '[class~=$1]'
    },
    /**
     * 연산자의 목록과 대응되는 boolean 함수들.
     * 이 함수들은 attribute와 attribute의 현재 node값이 전달된다.
     * @property operators
     * @private
     * @type object
     */
    operators: {
        '=': function(attr, val) { return attr === val; }, // Equality
        '!=': function(attr, val) { return attr !== val; }, // Inequality
        '~=': function(attr, val) { // Match one of space seperated words 
            var s = ' ';
            return (s + attr + s).indexOf((s + val + s)) > -1;
        },
        '|=': function(attr, val) { return getRegExp('^' + val + '[-]?').test(attr); }, // Match start with value followed by optional hyphen
        '^=': function(attr, val) { return attr.indexOf(val) === 0; }, // Match starts with value
        '$=': function(attr, val) { return attr.lastIndexOf(val) === attr.length - val.length; }, // Match ends with value
        '*=': function(attr, val) { return attr.indexOf(val) > -1; }, // Match contains value as substring 
        '': function(attr, val) { return attr; } // Just test for existence of attribute
    },
    /**
     * pseudo 클래스들의 목록과 대응되는 boolean 함수들.
     * 이 함수들은 현재 node와 pseudo 정규식으로 parsing되는 어떤값들로 호출이 된다.
     * @property pseudos
     * @private
     * @type object
     */
    pseudos: {
        'root': function(node) {
            return node === node.ownerDocument.documentElement;
        },

        'nth-child': function(node, val) {
            return getNth(node, val);
        },

        'nth-last-child': function(node, val) {
            return getNth(node, val, null, true);
        },

        'nth-of-type': function(node, val) {
            return getNth(node, val, node.tagName);
        },
         
        'nth-last-of-type': function(node, val) {
            return getNth(node, val, node.tagName, true);
        },
         
        'first-child': function(node) {
            return getChildren(node.parentNode)[0] === node;
        },

        'last-child': function(node) {
            var children = getChildren(node.parentNode);
            return children[children.length - 1] === node;
        },

        'first-of-type': function(node, val) {
            return getChildren(node.parentNode, node.tagName.toLowerCase())[0];
        },
         
        'last-of-type': function(node, val) {
            var children = getChildren(node.parentNode, node.tagName.toLowerCase());
            return children[children.length - 1];
        },
         
        'only-child': function(node) {
            var children = getChildren(node.parentNode);
            return children.length === 1 && children[0] === node;
        },

        'only-of-type': function(node) {
            return getChildren(node.parentNode, node.tagName.toLowerCase()).length === 1;
        },

        'empty': function(node) {
            return node.childNodes.length === 0;
        },

        'not': function(node, simple) {
            return !LDomSelector.test(node, simple);
        },

        'contains': function(node, str) {
            var text = node.innerText || node.textContent || '';
            return text.indexOf(str) > -1;
        },
        'checked': function(node) {
            return node.checked === true;
        }
    },
    /**
     * 제공된 node가 제공된 selector와 일치하는지 테스트한다.
     * @method test
     *
     * @param {HTMLElement | String} node 테스트될 HTMLElement로의 id나 node reference
     * @param {string} selector node를 상대로 테스트할 CSS LDomSelector
     * @return{boolean} node가 selector와 일치하는지에 대한 여부
     * @static
    
     */
    test: function(node, selector) {
        node = LDomSelector.document.getElementById(node) || node;
        //node = typeof node == 'string' ? LDomSelector.document.getElementById(node) : node;
        if (!node) {
            return false;
        }

        var groups = selector ? selector.split(',') : [];
        if (groups.length) {
            for (var i = 0, len = groups.length; i < len; ++i) {
                if ( rTestNode(node, groups[i]) ) { // passes if ANY group matches
                    return true;
                }
            }
            return false;
        }
        return rTestNode(node, selector);
    },
    /**
     * 주어진 CSS selector에 기반한 node들의 집합을 filtering. 
     * @method filter
     *
     * @param {array} nodes filter할 node/id들의 집합 
     * @param {string} selector 각 node를 테스트 하기 위해 사용되는 selector
     * @return{array} 주어진 selector와 일치하는 제공된 array로 부터의 node들의 array
     * @static
     */
    filter: function(nodes, selector) {
        nodes = nodes || [];

        var node,
            result = [];
        //var tokens = tokenize(selector);

        if (!nodes.item) { // if not HTMLCollection, handle arrays of ids and/or nodes
            for (var i = 0, len = nodes.length; i < len; ++i) {
                if (!nodes[i].tagName) { // tagName limits to HTMLElements 
                    node = LDomSelector.document.getElementById(nodes[i]);
                    if (node) { // skip IDs that return null 
                        nodes[i] = node;
                    } else {
                    }
                }
            }
        }
        result = rFilter(nodes, tokenize(selector)[0]);
        clearParentCache();
        return result;
    },
    /**
     * 주어진 CSS selector에 기반한 node들의 집합을 받는다. 
     * @method query
     *
     * @param {string} selector 노드를 상대로 테스트할 CSS LDomSelector
     * @param {HTMLElement | String} root (optional) 쿼리가 시작할 id나 HTMLElement. 기본은 LDomSelector.document.
     * @param {boolean} firstOnly (optional) 첫번째 일치값만 반환할지에 대한 여부
     * @return {Array} 주어진 selector와 일치하는 node들의 array
     * @static
     */
    query: function(selector, root, firstOnly) {
        var result = query(selector, root, firstOnly);
        return result;
    }
};

var query = function(selector, root, firstOnly, deDupe) {
    var result =  (firstOnly) ? null : [];
    if (!selector) {
        return result;
    }

    var groups = selector.split(','); // TODO: handle comma in attribute/pseudo

    if (groups.length > 1) {
        var found;
        for (var i = 0, len = groups.length; i < len; ++i) {
            found = arguments.callee(groups[i], root, firstOnly, true);
            result = firstOnly ? found : result.concat(found); 
        }
        clearFoundCache();
        return result;
    }

    if (root && !root.nodeName) { // assume ID
        root = LDomSelector.document.getElementById(root);
        if (!root) {
            return result;
        }
    }

    root = root || LDomSelector.document;
    var tokens = tokenize(selector);
    var idToken = tokens[getIdTokenIndex(tokens)],
        nodes = [],
        node,
        id,
        token = tokens.pop() || {};
        
    if (idToken) {
        id = getId(idToken.attributes);
    }

    // use id shortcut when possible
    if (id) {
        node = LDomSelector.document.getElementById(id);
        
        /*
         * ie에서 getElementById로 얻어와도 name객체는 찾는 문제 해결
         */
        if(node && node.id != id) {
            var findNodeList = [];
            findNodeList = Rui.util.LDom.getAllChildrenBy(root || document, findNodeList, function(child){
                if(child.id == id)
                    return true;
                return false;
            });
            node = findNodeList.length > 0 ? findNodeList[0] : node;
        }

        if (node && (root.nodeName == '#document' || contains(node, root))) {
            if ( rTestNode(node, null, idToken) ) {
                if (idToken === token) {
                    nodes = [node]; // simple selector
                } else {
                    root = node; // start from here
                }
            }
        } else {
            return result;
        }
    }

    if (root && !nodes.length) {
        nodes = root.getElementsByTagName(token.tag);
    }

    if (nodes.length) {
        result = rFilter(nodes, token, firstOnly, deDupe); 
    }

    clearParentCache();
    return result;
};

var contains = function() {
    if (document.documentElement.contains && !Rui.browser.webkit < 422)  { // IE & Opera, Safari < 3 contains is broken
        return function(needle, haystack) {
            return haystack.contains(needle);
        };
    } else if ( document.documentElement.compareDocumentPosition ) { // gecko
        return function(needle, haystack) {
/*
    //compareDocumentPosition: DOM Level 3에 정의된 패런트와 차일드 관계를 나타내는 메소드
    //this.compareDocumentPosition(other)를 기준으로 8진수 값
    //1: 같은 document에 존재하지 않음
    //2: node가 other보다 앞에 있음
    //4: node가  other보다 뒤에 있음
    //8: node는 other의 자손
    //10: node는 other의 선조
    //20: DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC
 */
            return !!(haystack.compareDocumentPosition(needle) & 16);
        };
    } else  { // Safari < 3
        return function(needle, haystack) {
            var parent = needle.parentNode;
            while (parent) {
                if (needle === parent) {
                    return true;
                }
                parent = parent.parentNode;
            } 
            return false;
        }; 
    }
}();

var rFilter = function(nodes, token, firstOnly, deDupe) {
    var result = firstOnly ? null : [];

    for (var i = 0, len = nodes.length; i < len; i++) {
        if (! rTestNode(nodes[i], '', token, deDupe)) {
            continue;
        }

        if (firstOnly) {
            return nodes[i];
        }
        if (deDupe) {
            if (nodes[i]._found) {
                continue;
            }
            nodes[i]._found = true;
            foundCache[foundCache.length] = nodes[i];
        }

        result[result.length] = nodes[i];
    }

    return result;
};

var rTestNode = function(node, selector, token, deDupe) {
    token = token || tokenize(selector).pop() || {};

    if (!node.tagName ||
        (token.tag !== '*' && node.tagName.toUpperCase() !== token.tag) ||
        (deDupe && node._found) ) {
        return false;
    }

    if (token.attributes.length) {
        var attribute;
        for (var i = 0, len = token.attributes.length; i < len; ++i) {
            if (token.attributes[i][0] == 'class' || token.attributes[i][0] == 'className') {
                attribute = node.className;
            }
            else {
                attribute = node.getAttribute(token.attributes[i][0], 2);
            }
            if (attribute === null || attribute === undefined) {
                return false;
            }
            if ( LDomSelector.operators[token.attributes[i][1]] &&
                    !LDomSelector.operators[token.attributes[i][1]](attribute, token.attributes[i][2])) {
                return false;
            }
        }
    }

    if (token.pseudos.length) {
        for (var i = 0, len = token.pseudos.length; i < len; ++i) {
            if (LDomSelector.pseudos[token.pseudos[i][0]] &&
                    !LDomSelector.pseudos[token.pseudos[i][0]](node, token.pseudos[i][1])) {
                return false;
            }
        }
    }

    return (token.previous && token.previous.combinator !== ',') ?
            combinators[token.previous.combinator](node, token) :
            true;
};


var foundCache = [];
var parentCache = [];
var regexCache = {};

var clearFoundCache = function() {
    for (var i = 0, len = foundCache.length; i < len; ++i) {
        try { // IE no like delete
            delete foundCache[i]._found;
        } catch(e) {
            foundCache[i].removeAttribute('_found');
        }
    }
    foundCache = [];
};

var clearParentCache = function() {
    if (!document.documentElement.children) { // caching children lookups for gecko
        return function() {
            for (var i = 0, len = parentCache.length; i < len; ++i) {
                delete parentCache[i]._children;
            }
            parentCache = [];
        };
    } else return function() {}; // do nothing
}();

var getRegExp = function(str, flags) {
    flags = flags || '';
    if (!regexCache[str + flags]) {
        regexCache[str + flags] = new RegExp(str, flags);
    }
    return regexCache[str + flags];
};

var combinators = {
    ' ': function(node, token) {
        while (node = node.parentNode) {
            if (rTestNode(node, '', token.previous)) {
                return true;
            }
        }  
        return false;
    },

    '>': function(node, token) {
        return rTestNode(node.parentNode, null, token.previous);
    },

    '+': function(node, token) {
        var sib = node.previousSibling;
        while (sib && sib.nodeType !== 1) {
            sib = sib.previousSibling;
        }

        if (sib && rTestNode(sib, null, token.previous)) {
            return true; 
        }
        return false;
    },

    '~': function(node, token) {
        var sib = node.previousSibling;
        while (sib) {
            if (sib.nodeType === 1 && rTestNode(sib, null, token.previous)) {
                return true;
            }
            sib = sib.previousSibling;
        }

        return false;
    }
};

var getChildren = function() {
    if (document.documentElement.children) { // document for capability test
        return function(node, tag) {
            return (tag) ? node.children.tags(tag) : node.children || [];
        };
    } else {
        return function(node, tag) {
            if (node._children) {
                return node._children;
            }
            var children = [],
                childNodes = node.childNodes;

            for (var i = 0, len = childNodes.length; i < len; ++i) {
                if (childNodes[i].tagName) {
                    if (!tag || childNodes[i].tagName.toLowerCase() === tag) {
                        children[children.length] = childNodes[i];
                    }
                }
            }
            node._children = children;
            parentCache[parentCache.length] = node;
            return children;
        };
    }
}();

/*
    an+b = get every _a_th node starting at the _b_th
    0n+b = no repeat ('0' and 'n' may both be omitted (together) , e.g. '0n+1' or '1', not '0+1'), return only the _b_th element
    1n+b =  get every element starting from b ('1' may may be omitted, e.g. '1n+0' or 'n+0' or 'n')
    an+0 = get every _a_th element, '0' may be omitted 
*/
var getNth = function(node, expr, tag, reverse) {
    if (tag) tag = tag.toLowerCase();
    reNth.test(expr);
    var a = parseInt(RegExp.$1, 10), // include every _a_ elements (zero means no repeat, just first _a_)
        n = RegExp.$2, // 'n'
        oddeven = RegExp.$3, // 'odd' or 'even'
        b = parseInt(RegExp.$4, 10) || 0; // start scan from element _b_
    //var result = [];

    var siblings = getChildren(node.parentNode, tag);

    if (oddeven) {
        a = 2; // always every other
        op = '+';
        n = 'n';
        b = (oddeven === 'odd') ? 1 : 0;
    } else if ( isNaN(a) ) {
        a = (n) ? 1 : 0; // start from the first or no repeat
    }

    if (a === 0) { // just the first
        if (reverse) {
            b = siblings.length - b + 1; 
        }

        if (siblings[b - 1] === node) {
            return true;
        } else {
            return false;
        }

    } else if (a < 0) {
        reverse = !!reverse;
        a = Math.abs(a);
    }

    if (!reverse) {
        for (var i = b - 1, len = siblings.length; i < len; i += a) {
            if ( i >= 0 && siblings[i] === node ) {
                return true;
            }
        }
    } else {
        for (var i = siblings.length - b, len = siblings.length; i >= 0; i -= a) {
            if ( i < len && siblings[i] === node ) {
                return true;
            }
        }
    }
    return false;
};

var getId = function(attr) {
    for (var i = 0, len = attr.length; i < len; ++i) {
        if (attr[i][0] == 'id' && attr[i][1] === '=') {
            return attr[i][2];
        }
    }
};

var getIdTokenIndex = function(tokens) {
    for (var i = 0, len = tokens.length; i < len; ++i) {
        if (getId(tokens[i].attributes)) {
            return i;
        }
    }
    return -1;
};

var patterns = {
    tag: /^((?:-?[_a-z]+[\w-]*)|\*)/i,
    //attributes: /^\[([a-z]+\w*)+([~\|\^\$\*!=]=?)?['"]?([^\]]*?)['"]?\]/i,
    //attributes: /^\[([data-row-]+\w*|[a-z]+\w*)+([~\|\^\$\*!=]=?)?['"]?([^\]]*?)['"]?\]/i,
    attributes: /^\[([a-z]+\w*)+([~\|\^\$\*!=]=?)?['"]?([^'"\]]*)['"]?\]*/i,
    pseudos: /^:([-\w]+)(?:\(['"]?(.+)['"]?\))*/i,
    combinator: /^\s*([>+~]|\s)\s*/
};

/**
    Break selector into token units per simple selector.
    Combinator is attached to left-hand selector.
 */
var tokenize = function(selector) {
    var token = {},     // one token per simple selector (left selector holds combinator)
        tokens = [],    // array of tokens
//        id,             // unique id for the simple selector (if found)
        found = false,  // whether or not any matches were found this pass
        match;          // the regex match

    selector = replaceShorthand(selector); // convert ID and CLASS shortcuts to attributes

    /*
        Search for selector patterns, store, and strip them from the selector string
        until no patterns match (invalid selector) or we run out of chars.

        Multiple attributes and pseudos are allowed, in any order.
        for example:
            'form:first-child[type=button]:not(button)[lang|=en]'
    */
    do {
        found = false; // reset after full pass
        for (var re in patterns) {
                if (!Rui.hasOwnProperty(patterns, re)) {
                    continue;
                }
                if (re != 'tag' && re != 'combinator') { // only one allowed
                    token[re] = token[re] || [];
                }
            if (match = patterns[re].exec(selector)) { // note assignment
                found = true;
                if (re != 'tag' && re != 'combinator') { // only one allowed
                    //token[re] = token[re] || [];

                    // capture ID for fast path to element
                    if (re === 'attributes' && match[1] === 'id') {
                        token.id = match[3];
                    }

                    token[re].push(match.slice(1));
                } else { // single selector (tag, combinator)
                    token[re] = match[1];
                }
                selector = selector.replace(match[0], ''); // strip current match from selector
                if (re === 'combinator' || !selector.length) { // next token or done
                    token.attributes = fixAttributes(token.attributes);
                    token.pseudos = token.pseudos || [];
                    token.tag = token.tag ? token.tag.toUpperCase() : '*';
                    tokens.push(token);

                    token = { // prep next token
                        previous: token
                    };
                }
            }
        }
    } while (found);

    return tokens;
};

var fixAttributes = function(attr) {
    var aliases = LDomSelector.attrAliases;
    attr = attr || [];
    for (var i = 0, len = attr.length; i < len; ++i) {
        if (aliases[attr[i][0]]) { // convert reserved words, etc
            attr[i][0] = aliases[attr[i][0]];
        }
        if (!attr[i][1]) { // use exists operator
            attr[i][1] = '';
        }
    }
    return attr;
};

var replaceShorthand = function(selector) {
    var shorthand = LDomSelector.shorthand;
    var attrs = selector.match(patterns.attributes); // pull attributes to avoid false pos on '.' and '#'
    if (attrs) {
        selector = selector.replace(patterns.attributes, 'REPLACED_ATTRIBUTE');
    }
    for (var re in shorthand) {
        if (!Rui.hasOwnProperty(shorthand, re)) {
            continue;
        }
        selector = selector.replace(getRegExp(re, 'gi'), shorthand[re]);
    }

    if (attrs) {
        for (var i = 0, len = attrs.length; i < len; ++i) {
            selector = selector.replace('REPLACED_ATTRIBUTE', attrs[i]);
        }
    }
    return selector;
};

LDomSelector = new LDomSelector();
LDomSelector.patterns = patterns;
Y.LDomSelector = LDomSelector;

//msie 8일 경우 className이 아니고 class이다. 
if (Rui.browser.msie) { // rewrite class for IE (others use getAttribute('class')// && eval(Rui.browser.version) < 8
    Y.LDomSelector.attrAliases['class'] = 'className';
    Y.LDomSelector.attrAliases['for'] = 'htmlFor';
}

})();

/**
 * @module util
 * @namespace Rui.util
 * @requires Rui
 * @class LDateLocale
 * @sample default
 */
Rui.util.LDateLocale = {
    a: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    A: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    b: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    B: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    c: '%a %d %b %Y %T %Z',
    p: ['AM', 'PM'],
    P: ['am', 'pm'],
    q: '%m%d%Y',
    Q: '%m%d%Y%H%M%S',
    r: '%I:%M:%S %p',
    x: '%d/%m/%Y',
    X: '%d/%m/%Y %T'
};
 
Rui.util.LDateLocale['en'] = Rui.merge(Rui.util.LDateLocale, {});

Rui.util.LDateLocale['en_US'] = Rui.merge(Rui.util.LDateLocale['en'], {
    c: '%a %d %b %Y %I:%M:%S %p %Z',
    x: '%m/%d/%Y',
    X: '%m/%d/%Y %I:%M:%S %p'
});

Rui.util.LDateLocale['en_GB'] = Rui.merge(Rui.util.LDateLocale['en'], {
    r: '%l:%M:%S %P %Z'
});
Rui.util.LDateLocale['en_AU'] = Rui.merge(Rui.util.LDateLocale['en']);
 
Rui.util.LDateLocale['ko'] = Rui.merge(Rui.util.LDateLocale, {
    a: ['일', '월', '화', '수', '목', '금', '토'],
    A: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
    b: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
    B: ['01월', '02월', '03월', '04월', '05월', '06월', '07월', '08월', '09월', '10월', '11월', '12월'],
    c: '%Y년 %b월 %d일  %a %T %Z',
    p: ['오전', '오후'],
    P: ['오전', '오후'],
    q: '%Y%m%d',
    Q: '%Y%m%d%H%M%S',
    x: '%Y-%m-%d',
    X: '%Y-%m-%d %T'
});

Rui.util.LDateLocale['ko_KR'] = Rui.merge(Rui.util.LDateLocale['ko']);

/**
 * @description 인스턴스를 얻어오는 메소드
 * @method getInstance
 * @public
 * @static
 * @param {String} sLocale
 * @return {Rui.util.LDateLocale}
 */
Rui.util.LDateLocale.getInstance = function(sLocale) {
    var dateLocale = Rui.util.LDateLocale[sLocale];
    var dateLocaleList = (Rui.getConfig) ? Rui.getConfig().getFirst('$.core.dateLocale.' + sLocale) : [];
    for (var key in dateLocaleList) {
        var val = dateLocaleList[key];
        dateLocale[key] = val;
    }
    return dateLocale;
};


/**
 * Base64 암호화를 지원하는 유틸리티
 * @module util
 * @namespace Rui
 * @requires Rui
 * @class LBase64
 * @static
 */
(function(){
Rui.LBase64 = {
    codex: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
    /**
     * @description 암호화 메소드
     * @method encode
     * @static
     * @param {String} input 입력값
     * @return {String}
     */
    encode: function (input) {
        var output = '';

        var enumerator = new LUtf8EncodeEnumerator(input);
        while (enumerator.moveNext()) {
            var chr1 = enumerator.current;

            enumerator.moveNext();
            var chr2 = enumerator.current;

            enumerator.moveNext();
            var chr3 = enumerator.current;

            var enc1 = chr1 >> 2;
            var enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
            var enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
            var enc4 = chr3 & 63;

            if (isNaN(chr2)) enc3 = enc4 = 64;
            else if (isNaN(chr3)) enc4 = 64;

            output += this.codex.charAt(enc1) + this.codex.charAt(enc2) + this.codex.charAt(enc3) + this.codex.charAt(enc4);
        }

        return output;
    },

    /**
     * @description 복호화 메소드
     * @method decode
     * @static
     * @param {String} input 입력값
     * @return {String}
     */
    decode: function (input) {
        var output = '';

        var enumerator = new LBase64DecodeEnumerator(input);
        while (enumerator.moveNext()) {
            var charCode = enumerator.current;

            if (charCode < 128)
                output += String.fromCharCode(charCode);
            else if ((charCode > 191) && (charCode < 224)) {
                enumerator.moveNext();
                var charCode2 = enumerator.current;

                output += String.fromCharCode(((charCode & 31) << 6) | (charCode2 & 63));
            } else {
                enumerator.moveNext();
                var charCode2 = enumerator.current;

                enumerator.moveNext();
                var charCode3 = enumerator.current;

                output += String.fromCharCode(((charCode & 15) << 12) | ((charCode2 & 63) << 6) | (charCode3 & 63));
            }
        }

        return output;
    }
};


function LUtf8EncodeEnumerator(input) {
    this._input = input;
    this._index = -1;
    this._buffer = [];
}

LUtf8EncodeEnumerator.prototype = {
    current: Number.NaN,
    moveNext: function() {
        if (this._buffer.length > 0) {
            this.current = this._buffer.shift();
            return true;
        } else if (this._index >= (this._input.length - 1)) {
            this.current = Number.NaN;
            return false;
        } else {
            var charCode = this._input.charCodeAt(++this._index);

            // '\r\n' -> '\n'
            //
            if ((charCode == 13) && (this._input.charCodeAt(this._index + 1) == 10)) {
                charCode = 10;
                this._index += 2;
            }

            if (charCode < 128) 
                this.current = charCode;
            else if ((charCode > 127) && (charCode < 2048)) {
                this.current = (charCode >> 6) | 192;
                this._buffer.push((charCode & 63) | 128);
            } else {
                this.current = (charCode >> 12) | 224;
                this._buffer.push(((charCode >> 6) & 63) | 128);
                this._buffer.push((charCode & 63) | 128);
            }

            return true;
        }
    }
};

function LBase64DecodeEnumerator(input) {
    this._input = input;
    this._index = -1;
    this._buffer = [];
}

LBase64DecodeEnumerator.prototype = {
    current: 64,
    moveNext: function() {
        if (this._buffer.length > 0) {
            this.current = this._buffer.shift();
            return true;
        } else if (this._index >= (this._input.length - 1)) {
            this.current = 64;
            return false;
        } else {
            var enc1 = Rui.LBase64.codex.indexOf(this._input.charAt(++this._index));
            var enc2 = Rui.LBase64.codex.indexOf(this._input.charAt(++this._index));
            var enc3 = Rui.LBase64.codex.indexOf(this._input.charAt(++this._index));
            var enc4 = Rui.LBase64.codex.indexOf(this._input.charAt(++this._index));

            var chr1 = (enc1 << 2) | (enc2 >> 4);
            var chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
            var chr3 = ((enc3 & 3) << 6) | enc4;

            this.current = chr1;

            if (enc3 != 64) this._buffer.push(chr2);

            if (enc4 != 64) this._buffer.push(chr3);

            return true;
        }
    }
};
})();
/**
 * 쿠키 관리를 위한 유틸리티
 * @module util
 * @title LCookie Utility
 * @namespace Rui.util
 */
Rui.namespace('Rui.util');
/**
 * LCookie utility.
 * @class LCookie
 * @static
 */
Rui.util.LCookie = {
    /**
     * document.cookie에 할당될 쿠키 문자열을 생성한다.
     * @param {String} name 쿠키의 이름
     * @param {String} value 쿠키의 값
     * @param {encodeValue} encodeValue 값을 인코딩 하려면 true, 기존대로 놔두려면 false
     * @param {Object} options (Optional) 쿠키에 대한 옵션
     * @return {String} 형식화된 쿠키 문자열
     * @method _createCookieString
     * @private
     * @static
     */
    _createCookieString: function(name /*:String*/, value /*:Variant*/, encodeValue /*:Boolean*/, options /*:Object*/) /*:String*/{
        var text /*:String*/ = encodeURIComponent(name) + '=' + (encodeValue ? encodeURIComponent(value) : value);
        if (Rui.isObject(options)) {
            //expiration date
            if (options.expires instanceof Date) {
                text += '; expires=' + options.expires.toGMTString();
            }
            //path
            if (Rui.isString(options.path) && options.path != '') {
                text += '; path=' + options.path;
            }
            //domain
            if (Rui.isString(options.domain) && options.domain != '') {
                text += '; domain=' + options.domain;
            }
            //secure
            if (options.secure === true) {
                text += '; secure';
            }
        }
        return text;
    },
    /**
     * 엑세스 가능한 모든 쿠키를 나타내는 object에 쿠키 문자열을 파싱한다.
     * @param {String} text 파싱할 쿠키 문자열.
     * @param {boolean} decode (Optional) 쿠키값을 디코딩할지에 대한 여부를 표시. 기본값은 true.
     * @return {Object} 각각의 엑세스 가능한 쿠키에 대한 항목(entry)을 포함하는 object
     * @method _parseCookieString
     * @private
     * @static
     */
    _parseCookieString: function(text /*:String*/, decode /*:Boolean*/) /*:Object*/{
        var cookies /*:Object*/ = new Object();
        if (Rui.isString(text) && text.length > 0) {
            var decodeValue = (decode === false ? function(s){
                return s;
            } : decodeURIComponent);
            
            if (/[^=]+=[^=;]?(?:; [^=]+=[^=]?)?/.test(text)) {
                var cookieParts /*:Array*/ = text.split(/;\s/g);
                var cookieName /*:String*/ = null;
                var cookieValue /*:String*/ = null;
                var cookieNameValue /*:Array*/ = null;
                for (var i = 0, len = cookieParts.length; i < len; i++) {
                    //check for normally-formatted cookie (name-value)
                    cookieNameValue = cookieParts[i].match(/([^=]+)=/i);
                    try {
                        if (cookieNameValue instanceof Array){
                            cookieName = decodeURIComponent(cookieNameValue[1]);
                            cookieValue = decodeValue(cookieParts[i].substring(cookieNameValue[1].length + 1));
                        }else{
                            //means the cookie does not have an '=', so treat it as a boolean flag
                            cookieName = decodeURIComponent(cookieParts[i]);
                            cookieValue = cookieName;
                        }
                        cookies[cookieName] = cookieValue;
                    } catch(e){}
                }
            }
        }
        return cookies;
    },
    
    //-------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------
    
    /**
     * 주어진 이름에 대한 쿠키값을 반환한다.
     * @param {String} name 조회할 쿠키의 이름
     * @param {Function} converter (Optional) 함수를 반환하기 전에 값에 대해 실행하기 위한 함수.
     *                  함수는 쿠키가 존재하지 않는 경우 사용되지 않는다.
     * @return {Variant} converter가 명시되지 않은 경우, 문자열이나 쿠키가 존재하지 않는다면 null을 반환한다. 
     *      converter가 명시된 경우 converter로부터의 반환값이나 쿠키가 존재하지 않는다면 null을 반환한다. 
     * @method get
     * @static
     */
    get: function(name /*:String*/, converter /*:Function*/) /*:Variant*/{
        var cookies /*:Object*/ = this._parseCookieString(document.cookie);
        if (!Rui.isString(name) || name === '') {
            throw new TypeError('Cookie.get(): Cookie name must be a non-empty string.');
        }
        if (Rui.isUndefined(cookies[name])) {
            return null;
        }
        if (!Rui.isFunction(converter)) {
            return cookies[name];
        }else{
            return converter(cookies[name]);
        }
    },
    /**
     * 이전에 유효 기간을 설정함으로 인하여 컴퓨터에서 쿠키를 삭제한다.
     * @param {String} name 삭제할 쿠키의 이름
     * @param {Object} options (Optional) 하나 혹은 여러개의 쿠키 옵션들을 포함한 object:
     *      path (a string), domain (a string), secure (true/false). 
     *      expire 옵션은 method에 의해 덮어 씌어질수 있다.
     * @return {String} 생성된 쿠키 문자열
     * @method remove
     * @static
     */
    remove: function(name /*:String*/, options /*:Object*/) /*:String*/{
        //check cookie name
        if (!Rui.isString(name) || name === '') {
            throw new TypeError('Cookie.remove(): Cookie name must be a non-empty string.');
        }
        document.cookie = name + '=;path=/;expires=;';
        return this;
    },

    /**
     * Sets a cookie with a given name and value.
     * 주어진 이름과 값으로 쿠키를 설정한다.
     * @param {String} name 설정할 쿠키의 이름
     * @param {Variant} value 쿠키에 대한 설정할 값
     * @param {Object} options (Optional) 하나 혹은 여러개의 쿠키 옵션들을 포함한 object:
     *      path (a string), domain (a string), expires (a Date object), secure (true/false).
     * @return {String} 생성된 쿠키 문자열
     * @method set
     * @static
     */
    set: function(name /*:String*/, value /*:Variant*/, options /*:Object*/) /*:String*/{
        if (!Rui.isString(name)) {
            throw new TypeError('Cookie.set(): Cookie name must be a string.');
        }
        if (Rui.isUndefined(value)) {
            throw new TypeError('Cookie.set(): Value cannot be undefined.');
        }
        
        var text /*:String*/ = this._createCookieString(name, value, true, options);
        document.cookie = text;
        return text;
    }
};

/**
 * static String 클래스는 String 타입의 데이터를 처리하는데 도움을 주는 함수들을 제공한다.
 * @module core
 * @title Rui Global
 * @namespace prototype
 * @class String
 */  

/**
 * @description 문자열 앞뒤 공백 제거
 * @method trim
 * @sample default
 * @return {String} 공백 제거된 문자열
 */
String.prototype.trim = function() {
     return Rui.util.LString.trim(this);
};
/**
 * @description 문자열의 왼쪽부터 특정 문자를 주어진 갯수만큼 붙여넣는다.
 * @method lPad
 * @sample default
 * @param {String} pad padding할 문자
 * @param {int} r 붙이는 갯수
 * @return {String} 결과 문자열
 */
String.prototype.lPad = function(pad, r) {
     return Rui.util.LString.lPad(this, pad, r);
};
/**
 * @description 문자열의 오른쪽부터 특정 문자를 주어진 갯수만큼 붙여넣는다.
 * @method rPad
 * @sample default
 * @param {String} pad padding할 문자
 * @param {int} r 붙이는 갯수
 * @return {String} 결과 문자열
 */
String.prototype.rPad = function(pad, r) {
     return Rui.util.LString.rPad(this, pad, r);
};
/**
 * @description 문자열을 주어진 format에 따라 Date 객체로 변환
 * @method toDate
 * @sample default
 * @param {Object|String} oConfig format or oConfig.format/oConfig.locale
 * @return {Date} oDate
 */
String.prototype.toDate = function(oConfig) {
    oConfig = typeof oConfig == 'string' ? { format:oConfig } : oConfig; 
     return Rui.util.LString.toDate(this, oConfig);
};
/**
 * @description 입력된 xml 문자열을 xml document object model로 변환해서 return
 * @method toXml
 * @sample default
 * @return {object} xml dom
 */
String.prototype.toXml = function() {
    return Rui.util.LString.toXml(this);
};
//--- 윗부분은 base/LDate.js로 부터 이동해옴.
/**
 * @description 문자열에 모든 공백 제거
 * @method trimAll
 * @sample default
 * @return {String} 모든 공백 제거된 문자열
 */
String.prototype.trimAll = function() {
     return Rui.util.LString.trimAll(this);
};
/**
 * @description 문자열을 주어진 길이만큼 잘라낸다.
 * @method cut
 * @sample default
 * @param {int} start 시작위치
 * @param {int} length 잘라낼 길이
 * @return {String} 잘라낸 후 문자열
 */
String.prototype.cut = function(start, length) {
     return Rui.util.LString.cut(this, start, length);
};
/**
 * @description 문자열을 처음부터 주어진 위치까지 잘라낸다.
 * @method lastCut
 * @sample default
 * @param {int} pos 잘라낼 위치
 * @return {String} 잘라낸 후 문자열
 */
String.prototype.lastCut = function(pos) {
     return Rui.util.LString.lastCut(this, pos);
};
/**
 * @description 시작 문자열이 pattern에 맞는지 여부를 리턴한다.
 * @method startsWith
 * @sample default
 * @param {String} pattern 문자패턴
 * @return {boolean} 결과
 */
String.prototype.startsWith = function(pattern) {
     return Rui.util.LString.startsWith(this, pattern);
};
/**
 * @description 종료 문자열이 pattern에 맞는지 여부를 리턴한다.
 * @method endsWith
 * @sample default
 * @param {String} pattern 문자패턴
 * @return {boolean} 결과
 */
String.prototype.endsWith = function(pattern) {
     return Rui.util.LString.endsWith(this, pattern);
};
/**
 * 자바스크립트의 내장 객체인 String 객체에 simpleReplace 메소드를 추가한다. simpleReplace 메소드는
 * 스트링 내에 있는 특정 스트링을 다른 스트링으로 모두 변환한다. String 객체의 replace 메소드와 동일한
 * 기능을 하지만 간단한 스트링의 치환시에 보다 유용하게 사용할 수 있다.
 * <pre>
 *     var str = 'abcde'
 *     str = str.simpleReplace('cd', 'xx');
 * </pre>
 * 위의 예에서 str는 'abxxe'가 된다.
 * @method simpleReplace
 * @sample default
 * @param {String} oldStr required 바뀌어야 될 기존의 스트링
 * @param {String} newStr required 바뀌어질 새로운 스트링
 * @return {String} replaced String.
 */
String.prototype.simpleReplace = function(oldStr, newStr) {
    return Rui.util.LString.simpleReplace(this, oldStr, newStr);
};
/**
 * 자바스크립트의 내장 객체인 String 객체에 insert 메소드를 추가한다. insert 메소드는 스트링의 특정 영역에
 * 주어진 스트링을 삽입한다.
 * <pre>
 *     var str = 'abcde'
 *     str = str.insert(3, 'xyz');
 * </pre>
 * 위의 예에서 str는 'abcxyzde'가 된다.
 * @method insert
 * @sample default
 * @param {int} index required 삽입할 위치. 해당 스트링의 index 바로 앞에 삽입된다. index는 0부터 시작.
 * @param {String} str   required 삽입할 스트링.
 * @return {String} inserted String.
 */
String.prototype.insert = function(index, str) {
    return this.substring(0, index) + str + this.substr(index);
};
/**
 * @description 문자열을 구분자를 통해 잘라낸다.
 * @method advancedSplit
 * @param {String} delim 구분자
 * @parma {String} options 옵션 I : 옵션 T:
 * @return {Array}
 */
String.prototype.advancedSplit = function(delim, options){
    return Rui.util.LString.advancedSplit(this, delim, options);
};
/**
 * @description 첫 문자만 대문자로 변환한다.
 * @method firstUpperCase
 * @sample default
 * @return {String} 변환 후 문자열
 */
String.prototype.firstUpperCase = function() {
    return Rui.util.LString.firstUpperCase(this);
};
/**
 * @description 스트링의 자릿수를 Byte 단위로 환산하여 알려준다. 영문, 숫자는 1Byte이고 한글은 2Byte이다.(자/모 중에 하나만 있는 글자도 2Byte이다.)
 * @method getByteLength
 * @return {int} 스트링의 길이
 */
String.prototype.getByteLength = function() {
    return Rui.util.LString.getByteLength(this);
};
/**
 * @description 입력된 문자열이 한글로 된 정보인지를 체크한다. 해당문자열이 한글과 스페이스의 조합일때만 true를 리턴한다.
 * @method isHangul
 * @return {boolean} 한글 여부
 */
String.prototype.isHangul = function() {
    return Rui.util.LString.isHangul(this);
};
/**
 * @description 문자열에 포함된 문자값을 모두 변경한다.
 * @method replaceAll
 * @param {String} s2 변경할 문자열
 * @param {String} s2 변경될 문자열
 * @return {String} 결과값
 */
String.prototype.replaceAll = function(s1, s2) {
    return Rui.util.LString.replaceAll(this, s1, s2);
};
/**
 * static Date 클래스는 Date 타입의 데이터를 처리하는데 도움을 주는 함수들을 제공한다.
 * @module core
 * @title Rui Global
 * @namespace prototype
 * @class Date
 */

/**
 * 자바스크립트의 내장 객체인 Date 객체에 format 메소드를 추가한다. format 메소드는 Date 객체가 가진 날짜를
 * 지정된 포멧의 스트링으로 변환한다.
 * <pre>
 *     var dateStr = new Date().format("YYYYMMDD");
 *
 *     참고 : Date 오브젝트 생성자들 - dateObj = new Date()
 *                             - dateObj = new Date(dateVal)
 *                             - dateObj = new Date(year, month, date[, hours[, minutes[, seconds[,ms]]]])
 * </pre>
 * 위의 예에서 오늘날짜가 2002년 3월 5일이라면 dateStr의 값은 "20020305"가 된다.
 * default pattern은 "YYYYMMDD"이다.
 * @method format
 * @sample default
 * @param {String|Object} oConfig pattern optional 변환하고자 하는 패턴 스트링이나 Config객체. (default : YYYYMMDD)
 * @return : Date를 표현하는 변환된 String.
 * @author : 임재현
 */
Date.prototype.format = function(oConfig){
    oConfig = typeof oConfig == 'string' ? { format: oConfig } : oConfig;
    return Rui.util.LDate.format(this, oConfig);
};
/**
 * 해당 instance에 지정된 시간량을 추가한다.
 * Day "D", Week "W", Year "Y", Month "M", Hour "H", Minute "m", Second "S", Milisecond "s"
 * @method add
 * @sample default
 * @param {String} field 추가적인 실행에 사용되는 field constant
 * @param {Number} amount  날짜에 추가하기 위한 unit들의 number(field constant에서 측정된)
 * @return {Date} Date object의 결과
 */
Date.prototype.add = function(field, amount) {
    return Rui.util.LDate.add(this, field, amount);
};
/**
 * @description 현재 날짜를 대상날짜와 format 형식에 맞게 비교한다. config를 주지 않을경우 %x(yyyy-mm-dd)로 비교한다.
 * @method equals
 * @sample default
 * @param {Date} date 비교 대상 date 객체
 * @param {Object} config [optional] format등 옵션
 * @return {boolean}
 */
Date.prototype.equals = function(d, config) {
    return Rui.util.LDate.equals(this, d, config);
};
/**
 * 시간을 제외한 날짜를 비교하여 현재 날짜와의 차이를 일자로 리턴한다.
 * @method compareTo
 * @sample default
 * @param {Date} date   비교 날짜 객체
 * @return {int} 
 */
Date.prototype.compareTo = function(compareDate){
    var date1 = this.clone();
    date1.setHours(0);
    date1.setMinutes(0);
    date1.setSeconds(0);
    compareDate.setHours(0);
    compareDate.setMinutes(0);
    compareDate.setSeconds(0);
    return parseInt((date1 - compareDate) / 1000 / 24 / 60 / 60, 10);
};
/**
 * @description 현재 날짜를 복사하여 리턴한다.
 * @method clone
 * @sample default
 * @return {Date}
 */
Date.prototype.clone = function() {
    return new Date(this.getFullYear(), this.getMonth(), this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds(), this.getMilliseconds());
};
// --- 윗부분은 base/LDate.js로 부터 이동해옴.
/**
 * startDate와 endDate 사이에 포함되어 있는지 여부
 * @method between
 * @sample default
 * @param {Date} startDate   범위 시작일자
 * @param {Date} endDate     범위 종료일자The end of the range
 * @return {boolean} 날짜가 비교날짜 사이에 있으면 true, 아닐 경우 false.
 */
Date.prototype.between = function(startDate, endDate){
    return Rui.util.LDate.between(this, startDate, endDate);
};
/**
 * Date객체의 Pattern에 따른 날짜 비교
 * @method compareString
 * @sample default
 * @param {Date} date2   Date2 객체
 * @param {Date} pattern     [optional] format pattern 문자
 * @return {boolean} true
 */
Date.prototype.compareString = function(date2, pattern){
    pattern = pattern || { format: '%q' };
    return Rui.util.LDate.compareString(this, date2, pattern);
};
/**
 * 1일에 해당되는 Date 객체를 리턴
 * @method getFirstDayOfMonth
 * @return {Date} The JavaScript Date representing the first day of the month
 */
Date.prototype.getFirstDayOfMonth = function(){
    return Rui.util.LDate.getFirstDayOfMonth(this);
};
/**
 * 마지막 날짜에 해당되는 Date 객체를 리턴
 * @method getLastDayOfMonth
 * @return {Date} The JavaScript Date representing the first day of the month
 */
Date.prototype.getLastDayOfMonth = function(){
    return Rui.util.LDate.getLastDayOfMonth(this);
};
/**
 * startOfWeek에 해당되는 요일에 맞는 Date 객체를 리턴
 * @method getFirstDayOfWeek 
 * @sample default
 * @param {Number} startOfWeek The index for the first day of the week, 0 = Sun, 1 = Mon ... 6 = Sat (defaults to 0)
 * @return {Date} The first day of the week
 */
Date.prototype.getFirstDayOfWeek = function(startOfWeek){
    return Rui.util.LDate.getFirstDayOfWeek(this, startOfWeek);
};
/**
 * static Number 클래스는 Number 타입의 데이터를 처리하는데 도움을 주는 함수들을 제공한다.
 * @module core
 * @title Rui Global
 * @namespace prototype
 * @class Number
 */

/**
 * 사용자에게 표시하기 위한 native JavaScript Number와 문자열 포맷을 가져온다.
 *
 * @method format
 * @sample default
 * @param {Number} nData Number.
 * @param {Object} oConfig (Optional) Optional 설정 값들:
 *  <dl>
 *   <dt>prefix {String}</dd>
 *   <dd>현재 지정자 "$"와 같은, 각 숫자 앞에 위치하는 문자열</dd>
 *   <dt>decimalPlaces {Number}</dd>
 *   <dd>반올림 하기 위한 소수점 위치 숫자.</dd>
 *   <dt>decimalSeparator {String}</dd>
 *   <dd>소수 구분 기호</dd>
 *   <dt>thousandsSeparator {String}</dd>
 *   <dd>천 단위 구분 기호</dd>
 *   <dt>suffix {String}</dd>
 *   <dd>"items"(공백을 참고하는)와 같은 각 숫자 이후에 추가된 문자열</dd>
 *  </dl>
 * @return {String} 표시하기 위한 Formatted number
 */
Number.prototype.format = function(oConfig) {
    return Rui.util.LNumber.format(this, oConfig);
};
/**
 * @description 요구되는 소수점 정밀도로 전달되는 숫자를 반올림 한다.
 * @method round
 * @sample default
 * @param {int} precision 첫번째 parameter의 값을 반올림하기 위한 소수점 위치 숫자
 * @return {int} 반올림 값
 */
Number.prototype.round = function(precision) {
    return Rui.util.LNumber.round(this, precision);
};
/**
 * static Array 클래스는 Array 타입의 데이터를 처리하는데 도움을 주는 함수들을 제공한다.
 * @module core
 * @title Rui Global
 * @namespace prototype
 * @class Array
 */

/**
 * items 배열에서 item이 존재하는지 여부를 리턴하는 메소드
 * @method contains
 * @sample default
 * @param {Object} item Array 배열
 * @return {boolean}
 */
Array.prototype.contains = function(obj) {
    return Rui.util.LArray.contains(this, obj);
};
/**
 * items 배열에서 index에 해당하는 객체를 삭제하는 메소드
 * @method removeAt
 * @sample default
 * @param {int} index 삭제할 위치
 * @return {Object} 삭제된 위치
 */
Array.prototype.removeAt = function(idx) {
    return Rui.util.LArray.removeAt(this, idx);
};
/**
 * HTML 조각 템플릿을 표현한다. 
 * 템플릿들은 더 나은 성능을 위해 미리 컴파일 될 수 있다.
 * 사용가능한 format 함수들의 목록에 대해서는 {@link Rui.util.LFormat}을 참조한다.
 * @module core
 * @namespace Rui
 * @class LTemplate
 * @constructor
 * @param {String/Array} html join('')하거나 여러 argument들에 join('')하기 위한 HTML 조각 혹은 조각들의 array
 */
Rui.LTemplate = function(html){
    var me = this,
        a = arguments,
        buf = [];

    if (Rui.isArray(html)) {
        html = html.join('');
    } else if (a.length > 1) {
        Rui.each(a, function(v) {
            if (Rui.isObject(v)) {
                Rui.apply(me, v);
            } else {
                buf.push(v);
            }
        });
        html = buf.join('');
    }

    /**@private*/
    me.html = html;
    if (me.compiled) {
        me.compile();
    }
};
Rui.LTemplate.prototype = {
    /**
     * 적용된 특정 값들을 가지고 있는 해당 템플릿의 HTML 조각을 반환한다.
     * @method applyTemplate
     * @param {Object/Array} values 템플릿 값들. 
     * @return {String} HTML 조각
     */
    applyTemplate: function(values){
        var me = this;
        return me.compiled ?
            me.compiled(values) :
            me.html.replace(me.re, function(m, name){
                return values[name] !== undefined ? values[name] : '';
            });
    },
    /**
    * 템플릿 변수들과 일치시키기 위해 사용되는 정규 표현식
    * @type RegExp
    * @property re
    * @private
    */
    re: /\{([\w-]+)\}/g,
    /**
     * 정규식 오버헤드를 제거하고 내부 함수에 템플릿을 컴파일한다.
     * @method compile
     * @private
     * @return {Rui.LTemplate} this
     */
    compile: function(){
        var me = this,
            sep = Rui.isGecko ? '+' : ',';
        function fn(m, name){                        
            name = "values['" + name + "']";
            return "'"+ sep + '(' + name + " == undefined ? '' : " + name + ')' + sep + "'";
        }
        eval("this.compiled = function(values){ return " + (Rui.isGecko ? "'" : "['") +
             me.html.replace(/\\/g, '\\\\').replace(/(\r\n|\n)/g, '\\n').replace(/'/g, "\\'").replace(this.re, fn) +
             (Rui.isGecko ?  "';};" : "'].join('');};"));
        return me;
    }
};
/**
 * 적용된 특정 값들을 가진 해당 템플릿의 HTML 조각을 반환한다.
 * @method apply
 * @param {Object/Array} values 템플릿 값들. 
 * @return {String} HTML 조각
 */
Rui.LTemplate.prototype.apply = Rui.LTemplate.prototype.applyTemplate;
