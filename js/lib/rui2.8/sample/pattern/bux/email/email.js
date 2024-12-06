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
            { id: 'mailId' },
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
            { id: 'mailId' },
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


/*
 * MailBox
 */
var currentBox = 'inbox',
    linkInboxEl,
    linkSentEl,
    linkImportantEl,
    linkUnreadEl,
    linkDraftsEl,
    linkJunkEl,
    linkTrashEl;

var sendingMethod;

/*
 * Button
 */
var refreshButton,
    newMessageButton,
    importantButton,
    readToggleButton,
    junkButton,
    trashButton,
    replyButton,
    replyAllButton,
    forwardButton,
    mailViewerSwitch = new Rui.ui.LSwitch({
        toggle: false,
        count: 3
    });

/*
 * Grid
 */
var mailListGridColumnModel = new Rui.ui.grid.LColumnModel({
        columns: [
            new Rui.ui.grid.LSelectionColumn(),
            { id: 'important', label: '<div class="mark-normal"></div>', width: 25, align: 'center', sortable: true, renderer: function(val, p, record){
                    return record.get('important') == 'Y' ? '<div class="mark-important"></div>' : '<div class="mark-normal"></div>';
                }
            },
            { id: 'unread', label: '<div class="mark-unread"></div>', width: 25, align: 'center', sortable: true, renderer: function(val, p, record){
                return record.get('unread') == 'Y' ? '<div class="mark-read"></div>' : '<div class="mark-unread"></div>';
	            }
            },
            { id: 'clip', label: '<div class="mark-attached"></div>', width: 25, align: 'center', sortable: true, renderer: function(val, p, record){
                    return record.get('clip') == 'Y' ? '<div class="mark-attached"></div>' : '';
                }
            },
            { id: 'sender', label: 'Sender', width: 200, sortable: true, renderer: function(val, p, record){
                    var sender = record.get('sender');
                    if(sender && sender.name){
                        return sender.name + '&lt;' + sender.email + '&gt;';
                    }else{
                        return sender;
                    }
                }
            },
            { id: 'receivers', label: 'Receivers', width: 200, sortable: true, renderer: function(val, p, record){
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
            { field: 'date', label: 'Date', sortable: true, align: 'center', renderer: Rui.util.LRenderer.dateRenderer()},
            { id: 'size', label: 'Size', sortable: true, renderer: function(val, p, record){
                    var size = record.get('size');
                    return toFileSizeString(size);
                }
            }
        ]
    }),
    mailListGrid = new Rui.ui.grid.LGridPanel({
        columnModel: mailListGridColumnModel,
        dataSet: mailListDataSet,
        headerTools: true,
        autoWidth: true,
        autoHeight: true,
        height: 300
    });

/*
 * Others
 */
var resizeMonitor = new Rui.util.LResizeMonitor();
var webStorage = new Rui.webdb.LWebStorage(new Rui.webdb.LCookieProvider());

/*
 * Dialog
 */
var dialogMessageWriter, 
    dialogMessageViewer,
    wdReceivers, wdSender, wdSubject,
    oEditors = [];

var newMessage = function(record){
    if(!dialogMessageWriter){

        dialogMessageWriter = new Rui.ui.LDialog({
            applyTo: 'dialogMessageWriter',
            header: '<img src="./../../../../sample/pattern/bux/email/assets/dialog/title_compose.png">',
            width: 825,
            visible: false,
            hideaftersubmit: true,
            modal: true,
            buttons: [{
                    text: '',
                    id: 'send',
                    handler: function() {
                        //oEditors.getById['wdMessage'].exec('UPDATE_CONTENTS_FIELD', []);
                        this.submit(true);
                    }, 
                    isDefault: true
                }]
        });
        
        wdReceivers = new Rui.ui.form.LTextBox({
            applyTo: 'wdReceivers',
            filterMode: 'remote',
            autoComplete : true,
            filterUrl: './data/addrs.jsp',
            width: 690
        });
        
        wdSender = new Rui.ui.form.LTextBox({
            applyTo: 'wdSender',
            width: 690
        });
        wdSender.setEditable(false);

        wdSubject = new Rui.ui.form.LTextBox({
            applyTo: 'wdSubject',
            width: 690
        });

        var filesDom = Rui.get('wdFiles').dom;
        Rui.util.LEvent.addListener(filesDom, 'dragenter', function(e){
            Rui.util.LEvent.stopEvent(e);
        });
        Rui.util.LEvent.addListener(filesDom, 'dragexit', function(e){
            alert('exit');
            Rui.util.LEvent.stopEvent(e);
        });
        Rui.util.LEvent.addListener(filesDom, 'dragover', function(e){
            Rui.util.LEvent.stopEvent(e);
        });
        Rui.util.LEvent.addListener(filesDom, 'drop', function(e){
            Rui.util.LEvent.stopEvent(e);
            var files = e.dataTransfer.files;
            for (var i = 0, len = files.length; i < len; i++) {
                Rui.select('#wdFiles div').setStyle('display', 'none');
                sendFile(files[i]);
            }
        });
        
    }
    dialogMessageWriter.clearInvalid();
    dialogMessageWriter.show(true);
    
    if(record){
        if(sendingMethod == 'reply'){
            wdReceivers.setValue(record.get('sender').email);
            wdSubject.setValue('[RE] ' + record.get('subject'));
        }else if(sendingMethod == 'replyAll'){
            var sender = record.get('sender'),
                receivers = record.get('receivers'),
                receiver;
            var receiverEmails = sender.email + '; ';
            if(receivers){
                for(var i = 0, len = receivers.length; i < len; i++){
                    receiver = receivers[i];
                    receiverEmails += receiver.email + '; ';
                }
            }
            wdReceivers.setValue(receiverEmails);
            wdSubject.setValue('[RE] ' + record.get('subject'));
        }else{
            wdSubject.setValue('[FW] ' + record.get('subject'));

            var files = record.get('files'), file, fileHTML = '';
            for(var i = 0, len = files.length; i < len; i++){
                file = files[i];
                fileHTML += '<li><span>' + file.name + '</span><span>' + toFileSizeString(file.size, true) + '</span></li>';
            }
            Rui.select('#wdFiles div').setStyle('display', 'none');
            Rui.select('#wdFiles ul').getAt(0).html('<ul>' + fileHTML + '</ul>');
        }

    }
    wdSender.setValue(webStorage.get('userName') + '<' + webStorage.get('email') + '>');
    
//    sendingMethod = forward ? 'forward' : (forAll ? 'replyAll' : 'reply');

//    var message = mailMessageDataSet.getNameValue(0, 'message');
//    oEditors.getById['wdMessage'].exec('PASTE_HTML', [message]);
//    oEditors.getById['wdMessage'].exec('PASTE_HTML', ['로딩이 완료된 후에 본문에 삽입되는 text입니다.']);
    
    Rui.get('wdMessage').dom.value = '123123';
    
    sendingMethod = null;
};

var viewMessage = function(record){
    if(mailViewerSwitch.getValue() == 0){
        //to Dialog
        if(!dialogMessageViewer){
            dialogMessageViewer = new Rui.ui.LDialog({
                applyTo: 'dialogMessageViewer',
                header: '<img src="./../../../../sample/pattern/bux/email/assets/dialog/title_message.png">',
                width: 825,
                visible: false,
                hideaftersubmit: true,
                modal: true,
                buttons: [{
                    text: '',
                    id: 'reply',
                    handler: function() {
                        this.cancel(true);
                        replyTo(mailListDataSet.getRow());
                    }
                }, {
                    text: '',
                    id: 'replyAll',
                    handler: function() {
                        this.cancel(true);
                        replyTo(mailListDataSet.getRow(), true);
                    }
                }, {
                    text: '',
                    id: 'forward',
                    handler: function() {
                        this.cancel(true);
                        forwardTo(mailListDataSet.getRow());
                    }
                }, {
                    text: '',
                    id: 'junk',
                    handler: function() {
                        moveTo('junk', mailListDataSet.getRow());
                        this.cancel(true);
                    }
                }, {
                    text: '',
                    id: 'trash',
                    handler: function() {
                        moveTo('trash', mailListDataSet.getRow());
                        this.cancel(true);
                    }
                }]
            });
            
            guideManager.addParams({
                dialogMessageViewer: dialogMessageViewer
            });
            guideManager.invokeGuideFn('initWhenDialogClose');
        }
        dialogMessageViewer.clearInvalid();
        dialogMessageViewer.show(true);

        Rui.get('rdSender').html(toAddress(record.get('sender')));
        Rui.get('rdReceivers').html(toAddress(record.get('receivers')));
        Rui.get('rdCC').html(toAddress(record.get('cc')));
        Rui.get('rdSubject').html(record.get('subject'));
        Rui.get('rdMessage').html(record.get('message'));
        
        var files = record.get('files'), file, fileHTML = '';
        for(var i = 0, len = files.length; i < len; i++){
            file = files[i];
            fileHTML += '<li><span>' + file.name + '</span><span>' + toFileSizeString(file.size, true) + '</span></li>';
        }
        Rui.get('rdFiles').html('<ul>' + fileHTML + '</ul>');
        
    }else{
        //to Bottom Area
        Rui.get('rSender').html(toAddress(record.get('sender')));
        Rui.get('rReceivers').html(toAddress(record.get('receivers')));
        Rui.get('rCC').html(toAddress(record.get('cc')));
        Rui.get('rSubject').html(record.get('subject'));
        Rui.get('rMessage').html(record.get('message'));
        
        var files = record.get('files'), file, fileHTML = '';
        for(var i = 0, len = files.length; i < len; i++){
            file = files[i];
            fileHTML += '<li><span>' + file.name + '</span><span>' + toFileSizeString(file.size, true) + '</span></li>';
        }
        Rui.get('rFiles').html('<ul>' + fileHTML + '</ul>');
    }
};

var setMailBoxCount = function(){
    var dataSet = mailCountDataSet;
    if(dataSet.getCount() > 0){
        var inbox = dataSet.getNameValue(0, 'inbox'),
            junk = dataSet.getNameValue(0, 'junk'),
            trash = dataSet.getNameValue(0, 'trash');
        Rui.get('inboxCount').html('(' + inbox + ')');
        Rui.get('junkCount').html('(' + junk + ')');
        Rui.get('trashCount').html('(' + trash + ')');
    }
};

var switchMailBox = function(boxName, doLoad){
    switch(boxName){
        case 'drafts':
        case 'sent':
            mailListGridColumnModel.getColumnById('sender').setHidden(true);
            mailListGridColumnModel.getColumnById('receivers').setHidden(false);
            mailListGridColumnModel.getColumnById('important').setHidden(true);
            break;
        case 'inbox':
        case 'important':
        case 'unread':
        case 'junk':
        case 'trash':
            mailListGridColumnModel.getColumnById('sender').setHidden(false);
            mailListGridColumnModel.getColumnById('receivers').setHidden(true);
            mailListGridColumnModel.getColumnById('important').setHidden(false);
            break;
        default:
            break;
    };
    mailListGrid.getView().updateColumnsAutoWidth();
    currentBox = boxName;
    if(doLoad === true){
        mailListDataSet.load({
            url: './data/'+boxName+'.json'
        });
    }
};

var moveTo = function(box, row){
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
            row = mailListDataSet.getRow();
        if(typeof row == 'string'){
            record = mailListDataSet.get(row);
        }else{
            record = mailListDataSet.getAt(row);
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

var forwardTo = function(row){
    replyTo(row, false, true);
};
var replyTo = function(row, forAll, forward){
    loadMessageData(row);
    sendingMethod = forward ? 'forward' : (forAll ? 'replyAll' : 'reply');
};


var initLayout = function(){
    var viewSwitchValue = mailViewerSwitch.getValue(),
        leftAreaEl = Rui.get('leftArea'),
        bodyAreaEl = Rui.get('bodyArea'),
        bodyTopAreaEl = Rui.get('bodyTopArea'),
        bodyCenterAreaEl = Rui.get('bodyCenterArea'),
        bodyBottomAreaEl = Rui.get('bodyBottomArea');
    
    if(viewSwitchValue == 0){
        //ㅁ|ㅁ
    	bodyCenterAreaEl.setStyle('width', bodyTopAreaEl.getWidth() + 'px');
        bodyCenterAreaEl.setStyle('height', (bodyAreaEl.getHeight() - bodyTopAreaEl.getHeight() - 70) + 'px');
        bodyBottomAreaEl.setStyle('display', 'none');
        
    }else if(viewSwitchValue == 1){
        //ㅁl--
        var centerAreaHeight = Math.ceil((bodyAreaEl.getHeight() - bodyTopAreaEl.getHeight()) / 2),
            centerAreaWidth = bodyTopAreaEl.getWidth();
        bodyCenterAreaEl.setStyle('height', centerAreaHeight + 'px');
        bodyCenterAreaEl.setStyle('width', centerAreaWidth + 'px');
        bodyCenterAreaEl.setStyle('float', 'inherit');
        bodyBottomAreaEl.setStyle('padding-left', '0px');
        bodyBottomAreaEl.setStyle('width', centerAreaWidth + 'px');
        bodyBottomAreaEl.setStyle('height', (bodyAreaEl.getHeight() - bodyTopAreaEl.getHeight() - centerAreaHeight - 70) + 'px');
        bodyBottomAreaEl.setStyle('display', 'block');
        
        loadMessageData();
    }else if(viewSwitchValue == 2){
        //ㅁlㅁㅁ
        bodyCenterAreaEl.setStyle('width', Math.ceil(bodyAreaEl.getWidth() / 2) + 'px');
        bodyCenterAreaEl.setStyle('float', 'left');
        bodyCenterAreaEl.setStyle('height', (bodyAreaEl.getHeight() - bodyTopAreaEl.getHeight() - 70) + 'px');
        bodyBottomAreaEl.setStyle('padding-left', Math.ceil(bodyAreaEl.getWidth() / 2) + 'px');
        bodyBottomAreaEl.setStyle('width', (bodyAreaEl.getWidth() - bodyCenterAreaEl.getWidth()) + 'px');
        bodyBottomAreaEl.setStyle('height', (bodyAreaEl.getHeight() - bodyTopAreaEl.getHeight() - 70) + 'px');
        bodyBottomAreaEl.setStyle('display', 'block');
        
        loadMessageData();
    }
    mailListGrid.setHeight(bodyCenterAreaEl.getHeight());
    mailListGrid.setWidth(bodyCenterAreaEl.getWidth());
};

var loadMessageData = function(row){
    if(!row)
        row = mailListDataSet.getRow();
    var mailId = mailListDataSet.getNameValue(row, 'mailId');
    mailMessageDataSet.load({
        url: './data/message.jsp?mailId=' + mailId
    });

    if(mailListDataSet.getNameValue(row, 'unread') == 'Y'){
        mailListDataSet.setNameValue(row, 'unread', 'N');
    }
};

var toFileSizeString = function(bytes, showOrign){
    var output = bytes + ' bytes';
    for(var B = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'], n = 0, approx = bytes / 1024; approx > 1; approx /= 1024, n++){
        output = approx.toFixed(3) + ' ' + B[n] + (showOrign ? ' (' + bytes + ' bytes)' : '');
    }
    return output;
};

var toAddress = function(addrs){
    if(addrs.length){
        var addr, output = '';
        for(var i = 0, len = addrs.length; i < len; i++){
            addr = addrs[i];
            output += addr.name + '&lt;' + addr.email + '&gt;';
            if(len > i+1)
                output += ', ';
        }
        return output;
    }else{
        return addrs.name + '&lt;' + addrs.email + '&gt;';
    }
};

var sendFile = function(file){
    var uri = './sendFile.jsp';
    var xhr = new XMLHttpRequest();
    var fd = new FormData();
     
    xhr.open('POST', uri, true);
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
            // Handle response.
            if(xhr.responseText == 'OK'){
                var fileUlEl = Rui.select('#wdFiles ul').getAt(0),
                    liEl = Rui.get(document.createElement('li'));
                liEl.html('<span>' + file.name + '</span><span>' + toFileSizeString(file.size, true) + '</span>');
                fileUlEl.appendChild(liEl);
            }
        }
    };
    fd.append('myFile', file);
    // Initiate a multipart/form-data upload
    xhr.send(fd);
};

Rui.onReady(function(){

    nhn.husky.EZCreator.createInIFrame({
        oAppRef: oEditors,
        elPlaceHolder: 'wdMessage',
        sSkinURI: './../../../../tools/third_party/smartEditor/SmartEditor2Skin.html',    
        htParams : {
            bUseToolbar : true,
            fOnBeforeUnload : function(){
            }
        },
        fOnAppLoad : function(){
            //예제 코드
            //oEditors.getById['ir1'].exec('PASTE_HTML', ['로딩이 완료된 후에 본문에 삽입되는 text입니다.']);
        },
        fCreator: 'createSEditor2'
    });

    var contextMenu = new Rui.ui.menu.LContextMenu( {
        applyTo: 'mailListGridContextMenu',
        trigger: 'mailListGrid',
        zindex : 100,
        itemdata: [
            { text: 'Important', onclick: { fn: function(){
                var row = mailListDataSet.getRow(),
                    value = mailListDataSet.getNameValue(row, 'important');
                mailListDataSet.setNameValue(row, 'important', (value == 'N' ? 'Y' : 'N'));
            } } },
            { text: 'Mark as read', onclick: { fn: function(){
                var row = mailListDataSet.getRow(),
                    value = mailListDataSet.getNameValue(row, 'unread');
                mailListDataSet.setNameValue(row, 'unread', (value == 'N' ? 'Y' : 'N'));
            } } },
            { text: 'Junk', onclick: { fn: function(){
                moveTo('junk');
            } } },
            { text: 'Move to Trash', onclick: { fn: function(){
                moveTo('trash');
            } } },
            { text : 'Send',
                submenu : {
                    id : 'mailListGridContextSubmenu',
                    itemdata :
                    [ {
                        text : 'Reply',
                        onclick : {
                            fn: function(){
                                replyTo(mailListDataSet.getRow());
                            }
                        }
                    }, {
                        text : 'Reply All',
                        onclick : {
                            fn: function(){
                                replyTo(mailListDataSet.getRow(), true);
                            }
                        }
                    }, {
                        text : 'Forward',
                        onclick : {
                            fn: function(){
                                forwardTo(mailListDataSet.getRow());
                            }
                        }
                    } ]
                }
            }
        ]
    });

    contextMenu.on('triggerContextMenu', function(e){
        var target = contextMenu.contextEventTarget,
            view = mailListGrid.getView(),
            gridRow = view.findRow(target);
        if(gridRow === false || gridRow < 0) {
            this.cancel(false);
            return;
        }
        mailListDataSet.setRow(gridRow);
    });
    
    contextMenu.on('show', function(e){
        var row = mailListDataSet.getRow();
        this.getItem(0).cfg.setProperty("checked", mailListDataSet.getNameValue(row, 'important') == 'Y');
        this.getItem(1).cfg.setProperty("text", mailListDataSet.getNameValue(row, 'unread') == 'Y' ? 'Mark as read' : 'Marks as unread');
    });

});