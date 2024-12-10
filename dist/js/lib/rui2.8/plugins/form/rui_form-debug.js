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
Rui.namespace('Rui.ui');

(function(){
/**
 * @description UI Component들이 상속받는 추상 클래스
 * @module ui
 * @namespace Rui.ui
 * @class LUIComponent
 * @sample default
 * @extends Rui.util.LEventProvider
 * @constructor
 * @param {Object} config The intial LUIComponent.
 */
Rui.ui.LUIComponent = function(config){
    config = config || {};
    
    if (Rui.isDebugCR)
        Rui.log('otype : ' + this.otype + '\r\nconfig : ' + Rui.dump(config), 'create', this.otype || 'LUIComponent');
    
    this._events = this._events || {};
    
    this.initConfig = config;
    
    Rui.ui.LUIComponent.superclass.constructor.call(this);

    Rui.applyObject(this, config, true);
    
    /**
     * @description disable 메소드가 호출되면 수행하는 이벤트
     * @event disable
     * @sample default
     */
    this.createEvent('disable');
    
    /**
     * @description enable 메소드가 호출되면 수행하는 이벤트
     * @event enable
     * @sample default
     */
    this.createEvent('enable');
    
    /**
     * @description show 메소드가 호출되면 수행하는 이벤트
     * @event show
     * @sample default
     */
    this.createEvent('show');
    
    /**
     * @description hide 메소드가 호출되면 수행하는 이벤트
     * @event hide
     * @sample default
     */
    this.createEvent('hide');
    
    /**
     * @description focus 메소드가 호출되면 수행하는 이벤트
     * @event focus
     * @sample default
     */
    this.createEvent('focus');
    
    /**
     * @description blur 메소드가 호출되면 수행하는 이벤트
     * @event blur
     * @sample default
     */
    this.createEvent('blur');
    
    /**
     * @description render 메소드가 호출되면 수행하는 이벤트
     * @event render
     * @sample default
     */
    this.renderEvent = this.createEvent('render', { isCE: true } );
    
    /**
     * @description destroy 메소드가 호출되면 수행하는 이벤트
     * @event destroy
     * @sample default
     */
    this.createEvent('destroy');
    
    /**
     * @description resize 메소드가 호출되면 수행하는 이벤트
     * @event resize
     */
    this.createEvent('resize');
    
    /**
     * move 메소드가 호출되면 수행하는 이벤트
     * @event move
     */
    this.createEvent('move');
    
    this.init(config);

    if(this.applyTo){
        this.applyToMarkup(this.applyTo);
        delete this.applyTo;
    }else if(this.renderTo){
        this.render(this.renderTo);
        delete this.renderTo;
    }
 };

Rui.extend(Rui.ui.LUIComponent, Rui.util.LEventProvider, {
    /**
     * @description 객체를 render할 위치를 지정한다. 생성자 옵션이기때문에 생성시에 해당 html dom 객체의 id를 바로 찾아서 생성한다.
     * @config applyTo
     * @sample default
     * @type {String}
     * @default null
     */
    /**
     * @description 객체를 render할 위치를 지정한다. 생성자 옵션이기때문에 생성시에 해당 html dom 객체의 id를 바로 찾아서 생성한다.
     * @property applyTo
     * @private
     * @type {String}
     */
    /**
     * @description 객체를 renderTo html dom 객체 하위에 dom객체를 생성한다. 생성자 옵션이기때문에 생성시에 해당 html dom 객체의 id를 바로 찾아서 생성한다.
     * @config renderTo
     * @sample default
     * @type {String}
     * @default null
     */
    /**
     * @description 객체를 renderTo html dom 객체 하위에 dom객체를 생성한다. 생성자 옵션이기때문에 생성시에 해당 html dom 객체의 id를 바로 찾아서 생성한다.
     * @property renderTo
     * @private
     * @type {String}
     */
    /**
     * @description 넓이 지정시 사용
     * @config width
     * @type {int}
     * @default null
     */
    /**
     * @description 높이 지정시 사용
     * @config height
     * @type {int}
     * @default null
     */
    /**
     * @description 객체의 문자열
     * @property otype
     * @private
     * @type {String}
     */
    otype: 'Rui.ui.LUIComponent',
    /**
     * @description 객체의 disabled 여부를 관리한다. 
     * @config disabled
     * @sample default
     * @type {boolean}
     * @default false
     */
     /**
     * @description 객체의 disabled 여부를 관리한다. 
     * @property disabled
     * @private
     * @type {boolean}
     */
    disabled: false,
    /**
     * @description 컴포넌트의 기본 class를 탑재한다.
     * @config defaultClass
     * @type {String}
     * @default null
     */
     /**
     * @description 컴포넌트의 기본 class를 탑재한다.
     * @property defaultClass
     * @private
     * @type {String}
     */
    defaultClass: null,
    /**
     * @description blur시 contains 체크를 할지 여부
     * @property checkContainBlur
     * @private
     * @type {boolean}
     */
    checkContainBlur: true,
    /**
     * @description 객체를 초기화하는 메소드
     * @method init
     * @private
     * @param {Object} config 환경정보 객체 
     * @return {void}
     */
    init: function(config) {
        this.initDefaultConfig();
        if (config) {
            this.cfg.applyConfig(config, true);
        }
        
        this.initComponent(config);
        this.initEvents();
        
        if (!Rui.ui.LConfig.alreadySubscribed(this.renderEvent, this.cfg.fireQueue, this.cfg)) {
            this.renderEvent.on(this.cfg.fireQueue, this.cfg, true);
        }
    },
    /**
     * @description 객체를 Config정보를 초기화하는 메소드
     * @method initDefaultConfig
     * @protected 
     * @return {void}
     */
    initDefaultConfig: function() {
        this.cfg = new Rui.ui.LConfig(this);
        
        this.cfg.addProperty('width', {
                handler: this._setWidth, 
                value: this.width, 
                validator: Rui.isNumber
        });

        this.cfg.addProperty('height', {
                handler: this._setHeight, 
                value: this.height, 
                validator: Rui.isNumber
        });

        this.cfg.addProperty('left', {
                handler: this._setLeft, 
                validator: Rui.isNumber
        });

        this.cfg.addProperty('top', {
                handler: this._setTop, 
                validator: Rui.isNumber
        });

        this.cfg.addProperty('disabled', {
                handler: this._setDisabled, 
                value: false, 
                validator: Rui.isBoolean
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
    },
    /**
     * @description 객체의 이벤트 초기화 메소드
     * @method initEvents
     * @protected
     * @return {void}
     */
    initEvents: function() {
    },
    /**
     * @description 컴포넌트를 지정된 노드에 랜더링한다. 이 경우 지정된 노드가 el이 된다.
     * @method applyToMarkup
     * @private
     * @param {String} el 부모노드
     * @return {void} 
     */
    applyToMarkup: function(el) {
        this.el = Rui.get(el);
        if(!this.el) throw new Error(' Can\'t find the dom object while calling applyToMarkup method. : ' + el);
        if(!this.id)
            this.id = this.el.id;
        this.render(this.el.dom.parentNode);
    },
    /**
     * @description 컴포넌트를 지정된 노드에 랜더링한다. 이 경우 지정된 노드가 el이 된다.
     * @method renderAt
     * @param {String|HTMLElement} el 적용할 dom 객체나 아이디
     * @return {void} 
     */
    renderAt: function(el) {
        this.applyToMarkup(el);
    },
    /**
     * @description 컴포넌트를 랜더링한다. 이때 부모 노드를 지정할 수 있으며 지정할 경우 지정된 노드의 자식노드로 랜더링된다.
     * 부모 노드를 지정하지 않거나 찾을 수 없는 경우 오류가 발생한다. 
     * @method render
     * @sample default
     * @public 
     * @param {String|HTMLElement} 부모노드
     * @return {void}
     */
    render: function(parentNode) {
    	if(!this.el && !parentNode) parentNode = document.body;
        if (parentNode) {
            this.createContainer(parentNode);
            this.appendTo(parentNode);
            this.doRender(parentNode);
        } else {
            if (! Rui.util.LDom.inDocument(this.el.dom)) {
                return false;
            }
        }
        
        this.dom = this.el.dom;
        
        if(this.defaultClass)
            this.el.addClass(this.defaultClass);

        this._rendered = true;
        this.renderEvent.fire();
        
        if(this.plugins) {
            for (var i = 0, len = this.plugins.length; i < len; i++) {
                this.plugins[i].initPlugin(this);
            }
        }
        
        this.afterRender(parentNode);
    },
    /**
     * @description element Dom객체 생성
     * @method createContainer
     * @protected
     * @return {LElement}
     */
    createContainer: function(appendToNode) {
        if(!this.el) {
            var tmpEl = this.createElement().cloneNode(false);
            tmpEl.id = Rui.useFixedId() ? Rui.id(this.el, 'LUIComp-' + (this.id || this.name || appendToNode.id)) : Rui.id();
            this.el = Rui.get(tmpEl);
            this.id = this.id || this.el.id;
        }
        return this.el;
    },
    /**
     * @description element Dom객체 생성
     * @method createElement
     * @protected
     * @return {HTMLElement}
     */
    createElement: function() {
        return document.createElement('div');
    },
    /**
     * @description parentNode 중 하나에 HTMLElement를 append한다.
     * @method appendTo
     * @param {HTMLElement | Element} parentNode The node to append to
     * @return {void} 
     */
    appendTo: function(parentNode) {
        if (typeof parentNode == 'string') {
            parentNode = document.getElementById(parentNode);
        }
        if (parentNode && this.el && this.el.dom) {
            parentNode = parentNode.dom || parentNode;
            if(parentNode != this.el.dom.parentNode)
                this._addToParent(parentNode, this.el.dom);
        }
    },
    /**
     * @description IE에서 동작이 멈추는 에러를 유발하는 모듈을 위해 DOM 구조를 만들 때 사용되는 protected helper.
     * 일반적인 DOM 구조로 사용되면 안된다.
     * <p>
     * parentNode가 document.body가 아니면 엘리먼트는 마지막 엘리먼트에 append 된다.
     * </p>++
     * <p>
     * parentNode가 document.body이면 IE의 동작이 멈추는 에러를 방지하기 위해 
     * 엘리먼트는 첫번째 child로 추가된다.
     * </p>
     *
     * @method _addToParent
     * @protected
     * @param {parentNode} The HTML element to which the element will be added
     * @param {elNode} The HTML element to be added to parentNode's children
     */
    _addToParent: function(parentNode, elNode) {
        if (parentNode === document.body && parentNode.firstChild) {
            parentNode.insertBefore(elNode, parentNode.firstChild);
        } else {
            parentNode.appendChild(elNode);
        }
    },
    /**
     * @description render시 호출되는 메소드
     * @method doRender
     * @protected 
     * @param {String|Object} parentNode 부모노드
     * @return {void}
     */
    doRender: function(parentNode){
    },
    /**
     * @description 플러그인 객체를 초기화하는 메소드
     * @method initPlugin
     * @private
     * @return {void}
     */
    initPlugin: function() {
        if(this.plugins) {
            for (var i = 0, len = this.plugins.length; i < len; i++) {
                this.plugins[i].initPlugin(this);
            }
        }
    },
    /**
     * @description render후 호출되는 메소드
     * @method afterRender
     * @protected
     * @param {HTMLElement} container 부모 객체
     * @return {void}
     */
    afterRender: function(container) {
        if(this.el) {
            if(this.checkContainBlur) {
            	this.el.on('focus', this.onCheckFocus, this, true, {system: true});
            	this.el.on('blur', this.deferOnBlur, this, true, {system: true});
            } else {
            	this.el.on('focus', this.onFocus, this, true, {system: true});
            	this.el.on('blur', this.onBlur, this, true, {system: true});
            }
        }
    },
    /**
     * @description focus 여부를 확인하는 메소드
     * @method onCheckFocus
     * @protected
     * @param {Object} e Event 객체
     * @return {void}
     */
    onCheckFocus: function(e) {
        if(!this.isFocus) {
            this.onFocus.call(this, e);
            if(this.checkContainBlur == true) {
                Rui.util.LEvent.addListener(Rui.browser.msie ? document.body : document, 'mousedown', this.deferOnBlur, this, true);
                this.isFocus = true;
            }
        }
    },
    /**
     * @description blur 이벤트를 취소후 재 등록하는 메소드 (이벤트 순서 변경)
     * @method reOnDeferOnBlur
     * @protected
     * @return {void}
     */
    reOnDeferOnBlur: function() {
        Rui.util.LEvent.removeListener(Rui.browser.msie ? document.body : document, 'mousedown', this.deferOnBlur);
        Rui.util.LEvent.addListener(Rui.browser.msie ? document.body : document, 'mousedown', this.deferOnBlur, this, true);
    },
    /**
     * @description blur 이벤트 발생시 defer를 연결하는 메소드
     * @method deferOnBlur
     * @protected
     * @param {Object} e Event 객체
     * @return {void}
     */
    deferOnBlur: function(e) {
        Rui.util.LFunction.defer(this.checkBlur, 10, this, [e]);
    },
    checkBlur: function(e) {
        if(e.deferCancelBubble == true || this.isFocus !== true) return;
        var target = e.target;
        if(!this.el.isAncestor(target)) {
            if(this.onCanBlur(e) === false) return;
            Rui.util.LEvent.removeListener(Rui.browser.msie ? document.body : document, 'mousedown', this.deferOnBlur);
            this.onBlur.call(this, e);
            this.isFocus = null;
        } else 
            e.deferCancelBubble = true;
    },
    /**
     * @description blur 이벤트 발생시 호출되는 메소드
     * @method onCanBlur
     * @private
     * @param {Object} e Event 객체
     * @return {void}
     */
    onCanBlur: function(e) {
    },
    /**
     * @description focus 이벤트 발생시 호출되는 메소드
     * @method onFocus
     * @protected
     * @param {Object} e Event 객체
     * @return {void}
     */
    onFocus: function(e) {
        if(this.isFocus !== true) {
            this.isFocus = true;
        	this.fireEvent('focus', e);
        }
    },
    /**
     * @description blur 이벤트 발생시 호출되는 메소드
     * @method onBlur
     * @protected
     * @param {Object} e Event 객체
     * @return {void}
     */
    onBlur: function(e) {
        this.isFocus = null;
        this.fireEvent('blur', e);
    },
    /**
     * @description visMode가 true면 visibility에 설정 false거나 없으면 display에 설정한다.
     * @method setVisibilityMode
     * @sample default
     * @param {boolean} visMode visibility로 설정할지 display로 설정할지 결정하는 값
     * @return {void} 
     */
    setVisibilityMode: function(visMode) {
        this.el.setVisibilityMode(visMode);
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
        if(args[0] === false) {
            this.disabled = false;
            if(this.el) this.el.removeClass('L-disabled');
            this.fireEvent('enable');
        } else {
            this.disabled = true;
            if(this.el) this.el.addClass('L-disabled');
            this.fireEvent('disable');
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
        var width = args[0];
        if(width < 0) return;
        if(this.el)
            this.el.setWidth(width);
        this.width = width;
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
        var height = args[0];
        if(height < 0) return;
        if(this.el)
            this.el.setHeight(height);
        this.height = height;
    },
    /**
     * @description left 속성에 따른 실제 적용 메소드
     * @method _setLeft
     * @protected
     * @param {String} type 속성의 이름
     * @param {Array} args 속성의 값 배열
     * @param {Object} obj 적용된 객체
     * @return {void}
     */
    _setLeft: function(type, args, obj) {
        var left = args[0];
        this.el.setLeft(left);
    },
    /**
     * @description top 속성에 따른 실제 적용 메소드
     * @method _setTop
     * @protected
     * @param {String} type 속성의 이름
     * @param {Array} args 속성의 값 배열
     * @param {Object} obj 적용된 객체
     * @return {void}
     */
    _setTop: function(type, args, obj) {
        var top = args[0];
        this.el.setTop(top);
    },
    /**
     * @description 객체를 사용 가능하게 하는 메소드
     * @method enable
     * @public
     * @sample default
     * @return {void}
     */
    enable: function() {
        this.cfg.setProperty('disabled', false);
    },
    /**
     * @description 객체를 사용 불가능하게 하는 메소드
     * @method disable
     * @public
     * @sample default
     * @return {void}
     */
    disable: function() {
        this.cfg.setProperty('disabled', true);
    },
    /**
     * @description disable 상태 여부를 리턴하는 메소드
     * @method isDisable
     * @public
     * @return {boolean}
     */
    isDisable: function() {
    	return this.cfg.getProperty('disabled');
    },
    /**
     * @description editor의 show 여부를 리턴하는 메소드
     * @method isShow
     * @return {boolean}
     */
    isShow: function() {
        return this.el.isShow();
    },
    /**
     * @description 객체를 보이게 설정하는 메소드
     * @method show
     * @public
     * @sample default
     * @param {Boolean|Rui.fx.LAnim} anim (optional) Animation 여부를 설정한다. Boolean값이면 디폴트 animation을 실행하고 객체면 해당 객체에 설정된 animation을 수행한다.
     * @return {void} 
     */
    show: function(anim) {
        this.el.show(anim);
        this.fireEvent('show');
    },
    /**
     * @description 객체를 안보이게 설정하는 메소드
     * @method hide
     * @public
     * @sample default
     * @param {Boolean|Rui.fx.LAnim} anim (optional) Animation 여부를 설정한다. Boolean값이면 디폴트 animation을 실행하고 객체면 해당 객체에 설정된 animation을 수행한다.
     * @return {void}
     */
    hide: function(anim) {
        this.el.hide(anim);
        this.fireEvent('hide');
    },
    /**
     * @description 객체를 focus한다.
     * @method focus
     * @public
     * @return {void}
     */
    focus: function() {
        this.el.focus();
    },
    /**
     * @description 객체를 blur한다.
     * @method blur
     * @public
     * @return {void}
     */
    blur: function() {
        this.el.blur();
    },
    /**
     * @description 엘리먼트의 오프셋 높이를 리턴한다.
     * @method getHeight
     * @public
     * @param {boolean} contentHeight (optional) : border와 padding을 뺀 높이를 가져오게 하려면 true
     * @return {Number} The element's height
     */
    getHeight: function(contentHeight){
        return this.el ? this.el.getHeight(contentHeight) : this.height;
    },
    /**
     * 엘리먼트의 높이를 설정한다.
     * <pre><code>
// 높이를 200px로 바꾸고 default configuration으로 동작한다.
Rui.get('elementId').setHeight(200, true);

// 높이를 150px로 바꾸고 custom configuration으로 동작한다.
Rui.get('elId').setHeight(150, {
duration : .5, // 동작이 .5초 동안 지속된다
// 내용을 'finished'로 변환한다
callback: function(){ this.{@link #update}('finished'); } 
});
     * </code></pre>
     * @method setHeight
     * @param {Mixed} height 새로운 높이. 다음 중 하나:<div class="mdetail-params"><ul>
     * <li>Number : 엘리먼트의 {@link #defaultUnit}s (by default, pixels.)에서 새로운 높이를 나타냄 </li>
     * <li>String : 높이와 관련된 CSS 스타일을 설정하는데 사용된다. 애니메이션은 사용되지 <b>않을 수</b> 있다.</li>
     * </ul></div>
     * @return {void}
     */
    setHeight: function(height){
        this.cfg.setProperty('height', height);
    },
    /**
     * @description 엘리먼트의 오프셋 넓이를 리턴한다.
     * @method getWidth
     * @public
     * @param {boolean} contentWidth (optional) : border와 padding을 뺀 높이를 가져오게 하려면 true
     * @return {Number} The element's width
     */
    getWidth: function(contentWidth){
        return this.el ? this.el.getWidth(contentWidth) : this.width;
    },
    /**
     * @description 엘리먼트의 넓이를 설정한다.
     * @method setWidth
     * @public
     * @param {Mixed} width 새로운 넓이. 다음 중 하나:<div class="mdetail-params"><ul>
     * <li>Number : 엘리먼트의 {@link #defaultUnit}s (by default, pixels)에서 새로운 넓이를 나타냄 </li>
     * <li>String : 넓이와 관련된 CSS 스타일을 설정하는 데 사용된다. 애니메이션은 사용되지 <b>않을 수</b>있다.</li>
     * </ul></div>
     * @return {void}
     */
    setWidth: function(width){
        this.cfg.setProperty('width', width);
    },
    /**
     * @description 엘리먼트의 오프셋 Left를 리턴한다.
     * @method getLeft
     * @public
     * @return {Number} The element's left
     */
    getLeft: function(){
        return this.el.getLeft();
    },
    /**
     * @description 엘리먼트의 Left를 설정한다.
     * @method setLeft
     * @public
     * @param {int} left 새로운 Left
     * @return {void}
     */
    setLeft: function(left){
        this.cfg.setProperty('left', left);
    },
    /**
     * @description 엘리먼트의 오프셋 top를 리턴한다.
     * @method getTop
     * @public
     * @return {Number} The element's top
     */
    getTop: function(){
        return this.el.getTop();
    },
    /**
     * @description 엘리먼트의 top를 설정한다.
     * @method setTop
     * @public
     * @param {int} top 새로운 top
     * @return {void}
     */
    setTop: function(top){
        this.cfg.setProperty('top', top);
    },
    /**
     * @description 엘리먼트의 parent node를 가져온다. 선택사항으로 parent node와 일치하는 selector를 줄 수 있음.
     * @method parent
     * @param {String} selector (optional) Find a parent node that matches the passed simple selector
     * @param {boolean} returnDom (optional) True to return a raw dom node instead of an Rui.LElement
     * @return {Rui.LElement|HTMLElement} The parent node or null
     */
    parent: function(selector, returnDom){
        return this.el.parent(selector, returnDom);
    },
    /**
     * @description CSS Selector로 child 객체를 배열로 리턴한다.
     * @method select
     * @param {String} selector CSS selector 문자열
     * @param {boolean} firstOnly [optional] 찾은 객체의 무조건 첫번째 객체를 리턴한다.
     * @return {Rui.LElementList} Rui.LElementList 객체 리턴 
     */
    select: function(selector, firstOnly){
        return this.el.select(selector, firstOnly);
    },
    /**
     * @description CSS Selector로 child 객체를 배열로 리턴한다.
     * @method query
     * @param {String} selector CSS selector 문자열
     * @param {boolean} firstOnly [optional] 찾은 객체의 무조건 첫번째 객체를 리턴한다.
     * @return {Array} Array 객체 리턴 
     */
    query: function(selector, firstOnly){
        return this.el.query(selector, firstOnly);
    },
    /**
     * @description CSS Selector로 현재 node중 selector로 지정된 child node만 배열로 리턴한다.
     * @method filter
     * @param {String} selector CSS selector 문자열
     * @return {Array} Array 객체 리턴 
     */
    filter: function(selector){
        return this.el.query(selector);
    },
    /**
     * @description 컨테이너 객체를 리턴하는 메소드
     * @method getContainer
     * @sample default
     * @return {Rui.LElement} 
     */
    getContainer: function(){
        return this.el;
    },
    /**
     * @description View를 모두 다시 그린다.
     * @method updateView
     * @private
     * @return {void}
     */
    updateView: function() {
        this.enableMaskEl = null;
    },
    /**
     * @description 부모의 dom 객체를 기준으로 height 100%으로 채운다.
     * @method availableHeight
     * @param {String|HTMLElement} parentId [optional] 기준이 되는 부모 객체의 id나 dom
     * @param {int} margin [optional] 추가 여유 공간을 확보하기 위해 마이너스할 높이
     * @return {void}
     */
    availableHeight: function(parentId, margin) {
        this.el.availableHeight(parentId, margin);
    },
    /**
     * @description 콤포넌트가 render가 됐는지 여부
     * @method isRender
     * @return {boolean}
     */
    isRender: function() {
        return this._rendered;
    },
    /**
     * @description 콤포넌트가 render가 됐는지 여부
     * @method isRendered
     * @public
     * @return {boolean}
     */
    isRendered: function() {
        return this._rendered;
    },
    /**
     * @description 객체를 destroy하는 메소드
     * @method destroy
     * @public
     * @sample default
     * @return {void}
     */
    destroy: function() {
        this.fireEvent('destroy');
        if(this.plugins) {
            for (var i = 0, len = this.plugins.length; i < len; i++) {
                this.plugins[i].destroy(this);
            }
        }
        if(this.renderEvent) {
            this.renderEvent.unOnAll();
            this.renderEvent = null;
        }
        this.unOnAll();
        if(this.el) {
            this.el.unOnAll();
            this.el.remove();
            this.el = null;
        }
        if(this.deferOnBlur)
        	Rui.util.LEvent.removeListener(Rui.browser.msie ? document.body : document, 'mousedown', this.deferOnBlur);
        if(this.cfg) {
            this.cfg.destroy();
            this.cfg = null;
        }
    },
    /**
     * @description 객체의 toString
     * @method toString
     * @public
     * @return {String}
     */
    toString: function() {
        return this.otype + ' ' + (this.id || 'Unknown');
    }
});
})();

(function () {
    /**
     * Config is a utility used within an Object to allow the implementer to
     * maintain a list of local configuration properties and listen for changes 
     * to those properties dynamically using LCustomEvent. The initial values are 
     * also maintained so that the configuration can be reset at any given point 
     * to its initial state.
     * @namespace Rui.ui
     * @class LConfig
     * @protected
     * @constructor
     * @param {Object} owner The owner Object to which this Config Object belongs
     */
    Rui.ui.LConfig = function (owner) {
        if (owner) {
            this.init(owner);
        }
    };

    var LCustomEvent = Rui.util.LCustomEvent,
        Config = Rui.ui.LConfig;
    
    Config.prototype = {
        /**
         * Object reference to the owner of this Config Object
         * @property owner
         * @private
         * @type Object
         */
        owner: null,
        /**
         * Boolean flag that specifies whether a queue is currently 
         * being executed
         * @property queueInProgress
         * @protected
         * @type Boolean
         */
        queueInProgress: false,
        /**
         * Maintains the local collection of configuration property objects and 
         * their specified values
         * @property config
         * @private
         * @type Object
         */
        config: null,
        /**
         * Maintains the local collection of configuration property objects as 
         * they were initially applied.
         * This object is used when resetting a property.
         * @property initialConfig
         * @private
         * @type Object
         */ 
        initialConfig: null,
        /**
         * Maintains the local, normalized LCustomEvent queue
         * @property eventQueue
         * @private
         * @type Object
         */
        eventQueue: null,
        /**
         * Custom Event, notifying subscribers when Config properties are set 
         * (setProperty is called without the silent flag
         * @event configChanged
         */
        configChangedEvent: null,
        /**
         * Initializes the configuration Object and all of its local members.
         * @method init
         * @private
         * @param {Object} owner The owner Object to which this Config 
         * Object belongs
         */
        init: function (owner) {
            this.owner = owner;
            this.configChangedEvent = this.createEvent('configChanged', { isCE: true });
            this.configChangedEvent.signature = LCustomEvent.LIST;
            this.queueInProgress = false;
            this.config = {};
            this.initialConfig = {};
            this.eventQueue = [];
        },
        /**
         * Validates that the value passed in is a Boolean.
         * @method checkBoolean
         * @private
         * @param {Object} val The value to validate
         * @return {boolean} true, if the value is valid
         */
        checkBoolean: function (val) {
            return (typeof val == 'boolean');
        },
        /**
         * Validates that the value passed in is a number.
         * @method checkNumber
         * @private
         * @param {Object} val The value to validate
         * @return {boolean} true, if the value is valid
         */
        checkNumber: function (val) {
            return (!isNaN(val));
        },
        /**
         * Fires a configuration property event using the specified value. 
         * @method fireEvent
         * @private
         * @param {String} key The configuration property's name
         * @param {value} value The value of the correct type for the property
         */ 
        fireEvent: function ( key, value ) {
            var property = this.config[key];
            if (property && property.event) {
                property.event.fire(value);
            } 
        },
        /**
         * Adds a property to the Config Object's private config hash.
         * @method addProperty
         * @param {String} key The configuration property's name
         * @param {Object} propertyObject The Object containing all of this 
         * property's arguments
         */
        addProperty: function ( key, propertyObject ) {
            key = key.toLowerCase();
            this.config[key] = propertyObject;
            propertyObject.event = this.createEvent(key, { scope: this.owner, isCE: true });
            propertyObject.event.signature = LCustomEvent.LIST;
            propertyObject.key = key;
            if (propertyObject.handler) {
                propertyObject.event.on(propertyObject.handler, 
                    this.owner);
            }
            this.setProperty(key, propertyObject.value, true);
            if (! propertyObject.suppressEvent) {
                this.queueProperty(key, propertyObject.value);
            }
        },
        /**
         * Returns a key-value configuration map of the values currently set in  
         * the Config Object.
         * @method getConfig
         * @return {Object} The current config, represented in a key-value map
         */
        getConfig: function () {
            var cfg = {},
                currCfg = this.config,
                prop,
                property;
            for (prop in currCfg) {
                if (Rui.hasOwnProperty(currCfg, prop)) {
                    property = currCfg[prop];
                    if (property && property.event) {
                        cfg[prop] = property.value;
                    }
                }
            }
            return cfg;
        },
        /**
         * Returns the value of specified property.
         * @method getProperty
         * @param {String} key The name of the property
         * @return {Object}  The value of the specified property
         */
        getProperty: function (key) {
            var property = this.config[key.toLowerCase()];
            if (property && property.event) {
                return property.value;
            } else {
                return undefined;
            }
        },
        /**
         * Resets the specified property's value to its initial value.
         * @method resetProperty
         * @param {String} key The name of the property
         * @return {boolean} True is the property was reset, false if not
         */
        resetProperty: function (key) {
            key = key.toLowerCase();
            var property = this.config[key];
            if (property && property.event) {
                if (this.initialConfig[key] && 
                    !Rui.isUndefined(this.initialConfig[key])) {
                    this.setProperty(key, this.initialConfig[key]);
                    return true;
                }
            } else {
                return false;
            }
        },
        /**
         * Sets the value of a property. If the silent property is passed as 
         * true, the property's event will not be fired.
         * @method setProperty
         * @param {String} key The name of the property
         * @param {String} value The value to set the property to
         * @param {boolean} silent [optional] Whether the value should be set silently, 
         * without firing the property event.
         * @return {boolean} True, if the set was successful, false if it failed.
         */
        setProperty: function (key, value, silent) {
        
            var property;
        
            key = key.toLowerCase();
        
            if (this.queueInProgress && ! silent) {
                // Currently running through a queue... 
                this.queueProperty(key,value);
                return true;
    
            } else {
                property = this.config[key];
                if (property && property.event) {
                    if (property.validator && !property.validator(value)) {
                        return false;
                    } else {
                        property.oldValue = property.value;
                        property.value = value;
                        if (! silent) {
                            this.fireEvent(key, value);
                            this.configChangedEvent.fire([key, value]);
                        }
                        return true;
                    }
                } else {
                    return false;
                }
            }
        },
        /**
         * Sets the value of a property and queues its event to execute. If the 
         * event is already scheduled to execute, it is
         * moved from its current position to the end of the queue.
         * @method queueProperty
         * @private
         * @param {String} key The name of the property
         * @param {String} value The value to set the property to
         * @return {boolean}  true, if the set was successful, false if 
         * it failed.
         */
        queueProperty: function (key, value) {
            key = key.toLowerCase();
            var property = this.config[key],
                foundDuplicate = false,
                iLen,
                queueItem,
                queueItemKey,
                queueItemValue,
                sLen,
                supercedesCheck,
                qLen,
                queueItemCheck,
                queueItemCheckKey,
                queueItemCheckValue,
                i,
                s,
                q;              
            if (property && property.event) {
                if (!Rui.isUndefined(value) && property.validator && 
                    !property.validator(value)) { // validator
                    return false;
                } else {
                    if (!Rui.isUndefined(value)) {
                        property.value = value;
                    } else {
                        value = property.value;
                    }
                    foundDuplicate = false;
                    iLen = this.eventQueue.length;
                    for (i = 0; i < iLen; i++) {
                        queueItem = this.eventQueue[i];
                        if (queueItem) {
                            queueItemKey = queueItem[0];
                            queueItemValue = queueItem[1];
                            if (queueItemKey == key) {
                                /*
                                    found a dupe... push to end of queue, null  current item, and break
                                */
                                this.eventQueue[i] = null;
    
                                this.eventQueue.push(
                                    [key, (!Rui.isUndefined(value) ? 
                                    value: queueItemValue)]);
    
                                foundDuplicate = true;
                                break;
                            }
                        }
                    }
                    
                    // this is a refire, or a new property in the queue
                    if (! foundDuplicate && !Rui.isUndefined(value)) { 
                        this.eventQueue.push([key, value]);
                    }
                }
        
                if (property.supercedes) {

                    sLen = property.supercedes.length;

                    for (s = 0; s < sLen; s++) {
                        supercedesCheck = property.supercedes[s];
                        qLen = this.eventQueue.length;

                        for (q = 0; q < qLen; q++) {
                            queueItemCheck = this.eventQueue[q];

                            if (queueItemCheck) {
                                queueItemCheckKey = queueItemCheck[0];
                                queueItemCheckValue = queueItemCheck[1];

                                if (queueItemCheckKey == supercedesCheck.toLowerCase() ) {
                                    this.eventQueue.push([queueItemCheckKey, queueItemCheckValue]);
                                    this.eventQueue[q] = null;
                                    break;
                                }
                            }
                        }
                    }
                }
                return true;
            } else {
                return false;
            }
        },
        /**
         * Fires the event for a property using the property's current value.
         * @method refireEvent
         * @private
         * @param {String} key The name of the property
         */
        refireEvent: function (key) {
            key = key.toLowerCase();
            var property = this.config[key];
            if (property && property.event && 
                !Rui.isUndefined(property.value)) {
                if (this.queueInProgress) {
                    this.queueProperty(key);
                } else {
                    this.fireEvent(key, property.value);
                }
            }
        },
        /**
         * Applies a key-value Object literal to the configuration, replacing  
         * any existing values, and queueing the property events.
         * Although the values will be set, fireQueue() must be called for their 
         * associated events to execute.
         * @method applyConfig
         * @protected
         * @param {Object} userConfig The configuration Object literal
         * @param {boolean} init  When set to true, the initialConfig will 
         * be set to the userConfig passed in, so that calling a reset will 
         * reset the properties to the passed values.
         */
        applyConfig: function (userConfig, init) {
            var sKey,
                oConfig;

            if (init) {
                oConfig = {};
                for (sKey in userConfig) {
                    if (Rui.hasOwnProperty(userConfig, sKey)) {
                        oConfig[sKey.toLowerCase()] = userConfig[sKey];
                    }
                }
                this.initialConfig = oConfig;
            }

            for (sKey in userConfig) {
                if (Rui.hasOwnProperty(userConfig, sKey)) {
                    this.queueProperty(sKey, userConfig[sKey]);
                }
            }
        },
        /**
         * Fires the normalized list of queued property change events
         * @method fireQueue
         * @private
         */
        fireQueue: function () {
        
            var i, 
                queueItem,
                key,
                value,
                property;
        
            this.queueInProgress = true;
            for (i = 0;i < this.eventQueue.length; i++) {
                queueItem = this.eventQueue[i];
                if (queueItem) {
        
                    key = queueItem[0];
                    value = queueItem[1];
                    property = this.config[key];

                    property.value = value;

                    // Clear out queue entry, to avoid it being 
                    // re-added to the queue by any queueProperty/supercedes
                    // calls which are invoked during fireEvent
                    this.eventQueue[i] = null;

                    this.fireEvent(key,value);
                }
            }
            
            this.queueInProgress = false;
            this.eventQueue = [];
        },
        /**
         * Subscribes an external handler to the change event for any 
         * given property. 
         * @method subscribeToConfigEvent
         * @private
         * @param {String} key The property name
         * @param {Function} handler The handler function to use on to 
         * the property's event
         * @param {Object} obj The Object to use for scoping the event handler 
         * (see LCustomEvent documentation)
         * @param {boolean} override Optional. If true, will override 'this'  
         * within the handler to map to the scope Object passed into the method.
         * @return {boolean} True, if the subscription was successful, 
         * otherwise false.
         */ 
        subscribeToConfigEvent: function (key, handler, obj, override) {
            var property = this.config[key.toLowerCase()];
            if (property && property.event) {
                if (!Config.alreadySubscribed(property.event, handler, obj)) {
                    property.event.on(handler, obj, override);
                }
                return true;
            } else {
                return false;
            }
        },
        /**
         * Unsubscribes an external handler from the change event for any 
         * given property. 
         * @method unsubscribeFromConfigEvent
         * @private
         * @param {String} key The property name
         * @param {Function} handler The handler function to use on to 
         * the property's event
         * @param {Object} obj The Object to use for scoping the event 
         * handler (see LCustomEvent documentation)
         * @return {boolean} True, if the unsubscription was successful, 
         * otherwise false.
         */
        unsubscribeFromConfigEvent: function (key, handler, obj) {
            var property = this.config[key.toLowerCase()];
            if (property && property.event) {
                return property.event.unOn(handler, obj);
            } else {
                return false;
            }
        },
        /**
         * Returns a string representation of the Config object
         * @method toString
         * @return {String} The Config object in string format.
         */
        toString: function () {
            var output = 'Config';
            if (this.owner) {
                output += ' [' + this.owner.toString() + ']';
            }
            return output;
        },
        /**
         * Sets all properties to null, unsubscribes all listeners from each 
         * property's change event and all listeners from the configChangedEvent.
         * @method destroy
         */
        destroy: function () {
            var oConfig = this.config,
                sProperty,
                oProperty;
            for (sProperty in oConfig) {
                if (Rui.hasOwnProperty(oConfig, sProperty)) {
                    oProperty = oConfig[sProperty];
                    oProperty.event.unOnAll();
                    oProperty.event = null;
                }
            }
            this.configChangedEvent.unOnAll();
            this.configChangedEvent = null;
            this.owner = null;
            this.config = null;
            this.initialConfig = null;
            this.eventQueue = null;
        }
    };
    /**
     * Checks to determine if a particular function/Object pair are already 
     * subscribed to the specified LCustomEvent
     * @method alreadySubscribed
     * @private
     * @static
     * @param {Rui.util.LCustomEvent} evt The LCustomEvent for which to check 
     * the subscriptions
     * @param {Function} fn The function to look for in the subscribers list
     * @param {Object} obj The execution scope Object for the subscription
     * @return {boolean} true, if the function/Object pair is already subscribed 
     * to the LCustomEvent passed in
     */
    Config.alreadySubscribed = function (evt, fn, obj) {
    
        var nSubscribers = evt.subscribers.length,
            subsc,
            i;

        if (nSubscribers > 0) {
            i = nSubscribers - 1;
            do {
                subsc = evt.subscribers[i];
                if (subsc && subsc.obj == obj && subsc.fn == fn) {
                    return true;
                }
            }
            while (i--);
        }

        return false;

    };

    Rui.applyPrototype(Config, Rui.util.LEventProvider);

}());
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
Rui.namespace('Rui.ui.calendar');

/**
 * The LCalendar component 
 * @module    ui_calendar
 * @title    LCalendar
 * @namespace  Rui.ui.calendar
 * @requires  Rui,dom,event
 */ 
(function() {

    var Dom = Rui.util.LDom,
        Event = Rui.util.LEvent,
        Lang = Rui;
    /**
     * 달력
     * @namespace Rui.ui.calendar
     * @class LCalendar
     * @constructor
     * @param {String} id [optional] 달력 아이디
     * @param {String | HTMLElement} container 달력 컨테이너 dom 객체 아이디
     * @param {Object} config [optional] config 객체
     * @sample default
     */
    function LCalendar(id, containerId, config) {
        if(arguments.length == 1 && (typeof id == 'object')) {
            config = id;
            id = containerId = (id.applyTo || id.renderTo) || id.id || Rui.id();
        }

        this.init.call(this, id, containerId, config);
        config = config || {};
        
        if(config) {
            if(config.applyTo){
                this.render();
            }else if(config.renderTo){
                this.render();
            }
        }
    }

    /**
    * The path to be used for images loaded for the LCalendar
    * @property IMG_ROOT
    * @static
    * @deprecated   You can now customize images by overriding the calclose, calnavleft and calnavright default CSS classes for the close icon, left arrow and right arrow respectively
    * @type String
    */
    LCalendar.IMG_ROOT = null;

    /**
    * Type constant used for renderers to represent an individual date (M/D/Y)
    * @property DATE
    * @static
    * @final
    * @type String
    */
    LCalendar.DATE = 'D';

    /**
    * Type constant used for renderers to represent an individual date across any year (M/D)
    * @property MONTH_DAY
    * @static
    * @final
    * @type String
    */
    LCalendar.MONTH_DAY = 'MD';

    /**
    * Type constant used for renderers to represent a weekday
    * @property WEEKDAY
    * @static
    * @final
    * @type String
    */
    LCalendar.WEEKDAY = 'WD';

    /**
    * Type constant used for renderers to represent a range of individual dates (M/D/Y-M/D/Y)
    * @property RANGE
    * @static
    * @final
    * @type String
    */
    LCalendar.RANGE = 'R';

    /**
    * Type constant used for renderers to represent a month across any year
    * @property MONTH
    * @static
    * @final
    * @type String
    */
    LCalendar.MONTH = 'M';

    /**
    * Constant that represents the total number of date cells that are displayed in a given month
    * @property DISPLAY_DAYS
    * @static
    * @final
    * @type Number
    */
    LCalendar.DISPLAY_DAYS = 42;

    /**
    * Constant used for halting the execution of the remainder of the render stack
    * @property STOP_RENDER
    * @static
    * @final
    * @type String
    */
    LCalendar.STOP_RENDER = 'S';

    /**
    * Constant used to represent short date field string formats (e.g. Tu or Feb)
    * @property SHORT
    * @static
    * @final
    * @type String
    */
    LCalendar.SHORT = 'short';

    /**
    * Constant used to represent long date field string formats (e.g. Monday or February)
    * @property LONG
    * @static
    * @final
    * @type String
    */
    LCalendar.LONG = 'long';

    /**
    * Constant used to represent medium date field string formats (e.g. Mon)
    * @property MEDIUM
    * @static
    * @final
    * @type String
    */
    LCalendar.MEDIUM = 'medium';

    /**
    * Constant used to represent single character date field string formats (e.g. M, T, W)
    * @property ONE_CHAR
    * @static
    * @final
    * @type String
    */
    LCalendar.ONE_CHAR = '1char';

    /**
    * The set of default Config property keys and values for the LCalendar
    * @property _DEFAULT_CONFIG
    * @final
    * @static
    * @private
    * @type Object
    */
    LCalendar._DEFAULT_CONFIG = {
        // Default values for pagedate and selected are not class level constants - they are set during instance creation 
        PAGEDATE: { key: 'pagedate', value: null },
        SELECTED: { key: 'selected', value: null },
        TITLE: { key: 'title', value: null },
        CLOSE: { key: 'close', value: false },
        IFRAME: { key: 'iframe', value: (Rui.browser.msie && Rui.browser.msie <= 6) ? true : false },
        MINDATE: { key: 'mindate', value: null },
        MAXDATE: { key: 'maxdate', value: null },
        MULTI_SELECT: { key: 'multi_select', value: false },
        START_WEEKDAY: { key: 'start_weekday', value: 0 },
        SHOW_WEEKDAYS: { key: 'show_weekdays', value: true },
        SHOW_WEEK_HEADER: { key: 'show_week_header', value: false },
        SHOW_WEEK_FOOTER: { key: 'show_week_footer', value: false },
        HIDE_BLANK_WEEKS: { key: 'hide_blank_weeks', value: false },
        NAV_ARROW_LEFT: { key: 'nav_arrow_left', value: null },
        NAV_ARROW_RIGHT: { key: 'nav_arrow_right', value: null },
        MONTHS_SHORT: { key: 'months_short', value: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] },
        MONTHS_LONG: { key: 'months_long', value: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'] },
        WEEKDAYS_1CHAR: { key: 'weekdays_1char', value: ['S', 'M', 'T', 'W', 'T', 'F', 'S'] },
        WEEKDAYS_SHORT: { key: 'weekdays_short', value: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'] },
        WEEKDAYS_MEDIUM: { key: 'weekdays_medium', value: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'] },
        WEEKDAYS_LONG: { key: 'weekdays_long', value: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'] },
        LOCALE_MONTHS: { key: 'locale_months', value: 'long' },
        LOCALE_WEEKDAYS: { key: 'locale_weekdays', value: 'short' },
        DATE_DELIMITER: { key: 'date_delimiter', value: ',' },
        DATE_FIELD_DELIMITER: { key: 'date_field_delimiter', value: '/' },
        DATE_RANGE_DELIMITER: { key: 'date_range_delimiter', value: '~' },
        MY_MONTH_POSITION: { key: 'my_month_position', value: 1 },
        MY_YEAR_POSITION: { key: 'my_year_position', value: 2 },
        MD_MONTH_POSITION: { key: 'md_month_position', value: 1 },
        MD_DAY_POSITION: { key: 'md_day_position', value: 2 },
        MDY_MONTH_POSITION: { key: 'mdy_month_position', value: 1 },
        MDY_DAY_POSITION: { key: 'mdy_day_position', value: 2 },
        MDY_YEAR_POSITION: { key: 'mdy_year_position', value: 3 },
        MY_LABEL_MONTH_POSITION: { key: 'my_label_month_position', value: 1 },
        MY_LABEL_YEAR_POSITION: { key: 'my_label_year_position', value: 2 },
        MY_LABEL_MONTH_SUFFIX: { key: 'my_label_month_suffix', value: ' ' },
        MY_LABEL_YEAR_SUFFIX: { key: 'my_label_year_suffix', value: '' },
        NAV: { key: 'navigator', value: null },
        STRINGS: {
            key: 'strings',
            value: {
                previousMonth: 'Previous Month',
                nextMonth: 'Next Month',
                previousYear: 'Previous Year',
                nextYear: 'Next Year',
                close: 'Close'
            },
            supercedes: ['close', 'title']
        }
    };

    var DEF_CFG = LCalendar._DEFAULT_CONFIG;

    /**
    * The set of Custom Event types supported by the LCalendar
    * @property _EVENT_TYPES
    * @final
    * @static
    * @private
    * @type Object
    */
    LCalendar._EVENT_TYPES = {
        BEFORE_SELECT: 'beforeSelect',
        SELECT: 'select',
        BEFORE_DESELECT: 'beforeDeselect',
        DESELECT: 'deselect',
        BEFORE_CHANGE_PAGE: 'beforeChangePage',
        CHANGE_PAGE: 'changePage',
        BEFORE_RENDER: 'beforeRender',
        RENDER: 'render',
        RENDER_CELL: 'renderCell',
        BEFORE_DESTROY: 'beforeDestroy',
        DESTROY: 'destroy',
        RESET: 'reset',
        CLEAR: 'clear',
        BEFORE_HIDE: 'beforeHide',
        HIDE: 'hide',
        BEFORE_SHOW: 'beforeShow',
        SHOW: 'show',
        BEFORE_HIDE_NAV: 'beforeHideNav',
        HIDE_NAV: 'hideNav',
        BEFORE_SHOW_NAV: 'beforeShowNav',
        SHOW_NAV: 'showNav',
        BEFORE_RENDER_NAV: 'beforeRenderNav',
        RENDER_NAV: 'renderNav',
        CURSOR_IN: 'cursorIn',
        CURSOR_OUT: 'cursorOut'
    };

    /**
    * The set of default style constants for the LCalendar
    * @property _STYLES
    * @final
    * @static
    * @private
    * @type Object
    */
    LCalendar._STYLES = {
        CSS_ROW_HEADER: 'L-calrowhead',
        CSS_ROW_FOOTER: 'L-calrowfoot',
        CSS_CELL: 'L-calcell',
        CSS_CELL_SELECTOR: 'selector',
        CSS_CELL_SELECTED: 'selected',
        CSS_CELL_SELECTABLE: 'selectable',
        CSS_CELL_RESTRICTED: 'restricted',
        CSS_CELL_TODAY: 'today',
        CSS_CELL_OOM: 'oom',
        CSS_CELL_OOB: 'oob',
        CSS_HEADER: 'L-calheader',
        CSS_HEADER_TEXT: 'L-calhead',
        CSS_BODY: 'L-calbody',
        CSS_WEEKDAY_CELL: 'L-calweekdaycell',
        CSS_WEEKDAY_ROW: 'L-calweekdayrow',
        CSS_FOOTER: 'L-calfoot',
        CSS_CALENDAR: 'L-calendar',
        CSS_SINGLE: 'L-single',
        CSS_CONTAINER: 'L-calcontainer',
        CSS_NAV_YEAR_LEFT: 'L-calnavyearleft',
        CSS_NAV_YEAR_RIGHT: 'L-calnavyearright',
        CSS_NAV_LEFT: 'L-calnavleft',
        CSS_NAV_RIGHT: 'L-calnavright',
        CSS_NAV: 'L-calnav',
        CSS_CLOSE: 'L-calclose',
        CSS_CELL_TOP: 'L-calcelltop',
        CSS_CELL_LEFT: 'L-calcellleft',
        CSS_CELL_RIGHT: 'L-calcellright',
        CSS_CELL_BOTTOM: 'L-calcellbottom',
        CSS_CELL_HOVER: 'L-calcellhover',
        CSS_CELL_HIGHLIGHT1: 'highlight1',
        CSS_CELL_HIGHLIGHT2: 'highlight2',
        CSS_CELL_HIGHLIGHT3: 'highlight3',
        CSS_CELL_HIGHLIGHT4: 'highlight4'
    };

    LCalendar.prototype = {

        /**
        * config 객체
        * @property Config
        * @private
        * @deprecated LConfiguration properties should be set by calling LCalendar.cfg.setProperty.
        * @type Object
        */
        Config: null,

        /**
        * parent LCalendarGroup
        * @property parent
        * @private
        * @type LCalendarGroup
        */
        parent: null,

        /**
        * calendar group의 index
        * @property index
        * @private
        * @type Number
        */
        index: -1,

        /**
        * calendar table의 배열
        * @property cells
        * @private
        * @type HTMLTableCellElement[]
        */
        cells: null,

        /**
        * calendar table의 배열의 날짜값, format은 [YYYY, M, D].
        * @property cellDates
        * @private
        * @type Array[](Number[])
        */
        cellDates: null,

        /**
        * 아이디
        * @property id
        * @private
        * @type String
        */
        id: null,

        /**
        * 컨테이너 아이디
        * @property containerId
        * @private
        * @type String
        */
        containerId: null,

        /**
        * 컨테이너 dom 객체
        * @property oDomContainer
        * @private
        * @type HTMLElement
        */
        oDomContainer: null,
        /**
         * @description 오늘 날짜를 셋팅한다. (선택된 날짜가 아닙니다.)
         * @config today
         * @sample default
         * @type {Date}
         * @default null
         */
        /**
        * 오늘 날짜
        * @property today
        * @private
        * @type Date
        */
        today: null,
        
        /**
        * 타이틀 메시지 코드
        * @property titleCode
        * @private
        * @type String
        */
        titleCode: '$.base.msg118',

        /**
        * cells을 render할 때 사용하는 내부배열 
        * @property renderStack
        * @private
        * @type Array[]
        */
        renderStack: null,

        /**
        * cells을 render할 때 사용하는 내부배열 사본
        * @property _renderStack
        * @private
        * @type Array
        */
        _renderStack: null,

        /**
        * LCalendarNavigator 객체
        * @property oNavigator
        * @private
        * @type LCalendarNavigator
        */
        oNavigator: null,

        /**
        * 선택된 날짜 배열
        * @property _selectedDates
        * @private
        * @type Array
        */
        _selectedDates: null,

        /**
        * 이벤트 맵
        * @property domEventMap
        * @private
        * @type Object
        */
        domEventMap: null,

        /**
        * 생성자 파라미터 파서
        * @protected
        * @method _parseArgs
        * @param {Array} Function 'arguments' array
        * @return {Object} Object with id, container, config properties containing
        * the reconciled argument values.
        **/
        _parseArgs: function(args) {
            /*
            2.4.0 Constructors signatures

           new LCalendar(String)
            new LCalendar(HTMLElement)
            new LCalendar(String, ConfigObject)
            new LCalendar(HTMLElement, ConfigObject)

           Pre 2.4.0 Constructor signatures

           new LCalendar(String, String)
            new LCalendar(String, HTMLElement)
            new LCalendar(String, String, ConfigObject)
            new LCalendar(String, HTMLElement, ConfigObject)
            */
            var nArgs = { id: null, container: null, config: null };

            if (args && args.length && args.length > 0) {
                switch (args.length) {
                    case 1:
                        nArgs.id = args[0].id ? args[0].id : null;
                        nArgs.container = args[0].applyTo ? args[0].applyTo : args[0];
                        nArgs.config = typeof args[0] == 'object' ? args[0] : null;
                        break;
                    case 2:
                        if (Rui.isObject(args[1]) && !args[1].tagName && !(args[1] instanceof String)) {
                            nArgs.id = null;
                            nArgs.container = args[0];
                            nArgs.config = args[1];
                        } else {
                            nArgs.id = args[0];
                            nArgs.container = args[1];
                            nArgs.config = null;
                        }
                        break;
                    default: // 3+
                        nArgs.id = args[0];
                        nArgs.container = args[1];
                        nArgs.config = args[2];
                        break;
                }
            } else {
            }
            return nArgs;
        },

        /**
        * LCalendar init 메소드.
        * @method init
        * @private
        * @param {String} id optional The id of the table element that will represent the LCalendar widget. As of 2.4.0, this argument is optional.
        * @param {String | HTMLElement} container The id of the container div element that will wrap the LCalendar table, or a reference to a DIV element which exists in the document.
        * @param {Object} config optional The configuration object containing the initial configuration values for the LCalendar.
        */
        init: function(id, container, config) {
            // Normalize 2.4.0, pre 2.4.0 args
            var nArgs = this._parseArgs(arguments);

            id = nArgs.id;
            container = nArgs.container;
            config = nArgs.config;

            //rui_config설정
            config = Rui.applyIf(config, Rui.getConfig().getFirst('$.ext.calendar.defaultProperties'));
            if(config.titleCode) {
                var mm = Rui.getMessageManager();
                config.title = mm.get(config.titleCode);
            }

            var domConainer = Rui.get(container).dom;
            if (!domConainer.id) {
                domConainer.id = Dom.generateId();
            }
            if (!id) {
                id = domConainer.id + '_t';
            }

            this.id = id;
            this.containerId = domConainer.id;

            this.initEvents();

            if(!this.today && config && config.today) this.today = config.today;
            else this.today = new Date();
            Rui.util.LDate.clearTime(this.today);

            /**
            * The Config object used to hold the configuration variables for the LCalendar
            * @property cfg
            * @protected
            * @type Rui.ui.LConfig
            */
            this.cfg = new Rui.ui.LConfig(this);

            /**
            * The local object which contains the LCalendar's options
            * @property Options
            * @protected
            * @type Object
            */
            this.Options = {};

            /**
            * The local object which contains the LCalendar's locale settings
            * @property Locale
            * @protected
            * @type Object
            */
            this.Locale = {};

            this.initStyles();

            Dom.addClass(domConainer, this.Style.CSS_CONTAINER);
            Dom.addClass(domConainer, this.Style.CSS_SINGLE);
            Dom.addClass(domConainer, 'L-fixed');
            
            this.oDomContainer = domConainer;

            this.cellDates = [];
            this.cells = [];
            this.renderStack = [];
            this._renderStack = [];

            this.setupConfig();

            if (config) {
                this.cfg.applyConfig(config, true);
            }

            this.cfg.fireQueue();
            //rui_config읽어서 local 설정하기
            this._setDefaultLocale();
        },
        
        /**
        * @description 사용자가 직접 .cfg.setProperty 를 호출하지 않도록 사용성을 위해 wrapping
        * @method setProperty
        * @param {object} key
        * @param {object} value
        */
        setProperty : function(key, value){
            this.cfg.setProperty(key, value);
        },
        
        /**
        * @description 사용자가 직접 .cfg.setProperty 를 호출하지 않도록 사용성을 위해 wrapping
        * @method getProperty 
        * @param {object} key
        * @return {object}
        */
        getProperty : function(key){
            return this.cfg.getProperty(key);
        },

        _setDefaultLocale: function(config) {
            var locale = Rui.getConfig().getFirst('$.core.defaultLocale');
            //LDateLocale값을 사용.
            var mm = Rui.getMessageManager();
            var title = mm.get(this.titleCode);
            var aLocale = Rui.util.LDate.getLocale(locale);
            var x = aLocale['x'];
            var order = x.split('%');
            var posY = 1;
            var posM = 2;
            var posD = 3;
            var c = '';
            for (var i=1;i<order.length;i++)
            {
                c = order[i].toLowerCase().charAt(0);
                switch(c){
                    case 'y':
                        posY = i;
                        break;
                    case 'm':
                        posM = i;
                        break;
                    case 'd':
                        posD = i;
                        break;
                }                
            }   
            
            var delimiter = x.charAt(2) == '%' ? '' : x.charAt(2);          
            
            if(this.cfg.getProperty('TITLE') == null) this.cfg.setProperty('TITLE', title);
            this.cfg.setProperty('START_WEEKDAY', mm.get('$.core.startWeekDay'));            
            this.cfg.setProperty('MONTHS_SHORT',aLocale['b']);
            this.cfg.setProperty('MONTHS_LONG',aLocale['B'] );
            this.cfg.setProperty('WEEKDAYS_1CHAR', mm.get('$.core.weekdays1Char'));
            this.cfg.setProperty('WEEKDAYS_SHORT', mm.get('$.core.shortDayInWeek'));
            this.cfg.setProperty('WEEKDAYS_MEDIUM',aLocale['a']);
            this.cfg.setProperty('WEEKDAYS_LONG',aLocale['A']);
            this.cfg.setProperty('LOCALE_MONTHS', mm.get('$.core.localeMonths'));
            this.cfg.setProperty('LOCALE_WEEKDAYS', mm.get('$.core.localeWeekdays'));
            this.cfg.setProperty('DATE_DELIMITER', mm.get('$.core.dateDelimiter'));
            this.cfg.setProperty('DATE_FIELD_DELIMITER',delimiter);//%m/%d/%Y에서 3번째가 구분자이다.
            this.cfg.setProperty('DATE_RANGE_DELIMITER', mm.get('$.core.dateRangeDelimiter'));
            this.cfg.setProperty('MY_MONTH_POSITION',posM);
            this.cfg.setProperty('MY_YEAR_POSITION',posY);
            this.cfg.setProperty('MD_MONTH_POSITION',posM);
            this.cfg.setProperty('MD_DAY_POSITION',posD);
            this.cfg.setProperty('MDY_MONTH_POSITION',posM);
            this.cfg.setProperty('MDY_DAY_POSITION',posD);
            this.cfg.setProperty('MDY_YEAR_POSITION',posY);
            this.cfg.setProperty('MY_LABEL_MONTH_POSITION',posM );
            this.cfg.setProperty('MY_LABEL_YEAR_POSITION',posY);
            this.cfg.setProperty('MY_LABEL_MONTH_SUFFIX', mm.get('$.core.myLabelMonthSuffix'));
            this.cfg.setProperty('MY_LABEL_YEAR_SUFFIX', mm.get('$.core.myLabelYearSuffix'));
        },

        /**
        * iframe 파라미터 사용시 호출되는 메소드
        * @method configIframe
        * @private
        */
        configIframe: function(type, args, obj) {
            var useIframe = args[0];

            if (!this.parent) {
                if (Dom.inDocument(this.oDomContainer)) {
                    if (useIframe) {
                        var pos = Dom.getStyle(this.oDomContainer, 'position');

                        if (pos == 'absolute' || pos == 'relative') {

                            if (!Dom.inDocument(this.iframe)) {
                                this.iframe = document.createElement('iframe');
                                //this.iframe.src = 'javascript:false;';
                                this.iframe.width = this.oDomContainer.style.width;
                                this.iframe.height = this.oDomContainer.style.height;

                                Dom.setStyle(this.iframe, 'opacity', '0');                                

                                if (Rui.browser.msie && Rui.browser.msie <= 6) {
                                    Dom.addClass(this.iframe, 'fixedsize'); 
                                }

                                this.oDomContainer.insertBefore(this.iframe, this.oDomContainer.firstChild);
                            }
                        }
                    } else {
                        if (this.iframe) {
                            if (this.iframe.parentNode) {
                                this.iframe.parentNode.removeChild(this.iframe);
                            }
                            this.iframe = null;
                        }
                    }
                }
            }
        },

        /**
        * title 파라미터 사용시 호출되는 메소드
        * @method configTitle
        * @private
        */
        configTitle: function(type, args, obj) {
            var title = args[0];

            // '' disables title bar
            if (title) {
                this.createTitleBar(title);
            } else {
                var close = this.cfg.getProperty(DEF_CFG.CLOSE.key);
                if (!close) {
                    this.removeTitleBar();
                } else {
                    this.createTitleBar('&#160;');
                }
            }
        },

        /**
        * close 파라미터 사용시 호출되는 메소드
        * @method configClose
        * @private
        */
        configClose: function(type, args, obj) {
            var close = args[0],
            title = this.cfg.getProperty(DEF_CFG.TITLE.key);

            if (close) {
                if (!title) {
                    this.createTitleBar('&#160;');
                }
                this.createCloseButton();
            } else {
                this.removeCloseButton();
                if (!title) {
                    this.removeTitleBar();
                }
            }
        },

        /**
        * @description 객체의 이벤트 초기화 메소드
        * @method initEvents
        * @protected
        */
        initEvents: function() {

            var defEvents = LCalendar._EVENT_TYPES,
            CE = Rui.util.LCustomEvent,
            cal = this; // To help with minification

            /**
            * Fired before a date selection is made
            * @event beforeSelect
            */
            cal.beforeSelectEvent = new CE(defEvents.BEFORE_SELECT, this, false, Rui.util.LCustomEvent.FLAT);

            /**
            * Fired when a date selection is made
            * @event select
            * @param {Array}    array of Date field arrays in the format [YYYY, MM, LDD].
            */
            cal.selectEvent = new CE(defEvents.SELECT, this, false, Rui.util.LCustomEvent.FLAT);

            /**
            * Fired before a date or set of dates is deselected
            * @event beforeDeselect
            */
            cal.beforeDeselectEvent = new CE(defEvents.BEFORE_DESELECT);

            /**
            * Fired when a date or set of dates is deselected
            * @event deselect
            * @param {Array}    array of Date field arrays in the format [YYYY, MM, LDD].
            */
            cal.deselectEvent = new CE(defEvents.DESELECT, this, false, Rui.util.LCustomEvent.FLAT);

            /**
            * Fired when the LCalendar page is changed
            * @event beforeChangePage
            */
            cal.beforeChangePageEvent = new CE(defEvents.BEFORE_CHANGE_PAGE, this, false, Rui.util.LCustomEvent.FLAT);

            /**
            * Fired when the LCalendar page is changed
            * @event changePage
            */
            cal.changePageEvent = new CE(defEvents.CHANGE_PAGE, this, false, Rui.util.LCustomEvent.FLAT);

            /**
            * Fired before the LCalendar is rendered
            * @event beforeRender
            */
            cal.beforeRenderEvent = new CE(defEvents.BEFORE_RENDER, this, false, Rui.util.LCustomEvent.FLAT);

            /**
            * Fired when the LCalendar is rendered
            * @event render
            */
            cal.renderEvent = new CE(defEvents.RENDER, this, false, Rui.util.LCustomEvent.FLAT);

            /**
            * Fired when the LCalendar is rendered
            * @event renderCell
            */
            cal.renderCellEvent = new CE(defEvents.RENDER_CELL, this, false, Rui.util.LCustomEvent.FLAT);

            /**
            * Fired just before the LCalendar is to be destroyed
            * @event beforeDestroy
            */
            cal.beforeDestroyEvent = new CE(defEvents.BEFORE_DESTROY, this, false, Rui.util.LCustomEvent.FLAT);

            /**
            * Fired after the LCalendar is destroyed. This event should be used
            * for notification only. When this event is fired, important LCalendar instance
            * properties, dom references and event listeners have already been 
            * removed/dereferenced, and hence the LCalendar instance is not in a usable 
            * state.
            *
            * @event destroy
            */
            cal.destroyEvent = new CE(defEvents.DESTROY, this, false, Rui.util.LCustomEvent.FLAT);

            /**
            * Fired when the LCalendar is reset
            * @event reset
            */
            cal.resetEvent = new CE(defEvents.RESET, this, false, Rui.util.LCustomEvent.FLAT);

            /**
            * Fired when the LCalendar is cleared
            * @event clear
            */
            cal.clearEvent = new CE(defEvents.CLEAR, this, false, Rui.util.LCustomEvent.FLAT);

            /**
            * Fired just before the LCalendar is to be shown
            * @event beforeShow
            */
            cal.beforeShowEvent = new CE(defEvents.BEFORE_SHOW, this, false, Rui.util.LCustomEvent.FLAT);

            /**
            * Fired after the LCalendar is shown
            * @event show
            */
            cal.showEvent = new CE(defEvents.SHOW, this, false, Rui.util.LCustomEvent.FLAT);

            /**
            * Fired just before the LCalendar is to be hidden
            * @event beforeHide
            */
            cal.beforeHideEvent = new CE(defEvents.BEFORE_HIDE, this, false, Rui.util.LCustomEvent.FLAT);

            /**
            * Fired after the LCalendar is hidden
            * @event hide
            */
            cal.hideEvent = new CE(defEvents.HIDE, this, false, Rui.util.LCustomEvent.FLAT);

            /**
            * Fired just before the LCalendarNavigator is to be shown
            * @event beforeShowNav
            */
            cal.beforeShowNavEvent = new CE(defEvents.BEFORE_SHOW_NAV, this, false, Rui.util.LCustomEvent.FLAT);

            /**
            * Fired after the LCalendarNavigator is shown
            * @event showNav
            */
            cal.showNavEvent = new CE(defEvents.SHOW_NAV, this, false, Rui.util.LCustomEvent.FLAT);

            /**
            * Fired just before the LCalendarNavigator is to be hidden
            * @event beforeHideNav
            */
            cal.beforeHideNavEvent = new CE(defEvents.BEFORE_HIDE_NAV, this, false, Rui.util.LCustomEvent.FLAT);

            /**
            * Fired after the LCalendarNavigator is hidden
            * @event hideNav
            */
            cal.hideNavEvent = new CE(defEvents.HIDE_NAV, this, false, Rui.util.LCustomEvent.FLAT);

            /**
            * Fired just before the LCalendarNavigator is to be rendered
            * @event beforeRenderNav
            */
            cal.beforeRenderNavEvent = new CE(defEvents.BEFORE_RENDER_NAV, this, false, Rui.util.LCustomEvent.FLAT);

            /**
            * Fired after the LCalendarNavigator is rendered
            * @event renderNav
            */
            cal.renderNavEvent = new CE(defEvents.RENDER_NAV, this, false, Rui.util.LCustomEvent.FLAT);
            
            /**
             * Fired after the LCalendarNavigator is rendered
             * @protected
             * @event cursorInEvent
             */
            cal.cursorInEvent = new CE(defEvents.CURSOR_IN, this, false, Rui.util.LCustomEvent.FLAT);
            
            /**
             * Fired after the LCalendarNavigator is rendered
             * @protected
             * @event cursorOut
             */
            cal.cursorOutEvent = new CE(defEvents.CURSOR_OUT, this, false, Rui.util.LCustomEvent.FLAT);

            cal.beforeSelectEvent.on(cal.onBeforeSelect, this, true);
            cal.selectEvent.on(cal.onSelect, this, true);
            cal.beforeDeselectEvent.on(cal.onBeforeDeselect, this, true);
            cal.deselectEvent.on(cal.onDeselect, this, true);
            cal.changePageEvent.on(cal.onChangePage, this, true);
            cal.renderEvent.on(cal.onRender, this, true);
            cal.resetEvent.on(cal.onReset, this, true);
            cal.clearEvent.on(cal.onClear, this, true);
        },

        /**
        * 전월로 이동하는 메소드
        * @method doPreviousMonthNav
        * @protected
        * @param {DOMEvent} e   The DOM event
        * @param {Rui.ui.calendar.LCalendar} cal  A reference to the calendar
        */
        doPreviousMonthNav: function(e, cal) {
            Event.preventDefault(e);
            // previousMonth invoked in a timeout, to allow
            // event to bubble up, with correct target. Calling
            // previousMonth, will call render which will remove 
            // HTML which generated the event, resulting in an 
            // invalid event target in certain browsers.
            setTimeout(function() {
                if(cal.beforeChangePageEvent.fire(this, e) == false) return;
                cal.previousMonth();
                var navs = Dom.getElementsByClassName(cal.Style.CSS_NAV_LEFT, 'a', cal.oDomContainer);
                if (navs && navs[0]) {
                    try {
                        navs[0].focus();
                    } catch (e) {
                        // ignore
                    }
                }
            }, Rui.platform.isMobile ? 10 : 0);
        },

        /**
        * 다음월로 이동하는 메소드
        * @method doNextMonthNav
        * @protected
        * @param {DOMEvent} e   The DOM event
        * @param {Rui.ui.calendar.LCalendar} cal  A reference to the calendar
        */
        doNextMonthNav: function(e, cal) {
            Event.preventDefault(e);
            setTimeout(function() {
                if(cal.beforeChangePageEvent.fire(this, e) == false) return;
                cal.nextMonth();
                var navs = Dom.getElementsByClassName(cal.Style.CSS_NAV_RIGHT, 'a', cal.oDomContainer);
                if (navs && navs[0]) {
                    try {
                        navs[0].focus();
                    } catch (e) {
                        // ignore
                    }
                }
            }, Rui.platform.isMobile ? 10 : 0);
        },

        /**
        * 전년으로 이동하는 메소드
        * @method doPreviousYearNav
        * @protected
        * @param {DOMEvent} e   The DOM event
        * @param {Rui.ui.calendar.LCalendar} cal  A reference to the calendar
        */
        doPreviousYearNav: function(e, cal) {
            Event.preventDefault(e);
            // previousMonth invoked in a timeout, to allow
            // event to bubble up, with correct target. Calling
            // previousMonth, will call render which will remove 
            // HTML which generated the event, resulting in an 
            // invalid event target in certain browsers.
            setTimeout(function() {
                if(cal.beforeChangePageEvent.fire(this, e) == false) return;
                cal.previousYear();
                var navs = Dom.getElementsByClassName(cal.Style.CSS_NAV_YEAR_LEFT, 'a', cal.oDomContainer);
                if (navs && navs[0]) {
                    try {
                        navs[0].focus();
                    } catch (e) {
                        // ignore
                    }
                }
            }, Rui.platform.isMobile ? 10 : 0);
        },

        /**
        * 다음년으로 이동하는 메소드
        * @method doNextYearNav
        * @protected
        * @param {DOMEvent} e   The DOM event
        * @param {Rui.ui.calendar.LCalendar} cal  A reference to the calendar
        */
        doNextYearNav: function(e, cal) {
            Event.preventDefault(e);
            setTimeout(function() {
                if(cal.beforeChangePageEvent.fire(this, e) == false) return;
                cal.nextYear();
                var navs = Dom.getElementsByClassName(cal.Style.CSS_NAV_YEAR_RIGHT, 'a', cal.oDomContainer);
                if (navs && navs[0]) {
                    try {
                        navs[0].focus();
                    } catch (e) {
                        // ignore
                    }
                }
            }, Rui.platform.isMobile ? 10 : 0);
        },

        /**
        * 날짜 선택 메소드
        * @method doSelectCell
        * @protected
        * @param {DOMEvent} e   The DOM event
        * @param {Rui.ui.calendar.LCalendar} cal  A reference to the calendar
        */
        doSelectCell: function(e, cal) {
            var cell, d, index;

            var target = Event.getTarget(e),
            tagName = target.tagName.toLowerCase(),
            defSelector = false;

            while (tagName != 'td' && !Dom.hasClass(target, cal.Style.CSS_CELL_SELECTABLE)) {

                if (!defSelector && tagName == 'a' && Dom.hasClass(target, cal.Style.CSS_CELL_SELECTOR)) {
                    defSelector = true;
                }

                target = target.parentNode;
                tagName = target.tagName.toLowerCase();

                if (target == this.oDomContainer || tagName == 'html') {
                    return;
                }
            }

            if (defSelector) {
                // Stop link href navigation for default renderer
                Event.preventDefault(e);
            }

            cell = target;

            if (Dom.hasClass(cell, cal.Style.CSS_CELL_SELECTABLE)) {
                index = cal.getIndexFromId(cell.id);
                if (index > -1) {
                    d = cal.cellDates[index];
                    if (d) {
                        //date = Rui.util.LDate.getDate(d[0], d[1] - 1, d[2]);

                        var link;

                        if (cal.Options.MULTI_SELECT) {
                            link = cell.getElementsByTagName('a')[0];
                            if (link) {
                                link.blur();
                            }

                            var cellDate = cal.cellDates[index];
                            var cellDateIndex = cal._indexOfSelectedFieldArray(cellDate);

                            if (cellDateIndex > -1) {
                                cal.deselectCell(index);
                            } else {
                                cal.selectCell(index);
                            }

                        } else {
                            link = cell.getElementsByTagName('a')[0];
                            if (link) {
                                link.blur();
                            }
                            cal.selectCell(index);
                        }
                    }
                }
            }
        },

        /**
        * cell의 mouseover 메소드
        * @method doCellMouseOver
        * @protected
        * @param {DOMEvent} e   The event
        * @param {Rui.ui.calendar.LCalendar} cal  A reference to the calendar passed by the Event utility
        */
        doCellMouseOver: function(e, cal) {
            var target;
            if (e) {
                target = Event.getTarget(e);
            } else {
                target = this;
            }

            while (target.tagName && target.tagName.toLowerCase() != 'td') {
                target = target.parentNode;
                if (!target.tagName || target.tagName.toLowerCase() == 'html') {
                    return;
                }
            }
            
            if(!target.id) return;
            
            if (Dom.hasClass(target, cal.Style.CSS_CELL_SELECTABLE)) {
                Dom.addClass(target, cal.Style.CSS_CELL_HOVER);
            }

            var cellIndex = cal.getIndexFromId(target.id),
                cellDate = cal.cellDates[cellIndex];
            cal.cursorInEvent.fire({
                cellDate: cellDate,
                date: cal._toDate(cellDate)
            });
        },

        /**
        * cell의 mouseout 메소드
        * @method doCellMouseOut
        * @protected
        * @param {DOMEvent} e   The event
        * @param {Rui.ui.calendar.LCalendar} cal  A reference to the calendar passed by the Event utility
        */
        doCellMouseOut: function(e, cal) {
            var target;
            if (e) {
                target = Event.getTarget(e);
            } else {
                target = this;
            }

            while (target.tagName && target.tagName.toLowerCase() != 'td') {
                target = target.parentNode;
                if (!target.tagName || target.tagName.toLowerCase() == 'html') {
                    return;
                }
            }
            
            if(!target.id) return;

            if (Dom.hasClass(target, cal.Style.CSS_CELL_SELECTABLE)) {
                Dom.removeClass(target, cal.Style.CSS_CELL_HOVER);
            }
            
            var cellIndex = cal.getIndexFromId(target.id),
                cellDate = cal.cellDates[cellIndex];
            cal.cursorOutEvent.fire({
                cellDate: cellDate,
                date: cal._toDate(cellDate)
            });
        },

        setupConfig: function() {
            var cfg = this.cfg;

            /**
            * The month/year representing the current visible LCalendar date (mm/yyyy)
            * @config pagedate
            * @type String | Date
            * @default today's date
            */
            cfg.addProperty(DEF_CFG.PAGEDATE.key, { value: new Date(), handler: this.configPageDate });

            /**
            * The date or range of dates representing the current LCalendar selection
            * @config selected
            * @type String
            * @default []
            */
            cfg.addProperty(DEF_CFG.SELECTED.key, { value: [], handler: this.configSelected });

            /**
            * The title to display above the LCalendar's month header
            * @config title
            * @type String
            * @default ''
            */
            cfg.addProperty(DEF_CFG.TITLE.key, { value: DEF_CFG.TITLE.value, handler: this.configTitle });

            /**
            * Whether or not a close button should be displayed for this LCalendar
            * @config close
            * @type Boolean
            * @default false
            */
            cfg.addProperty(DEF_CFG.CLOSE.key, { value: DEF_CFG.CLOSE.value, handler: this.configClose });

            /**
            * Whether or not an iframe shim should be placed under the LCalendar to prevent select boxes from bleeding through in Internet Explorer 6 and below.
            * This property is enabled by default for IE6 and below. It is disabled by default for other browsers for performance reasons, but can be 
            * enabled if required.
            * 
            * @config iframe
            * @type Boolean
            * @default true for IE6 and below, false for all other browsers
            */
            cfg.addProperty(DEF_CFG.IFRAME.key, { value: DEF_CFG.IFRAME.value, handler: this.configIframe, validator: cfg.checkBoolean });

            /**
            * The minimum selectable date in the current LCalendar (mm/dd/yyyy)
            * @config mindate
            * @type String | Date
            * @default null
            */
            cfg.addProperty(DEF_CFG.MINDATE.key, { value: DEF_CFG.MINDATE.value, handler: this.configMinDate });

            /**
            * The maximum selectable date in the current LCalendar (mm/dd/yyyy)
            * @config maxdate
            * @type String | Date
            * @default null
            */
            cfg.addProperty(DEF_CFG.MAXDATE.key, { value: DEF_CFG.MAXDATE.value, handler: this.configMaxDate });


            // Options properties

            /**
            * True if the LCalendar should allow multiple selections. False by default.
            * @config MULTI_SELECT
            * @type Boolean
            * @default false
            */
            cfg.addProperty(DEF_CFG.MULTI_SELECT.key, { value: DEF_CFG.MULTI_SELECT.value, handler: this.configOptions, validator: cfg.checkBoolean });

            /**
            * The weekday the week begins on. Default is 0 (Sunday = 0, Monday = 1 ... Saturday = 6).
            * @config START_WEEKDAY
            * @type number
            * @default 0
            */
            cfg.addProperty(DEF_CFG.START_WEEKDAY.key, { value: DEF_CFG.START_WEEKDAY.value, handler: this.configOptions, validator: cfg.checkNumber });

            /**
            * True if the LCalendar should show weekday labels. True by default.
            * @config SHOW_WEEKDAYS
            * @type Boolean
            * @default true
            */
            cfg.addProperty(DEF_CFG.SHOW_WEEKDAYS.key, { value: DEF_CFG.SHOW_WEEKDAYS.value, handler: this.configOptions, validator: cfg.checkBoolean });

            /**
            * True if the LCalendar should show week row headers. False by default.
            * @config SHOW_WEEK_HEADER
            * @type Boolean
            * @default false
            */
            cfg.addProperty(DEF_CFG.SHOW_WEEK_HEADER.key, { value: DEF_CFG.SHOW_WEEK_HEADER.value, handler: this.configOptions, validator: cfg.checkBoolean });

            /**
            * True if the LCalendar should show week row footers. False by default.
            * @config SHOW_WEEK_FOOTER
            * @type Boolean
            * @default false
            */
            cfg.addProperty(DEF_CFG.SHOW_WEEK_FOOTER.key, { value: DEF_CFG.SHOW_WEEK_FOOTER.value, handler: this.configOptions, validator: cfg.checkBoolean });

            /**
            * True if the LCalendar should suppress weeks that are not a part of the current month. False by default.
            * @config HIDE_BLANK_WEEKS
            * @type Boolean
            * @default false
            */
            cfg.addProperty(DEF_CFG.HIDE_BLANK_WEEKS.key, { value: DEF_CFG.HIDE_BLANK_WEEKS.value, handler: this.configOptions, validator: cfg.checkBoolean });

            /**
            * The image that should be used for the left navigation arrow.
            * @config NAV_ARROW_LEFT
            * @type String
            * @private
            * @deprecated   You can customize the image by overriding the default CSS class for the left arrow - 'L-calnavleft'  
            * @default null
            */
            cfg.addProperty(DEF_CFG.NAV_ARROW_LEFT.key, { value: DEF_CFG.NAV_ARROW_LEFT.value, handler: this.configOptions });

            /**
            * The image that should be used for the right navigation arrow.
            * @config NAV_ARROW_RIGHT
            * @type String
            * @private
            * @deprecated   You can customize the image by overriding the default CSS class for the right arrow - 'L-calnavright'
            * @default null
            */
            cfg.addProperty(DEF_CFG.NAV_ARROW_RIGHT.key, { value: DEF_CFG.NAV_ARROW_RIGHT.value, handler: this.configOptions });

            // Locale properties

            /**
            * The short month labels for the current locale.
            * @config MONTHS_SHORT
            * @type String[]
            * @default ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            */
            cfg.addProperty(DEF_CFG.MONTHS_SHORT.key, { value: DEF_CFG.MONTHS_SHORT.value, handler: this.configLocale });

            /**
            * The long month labels for the current locale.
            * @config MONTHS_LONG
            * @type String[]
            * @default ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
            */
            cfg.addProperty(DEF_CFG.MONTHS_LONG.key, { value: DEF_CFG.MONTHS_LONG.value, handler: this.configLocale });

            /**
            * The 1-character weekday labels for the current locale.
            * @config WEEKDAYS_1CHAR
            * @type String[]
            * @default ['S', 'M', 'T', 'W', 'T', 'F', 'S']
            */
            cfg.addProperty(DEF_CFG.WEEKDAYS_1CHAR.key, { value: DEF_CFG.WEEKDAYS_1CHAR.value, handler: this.configLocale });

            /**
            * The short weekday labels for the current locale.
            * @config WEEKDAYS_SHORT
            * @type String[]
            * @default ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
            */
            cfg.addProperty(DEF_CFG.WEEKDAYS_SHORT.key, { value: DEF_CFG.WEEKDAYS_SHORT.value, handler: this.configLocale });

            /**
            * The medium weekday labels for the current locale.
            * @config WEEKDAYS_MEDIUM
            * @type String[]
            * @default ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            */
            cfg.addProperty(DEF_CFG.WEEKDAYS_MEDIUM.key, { value: DEF_CFG.WEEKDAYS_MEDIUM.value, handler: this.configLocale });

            /**
            * The long weekday labels for the current locale.
            * @config WEEKDAYS_LONG
            * @type String[]
            * @default ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
            */
            cfg.addProperty(DEF_CFG.WEEKDAYS_LONG.key, { value: DEF_CFG.WEEKDAYS_LONG.value, handler: this.configLocale });

            /**
            * Refreshes the locale values used to build the LCalendar.
            * @method refreshLocale
            * @private
            */
            var refreshLocale = function() {
                cfg.refireEvent(DEF_CFG.LOCALE_MONTHS.key);
                cfg.refireEvent(DEF_CFG.LOCALE_WEEKDAYS.key);
            };

            cfg.subscribeToConfigEvent(DEF_CFG.START_WEEKDAY.key, refreshLocale, this, true);
            cfg.subscribeToConfigEvent(DEF_CFG.MONTHS_SHORT.key, refreshLocale, this, true);
            cfg.subscribeToConfigEvent(DEF_CFG.MONTHS_LONG.key, refreshLocale, this, true);
            cfg.subscribeToConfigEvent(DEF_CFG.WEEKDAYS_1CHAR.key, refreshLocale, this, true);
            cfg.subscribeToConfigEvent(DEF_CFG.WEEKDAYS_SHORT.key, refreshLocale, this, true);
            cfg.subscribeToConfigEvent(DEF_CFG.WEEKDAYS_MEDIUM.key, refreshLocale, this, true);
            cfg.subscribeToConfigEvent(DEF_CFG.WEEKDAYS_LONG.key, refreshLocale, this, true);

            /**
            * The setting that determines which length of month labels should be used. Possible values are 'short' and 'long'.
            * @config LOCALE_MONTHS
            * @type String
            * @default 'long'
            */
            cfg.addProperty(DEF_CFG.LOCALE_MONTHS.key, { value: DEF_CFG.LOCALE_MONTHS.value, handler: this.configLocaleValues });

            /**
            * The setting that determines which length of weekday labels should be used. Possible values are '1char', 'short', 'medium', and 'long'.
            * @config LOCALE_WEEKDAYS
            * @type String
            * @default 'short'
            */
            cfg.addProperty(DEF_CFG.LOCALE_WEEKDAYS.key, { value: DEF_CFG.LOCALE_WEEKDAYS.value, handler: this.configLocaleValues });

            /**
            * The value used to delimit individual dates in a date string passed to various LCalendar functions.
            * @config DATE_DELIMITER
            * @type String
            * @default ','
            */
            cfg.addProperty(DEF_CFG.DATE_DELIMITER.key, { value: DEF_CFG.DATE_DELIMITER.value, handler: this.configLocale });

            /**
            * The value used to delimit date fields in a date string passed to various LCalendar functions.
            * @config DATE_FIELD_DELIMITER
            * @type String
            * @default '/'
            */
            cfg.addProperty(DEF_CFG.DATE_FIELD_DELIMITER.key, { value: DEF_CFG.DATE_FIELD_DELIMITER.value, handler: this.configLocale });

            /**
            * The value used to delimit date ranges in a date string passed to various LCalendar functions.
            * @config DATE_RANGE_DELIMITER
            * @type String
            * @default '-'
            */
            cfg.addProperty(DEF_CFG.DATE_RANGE_DELIMITER.key, { value: DEF_CFG.DATE_RANGE_DELIMITER.value, handler: this.configLocale });

            /**
            * The position of the month in a month/year date string
            * @config MY_MONTH_POSITION
            * @type Number
            * @default 1
            */
            cfg.addProperty(DEF_CFG.MY_MONTH_POSITION.key, { value: DEF_CFG.MY_MONTH_POSITION.value, handler: this.configLocale, validator: cfg.checkNumber });

            /**
            * The position of the year in a month/year date string
            * @config MY_YEAR_POSITION
            * @type Number
            * @default 2
            */
            cfg.addProperty(DEF_CFG.MY_YEAR_POSITION.key, { value: DEF_CFG.MY_YEAR_POSITION.value, handler: this.configLocale, validator: cfg.checkNumber });

            /**
            * The position of the month in a month/day date string
            * @config MD_MONTH_POSITION
            * @type Number
            * @default 1
            */
            cfg.addProperty(DEF_CFG.MD_MONTH_POSITION.key, { value: DEF_CFG.MD_MONTH_POSITION.value, handler: this.configLocale, validator: cfg.checkNumber });

            /**
            * The position of the day in a month/year date string
            * @config MD_DAY_POSITION
            * @type Number
            * @default 2
            */
            cfg.addProperty(DEF_CFG.MD_DAY_POSITION.key, { value: DEF_CFG.MD_DAY_POSITION.value, handler: this.configLocale, validator: cfg.checkNumber });

            /**
            * The position of the month in a month/day/year date string
            * @config MDY_MONTH_POSITION
            * @type Number
            * @default 1
            */
            cfg.addProperty(DEF_CFG.MDY_MONTH_POSITION.key, { value: DEF_CFG.MDY_MONTH_POSITION.value, handler: this.configLocale, validator: cfg.checkNumber });

            /**
            * The position of the day in a month/day/year date string
            * @config MDY_DAY_POSITION
            * @type Number
            * @default 2
            */
            cfg.addProperty(DEF_CFG.MDY_DAY_POSITION.key, { value: DEF_CFG.MDY_DAY_POSITION.value, handler: this.configLocale, validator: cfg.checkNumber });

            /**
            * The position of the year in a month/day/year date string
            * @config MDY_YEAR_POSITION
            * @type Number
            * @default 3
            */
            cfg.addProperty(DEF_CFG.MDY_YEAR_POSITION.key, { value: DEF_CFG.MDY_YEAR_POSITION.value, handler: this.configLocale, validator: cfg.checkNumber });

            /**
            * The position of the month in the month year label string used as the LCalendar header
            * @config MY_LABEL_MONTH_POSITION
            * @type Number
            * @default 1
            */
            cfg.addProperty(DEF_CFG.MY_LABEL_MONTH_POSITION.key, { value: DEF_CFG.MY_LABEL_MONTH_POSITION.value, handler: this.configLocale, validator: cfg.checkNumber });

            /**
            * The position of the year in the month year label string used as the LCalendar header
            * @config MY_LABEL_YEAR_POSITION
            * @type Number
            * @default 2
            */
            cfg.addProperty(DEF_CFG.MY_LABEL_YEAR_POSITION.key, { value: DEF_CFG.MY_LABEL_YEAR_POSITION.value, handler: this.configLocale, validator: cfg.checkNumber });

            /**
            * The suffix used after the month when rendering the LCalendar header
            * @config MY_LABEL_MONTH_SUFFIX
            * @type String
            * @default ' '
            */
            cfg.addProperty(DEF_CFG.MY_LABEL_MONTH_SUFFIX.key, { value: DEF_CFG.MY_LABEL_MONTH_SUFFIX.value, handler: this.configLocale });

            /**
            * The suffix used after the year when rendering the LCalendar header
            * @config MY_LABEL_YEAR_SUFFIX
            * @type String
            * @default ''
            */
            cfg.addProperty(DEF_CFG.MY_LABEL_YEAR_SUFFIX.key, { value: DEF_CFG.MY_LABEL_YEAR_SUFFIX.value, handler: this.configLocale });

            /**
            * LConfiguration for the Month/Year LCalendarNavigator UI which allows the user to jump directly to a 
            * specific Month/Year without having to scroll sequentially through months.
            * <p>
            * Setting this property to null (default value) or false, will disable the LCalendarNavigator UI.
            * </p>
            * <p>
            * Setting this property to true will enable the CalendarNavigatior UI with the default LCalendarNavigator configuration values.
            * </p>
            * <p>
            * This property can also be set to an object literal containing configuration properties for the LCalendarNavigator UI.
            * The configuration object expects the the following case-sensitive properties, with the 'strings' property being a nested object.
            * Any properties which are not provided will use the default values (defined in the LCalendarNavigator class).
            * </p>
            * <dl>
            * <dt>strings</dt>
            * <dd><em>Object</em> :  An object with the properties shown below, defining the string labels to use in the Navigator's UI
            *     <dl>
            *         <dt>month</dt><dd><em>String</em> : The string to use for the month label. Defaults to 'Month'.</dd>
            *         <dt>year</dt><dd><em>String</em> : The string to use for the year label. Defaults to 'Year'.</dd>
            *         <dt>submit</dt><dd><em>String</em> : The string to use for the submit button label. Defaults to 'Okay'.</dd>
            *         <dt>cancel</dt><dd><em>String</em> : The string to use for the cancel button label. Defaults to 'Cancel'.</dd>
            *         <dt>invalidYear</dt><dd><em>String</em> : The string to use for invalid year values. Defaults to 'Year needs to be a number'.</dd>
            *     </dl>
            * </dd>
            * <dt>monthFormat</dt><dd><em>String</em> : The month format to use. Either Rui.ui.calendar.LCalendar.LONG, or Rui.ui.calendar.LCalendar.SHORT. Defaults to Rui.ui.calendar.LCalendar.LONG</dd>
            * <dt>initialFocus</dt><dd><em>String</em> : Either 'year' or 'month' specifying which input control should get initial focus. Defaults to 'year'</dd>
            * </dl>
            * <p>E.g.</p>
            * <pre>
            * var navConfig = {
            *     strings: {
            *         month:'LCalendar Month',
            *         year:'LCalendar Year',
            *         submit: 'Submit',
            *         cancel: 'Cancel',
            *         invalidYear: 'Please enter a valid year'
            *     },
            *     monthFormat: Rui.ui.calendar.LCalendar.SHORT,
            *     initialFocus: 'month'
            * }
            * </pre>
            * @config navigator
            * @type {Object|Boolean}
            * @default null
            */
            cfg.addProperty(DEF_CFG.NAV.key, { value: DEF_CFG.NAV.value, handler: this.configNavigator });

            /**
            * The map of UI strings which the LCalendar UI uses.
            *
            * @config strings
            * @type {Object}
            * @default An object with the properties shown below:
            *     <dl>
            *         <dt>previousMonth</dt><dd><em>String</em> : The string to use for the 'Previous Month' navigation UI. Defaults to 'Previous Month'.</dd>
            *         <dt>nextMonth</dt><dd><em>String</em> : The string to use for the 'Next Month' navigation UI. Defaults to 'Next Month'.</dd>
            *         <dt>close</dt><dd><em>String</em> : The string to use for the close button label. Defaults to 'Close'.</dd>
            *     </dl>
            */
            cfg.addProperty(DEF_CFG.STRINGS.key, {
                value: DEF_CFG.STRINGS.value,
                handler: this.configStrings,
                validator: function(val) {
                    return Rui.isObject(val);
                },
                supercedes: DEF_CFG.STRINGS.supercedes
            });
        },

        /**
        * strings 파라미터 사용시 수행하는 메소드
        * @method configStrings
        * @protected
        */
        configStrings: function(type, args, obj) {
            var val = Lang.merge(DEF_CFG.STRINGS.value, args[0]);
            this.cfg.setProperty(DEF_CFG.STRINGS.key, val, true);
        },

        /**
        * pagedate 파라미터 사용시 수행하는 메소드
        * @method configPageDate
        * @protected
        */
        configPageDate: function(type, args, obj) {
            this.cfg.setProperty(DEF_CFG.PAGEDATE.key, this._parsePageDate(args[0]), true);
        },

        /**
        * mindate 파라미터 사용시 수행하는 메소드
        * @method configMinDate
        * @protected
        */
        configMinDate: function(type, args, obj) {
            var val = args[0];
            if (Rui.isString(val)) {
                val = this._parseDate(val);
                this.cfg.setProperty(DEF_CFG.MINDATE.key, Rui.util.LDate.getDate(val[0], (val[1] - 1), val[2]));
            }
        },

        /**
        * maxdate 파라미터 사용시 수행하는 메소드
        * @method configMaxDate
        * @protected
        */
        configMaxDate: function(type, args, obj) {
            var val = args[0];
            if (Rui.isString(val)) {
                val = this._parseDate(val);
                this.cfg.setProperty(DEF_CFG.MAXDATE.key, Rui.util.LDate.getDate(val[0], (val[1] - 1), val[2]));
            }
        },

        /**
        * selected 파라미터 사용시 수행하는 메소드
        * @method configSelected
        * @protected
        */
        configSelected: function(type, args, obj) {
            var selected = args[0],
            cfgSelected = DEF_CFG.SELECTED.key;

            if (selected) {
                if (Rui.isString(selected)) {
                    this.cfg.setProperty(cfgSelected, this._parseDates(selected), true);
                }
            }
            if (!this._selectedDates) {
                this._selectedDates = this.cfg.getProperty(cfgSelected);
            }
        },

        /**
        * options 파라미터 사용시 수행하는 메소드
        * @method configOptions
        * @protected
        */
        configOptions: function(type, args, obj) {
            this.Options[type.toUpperCase()] = args[0];
        },

        /**
        * locale 파라미터 사용시 수행하는 메소드
        * @method configLocale
        * @protected
        */
        configLocale: function(type, args, obj) {
            this.Locale[type.toUpperCase()] = args[0];

            this.cfg.refireEvent(DEF_CFG.LOCALE_MONTHS.key);
            this.cfg.refireEvent(DEF_CFG.LOCALE_WEEKDAYS.key);
        },

        /**
        * locale 길이에 따라 수행하는 메소드
        * @method configLocaleValues
        * @protected
        */
        configLocaleValues: function(type, args, obj) {

            type = type.toLowerCase();

            var val = args[0],
            cfg = this.cfg,
            Locale = this.Locale;

            switch (type) {
                case DEF_CFG.LOCALE_MONTHS.key:
                    switch (val) {
                        case LCalendar.SHORT:
                            Locale.LOCALE_MONTHS = cfg.getProperty(DEF_CFG.MONTHS_SHORT.key).concat();
                            break;
                        case LCalendar.LONG:
                             Locale.LOCALE_MONTHS = cfg.getProperty(DEF_CFG.MONTHS_LONG.key).concat();
                            break;
                    }
                    break;
                case DEF_CFG.LOCALE_WEEKDAYS.key:
                    switch (val) {
                        case LCalendar.ONE_CHAR:
                            Locale.LOCALE_WEEKDAYS = cfg.getProperty(DEF_CFG.WEEKDAYS_1CHAR.key).concat();
                            break;
                        case LCalendar.SHORT:
                            Locale.LOCALE_WEEKDAYS = cfg.getProperty(DEF_CFG.WEEKDAYS_SHORT.key).concat();
                            break;
                        case LCalendar.MEDIUM:
                            Locale.LOCALE_WEEKDAYS = cfg.getProperty(DEF_CFG.WEEKDAYS_MEDIUM.key).concat();
                            break;
                        case LCalendar.LONG:
                            Locale.LOCALE_WEEKDAYS = cfg.getProperty(DEF_CFG.WEEKDAYS_LONG.key).concat();
                            break;
                    }

                    var START_WEEKDAY = cfg.getProperty(DEF_CFG.START_WEEKDAY.key);

                    if (START_WEEKDAY > 0) {
                        for (var w = 0; w < START_WEEKDAY; ++w) {
                            Locale.LOCALE_WEEKDAYS.push(Locale.LOCALE_WEEKDAYS.shift());
                        }
                    }
                    break;
            }
        },

        /**
        * navigator 파라미터 사용시 수행하는 메소드
        * @method configNavigator
        * @protected
        */
        configNavigator: function(type, args, obj) {
            var val = args[0];
            if (Rui.ui.calendar.LCalendarNavigator && (val === true || Rui.isObject(val))) {
                if (!this.oNavigator) {
                    this.oNavigator = new Rui.ui.calendar.LCalendarNavigator(this);
                    // Cleanup DOM Refs/Events before innerHTML is removed.
                    this.beforeRenderEvent.on(function() {
                        if (!this.pages) {
                            this.oNavigator.erase();
                        }
                    }, this, true);
                }
            } else {
                if (this.oNavigator) {
                    this.oNavigator.destroy();
                    this.oNavigator = null;
                }
            }
        },

        /**
        * styles을 초기화하는 메소드
        * @method initStyles
        * @protected
        */
        initStyles: function() {

            var defStyle = LCalendar._STYLES;

            this.Style = {
                /**
                * @property Style.CSS_ROW_HEADER
                * @private
                */
                CSS_ROW_HEADER: defStyle.CSS_ROW_HEADER,
                /**
                * @property Style.CSS_ROW_FOOTER
                * @private
                */
                CSS_ROW_FOOTER: defStyle.CSS_ROW_FOOTER,
                /**
                * @property Style.CSS_CELL
                * @private
                */
                CSS_CELL: defStyle.CSS_CELL,
                /**
                * @property Style.CSS_CELL_SELECTOR
                * @private
                */
                CSS_CELL_SELECTOR: defStyle.CSS_CELL_SELECTOR,
                /**
                * @property Style.CSS_CELL_SELECTED
                * @private
                */
                CSS_CELL_SELECTED: defStyle.CSS_CELL_SELECTED,
                /**
                * @property Style.CSS_CELL_SELECTABLE
                * @private
                */
                CSS_CELL_SELECTABLE: defStyle.CSS_CELL_SELECTABLE,
                /**
                * @property Style.CSS_CELL_RESTRICTED
                * @private
                */
                CSS_CELL_RESTRICTED: defStyle.CSS_CELL_RESTRICTED,
                /**
                * @property Style.CSS_CELL_TODAY
                * @private
                */
                CSS_CELL_TODAY: defStyle.CSS_CELL_TODAY,
                /**
                * @property Style.CSS_CELL_OOM
                * @private
                */
                CSS_CELL_OOM: defStyle.CSS_CELL_OOM,
                /**
                * @property Style.CSS_CELL_OOB
                * @private
                */
                CSS_CELL_OOB: defStyle.CSS_CELL_OOB,
                /**
                * @property Style.CSS_HEADER
                * @private
                */
                CSS_HEADER: defStyle.CSS_HEADER,
                /**
                * @property Style.CSS_HEADER_TEXT
                * @private
                */
                CSS_HEADER_TEXT: defStyle.CSS_HEADER_TEXT,
                /**
                * @property Style.CSS_BODY
                * @private
                */
                CSS_BODY: defStyle.CSS_BODY,
                /**
                * @property Style.CSS_WEEKDAY_CELL
                * @private
                */
                CSS_WEEKDAY_CELL: defStyle.CSS_WEEKDAY_CELL,
                /**
                * @property Style.CSS_WEEKDAY_ROW
                * @private
                */
                CSS_WEEKDAY_ROW: defStyle.CSS_WEEKDAY_ROW,
                /**
                * @property Style.CSS_FOOTER
                * @private
                */
                CSS_FOOTER: defStyle.CSS_FOOTER,
                /**
                * @property Style.CSS_CALENDAR
                * @private
                */
                CSS_CALENDAR: defStyle.CSS_CALENDAR,
                /**
                * @property Style.CSS_SINGLE
                * @private
                */
                CSS_SINGLE: defStyle.CSS_SINGLE,
                /**
                * @property Style.CSS_CONTAINER
                * @private
                */
                CSS_CONTAINER: defStyle.CSS_CONTAINER,
                /**
                * @property Style.CSS_NAV_YEAR_LEFT
                * @private
                */
                CSS_NAV_YEAR_LEFT: defStyle.CSS_NAV_YEAR_LEFT,
                /**
                * @property Style.CSS_NAV_YEAR_RIGHT
                * @private
                */
                CSS_NAV_YEAR_RIGHT: defStyle.CSS_NAV_YEAR_RIGHT,
                /**
                * @property Style.CSS_NAV_LEFT
                * @private
                */
                CSS_NAV_LEFT: defStyle.CSS_NAV_LEFT,
                /**
                * @property Style.CSS_NAV_RIGHT
                * @private
                */
                CSS_NAV_RIGHT: defStyle.CSS_NAV_RIGHT,
                /**
                * @property Style.CSS_NAV
                * @private
                */
                CSS_NAV: defStyle.CSS_NAV,
                /**
                * @property Style.CSS_CLOSE
                * @private
                */
                CSS_CLOSE: defStyle.CSS_CLOSE,
                /**
                * @property Style.CSS_CELL_TOP
                * @private
                */
                CSS_CELL_TOP: defStyle.CSS_CELL_TOP,
                /**
                * @property Style.CSS_CELL_LEFT
                * @private
                */
                CSS_CELL_LEFT: defStyle.CSS_CELL_LEFT,
                /**
                * @property Style.CSS_CELL_RIGHT
                * @private
                */
                CSS_CELL_RIGHT: defStyle.CSS_CELL_RIGHT,
                /**
                * @property Style.CSS_CELL_BOTTOM
                * @private
                */
                CSS_CELL_BOTTOM: defStyle.CSS_CELL_BOTTOM,
                /**
                * @property Style.CSS_CELL_HOVER
                * @private
                */
                CSS_CELL_HOVER: defStyle.CSS_CELL_HOVER,
                /**
                * @property Style.CSS_CELL_HIGHLIGHT1
                * @private
                */
                CSS_CELL_HIGHLIGHT1: defStyle.CSS_CELL_HIGHLIGHT1,
                /**
                * @property Style.CSS_CELL_HIGHLIGHT2
                * @private
                */
                CSS_CELL_HIGHLIGHT2: defStyle.CSS_CELL_HIGHLIGHT2,
                /**
                * @property Style.CSS_CELL_HIGHLIGHT3
                * @private
                */
                CSS_CELL_HIGHLIGHT3: defStyle.CSS_CELL_HIGHLIGHT3,
                /**
                * @property Style.CSS_CELL_HIGHLIGHT4
                * @private
                */
                CSS_CELL_HIGHLIGHT4: defStyle.CSS_CELL_HIGHLIGHT4
            };
        },

        /**
        * Builds the date label that will be displayed in the calendar header or
        * footer, depending on configuration.
        * @method buildMonthLabel
        * @protected
        * @return   {String}    The formatted calendar month label
        */
        buildMonthLabel: function() {
            return this._buildMonthLabel(this.cfg.getProperty(DEF_CFG.PAGEDATE.key));
        },

        /**
        * Helper method, to format a Month Year string, given a JavaScript Date, based on the 
        * LCalendar localization settings
        * 
        * @method _buildMonthLabel
        * @private
        * @param {Date} date
        * @return {String} Formated month, year string
        */
        _buildMonthLabel: function(date) {
            var m = this.Locale.LOCALE_MONTHS[date.getMonth()],
                mLabel = this.Locale.MY_LABEL_MONTH_SUFFIX,
                y = date.getFullYear(),
                yLabel = this.Locale.MY_LABEL_YEAR_SUFFIX;
            if (this.Locale.MY_LABEL_MONTH_POSITION == 2 || this.Locale.MY_LABEL_YEAR_POSITION == 1) {
                return '<span class="year">' + y + '</span><span class="year-suffix">' + yLabel + '</span><span class="month">' + m + '</span><span class="month-suffix">' + mLabel + '</span>';
            } else {
                return '<span class="month">' + m + '</span><span class="month-suffix">' + mLabel + '</span><span class="year">' + y + '</span><span class="year-suffix">' + yLabel + '</span>';
            }
        },

        /**
        * Helper method, to format a Month Year string, given a JavaScript Date, based on the 
        * LCalendar localization settings
        * 
        * @method _buildYearLabel
        * @private
        * @param {Date} date
        * @return {String} Formated month, year string
        */
        _buildYearLabel: function(date) {
            var m = this.Locale.LOCALE_MONTHS[date.getMonth()],
                mLabel = this.Locale.MY_LABEL_MONTH_SUFFIX,
                y = date.getFullYear(),
                yLabel = this.Locale.MY_LABEL_YEAR_SUFFIX;
            if (this.Locale.MY_LABEL_MONTH_POSITION == 2 || this.Locale.MY_LABEL_YEAR_POSITION == 1) {
                return '<span class="year">' + y + '</span><span class="year-suffix">' + yLabel + '</span><span class="month">' + m + '</span><span class="month-suffix">' + mLabel + '</span>';
            } else {
                return '<span class="month">' + m + '</span><span class="month-suffix">' + mLabel + '</span><span class="year">' + y + '</span><span class="year-suffix">' + yLabel + '</span>';
            }
        },

        /**
        * Builds the date digit that will be displayed in calendar cells
        * @method buildDayLabel
        * @protected
        * @param {Date} workingDate The current working date
        * @return   {String}    The formatted day label
        */
        buildDayLabel: function(workingDate) {
            return workingDate.getDate();
        },

        /**
        * Creates the title bar element and adds it to LCalendar container DIV
        * @method createTitleBar
        * @protected
        * @param {String} strTitle The title to display in the title bar
        * @return The title bar element
        */
        createTitleBar: function(strTitle) {
            var tDiv = Dom.getElementsByClassName(Rui.ui.calendar.LCalendarGroup.CSS_2UPTITLE, 'div', this.oDomContainer)[0] || document.createElement('div');
            tDiv.className = Rui.ui.calendar.LCalendarGroup.CSS_2UPTITLE;
            tDiv.innerHTML = strTitle;
            this.oDomContainer.insertBefore(tDiv, this.oDomContainer.firstChild);
            Dom.addClass(this.oDomContainer, 'withtitle');
            return tDiv;
        },

        /**
        * Removes the title bar element from the DOM
        * @method removeTitleBar
        * @protected
        */
        removeTitleBar: function() {
            var tDiv = Dom.getElementsByClassName(Rui.ui.calendar.LCalendarGroup.CSS_2UPTITLE, 'div', this.oDomContainer)[0] || null;
            if (tDiv) {
                Event.purgeElement(tDiv);
                this.oDomContainer.removeChild(tDiv);
            }
            Dom.removeClass(this.oDomContainer, 'withtitle');
        },

        /**
        * Creates the close button HTML element and adds it to LCalendar container DIV
        * @method createCloseButton
        * @protected
        * @return The close HTML element created
        */
        createCloseButton: function() {
            var cssClose = Rui.ui.calendar.LCalendarGroup.CSS_2UPCLOSE,
            DEPR_CLOSE_PATH = 'us/my/bn/x_d.gif',
            lnk = Dom.getElementsByClassName('link-close', 'a', this.oDomContainer)[0],
            strings = this.cfg.getProperty(DEF_CFG.STRINGS.key),
            closeStr = (strings && strings.close) ? strings.close : '';

            if (!lnk) {
                lnk = document.createElement('a');
                Event.addListener(lnk, 'click', function(e, cal) {
                    cal.hide();
                    Event.preventDefault(e);
                }, this);
            }

            lnk.href = '#';
            lnk.className = 'link-close';

            if (LCalendar.IMG_ROOT !== null) {
                var img = Dom.getElementsByClassName(cssClose, 'img', lnk)[0] || document.createElement('img');
                img.src = LCalendar.IMG_ROOT + DEPR_CLOSE_PATH;
                img.className = cssClose;
                lnk.appendChild(img);
            } else {
                lnk.innerHTML = '<span class="' + cssClose + ' ' + this.Style.CSS_CLOSE + '">' + closeStr + '</span>';
            }
            this.oDomContainer.appendChild(lnk);

            return lnk;
        },

        /**
        * Removes the close button HTML element from the DOM
        * @method removeCloseButton
        * @protected
        */
        removeCloseButton: function() {
            var btn = Dom.getElementsByClassName('link-close', 'a', this.oDomContainer)[0] || null;
            if (btn) {
                Event.purgeElement(btn);
                this.oDomContainer.removeChild(btn);
            }
        },

        /**
        * Renders the calendar header.
        * @method renderHeader
        * @private
        * @param {Array}    html    The current working HTML array
        * @return {Array} The current working HTML array
        */
        renderHeader: function(html) {
            var colSpan = 7,
                DEPR_NAV_LEFT = 'us/tr/callt.gif',
                DEPR_NAV_RIGHT = 'us/tr/calrt.gif',
                cfg = this.cfg,
                pageDate = cfg.getProperty(DEF_CFG.PAGEDATE.key),
                strings = cfg.getProperty(DEF_CFG.STRINGS.key),
                prevStr = (strings && strings.previousMonth) ? strings.previousMonth : '',
                nextStr = (strings && strings.nextMonth) ? strings.nextMonth : '',
                monthLabel,
                prevYearStr = (strings && strings.previousYear) ? strings.previousYear : '',
                nextYearStr = (strings && strings.nextYear) ? strings.nextYear : '',
                yearLabel;

            if (cfg.getProperty(DEF_CFG.SHOW_WEEK_HEADER.key)) {
                colSpan += 1;
            }

            if (cfg.getProperty(DEF_CFG.SHOW_WEEK_FOOTER.key)) {
                colSpan += 1;
            }

            html[html.length] = '<thead>';
            html[html.length] = '<tr>';
            html[html.length] = '<th colspan="' + colSpan + '" class="' + this.Style.CSS_HEADER_TEXT + '">';
            html[html.length] = '<div class="' + this.Style.CSS_HEADER + '">';

            var renderLeft, renderRight = false;

            if (this.parent) {
                if (this.index === 0) {
                    renderLeft = true;
                }
                if (this.index == (this.parent.cfg.getProperty('pages') - 1)) {
                    renderRight = true;
                }
            } else {
                renderLeft = true;
                renderRight = true;
            }

            if (renderLeft) {
                monthLabel = this._buildMonthLabel(Rui.util.LDate.subtract(pageDate, Rui.util.LDate.MONTH, 1));
                yearLabel = this._buildYearLabel(Rui.util.LDate.subtract(pageDate, Rui.util.LDate.YEAR, 1));

                var leftArrow = cfg.getProperty(DEF_CFG.NAV_ARROW_LEFT.key);
                // Check for deprecated customization - If someone set IMG_ROOT, but didn't set NAV_ARROW_LEFT, then set NAV_ARROW_LEFT to the old deprecated value
                if (leftArrow === null && LCalendar.IMG_ROOT !== null) {
                    leftArrow = LCalendar.IMG_ROOT + DEPR_NAV_LEFT;
                }
                var leftStyle = (leftArrow === null) ? '' : ' style="background-image:url(' + leftArrow + ')"';
                var navLeftHtml = '<a class="' + this.Style.CSS_NAV_YEAR_LEFT + '"' + leftStyle + ' href="#" id="' + this.id + '_calnavyearleft"'+(Rui.useAccessibility() ? "role=\"button\"" : "")+'>' + prevYearStr + ' (' + yearLabel + ')' + '</a>';
                navLeftHtml += '<a class="' + this.Style.CSS_NAV_LEFT + '"' + leftStyle + ' href="#" id="' + this.id + '_calnavleft"'+(Rui.useAccessibility() ? "role=\"button\"" : "")+'>' + prevStr + ' (' + monthLabel + ')' + '</a>';
                html[html.length] = navLeftHtml;
            }

            var lbl = this.buildMonthLabel();
            var cal = this.parent || this;
            if (cal.cfg.getProperty('navigator')) {
                lbl = '<a class=\"' + this.Style.CSS_NAV + '\" href=\"#\" id="' + this.id + '_calnav"'+(Rui.useAccessibility() ? 'role=\"heading\"' : '')+'>' + lbl + '</a>';
            }
            html[html.length] = lbl;

            if (renderRight) {
                monthLabel = this._buildMonthLabel(Rui.util.LDate.add(pageDate, Rui.util.LDate.MONTH, 1));
                yearLabel = this._buildYearLabel(Rui.util.LDate.add(pageDate, Rui.util.LDate.YEAR, 1));

                var rightArrow = cfg.getProperty(DEF_CFG.NAV_ARROW_RIGHT.key);
                if (rightArrow === null && LCalendar.IMG_ROOT !== null) {
                    rightArrow = LCalendar.IMG_ROOT + DEPR_NAV_RIGHT;
                }
                var rightStyle = (rightArrow === null) ? '' : ' style="background-image:url(' + rightArrow + ')"';
                var navRightHtml = '<a class="' + this.Style.CSS_NAV_RIGHT + '"' + rightStyle + ' href="#" id="' + this.id + '_calnavright"'+(Rui.useAccessibility() ? "role=\"button\"" : "")+'>' + nextStr + ' (' + monthLabel + ')' + '</a>';
                navRightHtml += '<a class="' + this.Style.CSS_NAV_YEAR_RIGHT + '"' + rightStyle + ' href="#" id="' + this.id + '_calnavryearight"'+(Rui.useAccessibility() ? "role=\"button\"" : "")+'>' + nextYearStr + ' (' + yearLabel + ')' + '</a>';
                html[html.length] = navRightHtml;
            }

            html[html.length] = '</div>\n</th>\n</tr>';

            if (cfg.getProperty(DEF_CFG.SHOW_WEEKDAYS.key)) {
                html = this.buildWeekdays(html);
            }

            html[html.length] = '</thead>';

            return html;
        },

        /**
        * Renders the LCalendar's weekday headers.
        * @method buildWeekdays
        * @private
        * @param {Array}    html    The current working HTML array
        * @return {Array} The current working HTML array
        */
        buildWeekdays: function(html) {

            html[html.length] = '<tr class="' + this.Style.CSS_WEEKDAY_ROW + '">';

            if (this.cfg.getProperty(DEF_CFG.SHOW_WEEK_HEADER.key)) {
                html[html.length] = '<th>&#160;</th>';
            }

            for (var i = 0; i < this.Locale.LOCALE_WEEKDAYS.length; ++i) {
                html[html.length] = '<th class="L-calweekdaycell">' + this.Locale.LOCALE_WEEKDAYS[i] + '</th>';
            }

            if (this.cfg.getProperty(DEF_CFG.SHOW_WEEK_FOOTER.key)) {
                html[html.length] = '<th>&#160;</th>';
            }

            html[html.length] = '</tr>';

            return html;
        },

        /**
        * Renders the calendar body.
        * @method renderBody
        * @private
        * @param {Date} workingDate The current working Date being used for the render process
        * @param {Array}    html    The current working HTML array
        * @return {Array} The current working HTML array
        */
        renderBody: function(workingDate, html) {

            var startDay = this.cfg.getProperty(DEF_CFG.START_WEEKDAY.key);

            this.preMonthDays = workingDate.getDay();
            if (startDay > 0) {
                this.preMonthDays -= startDay;
            }
            if (this.preMonthDays < 0) {
                this.preMonthDays += 7;
            }

            this.monthDays = Rui.util.LDate.getLastDayOfMonth(workingDate).getDate();
            this.postMonthDays = LCalendar.DISPLAY_DAYS - this.preMonthDays - this.monthDays;


            workingDate = Rui.util.LDate.subtract(workingDate, Rui.util.LDate.DAY, this.preMonthDays);

            var weekNum,
            weekClass,
            weekPrefix = 'w',
            cellPrefix = '_cell',
            workingDayPrefix = 'wd',
            dayPrefix = 'd',
            cellRenderers,
            renderer,
            t = this.today,
            cfg = this.cfg,
            todayYear = t.getFullYear(),
            todayMonth = t.getMonth(),
            todayDate = t.getDate(),
            useDate = cfg.getProperty(DEF_CFG.PAGEDATE.key),
            hideBlankWeeks = cfg.getProperty(DEF_CFG.HIDE_BLANK_WEEKS.key),
            showWeekFooter = cfg.getProperty(DEF_CFG.SHOW_WEEK_FOOTER.key),
            showWeekHeader = cfg.getProperty(DEF_CFG.SHOW_WEEK_HEADER.key),
            mindate = cfg.getProperty(DEF_CFG.MINDATE.key),
            maxdate = cfg.getProperty(DEF_CFG.MAXDATE.key);

            if (mindate) {
                mindate = Rui.util.LDate.clearTime(mindate);
            }
            if (maxdate) {
                maxdate = Rui.util.LDate.clearTime(maxdate);
            }

            html[html.length] = '<tbody class="m' + (useDate.getMonth() + 1) + ' ' + this.Style.CSS_BODY + '">';

            var i = 0,
            tempDiv = document.createElement('div'),
            cell = document.createElement('td');

            tempDiv.appendChild(cell);

            var cal = this.parent || this;

            for (var r = 0; r < 6; r++) {
                weekNum = Rui.util.LDate.getWeekNumber(workingDate, startDay);
                weekClass = weekPrefix + weekNum;

                // Local OOM check for performance, since we already have pagedate
                if (r !== 0 && hideBlankWeeks === true && workingDate.getMonth() != useDate.getMonth()) {
                    break;
                } else {
                    html[html.length] = '<tr class="' + weekClass + '">';

                    if (showWeekHeader) { html = this.renderRowHeader(weekNum, html); }

                    for (var d = 0; d < 7; d++) { // Render actual days

                        cellRenderers = [];

                        this.clearElement(cell);
                        cell.className = this.Style.CSS_CELL;
                        cell.id = this.id + cellPrefix + i;

                        if (workingDate.getDate() == todayDate &&
                        workingDate.getMonth() == todayMonth &&
                        workingDate.getFullYear() == todayYear) {
                            cellRenderers[cellRenderers.length] = cal.renderCellStyleToday;
                        }

                        var workingArray = [workingDate.getFullYear(), workingDate.getMonth() + 1, workingDate.getDate()];
                        this.cellDates[this.cellDates.length] = workingArray; // Add this date to cellDates

                        // Local OOM check for performance, since we already have pagedate
                        if (workingDate.getMonth() != useDate.getMonth()) {
                            cellRenderers[cellRenderers.length] = cal.renderCellNotThisMonth;
                        } else {
                            Dom.addClass(cell, workingDayPrefix + workingDate.getDay());
                            Dom.addClass(cell, dayPrefix + workingDate.getDate());

                            for (var s = 0; s < this.renderStack.length; ++s) {

                                renderer = null;

                                var rArray = this.renderStack[s],
                                type = rArray[0],
                                month,
                                day,
                                year;

                                switch (type) {
                                    case LCalendar.DATE:
                                        month = rArray[1][1];
                                        day = rArray[1][2];
                                        year = rArray[1][0];

                                        if (workingDate.getMonth() + 1 == month && workingDate.getDate() == day && workingDate.getFullYear() == year) {
                                            renderer = rArray[2];
                                            this.renderStack.splice(s, 1);
                                        }
                                        break;
                                    case LCalendar.MONTH_DAY:
                                        month = rArray[1][0];
                                        day = rArray[1][1];

                                        if (workingDate.getMonth() + 1 == month && workingDate.getDate() == day) {
                                            renderer = rArray[2];
                                            this.renderStack.splice(s, 1);
                                        }
                                        break;
                                    case LCalendar.RANGE:
                                        var date1 = rArray[1][0],
                                        date2 = rArray[1][1],
                                        d1month = date1[1],
                                        d1day = date1[2],
                                        d1year = date1[0],
                                        d1 = Rui.util.LDate.getDate(d1year, d1month - 1, d1day),
                                        d2month = date2[1],
                                        d2day = date2[2],
                                        d2year = date2[0],
                                        d2 = Rui.util.LDate.getDate(d2year, d2month - 1, d2day);

                                        if (workingDate.getTime() >= d1.getTime() && workingDate.getTime() <= d2.getTime()) {
                                            renderer = rArray[2];

                                            if (workingDate.getTime() == d2.getTime()) {
                                                this.renderStack.splice(s, 1);
                                            }
                                        }
                                        break;
                                    case LCalendar.WEEKDAY:
                                        var weekday = rArray[1][0];
                                        if (workingDate.getDay() + 1 == weekday) {
                                            renderer = rArray[2];
                                        }
                                        break;
                                    case LCalendar.MONTH:
                                        month = rArray[1][0];
                                        if (workingDate.getMonth() + 1 == month) {
                                            renderer = rArray[2];
                                        }
                                        break;
                                }

                                if (renderer) {
                                    cellRenderers[cellRenderers.length] = renderer;
                                }
                            }

                        }

                        if (this._indexOfSelectedFieldArray(workingArray) > -1) {
                            cellRenderers[cellRenderers.length] = cal.renderCellStyleSelected;
                        }

                        if ((mindate && (workingDate.getTime() < mindate.getTime())) ||
                            (maxdate && (workingDate.getTime() > maxdate.getTime())) ) {
                            cellRenderers[cellRenderers.length] = cal.renderOutOfBoundsDate;
                        } else {
                            cellRenderers[cellRenderers.length] = cal.styleCellDefault;
                            cellRenderers[cellRenderers.length] = cal.renderCellDefault;
                        }

                        var eventParam = {date:workingDate, pageDate: useDate, cell: cell, stop: false};
                        this.renderCellEvent.fire(eventParam);

                        if(eventParam.stop !== true) {
                            for (var x = 0; x < cellRenderers.length; ++x) {
                                if (cellRenderers[x].call(cal, workingDate, cell) == LCalendar.STOP_RENDER) {
                                    break;
                                }
                            }
                        }
                        
                        workingDate.setTime(workingDate.getTime() + Rui.util.LDate.ONE_DAY_MS);
                        // Just in case we crossed DST/Summertime boundaries
                        workingDate = Rui.util.LDate.clearTime(workingDate);

                        if (i >= 0 && i <= 6) {
                            Dom.addClass(cell, this.Style.CSS_CELL_TOP);
                        }
                        if ((i % 7) === 0) {
                            Dom.addClass(cell, this.Style.CSS_CELL_LEFT);
                        }
                        if (((i + 1) % 7) === 0) {
                            Dom.addClass(cell, this.Style.CSS_CELL_RIGHT);
                        }

                        var postDays = this.postMonthDays;
                        if (hideBlankWeeks && postDays >= 7) {
                            var blankWeeks = Math.floor(postDays / 7);
                            for (var p = 0; p < blankWeeks; ++p) {
                                postDays -= 7;
                            }
                        }

                        if (i >= ((this.preMonthDays + postDays + this.monthDays) - 7)) {
                            Dom.addClass(cell, this.Style.CSS_CELL_BOTTOM);
                        }
                        
                        if(Rui.useAccessibility()){
                            cell.setAttribute('role', 'gridcell');
                        }

                        html[html.length] = tempDiv.innerHTML;
                        i++;
                    }

                    if (showWeekFooter) { html = this.renderRowFooter(weekNum, html); }

                    html[html.length] = '</tr>';
                }
            }

            html[html.length] = '</tbody>';

            return html;
        },

        /**
        * Renders the calendar footer. In the default implementation, there is
        * no footer.
        * @method renderFooter
        * @private
        * @param {Array}    html    The current working HTML array
        * @return {Array} The current working HTML array
        */
        renderFooter: function(html) { return html; },

        /**
        * Renders the calendar after it has been configured. The render() method has a specific call chain that will execute
        * when the method is called: renderHeader, renderBody, renderFooter.
        * Refer to the documentation for those methods for information on 
        * individual render tasks.
        * @method render
        */
        render: function() {
            this.beforeRenderEvent.fire();

            // Find starting day of the current month
            var workingDate = Rui.util.LDate.getFirstDayOfMonth(this.cfg.getProperty(DEF_CFG.PAGEDATE.key));

            this.resetRenderers();
            this.cellDates.length = 0;

            Event.purgeElement(this.oDomContainer, true);

            var html = [];
            
            html[html.length] = '<table cellSpacing="0" class="' + this.Style.CSS_CALENDAR + ' y' + workingDate.getFullYear() + '" id="' + this.id + '-table" '+(Rui.useAccessibility() ? 'role="grid"' : '')+'>';
            html = this.renderHeader(html);
            html = this.renderBody(workingDate, html);
            html = this.renderFooter(html);
            html[html.length] = '</table>';

            this.oDomContainer.innerHTML = html.join('\n');

            this.applyListeners();
            this.cells = this.oDomContainer.getElementsByTagName('td');

            this.cfg.refireEvent(DEF_CFG.TITLE.key);
            this.cfg.refireEvent(DEF_CFG.CLOSE.key);
            this.cfg.refireEvent(DEF_CFG.IFRAME.key);

            this.renderEvent.fire();
        },

        /**
        * Applies the LCalendar's DOM listeners to applicable elements.
        * @method applyListeners
        * @private
        */
        applyListeners: function() {
            var root = this.oDomContainer,
            cal = this.parent || this,
            anchor = 'a',
            click = 'click';

            var linkLeft = Dom.getElementsByClassName(this.Style.CSS_NAV_LEFT, anchor, root),
            linkRight = Dom.getElementsByClassName(this.Style.CSS_NAV_RIGHT, anchor, root),
            yearLinkLeft = Dom.getElementsByClassName(this.Style.CSS_NAV_YEAR_LEFT, anchor, root),
            yearLinkRight = Dom.getElementsByClassName(this.Style.CSS_NAV_YEAR_RIGHT, anchor, root);

            if (linkLeft && linkLeft.length > 0) {
                this.linkLeft = linkLeft[0];
                Event.addListener(this.linkLeft, click, this.doPreviousMonthNav, cal, true);
            }

            if (linkRight && linkRight.length > 0) {
                this.linkRight = linkRight[0];
                Event.addListener(this.linkRight, click, this.doNextMonthNav, cal, true);
            }

            if (yearLinkLeft && yearLinkLeft.length > 0) {
                this.yearLinkLeft = yearLinkLeft[0];
                Event.addListener(this.yearLinkLeft, click, this.doPreviousYearNav, cal, true);
            }

            if (yearLinkRight && yearLinkRight.length > 0) {
                this.yearLinkRight = yearLinkRight[0];
                Event.addListener(this.yearLinkRight, click, this.doNextYearNav, cal, true);
            }

            if (cal.cfg.getProperty('navigator') !== null) {
                this.applyNavListeners();
            }

            if (this.domEventMap) {
                var el, elements;
                for (var cls in this.domEventMap) {
                    if (Lang.hasOwnProperty(this.domEventMap, cls)) {
                        var items = this.domEventMap[cls];

                        if (!(items instanceof Array)) {
                            items = [items];
                        }

                        for (var i = 0; i < items.length; i++) {
                            var item = items[i];
                            elements = Dom.getElementsByClassName(cls, item.tag, this.oDomContainer);

                            for (var c = 0; c < elements.length; c++) {
                                el = elements[c];
                                Event.addListener(el, item.event, item.handler, item.scope, item.correct);
                            }
                        }
                    }
                }
            }
            //grid의 blur 전에 발생 시키기 위해 body에 event 탑제 => LEditorGridPanel에서 view.on('blur'...삭제로 원복
            //Event.addListener(Rui.getBody(true), 'mousedown', this.doSelectCell, this);
            Event.addListener(this.oDomContainer, 'click', this.doSelectCell, this);
            Event.addListener(this.oDomContainer, 'mouseover', this.doCellMouseOver, this);
            Event.addListener(this.oDomContainer, 'mouseout', this.doCellMouseOut, this);
        },

        applyNavListeners: function() {
            var calParent = this.parent || this,
            cal = this,
            navBtns = Dom.getElementsByClassName(this.Style.CSS_NAV, 'a', this.oDomContainer);

            if (navBtns.length > 0) {

                Event.addListener(navBtns, 'click', function(e, obj) {
                    if(cal.beforeChangePageEvent.fire(this, e) == false) return;
                    var target = Event.getTarget(e);
                    // this == navBtn
                    if (this === target || Dom.isAncestor(this, target)) {
                        Event.preventDefault(e);
                    }
                    var navigator = calParent.oNavigator;
                    if (navigator) {
                        var pgdate = cal.cfg.getProperty('pagedate');
                        navigator.setYear(pgdate.getFullYear());
                        navigator.setMonth(pgdate.getMonth());
                        navigator.show();
                    }
                });
            }
        },

        /**
        * Retrieves the Date object for the specified LCalendar cell
        * @method getDateByCellId
        * @param {String}   id  The id of the cell
        * @return {Date} The Date object for the specified LCalendar cell
        */
        getDateByCellId: function(id) {
            var date = this.getDateFieldsByCellId(id);
            return (date) ? Rui.util.LDate.getDate(date[0], date[1] - 1, date[2]) : null;
        },

        /**
        * Retrieves the Date object for the specified LCalendar cell
        * @method getDateFieldsByCellId
        * @param {String}   id  The id of the cell
        * @return {Array}   The array of Date fields for the specified LCalendar cell
        */
        getDateFieldsByCellId: function(id) {
            id = this.getIndexFromId(id);
            return (id > -1) ? this.cellDates[id] : null;
        },

        /**
        * Find the LCalendar's cell index for a given date.
        * If the date is not found, the method returns -1.
        * <p>
        * The returned index can be used to lookup the cell HTMLElement  
        * using the LCalendar's cells array or passed to selectCell to select 
        * cells by index. 
        * </p>
        *
        * See <a href="#cells">cells</a>, <a href="#selectCell">selectCell</a>.
        *
        * @method getCellIndex
        * @param {Date} date JavaScript Date object, for which to find a cell index.
        * @return {Number} The index of the date in Calendars cellDates/cells arrays, or -1 if the date 
        * is not on the curently rendered LCalendar page.
        */
        getCellIndex: function(date) {
            var idx = -1;
            if (date) {
                var m = date.getMonth(),
                y = date.getFullYear(),
                d = date.getDate(),
                dates = this.cellDates;

                for (var i = 0; i < dates.length; ++i) {
                    var cellDate = dates[i];
                    if (cellDate[0] === y && cellDate[1] === m + 1 && cellDate[2] === d) {
                        idx = i;
                        break;
                    }
                }
            }
            return idx;
        },

        /**
        * Given the id used to mark each LCalendar cell, this method
        * extracts the index number from the id.
        * 
        * @param {String} strId The cell id
        * @return {Number} The index of the cell, or -1 if id does not contain an index number
        */
        getIndexFromId: function(strId) {
            var idx = -1,
            li = strId.lastIndexOf('_cell');

            if (li > -1) {
                idx = parseInt(strId.substring(li + 5), 10);
            }

            return idx;
        },

        // BEGIN BUILT-IN TABLE CELL RENDERERS

        /**
        * Renders a cell that falls before the minimum date or after the maximum date.
        * widget class.
        * @method renderOutOfBoundsDate
        * @private
        * @param {Date}                 workingDate     The current working Date object being used to generate the calendar
        * @param {HTMLTableCellElement} cell            The current working cell in the calendar
        * @return {String} Rui.ui.calendar.LCalendar.STOP_RENDER if rendering should stop with this style, null or nothing if rendering
        *           should not be terminated
        */
        renderOutOfBoundsDate: function(workingDate, cell) {
            Dom.addClass(cell, this.Style.CSS_CELL_OOB);
            cell.innerHTML = workingDate.getDate();
            return LCalendar.STOP_RENDER;
        },

        /**
        * Renders the row header for a week.
        * @method renderRowHeader
        * @private
        * @param {Number}   weekNum The week number of the current row
        * @param {Array}    cell    The current working HTML array
        */
        renderRowHeader: function(weekNum, html) {
            html[html.length] = '<th class="L-calrowhead">' + weekNum + '</th>';
            return html;
        },

        /**
        * Renders the row footer for a week.
        * @method renderRowFooter
        * @private
        * @param {Number}   weekNum The week number of the current row
        * @param {Array}    cell    The current working HTML array
        */
        renderRowFooter: function(weekNum, html) {
            html[html.length] = '<th class="L-calrowfoot">' + weekNum + '</th>';
            return html;
        },

        /**
        * Renders a single standard calendar cell in the calendar widget table.
        * All logic for determining how a standard default cell will be rendered is 
        * encapsulated in this method, and must be accounted for when extending the
        * widget class.
        * @method renderCellDefault
        * @private
        * @param {Date}                 workingDate     The current working Date object being used to generate the calendar
        * @param {HTMLTableCellElement} cell            The current working cell in the calendar
        */
        renderCellDefault: function(workingDate, cell) {
            cell.innerHTML = '<a href="#" class="' + this.Style.CSS_CELL_SELECTOR + '">' + this.buildDayLabel(workingDate) + "</a>";
        },

        /**
        * Styles a selectable cell.
        * @method styleCellDefault
        * @private
        * @param {Date}                 workingDate     The current working Date object being used to generate the calendar
        * @param {HTMLTableCellElement} cell            The current working cell in the calendar
        */
        styleCellDefault: function(workingDate, cell) {
            Dom.addClass(cell, this.Style.CSS_CELL_SELECTABLE);
        },


        /**
        * Renders a single standard calendar cell using the CSS hightlight1 style
        * @method renderCellStyleHighlight1
        * @private
        * @param {Date}                 workingDate     The current working Date object being used to generate the calendar
        * @param {HTMLTableCellElement} cell            The current working cell in the calendar
        */
        renderCellStyleHighlight1: function(workingDate, cell) {
            Dom.addClass(cell, this.Style.CSS_CELL_HIGHLIGHT1);
        },

        /**
        * Renders a single standard calendar cell using the CSS hightlight2 style
        * @method renderCellStyleHighlight2
        * @private
        * @param {Date}                 workingDate     The current working Date object being used to generate the calendar
        * @param {HTMLTableCellElement} cell            The current working cell in the calendar
        */
        renderCellStyleHighlight2: function(workingDate, cell) {
            Dom.addClass(cell, this.Style.CSS_CELL_HIGHLIGHT2);
        },

        /**
        * Renders a single standard calendar cell using the CSS hightlight3 style
        * @method renderCellStyleHighlight3
        * @private
        * @param {Date}                 workingDate     The current working Date object being used to generate the calendar
        * @param {HTMLTableCellElement} cell            The current working cell in the calendar
        */
        renderCellStyleHighlight3: function(workingDate, cell) {
            Dom.addClass(cell, this.Style.CSS_CELL_HIGHLIGHT3);
        },

        /**
        * Renders a single standard calendar cell using the CSS hightlight4 style
        * @method renderCellStyleHighlight4
        * @private
        * @param {Date}                 workingDate     The current working Date object being used to generate the calendar
        * @param {HTMLTableCellElement} cell            The current working cell in the calendar
        */
        renderCellStyleHighlight4: function(workingDate, cell) {
            Dom.addClass(cell, this.Style.CSS_CELL_HIGHLIGHT4);
        },

        /**
        * Applies the default style used for rendering today's date to the current calendar cell
        * @method renderCellStyleToday
        * @private
        * @param {Date}                 workingDate     The current working Date object being used to generate the calendar
        * @param {HTMLTableCellElement} cell            The current working cell in the calendar
        */
        renderCellStyleToday: function(workingDate, cell) {
            Dom.addClass(cell, this.Style.CSS_CELL_TODAY);
        },

        /**
        * Applies the default style used for rendering selected dates to the current calendar cell
        * @method renderCellStyleSelected
        * @private
        * @param {Date}                 workingDate     The current working Date object being used to generate the calendar
        * @param {HTMLTableCellElement} cell            The current working cell in the calendar
        * @return {String} Rui.ui.calendar.LCalendar.STOP_RENDER if rendering should stop with this style, null or nothing if rendering
        *           should not be terminated
        */
        renderCellStyleSelected: function(workingDate, cell) {
            Dom.addClass(cell, this.Style.CSS_CELL_SELECTED);
            if(Rui.useAccessibility())
                cell.setAttribute('aria-selected', 'true');
        },

        /**
        * Applies the default style used for rendering dates that are not a part of the current
        * month (preceding or trailing the cells for the current month)
        * @method renderCellNotThisMonth
        * @private
        * @param {Date}                 workingDate     The current working Date object being used to generate the calendar
        * @param {HTMLTableCellElement} cell            The current working cell in the calendar
        * @return {String} Rui.ui.calendar.LCalendar.STOP_RENDER if rendering should stop with this style, null or nothing if rendering
        *           should not be terminated
        */
        renderCellNotThisMonth: function(workingDate, cell) {
            Dom.addClass(cell, this.Style.CSS_CELL_OOM);
            cell.innerHTML = workingDate.getDate();
            return LCalendar.STOP_RENDER;
        },

        /**
        * Renders the current calendar cell as a non-selectable 'black-out' date using the default
        * restricted style.
        * @method renderBodyCellRestricted
        * @private
        * @param {Date}                 workingDate     The current working Date object being used to generate the calendar
        * @param {HTMLTableCellElement} cell            The current working cell in the calendar
        * @return {String} Rui.ui.calendar.LCalendar.STOP_RENDER if rendering should stop with this style, null or nothing if rendering
        *           should not be terminated
        */
        renderBodyCellRestricted: function(workingDate, cell) {
            Dom.addClass(cell, this.Style.CSS_CELL);
            Dom.addClass(cell, this.Style.CSS_CELL_RESTRICTED);
            cell.innerHTML = workingDate.getDate();
            return LCalendar.STOP_RENDER;
        },

        // END BUILT-IN TABLE CELL RENDERERS

        // BEGIN MONTH NAVIGATION METHODS

        /**
        * Adds the designated number of months to the current calendar month, and sets the current
        * calendar page date to the new month.
        * @method addMonths
        * @param {Number}   count   The number of months to add to the current calendar
        */
        addMonths: function(count) {
            var cfgPageDate = DEF_CFG.PAGEDATE.key;
            this.cfg.setProperty(cfgPageDate, Rui.util.LDate.add(this.cfg.getProperty(cfgPageDate), Rui.util.LDate.MONTH, count));
            this.resetRenderers();
            this.changePageEvent.fire();
        },

        /**
        * Subtracts the designated number of months from the current calendar month, and sets the current
        * calendar page date to the new month.
        * @method subtractMonths
        * @param {Number}   count   The number of months to subtract from the current calendar
        */
        subtractMonths: function(count) {
            var cfgPageDate = DEF_CFG.PAGEDATE.key;
            this.cfg.setProperty(cfgPageDate, Rui.util.LDate.subtract(this.cfg.getProperty(cfgPageDate), Rui.util.LDate.MONTH, count));
            this.resetRenderers();
            this.changePageEvent.fire();
        },

        /**
        * Adds the designated number of years to the current calendar, and sets the current
        * calendar page date to the new month.
        * @method addYears
        * @param {Number}   count   The number of years to add to the current calendar
        */
        addYears: function(count) {
            var cfgPageDate = DEF_CFG.PAGEDATE.key;
            this.cfg.setProperty(cfgPageDate, Rui.util.LDate.add(this.cfg.getProperty(cfgPageDate), Rui.util.LDate.YEAR, count));
            this.resetRenderers();
            this.changePageEvent.fire();
        },

        /**
        * Subtcats the designated number of years from the current calendar, and sets the current
        * calendar page date to the new month.
        * @method subtractYears
        * @param {Number}   count   The number of years to subtract from the current calendar
        */
        subtractYears: function(count) {
            var cfgPageDate = DEF_CFG.PAGEDATE.key;
            this.cfg.setProperty(cfgPageDate, Rui.util.LDate.subtract(this.cfg.getProperty(cfgPageDate), Rui.util.LDate.YEAR, count));
            this.resetRenderers();
            this.changePageEvent.fire();
        },

        /**
        * Navigates to the next month page in the calendar widget.
        * @method nextMonth
        */
        nextMonth: function() {
            this.addMonths(1);
        },

        /**
        * Navigates to the previous month page in the calendar widget.
        * @method previousMonth
        */
        previousMonth: function() {
            this.subtractMonths(1);
        },

        /**
        * Navigates to the next year in the currently selected month in the calendar widget.
        * @method nextYear
        */
        nextYear: function() {
            this.addYears(1);
        },

        /**
        * Navigates to the previous year in the currently selected month in the calendar widget.
        * @method previousYear
        */
        previousYear: function() {
            this.subtractYears(1);
        },

        // END MONTH NAVIGATION METHODS

        // BEGIN SELECTION METHODS

        /**
        * Resets the calendar widget to the originally selected month and year, and 
        * sets the calendar to the initial selection(s).
        * @method reset
        */
        reset: function() {
            this.cfg.resetProperty(DEF_CFG.SELECTED.key);
            this.cfg.resetProperty(DEF_CFG.PAGEDATE.key);
            this.resetEvent.fire();
        },

        /**
        * Clears the selected dates in the current calendar widget and sets the calendar
        * to the current month and year.
        * @method clear
        */
        clear: function() {
            this.cfg.setProperty(DEF_CFG.SELECTED.key, []);
            this.cfg.setProperty(DEF_CFG.PAGEDATE.key, new Date(this.today.getTime()));
            this.clearEvent.fire();
        },

        /**
        * Selects a date or a collection of dates on the current calendar. This method, by default,
        * does not call the render method explicitly. Once selection has completed, render must be 
        * called for the changes to be reflected visually.
        *
        * Any dates which are OOB (out of bounds, not selectable) will not be selected and the array of 
        * selected dates passed to the selectEvent will not contain OOB dates.
        * 
        * If all dates are OOB, the no state change will occur; beforeSelect and select events will not be fired.
        *
        * @method select
        * @param    {String/Date/Date[]}    date    The date string of dates to select in the current calendar. Valid formats are
        *                               individual date(s) (12/24/2005,12/26/2005) or date range(s) (12/24/2005-1/1/2006).
        *                               Multiple comma-delimited dates can also be passed to this method (12/24/2005,12/11/2005-12/13/2005).
        *                               This method can also take a JavaScript Date object or an array of Date objects.
        * @param {bool} fireEvent event를 발생시킬지 여부, 기본값 true, 단순히 값만 변경할 경우 false 설정.
        * @return   {Date[]}            Array of JavaScript Date objects representing all individual dates that are currently selected.
        */
        select: function(date,fireEvent) {
            fireEvent = fireEvent == null ? true : fireEvent;
            var aToBeSelected = this._toFieldArray(date),
            validDates = [],
            selected = [],
            cfgSelected = DEF_CFG.SELECTED.key;

            for (var a = 0; a < aToBeSelected.length; ++a) {
                var toSelect = aToBeSelected[a];
                var date = this._toDate(toSelect);
                if (!this.isDateOOB(date)) {

                    if (validDates.length === 0) {
                        if(fireEvent)
                            this.beforeSelectEvent.fire();
                        selected = this.cfg.getProperty(cfgSelected);
                    }
                    validDates.push(date);

                    if (this._indexOfSelectedFieldArray(toSelect) == -1) {
                        selected[selected.length] = toSelect;
                    }
                }
            }

            if (validDates.length > 0) {
                if (this.parent) {
                    this.parent.cfg.setProperty(cfgSelected, selected);
                } else {
                    this.cfg.setProperty(cfgSelected, selected);
                }
                if(fireEvent)
                    this.selectEvent.fire({
                        target: this,
                        date: this.MULTI_SELECT ? validDates : validDates[0]
                    });
            }

            return this.getSelectedDates();
        },

        /**
        * Selects a date on the current calendar by referencing the index of the cell that should be selected.
        * This method is used to easily select a single cell (usually with a mouse click) without having to do
        * a full render. The selected style is applied to the cell directly.
        *
        * If the cell is not marked with the CSS_CELL_SELECTABLE class (as is the case by default for out of month 
        * or out of bounds cells), it will not be selected and in such a case beforeSelect and select events will not be fired.
        * 
        * @method selectCell
        * @param    {Number}    cellIndex   The index of the cell to select in the current calendar. 
        * @return   {Date[]}    Array of JavaScript Date objects representing all individual dates that are currently selected.
        */
        selectCell: function(cellIndex) {
            var cell = this.cells[cellIndex],
            cellDate = this.cellDates[cellIndex],
            dCellDate = this._toDate(cellDate),
            selectable = Dom.hasClass(cell, this.Style.CSS_CELL_SELECTABLE);

            if (selectable) {
                this.beforeSelectEvent.fire();

                var cfgSelected = DEF_CFG.SELECTED.key;
                var selected = this.cfg.getProperty(cfgSelected);

                var selectDate = cellDate.concat();

                if (this._indexOfSelectedFieldArray(selectDate) == -1) {
                    selected[selected.length] = selectDate;
                }
                if (this.parent) {
                    this.parent.cfg.setProperty(cfgSelected, selected);
                } else {
                    this.cfg.setProperty(cfgSelected, selected);
                }
                this.renderCellStyleSelected(dCellDate, cell);
                var date = this.toDate(selectDate);
                this.selectEvent.fire({target: this, date: this.MULTI_SELECT ? [date] : date});

                this.doCellMouseOut.call(cell, null, this);
            }

            return this.getSelectedDates();
        },

        /**
        * Deselects a date or a collection of dates on the current calendar. This method, by default,
        * does not call the render method explicitly. Once deselection has completed, render must be 
        * called for the changes to be reflected visually.
        * 
        * The method will not attempt to deselect any dates which are OOB (out of bounds, and hence not selectable) 
        * and the array of deselected dates passed to the deselectEvent will not contain any OOB dates.
        * 
        * If all dates are OOB, beforeDeselect and deselect events will not be fired.
        * 
        * @method deselect
        * @param    {String/Date/Date[]}    date    The date string of dates to deselect in the current calendar. Valid formats are
        *                               individual date(s) (12/24/2005,12/26/2005) or date range(s) (12/24/2005-1/1/2006).
        *                               Multiple comma-delimited dates can also be passed to this method (12/24/2005,12/11/2005-12/13/2005).
        *                               This method can also take a JavaScript Date object or an array of Date objects. 
        * @return   {Date[]}            Array of JavaScript Date objects representing all individual dates that are currently selected.
        */
        deselect: function(date) {

            var aToBeDeselected = this._toFieldArray(date),
            validDates = [],
            selected = [],
            cfgSelected = DEF_CFG.SELECTED.key;


            for (var a = 0; a < aToBeDeselected.length; ++a) {
                var toDeselect = aToBeDeselected[a];

                var date = this._toDate(toDeselect);
                if (!this.isDateOOB(date)) {

                    if (validDates.length === 0) {
                        this.beforeDeselectEvent.fire();
                        selected = this.cfg.getProperty(cfgSelected);
                    }

                    validDates.push(date);

                    var index = this._indexOfSelectedFieldArray(toDeselect);
                    if (index != -1) {
                        selected.splice(index, 1);
                    }
                }
            }


            if (validDates.length > 0) {
                if (this.parent) {
                    this.parent.cfg.setProperty(cfgSelected, selected);
                } else {
                    this.cfg.setProperty(cfgSelected, selected);
                }
                this.deselectEvent.fire({target: this, date: this.MULTI_SELECT ? validDates:validDates[0]});
            }

            return this.getSelectedDates();
        },

        /**
        * Deselects a date on the current calendar by referencing the index of the cell that should be deselected.
        * This method is used to easily deselect a single cell (usually with a mouse click) without having to do
        * a full render. The selected style is removed from the cell directly.
        * 
        * If the cell is not marked with the CSS_CELL_SELECTABLE class (as is the case by default for out of month 
        * or out of bounds cells), the method will not attempt to deselect it and in such a case, beforeDeselect and 
        * deselect events will not be fired.
        * 
        * @method deselectCell
        * @param    {Number}    cellIndex   The index of the cell to deselect in the current calendar. 
        * @return   {Date[]}    Array of JavaScript Date objects representing all individual dates that are currently selected.
        */
        deselectCell: function(cellIndex) {
            var cell = this.cells[cellIndex],
            cellDate = this.cellDates[cellIndex],
            cellDateIndex = this._indexOfSelectedFieldArray(cellDate);

            var selectable = Dom.hasClass(cell, this.Style.CSS_CELL_SELECTABLE);

            if (selectable) {

                this.beforeDeselectEvent.fire();

                var selected = this.cfg.getProperty(DEF_CFG.SELECTED.key),
                dCellDate = this._toDate(cellDate),
                selectDate = cellDate.concat();

                if (cellDateIndex > -1) {
                    if (this.cfg.getProperty(DEF_CFG.PAGEDATE.key).getMonth() == dCellDate.getMonth() &&
                    this.cfg.getProperty(DEF_CFG.PAGEDATE.key).getFullYear() == dCellDate.getFullYear()) {
                        Dom.removeClass(cell, this.Style.CSS_CELL_SELECTED);
                        if(Rui.useAccessibility())
                            cell.removeAttribute('aria-selected');
                    }
                    selected.splice(cellDateIndex, 1);
                }

                if (this.parent) {
                    this.parent.cfg.setProperty(DEF_CFG.SELECTED.key, selected);
                } else {
                    this.cfg.setProperty(DEF_CFG.SELECTED.key, selected);
                }

                var date = this.toDate(selectDate);

                this.deselectEvent.fire({
                    target: this,
                    date: this.MULTI_SELECT ? [date]:date
                });
            }

            return this.getSelectedDates();
        },

        /**
        * Deselects all dates on the current calendar.
        * @method deselectAll
        * @return {Date[]}      Array of JavaScript Date objects representing all individual dates that are currently selected.
        *                       Assuming that this function executes properly, the return value should be an empty array.
        *                       However, the empty array is returned for the sake of being able to check the selection status
        *                       of the calendar.
        */
        deselectAll: function() {
            this.beforeDeselectEvent.fire();

            var cfgSelected = DEF_CFG.SELECTED.key,
            selected = this.cfg.getProperty(cfgSelected),
            count = selected.length,
            sel = selected.concat();

            if (this.parent) {
                this.parent.cfg.setProperty(cfgSelected, []);
            } else {
                this.cfg.setProperty(cfgSelected, []);
            }
            
            var dateList = [];
            for (var i = 0 ; i < sel.length ; i++)
                dateList.push(this.toDate(sel[i]));

            if (count > 0) {
                this.deselectEvent.fire({target: this, date: this.MULTI_SELECT ? dateList: dateList[0]});
            }

            return this.getSelectedDates();
        },

        // END SELECTION METHODS

        // BEGIN TYPE CONVERSION METHODS

        /**
        * Converts a date (either a JavaScript Date object, or a date string) to the internal data structure
        * used to represent dates: [[yyyy,mm,dd],[yyyy,mm,dd]].
        * @method _toFieldArray
        * @private
        * @param    {String/Date/Date[]}    date    The date string of dates to deselect in the current calendar. Valid formats are
        *                               individual date(s) (12/24/2005,12/26/2005) or date range(s) (12/24/2005-1/1/2006).
        *                               Multiple comma-delimited dates can also be passed to this method (12/24/2005,12/11/2005-12/13/2005).
        *                               This method can also take a JavaScript Date object or an array of Date objects. 
        * @return {Array[](Number[])}   Array of date field arrays
        */
        _toFieldArray: function(date) {
            var returnDate = [];

            if (date instanceof Date) {
                returnDate = [[date.getFullYear(), date.getMonth() + 1, date.getDate()]];
            } else if (Rui.isString(date)) {
                returnDate = this._parseDates(date);
            } else if (Lang.isArray(date)) {
                for (var i = 0; i < date.length; ++i) {
                    var d = date[i];
                    returnDate[returnDate.length] = [d.getFullYear(), d.getMonth() + 1, d.getDate()];
                }
            }

            return returnDate;
        },

        /**
        * Converts a date field array [yyyy,mm,dd] to a JavaScript Date object. The date field array
        * is the format in which dates are as provided as arguments to selectEvent and deselectEvent listeners.
        * 
        * @method toDate
        * @param    {Number[]}  dateFieldArray  The date field array to convert to a JavaScript Date.
        * @return   {Date}  JavaScript Date object representing the date field array.
        */
        toDate: function(dateFieldArray) {
            return this._toDate(dateFieldArray);
        },

        /**
        * Converts a date field array [yyyy,mm,dd] to a JavaScript Date object.
        * @method _toDate
        * @private
        * @deprecated Made public, toDate 
        * @param    {Number[]}      dateFieldArray  The date field array to convert to a JavaScript Date.
        * @return   {Date}  JavaScript Date object representing the date field array
        */
        _toDate: function(dateFieldArray) {
            if (dateFieldArray instanceof Date) {
                return dateFieldArray;
            } else {
                return Rui.util.LDate.getDate(dateFieldArray[0], dateFieldArray[1] - 1, dateFieldArray[2]);
            }
        },

        // END TYPE CONVERSION METHODS 

        // BEGIN UTILITY METHODS

        /**
        * Converts a date field array [yyyy,mm,dd] to a JavaScript Date object.
        * @method _fieldArraysAreEqual
        * @private
        * @param    {Number[]}  array1  The first date field array to compare
        * @param    {Number[]}  array2  The first date field array to compare
        * @return   {boolean}   The boolean that represents the equality of the two arrays
        */
        _fieldArraysAreEqual: function(array1, array2) {
            var match = false;

            if (array1[0] == array2[0] && array1[1] == array2[1] && array1[2] == array2[2]) {
                match = true;
            }

            return match;
        },

        /**
        * Gets the index of a date field array [yyyy,mm,dd] in the current list of selected dates.
        * @method   _indexOfSelectedFieldArray
        * @private
        * @param    {Number[]}      find    The date field array to search for
        * @return   {Number}            The index of the date field array within the collection of selected dates.
        *                               -1 will be returned if the date is not found.
        */
        _indexOfSelectedFieldArray: function(find) {
            var selected = -1,
            seldates = this.cfg.getProperty(DEF_CFG.SELECTED.key);

            for (var s = 0; s < seldates.length; ++s) {
                var sArray = seldates[s];
                if (find[0] == sArray[0] && find[1] == sArray[1] && find[2] == sArray[2]) {
                    selected = s;
                    break;
                }
            }

            return selected;
        },

        /**
        * Determines whether a given date is OOM (out of month).
        * @method   isDateOOM
        * @private
        * @param    {Date}  date    The JavaScript Date object for which to check the OOM status
        * @return   {boolean}   true if the date is OOM
        */
        isDateOOM: function(date) {
            return (date.getMonth() != this.cfg.getProperty(DEF_CFG.PAGEDATE.key).getMonth());
        },

        /**
        * Determines whether a given date is OOB (out of bounds - less than the mindate or more than the maxdate).
        *
        * @method   isDateOOB
        * @private
        * @param    {Date}  date    The JavaScript Date object for which to check the OOB status
        * @return   {boolean}   true if the date is OOB
        */
        isDateOOB: function(date) {
            var minDate = this.cfg.getProperty(DEF_CFG.MINDATE.key),
            maxDate = this.cfg.getProperty(DEF_CFG.MAXDATE.key),
            dm = Rui.util.LDate;

            if (minDate) {
                minDate = dm.clearTime(minDate);
            }
            if (maxDate) {
                maxDate = dm.clearTime(maxDate);
            }

            var clearedDate = new Date(date.getTime());
            clearedDate = dm.clearTime(clearedDate);

            return ((minDate && clearedDate.getTime() < minDate.getTime()) || (maxDate && clearedDate.getTime() > maxDate.getTime()));
        },

        /**
        * Parses a pagedate configuration property value. The value can either be specified as a string of form 'mm/yyyy' or a Date object 
        * and is parsed into a Date object normalized to the first day of the month. If no value is passed in, the month and year from today's date are used to create the Date object 
        * @method   _parsePageDate
        * @private
        * @param {Date|String}  date    Pagedate value which needs to be parsed
        * @return {Date}    The Date object representing the pagedate
        */
        _parsePageDate: function(date) {
            var parsedDate;

            if (date) {
                if (date instanceof Date) {
                    parsedDate = Rui.util.LDate.getFirstDayOfMonth(date);
                } else {
                    var month, year, aMonthYear;
                    aMonthYear = date.split(this.cfg.getProperty(DEF_CFG.DATE_FIELD_DELIMITER.key));
                    month = parseInt(aMonthYear[this.cfg.getProperty(DEF_CFG.MY_MONTH_POSITION.key) - 1], 10) - 1;
                    year = parseInt(aMonthYear[this.cfg.getProperty(DEF_CFG.MY_YEAR_POSITION.key) - 1], 10);

                    parsedDate = Rui.util.LDate.getDate(year, month, 1);
                }
            } else {
                parsedDate = Rui.util.LDate.getDate(this.today.getFullYear(), this.today.getMonth(), 1);
            }
            return parsedDate;
        },

        // END UTILITY METHODS

        // BEGIN EVENT HANDLERS

        /**
        * Event executed before a date is selected in the calendar widget.
        * @method onBeforeSelect
        * @private
        * @deprecated Event handlers for this event should be susbcribed to beforeSelectEvent.
        */
        onBeforeSelect: function() {
            if (this.cfg.getProperty(DEF_CFG.MULTI_SELECT.key) === false) {
                if (this.parent) {
                    this.parent.callChildFunction('clearAllBodyCellStyles', this.Style.CSS_CELL_SELECTED);
                    this.parent.deselectAll();
                } else {
                    this.clearAllBodyCellStyles(this.Style.CSS_CELL_SELECTED);
                    this.deselectAll();
                }
            }
        },

        /**
        * Event executed when a date is selected in the calendar widget.
        * @method onSelect
        * @private
        * @param    {Array} selected    An array of date field arrays representing which date or dates were selected. Example: [ [2006,8,6],[2006,8,7],[2006,8,8] ]
        * @deprecated Event handlers for this event should be susbcribed to selectEvent.
        */
        onSelect: function(selected) {},

        /**
        * Event executed before a date is deselected in the calendar widget.
        * @method onBeforeDeselect
        * @private
        * @deprecated Event handlers for this event should be susbcribed to beforeDeselectEvent.
        */
        onBeforeDeselect: function() { },

        /**
        * Event executed when a date is deselected in the calendar widget.
        * @method onDeselect
        * @private
        * @param    {Array} selected    An array of date field arrays representing which date or dates were deselected. Example: [ [2006,8,6],[2006,8,7],[2006,8,8] ]
        * @deprecated Event handlers for this event should be susbcribed to deselectEvent.
        */
        onDeselect: function(deselected) { },

        /**
        * Event executed when the user navigates to a different calendar page.
        * @method onChangePage
        * @private
        * @deprecated Event handlers for this event should be susbcribed to changePageEvent.
        */
        onChangePage: function() {
            this.render();
        },

        /**
        * Event executed when the calendar widget is rendered.
        * @method onRender
        * @private
        * @deprecated Event handlers for this event should be susbcribed to renderEvent.
        */
        onRender: function() { },

        /**
        * Event executed when the calendar widget is reset to its original state.
        * @method onReset
        * @private
        * @deprecated Event handlers for this event should be susbcribed to resetEvemt.
        */
        onReset: function() { this.render(); },

        /**
        * Event executed when the calendar widget is completely cleared to the current month with no selections.
        * @method onClear
        * @private
        * @deprecated Event handlers for this event should be susbcribed to clearEvent.
        */
        onClear: function() { this.render(); },

        /**
        * Validates the calendar widget. This method has no default implementation
        * and must be extended by subclassing the widget.
        * @method validate
        * @return   Should return true if the widget validates, and false if
        * it doesn't.
        * @type Boolean
        */
        validate: function() { return true; },

        // END EVENT HANDLERS

        // BEGIN DATE PARSE METHODS

        /**
        * Converts a date string to a date field array
        * @private
        * @param    {String}    sDate           Date string. Valid formats are mm/dd and mm/dd/yyyy.
        * @return               A date field array representing the string passed to the method
        * @type Array[](Number[])
        */
        _parseDate: function(sDate) {
            var aDate = sDate.split(this.Locale.DATE_FIELD_DELIMITER),
            rArray;

            if (aDate.length == 2) {
                rArray = [aDate[this.Locale.MD_MONTH_POSITION - 1], aDate[this.Locale.MD_DAY_POSITION - 1]];
                rArray.type = LCalendar.MONTH_DAY;
            } else {
                rArray = [aDate[this.Locale.MDY_YEAR_POSITION - 1], aDate[this.Locale.MDY_MONTH_POSITION - 1], aDate[this.Locale.MDY_DAY_POSITION - 1]];
                rArray.type = LCalendar.DATE;
            }

            for (var i = 0; i < rArray.length; i++) {
                rArray[i] = parseInt(rArray[i], 10);
            }

            return rArray;
        },

        /**
        * Converts a multi or single-date string to an array of date field arrays
        * @private
        * @param    {String}    sDates      Date string with one or more comma-delimited dates. Valid formats are mm/dd, mm/dd/yyyy, mm/dd/yyyy-mm/dd/yyyy
        * @return                           An array of date field arrays
        * @type Array[](Number[])
        */
        _parseDates: function(sDates) {
            var aReturn = [],
            aDates = sDates.split(this.Locale.DATE_DELIMITER);

            for (var d = 0; d < aDates.length; ++d) {
                var sDate = aDates[d];

                if (sDate.indexOf(this.Locale.DATE_RANGE_DELIMITER) != -1) {
                    // This is a range
                    var aRange = sDate.split(this.Locale.DATE_RANGE_DELIMITER),
                    dateStart = this._parseDate(aRange[0]),
                    dateEnd = this._parseDate(aRange[1]),
                    fullRange = this._parseRange(dateStart, dateEnd);

                    aReturn = aReturn.concat(fullRange);
                } else {
                    // This is not a range
                    var aDate = this._parseDate(sDate);
                    aReturn.push(aDate);
                }
            }
            return aReturn;
        },

        /**
        * Converts a date range to the full list of included dates
        * @private
        * @param    {Number[]}  startDate   Date field array representing the first date in the range
        * @param    {Number[]}  endDate     Date field array representing the last date in the range
        * @return                           An array of date field arrays
        * @type Array[](Number[])
        */
        _parseRange: function(startDate, endDate) {
            var dCurrent = Rui.util.LDate.add(Rui.util.LDate.getDate(startDate[0], startDate[1] - 1, startDate[2]), Rui.util.LDate.DAY, 1),
            dEnd = Rui.util.LDate.getDate(endDate[0], endDate[1] - 1, endDate[2]),
            results = [];

            results.push(startDate);
            while (dCurrent.getTime() <= dEnd.getTime()) {
                results.push([dCurrent.getFullYear(), dCurrent.getMonth() + 1, dCurrent.getDate()]);
                dCurrent = Rui.util.LDate.add(dCurrent, Rui.util.LDate.DAY, 1);
            }
            return results;
        },

        // END DATE PARSE METHODS

        // BEGIN RENDERER METHODS

        /**
        * Resets the render stack of the current calendar to its original pre-render value.
        * @method resetRenderers
        */
        resetRenderers: function() {
            this.renderStack = this._renderStack.concat();
        },

        /**
        * Removes all custom renderers added to the LCalendar through the addRenderer, addMonthRenderer and 
        * addWeekdayRenderer methods. LCalendar's render method needs to be called after removing renderers 
        * to re-render the LCalendar without custom renderers applied.
        * @method removeRenderers
        */
        removeRenderers: function() {
            this._renderStack = [];
            this.renderStack = [];
        },

        /**
        * Clears the inner HTML, CSS class and style information from the specified cell.
        * @method clearElement
        * @param {HTMLTableCellElement} cell The cell to clear
        */
        clearElement: function(cell) {
            cell.innerHTML = '&#160;';
            cell.className = '';
        },

        /**
        * Adds a renderer to the render stack. The function reference passed to this method will be executed
        * when a date cell matches the conditions specified in the date string for this renderer.
        * @method addRenderer
        * @param    {String}    sDates      A date string to associate with the specified renderer. Valid formats
        *                                   include date (12/24/2005), month/day (12/24), and range (12/1/2004-1/1/2005)
        * @param    {Function}  fnRender    The function executed to render cells that match the render rules for this renderer.
        */
        addRenderer: function(sDates, fnRender) {
            var aDates = this._parseDates(sDates);
            for (var i = 0; i < aDates.length; ++i) {
                var aDate = aDates[i];

                if (aDate.length == 2) { // this is either a range or a month/day combo
                    if (aDate[0] instanceof Array) { // this is a range
                        this._addRenderer(LCalendar.RANGE, aDate, fnRender);
                    } else { // this is a month/day combo
                        this._addRenderer(LCalendar.MONTH_DAY, aDate, fnRender);
                    }
                } else if (aDate.length == 3) {
                    this._addRenderer(LCalendar.DATE, aDate, fnRender);
                }
            }
        },

        /**
        * The private method used for adding cell renderers to the local render stack.
        * This method is called by other methods that set the renderer type prior to the method call.
        * @method _addRenderer
        * @private
        * @param    {String}    type        The type string that indicates the type of date renderer being added.
        *                                   Values are Rui.ui.calendar.LCalendar.DATE, Rui.ui.calendar.LCalendar.MONTH_DAY, Rui.ui.calendar.LCalendar.WEEKDAY,
        *                                   Rui.ui.calendar.LCalendar.RANGE, Rui.ui.calendar.LCalendar.MONTH
        * @param    {Array}     aDates      An array of dates used to construct the renderer. The format varies based
        *                                   on the renderer type
        * @param    {Function}  fnRender    The function executed to render cells that match the render rules for this renderer.
        */
        _addRenderer: function(type, aDates, fnRender) {
            var add = [type, aDates, fnRender];
            this.renderStack.unshift(add);
            this._renderStack = this.renderStack.concat();
        },

        /**
        * Adds a month to the render stack. The function reference passed to this method will be executed
        * when a date cell matches the month passed to this method.
        * @method addMonthRenderer
        * @param    {Number}    month       The month (1-12) to associate with this renderer
        * @param    {Function}  fnRender    The function executed to render cells that match the render rules for this renderer.
        */
        addMonthRenderer: function(month, fnRender) {
            this._addRenderer(LCalendar.MONTH, [month], fnRender);
        },

        /**
        * Adds a weekday to the render stack. The function reference passed to this method will be executed
        * when a date cell matches the weekday passed to this method.
        * @method addWeekdayRenderer
        * @param    {Number}    weekday     The weekday (Sunday = 1, Monday = 2 ... Saturday = 7) to associate with this renderer
        * @param    {Function}  fnRender    The function executed to render cells that match the render rules for this renderer.
        */
        addWeekdayRenderer: function(weekday, fnRender) {
            this._addRenderer(LCalendar.WEEKDAY, [weekday], fnRender);
        },

        // END RENDERER METHODS

        // BEGIN CSS METHODS

        /**
        * Removes all styles from all body cells in the current calendar table.
        * @method clearAllBodyCellStyles
        * @param    {style} style The CSS class name to remove from all calendar body cells
        */
        clearAllBodyCellStyles: function(style) {
            for (var c = 0; c < this.cells.length; ++c) {
                Dom.removeClass(this.cells[c], style);
                if(Rui.useAccessibility()){
                    if(style == this.Style.CSS_CELL_SELECTED)
                        this.cells[c].removeAttribute('aria-selected');
                }
            }
        },

        // END CSS METHODS

        // BEGIN GETTER/SETTER METHODS
        /**
        * Sets the calendar's month explicitly
        * @method setMonth
        * @param {Number}   month       The numeric month, from 0 (January) to 11 (December)
        */
        setMonth: function(month) {
            var cfgPageDate = DEF_CFG.PAGEDATE.key,
            current = this.cfg.getProperty(cfgPageDate);
            current.setMonth(parseInt(month, 10));
            this.cfg.setProperty(cfgPageDate, current);
        },

        /**
        * Sets the calendar's year explicitly.
        * @method setYear
        * @param {Number}   year        The numeric 4-digit year
        */
        setYear: function(year) {
            var cfgPageDate = DEF_CFG.PAGEDATE.key,
            current = this.cfg.getProperty(cfgPageDate);

            current.setFullYear(parseInt(year, 10));
            this.cfg.setProperty(cfgPageDate, current);
        },

        /**
        * Gets the list of currently selected dates from the calendar.
        * @method getSelectedDates
        * @return {Date[]} An array of currently selected JavaScript Date objects.
        */
        getSelectedDates: function() {
            var returnDates = [],
            selected = this.cfg.getProperty(DEF_CFG.SELECTED.key);

            for (var d = 0; d < selected.length; ++d) {
                var dateArray = selected[d];

                var date = Rui.util.LDate.getDate(dateArray[0], dateArray[1] - 1, dateArray[2]);
                returnDates.push(date);
            }

            returnDates.sort(function(a, b) { return a - b; });
            return returnDates;
        },

        // END GETTER/SETTER METHODS //

        /**
        * Hides the LCalendar's outer container from view.
        * @method hide
        */
        hide: function() {
            if (this.beforeHideEvent.fire()) {
                if(Rui.useAccessibility())
                    this.oDomContainer.setAttribute('aria-hidden', 'true');
                this.oDomContainer.style.display = 'none';
                this.hideEvent.fire();
            }
        },

        /**
        * Shows the LCalendar's outer container.
        * @method show
        */
        show: function() {
            if (this.beforeShowEvent.fire()) {
                this.oDomContainer.style.display = 'block';
                if(Rui.useAccessibility())
                    this.oDomContainer.setAttribute('aria-hidden', 'false');
                //size 조정
                if(!this.isSyncIframeSize){
                    this._syncIframeSize();
                }
                this.showEvent.fire();
            }
        },
        
        /**
        * container의 크기에 맞추어 iframe size 조절하기, 최초 한번만 조절된다.
        * @method _syncIframeSize
        * @private
        */
        _syncIframeSize : function(){
            if(this.iframe && this.oDomContainer){
                //iframe의 크기가 커서 LDateBox시 blur가 먹지 않음
                var containerEl = Rui.get(this.oDomContainer);                                
                this.iframe.style.width = containerEl.getWidth() + 'px';
                this.iframe.style.height = containerEl.getHeight() + 'px';
                this.isSyncIframeSize = true;
            }   
        },

        /**
        * Returns a string representing the current browser.
        * @deprecated As of 2.3.0, environment information is available in Rui.browser
        * @see Rui.browser
        * @property browser
        * @type String
        */
        browser: (function() {
            var ua = navigator.userAgent.toLowerCase();
            if (ua.indexOf('opera') != -1) { // Opera (check first in case of spoof)
                return 'opera';
            } else if (ua.indexOf('msie 7') != -1) { // IE7
                return 'ie7';
            } else if (ua.indexOf('msie') != -1) { // IE
                return 'ie';
            } else if (ua.indexOf('safari') != -1) { // Safari (check before Gecko because it includes 'like Gecko')
                return 'safari';
            } else if (ua.indexOf('gecko') != -1) { // Gecko
                return 'gecko';
            } else {
                return false;
            }
        })(),
        
        /**
        * Returns a string representation of the object.
        * @method toString
        * @return {String}  A string representation of the LCalendar object.
        */
        toString: function() {
            return 'LCalendar ' + this.id;
        },

        /**
        * Destroys the LCalendar instance. The method will remove references
        * to HTML elements, remove any event listeners added by the LCalendar,
        * and destroy the Config and LCalendarNavigator instances it has created.
        *
        * @method destroy
        */
        destroy: function() {

            if (this.beforeDestroyEvent.fire()) {
                var cal = this;

                // Child objects
                if (cal.navigator) {
                    cal.navigator.destroy();
                }

                if (cal.cfg) {
                    cal.cfg.destroy();
                }

                // DOM event listeners
                Event.purgeElement(cal.oDomContainer, true);

                // Generated markup/DOM - Not removing the container DIV since we didn't create it.
                Dom.removeClass(cal.oDomContainer, 'withtitle');
                Dom.removeClass(cal.oDomContainer, cal.Style.CSS_CONTAINER);
                Dom.removeClass(cal.oDomContainer, cal.Style.CSS_SINGLE);
                cal.oDomContainer.innerHTML = '';

                // JS-to-DOM references
                if(cal.oDomContainer.parentNode){
                    cal.oDomContainer.parentNode.removeChild(cal.oDomContainer);
                }
                cal.oDomContainer = null;
                cal.cells = null;

                this.destroyEvent.fire();
            }
        },
        /**
         * Subscribe to a LCustomEvent by event type
         *
         * @method on
         * @private
         * @param {string}   p_type     the type, or name of the event
         * @param {function} p_fn       the function to exectute when the event fires
         * @param {Object}   p_obj      An object to be passed along when the event 
         *                              fires
         * @param {boolean}  p_override If true, the obj passed in becomes the 
         *                              execution scope of the listener
         */
        on: function(p_type, p_fn, p_obj, p_override) {
            var ce = this[p_type + 'Event'];
            if(!ce) return;
            ce.on(p_fn, p_obj || this, Rui.isUndefined(p_override) ? true : p_override);
        }
    };

    Rui.ui.calendar.LCalendar = LCalendar;

})();


(function() {
    var Dom = Rui.util.LDom,
        LDateMath = Rui.util.LDate,
        Event = Rui.util.LEvent,
        LCalendar = Rui.ui.calendar.LCalendar;

    /**
     * Rui.ui.calendar.LCalendarGroup is a special container class for Rui.ui.calendar.LCalendar. This class facilitates
     * the ability to have multi-page calendar views that share a single dataset and are
     * dependent on each other.
     *
     * The calendar group instance will refer to each of its elements using a 0-based index.
     * For example, to construct the placeholder for a calendar group widget with id 'cal1' and
     * containerId of 'cal1Container', the markup would be as follows:
     *    <xmp>
     *        <div id='cal1Container_0'></div>
     *        <div id='cal1Container_1'></div>
     *    </xmp>
     * The tables for the calendars ('cal1_0' and 'cal1_1') will be inserted into those containers.
     * 
     * <p>
     * <strong>NOTE: As of 2.4.0, the constructor's ID argument is optional.</strong>
     * The LCalendarGroup can be constructed by simply providing a container ID string, 
     * or a reference to a container DIV HTMLElement (the element needs to exist 
     * in the document).
     * 
     * E.g.:
     *    <xmp>
     *        var c = new Rui.ui.calendar.LCalendarGroup('calContainer', configOptions);
     *    </xmp>
     * or:
     *   <xmp>
     *       var containerDiv = Rui.util.LDom.get('calContainer');
     *        var c = new Rui.ui.calendar.LCalendarGroup(containerDiv, configOptions);
     *    </xmp>
     * </p>
     * <p>
     * If not provided, the ID will be generated from the container DIV ID by adding an '_t' suffix.
     * For example if an ID is not provided, and the container's ID is 'calContainer', the LCalendarGroup's ID will be set to 'calContainer_t'.
     * </p>
     * 
     * @module ui_calendar
     * @namespace Rui.ui.calendar
     * @class LCalendarGroup
     * @constructor
     * @param {String} id optional The id of the table element that will represent the LCalendarGroup widget. As of 2.4.0, this argument is optional.
     * @param {String | HTMLElement} container The id of the container div element that will wrap the LCalendarGroup table, or a reference to a DIV element which exists in the document.
     * @param {Object} config optional The configuration object containing the initial configuration values for the LCalendarGroup.
     * @sample default
     */
    function LCalendarGroup(id, containerId, config) {
        if(arguments.length == 1 && (typeof id == 'object')) {
            config = id;
            id = containerId = (id.applyTo || id.renderTo) || Rui.id();
        }
        config = Rui.applyIf(config, Rui.getConfig().getFirst('$.ext.calendarGroup.defaultProperties'));
        if (arguments.length > 0) {
            this.init.call(this, id, containerId, config);
        }
        if(config) {
            if(config.applyTo){
                this.render();
            }else if(config.renderTo){
                this.render();
            }
        }
    }

    /**
    * The set of default Config property keys and values for the LCalendarGroup
    * @property Rui.ui.calendar.LCalendarGroup._DEFAULT_CONFIG
    * @final
    * @static
    * @private
    * @type Object
    */
    LCalendarGroup._DEFAULT_CONFIG = LCalendar._DEFAULT_CONFIG;
    LCalendarGroup._DEFAULT_CONFIG.PAGES = { key: 'pages', value: 2 };

    var DEF_CFG = LCalendarGroup._DEFAULT_CONFIG;

    LCalendarGroup.prototype = {

        /**
        * 페이지의 연월과 무관하게 오늘 날짜를 가리키는 값 
        * @config today
        * @type Date
        * @default new Date()
        */
    	today: null,
        /**
        * Initializes the calendar group. All subclasses must call this method in order for the
        * group to be initialized properly.
        * @method init
        * @private
        * @param {String} id optional The id of the table element that will represent the LCalendarGroup widget. As of 2.4.0, this argument is optional.
        * @param {String | HTMLElement} container The id of the container div element that will wrap the LCalendarGroup table, or a reference to a DIV element which exists in the document.
        * @param {Object} config optional The configuration object containing the initial configuration values for the LCalendarGroup.
        */
        init: function(id, container, config) {

            // Normalize 2.4.0, pre 2.4.0 args
            var nArgs = this._parseArgs(arguments);

            id = nArgs.id;
            container = nArgs.container;
            config = nArgs.config;

            this.oDomContainer = Dom.get(container);

            if (!this.oDomContainer.id) {
                this.oDomContainer.id = Dom.generateId();
            }
            if (!id) {
                id = this.oDomContainer.id + '_t';
            }

            /**
            * The unique id associated with the LCalendarGroup
            * @property id
            * @type String
            */
            this.id = id;

            /**
            * The unique id associated with the LCalendarGroup container
            * @property containerId
            * @protected
            * @type String
            */
            this.containerId = this.oDomContainer.id;

            this.initEvents();
            this.initStyles();

            /**
            * The collection of LCalendar pages contained within the LCalendarGroup
            * @property pages
            * @protected
            * @type Rui.ui.calendar.LCalendar[]
            */
            this.pages = [];

            Dom.addClass(this.oDomContainer, LCalendarGroup.CSS_CONTAINER);
            Dom.addClass(this.oDomContainer, LCalendarGroup.CSS_MULTI_UP);
            Dom.addClass(this.oDomContainer, 'L-fixed');

            /**
            * The Config object used to hold the configuration variables for the LCalendarGroup
            * @property cfg
            * @protected
            * @type Rui.ui.LConfig
            */
            this.cfg = new Rui.ui.LConfig(this);

            /**
            * The local object which contains the LCalendarGroup's options
            * @property Options
            * @protected
            * @type Object
            */
            this.Options = {};

            /**
            * The local object which contains the LCalendarGroup's locale settings
            * @property Locale
            * @protected
            * @type Object
            */
            this.Locale = {};
            
            if(!this.today && config && config.today) this.today = config.today;

            this.setupConfig();

            if (config) {
                this.cfg.applyConfig(config, true);
            }

            this.cfg.fireQueue();

            // OPERA HACK FOR MISWRAPPED FLOATS
            if (Rui.browser.opera) {
                this.renderEvent.on(this._fixWidth, this, true);
                this.showEvent.on(this._fixWidth, this, true);
            }

        },

        setupConfig: function() {

            var cfg = this.cfg;

            /**
            * The number of pages to include in the LCalendarGroup. This value can only be set once, in the LCalendarGroup's constructor arguments.
            * @config pages
            * @type Number
            * @default 2
            */
            cfg.addProperty(DEF_CFG.PAGES.key, { value: DEF_CFG.PAGES.value, validator: cfg.checkNumber, handler: this.configPages });

            /**
            * The month/year representing the current visible LCalendar date (mm/yyyy)
            * @config pagedate
            * @type String | Date
            * @default today's date
            */
            cfg.addProperty(DEF_CFG.PAGEDATE.key, { value: new Date(), handler: this.configPageDate });

            /**
            * The date or range of dates representing the current LCalendar selection
            *
            * @config selected
            * @type String
            * @default []
            */
            cfg.addProperty(DEF_CFG.SELECTED.key, { value: [], handler: this.configSelected });

            /**
            * The title to display above the LCalendarGroup's month header
            * @config title
            * @type String
            * @default ''
            */
            cfg.addProperty(DEF_CFG.TITLE.key, { value: DEF_CFG.TITLE.value, handler: this.configTitle });

            /**
            * Whether or not a close button should be displayed for this LCalendarGroup
            * @config close
            * @type Boolean
            * @default false
            */
            cfg.addProperty(DEF_CFG.CLOSE.key, { value: DEF_CFG.CLOSE.value, handler: this.configClose });

            /**
            * Whether or not an iframe shim should be placed under the LCalendar to prevent select boxes from bleeding through in Internet Explorer 6 and below.
            * This property is enabled by default for IE6 and below. It is disabled by default for other browsers for performance reasons, but can be 
            * enabled if required.
            * 
            * @config iframe
            * @type Boolean
            * @default true for IE6 and below, false for all other browsers
            */
            cfg.addProperty(DEF_CFG.IFRAME.key, { value: DEF_CFG.IFRAME.value, handler: this.configIframe, validator: cfg.checkBoolean });

            /**
            * The minimum selectable date in the current LCalendar (mm/dd/yyyy)
            * @config mindate
            * @type String | Date
            * @default null
            */
            cfg.addProperty(DEF_CFG.MINDATE.key, { value: DEF_CFG.MINDATE.value, handler: this.delegateConfig });

            /**
            * The maximum selectable date in the current LCalendar (mm/dd/yyyy)
            * @config maxdate
            * @type String | Date
            * @default null
            */
            cfg.addProperty(DEF_CFG.MAXDATE.key, { value: DEF_CFG.MAXDATE.value, handler: this.delegateConfig });

            // Options properties

            /**
            * True if the LCalendar should allow multiple selections. False by default.
            * @config MULTI_SELECT
            * @type Boolean
            * @default false
            */
            cfg.addProperty(DEF_CFG.MULTI_SELECT.key, { value: DEF_CFG.MULTI_SELECT.value, handler: this.delegateConfig, validator: cfg.checkBoolean });

            /**
            * The weekday the week begins on. Default is 0 (Sunday).
            * @config START_WEEKDAY
            * @type number
            * @default 0
            */
            cfg.addProperty(DEF_CFG.START_WEEKDAY.key, { value: DEF_CFG.START_WEEKDAY.value, handler: this.delegateConfig, validator: cfg.checkNumber });

            /**
            * True if the LCalendar should show weekday labels. True by default.
            * @config SHOW_WEEKDAYS
            * @type Boolean
            * @default true
            */
            cfg.addProperty(DEF_CFG.SHOW_WEEKDAYS.key, { value: DEF_CFG.SHOW_WEEKDAYS.value, handler: this.delegateConfig, validator: cfg.checkBoolean });

            /**
            * True if the LCalendar should show week row headers. False by default.
            * @config SHOW_WEEK_HEADER
            * @type Boolean
            * @default false
            */
            cfg.addProperty(DEF_CFG.SHOW_WEEK_HEADER.key, { value: DEF_CFG.SHOW_WEEK_HEADER.value, handler: this.delegateConfig, validator: cfg.checkBoolean });

            /**
            * True if the LCalendar should show week row footers. False by default.
            * @config SHOW_WEEK_FOOTER
            * @type Boolean
            * @default false
            */
            cfg.addProperty(DEF_CFG.SHOW_WEEK_FOOTER.key, { value: DEF_CFG.SHOW_WEEK_FOOTER.value, handler: this.delegateConfig, validator: cfg.checkBoolean });

            /**
            * True if the LCalendar should suppress weeks that are not a part of the current month. False by default.
            * @config HIDE_BLANK_WEEKS
            * @type Boolean
            * @default false
            */
            cfg.addProperty(DEF_CFG.HIDE_BLANK_WEEKS.key, { value: DEF_CFG.HIDE_BLANK_WEEKS.value, handler: this.delegateConfig, validator: cfg.checkBoolean });

            /**
            * The image that should be used for the left navigation arrow.
            * @config NAV_ARROW_LEFT
            * @type String
            * @deprecated    You can customize the image by overriding the default CSS class for the left arrow - 'L-calnavleft'
            * @default null
            */
            cfg.addProperty(DEF_CFG.NAV_ARROW_LEFT.key, { value: DEF_CFG.NAV_ARROW_LEFT.value, handler: this.delegateConfig });

            /**
            * The image that should be used for the right navigation arrow.
            * @config NAV_ARROW_RIGHT
            * @type String
            * @deprecated    You can customize the image by overriding the default CSS class for the right arrow - 'L-calnavright'
            * @default null
            */
            cfg.addProperty(DEF_CFG.NAV_ARROW_RIGHT.key, { value: DEF_CFG.NAV_ARROW_RIGHT.value, handler: this.delegateConfig });

            // Locale properties

            /**
            * The short month labels for the current locale.
            * @config MONTHS_SHORT
            * @type String[]
            * @default ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            */
            cfg.addProperty(DEF_CFG.MONTHS_SHORT.key, { value: DEF_CFG.MONTHS_SHORT.value, handler: this.delegateConfig });

            /**
            * The long month labels for the current locale.
            * @config MONTHS_LONG
            * @type String[]
            * @default ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'
            */
            cfg.addProperty(DEF_CFG.MONTHS_LONG.key, { value: DEF_CFG.MONTHS_LONG.value, handler: this.delegateConfig });

            /**
            * The 1-character weekday labels for the current locale.
            * @config WEEKDAYS_1CHAR
            * @type String[]
            * @default ['S', 'M', 'T', 'W', 'T', 'F', 'S']
            */
            cfg.addProperty(DEF_CFG.WEEKDAYS_1CHAR.key, { value: DEF_CFG.WEEKDAYS_1CHAR.value, handler: this.delegateConfig });

            /**
            * The short weekday labels for the current locale.
            * @config WEEKDAYS_SHORT
            * @type String[]
            * @default ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']
            */
            cfg.addProperty(DEF_CFG.WEEKDAYS_SHORT.key, { value: DEF_CFG.WEEKDAYS_SHORT.value, handler: this.delegateConfig });

            /**
            * The medium weekday labels for the current locale.
            * @config WEEKDAYS_MEDIUM
            * @type String[]
            * @default ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            */
            cfg.addProperty(DEF_CFG.WEEKDAYS_MEDIUM.key, { value: DEF_CFG.WEEKDAYS_MEDIUM.value, handler: this.delegateConfig });

            /**
            * The long weekday labels for the current locale.
            * @config WEEKDAYS_LONG
            * @type String[]
            * @default ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
            */
            cfg.addProperty(DEF_CFG.WEEKDAYS_LONG.key, { value: DEF_CFG.WEEKDAYS_LONG.value, handler: this.delegateConfig });

            /**
            * The setting that determines which length of month labels should be used. Possible values are 'short' and 'long'.
            * @config LOCALE_MONTHS
            * @type String
            * @default 'long'
            */
            cfg.addProperty(DEF_CFG.LOCALE_MONTHS.key, { value: DEF_CFG.LOCALE_MONTHS.value, handler: this.delegateConfig });

            /**
            * The setting that determines which length of weekday labels should be used. Possible values are '1char', 'short', 'medium', and 'long'.
            * @config LOCALE_WEEKDAYS
            * @type String
            * @default 'short'
            */
            cfg.addProperty(DEF_CFG.LOCALE_WEEKDAYS.key, { value: DEF_CFG.LOCALE_WEEKDAYS.value, handler: this.delegateConfig });

            /**
            * The value used to delimit individual dates in a date string passed to various LCalendar functions.
            * @config DATE_DELIMITER
            * @type String
            * @default ','
            */
            cfg.addProperty(DEF_CFG.DATE_DELIMITER.key, { value: DEF_CFG.DATE_DELIMITER.value, handler: this.delegateConfig });

            /**
            * The value used to delimit date fields in a date string passed to various LCalendar functions.
            * @config DATE_FIELD_DELIMITER
            * @type String
            * @default '/'
            */
            cfg.addProperty(DEF_CFG.DATE_FIELD_DELIMITER.key, { value: DEF_CFG.DATE_FIELD_DELIMITER.value, handler: this.delegateConfig });

            /**
            * The value used to delimit date ranges in a date string passed to various LCalendar functions.
            * @config DATE_RANGE_DELIMITER
            * @type String
            * @default '-'
            */
            cfg.addProperty(DEF_CFG.DATE_RANGE_DELIMITER.key, { value: DEF_CFG.DATE_RANGE_DELIMITER.value, handler: this.delegateConfig });

            /**
            * The position of the month in a month/year date string
            * @config MY_MONTH_POSITION
            * @type Number
            * @default 1
            */
            cfg.addProperty(DEF_CFG.MY_MONTH_POSITION.key, { value: DEF_CFG.MY_MONTH_POSITION.value, handler: this.delegateConfig, validator: cfg.checkNumber });

            /**
            * The position of the year in a month/year date string
            * @config MY_YEAR_POSITION
            * @type Number
            * @default 2
            */
            cfg.addProperty(DEF_CFG.MY_YEAR_POSITION.key, { value: DEF_CFG.MY_YEAR_POSITION.value, handler: this.delegateConfig, validator: cfg.checkNumber });

            /**
            * The position of the month in a month/day date string
            * @config MD_MONTH_POSITION
            * @type Number
            * @default 1
            */
            cfg.addProperty(DEF_CFG.MD_MONTH_POSITION.key, { value: DEF_CFG.MD_MONTH_POSITION.value, handler: this.delegateConfig, validator: cfg.checkNumber });

            /**
            * The position of the day in a month/year date string
            * @config MD_DAY_POSITION
            * @type Number
            * @default 2
            */
            cfg.addProperty(DEF_CFG.MD_DAY_POSITION.key, { value: DEF_CFG.MD_DAY_POSITION.value, handler: this.delegateConfig, validator: cfg.checkNumber });

            /**
            * The position of the month in a month/day/year date string
            * @config MDY_MONTH_POSITION
            * @type Number
            * @default 1
            */
            cfg.addProperty(DEF_CFG.MDY_MONTH_POSITION.key, { value: DEF_CFG.MDY_MONTH_POSITION.value, handler: this.delegateConfig, validator: cfg.checkNumber });

            /**
            * The position of the day in a month/day/year date string
            * @config MDY_DAY_POSITION
            * @type Number
            * @default 2
            */
            cfg.addProperty(DEF_CFG.MDY_DAY_POSITION.key, { value: DEF_CFG.MDY_DAY_POSITION.value, handler: this.delegateConfig, validator: cfg.checkNumber });

            /**
            * The position of the year in a month/day/year date string
            * @config MDY_YEAR_POSITION
            * @type Number
            * @default 3
            */
            cfg.addProperty(DEF_CFG.MDY_YEAR_POSITION.key, { value: DEF_CFG.MDY_YEAR_POSITION.value, handler: this.delegateConfig, validator: cfg.checkNumber });

            /**
            * The position of the month in the month year label string used as the LCalendar header
            * @config MY_LABEL_MONTH_POSITION
            * @type Number
            * @default 1
            */
            cfg.addProperty(DEF_CFG.MY_LABEL_MONTH_POSITION.key, { value: DEF_CFG.MY_LABEL_MONTH_POSITION.value, handler: this.delegateConfig, validator: cfg.checkNumber });

            /**
            * The position of the year in the month year label string used as the LCalendar header
            * @config MY_LABEL_YEAR_POSITION
            * @type Number
            * @default 2
            */
            cfg.addProperty(DEF_CFG.MY_LABEL_YEAR_POSITION.key, { value: DEF_CFG.MY_LABEL_YEAR_POSITION.value, handler: this.delegateConfig, validator: cfg.checkNumber });

            /**
            * The suffix used after the month when rendering the LCalendar header
            * @config MY_LABEL_MONTH_SUFFIX
            * @type String
            * @default ' '
            */
            cfg.addProperty(DEF_CFG.MY_LABEL_MONTH_SUFFIX.key, { value: DEF_CFG.MY_LABEL_MONTH_SUFFIX.value, handler: this.delegateConfig });

            /**
            * The suffix used after the year when rendering the LCalendar header
            * @config MY_LABEL_YEAR_SUFFIX
            * @type String
            * @default ''
            */
            cfg.addProperty(DEF_CFG.MY_LABEL_YEAR_SUFFIX.key, { value: DEF_CFG.MY_LABEL_YEAR_SUFFIX.value, handler: this.delegateConfig });

            /**
            * LConfiguration for the Month Year Navigation UI. By default it is disabled
            * @config NAV
            * @type Object
            * @default null
            */
            cfg.addProperty(DEF_CFG.NAV.key, { value: DEF_CFG.NAV.value, handler: this.configNavigator });

            /**
            * The map of UI strings which the LCalendarGroup UI uses.
            *
            * @config strings
            * @type {Object}
            * @default An object with the properties shown below:
            *     <dl>
            *         <dt>previousMonth</dt><dd><em>String</em> : The string to use for the 'Previous Month' navigation UI. Defaults to 'Previous Month'.</dd>
            *         <dt>nextMonth</dt><dd><em>String</em> : The string to use for the 'Next Month' navigation UI. Defaults to 'Next Month'.</dd>
            *         <dt>close</dt><dd><em>String</em> : The string to use for the close button label. Defaults to 'Close'.</dd>
            *     </dl>
            */
            cfg.addProperty(DEF_CFG.STRINGS.key, {
                value: DEF_CFG.STRINGS.value,
                handler: this.configStrings,
                validator: function(val) {
                    return Rui.isObject(val);
                },
                supercedes: DEF_CFG.STRINGS.supercedes
            });
        },

        /**
        * Initializes LCalendarGroup's built-in CustomEvents
        * @method initEvents
        * @private
        */
        initEvents: function() {

            var me = this,
            strEvent = 'Event',
            CE = Rui.util.LCustomEvent;

            /**
            * Proxy subscriber to subscribe to the LCalendarGroup's child Calendars' CustomEvents
            * @method sub
            * @private
            * @param {Function} fn    The function to subscribe to this LCustomEvent
            * @param {Object}    obj    The LCustomEvent's scope object
            * @param {boolean}    bOverride    Whether or not to apply scope correction
            */
            var sub = function(fn, obj, bOverride) {
                for (var p = 0; p < me.pages.length; ++p) {
                    var cal = me.pages[p];
                    cal[this.type + strEvent].on(fn, obj, bOverride);
                }
            };

            /**
            * Proxy unsubscriber to unsubscribe from the LCalendarGroup's child Calendars' CustomEvents
            * @method unsub
            * @private
            * @param {Function} fn    The function to subscribe to this LCustomEvent
            * @param {Object}    obj    The LCustomEvent's scope object
            */
            var unsub = function(fn, obj) {
                for (var p = 0; p < me.pages.length; ++p) {
                    var cal = me.pages[p];
                    cal[this.type + strEvent].unOn(fn, obj);
                }
            };

            var defEvents = LCalendar._EVENT_TYPES;

            /**
            * Fired before a date selection is made
            * @event beforeSelectEvent
            */
            me.beforeSelectEvent = new CE(defEvents.BEFORE_SELECT);
            me.beforeSelectEvent.on = sub; me.beforeSelectEvent.unOn = unsub;

            /**
            * Fired when a date selection is made
            * @event selectEvent
            * @param {Array}    Array of Date field arrays in the format [YYYY, MM, LDD].
            */
            me.selectEvent = new CE(defEvents.SELECT);
            me.selectEvent.on = sub; me.selectEvent.unOn = unsub;

            /**
            * Fired before a date or set of dates is deselected
            * @event beforeDeselectEvent
            */
            me.beforeDeselectEvent = new CE(defEvents.BEFORE_DESELECT);
            me.beforeDeselectEvent.on = sub; me.beforeDeselectEvent.unOn = unsub;

            /**
            * Fired when a date or set of dates has been deselected
            * @event deselectEvent
            * @param {Array}    Array of Date field arrays in the format [YYYY, MM, LDD].
            */
            me.deselectEvent = new CE(defEvents.DESELECT);
            me.deselectEvent.on = sub; me.deselectEvent.unOn = unsub;

            /**
            * Fired when the LCalendar page is changed
            * @event beforeChangePage
            */
            me.beforeChangePageEvent = new CE(defEvents.BEFORE_CHANGE_PAGE);
            me.beforeChangePageEvent.on = sub; me.beforeChangePageEvent.unOn = unsub;

            /**
            * Fired when the LCalendar page is changed
            * @event changePageEvent
            */
            me.changePageEvent = new CE(defEvents.CHANGE_PAGE);
            me.changePageEvent.on = sub; me.changePageEvent.unOn = unsub;

            /**
            * Fired before the LCalendar is rendered
            * @event beforeRenderEvent
            */
            me.beforeRenderEvent = new CE(defEvents.BEFORE_RENDER);
            me.beforeRenderEvent.on = sub; me.beforeRenderEvent.unOn = unsub;

            /**
            * Fired when the LCalendar is rendered
            * @event renderEvent
            */
            me.renderEvent = new CE(defEvents.RENDER);
            me.renderEvent.on = sub; me.renderEvent.unOn = unsub;

            /**
            * Fired when the LCalendar is reset
            * @event resetEvent
            */
            me.resetEvent = new CE(defEvents.RESET);
            me.resetEvent.on = sub; me.resetEvent.unOn = unsub;

            /**
            * Fired when the LCalendar is cleared
            * @event clearEvent
            */
            me.clearEvent = new CE(defEvents.CLEAR);
            me.clearEvent.on = sub; me.clearEvent.unOn = unsub;

            /**
            * Fired just before the LCalendarGroup is to be shown
            * @event beforeShowEvent
            */
            me.beforeShowEvent = new CE(defEvents.BEFORE_SHOW);

            /**
            * Fired after the LCalendarGroup is shown
            * @event showEvent
            */
            me.showEvent = new CE(defEvents.SHOW);

            /**
            * Fired just before the LCalendarGroup is to be hidden
            * @event beforeHideEvent
            */
            me.beforeHideEvent = new CE(defEvents.BEFORE_HIDE);

            /**
            * Fired after the LCalendarGroup is hidden
            * @event hideEvent
            */
            me.hideEvent = new CE(defEvents.HIDE);

            /**
            * Fired just before the LCalendarNavigator is to be shown
            * @event beforeShowNavEvent
            */
            me.beforeShowNavEvent = new CE(defEvents.BEFORE_SHOW_NAV);

            /**
            * Fired after the LCalendarNavigator is shown
            * @event showNavEvent
            */
            me.showNavEvent = new CE(defEvents.SHOW_NAV);

            /**
            * Fired just before the LCalendarNavigator is to be hidden
            * @event beforeHideNavEvent
            */
            me.beforeHideNavEvent = new CE(defEvents.BEFORE_HIDE_NAV);

            /**
            * Fired after the LCalendarNavigator is hidden
            * @event hideNavEvent
            */
            me.hideNavEvent = new CE(defEvents.HIDE_NAV);

            /**
            * Fired just before the LCalendarNavigator is to be rendered
            * @event beforeRenderNavEvent
            */
            me.beforeRenderNavEvent = new CE(defEvents.BEFORE_RENDER_NAV);

            /**
            * Fired after the LCalendarNavigator is rendered
            * @event renderNavEvent
            */
            me.renderNavEvent = new CE(defEvents.RENDER_NAV);

            /**
            * Fired just before the LCalendarGroup is to be destroyed
            * @event beforeDestroyEvent
            */
            me.beforeDestroyEvent = new CE(defEvents.BEFORE_DESTROY);

            /**
            * Fired after the LCalendarGroup is destroyed. This event should be used
            * for notification only. When this event is fired, important LCalendarGroup instance
            * properties, dom references and event listeners have already been 
            * removed/dereferenced, and hence the LCalendarGroup instance is not in a usable 
            * state.
            *
            * @event destroyEvent
            */
            me.destroyEvent = new CE(defEvents.DESTROY);
        },

        /**
        * The default Config handler for the 'pages' property
        * @method configPages
        * @private
        * @param {String} type    The LCustomEvent type (usually the property name)
        * @param {Object[]}    args    The LCustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
        * @param {Object} obj    The scope object. For configuration handlers, this will usually equal the owner.
        */
        configPages: function(type, args, obj) {
            var pageCount = args[0],
            cfgPageDate = DEF_CFG.PAGEDATE.key,
            sep = '_',
            caldate,
            firstPageDate = null,
            groupCalClass = 'groupcal',
            firstClass = 'first-of-type',
            lastClass = 'last-of-type';

            for (var p = 0; p < pageCount; ++p) {
                var calId = this.id + sep + p,
                calContainerId = this.containerId + sep + p,
                childConfig = this.cfg.getConfig();

                childConfig.close = false;
                childConfig.title = false;
                childConfig.navigator = null;

                if (p > 0) {
                    caldate = new Date(firstPageDate);
                    this._setMonthOnDate(caldate, caldate.getMonth() + p);
                    childConfig.pageDate = caldate;
                }

                var cal = this.constructChild(calId, calContainerId, childConfig);

                Dom.removeClass(cal.oDomContainer, this.Style.CSS_SINGLE);
                Dom.addClass(cal.oDomContainer, groupCalClass);

                if (p === 0) {
                    firstPageDate = cal.cfg.getProperty(cfgPageDate);
                    Dom.addClass(cal.oDomContainer, firstClass);
                }

                if (p == (pageCount - 1)) {
                    Dom.addClass(cal.oDomContainer, lastClass);
                }

                cal.parent = this;
                cal.index = p;

                this.pages[this.pages.length] = cal;
            }
        },

        /**
        * The default Config handler for the 'pagedate' property
        * @method configPageDate
        * @private
        * @param {String} type    The LCustomEvent type (usually the property name)
        * @param {Object[]}    args    The LCustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
        * @param {Object} obj    The scope object. For configuration handlers, this will usually equal the owner.
        */
        configPageDate: function(type, args, obj) {
            var val = args[0],
            firstPageDate;

            var cfgPageDate = DEF_CFG.PAGEDATE.key;

            for (var p = 0; p < this.pages.length; ++p) {
                var cal = this.pages[p];
                if (p === 0) {
                    firstPageDate = cal._parsePageDate(val);
                    cal.cfg.setProperty(cfgPageDate, firstPageDate);
                } else {
                    var pageDate = new Date(firstPageDate);
                    this._setMonthOnDate(pageDate, pageDate.getMonth() + p);
                    cal.cfg.setProperty(cfgPageDate, pageDate);
                }
            }
        },

        /**
        * The default Config handler for the LCalendarGroup 'selected' property
        * @method configSelected
        * @private
        * @param {String} type    The LCustomEvent type (usually the property name)
        * @param {Object[]}    args    The LCustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
        * @param {Object} obj    The scope object. For configuration handlers, this will usually equal the owner.
        */
        configSelected: function(type, args, obj) {
            var cfgSelected = DEF_CFG.SELECTED.key;
            this.delegateConfig(type, args, obj);
            var selected = (this.pages.length > 0) ? this.pages[0].cfg.getProperty(cfgSelected) : [];
            this.cfg.setProperty(cfgSelected, selected, true);
        },

        /**
        * Delegates a configuration property to the CustomEvents associated with the LCalendarGroup's children
        * @method delegateConfig
        * @private
        * @param {String} type    The LCustomEvent type (usually the property name)
        * @param {Object[]}    args    The LCustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
        * @param {Object} obj    The scope object. For configuration handlers, this will usually equal the owner.
        */
        delegateConfig: function(type, args, obj) {
            var val = args[0];
            var cal;

            for (var p = 0; p < this.pages.length; p++) {
                cal = this.pages[p];
                cal.cfg.setProperty(type, val);
            }
        },
        
        /**
        * @description 사용자가 직접 .cfg.setProperty 를 호출하지 않도록 사용성을 위해 wrapping
        * @method setProperty
        * @param key {object}
        * @param value {object}
        */
        setProperty : function(key,value){
            this.cfg.setProperty(key,value);
        },

        /**
        * Adds a function to all child Calendars within this LCalendarGroup.
        * @method setChildFunction
        * @param {String}        fnName        The name of the function
        * @param {Function}        fn            The function to apply to each LCalendar page object
        */
        setChildFunction: function(fnName, fn) {
            var pageCount = this.cfg.getProperty(DEF_CFG.PAGES.key);

            for (var p = 0; p < pageCount; ++p) {
                this.pages[p][fnName] = fn;
            }
        },

        /**
        * Calls a function within all child Calendars within this LCalendarGroup.
        * @method callChildFunction
        * @private
        * @param {String}        fnName        The name of the function
        * @param {Array}        args        The arguments to pass to the function
        */
        callChildFunction: function(fnName, args) {
            var pageCount = this.cfg.getProperty(DEF_CFG.PAGES.key);

            for (var p = 0; p < pageCount; ++p) {
                var page = this.pages[p];
                if (page[fnName]) {
                    var fn = page[fnName];
                    fn.call(page, args);
                }
            }
        },

        /**
        * Constructs a child calendar. This method can be overridden if a subclassed version of the default
        * calendar is to be used.
        * @method constructChild
        * @private
        * @param {String}    id            The id of the table element that will represent the calendar widget
        * @param {String}    containerId    The id of the container div element that will wrap the calendar table
        * @param {Object}    config        The configuration object containing the LCalendar's arguments
        * @return {Rui.ui.calendar.LCalendar}    The Rui.ui.calendar.LCalendar instance that is constructed
        */
        constructChild: function(id, containerId, config) {
            var container = document.getElementById(containerId);
            if (!container) {
                container = document.createElement('div');
                container.id = containerId;
                this.oDomContainer.appendChild(container);
            }
            if(this.today) config.today = this.today;
            return new LCalendar(id, containerId, config);
        },

        /**
        * Sets the calendar group's month explicitly. This month will be set into the first
        * page of the multi-page calendar, and all other months will be iterated appropriately.
        * @method setMonth
        * @param {Number}    month        The numeric month, from 0 (January) to 11 (December)
        */
        setMonth: function(month) {
            month = parseInt(month, 10);
            var currYear;

            var cfgPageDate = DEF_CFG.PAGEDATE.key;

            for (var p = 0; p < this.pages.length; ++p) {
                var cal = this.pages[p];
                var pageDate = cal.cfg.getProperty(cfgPageDate);
                if (p === 0) {
                    currYear = pageDate.getFullYear();
                } else {
                    pageDate.setFullYear(currYear);
                }
                this._setMonthOnDate(pageDate, month + p);
                cal.cfg.setProperty(cfgPageDate, pageDate);
            }
        },

        /**
        * Sets the calendar group's year explicitly. This year will be set into the first
        * page of the multi-page calendar, and all other months will be iterated appropriately.
        * @method setYear
        * @param {Number}    year        The numeric 4-digit year
        */
        setYear: function(year) {

            var cfgPageDate = DEF_CFG.PAGEDATE.key;

            year = parseInt(year, 10);
            for (var p = 0; p < this.pages.length; ++p) {
                var cal = this.pages[p];
                var pageDate = cal.cfg.getProperty(cfgPageDate);

                if ((pageDate.getMonth() + 1) == 1 && p > 0) {
                    year += 1;
                }
                cal.setYear(year);
            }
        },

        /**
        * Calls the render function of all child calendars within the group.
        * @method render
        */
        render: function() {
            this.renderHeader();
            for (var p = 0; p < this.pages.length; ++p) {
                var cal = this.pages[p];
                cal.render();
            }
            this.renderFooter();
        },

        /**
        * Selects a date or a collection of dates on the current calendar. This method, by default,
        * does not call the render method explicitly. Once selection has completed, render must be 
        * called for the changes to be reflected visually.
        * @method select
        * @param    {String/Date/Date[]}    date    The date string of dates to select in the current calendar. Valid formats are
        *                                individual date(s) (12/24/2005,12/26/2005) or date range(s) (12/24/2005-1/1/2006).
        *                                Multiple comma-delimited dates can also be passed to this method (12/24/2005,12/11/2005-12/13/2005).
        *                                This method can also take a JavaScript Date object or an array of Date objects.
        * @return    {Date[]}            Array of JavaScript Date objects representing all individual dates that are currently selected.
        */
        select: function(date) {
            for (var p = 0; p < this.pages.length; ++p) {
                var cal = this.pages[p];
                cal.select(date);
            }
            return this.getSelectedDates();
        },

        /**
        * Selects dates in the LCalendarGroup based on the cell index provided. This method is used to select cells without having to do a full render. The selected style is applied to the cells directly.
        * The value of the MULTI_SELECT LConfiguration attribute will determine the set of dates which get selected. 
        * <ul>
        *    <li>If MULTI_SELECT is false, selectCell will select the cell at the specified index for only the last displayed LCalendar page.</li>
        *    <li>If MULTI_SELECT is true, selectCell will select the cell at the specified index, on each displayed LCalendar page.</li>
        * </ul>
        * @method selectCell
        * @param    {Number}    cellIndex    The index of the cell to be selected. 
        * @return    {Date[]}    Array of JavaScript Date objects representing all individual dates that are currently selected.
        */
        selectCell: function(cellIndex) {
            for (var p = 0; p < this.pages.length; ++p) {
                var cal = this.pages[p];
                cal.selectCell(cellIndex);
            }
            return this.getSelectedDates();
        },

        /**
        * Deselects a date or a collection of dates on the current calendar. This method, by default,
        * does not call the render method explicitly. Once deselection has completed, render must be 
        * called for the changes to be reflected visually.
        * @method deselect
        * @param    {String/Date/Date[]}    date    The date string of dates to deselect in the current calendar. Valid formats are
        *                                individual date(s) (12/24/2005,12/26/2005) or date range(s) (12/24/2005-1/1/2006).
        *                                Multiple comma-delimited dates can also be passed to this method (12/24/2005,12/11/2005-12/13/2005).
        *                                This method can also take a JavaScript Date object or an array of Date objects.    
        * @return    {Date[]}            Array of JavaScript Date objects representing all individual dates that are currently selected.
        */
        deselect: function(date) {
            for (var p = 0; p < this.pages.length; ++p) {
                var cal = this.pages[p];
                cal.deselect(date);
            }
            return this.getSelectedDates();
        },

        /**
        * Deselects all dates on the current calendar.
        * @method deselectAll
        * @return {Date[]}        Array of JavaScript Date objects representing all individual dates that are currently selected.
        *                        Assuming that this function executes properly, the return value should be an empty array.
        *                        However, the empty array is returned for the sake of being able to check the selection status
        *                        of the calendar.
        */
        deselectAll: function() {
            for (var p = 0; p < this.pages.length; ++p) {
                var cal = this.pages[p];
                cal.deselectAll();
            }
            return this.getSelectedDates();
        },

        /**
        * Deselects dates in the LCalendarGroup based on the cell index provided. This method is used to select cells without having to do a full render. The selected style is applied to the cells directly.
        * deselectCell will deselect the cell at the specified index on each displayed LCalendar page.
        *
        * @method deselectCell
        * @param    {Number}    cellIndex    The index of the cell to deselect. 
        * @return    {Date[]}    Array of JavaScript Date objects representing all individual dates that are currently selected.
        */
        deselectCell: function(cellIndex) {
            for (var p = 0; p < this.pages.length; ++p) {
                var cal = this.pages[p];
                cal.deselectCell(cellIndex);
            }
            return this.getSelectedDates();
        },

        /**
        * Resets the calendar widget to the originally selected month and year, and 
        * sets the calendar to the initial selection(s).
        * @method reset
        */
        reset: function() {
            for (var p = 0; p < this.pages.length; ++p) {
                var cal = this.pages[p];
                cal.reset();
            }
        },

        /**
        * Clears the selected dates in the current calendar widget and sets the calendar
        * to the current month and year.
        * @method clear
        */
        clear: function() {
            for (var p = 0; p < this.pages.length; ++p) {
                var cal = this.pages[p];
                cal.clear();
            }

            this.cfg.setProperty(DEF_CFG.SELECTED.key, []);
            this.cfg.setProperty(DEF_CFG.PAGEDATE.key, new Date(this.pages[0].today.getTime()));
            this.render();
        },

        /**
        * Navigates to the next month page in the calendar widget.
        * @method nextMonth
        */
        nextMonth: function() {
            for (var p = 0; p < this.pages.length; ++p) {
                var cal = this.pages[p];
                cal.nextMonth();
            }
        },

        /**
        * Navigates to the previous month page in the calendar widget.
        * @method previousMonth
        */
        previousMonth: function() {
            for (var p = this.pages.length - 1; p >= 0; --p) {
                var cal = this.pages[p];
                cal.previousMonth();
            }
        },

        /**
        * Navigates to the next year in the currently selected month in the calendar widget.
        * @method nextYear
        */
        nextYear: function() {
            for (var p = 0; p < this.pages.length; ++p) {
                var cal = this.pages[p];
                cal.nextYear();
            }
        },

        /**
        * Navigates to the previous year in the currently selected month in the calendar widget.
        * @method previousYear
        */
        previousYear: function() {
            for (var p = 0; p < this.pages.length; ++p) {
                var cal = this.pages[p];
                cal.previousYear();
            }
        },

        /**
        * Gets the list of currently selected dates from the calendar.
        * @return            An array of currently selected JavaScript Date objects.
        * @type Date[]
        */
        getSelectedDates: function() {
            var returnDates = [];
            var selected = this.cfg.getProperty(DEF_CFG.SELECTED.key);
            for (var d = 0; d < selected.length; ++d) {
                var dateArray = selected[d];

                var date = LDateMath.getDate(dateArray[0], dateArray[1] - 1, dateArray[2]);
                returnDates.push(date);
            }

            returnDates.sort(function(a, b) { return a - b; });
            return returnDates;
        },

        /**
        * Adds a renderer to the render stack. The function reference passed to this method will be executed
        * when a date cell matches the conditions specified in the date string for this renderer.
        * @method addRenderer
        * @param    {String}    sDates        A date string to associate with the specified renderer. Valid formats
        *                                    include date (12/24/2005), month/day (12/24), and range (12/1/2004-1/1/2005)
        * @param    {Function}    fnRender    The function executed to render cells that match the render rules for this renderer.
        */
        addRenderer: function(sDates, fnRender) {
            for (var p = 0; p < this.pages.length; ++p) {
                var cal = this.pages[p];
                cal.addRenderer(sDates, fnRender);
            }
        },

        /**
        * Adds a month to the render stack. The function reference passed to this method will be executed
        * when a date cell matches the month passed to this method.
        * @method addMonthRenderer
        * @param    {Number}    month        The month (1-12) to associate with this renderer
        * @param    {Function}    fnRender    The function executed to render cells that match the render rules for this renderer.
        */
        addMonthRenderer: function(month, fnRender) {
            for (var p = 0; p < this.pages.length; ++p) {
                var cal = this.pages[p];
                cal.addMonthRenderer(month, fnRender);
            }
        },

        /**
        * Adds a weekday to the render stack. The function reference passed to this method will be executed
        * when a date cell matches the weekday passed to this method.
        * @method addWeekdayRenderer
        * @param    {Number}    weekday        The weekday (1-7) to associate with this renderer. 1=Sunday, 2=Monday etc.
        * @param    {Function}    fnRender    The function executed to render cells that match the render rules for this renderer.
        */
        addWeekdayRenderer: function(weekday, fnRender) {
            for (var p = 0; p < this.pages.length; ++p) {
                var cal = this.pages[p];
                cal.addWeekdayRenderer(weekday, fnRender);
            }
        },

        /**
        * Removes all custom renderers added to the LCalendarGroup through the addRenderer, addMonthRenderer and 
        * addWeekRenderer methods. LCalendarGroup's render method needs to be called to after removing renderers 
        * to see the changes applied.
        * 
        * @method removeRenderers
        * @private
        */
        removeRenderers: function() {
            this.callChildFunction('removeRenderers');
        },

        /**
        * Renders the header for the LCalendarGroup.
        * @method renderHeader
        * @protected
        */
        renderHeader: function() {
            // EMPTY DEFAULT IMPL
        },

        /**
        * Renders a footer for the 2-up calendar container. By default, this method is
        * unimplemented.
        * @method renderFooter
        * @protected
        */
        renderFooter: function() {
            // EMPTY DEFAULT IMPL
        },

        /**
        * Adds the designated number of months to the current calendar month, and sets the current
        * calendar page date to the new month.
        * @method addMonths
        * @param {Number}    count    The number of months to add to the current calendar
        */
        addMonths: function(count) {
            this.callChildFunction('addMonths', count);
        },

        /**
        * Subtracts the designated number of months from the current calendar month, and sets the current
        * calendar page date to the new month.
        * @method subtractMonths
        * @param {Number}    count    The number of months to subtract from the current calendar
        */
        subtractMonths: function(count) {
            this.callChildFunction('subtractMonths', count);
        },

        /**
        * Adds the designated number of years to the current calendar, and sets the current
        * calendar page date to the new month.
        * @method addYears
        * @param {Number}    count    The number of years to add to the current calendar
        */
        addYears: function(count) {
            this.callChildFunction('addYears', count);
        },

        /**
        * Subtcats the designated number of years from the current calendar, and sets the current
        * calendar page date to the new month.
        * @method subtractYears
        * @param {Number}    count    The number of years to subtract from the current calendar
        */
        subtractYears: function(count) {
            this.callChildFunction('subtractYears', count);
        },

        /**
        * Returns the LCalendar page instance which has a pagedate (month/year) matching the given date. 
        * Returns null if no match is found.
        * 
        * @method getCalendarPage
        * @param {Date} date The JavaScript Date object for which a LCalendar page is to be found.
        * @return {LCalendar} The LCalendar page instance representing the month to which the date 
        * belongs.
        */
        getCalendarPage: function(date) {
            var cal = null;
            if (date) {
                var y = date.getFullYear(),
                m = date.getMonth();

                var pages = this.pages;
                for (var i = 0; i < pages.length; ++i) {
                    var pageDate = pages[i].cfg.getProperty('pagedate');
                    if (pageDate.getFullYear() === y && pageDate.getMonth() === m) {
                        cal = pages[i];
                        break;
                    }
                }
            }
            return cal;
        },

        /**
        * Sets the month on a Date object, taking into account year rollover if the month is less than 0 or greater than 11.
        * The Date object passed in is modified. It should be cloned before passing it into this method if the original value needs to be maintained
        * @method    _setMonthOnDate
        * @private
        * @param    {Date}    date    The Date object on which to set the month index
        * @param    {Number}    iMonth    The month index to set
        */
        _setMonthOnDate: function(date, iMonth) {
            // Bug in Safari 1.3, 2.0 (WebKit build < 420), Date.setMonth does not work consistently if iMonth is not 0-11
            if (Rui.browser.webkit && Rui.browser.webkit < 420 && (iMonth < 0 || iMonth > 11)) {
                var newDate = LDateMath.add(date, LDateMath.MONTH, iMonth - date.getMonth());
                date.setTime(newDate.getTime());
            } else {
                date.setMonth(iMonth);
            }
        },

        /**
        * Fixes the width of the LCalendarGroup container element, to account for miswrapped floats
        * @method _fixWidth
        * @private
        */
        _fixWidth: function() {
            var w = 0;
            for (var p = 0; p < this.pages.length; ++p) {
                var cal = this.pages[p];
                w += cal.oDomContainer.offsetWidth;
            }
            if (w > 0) {
                this.oDomContainer.style.width = w + 'px';
            }
        },

        /**
        * Returns a string representation of the object.
        * @method toString
        * @return {String}    A string representation of the LCalendarGroup object.
        */
        toString: function() {
            return 'LCalendarGroup ' + this.id;
        },

        /**
        * Destroys the LCalendarGroup instance. The method will remove references
        * to HTML elements, remove any event listeners added by the LCalendarGroup.
        * 
        * It will also destroy the Config and LCalendarNavigator instances created by the 
        * LCalendarGroup and the individual LCalendar instances created for each page.
        *
        * @method destroy
        */
        destroy: function() {

            if (this.beforeDestroyEvent.fire()) {

                var cal = this;

                // Child objects
                if (cal.navigator) {
                    cal.navigator.destroy();
                }

                if (cal.cfg) {
                    cal.cfg.destroy();
                }

                // DOM event listeners
                Event.purgeElement(cal.oDomContainer, true);

                // Generated markup/DOM - Not removing the container DIV since we didn't create it.
                Dom.removeClass(cal.oDomContainer, LCalendarGroup.CSS_CONTAINER);
                Dom.removeClass(cal.oDomContainer, LCalendarGroup.CSS_MULTI_UP);

                for (var i = 0, l = cal.pages.length; i < l; i++) {
                    cal.pages[i].destroy();
                    cal.pages[i] = null;
                }

                cal.oDomContainer.innerHTML = '';

                // JS-to-DOM references
                cal.oDomContainer = null;

                this.destroyEvent.fire();
            }
        }
    };

    /**
    * CSS class representing the container for the calendar
    * @property CSS_CONTAINER
    * @static
    * @final
    * @type String
    */
    LCalendarGroup.CSS_CONTAINER = 'L-calcontainer';

    /**
    * CSS class representing the container for the calendar
    * @property CSS_MULTI_UP
    * @static
    * @final
    * @type String
    */
    LCalendarGroup.CSS_MULTI_UP = 'L-multi';

    /**
    * CSS class representing the title for the 2-up calendar
    * @property CSS_2UPTITLE
    * @static
    * @final
    * @type String
    */
    LCalendarGroup.CSS_2UPTITLE = 'L-title';

    /**
    * CSS class representing the close icon for the 2-up calendar
    * @property CSS_2UPCLOSE
    * @static
    * @final
    * @deprecated    Along with LCalendar.IMG_ROOT and NAV_ARROW_LEFT, NAV_ARROW_RIGHT configuration properties.
    *                    LCalendar's <a href='Rui.ui.calendar.LCalendar.html#Style.CSS_CLOSE'>Style.CSS_CLOSE</a> property now represents the CSS class used to render the close icon
    * @type String
    */
    LCalendarGroup.CSS_2UPCLOSE = 'close-icon';

    Rui.applyPrototype(LCalendarGroup, LCalendar, 'buildDayLabel',
         'buildMonthLabel',
         'renderOutOfBoundsDate',
         'renderRowHeader',
         'renderRowFooter',
         'renderCellDefault',
         'styleCellDefault',
         'renderCellStyleHighlight1',
         'renderCellStyleHighlight2',
         'renderCellStyleHighlight3',
         'renderCellStyleHighlight4',
         'renderCellStyleToday',
         'renderCellStyleSelected',
         'renderCellNotThisMonth',
         'renderBodyCellRestricted',
         'initStyles',
         'configTitle',
         'configClose',
         'configIframe',
         'configStrings',
         'configNavigator',
         'createTitleBar',
         'createCloseButton',
         'removeTitleBar',
         'removeCloseButton',
         'hide',
         'show',
         'toDate',
         '_toDate',
         '_parseArgs',
         'browser'
     );

    Rui.ui.calendar.LCalendarGroup = LCalendarGroup;

})();


/**
* The LCalendarNavigator is used along with a LCalendar/LCalendarGroup to 
* provide a Month/Year popup navigation control, allowing the user to navigate 
* to a specific month/year in the LCalendar/LCalendarGroup without having to 
* scroll through months sequentially
*
* @module ui_calendar
* @namespace Rui.ui.calendar
* @class LCalendarNavigator
* @constructor
* @private
* @param {LCalendar|LCalendarGroup} cal The instance of the LCalendar or LCalendarGroup to which this LCalendarNavigator should be attached.
*/
Rui.ui.calendar.LCalendarNavigator = function(cal) {
    this.init(cal);
};

(function() {
    // Setup static properties (inside anon fn, so that we can use shortcuts)
    var CN = Rui.ui.calendar.LCalendarNavigator;

    /**
    * Rui.ui.calendar.LCalendarNavigator.CLASSES contains constants
    * for the class values applied to the CalendarNaviatgator's 
    * DOM elements
    * @property CLASSES
    * @private
    * @type Object
    * @static
    */
    CN.CLASSES = {
        /**
        * Class applied to the LCalendar Navigator's bounding box
        * @property CLASSES.NAV
        * @private
        * @type String
        * @static
        */
        NAV: 'L-cal-nav',
        /**
        * Class applied to the LCalendar/LCalendarGroup's bounding box to indicate
        * the Navigator is currently visible
        * @property CLASSES.NAV_VISIBLE
        * @private
        * @type String
        * @static
        */
        NAV_VISIBLE: 'L-cal-nav-visible',
        /**
        * Class applied to the Navigator mask's bounding box
        * @property CLASSES.MASK
        * @private
        * @type String
        * @static
        */
        MASK: 'L-cal-nav-mask',
        /**
        * Class applied to the year label/control bounding box
        * @property CLASSES.YEAR
        * @private
        * @type String
        * @static
        */
        YEAR: 'L-cal-nav-y',
        /**
        * Class applied to the month label/control bounding box
        * @property CLASSES.MONTH
        * @private
        * @type String
        * @static
        */
        MONTH: 'L-cal-nav-m',
        /**
        * Class applied to the submit/cancel button's bounding box
        * @property CLASSES.BUTTONS
        * @private
        * @type String
        * @static
        */
        BUTTONS: 'L-cal-nav-b',
        /**
        * Class applied to buttons wrapping element
        * @property CLASSES.BUTTON
        * @private
        * @type String
        * @static
        */
        BUTTON: 'L-cal-nav-btn',
        /**
        * Class applied to the validation error area's bounding box
        * @property CLASSES.ERROR
        * @private
        * @type String
        * @static
        */
        ERROR: 'L-cal-nav-e',
        /**
        * Class applied to the year input control
        * @property CLASSES.YEAR_CTRL
        * @private
        * @type String
        * @static
        */
        YEAR_CTRL: 'L-cal-nav-yc',
        /**
        * Class applied to the month input control
        * @property CLASSES.MONTH_CTRL
        * @private
        * @type String
        * @static
        */
        MONTH_CTRL: 'L-cal-nav-mc',
        /**
        * Class applied to controls with invalid data (e.g. a year input field with invalid an year)
        * @property CLASSES.INVALID
        * @private
        * @type String
        * @static
        */
        INVALID: 'L-invalid',
        /**
        * Class applied to default controls
        * @property CLASSES.DEFAULT
        * @private
        * @type String
        * @static
        */
        DEFAULT: 'L-default'
    };

    /**
    * Object literal containing the default configuration values for the LCalendarNavigator
    * The configuration object is expected to follow the format below, with the properties being
    * case sensitive.
    * <dl>
    * <dt>strings</dt>
    * <dd><em>Object</em> :  An object with the properties shown below, defining the string labels to use in the Navigator's UI
    *     <dl>
    *         <dt>month</dt><dd><em>String</em> : The string to use for the month label. Defaults to 'Month'.</dd>
    *         <dt>year</dt><dd><em>String</em> : The string to use for the year label. Defaults to 'Year'.</dd>
    *         <dt>submit</dt><dd><em>String</em> : The string to use for the submit button label. Defaults to 'Okay'.</dd>
    *         <dt>cancel</dt><dd><em>String</em> : The string to use for the cancel button label. Defaults to 'Cancel'.</dd>
    *         <dt>invalidYear</dt><dd><em>String</em> : The string to use for invalid year values. Defaults to 'Year needs to be a number'.</dd>
    *     </dl>
    * </dd>
    * <dt>monthFormat</dt><dd><em>String</em> : The month format to use. Either Rui.ui.calendar.LCalendar.LONG, or Rui.ui.calendar.LCalendar.SHORT. Defaults to Rui.ui.calendar.LCalendar.LONG</dd>
    * <dt>initialFocus</dt><dd><em>String</em> : Either 'year' or 'month' specifying which input control should get initial focus. Defaults to 'year'</dd>
    * </dl>
    * @property _DEFAULT_CFG
    * @protected
    * @type Object
    * @static
    */
    CN._DEFAULT_CFG = null;

    /**
    * The suffix added to the LCalendar/LCalendarGroup's ID, to generate
    * a unique ID for the Navigator and it's bounding box.
    * @property ID_SUFFIX
    * @static
    * @type String
    * @final
    */
    CN.ID_SUFFIX = '_nav';
    /**
    * The suffix added to the Navigator's ID, to generate
    * a unique ID for the month control.
    * @property MONTH_SUFFIX
    * @static
    * @type String 
    * @final
    */
    CN.MONTH_SUFFIX = '_month';
    /**
    * The suffix added to the Navigator's ID, to generate
    * a unique ID for the year control.
    * @property YEAR_SUFFIX
    * @static
    * @type String
    * @final
    */
    CN.YEAR_SUFFIX = '_year';
    /**
    * The suffix added to the Navigator's ID, to generate
    * a unique ID for the error bounding box.
    * @property ERROR_SUFFIX
    * @static
    * @type String
    * @final
    */
    CN.ERROR_SUFFIX = '_error';
    /**
    * The suffix added to the Navigator's ID, to generate
    * a unique ID for the 'Cancel' button.
    * @property CANCEL_SUFFIX
    * @static
    * @type String
    * @final
    */
    CN.CANCEL_SUFFIX = '_cancel';
    /**
    * The suffix added to the Navigator's ID, to generate
    * a unique ID for the 'Submit' button.
    * @property SUBMIT_SUFFIX
    * @static
    * @type String
    * @final
    */
    CN.SUBMIT_SUFFIX = '_submit';

    /**
    * The number of digits to which the year input control is to be limited.
    * @property YR_MAX_DIGITS
    * @static
    * @type Number
    */
    CN.YR_MAX_DIGITS = 4;

    /**
    * The amount by which to increment the current year value,
    * when the arrow up/down key is pressed on the year control
    * @property YR_MINOR_INC
    * @static
    * @type Number
    */
    CN.YR_MINOR_INC = 1;

    /**
    * The amount by which to increment the current year value,
    * when the page up/down key is pressed on the year control
    * @property YR_MAJOR_INC
    * @static
    * @type Number
    */
    CN.YR_MAJOR_INC = 10;

    /**
    * Artificial delay (in ms) between the time the Navigator is hidden
    * and the LCalendar/LCalendarGroup state is updated. Allows the user
    * the see the LCalendar/LCalendarGroup page changing. If set to 0
    * the LCalendar/LCalendarGroup page will be updated instantly
    * @property UPDATE_DELAY
    * @static
    * @type Number
    */
    CN.UPDATE_DELAY = 50;

    /**
    * Regular expression used to validate the year input
    * @property YR_PATTERN
    * @static
    * @type RegExp
    */
    CN.YR_PATTERN = /^\d+$/;
    /**
    * Regular expression used to trim strings
    * @property TRIM
    * @static
    * @type RegExp
    */
    CN.TRIM = /^\s*(.*?)\s*$/;
})();

Rui.ui.calendar.LCalendarNavigator.prototype = {

    /**
    * The unique ID for this LCalendarNavigator instance
    * @property id
    * @type String
    */
    id: null,

    /**
    * The LCalendar/LCalendarGroup instance to which the navigator belongs
    * @property cal
    * @type {LCalendar|LCalendarGroup}
    */
    cal: null,

    /**
    * Reference to the HTMLElement used to render the navigator's bounding box
    * @property navEl
    * @type HTMLElement
    */
    navEl: null,

    /**
    * Reference to the HTMLElement used to render the navigator's mask
    * @property maskEl
    * @type HTMLElement
    */
    maskEl: null,

    /**
    * Reference to the HTMLElement used to input the year
    * @property yearEl
    * @type HTMLElement
    */
    yearEl: null,

    /**
    * Reference to the HTMLElement used to input the month
    * @property monthEl
    * @type HTMLElement
    */
    monthEl: null,

    /**
    * Reference to the HTMLElement used to display validation errors
    * @property errorEl
    * @type HTMLElement
    */
    errorEl: null,

    /**
    * Reference to the HTMLElement used to update the LCalendar/LCalendar group
    * with the month/year values
    * @property submitEl
    * @type HTMLElement
    */
    submitEl: null,

    /**
    * Reference to the HTMLElement used to hide the navigator without updating the 
    * LCalendar/LCalendar group
    * @property cancelEl
    * @type HTMLElement
    */
    cancelEl: null,

    /** 
    * Reference to the first focusable control in the navigator (by default monthEl)
    * @property firstCtrl
    * @type HTMLElement
    */
    firstCtrl: null,

    /** 
    * Reference to the last focusable control in the navigator (by default cancelEl)
    * @property lastCtrl
    * @type HTMLElement
    */
    lastCtrl: null,

    /**
    * The document containing the LCalendar/LCalendar group instance
    * @protected
    * @property _doc
    * @type HTMLDocument
    */
    _doc: null,

    /**
    * Internal state property for the current year displayed in the navigator
    * @protected
    * @property _year
    * @type Number
    */
    _year: null,

    /**
    * Internal state property for the current month index displayed in the navigator
    * @protected
    * @property _month
    * @type Number
    */
    _month: 0,

    /**
    * Private internal state property which indicates whether or not the 
    * Navigator has been rendered.
    * @private
    * @property __rendered
    * @type Boolean
    */
    __rendered: false,

    /**
    * Init lifecycle method called as part of construction
    * @method init
    * @protected
    * @param {LCalendar} cal The instance of the LCalendar or LCalendarGroup to which this LCalendarNavigator should be attached
    */
    init: function(cal) {
        var calBox = cal.oDomContainer;

        this.cal = cal;
        this.id = calBox.id + Rui.ui.calendar.LCalendarNavigator.ID_SUFFIX;
        this._doc = calBox.ownerDocument;

        /**
        * Private flag, to identify IE Quirks
        * @private
        * @property __isIEQuirks
        */
        var ie = Rui.browser.msie;
        this.__isIEQuirks = (ie && ((ie <= 6) || (this._doc.compatMode == 'BackCompat')));
    },

    /**
    * Displays the navigator and mask, updating the input controls to reflect the 
    * currently set month and year. The show method will invoke the render method
    * if the navigator has not been renderered already, allowing for lazy rendering
    * of the control.
    * 
    * The show method will fire the LCalendar/LCalendarGroup's beforeShowNav and showNav events
    * @method show
    * @protected
    */
    show: function() {
        var CLASSES = Rui.ui.calendar.LCalendarNavigator.CLASSES;

        if (this.cal.beforeShowNavEvent.fire()) {
            if (!this.__rendered) {
                this.render();
            }
            this.clearErrors();

            this._updateMonthUI();
            this._updateYearUI();

            this._show(this.monthComboEl, !Rui.isUndefined(Rui.ui.calendar.LMonthCalendar)?((this.cal instanceof Rui.ui.calendar.LMonthCalendar) ? false : true) : true );
            this._show(this.navEl, true);

            this.setInitialFocus();
            this.showMask();

            Rui.util.LDom.addClass(this.cal.oDomContainer, CLASSES.NAV_VISIBLE);
            this.cal.showNavEvent.fire();
        }
    },

    /**
    * Hides the navigator and mask
    * The show method will fire the LCalendar/LCalendarGroup's beforeHideNav event and hideNav events
    * @method hide
    * @protected
    */
    hide: function() {
        var CLASSES = Rui.ui.calendar.LCalendarNavigator.CLASSES;

        if (this.cal.beforeHideNavEvent.fire()) {
            this._show(this.navEl, false);
            this.hideMask();
            Rui.util.LDom.removeClass(this.cal.oDomContainer, CLASSES.NAV_VISIBLE);
            this.cal.hideNavEvent.fire();
        }
    },


    /**
    * Displays the navigator's mask element
    * @method showMask
    * @protected
    */
    showMask: function() {
        this._show(this.maskEl, true);
        if (this.__isIEQuirks) {
            this._syncMask();
        }
    },

    /**
    * Hides the navigator's mask element
    * @method hideMask
    * @protected
    */
    hideMask: function() {
        this._show(this.maskEl, false);
    },

    /**
    * Returns the current month set on the navigator
    * Note: This may not be the month set in the UI, if 
    * the UI contains an invalid value.
    * @method getMonth
    * @protected
    * @return {Number} The Navigator's current month index
    */
    getMonth: function() {
        return this._month;
    },

    /**
    * Returns the current year set on the navigator
    * 
    * Note: This may not be the year set in the UI, if 
    * the UI contains an invalid value.
    * 
    * @method getYear
    * @return {Number} The Navigator's current year value
    */
    getYear: function() {
        return this._year;
    },

    /**
    * Sets the current month on the Navigator, and updates the UI
    * @method setMonth
    * @protected
    * @param {Number} nMonth The month index, from 0 (Jan) through 11 (Dec).
    */
    setMonth: function(nMonth) {
        if (nMonth >= 0 && nMonth < 12) {
            this._month = nMonth;
        }
        this._updateMonthUI();
    },

    /**
    * Sets the current year on the Navigator, and updates the UI. If the 
    * provided year is invalid, it will not be set.
    * @method setYear
    * @protected
    * @param {Number} nYear The full year value to set the Navigator to.
    */
    setYear: function(nYear) {
        var yrPattern = Rui.ui.calendar.LCalendarNavigator.YR_PATTERN;
        if (Rui.isNumber(nYear) && yrPattern.test(nYear + '')) {
            this._year = nYear;
        }
        this._updateYearUI();
    },

    /**
    * Renders the HTML for the navigator, adding it to the 
    * document and attaches event listeners if it has not 
    * already been rendered.
    * 
    * @method render
    */
    render: function() {
        this.cal.beforeRenderNavEvent.fire();
        if (!this.__rendered) {
            this.createNav();
            this.createMask();
            this.applyListeners();
            this.__rendered = true;
        }
        this.cal.renderNavEvent.fire();
    },

    /**
    * Creates the navigator's containing HTMLElement, it's contents, and appends 
    * the containg element to the LCalendar/LCalendarGroup's container.
    * @method createNav
    * @protected
    */
    createNav: function() {
        var NAV = Rui.ui.calendar.LCalendarNavigator;
        var doc = this._doc;

        var d = doc.createElement('div');
        d.className = NAV.CLASSES.NAV;

        var htmlBuf = this.renderNavContents([]);

        d.innerHTML = htmlBuf.join('');
        this.cal.oDomContainer.appendChild(d);

        this.navEl = d;

        this.monthComboEl = d.childNodes[0];
        this.yearEl = doc.getElementById(this.id + NAV.YEAR_SUFFIX);
        this.monthEl = doc.getElementById(this.id + NAV.MONTH_SUFFIX);
        this.errorEl = doc.getElementById(this.id + NAV.ERROR_SUFFIX);
        this.submitEl = doc.getElementById(this.id + NAV.SUBMIT_SUFFIX);
        this.cancelEl = doc.getElementById(this.id + NAV.CANCEL_SUFFIX);

        if (Rui.browser.gecko && this.yearEl && this.yearEl.type == 'text') {
            // Avoid XUL error on focus, select [ https://bugzilla.mozilla.org/show_bug.cgi?id=236791, 
            // supposedly fixed in 1.8.1, but there are reports of it still being around for methods other than blur ]
            this.yearEl.setAttribute('autocomplete', 'off');
        }

        this._setFirstLastElements();
    },

    /**
    * Creates the Mask HTMLElement and appends it to the LCalendar/CalendarGroups
    * container.
    * @method createMask
    * @protected
    */
    createMask: function() {
        var C = Rui.ui.calendar.LCalendarNavigator.CLASSES;

        var d = this._doc.createElement('div');
        d.className = C.MASK;

        this.cal.oDomContainer.appendChild(d);
        this.maskEl = d;
    },

    /**
    * Used to set the width/height of the mask in pixels to match the LCalendar Container.
    * Currently only used for IE6 or IE in quirks mode. The other A-Grade browser are handled using CSS (width/height 100%).
    * <p>
    * The method is also registered as an HTMLElement resize listener on the Calendars container element.
    * </p>
    * @protected
    * @method _syncMask
    */
    _syncMask: function() {
        var c = this.cal.oDomContainer;
        if (c && this.maskEl) {
            var r = Rui.util.LDom.getRegion(c);
            Rui.util.LDom.setStyle(this.maskEl, 'width', r.right - r.left + 'px');
            Rui.util.LDom.setStyle(this.maskEl, 'height', r.bottom - r.top + 'px');
        }
    },

    /**
    * Renders the contents of the navigator
    * @method renderNavContents
    * @protected
    * @param {Array} html The HTML buffer to append the HTML to.
    * @return {Array} A reference to the buffer passed in.
    */
    renderNavContents: function(html) {
        var NAV = Rui.ui.calendar.LCalendarNavigator,
            C = NAV.CLASSES,
            h = html; // just to use a shorter name

        h[h.length] = '<div class="' + C.MONTH + '">';
        this.renderMonth(h);
        h[h.length] = '</div>';
        h[h.length] = '<div class="' + C.YEAR + '">';
        this.renderYear(h);
        h[h.length] = '</div>';
        h[h.length] = '<div class="' + C.BUTTONS + '">';
        this.renderButtons(h);
        h[h.length] = '</div>';
        h[h.length] = '<div class="' + C.ERROR + '" id="' + this.id + NAV.ERROR_SUFFIX + '"></div>';

        return h;
    },

    /**
    * Renders the month label and control for the navigator
    * 
    * @method renderMonth
    * @protected
    * @param {Array} html The HTML buffer to append the HTML to.
    * @return {Array} A reference to the buffer passed in.
    */
    renderMonth: function(html) {
        var NAV = Rui.ui.calendar.LCalendarNavigator,
            C = NAV.CLASSES;

        var id = this.id + NAV.MONTH_SUFFIX,
            mf = this.__getCfg('monthFormat'),
            months = this.cal.cfg.getProperty((mf == Rui.ui.calendar.LCalendar.SHORT) ? 'MONTHS_SHORT' : 'MONTHS_LONG'),
            h = html;

        if (months && months.length > 0) {
            h[h.length] = '<label for="' + id + '">';
            h[h.length] = this.__getCfg("month", true);
            h[h.length] = '</label>';
            h[h.length] = '<select name="' + id + '" id="' + id + '" class="' + C.MONTH_CTRL + '">';
            for (var i = 0; i < months.length; i++) {
                h[h.length] = '<option value="' + i + '">';
                h[h.length] = months[i];
                h[h.length] = '</option>';
            }
            h[h.length] = '</select>';
        }
        return h;
    },

    /**
    * Renders the year label and control for the navigator
    * 
    * @method renderYear
    * @protected
    * @param {Array} html The HTML buffer to append the HTML to.
    * @return {Array} A reference to the buffer passed in.
    */
    renderYear: function(html) {
        var NAV = Rui.ui.calendar.LCalendarNavigator,
            C = NAV.CLASSES;

        var id = this.id + NAV.YEAR_SUFFIX,
            size = NAV.YR_MAX_DIGITS,
            h = html;

        h[h.length] = '<label for="' + id + '">';
        h[h.length] = this.__getCfg('year', true);
        h[h.length] = '</label>';
        h[h.length] = '<input type="text" name="' + id + '" id="' + id + '" class="' + C.YEAR_CTRL + '" maxlength="' + size + '"/>';
        return h;
    },

    /**
    * Renders the submit/cancel buttons for the navigator
    * 
    * @method renderButton
    * @protected
    * @return {String} The HTML created for the LButton UI
    */
    renderButtons: function(html) {
        var C = Rui.ui.calendar.LCalendarNavigator.CLASSES;
        var h = html;

        h[h.length] = '<span class="' + C.BUTTON + ' ' + C.DEFAULT + '">';
        h[h.length] = '<button type="button" id="' + this.id + '_submit' + '">';
        h[h.length] = this.__getCfg('submit', true);
        h[h.length] = '</button>';
        h[h.length] = '</span>';
        h[h.length] = '<span class="' + C.BUTTON + '">';
        h[h.length] = '<button type="button" id="' + this.id + '_cancel' + '">';
        h[h.length] = this.__getCfg('cancel', true);
        h[h.length] = '</button>';
        h[h.length] = '</span>';

        return h;
    },

    /**
    * Attaches DOM event listeners to the rendered elements
    * <p>
    * The method will call applyKeyListeners, to setup keyboard specific 
    * listeners
    * </p>
    * @method applyListeners
    * @protected
    */
    applyListeners: function() {
        var E = Rui.util.LEvent;

        function yearUpdateHandler() {
            if (this.validate()) {
                this.setYear(this._getYearFromUI());
            }
        }

        function monthUpdateHandler() {
            this.setMonth(this._getMonthFromUI());
        }

        E.on(this.submitEl, 'click', this.submit, this, true);
        E.on(this.cancelEl, 'click', this.cancel, this, true);
        E.on(this.yearEl, 'blur', yearUpdateHandler, this, true);
        E.on(this.monthEl, 'change', monthUpdateHandler, this, true);

        if (this.__isIEQuirks) {
            Rui.util.LEvent.on(this.cal.oDomContainer, 'resize', this._syncMask, this, true);
        }

        this.applyKeyListeners();
    },

    /**
    * Removes/purges DOM event listeners from the rendered elements
    * 
    * @method purgeListeners
    * @protected
    */
    purgeListeners: function() {
        var E = Rui.util.LEvent;
        E.removeListener(this.submitEl, 'click', this.submit);
        E.removeListener(this.cancelEl, 'click', this.cancel);
        E.removeListener(this.yearEl, 'blur');
        E.removeListener(this.monthEl, 'change');
        if (this.__isIEQuirks) {
            E.removeListener(this.cal.oDomContainer, 'resize', this._syncMask);
        }

        this.purgeKeyListeners();
    },

    /**
    * Attaches DOM listeners for keyboard support. 
    * Tab/Shift-Tab looping, Enter Key Submit on Year element,
    * Up/Down/PgUp/PgDown year increment on Year element
    * <p>
    * NOTE: MacOSX Safari 2.x doesn't let you tab to buttons and 
    * MacOSX Gecko does not let you tab to buttons or select controls,
    * so for these browsers, Tab/Shift-Tab looping is limited to the 
    * elements which can be reached using the tab key.
    * </p>
    * @method applyKeyListeners
    * @protected
    */
    applyKeyListeners: function() {
        var E = Rui.util.LEvent,
            ua = Rui.browser;

        // IE/Safari 3.1 doesn't fire keypress for arrow/pg keys (non-char keys)
        var arrowEvt = (ua.ie || ua.webkit) ? 'keydown' : 'keypress';

        // - IE/Safari 3.1 doesn't fire keypress for non-char keys
        // - Opera doesn't allow us to cancel keydown or keypress for tab, but 
        //   changes focus successfully on keydown (keypress is too late to change focus - opera's already moved on).
        var tabEvt = (ua.ie || ua.opera || ua.webkit) ? 'keydown' : 'keypress';

        // Everyone likes keypress for Enter (char keys) - whoo hoo!
        E.on(this.yearEl, 'keypress', this._handleEnterKey, this, true);

        E.on(this.yearEl, arrowEvt, this._handleDirectionKeys, this, true);
        E.on(this.lastCtrl, tabEvt, this._handleTabKey, this, true);
        E.on(this.firstCtrl, tabEvt, this._handleShiftTabKey, this, true);
    },

    /**
    * Removes/purges DOM listeners for keyboard support
    *
    * @method purgeKeyListeners
    * @protected
    */
    purgeKeyListeners: function() {
        var E = Rui.util.LEvent,
            ua = Rui.browser;

        var arrowEvt = (ua.ie || ua.webkit) ? 'keydown' : 'keypress';
        var tabEvt = (ua.ie || ua.opera || ua.webkit) ? 'keydown' : 'keypress';

        E.removeListener(this.yearEl, 'keypress', this._handleEnterKey);
        E.removeListener(this.yearEl, arrowEvt, this._handleDirectionKeys);
        E.removeListener(this.lastCtrl, tabEvt, this._handleTabKey);
        E.removeListener(this.firstCtrl, tabEvt, this._handleShiftTabKey);
    },

    /**
    * Updates the LCalendar/LCalendarGroup's pagedate with the currently set month and year if valid.
    * <p>
    * If the currently set month/year is invalid, a validation error will be displayed and the 
    * LCalendar/LCalendarGroup's pagedate will not be updated.
    * </p>
    * @method submit
    * @protected
    */
    submit: function() {
        if (this.validate()) {
            this.hide();

            this.setMonth(this._getMonthFromUI());
            this.setYear(this._getYearFromUI());

            var cal = this.cal;

            // Artificial delay, just to help the user see something changed
            var delay = Rui.ui.calendar.LCalendarNavigator.UPDATE_DELAY;
            if (delay > 0) {
                var nav = this;
                window.setTimeout(function() { nav._update(cal); }, delay);
            } else {
                this._update(cal);
            }
        }
    },

    /**
    * Updates the LCalendar rendered state, based on the state of the LCalendarNavigator
    * @method _update
    * @param cal The LCalendar instance to update
    * @protected
    */
    _update: function(cal) {
        cal.setYear(this.getYear());
        cal.setMonth(this.getMonth());
        cal.render();
    },

    /**
    * Hides the navigator and mask, without updating the LCalendar/LCalendarGroup's state
    * 
    * @method cancel
    * @protected
    */
    cancel: function() {
        this.hide();
    },

    /**
    * Validates the current state of the UI controls
    * 
    * @method validate
    * @protected
    * @return {boolean} true, if the current UI state contains valid values, false if not
    */
    validate: function() {
        if (this._getYearFromUI() !== null) {
            this.clearErrors();
            return true;
        } else {
            this.setYearError();
            this.setError(this.__getCfg('invalidYear', true));
            return false;
        }
    },

    /**
    * Displays an error message in the Navigator's error panel
    * @method setError
    * @protected
    * @param {String} msg The error message to display
    */
    setError: function(msg) {
        if (this.errorEl) {
            this.errorEl.innerHTML = msg;
            this._show(this.errorEl, true);
        }
    },

    /**
    * Clears the navigator's error message and hides the error panel
    * @method clearError 
    */
    clearError: function() {
        if (this.errorEl) {
            this.errorEl.innerHTML = '';
            this._show(this.errorEl, false);
        }
    },

    /**
    * Displays the validation error UI for the year control
    * @method setYearError
    * @protected
    */
    setYearError: function() {
        Rui.util.LDom.addClass(this.yearEl, Rui.ui.calendar.LCalendarNavigator.CLASSES.INVALID);
    },

    /**
    * Removes the validation error UI for the year control
    * @method clearYearError
    * @protected
    */
    clearYearError: function() {
        Rui.util.LDom.removeClass(this.yearEl, Rui.ui.calendar.LCalendarNavigator.CLASSES.INVALID);
    },

    /**
    * Clears all validation and error messages in the UI
    * @method clearErrors
    * @protected
    */
    clearErrors: function() {
        this.clearError();
        this.clearYearError();
    },

    /**
    * Sets the initial focus, based on the configured value
    * @method setInitialFocus
    * @protected
    */
    setInitialFocus: function() {
        var el = this.submitEl,
            f = this.__getCfg('initialFocus');

        if (f && f.toLowerCase) {
            f = f.toLowerCase();
            if (f == 'year') {
                el = this.yearEl;
                try {
                    this.yearEl.select();
                } catch (selErr) {
                    // Ignore;
                }
            } else if (f == 'month') {
                el = this.monthEl;
            }
        }

        if (el && Rui.isFunction(el.focus)) {
            try {
                el.focus();
            } catch (focusErr) {
                // TODO: Fall back if focus fails?
            }
        }
    },

    /**
    * Removes all renderered HTML elements for the Navigator from
    * the DOM, purges event listeners and clears (nulls) any property
    * references to HTML references
    * @method erase
    */
    erase: function() {
        if (this.__rendered) {
            this.purgeListeners();

            // Clear out innerHTML references
            this.yearEl = null;
            this.monthEl = null;
            this.errorEl = null;
            this.submitEl = null;
            this.cancelEl = null;
            this.firstCtrl = null;
            this.lastCtrl = null;
            if (this.navEl) {
                this.navEl.innerHTML = '';
            }

            var p = this.navEl.parentNode;
            if (p) {
                p.removeChild(this.navEl);
            }
            this.navEl = null;

            var pm = this.maskEl.parentNode;
            if (pm) {
                pm.removeChild(this.maskEl);
            }
            this.maskEl = null;
            this.__rendered = false;
        }
    },

    /**
    * Destroys the Navigator object and any HTML references
    * @method destroy
    */
    destroy: function() {
        this.erase();
        this._doc = null;
        this.cal = null;
        this.id = null;
    },

    /**
    * Protected implementation to handle how UI elements are 
    * hidden/shown.
    *
    * @method _show
    * @protected
    */
    _show: function(el, bShow) {
        if (el) {
            Rui.util.LDom.setStyle(el, 'display', (bShow) ? 'block' : 'none');
        }
    },

    /**
    * Returns the month value (index), from the month UI element
    * @protected
    * @method _getMonthFromUI
    * @return {Number} The month index, or 0 if a UI element for the month
    * is not found
    */
    _getMonthFromUI: function() {
        if (this.monthEl) {
            return this.monthEl.selectedIndex;
        } else {
            return 0; // Default to Jan
        }
    },

    /**
    * Returns the year value, from the Navitator's year UI element
    * @protected
    * @method _getYearFromUI
    * @return {Number} The year value set in the UI, if valid. null is returned if 
    * the UI does not contain a valid year value.
    */
    _getYearFromUI: function() {
        var NAV = Rui.ui.calendar.LCalendarNavigator;

        var yr = null;
        if (this.yearEl) {
            var value = this.yearEl.value;
            value = value.replace(NAV.TRIM, '$1');

            if (NAV.YR_PATTERN.test(value)) {
                yr = parseInt(value, 10);
            }
        }
        return yr;
    },

    /**
    * Updates the Navigator's year UI, based on the year value set on the Navigator object
    * @protected
    * @method _updateYearUI
    */
    _updateYearUI: function() {
        if (this.yearEl && this._year !== null) {
            this.yearEl.value = this._year;
        }
    },

    /**
    * Updates the Navigator's month UI, based on the month value set on the Navigator object
    * @protected
    * @method _updateMonthUI
    */
    _updateMonthUI: function() {
        if (this.monthEl) {
            this.monthEl.selectedIndex = this._month;
        }
    },

    /**
    * Sets up references to the first and last focusable element in the Navigator's UI
    * in terms of tab order (Naviagator's firstEl and lastEl properties). The references
    * are used to control modality by looping around from the first to the last control
    * and visa versa for tab/shift-tab navigation.
    * <p>
    * See <a href="#applyKeyListeners">applyKeyListeners</a>
    * </p>
    * @protected
    * @method _setFirstLastElements
    */
    _setFirstLastElements: function() {
        this.firstCtrl = this.monthEl;
        this.lastCtrl = this.cancelEl;

        // Special handling for MacOSX.
        // - Safari 2.x can't focus on buttons
        // - Gecko can't focus on select boxes or buttons
        if (this.__isMac) {
            if (Rui.browser.webkit && Rui.browser.webkit < 420) {
                this.firstCtrl = this.monthEl;
                this.lastCtrl = this.yearEl;
            }
            if (Rui.browser.gecko) {
                this.firstCtrl = this.yearEl;
                this.lastCtrl = this.yearEl;
            }
        }
    },

    /**
    * Default Keyboard event handler to capture Enter 
    * on the Navigator's year control (yearEl)
    * 
    * @method _handleEnterKey
    * @protected
    * @param {Event} e The DOM event being handled
    */
    _handleEnterKey: function(e) {
        var KEYS = Rui.util.LKey.KEY;

        if (Rui.util.LEvent.getCharCode(e) == KEYS.ENTER) {
            Rui.util.LEvent.preventDefault(e);
            this.submit();
        }
    },

    /**
    * Default Keyboard event handler to capture up/down/pgup/pgdown
    * on the Navigator's year control (yearEl).
    * 
    * @method _handleDirectionKeys
    * @protected
    * @param {Event} e The DOM event being handled
    */
    _handleDirectionKeys: function(e) {
        var E = Rui.util.LEvent,
            KEYS = Rui.util.LKey.KEY,
            NAV = Rui.ui.calendar.LCalendarNavigator;

        var value = (this.yearEl.value) ? parseInt(this.yearEl.value, 10) : null;
        if (isFinite(value)) {
            var dir = false;
            switch (E.getCharCode(e)) {
                case KEYS.UP:
                    this.yearEl.value = value + NAV.YR_MINOR_INC;
                    dir = true;
                    break;
                case KEYS.DOWN:
                    this.yearEl.value = Math.max(value - NAV.YR_MINOR_INC, 0);
                    dir = true;
                    break;
                case KEYS.PAGE_UP:
                    this.yearEl.value = value + NAV.YR_MAJOR_INC;
                    dir = true;
                    break;
                case KEYS.PAGE_DOWN:
                    this.yearEl.value = Math.max(value - NAV.YR_MAJOR_INC, 0);
                    dir = true;
                    break;
                default:
                    break;
            }
            if (dir) {
                E.preventDefault(e);
                try {
                    this.yearEl.select();
                } catch (err) {
                    // Ignore
                }
            }
        }
    },

    /**
    * Default Keyboard event handler to capture Tab 
    * on the last control (lastCtrl) in the Navigator.
    * 
    * @method _handleTabKey
    * @protected
    * @param {Event} e The DOM event being handled
    */
    _handleTabKey: function(e) {
        var E = Rui.util.LEvent,
            KEYS = Rui.util.LKey.KEY;

        if (E.getCharCode(e) == KEYS.TAB && !e.shiftKey) {
            try {
                E.preventDefault(e);
                this.firstCtrl.focus();
            } catch (err) {
                // Ignore - mainly for focus edge cases
            }
        }
    },

    /**
    * Default Keyboard event handler to capture Shift-Tab 
    * on the first control (firstCtrl) in the Navigator.
    * 
    * @method _handleShiftTabKey
    * @protected
    * @param {Event} e The DOM event being handled
    */
    _handleShiftTabKey: function(e) {
        var E = Rui.util.LEvent,
            KEYS = Rui.util.LKey.KEY;

        if (e.shiftKey && E.getCharCode(e) == KEYS.TAB) {
            try {
                E.preventDefault(e);
                this.lastCtrl.focus();
            } catch (err) {
                // Ignore - mainly for focus edge cases
            }
        }
    },
    
    getDefaultCfg: function() {
    	if(!Rui.ui.calendar.LCalendarNavigator._DEFAULT_CFG) {
    		var mm = Rui.getMessageManager(); 
    		Rui.ui.calendar.LCalendarNavigator._DEFAULT_CFG = {
		        strings: {
		            month: mm.get('$.core.calendarNavigatorLabelMonth'),
		            year: mm.get('$.core.calendarNavigatorLabelYear'),
		            submit: mm.get('$.base.msg044'),
		            cancel: mm.get('$.base.msg121'),
		            invalidYear: 'Year needs to be a number'
		        },
		        monthFormat: Rui.ui.calendar.LCalendar.LONG,
		        initialFocus: 'year'
		    };
    	}
    	return Rui.ui.calendar.LCalendarNavigator._DEFAULT_CFG;
    },

    /**
    * Retrieve Navigator configuration values from 
    * the parent LCalendar/LCalendarGroup's config value.
    * <p>
    * If it has not been set in the user provided configuration, the method will 
    * return the default value of the configuration property, as set in _DEFAULT_CFG
    * </p>
    * @private
    * @method __getCfg
    * @param {String} Case sensitive property name.
    * @param {boolean} true, if the property is a string property, false if not.
    * @return The value of the configuration property
    */
    __getCfg: function(prop, bIsStr) {
        var DEF_CFG = this.getDefaultCfg();
        var cfg = this.cal.cfg.getProperty('navigator');

        if (bIsStr) {
            return (cfg !== true && cfg.strings && cfg.strings[prop]) ? cfg.strings[prop] : DEF_CFG.strings[prop];
        } else {
            return (cfg !== true && cfg[prop]) ? cfg[prop] : DEF_CFG[prop];
        }
    },

    /**
    * Private flag, to identify MacOS
    * @private
    * @property __isMac
    */
    __isMac: (navigator.userAgent.toLowerCase().indexOf('macintosh') != -1)

};