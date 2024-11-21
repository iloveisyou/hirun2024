/*
 * @(#) LTreeGridSelectionModel-min.js
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
!function(){var c=Rui.util.LEvent;Rui.ui.grid.LTreeGridSelectionModel=function(e){Rui.ui.grid.LTreeGridSelectionModel.superclass.constructor.call(this,e)},Rui.extend(Rui.ui.grid.LTreeGridSelectionModel,Rui.ui.grid.LSelectionModel,{otype:"Rui.ui.grid.LTreeGridSelectionModel",getDataCount:function(){return this.view.showData.length},getMoveRow:function(e,t){for(var i=this.view.getDataSet(),o=this.view.getDataCount(),n=i.getCount(),a=e,r=0,l=0,u=0<t?1:-1;0<=a&&a<n&&(a==e||!i.getAt(a).getAttribute("_show")||(r+=u)!=t);)l++,a+=u;return e+l*u<0?0<o?0:-1:e+l*u},onPageDown:function(e){var t=this.gridPanel.getView(),i=t.getDataSet(),o=t.getVisibleRowCount?t.getVisibleRowCount(!0):this.pageUpDownRow,n=this.getMoveRow(i.getRow(),o);n=(n=t.getDataSetRow(n))>t.getDataCount()-1?t.getDataSetRow(t.getDataCount()-1):n,t.getDataSet().setRow(n),i=t=null},onKeydown:function(e){var t=this.view,i=t.gridPanel,o=t.getDataSet(),n=o.getRow(),a=o.getCount(),r=this.getColId(),l=Rui.util.LKey.NAVKEY,u=!0,s=o.getAt(n);switch(e.keyCode){case l.LEFT:-1<n&&r&&!0!==this.gridPanel.isEdit&&r==t.treeColumnId&&(g=n,"normal"!=s.getAttribute("_expand")&&"close"!=s.getAttribute("_expand")||(g=t.getParentRow(n)),-1<g&&(o.setRow(g),t.collapse(g),u=!1));break;case l.RIGHT:if(-1<n&&r&&!0!==this.gridPanel.isEdit&&r==t.treeColumnId){var g=n;if("normal"==s.getAttribute("_expand"))break;-1<(g="close"==s.getAttribute("_expand")?n:-1)&&(o.setRow(g),t.expand(g),u=!1)}break;case l.DOWN:var d=this.getMoveRow(n,1);d<a&&(!0!==e.ctrlKey&&!0!==e.shiftKey&&this.clearSelection(),i.doSelectCell(d,this.currentCol,!e.shiftKey&&void 0),i.systemSelect=!0),i.focusRow(),u=!1,c.stopEvent(e)}u&&Rui.ui.grid.LTreeGridSelectionModel.superclass.onKeydown.call(this,e),o=t=null}})}();