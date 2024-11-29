/*
 * @(#) rui_form-debug.js
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
/**
 * LField 객체는 form 입력 객체들을 추상 클래스
 * @module ui_form
 * @title Field
 * @requires Rui
 */
Rui.namespace('Rui.ui.form');
/**
 * LField 객체는 form 입력 객체들을 추상 클래스
 * @namespace Rui.ui.form
 * @class LField
 * @extends Rui.ui.LUIComponent
 * @constructor LField
 * @param {HTMLElement | String} id The html element that represents the Element.
 * @param {Object} config The intial Field.
 */
Rui.ui.form.LField = function(config){
    Rui.ui.form.LField.superclass.constructor.call(this, config);
    /**
     * @description changed 메소드가 호출되면 수행하는 이벤트
     * @event changed
     * @sample default
     */
    this.createEvent('changed');
    /**
     * @description valid 메소드가 호출되면 수행하는 이벤트
     * @event valid
     * @sample default
     */
    this.createEvent('valid');
    /**
     * @description invalid 메소드가 호출되면 수행하는 이벤트
     * @event invalid
     * @sample default
     */
    this.createEvent('invalid');
    /**
     * @description specialkey 메소드가 호출되면 수행하는 이벤트
     * @event specialkey
     * @sample default
     * @param {Object} e window event 객체
     */
    this.createEvent('specialkey');
};

Rui.extend(Rui.ui.form.LField, Rui.ui.LUIComponent, {
    otype: 'Rui.ui.form.LField',
    /**
     * @description field 객체 여부
     * @property fieldObject
     * @private
     * @type {boolean}
     */
    fieldObject: true,
    /**
     * @description field의 name으로 input, select태그들의 name 속성 값
     * @config name
     * @sample default
     * @type {String}
     * @default null
     */
    /**
     * @description field의 name
     * @property name
     * @private
     * @type {String}
     */
    name: null,
    /**
     * @description field 객체의 el에 CSS로 지정된 border size
     * 기본값은 1이며 CSS에서 border width를 변경할 경우 이 값도 동일하게 변경하여야 합니다.
     * @config borderWidth
     * @type {int}
     * @default 1
     */
    /**
     * @description field 객체의 el에 CSS로 지정된 border size
     * 기본값은 1이며 CSS에서 border width를 변경할 경우 이 값도 동일하게 변경하여야 합니다.
     * @property borderWidth
     * @private
     * @type {int}
     */
    borderSize: 1,
    /**
     * @description blur시 contains 체크를 할지 여부
     * @property checkContainBlur
     * @private
     * @type {boolean}
     */
    checkContainBlur: false,
    /**
     * @description 객체를 Config정보를 초기화하는 메소드
     * @method initDefaultConfig
     * @protected
     * @return {void}
     */
    initDefaultConfig: function() {
        Rui.ui.form.LField.superclass.initDefaultConfig.call(this);
        this.cfg.addProperty('editable', {
            handler: this._setEditable,
            value: this.editable,
            validator: Rui.isBoolean
        });
        this.cfg.addProperty('defaultValue', {
            handler: this._setDefaultValue,
            value: this.value
        });
    },
    /**
     * @description Field 객체 컨테이너 el의 content width를 반환한다.
     * @method getContentWidth
     * @protected
     * @return {void}
     */
    getContentWidth: function(){
        var w = this.el.getWidth(true);
        return w < 1 ? this.width - (this.borderSize * 2) : w;
    },
    /**
     * @description Field 객체 컨테이너 el의 content height을 반환한다.
     * @method getContentHeight
     * @protected
     * @return {void}
     */
    getContentHeight: function(){
        var h = this.el.getHeight(true);
        return h < 1 ? this.height - (this.borderSize * 2) : h;
    },
    /**
     * @description Dom객체의 value값을 저장한다.
     * @method setValue
     * @param {Object} value 저장할 결과값
     * @return {void}
     */
    setValue: function(o) {
        this.el.setValue(o);
    },
    /**
     * @description Dom객체의 value값을 리턴한다.
     * @method getValue
     * @return {Object} 객체에 들어 있는 값
     */
    getValue: function() {
        return this.el.getValue();
    },
    /**
     * @description 객체를 유효한 상태로 설정하는 메소드
     * @method valid
     * @public
     * @return {void}
     */
    valid: function(){
        this.el.valid();
        this.fireEvent('valid');
        return this;
    },
    /**
     * @description 객체를 유효하지 않은 상태로 설정하는 메소드
     * @method invalid
     * @public
     * @return {void}
     */
    invalid: function(message) {
        this.el.invalid(message);
        this.fireEvent('invalid', message);
        return this;
    },
    /**
     * @description 이름을 셋팅하는 메소드
     * @method setName
     * @param {String} name 이름
     * @return {void}
     */
    setName: function(name) {
        this.name = name;
    },
    /**
     * @description 이름을 리턴하는 메소드
     * @method getName
     * @return {String}
     */
    getName: function() {
        return this.name;
    },
    /**
     * @description editable 값을 셋팅하는 메소드
     * <p>Sample: <a href="./../sample/general/ui/form/textboxSample.html" target="_sample">보기</a></p>
     * @method setEditable
     * @public
     * @param {boolean} isEditable editable 셋팅 값
     * @return {void}
     */
    setEditable: function(isEditable) {
        this.cfg.setProperty('editable', this.disabled === true ? false : isEditable);
    },
    /**
     * @description editable 속성에 따른 실제 적용 메소드
     * @method _setEditable
     * @protected
     * @param {String} type 속성의 이름
     * @param {Array} args 속성의 값 배열
     * @param {Object} obj 적용된 객체
     * @return {void}
     */
    _setEditable: function(type, args, obj) {
        this.editable = !!args[0];
    },
    /**
     * @description defaultValue 속성에 따른 실제 적용 메소드
     * @method _setDefaultValue
     * @protected
     * @param {String} type 속성의 이름
     * @param {Array} args 속성의 값 배열
     * @param {Object} obj 적용된 객체
     * @return {void}
     */
    _setDefaultValue: function(type, args, obj) {
    	this.setValue(args[0]);
    },
    /**
     * @description 키 입력시 호출되는 이벤트 메소드
     * @method onFireKey
     * @private
     * @param {Object} e Event 객체
     * @return {void}
     */
    onFireKey: function(e){
        if(Rui.util.LEvent.isSpecialKey(e))
            this.fireEvent('specialkey', e);
    },
    /**
     * @description 객체의 toString
     * @method toString
     * @public
     * @return {String}
     */
    toString: function() {
        return (this.otype || 'Rui.ui.form.LField ') + ' ' + this.id;
    }
});

/**
 * LTextBox
 * @module ui_form
 * @title LTextBox
 * @requires Rui
 */
