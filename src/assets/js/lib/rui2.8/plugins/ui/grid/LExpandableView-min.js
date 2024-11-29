/*
 * @(#) LExpandableView-min.js
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
!function(){var g=Rui.util.LDom;Rui.ui.grid.LExpandableView=function(e){Rui.ui.grid.LExpandableView.superclass.constructor.call(this,e),this.createEvent("expand"),this.createEvent("collapse")},Rui.extend(Rui.ui.grid.LExpandableView,Rui.ui.grid.LGridView,{isAfterRenderRow:!0,rowRenderer:function(e,t){return""},getRowDom:function(e,t){return e<0?null:this.getRows(t)[2*e]},doAddData:function(e){this.hideEmptyDataMessage();var t=e.row,i=e.record,o=e.target,r=this.columnModel,n=this.getRenderRow(t,i,o),a=this.getLastLiEl().dom.firstChild,l=Rui.createElements(n).getAt(0).dom;1<o.getCount()?0===t?(d=this.getRowDom(t))&&(u=a.insertRow(t),g.replaceChild(l,u),u=null):(u=a.insertRow(2*t),g.replaceChild(l,u),u=null):(u=a.insertRow(),g.replaceChild(l,u),u=null),this.updateRenderRows(t),-1<r.freezeIndex&&(d=this.getRowDom(t,0),d=Rui.util.LDom.getNextSibling(d),n=this.getAfterRenderRow(e.row,e.record,o.getCount(),!0,null),s=Rui.createElements(n),g.insertAfter(s.getAt(0).dom,d));var d=this.getRowDom(t),n=this.getAfterRenderRow(e.row,e.record,o.getCount(),!1,null),s=Rui.createElements(n),u=a.insertRow(2*t+1);g.replaceChild(s.getAt(0).dom,u),u=null;var R=o.getRow();-1<R&&this.gridPanel.getSelectionModel().selectRow(R),this.focusRow(t,0)},doRemoveData:function(e){var t;!0!==e.remainRemoved&&(-1<this.columnModel.freezeIndex&&(t=this.getRowDom(e.row,0),(t=Rui.util.LDom.getNextSibling(t)).colspan=1,g.removeNode(t)),t=this.getRowDom(e.row,1),(t=Rui.util.LDom.getNextSibling(t)).colspan=1,g.removeNode(t)),Rui.ui.grid.LExpandableView.superclass.doRemoveData.call(this,e)},doUndoData:function(e){var t,i=null;e.beforeState==Rui.data.LRecord.STATE_INSERT&&(-1<this.columnModel.freezeIndex&&(t=this.getRowDom(e.row,0),t=Rui.util.LDom.getNextSibling(rowDom)),i=this.getRowDom(e.row,1),i=Rui.util.LDom.getNextSibling(i)),Rui.ui.grid.LExpandableView.superclass.doUndoData.call(this,e);var o=e.beforeState;e.row;o==Rui.data.LRecord.STATE_INSERT&&(t&&(t.colspan=1,g.removeNode(t)),i&&(i.colspan=1,g.removeNode(i)))},getAfterRenderRow:function(e,t,i,o,r,n){var a=this.columnModel.getColumnCount(!0);if(this.rowRenderer){var l=this.rowRenderer(e,t),d=this.columnModel.getTotalWidth(!0);return'<tr class="L-grid-row-expandable L-grid-row-expandable-'+t.id+'" style="width:'+d+'px"><td colspan="'+a+'" style="width:'+d+'px" class="L-grid-col-expandable">'+l+"</td></tr>"}return""},hasExpand:function(e){var t=this.getRowDom(e),t=Rui.util.LDom.getNextSibling(t);return Rui.get(t).hasClass("L-expand")},setExpand:function(e,t){var i=this.getRowDom(e),i=Rui.util.LDom.getNextSibling(i),o=Rui.get(i);t?o.addClass("L-expand"):o.removeClass("L-expand");var r=!o.hasClass("L-expanded");o.addClass("L-expanded");var n={target:this,expandableTarget:o.dom.firstChild,row:e,isFirst:r};t?this.fireEvent("expand",n):this.fireEvent("collapse",n)},getRowHeight:function(){var e=this.getRows();return e.length<1?30:this._getRowHeight(e[0])}})}();