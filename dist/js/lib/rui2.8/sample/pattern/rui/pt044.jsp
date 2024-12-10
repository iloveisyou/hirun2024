<%@ page language="java" pageEncoding="utf-8" contentType="text/html; charset=utf-8"%>
<%@include file="/jsp/system/include/doctype.jspf"%>
<html>
<head>
<title>RUI Patten P44 Master/Detail [n:n]</title>
<%@include file="/jsp/system/include/head_rui.jspf"%>
<%@include file="/jsp/system/include/rui.jspf"%>

<script type="text/javascript">
//<![CDATA[
	Rui.onReady(function() {

		var querycenterCodeCombo = new Rui.ui.form.LCombo({
			id: 'centerCode',
			applyTo: 'centerCode',
			url: '<c:url value="/standard/ruipattern/pattern4/retrieveCenterList.rui" />',
			displayField: 'name'
		});


	    var dm = new Rui.data.LDataSetManager();
	    
	    dm.on('beforeUpdate', function(e){
	    	if(vm.validateDataSet(centerDataSet) == false) {
	    		Rui.alert(Rui.getMessageManager().get('$.base.msg052') + '<br>' + vm.getMessageList().join('<br>') );
	    		return false;
	    	}

	    	if(regionVm.validateDataSet(regionDataSet) == false) {
	    		Rui.alert(Rui.getMessageManager().get('$.base.msg052') + '<br>' + regionVm.getMessageList().join('<br>') );
	    		return false;
	    	}
	    });

		dm.on('success', function() {
			Rui.alert(Rui.getMessageManager().get('$.base.msg100'));
		});

	    var centerDataSet = new Rui.data.LJsonDataSet({
	        id:'centerDataSet',
	        fields: [
	            { id: 'code' },
				{ id: 'name' },
				{ id: 'chief' },
				{ id: 'address' },
				{ id: 'phone' }
	        ]
	    });

	    centerDataSet.on('rowPosChanged', function(e) {
		    if(e.row >= 0) {
	            if(centerDataSet.isRowInserted(e.row)) {
	                regionDataSet.clearData();
	            } else {
	                var params = {
	                    centerCode: centerDataSet.getNameValue(e.row, 'code')
	                };
	                regionDataSet.load({
	                    url: '<c:url value="/standard/ruipattern/pattern4/retrieveRegionList.rui" />',
	                    params: params
	                });
	            }
		    } else {
		    	regionDataSet.clearData();
		    }
	    });

	    var vm = new Rui.validate.LValidatorManager({
		    validators: [
				{ id: 'code', validExp: '센터코드:true:number&length=5' },
				{ id: 'name', validExp: '센터:true:maxByteLength=20' },
				{ id: 'chief', validExp: '센터장:true' },
				{ id: 'address', validExp: '주소:true' },
				{ id: 'phone', validExp: '전화번호:true' }
			]
	    });

        var columnModel = new Rui.ui.grid.LColumnModel({
        	defaultSortable: true,
            columns: [
                new Rui.ui.grid.LStateColumn(),
                { field: 'code', label: '센터코드', editor: new Rui.ui.form.LTextBox() },
                { field: 'name', label: '센터', width: 150, editor: new Rui.ui.form.LTextBox() },
                { field: 'chief', label: '센터장', editor: new Rui.ui.form.LTextBox() },
                { field: 'address', label: '주소', width: 280, editor: new Rui.ui.form.LTextBox() },
                { field: 'phone', label: '전화번호', editor: new Rui.ui.form.LTextBox() }
            ]
        });

	    var centerGrid = new Rui.ui.grid.LGridPanel({
            columnModel: columnModel,
            autoWidth: true,
            width: 700,
            height: 250,
            dataSet: centerDataSet
        });

	    centerGrid.render('centerGrid');


	    var regionDataSet = new Rui.data.LJsonDataSet({
	        id: 'regionDataSet',
	        fields: [
	            { id: 'code' },
	            { id: 'regionCode' },
				{ id: 'name' },
				{ id: 'chief' },
				{ id: 'address' }
	        ]
	    });

	    var regionVm = new Rui.validate.LValidatorManager({
		    validators: [
				{ id: 'code', validExp: '센터코드:true:number&length=5' },
				{ id: 'regionCode', validExp: '지역코드:true:number&length=5' },
				{ id: 'name', validExp: '지역:true:maxByteLength=20' },
				{ id: 'chief', validExp: '사무소장:true' },
				{ id: 'address', validExp: '주소:true' }
			]
	    });

        var regionColumnModel = new Rui.ui.grid.LColumnModel({
        	defaultSortable: true,
            columns: [
                new Rui.ui.grid.LStateColumn(),
                { field: 'regionCode', label: '지역코드', editor: new Rui.ui.form.LTextBox() },
                { field: 'name', label: '지역', editor: new Rui.ui.form.LTextBox() },
                { field: 'chief', label: '사무소장', width: 150, editor: new Rui.ui.form.LTextBox() },
                { field: 'address', label: '주소', width: 380, editor: new Rui.ui.form.LTextBox() }
            ]
        });

	    var regionGrid = new Rui.ui.grid.LGridPanel({
            columnModel: regionColumnModel,
            autoWidth: true,
            width: 700,
            height: 250,
            dataSet: regionDataSet
        });

	    regionGrid.render('regionGrid');

	    var btnSearch = new Rui.ui.LButton('btnSearch');
	    btnSearch.on('click', function() {
	    	var params = Rui.util.LDom.getFormValues('LblockSearch');
		    
	    	centerDataSet.load({
		    	url: '<c:url value="/standard/ruipattern/pattern4/retrieveCenterList.rui" />',
		    	params: params
	    	});
	    });

	    var btnAdd1 = new Rui.ui.LButton('btnAdd1');
	    btnAdd1.on('click', function() {
	    	var row = centerDataSet.newRecord();
	    });

	    var btnDelete1 = new Rui.ui.LButton('btnDelete1');
	    btnDelete1.on('click', function() {
		    if(centerDataSet.getRow() < 0) return;
	    	centerDataSet.removeAt(centerDataSet.getRow());
	    });

	    var btnUndo1 = new Rui.ui.LButton('btnUndo1');
	    btnUndo1.on('click', function() {
		    if(centerDataSet.getRow() < 0) return;
		    centerDataSet.undo(centerDataSet.getRow());
	    });


	    var btnAdd2 = new Rui.ui.LButton('btnAdd2');
	    btnAdd2.on('click', function() {
		    var centerCode = centerDataSet.getNameValue(centerDataSet.getRow(), 'code');
	    	if(centerCode == '') {
		    	Rui.alert('센터코드를 입력하세요.');
		    	return;
	    	}
	    	var row = regionDataSet.newRecord();
	    	regionDataSet.setNameValue(row, 'code', centerCode);
	    });

	    var btnDelete2 = new Rui.ui.LButton('btnDelete2');
	    btnDelete2.on('click', function() {
		    if(regionDataSet.getRow() < 0) return;
		    regionDataSet.removeAt(regionDataSet.getRow());
	    });

	    var btnUndo2 = new Rui.ui.LButton('btnUndo2');
	    btnUndo2.on('click', function() {
		    if(regionDataSet.getRow() < 0) return;
		    regionDataSet.undo(regionDataSet.getRow());
	    });

	    var btnSave = new Rui.ui.LButton('btnSave');
	    btnSave.on('click', function() {
	    	dm.updateDataSet({
		    	dataSets: [ centerDataSet, regionDataSet ],
		    	url: '<c:url value="/standard/ruipattern/pattern4/cudCenterRegion.rui" />'
		    });
	    });
	    
	});
