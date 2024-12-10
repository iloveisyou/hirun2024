Rui.ui.guide.GuideManagerSample = function(config) {
    Rui.ui.guide.GuideManagerSample.superclass.constructor.call(this, config);
}

Rui.extend(Rui.ui.guide.GuideManagerSample, Rui.ui.LGuide, {
    onReady: function() {
        this.loadPage();
    },
    loadPage: function() {
         if(this.getInt('loadPage') == 0) {
             this.doLoadPage();
         };
    },
    doLoadPage: function() {
        var r = { top: 110, left: 5, right: 550, bottom: 210};
        var d = Rui.util.LObject.clone(r);
        d.top += 130;
        d.bottom = d.top + 140;
        var focusNotification1 = new Rui.ui.LFocusNotification({ 
            text: '이 가이드는 단 한번만 출력되며, 이후 출력되지 않습니다.',
            view: r,
            dialog: d 
        });
        focusNotification1.render(document.body);
    }
});
