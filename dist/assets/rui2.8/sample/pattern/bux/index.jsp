<%--
 * ============================================================================
 * @Project     : RUI
 * @Source      : index.jsp
 * @Name        : rui
 * @Description : User Login Page
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
<title>User Login Page</title>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" >

<script type="text/javascript" src="./../../../js/rui_base.js"></script>
<script type="text/javascript" src="./../../../js/rui_core.js"></script>
<script type="text/javascript" src="./../../../js/rui_ui.js"></script>
<script type="text/javascript" src="./../../../js/rui_form.js"></script>
<script type="text/javascript" src="./../../../js/rui_grid.js"></script>
<script type="text/javascript" src="./../../../resources/rui_config.js"></script>
<script type="text/javascript" src="./../../../resources/rui_license.js"></script>
<script type="text/javascript" src="./../../../resources/locale/lang-ko_KR.js"></script>

<script type="text/javascript" src="./../../../plugins/ui/LGuideManager.js"></script>

<link rel="stylesheet" type="text/css" href="./../../../resources/rui.css" />
<link rel="stylesheet" type="text/css" href="./../../../sample/pattern/bux/css/style.css" />
<link rel="stylesheet" type="text/css" href="./../../../sample/pattern/bux/login/css/login.css"/>

<!--[if lte IE 6]><link rel="stylesheet" href="./../../../resources/rui_ie6.css" type="text/css" /><![endif]-->

<style type="text/css">
html, body { height: 100%; }
body { 
    margin-left: 0px; 
    margin-top: 0px; 
    margin-right: 0px; 
    margin-bottom: 0px;
}
.L-panel .hd {
    line-height: 26px;
}
#loginContainer {
    position:relative;
    top: 50%;
    top: 40%\9;
    margin-top:-118px;  
    width:626px; 
    height:236px;
    background-image: url('./../../../sample/pattern/bux/login/img/LGE_login_bg1.png');
    background-repeat: no-repeat
}

.userInput{
    width: 165px;
    height: 21px;
    border: 1px;
    border-style: solid;
    border-width: 1px;
    border-color: #cccccc;
    font-family: dotum;
    font-size: 12px;
    color: #afafaf;
    font-weight: bold;
    padding-left: 8px;
    line-height: 25px;
}
#lblColor{
    font-family: dotum;
    font-size: 12px;
    color: #8d8c8c;
}
#regUserInfo{
    border: 1px;
    border-style: solid
}

.L-panel {
    border-collapse:separate;
    left:0;
    top:0;
    font:1em Arial;
    background-color:#FFF;
    border:1px solid #C5003D;
    z-index:1;
    overflow:hidden;
}
.L-dialog .ft {
    /* padding-bottom:5px; */
    /* padding-right:5px; */
    /* position: relative; */
    text-align: center;
    height: 27px;
    /* vertical-align: bottom; */
}

.ux_dlg_header {
    padding-left: 10px;
}

.ux_dlg_chkmsg {
    position: absolute;
    text-align: left;
    z-index:1;
    margin: 50px 0 0 16px;
    }

 .button-group{
    position: absolute;
    top: 91px;
    margin-left: -32px;
    margin-left: 120px\9;
 }
 
 .ft .button-group{
     margin-left: 100px\9;
 }

