/*
 * @(#) rui_validate-debug.js
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
 * Validator
 * @module validate
 * @title Validator
 * @requires Rui
 */
Rui.namespace('Rui.validate');
/**
 * Validator
 * @namespace Rui.validate
 * @class LValidator
 * @protected
 * @constructor LValidator
 * @param {string} id field id
 * @param {object} config label등 validator 속성
 */
Rui.validate.LValidator = function(id, config){
    config = config || {};
    Rui.applyObject(this, config, true);
    this.id = id;
};
Rui.validate.LValidator.prototype = {
    /**
     * @description validator id
     * @property id
     * @private
     * @type {String}
     */
    id: null,
    /**
     * @description 출력할 컬럼명
     * @property itemName
     * @private
     * @type {String}
     */
    itemName: null,
    /**
     * @description 유효성을 체크하는 로직이 들어 있는 Function
     * @property fn
     * @private
     * @type {Function}
     */
    fn: null,
    /**
     * @description object type 명
     * @property otype
     * @private
     * @type {String}
     */
    otype: 'Rui.util.LValidator',
    /**
     * @description validate하는 메소드
     * @method validate
     * @public
     * @param {Object} value 비교 값
     * @return {boolean} 비교 결과값
     */
    validate: function(value) {
        return true;
    },
    /**
     * @description 객체의 toString
     * @method toString
     * @public
     * @return {String}
     */
    toString: function() {
        return (this.otype || 'Rui.validate.LValidator') + ' ' + this.id;
    }
};
/**
 * LValidator 기반의 각종 FORM, UI Component, DataSet 등의 객체 유효성을 관리하는 컴포넌트
 * @namespace Rui.validate
 * @class LValidatorManager
 * @sample default
 * @constructor LValidatorManager
 * @param {Object} config The intial LValidatorManager.
 */
