<%@ page language="java" pageEncoding="utf-8" contentType="text/html; charset=utf-8"%>
<%@include file="/jsp/system/include/doctype.jspf"%>
<html>
<head>
<title>P42 Master/Detail(1:n)</title>
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

		var comboDm = new Rui.data.LDataSetManager();

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
				{ id: 'job' },
				{ id: 'department' },
				{ id: 'skill' }
	        ]
	    });

	    var vm = new Rui.validate.LValidatorManager({
		    validators: [
				{ id: 'num', validExp: '사원번호:true:number&minLength=5&maxLength=20' },
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

        var columnModel = new Rui.ui.grid.LColumnModel({
        	defaultSortable: true,
            columns: [
                new Rui.ui.grid.LStateColumn(),
                { id:'yyyy', field: 'yyyy', label: '년도', align: 'center', editable: false, editor: new Rui.ui.form.LNumberBox(), renderer: function(val, p, record){
                    p.editable = (record.state == Rui.data.LRecord.STATE_INSERT);
                    return val;
                } },
                { id:'mm', field: 'mm', label: '월', align: 'center', editable: false, editor: new Rui.ui.form.LNumberBox(), renderer: function(val, p, record){
                    p.editable = (record.state == Rui.data.LRecord.STATE_INSERT);
                    return val;
                } },
                { field: 'value', label: '실적', align: 'right', editor: new Rui.ui.form.LNumberBox(), renderer: 'money' },
                { field: 'etc', label: '비고', editor: new Rui.ui.form.LTextBox() }
            ]
        });

	    var achievementGrid = new Rui.ui.grid.LGridPanel({
            columnModel: columnModel,
            autoWidth: true,
            width: 600,
            height: 350,
            dataSet: achievementDataSet,
            skipRowCellEvent: false
        });

	    achievementGrid.render('achievementGrid');
	    

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
			btnSearch.click();
		});

	    var btnSearch = new Rui.ui.LButton('btnSearch');
	    btnSearch.on('click', function() {
	    	var params = Rui.util.LDom.getFormValues('LblockSearch');
	    	if(!params.searchNum) {
	    		Rui.alert('사원번호를 입력하세요.');
	    		Rui.get('searchNum').focus();
	    		return;
	    	}

			dm.loadDataSet({
				dataSets: [ employeeDataSet, achievementDataSet ],
				url: '<c:url value="/standard/ruipattern/pattern4/retrieveEmployeeAchievement.rui"/>',
				params: params
			});
	    });

	    var insertBtn = new Rui.ui.LButton('insertBtn');
	    insertBtn.on('click', function() {
	    	var row = achievementDataSet.newRecord();
	    	achievementDataSet.setNameValue(row, 'num', employeeDataSet.getNameValue(employeeDataSet.getRow(), 'num'));
	    });

	    var saveBtn = new Rui.ui.LButton('saveBtn');
	    saveBtn.on('click', function() {
	    	dm.updateDataSet({
		    	dataSets : [ employeeDataSet, achievementDataSet ],
		    	url: '<c:url value="/standard/ruipattern/pattern4/cudAchievement.rui"/>'
	    	});
	    });

	    var deleteBtn = new Rui.ui.LButton('deleteBtn');
	    deleteBtn.on('click', function() {
		    if(achievementDataSet.getRow() < 0) return;
		    
		    Rui.confirm({
			    text: Rui.getMessageManager().get('$.base.msg107'),
			    handlerYes: function() {
				    if(achievementDataSet.isRowInserted(achievementDataSet.getRow())) {
				    	achievementDataSet.undo(achievementDataSet.getRow());
				    } else {
				    	achievementDataSet.removeAt(achievementDataSet.getRow());
				    	dm.updateDataSet({
					    	dataSets : [ employeeDataSet, achievementDataSet ],
					    	url: '<c:url value="/standard/ruipattern/pattern4/cudAchievement.rui"/>'
				    	});
				    }
		    	},
		    	handlerNo: Rui.emptyFn
			});
	    });

	    updateEditable();

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
	<h1>RUI Patten P4-2 Master/Detail(1:n)</h1>
	</div>
	<div id="LblockPageLocation">
		<ul>
			<li class="Lfirst"><span><a href="/" target="_top">HOME</a></span></li>
			<li class="Llast"><span><a href="#">P42 Master/Detail(1:n)</a></span></li>
		</ul>
	</div><!-- LblockPageLocation -->   
</div><!-- LblockPageTitle -->

<div id="LblockMainBody">
	<form name="aform" method="post">
		<div id="LblockSearch">
			<table summary="사원 검색조건">
				<caption>사원 검색조건</caption>
				<tbody>
					<tr>
						<th><label for="searchNum">사원번호</label></th>
						<td><input type="text" class="Ltext" id="searchNum" size="20" maxlength="5" name="searchNum" value="30001" /></td>
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
			
		<div id="achievementGrid" ></div>
	
		<div id="LblockButton">
			<button type="button" id="insertBtn" >신규</button>
			<button type="button" id="saveBtn" >저장</button>
			<button type="button" id="deleteBtn" >삭제</button>
		</div><!-- LblockButton -->

	</form>
</div><!-- LblockMainBody -->

</body>
</html>
<%@include file="/jsp/system/include/tail.jspf"%>