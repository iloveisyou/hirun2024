/*
 * @(#) LXmlDataSet-debug.js
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
 * Xml 데이터의 컬럼정보를 가지는 객체
 *
 * @namespace Rui.data
 * @module data
 * @requires Rui
 * @requires event
 */

/**
 * LXmlDataSet
 * @namespace Rui.data
 * @class LXmlDataSet
 * @extends Rui.data.LDataSet
 * @plugin
 * @constructor LXmlDataSet
 * @param config {Object} The intial LXmlDataSet.
 */
Rui.data.LXmlDataSet = function(config) {
    Rui.data.LXmlDataSet.superclass.constructor.call(this, config);
    
    /**
     * @description 데이터 처리 방식 (2:Xml);
     * @property dataSetType
     * @private
     * @type {int}
     */        
    this.dataSetType = Rui.data.LXmlDataSet.DATA_TYPE; 
};

Rui.extend(Rui.data.LXmlDataSet, Rui.data.LDataSet, {
    /**
     * @description 현재 DataSet 기준으로 결과 데이터를 Object로 변환하여 리턴
     * @method getReadResponseData
     * @param {Object} conn 응답 객체
     * @return {Object}
     */
    getReadResponseData: function(conn) {
        var data = null;
        try{
        	if(this._cachedData) return this._cachedData; // LDataSetManager의 캐쉬 데이터
            data = conn.responseXML;
        } catch(e) {
            throw new Error(Rui.getMessageManager().get('$.base.msg110') + ':' + conn.responseText);
        }
        return data;
    },
    /**
     * @description 결과 데이터를 Array로 변환하여 리턴
     * @method getReadDataMulti
     * @private
     * @param {Object} dataSet LDataSet 객체
     * @param {Object} conn 응답 객체
     * @return {void}
     */
    getReadDataMulti: function(dataSet, conn, config){
        var responseXML = this.getReadResponseData(conn);
        var doc = responseXML;
        var root = dataSet.root;
        if(Rui.isUndefined(root)) {
            root = this.id;
        }
        var rowData = [];

        var datasetNodes = doc.getElementsByTagName('dataset');
        if (datasetNodes && datasetNodes.length > 0) {
            for (var i = 0; i < datasetNodes.length; i++) {
                var node = datasetNodes.item(i);
                var id = node.getAttribute('name');
                if(id != root) continue;
                var rowNodes = doc.getElementsByTagName('row');
                if (rowNodes && rowNodes.length > 0) {
                    for (var i = 0; i < rowNodes.length; i++) {
                        var rowNode = rowNodes.item(i);
                        var colData = [];
                        colData.node = rowNode;
                        for (var j = 0; j < dataSet.fields.length; j++) {
                            var field = dataSet.fields[j];
                            var val = this._getNamedValue(rowNode, dataSet.fields[j].id, "");

                            var formater = this.readFieldFormater[field.type];
                            if(formater) val = formater(val);

                            colData[dataSet.fields[j].id] = val;
                        }
                        rowData.push(colData);
                    }
                }
            }
        }

        return rowData;
    },
    /**
     * @description data를 읽어온다.
     * @method _getNamedValue
     * @private
     * @param {Object} node Node객체
     * @param {String} name 찾고자 하는 Attribute 이름
     * @param {String} defaultValue 기본 값
     * @return {void}
     */
    _getNamedValue: function(node, name, defaultValue) {
        if (!node || !name) {
            return defaultValue;
        }
        var nodeValue = defaultValue;
        var attrNode = node.attributes.getNamedItem(name);
        if (attrNode) {
            nodeValue = attrNode.value;
        } else {
            var childNode = node.getElementsByTagName(name);
            if (childNode && childNode.item(0) && childNode.item(0).firstChild) {
                nodeValue = childNode.item(0).firstChild.nodeValue;
            } else {
                var index = name.indexOf(':');
                if (index > 0) {
                    return this.getNamedValue(node, name.substr(index + 1), defaultValue);
                }
            }
        }
        return nodeValue;
    },
    /**
     * @description 데이터 정보를 문자열로 리턴한다.
     * @method serialize
     * @public
     * @return {String} 문자열
     */
    serialize: function() {
        throw new LException('구현 안됨.');
    },
    /**
     * @description 변경된 데이터 정보를 문자열로 리턴한다.
     * @method serializeModified
     * @public
     * @return {String} 변경된 문자열
     */
    serializeModified: function() {
        throw new LException('구현 안됨.');
    },
    /**
     * @description 선택된 데이터 정보를 문자열로 리턴한다.
     * @method serializeMarkedOnly
     * @public
     * @return {String} 변경된 문자열
     */
    serializeMarkedOnly: function() {
        throw new LException('구현 안됨.');
    },
    /**
     * @description LDataSet 배열의 데이터 정보를 리턴한다.
     * @method serializeDataSetList
     * @private
     * @param {Array} dataSets 데이터 객체 배열
     * @return {String} 
     */
    serializeDataSetList: function(dataSets) {
        throw new LException('구현 안됨.');
    },
    /**
     * @description LDataSet 배열의 변경된 데이터 정보를 리턴한다.
     * @method serializeModifiedDataSetList
     * @private
     * @param {Array} dataSets 데이터 객체 배열
     * @return {String} 
     */
    serializeModifiedDataSetList: function(dataSets) {
        throw new LException('구현 안됨.');
    },
    /**
     * @description LDataSet 배열의 선택된 데이터 정보를 리턴한다.
     * @method serializeMarkedOnlyDataSetList
     * @private
     * @param {Array} dataSets 데이터 객체 배열
     * @return {String} 
     */
    serializeMarkedOnlyDataSetList: function(dataSets) {
        throw new LException('구현 안됨.');
    }
});
// xml type
Rui.data.LXmlDataSet.DATA_TYPE = 2;