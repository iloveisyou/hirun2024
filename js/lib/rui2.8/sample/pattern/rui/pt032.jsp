<%@ page language="java" pageEncoding="utf-8" contentType="text/html; charset=utf-8"%>
<%@include file="/jsp/system/include/doctype.jspf"%>
<html>
<head>
<title>P32. List / Detail</title>
<%@include file="/jsp/system/include/head_rui.jspf"%>
<%@include file="/jsp/system/include/rui.jspf"%>

<style type="text/css" >
.LblockDetail {
	width: 350px;
}

#LblockButton {
	clear:both;
}

.LblockLeft {
	width: 100%;
	margin-left: -370px;
}

#employeeGrid {
	margin-left: 370px;
}

.LblockRight {
	width: 350px;
}
</style>

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

	    var joblevelCodeCombo = new Rui.ui.form.LCombo({
		    id: 'joblevelCode',
		    applyTo: 'joblevelCode',
			width: 150
	    });

	    var departmentCodeCombo = new Rui.ui.form.LCombo({
		    id: 'departmentCode',
		    applyTo: 'departmentCode',
		    width: 150
	    });

	    var skillCodeCombo = new Rui.ui.form.LCombo({
		    id: 'skillCode',
		    applyTo: 'skillCode',
		    width: 150
	    });

	    var birthdate = new Rui.ui.form.LDateBox({
			id: 'birthdate',
	        applyTo: 'birthdate'
	    });

		new Rui.ui.form.LTextBox({ mask: '999999-9999999', applyTo: 'ssn', width: 150 });
		new Rui.ui.form.LTextBox({ mask: '999-999', applyTo: 'postal', width: 60 });

	    var dm = new Rui.data.LDataSetManager();

	    dm.on('beforeUpdate', function(e) {
	    	if(vm.validateDataSet(employeeDataSet) == false) {
	    		Rui.alert(Rui.getMessageManager().get('$.base.msg052') + '<br>' + vm.getMessageList().join('<br>') );
	    		return false;
	    	}
	    });

		dm.on('success', function() {
			Rui.alert(Rui.getMessageManager().get('$.base.msg100'));
		});

		dm.on('load', function(e) {
			var data = Rui.util.LJson.decode(e.conn.responseText);
			joblevelCodeCombo.getDataSet().loadData(data[0]);
			departmentCodeCombo.getDataSet().loadData(data[1]);
			skillCodeCombo.getDataSet().loadData(data[2]);
		});

	    var employeeDataSet = new Rui.data.LJsonDataSet({
	        id: 'employeeDataSet',
	        fields: [
	            { id: 'num' },
				{ id: 'name' },
				{ id: 'birthdate', type: 'date', defaultValue: new Date() },
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

	    var updateEditable = function() {
		    if(employeeDataSet.getCount() < 1) {
			    Rui.select('.LblockDetail input').disable();
			    joblevelCodeCombo.disable();
			    departmentCodeCombo.disable();
			    skillCodeCombo.disable();
			    birthdate.disable();
		    } else {
		    	Rui.select('.LblockDetail input').enable();
			    joblevelCodeCombo.enable();
			    departmentCodeCombo.enable();
			    skillCodeCombo.enable();
			    birthdate.enable();
		    }
	    };

	    employeeDataSet.on('load', function() {
	    	updateEditable();
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

        var columnModel = new Rui.ui.grid.LColumnModel({
        	defaultSortable: true,
            columns: [
                new Rui.ui.grid.LStateColumn(),
                { field: 'name', label: '사원명' },
                { field: 'joblevelCodeName', label: '직급', width: 85, align: 'center' },
                { field: 'departmentCodeName', label: '부서', align: 'center' },
                { field: 'skillCodeName', label: '기술등급', width: 80, align: 'center' }
            ]
        });

	    var employeeGrid = new Rui.ui.grid.LGridPanel({
            columnModel: columnModel,
            autoWidthResize: true,
            width: 400,
            height: 310,
            dataSet: employeeDataSet
        });

	    employeeGrid.render('employeeGrid');


	    var bind = new Rui.data.LBind({
            groupId: 'employeeDtail',
            dataSet: employeeDataSet,
            bind: true,
            bindInfo: [
                { id: 'num', ctrlId: 'num', value: 'value' },
				{ id: 'name', ctrlId: 'name', value: 'value' },
				{ id: 'birthdate', ctrlId: 'birthdate', value: 'value' },
				{ id: 'ssn', ctrlId: 'ssn', value: 'value' },
				{ id: 'sex', ctrlId: 'sex', value: 'value' },
				{ id: 'telephone', ctrlId: 'telephone', value: 'value' },
				{ id: 'address', ctrlId: 'address', value: 'value' },
				{ id: 'postal', ctrlId: 'postal', value: 'value' },
				{ id: 'skillCode', ctrlId: 'skillCode', value: 'value' },
				{ id: 'joblevelCode', ctrlId: 'joblevelCode', value: 'value' },
				{ id: 'departmentCode', ctrlId: 'departmentCode', value: 'value' }
            ]
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
		    	url: '<c:url value="/standard/ruipattern/pattern2/retrieveEmployeeList.rui" />',
		    	params: params
	    	});
	    });

	    var btnAdd = new Rui.ui.LButton('btnAdd');
	    btnAdd.on('click', function() {
	    	var row = employeeDataSet.newRecord();
	    	updateEditable();
	    });

	    var btnDelete = new Rui.ui.LButton('btnDelete');
	    btnDelete.on('click', function() {
		    if(employeeDataSet.getRow() < 0) return;
		    
		    Rui.confirm({
			    text: Rui.getMessageManager().get('$.base.msg107'),
			    handlerYes: function() {
			    	employeeDataSet.removeAt(employeeDataSet.getRow());
			    	dm.updateDataSet({
				    	dataSets : [ employeeDataSet ],
				    	url: '<c:url value="/standard/ruipattern/pattern1/cudEmployee.rui"/>'
			    	});

			    	updateEditable();
		    	},
		    	handlerNo: Rui.emptyFn
			});
	    });

	    var btnUndo = new Rui.ui.LButton('btnUndo');
	    btnUndo.on('click', function() {
		    if(employeeDataSet.getRow() < 0) return;
	    	employeeDataSet.undo(employeeDataSet.getRow());
	    });

	    var btnSave = new Rui.ui.LButton('btnSave');
	    btnSave.on('click', function() {
	    	dm.updateDataSet({
		    	dataSets : [ employeeDataSet ],
		    	url: '<c:url value="/standard/ruipattern/pattern1/cudEmployee.rui"/>'
	    	});
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
	<h1>RUI Patten P032 List / Detail</h1>
	</div>
	<div id="LblockPageLocation">
		<ul>
			<li class="Lfirst"><span><a href="/" target="_top">HOME</a></span></li>
			<li class="Llast"><span><a href="#">P32. List / Detail</a></span></li>
		</ul>
	</div><!-- LblockPageLocation -->   
</div><!-- LblockPageTitle -->

<div id="LblockMainBody">
	<form name="aform" method="post" action="/jsp/uip/rui/pt032.jsp">
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
			<button type="button" id="btnSearch" class="LBtnSearch">검색</button>
		</div><%-- LblockSearch --%>
	</form>

	<div>
		<div class="LblockLeft">
			<div id="employeeGrid" ></div>
		</div>
		<div class="LblockRight">
			<div id="employeeDtail" class="LblockDetail">
				<table summary="사원 상세정보">
					<caption>사원 상세정보</caption>
					<tbody>
						<tr>
							<th><label for="num">사원번호</label></th>
							<td><input type="text" id="num" /></td>
						</tr>
						<tr>
							<th><label>직급</label></th>
							<td><div id="joblevelCode" ></div></td>
						</tr>
						<tr>
							<th><label>사원명</label></th>
							<td><input type="text" id="name" /></td>
						</tr>
						<tr>
							<th><label>부서</label></th>
							<td><div id="departmentCode" ></div></td>
						</tr>
						<tr>
							<th><label>생년월일</label></th>
							<td><div id="birthdate" ></div></td>
						</tr>
						<tr>
							<th>성별</th>
							<td>
								<input type="radio" id="sex1" name="sex" value="M"/><label for="">남</label>
								<input type="radio" id="sex2" name="sex" value="F"/><label for="">여</label>
				         	</td>
						</tr>
						<tr>
							<th><label>주민등록번호</label></th>
							<td><input type="text" id="ssn" /></td>
						</tr>
						<tr>
							<th><label>전화번호</label></th>
							<td><input type="text" id="telephone" /></td>
						</tr>
						<tr>
							<th><label>우편번호</label></th>
							<td><input type="text" id="postal" /></td>
						</tr>
						<tr>
							<th><label>기술등급</label></th>
							<td><div id="skillCode" ></div></td>
						</tr>
						<tr>
							<th><label>주소</label></th>
							<td><input type="text" id="address" /></td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
	</div><!-- LblockDetail -->
	
	<div id="LblockButton">
		<button type="button" id="btnAdd" >추가</button>
		<button type="button" id="btnSave" >저장</button>
		<button type="button" id="btnDelete" >삭제</button>
		<button type="button" id="btnUndo" >취소</button>
	</div><!-- LblockButton -->

</div><!-- LblockMainBody -->

</body>
</html>
<%@include file="/jsp/system/include/tail.jspf"%>