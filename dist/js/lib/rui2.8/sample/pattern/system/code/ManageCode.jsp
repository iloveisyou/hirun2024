<%@ include file="./../common/include/doctype.jspf"%>
<html>
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
<head>
<%@ include file="./../common/include/head.jspf" %>
<%@ include file="./../common/include/rui.jspf" %>

<title></title>
<style type="text/css">
</style>

<script type="text/javascript">
	var codeGroup = '<%=request.getParameter("codeGroup")%>';
	var detailCodeGroupCombo, btnRetrieve, btnSave, btnCreate, btnDelete, dataSet
		, upperCodeGroupCombo, newCodeDataSet, queryCodeGroupCombo;
	var errorMsg;
	
	Rui.onReady(function() {
		/* 검색 영역 START */
		queryCodeGroupCombo = new Rui.ui.form.LCombo({
			id:'queryCodeGroup',
			applyTo:'queryCodeGroup',
			url: './../data/RetrieveGroupCodeListCombo.json'
		});
		if(codeGroup != 'null') {
			queryCodeGroupCombo.setValue(codeGroup);
		}
		/* 검색 영역 END */
		
    	/* Grid 영역 */
    	dataSet = new Rui.data.LJsonDataSet({
            id: 'dataSet',
            fields: [
				{ id:'devonindex', type: 'number' },
	            { id: 'codeGroup' },
	            { id: 'groupName' },
	            { id: 'codeId' },
	            { id: 'codeNameCode' },
	            { id: 'codeName' },
	            { id: 'codeEditFlag', defaultValue:'D'},
	            { id: 'codeSortCode', defaultValue:'' }, 
	            { id: 'codeDesc' },
	            { id: 'highLevelCode' }
        	]
        });
    	
		/* 컬럼들에 대한 속성 정의 */
		var columnModel = new Rui.ui.grid.LColumnModel({
            columns: [
				new Rui.ui.grid.LStateColumn(),
                new Rui.ui.grid.LNumberColumn(),
                { field: "codeGroup", label: "Code Group", align:'center', width: 150},
                { field: "groupName", label: "Group Name", align:'center', width: 150},
                { field: "codeId", label: "Code Id", align:'center', width: 150},
                { field: "codeNameCode", label: "Code Name Code", sortable: false, width: 150},
                { field: "codeName", label: "Code Name", width: 150, sortable: false, align: 'center'},
                { field: "codeEditFlag", label: "Update Delete", width: 150, sortable: false, align: 'center'},
                { field: "highLevelCode", label: "Hight Level Code", align:'center', width: 150, hidden:false},
                { field: "codeSortCode", label: "Order", width: 150, sortable: true, align: 'center', hidden:false},
                { field: "codeDesc", label: "Description", width: 100, sortable: false, align: 'center', hidden:true}
            ]
        });

		/* Grid의 외형적인 틀 설정 */
        var grid = new Rui.ui.grid.LGridPanel(
        {
            columnModel: columnModel,
            height: 300,
            dataSet: dataSet,
            autoWidth: true
        });

        grid.on("cellDblClick", function(e){
            if(e.col == 2) {
				document.location = "/rui2/sample/pattern/system/code/ManageGroupCode.jsp?codeGroup="
									+ dataSet.getAt(e.row).get("codeGroup");
            }
        });
        /* LGridPanel을 실제로 그리는 부분 */
        grid.render('LGridPanel');

        /* 해당 row가 선택되었을때의 evnet handler */
        dataSet.on('rowPosChanged', function(e){
            if(e.row < 0) return false;
			var codeEditFlag = dataSet.getAt(dataSet.getRow()).get("codeEditFlag");

            if(dataSet.getState(dataSet.getRow()) == 1) {
            	Rui.get("codeId").enable();
            	detailCodeGroupCombo.enable();
            } else {
            	Rui.get("codeId").disable();
            	detailCodeGroupCombo.disable();
            }
        	
            if (codeEditFlag == "D") {
            	btnDelete.enable();
            } else {
            	btnDelete.disable();
            }
        });
    	var validatorManager = new Rui.validate.LValidatorManager({
            validators:[
	            {id:'codeGroup', validExp:'Code Group:true'},
	            {id:'codeId', validExp:'Code Id:true'},
	            {id:'codeNameCode', validExp:'Code Name:true'},
	            {id:'codeName', validExp:'Code Message:true'}
            ]
        });
        /* Grid 영역 END*/
            	
    	/* Detail 영역 START */
		detailCodeGroupCombo = new Rui.ui.form.LCombo({
			id:'detailCodeGroup',
			applyTo:'detailCodeGroup',
			url: './../data/RetrieveGroupCodeListCombo.json'
		});

		newCodeDataSet = new Rui.data.LJsonDataSet({
			id:'newCodeDataSet',
	        fields:[
	            { id:'codeId' },
	            { id:'codeNameCode' },
	            { id:'codeSortCode' }
	        ]
		});

		var highLevelCode2DataSet = new Rui.data.LJsonDataSet({
            id:'highLevelCode2DataSet',
            fields:[
                {id:'code'},
                {id:'value'}
            ]
		});		
		/* code group이 변경 되었을때 code id, code name 을 가져오기위한 event handler */
		newCodeDataSet.on('load', function(e) {
			if ( newCodeDataSet.getAt(0).get("codeId") != null && "" != newCodeDataSet.getAt(0).get("codeId") ) { 
				dataSet.getAt(dataSet.getRow()).set("codeId", newCodeDataSet.getAt(0).get("codeId"));
				dataSet.getAt(dataSet.getRow()).set("codeNameCode", newCodeDataSet.getAt(0).get("codeNameCode"));
				dataSet.getAt(dataSet.getRow()).set("codeSortCode", newCodeDataSet.getAt(0).get("codeSortCode") + "");
			}
		});
		
		detailCodeGroupCombo.on("changed", function () {
			if (dataSet.getCount() > 0 && dataSet.getState(dataSet.getRow()) == 1 && detailCodeGroupCombo.getValue() != ''){
				newCodeDataSet.load({ 
					url: './../data/CheckCodeSort.json',
					params: {
						codeGroup : detailCodeGroupCombo.getValue()
					}
				});
			}
		});
		upperCodeGroupCombo = new Rui.ui.form.LCombo({
			id:'highCodeGroup',
			applyTo:'highCodeGroup',
			url: './../data/RetrieveGroupCodeListCombo.json'
		});
		var highLevelCode2Combo = new Rui.ui.form.LCombo({
			id:'highLevelCode2',
			applyTo:'highLevelCode2',
			dataSet:highLevelCode2DataSet
		});
		
		// upper code group combo가 변경된 경우 이벤트 
		// rowPosChange 에서 data를 가져옴
		upperCodeGroupCombo.on("changed", function () {
			highLevelCode2DataSet.load({ 
				url: './../data/RetrieveCodeListCombo.json', 
				method:"get",
				params : {
					codeGroup : upperCodeGroupCombo.getValue()
				},
				sync: true
			});
		});

		highLevelCode2DataSet.on('load', function(e) {
			if(dataSet.getCount() > 0)
			 highLevelCode2Combo.setValue(dataSet.getAt(dataSet.getRow()).get("highLevelCode"));
		});
		
		/*
		highLevelCode2Combo.on("changed", function () {
			singleCodeDataSet.load({ 
				url: './../data/RetrieveCode.json', 
				method:"get",
				params: {
					codeId : highLevelCode2Combo.getValue()
				},
				sync: true
			});
		});*/
    	/* Detail 영역 END */
    			
        
        /* 트렌젝션 영역*/
		var tm = new Rui.data.LDataSetManager();

    	tm.on('beforeUpdate', function(e) {
			if(validatorManager.validateDataSet(dataSet) == false) {
            	Rui.alert(gMm.get('$.base.msg052') + '\r\n' + validatorManager.getMessageList().join('\r\n') );
                return false;
            }
    	});
		
		tm.on('success', function(e) {
			errorMsg = '';
			Rui.alert(Rui.getMessageManager().get('$.base.msg100'));
		});
		
		/* groupId로 되어있는 영역안에 bind 시킴 */
        var bind = new Rui.data.LBind( 
        {
            groupId:'LblockDetail01',
            dataSet:dataSet,
            bindInfo: [
                {id:'codeGroup', ctrlId:'detailCodeGroup', value:'value'},
                {id:'groupName', ctrlId:'detailCodeGroup', value:'text'},
                {id:'codeId', ctrlId:'codeId', value:'value'},
                {id:'codeNameCode', ctrlId:'codeNameCode', value:'value'},
                {id:'codeName', ctrlId:'codeName', value:'value'},
                {id:'highLevelCode', ctrlId:'highLevelCode', value:'value'},
                {id:'codeEditFlag', ctrlId:'codeEditFlag', value:'value'},
                {id:'codeSortCode', ctrlId:'codeSortCode', value:'value'},
                {id:'codeDesc', ctrlId:'codeDesc', value:'value'}
            ]
        });

		/* 버튼 영역  */
		btnRetrieve = new Rui.ui.LButton('btnRetrieve');
        btnRetrieve.on('click', function(e) {
        	var params = Rui.util.LDom.getValues('.input input', 'LblockSearch');
        	params.dataSetId = dataSet.id;
       		dataSet.load({
           		url : './../data/RetrieveCodeList.json',
           		params : params
           	});
        });
		
		btnCreate = new Rui.ui.LButton('btnCreate');
        btnCreate.on('click', function(e) {
       		dataSet.newRecord();
       		detailCodeGroupCombo.setValue(queryCodeGroupCombo.getValue());
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
    			url: './../data/CudCode.json'
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
	<form id="formSearch" name="formSearchArea" method="post" action="">
		<table summary="검색조건을 입력하는 테이블">
		<tbody>
		<tr>
			<td class="label"><label for="queryCodeGroup">Code Group</label></td>
			<td class="input">
				<div id="queryCodeGroup"></div>
			</td>
			<td class="label"><label for="queryCodeId">Code ID</label></td>
			<td class="input">
				<input type="text" id="queryCodeId" name="queryCodeId"/>
			</td>
			<td class="label"><label for="queryCodeName">Code Name</label></td>
			<td class="input">
				<input type="text" id="queryCodeName" name="queryCodeName"/>
			</td>
			<td>
				<input id="btnRetrieve" class="btn" type="button" value="Search" />
			</td>
		</tr>
		</tbody>
		</table>
	</form>
	</div>
	</div>
  </div>
  <!--  Grid 영역 start -->
  <div id="LGridPanel" ></div>
  <br/>
  <!--  Grid 영역 end -->
  <form id="formDetail" id="formDetail" method="post">
	<div id="LblockDetail01" class="LblockDetail">
    <input type="hidden" name="localeList"/>
	  <table summary="메세지정보에 관한 테이블입니다.">
	    <tr>
	      <th><span class="essential">*</span>Code Group</th>
	      <td>
	        <div id="detailCodeGroup"></div>
	      </td>
	      <th><span class="essential">*</span>Code ID</th>
	      <td>
	        <input type="text" id="codeId" name="codeId" style="width:200px;" alt="Code ID:yes">
	      </td>
	    </tr>
	    <tr>
	      <th><span class="essential">*</span>Code Name Code</th>
	      <td><input type="text" id="codeNameCode" name="codeNameCode" style="width:200px;" alt="Code Name:yes:maxLength=50"></td>
	      <th>Update Delete</th>
	      <td>
	        <input type="radio" name="codeEditFlag" id="codeEditFlag1" value="E"/><label for="codeEditFlag1">Update</label>
	        <input type="radio" name="codeEditFlag" id="codeEditFlag2" value="D" /><label for="codeEditFlag2">Update/Delete</label>
	        <input type="radio" name="codeEditFlag" id="codeEditFlag3" value="N"/><label for="codeEditFlag3">Update/Delete X</label>
	      </td>
	    </tr>
	    <tr>
	      <th>Description</th>
	      <td colspan="3"><input type="text" name="codeDesc" id="codeDesc" style="width:90%;" alt="Description:no:maxByteLength=200"></td>
	    </tr>
	    <tr>
	      <th>Order</th>
	      <td>
	        <input type="text" name="codeSortCode" id="codeSortCode" alt="Order:yes:maxLength=3"><br>
	      </td>
	      <th>Upper Code Group</th>
	      <td>
	        <div id="highCodeGroup"></div>
	        <div id="highLevelCode2"></div>
	        <input type="text" name="highLevelCode" id="highLevelCode"><br>
	      </td>
	    </tr>
	    <tr>
    	  <th><span class="essential">*</span>Code Name</th>
	      <td colspan="3">
	        <input type="text" name="codeName" id="codeName" style="width:90%;" alt="Code Name:no:maxByteLength=200"/>
	      </td>
	    </tr>
	  </table>
	</div>
  </form>

<div id="LblockButton" class="LblockButton">
  <div>
    <input type="button" value="New" id="btnCreate"/>
    <input type="button" value="Save" id="btnSave"/>
    <input type="button" value="Delete" id="btnDelete" disabled/>
  </div>
</div>

</div>

<%@include file="./../common/include/tail.jspf"%>

</body>
</html>


