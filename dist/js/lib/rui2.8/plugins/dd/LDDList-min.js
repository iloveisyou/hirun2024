/*
 * @(#) LDDList-min.js
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
!function(){Rui.namespace("Rui.dd");var r=Rui.util.LDom,e=Rui.util.LEvent,n=Rui.dd.LDragDropManager;Rui.dd.LDDList=function(t){Rui.dd.LDDList.superclass.constructor.call(this,t),this.isProxy=Rui.applyIf(t.isProxy,{isProxy:!0}),this.logger=this.logger||Rui;var i=this.getDragEl();r.setStyle(i,"opacity",.67),this.goingUp=!1,this.lastY=0},Rui.extend(Rui.dd.LDDList,Rui.dd.LDDProxy,{startDrag:function(t,i){this.logger.log(this.id+" startDrag");var e=this.getDragEl(),o=this.getEl();r.setStyle(o,"visibility","hidden"),this.isProxy&&(e.innerHTML=o.innerHTML),r.setStyle(e,"color",r.getStyle(o,"color")),r.setStyle(e,"backgroundColor",r.getStyle(o,"backgroundColor")),r.setStyle(e,"border","2px solid gray")},endDrag:function(t){var i=this.getEl(),e=this.getDragEl();r.setStyle(e,"visibility","");var o=new Rui.fx.LMotionAnim({el:e,attributes:{points:{to:r.getXY(i)}},duration:.2,method:Rui.fx.LEasing.easeOut}),s=e.id,n=this.id;o.on("complete",function(){r.setStyle(s,"visibility","hidden"),r.setStyle(n,"visibility","")}),o.animate()},onDragDrop:function(t,i){var e,o,s;1===n.interactionInfo.drop.length&&(e=n.interactionInfo.point,n.interactionInfo.sourceRegion.intersect(e)||(o=r.get(i),s=n.getDDById(i),o.appendChild(this.getEl()),s.isEmpty=!1,n.refreshCache()))},onDrag:function(t){var i=e.getPageY(t);i<this.lastY?this.goingUp=!0:i>this.lastY&&(this.goingUp=!1),this.lastY=i},onDragOver:function(t,i){var e,o=this.getEl(),s=r.get(i);"li"==s.nodeName.toLowerCase()&&(e=s.parentNode,this.goingUp?e.insertBefore(o,s):e.insertBefore(o,s.nextSibling),n.refreshCache())}})}();