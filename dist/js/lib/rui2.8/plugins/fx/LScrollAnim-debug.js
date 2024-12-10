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

