<%@ include file="./../common/include/doctype.jspf"%>
<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<html>
<head>
<%@ include file="./../common/include/head.jspf" %>
<%@ include file="./../common/include/rui.jspf" %>
<script type="text/javascript" src="<c:url value="/rui2/plugins/menu/rui_menu.js"/>"></script>
<script type="text/javascript" src="<c:url value="/rui2/plugins/tree/rui_tree.js"/>"></script>
<link rel="stylesheet" type="text/css" href="<c:url value="/rui2/plugins/tree/rui_tree.css"/>" />
<title>Menu Management</title>
<style type="text/css">
#LblockList01_left {
	float: left;
	width: 25%;
}
#LblockList01_right {
	float: right;
	width: 73%;
}

.LblockMain {
	margin-top: 10px;
}
</style>
<script type="text/javascript">

var dataSet, dsNewMenu, tree, btnSave, oContextMenu, btnRetrieve, btnCreate, btnDelete;

Rui.onReady(function() {
	/*****************  validator  ********************/
    var validatorManager01 = new Rui.validate.LValidatorManager({
        validators:[        
   	    { id: 'menuCode', validExp : 'Menu Code:true:maxLength=10'}
   	    , { id: 'menuLvl', validExp : 'Menu Level:true:maxLength=2'}
   	  	, { id: 'menuName', validExp: 'Menu Name:true:maxLength=60'}
   	  	, { id: 'menuDesc', validExp: 'Menu Description:false:maxLength=200'}
   	  	, { id: 'menuAppl', validExp: 'Menu URL:false:maxLength=150'}      	  
        , { id: 'menuSeq', validExp: 'Menu Order:true:maxLength=2&number'}
     	, { id: 'menuHelpFilePath', validExp: 'Menu Help Path:maxLength=400'}   	    
   	  	, { id: 'menuNameCode', validExp: 'Menu Name Code:true:maxLength=60'}
   	  	, { id: 'managerId', validExp: 'Manager Id:true:maxLength=60'}
        ]
    });
    
	/********************  DataSet  *******************/
	dataSet = new Rui.data.LJsonDataSet({
        id: 'dataSet'
        , fields: [			
      	    { id: 'menuId', type: 'number' }
      	  	, { id: 'prntMenuId', type: 'number' }
      	    , { id: 'menuCode' }
      	    , { id: 'menuLvl', type : 'number' }
      	  	, { id: 'menuName' }
      	  	, { id: 'menuDesc' }
      	  	, { id: 'menuAppl' }      	  
   	        , { id: 'menuSeq', type: 'number' }
   	     	, { id: 'maxMenuSeq', type: 'number' }
   	     	, { id: 'menuHelpFilePath' }
   	  		, { id: 'useFlag' }
	     	, { id: 'displayFlag' }   	        
	     	, { id: 'menuNameCode' }   	        
	     	, { id: 'managerId' }   	        
            ]
    });     

    dataSet.on("canRowPosChange",function(e){
        if(dataSet.getRow() < 0) return true;
    	if(validatorManager01.validateDataSet(dataSet) == false) {
        	alert(Rui.getMessageManager().get('$.base.msg052') + '\r\n' + validatorManager01.getMessageList().join('\r\n') );
        	return false;            
        }
    });   

	dsNewMenu = new Rui.data.LJsonDataSet({
        id: 'dsNewMenu'
        , fields: [			
 			{ id: 'menuCode' }
            , { id: 'menuId', type : 'number' }
            , { id: 'prntmenuId', type: 'number'}
            , { id: 'menuLvl', type : 'number'}
 			, { id: 'menuName' }
 			, { id: 'menuSeq', type: 'number'}
 			, { id: 'useFlag' }
            ]
    });		

    /********************** Context Menu *******************/
    oContextMenu = new Rui.ui.menu.LContextMenu("mytreecontextmenu", {
        trigger: "treeDiv1",
        lazyload: true,
        itemdata: [
            { text: "Add Sub Menu", onclick: { fn: addSubMenu} },            
            { text: "Add Top Menu", onclick: { fn: addTopMenu} },
            { text: "Delete Menu", onclick: { fn: deleteMenu} }
        ]
    });

    /*********************  tree  ***********************/
	tree = new Rui.ui.tree.LTreeView({
        dataSet:dataSet,
        fields:{
	        rootValue: 0,
	        id:"menuId",
	        parentId: "prntmenuId",
	        label: "menuName",
	        order: "menuSeq"
	        },
	    width: 200,
        height: 435,
        contextMenu : oContextMenu
    });

    tree.render('treeDiv1');

    /*********************  bind  **********************/
    var bind01 = new Rui.data.LBind( 
    {
        groupId:'LblockDetail01',
        dataSet:dataSet,
        bindInfo: [			
			{ id: 'menuCode', ctrlId : 'menuCode', value: 'value' }
			, { id: 'menuLvl', ctrlId : 'menuLvl', value: 'value' }
			, { id: 'menuName', ctrlId: 'menuName', value: 'value' }
			, { id: 'menuDesc', ctrlId: 'menuDesc', value: 'value' }
			, { id: 'menuAppl', ctrlId: 'menuAppl', value: 'value' }      	  
			, { id: 'menuSeq', ctrlId: 'menuSeq', value: 'value' }
			, { id: 'menuHelpFilePath', ctrlId: 'menuHelpFilePath', value: 'value' }
			, { id: 'useFlag', ctrlId: 'useFlag', value: 'value' }
			, { id: 'displayFlag', ctrlId: 'displayFlag', value: 'value' }   	
			, { id: 'menuNameCode', ctrlId: 'menuNameCode', value: 'value' }
			, { id: 'managerId', ctrlId: 'managerId', value: 'value' }
        ]
    });
    
    dataSet.load({ url: './../data/RetrieveMenuList.json' });

	/********************* Transaction Manager  **************/
	var tm = new Rui.data.LDataSetManager();
	tm.on('success', function(e) {
		if(Rui.trim(e.responseText) == "") {
			Rui.alert(Rui.getMessageManager().get('$.base.msg100'));
		}
		else{
			Rui.alert(e.responseText);
		}
		//새로고침
		dataSet.load({ url: './../data/RetrieveMenuList.json' });
	});	

	/********************  Button  ***************************/
    btnRetrieve = new Rui.ui.LButton('btnRetrieve');
    btnRetrieve.on('click', function(e) {
    	var params = {dataSetId:dataSet.id};
   		dataSet.load({
       		url : './../data/RetrieveMenuList.json',
       		params : params
       	});
    });

    btnSave = new Rui.ui.LButton('btnSave');
    btnSave.on('click', function(e) {        
        tm.updateDataSet({
			dataSets:[dataSet],
			url:'./../data/CudMenu.json'
		});
    });

    btnCreate = new Rui.ui.LButton('btnCreate');
    btnCreate.on('click', function(e) {
    	addSubMenu();
    });
   	
    btnDelete = new Rui.ui.LButton('btnDelete');
    btnDelete.on('click', function(e) {
    	deleteMenu();
    });
});