Rui.validate.LValidatorManager = function(config){
    var config = config || {};
    this.selector = config.selector || 'input,select,textarea';
    this.validators = new Rui.util.LCollection();
    if(config.validators)
        this.parse(config.validators);
};
Rui.validate.LValidatorManager.prototype = {
    /**
     * @description LValidator들을 가지는 객체
     * @config validators
     * @sample default
     * @type {Array}
     * @default null
     */
    /**
     * @description LValidator들을 가지는 객체
     * @property validators
     * @private
     * @type {Rui.util.LCollection}
     */
    validators: null,
    /**
     * @description invalid 된 객체들의 정보 배열
     * @property invalidList
     * @private
     * @type {Array}
     */
    invalidList: null,
    /**
     * validators 객체 정보 parse
     * @method parse
     * @private
     * @param {Array} validators validator Array객체
     * @return {void}
     */
    parse: function(validators) {
        for (var vi = 0 ; vi < validators.length ; vi++) {
            var validator = validators[vi];
            var id = validator.id;
            var expression = validator.validExp;
            var columns = Rui.util.LString.advancedSplit(expression, ':', 'it');
            var label = columns[0];
            var required = columns[1] == 'true' ? true : false;
            if(required) {
                var requiredValidator = new Rui.validate.LRequiredValidator(id);
                requiredValidator.required = required;
                requiredValidator.label = label;
                this.add(id, requiredValidator);
            }
            if (Rui.isNull(columns[2])) return;
            var vExps = Rui.util.LString.advancedSplit(columns[2], '&', 'it');
            for (var i = 0; i < vExps.length; i++) {
                if (Rui.isNull(vExps[i])) continue;
                var p = vExps[i].indexOf('=');
                var sArr = [];
                var sArr = [];
                if(p == -1){
                    sArr.push(vExps[i]);
                }else{
                    sArr.push(vExps[i].substring(0, p));
                    sArr.push(vExps[i].substring(p+1));
                }
                //var sArr = Rui.util.LString.advancedSplit(vExps[i], '=', 'it');
                if (Rui.isNull(sArr[0])) throw new Rui.LException(label+' : '+Rui.getMessageManager().get('$.base.msg050', vExps[i]));
                if (sArr.length>1 && Rui.util.LString.trim(sArr[1]) == '') throw new Rui.LException(label+' : '+Rui.getMessageManager().get('$.base.msg050', vExps[i]));
                var firstUpperCase = Rui.util.LString.firstUpperCase(sArr[0]);
                if (!Rui.validate['L'+firstUpperCase+'Validator']) throw new Rui.LException(label+' : '+Rui.getMessageManager().get('$.base.msg051', vExps[i]));
                //if (!eval('Rui.validate.L'+firstUpperCase+'Validator')) throw new Rui.LException(label+' : '+Rui.getMessageManager().get('$.base.msg051', vExps[i]));
                try {
                    var validatorObj = null;
                    //if (sArr[1]) validatorObj = eval('new Rui.validate.L'+firstUpperCase+'Validator("'+id+'","'+sArr[1]+'")');
                    if (sArr[1]) validatorObj = new Rui.validate['L'+firstUpperCase+'Validator'](id, sArr[1]);
                    else validatorObj = new Rui.validate['L'+firstUpperCase+'Validator'](id);
                    validatorObj.required = required;
                    validatorObj.fn = validator.fn;
                    validatorObj.label = label;
                    this.add(id, validatorObj);
                } catch (e) {
                    if (e instanceof Rui.LException) e.message = label+' : '+Rui.getMessageManager().get('$.base.msg050', vExps[i]);
                    throw e;
                }
            }
        }
    },
    /**
     * Validator객체를 추가하는 메소드
     * @method add
     * @public
     * @param {String} id validation할 객체의 id
     * @param {Rui.validate.LValidator} validator validator 객체
     * @return {void}
     */
    add: function(id, validator) {
        this.validators.add(id, validator);
        return this;
    },
    /**
     * validation를 object에 가지고 있는 키,값으로 수행하는 메소드
     * @method validate
     * @public
     * @param {Object} obj Validation할 object
     * @return {boolean} validate 여부
     */
    validate: function(obj, row) {
        var isValid = true,
        invalidList = [],
        messageList = [],
        value, invalidInfo;
        for (var id in obj) {
            value = obj[id];
            invalidInfo = this.validateField(id, value, row);
            if(invalidInfo.isValid == false) {
                invalidList.push({
                    row: row,
                    id: invalidInfo.id,
                    value: invalidInfo.value,
                    label: invalidInfo.label,
                    message: invalidInfo.message
                });
                if(!Rui.util.LArray.indexOf(messageList, invalidInfo.message) <= 0) {
                    messageList = messageList.concat(invalidInfo.message);
                }
                isValid = false;
            }
        }
        this.invalidList = invalidList;
        this.messageList = messageList;
        return isValid;
    },
    /**
     * 지정한 id의 DOM 하위에 구성된 INPUT, TextArea, CheckBox, Radio등의 입력폼 안에서 유효성을 검사하는 메소드
     * @method validateGroup
     * @sample default
     * @param {String} id Validation할 group id
     * @return {boolean} validate 여부
     */
    validateGroup: function(groupEl){
        var isValid = true,
        itemMessageList = [];
        this.invalidList = [];
        groupEl = Rui.get(groupEl);
        
        var childList = Rui.util.LDomSelector.query(this.selector, groupEl.dom);
        var _message = null;
        Rui.util.LArray.each(childList, function(f) {
            var child = Rui.get(f);
            var id = f.name || f.id;
            var validator = this.validators.get(id);
            if(validator) {
                if(this.validateEl(child) == false) {
                    var colLabel = (validator != null) ? validator.label : id;
                    isValid = false;
                    this.invalidList.push({
                        id: id,
                        label: colLabel,
                        value: child.getValue(),
                        messageList: this.messageList
                    });
                    var message = colLabel + ' : ' + this.messageList + '\r\n';
                    // radio나 checkbox일경우 중복되므로 _message로 체크하여 메시지 탑재
                    if(message != _message) itemMessageList = itemMessageList.concat(message);
                    _message = message;
                }
            }
        }, this);
        
        this.messageList = itemMessageList;
        
        return isValid;
    },
    /**
     * 지정한 id의 INPUT, TextArea, CheckBox, Radio등의 입력 폼 값의 유효성을 검사하는 메소드
     * validation 결과 => isValid: {boolean}, id: {string}, label: {string}, message: {string}, messages: {string[]}
     * @method validateField
     * @param {String} id Validation할 field
     * @param {Object} value Validation할 object
     * @return {Object} row 
     */
    validateField: function(id, value, row) {
        var isValid = true,
        label = id,
        messageList = [],
        validatorList = this.getValidatorList(id);
        for (var i = 0 ; i < validatorList.length ; i++){
            var item = validatorList[i];
            if(item){
                var currentValid = true;
                if(item.fn) currentValid = item.fn.call(item, value, row);
                else if(!(item.required === false && Rui.isEmpty(value))) currentValid = item.validate(value);
                if (currentValid == false){
                    label = item.label || id;
                    isValid = currentValid;
                    messageList.push(item.message);
                }
            }
        }
        return {
            isValid: isValid,
            id: id,
            label: label,
            message: messageList.join('\r\n'),
            messages: messageList
        };
    },
    /**
     * 지정한 el의 INPUT, TextArea, CheckBox, Radio 및 Rui.ui.form.LField 컴포넌트의 입력 폼 값의 유효성을 검사하는 메소드
     * validation 결과 => isValid: {boolean}, id: {string}, label: {string}, message: {string}, messages: {string[]}
     * @method validateEl
     * @param {Rui.LElement} el Validation할 Element객체
     * @return {boolean} validate 여부
     */
    validateEl: function(el) {
        var isValid = true,
        dm = '<ul style="margin:0px;padding-left:20px">',
        objId, obj, o, value, newMessageList, validatorList;
        if(el.gridFieldId){
            o = el;
            objId = el.gridFieldId;
        }else if(el.fieldObject == true){
            o = el;
            objId = el.id;
        }else{
            el = Rui.get(el);
            if(el == null) throw new Rui.LException('Unknown element');
            obj = el.dom.instance;
            if(obj && obj.fieldObject === true){
                o = obj;
                objId = obj.name || obj.id;
            }else{
                o = el;
                objId = el.dom.name || el.dom.id;
            }
        }
        
        value = o.getValue();
        newMessageList = [];
        validatorList = this.getValidatorList(objId);
        for (var i = 0; i < validatorList.length; i++){
            var item = validatorList[i];
            if (item){
                var currentValid = true;
                if (item.fn) currentValid = item.fn.call(item, value);
                else if(el.dom && el.dom.type == 'radio'){
                    if(item instanceof Rui.validate.LRequiredValidator) {
                    	if(el.dom.name) {
                    		currentValid = false;
                    		var radios = el.parentDepth(3).select('input[name=' + el.dom.name + ']');
                    		radios.each(function(item, i) {
                    			if(item.dom.checked === true) {
                    				currentValid = true;
                    				return false;
                    			}
                    		});
                    	}
                    	if(currentValid === false) item.message = Rui.getMessageManager().get('$.base.msg001');
                    } else currentValid = item.validate(value);
                }else if(!(item.required === false && Rui.isEmpty(value))) 
                    currentValid = item.validate(value);
                if(currentValid == false && !Rui.util.LArray.indexOf(newMessageList, item.message) <= 0){
                    dm += '<li>' + item.message + '</li>';
                    newMessageList.push(item.message);
                    isValid = false;
                } else o.valid();
            }
        }
        dm += '</ul>';
        isValid ? o.valid() : o.invalid(dm);
        
        this.messageList = newMessageList;
        return isValid;
    },
    /**
     * dataSet의 값을 기준으로 유효성체크를 한다.
     * @method validateDataSet
     * @sample default
     * @param {Rui.data.LDataSet} dataSet Validation할 dataSet객체
     * @param {int} row [optional] Validation할 dataSet객체의 행 번호, 생략할 경우 전체 행을 검사한다.
     * @return {boolean} validate 여부
     */
    validateDataSet: function(dataSet, row) {
        if(dataSet.getCount() < 1) return true;
        var isValid = true;
        var messageList = [];
        var isMulti = !Rui.isUndefined(row) ? false : true;
        row = !Rui.isUndefined(row) && row < 0 ? 0 : row;
        var count = !Rui.isUndefined(row) ? row + 1 : dataSet.getCount();
        var isValidMulti = false;
        for (var currRow = (row || 0) ; currRow < count ; currRow++) {
            var record = dataSet.getAt(currRow);
            if(dataSet.isRowModified(currRow)) {
                for (var col = 0, len = dataSet.fields.length ; record && col < len; col++) {
                    var colId = dataSet.fields[col].id;
                    var value = record.get(colId);
                    if(dataSet.remainRemoved === true && dataSet.isRowDeleted(currRow)) continue;
                    var invalidInfo = this.validateField(colId, value, currRow);
                    if (invalidInfo.isValid == false) {
                        isValid = false;
                        dataSet.invalid(currRow, record.id, col, invalidInfo.id, invalidInfo.message, invalidInfo.value, isMulti);
                        messageList.push('[' + (currRow + 1) +  ' row : ' + invalidInfo.label + '] => ' + invalidInfo.message);
                    } else {
                        dataSet.valid(currRow, record.id, col, invalidInfo.id, isMulti);
                    }
                }
            }else{
                for (var col = 0, len = dataSet.fields.length ; record && col < len; col++) {
                    var colId = dataSet.fields[col].id;
                    if(!isMulti)
                        dataSet.valid(currRow, record.id, col, colId, isMulti);
                    else if(isMulti && isValidMulti == false) {
                        dataSet.valid(currRow, record.id, col, colId, isMulti);
                        isValidMulti = true;
                    }
                }
            }
        }
        this.messageList = messageList;
        return isValid;
    },
    /**
     * validateGrid 수행하는 메소드
     * @method validateGrid
     * @private
     * @param {Rui.ui.LGridPanel} gridPanel Validation할 gridPanel객체
     * @return {boolean} validate 여부
     */
    validateGrid: function(gridPanel) {
        var view = gridPanel.getView();
        var dataSet = view.dataSet;
        var isValid = true;
        var newMessageList = [];
        for (var row = 0 ; row < dataSet.getCount() ; row++) {
            if(dataSet.isRowModified(row)) {
                var record = dataSet.getAt(row);
                var currentValid = this.validate(record.getValues(), row);
                isValid = isValid ? currentValid : isValid;
                var invalidList = this.getInvalidList();
                var colMap = {};
                for (var i = 0 ; i < invalidList.length ; i++) {
                    var column = view.columnModel.getColumnById(invalidList[i].id);
                    var colId = invalidList[i].id;
                    var validator = this.validators.get(colId);
                    colLabel = (validator != null) ? validator.label : (column != null) ? column.getLabel() : colLabel;
                    if(column != null) {
                        var col = view.columnModel.getIndexById(colId, true);
                        view.addCellClass(row, col, 'L-invalid');
                        if(!colMap[colId]) view.removeCellAlt(row, col);
                        var alt = view.getCellAlt(row, col);
                        view.addCellAlt(row, col, (alt ? alt + '/' : alt) + invalidList[i].message);
                        colMap[colId] = col;
                    }
                    var message = invalidList[i].message;
                    newMessageList.push('[' + (row + 1) +  ' row : ' + colLabel + '] => ' + message);
                } 
            }
        }
        this.messageList = newMessageList;
        return isValid;
    },
    /**
     * validate, validateField, validateGroup 메소드 실행의 결과로 invalid 상태가 된 각종 폼객체들을 일괄 valid 상태로 만든다.
     * 주의!! validateDataSet, validateGrid등에 의해 invalid 상태가 된 경우는 이 메소드를 사용해선 안된다.
     * @method clearInvalids
     * @return {void}
     */
    clearInvalids: function(){
        var invalids = this.getInvalidList(), obj;
        if(!invalids) return;
        for (var i = 0, len = invalids.length; i < len; i++){
            var obj = Rui.get(invalids[i].id);
            if(obj){
                obj.valid();
            }
        }
        this.invalidList = null;
    },
    /**
     * validator의 id에 해당되는 LValidator를 배열로 리턴한다.
     * @method getValidatorList
     * @public
     * @param {String} id validator id
     * @return {ArrayList}
     */
    getValidatorList: function(id) {
        var validatorList = [];
        for (var i = 0; i < this.validators.length ; i++) {
            var item = this.validators.getAt(i);
            if(id == item.id)
                validatorList.push(item);
        };
        return validatorList;
    },
    /**
     * validator의 id에 해당되는 LValidator를 리턴한다.
     * @method getValidator
     * @param {String} id validator id
     * @param {String} validatorId validator 종류(ex. date, length, minDate 등)
     * @return {object}
     */
    getValidator: function(id, validatorId) { 
        var firstUpperCase = Rui.util.LString.firstUpperCase(validatorId);
        var validatorList = this.getValidatorList(id);
        for (var i = 0 ; i < validatorList.length ; i++) {
            if(validatorList[i] instanceof Rui.validate['L'+firstUpperCase+'Validator']) {
                return validatorList[i];
            }
        }
        return null;
    },
    /**
     * invalid된 객체를 담아 배열로 리턴한다.
     * @method getInvalidList
     * @return {Array} invalid 배열
     */
    getInvalidList: function() {
        return this.invalidList;
    },
    /**
     * 출력했던 메시지를 문자로 리턴한다.
     * @method getMessageList
     * @return {String} 출력했던 전체 메시지
     */
    getMessageList: function() {
        return this.messageList;
    },
    /**
     * @description 객체의 toString
     * @method toString
     * @public
     * @return {String}
     */
    toString: function() {
        return 'Rui.validate.LValidatorManager ' + this.id;
    }
};

