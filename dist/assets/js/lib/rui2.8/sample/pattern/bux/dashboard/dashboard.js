var guideManager = null;
Rui.onReady(function() {
    /*******************
     * 변수 및 객체 선언
     *******************/
    var webStore = new Rui.webdb.LWebStorage();
    var position = webStore.get('position');

    var dm = new Rui.data.LDataSetManager();

    var fields1 = null;
    if(position == '001') {
        fields1 = [
            { id: 'depth', type: 'number', defaultValue: 0 },
            { id: 'dataType' },
            { id: 'companyName' },
            { id: 'productName' },
            { id: 'monthSaleQty' },
            { id: 'monthRefundsQty' },
            { id: 'monthPoorQty' },
            { id: 'weekSaleQty1' },
            { id: 'weekRefundsQty1' },
            { id: 'weekPoorQty1' },
            { id: 'weekSaleQty2' },
            { id: 'weekRefundsQty2' },
            { id: 'weekPoorQty2' },
            { id: 'weekSaleQty3' },
            { id: 'weekRefundsQty3' },
            { id: 'weekPoorQty3' },
            { id: 'weekSaleQty4' },
            { id: 'weekRefundsQty4' },
            { id: 'weekPoorQty4' },
            { id: 'tooltip' }
        ];
    } else {
        fields1 = [
            { id: 'depth', type: 'number', defaultValue: 0 },
            { id: 'field01' },
            { id: 'field02' },
            { id: 'field03', type: 'date' },
            { id: 'field04' },
            { id: 'field05' },
            { id: 'field06' }
        ];
    }
    
    var dataSet1 = new Rui.data.LJsonDataSet({
        id: 'dataSet1',
        fields: fields1
    });

    var dataSet2 = new Rui.data.LJsonDataSet({
        id: 'dataSet2',
        fields: [
            { id: 'field01' },
            { id: 'field02', type: 'date' },
            { id: 'field03' },
            { id: 'field04' },
            { id: 'field06' },
            { id: 'field05' }
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
            { id: 'field06' }
        ]
    });
     
    var dataSet4 = new Rui.data.LJsonDataSet({
        id: 'dataSet4',
        fields: [
            { id: 'field01' },
            { id: 'field02' },
            { id: 'field03' },
            { id: 'field04' }
        ]
    });
     
    var upDownRenderer = function(val, p, record) {
        var isUp = (val > 3000000) ? 'up' : 'down';
        if(position == '001') {
            isUp = (val > 10) ? 'up' : 'down';
        }
        var color = isUp == 'up' ? '' : 'color:red';
        return '<div><span class="grid-updownbar-' + isUp + '" style="float:left;"></span><span style="float:right;' + color + '">' + val + '</span></div>';
    };

    var levelRenderer = function(val, p, record) {
        var level = 10;
        if(val > 10 && val <= 20) {
            level = 20;
        } else if(val > 20) {
            level = 30;
        }
        return (val) ? '<div class="grid-levelbar-value"><span class="grid-levelbar-' + level + '" ></span>' + val + '</div>' : '';
    };

    var columns1 = null;
    var treeColumnId = 'companyName';
    var freezeColumnId = null;
    var autoWidth = true;
    if(position == '001') {
        freezeColumnId = 'monthPoorQty';
        autoWidth = false;
        columns1 = [
            new Rui.ui.grid.LSelectionColumn(),
            { field: 'companyName', label: '제조사', width: 100, renderer: levelRenderer },
            { field: 'productName', label: '제품명', width: 100, renderer: levelRenderer },
            { field: 'monthSaleQty', label: '월별 주문건수', width: 100, align: 'right', renderer: upDownRenderer },
            { field: 'monthRefundsQty', label: '월별 환불건수', width: 100, align: 'right', renderer: upDownRenderer },
            { field: 'monthPoorQty', label: '월별 불량건수', width: 100, align: 'right', renderer: upDownRenderer },
            { id: 'group1', label: 'W12(3.4~3.8)'},
            { field: 'weekSaleQty1', groupId: 'group1', label: '주문건수', width: 100, align: 'right', renderer: upDownRenderer },
            { field: 'weekRefundsQty1', groupId: 'group1', label: '환불건수', width: 100, align: 'right', renderer: upDownRenderer },
            { field: 'weekPoorQty1', groupId: 'group1', label: '불량건수', width: 100, align: 'right', renderer: upDownRenderer },
            { id: 'group2', label: 'W13(3.10~3.14)'},
            { field: 'weekSaleQty2', groupId: 'group2', label: '주문건수', width: 100, align: 'right', renderer: upDownRenderer },
            { field: 'weekRefundsQty2', groupId: 'group2', label: '환불건수', width: 100, align: 'right', renderer: upDownRenderer },
            { field: 'weekPoorQty2', groupId: 'group2', label: '불량건수', width: 100, align: 'right', renderer: upDownRenderer },
            { id: 'group3', label: 'W14(3.17~3.21)'},
            { field: 'weekSaleQty3', groupId: 'group3', label: '주문건수', width: 100, align: 'right', renderer: upDownRenderer },
            { field: 'weekRefundsQty3', groupId: 'group3', label: '환불건수', width: 100, align: 'right', renderer: upDownRenderer },
            { field: 'weekPoorQty3', groupId: 'group3', label: '불량건수', width: 100, align: 'right', renderer: upDownRenderer },
            { id: 'group4', label: 'W15(3.24~3.28)'},
            { field: 'weekSaleQty4', groupId: 'group4', label: '주문건수', width: 100, align: 'right', renderer: upDownRenderer },
            { field: 'weekRefundsQty4', groupId: 'group4', label: '환불건수', width: 100, align: 'right', renderer: upDownRenderer },
            { field: 'weekPoorQty4', groupId: 'group4', label: '불량건수', width: 100, align: 'right', renderer: upDownRenderer },
        ];
    } else {
        columns1 = [
            new Rui.ui.grid.LSelectionColumn(),
            { field: 'field01', label: '주문번호' },
            { field: 'field02', label: '상품번호' },
            { field: 'field03', label: '주문일', align: 'center', renderer: 'date' },
            { field: 'field04', label: '모델명' },
            { field: 'field05', label: '단가', align: 'right', renderer: upDownRenderer },
            { field: 'field06', label: '상태', align: 'center' }
        ];
        treeColumnId = 'field01';
    }

    var columnModel1 = new Rui.ui.grid.LColumnModel({
        autoWidth: autoWidth,
        columns: columns1,
        freezeColumnId: freezeColumnId
    });

    var gridTooltip = new Rui.ui.LTooltip({
        showmove: true
    });

    var treeGridView = new Rui.ui.grid.LTreeGridView({
        defaultOpenDepth: -1,
        columnModel: columnModel1,
        dataSet: dataSet1,
        tooltip: gridTooltip,
        fields: {
            depthId: 'depth'
        },
        treeColumnId: treeColumnId
    });

    var grid1 = new Rui.ui.grid.LGridPanel({
        columnModel: columnModel1,
        dataSet: dataSet1,
        view: treeGridView,
        selectionModel: new Rui.ui.grid.LTreeGridSelectionModel(),
        autoWidth: true,
        height: 200
    });

    grid1.render('grid1');
    
    var columnModel2 = new Rui.ui.grid.LColumnModel({
        autoWidth: true,
        defaultSortable: true,
        columns: [
            { field: 'field01', label: '반품번호', width: 200 },
            { field: 'field02', label: '반품요청일', width: 200, align: 'center', renderer: 'date' },
            { field: 'field03', label: '주문번호', width: 200 },
            { field: 'field04', label: '상품번호', width: 200 },
            { field: 'field06', label: '모델명', width: 100 },
            { field: 'field05', label: '처리상태', width: 200, align: 'center' }
        ]
    });
    
    var grid2 = new Rui.ui.grid.LGridPanel({
        columnModel: columnModel2,
        dataSet: dataSet2,
        width: 985,
        height: 200,
        autoWidth: true
    });

    grid2.render('grid2');

    var columnModel3 = new Rui.ui.grid.LColumnModel({
        autoWidth: true,
        columns: [
            { field: 'field01', label: '대리점명' },
            { field: 'field02', label: '입금일', align: 'center', renderer: 'date' },
            { field: 'field03', label: '입금은행'},
            { field: 'field04', label: '입금액', align: 'center', renderer: 'money' },
            { field: 'field05', label: '지불방식', align: 'center' },
            { field: 'field06', label: '계좌번호', align: 'center' }
        ]
    });
    
    var grid3 = new Rui.ui.grid.LGridPanel({
        columnModel: columnModel3,
        dataSet: dataSet3,
        width: 300,
        height: 200,
        autoWidth: true
    });

    grid3.render('grid3');

    var columnModel4 = new Rui.ui.grid.LColumnModel({
        autoWidth: true,
        columns: [
            { field: 'field01', label: '대리점명' },
            { field: 'field02', label: '기준월', align: 'center', renderer: function(val) { return val.substring(0, 4) + '-' + val.substring(4);} },
            { field: 'field03', label: '여신한도', align: 'right', renderer: 'money' },
            { field: 'field04', label: '잔여여신', align: 'right', renderer: 'money' }
        ]
    });
    
    var grid4 = new Rui.ui.grid.LGridPanel({
        test: 'grid4',
        columnModel: columnModel4,
        dataSet: dataSet4,
        width: 490,
        height: 200,
        autoWidth: true
    });

    grid4.render('grid4');

    new Rui.ui.LGallery({ 
        applyTo: 'imageGallery',
        viewCount: 6, 
        renderer: function(e) {
            if(e.index > 8) return '';
            return '<img src="./../images/product_review/product_' + (e.index + 1) + '.png">';
        },
        detailRenderer: function(e) {
            var idx = (e.index + 1);
            return '<img src="./../images/product_review/product_' + idx + '.png"><div><h3>Gallery' + idx + '</h3><a href="javascript:alert(\'버튼 링크 구현\')" style="cursor:pointer;"><img src="./assets/galleryDetailButtons.jpg"></a></div>';
        }
    });

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

    dm.on('load', function(e) {
        if(position == '002') {
            grid1.setCellConfig(3, 'field04', 'tooltipText', 'LG옵티머스 G<br>인피니아 42LN<br>트롬6모션 FR2558<br>휘센 FQ166');
            grid1.setCellConfig(8, 'field05', 'tooltipText', 'Nexus4 외 4건입니다.');
            grid1.setCellConfig(18, 'field03', 'tooltipText', '5월 25일은 배송지연건이 많습니다.');
        }
    });
    
    Rui.select('.init-tutorial').on('click', function(e) {
        guideManager.clear();
        document.location.reload();
    });

    /********************
     * 버튼 선언 및 이벤트
     ********************/
    var url = './data/dashboard_data.json';
    if(position == '001') url = './data/dashboard_data1.json';
    dm.loadDataSet({
        url: url,
        dataSets: [ dataSet1, dataSet2, dataSet3, dataSet4 ]
    });

    guideManager = new Rui.ui.LGuideManager({ pageName: 'dashboard' + (position == '001' ? '001' : ''), params: { grid1: grid1, grid2: grid2, columnModel2: columnModel2, grid3: grid3, grid4: grid4 }, debug: false });
});

function doTutorial(method) {
    guideManager.invokeGuideFn(method);
}
