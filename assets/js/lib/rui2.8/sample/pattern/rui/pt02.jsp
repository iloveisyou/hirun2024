<%@ page language="java" pageEncoding="utf-8" contentType="text/html; charset=utf-8"%>
<%@include file="/jsp/system/include/doctype.jspf"%>
<html>
<head>
<title>P2 Multi Detail</title>
<%@include file="/jsp/system/include/head_rui.jspf"%>
<%@include file="/jsp/system/include/rui.jspf"%>

<script type="text/javascript" src="<LTag:webPath kind="rui">/plugins/ui/form/LFileBox.js</LTag:webPath>"></script>
<script type="text/javascript" src="<LTag:webPath kind="rui">/plugins/ui/LFileUploadDialog.js</LTag:webPath>"></script>

<link rel="stylesheet" type="text/css" href="<LTag:webPath kind="rui">/plugins/ui/form/LFileBox.css</LTag:webPath>"/>
<link rel="stylesheet" type="text/css" href="<LTag:webPath kind="rui">/plugins/ui/LFileUploadDialog.css</LTag:webPath>"/>

<script type="text/javascript" src="<LTag:webPath kind="rui">/plugins/ui/grid/LGridView.js</LTag:webPath>"></script>
<script type="text/javascript" src="<LTag:webPath kind="rui">/plugins/ui/grid/LGridPanelExt.js</LTag:webPath>"></script>

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
			joblevelCodeGridCombo.getDataSet().loadData(data[0]);
			departmentCodeGridCombo.getDataSet().loadData(data[1]);
			skillCodeGridCombo.getDataSet().loadData(data[2]);
		});

	    var employeeDataSet = new Rui.data.LJsonDataSet({
	        id: 'employeeDataSet',
	        remainRemoved: true,
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
				{ id: 'skillCodeName' },
				{ id: 'joblevelCode' },
				{ id: 'joblevelCodeName' },
				{ id: 'divisionCode' },
				{ id: 'departmentCode' },
				{ id: 'departmentCodeName' }
	        ]
	    });

	    var vm = new Rui.validate.LValidatorManager({
		    validators: [
				{ id: 'num', validExp: '사원번호:true:number&minLength=5&maxLength=20' },
				{ id: 'joblevelCode', validExp: '직급:true' },
				{ id: 'name', validExp: '사원명:true:maxByteLength=20' },
				{ id: 'divisionCode', validExp: '부서:true' },
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
                { field: 'num', label: '사원번호', editor: new Rui.ui.form.LNumberBox(), renderer: function(val, p, record){
                    p.editable = (record.state == Rui.data.LRecord.STATE_INSERT);
                    return val;
                } },
                { field: 'name', label: '사원명', align: 'center', editor: new Rui.ui.form.LTextBox() },
                { field: 'joblevelCode', label: '직급', align: 'center', editor: joblevelCodeGridCombo },
                { field: 'departmentCode', label: '부서', align: 'center', width: 130, editor: departmentCodeGridCombo },
                { field: 'skillCode', label: '기술등급', align: 'center', editor: skillCodeGridCombo },
                { field: 'sex', label: '성별', align: 'center', width: 98, sortable:false, renderer: function(val) { return (val == 'F') ? '여' : '남'; }, editor: new Rui.ui.form.LRadioGroup({
                    items: [ 
                        { label: '남', value: 'M', checked: true },
                        { label: '여', value: 'F' }
                    ]
                }) },
                { field: 'birthdate' , label: '생년월일', align:'center', editor: new Rui.ui.form.LDateBox(), renderer: Rui.util.LRenderer.dateRenderer() }
            ]
        });

	    var employeeGrid = new Rui.ui.grid.LGridPanel({
            columnModel: columnModel,
            autoWidth: true,
            width: 700,
            height: 350,
            dataSet: employeeDataSet
        });

	    employeeGrid.render('employeeGrid');

	    
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
	    	employeeDataSet.setNameValue(row, 'sex', 'M');
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

	    var btnSave = new Rui.ui.LButton('btnSave');
	    btnSave.on('click', function() {
	    	dm.updateDataSet({
		    	dataSets : [ employeeDataSet ],
		    	url: '<c:url value="/standard/ruipattern/pattern1/cudEmployee.rui"/>'
	    	});
	    });
	    
	    // 엑셀 파일의 컬럼에 해당되는 데로 지정
	    var excelHeader = 'num,name,joblevelCode,departmentCode,skillCode,sex,birthdate,telephone,postal,address';

        var fileUploadDialog = new Rui.ui.LFileUploadDialog({
            url: '<c:url value="/standard/ruipattern/pattern2/uploadExcelList.rui" />',
            params: {
            	excelHeader: excelHeader
            }
        });
        
        fileUploadDialog.render(document.body);

        fileUploadDialog.on('validate', function(){
            var fileBox = this.getFileBox();
            var value = fileBox.getValue();
            var ext = value.substring(value.lastIndexOf('.') + 1);
            if(ext != 'xls' && ext != 'xlsx') {
                alert('엑셀 파일만 업로드가 가능합니다. [xls,xlsx]');
                return false;
            }
            return true;
        });

        fileUploadDialog.on('success', function(e){
            var responseText = e.conn.responseText;

            var data = employeeDataSet.getReadData(e.conn);
            employeeDataSet.loadData(data);
            alert('파일을 업로드 했습니다.');
        });
                
        var btnExcelUpload = new Rui.ui.LButton('btnExcelUpload');
        btnExcelUpload.on('click', function(){
            fileUploadDialog.show();
        });
        
        var btnExcelDownload = new Rui.ui.LButton('btnExcelDownload');
        btnExcelDownload.on('click', function(){
            employeeGrid.saveExcel(encodeURI('pattern2_') + new Date().format('%Y%m%d') + '.xls');
        });
        
        var btnExcelSampleDownload = new Rui.ui.LButton('btnExcelSampleDownload');
        btnExcelSampleDownload.on('click', function(){
        	Rui.get('excelSampleDownload').dom.submit();
        });
        
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
	<h1>RUI Patten P2. Multi Detail</h1>
	</div>
	<div id="LblockPageLocation">
		<ul>
			<li class="Lfirst"><span><a href="/" target="_top">HOME</a></span></li>
			<li class="Llast"><span><a href="#">P2. Multi Detail</a></span></li>
		</ul>
	</div><!-- LblockPageLocation -->   
</div><!-- LblockPageTitle -->

<div id="LblockMainBody">
	<form name="aform" method="post">
		<div id="LblockSearch">
			<table summary="사원 검색조건" >
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
	
	<div id="LblockDetail01" >
		<div id="employeeGrid" ></div>
	</div><!-- LblockDetail01 -->

	<div id="LblockButton">
		<button type="button" id="btnAdd" >행추가</button>
		<button type="button" id="btnDelete" >행삭제</button>
		<button type="button" id="btnUndo" >취소</button>
	</div><!-- LblockButton -->

	<div id="LblockButton">
		<button type="button" id="btnExcelDownload" >엑셀 다운로드</button>
        <button type="button" id="btnExcelSampleDownload" >샘플 양식 다운로드</button>
        <button type="button" id="btnExcelUpload" >엑셀 업로드</button>
		<button type="button" id="btnSave" >저장</button>
	</div><!-- LblockButton -->

</div><!-- LblockMainBody -->
<form id="excelSampleDownload" name="excelSampleDownload" action="<c:url value="/jsp/standard/ruipattern/excel_sample.xls"/>" target="_new">
</form>

</body>
</html>
<%@include file="/jsp/system/include/tail.jspf"%>