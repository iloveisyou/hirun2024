/*
 * @(#) LTooltip-min.js
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
!function(){var c=Rui.util.LEvent;Rui.namespace("Rui.ui"),Rui.ui.LTooltip=function(t){Rui.ui.LTooltip.superclass.constructor.call(this,t)},Rui.extend(Rui.ui.LTooltip,Rui.ui.LUIComponent,{otype:"Rui.ui.LTooltip",CSS_BASE:"L-stt",id:null,showdelay:500,autodismissdelay:5e3,showmove:!1,context:null,text:null,gridPanel:null,margin:5,initComponent:function(t){Rui.ui.LTooltip.superclass.initComponent.call(this),this.id||(this.id=t&&t.id||Rui.id())},initDefaultConfig:function(){Rui.ui.LTooltip.superclass.initDefaultConfig.call(this),this.cfg.addProperty("showdelay",{value:this.showdelay,validator:Rui.isNumber}),this.cfg.addProperty("autodismissdelay",{value:this.autodismissdelay,validator:Rui.isNumber})},initEvents:function(){this.ctxEl=Rui.get(this.context),this._createEvents()},gridEvents:function(t){this.gridPanel=t,this.ctxEl=this.gridPanel.getView().el,this._createEvents()},_createEvents:function(){null!=this.ctxEl&&(this.ctxEl.on("mouseover",this.onContextMouseOver,this,!0,{system:!0}),this.showmove&&this.ctxEl.on("mousemove",this.onContextMouseMove,this,!0,{system:!0}),this.ctxEl.on("mouseout",this.onContextMouseOut,this,!0,{system:!0}))},_createElement:function(){var t=document.createElement("div");t.id=this.id,(t=Rui.get(t)).addClass(this.CSS_BASE),t.addClass("L-fixed"),t.addClass("L-hide-display"),Rui.useAccessibility()&&(t.setAttribute("role","tooltip"),t.setAttribute("aria-hidden",!0)),document.body.appendChild(t.dom),this.ttEl=t,this.showmove&&this.ttEl.on("mousemove",this.onTooltipMouseMove,this,!0,{system:!0}),this.ttEl.on("mouseout",this.onTooltipMouseOut,this,!0,{system:!0})},onContextMouseOver:function(t){if(this.oldDom!==t.target){this.pageX=c.getPageX(t),this.pageY=c.getPageY(t);var i=t.target;if(this.ttEl||this._createElement(),this.gridPanel){var e=this.gridPanel.getView(),s=e.findCell(i,c.getPageX(t));if(s<0)return;var o=e.getColumnModel(),l=o.getColumnAt(s,!0),h=e.findRow(i,c.getPageY(t),!1),n=o.getCellConfig(h,s,"tooltipText");if(void 0!==l&&-1<h){var u=Rui.get(i);if(u.hasClass("L-grid-cell-tooltip")||Rui.get(u.dom.parentNode).hasClass("L-grid-cell-tooltip")){if(this.text=void 0===n?l.tooltipText:n,Rui.isEmpty(this.text)&&1<i.rowSpan)for(var a=1;a<i.rowSpan&&!(n=o.getCellConfig(h+a,s,"tooltipText"));a++);}else this.text=""}else this.text="";if(this.text=this.text?Rui.trim(this.text.toString()):this.text,-1==s||Rui.isEmpty(this.text))return}else{var d=this.ctxEl;d.dom.title&&(this._tempTitle=d.dom.title,d.dom.title="")}this.delayShow&&(this.delayShow.cancel(),delete this.delayShow),this.delayShow=Rui.later(this.showdelay,this,this.show,this),this.autodismissShow&&(this.autodismissShow.cancel(),delete this.autodismissShow),this.autodismissShow=Rui.later(this.autodismissdelay,this,this.hide,this),this.oldDom=i}},onContextMouseMove:function(t){null!=this.delayShow&&(this.pageX=c.getPageX(t),this.pageY=c.getPageY(t),this.showmove&&this.setTooltipXY())},onTooltipMouseMove:function(t){this.onContextMouseMove(t),this.isPointerStillShowing()||this.hide()},onContextMouseOut:function(t){this.pageX=c.getPageX(t),this.pageY=c.getPageY(t),Rui.get(t.target).hasClass("L-grid-body")||(this._tempTitle&&(this.ctxEl.dom.title=this._tempTitle,this._tempTitle=null),this.isPointerStillShowing()?(this.hide(),this.delayShow&&(this.delayShow.cancel(),delete this.delayShow)):this.hide(),this.oldDom=null)},onTooltipMouseOut:function(t){this.onContextMouseOut(t)},isPointerStillShowing:function(){var t=new Rui.util.LPoint(this.pageX,this.pageY),i=this.ctxEl.getRegion();return!(!i||!i.contains(t))},setTooltipXY:function(){var t=this.ttEl.getHeight()||0,i=this.ttEl.getWidth(),e=this.pageY,s=this.pageX,o=Rui.util.LDom.getViewport(),l=o.width+(document.documentElement&&document.documentElement.scrollLeft)||document.body.scrollLeft,h=o.height+(document.documentElement&&document.documentElement.scrollTop)||document.body.scrollTop;i<1||t<1?(e=this.ctxEl.getTop(),s=this.ctxEl.getLeft()):(h<=e+t+this.margin?e=h-t:e+=this.margin,l<=s+i+this.margin?s=l-i:s+=this.margin),this.ttEl.setTop(e),this.ttEl.setLeft(s)},show:function(){Rui.get(this.id).html(this.text),this.ttEl.removeClass("L-hide-display"),this.width=this.ttEl.getWidth(),Rui.useAccessibility()&&this.ttEl.setAttribute("aria-hidden",!1),0<this.pageX&&0<this.pageY&&this.setTooltipXY()},hide:function(){if(Rui.isUndefined(this.ttEl))return!1;this.ttEl.addClass("L-hide-display"),Rui.useAccessibility()&&this.ttEl.setAttribute("aria-hidden",!0),this.delayShow&&(this.delayShow.cancel(),delete this.delayShow),this.autodismissShow&&(this.autodismissShow.cancel(),delete this.autodismissShow)},setText:function(t){this.text=t},destroy:function(){this.ttEl&&(this.ttEl.unOnAll(),this.ttEl.remove(),this.ttEl=null),this.ctxEl.unOnAll(),Rui.ui.LTooltip.superclass.destroy.call(this)}})}();