/*
 * @(#) rui_fx-debug.js
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
Rui.namespace('Rui.fx');

/**
 * HTMLElement에 animation 효과주는 class
 * @module animation
 * @requires event, dom
 */

/**
 * Base animation class는 animation효과들을 주는 interface를 제공한다.
 * <p>Usage: var myAnim = new Rui.fx.LAnim(el, { width: { from: 10, to: 100 } }, 1, Rui.fx.LEasing.easeOut);</p>
 * @class LAnim
 * @namespace Rui.fx
 * @requires Rui.fx.LAnimManager
 * @requires Rui.fx.LEasing
 * @requires Rui.util.LEventProvider
 * @constructor
 * @param {String | HTMLElement} el animation효과가 적용될 element
 * @param {Object} attributes animation효과 관련 attribute, 각 attribute는 object로 to나 by가 정의되어 있다. 이외에 from, units(px)가 있으며 camelCase로 표기한다.  
 * @param {Number} duration (optional, defaults to 1 second) Length of animation (frames or seconds), defaults to time-based
 * @param {Function} method (optional, defaults to Rui.fx.LEasing.easeNone) Computes the values that are applied to the attributes per frame (generally a Rui.fx.LEasing method)
 */
Rui.fx.LAnim = function(config) {
    config = config || {};
    //for Simple Syntax
    if(config.applyTo)
        config.el = config.applyTo;

    this.init(config);
    /**
     * @description animation이 시작되면 호출되는 이벤트
     * @event start
     */
    this.createEvent('start');
    /**
     * @description animation의 매 frame마다 호출되는 이벤트
     * @event tween
     */
    this.createEvent('tween');
    /**
     * @description animation이 종료되면 호출되는 이벤트
     * @event complete
     */
    this.createEvent('complete');

};

