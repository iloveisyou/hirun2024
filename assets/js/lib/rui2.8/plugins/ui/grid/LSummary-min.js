/*
 * @(#) LSummary-min.js
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
Rui.ui.grid.LSummary=function(e){Rui.ui.grid.LSummary.superclass.constructor.call(this,e)},Rui.extend(Rui.ui.grid.LSummary,Rui.util.LPlugin,{subSumList:null,subSumExpr:null,dateComparePattern:"%x",initPlugin:function(e){this.gridView=e,this.subSumList=this.subSumExpr.split(","),Rui.ui.grid.LSummary.superclass.initPlugin.call(this,e);var t=e.templates||{};t.summaryRow=new Rui.LTemplate('<div class="L-grid-row-summary L-grid-row-summary-{summaryId}">','<table border="0" cellspacing="0" cellpadding="0" >',"<tbody>","<tr>{cells}</tr>","</tbody>","</table>","</div>"),t.summaryTotalRow=new Rui.LTemplate('<div class="L-grid-row-summary-total">','<table border="0" cellspacing="0" cellpadding="0" >',"<tbody>","<tr>{cells}</tr>","</tbody>","</table>","</div>"),e.templates=t,e.getRows=this.getRows},isSubSum:function(e,t,r,l){for(var u=e.length-1;0<=u;u--){var i=e[u];if(!l||l!=i){var a=t.get(i),n=r?r.get(i):null;if(!(a instanceof Date?Rui.util.LDate.compareString(a,n,this.dateComparePattern):a==n))return!0}}return!1},getBeforeSubSumColId:function(e,t,r,l){if(l==e[0])return null;for(var u=e.length-1;0<=u;u--){var i=e[u];if(!l||l!=i){var a=t.get(i),n=r?r.get(i):null;if(!(a instanceof Date?Rui.util.LDate.compareString(a,n,this.dateComparePattern):a==n))return i}}return null},getSubSumIndex:function(e,t){for(var r=0;r<e.length;r++)if(e[r]==t)return r;return-1},getRows:function(){return this.hasRows()?this.bodyEl.query(".L-grid-row"):[]},getRenderBody:function(){var e=this.plugins[0],t=this.templates||{},r=this.dataSet.getCount(),l="",u=this.columnModel,i=u.getColumnCount(),a=[],n=e.subSumList,s=null;"total"==n[0]&&(n=Rui.util.LArray.removeAt(n,0));for(var o={},d=0;d<r;d++){var m=this.dataSet.getAt(d);l+=this.getRenderRow(d,m,r);for(var g=this.dataSet.getAt(d+1),c=0;c<i;c++){if((R=u.getColumnAt(c)).sumType)for(var p=R.getId(),y=0;y<n.length;y++){S=null==(S=a[y])?{}:S;var f=e.getSumTypeValue(S,m,R,d,c);S[p]=f,a[y]=S,o[p]=f}}for(e.isSubSum(n,m,g,s)&&(s=n[n.length-1]);null!=s;){for(var S=a[e.getSubSumIndex(n,s)],h="",c=0;c<i;c++)h+=e.getSummaryRenderCell(d,c,i,m,S);var v={summaryId:s,cells:h};l+=t.summaryRow.apply(v);for(var R,c=0;c<i;c++){(R=u.getColumnAt(c)).sumType&&(S[p=R.getId()]=0)}s=e.getBeforeSubSumColId(n,m,g,s)}}return t.body.apply({rows:l})},getSummaryRenderCell:function(e,t,r,l,u){var i=this.gridView,a=i.templates||{},n=i.columnModel.getColumnAt(t),s=0==t?"L-grid-cell-first":t==r-1?"L-grid-cell-last":"",o="width:"+i.getColumnWidth(n)+"px;";""!=n.align&&(o+="text-align:"+n.align+";");var d=n.isHidden()?"L-hide-display":"",m=[];l.isModifiedField(n.field)&&m.push("L-grid-cell-update"),!0!==i.skipRowCellEvent&&i.fireEvent("cellRendered",{css:m,row:e,col:t,record:l}),n.cellStyle&&(o+=n.cellStyle+";");var g={id:n.getId(),first_last:s,css:m,style:o,hidden:d};return g.value=this.getSummaryRenderCellValue(g,l,n,e,t,u[n.getId()]),g.css=g.css.join(" "),a.cell.apply(g)},getSummaryCalculatorCellValue:function(e,t,r,l){var u=e.get(t.field);return t.expression&&(u=t.expression(u,e,r,l)),t.sumType||(u=""),u},getSummaryRenderCellValue:function(e,t,r,l,u,i){return i=i||t.get(r.field),r.renderer&&(i=r.renderer(i,e,t,l,u)),r.sumType||(i=""),i},getSumTypeValue:function(e,t,r,l,u){var i=r.getId();return(Rui.isFunction(r.sumType)?r.sumType.call(this,e,t,r,l,u):e[i]?e[i]:0)+this.getSummaryCalculatorCellValue(t,r,l,u)},updateSummary:function(){}});