Rui.onReady(function(){

    /*
     * Layout
     */
    var leftResize = new Rui.util.LResize({
        el: 'leftArea',
        attributes: {
            handles: ['r'],
            autoRatio: false,
            minWidth: 150,
            maxWidth: 250,
            status: false
        }
    }),
    bodyTopResize;

    leftResize.on('resize', function(e){
    	var bodyAreaEl = Rui.get('bodyArea');
    	bodyAreaEl.setStyle('left', e.width +'px');
    });
    
    
    /*
     * DataSet
     */
    var mailCountDataSet = new Rui.data.LJsonDataSet({
            id: 'mailCountDataSet',
            fields: [
                { id: 'inbox', type: 'number' },
                { id: 'sent', type: 'number' },
                { id: 'import', type: 'number' },
                { id: 'unread', type: 'number' },
                { id: 'drafts', type: 'number' },
                { id: 'junk', type: 'number' },
                { id: 'trash', type: 'number' }
            ]
        }),
        mailListDataSet = new Rui.data.LJsonDataSet({
            id: 'mailListDataSet',
            fields: [
                { id: 'important' },
                { id: 'clip' },
                { id: 'sender' },
                { id: 'receivers' },
                { id: 'subject' },
                { id: 'date', type: 'date', defaultValue: new Date() },
                { id: 'size', type: 'number' },
                { id: 'unread' }
            ]
        }),
        mailMessageDataSet = new Rui.data.LJsonDataSet({
            id: 'mailMessageDataSet',
            fields: [
                { id: 'important' },
                { id: 'clip' },
                { id: 'sender' },
                { id: 'receivers' },
                { id: 'cc' },
                { id: 'subject' },
                { id: 'message' },
                { id: 'date', type: 'date', defaultValue: new Date() },
                { id: 'size', type: 'number' },
                { id: 'files' }
            ]
        });
    mailCountDataSet.on('load', function(e){
        setMailBoxCount(e.target);
    });
    mailCountDataSet.load({
        url: './count.json'
    });
    mailMessageDataSet.on('load', function(e){
    	setMailMessageBody(mailMessageDataSet.getAt(0));
    });
    mailListDataSet.on('rowPosChanged', function(e){
    	if(mailListDataSet.getCount() < 1)
    		return;
    	setMailMessageHeader(mailListDataSet.getAt(e.row));
    	mailMessageDataSet.load({
    		url: './message'+(Math.floor((e.row + 1) % 2))+'.json'
    	});
    });

    /*
     * 메일 목록 그리드
     */
    var mailListGridCM = new Rui.ui.grid.LColumnModel({
            groupMerge: true,
            freezeColumnId: 'col1',
            columns: [
                new Rui.ui.grid.LSelectionColumn(),
                new Rui.ui.grid.LNumberColumn(),
                { id: 'important', label: '☆', width: 20, align: 'center', sortable: true, renderer: function(val, p, record){
                        return record.get('important') == 'Y' ? '★' : '☆';
                    }
                }, { id: 'clip', label: 'File', width: 20, align: 'center', sortable: true, renderer: function(val, p, record){
                        return record.get('clip') == 'Y' ? '＠' : '';
                    }
                },
                { id: 'sender', label: 'Sender', width: 80, sortable: true, renderer: function(val, p, record){
                        var sender = record.get('sender');
                        if(sender && sender.name){
                            return sender.name + '&lt;' + sender.email + '&gt;';
                        }else{
                            return sender;
                        }
                    }
                },
                { id: 'receivers', label: 'Receivers', width: 90, sortable: true, renderer: function(val, p, record){
                        var receivers = record.get('receivers'),
                            receiver, rc = 0;
                        if(receivers && receivers.length > 0){
                            receiver = receivers[0];
                            rc = receivers.length-1;
                            return receiver.name + '&lt;' + receiver.email + '&gt;' + (rc > 0 ? '외' + rc + '명' : '');
                        }else{
                            return '';
                        }
                    }
                },
                { id: 'subject', label: 'Subject', autoWidth: true, sortable: true, renderer: function(val, p, record){
                        if(record.get('unread') == 'Y'){
                            return '<STRONG style="font-weight: 700">' + record.get('subject') + '</STRONG>';
                        }else{
                            return record.get('subject');
                        }
                    }
                },
                { field: 'date', label: 'Date', width: 70, sortable: true, align: 'center', renderer: Rui.util.LRenderer.dateRenderer()},
                { id: 'size', label: 'Size', width: 70, sortable: true, renderer: function(val, p, record){
                        var size = record.get('size');
                        if(size > 0){
                            if(size < 1024)
                                return size + 'Byte';
                            if(size < Math.pow(1024, 2))
                                return Math.ceil(size / 1024 * 100) / 100 + 'KB';
                            if(size < Math.pow(1024, 3))
                                return Math.ceil(size / Math.pow(1024, 2) * 100) / 100 + 'MB';
                            if(size < Math.pow(1024, 4))
                                return Math.ceil(size / Math.pow(1024, 3) * 100) / 100 + 'GB';
                            return Math.ceil(size / Math.pow(1024, 4) * 100) / 100 + 'TB';
                        }else{
                            return '0byte';
                        }
                    }
                }
            ]
        }),
        mailListGrid = new Rui.ui.grid.LGridPanel({
            columnModel: mailListGridCM,
            dataSet: mailListDataSet,
            headerTools: true,
            autoWidth: true,
            autoHeight: true,
            height: 300
        });
    mailListGrid.render('mailListGrid');
    
    /*
     * 메일목록 그리드 Drag Drop
     */
    var mailListGridDd = new Rui.dd.LDDProxy({
            id: 'mailListGrid',
            group: 'default',
            attributes: {
                dragElId: 'grid-row-dd-proxy',
                resizeFrame: false,
                useShim: true
            }
        });
    mailListGridDd.clickValidator = function(e) {
        if (Rui.get(e.target).findParent('.L-grid-col') == null) 
            return false;
        return true;
    };
    mailListGridDd.on('dragEvent', function(args) {
        var el = Rui.get(this.getDragEl()),
            x = Rui.util.LEvent.getPageX(args.e),
            y = Rui.util.LEvent.getPageY(args.e),
            rowEl, proxyEl, rowId;
        
        el.setXY([x - 5, y - 5]);
        rowEl = Rui.get(args.e.target).findParent('.L-grid-row');
        if(rowEl == null) return;
        rowId = 'r' + Rui.util.LDom.findStringInClassName(rowEl.dom, 'L-grid-row-r');
        proxyEl = Rui.get('grid-row-dd-proxy');
        if(proxyEl.dom.childNodes.length == 0) {
            proxyDom = document.createElement('div');
            proxyDom.innerHTML = '▧';
            proxyEl.setAttribute('data-dd-value', rowId);
            proxyEl.appendChild(proxyDom);
            proxyEl.setWidth(20);
            proxyEl.setHeight(20);
        }
    });
    mailListGridDd.on('dragDropEvent', function(e) {
        var proxyEl = Rui.get('grid-row-dd-proxy'),
            rowId = proxyEl.getAttribute('data-dd-value');
        box = e.info.substring(4).toLowerCase();
        if(currentBox != box){
        	moveTo(box, rowId);
        }
		Rui.get(e.info).setStyle('font-weight', '');
        proxyEl.html('');
    });
    mailListGridDd.on('endDragEvent', function(e) {
        var gridEl = Rui.get('mailListGrid');
        gridEl.setStyle('left', '');
        gridEl.setStyle('top', '');
        gridEl.setStyle('position', '');
    });
    mailListGridDd.on('dragEnterEvent', function(e){
        var box = e.info.substring(4).toLowerCase();
        if(currentBox !== box){
            Rui.get(e.info).setStyle('font-weight', '700');
        }
    });
    mailListGridDd.on('dragOutEvent', function(e){
        var box = e.info.substring(4).toLowerCase();
        if(box === 'inbox' || box === 'junk' || box === 'trash')
            Rui.get(e.info).setStyle('font-weight', '');
    });
    
    var bind = new Rui.data.LBind({
        groupId: 'dialogMessage',
        dataSet: mailMessageDataSet,
        bind: true,
        bindInfo: [
            { id: 'sender', ctrlId: 'sender', value: 'value' },
            { id: 'subject', ctrlId: 'subject', value: 'value' },
            { id: 'message', ctrlId: 'message', value: 'value' },
            { id: 'date', ctrlId: 'date', value: 'value' }
        ]
    });

    /*
     * Message Dialog
     */
    var dialogMessage = new Rui.ui.LDialog({
        applyTo: 'dialogMessage',
        header: 'New Message',
        width: 800,
        visible: false,
        hideaftersubmit: true,
        modal: true,
        buttons: [{
                text: 'Submit',
                handler: function() {
                    this.submit(true);
                }, 
                isDefault: true 
            }, {
                text: 'Cancel', 
                handler: function() {
                    this.cancel(true);
                }
            }]
    });
    var oEditors = [];
    
    dialogMessage.on('show', function(e){
    	var message = mailMessageDataSet.getNameValue(0, 'message');
    	oEditors.getById["message"].exec("PASTE_HTML", [message]);
    });
    
    nhn.husky.EZCreator.createInIFrame({
    	oAppRef: oEditors,
    	elPlaceHolder: "message",
    	sSkinURI: "./../../../../tools/third_party/smartEditor/SmartEditor2Skin.html",	
    	htParams : {
    		bUseToolbar : true,
    		fOnBeforeUnload : function(){
    			//alert("아싸!");	
    		}
    	}, //boolean
    	fOnAppLoad : function(){
    		//예제 코드
    		//oEditors.getById["ir1"].exec("PASTE_HTML", ["로딩이 완료된 후에 본문에 삽입되는 text입니다."]);
    	},
    	fCreator: "createSEditor2"
    });
    
    var filesDom = Rui.get('files').dom;
    Rui.util.LEvent.addListener(filesDom, 'dragenter', function(e){
        Rui.util.LEvent.stopEvent(e);
    });
    Rui.util.LEvent.addListener(filesDom, 'dragexit', function(e){
        Rui.util.LEvent.stopEvent(e);
    });
    Rui.util.LEvent.addListener(filesDom, 'dragover', function(e){
        Rui.util.LEvent.stopEvent(e);
    });
    Rui.util.LEvent.addListener(filesDom, 'drop', function(e){
    	Rui.util.LEvent.stopEvent(e);
    	var files = e.dataTransfer.files;
    });

    
    
    

    /*
     * 버튼들
     */
    var refreshBtn = new Rui.ui.LButton('refreshBtn'),
        newMessageBtn = new Rui.ui.LButton('newMessageBtn'),
        importantBtn = new Rui.ui.LButton('importantBtn'),
        readToggleBtn = new Rui.ui.LButton('readToggleBtn'),
        junkBtn = new Rui.ui.LButton('junkBtn'),
        trashBtn = new Rui.ui.LButton('trashBtn'),
        replyBtn = new Rui.ui.LButton('replyBtn'),
        replyAllBtn = new Rui.ui.LButton('replyAllBtn'),
        forwardBtn = new Rui.ui.LButton('forwardBtn'),
        mailViewerSwitch = new Rui.ui.LSwitch({
            applyTo: 'mailViewerSwitch',
            toggle: false,
            count: 2
        });

    refreshBtn.on('click', function(){
        switchMailBox(currentBox, true);
    });
    newMessageBtn.on('click', function(){
    	mailMessageDataSet.loadData({"records": [{
    	        "sender": "", "message": "no message"
    	    }]
    	});
    	dialogMessage.clearInvalid();
        dialogMessage.show(true);
    });
    importantBtn.on('click', function(){
        var row = mailListDataSet.getRow(),
           value = mailListDataSet.getNameValue(row, 'important');
        mailListDataSet.setNameValue(row, 'important', (value == 'N' ? 'Y' : 'N'));
    });
    readToggleBtn.on('click', function(){
        var row = mailListDataSet.getRow(),
             value = mailListDataSet.getNameValue(row, 'unread');
        mailListDataSet.setNameValue(row, 'unread', (value == 'N' ? 'Y' : 'N'));
    });
    junkBtn.on('click', function(){
    	Rui.confirm({
    		text: 'You sure?',
            handlerYes: function() {
            	moveTo('junk');
            },
            handlerNo: function() {
            }
        });
    });
    trashBtn.on('click', function(){
    	Rui.confirm({
    		text: 'You sure?',
            handlerYes: function() {
            	moveTo('trash');
            },
            handlerNo: function() {
            }
        });
    });
    replyBtn.on('click', function(){
    	mailListDataSet.setDemarkExcept(2, false);
    });
    replyAllBtn.on('click', function(){
    });
    forwardBtn.on('click', function(){
    });
    
    mailViewerSwitch.on('changed', function(e){
    	if(e.type == 'on'){
    		initLayout();
    	}
    });
    mailViewerSwitch.push(0);

    /*
     * 기타 메소드
     */
    var linkInboxEl = Rui.get('linkInbox'),
        linkSentEl = Rui.get('linkSent'),
        linkImportantEl = Rui.get('linkImportant'),
        linkUnreadEl = Rui.get('linkUnread'),
        linkDraftsEl = Rui.get('linkDrafts'),
        linkJunkEl = Rui.get('linkJunk'),
        linkTrashEl = Rui.get('linkTrash'),
        mailBoxNameEl = Rui.get('mailBoxName'),
        currentBox = 'inbox',
        setMailBoxCount = function(dataSet){
            var inbox = dataSet.getNameValue(0, 'inbox'),
                junk = dataSet.getNameValue(0, 'junk'),
                trash = dataSet.getNameValue(0, 'trash');
            Rui.get('inboxCount').html('(' + inbox + ')');
            Rui.get('junkCount').html('(' + junk + ')');
            Rui.get('trashCount').html('(' + trash + ')');
        },
        switchMailBox = function(boxName, doLoad){
            switch(boxName){
                case 'drafts':
                    mailBoxNameEl.html('Drafts');
                    mailListGridCM.getColumnById('sender').setHidden(true);
                    mailListGridCM.getColumnById('receivers').setHidden(false);
                    mailListGridCM.getColumnById('important').setHidden(true);
                    break;
                case 'sent':
                    mailBoxNameEl.html('Sent');
                    mailListGridCM.getColumnById('sender').setHidden(true);
                    mailListGridCM.getColumnById('receivers').setHidden(false);
                    mailListGridCM.getColumnById('important').setHidden(true);
                    break;
                case 'inbox':
                    mailBoxNameEl.html('Inbox');
                    mailListGridCM.getColumnById('sender').setHidden(false);
                    mailListGridCM.getColumnById('receivers').setHidden(true);
                    mailListGridCM.getColumnById('important').setHidden(false);
                    break;
                case 'important':
                    mailBoxNameEl.html('Important');
                    mailListGridCM.getColumnById('sender').setHidden(false);
                    mailListGridCM.getColumnById('receivers').setHidden(true);
                    mailListGridCM.getColumnById('important').setHidden(false);
                    break;
                case 'unread':
                    mailBoxNameEl.html('Unread');
                    mailListGridCM.getColumnById('sender').setHidden(false);
                    mailListGridCM.getColumnById('receivers').setHidden(true);
                    mailListGridCM.getColumnById('important').setHidden(false);
                    break;
                case 'junk':
                    mailBoxNameEl.html('Junk');
                    mailListGridCM.getColumnById('sender').setHidden(false);
                    mailListGridCM.getColumnById('receivers').setHidden(true);
                    mailListGridCM.getColumnById('important').setHidden(false);
                    break;
                case 'trash':
                    mailBoxNameEl.html('Trash');
                    mailListGridCM.getColumnById('sender').setHidden(false);
                    mailListGridCM.getColumnById('receivers').setHidden(true);
                    mailListGridCM.getColumnById('important').setHidden(false);
                    break;
                default:
                    break;
            };
            currentBox = boxName;
            if(doLoad === true){
                mailListDataSet.load({
                    url: './'+boxName+'.json'
                });
            }
        },
        setMailMessageHeader = function(record){
        	var messageImportantEl = Rui.get('messageImportant');
        	var messageSubjectEl = Rui.get('messageSubject');
        	var messageSenderEl = Rui.get('messageSender');
        	var messageReceiversEl = Rui.get('messageReceivers');
        	messageImportantEl.html(record.get('important') == 'Y' ? '★' : '☆');
        	messageSubjectEl.html(record.get('subject'));
        	
        	var sender = record.get('sender'),
        	    senderStr = '';
            if(sender && sender.name){
            	senderStr = sender.name + '&lt;' + sender.email + '&gt;';
            }
			messageSenderEl.html(senderStr);

            var receivers = record.get('receivers'),
                receiver, receiverStr = '';
            if(receivers && receivers.length > 0){
	            for(var i = 0, len = receivers.length; i < len; i++){
            		receiver = receivers[0];
            		rc = receivers.length-1;
            		receiverStr += receiver.name + '&lt;' + receiver.email + '&gt; ;';
            	}
            }
			messageReceiversEl.html(receiverStr);
        },
        setMailMessageBody = function(record){
	        var receivers = record.get('receivers'),
	            receiver, receiverStr = '';
	        if(receivers && receivers.length > 0){
	            for(var i = 0, len = receivers.length; i < len; i++){
	        		receiver = receivers[0];
	        		rc = receivers.length-1;
	        		receiverStr += receiver.name + '&lt;' + receiver.email + '&gt; ;';
	        	}
	        }
	        var messageReceiversEl = Rui.get('messageReceivers');
        	messageReceiversEl.html(receiverStr);
			
        	var messageBodyEl = Rui.get('messageBody');
        	messageBodyEl.html(record.get('message'));
        },
        moveTo = function(box, row){
        	var count, record;
        	if(mailListDataSet.getMarkedCount() > 0){
    			count = mailCountDataSet.getNameValue(0, box);
        		for(var i = 0, list = mailListDataSet.getCount(); i < list; i++){
        			if(mailListDataSet.getNameValue(i, 'unread') == 'Y'){
            			count++;
        			}
        		}
        		mailListDataSet.removeMarkedRows();
    			mailCountDataSet.setNameValue(0, box, count);
    			setMailBoxCount(mailCountDataSet);
        	}else{
        		if(!row)
        			row = mailCountDataSet.getRow();
        		if(typeof row == 'string'){
	        		record = mailListDataSet.get(row);
	        	}else{
	        		record = mailCountDataSet.getAt(row);
	        	}
        		if(record.get('unread') == 'Y'){
        			count = mailCountDataSet.getNameValue(0, box);
        			count++;
        			mailCountDataSet.setNameValue(0, box, count);
        			setMailBoxCount(mailCountDataSet);
        		}
        		if(typeof row == 'string'){
        			mailListDataSet.remove(row);
	        	}else{
        			mailListDataSet.removeAt(row);
	        	}
        	}
        };

    new Rui.dd.LDDTarget({
        id: 'linkInbox'
    });
    new Rui.dd.LDDTarget({
        id: 'linkJunk'
    });
    new Rui.dd.LDDTarget({
        id: 'linkTrash'
    });
    
    
    /*
     * 초기화
     */
    linkInboxEl.on('click', function(){
        switchMailBox('inbox', true);
    });
    linkSentEl.on('click', function(){
        switchMailBox('sent', true);
    });
    linkImportantEl.on('click', function(){
        switchMailBox('important', true);
    });
    linkUnreadEl.on('click', function(){
        switchMailBox('unread', true);
    });
    linkDraftsEl.on('click', function(){
        switchMailBox('drafts', true);
    });
    linkJunkEl.on('click', function(){
        switchMailBox('junk', true);
    });
    linkTrashEl.on('click', function(){
        switchMailBox('trash', true);
    });

    refreshBtn.click();
    
    function initLayout(){
        var viewSwitchValue = mailViewerSwitch.getValue();
        if(viewSwitchValue == 0){
        	//ㅁ|ㅁ
        	Rui.get('bodyTopArea').setStyle('height', '');
        	Rui.get('bodyTopArea').setStyle('min-height', '100%');
        	Rui.get('bodyBottomArea').setStyle('display', 'none');
        	
        	mailListGrid.setHeight(Rui.get('bodyTopArea').getHeight() - 50);
        	
        	if(bodyTopResize){
        		bodyTopResize.destroy();
        		bodyTopResize = null;
        	}
        	
        }else if(viewSwitchValue == 1){
        	//ㅁl-
        	Rui.get('bodyTopArea').setStyle('min-height', '');
        	Rui.get('bodyTopArea').setStyle('height', '350px');
        	Rui.get('bodyBottomArea').setStyle('display', 'block');
        	Rui.get('bodyBottomArea').setStyle('top', '350px');

        	mailListGrid.setHeight(300);
        	
        	if(!bodyTopResize){
        		bodyTopResize = new Rui.util.LResize({
        			el: 'bodyTopArea',
        			attributes: {
        				handles: ['b'],
        				autoRatio: false,
        				minHeight: 200,
        				maxHeight: 400,
        				status: false
        			}
        		});
                bodyTopResize.on('resize', function(e){
                	var height = Rui.get('bodyTopArea').getHeight();
                	Rui.get('bodyBottomArea').setStyle('top', height + 'px');
                });
        	}
        }
    }
    initLayout();
    //render
//    innerLayout.render();
    
    
    /*
    //tLeft/tRight/padRight div click event
    Rui.get('tLeft').on('click', function(ev){
        //event bubble을 cancel하고 return value를 false로 설정
        Event.stopEvent(ev);
        //해당 unit을 toggle시킴
        var leftUnit = layout.getUnitByPosition('left');
        if(leftUnit)
            leftUnit.toggle();
    });
    
    Rui.get('tRight').on('click', function(ev){
        Event.stopEvent(ev);
        var rightUnit = layout.getUnitByPosition('right');
        if(rightUnit)
            rightUnit.toggle();
    });
    
    Rui.get('padRight').on('click', function(ev){
        Event.stopEvent(ev);
        //간격 조정
        var pad = prompt('CSS gutter to apply: ("2px" or "2px 4px" or any combination of the 4 sides)', layout.getUnitByPosition('right').get('gutter'));
        layout.getUnitByPosition('right').set('gutter', pad);
    });
    */
    
//    Rui.get('closeLeft').on('click', function(ev){
//        Event.stopEvent(ev);
//        layout.getUnitByPosition('left').close();
//    });
    
//    Rui.get('changeRightContent').on('click', function(ev){
//        Event.stopEvent(ev);
//        //ajax로 content 채울 경우 사용
//        layout.getUnitByPosition('right').bodyHtml("<b>Right 영역 AJAX등을 사용하여 content 채우기</b>");
//    });
    
});