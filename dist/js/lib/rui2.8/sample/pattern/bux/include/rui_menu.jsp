<%@ page language="java" pageEncoding="utf-8" contentType="text/html; charset=utf-8"%>
<script type="text/javascript" src="./../../../../plugins/menu/rui_menu.js"></script>
<link type="text/css" rel="stylesheet" href="./../../../../plugins/menu/rui_menu.css" />
<style type="text/css" >
.slogan_left a {
    width: 197px;
    height: 59px;
    display: inline-block;
    z-index: 2;
}

.title-img {
    background: url('./../libs/assets/LGE_logo.png') no-repeat 20px 12px;
    *background: url('./../libs/assets/LGE_logo.gif') no-repeat 20px 12px;
    cursor: pointer;
    width: 150px;
    height: 55px;
    display: inline-block;
}
#menu_wrap {
    height: 55px;
    width: 100%;
    min-width:1200px;
    margin: 0 auto;
    padding: 0;
    border: 0px solid black;
}
#menu_wrap #header {
    background: url('./../../../../sample/pattern/bux/libs/assets/GNB_bg.png');
    height: 55px;
}
#menu_wrap #header .top-left {
    width: 197px;
    height: 50px;
    position: absolute;
    top: 0;
}
#menu_wrap #header .top-left img{
    position: relative;
    top: 13px;
    left: 22px;
}
#menu_wrap #header .top-body {
    min-width: 640px;
    height: 50px;
}
#menu_wrap #header .top-right {
    position: absolute;
    width: 300px;
    height: 50px;
    top: 0px;
    right: 0px;
    text-align: right;
}
#menu_wrap #header .top-right .session-msg {
    position: relative;
    top: 16px;
    font-family: 'dotum';
    size: 12pt;
    color: #fffefe;
    float: left;
    text-align: right;
    width: 210px;
}
#menu_wrap #header .top-right .session-off {
    position: relative;
    float: left;
    top: 16px;
    right: 0px;
    width: 90px;
}
#menu_wrap #header .top-right .session-off  a{
    position: relative;
    right: 19px;
}
#menu_wrap #topMenu .L-ul-tabmenu .L-ul-first {
    position: absolute;
    top: 0px;
    left: 197px;
    margin-left: -197px !important;
}

#topMenu .L-ul-tabmenu .L-ul-first {
    display: inline-block;
    border: 0;
    box-shadow: none;
}
#topMenu .L-ul-tabmenu .L-ul-first ul {
	border: 0;
	padding: 0;
	background-color: #fff;
	box-shadow: none;
}
#topMenu .L-ul-tabmenu .L-ul-depth-1 ul {
margin-left: 3px;
}
#topMenu .L-ul-tabmenu .L-ul-focus-parent-node {
    background-color: inherit;
}
#topMenu .L-ul-tabmenu .L-ul-focus-node {
    background-color: inherit;
}
#topMenu .L-ul-tabmenu .L-ul-li-index-0 > .L-ul-node {
    cursor: pointer;
}

#menu_wrap #topMenu .L-ul-tabmenu .L-ul-depth-0 .L-ul-li-index-0 {
    background: url('./../../../../sample/pattern/bux/libs/assets/btn_worksystem.png') no-repeat left top;
    width: 152px;
    margin-left: 199px;
    margin-right: 1px;
}
#menu_wrap #topMenu .L-ul-tabmenu .L-ul-depth-0 .L-ul-li-index-0:hover {
    background: url('./../../../../sample/pattern/bux/libs/assets/btn_worksystem_mouseover.png') no-repeat left top;
    width: 152px;
    margin-left: 199px;
    margin-right: 1px;
}
#menu_wrap #topMenu .L-ul-tabmenu .L-ul-depth-0 .L-ul-li-index-1 {
    background: url('./../../../../sample/pattern/bux/libs/assets/btn_mail.png') no-repeat left top;
    width: 155px;
}
#menu_wrap #topMenu .L-ul-tabmenu .L-ul-depth-0 .L-ul-li-index-1:hover {
    background: url('./../../../../sample/pattern/bux/libs/assets/btn_mail_mouseover.png') no-repeat left top;
    width: 155px;
}

#menu_wrap #topMenu .L-ul-tabmenu .L-ul-depth-0 .L-ul-li-index-2 {
    background: url('./../../../../sample/pattern/bux/libs/assets/btn_board.png') no-repeat left top;
    width: 155px;
}
#menu_wrap #topMenu .L-ul-tabmenu .L-ul-depth-0 .L-ul-li-index-2:hover {
    background: url('./../../../../sample/pattern/bux/libs/assets/btn_board_mouseover.png') no-repeat left top;
    width: 155px;
}
#menu_wrap #topMenu .L-ul-tabmenu .L-ul-depth-0 .L-ul-li-index-3 {
    background: url('./../../../../sample/pattern/bux/libs/assets/btn_sitemap.png') no-repeat left top;
    width: 155px;
}
#menu_wrap #topMenu .L-ul-tabmenu .L-ul-li-index-3:hover {
    background: url('./../../../../sample/pattern/bux/libs/assets/btn_sitemap_mouseover.png') no-repeat left top;
    width: 155px;
}
#menu_wrap #topMenu .L-ul-tabmenu .L-ul-li-depth-0 .L-ul-tabmenu-content {
    font-size: 14px;
    padding: 0px;
    height: 55px;
    display: block;
}

