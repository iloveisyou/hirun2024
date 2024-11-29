
var prodDs = null;
var productDs = null; 
var prodOrderDs = null;
var productReviewDs = null;
var guideManager = null;
var userNm = null;
var searchType = 0; // 조회조건 0:제품코드  1:제품명
var txtSearchWord = null;
var isSelected = false;
var onMouseDown = null;
Rui.onReady(function() {
    /*******************
     * 변수 및 객체 선언
     *******************/
    var userId = null;
    var agency = null;
    var dd, dd2;

    var cnt = 0; 
    //Web Storage
    var manager = new Rui.webdb.LWebStorage(new Rui.webdb.LCookieProvider());
    if(manager.get("userId",0) != 0){
         userId = manager.get("userId",0);
         userNm = manager.get("userName",0);
         agency = manager.get("companyName",0);
    }

    /*******************
     * 버튼 선언 및 이벤트 
     *********************/
    Rui.get('agency').setValue(agency);
    Rui.get('order').setValue(userNm);

    var txtBalances = new Rui.ui.form.LNumberBox({
         applyTo: 'balances',
         placeholder: '숫자를 입력해주세요.',
         minValue: -10,
         maxValue: 9999999999,
         decimalPrecision: 0,
         defaultValue: 0
     });

     var txtRemCredit = new Rui.ui.form.LNumberBox({
         applyTo:'credit',
         placeholder: '숫자를 입력해주세요.',
         minValue: -10,
         maxValue: 9999999999,
         decimalPrecision: 0,
         defaultValue: 0
     });

     var btnAddr1 = new Rui.ui.LButton('addr1');
     var btnAddr2 = new Rui.ui.LButton('addr2');
     var btnAddrList = new Rui.ui.LButton('addrList');

     /*
     var btnAddProdcut = new Rui.ui.LButton('addProduct',{
         label:'추가',
         width:150
     });
     */
     var handleSubmit = function() {
         this.submit(true);
     };

     var handleCancel = function() {
         this.cancel(true);
     };

    var dm = new Rui.data.LDataSetManager();
    var dm2 = new Rui.data.LDataSetManager();
    var userDs = new Rui.data.LJsonDataSet({
        id: 'user',
        fields: [
            { id: 'userId' },
            { id: 'userName'},
            { id: 'deposit', type:'number' },
            { id: 'credit', type:'number' }
        ]
    });

    var addrDs = new Rui.data.LJsonDataSet({
        id: 'userAddr',
        fields: [
            { id: 'zipCode' },
            { id: 'addr1' },
            { id: 'deliveryType' },
            { id: 'destination' },
            { id: 'phone1 '},
            { id: 'phone2' },
            { id: 'addrType' },
            { id: 'userId', type: 'number' }
        ]
    });

    productDs = new Rui.data.LJsonDataSet({
        id: 'product',
        fields: [
            { id: 'productId' },
            { id: 'productName' },
            { id: 'companyName' },
            { id: 'productType' },
            { id: 'salePrice', type:'number' },
            { id: 'stockQty' , type:'number' },
            { id: 'spec1' },
            { id: 'img1' },
            { id: 'img2' }
           
        ]
    });

    productReviewDs = new Rui.data.LJsonDataSet({
        id: 'customBoard',
        fields: [
            { id: 'productId' },
            { id: 'content' },
            { id: 'created'},
            { id: 'writer' },
            { id: 'img1' },
            { id: 'estimation' },
            { id: 'feel' }
           
        ]
    });

    prodOrderDs = new Rui.data.LJsonDataSet({
        id: 'productOrder',
        fields: [
            { id: 'productId' },
            { id: 'productName' },
            { id: 'companyName'},
            { id: 'productType' },
            { id: 'salePrice', type:'number' },
            { id: 'orderQty' , type:'number' },
            { id: 'orderPrice' , type:'number' },
            { id: 'sellerName' },
            { id: 'eventItem', defaultValue:'N'},
            { id: 'orderDate', type: 'date', defaultValue: new Date() }
        ]
    });

    var bind1 = new Rui.data.LBind({
        groupId: 'deliveryForm',
        dataSet: addrDs,
        bind: true,
        bindInfo: [
            { id: 'zipCode', ctrlId: 'zipcode', value: 'value' },
            { id: 'addr1', ctrlId: 'address', value: 'value' },
            { id: 'deliveryType', ctrlId: 'delivery', value: 'value' },
            { id: 'destination', ctrlId: 'destination', value: 'value' },
            { id: 'phone1', ctrlId: 'phone1', value: 'value' },
            { id: 'phone2', ctrlId: 'phone2', value: 'value' }
        ]
    });

    var bind2 = new Rui.data.LBind({
        groupId: 'userForm',
        dataSet: userDs,
        bind: true,
        bindInfo: [
            { id: 'userName', ctrlId: 'order', value: 'value' },
            //{ id: 'agency', ctrlId: 'address', value: 'value' },
            { id: 'deposit', ctrlId: 'balances', value: 'value'},
            { id: 'credit', ctrlId: 'credit', value: 'value'}
        ]
    });

    dm.loadDataSet({
        url: (userId == 'demo1') ? './data/user1.json' : './data/user2.json',
        dataSets: [ userDs, addrDs ]
    });

    dm2.loadDataSet({
        url: './data/product_data.json',
        dataSets: [ productDs, prodOrderDs, productReviewDs]
    });

    productReviewDs.load({
        url: './data/product_review.json',
        dataSet: [ productReviewDs]
    })

   prodDs = productDs.clone('product');
   prodDs.clearData();

   // 자동 완성
    var search1Ds = new Rui.data.LJsonDataSet({
        id: 'search1Ds',
        fields:[
            {id: 'text'}
        ]
    }); 

   var search2Ds = new Rui.data.LJsonDataSet({
        id: 'search2Ds',
        fields:[
            {id: 'text'}
        ]
    }); 

    search1Ds.load({
         url: './data/newOrder_autocomplete1.json'
     });

    search2Ds.load({
        url: './data/newOrder_autocomplete2.json'
    });

    txtSearchWord = new Rui.ui.form.LTextBox({
        applyTo:'searchWord',
        filterMode: 'local',
        displayField: 'text',
        width:200,
        placeholder: '제품코드 예) TV_47LM6200',
        dataSet: search1Ds,
        autoComplete : true
    });

    var ProductColumnModel = new Rui.ui.grid.LColumnModel({
        autoWidth: true,
        columns: [
              new Rui.ui.grid.LStateColumn(),
              new Rui.ui.grid.LSelectionColumn(),
              // new Rui.ui.grid.LNumberColumn(),
              { field: 'productId', label: '제품번호' },
              { field: 'productName', label: '제품명', },
              { field: 'productType', label: '카테고리', },
              { field: 'stockQty', label: '재고수량', renderer:'number' },
              { field: 'salePrice', label: '가격', renderer:'money' }
        ]
    });

    var grid1 = new Rui.ui.grid.LGridPanel({
        columnModel: ProductColumnModel,
        dataSet: prodDs,
        height: 200,
        scrollerConfig: {
            scrollbar: 'y'
        },
        autoWidth: true
    });

    grid1.render('grid1');

    var columnModel1 = new Rui.ui.grid.LColumnModel({
        autoWidth: true,
        columns: [
              new Rui.ui.grid.LStateColumn(),
              new Rui.ui.grid.LSelectionColumn(),
              { field: 'productId', label: '제품번호', sortable:true },
              { field: 'productName', label: '제품명', width: 120, sortable:true },
              { field: 'eventItem', label: '특판', hidden:true, align: 'center'},
              { field: 'salePrice', label: '가격', align: 'right', renderer:'money'},
              { field: 'orderQty', label: '수량', align: 'right', width:50, editor: new Rui.ui.form.LNumberBox({decimalPrecision: 0, minValue: -1, maxValue: 10000, defaultValue:1 }),renderer: function(val, p, record){
                  if(record.get('eventItem') == 'Y') 
                      p.editable = false;
                  else 
                      p.editable = true;
                  return val;
              }},
              { field: 'orderPrice', label: '주문가격', align: 'right', renderRow: true, sumType: 'sum', renderer: 'money',editor: new Rui.ui.form.LNumberBox() ,renderer: function(val, p, record){
                  p.css.push('L-grid-bg-color-sum');
                  var valc = record.get('orderQty') * record.get('salePrice');
                  return Rui.util.LFormat.moneyFormat(valc);
              }},
              { field: 'orderDate', label: '배송준비일', align: 'center', editor: new Rui.ui.form.LDateBox(), renderer: Rui.util.LRenderer.dateRenderer()},
              { field: 'sellerName', label: '주문자', align: 'center'},
              { id: 'modifyBtn', label: '변경', width:56, align:'center', renderer: function(val) { return '<img src="./assets/neworder/change.png" id="btnModify" >'; } },
              { id: 'cancelBtn', label: '삭제', width:52, align:'center', renderer: function(val) { return '<img src="./assets/neworder/trash.png" >'; } }
        ]
    });

    var grid2 = new Rui.ui.grid.LGridPanel({
        columnModel: columnModel1,
        dataSet: prodOrderDs,
        view: new Rui.ui.grid.LExpandableView({
            dataSet: prodOrderDs,
            columnModel:  columnModel1
        }),
        width: 985,
        height: 200,
        autoWidth: true
    });

    grid2.render('grid2');

    // drag and drop
    dd = new Rui.dd.LDDProxy({
        id: 'grid1',
        group: 'default',
        attributes: {
            dragElId: 'grid-row-proxy',
            resizeFrame: false,
            useShim: true
        }
    });

    var view2 = grid2.getView();
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
     Rui.select('.init-tutorial').on('click', function(e) {
         guideManager.clear();
         document.location.reload();
     });
    
     txtSearchWord.on('collapse', function(e){
         searchProduct();
    });

     /*
     btnSearch.on('click', function(e){
          searchProduct();
     });
     */
     btnAddr1.on('click', function(e){
         addrDs.setRow(0);
      });
     btnAddr2.on('click', function(e){
         addrDs.setRow(1);
     });

     search1Ds.on('dataChanged', function(e){
       if(e.target.data.length > 0){
           searchType = 0;
           return;
       }
       else{
           searchType = 1;
           txtSearchWord.addPlaceholder('제품명 예)LG옵티머스 G Pro')
           txtSearchWord.setDataSet(search2Ds);
       }
     });

     search2Ds.on('dataChanged', function(e){
         if(e.target.data.length > 0){
             searchType = 1;
             return;
         }
         else{
             searchType = 0;
             txtSearchWord.addPlaceholder('제품코드 예) TV_47LM6200')
             txtSearchWord.setDataSet(search1Ds);
         }
       });

    productDs.on('load', function(e){
        if(cnt > 0) return;
        var color1 = '#f5f5f5';            
        var tempStr =  '<table class="marquee-table">';

        for(var i=0, len = productDs.getCount(); i < len; i++){
            if(i%2 == 0){
                tempStr += '<tr class="marquee-tr"><td align="center">';
            }
            else 
                tempStr += '<tr><td align="center">';

                var record = productDs.getAt(i);
                tempStr += '<img class="marquee-product-img" src="' + './assets/neworder/product/' + record.get('img2') + '"width="65px" height="65px"/></td>';
                tempStr += '<td><img src="./assets/neworder/list.png"/>&nbsp [이벤트 상품] ' + record.get('productId') + ' ' + 
                    record.get('productName') + '가격: ' + record.get('salePrice') + '원 '+
                    '</td><td><div  border="0" class="button-marquee-add"  onclick="specialOrder(' + "'" + record.get('productId').trim() + "'" + "," + record.get('stockQty') + ');"/>';
                tempStr += '</td></tr>';
        }
        tempStr += '</table>';

        Rui.getDom('eventList').innerHTML = tempStr;
        cnt++; 
    });

    /*
    btnAddProdcut.on('click', function(e){
         if(!isSelected){
             Rui.alert('로우를 추가하기 위해 체크박스를 선택해 주세요.');
             return;
         }
          addProduct(1);
         //prodDs.clearData();
         //하나씩 선택한 것은 지워지나 여러개 동시에 추가하면 에러남. 
         if(prodDs.getMarkedCount() > 0) {
             prodDs.removeMarkedRow();
         } else {
             var row = prodDs.getRow();
             if(row < 0) return;
             prodDs.removeAt(row);
         }
         isSelected = false;
     });
    */

     prodDs.on('rowSelectMark',function(e){
         isSelected = (e.row > -1)? true : false;
         return isSelected;
     });

     btnAddrList.on('click', function(e){
         var dialog1 = new Rui.ui.LDialog({
             width: 300,
             close: false,
             visible: false,
             postmethod: 'async',
             header: '주소록 찾기',
             body:'주소록을 찾는 폼입니다.',
             buttons: [
                 { text: '예', handler: handleSubmit, isDefault: true },
                 { text: '아니오', handler: handleCancel }
             ]
         });

         dialog1.render(document.body);
         dialog1.show();
     });

    view2.on('expand', function(e) {
         // isFirst : 처음 펼쳐졌는지 여부
         if(e.isFirst) {
             // expandableTarget : target되는 dom 객체
             var targetEl = Rui.get(e.expandableTarget);
             // targetEl의 dom id를 로딩할 페이지에서 그리드가 render 메소드를 호출할 경우 인수로 사용한다.
             var row = prodOrderDs.getRow();
             if(row < 0) return;
             var record = prodOrderDs.getAt(row);
             var prodId = record.get('productId').trim();
             var qty = record.get('orderQty');
             var option = {
                 url: './newOrderModify.jsp?domId=' + targetEl.id + '&prodId=' + prodId + '&orderQty=' + qty +'&rowIndex=' + row
             };
             targetEl.appendChildByAjax(option);
         }
     });

     var expandRow = -1;
     onMouseDown = function(e) {
         var targetEl = Rui.get(e.target);
         var parent = targetEl.findParent('#grid2', 20);
         
         if(parent) return;
         Rui.get('layout-grid0').show();
         Rui.get('layout-grid1').show();
         
         var txt = e.target.innerText; 
         if(expandRow > -1 && (txt == '확인' ))
             view2.setExpand(expandRow, false);
     };
     
     grid1.on('cellClick', function(e){
        if(e.col < 0 || e.row < 0) return; 

        var row = prodDs.getRow();
        if(row < 0) return;
        var record = prodDs.getAt(row);

        getProductDetail(record.get('productId'));
        getProductReview(record.get('productId'));
     });

     grid2.on('cellClick', function(e){
         var column = columnModel1.getColumnAt(e.col, true);
         if(column.id == 'modifyBtn') {
             if (view2.hasExpand(e.row)) {
                 view2.setExpand(e.row, false);
                 grid2.availableHeight();
                 Rui.getBody().unOn('mousedown', onMouseDown);
             }  else {
            	 if(expandRow > -1)
            		  view2.setExpand(expandRow, false);
                 expandRow = e.row;
                 view2.setExpand(e.row, true);
                 //var height = Rui.util.LDom.getViewportHeight();
                 //grid2.setHeight(height - 400);
                 Rui.getBody().on('mousedown', onMouseDown);
             }
         } else if(column.id == 'cancelBtn'){
             var row = prodOrderDs.getRow();
             if(row < 0) return;
             prodOrderDs.removeAt(row); 
             expandRow = -1;
        }else{ // 제품 상세
             var row = prodOrderDs.getRow();
             if(row < 0) return;
             var record = prodOrderDs.getAt(row);

             getProductDetail(record.get('productId'));
             getProductReview(record.get('productId'));
        }
     });

     // 주문정보 로딩
     prodOrderDs.on('load', function(e){
         prodOrderDs.clearData();
     });

     prodOrderDs.on('rowPosChanged', function(e) {
     });

     dd.clickValidator = function(e) {
         if (Rui.get(e.target).findParent('.L-grid-col') == null) {
             return false;
         }
         return true;
     };

     dd.on('dragEvent', function(args) {
         var el = Rui.get(this.getDragEl());
         var x = Rui.util.LEvent.getPageX(args.e);
         var y = Rui.util.LEvent.getPageY(args.e);
         el.setXY([x - 5, y - 5]);
         
         var rowEl = Rui.get(args.e.target).findParent('.L-grid-row');
         if(rowEl == null) return;
         var proxyEl = Rui.get('grid-row-proxy');
         if(proxyEl.dom.childNodes.length == 0) {
            // proxyEl.appendChild(rowEl.dom.cloneNode(true));
             var rowId = 'r' + Rui.util.LDom.findStringInClassName(rowEl.dom, 'L-grid-row-r');
             var rowIdClass = 'L-grid-row-' + rowId;
             var row = productDs.getRow();
             var record = productDs.getAt(row);

             var tb = '<div class="L-grid-row '+ rowIdClass + '">';
             tb += '<table  class="input-table-drag" style="background-color: #f5f5f5;width:100%;">';
             tb += '<tr style="height:65px;"><td><img class="marquee-drag-img"  src="' +'./assets/neworder/product/' +  record.get('img2') + '"/></td>';
             tb += '<td >' + record.get('companyName') + '</td>';
             tb += '<td >' + record.get('productType') + '</td>';
             tb += '<td >' + record.get('productName') + '</td>';
             tb += '</tr></table></div>';
             proxyEl.appendChild(tb);
             proxyEl.setWidth(rowEl.getWidth());
             proxyEl.setHeight(rowEl.getHeight());
         }
     });

     dd.on('dragDropEvent', function(e) {
             var proxyEl = Rui.get('grid-row-proxy');
             var rowEl = proxyEl.select('.L-grid-row').getAt(0);
             var rowId = 'r' + Rui.util.LDom.findStringInClassName(rowEl.dom, 'L-grid-row-r');
             var record = prodDs.get(rowId);
             var row = prodOrderDs.newRecord();
             if (row !== false) {
             var rd = prodOrderDs.getAt(row);
             rd.set('productId', record.get('productId'));
             rd.set('productName', record.get('productName'));
             rd.set('companyName', record.get('companyName'));
             rd.set('productType', record.get('productType'));
             rd.set('eventItem', 'N');
             rd.set('salePrice', record.get('salePrice'));
             rd.set('orderQty', 1);
             rd.set('orderPrice', 1 * record.get('salePrice'));
             rd.set('orderDate', new Date());
             rd.set('sellerName', userNm);
             
             getProductDetail(record.get('productId'));
             getProductReview(record.get('productId'));
         }
         proxyEl.html('');
     });

     dd.on('endDragEvent', function(e) {
         Rui.get('grid1').setStyle('left', '');
         Rui.get('grid1').setStyle('top', '');
         Rui.get('grid1').setStyle('position', '');
     });
     var dd2 = new Rui.dd.LDDTarget({
         id: 'grid2'
     });

    guideManager = new Rui.ui.LGuideManager({ 
            pageName: 'newOrder', 
	            params: { txtSearchWord: txtSearchWord, prodDs:prodDs, prodOrderDs: prodOrderDs 
	        }, 
            debug: false
        });
    });
    
   
    function getProductDetail(prodId){
        for(var i=0, len = productDs.getCount(); i < len; i++){
            var record = productDs.getAt(i);
            if(record.get('productId') == prodId){
            Rui.getDom('companyName2').innerHTML = record.get('companyName');
            Rui.getDom('phoneImage').src = "./assets/neworder/product/" + record.get('img1');
            Rui.getDom('productName2').innerHTML = record.get('productName');
            Rui.getDom('salePrice2').innerHTML = record.get('salePrice');
            Rui.getDom('category2').innerHTML = record.get('productType');
            Rui.getDom('spec2').innerHTML = record.get('spec1');
        }
   }
};