Rui.extend(Rui.fx.LAnim, Rui.util.LEventProvider, {
    otype: 'Rui.fx.LAnim',
    patterns: { // cached for performance
        noNegatives: /width|height|opacity|padding/i, // keep at zero or above
        offsetAttribute: /^((width|height)|(top|left))$/, // use offsetValue as default
        defaultUnit: /width|height|top$|bottom$|left$|right$/i, // use 'px' by default
        offsetUnit: /\d+(em|%|en|ex|pt|in|cm|mm|pc)$/i // IE may return these, so convert these to offset
    },
    /**
     * animation의 'method'에 의해 계산된 값을 return
     * @method doMethod
     * @protected
     * @param {String} attr The name of the attribute.
     * @param {Number} start The value this attribute should start from for this animation.
     * @param {Number} end  The value this attribute should end at for this animation.
     * @return {Number} The Value to be applied to the attribute.
     */
    doMethod: function(attr, start, end) {
        return this.method(this.currentFrame, start, end - start, this.totalFrames);
    },
    /**
     * attribute에 값 설정
     * @method setAttribute
     * @protected
     * @param {String} attr attribute명.
     * @param {Number} val attribute에 할당될 값.
     * @param {String} unit 값의 unit ('px', '%', etc.)
     */
    setAttribute: function(attr, val, unit) {
        if ( this.patterns.noNegatives.test(attr) ) {
            val = (val > 0) ? val : 0;
        }
        Rui.util.LDom.setStyle(this.getEl(), attr, val + unit);
    },
    /**
     * attribute의 값 return.
     * @method getAttribute
     * @protected
     * @param {String} attr attribute명
     * @return {Number} val 값
     */
    getAttribute: function(attr) {
        var el = this.getEl();
        var val = Rui.util.LDom.getStyle(el, attr);

        if (val !== 'auto' && !this.patterns.offsetUnit.test(val)) {
            return parseFloat(val);
        }
        
        var a = this.patterns.offsetAttribute.exec(attr) || [];
        var pos = !!( a[3] ); // top or left
        var box = !!( a[2] ); // width or height
        
        // use offsets for width/height and abs pos top/left
        if ( box || (Rui.util.LDom.getStyle(el, 'position') == 'absolute' && pos) ) {
            val = el['offset' + a[0].charAt(0).toUpperCase() + a[0].substr(1)];
        } else { // default to zero for other 'auto'
            val = 0;
        }

        return val;
    },
    /**
     * 기본 unit
     * @method getDefaultUnit
     * @private
     * @param {attr} attr attribute명
     * @return {String} 기본 unit
     */
    getDefaultUnit: function(attr) {
        if ( this.patterns.defaultUnit.test(attr) ) {
           return 'px';
        }
        return '';
    },
    /**
     * animation동안 사용될 실제 값들. subclass를 사용할때만 사용됨.
     * @method setRuntimeAttribute
     * @protected 
     * @param {Object} attr attribute object
     */
    setRuntimeAttribute: function(attr) {
        var start;
        var end;
        var attributes = this.attributes;

        this.runtimeAttributes[attr] = {};
        
        var isset = function(prop) {
            return (typeof prop !== 'undefined');
        };
        
        if ( !isset(attributes[attr]['to']) && !isset(attributes[attr]['by']) ) {
            return false; // note return; nothing to animate to
        }
        
        start = ( isset(attributes[attr]['from']) ) ? attributes[attr]['from'] : this.getAttribute(attr);

        // To beats by, per SMIL 2.1 spec
        if ( isset(attributes[attr]['to']) ){
            end = attributes[attr]['to'];
        }else if( isset(attributes[attr]['by']) ){
            if (start.constructor == Array) {
                end = [];
                for (var i = 0, len = start.length; i < len; ++i) {
                    end[i] = start[i] + attributes[attr]['by'][i] * 1; // times 1 to cast 'by' 
                }
            } else {
                end = start + attributes[attr]['by'] * 1;
            }
        }
        
        this.runtimeAttributes[attr].start = start;
        this.runtimeAttributes[attr].end = end;

        // set units if needed
        this.runtimeAttributes[attr].unit = ( isset(attributes[attr].unit) ) ? attributes[attr]['unit'] : this.getDefaultUnit(attr);
        return true;
    },

    /**
     * Constructor for LAnim instance.
     * @method init
     * @private
     * @param {String | HTMLElement} el animate될 element
     * @param {Object} attributes animation효과 관련 attribute, 각 attribute는 object로 to나 by가 정의되어 있다. 이외에 from, units(px)가 있으며 camelCase로 표기한다.
     * @param {Number} duration (optional, defaults to 1 second) Length of animation (frames or seconds), defaults to time-based
     * @param {Function} method (optional, defaults to Rui.fx.LEasing.easeNone) Computes the values that are applied to the attributes per frame (generally a Rui.fx.LEasing method)
     */ 
    init: function(config) {
        /**
         * animation이 작동될 지 여부
         * @property isAnimated
         * @private
         * @type Boolean
         */
        var isAnimated = false;
        /**
         * animation 시작시 생성되는 date object
         * @property startTime
         * @private
         * @type Date
         */
        var startTime = null;
        /**
         * animation 실행시 보여질 frame 수
         * @property actualFrames
         * @private
         * @type Int
         */
        var actualFrames = 0; 
        /**
         * animate될 element
         * @property el
         * @private
         * @type HTMLElement
         */
        var el = config.el ? Rui.util.LDom.get(config.el) : null;
        /**
         * animate될 attribute들의 collection  
         * 각 attribute들은 적어도 'to' 또는 'by'가 정의되어 있어야 한다.  
         * 'to'를 설정하면 해당 값으로 animation이 끝난다.  
         * 'by'를 설정하면 시작값에 해당 값을 더해서 animation이 끝난다. 
         * 둘다 설정하면 'to'만 사용되고 'by'는 무시된다. 
         * option으로 'from'은 animation시작값으로 기본값은 현재 값이다. 그리고 'unit'은 값들의 단위를 지정한다.
         * @property attributes
         * @private
         * @type Object
         */
        this.attributes = config.attributes || {};
        /**
         * animation 시간으로 기본값은 '1'(초)
         * @property duration
         * @private
         * @type Number
         */
        this.duration = !Rui.isUndefined(config.duration) ? config.duration : 1;
        /**
         * animation동안 attribute에 제공될 값을 만드는 method 
         * Default는 'Rui.fx.LEasing.easeNone'.
         * @property method
         * @private
         * @type Function
         */
        this.method = config.method || Rui.fx.LEasing.easeNone;
        /**
         * duration에 초를 사용할 지 여부
         * Defaults to true.
         * @property useSeconds
         * @private
         * @type Boolean
         */
        this.useSeconds = true; // default to seconds
        /**
         * timeline에서 현재 animation의 위치
         * time-based animation에서 LAnimManager에 의해 animation이 제시간에 끝났는지 확인용으로 사용된다.
         * @property currentFrame
         * @private
         * @type Int
         */
        this.currentFrame = 0;
        /**
         * 실행될 총 frame수
         * time-based animation에서 LAnimManager에 의해 animation이 제시간에 끝났는지 확인용으로 사용된다.
         * @property totalFrames
         * @private
         * @type Int
         */
        this.totalFrames = Rui.fx.LAnimManager.fps;
        /**
         * animate될 element를 변경한다.
         * @method setEl
         * @protected
         * @param {HTMLElement} el
         */
        this.setEl = function(element) {
            el = Rui.util.LDom.get(element);
        };
        /**
         * animate될 element를 return
         * @method getEl
         * @protected
         * @return {HTMLElement}
         */
        this.getEl = function() { return el; };
        /**
         * animate되고 있는지 여부 return
         * @method isAnimated
         * @protected
         * @return {boolean} isAnimated의 현재 값     
         */
        this.isAnimated = function() {
            return isAnimated;
        };
        /**
         * animation 시작 시간 return
         * @method getStartTime
         * @protected
         * @return {Date} 시작시간      
         */
        this.getStartTime = function() {
            return startTime;
        };        
        this.runtimeAttributes = {};
        /**
         * animation manager에 등록하면서 animation을 시작한다. 
         * @method animate
         */
        this.animate = function() {
            if ( this.isAnimated() || !el) {
                return false;
            }
            
            this.currentFrame = 0;
            
            this.totalFrames = ( this.useSeconds ) ? Math.ceil(Rui.fx.LAnimManager.fps * this.duration) : this.duration;
    
            if (this.duration === 0 && this.useSeconds) { // jump to last frame if zero second duration 
                this.totalFrames = 1; 
            }
            Rui.fx.LAnimManager.registerElement(this);
            return true;
        };
        /**
         * animation을 정지한다.  일반적으로 animation이 끝났을 경우 LAnimManager에 의해 call된다.
         * @method stop
         * @param {boolean} finish (optional) true면 마지막 frame로 이동한다.
         */ 
        this.stop = function(finish) {
            if (!this.isAnimated()) { // nothing to stop
                return false;
            }

            if (finish) {
                 this.currentFrame = this.totalFrames;
                 this.tween();
            }
            Rui.fx.LAnimManager.stop(this);
        };
        /**
         * animation을 시작한다.
         * @method start
         * @protected
         */
        this.start = function() {
            this.fireEvent('start');
            
            this.runtimeAttributes = {};
            for (var attr in this.attributes) {
                this.setRuntimeAttribute(attr);
            }
            
            isAnimated = true;
            actualFrames = 0;
            startTime = new Date(); 
        };
        /**
         * 각각의 animated attribute에 대한 시작값, 종료값을 각 프레임 별로 넣고, 결과값을 각 attribute에 적용한다.
         * @protected
         */
        this.tween = function() {
            var data = {
                duration: new Date() - this.getStartTime(),
                currentFrame: this.currentFrame
            };
            
            data.toString = function() {
                return (
                    'duration: ' + data.duration +
                    ', currentFrame: ' + data.currentFrame
                );
            };
            
            this.fireEvent('tween', data);
            
            var runtimeAttributes = this.runtimeAttributes;
            
            for (var attr in runtimeAttributes) {
                this.setAttribute(attr, this.doMethod(attr, runtimeAttributes[attr].start, runtimeAttributes[attr].end), runtimeAttributes[attr].unit); 
            }
            
            actualFrames += 1;
        };
        /**
         * animation을 종료한다.
         * @method complete
         * @protected
         */
        this.complete = function() {
            var actual_duration = (new Date() - startTime) / 1000 ;
            
            var data = {
                duration: actual_duration,
                frames: actualFrames,
                fps: actualFrames / actual_duration
            };
            
            data.toString = function() {
                return (
                    'duration: ' + data.duration +
                    ', frames: ' + data.frames +
                    ', fps: ' + data.fps
                );
            };
            
            isAnimated = false;
            actualFrames = 0;
            this.fireEvent('complete', data);
        };
    },
    /**
     * LAnim instance에 대한 이름
     * @method toString
     * @public
     * @return {String}
     */
    toString: function() {
        var el = this.getEl() || {};
        var id = el.id || el.tagName;
        return (this.otype + ': ' + id);
    }
});

