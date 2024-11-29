/*
 * @(#) LNotificationManager-debug.js
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
(function() {
    /**
     * @description 알림 메시지 패널을 관리하는 객체
     * @namespace Rui.ui
     * @plugin js,css
     * @class LNotificationManager
     * @extends Rui.util.LEventProvider
     * @sample default
     * @constructor LNotificationManager 
     * @param {Object} oConfig The intial LNotificationManager.
     */
    Rui.ui.LNotificationManager = function(oConfig){
        if(Rui.ui.LNotificationManager.caller != Rui.ui.LNotificationManager.getInstance)
            throw new Rui.LException("Can't call the constructor method.", this);
        oConfig = oConfig || {};
        oConfig = Rui.applyIf(oConfig, Rui.getConfig().getFirst('$.ext.notificationManager.defaultProperties'));
        Rui.applyObject(this, oConfig, true);
        Rui.ui.LNotificationManager.superclass.constructor.call(this, oConfig);
    };

    /**
     * @description 인스턴스를 얻어오는 메소드
     * @method getInstance
     * @public
     * @static
     * @return {Rui.ui.LNotificationManager}
     */
    Rui.ui.LNotificationManager.getInstance = function(options) {
        if(this.instanceObj == null)
            this.instanceObj = new Rui.ui.LNotificationManager(options);
        return this.instanceObj;
    };

    var NM = Rui.ui.LNotificationManager;
    NM.instanceObj = null;
    NM.messageList = [];

    Rui.extend(Rui.ui.LNotificationManager, Rui.util.LEventProvider, {
        /**
         * @description 객체의 문자열
         * @property otype
         * @private
         * @type {String}
         */
        otype: 'Rui.ui.LNotificationManager',
        /**
         * @description notification의 animation의 bounce값
         * @property bounce
         * @private
         * @type {int}
         */
        bounce: 50,
        /**
         * @description notification의 animation처리를 위한 width값
         * @property width
         * @private
         * @type {int}
         */
        width: 200,
        /**
         * @description notification의 animation처리를 위한 duration값
         * @property duration
         * @private
         * @type {int}
         */
        duration: 0.5,
        /**
         * @description notification를 출력하고 있는 시간(초)
         * @property timer
         * @private
         * @type {int}
         */
        timer: 10,
        /**
         * @description 공지 메시지 출력하는 메소드
         * options 정보 : { body: '출력할 메시지', buttons: [ { text: '취소하기', handler: function(e) { 수행할 내용 } } ] }
         * @method show
         * @param {String|Object} options 옵션정보
         * @return {void}
         */
        show: function(options){
            var bgColor = 'L-bg-color-' + (NM.messageList.length + 1);
            var height = options ? (options.height ? options.height + 20 : 70) : 70;
            var y = height * (NM.messageList.length + 1);
            if(typeof options === 'string')
                options = { body: options };
            options = Rui.applyIf(options, { width: 200, defaultClass: bgColor, y: y });
            
            if(!this.containerEl) {
                this.containerEl = Rui.createElements('<div class="L-notification-container"></div>').getAt(0);
                Rui.getBody().appendChild(this.containerEl);
            }

            var notification = new Rui.ui.LNotification(options);
            notification.render(this.containerEl);

            var xy = notification.el.getXY();

            var openAnim = new Rui.fx.LMotionAnim({
                el: notification.element.id,
                attributes: {
                    points: {
                        control: [[xy[0] - this.bounce]],
                        from: [xy[0] + this.width, xy[1]],
                        to: [xy[0] + this.bounce, xy[1]]
                    }
                },
                duration: this.duration
            });
            notification.show(openAnim);
            notification.on('hide', this.onHide, this, true);
            if(!this.hideTask)
                this.hideTask = Rui.later(500, this, this._hide, null, true);
            NM.messageList.push({ time: new Date(), notification: notification});
            notification = openAnim = null;
        },
        _hide: function() {
            var currTime = Rui.util.LDate.add(new Date(), 'S', -this.timer);
            for (var i = 0; i < NM.messageList.length; i++) {
                if(NM.messageList[i] && NM.messageList[i].time.getTime() < (currTime.getTime())) {
                    var notification = NM.messageList[i].notification;
                    var xy = notification.el.getXY();
                    var closeAnim = new Rui.fx.LMotionAnim({
                        el: notification.element.id,
                        attributes: {
                            points: {
                                control: [[xy[0] - this.bounce]],
                                to: [xy[0] + this.width + this.bounce, xy[1]]
                            }
                        },
                        duration: this.duration
                    });

                    notification.hide(closeAnim);
                    NM.messageList = this.removeNotification(i);
                    closeAnim = notification = null;
                    i--;
                }
            }
            if(NM.messageList.length < 1) {
                this.hideTask.cancel();
                delete this.hideTask;
            }
        },
        onHide: function(e) {
            for (var i = 0; i < NM.messageList.length; i++) {
                if(NM.messageList[i].notification === this) {
                    NM.messageList = this.removeNotification(i);
                    break;
                }
            }
        },
        removeNotification: function(i) {
            NM.messageList[i].notification.unOn('hide', this.onHide, this);
            NM.messageList[i].notification.destroy();
            NM.messageList[i].notification = null;
            return Rui.util.LArray.removeAt(NM.messageList, i);
        }
    });
})();

Rui.onReady(function() {
    var conf = Rui.getConfig();
    var isShow = conf.getFirst('$.base.guide.show', false);
    if(isShow) {
        var limitGuideCount = conf.getFirst('$.base.guide.limitGuideCount', 3);
        var manager = new Rui.webdb.LWebStorage(new Rui.webdb.LCookieProvider());
        var guideCount = manager.get('guideCount', 0);
        if(guideCount < limitGuideCount) {
            setTimeout(function(){
                var ruiPath = Rui.getRootPath();
                Rui.ui.LNotificationManager.getInstance().show('<a target="_new" href="' + ruiPath + '/docs/guide/guide.html">RUI 사용법 보기</a>');
                manager.set('guideCount', ++guideCount);
            }, 2000);
        }
    }
});