/**
 * LRequiredValidator 필수 여부
 * @namespace Rui.validate
 * @class LRequiredValidator
 * @protected
 * @extends Rui.validate.LValidator
 * @constructor LRequiredValidator
 * @param {string} id field id
 * @param {object} config label등 validator 속성
 */
Rui.validate.LRequiredValidator = function(id, config){
    Rui.validate.LRequiredValidator.superclass.constructor.call(this, id, config);
    this.msgId = '$.base.msg001';
};
Rui.extend(Rui.validate.LRequiredValidator, Rui.validate.LValidator, {
    otype: 'Rui.validate.LRequiredValidator',
    validate: function(value) {
        if (Rui.isEmpty(value)) {
            this.message = Rui.getMessageManager().get(this.msgId);
            return false;
        }
        return true;
    }
});
/**
 * <pre>
 * AllowCharValidator : 지정된 문자가 들어있을 경우 유효한것으로 판단한다.
 * { id: 'col17', validExp:'Col17:true:allow=\\a;\\n'} 
 * Wild 문자
 *   ;    - \;
 *   한글 - \h  
 *   영문 - \a
 *   숫자 - \n
 * </pre>
 * @namespace Rui.validate
 * @class LAllowValidator
 * @protected
 * @extends Rui.validate.LValidator
 * @constructor LAllowValidator
 * @param {string} id field id
 * @param {string} allowExpr 허용문자 표현식
 * @param {object} config label등 validator 속성
 */
Rui.validate.LAllowValidator = function(id, allowExpr, config){
    Rui.validate.LAllowValidator.superclass.constructor.call(this, id, config);
    this.exprs = Rui.util.LString.advancedSplit(allowExpr, ";", "i");
    this.msgId = '$.base.msg038';
    var msgFStr = allowExpr.split(';');
    for (var i = 0; i < msgFStr.length; i++) {
        if (msgFStr[i] == "\\h" || msgFStr[i] == "\h") { 
            msgFStr[i] = Rui.getMessageManager().get('$.core.kor'); //  한글
        } else if(msgFStr[i] == "\\a" || msgFStr[i] == "\a") {
            msgFStr[i] = Rui.getMessageManager().get('$.core.eng'); //  영어
        } else if(msgFStr[i] == "\\n" || msgFStr[i] == "\n") {
            msgFStr[i] = Rui.getMessageManager().get('$.core.num'); //  숫자
        }
    }
    this.message = Rui.getMessageManager().get(this.msgId, [msgFStr.join(',')]);
};
Rui.extend(Rui.validate.LAllowValidator, Rui.validate.LValidator, {
    otype: 'Rui.validate.LAllowValidator',
    validate: function(value) {
        value += '';
        for (var i = 0; i < value.length; i++) {
            var chr = value.charAt(i);
            var cCode = chr.charCodeAt(0);
            if ((0xAC00 <= cCode && cCode <= 0xD7A3) || (0x3131 <= cCode && cCode <= 0x318E)) {
                if(Rui.util.LArray.indexOf(this.exprs, '\\h') == -1 && Rui.util.LArray.indexOf(this.exprs, '\h') == -1) return false;
            } else if((0x61 <= cCode && cCode <= 0x7A) || (0x41 <= cCode && cCode <= 0x5A)) {
                if(Rui.util.LArray.indexOf(this.exprs, '\\a') == -1 && Rui.util.LArray.indexOf(this.exprs, '\a') == -1) return false;
            } else if(!isNaN(parseInt(chr, 10))) {
                if(Rui.util.LArray.indexOf(this.exprs, '\\n') == -1 && Rui.util.LArray.indexOf(this.exprs, '\n') == -1) return false;
            } else {
                var isValid = false;
                for (var j = 0 ; j < this.exprs.length; j++) {
                    if(this.exprs[j] == '\\h' || this.exprs[j] == '\\a' || this.exprs[j] == '\\n' || this.exprs[j] == '\h' || this.exprs[j] == '\a' || this.exprs[j] == '\n') continue;
                    isValid = true;
                    if(this.exprs[j].indexOf(chr) < 0) {
                        isValid = false;
                        break;
                    }
                }
                if(isValid == false) return false;
            }
        }
        return true;
    }
});
/**
 * LByteLengthValidator byte로 길이를 체크하는 validator<br>
 * { id: 'col4', validExp:'Col4:true:byteLength=4'}
 * @namespace Rui.validate
 * @class LByteLengthValidator
 * @protected
 * @extends Rui.validate.LValidator
 * @constructor LByteLengthValidator
 * @param {string} id field id
 * @param {string} length 허용되는 byte길이
 * @param {object} config label등 validator 속성
 */
