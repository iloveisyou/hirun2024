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
<script type="text/javascript" src="<c:url value="/rui2/plugins/tab/rui_tab.js"/>"></script>
<link rel="stylesheet" type="text/css" href="<c:url value="/rui2/plugins/tab/rui_tab.css"/>"></link>

<style type="text/css">
.LBlockGridLeft {
	float: left;
	width: 50%;
}
.LBlockGridCenter {
	float: left;
	margin-top: 10em;
	padding-left: 1em;
	position: relative;
	width: 2%;
}
.LBlockGridCenter .L-button {
	margin-bottom: 4px; 
}
.LBlockGridRight {
	float:right;
	width: 45%;
}

</style>

<title></title>

<script type="text/javascript">
	var tabView, userDataSet, authDataSet, sUserDataSet, sAuthDataSet, queryAuthCodeCombo;
	var btnRetrieve, btnRetrieve1, btnRetrieve2, btnLeftAll, btnLeftAll1, btnLeftAll2;
	var btnRightAll, btnRightAll1, btnRightAll2;
	var btnRight, btnRight1, btnRight2, btnSave;
	var btnLeft, btnLeft1, btnLeft2;
	var errorMsg;

	Rui.onReady(function() {
		tabView = new Rui.ui.tab.LTabView({
			height: 500,
			tabs: [{
				id: 'tab1',
				label: 'User Allocation'
			}, {
				id: 'tab2',
				label: 'Auth Allocation'
			}]
		});
		
		tabView.render('LTabview');

		tabView.on('activeTabChange', function(e) {
			var index = tabView.getActiveIndex();
        	if(index == 0) {
    			btnRetrieve = btnRetrieve1;
    			btnLeftAll = btnLeftAll1;
    			btnRightAll = btnRightAll1;
    			btnRight = btnRight1;
    			btnLeft = btnLeft1;
        	} else {
    			btnRetrieve = btnRetrieve2;
    			btnLeftAll = btnLeftAll2;
    			btnRightAll = btnRightAll2;
    			btnRight = btnRight2;
    			btnLeft = btnLeft2;
        	}
        	btnRetrieve.click();
		});

		/* tab1  영역 */
		
		/* 검색 영역 */
		/* 사용자 이름 userName(input text) change 이벤트 */
        Rui.get('userName').on('change', function(e) {
            if(Rui.get('userName').getValue() == '') return;
        	var sUrl = './../data/RetrieveUserId.json';
            var request = Rui.ajax({
            	url: sUrl, 
            	success: function(e) {
	    	        Rui.get('userId').setValue(e.responseText);
            	}, 
            	failure: function(e) {
            		Rui.alert(Rui.getMessageManager().get('$.base.msg101') + ' : ' + e.responseText);
            	}, 
            	params: {
            		userName: Rui.get('userName').getValue()
            	}
            });
        });
        /* 검색영역 END */
        
		/* 사용자목록 DataSet */
        userDataSet = new Rui.data.LJsonDataSet({
            id: 'userDataSet',
            fields: [
	            { id: 'userId' },
				{ id: 'password' },
				{ id: 'userName' },
				{ id: 'userFullName' },
				{ id: 'phoneNo' },
				{ id: 'email' },
				{ id: 'useFlag' },
				{ id: 'localeCode' },
				{ id: 'langCode' },
				{ id: 'langName' },
				{ id: 'countryCode' },
				{ id: 'countryName' },
				{ id: 'loginDate' },
				{ id: 'loginExpired' },
				{ id: 'passwordChgDate' },
				{ id: 'passwordExpired' },
				{ id: 'userTypeCode' },
				{ id: 'userTypeName' },
				{ id: 'mobilePhoneNo' },
				{ id: 'userNameEng' },
				{ id: 'divisionName' },
				{ id: 'division1Name' },
				{ id: 'authCode' }
        	]
        });

		var columnModel01 = new Rui.ui.grid.LColumnModel({
            columns: [
				new Rui.ui.grid.LStateColumn(),
                new Rui.ui.grid.LNumberColumn(),
                { field: "userId", label: "UserId", align:'left', width:100, sortable: true },
                { field: "userName", label: "UserName", align:'left', width:250, sortable: true }
                ]
        });

        var grid01 = new Rui.ui.grid.LGridPanel(
        {
            columnModel: columnModel01,
            width: 405,
            height: 340,
            dataSet:userDataSet
        });

        grid01.render('LGridPanel01');

		/* 선택한 사용자목록 DataSet */
        sUserDataSet = new Rui.data.LJsonDataSet({
            id: 'sUserDataSet',
            fields: [
	            { id: 'userId' },
				{ id: 'userName' },
				{ id: 'useFlag' },
				{ id: 'authCode' },
				{ id: 'countryCode' },
				{ id: 'countryName' }
        	]
        });

		var columnModel01_01 = new Rui.ui.grid.LColumnModel({
            columns: [
				new Rui.ui.grid.LStateColumn(),
                new Rui.ui.grid.LNumberColumn(),
                { field: "userId", label: "UserId", align:'left', width:100, sortable: true },
                { field: "userName", label: "UserName", align:'left', width:250, sortable: true}
                ]
        });
        var grid01_01 = new Rui.ui.grid.LGridPanel(
        {
            columnModel: columnModel01_01,
            width: 405,
            height: 300,
            dataSet: sUserDataSet
        });

        grid01_01.render('LGridPanel01_01');

        /* Combo - queryAuthDataSet */
		queryAuthCodeCombo = new Rui.ui.form.LCombo({
			id: 'queryAuthCode',
			applyTo: 'queryAuthCode',
			isAddEmptyText: false,
			url: './../data/RetrieveAuthCodeList.json',
			params : { 
				localeCode : gLocale 
			}
		});

		/* 권한 Combo change 이벤트 */
        queryAuthCodeCombo.on('changed', function(e) {
        	retrieveSData();
        });
        /* 권한 Combo validation */
		var validatorManager01 = new Rui.validate.LValidatorManager({
            validators:[
				{id:'queryAuthCode', validExp:'Auth Group:true'}
            	]
        });
        /* tab1 영역 END */

        /* tab2 영역 */
        
        /* 권한 DataSet */
        authDataSet = new Rui.data.LJsonDataSet({
            id: 'authDataSet',
            fields: [
	           	{ id: 'localeCode' },
				{ id: 'authCode' },
				{ id: 'authCode2' },
				{ id: 'authNm' },
				{ id: 'rmk' },
				{ id: 'userId' }
        	]
        });

        var columnModel02 = new Rui.ui.grid.LColumnModel({
            columns: [
      			new Rui.ui.grid.LStateColumn(),
                new Rui.ui.grid.LNumberColumn(),
                { field: "authCode", label: "Auth Code", align:'left', width:150, sortable: true},
                { field: "authNm", label: "Auth Name", align:'left', width:200, sortable: false}
                ]
        });

        var grid02 = new Rui.ui.grid.LGridPanel(
        {
            columnModel: columnModel02,
            width: 405,
            height: 340,
            dataSet:authDataSet
        });

        grid02.render('LGridPanel02');

        /* 사용자아이디 userId(input text) change 이벤트 */
        Rui.get('queryUserId').on('change', function(e) {
        	retrieveSData();
        });

     	/* 사용자 아이디 validation */
		var validatorManager02 = new Rui.validate.LValidatorManager({
            validators:[
				{id:'queryUserId', validExp:'User Id:true'}
            	]
        });

        /* 선택한 권한목록 DataSet */
        sAuthDataSet = new Rui.data.LJsonDataSet({
            id: 'sAuthDataSet',
            fields: [
	            { id: 'localeCode' },
				{ id: 'authCode' },
				{ id: 'authNm' },
				{ id: 'rmk' },
				{ id: 'userId' }
        	]
        });

		var columnModel02_01 = new Rui.ui.grid.LColumnModel({
            columns: [
				new Rui.ui.grid.LStateColumn(),
                new Rui.ui.grid.LNumberColumn(),
                { field: "authCode", label: "Auth Code", align:'left', width:150, sortable: true},
                { field: "authNm", label: "Auth Name", align:'left', width:200, sortable: false}
                ]
        });

        var grid02_01 = new Rui.ui.grid.LGridPanel(
        {
            columnModel: columnModel02_01,
            width: 405,
            height: 300,
            dataSet:sAuthDataSet
        });

        grid02_01.render('LGridPanel02_01');
        /* tab2영역 END */

		/* 트랜젝션 영역  */
		var tm = new Rui.data.LDataSetManager();

        tm.on('beforeUpdate', function(e) {
			// 각 탭 별로 validate
			if(validatorManager02.validateDataSet(getTabInfo().sDataSet) == false) {
            	Rui.alert(Rui.getMessageManager().get('$.base.msg052'));
                return false;
            }
        });
		
		tm.on('success', function(e) {
			errorMsg = '';
			Rui.alert(Rui.getMessageManager().get('$.base.msg100'));
		});
		
		/* 버튼 영역  */
		var onBtnRetrieve = function(e) {
			var tabIndex = getTabInfo().tabIndex;
			if(queryAuthCodeCombo.getValue() == '') queryAuthCodeCombo.setSelectedIndex(1);
        	var params = Rui.util.LDom.getValues('.input input', ((tabIndex == 1) ? 'formSearch2' : 'formSearch'));
        	var url =  (tabIndex == 1) ? './../data/RetrieveAuthList.json' : './../data/RetrieveUserList.json';
        	params.localeCode = gLocale;
        	params.javaLocaleCode = gLocale;
            params.tabIndex = tabIndex;
            params.dataSetId = getTabInfo().dataSet.id;
        	getTabInfo().dataSet.load({
           		url : url,
           		params : params
           	});
        	retrieveSData();	// 오른쪽(선택된 데이터) 그리드 조회
        };
        
        btnRetrieve1 = new Rui.ui.LButton('btnRetrieve1');
        btnRetrieve1.on('click', onBtnRetrieve);
        btnRetrieve = btnRetrieve1; 

        btnRetrieve2 = new Rui.ui.LButton('btnRetrieve2');
        btnRetrieve2.on('click', onBtnRetrieve);

		var onBtnRight = function(e) {
        	var dataSet = getTabInfo().dataSet;
        	var sDataSet = getTabInfo().sDataSet; 
        	var record = dataSet.getAt(dataSet.getRow());
        	var tabIndex = getTabInfo().tabIndex;
        	// 각 탭 별로 validate
			if(tabIndex == 1) {
				if(validatorManager02.validateGroup('LInnerSearch02') == false) {
	            	Rui.alert(Rui.getMessageManager().get('$.base.msg052'));
	                return false;
	            }
			} else {
				if(validatorManager01.validateGroup('LInnerSearch01') == false) {
	            	Rui.alert(Rui.getMessageManager().get('$.base.msg052'));
	                return false;
	            }
			}
        	var keyId = (tabIndex == 1) ? 'authCode' : 'userId';
            var keyValue = record.get(keyId);
        	// 선택된 사용자 목록에 이미 같은 Record가 존재하는지 체크
        	if(sDataSet.findRow(keyId, keyValue) < 0) {
                var newRecord = record.clone();
        		var row = sDataSet.add(newRecord);
        		sDataSet.setRow(row);
            	if(tabIndex == 1) {
            		newRecord.set('userId', Rui.get('queryUserId').getValue());
            	} else {
            		newRecord.set('authCode', queryAuthCodeCombo.getValue());
            	}
        	}
        };
        btnRight1 = new Rui.ui.LButton('btnRight1');
        btnRight1.on('click', onBtnRight);

        btnRight2 = new Rui.ui.LButton('btnRight2');
        btnRight2.on('click', onBtnRight);

		var onBtnRightAll = function(e) {
			var dataSet = getTabInfo().dataSet;
        	var sDataSet = getTabInfo().sDataSet;    
        	var tabIndex = getTabInfo().tabIndex;
        	var keyId = (tabIndex == 1) ? 'authCode' : 'userId';
        	// 각 탭 별로 validate
			if(validatorManager02.validateDataSet(sDataSet) == false) {
            	Rui.alert(Rui.getMessageManager().get('$.base.msg052'));
                return false;
            }
        	// 선택된 사용자 목록에 이미 같은 Record가 존재하는지 체크
         	var count = dataSet.getCount();
        	for(var idx=0; idx < count; idx++) {        		
            	if(sDataSet.findRow(keyId, dataSet.getAt(idx).get(keyId)) < 0) {
            		var newRecord = dataSet.getAt(idx).clone();
                	sDataSet.add(newRecord);
            		if(tabIndex == 1) {
                		newRecord.set('userId', Rui.get('queryUserId').getValue());
                	} else {
                		newRecord.set('authCode', queryAuthCodeCombo.getValue());
                	}
            	}
        	}
        };
        btnRightAll1 = new Rui.ui.LButton('btnRightAll1');
        btnRightAll1.on('click', onBtnRightAll); 

        btnRightAll2 = new Rui.ui.LButton('btnRightAll2');
        btnRightAll2.on('click', onBtnRightAll); 

        var onBtnLeft = function(e) {
        	var sDataSet = getTabInfo().sDataSet;
        	var row = sDataSet.getRow();
        	if(row >= 0) sDataSet.removeAt(row);
        };
        btnLeft1 = new Rui.ui.LButton('btnLeft1');
        btnLeft1.on('click', onBtnLeft);

        btnLeft2 = new Rui.ui.LButton('btnLeft2');
        btnLeft2.on('click', onBtnLeft);

		var onBtnLeftAll = function(e) {
			var sDataSet = getTabInfo().sDataSet;
        	sDataSet.removeAll();
        };
        btnLeftAll1 = new Rui.ui.LButton('btnLeftAll1');
        btnLeftAll1.on('click', onBtnLeftAll); 

        btnLeftAll2 = new Rui.ui.LButton('btnLeftAll2');
        btnLeftAll2.on('click', onBtnLeftAll); 

        btnSave = new Rui.ui.LButton('btnSave');
        btnSave.on('click', function(e) {
        	var tabIndex = getTabInfo().tabIndex;
        	var params = {
    			tabIndex : tabIndex,
    			localeCode: gLocale
    		};
			var url = '/pbf.system.auth.CudUserAuth.rui';
            tm.updateDataSet({
    			dataSets:[getTabInfo().sDataSet],
    			url:url,
    			params:params
    		});
        });
        /* 버튼영역 END */
        tabView.selectTab(0);
	});
	
	function getTabInfo() {	// 현재 활성화된 tab의 index 및 그에 따른 DataSet 설정.
		return {
			tabIndex : tabView.getActiveIndex(),
	    	dataSet : (tabView.getActiveIndex() == 1) ? authDataSet : userDataSet,
	        sDataSet : (tabView.getActiveIndex() == 1) ? sAuthDataSet : sUserDataSet
		};
	}
	
    function retrieveSData() {	// 오른쪽 그리드 조회(작업 대상 그리드- selected data)
    	var tabIndex = getTabInfo().tabIndex;
    	var params = Rui.util.LDom.getValues('.input input', ((tabIndex == 1) ? 'LInnerSearch02' : 'LInnerSearch01'));
    	var url =  (tabIndex == 1) ? './../data/SelectedAuthList.json' : './../data/SelectedUserList.json';
    	params.tabIndex = tabIndex;
    	params.localeCode = gLocale; 
    	params.dataSetId = getTabInfo().dataSet.id;
    	getTabInfo().sDataSet.load({
       		url : url, 
       		params : params
       	});
    }
	
