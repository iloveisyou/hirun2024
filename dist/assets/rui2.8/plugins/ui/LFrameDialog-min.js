/*
 * @(#) LFrameDialog-min.js
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
Rui.ui.LFrameDialog=function(t){(t=t||{}).width=t.width||this.frameWidth,t.height=t.height||this.frameHeight,this.title=t.title||this.title,Rui.ui.LFrameDialog.superclass.constructor.call(this,t),this.createEvent("ready")},Rui.ui.LFrameDialog.getHostDialog=function(){return window._hostDialog},Rui.extend(Rui.ui.LFrameDialog,Rui.ui.LDialog,{title:"Dialog",hostDialogDeliveryInterval:100,borderWidth:1,frameWidth:400,frameHeight:250,initDefaultConfig:function(){Rui.ui.LFrameDialog.superclass.initDefaultConfig.call(this),this.cfg.addProperty("url",{handler:this.configUrl,value:""})},initComponent:function(t){Rui.ui.LFrameDialog.superclass.initComponent.call(this,t),this.templates=new Rui.LTemplate("<iframe frameborder='0' src='{url}'></iframe>")},initEvents:function(){Rui.ui.LFrameDialog.superclass.initEvents.call(this),this.on("changeContent",this.onChangeContent,this,!0)},onChangeContent:function(t){this.body&&this.center()},configUrl:function(t,i,e){var s=i[0];if(this.frameEl){Rui.util.LEvent.on(this.frameEl.dom,"load",function(){var i=Rui.later(this.hostDialogDeliveryInterval,this,function(){var t=this.frameEl.dom.contentWindow;t.document.body&&"complete"===t.document.readyState&&(t._hostDialog=this,i.cancel(),this.fireEvent("ready",{target:this,frameWindow:this.getFrameWindow()}))},this,!0)},this,!0),this.frameEl.dom.src=s;try{this.frameEl.dom.contentDocument&&this.frameEl.dom.contentDocument.body&&(this.frameEl.dom.contentDocument.body.style.display="none")}catch(t){}}return this},getBodyHtml:function(){var t={url:this.cfg.getProperty("url")};return this.templates.apply(t)},afterRender:function(t){Rui.ui.LFrameDialog.superclass.afterRender.call(this,t),this.setHeader(this.title),this.setBody(this.getBodyHtml()),this.frameEl=Rui.get(this.body).select("iframe").getAt(0),this.setWidth(this.width),this.setHeight(this.height),Rui.get(this.element).addClass("L-frame-dialog")},getFrameWindow:function(){return this.frameEl.dom.contentWindow},getFrameDocumentEl:function(){return new Rui.LElement(this.frameEl.dom.contentWindow.document)},setUrl:function(t){this.cfg.setProperty("url",t)},hide:function(){Rui.ui.LFrameDialog.superclass.hide.call(this);try{this.getFrameWindow().document.body.style.zoom="100%"}catch(t){}return this},setWidth:function(t){var i;return this.frameEl&&(i=Rui.get(this.body),this.frameWidth=t-i.getPadding("lr")-2*this.borderWidth,this.frameEl.setWidth(this.frameWidth)),Rui.ui.LFrameDialog.superclass.setWidth.call(this,t),this},setHeight:function(t){var i,e,s;return this.frameEl&&(i=Rui.get(this.header),e=Rui.get(this.body),s=Rui.get(this.footer),this.frameHeight=t-i.getHeight()-s.getHeight()-e.getPadding("tb")-2*this.borderWidth,this.frameEl.setHeight(this.frameHeight)),Rui.ui.LFrameDialog.superclass.setHeight.call(this,t),this},_doClose:function(t){Rui.util.LEvent.preventDefault(t),this.cancel(!1)}});