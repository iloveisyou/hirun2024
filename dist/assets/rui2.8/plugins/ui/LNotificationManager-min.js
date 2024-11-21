/*
 * @(#) LNotificationManager-min.js
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
!function(){Rui.ui.LNotificationManager=function(i){if(Rui.ui.LNotificationManager.caller!=Rui.ui.LNotificationManager.getInstance)throw new Rui.LException("Can't call the constructor method.",this);i=i||{},i=Rui.applyIf(i,Rui.getConfig().getFirst("$.ext.notificationManager.defaultProperties")),Rui.applyObject(this,i,!0),Rui.ui.LNotificationManager.superclass.constructor.call(this,i)},Rui.ui.LNotificationManager.getInstance=function(i){return null==this.instanceObj&&(this.instanceObj=new Rui.ui.LNotificationManager(i)),this.instanceObj};var a=Rui.ui.LNotificationManager;a.instanceObj=null,a.messageList=[],Rui.extend(Rui.ui.LNotificationManager,Rui.util.LEventProvider,{otype:"Rui.ui.LNotificationManager",bounce:50,width:200,duration:.5,timer:10,show:function(i){var t="L-bg-color-"+(a.messageList.length+1),e=(i&&i.height?i.height+20:70)*(a.messageList.length+1);"string"==typeof i&&(i={body:i}),i=Rui.applyIf(i,{width:200,defaultClass:t,y:e}),this.containerEl||(this.containerEl=Rui.createElements('<div class="L-notification-container"></div>').getAt(0),Rui.getBody().appendChild(this.containerEl));var n=new Rui.ui.LNotification(i);n.render(this.containerEl);var o=n.el.getXY(),s=new Rui.fx.LMotionAnim({el:n.element.id,attributes:{points:{control:[[o[0]-this.bounce]],from:[o[0]+this.width,o[1]],to:[o[0]+this.bounce,o[1]]}},duration:this.duration});n.show(s),n.on("hide",this.onHide,this,!0),this.hideTask||(this.hideTask=Rui.later(500,this,this._hide,null,!0)),a.messageList.push({time:new Date,notification:n}),n=s=null},_hide:function(){for(var i,t,e,n=Rui.util.LDate.add(new Date,"S",-this.timer),o=0;o<a.messageList.length;o++){a.messageList[o]&&a.messageList[o].time.getTime()<n.getTime()&&(t=(i=a.messageList[o].notification).el.getXY(),e=new Rui.fx.LMotionAnim({el:i.element.id,attributes:{points:{control:[[t[0]-this.bounce]],to:[t[0]+this.width+this.bounce,t[1]]}},duration:this.duration}),i.hide(e),a.messageList=this.removeNotification(o),e=i=null,o--)}a.messageList.length<1&&(this.hideTask.cancel(),delete this.hideTask)},onHide:function(i){for(var t=0;t<a.messageList.length;t++)if(a.messageList[t].notification===this){a.messageList=this.removeNotification(t);break}},removeNotification:function(i){return a.messageList[i].notification.unOn("hide",this.onHide,this),a.messageList[i].notification.destroy(),a.messageList[i].notification=null,Rui.util.LArray.removeAt(a.messageList,i)}})}(),Rui.onReady(function(){var i,t,e,n=Rui.getConfig();n.getFirst("$.base.guide.show",!1)&&(i=n.getFirst("$.base.guide.limitGuideCount",3),t=new Rui.webdb.LWebStorage(new Rui.webdb.LCookieProvider),(e=t.get("guideCount",0))<i&&setTimeout(function(){var i=Rui.getRootPath();Rui.ui.LNotificationManager.getInstance().show('<a target="_new" href="'+i+'/docs/guide/guide.html">RUI 사용법 보기</a>'),t.set("guideCount",++e)},2e3))});