#menu_wrap #topMenu .L-ul-tabmenu .L-ul-li-index-0 .L-ul-tabmenu-content div.menuPanel {
	margin-left: -200px;
	margin-top: -7px;
	z-index: 4;
}
#menu_wrap #topMenu .L-ul-tabmenu .L-ul-li-index-2 .L-ul-tabmenu-content div.menuPanel {
    margin-top: -7px;
}
#menu_wrap #topMenu .L-ul-tabmenu .L-ul-li-index-3 .L-ul-tabmenu-content div.siteMapPanel {
    margin-left: -200px;
    margin-top: -7px;
}

#menu_wrap #topMenu .L-ul-tabmenu .L-ul-depth-1 .L-ul-li-depth-1,
#menu_wrap #topMenu .L-ul-tabmenu .L-ul-depth-1 .L-ul-li-depth-1 .L-ul-tabmenu-content {
    height: 0px;
}

.menuPanel {
    display: inline-block;
    background-color: #fff;
    border: 2px solid #c5003d;
    width: 138px;
    position: relative;
    z-index: 5;
    padding: 15px 5px;
}
.menuTitle {
    font-size: 12px !important;
    font-weight: bold;
    color: #AF2841;
}
.siteLink {
    margin-top: 7px !important;
    margin-bottom: 7px !important;
    clear: both;
}

#menu_wrap #topMenu .L-ul-tabmenu .levelGroup .level1 div {
    font-family: 'dotum';
    font-weight: 700;
    font-size: 11pt !important;
    color: #535353 !important;
    margin-left: 15px;
}
#menu_wrap #topMenu .L-ul-tabmenu .levelGroup .level1 img {
    margin-left: 15px;
}
#menu_wrap #topMenu .L-ul-tabmenu .levelGroup .level2 div{
    background: url('./../../../../sample/pattern/bux/libs/assets/bullet.png') no-repeat left;
    padding-left: 9px;
    font-family: 'dotum';
    font-weight: 700;
    font-size: 10pt !important;
    color: #aeaeae !important;
    margin-left: 17px;
}
#menu_wrap #topMenu .L-ul-tabmenu .levelGroup .level2 div:hover{
    background: url('./../../../../sample/pattern/bux/libs/assets/bullet_mouseover.png') no-repeat left;
    padding-left: 9px;
    font-family: 'dotum';
    font-weight: 700;
    font-size: 10pt !important;
    color: #2b2b2b !important;
    margin-left: 17px;
}

#menu_wrap #topMenu .L-ul-tabmenu .L-ul-li-index-3 .L-ul-tabmenu-content div.siteMapPanel .levelGroupSplit1 {
    position: absolute;
    background: url('./../../../../sample/pattern/bux/libs/assets/dropdown_sitemap_devider.png') no-repeat left top;
    width: 1px;
    height: 125px;
    margin-left: 140px;
}
#menu_wrap #topMenu .L-ul-tabmenu .L-ul-li-index-3 .L-ul-tabmenu-content div.siteMapPanel .levelGroupSplit2 {
    position: absolute;
    background: url('./../../../../sample/pattern/bux/libs/assets/dropdown_sitemap_devider.png') no-repeat left top;
    width: 1px;
    height: 125px;
    margin-left: 234px;
}
.siteMapPanel {
    width: 372px;
    background-color: #fff;
    height: 114px !important;
    position: relative;
    z-index: 5;
    border: 2px solid #c5003d;
    padding: 25px 5px;
}
.siteMapPanel ul {
    position: relative;
}
.siteMapPanel .levelGroup0 {
    float: left;
    width: 140px;
}
.siteMapPanel .levelGroup1 {
    float: left;
    width: 94px;
}
.siteMapPanel .levelGroup2 {
    float: left;
    width: 120px;
}