/*****************  Custom Function ***********************/

/* custom function */
	//신규 메뉴에 대한 기본정보 가져오기
function setNewMenu(prntMenuId, record){
	var params = {dataSetId:dsNewMenu.id, menuId:prntMenuId};
	dsNewMenu.load({ url: './../data/CreateMenuCode.json', sync:true,
   		params : params });
	
	if(dsNewMenu.getCount() > 0) {
		var r = dsNewMenu.getAt(0);    		
		record.set("menuCode",r.get("menuCode")||"");
		record.set("menuNameCode",(r.get("menuName") + r.get("menuCode"))||"");
		record.set("menuName",(r.get("menuCode")||"") + "_NewMenu");
		record.set("menuLvl",r.get("menuLvl"));    		
		record.set("prntMenuId",prntMenuId);
		record.set("menuSeq",r.get("maxMenuSeq")||"");
		record.set("useFlag",r.get("useFlag"));
		record.set("displayFlag","Y");		        
	}    	   	
}

//최상위 메뉴 추가  menuLvl 1, prntMenuId 0으로 설정, addTopMenu context 메뉴 추가
function addTopMenu() {
    var record = dataSet.getAt(dataSet.newRecord());
    var parentId = 0;
    var menuLvl = 1;
    setNewMenu(parentId,record);
    record.set("menuLvl",menuLvl);
}

function addSubMenu() {    
	var node = tree.getFocusLastest();
	var record = dataSet.getAt(dataSet.newRecord());
	var parentRecord = dataSet.get(node.recordId);
	parentId = parentRecord.get("menuId");
	setNewMenu(parentId, record);
	return record.id;
}

//선택한 node 삭제하기
function deleteMenu() {
	var node = tree.getFocusLastest();
	if(node){  
    	dataSet.removeAt(dataSet.indexOfKey(node.recordId));
    }
}

