/*
 * @(#) rui_ui-debug.js
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

/**
 * LButton 객체는 form 입력 객체들을 추상 클래스
 * @module ui_form
 * @title Field
 * @requires Rui
 */
Rui.namespace('Rui.ui');
/**
 * LButton 객체는 form 입력 객체들을 추상 클래스
 * @namespace Rui.ui
 * @class LButton
 * @extends Rui.ui.LUIComponent
 * @constructor LButton
 * @param {HTMLElement | String} id The html element that represents the Element.
 * @param {Object} config The intial Field.
 */
Rui.ui.LButton = function(config){
    config = config || {};
    if(typeof config == 'string')
        config = {
            applyTo: config
        };
    config = Rui.applyIf(config, Rui.getConfig().getFirst('$.base.button.defaultProperties'));
    
    Rui.ui.LButton.superclass.constructor.call(this, config);
};
Rui.extend(Rui.ui.LButton, Rui.ui.LUIComponent, {
    otype: 'Rui.ui.LButton',
    /**
     * @description Base CSS
     * @property label
     * @private
     * @type {String}
     */
    CSS_BASE: 'L-button',
    /**
     * @description field의 name으로 input, select태그들의 name 속성 값
     * @config label
     * @sample default
     * @type {String}
     * @default null
     */
    /**
     * @description field의 name
     * @property label
     * @private
     * @type {String}
     */
    label: null,
    /**
     * @description button 태그의 type값
     * @config type
     * @sample default
     * @type {String}
     * @default 'button'
     */
    /**
     * @description button 태그의 type값
     * @property type
     * @private
     * @type {String}
     */
    type: 'button',
    /**
     * @description 더블클릭 방지 기능을 사용할 지 여부
     * 더블클릭 방지 기능을 사용할 경우 버튼이 클릭되는 순간부터 disableDbClickInterval에 설정된 시간동안 버튼이 disable된다.
     * @config disableDbClick
     * @sample default
     * @type {boolean}
     * @default true
     */
    /**
     * @description 더블클릭 방지 기능을 사용할 지 여부
     * 더블클릭 방지 기능을 사용할 경우 버튼이 클릭되는 순간부터 disableDbClickInterval에 설정된 시간동안 버튼이 disable된다.
     * @property disableDbClick
     * @private
     * @type {boolean}
     */
    disableDbClick: true,
    /**
     * @description 더블클릭 방지 기능을 사용할 경우의 disable interval
     * @config disableDbClickInterval
     * @sample default
     * @type {int}
     * @default 500
     */
    /**
     * @description 더블클릭 방지 기능을 사용할 경우의 disable interval
     * @property disableDbClickInterval
     * @private
     * @type {int}
     */
    disableDbClickInterval: 500,
    /**
     * @description 객체의 이벤트 초기화 메소드
     * @method initEvents
     * @protected
     * @return {void}
     */
    initEvents: function() {
        Rui.ui.LButton.superclass.initEvents.call(this);
        
        /**
         * @description button이 click되면 호출되는 이벤
         * @event click
         * @sample default
         */
        this.createEvent('click');
    },
    /**
     * @description 객체를 Config정보를 초기화하는 메소드
     * @method initDefaultConfig
     * @protected
     * @return {void}
     */
    initDefaultConfig: function() {
        Rui.ui.LButton.superclass.initDefaultConfig.call(this);
        
        this.cfg.addProperty('label', {
            handler: this._setLabel,
            value: this.label,
            validator: Rui.isString
        });
    },
    /**
     * @description element Dom객체 생성
     * @method createElement
     * @protected
     * @return {HTMLElement}
     */
    createElement: function() {
        return document.createElement('span');
    },
    /**
     * @description element Dom객체 생성
     * @method createContainer
     * @protected
     * @param {LElement|HTMLElement|String} parentNode 부모노드
     * @return {LElement}
     */
    createContainer: function(parentNode) {
        var el = Rui.ui.LButton.superclass.createContainer.call(this, parentNode),
            tagName = el.dom.tagName,
            label, className;
        if(tagName != 'SPAN'){
            switch(tagName){
            case 'INPUT':
                label = el.getValue();
                break;
            case 'A':
            case 'BUTTON':
            case 'DIV':
            default:
                label = el.getHtml();
                break;
            }
            this.el = this.createElement();
            this.el.id = this.id || this.el.id || Rui.useFixedId() ? Rui.id(this.el, 'LButton-' + this.id) : Rui.id();
            this.el = Rui.get(this.el);
            Rui.util.LDom.replaceChild(this.el.dom, el.dom);
            Rui.util.LDom.removeNode(el.dom);

            className = el.dom.className;
            if(className)
                this.el.addClass(className);
            
        }else{
            label = el.getHtml();
        }
        this.label = label;
        this.el.addClass(this.CSS_BASE);
        return this.el;
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

        var html = this.template.apply({
        	id: this.id + '-button',
        	type: this.type || 'button',
            label: this.label
        });
        this.el.html(html);
        this.on('click', this.onClick, this, true, {system: true});

        this.buttonEl = this.el.select('button').getAt(0);
        this.buttonEl.on('click', this.onButtonClick, this, true, {system: true});
    },
    /**
     * @description Dom객체 생성
     * @method createTemplate
     * @protected
     * @param {String|Object} el 객체의 아이디나 객체
     * @return {void}
     */
    createTemplate: function(el) {
        this.template = new Rui.LTemplate(
            '<span class="first-child">',
            '<button id="{id}" type="{type}">{label}</button>',
            '</span>'
        );
    },
    /**
     * @description setLabel 기능의 실제 적용 메소드
     * @method _setLabel
     * @param {String} type 속성의 이름
     * @param {Array} args 속성의 값 배열
     * @param {Object} obj 적용된 객체
     * @return {void}
     */
    _setLabel: function(type, args, obj) {
        var label = args[0];
        this.label = label;
        this.buttonEl.html(label);
    },
    /**
     * @description disable 메소드의 실제 적용 메소드
     * @method _setDisabled
     * @protected
     * @param {String} type 속성의 이름
     * @param {Array} args 속성의 값 배열
     * @param {Object} obj 적용된 객체
     * @return {void}
     */
    _setDisabled: function(type, args, obj) {
        if(args[0] === this.disabled) return;
        Rui.ui.LButton.superclass._setDisabled.call(this, type, args, obj);
        if(this.buttonEl) this.buttonEl.dom.disabled = args[0];
    },
    /**
     * @description 버튼이 포함된 form을 submit 한다.
     * form이 성공적으로 submit 된 경우 true, submission이 취소된 경우에는
     * false를 반환한다.
     * @method submitForm
     * @protected
     * @return {boolean}
     */
    submitForm: function () {
        var form = this.getForm(),
            isSubmit = false,
            event;
        if(form){
            if(Rui.browser.msie){
                isSubmit = form.fireEvent('onsubmit');
            }else{
            	// Gecko, Opera, and Safari
                event = document.createEvent('HTMLEvents');
                event.initEvent('submit', true, true);
                isSubmit = form.dispatchEvent(event);
            }

            /*
                In IE and Safari, dispatching a 'submit' event to a form
                WILL cause the form's 'submit' event to fire, but WILL NOT
                submit the form.  Therefore, we need to call the 'submit'
                method as well.
            */
            if ((Rui.browser.msie || Rui.browser.webkit) && isSubmit)
                form.submit();
        }
        return isSubmit;
    },
    /**
     * @description 버튼의 label을 설정 또는 변경한다.
     * @method setLabel
     * @public
     * @param {String} label 변경할 label 값
     * @return {void}
     */
    setLabel: function(label){
        this.cfg.setProperty('label', label);
    },
    /**
     * @description 버튼의 label을 반환한다.
     * @method setLabel
     * @public
     * @return {String} label 현재의 label 값
     */
    getLabel: function() {
        return this.label;
    },
    /**
     * @description 버튼이 속해있는 Form Element 객체를 리턴한다.
     * @method getForm
     * @return {HTMLFormElement}
     */
    getForm: function () {
        if(this.buttonEl)
            return this.buttonEl.dom.form;
        return null;
    },
    /**
     * @description 버튼을 focus한다.
     * @method focus
     * @public
     * @return {void}
     */
    focus: function() {
        if(this.el && !this.el.hasClass('L-disabled'))
            if(this.buttonEl) this.buttonEl.focus();
    },
    /**
     * @description 버튼을 blur한다.
     * @method blur
     * @public
     * @return {void}
     */
    blur: function() {
        if(this.el && !this.el.hasClass('L-disabled'))
            if(this.buttonEl) this.buttonEl.blur();
    },
    /**
     * @description 버튼을 클릭한다.
     * @method click
     * @public
     * @return {void}
     */
    click: function() {
        return this.onButtonClick();
    },
    /**
     * @description buttonEl click event handler
     * @method onButtonClick
     * @private
     * @return {void}
     */
    onButtonClick: function(e){
        if(this.disableDbClick) {
            if(this.disableDbClick == false) return;
            this.disable();
            if (Rui.useAccessibility()) this.el.setAttribute('aria-pressed', true);
            var me = this;
            this._timeout = setTimeout(function(){
                me.enable();
                if (Rui.useAccessibility()) this.el.setAttribute('aria-pressed', false);
            }, this.disableDbClickInterval);
        }
        this.fireEvent('click', e);
    },
    /**
     * @description el click event handler
     * @method onClick
     * @private
     * @return {void}
     */
    onClick: function(e){
        switch (this.type) {
        case 'submit':
    		if (e.returnValue !== false)
    			this.submitForm();
            break;
        case 'reset':
            var form = this.getForm();
            if (form)
                form.reset();
            break;
        }
    },
    /**
     * @description 객체를 destroy 한다.
     * @method destroy
     * @public
     * @return {void}
     */
    destroy: function(){
        if(this.buttonEl){
            this.buttonEl.unOnAll();
            this.buttonEl.remove();
            delete this.buttonEl;
        }
        if(this._timeout)
        	clearTimeout(this._timeout);
        Rui.ui.LButton.superclass.destroy.call(this);
    },
    /**
     * @description 객체의 toString
     * @method toString
     * @public
     * @return {String}
     */
    toString: function() {
        return (this.otype || 'Rui.ui.LButton ') + ' ' + this.id;
    }
});

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
 * LPanl
 * @module ui
 * @title LPanel
 * @requires Rui
 */
Rui.namespace('Rui.ui');