Rui.validate.LByteLengthValidator = function(id, length, config){
    Rui.validate.LByteLengthValidator.superclass.constructor.call(this, id, config);
    this.length = parseInt(length, 10);
    this.msgId = '$.base.msg029';
};
Rui.extend(Rui.validate.LByteLengthValidator, Rui.validate.LValidator, {
    otype: 'Rui.validate.LByteLengthValidator',
    validate: function(value) {
        if(Rui.isNull(value) || Rui.isUndefined(value)) return true;
        value += '';
        if (!this.checkCondition(this.getByteLength(value), this.length)) {
            this.message = Rui.getMessageManager().get(this.msgId, [this.length, Math.round(this.length / 3)]);
            return false;
        }
        return true;
    },
    getByteLength: function (value) {
        var byteLength = 0, c;
        for (var i = 0; i < value.length; i++) {
            c = escape(value.charAt(i));      
            
            if (c.length == 1) {  
                byteLength ++;          
            } else if (c.indexOf('%u') != -1)  {
                // utf-8일 경우 3byte
                byteLength += 3;        
            } else if (c.indexOf('%') != -1)  {  
                byteLength += c.length/3;                
            }
        }
        return byteLength;   
    },
    checkCondition: function (value, vValue) { return value == vValue; }
});
/**
 * LCsnValidator 사업자 번호인지 체크하는 validator<br>
 * { id: 'col15', validExp:'Col15:true:csn'} 
 * @namespace Rui.validate
 * @class LCsnValidator
 * @protected
 * @extends Rui.validate.LValidator
 * @constructor LCsnValidator
 * @param {string} id field id
 * @param {object} config label등 validator 속성
 */
Rui.validate.LCsnValidator = function(id, config){
    Rui.validate.LCsnValidator.superclass.constructor.call(this, id, config);
};
Rui.extend(Rui.validate.LCsnValidator, Rui.validate.LValidator, {
    otype: 'Rui.validate.LCsnValidator',
    validate: function(value) {
        if(Rui.isEmpty(value)) return true;
        if (!value || (value+'').length != 10 || isNaN(value)) {
            this.message = Rui.getMessageManager().get('$.base.msg015');
            return false;
        }
        if (Rui.util.LString.isCsn(value) == false) {
            this.message = Rui.getMessageManager().get('$.base.msg015');
            return false;
        }
        return true;
    }
});
/**
 * <pre>
 * LDateValidator 날짜의 유효성을 체크하는 validator
 * { id: 'col11', validExp:'Col11:true:date=YYYYMMDD'}
 * format문자 :  YYYY,  -> 4자리 년도
 *               YY,    -> 2자리 년도. 2000년 이후.
 *               MM,    -> 2자리 숫자의 달. 
 *               DD,    -> 2자리 숫자의 일. 
 *               hh,    -> 2자리 숫자의 시간. 12시 기준
 *               HH,    -> 2자리 숫자의 시간. 24시 기준 
 *               mm,    -> 2자리 숫자의 분. 
 *               ss     -> 2자리 숫자의 초.
 * 
 * 예) 
 *     'YYYYMMDD' -> '20020328'    
 *     'YYYY/MM/DD' -> '2002/03/28'
 *     'Today : YY-MM-DD' -> 'Today : 02-03-28'
 * 
 * 참고) 
 *       format문자가 중복해서 나오더라도 처음 나온 문자에 대해서만
 *       format문자로 인식된다. YYYY와 YY, hh와 HH 도 중복으로 본다.
 *       날짜는 년,월이 존재할 때만 정확히 체크하고 만일 년, 월이 없다면
 *       1 ~ 31 사이인지만 체크한다.
 * </pre>
 * @namespace Rui.validate
 * @class LDateValidator
 * @protected
 * @extends Rui.validate.LValidator
 * @constructor LDateValidator
 * @param {string} id field id
 * @param {string} dateExpr 허용되는 byte길이
 * @param {object} config label등 validator 속성
 */
Rui.validate.LDateValidator = function(id, dateExpr, config){
    Rui.validate.LDateValidator.superclass.constructor.call(this, id, config);
    this.dateExp = dateExpr;
    this.lastDateExp = this.dateExp;
    this.year = null;
    this.month = null;
    this.value = null;
};

Rui.extend(Rui.validate.LDateValidator, Rui.validate.LValidator, {
    otype: 'Rui.validate.LDateValidator',
    validate: function(value) {
        if(value instanceof Date) return true;
        this.value = value;
        this.dateExp = this.lastDateExp;
        if(Rui.isEmpty(value)) return true;
        return (
            this.checkLength(value) &&
            this.checkYear(value) &&
            this.checkMonth(value) &&
            this.checkDay(value) &&
            this.checkHour(value) &&
            this.checkMin(value) &&
            this.checkSec(value) &&
            this.checkRest(value)
        );
    },
    
    checkLength: function () {
        if (this.value.length != this.dateExp.length) {
            this.message = Rui.getMessageManager().get('$.base.msg037', [this.dateExp]);
            return false;
        }
        return true;
    },
    
    checkYear: function () {
        var index = -1;

        if ( (index = this.dateExp.indexOf('YYYY')) != -1 ) {
            subValue = this.value.substr(index, 4);
            if ( !isNaN(subValue) && (subValue > 0) ) {
                this.dateExp = Rui.util.LString.cut(this.dateExp, index, 4);
                this.value = Rui.util.LString.cut(this.value, index, 4);
                this.year = subValue;
                return true;
            } else {
                this.message = Rui.getMessageManager().get('$.base.msg013');
                return false;
            }
        } 
        
        if ( (index = this.dateExp.indexOf('YY')) != -1 ) {
            subValue = '20' + this.value.substr(index, 2);
            if ( !isNaN(subValue) && (subValue > 0) ) {
                this.dateExp = Rui.util.LString.cut(this.dateExp, index, 2);
                this.value = Rui.util.LString.cut(this.value, index, 2);
                this.year = subValue;
                return true;
            } else {
                this.message = Rui.getMessageManager().get('$.base.msg013');
                return false;
            }
        } 
        return true;
    },
    
    checkMonth: function () {
        var index = -1;
    
        if ( (index = this.dateExp.indexOf('MM')) != -1 ) {
            subValue = this.value.substr(index, 2);
            if ( !isNaN(subValue) && (subValue > 0) && (subValue <= 12) ) {
                this.dateExp = Rui.util.LString.cut(this.dateExp, index, 2);
                this.value = Rui.util.LString.cut(this.value, index, 2);
                this.month = subValue;
                return true;
            } else {
                this.message = Rui.getMessageManager().get('$.base.msg017');
                return false;
            }
        } 
        return true;
    },
    
    checkDay: function () {
        var index = -1;
        var days = 0;
        
        if ( (index = this.dateExp.indexOf('DD')) != -1 ) {
            if ( (this.year) && (this.month) ) {
                days = (this.month != 2) ? Rui.util.LDate.getDayInMonth(this.month-1) : (( (this.year % 4) == 0 && (this.year % 100) != 0 || (this.year % 400) == 0 ) ? 29 : 28 );
            } else {
                days = 31;
            }
            
            subValue = this.value.substr(index, 2);
            if ( (!isNaN(subValue)) && (subValue > 0) && (subValue <= days) ) {
                this.dateExp = Rui.util.LString.cut(this.dateExp, index, 2);
                this.value = Rui.util.LString.cut(this.value, index, 2);
                return true;
            } else {
                this.message = Rui.getMessageManager().get('$.base.msg018');
                return false;
            }
        } 
        return true;
    },
    
    checkHour: function () {
        var index = -1;
        
        if ( (index = this.dateExp.indexOf('hh')) != -1 ) {
            subValue = this.value.substr(index, 2);
            if ( !isNaN(subValue) && ((subValue=Number(subValue)) >= 0) && (subValue <= 12) ) {
                this.dateExp = Rui.util.LString.cut(this.dateExp, index, 2);
                this.value = Rui.util.LString.cut(this.value, index, 2);
                return true;
            } else {
                this.message = Rui.getMessageManager().get('$.base.msg019');
                return false;
            }
        } 
        
        if ( (index = this.dateExp.indexOf('HH')) != -1 ) {
            subValue = this.value.substr(index, 2);
            if ( !isNaN(subValue) && ((subValue=Number(subValue)) >= 0) && (subValue < 24) ) {
                this.dateExp = Rui.util.LString.cut(this.dateExp, index, 2);
                this.value = Rui.util.LString.cut(this.value, index, 2);
                return true;
            } else {
                this.message = Rui.getMessageManager().get('$.base.msg019');
                return false;
            }
        } 
        return true;
    },
    
    checkMin: function () {
        var index = -1;
    
        if ( (index = this.dateExp.indexOf('mm')) != -1 ) {
            subValue = this.value.substr(index, 2);
            if ( !isNaN(subValue) && ((subValue=Number(subValue)) >= 0) && (subValue < 60 ) ) {
                this.dateExp = Rui.util.LString.cut(this.dateExp, index, 2);
                this.value = Rui.util.LString.cut(this.value, index, 2);
                this.month = subValue;
                return true;
            } else {
                this.message = Rui.getMessageManager().get('$.base.msg020');
                return false;
            }
        } 
        return true;
    },
    
    checkSec: function () {
        var index = -1;
    
        if ( (index = this.dateExp.indexOf('ss')) != -1 ) {
            subValue = this.value.substr(index, 2);
            if ( (!isNaN(subValue)) && ((subValue=Number(subValue)) >= 0) && (subValue < 60 ) ) {
                this.dateExp = Rui.util.LString.cut(this.dateExp, index, 2);
                this.value = Rui.util.LString.cut(this.value, index, 2);
                this.month = subValue;
                return true;
            } else {
                this.message = Rui.getMessageManager().get('$.base.msg021');
                return false;
            }
        } 
        return true;
    },
    
    checkRest: function () {
        if (this.value == this.dateExp) return true;
        return false;
    }
});
/**
 * LEmailValidator 이메일인지 체크하는 validator<br>
 * { id: 'col18', validExp:'Col18:true:email'}
 * @namespace Rui.validate
 * @class LEmailValidator
 * @protected
 * @extends Rui.validate.LValidator
 * @constructor LEmailValidator
 * @param {string} id field id
 * @param {object} config label등 validator 속성
 */
