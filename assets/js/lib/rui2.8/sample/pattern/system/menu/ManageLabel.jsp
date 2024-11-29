<%@ include file="./../common/include/doctype.jspf"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%--
/**
 *------------------------------------------------------------------------------
 * PROJ : Package Based Framework
 * Copyright 2008 LG CNS All rights reserved
 *------------------------------------------------------------------------------
 */
--%>
<html>
<head>
<%@ include file="./../common/include/head.jspf" %>
<%@ include file="./../common/include/rui.jspf" %>

<title></title>

<style type="text/css">
#resultDialog .bd  { max-height: 20em; overflow-y: auto; }
</style>

<script type="text/javascript">
	var dataSet, btnRetrieve, btnCreate, btnDelete, btnSave, btnPrint;
	var errorMsg;
	
	Rui.onReady(function() {

		/* 검색 영역  */

		/* tab1  영역 */
        dataSet = new Rui.data.LJsonDataSet({
            id: 'dataSet',
            fields: [
	            { id: 'code' },
	            { id: 'message' }
        	]
        });

		var columnModel = new Rui.ui.grid.LColumnModel({
            columns: [
				new Rui.ui.grid.LStateColumn(),
                new Rui.ui.grid.LNumberColumn(),
                { field: "code", label: "Code", width:200, editor: new Rui.ui.form.LTextBox(), renderer: function(val, p, record){
                    p.editable = (record.state == Rui.data.LRecord.STATE_INSERT);
                    return val;
                } },
                { field: "message", label: "Message", width:400, editor: new Rui.ui.form.LTextBox() }
                ]
        });

        var grid = new Rui.ui.grid.LGridPanel(
        {
            columnModel: columnModel,
            height: 375,
            dataSet: dataSet,
            autoWidth: true
        });
        
        grid.render('LGridPanel');

		/* 유효성 검증 영역  */
        var validatorManager = new Rui.validate.LValidatorManager({
            validators:[
	            {id:'code', validExp:'Code:true'},
	            {id:'message', validExp:'Message:true'}
            ]
        });

		/* 트랜젝션 영역  */
		var tm = new Rui.data.LDataSetManager();

		tm.on('beforeUpdate', function(e) {
            if(validatorManager.validateDataSet(dataSet) == false) {
            	Rui.alert(Rui.getMessageManager().get('$.base.msg052') + '\r\n' + validatorManager.getMessageList().join('\r\n') );
                return false;
            }
		});
		
		tm.on('success', function(e) {
			errorMsg = '';
			Rui.alert(Rui.getMessageManager().get('$.base.msg100'));
		});
		
		/* 버튼 영역  */
        btnRetrieve = new Rui.ui.LButton('btnRetrieve');
        btnRetrieve.on('click', function(e) {
        	var params = Rui.util.LDom.getValues('.input input', 'LblockSearch');
        	params.dataSetId = dataSet.id;
       		dataSet.load({
           		url : './../data/RetrieveMessageList.json',
           		params : params
           	});
        });

        btnCreate = new Rui.ui.LButton('btnCreate');
        btnCreate.on('click', function(e) {
       		dataSet.newRecord();
        });

        btnDelete = new Rui.ui.LButton('btnDelete');
        btnDelete.on('click', function(e) {
            if(dataSet.getRow() < 0) return;
       		dataSet.removeAt(dataSet.getRow());
        });

        btnSave = new Rui.ui.LButton('btnSave');
        btnSave.on('click', function(e) {
            tm.updateDataSet({
    			dataSets:[dataSet],
    			url: './../data/CudMessage.json'
    		});
        });

		btnRetrieve.click();
	});
</script>
</head>

<body>
<div id="LblockMain" class="LblockMain">
  
  <!--AREA search-->
  <div id="LblockSearch" class="LblockSearch">
	<div>
	<div>
		<table summary="검색조건을 입력하는 테이블">
		<tbody>
		<tr>
			<td class="label"><label for="queryCode">Code</label></td>
			<td class="input">
				<input type="text" name="queryCode" size="20"/>
				<input type="hidden" name="queryCode1" value="pbf."/>
			</td>
			<td class="label"><label for="queryMessage">Message</label></td>
			<td class="input">
		        <input type="text" name="queryMessage" size="20"/>
			</td>
			<td>
				<input id="btnRetrieve" class="btn" type="button" value="Search" />
			</td>
		</tr>
		</tbody>
		</table>
	</div>
	</div>
  </div>
  <!-- END sbox -->

  <!--AREA [View]-->
  <div id="LGridPanel" ></div>
  <br/>
  
  <!--AREA -->
	<div id="LblockButton" class="LblockButton">
		<div>
<!--	        <input type="button" value="Batch Regist" id="btnUpload"/>-->
<!--	        <input type="button" value="Export" id="btnExport"/>-->
	        <input type="button" value="New" id="btnCreate"/>
	        <input type="button" value="Save" id="btnSave"/>
	        <input type="button" value="Delete" id="btnDelete" />
	    </div>
	</div>

</div>
<!-- **************************************************************************
    화면영역 종료
*************************************************************************** -->
<!-- END content -->
<%@include file="./../common/include/tail.jspf"%>

</body>
</html>
 