/*
 * @(#) LDDPlayer-debug.js
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
Rui.namespace('Rui.dd');
/**
 * @namespace Rui.dd
 * @plugin
 * @class LDDPlayer
 * @extends Rui.dd.LDDProxy
 * @constructor
 * @param {String} id 드랍 대상인 element의 id
 * @param {String} group 연관된 LDragDrop object들의 그룹
 * @param {object} attributes 설정 가능한 attribute를 포함한 object
 *                 LDragDrop에 추가적으로 LDDPlayer에 대해 유효한 속성들: 
 */
Rui.dd.LDDPlayer = function(config){
    Rui.dd.LDDPlayer.superclass.constructor.call(this, config);
    this.initPlayer(config);
};
Rui.extend(Rui.dd.LDDPlayer, Rui.dd.LDDProxy, {

    TYPE: 'LDDPlayer',
    
    initPlayer: function(config){
        if (!config) {
            return;
        }
        
        var el = this.getDragEl();
        Rui.util.LDom.setStyle(el, 'borderColor', 'transparent');
        Rui.util.LDom.setStyle(el, 'opacity', 0.76);
        
        // specify that this is not currently a drop target
        this.isTarget = false;
        
        this.originalStyles = [];
        
        this.type = Rui.dd.LDDPlayer.TYPE;
        this.slot = null;
        
        this.startPos = Rui.util.LDom.getXY(this.getEl());
    },
    
    startDrag: function(x, y){
        var Dom = Rui.util.LDom;
        
        var dragEl = this.getDragEl();
        var clickEl = this.getEl();
        
        dragEl.innerHTML = clickEl.innerHTML;
        dragEl.className = clickEl.className;
        
        Dom.setStyle(dragEl, 'color', Dom.getStyle(clickEl, 'color'));
        Dom.setStyle(dragEl, 'backgroundColor', Dom.getStyle(clickEl, 'backgroundColor'));
        
        Dom.setStyle(clickEl, 'opacity', 0.1);
        
        var targets = Rui.dd.LDDM.getRelated(this, true);
        Rui.log(targets.length + ' targets', 'info', 'dd');
        for (var i = 0; i < targets.length; i++) {
        
            var targetEl = this.getTargetDomRef(targets[i]);
            
            if (!this.originalStyles[targetEl.id]) {
                this.originalStyles[targetEl.id] = targetEl.className;
            }
            
            Dom.addClass(targetEl, 'target');
        }
    },
    
    getTargetDomRef: function(oDD){
        if (oDD.player) {
            return oDD.player.getEl();
        }
        else {
            return oDD.getEl();
        }
    },
    
    endDrag: function(e){
        // reset the linked element styles
        Rui.util.LDom.setStyle(this.getEl(), 'opacity', 1);
        
        this.resetTargets();
    },
    
    resetTargets: function(){
        // reset the target styles
        var targets = Rui.dd.LDDM.getRelated(this, true);
        for (var i = 0; i < targets.length; i++) {
            var targetEl = this.getTargetDomRef(targets[i]);
            var oldStyle = this.originalStyles[targetEl.id];
            if (oldStyle) {
                Rui.util.LDom.removeClass(targetEl, 'target');
            }
        }
    },
    
    onDragDrop: function(e, id){
        // get the drag and drop object that was targeted
        var oDD;
        
        if ('string' == typeof id) {
            oDD = Rui.dd.LDDM.getDDById(id);
        }
        else {
            oDD = Rui.dd.LDDM.getBestMatch(id);
        }
        
        var el = this.getEl();
        
        // check if the slot has a player in it already
        if (oDD.player) {
            // check if the dragged player was already in a slot
            if (this.slot) {
                // check to see if the player that is already in the
                // slot can go to the slot the dragged player is in
                // Rui.dd.LDDM.isLegalTarget is a new method
                if (Rui.dd.LDDM.isLegalTarget(oDD.player, this.slot)) {
                    Rui.log('swapping player positions', 'info', 'dd');
                    Rui.dd.LDDM.moveToEl(oDD.player.getEl(), el);
                    this.slot.player = oDD.player;
                    oDD.player.slot = this.slot;
                }
                else {
                    Rui.log('moving player in slot back to start', 'info', 'dd');
                    Rui.util.LDom.setXY(oDD.player.getEl(), oDD.player.startPos);
                    this.slot.player = null;
                    oDD.player.slot = null;
                }
            }
            else {
                // the player in the slot will be moved to the dragged
                // players start position
                oDD.player.slot = null;
                Rui.dd.LDDM.moveToEl(oDD.player.getEl(), el);
            }
        }
        else {
            // Move the player into the emply slot
            // I may be moving off a slot so I need to clear the player ref
            if (this.slot) {
                this.slot.player = null;
            }
        }
        
        Rui.dd.LDDM.moveToEl(el, oDD.getEl());
        this.resetTargets();
        
        this.slot = oDD;
        this.slot.player = this;
    },
    
    swap: function(el1, el2){
        var Dom = Rui.util.LDom;
        var pos1 = Dom.getXY(el1);
        var pos2 = Dom.getXY(el2);
        Dom.setXY(el1, pos2);
        Dom.setXY(el2, pos1);
    }
    
});