Rui.namespace('Rui.ui.form');
(function(){
var Dom = Rui.util.LDom;
var KL = Rui.util.LKey;
var ST = Rui.util.LString;
var Ev = Rui.util.LEvent;
/**
 * 일반적인 텍스트를 생성하는 LTextBox 편집기
 * @namespace Rui.ui.form
 * @class LTextBox
 * @extends Rui.ui.form.LField
 * @constructor LTextBox
 * @sample default
 * @param {Object} config The intial LTextBox.
 */
Rui.ui.form.LTextBox = function(config){
    config = Rui.applyIf(config || {}, Rui.getConfig().getFirst('$.ext.textBox.defaultProperties'));
    var configDataSet = Rui.getConfig().getFirst('$.ext.textBox.dataSet');
    if(configDataSet){
        if(!config.displayField && configDataSet.displayField)
            config.displayField = configDataSet.displayField;
    }
    
    //this.displayField = config.displayField || Rui.getConfig().getFirst('$.ext.textBox.dataSet.displayField') || 'text';
    
    this.overflowCSS = Rui.browser.opera ? 'overflow' : 'overflowY';
    //this.onScrollDelegate = Rui.util.LFunction.createDelegate(this.onScroll, this);
    
    this.useDataSet = config.autoComplete === true ? true : this.useDataSet;
    if (this.useDataSet === true && config.dataSet) {
        // 아래에서 처리되는데 생성자 부분의 딜레마때문에 구현된 소스
        this.dataSet = config.dataSet;
        this.initDataSet();
        this.isLoad = true;
    }
    this.mask = config.mask || this.mask || null;
    if(this.mask) this.initMask();
    Rui.ui.form.LTextBox.superclass.constructor.call(this, config);
    if(this.mask) this.initMaskEvent();
    if(Rui.mobile.ios) this.mask = null;
    if(this.useDataSet === true) {
        if(Rui.isEmpty(this.dataSet) && Rui.isEmpty(config.dataSet)) {
            this.createDataSet();
        }
    }
    if (this.useDataSet === true) {
        if(this.dataSet) this.initDataSet();
        if(config.url) {
            this.dataSet.load({ url: config.url, params: config.params });
        }
    }
};

Rui.ui.form.LTextBox.ROW_RE = new RegExp('L-row-r([^\\s]+)', '');

Rui.extend(Rui.ui.form.LTextBox, Rui.ui.form.LField, {
    /**
     * @description 객체의 문자열
     * @property otype
     * @private
     * @type {String}
     */
    otype: 'Rui.ui.form.LTextBox',
    /**
     * @description 기본 CSS명
     * @property CSS_BASE
     * @private
     * @type {String}
     */
    CSS_BASE: 'L-textbox',
    /**
     * @description placeholder CSS명
     * @property CSS_PLACEHOLDER
     * @private
     * @type {String}
     */
    CSS_PLACEHOLDER: 'L-placeholder',
    /**
     * @description 자동완성기능 구현을 위해 실제의 값(value)과 화면에 출력되는 값(text)이 존재 하는데 그중 화면에 출력되는 값에 해댕하는 필드(Field)명
     * @config displayField
     * @sample default
     * @type {String}
     * @default 'text'
     */
    /**
     * @description 자동완성기능 구현을 위해 실제의 값(value)과 화면에 출력되는 값(text)이 존재 하는데 그중 화면에 출력되는 값에 해댕하는 필드(Field)명
     * @property displayField
     * @private
     * @type {String}
     */
    displayField: 'text',
    /**
     * @description input type의 종류를 설정한다. text, password, email, url 등.
     * @config type
     * @sample default
     * @type {String}
     * @default true
     */
    /**
     * @description input type의 종류를 설정한다. text, password, email, url 등.
     * @property type
     * @private
     * @type {String}
     */
    type: 'text',
    /**
     * @description input박스에 키 입력이 가능한지 여부, 변경이 불가능한 읽기 전용 속성은 LUIComponent에 있는 disabled로 처리
     * <p>Sample: <a href="./../sample/general/ui/form/textboxSample.html" target="_sample">보기</a></p>
     * @config editable
     * @sample default
     * @type {boolean}
     * @default true
     */
    /**
     * @description input박스에 키 입력이 가능한지 여부, 변경이 불가능한 읽기 전용 속성은 LUIComponent에 있는 disabled로 처리
     * @property editable
     * @private
     * @type {boolean}
     */
    editable: true,
    /**
     * @description 가로 길이
     * <p>Sample: <a href="./../sample/general/ui/form/textboxSample.html" target="_sample">보기</a></p>
     * @config width
     * @type {int}
     * @default 100
     */
    /**
     * @description 가로 길이
     * @property width
     * @private
     * @type {String}
     */
    width: 100,
    /**
     * @description 세로 길이
     * <p>Sample: <a href="./../sample/general/ui/form/textboxSample.html" target="_sample">보기</a></p>
     * @config height
     * @type {int}
     * @default -1
     */
    /**
     * @description 세로 길이
     * @property height
     * @private
     * @type {int}
     */
    height: -1,
    /**
     * @description 객체에 기본적으로 들어 있을 값을 설정한다.
     * <p>Sample: <a href="./../sample/general/ui/form/textboxSample.html" target="_sample">보기</a></p>
     * @config defaultValue
     * @sample default
     * @type {String}
     * @default ''
     */
    /**
     * @description 객체에 기본적으로 들어 있을 값을 설정한다.
     * @property defaultValue
     * @private
     * @type {String}
     */
    defaultValue: '',
    /**
     * @description 목록창의 가로 길이 (-1일 경우 width의 규칙을 따른다.)
     * <p>Sample: <a href="./../sample/general/ui/form/textboxSample.html" target="_sample">보기</a></p>
     * @config listWidth
     * @type {int}
     * @default -1
     */
    /**
     * @description 목록창의 가로 길이 (-1일 경우 width의 규칙을 따른다.)
     * @property listWidth
     * @private
     * @type {int}
     */
    listWidth: -1,
    /**
     * @description 기본 DataSet객체명, rui_config.js에 따라 적용된다.
     * @property dataSetClassName
     * @private
     * @type {String}
     */
    dataSetClassName: 'Rui.data.LJsonDataSet',
    /**
     * @description 자동완성기능을 처리할때 키 입력시 이미 로드된 메모리의 데이터로 처리할지 매번 서버에서 load할지를 결정
     * <p>Sample: <a href="./../sample/general/ui/form/textboxSample.html" target="_sample">보기</a></p>
     * @config filterMode
     * @type {String}
     * @default 'local'
     */
    /**
     * @description 자동완성기능을 처리할때 키 입력시 이미 로드된 메모리의 데이터로 처리할지 매번 서버에서 load할지를 결정
     * @property filterMode
     * @private
     * @type {String}
     */
    filterMode: 'local',
    /**
     * @description local filter시 delayTime값
     * <p>Sample: <a href="./../sample/general/ui/form/textboxSample.html" target="_sample">보기</a></p>
     * @config localDelayTime
     * @type {int}
     * @default 30
     */
    /**
     * @description local filter시 delayTime값
     * @property localDelayTime
     * @private
     * @type {int}
     */
    localDelayTime: 30,
    /**
     * @description remote filter시 delayTime값
     * <p>Sample: <a href="./../sample/general/ui/form/textboxSample.html" target="_sample">보기</a></p>
     * @config remoteDelayTime
     * @type {int}
     * @default 250
     */
    /**
     * @description remote filter시 delayTime값
     * @property remoteDelayTime
     * @private
     * @type {int}
     */
    remoteDelayTime: 250,
    /**
     * @description remote filter시 url값
     * <p>Sample: <a href="./../sample/general/ui/form/textboxSample.html" target="_sample">보기</a></p>
     * @config filterUrl
     * @type {String}
     * @default ''
     */
    /**
     * @description remote filter시 url값
     * <p>Sample: <a href="./../sample/general/ui/form/textboxSample.html" target="_sample">보기</a></p>
     * @property filterUrl
     * @private
     * @type {String}
     */
    filterUrl: '',
    /**
     * @description dataSet 사용 여부
     * <p>Sample: <a href="./../sample/general/ui/form/textboxSample.html" target="_sample">보기</a></p>
     * @config useDataSet
     * @type {boolean}
     * @default false
     */
    /**
     * @description dataSet 사용 여부
     * @property useDataSet
     * @private
     * @type {boolean}
     */
    useDataSet: false,
    /**
     * @description 자동 완성 기능 사용 여부
     * <p>Sample: <a href="./../sample/general/ui/form/textboxSample.html" target="_sample">보기</a></p>
     * @config autoComplete
     * @sample default
     * @type {boolean}
     * @default false
     */
    /**
     * @description 자동 완성 기능 사용 여부
     * @property autoComplete
     * @private
     * @type {boolean}
     */
    autoComplete: false,
    /**
     * @description 데이터 로딩시 combo의 row 위치
     * <p>Sample: <a href="./../sample/general/ui/form/comboSample.html" target="_sample">보기</a></p>
     * @config selectedIndex
     * @sample default
     * @type {int}
     * @default -1
     */
    /**
     * @description 데이터 로딩시 combo의 row 위치
     * @property selectedIndex
     * @private
     * @type {int}
     */
    selectedIndex: false,
    /**
     * @description 데이터 로딩되면 changed 이벤트가 발생할지 여부
     * @config firstChangedEvent
     * @type {int}
     * @default -1
     */
    /**
     * @description 데이터 로딩되면 changed 이벤트가 발생할지 여부
     * @property firstChangedEvent
     * @private
     * @type {int}
     */
    firstChangedEvent: true,
    /**
     * @description 자동 완성 기능을 정보를 가지는 dataSet
     * @config dataSet
     * @type {Rui.data.LDataSet}
     * @default null
     */
    /**
     * @description 자동 완성 기능을 정보를 가지는 dataSet
     * @property dataSet
     * @private
     * @type {Rui.data.LDataSet}
     */
    dataSet: null,
    /**
     * @description expand시 목록 div의 marginTop값
     * @property marginTop
     * @private
     * @type {int}
     */
    marginTop: 0,
    /**
     * @description expand시 목록 div의 marginLeft값
     * @property marginLeft
     * @private
     * @type {int}
     */
    marginLeft: 0,
    includeChars: null,
    /**
     * @description 입력문자열 형식 지정
     * <p>Sample: <a href="./../sample/general/ui/form/textboxSample.html" target="_sample">보기</a></p>
     * @config inputType
     * @type {Rui.util.LString.PATTERN_TYPE_NUMBER || Rui.util.LString.PATTERN_TYPE_NUMSTRING || Rui.util.LString.PATTERN_TYPE_STRING || Rui.util.LString.PATTERN_TYPE_KOREAN }
     * @default null
     */
    /**
     * @description 입력문자열 형식 지정
     * @property inputType
     * @protected
     * @type {Rui.util.LString.PATTERN_TYPE_NUMBER || Rui.util.LString.PATTERN_TYPE_NUMSTRING || Rui.util.LString.PATTERN_TYPE_STRING || Rui.util.LString.PATTERN_TYPE_KOREAN }
     */
    inputType: null,
    /**
     * @description 현재 입력상자 포커스 여부
     * @property currFocus
     * @private
     * @type {boolean}
     */
    currFocus: false,
    /**
     * @description ime-mode값
     * @config imeMode
     * @type {String}
     * @default auto
     */
    /**
     * @description ime-mode값
     * @property imeMode
     * @private
     * @type {String}
     */
    imeMode: 'auto',
    /**
     * @description 기본 '선택하세요.' 메시지 값을 설정한다.
     * <p>Sample: <a href="./../sample/general/ui/form/textboxSample.html" target="_sample">보기</a></p>
     * @config emptyText
     * @sample default
     * @type {String}
     * @default Choose a state
     */
    /**
     * @description 기본 '선택하세요.' 메시지 값을 설정한다.
     * @property emptyText
     * @private
     * @type {String}
     */
    emptyText: 'Choose a state',
    /**
     * @description 기본 선택 항목 추가 여부
     * <p>Sample: <a href="./../sample/general/ui/form/textboxSample.html" target="_sample">보기</a></p>
     * @config useEmptyText
     * @type {boolean}
     * @default false
     */
    /**
     * @description 기본 선택 항목 추가 여부
     * @property useEmptyText
     * @private
     * @type {boolean}
     */
    useEmptyText: false,
    /**
     * @description 값이 선택되어 있지 않을 경우 리턴시 값을 '' 공백 문자로 리턴할지 null로 리턴할지를 결정한다. 그리드의 데이터셋이 로딩후 연결된 콤보가 수정되지 않았는데도 수정된걸로 인식되면 null이나 undefined로 정의하여 맞춘다.
     * @config emptyValue
     * @type {Object}
     * @default ''
     */
    /**
     * @description 값이 선택되어 있지 않을 경우 리턴시 값을 '' 공백 문자로 리턴할지 null로 리턴할지를 결정한다. 그리드의 데이터셋이 로딩후 연결된 콤보가 수정되지 않았는데도 수정된걸로 인식되면 null이나 undefined로 정의하여 맞춘다.
     * @property emptyValue
     * @private
     * @type {Object}
     */
    emptyValue: '',
    /**
     * @description 키 입력 mask 적용를 적용한다.
     * @config mask
     * @sample default
     * @type {String}
     * @default null
     */
    /**
     * @description 키 입력 mask 적용를 적용한다.
     * @property mask
     * @private
     * @type {String}
     */
    mask: null,
    /**
     * @description getValue시 적용된 mask값으로 리턴할지 여부
     * @config maskValue
     * @type {boolean}
     * @default false
     */
    /**
     * @description 기본 선택 항목 추가 여부
     * mask가 적용된 값 111-11-111111
     * maskValue가 true 일경우 getValue()는 111-11-111111 값으로 리턴
     * maskValue가 false 일경우 getValue()는 11111111111 값으로 리턴
     * @property maskValue
     * @private
     * @type {boolean}
     */
    maskValue: false,
    /**
     * @description mask의 형식 정의
     * @config definitions
     * @type {String}
     * @default {
         '9': '[0-9]',
         'a': '[A-Za-z]',
         '*': '[A-Za-z0-9]'
     }
     */
    /**
     * @description mask의 형식 정의
     * @property definitions
     * @private
     * @type {String}
     */
    definitions: {
        '9': '[0-9]',
        'a': '[A-Za-z]',
        '*': '[A-Za-z0-9]'
    },
    /**
     * @description mask가 적용된 값 입력시에 나오는 문자
     * @config maskPlaceholder
     * @type {String}
     * @default '_'
     */
    /**
     * @description mask가 적용된 값 입력시에 나오는 문자
     * @property maskPlaceholder
     * @private
     * @type {String}
     */
    maskPlaceholder: '_',
    /**
     * @description html5에 있는 placeholder 기능
     * @config placeholder
     * @sample default
     * @type {String}
     * @default null
     */
    /**
     * @description html5에 있는 placeholder 기능
     * @property placeholder
     * @private
     * @type {String}
     */
    placeholder: null,
    /**
     * @description invalid focus 여부
     * @config invalidBlur
     * @type {boolean}
     * @default false
     */
    /**
     * @description invalid시 blur를 할 수 있을지 여부
     * @property invalidBlur
     * @private
     * @type {boolean}
     */
    invalidBlur: false,
    /**
     * @description filter시 function을 직접 지정해서 비교하여 처리하는 메소드
     * @config filterFn
     * @type {function}
     * @default null
     */
    /**
     * @description filter시 function을 직접 지정해서 비교하여 처리하는 메소드
     * @property filterFn
     * @private
     * @type {function}
     */
    filterFn: null,
    /**
     * @description option div 객체
     * @property optionDivEl
     * @private
     * @type {LElement}
     */
    optionDivEl: null,
    /**
     * @description 목록이 펼쳐질 경우 출력할 갯수
     * @config expandCount
     * @type {int}
     * @default 10
     */
    /**
     * @description 목록이 펼쳐질 경우 출력할 갯수
     * @property expandCount
     * @private
     * @type {int}
     */
    expandCount: 0,
    /**
     * @description Unicode값을 문자로 반환하기 위해 내장함수  String.FromChatCode를 사용할지 결정
     * @config stringFromChatCode
     * @type {boolean}
     * @default false
     */
     /**
     * @description Unicode값을 문자로 반환하기 위해 내장함수  String.FromChatCode를 사용할지 결정
     * @config stringFromChatCode
     * @type {boolean}
     * @default false
     */
    stringFromChatCode: false,
    /**
     * @description List item을 추가로 출력할 수 있게 렌더링 하는 평션
     * @config listRenderer
     * @type {Function}
     * @default null
     */
    /**
     * @description List item을 추가로 출력할 수 있게 렌더링 하는 평션
     * @property listRenderer
     * @private
     * @type {Function}
     */
    listRenderer: null,
    /**
     * @description LTextBox에서 사용하는 DataSet ID
     * @config dataSetId
     * @type {String}
     * @default 'dataSet'
     */
    /**
     * @description LTextBox에서 사용하는 DataSet ID
     * @property dataSetId
     * @private
     * @type {String}
     */
    dataSetId: null,
    /**
     * @description list picker의 펼쳐짐 방향 (auto|up|down)
     * @config listPosition
     * @type {String}
     * @default 'auto'
     */
     /**
     * @description list picker의 펼쳐짐 방향 (auto|up|down)
     * @property listPosition
     * @private
     * @type {String}
     */
    listPosition: 'auto',
    /**
     * @description regular expression for finding row
     * @property rowRe
     * @type {string}
     * @private
     */
    rowRe: new RegExp('L-row-r([^\\s]+)', ''),
    /**
     * @description Grid에서 TextBox가 사용중인 경우 focusDefaultValue 시점에는 changed 이벤트를 발생시키지 않는다.
     * 이벤트 버블링을 방지 하기 위한 조치
     * @property ignoreEvent
     * @type {boolean}
     * @private
     */
    ignoreEvent: true,
    /**
     * @description 객체의 이벤트 초기화 메소드
     * @method initEvents
     * @protected
     * @return {void}
     */
    initEvents: function() {
        Rui.ui.form.LTextBox.superclass.initEvents.call(this);

        /**
         * @description keydown 기능이 호출되면 수행하는 이벤트
         * @event keydown
         * @sample default
         */
        this.createEvent('keydown');
        /**
         * @description keyup 기능이 호출되면 수행하는 이벤트
         * @event keyup
         * @sample default
         */
        this.createEvent('keyup');
        /**
         * @description keypress 기능이 호출되면 수행하는 이벤트
         * @event keypress
         * @sample default
         */
        this.createEvent('keypress');
        /**
         * @description cut 기능이 호출되면 수행하는 이벤트
         * @event cut
         * @sample default
         */
        this.createEvent('cut');
        /**
         * @description copy 기능이 호출되면 수행하는 이벤트
         * @event copy
         * @sample default
         */
        this.createEvent('copy');
        /**
         * @description paste 기능이 호출되면 수행하는 이벤트
         * @event paste
         * @sample default
         */
        this.createEvent('paste');
        /**
         * @description expand 기능이 호출되면 수행하는 이벤트
         * @event expand
         * @sample default
         */
        this.createEvent('expand');
        /**
         * @description collapse 기능이 호출되면 수행하는 이벤트
         * @event collapse
         * @sample default
         */
        this.createEvent('collapse');
        /**
         * @description setValue 메소드가 호출되면 수행하는 이벤트
         * @event changed
         * @sample default
         * @param {Object} target this객체
         * @param {String} value code값
         * @param {String} displayValue displayValue값
         */
    },
    /**
     * @description 객체를 Config정보를 초기화하는 메소드
     * @method initDefaultConfig
     * @protected
     * @return {void}
     */
    initDefaultConfig: function() {
        Rui.ui.form.LTextBox.superclass.initDefaultConfig.call(this);
        this.cfg.addProperty('listWidth', {
                handler: this._setListWidth,
                value: this.listWidth,
                validator: Rui.isNumber
        });
        this.cfg.addProperty('useEmptyText', {
                handler: this._setAddEmptyText,
                value: this.useEmptyText,
                validator: Rui.isBoolean
        });
    },
    /**
     * @description element Dom객체 생성
     * @method createContainer
     * @protected
     * @param {HTMLElement} parentNode 부모 노드
     * @return {HTMLElement}
     */
    createContainer: function(parentNode){
        if(this.el) {
            this.oldDom = this.el.dom;
            if(this.el.dom.tagName == 'INPUT') {
                this.id = this.id || this.el.id;
                this.name = this.name || this.oldDom.name;
                var parent = this.el.parent();
                this.el = Rui.get(this.createElement().cloneNode(false));
                this.el.dom.id = this.id;
                Dom.replaceChild(this.el.dom, this.oldDom);
                this.el.appendChild(this.oldDom);
                Dom.removeNode(this.oldDom);
            }
            this.attrs = this.attrs || {};
            var items = this.oldDom.attributes;
            if(typeof items !== 'undefined'){
                if(Rui.browser.msie67){
                    //IE6, 7의 경우 DOMCollection의 value값들이 모두 문자열이다.
                    for (var i=0, len = items.length; i<len; i++){
                        var v = items[i].value;
                        if(v && v !== 'null' && v !== '')
                            this.attrs[items[i].name] = Rui.util.LObject.parseObject(v);
                    }
                }else
                    for (var i=0, len = items.length; i<len; i++)
                        this.attrs[items[i].name] = items[i].value;
            }
            delete this.attrs.id;
            //delete this.attrs.class;
            delete this.oldDom;
        }
        Rui.ui.form.LTextBox.superclass.createContainer.call(this, parentNode);
    },
    /**
     * @description render시 호출되는 메소드
     * @method doRender
     * @protected
     * @param {String|Object} parentNode 부모노드
     * @return {void}
     */
    doRender: function(){
        this.createTemplate(this.el);
        this.inputEl.dom.instance = this;
        this.inputEl.addClass('L-instance');
        if (Rui.useAccessibility()) this.el.setAttribute('role', 'textbox');
    },
    /**
     * @description Dom객체 생성
     * @method createTemplate
     * @protected
     * @param {String|Object} el 객체의 아이디나 객체
     * @return {Rui.LElement} Element 객체
     */
    createTemplate: function(el) {
        var elContainer = Rui.get(el);
        elContainer.addClass(this.CSS_BASE);
        elContainer.addClass('L-fixed');
        elContainer.addClass('L-form-field');

        var attrs = '';
        for (var key in this.attrs)
            attrs += ' ' + key + '="' + this.attrs[key] + '"';

        var autoComplete = '';
        if(this.autoComplete) autoComplete = ' autocomplete="off"';

        var input = Rui.createElements('<input type="' + this.type + '" ' + attrs + autoComplete + '>').getAt(0).dom;
        // if(this.attrs) for (var m in this.attrs) input[m] = this.attrs[m];
        input.id = Rui.useFixedId() ? Rui.id(this.el, 'LTextBox-' + this.id) : Rui.id();
        input.name = this.name || input.name || this.id;
        elContainer.appendChild(input);
        //input.type = this.type;
        this.inputEl = Rui.get(input);
        this.inputEl.addClass('L-display-field');
        return elContainer;
    },
    /**
     * @description render 후 호출하는 메소드
     * @method afterRender
     * @protected
     * @param {HttpElement} container 부모 객체
     * @return {String}
     */
    afterRender: function(container){
        Rui.ui.form.LTextBox.superclass.afterRender.call(this, container);
        var inputEl = this.getDisplayEl();
        inputEl.on('click', function(e) {
            if(this.editable != true){
                this.expand();
            }
        }, this, true);

        if(this.inputType != null)
            inputEl.on('keydown', this.onFilterKey, this, true);

        if(this.inputType != ST.PATTERN_TYPE_KOREAN){
            if(this.includeChars != null)
                this.imeMode = 'disabled';
            if(this.inputType != null)
                this.imeMode = 'disabled';
        }

        if(this.imeMode !== 'auto') inputEl.setStyle('ime-mode', this.imeMode);

        // TODO: keyup에 대해서 테스트 필요, 과거에서 keydown에 걸렸었음.
        if (this.useDataSet === true && this.autoComplete === true)
            inputEl.on('keyup', this.onKeyAutoComplete, this, true);

        if(Rui.browser.webkit || Rui.browser.msie || Rui.browser.chrome) inputEl.on('keydown', this.onSpecialkeyEvent, this, true);
        else inputEl.on('keypress', this.onSpecialkeyEvent, this, true);

        inputEl.on('keydown', this.onKeydown, this, true);
        inputEl.on('keyup', this.onKeyup, this, true);
        inputEl.on('keypress', this.onKeypress, this, true);

        var keyEventName = Rui.browser.msie || Rui.browser.chrome || (Rui.browser.safari && Rui.browser.version == 3) ? 'keydown' : 'keypress';
        inputEl.on(keyEventName, this.onFireKey, this, true);

        this.createOptionDiv();

        if (this.optionDivEl) {
            if(this.useDataSet === true && Rui.isEmpty(this.dataSet)) this.createDataSet();
            else this.doLoadDataSet();
        }
        this.initFocus();
        if(this.type != 'text') this.initType();

//        var labels = Rui.select('label[for='+this.id+']');
//        for (var i = 0, len = labels.length; i < len; i++){
//            labels.getAt(i).setAttribute('for', inputEl.dom.id).addClass('L-label');
//        }

        this.focusDefaultValue();
        this.setPlaceholder();
    },
    /**
     * @description create dataSet
     * @method createDataSet
     * @private
     * @return {void}
     */
    createDataSet: function() {
        if(!this.dataSet) {
            this.dataSet = new (eval(this.dataSetClassName))({
                id: this.dataSetId || (this.id + 'DataSet'),
                fields:[
                    {id:this.displayField}
                ],
                focusFirstRow: false
            });
        }
    },
    /**
     * @description type에 따른 기능 초기화
     * @method initType
     * @protected
     * @return {void}
     */
    initType: function() {
        if (this.type == 'url') {
            this.placeholder = 'http://';
            this.inputEl.on('focus', function(){
                if (this.inputEl.getValue() == '')
                    this.inputEl.setValue(this.placeholder);
            }, this, true);
        } else if(this.type == 'email') {
            this.placeholder = Rui.getMessageManager().get('$.base.msg111');
        }
    },
    /**
     * @description dataset을 초기화한다.
     * @method initDataSet
     * @protected
     * @return {void}
     */
    initDataSet: function() {
        this.doSyncDataSet();
    },
    /**
     * @description dataSet의 sync 적용 메소드
     * @method doSyncDataSet
     * @protected
     * @return {void}
     */
    doSyncDataSet: function() {
        if(this.isBindEvent !== true) {
            this.dataSet.on('beforeLoad', this.onBeforeLoadDataSet, this, true, { system: true } );
            this.dataSet.on('load', this.onLoadDataSet, this, true, { system: true } );
            this.dataSet.on('dataChanged', this.onDataChangedDataSet, this, true, { system: true } );
            this.dataSet.on('rowPosChanged', this.onRowPosChangedDataSet, this, true, { system: true } );
            this.dataSet.on('add', this.onAddData, this, true, { system: true } );
            this.dataSet.on('update', this.onUpdateData, this, true, { system: true } );
            this.dataSet.on('remove', this.onRemoveData, this, true, { system: true } );
            this.dataSet.on('undo', this.onUndoData, this, true, { system: true } );
            this.isBindEvent = true;
        }
    },
    /**
     * @description dataSet의 unsync 적용 메소드
     * @method doUnSyncDataSet
     * @protected
     * @return {void}
     */
    doUnSyncDataSet: function(){
        this.dataSet.unOn('beforeLoad', this.onBeforeLoadDataSet, this);
        this.dataSet.unOn('load', this.onLoadDataSet, this);
        this.dataSet.unOn('dataChanged', this.onDataChangedDataSet, this);
        this.dataSet.unOn('rowPosChanged', this.onRowPosChangedDataSet, this);
        this.dataSet.unOn('add', this.onAddData, this);
        this.dataSet.unOn('update', this.onUpdateData, this);
        this.dataSet.unOn('remove', this.onRemoveData, this);
        this.dataSet.unOn('undo', this.onUndoData, this);
        this.isBindEvent = false;
    },
    /**
     * @description container안의 content의 focus/blur 연결 설정
     * @method initFocus
     * @protected
     * @return {void}
     */
    initFocus: function() {
        var inputEl = this.getDisplayEl();
        if(inputEl) {
            inputEl.on('focus', this.onCheckFocus, this, true);
            inputEl.on('blur', this.checkBlur, this, true);
            /*
            if(!this.checkContainBlur) {
                inputEl.on('blur', this.onBlur, this, true);
            } else {
            	inputEl.on('blur', this.onCanBlur, this, true);
            }*/
        }
    },
    /**
     * @description config로 제공된 placeholder를 지정하고 필요할 때 placeholder를 표시한다.
     * <p>display field가 focus, blur되거나 값이 변경된 경우 이 메소드가 실행되어야 하며 
     * 이때 display field가 placeholder를 표시해야 할지 말지를 스스로 결정하여 출력한다.  </p>
     * <p>IE10과 그 이상의 버전과 Chrome, Safari, Firefox등의 HTML5 지원 브라우저의 경우 HTML5 placeholder를 사용한다.<br>
     * IE6~9의 경우 구현된 placeholder를 사용한다.<br>
     * <p>따라서 두 분류의 브라우저에 따라 동작이 서로 다르게 동작될 수 있다.</p>
     * @method setPlaceholder
     * @protected
     * @return {void}
     */
    setPlaceholder: function() {
        if(this.placeholder) {
            var displayEl = this.getDisplayEl();
            if(Rui.browser.msie6789 ){
                var value = displayEl.getValue();
                if(this.isFocus && this.editable === true){
                    if (this.placeholder && value === this.placeholder) {
                        displayEl.setValue('');
                    }
                    displayEl.removeClass(this.CSS_PLACEHOLDER);
                }else{
                    if((!value || value.length < 1) || (value === this.placeholder)){
                        displayEl.setValue(this.placeholder);
                        displayEl.addClass(this.CSS_PLACEHOLDER);
                    }else if(this.placeholder !== value){
                        displayEl.removeClass(this.CSS_PLACEHOLDER);
                    }
                }
            }else{
                this.getDisplayEl().dom.placeholder = this.placeholder;
            }
        }
    },
    /**
     * @description FilterKey 메소드
     * @method onFilterKey
     * @protected
     * @param {Object} e Event 객체
     * @return {void}
     */
    onFilterKey: function(e){
            if(this.inputType == null){ return; }
         var KEY = KL.KEY;
         if(e.keyCode != KEY.SPACE && (Ev.isSpecialKey(e) || e.keyCode == KEY.BACK_SPACE || e.keyCode == KEY.DELETE)) {return;}

         var c = e.charCode || e.which || e.keyCode;
         if(c == 229 && ((this.inputType == ST.PATTERN_TYPE_STRING || this.inputType == ST.PATTERN_TYPE_NUMSTRING ))){Ev.preventDefault(e); return;} // alt Key
         var charCode = (this.stringFromChatCode === false) ? this.fromCharCode(c) : String.fromCharCode(c);

         var pattern = this.inputType;
         if(this.includeChars == null){
            if(this.inputType == ST.PATTERN_TYPE_KOREAN){
                if(!ST.isHangul(charCode)){ Ev.preventDefault(e); return;}
             } else if(!pattern.test(charCode) ){ Ev.preventDefault(e); return;}
         }
         // Ctrl + A, C,V,X
         if( this.ctrlKeypress && (c == 65 || c == 67 || c== 86 || c == 88)){return;}
    },
    /**
     * @description FilterKey 메소드
     * @method fromCharCode
     * @protected
     * @param {Number} Key Input Value
     * @return {String} 문자반
     */
    fromCharCode: function(c) {
        if(c >= 96 && c <= 105) c -= 48;
        var charCode = String.fromCharCode(c);
        switch(c) {
            case 105:
                break;
            case 106:
                charCode = '*';
                break;
            case 107:
                charCode = '+';
                break;
            case 109:
                charCode = '-';
                break;
            case 110:
            case 190:
                charCode = '.';
                break;
            case 111:
                charCode = '/';
                break;
            case 188:
                charCode = ',';
                break;
            case 191:
                charCode = '/';
                break;
        }
        return charCode;
    },
    /**
     * @description focus 이벤트 발생시 호출되는 메소드
     * @method onFocus
     * @protected
     * @param {Object} e Event 객체
     * @return {void}
     */
    onFocus: function(e) {
        Rui.ui.form.LTextBox.superclass.onFocus.call(this, e);
        this.lastValue = this.getValue();
        this.lastDisplayValue = this.getDisplayValue();
        this.setPlaceholder();
        this.currFocus = true;
        this.doFocus(e);
    },
    /**
     * @description focus 이벤트 발생시 호출되는 메소드, design 관련
     * @method doFocus
     * @protected
     * @param {Object} e Event 객체
     * @return {void}
     */
    doFocus: function(e){
    	// webkit 타임머때문에 브라우저가 느리면 화면이 왔다갔다  한다
    	return;
    	if(Rui.platform.isMobile) return;
        var byteLength = ST.getByteLength(this.getDisplayEl().dom.value);
        if(byteLength > 0){
            if(Rui.browser.webkit)
                Rui.later(85, this, function(){
                    this.setSelectionRange(0, byteLength);
                });
            else
                this.setSelectionRange(0, byteLength);
        }
    },
    /**
     * @description textbox의 값의 selectionRange를 설정한다.
     * @method setSelectionRange
     * @protected
     * @param {int} start 시작위치
     * @param {int} end 종료위치
     * @return {void}
     */
    setSelectionRange: function(start, end) {
        if(this.currFocus) Dom.setSelectionRange(this.getDisplayEl().dom, start, end);
    },
    /**
     * @description blur 이벤트 발생시 blur상태 설정
     * @method checkBlur
     * @protected
     * @param {Object} e Event 객체
     * @return {void}
     */
    checkBlur: function(e) {
        if(!this.isFocus) return;
        if(this.gridPanel && e.deferCancelBubble == true) return;
        var target = e.target;
        if(this.iconEl && this.iconEl.dom == target) return;
        if(this.el.dom === target) return;

        var isBlur = false;
        if(Rui.isUndefined(this.optionDivEl)) {
            if(!this.el.isAncestor(target)) {
            	isBlur = true;
            }
        } else {
            if(this.el.isAncestor(target) == false) {
                if(this.optionDivEl) {
                    if((this.optionDivEl.dom !== target && !this.optionDivEl.isAncestor(target))) isBlur = true;
                } else isBlur = true;
            }
        }
        if(this.checkContainBlur == false || isBlur == true) {
            if(this.onCanBlur(e) === false) {
                //this.focus();
                this.setValue(this.lastValue||'', true);
                return;
            }
            //Rui.util.LEvent.stopEvent(e);
            Ev.removeListener(Rui.browser.msie ? document.body : document, 'mousedown', this.deferOnBlur);
            this.onBlur.call(this, e);
        } else {
            e.deferCancelBubble = true;
        }
    },
    /**
     * @description blur 이벤트 발생시 호출되는 메소드
     * @method onCanBlur
     * @private
     * @param {Object} e Event 객체
     * @return {void}
     */
    onCanBlur: function(e) {
        var displayValue = this.getDisplayEl().getValue();
        displayValue = this.getNormalValue(displayValue);
        if (displayValue && this.lastDisplayValue != displayValue && this.validateValue(displayValue) == false) {
            if(this.invalidBlur !== true) return false;
            this.setValue(this.lastValue, true);
            this.setDisplayValue(this.lastDisplayValue);
            return false;
        }
        return true;
    },
    /**
     * @description blur 이벤트 발생시 호출되는 메소드
     * @method onBlur
     * @private
     * @param {Object} e Event 객체
     * @return {void}
     */
    onBlur: function(e) {
        if(!this.isFocus) return;
        this.isFocus = null;
        if(this.isExpand()) this.collapse();
        if(Rui.isUndefined(this.lastDisplayValue) == false && this.lastDisplayValue != this.getDisplayValue())
            this.doChangedDisplayValue(this.getDisplayValue());
        Rui.ui.form.LTextBox.superclass.onBlur.call(this, e);
        this.setPlaceholder();
    },
    /**
     * @description 출력데이터가 변경되면 호출되는 메소드
     * @method doChangedDisplayValue
     * @private
     * @param {String} o 적용할 값
     * @return {void}
     */
    doChangedDisplayValue: function(o) {
        this.setValue(o);
    },
    /**
     * @description width 속성에 따른 실제 적용 메소드
     * @method _setWidth
     * @protected
     * @param {String} type 속성의 이름
     * @param {Array} args 속성의 값 배열
     * @param {Object} obj 적용된 객체
     * @return {void}
     */
    _setWidth: function(type, args, obj) {
        if(args[0] < 0) return;
        Rui.ui.form.LTextBox.superclass._setWidth.call(this, type, args, obj);
        this.getDisplayEl().setWidth(this.getContentWidth());
        if(this.optionDivEl){
            this.setListWidth(args[0]);
        }
    },
    /**
     * @description height 속성에 따른 실제 적용 메소드
     * @method _setHeight
     * @protected
     * @param {String} type 속성의 이름
     * @param {Array} args 속성의 값 배열
     * @param {Object} obj 적용된 객체
     * @return {void}
     */
    _setHeight: function(type, args, obj) {
        if(args[0] < 0) return;
        Rui.ui.form.LTextBox.superclass._setHeight.call(this, type, args, obj);
        this.getDisplayEl().setHeight(this.getContentHeight() + (Rui.browser.msie67 ? -2 : 0));
        if(Rui.browser.msie && args[0] > -1)  this.getDisplayEl().setStyle('line-height', args[0] + 'px');
    },
    /**
     * @description listWidth 속성에 따른 실제 적용 메소드
     * @method _setListWidth
     * @protected
     * @param {String} type 속성의 이름
     * @param {Array} args 속성의 값 배열
     * @param {Object} obj 적용된 객체
     * @return {void}
     */
    _setListWidth: function(type, args, obj) {
        if(!this.optionDivEl) return;
        var width = this.el.getWidth() || this.width;
        if(this.listWidth > 0)
        	width = Math.max(this.listWidth, width);
        this.optionDivEl.setWidth(width);
    },
    /**
     * @description listWidth 값을 셋팅하는 메소드
     * @method setListWidth
     * @param {int} w width 값
     * @return {void}
     */
    setListWidth: function(w) {
        this.cfg.setProperty('listWidth', w);
    },
    /**
     * @description listWidth 값을 리턴하는 메소드
     * @method getListWidth
     * @public
     * @return {int} width 값
     */
    getListWidth: function() {
        return this.cfg.getProperty('listWidth');
    },
    /**
     * @description AddEmptyText 속성에 따른 실제 적용 메소드
     * @method _setAddEmptyText
     * @protected
     * @param {String} type 속성의 이름
     * @param {Array} args 속성의 값 배열
     * @param {Object} obj 적용된 객체
     * @return {void}
     */
    _setAddEmptyText: function(type, args, obj) {
        if(!this.optionDivEl) return;
        if(args[0] == true && this.hasEmptyText() == false) this.createEmptyText();
        else this.removeEmptyText();
    },
    /**
     * @description useEmptyText 값을 변경하는 메소드
     * @method setAddEmptyText
     * @public
     * @param {boolean} useEmptyText 변경하고자 하는 값
     * @return {void}
     */
    setAddEmptyText: function(useEmptyText) {
        this.cfg.setProperty('useEmptyText', useEmptyText);
    },
    /**
     * @description useEmptyText 값을 리턴하는 메소드
     * @method getAddEmptyText
     * @public
     * @return {boolean}
     */
    getAddEmptyText: function() {
        return this.cfg.getProperty('useEmptyText');
    },
    /**
     * @description height 값을 셋팅하는 메소드
     * <p>Sample: <a href="./../sample/general/ui/form/textboxSample.html" target="_sample">보기</a></p>
     * @method setHeight
     * @public
     * @param {int} w height 값
     * @return {void}
     */
    setHeight: function(h) {
        this.cfg.setProperty('height', h);
    },
    /**
     * @description height 값을 리턴하는 메소드
     * <p>Sample: <a href="./../sample/general/ui/form/textboxSample.html" target="_sample">보기</a></p>
     * @method getHeight
     * @public
     * @return {String} height 값
     */
    getHeight: function() {
        return this.cfg.getProperty('height');
    },
    /**
     * @description disabled 속성에 따른 실제 적용 메소드
     * @method _setDisabled
     * @protected
     * @param {String} type 속성의 이름
     * @param {Array} args 속성의 값 배열
     * @param {Object} obj 적용된 객체
     * @return {void}
     */
    _setDisabled: function(type, args, obj) {
        //if(args[0] === this.disabled) return;
        this.disabled = !!args[0];
        if(this.el) {
            if(this.disabled === false) {
                this.el.removeClass('L-disabled');
                this.getDisplayEl().dom.disabled = false;
                this.getDisplayEl().dom.readOnly = this.latestEditable === undefined ? !this.editable : !this.latestEditable;
            } else {
                this.el.addClass('L-disabled');
                this.getDisplayEl().dom.disabled = true;
                this.getDisplayEl().dom.readOnly = true;
            }
        }
        this.fireEvent(this.disabled ? 'disable' : 'enable');
    },
    /**
     * @description editable 값을 셋팅하는 메소드
     * @method setEditable
     * @public
     * @param {boolean} isEditable editable 셋팅 값
     * @return {void}
     */
    setEditable: function(isEditable) {
        this.cfg.setProperty('editable', this.disabled === true ? false : isEditable);
    },
    /**
     * @description editable 속성에 따른 실제 적용 메소드
     * @method _setEditable
     * @protected
     * @param {String} type 속성의 이름
     * @param {Array} args 속성의 값 배열
     * @param {Object} obj 적용된 객체
     * @return {void}
     */
    _setEditable: function(type, args, obj) {
        Rui.ui.form.LTextBox.superclass._setEditable.call(this, type, args, obj);
        //Rui.ui.form.LTextBox.superclass.setValue.call(this, type, args, obj);
        this.latestEditable = this.editable;
        this.getDisplayEl().dom.readOnly = !this.editable;
    },
    /**
     * @description 화면 출력되는 객체 리턴
     * @method getDisplayEl
     * @protected
     * @return {Rui.LElement} Element 객체
     */
    getDisplayEl: function() {
        return this.inputEl || this.el;
    },
    /**
     * @description Tries to focus the element. Any exceptions are caught and ignored.
     * <p>Sample: <a href="./../sample/general/ui/form/textboxSample.html" target="_sample">보기</a></p>
     * @method focus
     * @public
     * @return {void}
     */
    focus: function() {
        this.getDisplayEl().focus();
    },
    /**
     * @description Tries to blur the element. Any exceptions are caught and ignored.
     * <p>Sample: <a href="./../sample/general/ui/form/textboxSample.html" target="_sample">보기</a></p>
     * @method blur
     * @public
     * @return {void}
     */
    blur: function() {
    	if(this.checkContainBlur) {
            Ev.removeListener(Rui.browser.msie ? document.body : document, 'mousedown', this.deferOnBlur);
            var e = { type: 'mousedown', target: document.body }
            this.onBlur.call(this, e);
    	} else this.getDisplayEl().blur();
    },
    /**
     * @description 객체를 유효여부를 확인하는 메소드
     * <p>Sample: <a href="./../sample/general/ui/form/textboxSample.html" target="_sample">보기</a></p>
     * @method isValid
     * @public
     * @return {void}
     */
    isValid: function() {
        return this.getDisplayEl().isValid();
    },
    /**
     * @description Keyup 이벤트가 발생하면 처리하는 메소드
     * @method onKeyup
     * @private
     * @param {Object} e Event 객체
     * @return {void}
     */
    onKeyup: function(e) {
        var KEY = KL.KEY;
        if( e.keyCode == KEY.DOWN || e.keyCode == KEY.UP || e.keyCode == KEY.TAB){this.onFocus(); this.fireEvent('keydown', e); return;}

        if(this.inputType == null){this.fireEvent('keyup', e);return;}
        if(this.inputType != null && this.inputType != Rui.util.LString.PATTERN_TYPE_KOREAN){
         var s = this.getValue();
         if(s != null){
             var txt = (s + '').replace(/[\ㄱ-ㅎ가-힣]/g, '');
             if(txt != s){
                 this.setValue(txt);
                 Ev.stopEvent(e);
                  e.returnValue = false;
                  return;
             }
          }
        }

        if(e.shiftKey || e.altKey || e.ctrlKey){
            this.specialKeypress = false;
            this.ctrlKeypress = false;
        }
        this.fireEvent('keyup', e);
    },
    /**
     * @description Keydown 이벤트가 발생하면 처리하는 메소드
     * @method onKeydown
     * @private
     * @param {Object} e Event 객체
     * @return {void}
     */
    onKeydown: function(e){
    	/*
        if(!Ev.isSpecialKey(e)) {
        	debugger;
            this.lastValue = null;
        }*/
        if (this.inputType != null) {
            var KEY = KL.KEY;
            if(e.keyCode != KEY.SPACE && e.keyCode != KEY.SHIFT && (Ev.isSpecialKey(e) || e.keyCode == KEY.BACK_SPACE || e.keyCode == KEY.DELETE)) {return;}
            var c = e.charCode || e.which || e.keyCode;
            if(c == 229 && ((this.inputType != ST.PATTERN_TYPE_KOREAN ))){Ev.preventDefault(e); return;} // alt Key
        }
        this.fireEvent('keydown', e);
    },
    /**
     * @description Keypress 이벤트가 발생하면 처리하는 메소드
     * @method onKeypress
     * @private
     * @param {Object} e Event 객체
     * @return {void}
     */
    onKeypress: function(e) {
        if(this.inputType==null){ this.fireEvent('keypress', e);return;}
        var c = e.charCode || e.which || e.keyCode;
        if(c == 8 || c == 39 || c == 45 || c == 46 ){ return;}
        // ctrl+A,C,V,X
        if(this.ctrlKeypress && (c == 97 || c == 99 || c == 118 || c == 120)){ return;}
        var k =  String.fromCharCode(c);
        var pattern = this.inputType;
        var allowPattern = null;

        if(this.includeChars != null){
            allowPattern = new RegExp('[' + this.includeChars + ']','i');
            if(allowPattern.exec(k)){this.fireEvent('keypress', e); return;}
        }

        if(this.inputType == ST.PATTERN_TYPE_KOREAN){
            if(!ST.isHangul(k)){ Ev.preventDefault(e); return;}
        }else if(!pattern.test(k) ){ Ev.preventDefault(e); return;}

        this.fireEvent('keypress', e);
    },
    /**
     * @description copy, cut, paste 같은 특별한 이벤트 기능 연결 메소드
     * @method onSpecialkeyEvent
     * @private
     * @param {Object} e Event 객체
     * @return {void}
     */
    onSpecialkeyEvent: function(e) {
        if(this.checkContainBlur === true) {
            if (e.keyCode == KL.KEY.TAB) {
                if (this.onCanBlur(e) == false) {
                    this.focus();
                    try {Ev.stopEvent(e);}catch(e) {}
                    return false;
                } else {
                    Ev.removeListener(Rui.browser.msie ? document.body : document, 'mousedown', this.deferOnBlur);
                    this.onBlur.call(this, e);
                    this.isFocus = null;
                }
            }
        }
        if(this.optionDivEl) {
            this.doKeyMove(e);
        }
        if (e.ctrlKey && String.fromCharCode(e.keyCode) == 'X') {
            this.fireEvent('cut', e);
        } else if (e.ctrlKey && String.fromCharCode(e.keyCode) == 'C') {
            this.fireEvent('copy', e);
        } else if (e.ctrlKey && String.fromCharCode(e.keyCode) == 'V') {
            this.lastValue = null;
            this.fireEvent('paste', e);
        }
    },
    /**
     * @description autocomplete 기능을 수항하는 메소드
     * @method onKeyAutoComplete
     * @private
     * @param {Object} e Event 객체
     * @return {void}
     */
    onKeyAutoComplete: function(e) {
        if (this.useDataSet === true && this.autoComplete === true) {
            //this.doKeyMove(e);
            this.doKeyInput(e);
        }
    },
    /**
     * @description 키 입력에 따른 이동 이벤트를 처리하는 메소드
     * @method doKeyMove
     * @private
     * @param {Object} e Event 객체
     * @return {void}
     */
    doKeyMove: function(e) {
        var k = KL.KEY;
        switch (e.keyCode) {
            case k.ENTER:
                var activeItem = this.getActive();
                if(activeItem != null) {
                    this.doChangedItem(activeItem.dom);
                }
                this.collapse();
                break;
            case k.DOWN:
                this.expand();
                this.nextActive();
                Ev.stopEvent(e);
                break;
            case k.UP:
                //Ev.stopPropagation(e);
                this.expand();
                this.prevActive();
                Ev.stopEvent(e);
                break;
            case k.PAGE_DOWN:
                this.pageDown(e);
                break;
            case k.PAGE_UP:
                this.pageUp();
                break;
            case k.ESCAPE:
                this.collapse();
                break;
            default:
                break;
        }
    },
    /**
     * @description 키 입력에 따른 filter를 처리하는 메소드
     * @method doKeyInput
     * @private
     * @param {Object} e Event 객체
     * @return {void}
     */
    doKeyInput: function(e) {
        this.isForceCheck = false;
        if(KL.KEY.ENTER == e.keyCode) Ev.preventDefault(e);
        if (KL.KEY.TAB == e.keyCode)
            this.collapse();
        var k = KL.KEY;
        switch (e.keyCode) {
            case k.ENTER:
            case k.DOWN:
            case k.LEFT:
            case k.RIGHT:
            case k.UP:
                break;
            default:
            	if(this.getDisplayEl().getValue() == '' && this.dataSet.isFiltered()) {
            		this.clearFilter();
            	} else if(this.lastValue != this.getDisplayEl().getValue()) {
            		if(!this.autoComplete) this.lastValue = this.getDisplayEl().getValue();
                    if(this.filterTask) return;
                    if((e.altKey === true|| e.ctrlKey === true) && !(e.ctrlKey === true && String.fromCharCode(e.keyCode) == 'V')) return;
                    this.expand();
                    if(this.autoComplete) {
                        this.filterTask = new Rui.util.LDelayedTask(this.doFilter, this);
                        this.filterTask.delay(this.filterMode == 'remote' ? this.remoteDelayTime: this.localDelayTime);
                    }
                }
                break;
        }
    },
    /**
     * @description filter시 처리하는 메소드
     * @method doFilter
     * @private
     * @param {Object} e Event 객체
     * @return {void}
     */
    doFilter: function(e){
        this.filterTask.cancel();
        this.filterTask = null;
        this.filter(this.getDisplayEl().getValue(), this.filterFn);
    },
    /**
     * @description options div를 mousedown할 경우 호출되는 메소드
     * @method onOptionMouseDown
     * @protected
     * @param {Object} e Event 객체
     * @return {void}
     */
    onOptionMouseDown: function(e) {
        this.collapseIf(e);
        var inputEl = this.getDisplayEl();
        inputEl.focus();
    },
    /**
     * @description list를 출력하는 메소드
     * @method expand
     * @protected
     * @return {void}
     */
    expand: function() {
        if(this.disabled === true) return;

        if(this.isLoad !== true)
            this.doLoadDataSet();

        if(this.optionDivEl && this.optionDivEl.hasClass('L-hide-display')) {
            this.doExpand();
            if(this.getActiveIndex() < 0)
                this.firstActive();
            try {
                this.getDisplayEl().focus();
            } catch (e) {}
        }
    },
    /**
     * @description option div 객체 생성
     * @method createOptionDiv
     * @protected
     * @return {void}
     */
    createOptionDiv: function() {
        if(this.useDataSet === true) {
            var inputEl = this.getDisplayEl();
            var optionDiv = document.createElement('div');
            optionDiv.id = Rui.useFixedId() ? Rui.id(this.el, 'LTextBox-opt-' + this.id) : Rui.id();
            this.optionDivEl = Rui.get(optionDiv);
            this.optionDivEl.setWidth((this.listWidth > -1 ? this.listWidth : (this.width - this.el.getBorderWidth('lr'))));
            this.optionDivEl.addClass(this.CSS_BASE + '-list-wrapper');
            this.optionDivEl.addClass('L-hide-display');

            if(Rui.useAccessibility()){
                this.optionDivEl.setAttribute('role', 'listbox');
                this.optionDivEl.setAttribute('aria-expaned', 'false');
            }

            this.optionDivEl.on('mousedown', this.onOptionMouseDown, this, true);

            if(this.listRenderer) this.optionDivEl.addClass('L-custom-list');

            document.body.appendChild(optionDiv);
        }
    },
    /**
     * @description option div에 해당되는 객체를 리턴한다.
     * @method getOptionDiv
     * @protected
     * @return {Rui.LElement}
     */
    getOptionDiv: function() {
        return this.optionDivEl;
    },
    /**
     * @description 현재 활성화되어 있는 객체를 리턴
     * @method getActive
     * @protected
     * @return {Rui.LElement}
     */
    getActive: function() {
        var activeList = this.optionDivEl.select('.active');
        if(activeList.length < 1) return;
        return activeList.getAt(0);
    },
    /**
     * @description 현재 활성화되어 있는 객체의 index를 리턴
     * @method getActiveIndex
     * @protected
     * @return {int}
     */
    getActiveIndex: function() {
        var optionList = this.optionDivEl.select('div.L-list');
        var idx = -1;
        for (var i = 0 ; i < optionList.length ; i++){
            if(optionList.getAt(i).hasClass('active')) {
                idx = i;
                break;
            }
        }
        return idx;
    },
    /**
     * @description 목록중에 h와 같은 html을 찾아 객체의 index를 리턴
     * @method getDataIndex
     * @protected
     * @param {String} h 비교할 html 내용
     * @return {int}
     */
    getDataIndex: function(h) {
        var optionList = this.optionDivEl.select('div.L-list');
        var idx = -1;
        for (var i = 0 ; i < optionList.length ; i++){
            var firstChild = optionList.getAt(i).select('.L-display-field').getAt(0).dom.firstChild;
            if(firstChild && Rui.util.LString.trim(firstChild.nodeValue) == (h && h.length > 0 && Rui.util.LString.trim(h))) {
                idx = i;
                break;
            }
        }
        if(idx > -1 && this.useEmptyText === true)
            idx--;
        return idx;
    },
    /**
     * @description 목록중에 h와 같은 html을 찾아 객체의 index를 리턴
     * @method getItemByRecordId
     * @param {String} html 비교할 display 내용
     * @return {String}
     */
    getItemByRecordId: function(h) {
    	if(!this.optionDivEl) return null;
        var optionList = this.optionDivEl.select('div.L-list');
        var rId = null;
        for (var i = 0 ; i < optionList.length ; i++){
        	var option = optionList.getAt(i);
            var firstChild = option.select('.L-display-field').getAt(0).dom.firstChild;
            if(firstChild && Rui.util.LString.trim(firstChild.nodeValue) == (h && h.length > 0 && Rui.util.LString.trim(h))) {
                rId = 'r' + option.dom.className.match(Rui.ui.form.LTextBox.ROW_RE)[1];
                break;
            }
        }
        return rId;
    },
    /**
     * @description 목록중에 첫번째를 활성화하는 메소드
     * @method firstActive
     * @protected
     * @return {void}
     */
    firstActive: function() {
        var firstChildElList = this.optionDivEl.select(':first-child');
        if(firstChildElList.length > 0)
            firstChildElList.getAt(0).addClass('active');
    },
    /**
     * @description 다음 목록을 활성화하는 메소드
     * @method nextActive
     * @protected
     * @return {void}
     */
    nextActive: function(){
        var activeEl = this.getActive();
        if(activeEl == null) {
            this.firstActive();
        } else {
            var nextDom = Dom.getNextSibling(activeEl.dom);
            if(nextDom == null) return;
            var nextEl = Rui.get(nextDom);
            activeEl.removeClass('active');
            nextEl.addClass('active');
            this.scrollDown();
        }
    },
    /**
     * @description 이전 목록을 활성화하는 메소드
     * @method prevActive
     * @protected
     * @return {void}
     */
    prevActive: function() {
        var activeEl = this.getActive();
        if(activeEl == null) {
            this.firstActive();
        } else {
            var prevDom = Dom.getPreviousSibling(activeEl.dom);
            if(prevDom == null) return;
            var prevEl = Rui.get(prevDom);
            activeEl.removeClass('active');
            prevEl.addClass('active');
            this.scrollUp();
        }
    },
    /**
     * @description 위치를 이전 페이지로 이동한다.
     * @method pageUp
     * @protected
     * @return {void}
     */
    pageUp: function() {
        if(!this.dataSet) return;
        if(!this.isExpand()) this.expand();
        var ds = this.dataSet;
        var row = ds.getRow();
        var moveRow = row - this.expandCount;
        if (0 > moveRow) {
            if(this.useEmptyText === true) moveRow = -1;
            else moveRow = 0;
        }
        ds.setRow(moveRow);
    },
    /**
     * @description 위치를 다음 페이지로 이동한다.
     * @method pageDown
     * @protected
     * @return {void}
     */
    pageDown: function() {
        if(!this.dataSet) return;
        if(!this.isExpand()) this.expand();
        var ds = this.dataSet;
        var row = ds.getRow();
        var moveRow = row + this.expandCount;
        if(ds.getCount() - 1 < moveRow) moveRow = ds.getCount() - 1;
        ds.setRow(moveRow);
    },
    /**
     * @description 목록이 스크롤다운이 되게 하는 메소드
     * @method scrollDown
     * @protected
     * @return {void}
     */
    scrollDown: function() {
        if (!('scroll' != this.optionDivEl.getStyle(this.overflowCSS) || 'auto' != this.optionDivEl.getStyle(this.overflowCSS))) return;
        var activeEl = this.getActive();
        var activeIndex = this.getActiveIndex() + 1;
        var minScroll = activeIndex * activeEl.getHeight() - this.optionDivEl.getHeight();
        if (this.optionDivEl.dom.scrollTop < minScroll)
            this.optionDivEl.dom.scrollTop = minScroll;
    },
    /**
     * @description 목록이 스크롤업이 되게 하는 메소드
     * @method scrollUp
     * @protected
     * @return {void}
     */
    scrollUp: function() {
        if (!('scroll' != this.optionDivEl.getStyle(this.overflowCSS) || 'auto' != this.optionDivEl.getStyle(this.overflowCSS))) return;
        var activeEl = this.getActive();
        var maxScroll = this.getActiveIndex() * activeEl.getHeight();
        if (this.optionDivEl.dom.scrollTop > maxScroll)
            this.optionDivEl.dom.scrollTop = maxScroll;
    },
    /**
     * @description 목록을 펼치는 메소드
     * @method doExpand
     * @protected
     * @return {void}
     */
    doExpand: function() {
        this.optionDivEl.setTop(0);
        this.optionDivEl.setLeft(0);
        this.optionDivEl.removeClass('L-hide-display');
        this.optionDivEl.addClass('L-show-display');

        if(Rui.useAccessibility())
            this.optionDivEl.setAttribute('aria-expaned', 'true');
        
        var val = this.getDisplayEl().getValue();
        if(val === '' || (this.useEmptyText && val == this.emptyText)) {
        	this._itemRendered = false;
        	if(this.editable && this.autoComplete) this.dataSet.clearFilter(false);
        }

        if(this._itemRendered !== true)
            this.doDataChangedDataSet();

        this.optionAutoHeight();
        
        var vWidth = Rui.util.LDom.getViewport().width;
        var height = this.optionDivEl.getHeight();
        var width = this.optionDivEl.getWidth();
        var top = this.el.getTop();
        var left = this.el.getLeft();
        
        //top = top + this.el.getHeight() + this.el.getBorderWidth('tb') + this.el.getPadding('tb') +  this.optionDivEl.getBorderWidth('tb') + this.optionDivEl.getPadding('tb');
        top = top + this.el.getHeight();
        if(!top) top = 0;
        if(!left) left = 0;
        if((this.listPosition == 'auto' && !Rui.util.LDom.isVisibleSide(height + top)) || this.listPosition == 'up')
            top = this.el.getTop() - height;

        if (Rui.rightToLeft()) {
            left -= width - this.getWidth() + (this.marginLeft + (Rui.browser.msie67 ? -2 : 0)) * 2;
            if(left < 0) {
                left += width - this.getWidth() + this.marginLeft + (Rui.browser.msie67 ? -2 : 0);
            }
        } else {
            left = left + this.marginLeft + (Rui.browser.msie67 ? -2 : 0);
            if(vWidth <= left + width && width > this.getWidth()) 
                left -= width - this.getWidth() + (this.marginLeft + (Rui.browser.msie67 ? -2 : 0)) * 2;
        }

        // ie7에서 document.documentElement.getBoundingClientRect의 값이 이상하게 나와 -2값으로 처리.
        this.optionDivEl.setTop(top + this.marginTop + (Rui.browser.msie67 ? -2 : 0));
        this.optionDivEl.setLeft(left);

        this.optionDivEl.select('.L-list').removeClass('selected');
        this.activeItem();

        //Ev.addListener(document, 'mousewheel', this.collapseIfDelegate, this);
        if(this.el.findParent('.L-overlay') != null) {
            this.checkOptionDivDelegate = Rui.later(100, this, this._checkOptionDiv, null, true);
        }
        //Ev.addListener(document, 'mousedown', this.collapseIf, this, true);
        this.reOnDeferOnBlur();

        this.fireEvent('expand');
    },
    /**
     * @description 목록을 펼치는 조건
     * @method _checkOptionDiv
     * @private
     * @return {void}
     */
    _checkOptionDiv: function() {
        var left = this.inputEl.getLeft();
        var top = this.inputEl.getTop();
        if(!(Rui.browser.msie && Rui.browser.version == 8) && !((this.inputEl.getTop() - 2) <= top && this.inputEl.getTop() >= top) ||
            !((this.inputEl.getLeft() - 2) <= left && this.inputEl.getLeft() >= left)) {
            this.collapse();
        }
    },
    /**
     * @description 목록이 펼쳐저 있는지 여부
     * @method isExpand
     * @return {boolean}
     */
    isExpand: function() {
        return this.optionDivEl && this.optionDivEl.hasClass('L-show-display');
    },
    /**
     * @description target과 비교하여 목록을 줄이는 메소드
     * @method collapseIf
     * @protected
     * @param {Object} e Event 객체
     * @return {void}
     */
    collapseIf: function(e) {
        var target = e.target;
        if (((this.optionDivEl && this.optionDivEl.dom == target)) ||
            ((this.iconEl && this.iconEl.dom == target)) ||
            ((this.inputEl && this.inputEl.dom == target)))
            return;

        var targetEl = Rui.get(target);
        if(!targetEl) return;
        var isLList = targetEl.hasClass('L-list');
        if(!isLList) {
            var parentList = targetEl.findParent('div.L-list', 3);
            if(parentList) {
                targetEl = parentList;
                isLList = true;
            }
        }
        if(isLList) {
            targetEl.removeClass('active');
            this.doChangedItem(targetEl.dom);
        }

        this.collapse();
    },
    /**
     * @description 목록을 줄이는 메소드
     * @method collapse
     * @protected
     * @return {void}
     */
    collapse: function() {
        this.optionDivEl.removeClass('L-show-display');
        this.optionDivEl.addClass('L-hide-display');

        if(Rui.useAccessibility()){
            this.optionDivEl.setAttribute('aria-expaned', 'false');
        }

        //Ev.removeListener(document, 'mousewheel', this.collapseIfDelegate);
        if(this.checkOptionDivDelegate) this.checkOptionDivDelegate.cancel();
        //Ev.removeListener(document, 'scroll', this.onScrollDelegate);
        //Ev.removeListener(document, 'mousedown', this.collapseIf);
        if(this.isFocus)
            this.getDisplayEl().focus();

        this.fireEvent('collapse');
        this.optionDivEl.select('.active').removeClass('active');
    },
    /**
     * @description 목록을 세로크기를 재계산하는 메소드
     * @method optionAutoHeight
     * @protected
     * @return {void}
     */
    optionAutoHeight: function() {
        if(!this.optionDivEl) return;
        var count = this.dataSet.getCount();
        var existOptionDivHeight = this.optionDivEl.getHeight(); 
        var optionDivElHeight = existOptionDivHeight;
        if(this.useEmptyText) count++;
        if(!this.expandCount) this.expandCount = 10;
        if(count > this.expandCount){ 
           if(this.optionDivEl.dom.childNodes.length > 0) {
               var expandHeight = this.expandCount*childHeight;
               var childHeight = this.optionDivEl.dom.firstChild.offsetHeight;

               if(optionDivElHeight != expandHeight){
                   if(optionDivElHeight != expandHeight + this.optionDivEl.getStyle("border-top-width") + this.optionDivEl.getStyle("border-bottom-width")){
                       this.optionDivEl.setHeight(this.expandCount*(childHeight)+"px");
                   }
               }
           }
        }else{
            this.optionDivEl.setHeight('auto');
        }
        optionDivElHeight = this.optionDivEl.getHeight();
        var inputElTop = this.el.getTop();
        var optionDivElTop = this.optionDivEl.getTop();
        if(inputElTop>optionDivElTop){
            this.optionDivEl.setTop(inputElTop-optionDivElHeight);
        }
    },
    /**
     * @description 목록을 줄이는 메소드
     * @method onScroll
     * @protected
     * @param {Object} e Event 객체
     * @return {void}
     */
    onScroll: function(){
        this.collapse();
    },
    /**
     * @description 현재 값에 맞는 목록을 활성화하는 메소드
     * @method activeItem
     * @protected
     * @return {void}
     */
    activeItem: function() {
        this.isForceCheck = false;
        var value = this.getDisplayEl().getValue();
        if(value == '') return;
        var listElList = this.optionDivEl.select('.L-list');
        var r = this.dataSet.getAt(this.dataSet.getRow());
        if(r) {
            listElList.each(function(child){
                var selected = child.dom.className.indexOf('L-row-' + r.id) > -1 ? true : false;
                if(selected) {
                    child.addClass('selected');
                    child.addClass('active');
                    this.scrollDown();
                    return false;
                }
            }, this);
        }
    },
    /**
     * @description 데이터셋이 Load 메소드가 호출되면 수행하는 이벤트 메소드
     * @method doLoadDataSet
     * @private
     * @param {Object} e event 객체
     * @return {void}
     */
    doLoadDataSet: function() {
        this._itemRendered = false;
        if(this.optionDivEl) {
            this.doDataChangedDataSet();
            this.isLoad = true;
            this.focusDefaultValue();
        }
        this.doCacheData();
    },
    /**
     * @description 데이터셋이 beforeLoad 메소드가 호출되면 수행하는 이벤트 메소드
     * @method onBeforeLoadDataSet
     * @private
     * @param {Object} e event 객체
     * @return {void}
     */
    onBeforeLoadDataSet: function(e) {
        if(!this.bindMDataSet)
            this.dataSet.setRow(-1);
    },
    /**
     * @description 데이터셋이 Load 메소드가 호출되면 수행하는 이벤트 메소드
     * @method onLoadDataSet
     * @private
     * @return {void}
     */
    onLoadDataSet: function(e) {
    	this._newLoaded = true;
        this._itemRendered = false;
        this.doLoadDataSet();
        this.optionAutoHeight();
        if(this.bindMDataSet && this.bindMDataSet.getRow() > -1) {
        	var row = this.bindMDataSet.getRow();
            if(this.autoComplete !== true || this.dataSet.isLoad !== true)
			    this.setValue(this.bindMDataSet.getNameValue(row, this.bindObject.id), true);
        }
    },
    /**
     * @description DataSet이 load후 기본으로 셋팅될 값을 변경한다.
     * @method setDefaultValue
     * @public
     * @param {String} o 기본 코드 값
     * @return {void}
     */
    setDefaultValue: function(o) {
        this.defaultValue = o;
    },
    /**
     * @description DataSet이 load후 기본으로 셋팅될 row값을 변경한다.
     * @method setSelectedIndex
     * @public
     * @param {Int} idx 기본 index값
     * @return {void}
     */
    setSelectedIndex: function(idx) {
    	this.selectedIndex = idx;
    },
    /**
     * @description 기본 값을 셋팅하는 메소드
     * @method focusDefaultValue
     * @private
     * @return {void}
     */
    focusDefaultValue: function() {
        if(this.bindMDataSet || this.autoComplete === true) return;
        if(this.isLoad !== true && Rui.isEmpty(this.defaultValue)) this.defaultValue = this.getValue();
        var ignore = false;
        if(this.ignoreEvent === true && this.gridPanel) ignore = true;
        if(!Rui.isEmpty(this.defaultValue))
            this.setValue(this.defaultValue, ignore);
        else if(this.selectedIndex !== false && this.selectedIndex >= 0) {
            //for LCombo
            if(this.dataSet.getCount() - 1 >= this.selectedIndex)
                this.setValue(this.dataSet.getNameValue(this.selectedIndex, this.valueField), ignore);
        } else if(this.firstChangedEvent) this.setValue(null, ignore);
    },
    /**
     * @description 목록에서 선택되면 출력객체에 값을 반영하는 메소드
     * @method doChangedItem
     * @private
     * @param {HTMLElement} dom Dom 객체
     * @return {void}
     */
    doChangedItem: function(dom) {
        if(dom.innerHTML) {
            var firstChild = Rui.get(dom).select('.L-display-field').getAt(0).dom.firstChild;
            var displayValue = firstChild ? firstChild.nodeValue : '';
            this.setValue(displayValue);
            if(this.isFocus)
                this.getDisplayEl().focus();
        }
    },
    /**
     * @description 데이터셋이 RowPosChanged 메소드가 호출되면 수행하는 이벤트 메소드
     * @method onRowPosChangedDataSet
     * @private
     * @return {void}
     */
    onRowPosChangedDataSet: function(e) {
    },
    /**
     * @description 데이터셋이 add 메소드가 호출되면 수행하는 이벤트 메소드
     * @method onAddData
     * @private
     * @return {void}
     */
    onAddData: function(e) {
        var row = e.row, dataSet = e.target;
        var optionEl = this.createItem({
            record: this.dataSet.getAt(row),
            row: row
        });

        if(dataSet.getCount() > 1) {
            var beforeRow = row - 1;
            if(beforeRow < 0) {
                var nextRow = row + 1;
                var nextRowEl = this.getRowEl(nextRow);
                if(nextRowEl == null) return;
                nextRowEl.insertBefore(optionEl.dom);
            } else {
                var beforeRowEl = this.getRowEl(beforeRow);
                if(beforeRowEl == null) return;
                beforeRowEl.insertAfter(optionEl.dom);
            }
        } else {
            if(this.optionDivEl)
                this.getOptionDiv().appendChild(optionEl.dom);
        }
    },
    /**
     * @description 데이터셋이 update 메소드가 호출되면 수행하는 이벤트 메소드
     * @method onUpdateData
     * @private
     * @return {void}
     */
    onUpdateData: function(e) {
        var row = e.row, colId = e.colId;
        if(colId != this.displayField) return;
        var currentRowEl = this.getRowEl(row);
        if(currentRowEl) {
            var r = this.dataSet.getAt(row);
            var optionEl = this.createItem({
                record: r,
                row: row
            });
            currentRowEl.html(optionEl.getHtml());
            if(row == this.dataSet.getRow()) {
                var inputEl = this.getDisplayEl();
                var displayValue = r.get(this.displayField);
                displayValue = Rui.isEmpty(displayValue) ? '' : displayValue;
                inputEl.setValue(displayValue);
            }
        }
    },
    /**
     * @description 데이터셋이 remove 메소드가 호출되면 수행하는 이벤트 메소드
     * @method onRemoveData
     * @private
     * @return {void}
     */
    onRemoveData: function(e) {
        var row = e.row;
        var currentRowEl = this.getRowEl(row);
        (currentRowEl != null) ? currentRowEl.remove() : '';
    },
    /**
     * @description 데이터셋이 undo 메소드가 호출되면 수행하는 이벤트 메소드
     * @method onUndoData
     * @private
     * @return {void}
     */
    onUndoData: function(e) {
        var state = e.beforeState;
        if(state == Rui.data.LRecord.STATE_INSERT) {
            this.onRemoveData(e);
        }
    },
    /**
     * @description 데이터셋이 DataChanged 메소드가 호출되면 수행하는 메소드
     * @method onDataChangedDataSet
     * @private
     * @return {void}
     */
    onDataChangedDataSet: function(e) {
        this._itemRendered = false;
        this.doDataChangedDataSet();
        //if(this.autoComplete !== true) this.dataSet.setRow(-1, {isForce: true});
    },
    /**
     * @description 현재 데이터셋으로 리스트를 다시 생성하는 메소드
     * @method doDataChangedDataSet
     * @private
     * @return {void}
     */
    doDataChangedDataSet: function() {
        if(this.autoComplete !== true && this.editable !== true && this.getValue() && !this.bindMDataSet) {
            //for LCombo
            var row = this.dataSet.findRow(this.valueField, this.getValue());
            if(row < 0) this.setValue('');
        }
        //this._itemRendered = true;
        if(this.autoComplete !== true && !this.isFocus) return;
        this.removeAllItem();
        if(this.useEmptyText === true)
            this.createEmptyText();
        if(this.optionDivEl) {
            var DEL = Rui.data.LRecord.STATE_DELETE,
                dataSet = this.dataSet;
            for (var i = 0, len = dataSet.getCount(); i < len; i++) {
                if(DEL == dataSet.getState(i))
                    continue;
                var optionEl = this.createItem({
                    record: dataSet.getAt(i),
                    row: i
                });
                this.appendOption(optionEl.dom);
            }
            this._itemRendered = true;
        }
        if(this.autoComplete) this.optionAutoHeight();
    },
    /**
     * @description option 객체를 붙인다.
     * @method appendOption
     * @private
     * @param {HTMLElement} dom option dom 객체
     * @return {void}
     */
    appendOption: function(dom) {
        this.optionDivEl.appendChild(dom);
    },
    /**
     * @description emptyText가 존재하는지 여부를 리턴한다.
     * @method hasEmptyText
     * @private
     * @return {boolean}
     */
    hasEmptyText: function() {
        if(!this.optionDivEl) return this.useEmptyText;
        if(this.optionDivEl.dom.childNodes.length < 1) return false;

        return Dom.hasClass(this.optionDivEl.dom.childNodes[0], 'L-empty');
    },
    /**
     * @description emptyText 항목을 생성한다.
     * @method createEmptyText
     * @private
     * @return {void}
     */
    createEmptyText: function() {
        //if(this._rendered !== true) return;
        try {
            if(!this.el) return;
            var data = {};
            if(this.valueField) data[this.valueField] = '';
            data[this.displayField] = this.emptyText;
            var record = this.dataSet.createRecord(data);

            var optionEl = this.createItem({
                record: record,
                row: -1
            });
            optionEl.addClass('L-empty');
            this.insertEmptyText(optionEl.dom);
        } catch(e){}
    },
    /**
     * @description emptyText 항목의 객체를 첫번째에 추가한다.
     * @method insertEmptyText
     * @private
     * @param {HTMLElement} dom option Dom 객체
     * @return {void}
     */
    insertEmptyText: function(dom) {
        if(this.optionDivEl.dom.childNodes.length > 0)
            Dom.insertBefore(dom, this.optionDivEl.dom.childNodes[0]);
        else
            this.optionDivEl.appendChild(dom);
    },
    /**
     * @description emptyText 항목을 제거한다.
     * @method removeEmptyText
     * @private
     * @return {void}
     */
    removeEmptyText: function() {
        if(this.hasEmptyText()) Dom.removeNode(this.optionDivEl.dom.childNodes[0]);
    },
    /**
     * @description row에 해당되는 Element를 리턴하는 메소드
     * @method getRowEl
     * @private
     * @return {Rui.Element}
     */
    getRowEl: function(row) {
        if(this.optionDivEl) {
            var rowElList = this.optionDivEl.select('.L-list');
            return rowElList.length > 0 ? rowElList.getAt(this.useEmptyText ? row + 1 : row) : null;
        }
        return null;
    },
    /**
     * @description 목록의 Item을 생성
     * @method createItem
     * @private
     * @param {Object} e Event 객체
     * @return {Rui.LElement}
     */
    createItem: function(e) {
        var record = e.record;
        var displayValue = record.get(this.displayField);
        displayValue = Rui.isEmpty(displayValue) ? '' : displayValue;
        var listHtml = '';
        if(this.listRenderer) {
            listHtml = this.listRenderer(record);
        } else {
            listHtml = '<div class="L-display-field" id="LTextBox-listItem-' + this.id + '-' + (e.row+1) +'">' + displayValue + '</div>';
        }
        var optionEl = Rui.createElements('<div class="L-list L-row-' + record.id + '" id="LTextBox-optList-' + this.id + '-' + (e.row+1) +'">' + listHtml + '</div>').getAt(0);
        var optionDivEl = this.optionDivEl;

        if(Rui.useAccessibility())
            optionEl.setAttribute('role', 'option');

        optionEl.hover(function(){
            this.addClass('active');
        }, function(){
            optionDivEl.select('.active').removeClass('active');
        });
        return optionEl;
    },
    /**
     * @description dom에서 row index return
     * @method findRowIndex
     * @public
     * @param {HTMLElement} dom dom
     * @param {int} y pageY
     * @return {int}
     */
    findRowIndex: function(dom) {
        var list = Rui.get(dom).findParent('.L-list');
        if(!list) return -1;
        var r = list.dom;
        if(r && r.className) {
            var m = r.className.match(this.rowRe);
            if (m && m[1]) {
                var idx = this.dataSet.indexOfKey('r' + m[1]);
                return idx == -1 ? false : idx;
            } else -1;
        } else
            return -1;
    },
    /**
     * @description DataSet에 o객체를 추가하는 메소드
     * @method add
     * @protected
     * @param {Object} o Record의 데이터 객체
     * @param {Object} option Record의 생성시 option
     * @return {void}
     */
    add: function(o, option){
        var record = this.dataSet.createRecord(o, { id: Rui.data.LRecord.getNewRecordId() });
        this.dataSet.add(record, option);
    },
    /**
     * @description DataSet에 배열로 o객체를 추가하는 메소드
     * @method addAll
     * @protected
     * @param {Array} o Record의 데이터 객체 배열
     * @param {Object} option Record의 생성시 option
     * @return {void}
     */
    addAll: function(o, option) {
        for (var i = 0 ; i < o.length ; i++) {
            this.add(o[i], option);
        }
    },
    /**
     * @description DataSet에 row 위치의 있는 o객체를 반영하는 메소드
     * @method setData
     * @protected
     * @param {int} row row의 위치
     * @param {Object} o Record의 데이터 객체
     * @return {void}
     */
    setData: function(row, o) {
        if(row > this.dataSet.getCount() - 1 || row == 0) return;
        var record = this.dataSet.getAt(row);
        record.setValues(o);
    },
    /**
     * @description Record객체 배력을 추가한다.
     * @method removeAt
     * @protected
     * @param {int} index 지우고자 하는 위치값
     * @return {void}
     */
    removeAt: function(row) {
        this.dataSet.removeAt(row);
    },
    /**
     * @description 목록의 모든 item을 삭제한다.
     * @method removeAllItem
     * @protected
     * @return {void}
     */
    removeAllItem: function(){
        if(this.optionDivEl != null)
            this.optionDivEl.select('.L-list').remove();
    },
    /**
     * @description 데이터셋의 레코드 건수를 리턴한다.
     * @method getCount
     * @protected
     * @return {int} 데이터셋의 레코드 건수
     */
    getCount: function(){
        return this.dataSet.getCount();
    },
    /**
     * @description 값에 따라 filter 하는 메소드
     * @method filter
     * @protected
     * @param {String} val filter시 비교하는 값
     * @param {function} fn 비교 필터
     * @return {void}
     */
    filter: function(val, fn) {
        if(this.filterMode == 'remote') {
            var p = {};
            p[this.displayField] = val;
            this.dataSet.load({
                url: this.filterUrl,
                params: p
            });
        } else {
            fn = fn || function(id, record) {
                var val2 = record.get(this.displayField);
                if(ST.startsWith(val2.toLowerCase(), val.toLowerCase()))
                    return true;
            };
            this.dataSet.filter(fn, this, false);
        }
    },
    /**
     * @description DataSet에 적용된 filter를 지운다.
     * <p>Sample: <a href="./../sample/general/ui/form/textboxSample.html" target="_sample">보기</a></p>
     * @method clearFilter
     * @public
     * @return {void}
     */
    clearFilter: function(){
        if(this.dataSet) this.dataSet.clearFilter(false);
    },
    /**
     * @description 현재 값을 리턴
     * <p>Sample: <a href="./../sample/general/ui/form/textboxSample.html" target="_sample">보기</a></p>
     * @method getValue
     * @public
     * @return {String} 결과값
     */
    getValue: function() {
        var value = this.getDisplayEl().getValue();
        if(this.mask && value != null && value != '' && this.maskValue == false)
            value = this.getUnmaskValue(value);

        if(this.mask && value != null && value != '' && this.maskValue == true)
            value = this.getUnmaskValue(value) == '' ? '' : value;

        return (value == this.placeholder || value == '') ? this.getEmptyValue(value) : value;
    },
    /**
     * @description 빈값일 경우 emptyValue에 해당되는 값을 리턴한다.
     * @method getEmptyValue
     * @protected
     * @param {Object} value 입력 값
     * @return {Object} 결과값
     */
    getEmptyValue: function(val) {
        if(val === this.emptyValue) return val;
        else return this.emptyValue;
    },
    /**
     * @description mask가 입력된 값을 mask를 제외한 값으로 리턴한다.
     * @method getUnmaskValue
     * @protected
     * @param {String} value 입력 값
     * @return {String} 결과값
     */
    getUnmaskValue: function(value) {
        var realValue = [];
        Rui.each(value.split(''), function(c,i){
            if(this.tests[i] && this.tests[i].test(c)) {
                realValue.push(c);
            }
        }, this);
        return realValue.join('');
    },
    /**
     * @description value에 대한 buffer값의 배열을 리턴한다.
     * @method getBuffer
     * @protected
     * @param {String} value 입력 값
     * @return {Array} 결과값
     */
    getBuffer: function(value){
        var defs = this.definitions;
        var buffer = [];
        var v = value.split('');
        var j = 0;
        Rui.each(this.mask.split(''), function(c, i) {
            if (c != '?')
                buffer.push(defs[c] ? this.maskPlaceholder : c);
            if (this.tests[i] && this.tests[i].test(c) && v.length > j) {
                buffer[i] = v[j++];
            }
        }, this);
        return buffer;
    },
    /**
     * @description 현재 값을 리턴
     * <p>Sample: <a href="./../sample/general/ui/form/textboxSample.html" target="_sample">보기</a></p>
     * @method getDisplayValue
     * @public
     * @return {String} 결과값
     */
    getDisplayValue: function() {
        return this.getDisplayEl().getValue();
    },
    /**
     * @description 출력객체에 내용을 변경한다.
     * @method setDisplayValue
     * @protected
     * @param {String} o 출력객체에 내용을 변경할 값
     * @return {void}
     */
    setDisplayValue: function(o) {
        this.getDisplayEl().setValue(o);
    },
    /**
     * @description 값을 변경한다.
     * <p>Sample: <a href="./../sample/general/ui/form/textboxSample.html" target="_sample">보기</a></p>
     * @method setValue
     * @sample default
     * @public
     * @param {String} o 반영할 값
     * @return {void}
     */
    setValue: function(o, ignoreEvent) {
        if(Rui.isUndefined(o) === true || (this.lastValue === o && this.inputType === null) ) return;
        var displayEl = this.getDisplayEl();
        if(displayEl) { 
            displayEl.dom.value = o;
            var displayValue = this.checkValue().displayValue;
            displayEl.dom.value = displayValue;
            this.lastDisplayValue = displayValue;
        }
        if(ignoreEvent !== true) this.doChanged();
        this.lastValue = o;
        this.setPlaceholder();
    },
    /**
     * @description changed 이벤트를 수행한다.
     * @method doChanged
     * @protected
     * @return {Rui.data.DataSet}
     */
    doChanged: function() {
        this.fireEvent('changed', {target:this, value:this.getValue(), displayValue:this.getDisplayValue()});
    },
    /**
     * @description 자동완성 기능을 사용할때 dataset을 리턴한다.
     * @method getDataSet
     * @public
     * @sample default
     * @return {Rui.data.DataSet}
     */
    getDataSet: function() {
        return this.dataSet;
    },
    /**
     * @description dataset을 변경한다.
     * @method setDataSet
     * @public
     * @param {Rui.data.LDataSet} newDataSet 신규 DataSet
     * @return {Rui.data.DataSet}
     */
    setDataSet: function(d) {
        this.doUnSyncDataSet();
        this.dataSet = d;
        this.initDataSet();
        this.onLoadDataSet();
    },
    /**
     * @description 로드한 데이터를 캐쉬한다.
     * @method doCacheData
     * @private
     * @return {void}
     */
    doCacheData: Rui.emptyFn,
    /**
     * @description 키 입력시 호출되는 메소드
     * @method onFireKey
     * @protected
     * @param {Object} e Event 객체
     * @return {void}
     */
    onFireKey: function(e){
        if(Ev.isSpecialKey(e) && !this.isExpand() || (e.ctrlKey === true && (e.keyCode === 70 || String.fromCharCode(e.keyCode) == 'V'))){
            this.fireEvent('specialkey', e);
        }
    },
    /**
     * @description mask 적용시 초기화
     * @method initMask
     * @protected
     * @return {void}
     */
    initMask: function() {
        var defs = this.definitions;
        var tests = [];

        this.partialPosition = this.mask.length;
        this.firstNonMaskPos = null;
        this.maskLength = this.mask.length;

        Rui.each(this.mask.split(''), function(c, i) {
            if (c == '?') {
                this.maskLength--;
                this.partialPosition = i;
            } else if (defs[c]) {
                tests.push(new RegExp(defs[c]));
                if(this.firstNonMaskPos==null)
                    this.firstNonMaskPos =  tests.length - 1;
            } else {
                tests.push(null);
            }
        }, this);

        this.tests = tests;
        this.buffer = [];
        Rui.each(this.mask.split(''), function(c, i) {
            if (c != '?')
                this.buffer.push(defs[c] ? this.maskPlaceholder : c);
        }, this);
    },
    initMaskEvent: function() {
        this.on('focus', function() {
            if(!(Rui.mobile.ios && this.checkContainBlur == false)) {
	            var focusText = this.getDisplayValue();
	            if(focusText == this.placeholder) this.getDisplayEl().setValue('');
                var pos = this.checkValue().pos;
                if(this.editable !== false)
                    this.writeBuffer();
                setTimeout(Rui.util.LFunction.createDelegate(function() {
                    if (pos == this.mask.length)
                        this.setCaret(0, pos);
                    else
                        this.setCaret(pos);
                }, this), 0);
            }
        }, this, true);
        this.on('blur', function() {
        	if(!(Rui.mobile.ios && this.checkContainBlur == false)) {
                this.setDisplayValue(this.checkValue().displayValue);
        	}
        });
        if(!Rui.mobile.ios) {
            this.on('keydown', this.onKeyDownMask, this, true);
            this.on('keypress', this.onKeyPressMask, this, true);
        }
        this.on('paste', function(e) {
            if(this.cfg.getProperty('disabled')) return;
            if(!(Rui.mobile.ios && this.checkContainBlur == false))
            	setTimeout(Rui.util.LFunction.createDelegate(function() { this.setCaret(this.checkValue(true).pos); }, this), 0);
        }, this, true);
        if(!(Rui.mobile.ios && this.checkContainBlur == false) && this._rendered)
        	this.setDisplayValue(this.checkValue().displayValue); //Perform initial check for existing values
    },
    /**
     * @description 입력 input 객체에 select 지정
     * @method setCaret
     * @protected
     * @param {int} begin 처음
     * @param {int} end [optional] 마지막
     * @return {void}
     */
    setCaret: function(begin, end) {
        var displayEl = this.getDisplayEl();
        var displayDom = displayEl.dom;
        end = (typeof end == 'number') ? end : begin;
        //if(end < 1) return;
        try{
            if (displayDom.setSelectionRange) {
                displayDom.focus();
                displayDom.setSelectionRange(begin, end);
            } else if (displayDom.createTextRange) {
                var range = displayDom.createTextRange();
                range.collapse(true);
                range.moveEnd('character', end);
                range.moveStart('character', begin);
                range.select();
            }
        }catch(e) {}
    },
    /**
     * @description select 범위 정보를 가지는 객체 리턴
     * @method getCaret
     * @protected
     * @return {Object}
     */
    getCaret: function() {
        var displayEl = this.getDisplayEl();
        var displayDom = displayEl.dom;
        if (displayDom.setSelectionRange) {
            begin = displayDom.selectionStart;
            end = displayDom.selectionEnd;
        } else if (document.selection && document.selection.createRange) {
            var range = document.selection.createRange();
            begin = 0 - range.duplicate().moveStart('character', -100000);
            end = begin + range.text.length;
        }
        return { begin: begin, end: end };
    },
    /**
     * @description buffer에 가지고 있는 정보를 지우는 메소드
     * @method clearBuffer
     * @protected
     * @param {int} start 시작
     * @param {int} end 끝
     * @return {void}
     */
    clearBuffer: function(start, end) {
        for (var i = start; i < end && i < this.maskLength; i++) {
            if (this.tests[i])
                this.buffer[i] = this.maskPlaceholder;
        }
    },
    /**
     * @description buffer에 가지고 있는 정보를 출력하는 객체에 적용하는 메소드
     * @method writeBuffer
     * @protected
     * @return {void}
     */
    writeBuffer: function() {
        //console.log('buffer->:' +this.buffer);
        //console.log('value->:' +this.setDisplayValue());

        return this.setDisplayValue(this.buffer.join(''));
    },
    /**
     * @description mask 적용시 keydown 이벤트
     * @method onKeyDownMask
     * @protected
     * @param {Object} e event 객체
     * @return {void}
     */
    onKeyDownMask: function(e) {
        if(this.cfg.getProperty('disabled') || this.editable != true) return true;
        var pos = this.getCaret();
        var k = e.keyCode;
        this.ignore = (k < 16 || (k > 16 && k < 32) || (k > 32 && k < 41));

        //delete selection before proceeding
        if ((pos.begin - pos.end) != 0 && (!this.ignore || k == 8 || k == 46))
            this.clearBuffer(pos.begin, pos.end);

        //backspace, delete, and escape get special treatment
        if (k == 8 || k == 46) {//backspace/delete
            this.shiftL(pos.begin + (k == 46 ? 0 : -1));
            Ev.preventDefault(e);
            return false;
        } else if (k == 27) {//escape
            //this.setDisplayValue(focusText);
        	if(!(this.checkContainBlur == false))
        		this.setCaret(0, this.checkValue().pos);
            Ev.preventDefault(e);
            return false;
        }
    },
    /**
     * @description mask 적용시 keypress 이벤트
     * @method onKeyPressMask
     * @protected
     * @param {Object} e event 객체
     * @return {boolean}
     */
    onKeyPressMask: function(e) {
        if (this.ignore) {
            this.ignore = false;
            //Fixes Mac FF bug on backspace
            return (e.keyCode == 8) ? false : null;
        }
        e = e || window.event;
        var k = e.charCode || e.keyCode || e.which;
        var pos = this.getCaret();

        if (e.ctrlKey || e.altKey || e.metaKey) {//Ignore
            return true;
        } else if ((k >= 32 && k <= 125) || k > 186) {//typeable characters
            if(this.cfg.getProperty('disabled') || this.editable != true) return true;
            var p = this.seekNext(pos.begin - 1);
            if (p < this.maskLength) {
                var c = String.fromCharCode(k);
                if (this.tests[p].test(c)) {
                    this.shiftR(p);
                    this.buffer[p] = c;
                    this.writeBuffer();
                    var next = this.seekNext(p);
                    this.setCaret(next);
                    /*
                     * 이벤트 처리 할까? 오히려 성능 저하 및 소스가 꼬일 확율이 있어서리...
                    if (this.completed && next == this.maskLength)
                        this.completed.call(input);
                    */
                }
            }
        }
        Ev.preventDefault(e);
        return false;
    },
    /**
     * @description mask 적용시 buffer값중 현재 위치가 찾기
     * @method seekNext
     * @protected
     * @param {int} pos mask의 현재 위치값
     * @return {void}
     */
    seekNext: function(pos) {
        while (++pos <= this.maskLength && !this.tests[pos]);
        return pos;
    },
    /**
     * @description mask 적용시 buffer를 지정하는 위치를 왼쪽으로 이동
     * @method shiftL
     * @protected
     * @param {int} pos 이동할 값
     * @return {void}
     */
    shiftL: function(pos) {
        while (!this.tests[pos] && --pos >= 0);
        for (var i = pos; i < this.maskLength; i++) {
            if (this.tests[i]) {
                this.buffer[i] = this.maskPlaceholder;
                var j = this.seekNext(i);
                if (j < this.maskLength && this.tests[i].test(this.buffer[j])) {
                    this.buffer[i] = this.buffer[j];
                } else
                    break;
            }
        }
        this.writeBuffer();
        this.setCaret(Math.max(this.firstNonMaskPos, pos));
    },
    /**
     * @description mask 적용시 buffer를 지정하는 위치를 오른쪽으로 이동
     * @method shiftR
     * @protected
     * @param {int} pos 이동할 값
     * @return {void}
     */
    shiftR: function(pos) {
        for (var i = pos, c = this.maskPlaceholder; i < this.maskLength; i++) {
            if (this.tests[i]) {
                var j = this.seekNext(i);
                var t = this.buffer[i];
                this.buffer[i] = c;
                if (j < this.maskLength && this.tests[j].test(t))
                    c = t;
                else
                    break;
            }
        }
    },
    /**
     * @description mask 적용시 입력값의 유효성을 검사하여 실제 값에 대입하는 메소드
     * @method checkVal
     * @protected
     * @param {boolean} allow 이동할 값
     * @return {int}
     */
    checkValue: function(allow) {
        var test = this.getDisplayValue();
        var lastMatch = -1;
        for (var i = 0, pos = 0; i < this.maskLength; i++) {
            if (this.tests[i]) {
                this.buffer[i] = this.maskPlaceholder;
                while (pos++ < test.length) {
                    var c = test.charAt(pos - 1);
                    if (this.tests[i].test(c)) {
                        this.buffer[i] = c;
                        lastMatch = i;
                        break;
                    }
                }
                if (pos > test.length)
                    break;
            } else if (this.buffer[i] == test[pos] && i!=this.partialPosition) {
                pos++;
                lastMatch = i;
            }
        }
        if (!allow && lastMatch + 1 < this.partialPosition) {
            test = '';
            this.clearBuffer(0, this.maskLength);
        } else if (allow || lastMatch + 1 >= this.partialPosition) {
            this.writeBuffer();
            if (!allow) {
                test = this.getDisplayValue().substring(0, lastMatch + 1);
            };
        }
        return {
            pos: (this.partialPosition ? i : this.firstNonMaskPos),
            displayValue: test
        };
    },
    /**
     * @description 입력된 값의 유효성 체크
     * @method validateValue
     * @protected
     * @param {String} value 입력된 값
     * @return {boolean}
     */
    validateValue: function(value) {
        if (this.type == 'email' && this.getValue() != '')
            return new Rui.validate.LEmailValidator({id: this.id}).validate(this.getValue());
        return true;
    },
    /**
     * @description record id에 해당되는 LElement을 리턴한다.
     * @method findRowElById
     * @protected
     * @param {String} rowId 찾을 row id
     * @return {Rui.LElement}
     */
    findRowElById: function(rowId) {
    	if(!this.optionDivEl) return null;
        var rowEl = this.optionDivEl.select('.L-row-' + rowId);
        return rowEl.length > 0 ? rowEl.getAt(0) : null;
    },
    /**
     * @description 객체를 destroy하는 메소드
     * <p>Sample: <a href="./../sample/general/ui/form/textboxSample.html" target="_sample">보기</a></p>
     * @method destroy
     * @public
     * @return {void}
     */
    destroy: function() {
        if(this.dataSet)
            this.doUnSyncDataSet();

        if(this.inputEl) {
            this.inputEl.unOnAll();
            this.inputEl.remove();
            delete this.inputEl;
        }

        if (this.displayEl) {
        	this.displayEl.unOnAll();
            this.displayEl.remove();
            delete this.displayEl;
        }
        if (this.optionDivEl) {
        	this.optionDivEl.unOnAll();
            this.optionDivEl.remove();
            delete this.optionDivEl;
        }
        Rui.ui.form.LTextBox.superclass.destroy.call(this);
    },
    getNormalValue: function(val) {
    	return val;
    }
});
})();

