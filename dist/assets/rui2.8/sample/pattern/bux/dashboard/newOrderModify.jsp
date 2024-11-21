<%--
 * ============================================================================
 * @Project     : RUI
 * @Source      : newOrderModify.jsp
 * @Name        : rui 
 * @Description : dashboard New Order
 * @Version     : v1.0
 * 
 * Copyright ⓒ 2013 LG CNS All rights reserved
 * ============================================================================
 *  No       DATE              Author      Description
 * ============================================================================
 *  1.0      2013.05.24        rui         
 * ============================================================================
--%>
<%@ page language="java" pageEncoding="utf-8" contentType="text/html; charset=utf-8"%>
<!-- <%@ include file="./../../../../sample/pattern/bux/include/doctype.jspf" %> -->
<%
String domId = request.getParameter("domId");
String prodId = request.getParameter("prodId");
String orderQty = request.getParameter("orderQty");
String rowIndex = request.getParameter("rowIndex");

%>
<html>
<head><title>Phone Order Page</title>
    <script type="text/javascript" src="./../../../../plugins/ui/LNotification.js"></script>
    <script type="text/javascript" src="./../../../../plugins/ui/LNotificationManager.js"></script>
<style type="text/css">
.L-combo div.icon {
    height: 22px;
}

div.L-combo {
   padding: 4
}
.L-button  {
    display: -moz-inline-box;  
    display: inline-block;  
    border: 1px solid #ccc;
}

.L-button button,
.L-button a {
    font-weight: bold;
    font-size: 12px;
    height:20px;
    background-color: #f3f2f2
}
.L-grid-panel div.L-combo input {
    padding: 0px;
    margin:0px;
    border: 1px solid #ccc;
}

.ux-center {
    align:center
}
.ux-table-order {
    color: #C5003D;
    font-weight: bold;
    width:400px;
    border-bottom: 1px solid #ccc;
    border-spacing: 1px;
}
.ux-order-td-title {
    text-align:right;
    width:60px;
    color: red;
    background-color:#f5f5f5;
    border-bottom: 0px solid #fff;
}
.ux-order-td {
    text-align:left;
    width:150px 
}
.ux-order-td-wd {
    text-align:left;
    width:90px
}
.L-grid-row-expandable td {
    border-right: 0px solid #CCCCCC;
    border-bottom: 0px solid #ccc;
}
</style>

<script type="text/javascript" >
    Rui.onReady(function() {
        /*******************
         * 변수 및 객체 선언
         *******************/
         var txtProductId = new Rui.ui.form.LTextBox({
            applyTo:'productId_' + '<%=domId%>',
            width: 150          
         });

        var cmbOrderQty = new Rui.ui.form.LCombo({
             applyTo:'qty_' + '<%=domId%>',
             listWidth: 120,
             width: 80,
             defaultValue: 1
          });
        
        cmbOrderQty.on('changed', function(e){
            if( <%=rowIndex%> < 0) return;
            var rd = prodOrderDs.getAt(<%=rowIndex%>);
            var cnt =  cmbOrderQty.getDisplayValue();
            rd.set('orderQty', cnt);
            rd.set('orderPrice',cnt * rd.get('salePrice'));
        });

        // Combo 수량 
         var dataSet = cmbOrderQty.getDataSet();
         var qtyList = [];
         for(var i=1; i<500; i++){
             qtyList.push({text:  i.toString() ,
                       value: i.toString()});
         }
         dataSet.loadData({
            records:  qtyList
         });
         
         txtProductId.setValue('<%=prodId%>');
         cmbOrderQty.setValue('<%=orderQty%>');
        
         var btnCancel = new Rui.ui.LButton('btnCancel_' + '<%=domId%>');
         var btnOrder = new Rui.ui.LButton('btnOrder_' + '<%=domId%>');
         var seq = 0;
         
         btnCancel.on('click', function(e){
             var fn = function() {
                 Rui.ui.LNotificationManager.getInstance().show('구매수량 변경을 취소하였습니다.');
                 
                 if( <%=rowIndex%> < 0) return;
                 cmbOrderQty.setValue(1); 
             };
             fn();
         });
         
         btnOrder.on('click', function(e){
             var cnt = 0;
             var fn = function() {
                 Rui.ui.LNotificationManager.getInstance().show('구매수량을 변경하였습니다.<br>신규 주문정보를 확인해 주세요.');
                 Rui.getBody().unOn('mousedown', onMouseDown);
             };
             fn();
         });
        
    });
</script>
</head>
<body>
     <div class="LblockGrid" align="center">
         <table class="ux-table-order" >
             <tr><td class="ux-order-td-title">제품번호:</td><td class="ux-order-td" ><div id="productId_<%=domId%>"></div></td>
             <td class="ux-order-td-title">구매수량:</td><td class="ux-order-td-wd"><div id="qty_<%=domId%>"></div>      </td>
             <td ><button type="button" id="btnOrder_<%=domId%>">확인</button> <button type="button" id="btnCancel_<%=domId%>">취소</button></td>
             </tr>
         </table>
     </div>
</body>
</html>