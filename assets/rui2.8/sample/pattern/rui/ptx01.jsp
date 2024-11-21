<%@ page language="java" pageEncoding="utf-8" contentType="text/html; charset=utf-8"%>
<%@include file="/jsp/system/include/doctype.jspf"%>
<html>
<head>
<title>RUI Patten Extra</title>
<%@include file="/jsp/system/include/head_rui.jspf"%>
<%@include file="/jsp/system/include/rui.jspf"%>

<style type="text/css" >
#LblockDetail {
	position: relative;
}

#employeeGrid, #selectedGrid, .Lblockbtn {
	display: inline-block;
}

.Lblockbtn {
	height: 300px;
	width: 70px;
	position: absolute;
	top: 130px;
}

#selectedGrid {
	margin-left: 60px;
}
</style>

<script type="text/javascript">
//<![CDATA[
	Rui.onReady(function() {

		var searchJoblevelCodeCombo = new Rui.ui.form.LCombo({
			id: 'searchJoblevelCode',
			applyTo: 'searchJoblevelCode',
			url: '<c:url value="/standard/ruipattern/patternextra1/retrieveJoblevelCodeList.rui" />',
			width: 200
		});

	    var dm = new Rui.data.LDataSetManager();

		dm.on('success', function() {
			Rui.alert(Rui.getMessageManager().get('$.base.msg100'));
		});

	    var employeeDataSet = new Rui.data.LJsonDataSet({
	        id: 'employeeDataSet',
	        fields:[
	            { id: 'num' },
				{ id: 'name' },
				{ id: 'joblevelCodeName' },
				{ id: 'departmentCodeName' }
	        ]
	    });

	    
        var columnModel = new Rui.ui.grid.LColumnModel({
            columns: [
                new Rui.ui.grid.LSelectionColumn(),
                { field: 'name', label: '사원명' },
                { field: 'joblevelCodeName', label: '직급', width: 50 },
                { field: 'departmentCodeName', label: '부서' }
            ]
        });

	    var employeeGrid = new Rui.ui.grid.LGridPanel({
            columnModel: columnModel,
            autoWidth: false,
            width: 350,
            height: 350,
            dataSet: employeeDataSet
        });

	    employeeGrid.render('employeeGrid');

	    var selectedDataSet = new Rui.data.LJsonDataSet({
	        id:'selectedDataSet',
	        fields:[
	            { id: 'num' },
				{ id: 'name' },
				{ id: 'job' },
				{ id: 'department' }
	        ]
	    });

        var selectedColumnModel = new Rui.ui.grid.LColumnModel({
            columns: [
                new Rui.ui.grid.LSelectionColumn(),
                { field: 'name', label: '사원명' },
                { field: 'job', label: '직급', width: 50 },
                { field: 'department', label: '부서' }
            ]
        });

	    var selectedGrid = new Rui.ui.grid.LGridPanel({
            columnModel: selectedColumnModel,
            autoWidth: false,
            width: 340,
            height: 350,
            dataSet: selectedDataSet
        });

	    selectedGrid.render('selectedGrid');
	    
	    var btnSearch = new Rui.ui.LButton('btnSearch');
	    btnSearch.on('click', function() {
	    	var params = Rui.util.LDom.getFormValues('LblockSearch');
	    	
	    	if(!params.searchJoblevelCode) {
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
		    if(employeeDataSet.getMarkedCount() < 1) {
			    Rui.alert('하나 이상 선택하세요.');
			    return;
		    }
	    	for(var i = 0 ; i < employeeDataSet.getCount(); i++) {
	    		if(employeeDataSet.isMarked(i)) {
	    			var newRecord = employeeDataSet.getAt(i).clone();
	    			var row = selectedDataSet.findRow('num', newRecord.get('num'));
	    			if(row < 0)
	    				selectedDataSet.add(newRecord);
	    		}
	    	}
	    });

	    var btnDelete = new Rui.ui.LButton('btnDelete');
	    btnDelete.on('click', function() {
	    	selectedDataSet.removeMarkedRow();
	    });

	    var btnSave = new Rui.ui.LButton('btnSave');
	    btnSave.on('click', function() {
	    	dm.updateDataSet({
		    	dataSets: [ selectedDataSet ],
		    	url: './data/cudEmployee.rui'
		    });
	    });
	});
//]]>
</script>
</head>

<body id="LblockBody">

<div id="LblockPageHeader">
	<div id="LblockPageTitle">
	<h1>RUI Patten 1 : Shuttle</h1>
	</div>
	<div id="LblockPageLocation">
		<ul>
			<li class="Lfirst"><span><a href="/" target="_top">HOME</a></span></li>
			<li><span><a href="#">Extra</a></span></li>
			<li class="Llast"><span><a href="#">1 : Shuttle</a></span></li>
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
						<th><label for="searchJoblevelCode">직급</label></th>
						<td><div id="searchJoblevelCode" ></div></td>
					</tr>
				</tbody>
			</table>
			<button type="button" id="btnSearch" class="LBtnSearch">검색</button>
		</div><%-- LblockSearch --%>

		<div id="LblockDetail" >
			<div id="employeeGrid" ></div>
			<div class="Lblockbtn">
				<button type="button" id="btnAdd" >추가</button><br /><br />
				<button type="button" id="btnDelete" >삭제</button>
			</div><!-- LblockButton -->
			<div id="selectedGrid" ></div>
		</div><!-- LblockDetail -->
	
		<div id="LblockButton" >
			<button type="button" id="btnSave" >저장</button>
		</div><!-- LblockButton -->

	</form>
</div><!-- LblockMainBody -->


</body>
</html>
<%@include file="/jsp/system/include/tail.jspf"%>