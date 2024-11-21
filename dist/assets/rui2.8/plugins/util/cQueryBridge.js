 
 



var cQuery = function(selector) {
    if (typeof selector === 'string') {
        if (selector.charAt(0) == '!') {
            return cQuery.statics[selector.substring(1)];
        }
        if (!(selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3)) {
            if(selector.charAt(0) == '#' && selector.indexOf(' ') < 0 && selector.indexOf(':') < 0){
                var id = selector.substring(1);
                if(cQuery.objDatas[id]) {
                    return cQuery.objDatas[id];
                } 
            }
        }
    }
    return cQuery.fn.init(selector);
}

cQuery.fn = cQuery.prototype = {
    statics: {},
    init: function(selector) {
        if ( !selector ) {
            return this;
        }
        if(selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3) {
            this.elList = Rui.createElements(selector);
        } else {
            this.elList = Rui.select(selector);
        }
        return this;
    },
    addStatic: function(type, cls) {
        this.statics[type] = cls;
    },
    addObject: function(type, cls) {
        cQuery[type] = cQuery.fn[type] = function(config){
            if(this.elList && this.elList.length > 0) {
                config.applyTo = this.elList.getAt(0).dom.id;
            }
            var obj = new cls(config);
            if(config.applyTo)
                cQuery.objDatas[config.applyTo] = obj; 
            return obj;
        };
    },
    invoke: function(fn, args){
        if(this.elList) {
            var els = this.elList.elements;
            Rui.each(els, function(e) {
                Rui.LElement.prototype[fn].apply(e, args);
            }, this);
        }
        return this;
    },
    ajax: Rui.ajax
};


(function(){
var ElProto = Rui.LElement.prototype,
    CelProto = cQuery.fn;

for(var fnName in ElProto){
    if(Rui.util.LObject.isFunction(ElProto[fnName])){
        (function(fnName){ 
            CelProto[fnName] = CelProto[fnName] || function(){
                return this.invoke(fnName, arguments);
            };
        }).call(CelProto, fnName);
    }
};
})();

cQuery.objDatas = {};

Rui.applyObject(cQuery, cQuery.fn);

window.$C = cQuery;

$C.addStatic('config', Rui.config.LConfiguration.getInstance());
$C.addObject('dataSet', Rui.data.LJsonDataSet);
$C.addObject('tree', Rui.ui.tree.LTreeView);
$C.addObject('bind', Rui.data.LBind);
$C.addObject('numberBox', Rui.ui.form.LNumberBox);
$C.addObject('validatorManager', Rui.validate.LValidatorManager);

