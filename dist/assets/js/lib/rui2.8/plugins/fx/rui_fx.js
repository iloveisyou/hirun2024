/*
 * @(#) rui_fx.js
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
Rui.fx.LAnim = function(config) {
    config = config || {};
    if(config.applyTo)
        config.el = config.applyTo;
    this.init(config);
    this.createEvent('start');
    this.createEvent('tween');
    this.createEvent('complete');
};
Rui.extend(Rui.fx.LAnim, Rui.util.LEventProvider, {
    otype: 'Rui.fx.LAnim',
    patterns: { 
        noNegatives: /width|height|opacity|padding/i, 
        offsetAttribute: /^((width|height)|(top|left))$/, 
        defaultUnit: /width|height|top$|bottom$|left$|right$/i, 
        offsetUnit: /\d+(em|%|en|ex|pt|in|cm|mm|pc)$/i 
    },
    doMethod: function(attr, start, end) {
        return this.method(this.currentFrame, start, end - start, this.totalFrames);
    },
    setAttribute: function(attr, val, unit) {
        if ( this.patterns.noNegatives.test(attr) ) {
            val = (val > 0) ? val : 0;
        }
        Rui.util.LDom.setStyle(this.getEl(), attr, val + unit);
    },
    getAttribute: function(attr) {
        var el = this.getEl();
        var val = Rui.util.LDom.getStyle(el, attr);
        if (val !== 'auto' && !this.patterns.offsetUnit.test(val)) {
            return parseFloat(val);
        }
        var a = this.patterns.offsetAttribute.exec(attr) || [];
        var pos = !!( a[3] ); 
        var box = !!( a[2] ); 
        if ( box || (Rui.util.LDom.getStyle(el, 'position') == 'absolute' && pos) ) {
            val = el['offset' + a[0].charAt(0).toUpperCase() + a[0].substr(1)];
        } else { 
            val = 0;
        }
        return val;
    },
    getDefaultUnit: function(attr) {
        if ( this.patterns.defaultUnit.test(attr) ) {
           return 'px';
        }
        return '';
    },
    setRuntimeAttribute: function(attr) {
        var start;
        var end;
        var attributes = this.attributes;
        this.runtimeAttributes[attr] = {};
        var isset = function(prop) {
            return (typeof prop !== 'undefined');
        };
        if ( !isset(attributes[attr]['to']) && !isset(attributes[attr]['by']) ) {
            return false; 
        }
        start = ( isset(attributes[attr]['from']) ) ? attributes[attr]['from'] : this.getAttribute(attr);
        if ( isset(attributes[attr]['to']) ){
            end = attributes[attr]['to'];
        }else if( isset(attributes[attr]['by']) ){
            if (start.constructor == Array) {
                end = [];
                for (var i = 0, len = start.length; i < len; ++i) {
                    end[i] = start[i] + attributes[attr]['by'][i] * 1; 
                }
            } else {
                end = start + attributes[attr]['by'] * 1;
            }
        }
        this.runtimeAttributes[attr].start = start;
        this.runtimeAttributes[attr].end = end;
        this.runtimeAttributes[attr].unit = ( isset(attributes[attr].unit) ) ? attributes[attr]['unit'] : this.getDefaultUnit(attr);
        return true;
    },
    init: function(config) {
        var isAnimated = false;
        var startTime = null;
        var actualFrames = 0; 
        var el = config.el ? Rui.util.LDom.get(config.el) : null;
        this.attributes = config.attributes || {};
        this.duration = !Rui.isUndefined(config.duration) ? config.duration : 1;
        this.method = config.method || Rui.fx.LEasing.easeNone;
        this.useSeconds = true; 
        this.currentFrame = 0;
        this.totalFrames = Rui.fx.LAnimManager.fps;
        this.setEl = function(element) {
            el = Rui.util.LDom.get(element);
        };
        this.getEl = function() { return el; };
        this.isAnimated = function() {
            return isAnimated;
        };
        this.getStartTime = function() {
            return startTime;
        };        
        this.runtimeAttributes = {};
        this.animate = function() {
            if ( this.isAnimated() || !el) {
                return false;
            }
            this.currentFrame = 0;
            this.totalFrames = ( this.useSeconds ) ? Math.ceil(Rui.fx.LAnimManager.fps * this.duration) : this.duration;
            if (this.duration === 0 && this.useSeconds) { 
                this.totalFrames = 1; 
            }
            Rui.fx.LAnimManager.registerElement(this);
            return true;
        };
        this.stop = function(finish) {
            if (!this.isAnimated()) { 
                return false;
            }
            if (finish) {
                 this.currentFrame = this.totalFrames;
                 this.tween();
            }
            Rui.fx.LAnimManager.stop(this);
        };
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
    toString: function() {
        var el = this.getEl() || {};
        var id = el.id || el.tagName;
        return (this.otype + ': ' + id);
    }
});
Rui.fx.LAnimManager = new function() {
    var thread = null;
    var queue = [];
    var tweenCount = 0;
    this.fps = 1000;
    this.delay = 1;
    this.registerElement = function(tween) {
        queue[queue.length] = tween;
        tweenCount += 1;
        tween.start();
        this.start();
    };
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
    this.start = function() {
        if (thread === null) {
            thread = setInterval(this.run, this.delay);
        }
    };
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
                return i; 
            }
        }
        return -1;
    };
    var correctFrame = function(tween) {
        var frames = tween.totalFrames;
        var frame = tween.currentFrame;
        var expected = (tween.currentFrame * tween.duration * 1000 / tween.totalFrames);
        var elapsed = (new Date() - tween.getStartTime());
        var tweak = 0;
        if (elapsed < tween.duration * 1000) { 
            tweak = Math.round((elapsed / expected - 1) * tween.currentFrame);
        } else { 
            tweak = frames - (frame + 1); 
        }
        if (tweak > 0 && isFinite(tweak)) { 
            if (tween.currentFrame + tweak >= frames) {
                tweak = frames - (frame + 1);
            }
            tween.currentFrame += tweak;      
        }
    };
};
Rui.fx.LEasing = {
    easeNone: function (t, b, c, d) {
        return c*t/d + b;
    },
    easeIn: function (t, b, c, d) {
        return c*(t/=d)*t + b;
    },
    easeOut: function (t, b, c, d) {
        return -c *(t/=d)*(t-2) + b;
    },
    easeBoth: function (t, b, c, d) {
        if ((t/=d/2) < 1) {
            return c/2*t*t + b;
        }
        return -c/2 * ((--t)*(t-2) - 1) + b;
    },
    easeInStrong: function (t, b, c, d) {
        return c*(t/=d)*t*t*t + b;
    },
    easeOutStrong: function (t, b, c, d) {
        return -c * ((t=t/d-1)*t*t*t - 1) + b;
    },
    easeBothStrong: function (t, b, c, d) {
        if ((t/=d/2) < 1) {
            return c/2*t*t*t*t + b;
        }
        return -c/2 * ((t-=2)*t*t*t - 2) + b;
    },
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
    backIn: function (t, b, c, d, s) {
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        return c*(t/=d)*t*((s+1)*t - s) + b;
    },
    backOut: function (t, b, c, d, s) {
        if (typeof s == 'undefined') {
            s = 1.70158;
        }
        return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
    },
    backBoth: function (t, b, c, d, s) {
        if (typeof s == 'undefined') {
            s = 1.70158; 
        }
        if ((t /= d/2 ) < 1) {
            return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
        }
        return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
    },
    bounceIn: function (t, b, c, d) {
        return c - Rui.fx.LEasing.bounceOut(d-t, 0, c, d) + b;
    },
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
    bounceBoth: function (t, b, c, d) {
        if (t < d/2) {
            return Rui.fx.LEasing.bounceIn(t*2, 0, c, d) * .5 + b;
        }
        return Rui.fx.LEasing.bounceOut(t*2-d, 0, c, d) * .5 + c*.5 + b;
    }
};
Rui.fx.LBezier = new function() {
    this.getPosition = function(points, t) {
        var n = points.length;
        var tmp = [];
        for (var i = 0; i < n; ++i){
            tmp[i] = [points[i][0], points[i][1]]; 
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
Rui.fx.LMotionAnim = function(config) {
    config = config || {};
    if (config.el || config.applyTo) { 
        Rui.fx.LMotionAnim.superclass.constructor.call(this, config);
    }
    this.patterns.points = /^points$/i;
};
Rui.extend(Rui.fx.LMotionAnim, Rui.fx.LAnim, {
    otype: 'Rui.fx.LMotionAnim',
    setAttribute: function(attr, val, unit) {
        if (this.patterns.points.test(attr)) {
            unit = unit || 'px';
            Rui.fx.LMotionAnim.superclass.setAttribute.call(this, 'left', val[0], unit);
            val[1] ? Rui.fx.LMotionAnim.superclass.setAttribute.call(this, 'top', val[1], unit) : '';
        } else {
            Rui.fx.LMotionAnim.superclass.setAttribute.call(this, attr, val, unit);
        }
    },
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
    setRuntimeAttribute: function(attr) {
        if ( this.patterns.points.test(attr) ) {
            var el = this.getEl();
            var attributes = this.attributes;
            var start;
            var control = attributes['points']['control'] || [];
            var end;
            var i, len;
            var Dom = Rui.util.LDom;
            if (control.length > 0 && !(control[0] instanceof Array) ) { 
                control = [control];
            } else { 
                var tmp = []; 
                for (i = 0, len = control.length; i< len; ++i) {
                    tmp[i] = control[i];
                }
                control = tmp;
            }
            if (Dom.getStyle(el, 'position') == 'static') { 
                Dom.setStyle(el, 'position', 'relative');
            }
            if ( this.isset(attributes['points']['from']) ) {
                Dom.setXY(el, attributes['points']['from']); 
            } 
            else { Dom.setXY( el, Dom.getXY(el) ); } 
            start = this.getAttribute('points'); 
            if ( this.isset(attributes['points']['to']) ) {
                end = this.translateValues(attributes['points']['to'], start);
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
Rui.fx.LColorAnim = function(config) {
    Rui.fx.LColorAnim.superclass.constructor.call(this, config);
    this.patterns.color = /color$/i;
    this.patterns.rgb = /^rgb\(([0-9]+)\s*,\s*([0-9]+)\s*,\s*([0-9]+)\)$/i;
    this.patterns.hex = /^#?([0-9A-F]{2})([0-9A-F]{2})([0-9A-F]{2})$/i;
    this.patterns.hex3 = /^#?([0-9A-F]{1})([0-9A-F]{1})([0-9A-F]{1})$/i;
    this.patterns.transparent = /^transparent|rgba\(0, 0, 0, 0\)$/; 
};
Rui.extend(Rui.fx.LColorAnim, Rui.fx.LAnim, {
    otype: 'Rui.fx.LColorAnim',
    DEFAULT_BGCOLOR: '#fff',
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
    getAttribute: function(attr) {
        var el = this.getEl(),
            Dom = Rui.util.LDom;
        if (this.patterns.color.test(attr) ) {
            var val = Dom.getStyle(el, attr);
            var that = this;
            if (this.patterns.transparent.test(val)) { 
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
    setRuntimeAttribute: function(attr) {
        Rui.fx.LColorAnim.superclass.setRuntimeAttribute.call(this, attr);
        if ( this.patterns.color.test(attr) ) {
            var attributes = this.attributes;
            var start = this.parseColor(this.runtimeAttributes[attr].start);
            var end = this.parseColor(this.runtimeAttributes[attr].end);
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
Rui.fx.LScrollAnim = function(config) {
    config = config || {};
    if (config.el || config.applyTo) { 
        Rui.fx.LScrollAnim.superclass.constructor.call(this, config);
    }
};
Rui.extend(Rui.fx.LScrollAnim, Rui.fx.LAnim, {
    otype: 'Rui.fx.LScrollAnim',
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
    setAttribute: function(attr, val, unit) {
        var el = this.getEl();
        if (attr == 'scroll') {
            el.scrollLeft = val[0];
            el.scrollTop = val[1];
        } else {
            Rui.fx.LScrollAnim.superclass.setAttribute.call(this, attr, val, unit);
        }
    },
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