// 제품 사용소감 
function getProductReview(prodId){
    var reviewDivEl = Rui.get('review');
    if(Rui.get('reviewTbl') != null)
    reviewDivEl.removeChild(Rui.get('reviewTbl'));

    var tb = '<div id="reviewTbl" ><table border="0" class="review-table">';
    for(var i=0,len = productReviewDs.getCount(); i<len; i++){
        var record = productReviewDs.getAt(i);
        if(record.get('productId') != prodId) continue;

        var cnt = record.get('estimation');
        var imgName = '';
        for(var k=0; k<cnt; k++){
            if(record.get('feel') == 'Y')
                imgName += '<img src="./assets/neworder/grade.png"/>';
            else
                imgName += '<img src="./assets/neworder/grade_empty.png"/>';
        }

        tb+= (i%2 == 0)?'<tr class="review-table-tr">':'<tr>';
        tb+= '<td class="review-table-td">' + record.get('img1') + '</td>';
        tb+= '<td class="review-table-td">' + record.get('writer') +'</td>';
        tb+= '<td class="review-table-td-wd">' + record.get('content') +'</td>';
        tb+= '<td class="review-table-td-date">' + record.get('created') +'</td>';
        tb+= '<td class="reveiew-table-td-estimation">' + imgName +'</td></tr>';
    }

    tb += '</table></div>';
    reviewDivEl = Rui.get('review');
    reviewDivEl.appendChild(tb);
};

