<%@ page language="java" pageEncoding="utf-8" contentType="text/html; charset=utf-8"%>
<%@include file="/jsp/system/include/doctype.jspf"%>
<html>
<head>
<title>P1 Single Detail</title>
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

		var divisionCodeCombo = new Rui.ui.form.LCombo({
			id: 'divisionCode',
			applyTo: 'divisionCode',
			width: 150
		});
		
		var divisionCodeDataSet = divisionCodeCombo.getDataSet();
		
		divisionCodeCombo.on('changed', function(e) {
			var divisionCode = divisionCodeCombo.getValue();
			if(divisionCode) {
				departmentCodeDataSet.load({
					url: '<c:url value="/standard/ruipattern/common/retrieveDepartmentCodeList.rui" />',
					params: {
						divisionCode: divisionCodeCombo.getValue()
					}
				});
			} else {
				departmentCodeDataSet.clearData();
			}
		});

		var departmentCodeCombo = new Rui.ui.form.LCombo({
			id: 'departmentCode',
			applyTo: 'departmentCode',
			width: 150
		});
		
		var departmentCodeDataSet = departmentCodeCombo.getDataSet();

		var skillCodeCombo = new Rui.ui.form.LCombo({
			id: 'skillCode',
			applyTo: 'skillCode',
			width: 150
		});
		
		var skillCodeDataSet = skillCodeCombo.getDataSet();

		var birthdate = new Rui.ui.form.LDateBox({
			id: 'birthdate',
	        applyTo: 'birthdate'
	    });
		
		new Rui.ui.form.LTextBox({ mask: '999999-9999999', applyTo: 'ssn', width: 150 });
		new Rui.ui.form.LTextBox({ mask: '999-999', applyTo: 'postal', width: 60 });

	    var employeeDataSet = new Rui.data.LJsonDataSet({
	        id:'employeeDataSet',
	        fields:[
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
				{ id: 'departmentCode', validExp: '부서:true' },
				{ id: 'birthdate', validExp: '생년월일:true:date=YYYYMMDD' },
				{ id: 'ssn', validExp: '주민등록번호:false:ssn' },
				{ id: 'sex', validExp: '성별:true' },
				{ id: 'telephone', validExp: '전화번호:true:maxByteLength=20' },
				{ id: 'postal', validExp: '우편번호:true:maxByteLength=20' },
				{ id: 'skillCode', validExp: 'Skill:true' },
				{ id: 'address', validExp: '주소:true:maxByteLength=80' }
			]
	    });

	    var updateEditable = function() {
		    if(employeeDataSet.getCount() < 1) {
			    Rui.select('.LblockDetail input').disable();
			    joblevelCodeCombo.disable();
			    divisionCodeCombo.disable();
			    skillCodeCombo.disable();
			    birthdate.disable();
		    } else {
		    	Rui.select('.LblockDetail input').enable();
			    joblevelCodeCombo.enable();
			    divisionCodeCombo.enable();
			    skillCodeCombo.enable();
			    birthdate.enable();
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
				{ id: 'birthdate', ctrlId: 'birthdate', value: 'value' },
				{ id: 'ssn', ctrlId: 'ssn', value: 'value' },
				{ id: 'sex', ctrlId: 'sex', value: 'value' },
				{ id: 'telephone', ctrlId: 'telephone', value: 'value' },
				{ id: 'address', ctrlId: 'address', value: 'value' },
				{ id: 'postal', ctrlId: 'postal', value: 'value' },
				{ id: 'skillCode', ctrlId: 'skillCode', value: 'value' },
				{ id: 'joblevelCode', ctrlId: 'joblevelCode', value: 'value' },
				{ id: 'divisionCode', ctrlId: 'divisionCode', value: 'value' },
				{ id: 'departmentCode', ctrlId: 'departmentCode', value: 'value' }
            ]
	    });

		var dm = new Rui.data.LDataSetManager();
		
		dm.on('beforeUpdate', function() {
	    	if(vm.validateDataSet(employeeDataSet) == false) {
	    		Rui.alert(Rui.getMessageManager().get('$.base.msg052') + '<br>' + vm.getMessageList().join('<br>') );
	    		return false;
	    	}
		});

		dm.on('success', function() {
			Rui.alert(Rui.getMessageManager().get('$.base.msg100'));
		});

		Rui.get('oSearchNum').on('keydown', function(e){
			if(e.keyCode == 13) {
				btnSearch.click();
			}
		});

	    var btnSearch = new Rui.ui.LButton('btnSearch');
	    btnSearch.on('click', function() {
	    	var params = Rui.util.LDom.getFormValues('LblockSearch');
		    
			dm.loadDataSet({
				dataSets: [ departmentCodeDataSet, employeeDataSet ],
				url: '<c:url value="/standard/ruipattern/pattern1/retrieveEmployee.rui"/>',
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

	    var btnSave = new Rui.ui.LButton('btnSave');
	    btnSave.on('click', function() {
	    	dm.updateDataSet({
		    	dataSets : [ employeeDataSet ],
		    	url: '<c:url value="/standard/ruipattern/pattern1/cudEmployee.rui"/>'
	    	});
	    });
	    
	    Rui.get('oSearchNum').focus();

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
        <h1>RUI Patten P1-1 Single View to Edit</h1>
    </div>

    <div id="LblockPageLocation">
        <ul>
            <li class="Lfirst"><span><a href="#">HOME</a></span></li>
            <li><span><a href="#">P1 Single Pattern</a></span></li>
            <li class="Llast"><span>P1-1 Single View to Edit</span></li>
        </ul>
    </div>
</div>

<div id="LblockBodyMain">
    <form name="employeeForm" id="oEmployeeForm" method="post">
        <div id="LblockSearch">
            <table summary="사원 검색조건" >
                <caption>사원 검색조건</caption>
                <tbody>
                    <tr>
                        <th width="65"><label for="lSerachNum">사원번호</label></th>
                        <td><input type="text" class="Ltext" id="oSearchNum" name="searchNum" value="" size="10" /></td>
                    </tr>
                </tbody>
            </table>
            <button id="btnSearch" class="LBtnSearch">검색</button>
        </div>

        <div id="LblockDetail01" class="LblockDetail">
            <table summary="사원 상세정보">
                <caption>사원 상세정보</caption>
                <tbody>
                    <tr>
                        <th width="100"><label for="num">사원번호</label></th>
                        <td width="150"><input type="text" id="num" /></td>
                        <th width="100"><label for="joblevelCode">직급</label></th>
                        <td><div id="joblevelCode" ></div></td>
                    </tr>
                    <tr>
                        <th><label for="name">사원명</label></th>
                        <td><input type="text" id="name" /></td>
                        <th><label for="divisionCode">부서</label></th>
                        <td><div id="divisionCode" ></div> <div id="departmentCode" ></div></td>
                    </tr>
                    <tr>
                        <th><label for="birthdate">생년월일</label></th>
                        <td><div id="birthdate" ></div></td>
                        <th><label for="sex1">성별</label></th>
                        <td>
							<input type="radio" id="sex1" name="sex" value="M"/><label for="sex1">남</label>
							<input type="radio" id="sex2" name="sex" value="F"/><label for="sex2">여</label>
                        </td>
                    </tr>
                    <tr>
                        <th><label for="ssn">주민등록번호</label></th>
                        <td><input type="text" id="ssn" /></td>
                        <th><label for="telephone">전화번호</label></th>
                        <td><input type="text" id="telephone" /></td>
                    </tr>
                    <tr>
                        <th><label for="postal">우편번호</label></th>
                        <td><input type="text" id="postal" /></td>
                        <th><label for="skillCode">기술등급</label></th>
                        <td><div id="skillCode" ></div></td>
                    </tr>
                    <tr>
                        <th><label for="address">집 주소</label></th>
                        <td colspan="3"><input type="text" id="address" size="90"/></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </form>
</div>

<div id="LblockButton">
	<button id="btnAdd" >신규</button>
	<button id="btnDelete" >삭제</button>
	<button id="btnSave" >저장</button>
</div>
</body>
</html>
<%@include file="/jsp/system/include/tail.jspf"%>