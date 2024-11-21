/*
 * @(#) LXmlDataSet-min.js
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
Rui.data.LXmlDataSet=function(e){Rui.data.LXmlDataSet.superclass.constructor.call(this,e),this.dataSetType=Rui.data.LXmlDataSet.DATA_TYPE},Rui.extend(Rui.data.LXmlDataSet,Rui.data.LDataSet,{getReadResponseData:function(t){var e=null;try{if(this._cachedData)return this._cachedData;e=t.responseXML}catch(e){throw new Error(Rui.getMessageManager().get("$.base.msg110")+":"+t.responseText)}return e},getReadDataMulti:function(e,t,a){var i=this.getReadResponseData(t),n=e.root;Rui.isUndefined(n)&&(n=this.id);var r=[],s=i.getElementsByTagName("dataset");if(s&&0<s.length)for(var l=0;l<s.length;l++){if(s.item(l).getAttribute("name")==n){var o=i.getElementsByTagName("row");if(o&&0<o.length)for(l=0;l<o.length;l++){var d=o.item(l),u=[];u.node=d;for(var f=0;f<e.fields.length;f++){var h=e.fields[f],c=this._getNamedValue(d,e.fields[f].id,""),g=this.readFieldFormater[h.type];g&&(c=g(c)),u[e.fields[f].id]=c}r.push(u)}}}return r},_getNamedValue:function(e,t,a){if(!e||!t)return a;var i=a,n=e.attributes.getNamedItem(t);if(n)i=n.value;else{var r=e.getElementsByTagName(t);if(r&&r.item(0)&&r.item(0).firstChild)i=r.item(0).firstChild.nodeValue;else{var s=t.indexOf(":");if(0<s)return this.getNamedValue(e,t.substr(s+1),a)}}return i},serialize:function(){throw new LException("구현 안됨.")},serializeModified:function(){throw new LException("구현 안됨.")},serializeMarkedOnly:function(){throw new LException("구현 안됨.")},serializeDataSetList:function(e){throw new LException("구현 안됨.")},serializeModifiedDataSetList:function(e){throw new LException("구현 안됨.")},serializeMarkedOnlyDataSetList:function(e){throw new LException("구현 안됨.")}}),Rui.data.LXmlDataSet.DATA_TYPE=2;