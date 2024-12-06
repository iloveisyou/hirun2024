/*
 * @(#) LSwitch-min.js
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
Rui.ui.LSwitch=function(t){t=t||{},Rui.ui.LSwitch.superclass.constructor.call(this,t),this.createEvent("changed")},Rui.extend(Rui.ui.LSwitch,Rui.ui.LUIComponent,{otype:"Rui.ui.LSwitch",toggle:!0,count:1,items:null,createContainer:function(t){return Rui.ui.LSwitch.superclass.createContainer.call(this,t),this.el.addClass("L-switch"),this.el},doRender:function(){var t,s=this.el,i=document.createElement("ul");this.buttons=[],this.buttonIndexes={},this.items&&(this.count=this.items.length,this.hasItems=!0);for(var e=0;e<this.count;e++){var n,h=document.createElement("li");(h=Rui.get(i.appendChild(h))).addClass("L-switch-button"),h.addClass("L-switch-button-"+e),0==e?h.addClass("L-switch-first-button"):e==this.count-1&&h.addClass("L-switch-last-button"),h.setStyle("cursor","pointer"),this.buttons[e]=h,this.buttonIndexes[h.dom.id]=e,this.hasItems&&(t=this.items[e],n=document.createElement("div"),(n=Rui.get(n)).addClass("L-switch-label"),t.label&&n.html(t.label),h.appendChild(n)),h.on("click",this.onClick,this,!0)}1<this.count?Rui.get(i).addClass("L-switch-multiple"):Rui.get(i).addClass("L-switch-single"),s.appendChild(i)},pushOn:function(t){var s=this.buttons[t];!0!==s.hasClass("L-switch-on")&&(!0!==this.toggle&&this.pushOff(t),s.addClass("L-switch-on"),this.el.addClass("L-switch-on-"+t),this.fireEvent("changed",{type:"on",index:t}))},pushOff:function(t){var s;if(!0===this.toggle)!0===(s=this.buttons[t]).hasClass("L-switch-on")&&(s.removeClass("L-switch-on"),this.el.removeClass("L-switch-on-"+t),this.fireEvent("changed",{type:"off",index:t}));else for(var i=0,e=this.buttons.length;i<e;i++)!0===(s=this.buttons[i]).hasClass("L-switch-on")&&(s.removeClass("L-switch-on"),this.el.removeClass("L-switch-on-"+i),this.fireEvent("changed",{type:"off",index:i}))},push:function(t){!0===this.toggle&&this.isOn(t)?this.pushOff(t):this.pushOn(t)},isOn:function(t){return this.buttons[t].hasClass("L-switch-on")},getValue:function(){if(!0===this.toggle){for(var t=[],s=0,i=this.buttons.length;s<i;s++)t[s]=this.buttons[s].hasClass("L-switch-on");return t}for(s=0,i=this.buttons.length;s<i;s++)if(this.buttons[s].hasClass("L-switch-on"))return s;return-1},setLabel:function(t,s){var i;!this.hasItems||(i=this.buttons[t])&&i.select(".L-switch-label").getAt(0).html(s)},getLabel:function(t){if(!0!==this.hasItems)return null;var s=this.buttons[t];return s?s.select(".L-switch-label").getAt(0).dom.innerHTML:null},onClick:function(t){var s=t.target.id;this.hasItems&&(s=Rui.get(t.target).findParent(".L-switch-button",3).id);var i=this.buttonIndexes[s];null!=i&&this.push(i)},destroy:function(){for(var t=0,s=this.buttons.length;t<s;t++)this.buttons[t].unOn("click",this.onClick,this);this.el.html("")}});