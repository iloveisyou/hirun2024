/*
 * GHIS 프로젝트에서 사용한 REST용 데이터 처리용 DataSet, DataSetManager
 */
if(!Ghis)
    var Ghis = {};

Ghis.LCRM_HOST = 'http://lgcrmdev.cloudapp.net';

(function(){

    var makeParamsXml = function(config){
        config = config || {};
        var xml = '',
            list = config.paramDTList,
            make = function(item, index){
                var x = '', ps;
                x += '<' + item + '>';
                config.inputDTList = config.inputDTList || '';
                config.inputDTList += (config.inputDTList ? ',' : '') + item;
                if(config.params){
                    if(config.params.length > index){
                        ps = config.params[index];
                    }else if(typeof config.params == 'object'){
                        ps = config.params;
                    }
                }
                for(var key in ps){
                    x+= '<'+key+'>'+ps[key]+'</'+key+'>';
                }
                x += '</' + item + '>';
                return x;
            };
        if(list){
            xml += '<inputParamDSXML><DataSet>';
            if(typeof list == 'string'){
                xml += make(list, 0);
            }else if(list.length){
                Rui.each(list, function(item, index) {
                    xml += make(item, index);
                });
            }
            xml += '</DataSet></inputParamDSXML>';
        }
        return xml;
    };

    /**
     * 의료 솔루션의 REST 서비스와 BizActor 조합의 프로그램 개발을 용이하도록 확장하여 만들어진 JsonDataSet
     * API는 Rui.data.LJsonDataSet과 동일하므로 Rui.data.LJsonDataSet을 참조한다.
     * 경고!! CRM 프로젝트를 위해 만들어졌으며 향후 프로젝트에서도 이 모듈을 사용하려할 경우 RUI팀의 지원을 받아야 합니다.
     * @namespace Ghis
     * @class JsonDataSet
     * @extends Rui.data.LJsonDataSet
     * @constructor JsonDataSet
     * @param {Object} config
     */
    Ghis.JsonDataSet = function(config){
        Ghis.JsonDataSet.superclass.constructor.call(this, config);
    };
    Rui.extend(Ghis.JsonDataSet, Rui.data.LJsonDataSet, {
        /**
         * @description URL의 데이터셋을 조회한다
         * Ghis CRM의 REST 서비스가 받을 수 있는 4개의 parameter를 전달하여 데이터셋을 load한다.
         * [ serviceid, inputDTList, outputDTList, inputStringXML ]
         * 추가적인 parameter는 REST가 받을 수 없으므로 추가 parameter가 있을 경우 inputStringXML에 포함시키기로 함.
         * @method load
         * @public
         * @sample default
         * @param {Object} options 환경정보 객체
         * <div class='param-options'>
         * url {String} 서버 호출 url<br>
         * params {Object} 서버에 전달할 파라미터 객체<br>
         * method {String} get or post<br>
         * sync {boolean} sync 여부 (default : false)<br>
         * state {Rui.data.LRecord.STATE_INSERT|Rui.data.LRecord.STATE_UPDATE|Rui.data.LRecord.STATE_DELETE} load시 record의 기본 상태
         * </div>
         * @return {void}
         */
        load: function(options){
            this.isLoad = false;
            var config = options ||
            {};
            var currentDataSet = this;
            this.onSuccessDelegate = Rui.util.LFunction.createDelegate(this.onSuccess, this);

            config = Rui.applyIf(config, {
                method: this.method || 'POST',
                callback: {
                    success: this.onSuccessDelegate,
                    failure: function(conn){
                        var e = new Error(conn.responseText);
                        try{
                            if(currentDataSet.fireEvent('loadException', {
                                type: 'loadException',
                                target: currentDataSet,
                                throwObject: e,
                                conn: conn
                            }) !== false) throw e;
                        } finally {
                            currentDataSet = null;
                            e = null;
                        }
                    }
                },
                url: null,
                params: {},
                sync: this.sync,
                cache: this.cache || false
            });

            config.callback = Rui.applyIf(config.callback, {
                timeout: ((this.timeout || 60) * 1000)
            });

            this.lastOptions = config;
            
            this.lastOptions.state = this.lastOptions.state || Rui.data.LRecord.STATE_NORMAL;
            this.lastOptions.isLoad = true;

            //여기부서 수정시작
            var params = '<postdata>';
            params += '<serviceid>' + config.serviceid + '</serviceid>';
            params += makeParamsXml(config);
            params += '<inputDTList>USERINFO_DT' + (config.inputDTList ? ','+config.inputDTList : '') + '</inputDTList>';
            params += '<outputDTList>' + (config.outputDTList || '') + '</outputDTList>';
            params += '</postdata>';
            params = encodeURIComponent(params);
            config.method = 'POST';
            
            /*
            if (typeof config.params == 'object') 
                params = Rui.util.LObject.serialize(config.params);
            else 
                params = config.params;
            */
            //여기까지 수정완료
            
            params.duDataSetId = this.id;

            this.fireEvent('beforeLoad', {
                type: 'beforeLoad',
                target: this
            });
            Rui.LConnect._isFormSubmit = false;
            if (config.sync && config.sync == true) {
                Rui.LConnect.syncRequest(config.method, config.url, config.callback, params, config);
            } else {
                Rui.LConnect.asyncRequest(config.method, config.url, config.callback, params, config);
            }
            this.onSuccessDelegate = null;
            config = null;
        },
        
        /**
         * LJsonDataSet의 serialize와 동일하나 닷넷용 데이터셋을 위해 metaData에 fields를 포함하여 전송하도록 하는
         * 소스코드가 포함되었음.
         * @description 데이터 정보를 문자열로 리턴한다.
         * @method serialize
         * @public
         * @return {String} 문자열
         */
        serialize: function() {
            var fields = this.fields;

            var result = {};
            result['metaData'] = {
                dataSetId:this.id
            };
            var records = [];
            for(var i = 0 ; i < this.getCount() ; i++) {
                var record = this.getAt(i);
                var r = {
                    duistate: record.state
                };
                for(var j = 0 ; j < fields.length ; j++) {
                    var field = fields[j];
                    var value = record.get(field.id);
                    
                    if (this.writeFieldFormater) {
                        var formater = this.writeFieldFormater[field.type];
                        value = formater ? formater(value) : value;
                    }

                    if(value == null) value = '';
                    r[fields[j].id] = value; 
                }
                
                records.push(r);
            }
            
            result['records'] = records;
            
            //add metaData fields
            var fields = [{name: 'duistate', dataType: 'int'}];
            for(var i = 0, len = this.fields.length; i < len; i++){
                var field = this.fields[i],
                    f = {name: field.id};
                if(field.type) f.dataType = field.type;
                if(field.defaultValue) f.defaultValue = field.defaultValue;
                fields.push(f);
            }
            result['metaData']['fields'] = fields;

            return Rui.util.LJson.encode(result);
        },
        /**
         * LJsonDataSet의 serialize와 동일하나 닷넷용 데이터셋을 위해 metaData에 fields를 포함하여 전송하도록 하는
         * 소스코드가 포함되었음.
         * @description 변경된 데이터 정보를 문자열로 리턴한다.
         * @method serializeModified
         * @param {boolean} isAll [optional] true일 경우 변경된 전체 데이터를 리턴
         * @public
         * @return {String} 변경된 문자열
         */
        serializeModified: function(isAll) {
            var fields = this.fields;
            var modifiedRecords = this.getModifiedRecords();

            var result = {};
            result['metaData'] = {
                dataSetId:this.id
            };
            var records = [];
            for(var i = 0, len = modifiedRecords.length; i < len ; i++) {
                var record = modifiedRecords.getAt(i);
                if(isAll !== true && (record.state != Rui.data.LRecord.STATE_DELETE && Rui.isEmpty(this.get(record.id)))) continue;
                var r = {
                    duistate: record.state
                };
                for(var j = 0 ; j < fields.length ; j++) {
                    var field = fields[j];
                    var value = record.get(field.id);

                    if (this.writeFieldFormater) {
                        var formater = this.writeFieldFormater[field.type];
                        if(formater) value = formater(value);
                    }

                    if(value == null) value = '';
                    r[fields[j].id] = value; 
                }
                
                records.push(r);
            }
            result['records'] = records;
            
            //add metaData fields
            var fields = [{name: 'duistate', dataType: 'int'}];
            for(var i = 0, len = this.fields.length; i < len; i++){
                var field = this.fields[i],
                    f = {name: field.id};
                if(field.type) f.dataType = field.type;
                if(field.defaultValue) f.defaultValue = field.defaultValue;
                fields.push(f);
            }
            result['metaData']['fields'] = fields;

            return Rui.util.LJson.encode(result);
        }
    });


    /**
     * 의료 솔루션의 REST 서비스와 BizActor 조합의 프로그램 개발을 용이하도록 확장하여 만들어진 DataSetManager
     * API는 Rui.data.LDataSetManager와 동일하므로 Rui.data.LDataSetManager를 참조한다.
     * 경고!! CRM 프로젝트를 위해 만들어졌으며 향후 프로젝트에서도 이 모듈을 사용하려할 경우 RUI팀의 지원을 받아야 합니다.
     * @namespace Ghis
     * @class DataSetManager
     * @extends Rui.data.LDataSetManager
     * @constructor DataSetManager
     * @param {Object} config
     */
    Ghis.DataSetManager = function(config){
        Ghis.DataSetManager.superclass.constructor.call(this, config);
    };
    Rui.extend(Ghis.DataSetManager, Rui.data.LDataSetManager, {

        /**
         * @description 여러개의 {Rui.data.LDataSet}을 서버에서 load하는 메소드
         * @method loadDataSet
         * @public
         * @sample default
         * @param {Object} options 호출할때 전달할 Option정보 객체
         * @return {void}
         */
        loadDataSet: function(option) {
            var config = option || {};
            var dataSets = config.dataSets;
            config.dataSets = null;

            var me = this;

            config = Rui.applyIf(config, {
                method: 'POST',
                callback: {
                    success: function(conn) {
                        me.loadDataResponse(dataSets, conn, config);
                    },
                    failure: function(conn) {
                        me.waitPanelHide();
                        var e = new Error(conn.responseText);
//                        if(config.sync !== true)
                        if(me.fireEvent('loadException', {target:me, throwObject:e, conn:conn}) !== false)
                            throw e;
                    }
                },
                url: null,
                params:{},
                cache: this.cache || false
            });

            this.lastOptions = config;

            this.lastOptions.state = Rui.isUndefined(this.lastOptions.state) == false ? this.lastOptions.state : Rui.data.LRecord.STATE_NORMAL;

            //여기부서 수정시작
            var params = '<postdata>';
            params += '<serviceid>' + config.serviceid + '</serviceid>';
            params += makeParamsXml(config);
            params += '<inputDTList>USERINFO_DT' + (config.inputDTList ? ','+config.inputDTList : '') + '</inputDTList>';
            params += '<outputDTList>' + (config.outputDTList || '') + '</outputDTList>';
            params += '</postdata>';
            params = encodeURIComponent(params);
            config.method = 'POST';
            /*
            if (typeof config.params == 'object')
                params = Rui.util.LObject.serialize(config.params);
            else 
                params = config.params;
            */
            //여기까지 수정완료

            this.fireEvent('beforeLoad', {target:this});
            Rui.LConnect._isFormSubmit = false;
            this.waitPanelShow();
            if(config.sync && config.sync == true) {
                Rui.LConnect.syncRequest(config.method, config.url, config.callback, params);
            } else {
                Rui.LConnect.asyncRequest(config.method, config.url, config.callback, params);
            }
        },
        /**
         * @description dataSet의 update를 수행하는 메소드
         * @method doUpdateDataSet
         * @protected
         * @param {Object} options 호출할때 전달할 Option정보 객체
         * @param {Array} dataSets 서버에 전달할 데이터셋 리스트
         * @return {void}
         */
        doUpdateDataSet: function(config, dataSets) {
            if (this.fireEvent('beforeUpdate', {
                target: this.el,
                url: config.url,
                dataSets: dataSets
            }) === false) {
                delete this.filterTask;
                return;
            }

            var isUpdated = false;

            if(config.checkIsUpdate == true) {
                for(var i = 0 ; i < dataSets.length ; i++) {
                    var dataSetEl = Rui.util.LDom.get(dataSets[i]);
                    isUpdated = (isUpdated === false) ? dataSetEl.isUpdated() : isUpdated;  
                    if(isUpdated === true) break;
                }
            } else isUpdated = true;

            if(isUpdated === false) {
                alert(Rui.getMessageManager().get('$.base.msg102'));
                delete this.filterTask;
                return;
            }

            var url = config.url;
            var callback = config.callback;
            
            //여기부서 수정시작
            var params = '';
            params += '<postdata>';
            params += '<serviceid>' + config.serviceid + '</serviceid>';
            params += makeParamsXml(config);
            params += '<inputDTList>USERINFO_DT' + (config.inputDTList ? ','+config.inputDTList : '') + '</inputDTList>';
            params += '<outputDTList>' + (config.outputDTList || '') + '</outputDTList>';
            params += (config.modifiedOnly === false ? this.serializeByDataSet(dataSets) : this.serializeByModifiedDataSet(dataSets));
            params += '</postdata>';
            params = encodeURIComponent(params);
            
            /*
            var params = config.modifiedOnly === false ? this.serializeByDataSet(dataSets) : this.serializeByModifiedDataSet(dataSets);
            if (typeof config.params == 'object')
                params += '&' + Rui.util.LObject.serialize(config.params);
            else 
                params += '&' + config.params; 
            */
            //여기까지 수정완료

            var callbackDelegate = {
                success: this.doSuccessDelegate,
                failure: this.doFailureDelegate,
                timeout: (this.timeout * 1000),
                argument: {
                    'url': config.url,
                    'dataSets': dataSets,
                    'callback': callback,
                    'serviceid': config.serviceid,
                    'inputDTList': config.inputDTList,
                    'outputDTList': config.outputDTList,
                    'params': config.params
                }
            };

            // onSuccess 이벤트에서 처리할 수 있게 현재 dataSets 등록 (구조를 delegate구조로 바꾸고 싶으나 데이터 전달 방법의 구조를 잡기 어려움. ㅜㅜ)
            this.dataSets = dataSets;

            this.waitPanelShow();

            Rui.LConnect._isFormSubmit = false;

            if(this.sync || this.sync == true) {
                this.transaction = Rui.LConnect.syncRequest('POST', url, callbackDelegate, params);
            } else {
                this.transaction = Rui.LConnect.asyncRequest('POST', url, callbackDelegate, params);
            }
            delete this.filterTask;
        },
        /**
         * @description 여러개의 {Rui.data.LDataSet}에 해당되는 queryString을 리턴한다.
         * @method serializeByModifiedDataSet
         * @public
         * @param {Array} dataSets 데이터셋 리스트
         * @return {void}
         */
        serializeByModifiedDataSet: function(dataSets) {
            var xml = '';
            if(dataSets.length > 0) {
                var dataSetEl = Rui.util.LDom.get(dataSets[0]);
                xml += '<inputStringJSON>';
                xml += dataSetEl.serializeModifiedDataSetList(dataSets);
                xml += '</inputStringJSON>';
                xml += '<dui_datasetdatatype>';
                xml += dataSetEl.dataSetType;
                xml += '</dui_datasetdatatype>';
            }
            return xml;
        },
        /**
         * @description 여러개의 {Rui.data.LDataSet}에 해당되는 queryString을 리턴한다.
         * @method serializeByDataSet
         * @public
         * @param {Array} dataSets 데이터셋 리스트
         * @return {void}
         */
        serializeByDataSet: function(dataSets) {
            var xml = '';
            if(dataSets.length > 0) {
                var dataSetEl = Rui.util.LDom.get(dataSets[0]);
                xml += '<inputStringJSON>';
                xml += dataSetEl.serializeDataSetList(dataSets);
                xml += '</inputStringJSON>';
                xml += '<dui_datasetdatatype>';
                xml += dataSetEl.dataSetType;
                xml += '</dui_datasetdatatype>';
            }
            return xml;
        }
        
    });
    
})();

