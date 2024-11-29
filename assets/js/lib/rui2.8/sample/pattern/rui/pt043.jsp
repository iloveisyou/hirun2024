<%@ page language="java" pageEncoding="utf-8" contentType="text/html; charset=utf-8"%>
<%@include file="/jsp/system/include/doctype.jspf"%>
<html>
<head>
<title>P4-3 Master/Detail [n:1]</title>
<%@include file="/jsp/system/include/head_rui.jspf"%>
<%@include file="/jsp/system/include/rui.jspf"%>

<script type="text/javascript">
//<![CDATA[
	Rui.onReady(function() {

		var searchJoblevelCodeCombo = new Rui.ui.form.LCombo({
			id: 'searchJoblevelCode',
			applyTo: 'searchJoblevelCode',
			defaultValue: '00003',
			width: 150
		});
		
		var joblevelCodeDataSet = searchJoblevelCodeCombo.getDataSet();
		joblevelCodeDataSet.id = 'joblevelCodeDataSet';

		var searchDivisionCodeCombo = new Rui.ui.form.LCombo({
			id: 'searchDivisionCode',
			applyTo: 'searchDivisionCode',
			width: 150
		});
		
		var divisionCodeDataSet = searchDivisionCodeCombo.getDataSet();
		divisionCodeDataSet.id = 'divisionCodeDataSet';

		var searchSkillCodeCombo = new Rui.ui.form.LCombo({
			id: 'searchSkillCode',
			applyTo: 'searchSkillCode',
			width: 150
		});
		
		var skillCodeDataSet = searchSkillCodeCombo.getDataSet();
		skillCodeDataSet.id = 'skillCodeDataSet';

	    var joblevelCodeGridCombo = new Rui.ui.form.LCombo({
	    	autoMapping: true,
	       	rendererField: 'joblevelCodeName' 
	    });

	    var departmentCodeGridCombo = new Rui.ui.form.LCombo({
	    	autoMapping: true,
	        rendererField: 'departmentCodeName' 
	    });

	    var skillCodeGridCombo = new Rui.ui.form.LCombo({
	    	autoMapping: true,
	        rendererField: 'skillCodeName'
	    });

	    var employeeDataSet = new Rui.data.LJsonDataSet({
	        id:'employeeDataSet',
	        fields: [
	            { id: 'num' },
				{ id: 'name' },
				{ id: 'birthdate', type:'date', defaultValue: new Date() },
				{ id: 'ssn' },
				{ id: 'sex', defaultValue: 'M' },
				{ id: 'telephone' },
				{ id: 'address' },
				{ id: 'postal' },
				{ id: 'skillCode' },
				{ id: 'joblevelCode' },
				{ id: 'divisionCode' },
				{ id: 'departmentCode' },
				{ id: 'joblevelCodeName' },
				{ id: 'departmentCodeName' },
				{ id: 'skillCodeName' }
	        ]
	    });
	    
	    var vm = new Rui.validate.LValidatorManager({
		    validators: [
 				{ id: 'num', validExp: '사원번호:true:number&minLength=5&maxLength=20' },
				{ id: 'joblevelCode', validExp: '직급:true' },
				{ id: 'name', validExp: '사원명:true:maxByteLength=20' },
				{ id: 'departmentCode', validExp: '부서:true' },
				{ id: 'birthdate', validExp: '생년월일:true:date=YYYYMMDD' },
				{ id: 'ssn', validExp: '주민등록번호:false:ssn' },
				{ id: 'sex', validExp: '성별:true' },
				{ id: 'telephone', validExp: '전화번호:true:maxByteLength=20' },
				{ id: 'postal', validExp: '우편번호:true:maxByteLength=20' },
				{ id: 'skillCode', validExp: '기술등급:true' },
				{ id: 'address', validExp: '주소:true:maxByteLength=80' }
			]
	    });

	    var updateEditable = function() {
		    if(employeeDataSet.getCount() < 1) {
			    Rui.select('.LblockDetail input').disable();
		    } else {
		    	Rui.select('.LblockDetail input').enable();
		    }
	    };

	    employeeDataSet.on('load', function() {
	    	updateEditable();
	    });

	    employeeDataSet.on('rowPosChanged', function(e) {
		    var params = {
		    	queryNum: employeeDataSet.getNameValue(employeeDataSet.getRow(), 'num'),
		    	yyyy: '' + new Date().getFullYear()
		    };

		    if(employeeDataSet.isRowInserted(e.row)) {
			    if(employeeDataSet.getNameValue(e.row, 'num') != achievementDataSet.getNameValue(0, 'num'))
		    		createRecordAchievement();
		    } else {
		    	achievementDataSet.load({
			    	url: '<c:url value="/standard/ruipattern/pattern4/retrieveAchievement.rui"/>',
			    	params: params
			    });
		    }
	    });

	    employeeDataSet.on('update', function(e) {
		    if(e.colId == 'num' || e.colId == 'name') {
		    	achievementDataSet.setNameValue(0, 'num', employeeDataSet.getNameValue(e.row, 'num'));
		    	achievementDataSet.setNameValue(0, 'name', employeeDataSet.getNameValue(e.row, 'name'));
		    }
	    });

	    var achievementVm = new Rui.validate.LValidatorManager({
		    validators: [
				{ id: 'yyyy', validExp: '년도:true:minNumber=1900&maxNumber=9999' },
				{ id: 'mm', validExp: '월:true:minNumber=1&maxNumber=12' },
				{ id: 'value', validExp: '실적:true' },
				{ id: 'etc', validExp: '비고:true:maxByteLength=100' }
			]
	    });
	    

	    var achievementDataSet = new Rui.data.LJsonDataSet({
	        id: 'achievementDataSet',
	        fields: [
	            { id: 'num' },
				{ id: 'name' },
				{ id: 'yyyy', type: 'number' },
				{ id: 'mm', type: 'number' },
				{ id: 'value', type: 'number' },
				{ id: 'etc' }
	        ]
	    });

	    var createRecordAchievement = function() {
	    	achievementDataSet.clearData();
		    var row = employeeDataSet.getRow();
		    var newData = {
		    	num: employeeDataSet.getNameValue(row, 'num'),
		    	name: employeeDataSet.getNameValue(row, 'name'),
		    	yyyy: new Date().getFullYear(),
		    	mm: 12
		    };
	    	achievementDataSet.add(achievementDataSet.createRecord(newData));
	    	achievementDataSet.setRow(achievementDataSet.getCount() - 1);
	    };

	    achievementDataSet.on('load', function() {
		    if(achievementDataSet.getCount() < 1) {
		    	createRecordAchievement();
		    }
	    });

        var columnModel = new Rui.ui.grid.LColumnModel({
        	defaultSortable: true,
            columns: [
                new Rui.ui.grid.LStateColumn(),
                { field: 'num', label: '사원번호', editor: new Rui.ui.form.LTextBox() },
                { field: 'name', label: '사원명', editor: new Rui.ui.form.LTextBox() },
                { field: 'joblevelCode', label: '직급', align: 'center', editor: joblevelCodeGridCombo },
                { field: 'departmentCode', label: '부서', align: 'center', editor: departmentCodeGridCombo },
                { field: 'skillCode', label: '기술등급', align: 'center', editor: skillCodeGridCombo },
                { field: 'sex', label: '성별', align: 'center', width: 80, sortable: false, editor: new Rui.ui.form.LRadioGroup({
                    items: [
                        { label: '남', value: 'M', checked: true },
                        { label: '여', value: 'F' }
                    ]
                }) },
                { field: 'birthdate', label: '생년월일', align:'center', editor: new Rui.ui.form.LDateBox(), renderer: Rui.util.LRenderer.dateRenderer() }
            ]
        });

	    var employeeGrid = new Rui.ui.grid.LGridPanel({
            columnModel: columnModel,
            autoWidth: true,
            width: 600,
            height: 350,
            dataSet: employeeDataSet
        });

	    employeeGrid.render('employeeGrid');
	    

	    var bind = new Rui.data.LBind({
            groupId: 'LblockDetail',
            dataSet: achievementDataSet,
            bind: true,
            bindInfo: [
				{ id: 'name', ctrlId:'name', value:'value' },
				{ id: 'yyyy', ctrlId:'yyyy', value:'value' },
				{ id: 'value', ctrlId:'value', value:'value' },
				{ id: 'etc', ctrlId:'etc', value:'value' }
            ]
	    });


		var dm = new Rui.data.LDataSetManager();

		dm.on('load', function(e) {
			var data = Rui.util.LJson.decode(e.conn.responseText);
			joblevelCodeGridCombo.getDataSet().loadData(data[0]);
			departmentCodeGridCombo.getDataSet().loadData(data[1]);
			skillCodeGridCombo.getDataSet().loadData(data[2]);
		});


	    dm.on('beforeUpdate', function(e) {
	    	if(vm.validateDataSet(employeeDataSet) == false) {
	    		Rui.alert(Rui.getMessageManager().get('$.base.msg052') + '<br>' + vm.getMessageList().join('<br>') );
	    		return false;
	    	}

	    	if(achievementVm.validateDataSet(achievementDataSet) == false) {
	    		Rui.alert(Rui.getMessageManager().get('$.base.msg052') + '<br>' + achievementVm.getMessageList().join('<br>') );
	    		return false;
	    	}
	    });

		dm.on('success', function() {
			Rui.alert(Rui.getMessageManager().get('$.base.msg100'));
		});

	    var btnSearch = new Rui.ui.LButton('btnSearch');
	    btnSearch.on('click', function() {
	    	var params = Rui.util.LDom.getFormValues('LblockSearch');
		    
	    	if(!params.searchSkillCode && !params.searchJoblevelCode) {
	    		Rui.alert('검색 조건을 선택하세요.');
	    		searchJoblevelCodeCombo.focus();
	    		return;
	    	}

	    	employeeDataSet.load({
	    		url: '<c:url value="/standard/ruipattern/pattern2/retrieveEmployeeList.rui"/>',
		    	params: params
	    	});
	    });

	    var btnAdd = new Rui.ui.LButton('btnAdd');
	    btnAdd.on('click', function() {
	    	var row = employeeDataSet.newRecord();
	    	employeeDataSet.setNameValue(row, 'sex', 'M');
	    	//createRecordAchievement();
	    });

	    var btnSave = new Rui.ui.LButton('btnSave');
	    btnSave.on('click', function() {
	    	dm.updateDataSet({
		    	dataSets : [ employeeDataSet, achievementDataSet ],
		    	url: '<c:url value="/standard/ruipattern/pattern2/cudEmployeeAchievement.rui"/>'
	    	});
	    });

	    var btnDelete = new Rui.ui.LButton('btnDelete');
	    btnDelete.on('click', function() {
		    if(employeeDataSet.getRow() < 0) return;
		    employeeDataSet.removeAt(employeeDataSet.getRow());
	    });

	    var btnUndo = new Rui.ui.LButton('btnUndo');
	    btnUndo.on('click', function() {
		    if(employeeDataSet.getRow() < 0) return;
		    employeeDataSet.undo(employeeDataSet.getRow());
	    });
	    
	    updateEditable();

		dm.loadDataSet({
			dataSets: [ joblevelCodeDataSet, divisionCodeDataSet, skillCodeDataSet ],
			url: '<c:url value="/standard/ruipattern/common/retrieveEmployeeComboData.rui" />'
		});
	});