(function () {

    /**
     * Panel은 드래그 가능한 헤더와 top 우측의 선택적 close icon과 함께
     * OS 윈도우 같이 행동하는 Panel구현체이다.
     * @namespace Rui.ui
     * @class LPanel
     * @extends Rui.ui.LUIComponent
     * @param {String|HTMLElement} el: Panel을 나타내는 엘리먼트ID<em>또는</em> Panel을 나타내는 엘리먼트
     * @param {Object} userConfig: Panel에 설정되어야 할 환경설정을 포함한 configuration 오브젝트 문자
     * 더 자세한 사항은 configuration 문서를 참조하라.
     */
    Rui.ui.LPanel = function (oConfig) {
        var config = oConfig || {};
        config = Rui.applyIf(config, Rui.getConfig().getFirst('$.ext.panel'));
/*
        if(!config.id && !config.applyTo){
            var id = Rui.id();
            this.createEmptyElement(id);
        }
*/
        Rui.applyObject(this, config, true);
        Rui.ui.LPanel.superclass.constructor.call(this,config);

    };

    var _currentModal = null;
    var Util = Rui.util,
    Dom = Util.LDom,
    Event = Util.LEvent,
    LCustomEvent = Util.LCustomEvent,
    LKeyListener = Rui.util.LKeyListener,
    Config = Rui.ui.LConfig,
    Panel = Rui.ui.LPanel,
    bIEQuirks = (Rui.browser.msie == 6 || (Rui.browser.msie == 7 && document.compatMode == "BackCompat"));

    /**
     * Constant representing the prefix path to use for non-secure images
     * @property IMG_ROOT
     * @private
     * @static
     * @final
     * @type String
     */
    Panel.IMG_ROOT = null;

    /**
     * Constant representing the prefix path to use for securely served images
     * @property IMG_ROOT_SSL
     * @private
     * @static
     * @final
     * @type String
     */
    Panel.IMG_ROOT_SSL = null;

    /**
     * Constant representing the module header
     * @property CSS_HEADER
     * @private
     * @static
     * @final
     * @type String
     */
    Panel.CSS_HEADER = "hd";

    /**
     * Constant representing the module body
     * @property CSS_BODY
     * @private
     * @static
     * @final
     * @type String
     */
    Panel.CSS_BODY = "bd";

    /**
     * Constant representing the module footer
     * @property CSS_FOOTER
     * @private
     * @static
     * @final
     * @type String
     */
    Panel.CSS_FOOTER = "ft";

    /**
     * Constant representing the url for the "src" attribute of the iframe
     * used to monitor changes to the browser's base font size
     * @property RESIZE_MONITOR_SECURE_URL
     * @private
     * @static
     * @final
     * @type String
     */
    Panel.RESIZE_MONITOR_SECURE_URL = "javascript:false;";

    /**
     * overlay에 사용되는 표준 모듈 엘리먼트의 이름을 나타내는 상수
     * @property STD_MOD_RE
     * @private
     * @static
     * @final
     * @type RegExp
     */
    Panel.STD_MOD_RE = /^\s*?(body|footer|header)\s*?$/i;

    /**
     * Singleton LCustomEvent fired when the font size is changed in the browser.
     * Opera's "zoom" functionality currently does not support text
     * size detection.
     * @event textResize
     */
    Panel.textResizeEvent = new LCustomEvent("textResize", {isCE:true});

    // OverLay Variables
    /**
     * overlay 인스턴스가 브라우저 viewport의 경계에
     * 상대적으로 위치해야 할 최소 거리(픽셀)를 나타내는 숫자
     * @property VIEWPORT_OFFSET
     * @private
     * @default 10
     * @static
     * @final
     * @type Number
     */
    Panel.VIEWPORT_OFFSET = 10;

    /**
     * 윈도우 스크롤을 위한 DOM 이벤트에 반응하도록 사용되는 싱글톤 LCustomEvent
     * @event windowScroll
     */
    Panel.windowScrollEvent = new LCustomEvent("windowScroll", {isCE:true});

    /**
     * 윈도우 리사이즈를 위한 DOM 이벤트에 반응하도록 사용되는 싱글톤 LCustomEvent
     * @event windowResize
     */
    Panel.windowResizeEvent = new LCustomEvent("windowResize", {isCE:true});

    /**
     * 윈도우 스크롤 LCustomEvent를 fire하는데 사용되는 Dom 이벤트 핸들러
     * @method windowScrollHandler
     * @private
     * @static
     * @param {DOMEvent} e The DOM scroll event
     */
    Panel.windowScrollHandler = function (e) {
        var t = Event.getTarget(e);

        // - Webkit (Safari 2/3) and Opera 9.2x bubble scroll events from elements to window
        // - FF2/3 and IE6/7, Opera 9.5x don't bubble scroll events from elements to window
        // - IE doesn't recognize scroll registered on the document.
        //
        // Also, when document view is scrolled, IE doesn't provide a target,
        // rest of the browsers set target to window.document, apart from opera
        // which sets target to window.
        if (!t || t === window || t === window.document) {
            if (Rui.browser.msie) {

                if (! window.scrollEnd) {
                    window.scrollEnd = -1;
                }

                clearTimeout(window.scrollEnd);

                window.scrollEnd = setTimeout(function () {
                    Panel.windowScrollEvent.fire();
                }, 1);

            } else {
                Panel.windowScrollEvent.fire();
            }
        }
    };

    /**
     * 윈도우 리사이즈 LCustomEvent를 fire하는데 사용되는 Dom 이벤트 핸들러
     * @method windowResizeHandler
     * @private
     * @static
     * @param {DOMEvent} e The DOM resize event
     */
    Panel.windowResizeHandler = function (e) {

        if (Rui.browser.msie) {
            if (! window.resizeEnd) {
                window.resizeEnd = -1;
            }

            clearTimeout(window.resizeEnd);

            window.resizeEnd = setTimeout(function () {
                Panel.windowResizeEvent.fire();
            }, 100);
        } else {
            Panel.windowResizeEvent.fire();
        }
    };

    /**
     * A boolean that indicated whether the window resize and scroll events have
     * already been subscribed to.
     * @property _initialized
     * @private
     * @type Boolean
     */
    Panel._initialized = null;

    if (Panel._initialized === null) {
        Event.on(window, "scroll", Panel.windowScrollHandler);
        Event.on(window, "resize", Panel.windowResizeHandler);
        Panel._initialized = true;
    }

    /**
     * Internal map of special event types, which are provided
     * by the instance. It maps the event type to the custom event
     * instance. Contains entries for the "windowScroll", "windowResize" and
     * "textResize" static container events.
     *
     * @property _TRIGGER_MAP
     * @type Object
     * @static
     * @private
     */
    Panel._TRIGGER_MAP = {
            "windowScroll": Panel.windowScrollEvent,
            "windowResize": Panel.windowResizeEvent,
            "textResize"  : Panel.textResizeEvent
    };

    // End of Ovarlay Variables

    /**
     * Panel의 config properties를 나타내는 상수
     * @property DEFAULT_CONFIG
     * @private
     * @final
     * @type Object
     */
    DEFAULT_CONFIG = {
            // Module config
            "VISIBLE": {
                key: "visible",
                value: false,
                validator: Rui.isBoolean
            },

            "EFFECT": {
                key: "effect",
                suppressEvent: true,
                supercedes: ["visible"]
            },

            "MONITOR_RESIZE": {
                key: "monitorresize",
                value: true
            },

            // Overlay Config
            "X": {
                key: "x",
                validator: Rui.isNumber,
                suppressEvent: true,
                supercedes: ["iframe"]
            },

            "Y": {
                key: "y",
                validator: Rui.isNumber,
                suppressEvent: true,
                supercedes: ["iframe"]
            },

            "XY": {
                key: "xy",
                suppressEvent: true,
                supercedes: ["iframe"]
            },

            "CONTEXT": {
                key: "context",
                suppressEvent: true,
                supercedes: ["iframe"]
            },

            "FIXED_CENTER": {
                key: "fixedcenter",
                value: false,
                validator: Rui.isBoolean,
                supercedes: ["iframe", "visible"]
            },

            "AUTO_FILL_HEIGHT": {
                key: "autofillheight",
                supressEvent: true,
                supercedes: ["height"],
                value:"body"
            },

            "ZINDEX": {
                key: "zindex",
                value: null
            },

            "IFRAME": {
                key: "iframe",
                value: (Rui.browser.msie == 6 ? true : false),
                validator: Rui.isBoolean,
                supercedes: ["zindex"]
            },

            "PREVENT_CONTEXT_OVERLAP": {
                key: "preventcontextoverlap",
                value: false,
                validator: Rui.isBoolean,
                supercedes: ["constraintoviewport"]
            },

            // Panel Config
            "CLOSE": {
                key: "close",
                value: true,
                validator: Rui.isBoolean,
                supercedes: ["visible"]
            },

            "DRAGGABLE": {
                key: "draggable",
                value: (Rui.dd.LDD ? true : false),
                validator: Rui.isBoolean,
                supercedes: ["visible"]
            },

            "DRAG_ONLY": {
                key: "dragonly",
                value: false,
                validator: Rui.isBoolean,
                supercedes: ["draggable"]
            },

            "UNDERLAY": {
                key: "underlay",
                value: "shadow",
                supercedes: ["visible"]
            },

            "MODAL": {
                key: "modal",
                value: false,
                validator: Rui.isBoolean,
                supercedes: ["visible", "zindex"]
            },

            "KEY_LISTENERS":{
                key: "keylisteners",
                suppressEvent: true,
                supercedes: ["visible"]
            },

            "STRINGS": {
                key: "strings",
                supercedes: ["close"],
                validator: Rui.isObject,
                value: {
                    close: "Close"
                }
            }
    };

    Rui.extend(Rui.ui.LPanel, Rui.ui.LUIComponent, {

        otype: 'Rui.ui.LPanel',
        // Module variables
        m_oModuleTemplate: null,
        m_oHeaderTemplate: null,
        m_oBodyTemplate: null,
        m_oFooterTemplate: null,
        m_oMaskTemplate: null,
        m_oUnderlayTemplate: null,
        m_oCloseIconTemplate: null,
        m_oIFrameTemplate: null,

        /**
         * @description The main module element that contains the header, body, and footer
         * @config element
         * @type {Array}
         * @default null
         */
        /**
         * The main module element that contains the header, body, and footer
         * @property element
         * @private
         * @type {Array}
         */
        element: null,
        /**
         * @description The header element, denoted with CSS class "hd"
         * @config header
         * @type {HTMLElement}
         * @default null
         */
        /**
         * The header element, denoted with CSS class "hd"
         * @property header
         * @private
         * @type HTMLElement
         */
        header: null,
        /**
         * @description The body element, denoted with CSS class "bd"
         * @config body
         * @type {HTMLElement}
         * @default null
         */
        /**
         * The body element, denoted with CSS class "bd"
         * @property body
         * @private
         * @type HTMLElement
         */
        body: null,
        /**
         * @description The footer element, denoted with CSS class "ft"
         * @config footer
         * @type {HTMLElement}
         * @default null
         */
        /**
         * The footer element, denoted with CSS class "ft"
         * @property footer
         * @private
         * @type HTMLElement
         */
        footer: null,

        /**
         * The id of the element
         * @property id
         * @type String
         */
        id: null,

        /**
         * A string representing the root path for all images created by
         * a Module instance.
         * @deprecated It is recommend that any images for a Module be applied
         * via CSS using the "background-image" property.
         * @property imageRoot
         * @private
         *
         * @type String
         */
        imageRoot: Panel.IMG_ROOT,

        /**
         * <p>
         * overlay 클래스의 context alignment를 촉발시키는 기본 이벤트 타입들의 배열
         * </p>
         * <p> 이 배열은 overlay에서는 기본적으로 비어있으나,향후 버전에서는 빈번하게 사용될 것이다.
         * 따라서 CONTEXT_TRIGGERS 셋트를 정의하는 데에 필요한 overlay를 확장한 클래스들이
         * 그들의 슈퍼클래스 프로토타입에 연결되어야 한다.
         * CONTEXT_TRIGGERS 값의 배열과 CONTEXT_TRIGGERS 값.
         * </p>
         * <p>
         * E.g.:
         * <code>CustomOverlay.prototype.CONTEXT_TRIGGERS = Rui.ui.LPanel.prototype.CONTEXT_TRIGGERS.concat(["windowScroll"]);</code>
         * </p>
         *
         * @property CONTEXT_TRIGGERS
         * @private
         * @type Array
         * @final
         */
        CONTEXT_TRIGGERS: [],

        /**
         * @description element Dom객체 생성
         * @method createContainer
         * @protected
         * @return {HTMLElement}
         */
        createContainer: function(appendToNode) {
            this.el = Rui.ui.LPanel.superclass.createContainer.call(this, appendToNode);

            if(!this.el) {
                this.el = Rui.get(this.createElement().cloneNode(false));
                this.id = this.id || this.el.id;
                this.element  = this.el.dom;
            }

            if(this.el){
                this.element = this.el.dom;
                Dom.setStyle(this.element, "visibility", "");

                if(this.header != null)
                    this.cfg.setProperty('header', this.header);
                if(this.footer != null)
                    this.cfg.setProperty('footer', this.footer);
                if(this.body != null)
                    this.cfg.setProperty('body', this.body);

                this._renderHeader(this.el.dom);
                this._renderBody(this.el.dom);
                this._renderFooter(this.el.dom);

                this.initModuleOverlay(this.element);
            }

            return this.el;
        },

        /**
         * @description initialize the modue
         * @method initModuleOverlay
         * @private
         * @return {void}
         */
        initModuleOverlay: function(el){
            this.initModule(el);
            Dom.addClass(this.element, 'L-overlay');
        },

        /**
         * @description element Dom객체 생성
         * @method createElement
         * @protected
         * @return {HTMLElement}
         */
        createElement: function(){
            return  this.createModuleTemplate();
        },

        /**
         * Create Module template
         * @method createModuleTemplate
         * @private
         */
        createModuleTemplate: function(){
            if (!this.m_oModuleTemplate) {
                this.m_oModuleTemplate = document.createElement("div");

                this.m_oModuleTemplate.innerHTML = ("<div class=\"" +
                        Panel.CSS_HEADER + "\"></div>" + "<div class=\"" +
                        Panel.CSS_BODY + "\"></div><div class=\"" +
                        Panel.CSS_FOOTER + "\"></div>");

                this.m_oHeaderTemplate = this.m_oModuleTemplate.firstChild;
                this.m_oBodyTemplate = this.m_oHeaderTemplate.nextSibling;
                this.m_oFooterTemplate = this.m_oBodyTemplate.nextSibling;
            }
            return this.m_oModuleTemplate;
        },

        /**
         * Create Module Header template
         * @method createModuleHeader
         * @private
         */
        createModuleHeader: function() {
            if (!this.m_oHeaderTemplate) {
                this.createModuleTemplate();
            }
            return (this.m_oHeaderTemplate.cloneNode(false));
        },

        /**
         * Create Module Body template
         * @method createBody
         * @private
         */
        createBody: function(){
            if (!this.m_oBodyTemplate) {
                this.createModuleTemplate();
            }
            return (this.m_oBodyTemplate.cloneNode(false));
        },

        /**
         * Create Module Footer template
         * @method createFooter
         * @private
         */
        createFooter: function() {
            if (!this.m_oFooterTemplate) {
                this.createModuleTemplate();
            }
            return (this.m_oFooterTemplate.cloneNode(false));
        },

        /**
         * Create Empty Element
         * @method createEmptyElement
         * @private
         */
        createEmptyElement: function(el){
            var doc = document.getElementById(el);
            if(!doc){
                doc =  document.createElement('div');
                doc.id = el;
                document.body.appendChild(doc);
            }
        },

        /**
         * The Module class's initialization method, which is executed for
         * Module and all of its subclasses. This method is automatically
         * called by the constructor, and  sets up all DOM references for
         * pre-existing markup, and creates required markup if it is not
         * already present.
         * @method initModule
         * @private
         * @param {String} el The element ID representing the Module <em>OR</em>
         * @param {HTMLElement} el The element representing the Module
         * @param {Object} userConfig The configuration Object literal
         * containing the configuration that should be set for this module.
         * See configuration documentation for more details.
         */
        initModule: function (el, userConfig) {
            var elId, child;

            if(this.cfg == null)
                this.cfg = new Config(this);

            if (this.isSecure) {
                this.imageRoot = Panel.IMG_ROOT_SSL;
            }

            if (typeof el == "string") {
                elId = el;
                el = document.getElementById(el);
                if (! el) {
                    el = (this.createModuleTemplate()).cloneNode(false);
                    el.id = elId;
                }
            }

            this.element = el;
            if (el.id) {
                if(this.id === 'undefined')
                    this.id = el.id;
            }

            child = this.element.firstChild || this.m_oHeaderTemplate;

            if (child) {
                var fndHd = false, fndBd = false, fndFt = false;
                do {
                    // We're looking for elements
                    if (1 == child.nodeType) {
                        if (!fndHd && Dom.hasClass(child, Panel.CSS_HEADER)){
                            this.header = child;
                            fndHd = true;
                        } else if (!fndBd && Dom.hasClass(child, Panel.CSS_BODY)){
                            this.body = child;
                            fndBd = true;
                        } else if (!fndFt && Dom.hasClass(child, Panel.CSS_FOOTER)){
                            this.footer = child;
                            fndFt = true;
                        }
                    }
                } while ((child = child.nextSibling));
            }
        },

        /**
         * Initialize an empty IFRAME that is placed out of the visible area
         * that can be used to detect text resize.
         * @method initResizeMonitor
         * @private
         */
        initResizeMonitor: function () {

         /*
         // comment : contextMenu 리싸이즈 적용않됨.
            if (!this.reMon) {
                this.reMon = new Rui.util.LResizeMonitor();
                this.reMon.monitor(this.element);
            }
           */
            var isGeckoWin = (Rui.browser.gecko && Rui.platform.window);
            if (isGeckoWin) {
                // Help prevent spinning loading icon which
                // started with FireFox 2.0.0.8/Win
                var self = this;
                setTimeout(function(){self._initResizeMonitor();}, 0);
            } else {
                this._initResizeMonitor();
            }
        },

        /**
         * Create and initialize the text resize monitoring iframe.
         * @protected
         * @method _initResizeMonitor
         */
        _initResizeMonitor: function() {

            var oDoc, oIFrame, sHTML;

            function fireTextResize() {
                Panel.textResizeEvent.fire();
            }

            if (!Rui.browser.opera) {
                oIFrame = Dom.get("_ruiResizeMonitor");

                var supportsCWResize = this._supportsCWResize();

                if (!oIFrame) {
                    oIFrame = document.createElement("iframe");

                    if (this.isSecure && this.RESIZE_MONITOR_SECURE_URL && Rui.browser.ie) {
                        oIFrame.src = this.RESIZE_MONITOR_SECURE_URL;
                    }

                    if (!supportsCWResize) {
                        // Can't monitor on contentWindow, so fire from inside iframe
                        sHTML = ["<html><head><script ",
                                 "type=\"text/javascript\">",
                                 "window.onresize=function(){window.parent.",
                                 "Rui.ui.LPanel.textResizeEvent.",
                                 "fire();};<",
                                 "\/script></head>",
                                 "<body></body></html>"].join('');

                        oIFrame.src = "data:text/html;charset=utf-8," + encodeURIComponent(sHTML);
                    }

                    oIFrame.id = "_ruiResizeMonitor";
                    oIFrame.title = "Text Resize Monitor";
                    /*
                          Need to set "position" property before inserting the
                          iframe into the document or Safari's status bar will
                          forever indicate the iframe is loading
                          (See SourceForge bug #1723064)
                     */
                    oIFrame.style.position = "absolute";
                    oIFrame.style.visibility = "hidden";

                    var db = document.body,
                    fc = db.firstChild;
                    if (fc) {
                        db.insertBefore(oIFrame, fc);
                    } else {
                        db.appendChild(oIFrame);
                    }

                    oIFrame.style.width = "10em";
                    oIFrame.style.height = "10em";
                    oIFrame.style.top = (-1 * oIFrame.offsetHeight) + "px";
                    oIFrame.style.left = (-1 * oIFrame.offsetWidth) + "px";
                    oIFrame.style.borderWidth = "0";
                    oIFrame.style.visibility = "visible";

                    if(Rui.useAccessibility())
                        oIFrame.setAttribute('aria-hidden', 'false');
                    /*
                         Don't open/close the document for Gecko like we used to, since it
                         leads to duplicate cookies. (See SourceForge bug #1721755)
                     */
                    if (Rui.browser.webkit) {
                        oDoc = oIFrame.contentWindow.document;
                        oDoc.open();
                        oDoc.close();
                    }
                }

                if (oIFrame && oIFrame.contentWindow) {
                    Panel.textResizeEvent.on(this.onDomResize, this, true, {isCE:true});

                    if (!Panel.textResizeInitialized) {
                        if (supportsCWResize) {
                            if (!Event.on(oIFrame.contentWindow, "resize", fireTextResize, {isCE:true})) {
                                /*
                                       This will fail in IE if document.domain has
                                       changed, so we must change the listener to
                                       use the oIFrame element instead
                                 */
                                Event.on(oIFrame, "resize", fireTextResize, {isCE:true});
                            }
                        }
                        Panel.textResizeInitialized = true;
                    }
                    this.resizeMonitor = oIFrame;
                }
            }
        },

        /**
         * Text resize monitor helper method.
         * Determines if the browser supports resize events on iframe content windows.
         * @private
         * @method _supportsCWResize
         */
        _supportsCWResize: function() {

            /*
                  Gecko 1.8.0 (FF1.5), 1.8.1.0-5 (FF2) won't fire resize on contentWindow.
                  Gecko 1.8.1.6+ (FF2.0.0.6+) and all other browsers will fire resize on contentWindow.
                  We don't want to start sniffing for patch versions, so fire textResize the same
                  way on all FF, until 1.9 (3.x) is out
             */
            var bSupported = true;
            if (Rui.browser.gecko && Rui.browser.gecko <= 1.8 && !Rui.browser.msie) {
                bSupported = false;
            }
            return bSupported;
        },

        /**
         * Renders the currently set header into it's proper position under the
         * module element. If the module element is not provided, "this.element"
         * is used.
         *
         * @method _renderHeader
         * @protected
         * @param {HTMLElement} moduleElement Optional. A reference to the module element
         */
        _renderHeader: function(moduleElement){
            moduleElement = this.el.dom || moduleElement;
            // Need to get everything into the DOM if it isn't already
            if (this.header && !Dom.inDocument(this.header)) {
                // There is a header, but it's not in the DOM yet. Need to add it.
                var firstChild = moduleElement.firstChild;
                if (firstChild) {
                    moduleElement.insertBefore(this.header, firstChild);
                } else {
                    moduleElement.appendChild(this.header);
                }
            }
        },

        /**
         * Renders the currently set body into it's proper position under the
         * module element. If the module element is not provided, "this.element"
         * is used.
         * @method _renderBody
         * @protected
         * @param {HTMLElement} moduleElement Optional. A reference to the module element.
         */
        _renderBody: function(moduleElement){
            moduleElement = this.el.dom || moduleElement;
            if (!Rui.isNull(this.body) && !Dom.inDocument(this.body)) {
                // There is a body, but it's not in the DOM yet. Need to add it.
                if (this.footer && Dom.isAncestor(moduleElement, this.footer)) {
                    Dom.insertBefore(this.body, this.footer);
                } else {
                    if(typeof this.body === 'string'){
                        var oBody = this.createBody();
                        if (this.body.nodeName) {
                            oBody.innerHTML = "";
                            oBody.appendChild(this.body);
                        } else {
                            oBody.innerHTML = this.body;
                        }
                        this.body = oBody;
                    }
                        moduleElement.appendChild(this.body);
                }
            }
        },

        /**
         * Renders the currently set footer into it's proper position under the
         * module element. If the module element is not provided, "this.element"
         * is used.
         *
         * @method _renderFooter
         * @protected
         * @param {HTMLElement} moduleElement Optional. A reference to the module element
         */
        _renderFooter: function(moduleElement){
            moduleElement = this.el.dom || moduleElement;
            if (this.footer && !Dom.inDocument(this.footer)) {
                // There is a footer, but it's not in the DOM yet. Need to add it.
                moduleElement.appendChild(this.footer);
            }
        },

        /**
         * header정보 반환
         * @method getHeader
         * @return {HTMLElement } return element
         */
        getHeader: function(){
            return Rui.get(this.header);
        },

        /**
         * body정보 반환
         * @method getBody
         * @return {HTMLElement } return element
         */
        getBody: function(){
            return Rui.get(this.body);
        },

        /**
         * footer정보 반환
         * @method getFooter
         * @return {HTMLElement } return element
         */
        getFooter: function(){
            return Rui.get(this.footer);
        },

        /**
         * Sets the Module's header content to the string specified, or appends
         * the passed element to the header. If no header is present, one will
         * be automatically created. An empty string can be passed to the method
         * to clear the contents of the header.
         *
         * @method setHeader
         * @param {String} headerContent The string used to set the header.
         * As a convenience, non HTMLElement objects can also be passed into
         * the method, and will be treated as strings, with the header innerHTML
         * set to their default toString implementations.
         * <em>OR</em>
         * @param {HTMLElement} headerContent The HTMLElement to append to
         * <em>OR</em>
         * @param {DocumentFragment} headerContent The document fragment
         * containing elements which are to be added to the header
         */
        setHeader: function (headerContent) {
            var oHeader = this.header || (this.header = this.createModuleHeader());
            if (headerContent.nodeName) {
                oHeader.innerHTML = "";
                oHeader.appendChild(headerContent);
            } else {
                oHeader.innerHTML = headerContent;
            }

            if(Rui.useAccessibility())
                oHeader.setAttribute('role', 'region');
            if(this._rendered) {
                this._renderHeader();
            }
            this._applyContent('changeHeader', headerContent);
        },

        /**
         * Appends the passed element to the header. If no header is present,
         * one will be automatically created.
         * @method appendToHeader
         * @private
         * @param {HTMLElement | DocumentFragment} element The element to
         * append to the header. In the case of a document fragment, the
         * children of the fragment will be appended to the header.
         */
        appendToHeader: function (element) {
            var oHeader = this.header || (this.header = this.createModuleHeader());
            oHeader.appendChild(element);
            this._applyContent('changeHeader', element);
        },

        /**
         * Sets the Module's body content to the HTML specified.
         *
         * If no body is present, one will be automatically created.
         *
         * An empty string can be passed to the method to clear the contents of the body.
         * @method setBody
         * @param {String} bodyContent The HTML used to set the body.
         * As a convenience, non HTMLElement objects can also be passed into
         * the method, and will be treated as strings, with the body innerHTML
         * set to their default toString implementations.
         * <em>OR</em>
         * @param {HTMLElement} bodyContent The HTMLElement to add as the first and only
         * child of the body element.
         * <em>OR</em>
         * @param {DocumentFragment} bodyContent The document fragment
         * containing elements which are to be added to the body
         */
        setBody: function (bodyContent) {
            this._appendToBodyContent(bodyContent);
            if(this._rendered) {
                this._renderBody();
            }
            this._applyContent('changeBody', bodyContent);
        },

        /**
         * Sets the Module's body content to the HTML specified.
         *
         * If no body is present, one will be automatically created.
         *
         * An empty string can be passed to the method to clear the contents of the body.
         * @protected
         * @method _insertBody
         * @param {String} bodyContent The HTML used to set the body.
         * As a convenience, non HTMLElement objects can also be passed into
         * the method, and will be treated as strings, with the body innerHTML
         * set to their default toString implementations.
         * <em>OR</em>
         * @param {HTMLElement} bodyContent The HTMLElement to add as the first and only
         * child of the body element.
         * <em>OR</em>
         * @param {DocumentFragment} bodyContent The document fragment
         * containing elements which are to be added to the body
         */
        _insertBody: function (bodyContent) {

            this._appendToBodyContent(bodyContent);

            if(typeof bodyContent !== 'undefinded' && bodyContent == "")
                this._renderBody();
            else if(this._rendered)
                this._renderBody();

            this._applyContent('changeBody', bodyContent);
        },

        /**
         * Sets the Module's body content to the HTML specified.
         *
         * If no body is present, one will be automatically created.
         *
         * An empty string can be passed to the method to clear the contents of the body.
         * @private
         * @method _appendToBodyContent
         * @param {String} bodyContent The HTML used to set the body.
         * As a convenience, non HTMLElement objects can also be passed into
         * the method, and will be treated as strings, with the body innerHTML
         * set to their default toString implementations.
         * <em>OR</em>
         * @param {HTMLElement} bodyContent The HTMLElement to add as the first and only
         * child of the body element.
         * <em>OR</em>
         * @param {DocumentFragment} bodyContent The document fragment
         * containing elements which are to be added to the body
         */
        _appendToBodyContent: function(bodyContent){
            var oBody = this.body || (this.body = this.createBody());
            if (bodyContent && bodyContent.nodeName) {
                oBody.innerHTML = "";
                oBody.appendChild(bodyContent);
            } else {
                oBody.innerHTML = bodyContent;
            }

            if(Rui.useAccessibility())
                oBody.setAttribute('role', 'region');
        },

        /**
         * Sets the Module's body content to the HTML specified.
         *
         * If no body is present, one will be automatically created.
         *
         * An empty string can be passed to the method to clear the contents of the body.
         * @private
         * @method _appendToBodyContent
         * @param {String} bodyContent The HTML used to set the body.
         * As a convenience, non HTMLElement objects can also be passed into
         * the method, and will be treated as strings, with the body innerHTML
         * set to their default toString implementations.
         * <em>OR</em>
         * @param {HTMLElement} bodyContent The HTMLElement to add as the first and only
         * child of the body element.
         * <em>OR</em>
         * @param {DocumentFragment} bodyContent The document fragment
         * containing elements which are to be added to the body
         */
        _applyContent: function(evtType, content){
            this.fireEvent(evtType, {target: this, content:content});
            this.fireEvent('changeContent', {target:this});
        },

        /**
         * Appends the passed element to the body. If no body is present, one
         * will be automatically created.
         * @method appendToBody
         * @protected
         * @param {HTMLElement | DocumentFragment} element The element to
         * append to the body. In the case of a document fragment, the
         * children of the fragment will be appended to the body.
         */
        appendToBody: function (element) {
            var oBody = this.body || (this.body = this.createBody());

            oBody.appendChild(element);
            this._applyContent('changeBody', element);
        },

        /**
         * Sets the Module's footer content to the HTML specified, or appends
         * the passed element to the footer. If no footer is present, one will
         * be automatically created. An empty string can be passed to the method
         * to clear the contents of the footer.
         * @method setFooter
         * @param {String} footerContent The HTML used to set the footer
         * As a convenience, non HTMLElement objects can also be passed into
         * the method, and will be treated as strings, with the footer innerHTML
         * set to their default toString implementations.
         * <em>OR</em>
         * @param {HTMLElement} footerContent The HTMLElement to append to
         * the footer
         * <em>OR</em>
         * @param {DocumentFragment} footerContent The document fragment containing
         * elements which are to be added to the footer
         */
        setFooter: function (footerContent) {

            var footer = this.footer || (this.footer = this.createFooter());
            if (footerContent.nodeName) {
//                var oldHtml = footer.innerHTML;
//                var clNode = document.createElement('div');
//                clNode.innerHTML = oldHtml;
//                if(!oldHtml && oldHtml.length > 0){
//                    Dom.setStyle(clNode, "border-left", "0px solid #C6C3C6");
//                    Dom.setStyle(clNode, "border-top", "1px solid #C6C3C6");
//                    Dom.setStyle(clNode, "left", "0");
//                }
                footer.innerHTML = "";
                footer.appendChild(footerContent);
                //footer.appendChild(clNode);
            } else {
                footer.innerHTML = footerContent;
            }

            if(Rui.useAccessibility())
                footer.setAttribute('role', 'region');

            if(this._rendered) {
                this._renderFooter();
            }

            this._applyContent('changeFooter', footerContent);
        },

        /**
         * Appends the passed element to the footer. If no footer is present,
         * one will be automatically created.
         * @method appendToFooter
         * @param {HTMLElement | DocumentFragment} element The element to
         * append to the footer. In the case of a document fragment, the
         * children of the fragment will be appended to the footer
         */
        appendToFooter: function (element) {
            var oFooter = this.footer || (this.footer = this.createFooter());
            oFooter.appendChild(element);
            this._applyContent('changeFooter', element);
        },

        /**
         * Shows the Module element by setting the visible configuration
         * property to true. Also fires two events: beforeShowEvent prior to
         * the visibility change, and showEvent after.
         * @method show
         */
        show: function (anim) {
            this.cfg.setProperty("visible", true);
            if(Rui.useAccessibility())
                this.el.setAttribute('aria-hidden', 'false');
            if(Rui.platform.isMobile) anim = false;
            if(anim === true) {
                var left = Rui.util.LDom.getX(this.element);
                Rui.util.LDom.setX(this.element, 0);
                anim = new Rui.fx.LAnim({
                    el: this.element.id,
                    attributes: {
                        left: {from:0, to:left}
                    },
                    duration: 0.2
                });
            }
            Rui.ui.LPanel.superclass.show.call(this, anim);
        },

        /**
         * Hides the element
         * @method hideAnim
         * @protected
         */
        hideAnim: function(anim){
            this.hide(anim);
        },

        /**
         * Hides the Module element by setting the visible configuration
         * property to false. Also fires two events: beforeHideEvent prior to
         * the visibility change, and hideEvent after.
         * @method hide
         */
        hide: function (anim) {
        	if(Rui.platform.isMobile) anim = false;
            if(anim) {
                if(anim === true){
                    var left = Rui.util.LDom.getX(this.element);
                    anim = new Rui.fx.LAnim({
                        el: this.element.id,
                        attributes: {
                            left: {from:left, to:0}
                        },
                        duration: 0.2
                    });

                    var pnlObj = this;
                    anim.on('complete', function(){
                        pnlObj.cfg.setProperty("visible", false);
                        Rui.util.LDom.setX(pnlObj.element, left);
                        if(Rui.useAccessibility())
                            pnlObj.element.setAttribute('aria-hidden', 'true');
                    });
                    anim.animate();
                }else
                    Rui.ui.LPanel.superclass.hide.call(this, anim);
            } else {
                if(this.cfg){
                    this.cfg.setProperty("visible", false);
                    if(Rui.useAccessibility())
                        this.el.setAttribute('aria-hidden', 'true');
                }
            }
        },
        
        /**
         * @description editor의 show 여부를 리턴하는 메소드
         * @method isShow
         * @return {boolean}
         */
        isShow: function() {
            return Rui.get(this.element).isShow();
        },

        /**
         * panel를 특정 위치로 이동시킨다.
         * 이 함수는 this.cfg.setProperty("xy", [x,y])를 호출한 것과 동일하다.
         * @method moveTo
         * @param {Number} x The Overlay's new x position
         * @param {Number} y The Overlay's new y position
         */
        moveTo: function (x, y) {
            this.cfg.setProperty("xy", [x, y]);
        },

        /**
         * overlay가 보일 때만 스크롤을 중심에 오도록 하거나 리사이즈 하는데 사용되는
         * center 이벤트 핸들러
         * @method doCenterOnDOMEvent
         * @protected
         */
        doCenterOnDOMEvent: function () {
            if (this.cfg && this.cfg.getProperty("visible")) {
                this.onCenter();
            }
        },

        /**
         * autofillheight 속성이 변경되었을 떄 fire되는 기본 이벤트 핸들러
         * @method configAutoFillHeight
         * @protected
         * @param {String} type The LCustomEvent type (usually the property name)
         * @param {Object[]} args The LCustomEvent arguments. For configuration
         * handlers, args[0] will equal the newly applied value for the property.
         * @param {Object} obj The scope object. For configuration handlers,
         * this will usually equal the owner.
         */
        configAutoFillHeight: function (type, args, obj) {
            var fillEl = args[0],
            currEl = this.cfg.getProperty("autofillheight");

            this.cfg.unsubscribeFromConfigEvent("height", this._autoFillOnHeightChange);
            Panel.textResizeEvent.unOn("height", this._autoFillOnHeightChange);

            if (currEl && fillEl !== currEl && this[currEl]) {
                Dom.setStyle(this[currEl], "height", "");
            }

            if (fillEl) {
                fillEl = Rui.trim(fillEl.toLowerCase());
                this.cfg.subscribeToConfigEvent("height", this._autoFillOnHeightChange, this[fillEl], this);
                Panel.textResizeEvent.on(this._autoFillOnHeightChange, this[fillEl], this, {isCE:true});
                this.cfg.setProperty("autofillheight", fillEl, true);
            }
        },

        /**
         * xy 속성이 변경되었을 떄 fire되는 기본 이벤트 핸들러
         * @method configXY
         * @protected
         * @param {String} type The LCustomEvent type (usually the property name)
         * @param {Object[]} args The LCustomEvent arguments. For configuration
         * handlers, args[0] will equal the newly applied value for the property.
         * @param {Object} obj The scope object. For configuration handlers,
         * this will usually equal the owner.
         */
        configXY: function (type, args, obj) {
            var pos = args[0],
            x = pos[0],
            y = pos[1];
            if(Rui._tabletData && y > 200) y = 200;
            this.cfg.setProperty("x", x);
            this.cfg.setProperty("y", y);
            this.fireEvent('beforeMove', [x,y]);
            x = this.cfg.getProperty("x");
            y = this.cfg.getProperty("y");

            this.cfg.refireEvent("iframe");
            this.fireEvent('move', [x, y]);
        },

        /**
         * x 속성이 변경되었을 떄 fire되는 기본 이벤트 핸들러
         * @method configX
         * @protected
         * @param {String} type The LCustomEvent type (usually the property name)
         * @param {Object[]} args The LCustomEvent arguments. For configuration
         * handlers, args[0] will equal the newly applied value for the property.
         * @param {Object} obj The scope object. For configuration handlers,
         * this will usually equal the owner.
         */
        configX: function (type, args, obj) {
            var x = args[0],
            y = this.cfg.getProperty("y");

            this.cfg.setProperty("x", x, true);
            this.cfg.setProperty("y", y, true);
            this.fireEvent('beforeMove', [x,y]);

            x = this.cfg.getProperty("x");
            y = this.cfg.getProperty("y");

            Dom.setX(this.element, x, true);

            this.cfg.setProperty("xy", [x, y], true);

            this.cfg.refireEvent("iframe");
            this.fireEvent('move', [x, y]);
        },

        /**
         * y 속성이 변경되었을 떄 fire되는 기본 이벤트 핸들러
         * @method configY
         * @protected
         * @param {String} type The LCustomEvent type (usually the property name)
         * @param {Object[]} args The LCustomEvent arguments. For configuration
         * handlers, args[0] will equal the newly applied value for the property.
         * @param {Object} obj The scope object. For configuration handlers,
         * this will usually equal the owner.
         */
        configY: function (type, args, obj) {
            var x = this.cfg.getProperty("x"),
            y = args[0];
            if(Rui._tabletData && y > 200) y = 200;
            this.cfg.setProperty("x", x, true);
            this.cfg.setProperty("y", y, true);

            this.fireEvent('beforeMove', [x,y]);

            x = this.cfg.getProperty("x");
            y = this.cfg.getProperty("y");

            Dom.setY(this.element, y, true);

            this.cfg.setProperty("xy", [x, y], true);

            this.cfg.refireEvent("iframe");
            this.fireEvent('move', [x, y]);
        },

        /**
         * iframe shim이 enable 되면 나타낸다.
         * @method showIframe
         * @protected
         */
        showIframe: function () {
            var oIFrame = this.iframe,
            oParentNode;

            if (oIFrame) {
                oParentNode = this.element.parentNode;

                if (oParentNode != oIFrame.parentNode) {
                    this._addToParent(oParentNode, oIFrame);
                }
                oIFrame.style.display = "block";
            }
        },

        /**
         * iframe shim이 enable 되면 숨긴다.
         * @method hideIframe
         * @protected
         */
        hideIframe: function () {
            if (this.iframe) {
                this.iframe.style.display = "none";
            }
        },

        /**
         * Overlay 인스턴스에 해당하는 사이즈와 위치에 iframe shim의 사이즈와 위치를 동기화 한다.
         * @method syncIframe
         * @protected
         */
        syncIframe: function () {
            /*
             * iframe shim이 overlay 인스턴스의 각 side로부터
             * 어느 정도 offset 길이(픽셀)가 되어야 하는지 표현하는 숫자
             */
            var IFRAME_OFFSET = 3;

            var oIFrame = this.iframe,
            oElement = this.element,
            nOffset = IFRAME_OFFSET,
            nDimensionOffset = (nOffset * 2),
            aXY;

            if (oIFrame) {
                // Size <iframe>
                oIFrame.style.width = (oElement.offsetWidth + nDimensionOffset + "px");
                oIFrame.style.height = (oElement.offsetHeight + nDimensionOffset + "px");
                // Position <iframe>
                aXY = this.cfg.getProperty("xy");

                if (!Rui.isArray(aXY) || (isNaN(aXY[0]) || isNaN(aXY[1]))) {
                    this.syncPosition();
                    aXY = this.cfg.getProperty("xy");
                }
                Dom.setXY(oIFrame, [(aXY[0] - nOffset), (aXY[1] - nOffset)]);
            }
        },

        /**
         * 존재한다면 overlay 엘리먼트의 zindex에 근거하여 iframe shim의 zindex를 설정한다.
         * iframe의 zindex는 overlay 엘리먼트의 zindex보다 하나 더 적게 설정된다.
         *
         * <p>NOTE: 이 메소드는 iframe shim이 양수(0 포함) zindex를 가지도록 보장하기 위해
         * overlay 엘리먼트의 zindex를 올리지 않는다.
         * iframe zindex가 0 또는 그 이상이 되어야 한다면, 이 메소드가 호출되기 전에
         * overlay 엘리먼트의 zindex는 0 보다 큰 값으로 설정되어야 한다.
         * </p>
         * @method stackIframe
         * @protected
         */
        stackIframe: function () {
            if (this.iframe) {
                var overlayZ = Dom.getStyle(this.element, "zIndex");
                if (!Rui.isUndefined(overlayZ) && !isNaN(overlayZ)) {
                    Dom.setStyle(this.iframe, "zIndex", (overlayZ - 1));
                }
            }
        },

        /**
         * "iframe"속성이 변경되었을 때 fire된 기본 이벤트 핸들러
         * @method configIframe
         * @protected
         * @param {String} type The LCustomEvent type (usually the property name)
         * @param {Object[]} args The LCustomEvent arguments. For configuration
         * handlers, args[0] will equal the newly applied value for the property.
         * @param {Object} obj The scope object. For configuration handlers,
         * this will usually equal the owner.
         */
        configIframe: function (type, args, obj) {
            var bIFrame = args[0];
            function createIFrame() {

                var oIFrame = this.iframe,
                oElement = this.element,
                oParent;

                if (!oIFrame) {
                    if (!this.m_oIFrameTemplate) {
                        this.m_oIFrameTemplate = document.createElement("iframe");

                        if (this.isSecure) {
                            // iframe 내에 위치할 URL
                            var IFRAME_SRC = "javascript:false;";
                            this.m_oIFrameTemplate.src = IFRAME_SRC;
                        }

                        /*
                                Set the opacity of the <iframe> to 0 so that it
                                doesn't modify the opacity of any transparent
                                elements that may be on top of it (like a shadow).
                         */
                        if (Rui.browser.msie) {
                            this.m_oIFrameTemplate.style.filter = "alpha(opacity=0)";
                            /*
                                     Need to set the "frameBorder" property to 0
                                     supress the default <iframe> border in IE.
                                     Setting the CSS "border" property alone
                                     doesn't supress it.
                             */
                            this.m_oIFrameTemplate.frameBorder = 0;
                        }
                        else {
                            m_oIFrameTemplate.style.opacity = "0";
                        }

                        this.m_oIFrameTemplate.style.position = "absolute";
                        this.m_oIFrameTemplate.style.border = "none";
                        this.m_oIFrameTemplate.style.margin = "0";
                        this.m_oIFrameTemplate.style.padding = "0";
                        this.m_oIFrameTemplate.style.display = "none";
                    }

                    oIFrame = this.m_oIFrameTemplate.cloneNode(false);
                    oParent = oElement.parentNode;

                    var parentNode = oParent || document.body;

                    this._addToParent(parentNode, oIFrame);
                    this.iframe = oIFrame;
                }

                /*
                         Show the <iframe> before positioning it since the "setXY"
                         method of DOM requires the element be in the document
                         and visible.
                 */
                this.showIframe();

                /*
                         Syncronize the size and position of the <iframe> to that
                         of the Overlay.
                 */
                this.syncIframe();
                this.stackIframe();

                // Add event listeners to update the <iframe> when necessary
                if (!this._hasIframeEventListeners) {
                    this.on('show', this.showIframe, this, true);
                    this.on('hide', this.hideIframe, this, true);
                    this.on('changeContent', this.syncIframe, this, true);

                    this._hasIframeEventListeners = true;
                }
            }

            function onBeforeShow() {
                createIFrame.call(this);
                this._iframeDeferred = false;
            }

            if (bIFrame) { // <iframe> shim is enabled

                if (this.cfg.getProperty("visible")) {
                    createIFrame.call(this);
                } else {
                    if (!this._iframeDeferred) {
                        this.on('beforeShow',onBeforeShow,this,true);
                        this._iframeDeferred = true;
                    }
                }

            } else {    // <iframe> shim is disabled
                this.hideIframe();

                if (this._hasIframeEventListeners) {
                    this.unOn('show', this.showIframe, this);
                    this.unOn('hide',this.hideIframe, this);
                    this.unOn('changeContent', this.syncIframe, this);
                    this._hasIframeEventListeners = false;
                }
            }
        },

        /**
         * "context" 속성이 변경될 때 fire되는 기본 이벤트 핸들러.
         *
         * @method configContext
         * @protected
         * @param {String} type The LCustomEvent type (usually the property name)
         * @param {Object[]} args The LCustomEvent arguments. For configuration
         * handlers, args[0] will equal the newly applied value for the property.
         * @param {Object} obj The scope object. For configuration handlers,
         * this will usually equal the owner.
         */
        configContext: function (type, args, obj) {
            var contextArgs = args[0],
            contextEl,
            elementMagnetCorner,
            contextMagnetCorner,
            triggers,
            defTriggers = this.CONTEXT_TRIGGERS;

            if (contextArgs) {
                contextEl = contextArgs[0];
                elementMagnetCorner = contextArgs[1];
                contextMagnetCorner = contextArgs[2];
                triggers = contextArgs[3];

                if (defTriggers && defTriggers.length > 0) {
                    triggers = (triggers || []).concat(defTriggers);
                }

                if (contextEl) {
                    if (typeof contextEl == "string") {
                        this.cfg.setProperty("context", [
                            document.getElementById(contextEl),
                            elementMagnetCorner,
                            contextMagnetCorner,
                            triggers ],
                            true);
                    }

                    if (elementMagnetCorner && contextMagnetCorner) {
                        this.align(elementMagnetCorner, contextMagnetCorner);
                    }

                    if (this._contextTriggers) {
                        // Unsubscribe Old Set
                        this._processTriggers(this._contextTriggers, "unOn", this._alignOnTrigger);
                    }

                    if (triggers) {
                        // Subscribe New Set
                        this._processTriggers(triggers, "on", this._alignOnTrigger);
                        this._contextTriggers = triggers;
                    }
                }
            }
        },

        /**
         * Custom Event handler for context alignment triggers. Invokes the align method
         * @method _alignOnTrigger
         * @protected
         * @param {String} type The event type (not used by the default implementation)
         * @param {Any[]} args The array of arguments for the trigger event (not used by the default implementation)
         */
        _alignOnTrigger: function(type, args) {
            this.align();
        },

        /**
         * Helper method to locate the custom event instance for the event name string
         * passed in. As a convenience measure, any custom events passed in are returned.
         * @method _findTriggerCE
         * @private
         * @param {String|LCustomEvent} t Either a LCustomEvent, or event type (e.g. "windowScroll") for which a
         * custom event instance needs to be looked up from the Overlay._TRIGGER_MAP.
         */
        _findTriggerCE: function(t) {
            var tce = null;
            if (t instanceof LCustomEvent) {
                tce = t;
            } else if (Panel._TRIGGER_MAP[t]) {
                tce = Panel._TRIGGER_MAP[t];
            }
            return tce;
        },

        /**
         * Utility method that subscribes or unsubscribes the given
         * function from the list of trigger events provided.
         * @method _processTriggers
         * @protected
         * @param {Array[String|LCustomEvent]} triggers An array of either CustomEvents, event type strings
         * (e.g. "beforeShow", "windowScroll") to/from which the provided function should be
         * subscribed/unsubscribed respectively.
         *
         * @param {String} mode Either "on" or "unOn", specifying whether or not
         * we are subscribing or unsubscribing trigger listeners
         *
         * @param {Function} fn The function to be subscribed/unsubscribed to/from the trigger event.
         * Context is always set to the overlay instance, and no additional object argument
         * get passed to the subscribed function.
         */
        _processTriggers: function(triggers, mode, fn) {
            var t, tce;

            for (var i = 0, l = triggers.length; i < l; ++i) {
                t = triggers[i];
                tce = this._findTriggerCE(t);
                if (tce) {
                    tce[mode](fn, this, true);
                } else {
                    this[mode](t, fn);
                }
            }
        },

        // END BUILT-IN PROPERTY EVENT HANDLERS //
        /**
         * overlay를 특정 코너 포인트(상수 TOP_LEFT, TOP_RIGHT, BOTTOM_LEFT, BOTTOM_RIGHT)를 사용하여
         * 컨텍스트 엘리먼트에 맞추어 조정한다.
         * @method align
         * @param {String} elementAlign  The String representing the corner of
         * the Overlay that should be aligned to the context element
         * @param {String} contextAlign  The corner of the context element
         * that the elementAlign corner should stick to.
         */
        align: function (elementAlign, contextAlign) {
            var contextArgs = this.cfg.getProperty("context"),
            me = this,
            context,
            element,
            contextRegion;

            var TOP_LEFT = "tl",     //엘리먼트의 왼쪽 상단 코너를 나타내는 상수. 컨텍스트 엘리먼트 alignment를 설정하는데 사용된다.
            TOP_RIGHT = "tr",    //엘리먼트의 오른쪽 상단 코너를 나타내는 상수.
            BOTTOM_LEFT = "bl",  //엘리먼트의 top bottom left 코너를 나타내는 상수.
            BOTTOM_RIGHT = "br"; //엘리먼트의 오른쪽 하단 코너를 나타내는 상수.

            function doAlign(v, h) {
                switch (elementAlign) {
                case TOP_LEFT:
                    me.moveTo(h, v);
                    break;
                case TOP_RIGHT:
                    me.moveTo((h - element.offsetWidth), v);
                    break;
                case BOTTOM_LEFT:
                    me.moveTo(h, (v - element.offsetHeight));
                    break;
                case BOTTOM_RIGHT:
                    me.moveTo((h - element.offsetWidth),
                            (v - element.offsetHeight));
                    break;
                }
            }

            if (contextArgs) {
                context = contextArgs[0];
                element = this.element;
                me = this;

                if (! elementAlign) {
                    elementAlign = contextArgs[1];
                }

                if (! contextAlign) {
                    contextAlign = contextArgs[2];
                }

                if (element && context) {
                    contextRegion = Dom.getRegion(context);

                    switch (contextAlign) {
                    case TOP_LEFT:
                        doAlign(contextRegion.top, contextRegion.left);
                        break;
                    case TOP_RIGHT:
                        doAlign(contextRegion.top, contextRegion.right);
                        break;
                    case BOTTOM_LEFT:
                        doAlign(contextRegion.bottom, contextRegion.left);
                        break;
                    case BOTTOM_RIGHT:
                        doAlign(contextRegion.bottom, contextRegion.right);
                        break;
                    }
                }
            }
        },

        /**
         * 주어진 x좌표값, overlay가 viewport에 제약된다면
         * 현재 엘리먼트 사이즈, viewport 크기와 스크롤 값을 기반으로,
         * 해당 위치에 필요한 계산된 좌표들을 리턴한다.
         *
         * @param {Number} x The X coordinate value to be constrained
         * @return {Number} The constrained x coordinate
         */
        getConstrainedX: function (x) {
            var oPanel = this,
            oPanelEl = oPanel.element,
            nOverlayOffsetWidth = oPanelEl.offsetWidth,
            nViewportOffset = Panel.VIEWPORT_OFFSET,
            viewPortWidth = Dom.getViewportWidth(),
            scrollX = Dom.getDocumentScrollLeft(),
            bCanConstrain = (nOverlayOffsetWidth + nViewportOffset < viewPortWidth),
            aContext = this.cfg.getProperty("context"),
            oContextEl,
            nContextElX,
            nContextElWidth,
            bFlipped = false,
            nLeftRegionWidth,
            nRightRegionWidth,
            leftConstraint,
            rightConstraint,
            xNew = x,

            oOverlapPositions = {
                "tltr": true,
                "blbr": true,
                "brbl": true,
                "trtl": true
            };

            var flipHorizontal = function () {
                var nNewX;
                if ((oPanel.cfg.getProperty("x") - scrollX) > nContextElX) {
                    nNewX = (nContextElX - nOverlayOffsetWidth);
                }
                else {
                    nNewX = (nContextElX + nContextElWidth);
                }

                oPanel.cfg.setProperty("x", (nNewX + scrollX), true);
                return nNewX;
            };

            /*
                        Uses the context element's position to calculate the availble width
                        to the right and left of it to display its corresponding Overlay.
             */
            var getDisplayRegionWidth = function () {
                // The Overlay is to the right of the context element
                if ((oPanel.cfg.getProperty("x") - scrollX) > nContextElX) {
                    return (nRightRegionWidth - nViewportOffset);
                }
                else {// The Overlay is to the left of the context element
                    return (nLeftRegionWidth - nViewportOffset);
                }
            };

            /*
                       Positions the Overlay to the left or right of the context element so that it remains
                       inside the viewport.
             */
            var setHorizontalPosition = function () {
                var nDisplayRegionWidth = getDisplayRegionWidth(),
                fnReturnVal;

                if (nOverlayOffsetWidth > nDisplayRegionWidth) {
                    if (bFlipped) {
                        /*
                                    All possible positions and values have been
                                    tried, but none were successful, so fall back
                                    to the original size and position.
                         */
                        flipHorizontal();
                    }
                    else {
                        flipHorizontal();
                        bFlipped = true;
                        fnReturnVal = setHorizontalPosition();
                    }
                }
                return fnReturnVal;
            };

            if (this.cfg.getProperty("preventcontextoverlap") && aContext &&
                    oOverlapPositions[(aContext[1] + aContext[2])]) {

                if (bCanConstrain) {
                    oContextEl = aContext[0];
                    nContextElX = Dom.getX(oContextEl) - scrollX;
                    nContextElWidth = oContextEl.offsetWidth;
                    nLeftRegionWidth = nContextElX;
                    nRightRegionWidth = (viewPortWidth - (nContextElX + nContextElWidth));

                    setHorizontalPosition();
                }
                xNew = this.cfg.getProperty("x");
            } else {

                if (bCanConstrain) {
                    leftConstraint = scrollX + nViewportOffset;
                    rightConstraint =
                        scrollX + viewPortWidth - nOverlayOffsetWidth - nViewportOffset;

                    if (x < leftConstraint) {
                        xNew = leftConstraint;
                    } else if (x > rightConstraint) {
                        xNew = rightConstraint;
                    }
                } else {
                    xNew = nViewportOffset + scrollX;
                }
            }
            return xNew;
        },

        /**
         * 주어진 y좌표값, overlay가 viewport에 제약된다면
         * 현재 엘리먼트 사이즈, viewport 크기와 스크롤 값을 기반으로,
         * 해당 위치에 필요한 계산된 좌표들을 리턴한다.
         *
         * @param {Number} y The Y coordinate value to be constrained
         * @return {Number} The constrained y coordinate
         */
        getConstrainedY: function (y) {

            var oPanel = this,
            oPanelEl = oPanel.element,
            nOverlayOffsetHeight = oPanelEl.offsetHeight,
            nViewportOffset = Panel.VIEWPORT_OFFSET,
            viewPortHeight = Dom.getViewportHeight(),
            scrollY = Dom.getDocumentScrollTop(),
            bCanConstrain = (nOverlayOffsetHeight + nViewportOffset < viewPortHeight),
            aContext = this.cfg.getProperty("context"),
            oContextEl,
            nContextElY,
            nContextElHeight,
            bFlipped = false,
            nTopRegionHeight,
            nBottomRegionHeight,
            topConstraint,
            bottomConstraint,
            yNew = y,

            oOverlapPositions = {
                "trbr": true,
                "tlbl": true,
                "bltl": true,
                "brtr": true
            };

            var flipVertical = function () {
                var nNewY;
                // The Overlay is below the context element, flip it above
                if ((oPanel.cfg.getProperty("y") - scrollY) > nContextElY) {
                    nNewY = (nContextElY - nOverlayOffsetHeight);
                } else {    // The Overlay is above the context element, flip it below
                    nNewY = (nContextElY + nContextElHeight);
                }
                oPanel.cfg.setProperty("y", (nNewY + scrollY), true);
                return nNewY;
            };
            /*
              Uses the context element's position to calculate the availble height
              above and below it to display its corresponding Overlay.
             */
            var getDisplayRegionHeight = function () {
                // The Overlay is below the context element
                if ((oPanel.cfg.getProperty("y") - scrollY) > nContextElY) {
                    return (nBottomRegionHeight - nViewportOffset);
                } else {    // The Overlay is above the context element
                    return (nTopRegionHeight - nViewportOffset);
                }
            };

            /*
                       Trys to place the Overlay in the best possible position (either above or
                       below its corresponding context element).
             */
            var setVerticalPosition = function () {
                var nDisplayRegionHeight = getDisplayRegionHeight(),
                fnReturnVal;
                if (nOverlayOffsetHeight > nDisplayRegionHeight) {
                    if (bFlipped) {
                        /*
                           All possible positions and values for the
                           "maxheight" configuration property have been
                           tried, but none were successful, so fall back
                           to the original size and position.
                         */
                        flipVertical();
                    } else {
                        flipVertical();
                        bFlipped = true;
                        fnReturnVal = setVerticalPosition();
                    }
                }
                return fnReturnVal;
            };

            if (this.cfg.getProperty("preventcontextoverlap") && aContext &&
                    oOverlapPositions[(aContext[1] + aContext[2])]) {
                if (bCanConstrain) {
                    oContextEl = aContext[0];
                    nContextElHeight = oContextEl.offsetHeight;
                    nContextElY = (Dom.getY(oContextEl) - scrollY);
                    nTopRegionHeight = nContextElY;
                    nBottomRegionHeight = (viewPortHeight - (nContextElY + nContextElHeight));
                    setVerticalPosition();
                }
                yNew = oPanel.cfg.getProperty("y");
            }
            else {
                if (bCanConstrain) {
                    topConstraint = scrollY + nViewportOffset;
                    bottomConstraint =
                        scrollY + viewPortHeight - nOverlayOffsetHeight - nViewportOffset;
                    if (y < topConstraint) {
                        yNew  = topConstraint;
                    } else if (y  > bottomConstraint) {
                        yNew  = bottomConstraint;
                    }
                } else {
                    yNew = nViewportOffset + scrollY;
                }
            }
            return yNew;
        },

        /**
         * 주어진 x,y 좌표값들, overlay가 viewport에 제약된다면
         * 현재 엘리먼트 사이즈, viewport 크기와 스크롤 값을 기반으로,
         * 해당 위치에 필요한 계산된 좌표들을 리턴한다.
         *
         * @param {Number} x The X coordinate value to be constrained
         * @param {Number} y The Y coordinate value to be constrained
         * @return {Array} The constrained x and y coordinates at index 0 and 1 respectively;
         */
        getConstrainedXY: function(x, y) {
            return [this.getConstrainedX(x), this.getConstrainedY(y)];
        },

        /**
         * viewport에서 컨테이너를 중앙에 위치시킨다.
         * Centers the container in the viewport.
         * @method center
         * @private
         */
        onCenter: function() {
        	this.centerCnt = this.centerCnt || 0;
        	this.centerLimitCnt = (Rui.platform.isMobile) ? 3 : 100000;
        	if(this.centerCnt < this.centerLimitCnt) this.center();
        	this.centerCnt++;
        },

        /**
         * viewport에서 컨테이너를 중앙에 위치시킨다.
         * Centers the container in the viewport.
         * @method center
         */
        center: function (centerIn) {
            var el = Rui.get(this.element);
            if(this.cfg.getProperty("visible") == true)
                el.removeClass('L-hidden');

            var xy = el.getAlignToXY(centerIn || document, 'c-c');
            if(Rui.platform.isMobile && xy && xy[1] < 0) xy[1] = 0;
            this.cfg.setProperty("xy", xy);
            this.cfg.refireEvent("iframe");
        },

        /**
         * DOM 에 있는 Panel의 위치를 Panel의 "xy", "x", "y" 속성과 동기화 한다.
         * 이는 주로 drag&drop 동안에 위치 정보를 갱신하는데 사용된다.
         * @method syncPosition
         */
        syncPosition: function () {
            var pos = Dom.getXY(this.element);
            this.cfg.setProperty("x", pos[0], true);
            this.cfg.setProperty("y", pos[1], true);
            this.cfg.setProperty("xy", pos, true);
        },

        /**
         * 리사이즈 모니터 엘리먼트가 리사이즈 되었을 때 fire되는 이벤트 핸들러.
         * @method onDomResize
         * @protected
         * @param {DOMEvent} e The resize DOM event
         * @param {Object} obj The scope object
         */
        onDomResize: function (e, obj) {
            var me = this;
            // Modue's onDomResize is Merged
            var nLeft = -1 * me.resizeMonitor.offsetWidth,
            nTop = -1 * me.resizeMonitor.offsetHeight;
            me.resizeMonitor.style.top = nTop + "px";
            me.resizeMonitor.style.left =  nLeft + "px";

            setTimeout(function () {
                me.syncPosition();
                me.cfg.refireEvent("iframe");
                me.cfg.refireEvent("context");
            }, 0);
        },

        /**
         * Determines the content box height of the given element (height of the element, without padding or borders) in pixels.
         * @method _getComputedHeight
         * @private
         * @param {HTMLElement} el The element for which the content height needs to be determined
         * @return {Number} The content box height of the given element, or null if it could not be determined.
         */
        _getComputedHeight: (function() {
            if (document.defaultView && document.defaultView.getComputedStyle){
                return function(el){
                    var height = null;
                    if (el.ownerDocument && el.ownerDocument.defaultView){
                        var computed = el.ownerDocument.defaultView.getComputedStyle(el,'');
                        if (computed){
                            height = parseInt(computed.height, 10);
                        }
                    }
                    return (Rui.isNumber(height)) ? height : null;
                };
            } else {
                return function(el){
                    var height = null;
                    if (el.style.pixelHeight){
                        height = el.style.pixelHeight;
                    }
                    return (Rui.isNumber(height)) ? height : null;
                };
            }
        })(),

        /**
         * Returns the sub-pixel height of the el, using getBoundingClientRect, if available,
         * otherwise returns the offsetHeight
         * @method _getPreciseHeight
         * @private
         * @param {HTMLElement} el
         * @return {Float} The sub-pixel height if supported by the browser, else the rounded height.
         */
        _getPreciseHeight: function(el) {
            var height = el.offsetHeight;

            if (el.getBoundingClientRect) {
                var rect = el.getBoundingClientRect();
                height = rect.bottom - rect.top;
            }
            return height;
        },

        /**
         * <p>
         * 컨테이너의 높이를 채우기 위해 제공된 header, body 또는 footer 엘리먼트 위의 높이를 설정한다.
         * 이 메소드는, 설정된 높이 값을 근거로 컨테이너 컨텐츠 박스의 높이를 결정하며,
         * 다른 표준 모듈 엘리먼트 높이가 확인된 후 남은 공간을 모두 채우기 위해
         * autofillheight의 높이를 결정한다.
         * </p>
         * <p><strong>NOTE:</strong> 이 메소드는
         * This method is not designed to work if an explicit
         * height has not been set on the container, since for an "auto" height container,
         * the heights of the header/body/footer will drive the height of the container.</p>
         *
         * @method fillHeight
         * @protected
         * @param {HTMLElement} el The element which should be resized to fill out the height
         * of the container element.
         */
        /**
         * Overlay fillHeight에서 container = this.element || this.innerElement, this.element가 우선이 되도록 순서 변경. panel을 height를 부모의 나머지 공간까지 채우는 메소드
         * @method fillHeight
         * @protected
         * @param {HTMLElement} el The element which should be resized to fill out the height of the container element.
         */
        fillHeight: function(el) {
            if (el) {
                var container = this.innerElement || this.element,
                containerEls = [this.header, this.body, this.footer],
                containerEl,
                total = 0,
                filled = 0,
                remaining = 0,
                validEl = false;

                for (var i = 0, l = containerEls.length; i < l; i++) {
                    containerEl = containerEls[i];
                    if (containerEl) {
                        if (el !== containerEl) {
                            filled += this._getPreciseHeight(containerEl);
                        } else {
                            validEl = true;
                        }
                    }
                }

                if (validEl) {
                    if (Rui.browser.msie || Rui.browser.opera) {
                        // Need to set height to 0, to allow height to be reduced
                        Dom.setStyle(el, 'height', 0 + 'px');
                    }

                    total = this._getComputedHeight(container);

                    // Fallback, if we can't get computed value for content height
                    if (total === null) {
                        Dom.addClass(container, "L-override-padding");
                        total = container.clientHeight; // Content, No Border, 0 Padding (set by L-override-padding)
                        Dom.removeClass(container, "L-override-padding");
                    }

                    remaining = total - filled;
                    Dom.setStyle(el, "height", remaining + "px");

                    // Re-adjust height if required, to account for el padding and border
                    //rendering 방식의 변화로 offsetHeight를 구할 수 없음.  body rendering은 나중에 이루어지기 때문, 0일때 계산하지 않음
                    if (el.offsetHeight != 0 && el.offsetHeight != remaining) {
                        remaining = remaining - (el.offsetHeight - remaining);
                        Dom.setStyle(el, "height", remaining + "px");
                    }
                }
            }
        },

        /**
         * overlay를 Rui.ui.LOverlay의 모든 다른 인스턴스들의 top에 올려놓는다.
         * @method bringToTop
         */
        bringToTop: function () {
            var aOverlays = [],
            oElement = this.element;
            function compareZIndexDesc(p_oPanel1, p_oPanel2) {
                var sZIndex1 = Dom.getStyle(p_oPanel1, "zIndex"),
                sZIndex2 = Dom.getStyle(p_oPanel2, "zIndex"),
                nZIndex1 = (!sZIndex1 || isNaN(sZIndex1)) ? 0 : parseInt(sZIndex1, 10),
                        nZIndex2 = (!sZIndex2 || isNaN(sZIndex2)) ? 0 : parseInt(sZIndex2, 10);
                if (nZIndex1 > nZIndex2) {
                    return -1;
                } else if (nZIndex1 < nZIndex2) {
                    return 1;
                } else {
                    return 0;
                }
            }

            function isOverlayElement(p_oElement) {
                var CSS_OVERLAY = "L-overlay";
                var isOverlay = Dom.hasClass(p_oElement, CSS_OVERLAY),
                Panel = Rui.ui.LPanel;
                if (isOverlay && !Dom.isAncestor(oElement, p_oElement)) {
                    if (Panel && Dom.hasClass(p_oElement, "L-panel")) {
                        aOverlays[aOverlays.length] = p_oElement;
                    } else {
                        aOverlays[aOverlays.length] = p_oElement.parentNode;
                    }
                }
            }

            Dom.getElementsBy(isOverlayElement, "DIV", document.body);
            aOverlays.sort(compareZIndexDesc);

            var oTopOverlay = aOverlays[0],
            nTopZIndex;
            if(oTopOverlay == document.body) oTopOverlay = aOverlays[1];

            if (oTopOverlay) {
                nTopZIndex = Dom.getStyle(oTopOverlay, "zIndex");

                if (!isNaN(nTopZIndex)) {
                    var bRequiresBump = false;

                    if (oTopOverlay != oElement) {
                        bRequiresBump = true;
                    } else if (aOverlays.length > 1) {
                        var nNextZIndex = Dom.getStyle(aOverlays[1], "zIndex");
                        // Don't rely on DOM order to stack if 2 overlays are at the same zindex.
                        if (!isNaN(nNextZIndex) && (nTopZIndex == nNextZIndex)) {
                            bRequiresBump = true;
                        }
                    }
                    if (bRequiresBump) {
                        this.cfg.setProperty("zindex", (parseInt(nTopZIndex, 10) + 2));
                    }
                }
            }
        },

        /**
         * @description render시 호출되는 메소드
         * @method doRender
         * @protected
         * @param {String|Object} container 부모객체 정보
         * @return {void}
         */
        doRender: function(container) {
            Rui.ui.LPanel.superclass.doRender.call(this, container);
/*
            if(typeof this.id === 'string' ){
                this.createEmptyElement(this.id);
            }
*/
            //Panel의 wrapping 컨테이너에 사용되는 기본 CSS클래스를 나타내는 상수
            Dom.addClass(this.element, "L-panel");
            this.buildWrapper();
            if(typeof this.id === 'string' ) Dom.addClass(this.element, this.id);
            	
            if(this.defaultCss)
                Dom.addClass(this.element, this.defaultCss);
            this.fireEvent('init', {target: this});
        },

        /**
         * @description render후 호출되는 메소드
         * @method afterRender
         * @protected
         * @param {HTMLElement} container 부모 객체
         * @return {void}
         */
        afterRender: function(container) {
            Rui.ui.LPanel.superclass.afterRender.call(this,container);
        },

        // Private Panel LCustomEvent listeners
        /**
         *
         * "focus" event handler for a focuable element. Used to automatically
         * blur the element when it receives focus to ensure that a Panel
         * instance's modality is not compromised.
         *
         * @method createHeader
         * @private
         * @param {Object} type
         * @param {Array} type
         */
        createHeader: function(p_sType, p_aArgs) {
            if (!this.header && this.cfg.getProperty("draggable")) {
                this.setHeader("&#160;");
            }
        },

        /**
         * "hide" event handler that sets a Panel instance's "width"
         * configuration property back to its original value before
         * "setWidthToOffsetWidth" was called..
         *
         * @method restoreOriginalWidth
         * @private
         * @param {Object} type
         * @param {Array} arguments
         * @param {Object} arguments
         */
        restoreOriginalWidth: function(p_sType, p_aArgs, p_oObject) {
            var sOriginalWidth = p_oObject[0],
            sNewWidth = p_oObject[1],
            oConfig = this.cfg,
            sCurrentWidth = oConfig.getProperty("width");

            if (sCurrentWidth == sNewWidth) {
                oConfig.setProperty("width", sOriginalWidth);
            }
            this.unOn('hide', this.restoreOriginalWidth, p_oObject);
        },

        /**
         * @method _onElementFocus
         * @private
         *
         * "focus" event handler for a focuable element. Used to automatically
         * blur the element when it receives focus to ensure that a Panel
         * instance's modality is not compromised.
         *
         * @param {Event} e The DOM event object
         */
        _onElementFocus: function(e){
            var target = Event.getTarget(e);
            if (target !== this.element && !Dom.isAncestor(this.element, target) && _currentModal == this) {
                try {
                    if (this.firstElement) {
                        Rui.later(100, this, function(){
                            try {
                                this.firstElement.focus();
                            } catch(e1) {}
                        });
                    } else {
                        if (this._modalFocus) {
                            this._modalFocus.focus();
                        } else {
                            this.innerElement.focus();
                        }
                    }
                } catch(err){
                    // Just in case we fail to focus
                    try {
                        if (target !== document && target !== document.body && target !== window) {
                            target.blur();
                        }
                    } catch(err2) { }
                }
            }
        },

        /**
         *  @method _addFocusHandlers
         *  @protected
         *  "showMask" event handler that adds a "focus" event handler to all
         *  focusable elements in the document to enforce a Panel instance's
         *  modality from being compromised.
         *  @param p_sType {String} Custom event type
         *  @param p_aArgs {Array} Custom event arguments
         */
        _addFocusHandlers: function(p_sType, p_aArgs) {

            if (!this.firstElement) {
                if (Rui.browser.webkit || Rui.browser.opera) {
                    if (!this._modalFocus) {
                        this._createHiddenFocusElement();
                    }
                } else {
                    this.innerElement.tabIndex = 0;
                }
            }
            this.setTabLoop(this.firstElement, this.lastElement);
            Event.onFocus(document.documentElement, this._onElementFocus, this, true);
            _currentModal = this;
        },

        /**
         * Creates a hidden focusable element, used to focus on,
         * to enforce modality for browsers in which focus cannot
         * be applied to the container box.
         * @method _createHiddenFocusElement
         * @private
         */
        _createHiddenFocusElement: function() {
            var e = document.createElement("button");
            e.style.height = "1px";
            e.style.width = "1px";
            e.style.position = "absolute";
            e.style.left = "-10000em";
            e.style.opacity = 0;
            e.tabIndex = "-1";
            this.innerElement.appendChild(e);
            this._modalFocus = e;
        },

        /**
         *  @method _removeFocusHandlers
         *  @protected
         *  "hideMask" event handler that removes all "focus" event handlers added
         *  by the "addFocusEventHandlers" method.
         *  @param p_sType {String} Event type
         *  @param p_aArgs {Array} Event Arguments
         */
        _removeFocusHandlers: function(p_sType, p_aArgs) {
            Event.removeFocusListener(document.documentElement, this._onElementFocus, this);

            if (_currentModal == this) {
                _currentModal = null;
            }
        },

        /**
         * Panel의 첫번째 엘리먼트에 포커스를 설정한다.
         * @method focusFirst
         * @param {Object} type
         * @param {Array}  array
         * @param {Object} object
         */
        focusFirst: function (type, args, obj) {
            var el = this.firstElement;

            if (args && args[1]) {
                Event.stopEvent(args[1]);
            }

            if (el) {
                try {
                    el.focus();
                } catch(err) {
                    // Ignore
                }
            }
        },

        /**
         * Panel의 마지막 엘리먼트에 포커스를 설정한다.
         * @method focusLast
         * @param {Object} type
         * @param {Array}  array
         * @param {Object} object
         */
        focusLast: function (type, args, obj) {
            var el = this.lastElement;

            if (args && args[1]) {
                Event.stopEvent(args[1]);
            }

            if (el) {
                try {
                    el.focus();
                } catch(err) {
                    // Ignore
                }
            }
        },

        /**
         * 첫번째와 마지막 엘리먼트 사이에 tab, shift-tab loop를 설정한다.
         * NOTE: preventBackTab과 preventTabOut LKeyListener 인스턴스 속성들을 설정한다.
         * 이들은 이 메소드가 invoke 될 때마다 리셋된다.
         * @method setTabLoop
         * @param {HTMLElement} firstElement
         * @param {HTMLElement} lastElement
         */
        setTabLoop: function(firstElement, lastElement) {

            var backTab = this.preventBackTab, tab = this.preventTabOut;

            if (backTab) {
                backTab.disable();
                this.unOn('show', backTab.enable, backTab);
                this.unOn('hide', backTab.disable, backTab);
                backTab = this.preventBackTab = null;
            }

            if (tab) {
                tab.disable();
                this.unOn('show', tab.enable, tab);
                this.unOn('hide', tab.disable,tab);
                tab = this.preventTabOut = null;
            }

            if (firstElement) {
                this.preventBackTab = new LKeyListener(firstElement,
                        {shift:true, keys:9},
                        {fn:this.focusLast, scope:this, correctScope:true}
                );
                backTab = this.preventBackTab;

                this.on('show', backTab.enable, backTab, true);
                this.on('hide', backTab.disable,backTab, true);
            }

            if (lastElement) {
                this.preventTabOut = new LKeyListener(lastElement,
                        {shift:false, keys:9},
                        {fn:this.focusFirst, scope:this, correctScope:true}
                );
                tab = this.preventTabOut;

                this.on('show', tab.enable, tab, true);
                this.on('hide', tab.disable,tab, true);
            }
        },

        /**
         * Panel 내에 속한 현재 포커스 가능한 아이템을 array로 리턴한다.
         * 메소드가 찾는 포커스 가능한 엘리먼트 셋은 Panel에서 정의된다.
         * FOCUSABLE static property
         * @method getFocusableElements
         * @param {HTMLElement} root element to start from.
         */
        getFocusableElements: function(root) {
            root = root || this.innerElement;
            /*modal mask가 보일 때, modal panel이 접근을 막는 페이지에서
             * 포커스 가능한 엘리먼트 기본 집합을 나타내는 상수
             */
            var FOCUSABLE = [
                             "a",
                             "button",
                             "select",
                             "textarea",
                             "input",
                             "iframe"
                             ];

            var focusable = {};
            for (var i = 0; i < FOCUSABLE.length; i++) {
                focusable[FOCUSABLE[i]] = true;
            }

            function isFocusable(el) {
                if (el.focus && el.type !== "hidden" && !el.disabled && focusable[el.tagName.toLowerCase()]) {
                    return true;
                }
                return false;
            }

            // Not looking by Tag, since we want elements in DOM order
            return Dom.getElementsBy(isFocusable, null, root);
        },

        /**
         * Panel의 첫번째와 마지막의 포커스 가능한 엘리먼츠에
         * firstElement와 lastElement 인스턴스 속성들을 설정한다.
         * @method setFirstLastFocusable
         */
        setFirstLastFocusable: function() {
            this.firstElement = null;
            this.lastElement = null;

            var elements = this.getFocusableElements();
            this.focusableElements = elements;

            if (elements.length > 0) {
                this.firstElement = elements[0];
                this.lastElement = elements[elements.length - 1];
            }

            if (this.cfg.getProperty("modal")) {
                this.setTabLoop(this.firstElement, this.lastElement);
            }
        },

        /**
         * @description Dom객체 생성 및 초기화하는 메소드
         * @method initComponent
         * @protected
         * @param {String|Object} el 객체의 아이디나 객체
         * @param {Object} oConfig 환경정보 객체
         * @return {void}
         */
        initComponent: function(oConfig){
            Rui.ui.LPanel.superclass.initComponent.call(this);

            if (this.isSecure) {
                this.imageRoot = Panel.IMG_ROOT_SSL;
            }

            if(!this.id) this.id = Rui.useFixedId() ? Rui.id(this.el, 'LPanel-' + this.id) : Rui.id();
        },

        /**
         * @description 객체의 이벤트 초기화 메소드
         * @method initEvents
         * @protected
         * @return {void}
         */
        initEvents: function () {
            Rui.ui.LPanel.superclass.initEvents.call(this);

            //Panel의 이벤트 명을 나타내는 상수
            var EVENT_TYPES = {
                    "RENDER": "render",
                    "DRAG": "drag"
            };

            var SIGNATURE = LCustomEvent.LIST;

            /**
             * Event fired prior to class initalization.
             * @event beforeInit
             * @param {class} classRef class reference of the initializing
             * class, such as this.beforeInitEvent.fire(Module)
             */
            this.createEvent('beforeInit');

            /**
             * Event fired after class initalization.
             * @event init
             * @param {class} classRef class reference of the initializing
             * class, such as this.beforeInitEvent.fire(Module)
             */
            this.createEvent('init');

            /**
             * Event fired before the Module is rendered
             * @event beforeRender
             */
            this.createEvent('beforeRender');

            /**
             * LCustomEvent fired after the Module is rendered
             * @event render
             */
            this.renderEvent.signature = SIGNATURE;

            /**
             * Event fired when the header content of the Module
             * is modified
             * @event changeHeader
             * @param {String/HTMLElement} content String/element representing
             * the new header content
             */
            this.createEvent('changeHeader');

            /**
             * Event fired when the body content of the Module is modified
             * @event changeBody
             * @param {String/HTMLElement} content String/element representing
             * the new body content
             */
            this.createEvent('changeBody');

            /**
             * Event fired when the footer content of the Module
             * is modified
             * @event changeFooter
             * @param {String/HTMLElement} content String/element representing
             * the new footer content
             */
            this.createEvent('changeFooter');

            /**
             * Event fired when the content of the Module is modified
             * @event changeContent
             */
            this.createEvent('changeContent');

            /**
             * Event fired when the Module is destroyed
             * @event destroy
             */

            /**
             * Event fired before the Module is shown
             * @event beforeShow
             */
            this.createEvent('beforeShow');

            /**
             * Event fired before the Module is hidden
             * @event beforeHide
             */
            this.createEvent('beforeHide');

            /**
             * modal mask(팝업 뒤의 화면)가 보여진 후 LCustomEvent가 fired 된다.
             * @event showMask
             */
            this.createEvent('showMask');

            /**
             * modal mask(팝업 뒤의 화면)가 숨겨진 후 LCustomEvent가 fired 된다
             * @event hideMask
             */
            this.createEvent('hideMask');

            /**
             * Panel이 드래그될 때 LCustomEvent fired
             * @event drag
             */
            this.dragEvent = this.createEvent(EVENT_TYPES.DRAG, { isCE: true });
            this.dragEvent.signature = SIGNATURE;

            /**
             * panel 이동되기 전에 fire move event
             * @event beforeMove
             * @param {Number} x x coordinate
             * @param {Number} y y coordinate
             */
            this.createEvent('beforeMove');

            this.on('showMask', this._addFocusHandlers, this, true);
            this.on('hideMask', this._removeFocusHandlers, this, true);
            this.on('beforeRender', this.createHeader, this, true);

            this.renderEvent.on( function() {
                this.setFirstLastFocusable();
                this.on('changeContent', this.setFirstLastFocusable, this, true);
            }, this, true, {isCE:true});

            this.on('show', this.focusFirst, this, true);
        },

        /**
         * Initializes the custom events for Module and Overlay which are fired
         * automatically at appropriate times by the Module and Overlay class.
         * @method _initConfig
         * @private
         */
        _initConfig: function () {
            // Add Module properties //
            /**
             * Specifies whether the Module is visible on the page.
             * @config visible
             * @type Boolean
             * @default true
             */
            this.cfg.addProperty(DEFAULT_CONFIG.VISIBLE.key, {
                handler: this.configVisible,
                value: DEFAULT_CONFIG.VISIBLE.value,
                validator: DEFAULT_CONFIG.VISIBLE.validator
            });

            /**
             * <p>
             * Object or array of objects representing the ContainerEffect
             * classes that are active for animating the container.
             * </p>
             * <p>
             * <strong>NOTE:</strong> Although this configuration
             * property is introduced at the Module level, an out of the box
             * implementation is not shipped for the Module class so setting
             * the proroperty on the Module class has no effect. The Overlay
             * class is the first class to provide out of the box ContainerEffect
             * support.
             * </p>
             * @config effect
             * @type Object
             * @default null
             */
            this.cfg.addProperty(DEFAULT_CONFIG.EFFECT.key, {
                suppressEvent: DEFAULT_CONFIG.EFFECT.suppressEvent,
                supercedes: DEFAULT_CONFIG.EFFECT.supercedes
            });

            /**
             * Specifies whether to create a special proxy iframe to monitor
             * for user font resizing in the document
             * @config monitorresize
             * @type Boolean
             * @default true
             */
            this.cfg.addProperty(DEFAULT_CONFIG.MONITOR_RESIZE.key, {
                handler: this.configMonitorResize,
                value: DEFAULT_CONFIG.MONITOR_RESIZE.value
            });

            // Add overlay config properties
            /**
             * overlay의 x 절대좌표 위치
             * @config x
             * @type Number
             * @default null
             */
            this.cfg.addProperty(DEFAULT_CONFIG.X.key, {
                handler: this.configX,
                validator: DEFAULT_CONFIG.X.validator,
                suppressEvent: DEFAULT_CONFIG.X.suppressEvent,
                supercedes: DEFAULT_CONFIG.X.supercedes
            });

            /**
             * overlay의 y 절대좌표 위치
             * @config y
             * @type Number
             * @default null
             */
            this.cfg.addProperty(DEFAULT_CONFIG.Y.key, {
                handler: this.configY,
                validator: DEFAULT_CONFIG.Y.validator,
                suppressEvent: DEFAULT_CONFIG.Y.suppressEvent,
                supercedes: DEFAULT_CONFIG.Y.supercedes
            });

            /**
             * overlay의 x와 y의 절대좌표 위치를 가진 배열
             * @config xy
             * @type Number[]
             * @default null
             */
            this.cfg.addProperty(DEFAULT_CONFIG.XY.key, {
                handler: this.configXY,
                suppressEvent: DEFAULT_CONFIG.XY.suppressEvent,
                supercedes: DEFAULT_CONFIG.XY.supercedes
            });

            /**
             * <p>
             * context-sensitive 포지셔닝을 위한 컨텍스트 아규먼트들의 배열
             * </p>
             *
             * <p>
             * 배열의 포맷 : <code>[contextElementOrId, overlayCorner, contextCorner, arrayOfTriggerEvents (optional)]</code>,
             * 4개의 배열 엘리먼트는 아래에 상세하게 기술되어 있다.
             * </p>
             *
             * <dl>
             * <dt>contextElementOrId &#60;String|HTMLElement&#62;</dt>
             * <dd>overlay가 맞추어 정렬되는 컨텍스트 엘리먼트에 대한 레퍼런스(또는 해당 id).</dd>
             * <dt>overlayCorner &#60;String&#62;</dt>
             * <dd>정렬에 사용되는 overlay의 코너. 이 코너는 뒤에 오는 "contextCorner" 엔트리에 의해 정의된
             * 컨텍스트 엘리먼트의 코너이다. 지원되는 문자열 값 :
             * "tr" (top right), "tl" (top left), "br" (bottom right), or "bl" (bottom left).</dd>
             * <dt>contextCorner &#60;String&#62;</dt>
             * <dd>정렬에 사용되는 컨텍스트 엘리먼트의 코너. 지원되는 문자열 값은 위의 overlayCorner 엔트리에서 리스트업 된 목록과 동일하다.</dd>
             * <dt>arrayOfTriggerEvents (optional) &#60;Array[String|LCustomEvent]&#62;</dt>
             * <dd>
             * <p>
             * 기본적으로 컨텍스트 alignment는 일회성 오퍼레이션이며,
             * 컨텍스트 컨피그 정보가 설정되었을 때 또는 <a href="#method_align">align</a> 메소드가 invoke 되었을 때
             * overlay를 컨텍스트 엘리먼트에 맞추어 조정한다.
             * 이는 다큐먼트 레이아웃이 변경되는 상황에서 유용하며 컨텍스트 엘리먼트의 위치가 변경되는 결과를 가져온다.
             * </p>
             * <p>
             *
             * 이 배열은, 인스턴스가 Publish하는 이벤트의 이벤트 타입 문자열(e.g. "beforeShow") 또는 LCustomEvent 인스턴스 중 하나를 포함한다.
             * 추가적으로 뒤에 나오는 3가지 static 컨테이너 이벤트 타입들 역시 현재 지원된다 : <code>"windowResize", "windowScroll", "textResize"</code> (defined in <a href="#property__TRIGGER_MAP">_TRIGGER_MAP</a> private property).
             * </p>
             * </dd>
             * </dl>
             *
             * <p>
             * 예를 들어, 이 속성을 <code>["img1", "tl", "bl"]</code>로 설정하는 것은
             * overlay의 왼쪽 상단 코너를 id "img1"로 컨텍스트 엘리먼트의 왼쪽 하단 코너에 맞추어 정렬하는 것이다.
             * </p>
             * <p>
             * 선택적인 트리거 값을 추가하는 경우 : <code>["img1", "tl", "bl", ["beforeShow", "windowResize"]]</code>
             * "beforeShow" 또는 "windowResize"이벤트가 fired될 때마다 항상 overlay 위치를 재정렬 할 것이다.
             * </p>
             *
             * @config context
             * @type Array
             * @default null
             */
            this.cfg.addProperty(DEFAULT_CONFIG.CONTEXT.key, {
                handler: this.configContext,
                suppressEvent: DEFAULT_CONFIG.CONTEXT.suppressEvent,
                supercedes: DEFAULT_CONFIG.CONTEXT.supercedes
            });

            /**
             * overlay가 viewport 중앙에 고정되어야 할 경우 True
             * @config fixedcenter
             * @type Boolean
             * @default false
             */
            this.cfg.addProperty(DEFAULT_CONFIG.FIXED_CENTER.key, {
                handler: this.configFixedCenter,
                value: DEFAULT_CONFIG.FIXED_CENTER.value,
                validator: DEFAULT_CONFIG.FIXED_CENTER.validator,
                supercedes: DEFAULT_CONFIG.FIXED_CENTER.supercedes
            });

            /**
             * height 설정 값이 정해지면 overlay의 높이를 자동적으로 늘리는 표준 모듈 엘리먼트
             * 지원되는 값은 "header", "body", "footer"
             *
             * @config autofillheight
             * @type String
             * @default null
             */
            this.cfg.addProperty(DEFAULT_CONFIG.AUTO_FILL_HEIGHT.key, {
                handler: this.configAutoFillHeight,
                value: DEFAULT_CONFIG.AUTO_FILL_HEIGHT.value,
                validator: this._validateAutoFill,
                suppressEvent: DEFAULT_CONFIG.AUTO_FILL_HEIGHT.suppressEvent,
                supercedes: DEFAULT_CONFIG.AUTO_FILL_HEIGHT.supercedes
            });

            /**
             * Overlay의 CSS z-index
             * @config zIndex
             * @type Number
             * @default null
             */
            this.cfg.addProperty(DEFAULT_CONFIG.ZINDEX.key, {
                handler: this.configzIndex,
                value: DEFAULT_CONFIG.ZINDEX.value
            });

            /**
             * @config iframe
             * @description overlay가 IFRAME shim을 가지고 있는지 여부를 알려주는 Boolean 값;
             * IE6에서 SELECT 엘리먼트가 overlay 인스턴스를 통해 poking되는 것을 막기위해 사용된다.
             * iframe shim은 overlay 인스턴스가 처음에 보이게 될 때 생성된다.
             * @type Boolean
             * @default true for IE6 and below, false for all other browsers.
             */
            this.cfg.addProperty(DEFAULT_CONFIG.IFRAME.key, {
                handler: this.configIframe,
                value: DEFAULT_CONFIG.IFRAME.value,
                validator: DEFAULT_CONFIG.IFRAME.validator,
                supercedes: DEFAULT_CONFIG.IFRAME.supercedes
            });

            /**
             * @config preventcontextoverlap
             * @description overlay가 "constraintoviewport" 속성 값이 "true"로 설정되어 있을 때
             * 해당 컨텍스트 엘리먼트("context" 속성 값을 사용하여 정의)와 겹쳐져야 하는지 여부를 알려주는 Boolean 값
             * @type Boolean
             * @default false
             */
            this.cfg.addProperty(DEFAULT_CONFIG.PREVENT_CONTEXT_OVERLAP.key, {
                value: DEFAULT_CONFIG.PREVENT_CONTEXT_OVERLAP.value,
                validator: DEFAULT_CONFIG.PREVENT_CONTEXT_OVERLAP.validator,
                supercedes: DEFAULT_CONFIG.PREVENT_CONTEXT_OVERLAP.supercedes
            });
        },

        /**
         * Panel의 컨피그 오브젝트(cgf)를 사용해서 변경될 수 있는,
         * 클래스의 컨피그 속성들을 초기화한다.
         * @method initDefaultConfig
         * @protected
         */
        initDefaultConfig: function () {
            Rui.ui.LPanel.superclass.initDefaultConfig.call(this);

            this._initConfig();

            this.cfg.addProperty('header', {
                handler: this.configHeader,
                value: this.header
            });

            this.cfg.addProperty('footer', {
                handler: this.configFooter,
                value: this.footer
            });

            // Add panel config properties
            /**
             * Panel이 "닫힘" 버튼을 보여주어야 한다면 참(true).
             * @config close
             * @type Boolean
             * @default true
             */
            this.cfg.addProperty(DEFAULT_CONFIG.CLOSE.key, {
                handler: this.configClose,
                value: DEFAULT_CONFIG.CLOSE.value,
                validator: DEFAULT_CONFIG.CLOSE.validator,
                supercedes: DEFAULT_CONFIG.CLOSE.supercedes
            });

            /**
             * Panel이 드래그가 가능하게 되어야 할 경우 Boolean 설정.
             * 드래그앤드롭 유틸이 포함되어 있다면 기본값은 "true"이고 아니면 "false".
             * <strong>PLEASE NOTE:</strong> IE6(Strict모드와 Quirks모드)와
             * IE7(Quirks모드)에서 이미 알려진 이슈, "width" 설정값을 위한 value set을
             * 가지고 있지 않거나 "width" 설정값이 "auto"로 설정되어 있는 Panel이
             * 마우스를 Panel의 헤더 엘리먼트 텍스트에 올려서만 드래그할 수 있다는 것이다.
             * 이 버그를 수정하기 위해, "width" 설정값에 대한 value를 잃어버린 또는
             * "width"설정 값이 "auto"로 설정된 draggable Panels는, Panels가 보이기 전에
             * root HTML 엘리먼트의 offsetWidth 값으로 설정해야 한다.
             * 계산된 width는 Panel이 숨겨질 때 제거된다.
             * <em>이 수정본은 IE6(Strict모드와 Quirks모드)와 IE7(Quirks모드)에서의
             * draggable Panels에서만 적용된다.</em>
             * 자세한 사항은 이곳을 참조하라:
             * SourceForge bugs #1726972 and #1589210.
             * @config draggable
             * @type Boolean
             * @default true
             */
            this.cfg.addProperty(DEFAULT_CONFIG.DRAGGABLE.key, {
                handler: this.configDraggable,
                value: (Rui.dd.LDD) ? true : false,
                        validator: DEFAULT_CONFIG.DRAGGABLE.validator,
                        supercedes: DEFAULT_CONFIG.DRAGGABLE.supercedes
            });

            /**
             * draggable Panel이 페이지 위 drop할 대상과 상호 작용하는 것이 아니라
             *  drag만 되어야 할지 정의한다.
             * <p>
             * true로 설정할 때 draggable Panel은 drop 대상 위에 있는지의 여부 또는 LDragDrop 이벤트
             * (drop할 대상에 동작하도록 지원이 필요함. onDragEnter, onDragOver, onDragOut, onDragDrop 등)
             * 를 fire하는지 체크하지 않는다.
             * 패널이 페이지의 어떠한 타겟 엘리먼트에도 drop되도록 설계되지 않는다면
             * 이 flag는 성능을 향상시키기 위해 true로 설정될 수 있다.
             * </p>
             * <p>
             * false로 설정되면 이벤트와 관련된 모든 drop target이 fire 될 것이다.
             * </p>
             * <p>
             * 속성은 하위 버전 호환성을 유지하기 위해 기본으로 false로 설정되어 있다.
             * 그러나 drop 대상의 인터랙션이 패널에 필요하지 않다면 성능 향상을 위해 true로 설정되어야 한다.</p>
             *
             * @config dragOnly
             * @type Boolean
             * @default false
             */
            this.cfg.addProperty(DEFAULT_CONFIG.DRAG_ONLY.key, {
                value: DEFAULT_CONFIG.DRAG_ONLY.value,
                validator: DEFAULT_CONFIG.DRAG_ONLY.validator,
                supercedes: DEFAULT_CONFIG.DRAG_ONLY.supercedes
            });

            /**
             * 패널을 보여주는 underlay 타입을 설정한다.
             * 유효값은 "shadow," "matte,"와 "none". <strong>PLEASE NOTE:</strong>
             * underlay 엘리먼트 생성은 패널이 처음 보이게 될 때까지 늦추어진다.
             * Mac OS X의 Gecko-based 브라우저에는,
             * 패널 인스턴스 아래로 Aqua 스크롤바가 뚫고 지나가는 것을 방지하기 위해
             * underlay 엘리먼트가 shim(연결판)으로 사용됨으로써 underlay 엘리먼트가 항상 생성된다.
             * (SourceForge bug #836476 참조)
             * @config underlay
             * @type String
             * @default shadow
             */
            this.cfg.addProperty(DEFAULT_CONFIG.UNDERLAY.key, {
                handler: this.configUnderlay,
                value: DEFAULT_CONFIG.UNDERLAY.value,
                supercedes: DEFAULT_CONFIG.UNDERLAY.supercedes
            });

            /**
             * 패널이 모달 방식으로 보여져야 한다면 True,
             * 패널이 해제될 때까지 제거되지 않는 문서 위로 투명한 mask를 자동 생성한다.
             * @config modal
             * @type Boolean
             * @default false
             */
            this.cfg.addProperty(DEFAULT_CONFIG.MODAL.key, {
                handler: this.configModal,
                value: DEFAULT_CONFIG.MODAL.value,
                validator: DEFAULT_CONFIG.MODAL.validator,
                supercedes: DEFAULT_CONFIG.MODAL.supercedes
            });

            /**
             * 패널이 보여질 때 사용 가능하고 패널이 감추어졌을 때 사용 불가능한
             * LKeyListener(또는 LKeyListener Array)
             * @config keylisteners
             * @type Rui.util.LKeyListener[]
             * @default null
             */
            this.cfg.addProperty(DEFAULT_CONFIG.KEY_LISTENERS.key, {
                handler: this.configKeyListeners,
                suppressEvent: DEFAULT_CONFIG.KEY_LISTENERS.suppressEvent,
                supercedes: DEFAULT_CONFIG.KEY_LISTENERS.supercedes
            });

            /**
             * UI Strings used by the Panel
             *
             * @config strings
             * @type Object
             * @default An object literal with the properties shown below:
             *     <dl>
             *         <dt>close</dt><dd><em>String</em> : The string to use for the close icon. Defaults to "Close".</dd>
             *     </dl>
             */
            this.cfg.addProperty(DEFAULT_CONFIG.STRINGS.key, {
                value:DEFAULT_CONFIG.STRINGS.value,
                handler:this.configStrings,
                validator:DEFAULT_CONFIG.STRINGS.validator,
                supercedes:DEFAULT_CONFIG.STRINGS.supercedes
            });

        },

        // BEGIN BUILT-IN PROPERTY EVENT HANDLERS //

        /**
         * autofillheight validator. Verifies that the autofill value is either null
         * or one of the strings : "body", "header" or "footer".
         *
         * @method _validateAutoFillHeight
         * @protected
         * @param {String} val
         * @return true, if valid, false otherwise
         */
        _validateAutoFillHeight: function(val) {
            return (!val) || (Rui.isString(val) && Panel.STD_MOD_RE.test(val));
        },

        /**
         * set header property value
         *
         * @method configHeader
         * @private
         * @param {Object} type
         * @param {Array}  array
         * @param {Object} object
         */
        configHeader: function(type, args, obj){

            if(this.header && typeof this.header === 'string'){
                var tmpHeader = this.createModuleHeader();
                tmpHeader.innerHTML = this.header;
                this.header = tmpHeader;
            } else if(this.header != null && !Dom.hasClass(this.header, Panel.CSS_HEADER)){

                var me = this.header;
                var oHeader = this.header = this.createModuleHeader();
                if (me.nodeName) {
                    oHeader.innerHTML = "";
                    oHeader.appendChild(me);
                } else {
                    oHeader.innerHTML = me;
                }

                if(this._rendered) {
                    this._renderHeader();
                }
                this._applyContent('changeHeader', me);
            }
        },

        /**
         * set footer property value
         *
         * @method configFooter
         * @private
         * @param {Object} type
         * @param {Array}  array
         * @param {Object} object
         */
        configFooter: function(type, args, obj){
            if(this.footer && typeof this.footer === 'string'){
                var tmpFooter = this.createFooter();
                tmpFooter.innerHTML = this.footer;
                this.footer = tmpFooter;

            }else if(this.footer != null && !Dom.hasClass(this.footer, Panel.CSS_FOOTER)){

                var me = this.footer;
                var oFooter = this.footer = this.createFooter();

                if (me.nodeName) {
                    oFooter.innerHTML = "";
                    oFooter.appendChild(me);
                } else {
                    oFooter.innerHTML = me;
                }

                if(this._rendered) {
                    this._renderFooter();
                }
                this._applyContent('changeFooter', me);
            }
        },

        /**
         * close 속성이 변경될 때 fire되는 기본 이벤트 핸들러
         * 메소드는 패널의 오른쪽 위에 close 아이콘을 추가하거나 숨기는 것을 제어한다.
         * @method configClose
         * @protected
         * @param {String} type The LCustomEvent type (usually the property name)
         * @param {Object[]} args The LCustomEvent arguments. For configuration
         * handlers, args[0] will equal the newly applied value for the property.
         * @param {Object} obj The scope object. For configuration handlers,
         * this will usually equal the owner.
         */
        configClose: function (type, args, obj) {
            var val = args[0],
            oClose = this.close,
            strings = this.cfg.getProperty("strings");

            if (val) {
                if (!oClose || this.close) {

                    if (!this.m_oCloseIconTemplate) {
                        this.m_oCloseIconTemplate = document.createElement("a");
                        this.m_oCloseIconTemplate.className = "container-close";
                        this.m_oCloseIconTemplate.href = "#";
                    }

                    oClose = this.m_oCloseIconTemplate.cloneNode(true);
                    this.innerElement.appendChild(oClose);
                    // non-breaking space (&nbsp;)
                    oClose.innerHTML = (strings && strings.close) ? strings.close : "&#160;";
                    Event.on(oClose, "click", this._doClose, this, true);

                    this.close = oClose;

                    if(Rui.useAccessibility())
                        this.close.setAttribute('aria-controls', this.el.id);

                } else {
                    oClose.style.display = "block";
                }
            } else {
                if (oClose) {
                    oClose.style.display = "none";
                }
            }
        },

        /**
         * close 아이콘을 위한 이벤트 핸들러
         * @method _doClose
         * @protected
         * @param {DOMEvent} e
         */
        _doClose: function (e) {
            Event.preventDefault(e);
            this.hide(false);
        },

        /**
         * draggable 속성이 변경될 때 fire되는 기본 이벤트 핸들러
         * @method configDraggable
         * @protected
         * @param {String} type The LCustomEvent type (usually the property name)
         * @param {Object[]} args The LCustomEvent arguments. For configuration
         * handlers, args[0] will equal the newly applied value for the property.
         * @param {Object} obj The scope object. For configuration handlers,
         * this will usually equal the owner.
         */
        configDraggable: function (type, args, obj) {
            var val = args[0];
            if (val) {
                if (!Rui.dd.LDD) {
                    this.cfg.setProperty("draggable", false);
                    return;
                }

                if (this.header) {
                    Dom.setStyle(this.header, "cursor", "move");
                    this.registerDragDrop();
                }

            } else {

                if (this.dd) {
                    this.dd.unreg();
                }

                if (this.header) {
                    Dom.setStyle(this.header,"cursor","auto");
                }
            }
        },

        /**
         * underlay 속성이 변경될 때 fire되는 기본 이벤트 핸들러
         * @method configUnderlay
         * @protected
         * @param {String} type The LCustomEvent type (usually the property name)
         * @param {Object[]} args The LCustomEvent arguments. For configuration
         * handlers, args[0] will equal the newly applied value for the property.
         * @param {Object} obj The scope object. For configuration handlers,
         * this will usually equal the owner.
         */
        configUnderlay: function (type, args, obj) {
        // TODO: 차후 이 기능들은 모두 삭제 필요
return;
            var bMacGecko = (Rui.platform.mac && Rui.browser.gecko),
            sUnderlay = args[0].toLowerCase(),
            oUnderlay = this.underlay,
            oElement = this.element;

            function fixWebkitUnderlay() {
                // Webkit 419.3 (Safari 2.x) does not update
                // it's Render Tree for the Container when content changes.
                // We need to force it to update using this contentChange
                // listener

                // Webkit 523.6 doesn't have this problem and doesn't
                // need the fix
                var u = this.underlay;
                Dom.addClass(u, "L-force-redraw");
                window.setTimeout(function(){Dom.removeClass(u, "L-force-redraw");}, 0);
            }

            function createUnderlay() {

                if (!oUnderlay) { // create if not already in DOM
                    if (!this.m_oUnderlayTemplate) {
                        this.m_oUnderlayTemplate = document.createElement("div");
                        this.m_oUnderlayTemplate.className = "underlay";
                    }

                    oUnderlay = this.m_oUnderlayTemplate.cloneNode(false);
                    this.element.appendChild(oUnderlay);

                    this.underlay = oUnderlay;

                    if (bIEQuirks) {
                        this.sizeUnderlay();
                        this.cfg.subscribeToConfigEvent("width", this.sizeUnderlay);
                        this.cfg.subscribeToConfigEvent("height", this.sizeUnderlay);

                        this.on('changeContent', this.sizeUnderlay, this, true);
                        Panel.textResizeEvent.on(this.sizeUnderlay, this, true, {isCE:true});
                    }

                    if (Rui.browser.webkit && Rui.browser.webkit < 420) {
                        this.on('changeContent', fixWebkitUnderlay, this, true);
                    }
                }
            }

            function onBeforeShow() {
                var bNew = createUnderlay.call(this);
                if (!bNew && bIEQuirks) {
                    this.sizeUnderlay();
                }
                this._underlayDeferred = false;
            }

            function destroyUnderlay() {
                if (this._underlayDeferred) {
                    this.unOn('beforeShow', onBeforeShow, this);
                    this._underlayDeferred = false;
                }

                if (oUnderlay) {
                    this.cfg.unsubscribeFromConfigEvent("width", this.sizeUnderlay);
                    this.cfg.unsubscribeFromConfigEvent("height",this.sizeUnderlay);
                    this.unOn('changeContent', this.sizeUnderlay,this);
                    this.unOn('changeContent', fixWebkitUnderlay,this);
                    Panel.textResizeEvent.unOn(this.sizeUnderlay,this);
                    this.element.removeChild(oUnderlay);
                    this.underlay = null;
                }
            }

            switch (sUnderlay) {
            case "shadow":
                Dom.removeClass(oElement, "matte");
                Dom.addClass(oElement, "shadow");
                break;
            case "matte":
                if (!bMacGecko) {
                    destroyUnderlay.call(this);
                }
                Dom.removeClass(oElement, "shadow");
                Dom.addClass(oElement, "matte");
                break;
            default:
                if (!bMacGecko) {
                    destroyUnderlay.call(this);
                }
            Dom.removeClass(oElement, "shadow");
            Dom.removeClass(oElement, "matte");
            break;
            }

            if ((sUnderlay == "shadow") || (bMacGecko && !oUnderlay)) {
                if (this.cfg.getProperty("visible")) {
                    var bNew = createUnderlay.call(this);
                    if (!bNew && bIEQuirks) {
                        this.sizeUnderlay();
                    }
                } else {
                    if (!this._underlayDeferred) {
                        this.on('beforeShow', onBeforeShow, this, true);
                        this._underlayDeferred = true;
                    }
                }
            }
        },

        /**
         * modal 속성이 변경될 때 fire되는 기본 이벤트 핸들러
         * 이 핸들러는 modal 마스크를 보여주거나 숨기기 위해 show와 hide 이벤트를
         * 등록 또는 해지한다.
         * @method configModal
         * @protected
         * @param {String} type The LCustomEvent type (usually the property name)
         * @param {Object[]} args The LCustomEvent arguments. For configuration
         * handlers, args[0] will equal the newly applied value for the property.
         * @param {Object} obj The scope object. For configuration handlers,
         * this will usually equal the owner.
         */
        configModal: function (type, args, obj) {
            var modal = args[0];
            if (modal) {
                if (!this._hasModalityEventListeners) {
                    this.on('beforeShow', this.buildMask, this, true);
                    this.on('beforeShow',this.bringToTop, this, true);
                    this.on('beforeShow', this.showMask, this, true);
                    this.on('hide', this.hideMask, this, true);

                    Panel.windowResizeEvent.on(this.sizeMask,
                            this, true,{isCE:true});

                    this._hasModalityEventListeners = true;
                }
            } else {
                if (this._hasModalityEventListeners) {

                    if (this.cfg.getProperty("visible")) {
                        this.hideMask();
                        this.removeMask();
                    }

                    this.unOn('beforeShow', this.buildMask, this);
                    this.unOn('beforeShow', this.bringToTop, this);
                    this.unOn('beforeShow', this.showMask, this);
                    this.unOn('hide', this.hideMask, this);

                    Panel.windowResizeEvent.unOn(this.sizeMask, this);
                    this._hasModalityEventListeners = false;
                }
            }
        },

        /**
         * modal 마스크를 제거한다.
         * @method removeMask
         * @private
         */
        removeMask: function () {
            var oMask = this.mask,
            oParentNode;
            if (oMask) {
                /*
                   Hide the mask before destroying it to ensure that DOM
                   event handlers on focusable elements get removed.
                 */
                this.hideMask();

                oParentNode = oMask.parentNode;
                if (oParentNode) {
                    oParentNode.removeChild(oMask);
                }
                this.mask = null;
            }
        },

        /**
         * keylisteners 속성이 변경될 때 fire되는 기본 이벤트 핸들러
         * @method configKeyListeners
         * @protected
         * @param {String} type The LCustomEvent type (usually the property name)
         * @param {Object[]} args The LCustomEvent arguments. For configuration
         * handlers, args[0] will equal the newly applied value for the property.
         * @param {Object} obj The scope object. For configuration handlers,
         * this will usually equal the owner.
         */
        configKeyListeners: function (type, args, obj) {
            var listeners = args[0],
            listener, nListeners, i;

            if (listeners) {
                if (listeners instanceof Array) {
                    nListeners = listeners.length;
                    for (i = 0; i < nListeners; i++) {
                        listener = listeners[i];

                        if (!this.hasEvent('show', listener.enable, listener)) {
                            this.on('show', listener.enable, listener, true);
                        }

                        if (!this.hasEvent('hide', listener.disable, listener)) {
                            this.on('hide', listener.disable, listener, true);
                            this.on('destroy', listener.disable, listener, true);
                        }
                    }
                } else {
                    if(listeners === true) {
                        listeners = new Rui.util.LKeyListener(
                                this.element,
                                { keys: [ Rui.util.LKey.KEY.ESCAPE ] },
                                {
                                    fn: function(e){
                                        this.hide();
                                    },
                                    scope: this,
                                    correctScope: true
                                }
                        );
                    }

                    if (!this.hasEvent('show', listeners.enable, listeners)) {
                        this.on('show',listeners.enable, listeners, true);
                    }

                    if (!this.hasEvent('hide', listeners.disable, listeners)) {
                        this.on('hide',listeners.disable, listeners, true);
                        this.on('destroy', listeners.disable, listeners, true);
                    }
                }
            }
        },

        /**
         * strings 속성을 위한 기본 핸들러
         * @method configStrings
         * @protected
         */
        configStrings: function(type, args, obj) {
            var val = Rui.merge(DEFAULT_CONFIG.STRINGS.value, args[0]);
            this.cfg.setProperty(DEFAULT_CONFIG.STRINGS.key, val, true);
        },

        /**
         * height 속성이 변경될 때 fire되는 기본 이벤트 핸들러
         * @method _setHeight
         * @protected
         * @param {String} type The LCustomEvent type (usually the property name)
         * @param {Object[]} args The LCustomEvent arguments. For configuration
         * handlers, args[0] will equal the newly applied value for the property.
         * @param {Object} obj The scope object. For configuration handlers,
         * this will usually equal the owner.
         */
        _setHeight: function(type, args, obj) {
            Rui.ui.LPanel.superclass._setHeight.apply(this, arguments);
            this.cfg.refireEvent("iframe");
        },

        /**
         * width 속성이 변경될 때 fire되는 기본 이벤트 핸들러
         * @method _setWidth
         * @protected
         * @param {String} type The LCustomEvent type (usually the property name)
         * @param {Object[]} args The LCustomEvent arguments. For configuration
         * handlers, args[0] will equal the newly applied value for the property.
         * @param {Object} obj The scope object. For configuration handlers,
         * this will usually equal the owner.
         */
        _setWidth: function(type, args, obj) {
            Rui.ui.LPanel.superclass._setWidth.apply(this, arguments);
            this.cfg.refireEvent("iframe");
        },

        /**
         * The default custom event handler executed when the Panel's height is changed,
         * if the autofillheight property has been set.
         *
         * @method _autoFillOnHeightChange
         * @protected
         * @param {String} type The event type
         * @param {Array} args The array of arguments passed to event subscribers
         * @param {HTMLElement} el The header, body or footer element which is to be resized to fill
         * out the containers height
         */
        _autoFillOnHeightChange: function(type, args, el) {
            if (!this.delayfillHeight) {
                this.delayfillHeight = new Rui.util.LDelayedTask(function(){
                    this.fillHeight(el);
                    this.delayfillHeight = null;
                }, this);
                this.delayfillHeight.delay(100);
            }
            if (bIEQuirks) {
                this.sizeUnderlay();
            }
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
            this.element.style.top = top + 'px';
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
            this.element.style.left = left + 'px';
        },
        configFixedCenter: function (type, args, obj) {
            var val = args[0],
            alreadySubscribed = Config.alreadySubscribed,
            windowResizeEvent = Panel.windowResizeEvent,
            windowScrollEvent = Panel.windowScrollEvent;

            if (val) {
                this.onCenter();
                if (!this.hasEvent('beforeShow', this.onCenter, this)) {
                    this.on('beforeShow', this.onCenter, this, true);
                }
                if (!alreadySubscribed(windowResizeEvent, this.doCenterOnDOMEvent, this)) {
                    windowResizeEvent.on(this.doCenterOnDOMEvent, this, true, {isCE:true});
                }
                if (!alreadySubscribed(windowScrollEvent, this.doCenterOnDOMEvent, this)) {
                    windowScrollEvent.on(this.doCenterOnDOMEvent, this, true, {isCE:true});
                }

            } else {
                this.unOn('beforeShow', this.onCenter, this);
                windowResizeEvent.unOn(this.doCenterOnDOMEvent, this);
                windowScrollEvent.unOn(this.doCenterOnDOMEvent, this);
            }
        },
        /**
         * zIndex 속성이 변경될 때 fire되는 기본 이벤트 핸들러
         * @method configzIndex
         * @protected
         * @param {String} type The LCustomEvent type (usually the property name)
         * @param {Object[]} args The LCustomEvent arguments. For configuration
         * handlers, args[0] will equal the newly applied value for the property.
         * @param {Object} obj The scope object. For configuration handlers,
         * this will usually equal the owner.
         */
        configzIndex: function (type, args, obj) {

            this.configzIndexOverlay(type,args,obj); // ovarlay method

            if (this.mask || this.cfg.getProperty("modal") === true) {
                var panelZ = Dom.getStyle(this.element, "zIndex");
                if (!panelZ || isNaN(panelZ)) {
                    panelZ = 0;
                }

                if (panelZ === 0) {
                    // Recursive call to configzindex (which should be stopped
                    // from going further because panelZ should no longer === 0)
                    this.cfg.setProperty("zIndex", 1);
                } else {
                    this.stackMask();
                }
            }
        },

        /**
         * zIndex 속성이 변경되었을 떄 fire되는 기본 이벤트 핸들러
         * @method configzIndex
         * @protected
         * @param {String} type The LCustomEvent type (usually the property name)
         * @param {Object[]} args The LCustomEvent arguments. For configuration
         * handlers, args[0] will equal the newly applied value for the property.
         * @param {Object} obj The scope object. For configuration handlers,
         * this will usually equal the owner.
         */
        configzIndexOverlay: function (type, args, obj) {
            var zIndex = args[0],
            el = this.element;

            if (! zIndex) {
                zIndex = Dom.getStyle(el, "zIndex");
                if (! zIndex || isNaN(zIndex)) {
                    zIndex = 0;
                }
            }

            if (this.iframe || this.cfg.getProperty("iframe") === true) {
                if (zIndex <= 0) {
                    zIndex = 1;
                }
            }
            
            if(Rui._tabletViewerEl) zIndex += 10;

            Dom.setStyle(el, "zIndex", zIndex);
            this.cfg.setProperty("zIndex", zIndex, true);

            if (this.iframe) {
                this.stackIframe();
            }
        },

        // END BUILT-IN PROPERTY EVENT HANDLERS //
        /**
         * 패널 주위의 wrapping된 컨테이너를 빌드한다.
         * 이 패널은 shadow와 matte underlay를 포지셔닝하기 위해 사용된다.
         * 컨테이너 엘리먼트는 콘테이너라고 불리는 로컬 인스턴스 변수로 할당되고,
         * 이 엘리먼트는 이 변수 내에 재등록된다.
         * @method buildWrapper
         * @protected
         */
        buildWrapper: function () {
        	this.innerElement = this.element;
            var CSS_PANEL_CONTAINER = "L-panel-container";
        	Dom.addClass(this.element, CSS_PANEL_CONTAINER);
        	return;
            // TODO: Panel의 wrapping 컨테이너에 사용되는 기본 CSS클래스를 나타내는 상수

            var elementParent = this.element.parentNode,
            originalElement = this.element,
            wrapper = document.createElement("div");

            wrapper.className = CSS_PANEL_CONTAINER;
            wrapper.id = originalElement.id + "_c";

            if (elementParent) {
                elementParent.insertBefore(wrapper, originalElement);
            }

            wrapper.appendChild(originalElement);

            this.element = wrapper;
            this.innerElement = originalElement;
            Dom.setStyle(this.innerElement, "visibility", "inherit");
        },

        /**
         * @description panel container top속성
         * @method setTop
         * @public
         * @param {int} top 새로운 top
         * @return {void}
         * @return {void}
         */
        setTop: function(y) {
          this.cfg.setProperty('top', y);
        },
        /**
         * @description panel container Left속성
         * @method setLeft
         * @public
         * @param {int} left 새로운 Left
         * @return {void}
         */
        setLeft: function(x){
          this.cfg.setProperty('left', x);
        },
        /**
         * 엘리먼트의 사이즈에 근거하여 그림자의 사이즈를 조정한다.
         * @method sizeUnderlay
         * @protected
         */
        sizeUnderlay: function () {
            var oUnderlay = this.underlay,oElement;

            if (oUnderlay) {
                oElement = this.element;
                oUnderlay.style.width = oElement.offsetWidth + "px";
                oUnderlay.style.height = oElement.offsetHeight + "px";
            }
        },

        /**
         * Drag & Drop 기능을 패널 헤더에 등록한다.
         * @method registerDragDrop
         * @protected
         */
        registerDragDrop: function () {
            var me = this;
            if (this.header) {
                if (!Rui.dd.LDD) {
                    return;
                }

                var bDragOnly = (this.cfg.getProperty("dragonly") === true);
                this.dd = new Rui.dd.LDD({
                    id: this.element.id,
                    group: this.id,
                    attributes: {dragOnly: bDragOnly}
                });

                if (!this.header.id) {
                    this.header.id = this.id + "_h";
                }

                this.dd.startDrag = function () {
                    var offsetHeight,
                    offsetWidth,
                    viewPortWidth,
                    viewPortHeight,
                    scrollX,
                    scrollY;

                    if (Rui.browser.msie == 6) {
                        Dom.addClass(me.element,"drag");
                    }

                    if (me.cfg.getProperty("constraintoviewport")) {

                        var nViewportOffset = Panel.VIEWPORT_OFFSET;

                        offsetHeight = me.element.offsetHeight;
                        offsetWidth = me.element.offsetWidth;

                        viewPortWidth = Dom.getViewportWidth();
                        viewPortHeight = Dom.getViewportHeight();

                        scrollX = Dom.getDocumentScrollLeft();
                        scrollY = Dom.getDocumentScrollTop();

                        if (offsetHeight + nViewportOffset < viewPortHeight) {
                            this.minY = scrollY + nViewportOffset;
                            this.maxY = scrollY + viewPortHeight - offsetHeight - nViewportOffset;
                        } else {
                            this.minY = scrollY + nViewportOffset;
                            this.maxY = scrollY + nViewportOffset;
                        }

                        if (offsetWidth + nViewportOffset < viewPortWidth) {
                            this.minX = scrollX + nViewportOffset;
                            this.maxX = scrollX + viewPortWidth - offsetWidth - nViewportOffset;
                        } else {
                            this.minX = scrollX + nViewportOffset;
                            this.maxX = scrollX + nViewportOffset;
                        }

                        this.constrainX = true;
                        this.constrainY = true;
                    } else {
                        this.constrainX = false;
                        this.constrainY = false;
                    }
                    me.dragEvent.fire("startDrag", arguments);
                };

                this.dd.onDrag = function () {
                    me.syncPosition();
                    me.cfg.refireEvent("iframe");
                    if (Rui.platform.mac && Rui.browser.gecko) {
                        me.showMacGeckoScrollbars();
                    }
                    me.dragEvent.fire("onDrag", arguments);
                };

                this.dd.endDrag = function () {
                    if (Rui.browser.msie == 6) {
                        Dom.removeClass(me.element,"drag");
                    }
                    me.dragEvent.fire("endDrag", arguments);
                    me.fireEvent('move', me.cfg.getProperty("xy"));
                };

                this.dd.setHandleElId(this.header.id);
                this.dd.addInvalidHandleType("INPUT");
                this.dd.addInvalidHandleType("SELECT");
                this.dd.addInvalidHandleType("TEXTAREA");
            }
        },

        /**
         * 패널이 modal로 설정될 때 document에 놓인 마스크를 build한다.
         * @method buildMask
         * @protected
         */
        buildMask: function () {
            var oMask = this.mask;
            if (!oMask) {
                if (!this.m_oMaskTemplate) {
                    this.m_oMaskTemplate = document.createElement("div");
                    this.m_oMaskTemplate.className = "mask";
                    this.m_oMaskTemplate.innerHTML = "&#160;";
                }
                oMask = this.m_oMaskTemplate.cloneNode(true);
                oMask.id = this.id + "_mask";

                document.body.insertBefore(oMask, document.body.firstChild);
                this.mask = oMask;

                if (Rui.browser.gecko && Rui.platform.mac) {
                    Dom.addClass(this.mask, "block-scrollbars");
                }

                // Stack mask based on the element zindex
                this.stackMask();
            }
        },

        /**
         * modal 마스크를 숨긴다.
         * @method hideMask
         * @protected
         */
        hideMask: function () {
            if (this.cfg.getProperty("modal") && this.mask) {
                this.mask.style.display = "none";
                Dom.removeClass(document.body, "masked");
                this.fireEvent('hideMask', {target:this});
            }
        },

        /**
         * modal 마스크를 보여준다.
         * @method showMask
         * @protected
         */
        showMask: function () {
            if (this.cfg.getProperty("modal") && this.mask) {
                Dom.addClass(document.body, "masked");
                this.sizeMask();
                this.mask.style.display = "block";
                this.fireEvent('showMask', {target:this});
            }
        },

        /**
         * 전체 스크롤 가능한 구역을 커버하는 modal 마스크 사이즈 설정
         * @method sizeMask
         * @protected
         */
        sizeMask: function () {
            if (this.mask) {
                // Shrink mask first, so it doesn't affect the document size.
                var viewWidth = Dom.getViewportWidth(),
                viewHeight = Dom.getViewportHeight();
                this.mask.style.width = "100%";
                if (this.mask.offsetWidth > viewWidth)
                    this.mask.style.width = viewWidth + "px";
                this.mask.style.height = "100%";
                if (this.mask.offsetHeight > viewHeight)
                	this.mask.style.height = viewHeight + "px";
                if(Rui._tabletData) this.mask.style.height = "110%";
            }
        },

        /**
         * 패널 엘리먼트의 zindex를 근거로 마스크의 zindex를 설정한다(zindex가 존재할 경우)
         * 마스크의 zindex는 패널 엘리먼트의 zindex 보다 하나 적은 값으로 설정된다.
         *
         * <p>NOTE: 이 메소드는 마스크가 non-negative zindex를 가지고 있음을
         * 확인하는 패널의 zindex를 올리지 않는다.
         * 마스크 zindex가 0 또는 그 이상이 되는 것이 필요하다면
         * 이 메소드가 호출되기 전에 패널의 zindex 값을 0보다 크게 설정해야 한다.
         * This method will not bump up the zindex of the Panel
         * to ensure that the mask has a non-negative zindex. If you require the
         * mask zindex to be 0 or higher, the zindex of the Panel
         * should be set to a value higher than 0, before this method is called.
         * </p>
         * @method stackMask
         * @protected
         */
        stackMask: function() {
            if (this.mask) {
                var panelZ = Dom.getStyle(this.element, "zIndex");
                if (!Rui.isUndefined(panelZ) && !isNaN(panelZ)) {
                    Dom.setStyle(this.mask, "zIndex", panelZ - 1);
                }
            }
        },

        // BUILT-IN EVENT HANDLERS FOR MODULE //
        /**
         * Default event handler for changing the visibility property of a
         * Module. By default, this is achieved by switching the "display" style
         * between "block" and "none".
         * This method is responsible for firing showEvent and hideEvent.
         * @param {String} type The LCustomEvent type (usually the property name)
         * @param {Object[]} args The LCustomEvent arguments. For configuration
         * handlers, args[0] will equal the newly applied value for the property.
         * @param {Object} obj The scope object. For configuration handlers,
         * this will usually equal the owner.
         * @method configVisible
         * @private
         */

        // BEGIN BUILT-IN PROPERTY EVENT HANDLERS //
        /**
         * "visible" 속성이 변경될 때 fire되는 기본 이벤트 핸들러.
         * 이 메소드는 showEvent와 hideEvent를 fire 시킬 의무가 있다.
         * @method configVisible
         * @protected
         * @param {String} type The LCustomEvent type (usually the property name)
         * @param {Object[]} args The LCustomEvent arguments. For configuration
         * handlers, args[0] will equal the newly applied value for the property.
         * @param {Object} obj The scope object. For configuration handlers,
         * this will usually equal the owner.
         */
        configVisible: function (type, args, obj) {

            var visible = args[0],
            currentVis = Dom.getStyle(this.element, "visibility"),
            effect = this.cfg.getProperty("effect"),
            effectInstances = [],
            isMacGecko = (Rui.platform.mac && Rui.browser.gecko),
            alreadySubscribed = Config.alreadySubscribed,
            eff, ei, e, i, j, k, h,
            nEffects,
            nEffectInstances;

            if (currentVis == "inherit") {
                e = this.element.parentNode;

                while (e.nodeType != 9 && e.nodeType != 11) {
                    currentVis = Dom.getStyle(e, "visibility");
                    if (currentVis != "inherit") {
                        break;
                    }
                    e = e.parentNode;
                }

                if (currentVis == "inherit") {
                    currentVis = "visible";
                }
            }

            if (effect) {
                if (effect instanceof Array) {
                    nEffects = effect.length;

                    for (i = 0; i < nEffects; i++) {
                        eff = effect[i];
                        effectInstances[effectInstances.length] =
                            eff.effect(this, eff.duration);
                    }
                } else {
                    effectInstances[effectInstances.length] =
                        effect.effect(this, effect.duration);
                }
            }

            if (visible) { // Show
                if (isMacGecko) {
                    this.showMacGeckoScrollbars();
                }
                if (effect) { // Animate in
                    if (visible) { // Animate in if not showing
                        if (currentVis != "visible" || currentVis === "") {
                            this.fireEvent('beforeShow', {target:this});
                            nEffectInstances = effectInstances.length;

                            for (j = 0; j < nEffectInstances; j++) {
                                ei = effectInstances[j];
                                if (j === 0 && !alreadySubscribed(ei.animateInCompleteEvent, this.fireEvent('show',{target:this}), this)) {
                                    /*
                                                  Delegate showEvent until end
                                                  of animateInComplete
                                     */
                                    ei.animateInCompleteEvent.on( this.fireEvent('show', {target:this}), this, true);
                                }
                                ei.animateIn();
                            }
                        }
                    }
                } else { // Show
                    Dom.removeClass(this.element, "L-hidden");
                    if (currentVis != "visible" || currentVis === "") {
                        this.fireEvent('beforeShow', {target:this});
                        this.cfg.refireEvent("iframe");
                    }else{
                        this.fireEvent('beforeShow', {target:this});
                    }
                }
            } else { // Hide

                if (isMacGecko) {
                    this.hideMacGeckoScrollbars();
                }

                if (effect) { // Animate out if showing
                    if (currentVis == "visible") {
                        this.fireEvent('beforeHide', {target:this});

                        nEffectInstances = effectInstances.length;
                        for (k = 0; k < nEffectInstances; k++) {
                            h = effectInstances[k];

                            if (k === 0 && !alreadySubscribed(h.animateOutCompleteEvent, this.fireEvent('hide', {target:this}), this)) {
                                /*
                                              Delegate hideEvent until end
                                              of animateOutComplete
                                 */
                                h.animateOutCompleteEvent.on( this.fireEvent('hide', {target:this}), this, true, {isCE:true});
                            }
                            h.animateOut();
                        }

                    } else if (currentVis === "") {
                        Dom.addClass(this.element, "L-hidden");
                    }

                } else { // Simple hide
                    Dom.addClass(this.element, "L-hidden");
                    if (currentVis == "visible" || currentVis === "") {
                        this.fireEvent('beforeHide', {target:this});
                        this.fireEvent('hide', {target:this});
                    }
                }
            }
        },

        /**
         * Default event handler for the "monitorresize" configuration property
         * @param {String} type The LCustomEvent type (usually the property name)
         * @param {Object[]} args The LCustomEvent arguments. For configuration
         * handlers, args[0] will equal the newly applied value for the property.
         * @param {Object} obj The scope object. For configuration handlers,
         * this will usually equal the owner.
         * @method configMonitorResize
         * @private
         */
        configMonitorResize: function (type, args, obj) {
            var monitor = args[0];
            if (monitor) {
                this.initResizeMonitor();
            } else {
                Panel.textResizeEvent.unOn(this.onDomResize, this);
                this.resizeMonitor = null;
            }
        },

        /**
         * body initialize
         * @private
         * @method _onSetBody
         */
        _onSetBody: function(e){
            if (!this.body) {
                this.setBody("");
            }
        },

        /**
         * android의 toast 메시지 처럼 잠시 메시지를 잠시 출력했다가 사라진다. IE8이상 지원
         * @method toast
         * @param {String} text 출력할 메시지
         * @param {object} config 환경 설정값
         * @return {void}
         */
        toast: function(text, config){
        	Dom.toast(text, document.body, config);
        },

        /**
         * DOM에서 패널 엘리먼트를 제거하고 모든 자식 엘리먼트들을 null로 설정한다.
         * @method destroy
         */
        destroy: function () {
            if (this.iframe) {
                this.iframe.parentNode.removeChild(this.iframe);
            }
            this.iframe = null;

            Panel.windowResizeEvent.unOn(this.sizeMask, this);
            Panel.windowScrollEvent.unOn(this.doCenterOnDOMEvent, this);
            Panel.textResizeEvent.unOn(this._autoFillOnHeightChange,this);

            this.removeMask();
            if (this.close) {
                Event.purgeElement(this.close);
            }

            var parent = null;

            if (this.element) {
                Event.purgeElement(this.element, true);
                parent = this.element.parentNode;
            }
            if (parent) {
                parent.removeChild(this.element);
            }

            if(this.element)
                Rui.get(this.element).removeNode();
            if(this.header)
                Rui.get(this.header).removeNode();
            if(this.body)
                Rui.get(this.body).removeNode();
            if(this.footer)
                Rui.get(this.footer).removeNode();

            Panel.textResizeEvent.unOn(this.onDomResize, this);

            this.cfg.destroy();
            this.cfg = null;

            this.fireEvent('destroy', {target:this});

            this.unOnAll();
            delete this.__DU_events;
            delete this.__DU_subscribers;
            for (m in this) {
                this[m] = null;
                delete this[m];
            }

            Rui.ui.LPanel.superclass.destroy.call(this);
        },

        /**
         * 해당 오브젝트를 String 으로 표현하여 리턴.
         * @method toString
         * @return {String} The string representation of the Panel.
         */
        toString: function () {
            return "LPanel " + this.id;
        }
    });
}());
Rui.namespace('Rui.ui');
(function(){
    /**
     * Dialog를 구현한 객체 
     * @namespace Rui.ui
     * @class LDialog
     * @extends Rui.ui.LPanel
     * @sample default
     * @constructor
     * @param {Object} config The configuration object literal containing 
     * the configuration that should be set for this Dialog. See configuration 
     * documentation for more details.
     */
    Rui.ui.LDialog = function(config){
        config = config || {}; 
        config = Rui.applyIf(config, Rui.getConfig().getFirst('$.ext.dialog.defaultProperties'));
        // 사용하지 않기로 
        // validatorManager 권장 안함.
        //this.validatorManager = userConfig.validatorManager;
        this.simpleForm = null;
        Rui.ui.LDialog.superclass.constructor.call(this, config);
        this.validators = config ? config.validators : validators;
        this.callback = config ? config.callback : this.callback;
    };

    var Event = Rui.util.LEvent,
        Dom = Rui.util.LDom,
        Dialog = Rui.ui.LDialog,
        Button = Rui.ui.LButton,
    /**
     * Constant representing the name of the Dialog's events
     * @property EVENT_TYPES
     * @private
     * @final
     * @type Object
     */
    EVENT_TYPES = {
        'BEFORE_SUBMIT': 'beforeSubmit',
        'SUBMIT': 'submit',
        'MANUAL_SUBMIT': 'manualSubmit',
        'ASYNC_SUBMIT': 'asyncSubmit',
        'FORM_SUBMIT': 'formSubmit',
        'CANCEL': 'cancel',
        'VALIDATE': 'validate'
    },
    /**
     * Constant representing the Dialog's configuration properties
     * @property DEFAULT_CONFIG
     * @private
     * @final
     * @type Object
     */
    DEFAULT_CONFIG = {
        'POST_METHOD': { 
            key: 'postmethod', 
            value: 'none'
        },
        'BUTTONS': {
            key: 'buttons',
            value: 'none',
            supercedes: ['visible']
        },
        'HIDEAFTERSUBMIT': {
            key: 'hideaftersubmit',
            value: true
        }
    };
    /**
     * Constant representing the default CSS class used for a Dialog
     * @property CSS_DIALOG
     * @static
     * @final
     * @private
     * @type String
     */
    Dialog.CSS_DIALOG = 'L-dialog';

    function removeButtonEventHandlers(){

        var buttons = this._buttons,
            buttonCount,
            button,
            i;

        if(Rui.isArray(buttons)){
            buttonCount = buttons.length;

            if(buttonCount > 0){
                i = buttonCount - 1;
                do {
                    button = buttons[i];

                    if(Button && button instanceof Button){
                        button.destroy();
                    }else if(button.tagName.toUpperCase() == 'BUTTON'){
                        Event.purgeElement(button);
                        Event.purgeElement(button, false);
                    }
                }
                while (i--);
            }
        }
    }

    Rui.extend(Rui.ui.LDialog, Rui.ui.LPanel, {
        /**
         * @description 객체의 문자열
         * @property otype
         * @private
         * @type {String}
         */
        otype: 'Rui.ui.LDialog',
        /**
         * @description Object reference to the Dialog's
         * @config form
         * @type {HTMLFormElement}
         * @default null
         */
        /**
         * @description Object reference to the Dialog's 
         * @property form
         * @default null 
         * @protected
         * @type {HTMLFormElement}
         */
        form: null,
        /**
         * Initializes the class's configurable properties which can be changed 
         * using the Dialog's Config object (cfg).
         * @method initDefaultConfig
         * @protected
         */
        initDefaultConfig: function(){
            Rui.ui.LDialog.superclass.initDefaultConfig.call(this);
            /**
             * @description 다이얼로그에서 submit시 호출될 callback 함수 (callback.success/callback.failure/callback.upload/callback.argument)
             * @config callback
             * @type {Object}
             * @default null
             */
            /**
             * 다이얼로그에서 submit시 호출될 callback 함수 (callback.success/callback.failure/callback.upload/callback.argument)
             * @property callback
             * @private
             * @type Object
             */
            this.callback = {
                success: null,
                failure: null,
                argument: null
            };
            /**
             * dialog의 submit 종류를 지정한다. 종류로는 'async', 'form', 'manual', 'none' 가 있다.
             * @config postmethod
             * @sample default
             * @type String
             * @default async
             */
            this.cfg.addProperty(DEFAULT_CONFIG.POST_METHOD.key, {
                handler: this.configPostMethod, 
                value: DEFAULT_CONFIG.POST_METHOD.value, 
                validator: function (val){
                    if(val != 'form' && val != 'async' && val != 'none' && 
                        val != 'manual'){
                        return false;
                    }else{
                        return true;
                    }
                }
            });
            /**
             * dialog의 submit을 호출한 후에 dialog를 숨길것인지 여부를 결정한다. 
             * @config hideaftersubmit
             * @sample default
             * @type Boolean
             * @default true
             */
            this.cfg.addProperty(DEFAULT_CONFIG.HIDEAFTERSUBMIT.key, {
                value: DEFAULT_CONFIG.HIDEAFTERSUBMIT.value
            });
            /**
             * dialog의 button 객체들 정보
             * @config buttons
             * @sample default
             * @type {Array|String}
             * @default 'none'
             */
            this.cfg.addProperty(DEFAULT_CONFIG.BUTTONS.key, {
                handler: this.configButtons,
                value: DEFAULT_CONFIG.BUTTONS.value,
                supercedes: DEFAULT_CONFIG.BUTTONS.supercedes
            }); 
            
        },
        /**
         * Initializes the custom events for Dialog which are fired 
         * automatically at appropriate times by the Dialog class.
         * @method initEvents
         * @protected
         */
        initEvents: function(){
            Rui.ui.LDialog.superclass.initEvents.call(this);

            /**
             * submit 전에 호출되는 이벤트
             * @event beforeSubmit
             */ 
            this.createEvent(EVENT_TYPES.BEFORE_SUBMIT); 

            /**
             * submit시 호출되는 이벤트
             * @event submit
             * @sample default
             */
            this.createEvent(EVENT_TYPES.SUBMIT);

            /**
             * postmethod값이 manual일 경우 submit 전에 호출되는 이벤트
             * @event manualSubmit
             */
            this.createEvent(EVENT_TYPES.MANUAL_SUBMIT);
        
            /**
             * postmethod값이 async일 경우 submit 전에 호출되는 이벤트
             * @event asyncSubmit
             * @sample default
             */ 
            this.createEvent(EVENT_TYPES.ASYNC_SUBMIT);
            
            /**
             * postmethod값이 form일 경우 submit 전에 호출되는 이벤트
             * @event formSubmit
             * @sample default
             */
            this.createEvent(EVENT_TYPES.FORM_SUBMIT);
            
            /**
             * cancel시 호출되는 이벤트
             * @event cancel
             * @sample default
             */
            this.createEvent(EVENT_TYPES.CANCEL);
            
            /**
             * validate시 호출되는 이벤트
             * @event validate
             * @sample default
             */
            this.createEvent(EVENT_TYPES.VALIDATE);

            this.cfg.setProperty('visible', false);
            this.on('beforeHide', this.blurButtons, this, true);
            this.on('changeBody', this.registerForm, this, true);
        },
        /**
         * @description element Dom객체 생성
         * @method createContainer
         * @protected
         * @param {LElement|HTMLElement|String} parentNode 부모노드
         * @return {LElement}
         */
        createContainer: function(parentNode){
            this.el = Rui.ui.LDialog.superclass.createContainer.call(this, parentNode);
            this._createDialog();
            return this.el;
        },
        _createDialog: function(){
            //Rui.ui.LDialog.superclass.doRender.call(this, container);
            Dom.addClass(this.element, Dialog.CSS_DIALOG);
            if(Rui.useAccessibility())
                this.el.setAttribute('role', 'dialog');
            this.fireEvent('beforeRender', {target: this});
        },
        /**
         * @description Dom객체 생성 및 초기화하는 메소드
         * @method initComponent
         * @protected
         * @param {Object} config 환경정보 객체 
         * @return {void}
         */
        initComponent: function(config){
            this.id = Rui.useFixedId() ? 'LDialog-' + (config.id || config.applyTo) : Rui.id();
            Rui.ui.LDialog.superclass.initComponent.call(this, config);
            if(config){
                this.cfg.applyConfig(config, true);
            }
         },
        /**
        * Submits the Dialog's form depending on the value of the 
        * 'postmethod' configuration property.
        * @method doSubmit
        * @protected
        * @return {void}
        */
        doSubmit: function(){
            var LConnect = Rui.LConnect,
                oForm = this.form,
                bUseFileUpload = false,
                bUseSecureFileUpload = false,
                aElements,
                nElements,
                i,
                formAttrs;

            switch (this.cfg.getProperty('postmethod')){
                case 'async':
                    aElements = oForm.elements;
                    nElements = aElements.length;

                    if(nElements > 0){
                        i = nElements - 1;
                        do {
                            if(aElements[i].type == 'file'){
                                bUseFileUpload = true;
                                break;
                            }
                        }
                        while (i--);
                    }

                    if(bUseFileUpload && Rui.browser.msie && this.isSecure){
                        bUseSecureFileUpload = true;
                    }

                    formAttrs = this._getFormAttributes(oForm);

                    LConnect.setForm(oForm, bUseFileUpload, bUseSecureFileUpload);
                    LConnect.asyncRequest(formAttrs.method, formAttrs.action, this.callback, null, {isFileUpload: bUseFileUpload});

                    this.fireEvent(EVENT_TYPES.ASYNC_SUBMIT, {target:this});
                    break;

                case 'form':
                    oForm.submit();
                    this.fireEvent(EVENT_TYPES.FORM_SUBMIT, {target:this});
                    break;

                case 'none':
                case 'manual':
                    this.fireEvent(EVENT_TYPES.MANUAL_SUBMIT, {target:this});
                    break;
            }
        },
        /**
         * Retrieves important attributes (currently method and action) from
         * the form element, accounting for any elements which may have the same name 
         * as the attributes. 
         * @method _getFormAttributes
         * @protected
         * @param {HTMLFormElement} oForm The HTML Form element from which to retrieve the attributes
         * @return {Object} Object literal, with method and action String properties.
         */
        _getFormAttributes: function(oForm){
            var attrs = {
                method: null,
                action: null
            };

            if(oForm){
                if(oForm.getAttributeNode){
                    var action = oForm.getAttributeNode('action');
                    var method = oForm.getAttributeNode('method');

                    if(action){
                        attrs.action = action.value;
                    }

                    if(method){
                        attrs.method = method.value;
                    }

                }else{
                    attrs.action = oForm.getAttribute('action');
                    attrs.method = oForm.getAttribute('method');
                }
            }
            attrs.method = (Rui.isString(attrs.method) ? attrs.method : 'POST').toUpperCase();
            attrs.action = Rui.isString(attrs.action) ? attrs.action : '';
            return attrs;
        },
        /**
         * Prepares the Dialog's internal FORM object, creating one if one is not currently present.
         * @method registerForm
         * @protected
         */
        registerForm: function(){
            var form = this.element.getElementsByTagName('form')[0];

            if(this.form){
                if(this.form == form && Dom.isAncestor(this.element, this.form)){
                    return;
                }else{
                    Event.purgeElement(this.form);
                    this.form = null;
                }
            }

            if(!form && this.body){
                form = document.createElement('form');
                form.name = 'frm_' + this.id;
                this.body.appendChild(form);
            }

            if(form){
                this.form = form;
                Event.on(form, 'submit', this._submitHandler, this, true);
            }
            
            // LForm 객체 연결
            var formId = this.form ? (this.form.name || this.form.id) : (this.validatorManager)? this.validatorManager.id : null;
            
            if(formId != null){
                this.simpleForm = new Rui.ui.form.LForm(formId,{
                    validators: this.validators,
                    validatorManager:this.validatorManager
                });
                
                if(this.validatorManager == null)
                    this.validatorManager = this.simpleForm.validatorManager;
            } 
        },
        /**
         * Internal handler for the form submit event
         * @method _submitHandler
         * @protected
         * @param {DOMEvent} e The DOM Event object
         */
        _submitHandler : function(e){
            Event.stopEvent(e);
            this.submit();
            this.form.blur();
        },
        /**
         * Sets up a tab, shift-tab loop between the first and last elements
         * provided. NOTE: Sets up the preventBackTab and preventTabOut LKeyListener
         * instance properties, which are reset everytime this method is invoked.
         * @method setTabLoop
         * @protected
         * @param {HTMLElement} firstElement
         * @param {HTMLElement} lastElement
         * @return {void}
         */
        setTabLoop: function(firstElement, lastElement){
            firstElement = firstElement || this.firstButton;
            lastElement = this.lastButton || lastElement;
            Dialog.superclass.setTabLoop.call(this, firstElement, lastElement);
        },
        /**
         * Configures instance properties, pointing to the 
         * first and last focusable elements in the Dialog's form.
         * @method setFirstLastFocusable
         * @public
         * @return {void}
         */
        setFirstLastFocusable: function(){
            Dialog.superclass.setFirstLastFocusable.call(this);
            var i, l, el, elements = this.focusableElements;
            this.firstFormElement = null;
            this.lastFormElement = null;
            if(this.form && elements && elements.length > 0){
                l = elements.length;
                for (i = 0; i < l; ++i){
                    el = elements[i];
                    if(this.form === el.form){
                        this.firstFormElement = el;
                        break;
                    }
                }
                for (i = l-1; i >= 0; --i){
                    el = elements[i];
                    if(this.form === el.form){
                        this.lastFormElement = el;
                        break;
                    }
                }
            }
        },
        // BEGIN BUILT-IN PROPERTY EVENT HANDLERS 
        /**
         * The default event handler for the 'buttons' configuration property
         * @method configButtons
         * @protected
         * @param {String} type The LCustomEvent type (usually the property name)
         * @param {Object[]} args The LCustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
         * @param {Object} obj The scope object. For configuration handlers, this will usually equal the owner.
         */
        configButtons: function (type, args, obj){
            var configs = args[0],
                config,
                button,
                len,
                groupDom;

            removeButtonEventHandlers.call(this);
            this._buttons = null;
            if(Rui.isArray(configs)){

                groupDom = document.createElement('span');
                groupDom.id = Rui.useFixedId() ? 'LDialog-btnGrp-' + this.id : Rui.id();
                groupDom.className = 'button-group';
                len = configs.length;

                this._buttons = [];
                this.defaultButton = null;

                for (var i = 0; i < len; i++){
                    config = configs[i];

                    if(Button){
                        var cfgId = groupDom.id + (config.id || config.text);
                        var cfg = { label: config.text, id: cfgId, renderTo: groupDom };
                        if(config.disableDbClick === false)
                            cfg.disableDbClick = false;
                        button = new Button(cfg);
                        button.appendTo(groupDom);
                        if(config.isDefault){
                            button.el.addClass('default');
                            this.defaultButton = button;
                        }
                        if(Rui.isFunction(config.handler)){
                            button.on('click', config.handler, this, true);
                        }else if(Rui.isObject(config.handler) && Rui.isFunction(config.handler.fn)){
                            button.on('click', config.handler.fn, config.handler.scope || this, true);
                        }
                        this._buttons.push(button);
                    }else{
                        button = document.createElement('button');
                        button.setAttribute('type', 'button');

                        if(config.isDefault){
                            button.className = 'default';
                            this.defaultButton = button;
                        }
                        button.innerHTML = config.text;
                        if(Rui.isFunction(config.handler)){
                            Event.on(button, 'click', config.handler, this, true);
                        }else if(Rui.isObject(config.handler) && 
                            Rui.isFunction(config.handler.fn)){
                            Event.on(button, 'click', 
                                config.handler.fn, 
                                ((!Rui.isUndefined(config.handler.obj)) ? config.handler.obj : this), 
                                (config.handler.scope || this));
                        }
                        groupDom.appendChild(button);
                        this._buttons.push(button);
                    }
                    if(i === 0){
                        this.firstButton = button;
                    }
                    if(i == (len - 1)){
                        this.lastButton = button;
                    }
                }

                this.setFooter(groupDom);
                
                if(Dom.inDocument(this.element) && !Dom.isAncestor(this.innerElement, this.footer)){
                    this.innerElement.appendChild(this.footer);
                }
                this.buttonSpan = groupDom;

            }else{ // Do cleanup
                groupDom = this.buttonSpan;
                if(groupDom && this.footer){
                    this.footer.removeChild(groupDom);
                    this.buttonSpan = null;
                    this.firstButton = null;
                    this.lastButton = null;
                    this.defaultButton = null;
                }
            }
            // Everything which needs to be done if content changed
            // TODO: Should we be firing contentChange here?
            this.setFirstLastFocusable();
            this.cfg.refireEvent('iframe');
            this.cfg.refireEvent('underlay');
        },
        /**
         * @description LDialog의 button들의 정보를 배열로 리턴한다.
         * @method getButtons
         * @public
         * @return {Array}
         */
        getButtons: function(){
            return this._buttons || null;
        },
        /**
         * @description LDialog의 button들의 정보를 배열로 설정한다.
         * @method setButtons
         * @public
         * @sample default
         * @return {void}
         */
        setButtons: function(buttons) {
        	removeButtonEventHandlers.call(this);
        	this.cfg.setProperty(DEFAULT_CONFIG.BUTTONS.key, buttons);
        },
        /**
         * Sets focus to the first element in the Dialog's form or the first 
         * button defined via the 'buttons' configuration property. Called 
         * when the Dialog is made visible.
         * @method focusFirst
         * @protected
         * @return {void}
         */
        focusFirst: function (type, args, obj){
            var el = this.firstFormElement;
            if(args && args[1]) 
                Event.stopEvent(args[1]);

            if(el){
                try{
                    el.focus();
                }catch(ex){}
            }else{
                this.focusFirstButton();
            }
        },
        /**
         * Sets focus to the last element in the Dialog's form or the last 
         * button defined via the 'buttons' configuration property.
         * @method focusLast
         * @protected
         * @return {void}
         */
        focusLast: function (type, args, obj){
            var aButtons = this.cfg.getProperty('buttons'),
                el = this.lastFormElement;
            if(args && args[1])
                Event.stopEvent(args[1]);
            
            if(aButtons && Rui.isArray(aButtons)){
                this.focusLastButton();
            }else{
                if(el){
                    try{
                        el.focus();
                    }catch(ex){}
                }
            }
        },
        /**
         * Sets the focus to the button that is designated as the default via 
         * the 'buttons' configuration property. By default, this method is 
         * called when the Dialog is made visible.
         * @method focusDefaultButton
         * @public
         * @return {void}
         */
        focusDefaultButton: function(){
            try{
                this.defaultButton.focus();
            }catch(ex){}
        },
        /**
         * Blurs all the buttons defined via the 'buttons' 
         * configuration property.
         * @method blurButtons
         * @public
         * @return {void}
         */
        blurButtons: function(){
            var buttons = this.cfg.getProperty('buttons'),
                len,
                button,
                i;
            if(buttons && Rui.isArray(buttons)){
                len = buttons.length;
                if(len > 0){
                    i = (len - 1);
                    do {
                        button = buttons[i];
                        if(button){
                            try{
                                button.blur();
                            }catch(ex){}
                        }
                    } while (i--);
                }
            }
        },
        /**
         * Sets the focus to the first button created via the 'buttons'
         * configuration property.
         * @method focusFirstButton
         * @public
         * @return {void}
         */
        focusFirstButton: function(){
            var buttons = this._buttons,
                button;
            if(buttons && Rui.isArray(buttons)){
                button = buttons[0];
                if(button){
                    try{
                        button.focus();
                    }catch(ex){}
                }
            }
        },
        /**
         * Sets the focus to the last button created via the 'buttons' 
         * configuration property.
         * @method focusLastButton
         * @public
         * @return {void}
         */
        focusLastButton: function(){
            var buttons = this._buttons,
                len,
                button;
            if(buttons && Rui.isArray(buttons)){
                len = buttons.length;
                if(len > 0){
                    button = buttons[(len - 1)];
                    try{
                        button.focus();
                    }catch(ex){}
                }
            }
        },
        /**
         * The default event handler for the 'postmethod' configuration property
         * @method configPostMethod
         * @protected
         * @param {String} type The LCustomEvent type (usually the property name)
         * @param {Object[]} args The LCustomEvent arguments. For configuration handlers, args[0] will equal the newly applied value for the property.
         * @param {Object} obj The scope object. For configuration handlers, this will usually equal the owner.
         * @return {void}
         */
        configPostMethod: function (type, args, obj){
            this.registerForm();
        },
        // END BUILT-IN PROPERTY EVENT HANDLERS //
        /**
         * Built-in function hook for writing a validation function that will 
         * be checked for a 'true' value prior to a submit. This function, as 
         * implemented by default, always returns true, so it should be 
         * overridden if validation is necessary.
         * @method validate
         * @protected
         * @return {boolean}
         */
        validate: function(){
            var isValid = true;
            if(this.validatorManager != null && this.simpleForm != null){
                isValid = this.simpleForm.validate();
            }
            isValid = (isValid == true) ? this.fireEvent(EVENT_TYPES.VALIDATE, {target:this}) : isValid;
            return isValid;
        },
        /**
         * Executes a submit of the Dialog if validation 
         * is successful. By default the Dialog is hidden
         * after submission, but you can set the 'hideaftersubmit'
         * configuration property to false, to prevent the Dialog
         * from being hidden.
         * @method submit
         * @public
         * @return {boolean}
         */
        submit: function (isAnim){
            var isValid = this.validate();
            if(isValid){
                this.fireEvent(EVENT_TYPES.BEFORE_SUBMIT, {target:this});
                this.doSubmit();
                this.fireEvent(EVENT_TYPES.SUBMIT, {target:this});
                if(this.cfg.getProperty('hideaftersubmit'))
                    this.hide(isAnim);
                return true;
            }else{
                return false;
            }
        },
        /**
         * form 객체의 invalid된 모든 객체를 초기화 하는 메소드
         * @method clearInvalid
         * @public
         * @return {void}
         */
        clearInvalid: function(){
            if(this.simpleForm)
                this.simpleForm.clearInvalid();
        },
        /**
         * Executes the cancel of the Dialog followed by a hide.
         * @method cancel
         * @public
         * @return {void}
         */
        cancel: function (isAnim){
            this.hideAnim(isAnim);
            this.fireEvent('cancel',{
                type: 'cancel',
                target: this,
                isAnim: isAnim
            }); 
        },
        /**
         * close 아이콘을 위한 이벤트 핸들러
         * @method _doClose
         * @protected
         * @param {DOMEvent} e
         */
        _doClose: function (e) {
            this.cancel(false);
        },
        /**
         * Returns a Json-compatible data structure representing the data 
         * currently contained in the form.
         * @method getData
         * @public
         * @return {Object} A Json object reprsenting the data of thecurrent form.
         */
        getData: function(){
            var oForm = this.form,
                aElements,
                nTotalElements,
                oData,
                sName,
                oElement,
                nElements,
                sType,
                sTagName,
                aOptions,
                nOptions,
                aValues,
                oOption,
                sValue,
                oRadio,
                oCheckbox,
                i,
                n;    
    
            function isFormElement(p_oElement){
                var sTag = p_oElement.tagName.toUpperCase();
                return ((sTag == 'INPUT' || sTag == 'TEXTAREA' ||  sTag == 'SELECT') && p_oElement.name == sName);
            }

            if(oForm){
                aElements = oForm.elements;
                nTotalElements = aElements.length;
                oData = {};
                for (i = 0; i < nTotalElements; i++){
                    sName = aElements[i].name;
                    /*
                        Using 'Dom.getElementsBy' to safeguard user from JS 
                        errors that result from giving a form field (or set of 
                        fields) the same name as a native method of a form 
                        (like 'submit') or a DOM collection (such as the 'item'
                        method). Originally tried accessing fields via the 
                        'namedItem' method of the 'element' collection, but 
                        discovered that it won't return a collection of fields 
                        in Gecko.
                    */
                    oElement = Dom.getElementsBy(isFormElement, '*', oForm);
                    nElements = oElement.length;

                    if(nElements > 0){
                        if(nElements == 1){
                            oElement = oElement[0];

                            sType = oElement.type;
                            sTagName = oElement.tagName.toUpperCase();

                            switch (sTagName){
                                case 'INPUT':
                                    if(sType == 'checkbox'){
                                        oData[sName] = oElement.checked;
                                    }else if(sType != 'radio'){
                                        oData[sName] = oElement.value;
                                    }
                                    break;

                                case 'TEXTAREA':
                                    oData[sName] = oElement.value;
                                    break;
    
                                case 'SELECT':
                                    aOptions = oElement.options;
                                    nOptions = aOptions.length;
                                    aValues = [];
    
                                    for (n = 0; n < nOptions; n++){
                                        oOption = aOptions[n];
    
                                        if(oOption.selected){
                                            sValue = oOption.value;
                                            if(!sValue || sValue === ''){
                                                sValue = oOption.text;
                                            }
                                            aValues[aValues.length] = sValue;
                                        }
                                    }
                                    oData[sName] = aValues;
                                    break;
                            }
        
                        }else{
                            sType = oElement[0].type;
                            switch (sType){
                                case 'radio':
                                    for (n = 0; n < nElements; n++){
                                        oRadio = oElement[n];
                                        if(oRadio.checked){
                                            oData[sName] = oRadio.value;
                                            break;
                                        }
                                    }
                                    break;
        
                                case 'checkbox':
                                    aValues = [];
                                    for (n = 0; n < nElements; n++){
                                        oCheckbox = oElement[n];
                                        if(oCheckbox.checked){
                                            aValues[aValues.length] =  oCheckbox.value;
                                        }
                                    }
                                    oData[sName] = aValues;
                                    break;
                            }
                        }
                    }
                }
            }
            return oData;
        },
        /**
         * Removes the Dialog element from the DOM and sets all child elements to null.
         * @method destroy
         * @public 
         * @return {void}
         */
        destroy: function(){
            removeButtonEventHandlers.call(this);
            for (var i = 0; this._buttons != null && i < this._buttons.length ; i++)
                this._buttons[i].destroy();
            this._buttons = null;
            var forms = this.element.getElementsByTagName('form'),
                form;
            if(forms.length > 0){
                form = forms[0];
                if(form){
                    Event.purgeElement(form);
                    if(form.parentNode){
                        form.parentNode.removeChild(form);
                    }
                    this.form = null;
                }
            }
            Dialog.superclass.destroy.call(this);
        },
        /**
         * Returns a string representation of the object.
         * @method toString
         * @public
         * @return {String} The string representation of the Dialog
         */
        toString: function(){
            return 'LDialog ' + this.id;
        }
    });
}());
Rui.namespace('Rui.ui');