/**
 * Form
 * @module ui_form
 * @title LCombo
 * @requires Rui
 */
Rui.namespace('Rui.ui.form');
/**
 * 데이터셋과 맵핑되어 있는 Combo 편집기
 * @namespace Rui.ui.form
 * @class LCombo
 * @extends Rui.ui.form.LTextBox
 * @sample default
 * @constructor LCombo
 * @param {HTMLElement | String} id The html element that represents the Element.
 * @param {Object} config The intial LCombo.
 */
Rui.ui.form.LCombo = function(config){
    config = Rui.applyIf(config || {}, Rui.getConfig().getFirst('$.ext.combo.defaultProperties'));
    
    var configDataSet = Rui.getConfig().getFirst('$.ext.combo.dataSet');
    if(configDataSet){
        if(!config.valueField && configDataSet.valueField)
            config.valueField = configDataSet.valueField;
        if(!config.displayField && configDataSet.displayField)
            config.displayField = configDataSet.displayField;
    }
    
    this.emptyText = config.emptyText || this.emptyText;
    this.dataMap = {};

    Rui.ui.form.LCombo.superclass.constructor.call(this, config);
    
    this.dataSet.focusFirstRow = Rui.isUndefined(this.focusFirstRow) == false ? this.focusFirstRow : false;
    
    if(this.dataSet.getRow() > -1 && this._rendered == true && this.forceSelection === true) {
        // 딜레마때문에 구현된 소스
        this.setDisplayValue(this.dataSet.getNameValue(this.dataSet.getRow(), this.displayField));
    }
    
    // wheel event 
    this.onWheelDelegate = Rui.util.LFunction.createDelegate(this.onWheel,this);
};

