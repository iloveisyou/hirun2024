Rui.ui.guide.NewOrder = function(config) {
    Rui.ui.guide.NewOrder.superclass.constructor.call(this, config);
};

Rui.extend(Rui.ui.guide.NewOrder, Rui.ui.LGuide, {
    onReady: function() {
        this.loadPage();
        this.prodDs();
        this.prodOrderDs();
    },

    loadPage: function() {
         if(this.getInt('loadPage') == 0) {
             this.doLoadPage();
         }
    },

    doLoadPage: function(){
        var r = Rui.select('#searchWord').getAt(0).getRegion();
        var dialogRegion = Rui.util.LObject.clone(r);

        dialogRegion.top = dialogRegion.bottom + 10;
        dialogRegion.right += 90;
        dialogRegion.bottom = dialogRegion.top + 160;

        var focusNotification1 = new Rui.ui.LFocusNotification({ 
            text: '입력시 자동완성기능을 적용하였습니다.',
            view: r, dialog: dialogRegion }
        );

        focusNotification1.render(document.body);
    },

    prodDs: function(){
        if(this.getInt('prodDs') == 0) {
            var prodDs = this.params.prodDs;
            prodDs.on('add', function(e){
                var r = Rui.select('#grid1').getAt(0).getRegion();
                var dialogRegion = Rui.util.LObject.clone(r);
                dialogRegion.top = dialogRegion.bottom + 10;
                dialogRegion.bottom = dialogRegion.top + 160;

                var focusNotification1 = new Rui.ui.LFocusNotification({ 
                    text: '드래그앤 드롭이 적용된 그리드컨트롤이며 추가하고 싶은 로우를 드래그하여 아래 하단 그리드에 선택된 로우를 추가할 수가 있습니다.',
                    view: r, dialog: dialogRegion }
                );

                focusNotification1.render(document.body);
            }, this, true);
        }
    },

    doDragNDrop: function(){
        var r = Rui.select('#grid1').getAt(0).getRegion();
        var dialogRegion = Rui.util.LObject.clone(r);

        dialogRegion.top = dialogRegion.bottom + 10;
        dialogRegion.right += 90;
        dialogRegion.bottom = dialogRegion.top + 170;

        var focusNotification1 = new Rui.ui.LFocusNotification({ 
            text: '드래그앤 드롭이 적용된 그리드컨트롤이며 추가하고 싶은 로우를 드래그하여 아래 하단 그리드에 선택된 로우를 추가할 수가 있습니다.',
            view: r, dialog: dialogRegion }
        );

        focusNotification1.render(document.body);
    },

    prodOrderDs: function(){
        if(this.getInt('prodOrderDs') == 0) {
            var prodOrderDs = this.params.prodOrderDs;
            prodOrderDs.on('add', function(e){
            var r = Rui.select('#btnModify').getAt(0).getRegion();
            var dialogRegion = Rui.util.LObject.clone(r);

            dialogRegion.top += 40;
            dialogRegion.left -= 150;
            dialogRegion.right += 150;
            dialogRegion.bottom += 200;

            var focusNotification1 = new Rui.ui.LFocusNotification({
            	id: 'prodOrderDs',
                text: 'grid안에서 변경버튼 클릭시 별도 세부 자료를 입력할 수 있는 그리드 인 그리드 기능을 적용하였습니다.<br>변경버튼을 선택해 주세요',
                view: r, dialog: dialogRegion }
            );

                focusNotification1.render(document.body);
            }, this, true);
        }
    },

    doModify: function(){
        if(Rui.select('#btnModify').getAt(0) == null) return; 
        var r = Rui.select('#btnModify').getAt(0).getRegion();
        var dialogRegion = Rui.util.LObject.clone(r);

        dialogRegion.top += 40;
        dialogRegion.left -= 50;
        dialogRegion.right += 120;
        dialogRegion.bottom += 230;

        var focusNotification1 = new Rui.ui.LFocusNotification({ 
            text: 'grid안에서   변경버튼시 별도 세부 자료를 입력할 수 있는 그리드 인 그리드 기능을 적용하였습니다.<br>변경버튼을 선택해 주세요',
            view: r, dialog: dialogRegion }
        );

        focusNotification1.render(document.body);
    }
});
