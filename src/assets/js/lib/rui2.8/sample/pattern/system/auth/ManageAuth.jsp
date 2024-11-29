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

<script type="text/javascript">
	var dataSet,btnRetrieve,btnCreate,btnDelete,btnSave;
	Rui.onReady(function() {
 
		/* Grid 영역 */
		dataSet = new Rui.data.LJsonDataSet({
            id: 'dataSet',
            fields: [
	            { id: 'localeCode' },
	            { id: 'authCode2' },
	            { id: 'authNm' },
	            { id: 'rmk' },
	            { id: 'authCode' }
        	]
        });

		var columnModel = new Rui.ui.grid.LColumnModel({
            columns: [
				new Rui.ui.grid.LSelectionColumn(),
                new Rui.ui.grid.LNumberColumn({width:50}),
                { field: "localeCode", label: "Locale Code", width:150, align:'center', editor: new Rui.ui.form.LTextBox() },
                { field: "authCode2", label: "Auth Code", width:150, align:'center', editor: new Rui.ui.form.LTextBox(), renderer: function(val, p, record){
                    p.editable = (record.state == Rui.data.LRecord.STATE_INSERT);
                    return val;
                } },
                { field: "authNm", label: "Auth Name", width:150, align:'center',editor: new Rui.ui.form.LTextBox() },
                { field: "rmk", label: "Description",width:150, align:'center', editor: new Rui.ui.form.LTextBox() },
                { field: "authCode", label: "Real Code", width:150, align:'center', editable:false, editor: new Rui.ui.form.LTextBox() }
            ]
        });

		var grid = new Rui.ui.grid.LGridPanel({
            columnModel: columnModel,
            height: 300,
            autoWidth: true,
            dataSet:dataSet
        });
    	
		grid.render('LGridPanel');

		/* validation */
		var validatorManager = new Rui.validate.LValidatorManager({
            validators:[
	            {id:'authCode2', validExp:'Auth Code:true'},
	            {id:'authName', validExp:'Auth Name:true'}
            ]
        });

		/* 트랜젝션 영역 */
        
		var tm = new Rui.data.LDataSetManager();

		tm.on('beforeUpdate', function(e) {
			if(dataSet.isUpdate() == false) {
            	Rui.alert(Rui.getMessageManager().get('$.base.msg102'));
                return false;
			}
			
			if(validatorManager.validateDataSet(dataSet) == false) {
            	Rui.alert(Rui.getMessageManager().get('$.base.msg052') + '\r\n' + validatorManager.getMessageList().join('\r\n') );
                return false;
            }
		});

		tm.on('success', function(e) {
			Rui.alert(Rui.getMessageManager().get('$.base.msg100'));
			btnRetrieve.click();
		});
		
		dataSet.on('rowSelectMark', function(e){
			var isSelect = false;
			for (var inx = 0; inx < dataSet.getCount(); inx++) {
       			if (dataSet.isMarked(inx)) {
       				isSelect = true;
       				break;
           		}
            }
            if (isSelect)
				btnDelete.enable();
            else 
            	btnDelete.disable();
		});

        /* button 영역 */		
		btnRetrieve = new Rui.ui.LButton('btnRetrieve');
        btnRetrieve.on('click', function(e) {
        	var params = Rui.util.LDom.getValues('.input input', 'LblockSearch');
       		dataSet.load({
           		url : './../data/RetrieveAuthList.json',
           		params : params
           	});
        });
        
		btnCreate = new Rui.ui.LButton('btnCreate');
        btnCreate.on('click', function(e) {
       		dataSet.newRecord();
       		dataSet.getAt(dataSet.getRow()).set('localeCode', gLocale);
        });

		btnDelete = new Rui.ui.LButton('btnDelete');
        btnDelete.on('click', function(e) {
        	if(dataSet.getRow() < 0) return;
        	dataSet.removeMarkedRow();
            btnDelete.disable();
        });

        btnSave = new Rui.ui.LButton('btnSave');
        btnSave.on('click', function(e) {
            tm.updateDataSet({
    			dataSets:[dataSet],
    			url:'<c:url value="/system/auth/CudAuth.rui" />'
    		});
        });
        //Rui.get("localeCode").setValue(gLocale);
        btnDelete.disable();
        btnRetrieve.click();
	});
   
</script>
</head>

<body>
<!-- ******************** PAGE BLOCK: CONTENT ******************** -->
	<div id="LblockMain" class="LblockMain">

	<!--AREA search-->
	 	<div id="LblockSearch" class="LblockSearch">
		<div>
		<div>
			<table summary="검색조건을 입력하는 테이블">
				<tbody>
				<tr>
					<td class="label"><label for="localeCode">Locale Code</label></td>
					<td class="input">
						<input type="text" id="localeCode" name="localeCode" value="" readonly="readonly"/>
					</td>
					<td class="label"><label for="queryAuthCode">Auth Code</label></td>
					<td class="input">
						<input type="text" id="queryAuthCode" name="queryAuthCode" value=""/>
					</td>
					<td class="label"><label for="authNm">Auth Name</label></td>
					<td class="input">
						<input type="text" id="authNm" name="authNm" value="" />
					</td>
					<td><input id="btnRetrieve" class="btn" type="button" value="Search" /></td>
				</tr>
				</tbody>
			</table>
		</div>
		</div>
	 	</div>
	
	<!--AREA [GRID]-->
	<div id="LGridPanel" ></div>
	  	
	<div id="LblockButton" class="LblockButton">
		<div>
		   <input type="button" value="New"  id="btnCreate"/>
		   <input type="button" value="Save"  id="btnSave"/>
		   <input type="button" value="Delete"  id="btnDelete"/>
		</div>
	</div>	  	
</div>
<!-- **************************************************************************
    화면영역종료
*************************************************************************** -->
<%@include file="./../common/include/tail.jspf"%>

</Body>
</Html>
