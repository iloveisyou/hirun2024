/*
 * @(#) LFromToCalendar-min.js
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
Rui.ui.calendar.LFromToCalendar=function(e){Rui.ui.calendar.LFromToCalendar.superclass.constructor.call(this,e),this.createEvent("select")},Rui.extend(Rui.ui.calendar.LFromToCalendar,Rui.ui.LPanel,{otype:"Rui.ui.form.LFromToCalendar",CSS_BASE:"L-fromtocalendar",doRender:function(e){Rui.ui.calendar.LFromToCalendar.superclass.doRender.call(this,e),Rui.util.LDom.addClass(this.element,"L-fromtocalendar-panel"),Rui.util.LDom.setStyle(this.element,"z-index",999),this._insertBody("")},afterRender:function(e){Rui.ui.calendar.LFromToCalendar.superclass.afterRender.call(this,e);var t=document.createElement("div"),a=document.createElement("div"),i=document.createElement("div");t.id=Rui.useFixedId()?Rui.id(this.el,"LFromToCal-cal-"+this.id):Rui.id(),a.id=Rui.useFixedId()?Rui.id(this.el,"LFromToCal-from-"+this.id):Rui.id(),i.id=Rui.useFixedId()?Rui.id(this.el,"LFromToCal-to-"+this.id):Rui.id();var d=Rui.get(t),r=Rui.get(a),n=Rui.get(i);Rui.rightToLeft()?(d.appendChild(n),d.appendChild(r)):(d.appendChild(r),d.appendChild(n)),d.addClass("L-fromtocalendar-inner"),r.addClass("L-fromtocalendar-from"),n.addClass("L-fromtocalendar-to"),this.calContainerEl=d,this.fromCalendarEl=r,this.toCalendarEl=n,Rui.get(this.body).appendChild(d),this.setHeader(Rui.getMessageManager().get("$.ext.msg020"));var l=new Rui.ui.calendar.LCalendar({id:r.id,mindate:this.mindate,maxdate:this.maxdate,title:Rui.getMessageManager().get("$.ext.msg018")});l.selectEvent.on(this.onStartCalendarSelected,this,!0),l.render(),this.fromCalendar=l;var s=new Rui.ui.calendar.LCalendar({id:n.id,mindate:this.mindate,maxdate:this.maxdate,title:Rui.getMessageManager().get("$.ext.msg019")});s.selectEvent.on(this.onEndCalendarSelected,this,!0),s.render(),this.toCalendar=s,this.el.show(),this.show()},onStartCalendarSelected:function(e){this.fireEvent("select",{target:this,start:e.date})},onEndCalendarSelected:function(e){this.fireEvent("select",{target:this,end:e.date})},clear:function(){this.fromCalendar&&this.fromCalendar.clear(),this.toCalendar&&this.toCalendar.clear()},select:function(e,t,a){this.fromCalendar&&e&&(this.fromCalendar.select(e,a),this.fromCalendar.cfg.setProperty("pagedate",e),this.fromCalendar.render()),this.toCalendar&&t&&(this.toCalendar.select(t,a),this.toCalendar.cfg.setProperty("pagedate",t),this.toCalendar.render())}});