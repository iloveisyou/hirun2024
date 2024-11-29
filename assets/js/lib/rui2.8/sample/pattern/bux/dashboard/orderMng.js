var guideManager = null;
Rui.onReady(function() {
    /*******************
     * 변수 및 객체 선언
     *******************/
    var webStore = new Rui.webdb.LWebStorage();

    var dm = new Rui.data.LDataSetManager();

    var dataSet1 = new Rui.data.LJsonDataSet({
        id: 'dataSet1',
        fields: [
            { id: 'field01' },
            { id: 'field02', type: 'date' },
            { id: 'field03' },
            { id: 'field04' },
            { id: 'field05' },
            { id: 'field06' },
            { id: 'field07' },
            { id: 'field08' },
            { id: 'field09' },
            { id: 'field10' },
            { id: 'field11' },
            { id: 'field12' },
            { id: 'field13' },
            { id: 'field14' },
            { id: 'field15' },
            { id: 'field16' },
            { id: 'field17' },
            { id: 'field18' },
            { id: 'field19' },
            { id: 'field20' },
            { id: 'field21' },
            { id: 'field22' },
            { id: 'field23' },
            { id: 'field24' },
            { id: 'field25' },
            { id: 'field26' },
            { id: 'field27' },
            { id: 'field28' },
            { id: 'field29' },
            { id: 'field30' },
            { id: 'field31' },
            { id: 'field32', type: 'number' }
        ]
    });

    var dataSet2 = new Rui.data.LJsonDataSet({
        id: 'dataSet2',
        fields: [
            { id: 'field01' },
            { id: 'field02' },
            { id: 'field03', type: 'date' },
            { id: 'field04' },
            { id: 'field05' },
            { id: 'field06' },
            { id: 'field07' },
            { id: 'field08' }
        ]
    });

    var dataSet3 = new Rui.data.LJsonDataSet({
        id: 'dataSet3',
        fields: [
            { id: 'field01' },
            { id: 'field02', type: 'date' },
            { id: 'field03' },
            { id: 'field04' },
            { id: 'field05' },
            { id: 'field06' },
            { id: 'field07' },
            { id: 'field08' },
            { id: 'field09' },
            { id: 'field10' },
            { id: 'field11' },
            { id: 'field12' },
            { id: 'field13' },
            { id: 'field14' },
            { id: 'field15' },
            { id: 'field16' },
            { id: 'field17' },
            { id: 'field18' },
            { id: 'field19' },
            { id: 'field20' },
            { id: 'field21' },
            { id: 'field22' },
            { id: 'field23' },
            { id: 'field24' },
            { id: 'field25' },
            { id: 'field26' },
            { id: 'field27' },
            { id: 'field28' },
            { id: 'field29' },
            { id: 'field30' },
            { id: 'field31' },
            { id: 'field32' }
        ]
    });

    var dataSet4 = new Rui.data.LJsonDataSet({
        id: 'dataSet4',
        fields: [
            { id: 'field01' },
            { id: 'field02' },
            { id: 'field03', type: 'date' },
            { id: 'field04' },
            { id: 'field05' },
            { id: 'field06' },
            { id: 'field07' },
            { id: 'field08' }
        ]
    });

    // 첫번째탭 재고
    var dataSet5 = new Rui.data.LJsonDataSet({
        id: 'dataSet5',
        fields: [
             { id: 'field01' },
             { id: 'field02' },
             { id: 'field03' },
             { id: 'field04' },
             { id: 'field05' },
             { id: 'field06' },
             { id: 'field07' },
             { id: 'field08', type: 'date' },
             { id: 'field09' },
             { id: 'field10', type: 'date' }
        ]
    });

    // 두번째탭 재고
    var dataSet6 = new Rui.data.LJsonDataSet({
        id: 'dataSet6',
        fields: [
             { id: 'field01' },
             { id: 'field02' },
             { id: 'field03' },
             { id: 'field04' },
             { id: 'field05' },
             { id: 'field06' },
             { id: 'field07' },
             { id: 'field08', type: 'date' },
             { id: 'field09' },
             { id: 'field10', type: 'date' }
        ]
    });

    var combo1 = new Rui.ui.form.LCombo({
        isEmptyText: false
    });

    combo1.getDataSet().loadData({
        records: [
            { value: '배송준비중', text: '배송준비중' },
            { value: '배송중', text: '배송중' },
            { value: '배송완료', text: '배송완료' }
        ]
    });
    
    var tabView1 = new Rui.ui.tab.LTabView({
        contentHeight: 1280
    });

    tabView1.render('tabView1');

    var columnModel1 = new Rui.ui.grid.LColumnModel({
        autoWidth: true,
        columns: [
            { field: 'field01', label: '주문번호', sortable: true },
            { field: 'field02', label: '주문일', align: 'center', sortable: true, renderer: 'date' },
            { field: 'field03', label: '주문처', sortable: true },
            { field: 'field04', label: '담당자', align: 'center', sortable: true },
            { field: 'field05', label: '연락처', align: 'center' },
            { field: 'field06', label: '배송지역', width: 150 },
            { field: 'field32', label: '주문금액', align: 'right', renderer: 'money' },
            { field: 'field07', label: '상태', align: 'center', editor: combo1 }
        ]
    });
    
    var grid1 = new Rui.ui.grid.LGridPanel({
        columnModel: columnModel1,
        dataSet: dataSet1,
        width: 985,
        height: 370,
        clickToEdit: true,
        headerTools: true,
        autoWidth: true
    });

    grid1.render('grid1');

    var columnModel2 = new Rui.ui.grid.LColumnModel({
        autoWidth: true,
        columns: [
            { field: 'field02', label: '상품번호' },
            { field: 'field03', label: '주문일', align: 'center', renderer: 'date' },
            { field: 'field04', label: '모델명' },
            { field: 'field05', label: '단가', align: 'right', renderer: 'money' },
            { field: 'field06', label: '수량', align: 'right', renderer: 'number' },
            { field: 'field07', label: '금액', align: 'right', renderer: 'money', summary: { ids: [ 'field03' ] } },
            { field: 'field08', label: '상태', align: 'center' }
        ]
    });

    var summary1 = new Rui.ui.grid.LTotalSummary();
    summary1.on('renderTotalCell', function(e){
        if(e.colId == 'field06') {
            e.value = '합계';
        } else {
            if (e.colId == 'field07') {
                // dataSet의 컬럼이 없고 GridView에만 존재할 경우
                var value = 0;
                for (var row = 0; row < dataSet2.getCount(); row++) {
                    var record = dataSet2.getAt(row);
                    var calVal = record.get('field07');
                    value += calVal;
                    record = null;
                }
                e.value = Rui.util.LFormat.moneyFormat(value);
            }
        }
    });

    var grid2 = new Rui.ui.grid.LGridPanel({
        columnModel: columnModel2,
        dataSet: dataSet2,
        width: 985,
        height: 230,
        viewConfig: {
            plugins: [ summary1 ]
        },
        autoWidth: true
    });

    grid2.render('grid2');

    var view2 = grid2.getView();
    
    var columnModel3 = new Rui.ui.grid.LColumnModel({
        autoWidth: true,
        columns: [
            { field: 'field01', label: '반품번호' },
            { field: 'field02', label: '반품요청일', align: 'center', renderer: 'date' },
            { field: 'field01', label: '주문번호' },
            { field: 'field03', label: '주문처' },
            { field: 'field04', label: '담당자', align: 'center' },
            { field: 'field05', label: '연락처', align: 'center' },
            { field: 'field06', label: '배송지역', width: 150 },
            { field: 'field32', label: '주문금액', align: 'right', renderer: 'money' },
            { field: 'field07', label: '상태' }
        ]
    });
    
    var grid3 = new Rui.ui.grid.LGridPanel({
        columnModel: columnModel3,
        dataSet: dataSet3,
        width: 985,
        height: 230,
        autoWidth: true
    });
    
    var columnModel4 = new Rui.ui.grid.LColumnModel({
        autoWidth: true,
        columns: [
            { field: 'field02', label: '상품번호' },
            { field: 'field03', label: '주문일', align: 'center', renderer: 'date' },
            { field: 'field04', label: '모델명' },
            { field: 'field05', label: '단가', align: 'right', renderer: 'money' },
            { field: 'field06', label: '수량', align: 'right', renderer: 'number' },
            { field: 'field07', label: '금액', align: 'right', renderer: 'money' },
            { field: 'field08', label: '상태', align: 'center' }
        ]
    });
    
    var grid4 = new Rui.ui.grid.LGridPanel({
        columnModel: columnModel4,
        dataSet: dataSet4,
        width: 985,
        height: 230,
        autoWidth: true
    });

    var columnModel5 = new Rui.ui.grid.LColumnModel({
        autoWidth: true,
        columns: [
            { field: 'field01', label: '제품번호' },
            { field: 'field02', label: '단가', align: 'right', renderer: 'money' },
            { field: 'field03', label: '제품명' },
            { field: 'field04', label: '스펙' },
            { field: 'field07', label: '원산지' },
            { field: 'field08', label: '제조일자', align: 'center', renderer: 'date' },
            { field: 'field09', label: '재고수', align: 'right', renderer: 'number' },
            { field: 'field10', label: '입고일자', align: 'center', renderer: 'date' }
        ]
    });
    
    var grid5 = new Rui.ui.grid.LGridPanel({
        columnModel: columnModel5,
        dataSet: dataSet5,
        width: 985,
        height: 230,
        autoWidth: true
    });

    grid5.render('grid5');

    var columnModel6 = new Rui.ui.grid.LColumnModel({
        autoWidth: true,
        columns: [
            { field: 'field01', label: '제품번호' },
            { field: 'field02', label: '단가', align: 'right', renderer: 'money' },
            { field: 'field03', label: '제품명' },
            { field: 'field04', label: '스펙' },
            { field: 'field07', label: '원산지' },
            { field: 'field08', label: '제조일자', align: 'center', renderer: 'date' },
            { field: 'field09', label: '재고수', align: 'right', renderer: 'number' },
            { field: 'field10', label: '입고일자', align: 'center', renderer: 'date' }
        ]
    });
    
    var grid6 = new Rui.ui.grid.LGridPanel({
        columnModel: columnModel6,
        dataSet: dataSet6,
        width: 985,
        height: 230,
        autoWidth: true
    });

    var tabView2 = new Rui.ui.tab.LTabView({
        contentHeight: 360
    });

    tabView2.render('tabView2');

    var tabView3 = new Rui.ui.tab.LTabView({
        contentHeight: 360
    });

    tabView3.render('tabView3');
    
    // 자동 완성
    var search1Ds = new Rui.data.LJsonDataSet({
        id: 'search1Ds',
        fields:[
            {id: 'code'}
        ]
    }); 
     search1Ds.load({
         url: './data/orderMng_autocomplete1.json'
     });

    var search1textBox = new Rui.ui.form.LTextBox({
        applyTo: 'search1',
        filterMode: 'local',
        width: 115,
        displayField: 'code',
        placeholder: '예) R13515-04003',
        dataSet: search1Ds,
        autoComplete : true
    });

    var search2Ds = new Rui.data.LJsonDataSet({
        id: 'search2Ds',
        fields:[
            {id: 'code'}
        ]
    }); 

    search2Ds.load({
        url: './data/orderMng_autocomplete2.json'
    });

    var search2textBox = new Rui.ui.form.LTextBox({
        applyTo: 'search2',
        filterMode: 'local',
        displayField: 'code',
        placeholder: '예) 서울지점',
        dataSet: search2Ds,
        autoComplete : true
    });

    var search3Ds = new Rui.data.LJsonDataSet({
        id: 'search3Ds',
        fields:[
            {id: 'code'}
        ]
    }); 

    search3Ds.load({
        url: './data/orderMng_autocomplete3.json'
    });

    var search3textBox = new Rui.ui.form.LTextBox({
        applyTo: 'search3',
        width: 150,
        filterMode: 'local',
        displayField: 'code',
        placeholder: '예) 37LK420.TST',
        dataSet: search3Ds,
        autoComplete : true
    });

    var search4_1DateBox = new Rui.ui.form.LDateBox({
        applyTo: 'search4_1'
    });

    var search4_2DateBox = new Rui.ui.form.LDateBox({
        applyTo: 'search4_2'
    });

    var search8_1DateBox = new Rui.ui.form.LDateBox({
        applyTo: 'search8_1'
    });

    var search8_2DateBox = new Rui.ui.form.LDateBox({
        applyTo: 'search8_2'
    });

    // 자동 완성
    var search5Ds = new Rui.data.LJsonDataSet({
        id: 'search5Ds',
        fields:[
            {id: 'code'}
        ]
    }); 

     search5Ds.load({
         url: './data/orderMng_autocomplete1.json'
     });

    var search5textBox = new Rui.ui.form.LTextBox({
        applyTo: 'search5',
        filterMode: 'local',
        width: 150,
        displayField: 'code',
        placeholder: '예) R13515-04003',
        dataSet: search5Ds,
        autoComplete : true
    });

    var search6Ds = new Rui.data.LJsonDataSet({
        id: 'search6Ds',
        fields:[
            {id: 'code'}
        ]
    }); 

    search6Ds.load({
        url: './data/orderMng_autocomplete2.json'
    });

    var search6textBox = new Rui.ui.form.LTextBox({
        applyTo: 'search6',
        filterMode: 'local',
        displayField: 'code',
        placeholder: '예) 서울지점',
        dataSet: search6Ds,
        autoComplete : true
    });

    var search7Ds = new Rui.data.LJsonDataSet({
        id: 'search7Ds',
        fields:[
            {id: 'code'}
        ]
    }); 

    search7Ds.load({
        url: './data/orderMng_autocomplete3.json'
    });

    var search7textBox = new Rui.ui.form.LTextBox({
        applyTo: 'search7',
        width: 150,
        filterMode: 'local',
        displayField: 'code',
        placeholder: '예) 37LK420.TST',
        dataSet: search7Ds,
        autoComplete : true
    });
/*
    var search8DateBox = new Rui.ui.form.LFromToDateBox({
        applyTo: 'search8'
    });
*/
    var bind1 = new Rui.data.LBind({
        groupId: 'tabView2',
        dataSet: dataSet1,
        bind: true,
        bindInfo: [
            { id: 'field08', ctrlId: 'field08', value: 'value' },
            { id: 'field09', ctrlId: 'field09', value: 'value' },
            { id: 'field10', ctrlId: 'field10', value: 'value' },
            { id: 'field11', ctrlId: 'field11', value: 'value' },
            { id: 'field12', ctrlId: 'field12', value: 'value' },
            { id: 'field13', ctrlId: 'field13', value: 'value' },
            { id: 'field14', ctrlId: 'field14', value: 'value' },
            { id: 'field15', ctrlId: 'field15', value: 'value' },
            { id: 'field16', ctrlId: 'field16', value: 'value' },
            { id: 'field17', ctrlId: 'field17', value: 'value' },
            { id: 'field18', ctrlId: 'field18', value: 'value' },
            { id: 'field19', ctrlId: 'field19', value: 'value' },
            { id: 'field20', ctrlId: 'field20', value: 'value' },
            { id: 'field21', ctrlId: 'field21', value: 'value' },
            { id: 'field22', ctrlId: 'field22', value: 'value' },
            { id: 'field23', ctrlId: 'field23', value: 'value' },
            //{ id: 'field24', ctrlId: 'field24', value: 'value' },
            { id: 'field25', ctrlId: 'field25', value: 'value' },
            { id: 'field26', ctrlId: 'field26', value: 'value' },
            { id: 'field27', ctrlId: 'field27', value: 'value' },
            { id: 'field28', ctrlId: 'field28', value: 'value' },
            { id: 'field29', ctrlId: 'field29', value: 'value' },
            { id: 'field30', ctrlId: 'field30', value: 'value' },
            { id: 'field31', ctrlId: 'field31', value: 'value' }
        ]
    });

    var bind2 = new Rui.data.LBind({
        groupId: 'tabView3',
        dataSet: dataSet3,
        bind: false,
        bindInfo: [
            { id: 'field08', ctrlId: 'field108', value: 'value' },
            { id: 'field09', ctrlId: 'field109', value: 'value' },
            { id: 'field10', ctrlId: 'field110', value: 'value' },
            { id: 'field11', ctrlId: 'field111', value: 'value' },
            { id: 'field12', ctrlId: 'field112', value: 'value' },
            { id: 'field13', ctrlId: 'field113', value: 'value' },
            { id: 'field14', ctrlId: 'field114', value: 'value' },
            { id: 'field15', ctrlId: 'field115', value: 'value' },
            { id: 'field16', ctrlId: 'field116', value: 'value' },
            { id: 'field17', ctrlId: 'field117', value: 'value' },
            { id: 'field18', ctrlId: 'field118', value: 'value' },
            { id: 'field19', ctrlId: 'field119', value: 'value' },
            { id: 'field20', ctrlId: 'field120', value: 'value' },
            { id: 'field21', ctrlId: 'field121', value: 'value' },
            { id: 'field22', ctrlId: 'field122', value: 'value' },
            { id: 'field23', ctrlId: 'field123', value: 'value' },
            //{ id: 'field24', ctrlId: 'field124', value: 'value' },
            { id: 'field25', ctrlId: 'field125', value: 'value' },
            { id: 'field26', ctrlId: 'field126', value: 'value' },
            { id: 'field27', ctrlId: 'field127', value: 'value' },
            { id: 'field28', ctrlId: 'field128', value: 'value' },
            { id: 'field29', ctrlId: 'field129', value: 'value' },
            { id: 'field30', ctrlId: 'field130', value: 'value' },
            { id: 'field31', ctrlId: 'field131', value: 'value' }
        ]
    });

    Rui.select('#tabView2 input, #tabView3 input').setAttribute('readOnly', false);

    if(Rui.browser.msie678) {
        var todoEl = Rui.select('.L-tutorial').getAt(0);
        var topIconEl = Rui.select('.topicon').getAt(0);
        todoEl.setStyle('position', 'absolute');
        todoEl.setStyle('right', '10px');
        todoEl.setStyle('top', '200px');
        topIconEl.setStyle('position', 'absolute');
        topIconEl.setStyle('right', '30px');
        topIconEl.setStyle('top', '260px');
        
        Rui.util.LEvent.addListener(window, 'scroll', function(e) {
            var scrollTop = document.body.scrollTop;
            todoEl.setStyle('top', (scrollTop + 200) + 'px');
            topIconEl.setStyle('top', (scrollTop + 350) + 'px');
        });
    }

    /*******************
     * 사용자 이벤트 처리
     *******************/

    tabView1.on('activeIndexChange', function(e){
        if(e.activeIndex == 1 && e.isFirst && !grid3.isRendered()) {
            grid3.render('grid3');
            grid4.render('grid4');
            grid6.render('grid6');
            bind2.setBind(true);
        }
    });

    dataSet1.on('rowPosChanged', function(e) {
        if(e.row < 0) {
            dataSet2.clearData();
            dataSet5.clearData();
        } else {
            dm.loadDataSet({
                dataSets: [ dataSet2, dataSet5 ], 
                url: './data/orderManager_data2.json'
            });
        }
    });

    dataSet1.on('update', function(e) {
        var row = e.row;
        if(dataSet1.isRowModified(row)) {
            Rui.ui.LNotificationManager.getInstance().show({
                body: '배송상태를 변경하였습니다.',
                buttons: [
                    { text: '취소하기', handler: function(e) {
                        dataSet1.undo(row); 
                        Rui.ui.LNotificationManager.getInstance().show('취소되었습니다.');
                         guideManager.invokeGuideFn('notification');
                    } }
                ]
            });
        }
    });

    dataSet3.on('rowPosChanged', function(e) {
        if(e.row < 0) {
            dataSet4.clearData();
            dataSet6.clearData();
        } else {
            dm.loadDataSet({
                dataSets: [ dataSet4, dataSet6 ], 
                url: './data/orderManager_data2.json'
            });
        }
    });

    tabView1.on('activeIndexChange', function(e){
        if(e.activeIndex == 1) {
            if(e.isFirst) {
                dataSet3.load({
                    url: './data/orderManager_data.json'
                });
            } 
        }
    });

    Rui.select('.buttons button').on('click', function(e) {
        var term = Rui.get(this).getAttribute('data-term');
        var dateboxId = Rui.get(this).getAttribute('data-datebox-id');
        var fromDateBox = (dateboxId == '4') ? search4_1DateBox : search8_1DateBox;
        var toDateBox = (dateboxId == '4') ? search4_2DateBox : search8_2DateBox;
        if(term == '1') {
            fromDateBox.setValue(new Date());
            toDateBox.setValue(new Date());
        } else if(term == '7') {
            fromDateBox.setValue(new Date().add('D', -7));
            toDateBox.setValue(new Date());
        } else if(term == '31') {
            fromDateBox.setValue(new Date().add('M', -1));
            toDateBox.setValue(new Date());
        }
    });

    Rui.select('.init-tutorial').on('click', function(e) {
        guideManager.clear();
        document.location.reload();
    });

    Rui.select('.expandBtn').on('click', function(e) {
        var expandBtnEl = Rui.get(this);
        if(expandBtnEl.hasClass('collapse')) {
            expandBtnEl.removeClass('collapse');
            Rui.get('layout-grid1').show();
            grid2.setHeight(230);
        } else {
            expandBtnEl.addClass('collapse');
            Rui.get('layout-grid1').hide();
            grid2.setHeight(500);
        }
    });

    /********************
     * 버튼 선언 및 이벤트
     ********************/
    var searchBtn1 = new Rui.ui.LButton('searchBtn1');
    
    searchBtn1.on('click', function(e) {
        dataSet1.load({
            url: './data/orderManager_data.json'
        });
    }) ;

    var searchBtn2 = new Rui.ui.LButton('searchBtn2');
    
    searchBtn2.on('click', function(e) {
        dataSet1.load({
            url: './data/orderManager_data.json'
        });
    }) ;


    searchBtn1.click();
    
    guideManager = new Rui.ui.LGuideManager({ pageName: 'orderMng', params: { combo1: combo1, columnModel1: columnModel1, grid1: grid1, grid2: grid2 }, debug: false });
});

function doExpandSearchBar(searchId) {
    var searchPanelEl = Rui.select('#' + searchId + ' .searchBox tr:first-child');
    if(searchPanelEl.isShow()) {
        searchPanelEl.hide();
    } else {
        searchPanelEl.show();
    }
}

function doTutorial(method) {
    guideManager.invokeGuideFn(method);
}