// 특판 세일 이벤트 
function specialOrder(productId, qty){
    for(var i=0, len = productDs.getCount(); i<len; i++){
        var record = productDs.getAt(i);
            if(record.get('productId').trim() == productId){
            var row = prodOrderDs.newRecord();
            if (row !== false) {
                var rd = prodOrderDs.getAt(row);
                rd.set('productId', record.get('productId'));
                rd.set('productName', record.get('productName'));
                rd.set('companyName', record.get('companyName'));
                rd.set('productType', record.get('productType'));
                rd.set('salePrice', record.get('salePrice'));
                rd.set('eventItem', 'Y');
                rd.set('orderQty', qty);
                rd.set('orderPrice', qty * record.get('salePrice'));
                rd.set('orderDate', new Date());
                rd.set('sellerName', userNm);

                getProductDetail(record.get('productId'));
                getProductReview(record.get('productId'));
                
                return;
            }
        }
    }
}
function doTutorial(method) {
    guideManager.invokeGuideFn(method);
}

function searchProduct(e){
    for(var i=0, len = productDs.getCount(); i < len; i++){
         var record = productDs.getAt(i);
         var cmpareWord = searchType == 0 ? record.get('productId').trim() : record.get('productName').trim();
         if(cmpareWord == txtSearchWord.getValue()){
             var row = prodDs.newRecord();
             if(row !== false){
                var rd = prodDs.getAt(row);
                rd.set('productId', record.get('productId'));
                rd.set('productName', record.get('productName'));
                rd.set('companyName', record.get('companyName'));
                rd.set('productType', record.get('productType'));
                rd.set('stockQty', record.get('stockQty'));
                rd.set('salePrice', record.get('salePrice'));
                
                getProductDetail(record.get('productId'));
                getProductReview(record.get('productId'));
             }
         }
    }
}

