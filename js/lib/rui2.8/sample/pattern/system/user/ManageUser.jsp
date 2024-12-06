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

<style type="text/css">
</style>

<script type="text/javascript">
	var btnRetrieve, btnSave, btnCreate, btnDelete, dataSet, localeCombo, userTypeCode, countryCode, languageCode;
	
	Rui.onReady(function() {
		/* Grid 영역 START */
		dataSet = new Rui.data.LJsonDataSet({
            id: 'dataSet',
            fields: [
	            { id: 'userId' },
	            { id: 'userName' },
	            { id: 'userFullName' },
	            { id: 'password' },
	            { id: 'userTypeCode' },
	            { id: 'useFlag' },
	            { id: 'countryCode' },
	            { id: 'languageCode' },
	            { id: 'email' },
	            { id: 'localeCode' },
	            { id: 'phoneNo' },
	            { id: 'faxNo' },
	            { id: 'mobilePhoneNo' },
	            { id: 'deptId' },
	            { id: 'addressLine1Info' }
        	]
        });

		/* 컬럼들에 대한 속성 정의 */
		var columnModel = new Rui.ui.grid.LColumnModel({
            columns: [
				new Rui.ui.grid.LStateColumn(),
            	new Rui.ui.grid.LNumberColumn(),
                { field: "userId", label: "User Id", align:'center', width: 150, editable: false, editor: new Rui.ui.form.LTextBox() },
                { field: "userName", label: "User Name", align:'center', width: 150, editable: false, editor: new Rui.ui.form.LTextBox() },
                { field: "userFullName", label: "User Full Name", align:'center', width: 150, editable: false, editor: new Rui.ui.form.LTextBox() },
                { field: "password", label: "Password", sortable: false, width: 150, editable: false, hidden:true, editor: new Rui.ui.form.LTextBox() },
                { field: "userTypeCode", label: "User Type Code", width: 130, sortable: false, align: 'center', editable: false, editor: new Rui.ui.form.LTextBox()},
                { field: "useFlag", label: "Use Flag", width: 70, sortable: false, align: 'center', editor: new Rui.ui.form.LCheckBox({
                    bindValues : ['Y', 'N']
                })},
                { field: "countryCode", label: "Country Code", width: 150, sortable: true, align: 'center', hidden:true, editable: false, editor: new Rui.ui.form.LTextBox() },
                { field: "languageCode", label: "Language Code", width: 150, sortable: true, align: 'center', hidden:false, editable: false, editor: new Rui.ui.form.LTextBox() },
                { field: "email", label: "Email", width: 150, sortable: true, align: 'center', hidden:false, editable: false, editor: new Rui.ui.form.LTextBox() },
                { field: "localeCode", label: "Locale Code", width: 150, sortable: true, align: 'center', hidden:false, editable: false, editor: new Rui.ui.form.LTextBox() },
                { field: "phoneNo", label: "Phone", width: 150, sortable: true, align: 'center', hidden:false, editable: false, editor: new Rui.ui.form.LTextBox() },
                { field: "faxNo", label: "Fax", width: 150, sortable: true, align: 'center', hidden:true, editable: false, editor: new Rui.ui.form.LTextBox() },
                { field: "deptId", label: "Dept Id", width: 150, sortable: true, align: 'center', hidden:true, editable: false, editor: new Rui.ui.form.LTextBox() },
                { field: "addressLine1Info", label: "Address", width: 100, sortable: false, align: 'center', hidden:true, editable: false, editor: new Rui.ui.form.LTextBox() }
            ]
        });

		var grid = new Rui.ui.grid.LGridPanel(
	    {
            columnModel: columnModel,
            height: 300,
            dataSet: dataSet,
            autoWidth: true
		});

		grid.render('LGridPanel');

		var validatorManager = new Rui.validate.LValidatorManager({
            validators:[
	            {id:'userId', validExp:'User Id:true'},
	            {id:'userName', validExp:'User Name:true'},
	            {id:'userFullName', validExp:'User Full Name:true'},
	            {id:'password', validExp:'Password:true'},
	            {id:'languageCode', validExp:'Language Code:true'}
            ]
        });
        /* Grid 영역 END */
        
		/* 트랜젝션 영역 */
        var tm = new Rui.data.LDataSetManager();

        tm.on('beforeUpdate', function(e) {
			if(validatorManager.validateDataSet(dataSet) == false) {
            	Rui.alert(Rui.getMessageManager().get('$.base.msg052') + '\r\n' + validatorManager.getMessageList().join('\r\n') );
                return;
            }
        });

		tm.on('success', function(e) {
			Rui.alert(Rui.getMessageManager().get('$.base.msg100'));
		});


		/* Button 영역 */
        btnRetrieve = new Rui.ui.LButton('btnRetrieve');
		btnRetrieve.on('click', function(e) {
        	var params = Rui.util.LDom.getValues('.input input', 'LblockSearch');
       		dataSet.load({
           		url : './../data/RetrieveUserList.json',
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
    			url: './../data/CudUser.json'
    		});
        });
        
		btnRetrieve.click();

        /* Combo - localeCodeDataSet */
		localeCodeCombo = new Rui.ui.form.LCombo({
			id: 'localeCode',
			applyTo: 'localeCode',
			isAddEmptyText: false,
			valueField: 'localeCode',
			displayField: 'localeName',
			url: './../data/RetrieveLocaleList.json',
			params : { 
				codeGroup : 'CNLG000000'
			}
		});

        /* Combo - userTypeCodeDataSet */
		userTypeCodeCombo = new Rui.ui.form.LCombo({
			id: 'userTypeCode',
			applyTo: 'userTypeCode',
			isAddEmptyText: false,
			valueField: 'userTypeCode',
			displayField: 'userTypeName',
			url: './../data/RetrieveUserTypeList.json',
			params : { 
				codeGroup : 'USRT000000'
			}
		});

        /* Combo - countryCodeDataSet */
		countryCodeCombo = new Rui.ui.form.LCombo({
			id: 'countryCode',
			applyTo: 'countryCode',
			isAddEmptyText: false,
			valueField: 'countryCode',
			displayField: 'countryName',
			url: './../data/RetrieveLocaleList.json',
			params : { 
				codeGroup : 'CNTR000000'
			}
		});

        /* Combo - langCodeDataSet */
		langCodeCombo = new Rui.ui.form.LCombo({
			id: 'langCode',
			applyTo: 'langCode',
			isAddEmptyText: false,
			valueField: 'languageCode',
			displayField: 'languageName',
			url: './../data/RetrieveLocaleList.json',
			params : { 
				codeGroup : 'LANG000000'
			}
		});
		
		/* groupId로 되어있는 영역안에 bind 시킴 */
        var bind = new Rui.data.LBind( 
        {
            groupId:'LblockDetail01',
            dataSet:dataSet,
            bindInfo: [
                {id:'userId', ctrlId:'userId', value:'value'},
                {id:'userName', ctrlId:'userName', value:'value'},
                {id:'userFullName', ctrlId:'userFullName', value:'value'},
                {id:'password', ctrlId:'password', value:'value'},
                {id:'userTypeCode', ctrlId:'userTypeCode', value:'value'},
                {id:'useFlag', ctrlId:'useFlag', value:'value'},
                {id:'countryCode', ctrlId:'countryCode', value:'value'},
                {id:'languageCode', ctrlId:'langCode', value:'value'},
                {id:'email', ctrlId:'email', value:'value'},
                {id:'localeCode', ctrlId:'localeCode', value:'value'},
                {id:'phoneNo', ctrlId:'phoneNo', value:'value'},
                {id:'faxNo', ctrlId:'faxNo', value:'value'},
                {id:'addressLine1Info', ctrlId:'address', value:'value'},
                {id:'deptId', ctrlId:'deptId', value:'value'}
            ]
        });
              
	});
	/* Detail 영역 END */
