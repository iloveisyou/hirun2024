/*
 * @(#) LGridStatusBar-min.js
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
Rui.ui.grid.LGridStatusBar=function(e){Rui.includeCss(Rui.getRootPath()+"/plugins/ui/grid/LGridStatusBar.css"),this.timeInfo={}},Rui.ui.grid.LGridStatusBar.prototype={init:function(e){var t;this.gridPanel&&(this.gridPanel.dataSet.unOn("beforeLoad",this.onBeforeLoad,this),this.gridPanel.dataSet.unOn("beforeLoadData",this.onBeforeLoadData,this),this.gridPanel.dataSet.unOn("load",this.onLoad,this),this.gridPanel.view.unOn("beforeRender",this.onBeforeRender,this),this.gridPanel.view.unOn("rendered",this.onRendered,this)),this.gridPanel=e,this.el||(t=Rui.createElements('<div class="L-grid-status-bar" ></div>'),this.el=t.getAt(0),Rui.util.LDom.insertAfter(this.el.dom,e.element));var i=e.getView();e.dataSet.on("beforeLoad",this.onBeforeLoad,this,!0,{system:!0}),e.dataSet.on("beforeLoadData",this.onBeforeLoadData,this,!0,{system:!0}),e.dataSet.on("load",this.onLoad,this,!0),i.on("beforeRender",this.onBeforeRender,this,!0,{system:!0}),i.on("rendered",this.onRendered,this,!0,{system:!0})},onBeforeLoad:function(e){this.timeInfo.beforeLoadTime=new Date},onBeforeLoadData:function(e){this.timeInfo.beforeLoadDataTime=new Date},onLoad:function(e){this.timeInfo.loadTime=new Date;var t=this.timeInfo.beforeLoadDataTime-this.timeInfo.beforeLoadTime,i=1e3,s="",a="L-grid-status-bar-warnning";i<t&&(this.gridPanel.toast("서버 및 네트워크 응답시간이 너무 오래 걸립니다."),s=a);var n='<span class="L-grid-status-icon '+s+'"></span><span class="L-grid-status-message">Network time : '+t+"ms</span>";n+='<span class="L-grid-status-icon '+(s=i<(t=this.timeInfo.beforeRenderTime-this.timeInfo.beforeLoadDataTime)?a:"")+'"></span><span class="L-grid-status-message">Data fetch time : '+t+"ms</span>",n+='<span class="L-grid-status-icon '+(s=i<(t=this.timeInfo.renderedTime-this.timeInfo.beforeRenderTime)?a:"")+'"></span><span class="L-grid-status-message">Grid render time : '+t+"ms</span>",n+='<span class="L-grid-status-icon '+(s=i<(t=this.timeInfo.renderedTime-this.timeInfo.beforeLoadTime)?a:"")+'"></span><span class="L-grid-status-message">Total time : '+t+"ms</span>",this.el.html(n)},onBeforeRender:function(e){this.timeInfo.beforeRenderTime=new Date},onRendered:function(e){this.timeInfo.renderedTime=new Date}};