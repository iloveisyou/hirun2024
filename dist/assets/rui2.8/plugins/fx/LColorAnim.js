/*
 * @(#) rui plugin
 * build version : 2.8
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