#topMenuSplit div {
    position: absolute;
    background: url('./../../../../sample/pattern/bux/libs/assets/GNB_devider.png') no-repeat left top;
    width: 2px;
    height: 50px;
    top: 0px;
    left: 197px;
}
#topMenuSplit .topMenuSplit0 {
    left: 197px;
}
#topMenuSplit .topMenuSplit1 {
    left: 350px;
}
#topMenuSplit .topMenuSplit2 {
    left: 505px;
}
#topMenuSplit .topMenuSplit3 {
    left: 659px;
}
#topMenuSplit .topMenuSplit4 {
    left: 813px;
}
</style>
<script type="text/javascript">
Rui.onReady(function(){
	Rui.License = 'MTI3LjAuMC4xO2xvY2FsaG9zdA==';
    /*******************
     * 변수 및 객체 선언
     *******************/
     var webStore = new Rui.webdb.LWebStorage();
     var userName = webStore.get('userName');
     var position = webStore.get('position');

     var menuDataSet = new Rui.data.LJsonDataSet({
        id: 'dataSet',
        fields: [
            { id: 'menuId', type: 'number' },
            { id: 'seq', type:  'number' },
            { id: 'parentMenuId', type: 'number' },
            { id: 'menuName' },
            { id: 'menuType' },
            { id: 'menuNavi' }
        ]
    });

    var topMenu = new Rui.ui.menu.LTabMenu({
        dataSet: menuDataSet,
        expandOnOver: false,
        fields: {
            rootValue: null,
            parentId: 'parentMenuId',
            id: 'menuId',
            label: 'menuName',
            order: 'seq'
        },
        renderer: function(label, record, nodeStateClass) {
            var id = record.get('menuId'),
                pid = record.get('parentMenuId'),
                type = record.get('menuType');
            if(pid !== null){
                if(type === 1) {
                    var html = '<ul class="levelGroup">';
                    // siteMap 링크 관련 제외
                    for(var i = id-1, len = menuDataSet.getCount() - 2 ; i < len; i++) {
                        var r = menuDataSet.getAt(i);
                        var link = r.get('menuNavi') || '#';
                        if(r.get('parentMenuId') != pid){
                            break;
                        }
                        html += '<li class="siteLink level2"><a href="' + link + '"><div>' + r.get('menuName') + '</div></a></li>';
                    }
                    return '<div class="menuPanel">' + html + '</ul></div>'; 
                }else if(type === 2) {
                    var group = 0;
                    var html = '<ul class="levelGroup levelGroup'+(group++)+'">';
                    // siteMap 링크 관련 제외
                    for(var i = 0, len = menuDataSet.getCount() - 2 ; i < len; i++) {
                        var r = menuDataSet.getAt(i);
                        var depthLevel = r.get('parentMenuId') ? 'level2' : 'level1';
                        var link = r.get('menuNavi') || '#';
                        if(i !== 0 && depthLevel === 'level1') {
                            html += '</ul><div class="levelGroupSplit'+(group)+'"></div><ul class="levelGroup levelGroup'+(group++)+'">';
                        }
                        html += '<li class="siteLink ' + depthLevel + '"><a href="' + link + '"><div>' + r.get('menuName') + '</div></a></li>';
                    }
                    return '<div class="siteMapPanel">' + html + '</ul></div>'; 
                }
            }
            return '';
        }
    });

    Rui.get('userName').html('안녕하세요. <strong>' + (userName || '홍길동')+ '</strong> 님 (' + (position == '001' ? '본사' : '대리점') + ')');
    
    /*******************
     * 사용자 이벤트 처리
     *******************/
    topMenu.on('nodeClick', function(e) {
        var record = e.node.getRecord();
        if(record.get('parentMenuId') === null && record.get('menuNavi') === '') return;
        if(record.get('menuType') === 1) return;
        var menuId = record.get('menuId');
        var menuUrl = record.get('menuNavi');
        //var args = record.get('args');
        document.maform.target = "_self";
        document.maform.action = menuUrl;
        document.maform.menuId.value = menuId;
        //document.maform.args.value = args;
        document.maform.method = "post";
        document.maform.submit(); 
    });

    topMenu.render('topMenu');
    
    menuDataSet.loadData({ "records": [
        { 'menuId': 1, 'menuName': 'Work System', 'parentMenuId': null, 'seq': 1, 'menuType': 0, 'menuNavi': '' },
        { 'menuId': 2, 'menuName': '신규주문', 'parentMenuId': 1, 'seq': 1, 'menuType': 1, 'menuNavi': './../../../../sample/pattern/bux/dashboard/newOrder.jsp' },
        { 'menuId': 3, 'menuName': '주문관리', 'parentMenuId': 1, 'seq': 1, 'menuType': 0, 'menuNavi': './../../../../sample/pattern/bux/dashboard/orderMng.jsp' },
        { 'menuId': 4, 'menuName': '주문현황 보고서', 'parentMenuId': 1, 'seq': 1, 'menuType': 0, 'menuNavi': '' },
        { 'menuId': 5, 'menuName': 'Mail', 'parentMenuId': null, 'seq': 1, 'menuType': 0, 'menuNavi': './../../../../sample/pattern/bux/email/email.jsp' },
        { 'menuId': 6, 'menuName': 'Board', 'parentMenuId': null, 'seq': 1, 'menuType': 0, 'menuNavi': '' },
        { 'menuId': 7, 'menuName': '공지사항', 'parentMenuId': 6, 'seq': 1, 'menuType': 1, 'menuNavi': '' },
        { 'menuId': 8, 'menuName': '뉴스', 'parentMenuId': 6, 'seq': 1, 'menuType': 0, 'menuNavi': '' },
        { 'menuId': 9, 'menuName': '나도 한마디', 'parentMenuId': 6, 'seq': 1, 'menuType': 0, 'menuNavi': '' },
        { 'menuId': 10, 'menuName': 'Site Map', 'parentMenuId': null, 'seq': 1, 'menuType': 0, 'menuNavi': '' },
        { 'menuId': 11, 'menuName': 'Site Map', 'parentMenuId': 10, 'seq': 1, 'menuType': 2, 'menuNavi': '' }
    ]});
});

