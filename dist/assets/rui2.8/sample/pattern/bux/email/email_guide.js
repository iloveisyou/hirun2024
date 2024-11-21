Rui.ui.guide.Email = function(config) {
    Rui.ui.guide.Email.superclass.constructor.call(this, config);
};

Rui.extend(Rui.ui.guide.Email, Rui.ui.LGuide, {
    onReady: function() {
        this.loadPage();
    },
    loadPage: function() {
         if(this.getInt('loadPage') == 0) {
			var focusRegion1 = Rui.get('mailboxList').getRegion(),
			    focusRegion2 = Rui.get('bodyTopArea').getRegion(),
			    focusRegion3 = Rui.get('bodyCenterArea').getRegion(),
			    focusRegion1c = Rui.util.LObject.clone(focusRegion1),
			    focusRegion2c = Rui.util.LObject.clone(focusRegion2),
			    focusRegion3c = Rui.util.LObject.clone(focusRegion3),
			    focusNotification1,
			    focusNotification2,
			    focusNotification3;

			focusRegion1c.top = focusRegion1.bottom + 20;
			focusRegion1c.bottom = focusRegion1c.top + 180;
			focusRegion1c.left = focusRegion1c.left + 20;
			focusRegion1c.right = focusRegion1c.right + 170;
			focusNotification1 = new Rui.ui.LFocusNotification({
			    text: 'RUI를 이용하여 만들어진 eMail Client의 튜토리얼을 시작합니다.<BR/><BR/>이곳은 eMail 보관함들의 목록 입니다.',
			    view: focusRegion1,
			    dialog: focusRegion1c
			});

			focusRegion2c.top = focusRegion2.bottom + 20;
			focusRegion2c.bottom = focusRegion2c.top + 130;
			focusRegion2c.left = focusRegion2c.left + 20;
			focusRegion2c.right = focusRegion2c.right - 700;
			focusNotification2 = new Rui.ui.LFocusNotification({
			    text: 'eMail을 정리 하는데 사용하는 각종 버튼들 입니다.',
			    view: focusRegion2,
			    dialog: focusRegion2c
			});

			focusRegion3.bottom = focusRegion3.top + 200;
			focusRegion3c.top = focusRegion3.bottom + 20;
			focusRegion3c.bottom = focusRegion3c.top + 150;
			focusRegion3c.right = focusRegion3c.right - 700;
			focusNotification3 = new Rui.ui.LFocusNotification({
			    text: 'Inbox의 eMail목록 입니다.<BR/> 받은 eMail을 읽으시려면 마우스로 더블클릭 하세요. ',
			    view: focusRegion3,
			    dialog: focusRegion3c
			});
			
			focusNotification1.on('closed', function(e) {
				focusNotification2.render(document.body);
			});
			focusNotification2.on('closed', function(e) {
				focusNotification3.render(document.body);
			});
			
			focusNotification1.render(document.body);
			
        };
    },
    initWhenDialogClose: function(dialogMessageViewer){
        if(this.getInt('initWhenDialogClose') == 0) {
            var dialogMessageViewer = this.params.dialogMessageViewer;
            
            dialogMessageViewer.on('hide', function(){
    	        var focusRegion1 = Rui.get('bodyCenterArea').getRegion(),
    	            focusRegion1c = Rui.util.LObject.clone(focusRegion1),
    			    focusNotification1;
    	        focusRegion1.bottom = focusRegion1.top + 200;
    			focusRegion1c.top = focusRegion1.bottom + 0;
    			focusRegion1c.bottom = focusRegion1c.top + 80;
    			focusRegion1c.right = focusRegion1c.right - 700;
    			focusNotification1 = new Rui.ui.LFocusNotification({
    			    text: 'eMail을 마우스로 드래그 하여 다른 메일함으로 이동시킬 수 있습니다.',
    			    view: focusRegion1,
    			    dialog: focusRegion1c
    		    });
    			focusNotification1.render(document.body);
            });
        }
    }
});
