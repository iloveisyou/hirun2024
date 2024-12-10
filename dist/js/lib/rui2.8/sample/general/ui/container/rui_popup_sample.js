window.dialogList = window.dialogList || {};

function getBiz1Dialog(options) {
    if(!window.dialogList.biz1Dialog) {
        var dialog = new Rui.ui.LDialog( {
            id: 'dialog',
            width : 600,
            height: 500,
            header: 'Biz1 Dialog',
            body: '',
            visible : false,
            buttons : [
                { text:'Select', handler: function() {
                    this.submit();
                } },
                { text:'Cancel', handler: function() {
                        this.cancel();
                    }
                }
            ]
        });
    
        dialog.render(document.body);
        
        dialog.getBody().appendChildByAjax({
            url: './rui_popup_biz1.html',
            failure: function() {
                alert('팝업 페이지를 로딩하는데 실패했습니다.');
            }
        })
        
        dialog.on('show', function(e) {
            if(dialog.initData)
                dialog.initData(dialog.initParams);
        });
        
        dialog.selectHandler = options.selectHandler || Rui.emptyFn;
        
        window.dialogList.biz1Dialog = dialog;
    }

    if(options)
        window.dialogList.biz1Dialog.initParams = options.params;
    
    return window.dialogList.biz1Dialog;
}