Rui.extend(Rui.ui.form.LCombo, Rui.ui.form.LTextBox, {
    /**
     * @description 객체의 문자열
     * @property otype
     * @private
     * @type {String}
     */
    otype: 'Rui.ui.form.LCombo',
    /**
     * @description 기본 CSS명
     * @property CSS_BASE
     * @private
     * @type {String}
     */
    CSS_BASE: 'L-combo',
    /**
     * @description Combo의 목록 구현을 위해 실제의 값(value)과 화면에 출력되는 값(text)이 존재 하는데 그중 실제의 값에 해댕하는 필드(Field)명
     * 주의! 이 값을 잘못 지정할 경우 선택된 item의 값을 getValue 등의 메소드를 이용하여 가져올 수 없다.
     * @config valueField
     * @sample default
     * @type {String}
     * @default 'value'
     */
    /**
     * @description Combo의 목록 구현을 위해 실제의 값(value)과 화면에 출력되는 값(text)이 존재 하는데 그중 실제의 값에 해댕하는 필드(Field)명
     * @property valueField
     * @private
     * @type {String}
     */
    valueField: 'value',
    /**
     * @description Combo의 목록 구현을 위해 실제의 값(value)과 화면에 출력되는 값(text)이 존재 하는데 그중 화면에 출력되는 값에 해댕하는 필드(Field)명
     * @config displayField
     * @sample default
     * @type {String}
     * @default 'text'
     */
    /**
     * @description Combo의 목록 구현을 위해 실제의 값(value)과 화면에 출력되는 값(text)이 존재 하는데 그중 화면에 출력되는 값에 해댕하는 필드(Field)명
     * @property displayField
     * @private
     * @type {String}
     */
    displayField: 'text',
    /**
     * @description 기본 emptyText 메시지의 다국어 코드값
     * @config emptyTextMessageCode
     * @sample default
     * @type {String}
     * @default '$.base.msg108'
     */
    /**
     * @description 기본 emptyText 메시지 코드값
     * @property emptyTextMessageCode
     * @private
     * @type {String}
     */
    emptyTextMessageCode: '$.base.msg108',
    /**
     * @description 값이 비였을때 출력할 text값
     * @config emptyText
     * @sample default
     * @type {String}
     * @default ''
     */
    /**
     * @description 값이 비였을때 출력할 text값
     * @property emptyText
     * @private
     * @type {String}
     */
    emptyText: null,
    /**
     * @description '선택하세요.' 항목 추가 여부
     * <p>Sample: <a href="./../sample/general/ui/form/textboxSample.html" target="_sample">보기</a></p>
     * @config useEmptyText
     * @sample default
     * @type {boolean}
     * @default true
     */
    /**
     * @description '선택하세요.' 항목 추가 여부
     * @property useEmptyText
     * @private
     * @type {boolean}
     */
    useEmptyText: true,
    /**
     * @description Picker Icon의 width
     * 기본값은 20이며 CSS에서 icon width를 변경할 경우 이 값도 동일하게 변경하여야 합니다.
     * @config iconWidth
     * @type {int}
     * @default 20
     */
    /**
     * @description Picker Icon의 width
     * 기본값은 20이며 CSS에서 icon width를 변경할 경우 이 값도 동일하게 변경하여야 합니다.
     * @property iconWidth
     * @private
     * @type {int} 
     */ 
    iconWidth: 20,
    /**
     * @description input과 Picker Icon간의 간격
     * @config iconMarginLeft
     * @type {int}
     * @default 1
     */
    /**
     * @description input과 Picker Icon간의 간격
     * @property iconMarginLeft
     * @private
     * @type {int}
     */
    iconMarginLeft: 1,
    /**
     * @description 데이터를 반드시 선택해야 하는 필수 여부
     * @config forceSelection
     * @sample default
     * @type {boolean}
     * @default true
     */
    /**
     * @description 데이터를 반드시 선택해야 하는 필수 여부
     * @property forceSelection
     * @private
     * @type {boolean}
     */
    forceSelection: true,
    /**
     * @description 변경전 마지막 출력값
     * @property lastDisplayValue
     * @private
     * @type {String}
     */
    lastDisplayValue: '',
    /**
     * @description 값 변경 여부
     * @property changed
     * @private
     * @type {boolean}
     */
    changed: false,
    /**
     * @description 데이터 로딩시 combo의 row 위치
     * <p>Sample: <a href="./../sample/general/ui/form/comboSample.html" target="_sample">보기</a></p>
     * @config selectedIndex
     * @sample default
     * @type {int}
     * @default -1
     */
    /**
     * @description 데이터 로딩시 combo의 row 위치
     * @property selectedIndex
     * @private
     * @type {int}
     */
    selectedIndex: -1,
    /**
     * @description edit 가능 여부
     * @config editable
     * @sample default
     * @type {boolean}
     * @default false
     */
    /**
     * @description edit 가능 여부
     * @property editable
     * @private
     * @type {boolean}
     */
    editable: false,
    /**
     * @description dataSet 사용 여부 
     * <p>Sample: <a href="./../sample/general/ui/form/textboxSample.html" target="_sample">보기</a></p>
     * @config useDataSet
     * @type {boolean}
     * @default true
     */
    /**
     * @description dataSet 사용 여부 
     * @property useDataSet
     * @private
     * @type {boolean}
     */
    useDataSet: true,
    /**
     * @description blur시 contains 체크를 할지 여부
     * @property checkContainBlur
     * @private
     * @type {boolean}
     */
    checkContainBlur: true,
    /**
     * @description bind시에 현재 combo의 displayField와 맵핑된 dataSet에 반영할 출력 필드 
     * @config rendererField
     * @type {String}
     * @default null
     */
    /**
     * @description bind시에 현재 combo의 displayField와 맵핑된 dataSet에 반영할 출력 필드 
     * @property rendererField
     * @private
     * @type {String}
     */
    rendererField: null,
    /**
     * @description 콤보의 보이는 값(displayField)을 그리드와 맵팽해주는 속성
     * @config autoMapping
     * @sample default
     * @type {boolean}
     * @default false
     */
    /**
     * @description 콤보의 보이는 값(displayField)을 그리드와 맵팽해주는 속성
     * @property autoMapping
     * @private
     * @type {boolean}
     */
    autoMapping: false,
    /**
     * @description display값을 저장한 데이터 
     * @property dataMap
     * @private
     * @type {Object}
     */
    dataMap: null,
    /**
     * @description LCombo에서 사용하는 DataSet ID
     * @config dataSetId
     * @type {String}
     * @default 'dataSet'
     */
    /**
     * @description LCombo에서 사용하는 DataSet ID
     * @property dataSetId
     * @private
     * @type {String}
     */
    dataSetId: null,
    /**
     * @description LCombo에서 초기 생성시 기본 데이터를 로드할 데이터 (예: items: [ { code: 'Y' }, { code: 'N' } ]
     * items는 code와 value로 valueField와 displayField와 맵핑할 수 있다.
     * @config items
     * @sample default
     * @type {Object}
     * @default null
     */
    /**
     * @description LCombo에서 초기 생성시 기본 데이터를 로드할 데이터 (예: items: [ { code: 'Y' }, { code: 'N' } ]
     * items는 code와 value로 valueField와 displayField와 맵핑할 수 있다.
     * @property items
     * @private
     * @type {Object}
     */
    items: null,
    /**
     * @description Dom객체 생성 및 초기화하는 메소드
     * @method initComponent
     * @protected
     * @param {String|Object} el 객체의 아이디나 객체
     * @param {Object} config 환경정보 객체
     * @return {void}
     */
    initComponent: function(config) {
        this.emptyText = this.emptyText == null ? Rui.getMessageManager().get(this.emptyTextMessageCode) : this.emptyText;
        if(this.cfg.getProperty('useEmptyText') === true)
           this.forceSelection = false; 
        if(this.rendererField || this.autoMapping) this.beforeRenderer = this.comboRenderer;
        if(this.items) {
            this.createDataSet();
            this.loadItems();
            this.doDataChangedDataSet();
            this.isLoad = true;
            this.initDataSet();
            this.focusDefaultValue();
            //this.doRowPosChangedDataSet(this.dataSet.getRow());
        }
    },
    /**
     * @description 객체의 이벤트 초기화 메소드
     * @method initEvents
     * @protected
     * @return {void}
     */
    initEvents: function() {
    	Rui.ui.form.LCombo.superclass.initEvents.call(this);
        this.initAutoMapDataSet();
    },
    /**
     * @description autoMapping이 true일 경우 데이터셋에 이벤트를 탑재한다.
     * @method initAutoMapDataSet
     * @protected
     * @return {void}
     */
    initAutoMapDataSet: function() {
        if(this.autoMapping && this.dataSet) {
            this.doUnOnClearMapDataSet();
            this.doOnClearMapDataSet();
        }
    },
    /**
     * @description dataset을 초기화한다.
     * @method initDataSet
     * @protected
     * @return {void}
     */
    initDataSet: function() {
        Rui.ui.form.LCombo.superclass.initDataSet.call(this);
        if(this.initSync && this.dataSet)
            this.dataSet.sync = true;
    },
    /**
     * @description render시 호출되는 메소드
     * @method doRender
     * @protected
     * @param {String|Object} parentNode 부모노드
     * @return {void}
     */
    doRender: function(){
        this.createTemplate(this.el);
        
        var hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = this.name || this.id;
        hiddenInput.id = Rui.useFixedId() ? Rui.id(this.el, 'LCombo-hidden-' + this.id) : Rui.id();
        hiddenInput.instance = this;
        hiddenInput.className = 'L-instance L-hidden-field';
        this.el.appendChild(hiddenInput);
        this.hiddenInputEl = Rui.get(hiddenInput);
        this.hiddenInputEl.addClass('L-hidden-field');
        
        this.inputEl.removeAttribute('name');
        this.inputEl.setStyle('ime-mode', 'disabled'); // IE,FX
        
        var input = this.inputEl.dom;
        if(Rui.useAccessibility()){
            input.setAttribute('role', 'combobox');
           // input.setAttribute('aria-labelledby', elContainer.id);
            input.setAttribute('aria-readonly', 'true');
            input.setAttribute('aria-autocomplete', 'none');
           // input.setAttribute('aria-owns', '');
            hiddenInput.setAttribute('role', 'combobox');
            hiddenInput.setAttribute('aria-hidden', 'true');
        }
        
        this.doRenderButton();
    },
    /**
     * @description Combo의 버튼 생성
     * @method doRenderButton
     * @private
     * @return {void}
     */
    doRenderButton: function(){
        var iconDiv = document.createElement('div');
        iconDiv.className = 'icon';
        iconDiv.id = Rui.useFixedId() ? Rui.id(this.el, 'LCombo-icon-' + this.id) : Rui.id();
        this.el.appendChild(iconDiv);
        this.iconEl = Rui.get(iconDiv);
    },
    /**
     * @description dataMap을 초기화한다.
     * @method onClearDataMap
     * @protected
     * @return {void}
     */
    onClearDataMap: function(e) {
        this.dataMap = {};
    },
    /**
     * @description dataSet의 sync 적용 메소드
     * @method doSyncDataSet
     * @protected
     * @return {void}
     */
    doOnClearMapDataSet: function() {
        this.dataSet.on('load', this.onClearDataMap, this, true);
        this.dataSet.on('dataChanged', this.onClearDataMap, this, true);
        this.dataSet.on('add', this.onClearDataMap, this, true);
        this.dataSet.on('update', this.onClearDataMap, this, true);
        this.dataSet.on('remove', this.onClearDataMap, this, true);
        this.dataSet.on('undo', this.onClearDataMap, this, true);
    },
    /**
     * @description dataSet의 unsync 적용 메소드
     * @method doUnSyncDataSet
     * @protected
     * @return {void}
     */
    doUnOnClearMapDataSet: function(){
        this.dataSet.unOn('load', this.onClearDataMap, this);
        this.dataSet.unOn('dataChanged', this.onClearDataMap, this);
        this.dataSet.unOn('add', this.onClearDataMap, this);
        this.dataSet.unOn('update', this.onClearDataMap, this);
        this.dataSet.unOn('remove', this.onClearDataMap, this);
        this.dataSet.unOn('undo', this.onClearDataMap, this);
    },
    /**
     * @description element Dom객체 생성
     * @method createContainer
     * @protected
     * @param {HTMLElement} parentNode 부모 노드
     * @return {HTMLElement}
     */
    createContainer: function(parentNode) {
        if(this.el) {
            if(this.el.dom.tagName == 'SELECT') {
                var Dom = Rui.util.LDom;
                this.id = this.id || this.el.id;
                this.oldDom = this.el.dom;
                var opts = this.oldDom.options;
                if(opts && 0 < opts.length) {
                    this.items = [];
                    for (var i = 0 ; opts && i < opts.length; i++) {
                        if(Dom.hasClass(opts[i], 'empty')) {
                            this.cfg.setProperty('useEmptyText', true);
                            this.emptyText = opts[i].text;
                            continue;
                        }
                        var option = {};
                        option[this.valueField] = opts[i].value;
                        option[this.displayField] = opts[i].text;
                        this.items.push(option);
                        if(opts[i].selected) this.defaultValue = opts[i].value;
                    }
                }
                this.name = this.name || this.oldDom.name;
                var parent = this.el.parent();
                this.el = Rui.get(this.createElement().cloneNode(false));
                this.el.dom.id = this.id;
                Dom.replaceChild(this.el.dom, this.oldDom);
                this.el.appendChild(this.oldDom);
                Dom.removeNode(this.oldDom);
                delete this.oldDom;
            }
        }
        Rui.ui.form.LTextBox.superclass.createContainer.call(this, parentNode);
    },
    /**
     * @description render 후 호출하는 메소드
     * @method afterRender
     * @protected
     * @param {HttpElement} container 부모 객체
     * @return {void}
     */
    afterRender: function(container) {
        Rui.ui.form.LCombo.superclass.afterRender.call(this, container);
        
        if(this.items) {
            this.loadItems();
            this.doDataChangedDataSet();
            this.isLoad = true;
            this.initDataSet();
            this.focusDefaultValue();
            //this.doRowPosChangedDataSet(this.dataSet.getRow());
        }

        if(Rui.useAccessibility()){
            this.inputEl.setAttribute('aria-owns', this.optionDivEl.id);
            this.iconEl.setAttribute('aria-controls', this.optionDivEl.id);
        }
        if(this.isGridEditor && this.rendererField) this.initUpdateEvent();
        if(this.forceSelection === true && this.dataSet.getRow() < 0)
            this.dataSet.setRow(0);
        if(this.iconEl) this.iconEl.on('click', this.doIconClick, this, true);
        this.applyEmptyText();
    },
    /**
     * @description create DataSet
     * @method createDataSet
     * @private
     * @return {void}
     */
    createDataSet: function() {
        if(!this.dataSet) {
            this.dataSet = new (eval(this.dataSetClassName))({
                id: this.dataSetId || (this.id + 'DataSet'),
                fields:[
                    {id:this.valueField},
                    {id:this.displayField}
                ],
                focusFirstRow: false,
                sync: this.initSync === true ? true : false
            });
        }
    },
    /**
     * @description this.items에 있는 데이터를 DataSet으로 읽어온다.
     * @method loadItems
     * @private
     * @return {void}
     */
    loadItems: function() {
        this.dataSet.batch(function() {
            for (var i = 0 ; i < this.items.length ; i++) {
                var rowData = {};
                rowData[this.valueField] = this.items[i][this.valueField];
                rowData[this.displayField] = this.items[i][this.displayField] || this.items[i][this.valueField];
                var record = new Rui.data.LRecord(rowData, { dataSet: this.dataSet });
                this.dataSet.add(record);
                this.dataSet.setState(this.dataSet.getCount() - 1, Rui.data.LRecord.STATE_NORMAL);
            }
        }, this);
        this.dataSet.commit();
        this.dataSet.isLoad = true;
        delete this.items;
    },
    /**
     * @description icon click 이벤트가 발생하면 호출되는 메소드
     * @method doIconClick
     * @protected
     * @param {Object} e Event 객체
     * @return {void}
     */
    doIconClick: function(e) {
        if(!this.isFocus) {
            this.onFocus(e);
        }
        if(this.isExpand()){
            this.collapse();
            Rui.util.LEvent.removeListener(document,'mousewheel',this.onWheelDelegate);
        }
        else { 
            this.expand();
            Rui.util.LEvent.addListener(document, 'mousewheel',this.onWheelDelegate,this); 
        }
    },
    /**
     * @description mouseWheel 이벤트 발생시 펼쳐진 것을 닫음. 
     * @method onWheel
     * @protected
     * @param {Object} e Event 객체
     * @return {void}
     */
    onWheel: function(e){
        if(this.isExpand()){
             var target = e.target;
             if(this.el.isAncestor(target)){
                 this.collapse(); 
                 Rui.util.LEvent.addListener(document, 'mousewheel',this.onWheelDelegate,this);
             }
        }
    },
    /**
     * @description width 속성에 따른 실제 적용 메소드
     * @method _setWidth
     * @protected
     * @param {String} type 속성의 이름
     * @param {Array} args 속성의 값 배열
     * @param {Object} obj 적용된 객체
     * @return {void}
     */
    _setWidth: function(type, args, obj) {
        if(args[0] < 0) return;
        Rui.ui.form.LCombo.superclass._setWidth.call(this, type, args, obj);
        this.getDisplayEl().setWidth(this.getContentWidth() - (this.iconEl.getWidth() || this.iconWidth) - this.iconMarginLeft);
    },
    /**
     * @description Index 위치를 변경한다.
     * @method setSelectedIndex
     * @public
     * @param {int} idx 위치를 변경할 값
     * @return {void}
     */
    setSelectedIndex: function(idx) {
        if(this.dataSet.getCount() - 1 < idx) return;
        this.setValue(this.dataSet.getNameValue(idx, this.valueField));
    },
    /**
     * @description 출력객체에 내용을 변경한다.
     * @method setDisplayValue
     * @protected
     * @param {String} o 출력객체에 내용을 변경할 값
     * @return {void}
     */
    setDisplayValue: function(o) {
        if(o != this.getDisplayValue()) {
            o = this.forceSelection === true ? (this.isForceSelectValue(o) ? o : this.lastDisplayValue ) : o;

            this.inputEl.setValue(o);
            this.applyEmptyText();
            this.bindDataSet();
        }
        this.lastDisplayValue = this.inputEl.getValue();
        if(this.lastDisplayValue == this.emptyText)
            this.lastDisplayValue = '';
    },
    /**
     * @description 목록에서 선택된 항목에 대한 값을 값객체에 반영한다.
     * @method bindDataSet
     * @private
     * @return {void}
     */
    bindDataSet: function() {
    	var ds = this.dataSet;
        if(ds && !this.editable) {
        	var displayValue = this.getDisplayValue();
        	if(ds.getNameValue(ds.getRow(), this.displayField) != displayValue) {
            	var rId = this.getItemByRecordId(displayValue);
                if(rId) {
                	var dataIndex = ds.indexOfKey(rId);
            		ds.setRow(dataIndex, {isForce:ds.isFiltered()});
            		var r = ds.getAt(dataIndex);
                    if(r) this.hiddenInputEl.setValue(r.get(this.valueField));
                    else this.hiddenInputEl.setValue('');
                } else {
                    this.hiddenInputEl.setValue('');
                }
        	}
        }
        this.changed = true;
    },
    /**
     * @description state가 delete 상태를 제외한 index의 레코드를 리턴한다.
     * @method getRemovedSkipRow
     * @private
     * @param {Int} idx 찾고자 하는 index
     * @return {Rui.data.LRecord}
     */
    getRemovedSkipRow: function(idx) {
    	var ds = this.dataSet, r = null;
    	for (var i = 0, j = 0, len = ds.getCount(); i < len; i++) {
    		var r2 = ds.getAt(i);
        	if(r2.state != Rui.data.LRecord.STATE_DELETE) j++;
        	if(idx <= i && idx <= j) {
        		r = r2;
        		break;
        	}
    	}
    	return r;
    },
    /**
     * @description state가 delete 상태를 제외한 index의 레코드를 리턴한다.
     * @method getRemainRemovedRow
     * @private
     * @param {Int} idx 찾고자 하는 index
     * @return {Int}
     */
    getRemainRemovedRow: function(idx) {
    	var ds = this.dataSet, ri = -1;
    	for (var i = 0, j = 0; i < ds.getCount(); i++) {
    		var r2 = ds.getAt(i);
        	if(r2.state != Rui.data.LRecord.STATE_DELETE) j++;
        	if(idx == j) {
        		ri = j;
        		break;
        	}
    	}
    	return ri;
    },
    /**
     * @description 목록에서 선택되었는지 여부
     * @method isForceSelectValue
     * @private
     * @param {String} o 비교할 값
     * @return {void}
     */
    isForceSelectValue: function(o) {
        var listElList = this.optionDivEl.select('.L-list');
        var isSelection = false;
        listElList.each(function(child){
            var firstChild = child.select('.L-display-field').getAt(0).dom.firstChild;
            if(firstChild && firstChild.nodeValue == o) {
                isSelection = true;
                return false;
            }
        });

        return isSelection;
    },
    /**
     * @description 값이 없으면 기본 메시지를 출력하는 메소드
     * @method applyEmptyText
     * @private
     * @return {void}
     */
    applyEmptyText: function() {
        if(this.useEmptyText == false) return;
        if(this.inputEl.getValue() == '' || this.inputEl.getValue() == this.emptyText) {
            this.inputEl.setValue(this.emptyText);
            this.inputEl.addClass('empty');
        } else {
            this.inputEl.removeClass('empty');
        }
    },
    /**
     * @description 출력 객체의 값을 리턴
     * @method getDisplayValue
     * @return {String} 출력값
     */
    getDisplayValue: function() {
        if(!this.inputEl) return null;
        var o = this.inputEl.getValue();
        o = (o == this.emptyText) ? '' : o;
        return o;
    },
    /**
     * @description 현재 DataSet의 fieldName에 해당되는 값을 리턴
     * @method getBindValue
     * @sample default
     * @param {String} fieldName [optional] 필드이름
     * @return {Object} 출력값
     */
    getBindValue: function(fieldName) {
        fieldName = fieldName || this.valueField;
        var val = this.getValue();
        var row = this.dataSet.findRow(this.valueField, val);
        if(row < 0) return '';
        return this.dataSet.getAt(row).get(fieldName);
    },
    /**
     * @description DataSet의 내용으로 목록을 재생성하는 메소드
     * @method repaint
     * @public
     * @return {void}
     */
    repaint: function() {
        this.onLoadDataSet();
        this.applyEmptyText();
    },
    /**
     * @description 목록에서 선택되면 출력객체에 값을 반영하는 메소드
     * @method doChangedItem
     * @protected
     * @param {HTMLElement} dom Dom 객체
     * @return {void}
     */
    doChangedItem: function(dom) {
        var listDom = Rui.get(dom).select('.L-display-field').getAt(0).dom;
        var row = this.findRowIndex(listDom);
        var val = (row > -1) ? this.dataSet.getNameValue(row, this.valueField) : this.emptyValue;
        this.setValue(val);
        if(this.isFocus) this.getDisplayEl().focus();
    },
    /**
     * @description 데이터셋이 update 메소드가 호출되면 수행하는 이벤트 메소드
     * @method onUpdateData
     * @protected
     * @return {void}
     */
    onUpdateData: function(e) {
        Rui.ui.form.LCombo.superclass.onUpdateData.call(this, e);
        var row = e.row, colId = e.colId, r, inputEl, displayValue;
        //if(colId != this.valueField) return;
        if(row == this.dataSet.getRow() && this.hiddenInputEl) {
            r = this.dataSet.getAt(row);
            if(colId == this.valueField)
                this.hiddenInputEl.setValue(r.get(this.valueField));
            if(colId == this.displayField){
                inputEl = this.getDisplayEl();
                displayValue = r.get(this.displayField);
                displayValue = Rui.isEmpty(displayValue) ? '' : displayValue;
                inputEl.setValue(displayValue);
            }
        }
    },
    /**
     * @description 데이터셋이 RowPosChanged 메소드가 호출되면 수행하는 메소드
     * @method onRowPosChangedDataSet
     * @protected
     * @param {Object} e Event 객체
     * @return {void}
     */
    onRowPosChangedDataSet: function(e) {
        this.doRowPosChangedDataSet(e.row, true);
    },
    /**
     * @description 데이터셋이 RowPosChanged 메소드가 호출되면 수행하는 메소드
     * @method doRowPosChangedDataSet
     * @protected
     * @param {int} row row 값
     * @param {boolean} ignoreEvent [optional] event 무시 여부
     * @return {void}
     */
    doRowPosChangedDataSet: function(row, ignoreEvent) {
        if(!this.hiddenInputEl) return;
        var ds = this.dataSet;
        var r = null;
        if(ds.remainRemoved) {
        	r = this.getRemovedSkipRow(row);
        } else r = ds.getAt(row);
        if(row < 0) {
        	this.hiddenInputEl.setValue('');
            this.setDisplayValue('');
        } else {
            if(row < 0 || row >= ds.getCount()) return;
            var value = r.get(this.valueField);

            value = Rui.isEmpty(value) ? '' : value;
            this.hiddenInputEl.setValue(value);
            var displayValue = r.get(this.displayField);
            displayValue = Rui.isEmpty(displayValue) ? '' : displayValue;
            this.inputEl.setValue(displayValue);
        }
        if(r) {
            var rowEl = this.findRowElById(r.id);
            if(rowEl) {
                if(!rowEl.hasClass('active')) {
                    this.optionDivEl.select('.active').removeClass('active');
                    rowEl.addClass('active');
                    rowEl.dom.tabIndex = 0;
                    rowEl.focus();
                    if(this.isFocus) this.getDisplayEl().focus();
                    rowEl.dom.removeAttribute('tabIndex');
                }
            }
        } else if(row === -1 && this.useEmptyText === true){
            this.optionDivEl.select('.active').removeClass('active');
            var rowEl = Rui.get(this.optionDivEl.dom.childNodes[0]);
            if(rowEl) {
                rowEl.addClass('active');
                rowEl.dom.tabIndex = 0;
                rowEl.focus();
                if(this.isFocus) this.getDisplayEl().focus();
                rowEl.dom.removeAttribute('tabIndex');
            }
        }
        if(this.ignoreChangedEvent !== true) {
            this.doChanged();
        }
    },
    /**
     * @description 현재 값을 리턴
     * @method getValue
     * @public
     * @return {String} 결과값
     */
    getValue: function() {
        if(!this.hiddenInputEl) return this.emptyValue;
        var val = this.hiddenInputEl.getValue();
        if(val === '')
            return this.getEmptyValue(val);
        return val;
    },
    /**
     * @description 값을 변경한다.
     * @method setValue
     * @public
     * @param {String} o 반영할 값
     * @return {void}
     */
    setValue: function(o, ignore) {
        if(!this.hiddenInputEl) return;
        if(this._newLoaded !== true && this.hiddenInputEl.dom.value === o) return;
        this._newLoaded = false;
        var ds = this.dataSet;
        if(this.bindMDataSet && this.bindMDataSet.getRow() > -1 && ds.isLoad !== true)
        	return;
        if(this.isLoad == true) {
            var row = ds.findRow(this.valueField, o);
            this.ignoreChangedEvent = true;
            if(row !== ds.getRow())
                ds.setRow(row);
            else {
                if(row > -1) {
                    this.hiddenInputEl.dom.value = o;
                    this.getDisplayEl().setValue(ds.getNameValue(row, this.displayField));
                }
            }
            row = ds.getRow();
            delete this.ignoreChangedEvent;
            if(this.forceSelection !== true && row < 0)
                this.hiddenInputEl.dom.value = '';
            if (row < 0) {
                this.getDisplayEl().setValue('');
                this.applyEmptyText();
            }
        } else 
            this.setDefaultValue(o);

        if(ignore !== true) this.doChanged();
    },
    /**
     * @description disabled 속성에 따른 실제 적용 메소드
     * @method _setDisabled
     * @protected
     * @param {String} type 속성의 이름
     * @param {Array} args 속성의 값 배열
     * @param {Object} obj 적용된 객체
     * @return {void}
     */
    _setDisabled: function(type, args, obj) {
        if(this.isExpand()) this.collapse();
        Rui.ui.form.LCombo.superclass._setDisabled.call(this, type, args, obj);
    },
    /**
     * @description display renderer
     * @method displayRenderer
     * @protected
     * @param {Rui.ui.form.LCombo} combo 콤보 객체
     * @return {String}
     */
    displayRenderer: function(combo) {
        var dataSet = combo.getDataSet();
        return function(val, p, record, row, i) {
            var displayValue = null;
            if(record.state == Rui.data.LRecord.STATE_NORMAL) {
                displayValue = record.get(combo.displayField);
            } else {
                var row = dataSet.findRow(combo.valueField, val);
                displayValue = (row > -1) ? dataSet.getAt(row).get(combo.displayField) : val;
            }
            return displayValue ;
        };
    },
    /**
     * @description focus 이벤트 발생시 호출되는 메소드
     * @method onFocus
     * @private
     * @param {Object} e Event 객체
     * @return {void}
     */
    onFocus: function(e) {
        Rui.ui.form.LCombo.superclass.onFocus.call(this, e);
        var inputEl = this.getDisplayEl();
        inputEl.removeClass('empty');
        if(inputEl.getValue() == this.emptyText) {
            if(this.editable === true) 
                inputEl.setValue('');
        }
        if(this.editable) Rui.util.LEvent.addListener(Rui.browser.msie ? document.body : document, 'mousedown', this.onEditableChanged, this, true);
    },
    /**
     * @description editable 속성이 적용될때 mousedown이 발생하면 호출되는 메소드
     * @method onEditableChanged
     * @private
     * @param {Object} e Event 객체
     * @return {void}
     */
    onEditableChanged: function(e) {
    	this.doEditableChanged();
    },
    /**
     * @description editable 속성이 적용될때 현재값이 제대로 적용되게 하는 메소드
     * @method doEditableChanged
     * @private
     * @param {Object} e Event 객체
     * @return {void}
     */
    doEditableChanged: function() {
        var displayValue = this.getDisplayValue();
        var findValue = this.findValueByDisplayValue(displayValue);
        if(this.forceSelection == false && (displayValue == '' || findValue == null)) this.setValue(this.emptyValue);
        else if(this.lastDisplayValue != displayValue) this.setValue(findValue);
    },
    /**
     * @description blur 이벤트 발생시 호출되는 메소드
     * @method onBlur
     * @private
     * @param {Object} e Event 객체
     * @return {void}
     */
    onBlur: function(e) {
        Rui.ui.form.LCombo.superclass.onBlur.call(this, e);
        this.doForceSelection();
        this.applyEmptyText();
        if(this.editable) Rui.util.LEvent.removeListener(Rui.browser.msie ? document.body : document, 'mousedown', this.onEditableChanged);
        if(this.autoComplete && this.editable) this.clearFilter();
    },
    /**
     * @description combo list 에 걸린 filter 를 초기화
     * @method clearFilter
     * @private
     * @return {void}  
     */
    clearFilter: function() {
    	if(this.dataSet && this.dataSet.isFiltered() == true) {
    		var row = this.dataSet.getRow();
            var r = this.dataSet.getAt(row);
        	this.dataSet.clearFilter(false);
        	if(r !== undefined) {
	        	row = this.dataSet.indexOfKey(r.id);
	        	this.dataSet.focusRow({
	                ignoreCanRowPosChange: true,
	                forceRow: true,
	                row: row
	            });
        	}
        }
    },
    /**
     * @description Keydown 이벤트가 발생하면 처리하는 메소드
     * @method onKeydown
     * @private
     * @param {Object} e Event 객체
     * @return {void}
     */
    onKeydown: function(e){
    	if(this.editable)
            if(e.keyCode == Rui.util.LKey.KEY.TAB) this.doEditableChanged();
    	Rui.ui.form.LCombo.superclass.onKeydown.call(this, e);
    },
    /**
     * @description renderer를 수행하는 메소드
     * @method comboRenderer
     * @protected
     * @return {String}
     */
    comboRenderer: function(val, p, record, row, i) {
        if(Rui.isEmpty(val)) return '';
        var rVal = undefined;
        rVal = this.dataMap[val];
        if(Rui.isUndefined(rVal)) {
            if(this.autoMapping) {
                if(this.dataSet.isFiltered()) {
                    for (var i = 0, len = this.dataSet.snapshot.length; i < len ; i++) {
                        var r = this.dataSet.snapshot.getAt(i);
                        if(r.get(this.valueField) === val) {
                            rVal = r.get(this.displayField);
                            break;
                        }
                    }
                } else {
                    var cRow = this.dataSet.findRow(this.valueField, val);
                    if (cRow > -1) {
                        rVal = this.dataSet.getNameValue(cRow, this.displayField);
                    }
                }
            }
        }
        if(Rui.isUndefined(rVal)) rVal = this.rendererField ? record.get(this.rendererField) : val;
        if(Rui.isUndefined(rVal)) rVal = this.dataMap[val] ? this.dataMap[val] : rVal;
        this.dataMap[val] = rVal;
        return rVal;
    },
    /**
     * @description 그리드에 올라가는 콤보의 경우 code값이 변경될 경우 display값도 변경되게 수정 
     * @method initUpdateEvent
     * @private
     * @return {void}
     */
    initUpdateEvent: function() {
        if(!this.gridPanel || this.isInitUpdateEvent === true || !this.rendererField) return;
        var gridDataSet = this.gridPanel.getView().getDataSet();
        this.on('changed', function(e){
            gridDataSet.setNameValue(gridDataSet.getRow(), this.rendererField, this.dataSet.getNameValue(this.dataSet.getRow(), this.displayField));
        }, this, true);
        this.isInitUpdateEvent = true;
    },
    /**
     * @description 출력데이터가 변경되면 호출되는 메소드
     * @method doChangedDisplayValue
     * @private
     * @param {String} o 적용할 값
     * @return {void}
     */
    doChangedDisplayValue: function(o) {
        this.bindDataSet();
    },
    /**
     * @description 필수 선택 메소드
     * @method doForceSelection
     * @private
     * @return {void}
     */
    doForceSelection: function() {
        if(this.forceSelection === true) {
            if(this.changed == true) {
                var inputEl = this.getDisplayEl();
                var row = this.dataSet.findRow(this.displayField, inputEl.getValue());
                if(row < 0)
                    this.setDisplayValue(this.lastDisplayValue);
                else
                    this.bindDataSet();
            }
        }
    },
    /**
     * @description dataset을 변경한다.
     * @method setDataSet
     * @public
     * @param {Rui.data.LDataSet} newDataSet 신규 DataSet
     * @return {Rui.data.DataSet}
     */
    setDataSet: function(d) {
        Rui.ui.form.LCombo.superclass.setDataSet.call(this, d);
        this.initAutoMapDataSet();
    },
    /**
     * @description 로드한 데이터를 캐쉬한다.
     * @method doCacheData
     * @protected
     * @return {void}
     */
    doCacheData: function() {
        for (var i = 0 ; i < this.dataSet.getCount(); i++) {
            this.dataMap[this.dataSet.getNameValue(i, this.valueField)] = this.dataSet.getNameValue(i, this.displayField);
        }
    },
    /**
     * @description 캐쉬한 데이터를 초기화한다.
     * @method clearCacheData
     * @protected
     * @return {void}
     */
    clearCacheData: function() {
        this.dataMap = {};
    },
    /**
     * @description dislayField에 해당되는 값으로 validField에 해당하는 값을 찾는다.
     * @method findValueByDisplayValue
     * @param {Sring} displayValue 찾고자하는 display값
     * @return {String}
     */
    findValueByDisplayValue: function(displayValue) {
    	var eRow = -1;
        this.dataSet.data.each(function(id, record, i){
        	var recordValue = record.get(this.displayField);
            if (recordValue && recordValue.toLowerCase() == displayValue.toLowerCase()) {
            	eRow = i;
                return false;
            }
        }, this);
        if(eRow > -1)
            return this.dataSet.getAt(eRow).get(this.valueField);
        return null;
    },
    /**
     * @description 객체를 destroy하는 메소드
     * @method destroy
     * @public
     * @return {void}
     */
    destroy: function() {
        if(this.iconEl) {
            this.iconEl.remove();
            delete this.iconEl;
        }
        Rui.ui.form.LCombo.superclass.destroy.call(this);
        this.dataMap = null;
        this.iconEl = null;
        this.hiddenInputEl = null;
    }
});
/**
 * LCheckBox
 * @module ui_form
 * @title LCheckBox
 * @requires Rui
 */