var lfnc_doLogOut = function(){

      document.maform.target = "_self";
      document.maform.action = '<c:url value="/system/logout.dev"/>';
      document.maform.method = "post";
      document.maform.submit();
};

/*------------- menu function -------------------------*/
/* 확인사항 - 필요한지??   기능 */
var popContactUs = function(){
    
    if(!fncSessionCheck()){
        window.location = '<c:url value="/index.dev"/>';
        
    }else{
        var width       = "600";
        var height      = "370";
        
        var url         = '<c:url value="/jsp/common/popContactUs.jsp"/>';
        var winOpts = "scrollbars=no, toolbar=no, location=no, width=600, height=370";
        
        var obj         = window.open(url, "popup", winOpts);
    }
};

function changeSupplier (){
    
    if(!fncSessionCheck()){
        window.location = '/index.dev';
    }else{
        var width       = "750";
        var heigth      = "460";
        var url         = '<c:url value="/jsp/common/popChangeSupplier.jsp"/>';
        var winOpts = "scrollbars=no, toolbar=no, location=no, width=750, height=460";
        
        var obj         = window.open(url, "popup", winOpts);
    }
}

function popDocumentDownload (){
    
    if(!fncSessionCheck()) {
        window.location = "/index.dev";
    } else {
        var width       = "480";
        var height      = "550";

        var url         = '<c:url value="/jsp/common/popDocumentDownload.jsp"/>';
        var winOpts = "scrollbars=no, toolbar=no, location=no, width=480, height=550";
        
        var obj             = window.open(url,'popup',winOpts);
    }   
}

function popChangePassword (){
    
    if(!fncSessionCheck()) {
        window.location = "/index.dev";
    } else {
        var width       = "450";
        var height      = "250";
        var url         = '<c:url value="/jsp/common/popChangePassword.jsp"/>';
        var winOpts = "scrollbars=no,toolbar=no,location=no,width=450,height=250";
        
        var obj             = window.open(url,'popup',winOpts);
    }   
};

function goProduct(productId) {
    alert(productId + '번 제품의 상세정보로 이동합니다.');
}

/*------------- menu function end -------------------------*/

</script> 
<div id="menu_wrap">
    <div id="header">
        <div class="top-body">
	        <div id="topMenu">
	        </div><!-- END/topMenu -->
        </div>
        <div class="top-left">
            <p class="slogan_left"><a href="./../../../../sample/pattern/bux/dashboard/dashboard.jsp"><span class="title-img"></span></a></p> 
        </div>
        <div class="top-right" >
            <div class="session-msg">
                <c:if test="${not empty userSession}">
                    <span id="userName">안녕하세요.</span>
                </c:if>
            </div>
            <div class="session-off">
                <a href="./../../../../sample/pattern/bux/index.jsp"><img src="./../../../../sample/pattern/bux/libs/assets/btn_logout.png"  style="cursor:pointer;"></a>
            </div>
        </div>
        <div id="topMenuSplit">
           <div class="topMenuSplit0"></div>
           <div class="topMenuSplit1"></div>
           <div class="topMenuSplit2"></div>
           <div class="topMenuSplit3"></div>
           <div class="topMenuSplit4"></div>
        </div>
    </div><!-- END/header -->
</div><!-- END/wrap -->
<form name="maform" method="post">
<input type="hidden" id="menuId" name="menuId" />
<input type="hidden" id="args" name="args" />
<input type="hidden" id="propTypeCode" name="propTypeCode" />
<input type="hidden" id="propCode" name="propCode" />
<input type="hidden" id="menuAttr" name="menuAttr" />
<input type="hidden" id="tocMenuId" name="tocMenuId" />
</form>
<form name=session_login action="/common/sessionChangeLogin.lge" method=post>
    <INPUT TYPE="hidden" NAME='gridXml'  VALUE='' />
</form>