Rui.validate.LEmailValidator = function(id, config){
    Rui.validate.LEmailValidator.superclass.constructor.call(this, id, config);
};
Rui.extend(Rui.validate.LEmailValidator, Rui.validate.LValidator, {
    otype: 'Rui.validate.LEmailValidator',
    validate: function(value) {
        if(Rui.isEmpty(value)) return true;
        if (Rui.util.LString.isEmail(value) == false) {
            this.message = Rui.getMessageManager().get('$.base.msg034');
            return false;
        }
        return true;
    }
});

/**
 * <pre>
 * filterValidator : 지정된 문자가 들어있을 경우 유효하지 않은 것으로 판단한다.
 * { id: 'col16', validExp:'Col16:true:filter=%;<;\\h;\\;;haha' } 
 * Wild 문자
 *   ;    - \;
 *   한글 - \h  
 *   영문 - \a
 *   숫자 - \n
 * </pre>
 * @namespace Rui.validate
 * @class LFilterValidator
 * @protected
 * @extends Rui.validate.LValidator
 * @constructor LFilterValidator
 * @param {string} id field id
 * @param {string} filterExpr 허용되는 byte길이
 * @param {object} config label등 validator 속성
 */
Rui.validate.LFilterValidator = function(id, filterExpr, config){
    Rui.validate.LFilterValidator.superclass.constructor.call(this, id, config);
    this.exprs = Rui.util.LString.advancedSplit(filterExpr, ';', 'i');
    for (var i = 0; i < this.exprs.length; i++) {
        if (this.exprs[i] == '\\h') {
            this.exprs[i] = '한글';
        } else if (this.exprs[i] == '\\a') {
            this.exprs[i] = '영문';
        } else if (this.exprs[i] == '\\n') {
            this.exprs[i] = '숫자';
        }
    }
    this.msgId = '$.base.msg033';
};
Rui.extend(Rui.validate.LFilterValidator, Rui.validate.LValidator, {
    otype: 'Rui.validate.LFilterValidator',
    validate: function(value) {
        for (var i = 0; i < this.exprs.length; i++) {
            var fStr = this.exprs[i];
            if ( ((fStr == '한글' || fStr == '영문' || fStr == '숫자') && !this.checkWildChr(value, fStr)) || ( value && value.indexOf(fStr) != -1) ) {
                this.message = Rui.getMessageManager().get(this.msgId, [fStr]);
                return false;
            }
        }
        return true;
    },
    checkWildChr: function (value, fChr) {
        for (var i = 0; i < value.length; i++) {
            var chr = value.charAt(i);
            var cCode = chr.charCodeAt(0);
            if ((fChr == '한글' && ((0xAC00 <= cCode && cCode <= 0xD7A3) || (0x3131 <= cCode && cCode <= 0x318E))) ||
                (fChr == '영문' && ((0x61 <= cCode && cCode <= 0x7A) || (0x41 <= cCode && cCode <= 0x5A))) ||
                (fChr == '숫자' && !isNaN(chr)) ) {
                return false;
            }
        }
        return true;
    }
});
/**
 * LFormatValidator format에 맞는 값인지를 체크하는 validator<br>
 * { id: 'col17', validExp:'Col17:true:format=abc'}
 * @namespace Rui.validate
 * @class LFormatValidator
 * @protected
 * @extends Rui.validate.LValidator
 * @constructor LFormatValidator
 * @param {string} id field id
 * @param {string} format 검사 포맷
 * @param {object} config label등 validator 속성
 */
