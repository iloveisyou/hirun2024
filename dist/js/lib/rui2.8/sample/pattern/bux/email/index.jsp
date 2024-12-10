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
<%@ include file="./../../../sample/pattern/bux/include/doctype.jspf" %>
<html> 

<head>
<title>Dashboard</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" >
<%@ include file="./../../../sample/pattern/bux/include/rui_head.jspf"%>
<%@ include file="./../../../sample/pattern/bux/include/rui.jspf"%>

<script type="text/javascript" src="./../../../../plugins/layout/rui_layout.js"></script>
<script type="text/javascript" src="./../../../../plugins/util/LResize.js"></script>

<script type="text/javascript" src="./../../../../plugins/ui/LSwitch.js"></script>
<link type="text/css" rel="stylesheet" href="./../../../../plugins/ui/LSwitch.css" />

<script type="text/javascript" src="./../../../../tools/third_party/smartEditor/js/HuskyEZCreator.js" charset="utf-8"></script>

<script type="text/javascript" src="./index.js"></script>

<style type="text/css">
    #menu_wrap {
        position: absolute;
        z-index: 1;
        top:0px;
    }
    #wrap {
        position: absolute;
        top: 90px;
        left: 0px;
        right: 0px;
        bottom: 13px;
    }
    #ft {
        position: absolute;
        bottom: 0px;
        height: 13px;
        z-index: 1;
    }
	
	#leftArea {
        background-color: lightblue;
        position: absolute;
        top: 0px;
        left: 0px;
        bottom: 0px;
        width: 200px;
        min-height: 100%;
	}
	
	#bodyArea {
        background-color: yellow;
        position: absolute;
        left: 200px;
        right: 0px;
        top: 0px;
        bottom: 0px;
        width: auto;
        min-height: 100%;
	}
	
	#bodyTopArea {
	    background-color: lightgreen;
	    position: absolute;
	    width: 100%;
	    height: 100%;
	}
	
	#bodyBottomArea {
	    background-color: orange;
        position: absolute;
        width: 100%;
        top: 350px;
        left: 0px;
	}
	
    #leftArea .L-resize-handle-r {
        right: 0px;
        bottom: 0px;
        height: 100%;
        width: 5px;
        position: absolute;
        cursor: ew-resize;
    }
    
    #bodyTopArea .L-resize-handle-b {
        left: 0px;
        right: 0px;
        bottom: 0px;
        height: 5px;
        width: 100%;
        position: absolute;
        cursor: ns-resize;
    }
    
    .L-resize .L-resize-handle-active {
        background-color: #7d98b8;
    }

    .L-switch li{
        width: 20px;
        height: 20px;
    }
    .L-switch-button{
        background-color: blue;
    }
    .L-switch-on {
        background-color: red;
    }
</style>
</head>
<body>
<%@ include file="./../../../sample/pattern/bux/include/rui_menu.jsp"%>
<div id="wrap">
    <!-- 컨텐츠 영역 -->

        <div id="layout">
            <div id="leftArea">
                <div>
                    <button id="newMessageBtn">New Message</button>
                </div>
                <div>
                    <ul id="mailboxList">
                        <li><a id="linkInbox" href="#">Inbox</a><span id="inboxCount">10</span></li>
                        <li><a id="linkSent" href="#">Sent</a></li>
                        <li><a id="linkImportant" href="#">Important</a></li>
                        <li><a id="linkUnread" href="#">Unread</a></li>
                        <li><a id="linkDrafts" href="#">Drafts</a></li>
                        <li><a id="linkJunk" href="#">Junk</a><span id="junkCount">51</span></li>
                        <li><a id="linkTrash" href="#">Trash</a><span id="trashCount">3</span></li>
                    </ul>
                </div>
            </div>
            <div id="bodyArea">
                <div id="bodyTopArea">
	                <div class="title">
	                    <H2 id="mailBoxName">Inbox</H2>
	                </div>
	                <div class="buttons">
	                    <span>
	                        <button id="importantBtn">Important</button>
	                        <button id="readToggleBtn">Read / Unread</button>
	                        <button id="junkBtn">Junk</button>
	                        <button id="trashBtn">Trash</button>
	                        <button id="replyBtn">Reply</button>
	                        <button id="replyAllBtn">Reply to Receivers</button>
	                        <button id="forwardBtn">Forward</button>
	                        <button id="refreshBtn">Refresh</button>
	                    </span> <span>
	                        <div id="mailViewerSwitch"></div>
	                    </span>
	                </div>
                    <div id="mailListGrid" ></div>
                </div>
                <div id="bodyBottomArea" style=";">
                    <div id="title">
                        <H2 id="mailMessageBoxName">Message</H2>
                    </div>
                    <div class="message-hd">
                        <div class="message-hd-subject">
                            <span id="messageImportant">☆</span>
                            <span id="messageSubject"></span>
                        </div>
                        <div class="message-hd-sender">
                            <span>Sender :</span> <span id="messageSender"></span>
                        </div>
                        <div class="message-hd-sender">
                            <span id="receivers">Receivers :</span> <span id="messageReceivers"></span>
                        </div>
                    </div>
                    <div class="message-bd">
                        <p id="messageBody"></p>
                    </div>
                </div>
            </div>
            <div id="dialogMessage">
                <div class="bd">
                    <form name="frm" method="post" action="./post.json">
                        <div>
                            <label for="sender">Sender:</label>
                            <input type="text" id="sender" name="sender" />
                        </div>
                        <div>
                            <label for="receivers">Receivers:</label>
                            <input type="text" id="receivers" name="receivers" />
                        </div>
                        <div>
                            <label for="subject">Subject:</label>
                            <input type="text" id="subject" name="subject" />
                        </div>
                        <div>
                            <textarea name="message" id="message" rows="10" cols="100"
                                style="width: 786px; height: 312px; display: none;"></textarea>
                        </div>
                        <div>
                            <div id="files" style="width: 768px; height: 100px; border: 1px solid"></div>
                        </div>
                    </form>
                </div>
            </div>
        </div>

        <div id="grid-row-dd-proxy"></div>
    
    <!-- // 컨텐츠 영역 -->
</div>
<%@ include file="./../../../sample/pattern/bux/include/rui_footer.jspf"%>
</body>
</html>
