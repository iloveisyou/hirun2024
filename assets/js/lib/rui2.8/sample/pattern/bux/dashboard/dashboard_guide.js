Rui.ui.guide.Dashboard = function(config) {
    Rui.ui.guide.Dashboard.superclass.constructor.call(this, config);
}

Rui.extend(Rui.ui.guide.Dashboard, Rui.ui.LGuide, {
    onReady: function() {
        this.loadPage();
        this.focusGrid2();
        this.focusGrid3();
        this.focusGrid4();
    },
    loadPage: function() {
        if(this.getInt('loadPage') == 0) {
            this.doLoadPage();
        };
    },
    doLoadPage: function() {
        var r = Rui.select('.ux-chart').getAt(0).getRegion();
        var dialogRegion = Rui.util.LObject.clone(r);

        dialogRegion.top += 180;
        dialogRegion.left += 400;
        dialogRegion.right -= 400;
        dialogRegion.bottom = dialogRegion.top + 210;

        var focusNotification1 = new Rui.ui.LFocusNotification({ 
            text: 'RUI 기능의 튜토리얼을 시작합니다. 페이지별/로그인 아이디(demo1/demo2)별 튜토리얼이 다르게 작동합니다.<br><br>화면 상단에 보이시는 차트는 오픈 소스 차트입니다. 모든 브라우저에서 작동하는 차트로 다양한 OS와 브라우저에서 잘 작동됩니다. 하단의 각 그리드들을 한번씩 클릭해보세요.',
            view: r, dialog: dialogRegion }
        );

        focusNotification1.on('closed', function(e) {
            var r = Rui.get('grid1').getRegion();
            var dialogRegion = Rui.util.LObject.clone(r);
            
            dialogRegion.top += 200;
            dialogRegion.left += 400;
            dialogRegion.right -= 400;
            dialogRegion.bottom = dialogRegion.top + 160;

            var focusNotification2 = new Rui.ui.LFocusNotification({ 
                text: '주문 현황 그리드에는 트리그리드와 툴팁이 적용되어 있습니다. 접혀있는 row를 펼쳐보시거나 빨간색 모양이 있는 쉘에 마우스를 올려보세요.',
                view: r, dialog: dialogRegion }
            );
            focusNotification2.render(document.body);
        });
        focusNotification1.render(document.body);
    },
    focusGrid1: function() {
        var grid1 = this.params.grid1;
        var view = grid1.getView();
        view.on('focus', function() {
            if(this.getInt('focusGrid1') == 0) {
                Rui.later(5000, this, this.doFocusGrid1);
            }
        }, this, true);
    },
    doFocusGrid1: function() {
        var grid1 = this.params.grid1;
        var view = grid1.getView();
        var r = view.el.getRegion();
        r.top = r.bottom - 17;
        var dialogRegion = Rui.util.LObject.clone(r);

        dialogRegion.top += 30;
        dialogRegion.left += 330;
        dialogRegion.right -= 330;
        dialogRegion.bottom = dialogRegion.top + 150;

        new Rui.ui.LFocusNotification({ 
            text: '스크롤을 좌우측으로 이동해보세요. 틀고정이 적용되어 있습니다.',
            view: r, dialog: dialogRegion  
        } ).render(document.body);
    },
    focusGrid2: function() {
        var grid2 = this.params.grid2;
        var view = grid2.getView();
        view.on('focus', function(e) {
            if(this.getInt('focusGrid2') == 0) {
                this.doFocusGrid2();
            };
        }, this, true);
    },
    doFocusGrid2: function() {
        var grid2 = this.params.grid2;
        var view = grid2.getView();
        var r = Rui.get(view.getHeaderCellEl(4)).getRegion();
        r.left = r.right - 10;
        r.right = r.right + 10;
        var dialogRegion = Rui.util.LObject.clone(r);

        dialogRegion.top += 50;
        dialogRegion.left -= 50;
        dialogRegion.right += 210;
        dialogRegion.bottom = dialogRegion.top + 150;

        new Rui.ui.LFocusNotification({ 
            text: '헤더 컬럼 우측선을 더블클릭해보세요.',
            view: r, dialog: dialogRegion  
        } ).render(document.body);
    },
    focusGrid3: function() {
        var grid3 = this.params.grid3;
        var view = grid3.getView();
        view.on('focus', function(e) {
            if(this.getInt('focusGrid3') == 0) {
                this.doFocusGrid3();
            };
        }, this, true);
    },
    doFocusGrid3: function() {
        var grid3 = this.params.grid3;
        var view = grid3.getView();
        var r = Rui.get(view.getCellDom(0, 1)).getRegion();
        var dialogRegion = Rui.util.LObject.clone(r);

        dialogRegion.top += 50;
        dialogRegion.left -= 50;
        dialogRegion.right += 170;
        dialogRegion.bottom = dialogRegion.top + 160;

        new Rui.ui.LFocusNotification({ 
            text: '다국어 기능이 탑재되어 있습니다. 사용자 로케일에 따라서 표현을 다르게 합니다.',
            view: r, dialog: dialogRegion  
        } ).render(document.body);
    },
    focusGrid4: function() {
        var grid4 = this.params.grid4;
        var view = grid4.getView();
        view.on('focus', function(e) {
            if(this.getInt('focusGrid4') == 0) {
                this.doFocusGrid4();
            };
        }, this, true);
    },
    doFocusGrid4: function() {
        var grid4 = this.params.grid4;
        var view = grid4.getView();
        var r = Rui.get(view.getCellDom(0, 2)).getRegion();
        var dialogRegion = Rui.util.LObject.clone(r);

        dialogRegion.top += 50;
        dialogRegion.left -= 50;
        dialogRegion.right += 170;
        dialogRegion.bottom = dialogRegion.top + 160;

        new Rui.ui.LFocusNotification({ 
            text: '다국어 기능이 탑재되어 있습니다. 사용자 로케일에 따라서 표현을 다르게 합니다.',
            view: r, dialog: dialogRegion  
        } ).render(document.body);
    }
});