Rui.validate.LFormatValidator = function(id, format, config){
    Rui.validate.LFormatValidator.superclass.constructor.call(this, id, config);
    this.format = format;
};
Rui.extend(Rui.validate.LFormatValidator, Rui.validate.LValidator, {
    otype: 'Rui.validate.LFormatValidator',
    validate: function(value) {
        if(Rui.isEmpty(value)) return true;
        if (value.length != this.format.length) {
            this.message = Rui.getMessageManager().get('$.base.msg024', [this.format]);
            return false;
        }
        var invalid = false;
        for (var i = 0; i < this.format.length; i++) {
            var chr = value.charAt(i);
            var cCode = value.charCodeAt(i);
            switch (this.format.charAt(i)) {
                case 'h':
                    if ((chr == ' ') ||
                    !((0xAC00 <= cCode && cCode <= 0xD7A3) || (0x3131 <= cCode && cCode <= 0x318E))) invalid = true;
                    break;
                    
                case 'H':
                    var cCode = value.charCodeAt(i);
                    if ((chr != ' ') &&
                    !((0xAC00 <= cCode && cCode <= 0xD7A3) || (0x3131 <= cCode && cCode <= 0x318E))) invalid = true;
                    break;
                    
                case '0':
                    if (isNaN(chr) || chr == ' ') invalid = true;
                    break;
                    
                case '9':
                    if (isNaN(chr)) {
                        if (chr != ' ') invalid = true;
                    }
                    break;
                    
                case 'A':
                    if ((chr == ' ') || !isNaN(chr)) invalid = true;
                    break;
                    
                case 'Z':
                    if ((chr != ' ') && !isNaN(chr)) invalid = true;
                    break;
                    
                case '#':
                    break;
                    
                default:
                    if (chr != this.format.charAt(i)) invalid = true;
            }
            if (invalid) {
                this.message = Rui.getMessageManager().get('$.base.msg024', [this.format]);
                return false;
            }
        }
    }
});
/**
 * Checkbox나 Radiobox의 필수 여부를 체크하는 validator<br>
 * { id: 'col18', validExp:'Col18:true:groupName=col8'}
 * @namespace Rui.validate
 * @class LGroupRequireValidator
 * @protected
 * @extends Rui.validate.LValidator
 * @constructor LGroupRequireValidator
 * @param {string} id field id
 * @param {string} groupName 그룹명
 * @param {object} config label등 validator 속성
 */
Rui.validate.LGroupRequireValidator = function(id, groupName, config){
    Rui.validate.LGroupRequireValidator.superclass.constructor.call(this, id, config);
    this.groupName = groupName;
    this.message = Rui.getMessageManager().get('$.base.msg039', [1]);
};
Rui.extend(Rui.validate.LGroupRequireValidator, Rui.validate.LValidator, {
    otype: 'Rui.validate.LGroupRequireValidator',
    validate: function(value) {
        if(Rui.select('input[name="' + this.groupName + '"]:checked').length == 0) return false;
        return true;
    }
});

/**
 * LInNumberValidator 범위안에 숫자가 존재하는지 체크하는 validator<br>
 * { id: 'col10', validExp:'Col10:true:inNumber=90~100'}
 * @namespace Rui.validate
 * @class LInNumberValidator
 * @protected
 * @extends Rui.validate.LValidator
 * @constructor LInNumberValidator
 * @param {string} id field id
 * @param {string} inNumber 숫자의 범위 (ex, '90~100')
 * @param {object} config label등 validator 속성
 */
Rui.validate.LInNumberValidator = function(id, inNumber, config){
    var index = inNumber.indexOf('~');
    this.minNumber = inNumber.substring(0, index);
    this.maxNumber = inNumber.substr(index+1);
    if (isNaN(this.minNumber) || isNaN(this.maxNumber)) throw new Rui.LException();
    Rui.validate.LInNumberValidator.superclass.constructor.call(this, id, config);
    this.minNumber = Number(this.minNumber);
    this.maxNumber = Number(this.maxNumber);
};
Rui.extend(Rui.validate.LInNumberValidator, Rui.validate.LValidator, {
    otype: 'Rui.validate.LInNumberValidator',
    validate: function(value) {
        if (isNaN(value)) {
            this.message = Rui.getMessageManager().get('$.base.msg005');
            return false;
        }
        value = Number(value);
        if (value < this.minNumber || value > this.maxNumber) {
            this.message = Rui.getMessageManager().get('$.base.msg004', [this.minNumber, this.maxNumber]);
            return false;
        }
        return true;
    }
});

/**
 * LLengthValidator 전체 글자의 길이를 체크하는 validator<br>
 * { id: 'col2', validExp:'Col2:true:length=4'}
 * @namespace Rui.validate
 * @class LLengthValidator
 * @protected
 * @extends Rui.validate.LValidator
 * @constructor LLengthValidator
 * @param {string} id field id
 * @param {int} length 검사할 문자의 길이
 * @param {object} config label등 validator 속성
 */
Rui.validate.LLengthValidator = function(id, length, config){
    Rui.validate.LLengthValidator.superclass.constructor.call(this, id, config);
    this.length = parseInt(length, 10);
    this.msgId = '$.base.msg003';
};
Rui.extend(Rui.validate.LLengthValidator, Rui.validate.LValidator, {
    otype: 'Rui.validate.LLengthValidator',
    validate: function(value) {
        if(Rui.isNull(value) || Rui.isUndefined(value)) return true;
        value += '';
        if (!this.checkCondition(value, this.length)) {
            this.message = Rui.getMessageManager().get(this.msgId, [this.length]);
            return false;
        }
        return true;
    },
    checkCondition: function (value, vValue) { return value.length == vValue; }
});
/**
 * LMinByteLengthValidator
 * @module validate
 * @title Validator
 * @requires Rui
 */
Rui.namespace('Rui.validate');

/**
 * LMinByteLengthValidator byte로 최소 길이를 체크하는 validator<br>
 * { id: 'col5', validExp:'Col5:true:minByteLength=8'}
 * @namespace Rui.validate
 * @class LMinByteLengthValidator
 * @protected
 * @extends Rui.validate.LValidator
 * @constructor LMinByteLengthValidator
 * @param {Object} oConfig The intial LMinByteLengthValidator.
 */
Rui.validate.LMinByteLengthValidator = function(id, length, oConfig){
    Rui.validate.LMinByteLengthValidator.superclass.constructor.call(this, id, oConfig);
    this.length = parseInt(length, 10);
    this.msgId = '$.base.msg030';
};

Rui.extend(Rui.validate.LMinByteLengthValidator, Rui.validate.LByteLengthValidator, {
    otype: 'Rui.validate.LMinByteLengthValidator',
    checkCondition: function (value, vValue) { return value >= vValue; }
});
/**
 * LMinDateValidator 최소 입력 날짜인지 확인하는 validator<br>
 * { id: 'col12', validExp:'Col12:true:minDate=2008/11/11(YYYY/MM/DD)'}
 * @namespace Rui.validate
 * @class LMinDateValidator
 * @protected
 * @extends Rui.validate.LValidator
 * @constructor LMinDateValidator
 * @param {string} id field id
 * @param {string} minDate 검사할 min date string (ex, '20081111' or '2008/11/11(YYYY/MM/DD)')
 * @param {object} config label등 validator 속성
 */
Rui.validate.LMinDateValidator = function(id, minDate, config){
    var index = minDate.indexOf('(');
    this.format = 'YYYYMMDD';
    this.minDate = minDate;
    if (index != -1) {
        this.minDate = minDate.substring(0, index);
        this.format = minDate.substring(index + 1, minDate.length - 1);
    }
    if (!(new Rui.validate.LDateValidator(id, this.format).validate(this.minDate))) throw new Rui.LException();
    Rui.validate.LMinDateValidator.superclass.constructor.call(this, id, config);
    this.msgId = '$.base.msg022';
};
Rui.extend(Rui.validate.LMinDateValidator, Rui.validate.LValidator, {
    otype: 'Rui.validate.LMinDateValidator',
    validate: function(value) {
        if(Rui.isEmpty(value)) return true;
        if (!(new Rui.validate.LDateValidator(this.id, this.format).validate(value))) {
            this.message = Rui.getMessageManager().get(this.msgId);
            return false;
        }
        var LS = Rui.util.LString;
        if(value instanceof Date) value = value.getFullYear() + LS.lPad(value.getMonth() + 1, '0', 2) + LS.lPad(value.getDate(), '0', 2);
        if (!this.checkCondition(value, this.minDate)) {
            var msgParams = new Array(4);
            msgParams[0] = this.minDate.substring(0,4);
            msgParams[1] = this.minDate.substring(4,5) == '0' ? this.minDate.substring(5,6) : this.minDate.substring(4,6);
            msgParams[2] = this.minDate.substring(6,7) == '0' ? this.minDate.substring(7,8) : this.minDate.substring(6,8);
            this.message = Rui.getMessageManager().get(this.msgId, msgParams);
            return false;
        }
        return true;
    },
    checkCondition: function (value, vValue) { return (value >= vValue); }
});

