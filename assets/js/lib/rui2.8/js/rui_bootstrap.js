/*
 * @(#) rui_bootstrap.js
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
 * RUI의 base, core, ui, form, grid 라이브러리를 runtime 환경에 맞게 로딩 시켜주는 기능을 하는 bootstrap 유틸리티 이며 
 * 최적의 운영환경 제공과 동시에 원활한 디버깅을 제공하는것이 목적이다.
 * 즉, 최적의 성능을 위해 min 버전의 라이브러리를 사용하여 운영중인 페이지를 dev 또는 debug용 라이브러리로 교체하여 디버깅 할 수 있다.
<pre>
1. 일반 옵션
    debug, dev, min, nodebug 네 종류의 rui_runtime을 사용할 수 있다.
    단 localhost(127.0.0.1)의 경우 무조건 기본 debug로 동작하며, nodebug 옵션을 통해 압축된 min 버전을 테스트할 수 있다.
    값:
        dev, debug, min, nodebug
    사용예: 
        http://www.myproject.com/myproject/page.html?rui_runtime=debug
        http://www.myproject.com/myproject/page.html?rui_runtime=dev
        http://www.myproject.com/myproject/page.html?rui_runtime=min
        http://localhost:8080/myproject/page.html?rui_runtime=nodebug
     
2. 고정 옵션
    rui_runtime에 hold 옵션을 적용하여 값을 고정시켜놓고 이후엔 지정하지 않아도 스스로 적용되도록 할 수 있다.
    또한 rui_runtime이 iframe 내부까지 전달될 수 없으므로 hold옵션을 사용하여 iframe 내부와 무관하게 사용할수도 있다.
    값: 
        dev-hold, debug-hold, min-hold
    사용예: 
        http://www.myproject.com/myproject/page.html?rui_runtime=debug-hold
        http://www.myproject.com/myproject/page.html?rui_runtime=dev-hold
        http://www.myproject.com/myproject/page.html?rui_runtime=min-hold
        
3. 기본값
    localhost, 127.0.0.1은 debug 라이브러리로 동작
    localhost, 127.0.0.1을 제외한 기타 Host의 경우 min 라이브러리로 동작
    
4. 고정옵션인 hold 사용시 유지기간
    Cookie를 사용하여 hold를 결정하며 브라우저 쿠키가 유효한 한 7일간 유지된다.
    
5. 고정옵션 hold 해제방법
    nodebug 옵션으로 실행하면 이후 hold 옵션은 제거됨.
    
    사용예:
        1. 적용 
        http://www.myproject.com/myproject/page.html?rui_runtime=debug-hold
        2. 해제
        http://www.myproject.com/myproject/page.html?rui_runtime=nodebug
        
</pre>
 * @description LBootstrap
 * @namespace Rui
 * @class LBootstrap
 * @constructor LBootstrap
 */
if (typeof Rui == 'undefined' || !Rui) {
    var Rui = {};
}
Rui.LBootstrap = function(){

    var contextRoot = window._BOOTSTRAP_CONTEXTROOT || '',
        ruiRoot = window._BOOTSTRAP_RUIROOT || '/rui',
        plugins = window._BOOTSTRAP_PLUGINS,
        setCookie = function(k, v, d){
            var exp = new Date(new Date().getTime() + (1000 * 60 * 60 * 24 * (d || 7)));
            document.cookie = k+'='+v+';expires='+exp.toGMTString();
        },
        getCookie = function(k){
            var c = document.cookie,
                cs = c.split(/;\s/g),
                i, len, t;
            for (i = 0, len = cs.length; i < len; i++) {
                //check for normally-formatted cookie (name-value)
                t = cs[i].match(/([^=]+)=/i);
                if (t instanceof Array && t[1] == k){
                    return cs[i].substring(t[1].length + 1);
                }
            }
        },
        getRuntime = function(url){
            var index = url.search('(\\?|&)rui_runtime=');
            if(index > -1){
                url = url.substring(index+13);
                if(url.indexOf('&') > -1)
                    return url.substring(0, url.indexOf('&'));
                else
                    return url;
            }
            return '';
        },
        qs = window.location.search,
        host = window.location.hostname,
        holded = getCookie('_rui-rt-hold_'),
        runtime = getRuntime(qs),
        urls = [
            'base',
            'core',
            'ui',
            'form',
            'grid'
        ],
        dev = false, debug = false, min = false,
        url, plugin,
        i, len;

    window.reloadPageForDebug = function(hold){
        var href = location.href,
            runtime = getRuntime(href),
            match;
        if(runtime && (runtime.indexOf('debug') == 0 || runtime.indexOf('dev') == 0)) return;
        if(runtime == 'min') href = href.substring(0, href.indexOf('rui_runtime=')-1) + href.substring(href.indexOf('min')+3);
        if(runtime == 'nodebug') href = href.substring(0, href.indexOf('rui_runtime=')-1) + href.substring(href.indexOf('nodebug')+8);
        match = href.match('\\?');
        href += (match && match.index > -1 ? '&' : '?') + 'rui_runtime=debug' + (hold ? '-hold' : '');
        location.href = href;
    };

    if(runtime == 'nodebug'){
        min = true;
        setCookie('_rui-rt-hold_', '');
    }else{
        if(!runtime && !holded && (host.search(/^localhost$/) !== -1 || host.search(/^127\.0\.0\.1$/) !== -1))
            debug = true;
        if(runtime.indexOf('-hold') < 0 && (holded == 'debug' || holded == 'dev' || holded == 'min'))
            runtime = holded;
        if(runtime){
            if(runtime.indexOf('dev') > -1)
                dev = true;
            if(runtime.indexOf('debug') > -1)
                debug = true;
            if(runtime.indexOf('min') > -1)
                min = true;
            if(runtime.indexOf('-hold') > 1)
                setCookie('_rui-rt-hold_', debug ? 'debug' : (min ? 'min' : 'dev'));
        }
    }

    for (i = 0, len = urls.length; i < len; i++){
        url = contextRoot + ruiRoot + '/js/rui_' + urls[i] + (debug ? '-debug' : (min ? '-min' : '')) +'.js';
        document.write('<script type="text/javascript" src="' + url + '" charset="utf-8"><\/script>');
    }
    
    if(plugins){
        if(typeof plugins == 'string') plugins = plugins.split(',');
        for (i = 0, len = plugins.length; i < len; i++){
            url = contextRoot + ruiRoot + '/plugins/' + plugins[i] + '/rui_' + plugins[i] + (debug ? '-debug' : (min ? '-min' : '')) +'.js';
            document.write('<script type="text/javascript" src="' + url + '" charset="utf-8"><\/script>');
            url = contextRoot + ruiRoot + '/plugins/' + plugins[i] + '/rui_' + plugins[i] + '.css';
            document.write('<link type="text/css" rel="stylesheet" href="' + url + '"/>');
        }
    }

};
Rui.LBootstrap();