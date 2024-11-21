/*
 * @(#) LNotification-min.js
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
Rui.ui.LNotification=function(i){var t=Rui.util.LDom.getViewportWidth()-280;i=Rui.applyIf(i||{},{body:"body가 없음",width:0,fixedcenter:!1,modal:!1,visible:!0,close:!0,x:t}),Rui.ui.LNotification.superclass.constructor.call(this,i)},Rui.extend(Rui.ui.LNotification,Rui.ui.LDialog,{otype:"Rui.ui.LNotification",CSS_BASE:"L-notification",doRender:function(i){Rui.ui.LNotification.superclass.doRender.call(this,i),this.el.addClass(this.CSS_BASE)},hide:function(i){var t;!0!==i&&!Rui.isUndefined(i)||(t=Rui.util.LDom.getX(this.element),i=new Rui.fx.LAnim({el:this.element.id,attributes:{left:{from:t,to:0}},duration:2})),Rui.ui.LNotification.superclass.hide.call(this,i)}});