</script>
</head>
<body>
<div id="LblockMain" class="LblockMain">  
<div id="LblockList01" class="LblockList">
	<div id="LblockList01_table">
		<div id="LblockList01_left">
			<div id="LblockTree01" class="LblockTree">
			    <div id="treeDiv1"></div>	
			</div>
		</div>
		<div id="LblockList01_right">
			<div>
				<div id="LblockDetail01" class="LblockDetail">
				    <form id="formDetail">
					<table summary="메뉴정보에 관한 테이블입니다.">
						<caption>메뉴 정보</caption>
						<tbody>
							<tr>
								<th width="30%" class="LtextRight"><label for="menuCode"><span class="essential">*</span>Menu Code</label></th>
								<td width="70%">
									<input type="text" id="menuCode" name="menuCode" readonly="true"/>
								</td>
							</tr>
							<tr>
								<th width="30%" class="LtextRight"><label for="menuLvl"><span class="essential">*</span>Menu Level</label></th>
								<td width="70%">
									<input type="text" id="menuLvl" name="menuLvl" readonly="true"/>
								</td>
							</tr>
							<tr>
								<th width="30%" class="LtextRight"><label for="menuNameCode"><span class="essential">*</span>Menu Name Code</label></th>
								<td width="70%">
									<input type="text" id="menuNameCode" name="menuNameCode" style="width:400px"/>
								</td>
							</tr>
							<tr>
								<th width="30%" class="LtextRight"><label for="menuName"><span class="essential">*</span>Menu Name</label></th>
								<td width="70%">
									<input type="text" id="menuName" name="menuName" style="width:400px"/>
								</td>
							</tr>
							<tr>
								<th width="30%" class="LtextRight"><label for="menuDesc">Menu Description</label></th>
								<td width="70%">
									<input type="text" id="menuDesc" name="menuDesc" style="width:400px"/>
								</td>
							</tr>
							<tr>
								<th width="30%" class="LtextRight"><label for="menuAppl">Menu URL</label></th>
								<td width="70%">
									<input type="text" id="menuAppl" name="menuAppl" style="width:400px"/>
								</td>
							</tr>
							<tr>
								<th width="30%" class="LtextRight"><label for="menuSeq"><span class="essential">*</span>Menu Order</label></th>
								<td width="70%">
									<input type="text" id="menuSeq" name="menuSeq"/><span id="menuSeqDesc"></span>
								</td>
							</tr>
							<tr>
								<th width="30%" class="LtextRight"><label for="menuHelpFilePath">Help File Path</label></th>
								<td width="70%">
									<input type="text" id="menuHelpFilePath" name="menuHelpFilePath" style="width:400px"/>
								</td>
							</tr>
							<tr>
								<th width="30%" class="LtextRight"><label for="useFlag">Use Flag</label></th>
								<td width="70%">
						            <input type="radio" name="useFlag" id="useFlag" value="Y"/>Use
						            <input type="radio" name="useFlag" id="useFlag" value="N"/>Not Use
								</td>
							</tr>
							<tr>
								<th width="30%" class="LtextRight"><label for="displayFlag">Display Flag</label></th>
								<td width="70%">
						            <input type="radio" name="displayFlag" id="displayFlag" value="Y"/>Use
						            <input type="radio" name="displayFlag" id="displayFlag" value="N"/>Not Use
								</td>
							</tr>
							<tr>
								<th width="30%" class="LtextRight"><label for="managerId">Manager Id</label></th>
								<td width="70%">
									<input type="text" id="managerId" name="managerId" value=""/>
								</td>
							</tr>
						</tbody>
					</table>
				    </form>
			    </div> <!-- LblockDetail01 -->
			</div>
			<div id="LblockButton" class="LblockButton">
				<div>
				    <input type="button" value="Retrieve" id="btnRetrieve"/>
				    <input type="button" value="Save" id="btnSave"/>
			        <input type="button" value="New" id="btnCreate"/>
			        <input type="button" value="Delete" id="btnDelete" />
			    </div>
			</div>
	    </div>	<!-- LblockList01_right -->
    </div> <!-- LblockList01_table -->
</div> <!-- LblockList01 -->

</div>
    
<!-- **************************************************************************
    화면영역 종료
*************************************************************************** -->
<%@include file="./../common/include/tail.jspf"%>
</body>

</html>