function fnAddProduct(){
    if(!isSelected){
        Rui.alert('로우를 추가하기 위해 체크박스를 선택해 주세요.');
        return;
    }
     addProduct(1);
    //prodDs.clearData();
    /* 하나씩 선택한 것은 지워지나 여러개 동시에 추가하면 에러남. */
    if(prodDs.getMarkedCount() > 0) {
        prodDs.removeMarkedRow();
    } else {
        var row = prodDs.getRow();
        if(row < 0) return;
        prodDs.removeAt(row);
    }
    isSelected = false;
}

// 신규주문
function addProduct(qty){
    for(var i=0, len = prodDs.getCount(); i<len; i++){
        
        if(!prodDs.isMarked(i))continue;
        var record = prodDs.getAt(i);
        var row = prodOrderDs.newRecord();
        if (row !== false) {
            var rd = prodOrderDs.getAt(row);
            rd.set('productId', record.get('productId'));
            rd.set('productName', record.get('productName'));
            rd.set('companyName', record.get('companyName'));
            rd.set('productType', record.get('productType'));
            rd.set('eventItem', 'N');
            rd.set('salePrice', record.get('salePrice'));
            rd.set('orderQty', qty);
            rd.set('orderPrice', qty * record.get('salePrice'));
            rd.set('orderDate', new Date());
            rd.set('sellerName', userNm);
        }
    }
};