/**
 * animation과 theading 처리
 * LAnim과 subclass 들에서 사용됨
 * @class LAnimManager
 * @private
 * @static
 * @namespace Rui.fx
 */
Rui.fx.LAnimManager = new function() {
    /** 
     * animation Interval을 위한 참조값.
     * @property thread
     * @private
     * @type Int
     */
    var thread = null;
    /** 
     * 등록된 animation object들 중 현재 queue object.
     * @property queue
     * @private
     * @type Array
     */    
    var queue = [];
    /** 
     * 활성화(active)된 animation 갯수.
     * @property tweenCount
     * @private
     * @type Int
     */        
    var tweenCount = 0;
    /** 
     * 기본 frame 비율 (frames per second).
     * 더 나은 x-browser calibration을 위해 임의로 증가(느린 브라우저들은 frame이 더 떨어짐)
     * @property fps
     * @type Int
     * 
     */
    this.fps = 1000;
    /** 
     * milliseconds 단위의 지연 간격, 가능한 가장 빠른 속도로 deafult 설정된다.
     * @property delay
     * @private
     * @type Int
     */
    this.delay = 1;
    /**
     * animation queue에 animation instance를 추가한다. 
     * 모든 animation instance는 움직이기 위해 반드시 등록되어야 한다.
     * @method registerElement
     * @private
     * @param {object} tween 등록될 LAnim instance 객체 
     */
    this.registerElement = function(tween) {
        queue[queue.length] = tween;
        tweenCount += 1;
        tween.start();
        this.start();
    };
    /**
     * animation queue로 부터 animation instace를 제거한다.
     * 모든 animation instance는 움직이기 위해 반드시 등록되어야 한다.
     * @method unRegister
     * @private
     * @param {object} tween 등록된 LAnim instance 객체 
     * @param {int} index LAnim instance의 index
     */
    this.unRegister = function(tween, index) {
        index = index || getIndex(tween);
        if (!tween.isAnimated() || index == -1) {
            return false;
        }
        tween.complete();
        queue.splice(index, 1);
        tweenCount -= 1;
        if (tweenCount <= 0) {
            this.stop();
        }
        return true;
    };
    /**
     * animation thread를 시작한다.
     * 한번에 오직 하나의 thread만 실행할 수 있다.
     * @method start
     * @protected
     */    
    this.start = function() {
        if (thread === null) {
            thread = setInterval(this.run, this.delay);
        }
    };
    /**
     * animation thread나 특정 animation instance를 중지한다.
     * @method stop
     * @protected
     * @param {object} tween 중지할 특정 LAnim instance(optional)
     * 만약 instance가 주어지지 않는다면, Manager는 thread와 모든 animation을 중지한다.
     */    
    this.stop = function(tween) {
        if (!tween) {
            clearInterval(thread);
            for (var i = 0, len = queue.length; i < len; ++i) {
                this.unRegister(queue[0], 0);  
            }
            queue = [];
            thread = null;
            tweenCount = 0;
        } else {
            this.unRegister(tween);
        }
    };
    /**
     * 각각의 animation frame를 처리하는 간격마다 호출된다.
     * @method run
     * @private
     */    
    this.run = function() {
        for (var i = 0, len = queue.length; i < len; ++i) {
            var tween = queue[i];
            if (!tween || !tween.isAnimated()) { continue; }
            if (tween.currentFrame < tween.totalFrames || tween.totalFrames === null){
                tween.currentFrame += 1;
                if(tween.useSeconds){
                    correctFrame(tween);
                }
                tween.tween();
            }else{ 
                Rui.fx.LAnimManager.stop(tween, i);
            }
        }
    };
    var getIndex = function(anim) {
        for (var i = 0, len = queue.length; i < len; ++i) {
            if (queue[i] == anim) {
                return i; // note return;
            }
        }
        return -1;
    };
    /**
     * animation을 제시간으로 유지하기 위한 fly frame correction.
     * @method correctFrame
     * @private
     * @param {Object} tween The LAnim instance being corrected.
     */
    var correctFrame = function(tween) {
        var frames = tween.totalFrames;
        var frame = tween.currentFrame;
        var expected = (tween.currentFrame * tween.duration * 1000 / tween.totalFrames);
        var elapsed = (new Date() - tween.getStartTime());
        var tweak = 0;
        
        if (elapsed < tween.duration * 1000) { // check if falling behind
            tweak = Math.round((elapsed / expected - 1) * tween.currentFrame);
        } else { // went over duration, so jump to end
            tweak = frames - (frame + 1); 
        }
        if (tweak > 0 && isFinite(tweak)) { // adjust if needed
            if (tween.currentFrame + tweak >= frames) {// dont go past last frame
                tweak = frames - (frame + 1);
            }
            tween.currentFrame += tweak;      
        }
    };
};

