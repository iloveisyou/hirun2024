/*
 * @(#) LBasicDialog-min.js
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
Rui.ui.LBasicDialog=function(i){var t=i||{};this.handleApplyDelegate=Rui.util.LFunction.createDelegate(this.onHandleApply,this),this.handleCancelDelegate=Rui.util.LFunction.createDelegate(this.onHandleCancel,this),Rui.ui.LBasicDialog.superclass.constructor.call(this,t)},Rui.extend(Rui.ui.LBasicDialog,Rui.ui.LCommonPanel,{title:"공통 팝업",CSS_BASIC:"L-basic-dialog",dialogWidth:400,onHandleApply:function(){this.dialog.submit(!0)},onHandleCancel:function(){this.dialog.cancel(!0)},initComponent:function(i){this.id=this.id||Rui.id()},initView:function(i){this.dialog=new Rui.ui.LDialog({id:Rui.id(),width:this.dialogWidth,visible:!1,modal:!0,fixedcenter:!0,postmethod:"none",buttons:[{text:"Apply",handler:this.handleApplyDelegate,isDefault:!0},{text:"Close",handler:this.handleCancelDelegate}]}),this.dialog.render(document.body),this.dialog.setHeader(this.title),this.dialog.setBody(this.getBodyHtml()),this.isViewRendered=!0},getBodyHtml:function(){this.templates=new Rui.LTemplate('<div id="{gridId}"></div>');var i={gridId:this.id+"-grid"};return this.templates.apply(i)},render:function(i){this.el=Rui.get(i),this.el.addClass(this.CSS_BASIC),this.afterRender(this.el)},showDialog:function(){this.isViewRendered||this.initView(),this.dialog.show(!0)},afterRender:function(i){this.el.html("<input type='text' id='"+this.id+"Code' style='width:"+this.width+"' readOnly> <div class='"+this.CSS_BASIC+"-icon'></div>"),this.inputCodeEl=this.el.select("#"+this.id+"Code").getAt(0),this.inputCodeEl=Rui.get(this.inputCodeEl.id),this.iconEl=this.el.select("."+this.CSS_BASIC+"-icon").getAt(0),this.iconEl.on("click",function(){this.showDialog()},this,!0)}});