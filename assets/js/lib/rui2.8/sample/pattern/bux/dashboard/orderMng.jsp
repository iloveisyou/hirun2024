<%--
 * ============================================================================
 * @Project     : RUI Demo
 * @Source      : orderMng.jsp
 * @Name        : rui 
 * @Description : Order manager
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
<script type="text/javascript" src="./../../../../plugins/tab/rui_tab.js"></script>
<link rel="stylesheet" type="text/css" href="./../../../../plugins/tab/rui_tab.css" />
<script type="text/javascript" src="./../../../../plugins/ui/form/LFromToDateBox.js"></script>
<link rel="stylesheet" type="text/css" href="./../../../../plugins/ui/form/LFromToDateBox.css"/>

<script type="text/javascript" src="./../../../../plugins/ui/grid/LTotalSummary.js"></script>
<link rel="stylesheet" type="text/css" href="./../../../../plugins/ui/grid/LTotalSummary.css"/>

<script type="text/javascript" src="./../../../../plugins/ui/LGuideManager.js"></script>

<link rel="stylesheet" type="text/css" href="./orderMng.css"/>
<script type="text/javascript" src="./orderMng.js"></script>
</head>  

<body>
<%@ include file="./../../../../sample/pattern/bux/include/rui_menu.jsp"%>
<div class="newtitle-container"></div>
<div class="newtitle-line"><hr class="hr1"></hr></div>
<div class="newtitle-container-all"></div>
<div id="wrap">
    <!-- 컨텐츠 영역 -->
    <div class="ux-content-wrap">
        <div id="tabView1">
            <div title="주문정보" class="order-info">
                <div id="searchPanel1" class="ux-search-wrap">
                    <div class="searchBar">
                        <table class="searchBox" id="searchBox1">
                        <tr class="search-first">
                            <th><img src="./assets/ordermng/search.png"/></th>
                        </tr>
                        <tr>
                            <th class="search-first"><label for="search1">주문번호</label></th>
                            <td><input type="text" id="search1"></td>
                            <th><label for="search2">대리점</label></th>
                            <td><input type="text" id="search2"></td>
                            <th><label for="search3">모델명</label></th>
                            <td><input type="text" id="search3"></td>
                            <th><label for="search4">기간</label></th>
                            <td>
                                <div id="search4_1"></div> ~ 
                                <div id="search4_2"></div>
                            </td>
                            <td>
                                <div class="buttons">
                                    <button type="button" id="term2" data-term="1" data-datebox-id="4"><img src="./assets/ordermng/btn_today.png"/></button>
                                    <button type="button" id="term3" data-term="7" data-datebox-id="4"><img src="./assets/ordermng/btn_week.png"/></button>
                                    <button type="button" id="term4" data-term="31" data-datebox-id="4"><img src="./assets/ordermng/btn_month.png"/></button>
                                </div>
                            </td>
                            <td class="search-last">
                                <button type="button" id="searchBtn1" class="search-btn">조회</button>
                            </td>
                        </tr>
                        </table>
                        <a href="javascript:doExpandSearchBar('searchPanel1')" class="expandSearchBar">&nbsp;</a>
                    </div>
                </div>
                <div class="ux-title" > 
                    <h4 class="ux-grid-title">주문내역</h4>
                    <div class="grid1-title-buttons">
                        <a href="#" class="expandBtn grid1" > - </a>
                    </div>
                </div>
                <div class="ux-grid-wrap" id="layout-grid1">
                    <!-- 그리드 영역 --> 
                    <div id="grid1" class="ux-grid-table"></div>
                    <!-- //그리드 영역 --> 
                </div>
                <div class="ux-grid-title" style="width:20%"> 
                    <h4 class="ux-grid-title">주문항목</h4>
                </div>
                <div class="ux-grid-wrap">
                    <!-- 그리드 영역 --> 
                    <div id="grid2" class="ux-grid-table"></div>
                    <!-- //그리드 영역 --> 
                </div>
                <div id="tabView2">
                    <div title="주문처">
                        <table class="input-table" >
                        <tr>
                            <th><label for="field09">사진</label></th>
                            <td colspan="3"><input type="text" id="field09"></td>
                        </tr>
                        <tr>
                            <th><label for="field08">상호명</label></th>
                            <td colspan="3"><input type="text" id="field08"></td>
                        </tr>
                        <tr>
                            <th><label for="field10">대표전화</label></th>
                            <td><input type="text" id="field10"></td>
                            <th><label for="field11">대표팩스</label></th>
                            <td><input type="text" id="field11"></td>
                        </tr>
                        <tr>
                            <th><label for="field12">주소</label></th>
                            <td colspan="3"><input type="text" id="field12"></td>
                        </tr>
                        <tr>
                            <th><label for="field13">지역</label></th>
                            <td colspan="3"><input type="text" id="field13"></td>
                        </tr>
                        <tr>
                            <th><label for="field17">근무지역</label></th>
                            <td colspan="3"><input type="text" id="field17"></td>
                        </tr>
                        <tr>
                            <th><label for="field14">ID</label></th>
                            <td><input type="text" id="field14"></td>
                            <th><label for="field15">PASSWORD</label></th>
                            <td><input type="text" id="field15"></td>
                        </tr>
                        <tr>
                            <th><label for="field18">연락처1</label></th>
                            <td><input type="text" id="field18"></td>
                            <th><label for="field19">연락처2</label></th>
                            <td><input type="text" id="field19"></td>
                        </tr>
                        <tr>
                            <th><label for="field20">전자메일</label></th>
                            <td><input type="text" id="field20"></td>
                            <th><label for="field21">트위터</label></th>
                            <td><input type="text" id="field21"></td>
                        </tr>
                        <tr>
                            <th><label for="field22">페이스북</label></th>
                            <td><input type="text" id="field22"></td>
                            <th><label for="field23">미투데이</label></th>
                            <td><input type="text" id="field23"></td>
                        </tr>
                        <tr>
                            <th><label for="field25">직급</label></th>
                            <td><input type="text" id="field25"></td>
                            <th><label for="field26">부서</label></th>
                            <td><input type="text" id="field26"></td>
                        </tr>
                        </table>
                    </div>
                    <div title="재고">
                        <div id="grid5" class="ux-grid-table"></div>
                    </div>
                    <div title="배송">
                        <table class="input-table">
                        <tr>
                            <th><label for="field27">상호명</label></th>
                            <td ><input type="text" id="field27"></td>
                            <th><label for="field30">송장번호</label></th>
                            <td><input type="text" id="field30"></td>
                        </tr>
                        <tr>
                            <th><label for="field28">대표전화</label></th>
                            <td><input type="text" id="field28"></td>
                            <th><label for="field29">대표팩스</label></th>
                            <td><input type="text" id="field29"></td>
                        </tr>
                        <tr>
                            <th><label for="field31">배송현황</label></th>
                            <td colspan="3"><input type="text" id="field31"></td>
                        </tr>
                        </table>
                    </div>
                </div>
            </div>
            <div title="반품정보">
                <div id="searchPanel2" class="ux-search-wrap">
                    <div class="searchPanelWrap">
                        <div class="searchBar">
                            <table class="searchBox">
	                        <tr class="search-first">
	                            <th><img src="./assets/ordermng/search.png"/></th>
	                        </tr>
                            <tr>
                                <th class="search-first"><label for="search5">반품번호</label></th>
                                <td><input type="text" id="search5"></td>
                                <th><label for="search6">대리점</label></th>
                                <td><input type="text" id="search6"></td>
                                <th><label for="search7">모델명</label></th>
                                <td ><input type="text" id="search7"></td>
                                <th><label for="search8_1">기간</label></th>
	                            <td>
	                                <div id="search8_1"></div> ~ 
	                                <div id="search8_2"></div>
	                            </td>
                                <td >
                                    <div class="buttons">
                                        <button type="button" id="term6" data-term="1" data-datebox-id="8"><img src="./assets/ordermng/btn_today.png"/></button>
                                        <button type="button" id="term7" data-term="7" data-datebox-id="8"><img src="./assets/ordermng/btn_week.png"/></button>
                                        <button type="button" id="term8" data-term="31" data-datebox-id="8"><img src="./assets/ordermng/btn_month.png"/></button>
                                    </div>
                                </td>
	                            <td class="search-last">
	                                <button type="button" id="searchBtn2" class="search-btn">조회</button>
	                            </td>
                            </tr>
                            </table>
                            <a href="javascript:doExpandSearchBar('searchPanel2')" class="expandSearchBar">&nbsp;</a>
                        </div>
                    </div>
                </div>
                <div class="ux-grid-title" style="width:20%"> 
                    <h4 class="ux-grid-title">반품내역</h4>
                </div>
                <div class="ux-grid-wrap">
                    <!-- 그리드 영역 --> 
                    <div id="grid3" class="ux-grid-table"></div>
                    <!-- //그리드 영역 --> 
                </div>
                <div class="ux-grid-title" style="width:20%"> 
                    <h4 class="ux-grid-title">주문이력</h4>
                </div>
                <div class="ux-grid-wrap">
                    <!-- 그리드 영역 --> 
                    <div id="grid4" class="ux-grid-table"></div>
                    <!-- //그리드 영역 --> 
                </div>
                <div id="tabView3">
                    <div title="주문처">
                        <table class="input-table" >
                        <tr>
                            <th><label for="field109">사진</label></th>
                            <td colspan="3"><input type="text" id="field109"></td>
                        </tr>
                        <tr>
                            <th><label for="field108">상호명</label></th>
                            <td colspan="3"><input type="text" id="field108"></td>
                        </tr>
                        <tr>
                            <th><label for="field110">대표전화</label></th>
                            <td><input type="text" id="field110"></td>
                            <th><label for="field111">대표팩스</label></th>
                            <td><input type="text" id="field111"></td>
                        </tr>
                        <tr>
                            <th><label for="field112">주소</label></th>
                            <td colspan="3"><input type="text" id="field112"></td>
                        </tr>
                        <tr>
                            <th><label for="field113">지역</label></th>
                            <td colspan="3"><input type="text" id="field113"></td>
                        </tr>
                        <tr>
                            <th><label for="field117">근무지역</label></th>
                            <td colspan="3"><input type="text" id="field117"></td>
                        </tr>
                        <tr>
                            <th><label for="field114">ID</label></th>
                            <td><input type="text" id="field114"></td>
                            <th><label for="field115">PASSWORD</label></th>
                            <td><input type="text" id="field115"></td>
                        </tr>
                        <tr>
                            <th><label for="field118">연락처1</label></th>
                            <td><input type="text" id="field118"></td>
                            <th><label for="field119">연락처2</label></th>
                            <td><input type="text" id="field119"></td>
                        </tr>
                        <tr>
                            <th><label for="field120">전자메일</label></th>
                            <td><input type="text" id="field120"></td>
                            <th><label for="field121">트위터</label></th>
                            <td><input type="text" id="field121"></td>
                        </tr>
                        <tr>
                            <th><label for="field122">페이스북</label></th>
                            <td><input type="text" id="field122"></td>
                            <th><label for="field123">미투데이</label></th>
                            <td><input type="text" id="field123"></td>
                        </tr>
                        <tr>
                            <th><label for="field125">직급</label></th>
                            <td><input type="text" id="field125"></td>
                            <th><label for="field126">부서</label></th>
                            <td><input type="text" id="field126"></td>
                        </tr>
                        </table>
                    </div>
                    <div title="재고">
                        <div id="grid6" class="ux-grid-table"></div>
                    </div>
                    <div title="배송">
                        <table class="input-table">
                        <tr>
                            <th><label for="field127">상호명</label></th>
                            <td ><input type="text" id="field127"></td>
                            <th><label for="field130">송장번호</label></th>
                            <td><input type="text" id="field130"></td>
                        </tr>
                        <tr>
                            <th><label for="field128">대표전화</label></th>
                            <td><input type="text" id="field128"></td>
                            <th><label for="field129">대표팩스</label></th>
                            <td><input type="text" id="field129"></td>
                        </tr>
                        <tr>
                            <th><label for="field131">배송현황</label></th>
                            <td colspan="3"><input type="text" id="field131"></td>
                        </tr>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="L-tutorial">
    <div class="title">Tutorial</div>
    <ul>
        <li><a href="javascript:doTutorial('doLoadPage')" title="검색항목에 자동완성 기능을 탑재했습니다.">자동완성</a></li>
        <li><a href="javascript:doTutorial('doFocusCombo1')" title="취소가 가능한 알림기능을 탑재했습니다.">알림기능</a></li>
        <li><a href="javascript:doTutorial('doColumnmoveColumnModel1')" title="그리드에 정렬/필터 기능이 탑재되어 있는 툴바를 탑재했습니다.">툴바</a></li>
        <li><a href="javascript:doTutorial('doFocusGrid2')" title="그리드에 소계/합계 기능을 탑재했습니다.">소계합계</a></li>
        <li><a href="javascript:doTutorial('doNotification')" title="그리드에서 컬럼이동이 가능합니다.">컬럼이동</a></li>
        <li><a href="#" class="init-tutorial">초기화</a></li>
    </ul>
    </div>
    <div class="topicon-container"><a href="#menu_wrap" class="topicon"></a></div>
    <!-- // 컨텐츠 영역 -->
</div>
<%@ include file="./../../../../sample/pattern/bux/include/rui_footer.jspf"%>
</body>  
</html>