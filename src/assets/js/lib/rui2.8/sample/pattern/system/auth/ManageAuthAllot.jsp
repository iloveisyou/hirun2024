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
<script type="text/javascript" src="<c:url value="/rui2/plugins/tree/rui_tree.js"/>"></script>
<link rel="stylesheet" type="text/css" href="<c:url value="/rui2/plugins/tree/rui_tree.css"/>" />
<style type="text/css">
#LblockList01_table {
	min-width: 1020px;
}

#LblockList01_left {
	float: left;
	width: 20%;
	min-width: 200px;
}

#LblockList01_right {
	float: right;
	width: 78%;
	min-width: 800px;
}

</style>
<!-- J A V A   S C R I P T   D E C L A R A T I O N   -->
<script type="text/javascript">
	var authCodeCombo,queryPrntMenuIdCombo,btnRetrieve,btnSave,menuTreeDataSet,menuAuthDetail;
	var authColArray = new Array('retriYn','newYn','saveYn','delYn','prtYn','moveYn','uploadYn','downloadYn');
	var authColNameArray = new Array('Retrieve','New','Save','Delete','Print','Move','Upload','Download');
	var MENU_LEVEL_1ST = '1'; // 메뉴 대분류
	var MESSAGE_TABLE_HEAD = 'message_'; // 메세지 테이블 헤더값, dev.xml에서 읽어오다가 없으면 이것으로
	var errorMsg;
	
	Rui.onReady(function() {
		/* 검색 영역  */

		// authority group combo dataset
		authCodeCombo = new Rui.ui.form.LCombo({
			id: 'authCode',
			applyTo: 'authCode',
			selectedIndex: 0,
			isAddEmptyText: false,
			url: './../data/RetrieveAuthCodeList.json',
			params: {
				localeCode: gLocale
			}
		});
        
		// authority group combo on changed
		authCodeCombo.on("changed", function(e) {
			if(authCodeCombo.getValue() != "" && Rui.get("prntMenuId").getValue() != "")
				btnRetrieve.click();
		});

		// authority group combo dataset
		queryPrntMenuIdCombo = new Rui.ui.form.LCombo({
			id: 'queryPrntMenuId',
			applyTo: 'queryPrntMenuId',
			url: './../data/RetrieveMenuListCombo.json',
			displayField: 'value',
			valueField: 'code',
			params: {
				menuLvl: MENU_LEVEL_1ST,
				messageTableName: MESSAGE_TABLE_HEAD + gLocale
			}
		});

		// top Menu combo on changed
		queryPrntMenuIdCombo.on("changed", function(e) {
	    	Rui.get("prntMenuId").setValue(queryPrntMenuIdCombo.getValue());
		});
		
		// retrieve button
		btnRetrieve = new Rui.ui.LButton('btnRetrieve');
		// retrieve button on click
		btnRetrieve.on('click', function(e) {
	    	if(validatorManager01.validateGroup('LblockSearch') == false) {
            	Rui.alert(Rui.getMessageManager().get('$.base.msg052'));
                return false;
            }
	    	var params = Rui.util.LDom.getValues('.input input', 'LblockSearch');
	    	params.dataSetId = menuAuthDetail.id;
	    	menuAuthDetail.load({
	    		url: './../data/RetrieveAuthMenuDetailList.json',
	    		params : params
	    	});
	    });
		// search form validator
		var validatorManager01 = new Rui.validate.LValidatorManager({
            validators:[
				{id:'authCode', validExp:'Auth Group:true'},
	            {id:'prntMenuId', validExp:'Menu Id:true'}
            	]
        });
		/* 검색 영역 END  */
		
		/* 메뉴 트리 영역  */
		// menu tree dataset
	    menuTreeDataSet = new Rui.data.LJsonDataSet({
	        id: 'menuTreeDataSet'
	        , fields: [
	      	    { id: 'menuId', type: 'number' }
	      	    , { id: 'prntmenuId', type: 'number' }
	      	    , { id: 'menuCode', type : 'string' }
	      	    , { id: 'menuLvl', type : 'number' }
	      	  	, { id: 'menuName', type: 'string' }
	   	        , { id: 'menuSeq', type: 'number' }
	            ]
	    });

	    // menu tree view
	    var menuTreeView = new Rui.ui.tree.LTreeView(
	    {
	        dataSet: menuTreeDataSet,
            fields:{
		        rootValue: 0,
		        id:"menuId",
		        parentId: "prntmenuId",
		        label: "menuName",
		        order: "menuSeq"
	        },
	        width: 200,
	        height:435
	    });

	    menuTreeView.render('treeDiv1');

	 	// menu tree dataset bind
	    menuTreeDataSet.load({ url: './../data/RetrieveMenuList.json' });
	    
	 	// menu tree label on click
	    menuTreeView.on("labelClick", function(e) {
	    	var record = menuTreeView.dataSet.get(e.node.recordId);
	        var menuId = record.get("menuId");
	    	if(menuId) {
	    		queryPrntMenuIdCombo.setValue('');
	    		Rui.get('prntMenuId').setValue(menuId);
	    		if(validatorManager01.validateGroup('LblockSearch') == false) {
	            	Rui.alert(Rui.getMessageManager().get('$.base.msg052'));
	                return false;
	            }
		    	menuAuthDetail.load({
		    		url: '<c:url value="./../data/RetrieveAuthMenuDetailList.json" />',
		    		params : { authCode : authCodeCombo.getValue(),
		    				   prntMenuId : menuId,
							   dataSetId : menuAuthDetail.id  }
		    	});
	    	}
	    });
	    /* 메뉴 트리 영역 END  */
	    
	    /* 메뉴 권한 상세 영역  */
	    // menu authority detail dataset
		menuAuthDetail = new Rui.data.LJsonDataSet({
			id:'menuAuthDetail'
			,fields: [
	      	    { id: 'menuId', type: 'number' }
	      	    , { id: 'menuName2' }
	      	  	, { id: 'authCode' }
	      	    , { id: 'menuLvl', type : 'number' }
	      	  	, { id: 'useFlag' }
	      		, { id: 'prntMenuId', type: 'number' }
	      		, { id: 'menuName' }
	      	  	, { id: 'retriYn' }
	      	  	, { id: 'newYn' }
		      	, { id: 'saveYn' }
		      	, { id: 'delYn' }
		      	, { id: 'prtYn' }
		      	, { id: 'moveYn' }
		      	, { id: 'uploadYn' }
		      	, { id: 'downloadYn' }
	            ]
		});
		// checking on load event
	    var chkOnLoad = false;
	    // menu authority detail dataset on load
	    menuAuthDetail.on("load", function() {
	    	chkOnLoad = true;
	    	for(var inx=0;inx<menuAuthDetail.getCount();inx++) {
				if(menuAuthDetail.getAt(inx).get("useFlag") == "Y") {
					menuAuthDetail.setMark(inx,true);
				} else {
					menuAuthDetail.setMark(inx,false);
				}
			}
			chkOnLoad = false;
	    });
	 	// menu authority detail dataset on 'Row Select Mark' setting
	    menuAuthDetail.on("rowSelectMark", function(e) {
		    if(!chkOnLoad) {
		    	var rowIdx = e.row;
		    	var bSelect = e.isSelect;
		    	for(var inx=0; inx<authColArray.length; inx++) {
    				menuAuthDetail.getAt(rowIdx).set(authColArray[inx], bSelect ? "Y" : "N");
		    	}
		    }
	    });

	 	var columns = [
			new Rui.ui.grid.LStateColumn(),
			new Rui.ui.grid.LNumberColumn(),
            { field: "menuName2", label: "Menu Name", width:280, sortable:true, align:'left' },
            new Rui.ui.grid.LSelectionColumn()
		];

	 	for(var inx=0; inx<authColArray.length; inx++){
	 		columns.push({ field: authColArray[inx],
					label: authColNameArray[inx],
					width:70, sortable:false, align:'center',
					editor: new Rui.ui.form.LCheckBox({ label: '',bindValues : ['Y', 'N'] }) 
			});
	 	}
	    
		// menu authority detail column model
		var columnModel = new Rui.ui.grid.LColumnModel({
	        columns: columns
		});
		
		// menu authority detail grid
		var grid = new Rui.ui.grid.LGridPanel({
			columnModel: columnModel,
			width: 750,
			height: 435,
			dataSet:menuAuthDetail
		});
		// menu authority detail grid render
		grid.render('LDetailGridPanel');
		/* 메뉴 권한 상세 영역 END  */
		
		/* 버튼 영역  */
	 	// save ext code button
	    btnSave = new Rui.ui.LButton('btnSave');
	 	// save button on click
	    btnSave.on('click', function(e) {
	    	if( menuAuthDetail.getCount() < 1 ) {
	    		Rui.alert(Rui.getMessageManager().get('$.base.msg102'));
		    	return false;
	    	}
	    	for(var inx=0; inx<menuAuthDetail.getCount(); inx++) {
				if( menuAuthDetail.isMarked(inx) ) {
					menuAuthDetail.getAt(inx).set("useFlag","Y");
				} else {
					menuAuthDetail.getAt(inx).set("useFlag","N");
				}
			}
	    	var params = { dataSetId : menuAuthDetail.id };
	    	tm.updateDataSet({
				dataSets:[menuAuthDetail],
				url: './data/CudAuthMenu.json',
				params:params
			});
	    });
	    /* 버튼 영역 END  */

	    /* 트랜젝션 영역  */
		var tm = new Rui.data.LDataSetManager();
		tm.on('success', function(e) {
			errorMsg = '';
			Rui.alert(Rui.getMessageManager().get('$.base.msg100'));
		});
		/* 트랜젝션 영역 END  */
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
			<td class="label">
				<span class="essential">*</span><label for="authCode">Auth Group</label>
			</td>
			<td class="input"><div id="authCode"></div></td>
			<td class="label">
				<span class="essential">*</span><label for="prntMenuId">Menu Id</label>
			</td>
			<td class="input" style="width: 10%"><div id="queryPrntMenuId"></div></td>
			<td class="input"><input type="text" name="prntMenuId" id="prntMenuId"/></td>
			<td class="label"><label for="queryMenuName">Menu Name</label></td>
			<td class="input"><input type="text" id="queryMenuName" name="queryMenuName"/></td>
			<td><input id="btnRetrieve" class="btn" type="button" value="Search" /></td>
		</tr>
		</tbody>
	  </table>
	</div>
	</div>
  </div>
  <!-- END sbox -->
    
  <div id="LblockList01" class="LblockList">
  <div id="LblockList01_table">
	<%-- left Content Area Start --%>
	<div id="LblockList01_left">
		<div class="LblockPageSubtitle">
			<h2>Menu List</h2>
		</div>
		<div id="LblockTree01" class="LblockTree">
		    <div id="treeDiv1"></div>	
		</div>
	</div>
	<%-- left Content Area End --%>
	
	<%-- right Content Area Start --%>
	<div id="LblockList01_right">
		<div class="LblockPageSubtitle">
			<h2>Menu Authority List</h2>
		</div>
		<div id="LDetailGridPanel"></div>
		
		<!--  bottom Button Area Start -->
		<div id="LblockButton" class="LblockButton">
			<div>
				<input type="button" value="Save" id="btnSave" />
			</div>
		</div>
		<!--  bottom Button Area End -->
	</div>
	<%-- right Content Area End --%>
  </div> <!-- LblockList01_table -->
  </div> <!-- LblockList01 -->

</div>
<!-- **************************************************************************
    화면영역종료
*************************************************************************** -->
<%@include file="./../common/include/tail.jspf"%>

</body>
</html>
