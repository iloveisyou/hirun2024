/*
 * @(#) LNodeCollection-debug.js
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
/**
 * Collection과 Node 관리를 동시에 하는 유틸리티
 * @module util
 * @title LNodeCollection Utility
 * @namespace Rui.util
 * @requires Rui
 */

Rui.namespace('Rui.util');

/**
 * LNodeCollection utility.
 * @class LNodeCollection
 * @extends Rui.util.LCollection
 * @private
 * @static
 * @plugin
 */
Rui.util.LNodeCollection = function(config) {
    Rui.util.LNodeCollection.superclass.constructor.call(this);
    this.id = config.id;
    this.parentId = config.parentId;
    if(config.fn) this.getObjectValue = config.fn;
    this.nodes = [];
};

Rui.extend(Rui.util.LNodeCollection, Rui.util.LCollection, {
    /**
    * @description id 아이디
    * @config id
    * @type {String}
    * @default null
    */
    /**
    * @description id 아이디
    * @property id
    * @private
    * @type {String}
    */
    id: null,
    /**
    * @description parentId 아이디
    * @config parentId
    * @type {String}
    * @default null
    */
    /**
    * @description parentId 아이디
    * @property parentId
    * @private
    * @type {String}
    */
    parentId: null,
    /**
    * @description root의 값의 비교 기준값(null인지? 0인지? undefined인지?) 
    * @config rootValue
    * @type {int}
    * @default null
    */
    /**
    * @description root의 값의 비교 기준값(null인지? 0인지? undefined인지?)
    * @property rootValue
    * @private
    * @type {int}
    */
    rootValue: null,
    /**
    * @description nodes 객체
    * @property nodes
    * @private
    * @type {null}
    */
    nodes: null,
    /**
    * object에서 key에 대한 값을 리턴하는 메소드
    * @method getObjectValue
    * @private
    * @param {Object} obj 객체
    * @param {String} key 키
    * @return {Object}
    */
    getObjectValue: function(obj, key){
        return obj[key];
    },
    /**
    * item을 node를 생성하는 메소드
    * @method addNode
    * @private
    * @param {String} key 키
    * @param {Object} item 입력할 객체
    * @return {void}
    */
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
    /**
    * item을 node를 삭제하는 메소드
    * @method removeNode
    * @private
    * @param {String} key 키
    * @return {void}
    */
    removeNode: function(key) {
        var obj = this.get(key);
        var pObj = obj.parent;
        this.removeChildNodes(obj);
        if(pObj != null) {
            pObj.nodes = this.getRemoveNodes(pObj, key) || pObj.nodes;
        }
    },
    /**
    * 배열에서 해당 key값에 맞는 내용을 삭제한 데이터를 리턴한다.
    * @method getRemoveNodes
    * @private
    * @param {String} obj nodes를 가지는 객체
    * @param {String} key 키
    * @return {void}
    */
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
    /**
    * obj에 하위 노드가 존재하는지 체크하여 순환참조하며 삭제한다.
    * @method removeChildNodes
    * @private
    * @param {Object} obj 체크할 객체
    * @return {void}
    */
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
    /**
    * item을 node를 수정하는 메소드
    * @method updateParentId
    * @param {String} oldParentId 이전 부모키 값
    * @param {Object} item 입력할 객체
    * @return {void}
    */
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
    /**
    * item을 idx위치에 삽입하는 메소드
    * @method insert
    * @param {int} idx 삽입할 위치
    * @param {String} key 키
    * @param {Object} item 입력할 객체
    * @return {void}
    */
    insert: function(idx, key, item) {
        // idx 가 length보다 크면 insert메소드안에서 내부적으로 add를 호출하므로 addNode를 처리하면 안됨.
        if(idx < this.length) this.addNode(key, item);
        Rui.util.LNodeCollection.superclass.insert.call(this, idx, key, item);
    },
    /**
    * item을 추가하는 메소드
    * @method add
    * @param {String} key 키
    * @param {Object} item 입력할 객체
    * @return {void}
    */
    add: function(key, item) {
        this.addNode(key, item);
        Rui.util.LNodeCollection.superclass.add.call(this, key, item);
    },
    /**
    * item을 삭제하는 메소드
    * @method remove
    * @param {String} key 키
    * @return {boolean}
    */
    remove: function(key) {
        this.removeNode(key);
        Rui.util.LNodeCollection.superclass.remove.call(this, key);
    },
    /**
    * key에 해당하는 item을 변경하는 메소드
    * @method set
    * @param {String} key 키
    * @param {Object} item 객체
    * @return {Object}
    */
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
    /**
    * 모두 초기화 하는 메소드
    * @method clear
    * @return {void}
    */
    clear: function() {
        this.nodes = [];
        Rui.util.LNodeCollection.superclass.clear.call(this);
    },
    /**
    * func에 해당되는 값으로 같은 자식 레코드끼리 정렬하는 메소드
    * @method nodeSort
    * @param {Function} func Array 배열
    * @param {String} dir 정렬 방향
    * @return {void}
    */
    nodeSort: function(fn, dir) {
        var desc = String(dir).toUpperCase() == 'DESC' ? -1 : 1;
        alert('재구현 필요');
        this.items.sort(function(a, b) {
            if(a[this.parentId] != b[this.parentId]) return 0;
            return fn(a, b, dir) * desc;
        });
    },
    /**
    * func에 해당되는 값을 LNodeCollection으로 리턴하는 메소드
    * @method nodeQuery
    * @param {Function} func Array 배열
    * @param {Object} scope Array 배열
    * @return {Rui.util.LCollection}
    */
    nodeQuery: function(func, scope) {
        var newData = new Rui.util.LNodeCollection();
        this.each(function(id, item, i, count){
            if(func.call(scope || this, id, item, i) === true) {
                newData.add(id, item);
            }
        }, this);
        
        return newData;
    },
    /**
    * LNodeCollection을 복제하여 리턴하는 메소드
    * @method clone
    * @return {Rui.util.LNodeCollection}
    */
    clone: function() {
        var o = new Rui.util.LNodeCollection();
        var len = this.length;
        for (var i = 0 ; i < len ; i++) {
            var key = this.getKey(i);
            o.insert(i, key, this.get(key));
        }
        
        return o; 
    },
    /**
    * @description 객체의 toString
    * @method toString
    * @public
    * @return {String}
    */
    toString: function() {
        return 'Rui.util.LNodeCollection ';
    }
});