/**
 * 처음부터 끝까지 어떻게 animation을 진행할지 결정하는 Singleton 패턴
 * @class LEasing
 * @namespace Rui.fx
 * @static
*/
Rui.fx.LEasing = {
    /**
     * point들 간의 speed를 통일한다. 
     * @method easeNone
     * @static
     * @param {Number} t 현재값을 계산하기 위해 사용되는 시간값
     * @param {Number} b 시작값
     * @param {Number} c 시작값과 종료값 사이의 Delta
     * @param {Number} d animation 총 길이
     * @return {Number} 현재 animation 프레임에 대한 계산된 값
     */
    easeNone: function (t, b, c, d) {
        return c*t/d + b;
    },
    /**
     * 끝쪽을 향하여 천천히 가속하기 시작한다.
     * @method easeIn
     * @static
     * @param {Number} t 현재값을 계산하기 위해 사용되는 시간값
     * @param {Number} b 시작값
     * @param {Number} c 시작값과 종료값 사이의 Delta
     * @param {Number} d animation 총 길이
     * @return {Number} 현재 animation 프레임에 대한 계산된 값
     */
    easeIn: function (t, b, c, d) {
        return c*(t/=d)*t + b;
    },
    /**
     * 끝쪽을 향하여 빠르게 감속하기 시작한다.
     * @method easeOut
     * @static
     * @param {Number} t 현재값을 계산하기 위해 사용되는 시간값
     * @param {Number} b 시작값
     * @param {Number} c 시작값과 종료값 사이의 Delta
     * @param {Number} d animation 총 길이
     * @return {Number} 현재 animation 프레임에 대한 계산된 값
     */
    easeOut: function (t, b, c, d) {
        return -c *(t/=d)*(t-2) + b;
    },
    /**
     * 끝쪽을 향하여 천천히 감속하기 시작한다.
     * @method easeBoth
     * @static
     * @param {Number} t 현재값을 계산하기 위해 사용되는 시간값
     * @param {Number} b 시작값
     * @param {Number} c 시작값과 종료값 사이의 Delta
     * @param {Number} d animation 총 길이
     * @return {Number} 현재 animation 프레임에 대한 계산된 값
     */
    easeBoth: function (t, b, c, d) {
        if ((t/=d/2) < 1) {
            return c/2*t*t + b;
        }
        return -c/2 * ((--t)*(t-2) - 1) + b;
    },
    /**
     * 끝쪽을 향하여 천천히 가속하기 시작한다.
     * @method easeInStrong
     * @static
     * @param {Number} t 현재값을 계산하기 위해 사용되는 시간값
     * @param {Number} b 시작값
     * @param {Number} c 시작값과 종료값 사이의 Delta
     * @param {Number} d animation 총 길이
     * @return {Number} 현재 animation 프레임에 대한 계산된 값
     */
    easeInStrong: function (t, b, c, d) {
        return c*(t/=d)*t*t*t + b;
    },
    /**
     * 끝쪽을 향하여 빠르게 감속하기 시작한다. 
     * @method easeOutStrong
     * @static
     * @param {Number} t 현재값을 계산하기 위해 사용되는 시간값
     * @param {Number} b 시작값
     * @param {Number} c 시작값과 종료값 사이의 Delta
     * @param {Number} d animation 총 길이
     * @return {Number} 현재 animation 프레임에 대한 계산된 값
     */
    easeOutStrong: function (t, b, c, d) {
        return -c * ((t=t/d-1)*t*t*t - 1) + b;
    },
    /**
     * 끝쪽을 향하여 천천히 감속하기 시작한다.
     * @method easeBothStrong
     * @static
     * @param {Number} t 현재값을 계산하기 위해 사용되는 시간값
     * @param {Number} b 시작값
     * @param {Number} c 시작값과 종료값 사이의 Delta
     * @param {Number} d animation 총 길이
     * @return {Number} 현재 animation 프레임에 대한 계산된 값
     */
    easeBothStrong: function (t, b, c, d) {
        if ((t/=d/2) < 1) {
            return c/2*t*t*t*t + b;
        }
        return -c/2 * ((t-=2)*t*t*t - 2) + b;
    },
    /**
     * 탄성 효과 snap in
     * @method elasticIn
     * @static
     * @param {Number} t 현재값을 계산하기 위해 사용되는 시간값
     * @param {Number} b 시작값
     * @param {Number} c 시작값과 종료값 사이의 Delta
     * @param {Number} d animation 총 길이
     * @param {Number} a 진폭 (optional)
     * @param {Number} p 주기 (optional)
     * @return {Number} 현재 animation 프레임에 대한 계산된 값
     */
    elasticIn: function (t, b, c, d, a, p) {
        if (t == 0) {
            return b;
        }
        if ( (t /= d) == 1 ) {
            return b+c;
        }
        if (!p) {
            p=d*.3;
        }
        var s;
        if (!a || a < Math.abs(c)) {
            a = c; 
            s = p/4;
        } else {
            s = p/(2*Math.PI) * Math.asin (c/a);
        }
        return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
    },
    /**
     * 탄성 효과 snap out
     * @method elasticOut
     * @static
     * @param {Number} t 현재값을 계산하기 위해 사용되는 시간값
     * @param {Number} b 시작값
     * @param {Number} c 시작값과 종료값 사이의 Delta
     * @param {Number} d animation 총 길이
     * @param {Number} a 진폭 (optional)
     * @param {Number} p 주기 (optional)
     * @return {Number} 현재 animation 프레임에 대한 계산된 값
     */
    elasticOut: function (t, b, c, d, a, p) {
        if (t == 0) {
            return b;
        }
        if ( (t /= d) == 1 ) {
            return b+c;
        }
        if (!p) {
            p=d*.3;
        }
        var s;
        if (!a || a < Math.abs(c)) {
            a = c;
            s = p / 4;
        } else {
            s = p/(2*Math.PI) * Math.asin (c/a);
        }
        return a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b;
    },
    /**
     * 탄성 효과 snap both
     * @method elasticBoth
     * @static
     * @param {Number} t 현재값을 계산하기 위해 사용되는 시간값
     * @param {Number} b 시작값
     * @param {Number} c 시작값과 종료값 사이의 Delta
     * @param {Number} d animation 총 길이
     * @param {Number} a 진폭 (optional)
     * @param {Number} p 주기 (optional)
     * @return {Number} 현재 animation 프레임에 대한 계산된 값
     */
    elasticBoth: function (t, b, c, d, a, p) {
        if (t == 0) {
            return b;
        }
        if ( (t /= d/2) == 2 ) {
            return b+c;
        }
        if (!p) {
            p = d*(.3*1.5);
        }
        var s;
        if ( !a || a < Math.abs(c) ) {
            a = c; 
            s = p/4;
        } else {
            s = p/(2*Math.PI) * Math.asin (c/a);
        }
        if (t < 1) {
            return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
        }
        return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
    },
    /**
     * Backtracks slightly, then reverses direction and moves to end.
     * @method backIn
     * @static
     * @param {Number} t 현재값을 계산하기 위해 사용되는 시간값
     * @param {Number} b 시작값
     * @param {Number} c 시작값과 종료값 사이의 Delta
     * @param {Number} d animation 총 길이
     * @param {Number} s Overshoot (optional)
     * @return {Number} 현재 animation 프레임에 대한 계산된 값
     */
    backIn: function (t, b, c, d, s) {
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        return c*(t/=d)*t*((s+1)*t - s) + b;
    },
    /**
     * Overshoots end, then reverses and comes back to end.
     * @method backOut
     * @static
     * @param {Number} t 현재값을 계산하기 위해 사용되는 시간값
     * @param {Number} b 시작값
     * @param {Number} c 시작값과 종료값 사이의 Delta
     * @param {Number} d animation 총 길이
     * @param {Number} s Overshoot (optional)
     * @return {Number} 현재 animation 프레임에 대한 계산된 값
     */
    backOut: function (t, b, c, d, s) {
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    },
    /**
     * Backtracks slightly, then reverses direction, overshoots end, 
     * then reverses and comes back to end.
     * @method backBoth
     * @static
     * @param {Number} t 현재값을 계산하기 위해 사용되는 시간값
     * @param {Number} b 시작값
     * @param {Number} c 시작값과 종료값 사이의 Delta
     * @param {Number} d animation 총 길이
     * @param {Number} s Overshoot (optional)
     * @return {Number} 현재 animation 프레임에 대한 계산된 값
     */
    backBoth: function (t, b, c, d, s) {
        if (typeof s == 'undefined') {
            s = 1.70158; 
        }
        if ((t /= d/2 ) < 1) {
            return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        }
        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    },
    /**
     * Bounce off of start.
     * @method bounceIn
     * @static
     * @param {Number} t 현재값을 계산하기 위해 사용되는 시간값
     * @param {Number} b 시작값
     * @param {Number} c 시작값과 종료값 사이의 Delta
     * @param {Number} d animation 총 길이
     * @return {Number} 현재 animation 프레임에 대한 계산된 값
     */
    bounceIn: function (t, b, c, d) {
        return c - Rui.fx.LEasing.bounceOut(d-t, 0, c, d) + b;
    },
    /**
     * Bounces off end.
     * @method bounceOut
     * @static
     * @param {Number} t 현재값을 계산하기 위해 사용되는 시간값
     * @param {Number} b 시작값
     * @param {Number} c 시작값과 종료값 사이의 Delta
     * @param {Number} d animation 총 길이
     * @return {Number} 현재 animation 프레임에 대한 계산된 값
     */
    bounceOut: function (t, b, c, d) {
        if ((t/=d) < (1/2.75)) {
            return c*(7.5625*t*t) + b;
        } else if (t < (2/2.75)) {
            return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
        } else if (t < (2.5/2.75)) {
            return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
        }
        return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
    },
    /**
     * Bounces off start and end.
     * @method bounceBoth
     * @static
     * @param {Number} t 현재값을 계산하기 위해 사용되는 시간값
     * @param {Number} b 시작값
     * @param {Number} c 시작값과 종료값 사이의 Delta
     * @param {Number} d animation 총 길이
     * @return {Number} 현재 animation 프레임에 대한 계산된 값
     */
    bounceBoth: function (t, b, c, d) {
        if (t < d/2) {
            return Rui.fx.LEasing.bounceIn(t*2, 0, c, d) * .5 + b;
        }
        return Rui.fx.LEasing.bounceOut(t*2-d, 0, c, d) * .5 + c*.5 + b;
    }
};
/**
 * control point 들의 숫자에 대한 LBezier spline 들을 계산하기 위하여 사용된다.
 * @class LBezier
 * @namespace Rui.fx
 */
