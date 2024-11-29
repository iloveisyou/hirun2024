/**
 * @description RUI에서 태블릿 인터페이스는 콤포넌트로 지원되게 하는 클래스(Beta)
 * @module ui
 * @title LTabletSupport
 */
(function() {
    var Ev = Rui.util.LEvent;
    /**
     * @description RUI에서 태블릿 인터페이스는 콤포넌트로 지원되게 하는 클래스(Beta)
     * @namespace Rui.ui
     * @class LTabletSupport
     * @plugin
     * @sample default
     * @constructor LTabletSupport
     * @param {Object} oConfig The intial LTabletSupport.
     */
    Rui.ui.LTabletSupport = function(oConfig) {
    };
    
    Rui.ui.LTabletSupport = {
    	createTabletToolbar: function(gridPanel, e) {
    		var gridAction = new Rui.ui.grid.LTabletGridAction({
    			gridPanel: gridPanel
    		});

    		//나중에 패널로 랜더링시점을 옮겨야함.
        	gridPanel.el.on('touchstart', function(e){
            	if(e.touches && e.touches.length < 3) return;
            	this.tabletView();
        	}, gridPanel, true);
        	
    		gridAction.setXY([Ev.getPageX(e.event), Ev.getPageY(e.event)]);
    		return gridAction;
    	}
    };

    /**
     * @description 마우스나 키보드를 적용하는 action 메뉴를 출력한다.
     * @namespace Rui.ui
     * @class LTabletActionMenu
     * @plugin
     * @constructor LTabletActionMenu
     * @param {Object} oConfig The intial LTabletActionMenu.
     */
    Rui.ui.LTabletActionMenu = function(oConfig) {
    	Rui.applyObject(this, oConfig, true);
    	this.createContainer();
    	this.gridPanel.on('cellClick', this.onCellClick, this, true);
    };
    
    Rui.ui.LTabletActionMenu.prototype = {
    	createContainer: function() {
    		var master = new Rui.LTemplate(
    			'<div class="L-{cssBase}">',
    			'<ul>{menuList}</ul>',
    			'</div>'
    		);
    		
    		var menuList = new Rui.LTemplate(
    			'<li><span class="L-action-menu-item L-cell-dbl-click L-ignore-blur">{menuName}</span></li>'
    		);
    		
    		var menuListHtml = '';
    		menuListHtml += menuList.apply({ menuName: 'Cell Double Click' });
    		
    		this.el = Rui.createElements(master.apply({ cssBase: this.CSS_BASE, menuList: menuListHtml })).getAt(0);
    		this.el.on('click', this.invokeClick, this, true);
    		Rui.util.LEvent.addListener(Rui.browser.msie ? document.body : document, 'mousedown', this.deferOnBlur, this, true);
    		Rui.getBody().appendChild(this.el);
    	},
    	deferOnBlur: function(e) {
            Rui.util.LFunction.defer(this.checkBlur, 10, this, [e]);
        },
        checkBlur:function(e) {
            if(e.deferCancelBubble == true) return;
            var target = e.target;
            if(!this.el.isAncestor(target)) {
                this.hideActionMenu();                
            }
        },
    	hideActionMenu: function(e) {
    		this.el.hide();
    	},
    	setXY: function(xy) {
    		xy[0] -= 50;
    		xy[1] -= 70;
    		this.el.setXY(xy);
    	},
    	onCellClick: function(e) {
    		var me = this;
    		setTimeout(function() {
        		me.el.show();
        		me.setXY([Ev.getPageX(e.event), Ev.getPageY(e.event)])
    		}, 150);
    	},
    	invokeClick: function(e) {
    		var targetEl = Rui.get(e.target);
    		if(targetEl.hasClass('L-cell-dbl-click')) {
    			e.type = 'dblclick';
    			this.onDblClick(e);
    		}
    	},
    	onDblClick: function(e) {
    	}
    };
    
    /**
     * @description 마우스나 키보드를 적용하는 action 메뉴를 출력한다.
     * @namespace Rui.ui.grid
     * @class LTabletGridAction
     * @plugin
     * @constructor LTabletGridAction
     * @param {Object} oConfig The intial LTabletGridAction.
     */
    Rui.ui.grid.LTabletGridAction = function(oConfig) {
    	var config = oConfig || {};
    	config.event = Rui.applyIf(config.event || {}, {
    		event: {
    			onCellClick: true
    		}
    	});
    	Rui.ui.grid.LTabletGridAction.superclass.constructor.call(this, config);
    };
    
    Rui.extend(Rui.ui.grid.LTabletGridAction, Rui.ui.LTabletActionMenu, {
    	CSS_BASE: 'grid-action-menu',
    	onDblClick: function(e) {
    		Ev.stopEvent(e);
    		var gridPanel = this.gridPanel, cm = gridPanel.columnModel;
    		var sm = gridPanel.getSelectionModel();
    		var row = sm.getRow();
    		var col = sm.getCol();
    		var colId = cm.getColumnAt(col).id;
    		var dblClickEvent = { target: gridPanel, event: e, row: row, col: col, colId: colId };
            var ret = gridPanel.fireEvent('cellDblClick', dblClickEvent);
            if(ret === false) {
                gridPanel.getView().cancelViewFocus();
            }
            this.hideActionMenu();
    	}
    });
    
})();