/*
 * 
 */


/**
* @namespace Rui.data
* @module data
* @requires Rui
* @requires event
*/

/**
* <div class="plugins">Include : /rui/plugins/data/LDataSetView.js</div>
* DataSet의 View,
* 전체 Data를 가져와서 원본 DataSet을 만들고 원본 DataSet에서 조건에 맞는 Data만 DataSetView로 만들어 binding한다.
* View에서 변경하면 즉각 원본에 반영된다.
* 모든 수정이 끝나면 원본 DataSet을 server로 submit하면 된다.   
* DataSet의 filter등은 CUD시 다시 filter할 경우 CUD한 내용이 삭제되므로 다시 filter하기 전에 server에 submit해야되는 불편함이 있어서 개발됨.
* 
* this.data는 record object의 collection object
* rowData는 records : [{...},{...}]
* @deprecated
* @namespace Rui.data
* @class LDataSetView
* @extends Rui.data.LDataSet
* @constructor LDataSetView
* @param config {Object} The intial LDataSetView. 
* { id:'dataSet',
*   sourceDataSet : dataSet
* } 
*/
Rui.data.LDataSetView = function (config) {
    //field정보는 같으므로 복사
    config.fields = config.sourceDataSet.fields;
    //원본 recordId sync를 위해 기록
    config.fields.push({ id: "sourceRecordId" });
    //id는 없으면 원본 DataSet의 id + View
    config.id = config.id ? config.id : config.sourceDataSet.id + "View";
    Rui.data.LDataSetView.superclass.constructor.call(this, config);

    //원본와 동기화를 위한 event 처리
    this.on("add", this._onAdd);
    this.on("update", this._onUpdate);
    this.on("remove", this._onRemove);
    this.on("undo", this._onUndo);
};

Rui.extend(Rui.data.LDataSetView, Rui.data.LDataSet, {
    /**
    * @description view의 원본 dataset
    * @config sourceDataSet
    * @type {Rui.data.LDataSet}
    * @default null
    */
    /**
    * @description view의 원본 dataset
    * @property sourceDataSet
    * @private
    * @type {Rui.data.LDataSet}
    */
    sourceDataSet: null,
    /**
    * @description source DataSet의 data중 filter조건을 만족하는 data를 dataView로 가져온다.
    * 
    * dataSetView.loadChildData(
    *    function(id, record) {
    *        if(record.get('col4') == 'R2')
    *            return true;
    *    }
    * );
    *  
    * @method loadChildData
    * @public
    * @param {Function} fn 정보를 비교할 Function
    * @param {Object} scope scope정보 옵션
    * @return {void}
    */
    loadView: function (fn, scope, isRowChange) {
        this.rowPosition = -1;
        isRowChange = Rui.isUndefined(isRowChange) ? true : false;
        var data = this.sourceDataSet.data.query(fn, scope || this);

        var records = new Array();
        var record = null;
        for (var i = 0; i < data.length; i++) {
            record = data.getAt(i);
            records[i] = record.getValues();
            //원본 record id 기록
            records[i].sourceRecordId = record.id;
        }

        this.loadData({ records: records });
        
        //state update하기
        for (var i = 0; i < data.length; i++) {
            record = data.getAt(i);
            this.setState(i,record.state);
        }
        
        if (isRowChange)
            this.setRow(0);
    },
    /**
    * @description 현재 Record의 원본 recordId return
    * @method getSourceRecordId
    * @public
    * @return {string} source recordId
    */
    getSourceRecordId: function (record) {
        return record.get("sourceRecordId");
    },
    /**
    * @description 현재 Record의 원본 row idx return
    * @method getSourceRecordRow
    * @public
    * @return {int} row record row index
    */
    getSourceRow: function (record) {
        return this.sourceDataSet.indexOfKey(record.get('sourceRecordId'));
    },
    /**
    * @description 현재 Record의 원본 record return
    * @method getSourceRecord
    * @public
    * @return {Rui.data.LRecord} record source record 객체
    */
    getSourceRecord: function (record) {
        return this.sourceDataSet.get(record.get('sourceRecordId'));
    },
    /**
    * @description 전체 데이터를 초기 로딩데이터로 복원한다.
    * @method undoAll
    * @public
    * @return void
    */
    undoAll: function () {
        this.undoSource();
        Rui.data.LDataSetView.superclass.undoAll.call(this);
    },
    /**
    * @description 변경된 원본 data를 복원한다.
    * @method undoSource
    * @private
    * @return void
    */
    undoSource: function () {
        for (var i = 0; i < this.modified.length; i++) {
            var row = this.getSourceRow(this.modified.getAt(i));
            if (row > -1) {
                this.sourceDataSet.undo(row);
            }
        }
    }, 
    
    _onAdd: function(e){
        //e.target, e.record, e.row
        var row = this.sourceDataSet.add(e.record.clone());
        var recordId = this.sourceDataSet.getAt(row).id;
        var options = { ignoreEvent: true };
        e.record.set('sourceRecordId', recordId, options);
    },
    
    _onUpdate: function(e){
        //e.target, e.record, e.row, e.col, e.rowId(recordId), e.colId(column field id), e.value, e.originValue
        var sourceRecord = this.getSourceRecord(e.record);
        if (sourceRecord) {
            sourceRecord.set(e.colId, e.value);
        }
    },
    
    _onRemove: function(e){
        //e.target, record, e.row
        var row = this.getSourceRow(e.record);
        if (row > -1)
            this.sourceDataSet.removeAt(row);
    },
    
    _onUndo: function(e){
        //e.target, e.row, e.record, e.beforeState
        var row = this.getSourceRow(e.record);
        if (row > -1) {
            this.sourceDataSet.undo(row);
        }
    },
    
    /**
    * @description 객체를 destroy한다.
    * @method destroy
    * @public
    * @sample default
    * @return {void}
    */
    destroy: function(){

        this.unOn("add", this._onAdd);
        this.unOn("update", this._onUpdate);
        this.unOn("remove", this._onRemove);
        this.unOn("undo", this._onUndo);
        
        Rui.ui.LDataSetView.superclass.destroy.call(this);
    }
});