Rui.namespace('Rui.ui.form');
/**
 * input태그의 type이 checkbox로 정의된 LCheckBox 객체 편집기
 * @namespace Rui.ui.form
 * @class LCheckBox
 * @extends Rui.ui.form.LField
 * @sample default
 * @constructor LCheckBox
 * @param {Object} config The intial LCheckBox.
 */
Rui.ui.form.LCheckBox = function(config){
    config = Rui.applyIf(config || {}, Rui.getConfig().getFirst('$.ext.checkBox.defaultProperties'));
    Rui.ui.form.LCheckBox.superclass.constructor.call(this, config);
};
Rui.extend(Rui.ui.form.LCheckBox, Rui.ui.form.LField, {
    /**
     * @description 객체의 문자열
     * @property otype
     * @private
     * @type {String}
     */
    otype: 'Rui.ui.form.LCheckBox',
    /**
     * @description 기본 CSS명
     * @property CSS_BASE
     * @private
     * @type {String}
     */
    CSS_BASE: 'L-checkbox',
    /**
     * @description label로 출력할 값
     * @config label
     * @sample default
     * @type {String}
     * @default null
     */
    /**
     * @description label로 출력할 값
     * @property label
     * @private
     * @type {String}
     */
    label: '',
    /**
     * @description input태그의 value값
     * @config value
     * @sample default
     * @type {String}
     * @default null
     */
    /**
     * @description input태그의 value값
     * @property value
     * @private
     * @type {String}
     */
    value: null,
    /**
     * @description 체크 상태 여부
     * @config checked
     * @sample default
     * @type {boolean}
     * @default false
     */
    /**
     * @description 체크 상태 여부
     * @property checked
     * @private
     * @type {boolean}
     */
    checked: false,
    /**
     * @description value checkbox 선택시 dataset에 bind할 값
     * bindValues를 사용시에는 반드시 value값을 bindValues의 0번째 값으로 지정하여야 정상 동작합니다.
     * @config bindValues
     * @sample default
     * @type {Array}
     * @default null
     */
    /**
     * @description checkbox 선택시 dataset에 bind할 값
     * bindValues를 사용시에는 반드시 value값을 bindValues의 0번째 값으로 지정하여야 정상 동작합니다.
     * @property bindValues
     * @private
     * @type {Array}
     */
    bindValues: null,
    /**
     * @description checkbox 선택시 dataset에 bind할 값을 리턴하는 function
     * @config bindFn
     * @sample default
     * @type {Function}
     * @default null
     */
    /**
     * @description checkbox 선택시 dataset에 bind할 값을 리턴하는 function
     * @property bindFn
     * @private
     * @type {Function}
     */
    bindFn: null,
    /**
     * @description 그리드에 고정된 형태로의 출력 여부
     * @config gridFixed
     * @type {boolean}
     * @default false
     */
    /**
     * @description 그리드에 고정된 형태로의 출력 여부
     * @property gridFixed
     * @private
     * @type {boolean}
     */
    gridFixed: false, 
    /**
     * @description 객체를 Config정보를 초기화하는 메소드
     * @method initDefaultConfig
     * @protected
     * @return {void}
     */
    initDefaultConfig: function() {
        Rui.ui.form.LCheckBox.superclass.initDefaultConfig.call(this);
        this.cfg.addProperty('checked', {
            handler: this._setChecked
        });
    },
    /**
     * @description Dom객체 생성 및 초기화하는 메소드
     * @method initComponent
     * @protected
     * @param {Object} config 환경정보 객체 
     * @return {void}
     */
    initComponent: function(config){
        Rui.ui.form.LCheckBox.superclass.initComponent.call(this);
        if(this.gridFixed) this.beforeRenderer = this.gridFixedRenderer;
    },
    /**
     * @description element Dom객체 생성
     * @method createContainer
     * @protected
     * @param {HTMLElement} parentNode 부모 노드
     * @return {HTMLElement}
     */
    createContainer: function(parentNode) {
        if(this.el) {
            if(this.el.dom.tagName == 'INPUT') {
                var Dom = Rui.util.LDom;
                var dom = this.el.dom;
                
                this.id = this.id || this.el.id;
                if(this.checked === false) {
                    this.cfg.setProperty('checked', dom.checked);
                    this.checked = dom.checked;
                }
                this.name = this.name || dom.name;
                this.value = this.value || dom.value;
                var parent = this.el.parent();
                this.el = Rui.get(this.createElement().cloneNode(false));
                this.el.dom.id = this.id;
                Dom.replaceChild(this.el.dom, dom);
                this.el.appendChild(dom);
                Dom.removeNode(dom);
                this.el.dom.id = dom.id;
            }
        }
        Rui.ui.form.LCheckBox.superclass.createContainer.call(this, parentNode);
    },
    /**
     * @description render시 호출되는 메소드
     * @method doRender
     * @protected
     * @param {String|Object} appendToNode 부모객체 정보
     * @return {void}
     */
    doRender: function(appendToNode) {
        this.createTemplate();
        
        this.el.addClass(this.CSS_BASE + '-panel');
        this.el.addClass('L-fixed');
        this.el.addClass('L-form-field');
        if(this.width)
            this.el.setWidth(!Rui.isBorderBox ? this.width - 1 : this.width - 2);

        var html = this.getRenderBody();
        this.el.html(html);
        var input = this.el.select('input').getAt(0).dom;
        if (this.attrs) for (var m in this.attrs) input[m] = this.attrs[m];

        var displayEl = this.getDisplayEl();
        var keyEventName = Rui.browser.msie || Rui.browser.chrome || (Rui.browser.safari && Rui.browser.version == 3) ? 'keydown' : 'keypress';
        displayEl.on(keyEventName, this.onFireKey, this, true);

        input.instance = this;
        input.className = 'L-instance';

        /* 당장 필요 없음. 나중에 필요하면 주석 풀것.
        if(this.label){
            this.labelEl = this.el.select('label').getAt(0);
        }
        */
    },
    /**
     * @description gridFixed 속성일 경우 그리드 랜더링시에 이벤트를 연결한다.
     * @method gridBindEvent
     * @protected
     * @return {void}
     */
    gridBindEvent: function(gridPanel) {
        if(gridPanel && this.gridFixed == true && gridPanel.isExcel !== true) {
            gridPanel.on('beforeEdit', this.onBeforeEdit, this, true);
            gridPanel.on('cellClick', this.onCellClick, this, true);
            gridPanel.on('keypress', this.onCellKeypress, this, true);
        }
    },
    /**
     * @description gridFixed 속성일 경우 그리드 랜더링시에 이벤트를 분리한다.
     * @method gridUnBindEvent
     * @protected
     * @return {void}
     */
    gridUnBindEvent: function(gridPanel) {
        if(gridPanel && this.gridFixed == true && gridPanel.isExcel !== true) {
            gridPanel.unOn('beforeEdit', this.onBeforeEdit, this);
            gridPanel.unOn('cellClick', this.onCellClick, this);
            gridPanel.unOn('keypress', this.onCellKeypress, this);
        }
    },
    /**
     * @description template 생성
     * @method createTemplate
     * @protected
     * @return {void}
     */
    createTemplate: function() {
        var ts = this.templates || {};
        ts.input = new Rui.LTemplate('<input id="{id}" type="checkbox" name="{name}" class="' + this.CSS_BASE + '" style="{style}" value="{value}" {checked} />');
        ts.label = new Rui.LTemplate('<label for="{id}" class="L-label">{label}</label>');
        this.templates = ts;
    },
    /**
     * @description body html을 생성하여 리턴하는 메소드
     * @method getRenderBody
     * @protected
     * @return {String}
     */
    getRenderBody: function() {
        var ts = this.templates || {},
            html, p;
        p = {
            id: Rui.id(this.el, 'LCheckBox-' + this.id),
            name: this.name || this.id,
            value: this.value,
            label: this.label,
            checked: this.checked ? 'checked=""' : ''
        };
        html = ts.input.apply(p);
        if(this.label){
            html += ts.label.apply(p);
        }
        return html;
    },
    /**
     * @description render후 호출되는 메소드
     * @method afterRender
     * @protected
     * @param {HTMLElement} container 부모 객체
     * @return {void}
     */
    afterRender: function(container) {
        Rui.ui.form.LCheckBox.superclass.afterRender.call(this, container);

        this.getDisplayEl().dom.checked = this.cfg.getProperty('checked');

        this.el.on('click', function(e) {
            this.getDisplayEl().focus();
            Rui.util.LEvent.stopPropagation(e);
        }, this, true);

        var displayEl = this.getDisplayEl();
        if(displayEl) {
            displayEl.on('focus', this.onCheckFocus, this, true);
            displayEl.on('click', this.onClick, this, true);
        }

        if(Rui.useAccessibility()){
            this.el.setAttribute('role', 'checkbox');
            this.el.setAttribute('aria-checked', false);
            this.el.setAttribute('aria-describedby', 'checkbox ' + (this.name ? this.name:this.id));
        }
    },
    /**
     * @description 화면 출력되는 객체 리턴
     * @method getDisplayEl
     * @protected
     * @return {Rui.LElement} Element 객체
     */
    getDisplayEl: function() {
        if(!this.displayEl && this.el) {
            this.displayEl = this.el.select('input').getAt(0);
            this.displayEl.addClass('L-display-field');
        }
        return this.displayEl;
    },
    /**
     * @description 객체를 focus한다.
     * @method focus
     * @public
     * @return {void}
     */
    focus: function() {
        this.getDisplayEl().focus();
        return this;
    },
    /**
     * @description 객체를 blur한다.
     * @method blur
     * @public
     * @return {void}
     */
    blur: function() {
        this.getDisplayEl().blur();
        return this;
    },
    /**
     * @description 값을 변경한다.
     * @method setValue
     * @public
     * @sample default
     * @param {String|boolean} val 반영할 값
     * @return {void}
     */
    setValue: function(val) {
    	var ignoreEvent = false; // ignoreEvent를 인수로 받으면 안됨. 처리가 되어야 할 경우가 있고 아닌 경우가 있음. 멀티그룹 콤포넌트에 대한 딜레마
    	// ignoreEvent를 true로 호출해야 초기 editor 출력시 변경건이 존재하지 않는데 ignoreEvent를 false로 호출하면 반대로 내부 콤포넌트가 이벤트가 발생하지 않음. 
        var checked = (Rui.isBoolean(val)) ? val : (this.bindValues) ? this.bindValues[0] == val ? true : false : (Rui.isEmpty(val) == false && this.getRawValue() == val ? true:false);
        //if(this.cfg.getProperty('checked') == checked) return;
        if(ignoreEvent !== true) this.cfg.setProperty('checked', checked);
        return this;
    },
    /**
     * @description 현재 값을 리턴한다
     * @method getValue
     * @public
     * @sample default
     * @return {boolean || String} 결과값
     */
    getValue: function() {
        if(this.groupInstance) {
            return this.groupInstance.getValue();
        } else {
            var checked = this.cfg.getProperty('checked');
            return (this.bindFn) ? this.bindFn.call(this, checked) : (this.bindValues ? this.bindValues[checked ? 0 : 1] : this.getRawValue());
        }
    },
    /**
     * @description 현재 선택됬는지 여부를 반환한다.
     * @method isChecked
     * @public
     * @sample default
     * @return {boolean || String} 결과값
     */
    isChecked: function(){
    	return this.cfg.getProperty('checked');
    },
    /**
     * @description 현재 상태 여부를 설정한다.
     * @method setChecked
     * @public
     * @param {boolean} isChecked 체크 여부
     * @return {void} 
     */
    setChecked: function(isChecked) {
        this.cfg.setProperty('checked', isChecked);
        return this;
    },
    /**
     * @description 화면 출력객체의 실제 value값을 값을 리턴
     * @method getRawValue
     * @public
     * @return {String} 결과값
     */
    getRawValue: function() {
        if(this.cfg.getProperty('checked')) return this.getDisplayEl().getValue();
        else return '';
    },
    /**
     * @description disabled 속성에 따른 실제 적용 메소드
     * @method _setChecked
     * @protected
     * @param {String} type 속성의 이름
     * @param {Array} args 속성의 값 배열
     * @param {Object} obj 적용된 객체
     * @return {void}
     */
    _setChecked: function(type, args, obj) {
        var val = args[0];
        if(this._rendered)
        	this.getDisplayEl().dom.checked = val;
        if(val) this.el.addClass('L-checked');
        else this.el.removeClass('L-checked');
        if (Rui.useAccessibility()) this.el.dom.setAttribute('aria-checked', val);
        this.fireEvent('changed', {target:this, value:val});
    },
    /**
     * @description disabled 속성에 따른 실제 적용 메소드
     * @method _setDisabled
     * @protected
     * @param {String} type 속성의 이름
     * @param {Array} args 속성의 값 배열
     * @param {Object} obj 적용된 객체
     * @return {void}
     */
    _setDisabled: function(type, args, obj) {
        //Rui.ui.form.LCheckBox.superclass._setDisabled.call(this, type, args, obj);
        if(args[0] === false) {
            this.el.removeClass('L-disabled');
            this.getDisplayEl().dom.disabled = false;
            this.fireEvent('enable');
        } else {
            this.el.addClass('L-disabled');
            this.getDisplayEl().dom.disabled = true;
            this.fireEvent('disable');
        }
    },
    /**
     * @description focus 이벤트 발생시 호출되는 메소드
     * @method onFocus
     * @protected
     * @param {Object} e Event 객체
     * @return {void}
     */
    onFocus: function(e) {
        Rui.ui.form.LCheckBox.superclass.onFocus.call(this, e);
        this.doFocus();
    },
    /**
     * @description focus 메소드가 호출되면 수행되는 메소드
     * @method doFocus
     * @protected
     * @param {Object} e event 객체
     * @return {void}
     */
    doFocus: function(e) {
        Rui.util.LEvent.addListener(Rui.browser.msie ? document.body : document, 'mousedown', this.deferOnBlur, this, true);
    },
    /**
     * @description blur 이벤트 발생시 호출되는 메소드
     * @method onBlur
     * @private
     * @param {Object} e Event 객체
     * @return {void}
     */
    onBlur: function(e) {
        if(this.cfg.getProperty('checked') != this.getDisplayEl().dom.checked)
            this.cfg.setProperty('checked', this.getDisplayEl().dom.checked);
        Rui.ui.form.LCheckBox.superclass.onBlur.call(this, e);
    },
    /**
     * @description blur 호출 지연 메소드
     * @method deferOnBlur
     * @protected
     * @param {Object} e event 객체
     * @return {void}
     */
    deferOnBlur: function(e) {
        Rui.util.LFunction.defer(this.onBlurContains, 10, this, [e]);
    },
    /**
     * @description container에 포함된 객체를 선택했는지 판단하는 메소드
     * @method onBlurContains
     * @protected
     * @param {Object} e event 객체
     * @return {void}
     */
    onBlurContains: function(e) {
        if(e.deferCancelBubble == true) return;
        var target = e.target;
        if (this.el.dom !== target && !this.el.isAncestor(target)) {
            Rui.util.LEvent.removeListener(Rui.browser.msie ? document.body : document, 'mousedown', this.deferOnBlur);
            this.onBlur(e);
            this.isFocus = null;
        } else 
            e.deferCancelBubble = true;
    },
    /**
     * @description checkbox 클릭 처리 메소드
     * @method onClick
     * @protected
     * @param {Object} e Event 객체
     * @return {void}
     */
    onClick: function(e) {
        this.cfg.setProperty('checked', e.target.checked);
        return this;
    },
    /**
     * @description item객체가 focus되면 호출되는 메소드
     * @method onCheckFocus
     * @protected
     * @param {Object} e event 객체
     * @return {void}
     */
    onCheckFocus: function(e) {
        if(!this.isFocus) {
            this.doFocus(this, e);
            this.isFocus = true;
        }
    },
    /**
     * @description CheckBox edit 전에 호출되는 메소드
     * @method onBeforeEdit
     * @protected
     * @param {Object} e Event 객체
     * @return {boolean}
     */
    onBeforeEdit : function(e) {
        if(e.colId == this.gridFieldId) return false;
    },
    /**
     * @description 그리드 셀이 클릭되었을때 CheckBox와 DataSet을 처리하는 메소드
     * @method onCellClick
     * @protected
     * @param {Object} e Event 객체
     * @return {void}
     */
    onCellClick : function(e) {
    	if(e.event.shiftKey || e.event.ctrlKey || e.event.altKey) return;
    	var gridPanel = this.gridPanel, view = gridPanel.getView();
        var sm = gridPanel.getSelectionModel();
        if(sm.isLocked()) return;
        var column = gridPanel.columnModel.getColumnById(e.colId);
        if(column.editable !== true) return;
        var view = gridPanel.getView();
        var cm = view.getColumnModel();
        if(gridPanel.dataSet.getRow() != e.row) return;
        var cellDom = view.getCellDom(e.row, e.col);
        if(!cellDom) return;
        var cellEl = Rui.get(cellDom);
        if(!cellEl.hasClass('L-grid-cell-editable')) return;
        if(column.getId() == this.gridFieldId) {
            var dataSet = view.getDataSet();
            if(this.bindValues[0] == dataSet.getNameValue(e.row, column.getField()))
                dataSet.setNameValue(e.row, column.getField(), this.bindValues[1]);
            else dataSet.setNameValue(e.row, column.getField(), this.bindValues[0]);
            Rui.util.LEvent.stopEvent(e);
        }
    },
    /**
     * @description 그리드 셀에서 키를 입력하였을 경우 CheckBox와 DataSet을 처리하는 메소드
     * @method onCellKeypress
     * @protected
     * @param {Object} e Event 객체
     * @return {void}
     */
    onCellKeypress: function(e) {
        if((e.which || e.keyCode) == Rui.util.LKey.KEY.SPACE) {
            var gridPanel = this.gridPanel, view = gridPanel.getView();
            var sm = gridPanel.getSelectionModel(), col = sm.getCol(), cm = view.getColumnModel();
            if(sm.isLocked()) return;
            var column = cm.getColumnAt(col, true);
            if(!column || column.id != this.gridFieldId || column.editable == false) return;
            var gridColumn = cm.getColumnById(this.gridFieldId);
            var dataSet = view.getDataSet();
            var row = dataSet.getRow();
            if(this.bindValues[0] == dataSet.getNameValue(row, gridColumn.getField()))
                dataSet.setNameValue(row, gridColumn.getField(), this.bindValues[1]);
            else dataSet.setNameValue(row, gridColumn.getField(), this.bindValues[0]);
            Rui.util.LEvent.stopEvent(e);
        }
    },
    /**
     * @description 그리드에 fixed 처리된 checkBoxColumn을 renderer하는 메소드
     * renderer html : <div style="width:21px" class="L-grid-col-checkBox L-ignore-event"/>
     * @method gridFixedRenderer
     * @protected
     * @return {String}
     */
    gridFixedRenderer : function(value, p, record, row, colIndex){
        if(value == this.bindValues[0])
            p.css.push('L-grid-col-select-mark');
        return '<div class="L-grid-col-checkBox L-ignore-event"/>';
    },
    /**
     * @description 객체를 destroy하는 메소드
     * @method destroy
     * @public
     * @return {void}
     */
    destroy: function() {
        if(this.getDisplayEl()) {
            this.displayEl.remove();
            delete this.displayEl;
        }
        Rui.ui.form.LCheckBox.superclass.destroy.call(this);
        return this;
    }
});

