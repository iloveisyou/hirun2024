 
 



(function(cQuery){
    Rui.applyObject(cQuery, {
        statics: {},
        addStatic: function(type, cls) {
            this.statics[type] = cls;
        },
        addObject: function(type, cls) {
            this.addStatic(type, cls);
            Rui.LElementList.prototype[type] = cQuery[type] = function(config){
                config = config || {};
                var applyTo;
                if(this.elements && this.length > 0) {
                    applyTo = config.applyTo = this.getAt(0).dom.id;
                }
                try {
                    var obj = new cls(config);
                    if(applyTo)
                        cQuery.objDatas[applyTo] = obj; 
                } catch(e) {
                    Rui.log(type + ' : ' + e.message, 'error', 'simplesyntax');
                    throw e;
                }
                return obj;
            };
            var s = cQuery[type];
            
            var m;
            for(m in cls) {
                if(Rui.util.LObject.isFunction(cls[m])) continue;
                s[m] = cls[m];
            }
        },
        select: function(selector, root, firstOnly) {
            return Rui.select(selector, root, firstOnly, true);
        },
        log: Rui.log,
        namespace: Rui.namespace,
        dump: Rui.dump,
        alert: Rui.alert,
        confirm: Rui.confirm,
	    prompt: Rui.prompt,
        extend: Rui.extend
    });
    cQuery.objDatas = {};

    Rui.select = function (selector, root, firstOnly, elementOnly) {
        if(arguments.length < 1) return new Rui.LElementList();
        if (Rui.util.LObject.isFunction(selector)) {
            Rui.onReady(selector);
            return new Rui.LElementList();
        }
        var element = [];
        if(typeof selector == 'string') {
            if (selector.charAt(0) == '!') {
                return cQuery.statics[selector.substring(1)];
            }
            if (elementOnly !== true && !(selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3)) {
                if(selector.charAt(0) == '#' && selector.indexOf(' ') < 0 && selector.indexOf(':') < 0){
                    var id = selector.substring(1);
                    if(cQuery.objDatas[id]) {
                        return cQuery.objDatas[id];
                    } 
                }
            }
            
            if(selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3) {
                return Rui.createElements(selector);
            }
            var n = Rui.util.LDomSelector.query(selector, root, firstOnly);
            if(Rui.util.LArray.isArray(n)) {
                Rui.each(n, function(child) {
                    element.push(new Rui.LElement(child));
                });
            } else {
                if(!Rui.util.LObject.isEmpty(n)) element.push(new Rui.LElement(n));
            }
        } else {
            var el = Rui.get(selector);
            if(el) element.push(el); 
        }
        return new Rui.LElementList(element);
    };
    var m;
    var objectList = [];
    if(Rui.data)
    	objectList.push(Rui.data);
    if(Rui.dd)
    	objectList.push(Rui.dd);
    if(Rui.fx)
    	objectList.push(Rui.fx);
    if(Rui.validate)
    	objectList.push(Rui.validate);
    if(Rui.ui)
    	objectList = objectList.concat([Rui.ui, Rui.ui.grid, Rui.ui.form, Rui.ui.tab, Rui.ui.tree, Rui.ui.menu]);
    
    for(var i = 0, len = objectList.length; i < len ; i++) {
        for(m in objectList[i]) {
            var fc = m.substring(1, 3).toLowerCase();
            var shotName = fc + m.substring(3);
            cQuery.addObject(shotName, objectList[i][m]);
        } 
    }
    
    if(Rui.ui && Rui.ui.grid){
    	cQuery.addObject('grid', Rui.ui.grid.LGridPanel);
    }

    if(Rui.data){
        cQuery.addObject('record', Rui.data.LRecord);
        cQuery.addObject('bind', Rui.data.LBind);
        cQuery.addObject('dataSetManager', Rui.data.LDataSetManager);
        cQuery.addObject('dataSet', Rui.data.LJsonDataSet);
    }

    if(Rui.util.LKeyListener){
        cQuery.addObject('keyListener', Rui.util.LKeyListener);
    }
    if(Rui.util.LDelayedTask){
        cQuery.addObject('delayedTask', Rui.util.LDelayedTask);
    }
    if(Rui.util.LResize){
        cQuery.addObject('resize', Rui.util.LResize);
    }
    if(Rui.util.LResizeMonitor){
        cQuery.addObject('resizeMonitor', Rui.util.LResizeMonitor);
    }

	cQuery.addStatic('connect', Rui.LConnect);
	if(Rui.config && Rui.config.LConfiguration){
		cQuery.addStatic('config', Rui.config.LConfiguration.getInstance());
	}
	if(Rui.message && Rui.message.LMessageManager){
		cQuery.addStatic('message', new Rui.message.LMessageManager());
	}

    for(m in Rui.util) {
        if(typeof Rui.util[m] === 'function')
            continue;
        var sName = Rui.util.LString.firstLowerCase(m.substring(1));
        cQuery[sName] = Rui.util[m];
    }
    
    cQuery.browser = Rui.browser;
    cQuery.platform = Rui.platform;
    
})(window.$C);

