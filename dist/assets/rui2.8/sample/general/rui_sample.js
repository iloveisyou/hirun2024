var ruiRootPath = '/rui2';
var contextPath = '';
try {
	var heads = [];
	if(document.head)
		heads = document.head.childNodes;
	else
		heads = document.scripts;
	for(var i = 0 ; i < heads.length; i++) {
		var src = heads[i].src;
		if(heads[i].tagName == 'SCRIPT' && src) {
			var sPos = src.indexOf('/rui2');
			if(sPos > 0) {
				ruiRootPath = '/rui2';
				var len = -1;
				if(document.location.origin)
					len = document.location.origin.length;
				else {
					len = document.location.href.indexOf(document.location.host);
					len += document.location.host.length;
				}
				contextPath = src.substring(len, sPos);
				break;
			} else  {
				sPos = src.indexOf('/rui');
				var ePos = src.indexOf('/', sPos + 1);
				ruiRootPath = src.substring(sPos, ePos);
				var len = -1;
				if(document.location.origin)
					len = document.location.origin.length;
				else {
					len = document.location.href.indexOf(document.location.host);
					len += document.location.host.length;
				}
				contextPath = src.substring(len, sPos);
				break;
			}
		}
	}
	var storage = new Rui.webdb.LWebStorage();
	var skinType = storage.get('skin_type', 'green');
	var url = ruiRootPath + '/resources/rui_sample_base.css';
	document.write('<link rel="stylesheet" type="text/css" href="' + contextPath + url + '"/>');
	document.write('<link rel="stylesheet" type="text/css" href="' + contextPath + ruiRootPath + '/resources/rui_skin_' + skinType + '.css' + '"/>');
	document.write('<link rel="stylesheet" type="text/css" href="' + contextPath + ruiRootPath + '/resources/rui_ie6.css' + '"/>');
} catch(ee) {
	alert('sample css 초기화 에러 : ' + ee.message);
}

Rui.onReady(function(){
    try{
        if(typeof isMobile == 'undefined' && isMobile) return;
    }catch(e){}
    if(!Rui.License){
        var ruiPath = Rui.getRootPath();
        Rui.includeJs(ruiPath + '/resources/rui_license.js', true);
    }
    var bodyEl = Rui.getBody();
    bodyEl.dom.id = 'doc3';
    
    /*
    var hdDiv = document.createElement('div');
    hdDiv.id = 'hd';
    var template = new Rui.LTemplate(
'<div id="hd-title">',
'    <div class="head_logo">',
'    </div>',
'</div>'
    );
    
    var contextPath = (Rui.getConfig) ? Rui.getConfig().getFirst('$.core.contextPath') : '';
    var ruiRootPath = (Rui.getConfig) ? Rui.getConfig().getFirst('$.core.ruiRootPath') : '/rui2';
    var p = {
        ruiUrl: 'http://www.dev-on.com/rui/',
        devOnImg : contextPath + ruiRootPath + '/api/assets/logo_devon3.png'
    };
    
    hdDiv.innerHTML = template.apply(p);
    
    var firstEl = bodyEl.getChildren()[0];
    
    firstEl.insertBefore(hdDiv);
     */
    
    try {
        
        var bdEl = Rui.get('bd');
        if(!bdEl) return;
        
        var blockCodeDom = document.createElement('div');
        blockCodeDom.className = 'blockCode';
        
        Rui.util.LDom.insertAfter(blockCodeDom, bdEl.dom);

        var templateHtml = '';
        
        var idx = location.href.indexOf('rui2');
        templateHtml += '<p>경로 : <a href="' + location.href 
                     + ';return false;" target="_blank">' + location.href.substring(idx+4, location.href.length) + '</a></p>';
        templateHtml += '<p><a href="#;return false;" class="more">Sample Source</a></p>';
        templateHtml += '<div class="detail">';
        
        var oHead = document.getElementsByTagName('head')[0];
        var scripts = [];
        var styles = [];
        for(var i = 0 ; i < oHead.children.length ; i++) {
            if(oHead.children[i].type) {
                if (oHead.children[i].type.indexOf('javascript') > 0) {
                    scripts.push(oHead.children[i]);
                } else if (oHead.children[i].type.indexOf('css') > 0) {
                    styles.push(oHead.children[i]);
                }
            }
        }
        templateHtml += '<h3>포함된 scripts</h3>';
        templateHtml += '<ul class="scripts">';
        for(var i = 0 ; i < scripts.length ; i++) {
            if(scripts[i].src && scripts[i].src.indexOf('sample') < 0) {
                var src = scripts[i].src;
                src = src.substring(src.indexOf(ruiRootPath));
                templateHtml += '<li>' + src + '</li>';
            }
        }
        templateHtml += '</ul>';
        templateHtml += '<h3>포함된 styles</h3>';
        templateHtml += '<ul class="scripts">';
        for(var i = 0 ; i < styles.length ; i++) {
            if(styles[i].href && styles[i].href.indexOf('sample') < 0) {
                var href = styles[i].href;
                href = href.substring(href.indexOf('/rui2'));
                templateHtml += '<li>' + href + '</li>';
            }
        }
        templateHtml += '</ul>';
        templateHtml += '<pre class="script-pre"><code></code></pre>';
        templateHtml += '<p><a href="#" class="more">Sample </a></p>';
        blockCodeDom.innerHTML = templateHtml;
        var markupHtml = $S('.LblockMarkupCode').getAt(0).dom.innerHTML;
        markupHtml = markupHtml.replace(/</g, '&lt;');
        markupHtml = (Rui.browser.msie) ? markupHtml.replace(/>/g, '&gt;<br>') : markupHtml.replace(/>/g, '&gt;');
        var html = '';
        html += $S('.script-code').getAt(0).dom.text;
        html = html.replace(/</g, '&lt;');
        html = html.replace(/>/g, '&gt;');
        var sb = '/*&lt;b&gt;*/';
        var eb = '/*&lt;/b&gt;*/';
        for(var i = 0 ; i < 10 ; i++) {
            html = html.replace(sb, '<b>');
            html = html.replace(eb, '</b>');
        }

        var componentList = [];
        var sPos = -1;
        while((sPos = html.indexOf("new Rui.", (sPos + 1))) > 0 ) {
            var ePos = html.indexOf("(", sPos);
            var componentName = html.substring(sPos + 4, ePos);
            if(!Rui.util.LArray.contains(componentList, componentName))
                componentList.push(componentName);
        }
        componentList.sort();
        var componentHtml = '<ul>';
        for(var i = 0 ; i < componentList.length ; i++) {
            var component = componentList[i];
            var componentUrl = contextPath + ruiRootPath + '/api/index.html?type=' + component;
            componentHtml += '<li><a href="' + componentUrl + '" target="_new">' + component + '</a></li>';
        }        
        componentHtml += '</ul>';
        $S('.blockCode code').html('<h3>HTML tags</h3>' + markupHtml + '<h3>Component references</h3>' + componentHtml + '<h3>script source</h3>' + html + '</div>');
        
        $S('.more').on('click', function(e){
            $E(this).parent('.blockCode').toggleClass('expand');
        });
    }catch(e) {
    }
    
    
    Rui.getConfig().set('$.ext.dateBox.defaultProperties.valueFormat', '%Y-%m-%d');
    Rui.getConfig().set('$.ext.datetimeBox.defaultProperties.valueFormat', '%Y-%m-%d %H:%M:%S');
    Rui.getConfig().set('$.ext.multicombo.defaultProperties.placeholder', Rui.getMessageManager().get('$.base.msg108'));
    
});