</script>
</head>

<body>
<!-- ******************** PAGE BLOCK: CONTENT ******************** -->
<div id="LblockMain" class="LblockMain">
    <div id="LTabview">          
    	<div id="tab1" title="User Allocation">
		  <!--AREA search-->
		  <div id="LblockSearch" class="LblockSearch">
			<div>
			<div id="formSearch">
				<table summary="검색조건을 입력하는 테이블">
				<tbody>
				<tr>
					<td class="label"><label for="userName">User Name</label></td>
					<td class="input">
						<input type="text" id="userName" name="userName" />
						<input type="text" id="userId" name="userId" />
					</td>
					<td>
						<input id="btnRetrieve1" class="btn" type="button" value="Search" />
					</td>
				</tr>
				</tbody>
				</table>
			</div>
			</div>
		  </div>
		  <div id="LblockList01" class="LblockList">
		  <div id="LblockList01_table">
			<%-- left Content Area Start --%>
			<div class="LBlockGridLeft">
				<div class="LblockPageSubtitle">
					<h2>User List</h2>
				</div>
				<div id="LGridPanel01" ></div>
			</div>
			<%-- left Content Area End --%>
			<%-- center button Area Start --%>
			<div class="LBlockGridCenter">
				<ul>
					<li><input id="btnRight1" class="btn" type="button" value="▷" /></li>
					<li><input id="btnRightAll1" class="btn" type="button" value="▷▷" /></li>
					<li><input id="btnLeft1" class="btn" type="button" value="◀" /></li>
					<li><input id="btnLeftAll1" class="btn" type="button" value="◀◀" /></li>
				</ul>
			</div>
			<%-- center button Area End --%>
			<%-- right Content Area Start --%>
			<div class="LBlockGridRight">
				<div class="LblockPageSubtitle">
					<h2>Authority User List</h2>
				</div>
				<div id="LInnerSearch01">
				<table id="LblockDetail01" class="LblockDetail">
					<tbody>
						<tr>
						<th><span class="essential">*</span><label for="queryAuthCode">Auth Group</label></th>
						<td class="input"><div id ="queryAuthCode"></div></td>
						</tr>
					</tbody>
				</table>
				</div>
				<div id="LGridPanel01_01" ></div>
			</div>
		    <%-- right Content Area End --%>
		  </div> <!-- LblockList01_table -->
		  </div> <!-- LblockList01 -->
	    </div>	<!-- tab1 -->
        <div id="tab2" title="Auth Allocation">
		  <div id="LblockSearch" class="LblockSearch">
			<div>
			<div id="formSearch2">
				<table summary="검색조건을 입력하는 테이블">
				<tbody>
				<tr>
					<td class="label"><label for="authCode">Auth Code</label></td>
					<td class="input">
						<input type="text" id="authCode" name="authCode" />
					</td>
					<td>
						<input id="btnRetrieve2" class="btn" type="button" value="Search" />
					</td>
				</tr>
				</tbody>
				</table>
			</div>
			</div>
		  </div>
		  <div id="LblockList01" class="LblockList">
		  <div id="LblockList01_table">
			<%-- left Content Area Start --%>
			<div class="LBlockGridLeft">
				<div class="LblockPageSubtitle">
					<h2>Authority List</h2>
				</div>
				<div id="LGridPanel02"></div>
			</div>
			<%-- left Content Area End --%>
			<%-- center Button Area Start --%>
			<div class="LBlockGridCenter">
				<ul>
					<li><input id="btnRight2" class="btn" type="button" value="▷" /></li>
					<li><input id="btnRightAll2" class="btn" type="button" value="▷▷" /></li>
					<li><input id="btnLeft2" class="btn" type="button" value="◀" /></li>
					<li><input id="btnLeftAll2" class="btn" type="button" value="◀◀" /></li>
				</ul>
			</div>
			<%-- center Button Area End --%>
			<%-- right Content Area Start --%>
			<div class="LBlockGridRight">
				<div class="LblockPageSubtitle">
					<h2>User Authority List</h2>
				</div>
				<div id="LInnerSearch02">
				<table id="LblockDetail01" class="LblockDetail">
					<tbody>
						<tr>
						<th><span class="essential">*</span><label for="queryUserId">User Id</label></th>
						<td class="input">
							<input type="text" id="queryUserId" name="queryUserId" style="width:150px;" />
						</td>
						</tr>
					</tbody>
				</table>
				</div>
				<div id="LGridPanel02_01" ></div>
			</div>
			<%-- right Content Area End --%>
		  </div> <!-- LblockList01_table -->
		  </div> <!-- LblockList01 -->
    	</div>	<!-- tab2 -->
  	</div> <!-- LtabView -->
 	<br/>
<div id="LblockButton" class="LblockButton">
   <div>
		<input type="button" value="Save" id="btnSave"/>
   </div>
</div>
</div> <!-- LblockMain -->
<!-- **************************************************************************
    화면영역종료
*************************************************************************** -->
<%@include file="./../common/include/tail.jspf"%>

</Body>
</Html>
