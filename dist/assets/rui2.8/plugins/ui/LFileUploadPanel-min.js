/*
 * @(#) LFileUploadPanel-min.js
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
Rui.ui.LFileUploadPanel=function(i){Rui.ui.LFileUploadPanel.superclass.constructor.call(this,i)},Rui.extend(Rui.ui.LFileUploadPanel,Rui.ui.LCommonPanel,{CSS_BASIC:"L-file-upload-panel",isSecure:!1,uploadUrl:"consoleLog.dev",validate:Rui.emptyFn,success:Rui.emptyFn,initView:function(i){this.el.html(this.getBodyHtml()),this.blockFileInputEl=this.el.select("#block"+this.id+"-input").getAt(0),this.formEl=this.el.select(".L-file-upload-form").getAt(0);var e=new Rui.ui.form.LFileBox({id:this.id+"fileBox",renderTo:this.id+"fileBox"});new Rui.ui.LButton(this.id+"Upload").on("click",function(i){var t;""!=e.getValue()?!1!==this.validate(e.getValue())&&(t=Rui.util.LFunction.createDelegate(function(i){this.success({conn:i,value:e.getValue()}),e.setValue(""),this.hide()},this),Rui.LConnect.setForm(this.formEl.dom,!0,this.isSecure),Rui.LConnect.asyncRequest("POST",this.uploadUrl,{upload:t})):alert("파일을 선택하세요.")},this,!0),new Rui.ui.LButton(this.id+"Close").on("click",function(i){this.hide()},this,!0),this.isViewRendered=!0},getBodyHtml:function(){this.templates=new Rui.LTemplate("<div id='{blockFileInput}'>","<form name='fileUploadFrm' method='post' action='/consoleLog.dev' class='L-file-upload-form'>","    <div id='"+this.id+"fileBox'></div>","</form>","<button id='"+this.id+"Upload'>upload</button>","<button id='"+this.id+"Close'>Close</button>","</div>");var i={blockFileInput:"block"+this.id+"-input",blcokGridId:"block"+this.id+"-grid"};return this.templates.apply(i)},render:function(i){this.el=Rui.get(i),this.el.addClass(this.CSS_BASIC),this.afterRender(this.el),this.hide()},show:function(i){this.el.show(i)},hide:function(i){this.el.hide(i)}});