/*
 * @(#) rui_validate.js
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

Rui.namespace('Rui.validate');
Rui.validate.LValidator = function(id, config){
    config = config || {};
    Rui.applyObject(this, config, true);
    this.id = id;
};
Rui.validate.LValidator.prototype = {
    id: null,
    itemName: null,
    fn: null,
    otype: 'Rui.util.LValidator',
    validate: function(value) {
        return true;
    },
    toString: function() {
        return (this.otype || 'Rui.validate.LValidator') + ' ' + this.id;
    }
};
Rui.validate.LValidatorManager = function(config){
    var config = config || {};
    this.selector = config.selector || 'input,select,textarea';
    this.validators = new Rui.util.LCollection();
    if(config.validators)
        this.parse(config.validators);
};
Rui.validate.LValidatorManager.prototype = {
    validators: null,
    invalidList: null,
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
                if (Rui.isNull(sArr[0])) throw new Rui.LException(label+' : '+Rui.getMessageManager().get('$.base.msg050', vExps[i]));
                if (sArr.length>1 && Rui.util.LString.trim(sArr[1]) == '') throw new Rui.LException(label+' : '+Rui.getMessageManager().get('$.base.msg050', vExps[i]));
                var firstUpperCase = Rui.util.LString.firstUpperCase(sArr[0]);
                if (!Rui.validate['L'+firstUpperCase+'Validator']) throw new Rui.LException(label+' : '+Rui.getMessageManager().get('$.base.msg051', vExps[i]));
                try {
                    var validatorObj = null;
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
    add: function(id, validator) {
        this.validators.add(id, validator);
        return this;
    },
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
                    if(message != _message) itemMessageList = itemMessageList.concat(message);
                    _message = message;
                }
            }
        }, this);
        this.messageList = itemMessageList;
        return isValid;
    },
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
    getValidatorList: function(id) {
        var validatorList = [];
        for (var i = 0; i < this.validators.length ; i++) {
            var item = this.validators.getAt(i);
            if(id == item.id)
                validatorList.push(item);
        };
        return validatorList;
    },
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
    getInvalidList: function() {
        return this.invalidList;
    },
    getMessageList: function() {
        return this.messageList;
    },
    toString: function() {
        return 'Rui.validate.LValidatorManager ' + this.id;
    }
};
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
Rui.validate.LAllowValidator = function(id, allowExpr, config){
    Rui.validate.LAllowValidator.superclass.constructor.call(this, id, config);
    this.exprs = Rui.util.LString.advancedSplit(allowExpr, ";", "i");
    this.msgId = '$.base.msg038';
    var msgFStr = allowExpr.split(';');
    for (var i = 0; i < msgFStr.length; i++) {
        if (msgFStr[i] == "\\h" || msgFStr[i] == "\h") { 
            msgFStr[i] = Rui.getMessageManager().get('$.core.kor'); 
        } else if(msgFStr[i] == "\\a" || msgFStr[i] == "\a") {
            msgFStr[i] = Rui.getMessageManager().get('$.core.eng'); 
        } else if(msgFStr[i] == "\\n" || msgFStr[i] == "\n") {
            msgFStr[i] = Rui.getMessageManager().get('$.core.num'); 
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
                byteLength += 3;        
            } else if (c.indexOf('%') != -1)  {  
                byteLength += c.length/3;                
            }
        }
        return byteLength;   
    },
    checkCondition: function (value, vValue) { return value == vValue; }
});
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
Rui.namespace('Rui.validate');
Rui.validate.LMinByteLengthValidator = function(id, length, oConfig){
    Rui.validate.LMinByteLengthValidator.superclass.constructor.call(this, id, oConfig);
    this.length = parseInt(length, 10);
    this.msgId = '$.base.msg030';
};
Rui.extend(Rui.validate.LMinByteLengthValidator, Rui.validate.LByteLengthValidator, {
    otype: 'Rui.validate.LMinByteLengthValidator',
    checkCondition: function (value, vValue) { return value >= vValue; }
});
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
Rui.namespace('Rui.validate');
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
Rui.validate.LMaxByteLengthValidator = function(id, length, config){
    Rui.validate.LMaxByteLengthValidator.superclass.constructor.call(this, id, length, config);
    this.msgId = '$.base.msg031';
};
Rui.extend(Rui.validate.LMaxByteLengthValidator, Rui.validate.LByteLengthValidator, {
    otype: 'Rui.validate.LMaxByteLengthValidator',
    checkCondition: function (value, vValue) { return value <= vValue; }
});
Rui.validate.LMaxDateValidator = function(id, maxDate, config){
    Rui.validate.LMaxDateValidator.superclass.constructor.call(this, id, maxDate, config);
    this.msgId = '$.base.msg023';
};
Rui.extend(Rui.validate.LMaxDateValidator, Rui.validate.LMinDateValidator, {
    otype: 'Rui.validate.LMaxDateValidator',
    checkCondition: function (value, vValue) { return (value <= vValue); }
});
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
Rui.namespace('Rui.validate');
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
        bYear = (jNum2.charAt(0) <= '2') ? '19' : '20';
        bYear += jNum1.substr(0, 2);
        bMonth = jNum1.substr(2, 2) - 1;
        bDate = jNum1.substr(4, 2);
        bSum = new Date(bYear, bMonth, bDate);
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
            if(k >= 10) k = k % 10 + 2;
            total = total + (temp[i] * k);
        }
        last_num = (11- (total % 11)) % 10;
        if(last_num != temp[13]) {
            this.message = Rui.getMessageManager().get('$.base.msg014');
            return false;
        }
        return true;
    }
});
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