(function () {
    /**
     * LSimpleDialog 는 간단한 다이얼로그 구현이다. 단일 값을 submit 하는데 사용될 수 있다.
     * 형태는 세 가지로 구성될 수 있다 
     * async connection utility call, 단순 form POST 또는 GET, 매뉴얼
     * @namespace Rui.ui
     * @class LSimpleDialog
     * @extends Rui.ui.LDialog
     * @constructor
     * @param {String|HTMLElement} el: LSimpleDialog를 나타내는 엘리먼트ID<em>또는</em>LSimpleDialog를 나타내는 엘리먼트
     * @param {Object} config: LSimpleDialog에 설정되어야 할 환경설정을 포함한 configuration 오브젝트 문자
     * 더 자세한 사항은 configuration 문서를 참조하라.
     */
    Rui.ui.LSimpleDialog = function (config) {
        config = config || {};
        Rui.ui.LSimpleDialog.superclass.constructor.call(this, config); 
    };

    var Dom = Rui.util.LDom,
        LSimpleDialog = Rui.ui.LSimpleDialog,

    /**
     * LSimpleDialog의 config properties를 나타내는 상수
     * @property DEFAULT_CONFIG
     * @private
     * @final
     * @type Object
     */
    DEFAULT_CONFIG = {
        'ICON': {
            key: 'icon',
            value: 'none',
            suppressEvent: true
        },
        'TEXT': {
            key: 'text',
            value: '',
            suppressEvent: true,
            supercedes: ['icon']
        }
    };
    /**
     * 블로킹에 대한 표준 네트워크 아이콘 상수
     * @property ICON_BLOCK
     * @static
     * @final
     * @type String
     */
    LSimpleDialog.ICON_BLOCK = 'blckicon';
    /**
     * alarm에 대한 표준 네트워크 아이콘 상수
     * @property ICON_ALARM
     * @static
     * @final
     * @type String
     */
    LSimpleDialog.ICON_ALARM = 'alrticon';
    /**
     * help에 대한 표준 네트워크 아이콘 상수
     * @property ICON_HELP
     * @static
     * @final
     * @type String
     */
    LSimpleDialog.ICON_HELP  = 'hlpicon';
    /**
     * info에 대한 표준 네트워크 아이콘 상수
     * @property ICON_INFO
     * @static
     * @final
     * @type String
     */
    LSimpleDialog.ICON_INFO  = 'infoicon';
    /**
     * warn에 대한 표준 네트워크 아이콘 상수
     * @property ICON_WARN
     * @static
     * @final
     * @type String
     */
    LSimpleDialog.ICON_WARN  = 'warnicon';
    /**
     * tip에 대한 표준 네트워크 아이콘 상수
     * @property ICON_TIP
     * @static
     * @final
     * @type String
     */
    LSimpleDialog.ICON_TIP   = 'tipicon';
    /**
     * 엘리먼트에 적용되는 CSS 클래스 이름을 나타내는 상수
     * 'icon' config property에 의해 생성
     * @property ICON_CSS_CLASSNAME
     * @static
     * @final
     * @type String
     */
    LSimpleDialog.ICON_CSS_CLASSNAME = 'L-icon';
    /**
     * LSimpleDialog에 사용되는 기본 CSS 클래스를 나타내는 상수
     * @property CSS_SIMPLEDIALOG
     * @static
     * @final
     * @type String
     */
    LSimpleDialog.CSS_SIMPLEDIALOG = 'L-simple-dialog';
    
    Rui.extend(LSimpleDialog, Rui.ui.LDialog, {
        otype: 'Rui.ui.LSimpleDialog',
        text: null,
        icon: null,
        /**
         * 변경가능한 클래스 config properties를 초기화 한다.
         * LSimpleDialog의 Config object(cfg) 사용.
         * @protected
         * @method initDefaultConfig
         */
        initDefaultConfig: function () {
            LSimpleDialog.superclass.initDefaultConfig.call(this);

            // Add dialog config properties
            /**
             * LSimpleDialog에 대한 정보 icon을 설정한다.
             * @config icon
             * @type String
             * @default 'none'
             */
            this.cfg.addProperty(DEFAULT_CONFIG.ICON.key, {
                handler: this.configIcon,
                value: DEFAULT_CONFIG.ICON.value,
                suppressEvent: DEFAULT_CONFIG.ICON.suppressEvent
            });
            /**
             * LSimpleDialog에 대한 text를 설정한다.
             * @config text
             * @type String
             * @default ''
             */
            this.cfg.addProperty(DEFAULT_CONFIG.TEXT.key, { 
                handler: this.configText, 
                value: DEFAULT_CONFIG.TEXT.value, 
                suppressEvent: DEFAULT_CONFIG.TEXT.suppressEvent, 
                supercedes: DEFAULT_CONFIG.TEXT.supercedes 
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
            LSimpleDialog.superclass.initComponent.call(this, config);
            if (config)
                this.cfg.applyConfig(config, true);
        },
        /**
         * Initializes the custom events for Dialog which are fired 
         * automatically at appropriate times by the Dialog class.
         * @method initEvents
         * @protected
         */
        initEvents: function () {
            LSimpleDialog.superclass.initEvents.call(this);
            this.on('beforeRender', this._onSetBody, this, true);
        },
        /**
         * @description element Dom객체 생성
         * @method createContainer
         * @protected
         * @return {LElement}
         */
        createContainer: function(){
            this.el = LSimpleDialog.superclass.createContainer.call(this);
            Dom.addClass(this.element, LSimpleDialog.CSS_SIMPLEDIALOG);
            this.cfg.queueProperty('postmethod', 'manual');
            return this.el; 
        }, 
        /**
         * @description render후 호출되는 메소드
         * @method afterRender
         * @protected
         * @param {HTMLElement} container 부모 객체
         * @return {void}
         */
        afterRender: function(container) {
            Rui.ui.LSimpleDialog.superclass.afterRender.call(this,container);
            this.setBody(this.text);           
        },
        /**
         * body initialize 
         * @private 
         * @method _onSetBody
         */
        _onSetBody: function(e){
            if (!this.body)
                this.setBody('');
        }, 
        /**
         * LSimpleDialog의 내부 form 오브젝트 준비. 
         * 이 form obj는 현재 없으면 생성하고 hidden field에 값을 추가.
         * @method registerForm
         */
        registerForm: function () {
            LSimpleDialog.superclass.registerForm.call(this);
            this.form.innerHTML += '<input type=\"hidden\" name=\'' + 
            this.id + '\" value=\"\"/>';
        },

        // BEGIN BUILT-IN PROPERTY EVENT HANDLERS //
        /**
         * "icon" property가 설정될 때 fire된다.
         * @method configIcon
         * @private
         * @param {String} type: LCustomEvent 타입 (보통 property 이름)
         * @param {Object[]} args: The LCustomEvent arguments. 
         * config handler를 위한 값이며 args[0]은 property에 새로 적용된 값과 같다.
         * @param {Object} obj: The scope object. 
         * config handler를 위한 값이며 보통 owner와 같다. 
         */
        configIcon: function (type,args,obj) {
            var sIcon = args[0],
            oBody = this.body,
            sCSSClass = LSimpleDialog.ICON_CSS_CLASSNAME,
            oIcon,
            oIconParent;

            if (sIcon && sIcon != 'none') {
                oIcon = Dom.getElementsByClassName(sCSSClass, '*' , oBody);
                if (oIcon) {
                    oIconParent = oIcon.parentNode;
                    if (oIconParent) {
                        oIconParent.removeChild(oIcon);
                        oIcon = null;
                    }
                }

                if (sIcon.indexOf('.') == -1) {
                    oIcon = document.createElement('span');
                    oIcon.className = (sCSSClass + ' ' + sIcon);
                    oIcon.innerHTML = '&#160;';
                } else {
                    oIcon = document.createElement('img');
                    oIcon.src = (this.imageRoot + sIcon);
                    oIcon.className = sCSSClass;
                }
                if (oIcon) {
                    oBody.insertBefore(oIcon, oBody.firstChild);
                }
            }
        },
        /**
         * 'text' property가 설정될 때 fire된다.
         * @method configText
         * @private
         * @param {String} type: LCustomEvent 타입 (보통 property 이름)
         * @param {Object[]} args: The LCustomEvent arguments. 
         * config handler를 위한 값이며 args[0]은 property에 새로 적용된 값과 같다.
         * @param {Object} obj: The scope object. 
         * config handler를 위한 값이며 보통 owner와 같다. 
         */
        configText: function (type,args,obj) {
            var text = args[0];
            if (text) {
                this.setBody(text);
                this.cfg.refireEvent('icon');
            }
        },

        // END BUILT-IN PROPERTY EVENT HANDLERS //
        /**
         * Removes the Panel element from the DOM and sets all child elements 
         * to null.
         * @method destroy
         * @return {void}
         */
        destroy: function () {
            LSimpleDialog.superclass.destroy.call(this);
        },
        /**
         * object를 string 형태로 리턴한다.
         * @method toString
         * @return {String} LSimpleDialog의 string 형태 값
         */
        toString: function () {
            return 'LSimpleDialog ' + this.id;
        }
        /**
         * <p>
         * HTML에 LSimpleDialog의 body 내용 설정
         * body가 존재하지 않으면 자동으로 생성된다.
         * 빈 string 값이 body 내용을 클리어하는 메소드로 넘겨질 수 있다.
         * </p>
         * <p><strong>NOTE:</strong> LSimpleDialog는 <a href="#config_text">text</a>, 
         * 그리고 <a href="#config_icon">icon</a> 를 제공한다.
         * 이들은 LSimpleDialog(icon과 message text)의 UI 디자인에 부합되게 body 엘리먼츠 내용을 설정한다.
         * LSimpleDialog에서 setBody 호출은 이 UI 디자인 제한에 구애받지 않고
         * LSimpleDialog body의 전체 내용을 교체한다.
         * 이는 custom makrup으로 LSimpleDialog 기본 icon/text body 구조를 교체하려고 할 때만 사용할 수 있다.</p>
         * 
         * @method setBody
         * @param {String} bodyContent: body 설정하는데 사용되는 HTML.
         * 편의상, HTMLElement 오브젝트가 아닌 것들도 메소드로 넘겨질 수 있고
         * string으로 취급되며 body innerHTML과 함께 기본 toString 구현으로 설정될 수 있다.
         * <em>또는</em>
         * @param {HTMLElement} bodyContent: body 엘리먼트의 첫번째이자 유일한 child로 추가되는 HTMLElement.
         * <em>또는</em>
         * @param {DocumentFragment} bodyContent: body에 추가되는 엘리먼츠를 포함하는 문서
         */
    });
}());
(function () {
    Rui.namespace('Rui.ui.LMessageBox');
    
    var msgBox = Rui.ui.LMessageBox;
    var Ev = Rui.util.LEvent;

    /**
     * 메시지 박스를 띄울경우 사용한다. 
     * 종류: alert, confirm, prompt 
     * @namespace Rui.ui
     * @class LMessageBox
     * @sample default
     * @static
     */
   
    /**
     * alert message
     * @method alert
     * @static
     * @param {String || Object} option 출력할 메시지나 출력 정보 객체
     * @return {void} 
     */
    msgBox.alert = function (option) {

        if(!option || !option.text) { // typeof option === 'string' || typeof option === 'number') {
            option = {
                text: option
            };
        }

        var buttons = option.buttons = option.buttons || [],
            button = buttons[0] || {};
        option.buttons[0] = Rui.applyIf(button, {
            text: 'OK',
            id: 'LMsgBox-alert-ok',
            isDefault: true,
            handler: function(){
                this.hideMask();
                if(option.handler)
                    option.handler.call(this);
                this.destroy();
            }
        });
        var box = msgBox.createMessageBox(option);
        box.show();
        return box;
    };
    /**
     * confirm message
     * @method confirm
     * @static
     * @param {String || Object} option 출력할 메시지나 출력 정보 객체
     * @return {void} 
     */
    msgBox.confirm = function (option) {
        if(!option || !option.text) {
            option = {
                text: option
            };
        }
        option = Rui.applyIf(option, {
            title:'Question',
            icon: Rui.ui.LSimpleDialog.ICON_HELP
        });
        
        var buttons = option.buttons = option.buttons || [],
            buttonYes = buttons[0] || {},
            buttonNo = buttons[1] || {};
        option.buttons[0] = Rui.applyIf(buttonYes, {
            text: 'Yes',
            id: 'LMsgBox-confirm-yes',
            isDefault: true,
            handler: function(){
                this.hideMask();
                if(option.handlerYes)
                    option.handlerYes.call(this);
                this.destroy();
            }
        });
        option.buttons[1] = Rui.applyIf(buttonNo, {
            text: 'No',
            id: 'LMsgBox-confirm-no',
            isDefault: false,
            handler: function(){
                this.hideMask();
                if(option.handlerNo)
                    option.handlerNo.call(this);
                this.destroy();
            }
        });
        var box = msgBox.createMessageBox(option);
        box.show();
        return box;
    };
    /**
     * prompt message
     * @method prompt
     * @static
     * @param {String || Object} option 출력할 메시지나 출력 정보 객체
     * @return {void}
     */
    msgBox.prompt = function (option) {
        if(!option || !option.text) {
            option = {
                text: option
            };
        }
        console.log(option);

        var buttons = option.buttons = option.buttons || [],
            buttonOk = buttons[0] || {},
            buttonCancel = buttons[1] || {},
            promptId = Rui.useFixedId() ? 'LMsgBox-prompt' : Rui.id(); 

        option.buttons[0] = Rui.applyIf(buttonOk, {
            text: 'OK',
            id: 'LMsgBox-prompt-ok',
            isDefault: true,
            handler: function(){
                this.hideMask();
                if(option.handler)
                    option.handler.call(this, Rui.get(promptId).getValue());
                this.destroy();
            }
        });
        option.buttons[1] = Rui.applyIf(buttonCancel, {
            text: 'Cancel',
            id: 'LMsgBox-prompt-cancel',
            isDefault: false,
            handler: function(){
                this.destroy();
            }
        });

        option.text += '<input type="text" id="' + promptId + '" style="width:200px">';
        var box = msgBox.createMessageBox(option);
        box.show();
        return box;
    };
    /**
     * messageBox 생성
     * @method createMessageBox
     * @static
     * @private
     * @param {option} option 출력할 메시지나 출력 정보 객체
     * @return {Rui.ui.LSimpleDialog}
     */
    msgBox.createMessageBox = function(option) {
        option = Rui.applyIf(option, {
            id:'messagebox',
            renderTo: document.body,
            title: 'Information',
            width: 300,
            fixedcenter: true,
            draggable: true,
            visible: false,
            close: false,
            modal: true,
            constraintoviewport: true,
            isDefaultCSS: true,
            //zIndex: 99999,
            buttons: [
                { text: 'OK', 
                  id: 'LMsgBox-messagebox-ok',
                  handler:function(){
                    this.hideMask();
                    this.destroy();
                }, isDefault:true }
            ]
        });

        var messageBox = new Rui.ui.LSimpleDialog(option);
        //messageBox.renderEvent.on(msgBox.firstFocus, messageBox, true);
        messageBox.setHeader(option.title);
        
        if(Rui.useAccessibility())
            messageBox.el.setAttribute('role', 'alert');

        var buttons = messageBox.getButtons();
        for (var i = 0 ; i < buttons.length ; i++) {
            var buttonEl = buttons[i];
            if(Rui.get(buttonEl.dom).hasClass('default')) {
                try {
                    buttonEl.on('keydown', function(e){
                        if(e.keyCode == 13) {
                            try {
                                this.click();
                                Ev.stopEvent(e);
                            }catch(e) {}
                        }
                    });
                    buttonEl.select('button').focus();
                } catch (e) {}
                break;
            }
        }
        
        return messageBox;
    };
    
    Rui.alert = msgBox.alert;
    Rui.confirm = msgBox.confirm;
    Rui.prompt = msgBox.prompt;
    
}());
/**
 * 사용자로부터 기다려야 함을 요구할 때 사용
 * @namespace Rui.ui
 * @class LWaitPanel
 * @constructor
 */   
Rui.ui.LWaitPanel = function(id, oConfig) {
    var config = oConfig || {};
    if(arguments.length == 0)
        id = Rui.browser.msie ? document.body : document;
    else if(typeof id == 'object') {
        config = id;
        id = Rui.browser.msie ? document.body : document;
    }
    this.el = ((id == document.body) || (id == document)) ? Rui.getBody() : Rui.get(id);
    this.isDocumentBody = (this.el.dom == document.body || this.el.dom == document);
    this.el.addClass('L-wait-panel');
    Rui.applyObject(this, config);
    this.iId = Rui.id();
};
Rui.ui.LWaitPanel.prototype = {
    /**
     * @description mask의 dom 객체가 document body인지 여부 
     * @property isDocumentBody
     * @private
     * @type {boolean}
     */
    isDocumentBody: false,
    /**
     * @description mask message 객체
     * <p>Sample: <a href="./../sample/general/ui/waitpanelSample.html" target="_sample">보기</a></p>
     * @config maskMsg
     * @type {Object}
     * @default null
     */
     /**
     * @description mask message 객체
     * @property maskMsg
     * @private
     * @type {Object}
     */
    maskMsg: null,
    /**
     * @description wait panel 객체를 출력하는 메소드
     * @method show
     * @return {void}
     */
    show: function() {
        if(this.isDocumentBody) {
            var S_WP = Rui.ui.LWaitPanel;
            var idx = Rui.util.LArray.indexOf(S_WP._SHOW_COUNT, this.iId);
            if(idx < 0) S_WP._SHOW_COUNT.push(this.iId);
            if(S_WP._SHOW_COUNT.length < 2) {
                S_WP._MASK_DOCUMENT_EL = S_WP._MASK_DOCUMENT_EL || this.el;  
                S_WP._MASK_DOCUMENT_EL.mask(this.maskMsg);
                if(S_WP._MASK_DOCUMENT_EL.waitMaskEl)
                    if(this.css) S_WP._MASK_DOCUMENT_EL.waitMaskEl.addClass(this.css);
            }
        } else {
            this.el.mask(this.maskMsg);
            if(this.el.waitMaskEl)
                if(this.css) this.el.waitMaskEl.addClass(this.css);
        }
    },
    /**
     * @description wait panel 객체를 숨기는 메소드
     * @method hide
     * @return {void}
     */
    hide: function() {
        if(this.isDocumentBody) {
            var S_WP = Rui.ui.LWaitPanel;
            S_WP._MASK_DOCUMENT_EL = S_WP._MASK_DOCUMENT_EL || this.el;
            var idx = Rui.util.LArray.indexOf(S_WP._SHOW_COUNT, this.iId);
            if(idx > -1) {
                S_WP._SHOW_COUNT[idx] = null;
                S_WP._SHOW_COUNT.splice(idx, 1);
            }
            if(S_WP._SHOW_COUNT.length < 1)
                S_WP._MASK_DOCUMENT_EL.unmask();
        } else this.el.unmask();
    },
    /**
     * @description wait panel의 Region정보를 리턴하는 메소드
     * @method getRegion
     * @return {Region | Array}
     */
    getRegion: function(g) {
        return this.el.getRegion();
    },
    /**
     * @description wait panel의 region 정보를 설정하는 메소드
     * @method setRegion
     * @param {Region | Array} g Region 정보 객체
     * @return {void}
     */
    setRegion: function(g) {
        this.el.setRegion(g);
    }
};
Rui.ui.LWaitPanel._SHOW_COUNT = [];
Rui.ui.LWaitPanel._MASK_DOCUMENT_EL = null;

/**
 * @description LScroller
 * @namespace Rui.ui
 * @class LScroller
 * @extends Rui.ui.LUIComponent
 * @constructor LScroller
 * @sample default
 * @param {Object} config LScroller의 초기 설정값
 */
Rui.ui.LScroller = function(config){
    config = config || {};
    config = Rui.applyIf(config, Rui.getConfig().getFirst('$.ext.scroller.defaultProperties'));
    Rui.ui.LScroller.superclass.constructor.call(this, config);
    this.scrollbarSize = Rui.ui.LScroller.SCROLLBAR_SIZE;
    this.createEvent('scrollY');
    this.createEvent('scrollX');
};
/**
 * @description scrollbar의 넓이 (가로스크롤의 경우 height, 세로스크롤의 경우 width)
 * @property scrollbarSize
 * @protected
 * @type {int}
 * @static
 */
Rui.ui.LScroller.SCROLLBAR_SIZE = Rui.platform.isMobile || Rui.platform.mac ? 0 : 17;
Rui.extend(Rui.ui.LScroller, Rui.ui.LUIComponent, {
    /**
     * @description 객체의 이름
     * @property otype
     * @private
     * @type {String}
     */
    otype: 'Rui.ui.LScroller',
    /**
     * @description 컨텐츠로 사용될 DOM의 정보를 지정한다. 이 값이 없을 경우는 랜더링될 DOM의 첫번째 자식(firstChild)이 컨텐츠 DOM이 된다.
     * @config content
     * @type {String|HTMLElement|LElement}
     * @default null
     */
    /**
     * @description 스크롤러를 설정할 컨텐츠의 DOM 또는 DOM의 ID
     * @config content
     * @type {String|HTMLElement|LElement}
     * @default null
     */
    content: null,
    /**
     * @description 컨텐츠에 margin등이 있을경우 정확한 컨텐츠의 크기를 얻을 수 없기에 wrapper DOM(inline-block) 생성해서
     * 컨텐츠의 정확한 크기를 얻을 수 있는데, margin등이 없는 컨텐츠의 경우 wrapper DOM을 생성할 필요 없다.
     * marginSafe기능을 true로 설정시 wrapper DOM을 생성하여 하위 컨텐츠의 margin을 포함한 정확한 크기를 얻을 수 있다.
     * @config marginSafe
     * @type {boolean}
     * @default false
     */
    /**
     * @description wrapper DOM을 추가 할지 여부.
     * @property marginSafe
     * @private
     * @type {boolean}
     * @default false
     */
    marginSafe: false,
    /**
     * @description 가상 스크롤을 사용할지 여부. 사용할 경우 true로 설정한다.
     * @config useVirtual
     * @type {boolean}
     * @default false
     */
    /**
     * @description 가상의 content를 scroll, scrollY event를 처리해야 한다.
     * @property useVirtual
     * @private
     * @type {boolean}
     * @default false
     */
    useVirtual: false,
    /**
     * @description scrollbar를 설정한다.
     * auto : 필요에 따라 스크롤바가 나타남
     * both : x, y 양쪽 스크롤바가 고정으로 나타나며 불필요시 비활성화됨
     * x : x스크롤바는 고정이며 y스크롤바는 자동으로 나타남
     * y : y스크롤바는 고정이며 x스크롤바는 자동으로 나타남
     * @config scrollbar
     * @type {boolean}
     * @default 'auto'
     */
    /**
     * @description scrollbar를 설정한다.
     * @property scrollbar
     * @private
     * @type {boolean}
     * @default 'auto'
     */
    scrollbar: 'auto',
    /**
     * @description 가상의 스크롤을 사용할 경우 scrollEl보다 가상스크롤러의 contentEl이 작으며 그 비율
     * @property virtualScrollRate
     * @private
     * @type {int}
     * @default 0
     */
    virtualScrollRate: 1,
    /**
     * @description 마우스 상하 스크롤 한 단위에 이동할 간격
     * @property xScrollStep
     * @private
     * @type {int}
     * @default 20
     */
    xScrollStep: 40,
    /**
     * @description 마우스 좌우 스크롤 한 단위에 이동할 간격
     * @property yScrollStep
     * @private
     * @type {int}
     * @default 50
     */
    yScrollStep: 50,
    /**
     * @description 마우스 상하 휠스크롤 한 단위에 이동할 간격
     * @property xWheelStep
     * @private
     * @type {int}
     * @default 60
     */
    xWheelStep: 60,
    /**
     * @description 마우스 좌우 휠스크롤 한 단위에 이동할 간격
     * @property yWheelStep
     * @private
     * @type {int}
     * @default 150
     */
    yWheelStep: 150,
    /**
     * @description 상하좌우 공간이 필요한 경우의 값
     * @property space
     * @private
     * @type {Object}
     * @default null
     */
    space: null,
    /**
     * @description scrollbar의 넓이
     * @property scrollbarSize
     * @private
     * @type {int}
     * @default 17
     */
    scrollbarSize: Rui.ui.LScroller.SCROLLBAR_SIZE,
    /**
     * @description 현재 스크롤 위치를 기억하는 상태값 x, y 값을 start, end형태의 문자열 값으로 가진다.
     * @property position
     * @private
     * @type {object}
     * @default empty object
     */
    position: null,
    /**
     * @description Dom객체 생성 및 초기화하는 메소드
     * @method initComponent
     * @protected
     * @param {Object} config 환경정보 객체 
     * @return {void}
     */
    initComponent: function(config){
        this.space = {top: 0, right: 0, bottom: 0, left: 0};
        this.position = {};
    },
    /**
     * @description el 컨테이너 생성
     * @method createContainer
     * @protected
     * @param {String|LElement|HTMLElement} content
     * @return {LElement}
     */
    createContainer: function(appendTo) {
        Rui.ui.LScroller.superclass.createContainer.call(this, appendTo);
        this.el.addClass('L-scroller');
        this.el.addClass('L-ignore-event');
        if(this.content){
            this.contentEl = Rui.get(this.content);
        }else{
            this.contentEl = Rui.get(this.el.dom.children[0]);
        }
        this.contentEl.addClass('L-scroll-content');
        return this.el;
    },
    /**
     * @description render시 호출되는 메소드
     * @method doRender
     * @private
     * @return {void}
     */
    doRender: function(){
        
        if(this.scrollEl){
            if(this.width)
                this.setWidth(this.width);
            if(this.height)
                this.setHeight(this.height);
        }

        var el = this.el;
        if(this.useVirtual !== true){
            this.el.appendChild(this.contentEl);
            el.setStyle('overflow', 'auto');
            return;
        }
        
        this.scrollEl = Rui.get(this.createElement());
        this.scrollEl.addClass('L-scroll');
        if(this.el.dom.children.length > 0)
            Rui.get(this.el.dom.children[0]).insertBefore(this.scrollEl);
        else
            el.appendChild(this.scrollEl);
        
        if(this.marginSafe === true){
            this.wrapperEl = Rui.get(this.createElement());
            this.wrapperEl.addClass('L-scroll-wrapper');
            this.scrollEl.appendChild(this.wrapperEl);
            this.wrapperEl.appendChild(this.contentEl);
        }else{
            this.scrollEl.appendChild(this.contentEl);
        }
        
        this.setupSizes();
    },
    /**
     * @description render후 호출되는 메소드
     * @method afterRender
     * @protected
     * @return {void}
     */
    afterRender: function(){
        //Rui.ui.LScroller.superclass.afterRender.call(this);
        var Event = Rui.util.LEvent;
        if(Rui.browser.mozilla){
            Event.addListener(this.el.dom, 'DOMMouseScroll', this.onWheel, this, true);  
        }else{
            Event.addListener(this.el.dom, 'mousewheel', this.onWheel, this, true);
        }
        
        if(Rui.platform.isMobile){
            if(Rui.browser.touch){
                Event.addListener(document.body, 'touchstart', this.onTouchStart, this, true);
                Event.addListener(document.body, 'touchmove', this.onTouchMove, this, true);
                Event.addListener(document.body, 'touchend', this.onTouchEnd, this, true);
            }else{
                Event.addListener(document.body, 'mousedown', this.onTouchStart, this, true);
                Event.addListener(document.body, 'mousemove', this.onTouchMove, this, true);
                Event.addListener(document.body, 'mouseup', this.onTouchEnd, this, true);
            }
        }

        Event.addListener(window, 'resize', this.onResize, this, true);
    },
    /**
     * @description X, Y scrollbar를 생성한다.
     * @method setupScrollbars
     * @private
     * @return {void}
     */
    setupScrollbars: function(){
        this.isNeedScrollbar();
         
        if (this.needScroll.Y || this.scrollbar == 'both' || this.scrollbar == 'y'){
            if(!this.yScrollbarEl){
                this.yScrollbarEl = Rui.get(this.createElement());
                this.scrollEl.insertAfter(this.yScrollbarEl.dom);
                this.yScrollbarEl.addClass('L-scrollbar-y');
                this.yScrollbarEl.addClass('L-ignore-event');
                Rui.util.LEvent.addListener(this.yScrollbarEl.dom, 'scroll', this.onScrollY, this, true);
            }
            if(!this.yVirtualContentEl){
                //scroll 높이 만들어 줄 가상 content
                this.yVirtualContentEl = Rui.get(this.createElement());
                this.yScrollbarEl.appendChild(this.yVirtualContentEl);
                this.yVirtualContentEl.addClass('L-scrollbar-y-content');
                this.yVirtualContentEl.html('&nbsp;');
            }
        } else {
            if(this.yVirtualContentEl){
                this.yVirtualContentEl.remove();
                this.yVirtualContentEl = null;
            }
            if(this.yScrollbarEl){
                Rui.util.LEvent.removeListener(this.yScrollbarEl.dom, 'scroll', this.onScrollY);
                this.yScrollbarEl.remove();
                this.yScrollbarEl = null;
            }
        }
        if(this.needScroll.X || this.scrollbar == 'both' || this.scrollbar == 'x'){
            if(!this.xScrollbarEl){
                this.xScrollbarEl = Rui.get(this.createElement());
                if(this.yScrollbarEl){
                    this.yScrollbarEl.insertAfter(this.xScrollbarEl.dom);
                }else{
                    this.scrollEl.insertAfter(this.xScrollbarEl.dom);
                }
                this.xScrollbarEl.addClass('L-scrollbar-x');
                this.xScrollbarEl.addClass('L-ignore-event');
                Rui.util.LEvent.addListener(this.xScrollbarEl.dom, 'scroll', this.onScrollX, this, true);
            }
            if(!this.xVirtualContentEl){
                //scroll 높이 만들어 줄 가상 content
                this.xVirtualContentEl = Rui.get(this.createElement());
                this.xScrollbarEl.appendChild(this.xVirtualContentEl);
                this.xVirtualContentEl.addClass('L-scrollbar-x-content');
                this.xVirtualContentEl.html('&nbsp;');
            }
        } else {
            if(this.xVirtualContentEl){
                this.xVirtualContentEl.remove();
                this.xVirtualContentEl = null;
            }
            if(this.xScrollbarEl){
                Rui.util.LEvent.removeListener(this.xScrollbarEl.dom, 'scroll', this.onScrollX);
                this.xScrollbarEl.remove();
                this.xScrollbarEl = null;
            }
        }
    },
    /**
     * @description resize등에 따른 size 조정하기
     * @method setupSizes
     * @private
     * @return {void}
     */
    setupSizes: function(){
        if(this.isWidthZero())
            return false;
        
        var scrollWidth = this.el.getWidth(true),
            scrollHeight = this.el.getHeight(true),
            s = this.space, st = s.top, sr = s.right, sb = s.bottom, sl = s.left,
            sw = scrollWidth - sl - sr - (this.yScrollbarEl ? this.scrollbarSize : 0),
            sh = scrollHeight - st - sb - (this.xScrollbarEl ? this.scrollbarSize : 0);
        
        if(this.scrollEl){
            this.scrollEl.setWidth(sw);
            this.scrollEl.setHeight(sh);
        }
        
        this.setupScrollbars();

        //xy Scrollbar 생성 후 한번 더 계산하여 적용.
        sw = scrollWidth - sl - sr - (this.yScrollbarEl ? this.scrollbarSize : 0);
        sh = scrollHeight - st - sb - (this.xScrollbarEl ? this.scrollbarSize : 0);
        this.scrollEl.setWidth(sw);
        this.scrollEl.setHeight(sh);
        
        if(this.xScrollbarEl){
            if(Rui.browser.msie)
                this.xScrollbarEl.setHeight(this.scrollbarSize+1);    //IE의 경우 컨텐츠의 1px를 감안하여 스크롤바 크기를 18로 해야함.
            this.xScrollbarEl.setWidth(sw);
        }
        if(this.yScrollbarEl){
            if(Rui.browser.msie)
                this.yScrollbarEl.setWidth(this.scrollbarSize+1);    //IE의 경우 컨텐츠의 1px를 감안하여 스크롤바 크기를 18로 해야함.
            this.yScrollbarEl.setHeight(sh);
        }

        this.setupVirtualContent();
    },
    /**
     * @description rendering시 scroll bar가 필요한지 검사
     * @method isNeedScrollbar
     * @private
     * @return {void}
     */
    isNeedScrollbar: function(){
        //scrollbar 고려 반대 방향 scrollbar 활성화 고려
        //1. 둘다 있거나 없는 경우
        //2. x스크롤 있는 경우
        //3. y스크롤 있는 경우
        this.needScroll = this.needScroll ? this.needScroll : {X: false, Y: false};
        if(this.isWidthZero())
            return false;
        //scrollbar가 필요한지 여부

        var scrollWidth = this.el.getWidth(true),
            scrollHeight = this.el.getHeight(true),
            cw = this.getContentWidth(), //content width
            ch = this.getContentHeight(), //content height
            s = this.space, st = s.top, sr = s.right, sb = s.bottom, sl = s.left,
            Y = (scrollHeight - st - sb) < ch ? true : false,
            X = (scrollWidth - sl - sr) < cw ? true : false;
        if(X !== Y){
            if(X){
               Y = (scrollHeight - st - sb - this.scrollbarSize) < ch ? true : false;
            }else if(Y){
               X = (scrollWidth - sl - sr - this.scrollbarSize) < cw ? true : false;
            }
        }
        this.needScroll = {
            X: X,
            Y: Y
        };
    },
    isWidthZero: function(){
        return this.el.getWidth() ? false : true;
    },
    /**
     * @description 가상의 Content Width를 반환한다. 
     * margin등의 계산을 위해 wrapper를 사용할 경우는 wrapper의 width를,
     * wrapper를 사용하지 않을경우 content의 width를 반환한다.
     * @method getContentWidth
     * @private
     * @return {int}
     */
    getContentWidth: function(){
        //wrapperEl이 조건에 따라 없을 수 있으므로 없을 경우 this.contentEl의 width을 반환
        return this.wrapperEl ? this.wrapperEl.getWidth() : this.contentEl.getWidth();
    },
    /**
     * @description Content Height을 반환한다. 
     * margin등의 계산을 위해 wrapper를 사용할 경우는 wrapper의 height을,
     * wrapper를 사용하지 않을경우 content의 height을 반환한다.
     * @method getContentHeight
     * @private
     * @return {int}
     */
    getContentHeight: function(){
        //wrapperEl이 조건에 따라 없을 수 있으므로 없을 경우 this.contentEl의 height을 반환
        return this.wrapperEl ? this.wrapperEl.getHeight() : this.contentEl.getHeight();
    },
    /**
     * @description x, y scrollbar의 각 content의 넓이 및 높이를 자동으로 설정한다. 
     * @method setupVirtualContent
     * @protected
     * @return {void}
     */
    setupVirtualContent: function(){
        //이 메소드는 두가지 상황에 들어온다. 
        //1. 기존에 가상스크롤을 사용하지 않다가 사용하기 위해. (이 경우는 다시 랜더링 하여 가상 스크롤러를 만들어야 한다.)
        //2. 기존 가상스크롤을 사용하고 있었으며 가상스크롤의 크기를 변경하기 위해.
        if(this.useVirtual !== true){
            this.useVirtual = true;
            this.doRender();
        }
        var contentHeight = this.getContentHeight();
        if(Rui.browser.msie && contentHeight > 1193046 /*ie8MaxPx = 1193046*/){
            while (true){
                contentHeight = contentHeight / 10;
                if(contentHeight < 1193046){
                    break;
                }
            }
//            contentHeight = 27000;
        }
        this.setVirtualContentHeight(contentHeight);
        this.setVirtualContentWidth(this.getContentWidth());
    },
    /**
     * @description rendering 전 가상의 높이 설정
     * @method setVirtualContentHeight
     * @protected
     * @return {void}
     */
    setVirtualContentHeight: function(height){
        if(this.yVirtualContentEl){
            this.virtualScrollRate = this.getMaxScrollTop() / (height - this.scrollEl.getHeight(true)) || 1;
            this.yVirtualContentEl.setHeight(height);
        }
    },
    /**
     * @description rendering 전 가상의 넓이 설정
     * @method setVirtualContentWidth
     * @protected
     * @return {void}
     */
    setVirtualContentWidth: function(width){
        if(this.xVirtualContentEl)
            this.xVirtualContentEl.setWidth(width);
    },
    /**
     * @description 마우스의 상하 wheel 동작시 한번에 욺직이는 스크롤의 한 단위(px) 조회
     * 이 값이 크면 스크롤의 속도가 빠르며 값이 작으면 스크롤 속도가 느려짐.
     * @method getStep
     * @protected
     * @param {boolean} wheel [optional] wheel의 값을 조회할지 여부
     * @param {boolean} x [optional] x-scrollbar의 값을 조회할지 여부
     * @return {int}
     */
    getStep: function(wheel, x){
        if(x)
            return (wheel === true ? this.xWheelStep : this.xScrollStep) / this.virtualScrollRate;
        else
            return (wheel === true ? this.yWheelStep : this.yScrollStep) / this.virtualScrollRate;
    },
    /**
     * @description 마우스의 상하 wheel 동작시 한번에 욺직이는 스크롤의 한 단위(px).
     * 이 값이 크면 스크롤의 속도가 빠르며 값이 작으면 스크롤 속도가 느려짐.
     * @method setStep
     * @protected
     * @param {int} step
     * @param {boolean} wheel [optional] wheel의 값을 설정할지 여부
     * @param {boolean} x [optional] x-scrollbar의 값을 설정할지 여부
     * @return {void}
     */
    setStep: function(step, wheel, x){
        if(x){
            if(wheel === true)
                this.xWheelStep = step;
            else
                this.xScrollStep = step;
        }else{
            if(wheel === true)
                this.yWheelStep = step;
            else
                this.yScrollStep = step;
        }
    },
    /**
     * @description 스크롤 상하좌우 단에 공간이 필요하며, 이 공간들이 스크롤에 포함되지 않아야 하는경우 space을 사용할 수 있음.
     * 스크롤에 포함되지 않는 영역의 상하좌우 값을 반환함.
     * @method getSpace
     * @protected
     * @param {String} axis [optional] 축의 명칭 (top, right, bottom, left)
     * @return {int}
     */
    getSpace: function(axis){
        if(!axis)
            return this.space;
        else
            return this.space[axis];
    },
    /**
     * @description x스크롤 상,하,좌,우 공간이 필요하며, 이 공간은 x, y스크롤에 포함되지 않아야 하는경우 setSpace를 사용할 수 있음.
     * 이 값은 스크롤에 포함되지 않는 영역의 width, height값을 설정할것.
     * @method setSpace
     * @protected
     * @param {Object|int} spaceOrSize
     * @param {boolean} skipRefresh [optional] space적용 후 스크롤을 refresh할 지 여부. default true
     * @param {String} axis [optional] 축의 명칭 (top, right, bottom, left)
     * @return {void}
     */
    setSpace: function(spaceOrSize, skipRefresh, axis){
        if(!axis)
            this.space = spaceOrSize;
        else
            this.space[axis] = spaceOrSize;
        if(skipRefresh !== true)
            this.refresh();
    },
    /**
     * @description Y scroller의 최대 스크롤값(scrollTop)을 반환한다.
     * @method getMaxScrollTop
     * @public
     * @param {int} margin [optional]
     * @return {int}
     */
    getMaxScrollTop: function(margin){
        if(this.wrapperEl)
            return this.wrapperEl.getHeight() - this.scrollEl.getHeight(true);
        else
            return this.contentEl.getHeight() - this.el.getHeight(true) + (margin || 0);
    },
    /**
     * @description X scroller의 최대 스크롤값(scrollLeft)을 반환한다.
     * @method getMaxScrollLeft
     * @public
     * @param {int} margin [optional]
     * @return {int}
     */
    getMaxScrollLeft: function(margin){
        if(this.wrapperEl)
            return this.wrapperEl.getWidth() - this.scrollEl.getWidth(true);
        else
            return this.contentEl.getWidth() - this.el.getWidth(true) + (margin || 0);
    },
    /**
     * @description scroll의 width를 반환한다.
     * 이 값은 일반적으로 scroller el의 width에서 scrollbar의 size등을 제한 값이다.
     * @method getScrollWidth
     * @public
     * @return {int}
     */
    getScrollWidth: function(){
        return this.scrollEl ? this.scrollEl.getWidth() : 0;
    },
    /**
     * @description scroll의 height을 반환한다.
     * 이 값은 일반적으로 scroller el의 height에서 scrollbar의 size등을 제한 값이다.
     * @method getScrollHeight
     * @public
     * @return {int}
     */
    getScrollHeight: function(){
        if(!this.scrollEl) return 0;
        var h = this.scrollEl.getHeight();
        if(h === 0){
            return Rui.util.LDom.toPixelNumber(this.scrollEl.getStyle('height'));
        }
        return h;
    },
    /**
     * @description scroll의 scrollTop 값을 반환
     * @method getScrollTop
     * @public
     * @return {int}
     */
    getScrollTop: function(){
        return this.yScrollbarEl ? this.yScrollbarEl.dom.scrollTop : 0;
    },
    /**
     * @description scroll top 설정하기
     * @method setScrollTop
     * @protected
     * @param {int} scrollTop scrollTop px값
     * @return {void}
     */
    setScrollTop: function(scrollTop, ignoreEvent){
        if(!Rui.isNumber(scrollTop))
            return;
        this.ignoreEvent = ignoreEvent;
        if(this.useVirtual === true){
            if(this.yScrollbarEl)
                this.yScrollbarEl.dom.scrollTop = scrollTop;
        }else{
            this.el.dom.scrollTop = scrollTop;
        }
        this.setPosition(null, false);
    },
    /**
     * @description scroll의 scrollLeft 값을 반환
     * @method getScrollLeft
     * @public
     * @return {int}
     */
    getScrollLeft: function(){
        return this.xScrollbarEl ? this.xScrollbarEl.dom.scrollLeft : 0;
    },
    /**
     * @description scroll left 설정하기
     * @method setScrollLeft
     * @protected
     * @param {int} scrollTop
     * @return {void}
     */
    setScrollLeft: function(scrollLeft){
        if(!Rui.isNumber(scrollLeft))
            return;
        if(this.useVirtual === true){
            if(this.xScrollbarEl)
                this.xScrollbarEl.dom.scrollLeft = scrollLeft;
        }else{
            this.el.dom.scrollLeft = scrollLeft;
        }
        this.setPosition(null, true);
    },
    /**
     * @description scrollEl과 xScrollBar의 left값을 맞춘다.
     * @method syncScrollLeft
     * @protected
     * @return {void}
     */
    syncScrollLeft: function() {
    	if(this.scrollEl && this.xScrollbarEl) {
    		this.scrollEl.dom.scrollLeft = this.xScrollbarEl.dom.scrollLeft;
    	}
    },
    /**
     * @description scroll의 1단위 이전 scroll 값을 반환한다.
     * @method getPrevious
     * @protected
     * @param {boolean} x [optional] x-scrollbar의 값을 조회할 지 여부
     * @return {int}
     */
    getPrevious: function(x){
        if(x)
            return this.getScrollLeft() - this.getStep(false, true);
        else
            return this.getScrollTop() - this.getStep(false);
    },
    /**
     * @description scroll의 1단위 다음 scroll 값을 반환한다.
     * @method getNext
     * @protected
     * @param {boolean} x [optional] x-scrollbar의 값을 조회할 지 여부
     * @return {int}
     */
    getNext: function(x){
        if(x)
            return this.getScrollLeft() + this.getStep(false, true);
        else
            return this.getScrollTop() + this.getStep(false);
    },
    /**
     * @description scroll x,y 가져오기
     * @method getScroll
     * @public
     * @return {Object} coord
     */
    getScroll: function(){
        return {
            top: this.getScrollTop(),
            left: this.getScrollLeft()
        };
    },
    /**
     * @description scroll 이동하기
     * @method setScroll
     * @public
     * @param {Object} coord coord.top, coord.left
     * @return {void}
     */
    setScroll: function(coord){
        this.go(coord.top);
        this.go(coord.left, true);
    },
    /**
     * @description x, y축 scrollbar가 생성된 상태(사용중)인지 여부 반환
     * @method existScrollbar
     * @public
     * @param {boolean} x [optional] x-scrollbar를 조회하는지 여부
     * @return {boolean}
     */
    existScrollbar: function(x){
        if(x)
            return !!this.xScrollbarEl;
        else
            return !!this.yScrollbarEl;
    },
    /**
     * @description scrollbar의 크기를 조회한다. y scrollbar의 경우 width,  x scrollbar의 경우 height이 반환되며
     * 보통 이 값은 17px이다.
     * @method getScrollbarSize
     * @public
     * @param {boolean} x [optional] x-scrollbar의 값을 조회하는지 여부
     * @return {int}
     */
    getScrollbarSize: function(x){
        if(x)
            return this.xScrollbarEl ? this.scrollbarSize : 0;
        else
            return this.yScrollbarEl ? this.scrollbarSize : 0;
    },
    /**
     * @description scroll이 처음 위치에 있는지 여부 반환.
     * @method isStart
     * @public
     * @param {boolean} x [optional] x-scrollbar의 값을 조회하는지 여부
     * @return {int}
     */
    isStart: function(x){
        if(x)
            return this.getScrollLeft() == 0 ? true : false;
        else
            return this.getScrollTop() == 0 ? true : false;
    },
    /**
     * @description scroll이 끝 위치에 있는지 여부 반환.
     * @method isEnd
     * @public
     * @param {boolean} x [optional] x-scrollbar의 값을 조회하는지 여부
     * @return {int}
     */
    isEnd: function(x){
        if(x)
            return !this.xScrollbarEl ? true : (this.getScrollLeft() >= this.getMaxScrollLeft() ? true : false);
        else
            return !this.yScrollbarEl ? true : (this.getScrollTop() >= this.getMaxScrollTop() ? true : false);
    },
    /**
     * @description scroll을 원하는 위치로 이동시킨다.
     * go 함수의 경우 스크롤 위치를 기억한다. 이동되어야 할 위치가 없더라도 후에 재 랜더링 시에 이동되어야 할 위치가 확보되면 그때 이동한다.
     * @method go
     * @public
     * @sample default
     * @param {int} 이동할 위치 px (scrollTop 또는 scrollLeft)
     * @param {boolean} x [optional] x-scrollbar를 이동할지 여부
     * @return {int}
     */
    go: function(p, x){
        if(Rui.isEmpty(p) || !Rui.isNumber(p)) return;
        if(x){
            this.setScrollLeft(p);
            this.setPosition(p, true);
        }else{
            this.setScrollTop(p);
            this.setPosition(p, false);
        }
        return p;
    },
    /**
     * @description scroll을 시작 위치로 이동시킨다.
     * @method goStart
     * @public
     * @param {boolean} x [optional] x-scrollbar를 이동할지 여부
     * @return {int}
     */
    goStart: function(x){
        if(x){
            this.setScrollLeft(0);
            this.setPosition(0, true);
        }else{
            this.setScrollTop(0);
            this.setPosition(0, false);
        }
        return 0;
    },
    /**
     * @description scroll을 이전 위치로 이동 시킨다.
     * @method goPrevious
     * @public
     * @param {boolean} x [optional] x-scrollbar를 이동할지 여부
     * @return {int}
     */
    goPrevious: function(x){
        var p = this.getPrevious(x);
        if(x){
            this.setScrollLeft(p);
            this.setPosition(p, true);
        }else{
            this.setScrollTop(p);
            this.setPosition(p, false);
        }
    },
    /**
     * @description scroll을 다음 위치로 이동 시킨다.
     * @method goNext
     * @public
     * @param {boolean} x [optional] x-scrollbar를 이동할지 여부
     * @return {int}
     */
    goNext: function(x){
        var p = this.getNext(x);
        if(x){
            this.setScrollLeft(p);
            this.setPosition(p, true);
        }else{
            this.setScrollTop(p);
            this.setPosition(p, false);
        }
        return p;
    },
    /**
     * @description scroll을 끝 위치로 이동 시킨다.
     * @method goEnd
     * @public
     * @param {boolean} x [optional] x-scrollbar를 이동할지 여부
     * @return {int}
     */
    goEnd: function(x){
        var p;
        if(x){
            p = this.getMaxScrollLeft();
            this.setScrollLeft(p);
            this.setPosition(p, true);
        } else {
            p = this.getMaxScrollTop();
            this.setScrollTop(p);
            this.setPosition(p, false);
        }
        return p;
    },
    /**
     * @description 스크롤의 넓이를 설정한다.
     * @method setWidth
     * @public
     * @param {int} width 새로운 넓이
     * @param {boolean} skipRefresh [optional] space적용 후 스크롤을 refresh할 지 여부. default true
     * @return {void}
     */
    setWidth: function(width, skipRefresh){
        Rui.ui.LScroller.superclass.setWidth.call(this, width);
        if(skipRefresh !== true)
            this.refresh();
    },
    /**
     * @description 스크롤의 높이를 설정한다.
     * @method setHeight
     * @public
     * @param {int} height 새로운 높이.
     * @param {boolean} skipRefresh [optional] space적용 후 스크롤을 refresh할 지 여부. default true
     * @return {void}
     */
    setHeight: function(height, skipRefresh){
        Rui.ui.LScroller.superclass.setHeight.call(this, height);
        if(skipRefresh !== true)
            this.refresh();
    },
    /**
     * @description position 값을 설정한다.
     * @method setPosition
     * @private
     * @param {int} p position값 
     * @param {boolean} x [optional] x position을 변경할 지 여부
     * @return {void}
     */
    setPosition: function(p, x){
    	if(x) this.position.x = p;
    	else this.position.y = p;
    },
    /**
     * @description position 값을 반환한다.
     * @method getPosition
     * @private
     * @param {boolean} x [optional] x position을 변경할 지 여부
     * @return {int} x 또는 y position값
     */
    getPosition: function(x){
    	if(x) return this.position.x;
    	else return this.position.y;
    },
    /**
     * @description content에서 wheel사용시 처리하는 handler
     * @method onWheel
     * @private
     * @return {void}
     */
    onWheel: function(e){
        var p = e.target;
        //Webkit 계열은 target이 text인경우 (nodeType이 3이며 이경우 findParent로 DOM을 찾지 못한다.)
        if(p && p.nodeType == 3 && p.parentNode)
            p = p.parentNode;

        //contentEl 내에서 wheel 굴릴경우만 처리
        p = Rui.util.LDom.findParent(p, '#' + this.el.id, 20);
        if ((this.yScrollbarEl || this.xScrollbarEl) && p){
            var delta = 0, 
                deltaX = 0;
            if (!e) /* For IE. */ 
                e = window.event;
            if (e.wheelDelta){ /* IE/Opera. */
                delta = e.wheelDelta / 120;
                if(e.wheelDeltaX){
                    deltaX = e.wheelDeltaX / 120;
                    delta = 0;
                }
                /* In Opera 9, delta differs in sign as compared to IE.*/
                if (window.opera) 
                    delta = -delta;
            }else if (e.detail){ /* Mozilla case. */
                /* In Mozilla, sign of delta is different than in IE.
                * Also, delta is multiple of 3.
                */
                delta = -e.detail / 3;
            }
            if (delta){
                var scrollTop = this.getScrollTop(),
                    step = this.getStep(true);
                if (delta > 0){
                    //up
                    scrollTop = scrollTop <= step ? 0 : scrollTop - step;
                }else{
                    //down
                    scrollTop = scrollTop + step;
                }
                this.setScrollTop(scrollTop);
            }
            if (deltaX) {
                var scrollLeft = this.getScrollLeft(),
                    step = this.getStep(true, true);
                if (deltaX > 0) {
                    //right
                    scrollLeft = scrollLeft <= step ? 0 : scrollLeft - step;
                } else {
                    //left
                    scrollLeft = scrollLeft + step;
                }
                this.setScrollLeft(scrollLeft);
            }
            Rui.util.LEvent.preventDefault(e);
        }
    },
    /**
     * @description y scroll시 handler, scrollTop의 max값은 content height - scrollbar height
     * @method onScrollY
     * @private
     * @return {void}
     */
    onScrollY: function(e){
        if (!this.yScrollbarEl) 
            return;
        if(this.ignoreEvent === true) {
        	delete this.ignoreEvent;
        	return;
        }
        var scrollTop = (e && e.target) ? e.target.scrollTop : this.getScrollTop(),
            beforeScrollTop = this.scrollTop;
        if(scrollTop !== beforeScrollTop){
            this.scrollEl.dom.scrollTop = scrollTop * this.virtualScrollRate;
            this.scrollTop = scrollTop;
            if (beforeScrollTop || scrollTop){
                this.fireEvent('scrollY', {
                    target: this,
                    beforeScrollTop: beforeScrollTop,
                    scrollTop: scrollTop,
                    isFirst: scrollTop === 0 ? true : false,
                    isEnd: scrollTop >= this.getMaxScrollTop() ? true : false,
                    isUp: beforeScrollTop < scrollTop ? false : true
                });
            }
        }
    },
    /**
     * @description x scroll시 handler
     * @method onScrollX
     * @private
     * @return {void}
     */
    onScrollX: function(e){
        if (!this.xScrollbarEl)
            return;
        var scrollLeft = (e && e.target) ? e.target.scrollLeft : this.getScrollLeft();
            beforeScrollLeft = this.scrollLeft;
        if (beforeScrollLeft !== scrollLeft || (e && e.isForce)){
            this.scrollEl.dom.scrollLeft = scrollLeft;
            this.scrollLeft = scrollLeft;

            if (beforeScrollLeft || scrollLeft){
                this.fireEvent('scrollX', {
                    target: this,
                    beforeScrollLeft: beforeScrollLeft,
                    scrollLeft: scrollLeft
                });
            }
        }
    },
    /**
     * @description touch scroll start시 handler (mobile touch지원 브라우저)
     * @method onTouchStart
     * @private
     * @return {void}
     */
    onTouchStart: function(e){
    	if(this.useVirtual !== true) return;
        if(Rui.util.LDom.isAncestor(this.el.dom, e.target)){
        	if(e.touches && e.touches.length > 1) {
        		this.onTouchEnd(e);
        		return;
        	}
            var t = e.targetTouches ? e.targetTouches[0] : e;
            this.touchStart = true;
            this.touchStartXY = {x: t.pageX, y: t.pageY};
        }
    },
    /**
     * @description touch scroll move시 handler (mobile touch지원 브라우저)
     * @method onTouchMove
     * @private
     * @return {void}
     */
    onTouchMove: function(e){
    	if(this.useVirtual !== true) return;
        if(this.touchStart === true){
        	if(e.touches && e.touches.length > 1) {
        		this.onTouchEnd(e);
        		return;
        	}
            var t = e.targetTouches ? e.targetTouches[0] : e,
                mp = {
                    x: this.touchStartXY.x - (t.pageX),
                    y: this.touchStartXY.y - (t.pageY)
                },
                y = 0, x = 0;
            if(mp.y != 0){
                y = this.getScrollTop() + mp.y;
                this.setScrollTop(y);
            }
            if(mp.x != 0){
                x = this.getScrollLeft() + mp.x;
                this.setScrollLeft(x);
            }
            this.touchStartXY = {x: t.pageX, y: t.pageY};
            Rui.util.LEvent.preventDefault(e);
        }
    },
    /**
     * @description touch scroll end시 handler (mobile touch지원 브라우저)
     * @method onTouchEnd
     * @private
     * @return {void}
     */
    onTouchEnd: function(e){
    	if(this.useVirtual !== true) return;
        this.touchStart = null;
        this.touchStartXY = null;
    },
    /**
     * @description window resize시 handler, 새로 그린다.
     * @method refresh
     * @public
     * @return {void}
     */
    refresh: function(reset){
        if(this.useVirtual === true){
            this.setupSizes();
        }
        if(reset === true){
            this.goStart();
            this.goStart(true);
            this.position = {};
        }else{
            var y = this.getPosition(false),
                x = this.getPosition(true);
            if(!Rui.isEmpty(y))
                this.setScrollTop(y);
            if(!Rui.isEmpty(x))
                this.setScrollLeft(x);
        }
    },
    /**
     * @description window resize시 handler, 새로 그린다.
     * @method onResize
     * @private
     * @return {void}
     */
    onResize: function(e){
        this.refresh();
    },
    /**
     * @description 객체를 destroy하는 메소드
     * @method destroy
     * @public
     * @return {void}
     */
    destroy: function(){
        var Event = Rui.util.LEvent;
        Event.removeListener(window, 'resize', this.onResize);
        if(this.yVirtualContentEl){
            this.yVirtualContentEl.remove();
            this.yVirtualContentEl = null;
            delete this.yVirtualContentEl;
        }
        if(this.xVirtualContentEl){
            this.xVirtualContentEl.remove();
            this.xVirtualContentEl = null;
            delete this.xVirtualContentEl;
        }
        if(this.xScrollbarEl){
            if(this.xScrollbarEl.dom){
                Event.removeListener(this.xScrollbarEl.dom, 'scroll', this.onScrollX);
            }
            this.xScrollbarEl.remove();
            this.xScrollbarEl = null;
            delete this.xScrollbarEl;
        }
        if(this.yScrollbarEl){
            if(this.yScrollbarEl.dom){
                Event.removeListener(this.yScrollbarEl.dom, 'scroll', this.onScrollY);
            }
            this.yScrollbarEl.remove();
            this.yScrollbarEl = null;
            delete this.yScrollbarEl;
        }
        if(this.contentEl){
            this.contentEl.removeClass('L-scroll-content');
            if(this.el){
                this.el.appendChild(this.contentEl);
            }
        }
        if(this.wrapperEl){
            this.wrapperEl.remove();
            this.wrapperEl = null;
            delete this.wrapperEl;
        }
        if(this.scrollEl){
            this.scrollEl.remove();
            this.scrollEl = null;
            delete this.scrollEl;
        }
        if(this.el){
            if(Rui.browser.mozilla){
                Event.removeListener(this.el.dom, 'DOMMouseScroll', this.onWheel);
            }else{
                Event.removeListener(this.el.dom, 'mousewheel', this.onWheel);
            }
            this.el.removeClass('L-scroller');
            this.el.setStyle('width', '');
            this.el.setStyle('height', '');
        }
        this.fireEvent('destroy');
        this.unOnAll();
        if(this.cfg) {
            this.cfg.destroy();
            this.cfg = null;
        }
//        Rui.ui.LScroller.superclass.destroy.call(this);
    },
    /**
     * @description 객체 String
     * @method toString
     * @public
     * @return {String}
     */
    toString: function() {
        return this.otype + ' ' + this.id;
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
/**
 * Form
 * @module ui_form
 * @title Form
 * @requires Rui
 */
Rui.namespace('Rui.ui.form');

/**
 * LForm
 * @namespace Rui.ui.form
 * @class LForm
 * @extends Rui.ui.LUIComponent
 * @sample default
 * @constructor LForm
 * @param {Object} config The intial LForm.
 */
Rui.ui.form.LForm = function(id, config){
    this.id = id;
    config = config || {};
    config = Rui.applyIf(config, Rui.getConfig().getFirst('$.ext.form.defaultProperties'));
    Rui.ui.form.LForm.superclass.constructor.call(this, config);
    
    /**
     * @description Rui.validate.LValidatorManager 객체
     * <p>Sample: <a href="./../sample/general/ui/form/simpleFormSample.html" target="_sample">보기</a></p>
     * @config validatorManager
     * @type {Rui.validate.LValidatorManager}
     * @default null
     */
    /**
     * @description Rui.validate.LValidatorManager 객체
     * @property validatorManager
     * @private
     * @type {Rui.validate.LValidatorManager}
     */
    this.validatorManager = null;

    Rui.applyObject(this, config, true);
    
    // validatorManager 권장 안함.
    if(this.validatorManager == null && config.validators) {
       this.validatorManager = new Rui.validate.LValidatorManager({
            validators:config.validators
        });  
    }

    /**
     * @description Form 내부에서 사용하는 DataSetManager의 config
     * @config dataSetManagerOptions
     * @type {Object}
     * @default null
     */
    /**
     * @description Form 내부에서 사용하는 DataSetManager의 config
     * @property dataSetManagerOptions
     * @private
     * @type {Object}
     */
    /**
     * @description Rui.data.LDataSetManager 객체
     * @property dm
     * @private
     * @type {Rui.data.LDataSetManager}
     */
    this.dm = new Rui.data.LDataSetManager(this.dataSetManagerOptions);
    
    this.dm.on('upload', this.onUpload, this, true);
    this.dm.on('success', this.onSuccess, this, true);
    this.dm.on('failure', this.onFailure, this, true);
    
    /**
     * @description sumbit 실행전 호출되는 이벤트, 이벤트 리턴값이 false면 submit이 호출되지 않는다.
     * @event beforesubmit
     */
    this.createEvent('beforesubmit');

    /**
     * @description invalid가 발생하는 발생하는 이벤트
     * @event invalid
     * @param {Object} target this객체
     * @param {Array} invalidList invalid 객체 List
     */
    this.createEvent('invalid');
    
    /**
     * @description sumbit이 성공하면 발생하는 이벤트
     * @event success
     * @param {XMLHttpRequest} conn ajax response 객체
     */
    this.createEvent('success');
    
    /**
     * @description sumbit이 실패하면 발생하는 이벤트
     * @event failure
     * @param {XMLHttpRequest} conn ajax response 객체
     */
    this.createEvent('failure');
    
    /**
     * @description reset시 발생하는 이벤트
     * @event reset
     * @param {Rui.ui.form.LForm} target this객체
     */
    this.createEvent('reset');
};
Rui.extend(Rui.ui.form.LForm, Rui.ui.LUIComponent, {
    otype: 'Rui.ui.form.LForm',
    /**
     * @description Dom객체 생성 및 초기화하는 메소드
     * @method initComponent
     * @protected
     * @param {String|Object} el 객체의 아이디나 객체
     * @param {Object} config 환경정보 객체 
     * @return {void}
     */
    initComponent: function(config){
        var elList = Rui.select('form[name=' + this.id + ']');
        if(elList.length > 0)
            this.el = elList.getAt(0);
        else
            this.el = Rui.get(this.id);
    },
    /**
     * @description LValidatorManager 객체를 설정하는 메소드
     * @public
     * @method setValidatorManager
     * @param {Rui.validate.LValidatorManager} validatorManager Rui.validate.LValidatorManager 객체
     * @return {void}
     */
    setValidatorManager: function(validatorManager) {
        this.validatorManager = validatorManager;
    },
    /**
     * @description submit 메소드
     * @method submit
     * @public
     * @return {void}
     */
    submit: function() {
        if (this.fireEvent('beforesubmit', this) == false) return;
        if(this.validate()) {
            this.dm.updateForm({
                url: this.el.dom.action,
                form: this.id
            });
            return true;
        }
        return false;
    },
    /**
     * 성공시 발생하는 메소드
     * @method onSuccess
     * @private
     * @param {Object} e 성공시 Response객체
     * @return {void}
     */
    onSuccess: function(e) {
        this.fireEvent('success', e);
    },
    /**
     * 실패시 발생하는 메소드
     * @method onFailure
     * @private
     * @param {Object} e 실패시 Response객체
     * @return {void}
     */
    onFailure: function(e) {
        this.fireEvent('failure', e);
    },
    /**
     * upload시 발생하는 메소드(iframe타입이라 무조건 success를 리턴함.)
     * @method onUpload
     * @private
     * @param {Object} e Response객체
     * @return {void}
     */
    onUpload: function(e) {
        this.fireEvent('success', e);
    },
    /**
     * reset시 발생하는 메소드
     * @method onReset
     * @private
     * @return {void}
     */
    onReset: function() {
    },
    /**
     * reset 메소드
     * @method reset
     * @return {void}
     */
    reset: function() {
        this.el.dom.reset();
        this.fireEvent('reset', { target: this });
    },
    /**
     * validate 발생하는 메소드
     * @method validate
     * @private
     * @return {void}
     */
    validate: function() {
        if(this.validatorManager == null) return true;
        var isValid = this.validatorManager.validateGroup(this.id);

        if(isValid == false) {
            var invalidList = this.validatorManager.getInvalidList();
            this.fireEvent('invalid', {target:this, invalidList:invalidList, isValid:isValid});
        }
        return isValid;
    },
    /**
     * form 객체의 invalid된 모든 객체를 초기화 하는 메소드
     * @method clearInvalid
     * @public
     * @return {void}
     */
    clearInvalid: function() {
        var children = this._getChildList();
        var valid = true;
        Rui.util.LArray.each(children, function(f) {
            var child = Rui.get(f);
            child.valid();
        }, this);
    },
    /**
     * 배열 객체에 해당되는 모든 객체를 활성화 한다.
     * @method enable
     * @public
     * @param {Array} children enable할 배열 객체, 인수를 안 넘기면 모든 form객체 안의 child 모든 객체 자동 선택
     * @return {void}
     */
    enable: function(children) {
        children = Rui.isUndefined(children) ? this._getChildList() : children;
        Rui.util.LArray.each(children, function(f) {
            var child = Rui.get(f);
            if(child)
                child.enable();
        }, this);
    },
    /**
     * 배열 객체에 해당되는 모든 객체를 비활성화 한다.
     * @method disable
     * @public
     * @param {Array} children enable할 배열 객체, 인수를 안 넘기면 모든 form객체 안의 child 모든 객체 자동 선택
     * @return {void}
     */
    disable: function(children) {
        children = Rui.isUndefined(children) ? this._getChildList() : children;
        Rui.util.LArray.each(children, function(f) {
            var child = Rui.get(f);
            if(child)
                child.disable();
        }, this);
    },
    /**
     * 배열 객체에 해당되는 모든 객체중 비활성화가 하나라도 있으면 false를 리턴한다.
     * @method isDisable
     * @public
     * @param {Array} children enable할 배열 객체, 인수를 안 넘기면 모든 form객체 안의 child 모든 객체 자동 선택
     * @return {void}
     */
    isDisable: function(children) {
        var isDisable = false;
        children = Rui.isUndefined(children) ? this._getChildList() : children;
        Rui.util.LArray.each(children, function(f) {
            var child = Rui.get(f);
            if(child) {
                isDisable = child.isDisable();
                return;
            }
        }, this);
        return isDisable;
    },
    /**
     * form 객체에 안에 있는 child객체 배열
     * @method getValues
     * @public
     * @return {Array}
     */
    getValues: function() {
        var obj = {};
        var children = this._getChildList();
        Rui.util.LArray.each(children, function(child) {
            var f = Rui.get(child);
            var dom = f.dom;
            var name = dom.name || dom.id;
            var value = f.get('value');
            if(dom.type == 'checkbox' || dom.type == 'radio'){
                if(dom.checked === true)
                    obj[name] = value;
            }else{
                obj[name] = value;
            }
            /*
            if (typeof dom.checked == 'boolean') {
                if (/LRadio/.test(dom.declaredClass)) {
                    if (value !== false) {
                        obj[name] = value;
                    }
                } else {
                    var ary = obj[name];
                    if (!ary) {
                        ary = [];
                        obj[name] = ary;
                    }
                    if (value !== false) {
                        ary.push(value);
                    }
                }
            } else {
                obj[name] = value;
            }*/
        }, this);
        return obj;
    },
    /**
     * form 객체에 안에 있는 child객체에 모든 값 대입
     * @method setValues
     * @public
     * @param {Array} values values에 해당되는 모든 객체에 값 대입
     * @return {void}
     */
    setValues: function(values) {
        var children = this._getChildList();
        Rui.util.LArray.each(children, function(child) {
            var el = Rui.get(child), 
                dom = el.dom,
                name = dom.name || dom.id,
                value = values[name];
            if(value){
                if(dom.type == 'radio' || dom.type == 'checkbox'){
                    dom.checked = (dom.value == value ? true : false);
                }else{
                    el.setValue(value);
                }
            }
        }, this);
    },
    /**
     * form 객체에 안에 있는 child객체중에 ID에 해당되는 객체를 찾아서 리턴한다.
     * @method findField
     * @public
     * @param {String} id 검색할 ID 값
     * @return {HTMLElement} 검색된 결과 객체
     */
    findField: function(id) {
        var field = null;
        var children = this._getChildList();
        Rui.util.LArray.each(children, function(child) {
            var f = Rui.get(child);
            if(f.dom.id == id || f.dom.name == id) {
                field = f.dom;
                return false;
            }
        }, this);
        
        return field;
    },
    /**
     * form 객체에 안에 있는 child객체중에 invalid객체가 존재하면 false를 리턴한다.
     * @method isValid
     * @public
     * @return {boolean} valid 여부
     */
    isValid: function() {
        var isValid = true;
        var children = this._getChildList();
        Rui.util.LArray.each(children, function(f) {
            var element = Rui.get(f);
            if(element.isValid() == false) {
                isValid = false;
                return false;
            }
        }, this);
        return isValid;
    },
    /**
     * form 객체 destroy
     * @method destroy
     * @public
     * @return {void}
     */
    destroy: function(){
        this.unOnAll();
    },
    /**
     * Record객체를 form 객체의 child객체에 반영한다.
     * @public
     * @method updateRecord
     * @param {Rui.data.LRecord} record form객체에 반영할 Record객체
     * @return {void}
     */
    updateRecord: function(record) {
        var o = record.getValues();
        this.setValues(o);
    },
    /**
     * form 객체의 child 정보를 Record객체에 반영한다.
     * @public
     * @method loadRecord
     * @param {Rui.data.LRecord} record form객체의 정보를 반영할 Record객체
     * @return {Rui.data.LRecord} 반영된 Record객체
     */
    loadRecord: function(record) {
        var o = this.getValues();
        record.setValues(o);
        return record;
    },
    /**
     * form 객체의 입력 가능한 child 정보를 리턴한다.
     * @private 
     * @method _getChildList
     * @return {Rui.LElementList} 반영된 ElementList객체
     */
    _getChildList: function() {
        return Rui.util.LDomSelector.query('input,select,textarea', this.el.dom);
    }
});

/**
 * @description RUI에서 메뉴 인터페이스를 콤포넌트로 지원되게 하는 클래스(Beta)
 * @module ui
 * @title LActionMenuSupport
 */
(function() {
    var Ev = Rui.util.LEvent;
    /**
     * @description RUI에서 메뉴 인터페이스를 콤포넌트로 지원되게 하는 클래스(Beta)
     * @namespace Rui.ui
     * @class LActionMenuSupport
     * @constructor LActionMenuSupport
     * @param {Object} oConfig The intial LActionMenuSupport.
     */
    Rui.ui.LActionMenuSupport = function(oConfig) {
    };
    
    Rui.ui.LActionMenuSupport = {
    	createActionMenu: function(gridPanel) {
    		if(gridPanel.useActionMenu == false) return;
    		// 차후 observer 패턴 적용 필요
    		var actionMenuGrid = new Rui.ui.grid.LActionMenuGrid({
    			gridPanel: gridPanel
    		});

    		//나중에 패널로 랜더링시점을 옮겨야함.
        	gridPanel.el.on('touchstart', function(e){
            	if(e.touches && e.touches.length < 3) return;
            	this.showTabletViewer();
        	}, gridPanel, true);

    		gridPanel.on('cellMouseDown', actionMenuGrid.onCellMouseDown, actionMenuGrid, true, { system: true });
        	actionMenuGrid.el.setAttribute('data-menu-type', 'left');
        	
        	gridPanel.on('cellclick', function(e) {
        		actionMenuGrid.setXY([Ev.getPageX(e.event), Ev.getPageY(e.event)]);
        	})

    		return actionMenuGrid;
    	}
    };
})();
(function() {
	var Ev = Rui.util.LEvent;
    /**
     * @description 마우스나 키보드를 적용하는 action 메뉴를 출력한다.
     * @namespace Rui.ui
     * @class LActionMenu
     * @constructor LActionMenu
     * @param {Object} oConfig The intial LActionMenu.
     */
    Rui.ui.LActionMenu = function(oConfig) {
    	Rui.applyObject(this, oConfig, true);
    	this.createContainer();
    	this.gridPanel.on('cellClick', this.onCellClick, this, true);
    };
    
    Rui.ui.LActionMenu.prototype = {
    	createContainer: function() {
    		var master = new Rui.LTemplate(
    			'<div class="L-{cssBase} L-hide-display">',
    			'<ul>{menuList}</ul>',
    			'</div>'
    		);
    		
    		var mm = Rui.getMessageManager();
    		
    		var menuList = new Rui.LTemplate(
    			'<li class="L-action-menu-li L-menu-type-left L-hide-display L-mobile-menu"><span class="L-action-menu-item L-fn-on-dbl-click L-ignore-blur">{menuName}</span></li>',
    			'<li class="L-action-menu-li L-menu-type-left L-hide-display L-mobile-menu L-tablet-mode-{tabletMode}"><span class="L-action-menu-item L-fn-on-tablet-click L-ignore-blur">{tabletName}</span></li>',
    			'<li class="L-action-menu-li-hr L-menu-type-left L-hide-display L-mobile-menu"> </li>',
    			'<li class="L-action-menu-li L-menu-type-right"><span class="L-action-menu-item L-fn-on-sum-click L-ignore-blur">{sumName}</span></li>',
    			'<li class="L-action-menu-li-hr L-menu-type-left"> </li>',
    			'<li class="L-action-menu-li L-menu-type-right"><span class="L-action-menu-item L-fn-on-clipboard-copy L-ignore-blur">{clipboardCopy}</span></li>',
    			'<li class="L-action-menu-li-hr L-menu-type-left"> </li>',
    			'<li class="L-action-menu-li L-menu-type-right"><span class="L-action-menu-item L-fn-on-clipboard-paste L-ignore-blur">{clipboardPaste}</span></li>'
    		);
    		
    		var menuListHtml = '';
    		menuListHtml += menuList.apply({ 
    			tabletMode: this.gridPanel.tabletMode,
    			menuName: 'Cell Double Click',
    			tabletName: 'Tablet Mode',
    			sumName: mm.get('$.base.msg139'),
    			clipboardCopy: mm.get('$.base.msg128'),
    			clipboardPaste: mm.get('$.base.msg129')
    		});
    		
    		this.el = Rui.createElements(master.apply({ cssBase: this.CSS_BASE, menuList: menuListHtml })).getAt(0);
    		this.el.on('click', this.invokeClick, this, true);
    		Rui.util.LEvent.addListener(Rui.browser.msie ? document.body : document, 'mousedown', this.deferOnBlur, this, true);
    		Rui.getBody().appendChild(this.el);
    		if(Rui.platform.isMobile)
    			this.el.select('.L-mobile-menu').show();
    	},
    	deferOnBlur: function(e) {
            Rui.util.LFunction.defer(this.checkBlur, 10, this, [e]);
        },
        checkBlur:function(e) {
            if(e.deferCancelBubble == true || this.isFocus !== true) return;
            var target = e.target;
            if(!(this.gridPanel.el.isAncestor(target) || this.el.isAncestor(target)))
                this.hideActionMenu();         
        },
    	hideActionMenu: function(e) {
    		this.el.hide();
    	},
    	setXY: function(xy) {
    		xy[0] -= 70;
    		xy[1] -= 100;
    		this.el.setXY(xy);
    	},
    	onCellClick: function(e) {
    		if(!Rui.platform.isMobile) return;
    		this.el.setAttribute('data-menu-type', 'left');
    		var x = Ev.getPageX(e.event), y = Ev.getPageY(e.event);
    		this.el.show();
    		this.setXY([x, y]);
    	},
    	onCellMouseDown: function(e) {
            var gridPanel = this.gridPanel;
        	if((e.event.button === 2 || e.event.button === 3) && gridPanel.useRightActionMenu) {
        		this.el.setAttribute('data-menu-type', 'right');
        		this.el.show();
        		this.setXY([Ev.getPageX(e.event), Ev.getPageY(e.event)])
        	}
    	},
    	invokeClick: function(e) {
    		Rui.util.LDom.invokeFn(e.target, this, e);
    	},
    	onDblClick: function(e) {
    	},
    	onTabletClick: function(e) {
    		this.gridPanel.showTabletViewer();
    	}
    };
})();