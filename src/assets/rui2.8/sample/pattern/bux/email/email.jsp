<%--
 * ============================================================================
 * @Project     : RUI
 * @Source      : index.jsp
 * @Name        : rui 
 * @Description : email
 * @Version     : v1.0
 * 
 * Copyright ⓒ 2013 LG CNS All rights reserved
 * ============================================================================
 *  No       DATE              Author      Description
 * ============================================================================
 *  1.0      2013.05.14        rui         
 * ============================================================================
--%>
<%@ page language="java" pageEncoding="utf-8" contentType="text/html; charset=utf-8"%>
<%@ include file="./../../../../sample/pattern/bux/include/doctype.jspf" %>
<html> 

<head>
<title>eMail</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" >
<%@ include file="./../../../../sample/pattern/bux/include/rui_head.jspf"%>
<%@ include file="./../../../../sample/pattern/bux/include/rui.jspf"%>

<script type="text/javascript" src="./../../../../plugins/layout/rui_layout.js"></script>
<script type="text/javascript" src="./../../../../plugins/util/LResize.js"></script>

<script type="text/javascript" src="./../../../../plugins/ui/LSwitch.js"></script>
<link type="text/css" rel="stylesheet" href="./../../../../plugins/ui/LSwitch.css" />

<script type="text/javascript" src="./../../../../plugins/ui/LGuideManager.js"></script>

<script type="text/javascript" src="./../../../../tools/third_party/smartEditor/js/HuskyEZCreator.js" charset="utf-8"></script>

<script type="text/javascript" src="./email.js"></script>
<link type="text/css" rel="stylesheet" href="email.css" />