/**
 * LMinLengthValidator
 * @module validate
 * @title Validator
 * @requires Rui
 */
Rui.namespace('Rui.validate');

/**
 * LMinLengthValidator 최소 길이를 확인하는 validator<br>
 * { id: 'col3', validExp:'Col3:true:minLength=6'}
 * @namespace Rui.validate
 * @class LMinLengthValidator
 * @protected
 * @extends Rui.validate.LValidator
 * @constructor LMinLengthValidator
 * @param {string} id field id
 * @param {int} minLength 검사할 min length
 * @param {object} config label등 validator 속성
 */
Rui.validate.LMinLengthValidator = function(id, minLength, config){
    Rui.validate.LMinLengthValidator.superclass.constructor.call(this, id, config);
    this.length = parseInt(minLength, 10);
    this.msgId = '$.base.msg009';
};
Rui.extend(Rui.validate.LMinLengthValidator, Rui.validate.LValidator, {
    otype: 'Rui.validate.LMinLengthValidator',
    validate: function(value) {
        if(Rui.isNull(value) || Rui.isUndefined(value)) return true;
        value += '';
        if (!this.checkCondition(value, this.length)) {
            this.message = Rui.getMessageManager().get(this.msgId, [this.length]);
            return false;
        }
        return true;
    },
    checkCondition: function (value, length) { return value.length >= length; }
});
/**
 * LMinNumberValidator 최소 숫자를 확인하는 validator<br>
 * { id: 'col8', validExp:'Col8:true:minNumber=100'}
 * @namespace Rui.validate
 * @class LMinNumberValidator
 * @protected
 * @extends Rui.validate.LValidator
 * @constructor LMinNumberValidator
 * @param {string} id field id
 * @param {int} minNumber 검사할 min number
 * @param {object} config label등 validator 속성
 */
Rui.validate.LMinNumberValidator = function(id, minNumber, config){
    if (isNaN(minNumber)) throw new Rui.LException();
    Rui.validate.LMinNumberValidator.superclass.constructor.call(this, id, config);
    this.minNumber = Number(minNumber);
};

Rui.extend(Rui.validate.LMinNumberValidator, Rui.validate.LValidator, {
    otype: 'Rui.validate.LMinNumberValidator',
    validate: function(value) {
        if (isNaN(value)) {
            this.message = Rui.getMessageManager().get('$.base.msg005');
            return false;
        }
        this.minNumber = Number(this.minNumber);
        value = Number(value);
        if (value < this.minNumber) {
            this.message = Rui.getMessageManager().get('$.base.msg011', [this.minNumber]);
            return false;
        }
        return true;
    }
});

/**
 * LMaxByteLengthValidator byte로 최대 길이를 체크하는 validator<br>
 * { id: 'col5', validExp:'Col5:true:maxByteLength=8'}
 * @namespace Rui.validate
 * @class LMaxByteLengthValidator
 * @protected
 * @extends Rui.validate.LValidator
 * @constructor LMaxByteLengthValidator
 * @param {string} id field id
 * @param {int} length 검사할 문자의 byte 길이
 * @param {object} config label등 validator 속성
 */
Rui.validate.LMaxByteLengthValidator = function(id, length, config){
    Rui.validate.LMaxByteLengthValidator.superclass.constructor.call(this, id, length, config);
    this.msgId = '$.base.msg031';
};
Rui.extend(Rui.validate.LMaxByteLengthValidator, Rui.validate.LByteLengthValidator, {
    otype: 'Rui.validate.LMaxByteLengthValidator',
    checkCondition: function (value, vValue) { return value <= vValue; }
});
/**
 * LMaxDateValidator 기준 날짜를 초과하는지 체크하는 validator<br>
 * { id: 'col13', validExp:'Col13:true:maxDate=20081111'}
 * @namespace Rui.validate
 * @class LMaxDateValidator
 * @protected
 * @extends Rui.validate.LValidator
 * @constructor LMaxDateValidator
 * @param {string} id field id
 * @param {string} maxDate 검사할 max date string (ex, '20081111' or '2008/11/11(YYYY/MM/DD)')
 * @param {object} config label등 validator 속성
 */
Rui.validate.LMaxDateValidator = function(id, maxDate, config){
    Rui.validate.LMaxDateValidator.superclass.constructor.call(this, id, maxDate, config);
    this.msgId = '$.base.msg023';
};
Rui.extend(Rui.validate.LMaxDateValidator, Rui.validate.LMinDateValidator, {
    otype: 'Rui.validate.LMaxDateValidator',
    checkCondition: function (value, vValue) { return (value <= vValue); }
});

/**
 * LMaxLengthValidator 최대 길이를 초과하는지 체크하는 validator<br>
 * { id: 'col3', validExp:'Col3:true:maxLength=6'}
 * @namespace Rui.validate
 * @class LMaxLengthValidator
 * @protected
 * @extends Rui.validate.LValidator
 * @constructor LMaxLengthValidator
 * @param {string} id field id
 * @param {int} maxLength 검사할 max length
 * @param {object} config label등 validator 속성
 */
Rui.validate.LMaxLengthValidator = function(id, maxLength, config){
    Rui.validate.LMaxLengthValidator.superclass.constructor.call(this, id, maxLength, config);
    this.msgId = '$.base.msg010';
    this.length = parseInt(maxLength, 10);
};
Rui.extend(Rui.validate.LMaxLengthValidator, Rui.validate.LValidator, {
    otype: 'Rui.validate.LMaxLengthValidator',
    validate: function(value) {
        if(Rui.isNull(value) || Rui.isUndefined(value)) return true;
        value += '';
        if (!this.checkCondition(value, this.length)) {
            this.message = Rui.getMessageManager().get(this.msgId, [this.length]);
            return false;
        }
        return true;
    },
    checkCondition: function (value, length) { return (value+'').length <= length; }
});
/**
 * LMaxNumberValidator 최대 숫자를 초과하는지 체크하는 validator<br>
 * { id: 'col9', validExp:'Col9:true:maxNumber=100'}
 * @namespace Rui.validate
 * @class LMaxNumberValidator
 * @protected
 * @extends Rui.validate.LValidator
 * @constructor LMaxNumberValidator
 * @param {string} id field id
 * @param {int} maxNumber 검사할 max number
 * @param {object} config label등 validator 속성
 */
Rui.validate.LMaxNumberValidator = function(id, maxNumber, oConfig){
    if (isNaN(maxNumber)) throw new Rui.LException();
    Rui.validate.LMaxNumberValidator.superclass.constructor.call(this, id, oConfig);
    this.maxNumber = Number(maxNumber);
};
Rui.extend(Rui.validate.LMaxNumberValidator, Rui.validate.LValidator, {
    otype: 'Rui.validate.LMaxNumberValidator',
    validate: function(value) {
        if (isNaN(value)) {
            this.message = Rui.getMessageManager().get('$.base.msg005');
            return false;
        }
        this.maxNumber = Number(this.maxNumber);
        value = Number(value);
        if (value > this.maxNumber) {
            this.message = Rui.getMessageManager().get('$.base.msg012', [this.maxNumber]);
            return false;
        }
        return true;
    }
});

