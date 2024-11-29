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
 * @constructor LXmlDataSet
 * @param config {Object} The intial LXmlDataSet.
 */
Rui.data.APIXmlDataSet = function(config) {
    Rui.data.APIXmlDataSet.superclass.constructor.call(this, config);
    
    /**
     * @description 데이터 처리 방식 (2:Xml);
     * @property dataSetType
     * @private
     * @type {int}
     */        
    this.dataSetType = Rui.data.APIXmlDataSet.DATA_TYPE; 
};

Rui.extend(Rui.data.APIXmlDataSet, Rui.data.LDataSet, {
    /**
     * @description 결과 데이터를 Array로 변환하여 리턴
     * @method getReadDataMulti
     * @private
     * @param {Object} dataSet LDataSet 객체
     * @param {Object} conn 응답 객체
     * @return void
     */
    getReadDataMulti : function(dataSet, conn){
        var responseXML = conn.responseXML;
        var doc = responseXML;
        var rowData = [];
        var docType = 1;
    
        var classesNodes = doc.getElementsByTagName('class');
        if (classesNodes && classesNodes.length > 0) {
            for (var i = 0; i < classesNodes.length; i++) {
                var classNode = classesNodes.item(i);
                var type = classNode.getAttribute('type');
                var typeDescription = this._getNamedValue(classNode, 'description');
                var url = '../api/' + type + '.html';
                rowData.push({
                    docType: docType,
                    title: type,
                    description: typeDescription,
                    objectType: type,
                    url: url,
                    type: 'class'
                });
                var propertiesNodes = classNode.getElementsByTagName('properties');
                if (propertiesNodes && propertiesNodes.length > 0) {
                    for (var pi = 0; pi < propertiesNodes.length; pi++) {
                        var propertiesNode = propertiesNodes.item(pi);
                        var propertyNodes = propertiesNode.getElementsByTagName("property");
                        for(var j = 0 ; j < propertyNodes.length; j++) {
                            var propertiesNode = propertyNodes.item(j);
                            var propertyName = propertiesNode.getAttribute('name');
                            var propertyType = propertiesNode.getAttribute('type');
                            var propertyDescription = this._getNamedValue(propertiesNode, 'description');
                            rowData.push({
                                docType: docType,
                                title: propertyName,
                                description: propertyDescription,
                                objectType: propertyType,
                                url: url + '#property_' + propertyName,
                                type: 'property'
                            });
                        }
                    }
                }
                
                var methodsNodes = classNode.getElementsByTagName('methods');
                if (methodsNodes && methodsNodes.length > 0) {
                    for (var pi = 0; pi < methodsNodes.length; pi++) {
                        var methodsNode = methodsNodes.item(pi);
                        var methodNodes = methodsNode.getElementsByTagName("method");
                        var colData = [];
                        for(var j = 0 ; j < methodNodes.length; j++) {
                            var methodNode = methodNodes.item(j);
                            var methodName = methodNode.getAttribute('name');
//                            var propertyType = methodNode.getAttribute('type');
                            var methodDescription = this._getNamedValue(methodNode, 'description');
                            rowData.push({
                                docType: docType,
                                title: methodName,
                                description: methodDescription,
                                objectType: 'function',
                                url: url + '#method' + methodName,
                                type: 'method'
                            });
                            var parametersNodes = methodNode.getElementsByTagName("parameters");
                            for(var k = 0 ; k < parametersNodes.length; k++) {
                                var parametersNode = parametersNodes.item(k);
                                var parameterNodes = parametersNode.getElementsByTagName("parameter");
                                for(var k2 = 0 ; k2 < parameterNodes.length; k2++) {
                                    var parameterNode = parameterNodes.item(k2);
                                    var parameterName = parameterNode.getAttribute('name');
                                    var parameterType = parameterNode.getAttribute('type');
                                    var parameterDescription = this._getNamedValue(parameterNode, 'description');
                                    rowData.push({
                                        docType: docType,
                                        title: parameterName,
                                        description: parameterDescription,
                                        objectType: parameterType,
                                        url: url + '#method' + methodName,
                                        type: 'method param'
                                    });
                                }
                            }
                        }
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
     * @return void
     */
	_getNamedValue : function(node, name, defaultValue) {
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
    serializeModified : function() {
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
    serializeModifiedDataSetList : function(dataSets) {
        throw new LException('구현 안됨.');
    }
});

// xml type
Rui.data.APIXmlDataSet.DATA_TYPE = 2;