/*
 * @(#) LComboLoader-debug.js
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
     * 여러 개의 LCombo를 동시에 생성하면서 서버측 로딩까지 한번에 적용하는 클래스
     * @module ui_form
     * @namespace Rui.ui.form
     * @class LComboLoader
     * @sample default
     * @plugin
     * @constructor LComboLoader
     * @param {Object} oConfig The intial LComboLoader.
     */

    Rui.ui.form.LComboLoader = function(config){
        this.config = config || {};
        this.comboList = [];
    };

    Rui.ui.form.LComboLoader.prototype = {
        /**
        * @description 생성된 LCombo 정보를 가지는 배열
        * @config comboList
        * @type {Array}
        * @default null
        */
        /**
        * @description 생성된 LCombo 정보를 가지는 배열
        * @property comboList
        * @private
        * @type {Array}
        */
        comboList: null,
            
        /**
        * @description comboInfo에 등록된 LCombo 혹은 정보를 이용해 콤보를 생성하고, 콤보 데이터셋을 로딩한다.
        * @method load
        * @public
        * @sample default
        * @param {Object} options 환경정보 객체
        * <div class='param-options'>
        * url {String} 서버 호출 url<br>
        * comboInfo {Object} LCombo 객체 혹은 LCombo 생성자 파라미터<br>
        * method {String} get or post<br>
        * </div>
        * @return {void}
        */
        load: function(config) {
            var comboDataSetList = [];
    
            if(config.comboInfo) {
                for (var i = 0; i < config.comboInfo.length; i++) {
                    var cfg = config.comboInfo[i];
                    var currCombo = null;
                    
                    if(!(cfg instanceof Rui.ui.form.LCombo)){
                        var currCfg = Rui.applyIf(cfg, this.config);
                        currCombo = new Rui.ui.form.LCombo(currCfg);
                    } else {
                        currCombo = cfg;
                    }

                    var idx = -1;
                    for (var j = 0; j < this.comboList.length; j++) {
                        if(this.comboList[j].id == currCombo.id) idx = j;
                    }
                    if(idx == -1) this.comboList.push(currCombo);
                        
                    comboDataSetList.push(currCombo.getDataSet());
                }
            }
            
            var dataSets = comboDataSetList;
            var me = this;
            
            if(!config.faliure){
                config.faliure = function(conn) {
                    var e = new Error(conn.responseText);
                    throw e;
                };
            }

            config = Rui.applyIf(config, {
                method : 'POST',
                callback : {
                    success : function(conn) {
                        try {
                            for (var i = 0 ; i < dataSets.length ; i++) {
                                var dataSet = dataSets[i];
                                var dataSetData = dataSet.getReadData(conn);
                                dataSet.loadData(dataSetData, config);
                            }
                            if(me.success) {
                                me.success.call(me, conn);
                            }
                        } catch(e) {
                            throw e;
                        }
                    },
                    failure : config.faliure
               },
                url : null,
                params:{},
                cache: this.cache || false
            });

            var params = '';

            for (var i = 0; i < this.comboList.length; i++) {
                var currParams = this.comboList[i].params;
                if (typeof currParams == 'object') {
                    params += Rui.util.LObject.serialize(currParams) + '&';
                } else { 
                    params += currParams + '&';
                }
            }
            
            Rui.LConnect._isFormSubmit = false;
            Rui.LConnect.asyncRequest(config.method, config.url, config.callback, params);
            return this;
        },

        /**
        * @description LCombo list에 id에 대한하는 LCombo를 리턴한다.
        * @method getCombo
        * @public
        * @sample default
        * @param {String} id 얻고자 하는 LCombo객체의 아이디 
        * @return {Rui.ui.form.LCombo} 
        */
        getCombo: function(id) {
            for (var i = 0; i < this.comboList.length; i++) {
                if(this.comboList[i].id == id) return this.comboList[i];
            }
            return null;
        },

        /**
        * 생성된 LCombo 객체들을 배열로 리턴한다.
        * @method getComboList
        * @return {Array} LCombo 배열
        */
        getComboList: function() {
            return this.comboList;
        }
    };
    
})();