/**
 * LCheckBoxGroup
 * @module ui_form
 * @title LCheckBoxGroup
 * @requires Rui
 */
Rui.namespace('Rui.ui.form');
/**
 * LCheckBox의 그룹으로 묶어서 생성하는 LCheckBoxGroup 편집기
 * @namespace Rui.ui.form
 * @class LCheckBoxGroup
 * @extends Rui.ui.form.LField
 * @sample default
 * @constructor LCheckBoxGroup
 * @param {Object} config The intial LCheckBoxGroup.
 */
Rui.ui.form.LCheckBoxGroup = function(config){
    this.items = [];
    Rui.ui.form.LCheckBoxGroup.superclass.constructor.call(this, config);
};
Rui.extend(Rui.ui.form.LCheckBoxGroup, Rui.ui.form.LField, {
    /**
     * @description 객체의 문자열
     * @property otype
     * @private
     * @type {String}
     */
    otype: 'Rui.ui.form.LCheckBoxGroup',
    /**
     * @description 기본 CSS명
     * @property CSS_BASE
     * @private
     * @type {String}
     */
    CSS_BASE: 'L-checkbox-group',
    /**
     * @description checkbox item 배열
     * @property items
     * @private
     * @type {Array}
     */
    items: null,
    /**
     * @description 가로길이
     * @property width
     * @private
     * @type {String}
     */
    width: null,
    /**
     * @description blur시 contains 체크를 할지 여부
     * @property checkContainBlur
     * @private
     * @type {boolean}
     */
    checkContainBlur: true,
    /**
     * @description Dom객체 생성 및 초기화하는 메소드
     * @method initComponent
     * @protected
     * @param {String|Object} el 객체의 아이디나 객체
     * @param {Object} config 환경정보 객체
     * @return {void}
     */
    initComponent: function(config){
        Rui.ui.form.LCheckBoxGroup.superclass.initComponent.call(this);
        this.name = this.name || Rui.id(this.el, 'LCheckBoxGrp-' + this.id);
    },
    /**
     * @description render시 호출되는 메소드
     * @method doRender
     * @protected
     * @param {String|Object} container 부모객체 정보
     * @return {void}
     */
    doRender: function(appendToNode) {
        this.el.addClass(this.CSS_BASE);
        this.el.addClass('L-fixed');
        this.el.addClass('L-form-field');
        if (Rui.useAccessibility()) this.el.setAttribute('role', 'group');
        if(this.width) this.el.setWidth(!Rui.isBorderBox ? this.width - 1 : this.width - 2);
        
        Rui.util.LArray.each(this.items, function(item, i){
            if((item instanceof Rui.ui.form.LCheckBox) == false) {
                item.name = this.name;
                item.id = item.id || item.value;
                item = new Rui.ui.form.LCheckBox(item);
                this.items[i] = item;
            }
            item.render(this.el.dom);
        }, this);
    },
    /**
     * @description render후 호출되는 메소드
     * @method afterRender
     * @protected
     * @param {HTMLElement} container 부모 객체
     * @return {void}
     */
    afterRender: function(container) {
        Rui.ui.form.LCheckBoxGroup.superclass.afterRender.call(this, container);
        
        this.el.on('click', function(e){
            if(this.items.length > 0)
                this.items[0].focus();

            Rui.util.LEvent.stopPropagation(e);
        }, this, true);
        Rui.util.LArray.each(this.items, function(item){
        	item.unOn('changed', this.onChanged, this);
        	item.unOn('focus', this.onItemFocus, this);
        	item.unOn('blur', this.onItemBlur, this);
            item.on('changed', this.onChanged, this, true);
            item.on('focus', this.onItemFocus, this, true);
            item.on('blur', this.onItemBlur, this, true);
        }, this);
    },
    /**
     * @description LCheckBox에서 구현한 메소드를 호출해주는 기능
     * @method invoke
     * @protected
     * @param {Function} fn function 객체
     * @param {Array} args 인수 배열
     * @return {Rui.ui.form.LCheckBoxGroup}
     */
    invoke: function(fn, args){
        var els = this.items;
        Rui.each(els, function(e) {
            Rui.ui.form.LCheckBox.prototype[fn].apply(e, args);
        }, this);
        return this;
    },
    /**
     * @description 값이 변경되면 호출되는 메소드
     * @method onChanged
     * @protected
     * @param {Object} e event 객체
     * @return {void}
     */
    onChanged: function(e) {
        this.fireEvent('changed', e);
    },
    /**
     * @description item객체가 focus되면 호출되는 메소드
     * @method onItemFocus
     * @protected
     * @param {Object} e event 객체
     * @return {void}
     */
    onItemFocus: function(e) {
        if(!this.isFocus) {
            this.doFocus(this, e);
            this.isFocus = true;
        }
    },
    /**
     * @description focus 메소드가 호출되면 수행되는 메소드
     * @method doFocus
     * @protected
     * @param {Object} e event 객체
     * @return {void}
     */
    doFocus: function(e) {
        this.onFocus(e);
        Rui.util.LEvent.addListener(Rui.browser.msie ? document.body : document, 'mousedown', this.deferOnBlur, this, true);
    },
    /**
     * @description blur 메소드가 호출되면 수행되는 메소드
     * @method onItemBlur
     * @protected
     * @param {Object} e event 객체
     * @return {void}
     */
    onItemBlur: function(e) {
    	this.deferOnBlur(e);
    },
    /**
     * @description blur 호출 지연 메소드
     * @method deferOnBlur
     * @protected
     * @param {Object} e event 객체
     * @return {void}
     */
    deferOnBlur: function(e) {
        Rui.util.LFunction.defer(this.onBlurContains, 10, this, [e]);
    },
    /**
     * @description container에 포함된 객체를 선택했는지 판단하는 메소드
     * @method onBlurContains
     * @protected
     * @param {Object} e event 객체
     * @return {void}
     */
    onBlurContains: function(e) {
        var target = e.target;
        if(e.deferCancelBubble == true) return;
        if(this.el.dom !== target && !this.el.isAncestor(target)) {
            Rui.util.LEvent.removeListener(Rui.browser.msie ? document.body : document, 'mousedown', this.deferOnBlur);
            this.onBlur(e);
            this.isFocus = null;
        } else
            e.deferCancelBubble = true;
    },
    /**
     * @description disabled 속성에 따른 실제 적용 메소드
     * @method _setDisabled
     * @protected
     * @param {String} type 속성의 이름
     * @param {Array} args 속성의 값 배열
     * @param {Object} obj 적용된 객체
     * @return {void}
     */
    _setDisabled: function(type, args, obj) {
        if(args[0] === false) {
            Rui.util.LArray.each(this.items, function(item){
                item.enable();
            }, this);
        } else {
            Rui.util.LArray.each(this.items, function(item){
                item.disable();
            }, this);
        }
    },
    /**
     * @description 객체를 focus한다.
     * @method focus
     * @public
     * @return {void}
     */
    focus: function() {
        if(this.items.length > 0) this.items[0].focus();
        return this;
    },
    /**
     * @description item중에 value 맞는 항목을 선택하는 메소드
     * @method setValue
     * @public
     * @param {String} val item의 value 값
     * @return {void}
     */
    setValue: function(val) {
    	var ignoreEvent = false; ; // ignoreEvent를 인수로 받으면 안됨. 처리가 되어야 할 경우가 있고 아닌 경우가 있음. 멀티그룹 콤포넌트에 대한 딜레마
    	// ignoreEvent를 true로 호출해야 초기 editor 출력시 변경건이 존재하지 않는데 ignoreEvent를 false로 호출하면 반대로 내부 콤포넌트가 이벤트가 발생하지 않음.
        Rui.util.LArray.each(this.items, function(item){
            item.setValue(val, ignoreEvent);
        }, this);
        return this;
    },
    /**
     * @description 선택된 item의 값을 리턴하는 메소드
     * @method getValue
     * @public
     * @return {String}
     */
    getValue: function() {
        var val = [];
        Rui.util.LArray.each(this.items, function(item){
            val.push(item.getValue());
        }, this);
        return val;
    },
    /**
     * @description index에 해당되는 LCheckBox객체를 리턴하는 메소드
     * @method getItem
     * @public
     * @param {int} idx index 값
     * @return {Rui.ui.form.LCheckBox}
     */
    getItem: function(idx) {
        return this.items[idx];
    },
    /**
     * @description 객체를 destroy하는 메소드
     * @method destroy
     * @public
     * @return {void}
     */
    destroy: function() {
        /*Rui.util.LArray.each(this.items, function(item){
            item.destroy();
        }, this);*/
        Rui.ui.form.LCheckBoxGroup.superclass.destroy.call(this);
        return this;
    }
});
(function(){
    var CbProto = Rui.ui.form.LCheckBox.prototype,
        CbgProto = Rui.ui.form.LCheckBoxGroup.prototype;
    for (var fnName in CbProto){
        if(Rui.isFunction(CbProto[fnName])){
            (function(fnName){
                CbgProto[fnName] = CbgProto[fnName] || function(){
                    return this.invoke(fnName, arguments);
                };
            }).call(CbgProto, fnName);
        }
    };
})();
/**
 * LRadio
 * @module ui_form
 * @title LRadio
 * @requires Rui
 */
Rui.namespace('Rui.ui.form');
/**
 * radio를 생성하는 LRadio 편집기
 * @namespace Rui.ui.form
 * @class LRadio
 * @extends Rui.ui.form.LCheckBox
 * @sample default
 * @constructor LRadio
 * @param {Object} config The intial LRadio.
 */
Rui.ui.form.LRadio = function(config){
    config = Rui.applyIf(config || {}, Rui.getConfig().getFirst('$.ext.radio.defaultProperties'));
    Rui.applyObject(this, config, true);
    Rui.ui.form.LRadio.superclass.constructor.call(this, config);
};
Rui.extend(Rui.ui.form.LRadio, Rui.ui.form.LCheckBox, {
    /**
     * @description 객체의 문자열
     * @property otype
     * @private
     * @type {String}
     */
    otype: 'Rui.ui.form.LRadio',
    /**
     * @description 기본 CSS명
     * @property CSS_BASE
     * @private
     * @type {String}
     */
    CSS_BASE: 'L-radio',
    /**
     * @description blur시 contains 체크를 할지 여부
     * @property checkContainBlur
     * @private
     * @type {boolean}
     */
    checkContainBlur: true,
    /**
     * @description Template을 생성하는 메소드
     * @method createTemplate
     * @private
     * @return {void}
     */
    createTemplate: function() {
        var ts = this.templates || {};
        ts.input = new Rui.LTemplate('<input id="{id}" type="radio" name="{name}" class="' + this.CSS_BASE + ' L-fixed " style="{style}" value="{value}" {checked} />');
        ts.label = new Rui.LTemplate('<label for="{id}" class="L-label">{label}</label>');
        this.templates = ts;
    },
    /**
     * @description render후 호출되는 메소드
     * @method afterRender
     * @protected
     * @param {HTMLElement} container 부모 객체
     * @return {void}
     */
    afterRender: function(container) {
        Rui.ui.form.LRadio.superclass.afterRender.call(this, container);

        if(Rui.useAccessibility()){
            this.el.setAttribute('role', 'radio');
            this.el.setAttribute('aria-checked', false);
            this.el.setAttribute('aria-describedby', 'radio ' + (this.label ? this.label : this.id));
        }
    }
});

/**
 * LRadioGroup
 * @module ui_form
 * @title LRadioGroup
 * @requires Rui
 */
Rui.namespace('Rui.ui.form');
/**
 * LRadio를 그룹으로 묶어서 생성하는 LRadioGroup 편집기
 * @namespace Rui.ui.form
 * @class LRadioGroup
 * @extends Rui.ui.form.LCheckBoxGroup
 * @sample default
 * @constructor LRadioGroup
 * @param {Object} config The intial LRadioGroup.
 */
Rui.ui.form.LRadioGroup = function(config){
    Rui.ui.form.LRadioGroup.superclass.constructor.call(this, config);
};
Rui.extend(Rui.ui.form.LRadioGroup, Rui.ui.form.LCheckBoxGroup, {
    /**
     * @description 객체의 문자열
     * @property otype
     * @private
     * @type {String}
     */
    otype: 'Rui.ui.form.LRadioGroup',
    /**
     * @description 기본 CSS명
     * @property CSS_BASE
     * @private
     * @type {String}
     */
    CSS_BASE: 'L-radio-group',
    /**
     * @description blur시 contains 체크를 할지 여부
     * @property checkContainBlur
     * @private
     * @type {boolean}
     */
    checkContainBlur: true,
//    /**
//     * @description 그리드에 고정된 형태로의 출력 여부
//     * @config gridFixed
//     * @type {boolean}
//     * @default false
//     */
//    /**
//     * @description 그리드에 고정된 형태로의 출력 여부
//     * @property gridFixed
//     * @private
//     * @type {boolean}
//     */
//    gridFixed: false,
    /**
     * @description 객체의 이벤트 초기화 메소드
     * @method initEvents
     * @protected
     * @return {void}
     */
    initEvents: function() {
        //if(this.gridFixed) this.beforeRenderer = this.gridFixedRenderer;
        Rui.ui.form.LRadioGroup.superclass.initEvents.call(this);
        
        var seq = 1;
        Rui.util.LArray.each(this.items, function(item, i){
            if((item instanceof Rui.ui.form.LRadio) == false) {
                item.name = this.name;
                item.id = this.name + '' + seq++;
                item = new Rui.ui.form.LRadio(item);
                this.items[i] = item;
            }
            item.groupInstance = this;
            item.on('specialkey', this._onSpecialkey, this, true);
        }, this);
    },
    /**
     * @description render시 발생하는 메소드
     * @method doRender
     * @protected
     * @param {HttpElement} appendToNode 부모 객체
     * @return {void}
     */
    doRender: function(appendToNode) {
        this.el.addClass(this.CSS_BASE);
        this.el.addClass('L-fixed');
        this.el.addClass('L-form-field');
        if (Rui.useAccessibility()) this.el.setAttribute('role', 'radiogroup');
        if(this.width) this.el.setWidth(!Rui.isBorderBox ? this.width - 5 : this.width - 2);

        Rui.util.LArray.each(this.items, function(item){
        	if(item._rendered) {
        		this.el.appendChild(item.el);
        	} else
        		item.render(this.el.dom);
        }, this);
    },
    /**
     * @description Check를 모두 취소하는 메소드
     * @method clearAllChecked
     * @return {void}
     */
    clearAllChecked: function(ignoreEvent) {
        Rui.util.LArray.each(this.items, function(item, i){
            item.setValue(false, ignoreEvent);
        }, this);
        return this;
    },
    /**
     * @description change 이벤트가 발생하면 호출되는 메소드
     * @method onChanged
     * @private
     * @param {Object} e Event객체
     * @return {void}
     */
    onChanged: function(e) {
        var item = this.getCheckedItem();
        var target = e.target;
        Rui.util.LArray.each(this.items, function(item){
            if(item !== target) {
                item.checked = false;
                item.el.removeClass('L-checked');
                if (Rui.useAccessibility()) item.el.setAttribute('aria-checked', false);
            }
        }, this);
        if(item == null || e.target == item) {
        	e.target = this;
        	Rui.ui.form.LRadioGroup.superclass.onChanged.call(this, e);
        }
    },
    /**
     * @description check된 radio 객체를 리턴하는 메소드
     * @method getCheckedItem
     * @return {Rui.ui.form.LRadio}
     */
    getCheckedItem: function() {
        var checkedItem = null;
        Rui.util.LArray.each(this.items, function(item, i){
            if(item.getDisplayEl().dom.checked === true) {
                checkedItem = item;
                return false;
            }
        }, this);
        return checkedItem;
    },
    /**
     * @description 선택된 index를 리턴한다.
     * @method getCheckedIndex
     * @return {int}
     */
    getCheckedIndex: function() {
        var idx = -1;
        Rui.util.LArray.each(this.items, function(item, i){
            if(item.getDisplayEl().dom.checked === true) {
                idx = i;
                return false;
            }
        }, this);
        return idx;
    },
    /**
     * @description idx 선택할 index를 지정한다.
     * @method setCheckedIndex
     * @param {int} idx 선택할 index
     * @return {void}
     */
    setCheckedIndex: function(idx) {
        if(this.items.length < idx) return;
        this.items[idx].setChecked(true);
        return this;
    },
    /**
     * @description val 해당되는 radio를 선택하는 메소드
     * @method setValue
     * @param {String} val radio의 value값에 해당되는 값
     * @return {void}
     */
    setValue: function(val) {
    	var ignoreEvent = false; // ignoreEvent를 인수로 받으면 안됨. 처리가 되어야 할 경우가 있고 아닌 경우가 있음. 멀티그룹 콤포넌트에 대한 딜레마
    	// ignoreEvent를 true로 호출해야 초기 editor 출력시 변경건이 존재하지 않는데 ignoreEvent를 false로 호출하면 반대로 내부 콤포넌트가 이벤트가 발생하지 않음. 
        var radio = this.getRadioElByVal(val);
        if (radio == null) {
            this.clearAllChecked(ignoreEvent);
            return;
        } else {
            for (var i = 0 ; i < this.items.length ; i++) {
                if(this.items[i] == radio) {
                    this.items[i].setValue(true, ignoreEvent);
                } else {
                    this.items[i].setValue(false, ignoreEvent);
                }
            }
        }
        return this;
    },
    /**
     * @description 선택된 raio의 값을 리턴하는 메소드
     * @method getValue
     * @return {String}
     */
    getValue: function() {
        var item = this.getCheckedItem();
        return (item != null) ? item.getRawValue() : null;
    },
    /**
     * @description 값에 해당되는 radio를 리턴하는 메소드
     * @method getRadioElByVal
     * @prarm {String} val 
     * @return {Rui.ui.form.LRadio}
     */
    getRadioElByVal: function(val) {
        var retItem = null;
        Rui.util.LArray.each(this.items, function(item, i){
            if(item.getDisplayEl().dom.value == val) {
                retItem = item;
                return false;
            }
        }, this);
        return retItem;
    },
    /**
     * @description 이전 radio 객체를 선택한다.
     * @method before
     * @return {void}
     */
    before: function() {
        var idx = this.getCheckedIndex();
        if(idx < 1) return;
        this.setCheckedIndex(--idx);
        return this;
    },
    /**
     * @description 다음 radio 객체를 선택한다.
     * @method next
     * @return {void}
     */
    next: function() {
        var idx = this.getCheckedIndex();
        if(idx >= this.items.length - 1) return;
        this.setCheckedIndex(++idx);
        return this;
    },
    /**
     * @description 키 입력시 처리하는 메소드
     * @method _onSpecialkey
     * @protected
     * @param {Object} e 이벤트 객체
     * @return {void}
     */
    _onSpecialkey: function(e) {
        var KEY = Rui.util.LKey.KEY;
        if (e.keyCode == KEY.LEFT) {
            this.before();
            Rui.util.LEvent.stopEvent(e);
            return false;
        } else if (e.keyCode == KEY.RIGHT) {
            this.next();
            Rui.util.LEvent.stopEvent(e);
            return false;
        }
        this.onFireKey(e);
    },
    /**
     * @description 그리드에 fixed 처리된 checkBoxColumn을 renderer하는 메소드
     * @method gridFixedRenderer
     * @protected
     * @return {String}
     */
    gridFixedRenderer : function(val, p, record){
        var html = '<div class="L-radio-panel L-fixed L-form-field">';
        Rui.util.LArray.each(this.items, function(item, i){
            html += '<div class="L-radio-group L-fixed L-form-field">';
            var chk = (val == item.value) ? 'checked' : '';
            html += '<input type="radio" class="' + this.CSS_BASE + '" value="' + item.value + '" ' + chk + ' />'
                  + '<label>' + item.label + '</label></div>';        
        }, this);
        return html+ '</div>';
    }
});
(function(){
    var CbProto = Rui.ui.form.LRadio.prototype,
        groupProto = Rui.ui.form.LRadioGroup.prototype;
    for (var fnName in CbProto){
        if(Rui.isFunction(CbProto[fnName])){
            (function(fnName){
                groupProto[fnName] = groupProto[fnName] || function(){
                    return this.invoke(fnName, arguments);
                };
            }).call(groupProto, fnName);
        }
    };
})();

/**
 * Form
 * @module ui_form
 * @title LTextArea
 * @requires Rui
 */
Rui.namespace('Rui.ui.form');
/**
 * textarea를 생성하는 LTextArea 편집기
 * @namespace Rui.ui.form
 * @class LTextArea
 * @extends Rui.ui.form.LTextBox
 * @sample default
 * @constructor LTextArea
 * @param {HTMLElement | String} id The html element that represents the Element.
 * @param {Object} oConfig The intial LTextArea.
 */
Rui.ui.form.LTextArea = function(config){
    config = Rui.applyIf(config || {}, Rui.getConfig().getFirst('$.ext.textArea.defaultProperties'));
    Rui.ui.form.LTextArea.superclass.constructor.call(this, config);
};
Rui.extend(Rui.ui.form.LTextArea, Rui.ui.form.LTextBox, {
    /**
     * @description 객체의 문자열
     * @property otype
     * @private
     * @type {String}
     */
    otype: 'Rui.ui.form.LTextArea',
    /**
     * @description 기본 CSS명
     * @property CSS_BASE
     * @private
     * @type {String}
     */
    CSS_BASE: 'L-textarea',
    /**
     * @description 목록창의 가로 길이
     * @config width
     * @type {String}
     * @default 180
     */
    /**
     * @description 목록창의 가로 길이
     * @property width
     * @private
     * @type {String}
     */
    width: 180,
    /**
     * @description 멀리 라인을 지원하는 속성 여부
     * @property multiLine
     * @private
     * @type {boolean}
     */
    multiLine: true,
    /**
     * @description 객체의 이벤트 초기화 메소드
     * @method initEvents
     * @protected
     * @return {void}
     */
    initEvents: function() {
        Rui.ui.form.LTextArea.superclass.initEvents.call(this);
        this.on('specialkey', this._onSpecialkey, this, true);
    },
    /**
     * @description element Dom객체 생성
     * @method createContainer
     * @protected
     * @param {HTMLElement} parentNode 부모 노드
     * @return {HTMLElement}
     */
    createContainer: function(parentNode){
        if(this.el) {
            if(this.el.dom.tagName == 'TEXTAREA') {
                this.id = this.id || this.el.id;
                this.oldDom = this.el.dom;

                this.attrs = this.attrs || {};
                var items = this.oldDom.attributes;
                if(typeof items !== 'undefined'){
                    if(Rui.browser.msie67){
                        //IE6, 7의 경우 DOMCollection의 value값들이 모두 문자열이다.
                        for (var i=0, len = items.length; i<len; i++){
                            var v = items[i].value;
                            if(v && v !== 'null' && v !== '')
                                this.attrs[items[i].name] = Rui.util.LObject.parseObject(v);
                        }
                    }else
                        for (var i=0, len = items.length; i<len; i++)
                            this.attrs[items[i].name] = items[i].value;
                }
                delete this.attrs.id;
                this.attrs.value = this.oldDom.value;

                this.name = this.name || this.oldDom.name;
                var parent = this.el.parent();
                this.el = Rui.get(this.createElement().cloneNode(false));
                this.el.dom.id = this.id;
                Rui.util.LDom.replaceChild(this.el.dom, this.oldDom);
                this.el.appendChild(this.oldDom);
                Rui.util.LDom.removeNode(this.oldDom);
                delete this.oldDom;
            }
        }
        Rui.ui.form.LTextArea.superclass.createContainer.call(this, parentNode);
    },
    /**
     * @description template객체 생성
     * @method createTemplate
     * @protected
     * @return {void}
     */
    createTemplate: function(el) {
        var elContainer = Rui.get(el);
        elContainer.addClass(this.CSS_BASE);
        elContainer.addClass('L-fixed');
        elContainer.addClass('L-form-field');

        var input = document.createElement('textarea');
        if(this.autoComplete) input.autocomplete = 'off';
        // if(this.attrs) for (var m in this.attrs) input[m] = this.attrs[m];
        for (var key in this.attrs){
            if(key == 'value') input.value = this.attrs.value;
            else input.setAttribute(key, this.attrs[key]);
        }
        
        input.id = Rui.useFixedId() ? Rui.id(this.el, 'LTextArea-' + this.id) : Rui.id();
        input.name = this.name || input.name || this.id;
        elContainer.appendChild(input);
        this.inputEl = Rui.get(input);
        this.inputEl.addClass('L-display-field');
        return elContainer;
    },
    /**
     * @description 키 입력시 처리하는 메소드
     * @method _onSpecialkey
     * @protected
     * @param {Object} e 이벤트 객체
     * @return {void}
     */
    _onSpecialkey: function(e) {
        var k = Rui.util.LKey.KEY;
        switch (e.keyCode) {
            case k.DOWN:
            case k.UP:
            case k.LEFT:
            case k.RIGHT:
                Rui.util.LEvent.stopPropagation(e);
                return false;
                break;
        }
    },
    /**
     * @description Keyup 이벤트가 발생하면 처리하는 메소드
     * @method onKeyup
     * @private
     * @param {Object} e Event 객체
     * @return {void}
     */
    onKeyup: function(e) {
        var KEY = Rui.util.LKey.KEY;
        if( e.keyCode == KEY.DOWN || e.keyCode == KEY.UP){
            Rui.util.LEvent.stopEvent(e); return;
        } else if(e.keyCode == KEY.TAB){
            this.onFocus();
            this.fireEvent('keydown', e); return;
        }
        this.fireEvent('keyup', e);
    },
    /**
     * @description height 속성에 따른 실제 적용 메소드
     * @method _setHeight
     * @protected
     * @param {String} type 속성의 이름
     * @param {Array} args 속성의 값 배열
     * @param {Object} obj 적용된 객체
     * @return {void}
     */
    _setHeight: function(type, args, obj) {
        Rui.ui.form.LTextArea.superclass._setHeight.call(this, type, args, obj);
        if(Rui.browser.msie) 
            this.getDisplayEl().setStyle('line-height', '');
    },
    /**
     * @description body html을 리턴하는 메소드
     * @method getRenderBody
     * @protected
     * @return {String}
     */
    getRenderBody: function() {
        var ts = this.templates || {};
        var p = {
            id: Rui.id(),
            name: this.name || this.id,
            value: this.value || ''
        };
        return ts.apply(p);
    },
    /**
     * @description 화면 출력되는 객체 리턴
     * @method getDisplayEl
     * @protected
     * @return {Rui.LElement} Element 객체
     */
    getDisplayEl: function() {
        if(!this.displayEl && this.el)
            this.displayEl = this.el.select('textarea').getAt(0);
        return this.displayEl;
    },
    /**
     * @description 키 입력시 호출되는 메소드
     * @method onFireKey
     * @protected
     * @param {Object} e Event 객체
     * @return {void}
     */
    onFireKey: function(e){
        if(Rui.util.LEvent.isSpecialKey(e) && e.keyCode != Rui.util.LKey.KEY.ENTER)
            this.fireEvent('specialkey', e);
    }
});

