/*
 * @(#) LNodeCollection.js
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
 * 
 * (추가) Plugin 하위 목록에 포함된 파일의 경우 프로젝트에서 임의로 customizing 해서 사용 가능합니다.
 * 단, 프로젝트에서 customizing 한 사항은 기술지원 대상 범위에서 제외됩니다.
 * 
 */

Rui.namespace('Rui.util');
Rui.util.LNodeCollection = function(config) {
    Rui.util.LNodeCollection.superclass.constructor.call(this);
    this.id = config.id;
    this.parentId = config.parentId;
    if(config.fn) this.getObjectValue = config.fn;
    this.nodes = [];
};
Rui.extend(Rui.util.LNodeCollection, Rui.util.LCollection, {
    id: null,
    parentId: null,
    rootValue: null,
    nodes: null,
    getObjectValue: function(obj, key){
        return obj[key];
    },
    addNode: function(key, item) {
        var pObj = this.get(this.getObjectValue(item, this.parentId));
        if(pObj == null) {
            this.nodes.push(item);
        } else {
            pObj.nodes = pObj.nodes || [];
            pObj.nodes.push(item);
            item.parent = pObj;
        }
    },
    removeNode: function(key) {
        var obj = this.get(key);
        var pObj = obj.parent;
        this.removeChildNodes(obj);
        if(pObj != null) {
            pObj.nodes = this.getRemoveNodes(pObj, key) || pObj.nodes;
        }
    },
    getRemoveNodes: function(pObj, key) {
        if(pObj != null) {
            var len = pObj.nodes.length;
            for (var i = 0 ; i < len; i++) {
                if(pObj.nodes[i][this.id] == key) {
                    return pObj.nodes.slice(0, i).concat(pObj.nodes.slice(i+1, pObj.nodes.length));
                }
            }
        }
        return null;
    },
    removeChildNodes: function(obj) {
        if(obj.nodes) {
            for (var i = (obj.nodes.length - 1) ; 0 <= i ; i--) {
                var cObj = obj.nodes[i];
                if(cObj.nodes && 0 < cObj.nodes.length) {
                    this.removeChildNodes(cObj);
                }
                else {
                    obj.nodes = obj.nodes.slice(0, i).concat(obj.nodes.slice(i+1, obj.nodes.length));
                }
            }
        }
        delete obj.nodes;
    },
    updateParentId: function(oldKey, item) {
        var pObj = this.get(oldKey);
        if (pObj == null) {
            this.nodes.push(item);
        } else {
            var key = this.getObjectValue(item,this.id);
            pObj.nodes = this.getRemoveNodes(pObj, key) || pObj.nodes;
            var newObj = this.get(this.getObjectValue(item,this.parentId));
            newObj.nodes = newObj.nodes || [];
            newObj.nodes.push(item); 
        }
    },
    insert: function(idx, key, item) {
        if(idx < this.length) this.addNode(key, item);
        Rui.util.LNodeCollection.superclass.insert.call(this, idx, key, item);
    },
    add: function(key, item) {
        this.addNode(key, item);
        Rui.util.LNodeCollection.superclass.add.call(this, key, item);
    },
    remove: function(key) {
        this.removeNode(key);
        Rui.util.LNodeCollection.superclass.remove.call(this, key);
    },
    set: function(key, item) {
        var oldItem = this.get(key);
        if(oldItem.parent) {
            var parentId = oldItem.parent[this.id];
            this.updateParentId(parentId, item);
        } else {
            var len = this.nodes.length;
            for (var i = 0; i < len; i++) {
                if(this.nodes[i][this.id] == key) {
                    this.nodes = this.getRemoveNodes(this, key) || this.nodes;
                    break;
                }
            }
            oldItem.parent = this.get(this.getObjectValue(item,this.parentId));
        }
        Rui.util.LNodeCollection.superclass.set.call(this, key, item);
    },
    clear: function() {
        this.nodes = [];
        Rui.util.LNodeCollection.superclass.clear.call(this);
    },
    nodeSort: function(fn, dir) {
        var desc = String(dir).toUpperCase() == 'DESC' ? -1 : 1;
        alert('재구현 필요');
        this.items.sort(function(a, b) {
            if(a[this.parentId] != b[this.parentId]) return 0;
            return fn(a, b, dir) * desc;
        });
    },
    nodeQuery: function(func, scope) {
        var newData = new Rui.util.LNodeCollection();
        this.each(function(id, item, i, count){
            if(func.call(scope || this, id, item, i) === true) {
                newData.add(id, item);
            }
        }, this);
        return newData;
    },
    clone: function() {
        var o = new Rui.util.LNodeCollection();
        var len = this.length;
        for (var i = 0 ; i < len ; i++) {
            var key = this.getKey(i);
            o.insert(i, key, this.get(key));
        }
        return o; 
    },
    toString: function() {
        return 'Rui.util.LNodeCollection ';
    }
});
