<%--
 * ============================================================================
 * @Project     : RUI Demo
 * @Source      : newOrder.jsp
 * @Name        : rui 
 * @Description : new Order
 * @Version     : v1.0
 * 
 * Copyright ⓒ 2013 LG CNS All rights reserved
 * ============================================================================
 *  No       DATE              Author      Description
 * ============================================================================
 *  1.0      2013.05.31        rui
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
<script type="text/javascript" src="./../../../../plugins/ui/form/LFromToDateBox.js"></script>
<link rel="stylesheet" type="text/css" href="./../../../../plugins/ui/form/LFromToDateBox.css"/>

<script type="text/javascript" src="./../../../../plugins/ui/LGuideManager.js"></script>

<script type='text/javascript' src='./../../../../plugins/ui/grid/LGridView.js'></script>
<script type="text/javascript" src="./../../../../plugins/ui/grid/LEditButtonColumn.js"></script>
<script type='text/javascript' src='./../../../../plugins/ui/grid/LExpandableView.js'></script>
<link rel="stylesheet" type="text/css" href="./../../../../plugins/ui/grid/LExpandableView.css"/>
<script type="text/javascript" src="./../../../../plugins/ui/grid/LTotalSummary.js"></script>
<link rel="stylesheet" type="text/css" href="./../../../../plugins/ui/grid/LTotalSummary.css" />

<script type="text/javascript">
function movePos(Name) 
{ 
    self.location.hash= Name;
} 
</script>
<script language="JavaScript1.2">
function mstart()
{
    scroller.start();
    setTimeout("mstop()", 800); //올라오는 글씨와 글씨의 거리를 조절합니다.
}
function mstop(){
    scroller.stop();
    setTimeout("mstart()", 1000); //올라와서 글씨가 멈추어져 있는 시간을 지정합니다.
}
setTimeout("mstart()", 100);
</script>

<link rel="stylesheet" type="text/css" href="./newOrder.css"/>
<script type="text/javascript" src="./newOrder.js"></script>

