<%--
 * ============================================================================
 * @Project     : RUI Demo
 * @Source      : dashboard.jsp
 * @Name        : rui 
 * @Description : dashboard
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
    <title>Dashboard</title>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" >
<%@ include file="./../../../../sample/pattern/bux/include/rui_head.jspf"%>
<%@ include file="./../../../../sample/pattern/bux/include/rui.jspf"%>

<script type="text/javascript" src="./../../../../plugins/ui/grid/LTreeGridSelectionModel.js"></script>
<script type="text/javascript" src="./../../../../plugins/ui/grid/LTreeGridView.js"></script>
<link rel="stylesheet" type="text/css" href="./../../../../plugins/ui/grid/LTreeGridView.css"/>

<script type='text/javascript' src='./../../../../plugins/ui/LTooltip.js'></script>
<link rel="stylesheet" type="text/css" href="./../../../../plugins/ui/LTooltip.css"/>

<script type="text/javascript" src="./../../../../plugins/ui/LGuideManager.js"></script>
<link rel="stylesheet" type="text/css" href="./../../../../plugins/ui/LNotificationManager.css" />

<!--[if lte IE 6]><link rel="stylesheet" href="./../../../../resources/rui_ie6.css" type="text/css" /><![endif]-->

<link rel="stylesheet" type="text/css" href="./dashboard.css"/>

<script type="text/javascript" src="./LGallery.js"></script>

<script type="text/javascript" src="./dashboard.js"></script>
</head>  

<body>
<%@ include file="./../../../../sample/pattern/bux/include/rui_menu.jsp"%>
<div id="wrap">
    <!-- 컨텐츠 영역 -->
    <div class="ux-content-wrap">
        <div class="ux-title-bar" > 
            <h4 class="ux-grid-title">차트</h4>
        </div>
        <div class="ux-chart">
            <span class="ux-chart-wrap chart1">
                <div id="chart1" class="chart"></div>
            </span>
            <span class="ux-chart-wrap chart2">
                <div id="chart2" class="chart"></div>
            </span>
            <span class="ux-chart-wrap chart3">
                <div id="chart3" class="chart"></div>
            </span>
            <span class="ux-chart-wrap chart4 L-hide-display">
                <div id="chart4" class="chart"></div>
            </span>
        </div>
        <div class="ux-title" > 
            <h4 class="ux-grid-title">주문 현황</h4>
            <div class="grid1-title-buttons">
                <a href="./orderMng.jsp" class="ux-more"></a>
            </div>
        </div>
        <div class="ux-grid-wrap">
            <!-- 그리드 영역 --> 
            <div id="grid1" class="ux-grid-table"></div>
            <!-- //그리드 영역 --> 
        </div>
        <div class="ux-title" >
            <h4 class="ux-grid-title">반품 현황</h4>
            <div class="grid1-title-buttons">
                <a href="./orderMng.jsp" class="ux-more"></a>
            </div>
        </div>
        <div class="ux-grid-wrap">
            <!-- 그리드 영역 --> 
            <div id="grid2" class="ux-grid-table"></div>
            <!-- //그리드 영역 --> 
        </div>
        <div class="ux-title" >
            <h4 class="ux-grid-title">계정/여신 현황</h4>
        </div>
        <div id="layout-grid2" class="ux-grid-wrap">
            <!-- 그리드 영역 --> 
            <table style="width: 100%;table-layout: fixed;">
            <tr>
                <td style="width: 50%">
                   <div id="grid3" class="ux-grid-table"></div>
                </td>
                <td style="width: 32px">
                </td>
                <td style="width: 50%;">
                    <div id="grid4" class="ux-grid-table"></div>
                </td>
            </tr>
            </table>
            <!-- //그리드 영역 --> 
        </div>
        <!-- Gallery 영역 --> 
        <div class="ux-gallery">
	        <div class="ux-title-bar" > 
                <h4 class="ux-grid-title">제품 리뷰 (9건)</h4>
	            <div class="gallery-title-buttons">
	                <a href="#" class="ux-more"></a>
	            </div>
	        </div>
            <div id="imageGallery" ></div>
        </div>
        <!-- //Gallery 영역 --> 
    </div>
    <div class="L-tutorial">
    <div class="title">Tutorial</div>
    <ul>
        <li><a href="javascript:doTutorial('doLoadPage')" title="오픈소스 차트로 구현되어 있습니다.">차트</a></li>
        <li><a href="javascript:doTutorial('doFocusGrid1')" title="그리드에 틀고정 기능을 탑재했습니다.">틀고정</a></li>
        <li><a href="javascript:doTutorial('doFocusGrid2')" title="그리드에서 데이터에 맞게 컬럼 너비를 조정하는 기능을 탑재했습니다.">컬럼너비</a></li>
        <li><a href="javascript:doTutorial('doColumnresize')" title="그리드에서 정렬 기능을 탑재했습니다.">정렬</a></li>
        <li><a href="javascript:doTutorial('doFocusGrid3')" title="나라에 맞는 다국어 기능을 탑재했습니다.">다국어1</a></li>
        <li><a href="javascript:doTutorial('doFocusGrid4')" title="나라에 맞는 다국어 기능을 탑재했습니다.">다국어2</a></li>
        <li><a href="#" class="init-tutorial">초기화</a></li>
    </ul>
    </div>
    <div class="topicon-container"><a href="#menu_wrap" class="topicon"></a></div>
    <!-- div class="L-todo-notification">
    <ul>
        <li>금일 격언 : 똑바로 살자</li>
        <li>
            <div>바로가기</div>
            <ul>
                <li>주문관리</li>
                <li>전자메일</li>
                <li>공지사항/뉴스</li>
                <li><a href="" class="init-tutorial">초기화</a></li>
            </ul>
        </li>
    </ul>
    </div -->
    <!-- // 컨텐츠 영역 -->
</div>
<%@ include file="./chart_flotr2.jsp"%>
<%@ include file="./../../../../sample/pattern/bux/include/rui_footer.jspf"%>
</body>  
</html>