/**
 * Form
 * @module ui_form
 * @title LNumberBox
 * @requires Rui
 */
Rui.namespace('Rui.ui.form');

(function(){
    var DL = Rui.util.LDom;
    var ST = Rui.util.LString;

/**
 * 숫자만 입력 가능하게 하고 숫자에 대한 입력 제어를 지원하는 객체 편집기(dataSet와 연동시 fields의 값의 type은 반드시 'number' 타입으로 선언되어야 한다.)
 * @namespace Rui.ui.form
 * @class LNumberBox
 * @extends Rui.ui.form.LTextBox
 * @sample default
 * @constructor LNumberBox
 * @param {HTMLElement | String} id The html element that represents the Element.
 * @param {Object} config The intial LNumberBox.
 */
Rui.ui.form.LNumberBox = function(config){
    config = Rui.applyIf(config ||{}, Rui.getConfig().getFirst('$.ext.numberBox.defaultProperties'));
    Rui.ui.form.LNumberBox.superclass.constructor.call(this, config);
};

Rui.extend(Rui.ui.form.LNumberBox, Rui.ui.form.LTextBox, {
    /**
     * @description 객체의 문자열
     * @property otype
     * @private
     * @type {String}
     */
    otype: 'Rui.ui.form.LNumberBox',
    /**
     * @description 기본 CSS명
     * @property CSS_BASE
     * @private
     * @type {String}
     */
    CSS_BASE: 'L-numberbox',
    /**
     * @description 입력 가능한 문자열
     * @property includeChars
     * @private
     * @type {String}
     */
    includeChars: '0123456789',
    /**
     * @description 소수점 허용 자리수
     * <p>Sample: <a href="./../sample/general/ui/form/numberboxSample.html" target="_sample">보기</a></p>
     * @config decimalPrecision
     * @type {int}
     * @default -1
     */
    /**
     * @description 소수점 허용 자리수
     * @property decimalPrecision
     * @private
     * @type {int}
     */
    decimalPrecision: -1,
    /**
     * @description 임시용 소수점 허용 자리수
     * @property dummyDecimalPrecision
     * @private
     * @type {int}
     */
    dummyDecimalPrecision: -1,
    /**
     * @description 입력 가능 최소값 정의
     * @config minValue
     * @type {int}
     * @default null
     */
    /**
     * @description 입력 가능 최소값 정의
     * @property minValue
     * @private
     * @type {int}
     */
    minValue: null,
    /**
     * @description 입력 가능 최대값 정의
     * @config maxValue
     * @type {int}
     * @default null
     */
    /**
     * @description 입력 가능 최대값 정의
     * @property maxValue
     * @private
     * @type {int}
     */
    maxValue: null,
    /**
     * @description 천단위 구분자 출력 여부
     * @config thousandsSeparator
     * @type {String}
     * @default ','
     */
    /**
     * @description 천단위 구분자 출력 여부
     * @property thousandsSeparator
     * @private
     * @type {String}
     */
    thousandsSeparator: ',',
    /**
     * @description 수숫점 구분자 출력 여부
     * @config decimalSeparator
     * @type {String}
     * @default '.'
     */
    /**
     * @description 천단위 구분자 출력 여부
     * @property decimalSeparator
     * @private
     * @type {String}
     */
    decimalSeparator: '.',
    /**
     * @description blur시 contains 체크를 할지 여부
     * @property checkContainBlur
     * @private
     * @type {boolean}
     */
    checkContainBlur: false,
    /**
     * @description special key state
     * @property specialKeypress
     * @private
     * @type {boolean}
     */
    specialKeypress: false,
    /**
     * @description control key state
     * @property ctrlKeypress
     * @private
     * @type {boolean}
     */
    ctrlKeypress: false,
    /**
     * @description FilterKey 적용여부
     * @config filterKey
     * @type {boolean}
     * @default true
     */
    /**
     * @description FilterKey 적용여부
     * @property filterKey
     * @private
     * @type {boolean}
     */
    filterKey: true,
    /**
     * @description 입력값이 진행중인 여부
     * @property progress
     * @private
     * @type {boolean}
     */
    progress: false,
    /**
     * @description 유효성 체크를 위해 입력값 임시 보관
     * @property constValue
     * @private
     * @type {int}
     */
    constValue: null,
    /**
     * @description cursor focus position
     * @property caretPos
     * @private
     * @type {int}
     */
    caretPos: 0,
    /**
     * @description The seleted text by selection
     * @property selectedText
     * @private
     * @type {String}
     */
    selectedText: '',
    /**
     * @description selected start position
     * @property caretS
     * @private
     * @type {int}
     */
    caretS: 0,
    /**
     * @description selected end position
     * @property caretE
     * @private
     * @type {int}
     */
    caretE: 0,
    /**
     * @description 값이 선택되어 있지 않을 경우 리턴시 값을 '' 공백 문자로 리턴할지 null로 리턴할지를 결정한다. 그리드의 데이터셋이 로딩후 연결된 콤보가 수정되지 않았는데도 수정된걸로 인식되면 null이나 undefined로 정의하여 맞춘다.
     * @config emptyValue
     * @type {Object}
     * @default null
     */
    /**
     * @description 값이 선택되어 있지 않을 경우 리턴시 값을 '' 공백 문자로 리턴할지 null로 리턴할지를 결정한다. 그리드의 데이터셋이 로딩후 연결된 콤보가 수정되지 않았는데도 수정된걸로 인식되면 null이나 undefined로 정의하여 맞춘다.
     * @property emptyValue
     * @private
     * @type {Object}
     */
    emptyValue: null,
    /**
     * @description 통화 형식 유효성 체크 여부
     * @config isCurrency
     * @sample default
     * @type {boolean}
     * @default true
     */
    isCurrency: true,
    /**
     * @description Dom객체 생성 및 초기화하는 메소드
     * @method initComponent
     * @protected
     * @param {String|Object} el 객체의 아이디나 객체
     * @param {Object} config 환경정보 객체
     * @return {void}
     */
    initComponent: function(config) {
        if(this.decimalPrecision != 0)
            this.includeChars += this.decimalSeparator;
        if(this.minValue != null && this.minValue < 0)
            this.includeChars += '-';
        if(this.isCurrency)
            this.includeChars += this.thousandsSeparator;
    },
    /**
     * @description Dom객체 생성
     * @method createTemplate
     * @protected
     * @param {String|Object} el 객체의 아이디나 객체
     * @return {Rui.LElement} Element 객체
     */
    createTemplate: function(el) {
    	var elContainer = Rui.ui.form.LNumberBox.superclass.createTemplate.call(this, el);
    	if(Rui.platform.isMobile) this.inputEl.dom.type = 'number';
    	if(this.maxValue != null) this.inputEl.dom.max = this.maxValue;
    	if(this.minValue != null) this.inputEl.dom.min = this.minValue;
        return elContainer;
    },
    /**
     * @description render시 호출되는 메소드
     * @method doRender
     * @protected 
     * @param {String|Object} parentNode 부모노드
     * @return {void}
     */
    doRender: function(){
        this.createTemplate(this.el);
        
        var hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = this.name || this.id;
        hiddenInput.instance = this;
        hiddenInput.className = 'L-instance L-hidden-field';
        this.el.appendChild(hiddenInput);
        this.hiddenInputEl = Rui.get(hiddenInput);
        this.hiddenInputEl.addClass('L-hidden-field');
        
        this.inputEl.removeAttribute('name');
        this.inputEl.setStyle('ime-mode', 'disabled'); // IE,FX
    },
    /**
     * @description Check limit valid value
     * @method isLimitValue
     * @private
     * @param {object} Event
     * @return {boolean}
     */
    isLimitValue: function(e) {
        if(this.mask != null)return false;
        if(this.getValue() == null) return false;
        if(this.maxValue == null && this.decimalPrecision < 1) return false;
        this.progress = false;
        this.constValue = null;

         var pos = DL.getSelectionStart(this.getDisplayEl().dom);
         var s = this.getDisplayEl().dom;

        if(Rui.browser.msie) pos = s.value.toString().length;

        //s.value = s.value.toString();
        var preCaret = s.value.substring(0, pos).replace(/ /g, '\xa0') || '\xa0';
        if(this.caretE == 0)
            return true;

        var prePos = preCaret.split(this.decimalSeparator);
        var maxLength = this.maxValue ? this.maxValue.toString().length : 20;

        if(this.maxValue < prePos[0] ){// 입력값 초과
            Rui.util.LEvent.stopEvent(e);
            e.returnValue = false;
            this.progress = true;
            this.constValue = s.value;
            return true;
        }

        if(this.maxValue <= s.value){
            Rui.util.LEvent.stopEvent(e);
            e.returnValue = false;
            this.progress = true;
            this.constValue = prePos[0];
            return true;
        }

        if( (pos == maxLength || pos > maxLength) && prePos.length < 2){
            Rui.util.LEvent.stopEvent(e);
            e.returnValue = false;
            this.progress = true;
            this.constValue = prePos[0];
            return true;
        }

        if(prePos.length < 2) {
            s.value = s.value + this.decimalSeparator + '0';
            Rui.util.LEvent.stopEvent(e);
            e.returnValue = false;
            this.constValue = s.value;
            return true;
        }

        if(this.decimalPrecision == 1){
            Rui.util.LEvent.stopEvent(e);
            e.returnValue = false;
            this.constValue =  prePos[0] + this.decimalSeparator;
            return true;
        }

        if(this.decimalPrecision >= prePos[1].length){
            Rui.util.LEvent.stopEvent(e);
            e.returnValue = false;
            this.constValue = s.value;
            return true;
        }
    },
    /**
     * @description update cursor position
     * @method updatePos
     * @private
     * @param {HtmlElement} dom dom객체
     * @return {void}
     */
    updatePos: function(o) {
    	if(Rui.platform.isMobile) return;
        var dl = DL.getSelectionInfo(o);
        if(dl == null)return;
        this.caretPos = dl.begin;
        this.selectedText = dl.selectedText;
        this.preText = dl.preText;
        this.afterText = dl.afterText;
        this.maxLength = dl.maxLength;
        this.caretS = dl.begin;
        this.caretE = dl.end;
    },
    /**
     * @description 키 입력시 filter되는 메소드
     * @method onFilterKey
     * @protected
     * @param {Object} e Event 객체
     * @return {void}
     */
    onFilterKey: function(e) {
        if(!this.filterKey) return;
        if(this.cfg.getProperty('disabled') || this.cfg.getProperty('editable') != true) return;
        this.updatePos(this.getDisplayEl().dom);
        if(this.includeChars == null || this.includeChars == '') return;
        var KEY = Rui.util.LKey.KEY;
        if(e.shiftKey || e.altKey || e.ctrlKey){
            this.specialKeypress = true;
            if(e.keyCode == KEY.CONTROL) {
                this.ctrlKeypress = true;
                return;
            }
        }
        if(e.keyCode != KEY.SPACE && (Rui.util.LEvent.isSpecialKey(e) || e.keyCode == KEY.BACK_SPACE || e.keyCode == KEY.DELETE) || (e.ctrlKey === true && (e.keyCode === 70 || String.fromCharCode(e.keyCode) == 'V')))
            return;
        var c = e.charCode || e.which || e.keyCode;
        var charCode = this.fromCharCode(c);
        if(charCode == this.decimalSeparator){
        	if(this.decimalPrecision > -1 && this.decimalPrecision < 1) {
        		Rui.util.LEvent.stopEvent(e);
        		return;
        	}
            var v = this.getValue();
            if(v) String(v).replace(this.selectedText,charCode);
            return;
        }
        if(this.includeChars.indexOf(charCode) === -1){
            // Ctrl + A, C,V,X
            if( this.ctrlKeypress && (c == 65 || c == 67 || c== 86 || c == 88))return;
            if(c == 189 || c == 109 )
                if(this.caretPos == 0)return; // return '-'
            Rui.util.LEvent.stopEvent(e);
            e.returnValue = false;
        } else{
            if(c == 189 || c == 109 ){
                if(this.caretPos == 0)return; // return '-'  FireFox 예외
                else if(this.caretPos > 0){
                    Rui.util.LEvent.stopEvent(e);
                     e.returnValue = false;
                     return;
                }
            }
            if(this.mask != null) return;

            if(charCode == this.decimalSeparator){
            	if(this.decimalPrecision > -1 && this.decimalPrecision < 1) {
            		Rui.util.LEvent.stopEvent(e);
            		return;
            	}
                var s = this.getDisplayEl().dom;
                this.setCaret(s.value.length+1);
                return;
            }
            if(this.isCurrency && charCode == this.thousandsSeparator) return;

            if(this.preText === undefined) return;
            var preDiv = this.preText.split(this.decimalSeparator);

            if(preDiv.length == 0) return;
            if(this.selectedText.trim().length == 0 && preDiv.length > 1 && preDiv[1].length != this.decimalPrecision){
                var decimalValue = this.getDisplayEl().dom.value.split(this.decimalSeparator)[1];
                if(decimalValue.length != this.decimalPrecision) return;
            }
            if(preDiv.length < 2) return;

            if(this.decimalPrecision > 0) {
                this.arrangeValues(e,charCode);
            }
         }
     },
     /**
      * @description Keypress 이벤트가 발생하면 처리하는 메소드 , Check the firefox keyvalue
      * @method onKeypress
      * @private
      * @param {Object} e Event 객체
      * @return {void}
      */
     onKeypress: function(e) {
        if(!this.filterKey) return;

        var KEY = Rui.util.LKey.KEY;
        var c = e.charCode || e.which || e.keyCode;
        var s = this.getDisplayEl().dom;
        if(c == KEY.BACK_SPACE || (!this.specialKeypress && c == 37) || c == 39 || c == 45 || c == 46 ){
            if(c == 46) {
                if(s.value.indexOf(this.decimalSeparator) > -1) {
                	Rui.util.LEvent.stopEvent(e);
                    return;
                }
            }
            if(c == 46 && this.decimalPrecision > -1 && this.decimalPrecision < 1)
                Rui.util.LEvent.stopEvent(e);
            return;
        }

        if(c == 189 || c == 109) return;
        // ctrl+C,V,X
        if(this.ctrlKeypress && (c == 97 || c == 99 || c == 118 || c == 120)) return;
        if(c == 189 || c == 109)return; // return '-'
        var k =  String.fromCharCode(c);
        if(k == this.decimalSeparator) {
        	if(s.value.indexOf(this.decimalSeparator) > -1 || s.value == '')
         		Rui.util.LEvent.stopEvent(e);
        }
        //var pattern = new RegExp('[0-9]||' + this.decimalSeparator + '\'');
        var pattern = new RegExp('[0-9\\' + this.decimalSeparator + (this.isCurrency?this.thousandsSeparator:'') + ']');
        if(!pattern.test(k))
        	Rui.util.LEvent.stopEvent(e);
     },
     /**
      * @description Keyup 이벤트가 발생하면 처리하는 메소드
      * @method onKeyup
      * @private
      * @param {Object} e Event 객체
      * @return {void}
      */
     onKeyup: function(e) {
        if(!this.filterKey) return;
        var KEY = Rui.util.LKey.KEY;
        if(Rui.util.LEvent.isSpecialKey(e)){
           if(e.keyCode == KEY.SHIFT || e.keyCode == KEY.ALT || e.keyCode == KEY.CONTROL){
               this.specialKeypress = false;
               if(e.keyCode == KEY.CONTROL){
                  this.ctrlKeypress = false;
               }
           }
            this.fireEvent('keyup', e); 
            return;
        }
        var c = e.charCode || e.which || e.keyCode;
        var charCode = this.fromCharCode(c);
        var s = this.getValue();
        if(this.includeChars.indexOf(charCode) === -1){
            // Ctrl + A, C,V,X
            if( this.ctrlKeypress && (c == 65 || c == 67 || c== 86 || c == 88))return;
            if(c == 189 || c == 109)return; // return '-'
            //if(s != null){
         	    var txt = (s + '').replace(/[\ㄱ-ㅎ가-힣]/g, '');
                if(txt != s)
                    this.setValue(txt);
                var displayEl = this.getDisplayEl();
                if(ST.isHangul(displayEl.getValue()))
                    displayEl.setValue(ST.getSkipHangulChar(displayEl.getValue()));
            //}
            Rui.util.LEvent.stopEvent(e);
            e.returnValue = false;
            return;
        } else{
            if(c == 189 || c == 109) return;
        }
         
        this.fireEvent('keyup', e);
     },
     /**
      * @description arrange position value
      * @method arrangeValues
      * @private
      * @param {Object} event
      * @param {String} String
      * @return {void}
      */
    arrangeValues: function(e,charCode){
        var s = this.getDisplayEl().dom;
        if(s.value == '') return;
        s.value = s.value.toString();

        if(this.currFocus){
            if(s.value != '-' && this.caretPos == 0
                    && this.caretS == 0 && this.caretE == 0
                    && this.afterText.length == 0)
                s.value = '';
            this.currFocus = false;
        }

        if(this.isLimitValue(e)){
            var sValue = s.value;
            if(sValue != null){
                if( this.caretPos <= sValue.length && ( this.caretPos != 0 || (this.caretS != this.caretE))){
                    this.selectedText  = this.selectedText;
                    this.preText = this.preText.replace(/^\xa0'*|\xa0'*$/g, '');
                    this.afterText = this.afterText.replace(/^\xa0'*|\xa0'*$/g, '');

                    if(this.caretS == 0 && (this.caretE-this.caretS) == 1  ){
                        if(this.preText == '')
                            s.value = charCode.toString() + this.afterText;
                        else
                            s.value = sValue.concat(charCode);
                        this.setCaret(this.caretE + 1);
                        this.caretPos = 0;
                        this.progress = false;
                        Rui.util.LEvent.stopEvent(e);
                         e.returnValue = false;
                        return;

                    } else if(this.caretPos !=0 && this.caretS > 0 && (this.caretS == this.caretE) ){
                        var preDiv = this.preText.split(this.decimalSeparator);
                        if(preDiv.length == 2 && preDiv[1].length == this.decimalPrecision)
                            s.value = s.value.substring(0,s.value.length-1) + charCode + this.afterText;
                        else{
                            var decimalValue = s.value.split(this.decimalSeparator)[1];
                            if(decimalValue.length != this.decimalPrecision) s.value = this.preText + charCode + this.afterText;
                            else s.value = this.preText + charCode + this.afterText.substring(1, this.afterText.length);
                        }
                        this.setCaret(this.caretE +1);
                        return;
                    } else
                    s.value = sValue.replace(/^\xa0'*|\xa0'*$/g, '');

                    if(this.caretS != this.caretE ){
                         s.value = this.preText + charCode + this.afterText;
                         this.setCaret(this.caretS + 1);
                    }
                    this.caretPos = 0;
                    this.progress = false;
                    return;
                } else if( this.caretE == 0){
                    s.value = charCode + this.afterText;
                    this.setCaret(this.caretE + 1);
                    this.progress = true;
                    Rui.util.LEvent.stopEvent(e);
                     e.returnValue = false;
                    return;
                }
                this.concatValues(s,sValue,charCode);
            }
        }
    },
    /**
     * @description concat values
     * @method concatValues
     * @private
     * @param {HtmlElement} Html Element
     * @param {String} input value
     * @param {String} input character
     * @return {void}
     */
    concatValues: function(s,sValue,charCode){
        var v;
        if(this.maxValue == this.constValue){
            s.value = this.constValue.substr(0,  this.constValue.length-1);
            v = s.value.concat(charCode);

            if(this.maxValue >= v ){
                s.value = v;
                this.progress = false;
            }
            else {
                s.value = this.maxValue;
                this.progress = false;
                return;
            }
        }
        else{
            if(Rui.browser.msie){
                s.value = this.constValue;
                this.caretPos = this.caretPos + 1;
            }
            else {s.value = sValue.substr(0, sValue.length-1);}
        }

        if(this.progress && this.decimalPrecision > 0){
            s.value = this.constValue.concat(this.decimalSeparator);
            v = s.value.concat(charCode);
        } else {v = s.value.concat(charCode);}

        s.value = v;
        this.progress = false;
    },
    /**
     * @description render 후 호출하는 메소드
     * @method afterRender
     * @protected
     * @param {HttpElement} container 부모 객체
     * @return {String}
     */
    afterRender: function(container) {
        Rui.ui.form.LNumberBox.superclass.afterRender.call(this, container);
        var inputEl = this.getDisplayEl();
        if(this.filterKey)
            inputEl.on('keydown', this.onFilterKey, this, true);
        if(this.mask && !Rui.platform.isMobile){
            inputEl.on('keydown', this.onKeyDownMask, this, true);
            inputEl.on('keypress', this.onKeyPressMask, this, true);
        }
    },
    /**
     * @description 유효성을 검증하는 메소드
     * @method validateValue
     * @protected
     * @param {object} value 값
     * @return {boolean}
     */
    validateValue: function(value) {
        if(value === this.lastValue) return true;
        value = String(value);
        //value = this.getNormalValue(value);
        var isValid = true;
        isValid = new Rui.validate.LNumberValidator({id: this.id}).validate(value);
        if(isValid == false) return false;
        if(!Rui.isUndefined(value) && !Rui.isNull(value))
            // if(this.validateMaxValue(value) == false) return false;
            // validateMinValue 수행 위치 이동 onCanBlur -> validateValue
            if(this.validateMaxValue(value) == false || this.validateMinValue(value) == false) return false;
        var pos = value.indexOf(this.decimalSeparator) || 0;
        if(pos > 0) {
            var dpValue = value.substring(pos + 1);
            if(this.decimalPrecision > 0 && dpValue.length > this.decimalPrecision) return false;
        }
        this.valid();
        return isValid;
    },
    /**
     * @description maxValue의 유효성을 검증하는 메소드
     * @method validateMaxValue
     * @protected
     * @param {object} value 값
     * @return {boolean}
     */
    validateMaxValue: function(value) {
        if(this.isNumberValue(value) == false) return false;
        if(this.maxValue != null && this.maxValue < value) {
            DL.toast(Rui.getMessageManager().get('$.base.msg012', [this.maxValue]), this.el.dom);
            this.setValue(this.lastValue, true);
            this.inputEl.focus();
            return false;
        }
        return true;
    },
    /**
     * @description minValue의 유효성을 검증하는 메소드
     * @method validateMinValue
     * @protected
     * @param {object} value 값
     * @return {boolean}
     */
    validateMinValue: function(value) {
        if(this.isNumberValue(value) == false) return false;
        if(this.minValue != null && this.minValue > value) {
            DL.toast(Rui.getMessageManager().get('$.base.msg011', [this.minValue]), this.el.dom);
            this.setValue(this.lastValue, true);
            this.inputEl.focus();
            return false;
        }
        return true;
    },
    /**
     * @description 숫자 유효성을 검증하는 메소드
     * @method isNumberValue
     * @protected
     * @param {object} value 값
     * @return {boolean}
     */
    isNumberValue: function(value) {
        if(Rui.isUndefined(value) || Rui.isNull(value) || value === false) return false;
        value = value == '' ? 0 : value;
        if(value != parseFloat(value, 10)) return false;
        return true;
    },
    /**
     * @description 통화 유효성을 검증하는 메소드
     * @method validateCurrencyValue
     * @protected
     * @param {object} value 값
     * @return {boolean}
     */
    validateCurrencyValue: function(value) {
        if(value === '') return true;
        var regExp = Rui.getMessageManager().get('$.core.currencyRegExp');
        if(value.match(regExp) === null){
            DL.toast(Rui.getMessageManager().get('$.base.msg143'), this.el.dom);
            return false;
        }
        return true;
    },
    /**
     * @description 값을 리턴하는 메소드
     * @method getValue
     * @return {Int|Float}
     */
    getValue: function() {
        var val = Rui.ui.form.LNumberBox.superclass.getValue.call(this);
        val = typeof val === 'string' ? this.getNormalValue(val) : val;
        if(this.validateValue(val)) { //to-do
            if(Rui.isUndefined(this.lastValue) || val == this.lastValue) {
                if(!Rui.isEmpty(val))
                    val = parseFloat(val, 10);
                return val;
            }
            if(Rui.isEmpty(val)) return this.getEmptyValue(val);
            if(val && this.decimalSeparator != '.')
                val = String(val).replace(this.decimalSeparator, '.');
            val = parseFloat(val, 10);
            this.hiddenInputEl.setValue(val);
        } else val = this.lastValue ? this.lastValue : this.getEmptyValue(val);

        return val;
    },
    /**
     * @description decimal값을 리턴하는 메소드
     * @method getDecimalValue
     * @param {int} value 값
     * @return {String}
     */
    getDecimalValue: function(value) {
        var newValue = value;
        var sValue = value + '';
        var pos = sValue.indexOf(this.decimalSeparator) || 0;
        if(pos > 0) {
            var dpValue = sValue.substring(pos + 1);
            if(this.decimalPrecision > 0 && dpValue.length > this.decimalPrecision)
                dpValue = dpValue.substring(0, this.decimalPrecision);
            dpValue = Rui.util.LString.rPad(dpValue, '0', this.decimalPrecision);
            newValue = (value+'').substring(0, pos + 1) + dpValue;
        } else newValue += this.decimalSeparator + ST.rPad('', '0', this.decimalPrecision > -1 ? this.decimalPrecision : 0);
        newValue = newValue.charAt(newValue.length - 1) == this.decimalSeparator ? newValue.substring(0, newValue.length - 1) : newValue;
        return newValue;
    },
    /**
     * @description 출력데이터가 변경되면 호출되는 메소드
     * @method doChangedDisplayValue
     * @private
     * @param {String} o 적용할 값
     * @return {void}
     */
    doChangedDisplayValue: function(o) {
        var val = String(o);
        val = this.getNormalValue(val);
        if(this.isNumberValue(val) || val === null || val === '') this.setValue(val);
    },
    /**
     * @description 값을 변경한다.
     * @method setValue
     * @public
     * @param {int} val 반영할 값
     * @return {void}
     */
    setValue: function(val, ignore) {
        //  || Rui.isNull(val) 조건을 추가하면 기본값 null과 defaultValue의 null값과 같으므로 changed 이벤트가 발생하지 않음.
        if(Rui.isUndefined(val) == true) return;
        val = Rui.isNull(val) ? '' : val;
        if(this.validateValue(val)) {
            this.hiddenInputEl.setValue(val);
            var displayValue = val;
            if(!Rui.isEmpty(displayValue)) {
                displayValue = String(displayValue)
                displayValue = this.getNormalValue(displayValue);
                if(this.thousandsSeparator || this.decimalSeparator) {
                    if(this.isCurrency) displayValue = Rui.util.LNumber.format(parseFloat(displayValue, 10), {thousandsSeparator: this.thousandsSeparator, decimalSeparator: this.decimalSeparator});
                    else displayValue = Rui.util.LNumber.format(parseFloat(displayValue, 10), {decimalSeparator: this.decimalSeparator});
                }
                if(this.decimalPrecision > 0)
                    displayValue = this.getDecimalValue(displayValue);
            }
        
        	this.getDisplayEl().setValue(Rui.platform.isMobile ? val : displayValue);
        	if(this.isFocus){
        		var byteLength = ST.getByteLength(displayValue);
        		this.setSelectionRange(0, byteLength);
        	}
        	if(ignore !== true) this.fireEvent('changed', {target:this, value:this.getValue(), displayValue:this.getDisplayValue()});
        }
        this.setPlaceholder();
    },
    /**
     * @description blur 이벤트 발생시 호출되는 메소드
     * @method onCanBlur
     * @private
     * @param {Object} e Event 객체
     * @return {void}
     */
    onCanBlur: function(e) {
        var ret = Rui.ui.form.LNumberBox.superclass.onCanBlur.call(this, e);
    	var value = this.getDisplayEl().getValue();
        if(this.isCurrency) {
            if(this.validateCurrencyValue(value) == false) return false;
        }
        return ret;
    },
    /**
     * @description 포맷팅된 문자열 숫자를 일반 숫자로 변경하는 메소드
     * @method getNormalValue
     * @private
     * @param {object} value 값
     * @return {object}
     */
    getNormalValue: function(val) {
    	var r = Rui.util.LString.replaceAll(val, this.thousandsSeparator, '');
    	r = (r) ? r.replace(',', '.') : r;
    	return r;
    }
});
})();

/**
 * 날짜를 입력하는 LDateBox 편집기
 * @namespace Rui.ui.form
 * @class LDateBox
 * @extends Rui.ui.form.LTextBox
 * @sample default
 * @constructor LDateBox
 * @param {Object} config The intial LDateBox.
 */
