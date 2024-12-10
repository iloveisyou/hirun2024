/*
 * @(#) rui_base.js
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

if (typeof Rui == 'undefined' || !Rui) {
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
            htmlCss.push('L-ua-compatible');
        } else if (userAgent.indexOf("msie 9") > -1 && userAgent.indexOf("mozilla/4") > -1 && userAgent.indexOf("trident/5") > -1) {
            htmlCss.push('L-ua-compatible');
        } else if (userAgent.indexOf("msie 7") > -1 && userAgent.indexOf("trident") > -1) {
            htmlCss.push('L-ua-compatible');
        }
    }
    if(Rui.platform.isMobile) htmlCss.push('L-ua-mobile');
    document.documentElement.className += ' ' + htmlCss.join(' ');
    if(Rui.browser.msie6){
        try{
            document.execCommand('BackgroundImageCache', false, true);
        }catch(e){}
    }
    Rui.isSecure = (window.location.href.toLowerCase().indexOf('https') === 0) ? true : false;
    Rui.isStrict = document.compatMode == 'CSS1Compat';
    Rui.isBorderBox = Rui.browser.msie && !Rui.isStrict;
    Rui.namespace = function() {
        var a=arguments, o=null, i, j, d;
        for (i=0; i<a.length; i=i+1) {
            d=a[i].split('.');
            o=Rui;
            for (j=(d[0] == 'Rui') ? 1 : 0; j<d.length; j=j+1) {
                o[d[j]]=o[d[j]] || {};
                o=o[d[j]];
            }
        }
        return o;
    };
    Rui.log = function(msg, cat, src){
        if(window.console){
            console.log((cat ? cat + ': ' : '') + msg + (src ? ' - ' + src : ''));
        }
    };
    Rui.isNull = function(o){
        return Rui.util.LObject.isNull(o);
    };
    Rui.isUndefined = function(o){
        return Rui.util.LObject.isUndefined(o);
    };
    Rui.isObject = function(o){
        return Rui.util.LObject.isObject(o);
    };
    Rui.isFunction = function(o){
        return Rui.util.LObject.isFunction(o);
    };
    Rui.isBoolean = function(o){
        return Rui.util.LObject.isBoolean(o);
    };
    Rui.isString = function(o){
        return Rui.util.LString.isString(o);
    };
    Rui.isArray = function(o){
        return Rui.util.LArray.isArray(o);
    };
    Rui.isNumber = function(o){
        return Rui.util.LNumber.isNumber(o);
    };
    Rui.isDate = function(o){
        return Rui.util.LDate.isDate(o);
    };
    Rui.isEmpty = function(s){
        return Rui.util.LObject.isEmpty(s);
    };
    Rui.trim = function(s){
        return Rui.util.LString.trim(s);
    };
    Rui.emptyFn = function() {};
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
    Rui.applyObject = function(r, s) {
        if (!s||!r) {
            throw new Error('Absorb failed, verify dependencies.');
        }
        var a=arguments, i, p, override=a[2];
        override=true;
        if (override && override!==true) { 
            for (i=2; i<a.length; i=i+1) {
                r[a[i]] = s[a[i]];
            }
        } else { 
            for (p in s) {
                if (override || !(p in r)) {
                    r[p] = s[p];
                }
            }
            Rui._IEEnumFix(r, s);
        }
    };
    Rui.applyPrototype = function(r, s) {
        if (!s||!r) {
            throw new Error('Augment failed, verify dependencies.');
        }
        var a=[r.prototype,s.prototype];
        for (var i=2;i<arguments.length;i=i+1) {
            a.push(arguments[i]);
        }
        Rui.applyIf.apply(this, a);
    };
    Rui.applyIf = function(o, c){
        if(o && c){
            for (var p in c){
                if(typeof o[p] == 'undefined'){ o[p] = c[p]; }
            }
        }
        return o;
    };
    Rui.merge = function() {
        var o={}, a=arguments;
        for (var i=0, l=a.length; i<l; i=i+1) {
            Rui.applyObject(o, a[i], true);
        }
        return o;
    };
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
    Rui.getDoc = function(isDom){
        var doc = window.document;
        return isDom ? doc : Rui.get(doc);
    };
    Rui.getBody = function(isDom){
        var body = document.body || document.documentElement;
        return isDom ? body : Rui.get(body);
    };
    Rui.onReady = function(p_fn, p_obj, p_override){
        Rui.util.LEvent.onDOMReady(p_fn, p_obj, p_override);
    };
    Rui.onContentReady = function(p_id, p_fn, p_obj, p_override) {
        Rui.util.LEvent.onContentReady(p_id, p_fn, p_obj, p_override);
    };
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
    Rui.id = function(el, prefix){
        return Rui.util.LDom.generateId(el, prefix);
    };
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
    Rui.query = function (selector, root, firstOnly) {
        return Rui.util.LDomSelector.query(selector, root, firstOnly);
    };
     Rui.each = function(items, func, scope) {
         return Rui.util.LArray.each(items, func, scope);
     };
    Rui.dump = function(o, d) {
        var i, len, s=[], OBJ='{...}', FUN='f(){...}',
            COMMA=', ', ARROW=' => ';
        if (!Rui.isObject(o)) {
            return o + '';
        } else if (o instanceof Date || ('nodeType' in o && 'tagName' in o)) {
            return o;
        } else if  (Rui.isFunction(o)) {
            return FUN;
        }
        d = (Rui.util.LNumber.isNumber(d)) ? d : 3;
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
    Rui.createElements = function(html, options) {
        return Rui.util.LDom.createElements(html, options);
    };
    Rui.hasOwnProperty = (Object.prototype.hasOwnProperty) ?
        function(o, prop) {
            return o && o.hasOwnProperty(prop);
        } : function(o, prop) {
            return !Rui.isUndefined(o[prop]) && o.constructor.prototype[prop] !== o[prop];
        };
    Rui.augment = Rui.applyPrototype;
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
})();
if(document.attachEvent) {
    window.attachEvent('onerror', function(message, filename, lineno){
        Rui.updateLog(message, filename, lineno);
    });
}
Rui.namespace('Rui.util');
Rui.util.LNumber = {
    isNumber: function(o) {
        return (o instanceof Number || typeof o === 'number') && isFinite(o);
    },
    format: function(nData, oConfig){
        if (Rui.isNumber(nData)) {
            var bNegative = (nData < 0);
            var sOutput = nData + '';
            var sDecimalSeparator = (oConfig.decimalSeparator) ? oConfig.decimalSeparator : '.';
            var nDotIndex;
            oConfig.decimalPrecision = oConfig.decimalPlaces || oConfig.decimalPrecision;
            if (Rui.isNumber(oConfig.decimalPrecision)) {
                var nDecimalPlaces = oConfig.decimalPrecision;
                var nDecimal = Math.pow(10, nDecimalPlaces);
                sOutput = +(Math.round(nData + "e+" + nDecimalPlaces)  + "e-" + nDecimalPlaces) + '';
                nDotIndex = sOutput.lastIndexOf('.');
                if (nDecimalPlaces > 0) {
                    if (nDotIndex < 0) {
                        sOutput += sDecimalSeparator;
                        nDotIndex = sOutput.length - 1;
                    }
                    else 
                        if (sDecimalSeparator !== '.') {
                            sOutput = sOutput.replace('.', sDecimalSeparator);
                        }
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
            sOutput = (oConfig.prefix) ? oConfig.prefix + sOutput : sOutput;
            sOutput = (oConfig.suffix) ? sOutput + oConfig.suffix : sOutput;
            return sOutput;
        }
        else {
            return nData;
        }
    },
    random: function(range) {
        return Math.ceil(Math.random()*range);
    }
};
Rui.namespace('Rui.util');
Rui.util.LArray = {
    each: function(items, func, scope) {
        var max = items.length;
        for (var i = 0 ; i < max; i++) {
            if(func.call(scope || window, items[i], i, max) == false) 
                break;
        }
    },
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
    contains: function(items, item) {
        return (this.indexOf(items, item) >= 0) ? true : false;
    },
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
    isArray: function(o) { 
        if (o) {
           return Rui.isNumber(o.length) && Rui.isFunction(o.splice);
        }
        return false;
    }
};
Rui.namespace('Rui.util');
(function(){
    Rui.util.LString = {
        trim: function(s){
            return s.replace(/^\s+|\s+$/g, '');
        },
        startsWith: function(s, pattern){
            return s.indexOf(pattern) === 0;
        },
        endsWith: function(s, pattern){
            var d = s.length - pattern.length;
            return d >= 0 && s.lastIndexOf(pattern) === d;
        },
        lPad: function(x, pad, r){
            x += '';
            r = r || x.length + 1;
            for (; x.length < r && r > 0; ) {
                x = pad.toString() + x;
            }
            return x.toString();
        },
        rPad: function(x, pad, r){
            x += '';
            r = r || x.length + 1;
            for (; x.length < r && r > 0; ) {
                x = x + pad.toString();
            }
            return x.toString();
        },
        cut: function(s, start, length){
            return s.substring(0, start) + s.substr(start + length);
        },
        toDate: function(sDate, oConfig){
             return Rui.util.LDate.parse(sDate, oConfig);
        },
        toXml: function(text){
            var xmlDoc = null;
            if (window.DOMParser) {
                var parser = new DOMParser();
                xmlDoc = parser.parseFromString(text, 'text/xml');
            }
            else 
            {
                xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
                xmlDoc.async = 'false';
                xmlDoc.loadXML(text);
            }
            return xmlDoc;
        },
        isString: function(o) {
            return typeof o === 'string';
        },
        isEmpty: function(s){
            return (s === null || s === undefined || s === '');
        },
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
        firstUpperCase: function(s){
            if (s != null && s.length > 0)
                return s.charAt(0).toUpperCase() + s.substring(1);
            return s;
        },
        firstLowerCase: function(s){
            if (s != null && s.length > 0)
                return s.charAt(0).toLowerCase() + s.substring(1);
            return s;
        },
        getByteLength: function(value){
            var byteLength = 0;
            if (Rui.isEmpty(value)) {
                return 0;
            }
            var c;
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
Rui.namespace('Rui.util');
Rui.util.LObject = {
    clone: function(o, literal, fn){
        var loop = 0;
        var maxLoop = 1000;
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
    isBoolean: function(o) {
        return typeof o === 'boolean';
    },
    isFunction: function(o) {
        return typeof o === 'function';
    },
    isNull: function(o) {
        return o === null;
    },
    isUndefined: function(o) {
        return  o === undefined;
    },
    isEmpty: function(s){
        return (s === null || s === undefined || s === '');
    },
    isObject: function(o) {
        return (o && (typeof o === 'object' || Rui.isFunction(o))) || false;
    },
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
(function(){
    var xPad = function(x, pad, r){
        r = r || 10;
        for (; parseInt(x, 10) < r && r > 1; r /= 10) {
            x = pad.toString() + x;
        }
        return x.toString();
    };
    var Dt = {
        DAY: "D",
        WEEK: "W",
        YEAR: "Y",
        MONTH: "M",
        HOUR:"H",
        MINUTE: "m",
        SECOND: "S",
        MILLISECOND: "s",
        ONE_DAY_MS: 1000* 60* 60* 24,
        WEEK_ONE_JAN_DATE: 1,
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
        subtract: function(date, field, amount) {
            return this.add(date, field, (amount * -1));
        },
        _addDays: function(d, nDays) {
            if (Rui.browser.webkit && Rui.browser.webkit < 420) {
                if (nDays < 0) {
                    for (var min = -128; nDays < min; nDays -= min) {
                        d.setDate(d.getDate() + min);
                    }
                } else {
                    for (var max = 96; nDays > max; nDays -= max) {
                        d.setDate(d.getDate() + max);
                    }
                }
            }
            d.setDate(d.getDate() + nDays);
        },
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
            q: 'locale',
            Q: 'locale',
            r: 'locale',
            R: '%H:%M',
            t: '\t',
            T: '%H:%M:%S',
            x: 'locale',
            X: 'locale'
        },
        format: function (date, config) {
            config = config || {};
            if(Rui.isString(date)) {
                date = Rui.util.LDate.parse(date,{locale:config.locale});
            }
            var sLocale = config.locale;
            var format = config.format;
            if(!format && Rui.isString(config)) format = config;
            format = Dt.getFormat(format, sLocale);
            if(!date.getFullYear)
            	return Rui.isValue(date) ? date : "";
            if(format === 'YYYY/MM/LDD') {
                format = '%Y/%m/%d';
            } else if(format === 'LDD/MM/YYYY') {
                format = '%d/%m/%Y';
            } else if(format === 'MM/LDD/YYYY') {
                format = '%m/%d/%Y';
            }
            var aLocale = Dt.getLocale(sLocale);
            var replace_aggs = function (m0, m1) {
                var f = Dt.aggregates[m1];
                return (f === 'locale' ? aLocale[m1] : f);
            };
            while (format.match(/%[cDFhnrRtTxX]/)) {
                format = format.replace(/%([cDFhnrRtTxX])/g, replace_aggs);
            }
            var replace_formats = function (m0, m1) {
                var f = Dt.formats[m1];
                if(typeof f === 'string') {             
                    return date[f]();
                } else if(typeof f === 'function') {    
                    return f.call(date, date, aLocale);
                } else if(typeof f === 'object' && typeof f[0] === 'string') {  
                    return xPad(date[f[0]](), f[1]);
                } else {
                    return m1;
                }
            };        
            var str = format.replace(/%([aAbBCdegGHIjklmMpPsSuUVwWyYzZ%])/g, replace_formats);
            replace_aggs = replace_formats = undefined;
            return str;
        },
        getLocale: function (sLocale){
            sLocale = sLocale || ((Rui.getConfig) ? Rui.getConfig().getFirst("$.core.defaultLocale") : "ko");
            return Rui.util.LDateLocale.getInstance(sLocale);
        },
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
        equals: function(d1, d2, config) {
            config = config || { format:'%x' };
            return (d1.format(config.format) == d2.format(config.format));
        },
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
        getDayInMonth: function(inx){
            return Rui.util.LDate.DAYS_IN_MONTH[inx];
        },
        getFirstDayOfMonth: function(date) {
            var start = this.getDate(date.getFullYear(), date.getMonth(), 1);
            return start;
        },
        getLastDayOfMonth: function(date) {
            var start = this.getFirstDayOfMonth(date);
            var nextMonth = this.add(start, this.MONTH, 1);
            var end = this.subtract(nextMonth, this.DAY, 1);
            return end;
        },
        getFirstDayOfWeek: function(dt, startOfWeek) {
            startOfWeek = startOfWeek || 0;
            var dayOfWeekIndex = dt.getDay(),
                dayOfWeek = (dayOfWeekIndex - startOfWeek + 7) % 7;
            return this.subtract(dt, this.DAY, dayOfWeek);
        },
        clearTime: function(date) {
            date.setHours(12, 0, 0, 0);
            return date;
        },
        isDate: function(o) {
            return o && (typeof o.getFullYear == 'function');
        },
        before: function(date, compareTo) {
            if (date.getTime() < compareTo.getTime())
                return true;
            else
                return false;
        },
        after: function(date, compareTo) {
            if (date.getTime() > compareTo.getTime())
                return true;
            else
                return false;
        },
        between: function(date, dateBegin, dateEnd) {
            if (this.after(date, dateBegin) && this.before(date, dateEnd))
                return true;
            else
                return false;
        }
    };
    Dt.Parser = function(format, locale){
        this.format = format;
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
        this.locale = locale;
        this.regexp = new RegExp("^" + pattern.join("") + "$");
        this.expected = expected;
    };
    Dt.Parser.DIRECTIVE_PATTERNS = {
        "a": function(l) { return "(" + l.a.join("|") + ")"; },
        "b": function(l) { return "(" + l.b.join("|") + ")"; },
        "B": function(l) { return "(" + l.B.join("|") + ")"; },
        "p": function(l) { return "(" + l.p.join("|") + ")"; },
        "d": "(\\d\\d?)",      
        "H": "(\\d\\d?)",      
        "I": "(\\d\\d?)",      
        "m": "(\\d\\d?)",      
        "M": "(\\d\\d?)",      
        "S": "(\\d\\d?)",      
        "y": "(\\d\\d?)",      
        "Y": "(\\d\\d\\d\\d)", 
        "%": "%"               
    };
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
        parse: function(input){
            var matches = this.regexp.exec(input);
            if (matches === null){
                return false;
            }
            var data = {};
            for (var i = 1, l = matches.length; i < l; i++){
                data[this.expected[i -1]] = matches[i];
            }
            var time = [1900, 1, 1, 0, 0, 0, 0, 1, -1];
            if (typeof data["Y"] != "undefined"){
                var year = parseInt(data["Y"], 10);            
                if (year < 1900)
                {
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
            if (typeof data["m"] != "undefined"){
                var month = parseInt(data["m"], 10);
                if (month < 1 || month > 12)
                {
                    return false;
                }
                time[1] = month;
            }else if (typeof data["B"] != "undefined"){
                time[1] = this._indexOf(data["B"], this.locale.B) + 1;
            }else if (typeof data["b"] != "undefined"){
                time[1] = this._indexOf(data["b"], this.locale.b) + 1;
            }
            if (typeof data["d"] != "undefined"){
                var day = parseInt(data["d"], 10);
                if (day < 1 || day > 31){
                    return false;
                }
                time[2] = day;
            }
            if (typeof data["H"] != "undefined"){
                var hour = parseInt(data["H"], 10);
                if (hour > 23){
                    return false;
                }
                time[3] = hour;
            }else if (typeof data["I"] != "undefined"){
                var hour = parseInt(data["I"], 10);
                if (hour < 1 || hour > 12){
                    return false;
                }
                if (hour == 12){
                    hour = 0;
                }
                time[3] = hour;
                if (typeof data["p"] != "undefined"){
                    if (data["p"] == this.locale.p[1]){
                        time[3] = time[3] + 12;
                    }
                }
            }
            if (typeof data["M"] != "undefined"){
                var minute = parseInt(data["M"], 10);
                if (minute > 59){
                    return false;
                }
                time[4] = minute;
            }
            if (typeof data["S"] != "undefined"){
                var second = parseInt(data["S"], 10);
                if (second > 59){
                    return false;
                }
                time[5] = second;
            }
            var day = time[2], month = time[1], year = time[0];
            if (((month == 4 || month == 6 || month == 9 || month == 11) && day > 30)
                || (month == 2 && day > ((year % 4 == 0 && year % 100 != 0 || year % 400 == 0) ? 29 : 28))) {
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
    Dt.parse = function(sDate, config) {
        sDate = Rui.util.LString.trim(sDate);
        config = config || {};
        var format = config.format;
        if(!format){
            var tempDate = Dt.format(new Date(),{locale:config.locale,format:"%q"});
            if(sDate.length == tempDate.length)
                format = "%Y%m%d";
            else        
                format = '%Y%m%d%H%M%S';
        }
        var locale = config.locale;
        return new Dt.Parser(Dt.getFormat(format,locale), Dt.getLocale(locale)).parse(sDate);
    };
    Rui.namespace('Rui.util');
    Rui.util.LDate = Dt;
    Rui.util.LDate.DAYS_IN_MONTH = [31,28,31,30,31,30,31,31,30,31,30,31];
})();
Rui.util.LFunction = {
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
    defer: function(fn, millis, obj, args, appendArgs){
        fn = Rui.util.LFunction.createDelegate(fn, obj, args, appendArgs);
        if(millis > 0)
            return setTimeout(fn, millis);
        fn();
        return 0;
    },
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
    return {
        encodeDate: function(o){
            return '"' + o.getFullYear() + "-" +
                lPad(o.getMonth() + 1, '0') + "-" +
                lPad(o.getDate(), '0') + "T" +
                lPad(o.getHours(), '0') + ":" +
                lPad(o.getMinutes(), '0') + ":" +
                lPad(o.getSeconds(), '0') + '"';
        },
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
                            if (/,/.test(loc)) { 
                                for (var s = loc.split(/'?,'?/), i = 0, n = s.length; i < n; i++) 
                                    LJson.P.trace(s[i] + ";" + x, val, path);
                            }
                            else 
                                if (/^\(.*?\)$/.test(loc)) 
                                    LJson.P.trace(LJson.P.eval(loc, val, path.substr(path.lastIndexOf(";") + 1)) + ";" + x, val, path);
                                else 
                                    if (/^\?\(.*?\)$/.test(loc)) 
                                        LJson.P.walk(loc, x, val, path, function(m, l, x, v, p){
                                            if (LJson.P.eval(l.replace(/^\?\((.*?)\)$/, "$1"), v[m], m)) 
                                                LJson.P.trace(m + ";" + x, v, p);
                                        });
                                    else 
                                        if (/^(-?[0-9]*):(-?[0-9]*):?([0-9]*)$/.test(loc)) 
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
(function() {
    var Y = Rui.util,     
        getStyle,           
        setStyle,           
        propertyCache = {}, 
        reClassNameCache = {},          
        document = window.document;     
    Rui.env._id_counter = Rui.env._id_counter || 0;     
    var isIE678 = Rui.browser.msie678;
    var patterns = {
        HYPHEN: /(-[a-z])/i, 
        ROOT_TAG: /^body|html$/i, 
        OP_SCROLL:/^(?:inline|table-row)$/i
    };
    var testElement = function(node, method) {
        return node && node.nodeType == 1 && ( !method || method(node) );
    };
    var toCamel = function(property) {
        if ( !patterns.HYPHEN.test(property) ) {
            return property; 
        }
        if (propertyCache[property]) { 
            return propertyCache[property];
        }
        var converted = property;
        while ( patterns.HYPHEN.exec(converted) ) {
            converted = converted.replace(RegExp.$1,
                    RegExp.$1.substr(1).toUpperCase());
        }
        propertyCache[property] = converted;
        return converted;
    };
    var getClassRegEx = function(className) {
        var re = reClassNameCache[className];
        if (!re) {
            re = new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)');
            reClassNameCache[className] = re;
        }
        return re;
    };
    if (document.defaultView && document.defaultView.getComputedStyle && !isIE678) { 
        getStyle = function(el, property) {
            var value = null;
            if (property == 'float') { 
                property = 'cssFloat';
            }
            var computed = el.ownerDocument.defaultView.getComputedStyle(el, '');
            if (computed) { 
                value = computed[toCamel(property)];
            }
            return el.style[property] || value;
        };
    } else if (document.documentElement.currentStyle && isIE678) { 
        getStyle = function(el, property) {                         
            switch( toCamel(property) ) {
                case 'opacity':
                    var val = 100;
                    try { 
                        val = el.filters['DXImageTransform.Microsoft.Alpha'].opacity;
                    } catch(e) {
                        try { 
                            val = el.filters('alpha').opacity;
                        } catch(e) {
                        }
                    }
                    return val / 100;
                case 'float': 
                    property = 'styleFloat'; 
                default: 
                    var value = el.currentStyle ? el.currentStyle[property] : null;
                    return ( el.style[property] || value );
            }
        };
    } else { 
        getStyle = function(el, property) { return el.style[property]; };
    }
    if (isIE678) {
        setStyle = function(el, property, val) {
            switch (property) {
                case 'opacity':
                    if ( Rui.isString(el.style.filter) ) { 
                        el.style.filter = 'alpha(opacity=' + val * 100 + ')';
                        if (!el.currentStyle || !el.currentStyle.hasLayout) {
                            el.style.zoom = 1; 
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
    Rui.util.LDom = {
        generateId: function(el, prefix) {
            prefix = prefix || 'L-gen';
            var f = function(el) {
                if (el && el.id && !(Rui.useFixedId())) { 
                    return el.id;
                } 
                var id = (prefix.indexOf('L-gen') != -1) ? prefix + Rui.env._id_counter++ : prefix;
                if (el) {
                    el.id = id;
                }
                return id;
            };
            return Y.LDom.batch(el, f, Y.LDom, true) || f.apply(Y.LDom, arguments);
        },
        get: function(el) {
            if (el) {
                if (el.nodeType || el.item) { 
                    return el;
                }
                if (typeof el === 'string') { 
                    return document.getElementById(el);
                }
                if ('length' in el) { 
                    var c = [];
                    for (var i = 0, len = el.length; i < len; ++i) {
                        c[c.length] = Y.LDom.get(el[i]);
                    }
                    return c;
                }
                return el; 
            }
            return null;
        },
        getStyle: function(el, property) {
            property = toCamel(property);
            var f = function(element) {
                return getStyle(element, property);
            };
            return Y.LDom.batch(el, f, Y.LDom, true);
        },
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
        hasClass: function(el, className) {
            var re = getClassRegEx(className);
            var f = function(el) {
                return re.test(el.className);
            };
            return Y.LDom.batch(el, f, Y.LDom, true);
        },
        addClass: function(el, className) {
            var f = function(el) {
                if (this.hasClass(el, className)) {
                    return false; 
                }
                el.className = Rui.trim([el.className, className].join(' '));
                return true;
            };
            return Y.LDom.batch(el, f, Y.LDom, true);
        },
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
                        if ( this.hasClass(el, cn) ) { 
                            this.removeClass(el, cn);
                        }
                        el.className = Rui.trim(el.className); 
                        if (el.className === '') { 
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
        replaceClass: function(el, oldClassName, newClassName) {
            if (!newClassName || oldClassName === newClassName) { 
                return false;
            }
            var re = getClassRegEx(oldClassName);
            var f = function(el) {
                if ( !this.hasClass(el, oldClassName) ) {
                    this.addClass(el, newClassName); 
                    return true; 
                }
                el.className = el.className.replace(re, ' ' + newClassName + ' ');
                if ( this.hasClass(el, oldClassName) ) { 
                    this.removeClass(el, oldClassName);
                }
                el.className = Rui.trim(el.className); 
                return true;
            };
            return Y.LDom.batch(el, f, Y.LDom, true);
        },
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
        getAncestorBy: function(node, method) {
            while ( (node = node.parentNode) ) { 
                if ( testElement(node, method) ) {
                    return node;
                }
            } 
            return null;
        },
        getAncestorByClassName: function(node, className) {
            node = Y.LDom.get(node);
            if (!node) {
                return null;
            }
            var method = function(el) { return Y.LDom.hasClass(el, className); };
            return Y.LDom.getAncestorBy(node, method);
        },
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
        isAncestor: function(haystack, needle) {
            haystack = Y.LDom.get(haystack);
            needle = Y.LDom.get(needle);
            var ret = false;
            if ( (haystack && needle) && (haystack.nodeType && needle.nodeType) ) {
                if (haystack.contains && haystack !== needle) { 
                    ret = haystack.contains(needle);
                }
                else if (haystack.compareDocumentPosition) { 
                    ret = !!(haystack.compareDocumentPosition(needle) & 16);
                }
            } else {
            }
            return ret;
        },
        inDocument: function(el) {
            return this.isAncestor(document.documentElement, el);
        },
        batch: function(el, method, o, override) {
            el = (el && (el.tagName || el.item)) ? el : Y.LDom.get(el); 
            if (!el || !method) {
                return false;
            } 
            var scope = (override) ? o : window;
            if (el.tagName || el.length === undefined) { 
                return method.call(scope, el, o);
            } 
            var collection = [];
            for (var i = 0, len = el.length; i < len; ++i) {
                collection[collection.length] = method.call(scope, el[i], o);
            }
            return collection;
        },
        getChildren: function(node) {
            node = Y.LDom.get(node);
            return Y.LDom.getChildrenBy(node);
        },
        getChildrenBy: function(node, method) {
            var child = Y.LDom.getFirstChildBy(node, method);
            var children = child ? [child] : [];
            Y.LDom.getNextSiblingBy(child, function(node) {
                if ( !method || method(node) ) {
                    children[children.length] = node;
                }
                return false; 
            });
            return children;
        },
        getFirstChild: function(node, method) {
            node = Y.LDom.get(node);
            if (!node) {
                return null;
            }
            return Y.LDom.getFirstChildBy(node);
        }, 
        getFirstChildBy: function(node, method) {
            var child = ( testElement(node.firstChild, method) ) ? node.firstChild : null;
            return child || Y.LDom.getNextSiblingBy(node.firstChild, method);
        },
        getFirstChildByTagName: function(node,tagName){
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
        getLastChild: function(node) {
            node = Y.LDom.get(node);
            return Y.LDom.getLastChildBy(node);
        },
        getLastChildBy: function(node, method) {
            if (!node) {
                return null;
            }
            var child = ( testElement(node.lastChild, method) ) ? node.lastChild : null;
            return child || Y.LDom.getPreviousSiblingBy(node.lastChild, method);
        },
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
        getPreviousSibling: function(node) {
            node = Y.LDom.get(node);
            if (!node) {
                return null;
            }
            return Y.LDom.getPreviousSiblingBy(node);
        }, 
        getPreviousSiblingBy: function(node, method) {
            while (node) {
                node = node.previousSibling;
                if ( testElement(node, method) ) {
                    return node;
                }
            }
            return null;
        },
        getNextSibling: function(node) {
            node = Y.LDom.get(node);
            if (!node) {
                return null;
            }
            return Y.LDom.getNextSiblingBy(node);
        },
        getNextSiblingBy: function(node, method) {
            while (node) {
                node = node.nextSibling;
                if ( testElement(node, method) ) {
                    return node;
                }
            }
            return null;
        }, 
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
        insertBefore: function(newNode, referenceNode) {
            newNode = Y.LDom.get(newNode); 
            referenceNode = Y.LDom.get(referenceNode); 
            if (!newNode || !referenceNode || !referenceNode.parentNode) {
                return null;
            }       
            return referenceNode.parentNode.insertBefore(newNode, referenceNode); 
        },
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
        removeChildNodes: function(dom){
            return;
            while (dom.firstChild) {
                dom.removeChild(dom.firstChild);
            }
        },
        replaceChild: function(newNode, oldNode) {
            return oldNode.parentNode.replaceChild(newNode, oldNode);
        },
        appendHtml: function(dom, html) {
            if(Rui.platform.isMobile == true) 
                Rui.util.LDom.appendHtml1(dom, html);
            else 
                Rui.util.LDom.appendHtml2(dom, html);
        },
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
        createElements: function(html, options) {
            html = Rui.util.LString.trim(html);
            options = options || {};
            var match = /^<(\w+)\s*\/?>$/.exec(html);
            if(match) return Rui.get(document.createElement(match[1]));
            var div = document.createElement('div');
            var tags = html.replace(/^\s+/, '').substring(0, 10).toLowerCase();
            var wrap =
                !tags.indexOf('<opt') &&
                [ 1, "<select multiple='multiple'>", "</select>" ] ||
                !tags.indexOf("<leg") &&
                [ 1, "<fieldset>", "</fieldset>" ] ||
                tags.match(/^<(thead|tbody|tfoot|colg|cap)/) &&
                [ 1, "<table>", "</table>" ] ||
                !tags.indexOf("<tr") &&
                [ 2, "<table><tbody>", "</tbody></table>" ] ||
                (!tags.indexOf("<td") || !tags.indexOf("<th")) &&
                [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ] ||
                !tags.indexOf("<col") &&
                [ 2, "<table><tbody></tbody><colgroup>", "</colgroup></table>" ] ||
                /*!jQuery.support.htmlSerialize &&
                [ 1, "div<div>", "</div>" ] ||*/
                [ 0, '', '' ];
            div.innerHTML = wrap[1] + html + wrap[2];
            while ( wrap[0]-- )
                div = div.lastChild;
            var element = [];
            for (var i = 0 ; i < div.childNodes.length; i++) {
                var dom = div.childNodes[i];
                for (m in options) dom[m] = options[m];
                element.push(Rui.get(dom));
            }
            return new Rui.LElementList(element);
        },
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
        findParentNode: function(dom, simpleSelector, maxDepth){
            return this.findParent(dom.parentNode, simpleSelector, maxDepth);
        },
        isDom: function(id) {
            return document.getElementById(id) != null;
        },
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
if(!Rui.util.LKey){
    Rui.util.LKey = {
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
Rui.util.LSubscriber = function(fn, obj, override, system) {
    this.fn = fn;
    this.obj = Rui.isUndefined(obj) ? null : obj;
    this.override = override;
    this.system = system;
};
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
Rui.util.LSubscriber.prototype.contains = function(fn, obj) {
    if (obj) {
        return (this.fn == fn && this.obj == obj);
    } else {
        return (this.fn == fn);
    }
};
Rui.util.LSubscriber.prototype.toString = function() {
    return "Subscriber { obj: " + this.obj  + ", override: " +  (this.override || "no") + " }";
};
Rui.util.LEventProvider = function() { };
Rui.util.LEventProvider.prototype = {
    otype: 'Rui.util.LEventProvider',
    __RUI_events: null,
    __RUI_subscribers: null,
    __simple_events: null,
    createEvent: function(p_type, options) {
        options = options || {};
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
    on: function(p_type, p_fn, p_obj, p_override, options) {
        options = options || {};
        if(options && options.isCE === true || (this.ceMap && this.ceMap[p_type]))
            this.cOn(p_type, p_fn, p_obj, p_override, options.system);
        else
            this.sOn(p_type, p_fn, p_obj, p_override, options);
        options = null;
        return this;
    },
    unOn: function(type, fn, obj, options) {
        options = options || {};
        try {
            if(options && options.isCE === true || (this.ceMap && this.ceMap[type]))
                return this.cUnOn(type, fn, obj);
            else {
                if(typeof obj == 'undefined') debugger;
                return this.sUnOn(type, fn, obj);
            }
            return false;
        } finally {
            options = null;
        }
    },
    fireEvent: function(type, arg1, options) {
        options = options || {};
        try {
            if(options && options.isCE === true || (this.ceMap && this.ceMap[type]))
                return this.cFireEvent(type, arg1, options);
            else
                return this.sFireEvent(type, arg1);
        } finally {
            options = null;
        }
    },
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
    sCreateEvent: function(type) {
        this.__simple_events = this.__simple_events || {};
        if(!this.__simple_events[type])
            this.__simple_events[type] = [];
    },
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
    sFireEvent: function(type, eo) {
        if(!type) throw new Error('type이 없습니다.');
        this.__simple_events = this.__simple_events || {};
        var eventList = this.__simple_events[type];
        if(!eventList) return;
        eo = eo || { type: type };
        for (var i = 0; i < eventList.length; i++) {
            var event = Rui.util.LEvent.getEvent(eo);
            try{
                if (Rui.isDebugEV && (this.otype || eventList[i].scope)) {
                    var source = (this.otype || eventList[i].scope) + '';
                    Rui.log('type : SEvent ' + type + ', scope: ' + eventList[i].scope + ', source: ' + source + '\r\n function : ' + eventList[i].fn, 'event', source);
                }
                if(eventList[i].fn.call(eventList[i].scope, event) === false) return false;
            } catch(e1) {
                var source = ((eventList[i].scope && eventList[i].scope.otype) || eventList[i].scope || this.otype) + '';
                if (Rui.isDebugER) {
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
    destroy: function() {
        this.unOnAll();
        delete this.__RUI_events;
        delete this.__RUI_subscribers;
        for (m in this) {
            this[m] = null;
            delete this[m];
        }
    },
    toString: function() {
        return this.otype + ' ' + (this.id || 'Unknown');
    }
};
Rui.util.LCustomEvent = function(type, oScope, silent, signature) {
    this.type = type;
    if(oScope && !(oScope === window)) {
        oScope.ceMap = oScope.ceMap || {};
        oScope.ceMap[type] = true;
    }
    this.scope = oScope || window;
    this.silent = silent;
    this.signature = signature || Rui.util.LCustomEvent.LIST;
    this.subscribers = [];
    var onsubscribeType = "_RUICEOnSubscribe";
    if (type !== onsubscribeType) {
        this.subscribeEvent = new Rui.util.LCustomEvent(onsubscribeType, this, true);
    } 
    this.lastError = null;
};
Rui.util.LCustomEvent.LIST = 0;
Rui.util.LCustomEvent.FLAT = 1;
Rui.util.LCustomEvent.prototype = {
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
    fire: function() {
        this.lastError = null;
        var len=this.subscribers.length;
        if (!len) {
            return true;
        }
        var args=[].slice.call(arguments, 0), ret=true, i, rebuild=false;
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
                        ret = s.fn.call(scope, param, s.obj);
                } else {
                        ret = s.fn.call(scope, this.type, args, s.obj);
                }
                if (false === ret) {
                    break;
                }
            }
        }
        return (ret !== false);
    },
    unOnAll: function() {
        for (var i=this.subscribers.length-1; i>-1; i--) {
            this._delete(i);
        }
        this.subscribers=[];
        return i;
    },
    _delete: function(index) {
        var s = this.subscribers[index];
        if (s) {
            delete s.fn;
            delete s.obj;
        }
        this.subscribers.splice(index, 1);
    },
    toString: function() {
         return "LCustomEvent: " + "'" + this.type  + "', " + 
             "scope: " + this.scope;
    }
};
if (!Rui.util.LEvent) {
    Rui.util.LEvent = function() {
        var loadComplete =  false;
        var listeners = [];
        var unloadListeners = [];
        var legacyEvents = [];
        var legacyHandlers = [];
        var retryCount = 0;
        var onAvailStack = [];
        var legacyMap = [];
        var counter = 0;
        var webkitKeymap = {
            63232: 38, 
            63233: 40, 
            63234: 37, 
            63235: 39, 
            63276: 33, 
            63277: 34, 
            25: 9      
        };
        var _FOCUS = Rui.browser.msie ? 'focusin' : 'focus';
        var _BLUR = Rui.browser.msie ? 'focusout' : 'blur';
        return {
            POLL_RETRYS: 2000,
            POLL_INTERVAL: 20,
            EL: 0,
            TYPE: 1,
            FN: 2,
            WFN: 3,
            UNLOAD_OBJ: 3,
            ADJ_SCOPE: 4,
            OBJ: 5,
            OVERRIDE: 6,
            CAPTURE: 7,
            lastError: null,
            webkit: Rui.browser.webkit,
            isIE: Rui.browser.msie,
            _interval: null,
             _dri: null,
            DOMReady: false,
            throwErrors: true,
            startInterval: function() {
                if (!this._interval) {
                    var self = this;
                    var callback = function() { self._tryPreloadAttach(); };
                    this._interval = setInterval(callback, this.POLL_INTERVAL);
                }
            },
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
            onContentReady: function(p_id, p_fn, p_obj, p_override) {
                this.onAvailable(p_id, p_fn, p_obj, p_override, true);
            },
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
            _addListener: function(el, sType, fn, obj, override, capture) {
                if (!fn || !fn.call) {
                    return false;
                }
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
                    if (oEl) {
                        el = oEl;
                    } else {
                        this.onAvailable(el, function() {
                           Rui.util.LEvent._addListener(el, sType, fn, obj, override, capture);
                        });
                        return true;
                    }
                }
                if (!el) {
                    return false;
                }
                if ('unload' == sType && obj !== this) {
                    unloadListeners[unloadListeners.length] =
                            [el, sType, fn, obj, override, capture];
                    return true;
                }
                var scope = el;
                if (override) {
                    if (override === true) {
                        scope = obj;
                    } else {
                        scope = override;
                    }
                }
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
                listeners[index] = li;
                if (this.useLegacyEvent(el, sType)) {
                    var legacyIndex = this.getLegacyIndex(el, sType);
                    if ( legacyIndex == -1 || el != legacyEvents[legacyIndex][0] ) {
                        legacyIndex = legacyEvents.length;
                        legacyMap[el.id + sType] = legacyIndex;
                        legacyEvents[legacyIndex] =
                            [el, sType, el['on' + sType]];
                        legacyHandlers[legacyIndex] = [];
                        el['on' + sType] =
                            function(e) {
                                Rui.util.LEvent.fireLegacyEvent(
                                    Rui.util.LEvent.getEvent(e), legacyIndex);
                            };
                    }
                    legacyHandlers[legacyIndex].push(li);
                } else {
                    try {
                        this._simpleAdd(el, sType, wrappedFn, capture);
                    } catch(ex) {
                        this.lastError = ex;
                        this._removeListener(el, sType, fn, capture);
                        return false;
                    }
                }
                return true;
            },
            addListener: function (el, sType, fn, obj, override) {
                return this._addListener(el, sType, fn, obj, override, false);
            },
            addFocusListener: function (el, fn, obj, override) {
                return this._addListener(el, _FOCUS, fn, obj, override, true);
            },
            removeFocusListener: function (el, fn) {
                return this._removeListener(el, _FOCUS, fn, true);
            },
            addBlurListener: function (el, fn, obj, override) {
                return this._addListener(el, _BLUR, fn, obj, override, true);
            },
            removeBlurListener: function (el, fn) {
                return this._removeListener(el, _BLUR, fn, true);
            },
            fireLegacyEvent: function(e, legacyIndex) {
                var ok=true, le, lh, li, scope, ret;
                lh = legacyHandlers[legacyIndex].slice();
                for (var i=0, len=lh.length; i<len; ++i) {
                    li = lh[i];
                    if ( li && li[this.WFN] ) {
                        scope = li[this.ADJ_SCOPE];
                        ret = li[this.WFN].call(scope, e);
                        ok = (ok && ret);
                    }
                }
                le = legacyEvents[legacyIndex];
                if (le && le[2]) {
                    le[2](e);
                }
                return ok;
            },
            getLegacyIndex: function(el, sType) {
                var key = this.generateId(el) + sType;
                if (typeof legacyMap[key] == 'undefined') {
                    return -1;
                } else {
                    return legacyMap[key];
                }
            },
            useLegacyEvent: function(el, sType) {
                return (this.webkit && this.webkit < 419 && ('click'==sType || 'dblclick'==sType));
            },
            _removeListener: function(el, sType, fn, capture) {
                var i, len, li;
                if (typeof el == 'string') {
                    el = this.getEl(el);
                } else if ( this._isValidCollection(el)) {
                    var ok = true;
                    for (i=el.length-1; i>-1; i--) {
                        ok = ( this._removeListener(el[i], sType, fn, capture) && ok );
                    }
                    return ok;
                }
                if (!fn || !fn.call) {
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
                                return true;
                        }
                    }
                    return false;
                }
                var cacheItem = null;
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
                            li = llist[i];
                            if (li &&
                                li[this.EL] == el &&
                                li[this.TYPE] == sType &&
                                li[this.FN] == fn) {
                                    llist.splice(i, 1);
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
                delete listeners[index][this.WFN];
                delete listeners[index][this.FN];
                listeners.splice(index, 1);
                return true;
            },
            removeListener: function(el, sType, fn) {
                    return this._removeListener(el, sType, fn, false);
            },
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
            getTarget: function(ev, resolveTextNode) {
                var t = ev.target || ev.srcElement;
                return this.resolveTextNode(t);
            },
            resolveTextNode: function(n) {
                try {
                    if (n && 3 == n.nodeType) {
                        return n.parentNode;
                    }
                } catch(e) { }
                return n;
            },
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
            getXY: function(ev) {
                return [this.getPageX(ev), this.getPageY(ev)];
            },
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
            stopEvent: function(ev) {
                this.stopPropagation(ev);
                this.preventDefault(ev);
            },
            stopPropagation: function(ev) {
                if (ev.stopPropagation) {
                    ev.stopPropagation();
                } else {
                    ev.cancelBubble = true;
                }
            },
            preventDefault: function(ev) {
                if (ev.preventDefault) {
                    ev.preventDefault();
                } else {
                    ev.returnValue = false;
                }
            },
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
            getCharCode: function(ev) {
                var code = ev.keyCode || ev.charCode || 0;
                if (Rui.browser.webkit && (code in webkitKeymap)) {
                    code = webkitKeymap[code];
                }
                return code;
            },
            isSpecialKey: function(e) {
                if(e.type == 'keypress' && e.ctrlKey) return true;
                var KEY = Rui.util.LKey.KEY;
                for (k in KEY) {
                    if(KEY[k] == e.keyCode) return true;
                }
                return false;
            },
            isNavKey: function(e) {
                var KEY = Rui.util.LKey.NAVKEY;
                for (k in KEY) {
                    if(KEY[k] == e.keyCode) return true;
                }
                return false;
            },
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
            generateId: function(el) {
                var id = el.id;
                if (!id) {
                    id = 'Ruievtautoid-' + counter;
                    ++counter;
                    el.id = id;
                }
                return id;
            },
            _isValidCollection: function(o) {
                try {
                    return ( o                     && 
                             typeof o !== 'string' && 
                             o.length              && 
                             !o.tagName            && 
                             !o.alert              && 
                             typeof o[0] !== 'undefined' );
                } catch(ex) {
                    return false;
                }
            },
            elCache: {},
            getEl: function(id) {
                return (typeof id === 'string') ? document.getElementById(id) : id;
            },
            DOMReadyEvent: new Rui.util.LCustomEvent('DOMReady', this),
            _load: function(e) {
                if (!loadComplete) {
                    loadComplete = true;
                    var EU = Rui.util.LEvent;
                    EU._ready();
                    EU._tryPreloadAttach();
                }
            },
            _ready: function(e) {
                var EU = Rui.util.LEvent;
                if (!EU.DOMReady) {
                    EU.DOMReady=true;
                        EU.DOMReadyEvent.fire();
                        EU._simpleRemove(document, 'DOMContentLoaded', EU._ready);
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
                    if (!this.DOMReady) {
                        this.startInterval();
                        return;
                    }
                }
                this.locked = true;
                var tryAgain = !loadComplete;
                if (!tryAgain) {
                    tryAgain = (retryCount > 0 && onAvailStack.length > 0);
                }
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
            _unload: function(e) {
                var EU = Rui.util.LEvent, i, j, l, len,
                    ul = unloadListeners.slice();
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
            _getScrollLeft: function() {
                return this._getScroll()[1];
            },
            _getScrollTop: function() {
                return this._getScroll()[0];
            },
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
        EU.on = EU.addListener;
        EU.onFocus = EU.addFocusListener;
        EU.onBlur = EU.addBlurListener;
/*! DOMReady: based on work by: Dean Edwards/John Resig/Matthias Miller */
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
                Rui.util.LEvent.onDOMReady(
                        Rui.util.LEvent._tryPreloadAttach,
                        Rui.util.LEvent, true);
                var n = document.createElement('p');
                EU._dri = setInterval(function() {
                    try {
                        n.doScroll('left');
                        clearInterval(EU._dri);
                        EU._dri = null;
                        EU._ready();
                        n = null;
                    } catch (ex) {
                    }
                }, EU.POLL_INTERVAL);
            }
        } else if (EU.webkit && EU.webkit < 525) {
            EU._dri = setInterval(function() {
                var rs=document.readyState;
                if ('loaded' == rs || 'complete' == rs) {
                    clearInterval(EU._dri);
                    EU._dri = null;
                    EU._ready();
                }
            }, EU.POLL_INTERVAL);
        } else {
            EU._simpleAdd(document, 'DOMContentLoaded', EU._ready);
        }
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
Rui.LConnect = {
    _msxml_progid: [
        'Microsoft.XMLHTTP',
        'MSXML2.XMLHTTP.3.0',
        'MSXML2.XMLHTTP'
    ],
    _http_headers: {},
    _has_http_headers: false,
    _use_default_post_header: true,
    _default_post_header: 'application/x-www-form-urlencoded; charset=UTF-8',
    _default_form_header: 'application/x-www-form-urlencoded',
    _use_default_xhr_header: true,
    _default_xhr_header: 'XMLHttpRequest',
    _has_default_headers: true,
    _default_headers: {},
    _isFormSubmit: false,
    _formNode: null,
    _sFormData: '',
    _poll: {},
    _timeOut: {},
    _polling_interval: 50,
    _transaction_id: 0,
    _submitElementValue: null,
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
    startEvent: new Rui.util.LCustomEvent('start'),
    completeEvent: new Rui.util.LCustomEvent('complete'),
    successEvent: new Rui.util.LCustomEvent('success'),
    failureEvent: new Rui.util.LCustomEvent('failure'),
    uploadEvent: new Rui.util.LCustomEvent('upload'),
    abortEvent: new Rui.util.LCustomEvent('abort'),
    _customEvents: {
        onStart:['startEvent', 'start'],
        onComplete:['completeEvent', 'complete'],
        onSuccess:['successEvent', 'success'],
        onFailure:['failureEvent', 'failure'],
        onUpload:['uploadEvent', 'upload'],
        onAbort:['abortEvent', 'abort']
    },
    setProgId: function(id){
        this._msxml_progid.unshift(id);
    },
    setDefaultPostHeader: function(b){
        if(typeof b == 'string'){
            this._default_post_header = b;
        }else if(typeof b == 'boolean'){
            this._use_default_post_header = b;
        }
    },
    setDefaultXhrHeader: function(b){
        if(typeof b == 'string'){
            this._default_xhr_header = b;
        }else{
            this._use_default_xhr_header = b;
        }
    },
    setPollingInterval: function(i){
        if(typeof i == 'number' && isFinite(i)){
            this._polling_interval = i;
        }
    },
    createXhrObject: function(transactionId){
        var http;
        if(window.XMLHttpRequest){
            if(Rui.browser.msie && window.ActiveXObject){
                http = this.createMSXhrObject();
                if(Rui.isDebugDE)
                    Rui.log('createMSXhrObject 1', 'debug', 'Rui.LConnect');
            }else{
                http = new XMLHttpRequest();
                if(Rui.isDebugDE)
                    Rui.log('XMLHttpRequest', 'debug', 'Rui.LConnect');
            }
        }else{
            http = this.createMSXhrObject();
            if(Rui.isDebugDE)
                Rui.log('createMSXhrObject 2', 'debug', 'Rui.LConnect');
        }
        return { conn: http, tId: transactionId };
    },
    createMSXhrObject: function(){
        for (var i=0; i < this._msxml_progid.length; ++i){
            try{
                return new ActiveXObject(this._msxml_progid[i]);
            }catch(e){}
        }
    },
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
    openConnection: function(o, method, uri, async){
        o.conn.open(method, uri, async);
    },
    ajaxRequest: function(method, uri, callback, postData, config){
    	config = config || {};
        var fileUpload = config && config.isFileUpload === true;
        var crossDomain = config && config.crossDomain === true;
        var o = this.getConnectionObject(fileUpload, crossDomain);
        var args = (callback && callback.argument) ? callback.argument : null;
        if (postData && typeof postData == 'object') {
            postData = Rui.util.LObject.serialize(postData);
        }
        if(!o){
            return null;
        }else{
            var isPost = (method.toUpperCase() != 'GET'); 
            if(callback && callback.customevents){
                this.initCustomEvents(o, callback);
            }
            if(this._isFormSubmit){
                if(fileUpload){
                    this.uploadFile(o, callback, uri, postData);
                    return o;
                }
                if(!isPost){
                    if(this._sFormData.length !== 0){
                        uri += ((uri.indexOf('?') == -1)?'?':'&') + this._sFormData;
                    }
                }else if(isPost){
                    postData = postData?this._sFormData + '&' + postData:this._sFormData;
                }
            }
            if(!isPost && postData)
                uri += ((uri.indexOf('?') == -1)?'?':'&') + postData;
            if(!isPost && (config.cache === false)){
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
            if(this._use_default_xhr_header){
                if(!this._default_headers['X-Requested-With']){
                    this.initHeader('X-Requested-With', this._default_xhr_header, true);
                }
            }
            if((isPost && this._use_default_post_header) && this._isFormSubmit === false){
                this.initHeader('Content-Type', this._default_post_header);
            }
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
            if(isXecureWeb === true){
                o.conn.setRequestHeader('xecure-request', 'true');
                var path = getPath(uri);
                var cipher = document.XecureWeb.BlockEnc(xgate_addr, path, postData ? decodeURIComponent(postData): postData, 'GET');
                o.conn.send('q='+encodeURIComponent(cipher));
            }else
                o.conn.send(isPost ? (postData || ''):'');
            if(config.async == false)
                this.handleReadyState(o, callback, true);
            if(this._isFormSubmit === true){
                this.resetFormState();
            }
            this.startEvent.fire(o, args);
            if(o.startEvent){
                o.startEvent.fire(o, args);
            }
            return o;
        }
    },
    asyncRequest: function(method, uri, callback, postData, config){
        config = config || {};
        config.async = true;
        return this.ajaxRequest(method, uri, callback, postData, config);
    },
    syncRequest: function(method, uri, callback, postData, config){
        config = config || {};
        config.async = false;
        return this.ajaxRequest(method, uri, callback, postData, config);
    },
    initCustomEvents: function(o, callback){
        var prop;
        for (prop in callback.customevents){
            if(this._customEvents[prop][0]){
                o[this._customEvents[prop][0]] = new Rui.util.LCustomEvent(this._customEvents[prop][1], (callback.scope)?callback.scope:null);
                o[this._customEvents[prop][0]].on(callback.customevents[prop]);
            }
        }
    },
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
            oConn.completeEvent.fire(o, args);
            if(o.completeEvent){
                o.completeEvent.fire(o, args);
            }
            oConn.handleTransactionResponse(o, callback);
        } else {
            this._poll[o.tId] = window.setInterval(function(){
                if(o.conn && o.conn.readyState === 4){
                    window.clearInterval(oConn._poll[o.tId]);
                    delete oConn._poll[o.tId];
                    if(callback && callback.timeout){
                        window.clearTimeout(oConn._timeOut[o.tId]);
                        delete oConn._timeOut[o.tId];
                    }
                    oConn.completeEvent.fire(o, args);
                    if(o.completeEvent){
                        o.completeEvent.fire(o, args);
                    }
                    oConn.handleTransactionResponse(o, callback);
                }
            },this._polling_interval);
        }
    },
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
            httpStatus = 13030;
        }
        if(httpStatus >= 200 && httpStatus < 300 || httpStatus === 1223){
            responseObject = this.createResponseObject(o, args);
            if(callback && callback.success){
                if(!callback.scope){
                    callback.success(responseObject);
                }else{
                    callback.success.apply(callback.scope, [responseObject]);
                }
            }
            this.successEvent.fire(responseObject);
            if(o.successEvent){
                o.successEvent.fire(responseObject);
            }
        }else{
            switch(httpStatus){
                case 12002: 
                case 12029: 
                case 12030:
                case 12031:
                case 12152: 
                case 13030: 
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
            this.failureEvent.fire(responseObject);
            if(o.failureEvent){
                o.failureEvent.fire(responseObject);
            }
        }
        this.releaseObject(o);
        responseObject = null;
    },
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
        obj.status = (o.conn.status == 1223)?204:o.conn.status;
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
    initHeader: function(label, value, isDefault){
        var headerObj = isDefault ? this._default_headers : this._http_headers;
        headerObj[label] = value;
        if(isDefault){
            this._has_default_headers = true;
        }else{
            this._has_http_headers = true;
        }
    },
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
    resetDefaultHeaders: function(){
        delete this._default_headers;
        this._default_headers = {};
        this._has_default_headers = false;
    },
    setForm: function(formId, isUpload, secureUri){
        var oForm, oElement, oName, oValue, oDisabled,
            hasSubmit = false,
            data = [], item = 0,
            i,len,j,jlen,opt;
        this.resetFormState();
        if(typeof formId == 'string'){
            oForm = (document.getElementById(formId) || document.forms[formId]);
        }else if(typeof formId == 'object'){
            oForm = formId;
        }else{
            return;
        }
        if(isUpload){
            this.createFrame(secureUri?secureUri:null);
            this._isFormSubmit = true;
            this._formNode = oForm;
            return;
        }
        for (i=0,len=oForm.elements.length; i<len; ++i){
            oElement  = oForm.elements[i];
            oDisabled = oElement.disabled;
            oName     = oElement.name;
            if(!oDisabled && oName){
                oName  = encodeURIComponent(oName)+'=';
                oValue = encodeURIComponent(oElement.value);
                switch(oElement.type){
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
                    case undefined:
                    case 'reset':
                    case 'button':
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
    resetFormState: function(){
        this._isFormSubmit = false;
        this._formNode = null;
        this._sFormData = '';
    },
    createFrame: function(secureUri){
        var frameId = 'ruiIO' + this._transaction_id;
        var io;
        if(Rui.browser.msie678){
            io = document.createElement('<iframe id="' + frameId + '" name="' + frameId + '" />');
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
    uploadFile: function(o, callback, uri, postData){
        var frameId = 'ruiIO' + o.tId,
            uploadEncoding = 'multipart/form-data',
            io = document.getElementById(frameId),
            oConn = this,
            args = (callback && callback.argument) ? callback.argument : null,
            oElements,i,prop,obj;
        var rawFormAttributes = {
            action:this._formNode.getAttribute('action'),
            method:this._formNode.getAttribute('method'),
            target:this._formNode.getAttribute('target')
        };
        this._formNode.setAttribute('action', uri);
        this._formNode.setAttribute('method', 'POST');
        this._formNode.setAttribute('target', frameId);
        if(Rui.browser.msie){
            this._formNode.setAttribute('encoding', uploadEncoding);
        }else{
            this._formNode.setAttribute('enctype', uploadEncoding);
        }
        if(postData){
            oElements = this.appendPostData(postData);
        }
        this._formNode.submit();
        this.startEvent.fire(o, args);
        if(o.startEvent){
            o.startEvent.fire(o, args);
        }
        if(callback && callback.timeout){
            this._timeOut[o.tId] = window.setTimeout(function(){ oConn.abort(o, callback, true); }, callback.timeout);
        }
        if(oElements && oElements.length > 0){
            for (i=0; i < oElements.length; i++){
                this._formNode.removeChild(oElements[i]);
            }
        }
        for (prop in rawFormAttributes){
            if(Rui.hasOwnProperty(rawFormAttributes, prop)){
                if(rawFormAttributes[prop]){
                    this._formNode.setAttribute(prop, rawFormAttributes[prop]);
                }else{
                    this._formNode.removeAttribute(prop);
                }
            }
        }
        this.resetFormState();
        var uploadCallback = function(){
            if(callback && callback.timeout){
                window.clearTimeout(oConn._timeOut[o.tId]);
                delete oConn._timeOut[o.tId];
            }
            oConn.completeEvent.fire(o, args);
            if(o.completeEvent){
                o.completeEvent.fire(o, args);
            }
            obj = {
                tId: o.tId,
                argument: callback.argument
            };
            try{
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
            oConn.uploadEvent.fire(obj);
            if(o.uploadEvent){
                o.uploadEvent.fire(obj);
            }
            Rui.util.LEvent.removeListener(io, 'load', uploadCallback);
            setTimeout(function(){
                document.body.removeChild(io);
                oConn.releaseObject(o);
            }, 100);
        };
        Rui.util.LEvent.addListener(io, 'load', uploadCallback);
    },
    abort: function(o, callback, isTimeout){
        var abortStatus;
        var args = (callback && callback.argument)?callback.argument:null;
        if(o && o.conn){
            if(this.isCallInProgress(o)){
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
                Rui.util.LEvent.removeListener(io, 'load');
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
            this.abortEvent.fire(o, args);
            if(o.abortEvent){
                o.abortEvent.fire(o, args);
            }
            this.handleTransactionResponse(o, callback, true);
        }
        return abortStatus;
    },
    isCallInProgress: function(o){
        if(o && o.conn){
            return o.conn.readyState !== 4 && o.conn.readyState !== 0;
        }else if(o && o.isUpload === true){
            var frameId = 'ruiIO' + o.tId;
            return document.getElementById(frameId)?true:false;
        }else{
            return false;
        }
    },
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
             o.conn = null;
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
Rui.util.LAttributeProvider = function(){
};
Rui.util.LAttributeProvider.prototype = {
    _configs: null,
    get: function(key){
        this._configs = this._configs || {};
        var config = this._configs[key];
        if (!config || !this._configs.hasOwnProperty(key)) {
            return undefined;
        }
        return config.value;
    },
    set: function(key, value, silent){
        this._configs = this._configs || {};
        var config = this._configs[key];
        if (!config)
            return false;
        return config.setValue(value, silent);
    },
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
    setAttributes: function(map, silent){
        for (var key in map) {
            if (Rui.hasOwnProperty(map, key)) {
                this.set(key, map[key], silent);
            }
        }
    },
    resetValue: function(key, silent){
        this._configs = this._configs || {};
        if (this._configs[key]) {
            this.set(key, this._configs[key]._initialConfig.value, silent);
            return true;
        }
        return false;
    },
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
    register: function(key, map){
        this.setAttributeConfig(key, map);
    },
    getAttributeConfig: function(key){
        this._configs = this._configs || {};
        var config = this._configs[key] || {};
        var map = {}; 
        for (key in config) {
            if (Rui.hasOwnProperty(config, key)) {
                map[key] = config[key];
            }
        }
        return map;
    },
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
    configureAttribute: function(key, map, init){
        this.setAttributeConfig(key, map, init);
    },
    resetAttributeConfig: function(key){
        this._configs = this._configs || {};
        this._configs[key].resetConfig();
    },
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
    fireBeforeChangeEvent: function(e){
        var type = 'before';
        type += e.type.charAt(0).toUpperCase() + e.type.substr(1) + 'Change';
        e.type = type;
        return this.fireEvent(e.type, e);
    },
    fireChangeEvent: function(e){
        e.type += 'Change';
        return this.fireEvent(e.type, e);
    },
    createAttribute: function(map){
        return new Rui.util.LAttribute(map, this);
    }
};
Rui.augment(Rui.util.LAttributeProvider, Rui.util.LEventProvider);
Rui.util.LAttribute = function(hash, owner) {
    if (owner) { 
        this.owner = owner;
        this.configure(hash, true);
    }
};
Rui.util.LAttribute.prototype = {
    name: undefined,
    value: null,
    owner: null,
    readOnly: false,
    writeOnce: false,
    _initialConfig: null,
    _written: false,
    method: null,
    validator: null,
    getValue: function() {
        return this.value;
    },
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
            return false; 
        }
        if (this.validator && !this.validator.call(owner, value) ) {
            return false; 
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
    configure: function(map, init) {
        map = map || {};
        this._written = false; 
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
    resetValue: function() {
        return this.setValue(this._initialConfig.value);
    },
    resetConfig: function() {
        this.configure(this._initialConfig);
    },
    refresh: function(silent) {
        this.setValue(this.value, silent);
    }
};
(function() {
    var Dom = Rui.util.LDom,
        LAttributeProvider = Rui.util.LAttributeProvider;
    Rui.LElement = function(el, map) {
        this.dom = typeof el == 'string' ? document.getElementById(el) : el;
        if (arguments.length) {
            this.init(el, map);
        }
        this.id = (this.dom ? this.dom.id : '') || Rui.id(this.dom);
        if(typeof el == 'string' && DEl.elCache[this.id]) {
            return DEl.elCache[this.id];
        }
    };
    var DEl = Rui.LElement;
    var docEl;
    Rui.LElement.prototype = {
        DOM_EVENTS: null,
        visibilityMode: false,
        isBorderBox: function(){
            return noBoxAdjust[((this.dom && this.dom.tagName) || '').toLowerCase()] || Rui.isBorderBox;
        },
        select: function(selector, firstOnly) {
            var n = Rui.util.LDomSelector.query(selector, this.dom, firstOnly);
            return this.createElementList(n);
        },
        query: function(selector, firstOnly) {
            return Rui.util.LDomSelector.query(selector, this.dom, firstOnly);
        },
        filter: function(selector) {
            var nodes = this.query('*');
            return this.createElementList(Rui.util.LDomSelector.filter(nodes, selector));
        },
        test: function(selector) {
            return Rui.util.LDomSelector.test(this.dom, selector);
        },
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
        getValue: function() {
            return this.dom.value;
        },
        setValue: function(value) {
            this.dom.value = value;
            return this;
        },
        setChecked: function(value) {
            this.dom.checked = value;
            return this;
        },
        isChecked: function() {
            return this.dom.checked;
        },
        getElementsByTagName: function(tag) {
            return this.dom.getElementsByTagName(tag);
        },
        hasChildNodes: function() {
            return this.dom.hasChildNodes();
        },
        getChildren: function(isDom) {
            var list = Rui.util.LDom.getChildren(this.dom);
            if(!isDom || isDom === true) {
                for (var i = 0 ; i < list.length ; i++)
                    list[i] = Rui.get(list[i]);
            }
            return list;
        },
        initAttributes: function(map) {
        },
        addListener: function(type, fn, obj, scope, options) {
            var el = this.dom || this.id;
            scope = scope || this;
            if(!this._events) throw new Error('Unknown element : ' + this.id);
            var self = this;
            if (!this._events[type]) { 
                if (el && this.DOM_EVENTS[type]) {
                    Rui.util.LEvent.addListener(el, type, function(e) {
                        if (e.srcElement && !e.target) { 
                            e.target = e.srcElement;
                        }
                        self.fireEvent(type, e );
                    }, obj, scope);
                }
                this.createEvent(type, options);
            }
            return Rui.util.LEventProvider.prototype.on.call(this, type, fn, obj, scope, options); 
        },
        on: function() {
            return this.addListener.apply(this, arguments);
        },
        removeListener: function(type, fn) {
            return this.unOn.apply(this, arguments);
        },
        unOn: function(type, fn) {
            return Rui.util.LEventProvider.prototype.unOn.apply(this, arguments); 
        },
        unOnAll: function() {
            return Rui.util.LEventProvider.prototype.unOnAll.apply(this, arguments); 
        },
        addClass: function(className) {
            Dom.addClass(this.dom, className);
            return this;
        },
        hasClass: function(className) {
            return Dom.hasClass(this.dom, className);
        },
        removeClass: function(className) {
            var cnList = Rui.isArray(className) ? className : [className];
            Rui.util.LArray.each(cnList, function(cn) {
                Dom.removeClass(this.dom, cn);
            }, this);
            return this;
        },
        getElementsByClassName: function(className, tag) {
            return Dom.getElementsByClassName(className, tag,
                    this.dom );
        },
        setStyle: function(property, value) {
            var el = this.dom;
            if (!el) {
                return this._queue[this._queue.length] = ['setStyle', arguments];
            }
            Dom.setStyle(el,  property, value);
            return this;
        },
        getStyle: function(property) {
            return Dom.getStyle(this.dom,  property);
        },
        setStyles: function(props) {
            for (prop in props) {
                this.setStyle(prop, props[prop]);
            }
            return this;
        },
         getStyles: function(props) {
            for (prop in props) {
                props[prop] = this.getStyle(prop);
            }
            return props;
        },
        fireQueue: function() {
            var queue = this._queue;
            for (var i = 0, len = queue.length; i < len; ++i) {
                this[queue[i][0]].apply(this, queue[i][1]);
            }
        },
        get: function(key) {
            var configs = this._configs || {};
            var el = configs.element; 
            if (el && !configs[key] && !Rui.isUndefined(el.value[key]) ) {
                return el.value[key];
            }
            return LAttributeProvider.prototype.get.call(this, key);
        },
        set: function(key, value, silent) {
            var el = this.dom;
            if (!el) {
                this._queue[this._queue.length] = ['set', arguments];
                if (this._configs[key]) {
                    this._configs[key].value = value; 
                }
                return;
            }
            if ( !this._configs[key] && !Rui.isUndefined(el[key]) ) {
                _registerHTMLAttr.call(this, key);
            }
            return LAttributeProvider.prototype.set.apply(this, arguments);
        },
        setAttributeConfig: function(key, map, init) {
            var el = this.dom;
            if (el && !this._configs[key] && !Rui.isUndefined(el[key]) ) {
                _registerHTMLAttr.call(this, key, map);
            } else {
                LAttributeProvider.prototype.setAttributeConfig.apply(this, arguments);
            }
            this._configOrder.push(key);
        },
        getAttributeKeys: function() {
            var el = this.dom;
            var keys = LAttributeProvider.prototype.getAttributeKeys.call(this);
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
        findParent: function(simpleSelector, maxDepth){
            var pDom = Dom.findParent(this.dom, simpleSelector, maxDepth);
            return pDom ? Rui.get(pDom) : null;
        },
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
        parent: function(selector, returnDom){
            return this.matchNode('parentNode', 'parentNode', selector, returnDom);
        },
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
        getPreviousSibling: function() {
            if(!this.dom) return null;
            var prevDom = Dom.getPreviousSibling(this.dom);
            return prevDom ? Rui.get(prevDom) : null;
        },
        getNextSibling: function() {
            if(!this.dom) return null;
            var prevDom = Dom.getNextSibling(this.dom);
            return prevDom ? Rui.get(prevDom) : null;
        },
        insertBefore: function(child) {
            var elems = [];
            if(!child.elements) elems.push(child); else elems = child.elements;
            Rui.util.LArray.each(elems, function(item){
                Dom.insertBefore(this.getDom(item), this.dom);
            }, this);
            return this;
        },
        insertAfter: function(child) {
            var elems = [];
            if(!child.elements) elems.push(child); else elems = child.elements;
            Rui.util.LArray.each(elems, function(item){
                Dom.insertAfter(this.getDom(item), this.dom);
            }, this);
            return this;
        },
        remove: function(){
            delete DEl.elCache[this.dom.id];
            this.removeNode();
            return this;
        },
        removeNode: function(){
            Dom.removeNode(this.dom);
            delete this.dom;
            return this;
        },
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
        getDom: function(item) {
            return item && item.dom ? item.dom : (item && item.get) ?
                    item.get('element') : Dom.get(item);
        },
        appendTo: function(parent, before) {
            parent = this.getDom(parent);
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
                    if ((matches = regexp.exec(html)) != null) {
                        e.title = matches[0].substring(7,matches[0].indexOf('</title>'));
                    }
                    option.successOld.call(me, e);
               }
            });
            Rui.ajax(option);
            return this;
        },
        getHeight: function(contentHeight){
            var h = this.dom.offsetHeight || 0;
            h = !contentHeight ? h : h - this.getBorderWidth('tb') - this.getPadding('tb');
            return h < 0 ? 0 : h;
        },
        getWidth: function(contentWidth){
            var w = this.dom.offsetWidth || 0;
            w = !contentWidth ? w : w - this.getBorderWidth('lr') - this.getPadding('lr');
            return w < 0 ? 0 : w;
        },
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
        getBorderWidth: function(side){
            return this.addStyles(side, Rui.LElement.borders);
        },
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
        setVisibilityMode: function(visMode) {
            this.visibilityMode = visMode;
            return this;
        },
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
        isShow: function() {
            if(this.dom) {
                return (this.hasClass('L-hidden') || this.hasClass('L-hide-display') || this.hasClass('L-hide-visibility') || this.dom.style.visibility === 'hidden' || this.dom.style.display === 'none')? false : true;
            } else {
                return false;
            }
        },
        removeChildNodes: function() {
            Dom.removeChildNodes(this.dom);
            return this;
        },
        html: function(html) {
            if (this.dom) {
            	if(this.waitMaskEl) delete this.waitMaskEl;
                this.dom.innerHTML = html;
            }
            return this;
        },
        getHtml: function() {
            if(this.dom)
                return this.dom.innerHTML;
            else
                return '';
        },
        toggle: function(ani) {
            var me = this;
            me.isShow() ? me.hide() : me.show();
        },
        hover: function(overFn, outFn, scope, options){
            this.on('mouseenter', overFn, scope || this, options);
            this.on('mouseleave', outFn, scope || this, options);
            return this;
        },
        setAttribute: function(key, value) {
            if(this.dom)
                this.dom.setAttribute(key, value);
            return this;
        },
        getAttribute: function(key) {
            if(this.dom)
                return this.dom.getAttribute(key);
            return null;
        },
        removeAttribute: function(key) {
            if(this.dom)
                this.dom.removeAttribute(key);
            return this;
        },
        click: function() {
        	this.dom.click();
        },
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
            'change':true,
            'touchstart': true,
            'touchmove': true,
            'touchend': true,
            'onorientationchange': true,
            'resize': true,
            'DOMSubtreeModified': true,
            'webkitTransitionEnd': true
        };
        var isReady = false;  
        if (typeof attr.element === 'string') { 
            _registerHTMLAttr.call(this, 'id', { value: attr.element });
        }
        if (Dom.get(attr.element)) {
            isReady = true;
            _initHTMLElement.call(this, attr);
            _initContent.call(this, attr);
        }
        Rui.util.LEvent.onAvailable(attr.element, function() {
            if (!isReady) { 
                _initHTMLElement.call(this, attr);
            }
            this.fireEvent('available', { type: 'available', target: Dom.get(attr.element) });
        }, this, true);
        Rui.util.LEvent.onContentReady(attr.element, function() {
            if (!isReady) { 
                _initContent.call(this, attr);
            }
            this.fireEvent('contentReady', { type: 'contentReady', target: Dom.get(attr.element) });
        }, this, true);
    };
    var _initHTMLElement = function(attr) {
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
    Rui.augment(Rui.LElement, LAttributeProvider);
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
    if(!el){ return null; }
    if(typeof el == 'string'){ 
        if(!(elm = document.getElementById(el))){
            return null;
        }
        if(ex = DEl.elCache[el]){
            ex.dom = elm;
        }else{
            ex = DEl.elCache[el] = new Rui.LElement(elm);
        }
        return ex;
    }else if(el.tagName){ 
        ex = new DEl(el);
        return ex;
    }else if(el instanceof DEl){
        if(el != docEl){
            el.dom = document.getElementById(el.id) || el.dom; 
        }
        return el;
    }else if(el.isComposite){
        return el;
    }else if(Rui.isArray(el)){
        var obj = [];
        for (var i = 0 ; i < el.length ; i++)
            obj.push(new Rui.LElement(el[i]));
        return obj; 
    }else if(el == document){
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
    Rui.LElementList = function(o) {
        this.elements = [];
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
        getAt: function(index) {
            var me = this;
            if(!me.elements[index]){
                return null;
            }
            return me.elements[index];
        },
        each: function(fn, scope){       
            var me = this;
            Rui.each(me.elements, function(e,i) {    
                return fn.call(scope || e, e, i, me);
            });
            return me;
        },
        clear: function(){
            this.elements = [];
            this.length = 0;
            return this;
        },
        select: function(selector, firstOnly) {
            var newElement = [];
            this.each(function(item) {
                var me = item.select(selector, firstOnly);
                newElement = newElement.concat(me.elements || me);
            }, this.elements);
            return new Rui.LElementList(newElement);
        },
        query: function(selector, firstOnly) {
            var newElement = [];
            this.each(function(item) {
                var me = item.query(selector, firstOnly);
                newElement = newElement.concat(me);
            }, this.elements);
            return newElement; 
        },
        filter: function(selector) {
            var newElements = [];
            this.each(function(item) {
                newElements.push(item.dom);
            }, this.elements);
            newElements = Rui.util.LDomSelector.filter(newElements, selector);
            for (var i = 0 ; i < newElements.length; i++) newElements[i] = new Rui.LElement(newElements[i]);
            return new Rui.LElementList(newElements); 
        },
        appendTo: function(parent) {
            this.each(function(item) {
                item.appendTo(parent);
            }, this.elements);
            return this;
        },
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
(function() {
var LDomSelector = function() {};
var Y = Rui.util;
var reNth = /^(?:([-]?\d*)(n){1}|(odd|even)$)*([-+]?\d*)$/;
LDomSelector.prototype = {
    document: window.document,
    attrAliases: {
    },
    shorthand: {
        '\\#(-?[_a-z]+[-\\w]*)': '[id=$1]',
        '\\.(-?[_a-z]+[-\\w]*)': '[class~=$1]'
    },
    operators: {
        '=': function(attr, val) { return attr === val; }, 
        '!=': function(attr, val) { return attr !== val; }, 
        '~=': function(attr, val) { 
            var s = ' ';
            return (s + attr + s).indexOf((s + val + s)) > -1;
        },
        '|=': function(attr, val) { return getRegExp('^' + val + '[-]?').test(attr); }, 
        '^=': function(attr, val) { return attr.indexOf(val) === 0; }, 
        '$=': function(attr, val) { return attr.lastIndexOf(val) === attr.length - val.length; }, 
        '*=': function(attr, val) { return attr.indexOf(val) > -1; }, 
        '': function(attr, val) { return attr; } 
    },
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
    test: function(node, selector) {
        node = LDomSelector.document.getElementById(node) || node;
        if (!node) {
            return false;
        }
        var groups = selector ? selector.split(',') : [];
        if (groups.length) {
            for (var i = 0, len = groups.length; i < len; ++i) {
                if ( rTestNode(node, groups[i]) ) { 
                    return true;
                }
            }
            return false;
        }
        return rTestNode(node, selector);
    },
    filter: function(nodes, selector) {
        nodes = nodes || [];
        var node,
            result = [];
        if (!nodes.item) { 
            for (var i = 0, len = nodes.length; i < len; ++i) {
                if (!nodes[i].tagName) { 
                    node = LDomSelector.document.getElementById(nodes[i]);
                    if (node) { 
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
    var groups = selector.split(','); 
    if (groups.length > 1) {
        var found;
        for (var i = 0, len = groups.length; i < len; ++i) {
            found = arguments.callee(groups[i], root, firstOnly, true);
            result = firstOnly ? found : result.concat(found); 
        }
        clearFoundCache();
        return result;
    }
    if (root && !root.nodeName) { 
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
    if (id) {
        node = LDomSelector.document.getElementById(id);
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
                    nodes = [node]; 
                } else {
                    root = node; 
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
    if (document.documentElement.contains && !Rui.browser.webkit < 422)  { 
        return function(needle, haystack) {
            return haystack.contains(needle);
        };
    } else if ( document.documentElement.compareDocumentPosition ) { 
        return function(needle, haystack) {
            return !!(haystack.compareDocumentPosition(needle) & 16);
        };
    } else  { 
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
        try { 
            delete foundCache[i]._found;
        } catch(e) {
            foundCache[i].removeAttribute('_found');
        }
    }
    foundCache = [];
};
var clearParentCache = function() {
    if (!document.documentElement.children) { 
        return function() {
            for (var i = 0, len = parentCache.length; i < len; ++i) {
                delete parentCache[i]._children;
            }
            parentCache = [];
        };
    } else return function() {}; 
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
    if (document.documentElement.children) { 
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
var getNth = function(node, expr, tag, reverse) {
    if (tag) tag = tag.toLowerCase();
    reNth.test(expr);
    var a = parseInt(RegExp.$1, 10), 
        n = RegExp.$2, 
        oddeven = RegExp.$3, 
        b = parseInt(RegExp.$4, 10) || 0; 
    var siblings = getChildren(node.parentNode, tag);
    if (oddeven) {
        a = 2; 
        op = '+';
        n = 'n';
        b = (oddeven === 'odd') ? 1 : 0;
    } else if ( isNaN(a) ) {
        a = (n) ? 1 : 0; 
    }
    if (a === 0) { 
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
    attributes: /^\[([a-z]+\w*)+([~\|\^\$\*!=]=?)?['"]?([^'"\]]*)['"]?\]*/i,
    pseudos: /^:([-\w]+)(?:\(['"]?(.+)['"]?\))*/i,
    combinator: /^\s*([>+~]|\s)\s*/
};
var tokenize = function(selector) {
    var token = {},     
        tokens = [],    
        found = false,  
        match;          
    selector = replaceShorthand(selector); 
    do {
        found = false; 
        for (var re in patterns) {
                if (!Rui.hasOwnProperty(patterns, re)) {
                    continue;
                }
                if (re != 'tag' && re != 'combinator') { 
                    token[re] = token[re] || [];
                }
            if (match = patterns[re].exec(selector)) { 
                found = true;
                if (re != 'tag' && re != 'combinator') { 
                    if (re === 'attributes' && match[1] === 'id') {
                        token.id = match[3];
                    }
                    token[re].push(match.slice(1));
                } else { 
                    token[re] = match[1];
                }
                selector = selector.replace(match[0], ''); 
                if (re === 'combinator' || !selector.length) { 
                    token.attributes = fixAttributes(token.attributes);
                    token.pseudos = token.pseudos || [];
                    token.tag = token.tag ? token.tag.toUpperCase() : '*';
                    tokens.push(token);
                    token = { 
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
        if (aliases[attr[i][0]]) { 
            attr[i][0] = aliases[attr[i][0]];
        }
        if (!attr[i][1]) { 
            attr[i][1] = '';
        }
    }
    return attr;
};
var replaceShorthand = function(selector) {
    var shorthand = LDomSelector.shorthand;
    var attrs = selector.match(patterns.attributes); 
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
if (Rui.browser.msie) { 
    Y.LDomSelector.attrAliases['class'] = 'className';
    Y.LDomSelector.attrAliases['for'] = 'htmlFor';
}
})();
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
Rui.util.LDateLocale.getInstance = function(sLocale) {
    var dateLocale = Rui.util.LDateLocale[sLocale];
    var dateLocaleList = (Rui.getConfig) ? Rui.getConfig().getFirst('$.core.dateLocale.' + sLocale) : [];
    for (var key in dateLocaleList) {
        var val = dateLocaleList[key];
        dateLocale[key] = val;
    }
    return dateLocale;
};
(function(){
Rui.LBase64 = {
    codex: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
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
Rui.namespace('Rui.util');
Rui.util.LCookie = {
    _createCookieString: function(name , value , encodeValue , options ) {
        var text  = encodeURIComponent(name) + '=' + (encodeValue ? encodeURIComponent(value) : value);
        if (Rui.isObject(options)) {
            if (options.expires instanceof Date) {
                text += '; expires=' + options.expires.toGMTString();
            }
            if (Rui.isString(options.path) && options.path != '') {
                text += '; path=' + options.path;
            }
            if (Rui.isString(options.domain) && options.domain != '') {
                text += '; domain=' + options.domain;
            }
            if (options.secure === true) {
                text += '; secure';
            }
        }
        return text;
    },
    _parseCookieString: function(text , decode ) {
        var cookies  = new Object();
        if (Rui.isString(text) && text.length > 0) {
            var decodeValue = (decode === false ? function(s){
                return s;
            } : decodeURIComponent);
            if (/[^=]+=[^=;]?(?:; [^=]+=[^=]?)?/.test(text)) {
                var cookieParts  = text.split(/;\s/g);
                var cookieName  = null;
                var cookieValue  = null;
                var cookieNameValue  = null;
                for (var i = 0, len = cookieParts.length; i < len; i++) {
                    cookieNameValue = cookieParts[i].match(/([^=]+)=/i);
                    try {
                        if (cookieNameValue instanceof Array){
                            cookieName = decodeURIComponent(cookieNameValue[1]);
                            cookieValue = decodeValue(cookieParts[i].substring(cookieNameValue[1].length + 1));
                        }else{
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
    get: function(name , converter ) {
        var cookies  = this._parseCookieString(document.cookie);
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
    remove: function(name , options ) {
        if (!Rui.isString(name) || name === '') {
            throw new TypeError('Cookie.remove(): Cookie name must be a non-empty string.');
        }
        document.cookie = name + '=;path=/;expires=;';
        return this;
    },
    set: function(name , value , options ) {
        if (!Rui.isString(name)) {
            throw new TypeError('Cookie.set(): Cookie name must be a string.');
        }
        if (Rui.isUndefined(value)) {
            throw new TypeError('Cookie.set(): Value cannot be undefined.');
        }
        var text  = this._createCookieString(name, value, true, options);
        document.cookie = text;
        return text;
    }
};
String.prototype.trim = function() {
     return Rui.util.LString.trim(this);
};
String.prototype.lPad = function(pad, r) {
     return Rui.util.LString.lPad(this, pad, r);
};
String.prototype.rPad = function(pad, r) {
     return Rui.util.LString.rPad(this, pad, r);
};
String.prototype.toDate = function(oConfig) {
    oConfig = typeof oConfig == 'string' ? { format:oConfig } : oConfig; 
     return Rui.util.LString.toDate(this, oConfig);
};
String.prototype.toXml = function() {
    return Rui.util.LString.toXml(this);
};
String.prototype.trimAll = function() {
     return Rui.util.LString.trimAll(this);
};
String.prototype.cut = function(start, length) {
     return Rui.util.LString.cut(this, start, length);
};
String.prototype.lastCut = function(pos) {
     return Rui.util.LString.lastCut(this, pos);
};
String.prototype.startsWith = function(pattern) {
     return Rui.util.LString.startsWith(this, pattern);
};
String.prototype.endsWith = function(pattern) {
     return Rui.util.LString.endsWith(this, pattern);
};
String.prototype.simpleReplace = function(oldStr, newStr) {
    return Rui.util.LString.simpleReplace(this, oldStr, newStr);
};
String.prototype.insert = function(index, str) {
    return this.substring(0, index) + str + this.substr(index);
};
String.prototype.advancedSplit = function(delim, options){
    return Rui.util.LString.advancedSplit(this, delim, options);
};
String.prototype.firstUpperCase = function() {
    return Rui.util.LString.firstUpperCase(this);
};
String.prototype.getByteLength = function() {
    return Rui.util.LString.getByteLength(this);
};
String.prototype.isHangul = function() {
    return Rui.util.LString.isHangul(this);
};
String.prototype.replaceAll = function(s1, s2) {
    return Rui.util.LString.replaceAll(this, s1, s2);
};
Date.prototype.format = function(oConfig){
    oConfig = typeof oConfig == 'string' ? { format: oConfig } : oConfig;
    return Rui.util.LDate.format(this, oConfig);
};
Date.prototype.add = function(field, amount) {
    return Rui.util.LDate.add(this, field, amount);
};
Date.prototype.equals = function(d, config) {
    return Rui.util.LDate.equals(this, d, config);
};
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
Date.prototype.clone = function() {
    return new Date(this.getFullYear(), this.getMonth(), this.getDate(), this.getHours(), this.getMinutes(), this.getSeconds(), this.getMilliseconds());
};
Date.prototype.between = function(startDate, endDate){
    return Rui.util.LDate.between(this, startDate, endDate);
};
Date.prototype.compareString = function(date2, pattern){
    pattern = pattern || { format: '%q' };
    return Rui.util.LDate.compareString(this, date2, pattern);
};
Date.prototype.getFirstDayOfMonth = function(){
    return Rui.util.LDate.getFirstDayOfMonth(this);
};
Date.prototype.getLastDayOfMonth = function(){
    return Rui.util.LDate.getLastDayOfMonth(this);
};
Date.prototype.getFirstDayOfWeek = function(startOfWeek){
    return Rui.util.LDate.getFirstDayOfWeek(this, startOfWeek);
};
Number.prototype.format = function(oConfig) {
    return Rui.util.LNumber.format(this, oConfig);
};
Number.prototype.round = function(precision) {
    return Rui.util.LNumber.round(this, precision);
};
Array.prototype.contains = function(obj) {
    return Rui.util.LArray.contains(this, obj);
};
Array.prototype.removeAt = function(idx) {
    return Rui.util.LArray.removeAt(this, idx);
};
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
    me.html = html;
    if (me.compiled) {
        me.compile();
    }
};
Rui.LTemplate.prototype = {
    applyTemplate: function(values){
        var me = this;
        return me.compiled ?
            me.compiled(values) :
            me.html.replace(me.re, function(m, name){
                return values[name] !== undefined ? values[name] : '';
            });
    },
    re: /\{([\w-]+)\}/g,
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
Rui.LTemplate.prototype.apply = Rui.LTemplate.prototype.applyTemplate;