Rui.fx.LBezier = new function() {
    /**
     * t 에 기반한 animated element의 현재 위치를 가져온다.
     * 각각의 point는 'x'와 'y' 값들의 array 이다. (0 = x, 1 = y)
     * 적어도 start와 end의 2개 point가  필요하다.
     * 처음 point는 start이며, 마지막 point는 end이다. 
     * 추가적인 control point들은 옵션이다.
     * @method getPosition
     * @protected
     * @param {Array} points LBezier point들을 포함하고 있는 array
     * @param {Number} t 현재 위치를 지정하기 위한 기본이 되는 0에서 1사이의 숫자
     * @return {Array} 정수 x와 y member data를 포함하는 array
     */
    this.getPosition = function(points, t) {
        var n = points.length;
        var tmp = [];
        for (var i = 0; i < n; ++i){
            tmp[i] = [points[i][0], points[i][1]]; // save input
        }
        for (var j = 1; j < n; ++j) {
            for (i = 0; i < n - j; ++i) {
                tmp[i][0] = (1 - t) * tmp[i][0] + t * tmp[parseInt(i + 1, 10)][0];
                tmp[i][1] = (1 - t) * tmp[i][1] + t * tmp[parseInt(i + 1, 10)][1]; 
            }
        }
        return [ tmp[0][0], tmp[0][1] ]; 
    };
};
/**
 * 'attribute'의 'points' member에 의해 정의된 경로를 따라 element들을 이동하기 위한 LAnim subclass.
 * 모든 'points'는 x, y 좌표 배열이다.
 * <p>Usage: <code>var myAnim = new Rui.fx.LMotionAnim(el, { points: { to: [800, 800] } }, 1, Rui.fx.LEasing.easeOut);</code></p>
 * @class LMotionAnim
 * @namespace Rui.fx
 * @requires Rui.fx.LAnim
 * @requires Rui.fx.LAnimManager
 * @requires Rui.fx.LEasing
 * @requires Rui.fx.LBezier
 * @requires Rui.util.LDom
 * @constructor
 * @extends Rui.fx.LAnim
 * @param {String | HTMLElement} el animated 되어질 element에 대한 참조
 * @param {Object} attributes animated될 attribute  
 * 각각의 attribute는 최소한 'to'나 'by' member가 정의된 object이다.
 * 추가적인 옵션 member들은 'from'(defaults to current value)과 'unit'(defaults to 'px') 이다.
 * 모든 attribute 이름은 camelCase 방식을 사용한다.
 * @param {Number} duration (optional, 기본값 1초) animation의 길이 (frames or seconds), defaults to time-based
 * @param {Function} method (optional, Rui.fx.LEasing.easeNone 기본값) 각 frame별 attribute에 적용되는 값을 계산 (일반적으로 Rui.fx.LEasing method)
 */
