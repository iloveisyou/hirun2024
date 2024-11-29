(function() {
    Rui.namespace('Rui.ui');
//    var Dom = Rui.util.LDom;
//    var Ev = Rui.util.LEvent;
    
    /**
    * @description LViewportManager
    * @namespace Rui.ui
    * @class LViewportManager
    * @extends Rui.ui.LComponent
    * @constructor LViewportManager
    * @param {Object} oConfig The intial LViewportManager.
    */
    Rui.ui.LViewportManager = function(config) {
        Rui.applyObject(this, config, true);
        
        this.init();
    };
    
    Rui.ui.LViewportManager.prototype = {
        CLASS_BASE : "l-viewport",
        
        isClean: true,
        
        defaultType: null,
        
        viewportTypes: [],
        
        init: function() {
            if(!this.defaultType) this.defaultType = Rui.fwType;
        },
        
        getViewportType: function(type) {
            for (var i = 0; i < this.viewportTypes.length; i++) {
                if(this.viewportTypes[i].id == type) return this.viewportTypes[i];
            }
            return null;
        },
        
        clean: function() {
            var viewportType = this.getViewportType(this.defaultType);
            if(this.defaultType == 'vp-pc') {
                for (var i = 0; i < this.viewportTypes.length; i++) {
                    var viewportEl = $C('.' + this.viewportTypes[i].id);
                    if(viewportEl.length == 0) continue;
                    viewportEl.addClass('viewport-clean');
                }
            } else {
                $C('body > div').addClass('viewport-clean');
                if(this.defaultType != 'vp-pc') {
                    $C('.' + viewportType.id).removeClass('viewport-clean');
                }
            }
        },
        
        add: function(el, selector) {
            if(!this.defaultType || this.defaultType == 'vp-pc') return;
            el = Rui.get(el);
            var parent;
            if (selector) {
                parent = $C(selector);
                if(parent.length) parent = parent.getAt(0);
            } else parent = el;
            parent.appendChild(el);
        },
        
        render: function() {
            if(this.isClean) this.clean();
            var viewportType = this.getViewportType(this.defaultType);
            if(viewportType.onReady) viewportType.onReady.call(window);
        }
    };
})();