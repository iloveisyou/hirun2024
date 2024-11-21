/*
 * @(#) LBasicCombo-min.js
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
Rui.ui.form.LBasicCombo=function(t){t=t||{},Rui.ui.form.LBasicCombo.superclass.constructor.call(this,t)},Rui.extend(Rui.ui.form.LBasicCombo,Rui.ui.form.LCombo,{otype:"Rui.ui.form.LBasicCombo",forceSelection:!1,createComboTemplete:function(t){var e,i=t,s=null;return"DIV"==i.dom.tagName&&(s=i.parent(),e=document.createElement("select"),s.appendChild(e),i.removeNode(),i=Rui.get(e)),i.addClass(this.CSS_BASE),i.addClass("L-fixed"),this.el=i,this.inputEl=i,this.hiddenInputEl=i},initFocus:function(){},createOptionDiv:function(){var e,t;!0===this.useDataSet&&(e=this.getDisplayEl(),(t=document.createElement("div")).id=Rui.id(),this.optionDivEl=Rui.get(t),this.optionDivEl.setWidth(this.listWidth),this.optionDivEl.addClass(this.CSS_BASE+"-list-wrapper-nobg"),this.optionDivEl.addClass("L-hide-display"),this.optionDivEl.on("click",function(t){this.collapseIf(t),e.focus()},this,!0),this.listRenderer&&this.optionDivEl.addClass("L-custom-list"),document.body.appendChild(t))},afterRender:function(t){Rui.ui.form.LBasicCombo.superclass.afterRender.call(this,t),this.inputEl.on("change",function(t){var e=this.inputEl.dom.selectedIndex,e=!0===this.useEmptyText?e-1:e;this.dataSet.setRow(e)},this,!0),this.dataSet.setRow(!0===this.forceSelection?0:-1),this.applyEmptyText()},doDataChangedDataSet:function(){if(this.removeAllItem(),!0===this.useEmptyText&&this.createEmptyText(),this.optionDivEl){for(var t,e=Rui.data.LRecord.STATE_DELETE,i=this.dataSet,s=0;s<this.dataSet.getCount();s++){e!=i.getState(s)&&(t=this.createItem({record:this.dataSet.getAt(s)}),this.appendOption(t.dom))}this._itemRendered=!0}this.autoComplete&&this.optionAutoHeight()},_setWidth:function(t,e,i){var s=e[0];Rui.isBorderBox?this.el.setWidth(s-4):this.el.setWidth(s),this.width=s,this.cfg.setProperty("width",this.width,!0)},appendOption:function(t){this.getDisplayEl().appendChild(t)},removeAllItem:function(){this.getDisplayEl().html("")},createItem:function(t){var e=t.record,i=e.get(this.valueField),s=e.get(this.displayField),o=document.createElement("option"),n=Rui.get(o);o.value=i;var a=document.createTextNode(s);return n.appendChild(a),n},insertEmptyText:function(t){0<this.optionDivEl.dom.childNodes.length?Rui.util.LDom.insertBefore(t,this.inputEl.dom.childNodes[0]):this.inputEl.appendChild(t)},getValue:function(){return-1<this.inputEl.dom.selectedIndex?this.inputEl.dom[this.inputEl.dom.selectedIndex].value:null},getDisplayValue:function(){return-1<this.inputEl.dom.selectedIndex?this.inputEl.dom[this.inputEl.dom.selectedIndex].text:""},onRowPosChangedDataSet:function(t){if(!(0<this.inputEl.dom.length)){var e,i=this.dataSet.getCount();if(0==this.inputEl.dom.length&&0<i&&!this._itemRendered){!0===this.useEmptyText&&this.createEmptyText();for(var s=0;s<this.dataSet.getCount();s++){var o=this.createItem({record:this.dataSet.getAt(s)});this.appendOption(o.dom)}this._itemRendered=!0}0!=this.inputEl.dom.length&&(e=!0===this.useEmptyText?t.row+1:t.row,this.setValue(e<0?"":this.inputEl.dom[e].value),this.fireEvent("changed",{target:this,value:this.getValue(),displayValue:this.getDisplayValue()}))}},setValue:function(t){var e=this.dataSet.findRow(this.valueField,t);this.dataSet.setRow(e),e=!0===this.useEmptyText?e+1:e,this.inputEl.dom[e]&&(this.inputEl.dom[e].selected=!0)},getRowEl:function(t){return t=!0===this.useEmptyText?t+1:t,Rui.get(this.inputEl.dom[t])},getOptionDiv:function(){return this.inputEl},getDataIndex:function(t){for(var e=this.inputEl.dom.options,i=-1,s=0,o=e.length;s<o;s++)if(e[s].text==t){i=s;break}return-1<i&&!0===this.useEmptyText&&i--,i}});