Rui.fx.LMotionAnim = function(config) {
    config = config || {};
    if (config.el || config.applyTo) { // dont break existing subclasses not using Rui.extend
        Rui.fx.LMotionAnim.superclass.constructor.call(this, config);
    }
    this.patterns.points = /^points$/i;
};
Rui.extend(Rui.fx.LMotionAnim, Rui.fx.LAnim, {
    otype: 'Rui.fx.LMotionAnim',
    /**
     * @description attribute값 설정
     * @method setAttribute
     * @protected
     * @param {Object} attr
     * @param {Object} value
     * @param {Object} unit
     * @return {void}
     */
    setAttribute: function(attr, val, unit) {
        if (this.patterns.points.test(attr)) {
            unit = unit || 'px';
            Rui.fx.LMotionAnim.superclass.setAttribute.call(this, 'left', val[0], unit);
            val[1] ? Rui.fx.LMotionAnim.superclass.setAttribute.call(this, 'top', val[1], unit) : '';
        } else {
            Rui.fx.LMotionAnim.superclass.setAttribute.call(this, attr, val, unit);
        }
    },
    /**
     * @description attribute값 반환
     * @method getAttribute
     * @protected
     * @param {Object} attr
     * @param {Object} value
     * @param {Object} unit
     * @return {void}
     */
    getAttribute: function(attr) {
        if (this.patterns.points.test(attr)) {
            var val = [
                Rui.fx.LMotionAnim.superclass.getAttribute.call(this, 'left'),
                Rui.fx.LMotionAnim.superclass.getAttribute.call(this, 'top')
            ];
        } else {
            val = Rui.fx.LMotionAnim.superclass.getAttribute.call(this, attr);
        }
        return val;
    },
    /**
     * @description animation의 'method'에 의해 계산된 값을 반환
     * @method doMethod
     * @private
     * @param {String} attr attribute명
     * @param {Number} start The value this attribute should start from for this animation.
     * @param {Number} end  The value this attribute should end at for this animation.
     * @return {Number} The Value to be applied to the attribute.
     */
    doMethod: function(attr, start, end) {
        var val = null;
        if ( this.patterns.points.test(attr) ) {
            var t = this.method(this.currentFrame, 0, 100, this.totalFrames) / 100;
            val = Rui.fx.LBezier.getPosition(this.runtimeAttributes[attr], t);
        } else {
            val = Rui.fx.LMotionAnim.superclass.doMethod.call(this, attr, start, end);
        }
        return val;
    },
    /**
     * @description animation동안 사용될 실제 값들.
     * @method setRuntimeAttribute
     * @private 
     * @param {Object} attr attribute object
     */
    setRuntimeAttribute: function(attr) {
        if ( this.patterns.points.test(attr) ) {
            var el = this.getEl();
            var attributes = this.attributes;
            var start;
            var control = attributes['points']['control'] || [];
            var end;
            var i, len;
            var Dom = Rui.util.LDom;
            
            if (control.length > 0 && !(control[0] instanceof Array) ) { // could be single point or array of points
                control = [control];
            } else { // break reference to attributes.points.control
                var tmp = []; 
                for (i = 0, len = control.length; i< len; ++i) {
                    tmp[i] = control[i];
                }
                control = tmp;
            }

            if (Dom.getStyle(el, 'position') == 'static') { // default to relative
                Dom.setStyle(el, 'position', 'relative');
            }

            if ( this.isset(attributes['points']['from']) ) {
                Dom.setXY(el, attributes['points']['from']); // set position to from point
            } 
            else { Dom.setXY( el, Dom.getXY(el) ); } // set it to current position

            start = this.getAttribute('points'); // get actual top & left

            // TO beats BY, per SMIL 2.1 spec
            if ( this.isset(attributes['points']['to']) ) {
                end = this.translateValues(attributes['points']['to'], start);
//                    var pageXY = Dom.getXY(this.getEl());
                for (i = 0, len = control.length; i < len; ++i) {
                    control[i] = this.translateValues(control[i], start);
                }
            } else if ( this.isset(attributes['points']['by']) ) {
                end = [ start[0] + attributes['points']['by'][0], start[1] + attributes['points']['by'][1] ];
                for (i = 0, len = control.length; i < len; ++i) {
                    control[i] = [ start[0] + control[i][0], start[1] + control[i][1] ];
                }
            }
            this.runtimeAttributes[attr] = [start];
            if (control.length > 0) {
                this.runtimeAttributes[attr] = this.runtimeAttributes[attr].concat(control); 
            }
            this.runtimeAttributes[attr][this.runtimeAttributes[attr].length] = end;
        }
        else {
            Rui.fx.LMotionAnim.superclass.setRuntimeAttribute.call(this, attr);
        }
    },
    translateValues: function(val, start) {
        var pageXY = Rui.util.LDom.getXY(this.getEl());
        val = [ val[0] - pageXY[0] + start[0], val[1] - pageXY[1] + start[1] ];
        return val; 
    },
    isset: function(prop) {
        return (typeof prop !== 'undefined');
    }
    
});