Rui.ui.form.LDateBox = function(config){
    config = Rui.applyIf(config || {}, Rui.getConfig().getFirst('$.ext.dateBox.defaultProperties'));
    if(Rui.platform.isMobile) {
    	config.localeMask = false;
    	config.picker = false;
    }
    if(config.localeMask) this.initLocaleMask();
    if(!config.placeholder) {
        var xFormat = this.getLocaleFormat();
        try { xFormat = xFormat.toLowerCase().replace('%y', 'yyyy').replace('%m', 'mm').replace('%d', 'dd'); } catch(e) {};
        config.placeholder = xFormat;
    }
    Rui.ui.form.LDateBox.superclass.constructor.call(this, config);
};
Rui.extend(Rui.ui.form.LDateBox, Rui.ui.form.LTextBox, {
    /**
     * @description 객체의 문자열
     * @property otype
     * @private
     * @type {String}
     */
    otype: 'Rui.ui.form.LDateBox',
    /**
     * @description 기본 CSS명
     * @property CSS_BASE
     * @private
     * @type {String}
     */
    CSS_BASE: 'L-datebox',
    /**
     * @description 입출력 값을 Date형으로 할것인지 String형으로 할 것인지 결정한다.
     * 기본 값은 Date형 이며, String형으로 사용 할 경우 입출력 값의 포맷은 valueFormat 속성값에 따른다.
     * @config dateType
     * @type {String}
     * @default 'date'
     */
    /**
     * @description 입출력 값을 Date형으로 할것인지 String형으로 할 것인지 결정한다.
     * 기본 값은 Date형 이며, String형으로 사용 할 경우 입출력 값의 포맷은 valueFormat 속성값에 따른다.
     * @property dateType
     * @private
     * @type {String}
     */
    dateType: 'date',
    /**
     * @description mask를 제외한 실제 값의 format을 지정하는 속성, form submit시 적용되는 format
     * @config valueFormat
     * @sample default
     * @type {String}
     * @default '%Y-%m-%d'
     */
    /**
     * @description mask를 제외한 실제 값의 format을 지정하는 속성, form submit시 적용되는 format
     * @property valueFormat
     * @private
     * @type {String}
     */
    valueFormat: '%Y-%m-%d',
    /**
     * @description calendar picker show할때 입력된 날짜를 calendar에서 선택할지 여부
     * @property selectingInputDate
     * @private
     * @type {boolean}
     */
    selectingInputDate: true,
    /**
     * @description width
     * @config width
     * @type {int}
     * @default 90
     */
    /**
     * @description width
     * @property width
     * @private
     * @type {int}
     */
    width: 90,
    /**
     * @description Picker Icon의 width
     * 기본값은 20이며 CSS에서 icon width를 변경할 경우 이 값도 동일하게 변경하여야 합니다.
     * @config iconWidth
     * @type {int}
     * @default 20
     */
    /**
     * @description Picker Icon의 width
     * 기본값은 20이며 CSS에서 icon width를 변경할 경우 이 값도 동일하게 변경하여야 합니다.
     * @property iconWidth
     * @private
     * @type {int} 
     */ 
    iconWidth: 20,
    /**
     * @description input과 Picker Icon간의 간격
     * @config iconMarginLeft
     * @type {int}
     * @default 1
     */
    /**
     * @description input과 Picker Icon간의 간격
     * @property iconMarginLeft
     * @private
     * @type {int}
     */
    iconMarginLeft: 1,
    /**
     * @description 다국어 mask 적용 여부 / 다국어 마스크가 적용되면 mask 속성은 무시된다.
     * @config localeMask
     * @type {boolean}
     * @default false
     */
    /**
     * @description 다국어 mask 적용 여부
     * @property localeMask
     * @private
     * @type {boolean}
     */
    localeMask: false,
    /**
     * @description blur시 contains 체크를 할지 여부
     * @property checkContainBlur
     * @private
     * @type {boolean}
     */
    checkContainBlur: Rui.platform.isMobile ? false : true,
    /**
     * @description calendar picker의 펼쳐짐 방향 (auto|up|down)
     * @config listPosition
     * @type {String}
     * @default 'auto'
     */
    /**
     * @description calendar picker의 펼쳐짐 방향 (auto|up|down)
     * @property listPosition
     * @private
     * @type {String}
     */
    listPosition: 'auto',
    /**
     * @description 달력아이콘 표시 여부
     * @config picker
     * @type {boolean}
     * @default true
     */
    /**
     * @description 달력아이콘 표시 여부
     * @property picker
     * @private
     * @type {boolean}
     */
    picker: true,
    /**
     * @description displayFormat으로 display값을 출력하는 포멧 지정(개발자는 mask로 처리해야 하므로 오픈되면 안됨)
     * @property displayValue
     * @private
     * @type {String}
     */
    displayValue: Rui.platform.isMobile ? '%Y-%m-%d' : '%x',
    /**
     * @description 값이 선택되어 있지 않을 경우 리턴시 값을 '' 공백 문자로 리턴할지 null로 리턴할지를 결정한다. 그리드의 데이터셋이 로딩후 연결된 콤보가 수정되지 않았는데도 수정된걸로 인식되면 null이나 undefined로 정의하여 맞춘다.
     * @config emptyValue
     * @type {Object}
     * @default null
     */
    /**
     * @description 값이 선택되어 있지 않을 경우 리턴시 값을 '' 공백 문자로 리턴할지 null로 리턴할지를 결정한다. 그리드의 데이터셋이 로딩후 연결된 콤보가 수정되지 않았는데도 수정된걸로 인식되면 null이나 undefined로 정의하여 맞춘다.
     * @property emptyValue
     * @private
     * @type {Object}
     */
    emptyValue: null,
    /**
     * @description calendar의 생성자 options을 추가한다.
     * @config calendarConfig
     * @type {Object}
     * @default null
     */
    /**
     * @description calendar의 생성자 options을 추가한다.
     * @property calendarConfig
     * @private
     * @type {Object}
     */
    calendarConfig: null,
    /**
     * @description icon의 tabIndex를 지정한다. -1이면 지정안한다.
     * @config iconTabIndex
     * @type {Int}
     * @default 0
     */
    /**
     * @description icon의 tabIndex를 지정한다. -1이면 지정안한다.
     * @property iconTabIndex
     * @private
     * @type {Int}
     */
    iconTabIndex: 0,
    /**
     * @description Dom객체 생성 및 초기화하는 메소드
     * @method initComponent
     * @protected
     * @param {Object} config 환경정보 객체
     * @return {void}
     */
    initComponent: function(config){
    	Rui.ui.form.LDateBox.superclass.initComponent.call(this, config);
        this.calendarClass = Rui.ui.calendar.LCalendar;
        var dvs = this.displayValue.split("%");
        if(dvs.length > 1 && dvs[1].length > 1)
        	this.displayValueSep = dvs[1].substring(1);
    },
    /**
     * @description render시 호출되는 메소드
     * @method doRender
     * @protected
     * @param {String|Object} parentNode 부모노드
     * @return {void}
     */
    doRender: function(){
    	if(Rui.platform.isMobile && (this.type == null || this.type == 'text')) this.type = 'date';
        this.createTemplate(this.el);

        var hiddenInput = document.createElement('input');
        hiddenInput.type = 'hidden';
        hiddenInput.name = this.name || this.id;
        hiddenInput.id = Rui.useFixedId() ? Rui.id(this.el, 'LDateBox-hidden-' + this.id) : Rui.id();
        hiddenInput.instance = this;
        hiddenInput.className = 'L-instance L-hidden-field';
        this.el.appendChild(hiddenInput);
        this.hiddenInputEl = Rui.get(hiddenInput);
        this.hiddenInputEl.addClass('L-hidden-field');

        this.inputEl.removeAttribute('name');
        this.inputEl.setStyle('ime-mode', 'disabled'); // IE,FX
        if(Rui.platform.isMobile) {
            this.inputEl.on('change', function(e){
            	this.setValue(this.inputEl.getValue());
            }, this, true);
        }
        this.doRenderCalendar();
    },
    /**
     * @description doRenderCalendar
     * @method doRenderCalendar
     * @protected
     * @return {void}
     */
    doRenderCalendar: function(){
        if(!this.picker) return;

        var calendarDiv = document.createElement('div');
        calendarDiv.className = 'L-cal-container';
        calendarDiv.id = Rui.useFixedId() ? Rui.id(this.el, 'LDateBox-cal-' + this.id) : Rui.id();
        this.calendarDivEl = Rui.get(calendarDiv);
        //ie의 layer z-index문제로 body에 붙임
        document.body.appendChild(calendarDiv);

        var iconDom = document.createElement('a');
        iconDom.className = 'icon';
        iconDom.id = Rui.useFixedId() ? Rui.id(this.el, 'LDateBox-icon-' + this.id) : Rui.id();
        this.el.appendChild(iconDom);
        this.iconEl = Rui.get(iconDom);
        if(Rui.useAccessibility())
            this.iconEl.setAttribute('role', 'button');

        var config = this.calendarConfig || {};
        config.applyTo = this.calendarDivEl.id;
        this.calendarDivEl.addClass(this.CSS_BASE + '-calendar');
        this.calendar = new this.calendarClass(config);
        this.calendar.render();
        this.calendar.hide();
    },
    /**
     * @description Calendar Picker를 동작하도록 한다.
     * @method pickerOn
     * @protected
     * @return {void}
     */
    pickerOn: function(){
        if(!this.iconEl) return;
        this.iconEl.on('mousedown', this.onIconClick, this, true);
        this.iconEl.setStyle('cursor', 'pointer');
        if(this.iconTabIndex > -1) this.iconEl.setAttribute('tabindex', this.iconTabIndex);
    },
    /**
     * @description Calendar Picker를 동작하지 않도록 한다.
     * @method pickerOff
     * @protected
     * @return {void}
     */
    pickerOff: function(){
        if(!this.iconEl) return;
        this.iconEl.unOn('mousedown', this.onIconClick, this);
        this.iconEl.setStyle('cursor', 'default');
        if(this.iconTabIndex > -1) this.iconEl.removeAttribute('tabindex');
    },
    /**
     * @description blur 이벤트 발생시 defer를 연결하는 메소드
     * @method deferOnBlur
     * @protected
     * @param {Object} e Event 객체
     * @return {void}
     */
    deferOnBlur: function(e) {
        if (this.calendarDivEl ? this.calendarDivEl.isAncestor(e.target) : false) {
            var el = Rui.get(e.target);
            if (el.dom.tagName.toLowerCase() == 'a' && el.hasClass('selector')) {
                var selectedDate = this.calendar.getProperty('pagedate');
                selectedDate = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), parseInt(el.getHtml()));
                this.setValue(selectedDate);
                if(this.calendar) 
                    this.calendar.hide();
            }
        }
        Rui.util.LFunction.defer(this.checkBlur, 10, this, [e]);
    },
    checkBlur: function(e) {
        if(e.deferCancelBubble == true || this.isFocus !== true) return;
        var target = e.target;
        var el = Rui.get(e.target);
        var calendarDivElId = this.calendar.id;
        if(target !== this.el.dom && !this.el.isAncestor(target) && ( this.calendarDivEl ? target !== this.calendarDivEl.dom && !(this.calendarDivEl.isAncestor(target)) && !(el.dom.tagName.toLowerCase() === 'a' && el.dom.id.indexOf(calendarDivElId) !== -1 ) : true)) {
            Rui.util.LEvent.removeListener(Rui.browser.msie ? document.body : document, 'mousedown', this.deferOnBlur);
            this.onBlur.call(this, e); 
            this.isFocus = false;
        }else{
            e.deferCancelBubble = true;
        }
    },
    /**
     * @description onBlur
     * @method onBlur
     * @param {Object} e event object
     * @private
     * @return {void}
     */
    onBlur: function(e){
        Rui.ui.form.LDateBox.superclass.onBlur.call(this, e);
        if(this.calendar)
            this.calendar.hide();
    },
    /**
     * @description 출력데이터가 변경되면 호출되는 메소드
     * @method doChangedDisplayValue
     * @private
     * @param {String} o 적용할 값
     * @return {void}
     */
    doChangedDisplayValue: function(o) {
        this.setValue(o);
    },
    /**
     * @description string convert to date object
     * @method getDate
     * @private
     * @param {string} sDate
     * @return {Date}
     */
    getDate: function(sDate){
        if(sDate instanceof Date) {
            return sDate;
        }
        var oDate = Rui.util.LFormat.stringToDate(sDate, {format: this.displayValue || '%x'});
        if(!(oDate instanceof Date)) {
            oDate = Rui.util.LFormat.stringToDate(sDate, {format: this.valueFormat});
        }
        if(oDate instanceof Date) {
            return oDate;
        }else{
            return false;
        }
    },
    /**
     * @description date convert to formatted string
     * @method getDateString
     * @param {Date} oDate
     * @param {String} format
     * @private
     * @return {String}
     */
    getDateString: function(oDate, format){
        //mask를 사용하므로 구분자가 없는 날짜 8자가 기본이다.
        format = format ? format : '%Y%m%d';
        var value = oDate ? Rui.util.LFormat.dateToString(oDate, {
            format: format
        }) : '';
        return value ? value : '';
    },
    /**
     * @description calendar 전시 위치 설정
     * @method setCalendarXY
     * @private
     * @return {void}
     */
    setCalendarXY: function(){
        var h = this.calendarDivEl.getHeight() || 0,
            t = this.getDisplayEl().getTop() + this.getDisplayEl().getHeight(),
            l = this.getDisplayEl().getLeft();
        if((this.listPosition == 'auto' && !Rui.util.LDom.isVisibleSide(h+t)) || this.listPosition == 'up')
                t = this.getDisplayEl().getTop() - h;
        var vSize = Rui.util.LDom.getViewport();
        if(vSize.width <= (l + this.calendarDivEl.getWidth())) l -= (this.calendarDivEl.getWidth() / 2);
        this.calendarDivEl.setTop(t);
        this.calendarDivEl.setLeft(l);
    },
    /**
     * @description onIconClick
     * @method onIconClick
     * @private
     * @param {Object} e
     * @return {void}
     */
    onIconClick: function(e) {
        this.showCalendar();
        this.inputEl.focus();
        Rui.util.LEvent.preventDefault(e);
    },
    /**
     * @description Calendar를 출력한다.
     * @method showCalendar
     * @private
     * @return {void}
     */
    showCalendar: function(){
        if(this.disabled === true) return;
        this.calendarDivEl.setTop(0);
        this.calendarDivEl.setLeft(0);
        if (this.selectingInputDate)
            this.selectCalendarDate();
        this.calendar.show();
        this.setCalendarXY();
    },
    /**
     * @description 입력된 날짜 선택하기
     * @method selectCalendarDate
     * @param {string} date
     * @return {void}
     */
    selectCalendarDate: function(date){
        date = date || this.getValue();
        if(!(date instanceof Date)) date = this.getDate(date);
        if (date) {
            this.calendar.clear();
            var selDates = this.calendar.select(date,false);
            if (selDates.length > 0) {
                this.calendar.cfg.setProperty('pagedate', selDates[0]);
                this.calendar.render();
            }
        }
    },
    /**
     * @description localeMask 초기화 메소드
     * @method initLocaleMask
     * @protected
     * @return {void}
     */
    initLocaleMask: function() {
    	if(!Rui.platform.isMobile) {
            var xFormat = this.getLocaleFormat();
            var order = xFormat.split('%');
            var mask = '';
            var c = '';
            for (var i=1;i<order.length;i++){
                c = order[i].toLowerCase().charAt(0);
                switch(c){
                    case 'y':
                    mask += '9999';
                    break;
                    case 'm':
                    mask += '99';
                    break;
                    case 'd':
                    mask += '99';
                    break;
                }
                if(order[i].length > 1) mask += order[i].charAt(1);
            }
            this.mask = mask;
    	}
        this.displayValue = '%x';
    },
    /**
     * @description 현재 설정되어 있는 localeMask의 format을 리턴한다.
     * @method getLocaleFormat
     * @return {String}
     */
    getLocaleFormat: function() {
        var sLocale = Rui.getConfig().getFirst('$.core.defaultLocale');
        var xFormat = '%x';
        if(this.displayValue && this.displayValue.length < 4) {
        	var displayFormat = this.displayValue.substring(1);
            xFormat = Rui.util.LDateLocale[sLocale][displayFormat];
        } else xFormat = this.displayValue;
        return xFormat;
    },
    /**
     * @description width 속성에 따른 실제 적용 메소드
     * @method _setWidth
     * @protected
     * @param {String} type 속성의 이름
     * @param {Array} args 속성의 값 배열
     * @param {Object} obj 적용된 객체
     * @return {void}
     */
    _setWidth: function(type, args, obj) {
        if(args[0] < 0) return;
        Rui.ui.form.LDateBox.superclass._setWidth.call(this, type, args, obj);
        if(this.iconEl){
            this.getDisplayEl().setWidth(this.getContentWidth() - (this.iconEl.getWidth() || this.iconWidth) - this.iconMarginLeft);
        }
    },
    /**
     * @description disabled 속성에 따른 실제 적용 메소드
     * @method _setDisabled
     * @protected
     * @param {String} type 속성의 이름
     * @param {Array} args 속성의 값 배열
     * @param {Object} obj 적용된 객체
     * @return {void}
     */
    _setDisabled: function(type, args, obj) {
        if(args[0] === false) this.pickerOn();
        else this.pickerOff();
        Rui.ui.form.LDateBox.superclass._setDisabled.call(this, type, args, obj);
        //TODO TextBox는 dom disable을 하는데 왜 datebox는 dom disable을 하지 않는가? 별도 논의 필요.
        //this.getDisplayEl().dom.disabled = false;
    },
    /**
     * @description 날짜값을 반영한다.
     * @method setValue
     * @sample default
     * @param {Date} oDate
     * @return {void}
     */
    setValue: function(oDate, ignore){
        var bDate = oDate;
        //빈값을 입력하면 null, 잘못입력하면 이전값을 넣는다.
        if(typeof oDate === 'string'){
            //getUnmaskValue는 자리수로 검사하므로 mask안된 값이 들어오면 값을 잘라낸다.
        	if(oDate && Rui.isString(oDate) && Rui.platform.isMobile === true) {
        		oDate = oDate.replace(/-/g, '');
        		oDate = Rui.util.LString.toDate(oDate, '%Y%m%d');
        	} else {
            	oDate = (oDate.length == 8 || oDate.length == 14 || Rui.util.LString.isHangul(oDate)) ? oDate : this.getUnmaskValue(oDate);
                if(!Rui.isEmpty(oDate)) oDate = (this.localeMask) ? this.getDate(bDate) : this.getDate(oDate);
                else oDate = null;
        	}
        }
        if (oDate === false) {
        	var invalidMsg = Rui.getMessageManager().get('$.base.msg016');
        	Rui.util.LDom.toast(invalidMsg, this.el.dom);
        	this.invalid(invalidMsg);
            this.getDisplayEl().dom.value = this.lastDisplayValue || '';
        } else {
            var hiddenValue = oDate === null ? '' : this.getDateString(oDate, this.valueFormat);
            var displayValue = oDate === null ? '' : this.getDateString(oDate);
            if(this.localeMask) {
                displayValue = this.getDateString(oDate, this.getLocaleFormat());
            } else {
            	if(Rui.platform.isMobile && oDate)
            		this.getDisplayEl().dom.value = oDate.format('%Y-%m-%d');
            	else
            		this.getDisplayEl().dom.value = displayValue;
                displayValue = this.checkValue().displayValue;
            }
            if(Rui.platform.isMobile) displayValue = this.getDisplayEl().dom.value;
            this.getDisplayEl().dom.value = displayValue;
            if (this.hiddenInputEl.dom.value !== hiddenValue) {
                this.hiddenInputEl.setValue(hiddenValue);
                this.lastDisplayValue = displayValue;
                //값이 달라질 경우만 발생.
                if(ignore !== true) {
                    this.fireEvent('changed', {
                        target: this,
                        value: this.getValue(),
                        displayValue: this.getDisplayValue()
                    });
                }
            }
        }
    },
    /**
     * @description 입력된 날짜 가져오기
     * @method getValue
     * @sample default
     * @return {Date}
     */
    getValue: function(){
        var value = Rui.ui.form.LDateBox.superclass.getValue.call(this);
        var oDate = null;
        if(this.localeMask) {
        	format = this.displayValue != '%x' ? Rui.util.LString.replaceAll(this.displayValue, this.displayValueSep, '') : '%q';
            oDate = Rui.util.LFormat.stringToDate(value,{format: format});
        } else oDate = this.getDate(value);
        return this.dateType == 'date' ? (oDate ? oDate : this.getEmptyValue(value)) : this.getDateString(oDate, this.valueFormat);
    },
    /**
     * @description 달력 숨기기
     * @method hide
     * @return {void}
     */
    hide: function(anim) {
        if(this.calendar)
            this.calendar.hide();
        Rui.ui.form.LDateBox.superclass.hide.call(this,anim);
    },
    /**
     * @description 객체를 destroy하는 메소드
     * @method destroy
     * @public
     * @return {void}
     */
    destroy: function() {
        if(this.iconEl) {
            this.iconEl.remove();
            delete this.iconEl;
        }
        if(this.calendar) this.calendar.destroy();
        Rui.ui.form.LDateBox.superclass.destroy.call(this);
    }
});
/**
 * 시간을 출력하는 LTimeBox 편집기
 * @namespace Rui.ui.form
 * @class LTimeBox
 * @extends Rui.ui.form.LTextBox
 * @sample default
 * @constructor LTimeBox
 * @param {HTMLElement | String} id The html element that represents the Element.
 * @param {Object} config The intial LTimeBox.
 */
Rui.ui.form.LTimeBox = function(config){
    config = Rui.applyIf(config || {}, Rui.getConfig().getFirst('$.ext.timeBox.defaultProperties'));
    Rui.ui.form.LTimeBox.superclass.constructor.call(this, config);
};
Rui.extend(Rui.ui.form.LTimeBox, Rui.ui.form.LTextBox, {
    /**
     * @description 객체의 문자열
     * @property otype
     * @private
     * @type {String}
     */
    otype: 'Rui.ui.form.LTimeBox',
    /**
     * @description 기본 CSS명
     * @property CSS_BASE
     * @private
     * @type {String}
     */
    CSS_BASE: 'L-timebox',
    /**
     * @description 입력 가능한 문자열
     * @property includeChars
     * @private
     * @type {String}
     */
    includeChars: '0123456789',
    /**
     * @description mask 적용 
     * @property mask
     * @private
     * @type {String}
     */
    mask: '99:99',
    /**
     * @description 가로 길이
     * @config width
     * @type {int}
     * @default 50
     */
     /**
     * @description 가로 길이
     * @property width
     * @private
     * @type {String}
     */
    width: 50,
    /**
     * @description Picker Icon의 width
     * 기본값은 9이며 CSS에서 icon width를 변경할 경우 이 값도 동일하게 변경하여야 합니다.
     * @config iconWidth
     * @type {int}
     * @default 9
     */
    /**
     * @description Picker Icon의 width
     * 기본값은 9이며 CSS에서 icon width를 변경할 경우 이 값도 동일하게 변경하여야 합니다.
     * @property iconWidth
     * @private
     * @type {int} 
     */ 
    iconWidth: 9,
    /**
     * @description input과 Picker Icon간의 간격
     * @config iconMarginLeft
     * @type {int}
     * @default 1
     */
    /**
     * @description input과 Picker Icon간의 간격
     * @property iconMarginLeft
     * @private
     * @type {int}
     */
    iconMarginLeft: 1,
    /**
     * @description icon의 tabIndex를 지정한다. -1이면 지정안한다.
     * @config iconTabIndex
     * @type {Int}
     * @default 0
     */
    /**
     * @description icon의 tabIndex를 지정한다. -1이면 지정안한다.
     * @property iconTabIndex
     * @private
     * @type {Int}
     */
    iconTabIndex: 0,
    /**
     * @description spin button을 사용할 지 여부
     * @config spinner
     * @type {boolean}
     * @default true
     */
    /**
     * @description spin button을 사용할 지 여부
     * @property spinner
     * @private
     * @type {boolean} 
     */ 
    spinner: Rui.platform.isMobile ? false : true,
    /**
     * @description blur시 contains 체크를 할지 여부
     * @property checkContainBlur
     * @private
     * @type {boolean}
     */
    checkContainBlur: Rui.platform.isMobile ? false : true,
    /**
     * @description render시 호출되는 메소드
     * @method doRender
     * @protected 
     * @param {String|Object} parentNode 부모노드
     * @return {void}
     */
    doRender: function(){
    	if(Rui.platform.isMobile) this.type = 'time';
        Rui.ui.form.LTimeBox.superclass.doRender.call(this);
        if(Rui.platform.isMobile) {
            var inputEl = this.getDisplayEl();
            inputEl.on('change', this.onChange, this, true, { system: true });
        }
        this.doRenderSpinner();
    },
    /**
     * @description Spiner 생성
     * @method createTimeTemplete
     * @private
     * @return {void}
     */
    doRenderSpinner: function() {
        if(this.spinner !== true || Rui.platform.isMobile) return;
        var iconDiv = document.createElement('div');
        iconDiv.className = 'icon';
        iconDiv.id = Rui.useFixedId() ? Rui.id(this.el, 'LTimeBox-icon-' + this.id) : Rui.id();
        this.iconDivEl = Rui.get(iconDiv);
        this.el.appendChild(iconDiv);

        var spinUpDom = document.createElement('div');
        spinUpDom.className = 'L-spin-up';
        spinUpDom.id = Rui.useFixedId() ? Rui.id(this.el, 'LTimeBox-spinup-' + this.id) : Rui.id();
        this.spinUpEl = Rui.get(spinUpDom);
        this.iconDivEl.appendChild(spinUpDom);
        
        var spinDownDom = document.createElement('div');
        spinDownDom.id = Rui.useFixedId() ? Rui.id(this.el, 'LTimeBox-spindown-' + this.id) : Rui.id();
        spinDownDom.className = 'L-spin-down';
        this.spinDownEl = Rui.get(spinDownDom);
        this.iconDivEl.appendChild(spinDownDom);
    },
    /**
     * @description Spiner를 동작하도록 한다.
     * @method spinnerOn
     * @protected
     * @return {void}
     */
    spinnerOn: function(){
        if(!this.iconDivEl) return;
        this.spinUpEl.on('mousedown', this.onSpinUpMouseEvent, this, true);
        this.spinUpEl.on('mouseup', this.onSpinUpMouseEvent, this, true);
        this.spinDownEl.on('mousedown', this.onSpinDownMouseEvent, this, true);
        this.spinDownEl.on('mouseup', this.onSpinDownMouseEvent, this, true);
        this.spinUpEl.on('click', this.spinUp, this, true);
        this.spinDownEl.on('click', this.spinDown, this, true);
        this.spinUpEl.setStyle('cursor', 'pointer');
        this.spinDownEl.setStyle('cursor', 'pointer');
        if(this.iconTabIndex > -1) {
            this.spinUpEl.setAttribute('tabindex', '0');
            this.spinDownEl.setAttribute('tabindex', '0');
        }
    },
    /**
     * @description Spiner를 동작하지 않도록 한다.
     * @method spinnerOff
     * @protected
     * @return {void}
     */
    spinnerOff: function(){
        if(!this.iconDivEl) return;
        this.spinUpEl.unOn('mousedown', this.onSpinUpMouseEvent, this);
        this.spinUpEl.unOn('mouseup', this.onSpinUpMouseEvent, this);
        this.spinDownEl.unOn('mousedown', this.onSpinDownMouseEvent, this);
        this.spinDownEl.unOn('mouseup', this.onSpinDownMouseEvent, this);
        this.spinUpEl.unOn('click', this.spinUp, this);
        this.spinDownEl.unOn('click', this.spinDown, this);
        this.spinUpEl.setStyle('cursor', 'default');
        this.spinDownEl.setStyle('cursor', 'default');
        if(this.iconTabIndex > -1) {
            this.spinUpEl.removeAttribute('tabindex');
            this.spinDownEl.removeAttribute('tabindex');
        }
    },
    /**
     * @description Spiner Up 버튼에 대한 마우스 이벤트 처리
     * @method onSpinUpMouseEvent
     * @private
     * @return {void}
     */
    onSpinUpMouseEvent: function(e){
        switch(e.type){
        case 'mousedown':
            this.spinUpEl.addClass('L-spin-up-click');
            return;
        case 'mouseup':
            this.spinUpEl.removeClass('L-spin-up-click');
            return;
        }
    },
    /**
     * @description Spiner Down 버튼에 대한 마우스 이벤트 처리
     * @method onSpinDownMouseEvent
     * @private
     * @return {void}
     */
    onSpinDownMouseEvent: function(e){
        switch(e.type){
        case 'mousedown':
            this.spinDownEl.addClass('L-spin-down-click');
            return;
        case 'mouseup':
            this.spinDownEl.removeClass('L-spin-down-click');
            return;
        }
    },
    /**
     * @description browser 객체에 input 태그의 change 이벤트가 발생하면 호출되는 메소드
     * @method onChange
     * @private
     * @return {void}
     */
    onChange: function(e) {
    	var value = e.target.value;
    	this.setValue(value);
    },
    /**
     * @description 1분 올림
     * @method spinUp
     * @protected
     * @return {void}
     */
    spinUp: function() {
        if(this.disabled || this.cfg.getProperty('editable') === false) return;
        var value = this.getValue() || '0000';
        value = value.replace(':', '');
        var hh = parseInt(value.substring(0, 2), 10);
        var mm = parseInt(value.substring(2, 4), 10);
        if(mm == 59) {
            hh = hh == 23 ? 0: (hh + 1);
            mm = 0;
        } else mm++;
        this.setValue(Rui.util.LString.lPad(hh, '0', 2) + Rui.util.LString.lPad(mm, '0', 2));
    },
    /**
     * @description 1분 내림
     * @method spinDown
     * @protected
     * @return {void}
     */
    spinDown: function() {
        if(this.disabled || this.cfg.getProperty('editable') === false) return;
        var value = this.getValue() || '0000';
        value = value.replace(':', '');
        var hh = parseInt(value.substring(0, 2), 10);
        var mm = parseInt(value.substring(2, 4), 10);
        if(mm == 00) {
            hh = hh == 0 ? 23: (hh - 1);
            mm = 59;
        } else mm--;
        this.setValue(Rui.util.LString.lPad(hh, '0', 2) + Rui.util.LString.lPad(mm, '0', 2));
    },
    /**
     * @description width 속성에 따른 실제 적용 메소드
     * @method _setWidth
     * @protected
     * @param {String} type 속성의 이름
     * @param {Array} args 속성의 값 배열
     * @param {Object} obj 적용된 객체
     * @return {void}
     */
    _setWidth: function(type, args, obj) {
    	if(args[0] < 0) return;
        Rui.ui.form.LTimeBox.superclass._setWidth.call(this, type, args, obj);
        if(this.iconDivEl){
            this.getDisplayEl().setWidth(this.getContentWidth() - (this.iconDivEl.getWidth() || this.iconWidth) - this.iconMarginLeft);
        }
    },
    /**
     * @description disabled 속성에 따른 실제 적용 메소드
     * @method _setDisabled
     * @protected
     * @param {String} type 속성의 이름
     * @param {Array} args 속성의 값 배열
     * @param {Object} obj 적용된 객체
     * @return {void}
     */
    _setDisabled: function(type, args, obj) {
        if(args[0] === false) {
            this.spinnerOn();
        } else {
            this.spinnerOff();
        }
        Rui.ui.form.LTimeBox.superclass._setDisabled.call(this, type, args, obj);
    },
    /**
     * @description 유효성을 검증하는 메소드
     * @method validateValue
     * @protected
     * @param {object} value 값
     * @return {boolean}
     */
    validateValue: function(val) {
        var r = Rui.isEmpty(val) ? true : Rui.util.LString.isTime(val);
        if(r == false){
        	Rui.util.LDom.toast(Rui.getMessageManager().get('$.base.msg040'), this.el.dom);
        	this.rollback();
        }
        return r;
    },
    /**
     * @description 값을 변경한다.
     * @method setValue
     * @private
     * @param {String} o 반영할 값
     * @return {void}
     */
    rollback: function(){
    	this.setDisplayValue(this.lastDisplayValue);
    },
    /**
     * @description 값을 변경한다.
     * @method setValue
     * @public
     * @param {String} o 반영할 값
     * @return {void}
     */
    setValue: function(val, ignoreEvent) {
    	if(val && Rui.platform.isMobile && val.indexOf(':') < 0)
    		val = val.substring(0, 2) + ':' + val.substring(2);
        Rui.ui.form.LTimeBox.superclass.setValue.call(this, val, ignoreEvent);
        var displayValue = this.getDisplayValue();
        if(displayValue && displayValue.length != 5)
            this.setDisplayValue(val.substring(0, 2) + ':' + val.substring(2, 4));
    },
    /**
     * @description renderer를 수행하는 메소드
     * @method beforeRenderer
     * @protected
     * @return {String}
     */
    beforeRenderer: function(val, p, record, row, i) {
    	if(!val) return '';
    	if(val.indexOf(':') > 0) return val;
    	return val.substring(0, 2) + ':' + val.substring(2);
    }
});
