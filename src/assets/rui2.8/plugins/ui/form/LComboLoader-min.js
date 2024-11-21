/*
 * @(#) LComboLoader-min.js
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
Rui.ui.form.LComboLoader=function(o){this.config=o||{},this.comboList=[]},Rui.ui.form.LComboLoader.prototype={comboList:null,load:function(s){var o=[];if(s.comboInfo)for(var t=0;t<s.comboInfo.length;t++){var i,r=s.comboInfo[t],c=null;c=r instanceof Rui.ui.form.LCombo?r:(i=Rui.applyIf(r,this.config),new Rui.ui.form.LCombo(i));for(var e=-1,a=0;a<this.comboList.length;a++)this.comboList[a].id==c.id&&(e=a);-1==e&&this.comboList.push(c),o.push(c.getDataSet())}var u=o,n=this;s.faliure||(s.faliure=function(o){throw new Error(o.responseText)}),s=Rui.applyIf(s,{method:"POST",callback:{success:function(o){try{for(var t=0;t<u.length;t++){var i=u[t],r=i.getReadData(o);i.loadData(r,s)}n.success&&n.success.call(n,o)}catch(o){throw o}},failure:s.faliure},url:null,params:{},cache:this.cache||!1});for(var l="",t=0;t<this.comboList.length;t++){var f=this.comboList[t].params;l+="object"==typeof f?Rui.util.LObject.serialize(f)+"&":f+"&"}return Rui.LConnect._isFormSubmit=!1,Rui.LConnect.asyncRequest(s.method,s.url,s.callback,l),this},getCombo:function(o){for(var t=0;t<this.comboList.length;t++)if(this.comboList[t].id==o)return this.comboList[t];return null},getComboList:function(){return this.comboList}};