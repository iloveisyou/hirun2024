Rui.ui.guide.Index = function(config) {
    Rui.ui.guide.Index.superclass.constructor.call(this, config);
};

Rui.extend(Rui.ui.guide.Index, Rui.ui.LGuide, {
    onReady: function() {
        this.loadPage();
        this.showDialog1();
    },
    loadPage: function() {
        if(this.getInt('loadPage') == 0) {
            setTimeout(function() {
                var r = Rui.select('.ux_login_wrap').getAt(0).getRegion();
                var dialogRegion = Rui.util.LObject.clone(r);

                dialogRegion.top += 260;
                //dialogRegion.left -= 20;
                dialogRegion.right += 50;
                dialogRegion.bottom += 140;
                var focusNotification1 = new Rui.ui.LFocusNotification({ 
                    id: 'teset',
                    text: 'RUI 기능의 튜토리얼을 시작합니다. 페이지별/로그인 아이디(demo1/demo2)별 튜토리얼이 다르게 작동합니다.<br>데모에서 사용되는 모든 상태정보는 로컬리소스를 사용하는 HTML5 웹스토리지 기능을 적용하였습니다.<br>',
                    view: r, dialog: dialogRegion }
                );

                focusNotification1.render(document.body);
            }, 500);
        };
    },
    showDialog1: function(){
        if(this.getInt('showDialog1') == 0) {
            var dialog1 = this.params.dialog1;
            dialog1.on('show', function(e){
                setTimeout(function() {
                    var container = dialog1.getContainer();
                    var r = container.getRegion();
                    var dialogRegion = Rui.util.LObject.clone(r);
                    
                    dialogRegion.top = dialogRegion.bottom + 10;
                    dialogRegion.bottom = dialogRegion.top + 160;
                    var focusNotification1 = new Rui.ui.LFocusNotification({ 
                        text: '기존 윈도우 팝업방식이 아닌 애니메이션이 가능한 다이얼로그 상자를 적용하였습니다.',
                        view: r, dialog: dialogRegion }
                    );

                    focusNotification1.render(document.body);
                }, 1000);
            }, this, true);
        };
    }
});