/**
 * @description color 전환을 위한 LAnim subclass.
 * <p>Usage: <code>var myAnim = new Y.LColorAnim(el, { backgroundColor: { from: '#FF0000', to: '#FFFFFF' } }, 1, Y.LEasing.easeOut);</code> 컬러값은 다음과 같이 지정될 수 있다. 112233, #112233, 
 * [255,255,255], or rgb(255,255,255)</p>
 * @namespace Rui.fx
 * @plugin
 * @class LColorAnim
 * @requires Rui.fx.LAnim
 * @requires Rui.fx.LAnimManager
 * @requires Rui.fx.LEasing
 * @requires Rui.util.LDom
 * @constructor
 * @extends Rui.fx.LAnim
 * @param {HTMLElement | String} el animated 되어질 element에 대한 참조 
 * @param {Object} attributes animated될 attribute
 * 각각의 attribute는 최소한 "to"나 "by" member가 정의된 object이다.
 * 추가적인 옵션 member들은 "from"(defaults to current value)과 "unit"(defaults to "px") 이다.
 * 모든 attribute 이름은 camelCase 방식을 사용한다.
 * @param {Number} duration (optional, 기본값 1초) animation의 길이 (frames or seconds), defaults to time-based
 * @param {Function} method (optional, Rui.fx.LEasing.easeNone 기본값) 각 frame별 attribute에 적용되는 값을 계산 (일반적으로 Rui.fx.LEasing method)
 */
Rui.fx.LColorAnim = function(config) {
    Rui.fx.LColorAnim.superclass.constructor.call(this, config);
    this.patterns.color = /color$/i;
    this.patterns.rgb = /^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i;
    this.patterns.hex = /^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i;
    this.patterns.hex3 = /^#?([0-9A-F]{1})([0-9A-F]{1})([0-9A-F]{1})$/i;
    this.patterns.transparent = /^transparent|rgba\(0, 0, 0, 0\)$/; // need rgba for safari
};