/**
 * LNumberValidator
 * @module validate
 * @title Validator
 * @requires Rui
 */
Rui.namespace('Rui.validate');

/**
 * LNumberValidator 숫자 여부를 판단하는 validator<br>
 * { id: 'col6', validExp:'Col6:true:number'}
 * @namespace Rui.validate
 * @class LNumberValidator
 * @protected
 * @extends Rui.validate.LValidator
 * @constructor LNumberValidator
 * @param {string} id field id
 * @param {string} format 검사할 숫자 포맷, 소숫점 포함 여부 등
 * @param {object} config label등 validator 속성
 */
Rui.validate.LNumberValidator = function(id, format, config){
    Rui.validate.LNumberValidator.superclass.constructor.call(this, id, config);
    if (!format) return;
    var r = format.match(Rui.validate.LNumberValidator.re);
    if (r) {
        this.iLength = Number(r[1]);
        this.dLength = Number(r[2]);
    } else {
        this.iLength = null;
        this.dLength = null;
    }
};
Rui.extend(Rui.validate.LNumberValidator, Rui.validate.LValidator, {
    otype: 'Rui.validate.LNumberValidator',
    validate: function(value) {
        if (isNaN(value)) {
            this.message = Rui.getMessageManager().get('$.base.msg005');
            return false;
        }
        
        try{
            parseFloat(value);
            if(String(value).length > 0 && String(value).indexOf('-') > 0)
                throw new Error();
        }catch(e) {
            this.message = Rui.getMessageManager().get('$.base.msg005');
            return false;
        }
        
        if (Rui.isNull(this.iLength) || Rui.isUndefined(this.iLength)) return true;
        
        var strValue = String(value);
        var idx = strValue.indexOf('.');
        if (idx == -1) {
            this.message = Rui.getMessageManager().get('$.base.msg036', [this.dLength]);
            return false;
        }
        var iNumStr = strValue.substr(0, idx);
        var dNumStr = strValue.substr(idx + 1);
        if (iNumStr.length > this.iLength) {
            this.message = Rui.getMessageManager().get('$.base.msg035', [this.iLength]);
            return false;
        } else  if (dNumStr.length != this.dLength) {
            this.message = Rui.getMessageManager().get('$.base.msg036', [this.dLength]);
            return false;
        }
        
        return true;
    }
});
Rui.validate.LNumberValidator.re = /\s*(\d+)\s*.\s*(\d+)\s*/;
/**
 * LSsnValidator 주민번호인지 체크하는 validator
 * @namespace Rui.validate
 * @class LSsnValidator
 * @protected
 * @extends Rui.validate.LValidator
 * @constructor LSsnValidator
 * @param {string} id field id
 * @param {object} config label등 validator 속성
 */
Rui.validate.LSsnValidator = function(id, config){
    Rui.validate.LSsnValidator.superclass.constructor.call(this, id, config);
};
Rui.extend(Rui.validate.LSsnValidator, Rui.validate.LValidator, {
    otype: 'Rui.validate.LSsnValidator',
    validate: function(value) {
        if(Rui.isEmpty(value)) return true;
        if ( !value || (value+'').length != 13 || isNaN(value) )  {
            this.message = Rui.getMessageManager().get('$.base.msg014');
            return false;
        }
        value += '';
        
        var jNum1 = value.substr(0, 6);
        var jNum2 = value.substr(6);
    
        /* ----------------------------------------------------------------
           잘못된 생년월일을 검사합니다.
           2000년도부터 성구별 번호가 바뀌였슴으로 구별수가 2보다 작다면
           1900년도 생이되고 2보다 크다면 2000년도 이상생이 됩니다. 
           단 1800년도 생은 계산에서 제외합니다.
        ---------------------------------------------------------------- */
        
        bYear = (jNum2.charAt(0) <= '2') ? '19' : '20';
    
        // 주민번호의 앞에서 2자리를 이어서 4자리의 생년을 저장합니다.
        bYear += jNum1.substr(0, 2);
    
        // 달을 구합니다. 1을 뺀것은 자바스크립트에서는 1월을 0으로 표기하기 때문입니다.
        bMonth = jNum1.substr(2, 2) - 1;
    
        bDate = jNum1.substr(4, 2);
    
        bSum = new Date(bYear, bMonth, bDate);
    
        // 생년월일의 타당성을 검사하여 거짓이 있을시 에러메세지를 나타냄
        if ( bSum.getYear() % 100 != jNum1.substr(0, 2) || bSum.getMonth() != bMonth || bSum.getDate() != bDate) {
            this.message = Rui.getMessageManager().get('$.base.msg014');
            return false;
        }

        total = 0;
        temp = new Array(13);
        
        for (var i = 1; i <= 6; i++) 
            temp[i] = jNum1.charAt(i-1);
            
        for (var i = 7; i <= 13; i++)
            temp[i] = jNum2.charAt(i-7);
            
        for (var i = 1; i <= 12; i++) {
            k = i + 1;
            // 각 수와 곱할 수를 뽑아냅니다. 곱수가 만일 10보다 크거나 같다면 계산식에 의해 2로 다시 시작하게 됩니다.
            if(k >= 10) k = k % 10 + 2;
            // 각 자리수와 계산수를 곱한값을 변수 total에 누적합산시킵니다.
            total = total + (temp[i] * k);
        }
        // 마지막 계산식을 변수 last_num에 대입합니다.
        last_num = (11- (total % 11)) % 10;
        // laster_num이 주민번호의마지막수와 같은면 참을 틀리면 거짓을 반환합니다.
        if(last_num != temp[13]) {
            this.message = Rui.getMessageManager().get('$.base.msg014');
            return false;
        }
        return true;
    }
});
/**
 * LTagValidator
 * @namespace Rui.validate
 * @class LTagValidator
 * @protected
 * @extends Rui.validate.LValidator
 * @constructor LTagValidator
 * @param {string} id field id
 * @param {array} expr 검사할 표현식
 * @param {object} config label등 validator 속성
 */
Rui.validate.LTagValidator = function(id, expr, oConfig){
    Rui.validate.LTagValidator.superclass.constructor.call(this, id, oConfig);
    this.exprs = expr || ['\\a', '\\n', "-/[@]\='"];
    this.message = "영문, 숫자, -/[@]\=' 만 입력이 가능합니다. ";
};
Rui.extend(Rui.validate.LTagValidator, Rui.validate.LValidator, {
    otype: 'Rui.validate.LTagValidator',
    validate: function(value) {
        for (var i = 0; i < value.length; i++) {
            var chr = value.charAt(i);
            var cCode = chr.charCodeAt(0);
            if((0x61 <= cCode && cCode <= 0x7A) || (0x41 <= cCode && cCode <= 0x5A)) {
                if(Rui.util.LArray.indexOf(this.exprs, '\\a') == -1) return false;
            } else if(!isNaN(chr)) {
                if(Rui.util.LArray.indexOf(this.exprs, '\\n') == -1) return false;
            } else {
                var isValid = false;
                for (var j = 0 ; j < this.exprs.length; j++) {
                    if(this.exprs[j] == '\\h' || this.exprs[j] == '\\a' || this.exprs[j] == '\\n') continue;
                    isValid = true;
                    if(this.exprs[j].indexOf(chr) < 0) {
                        isValid = false;
                        break;
                    }
                }
                if(isValid == false) return false;
            }
        }
        return true;
    }
});