.button-group button{
    width:50px;
}
.L-panel .hd {
    background-color: #c5003d;
    background:-moz-linear-gradient(top, #c5003d, #c5003d 100%) !important;
    background: -webkit-gradient(linear, 0% 0%, 0% 100%, from(#c5003d), to(#c5003d)) !important;
    color: #fff;
    height: 28px;
    padding-left: 10px;
}
 .L-panel .bd {
    overflow:hidden;
    vertical-align: middle;
    position: relative;
    padding-left: 10px;
    text-align: center;
}
</style>
<script>
function msieversion()
{
   var ua = window.navigator.userAgent;
   var msie = ua.indexOf ( "MSIE " );

   if ( msie > 0 )     // 브라우저 버젼 반환
      return parseInt (ua.substring (msie+5, ua.indexOf (".", msie )));
   else                 // 타 브라우, return 0
      return 0;
}

function imgCbox(N, tabstop)
{
    var objs, cboxes, Img, Span, A;
    objs = document.getElementsByTagName("INPUT");
    if (N == undefined) return false;
    if (tabstop == undefined) tabstop = true;

        for (var i=0; i < objs.length; i++) {
        if (objs[i].type != "checkbox" || objs[i].name != N) continue;
        if (imgCbox.Objs[N] == undefined) {
            imgCbox.Objs[N] = [];
            imgCbox.Imgs[N] = [];
            imgCbox.ImgObjs[N] = [];
        }

        var len = imgCbox.Objs[N].length;
        imgCbox.Objs[N][len] = objs[i];
        imgCbox.Imgs[N][len] = {};

        // for image cache
        (Img = new Image()).src = objs[i].getAttribute("onsrc");
        imgCbox.Imgs[N][len]["on"] = Img;

        (Img = new Image()).src = objs[i].getAttribute("offsrc");
        imgCbox.Imgs[N][len]["off"] = Img;

        // image element
        Img = document.createElement("IMG");
        Img.src = objs[i].checked?objs[i].getAttribute("onsrc"):objs[i].getAttribute("offsrc");
        Img.style.borderWidth = "0px";
        Img.onclick = new Function("imgCbox.onclick('"+N+"','"+len+"')");
        imgCbox.ImgObjs[N][len] = Img;

        // anchor element for tab stop
        A = document.createElement("A");
        if (tabstop) {
            A.href = "javascript:;";
            A.onkeypress = new Function("evt", "if(evt==undefined)evt=event;if(evt.keyCode==32||evt.keyCode==0){ imgCbox.onclick('"+N+"','"+len+"'); }");
        }
        A.style.borderWidth = "0px";
        A.appendChild(Img);

        // insert object
        Span = objs[i].parentNode;
        Span.style.display = "none";
        Span.parentNode.insertBefore(A, Span);
        }
    }

    imgCbox.onclick = function(N, idx) {
        var C = imgCbox.Objs[N][idx];
        var I = imgCbox.ImgObjs[N][idx];

        C.checked = !C.checked;
        I.src = imgCbox.Imgs[N][idx][C.checked?"on":"off"].src;

        // fire event
        if (C.onclick != undefined || C.onclick != null) C.onclick();
    }

    imgCbox.Objs = {};
    imgCbox.Imgs = {};
    imgCbox.ImgObjs = {};
</script>
<script type="text/javascript">
    Rui.onReady(function() {
        /*******************
         * 변수 및 객체 선언
         *******************/
         var KEY = Rui.util.LKey.KEY;
        //Web Storage
         var manager = new Rui.webdb.LWebStorage();
         manager.remove('userId');
         manager.remove('companyName');
         manager.remove('userName');
         manager.remove('position');

        var btnLogin = new Rui.ui.LButton('btnLogin');

        var checkUser = function(val) {
            var isUser = false;
            switch (val){
            case 'demo1':
            case 'demo2':
                isUser = true;
            break;
            }
            return isUser;
        };

        var handleSubmit = function() {
            Rui.get('regUserInfo').setValue(true);
            manager.set('tempUserId', Rui.get('userId').getValue());
            this.submit(true);
            Rui.get('regUserInfo').setChecked(true);
            manager.set('isDisplay', Rui.get('chkDisplay').isChecked() ? 'N' :'Y');
            doLogin();
        };

        var handleCancel = function() {
            Rui.get('regUserInfo').setValue(false);
            manager.remove('tempUserId');
            this.cancel(true);
            Rui.get('regUserInfo').setChecked(false);
            manager.set('isDisplay', Rui.get('chkDisplay').isChecked() ? 'N' :'Y');
            doLogin();
        };

        // 아이디 기억
        var dialog1 = new Rui.ui.LDialog({
            applyTo: 'dialog1',
            width: 300,
            height: 168,
            close: false,
            visible: false,
            postmethod: 'async',
            buttons: [
                { text: 'YES', handler: handleSubmit, isDefault: true },
                { text: 'NO', handler: handleCancel }
            ]
        });

        var doLogin = function() {
            manager.set('userId', Rui.get('userId').getValue());
            manager.set('companyName', '무한상사');
            if(Rui.get('regUserInfo').isChecked()) {
                manager.set('tempUserId', Rui.get('userId').getValue());
            } else {
                manager.remove('tempUserId');
            }

            if(Rui.get('userId').getValue() == 'demo1') {
                manager.set('userName', '박문수');
                manager.set('position', '001'); // 본사코드
                manager.set("email", "richui2@test.com"); // email address 
            } else {
                manager.set('userName', '홍길동');
                manager.set('position', '002'); // 대리점코드
                manager.set("email", "richui2@test.com"); // email address 
            }
            window.location.href = './../../../sample/pattern/bux/dashboard/dashboard.jsp';
        };

        /*******************
         * 사용자 이벤트 처리
         *******************/
         Rui.get('userId').on('keypress', function(e) {
             var key = KEY;
             if(e.keyCode != key.ENTER) return;
             if(Rui.get('userId').getValue().length > 0)
                 Rui.get('password').focus();
         });

         Rui.get('password').on('keypress', function(e) {
             var key = KEY;
             if(e.keyCode != key.ENTER) return;
             if(Rui.get('password').getValue().length > 0){
                 btnLogin.click();
                 Rui.util.LEvent.stopEvent(e);
             }
         });

        dialog1.on('show', function(e){
            if(manager.get('isDisplay', 'Y') == 'N')
                Rui.get('chkDisplay').setValue(true);
            else
                Rui.get('chkDisplay').setValue(false);
        });

        btnLogin.on('click', function(e) {
            if(Rui.isEmpty(Rui.get('userId').getValue())) {
                Rui.alert({
                    height: 120,
                    text: '아이디를 입력하세요.',
                    handler: function() {
                        Rui.get('userId').focus();
                    }
                });
                return;
            }

            if(Rui.isEmpty(Rui.get('password').getValue())) {
                Rui.alert({
                    height: 120,
                    text: '비밀번호를 입력하세요.',
                    handler: function() {
                        Rui.get('password').focus();
                    }
                });
                return;
            }

            if(checkUser(Rui.get('userId').getValue()) && Rui.get('userId').getValue() == Rui.get('password').getValue()) {
                if(manager.get('tempUserId', null) == null && manager.get('isDisplay', 'Y') == 'Y' && Rui.get('regUserInfo').isChecked() == false){
                    dialog1.clearInvalid();
                    dialog1.show(true);
                    return;
                }
                doLogin();
            }else{
                Rui.alert({
                    height: 120,
                    text: '아이디 또는 비밀번호를 다시 확인하세요.',
                    handler: function() {
                        Rui.get('userId').focus();
                    }
                });
            }
        });

        var userId = manager.get('tempUserId', null);
        if(userId != null) {
            Rui.get('regUserInfo').setValue(true);
            Rui.get('userId').setValue(userId);
            Rui.get('password').focus();
            Rui.get('regUserInfo').setChecked(true);
        } else
            Rui.get('userId').focus();

        var guideManager = new Rui.ui.LGuideManager({ pageName: 'index', params: { dialog1: dialog1 }, debug: false });
        
        if(msieversion < 8){
        	alert('IE6 or IE7에서는 웹표준 스타일 및 일부 스크립트를 지원하지 않으므로 사용하실 수 없습니다.');
        	btnLogin.disable();
        }
    });

</script>
</head>
<body>
<div id="loginContainer" class="ux_login_wrap">
    <!-- 사용자 로그인 -->
    <div id="loginInfo" class="ux_login_fieldset">
        <form action="#" method="post">
            <fieldset>
            <div class="ux_area">
           
            <div class="ux_idcheck">
             <span>
            <input type="checkbox" id="regUserInfo" name="chkbox"/></span>
            <label id ="lblColor" for="아이디기억">아이디 기억</label></div>
                <div class="ux_userid" ><input type="text" id="userId" class="userInput" maxLength="8" tabIndex="0" placeholder="아이디"></div>
                <div class="ux_pwd"><input type="password" id="password"  class="userInput" maxLength="8" tabIndex="0" placeholder="비밀번호" ></div>
                <div class="ux_btn_login" id="btnLogin" tabIndex="0"></div>
            </div>
            </fieldset>
        </form>
    </div>
</div>
<!-- 
<div class="ux_login_footer">
    <%@ include file="./../../../sample/pattern/bux/include/rui_footer.jspf"%>
</div>
 -->
<!-- 아이디 기억 -->
<div id="dialog1" >
    <div id="hd" class="ux_dlg_header"><div class="ux_dlg_msg_title">Message</div></div>
    <div id="bd" class="ux_dlg_msg">
        <form name="frm" method="post" action="">
            <p>아이디를 기억해 둘까요?</p>
        </form>
    </div>
    <div id="chkDisplayWrap" class="ux_dlg_chkmsg">
        <input type="checkbox" id="chkDisplay"><label for="표시유무">다음부터 표시하지 않음</label>
    </div>
</div>

<!-- 체크박스 이미지 변경 -->
<!-- 
<script>imgCbox("chkbox");</script>
 -->
</body>
</html>