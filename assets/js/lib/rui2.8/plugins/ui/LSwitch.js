/*
 * @(#) LSwitch.js
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
 * 
 * (추가) Plugin 하위 목록에 포함된 파일의 경우 프로젝트에서 임의로 customizing 해서 사용 가능합니다.
 * 단, 프로젝트에서 customizing 한 사항은 기술지원 대상 범위에서 제외됩니다.
 * 
 */

Rui.ui.LSwitch = function(config) {
    config = config || {};
    Rui.ui.LSwitch.superclass.constructor.call(this, config);
    this.createEvent('changed');
};
Rui.extend(Rui.ui.LSwitch, Rui.ui.LUIComponent, {
    otype: 'Rui.ui.LSwitch',
    toggle: true,
    count: 1,
    items: null,
    createContainer: function(appendTo) {
        Rui.ui.LSwitch.superclass.createContainer.call(this, appendTo);
        this.el.addClass('L-switch');
        return this.el;
    },
    doRender: function(){
        var el = this.el,
            switchEl = document.createElement('ul'),
            buttonEl, item;
        this.buttons = [];
        this.buttonIndexes = {};
        if(this.items){
        	this.count = this.items.length;
        	this.hasItems = true;
        }
        for (var i = 0; i < this.count; i++){
            buttonEl = document.createElement('li');
            buttonEl = Rui.get(switchEl.appendChild(buttonEl));
            buttonEl.addClass('L-switch-button');
            buttonEl.addClass('L-switch-button-' + i);
            if(i == 0){
                buttonEl.addClass('L-switch-first-button');
            }else if(i == this.count -1){
                buttonEl.addClass('L-switch-last-button');
            }
            buttonEl.setStyle('cursor', 'pointer');
            this.buttons[i] = buttonEl;
            this.buttonIndexes[buttonEl.dom.id] = i;
            if(this.hasItems){
            	item = this.items[i];
            	var labelEl = document.createElement('div');
            	labelEl = Rui.get(labelEl);
            	labelEl.addClass('L-switch-label');
            	if(item.label)
            		labelEl.html(item.label);
            	buttonEl.appendChild(labelEl);
            }
            buttonEl.on('click', this.onClick, this, true);
        }
        if(this.count > 1){
            Rui.get(switchEl).addClass('L-switch-multiple');
        }else{
            Rui.get(switchEl).addClass('L-switch-single');
        }
        el.appendChild(switchEl);
    },
    pushOn: function(index){
        var button = this.buttons[index];
        if(button.hasClass('L-switch-on') !== true){
            if(this.toggle !== true)
                this.pushOff(index);
            button.addClass('L-switch-on');
            this.el.addClass('L-switch-on-' + index);
            this.fireEvent('changed', {type: 'on', index: index});
        }
    },
    pushOff: function(index){
        var button;
        if(this.toggle === true){
            button = this.buttons[index];
            if(button.hasClass('L-switch-on') === true){
                button.removeClass('L-switch-on');
                this.el.removeClass('L-switch-on-' + index);
                this.fireEvent('changed', {type: 'off', index: index});
            }
        }else{
            for (var i = 0, len = this.buttons.length; i < len; i++){
                button = this.buttons[i];
                if(button.hasClass('L-switch-on') === true){
                    button.removeClass('L-switch-on');
                    this.el.removeClass('L-switch-on-' + i);
                    this.fireEvent('changed', {type: 'off', index: i});
                }
            }
        }
    },
    push: function(index){
        if(this.toggle === true && this.isOn(index)){
            this.pushOff(index);
        }else{
            this.pushOn(index);
        }
    },
    isOn: function(index){
        return this.buttons[index].hasClass('L-switch-on');
    },
    getValue: function() {
        if(this.toggle === true){
            var values = [];
            for (var i = 0, len = this.buttons.length; i < len; i++){
                values[i] = this.buttons[i].hasClass('L-switch-on');
            }
            return values;
        }else{
            for (var i = 0, len = this.buttons.length; i < len; i++){
                if(this.buttons[i].hasClass('L-switch-on'))
                    return i;
            }
            return -1;
        }
    },
    setLabel: function(index, label){
    	if(this.hasItems){
    		var button = this.buttons[index];
    		if(button){
    			var labelEl = button.select('.L-switch-label').getAt(0);
    			labelEl.html(label);
    		}
    	}
    },
    getLabel: function(index){
    	if(this.hasItems !== true) return null;
		var button = this.buttons[index];
		if(!button) return null;
		return button.select('.L-switch-label').getAt(0).dom.innerHTML;
    },
    onClick: function(e){
    	var id = e.target.id;
    	if(this.hasItems){
        	var targetEl = Rui.get(e.target);
        	id = targetEl.findParent('.L-switch-button', 3).id;
    	}
        var index = this.buttonIndexes[id];
        if(index != undefined){
            this.push(index);
        }
    },
    destroy: function(){
        for (var i = 0, len = this.buttons.length; i < len; i++){
            this.buttons[i].unOn('click', this.onClick, this);
        }
        this.el.html('');
    }
});