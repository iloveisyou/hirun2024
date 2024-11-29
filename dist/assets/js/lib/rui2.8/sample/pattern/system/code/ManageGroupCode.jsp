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
</style>

<script type="text/javascript">
	var codeGroup = '<%=request.getParameter("codeGroup")%>';
	var btnRetrieve, btnCreate, btnDelete, btnSave, dataSet;
	var errorMsg;
		 
	Rui.onReady(function() {
		/* 검색 영역  */
		if(codeGroup != 'null') {
			Rui.get('queryGroupCode').setValue(codeGroup);
		}
		
		/* DataSet  영역 */
        dataSet = new Rui.data.LJsonDataSet({
            id: 'dataSet',
            fields: [
               {id:'codeGroup'},
               {id:'codeName2'},
               {id:'groupName'},
               {id:'codeSortCode'},
               {id:'codeDesc'}
        	]
        });

		var columnModel = new Rui.ui.grid.LColumnModel({
            columns: [
				new Rui.ui.grid.LStateColumn(),
                new Rui.ui.grid.LNumberColumn(),
                { field: "codeGroup", label: "Group Code", width:100, editor: new Rui.ui.form.LTextBox(), renderer: function(val, p, record){
                    p.editable = (record.state == Rui.data.LRecord.STATE_INSERT);
                    return val;
                } },
                { field: "codeName2", label: "Group Code Name", width:200, editor: new Rui.ui.form.LTextBox() },
                { field: "groupName", label: "Group Name", width:200, editor: new Rui.ui.form.LTextBox() },
                { field: "codeSortCode", label: "Order", width:50, editor: new Rui.ui.form.LTextBox() },
                { field: "codeDesc", label: "Description", width:300, editor: new Rui.ui.form.LTextBox() }
				]
        });

        var grid = new Rui.ui.grid.LGridPanel(
        {
            columnModel: columnModel,
            height: 300,
            dataSet: dataSet,
            autoWidth: true
        });
        
        grid.on("cellDblClick", function(e){
            if(e.col == 2) {
				document.location = "/rui2/sample/pattern/system/code/ManageCode.jsp?codeGroup="
									+ dataSet.getAt(e.row).get("codeGroup");
            }
        });
        grid.render('LGridPanel');

        var validatorManager = new Rui.validate.LValidatorManager({
            validators:[
   	            {id:'codeGroup', validExp:'Group Code:true'},
   	            {id:'codeName2', validExp:'Group Name Code:true'}
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
           		url : './../data/RetrieveGroupCodeList.json',
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
    			url: './../data/CudGroupCode.json'
    		});
        });

        btnRetrieve.click();
	});
</script>
</head>

<body >
<div id="LblockMain" class="LblockMain">
  <pbf:navigation/>
  
  <!--AREA search-->
  <div id="LblockSearch" class="LblockSearch">
	<div>
	<div>
		<table summary="검색조건을 입력하는 테이블">
		<tbody>
		<tr>
			<td class="label"></td>
			<td class="input">
			</td>
			<td class="label"><label for="queryGroupCode">Group Code</label></td>
			<td class="input">
				<input type="text" id="queryGroupCode" name="queryGroupCode"/>
			</td>
			<td class="label"><label for="queryGroupCodeName">Group Code Name</label></td>
			<td class="input">
				<input type="text" id="queryGroupCodeName" name="queryGroupCodeName"/>
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