//]]>
</script>
</head>

<body id="LblockBody">

<div id="LblockPageHeader">
	<div id="LblockPageTitle">
	<h1>RUI Patten P4-3 Master/Detail(n:1)</h1>
	</div>
	<div id="LblockPageLocation">
		<ul>
			<li class="Lfirst"><span><a href="/" target="_top">HOME</a></span></li>
			<li class="Llast"><span><a href="#">Pattern 4-3 : Master/Detail(n:1)</a></span></li>
		</ul>
	</div><!-- LblockPageLocation -->   
</div><!-- LblockPageTitle -->

<div id="LblockMainBody">
	<form name="aform" method="post" action="/jsp/uip/rui/pt043.jsp">
		<div id="LblockSearch">
			<table summary="사원 검색조건">
				<caption>사원 검색조건</caption>
				<tbody>
					<tr>
						<th><label for="searchJoblevelCode">직급</label></th>
						<td><div id="searchJoblevelCode" ></div></td>
						<th><label for="searchDivisionCode">부서</label></th>
						<td><div id="searchDivisionCode" ></div></td>
						<th><label for="searchSkillCode">기술등급</label></th>
						<td><div id="searchSkillCode" ></div></td>
					</tr>
				</tbody>
			</table>
			<button type="button" id="btnSearch" class="LBtnSearch" >Search</button>
		</div><%-- LblockSearch --%>
	</form>

	<div id="employeeGrid" ></div>

	<div id="LblockButton">
		<button type="button" id="btnAdd" >행신규</button>
		<button type="button" id="btnDelete" >행삭제</button>
		<button type="button" id="btnUndo" >취소</button>
	</div><!-- LblockButton -->

	<div id="LblockDetail" class="LblockDetail">
		<table summary="영업실적">
			<caption>영업실적</caption>
			<tbody>
				<tr>
					<th><label for="name">담당고객</label></th>
					<td colspan="3"><input type="text" id="name" readonly="readonly"/></td>
				</tr>
				<tr>
					<th><label for="yyyy">년도</label></th>
					<td><input type="text" id="yyyy" /></td>
					<th><label for="value">실적</label></th>
					<td><input type="text" id="value" /></td>
				</tr>
				<tr>
					<th><label for="etc">etc</label></th>
					<td colspan="3" ><input type="text" id="etc" /></td>
				</tr>
			</tbody>
		</table>
	</div><!-- LblockDetail -->

	<div id="LblockButton">
		<button type="button" id="btnSave" >저장</button>
	</div><!-- LblockButton -->

</div><!-- LblockMainBody -->

</body>
</html>
<%@include file="/jsp/system/include/tail.jspf"%>