<script type="text/javascript">
var guideManager;
var linkComposeEl, linkInboxEl, linkSentEl, linkImportantEl, linkUnreadEl, linkDraftsEl, linkJunkEl, linkTrashEl;
Rui.onReady(function(){
    
    currentBox = 'inbox',
    linkComposeEl = Rui.get('linkCompose');
    linkInboxEl = Rui.get('linkInbox');
    linkSentEl = Rui.get('linkSent');
    linkImportantEl = Rui.get('linkImportant');
    linkUnreadEl = Rui.get('linkUnread');
    linkDraftsEl = Rui.get('linkDrafts');
    linkJunkEl = Rui.get('linkJunk');
    linkTrashEl = Rui.get('linkTrash');

    refreshButton = new Rui.ui.LButton('refreshButton');
    importantButton = new Rui.ui.LButton('importantButton');
    readToggleButton = new Rui.ui.LButton('readToggleButton');
    junkButton = new Rui.ui.LButton('junkButton');
    trashButton = new Rui.ui.LButton('trashButton');
    replyButton = new Rui.ui.LButton('replyButton');
    replyAllButton = new Rui.ui.LButton('replyAllButton');
    forwardButton = new Rui.ui.LButton('forwardButton');
    
    resizeMonitor.monitor(Rui.get('wrap').dom);

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
     * DataSet Events
     */
    mailCountDataSet.on('load', function(e){
        setMailBoxCount();
    }, window, true);
    
    mailCountDataSet.load({
        url: './data/count.json'
    });
    
    mailMessageDataSet.on('load', function(e){
        if(!sendingMethod)
            viewMessage(e.target.getAt(0));
        else
            newMessage(e.target.getAt(0));
    });
    
    mailListDataSet.on('update', function(e){
        if(e.colId == "unread" && e.originValue == 'Y' && e.value == 'N'){
            var count = mailCountDataSet.getNameValue(0, currentBox);
            mailCountDataSet.setNameValue(0, currentBox, --count);
            setMailBoxCount();
        }
    });
    
    mailListDataSet.on('rowPosChanged', function(e){
        if(mailViewerSwitch.getValue() != 0){
            loadMessageData(e.row);
        }
    });

    /*
     * Mail List Grid Events
     */
    mailListGrid.on('cellDblClick', function(e){
        loadMessageData(e.row);
    });
    
    /*
     * Resize monitor Events
     */
    resizeMonitor.on('contentResized', function(e) {
        initLayout();
    });
    

    /*
     * Drag & Drop Events
     */
    mailListGridDd.on('dragEvent', function(args) {
        var el = Rui.get(this.getDragEl()),
            x = Rui.util.LEvent.getPageX(args.e),
            y = Rui.util.LEvent.getPageY(args.e),
            rowEl, proxyEl, rowId, count;
        
        el.setXY([x + 3, y + 3]);
        rowEl = Rui.get(args.e.target).findParent('.L-grid-row');
        console.log(rowEl);
        if(rowEl == null) return;
        rowId = 'r' + Rui.util.LDom.findStringInClassName(rowEl.dom, 'L-grid-row-r');
        proxyEl = Rui.get('grid-row-dd-proxy');
        proxyEl.setAttribute('data-dd-value', rowId);
        count = mailListDataSet.getMarkedCount();
        if(count < 1)
        	count = 1;
        proxyEl.getChildren()[0].html(count);
        proxyEl.setStyle('display', 'block');
    });
    mailListGridDd.on('dragDropEvent', function(e) {
        var proxyEl = Rui.get('grid-row-dd-proxy'),
            rowId = proxyEl.getAttribute('data-dd-value');
        box = e.info.substring(4).toLowerCase();
        if(currentBox != box){
            moveTo(box, rowId);
        }
        Rui.get(e.info).setStyle('font-weight', '');
        proxyEl.setStyle('display', 'none');
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
    
    
    
    /*
     * Button Events
     */
    refreshButton.on('click', function(){
        switchMailBox(currentBox, true);
    });
    importantButton.on('click', function(){
        var row = mailListDataSet.getRow(),
           value = mailListDataSet.getNameValue(row, 'important');
        mailListDataSet.setNameValue(row, 'important', (value == 'N' ? 'Y' : 'N'));
    });
    readToggleButton.on('click', function(){
        var row = mailListDataSet.getRow(),
             value = mailListDataSet.getNameValue(row, 'unread');
        mailListDataSet.setNameValue(row, 'unread', (value == 'N' ? 'Y' : 'N'));
    });
    junkButton.on('click', function(){
        Rui.confirm({
            text: 'You sure?',
            handlerYes: function() {
                moveTo('junk');
            },
            handlerNo: function() {
            }
        });
    });
    trashButton.on('click', function(){
        Rui.confirm({
            text: 'You sure?',
            handlerYes: function() {
                moveTo('trash');
            },
            handlerNo: function() {
            }
        });
    });
    replyButton.on('click', function(){
        replyTo(mailListDataSet.getRow());
    });
    replyAllButton.on('click', function(){
        replyTo(mailListDataSet.getRow(), true);
    });
    forwardButton.on('click', function(){
        forwardTo(mailListDataSet.getRow());
    });
    
    mailViewerSwitch.on('changed', function(e){
        if(e.type == 'on'){
            initLayout();
        }
    });
    

    /*
     * Mail Box Events
     */
    linkComposeEl.on('click', function(){
    	newMessage();
    });
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
    

    /*
     * Rendering 및 초기화
     */
    mailListGrid.render('mailListGrid');
    mailViewerSwitch.render('mailViewerSwitch');
    

    mailViewerSwitch.push(0);
    refreshButton.click();
    initLayout();

    guideManager = new Rui.ui.LGuideManager({ 
    	pageName: 'email', 
    	params: {
    		aa: ''
    	},
    	debug: false
    });
    
});
</script>
</head>
<body>
<%@ include file="./../../../../sample/pattern/bux/include/rui_menu.jsp"%>
<div id="wrap">
    <!-- 컨텐츠 영역 -->
    <div>

        <div id="layout">
            <div id="leftArea">
                <div class="email-left-topmargin"></div>
                <div class="email-left-divider"></div>
                <div class="email-left-logo"></div>
                <div id="mailboxList">
	                <div class="email-left-divider"></div>
	                <div class="email-left-list">
	                    <ul>
	                        <li><a id="linkCompose" href="#"></a></li>
	                    </ul>
	                </div>
	                <div class="email-left-divider"></div>
	                <div class="email-left-list">
	                    <ul>
	                        <li><a id="linkInbox" href="#"></a><span id="inboxCount" class="box-counter">10</span></li>
	                        <li><a id="linkUnread" href="#"></a></li>
	                        <li><a id="linkImportant" href="#"></a></li>
	                    </ul>
	                </div>
	                <div class="email-left-divider"></div>
	                <div class="email-left-list">
	                    <ul>
	                        <li><a id="linkSent" href="#"></a></li>
	                        <li><a id="linkDrafts" href="#"></a></li>
	                    </ul>
	                </div>
	                <div class="email-left-divider"></div>
	                <div class="email-left-list">
	                    <ul>
	                        <li><a id="linkJunk" href="#"></a><span id="junkCount" class="box-counter">51</span></li>
	                        <li><a id="linkTrash" href="#"></a><span id="trashCount" class="box-counter">3</span></li>
	                    </ul>
	                </div>
	                <div class="email-left-divider"></div>
	             </div>
            </div>
            <div id="bodyArea">
                <div class="email-body-topmargin"></div>
                <div id="bodyTopArea">
                    <div class="email-body-buttons">
                        <div class="email-body-button-group">
                            <button id="importantButton"></button>
                            <button id="readToggleButton"></button>
                        </div>
                        <div class="email-body-button-group">
                            <button id="junkButton"></button>
                            <button id="trashButton"></button>
                        </div>
                        <div class="email-body-button-group">
                            <button id="replyButton"></button>
                            <button id="replyAllButton"></button>
                            <button id="forwardButton"></button>
                        </div>
                        <div class="email-body-button-group">
                            <button id="refreshButton"></button>
                        </div>
                        <div id="mailViewerSwitch"></div>
                    </div>
                </div>
                <div id="bodyCenterArea">
                    <div class="list">
                        <div id="mailListGrid" class="ux-grid-table"></div>
                        <div id="mailListGridContextMenu"></div>
                        <div id="mailListGridContextSubmenu"></div>
                    </div>
                </div>
                <div id="bodyBottomArea">
                    <div class="eml-viewer">
                        <div class="eml-subject">
                            <div class="mark-normal"></div>
                            <label>Subject:</label>
                            <span id="rSubject"></span>
                        </div>
                        <div class="eml-from">
                            <label>Sender:</label>
                            <span id="rSender"></span>
                        </div>
                        <div class="eml-to">
                            <div class="eml-receivers">
                                <label>Receivers:</label>
                                <span id="rReceivers"></span>
                            </div>
                            <div class="eml-cc">
                                <label>CC:</label>
                                <span id="rCC"></span>
                            </div>
                        </div>
                        <div class="eml-body">
                            <div class="eml-attachment">
                                <div id="rFiles"></div>
                            </div>
                            <div class="eml-message">
                                <p id="rMessage"></p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div id="dialogMessageWriter">
                <div class="eml-viewer">
                    <form name="frm" method="post" action="./post.json">
                        <ul>
                            <li class="eml-from">
	                            <label for="sender">Sender:</label>
	                            <input type="text" id="wdSender" name="sender" />
                            </li>
                            <li class="eml-to">
                                <label for="receivers">Receivers:</label>
                                <input type="text" id="wdReceivers" name="receivers" />
                            </li>
                            <li class="eml-subject">
                                <label for="subject">Subject:</label>
                                <input type="text" id="wdSubject" name="subject" />
                            </li>
                            <li class="eml-body">
	                            <div class="eml-attachment">
	                                <label>Files:</label>
	                                <div id="wdFiles">
	                                    <div>drop your files here... </div>
	                                    <ul>
	                                    </ul>
	                                </div>
	                            </div>
	                            <div class="eml-message">
	                                <textarea id="wdMessage" name="message" rows="10" cols="100" style="width: 786px; height: 312px; display: none;"></textarea>
	                            </div>
                            </li>
                        </ul>
                        </div>
                    </form>
                </div>
            </div>
            <div id="dialogMessageViewer">
                <div class="eml-viewer">
                    <div class="eml-subject">
                        <div class="mark-normal"></div>
                        <label>Subject:</label>
                        <span id="rdSubject"></span>
                    </div>
                    <div class="eml-from">
                        <label>Sender:</label>
                        <span id="rdSender"></span>
                    </div>
                    <div class="eml-to">
                        <div class="eml-receivers">
                            <label>Receivers:</label>
                            <span id="rdReceivers"></span>
                        </div>
                        <div class="eml-cc">
                            <label>CC:</label>
                            <span id="rdCC"></span>
                        </div>
                    </div>
                    <div class="eml-body">
                        <div class="eml-attachment">
                            <label>Files:</label>
                            <div id="rdFiles"></div>
                        </div>
                        <div class="eml-message">
                            <p id="rdMessage"></p>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div id="grid-row-dd-proxy">
            <div class="dd-proxy"></div>
        </div>
    
    </div>
    <!-- // 컨텐츠 영역 -->
</div>
<%@ include file="./../../../../sample/pattern/bux/include/rui_footer.jspf"%>
</body>
</html>