Rui.extend(Rui.fx.LColorAnim, Rui.fx.LAnim, {

    otype: 'Rui.fx.LColorAnim',
    
    DEFAULT_BGCOLOR: '#fff',
    
    /**
     * @description Attempts to parse the given string and return a 3-tuple.
     * 주어진 문자열에 대한 parsing을 시도하고 3-tuple을 반환한다.
     * @method parseColor
     * @private
     * @param {String} s parsing 할 문자열
     * @return {Array} rgb값의 3-tuple
     */
    parseColor: function(s) {
        if (s.length == 3) { return s; }
    
        var c = this.patterns.hex.exec(s);
        if (c && c.length == 4) {
            return [ parseInt(c[1], 16), parseInt(c[2], 16), parseInt(c[3], 16) ];
        }
    
        c = this.patterns.rgb.exec(s);
        if (c && c.length == 4) {
            return [ parseInt(c[1], 10), parseInt(c[2], 10), parseInt(c[3], 10) ];
        }
    
        c = this.patterns.hex3.exec(s);
        if (c && c.length == 4) {
            return [ parseInt(c[1] + c[1], 16), parseInt(c[2] + c[2], 16), parseInt(c[3] + c[3], 16) ];
        }
        
        return null;
    },

    /**
     * @description attribute값 반환
     * @method getAttribute
     * @private
     * @param {Object} attr
     * @param {Object} value
     * @param {Object} unit
     * @return {void}
     */
    getAttribute: function(attr) {
        var el = this.getEl(),
            Dom = Rui.util.LDom;
        if (this.patterns.color.test(attr) ) {
            var val = Dom.getStyle(el, attr);
            
            var that = this;
            if (this.patterns.transparent.test(val)) { // bgcolor default
                var parent = Dom.getAncestorBy(el, function(node) {
                    return !that.patterns.transparent.test(val);
                });

                if (parent) {
                    val = Dom.getStyle(parent, attr);
                } else {
                    val = this.DEFAULT_BGCOLOR;
                }
            }
        } else {
            val = Rui.fx.LColorAnim.superclass.getAttribute.call(this, attr);
        }
        return val;
    },

    /**
     * @description animation의 "method"에 의해 계산된 값을 반환
     * @method doMethod
     * @private
     * @param {String} attr attribute명
     * @param {Number} start The value this attribute should start from for this animation.
     * @param {Number} end  The value this attribute should end at for this animation.
     * @return {Number} The Value to be applied to the attribute.
     */
    doMethod: function(attr, start, end) {
        var val;
    
        if ( this.patterns.color.test(attr) ) {
            val = [];
            for (var i = 0, len = start.length; i < len; ++i) {
                val[i] = Rui.fx.LColorAnim.superclass.doMethod.call(this, attr, start[i], end[i]);
            }
            
            val = 'rgb('+Math.floor(val[0])+','+Math.floor(val[1])+','+Math.floor(val[2])+')';
        }
        else {
            val = Rui.fx.LColorAnim.superclass.doMethod.call(this, attr, start, end);
        }

        return val;
    },

    /**
     * @description animation동안 사용될 실제 값들.
     * @method setRuntimeAttribute
     * @private 
     * @param {Object} attr attribute object
     */
    setRuntimeAttribute: function(attr) {
        Rui.fx.LColorAnim.superclass.setRuntimeAttribute.call(this, attr);
        
        if ( this.patterns.color.test(attr) ) {
            var attributes = this.attributes;
            var start = this.parseColor(this.runtimeAttributes[attr].start);
            var end = this.parseColor(this.runtimeAttributes[attr].end);
            // fix colors if going "by"
            if ( typeof attributes[attr]['to'] === 'undefined' && typeof attributes[attr]['by'] !== 'undefined' ) {
                end = this.parseColor(attributes[attr].by);
            
                for (var i = 0, len = start.length; i < len; ++i) {
                    end[i] = start[i] + end[i];
                }
            }
            
            this.runtimeAttributes[attr].start = start;
            this.runtimeAttributes[attr].end = end;
        }
    }
    
});
/**
 * @description LAnim subclass for scrolling elements to a position defined by the "scroll" member of "attributes".
 * "attribute"의 "scroll" member에 의해 정의된 위치로 element들을 스크롤하기 위한 LAnim subclass.
 * All "scroll" members are arrays with x, y scroll positions.
 * 모든 "scroll" member는 x, y 스크롤 위치 배열이다.
 * <p>Usage: <code>var myAnim = new Rui.fx.LScrollAnim(el, { scroll: { to: [0, 800] } }, 1, Rui.fx.LEasing.easeOut);</code></p>
 * @namespace Rui.fx
 * @plugin
 * @class LScrollAnim
 * @requires Rui.fx.LAnim
 * @requires Rui.fx.LAnimManager
 * @requires Rui.fx.LEasing
 * @constructor
 * @param {String or HTMLElement} el animated 되어질 element에 대한 참조
 * @param {Object} attributes animated될 attribute  
 * 각각의 attribute는 최소한 "to"나 "by" member가 정의된 object이다.
 * 추가적인 옵션 member들은 "from"(defaults to current value)과 "unit"(defaults to "px") 이다.
 * 모든 attribute 이름은 camelCase 방식을 사용한다.
 * @param {Number} duration (optional, 기본값 1초) animation의 길이 (frames or seconds), defaults to time-based
 * @param {Function} method (optional, Rui.fx.LEasing.easeNone 기본값) 각 frame별 attribute에 적용되는 값을 계산 (일반적으로 Rui.fx.LEasing method)
 */
Rui.fx.LScrollAnim = function(config) {
    config = config || {};
    if (config.el || config.applyTo) { // dont break existing subclasses not using Rui.extend
        Rui.fx.LScrollAnim.superclass.constructor.call(this, config);
    }
};

Rui.extend(Rui.fx.LScrollAnim, Rui.fx.LAnim, {
    
    otype: 'Rui.fx.LScrollAnim',

    /**
     * @description attribute값 반환
     * @method getAttribute
     * @protected
     * @param {Object} attr
     * @param {Object} value
     * @param {Object} unit
     * @return {void}
     */
    getAttribute: function(attr) {
        var val = null;
        var el = this.getEl();
        if (attr == 'scroll') {
            val = [ el.scrollLeft, el.scrollTop ];
        } else {
            val = Rui.fx.LScrollAnim.superclass.getAttribute.call(this, attr);
        }
        return val;
    },

    /**
     * @description attribute값 설정
     * @method setAttribute
     * @protected
     * @param {Object} attr
     * @param {Object} value
     * @param {Object} unit
     * @return {void}
     */
    setAttribute: function(attr, val, unit) {
        var el = this.getEl();
        if (attr == 'scroll') {
            el.scrollLeft = val[0];
            el.scrollTop = val[1];
        } else {
            Rui.fx.LScrollAnim.superclass.setAttribute.call(this, attr, val, unit);
        }
    },

    /**
     * @description animation의 "method"에 의해 계산된 값을 반환
     * @method doMethod
     * @private
     * @param {String} attr attribute명
     * @param {Number} start The value this attribute should start from for this animation.
     * @param {Number} end  The value this attribute should end at for this animation.
     * @return {Number} The Value to be applied to the attribute.
     */
    doMethod: function(attr, start, end) {
        var val = null;
        if (attr == 'scroll') {
            val = [
                this.method(this.currentFrame, start[0], end[0] - start[0], this.totalFrames),
                this.method(this.currentFrame, start[1], end[1] - start[1], this.totalFrames)
            ];
        } else {
            val = Rui.fx.LScrollAnim.superclass.doMethod.call(this, attr, start, end);
        }
        return val;
    }
    
});
