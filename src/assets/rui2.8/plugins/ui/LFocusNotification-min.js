/*
 * @(#) LFocusNotification-min.js
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
Rui.ui.LFocusNotification=function(t){var i,e=Rui.util.LDom.getDocumentWidth(),s=Rui.util.LDom.getDocumentHeight();(t=Rui.applyIf(t||{},{body:"body가 없음",width:e,x:0,height:s,fixedcenter:!1,modal:!1,zIndex:1e3,visible:!0,close:!1})).view;t.dialog||((i=Rui.util.LObject.clone(t.view)).top=t.view.bottom+20,i.bottom=i.top+100,t.dialog=i),this.createEvent("closed"),Rui.ui.LFocusNotification.superclass.constructor.call(this,t)},Rui.extend(Rui.ui.LFocusNotification,Rui.ui.LNotification,{otype:"Rui.ui.LFocusNotification",CSS_BASE:"L-focus-notification",arrowCss:"L-fn-arrow",createTemplate:function(){var t=this.templates||{};t.master||(t.master=new Rui.LTemplate('<div class="L-fn-top"></div>','<div class="L-fn-left"></div>','<div class="L-fn-right"></div>','<div class="L-fn-bottom"></div>','<div class="L-fn-mask"></div>','<div class="L-fn-viewer">','<div class="'+this.arrowCss+'"></div>','<div class="L-fn-title"></div>','<div class="L-fn-topLine"><h2></h2></div>','<div class="L-fn-view">{text}',"</div>",'<div class="L-fn-bottomLine"><h2></h2></div>','<div class="L-fn-buttons">','<button class="L-fn-buttun">OK</botton>',"</div>","</div>")),this.templates=t,t=null},doRender:function(t){Rui.ui.LFocusNotification.superclass.doRender.call(this,t),this.el.addClass(this.CSS_BASE),this.el.addClass(this.CSS_BASE+"-"+this.id),this.createTemplate();var i=Rui.get(this.element);i.addClass(this.CSS_BASE+"-wrap"),i.addClass(this.CSS_BASE+"-wrap-"+this.id);var e=(this.templates||{}).master.apply({text:this.text}),s=this.getBody();s.html(e),this.topEl=s.select(".L-fn-top").getAt(0),this.leftEl=s.select(".L-fn-left").getAt(0),this.rightEl=s.select(".L-fn-right").getAt(0),this.bottomEl=s.select(".L-fn-bottom").getAt(0),this.maskEl=s.select(".L-fn-mask").getAt(0),this.viewerEl=s.select(".L-fn-viewer").getAt(0);var l=this.view,o=l.top,h=l.left,n=l.right,d=l.bottom,a=this.dialog,c=a.top,r=a.left,u=a.right,f=a.bottom,g=d-o,v=n-h,E=Rui.util.LDom.getDocumentWidth(),L=Rui.util.LDom.getDocumentHeight();this.topEl.setHeight(o+this.topEl.getBorderWidth("lr")+this.topEl.getPadding("lr")),this.leftEl.setTop(o),this.leftEl.setHeight(g+this.leftEl.getBorderWidth("lr")+this.leftEl.getPadding("lr")),this.leftEl.setWidth(h),this.rightEl.setTop(o),this.rightEl.setHeight(g+this.rightEl.getBorderWidth("lr")+this.rightEl.getPadding("lr")),this.rightEl.setWidth(E-(h+v)),this.bottomEl.setHeight(L-(o+g)-2);var m=this.viewerEl.getBorderWidth("lr")+this.viewerEl.getPadding("lr"),p=this.viewerEl.getBorderWidth("tb")+this.viewerEl.getPadding("tb");this.viewerEl.setSize(u-r+m,f-c+p),this.viewerEl.setTop(c),this.viewerEl.setLeft(r),this.maskEl.setSize(E+m,L+p),this.buttonElOk=s.select(".L-fn-buttun").getAt(0),this.buttonElOk.on("click",this.onClickButtonOk,this,!0)},hide:function(){Rui.ui.LFocusNotification.superclass.hide.call(this,!1),this.fireEvent("closed",{type:"closed",target:this}),this.destroy()},onClickButtonOk:function(t){this.hide(!1)},onClickButtonSkip:function(t){this.hide(!1)},destroy:function(){this.buttonElOk.unOn("click",this.onClickButtonOk,this),Rui.ui.LFocusNotification.superclass.destroy.call(this)}});