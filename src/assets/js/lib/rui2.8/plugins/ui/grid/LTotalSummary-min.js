/*
 * @(#) LTotalSummary-min.js
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
Rui.ui.grid.LTotalSummary=function(e){Rui.ui.grid.LTotalSummary.superclass.constructor.call(this,e),this.createEvent("renderTotal"),this.createEvent("renderTotalCell")},Rui.extend(Rui.ui.grid.LTotalSummary,Rui.util.LPlugin,{gridView:null,useExcel:!1,renderSummaryTime:50,initPlugin:function(e){this.gridView=e,Rui.ui.grid.LTotalSummary.superclass.initPlugin.call(this,e);var t=e.templates||{};t.totalSummaryRow=new Rui.LTemplate('<div class="L-grid-row-summary-total" >','<div class="L-grid-summary-scroller" style="{sstyle}">','<ul class="L-grid-ul">','<li class="L-grid-li-first">','<table border="0" cellspacing="0" cellpadding="0" style="{style1}">',"<tbody>","<tr>{cells1}</tr>","</tbody>","</table>","</li>",'<li class="L-grid-li-last" style="{style}">','<table border="0" cellspacing="0" cellpadding="0" style="{style2}">',"<tbody>","<tr>{cells2}</tr>","</tbody>","</table>","</li>","</ul>","</div>","</div>"),!Rui.isUndefined(this.useExcel)&&this.useExcel&&(t.totalSummaryRow=new Rui.LTemplate('<div class="L-grid-row-summary-total" >','<div class="L-grid-summary-scroller" style="{sstyle}">','<table border="1" cellspacing="0" cellpadding="0" >',"<tbody>","<tr>{cells1}{cells2}</tr>","</tbody>","</table>","</div>","</div>")),e.templates=t,this.gridView.unOn("syncDataSet",this._setSymmarySyncDataSet,this),this.gridView.on("syncDataSet",this._setSymmarySyncDataSet,this,!0),t=e=null},updatePlugin:function(e){e.isRendered&&this.gridView&&!1===this.gridView.isVirtualScroll&&this.gridView.bodyEl.setStyle("margin-bottom","27px"),this.delaySct&&(this.delaySct.cancel(),delete this.delaySct),this._updateRenderTotalOptions||(this._updateRenderTotalOptions={}),Rui.applyIf(this._updateRenderTotalOptions,e||{}),this.delaySct=Rui.later(50,this,this.updateRenderTotal,e)},_setSymmarySyncDataSet:function(e){!0===e.isSync&&(e.isRendered=!0,this.updateRenderTotal(e))},initPluginContainer:function(){!1===this.gridView.isVirtualScroll?Rui.util.LEvent.addListener(this.gridView.scrollerEl.dom,"scroll",this.onSyncSummaryScrollLeft,this,!0):this.gridView.scroller&&(this.gridView.scroller.unOn("scrollX",this.onSyncSummaryScrollLeft,this),this.gridView.scroller.on("scrollX",this.onSyncSummaryScrollLeft,this,!0));var e=Rui.get(document.createElement("div"));(e=Rui.get(document.createElement("div"))).html("Total"),e.addClass("L-grid-total-summary");var t=this.gridView.scrollerEl;Rui.util.LDom.insertAfter(e.dom,t.dom),e.html(this.getRenderTotal()),this.summaryScrollerEl=this.gridView.el.select(".L-grid-summary-scroller").getAt(0),this.summaryTotalEl&&this.summaryTotalEl.remove(),this.summaryTotalEl=e,e=t=null,this.resizeScroller()},resizeScroller:function(){var e=this.gridView,t=e.scroller,l=this.summaryTotalEl;t&&l&&(l.setStyle("margin-bottom",(t.existScrollbar(!0)?t.getScrollbarSize(!0):0)+"px"),Rui.rightToLeft()?l.setStyle("margin-left",(t.existScrollbar()?t.getScrollbarSize():0)+"px"):l.setStyle("margin-right",(t.existScrollbar()?t.getScrollbarSize():0)+"px"),e.pluginSpaceHeight=0==l.getHeight()?e.getRowHeight():l.getHeight(),t.setSpace(e.pluginSpaceHeight,!1,"bottom"),e.resetScroller());var i=e.scroller?e.scroller.getScrollWidth():e.getScrollerEl().getWidth();i<1&&(i=Rui.util.LString.simpleReplace(e.headerOffsetEl.getStyle("width"),"px","").trim()),this.summaryTotalEl.select(".L-grid-row-summary-total").setWidth(i-(!1===this.gridView.isVirtualScroll?Rui.ui.LScroller.SCROLLBAR_SIZE:0)),e=t=l=null},getRenderTotal:function(){var e=this.gridView,t=e.columnModel,l=e.templates||{},i=t.getColumnCount(!0),r="",s="";this.fireEvent("renderTotal",{target:this});var a=t.freezeIndex;if(this._renderLabel=!1,-1<a){for(var d=0;d<=a;d++)r+=this.getRenderTotalCell(d,i);for(d=a+1;d<i;d++)s+=this.getRenderTotalCell(d,i)}else for(d=0;d<i;d++)s+=this.getRenderTotalCell(d,i);var n="",o="width:"+(t.getLastColumnsWidth(!0)-(t.getLastColumnCount(!0)-2))+"px",u=t.getFirstColumnsWidth(!0);-1<a&&(n="width:"+u+"px",o+=";margin-left:"+u+"px");var c={sstyle:"",style:"width: "+t.getTotalWidth(!0)+"px",cells1:r,cells2:s,style1:n,style2:o};try{return l.totalSummaryRow.apply(c)}finally{e=t=l=c=null}},getRenderTotalCell:function(e){var t=this.gridView.templates||{},l=this.gridView.columnModel,i=l.getColumnAt(e,!0);if(this.useExcel&&(i instanceof Rui.ui.grid.LSelectionColumn||i instanceof Rui.ui.grid.LStateColumn||i instanceof Rui.ui.grid.LNumberColumn))return"";var r="width:"+this.gridView.adjustColumnWidth(i.width)+"px;";""!=i.align&&(r+="text-align:"+i.align+";");var s=i.isHidden()?"L-hide-display":"";i.cellStyle&&(r+=i.cellStyle+";");var a={id:i.getId(),first_last:"",css:[],style:r,hidden:s};0===e&&a.css.push("L-grid-total-summary-col-first"),e===l.getColumnCount(!0)-1&&a.css.push("L-grid-total-summary-col-last");var d={target:this,col:e,colId:i.getId(),labelRendered:!1,p:a,value:""};this.fireEvent("renderTotalCell",d),a.value=d.value,!0===d.labelRendered&&(this._renderLabel=!0),!0!==this._renderLabel&&a.css.push("L-grid-total-summary-dummy"),null==a.value&&(a.value="");try{return a.css=a.css.join(" "),t.cell.apply(a)}finally{t=i=a=d=l=null}},onSyncSummaryScrollLeft:function(e){var t=0,t=!1===this.gridView.isVirtualScroll?e.target.scrollLeft:this.gridView.scroller.getScrollLeft();if(this.summaryScrollerEl)try{this.summaryScrollerEl.dom.scrollLeft=t}catch(e){}},updateRenderTotal:function(e){var t=function(){this.gridView&&this.gridView.el&&(new Date-this.modifiedDate<this.renderSummaryTime?Rui.log("ignore"):(clearInterval(this.delaySRRId),this.delaySRRTask=null,void 0!==(e=this._updateRenderTotalOptions)&&(e.isRendered?this.initPluginContainer():(e.isDataChanged||e.resetScroll)&&this.updateRenderDataTotal()),this._updateRenderTotalOptions={}))};0<this.renderSummaryTime&&(this.delaySRRTask||(this.delaySRRTask=Rui.util.LFunction.createDelegate(t,this),this.delaySRRId=setInterval(this.delaySRRTask,this.renderSummaryTime))),this.renderSummaryTime<1&&t.call(this),t=null},updateRenderDataTotal:function(){this.summaryTotalEl&&this.summaryTotalEl.html(this.getRenderTotal()),this.summaryScrollerEl=this.gridView.el.select(".L-grid-summary-scroller").getAt(0),this.updateWidthSummaryBar(),this.onSyncSummaryScrollLeft()},updateWidthSummaryBar:function(){this.summaryTotalEl&&this.resizeScroller()},renderer:function(a){return function(e){var t=this.gridView.dataSet;a.label&&(this.gridView.columnModel.getColumnAt(0,!0).id==e.colId&&(this._renderLabel=!1),e.colId===a.label.id&&(e.value=a.label.text,e.p.css.push("L-grid-total-summary-title"),this._renderLabel=!0),e.p.css.push(!1===this._renderLabel?"L-grid-total-summary-dummy":""));var l=a.columns[e.colId];if(l){if("string"==typeof l&&(l={type:"sum"}),"sum"===l.type)e.value=t.sum(e.colId);else if("avg"===l.type){for(var i=0,r=0;r<t.getCount();r++){var s=t.getAt(r);i+=parseFloat(s.get(e.colId),10)||0,s=null}i=0<i?i/t.getCount():0,e.value=i/100}l.renderer&&("string"==typeof l.renderer&&(l.renderer=Rui.ui.grid.LColumnModel.rendererMapper[l.renderer]),e.value=l.renderer(e.value))}}},destroy:function(){this.gridView.unOn("syncDataSet",this._setSymmarySyncDataSet,this),this.gridView.scroller&&this.gridView.scroller.unOn("scrollX",this.onSyncSummaryScrollLeft,this),Rui.ui.grid.LTotalSummary.superclass.destroy.call(this)}});