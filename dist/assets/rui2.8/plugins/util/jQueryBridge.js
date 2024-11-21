 
 



jQuery.fn.orinInit = jQuery.fn.init;

jQuery.init = jQuery.fn.init = function(selector, context, rootjQuery) {
    if (typeof selector === 'string') {
        if (!(selector.charAt(0) === "<" && selector.charAt(selector.length - 1) === ">" && selector.length >= 3)) {
            if (selector.charAt(0) == '!') {
                return jQuery.statics[selector.substring(1)];
            } else if(selector.charAt(0) == '#' && selector.indexOf(' ') < 0){
                var id = selector.substring(1);
                if(jQuery.objDatas[id]) {
                    return jQuery.objDatas[id];
                } 
            }
        }
    }
    return jQuery.fn.orinInit(selector, context, rootjQuery);
}

jQuery.objDatas = {};
jQuery.statics = {};

jQuery.extend(jQuery, {
    objDatas: {},
    statics: {},
    addStatic: function(type, cls) {
        this.statics[type] = cls;
    },
    addObject: function(type, cls) {
        jQuery[type] = jQuery.fn[type] = function(config){
            var applyTo;
            if(config) {
                for(var i = 0 ; this.length && i < this.length; i++) {
                    if(this[i] && this[i].nodeType && this[i].id) {
                        applyTo = config.applyTo = this[i].id;
                        break;
                    }
                };
            }
            var obj = new cls(config);
            if(applyTo)
                jQuery.objDatas[applyTo] = obj; 
            return obj;
        }
    },
    log: function(msg, cat, src) {
        Rui.log(msg, cat, src);
    }
});

jQuery.addStatic('config', Rui.config.LConfiguration.getInstance());
jQuery.addObject('dataSet', Rui.data.LJsonDataSet);
jQuery.addObject('dataSetManager', Rui.data.LDataSetManager);
jQuery.addObject('tree', Rui.ui.tree.LTreeView);
jQuery.addObject('bind', Rui.data.LBind);
jQuery.addObject('textBox', Rui.ui.form.LTextBox);
jQuery.addObject('numberBox', Rui.ui.form.LNumberBox);
jQuery.addObject('combo', Rui.ui.form.LCombo);
jQuery.addObject('checkBox', Rui.ui.form.LCheckBox);
jQuery.addObject('numberBox', Rui.ui.form.LNumberBox);
jQuery.addObject('dateBox', Rui.ui.form.LDateBox);
jQuery.addObject('radioGroup', Rui.ui.form.LRadioGroup);
jQuery.addObject('textArea', Rui.ui.form.LTextArea);

jQuery.addObject('validatorManager', Rui.validate.LValidatorManager);
jQuery.addObject('button', Rui.ui.LButton);

jQuery.addObject('columnModel', Rui.ui.grid.LColumnModel);
jQuery.addObject('stateColumn', Rui.ui.grid.LStateColumn);
jQuery.addObject('selectionColumn', Rui.ui.grid.LSelectionColumn);
jQuery.addObject('numberColumn', Rui.ui.grid.LNumberColumn);
jQuery.addObject('editButtonColumn', Rui.ui.grid.LEditButtonColumn);
jQuery.addObject('gridPanel', Rui.ui.grid.LGridPanel);


