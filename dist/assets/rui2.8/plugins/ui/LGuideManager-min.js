/*
 * @(#) LGuideManager-min.js
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
Rui.ui.LGuideManager=function(i){i=Rui.applyIf(i,Rui.getConfig().getFirst("$.base.guide.defaultProperties")),Rui.applyObject(this,i,!0),this.config=i,this.init()},Rui.ui.LGuideManager.prototype={showPageGuide:!0,pageName:null,pageUrl:null,webStore:null,params:null,init:function(){if(this.webStore||(this.webStore=new Rui.webdb.LWebStorage),this.showPageGuide&&!1===this.webStore.getBoolean("showGuide_"+this.pageName,!1)){var ruiPath=Rui.getRootPath();Rui.includeJs(ruiPath+"/plugins/ui/LNotification.js",!0),Rui.includeJs(ruiPath+"/plugins/ui/LNotificationManager.js",!0),Rui.includeJs(ruiPath+"/plugins/ui/LFocusNotification.js",!0),Rui.includeJs(ruiPath+"/plugins/ui/LGuide.js",!0),Rui.includeCss(ruiPath+"/plugins/ui/LFocusNotification.css",!0),this.pageUrl||(this.pageUrl="./"+this.pageName+"_guide.js"),Rui.namespace("Rui.ui.guide"),Rui.includeJs(this.pageUrl,!0);var guideClassName="Rui.ui.guide."+Rui.util.LString.firstUpperCase(this.pageName),cls=null;try{var obj=eval(guideClassName);this.guide=new obj(this.config),this.guide.webStore=this.webStore}catch(i){alert("Guide class name is wrong : "+guideClassName)}this.guide.onReady()}},clear:function(){for(var i=this.webStore.get("gm_"+this.pageName+"_guide_keys","").split("|"),e=0,t=i.length;e<t;e++)this.webStore.remove("gm_"+this.pageName+"_"+i[e])},invokeGuideFn:function(i){var e;this.guide&&((e=this.guide[i])?e.call(this.guide):alert(i+" Guide method name is wrong"))},addParams:function(i){this.params=Rui.applyIf(this.params,i),this.guide.params=this.params}};