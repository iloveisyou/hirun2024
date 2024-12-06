Rui.ui.guide.OrderMng = function(config) {
    Rui.ui.guide.OrderMng.superclass.constructor.call(this, config);
};

Rui.extend(Rui.ui.guide.OrderMng, Rui.ui.LGuide, {
    onReady: function() {
        this.loadPage();
        this.focusCombo1();
        this.columnMoveColumnModel1();
        this.focusGrid1();
        this.focusGrid2();
    },
    loadPage: function() {
        if(this.getInt('load', 0) == 0) {
            this.doLoadPage();
        }
    },
    doLoadPage: function(){
        var r = Rui.get('searchBox1').getRegion();
        var dialogRegion = Rui.util.LObject.clone(r);

        dialogRegion.top = dialogRegion.bottom + 20;
        dialogRegion.left += 300;
        dialogRegion.right -= 300;
        dialogRegion.bottom = dialogRegion.top + 220;

        new Rui.ui.LFocusNotification({ 
            text: 'RUI 기능의 튜토리얼을 시작합니다. (이 튜토리얼 기능은 프로젝트에서도 사용이 가능합니다.)<br><br>주문번호, 대리점, 모델명은 자동완성 기능이 적용되어 있습니다.<br>기간은 FromToDateBox가 적용되어 있습니다.<br>검색창 하단의 search 이미지 버튼을 클릭하면 검색 창을 접었다 펼쳐봅니다.',
            view: r, dialog: dialogRegion }
        ).render(document.body);
    },
    focusCombo1: function() {
        var combo1 = this.params.combo1;
        combo1.on('focus', function(e) {
            if(this.getInt('focusCombo') == 0) {
                this.doFocusCombo1();
            }
        }, this, true);
    },
    doFocusCombo1: function() {
        var grid1 = this.params.grid1;
        var r = Rui.get(grid1.getView().getCellDom(0, 7)).getRegion();
        var dialogRegion = Rui.util.LObject.clone(r);
        dialogRegion.top = dialogRegion.bottom + 20;
        dialogRegion.left -= 100;
        dialogRegion.bottom = dialogRegion.top + 160;

        new Rui.ui.LFocusNotification({ 
            id: 'focusCombo',
            text: '배송완료를 선택한후 우측 상단에 알림창에서 [취소하기] 버튼을 선택하세요.',
            view: r,
            dialog: dialogRegion
        } ).render(document.body);
    },
    columnMoveColumnModel1: function() {
        var columnModel1 = this.params.columnModel1;
        columnModel1.on('columnMove', function(e) {
            if(this.getInt('columnMove') == 0) {
                Rui.later(2000, this, this.doColumnmoveColumnModel1);
            };
        }, this, true);
    },
    doColumnmoveColumnModel1: function() {
        var grid1 = this.params.grid1;
        var r = Rui.get(grid1.getView().getHeaderCellEl(2)).getRegion();
        r.left = r.right - 30;
        var dialogRegion = Rui.util.LObject.clone(r);

        dialogRegion.top = dialogRegion.bottom + 20;
        dialogRegion.left = dialogRegion.left - 50;
        dialogRegion.right = dialogRegion.right + 120;
        dialogRegion.bottom = dialogRegion.top + 160;

        new Rui.ui.LFocusNotification({ 
            text: '그리드 헤더에 마우스를 올려보세요.',
            view: r ,
            dialog: dialogRegion 
        } ).render(document.body);
    },
    focusGrid1: function() {
        var grid1 = this.params.grid1;
        var view = grid1.getView();
        view.on('focus', function(e) {
            if(this.getInt('orderMng_focusGrid1') == 0) {
                var r = Rui.get(view.getCellDom(0, 7)).getRegion();
                var dialogRegion = Rui.util.LObject.clone(r);

                dialogRegion.top = dialogRegion.bottom + 20;
                dialogRegion.left = dialogRegion.left - 50;
                dialogRegion.bottom = dialogRegion.top + 150;
                
                new Rui.ui.LFocusNotification({ 
                    text: '상태를 변경해 보세요.',
                    view: r, dialog: dialogRegion
                } ).render(document.body);
            };
        }, this, true);
    },
    focusGrid2: function(){
        var grid2 = this.params.grid2;
        var view = grid2.getView();
        view.on('focus', function(e){
            if (this.getInt('focusGrid2') == 0) {
                this.doFocusGrid2();
            }
        }, this, true);
    },
    doFocusGrid2: function(){
        var grid2 = this.params.grid2;
        var view = grid2.getView();
        var r = Rui.get(view.el).getRegion();
        var dialogRegion = Rui.util.LObject.clone(r);

        dialogRegion.top = dialogRegion.bottom + 20;
        dialogRegion.left = dialogRegion.left + 300;
        dialogRegion.right = dialogRegion.right - 500;
        dialogRegion.bottom = dialogRegion.top + 160;
        
        new Rui.ui.LFocusNotification({
            text: '소계와 합계가 적용되어 있습니다.',
            view: r, dialog: dialogRegion
        }).render(document.body);
    },
    notification: function() {
        var grid1 = this.params.grid1;
        if(this.getInt('notification') == 0) {
            Rui.later(1000, this, this.doNotification);
        }
    },
    doNotification: function() {
        var grid1 = this.params.grid1;
        var r = Rui.get(grid1.getView().getHeaderCellEl(2)).getRegion();
        r.left = r.left + 115;
        r.right = r.right + 7;
        var dialogRegion = Rui.util.LObject.clone(r);
        dialogRegion.top = dialogRegion.bottom + 20;
        dialogRegion.left = dialogRegion.left - 30;
        dialogRegion.right = dialogRegion.right + 180;
        dialogRegion.bottom = dialogRegion.top + 160;
        new Rui.ui.LFocusNotification({ 
            text: '주문처를 마우스로 Drag 하여 담당자 컬럼 우측으로 이동해보세요.',
            view: r,
            dialog: dialogRegion 
        } ).render(document.body);
    }
});