</head>
<body>
<%@ include file="./../../../../sample/pattern/bux/include/rui_menu.jsp"%>
<div class="newtitle-container"></div>
<div class="newtitle-line"><hr class="hr1"></hr></div>
<div class="newtitle-container-all"></div>
<div id="wrap">
    <!-- 컨텐츠 영역 -->
    <div class="ux-content-wrap">
            <div title="신규주문" class="order-info">
            <div class="search-action">
                <table border="0" class="input-table">
                <tr>
                    <td style="width:200px;"><input type="text" id="searchWord" name="searchWord"/></td>
                    <td>
                    <div class="button-search" onclick="searchProduct()" />
                    </td>
                </tr>
                </table>
            </div>
                <!-- New Order -->
                <table border="0" style="width:100%;" ><tr><td style="width:50%;">
                    <div class="ux-grid-title" style="width:20%"> 
                        <h4 class="ux-grid-title">제품조회</h4>
                    </div>
                    <div id="layout-grid0" class="ux-grid-wrap">
                        <!-- 그리드 영역 --> 
                        <div class="ux-grid-table">
                        <table border="0" class="input-table">
                            <tr><td>
                            <!-- 그리드 영역 --> 
                            <div>
                                <div id="grid1" style="width:100%;"></div>
                                </div>
                            <!-- 그리드 영역  -->
                            </td></tr>
                            <tr><td colspan="2" align="center">
                            <!-- <button type="button" id="addProduct" style="width:100%;">Add</button> -->
                             <div class="button-add" onclick="fnAddProduct()" />
                            </td></tr>
                        </table>
                    </div>
                </div>
                </td><td style="width:32px;"></td>
                <td>
               
               <div class="special-layout"> 
                <div class="ux-grid-wrap">
                <div class="ux-grid-title" style="width:20%;"> 
                    <h4 class="ux-grid-title">특판정보</h4>
                </div>
                <div id="layout-grid1" class="ux-grid-wrap" >
                    <div class="ux-grid-table-b">
                        <table class="marquee-table-container" border="0" >
                            <tr><td style="width:100%;">
                            <!--  <tr><td style="height:200px;width:100%;"> -->
                            <MARQUEE id="scroller" scrollAmount=10 direction=up height=180 style="LINE-HEIGHT: 20pt" width=100% onbounce="behavior" onMouseover="this.scrollAmount=0" onMouseout="this.scrollAmount=10"><nobr>
                            <font style='font-size:10pt;'>
                            <div id="eventList" class="event-list"></div>
                            </font>
                            </MARQUEE>
                            </td> 
                            </tr> 
                        </table>
                    </div>
                </div>
                </div>
               </div>
        
                </td></tr>
               </table>
                <!-- The End of Order -->
                <div class="ux-grid-title" style="width:20%"> 
                    <h4 class="ux-grid-title">주문항목</h4>
                </div>
                <div id="layout-grid2" class="ux-grid-wrap">
                    <!-- 그리드 영역 --> 
                    <div id="grid2" class="ux-grid-table"></div>
                    <div id="grid-row-proxy"></div>
                    <!-- 그리드 영역  --> 
                </div>
                <table border="0" class="ux-table">
                <tr><td>
                <div class="ux-basicinfo-wrap">
                    <div class="ux-grid-title" style="width:20%"> 
                        <h4 class="ux-grid-title">기본정보</h4>
                    </div>
                    <div class="ux-grid-wrap">
                        <div class="ux-grid-table">
                            <form id="userForm" name="userForm">
                           <table class="input-table-prodinfo">
                                <tr><th class="input-table-prodinfo-td input-table-td-bg"><label for="agency">대리점</label></th>
                                    <td colspan="3" class="input-table-prodinfo-td-left"><input type="text" id="agency" name="agency" class="input-wd100p"></td>
                                </tr>
                                <tr><th class="input-table-prodinfo-td input-table-td-bg"><label for="order">주문인</label></th>
                                    <td colspan="3" class="input-table-prodinfo-td-left"><input type="text" id="order" name="order" class="input-wd100p"></td>
                                </tr>
                                <tr><th class="input-table-prodinfo-td input-table-td-bg"><label for="balances">입금잔액</label></th>
                                    <td class="input-table-prodinfo-td-left"><input type="text" id="balances" name="balances" class="input-wd100"></td>
                                    <th class="input-table-prodinfo-td input-table-td-bg"><label for="credit">잔여여신</label></th>
                                    <td class="input-table-prodinfo-td-left"><input type="text" id="credit" name="credit" class="input-wd100"></td>
                                </tr>
                 
                            </table>
                              </div>
                            </form>
                    </div>
                </div> 
                </td><td>
                <div class="ux-delivery-wrap">
                    <div class="ux-grid-title" style="width:20%"> 
                        <h4 class="ux-grid-title">배송정보</h4>
                    </div>
                    <div class="ux-grid-wrap">
                       <div class="ux-grid-table">
                        <form id="deliveryForm" name="deliveryForm">
                            <table class="input-table-prodinfo">
                                <tr><th class="input-table-prodinfo-td input-table-td-bg"><label for="deliveryType">배송방법</label></th>
                                    <td colspan="3" style="padding-left: 8px">
                                        <input type="radio" id="delivery1" name="delivery"  value="1"/><label for="delivery1">택배</label>
                                        <input type="radio" id="delivery2" name="delivery" value="2"/><label for="delivery2">착불</label>
                                        <input type="radio" id="delivery3" name="delivery" value="3"/><label for="delivery3">우편</label>
                                        &nbsp;
                                        <button type="button" id="addr1">주소록1</button>
                                        <button type="button" id="addr2">주소록2</button>
                                        <button type="button" id="addrList">주소록</button>
                                    </td>
                                </tr>
                                <tr><th class="input-table-prodinfo-td input-table-td-bg"><label for="destination">수신처</label></th>
                                    <td colspan="3"  class="input-table-prodinfo-td" ><input type="text" id="destination" name="destination" class="input-wd100"></td>
                                </tr>
                                <tr><th class="input-table-prodinfo-td input-table-td-bg"><label for="zipcode">우편번호</label></th>
                                    <td colspan="3"  class="input-table-prodinfo-td-left" ><input type="text" id="zipcode" name="zipcode" class="input-wd100p"></td>
                                </tr>
                                <tr><th class="input-table-prodinfo-td input-table-td-bg"><label for="address">주소</label></th>
                                    <td colspan="3"  class="input-table-prodinfo-td" ><input type="text" id="address" name="address" class="input-wd100"></td>
                                </tr>
                                <tr><th class="input-table-prodinfo-td input-table-td-bg "><label for="phone1">연락처1</label></th>
                                    <td  class="input-table-prodinfo-td" ><input type="text" id="phone1" name="phone1" class="input-wd100"></td>
                                    <th class="input-table-prodinfo-td input-table-td-bg"><label for="phone2">연락처2</label></th>
                                    <td  class="input-table-prodinfo-td" ><input type="text" id="phone2" name="phone2" class="input-wd100"></td>
                                </tr>
                            </table>
                        </div>
                         </form>
                        <!-- //그리드 영역 --> 
                    </div>
                </div>
                </td></tr>
               </table>
                <!-- 제품정보 -->
                <!-- <div class="ux-product-wrap"> -->
                <div class="ux-grid-title" style="width:20%"> 
                    <h4 class="ux-grid-title">제품정보</h4>
                </div>
                <div class="ux-grid-wrap">
                    <div class="ux-grid-table">
                    <!-- product information -->
                    <table border="0" class="input-table-prodinfo_detail">
                        <tr>
                            <th class="input-table-prodinfo-td" style="width:200px;">제품 이미지</th>
                            <th class="input-table-prodinfo-td-center" colspan="2" id="productDetail">제품설명</th>
                        </tr>
                        <tr >
                            <td class="input-table-prodinfo-td-center" rowspan="5"><img id="phoneImage"/></td><th class="td-wd100p input-table-td-bg"><label for="companyName2">제조사</label></th><td class="input-table-prodinfo-td-left"><div id="companyName2"></div></td>
                        </tr>
                        <tr >
                           <th class="input-table-prodinfo-td input-table-td-bg"><label for="productName2">제품명</label></th><td class="input-table-prodinfo-td-left"><div id="productName2"></div></td>
                        </tr>
                        <tr >
                           <th class="input-table-prodinfo-td input-table-td-bg"><label for="category2">카테고리</label></th><td class="input-table-prodinfo-td-left"><div id="category2" ></div></td>
                        </tr>
                        <tr >
                           <th class="input-table-prodinfo-td input-table-td-bg"><label for="salePrice2">제품가격</label></th><td class="input-table-prodinfo-td-left"><div id="salePrice2"></div></td>
                        </tr>
                        <tr>
                           <th class="input-table-prodinfo-td input-table-td-bg"><label for="spec2">스펙</label></th><td class="input-table-prodinfo-td-left"><div id="spec2"></div></td>
                        </tr>
                        <tr>
                           <th id="customreview"><a name="customreview">제품 사용 후기</a></th><td colspan="2"></td>
                        </tr>
                        <tr>
                           <td colspan="3"><div id="review"></div></td>
                        </tr>
                    </table>
                    </div>
              <!--    </div>-->
                </div>
           <!--  </div> -->
        </div>
    </div>
    <!-- Tutorial -->
    <div class="L-tutorial">
    <div class="title">Tutorial</div>
    <ul>
        <li><a href="javascript:doTutorial('doLoadPage')" title="입력 자동완성기능을 적용했습니다.">입력자동완성</a></li>
        <li><a href="javascript:doTutorial('doDragNDrop')" title="드래그앤드롭 기능을 적용했습니다.">드래그앤 드롭</a></li>
        <li><a href="javascript:doTutorial('doModify')" title="그리드 인 그리드 기능을 적용했습니다.">그리드인 그리드</a></li>
        <li><a href="#" class="init-tutorial">초기화</a></li>
    </ul>
    </div>
    <div class="topicon-container"><a href="#menu_wrap" class="topicon"></a></div>
    <!-- The End of Tutorial -->
</div>
<!-- <%@ include file="./../../../../sample/pattern/bux/include/rui_footer.jspf"%> -->
</body>  
</html>