//]]>
</script>
</head>

<body id="LblockBody">

<div id="LblockPageHeader">
	<div id="LblockPageTitle">
	<h1>RUI Patten P4-4 Master/Detail [n:n]</h1>
	</div>
	<div id="LblockPageLocation">
		<ul>
			<li class="Lfirst"><span><a href="/" target="_top">HOME</a></span></li>
			<li class="Llast"><span><a href="#">P4-4. Master/Detail(n:n)</a></span></li>
		</ul>
	</div><!-- LblockPageLocation -->   
</div><!-- LblockPageTitle -->

<div id="LblockMainBody">
	<form name="aform" method="post" action="/jsp/uip/rui/pt044.jsp">
		<div id="LblockSearch">
			<table summary="사원 검색조건">
				<caption>사원 검색조건</caption>
				<tbody>
					<tr>
						<th><label for="centerCode">센터</label></th>
						<td><div id="centerCode" ></div></td>
					</tr>
				</tbody>
			</table>
			<button type="button" id="btnSearch"  class="LBtnSearch" >Search</button>
		</div><%-- LblockSearch --%>
	</form>
	
	<div id="LblockDetail01" >
		<div id="centerGrid" ></div>
		<div id="LblockButton">
			<button type="button" id="btnAdd1" >행추가</button>
			<button type="button" id="btnDelete1" >삭제</button>
			<button type="button" id="btnUndo1" >취소</button>
		</div><!-- LblockButton -->
	</div><!-- LblockDetail01 -->
	<div id="LblockDetail02" >
		<div id="regionGrid" ></div>
		<div id="LblockButton">
			<button type="button" id="btnAdd2" >행추가</button>
			<button type="button" id="btnDelete2" >삭제</button>
			<button type="button" id="btnUndo2" >취소</button>
		</div><!-- LblockButton -->
	</div><!-- LblockDetail02 -->

	<div id="LblockButton">
		<button type="button" id="btnSave" >저장</button>
	</div><!-- LblockButton -->

</div><!-- LblockMainBody -->

</body>
</html>
<%@include file="/jsp/system/include/tail.jspf"%>