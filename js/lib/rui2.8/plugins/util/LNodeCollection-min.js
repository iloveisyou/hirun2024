/*
 * @(#) LNodeCollection-min.js
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
Rui.namespace("Rui.util"),Rui.util.LNodeCollection=function(e){Rui.util.LNodeCollection.superclass.constructor.call(this),this.id=e.id,this.parentId=e.parentId,e.fn&&(this.getObjectValue=e.fn),this.nodes=[]},Rui.extend(Rui.util.LNodeCollection,Rui.util.LCollection,{id:null,parentId:null,rootValue:null,nodes:null,getObjectValue:function(e,t){return e[t]},addNode:function(e,t){var n=this.get(this.getObjectValue(t,this.parentId));null==n?this.nodes.push(t):(n.nodes=n.nodes||[],n.nodes.push(t),t.parent=n)},removeNode:function(e){var t=this.get(e),n=t.parent;this.removeChildNodes(t),null!=n&&(n.nodes=this.getRemoveNodes(n,e)||n.nodes)},getRemoveNodes:function(e,t){if(null!=e)for(var n=e.nodes.length,i=0;i<n;i++)if(e.nodes[i][this.id]==t)return e.nodes.slice(0,i).concat(e.nodes.slice(i+1,e.nodes.length));return null},removeChildNodes:function(e){if(e.nodes)for(var t=e.nodes.length-1;0<=t;t--){var n=e.nodes[t];n.nodes&&0<n.nodes.length?this.removeChildNodes(n):e.nodes=e.nodes.slice(0,t).concat(e.nodes.slice(t+1,e.nodes.length))}delete e.nodes},updateParentId:function(e,t){var n,i,s=this.get(e);null==s?this.nodes.push(t):(n=this.getObjectValue(t,this.id),s.nodes=this.getRemoveNodes(s,n)||s.nodes,(i=this.get(this.getObjectValue(t,this.parentId))).nodes=i.nodes||[],i.nodes.push(t))},insert:function(e,t,n){e<this.length&&this.addNode(t,n),Rui.util.LNodeCollection.superclass.insert.call(this,e,t,n)},add:function(e,t){this.addNode(e,t),Rui.util.LNodeCollection.superclass.add.call(this,e,t)},remove:function(e){this.removeNode(e),Rui.util.LNodeCollection.superclass.remove.call(this,e)},set:function(e,t){var n=this.get(e);if(n.parent){var i=n.parent[this.id];this.updateParentId(i,t)}else{for(var s=this.nodes.length,o=0;o<s;o++)if(this.nodes[o][this.id]==e){this.nodes=this.getRemoveNodes(this,e)||this.nodes;break}n.parent=this.get(this.getObjectValue(t,this.parentId))}Rui.util.LNodeCollection.superclass.set.call(this,e,t)},clear:function(){this.nodes=[],Rui.util.LNodeCollection.superclass.clear.call(this)},nodeSort:function(n,i){var s="DESC"==String(i).toUpperCase()?-1:1;alert("재구현 필요"),this.items.sort(function(e,t){return e[this.parentId]!=t[this.parentId]?0:n(e,t,i)*s})},nodeQuery:function(s,o){var l=new Rui.util.LNodeCollection;return this.each(function(e,t,n,i){!0===s.call(o||this,e,t,n)&&l.add(e,t)},this),l},clone:function(){for(var e=new Rui.util.LNodeCollection,t=this.length,n=0;n<t;n++){var i=this.getKey(n);e.insert(n,i,this.get(i))}return e},toString:function(){return"Rui.util.LNodeCollection "}});