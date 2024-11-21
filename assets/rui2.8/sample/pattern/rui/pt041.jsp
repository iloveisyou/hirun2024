<%@ page language="java" pageEncoding="utf-8" contentType="text/html; charset=utf-8"%>
<%@include file="/jsp/system/include/doctype.jspf"%>
<html>
<head>
<title>P4-1 Master/Detail[1:1]</title>
<%@include file="/jsp/system/include/head_rui.jspf"%>
<%@include file="/jsp/system/include/rui.jspf"%>

<script type="text/javascript">
//<![CDATA[
	Rui.onReady(function() {

		var joblevelCodeCombo = new Rui.ui.form.LCombo({
			id: 'joblevelCode',
			applyTo: 'joblevelCode',
			width: 150
		});
		
		var joblevelCodeDataSet = joblevelCodeCombo.getDataSet();

		var departmentCodeCombo = new Rui.ui.form.LCombo({
			id: 'departmentCode',
			applyTo: 'departmentCode',
			width: 150
		});
		
		var departmentCodeDataSet = departmentCodeCombo.getDataSet();

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
	    
	    var vm = new Rui.validate.LValidatorManager({
		    validators: [
				{ id: 'num', validExp: '사원번호:true:allow=number&minLength=5&maxLength=20' },
				{ id: 'joblevelCode', validExp: '직급:true' },
				{ id: 'name', validExp: '사원명:true:maxByteLength=20' },
				{ id: 'departmentCode', validExp: '부서:true' }
			]
	    });

	    var updateEditable = function() {
		    if(employeeDataSet.getCount() < 1) {
			    Rui.select('.LblockDetail input').disable();
			    joblevelCodeCombo.disable();
			    departmentCodeCombo.disable();
		    } else {
		    	Rui.select('.LblockDetail input').enable();
			    joblevelCodeCombo.enable();
			    departmentCodeCombo.enable();
		    }
	    };

	    employeeDataSet.on('load', function() {
	    	updateEditable();
	    });

	    var bind = new Rui.data.LBind({
            groupId: 'LblockDetail01',
            dataSet: employeeDataSet,
            bind: true,
            bindInfo: [
                { id: 'num', ctrlId: 'num', value: 'value' },
				{ id: 'name', ctrlId: 'name', value: 'value' },
				{ id: 'joblevelCode', ctrlId: 'joblevelCode', value: 'value' },
				{ id: 'departmentCode', ctrlId: 'departmentCode', value: 'value' }
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

	    var achievementBind = new Rui.data.LBind({
            groupId: 'LblockDetail02',
            dataSet: achievementDataSet,
            bind: true,
            bindInfo: [
				{ id: 'yyyy', ctrlId: 'yyyy', value: 'value'},
				{ id: 'value', ctrlId: 'value', value: 'value'},
				{ id: 'etc', ctrlId: 'etc', value: 'value'}
            ]
	    });

	    var achievementVm = new Rui.validate.LValidatorManager({
		    validators: [
				{ id: 'yyyy', validExp: '년도:true:minNumber=1900&maxNumber=9999' },
				{ id: 'mm', validExp: '월:true:minNumber=1&maxNumber=12' },
				{ id: 'value', validExp: '실적:true' },
				{ id: 'etc', validExp: '비고:true:maxByteLength=100' }
			]
	    });

		var comboDm = new Rui.data.LDataSetManager();
	    
		var dm = new Rui.data.LDataSetManager();

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

		Rui.get('LempNumSearch').on('keydown', function(e){
			if(e.keyCode == 13) {
				btnSearch.click();
			}
		});
		
	    var btnSearch = new Rui.ui.LButton('btnSearch');
	    btnSearch.on('click', function() {
	    	var params = Rui.util.LDom.getFormValues('LblockSearch');

	    	params.yyyy = 2000;

			dm.loadDataSet({
				dataSets: [ employeeDataSet, achievementDataSet ],
				url: '<c:url value="/standard/ruipattern/pattern4/retrieveEmployeeAchievement.rui"/>',
				params: params
			});
	    });

	    var btnAdd = new Rui.ui.LButton('btnAdd');
	    btnAdd.on('click', function() {
	    	var row = employeeDataSet.newRecord();
	    	createRecordAchievement();
	    	updateEditable();
	    });

	    var btnSave = new Rui.ui.LButton('btnSave');
	    btnSave.on('click', function() {
	    	dm.updateDataSet({
		    	dataSets : [ employeeDataSet, achievementDataSet ],
		    	url: '<c:url value="/standard/ruipattern/pattern4/cudEmployeeAchievement.rui"/>'
	    	});
	    });

	    var btnDelete = new Rui.ui.LButton('btnDelete');
	    btnDelete.on('click', function() {
		    if(employeeDataSet.getRow() < 0) return;
		    
		    Rui.confirm({
			    text: Rui.getMessageManager().get('$.base.msg107'),
			    handlerYes: function() {
			    	employeeDataSet.removeAt(employeeDataSet.getRow());
			    	achievementDataSet.removeAt(achievementDataSet.getRow());
			    	dm.updateDataSet({
				    	dataSets : [ employeeDataSet, achievementDataSet ],
				    	url: '<c:url value="/standard/ruipattern/pattern4/cudAchievement.rui"/>'
			    	});

			    	updateEditable();
		    	},
		    	handlerNo: Rui.emptyFn
			});
	    });

	    updateEditable();
	    Rui.get('LempNumSearch').focus();

		comboDm.loadDataSet({
			dataSets: [ joblevelCodeDataSet, departmentCodeDataSet ],
			url: '<c:url value="/standard/ruipattern/common/retrieveEmployeeComboData.rui" />'
		});

	});
//]]>
</script>
</head>

<body id="LblockBody">

<div id="LblockPageHeader">
	<div id="LblockPageTitle">
	<h1>P4-1 Master/Detail[1:1]</h1>
	</div>
	<div id="LblockPageLocation">
		<ul>
			<li class="Lfirst"><span><a href="/" target="_top">HOME</a></span></li>
			<li class="Llast"><span><a href="#">P1. Single Detail</a></span></li>
		</ul>
	</div><!-- LblockPageLocation -->   
</div><!-- LblockPageTitle -->

<div id="LblockMainBody">
	<form name="employeeForm" id="oEmployeeForm" method="post">
		<div id="LblockSearch">
			<table summary="사원 검색조건">
				<caption>사원 검색조건</caption>
				<tbody>
					<tr>
						<th><label for="LempNumSearch">사원번호</label></th>
						<td><input type="text" class="Ltext" id="LempNumSearch" size="20" maxlength="5" name="searchNum" value="30001" /></td>
					</tr>
				</tbody>
			</table>
			<button type="button" id="btnSearch" class="LBtnSearch">Search</button>
		</div><%-- LblockSearch --%>
	
		<div id="LblockDetail01" class="LblockDetail">
			<table summary="사원 상세정보">
				<caption>사원 상세정보</caption>
				<tbody>
					<tr>
						<th><label for="num">사원번호</label></th>
						<td><input type="text" id="num" /></td>
						<th><label>직급</label></th>
						<td><div id="joblevelCode" ></div></td>
					</tr>
					<tr>
						<th><label>사원명</label></th>
						<td><input type="text" id="name" /></td>
						<th><label>부서</label></th>
						<td><div id="departmentCode" ></div></td>
					</tr>
				</tbody>
			</table>
		</div><!-- LblockDetail01 -->
	
		<div id="LblockDetail02" class="LblockDetail">
			<table summary="영업실적">
				<caption>영업실적</caption>
				<tbody>
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
		</div><!-- LblockDetail02 -->
	</form>

	<div id="LblockButton">
		<button type="button" id="btnAdd" >신규</button>
		<button type="button" id="btnSave" >저장</button>
		<button type="button" id="btnDelete" >삭제</button>
	</div><!-- LblockButton -->

</div><!-- LblockMainBody -->

</body>
</html>
<%@include file="/jsp/system/include/tail.jspf"%>