</script>
</head>
<body>
<!-- ******************** PAGE BLOCK: CONTENT ******************** -->
<div id="LblockMain" class="LblockMain">
  
  <div id="LblockSearch" class="LblockSearch">
	<div>
	<div>
    <input type="hidden" name="detailUserId"/>
    <input type="hidden" name="editMode"/>
		<table summary="검색조건을 입력하는 테이블">
		<tbody>
		<tr>
			<td class="label"><label for="queryUserId">User ID</label></td>
			<td class="input">
          		<input type="text" id="queryUserId" name="queryUserId" value=""/>
			</td>
			<td class="label"><label for="queryUserName">User Name</label></td>
			<td class="input">
          		<input type="text" id="queryUserName" name="queryUserName" value=""/>
			</td>
			<td>
				<input class="btn" type="button" id="btnRetrieve" value="Search"/>
			</td>
		</tr>
		</tbody>
		</table>
	</div>
	</div>
  </div>
  
  <div id="LGridPanel" ></div>
  <br/>
  
  <form id="formDetail" method="post">
	<div id="LblockDetail01" class="LblockDetail">
	  <table summary="사용자정보에 관한 테이블입니다.">
		<caption>User Info.</caption>
		<tbody>
			<tr>
				<th class="LtextRight"><label for="userId"><span class="essential">*</span>User ID</label></th>
				<td>
					<input type="text" id="userId" name="userId" value="" alt="UserID:yes"/>
				</td>
				<th class="LtextRight"><label for="userName"><span class="essential">*</span>User Name</label></th>
				<td>
					<input type="text" id="userName" name="userName" value="" alt="User Name:yes"/>
				</td>
			</tr>
			<tr>
				<th class="LtextRight"><label for="userFullName"><span class="essential">*</span>User Full Name</label></th>
				<td>
					<input type="text" id="userFullName" name="userFullName" value="" alt="User Full Name:yes:maxByteLength=200"/>
				</td>
				<th class="LtextRight"><label for="password"><span class="essential">*</span>Password</label></th>
				<td>
					<input type="password" id="password" name="password" value="" alt="Password:yes:maxByteLength=100"/>
				</td>
			</tr>
			<tr>
				<th class="LtextRight"><label for="userTypeCode">User Type</label></th>
				<td>
					<div id="userTypeCode"></div>
				</td>
				<th class="LtextRight"><label for="useFlag">Use Flag</label></th>
				<td>
		            <input type="radio" name="useFlag" id="useFlag1" value="Y"/>Use
		            <input type="radio" name="useFlag" id="useFlag2" value="N"/>Not Use
				</td>
			</tr>
			<tr>
				<th class="LtextRight"><label for="countryCode">Country</label></th>
				<td>
					<div id="countryCode"></div>
				</td>
				<th class="LtextRight"><label for="langCode"><span class="essential">*</span>Language</label></th>
				<td>
					<div id="langCode"></div>
				</td>
			</tr>
			<tr>
				<th class="LtextRight"><label for="email"><span class="essential">*</span>e-mail</label></th>
				<td>
					<input type="text" id="email" name="email" value="" style="width=200px" alt="e-mail:yes:maxbyte=160&email"/>
				</td>
				<th class="LtextRight"><label for="localeCode">Locale</label></th>
				<td>
					<div id="localeCode"></div>
				</td>
			</tr>
			<tr>
				<th class="LtextRight"><label for="phoneNo">Phone</label></th>
				<td>
					<input type="text" id="phoneNo" name="phoneNo" value="" alt="Mobile Phone:no:maxbyte=40&hphone"/>
				</td>
				<th class="LtextRight"><label for="faxNo">Fax</label></th>
				<td>
					<input type="text" id="faxNo" name="faxNo" value="" alt="Fax:no:maxbyte=40&phone"/>
				</td>
			</tr>
			<tr>
				<th class="LtextRight"><label for="address">Address</label></th>
				<td>
					<input type="text" id="address" name="address" value="" style="width=400px" alt="Address:no:maxLength=200"/>
				</td>
				<th class="LtextRight"><label for="address">Dept Id</label></th>
				<td>
					<input type="text" id="deptId" name="deptId" value=""/>
				</td>
			</tr>
		</tbody>
	</table>
	</div>
	</form>

<!--  bottom Button Area Start -->
<div id="LblockButton" class="LblockButton">
	<div>
		<input type="button" value="New" id="btnCreate"/>
		<input type="button" value="Save" id="btnSave"/>
		<input type="button" value="Delete" id="btnDelete"/>
	</div>
</div>
<!--  bottom Button Area End -->

</div>
<!-- **************************************************************************
    화면영역종료
*************************************************************************** -->
<%@include file="./../common/include/tail.jspf"%>

</body>
</html>
