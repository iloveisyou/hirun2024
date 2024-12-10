/*
 * @(#) LInlineEditor-min.js
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
Rui.ui.LInlineEditor=function(t){var i=t||{};Rui.applyObject(this,i),this.createEvent("isEdit"),this.createEvent("startEdit"),this.createEvent("stopEdit"),Rui.ui.LInlineEditor.superclass.constructor.call(this,i)},Rui.extend(Rui.ui.LInlineEditor,Rui.ui.LUIComponent,{otype:"Rui.ui.LInlineEditor",field:null,isDisable:!1,enterStopEdit:!0,doRender:function(t){var i=this.el.parent(),e=document.createElement("div");e.className="L-inline-editor",this.editorContainerEl=Rui.get(e),i.appendChild(e),this.field.borderWidth=0,this.field.render(e),this.editorContainerEl.setVisibilityMode(!1),this.editorContainerEl.hide()},afterRender:function(t){this.field.on("blur",this.onBlur,this,!0),this.field.on("keydown",this.onKeyDown,this,!0),this.el.on("click",this.onClick,this,!0)},onKeyDown:function(t){switch(t.keyCode){case Rui.util.LKey.KEY.ENTER:1==this.enterStopEdit&&(this.stopEditor(),this.applyValue());break;case Rui.util.LKey.KEY.ESCAPE:this.stopEditor(),this.cancelValue()}},applyValue:function(){this.targetEl.html(this.field.getValue()),this.oldValue=null},cancelValue:function(){this.oldValue&&(this.el.html(this.oldValue),this.field.setValue(this.oldValue),this.oldValue=null)},onBlur:function(t){this.stopEditor(),this.applyValue()},onClick:function(t){!1!==this.fireEvent("isEdit",{target:t.target,event:t})&&this.startEditor(t.target)},startEditor:function(t){1!=this.isDisable&&(this.targetEl=Rui.get(t),this.oldValue=this.targetEl.getHtml(),this.field.setValue(this.oldValue),this.editorContainerEl.show(),this.editorContainerEl.setRegion(this.targetEl.getRegion()),this.field.setWidth(this.editorContainerEl.getWidth()),this.field.setHeight(this.editorContainerEl.getHeight()),this.field.focus(),this.fireEvent("startEdit",{target:this,field:this.field}))},stopEditor:function(){this.editorContainerEl.hide(),this.fireEvent("stopEdit",{target:this,field:this.field})},enable:function(){this.isDisable=!0},disable:function(){this.isDisable=!1}});