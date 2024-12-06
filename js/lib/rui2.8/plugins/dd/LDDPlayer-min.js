/*
 * @(#) LDDPlayer-min.js
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
Rui.namespace("Rui.dd"),Rui.dd.LDDPlayer=function(t){Rui.dd.LDDPlayer.superclass.constructor.call(this,t),this.initPlayer(t)},Rui.extend(Rui.dd.LDDPlayer,Rui.dd.LDDProxy,{TYPE:"LDDPlayer",initPlayer:function(t){var e;t&&(e=this.getDragEl(),Rui.util.LDom.setStyle(e,"borderColor","transparent"),Rui.util.LDom.setStyle(e,"opacity",.76),this.isTarget=!1,this.originalStyles=[],this.type=Rui.dd.LDDPlayer.TYPE,this.slot=null,this.startPos=Rui.util.LDom.getXY(this.getEl()))},startDrag:function(t,e){var l=Rui.util.LDom,i=this.getDragEl(),s=this.getEl();i.innerHTML=s.innerHTML,i.className=s.className,l.setStyle(i,"color",l.getStyle(s,"color")),l.setStyle(i,"backgroundColor",l.getStyle(s,"backgroundColor")),l.setStyle(s,"opacity",.1);var a=Rui.dd.LDDM.getRelated(this,!0);Rui.log(a.length+" targets","info","dd");for(var r=0;r<a.length;r++){var o=this.getTargetDomRef(a[r]);this.originalStyles[o.id]||(this.originalStyles[o.id]=o.className),l.addClass(o,"target")}},getTargetDomRef:function(t){return t.player?t.player.getEl():t.getEl()},endDrag:function(t){Rui.util.LDom.setStyle(this.getEl(),"opacity",1),this.resetTargets()},resetTargets:function(){for(var t=Rui.dd.LDDM.getRelated(this,!0),e=0;e<t.length;e++){var l=this.getTargetDomRef(t[e]);this.originalStyles[l.id]&&Rui.util.LDom.removeClass(l,"target")}},onDragDrop:function(t,e){var l="string"==typeof e?Rui.dd.LDDM.getDDById(e):Rui.dd.LDDM.getBestMatch(e),i=this.getEl();l.player?this.slot?Rui.dd.LDDM.isLegalTarget(l.player,this.slot)?(Rui.log("swapping player positions","info","dd"),Rui.dd.LDDM.moveToEl(l.player.getEl(),i),this.slot.player=l.player,l.player.slot=this.slot):(Rui.log("moving player in slot back to start","info","dd"),Rui.util.LDom.setXY(l.player.getEl(),l.player.startPos),this.slot.player=null,l.player.slot=null):(l.player.slot=null,Rui.dd.LDDM.moveToEl(l.player.getEl(),i)):this.slot&&(this.slot.player=null),Rui.dd.LDDM.moveToEl(i,l.getEl()),this.resetTargets(),this.slot=l,this.slot.player=this},swap:function(t,e){var l=Rui.util.LDom,i=l.getXY(t),s=l.getXY(e);l.setXY(t,s),l.setXY(e,i)}});