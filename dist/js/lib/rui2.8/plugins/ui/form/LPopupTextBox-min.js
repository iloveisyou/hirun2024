/*
 * @(#) LPopupTextBox-min.js
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
Rui.ui.form.LPopupTextBox=function(i){i=i||{},i=Rui.applyIf(i,Rui.getConfig().getFirst("$.ext.popupTextBox.defaultProperties")),Rui.ui.form.LPopupTextBox.superclass.constructor.call(this,i),this.createEvent("popup")},Rui.extend(Rui.ui.form.LPopupTextBox,Rui.ui.form.LTextBox,{otype:"Rui.ui.form.LPopupTextBox",CSS_BASE:"L-popuptextbox",iconWidth:20,iconMarginLeft:1,editable:!1,checkContainBlur:!0,useHiddenValue:!1,enterToPopup:!1,picker:!0,doRender:function(){var i;this.createTemplate(this.el),this.useHiddenValue?((i=document.createElement("input")).type="hidden",i.name=this.name||this.id,i.id=Rui.useFixedId()?Rui.id(this.el,"LPopupTextBox-hidden-"+this.id):Rui.id(),i.instance=this,i.className="L-instance L-hidden-field",this.el.appendChild(i),this.hiddenInputEl=Rui.get(i),this.hiddenInputEl.addClass("L-hidden-field"),this.inputEl.dom.removeAttribute("name")):(this.inputEl.dom.instance=this).inputEl.addClass("L-instance"),this.doRenderPopup()},doRenderPopup:function(){var i;this.picker&&((i=document.createElement("a")).className="icon",i.id=Rui.useFixedId()?Rui.id(this.el,"LPopupTextBox-icon-"+this.id):Rui.id(),this.el.appendChild(i),this.iconEl=Rui.get(i),Rui.useAccessibility()&&this.iconEl.setAttribute("role","button"))},popupOn:function(){this.iconEl&&(this.iconEl.unOn("click",this.onIconClick,this),this.iconEl.on("click",this.onIconClick,this,!0),this.iconEl.setStyle("cursor","pointer"),this.iconEl.setAttribute("tabindex","0"))},popupOff:function(){this.iconEl&&(this.iconEl.unOn("click",this.onIconClick,this),this.iconEl.setStyle("cursor","default"),this.iconEl.removeAttribute("tabindex"))},_setWidth:function(i,t,e){t[0]<0||(Rui.ui.form.LDateBox.superclass._setWidth.call(this,i,t,e),this.iconEl&&this.getDisplayEl().setWidth(this.getContentWidth()-(this.iconEl.getWidth()||this.iconWidth)-this.iconMarginLeft))},onEnterKeyDown:function(i){if(13===i.keyCode)return this.onIconClick(i),Rui.util.LEvent.stopEvent(i),!1},onIconClick:function(i){try{this.inputEl.focus()}catch(i){}var t=this.useHiddenValue?this.hiddenInputEl.getValue():this.inputEl.getValue(),e=this.inputEl.getValue();this.fireEvent("popup",{value:t,displayValue:e})},_setEditable:function(i,t,e){Rui.ui.form.LPopupTextBox.superclass._setEditable.call(this,i,t,e),this.editable?this.enterToPopup&&this.inputEl.on("keydown",this.onEnterKeyDown,this,!0):this.inputEl.unOn("keydown",this.onEnterKeyDown,this,!0)},_setDisabled:function(i,t,e){!1===t[0]?this.popupOn():this.popupOff(),Rui.ui.form.LPopupTextBox.superclass._setDisabled.call(this,i,t,e)},setValue:function(i,t){1!=Rui.isUndefined(i)&&this.lastValue!=i&&(this.useHiddenValue&&this.hiddenInputEl.setValue(i),Rui.ui.form.LPopupTextBox.superclass.setValue.call(this,i,t))},setDisplayValue:function(i){Rui.ui.form.LPopupTextBox.superclass.setDisplayValue.call(this,i),this.lastDisplayValue=i},getValue:function(){return this.useHiddenValue?this.hiddenInputEl.getValue():this.inputEl.getValue()},destroy:function(){this.iconEl&&(this.iconEl.remove(),delete this.iconEl),Rui.ui.form.LPopupTextBox.superclass.destroy.call(this)}});