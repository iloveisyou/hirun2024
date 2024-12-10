/*
 * @(#) LMonthBox-min.js
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
Rui.ui.form.LMonthBox=function(t){t=Rui.applyIf(t||{},Rui.getConfig().getFirst("$.ext.monthBox.defaultProperties")),Rui.ui.form.LMonthBox.superclass.constructor.call(this,t)},Rui.extend(Rui.ui.form.LMonthBox,Rui.ui.form.LDateBox,{otype:"Rui.ui.form.LMonthBox",CSS_BASE:"L-monthbox",dateType:"date",width:80,valueFormat:"%Y-%m",initComponent:function(t){Rui.platform.isMobile&&(this.type="month"),Rui.ui.form.LMonthBox.superclass.initComponent.call(this,t),this.calendarClass=Rui.ui.calendar.LMonthCalendar},deferOnBlur:function(t){var e,a;!this.calendarDivEl.isAncestor(t.target)||"a"==(e=Rui.get(t.target)).dom.tagName.toLowerCase()&&e.hasClass("selector")&&(a=this.calendar.getProperty("pagedate"),a=new Date(a.getFullYear(),parseInt(e.getHtml(),10)-1,1),this.setValue(a),this.calendar.hide()),Rui.util.LFunction.defer(this.checkBlur,10,this,[t])},initLocaleMask:function(){if(!Rui.platform.isMobile){for(var t=this.getLocaleFormat().split("%"),e="",a=1;a<t.length;a++){switch(t[a].toLowerCase().charAt(0)){case"y":e+="9999";break;case"m":case"d":e+="99"}1<t[a].length&&(e+=t[a].charAt(1))}this.mask=e}this.displayValue=this.getLocaleFormat()},getLocaleFormat:function(){var t=Rui.getConfig().getFirst("$.core.defaultLocale"),e="%x";if(this.displayValue&&this.displayValue.length<4){for(var a=this.displayValue.substring(1),i=(e=Rui.util.LDateLocale[t][a]).split("%"),s="",l=1;l<i.length;l++)switch(i[l].toLowerCase().charAt(0)){case"y":case"m":s+="%"+i[l]}var o=s.charAt(s.length-1);"d"!=o.toLowerCase()&&"y"!=o.toLowerCase()&&(s=s.substring(0,s.length-1)),e=s}else e=this.displayValue;return e},setValue:function(t,e){var a,i,s,l=t;"string"==typeof t&&(t=6==t.length?t:this.getUnmaskValue(t),t=Rui.isEmpty(t)?null:this.localeMask?this.getDate(l):this.getDate(t)),!1===t?this.getDisplayEl().dom.value=this.lastDisplayValue:(a=t?this.getDateString(t,this.valueFormat):"",s=t?this.getDateString(t):"",s=this.localeMask?(i=this.getLocaleFormat(),this.getDateString(t,i)):(this.getDisplayEl().dom.value=s,this.checkValue().displayValue),this.getDisplayEl().dom.value=s,this.hiddenInputEl.dom.value!==a&&(this.hiddenInputEl.setValue(a),this.lastDisplayValue=s,!0!==e&&this.fireEvent("changed",{target:this,value:this.getValue(),displayValue:this.getDisplayValue()})))},getValue:function(){var t=this.hiddenInputEl.getValue(),e=this.getDate(t);return"date"==this.dateType?e||null:this.getDateString(e,this.valueFormat)}});